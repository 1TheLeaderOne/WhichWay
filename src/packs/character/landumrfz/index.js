import { get, game, lib } from "noname";
import { character, skill, translate, characterTitle } from "../../hooks.js";
character("landumrfz", {
  sex: "female",
  hp: 3,
  group: "yimrfz",
  skills: ["landu_shixinmrfz", "picaimrfz"]
});
skill({
  "landu_shixinmrfz": {
    audio: 2,
    trigger: {
      player: "useCardToPlayered"
    },
    init() {
      lib.translate["landu_shixinmrfz_tag"] = "毒";
    },
    filter(event, player) {
      if (!event.targets || event.targets.length > 1) return false;
      let target = event.targets[0];
      return target !== player && target.countCards("h", (card) => !card.storage.landu_shixinmrfz) > 0;
    },
    async cost(event, trigger, player) {
      let target = trigger.targets[0];
      event.result = await player.choosePlayerCard(target, "h").set("prompt", get.prompt("landu_shixinmrfz")).set("filterButton", (button) => {
        return !button.link.storage.landu_shixinmrfz;
      }).set("complexSelect", true).forResult();
    },
    async content(event, trigger, player) {
      let target = trigger.targets[0];
      let cards = event.cards;
      player.showCards(cards, `${get.translation(player)}因【蚀心】展示了${get.translation(target)}的${get.cnNumber(cards.length)}张牌`);
      game.delay(1);
      cards.forEach((card) => {
        card.addGaintag("landu_shixinmrfz_tag");
        card.storage.landu_shixinmrfz = true;
      });
    },
    group: ["landu_shixinmrfz_lose"],
    subSkill: {
      lose: {
        audio: "landu_shixinmrfz",
        charlotte: true,
        forced: true,
        trigger: {
          global: "loseAfter"
        },
        // @ts-ignore
        filter(event, player) {
          return event.cards.some((card) => card.storage.landu_shixinmrfz);
        },
        // @ts-ignore
        async content(event, trigger, player) {
          let cardsx = trigger.cards.filter((card) => card.storage.landu_shixinmrfz && get.position(card) === "d");
          let target = trigger.player;
          trigger.cards.forEach((card) => {
            if (card.storage.landu_shixinmrfz) delete card.storage.landu_shixinmrfz;
          });
          if (cardsx.length > 0) player.gain(cardsx, "gain2");
          const { cards } = target.countCards("h", (card) => !card.storage.landu_shixinmrfz) < 1 ? { cards: void 0 } : await target.chooseCard("h").set("prompt", `是否将一张手牌标记为“毒”并令${get.translation(player)}模一张牌，否则失去一点体力`).set("filterCard", (card) => !card.storage.landu_shixinmrfz).set("ai", (card) => {
            if (player.hp < 2) return 114514 - get.value(card);
            return 8 - get.value(card);
          }).forResult();
          if (cards) {
            cards.forEach((card) => {
              card.addGaintag("landu_shixinmrfz_tag");
              card.storage.landu_shixinmrfz = true;
            });
            player.draw();
          } else target.loseHp();
        }
      }
    }
  },
  "picaimrfz": {
    audio: 2,
    usable: 1,
    trigger: {
      player: "damageBegin3"
    },
    filter(event, player) {
      return player.countCards("h") > 0 && event.num > 0;
    },
    async cost(event, trigger, player) {
      let str = trigger.card ? `若你展示的牌的花色是${get.translation(get.suit(trigger.card))}，则此伤害-1` : "<font color='red'>此伤害为无来源伤害！</font>";
      event.result = await player.chooseCard().set("prompt", get.prompt("picaimrfz")).set("prompt2", str).set("ai", (card) => {
        let cardx = get.event().cardx;
        if (!cardx) return -114514;
        if (get.suit(cardx) !== get.suit(card)) return -114514;
        return Math.random();
      }).set("cardx", trigger.card).forResult();
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let source = trigger.source;
      trigger.num--;
      if (source && source.isIn() && source.countCards("h", (card) => !card.storage.landu_shixinmrfz) > 0) {
        const { cards } = await player.choosePlayerCard(source, "h").set("prompt", get.prompt("landu_shixinmrfz")).set("filterButton", (button) => {
          return !button.link.storage.landu_shixinmrfz;
        }).set("complexSelect", true).forResult();
        if (cards) {
          cards.forEach((card) => {
            card.addGaintag("landu_shixinmrfz_tag");
            card.storage.landu_shixinmrfz = true;
          });
        }
      }
    },
    ai: {
      threaten: 0.8
    }
  }
});
translate({
  "landumrfz": "蓝毒",
  "landu_shixinmrfz": "蚀心",
  "landu_shixinmrfz_info": "当你使用单一目标的牌指定其他角色为目标后，你可以展示目标角色的一张手牌，并将此牌标记为“毒”，且当其失去“毒”后，你获得之，然后其选择一项：<br>1.将一张手牌标记为“毒”并令你摸一张牌;<br>2.失去一点体力。",
  "picaimrfz": "披彩",
  "picaimrfz_info": "每回合限一次，当你受到伤害时，你可以展示一张与伤害牌花色相同的牌并令此伤害-1，然后你展示伤害来源一张手牌并标记为“毒”。"
});
characterTitle("landumrfz", "<font color = #a52a2a>美丽毒物</font>");
//# sourceMappingURL=index.js.map
