import { game, get } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("hongxuemrfz", {
  sex: "female",
  group: "luomrfz",
  hp: 4,
  skills: ["ruibimrfz", "sujimrfz"]
});
skill({
  "ruibimrfz": {
    audio: 3,
    enable: "phaseUse",
    derivation: ["dazijimrfzskill"],
    usable: 1,
    filter: function(event, player) {
      return player.countCards("he") > 0 && !player.isDisabled(1) && !player.hasCard(function(card) {
        return card.name == "dazijimrfz";
      }, "e");
    },
    filterCard: true,
    check: function(card) {
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const card = game.createCard("dazijimrfz", "heart", 2);
      player.$gain2(card);
      game.delayx();
      player.equip(card);
    },
    group: "ruibimrfz2",
    ai: {
      order: 12,
      result: {
        player: 1
      }
    }
  },
  "ruibimrfz2": {
    audio: "ruibimrfz",
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter: function(event, player) {
      return !player.isDisabled(1) && (event.name != "phase" || game.phaseNumber == 0);
    },
    async content(event, trigger, player) {
      const card = game.createCard("dazijimrfz", "heart", 2);
      player.$gain2(card);
      game.delayx();
      player.equip(card);
      player.removeSkill("ruibimrfz2");
    }
  },
  "sujimrfz": {
    audio: 2,
    trigger: {
      source: "damageSource"
    },
    forced: true,
    filter: function(event, player) {
      if (event.player == player) return false;
      if (!event.card || event.card.name != "sha" || !player.isPhaseUsing()) return false;
      return event.player.isAlive();
    },
    async content(event, trigger, player) {
      trigger.player.addSkill("sujimrfz2");
    },
    group: ["sujimrfz_damage"]
  },
  "sujimrfz_damage": {
    direct: true,
    trigger: { player: "useCardToPlayered" },
    filter: function(event, player) {
      if (!event.card || event.card.name != "sha" || player.hasSkill("sujimrfz_damage_ban")) return false;
      for (var i = 0; i < event.targets.length; i++) {
        var target = event.targets[i];
        if (target.hasSkill("sujimrfz2")) return true;
      }
    },
    async content(event, trigger, player) {
      for (var i = 0; i < trigger.targets.length; i++) {
        var target = trigger.targets[i];
        if (target.hasSkill("sujimrfz2")) {
          target.addTempSkill("qinggang2");
          target.storage.qinggang2.add(trigger.card);
          target.markSkill("qinggang2");
          target.addTempSkill("sujimrfz_damage_add");
          target.storage.sujimrfz_damage = {
            card: trigger.card
          };
        }
      }
      player.addTempSkill("sujimrfz_damage_ban", "phaseEnd");
    },
    subSkill: {
      add: {
        onremove: function(player) {
          delete player.storage.sujimrfz_damage;
        },
        trigger: {
          player: "damageBegin3"
        },
        filter: function(event, player) {
          var info = player.storage.sujimrfz_damage;
          return event.card && event.card == info.card;
        },
        silent: true,
        popup: false,
        forced: true,
        charlotte: true,
        async content(event, trigger, player) {
          trigger.num++;
          player.logSkill("sujimrfz");
        }
      },
      ban: {
        charlotte: true
      }
    }
  }
});
translate({
  "hongxuemrfz": "鸿雪",
  "ruibimrfz": "锐笔",
  "ruibimrfz_info": "锁定技，游戏开始时，你将【打字机】置入你的装备区；出牌阶段限一次，若你的装备区没有【打字机】，你可以弃置一张牌，然后将【打字机】置入你的装备区。",
  "ruibimrfz2": "锐笔",
  "ruibimrfz2_info": "",
  "sujimrfz": "速记",
  "sujimrfz_info": "锁定技，出牌阶段，当你使用的【杀】对一名其他角色造成伤害后，你获得以下效果：1.你使用的【杀】无视该角色的防具；2.每回合限一次，当你使用的【杀】指定其为目标后，此杀伤害+1。",
  "sujimrfz_damage": "速记",
  "sujimrfz_damage_info": "",
  "sujimrfz_ban": "速记",
  "sujimrfz_ban_info": ""
});
characterIntro("hongxuemrfz", "鸿雪，自称阿芙朵嘉·锐笔。可确认阿芙朵嘉为其本名，但本人不愿透露真实姓氏。在风险研判后，人事部决定不进行进一步的询问。");
//# sourceMappingURL=index.js.map
