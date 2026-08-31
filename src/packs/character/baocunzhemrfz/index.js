import { get, game } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("baocunzhemrfz", {
  sex: "male",
  group: "qianmrfz",
  hp: 10,
  skills: ["shouwangmrfz", "jingmomrfz", "xijimrfz"]
});
skill({
  "shouwangmrfz": {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    unique: true,
    // @ts-ignore
    filter: function(event, player2) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player2) {
      const result = await player2.chooseTarget(true, "【守望】:请选择一名其他角色", function(card, player3, target) {
        return target != player3;
      }).set("ai", (target) => get.attitude(player2, target) > 0).forResult();
      if (result.targets) {
        result.targets[0].addSkill("shouwangmrfz2");
      }
    },
    group: ["shouwangmrfz_die", "shouwangmrfz_recover", "shouwangmrfz_draw"],
    subSkill: {
      die: {
        direct: true,
        charlotte: true,
        trigger: { global: "dieBegin" },
        firstDo: true,
        filter: function(event, player2) {
          return event.player.hasSkill("shouwangmrfz2");
        },
        async content(event, trigger, player2) {
          player2.loseMaxHp(player2.maxHp);
          player2.logSkill("shouwangmrfz");
        }
      },
      recover: {
        direct: true,
        charlotte: true,
        trigger: { player: "dying" },
        async content(event, trigger, player2) {
          player2.recoverTo(1);
          player2.logSkill("shouwangmrfz");
        }
      },
      draw: {
        audio: 2,
        trigger: { player: "drawAfter" },
        // @ts-ignore
        filter: function(event, player2) {
          return event.getParent().name != "shouwangmrfz2";
        },
        // @ts-ignore
        check: function(event, player2) {
          var target = game.findPlayer(function(current) {
            return current.hasSkill("shouwangmrfz2");
          });
          return get.attitude(player2, target) > 0;
        },
        // @ts-ignore
        prompt: function(event, player2) {
          var target = game.findPlayer(function(current) {
            return current.hasSkill("shouwangmrfz2");
          });
          return "是否令" + get.translation(target) + "摸一张牌？";
        },
        async content(event, trigger, player2) {
          player2.logSkill("shouwangmrfz");
          game.countPlayer(function(current) {
            if (current.hasSkill("shouwangmrfz2")) current.draw();
          });
        }
      }
    },
    ai: {
      effect: {
        // @ts-ignore
        target(card, player2, target, current) {
          if (get.type(card) == "trick" || card.name == "sha") return "zeroplayertarget";
        }
      }
    }
  },
  "xijimrfz": {
    audio: 2,
    trigger: { player: "dieBegin" },
    filter: function(event, player2) {
      return player2.countCards("hej") > 0;
    },
    direct: true,
    async content(event, trigger, player2) {
      const result = await player2.chooseTarget("【希冀】:你可以将你区域内所有的牌交给一名其他角色", function(card, player3, target2) {
        return target2 != player3;
      }).set("ai", (target2) => get.attitude(player2, target2) > 2 && target2.hp > 0).forResult();
      if (result.targets) {
        var hej = player2.getCards("hej"), target = result.targets[0];
        player2.give(hej, target);
        player2.logSkill("xijimrfz", target);
        target.addSkill("xijimrfz_eff");
        target.addMark("xijimrfz_eff", hej.length, false);
      }
    },
    group: "xijimrfz_die",
    subSkill: {
      die: {
        audio: "xijimrfz",
        enable: "phaseUse",
        filter: function(event, player2) {
          return player2.maxHp <= 5;
        },
        async content(event, trigger, player2) {
          const result = await player2.chooseBool("【希冀】:是否失去所有体力上限？").forResult();
          if (result.bool) {
            var num = Math.floor(player2.maxHp / 2);
            player2.draw(Math.min(3, num > 1 ? num : 1));
            player2.loseMaxHp(player2.maxHp);
          }
        }
      },
      eff: {
        charlotte: true,
        intro: {
          content: "攻击距离、使用【杀】的次数+#"
        },
        mod: {
          cardUsable: function(card, player2, num) {
            if (card.name == "sha") return num + player2.countMark("xijimrfz_eff");
          },
          attackRange: function(player2, num) {
            return num + player2.countMark("xijimrfz_eff");
          }
        },
        trigger: { player: "phaseEnd" },
        silent: true,
        content: function() {
          player.removeMark("xijimrfz_eff", player.countMark("xijimrfz_eff"), false);
          player.removeSkill("xijimrfz_eff");
        }
      }
    }
  },
  "jingmomrfz": {
    audio: 2,
    forced: true,
    trigger: { global: "roundStart" },
    content: function() {
      player.loseMaxHp();
    },
    mod: {
      // @ts-ignore
      maxHandcardBase: function(player2, num) {
        return 5;
      }
    }
  }
});
translate({
  "baocunzhemrfz": "保存者",
  "shouwangmrfz": "守望",
  "shouwangmrfz_info": "①锁定技，游戏开始时，你选择一名其他角色，然后其获得一个‘保存’标记；当你进入濒死状态时，你将体力恢复至一点；当有‘保存’标记的角色死亡时，你失去所有的体力上限。②当你不因【守望②】摸牌时，你可以令拥有‘保存’标记的角色摸一张牌；当拥有‘保存’标记的角色不因【守望②】摸牌的时，其可以令你摸一张牌。",
  "xijimrfz": "希冀",
  "xijimrfz_info": "①出牌阶段，若你的体力上限不大于5，你可以失去所有体力上限并摸X张牌（X=你的体力上限的一半，向下取整，X∈[1,3]）。②当你死亡时，你可以将你区域内所有的牌交给一名其他角色，你每交给其一张牌，其下个回合使用【杀】的次数和攻击距离便+1。",
  "jingmomrfz": "静默",
  "jingmomrfz_info": "锁定技，你的手牌上限视为5；每轮开始时，你失去一点体力上限。"
});
characterIntro("baocunzhemrfz", "摘自PRTS的梗概</br>‘保存者’，前人类文明休眠计划的人格模拟，也是特雷弗·弗里斯顿。在4,765,403天的时光中践行着前文明的计划守望者庞大的石棺群，但在漫长的等待与空寂中失去了希望，直到克丽斯腾来访后的对谈让他对泰拉重新燃起了信心，决定以石棺中所有人永远沉睡的代价将最后的前文明能源供给为克丽斯腾突破天空屏障的巨炮。知晓凯尔希的本质，通过“辩论”的方式了解了博士与凯尔希的决心，最后请求凯尔希删去他这万年来的记忆，但在最后一刻被误入的霍尔海雅当作“神明”，被其存储记忆的源石技艺抢救下来，在保存了弗里斯顿最基础记忆的情况下被转制成为罗德岛“自研作业平台”Friston-3。");
//# sourceMappingURL=index.js.map
