import { game, get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("talaidingzhenmrfz", {
  pack: "specialSJZX",
  sex: "female",
  group: "luomrfz",
  hp: 4,
  skills: ["xuebaomrfz"],
  isAiForbidden: true
});
skill({
  "xuebaomrfz": {
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
  }
});
translate({
  "talaidingzhenmrfz": "泰拉丁真",
  "xuebaomrfz": "学爆",
  "xuebaomrfz_info": "锁定技，游戏开始时，你令其他所有角色失去技能描述大于50个字的技能，然后所有没有技能的角色和你获得【乱击】。"
});
characterIntro("talaidingzhenmrfz", "‘今天我很荣幸，作为一个卡兹戴尔的孩子，能来到伦蒂尼姆，讲我和萨卡兹朋友们的故事。<br>我的村庄叫巴别塔，小小的，但是军委会和十王庭却很大。<br>这个世界不但属于我，也属于我的萨卡兹朋友们。<br>我们魔族佬说，一条死魂灵中都有十万个祖宗。<br>我最近一直在努力学习，在书本中学习，也在战场上学习。我想告诉大家，特蕾西娅可以教会我们很多很多。<br>我希望大家，特别是小朋友们，能来到卡兹戴尔的大自然中学习，让我的萨卡兹朋友们来教会你们。’");
//# sourceMappingURL=talaidingzhenmrfz.js.map
