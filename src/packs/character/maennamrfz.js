import { lib, _status, get, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("maennamrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "kamrfz",
  hp: 4,
  skills: ["lianmangmrfz", "zhanmangmrfz", "xingyimrfz"]
});
skill({
  "lianmangmrfz": {
    audio: 2,
    trigger: {
      target: "useCardToTargeted"
    },
    filter: function(event, player) {
      return player.countCards("h") > 0 && event.card && event.player != player && !player.hasSkill("zhanmangmrfz_ban");
    },
    banHs: function(event, trigger, player) {
      player.addTempSkill("lianmangmrfz_ban");
      _status.tmpCard = trigger.card;
      player.when({
        global: "useCardAfter",
        player: "dying"
      }).filter((event2, player2) => {
        return event2.card == _status.tmpCard || event2.name == "dying";
      }).then(() => {
        player.removeSkill("lianmangmrfz_ban");
        delete _status.tmpCard;
      });
    },
    forced: true,
    async content(event, trigger, player) {
      let num = get.cardNameLength(trigger.card);
      const { cards } = await player.chooseCard(`【敛芒】:请重铸至多${get.cnNumber(num)}张牌`, [0, num], true).set("ai", function(card) {
        if (get.tag(card, "damage")) return 10 - get.value(card);
        return 6 - get.value(card);
      }).set("filterCard", (card) => player.canRecast(card)).forResult();
      if (!cards || cards.length == 0) {
        lib.skill.lianmangmrfz.banHs(event, trigger, player);
        return;
      }
      let hs = player.getCards("h");
      await player.recast(cards, void 0, void 0);
      if (cards.filter((i) => get.tag(i, "damage")).length > 0) player.draw();
      if (hs.isSubset(cards)) trigger.player.damage();
      lib.skill.lianmangmrfz.banHs(event, trigger, player);
    },
    group: ["lianmangmrfz_cancel"],
    subSkill: {
      ban: {
        charlotte: true,
        mod: {
          cardEnabled2: function(card, player) {
            if (get.position(card) == "h") return false;
          }
        }
      },
      cancel: {
        forced: true,
        audio: "lianmangmrfz",
        trigger: { source: "damageBefore" },
        filter: function(event, player) {
          return !player.hasSkill("zhanmangmrfz_ban");
        },
        async content(event, trigger, player) {
          let num = trigger.num;
          trigger.cancel();
          let list = ["选项一"];
          let chooseList = [`摸${get.cnNumber(num)}张牌`, `回复${get.cnNumber(num)}点体力`];
          if (player.getDamagedHp() > 0) {
            list.push("选项二");
          } else chooseList[1] = '<span style="opacity:0.5">' + chooseList[2] + "（不可选：已损失体力值为零）</span>";
          const { control } = list.length == 1 ? player.draw(num) : await player.chooseControl(list).set("choiceList", chooseList).set("prompt", "【敛芒】:请选择一项").set("ai", function() {
            var list2 = _status.event.list;
            if (list2.includes("选项二")) return "选项二";
            return "选项一";
          }).set("list", list).forResult();
          if (!control) return;
          switch (control) {
            case "选项一":
              player.draw(num);
              break;
            case "选项二":
              player.recover(num);
              break;
          }
        }
      }
    },
    ai: {
      threaten: 0.8,
      effect: {
        target: function(card, player, target) {
          if (get.tag(card, "damage")) return [0, -999999];
        }
      }
    }
  },
  "zhanmangmrfz": {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter: function(event, player) {
      return player.countCards("h") > player.getHandcardLimit();
    },
    prompt: function(event, player) {
      var num = Math.min(player.maxHp, player.countCards("h") - player.getHandcardLimit());
      return `【展芒】:你可以摸${get.cnNumber(num)}张牌、本回合使用【杀】的次数+${num}，且本回合【敛芒】失效`;
    },
    async content(event, trigger, player) {
      const num = Math.min(player.maxHp, player.countCards("h") - player.getHandcardLimit());
      player.draw(num);
      player.addMark("zhanmangmrfz_add", num, false);
      player.addTempSkill("zhanmangmrfz_add", {
        player: "phaseEnd"
      });
      player.addTempSkill("zhanmangmrfz_ban", {
        player: "phaseEnd"
      });
    },
    subSkill: {
      ban: {
        charlotte: true,
        mark: true,
        intro: {
          content(event, player) {
            return `·【敛芒】失效<br>·本回合使用【杀】的次数+${player.countMark("zhanmangmrfz_add")}`;
          }
        }
      },
      add: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable: function(card, player, num) {
            var count = player.countMark("zhanmangmrfz_add");
            if (card.name == "sha") return num + count;
          }
        }
      }
    },
    ai: {
      threaten: function() {
        var player = _status.event.player, num = player.countCards("h") - player.getHandcardLimit();
        return 1 + Math.max(0.2, num * 0.2);
      }
    }
  },
  "xingyimrfz": {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    getDamagedTarget: function(event, player) {
      let list = [];
      for (var i of game.players) {
        if (player == i) continue;
        let history = i.getHistory("damage");
        for (var j = 0; j < history.length; j++) {
          let damaged = history[j].player;
          list.push(damaged);
        }
      }
      return list;
    },
    filter: function(event, player) {
      var list = lib.skill.xingyimrfz.getDamagedTarget(event, player);
      return list.length > 0 && _status.currentPhase != player;
    },
    direct: true,
    async content(event, trigger, player) {
      let list = lib.skill.xingyimrfz.getDamagedTarget(event, player);
      const { targets } = await player.chooseTarget("【行义】:你可以受到一点伤害并令一名本回合受到过伤害的其他角色回复一点体力").set("filterTarget", function(card, player2, target) {
        var list2 = _status.event.list;
        return list2.includes(target);
      }).set("ai", function(target) {
        var player2 = _status.event.player;
        if (player2.hp < 2 && player2.countCards("h", "tao") + player2.countCards("h", "jiu") < 1) return 0;
        return get.attitude(target, player2) > 0;
      }).set("list", list).forResult();
      if (!targets) return;
      targets[0].recover();
      player.damage("nosource");
      player.logSkill("xingyimrfz", targets[0]);
    }
  }
});
translate({
  "maennamrfz": "玛恩纳",
  "lianmangmrfz": "敛芒",
  "lianmangmrfz_info": "锁定技。<br>①当你成为其他角色使用牌的目标后，你重铸至多X张牌（X=此牌牌名的字数），若你：1.因此重铸了带有伤害类标签的牌，你摸一张牌；2.因此重铸了所有手牌，对使用者造成一点伤害，然后你不能使用或打出手牌直到此牌结算完毕或你进入濒死状态。<br>②当你造成伤害时，你改为令你回复等量体力或摸等量的牌。",
  "zhanmangmrfz": "展芒",
  "zhanmangmrfz_info": "出牌阶段开始时，若你的手牌数大于你的手牌上限，你可以摸X张牌且本回合使用【杀】的次数+X，然后本回合【敛芒】失效。（X=你的手牌数-你的手牌上限，X至多为你的体力上限）",
  "xingyimrfz": "行义",
  "xingyimrfz_info": "其他角色的回合结束阶段，你可以受到一点伤害，并令一名本回合受到过伤害的其他角色回复一点体力。"
});
characterIntro("maennamrfz", "设计：落尘星河/林登万<br>玛恩纳·临光，临光家前家主，干员临光与瑕光的叔叔，迄今并未获得过任何形式的骑士封号。于特锦赛后约两个月，接受罗德岛的合作邀请，协助罗德岛处理卡西米尔地区的各项事务。");
//# sourceMappingURL=maennamrfz.js.map
