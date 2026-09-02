import { get, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("chengshanmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "luomrfz",
  hp: 3,
  skills: ["dianshanmrfz", "shidemrfz"]
});
skill({
  "dianshanmrfz": {
    mark: true,
    locked: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content: function(storage, player, skill2) {
        if (player.storage.dianshanmrfz !== true)
          return "锁定技，当你成为其他角色使用的黑色牌的目标时,你对一名其他角色造成一点雷属性伤害";
        return "锁定技，当你成为其他角色使用的黑色牌的目标时,你弃置一名其他角色一张牌。";
      }
    },
    audio: "dianyongmrfz",
    trigger: {
      target: "useCardToTargeted"
    },
    forced: true,
    filter: function(event, player) {
      if (game.hasPlayer(function(current) {
        return current != player && !current.countCards("he");
      }) && player.storage.dianshanmrfz !== true)
        return false;
      return player != event.player && get.color(event.card) == "black";
    },
    async content(event, trigger, player) {
      let result;
      player.changeZhuanhuanji("dianshanmrfz");
      if (player.storage.dianshanmrfz == true) {
        result = await player.chooseTarget(get.prompt("dianshanmrfz"), "对一名其他角色造成一点雷属性伤害", true, function(card, player2, target) {
          return target != player2;
        }).set("ai", (target) => -get.attitude(player, target)).forResult();
      } else {
        result = await player.chooseTarget(get.prompt("dianshanmrfz"), "弃置一名其他角色一张牌", true, function(card, player2, target) {
          return target != player2;
        }).set("ai", (target) => -get.attitude(player, target)).forResult();
      }
      if (result.bool && result.targets) {
        if (player.storage.dianshanmrfz == true) {
          result.targets[0].damage("thunder");
        } else {
          player.discardPlayerCard(result.targets[0], 1, "he", true);
        }
      }
    }
  },
  "shidemrfz": {
    audio: "fuxiemrfz",
    direct: true,
    trigger: {
      player: ["useCard", "respond", "loseAfter"]
    },
    filter: function(event, player) {
      if (event.name != "lose") return true;
      if (event.type != "discard") return false;
      if (event.cards2) {
        for (var i = 0; i < event.cards2.length; i++) {
          return true;
        }
      }
      return false;
    },
    forced: true,
    async content(event, trigger, player) {
      if (player.isLinked()) player.link(false);
      else player.link();
    },
    group: "shidemrfz_draw",
    subSkill: {
      draw: {
        audio: "shidemrfz",
        forced: true,
        trigger: { player: "linkAfter" },
        filter: function(event, player) {
          return !player.isLinked();
        },
        async content(event, trigger, player) {
          player.draw();
        }
      }
    }
  }
});
translate({
  "chengshanmrfz": "澄闪",
  "dianshanmrfz": "电闪",
  "dianshanmrfz_info": "锁定技，转换技，当你成为其他角色使用的黑色牌的目标时，阳：你对一名其他角色造成一点雷属性伤害；阴：你弃置一名其他角色一张牌。",
  "shidemrfz": "失得",
  "shidemrfz_info": "锁定技，当你使用或打出，或因弃置失去一张牌时，若你的武将牌没有被横置，则横置之，反之重置之；当你武将牌被重置时，你摸一张牌。"
});
characterIntro("chengshanmrfz", "澄闪，罗德岛后勤干员，主要工作地点为罗德岛理发室，一般情况下不作为外勤干员派遣。使用特殊形制的法杖，操控“浮标”对敌人进行打击。");
