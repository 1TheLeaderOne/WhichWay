import { game, _status, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("songtongmrfz", {
  pack: "epicSJZX",
  sex: "male",
  hp: 3,
  maxHp: 4,
  group: "dongmrfz",
  skills: ["xianchoumrfz"]
});
skill({
  "xianchoumrfz": {
    audio: 2,
    trigger: { player: "useCardAfter" },
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    mark: true,
    intro: {
      content(_, player) {
        let str = [];
        if (player.hasSkill("xianchoumrfz")) {
          str.push(`·已经使用过的类型:${get.translation(player.storage["xianchoumrfz"])}`);
        }
        return str.join("<br>");
      }
    },
    filter(event, player) {
      return event.card && !event.card.xianchoumrfz && !player.storage["xianchoumrfz"].includes(get.type2(event.card));
    },
    async cost(event, trigger, player) {
      let num = game.getRoundHistory("everything", (evt) => evt.name === "xianchoumrfz").length + 1;
      event.result = await player.chooseTarget().set("prompt", `你可以令一名其他角色视为使用${num}张【无中生有】并弃置${num}张牌`).set("ai", (target) => get.attitude2(target) > 0).forResult();
      player.storage["xianchoumrfz"].add(get.type2(trigger.card));
    },
    // @ts-ignore
    async content(event, trigger, player) {
      const [target] = event.targets;
      let num = game.getRoundHistory("everything", (evt) => evt.name === "xianchoumrfz").length;
      for (let i = 0; i < num; i++) {
        await target.useCard({ name: "wuzhong", isCard: true, xianchoumrfz: true }, target);
      }
      await target.chooseToDiscard(num, true, "he").set("ai", (card) => {
        const evt = _status.event;
        return evt.name === "phaseUse" && evt.player === get.player() ? -get.player().getUseValue(card) : -get.value(card);
      });
      const { cards } = await target.chooseCard([0, num]).set("filterCard", (card) => {
        return !card.hasGaintag("xianchoumrfz");
      }).set("ai", (card, player2) => {
        let info = get.info(card);
        if (typeof info.usable === "number") return 114514;
        return get.value(card);
      }).set("prompt", `你可以令至多${num}张手牌本轮使用无次数限制`).forResult();
      if (cards) {
        target.addGaintag(cards, "xianchoumrfz");
        if (!target.storage.xianchoumrfz_igCount) {
          target.storage.xianchoumrfz_igCount = true;
          target.when({ global: "roundStart" }).then(() => {
            delete player.storage.xianchoumrfz_igCount;
            player.removeGaintag("xianchoumrfz");
          }).assign({
            mod: {
              // @ts-ignore
              cardUsable(card, player2, num2) {
                if (card.cards && card.cards.length === 1 && card.cards[0].hasGaintag("xianchoumrfz")) return Infinity;
              },
              // @ts-ignore
              aiOrder(player2, card, num2) {
                if (card.hasGaintag && card.hasGaintag("xianchoumrfz")) return num2 -= 0.1;
              }
            }
          });
        }
      }
    },
    group: ["xianchoumrfz_clear"],
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        trigger: { global: "roundStart" },
        firstDo: true,
        // @ts-ignore
        async content(event, trigger, player) {
          player.storage["xianchoumrfz"] = [];
        }
      }
    }
  }
});
translate({
  "songtongmrfz": "松桐",
  "xianchoumrfz": "先筹",
  "xianchoumrfz_info": "当你不因此技能而于本轮首次使用一种类型的牌后，你可以令一名角色视为使用X张【无中生有】、弃置X张牌并令至多X张手牌本轮使用无次数限制。(X=本技能本轮发动的次数)"
});
characterTitle("songtongmrfz", "<font color = gray>见微知著</font>");
characterIntro("songtongmrfz", "松桐，本名森内彻，酒保、关东煮摊摊主，同时也是锻冶町周边情报交易的核心人物，从事多种职业，广泛涉足各类人际网络，尤其擅长处理东国方面的信息流通事务。由本人主动联系，希望就情报交流及业务扩展等方面与罗德岛建立合作关系，同时根据本人意愿，作为先锋干员为罗德岛提供服务。");
