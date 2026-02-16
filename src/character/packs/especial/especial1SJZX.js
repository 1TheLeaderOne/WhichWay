import { game, _status, get } from "noname";
window.whichWaySave.tmpSave;
const especial1SJZX = {
  character: {},
  skill: {
    //friston3 弗里斯腾3
    shantanmrfz: {
      audio: 2,
      trigger: { global: "gainAfter" },
      filter: function(event, player2) {
        return event.player != player2 && !player2.hasSkill("shantanmrfz_ban");
      },
      prompt: "【善谈】:是否摸一张牌？",
      content: function() {
        "step 0";
        player.draw();
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
          filter: function(event, player2) {
            if (event.type != "discard") return false;
            if (player2.countCards("he") < 1) return false;
            if (player2.hasSkill("shantanmrfz_used")) return false;
            return game.hasPlayer((current) => {
              if (current == player2) return false;
              var evt = event.getl(current);
              if (!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 1) return false;
              return true;
            });
          },
          check: function(event, player2) {
            return get.attitude(player2, event.player) > 0;
          },
          prompt: function(event, player2) {
            return "【善谈】:你可以弃置一张牌令" + get.translation(event.player) + "获得其弃置的牌";
          },
          content: function() {
            "step 0";
            if (player.countCards("he") > 0) player.chooseToDiscard(true, 1, "he", "【善谈】:请弃置一张牌");
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
  }
};
export {
  especial1SJZX as default
};
//# sourceMappingURL=especial1SJZX.js.map
