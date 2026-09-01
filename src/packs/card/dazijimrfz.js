import { get } from "noname";
import { card, cardSkill, cardTranslate } from "../hooks.js";
card("dazijimrfz", {
  image: `ext:WhichWay/image/card/dazijimrfz.jpg`,
  type: "equip",
  subtype: "equip1",
  destroy: true,
  derivation: "hongxuemrfz",
  distance: {
    attackFrom: -2
  },
  ai: {
    basic: {
      equipValue: 5,
      order: function(card2, player2) {
        if (player2 && player2.hasSkillTag("reverseEquip")) {
          return 8.5 - get.equipValue(card2, player2) / 20;
        } else {
          return 8 + get.equipValue(card2, player2) / 20;
        }
      },
      useful: 2,
      value: function(card2, player2, index, method) {
        if (player2.isDisabled(get.subtype(card2))) return 0.01;
        var value = 0;
        var info = get.info(card2);
        var current = player2.getEquip(info.subtype);
        if (current && card2 != current) {
          value = get.value(current, player2);
        }
        var equipValue = info.ai.equipValue;
        if (equipValue == void 0) {
          equipValue = info.ai.basic.equipValue;
        }
        if (typeof equipValue == "function") {
          if (method == "raw") return equipValue(card2, player2);
          if (method == "raw2") return equipValue(card2, player2) - value;
          return Math.max(0.1, equipValue(card2, player2) - value);
        }
        if (typeof equipValue != "number") equipValue = 0;
        if (method == "raw") return equipValue;
        if (method == "raw2") return equipValue - value;
        return Math.max(0.1, equipValue - value);
      }
    },
    result: {
      target: function(player2, target2, card2) {
        return get.equipResult(player2, target2, card2.name);
      }
    }
  },
  skills: ["dazijimrfzskill"],
  enable: true,
  selectTarget: -1,
  filterTarget: function(card2, player2, target2) {
    return target2 == player2;
  },
  modTarget: true,
  allowMultiple: false,
  content: function() {
    if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
  },
  toself: true,
  fullimage: true
});
cardSkill("dazijimrfzskill", {
  trigger: {
    player: "useCard"
  },
  direct: true,
  filter: function(event, player2) {
    if (!player2.hasSkill("ruibimrfz")) return false;
    if (event.dazijimrfzskill_buff || !event.targets.length || player2.hasSkill("dazijimrfz_buff")) return false;
    return event.card.name == "sha";
  },
  content: function() {
    "step 0";
    player.addTempSkill("dazijimrfzskill_buff", "phaseUseAfter");
    trigger.dazijimrfzskill_buff = player;
  },
  subSkill: {
    buff: {
      trigger: {
        global: "useCardToTargeted"
      },
      charlotte: true,
      popup: false,
      lastDo: true,
      filter: function(event, player2) {
        return event.parent.dazijimrfzskill_buff == player2 && event.targets.length == event.parent.triggeredTargets4.length;
      },
      content: function() {
        trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
        trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
      },
      sub: true
    }
  }
});
cardTranslate({
  dazijimrfz: "打字机",
  "dazijimrfz_info": "当你使用【杀】指定目标时，你可以令此【杀】结算两次。（此装备离开你的装备区时，销毁之）"
});
//# sourceMappingURL=dazijimrfz.js.map
