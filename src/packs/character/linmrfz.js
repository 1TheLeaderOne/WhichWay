import { game, get, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("linmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "yanmrfz",
  hp: 3,
  skills: ["zhenzamrfz", "liuliemrfz", "yinbimrfz"]
});
skill({
  "yinbimrfz": {
    marktext: "壁",
    intro: {
      name: "壁",
      content: "·琉璃壁保护着你</br>·此琉璃壁来源【荫蔽】"
    },
    audio: 2,
    enable: "phaseUse",
    filter: function(event, player) {
      return !player.storage.liuliemrfz && !player.storage.yinbimrfz;
    },
    selectTarget: [1, 2],
    filterTarget: function(card, player, target) {
      return target != player && !target.hasMark("yinbimrfz") && !target.hasMark("zhenzamrfz");
    },
    async content(event, trigger, player) {
      const { targets } = event;
      player.storage.yinbimrfz = true;
      if (!player.hasSkill("liuliemrfz_rem")) player.addSkill("liuliemrfz_rem");
      for (var i = 0; i < targets.length; i++) {
        if (!targets[i].hasMark("yinbimrfz")) targets[i].addMark("yinbimrfz");
        if (!targets[i].hasSkill("yinbimrfz_rem")) targets[i].addSkill("yinbimrfz_rem");
        if (targets[i].hujia < 1) targets[i].changeHujia();
      }
    },
    subSkill: {
      rem: {
        silent: true,
        charlotte: true,
        trigger: { global: "roundStart" },
        async content(event, trigger, player) {
          if (player.hasMark("yinbimrfz")) {
            player.removeMark("yinbimrfz");
            player.changeHujia(-1);
          }
          player.removeSkill("yinbimrfz_rem");
        }
      }
    },
    ai: {
      order: 10,
      expose: 0.3,
      result: {
        player: 1,
        target: 1
      }
    }
  },
  "liuliemrfz": {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    check: function(event, player) {
      if (game.hasPlayer((current) => {
        return current != player && get.attitude(player, current) > 2;
      }))
        return Math.random() > 0.85;
      return true;
    },
    async content(event, trigger, player) {
      player.storage.liuliemrfz = true;
      player.addSkill("liuliemrfz_rem");
    },
    subSkill: {
      rem: {
        charlotte: true,
        silent: true,
        trigger: { global: "roundStart" },
        async content(event, trigger, player) {
          player.storage.liuliemrfz = false;
          player.storage.yinbimrfz = false;
        }
      }
    }
  },
  "zhenzamrfz": {
    marktext: "壁",
    intro: {
      name: "壁",
      content: function(event, player) {
        if (player.storage.liuliemrfz) return "·琉璃壁保护着你</br>·【缜匝②】已修改</br>·【荫蔽】已失效";
        return "·琉璃壁保护着你";
      }
    },
    audio: 6,
    derivation: ["zhenzamrfz_rewrite"],
    trigger: { global: "damageEnd" },
    direct: true,
    filter: function(event, player) {
      if (!event.player.hasMark("zhenzamrfz") && !event.player.hasMark("yinbimrfz")) return false;
      return event.hujia && !event.player.hujia && event.player.isIn() && game.hasPlayer(function(current) {
        return current != event.player && event.player.inRangeOf(current);
      });
    },
    async content(event, trigger, player) {
      const playerx = trigger.player;
      let result;
      if (playerx.hasMark("zhenzamrfz")) {
        playerx.removeMark("zhenzamrfz");
      } else {
        playerx.removeMark("yinbimrfz");
      }
      result = await playerx.chooseTarget(
        get.prompt("zhenzamrfz"),
        "你可以随机获得攻击范围内一名其他角色的" + (player.storage.liuliemrfz ? "两张牌" : "一张牌") + "并对其造成一点伤害",
        (card, player2, target) => {
          return target !== player2 && player2.inRangeOf(target);
        }
      ).set("ai", (target) => {
        const aiTrigger = _status.event.getTrigger();
        _status.event.player;
        return -get.attitude(aiTrigger.player, target);
      }).forResult();
      if (result.targets) {
        const target = result.targets[0];
        const cardg = [];
        const numCards = player.storage.liuliemrfz ? 2 : 1;
        for (let i = 0; i < numCards; i++) {
          const cardt = target.getCards("he").randomGet();
          if (!cardg.includes(cardt)) {
            cardg.push(cardt);
          } else if (target.countCards("he") > 1) {
            i--;
          }
        }
        await playerx.gain(cardg, target, "giveAuto", "bySelf");
        await target.damage(playerx || "nosource", "nocard");
        playerx.logSkill("zhenzamrfz", target);
      }
    },
    group: ["zhenzamrfz_sta", "zhenzamrfz_gt", "zhenzamrfz_gt2", "zhenzamrfz_time1"],
    subSkill: {
      sta: {
        audio: "zhenzamrfz",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        forced: true,
        locked: false,
        filter: function(event, player) {
          return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          player.addMark("zhenzamrfz");
          if (player.hujia < 1) player.changeHujia();
        }
      },
      gt: {
        audio: "zhenzamrfz",
        forced: true,
        trigger: { global: "phaseZhunbeiBegin" },
        filter: function(event, player) {
          if (player.countMark("zhenzamrfz_time1") > 1) return false;
          return !player.hasMark("zhenzamrfz") && !player.hasMark("yinbimrfz");
        },
        async content(event, trigger, player) {
          player.addMark("zhenzamrfz");
          player.addMark("zhenzamrfz_time1", 1, false);
          if (player.hujia < 1) player.changeHujia();
        }
      },
      gt2: {
        audio: "zhenzamrfz",
        trigger: { global: "dying" },
        filter: function(event, player) {
          if (player.countMark("zhenzamrfz_time2") > 1) return false;
          if (player.hasMark("zhenzamrfz") || player.hasMark("yinbimrfz")) return false;
          return event.player != player && event.parent && event.parent.name == "damage" && event.parent.source && event.parent.source == player;
        },
        async content(event, trigger, player) {
          player.addMark("zhenzamrfz");
          player.addMark("zhenzamrfz_time2", 1, false);
          if (player.hujia < 1) player.changeHujia();
        }
      },
      time1: {
        charlotte: true,
        silent: true,
        trigger: { global: "roundStart" },
        firstDo: true,
        async content(event, trigger, player) {
          player.removeMark("zhenzamrfz_time1", player.countMark("zhenzamrfz_time1"), false);
          player.removeMark("zhenzamrfz_time2", player.countMark("zhenzamrfz_time2"), false);
        }
      },
      time2: {}
    },
    ai: {
      threaten: 0.8
    }
  }
});
translate({
  "linmrfz": "林",
  "yinbimrfz": "荫蔽",
  "yinbimrfz_info": "每轮限一次，出牌阶段，你可以令至多两名没有‘壁’标记的角色各获得一个‘壁’标记，以此法获得的‘壁’标记和护甲最多持续一轮。",
  "liuliemrfz": "琉裂",
  "liuliemrfz_info": "出牌阶段开始时，你可以修改【缜匝②】的描述直到本轮结束，然后你本轮【荫蔽】失效。",
  "zhenzamrfz": "缜匝",
  "zhenzamrfz_info": "①锁定技，游戏开始时你获得一个‘壁’标记；当有角色获得‘壁’标记时，若其没有护甲，其获得一点护甲；每轮各限两次，每名角色的准备阶段或有其他角色因你造成的伤害而进入濒死状态时，若你没有‘壁’标记，你获得一个‘壁’标记。②有‘壁’标记的角色受到伤害后，若其因此伤害触发过护甲且没有护甲，其可以随机获得攻击范围内一名其他角色的一张牌并对其造成一点伤害。",
  "zhenzamrfz_rewrite": "缜匝·修改",
  "zhenzamrfz_rewrite_info": "①锁定技，游戏开始时你获得一个‘壁’标记；当有角色获得‘壁’标记时，若其没有护甲，其获得一点护甲；每轮各限两次，每名角色的准备阶段或有其他角色因你造成的伤害而进入濒死状态时，若你没有‘壁’标记，你获得一个‘壁’标记。②有‘壁’标记的角色受到伤害后，若其因此伤害触发过护甲且没有护甲，其可以随机获得攻击范围内一名其他角色的两张牌并对其造成一点伤害。"
});
characterIntro("linmrfz", "林，本名林雨霞，龙门人。本职工作不明，本人提供的档案资料信息十分有限，同样存疑。</br>于“玉门事件”后，主动提出与罗德岛正式建立合作。为罗德岛在龙门收治感染者的工作提供帮助。");
