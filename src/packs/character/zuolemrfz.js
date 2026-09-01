import { game, get, _status, ui, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("zuolemrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "yanmrfz",
  hp: 4,
  maxHp: 5,
  skills: ["qikumrfz", "bingzhumrfz"]
});
skill({
  "qikumrfz": {
    audio: 2,
    trigger: { player: "gainBegin" },
    filter: function(event, player) {
      return player.countCards("h") == 0 && event.getParent(2).name != "qikumrfz";
    },
    forced: true,
    async content(event, trigger, player) {
      var num = player.maxHp - trigger.cards.length;
      player.draw(num);
    }
  },
  "bingzhumrfz": {
    marktext: "司",
    intro: {
      name: "司",
      markcount: "expansion",
      content: "expansion"
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter: function(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      var suit = [];
      for (var i of player.getCards("h")) {
        if (suit.includes(get.suit(i))) continue;
        suit.push(get.suit(i));
      }
      if (suit.length == 0) return;
      const { control } = await player.chooseControl(suit, "cancel2").set("prompt", "【秉烛】:请选择一种花色").set("ai", function() {
        var suit2 = _status.event.suit;
        return suit2.randomGet();
      }).set("suit", suit).forResult();
      if (!control || control == "cancel2") {
        if (control == "cancel2") {
          player.setSkillCount("bingzhumrfz", -1);
        }
        return;
      }
      var hs = player.getCards("h", (card) => {
        return get.suit(card) == control;
      });
      if (hs.length == 0) return;
      let list = [];
      while (hs.length) {
        const { cards } = await player.chooseCard(true, `【秉烛】:请分配第${get.cnNumber(list.length + 1)}组手牌`).set("selectCard", function() {
          var player2 = _status.event.player;
          var num = game.countPlayer((current) => current != player2) - (list.length + 1) > 0 ? 1 : hs.length;
          return [num, Infinity];
        }).set("ai", function(card) {
          if (!ui.selected.cards) return 1;
          if (game.countPlayer((current) => {
            return current != player && get.attitude(current, player) < 0;
          }) < 2)
            return 1;
          for (var i2 of ui.selected.cards) {
            if (get.suit(i2) == get.suit(card)) return [-1, -1, 1, 1].randomGet();
            return 1;
          }
        }).set("filterCard", (card) => {
          var hs2 = _status.event.hs;
          return hs2.includes(card);
        }).set("hs", hs).forResult();
        if (!cards) continue;
        list.push([cards]);
        hs.removeArray(cards);
      }
      let count = list.length, list2 = [];
      while (count) {
        const { targets } = await player.chooseTarget(true, `【秉烛】:请将${get.translation(list[list2.length])}置于一名其他角色的武将牌上`).set("ai", function(target) {
          var player2 = _status.event.player;
          return get.attitude(player2, target) < 0;
        }).set("filterTarget", lib.filter.notMe).forResult();
        count--;
        if (!targets) continue;
        list2.push(targets[0]);
      }
      for (let i2 = 0; i2 < list2.length; i2++) {
        list2[i2].addToExpansion(list[i2][0], list2[i2], "giveAuto").gaintag.add("bingzhumrfz");
      }
    },
    group: ["bingzhumrfz_clear", "bingzhumrfz_eff"],
    subSkill: {
      eff: {
        direct: true,
        trigger: { global: "useCardToTargeted" },
        filter: function(event, player) {
          var cards = event.player.getExpansions("bingzhumrfz");
          if (!cards.length || !event.card) return false;
          if (get.type2(event.card) != "trick" && get.type(event.card) != "basic") return false;
          for (var i of cards) {
            if (get.name(i) == get.name(event.card) || get.suit(i) == get.suit(event.card)) return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          var cards = trigger.player.getExpansions("bingzhumrfz").filter((i) => get.name(i) == get.name(trigger.card) || get.suit(i) == get.suit(trigger.card));
          const {
            result: { bool, links }
          } = await player.chooseCardButton("【秉烛】:你可以弃置其一张‘司’并令此牌对一名目标角色无效", cards).set("ai", () => {
            var player2 = _status.event.player, event2 = _status.event.getTrigger(), friend = game.filterPlayer((current) => current == player2 || get.attitude(current, player2) > 0);
            for (var i of event2.targets) {
              if (friend.includes(i)) return 1;
            }
            return 0;
          });
          if (!bool) return;
          const { targets } = await player.chooseTarget("【秉烛】:请选择一名目标角色，然后此牌对该角色无效", true).set("ai", function(target) {
            var player2 = _status.event.player;
            return get.attitude(target, player2) > 0;
          }).set("filterTarget", (card, player2, target) => {
            var targets2 = _status.event.targets;
            return targets2.includes(target);
          }).set("targets", trigger.targets).forResult();
          if (!targets) return;
          trigger.getParent().excluded.add(targets[0]);
          trigger.player.loseToDiscardpile(links);
          player.draw();
          player.logSkill("bingzhumrfz", targets[0]);
        }
      },
      clear: {
        charlotte: true,
        silent: true,
        trigger: { player: "dieAfter" },
        content() {
          for (var i of game.players) {
            var cards = i.getExpansions("bingzhumrfz");
            if (cards.length) i.loseToDiscardpile(cards);
          }
        }
      }
    }
  }
});
translate({
  "zuolemrfz": "左乐",
  "qikumrfz": "岂苦",
  "qikumrfz_info": "锁定技，当你不因【岂苦】而获得牌时，若你的手牌数为0，你摸X张牌。（X=你的体力上限-此次获得的牌数）",
  "bingzhumrfz": "秉烛",
  "bingzhumrfz_info": "①出牌阶段限一次，你选择你手牌中一种花色的所有手牌，并将这些牌分成任意组并置于等量名其他角色的武将牌上，称为“司”。<br>②有“司”的角色使用或打出与“司”相同花色的基本或锦囊牌或相同牌名的牌指定目标后，你可以弃置其一张相同花色或相同牌名的“司”，并令此牌对一名目标角色无效，然后你摸一张牌。"
});
characterTitle("zuolemrfz", "<font color=#DC143C>心系苍生</font>");
characterIntro("zuolemrfz", "设计：今天整点什么/林登万<br>左乐，隶属炎国处理巨兽问题的秘密组织“司岁台”，任秉烛人之职。现因监督代理人之故于罗德岛暂驻，并定期返回炎国述职。兼职罗德岛外勤干员，参与部分外勤任务。");
//# sourceMappingURL=zuolemrfz.js.map
