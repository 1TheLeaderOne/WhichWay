import { get, lib, game, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("ruoyemumrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "othermrfz",
  hp: 1,
  maxHp: 3,
  skills: ["lingwomrfz", "pojianmrfz", "wuweimrfz"],
  clans: ["AveMujica"]
});
skill({
  "lingwomrfz": {
    audio: 2,
    trigger: {
      player: "dying"
    },
    forced: true,
    // @ts-ignore
    filter(event, player) {
      return player.countCards("he", (card) => {
        return game.hasPlayer((target) => target.canEquip(card) || get.type(card) !== "equip");
      }) > 0;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      const num = lib.skill.wuweimrfz.getNum(player, event.name);
      const result = await player.chooseCardTarget({
        forced: true,
        prompt: `你${get.poptip("sjzx_byRecast")}将一张牌赠予一名其他角色，并将体力至调整至${Math.max(1, num)}`,
        // @ts-ignore
        filterTarget: (card, player2, target2) => ui.selected.cards.every((value) => {
          return target2 !== player2 && (target2.canEquip(value) || get.type(value) !== "equip");
        }),
        filterCard(card) {
          return game.hasPlayer((current) => {
            return current.canEquip(card) || get.type(card) !== "equip";
          });
        },
        position: "he",
        ai1: (card) => {
          return 8 - get.value(card);
        },
        ai2: (target2) => {
          let player2 = get.player();
          return lib.skill._gifting.ai.result.target(player2, target2);
        }
      }).forResult();
      const { cards, targets } = result;
      if (!cards || !targets) return;
      const target = targets[0];
      player.recast(cards);
      player.gift(cards, target);
      player.recoverTo(Math.max(1, lib.skill.wuweimrfz.getNum(player, event.name)));
      let skills = player.getSkills(null, null, false).filter((skill2) => {
        let info = get.info(skill2);
        return info && !info.charlotte && !info.equipSkill;
      });
      const { control } = await player.chooseControl(skills).set("prompt", `请选择失去一个技能直到本轮结束`).set("ai", () => {
        let { skills: skills2, player: player2 } = get.event();
        if (skills2.includes("wuweimrfz")) return "wuweimrfz";
        if (skills2.length > 1 && skills2.includes("pojianmrfz")) skills2.remove("pojianmrfz");
        return skills2.randomGet();
      }).set("skills", skills).forResult();
      if (control) {
        player.removeSkill(control);
        player.when({ global: "roundStart" }).step(async (event2, trigger2, player2) => {
          player2.addSkill(control);
        });
      }
    },
    ai: {
      threaten: 0.8
    }
  },
  "pojianmrfz": {
    audio: 2,
    trigger: {
      player: "damageEnd"
    },
    // @ts-ignore
    filter(event, player) {
      return player.countCards("h") > 0 && player.hasUseTarget("taoyuan");
    },
    usable: 3,
    // @ts-ignore
    async cost(event, trigger, player) {
      player.getSkills(null, null, false).filter((skill2) => {
        let info = get.info(skill2);
        return info && !info.charlotte;
      });
      let num = lib.skill.wuweimrfz.getNum(player, "pojianmrfz");
      const { result } = await player.chooseCardTarget({
        prompt: `你可以将一张牌${get.poptip("sjzx_byRecast")}当目标数至多为${Math.max(1, num)}的【桃园结义】使用，然后因此回复体力值的角色摸${num}张牌，反之其本回合使用的下一张牌额外结算${num}次`,
        filterCard: true,
        // @ts-ignore
        filterTarget(card, player2, target) {
          return player2.canUse("taoyuan", target);
        },
        selectTarget() {
          let num2 = get.event().num;
          return [1, num2];
        },
        ai1(card) {
          let player2 = get.player();
          if (player2.isPhaseUsing() && player2.countCards("h", (card2) => player2.hasUseTarget(card2) && ["equip", "delay"].includes(get.type(card2))) > 0) return false;
          if (!player2.isPhaseUsing() && !game.hasPlayer((char) => get.attitude2(char) > 0 && char.getDamagedHp() > 0)) return false;
          return 8 - get.value(card);
        },
        ai2(target) {
          get.player();
          let num2 = 0;
          if (get.attitude2(target) < 0) return -1;
          if (target.getDamagedHp() > 0) num2 += target.hp === 1 ? 5 : 2;
          if (target.isPhaseUsing() && target.getDamagedHp() < 1 && game.hasPlayer((char) => char.countCards("h", (card) => char.hasUseTarget(card) && ["equip", "delay"].includes(get.type(card))) > 0)) num2 += 1;
          return num2;
        }
      }).set("num", num);
      event.result = result;
    },
    async content(event, trigger, player) {
      const { cards, targets } = event;
      let randomId = get.randomNumberSJZX();
      let damageCard = trigger.card;
      player.when({ player: "useCardAfter" }).filter((event2, player2) => {
        return event2.card?.storage?.pojianmrfz;
      }).step(async (event2, trigger2, player2) => {
        const num = lib.skill.wuweimrfz.getNum(player2, "pojianmrfz");
        if (num < 1) return;
        game.getRoundHistory("changeHp", (evt) => {
          let evtx = evt.getParent();
          if (evtx.name === "recover" && targets.includes(evtx.player) && evtx.card && evtx.card?.storage?.pojianmrfz_id === randomId) {
            evtx.player.draw(num);
            targets.remove(evtx.player);
          }
        });
        targets.forEach((target) => {
          target.markSkill("pojianmrfz", {
            content: `本回合下次使用牌额外结算${lib.skill.wuweimrfz.getNum(player2, "pojianmrfz")}次`
          });
          target.when({
            player: "useCard",
            global: "phaseEnd"
          }).filter((event3, player3) => {
            if (event3.name !== "useCard") return true;
            return !event3.card?.storage?.pojianmrfz && event3.card !== damageCard;
          }).then(async (event3, trigger3, player3) => {
            player3.unmarkSkill("pojianmrfz");
            if (trigger3.name !== "useCard") return;
            if (numx > 0) trigger3.effectCount += numx;
          }).vars({
            numx: lib.skill.wuweimrfz.getNum(player2, "pojianmrfz"),
            damageCard
          });
        });
      });
      player.recast(cards);
      await player.chooseUseTarget(
        {
          name: "taoyuan",
          isCard: true,
          storage: {
            pojianmrfz: true,
            pojianmrfz_id: randomId
          }
        },
        cards,
        targets
      ).set("forced", true);
    },
    ai: {
      threaten: 0.5,
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1.5];
          }
          if (target.hasFriend() && get.tag(card, "damage")) {
            return [1, 0, 0, -0.7];
          }
        }
      }
    }
  }
});
translate({
  "ruoyemumrfz": "若叶睦",
  "lingwomrfz": "另我",
  "lingwomrfz_info": '锁定技，当你进入濒死状态后，你${get.poptip("sjzx_byRecast")}将一张牌赠予一名其他角色，并将体力至调整至X（X至少为1），然后你选择失去一个技能直到本轮结束。',
  "pojianmrfz": "破茧",
  "pojianmrfz_info": '每回合限三次，当你受到伤害后，你可以将一张牌${get.poptip("sjzx_byRecast")}当目标数至多为X（至少为1）的【桃园结义】使用，然后因此回复体力值的角色摸X张牌，反之其本回合使用的下一张牌额外结算X次。'
});
characterTitle("ruoyemumrfz", "<font color = #db7093>毋畏死亡</font>");
characterIntro("ruoyemumrfz", "Ave Mujica的吉他手若叶睦。沉默寡言的她在罗德岛上大多时候负责一些简单的工作。除此以外，她还在疗养庭院承包了一小块区域，用作果蔬的栽培。");
