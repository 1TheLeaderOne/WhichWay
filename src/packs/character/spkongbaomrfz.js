import { character, characterTitle, characterIntro, translate, skill } from "../hooks.js";
import { game, lib, get } from "noname";
character("spkongbaomrfz", {
  group: "othermrfz",
  sex: "female",
  skills: ["xuzhanmrfz", "chaojiemrfz"],
  hp: 4,
  pack: "epicSJZX"
});
characterTitle("spkongbaomrfz", "<font color = blue>兴之所至</font>");
characterIntro("spkongbaomrfz", "空爆，行动预备组A6成员，在本人意愿下变更为近卫干员，并展现出极强的近身搏斗和使用重型近战武器的天赋。在A6小队的日常任务之外，她也常以个人名义参与各种需要前往险地的外勤任务。<br>大家都说那个过去总是喜欢偷懒耍滑头的空爆完全变了，对于这种评价，她不置可否。");
translate({
  spkongbaomrfz: "雷狼龙S空爆",
  spkongbaomrfz_prefix: "雷狼龙S",
  xuzhanmrfz: "蓄斩",
  xuzhanmrfz_info: "每回合限五次，当你不因【蓄斩】而使用伤害类牌指定目标后，你可以令此牌减少任意个目标并摸等量张牌，然后若此牌目标数少于1，你摸一张牌并将一张牌当作此牌使用（无次数限制）。",
  chaojiemrfz: "超解",
  chaojiemrfz_info: "每当你使用的3的倍数张【杀】结算完毕后，你可以令你下一张使用的伤害类牌指定的所有角色进行5次【闪电】判定。"
});
skill({
  xuzhanmrfz: {
    audio: ["作战中1", "作战中2"],
    trigger: {
      player: "useCardToPlayered"
    },
    usable: 5,
    filter(event, player, name, target) {
      if (event.getParent(2)?.xuzhanmrfz_notrigger === true || event.getParent()?.triggeredTargets3.length > 1) {
        return false;
      }
      return get.tag(event.card, "damage") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("xuzhanmrfz"),
        prompt2: `你可以令此牌减少任意个目标并摸等量张牌，然后若此牌目标数少于1，你摸一张牌并将一张牌当作此牌使用`,
        filterTarget(card, player2, target) {
          const trigger2 = get.event().getTrigger();
          return trigger2.targets.includes(target);
        },
        selectTarget: [0, Infinity],
        ai(target) {
          return 1;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const { targets } = event;
      if (targets?.length > 0) {
        await player.draw({ num: targets.length });
        trigger.targets.removeArray(targets);
      }
      if (trigger.targets.length < 1) {
        await player.draw();
        if (!player.hasUseTarget(trigger.card, void 0, false) || player.countCards("he") < 1) {
          return;
        }
        const result = await player.chooseCardTarget({
          forced: true,
          position: "he",
          prompt: `【蓄斩】:请将一张牌当作【${get.translation(get.name(trigger.card))}】使用`,
          filterCard: true,
          filterTarget(card, player2, target) {
            return player2.canUse(get.event().cardname, target, void 0, false);
          },
          ai2(target) {
            const { player: player2, cardname } = get.event();
            return get.effect(target, cardname, player2, player2);
          }
        }).set("cardname", get.name(trigger.card)).forResult();
        if (result.targets && result.cards) {
          player.when({ player: "useCardAfter" }).filter((event2, player2) => {
            return event2.card === trigger.card;
          }).step(async (event2, trigger2, player2) => {
            await player2.chooseUseTarget({
              addCount: false,
              forced: true,
              card: get.autoViewAs({ name: get.name(trigger2.card) }),
              cards: result.cards,
              filterTarget(card, player3, target) {
                return get.event().targets.includes(target);
              }
            }).set("targets", result.targets).set("xuzhanmrfz_notrigger", true);
          });
        }
      }
    }
  },
  chaojiemrfz: {
    audio: ["作战中4", "作战中3"],
    trigger: {
      player: "useCardEnd"
    },
    filter(event, player, name, target) {
      return getShaCount(player) % 3 === 0 && get.name(event.card) === "sha";
    },
    intro: {
      content(storage, player, skill2) {
        if (player.countMark("chaojiemrfz") < 1) {
          return `·无效果`;
        }
        return `·下一张使用的伤害类牌指定的所有角色进行${storage * 5}次【闪电】判定`;
      }
    },
    onremove: true,
    check: () => true,
    async content(event, trigger, player) {
      player.addMark("chaojiemrfz", 1, false);
    },
    group: "chaojiemrfz_effect",
    subSkill: {
      effect: {
        audio: "chaojiemrfz",
        charlotte: true,
        forced: true,
        lastDo: true,
        trigger: { player: "useCard2" },
        filter(event, player, name, target) {
          console.log(event);
          return player.countMark("chaojiemrfz") > 0 && event.targets.length > 0;
        },
        async content(event, trigger, player) {
          player.removeMark("chaojiemrfz", 1, false);
          for (let target of trigger.targets) {
            for (let i of [1, 2, 3, 4, 5]) {
              if (!target || !target.isIn()) break;
              game.log(target, "执行第", i, "次", "#y【闪电】", "判定");
              const result = await target.judge({
                judge: lib.card["shandian"].judge,
                judge2: lib.card["shandian"].judge2,
                card: get.autoViewAs({ name: "shandian" })
              }).forResult();
              if (result && result.bool === false) {
                target.damage({
                  num: 3,
                  nature: "thunder"
                }).set("noSource", true);
              }
            }
          }
        }
      }
    }
  }
});
function getShaCount(player) {
  return player.getAllHistory("useCard", (evt) => evt.card && get.name(evt.card) === "sha").length;
}
//# sourceMappingURL=spkongbaomrfz.js.map
