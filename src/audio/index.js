import { whichWayArknight } from "../arknight/index.js";
import { whichWayFile } from "../file.js";
import { lib, get, game } from "noname";
import { onArenaReady, onConfig, onSetDev } from "../hooks/index.js";
import { whichWayUtil } from "../utill.js";
import { whichWayWebPlay } from "./webPlay.js";
import { whichWayWebPlayDie } from "./webPlayDie.js";
import { whichWayAPIOverride } from "../override/index.js";
import { whichWayToast } from "../toast/index.js";
import { createApp } from "vue";
import AudioDownloadDialog from "./AudioDownloadDialog.vue.js";
const audioSave = window.whichWaySave.audioConfig;
const DEFAULT_VOICE_TITLES = ["选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4"];
function resolvePlayerNames(player) {
  if (typeof player === "string") return [player];
  if (!player) return [];
  const list = [];
  for (const name of [player.name, player.name1, player.name2]) {
    if (typeof name === "string" && name && !list.includes(name)) list.push(name);
  }
  const shown = get.name(player);
  if (typeof shown === "string" && shown && !list.includes(shown)) list.push(shown);
  return list;
}
async function listDirSafe(dir) {
  try {
    return await game.promises.getFileList(dir);
  } catch (e) {
    return [[], []];
  }
}
class WhichWayAudio {
  /**
   * PRTS路径
   */
  resourceUrl = `https://torappu.prts.wiki/`;
  /**
   * 全局配置中的默认语言
   * 只开放中、日，因为其他的某些角色不一定有
   */
  vaildDefaultLang = ["CN_MANDARIN", "JP"];
  customVoiceGroup = ["CN_TOPOLECT", "ITA", "GER", "RUS", "FRE", "SPA"];
  /**
   * 配音组件初始化
   */
  async init() {
    onArenaReady({
      name: "whichWayAudio_init",
      fn: async () => {
        await this.ensureAudioCache();
        this.initAllAudio();
        await whichWayAudio.override();
      }
    });
    onConfig({
      name: "whichWayAudioDefaultConfig_add",
      priority: 777,
      obj: {
        name: "audioDefaultLang",
        options: {
          name: "默认配音",
          intro: "默认配音语言",
          init: whichWayUtil.config("audioConfig")?.default || "CN_MANDARIN",
          item: Object.fromEntries(this.vaildDefaultLang.map((i) => [i, whichWayArknight.getVoiceLangTranslation(i)])),
          onclick(item) {
            audioSave.default = item;
            whichWayUtil.saveConfig("audioDefaultLang", item);
            whichWayAudio.refreshAudioIndex();
          }
        }
      }
    });
    onConfig({
      name: "whichWayAudioUseLocalAudioConfig_add",
      priority: 776,
      obj: {
        name: "useLocalAudio",
        options: {
          name: "强制使用本地音频",
          intro: "是否强制使用本地音频,开启后不会从PRTS请求音频",
          init: false
        }
      }
    });
    onConfig({
      name: "whichWayAudioNoTipUseWebConfig_add",
      obj: {
        name: "noTipUseWeb",
        options: {
          name: "不提示使用网络",
          intro: "开启后获取PRTS上的配音时不会再提示'正在使用网络'",
          init: false
        }
      },
      priority: 775
    });
    onConfig({
      name: "whichWayAudioAutoDownloadAudio_add",
      obj: {
        name: "autoDownloadAudio",
        options: {
          name: "自动下载缺失音频",
          intro: "开启后播放缺失音频时会自动下载",
          init: false
        }
      },
      priority: 774
    });
    onConfig({
      name: "whichWayAudioDownloadAllMissing_add",
      obj: {
        name: "downloadAllMissingAudio",
        options: {
          name: "<button type='button'>一键下载所有缺失配音</button>",
          intro: "自动检测并下载所有缺失的技能配音和死亡配音",
          clear: true,
          onclick: async function() {
            const allLangs = await whichWayAudio.showDownloadModeDialog();
            if (allLangs !== null) {
              await whichWayAudio.downloadAllMissingAudio(void 0, allLangs);
            }
          }
        }
      },
      priority: 860
    });
  }
  // ============ 缓存 / 索引 ============
  /**
   * 已存在的音频文件路径集合。
   *
   * 原先每次 exsitAudio 都发一趟 checkFile IPC，开局 262 个干员 × 各自技能会串行检查上千次；
   * 现在改为首次访问时一次性扁平扫描（3 轮并发），之后退化为 O(1) 的 Set 查找。
   */
  _audioExistCache = null;
  _audioExistPromise = null;
  /** 干员 → 是否属于明日方舟干员（inArknightChars 内部是数组 includes，需缓存） */
  _inArkCache = /* @__PURE__ */ new Map();
  /** 干员 → 配音语言 */
  _charLangCache = /* @__PURE__ */ new Map();
  /** `技能|干员` → 配音语言 */
  _skillLangCache = /* @__PURE__ */ new Map();
  /** 技能 → 引用链终点技能 */
  _referCache = /* @__PURE__ */ new Map();
  /** `技能_干员` → 在线配音标题 */
  _voiceCache = /* @__PURE__ */ new Map();
  /** 启用了 audioname 后缀命名的共享技能 */
  _suffixSkills = /* @__PURE__ */ new Set();
  /** 技能 → (干员 → 在线配音实例) */
  _webPlayMap = /* @__PURE__ */ new Map();
  /** 技能 → 被音频系统改写前的原始 audio 配置（用于切换语言后还原） */
  _originalAudio = /* @__PURE__ */ new Map();
  /**
   * 确保音频目录存在并建立存在性缓存（幂等，并发出一次）
   */
  async ensureAudioCache() {
    if (this._audioExistCache) return;
    if (!this._audioExistPromise) {
      this._audioExistPromise = this._buildAudioCache();
    }
    return this._audioExistPromise;
  }
  /**
   * 建立缓存：建目录 + 扁平扫描。
   *
   * 这里刻意不用 whichWayFile.getFileTree —— 它对每一层目录都会「列一次 + 再递归列一次」，
   * 同一目录被扫描两遍；音频目录的固定结构是 audio/{语言}/{文件} 与 audio/{语言}/die/{文件}，
   * 只有两层，直接分 3 轮并发列出即可（1 + 语言数 + 子目录数 次 IPC）。
   */
  async _buildAudioCache() {
    const root = whichWayFile.compilePath("audio:");
    const allLangs = whichWayArknight.getVoiceLangs();
    const cache = /* @__PURE__ */ new Set();
    const [existingLangs] = await listDirSafe(root);
    const missingLangs = allLangs.filter((lang) => !existingLangs.includes(lang));
    if (missingLangs.length) {
      await Promise.all(
        missingLangs.map(async (lang) => {
          await whichWayFile.createFolder(`audio:${lang}`);
          await whichWayFile.createFolder(`audio:${lang}/die`);
        })
      );
    }
    const langNames = existingLangs.concat(missingLangs);
    const langPaths = langNames.map((lang) => root.endsWith("/") ? root + lang : `${root}/${lang}`);
    const langLists = await Promise.all(langPaths.map(listDirSafe));
    const subPaths = [];
    for (let i = 0; i < langPaths.length; i++) {
      const [subFolders, files] = langLists[i];
      for (const file of files) cache.add(`${langPaths[i]}/${file}`);
      for (const sub of subFolders) subPaths.push(`${langPaths[i]}/${sub}`);
    }
    const subLists = await Promise.all(subPaths.map(listDirSafe));
    for (let i = 0; i < subPaths.length; i++) {
      for (const file of subLists[i][1]) cache.add(`${subPaths[i]}/${file}`);
    }
    this._audioExistCache = cache;
    console.debug(`[whichWayAudio] 音频缓存就绪：${cache.size} 个文件，${langPaths.length} 个语言目录`);
  }
  _addAudioCacheEntry(fullPath) {
    this._audioExistCache?.add(fullPath);
  }
  /** 清空所有派生缓存（语言/引用/索引），下次访问时重建 */
  clearCaches() {
    this._charLangCache.clear();
    this._skillLangCache.clear();
    this._referCache.clear();
    this._suffixSkills.clear();
    this._webPlayMap.clear();
  }
  /** 配置变更后重建整套音频索引 */
  async refreshAudioIndex() {
    for (const [skill, audio] of this._originalAudio) {
      const info = lib.skill[skill];
      if (info) info.audio = audio;
    }
    this._originalAudio.clear();
    this.clearCaches();
    await this.ensureAudioCache();
    this.initAllAudio();
  }
  // ============ 索引构建 ============
  /**
   * 一次性为所有干员建立音频索引（全程同步，无 IPC）。
   *
   * 原先的写法有两类问题：
   * 1. 对 262 个干员 × 各自技能逐次 `await exsitAudio`，即使命中缓存也有上千次微任务调度；
   * 2. `lib.skill[skill].audio` 被每个干员反复覆盖（共享技能最终只保留最后一个干员的路径），
   *    在线配音也只挂在技能上的单例 whichWayWebPlay，导致不同干员共用同一份配音。
   *
   * 现在改为：
   * 1. 先汇总「技能 → 拥有该技能的干员」，为共享技能自动登记 audioname（引擎会据此解析
   *    `{技能}_{干员}{n}.mp3`）；
   * 2. 再按 (技能, 干员) 把结果写到 lib.skill[目标技能].audioname2 —— 这是引擎原生的
   *    「按角色覆盖 audio」机制（见 docs/audio-guide.md），各干员互不干扰；
   * 3. 本地缺失的登记到「技能 → 干员」二级在线配音表，每个干员播自己的 PRTS 配音。
   */
  initAllAudio() {
    if (!this._audioExistCache) return;
    const characters = [];
    const owners = /* @__PURE__ */ new Map();
    for (const name of window.whichWaySave.allCharacters) {
      const skills = get.character(name)?.skills;
      if (!skills?.length) continue;
      characters.push([name, skills]);
      for (const skill of skills) {
        let list = owners.get(skill);
        if (!list) owners.set(skill, list = []);
        list.push(name);
      }
    }
    for (const [skill, list] of owners) {
      if (list.length < 2) continue;
      if (!this.shouldUseAudioNameSuffix(skill, list)) continue;
      const info = lib.skill[this.getReferSkill(skill)];
      if (!info) continue;
      if (!Array.isArray(info.audioname)) info.audioname = [];
      for (const char of list) {
        if (!info.audioname.includes(char)) info.audioname.push(char);
      }
      this._suffixSkills.add(skill);
    }
    for (const [name, skills] of characters) {
      this.initDieAudio(get.character(name));
      for (const skill of skills) this.applySkillAudio(skill, name);
    }
  }
  /**
   * 共享技能是否改用 `{技能}_{干员}{n}.mp3` 命名。
   *
   * 多个干员共用一份 `{技能}{n}.mp3` 会互相覆盖，所以新下载一律用带干员名的后缀命名；
   * 但若已存在旧命名文件（老版本下载产物），则沿用旧命名以免已下载的配音失效。
   */
  shouldUseAudioNameSuffix(skill, owners) {
    const target = this.getReferSkill(skill);
    for (const char of owners) {
      if (this._audioExistCache.has(whichWayFile.compilePath(`audio:${this.getSkillLang(skill, char)}/${target}_${char}1.mp3`))) {
        return true;
      }
    }
    for (const char of owners) {
      if (this._audioExistCache.has(whichWayFile.compilePath(`audio:${this.getSkillLang(skill, char)}/${target}1.mp3`))) {
        return false;
      }
    }
    return true;
  }
  /**
   * 为「技能 × 干员」这一组合确定音频来源并写入引擎可识别的位置。
   *
   * - 本地文件存在 → `lib.skill[目标技能].audioname2[干员] = "ext:WhichWay/audio/{语言}:{数量}"`
   * - 本地文件缺失 → 登记在线配音实例（每个干员一份）
   */
  applySkillAudio(skill, char) {
    if (!window.whichWaySave.allSkills.includes(skill)) return;
    const info = lib.skill[skill];
    if (!info) return;
    if (!info.logAudio) info.logAudio = () => info.audio;
    const target = this.getReferSkill(skill);
    const targetInfo = lib.skill[target];
    if (!targetInfo || !window.whichWaySave.allSkills.includes(target)) return;
    const parsed = this.parseAudioCount(targetInfo.audio);
    if (!parsed) {
      this.clearWebPlay(skill, char);
      return;
    }
    if (parsed.voices.length) this.cacheSkillVoices(skill, char, parsed.voices);
    const lang = this.getSkillLang(skill, char);
    const base = this.getAudioBaseName(skill, char);
    const exists = this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang}/${base}1.mp3`));
    if (exists) {
      if (!targetInfo.audioname2) targetInfo.audioname2 = {};
      targetInfo.audioname2[char] = `ext:WhichWay/audio/${lang}:${parsed.count}`;
      this.clearWebPlay(skill, char);
    } else if (lang !== "CUSTOM") {
      this.setWebPlay(skill, char, new whichWayWebPlay(skill, char, parsed.voices, base));
      if (targetInfo.audioname2) delete targetInfo.audioname2[char];
    } else {
      this.clearWebPlay(skill, char);
      if (targetInfo.audioname2) delete targetInfo.audioname2[char];
      console.warn(`[whichWayAudio] 角色 ${char} 的技能 ${skill} 的语言设置为 ${lang}，但音频文件不存在！`);
    }
    if (typeof info.audio !== "string") {
      this._originalAudio.set(skill, info.audio);
      info.audio = `ext:WhichWay/audio/${lang}:${parsed.count}`;
    }
  }
  /**
   * 解析 audio 配置得到音频数量与（可选的）配音标题列表
   */
  parseAudioCount(audio) {
    if (audio === false || audio === void 0 || audio === null) return void 0;
    if (audio === true) return { count: 1, voices: [] };
    if (typeof audio === "number") return { count: audio, voices: [] };
    if (Array.isArray(audio)) return { count: audio.length, voices: audio.slice() };
    if (typeof audio === "string") {
      const matched = audio.match(/:(\d+)$/);
      if (matched) return { count: parseInt(matched[1]), voices: [] };
    }
    return void 0;
  }
  /**
   * 该技能在该干员名下的本地文件名前缀。
   *
   * 引擎在解析路径时用的是**引用链终点技能名**，并在 audioname 命中该干员时追加 `_干员`，
   * 这里必须与之完全一致，否则存在性判断与下载文件名都会错位。
   */
  getAudioBaseName(skill, char) {
    const target = this.getReferSkill(skill);
    if (this._suffixSkills.has(skill)) return `${target}_${char}`;
    const info = lib.skill[target];
    if (info && Array.isArray(info.audioname) && info.audioname.includes(char)) return `${target}_${char}`;
    return target;
  }
  /**
   * 取 (技能, 干员) 的在线配音标题；数字型 audio 从中随机抽取并持久化，保证每次选中一致
   */
  getSkillVoices(skill, char) {
    const key = `${skill}_${char}`;
    const cached = this._voiceCache.get(key);
    if (cached) return cached;
    const stored = audioSave.onlineVoicesTitle[key];
    if (Array.isArray(stored) && stored.length) {
      this._voiceCache.set(key, stored);
      return stored;
    }
    const parsed = this.parseAudioCount(lib.skill[this.getReferSkill(skill)]?.audio);
    let titles;
    if (parsed?.voices.length) {
      titles = parsed.voices.slice();
    } else {
      const count = Math.max(1, Math.min(parsed?.count ?? 2, DEFAULT_VOICE_TITLES.length));
      titles = DEFAULT_VOICE_TITLES.randomGets(count);
    }
    return this.cacheSkillVoices(skill, char, titles);
  }
  /** 固化 (技能, 干员) 的在线配音标题 */
  cacheSkillVoices(skill, char, titles) {
    const key = `${skill}_${char}`;
    this._voiceCache.set(key, titles);
    audioSave.onlineVoicesTitle[key] = titles;
    return titles;
  }
  // ============ 在线配音表 ============
  getWebPlay(skill, char) {
    return this._webPlayMap.get(skill)?.get(char);
  }
  setWebPlay(skill, char, instance) {
    let map = this._webPlayMap.get(skill);
    if (!map) this._webPlayMap.set(skill, map = /* @__PURE__ */ new Map());
    map.set(char, instance);
  }
  clearWebPlay(skill, char) {
    this._webPlayMap.get(skill)?.delete(char);
  }
  /**
   * 按玩家查找在线配音实例：依次尝试 name/name1/name2/显示名，再回退到引用技能
   */
  findWebPlay(skill, player) {
    const names = resolvePlayerNames(player);
    const target = this.getReferSkill(skill);
    for (const skillName of skill === target ? [skill] : [skill, target]) {
      for (const name of names) {
        const found = this.getWebPlay(skillName, name);
        if (found) return found;
      }
    }
    return void 0;
  }
  /**
   * 取 audioname2 中命中该玩家的配置值。
   *
   * 引擎原生支持 audioname2（按角色覆盖 audio，见 docs/audio-guide.md），命中后有以下几种值：
   * - 音频系统写入的本地路径（`ext:WhichWay/audio/{语言}:{数量}`）→ 交回引擎解析即可；
   * - 干员代码写的「借用别的技能配音」（`info.audioname2[player.name] = "bianyimrfz"`）→
   *   需要转交那个技能处理，否则在线配音会播错人；
   * - 其它（如引用核心技能）→ 交回引擎。
   */
  getAudioname2Value(info, player) {
    const map = info?.audioname2;
    if (!map) return void 0;
    for (const name of resolvePlayerNames(player)) {
      const value = map[name];
      if (typeof value === "string") return value;
    }
    return void 0;
  }
  // ============ 引擎 API 覆盖 ============
  async override() {
    await whichWayAPIOverride.appendHook("game.trySkillAudio", {
      before: async function(skill, player, directaudio, nobroadcast, skillInfo, args) {
        if (!lib.config.background_speak) {
          return false;
        }
        const trueSkill = whichWayAudio.getReferSkill(skill);
        const info = skillInfo || lib.skill[trueSkill];
        const infox = skillInfo || lib.skill[skill];
        if (!info || !infox) {
          return false;
        }
        if (infox.direct && !directaudio) {
          return false;
        }
        if (lib.skill.global.includes(skill) && !infox.forceaudio) {
          return false;
        }
        const audioname2 = whichWayAudio.getAudioname2Value(infox, player);
        if (audioname2 !== void 0) {
          if (audioname2 !== skill && !audioname2.startsWith("ext:") && window.whichWaySave.allSkills.includes(audioname2)) {
            await game.trySkillAudio(audioname2, player, directaudio, true, void 0, args);
            return false;
          }
          return;
        }
        const web = whichWayAudio.findWebPlay(skill, player);
        if (!web) return;
        if (web.useLocalAudio) return;
        web.play();
        return false;
      }
    });
    await whichWayAPIOverride.appendHook("game.tryDieAudio", {
      before: function(player) {
        const name = typeof player === "string" ? player : player ? get.name(player) : void 0;
        if (!name) return;
        const info = get.character(name);
        if (!info?.whichWay?.dieAudio) return;
        if (whichWayUtil.config("useLocalAudio")) return;
        info.whichWay.dieAudio.play();
        return false;
      }
    });
    const onlineAudioStub = Object.freeze({ audioList: [], fileList: [], textList: [] });
    await whichWayAPIOverride.appendHook("get.Audio.skill", {
      after(result, options) {
        if (!result || typeof options?.skill !== "string" || !options?.player) return result;
        try {
          const web = whichWayAudio.findWebPlay(options.skill, options.player);
          if (!web || web.useLocalAudio) return result;
        } catch (e) {
          return result;
        }
        return onlineAudioStub;
      }
    });
    await whichWayAPIOverride.appendHook("get.Audio.die", {
      after(result, options) {
        if (!result || !options?.player) return result;
        try {
          const name = typeof options.player === "string" ? options.player : get.name(options.player);
          if (!name) return result;
          const char = get.character(name);
          if (!char?.whichWay?.dieAudio) return result;
          if (whichWayUtil.config("useLocalAudio")) return result;
        } catch (e) {
          return result;
        }
        return onlineAudioStub;
      }
    });
  }
  // ============ 对外 API ============
  /**
   * 检查音频文件夹是否存在，不存在则创建
   *
   * 已并入 ensureAudioCache：建目录与扫描在同一次扁平遍历中完成，不再各自发起 IPC。
   */
  async checkAudioFolder() {
    await this.ensureAudioCache();
  }
  /**
   * 下载音频
   * @param {string} skill 技能名
   * @param {string} char 角色名
   * @param {string[]} urls 音频地址
   * @param {string} [lang] 配音语言
   * @param {boolean} [dieAudio=false] 是否是死亡音频
   */
  async downloadAudio(skill, char, urls, lang, dieAudio = false) {
    if (urls === void 0) throw new Error("url is undefined");
    if (lang === void 0) {
      lang = this.getCharacterLang(char);
    }
    const path = whichWayFile.compilePath(`audio:${lang}${dieAudio ? "/die" : ""}/`);
    const base = dieAudio ? char : this.getAudioBaseName(skill, char);
    for (let i = 0; i < urls.length; i++) {
      const file = `${dieAudio ? base : `${base}${i + 1}`}.mp3`;
      await whichWayFile.download(urls[i], path, file);
      this._addAudioCacheEntry(`${path}${file}`);
      whichWayToast.showToast(`下载${file}成功`);
      whichWayToast.removeToastById(`whichWayAudioDownLoad_${file}`);
    }
    if (!dieAudio) await this.initAudio(skill, char);
    else this.initDieAudio(get.character(char));
  }
  /**
   * 获取所有缺失配音的信息列表
   * @param {boolean} [allLangs=false] 是否获取所有可用语言的配音，而不仅仅是当前语言
   * @returns {Promise<Array<{type: 'skill'|'die', skill?: string, char: string, urls: string[], lang: string}>>}
   */
  async getMissingAudioList(allLangs = false) {
    await this.ensureAudioCache();
    const tasks = [];
    for (const char of window.whichWaySave.allCharacters) {
      const charData = get.character(char);
      if (!charData?.skills) continue;
      const avaiableLangs = whichWayArknight.getAviableLangs(char) || [];
      const defaultLang = this.getCharacterLang(char);
      const langsToCheck = allLangs ? avaiableLangs.filter((l) => l !== "CUSTOM") : [defaultLang];
      if (!langsToCheck.length) continue;
      for (const skill of charData.skills) {
        if (!window.whichWaySave.allSkills.includes(skill)) continue;
        const base = this.getAudioBaseName(skill, char);
        for (const lang of langsToCheck) {
          if (lang === "CUSTOM") continue;
          if (!allLangs && this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang}/${base}1.mp3`))) {
            continue;
          }
          const voiceTitles = this.getSkillVoices(skill, char);
          if (!voiceTitles.length) continue;
          tasks.push({
            type: "skill",
            skill,
            char,
            urls: voiceTitles.map((title) => this.compileVoicePath(char, lang, title)),
            lang
          });
        }
      }
      for (const lang of langsToCheck) {
        if (lang === "CUSTOM") continue;
        if (!allLangs && this.exsitAudioSync(null, char, true)) continue;
        tasks.push({
          type: "die",
          char,
          urls: [this.compileVoicePath(char, lang, "行动失败")],
          lang
        });
      }
    }
    return tasks;
  }
  /**
   * 显示下载模式选择对话框
   * @returns {Promise<boolean|null>} 用户选择：true=下载所有语言，false=仅下载当前语言，null=取消
   */
  async showDownloadModeDialog() {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      const app = createApp(AudioDownloadDialog, {
        onSelect: (mode) => {
          app.unmount();
          container.remove();
          resolve(mode);
        },
        onClose: () => {
          app.unmount();
          container.remove();
          resolve(null);
        }
      });
      app.mount(container);
    });
  }
  /**
   * 一键下载所有缺失配音
   * @param {Function} [onProgress] 进度回调函数 (current: number, total: number, info: string) => void
   * @param {boolean} [allLangs] 是否下载所有语言，true=所有语言，false=仅当前语言
   */
  async downloadAllMissingAudio(onProgress, allLangs) {
    const tasks = await this.getMissingAudioList(allLangs ?? false);
    if (tasks.length === 0) {
      whichWayToast.showToast("没有发现缺失的配音文件", 3e3, "topRight", "whichWayAudioDownloadAll");
      return;
    }
    const langLabel = allLangs ? "所有可用语言" : this.getCharacterLang(tasks[0]?.char);
    whichWayToast.showToast(`发现 ${tasks.length} 个缺失配音（${langLabel}），开始下载...`, 5e3, "topRight", "whichWayAudioDownloadAll");
    let successCount = 0;
    let failCount = 0;
    let finished = 0;
    const concurrency = 4;
    let cursor = 0;
    const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
      while (true) {
        const index = cursor++;
        if (index >= tasks.length) return;
        const task = tasks[index];
        const current = ++finished;
        if (onProgress) {
          onProgress(current, tasks.length, `正在下载 ${task.char}${task.skill ? ` - ${task.skill}` : " 死亡配音"} [${task.lang}]`);
        }
        try {
          await this.downloadAudio(task.skill || "", task.char, task.urls, task.lang, task.type === "die");
          successCount++;
        } catch (e) {
          failCount++;
          console.warn(`下载失败: ${task.char}${task.skill ? ` - ${task.skill}` : " 死亡配音"}`, e);
        }
      }
    });
    await Promise.all(workers);
    const message = `下载完成！成功 ${successCount} 个${failCount > 0 ? `，失败 ${failCount} 个` : ""}`;
    whichWayToast.showToast(message, 5e3, "topRight", "whichWayAudioDownloadAll");
  }
  /**
   * 获取技能的配音语言
   * @param {string} skill 技能名
   * @param {string} char 角色名
   * @returns {string} 技能的配音语言
   */
  getSkillLang(skill, char) {
    if (char === void 0 || skill === void 0) throw new Error("char or skill is undefined");
    const key = `${skill}|${char}`;
    const cached = this._skillLangCache.get(key);
    if (cached !== void 0) return cached;
    let result;
    if (!this.inArknightChars(char)) {
      result = "CUSTOM";
    } else {
      const defaultLang = this.getCharacterLang(char) || audioSave.default;
      const custom = audioSave.custom[char];
      if (!custom) result = defaultLang;
      else result = this.expandSkills(custom.skills).includes(skill) ? custom.lang : defaultLang;
    }
    this._skillLangCache.set(key, result);
    return result;
  }
  /** inArknightChars 的记忆化包装（内部是数组 includes，逐个调用是 O(n²)） */
  inArknightChars(char) {
    let cached = this._inArkCache.get(char);
    if (cached === void 0) {
      cached = whichWayArknight.inArknightChars(char);
      this._inArkCache.set(char, cached);
    }
    return cached;
  }
  /**
   * 播放技能音频(无视trySkillAudio的限制)
   */
  playSkillAudio(skill, name) {
    const web = this.findWebPlay(skill, name);
    if (web) return web.play();
    const audioList = get.Audio.skill({ skill, player: name }).fileList;
    return game.tryAudio({ audioList });
  }
  /**
   * 扩展技能组
   */
  expandSkills(skills) {
    const result = [...skills];
    for (const skill of skills) {
      const info = lib.skill[skill];
      if (!info) continue;
      const audio = info.audio;
      if (window.whichWaySave.allSkills.includes(audio)) {
        result.push(this.getReferSkill(audio));
      }
      if (info.derivation) {
        const extraSkills = Array.isArray(info.derivation) ? info.derivation : [info.derivation];
        for (const extraSkill of extraSkills) {
          if (window.whichWaySave.allSkills.includes(extraSkill)) {
            result.push(this.getReferSkill(extraSkill));
          }
        }
      }
    }
    return result;
  }
  /**
   * 获取角色的配音语言
   * @param {string} char 角色名
   * @param {boolean} [translate=false] 是否翻译
   * @returns {string} 角色的配音语言
   */
  getCharacterLang(char, translate = false) {
    if (char === void 0) throw new Error("char is undefined");
    let lang = this._charLangCache.get(char);
    if (lang === void 0) {
      const custom = audioSave.custom[char];
      if (custom) {
        lang = custom.lang;
      } else {
        const langs = this.getCharacterAvailableLang(char);
        if (!langs.length) lang = "CUSTOM";
        else if (langs.includes(audioSave.default)) lang = audioSave.default;
        else lang = langs[0];
      }
      this._charLangCache.set(char, lang);
    }
    return translate ? whichWayArknight.getVoiceLangTranslation(lang) : lang;
  }
  /**
   * 获取角色可用的配音语言
   * @param {string} char 角色名
   * @returns {string[]} 角色可用的配音语言
   */
  getCharacterAvailableLang(char) {
    return get.character(char)?.whichWay?.arknight?.avaiableLangs || [];
  }
  /**
   * 技能的音频是否存在（同步版本，需先 ensureAudioCache）
   * @param {string} skill 技能名,如果是死亡配音此参数没有意义
   * @param {string} char 角色名
   * @param {boolean} [dieAudio=false] 是否是死亡音频
   */
  exsitAudioSync(skill, char, dieAudio = false) {
    if (!this._audioExistCache) return false;
    if (dieAudio) {
      const lang2 = this.getCharacterLang(char);
      return this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang2}/die/${char}.mp3`));
    }
    const lang = this.getSkillLang(skill, char);
    const base = this.getAudioBaseName(skill, char);
    return this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang}/${base}1.mp3`));
  }
  /**
   * 技能的音频是否存在
   * @param {string} skill 技能名,如果是死亡配音此参数没有意义
   * @param {string} char 角色名
   * @param {boolean} [dieAudio=false] 是否是死亡音频
   * @returns {Promise<boolean>} 音频是否存在
   */
  async exsitAudio(skill, char, dieAudio = false) {
    await this.ensureAudioCache();
    return this.exsitAudioSync(skill, char, dieAudio);
  }
  async setCustomAudio(char, lang) {
    const skills = get.character(char)?.skills || [];
    if (!audioSave.custom[char]) audioSave.custom[char] = { lang, skills };
    else {
      audioSave.custom[char].lang = lang;
      audioSave.custom[char].skills = skills;
    }
    whichWayUtil.saveConfig("audioConfig", audioSave);
    this._charLangCache.delete(char);
    for (const key of [...this._skillLangCache.keys()]) {
      if (key.endsWith(`|${char}`)) this._skillLangCache.delete(key);
    }
    await this.ensureAudioCache();
    for (const skill of skills) {
      this.applySkillAudio(skill, char);
    }
    this.initDieAudio(get.character(char));
  }
  /**
   * 初始化单个技能的音频（下载完成 / 切换配音语言后调用）
   */
  async initAudio(skill, char) {
    await this.ensureAudioCache();
    this.applySkillAudio(skill, char);
  }
  /**
   * 初始化角色死亡音频
   * @param {WhichWayCharacter} char 角色
   */
  initDieAudio(char) {
    if (!char?.whichWay?.charId) return;
    const name = char.whichWay.charId;
    char.dieAudios = [whichWayFile.compilePath(`audio:${this.getCharacterLang(name)}/die/${name}.mp3`)];
    if (!this.exsitAudioSync(null, name, true)) {
      if (whichWayArknight.inArknightChars(name)) char.whichWay.dieAudio = new whichWayWebPlayDie(char);
    } else if (char.whichWay.dieAudio) {
      char.whichWay.dieAudio = void 0;
    }
  }
  /**
   * 查找引用技能的最终目标技能
   *
   * 该方法用于递归查找技能引用链的最终目标技能。当一个技能的 audio 属性引用了另一个技能时，
   * 会继续查找被引用技能的 audio 属性，直到找到不为字符串类型或为纯数字字符串的技能为止。
   *
   * 该方法会检测并处理循环引用情况，如果发现循环引用会输出警告并返回原始技能名。
   * 结果会被记忆化，避免 262 个干员 × 各自技能重复走同一条引用链。
   *
   * @param {string} name - 起始技能名称
   * @returns {string} 最终目标技能名称
   */
  getReferSkill(name) {
    const cached = this._referCache.get(name);
    if (cached !== void 0) return cached;
    const result = this._resolveReferSkill(name, /* @__PURE__ */ new Set());
    this._referCache.set(name, result);
    return result;
  }
  _resolveReferSkill(name, visited, lastName) {
    if (visited.has(name)) {
      console.warn(`Circular reference detected at skill: ${name}`);
      return name;
    }
    visited.add(name);
    const info = lib.skill[name];
    if (!info || !info.audio) return lastName || name;
    const audio = info.audio;
    if (typeof audio === "string" && !/^\d+$/.test(audio)) {
      return this._resolveReferSkill(audio, visited, name);
    }
    return name;
  }
  /**
   * 拼接成音频路径
   * @param {string} uid 角色UID
   * @param {string} lang 配音语言
   * @param {string} voiceTitle 音频标题
   * @returns {string} 音频路径
   */
  compileVoicePath(uid, lang, voiceTitle) {
    uid = whichWayArknight.shcema.transfer(uid, "character", "whichWayUID") || uid;
    if (lang === "CN_TOPOLECT") {
      uid = `${uid}_cn_topolect`;
    }
    voiceTitle = this.transferVoiceTitle(voiceTitle);
    lang = this.transferLang(lang);
    return `${this.resourceUrl}assets/audio/${lang}/${uid}/${voiceTitle}.wav`;
  }
  /**
   * 将配音语言转化为符合PRTS规范的格式
   * @param {string} lang 配音
   * @returns {string} 符合PRTS规范的格式
   */
  transferLang(lang) {
    if (whichWayArknight.getVoiceLangs().includes(lang)) {
      if (lang === "JP" || lang === "LINKAGE") return "voice";
      else if (this.customVoiceGroup.includes(lang)) {
        return "voice_custom";
      } else if (lang === "CN_MANDARIN") {
        return "voice_cn";
      } else {
        return `voice_${lang.toLowerCase()}`;
      }
    }
    return lang;
  }
  /**
   * 将音频标题转化为符合PRTS规范的格式
   * @param {string} voiceTitle 音频标题
   * @returns {string} 符合PRTS规范的格式
   */
  transferVoiceTitle(voiceTitle) {
    if (whichWayArknight.shcema.audio.index.includes(voiceTitle)) return voiceTitle;
    let result = whichWayArknight.shcema.transfer(voiceTitle, "audio", "index");
    if (result === void 0) throw new Error(`voiceTitle ${voiceTitle} is not exist`);
    return `cn_${result}`;
  }
}
const whichWayAudio = new WhichWayAudio();
await whichWayAudio.init();
onSetDev({
  name: "whichWayAudio_dev",
  fn() {
    window.whichWayAudio = whichWayAudio;
  }
});
window.whichWay.register("audio", whichWayAudio);
export {
  whichWayAudio
};
