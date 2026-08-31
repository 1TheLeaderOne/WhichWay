import { get, _status, game, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("weishidaiermrfz", {
  sex: "female",
  group: "bamrfz",
  hp: 3,
  skills: ["yuximrfz", "haolimrfz", "shezumrfz"]
});
skill({
  "yuximrfz": {
    mod: {
      globalTo(from, to, distance) {
        var cards = to.getCards("s", function(card) {
          return card.hasGaintag("yuximrfzx");
        });
        if (cards.length) return distance + 2;
      }
    },
    marktext: "死魂灵",
    intro: {
      mark: function(dialog, storage, player) {
        var cards = player.getCards("s", function(card) {
          return card.hasGaintag("yuximrfzx");
        });
        if (cards && cards.length > 0) dialog.addAuto("其他角色计算与你的距离+2");
        else return `没有‘死魂灵’`;
        if (game.me == player) dialog.addAuto(cards);
        else dialog.addAuto(`共有${cards.length}张牌`);
      }
    },
    onremove: function(player, skill2) {
      var cards = player.getCards("s", function(card) {
        return card.hasGaintag("yuximrfzx");
      });
      if (cards.length) {
        game.cardsGotoSpecial(cards);
        player.$throw(cards, 1e3);
        game.log(cards, "被销毁");
      }
    },
    audio: 2,
    forced: true,
    trigger: { global: "roundStart" },
    async content(event, trigger, player) {
      lib.skill.yuximrfz.onremove(player, "yuximrfz");
      var cards = [], nature = ["fire", "thunder"];
      for (var i = 0; i < player.maxHp; i++) {
        var name = lib.inpile.filter((name2) => {
          return get.type(name2) == "trick" || get.type(name2) == "basic";
        }).randomGet();
        cards.push(
          game.createCard(
            name,
            lib.suit.randomGet(),
            Math.floor(Math.random() * 13) + 1,
            name == "sha" ? nature.randomGet() : void 0
          )
        );
      }
      cards.map((card) => {
        card.storage.yuximrfzx = true;
      });
      game.log(player, "将", cards.length, "张牌置于在武将牌上");
      player.loseToSpecial(cards, "yuximrfzx");
      player.markSkill("yuximrfz");
    },
    group: ["yuximrfz_destroy"],
    subSkill: {
      destroy: {
        trigger: {
          player: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
        },
        direct: true,
        charlotte: true,
        filter: function(event, player) {
          var evt = event.getl(player);
          if (!evt || !evt.cards) return false;
          for (var i of evt.cards) {
            if (i.storage.yuximrfzx == true) return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          var cards = [];
          var evt = trigger.getl(player);
          if (evt && evt.cards) {
            for (let i of evt.cards) {
              if (i.storage.yuximrfzx == true) cards.push(i);
            }
          }
          game.cardsGotoSpecial(cards);
          game.log(cards, "被销毁了");
          if (Math.random() > 0.5) player.logSkill("yuximrfz");
        }
      }
    }
  },
  "haolimrfz": {
    audio: 2,
    trigger: { player: "useCardAfter" },
    compare(card1, card2) {
      if (get.suit(card1) == get.suit(card2)) return true;
      if (get.number(card1) == get.number(card2)) return true;
      if (get.name(card1) == get.name(card2)) return true;
      return false;
    },
    direct: true,
    filter(event, player) {
      var cards = player.getCards("s", function(card) {
        return card.hasGaintag("yuximrfzx");
      });
      if (cards.length < 1) return false;
      if (!player.isPhaseUsing()) return false;
      if (event.card.storage.yuximrfzx == true) return false;
      if (get.type(event.card) == "equip" || get.type(event.card) == "delay") return false;
      for (var i of cards) {
        if (lib.skill.haolimrfz.compare(i, event.card)) return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      const { cards } = await player.chooseCard("s").set("filterCard", (card) => lib.skill.haolimrfz.compare(card, trigger.card)).set("prompt", `【好礼】:你可以弃置一张‘死魂灵’，视为使用一张${get.translation(get.name(trigger.card))}`).set("ai", (card) => get.value(trigger.card) - get.value(card)).forResult();
      if (!cards) return;
      player.discard(cards);
      player.chooseUseTarget({ name: get.name(trigger.card), isCard: true }, true, false);
    }
  },
  "shezumrfz": {
    audio: 2,
    trigger: { source: "damageEnd" },
    filter(event, player) {
      var cards = player.getCards("s", function(card) {
        return card.hasGaintag("yuximrfzx");
      });
      return (
        //@ts-ignore
        event.getParent().name != "shezumrfz" && event.player.isIn() && cards && cards.length > 0 && game.hasPlayer((current) => {
          return current != player && current != event.player && get.distance(event.player, current) <= 3;
        })
      );
    },
    direct: true,
    async content(event, trigger, player) {
      const {
        cards,
        targets
      } = await player.chooseCardTarget({
        prompt: `【射祖】:你可以弃置一张‘死魂灵’并对一名距离${get.translation(trigger.player)}不大于3的角色（不能是你或${get.translation(trigger.player)}）造成一点火焰伤害`,
        filterCard(card) {
          return card.hasGaintag("yuximrfzx");
        },
        position: "s",
        filterTarget(card, player2, target) {
          var damaged = _status.event.targetx;
          return target != player2 && target != damaged && get.distance(damaged, target) <= 3;
        },
        ai1: (card) => 8 - get.value(card),
        ai2: (target) => get.damageEffect(target, player, player, "fire") > 0
      }).set("targetx", trigger.player).forResult();
      if (cards && targets) {
        player.logSkill("shezumrfz", targets[0]);
        player.discard({ cards });
        targets[0].damage({ source: player, nature: "fire" });
      }
    }
  }
});
translate({
  "weishidaiermrfz": "维什戴尔",
  "yuximrfz": "余息",
  "yuximrfz_info": "锁定技。<br>①每轮开始时，你销毁所有的‘死魂灵’，然后你从游戏外获得等同于你体力上限张点数、花色和牌名（仅普通锦囊和基本牌）随机的牌，并将其置于你的武将牌上，称之为‘死魂灵’，你可以如手牌般使用或打出‘死魂灵’。<br>②‘死魂灵’离开你的区域后销毁之。<br>③当你有‘死魂灵’时，其他角色计算与你的距离+2。",
  "haolimrfz": "好礼",
  "haolimrfz_info": "出牌阶段，当你使用一张普通锦囊或基本牌后，若此牌点数、花色或牌名与‘死魂灵’相同且不是‘死魂灵’，你可以弃置一张对应的‘死魂灵’并视为使用一张与此牌牌名相同的牌（不计入次数限制）。",
  "shezumrfz": "射祖",
  "shezumrfz_info": "当你不因此技能造成伤害后，你可以弃置一张‘死魂灵’，然后选择一名与受伤角色距离不大于3的角色（不能是你或受伤角色），对其造成一点火焰伤害。"
});
characterTitle("weishidaiermrfz", "<font color=#00868B>卡兹戴尔的黎明</font>");
characterIntro("weishidaiermrfz", '<span style="text-decoration:line-through">丁真戴尔</span>维什戴尔，萨卡兹雇佣兵领袖W，现正式更名为维什戴尔。于伦蒂尼姆战争期间，与罗德岛伦蒂尼姆特别行动队紧密合作，数度阻遏军事委员会的行动。<br>【权限记录】<br>我们紧急更新了与维什戴尔的战略合作条款，具体条目您可以考虑是否亲自一一核对。您一定已经很清楚，我们未来与她的合作只会越来越紧密。这绝不仅仅关乎她自己。');
//# sourceMappingURL=index.js.map
