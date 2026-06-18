import { character, characterTitle, characterIntro, translate, skill } from "../../hooks.js";
import { get } from "noname";
character("spzilanmrfz", {
  sex: "female",
  group: "luomrfz",
  skills: ["dengshemrfz", "longjianmrfz"],
  designer: ["Flandre"],
  hp: 3,
  pack: "legendSJZX"
});
characterTitle("spzilanmrfz", "<font color = #2718c7>幽静射手</font>");
characterIntro("spzilanmrfz", "梓兰，行动预备组A6的队长，罗德岛人事部办公室年度人物，舰内时尚杂志《Orchid》创办人。经由本人的申请，现变更为狙击干员。在保留了战场辅助能力的同时，于进攻性方面也有了长足的进步。不仅如此，在执行各项任务期间，还会时常主动提出一些建设性意见。");
translate({
  spzilanmrfz: "焰狐龙梓兰",
  spzilanmrfz_prefix: "焰狐龙",
  dengshemrfz: "蹬射",
  dengshemrfz_info: "当你使用牌后，若此牌的上一张牌为非伤害牌，你摸两张牌并弃置一张牌。",
  longjianmrfz: "龙箭",
  longjianmrfz_info: `连招技（非伤害牌+伤害牌），你可以展示其中一名目标角色的一张手牌，若与你使用的牌<br>花色相同：此牌不可被响应<br>颜色相同：此牌伤害+1<br><font color = red>乘势</font>:额外结算一次且本回合使用【杀】无次数限制。`
});
skill({
  dengshemrfz: {
    audio: ["部署1", "作战中1"],
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      const evt = getLastUsed(player, event);
      return evt && evt.card && !get.tag(evt.card, "damage");
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw(2);
      if (player.countCards("he") > 1) {
        await player.chooseToDiscard({
          forced: true,
          prompt: "【蹬射】:请弃置一张牌",
          position: "he",
          ai(card) {
            return -get.value(card);
          }
        });
      }
    }
  },
  longjianmrfz: {
    audio: ["任命队长", "作战中3"],
    comboSkill: true,
    trigger: {
      player: "useCard"
    },
    filter(event, player, name, target) {
      const evt = getLastUsed(player, event);
      const { targets, card } = event;
      if (!evt || !evt.card || get.tag(evt.card, "damage") > 0) {
        return false;
      }
      return card && get.tag(card, "damage") && targets.length > 0 && targets.some((char) => char.countCards("h") > 0);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("longjianmrfz"),
        prompt2: `你可以展示其中一名目标角色的一张手牌，若与你使用的牌<br>花色相同：此牌不可被响应<br>类别相同：此牌伤害+1<br><font color = red>乘势</font>:额外结算一次且本回合使用【杀】无次数限制。`,
        filterTarget(card, player2, target) {
          const targets = get.event().targetsx;
          return targets.includes(target) && target.countCards("h") > 0;
        },
        ai(target) {
          if (get.attitude2(target) < 0) return -1;
          return 114514 - Math.min(100, target.hp);
        }
      }).set("targetsx", trigger.targets).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const result = await player.choosePlayerCard({
        target,
        position: "h",
        prompt: `【龙箭】:展示${get.translation(target)}一张手牌`,
        forced: true,
        ai(button) {
          const link = button.link;
          const player2 = get.player();
          if (link.isKnownBy(player2)) {
            let num = 0;
            const card = get.event().cardx;
            if (get.suit(card) === get.suit(link)) {
              num += 1;
            }
            if (get.color(link) === get.color(card)) {
              num += 1;
            }
            return num;
          }
          return Math.random();
        }
      }).set("cardx", trigger.card).forResult();
      const acts = [];
      if (result.links?.length) {
        const link = result.links[0];
        await player.showCards(link, `${get.translation(player)}展示了${get.translation(target)}一张手牌`);
        if (get.suit(link) === get.suit(trigger.card)) {
          acts.push("directHit");
        }
        if (get.color(link) === get.color(trigger.card)) {
          acts.push("extraDamage");
        }
      }
      if (acts.length > 0) {
        if (acts.includes("directHit")) {
          trigger.directHit.add(target);
        }
        if (acts.includes("extraDamage")) {
          player.when({
            player: "phaseEnd",
            source: "damageBegin"
          }).filter((event2, player2) => {
            if (event2.name === "phase") {
              return true;
            }
            return event2.card && event2.card === trigger.card;
          }).step(async (event2, trigger2, player2) => {
            if (trigger2.name === "phase") {
              return;
            }
            trigger2.num++;
          });
        }
        if (acts.length >= 2) {
          if (trigger.effectCount) {
            trigger.effectCount++;
          }
          player.markSkill("longjianmrfz");
          player.addTip("longjianmrfz_tips", "使用【杀】无次数限制", true);
          player.when({ global: "phaseEnd" }).step(async (e, t, p) => {
            p.unmarkSkill("longjianmrfz");
          }).assign({
            mod: {
              cardUsable(card, player2, num) {
                if (get.name(card) === "sha") {
                  return Infinity;
                }
              }
            }
          });
        }
      }
    },
    intro: {
      content: "·本回合使用【杀】无次数限制"
    }
  }
});
function getLastUsed(player, event) {
  let history = player.getAllHistory("useCard");
  let index;
  if (event) {
    index = history.indexOf(event) - 1;
  } else {
    index = history.length - 1;
  }
  if (index >= 0) {
    return history[index];
  }
  return false;
}
//# sourceMappingURL=index.js.map
