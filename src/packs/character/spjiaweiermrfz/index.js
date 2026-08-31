import { game, get, lib } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("spjiaweiermrfz", {
  sex: "female",
  group: "luomrfz",
  hp: 4,
  skills: ["yixuemrfz", "juximrfz", "conghunmrfz"]
});
skill({
  "yixuemrfz": {
    audio: 2,
    trigger: { player: "recoverBegin" },
    forced: true,
    filter: function(event, player) {
      return !player.hasSkill("yixuemrfz2");
    },
    async content(event, trigger, player) {
      trigger.num++;
      player.addSkill("yixuemrfz2");
    }
  },
  "juximrfz": {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter: function(event, player) {
      if (event.targets.length > 1) return false;
      return event.card.name == "sha" && event.target.countCards("he") > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      const cards = trigger.target.getCards("hej");
      const list = [];
      let num = 0;
      for (const card of cards) {
        list.add(get.suit(card, player));
      }
      for (const suit of lib.suit) {
        if (list.includes(suit)) num++;
      }
      result = await player.choosePlayerCard(
        trigger.target,
        "he",
        [1, Math.min(trigger.target.countCards("he"), num)],
        get.prompt("juximrfz", trigger.target) + "(可选" + num + "张牌)"
      ).set("forceAuto", true).forResult();
      if (result.links && result.links.length) {
        const target = trigger.target;
        player.logSkill("juximrfz", target);
        const next = player.addToExpansion(result.cards, "giveAuto", player);
        next.gaintag.add("juximrfz2");
        await next;
        player.addSkill("juximrfz2");
      }
    },
    ai: {
      unequip_ai: true,
      directHit_ai: true,
      skillTagFilter: function(player, tag, arg) {
        if (get.attitude(player, arg.target) > 0) return false;
        if (tag == "directHit_ai") return arg.target.countCards("h") < 2;
        if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
        return false;
      }
    }
  },
  "conghunmrfz": {
    marktext: "坚韧",
    intro: {
      name: "坚韧",
      content: function(event, player) {
        if (player.storage.conghunmrfz_lose) return "已有" + player.countMark("conghunmrfz") + "个坚韧标记</br>本轮已发动过【丛魂①】";
        return "已有" + player.countMark("conghunmrfz") + "个坚韧标记</br>本轮未发动过【丛魂①】";
      }
    },
    mark: true,
    init: function(player) {
      player.storage.conghunmrfza = -10;
    },
    firstDo: true,
    audio: 2,
    trigger: { global: "roundStart" },
    filter: function(event, player) {
      return !player.hasMark("conghunmrfz") && player.storage.conghunmrfza <= game.roundNumber - 2;
    },
    check: function(event, player) {
      return player.hp < 3 || player.countCards("he") < 4 || player.countCards("h") == 0;
    },
    async content(event, trigger, player) {
      player.storage.conghunmrfz_lose = true;
      player.storage.conghunmrfza = game.roundNumber;
    },
    group: ["conghunmrfz_dam", "conghunmrfz_rem", "conghunmrfz_lose"],
    subSkill: {
      dam: {
        audio: "conghunmrfz",
        forced: true,
        charlotte: true,
        trigger: { player: "damageBegin3" },
        filter: function(event, player) {
          return player.storage.conghunmrfz_lose;
        },
        async content(event, trigger, player) {
          trigger.num--;
          player.addMark("conghunmrfz");
        }
      },
      rem: {
        silent: true,
        charlotte: true,
        trigger: { global: "roundStart" },
        filter: function(event, player) {
          return player.storage.conghunmrfz_lose && player.storage.conghunmrfza <= game.roundNumber - 1;
        },
        async content(event, trigger, player) {
          player.storage.conghunmrfz_lose = false;
        }
      },
      lose: {
        audio: "conghunmrfza",
        trigger: { global: "phaseBegin" },
        filter: function(event, player) {
          return player.hasMark("conghunmrfz") && player.storage.conghunmrfza <= game.roundNumber - 1;
        },
        forced: true,
        charlotte: true,
        async content(event, trigger, player) {
          player.loseHp();
          player.removeMark("conghunmrfz");
        }
      }
    }
  }
});
translate({
  "spjiaweiermrfz": "百炼嘉维尔",
  "spjiaweiermrfz_prefix": "百炼",
  "yixuemrfz": "医学",
  "yixuemrfz_info": "锁定技，每轮限一次，当你回复体力时，回复值+1。",
  "juximrfz": "锯袭",
  "juximrfz_info": "当你使用的【杀】指定目标后且目标数不大于1，你可以将目标角色的X张牌置于你的武将牌上，若此杀造成了伤害，你可以至多获得你武将牌上的两张牌，否则，目标角色至多获得你武将牌上的两张牌，然后弃置你武将牌上的牌。（X=目标角色区域内牌的花色数）",
  "conghunmrfz": "丛魂",
  "conghunmrfz_info": "①每轮开始时，若你没有‘坚韧’标记且上轮没有使用过【丛魂①】，你可以令你本轮受到伤害时，令此伤害-1且你获得一个‘坚韧’标记。②锁定技，任意角色的回合开始阶段，若你本轮没有使用过【丛魂①】且你的‘坚韧’标记数大于1，你失去一点体力并移去一个‘坚韧’标记。"
});
characterIntro("spjiaweiermrfz", "嘉维尔，现在仍是罗德岛医疗部的一员，但在罗德岛需要她发挥自己的战斗力而非医学素养的时候，她也会拿起战斧，冲锋陷阵。");
//# sourceMappingURL=index.js.map
