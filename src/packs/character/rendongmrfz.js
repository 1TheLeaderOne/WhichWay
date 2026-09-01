import { get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("rendongmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "xumrfz",
  hp: 4,
  skills: ["yinhumrfz", "zhuixiongmrfz"]
});
skill({
  "yinhumrfz": {
    mod: {
      ignoredHandcard: function(card, player) {
        if (card.hasGaintag("yinhumrfz") && get.name(card) === "sha") {
          return true;
        }
      },
      cardDiscardable: function(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("yinhumrfz") && get.name(card) === "sha") return false;
      }
    },
    audio: 2,
    direct: true,
    forced: true,
    intro: {
      content: "连续#个回合没有造成伤害"
    },
    trigger: {
      player: ["phaseZhunbeiBegin", "phaseEnd"]
    },
    filter(event, player) {
      return event.name === "phase" ? true : player.countMark("yinhumrfz") + 1 > 0;
    },
    async content(event, trigger, player) {
      if (trigger.name === "phase") {
        if (player.getHistory("sourceDamage").length < 1) player.addMark("yinhumrfz", 1, false);
        else player.removeMark("yinhumrfz", player.countMark("yinhumrfz"), false);
      } else {
        player.logSkill("yinhumrfz");
        let num = player.countMark("yinhumrfz") + 1;
        switch (num) {
          case 3:
            player.addTempSkill("yinhumrfz_addcount", { player: "phaseZhunbeiBegin" });
          case 2:
            player.addTempSkill("reweimu", { player: "phaseZhunbeiBegin" });
          case 1:
            const result = await player.draw(num).forResult();
            if (result.cards) {
              for (let card of result.cards) {
                if (get.name(card) === "sha") card.addGaintag("yinhumrfz");
              }
            }
            break;
        }
      }
    },
    subSkill: {
      addcount: {
        charlotte: true
      }
    }
  },
  "zhuixiongmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      let count = Object.keys(player.getStat("skill")).includes("zhuixiongmrfz") ? player.getStat("skill").zhuixiongmrfz : 0;
      if (count > 0 && !player.hasSkill("yinhumrfz_addcount")) return false;
      return game.hasPlayer((current) => !!player.canUse("juedou", current) && player.inRange(current));
    },
    filterTarget(card, target, player) {
      return target != player && !!player.canUse("juedou", target) && player.inRange(target);
    },
    async content(event, trigger, player) {
      player.useCard({ name: "juedou", zhuixiongmrfz: true }, true, event.targets[0]);
    },
    group: ["zhuixiongmrfz_nowuxie", "zhuixiongmrfz_damage"],
    subSkill: {
      nowuxie: {
        audio: false,
        trigger: {
          player: "useCard"
        },
        silent: true,
        charlotte: true,
        filter: function(event) {
          return event.card && event.card.zhuixiongmrfz;
        },
        async content(event, trigger, player) {
          trigger.nowuxie = true;
        }
      },
      damage: {
        audio: false,
        silent: true,
        charlotte: true,
        trigger: { global: "damageBegin3" },
        filter(event, player) {
          let evt = event.getParent();
          return event.card && event.card.zhuixiongmrfz && evt && [...evt.targetCards, ...evt.playerCards].length > 0;
        },
        async content(event, trigger, player) {
          let evt = trigger.getParent();
          if (!evt) return;
          let num = [...evt.targetCards, ...evt.playerCards].length;
          trigger.num += num;
        }
      }
    },
    ai: {
      order: 6,
      result: {
        target(player, target) {
          if (get.attitude2(target) > 0) return 0;
          return target.countCards("h", "sha") > player.countCards("h", "sha") ? 0 : -1;
        }
      }
    }
  }
});
translate({
  "rendongmrfz": "忍冬",
  "yinhumrfz": "隐狐",
  "yinhumrfz_info": "锁定技，准备阶段，你执行下述所有序号不大于X的选项：<br>1.摸X张牌且这些牌中的【杀】不计入手牌上限；<br>2.获得【帷幕】直到下个准备阶段；<br>3.【追凶】改为出牌阶段限两次直到下个准备阶段。<br/>（X = 你连续没有造成伤害的回合数 + 1）",
  "zhuixiongmrfz": "追凶",
  "zhuixiongmrfz_info": "出牌阶段限一次，你可以视为对一名在你攻击范围内的其他角色使用一张不可被【无懈可击】响应的【决斗】，此决斗的造成的伤害+Y（Y=因此决斗而打出的【杀】）。"
});
characterTitle("rendongmrfz", "<font color='#d2691e'>完美主义杀手</font>");
characterIntro("rendongmrfz", "忍冬，本名英格丽，铃兰干员的母亲，曾为叙拉古灰厅十二家族之一——威尼斯家族的核心成员，多执行暗杀任务，擅长歼灭战与突袭战，后因故从家族脱离。现以罗德岛驻舰干员身份活动。");
//# sourceMappingURL=rendongmrfz.js.map
