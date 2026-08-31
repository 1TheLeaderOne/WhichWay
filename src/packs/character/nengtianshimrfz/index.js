import { game, get, _status, lib } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("nengtianshimrfz", {
  sex: "female",
  group: "qimrfz",
  hp: 3,
  hujia: 1,
  skills: ["lianshemrfz", "guozaimrfz"]
});
skill({
  "lianshemrfz": {
    mod: {
      cardUsable: function(card, player, num) {
        if (card.name == "sha") return player.maxHp;
      }
    },
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    firstDo: true,
    filter: function(event, player) {
      return !event.audioed && event.card.name == "sha" && event.parent && event.parent.type == "phase";
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
    }
  },
  "guozaimrfz": {
    audio: 4,
    enable: "phaseUse",
    usable: 1,
    filter: function(event, player) {
      return player.getCardUsable("sha") > 0;
    },
    filterTarget: function(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      const cards = game.cardsGotoOrdering(get.cards(player.maxHp + 1)).cards;
      event.cards = cards;
      event.cards2 = [];
      event.cards3 = [];
      event.num = 0;
      if (!player.canUse("sha", target, false)) {
        return;
      }
      for (const card of event.cards) {
        if (card.name === "sha") {
          event.cards2.push(card);
          event.num++;
        } else {
          event.cards3.push(card);
        }
      }
      game.cardsGotoOrdering(event.cards);
      player.showCards(event.cards, get.translation(player) + "发动了【过载】");
      if (event.cards2.length > 0 && target.isAlive()) {
        while (event.num > 0 && target.isAlive() && player.getCardUsable("sha") > 0) {
          const card = event.cards2[event.num - 1];
          player.showCards(card, get.translation(player) + "发动了【过载】");
          event.num--;
          player.logSkill("guozaimrfz", target);
          if (target.isAlive()) {
            await player.chooseUseTarget(card, true, "nodistance").set("filterTarget", (card2, player2, target2) => {
              let evt = _status.event;
              if (_status.event.name === "chooseTarget") evt = evt.getParent();
              if (target2 !== player2 && target2 !== evt.guozaimrfz_target) return false;
              return lib.filter.targetEnabledx(card2, player2, target2);
            }).set("guozaimrfz_target", target);
          }
        }
      }
      if (event.cards3.length > 0) {
        result = await player.chooseButton(["过载：你可以获得一张牌", event.cards3]).set("ai", (button) => {
          return get.value(button.link, _status.event.player);
        }).forResult();
      }
      if (result?.links?.length) {
        await player.gain(result.links, "gain2");
      }
    },
    ai: {
      order: 10,
      threaten: 1.1,
      expose: 0.6,
      result: {
        target: -1
      }
    }
  }
});
translate({
  "nengtianshimrfz": "能天使",
  "lianshemrfz": "连射",
  "lianshemrfz_info": "锁定技，你使用【杀】的次数改为X。（X=你的体力上限）",
  "guozaimrfz": "过载",
  "guozaimrfz_info": "出牌阶段限一次，你可以展示牌堆顶X+1张牌，然后选择一名其他角色，对其使用其中的【杀】，你可以获得其中一张不是【杀】的牌，然后你弃置剩余的牌。（X=你的体力上限）"
});
characterIntro("nengtianshimrfz", "能天使，拉特兰公民，适用拉特兰一至十三项公民权益。企鹅物流公司成员。从事秘密联络，武装押运等非公开活动，推测身份：信使。于合约期内任企鹅物流驻罗德岛联络人员，同时为罗德岛多项行动提供协助。");
//# sourceMappingURL=index.js.map
