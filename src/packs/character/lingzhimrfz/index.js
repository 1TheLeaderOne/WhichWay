import { get, game, _status } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("lingzhimrfz", {
  sex: "male",
  group: "xiemrfz",
  hp: 4,
  skills: ["siyongmrfz"]
});
skill({
  "siyongmrfz": {
    audio: 2,
    trigger: {
      player: "loseEnd"
    },
    filter: function(event, player) {
      if (event.getParent()?.name != "useCard" || player != _status.currentPhase) return false;
      var list = player.getStorage("siyongmrfz2");
      for (var i of event.cards) {
        if (!list.includes(get.suit(i, player))) return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      if (!player.storage.siyongmrfz2) player.storage.siyongmrfz2 = [];
      for (var i of trigger.cards) player.storage.siyongmrfz2.add(get.suit(i, player));
      player.storage.siyongmrfz2.sort();
      player.addTempSkill("siyongmrfz2");
      player.markSkill("siyongmrfz2");
      if (game.hasPlayer(function(current) {
        return current != player && current.countCards("he") > 0;
      })) {
        const result = await player.chooseTarget("请选择一名其他角色获得其一张牌", true, function(card, player2, target2) {
          return target2 != player2 && target2.countCards("he") > 0;
        }).set("ai", function(target2) {
          var att = get.attitude(player, target2);
          if (att >= 0) return 0;
          if (target2.countCards("he", function(card) {
            return get.value(card) > 5;
          }))
            return -att;
          return Math.random();
        }).forResult();
        if (result.targets) {
          var target = result.targets[0];
          player.gainPlayerCard(1, target, "he", true);
        }
      } else {
        player.draw();
      }
    },
    forced: true
  }
});
translate({
  "lingzhimrfz": "灵知",
  "siyongmrfz": "思涌",
  "siyongmrfz_info": "锁定技，出牌阶段，当你首次使用某种花色的牌时，你可以获得一名其他角色的一张牌（若除你以外的角色均没有牌，改为你摸一张牌）。"
});
characterIntro("lingzhimrfz", "灵知，前喀兰贸易首席技术执行官。通过喀兰贸易与罗德岛的特别协议，作为干员加入罗德岛。主导了喀兰贸易众多核心技术的开发以及工业设施的设计，同时在喀兰贸易时期就已对源石有相当深入的研究。现作为罗德岛主要研究室的一员，活跃于科研一线。");
//# sourceMappingURL=index.js.map
