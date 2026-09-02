import { _status, get, game, ui, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("yemomrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 3,
  skills: ["biaolimrfz", "ymkongwomrfz"]
});
skill({
  "biaolimrfz": {
    mod: {
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.storage && card.storage.biaolimrfz == true) return num + 1;
      },
      cardname(card, player, name) {
        var storage = player.storage.biaolimrfz == "red" ? "tao" : "sha";
        if (card.storage && card.storage.biaolimrfz == true) return storage;
      },
      targetInRange(card, player, target) {
        if (card.storage && card.storage.biaolimrfz == true && get.name(card) == "sha" && target.hp >= player.hp) return true;
      }
    },
    audio: 2,
    forced: true,
    trigger: { player: "phaseUseBegin" },
    async content(event, trigger, player) {
      const result = await player.draw(3).forResult();
      let cards = result.cards;
      if (!cards) return;
      var red = 0;
      for (let i of cards) {
        if (get.color(i) == "red") red++;
        i.storage.biaolimrfz = true;
        i.addGaintag("biaolimrfz");
      }
      if (red > 1) player.storage.biaolimrfz = "red";
      else player.storage.biaolimrfz = "black";
    },
    group: ["biaolimrfz_nocount", "biaolimrfz_set"],
    subSkill: {
      set: {
        charlotte: true,
        silent: true,
        unique: true,
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
          var enable = lib.card.tao.enable;
          lib.card.tao.enable = function(card, player2) {
            if (player2.storage.biaolimrfz && player2.storage.biaolimrfz == "red" && player2.isPhaseUsing()) {
              if (card.storage.biaolimrfz) return true;
              return player2.hp < player2.maxHp;
            }
            return enable(card, player2);
          };
          var selectTarget = lib.card.tao.selectTarget;
          lib.card.tao.selectTarget = function() {
            var player2 = _status.event.player;
            if (player2.storage.biaolimrfz && player2.storage.biaolimrfz == "red" && player2.isPhaseUsing()) {
              return [1, 1];
            }
            return selectTarget;
          };
          var filterTarget = lib.card.tao.filterTarget;
          lib.card.tao.filterTarget = function(card, player2, target) {
            if (player2.storage.biaolimrfz && player2.storage.biaolimrfz == "red" && player2.isPhaseUsing()) {
              if (card.storage.biaolimrfz) return target.hp < target.maxHp;
              return target.hp < target.maxHp && target == player2;
            }
            return filterTarget(card, player2, target);
          };
        }
      },
      nocount: {
        silent: true,
        trigger: { player: "useCard2" },
        filter(event, player) {
          if (!event.card) return false;
          if (event.card.storage.biaolimrfz != true || get.name(event.card) != "sha") return false;
          for (var i of event.targets) {
            if (player.hp <= i.hp) return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            trigger.player.getStat().card.sha--;
          }
        }
      }
    }
  },
  "ymkongwomrfz": {
    audio: 2,
    direct: true,
    trigger: { player: "phaseDrawEnd" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const { bool } = await player.chooseToDiscard().set("position", "he").set("prompt", "【控我】:你可以弃置一张牌，然后观看牌堆顶两张牌，并以任意顺序将其置于牌堆顶或牌堆底").set("ai", function(card) {
        var player2 = _status.event.player;
        if (player2.skipList.includes("phaseUse")) return 0;
        if (card.storage.biaolimrfz == true) return 10 - get.value(card);
        return 6 - get.value(card);
      }).forResult();
      if (!bool) return;
      player.logSkill("ymkongwomrfz");
      var cards = get.cards(2);
      game.cardsGotoOrdering(cards);
      const { moved } = await player.chooseToMove().set("list", [["牌堆顶", cards], ["牌堆底"]]).set("prompt", "点击将牌移动到牌堆顶或牌堆底").set("processAI", function(list) {
        var cards2 = list[0][1], player2 = _status.event.player;
        var top2 = [];
        var bottom2;
        cards2.sort(function(a, b) {
          var a_value = get.color(a, player2) == "red" ? 3 : 5, b_value = get.color(b, player2) == "red" ? 3 : 5, hp = player2.hp;
          if (hp < 3) {
            if (get.color(a, player2) == "red") ;
            if (get.color(b, player2) == "red") ;
          }
          return b_value - a_value;
        });
        while (cards2.length) {
          var value = 0;
          if (player2.hp < 3) {
            if (get.color(cards2[0], player2) == "red") value++;
          } else if (get.color(cards2[0], player2) == "black") value++;
          if (value <= 0) break;
          top2.unshift(cards2.shift());
        }
        bottom2 = cards2;
        return [top2, bottom2];
      }).forResult();
      if (!moved) return;
      var top = moved[0];
      var bottom = moved[1];
      top.reverse();
      for (var i = 0; i < top.length; i++) {
        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
      }
      for (i = 0; i < bottom.length; i++) {
        ui.cardPile.appendChild(bottom[i]);
      }
      game.addCardKnower(top, [player]);
      game.addCardKnower(bottom, [player]);
      player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
      game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
      game.updateRoundNumber();
      let { promise, resolve } = Promise.withResolvers();
      setTimeout(() => {
        resolve(true);
      }, 500);
      await promise;
    }
  }
});
translate({
  "yemomrfz": "夜魔",
  "biaolimrfz": "表里",
  "biaolimrfz_info": "锁定技，出牌阶段开始时，你摸三张牌，若这些牌中[红/黑]色的牌的数量不少于2，则你因此技能而获得的牌视为[【桃】（可以于出牌阶段对任意角色使用）/【杀】（对体力值不小于你的角色无距离限制且不计入使用次数）]。",
  "ymkongwomrfz": "控我",
  "ymkongwomrfz_info": "摸牌阶段结束时，你可以弃置一张牌，然后观看牌堆顶两张牌，并以任意的顺序将其置于牌堆顶或牌堆底。"
});
characterTitle("yemomrfz", "<font color=#efd02a>双生花</font>");
characterIntro("yemomrfz", "夜魔，维多利亚公民，登记姓名为瑞贝尔·帕斯贝莱蒂·葛罗莉亚，于罗德岛正式任职前为高校学生，进修课程：进阶医疗法术与心理学干预。在医疗法术和破坏性法术领域均展现出较强的控制力。现于罗德岛某调理机构中担任职员。<br>备注：该干员适用于特殊监护管理办法，协议已由监护者莱娜签字确认，现已生效。");
