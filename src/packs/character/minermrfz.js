import { get, game, lib, ui } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("minermrfz", {
  pack: "plotSJZX",
  group: "wumrfz",
  sex: "male",
  skills: ["xunkaimrfz"],
  hp: 3
});
skill({
  "xunkaimrfz": {
    audio: 2,
    forced: true,
    derivation: ["xinjuejing", "weijing"],
    trigger: {
      player: ["dying", "enterGame"],
      global: "phaseBefore"
    },
    filter(event, player) {
      return event.name !== "phase" || game.phaseNumber === 0;
    },
    firstDo: true,
    async content(event, trigger, player) {
      if (player.maxHp > 1) {
        let gains = ["xinjuejing", "weijing"].map((i) => `${i}_${get.randomNumberSJZX()}`);
        game.broadcastAll((skills) => {
          skills.forEach((skill2) => {
            let original = skill2.split("_")[0];
            let info = get.info(original);
            lib.skill[skill2] = {
              ...info,
              audio: original,
              xunkaimrfz: true,
              onremove: true
            };
            lib.translate[skill2] = lib.translate[original];
            lib.translate[`${skill2}_info`] = lib.translate[`${original}_info`];
            if (original === "weijing") {
              lib.dynamicTranslate[skill2] = (player2, skill3) => {
                return player2.storage[skill3] ? "每轮限一次，当你需要使用基本牌时，你可以视为使用之" : lib.translate.weijing_info;
              };
              lib.skill[skill2] = {
                ...lib.skill[skill2],
                filter(event2, player2) {
                  if (event2.type === "wuxie" || player2.hasSkill(`${skill2}_used`)) {
                    return false;
                  }
                  let names = player2.storage[skill2] ? lib.inpile.filter((i) => get.type(i) === "basic") : ["sha", "shan"];
                  for (var name of names) {
                    if (event2.filterCard({ name, isCard: true }, player2, event2)) {
                      return true;
                    }
                  }
                  return false;
                },
                hiddenCard(player2, name) {
                  let names = player2.storage[skill2] ? lib.inpile.filter((i) => get.type(i) === "basic") : ["sha", "shan"];
                  return names.includes(name) && !player2.hasSkill(`${skill2}_used`);
                },
                chooseButton: {
                  ...lib.skill[skill2].chooseButton,
                  // @ts-ignore
                  backup: function(links, player2) {
                    return {
                      audio: "weijing",
                      viewAs: {
                        name: links[0][2]
                      },
                      filterCard: () => false,
                      selectCard: -1,
                      position: "hes",
                      popname: true,
                      check(card) {
                        return 6 / Math.max(1, get.value(card));
                      },
                      // @ts-ignore
                      async precontent(event2, trigger2, player3) {
                        player3.addTempSkill(`${skill2}_used`, "roundEnd");
                      }
                    };
                  },
                  dialog(event2, player2) {
                    let names = player2.storage[skill2] ? lib.inpile.filter((i) => get.type(i) === "basic") : ["sha", "shan"];
                    var vcards = [];
                    for (var name of names) {
                      var card = { name, isCard: true };
                      if (event2.filterCard(card, player2, event2)) {
                        vcards.push(["基本", "", name]);
                      }
                    }
                    var dialog = ui.create.dialog("卫境", [vcards, "vcard"], "hidden");
                    dialog.direct = true;
                    return dialog;
                  }
                }
              };
            }
          });
        }, gains);
        await player.addSkills(gains);
        await player.loseMaxHp();
        player.recoverTo(1);
      } else {
        let skills = player.getSkills().filter((skill3) => {
          let info = get.info(skill3);
          return info && info.xunkaimrfz && skill3.startsWith("weijing");
        });
        if (skills.length < 1) return;
        let skill2 = skills.randomGet();
        player.storage[skill2] = true;
      }
    }
  }
});
translate({
  "minermrfz": "矿工游击队",
  "xunkaimrfz": "殉忾",
  "xunkaimrfz_info": "锁定技，游戏开始时，或你进入濒死状态时，若你的体力上限大于1，你获得技能“绝境”和“卫境”（均可重复获得），然后减少一点体力上限，将体力值恢复至1，反之，你将获得的一个“卫境”的描述修改为：“每轮限一次，当你需要使用基本牌时，你可以视为使用之”。"
});
characterIntro("minermrfz", "矿工们自发组织的反抗队伍，成员多是青壮年。他们并非失去理智的暴民，他们只是想保护仍躲在地下的亲人。");
