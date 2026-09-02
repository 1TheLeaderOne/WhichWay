import { get, game, lib, ui, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("spjiexikamrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "gemrfz",
  hp: 4,
  skills: ["yijiemrfz", "fuhuangmrfz"]
});
skill({
  "yijiemrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter: function(event, player) {
      if (player.countCards("he") == 0) return false;
      return game.countPlayer(function(current) {
        return current != player && current.countCards("h") > 0;
      }) > 0;
    },
    filterTarget: function(card, player, target) {
      return target != player;
    },
    targetprompt: ["被出杀(A)", "出杀(B)", "出杀(B)"],
    selectTarget: [2, 3],
    multitarget: true,
    line: false,
    async content(event, trigger, player) {
      event.num = 0;
      const targets = event.targets;
      targets.push(player);
      const frsTargets = targets[0];
      const secTargets = targets.slice(1);
      for (const t of secTargets) {
        t.line(frsTargets);
      }
      while (event.num < secTargets.length) {
        const currentTarget = secTargets[event.num];
        currentTarget.storage.yijiemrfz = frsTargets;
        currentTarget.addTempSkill("yijiemrfz_gain", "shaMiss");
        await currentTarget.chooseToUse(
          function(card, player2, event2) {
            if (get.name(card) !== "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【义劫】：是否对" + get.translation(frsTargets) + "使用一张杀？"
        ).set("complexSelect", true).set("filterTarget", function(card, player2, target) {
          if (target !== _status.event.frsTargets && !ui.selected.targets.includes(_status.event.frsTargets)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("addCount", false).set("frsTargets", frsTargets);
        event.num++;
      }
    },
    ai: {
      order: 4.1,
      expose: 0.1,
      result: {
        player: 1,
        target: function(player, target) {
          if (ui.selected.targets.length == 0) {
            return -3;
          } else return 1;
        }
      }
    },
    //group:'tuohuangmrfz',
    subSkill: {
      gain: {
        direct: true,
        charlotte: true,
        trigger: {
          source: "damageEnd"
        },
        onremove: function(player) {
          delete player.storage.yijiemrfz;
        },
        filter: function(event, player) {
          return event.card && event.card.name == "sha" && event.player == player.storage.yijiemrfz;
        },
        async content(event, trigger, player) {
          if (trigger.player.countCards("he") > 0) player.gainPlayerCard(trigger.player, true, "he");
          else trigger.player.damage("player");
          player.removeSkill("yijiemrfz_gain");
          delete player.storage.yijiemrfz;
        }
      }
    }
  },
  "fuhuangmrfz": {
    audio: 2,
    derivation: ["tuohuangmrfz", "weihumrfz"],
    skillAnimation: true,
    animationColor: "fire",
    unique: true,
    juexingji: true,
    forced: true,
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    filter: function(event, player) {
      return player.countMark("fuhuangmrfz_mark") >= 2;
    },
    async content(event, trigger, player) {
      player.removeMark("fuhuangmrfz_mark", player.countMark("fuhuangmrfz_mark"), false);
      player.awakenSkill("fuhuangmrfz");
      player.removeSkill("yijiemrfz");
      player.addSkill("tuohuangmrfz");
      player.addSkill("weihumrfz");
      player.draw(2);
      player.changeHujia(1);
      player.loseMaxHp(1);
    },
    group: "fuhuangmrfz_mark",
    subSkill: {
      mark: {
        intro: {
          content: "已获得#张牌"
        },
        silent: true,
        firstDo: true,
        trigger: {
          player: "gainAfter",
          global: "loseAsyncAfter"
        },
        filter: function(event, player) {
          if (player.countMark("fuhuangmrfz_mark") >= 2) return false;
          return event.getg(player).length && event.getParent("phaseDraw").player != player;
        },
        async content(event, trigger, player) {
          player.addMark("fuhuangmrfz_mark", trigger.num, false);
        }
      }
    }
  },
  "tuohuangmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter: function(event, player) {
      return game.hasPlayer(function(current) {
        return current.countCards("he") > 0;
      });
    },
    multitarget: true,
    multiline: true,
    filterTarget: function(card, player, target) {
      return target.countCards("h") > 0;
    },
    selectTarget: [1, 3],
    async content(event, trigger, player) {
      let result;
      const targets = event.targets;
      const num = 4 - targets.length;
      const cards = game.cardsGotoOrdering(get.cards(num)).cards;
      event.cards = cards;
      player.showCards(event.cards, get.translation(player) + "发动了【拓荒】");
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const suit = [];
        for (const card of event.cards) {
          const s = get.suit(card);
          if (!suit.includes(s) && lib.suit.includes(s)) suit.push(s);
        }
        result = await target.chooseToDiscard("h", "【拓荒】：你可以弃置" + get.translation(suit) + "花色的手牌并摸等量 +1 张牌", [1, Infinity], (card) => {
          const suitcard = get.suit(card);
          return suit.includes(suitcard);
        }).set("ai", (card) => {
          return 8 - get.value(card);
        }).forResult();
        if (result.cards) {
          await target.draw(1 + result.cards.length);
        }
      }
    },
    ai: {
      expose: 0.1,
      threaten: 1.35,
      order: 1,
      result: {
        player: 1,
        target: 1
      }
    }
  },
  "weihumrfz": {
    mod: {
      maxHandcard: function(player, num) {
        if (player.hujia > 0) return num + 1;
      }
    },
    audio: 2,
    trigger: { global: "roundStart" },
    filter: function(event, player) {
      return player.hujia < 1;
    },
    forced: true,
    async content(event, trigger, player) {
      player.changeHujia();
    },
    group: "weihumrfz_give",
    subSkill: {
      give: {
        trigger: { player: "phaseUseEnd" },
        filter: function(event, player) {
          return player.hujia > 0;
        },
        direct: true,
        async content(event, trigger, player) {
          const result = await player.chooseTarget(
            [1, player.hujia + 1],
            "【卫护】：你可以失去至少一点护甲，然后令等量+1名没有护甲的其他角色获得一点护甲",
            function(card, player2, target) {
              return target != player2 && target.hujia < 1;
            }
          ).set("ai", (target) => get.attitude(player, target) > 2).forResult();
          if (result.targets) {
            player.logSkill("weihumrfz");
            player.changeHujia(Math.min(-1, -result.targets.length + 1));
            for (let i of result.targets) {
              i.changeHujia();
              player.line(i);
            }
          }
        }
      }
    }
  }
});
translate({
  "spjiexikamrfz": "涤火杰西卡",
  "spjiexikamrfz_prefix": "涤火",
  "yijiemrfz": "义劫",
  "yijiemrfz_info": "出牌阶段限一次，你可以先选择一名其他角色，称为A，再选择至多两名不为A的其他角色，后选择的角色和你称为B，然后B可以对A使用一张【杀】（不计入次数限制），若A因此受到过伤害，B获得A一张牌（A没有牌则改为对其造成一点伤害）。",
  "fuhuangmrfz": "赴荒",
  "fuhuangmrfz_info": "觉醒技，当你获得牌后，若你不因摸牌阶段的额定摸牌而获得了至少2张牌，你失去【义劫】，获得【卫护】和【拓荒】，然后摸两张牌、获得1点护甲和失去一点体力上限。",
  "tuohuangmrfz": "拓荒",
  "tuohuangmrfz_info": "出牌阶段限一次，你可以选择至多3名角色，展示牌堆顶4-你选择的角色数张牌，然后被选择的角色可以弃置任意张与其花色相同的手牌并摸等量+1张牌。",
  "weihumrfz": "卫护",
  "weihumrfz_info": "①锁定技，每轮开始时，若你没有护甲，你获得一点护甲；当你有护甲时，手牌上限+1。②出牌阶段结束时，你可以失去至少一点护甲，然后令等量+1名没有护甲的其他角色获得一点护甲。"
});
characterIntro("spjiexikamrfz", "杰西卡·布林雷，因私人原因离开黑钢基地后，选择去往拓荒地，成为了一名治安官。现作为当地办事处的合作干员为罗德岛提供帮助与支持。");
