import "noname";
import { whichWayUtil } from "../utill.js";
class ArknightShcema {
  audio = {
    index: ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "032", "033", "034", "036", "037", "038", "042", "043", "044"],
    name: ["任命助理", "交谈1", "交谈2", "交谈3", "晋升后交谈1", "晋升后交谈2", "信赖提升后交谈1", "信赖提升后交谈2", "信赖提升后交谈3", "闲置", "干员报到", "观看作战记录", "精英化晋升1", "精英化晋升2", "编入队伍", "任命队长", "行动出发", "行动开始", "选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4", "完成高难行动", "3星结束行动", "非3星结束行动", "行动失败", "进驻设施", "戳一下", "信赖触摸", "标题", "新年祝福", "问候", "生日", "周年庆典"]
  };
  character = {
    arknightUID: {},
    whichWayUID: {},
    chineseName: new WhichWayArkChineseName()
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
  transfer(str, type, subtype) {
    if (typeof type !== "string" || subtype !== void 0 && typeof subtype !== "string") throw new Error("参数类型错误！");
    if (type === "audio") {
      if (subtype) {
        const lookupKey = subtype === "index" ? "name" : "index";
        const lookupList = this[type][lookupKey];
        const targetList = this[type][subtype];
        const idx = lookupList.indexOf(str);
        return idx !== -1 ? targetList[idx] : void 0;
      }
      return whichWayUtil.bidirectionalLookup(this[type].index, this[type].name, str);
    } else if (type === "group") {
      if (subtype) {
        const lookupKey = subtype === "whichWay" ? "arknight" : "whichWay";
        const lookupList = this[type][lookupKey];
        const targetList = this[type][subtype];
        const idx = lookupList.indexOf(str);
        return idx !== -1 ? targetList[idx] : void 0;
      }
      return whichWayUtil.bidirectionalLookup(this[type].whichWay, this[type].arknight, str);
    } else if (type === "character") {
      const characters = this.character;
      if (subtype) {
        return subtype === "chineseName" ? characters.chineseName.get(str) : characters[subtype][str];
      }
      return characters.whichWayUID[str] || characters.arknightUID[str] || characters.chineseName.get(str);
    }
  }
}
class WhichWayArkChineseName {
  arkUID = {};
  whichWayUID = {};
  /**
   * 获取角色UID对应的中文
   * @param { string } value
   *
   * @returns { string | undefined }
   */
  get(value) {
    return this.arkUID[value] || this.whichWayUID[value];
  }
  /**
   * 设置角色UID对应的中文
   * @param {[string, string]} keys - [明日方舟UID, WhichWayUID]
   * @param {string} value - 中文名
   */
  set([arkId, whichId], value) {
    const existing = this.arkUID[arkId] || this.arkUID[whichId] || this.whichWayUID[arkId] || this.whichWayUID[whichId];
    if (existing) {
      console.warn(`[WhichWayArkChineseName] 翻译覆盖: 角色 ${arkId},${whichId} 已存在中文翻译 ${existing}`);
    }
    this.arkUID[arkId] = value;
    this.whichWayUID[whichId] = value;
  }
}
const whichWayArknightShcema = new ArknightShcema();
export {
  whichWayArknightShcema
};
//# sourceMappingURL=shcema.js.map
