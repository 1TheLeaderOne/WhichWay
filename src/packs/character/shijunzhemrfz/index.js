import { get, game, lib, _status, ui } from "noname";
import { whichWayUtil } from "../../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("shijunzhemrfz", {
  sex: "female",
  group: "xumrfz",
  hp: 4,
  skills: ["fengyanmrfz", "weimingmrfz"]
});
skill({
  "fengyanmrfz": {
    onremove(player2) {
      for (let i of game.players) {
        i.removeSkill("xingxingmrfz");
        i.unmarkSkill("xingxingmrfz");
      }
      game.broadcastAll(function() {
        whichWayUtil.setBgI();
      });
    },
    audio: 2,
    derivation: ["xingxingmrfz"],
    trigger: { player: "phaseUseBegin" },
    filter(event, player2) {
      return player2.countCards("he", (card) => get.type(card) != "basic") > 0;
    },
    async cost(event, trigger2, player2) {
      event.result = await player2.chooseCardTarget({
        prompt: "是否发动【烽烟】？",
        prompt2: "你可以弃置一张非基本牌并选择至多三名角色，令其获得【行刑】",
        filterCard(card) {
          return get.type(card) != "basic";
        },
        filterTarget: true,
        selectTarget: [1, 3],
        position: "he",
        ai1(card) {
          return 8 - get.value(card);
        },
        ai2(target) {
          let player3 = get.player();
          return get.attitude(player3, target) > 0;
        }
      }).forResult();
      event.result.cost_data = {
        cards: event.result.cards,
        targets: event.result.targets
      };
    },
    async content(event, trigger2, player2) {
      const { cards, targets } = event.cost_data;
      await player2.discard(cards);
      for (let target of targets) {
        target.addSkill("xingxingmrfz");
      }
      player2.addTempSkill("fengyanmrfz_expire", { player: "phaseUseBegin" });
      game.broadcastAll(function() {
        ui.background.setBackgroundImage("extension/WhichWay/image/skill/fengyanmrfz.jpg");
      });
    },
    subSkill: {
      expire: {
        charlotte: true,
        silent: true,
        forceDie: true,
        onremove(player2) {
          for (let i of game.players) {
            i.removeSkill("xingxingmrfz");
            i.unmarkSkill("xingxingmrfz");
          }
          game.broadcastAll(function() {
            whichWayUtil.setBgI();
          });
        }
      }
    }
  },
  "xingxingmrfz": {
    global: "xingxingmrfz_effect",
    audio: 2,
    direct: true,
    trigger: { global: "phaseEnd" },
    mark: true,
    intro: {
      content: "“我将杀死冠冕”"
    },
    filter(event, player2) {
      return event.player && event.player.isIn() && !event.player.hasSkill("xingxingmrfz");
    },
    async content(event, trigger2, player2) {
      player2.chooseToUse(
        function(card, player3, event2) {
          if (get.name(card) != "sha") return false;
          return lib.filter.filterCard.apply(this, arguments);
        },
        "【行刑】:是否对" + get.translation(trigger2.player) + "使用一张杀？"
      ).set("logSkill", "xingxingmrfz").set("complexSelect", true).set("filterTarget", function(card, player3, target) {
        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", trigger2.player);
    },
    subSkill: {
      effect: {
        audio: false,
        forced: true,
        trigger: { player: "damageBegin3" },
        filter(event, player2) {
          return !event.source || !event.source.hasSkill("xingxingmrfz");
        },
        async content(event, trigger2, player2) {
          player2.logSkill("xingxingmrfz");
          const { color } = await player2.judge(function(card) {
            var color2 = get.color(card);
            if (color2 == "black") return -4;
            return 0;
          }).forResult();
          if (color !== "black") trigger2.cancel();
        }
      }
    }
  },
  "weimingmrfz": {
    mod: {
      targetEnabled(card, player2, target) {
        if (!player2.getEquip(1) && get.tag(card, "damage") && get.type(card) === "trick") return false;
      }
    },
    audio: 2,
    forced: true,
    trigger: { player: "useCard" },
    filter(event, player2) {
      return event.card && (get.type(event.card) == "trick" || get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)) && game.hasPlayer(function(current) {
        return current != player2 && !current.getEquip(2);
      });
    },
    content() {
      trigger.directHit.addArray(
        game.filterPlayer(function(current) {
          return current != player && !current.getEquip(2);
        })
      );
    },
    group: ["weimingmrfz_get"],
    subSkill: {
      get: {
        audio: "weimingmrfz",
        forced: true,
        trigger: { source: "damageEnd" },
        filter(event, player2) {
          return event.player && event.player.isIn() && event.player.countCards("he") > 0 && !event.player.getEquip(3) && !event.player.getEquip(4);
        },
        async content(event, trigger2, player2) {
          const { cards } = await trigger2.player.chooseCard("he", true).set("prompt", `请交给${get.translation(player2)}一张牌`).set("ai", (card) => -get.value(card)).forResult();
          if (!cards) return;
          player2.gain(cards);
        }
      }
    }
  }
});
translate({
  "shijunzhemrfz": "弑君者",
  "fengyanmrfz": "烽烟",
  "fengyanmrfz_info": "出牌阶段开始时，你可以弃置一张非基本牌，并令至多3名角色获得【行刑】直到你的下个出牌阶段。",
  "xingxingmrfz": "行刑",
  "xingxingmrfz_info": "锁定技。①所有没有此技能的角色造成伤害时，进行判定，若不为黑色，此伤害取消之。②任意回合结束后，若当前回合角色没有此技能，你可以对其使用一张【杀】。",
  "weimingmrfz": "威名",
  "weimingmrfz_info": "锁定技，防具栏为空的角色不能响应你使用的牌；坐骑栏为空的角色受到你的伤害后须交给你一张牌；武器栏为空的角色使用伤害类锦囊牌不能指定你为目标。"
});
characterTitle("shijunzhemrfz", "<font color='#d2691e'>尘烟蔽目</font>");
characterIntro("shijunzhemrfz", "弑君者，柳德米拉·伊里尼奇娜，原整合运动干部，从事潜伏活动与突袭暗杀行动，擅长近身攻击及突破防御阵线进行奇袭，于切尔诺伯格-龙门事件之后脱离整合运动，1100年末主动与罗德岛接洽，现正在监督下接受矿石病治疗。");
//# sourceMappingURL=index.js.map
