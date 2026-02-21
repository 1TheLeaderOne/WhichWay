import { character, skill, characterTitle, translate } from "../../hooks.js";
import { get } from "noname";
character("wangmrfz", {
  sex: "male",
  group: "suimrfz",
  skills: ["qushimrfz", "dingshengmrfz"],
  hp: 4
});
skill({
  qushimrfz: {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4", "部署1", "部署2", "行动出发", "行动开始"]
  },
  dingshengmrfz: {
    audio: ["精英化晋升2", "编入队伍"]
  }
});
characterTitle("wangmrfz", "<font color = #2263b766>胜天半子</font>");
translate({
  wangmrfz: "望",
  qushimrfz: "取势",
  qushimrfz_info: `锁定技,当你首次使用一种牌名的普通锦囊牌时，你为该种牌名的牌选择一个效果，你对应的牌获得对应的效果：<br>朔：对此牌的一名目标角色造成一点伤害;<br>望：可当【无懈可击】使用;<br>令：结算完毕后视为使用一张【酒】;<br>均：无法被其他角色响应;<br>颉：视为使用一张你本回合使用过的基本牌（无次数限制）;<br>黍：下次摸牌数翻倍;<br>绩：将手牌补至手牌上限（至多为5）;<br>易：${get.poptip("sjzx_zhiheng")}3;<br>年：随机获得一个武器牌的技能直到回合结束;<br>夕：额外结算一次;<br>方：回复一点体力;<br>余：选择从牌堆中获得任意类型的一张牌。`,
  dingshengmrfz: "定胜",
  dingshengmrfz_info: "限定技，出牌阶段开始时，你可以从牌堆或弃牌堆中获得本局游戏你使用过的普通锦囊牌各一张，且令其他角色从牌堆或弃牌堆中获得你未因此获得的普通锦囊牌各一张，其他角色因此获得的牌视为【无懈可击】。"
});
//# sourceMappingURL=index.js.map
