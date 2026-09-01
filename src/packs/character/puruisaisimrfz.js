import { game, ui, get, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("puruisaisimrfz", {
  pack: "plotSJZX",
  sex: "female",
  group: "qianmrfz",
  hp: 3,
  skills: ["qianmianmrfz", "neihuamrfz"]
});
skill({
  "qianmianmrfz": {
    audio: 2,
    trigger: { player: ["chooseToUseBegin", "chooseToRespondBegin"] },
    getResAndUseCard(event, player) {
      let result = [];
      for (let name of lib.inpile) {
        if (event.filterCard && event.filterCard({ name, suit: "none", number: null }, player, event)) result.add(name);
      }
      return result;
    },
    // @ts-ignore
    hiddenCard(player, name) {
      return player.countCards("h") > 0;
    },
    filter(event, player) {
      return (event.respondTo && event.respondTo[0] !== player || event.type === "wuxie") && player.countCards("h") > 0 && lib.skill.qianmianmrfz.getResAndUseCard(event, player).length > 0;
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger, player) {
      let names = lib.skill.qianmianmrfz.getResAndUseCard(trigger, player);
      let cardx = trigger.card;
      if (names.length === 1) {
        player.when({ player: ["chooseToUseAfter", "chooseToRespondAfter"] }).step(() => {
        }).assign({
          mod: {
            // @ts-ignore
            cardname(card, player2, name) {
              if (card !== cardx) return names[0];
            }
          }
        });
      }
    }
  },
  "neihuamrfz": {
    audio: 2,
    trigger: { player: ["useCardAfter", "respondAfter"] },
    // @ts-ignore
    init(player, skill2) {
      player.storage.neihuamrfz = [];
      lib.translate["neihuamrfzx"] = "信息流";
    },
    filter(event, player) {
      let nameList = player.getExpansions("neihuamrfz").map((card) => card.name);
      return !nameList.includes(event.card.name) && !event.cards.some((card) => card.neihuamrfz);
    },
    forced: true,
    mark: true,
    marktext: "信息流",
    intro: {
      name: "信息流",
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill2) {
      const cards = player.getExpansions(skill2);
      if (cards.length) player.loseToDiscardpile(cards);
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let card = trigger.card;
      let cardcopy = ui.create.card();
      let info = ["none", null, get.name(card), get.nature(card), void 0];
      cardcopy.init(info);
      cardcopy.neihuamrfz = true;
      player.addToExpansion(cardcopy, player, "give").gaintag.add("neihuamrfz");
    },
    group: ["neihuamrfz_snyc", "neihuamrfz_destroy", "neihuamrfz_snyc_lose"],
    subSkill: {
      destroy: {
        silent: true,
        charlotte: true,
        trigger: {
          global: ["loseEnd", "cardsDiscardEnd"]
        },
        // @ts-ignore
        filter(event, player) {
          if (event.name == "lose" && event.position != ui.discardPile) return false;
          for (let card of event.cards) {
            if (card.neihuamrfz) return true;
          }
          return false;
        },
        // @ts-ignore
        async content(event, trigger, player) {
          let cards = [];
          for (let card of trigger.cards) {
            if (card.neihuamrfz) cards.push(card);
          }
          game.cardsGotoSpecial(cards);
          game.log(cards, "被移出了游戏");
        }
      },
      snyc: {
        silent: true,
        charlotte: true,
        trigger: {
          player: ["addToExpansionAfter"]
        },
        // @ts-ignore
        filter(event, player) {
          return event.cards.some((card) => card.neihuamrfz);
        },
        // @ts-ignore
        async content(event, trigger, player) {
          let cards = trigger.cards.filter((card) => card.neihuamrfz);
          let cardsx = cards.map((card) => {
            let cardx = ui.create.card();
            cardx.init(get.cardInfo(card));
            cardx._cardid = card.cardid;
            cardx.neihuamrfz = true;
            return cardx;
          });
          player.directgains(cardsx, null, "neihuamrfzx");
        }
      },
      snyc_lose: {
        silent: true,
        charlotte: true,
        trigger: {
          player: ["loseBegin"]
        },
        // @ts-ignore
        filter(event, player) {
          return event.cards.filter((card) => card.neihuamrfz);
        },
        // @ts-ignore
        async content(event, trigger, player) {
          let cards = trigger.cards;
          let loseCards = player.getExpansions("neihuamrfz").filter((card) => {
            return cards.some((cardt) => cardt._cardid === card.cardid);
          });
          game.cardsGotoSpecial(loseCards, false);
        }
      }
    }
  }
});
translate({
  "puruisaisimrfz": "普瑞赛斯",
  "qianmianmrfz": "千面",
  "qianmianmrfz_info": "锁定技，当你成为牌的目标时或你需要使用【无懈可击】时，你所有的手牌均视为可以响应此牌的牌直到此牌结算完毕。",
  "neihuamrfz": "内化",
  "neihuamrfz_info": "锁定技。<br>当你使用或打出牌后，若“信息流”中没有与此牌相同牌名的牌，你创建一张与此牌名相同且无花色和点数的牌置入“信息流”之中；<br>你如手牌般使用或打出“信息流”中的牌，且当“信息流”中的牌进入弃牌堆后，销毁之。"
});
characterTitle("puruisaisimrfz", "<font color=#77be6a>女祭司</font>");
characterIntro("puruisaisimrfz", "博士面对石棺的回忆中的神秘女性人物，是源石的起点，曾与博士亲密无间。");
//# sourceMappingURL=puruisaisimrfz.js.map
