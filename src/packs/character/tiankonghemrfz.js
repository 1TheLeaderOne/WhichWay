import { get, game } from "noname";
import { whichWayUtil } from "../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("tiankonghemrfz", {
  pack: "epicSJZX",
  sex: "male",
  group: "gemrfz",
  hp: 4,
  skills: ["souchamrfz", "tiankonghe_zhenlimrfz"]
});
skill({
  "souchamrfz": {
    audio: ["任命队长", "行动开始"],
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    filter(event, player) {
      const source = event.source;
      if (source === player) return event.player && event.player.isIn() && player.canCompare(event.player);
      return source && source.isIn() && player.canCompare(source);
    },
    prompt2(event) {
      return `你可以与${get.translation(get.player() === event.player ? event.player : event.source)}拼点,若你赢,你观看其手牌并获得其中一张牌`;
    },
    async content(event, trigger, player) {
      const target = trigger.source === player ? trigger.player : trigger.source;
      const result = await player.chooseToCompare(target).set("prompt", `【搜查】：请选择一张手牌与${get.translation(target)}拼点`).set("forced", true).set("ai", (card) => {
        const player2 = get.player();
        let max;
        for (let card2 of player2.getCards("h")) {
          if (!max) max = card2;
          if (get.number(max) <= get.number(card2)) max = get.value(card2) > get.number(max) ? max : card2;
        }
        return card === max ? 1 : 0;
      }).forResult();
      if (!result) return;
      if (result.winner === player) {
        player.gainPlayerCard(target, true, "h").set("visible", true).set("filterButton", () => true).set("prompt", `获得${get.translation(target)}的一张手牌`);
      }
    }
  },
  "tiankonghe_zhenlimrfz": {
    audio: ["作战中3", "作战中4"],
    trigger: {
      player: "compare",
      target: "compare"
    },
    usable: 1,
    filter(event, player) {
      if (event.player === player && event.num1 > event.num2) return false;
      if (event.player !== player && event.num1 < event.num2) return false;
      return !event.iwhile;
    },
    check(event) {
      let player = get.player();
      return game.hasPlayer((char) => char !== player && get.effect(char, { name: "sha" }, player, player) > 0 && event.list.includes(char));
    },
    async content(event, trigger, player) {
      const targets = trigger.list.filter((char) => char !== player);
      const random = whichWayUtil.getRandomNumber();
      await player.chooseUseTarget({
        card: get.autoViewAs({ name: "sha", storage: { tiankonghe_zhenlimrfz: random } })
      }).set("forced", true).set("addCount", false).set("nodistance", true).set("filterTarget", (card, player2, target) => targets.includes(target)).set("prompt", `【真理】:对参与拼点的其他角色视为使用一张【杀】`);
      if (player.hasHistory("sourceDamage", (evt) => evt.card && evt.card?.storage.tiankonghe_zhenlimrfz === random)) {
        trigger[trigger.player === player ? "num1" : "num2"] += 1908;
        game.log(whichWayUtil.colorize(`#r天空管理局突击中#`));
        game.log(player, "的拼点牌点数+1908");
      }
    }
  }
});
translate({
  "tiankonghemrfz": "天空盒",
  "souchamrfz": "搜查",
  "souchamrfz_info": "当你[造成/受到]伤害后，你可以与[受到伤害的一名角色/伤害来源]拼点，若你赢，你观看其手牌并获得一张牌。",
  "tiankonghe_zhenlimrfz": "真理",
  "tiankonghe_zhenlimrfz_info": "每回合限一次，当你亮出拼点牌时,若你的拼点牌点数不是拼点牌中唯一最大的,你可以视为对一名参与此次拼点的其他角色使用一张【杀】，若此【杀】造成了伤害，你令点数+1908。"
});
characterTitle("tiankonghemrfz", "<font color = #2263b766>管理局突击中</font>");
characterIntro("tiankonghemrfz", "高登·谭农，哥伦比亚人，在“螺旋桨天堂”事件后，升任哥伦比亚烟酒施术单元以及源石制品管理局探员总管，并恢复“螺旋桨天堂”总长官身份。现与罗德岛达成合作，既以管理局的名义帮助罗德岛打通矿石病药物进入哥伦比亚市场的合法渠道，也以“螺旋桨天堂”的名义与罗德岛共同进行天空相关的科研。");
