import { lib, _status, ui, get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("jingzhemrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "yanmrfz",
  hp: 3,
  skills: ["chunleimrfz", "zheqimrfz"]
});
skill({
  "chunleimrfz": {
    audio: 2,
    trigger: { global: "phaseZhunbeiBegin" },
    direct: true,
    filter(event, player) {
      return player.countCards("he", { color: "black" }) > 0;
    },
    async content(event, trigger, player) {
      const { cards } = await player.chooseCard().set("prompt", `【春雷】:你可以弃置一张黑色的牌，对${get.translation(trigger.player)}造成一点雷属性的伤害`).set("filterCard", (card) => get.color(card) == "black").set("position", "he").set("ai", (card) => {
        var player2 = _status.event.player;
        if (get.damageEffect(_status.event.target, player2, player2, "thunder") > 0) return 6 - get.value(card);
        return 0;
      }).set("target", trigger.player).forResult();
      if (!cards) return;
      player.discard(cards);
      trigger.player.damage("thunder");
      player.logSkill("chunleimrfz", trigger.player);
    },
    ai: {
      expose: 0.1,
      threaten: 1.3
    }
  },
  "zheqimrfz": {
    audio: 2,
    forced: true,
    trigger: { global: "damageEnd" },
    usable: 1,
    filter(event, player) {
      return event.nature && event.nature == "thunder";
    },
    async content(event, trigger, player) {
      var target = _status.currentPhase;
      if (!target) return;
      target.addTempSkill("zheqimrfz_eff1");
      player.addTempSkill("zheqimrfz_eff2", { global: "phaseBegin" });
    },
    subSkill: {
      eff1: {
        mark: true,
        intro: {
          content: "<i>正月启蛰，言发蛰也。万物出乎震，震为雷，故曰惊蛰。是蛰虫惊而出走矣。<br>————《大戴礼记·夏小正》</i>"
        },
        mod: {
          cardUsable(card) {
            if (get.itemtype(card) == "card") return Infinity;
          }
        },
        forced: true,
        charlotte: true,
        trigger: { player: "useCard" },
        filter(event, player) {
          return event.card && get.type(event.card) != "equip" && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          player.chooseToDiscard(true, "【蛰起】:请选择弃置一张手牌").set("ai", (card) => 6 - get.value(card));
        }
      },
      eff2: {
        audio: "zheqimrfz",
        forced: true,
        charlotte: true,
        trigger: { global: "phaseEnd" },
        getDiscard: function(event, player) {
          var history = event.player.getHistory("lose", function(evt) {
            return evt && evt.type == "discard";
          }), cards = [];
          if (history.length == 0) return cards;
          for (var i = 0; i < history.length; i++) {
            var cardsList = history[i].cards;
            for (var j = 0; j < cardsList.length; j++) {
              if (get.position(cardsList[j], true) != "d") continue;
              cards.push(cardsList[j]);
            }
          }
          return cards;
        },
        filter(event, player) {
          var cards = lib.skill.zheqimrfz_eff2.getDiscard(event, player);
          return cards.length > 0;
        },
        async content(event, trigger, player) {
          let cards = lib.skill.zheqimrfz_eff2.getDiscard(trigger, player);
          const { links } = await player.chooseButton(["【蛰起】:请选择你要获得的牌", cards]).set("forced", true).set("filterButton", (button) => {
            var player2 = _status.event.player;
            return !ui.selected.buttons.some((i) => get.type2(i, player2) == get.type2(button, player2));
          }).set("selectButton", [1, Infinity]).set("ai", (button) => {
            return _status.event.player.getUseValue(button.link);
          }).forResult();
          if (!links) return;
          player.gain(links, "gain2");
        }
      }
    },
    ai: {
      threaten: 1.3
    }
  }
});
translate({
  "jingzhemrfz": "惊蛰",
  "chunleimrfz": "春雷",
  "chunleimrfz_info": "每名角色的准备阶段，你可以弃置一张黑色的牌，然后你对其造成一点雷电伤害。",
  "zheqimrfz": "蛰起",
  "zheqimrfz_info": "锁定技，每回合限一次，当有角色受到雷属性伤害后，当前回合角色获得下列效果直到回合结束：1.使用牌无次数限制；2.使用或打出一张非装备牌时，其须弃置一张手牌。然后此回合结束后，你选择获得其本回合因弃置而进入弃牌堆的牌（每种类型限一张）。"
});
characterIntro("jingzhemrfz", "惊蛰，炎国大理寺所属官员，与罗德岛签署搜查协议后暂居于罗德岛。身具久经训练的战斗技巧与独特的源石技艺，在歼灭战、阵地战中表现优异，但因其身份特殊、动机暧昧，建议在交流中采用被动不合作态度。");
//# sourceMappingURL=jingzhemrfz.js.map
