import { game, get } from "noname";
window.whichWaySave.tmpSave;
const special1SJZX = {
  character: {
    talaidingzhenmrfz: ["female", "luomrfz", 4, ["xuebaomrfz"], ["forbidai"]],
    paxinghaomrfz: ["male", "weimrfz", 1, ["yinqingmrfz", "jushoumrfz"], ["forbidai"]],
    muouwuzhemrfz: ["female", "bomrfz", 2, [], ["forbidai"]],
    ceshimrfz: ["female", "wei", 10, ["ceshiSkillmrfz"], ["forbidai"]],
    fengwan_zhioumrfz: {
      sex: "female",
      group: "dongmrfz",
      hp: 1,
      maxHp: 2,
      skills: [],
      isAiForbidden: true
    }
  },
  skill: {
    // 测试
    ceshiSkillmrfz: {
      audio: false,
      trigger: { player: "drawBegin" },
      async content(event, trigger, player) {
        trigger.num *= 2;
        trigger.gaintag.push("example_tag");
      }
    },
    // 泰拉丁真
    xuebaomrfz: {
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      charlotte: true,
      derivation: ["olluanji"],
      filter(event, player) {
        return event.name != "phase" || game.phaseNumber == 0;
      },
      async content(event, trigger, player) {
        function countChineseCharacters(str) {
          var chineseRegex = /[\u4e00-\u9fa5]/g;
          var chineseMatches = str.match(chineseRegex);
          return chineseMatches ? chineseMatches.length : 0;
        }
        for (var target of game.players) {
          if (target == player) {
            player.addSkills("olluanji");
            continue;
          }
          var skills = target.getSkills(true, false, false);
          if (skills.length == 0) continue;
          for (var skillName of skills) {
            var info = get.skillInfoTranslation(skillName);
            if (countChineseCharacters(info) >= 50) await target.removeSkill(skillName);
          }
          if (target.skills.length == 0) target.addSkills("olluanji");
        }
      }
    },
    // 爬行号
    yinqingmrfz: {
      mod: {
        maxHandcard: function(player, num) {
          return num + 2;
        },
        attackRange: function(player, num) {
          return num += 2;
        }
      },
      audio: 2,
      trigger: { player: ["phaseJudgeBefore", "phaseDrawBegin2"] },
      forced: true,
      async content(event, trigger, player) {
        if (trigger.name === "name") trigger.cancel();
        else trigger.num += 2;
      },
      ai: {
        threaten: 1.5,
        effect: {
          target: function(card, player, target, current) {
            if (get.type(card) == "delay")
              return "zeroplayertarget";
          }
        }
      }
    },
    jushoumrfz: {
      audio: 2,
      usable: 1,
      trigger: { source: "damageBegin" },
      filter: function(event, player) {
        return event.player != player && event.player.node.hp.dataset.condition == "high";
      },
      prompt(event, player) {
        let num = Math.floor(event.player.maxHp / 3);
        return `【巨兽】:是否令${get.translation(event.player)}将体力调整至${num}?`;
      },
      check(event, player) {
        return get.attitude2(event.player) < 0;
      },
      async content(event, trigger, player) {
        let num = Math.floor(trigger.player.maxHp / 3);
        let draw = trigger.player.hp - num;
        trigger.player.hp = num;
        trigger.player.$update();
        game.log(trigger.player, "的体力被调整至", num);
        player.draw(draw);
      },
      ai: {
        threaten: 1.2
      }
    }
  }
};
export {
  special1SJZX as default
};
//# sourceMappingURL=special1SJZX.js.map
