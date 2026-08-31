import { game, get, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("xingzhumrfz", {
  sex: "female",
  group: "yanmrfz",
  hp: 3,
  skills: ["xingzhumrfz", "zhizhumrfz"]
});
skill({
  "xingzhumrfz": {
    marktext: "帙",
    intro: {
      name: "帙",
      content: "expansion",
      markcount: "expansion"
    },
    onremove: function(player, skill2) {
      var cards = player.getExpansions(skill2);
      if (cards.length) player.loseToDiscardpile(cards);
    },
    audio: 2,
    forced: true,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter"]
    },
    filter: function(event, player) {
      if (event.type != "discard") return false;
      for (let current of game.players) {
        if (current === player) continue;
        let evt = event.getl(current);
        if (!evt || !evt.cards2) continue;
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      let cards = [];
      var players = game.filterPlayer();
      for (var current of players) {
        if (current === player) continue;
        var evt = trigger.getl(current);
        if (!evt || !evt.cards2) continue;
        var cardsx = evt.cards2.filterInD("d");
        cards.addArray(cardsx);
      }
      if (cards.length) {
        player.addToExpansion(cards, player, "giveAuto").gaintag.add("xingzhumrfz");
      }
    },
    group: ["xingzhumrfz_start", "xingzhumrfz_check", "xingzhumrfz_init"],
    subSkill: {
      check: {
        audio: false,
        charlotte: true,
        silent: true,
        trigger: {
          player: "addToExpansionEnd"
        },
        filter: function(event, player) {
          return event.gaintag.includes("xingzhumrfz");
        },
        lastDo: true,
        async content(event, trigger, player) {
          let cards = player.getExpansions("xingzhumrfz");
          if (cards.length >= 9) {
            const { links } = await player.chooseCardButton(`【行著】:请弃置${Math.max(1, cards.length - 9)}张‘帙’`, true, cards).set("selectButton", () => {
              let cards2 = get.player().getExpansions("xingzhumrfz");
              return Math.max(1, cards2.length - 9);
            }).set("ai", (button) => {
              return -get.value(button.link);
            }).forResult();
            if (!links) return;
            player.loseToDiscardpile(links);
          }
        }
      },
      start: {
        audio: "xingzhumrfz",
        forced: true,
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
          player.addToExpansion(get.cards(3), "draw").gaintag.add("xingzhumrfz");
        }
      },
      init: {
        audio: "xingzhumrfz",
        trigger: {
          player: ["loseEnd", "dying", "phaseBefore", "phaseAfter", "dyingAfter", "die"],
          global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
        },
        filter: function(event, player) {
          return player.getExpansions("xingzhumrfz").length > 0 ^ player.hasSkill("xingzhumrfz_in");
        },
        forced: true,
        firstDo: true,
        silent: true,
        forceDie: true,
        async content(event, trigger, player) {
          if (player.getExpansions("xingzhumrfz").length) {
            var cards = player.getExpansions("xingzhumrfz");
            var cardsx = cards.map((card) => {
              var cardx = ui.create.card();
              cardx.init(get.cardInfo(card));
              cardx._cardid = card.cardid;
              return cardx;
            });
            player.directgains(cardsx, null, "xingzhumrfz_tag");
            player.addSkill("xingzhumrfz_in");
          } else player.removeSkill("xingzhumrfz_in");
        }
      },
      in: {
        charlotte: true,
        audio: false,
        trigger: {
          player: "addToExpansionEnd"
        },
        filter: function(event, player) {
          return event.gaintag.includes("xingzhumrfz");
        },
        forced: true,
        locked: false,
        silent: true,
        async content(event, trigger, player) {
          var cards2 = player.getCards("s", (card) => card.hasGaintag("xingzhumrfz_tag"));
          if (player.isOnline2()) {
            player.send(
              function(cards3, player2) {
                cards3.forEach((i) => i.delete());
                if (player2 == game.me) ui.updatehl();
              },
              cards2,
              player
            );
          }
          cards2.forEach((i) => i.delete());
          var cards = player.getExpansions("xingzhumrfz");
          var cardsx = cards.map((card) => {
            var cardx = ui.create.card();
            cardx.init(get.cardInfo(card));
            cardx._cardid = card.cardid;
            return cardx;
          });
          player.directgains(cardsx, null, "xingzhumrfz_tag");
        },
        onremove: function(player) {
          var cards2 = player.getCards("s", (card) => card.hasGaintag("xingzhumrfz_tag"));
          if (player.isOnline2()) {
            player.send(
              function(cards, player2) {
                cards.forEach((i) => i.delete());
                if (player2 == game.me) ui.updatehl();
              },
              cards2,
              player
            );
          }
          cards2.forEach((i) => i.delete());
          if (player == game.me) ui.updatehl();
        },
        group: ["xingzhumrfz_use", "xingzhumrfz_sync"]
      },
      use: {
        charlotte: true,
        trigger: {
          player: ["useCardBefore", "respondBefore"]
        },
        filter: function(event, player) {
          var cards = player.getCards("s", (card) => card.hasGaintag("xingzhumrfz_tag") && card._cardid);
          return event.cards && event.cards.some((card) => {
            return cards.includes(card);
          });
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.getCards("s", (card2) => card2.hasGaintag("xingzhumrfz_tag")).map((i) => i._cardid);
          var cards = player.getExpansions("xingzhumrfz");
          var cards2 = [];
          for (var card of trigger.cards) {
            var cardx = cards.find((cardx2) => cardx2.cardid == card._cardid);
            if (cardx) cards2.push(cardx);
          }
          var cards3 = trigger.cards.slice();
          trigger.cards = cards2;
          trigger.card.cards = cards2;
          if (player.isOnline2()) {
            player.send(
              function(cards4, player2) {
                cards4.forEach((i) => i.delete());
                if (player2 == game.me) ui.updatehl();
              },
              cards3,
              player
            );
          }
          cards3.forEach((i) => i.delete());
          if (player == game.me) ui.updatehl();
        }
      },
      sync: {
        charlotte: true,
        silent: true,
        audio: false,
        trigger: {
          player: ["loseToDiscardpileEnd"]
        },
        filter(event, player) {
          let cardsx = player.getCards("s", (card) => card.hasGaintag("xingzhumrfz_tag"));
          let cards = player.getExpansions("xingzhumrfz");
          return cardsx.length !== cards.length;
        },
        async content(event, trigger, player) {
          let cardsx = player.getCards("s", (card) => card.hasGaintag("xingzhumrfz_tag"));
          let cards = player.getExpansions("xingzhumrfz");
          cardsx.forEach((i) => {
            if (!cards.map((i2) => i2.cardid).includes(i._cardid)) i.delete();
          });
          ui.updatehl();
        }
      }
    }
  },
  "zhizhumrfz": {
    audio: 2,
    trigger: { player: "useCardAfter" },
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    mark: true,
    intro: {
      content(event, player) {
        let storage = player.storage.zhizhumrfz;
        return `·本轮已使用的花色：${get.translation(storage)}`;
      }
    },
    firstDo: true,
    filter(event, player) {
      if (!player.storage.zhizhumrfz_check || player.storage.zhizhumrfz.includes(get.suit(event.card)) || get.position(event.card) !== "d")
        return false;
      for (let current of game.players) {
        if (current === player) continue;
        for (let key in player.storage.zhizhumrfz_check) {
          if (event.card.cardid !== key) continue;
          let arrs = player.storage.zhizhumrfz_check[key];
          for (let arr of arrs) {
            if (arr[0] === current && arr[1] != current.countCards("h")) return true;
          }
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      player.storage.zhizhumrfz.push(get.suit(trigger.card));
      player.addToExpansion(trigger.cards, player, "giveAuto").gaintag.add("xingzhumrfz");
    },
    group: ["zhizhumrfz_check", "zhizhumrfz_remove"],
    subSkill: {
      remove: {
        audio: false,
        charlotte: true,
        silent: true,
        trigger: {
          global: "roundStart",
          player: "useCardAfter"
        },
        lastDo: true,
        async content(event, trigger, player) {
          if (trigger.name === "useCard") {
            if (player.storage.zhizhumrfz_check.hasOwnProperty(trigger.card.cardid)) {
              delete player.storage.zhizhumrfz_check[trigger.card.cardid];
            }
          } else {
            player.storage.zhizhumrfz = [];
          }
        }
      },
      check: {
        audio: false,
        charlotte: true,
        silent: true,
        trigger: {
          player: "useCard"
        },
        async content(event, trigger, player) {
          if (!player.storage.zhizhumrfz_check) player.storage.zhizhumrfz_check = {};
          for (let current of game.players) {
            if (current === player) continue;
            if (!player.storage.zhizhumrfz_check[trigger.card.cardid]) player.storage.zhizhumrfz_check[trigger.card.cardid] = [];
            player.storage.zhizhumrfz_check[trigger.card.cardid].push([current, current.countCards("h")]);
          }
        }
      }
    }
  }
});
translate({
  "xingzhumrfz": "行著",
  "xingzhumrfz_info": "锁定技，当其他角色有牌因弃置进入弃牌堆后/游戏开始时，你[将此牌/将牌堆顶三张牌]置于你的武将牌上，称之为“帙”，若“帙”的数量不小于9，你将“帙”的数量调整至9；你可以如手牌般使用“帙”。",
  "zhizhumrfz": "止著",
  "zhizhumrfz_info": "每种花色每轮限一次，当你使用的牌结算完毕后，若在此牌结算过程中其他角色手牌数发生变化，你可以将此牌当作“帙”置于你的武将牌上。"
});
characterTitle("xingzhumrfz", "<font color='#b8860b'>行止于坊</font>");
characterIntro("xingzhumrfz", "行箸，就任于炎国太史阁的历史研究者，畅销美食类散记《百灶食珍录》作者。经干员煌介绍，以访客身份来到罗德岛。");
//# sourceMappingURL=index.js.map
