import { lib, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("youtiansiruomaimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "othermrfz",
  hp: 4,
  skills: ["leigumrfz", "jiaoyingmrfz", "wuweimrfz"],
  clans: ["AveMujica"]
});
skill({
  "leigumrfz": {
    audio: 4,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      if (!event.leigumrfz || !event.leigumrfz[player.playerid]) {
        return false;
      }
      return event.leigumrfz[player.playerid].some((value) => value === true);
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger, player) {
      if (trigger.leigumrfz[player.playerid][0] === true) await player.draw();
      if (trigger.leigumrfz[player.playerid][1] === true) {
        const { cards } = await player.chooseCard("he").set("prompt", `你可以重铸一张牌`).set("filterCard", (card) => player.canRecast(card)).set("ai", (card) => 7 - get.value(card)).forResult();
        if (cards) await player.recast(cards);
      }
      const num = lib.skill.wuweimrfz.getNum(player, "leigumrfz");
      if (num > 0) {
        player.markSkill("leigumrfz_eff");
        player.storage.leigumrfz_eff = Math.max(player.storage.leigumrfz_eff || 0, num);
        player.addTempSkill("leigumrfz_eff", { global: ["phaseEnd", "roundStart"] });
      }
    },
    group: ["leigumrfz_mark"],
    subSkill: {
      eff: {
        charlotte: true,
        silent: true,
        onremove: true,
        intro: {
          content(storage) {
            return `本回合所有牌的使用次数+${storage}`;
          }
        },
        mod: {
          // @ts-ignore
          cardUsable(card, player, num) {
            if (typeof num === "number") return num += player.storage.leigumrfz_eff || 0;
          }
        }
      },
      mark: {
        charlotte: true,
        silent: true,
        trigger: {
          player: "useCardBegin"
        },
        filter(event, player) {
          const cards = player.getCards("h");
          if (!cards.length) {
            return false;
          }
          return (event.cards || []).some((card) => cards[0] === card || cards[cards.length - 1] === card);
        },
        // @ts-ignore
        async content(event, trigger, player) {
          const cards = player.getCards("h");
          if (!trigger.leigumrfz) {
            trigger.leigumrfz = {};
          }
          trigger.leigumrfz[player.playerid] = [trigger.cards.some((card) => cards[0] === card), trigger.cards.some((card) => cards[cards.length - 1] === card)];
        }
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (typeof card == "object") {
          const cards = player.getCards("h");
          if (cards.indexOf(card) === 0) return num + 10;
          if (cards.indexOf(card) === cards.length - 1) return num + 9;
        }
      }
    },
    ai: {
      noSortCard: true
    }
  },
  "jiaoyingmrfz": {
    audio: 2,
    trigger: {
      player: ["phaseUseBegin", "phaseUseEnd"]
    },
    // @ts-ignore
    filter(event, player) {
      const num = lib.skill.wuweimrfz.getNum(player, "jiaoyingmrfz");
      return player.countCards("he") > 0 && num > 0;
    },
    // @ts-ignore
    async cost(event, trigger, player) {
      const num = lib.skill.wuweimrfz.getNum(player, "jiaoyingmrfz");
      event.result = await player.chooseCard().set("prompt", get.prompt("jiaoyingmrfz")).set("prompt2", `你可以${get.poptip("sjzx_zhiheng")}${num}`).set("ai", (card) => 8 - get.value(card)).set("selectCard", () => {
        return [1, get.event().num];
      }).set("num", num).forResult();
    },
    // @ts-ignore
    async content(event, trigger, player) {
      player.discard(event.cards);
      player.draw(event.cards.length);
    }
  }
});
translate({
  "youtiansiruomaimrfz": "祐天寺若麦",
  "leigumrfz": "擂鼓",
  "leigumrfz_info": "锁定技。<br>①你使用手牌最[左侧/右侧]的牌后，你[摸一张牌/重铸一张牌]，然后你本回合所有牌的使用次数+X（同类效果取最高值）;<br>②你不能整理手牌。",
  "jiaoyingmrfz": "校音",
  "jiaoyingmrfz_info": '出牌阶段开始或结束时，你可以${get.poptip("sjzx_zhiheng")}X。'
});
characterTitle("youtiansiruomaimrfz", "<font color = #db7093>毋畏爱意</font>");
characterIntro("youtiansiruomaimrfz", "Ave Mujica的鼓手祐天寺若麦。一直积极辅助舰内各种沟通任务，是个率直的人。平时喜欢与澄闪一起为干员们化妆，深受大家喜爱。");
//# sourceMappingURL=youtiansiruomaimrfz.js.map
