import { get, _status, game } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("jicimrfz", {
  sex: "male",
  group: "yimrfz",
  hp: 4,
  skills: ["jihumrfz", "re_jianshumrfz"]
});
skill({
  "jihumrfz": {
    audio: 2,
    intro: {
      content: "荆棘护身"
    },
    trigger: { player: "phaseZhunbeiBegin" },
    check: function(event, player) {
      if (player.countCards("h", function(card) {
        return get.tag(card, "damage") || get.type(card) == "trick" && !get.tag(card, "damage") || get.type(card) == "delay";
      }) > 1)
        return false;
      return true;
    },
    async content(event, trigger, player) {
      if (!player.hasMark("jihumrfz")) player.addMark("jihumrfz", 1, false);
      player.addTempSkill("zishou2");
    },
    group: ["jihumrfz_clear", "jihumrfz_buff"],
    subSkill: {
      clear: {
        silent: true,
        charlotte: true,
        trigger: { player: "phaseBegin" },
        filter: function(event, player) {
          return player.hasMark("jihumrfz");
        },
        async content(event, trigger, player) {
          player.removeMark("jihumrfz", 1, false);
        }
      },
      buff: {
        trigger: { target: "useCardToTargeted" },
        usable: 1,
        filter: function(event, player) {
          if (get.type(event.card) == "delay" || get.type(event.card) == "equip") return false;
          if (!player.hasMark("jihumrfz")) return false;
          return event.player != player && (player.canUse(event.card, event.player, false) || game.hasPlayer(function(current) {
            return (
              //@ts-ignore
              current != player && get.distance(player, current) <= 1 && !!player.canUse(event.card, current, true)
            );
          }));
        },
        direct: true,
        async content(event, trigger, player) {
          let result;
          result = await player.chooseTarget((card, player2, target) => {
            return player2.canUse(trigger.card, target, false) && target !== player2 && (get.distance(player2, target) <= 1 || target === _status.event.TriPlayer);
          }).set("TriPlayer", trigger.player).set("prompt", get.prompt("jihumrfz")).set("prompt2", "【棘护】:你可以使用一张【" + get.translation(trigger.card.name) + "】").set("ai", (target) => {
            return -get.attitude(player, target);
          }).forResult();
          if (result.targets) {
            await player.useCard({ name: trigger.card.name, isCard: true }, result.targets[0], false);
            player.logSkill("jihumrfz");
          }
        }
      }
    }
  },
  "re_jianshumrfz": {
    audio: "jianshumrfz",
    derivation: ["re_chaoshengmrfz"],
    intro: {
      content: function(event, player) {
        var num = player.countMark("re_jianshumrfz");
        if (num == 20) return "出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
        else if (num >= 10)
          return "已累计指定" + num + "次</br>出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
        return "已累计指定" + num + "次";
      }
    },
    direct: true,
    trigger: { player: "useCardToTargeted" },
    filter: function(event, player) {
      return player.countMark("re_jianshumrfz") < 20;
    },
    async content(event, trigger, player) {
      await player.addMark("re_jianshumrfz", 1, false);
      const num = player.countMark("re_jianshumrfz");
      if (num % 10 == 0) {
        player.logSkill("jianshumrfz");
        if (num == 10) {
          player.addSkill("re_jianshumrfz_usesha");
          player.addMark("re_jianshumrfz_time", 1, false);
          player.addMark("re_jianshumrfz_draw", 1, false);
          player.addMark("re_jianshumrfz_range", 1, false);
        }
        if (num == 20) {
          player.addMark("re_jianshumrfz_time", 1, false);
          player.addMark("re_jianshumrfz_range", 1, false);
          player.removeSkill("jihumrfz");
          player.addSkill("re_chaoshengmrfz");
        }
      }
    },
    group: ["re_jianshumrfz_time", "re_jianshumrfz_range", "re_jianshumrfz_draw"],
    subSkill: {
      time: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable: function(card, player, num) {
            if (card.name == "sha") return num + player.countMark("re_jianshumrfz_time");
          }
        }
      },
      range: {
        charlotte: true,
        onremove: true,
        mod: {
          attackRange: function(player, num) {
            return num + player.countMark("re_jianshumrfz_range");
          }
        }
      },
      draw: {
        silent: true,
        direct: true,
        charlotte: true,
        trigger: { player: "phaseDrawBegin2" },
        filter: function(event, player) {
          return player.hasMark("re_jianshumrfz_draw");
        },
        async content(event, trigger, player) {
          trigger.num++;
          player.logSkill("jianshumrfz");
        }
      },
      usesha: {
        direct: true,
        trigger: { player: "phaseUseBegin" },
        async content(event, trigger, player) {
          const result = await player.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function(card, player2, target) {
            return target != player2 && player2.inRange(target);
          }).set("ai", (target) => -get.attitude(player, target)).forResult();
          if (result.targets) {
            const target = result.targets[0];
            player.useCard({ name: "sha" }, true, false, target);
            player.logSkill("jianshumrfz");
          }
        }
      }
    }
  },
  "re_chaoshengmrfz": {
    audio: "chaoshengmrfz",
    trigger: { player: "phaseEnd" },
    filter: function(event, player) {
      return !player.getStat("damage");
    },
    frequent: true,
    async content(event, trigger, player) {
      player.draw(2);
      player.recover();
    }
  }
});
translate({
  "jicimrfz": "棘刺",
  "jihumrfz": "棘护",
  "jihumrfz_info": "准备阶段，你可以令本回合不能对其他角色使用牌，直到你下一个回合开始，你获得以下效果：每回合限一次，当你成为其他角色的基本或者非延时锦囊牌的目标后，你可以视为对该角色或与你距离为1的角色使用相同牌名的牌。",
  "re_jianshumrfz": "剑术",
  "re_jianshumrfz_info": "锁定技，每当你使用的牌指定的目标数累计达到10的整数倍时，你依次获得以下效果：①摸牌阶段摸牌数、【杀】的使用次数和攻击距离各+1，出牌阶段开始时，你可以视为使用一张【杀】（不计入次数）②【杀】的使用次数和攻击距离各+1，失去【棘护】并获得【潮声】。",
  "re_chaoshengmrfz": "潮声",
  "re_chaoshengmrfz_info": "结束阶段，若你本回合没有造成过伤害，你可以摸两张牌并恢复一点体力。"
});
characterIntro("jicimrfz", "精通剑术与药剂制作的罗德岛前线作战干员，棘刺。出身于伊比利亚腹地，于当地宗教局势动荡中离开家乡，在脱离伊比利亚地区后，受邀来到罗德岛。</br>以上关于伊比利亚境内局势的部分为棘刺自述，尚未完全经过考证。");
//# sourceMappingURL=index.js.map
