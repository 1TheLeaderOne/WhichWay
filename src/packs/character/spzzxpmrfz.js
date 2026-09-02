import { get, _status, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("spzzxpmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "luomrfz",
  hp: 3,
  skills: ["yuyunmrfz", "shuiqiangmrfz", "jianfengmrfz"]
});
skill({
  "yuyunmrfz": {
    audio: 2,
    trigger: { player: "phaseEnd" },
    direct: true,
    async content(event, trigger, player) {
      let result;
      const num = player.getCardUsable("sha");
      const history = player.getHistory("useCard");
      for (let i = 0; i < history.length; i++) {
        if (history[i].card?.name === "sha") {
          player.removeMark("yuyunmrfz", player.countMark("yuyunmrfz"));
          return;
        }
      }
      result = await player.chooseBool("是否发动【余韵】？").forResult();
      if (result.bool) {
        await player.draw(Math.min(num, 3));
        player.logSkill("yuyunmrfz");
      } else {
        return;
      }
      player.removeMark("yuyunmrfz", player.countMark("yuyunmrfz"));
      player.addMark("yuyunmrfz", Math.min(num, 2));
    },
    mod: {
      cardUsable: function(card, player, num) {
        if (card.name == "sha") return num += player.countMark("yuyunmrfz");
      }
    }
  },
  "shuiqiangmrfz": {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter: function(event, player) {
      if (event.getParent()?.triggeredTargets3.length > 1) return false;
      if (event.card.name != "sha") return false;
      return game.hasPlayer((current) => {
        return !event.targets.includes(current) && !!player.canUse(event.card, current) && player.inRange(current);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(
        [1, Infinity],
        get.prompt("shuiqiangmrfz"),
        "为" + get.translation(trigger.card) + "增加任意个目标",
        (card, player2, target) => {
          return !_status.event.sourcex.includes(target) && player2.inRange(target) && player2.canUse(_status.event.card, target);
        }
      ).set("sourcex", trigger.targets).set("ai", (target) => {
        const aiPlayer = _status.event.player;
        return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
      }).set("card", trigger.card).setHiddenSkill(event.name).forResult();
      if (result.targets) {
        if (!event.isMine() && !event.isOnline()) {
          await game.delayx();
        }
        for (const target of result.targets) {
          trigger.targets.push(target);
          player.line(target);
        }
        player.logSkill("shuiqiangmrfz");
      } else {
        return;
      }
    }
  },
  "jianfengmrfz": {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter: function(event, player) {
      return event.card.name == "sha";
    },
    frequent: true,
    async content(event, trigger, player) {
      let result;
      const next = player.judge((card) => {
        const suit = get.suit(card);
        if (suit === "spade") return -4;
        return 0;
      });
      next.judge2 = (result2) => {
        return result2.bool === false;
      };
      result = await next.forResult();
      if (result.suit === "spade") {
        const list = [];
        for (const card of trigger.cards) {
          if (get.position(card, true) === "o") {
            list.push(card);
          }
        }
        if (trigger.addCount !== false) {
          trigger.addCount = false;
          trigger.player.getStat().card.sha--;
        }
        await player.gain(list, "gain2");
      }
    }
  }
});
translate({
  "spzzxpmrfz": "假日威龙陈",
  "spzzxpmrfz_prefix": "假日威龙",
  "yuyunmrfz": "余韵",
  "yuyunmrfz_info": "你的回合结束时，若你本回合没有使用过【杀】，你可以摸X张牌然后下一回合使用【杀】的次数+X（最多为2）。（X=你本回合可以使用【杀】的次数，X最大为3）",
  "shuiqiangmrfz": "水枪",
  "shuiqiangmrfz_info": "当你使用【杀】指定目标后，你可以令你攻击范围内的任意不为此【杀】目标的其他角色都成为此【杀】的目标。",
  "jianfengmrfz": "俭风",
  "jianfengmrfz_info": "当你使用【杀】结算完成后，你可以进行判定，若为♠，你获得此杀且此杀不计入次数限制。"
});
characterIntro("spzzxpmrfz", "陈，前龙门高级警司，前龙门近卫局特别督察组组长，毕业于维多利亚皇家近卫学校，成绩优异，表现突出。在龙门近卫局供职期间，力主取缔龙门境内非法活动，对抗暴力犯罪和有组织犯罪，追缉武装逃犯与国际重犯等行动，并取得多项重大成果。</br>现辞去职务，正式成为罗德岛的一员。依本人意愿，任务多以外派为主，为各地外派干员提供有力支援以及现场指导。");
