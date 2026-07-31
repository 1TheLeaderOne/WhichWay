import { character, characterIntro, characterTitle, translate, skill } from "../../hooks.js";
import { get, ui, lib, game } from "noname";
character("liexiangmrfz", {
  sex: "female",
  group: "wumrfz",
  hp: 4,
  skills: ["xuekuangmrfz", "buxiumrfz"],
  pack: "epicSJZX"
});
characterIntro("liexiangmrfz", "裂响，本名瑭雅，原乌萨斯泽尔格勒工人，曾在泽尔格勒以“整合运动”名号发起反抗运动，后经弑君者介绍来到罗德岛接受治疗，并以正式干员身份参与罗德岛外勤任务。");
characterTitle("liexiangmrfz", "<font color = #e81490>血钻</font>");
translate({
  liexiangmrfz: "裂响",
  xuekuangmrfz: "血矿",
  xuekuangmrfz_info: "锁定技。①当你不因【血矿】而获得牌后，你从游戏外获得一张【毒】（离开你的手牌区后销毁之）<br>;②你的手牌上限和使用【杀】的次数+X。（X = 你手牌中【毒】的数量，X至多为你的体力上限）",
  buxiumrfz: "不休",
  buxiumrfz_info: "锁定技，当你使用牌后，你摸一张牌，将一张手牌背面朝上置入牌堆底，然后你下一张牌不能使用与你此次使用的牌花色相同的牌。"
});
skill({
  xuekuangmrfz: {
    mod: {
      maxHandcard(player, num) {
        return num += Math.min(4, player.countCards("h", (card) => get.name(card) === "du"));
      },
      cardUsable(card, player, num) {
        if (get.name(card) === "sha") {
          return num += Math.min(4, player.countCards("h", (card2) => get.name(card2) === "du"));
        }
      }
    },
    audio: ["作战中1", "作战中2"],
    forced: true,
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    init(player, skill2) {
      game.broadcastAll(() => {
        lib.translate["xuekuangmrfz_tag"] = "<font color = red>“血钻”</font>";
      });
    },
    filter(event, player, name, target) {
      return event.getg(player).length && event.getParent("xuekuangmrfz")?.player !== player;
    },
    async content(event, trigger, player) {
      const card = game.createCard("du", ["club", "spade"].randomGet(), [1, 5, 7, 8, 13].randomGet());
      card.storage.xuekuangmrfz = true;
      await player.gain({
        cards: [card],
        animate: "gain2",
        gaintag: ["xuekuangmrfz_tag"]
      });
    },
    group: "xuekuangmrfz_destroy",
    subSkill: {
      destroy: {
        charlotte: true,
        silent: true,
        audio: false,
        trigger: {
          player: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
        },
        filter: function(event, player) {
          let evt = event.getl(player);
          if (!evt || !evt.cards) return false;
          for (let i of evt.cards) {
            if (i.storage.xuekuangmrfz == true) return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          let cards = [];
          let evt = trigger.getl(player);
          if (evt && evt.cards) {
            for (let i of evt.cards) {
              if (i.storage.xuekuangmrfz == true) cards.push(i);
            }
          }
          game.cardsGotoSpecial(cards);
          game.log(cards, "被销毁了");
        }
      }
    }
  },
  buxiumrfz: {
    audio: ["作战中3", "作战中4"],
    forced: true,
    trigger: {
      player: "useCardAfter"
    },
    onremove(player, type) {
      delete player.storage[type];
      player.removeTip("buxiumrfz_tip");
    },
    mark: true,
    intro: {
      content(storage, player, skill2) {
        if (!lib.suits.includes(storage)) {
          return `·无效果`;
        }
        return `·无法使用花色为${get.translation(storage)}的牌`;
      }
    },
    async content(event, trigger, player) {
      await player.draw();
      if (player.countCards("h") > 0) {
        const { cards } = await player.chooseCard({
          prompt: "【不休】:将一张手牌以背面朝上的置入牌堆底",
          ai(card) {
            return -get.value(card);
          },
          forced: true
        }).forResult();
        if (cards) {
          await player.loseToDiscardpile({
            cards,
            position: ui.cardPile
          }).set("log", false).set("blank", true);
        }
      }
      const suit = get.suit(trigger.card);
      player.storage.buxiumrfz = suit;
      player.addTip("buxiumrfz_tip", `不休${get.translation(suit)}`);
      player.when({ player: "useCardEnd" }).step(async (event2, trigger2, player2) => {
      }).assign({
        mod: {
          cardEnabled2(card, player2, result) {
            if (get.suit(card) === player2.storage.buxiumrfz) {
              return false;
            }
          }
        }
      });
    }
  }
});
//# sourceMappingURL=index.js.map
