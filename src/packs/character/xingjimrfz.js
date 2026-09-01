import { game, get, _status, lib } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("xingjimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "gemrfz",
  hp: 4,
  skills: ["tianyimrfz", "huijianmrfz", "bingmingmrfz"]
});
skill({
  "tianyimrfz": {
    audio: 2,
    mark: true,
    locked: false,
    zhuanhuanji: true,
    marktext: "☯",
    init: function(player, skill2) {
      player.storage[skill2] = true;
    },
    intro: {
      content: function(storage, player, skill2) {
        if (player.storage.tianyimrfz == true) return "观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底";
        return "进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）";
      }
    },
    trigger: { global: "phaseJudgeBegin" },
    prompt: function(event, player) {
      if (player.storage.tianyimrfz == true)
        var str = "观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底";
      else var str = "进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）";
      return "【天仪】:你可以" + str;
    },
    async callback(event, trigger, player) {
      if (event.judgeResult.suit == "club") {
        if (player.countMark("tianyimrfz_shacount") < 3) player.addMark("tianyimrfz_shacount", 1, false);
      }
      player.gain(event.card, "gain2").gaintag.add("tianyimrfz");
      player.addTempSkill("tianyimrfz_remove", "phaseEnd");
    },
    async content(event, trigger, player) {
      if (player.storage.tianyimrfz) await player.chooseToGuanxing(2);
      else
        await player.judge(function(card) {
          if (get.suit(card) == "club") return 0;
          return -4;
        }).set("callback", lib.skill.tianyimrfz.callback);
      player.changeZhuanhuanji("tianyimrfz");
    },
    mod: {
      cardUsable: function(card, player, num) {
        if (card.name == "sha") return num + player.countMark("tianyimrfz_shacount");
      }
    },
    subSkill: {
      shacount: {
        charlotte: true,
        intro: {
          content: "使用【杀】的次数+#"
        }
      },
      remove: {
        onremove: function(player) {
          player.removeGaintag("tianyimrfz");
        },
        charlotte: true,
        mod: {
          cardname: function(card, player, name) {
            if (card.hasGaintag("tianyimrfz")) return "shan";
          }
        }
      }
    }
  },
  "huijianmrfz": {
    audio: 2,
    trigger: { player: "useCard2" },
    filter: function(event, player) {
      if (!event.targets || event.targets.length > 1) return false;
      if (!player.hasUseTarget(event.card, true, false)) return false;
      if (!player.isPhaseUsing()) return false;
      if (player.getCardUsable("sha") < 1) return false;
      return get.type(event.card) == "trick" || get.type(event.card) == "basic";
    },
    usable: 1,
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(
        [1, player.getCardUsable("sha")],
        get.prompt("huijianmrfz"),
        "为" + get.translation(trigger.card) + "增加至多" + player.getCardUsable("sha") + "个目标",
        function(card, player2, target) {
          return !_status.event.sourcex.includes(target) && player2.canUse(_status.event.card, target);
        }
      ).set("sourcex", trigger.targets).set("ai", function(target) {
        var player2 = _status.event.player;
        return get.effect(target, _status.event.card, player2, player2);
      }).set("card", trigger.card).setHiddenSkill(event.name).forResult();
      if (result.targets) {
        if (!event.isMine() && !event.isOnline()) game.delayx();
        for (var i = 0; i < result.targets.length; i++) {
          trigger.targets.push(result.targets[i]);
          player.line(result.targets[i]);
        }
        player.logSkill("huijianmrfz");
        player.addMark("huijianmrfz_minus", result.targets.length, false);
        player.addTempSkill("huijianmrfz_minus", "phaseUseAfter");
      } else {
        player.storage.counttrigger.huijianmrfz--;
      }
    },
    subSkill: {
      minus: {
        onremove: function(player) {
          player.removeMark("huijuanmrfz_minus", player.countMark("huijuanmrfz_minus"), false);
        },
        charlotte: true,
        mod: {
          cardUsable: function(card, player, num) {
            if (card.name == "sha") return num - player.countMark("huijianmrfz_minus");
          }
        }
      }
    }
  },
  "bingmingmrfz": {
    audio: 2,
    trigger: { global: "roundStart" },
    filter: function(event, player) {
      if (!game.findPlayer(function(current) {
        return current.name == "xingyuanmrfz";
      }))
        return false;
      return game.roundNumber == 2;
    },
    forced: true,
    async content(event, trigger, player) {
      const target = game.findPlayer(function(current) {
        return current.name == "xingyuanmrfz";
      });
      if (!target) return;
      const num1 = player.countCards("h") - target.countCards("h");
      const num2 = player.getHandcardLimit() - target.getHandcardLimit();
      if (num1 > 0) {
        player.chooseToDiscard(true, "【病鸣】:请将手牌调整至" + num1, num1);
      } else if (num1 < 0) player.drawTo(-num1);
      if (num2 != 0) {
        player.addMark("bingmingmrfz", Math.abs(num2), false);
      }
    },
    mod: {
      maxHandcard: function(player, num) {
        return num + player.countMark("bingmingmrfz");
      }
    }
  }
});
translate({
  "xingjimrfz": "星极",
  "tianyimrfz": "天仪",
  "tianyimrfz_info": "转换技，一名角色的判定阶段，你可以，阳：观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底；阴：进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）。",
  "huijianmrfz": "辉剑",
  "huijianmrfz_info": "出牌阶段限一次，当你使用单一目标的基本和普通锦囊牌选择目标后，若【天仪】状态为阴，你可以令此牌额外指定任意名（至多为你本回合剩余使用【杀】的次数）其他角色为目标（目标必须合法），然后你本阶段减少等量使用【杀】的次数。",
  "bingmingmrfz": "病鸣",
  "bingmingmrfz_info": "锁定技，第二轮开始时，若场上有星源，你将手牌和手牌上限调整至与其一致。"
});
characterIntro("xingjimrfz", "星极，哥伦比亚某神秘学组织的会员，经由合作协议被派驻至莱茵生命，职位为文献学顾问。由于共发性矿石病与妹妹一起来到罗德岛，在进行矿石病治疗期间通过测试成为干员。可使用独特的剑技，对近战目标造成类似法术的攻击效果。");
//# sourceMappingURL=xingjimrfz.js.map
