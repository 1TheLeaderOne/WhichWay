import { whichWayFile as g } from "./file.js";
import { onInit as D, onConfig as b, onSetDev as W } from "./hooks.js";
import { get as k } from "noname";
import { whichWayUtil as d } from "./utill.js";
import { w as p } from "./arknight-arkidMigration-shared.js";
import { whichWayToast as f } from "./toast.js";
class A {
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
  transfer(a, t, i) {
    if (typeof t != "string" || i !== void 0 && typeof i != "string") throw new Error("参数类型错误！");
    if (t === "audio") {
      if (i) {
        const e = i === "index" ? "name" : "index", s = this[t][e], h = this[t][i], r = s.indexOf(a);
        return r !== -1 ? h[r] : void 0;
      }
      return d.bidirectionalLookup(this[t].index, this[t].name, a);
    } else if (t === "group") {
      if (i) {
        const e = i === "whichWay" ? "arknight" : "whichWay", s = this[t][e], h = this[t][i], r = s.indexOf(a);
        return r !== -1 ? h[r] : void 0;
      }
      return d.bidirectionalLookup(this[t].whichWay, this[t].arknight, a);
    } else if (t === "character") {
      const e = this.character;
      return i ? i === "chineseName" ? e.chineseName.get(a) : e[i][a] : e.whichWayUID[a] || e.arknightUID[a] || e.chineseName.get(a);
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
  set([a, t], i) {
    const e = this.arkUID[a] || this.arkUID[t] || this.whichWayUID[a] || this.whichWayUID[t];
    e && console.warn(`[WhichWayArkChineseName] 翻译覆盖: 角色 ${a},${t} 已存在中文翻译 ${e}`), this.arkUID[a] = i, this.whichWayUID[t] = i;
  }
}
const I = new A();
class C {
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
const U = new C();
class x {
  /**
   * 初始化
   */
  async init() {
    const a = performance.now();
    await this.autoUpdate();
    const t = performance.now() - a, i = performance.now();
    await this.loadArknightData();
    const e = performance.now() - i, s = performance.now();
    await this.loadShcema();
    const h = performance.now() - s;
    this.buildVaildArkId();
    const r = t + e + h;
    r > 500 && (console.groupCollapsed(`%c[WhichWay·arknight] init ${r.toFixed(0)}ms`, "color:#e67e22;"), console.log(`  autoUpdate:       ${t.toFixed(0)}ms`), console.log(`  loadArknightData: ${e.toFixed(0)}ms`), console.log(`  loadShcema:       ${h.toFixed(0)}ms`), console.groupEnd()), D({
      name: "arknight_init",
      fn: (m) => {
        for (let n of m)
          for (let l in n.character)
            this.initCharArknight(n.character[l]);
      },
      priority: -1145141919810
    }), b({
      name: "whichWayNumberOfArknigtChars_add",
      fn() {
        return {
          name: "numberOfArknigtChars",
          options: {
            name: `明日方舟干员数:${Object.keys(u.arknightData.charword_table.charDefaultTypeDict).length}`,
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
      const r = await this.readSlimCache();
      if (r) {
        Object.assign(this.arknightData, r);
        return;
      }
    }
    const { files: t } = await g.getFileTree(a, 0), i = t.filter((r) => r.name.endsWith(".json") && !this.loadSkipFiles.includes(r.name.replace(".json", ""))), e = await Promise.all(i.map((r) => g.readFile(r.path))), s = {};
    i.forEach((r, m) => {
      s[r.name.replace(".json", "")] = e[m];
    });
    const h = this.slimArknightData(s);
    Object.assign(this.arknightData, h);
    try {
      await g.writeFileAsJson({ schema: this.slimCacheSchema, version: p.ext, data: h }, "json:cache/", "arknight.json");
    } catch (r) {
      console.warn("[WhichWay] 写入明日方舟精简缓存失败（不影响本次运行）", r);
    }
  }
  /**
   * 读取精简缓存。
   *
   * 不存在 / 解析失败 / 结构版本或扩展版本不匹配时返回 undefined（不抛错，由调用方走慢路径重建）。
   */
  async readSlimCache() {
    try {
      const a = await g.readFile(`json:${this.slimCacheFile}`);
      return !a || a.schema !== this.slimCacheSchema || a.version !== p.ext || !a.data ? void 0 : a.data;
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
   * - character_table[uid]：name（译名匹配）、subProfessionId（isCharacter）、tagList（getTags）、isNotObtainable（isObtainable）、键存在性
   * - char_patch_table.patchChars[uid]：name、subProfessionId、tagList、isNotObtainable
   * - charword_table.charDefaultTypeDict：仅 Object.keys().length
   * - charword_table.voiceLangTypeDict：Object.keys() 与 [lang].name
   * - charword_table.voiceLangDict[uid].dict：仅真值判断与 Object.keys()
   */
  slimArknightData(a) {
    const t = a.character_table ?? {}, i = {};
    for (const c in t) {
      const o = t[c];
      i[c] = { name: o.name, subProfessionId: o.subProfessionId, tagList: o.tagList, isNotObtainable: o.isNotObtainable };
    }
    const e = a.char_patch_table?.patchChars, s = {};
    for (const c in e ?? {}) {
      const o = e[c];
      s[c] = { name: o.name, subProfessionId: o.subProfessionId, tagList: o.tagList, isNotObtainable: o.isNotObtainable };
    }
    const h = a.charword_table ?? {}, r = {};
    for (const c in h.charDefaultTypeDict ?? {}) r[c] = !0;
    const m = {}, n = h.voiceLangTypeDict ?? {};
    for (const c in n) m[c] = { name: n[c].name };
    const l = {};
    for (const c in h.voiceLangDict ?? {}) {
      const o = {};
      for (const y in h.voiceLangDict[c]?.dict ?? {}) o[y] = !0;
      l[c] = { dict: o };
    }
    return {
      character_table: i,
      char_patch_table: { patchChars: s },
      charword_table: { charDefaultTypeDict: r, voiceLangTypeDict: m, voiceLangDict: l }
    };
  }
  /**
   * 构建映射表
   */
  async loadShcema() {
    const {
      character: { whichWayUID: a, chineseName: t, arknightUID: i }
    } = this.shcema, e = window.whichWaySave.allCharacters, s = this.arknightData.character_table, h = e.map((n) => k.translation(n)), r = /* @__PURE__ */ new Map();
    e.forEach((n, l) => {
      const c = this.redirect.transfer(h[l]);
      c !== void 0 && !r.has(c) && r.set(c, n);
    });
    for (let n in s) {
      const l = s[n];
      if (!this.isCharacter(l)) continue;
      if (window.whichWaySave.hasChar(n)) {
        a[n] = n, i[n] = n, t.set([n, n], l.name);
        continue;
      }
      const c = r.get(l.name);
      c !== void 0 && (a[c] = n, i[n] = c, t.set([n, c], l.name));
    }
    const m = this.arknightData.char_patch_table.patchChars;
    for (let n in m) {
      let l = m[n];
      if (!this.isCharacter(l)) continue;
      s[n] = l;
      const c = this.redirect.transfer(n, "amiya");
      if (h.includes(c)) {
        const o = e[h.indexOf(c)];
        a[o] = n, i[n] = o, t.set([n, o], c);
      }
    }
  }
  /**
   * 构造 vaildArkId：全量明日方舟干员uid清单。
   *
   * 数据源为 `json/arknight/` 下的角色表（经精简缓存加载后的 arknightData）：
   * - character_table：游戏内正式干员主表
   * - char_patch_table.patchChars：不在主表里的升变形态（如升变阿米娅）
   *
   * 两者都按 isCharacter 过滤（subProfessionId 以 notchar 开头的是敌方/ NPC 占位，
   * 不是可选干员），并与 addVaildArk 一样保持去重。
   */
  buildVaildArkId() {
    this.vaildArkId = [];
    const a = [this.arknightData?.character_table, this.arknightData?.char_patch_table?.patchChars];
    for (const t of a)
      if (t)
        for (const i in t)
          this.isCharacter(t[i]) && this.addVaildArk(i);
  }
  /**
   * 是否是明日方舟干员
   * @param {string} id 明日方舟干员uid
   * @returns {boolean} id 是否在 vaildArkId 之中
   */
  isArknght(a) {
    return this.vaildArkId.includes(a);
  }
  /**
   * 添加一个明日方舟干员uid到 vaildArkId（已存在则忽略）
   * @param {string} id 明日方舟干员uid
   */
  addVaildArk(a) {
    this.isArknght(a) || this.vaildArkId.push(a);
  }
  /**
   * 登记「扩展里已经存在」的明日方舟干员uid（由武将包构造流程 addShcema 调用）
   * @param {string} id 明日方舟干员uid
   */
  addExsitArk(a) {
    this.isArknght(a) && !this.exsitArk.includes(a) && this.exsitArk.push(a);
  }
  /**
   * 明日方舟干员名 → 明日方舟uid 的反查索引（懒构建，仅构建一次）
   *
   * 原先 addShcema 对每个干员都遍历整张 character_table，且循环体内还对全部干员
   * 反复做 filter/map，规模为 干员数 × 全表大小 × 干员数，是扩展加载的最大热点。
   *
   * 全表有 98 组同名干员，其中「阿米娅」三名共用：char_002_amiya 在主表，
   * char_1001_amiya2 / char_1037_amiya3 由 loadShcema 从 char_patch_table 并进主表。
   * 反查只服务于旧式命名干员（本体形态一律走 addShcema 的恒等分支），
   * 因此排除升变形态并保留首个命中者——否则「阿米娅」会被后写入的 char_1037_amiya3 顶掉。
   */
  _arkNameIndex = null;
  _getArkNameIndex() {
    if (!this._arkNameIndex) {
      const a = /* @__PURE__ */ new Map(), t = this.arknightData.character_table, i = this.arknightData.char_patch_table?.patchChars;
      for (const e in t) {
        if (i?.[e] || !this.isCharacter(t[e])) continue;
        const s = t[e].name;
        s !== void 0 && !a.has(s) && a.set(s, e);
      }
      this._arkNameIndex = a;
    }
    return this._arkNameIndex;
  }
  /**
   * 添加到映射表
   * @param { string } id 驶舰之向干员id（已与明日方舟 uid 统一）
   */
  async addShcema(a) {
    const {
      character: { whichWayUID: t, chineseName: i, arknightUID: e }
    } = this.shcema, s = this.arknightData.character_table;
    if (this.isCharacter(a)) {
      t[a] = a, e[a] = a, i.set([a, a], s[a].name), this.addExsitArk(a);
      return;
    }
    const h = this._getArkNameIndex().get(this.redirect.transfer(k.translation(a)));
    if (h !== void 0) {
      t[a] = h, e[h] = a, i.set([h, a], s[h].name), this.addExsitArk(h);
      return;
    }
    console.warn(`角色${a}不存在`);
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
   * 是否是明日方舟**游戏内可获取**的干员
   *
   * 判据是角色表的 `isNotObtainable`（全量 1382 条都带这个布尔，无需推测）。为 `true` 的是
   * 「有完整干员数据但玩家拿不到」的角色：预备干员系列（`char_5xx_r*` / `char_6xx_c*`）、
   * 集成战略/活动 NPC（Sharp、Pith、Touch、Stormeye、Raidian、Misery、Mechanist、暮落、郁金香）、
   * 盟约·辅助干员等，共 29 条。它们与「阿消／洛洛／罗宾／迷迭香」这类正常可获取干员（`false`）
   * 在数据上仅此一处区别，所以不能靠 `rarity`、`itemObtainApproach`（只是 null）或 id 前缀去猜。
   *
   * 字段缺失（读到了旧版精简缓存）一律按**可获取**处理：宁可多列一条待征稿，
   * 也不要把正常干员悄悄排除在名单外。
   * @param id 明日方舟干员uid
   */
  isObtainable(a) {
    return (this.arknightData?.character_table?.[a] ?? this.arknightData?.char_patch_table?.patchChars?.[a])?.isNotObtainable !== !0;
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
    const t = a.whichWay, i = t.arknight ??= {};
    i.charId ??= this.shcema.transfer(t.charId, "character", "whichWayUID") || "", i.camp ??= this.getCamp(a) ?? "", i.avaiableLangs ??= this.getAviableLangs(t.charId) || [], i.tags ??= this.getTags(t.charId) || [], t.supportingEquipment ??= i.tags.includes("支援机器"), t.linkage ??= i.avaiableLangs.includes("LINKAGE");
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
    return t.push("CUSTOM"), a ? t.map((i) => i.toLowerCase()) : t;
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
    const { voiceLangDict: t } = this.arknightData.charword_table, i = this.shcema.transfer(a, "character", "whichWayUID") || a;
    return t[i]?.dict ? Object.keys(t[i].dict) || void 0 : ["CUSTOM"];
  }
  /**
   * 获得角色在明日方舟中的阵营id
   * @param {string | Player | WhichWayCharacter} uid 驶舰之向角色或驶舰之向角色的阵营
   * @returns {ArksCamps | undefined}
   */
  getCamp(a) {
    if (k.itemtype(a) === "player" && (a = a.name), k.is.object(a)) {
      let t = a;
      return t.whichWay ? this.shcema.transfer(t.whichWay?.reallyGroup, "group", "arknight") : void 0;
    } else if (typeof a == "string" && window.whichWaySave.hasChar(a)) {
      const t = d.getCharExtConfig(a)?.reallyGroup || "";
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
    const { files: a } = await g.getFileTree("json:arknight/", 0), t = a.map((i) => i.name);
    return t.length < 1 || !this.updateFile.every((i) => t.includes(i + ".json")) ? await this.updateArknigtData() : p.extVersionChanged && await this.updateArknigtData(), !0;
  }
  /**
   * 更新明日方舟数据
   */
  async updateArknigtData() {
    const { updateFile: a, updateUrl: t } = this;
    this.arknightDataUpdated = !0, f.showToast("[驶舰之向] 正在更新明日方舟数据...", 3e3, "topRight", "whichWayArknightUpdateTitle");
    for (const i of a) {
      const e = `${t}${i}.json`;
      await g.download(e, "json:arknight/", `${i}.json`, ({ percent: s, total: h, loaded: r }) => {
        s !== null ? (d.isDeveloperMode() && console.log(`正在下载文件${i}: ${s}%`), f.showToast(`正在下载文件${i}: ${s}%`, 3e3, "topRight", "whichWayArknightUpdate")) : (d.isDeveloperMode() && console.log(`正在下载文件 ${i}: ${r} bytes`), f.showToast(`正在下载文件 ${i}: ${Math.floor(r / 1024)} KB`, 3e3, "topRight", "whichWayArknightUpdate"));
      }), f.showToast(`文件 ${i} 下载完成!`, 3e3, "topRight"), f.removeToastById("whichWayArknightUpdate"), f.removeToastById("whichWayArknightUpdateTitle");
    }
    return !0;
  }
  /**
   * 明日方舟数据（**精简后的**，见 slimArknightData 的白名单与 typings 的 *Slim 类型；
   * 不是 json/arknight/ 下的全量原始 JSON）
   */
  arknightData;
  /**
   * 全量明日方舟干员uid清单（由 buildVaildArkId 在初始化时用 json/arknight 的角色表构造，
   * 含 char_patch_table 的升变形态，已按 isCharacter 过滤）
   */
  vaildArkId = [];
  /**
   * 扩展里已经存在的明日方舟干员uid（武将包构造时由 addShcema 逐个登记，恒为 vaildArkId 的子集）。
   *
   * 用途：`vaildArkId` 与 `exsitArk` 的差集即「明日方舟有、扩展还没做」的干员。
   */
  exsitArk = [];
  /**
   * 精简缓存文件（相对 json: 的路径），与 json/cache/skin.json 同目录、同读写方式
   */
  slimCacheFile = "cache/arknight.json";
  /**
   * 精简缓存的结构版本：白名单字段发生变化时必须 +1，否则老缓存不会被重建
   * （只靠扩展版本号覆盖不了「改了白名单但没升版本」的情况）
   */
  slimCacheSchema = 2;
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
   * - handbook_team_table：全扩展零运行时读取（只出现在本文件的 updateFile 清单中）
   * - skin_table：皮肤形态表（3.8MB），只有 scripts 下的开发脚本读磁盘上的那份
   *   （update-portraits / split-illustration 按 portraitId 反查形态），运行时的皮肤数据来自
   *   json/cache/skin.json，跟这张表没有关系
   *
   * 两者都不在精简缓存的裁剪范围内——裁剪只保留 ArknightSlimData 声明的三张表，
   * 所以往这里加文件名不需要动 slimCacheSchema。
   */
  loadSkipFiles = ["handbook_team_table", "skin_table"];
  /**
   * 需要更新的JSON文件名
   *
   * ⚠️ 与 scripts/update-arknight-data.bat 的 FILES 清单是一对镜像，改一边就要改另一边
   * （那边的头部注释写明了这条约束）。
   */
  updateFile = ["character_table", "charword_table", "handbook_team_table", "char_patch_table", "skin_table"];
  /**
   * 更新的JSON文件地址
   */
  updateUrl = "https://torappu.prts.wiki/gamedata/latest/excel/";
  shcema = I;
  redirect = U;
}
const u = new x();
await u.init();
W({
  name: "whichWayArknight",
  fn: () => {
    window.whichWayArknight = u;
  }
});
window.whichWay.register("arknight", u);
export {
  u as whichWayArknight
};
