import { lib, get, ui, _status, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("chuxuemrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "xiemrfz",
  hp: 3,
  skills: ["shengnvmrfz", "shenshemrfz"]
});
skill({
  "shengnvmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter: function(event, player) {
      return game.countPlayer((current) => {
        return current != player;
      }) > 1;
    },
    selectTarget: 2,
    filterTarget: lib.filter.notMe,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      let targets = event.targets, targets2 = [], csn = [void 0, void 0];
      while (targets.length > 0) {
        var target = targets[0], list = [], csList = ["收回所有装备区的牌", "将一张手牌当【乐不思蜀】置于你的判定区", "不能响应下一张指定你为目标的基本牌或普通锦囊牌"];
        if (target.countCards("e") > 0) {
          list.push("选项一");
        } else csList[0] = '<span style="opacity:0.5; ">' + csList[0] + "（不可选：装备区没有牌）</span>";
        for (var i of target.getCards("h")) {
          if (!target.canAddJudge({ name: "lebu", cards: [i] })) continue;
          list.push("选项二");
          break;
        }
        if (!list.includes("选项二"))
          csList[1] = '<span style="opacity:0.5; ">' + csList[1] + "（不可选：无法对自己使用【乐不思蜀】）</span>";
        list.push("选项三");
        if (list.length == 0) continue;
        const { control } = await target.chooseControl(list).set("choiceList", csList).set("ai", function() {
          var list2 = _status.event.list;
          if (list2.includes("选项二")) list2.remove("选项二");
          return list2.randomGet();
        }).set("target", target).set("list", list).forResult();
        if (!control) continue;
        csn[targets.length - 1] = control;
        targets2.add(target);
        switch (control) {
          case "选项一":
            target.gain(target.getCards("e"), "gain2");
            break;
          case "选项二": {
            const { cards } = await target.chooseCard(true).set("prompt", "【圣女】:请选择一张手牌当【乐不思蜀】置于你的判定区").set("filterCard", (card) => {
              return target.canAddJudge({ name: "lebu", cards: [card] });
            }).set("ai", (card) => {
              return 6 - get.value(card);
            }).forResult();
            if (!cards) break;
            target.useCard({ name: "lebu" }, cards, target);
            break;
          }
          case "选项三":
            target.addMark("shengnvmrfz_direct", 1, false);
            break;
        }
        targets.shift();
      }
      if (csn[0] != csn[1]) {
        for (let i2 of targets2) {
          if (!i2.countGainableCards(player, "he")) continue;
          player.gainPlayerCard("he", i2, true).set("ai", lib.card.shunshou.ai.button);
        }
      } else player.draw(2);
    },
    ai: {
      order: 13,
      result: {
        target: -1
      }
    },
    global: "shengnvmrfz_direct",
    subSkill: {
      direct: {
        charlotte: true,
        direct: true,
        intro: {
          content: "不能响应下#张指定你为目标的基本牌或普通锦囊牌"
        },
        trigger: {
          target: "useCardToPlayered"
        },
        filter: function(event, player) {
          return player.countMark("shengnvmrfz_direct") > 0 && (get.type(event.card) == "basic" || get.type(event.card) == "trick");
        },
        async content(event, trigger, player) {
          player.logSkill("shengnvmrfz");
          player.removeMark("shengnvmrfz_direct", 1, false);
          trigger.directHit.add(player);
        }
      }
    }
  },
  "shenshemrfz": {
    audio: 2,
    forced: true,
    trigger: { target: "useCardToTargeted" },
    filter: function(event, player) {
      if (player.countCards("h", (card) => get.is.shownCard(card)) < 1) return false;
      var max = 0, shown = player.getCards("h", (card) => get.is.shownCard(card));
      for (var i of shown) {
        if ((i?.number || 0) > max) max = i.number;
      }
      var number = get.number(event.card);
      if (number != null && Number(number) > max) return false;
      return event.player.countCards("he") > 0 && event.player != player && get.tag(event.card, "damage") > 0;
    },
    async content(event, trigger, player) {
      let list = [], source = trigger.player, tranTmp = function(str) {
        var list2 = ["e", "h"];
        var cn = ["装备", "手牌"];
        for (var i = 0; i < list2.length; i++) {
          if (str == list2[i]) return cn[i];
        }
      };
      if (source.countCards("h") > 0) list.push("h");
      if (source.countCards("e") > 0) list.push("e");
      let num = list.length;
      if (num == 0) return;
      source.chooseToDiscard(true).set("position", "he").set("prompt", `【神慑】:请弃置${list.length > 1 ? tranTmp(list[0]) + "和" + tranTmp(list[1]) : tranTmp(list[0])}区的一张牌`).set("selectCard", num).set("filterCard", (card) => {
        if (ui.selected.cards.length == 0) return true;
        if (get.position(ui.selected.cards[0]) == "h") return get.position(card) == "e";
        return get.position(card) == "h";
      }).set("complexCard", true).set("ai", (card) => {
        return 8 - get.value(card);
      });
    },
    ai: {
      threaten: 0.6
    },
    group: "shenshemrfz_show",
    subSkill: {
      show: {
        audio: "shenshemrfz",
        forced: true,
        trigger: { player: "phaseJieshuBegin" },
        filter: function(event, player) {
          return player.countCards("h", (card) => !get.is.shownCard(card)) > 0 && player.countCards("h", (card) => get.is.shownCard(card)) == 0;
        },
        async content(trigger, event, player) {
          let hs = player.getCards("h", (card) => !get.is.shownCard(card));
          if (hs.length == 0) return;
          player.addShownCards(hs, "visible_shenshemrfz");
        }
      }
    }
  }
});
translate({
  "chuxuemrfz": "初雪",
  "shengnvmrfz": "圣女",
  "shengnvmrfz_info": "出牌阶段限一次，你可以选择两名其他角色，然后这两名角色同时选择一项：<br>1.收回所有装备区的牌；<br>2.将一张手牌当作【乐不思蜀】置入其的判定区；<br>3.不能响应下一张指定其为目标的基本牌或普通锦囊牌。<br>若这些角色选择的选项不同，你获得这些角色一张牌，反之你摸两张牌。",
  "shenshemrfz": "神慑",
  "shenshemrfz_info": "锁定技。<br>①结束阶段，若你没有明置的手牌，你明置你的手牌<br>②当你成为其他角色使用的带有伤害类标签的牌的目标后，若此牌的点数不大于你明置的牌中点数最大的一张牌，则其须弃置手牌区和装备区内各一张牌。"
});
characterTitle("chuxuemrfz", "<font color=#C0C0C0>谢拉格的圣女</font>");
characterIntro("chuxuemrfz", "初雪，谢拉格出身，喀兰圣女，全谢拉格的宗教领袖。运用神赐的圣铃，呼唤风雪的力量。现通过保密途径来到罗德岛，具体担任事务与驻留时间不便公开。");
