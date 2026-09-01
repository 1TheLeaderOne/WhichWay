import { get, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("kamimrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "samrfz",
  hp: 3,
  skills: ["dianlianmrfz", "shazumrfz", "leibaomrfz"]
});
skill({
  "shazumrfz": {
    marktext: "仇敌",
    intro: {
      name: "仇敌",
      content: "沙卒盯上你了"
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter: function(event, player) {
      return player.countCards("he") > 0;
    },
    filterTarget: function(card, player, target) {
      return target.countCards("he") > 0 && target != player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      result = await player.chooseCard("he", true).forResult();
      if (!result.cards) return;
      const cardp = result.cards[0];
      let next;
      if (target.countCards("e") > 0) {
        next = target.chooseCard("e", true);
      } else {
        next = target.chooseCard("h", true);
      }
      result = await next.forResult();
      if (!result.bool) {
        return;
      } else {
        if (!result.cards) return;
        const cardt = result.cards[0];
        player.swapHandcards(target, [cardp], [cardt]);
        const numt = target.countCards("h");
        const nump = player.countCards("h");
        if (numt === nump) {
          return;
        }
        if (numt > nump) {
          await player.draw();
        } else if (nump > numt) {
          await target.draw();
        }
      }
    },
    group: "shazumrfz_damage",
    subSkill: {
      damage: {
        audio: "shazumrfz",
        trigger: { player: "damageEnd" },
        filter: function(event, player) {
          return event.source != void 0 && !event.source.hasMark("shazumrfz") && event.source != player;
        },
        logTarget: "source",
        async content(event, trigger, player) {
          if (game.hasPlayer(function(current) {
            return current.hasMark("shazumrfz");
          })) {
            game.hasPlayer(function(current) {
              return current.removeMark("shazumrfz");
            });
            trigger.source.addMark("shazumrfz");
          } else trigger.source.addMark("shazumrfz");
        }
      }
    },
    ai: {
      threaten: 1.1,
      order: 8,
      result: {
        player: function(player, target) {
          if (get.attitude(player, target) > 0) return 1.5;
          return 0.5;
        },
        target: function(player, target) {
          if (get.attitude(player, target) < 2 && target.countCards("e") > 0 && target.countCards("h") > player.countCards("h"))
            return -1;
          return 0.5;
        }
      }
    }
  },
  "dianlianmrfz": {
    audio: 2,
    trigger: { source: "damageSource" },
    filter: function(event, player) {
      if (event.num <= 1) return false;
      return event.player != player && event.player.isAlive() && game.hasPlayer(function(current) {
        return current != event.player && get.distance(event.player, current) <= 1 && current != player;
      });
    },
    check: function(event, player) {
      if (game.hasPlayer(function(current) {
        return current != player && get.attitude(player, current) < 0 && current != event.player;
      }))
        return true;
      return false;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(
        true,
        "选择一名与" + get.translation(trigger.player) + "距离为 1 的角色并对其造成" + (trigger.num - 1) + "点伤害",
        (card, player2, target) => {
          const damaged = trigger.player;
          return get.distance(damaged, target) <= 1 && target !== damaged && target !== player2;
        }
      ).set("ai", (target) => {
        return -get.attitude(player, target);
      }).forResult();
      const num = trigger.num - 1;
      if (result.targets) {
        const target = result.targets[0];
        await target.damage("player", num);
      }
    },
    group: "dianlianmrfz_damage",
    subSkill: {
      damage: {
        audio: "dianlianmrfz",
        trigger: { source: "damageBegin3" },
        check: function(event, player) {
          return get.attitude(player, event.player) < 0;
        },
        filter: function(event, player) {
          return event.nature == "thunder" && !player.storage.dianlianmrfz;
        },
        prompt: "是否令此伤害+1",
        async content(event, trigger, player) {
          trigger.num++;
          player.storage.dianlianmrfz = true;
          player.addSkill("dianlianmrfz_remove");
        }
      },
      remove: {
        charlotte: true,
        direct: true,
        silent: true,
        trigger: { global: "roundStart" },
        async content(event, trigger, player) {
          player.storage.dianlianmrfz = false;
          player.removeSkill("dianlianmrfz_remove");
        }
      }
    }
  },
  "leibaomrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    selectTarget: 1,
    filterTarget: function(card, player, target) {
      if (target == player) return false;
      return !game.hasPlayer(function(current) {
        return current != player && current.hp > target.hp;
      }) || target.hasMark("shazumrfz");
    },
    filter: function(event, player) {
      return player.getCards("he", function(card) {
        return get.type(card) == "equip";
      }).length >= 2 || player.countCards("h", "shandian");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.chooseToDiscard("he", true, function(card, player2) {
        if (player2.getCards("he", function(card2) {
          return get.type(card2) == "equip";
        }).length >= 2)
          return get.type(card) == "equip" || card.name == "shandian";
        return card.name == "shandian";
      }).set("prompt", "请弃置一张【闪电】，或依次弃置两张装备牌。").forResult();
      if (result.cards && result.cards[0].name != "shandian") {
        await player.chooseToDiscard("he", true, function(card, player2) {
          return get.type(card) == "equip";
        }).set("prompt", "请弃置一张装备牌。");
        target.damage("player", 2);
      } else target.damage("player", 2, "thunder");
    },
    ai: {
      threaten: 1.2,
      order: 13,
      result: {
        target: -1
      }
    }
  }
});
translate({
  "kamimrfz": "异客",
  "shazumrfz": "沙卒",
  "shazumrfz_info": "①出牌阶段限一次，你可以选择一名有牌的其他角色，你与其同时选择自己的一张牌（其须优先选择装备区的牌）并交互之，然后手牌较少的角色摸一张牌。②当你受到其他角色造成的伤害时，你可以令其获得‘仇敌’标记（若场上有‘仇敌’标记则改为转移‘仇敌’标记至该角色）。",
  "dianlianmrfz": "电链",
  "dianlianmrfz_info": "当你对其他角色造成伤害后，你可以对与受伤角色距离为1的角色造成X点伤害。（X=此次伤害数-1）；每轮限一次，你造成雷属性伤害时，你可以令此伤害+1",
  "leibaomrfz": "雷暴",
  "leibaomrfz_info": "<span class=firetext>神将会降下神罚处罚冒犯神之人</span></br>出牌阶段限一次，你可以弃置[两张装备牌/一张【闪电】]，然后选择一名除你以外的角色中体力值最高或之一，或有‘仇敌’标记的其他角色并对其造成两点[伤害/雷电伤害]。"
});
characterIntro("kamimrfz", "<span class=firetext>客门，我以最谦卑的姿态恳求您借我一点点力量</span></br>哥伦比亚出身的干员异客，曾在十三岁时就以极其优异的成绩跳级毕业，随后被源石工程与应用学专家索恩教授相中提拔为研究助手，进入布莱恩创生科技的研究所学习。于近二十余年前随某项目深入萨尔贡，之后销声匿迹。之后以伊巴特地区黑市主要成员的身份与罗德岛接触，并在脱离黑市后，单纯以感染者身份来到罗德岛接受治疗，并以工程部干员的身份活跃在各项行动中。");
//# sourceMappingURL=kamimrfz.js.map
