class WhichWayCharConfig {
  /**
   * 是否为支援器械
   * @type { boolean }
   */
  supportingEquipment = false;
  /**
   * 设计者
   * @type { Array<string> }
   */
  designer = [];
  /**
   * 真正的势力
   */
  reallyGroup = "";
  /**
   * 角色id(驶舰之向)
   */
  charId = "";
  /**
   * 明日方舟数据
   */
  arknight = {
    /**
     * 角色id(明日方舟)
     */
    charId: "",
    /**明日方舟阵营 */
    camp: "",
    /**明日方舟可用配音语言 */
    avaiableLangs: [],
    tags: []
  };
}
const initCharConfig = (char) => {
  if (!char.whichWay) char.whichWay = new WhichWayCharConfig();
  return char;
};
export {
  initCharConfig
};
//# sourceMappingURL=extCharConfig.js.map
