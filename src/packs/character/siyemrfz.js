import { game, get, ui } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("siyemrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "xumrfz",
  hp: 1,
  skills: ["qunxingmrfz", "langqunmrfz"]
});
skill({
  "langqunmrfz": {
    mark: true,
    marktext: "狼群",
    intro: {
      name: "狼群",
      content: "有#个狼"
    },
    audio: 4,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter: function(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      player.addMark("langqunmrfz", 2);
    },
    mod: {
      maxHandcard: function(player, num) {
        if (player.hasMark("langqunmrfz")) return num + 1;
      }
    },
    group: ["langqunmrfz_gainb", "langqunmrfz_damage", "langqunmrfz_discard"],
    subSkill: {
      gainb: {
        audio: "langqunmrfz",
        trigger: {
          player: "loseAfter",
          global: "loseAsyncAfter"
        },
        frequent: true,
        filter: function(event, player) {
          if (event.getlx === false) return false;
          if (player.countMark("langqunmrfz") > 2) return false;
          return !player.hasSkill("langqunmrfz2");
        },
        async content(event, trigger, player) {
          player.addMark("langqunmrfz");
          player.addTempSkill("langqunmrfz2");
        }
      },
      damage: {
        audio: "langqunmrfz",
        trigger: { target: "useCardToTargeted" },
        filter: function(event, player) {
          return player.countMark("langqunmrfz") > 0 && get.tag(event.card, "damage");
        },
        prompt: function(event, player) {
          return "你可以移去一个‘狼群’标记并令此牌(" + get.translation(event.card) + ")取消你为目标(剩余‘狼群’数:" + player.countMark("langqunmrfz") + ")";
        },
        async content(event, trigger, player) {
          trigger.targets.remove(player);
          if (trigger.parent) trigger.parent.triggeredTargets2.remove(player);
          trigger.untrigger();
          player.removeMark("langqunmrfz");
        }
      },
      discard: {
        audio: "langqunmrfz",
        forced: true,
        trigger: { player: "phaseDiscardEnd" },
        async content(event, trigger, player) {
          var cards = [];
          game.getGlobalHistory("cardMove", (evt) => {
            if (evt.name == "cardsDiscard") {
              if (evt.getParent("phaseDiscard") == trigger) {
                var moves = evt.cards.filterInD("d");
                cards.addArray(moves);
              }
            }
            if (evt.name == "lose") {
              if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) return false;
              var moves = evt.cards.filterInD("d");
              cards.addArray(moves);
            }
            return false;
          });
          player.draw(Math.floor(cards.length / 2) + 1);
        }
      }
    }
  },
  "qunxingmrfz": {
    marktext: "群仇",
    intro: {
      name: "群仇",
      content: "你被狼群盯上了"
    },
    audio: 4,
    trigger: { target: "useCardToTarget" },
    filter: function(event, player) {
      return event.player != player && event.player.countMark("qunxingmrfz") < 6;
    },
    prompt: function(event, player) {
      return "是否令" + get.translation(event.player) + "获得一个‘群仇’标记";
    },
    check: function(event, player) {
      return get.attitude(player, event.player) < 2;
    },
    async content(event, trigger, player) {
      trigger.player.addMark("qunxingmrfz");
      player.line(trigger.player);
    },
    mod: {
      targetInRange: function(card, player, target) {
        if (target.hasMark("qunxingmrfz")) {
          return true;
        }
      }
    },
    group: ["qunxingmrfz_damage", "qunxingmrfz_dirhit"],
    subSkill: {
      damage: {
        audio: "qunxingmrfz",
        trigger: { source: "damageEnd" },
        filter: function(event, player) {
          return event.player.hasMark("qunxingmrfz");
        },
        forced: true,
        async content(event, trigger, player) {
          var target = trigger.player;
          player.draw(target.countMark("qunxingmrfz"));
          target.removeMark("qunxingmrfz", player.countMark("qunxingmrfz"));
        }
      },
      dirhit: {
        audio: "qunxingmrfz",
        forced: true,
        trigger: { player: "useCard" },
        filter: function(event, player) {
          return event.card && //@ts-ignore
          (get.type(event.card) == "trick" || //@ts-ignore
          get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)) && game.hasPlayer(function(current) {
            return current != player && current.hasMark("qunxingmrfz");
          });
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player && current.hasMark("qunxingmrfz");
            })
          );
          player.line(
            game.filterPlayer(function(current) {
              return current != player && current.hasMark("qunxingmrfz");
            })
          );
        },
        ai: {
          directHit_ai: true,
          skillTagFilter: function(player, tag, arg) {
            return arg.target.hasMark("qunxingmrfz");
          }
        }
      }
    },
    ai: {
      expose: 0.1
    }
  }
});
translate({
  "siyemrfz": "伺夜",
  "langqunmrfz": "狼群",
  "langqunmrfz_info": "①锁定技，[游戏开始时/当你于此回合第一次失去牌时]，若你的‘狼群’标记数不大于2,你获得[2/1]个‘狼群’标记；你的弃牌阶段结束时，你摸X+1张牌（X=本阶段进入弃牌堆的牌的数量的一半，向下取整）；当你有‘狼群’标记时，你的手牌上限+1。②当你成为带有伤害类标签的牌的目标后，你可移去一个‘狼群’标记并取消之。",
  "qunxingmrfz": "群性",
  "qunxingmrfz_info": "①锁定技，你对有‘群仇’标记的角色使用牌无距离限制且其无法响应你使用的牌；当你对有‘群仇’的角色造成伤害后，你摸X张牌，然后其移去所有‘群仇’标记（X=其‘群仇’标记数）。②当你成为其他角色使用牌的目标时，你可以令其获得一个‘群仇’标记（最多为6）。"
});
characterIntro("siyemrfz", "伺夜，叙拉古贝洛内家族最后一任领袖，叙拉古特别行政城市新沃尔西尼市长候补之一，通过干员德克萨斯，代表所属城市与罗德岛建立合作关系。</br>擅长中距离战斗，并且在种种任务上展现出了相当的谋略与领导力。");
//# sourceMappingURL=siyemrfz.js.map
