import { get, ui } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("baimianxiaomrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "lymrfz",
  hp: 3,
  skills: ["jinaomrfz", "wutaimrfz"]
});
skill({
  "jinaomrfz": {
    audio: 2,
    mark: true,
    marktext: "机脑",
    intro: {
      content: function(event, player) {
        var storage = player.storage.jinaomrfz;
        if (storage == true) return "递增";
        if (storage == false) return "递减";
        return "无限制";
      }
    },
    trigger: { player: "useCardAfter" },
    filter: function(event, player) {
      var history = player.getHistory("useCard");
      if (history.indexOf(event) != 1) return false;
      return history[0].card.number != void 0 && history[1].card.number != void 0;
    },
    direct: true,
    async content(event, trigger, player) {
      var history = player.getHistory("useCard");
      if (history[0].card.number < history[1].card.number) {
        player.storage.jinaomrfz = true;
        player.marks.jinaomrfz.innerText = "递增";
      } else {
        player.storage.jinaomrfz = false;
        player.marks.jinaomrfz.innerText = "递减";
      }
      player.storage.jinaomrfz_lim = history[1].card.number;
      player.addTempSkill("jinaomrfz_lim", "phaseEnd");
    },
    group: ["jinaomrfz_draw"],
    subSkill: {
      handlit: {
        onremove: true,
        charlotte: true,
        intro: {
          content: "手牌上限+#"
        },
        mod: {
          maxHandcard: function(player, num) {
            return num + player.countMark("jinaomrfz_handlit");
          }
        }
      },
      draw: {
        trigger: { player: "useCardAfter" },
        lastDo: true,
        forced: true,
        audio: "jinaomrfz",
        filter: function(event, player) {
          var history = player.getHistory("useCard");
          if (history.length < 2) return false;
          if (!history[history.length - 2].card.color || get.color(event.card) == "none") return false;
          return history[history.length - 2].card.color == get.color(event.card);
        },
        async content(event, trigger, player) {
          var color = get.color(trigger.card);
          if (color == "red") player.draw(2);
          else {
            player.addTempSkill("jinaomrfz_handlit", "phaseEnd");
            player.addMark("jinaomrfz_handlit", 1, false);
          }
        }
      },
      lim: {
        onremove: function(player) {
          if (player.marks?.jinaomrfz?.text?.innerText) player.marks.jinaomrfz.text.innerText = "机脑";
          delete player.storage.jinaomrfz;
          delete player.storage.jinaomrfz_lim;
        },
        direct: true,
        charlotte: true,
        trigger: { player: "useCardAfter" },
        firstDo: true,
        filter: function(event, player) {
          if (!event.card.number) return false;
          return true;
        },
        async content(event, trigger, player) {
          player.storage.jinaomrfz_lim = trigger.card.number;
          var cards = player.getCards("h");
          let max = 0, min = 0, num = 0;
          for (var i = 0; i < cards.length; i++) {
            if (typeof cards[i].number === "number") num = cards[i].number;
            if (i == 0) {
              max = num;
              min = num;
              continue;
            }
            if (num > max) max = num;
            if (min > num) min = num;
          }
          if (trigger.card.number >= max) {
            player.storage.jinaomrfz = false;
            player.marks.jinaomrfz.text.innerText = "递减";
            player.draw();
            player.logSkill("jinaomrfz");
          }
          if (trigger.card.number <= min) {
            player.storage.jinaomrfz = true;
            player.marks.jinaomrfz.text.innerText = "递增";
            player.draw();
            player.logSkill("jinaomrfz");
          }
        },
        mod: {
          cardEnabled2: function(card, player) {
            if (player.storage.jinaomrfz == true) {
              if (card.number && card.number <= player.storage.jinaomrfz_lim) return false;
            } else {
              if (card.number && card.number >= player.storage.jinaomrfz_lim) return false;
            }
          }
        }
      }
    }
  },
  "wutaimrfz": {
    audio: 2,
    trigger: { player: "phaseEnd" },
    direct: true,
    filter: function(event, player) {
      var cards = player.getCards("h");
      if (cards.length < 2) return false;
      for (var i = 0; i < cards.length; i++) {
        if (i == 0) {
          var tmp_cards = cards[i];
          continue;
        }
        if (get.type2(tmp_cards) != get.type2(cards[i])) return true;
        if (get.color(tmp_cards) != get.color(cards[i])) return true;
        tmp_cards = cards[i];
      }
      return false;
    },
    async content(event, trigger, player) {
      const result = await player.chooseToDiscard(
        2,
        "h",
        false,
        "【五肽】：你可以弃置两张类型或颜色不相同的手牌并选择一名角色，直到你的下个回合开始，其每回合第一次受到的伤害-1",
        function(card) {
          if (ui.selected.cards.length == 0) return true;
          if (ui.selected.cards.length) {
            return get.type2(card, player) != get.type2(ui.selected.cards[0], player) || get.color(card, player) != get.color(ui.selected.cards[0], player);
          }
          return false;
        }
      ).set("complexCard", true).set("ai", function(card) {
        return 10 - get.value(card);
      }).forResult();
      if (result.bool) {
        const { targets } = await player.chooseTarget("【五肽】：请选择一名角色", true, function(card, player2, target) {
          return !target.hasSkill("wutaimrfz_eff");
        }).set("ai", (target) => {
          let att = get.attitude(get.player(), target);
          if (target.hp < 3) att /= 1.5;
          return att;
        }).forResult();
        if (targets) {
          player.logSkill("wutaimrfz_eff", targets[0]);
          player.addTempSkill("wutaimrfz_eff", { player: "phaseBegin" });
          player.storage.wutaimrfz_eff = targets[0];
        }
      }
    },
    subSkill: {
      mark: {
        charlotte: true
      },
      eff: {
        onremove: true,
        audio: "wutaimrfz",
        mark: true,
        intro: {
          content: function(event, player) {
            var char = get.translation(player.storage.wutaimrfz_eff);
            if (player.hasSkill("wutaimrfz_mark")) return "本回合" + char + "已触发过此效果";
            return char + "受到的伤害-1";
          }
        },
        trigger: {
          global: "damageBegin"
        },
        forced: true,
        charlotte: true,
        logTarget: "player",
        filter: function(event, player) {
          if (player.hasSkill("wutaimrfz_mark")) return false;
          return event.player == player.storage.wutaimrfz_eff;
        },
        async content(event, trigger, player) {
          player.addTempSkill("wutaimrfz_mark", "phaseEnd");
          trigger.num--;
        }
      }
    }
  }
});
translate({
  "baimianxiaomrfz": "白面鸮",
  "jinaomrfz": "机脑",
  "jinaomrfz_info": "锁定技。</br>①在一个回合内，当使用第二张牌后，若第二张牌的点数大于第一张牌的点数，则你本回合使用的牌的点数必须为 { 递增 } ，反之为 { 递减 } ，然后本回合当你使用手牌中点数[最大/最小]或之一的牌后，你调换两处{}内的描述并摸一张牌；每名角色的回合结束时，你将【机脑】的描述恢复至游戏开始时的描述。</br>②当你使用一张[黑色/红色]牌后，若此牌与你本回合上一张使用的牌颜色相同，你[本回合手牌上限+1/摸两张牌]。",
  "wutaimrfz": "五肽",
  "wutaimrfz_info": "结束阶段，你可以弃置两张颜色或类型不同的手牌，然后令一名角色每回合第一次受到的伤害-1直到你的下个回合开始。"
});
characterIntro("baimianxiaomrfz", "......</br>已在20593个搜索结果中，为您选择了相对精准的答案。</br>白面鸮，前莱茵生命公司，数据维护专员。在医疗类源石技艺领域取得不菲成就，于医疗数据维护，常规医疗方案应用，多项目医疗行为等相关领域，拥有丰富经验。</br>现于罗德岛担任医疗干员，亦就职于医疗部门，某临床实验小组，项目领头人：赫默医生。同时，为罗德岛提供若干项医疗项目的相关辅助工作。</br>......");
