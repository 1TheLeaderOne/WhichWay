import { get, game, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("weinamrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 4,
  skills: ["fensuimrfz", "yuechuimrfz"]
});
skill({
  "yuechuimrfz": {
    init(player, skill2) {
      player.addMark(skill2, 1, false);
    },
    audio: 2,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      return event.card && event.card.name == "sha";
    },
    frequent: true,
    prompt2(event, player) {
      let num = player.countMark("yuechuimrfz") > 0 ? player.countMark("yuechuimrfz") : 1;
      return `是否摸${num}张牌？`;
    },
    async content(event, trigger, player) {
      await player.draw(player.countMark("yuechuimrfz") > 0 ? player.countMark("yuechuimrfz") : 1);
      if (player.countMark("yuechuimrfz") < 3 && player.countCards("he", { type: "equip" }) > 0) {
        const { cards } = await player.chooseToDiscard("he", (card) => get.type(card) == "equip").set(
          "prompt",
          `【跃锤】:你可以弃置一张装备牌令‘跃锤’中[]内的数字+1（当前：${player.countMark("yuechuimrfz") > 0 ? player.countMark("yuechuimrfz") : 1}）`
        ).set("ai", (card) => {
          return get.value(card) < 8;
        }).forResult();
        if (cards) player.addMark("yuechuimrfz", 1, false);
      }
      let targets = trigger.targets, targetx = game.players.slice().filter((i) => {
        for (var j of targets) {
          if (get.distance(j, i) == 1 && !targets.includes(i)) return true;
        }
        return false;
      });
      if (targetx) {
        const { targets: targetscs } = await player.chooseTarget().set("prompt", `【跃锤】:你可以对${get.translation(targetx)}其中一名角色造成一点伤害`).set("filterTarget", (card, player2, target) => {
          return _status.event.targets.includes(target);
        }).set("ai", (target) => {
          return get.damageEffect(target, get.event().player, get.event().player) > 0;
        }).set("targets", targetx).forResult();
        if (targetscs) {
          targetscs[0].damage(player);
        }
      }
    }
  },
  "fensuimrfz": {
    audio: 2,
    trigger: { global: "dying" },
    forced: true,
    filter: function(event, player) {
      return event.player != player && get.distance(player, event.player) <= 1;
    },
    async content(event, trigger, player) {
      player.draw();
      player.line(trigger.player);
    }
  }
});
translate({
  "weinamrfz": "推进之王",
  "yuechuimrfz": "跃锤",
  "yuechuimrfz_info": "当你使用【杀】后，你可以摸[ 1 ]张牌，然后你可以选择依次执行下列任意个效果:<br>1.弃置一张装备牌，令[]中的数字+1（至多为3）;<br>2.对与任意目标角色距离为1的一名其他角色造成一点伤害。",
  "fensuimrfz": "粉碎",
  "fensuimrfz_info": "锁定技，当与你距离不大于1的其他角色进入濒死状态时，你摸一张牌。"
});
characterIntro("weinamrfz", "推进之王，本名维娜，维多利亚公民，大部分履历缺失。存在数项未被证实的指控记录。在歼灭战、攻坚战、对抗硬目标等任务中表现出色。于多个测试中皆获得优异成绩，遂获准加入罗德岛。现作为先锋人员，于罗德岛某作战小队担任队长。");
//# sourceMappingURL=weinamrfz.js.map
