import { game, _status, get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("linguangmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "shimrfz",
  hp: 3,
  maxHp: 4,
  hujia: 3,
  skills: ["anranmrfz", "huchimrfz", "chongyaomrfz"]
});
skill({
  "anranmrfz": {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter: function(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const cards = player.getCards("h");
      player.discard(cards);
    },
    group: ["anranmrfz_draw"],
    subSkill: {
      draw: {
        audio: "anranmrfz",
        trigger: { player: "phaseBegin" },
        init: (player) => {
          player.storage.anranmrfz_draw = false;
        },
        filter: function(event, player) {
          return !player.storage.anranmrfz_draw;
        },
        forced: true,
        async content(event, trigger, player) {
          var num = player.hujia + player.hp;
          player.storage.anranmrfz_draw = true;
          player.draw(2 * num);
          player.changeHujia(-player.hujia);
          player.recover();
          player.when("phaseDiscardBefore").then(async (event2, trigger2, player2) => {
            trigger2.cancel();
            player2.logSkill("anranmrfz");
          });
        }
      }
    }
  },
  "huchimrfz": {
    audio: 2,
    usable: 1,
    enable: "phaseUse",
    filter: function(event, player) {
      return player.countCards("he") > 0;
    },
    filterTarget: function(card, player, target) {
      return target != player;
    },
    filterCard: true,
    position: "he",
    check: function(card) {
      return 6 - get.value(card);
    },
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { target, cards } = event;
      await player.give(cards, target, true);
      for (let i of cards) {
        i.storage.huchimrfz = true;
      }
      var view = get.autoViewAs({ name: "sha" }, cards);
      const result = await target.chooseTarget("【互持】:请选择使用【杀】的目标", function(card2, player2, target2) {
        var view2 = _status.event.view;
        var playerx = _status.event.playerx;
        return target2 != playerx && playerx.canUse(view2, target2);
      }).set("view", view).set("playerx", target).set("ai", (target2) => {
        var view2 = _status.event.view;
        var player2 = _status.event.playerx;
        return get.effect(target2, view2, player2, player2);
      }).forResult();
      if (result.targets) {
        var card = get.autoViewAs({ name: "sha" }, cards);
        if (target.hasCard((card2) => {
          return card2 == cards[0];
        }, "h"))
          target.useCard(result.targets[0], card, cards);
      }
    },
    ai: {
      order: 4,
      result: {
        target: function(player, target) {
          if (get.attitude(player, target) > 2) {
            if (game.hasPlayer((current) => {
              return target.canUse("sha", current) && get.attitude(player, target);
            }))
              return 2;
          }
          return 1;
        }
      }
    },
    group: ["huchimrfz_recover", "huchimrfz_gain"],
    subSkill: {
      recover: {
        trigger: {
          player: "recoverEnd",
          global: "recoverEnd"
        },
        usable: 1,
        filter: function(event, player) {
          if (!event.source.isIn() || !event.player.isIn() || event.source === void 0 || !event.player) return false;
          if (event.source == player && event.player == player) return false;
          if (event.source != player && event.player != player) return false;
          return true;
        },
        direct: true,
        async content(event, trigger, player) {
          const result = await trigger.player.chooseCardTarget({
            prompt: "【互持】:你可以将一张牌交给回复来源",
            filterCard: true,
            position: "he",
            filterTarget: function(card, player2, target) {
              var source = _status.event.source;
              return target != player2 && target == source;
            },
            ai1: function(card) {
              return 8 - get.value(card);
            },
            ai2: function(target) {
              var playerx = _status.event.playerx;
              return get.attitude(playerx, target) > 0;
            }
          }).set("source", trigger.source).set("playerx", trigger.player).forResult();
          if (result.cards && result.targets) {
            trigger.player.give(result.cards, result.targets[0]);
            trigger.player.draw();
            trigger.source.draw();
            trigger.player.logSkill("huchimrfz", trigger.source);
          } else player.storage.counttrigger.huchimrfz_recover--;
        }
      },
      gain: {
        direct: true,
        trigger: {
          player: "gainEnd",
          global: "gainEnd"
        },
        filter: function(event, player) {
          if (event.source == void 0 || event.player == void 0) return false;
          if (!event.source.isIn() || !event.player.isIn()) return false;
          if (event.source == player && event.player == player) return false;
          if (event.source != player && event.player != player) return false;
          return true;
        },
        usable: 1,
        async content(event, trigger, player) {
          const result = await trigger.player.chooseCardTarget({
            prompt: "【互持】:你可以将一张牌交给给予来源",
            filterCard: true,
            position: "he",
            filterTarget: function(card, player2, target) {
              var source = _status.event.source;
              return target != player2 && target == source;
            },
            ai1: function(card) {
              if (card.storage.huchimrfz) return 0;
              return 8 - get.value(card);
            },
            ai2: function(target) {
              var playerx = _status.event.playerx;
              return get.attitude(playerx, target) > 0;
            }
          }).set("source", trigger.source).set("playerx", trigger.player).forResult();
          if (result.cards && result.targets) {
            trigger.player.give(result.cards, result.targets[0]);
            trigger.player.draw();
            trigger.source.draw();
            trigger.player.logSkill("huchimrfz", trigger.source);
          } else player.storage.counttrigger.huchimrfz_gain--;
        }
      }
    }
  },
  "chongyaomrfz": {
    audio: 2,
    mark: true,
    intro: {
      content: function(event, player) {
        return `${player.storage.chongyaomrfz_mark["count"]}/5`;
      }
    },
    derivation: ["zhuguangmrfz"],
    init: (player) => {
      player.storage.chongyaomrfz = false;
    },
    trigger: {
      player: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
      global: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"]
    },
    filter: function(event, player) {
      return player.storage.chongyaomrfz_mark["count"] >= 5 && !player.storage.chongyaomrfz;
    },
    juexingji: true,
    skillAnimation: true,
    animationColor: "wood",
    unique: true,
    forced: true,
    async content(event, trigger, player) {
      player.loseMaxHp();
      player.addSkill("zhuguangmrfz");
      player.awakenSkill("chongyaomrfz");
      game.log(player, "获得了技能", "#g【逐光】");
      player.storage.chongyaomrfz = true;
      delete player.storage.chongyaomrfz_mark;
      player.removeSkill("chongyaomrfz_mark");
    },
    group: ["chongyaomrfz_mark", "chongyaomrfz_clear"],
    subSkill: {
      clear: {
        silent: true,
        firstDo: true,
        charlotte: true,
        trigger: {
          global: "phaseBegin"
        },
        async content(event, trigger, player) {
          player.storage.chongyaomrfz_mark["skill"] = [];
        }
      },
      mark: {
        init: (player) => {
          player.storage.chongyaomrfz_mark = {
            count: 0,
            skill: []
          };
        },
        onremove: (player) => {
          delete player.storage.chongyaomrfz_mark;
        },
        silent: true,
        charlotte: true,
        firstDo: true,
        trigger: {
          player: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
          global: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"]
        },
        async content(event, trigger, player) {
          if (!player.storage.chongyaomrfz_mark) player.storage.chongyaomrfz_mark = 0;
          for (const i of ["huchimrfz", "huchimrfz_gain", "huchimrfz_recover"]) {
            if (!player.storage?.counttrigger?.[trigger.name] && i != "huchimrfz") continue;
            if (player.storage.chongyaomrfz_mark["skill"].includes(trigger.name)) continue;
            if (i == "huchimrfz" && trigger.name == "huchimrfz") {
              player.storage.chongyaomrfz_mark["count"]++;
              player.storage.chongyaomrfz_mark["skill"].add(trigger.name);
              break;
            }
            if (player.storage.counttrigger[trigger.name] > 0) {
              player.storage.chongyaomrfz_mark["count"]++;
              player.storage.chongyaomrfz_mark["skill"].add(trigger.name);
              break;
            }
          }
        }
      }
    }
  }
});
translate({
  "linguangmrfz": "临光",
  "anranmrfz": "黯然",
  "anranmrfz_info": "锁定技，游戏开始时，你弃置所有手牌，你于你的第一个回合开始时，你摸2X张牌，失去所有护甲，回复一点体力值，且本回合跳过弃牌阶段。（X=你的体力值和护甲值之和）",
  "huchimrfz": "互持",
  "huchimrfz_info": "每项每回合限一次:</br>①当你[令一名其他角色/其他角色令你]回复一点体力,[其/你]可以交给回复来源一张牌，然后你与其各摸一张牌。</br>②当[你/其他角色]获得[其他角色/你]的牌后，[你/其]可以交给[其/你]一张牌，然后你与其各摸一张牌。</br>③出牌阶段，你可以将一张牌交给一名其他角色，其可以将此牌当作【杀】对其攻击范围内的角色使用。",
  "chongyaomrfz": "重耀",
  "chongyaomrfz_info": "觉醒技，当你发动过至少五次【互持】后，你减少一点体力上限并获得【逐光】。"
});
characterIntro("linguangmrfz", "临光，前卡西米尔耀骑士，感染者援助团体“使徒”的一员。在掩护己方队员、机动作战、歼灭战与开阔地带作战中体现出极高的战斗技巧和个人军事素养。</br>现于罗德岛作为重装干员行动，并于现场提供战术指挥支援。");
//# sourceMappingURL=linguangmrfz.js.map
