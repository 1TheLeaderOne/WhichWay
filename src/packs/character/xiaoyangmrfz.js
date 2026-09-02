import { get, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("xiaoyangmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "laimrfz",
  hp: 3,
  skills: ["qingyanmrfz", "luanhuomrfz"]
});
skill({
  "luanhuomrfz": {
    onremove: true,
    marktext: "火",
    intro: {
      name: "乱火",
      content: "本轮已执行回合数：#"
    },
    audio: 2,
    trigger: { player: "damageBegin2" },
    filter: function(event, player) {
      return event.nature == "fire";
    },
    forced: true,
    direct: true,
    async content(event, trigger, player) {
      trigger.cancel();
    },
    ai: {
      nofire: true,
      effect: {
        target: function(card, player, target, current) {
          if (get.tag(card, "fireDamage")) return "zerotarget";
        }
      }
    },
    group: ["luanhuomrfz_fire", "luanhuomrfz_times", "luanhuomrfz_clear", "luanhuomrfz_damage"],
    subSkill: {
      fire: {
        audio: "luanhuomrfz",
        trigger: { source: "damageBegin" },
        forced: true,
        charlotte: true,
        filter: function(event, player) {
          return event.nature != "fire";
        },
        async content(event, trigger, player) {
          trigger.cancel();
          trigger.player.damage(trigger.num, player, "fire");
        }
      },
      times: {
        forced: true,
        charlotte: true,
        silent: true,
        trigger: { player: "phaseBegin" },
        async content(event, trigger, player) {
          player.addMark("luanhuomrfz");
        }
      },
      clear: {
        forced: true,
        charlotte: true,
        silent: true,
        trigger: { global: "roundStart" },
        filter: function(event, player) {
          return player.countMark("luanhuomrfz") > 0;
        },
        async content(event, trigger, player) {
          player.removeMark("luanhuomrfz", player.countMark("luanhuomrfz"));
        }
      },
      damage: {
        audio: "luanhuomrfz",
        trigger: { player: "phaseZhunbeiBegin" },
        async content(event, trigger, player) {
          var num = player.countMark("luanhuomrfz");
          var str1 = "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害";
          var str2 = "对一名其他角色造成" + get.cnNumber(num, true) + "点伤害";
          if (num == 1) {
            const { targets } = await player.chooseTarget(get.prompt2("luanhuomrfz"), function(card, player2, target) {
              return player2 != target;
            }).set("ai", function(target) {
              var player2 = _status.event.player;
              return get.damageEffect(target, player2, player2);
            }).forResult();
            if (targets) targets[0].damage();
          } else {
            const { control } = await player.chooseControl(str1, str2).set("ai", function(event2, player2) {
              if (num > 2) return 0;
              return 1;
            }).forResult();
            if (control === str1 && num > 1) {
              player.storage.luanhuomrfz_damage = true;
              let { targets } = await player.chooseTarget(
                [1, num],
                "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害",
                function(card, player2, target) {
                  return player2 != target;
                }
              ).set("ai", function(target) {
                var player2 = _status.event.player;
                return get.damageEffect(target, player2, player2);
              }).forResult();
              if (!targets) return;
              for (var i = 0; i < targets.length; i++) targets[i].damage(player);
            } else if (control === str2 && num > 1) {
              player.storage.luanhuomrfz_damage = false;
              let { targets } = await player.chooseTarget("对一名其他角色造成" + get.cnNumber(num, true) + "点伤害", function(card, player2, target) {
                return player2 != target;
              }).set("ai", function(target) {
                var player2 = _status.event.player;
                return get.damageEffect(target, player2, player2);
              }).forResult();
              if (!targets) return;
              targets[0].damage(num);
            }
          }
        }
      }
    }
  },
  "qingyanmrfz": {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter: function(event, player) {
      if (player.hasMark("qingyanmrfz")) return false;
      return player.getHistory("useCard", function(evt) {
        return evt.getParent("phaseUse") == event;
      }).length > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      var list = [];
      player.getHistory("useCard", function(evt) {
        if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
      });
      if (list.length >= 3) {
        const result = await player.chooseBool("【勤研】：是否于本回合结束后额外执行一个回合？").forResult();
        if (!result.bool) return;
        player.insertPhase();
        player.addMark("qingyanmrfz", 1);
        player.logSkill("qingyanmrfz");
      }
    },
    group: "qingyanmrfz_clear",
    subSkill: {
      clear: {
        silent: true,
        charlotte: true,
        direct: true,
        trigger: { global: "roundStart" },
        filter: function(event, player) {
          return player.hasMark("qingyanmrfz");
        },
        async content(event, trigger, player) {
          player.removeMark("qingyanmrfz", player.countMark("qingyanmrfz"));
        }
      }
    }
  }
});
translate({
  "xiaoyangmrfz": "艾雅法拉",
  "luanhuomrfz": "乱火",
  "luanhuomrfz_info": "①锁定技，你造成的伤害时改为你对其造成等量的火属性伤害；当你受到火属性伤害时，取消之。②准备阶段，你可以选择对X名其他角色造成一点伤害或对一名其他角色造成X点伤害（X=本轮你执行的回合数）。",
  "qingyanmrfz": "勤研",
  "qingyanmrfz_info": "每轮限一次，出牌阶段结束时，若你于本阶段使用过三种类型的牌，你可以在本回合结束后额外执行一个回合。"
});
characterIntro("xiaoyangmrfz", "艾雅法拉，火山学家，天灾信使。于高等源石技艺、高能量法术释放等领域展现出了卓越的天赋。现于罗德岛接受治疗，同时为罗德岛提供天灾研究、环境观察与评估、危险地形航行保障等相关服务。");
