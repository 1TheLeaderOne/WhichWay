import { get, _status, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("wmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "bamrfz",
  hp: 3,
  skills: ["fukemrfz", "zhumengmrfz3"]
});
skill({
  "fukemrfz": {
    trigger: {
      player: "gainAfter"
    },
    filter: function(event, player) {
      if (!game.hasPlayer(function(current) {
        return current != player && current.countCards("he") > 0;
      }))
        return false;
      return event.getParent(3).name != "fukemrfz";
    },
    audio: 2,
    direct: true,
    async content(event, trigger, player) {
      var num = trigger.cards.length;
      const result = await player.chooseTarget(
        get.prompt("fukemrfz"),
        "获得至多" + get.translation(num) + "名角色的各一张牌，然后弃置等量的牌",
        [1, num],
        function(card, player2, target) {
          return target.countCards("he") > 0 && player2 != target;
        },
        function(target) {
          var att = get.attitude(_status.event.player, target);
          if (target.hasSkill("tuntian")) return att / 10;
          return 1 - att;
        }
      ).forResult();
      if (result.bool && result.targets) {
        var num2 = result.targets.length;
        result.targets.sortBySeat();
        player.logSkill("fukemrfz", result.targets);
        player.chooseToDiscard(num2, true, "he");
        player.gainMultiple(result.targets, "he");
      }
    },
    ai: {
      threaten: 1.6,
      expose: 0.2
    }
  },
  "zhumengmrfz": {
    audio: 2,
    direct: true,
    trigger: {
      global: "roundStart"
    },
    firstDo: true,
    forced: true,
    async content(event, trigger, player) {
      player.removeMark("zhumengmrfz3", player.countMark("zhumengmrfz3"));
      player.unmarkSkill("zhumengmrfz2");
    }
  },
  "zhumengmrfz2": {
    trigger: {
      global: "roundStart"
    },
    intro: {
      content: function(storage) {
        return get.translation(storage) + "牌";
      }
    },
    audio: 2,
    async content(event, trigger, player) {
      const result = await player.judge().forResult();
      if (!result.card) return;
      const card = result.card;
      player.markSkill("zhumengmrfz2");
      if (get.type(card) !== "delay") {
        player.storage.zhumengmrfz2 = get.type(card);
      } else {
        player.storage.zhumengmrfz2 = "trick";
      }
      player.addMark("zhumengmrfz3", get.number(card));
      player.logSkill("zhumengmrfz");
    }
  },
  "zhumengmrfz3": {
    marktext: "梦",
    intro: {
      name: "梦",
      content: "萨卡兹的命运应该掌握在自己手中"
    },
    audio: "zhumengmrfz",
    trigger: {
      player: ["useCard", "respond"]
    },
    filter: function(event, player) {
      if (player.storage.zhumengmrfz2 == "trick" && get.type(event.card) == "delay") return true;
      return get.type(event.card) == player.storage.zhumengmrfz2 && player.countMark("zhumengmrfz3") > 0;
    },
    frequent: true,
    prompt: "是否摸一张牌",
    async content(event, trigger, player) {
      player.removeMark("zhumengmrfz3");
      player.draw();
    },
    group: ["zhumengmrfz2", "zhumengmrfz"]
  }
});
translate({
  "wmrfz": "W",
  "fukemrfz": "伏客",
  "fukemrfz_info": "当你不因【伏客】获得牌时，你可以选择至多X名其他角色并弃置等量的牌，然后获得这些角色各一张牌。（X=此次获得的牌的数量）",
  "zhumengmrfz": "筑梦",
  "zhumengmrfz_info": "",
  "zhumengmrfz2": "筑梦",
  "zhumengmrfz2_info": "",
  "zhumengmrfz3": "筑梦",
  "zhumengmrfz3_info": "每轮开始时，你可以进行判定，然后当你本轮前X次使用或打出与判定牌类别一致的牌时，你可以摸一张牌。（X=判定牌的点数）"
});
characterIntro("wmrfz", "萨卡兹佣兵头目，W。曾参与卡兹戴尔漫长的内战，其小队以残暴而高效的作战手段闻名。在切尔诺伯格事件中与罗德岛发生冲突，后因为某些原因叛出整合运动，在凯尔希医生亲自进行了充分交涉后，与罗德岛签订战略合作条款。");
//# sourceMappingURL=wmrfz.js.map
