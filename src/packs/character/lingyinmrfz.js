import { lib, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("lingyinmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "lamrfz",
  hp: 4,
  skills: ["qiansongmrfz", "qiancimrfz"]
});
skill({
  "qiansongmrfz": {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    intro: {
      content: "回合结束时摸三张牌"
    },
    // @ts-ignore
    filter(event, player) {
      return player.countCards("h", (card) => !get.tag(card, "damage") && player.canRecast(card)) > 0;
    },
    prompt2() {
      let cards = get.player().getCards("h", (card) => !get.tag(card, "damage") && get.player().canRecast(card));
      return `重铸${get.translation(cards)}，然后若你所有手牌均带有伤害类标签，你于回合结束时摸两张牌。`;
    },
    // @ts-ignore
    check(event, player) {
      let cards = get.player().getCards("h", (card) => !get.tag(card, "damage") && get.player().canRecast(card));
      let value = cards.reduce((prev, card) => prev + get.value(card), 0);
      return value <= 15;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let cards = player.getCards("h", (card) => !get.tag(card, "damage") && player.canRecast(card));
      await player.recast(cards);
      let a = player.countCards("h", (card) => get.tag(card, "damage"));
      let b = player.countCards("h", (card) => !get.tag(card, "damage"));
      if (a > b) {
        player.markSkill("qiansongmrfz");
        player.when({ player: "phaseEnd" }).step(() => {
          player.draw(3);
          player.logSkill("qiansongmrfz");
          player.unmarkSkill("qiansongmrfz");
        });
      } else {
        let card = get.cardPile2("sha", "random");
        if (card) player.gain(card, "gain2");
      }
    }
  },
  "qiancimrfz": {
    audio: 2,
    enable: "phaseUse",
    init() {
      lib.translate["qiancimrfz_tips"] = "伤害类牌";
    },
    // @ts-ignore
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    // @ts-ignore
    usable(skill2, player) {
      let num = player.storage.qiancimrfz || 0;
      return num + 1;
    },
    intro: {
      // @ts-ignore
      content(event, player) {
        return `【虔赐】出牌阶段使用次数上限：${(player.storage.qiancimrfz || 0) + 1}`;
      }
    },
    filterTarget: lib.filter.notMe,
    filterCard: () => true,
    discard: false,
    lose: false,
    onremove: true,
    check(card) {
      return get.tag(card, "damage") > 0;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let {
        cards: cardsx,
        targets: [target]
      } = event;
      await player.give(cardsx, target);
      const { cards } = target.getCards("h").length <= 3 ? { cards: target.getCards("h") } : await player.choosePlayerCard("h", target, true).set("ai", (card) => get.rand(0, 1)).set("prompt", `请展示${get.translation(target)}的三张手牌`).set("selectButton", 3).forResult();
      if (!cards) return;
      await player.showCards(cards, `${get.translation(player)}展示了${get.translation(target)}${get.cnNumber(cards.length)}张手牌`);
      let damage = cards.filter((card) => get.tag(card, "damage")).length;
      if (damage > 0) {
        player.line(target);
        target.damage(damage, player).set("qiancimrfz", true);
      }
    },
    group: ["qiancimrfz_recover"],
    subSkill: {
      recover: {
        charlotte: true,
        silent: true,
        trigger: { source: ["damageEnd", "dieAfter"] },
        // @ts-ignore
        filter(event, player) {
          return event.qiancimrfz && event.name === "damage" || event.name === "die" && event.getParent(2).qiancimrfz;
        },
        // @ts-ignore
        async content(event, trigger, player) {
          if (trigger.name === "damage") player.recover();
          else {
            if (!player.storage.qiancimrfz) {
              player.storage.qiancimrfz = 0;
              player.markSkill("qiancimrfz");
            }
            player.storage.qiancimrfz++;
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player(player) {
          return player.countCards("h", (card) => get.value(card) < 8) > 0;
        },
        target(player, target) {
          let att = get.attitude(player, target);
          let cards = target.getCards("h");
          let num = -1.5;
          if (att < 0) {
            if (cards.length < 2) num += 1;
            if (target.hp < 3) num -= 1.5;
          }
          return num;
        }
      }
    }
  }
});
translate({
  "lingyinmrfz": "聆音",
  "qiansongmrfz": "虔颂",
  "qiansongmrfz_info": "出牌阶段开始时，你可以重铸手牌中所有的非伤害类的牌，然后若你手牌中伤害类牌占绝对多数，你于回合结束时摸三张牌，反之，你从牌堆中获得一张【杀】。",
  "qiancimrfz": "虔赐",
  "qiancimrfz_info": "出牌阶段限一次，你可以将一张手牌交给一名其他角色，并展示其三张手牌，对其造成X点伤害，然后若你因此:<br>1.造成了伤害，你回复一点体力；<br>2.杀死了一名角色，你令本技能出牌阶段可发动的次数+1。<br>（X=展示的牌中伤害类牌的数量）"
});
characterTitle("lingyinmrfz", "<font color='#6495ed'>至虔修女</font>");
characterIntro("lingyinmrfz", "聆音，来自玻利瓦尔的修女，经干员信仰搅拌机推荐加入罗德岛，目前已经返回家乡玻利瓦尔，于当地办事处担任近卫干员。");
//# sourceMappingURL=lingyinmrfz.js.map
