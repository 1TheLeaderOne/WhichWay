import { game, lib, get, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("shuangwangmrfz", {
  pack: "plotSJZX",
  sex: "female",
  group: "kaizidaiermrfz",
  hp: 8,
  skills: ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz", "gujimrfz", "jiangqingmrfz"]
});
skill({
  "chenke1mrfz": {
    audio: "chenkemrfz"
  },
  "chenke2mrfz": {
    audio: "chenkemrfz"
  },
  "chenke3mrfz": {
    audio: "chenkemrfz"
  },
  "gujimrfz": {
    onremove(player) {
      delete player.storage.chenkemrfz;
    },
    audio: 2,
    derivation: ["bengjiemrfz"],
    trigger: { global: "roundStart" },
    // @ts-ignore
    filter(event, player) {
      return game.roundNumber > 4;
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger, player) {
      let skills = player.getOriginalSkills();
      skills.push(...["guguomrfz", "xingjunmrfz", "datongmrfz"]);
      for (let skill2 of skills) {
        await player.removeSkill(skill2);
      }
      player.addSkill("bengjiemrfz");
      player.sex = "male";
      game.log(player, "将性别变为了", "#y男性");
      player.node.avatar.setBackgroundImage("extension/whitherHelm/image/skill/shuangwang2mrfz.jpg");
    }
  },
  "jiangqingmrfz": {
    audio: 2,
    derivation: ["guguomrfz", "xingjunmrfz", "datongmrfz"],
    init(player) {
      player.storage.jiangqingmrfz = {
        0: {
          intro: "弃置两种不同颜色的牌，获得“固国”",
          // @ts-ignore
          filter(event, player2) {
            return ["red", "black"].every(
              (i) => player2.getCards("hes").map((j) => get.color(j)).includes(i)
            );
          },
          // @ts-ignore
          async content(event, trigger, player2) {
            const bool = await player2.chooseToDiscard(true, "弃置两种不同颜色的牌，获得“固国”", 2).set("ai", (card) => 8 - get.value(card)).set(
              "filterCard",
              (card, player3) => !ui.selected.cards.some((cardx) => get.color(cardx, player3) == get.color(card, player3))
            ).set("complexCard", true).forResult("bool");
            if (bool === true) {
              player2.addSkill("guguomrfz");
              delete player2.storage.jiangqingmrfz[0];
              let original = player2.getSkills(null, false, false).filter((i) => {
                return player2.getOriginalSkills().includes(i);
              });
              player2.removeSkill(original[0]);
              return true;
            }
          }
        },
        1: {
          intro: "弃置三种不同类型的牌，获得“兴军”",
          // @ts-ignore
          filter(event, player2) {
            return ["trick", "basic", "equip"].every(
              (i) => player2.getCards("hes").map((j) => get.type2(j)).includes(i)
            );
          },
          // @ts-ignore
          async content(event, trigger, player2) {
            const bool = await player2.chooseToDiscard(true, "弃置三种不同类型的牌，获得“兴军”", 3).set("ai", (card) => 8 - get.value(card)).set(
              "filterCard",
              (card, player3) => !ui.selected.cards.some((cardx) => get.type2(cardx, player3) == get.type2(card, player3))
            ).set("complexCard", true).forResult("bool");
            if (bool === true) {
              player2.addSkill("xingjunmrfz");
              delete player2.storage.jiangqingmrfz[1];
              let original = player2.getSkills(null, false, false).filter((i) => {
                return player2.getOriginalSkills().includes(i);
              });
              player2.removeSkill(original[0]);
              return true;
            }
          }
        },
        2: {
          intro: "弃置四种不同花色的牌，获得“大同”",
          // @ts-ignore
          filter(event, player2) {
            return lib.suit.every(
              (i) => player2.getCards("hes").map((j) => get.suit(j)).includes(i)
            );
          },
          // @ts-ignore
          async content(event, trigger, player2) {
            const bool = await player2.chooseToDiscard(true, "弃置四种不同花色的牌，获得“大同”", 4).set("ai", (card) => 8 - get.value(card)).set(
              "filterCard",
              (card, player3) => !ui.selected.cards.some((cardx) => get.suit(cardx, player3) == get.suit(card, player3))
            ).set("complexCard", true).forResult("bool");
            if (bool === true) {
              player2.addSkill("datongmrfz");
              delete player2.storage.jiangqingmrfz[2];
              let original = player2.getSkills(null, false, false).filter((i) => {
                return player2.getOriginalSkills().includes(i);
              });
              player2.removeSkill(original[0]);
              return true;
            }
          }
        },
        3: {
          intro: "失去两点体力和体力上限、失去所有不因此技能而获得的技能。",
          // @ts-ignore
          filter(event, player2) {
            return true;
          },
          // @ts-ignore
          async content(event, trigger, player2) {
            await player2.loseHp(3);
            await player2.loseMaxHp(3);
            let gainSkills = ["guguomrfz", "xingjunmrfz", "datongmrfz"];
            let skills = player2.getSkills(null, false, false).filter((i) => {
              const info = get.info(i);
              if (gainSkills.includes(i)) return false;
              return !info || !info.charlotte;
            });
            for (let skill2 of skills) {
              player2.removeSkill(skill2);
            }
            player2.drawTo(player2.maxHp);
            return true;
          }
        }
      };
    },
    forced: true,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      let info = player.storage.jiangqingmrfz;
      let keys = Object.keys(info);
      return info[keys[0]].filter(event, player);
    },
    async content(event, trigger, player) {
      let info = player.storage.jiangqingmrfz;
      for (let i of [0, 1, 2, 3]) {
        if (!get.is.object(info[i])) continue;
        if (!info[i].filter(event, player)) return;
        const bool = await info[i].content(event, trigger, player);
        if (bool !== true) break;
        player.logSkill("jiangqingmrfz");
      }
    }
  },
  "bengjiemrfz": {
    audio: 2,
    intro: {
      // @ts-ignore
      content(event, player) {
        let num = lib.skill.bengjiemrfz.getX(player);
        return `当前X为:${num}`;
      }
    },
    getX(player) {
      return Math.max(
        0,
        player.getSkills(null, false, false).filter((i) => {
          const info = get.info(i);
          const banSkills = player.storage.chenkemrfz || [];
          if (banSkills.includes(i)) return false;
          return !info || !info.charlotte;
        }).length - player.countMark("bengjiemrfz")
      );
    },
    trigger: {
      player: ["phaseEnd", "damageBegin"]
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger, player) {
      if (trigger.name === "damage") {
        trigger.num += game.roundNumber;
      } else {
        let num = lib.skill.bengjiemrfz.getX(player);
        await player.draw(num);
        player.addMark("bengjiemrfz", Math.floor(num / 2), false);
      }
    }
  },
  "guguomrfz": {
    mod: {
      // @ts-ignore
      globalFrom(from, to, distance) {
        return distance - lib.skill.bengjiemrfz.getX(from);
      }
    },
    audio: 1,
    trigger: { player: "phaseDrawBegin2" },
    // @ts-ignore
    filter(event, player) {
      return !event.numFixed;
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger, player) {
      trigger.num += lib.skill.bengjiemrfz.getX(player);
    }
  },
  "xingjunmrfz": {
    audio: 1,
    trigger: { source: "damageEnd" },
    forced: true,
    // @ts-ignore
    filter(event, player) {
      return event.card && event.card.name === "sha";
    },
    async content(event, trigger, player) {
      player.draw();
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") return num + lib.skill.bengjiemrfz.getX(player);
      }
    }
  },
  "datongmrfz": {
    init(player) {
      player.link(true);
    },
    global: "datongmrfz_buff",
    audio: 1,
    trigger: {
      player: ["linkBefore", "enterGame"],
      global: "phaseBefore"
    },
    forced: true,
    filter(event, player) {
      if (event.name == "link") return player.isLinked();
      return (event.name != "phase" || game.phaseNumber == 0) && !player.isLinked();
    },
    async content(event, trigger, player) {
      if (trigger.name != "link") player.link(true);
      else trigger.cancel();
    },
    group: "datongmrfz_revival",
    subSkill: {
      revival: {
        audio: "datongmrfz",
        forced: true,
        trigger: { source: "dieAfter" },
        // @ts-ignore
        filter(event, player) {
          return get.mode() == "identity";
        },
        // @ts-ignore
        async content(event, trigger, player) {
          let target = trigger.player;
          await target.revive();
          target.recoverTo(2);
          target.drawTo(2);
          if (player.identity != "zhu") target.identity = player.identity;
          else target.identity = "zhong";
          target.node.identity.dataset.color = target.identity;
          target.identityShown = true;
          target.setIdentity(target.identity);
        }
      },
      buff: {
        mod: {
          maxHandcard(player, num) {
            if (game.hasPlayer((current) => current.hasSkill("datongmrfz")) && player.isLinked())
              return num + lib.skill.bengjiemrfz.getX(player);
          }
        }
      }
    },
    ai: {
      effect: {
        target(card) {
          if (card.name == "tiesuo") return "zeroplayertarget";
        }
      }
    }
  }
});
translate({
  "shuangwangmrfz": "特蕾西娅&特雷西斯",
  "gujimrfz": "痼疾",
  "gujimrfz_info": "锁定技，第五轮开始时，你失去武将牌上的所有技能和因“将倾”获得的技能并获得“崩解”，然后你将武将性别改为男；当你失去此技能后，你的所有技能均参与技能数的计算；此技能不参与技能数的计算。",
  "jiangqingmrfz": "将倾",
  "jiangqingmrfz_info": "锁定技，出牌阶段开始时，你依次执行下列选项并删除执行的选项，你每执行一项便失去武将牌上的第一个技能：<br>1.弃置两种不同颜色的牌，获得“固国”；<br>2.弃置三种不同类型的牌，获得“兴军”；<br>3.弃置四种不同花色的牌，获得“大同”；<br>4.失去三点体力和体力上限、失去所有不因此技能而获得的技能，然后你将手牌补至体力上限。<br>此技能不参与技能数的计算。",
  "bengjiemrfz": "崩解",
  "bengjiemrfz_info": "锁定技，回合结束时，你永久令X/2（向下取整）并摸X张牌；你受到的伤害+Y。（X=你的技能数，Y=游戏轮数）",
  "guguomrfz": "固国",
  "guguomrfz_info": "锁定技，你的额定摸牌数+X；你计算与其他角色的距离-X。（X=你的技能数）",
  "xingjunmrfz": "兴军",
  "xingjunmrfz_info": "锁定技，使用【杀】的次数+X；当你使用【杀】造成伤害后，你摸一张牌。（X=你的技能数）",
  "datongmrfz": "大同",
  "datongmrfz_info": "锁定技，你始终横置，所有被横置的角色手牌上限+X；被你杀死的角色复活、将手牌和体力值调整至2和将身份替换成与你一致（仅限身份模式）。（X=你的技能数）"
});
characterTitle("shuangwangmrfz", "<font color='#00008b'>千年之愿</font>");
characterIntro("shuangwangmrfz", "或许我们能走向不同的结局...");
