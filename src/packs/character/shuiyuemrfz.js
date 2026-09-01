import { get, _status, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("shuiyuemrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "dongmrfz",
  hp: 3,
  skills: ["liqunmrfz", "chuangshangmrfz", "jinghuamrfz"]
});
skill({
  "liqunmrfz": {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter: function(event, player) {
      if (event.player == player) return false;
      return event.cards.length < 2 || get.distance(player, event.target) < 2;
    },
    usable: 1,
    check: function(event, player) {
      if (event.card.name == "wugu" || event.card.name == "tao") return false;
      if (get.attitude(player, event.target) > 2 && event.card.name == "sha") return false;
      return true;
    },
    async content(event, trigger, player) {
      if (trigger.parent) trigger.parent.excluded.add(player);
    }
  },
  "chuangshangmrfz": {
    audio: 2,
    trigger: { source: "damageEnd" },
    filter: function(event, player) {
      if (event.getParent()?.name == "chuangshangmrfz") return false;
      if (event.player == player) return false;
      return event.player.isMinHp() || game.hasPlayer(function(current) {
        return current != player && player.inRange(current) && current.maxHp / 2 >= current.hp;
      });
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      let result;
      const str1 = "摸两张牌";
      const str2 = "对" + get.translation(target) + "造成一点伤害";
      if (target.isMinHp() && game.hasPlayer((current) => {
        return current !== player && player.inRange(current) && current.maxHp / 2 >= current.hp;
      })) {
        result = await player.chooseControl(str1, str2).set("prompt", get.prompt("chuangshangmrfz")).set("prompt2", "请选择一项").set("ai", () => {
          const aiPlayer = _status.event.player;
          if (aiPlayer.hp < 2 && aiPlayer.countCards("h") < 3) return 0;
          return 1;
        }).forResult();
      } else {
        await player.draw();
        return;
      }
      if (result.index === 0) {
        await player.draw(2);
      } else {
        await target.damage();
      }
    }
  },
  "jinghuamrfz": {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    usable: 1,
    filter: function(event, player) {
      if (event.getParent()?.triggeredTargets3?.length > 1) return false;
      if (event.card.name != "sha") return false;
      return game.hasPlayer(function(current) {
        return current != player && current != event.target;
      });
    },
    check: function(event, player) {
      if (player.hp < 3) return false;
      if (!game.hasPlayer(function(current) {
        return current != event.target && current != player && current != event.player && get.attitude(player, current) < 2;
      }))
        return false;
      return true;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(
        true,
        [1, 2],
        get.prompt("jinghuamrfz"),
        "为" + get.translation(trigger.card) + "增加至多两个目标",
        (card, player2, target) => {
          return !_status.event.sourcex.includes(target) && player2.canUse(_status.event.card, target, false);
        }
      ).set("sourcex", trigger.targets).set("ai", (target) => {
        const aiPlayer = _status.event.player;
        return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
      }).set("card", trigger.card).setHiddenSkill(event.name).forResult();
      if (result.targets) {
        player.addTempSkill("jinghuamrfz2", {
          player: "useCardAfter"
        });
        for (const target of result.targets) {
          trigger.targets.push(target);
          player.line(target);
        }
      }
    }
  }
});
translate({
  "shuiyuemrfz": "水月",
  "liqunmrfz": "离群",
  "liqunmrfz_info": "每回合限一次，当你成为其他角色使用牌的目标时，若此牌目标为1或使用者与你距离大于1，取消之。",
  "chuangshangmrfz": "创伤",
  "chuangshangmrfz_info": "当你不因【创伤】而对其他角色造成伤害后，每满足下列一项你便可以摸一张牌，若满足所有选项，你可以放弃摸牌，然后对受伤角色造成一点伤害：①目标是场上体力值最少的角色；②你的攻击范围内有生命值不大于一半的其他角色。",
  "jinghuamrfz": "镜花",
  "jinghuamrfz_info": "每回合限一次，当你使用【杀】时，你可以额外指定至多两个目标（无距离限制），若你造成的伤害不大于2，你流失一点体力。"
});
characterIntro("shuiyuemrfz", "水月于玻利瓦尔的多索雷斯城与我们的部分干员有所接触，并随行至本舰，经相关干员初步问询考察后批准其暂时留舰。</br>其学习能力较为优秀，现阶段已经能协助完成相当一部分的文职工作内容，或可考虑往干员的方向培养。经调查与评估后批准其长期留舰。");
//# sourceMappingURL=shuiyuemrfz.js.map
