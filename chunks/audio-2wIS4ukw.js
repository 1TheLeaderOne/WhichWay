import { whichWayArknight as m } from "./arknight-CNwD5MVC.js";
import { whichWayFile as A } from "./file-CXhVBbUa.js";
import { get as h, lib as w, game as L } from "noname";
import { onArenaReady as M, onConfig as S, onSetDev as T } from "./hooks-BscfO9lD.js";
import { whichWayUtil as v } from "./utill-DpF3UCI4.js";
import { whichWayToast as k } from "./toast-BKImUKDM.js";
import { whichWayAPIOverride as $ } from "./override-B27IQjje.js";
import { defineComponent as R, onMounted as N, onUnmounted as U, openBlock as V, createElementBlock as O, withModifiers as I, createElementVNode as C, createStaticVNode as x, createApp as B } from "vue";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
class K {
  /**
   * 创建webPlay组件
   *
   * 在线配音是**按 (技能, 干员) 一对一**的：同一个共享技能（如阵营技）由不同干员使用时，
   * 应当播放各自干员的 PRTS 配音，而不是共用一份。因此实例由 whichWayAudio 以
   * 二级 Map（技能 → 干员 → 实例）统一持有，不再挂在 lib.skill[skill].whichWayWebPlay 上。
   *
   * @param {string} skill 配音技能名
   * @param {string} char 角色名
   * @param {string[]} [voices] 配音标题，为空时按 (技能, 干员) 取/生成
   * @param {string} [audioBaseName] 本地下载时的文件名前缀（共享技能为「技能_干员」）
   */
  constructor(i, e, t = [], o) {
    this.skill = i, this.char = e, this.audioBaseName = o || i, this.voicesTitle = t.length > 0 ? t.slice() : d.getSkillVoices(i, e);
  }
  /**
   * PRTS路径
   */
  resourceUrl = "https://torappu.prts.wiki/";
  skill;
  char;
  /**
   * 本地下载时使用的文件名前缀（不含序号与扩展名）
   */
  audioBaseName;
  voicesTitle = [];
  get useLocalAudio() {
    return v.config("useLocalAudio") || !1;
  }
  get lang() {
    return d.getSkillLang(this.skill, this.char);
  }
  get voiceUrl() {
    return this.voicesTitle.map((i) => d.compileVoicePath(this.char, this.lang, i));
  }
  get autoDownloadAudio() {
    return v.config("autoDownloadAudio") || !1;
  }
  /**
   * 上一次播放的音频实例。
   *
   * 同一个 (技能, 干员) 再次播放时会先停掉旧的：技能被反复触发时（例如触发技在
   * 玩家选择期间再次结算），否则多段配音会叠在一起，听起来像「配音一直在响」。
   */
  _playing;
  /**
   * 停止这个 (技能, 干员) 上一次播放的配音
   */
  stop() {
    if (this._playing) {
      try {
        this._playing.pause();
      } catch {
      }
      this._playing = void 0;
    }
  }
  play() {
    const i = new Audio(this.voiceUrl.randomGet());
    return i.play(), this._playing = i, v.config("noTipUseWeb") || k.showToast("[驶舰之向] 正在使用网络!"), this.autoDownloadAudio && d.downloadAudio(this.skill, this.char, this.voiceUrl, this.lang), i;
  }
}
class E {
  constructor(i) {
    this.that = i.whichWay;
  }
  that;
  voicesTitle = ["行动失败"];
  get useLocalAudio() {
    return v.config("useLocalAudio") || !1;
  }
  get lang() {
    return d.getCharacterLang(this.that.charId);
  }
  get voiceUrl() {
    return this.voicesTitle.map((i) => d.compileVoicePath(this.that.charId, this.lang, i));
  }
  play() {
    const i = new Audio(this.voiceUrl.randomGet());
    return i.play(), v.config("noTipUseWeb") || k.showToast("[驶舰之向] 正在使用网络!"), i;
  }
}
const j = { class: "audio-download-dialog" }, G = { class: "dialog-content" }, z = /* @__PURE__ */ R({
  __name: "AudioDownloadDialog",
  props: {
    onSelect: { type: Function },
    onClose: { type: Function }
  },
  emits: ["select", "close"],
  setup(f, { emit: i }) {
    const e = f, t = i, o = () => {
      e.onClose ? e.onClose() : t("close");
    }, a = (s) => {
      e.onSelect ? e.onSelect(s === "all") : t("select", s === "all");
    }, n = (s) => {
      s.key === "Escape" && o();
    };
    return N(() => {
      document.addEventListener("keydown", n);
    }), U(() => {
      document.removeEventListener("keydown", n);
    }), (s, r) => (V(), O("div", {
      class: "audio-download-dialog-overlay",
      onClick: I(o, ["self"])
    }, [
      C("div", j, [
        C("div", { class: "dialog-header" }, [
          C("div", {
            class: "dialog-close",
            onClick: o
          }),
          r[2] || (r[2] = C("div", { class: "dialog-title" }, "选择下载模式", -1))
        ]),
        C("div", G, [
          C("div", {
            class: "option-item",
            onClick: r[0] || (r[0] = (u) => a("current"))
          }, [...r[3] || (r[3] = [
            x('<div class="option-icon current-icon" data-v-3dec52d1><div class="icon-text" data-v-3dec52d1>当</div></div><div class="option-info" data-v-3dec52d1><div class="option-title" data-v-3dec52d1>下载当前语言</div><div class="option-desc" data-v-3dec52d1>仅下载当前选择的配音语言</div></div>', 2)
          ])]),
          C("div", {
            class: "option-item",
            onClick: r[1] || (r[1] = (u) => a("all"))
          }, [...r[4] || (r[4] = [
            x('<div class="option-icon all-icon" data-v-3dec52d1><div class="icon-text" data-v-3dec52d1>全</div></div><div class="option-info" data-v-3dec52d1><div class="option-title" data-v-3dec52d1>下载所有可用语言</div><div class="option-desc" data-v-3dec52d1>下载角色的所有配音语言</div></div>', 2)
          ])])
        ])
      ])
    ]));
  }
}), H = /* @__PURE__ */ F(z, [["__scopeId", "data-v-3dec52d1"]]), y = window.whichWaySave.audioConfig, P = ["选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4"];
function b(f) {
  if (typeof f == "string") return [f];
  if (!f) return [];
  const i = [];
  for (const t of [f.name, f.name1, f.name2])
    typeof t == "string" && t && !i.includes(t) && i.push(t);
  const e = h.name(f);
  return typeof e == "string" && e && !i.includes(e) && i.push(e), i;
}
async function W(f) {
  try {
    return await L.promises.getFileList(f);
  } catch {
    return [[], []];
  }
}
class J {
  /**
   * PRTS路径
   */
  resourceUrl = "https://torappu.prts.wiki/";
  /**
   * 全局配置中的默认语言
   * 只开放中、日，因为其他的某些角色不一定有
   */
  vaildDefaultLang = ["CN_MANDARIN", "JP"];
  /** 技能配音最近一次播放时间：`技能|干员` → 时间戳。用于识别同一次技能触发的重复请求 */
  _voicePlayedAt = /* @__PURE__ */ new Map();
  /**
   * 判定本次 `trySkillAudio` 是否为「同一次技能触发的重复请求」。
   *
   * 引擎对**一次**技能触发会调用两次 `game.trySkillAudio`：
   * ① `player.logSkill` 方法里（同步，技能发动瞬间，`directaudio === true`）；
   * ② `logSkill` 事件 content 里（异步，可能隔数秒，`directaudio == null`）。
   * 两次都会真的播出声音：引擎的 `_status.skillaudio` 只在 1 秒内按**文件路径**去重
   * （`game/index.js:2500`），而两次间隔常常超过 1 秒，且扩展语音包每个技能有多条变体
   * （`tryAudio` 每次都随机取一条，路径还不同），于是就成了
   * 「一句播完立刻又随机播另一句」—— 有扩展语音包的干员（如希尔达）才明显。
   *
   * 判定用两次调用的特征差异：**只有 ②（`directaudio == null`）且同一 (技能, 干员)
   * 在最近 30 秒内已经播过**，才判为重复；① 永不拦截 —— 技能真的再次触发时
   * 一定会经 ① 播出声音，因此不会误伤正常触发。
   *
   * @param directaudio 引擎传入的第三个参数（`true` = ①，`null`/`undefined` = ②）
   * @returns 返回 true 表示应跳过本次播放
   */
  isRepeatedSkillAudio(i, e, t) {
    if (t) return !1;
    const o = `${i}|${typeof e == "string" ? e : h.name(e) || ""}`, a = this._voicePlayedAt.get(o);
    return a != null && Date.now() - a < 3e4;
  }
  /** 记录一次技能配音的播放时间（判定通过、确定会播放后调用） */
  markSkillAudioPlayed(i, e) {
    this._voicePlayedAt.set(`${i}|${typeof e == "string" ? e : h.name(e) || ""}`, Date.now());
  }
  /**
   * 交给引擎播放时**只保留一条**候选（优先挑确实存在的那条）。
   *
   * 为什么必须是"一条"：引擎 `game.tryAudio`（`game/index.js:2569-2613`）的机制是
   * ```js
   * const check = () => { if (list.length) return true; if (refresh) { list = audioList.slice(); return true; } return false; };
   * const play  = () => { ...; return game.playAudio({ path: audio, onCanPlay: () => (refresh = true), onError: play }); };
   * ```
   * `refresh` 一旦被 `onCanPlay` 置真就**不会复位**，此后任何一条加载失败的候选都会让
   * `onError → play → check()` 把整表重填并再随机取一条 ⇒ **无限重试**（debug 时能看到
   * `list` 在 `[]` 与单条之间反复横跳、`refresh` 名义上为 false 却仍在重填）。
   * 候选**全部存在**也没用：只要运行期有一条拉不下来（文件正在被构建覆盖、404、解码失败…）就会中招。
   *
   * 只留一条时结果必然是二者之一：
   * - 能播 ⇒ 播完即止（`onended` 只做 remove，不会再产生 error）；
   * - 不能播 ⇒ `onError` 一次后 `list` 已空且 `refresh` 仍为 false ⇒ `check()` 返回 false ⇒ **立即终止**。
   * 因此"一条"是唯一能做到「循环不可能发生」的形态；随机取一条也保持了原本的随机播放体验。
   */
  filterExistingAudio(i) {
    const e = i?.audioList;
    if (!Array.isArray(e) || e.length <= 1) return i;
    let t = e;
    if (this._audioExistCache) {
      const a = e.filter((n) => {
        const s = n?.file;
        return typeof s != "string" ? !1 : this._audioExistCache.has(A.compilePath("audio:" + s.replace(/^ext:WhichWay\/audio\//, "")));
      });
      a.length && (t = a);
    }
    const o = t.randomGet();
    return {
      audioList: [o],
      fileList: [o?.file],
      textList: [o?.text].filter((a) => a != null)
    };
  }
  customVoiceGroup = ["CN_TOPOLECT", "ITA", "GER", "RUS", "FRE", "SPA"];
  /**
   * 配音组件初始化
   */
  async init() {
    M({
      name: "whichWayAudio_init",
      fn: async () => {
        await this.ensureAudioCache(), this.initAllAudio(), await d.override();
      }
    }), S({
      name: "whichWayAudioDefaultConfig_add",
      priority: 777,
      obj: {
        name: "audioDefaultLang",
        options: {
          name: "默认配音",
          intro: "默认配音语言",
          init: v.config("audioConfig")?.default || "CN_MANDARIN",
          item: Object.fromEntries(this.vaildDefaultLang.map((i) => [i, m.getVoiceLangTranslation(i)])),
          onclick(i) {
            y.default = i, v.saveConfig("audioDefaultLang", i), d.refreshAudioIndex();
          }
        }
      }
    }), S({
      name: "whichWayAudioUseLocalAudioConfig_add",
      priority: 776,
      obj: {
        name: "useLocalAudio",
        options: {
          name: "强制使用本地音频",
          intro: "是否强制使用本地音频,开启后不会从PRTS请求音频",
          init: !1
        }
      }
    }), S({
      name: "whichWayAudioNoTipUseWebConfig_add",
      obj: {
        name: "noTipUseWeb",
        options: {
          name: "不提示使用网络",
          intro: "开启后获取PRTS上的配音时不会再提示'正在使用网络'",
          init: !1
        }
      },
      priority: 775
    }), S({
      name: "whichWayAudioAutoDownloadAudio_add",
      obj: {
        name: "autoDownloadAudio",
        options: {
          name: "自动下载缺失音频",
          intro: "开启后播放缺失音频时会自动下载",
          init: !1
        }
      },
      priority: 774
    }), S({
      name: "whichWayAudioDownloadAllMissing_add",
      obj: {
        name: "downloadAllMissingAudio",
        options: {
          name: "<button type='button'>一键下载所有缺失配音</button>",
          intro: "自动检测并下载所有缺失的技能配音和死亡配音",
          clear: !0,
          onclick: async function() {
            const i = await d.showDownloadModeDialog();
            i !== null && await d.downloadAllMissingAudio(void 0, i);
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
  /** 已报警过的「技能|干员」候选对账，避免每次技能触发都刷同样的日志 */
  _auditedKeys = /* @__PURE__ */ new Set();
  /**
   * 扩展语音加载失败时允许的重试次数。
   *
   * 默认为 0：失败即熔断（按需求「静默、只熔断不重试」）。`game.tryAudio` 的重试链是由
   * `game.playAudio` 的 `onError` 驱动的（`onError: play`），把它掐断就不会再有下一次播放尝试。
   * 若日后希望"失败后换一条候选再试一次"，把这个数字改成 1 即可。
   */
  skillAudioErrorRetry = 0;
  /**
   * 语音失败计数：键为**被包装的原始 onError 闭包**。
   *
   * `game.tryAudio` 每次调用都会新建一个 `play` 闭包并把它同时用作 `onError`，因此以闭包为键
   * 恰好等于"以一次重试链为计数"：一次技能触发产生的重试链之间互不干扰，之后正常的再次触发
   * 是全新的闭包、计数从零开始，不会被误熔断。
   */
  _audioErrorCount = /* @__PURE__ */ new WeakMap();
  /** 已打印过失败详情的路径，避免同一路径反复刷屏 */
  _reportedAudioError = /* @__PURE__ */ new Set();
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
    if (!this._audioExistCache)
      return this._audioExistPromise || (this._audioExistPromise = this._buildAudioCache()), this._audioExistPromise;
  }
  /**
   * 建立缓存：建目录 + 扁平扫描。
   *
   * 这里刻意不用 whichWayFile.getFileTree —— 它对每一层目录都会「列一次 + 再递归列一次」，
   * 同一目录被扫描两遍；音频目录的固定结构是 audio/{语言}/{文件} 与 audio/{语言}/die/{文件}，
   * 只有两层，直接分 3 轮并发列出即可（1 + 语言数 + 子目录数 次 IPC）。
   */
  async _buildAudioCache() {
    const i = A.compilePath("audio:"), e = m.getVoiceLangs(), t = /* @__PURE__ */ new Set(), [o] = await W(i), a = e.filter((c) => !o.includes(c));
    a.length && await Promise.all(
      a.map(async (c) => {
        await A.createFolder(`audio:${c}`), await A.createFolder(`audio:${c}/die`);
      })
    );
    const s = o.concat(a).map((c) => i.endsWith("/") ? i + c : `${i}/${c}`), r = await Promise.all(s.map(W)), u = [];
    for (let c = 0; c < s.length; c++) {
      const [p, g] = r[c];
      for (const _ of g) t.add(`${s[c]}/${_}`);
      for (const _ of p) u.push(`${s[c]}/${_}`);
    }
    const l = await Promise.all(u.map(W));
    for (let c = 0; c < u.length; c++)
      for (const p of l[c][1]) t.add(`${u[c]}/${p}`);
    this._audioExistCache = t, console.debug(`[whichWayAudio] 音频缓存就绪：${t.size} 个文件，${s.length} 个语言目录`);
  }
  _addAudioCacheEntry(i) {
    this._audioExistCache?.add(i);
  }
  /** 清空所有派生缓存（语言/引用/索引），下次访问时重建 */
  clearCaches() {
    this._charLangCache.clear(), this._skillLangCache.clear(), this._referCache.clear(), this._suffixSkills.clear(), this._webPlayMap.clear();
  }
  /** 配置变更后重建整套音频索引 */
  async refreshAudioIndex() {
    for (const [i, e] of this._originalAudio) {
      const t = w.skill[i];
      t && (t.audio = e);
    }
    this._originalAudio.clear(), this.clearCaches(), await this.ensureAudioCache(), this.initAllAudio();
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
    const i = [], e = /* @__PURE__ */ new Map();
    for (const t of window.whichWaySave.allCharacters) {
      const o = h.character(t)?.skills;
      if (o?.length) {
        i.push([t, o]);
        for (const a of o) {
          let n = e.get(a);
          n || e.set(a, n = []), n.push(t);
        }
      }
    }
    for (const [t, o] of e) {
      if (o.length < 2 || !this.shouldUseAudioNameSuffix(t, o)) continue;
      const a = w.skill[this.getReferSkill(t)];
      if (a) {
        Array.isArray(a.audioname) || (a.audioname = []);
        for (const n of o)
          a.audioname.includes(n) || a.audioname.push(n);
        this._suffixSkills.add(t);
      }
    }
    for (const [t, o] of i) {
      this.initDieAudio(h.character(t));
      for (const a of o) this.applySkillAudio(a, t);
    }
  }
  /**
   * 共享技能是否改用 `{技能}_{干员}{n}.mp3` 命名。
   *
   * 多个干员共用一份 `{技能}{n}.mp3` 会互相覆盖，所以新下载一律用带干员名的后缀命名；
   * 但若已存在旧命名文件（老版本下载产物），则沿用旧命名以免已下载的配音失效。
   */
  shouldUseAudioNameSuffix(i, e) {
    const t = this.getReferSkill(i);
    for (const o of e)
      if (this._audioExistCache.has(A.compilePath(`audio:${this.getSkillLang(i, o)}/${t}_${o}1.mp3`)))
        return !0;
    for (const o of e)
      if (this._audioExistCache.has(A.compilePath(`audio:${this.getSkillLang(i, o)}/${t}1.mp3`)))
        return !1;
    return !0;
  }
  /**
   * 为「技能 × 干员」这一组合确定音频来源并写入引擎可识别的位置。
   *
   * - 本地文件存在 → `lib.skill[目标技能].audioname2[干员] = "ext:WhichWay/audio/{语言}:{数量}"`
   * - 本地文件缺失 → 登记在线配音实例（每个干员一份）
   */
  applySkillAudio(i, e) {
    if (!window.whichWaySave.hasSkill(i)) return;
    const t = w.skill[i];
    if (!t) return;
    t.logAudio || (t.logAudio = () => t.audio);
    const o = this.getReferSkill(i), a = w.skill[o];
    if (!a || !window.whichWaySave.hasSkill(o)) return;
    const n = this.parseAudioCount(a.audio);
    if (!n) {
      this.clearWebPlay(i, e);
      return;
    }
    n.voices.length && this.cacheSkillVoices(i, e, n.voices);
    const s = this.getSkillLang(i, e), r = this.getAudioBaseName(i, e);
    this._audioExistCache.has(A.compilePath(`audio:${s}/${r}1.mp3`)) ? this.clearWebPlay(i, e) : s !== "CUSTOM" ? this.setWebPlay(i, e, new K(i, e, n.voices, r)) : (this.clearWebPlay(i, e), console.warn(`[whichWayAudio] 角色 ${e} 的技能 ${i} 的语言设置为 ${s}，但音频文件不存在！`));
    const l = this.getExistingAudioCount(r, s);
    typeof t.audio != "string" && this._originalAudio.set(i, t.audio), t.audio = `ext:WhichWay/audio/${s}:${l ? Math.max(1, Math.min(l, n.count)) : n.count}`;
  }
  /**
   * 解析 audio 配置得到音频数量与（可选的）配音标题列表
   */
  parseAudioCount(i) {
    if (!(i === !1 || i === void 0 || i === null)) {
      if (i === !0) return { count: 1, voices: [] };
      if (typeof i == "number") return { count: i, voices: [] };
      if (Array.isArray(i)) return { count: i.length, voices: i.slice() };
      if (typeof i == "string") {
        const e = i.match(/:(\d+)$/);
        if (e) return { count: parseInt(e[1]), voices: [] };
      }
    }
  }
  /**
   * 该技能在该干员名下的本地文件名前缀。
   *
   * 引擎在解析路径时用的是**引用链终点技能名**，并在 audioname 命中该干员时追加 `_干员`，
   * 这里必须与之完全一致，否则存在性判断与下载文件名都会错位。
   */
  getAudioBaseName(i, e) {
    const t = this.getReferSkill(i);
    if (this._suffixSkills.has(i)) return `${t}_${e}`;
    const o = w.skill[t];
    return o && Array.isArray(o.audioname) && o.audioname.includes(e) ? `${t}_${e}` : t;
  }
  /**
   * 取 (技能, 干员) 的在线配音标题；数字型 audio 从中随机抽取并持久化，保证每次选中一致
   */
  getSkillVoices(i, e) {
    const t = `${i}_${e}`, o = this._voiceCache.get(t);
    if (o) return o;
    const a = y.onlineVoicesTitle[t];
    if (Array.isArray(a) && a.length)
      return this._voiceCache.set(t, a), a;
    const n = this.parseAudioCount(w.skill[this.getReferSkill(i)]?.audio);
    let s;
    if (n?.voices.length)
      s = n.voices.slice();
    else {
      const r = Math.max(1, Math.min(n?.count ?? 2, P.length));
      s = P.randomGets(r);
    }
    return this.cacheSkillVoices(i, e, s);
  }
  /** 固化 (技能, 干员) 的在线配音标题 */
  cacheSkillVoices(i, e, t) {
    const o = `${i}_${e}`;
    return this._voiceCache.set(o, t), y.onlineVoicesTitle[o] = t, t;
  }
  // ============ 在线配音表 ============
  getWebPlay(i, e) {
    return this._webPlayMap.get(i)?.get(e);
  }
  setWebPlay(i, e, t) {
    let o = this._webPlayMap.get(i);
    o || this._webPlayMap.set(i, o = /* @__PURE__ */ new Map()), o.set(e, t);
  }
  clearWebPlay(i, e) {
    this._webPlayMap.get(i)?.delete(e);
  }
  /**
   * 按玩家查找在线配音实例：依次尝试 name/name1/name2/显示名，再回退到引用技能
   */
  findWebPlay(i, e) {
    const t = b(e), o = this.getReferSkill(i);
    for (const a of i === o ? [i] : [i, o])
      for (const n of t) {
        const s = this.getWebPlay(a, n);
        if (s) return s;
      }
  }
  /**
   * 取 audioname2 中命中该玩家的配置值。
   *
   * 引擎原生 audioname2 用于"按角色覆盖 audio"，命中后通常为以下几种：
   * - 干员代码写的「借用别的技能配音」（`info.audioname2[player.name] = "bianyimrfz"`）→
   *   需要转交那个技能处理，否则在线配音会播错人；
   * - 其它（如引用核心技能）→ 交回引擎。
   *
   * 注意：**本地配音的路径不再走 audioname2**（会与"技能别名"语义冲突，
   * 并会让千幻聆音等扩展崩溃）——本地路径由 `info.audio` 覆写 + `info.audioname`
   * 数组按角色追加后缀共同完成。
   */
  getAudioname2Value(i, e) {
    const t = i?.audioname2;
    if (t)
      for (const o of b(e)) {
        const a = t[o];
        if (typeof a == "string") return a;
      }
  }
  // ============ 引擎 API 覆盖 ============
  async override() {
    await $.appendHook("game.trySkillAudio", {
      //⚠ 这里**必须是同步函数**：appendHook 的同步包装层用 `beforeResult === false` 判断是否短路
      //（override/index.js:116），而 async 函数返回的是 Promise，`return false` 永远拦不住引擎。
      //一旦拦不住，引擎就会继续执行 trySkillAudio → get.Audio.skill → game.tryAudio，
      //而 tryAudio 在「列表里既有能播的文件、又有缺失的文件」时会无限重试
      //（能播的那条触发 onCanPlay 置 refresh，之后每条缺失文件的 onError 都会把列表重新填满
      //再随机取一条，见 game/index.js:2577-2602），听感就是「一句播完又随机播另一句、永不停歇」。
      before: function(e, t, o, a, n, s) {
        if (!w.config.background_speak)
          return !1;
        if (d.isRepeatedSkillAudio(e, t, o))
          return console.log(`[驶舰之向] 已拦截重复的技能配音：${e} / ${typeof t == "string" ? t : h.name(t)}`), !1;
        d.markSkillAudioPlayed(e, t);
        const r = d.getReferSkill(e), u = n || w.skill[r], l = n || w.skill[e];
        if (!u || !l || l.direct && !o || w.skill.global.includes(e) && !l.forceaudio)
          return !1;
        const c = d.getAudioname2Value(l, t);
        if (c !== void 0)
          return c !== e && !c.startsWith("ext:") && window.whichWaySave.hasSkill(c) ? (L.trySkillAudio(c, t, o, !0, void 0, s), !1) : void 0;
        const p = d.findWebPlay(e, t);
        if (p && !p.useLocalAudio)
          return p.play(), !1;
      }
    }), await $.appendHook("game.tryDieAudio", {
      before: function(e) {
        const t = typeof e == "string" ? e : e ? h.name(e) : void 0;
        if (!t) return;
        const o = h.character(t);
        if (o?.whichWay?.dieAudio && !v.config("useLocalAudio"))
          return o.whichWay.dieAudio.play(), !1;
      }
    });
    const i = Object.freeze({ audioList: [], fileList: [], textList: [] });
    await $.appendHook("get.Audio.skill", {
      after(e, t) {
        if (!e || typeof t?.skill != "string" || !t?.player) return e;
        try {
          const o = d.findWebPlay(t.skill, t.player);
          if (!o || o.useLocalAudio)
            return d.auditEngineAudioList(t.skill, t.player, e), d.filterExistingAudio(e);
        } catch {
          return e;
        }
        return i;
      }
    }), await $.appendHook("get.Audio.die", {
      after(e, t) {
        if (!e || !t?.player) return e;
        try {
          const o = typeof t.player == "string" ? t.player : h.name(t.player);
          if (!o) return e;
          if (!h.character(o)?.whichWay?.dieAudio || v.config("useLocalAudio")) return d.filterExistingAudio(e);
        } catch {
          return e;
        }
        return i;
      }
    }), await $.appendHook("game.playAudio", {
      //必须是同步函数：appendHook 的同步包装层用 `beforeResult === false` 判短路、用数组替换参数
      before: function(...e) {
        const t = e.length === 1 ? e[0] : void 0;
        if (!(!t || typeof t != "object" || Array.isArray(t)) && d.isOwnAudioPath(t.path))
          return [{ ...t, onError: d.wrapSkillAudioError(t.path, t.onError) }];
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
  async downloadAudio(i, e, t, o, a = !1) {
    if (t === void 0) throw new Error("url is undefined");
    o === void 0 && (o = this.getCharacterLang(e));
    const n = A.compilePath(`audio:${o}${a ? "/die" : ""}/`), s = a ? e : this.getAudioBaseName(i, e);
    for (let r = 0; r < t.length; r++) {
      const u = `${a ? s : `${s}${r + 1}`}.mp3`;
      await A.download(t[r], n, u), this._addAudioCacheEntry(`${n}${u}`), k.showToast(`下载${u}成功`), k.removeToastById(`whichWayAudioDownLoad_${u}`);
    }
    a ? this.initDieAudio(h.character(e)) : await this.initAudio(i, e);
  }
  /**
   * 获取所有缺失配音的信息列表
   * @param {boolean} [allLangs=false] 是否获取所有可用语言的配音，而不仅仅是当前语言
   * @returns {Promise<Array<{type: 'skill'|'die', skill?: string, char: string, urls: string[], lang: string}>>}
   */
  async getMissingAudioList(i = !1) {
    await this.ensureAudioCache();
    const e = [];
    for (const t of window.whichWaySave.allCharacters) {
      const o = h.character(t);
      if (!o?.skills) continue;
      const a = m.getAviableLangs(t) || [], n = this.getCharacterLang(t), s = i ? a.filter((r) => r !== "CUSTOM") : [n];
      if (s.length) {
        for (const r of o.skills) {
          if (!window.whichWaySave.hasSkill(r)) continue;
          const u = this.getAudioBaseName(r, t);
          for (const l of s) {
            if (l === "CUSTOM" || !i && this._audioExistCache.has(A.compilePath(`audio:${l}/${u}1.mp3`)))
              continue;
            const c = this.getSkillVoices(r, t);
            c.length && e.push({
              type: "skill",
              skill: r,
              char: t,
              urls: c.map((p) => this.compileVoicePath(t, l, p)),
              lang: l
            });
          }
        }
        for (const r of s)
          r !== "CUSTOM" && (!i && this.exsitAudioSync(null, t, !0) || e.push({
            type: "die",
            char: t,
            urls: [this.compileVoicePath(t, r, "行动失败")],
            lang: r
          }));
      }
    }
    return e;
  }
  /**
   * 显示下载模式选择对话框
   * @returns {Promise<boolean|null>} 用户选择：true=下载所有语言，false=仅下载当前语言，null=取消
   */
  async showDownloadModeDialog() {
    return new Promise((i) => {
      const e = document.createElement("div");
      document.body.appendChild(e);
      const t = B(H, {
        onSelect: (o) => {
          t.unmount(), e.remove(), i(o);
        },
        onClose: () => {
          t.unmount(), e.remove(), i(null);
        }
      });
      t.mount(e);
    });
  }
  /**
   * 一键下载所有缺失配音
   * @param {Function} [onProgress] 进度回调函数 (current: number, total: number, info: string) => void
   * @param {boolean} [allLangs] 是否下载所有语言，true=所有语言，false=仅当前语言
   */
  async downloadAllMissingAudio(i, e) {
    const t = await this.getMissingAudioList(e ?? !1);
    if (t.length === 0) {
      k.showToast("没有发现缺失的配音文件", 3e3, "topRight", "whichWayAudioDownloadAll");
      return;
    }
    const o = e ? "所有可用语言" : this.getCharacterLang(t[0]?.char);
    k.showToast(`发现 ${t.length} 个缺失配音（${o}），开始下载...`, 5e3, "topRight", "whichWayAudioDownloadAll");
    let a = 0, n = 0, s = 0;
    const r = 4;
    let u = 0;
    const l = Array.from({ length: Math.min(r, t.length) }, async () => {
      for (; ; ) {
        const p = u++;
        if (p >= t.length) return;
        const g = t[p], _ = ++s;
        i && i(_, t.length, `正在下载 ${g.char}${g.skill ? ` - ${g.skill}` : " 死亡配音"} [${g.lang}]`);
        try {
          await this.downloadAudio(g.skill || "", g.char, g.urls, g.lang, g.type === "die"), a++;
        } catch (D) {
          n++, console.warn(`下载失败: ${g.char}${g.skill ? ` - ${g.skill}` : " 死亡配音"}`, D);
        }
      }
    });
    await Promise.all(l);
    const c = `下载完成！成功 ${a} 个${n > 0 ? `，失败 ${n} 个` : ""}`;
    k.showToast(c, 5e3, "topRight", "whichWayAudioDownloadAll");
  }
  /**
   * 获取技能的配音语言
   * @param {string} skill 技能名
   * @param {string} char 角色名
   * @returns {string} 技能的配音语言
   */
  getSkillLang(i, e) {
    if (e === void 0 || i === void 0) throw new Error("char or skill is undefined");
    const t = `${i}|${e}`, o = this._skillLangCache.get(t);
    if (o !== void 0) return o;
    let a;
    if (!this.inArknightChars(e))
      a = "CUSTOM";
    else {
      const n = this.getCharacterLang(e) || y.default, s = y.custom[e];
      s ? a = this.expandSkills(s.skills).includes(i) ? s.lang : n : a = n;
    }
    return this._skillLangCache.set(t, a), a;
  }
  /** inArknightChars 的记忆化包装（内部是数组 includes，逐个调用是 O(n²)） */
  inArknightChars(i) {
    let e = this._inArkCache.get(i);
    return e === void 0 && (e = m.inArknightChars(i), this._inArkCache.set(i, e)), e;
  }
  /**
   * 播放技能音频(无视trySkillAudio的限制)
   */
  playSkillAudio(i, e) {
    const t = this.findWebPlay(i, e);
    if (t) return t.play();
    const o = h.Audio.skill({ skill: i, player: e }).fileList;
    return L.tryAudio({ audioList: o });
  }
  /**
   * 扩展技能组
   */
  expandSkills(i) {
    const e = [...i];
    for (const t of i) {
      const o = w.skill[t];
      if (!o) continue;
      const a = o.audio;
      if (window.whichWaySave.hasSkill(a) && e.push(this.getReferSkill(a)), o.derivation) {
        const n = Array.isArray(o.derivation) ? o.derivation : [o.derivation];
        for (const s of n)
          window.whichWaySave.hasSkill(s) && e.push(this.getReferSkill(s));
      }
    }
    return e;
  }
  /**
   * 获取角色的配音语言
   * @param {string} char 角色名
   * @param {boolean} [translate=false] 是否翻译
   * @returns {string} 角色的配音语言
   */
  getCharacterLang(i, e = !1) {
    if (i === void 0) throw new Error("char is undefined");
    let t = this._charLangCache.get(i);
    if (t === void 0) {
      const o = y.custom[i];
      if (o)
        t = o.lang;
      else {
        const a = this.getCharacterAvailableLang(i);
        a.length ? a.includes(y.default) ? t = y.default : t = a[0] : t = "CUSTOM";
      }
      this._charLangCache.set(i, t);
    }
    return e ? m.getVoiceLangTranslation(t) : t;
  }
  /**
   * 获取角色可用的配音语言
   * @param {string} char 角色名
   * @returns {string[]} 角色可用的配音语言
   */
  getCharacterAvailableLang(i) {
    return h.character(i)?.whichWay?.arknight?.avaiableLangs || [];
  }
  /**
   * 技能的音频是否存在（同步版本，需先 ensureAudioCache）
   * @param {string} skill 技能名,如果是死亡配音此参数没有意义
   * @param {string} char 角色名
   * @param {boolean} [dieAudio=false] 是否是死亡音频
   */
  exsitAudioSync(i, e, t = !1) {
    if (!this._audioExistCache) return !1;
    if (t) {
      const n = this.getCharacterLang(e);
      return this._audioExistCache.has(A.compilePath(`audio:${n}/die/${e}.mp3`));
    }
    const o = this.getSkillLang(i, e), a = this.getAudioBaseName(i, e);
    return this._audioExistCache.has(A.compilePath(`audio:${o}/${a}1.mp3`));
  }
  /**
   * 对账「引擎解析出的候选音频」与「本地实际存在的文件」，**部分缺失**时在控制台报警。
   *
   * ⛔ **只对本扩展语音生效**：本体技能（如 `skill/wfyuyan1.mp3`）与其它扩展的音频不在扩展的
   * 存在性缓存（`_audioExistCache`）里，让它们参与对账只会被误报成"全部缺失"。
   * 因此这里先用 `toAudioCacheKey()`（与 `game.playAudio` 熔断钩子共用同一套归一化）
   * 筛出属于本扩展的候选；一条都筛不出来就直接返回，不做任何对账与打印。
   *
   * 排查价值：引擎的 `game.tryAudio` 只在候选列表里**既有能加载的、又有加载失败的**时才会无限重试
   * （能加载的那条触发 `onCanPlay` 把 `refresh` 置真，之后每一次 `onError` 都会把列表重新填满再随机取一条，
   * 见 `game/index.js:2577-2602`）；全部缺失只会静默失败、全部存在只会播一条，都不会循环。
   * 因此"是否部分缺失"就是判断某位干员会不会中招的唯一条件，而这里会把**具体哪一条缺失**打出来。
   *
   * @param result 引擎 `get.Audio.skill` 解析出的 Audio 实例（含 audioList/fileList/textList）
   */
  auditEngineAudioList(i, e, t) {
    if (!this._audioExistCache) return;
    const o = t?.fileList;
    if (!Array.isArray(o) || !o.length) return;
    const a = [];
    for (const l of o) {
      const c = this.toAudioCacheKey(l);
      c && a.push({ file: l, key: c });
    }
    if (!a.length) return;
    const n = a.filter((l) => !this._audioExistCache.has(A.compilePath(l.key))).map((l) => l.file);
    if (!n.length) return;
    const s = typeof e == "string" ? e : h.name(e) || "", r = `${i}|${s}`;
    if (this._auditedKeys.has(r)) return;
    this._auditedKeys.add(r);
    const u = n.length < a.length;
    console.warn(
      `[whichWayAudio] ${s} 的技能 ${i}：本扩展的 ${a.length} 条候选语音里有 ${n.length} 条在本地找不到，${u ? "属于「部分缺失」⇒ 会让引擎 tryAudio 无限重试（配音一句播完又播一句），已由 game.playAudio 的 onError 熔断拦截" : "属于「全部缺失」⇒ 只会静默失败一次，不会循环"}。候选与缺失项如下：`,
      { 候选: a.map((l) => l.file), 缺失: n }
    );
  }
  /**
   * 该 (技能, 干员) 本地**连续存在**的音频文件数（从 1 开始数到第一个缺失为止）。
   *
   * 用于写入 `info.audio` 的数量：引擎按这个数量生成候选路径 `{前缀}1.mp3 ... {前缀}N.mp3`，
   * 只要其中混入缺失文件就会触发 `game.tryAudio` 的无限重试，所以数量必须与磁盘实际文件数一致。
   */
  getExistingAudioCount(i, e) {
    if (!this._audioExistCache) return 0;
    let t = 0;
    for (; t < 32; ) {
      const o = `${i}${t + 1}.mp3`;
      if (!this._audioExistCache.has(A.compilePath(`audio:${e}/${o}`))) break;
      t++;
    }
    return t;
  }
  /**
   * 剥离各种前缀，把音频路径归一化成扩展内的相对路径（`WhichWay/...`）。
   *
   * 扩展语音在不同入口的写法不同，必须都能归一化到同一形态：
   * - 技能语音：`ext:WhichWay/audio/{语言}/{技能}{序号}.mp3`（引擎会把 `ext:` 换成 `extension/`）
   * - 阵亡语音：`whichWayFile.compilePath("audio:...")` 产物，形如 `${lib.assetURL}extension/WhichWay/audio/...`
   * - 其它扩展改写后可能出现 `../extension/WhichWay/audio/...`
   *
   * @returns 归一化后的路径；入参不是字符串或为空时返回 undefined
   */
  normalizeOwnPath(i) {
    if (typeof i != "string" || !i) return;
    let e = i;
    e.startsWith("../") && (e = e.slice(3));
    const t = w.assetURL || "";
    return t && e.startsWith(t) && (e = e.slice(t.length)), e.startsWith("ext:") && (e = e.slice(4)), e.startsWith("extension/") && (e = e.slice(10)), e;
  }
  /**
   * 把引擎解析出的音频路径映射成扩展存在性缓存（`_audioExistCache`）使用的键 `audio:{语言}/{文件名}`。
   *
   * 对账（`auditEngineAudioList`）靠它判断"这条候选是不是扩展语音"，
   * 与 `isOwnAudioPath` 共用同一段归一化，避免两处判定漂移造成误报/漏判。
   *
   * @returns 扩展缓存键；不是扩展语音（例如本体技能的 `skill/xxx1.mp3`）时返回 undefined
   */
  toAudioCacheKey(i) {
    const e = this.normalizeOwnPath(i);
    if (!(!e || !e.startsWith("WhichWay/audio/")))
      return "audio:" + e.slice(15);
  }
  /**
   * 归一化判断：这条播放请求是否属于「扩展自己的音频」。
   *
   * 熔断钩子（`game.playAudio` 的 before）用它决定是否接管，因此判定要比 `toAudioCacheKey`
   * 更宽一点：归一化后只要落在 `WhichWay/` 下即算扩展路径（不限于 `audio/` 子目录）。
   */
  isOwnAudioPath(i) {
    return this.normalizeOwnPath(i)?.startsWith("WhichWay/") ?? !1;
  }
  /**
   * 给 `game.playAudio` 的 `onError` 套一层熔断，切断 `game.tryAudio` 的无限重试。
   *
   * 背景：`game.tryAudio`（`game/index.js:2569-2613`）里
   * ```js
   * const check = () => { if (list.length) return true; if (refresh) { list = audioList.slice(); return true; } return false; };
   * const play  = () => { ...; return game.playAudio({ path: audio, onCanPlay: () => (refresh = true), onError: play }); };
   * ```
   * `refresh` 只由 `onCanPlay` 置真且**永不复位**：一旦成功加载过一次，之后任何一次 `onError`
   * 都会让 `play()` 把候选列表重新填满再随机播一条 ⇒ **无限循环**（表现为"一句播完又随机播另一句"）。
   * 候选是否只有一条都无所谓——单条反复失败同样会循环。**唯一出口就是这里**。
   *
   * @param path 本次播放的路径（用于诊断）
   * @param onError 引擎传入的错误回调（`tryAudio` 里就是重试函数 `play`）
   */
  wrapSkillAudioError(i, e) {
    const t = typeof e == "function" ? e : void 0;
    return (...o) => {
      if (this.reportSkillAudioError(i, o[0]), !t) return;
      const a = (this._audioErrorCount.get(t) || 0) + 1;
      this._audioErrorCount.set(t, a), !(a > this.skillAudioErrorRetry) && t(...o);
    };
  }
  /**
   * 打印扩展语音加载失败的详情（每个路径只打印一次），用于定位"为什么加载失败"。
   *
   * `game.playAudio` 的 `audio.onerror` 会先 `audio.remove()` 再回调，但事件对象仍在内存中，
   * 因此 `evt.target` 上的 `error/currentSrc/readyState/networkState` 都可以读取。
   */
  reportSkillAudioError(i, e) {
    if (this._reportedAudioError.has(i)) return;
    this._reportedAudioError.add(i);
    const t = e?.target, o = t?.error?.code, a = {
      1: "请求被中断(ABORTED)",
      2: "网络/请求失败(NETWORK)",
      3: "解码失败(DECODE)",
      4: "源不支持(SRC_NOT_SUPPORTED)"
    };
    console.warn(
      `[whichWayAudio] 扩展语音加载失败，本次触发将静默且不再重试：${i}
  · 实际请求地址：${t?.currentSrc || t?.src || "(未知)"}
  · MediaError.code：${o ?? "(无)"} ${o != null && a[o] || ""}
  · readyState=${t?.readyState ?? "?"} networkState=${t?.networkState ?? "?"}`
    );
  }
  /**
   * 技能的音频是否存在
   * @param {string} skill 技能名,如果是死亡配音此参数没有意义
   * @param {string} char 角色名
   * @param {boolean} [dieAudio=false] 是否是死亡音频
   * @returns {Promise<boolean>} 音频是否存在
   */
  async exsitAudio(i, e, t = !1) {
    return await this.ensureAudioCache(), this.exsitAudioSync(i, e, t);
  }
  async setCustomAudio(i, e) {
    const t = h.character(i)?.skills || [];
    y.custom[i] ? (y.custom[i].lang = e, y.custom[i].skills = t) : y.custom[i] = { lang: e, skills: t }, v.saveConfig("audioConfig", y), this._charLangCache.delete(i);
    for (const o of [...this._skillLangCache.keys()])
      o.endsWith(`|${i}`) && this._skillLangCache.delete(o);
    await this.ensureAudioCache();
    for (const o of t)
      this.applySkillAudio(o, i);
    this.initDieAudio(h.character(i));
  }
  /**
   * 初始化单个技能的音频（下载完成 / 切换配音语言后调用）
   */
  async initAudio(i, e) {
    await this.ensureAudioCache(), this.applySkillAudio(i, e);
  }
  /**
   * 初始化角色死亡音频
   * @param {WhichWayCharacter} char 角色
   */
  initDieAudio(i) {
    if (!i?.whichWay?.charId) return;
    const e = i.whichWay.charId;
    i.dieAudios = [`ext:WhichWay/audio/${this.getCharacterLang(e)}/die/${e}.mp3`];
    const t = !!i.whichWay.dieAudio && !(i.whichWay.dieAudio instanceof E);
    this.exsitAudioSync(null, e, !0) ? i.whichWay.dieAudio && !t && (i.whichWay.dieAudio = void 0) : !t && m.inArknightChars(e) && (i.whichWay.dieAudio = new E(i));
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
  getReferSkill(i) {
    const e = this._referCache.get(i);
    if (e !== void 0) return e;
    const t = this._resolveReferSkill(i, /* @__PURE__ */ new Set());
    return this._referCache.set(i, t), t;
  }
  _resolveReferSkill(i, e, t) {
    if (e.has(i))
      return console.warn(`Circular reference detected at skill: ${i}`), i;
    e.add(i);
    const o = w.skill[i];
    if (!o || !o.audio) return t || i;
    const a = o.audio;
    return typeof a == "string" && !/^\d+$/.test(a) ? this._resolveReferSkill(a, e, i) : i;
  }
  /**
   * 拼接成音频路径
   * @param {string} uid 角色UID
   * @param {string} lang 配音语言
   * @param {string} voiceTitle 音频标题
   * @returns {string} 音频路径
   */
  compileVoicePath(i, e, t) {
    return i = m.shcema.transfer(i, "character", "whichWayUID") || i, e === "CN_TOPOLECT" ? i = `${i}_cn_topolect` : e === "ITA" && (i = `${i}_ita`), t = this.transferVoiceTitle(t), e = this.transferLang(e), `${this.resourceUrl}assets/audio/${e}/${i}/${t}.wav`;
  }
  /**
   * 将配音语言转化为符合PRTS规范的格式
   * @param {string} lang 配音
   * @returns {string} 符合PRTS规范的格式
   */
  transferLang(i) {
    return m.getVoiceLangs().includes(i) ? i === "JP" || i === "LINKAGE" ? "voice" : this.customVoiceGroup.includes(i) ? "voice_custom" : i === "CN_MANDARIN" ? "voice_cn" : `voice_${i.toLowerCase()}` : i;
  }
  /**
   * 将音频标题转化为符合PRTS规范的格式
   * @param {string} voiceTitle 音频标题
   * @returns {string} 符合PRTS规范的格式
   */
  transferVoiceTitle(i) {
    if (m.shcema.audio.index.includes(i)) return i;
    let e = m.shcema.transfer(i, "audio", "index");
    if (e === void 0) throw new Error(`voiceTitle ${i} is not exist`);
    return `cn_${e}`;
  }
}
const d = new J();
await d.init();
T({
  name: "whichWayAudio_dev",
  fn() {
    window.whichWayAudio = d;
  }
});
window.whichWay.register("audio", d);
export {
  d as whichWayAudio
};
