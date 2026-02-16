class WhichWayArknightRedirect {
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
  };
  amiya = {
    char_1037_amiya3: "医疗阿米娅",
    char_1001_amiya2: "近卫阿米娅"
  };
  /**
   * 转化
   * @param {string} name 角色名
   * @param {"normal" | "amiya"} target 目标
   * @returns {string}
   */
  transfer(name, target = "normal") {
    if (target) return this[target][name] || name;
    return this.normal[name] || this.amiya[name] || name;
  }
}
const whichWayArknightRedirect = new WhichWayArknightRedirect();
export {
  whichWayArknightRedirect
};
//# sourceMappingURL=redirect.js.map
