import { game, _status, lib, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("tekenuomrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "bomrfz",
  hp: 4,
  skills: ["suoumrfz"]
});
skill({
  "suoumrfz": {
    init(player) {
      game.addGlobalSkill("autoswap");
      player.suoumrfz = player;
    },
    onremove(player) {
      for (let i of game.players) {
        if (i.name === "muouwuzhemrfz") i.die();
      }
    },
    audio: 2,
    trigger: { source: "damageEnd" },
    filter(event, player) {
      return event.player && event.player.isIn() && event.player.name !== "muouwuzhemrfz" && event.player.getNext().name != "muouwuzhemrfz";
    },
    prompt(event, player) {
      return `【塑偶】:是否在${get.translation(event.player)}和${get.translation(event.player.getNext())}之间放置一个‘木偶舞者’？`;
    },
    async content(event, trigger, player) {
      trigger.player.getNext();
      var fellow = game.addPlayer(trigger.player.getSeatNum(), "muouwuzhemrfz").animate("start");
      fellow.getId();
      fellow.host = player;
      if (player.identity != "zhu" || get.mode() === "doudizhu") fellow.identity = player.identity;
      else fellow.identity = "zhong";
      fellow.node.identity.dataset.color = fellow.identity;
      fellow.identityShown = true;
      fellow.init("muouwuzhemrfz");
      fellow.draw(3);
      fellow.update();
      fellow.addSkill("suoumrfz_dead");
      fellow.suoumrfz = player;
      let skillList = trigger.player.getOriginalSkills();
      let introSkill = skillList.map((i) => get.translation(i) + ":" + get.skillInfoTranslation(i));
      const { index } = skillList.length === 1 ? { index: 0 } : await player.chooseControl().set("choiceList", introSkill).forResult();
      fellow.addSkill(skillList[index] === "suoumrfz" ? "yingzi" : skillList[index]);
      for (let i = 0; i < game.players.length; i++) {
        let current = game.players[i];
        current.seatNum = i + 1;
        current.update();
      }
      await game.updateRoundNumber();
      for (let i of game.players) {
        if (i === player || i.suoumrfz === true) {
          i.draw();
        }
      }
    },
    group: ["suoumrfz_swap", "suoumrfz_die"],
    subSkill: {
      die: {
        charlotte: true,
        silent: true,
        trigger: { global: "dieBegin" },
        async content(event, trigger, player) {
          if (trigger.player === player) lib.skill.suoumrfz.onremove(player);
          else {
            let chars = game.players.slice();
            chars.remove(player);
            chars.remove(trigger.player);
            chars = chars.map((i) => i.name);
            if (chars.every((i) => i === "muouwuzhemrfz") || chars.length === 0) {
              player.when({ global: "dieAfter" }).then(() => {
                game.over(true);
              });
            }
          }
        }
      },
      swap: {
        init(player, skill2) {
          player.storage[skill2] = player;
        },
        onremove: true,
        firstDo: true,
        charlotte: true,
        silent: true,
        trigger: {
          global: [
            "playercontrol",
            "chooseToUseBegin",
            "chooseToRespondBegin",
            "chooseToDiscardBegin",
            "chooseToCompareBegin",
            "chooseButtonBegin",
            "chooseCardBegin",
            "chooseTargetBegin",
            "chooseCardTargetBegin",
            "chooseControlBegin",
            "chooseBoolBegin",
            "choosePlayerCardBegin",
            "discardPlayerCardBegin",
            "gainPlayerCardBegin",
            "chooseToMoveBegin",
            "chooseToPlayBeatmapBegin",
            "chooseToGiveBegin"
          ]
        },
        filter(event, player) {
          if (_status.auto || !event.player.suoumrfz || !game.me?.suoumrfz) return false;
          return !event.player.isUnderControl(true);
        },
        async content(event, trigger, player) {
          game.swapPlayer(trigger.player);
        }
      },
      dead: {
        charlotte: true,
        silent: true,
        trigger: { player: "dieBegin" },
        async content(event, trigger, player) {
          if (game.me != player.suoumrfz) await game.swapPlayer(player.suoumrfz);
          game.removePlayer(player);
          game.log(player, `被移出游戏`);
        }
      }
    }
  }
});
translate({
  "tekenuomrfz": "特克诺",
  "suoumrfz": "塑偶",
  "suoumrfz_info": "当你对一名其他角色造成伤害后，若该角色与其下家之间没有“木偶舞者”且该角色不为“木偶舞者”，你可以在该角色与其下家之间放置一个“木偶舞者”（你失去此技能或死亡后自动死亡），其获得该角色武将牌上的一个技能并摸三张牌，然后你与所有“木偶舞者”摸一张牌。<br>木偶舞者：①死亡后自动移除游戏；②由你控制；③不能获得“塑偶”。"
});
characterTitle("tekenuomrfz", "<font color='#b8860b'>制偶艺术家</font>");
characterIntro("tekenuomrfz", "特克诺，多索雷斯街头艺术社区成员，曾卷入克里斯达尔艺术馆的恐怖袭击事件，因暴露于大量源石粉尘之中，感染加重。经干员龙舌兰介绍，特克诺来到罗德岛寻求医疗援助。病情稳定后，她主动提出加入罗德岛。现已通过相关培训和测试，作为外勤干员常驻于多索雷斯。");
