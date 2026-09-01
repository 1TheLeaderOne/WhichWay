import { get, game } from "noname";
import { card as card$1, cardSkill, cardTranslate } from "../hooks.js";
card$1("jianzhumrfz", {
  image: `ext:WhichWay/image/card/jianzhumrfz.jpg`,
  type: "equip",
  subtype: "equip1",
  destroy: true,
  derivation: "laiousimrfz",
  distance: {
    attackFrom: -3
  },
  skills: ["jianzhumrfz_skill"],
  ai: {
    basic: {
      equipValue: 8,
      value: (card2, player2, index, method) => {
        if (!player2.getCards("e").includes(card2) && !player2.canEquip(card2, true)) return 0.01;
        const info = get.info(card2), current = player2.getEquip(info.subtype), value = current && card2 != current && get.value(current, player2);
        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
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
    }
  },
  enable: true,
  selectTarget: -1,
  filterTarget: (card2, player2, target2) => player2 == target2 && target2.canEquip(card2, true),
  modTarget: true,
  allowMultiple: false,
  onLose: function() {
    if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
      card.destroyed = true;
      game.log(card, "被销毁了");
    }
  },
  content: function() {
    if (!card?.cards.some((card2) => {
      return get.position(card2, true) !== "o";
    })) {
      target.equip(card);
    }
  },
  toself: true
});
cardSkill("jianzhumrfz_skill", {
  trigger: {
    player: ["yingbian", "damageEnd"]
  },
  equipSkill: true,
  forced: true,
  firstDo: true,
  filter(event2, player2) {
    if (event2.name == "damage") return true;
    return player2.hasHistory("lose", (evt) => {
      return evt.getParent() == event2 && Object.values(evt.gaintag_map).some((value) => value.join(" ").includes("shimomrfz_"));
    }) || get.is.yingbianConditional(event2.card);
  },
  content: () => {
    if (trigger.name == "damage") {
      const equip = player.getCards("e", function(card2) {
        return card2.name == "jianzhumrfz";
      });
      player.discard(equip);
      return;
    }
    trigger.forceYingbian = true;
  }
});
cardTranslate({
  jianzhumrfz: "剑助",
  jianzhumrfz_skill: "剑助",
  "jianzhumrfz_info": "锁定技，使用带有应变效果的牌可无视条件直接生效；当你受到伤害后或此牌离开了你的装备区时，你将【剑助】销毁之。"
});
//# sourceMappingURL=jianzhumrfz.js.map
