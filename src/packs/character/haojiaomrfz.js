import { game, get, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("haojiaomrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 4,
  skills: ["xuezhanmrfz", "dunpaomrfz", "biaohaomrfz"]
});
skill({
  "dunpaomrfz": {
    derivation: "dunpaomrfz_rewrite",
    audio: 2,
    trigger: { player: "phaseBegin" },
    check: function(event, player) {
      return (
        //@ts-ignore
        game.countPlayer() <= 4 && game.hasPlayer(function(current) {
          return get.attitude(player, current) < 0 && get.distance(player, current) == 1;
        }) || !game.hasPlayer(function(current) {
          return get.attitude(player, current) >= 0 && current != player;
        })
      );
    },
    filter: function(event, player) {
      return !player.storage.dunpaomrfz;
    },
    async content(event, trigger, player) {
      player.storage.dunpaomrfz = true;
    },
    mod: {
      maxHandcard: function(player, num) {
        if (player.storage.dunpaomrfz) return num + 2;
      },
      playerEnabled: function(card, player, target) {
        if (!player.storage.dunpaomrfz && get.distance(player, target) <= 1 && target != player) return false;
      },
      attackRange: function(player, num) {
        if (!player.storage.dunpaomrfz) return num + 5;
      }
    },
    group: "dunpaomrfz_add",
    subSkill: {
      add: {
        audio: "biaohaomrfz",
        forced: true,
        trigger: { source: "damageBegin3" },
        filter: function(event, player) {
          if (player.storage.dunpaomrfz) return false;
          return event.card && event.card.name == "sha" && event.player != player && get.distance(player, event.player) > 1;
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          const result = await target.judge(function(card) {
            var color = get.color(card);
            if (color == "black") return -4;
            return 0;
          }).set("judge2", (result2) => result2.bool == false ? true : false).forResult();
          if (result.color == "black") trigger.num++;
        }
      }
    }
  },
  "biaohaomrfz": {
    audio: 6,
    chargeSkill: true,
    enable: "phaseUse",
    usable: 2,
    filter: function(event, player) {
      return player.countMark("charge") < 4 && player.hasCard(function(card) {
        return get.tag(card, "damage");
      });
    },
    filterCard: function(card) {
      return get.tag(card, "damage");
    },
    position: "he",
    check: function(card) {
      if (card.name == "sha") return 1;
      if (card.name == "nanman" || card.name == "wanjian") return -1;
      return 10 - get.value(card);
    },
    async content(event, trigger, player) {
      player.addMark("charge");
      player.draw();
    },
    group: ["biaohaomrfz_usesha", "biaohaomrfz_allin"],
    subSkill: {
      usesha: {
        audio: "biaohaomrfz",
        enable: "chooseToUse",
        viewAs: { name: "sha", isCard: true },
        filterCard: function() {
          return false;
        },
        viewAsFilter: function(player) {
          if (player.countMark("charge") <= 0) return false;
        },
        selectCard: -1,
        prompt: "视为使用一张杀",
        async precontent(event, trigger, player) {
          player.removeMark("charge");
        },
        ai: {
          order: function() {
            var player = _status.event.player;
            if (!game.hasPlayer((current) => {
              return !!player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0;
            })) {
              return 0;
            }
            return 2.95;
          },
          skillTagFilter: function(player, tag, arg) {
            if (arg != "use") return false;
          },
          respondSha: true
        }
      },
      allin: {
        enable: "phaseUse",
        filter: function(event, player) {
          return player.countMark("charge") >= 4;
        },
        delay: 0,
        async content(event, trigger, player) {
          let result;
          result = await player.chooseControl("确定", "取消").set("prompt", get.prompt("biaohaomrfz")).set("prompt2", "你可以消耗 4 点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去 3 点体力。").forResult();
          if (result.control === "取消") {
            return;
          } else {
            player.logSkill("biaohaomrfz");
            player.removeMark("charge", 4);
          }
          let num = 0;
          while (num < 4) {
            num++;
            await player.chooseUseTarget(
              {
                name: num < 4 ? "sha" : "wanjian",
                isCard: true
              },
              "请选择【杀】的目标 (【杀】:" + (num < 4 ? num : 3) + "/3;【万箭齐发】:0/1)",
              false
            );
            player.logSkill("biaohaomrfz");
          }
          await player.loseHp(3);
        },
        ai: {
          order: 3,
          result: {
            player: 1
          }
        }
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  },
  "xuezhanmrfz": {
    audio: 2,
    forced: true,
    trigger: { player: "dieBegin" },
    filter: function(event, player) {
      return !player.storage.xuezhanmrfz;
    },
    async content(event, trigger, player) {
      player.storage.xuezhanmrfz = true;
      await player.chooseToDiscard("hej", true, player.countCards("hej"));
      trigger.cancel();
      game.log(player, "复活");
      if (player.getDamagedHp()) player.recover(player.maxHp);
      if (player.maxHp >= 2) player.loseMaxHp(player.maxHp - 2);
      else player.gainMaxHp(2 - player.maxHp);
      player.draw(4);
      player.link(false);
      player.turnOver(false);
    }
  }
});
translate({
  "haojiaomrfz": "号角",
  "dunpaomrfz": "盾炮",
  "dunpaomrfz_info": "锁定技，你的攻击范围+5，你不能指定与你距离为1的角色为目标；当你使用【杀】对距离你大于1的角色造成伤害时，该角色进行判定，若不为红色，此伤害+1；回合开始时，你可以修改此技能。",
  "dunpaomrfz_rewrite": "盾炮·修改",
  "dunpaomrfz_rewrite_info": "锁定技，你的手牌上限+2。",
  "biaohaomrfz": "飙号",
  "biaohaomrfz_info": "蓄力技（0/4），出牌阶段限两次，你可以弃置一张带有伤害类标签的牌，然后你增加一点蓄力值；你可以按照下列规则消耗蓄力值：①你可以消耗1点蓄力值，视为使用一张【杀】；②出牌阶段，你可以消耗4点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去3点体力。",
  "xuezhanmrfz": "血战",
  "xuezhanmrfz_info": "锁定技，当你首次即将死亡时，取消之，然后你将体力值和体力上限调整至2、弃置你的区域内所有牌、摸4张牌并重置你的武将牌。"
});
characterTitle("haojiaomrfz", "<font color=#ed7e78>维多利亚的白狼</font>");
characterIntro("haojiaomrfz", "号角，毕业于维多利亚皇家近卫学校，现为维多利亚风暴突击队第二分队指挥官。于伦蒂尼姆事件中与罗德岛协同作战，经精英干员Misery介绍，与罗德岛签订战略合作条款。");
