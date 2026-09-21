import { whichWayFile as w } from "./file-CXhVBbUa.js";
import { onInit as U, onConfig as C, onSetDev as b } from "./hooks-BscfO9lD.js";
import { get as f } from "noname";
import { whichWayUtil as u } from "./utill-DpF3UCI4.js";
import { w as W } from "./version-shared-BUx8npJy.js";
import { whichWayToast as k } from "./toast-BKImUKDM.js";
class I {
  audio = {
    index: ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "032", "033", "034", "036", "037", "038", "042", "043", "044"],
    name: ["任命助理", "交谈1", "交谈2", "交谈3", "晋升后交谈1", "晋升后交谈2", "信赖提升后交谈1", "信赖提升后交谈2", "信赖提升后交谈3", "闲置", "干员报到", "观看作战记录", "精英化晋升1", "精英化晋升2", "编入队伍", "任命队长", "行动出发", "行动开始", "选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4", "完成高难行动", "3星结束行动", "非3星结束行动", "行动失败", "进驻设施", "戳一下", "信赖触摸", "标题", "新年祝福", "问候", "生日", "周年庆典"]
  };
  character = {
    arknightUID: {},
    whichWayUID: {},
    chineseName: new _()
  };
  group = {
    whichWay: ["yimrfz", "luomrfz", "laimrfz", "xiemrfz", "xumrfz", "bamrfz", "liemrfz", "qimrfz", "kamrfz", "gemrfz", "longmrfz", "weimrfz", "lamrfz", "wumrfz", "samrfz", "othermrfz", "suimrfz", "limrfz", "ximrfz", "hongmrfz", "dongmrfz", "yanmrfz", "lymrfz", "shimrfz", "mimrfz", "leimrfz", "a_groupmrfz", "shenmrfz", "haimrfz", "samimrfz", "bomrfz", "luoElitemrfz"],
    arknight: ["iberia", "rhodes", "leithanien", "karlan", "siracusa", "babel", "abyssal", "penguin", "kazimierz", "columbia", "lgd", "victoria", "laterano", "ursus", "sargon", "rainbow", "sui", "lee", "siesta", "pinus", "higashi", "yan", "rhine", "followers", "minos", "rim", "abyssal", "tara", "egir", "sami", "bolivar", "elite"]
  };
  /**
   * 进行映射
   * @param { string } str - 需要映射的字符串
   * @param { "audio" | "character" | "group"} type - 映射目标,即str是属于哪个模块的
   * @param { string } [subtype] -子类别,不选则自动识别
   * @returns { string | ArksCamps | undefined } 映射后的字符串
   */
  transfer(a, t, e) {
    if (typeof t != "string" || e !== void 0 && typeof e != "string") throw new Error("参数类型错误！");
    if (t === "audio") {
      if (e) {
        const n = e === "index" ? "name" : "index", h = this[t][n], c = this[t][e], i = h.indexOf(a);
        return i !== -1 ? c[i] : void 0;
      }
      return u.bidirectionalLookup(this[t].index, this[t].name, a);
    } else if (t === "group") {
      if (e) {
        const n = e === "whichWay" ? "arknight" : "whichWay", h = this[t][n], c = this[t][e], i = h.indexOf(a);
        return i !== -1 ? c[i] : void 0;
      }
      return u.bidirectionalLookup(this[t].whichWay, this[t].arknight, a);
    } else if (t === "character") {
      const n = this.character;
      return e ? e === "chineseName" ? n.chineseName.get(a) : n[e][a] : n.whichWayUID[a] || n.arknightUID[a] || n.chineseName.get(a);
    }
  }
}
class _ {
  arkUID = {};
  whichWayUID = {};
  /**
   * 获取角色UID对应的中文
   * @param { string } value
   *
   * @returns { string | undefined }
   */
  get(a) {
    return this.arkUID[a] || this.whichWayUID[a];
  }
  /**
   * 设置角色UID对应的中文
   * @param {[string, string]} keys - [明日方舟UID, WhichWayUID]
   * @param {string} value - 中文名
   */
  set([a, t], e) {
    const n = this.arkUID[a] || this.arkUID[t] || this.whichWayUID[a] || this.whichWayUID[t];
    n && console.warn(`[WhichWayArkChineseName] 翻译覆盖: 角色 ${a},${t} 已存在中文翻译 ${n}`), this.arkUID[a] = e, this.whichWayUID[t] = e;
  }
}
const A = new I();
class z {
  normal = {
    爱布拉娜: "死芒",
    隐德莱希: "隐德来希",
    奇尔查克: "齐尔查克",
    紫野遥: "遥",
    逻格斯: "逻各斯",
    行著: "行箸",
    mon3tr: "Mon3tr",
    ASH: "灰烬",
    弗里斯腾: "Friston-3",
    太刀侠火龙S黑角: "火龙S黑角",
    云青萍: "录武官",
    玛露希尔: "玛露西尔",
    Christine: "Miss.Christine"
    // 守望者凯尔希:"凯尔希·思衡托",
  };
  amiya = {
    char_1037_amiya3: "医疗阿米娅",
    char_1001_amiya2: "近卫阿米娅"
  };
  /**
   * 转化
   * @param {string} name 角色名
   * @param {"normal" | "amiya"} [target = "normal"] 目标
   * @returns {string}
   */
  transfer(a, t = "normal") {
    return t ? this[t][a] || a : this.normal[a] || this.amiya[a] || a;
  }
}
const v = new z();
class x {
  /**
   * 初始化
   */
  async init() {
    const a = performance.now();
    await this.autoUpdate();
    const t = performance.now() - a, e = performance.now();
    await this.loadArknightData();
    const n = performance.now() - e, h = performance.now();
    await this.loadShcema();
    const c = performance.now() - h, i = t + n + c;
    i > 500 && (console.groupCollapsed(`%c[WhichWay·arknight] init ${i.toFixed(0)}ms`, "color:#e67e22;"), console.log(`  autoUpdate:       ${t.toFixed(0)}ms`), console.log(`  loadArknightData: ${n.toFixed(0)}ms`), console.log(`  loadShcema:       ${c.toFixed(0)}ms`), console.groupEnd()), U({
      name: "arknight_init",
      fn: (o) => {
        for (let m of o)
          for (let d in m.character)
            this.initCharArknight(m.character[d]);
      },
      priority: -1145141919810
    }), C({
      name: "whichWayNumberOfArknigtChars_add",
      fn() {
        return {
          name: "numberOfArknigtChars",
          options: {
            name: `明日方舟干员数:${Object.keys(p.arknightData.charword_table.charDefaultTypeDict).length}`,
            clear: !0
          }
        };
      },
      priority: 998
    });
  }
  /**
   * 加载明日方舟相关数据
   *
   * 两级加载（`json/arknight/` 下的全量数据 character_table ≈7.5MB + charword_table ≈8.1MB，
   * 读盘 + JSON.parse 会长时间占住主线程，是启动耗时的主要来源之一）：
   *
   * 1. **快路径**：`json/cache/arknight.json` 存在、结构版本与扩展版本都匹配、
   *    且本次启动没有重新下载过数据时，直接使用精简缓存（实测约 153KB），
   *    **完全不触碰 json/arknight/ 下的全量文件**。
   * 2. **慢路径**（首次启动 / 扩展版本变化 / 精简缓存结构版本变化 / 本次下载过数据）：
   *    读全量 JSON → 按白名单裁剪（slimArknightData）→ 写回缓存 → 使用裁剪结果。
   *
   * @param {string} [path="json:arknight"] json文件的路径
   */
  async loadArknightData(a = "json:arknight/") {
    if (this.arknightData || (this.arknightData = {}), !this.arknightDataUpdated) {
      const i = await this.readSlimCache();
      if (i) {
        Object.assign(this.arknightData, i);
        return;
      }
    }
    const { files: t } = await w.getFileTree(a, 0), e = t.filter((i) => i.name.endsWith(".json") && !this.loadSkipFiles.includes(i.name.replace(".json", ""))), n = await Promise.all(e.map((i) => w.readFile(i.path))), h = {};
    e.forEach((i, o) => {
      h[i.name.replace(".json", "")] = n[o];
    });
    const c = this.slimArknightData(h);
    Object.assign(this.arknightData, c);
    try {
      await w.writeFileAsJson({ schema: this.slimCacheSchema, version: W.ext, data: c }, "json:cache/", "arknight.json");
    } catch (i) {
      console.warn("[WhichWay] 写入明日方舟精简缓存失败（不影响本次运行）", i);
    }
  }
  /**
   * 读取精简缓存。
   *
   * 不存在 / 解析失败 / 结构版本或扩展版本不匹配时返回 undefined（不抛错，由调用方走慢路径重建）。
   */
  async readSlimCache() {
    try {
      const a = await w.readFile(`json:${this.slimCacheFile}`);
      return !a || a.schema !== this.slimCacheSchema || a.version !== W.ext || !a.data ? void 0 : a.data;
    } catch {
      return;
    }
  }
  /**
   * 把 `json/arknight/` 的全量数据裁剪成启动期真正用到的字段。
   *
   * ⚠️ 白名单必须与「本文件的实际读取点」严格一致：
   * 若新增了读取 character_table / charword_table / char_patch_table 其它字段的代码，
   * 必须同时（1）在此保留该字段、（2）同步 typings/arknight.d.ts 的 *Slim 类型、
   * （3）把 slimCacheSchema +1 让老缓存失效——否则精简缓存会静默缺字段。
   *
   * 白名单依据（全仓核实：除本文件外没有任何位置读取这三张表）：
   * - character_table[uid]：name（译名匹配）、subProfessionId（isCharacter）、tagList（getTags）、键存在性
   * - char_patch_table.patchChars[uid]：name、subProfessionId、tagList
   * - charword_table.charDefaultTypeDict：仅 Object.keys().length
   * - charword_table.voiceLangTypeDict：Object.keys() 与 [lang].name
   * - charword_table.voiceLangDict[uid].dict：仅真值判断与 Object.keys()
   */
  slimArknightData(a) {
    const t = a.character_table ?? {}, e = {};
    for (const r in t) {
      const s = t[r];
      e[r] = { name: s.name, subProfessionId: s.subProfessionId, tagList: s.tagList };
    }
    const n = a.char_patch_table?.patchChars, h = {};
    for (const r in n ?? {}) {
      const s = n[r];
      h[r] = { name: s.name, subProfessionId: s.subProfessionId, tagList: s.tagList };
    }
    const c = a.charword_table ?? {}, i = {};
    for (const r in c.charDefaultTypeDict ?? {}) i[r] = !0;
    const o = {}, m = c.voiceLangTypeDict ?? {};
    for (const r in m) o[r] = { name: m[r].name };
    const d = {};
    for (const r in c.voiceLangDict ?? {}) {
      const s = {};
      for (const l in c.voiceLangDict[r]?.dict ?? {}) s[l] = !0;
      d[r] = { dict: s };
    }
    return {
      character_table: e,
      char_patch_table: { patchChars: h },
      charword_table: { charDefaultTypeDict: i, voiceLangTypeDict: o, voiceLangDict: d }
    };
  }
  /**
   * 构建映射表
   */
  async loadShcema() {
    const {
      character: { whichWayUID: a, chineseName: t, arknightUID: e }
    } = this.shcema, n = window.whichWaySave.allCharacters, h = this.arknightData.character_table, c = n.filter((r) => {
      const s = f.character(r);
      return !!s && typeof s.arkuid == "string";
    }), i = /* @__PURE__ */ new Map();
    for (const r of c) {
      const s = f.character(r).arkuid;
      let l = i.get(s);
      l || i.set(s, l = []), l.push(r);
    }
    const o = n.map((r) => f.translation(r)), m = /* @__PURE__ */ new Map();
    n.forEach((r, s) => {
      const l = this.redirect.transfer(o[s]);
      l !== void 0 && !m.has(l) && m.set(l, r);
    });
    for (let r in h) {
      const s = h[r];
      if (!this.isCharacter(s)) continue;
      const l = i.get(r);
      if (l)
        for (const y of l)
          a[y] = r, e[r] = y, t.set([r, y], f.translation(y));
      const g = m.get(s.name);
      g !== void 0 && (a[g] = r, e[r] = g, t.set([r, g], s.name));
    }
    const d = this.arknightData.char_patch_table.patchChars;
    for (let r in d) {
      let s = d[r];
      if (!this.isCharacter(s)) continue;
      h[r] = s;
      const l = this.redirect.transfer(r, "amiya");
      if (o.includes(l)) {
        const g = n[o.indexOf(l)];
        a[g] = r, e[r] = g, t.set([r, g], l);
      }
    }
  }
  /**
   * 明日方舟干员名 → 明日方舟uid 的反查索引（懒构建，仅构建一次）
   *
   * 原先 addShcema 对每个干员都遍历整张 character_table，且循环体内还对全部干员
   * 反复做 filter/map，规模为 干员数 × 全表大小 × 干员数，是扩展加载的最大热点。
   */
  _arkNameIndex = null;
  _getArkNameIndex() {
    if (!this._arkNameIndex) {
      const a = /* @__PURE__ */ new Map(), t = this.arknightData.character_table;
      for (const e in t)
        this.isCharacter(t[e]) && a.set(t[e].name, e);
      this._arkNameIndex = a;
    }
    return this._arkNameIndex;
  }
  /**
   * 添加到映射表
   * @param { string } id 驶舰之向干员id（或明日方舟uid）
   * @param { WhichWayCharacter } [char] 干员数据对象；传入后可识别干员显式声明的 arkuid
   */
  async addShcema(a, t) {
    const {
      character: { whichWayUID: e, chineseName: n, arknightUID: h }
    } = this.shcema, c = this.arknightData.character_table;
    if (window.whichWaySave.allCharacters, window.whichWaySave.hasChar(a)) {
      const i = t?.arkuid;
      if (typeof i == "string" && i in c) {
        e[a] = i, h[i] = a, n.set([i, a], f.translation(a));
        return;
      }
      const o = this._getArkNameIndex().get(this.redirect.transfer(f.translation(a)));
      if (o !== void 0) {
        e[a] = o, h[o] = a, n.set([o, a], c[o].name);
        return;
      }
      console.warn(`角色${a}不存在`);
    } else if (a in c) {
      const i = c[a];
      if (this.isCharacter(i)) {
        const o = window.whichWaySave.allCharacters.find((m) => this.redirect.transfer(f.translation(m)) === i.name);
        e[o] = a, h[a] = a, n.set([a, o], i.name);
        return;
      } else
        console.warn(`角色${a}不存在`);
    }
  }
  /**
   * 是否是干员
   * @param { ArknightCharacter | string } info 明日方舟角色信息或明日方舟角色uid
   * @returns { boolean }
   */
  isCharacter(a) {
    return typeof a == "string" && (a = this.arknightData.character_table[a]), a?.subProfessionId ? !a.subProfessionId.startsWith("notchar") : !1;
  }
  /**
   * 判断是否在明日方舟角色列表中
   * @param {string} name 角色名（驶舰之向角色）
   * @returns {boolean}
   */
  inArknightChars(a) {
    return window.whichWaySave.allCharacters ? window.whichWaySave.hasChar(a) ? !!this.shcema.transfer(a, "character", "whichWayUID") : !1 : (console.warn("allCharacters is not initialized!"), !1);
  }
  /**
   * 初始化角色的明日方舟数据（**每个字段都支持自定义**）
   *
   * `whichWay.arknight` 里声明过的值一律保留（包括空数组），只补 `undefined` 的字段；
   * `supportingEquipment` / `linkage` 同理：缺省（`undefined`）时才按明日方舟数据推导。
   *
   * @param {WhichWayCharacterInitialized} char 角色数据（`initCharConfig` 之后的初始化态）
   */
  initCharArknight(a) {
    const t = a.whichWay, e = t.arknight ??= {}, n = a.arkuid;
    e.charId ??= n || this.shcema.transfer(t.charId, "character", "whichWayUID") || "", e.camp ??= this.getCamp(a) ?? "", e.avaiableLangs ??= this.getAviableLangs(t.charId) || [], e.tags ??= this.getTags(t.charId) || [], t.supportingEquipment ??= e.tags.includes("支援机器"), t.linkage ??= e.avaiableLangs.includes("LINKAGE");
  }
  /**
   * 通过索引获取音频信息
   * @param { number } index - 索引
   * @returns { { index: string, name: string }}
   */
  getAudioByIndex(a) {
    if (this.shcema.audio.name.length < a) throw new Error(`索引超出范围,最大索引为${this.shcema.audio.name.length - 1}: ${a}`);
    return {
      index: this.shcema.audio.index[a],
      name: this.shcema.audio.name[a]
    };
  }
  /**
   * 获取所有的配音语言
   * @returns {string[]}
   * @param {boolean} lowerCase 是否返回小写
   */
  getVoiceLangs(a = !1) {
    let t = Object.keys(this.arknightData.charword_table.voiceLangTypeDict);
    return t.push("CUSTOM"), a ? t.map((e) => e.toLowerCase()) : t;
  }
  /**
   * 获取语言的中文翻译
   * @param {string} lang 语言
   * @returns {string | undefined}
   */
  getVoiceLangTranslation(a) {
    if (a === "CUSTOM") return "本地";
    let t = this.arknightData.charword_table.voiceLangTypeDict;
    if (t[a])
      return t[a].name;
  }
  /**
   * 通过uid获取角色的标签
   * @param {string} uid 明日方舟角色uid或驶舰之向角色
   * @returns {string[] | undefined}
   */
  getTags(a) {
    const t = this.shcema.transfer(a, "character", "whichWayUID") || a;
    if (t in this.arknightData.character_table)
      return this.arknightData.character_table[t].tagList || [];
  }
  /**
   * 获得角色可用的语音语言
   * @param {string} uid 明日方舟角色uid或驶舰之向角色
   * @returns {string[] | undefined}
   */
  getAviableLangs(a) {
    const { voiceLangDict: t } = this.arknightData.charword_table, e = this.shcema.transfer(a, "character", "whichWayUID") || a;
    return t[e]?.dict ? Object.keys(t[e].dict) || void 0 : ["CUSTOM"];
  }
  /**
   * 获得角色在明日方舟中的阵营id
   * @param {string | Player | WhichWayCharacter} uid 驶舰之向角色或驶舰之向角色的阵营
   * @returns {ArksCamps | undefined}
   */
  getCamp(a) {
    if (f.itemtype(a) === "player" && (a = a.name), f.is.object(a)) {
      let t = a;
      return t.whichWay ? this.shcema.transfer(t.whichWay?.reallyGroup, "group", "arknight") : void 0;
    } else if (typeof a == "string" && window.whichWaySave.hasChar(a)) {
      const t = u.getCharExtConfig(a)?.reallyGroup || "";
      return this.shcema.transfer(t, "group", "arknight");
    }
  }
  /**
   * 通过uid获取角色的中文名
   * @param {string} uid 明日方舟角色uid
   * @returns {string | undefined}
   */
  getTranslation(a) {
    return this.shcema.transfer(a, "character", "chineseName");
  }
  /**
   * 自动检测更新明日方舟数据
   */
  async autoUpdate() {
    const { files: a } = await w.getFileTree("json:arknight/", 0), t = a.map((e) => e.name);
    return t.length < 1 || !this.updateFile.every((e) => t.includes(e + ".json")) ? await this.updateArknigtData() : W.extVersionChanged && await this.updateArknigtData(), !0;
  }
  /**
   * 更新明日方舟数据
   */
  async updateArknigtData() {
    const { updateFile: a, updateUrl: t } = this;
    this.arknightDataUpdated = !0, k.showToast("[驶舰之向] 正在更新明日方舟数据...", 3e3, "topRight", "whichWayArknightUpdateTitle");
    for (const e of a) {
      const n = `${t}${e}.json`;
      await w.download(n, "json:arknight/", `${e}.json`, ({ percent: h, total: c, loaded: i }) => {
        h !== null ? (u.isDeveloperMode() && console.log(`正在下载文件${e}: ${h}%`), k.showToast(`正在下载文件${e}: ${h}%`, 3e3, "topRight", "whichWayArknightUpdate")) : (u.isDeveloperMode() && console.log(`正在下载文件 ${e}: ${i} bytes`), k.showToast(`正在下载文件 ${e}: ${Math.floor(i / 1024)} KB`, 3e3, "topRight", "whichWayArknightUpdate"));
      }), k.showToast(`文件 ${e} 下载完成!`, 3e3, "topRight"), k.removeToastById("whichWayArknightUpdate"), k.removeToastById("whichWayArknightUpdateTitle");
    }
    return !0;
  }
  /**
   * 明日方舟数据（**精简后的**，见 slimArknightData 的白名单与 typings 的 *Slim 类型；
   * 不是 json/arknight/ 下的全量原始 JSON）
   */
  arknightData;
  /**
   * 精简缓存文件（相对 json: 的路径），与 json/cache/skin.json 同目录、同读写方式
   */
  slimCacheFile = "cache/arknight.json";
  /**
   * 精简缓存的结构版本：白名单字段发生变化时必须 +1，否则老缓存不会被重建
   * （只靠扩展版本号覆盖不了「改了白名单但没升版本」的情况）
   */
  slimCacheSchema = 1;
  /**
   * 本次启动是否重新下载过明日方舟数据。
   *
   * 置位后 loadArknightData 会强制走慢路径重建精简缓存——否则会出现
   * 「json/arknight/ 下文件缺失被重新下载、但扩展版本未变 → 读到旧缓存」的错误场景。
   */
  arknightDataUpdated = !1;
  /**
   * 启动期不读入内存的数据文件名（仍保留在 updateFile 清单里，自动更新/下载不受影响）。
   *
   * handbook_team_table 全扩展零运行时读取（只出现在本文件的 updateFile 清单中），
   * 也不在精简缓存的裁剪范围内——裁剪只保留 ArknightSlimData 声明的三张表。
   */
  loadSkipFiles = ["handbook_team_table"];
  /**
   * 需要更新的JSON文件名
   */
  updateFile = ["character_table", "charword_table", "handbook_team_table", "char_patch_table"];
  /**
   * 更新的JSON文件地址
   */
  updateUrl = "https://torappu.prts.wiki/gamedata/latest/excel/";
  shcema = A;
  redirect = v;
}
const p = new x();
await p.init();
b({
  name: "whichWayArknight",
  fn: () => {
    window.whichWayArknight = p;
  }
});
window.whichWay.register("arknight", p);
export {
  p as whichWayArknight
};
