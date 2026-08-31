import { get, game, _status, ui, lib } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("dekesasimrfz", {
  sex: "female",
  group: "qimrfz",
  hp: 4,
  skills: ["sudimrfz", "jianyumrfz"]
});
skill({
  "jianyumrfz": {
    audio: 2,
    usable: 1,
    enable: "phaseUse",
    async content(event, trigger, player) {
      let result;
      const cards = get.cards(4);
      game.cardsGotoOrdering(cards);
      player.showCards(cards, "剑雨");
      var suit = [];
      for (var i = 0; i < cards.length; i++) {
        var suitcard = get.suit(cards[i]);
        if (suit.includes(suitcard)) continue;
        suit.add(suitcard);
      }
      var num = suit.length;
      if (player.countCards("he") >= suit.length)
        result = await player.chooseCard("he", true, "【剑雨】:将至少" + num + "张牌当作【万箭齐发】对你选择牌的等量名其他角色使用", [num, Infinity]).set("ai", function(card) {
          return get.value(card) <= 6;
        }).forResult();
      else return;
      if (result?.cards) {
        player.addTempSkill("jianyumrfz_dam", "jianyumrfzAfter");
        player.chooseUseTarget({ name: "wanjian" }, result.cards, true, false).set("selectTarget", function(card, player2, target) {
          var num2 = result.cards?.length || 1;
          return [1, num2];
        }).viewAs = true;
      }
    },
    subSkill: {
      dam: {
        silent: true,
        charlotte: true,
        trigger: { source: "damageEnd" },
        filter: function(event, player) {
          return event.player.isAlive() && event.cards && event.card.name == "wanjian" && !event.player.hasSkill("jianyumrfz_debuff");
        },
        async content(event, trigger, player) {
          trigger.player.addTempSkill("jianyumrfz_debuff", { player: "phaseEnd" });
        }
      },
      debuff: {
        mark: true,
        intro: {
          content: "使用【杀】的次数-1"
        },
        charlotte: true,
        mod: {
          cardUsable: function(card, player, num) {
            if (card.name == "sha") return num - 1;
          }
        }
      }
    },
    ai: {
      order: 2.95,
      result: {
        player: 1
      }
    }
  },
  "sudimrfz": {
    audio: 2,
    trigger: { global: "roundStart" },
    frequent: true,
    async content(event, trigger, player) {
      let result;
      while (event.count > 0 && player.hasSkill(event.name) && !get.is.blocked(event.name, player)) {
        event.count--;
        event.cards = game.cardsGotoOrdering(get.cards(2)).cards;
        if (_status.connectMode) {
          game.broadcastAll(function() {
            _status.noclearcountdown = true;
          });
        }
        event.given_map = {};
        while (event.cards && event.cards.length > 0) {
          if (event.cards.length > 1) {
            result = await player.chooseCardButton("【速递】:请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", (button) => {
              if (ui.selected.buttons.length === 0) return 1;
              return 0;
            }).forResult();
          } else if (event.cards.length === 1) {
            result = { links: event.cards.slice(0), bool: true };
          } else {
            break;
          }
          if (result.links) {
            event.cards = event.cards.filter((c) => !result.links.includes(c));
            event.togive = result.links.slice(0);
            result = await player.chooseTarget("选择一名角色获得" + get.translation(result.links), true).set("ai", (target) => {
              const aiPlayer = _status.event.player;
              const att = get.attitude(aiPlayer, target);
              if (_status.event.enemy) {
                return -att;
              } else if (att > 0) {
                return att / (1 + target.countCards("h"));
              } else {
                return att / 100;
              }
            }).set("enemy", get.value(event.togive[0], player, "raw") < 0).forResult();
            if (result.targets && result.targets.length) {
              const id = result.targets[0].playerid;
              const map = event.given_map;
              if (!id || !map) return;
              if (!map[id]) map[id] = [];
              map[id].addArray(event.togive);
            }
          } else {
            break;
          }
        }
        if (_status.connectMode) {
          game.broadcastAll(function() {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        const list = [];
        for (const i in event.given_map) {
          const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
          player.line(source, "green");
          list.push([source, event.given_map[i]]);
        }
        await game.loseAsync({
          gain_list: list,
          giver: player,
          animate: "draw"
        }).setContent("gaincardMultiple");
        if (!player.hasSkill(event.name) || get.is.blocked(event.name, player)) {
          break;
        }
        result = await player.chooseBool(get.prompt2(event.name)).set("frequentSkill", event.name).forResult();
        if (!result.bool) {
          break;
        }
      }
    },
    ai: {
      expose: 0.1,
      threaten: 1.1
    }
  }
});
translate({
  "dekesasimrfz": "德克萨斯",
  "jianyumrfz": "剑雨",
  "jianyumrfz_info": "出牌阶段限一次，你可以展示牌堆顶四张牌，然后你将至少X张牌当作【万箭齐发】对至多等同于你选择牌的数量名其他角色使用，因此受到伤害的角色下个出牌阶段使用【杀】的次数-1（不可叠加）。（X=因此展示牌的花色数）",
  "sudimrfz": "速递",
  "sudimrfz_info": "每轮开始时，你可以摸两张牌并将这两张牌分配给任意角色。"
});
characterIntro("dekesasimrfz", "德克萨斯，企鹅物流员工，单兵作战能力出类拔萃。</br>于合约期内任企鹅物流驻罗德岛联络人员，同时为罗德岛的多项行动提供协助。");
//# sourceMappingURL=index.js.map
