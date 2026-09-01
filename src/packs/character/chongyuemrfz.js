import { get, lib, _status, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("chongyuemrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "suimrfz",
  hp: 3,
  skills: ["shubianmrfz", "wubenmrfz", "wowumrfz"]
});
skill({
  "wubenmrfz": {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    firstDo: true,
    direct: true,
    filter: function(event, player) {
      if (player.countCards("h") == 0) return false;
      return !player.getEquip(1) && game.hasPlayer(function(target) {
        return target != player && player.inRange(target);
      });
    },
    async content(event, trigger, player) {
      const result = await player.chooseCard("h", "你可以使用一张【杀】").set("ai", function(card) {
        if (game.hasPlayer(function(current) {
          return current != player && player.inRange(current) && get.attitude(player, current) < 0;
        }))
          return 6 - get.value(card);
        return 0;
      }).forResult();
      if (result.cards) {
        player.chooseUseTarget({ name: "sha" }, result.cards, true, false);
        player.logSkill("wubenmrfz");
      }
    },
    mod: {
      cardUsable: function(card, player, num) {
        if (card.name == "sha" && !player.getEquip(1)) return num + 1;
      },
      maxHandcard: function(player, num) {
        return num += Math.floor((5 - player.countCards("e")) / 2);
      }
    }
  },
  "wowumrfz": {
    intro: {
      content: function(event, player) {
        if (player.countMark("wowumrfz_time") >= 5)
          return "<span class=firetext>【气收秋毫平】</span></br>已使用" + player.countMark("wowumrfz") + "张牌";
        return "<span class=firetext>【劲发江潮落】</span></br>已使用" + player.countMark("wowumrfz") + "张牌</br>已发动" + player.countMark("wowumrfz_time") + "次【我无】";
      }
    },
    onremove: true,
    derivation: "wowumrfz_rewrite",
    audio: 4,
    trigger: { player: "useCardAfter" },
    direct: true,
    filter: function(event, player) {
      if ((player != _status.currentPhase || !player.isPhaseUsing()) && player.countMark("wowumrfz_time") < 5) return false;
      return true;
    },
    async content(event, trigger, player) {
      let result;
      player.addMark("wowumrfz", 1, false);
      if (player.countMark("wowumrfz") >= 3 && !player.hasMark("shubianmrfz")) {
        result = await player.chooseTarget(false, get.prompt("wowumrfz"), "你可以对一名其他角色使用一张【杀】", (card, player2, target) => {
          return player2.countMark("wowumrfz_time") >= 5 ? target !== player2 : target !== player2 && player2.inRange(target);
        }).set("ai", (target) => {
          return -get.attitude(player, target);
        }).forResult();
        player.removeMark("wowumrfz", 3, false);
        if (player.countMark("wowumrfz_time") < 5) {
          player.addMark("wowumrfz_time", 1, false);
        }
      } else if (player.countMark("wowumrfz") >= 3) {
        if (player.countMark("wowumrfz_time") < 5) {
          player.addMark("wowumrfz_time", 1, false);
        }
        player.removeMark("wowumrfz", 3, false);
      } else {
        return;
      }
      if (result?.bool && result?.targets) {
        await player.useCard({ name: "sha", isCard: true }, true, false, result.targets);
        player.logSkill("wowumrfz", result.targets);
        if (player.countMark("wowumrfz_time") >= 5) {
          await player.draw();
        }
      }
    },
    group: "wowumrfz_draw",
    subSkill: {
      draw: {
        direct: true,
        trigger: { source: "damageEnd" },
        filter: function(event, player) {
          var evt = event.getParent(3);
          if (!event.card) return false;
          var sha = event.card.name == "sha";
          return player.countMark("wowumrfz_time") < 5 && evt && evt.name == "wowumrfz" && evt.player == player && sha;
        },
        async content(event, trigger, player) {
          player.draw();
          player.logSkill("wowumrfz");
        }
      }
    },
    ai: {
      threaten: 1.3,
      expose: 0.2
    }
  },
  "shubianmrfz": {
    audio: 4,
    trigger: { player: "damageEnd" },
    filter: function(event, player) {
      return event.source != player && event.source.isAlive() && event.source != void 0;
    },
    check(event, player) {
      return get.attitude(player, event.source) < 0;
    },
    async content(event, trigger, player) {
      let source = trigger.source;
      source.addTempSkill("shubianmrfz_eff", { global: "phaseAfter" });
      source.markSkill("shubianmrfz_eff");
      if (source.countDiscardableCards(player, "e")) {
        player.discardPlayerCard("e", source).set("target", source).set("complexSelect", true).set("ai", lib.card.guohe.ai.button).set("prompt", `你可以弃置${get.translation(source)}装备区的一张牌`);
      }
    },
    subSkill: {
      eff: {
        charlotte: true,
        silent: true,
        mark: true,
        intro: {
          content: "·手牌上限+2<br>·无法使用手牌中的伤害类牌"
        },
        onremove(player) {
          player.unmarkSkill("shubianmrfz_eff");
        },
        mod: {
          maxHandcard: function(player, num) {
            return num += 2;
          },
          cardEnabled2(card, player) {
            if (get.position(card) === "h" && get.tag(card, "damage")) {
              return false;
            }
          }
        }
      }
    },
    ai: {
      threaten: 0.8
    }
  }
});
translate({
  "chongyuemrfz": "重岳",
  "wubenmrfz": "武本",
  "wubenmrfz_info": "锁定技，当你装备区没有武器牌时，你使用【杀】的次数+1；你的手牌上限+X（X=你装备区空余的装备栏数/2，向下取整）。出牌阶段开始时，若你装备区没有武器牌，你可以选择一张手牌并视其为【杀】使用之。",
  "wowumrfz": "我无",
  "wowumrfz_info": "<span class=firetext>【劲发江潮落】</span></br>你的回合内，你每使用三张牌可视为使用一张不计入次数的【杀】，若此【杀】造成了伤害，你摸一张牌；锁定技，当你本局游戏累计发动5次【我无】时，修改此技能。",
  "wowumrfz_rewrite": "我无·修改",
  "wowumrfz_rewrite_info": "<span class=firetext>【气收秋毫平】</span></br>每当你累计使用或打出三张牌时，你可以视为使用一张无距离限制且不计入次数的【杀】，然后你摸一张牌。",
  "shubianmrfz": "戍边",
  "shubianmrfz_info": "当你受到其他角色造成的伤害后，你可以令伤害来源本回合手牌上限+2（不可叠加）且无法使用手牌中的伤害类牌，然后你可以弃置伤害来源装备区的一张牌。"
});
characterTitle("chongyuemrfz", "<font color=#FFF68F>玉门戍卫</font>");
characterIntro("chongyuemrfz", "重岳，留舰人员年、夕、令的兄长，与炎国兵部、司岁台等政府部门往来密切，此前担任移动城市玉门的武术教官，已卸任。因探视亲属来到罗德岛，经过审核，暂时凭访客身份驻留本舰。重岳具有丰富的战场经验，为罗德岛提供过独特的作战建议，但应凯尔希医生要求，重岳本人较少直接参加任务。");
//# sourceMappingURL=chongyuemrfz.js.map
