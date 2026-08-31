import { get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("narentuyamrfz", {
  sex: "female",
  group: "samrfz",
  hp: 4,
  maxHp: 6,
  skills: ["eyanmrfz", "shafeimrfz"]
});
skill({
  "eyanmrfz": {
    audio: 2,
    trigger: { player: "useCardEnd" },
    filter(event, player) {
      let card = event.card;
      return event.cards.someInD() && get.tag(card, "damage") && game.hasPlayer((current) => player != current && current.inRangeOf(player));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget().set("prompt", get.prompt("eyanmrfz")).set("prompt2", "你可以将此牌交给攻击范围内的一名其他角色").set("filterTarget", (card, player2, target) => player2.inRange(target) && player2 != target).set("ai", (target) => {
        const player2 = get.player();
        let subtraction = player2.maxHp - target.maxHp;
        let num = get.attitude(player2, target) > 0 ? 0 : -2;
        if (get.attitude(player2, target) < 0 && subtraction - 1 >= target.countCards("h")) return 114514;
        return num - get.value(get.event().cardx) * 0.5 + Math.min(subtraction, target.countCards("h")) * 2;
      }).set("cardx", trigger.card).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.give(trigger.cards.filterInD(), target);
      let num = player.maxHp - target.maxHp;
      if (num < 1) return;
      const { cards } = num >= target.countCards("h", (card) => !get.is.shownCard(card)) ? { cards: target.getCards("h", (card) => !get.is.shownCard(card)) } : await target.chooseCard().set("prompt", `【恶魇】:请展示${num}张手牌`).set("forced", true).set("ai", (card) => -get.value(card)).set("filterCard", (card) => !get.is.shownCard(card)).set("selectCard", num).forResult();
      if (!cards) return;
      target.addShownCards(cards, "visible_eyanmrfz");
    }
  },
  "shafeimrfz": {
    audio: 2,
    trigger: { global: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player != event.player && event.player.countCards("h", (card) => get.is.shownCard(card)) > 0;
    },
    prompt2(event, player) {
      const cards = event.player.getCards("h", (card) => get.is.shownCard(card));
      return `你可以获得${get.translation(event.player)}的${cards.length}张牌(${get.translation(cards)})`;
    },
    async content(event, trigger, player) {
      const cards = trigger.player.getCards("h", (card) => get.is.shownCard(card));
      player.gain(cards, "gain2");
    }
  }
});
translate({
  "narentuyamrfz": "娜仁图亚",
  "eyanmrfz": "恶魇",
  "eyanmrfz_info": "当你使用的带有伤害类标签的牌结算完毕后，你可以将此牌交给一名你攻击范围内的其他角色，然后其须明置X张手牌。（X=你与其体力上限之差，X至少为1）",
  "shafeimrfz": "沙匪",
  "shafeimrfz_info": "任意角色的准备阶段，你可以获得其手牌中所有的明置牌。"
});
characterTitle("narentuyamrfz", "<font color=#00868B>征踏天途</font>");
characterIntro("narentuyamrfz", "娜仁图亚，曾是足迹遍布萨尔贡大半地区的沙盗，现作为外勤干员长期驻留罗德岛，凭借自己丰富的自然知识与生存技巧，活跃于各种野外行动。");
//# sourceMappingURL=index.js.map
