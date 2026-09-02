import { game, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("paxinghaomrfz", {
  pack: "specialSJZX",
  sex: "male",
  group: "weimrfz",
  hp: 1,
  skills: ["yinqingmrfz", "jushoumrfz"],
  isAiForbidden: true
});
skill({
  "yinqingmrfz": {
    mod: {
      maxHandcard: function(player, num) {
        return num + 2;
      },
      attackRange: function(player, num) {
        return num += 2;
      }
    },
    audio: 2,
    trigger: { player: ["phaseJudgeBefore", "phaseDrawBegin2"] },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name === "name") trigger.cancel();
      else trigger.num += 2;
    },
    ai: {
      threaten: 1.5,
      effect: {
        target: function(card, player, target, current) {
          if (get.type(card) == "delay")
            return "zeroplayertarget";
        }
      }
    }
  },
  "jushoumrfz": {
    audio: 2,
    usable: 1,
    trigger: { source: "damageBegin" },
    filter: function(event, player) {
      return event.player != player && event.player.node.hp.dataset.condition == "high";
    },
    prompt(event, player) {
      let num = Math.floor(event.player.maxHp / 3);
      return `【巨兽】:是否令${get.translation(event.player)}将体力调整至${num}?`;
    },
    check(event, player) {
      return get.attitude2(event.player) < 0;
    },
    async content(event, trigger, player) {
      let num = Math.floor(trigger.player.maxHp / 3);
      let draw = trigger.player.hp - num;
      trigger.player.hp = num;
      trigger.player.$update();
      game.log(trigger.player, "的体力被调整至", num);
      player.draw(draw);
    },
    ai: {
      threaten: 1.2
    }
  }
});
translate({
  "paxinghaomrfz": "爬行号",
  "yinqingmrfz": "引擎",
  "yinqingmrfz_info": "锁定技，你的攻击距离、摸牌阶段额定摸牌数和手牌上限+2，你始终跳过判定阶段。",
  "jushoumrfz": "巨兽",
  "jushoumrfz_info": "每回合限一次，当你造成伤害时，若其当前勾玉为绿色，你令其将体力值调整至使得其当前勾玉变成红色的值，然后你摸等同于其调整的值张牌。"
});
characterTitle("paxinghaomrfz", "<font color=#00868B>战争巨兽</font>");
characterIntro("paxinghaomrfz", "由白铁制作的钢铁巨兽‘爬行者’");
