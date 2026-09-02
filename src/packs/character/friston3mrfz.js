import { get, game, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("friston3mrfz", {
  pack: "mediocreSJZX",
  sex: "male",
  group: "luomrfz",
  hp: 4,
  skills: ["shantanmrfz"]
});
skill({
  "shantanmrfz": {
    audio: 2,
    trigger: { global: "gainAfter" },
    filter: function(event, player) {
      return event.player != player && !player.hasSkill("shantanmrfz_ban");
    },
    prompt: "【善谈】:是否摸一张牌？",
    async content(event, trigger, player) {
      await player.draw();
      if (player.isMaxHandcard(true)) {
        player.addTempSkill("shantanmrfz_ban", { global: "roundStart" });
      }
    },
    group: "shantanmrfz_give",
    subSkill: {
      give: {
        audio: "shantanmrfz",
        trigger: {
          global: ["loseAfter", "loseAsyncAfter"]
        },
        filter: function(event, player) {
          if (event.type != "discard") return false;
          if (player.countCards("he") < 1) return false;
          if (player.hasSkill("shantanmrfz_used")) return false;
          return game.hasPlayer((current) => {
            if (current == player) return false;
            var evt = event.getl(current);
            if (!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 1) return false;
            return true;
          });
        },
        check: function(event, player) {
          return get.attitude(player, event.player) > 0;
        },
        prompt: function(event, player) {
          return "【善谈】:你可以弃置一张牌令" + get.translation(event.player) + "获得其弃置的牌";
        },
        async content(event, trigger, player) {
          if (player.countCards("he") <= 0) return;
          const result = await player.chooseToDiscard(true, 1, "he", "【善谈】:请弃置一张牌").set("card", (card) => get.value(card) < 8).forResult();
          if (result.cards) {
            var targets = [], cardsList = [];
            var players = game.filterPlayer().sortBySeat(_status.currentPhase);
            for (var current of players) {
              if (current == player) continue;
              var cards = [];
              var evt = trigger.getl(current);
              if (!evt || !evt.cards2) continue;
              var cardsx = evt.cards2.filterInD("d");
              cards.addArray(cardsx);
              if (cards.length) {
                targets.push(current);
                cardsList.push(cards);
              }
            }
            targets[0].gain(cardsList[0], "gain2");
            player.addTempSkill("shantanmrfz_used", { global: "phaseEnd" });
          }
        }
      },
      used: {
        charlotte: true
      },
      ban: {
        mark: true,
        charlotte: true,
        intro: {
          content: "【善谈①】本轮失效"
        }
      }
    }
  }
});
translate({
  "friston3mrfz": "弗里斯腾",
  "shantanmrfz": "善谈",
  "shantanmrfz_info": "①当有其他角色获得牌后，你可以摸一张牌，然后若你手牌是全场唯一最多的，本轮【善谈①】失效。</br>②每回合限一次，当其他角色有牌因弃置进入弃牌堆时，你可以弃置一张牌，令其获得其弃置的牌。"
});
characterIntro("friston3mrfz", "S-C型四轮作业平台Friston-3，罗德岛智能作业平台研发团队正式成立后的首个成果。Friston-3由可露希尔亲自主持概念设计、落地组装与测试应用，依托于PRTS，实现了从底层代码到外部模块的全面革新。相比罗德岛上的其他改型作业平台，他更加轻便，却拥有更为全面也更为稳定的性能，现作为重装干员参与相关作战任务。</br>【权限记录】</br>有关Friston-3核心代码的来源、编写思路及更多的设计细节，暂不向各位干员开放查询权限，如有疑问可直接咨询可露希尔。");
