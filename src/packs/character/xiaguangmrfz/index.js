import { get, _status, game, lib, ui } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("xiaguangmrfz", {
  sex: "female",
  group: "kamrfz",
  hp: 4,
  skills: ["rencimrfz", "huiguangmrfz", "jiandunmrfz"]
});
skill({
  "rencimrfz": {
    audio: 2,
    trigger: {
      global: "phaseEnd"
    },
    filter: function(event, player) {
      if (event.player == player || event.player.getHistory("skipped").length == 0) return false;
      return lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || _status.connectMode && player.countCards("h") > 0);
    },
    direct: true,
    async content(event, trigger, player) {
      player.addTempSkill("rencimrfz_dam", "useCardAfter");
      player.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") return false;
          return lib.filter.filterCard.apply(this, arguments);
        },
        "【仁慈】:是否对" + get.translation(trigger.player) + "使用一张杀？"
      ).set("logSkill", "rencimrfz").set("complexSelect", true).set("filterTarget", function(card, player2, target) {
        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", trigger.player);
    },
    subSkill: {
      dam: {
        silent: true,
        trigger: {
          source: "damageBegin",
          player: "shaMiss"
        },
        filter: function(event, player) {
          return event.card.name == "sha";
        },
        async content(event, trigger, player) {
          if (trigger.name == "damage") trigger.num++;
          player.removeSkill("rencimrfz_dam");
        }
      }
    }
  },
  "huiguangmrfz": {
    audio: 2,
    trigger: { player: "phaseEnd" },
    filter: function(event, player) {
      return player.hasMark("huiguangmrfz") && player.countMark("huiguangmrfz") <= 6;
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      const num = player.countMark("huiguangmrfz") - 1;
      const list = ["准备", "判定", "摸牌", "出牌", "弃牌", "结束"];
      result = await player.chooseTarget("【辉光】:你可以令一名其他角色跳过下个" + list[num] + "阶段", (card, player2, target) => {
        return target !== player2 && !target.hasSkill("huiguangmrfz_skip");
      }).set("ai", (target) => {
        const aiPlayer = _status.event.player;
        const att = get.attitude(target, aiPlayer);
        const markNum = aiPlayer.countMark("huiguangmrfz");
        if (markNum === 2 || markNum === 5) return att > 0;
        return att < 0;
      }).forResult();
      if (result.targets) {
        const target = result.targets[0];
        const markNum = player.countMark("huiguangmrfz") - 1;
        target.addSkill("huiguangmrfz_skip");
        target.addMark("huiguangmrfz_skip", markNum + 1, false);
        player.logSkill("huiguangmrfz", target);
      }
      player.removeMark("huiguangmrfz", player.countMark("huiguangmrfz"), false);
    },
    ai: {
      expose: 0.1
    },
    group: ["huiguangmrfz_mark"],
    subSkill: {
      skip: {
        markimage: "extension/WhichWay/image/skill/sleepmrfz.png",
        intro: {
          name: "睡眠",
          content: function(event, player) {
            var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
            var num = player.countMark("huiguangmrfz_skip") - 1;
            return "跳过下个" + get.tranPhase(phase[num]);
          }
        },
        silent: true,
        trigger: { player: "phaseBegin" },
        async content(event, trigger, player) {
          const phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
          const num = player.countMark("huiguangmrfz_skip") - 1;
          player.skip(phase[num]);
          game.log(player, "跳过了", get.tranPhase(phase[num]));
          player.removeMark("huiguangmrfz_skip", player.countMark("huiguangmrfz_skip"), false);
          player.removeSkill("huiguangmrfz_skip");
        }
      },
      mark: {
        silent: true,
        trigger: {
          player: "useCardAfter"
        },
        filter: function(event, player) {
          return _status.currentPhase == player;
        },
        async content(event, trigger, player) {
          player.addMark("huiguangmrfz", 1, false);
        }
      }
    }
  },
  "jiandunmrfz": {
    audio: 2,
    enable: ["chooseToRespond", "chooseToUse"],
    hiddenCard: function(player, name) {
      if (get.type(name) != "basic") return false;
      return player.hasCard(function(card) {
        return get.type2(card) == "trick";
      }, "hs");
    },
    filter: function(event, player) {
      if (!player.hasCard(function(card) {
        return get.type2(card) == "trick";
      }, "hs"))
        return false;
      for (var name of lib.inpile) {
        if (get.type(name) != "basic") continue;
        if (event.filterCard({ name }, player, event)) return true;
        if (name == "sha") {
          for (var nature of lib.inpile_nature) {
            if (event.filterCard({ name: "sha", nature }, player, event)) return true;
          }
        }
      }
      return false;
    },
    chooseButton: {
      dialog: function(event, player) {
        var list = [];
        for (var name of lib.inpile) {
          if (get.type(name) != "basic") continue;
          if (event.filterCard({ name }, player, event)) {
            list.push(["基本", "", name]);
          }
          if (name == "sha") {
            for (var nature of lib.inpile_nature) {
              if (event.filterCard({ name, nature }, player, event)) list.push(["基本", "", "sha", nature]);
            }
          }
        }
        return ui.create.dialog("剑盾", [list, "vcard"], "hidden");
      },
      check: function(button) {
        var player = _status.event.player;
        var card = {
          //@ts-ignore
          name: button.link[2],
          //@ts-ignore
          nature: button.link[3]
        };
        if (
          //@ts-ignore
          _status.event.getParent().type != "phase" || game.hasPlayer(function(current) {
            return !!player.canUse(card, current) && get.effect(current, card, player, player) > 0;
          })
        ) {
          switch (button.link[2]) {
            case "tao":
            case "shan":
              return 5;
            case "jiu": {
              if (player.countCards("hs", {
                type: "trick"
              }) > 2)
                return 3;
              break;
            }
            case "sha":
              if (button.link[3] == "fire") return 2.95;
              else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
              else return 2.9;
          }
        }
        return 0;
      },
      backup: function(links, player) {
        return {
          audio: "jiandunmrfz",
          filterCard: function(card, player2, target) {
            return get.type2(card) == "trick";
          },
          complexCard: true,
          selectCard: 1,
          check: function(card, player2, target) {
            return 6 - get.value(card);
          },
          viewAs: { name: links[0][2], nature: links[0][3] },
          position: "hes",
          popname: true
        };
      },
      prompt: function(links, player) {
        return "你可以将一张锦囊牌当任意基本牌使用或打出";
      }
    },
    ai: {
      order: 3.1,
      skillTagFilter: function(player, tag, arg) {
        if (tag == "fireAttack") return true;
        if (!player.hasCard(function(card) {
          return get.type2(card) == "trick";
        }, "hes")) {
          return false;
        }
      },
      result: {
        player: 1
      },
      respondSha: true,
      respondShan: true,
      fireAttack: true
    }
  }
});
translate({
  "xiaguangmrfz": "瑕光",
  "rencimrfz": "仁慈",
  "rencimrfz_info": "一名其他角色的结束阶段开始时，若其本回合跳过了任一阶段，你可以对其使用一张【杀】，此杀造成的伤害+1。",
  "huiguangmrfz": "辉光",
  "huiguangmrfz_info": "回合结束时，你可以令一名其他角色（不能是已经拥有此技能效果的角色）跳过其下个回合的第X个阶段。(X=本回合你使用的牌的数量)",
  "jiandunmrfz": "剑盾",
  "jiandunmrfz_info": "你可以将锦囊牌当任意基本牌使用或打出。"
});
characterIntro("xiaguangmrfz", "瑕光，本名玛莉娅·临光，来自卡西米尔的年轻骑士，干员临光的妹妹，曾有骑士竞技经验，在各项测试中均展露出优秀的作战素质。应本人期望，与干员临光共同作为重装干员行动。");
//# sourceMappingURL=index.js.map
