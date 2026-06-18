import { character, characterIntro, characterTitle, translate, skill } from "../../hooks.js";
import { lib, get, game } from "noname";
character("weiyimrfz", {
  hp: 4,
  skills: ["chibeimrfz", "qilimrfz"],
  pack: "legendSJZX",
  group: "wumrfz",
  sex: "male"
});
characterIntro("weiyimrfz", "斯乔帕·拉辛，乌萨斯独立战术兵团“谢钦”的首领兼总指挥官，自由民领袖。1102年初带队脱离乌萨斯军方管辖，并于圣骏堡事变后彻底独立。后经办事处干员介绍，开始代表“谢钦”与罗德岛接触。");
characterTitle("weiyimrfz", "<font color = #236ccc66>自呼号生发</font>");
translate({
  weiyimrfz: "维伊",
  chibeimrfz: "驰备",
  chibeimrfz_info: "锁定技，每当你获得一张装备牌时，你弃置之，摸两张牌，然后你获得以下效果直到本回合结束（不可叠加）:当你不因此效果而获得牌后,你摸一张牌。",
  qilimrfz: "齐力",
  qilimrfz_info: "锁定技，出牌阶段，你视为装备所有的武器牌。"
});
skill({
  chibeimrfz: {
    audio: ["编入队伍", "行动出发", "部署1"],
    forced: true,
    firstDo: true,
    trigger: {
      player: "gainAfter"
    },
    filter(event, player) {
      return event.cards.some((card) => get.type(card) === "equip" && get.position(card) === "h");
    },
    async content(event, trigger, player) {
      const cards = trigger.cards.filter((card) => get.type(card) === "equip" && get.position(card) === "h");
      for (let card of cards) {
        if (get.type(card) === "equip" && get.position(card) === "h") {
          player.discard({ cards: [card] });
          player.draw(2);
          if (!player.hasSkill("chibeimrfz_effect")) {
            player.addTempSkill("chibeimrfz_effect", { global: "phaseEnd" });
            player.addMark("chibeimrfz_effect", 1, false);
          }
        }
      }
    },
    group: ["chibeimrfz_start"],
    subSkill: {
      start: {
        audio: "chibeimrfz",
        forced: true,
        firstDo: true,
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          if (player.countCards("h", (card) => get.type(card) === "equip") < 1) return false;
          return event.name !== "phase" || game.phaseNumber === 0;
        },
        async content(event, trigger, player) {
          const cards = player.getCards("h", (card) => get.type(card) === "equip");
          for (let card of cards) {
            if (get.type(card) === "equip" && get.position(card) === "h") {
              player.discard({ cards: [card] });
              player.draw(2);
              if (!player.hasSkill("chibeimrfz_effect")) {
                player.addTempSkill("chibeimrfz_effect", { global: "phaseEnd" });
                player.addMark("chibeimrfz_effect", 1, false);
              }
            }
          }
        }
      },
      effect: {
        audio: "chibeimrfz",
        charlotte: true,
        forced: true,
        trigger: {
          player: "gainAfter"
        },
        onremove(player) {
          player.removeMark("chibeimrfz_effect", player.countMark("chibeimrfz_effect"), false);
        },
        intro: {
          content: "本回合不因此技能获得牌时,摸#张牌"
        },
        filter(event, player) {
          return !["chibeimrfz_effect"].includes(event.getParent(2)?.name || "") && player.countMark("chibeimrfz_effect") > 0;
        },
        async content(event, trigger, player) {
          player.draw(player.countMark("chibeimrfz_effect"));
        }
      }
    }
  },
  qilimrfz: {
    audio: ["作战中2", "作战中3"],
    forced: true,
    group: ["qilimrfz_gain"],
    subSkill: {
      gain: {
        charlotte: true,
        silent: true,
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name !== "phase" || game.phaseNumber === 0;
        },
        async content(event, trigger, player) {
          const weapons = {};
          for (let name of lib.inpile) {
            if (get.type(name) === "equip" && get.subtype(name) === "equip1" && !weapons[name]) {
              weapons[name] = lib.card?.[name]?.skills || [];
            }
          }
          if (Object.keys(weapons).length < 1) return;
          for (let name in weapons) {
            for (let skill2 of weapons[name]) {
              const copy = {
                ...lib.skill[skill2],
                filter(event2, player2, name2, target) {
                  return (!lib.skill[skill2].filter || lib.skill[skill2].filter(event2, player2, name2, target)) && player2.isPhaseUsing() && player2.hasSkill("qilimrfz");
                },
                audio: "qilimrfz"
              };
              game.broadcastAll((copy2, skill3) => {
                lib.skill[`${skill3}_weiyimrfz_copy`] = copy2;
                lib.translate[`${skill3}_weiyimrfz_copy`] = lib.translate[skill3];
                lib.translate[`${skill3}_weiyimrfz_copy_info`] = lib.translate[`${skill3}_info`];
              }, copy, skill2);
              player.addSkill(`${skill2}_weiyimrfz_copy`);
            }
          }
        }
      }
    }
  }
});
//# sourceMappingURL=index.js.map
