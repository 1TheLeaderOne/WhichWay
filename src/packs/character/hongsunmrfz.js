import { ui, get, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("hongsunmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "samrfz",
  hp: 4,
  skills: ["chihenmrfz", "haomingmrfz"]
});
skill({
  "chihenmrfz": {
    marktext: "护",
    intro: {
      name: "护",
      content: "你有#个‘护’标记"
    },
    audio: 2,
    trigger: { player: "phaseDiscardBegin" },
    forced: true,
    filter: function(event, player) {
      return !player.hasEmptySlot(2);
    },
    async content(event, trigger, player) {
      let num = player.countCards("e");
      const { targets } = await player.chooseTarget(`【齿痕】:请选择至多${get.cnNumber(num)}角色，令这些角色获得一个‘护’`).set("selectTarget", function() {
        var num2 = _status.event.num;
        return [0, num2];
      }).set("ai", (target) => {
        var player2 = _status.event.player;
        return get.attitude(target, player2) > 0;
      }).set("num", num).forResult();
      if (!targets) return;
      for (var i of targets) {
        i.addMark("chihenmrfz");
      }
    },
    global: "chihenmrfz_eff1",
    group: ["chihenmrfz_eff2"],
    subSkill: {
      eff1: {
        charlotte: true,
        mod: {
          maxHandcard: function(player, num) {
            return num += player.countMark("chihenmrfz");
          }
        }
      },
      eff2: {
        audio: "chihenmrfz",
        forced: true,
        trigger: { global: "useCardToTargeted" },
        filter: function(event, player) {
          if (!get.tag(event.card, "damage") || !event.targets) return false;
          if (player.hp < event.player.hp) return false;
          return event.target.hasMark("chihenmrfz");
        },
        async content(event, trigger, player) {
          let target = trigger.target, eff = get.effect(target, trigger.card, trigger.player, trigger.player);
          const { bool } = await trigger.player.chooseToDiscard(`【齿痕】:你须弃置一张牌，否则此牌(${get.translation(trigger.card)})对${get.translation(target)}无效`).set("ai", function(card) {
            if (_status.event.eff > 0) return 10 - get.value(card);
            return 0;
          }).set("eff", eff).forResult();
          if (bool) {
            target.removeMark("chihenmrfz");
            return;
          }
          trigger.getParent().excluded.add(target);
          target.removeMark("chihenmrfz");
        }
      }
    }
  },
  "haomingmrfz": {
    audio: 2,
    direct: true,
    trigger: { source: "damageSource" },
    usable: 1,
    async content(event, trigger, player) {
      const { control } = await player.chooseControl("basic", "trick", "equip", "cancel2").set("prompt", "【号鸣】:请选择你要获得的牌的类型").set("ai", function() {
        var player2 = _status.event.player;
        if (player2.hp < 3) return "basic";
        if (player2.countCards("e") >= 3) return ["equip", "trick", "trick", "trick", "basic"].randomGet();
        return ["basic", "trick", "trick", "equip", "equip"].randomGet();
      }).forResult();
      if (!control || control == "cancel2") {
        player.storage.counttrigger.haomingmrfz--;
        return;
      }
      player.logSkill("haomingmrfz");
      var card = get.cardPile2(function(card2) {
        return get.type(card2, "trick") == control;
      });
      if (card) player.gain(card, "gain2", "log");
      else player.chat(`牌堆中没有${get.translation(control)}牌了！`);
    },
    group: ["haomingmrfz_jd", "haomingmrfz_find"],
    subSkill: {
      ban: {
        charlotte: true,
        mark: true,
        intro: {
          content: "使用牌不能指定有‘护’标记的牌的角色"
        },
        mod: {
          playerEnabled: function(card, player, target) {
            if (target.hasMark("chihenmrfz")) return false;
          }
        }
      },
      jd: {
        trigger: { player: "phaseJieshuBegin" },
        direct: true,
        filter: function(event, player) {
          return player.hasUseTarget("juedou");
        },
        async content(event, trigger, player) {
          const { targets } = await player.chooseTarget("【号鸣】:你可以选择一名其他角色，视为对其使用一张【决斗】").set("filterTarget", (card, player2, target) => {
            return player2.canUse("juedou", target);
          }).set("ai", (target) => {
            var player2 = _status.event.player, eff = get.effect(target, { name: "juedou", isCard: true }, player2, player2);
            if (eff < 0) return 0;
            return eff;
          }).forResult();
          if (!targets) return;
          player.when({ global: ["damageEnd", "phaseJieshuAfter"] }).filter((event2, player2) => {
            if (event2.name == "phaseJieshu") return true;
            return event2.card && event2.card.storage.haomingmrfz == true;
          }).then(async (event2, trigger2, player2) => {
            if (trigger2.name == "phaseJieshu") return;
            var target = trigger2.player, num = Math.ceil(target.countCards("h") / 2);
            if (num > 0) target.chooseToDiscard(true, num, `【号鸣】:请弃置${get.translation(num)}张手牌`);
            target.addTempSkill("haomingmrfz_ban", { player: "phaseEnd" });
          });
          player.useCard({ name: "juedou", isCard: true, storage: { haomingmrfz: true } }, targets[0]).logSkill = "haomingmrfz";
        }
      },
      find: {
        audio: "haomingmrfz",
        enable: "phaseUse",
        usable: 1,
        filter: function(event, player) {
          return player.countCards("h") > 0;
        },
        prompt: "【号鸣】:你可以弃置任意张手牌，然后从牌堆中获得一张与弃置的牌字数相同的牌",
        filterCard: true,
        selectCard: [1, Infinity],
        check(card) {
          var player = _status.event.player;
          if (player.hp < 3) {
            if (ui.selected.cards.length == 0) return 6 - get.value(card);
            return 0;
          }
          if (!player.hasEmptySlot(2)) {
            if (ui.selected.cards.length < 2) return 6 - get.value(card);
            return 0;
          }
          if (ui.selected.cards.length < 3) return 6 - get.value(card);
          return 0;
        },
        async content(event, trigger, player) {
          let cards = event.cards, num = cards.length, list = [];
          for (var i of ui.cardPile.childNodes) {
            if (get.cardNameLength(i) != num) continue;
            list.push(i);
          }
          if (list.length == 0) {
            player.chat(`牌堆中没有字数为${get.cnNumber(num)}的牌！`);
            return;
          }
          const { links } = list.length == 1 ? { links: list[0] } : await player.chooseCardButton("【号鸣】:请选择你要获得的牌", true, list).set("ai", function(button) {
            var name = button.name, player2 = _status.event.player;
            if (player2.hp < 3 && name == "tao") return 10;
            return get.value(button);
          }).forResult();
          if (!links) return;
          var card = get.cardPile2(function(card2) {
            return card2 == links[0];
          });
          if (card) player.gain(card, "gain2", "log");
          else player.chat(`牌堆中没有${get.translation(links)}了！`);
        },
        ai: {
          order: 5,
          result: {
            player: 1
          }
        }
      }
    }
  }
});
translate({
  "hongsunmrfz": "红隼",
  "chihenmrfz": "齿痕",
  "chihenmrfz_info": "锁定技，你的弃牌阶段开始时，若你防具栏有牌，你令至多X名角色获得一个“护”标记；拥有“护”标记的角色手牌上限+X，且成为带有伤害类标签的牌的目标后，若使用者的体力值不大于你的体力值，使用者须弃置一张牌，否则此牌对该角色无效，然后该角色移除一个“护”标记。（X=该角色‘护’标记的数量）",
  "haomingmrfz": "号鸣",
  "haomingmrfz_info": "①当你于回合内第一次造成伤害后，你可以从牌堆中获得一张指定类型的牌。<br>②结束阶段，你可以视为一张【决斗】，受到伤害的角色须弃置一半的手牌（向上取整）且其使用牌不能指定有“护”的角色为目标直到其回合结束。<br>③出牌阶段限一次，你可以弃置任意张手牌，然后从牌堆中获得一张牌名字数等同于弃置的牌数的牌。"
});
characterIntro("hongsunmrfz", "红隼，萨尔贡人，舒巴特-阿尔萨兰地区前部落战士，曾与她的兄弟姐妹们一起被当地王酋军强制奴役。在一次逃离后与罗德岛相遇，重返矿场解救了与自己一同受难的工友，后主动申请加入罗德岛。现作为罗德岛萨尔贡办事处干员，接受治疗的同时参与各类外勤任务。");
//# sourceMappingURL=hongsunmrfz.js.map
