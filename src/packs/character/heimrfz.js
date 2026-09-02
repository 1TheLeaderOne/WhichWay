import { game, get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("heimrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "ximrfz",
  hp: 4,
  skills: ["heishimrfz", "ruitongmrfz", "junumrfz"]
});
skill({
  "heishimrfz": {
    audio: 2,
    forced: true,
    trigger: { source: "damageBegin3" },
    filter: function(event, player) {
      return (get.distance(player, event.player) <= (player.hasSkill("junumrfz_effect") ? 3 : 1) || event.player.getEquip(2)) && event.card && event.card.name == "sha";
    },
    async content(event, trigger, player) {
      if (get.distance(player, trigger.player) <= (player.hasSkill("junumrfz_effect") ? 3 : 1)) trigger.num++;
      if (trigger.player.getEquip(2)) trigger.num++;
    },
    group: "heishimrfz_wushi",
    mod: {
      playerEnabled: function(card, player, target) {
        if (!player.hasSkill("junumrfz_effect") && get.distance(player, target) > 2 && card.name == "sha") return false;
      }
    },
    subSkill: {
      wushi: {
        trigger: {
          player: "useCardToPlayered"
        },
        filter: function(event) {
          return event.card.name == "sha";
        },
        forced: true,
        logTarget: "target",
        async content(event, trigger, player) {
          if (player.hasSkill("heishimrfz")) player.logSkill("heishimrfz");
          trigger.target.addTempSkill("heishimrfz_wushi2");
          trigger.target.storage.heishimrfz_wushi2.add(trigger.card);
          trigger.target.markSkill("heishimrfz_wushi2");
        },
        ai: {
          unequip_ai: true,
          skillTagFilter: function(player, tag, arg) {
            if (arg && arg.name == "sha") return true;
            return false;
          }
        }
      },
      wushi2: {
        firstDo: true,
        ai: { unequip2: true },
        init: function(player, skill2) {
          if (!player.storage[skill2]) player.storage[skill2] = [];
        },
        onremove: true,
        trigger: {
          player: ["damage", "damageCancelled", "damageZero"],
          source: ["damage", "damageCancelled", "damageZero"],
          target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
          global: ["useCardEnd"]
        },
        charlotte: true,
        filter: function(event, player) {
          return player.storage.heishimrfz_wushi2 && event.card && player.storage.heishimrfz_wushi2.includes(event.card) && (event.name != "damage" || event.notLink());
        },
        silent: true,
        forced: true,
        popup: false,
        priority: 12,
        async content(event, trigger, player) {
          player.storage.heishimrfz_wushi2.remove(trigger.card);
          if (!player.storage.heishimrfz_wushi2.length) player.removeSkill("heishimrfz_wushi2");
        },
        marktext: "※",
        intro: { content: "当前防具技能已失效" }
      }
    },
    ai: {
      threaten: 1.2
    }
  },
  "ruitongmrfz": {
    audio: 2,
    trigger: { global: "useCardAfter" },
    filter: function(event, player) {
      if (!player.hasSkill("junumrfz_effect") && get.distance(player, event.player) > 2 && player.hasSkill("heishimrfz")) return false;
      return event.player && event.player.isAlive() && event.player != player && get.subtype(event.card) == "equip2" && player.inRange(event.player);
    },
    prompt: function(event, player) {
      return "是否对" + get.translation(event.player) + "视为使用一张【杀】";
    },
    check: function(event, player) {
      return get.attitude(player, event.player) < 0;
    },
    async content(event, trigger, player) {
      player.useCard({ name: "sha", isCard: true }, true, trigger.player);
    },
    ai: {
      expose: 0.9,
      threaten: 0.8
    }
  },
  "junumrfz": {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    unique: true,
    mark: true,
    limited: true,
    skillAnimation: true,
    animationStr: "巨弩",
    animationColor: "orange",
    check: function(event, player) {
      if (!game.hasPlayer(function(current) {
        return current != player && get.attitude(current, player) < 0;
      }))
        return false;
      return player.countCards("h", "sha") >= 2;
    },
    init: function(player) {
      player.storage.junumrfz = false;
    },
    filter: function(event, player) {
      return !player.storage.junumrfz;
    },
    async content(event, trigger, player) {
      player.storage.junumrfz = true;
      player.addTempSkill("junumrfz_effect");
      player.awakenSkill(event.name);
    },
    subSkill: {
      effect: {
        mod: {
          targetInRange: function(card, player, target, now) {
            if (card.name == "sha") return true;
          },
          selectTarget: function(card, player, range) {
            if (card.name == "sha" && range[1] != -1) range[1]++;
          },
          cardUsable: function(card, player, num) {
            if (card.name == "sha") return num + 1;
          }
        },
        charlotte: true
      }
    },
    ai: {
      threaten: 1.1
    }
  }
});
translate({
  "heimrfz": "黑",
  "heishimrfz": "黑矢",
  "heishimrfz_info": "锁定技，你的使用的【杀】仅能指定与你距离不大于2的角色为目标，你的【杀】无视防具；你对有防具的角色造成的伤害+1，对与你距离小于等于1的角色造成的伤害+1。</br><span class=thundertext>【黑矢·修改】</span></br>锁定技，你的【杀】无视防具；你对有防具的角色造成的伤害+1，对与你距离小于等于3的角色造成的伤害+1。",
  "ruitongmrfz": "锐曈",
  "ruitongmrfz_info": "当有其他角色使用防具牌且其在你攻击范围内时，你可以视为对其使用一张【杀】。",
  "junumrfz": "巨弩",
  "junumrfz_info": "限定技，准备阶段，你可以令你本回合获得如下效果：①使用的【杀】无距离限制、使用次数和目标+1；②修改【黑矢】。"
});
characterIntro("heimrfz", "黑，前汐斯塔市市长SP兼城市治安局局长，随干员锡兰共同加入罗德岛。</br>在隐秘行动、侦察与反侦察、野外求生、弩使用等技能上拥有卓越的造诣。在担任博士护卫的同时，负责一部分罗德岛基层干员的训练工作。");
