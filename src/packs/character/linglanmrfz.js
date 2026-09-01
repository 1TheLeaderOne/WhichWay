import { game, get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("linglanmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "xumrfz",
  hp: 3,
  skills: ["newhualaomrfz", "newhemingmrfz", "wuyuemrfz"]
});
skill({
  "wuyuemrfz": {
    mod: {
      targetInRange: function(card, player, target, now) {
        if (card.name == "sha" && get.color(card) == "black") return true;
      },
      selectTarget: function(card, player, range) {
        if (card.name == "sha" && range[1] != -1 && get.color(card) == "red") range[1]++;
      }
    }
  },
  "newhualaomrfz": {
    audio: "hualaomrfz",
    trigger: {
      source: "damageBegin"
    },
    marktext: "脆弱",
    intro: {
      name: "脆弱",
      content: "下次受到的伤害翻倍#次"
    },
    filter(event, player) {
      return event.player !== player;
    },
    prompt2(event, player) {
      return `是否令${get.translation(event.player)}下次受到的伤害翻倍？`;
    },
    check(event, player) {
      if (get.attitude(player, event.player) > 0) return false;
      if (event.num + event.player.countMark("newhualaomrfz") - event.player.hp >= 0) return false;
      return true;
    },
    async content(event, trigger, player) {
      var target = trigger.player;
      target.addMark("newhualaomrfz", 1, false);
      target.addTempSkill("newhualaomrfz_eff", { player: "damageEnd" });
      trigger.num = 0;
    },
    subSkill: {
      eff: {
        charlotte: true,
        silent: true,
        trigger: { player: "damageBegin4" },
        filter(event, player) {
          return event.num > 0 && player.countMark("newhualaomrfz") > 0;
        },
        async content(event, trigger, player) {
          trigger.num *= 2 ** player.countMark("newhualaomrfz");
          player.removeAllmark("newhualaomrfz");
        }
      }
    }
  },
  "newhemingmrfz": {
    audio: "huhuomrfz",
    trigger: {
      source: "damageZero"
    },
    usable: 1,
    async cost(event, trigger, player) {
      let num = Math.floor(game.players.filter((char) => char !== player && char.inRangeOf(player)).length / 2);
      event.result = await player.chooseTarget().set("prompt", get.prompt("newhemingmrfz")).set("prompt2", `你可以令至多两名角色摸${get.cnNumber(num)}张牌`).set("ai", (target) => get.attitude2(target) > 0).set("selectTarget", [1, 2]).forResult();
    },
    async content(event, trigger, player) {
      let num = Math.floor(game.players.filter((char) => char !== player && char.inRangeOf(player)).length / 2);
      game.asyncDraw(event.targets, num);
    }
  }
});
translate({
  "linglanmrfz": "铃兰",
  "wuyuemrfz": "舞乐",
  "wuyuemrfz_info": "锁定技，你红色的【杀】目标+1，黑色的【杀】无距离限制。",
  "newhualaomrfz": "画牢",
  "newhualaomrfz_info": "当你对其他角色造成伤害时，你可以令此伤害的伤害值变为0，然后其下次受到的伤害翻倍。",
  "newhemingmrfz": "和鸣",
  "newhemingmrfz_info": "每回合限一次，当你造成伤害后，若此次的伤害为0，你可以令至多两名角色摸X张牌。（X=你攻击范围内的角色数/2，向上取整）"
});
characterIntro("linglanmrfz", "铃兰，本名丽萨，姓氏应监护人要求隐去。铃兰小姐年纪尚小，但血统使她拥有了优秀的源石技艺天赋。在罗德岛接受治疗的同时，也在接受凯尔希医生的指导。在铃兰小姐主动提出申请后，被批准在有其他干员随行的情况下参与一些低难度任务。");
//# sourceMappingURL=linglanmrfz.js.map
