import { whichWayFile } from "../file.js";
const whichWayConfigData = {
  /**
  * @type {Object} 背景图片
   */
  background: {
    url: {
      content: whichWayFile.compilePath("bg:"),
      enumerable: false
    },
    default: {
      content: "默认",
      enumerable: false
    },
    // 背景图片
    landLife: "生命之地",
    illumination: "照明",
    dew: "朝露",
    ecologicalPark: "生态园",
    FantasyGarden: "空想花庭",
    PrimevalChaos: "洪荒",
    hope: "希望",
    ideal: "理想",
    priestess: "普瑞赛斯",
    breakingCage: "破笼",
    battlefront: "战线",
    companion: "挚友",
    PeaceAndProsperity: "话升平",
    liberty: "无拘",
    peer: "同行",
    MonumentalMelodyTracey: "特蕾西娅-熠曲丰碑"
  },
  thanks: {
    designer: ["涵涵", "今天整点什么/光阴", "落尘星河", "TheLeaderOne", "圣晴天空", "培嵩"],
    special: ["容若（动皮指导）", "果敢心（提供意见）", "灭蚁强小风儿（测试）", "零羽白瑠（测试、额外皮肤包作者）", "Flandre（部分动皮参数和皮肤提供）", "豆姜（测试）"]
  }
};
export {
  whichWayConfigData
};
//# sourceMappingURL=data.js.map
