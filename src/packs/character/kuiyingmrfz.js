import { get, game, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("kuiyingmrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "weimrfz",
  hp: 3,
  skills: ["xuyingmrfz", "xuegemrfz", "huanxiangmrfz"]
});
skill({
  "xuyingmrfz": {
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove: function(player, skill2) {
      var cards = player.getExpansions(skill2);
      if (cards.length) player.loseToDiscardpile(cards);
    },
    audio: 2,
    trigger: { player: "useCard" },
    direct: true,
    notemp: true,
    filter: function(event, player) {
      if (event.xuyingmrfz_buff || !event.targets.length || player.hasSkill("xuyingmrfz_buff")) return false;
      var type = get.type(event.card, false);
      if (type != "basic" && type != "trick" && player.getExpansions("xuyingmrfz").length > 0) return false;
      return player.getExpansions("xuyingmrfz").filter(function(magic) {
        return get.type2(magic) != get.type2(event.card);
      }).length;
    },
    async content(event, trigger, player) {
      var cards = player.getExpansions("xuyingmrfz").filter(function(magic) {
        return get.type2(magic) != get.type2(trigger.card);
      });
      if (!cards.length) return;
      const { links } = await player.chooseButton(["你可以选择移去一张与你使用的牌类型不同的“虚影”，令此牌结算两次", cards]).forResult();
      if (links) {
        player.logSkill("xuyingmrfz");
        player.loseToDiscardpile(links);
        player.addTempSkill("xuyingmrfz_buff", "phaseUseAfter");
        trigger.xuyingmrfz_buff = player;
      }
    },
    group: ["xuyingmrfz_discard", "xuyingmrfz_judge"],
    subSkill: {
      discard: {
        audio: "xuyingmrfz",
        trigger: { global: "loseAfter" },
        filter: function(event, player) {
          if (event.type != "discard" || event.getlx === false) return false;
          if (player.getExpansions("xuyingmrfz").length >= 3) return false;
          var cards = event.cards.slice(0);
          event.getl(player);
          for (var i = 0; i < cards.length; i++) {
            if (cards[i].original != "j" && get.suit(cards[i], event.player) == "spade" && get.position(cards[i], true) == "d") {
              return true;
            }
          }
          return false;
        },
        direct: true,
        async content(event, trigger, player) {
          if (trigger.delay == false) game.delay();
          var cards = [], cards2 = trigger.cards.slice(0);
          trigger.getl(player);
          var num = player.getExpansions("xuyingmrfz").length;
          for (var i = 0; i < cards2.length; i++) {
            if (cards2[i].original != "j" && get.suit(cards2[i], trigger.player) == "spade" && get.position(cards2[i], true) == "d") {
              cards.push(cards2[i]);
            }
          }
          let result;
          if (cards.length && num + cards.length <= 3) {
            result = await player.chooseButton(["虚影：选择置于武将牌上的牌", cards], [1, cards.length]).set("ai", function(button) {
              return get.value(button.link, _status.event.player, "raw");
            }).forResult();
          } else if (cards.length) {
            result = await player.chooseButton(["虚影：选择置于武将牌上的牌", cards], [1, 3 - num]).set("ai", function(button) {
              return get.value(button.link, _status.event.player, "raw");
            }).forResult();
          }
          if (result && result.bool && result.links && result.links.length) {
            player.logSkill("xuyingmrfz");
            player.addToExpansion(result.links, player, "giveAuto").gaintag.add("xuyingmrfz");
          }
        }
      },
      judge: {
        audio: 2,
        trigger: { global: "cardsDiscardAfter" },
        direct: true,
        filter: function(event, player) {
          var evt = event.getParent().relatedEvent;
          if (!evt || evt.name != "judge") return;
          if (player.getExpansions("xuyingmrfz").length >= 3) return false;
          if (get.position(event.cards[0], true) != "d") return false;
          return get.suit(event.cards[0]) == "spade";
        },
        async content(event, trigger, player) {
          var card = trigger.cards.length;
          var num = player.getExpansions("xuyingmrfz").length;
          let result;
          if (card + num <= 3)
            result = await player.chooseButton(["虚影：选择置于武将牌上的牌", trigger.cards], [1, card]).set("ai", function(button) {
              return get.value(button.link, _status.event.player, "raw");
            }).forResult();
          else
            result = await player.chooseButton(["虚影：选择置于武将牌上的牌", trigger.cards], [1, 3 - num]).set("ai", function(button) {
              return get.value(button.link, _status.event.player, "raw");
            }).forResult();
          if (result && result.links && result.bool && result.links.length) {
            player.logSkill("xuyingmrfz");
            player.addToExpansion(result.links, player, "giveAuto").gaintag.add("xuyingmrfz");
          }
        }
      },
      buff: {
        trigger: { global: "useCardToTargeted" },
        forced: true,
        charlotte: true,
        popup: false,
        lastDo: true,
        filter: function(event, player) {
          return event.parent && event.parent.xuyingmrfz_buff == player && event.targets.length == event.parent.triggeredTargets4.length;
        },
        async content(event, trigger, player) {
          if (!trigger.parent) return;
          trigger.parent.targets = trigger.parent.targets.concat(trigger.targets);
          trigger.parent.triggeredTargets4 = trigger.parent.triggeredTargets4.concat(trigger.targets);
          player.removeSkill("xuyingmrfz_buff");
        },
        onremove: true
      }
    }
  },
  "xuegemrfz": {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter: function(event, player) {
      return game.hasPlayer(function(target) {
        return target != player && player.inRange(target);
      });
    },
    check: function(event, player) {
      return game.hasPlayer(function(target) {
        return target != player && get.attitude(player, target) < 2 && player.inRange(target);
      });
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget("请选择【血歌】的目标", "对一名你的攻击范围内其他角色造成一点伤害", true, function(card, player2, target) {
        return target != player2 && player2.inRange(target);
      }).set("ai", (target) => -get.attitude(player, target)).forResult();
      if (result.targets) {
        player.line(result.targets);
        result.targets[0].damage();
        if (result.targets[0].hp > player.hp || player.getExpansions("xuyingmrfz").length >= 3) return;
      }
      if (player.countCards("he") && player.getExpansions("xuyingmrfz").length >= 3) return;
      const { cards } = await player.chooseCard("你可以将一张牌置于武将牌上作为“虚影”", "he").set("ai", (card) => 6 - get.value(card)).forResult();
      if (cards && cards.length) {
        player.addToExpansion({
          cards,
          source: player,
          animate: "giveAuto"
        }).gaintag.add("xuyingmrfz");
      }
    }
  },
  "huanxiangmrfz": {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter: function(event, player) {
      return event.card && (event.card.name == "shan" || event.card.name == "wuxie");
    },
    frequent: true,
    async content(event, trigger, player) {
      player.draw();
    }
  }
});
translate({
  "kuiyingmrfz": "傀影",
  "xuyingmrfz": "虚影",
  "xuyingmrfz_info": "当有黑桃牌因弃置进入弃牌堆后，你可以将其置于你的武将牌上，称为‘影’（影的上限至多为3）；当你使用一张基本或非延时锦囊牌时，你可以移去一张与你使用的牌类别不同的‘影’，然后此牌结算两次。",
  "xuegemrfz": "血歌",
  "xuegemrfz_info": "当你受到伤害后，你可以你攻击范围内的一名角色造成一点伤害，然后若该角色体力值不大于你，你可以将一张牌作为‘影’置于武将牌上。",
  "huanxiangmrfz": "幻象",
  "huanxiangmrfz_info": "当你使用或打出一张【闪】或【无懈可击】结算完成后，你可以摸一张牌。"
});
characterIntro("kuiyingmrfz", "独自行动于维多利亚及周边地区的刺客傀影，过去行踪难以查定，背景履历尚未完全实证。</br>现作为特种干员加入罗德岛，作战能力优秀，但仍需谨慎对待。");
