import { character, characterTitle, characterIntro, translate, skill } from "../../hooks.js";
import { ui, game, get, _status } from "noname";
character("jumrfz", {
  hp: 4,
  maxHp: 4,
  skills: ["qiaoqimrfz", "feigongmrfz"],
  pack: "epicSJZX",
  group: "yanmrfz",
  sex: "male"
});
characterTitle("jumrfz", "<font color = #2263b766>巧器</font>");
characterIntro(
  "jumrfz",
  "矩，炎国乡野间的无业游历者，经历丰富，见识广博。作为特殊的存在，本人有较高的历史研究价值。现受邀于博士，以工程技术顾问的身份暂驻罗德岛，支持日常工程建设。"
);
translate({
  jumrfz: "矩",
  qiaoqimrfz: "巧器",
  qiaoqimrfz_info: "当你于一回合内首次使用一种花色的牌结算完毕后，你可以将此牌至于牌堆或弃牌堆顶或底，然后若弃牌堆和牌堆数的个位数相等，你摸一张牌。",
  feigongmrfz: "非攻",
  feigongmrfz_info: "锁定技，结束阶段，你依次展示牌堆顶、牌堆底、弃牌堆顶、弃牌堆底各一张牌，并获得其中红色的牌，然后若你没有因此获得牌，你失去一点体力。"
});
skill({
  feigongmrfz: {
    audio: ["观看作战记录", "任命队长"],
    forced: true,
    trigger: { player: "phaseEnd" },
    async content(event, trigger, player) {
      const piles = {
        牌堆顶: _status.pileTop,
        牌堆底: ui.cardPile.childNodes[ui.cardPile.childNodes.length - 1],
        弃牌堆顶: ui.discardPile.childNodes[0],
        弃牌堆底: ui.discardPile.childNodes[ui.discardPile.childNodes.length - 1]
      };
      const copys = Object.values(piles).slice(0);
      await player.showCards(copys, `${get.translation(player)}因【非攻】而展示了牌`).set("customButton", (button) => {
        const names = get.event().names;
        let count = get.event().count;
        button.node.gaintag.innerHTML = names[count];
        count++;
      }).set("delay_time", 4).set("count", 0).set("names", Object.keys(piles));
      const cards = Object.values(piles).filter((card) => get.color(card) === "red");
      if (cards.length === 0) {
        player.loseHp();
        return;
      }
      player.gain(cards, "gain2");
    }
  },
  qiaoqimrfz: {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      const suits = player.getHistory("useCard", (evt) => evt.card && get.suit(evt.card)).map((evt) => get.suit(evt.card));
      return event.card && event.card.cards.filterInD().length > 0 && suits.filter((suit) => get.suit(event.card) === suit).length === 1;
    },
    async cost(event, trigger, player) {
      const suits = Array.from(new Set(player.getHistory("useCard", (evt) => evt.card && get.suit(evt.card)).map((evt) => get.suit(evt.card))));
      player.addTip("qiaoqimrfz_tips", `巧器 ${suits.map((i) => get.translation(i)).join(" ")}`, true);
      const result = await player.chooseControl("牌堆顶", "牌堆底", "弃牌堆顶", "弃牌堆底", "cancel2").set(
        "prompt",
        `【巧器】:你可以将【${get.translation(trigger.card)}】置于牌堆顶或底、或弃牌堆顶或底，然后若弃牌堆（${getSingleDigit(ui.cardPile.childNodes.length)}）和牌堆数（${getSingleDigit(ui.discardPile.childNodes.length)}）的个位数相等，你摸一张牌。`
      ).set("ai", () => {
        const player2 = get.player();
        const card = get.event().card;
        if (player2.hasSkill("feigongmrfz") && _status.currentPhase === player2) {
          const piles = {
            牌堆顶: _status.pileTop,
            牌堆底: ui.cardPile.childNodes[ui.cardPile.childNodes.length - 1],
            弃牌堆顶: ui.discardPile.childNodes[0],
            弃牌堆底: ui.discardPile.childNodes[ui.discardPile.childNodes.length - 1]
          };
          const hasRed = Object.values(piles).some((card2) => get.color(card2) === "red");
          if (get.value(card) < 8 && get.color(card) === "black" && ![1, -1].includes(ui.cardPile.childNodes.length - ui.discardPile.childNodes.length))
            return "cancel2";
          if (get.color(card) === "red") {
            for (let control in piles) {
              const cardx = piles[control];
              if (get.value(cardx) < get.value(card)) return control;
              if (!hasRed) return control;
            }
          }
        } else {
          if (ui.cardPile.childNodes.length - ui.discardPile.childNodes.length === -1) {
            return ["牌堆顶", "牌堆底"];
          }
          if (ui.cardPile.childNodes.length - ui.discardPile.childNodes.length === 1) {
            return ["弃牌堆顶", "弃牌堆底"];
          }
        }
        return "cancel2";
      }).set("card", trigger.card).forResult();
      event.result = {
        ...result,
        cost_data: result
      };
    },
    async content(event, trigger, player) {
      const { control } = event.cost_data;
      switch (control) {
        case "牌堆顶":
          trigger.cards.forEach((card) => ui.cardPile.insertBefore(card, ui.cardPile.firstChild));
          break;
        case "牌堆底":
          trigger.cards.forEach((card) => ui.cardPile.appendChild(card));
          break;
        case "弃牌堆顶":
          trigger.cards.forEach((card) => ui.discardPile.insertBefore(card, ui.discardPile.firstChild));
          break;
        case "弃牌堆底":
          trigger.cards.forEach((card) => ui.discardPile.appendChild(card));
          break;
      }
      game.updateRoundNumber();
      game.log(player, `将`, `【${get.translation(trigger.cards)}】`, `置于${control}`);
      if (ui.cardPile.childNodes.length - ui.discardPile.childNodes.length === 0) {
        player.draw();
      }
    }
  }
});
function getSingleDigit(num) {
  const numStr = num.toString();
  if (numStr.length === 1) {
    return Number(numStr);
  }
  return Number(numStr.charAt(numStr.length - 1));
}
//# sourceMappingURL=index.js.map
