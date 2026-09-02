import { get, game } from "noname";
import { card, cardSkill, cardTranslate } from "../hooks.js";
card("jianzhumrfz", {
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
      value: (card2, player, index, method) => {
        if (!player.getCards("e").includes(card2) && !player.canEquip(card2, true)) return 0.01;
        const info = get.info(card2), current = player.getEquip(info.subtype), value = current && card2 != current && get.value(current, player);
        let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
        if (typeof equipValue == "function") {
          if (method == "raw") return equipValue(card2, player);
          if (method == "raw2") return equipValue(card2, player) - value;
          return Math.max(0.1, equipValue(card2, player) - value);
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
  filterTarget: (card2, player, target) => player == target && target.canEquip(card2, true),
  modTarget: true,
  allowMultiple: false,
  onLose: async function(event, trigger, player) {
    const { cards } = event;
    const par2 = event.getParent(2);
    const par = event.getParent();
    if ((!par2 || par2.name != "swapEquip") && par && (par.type != "equip" || par.swapEquip)) {
      cards.forEach((card2) => {
        card2.fix();
        card2.remove();
        card2.destroyed = true;
        game.log(card2, "被销毁了");
      });
    }
  },
  content: async function(event, trigger, player) {
    const { card: card2, target } = event;
    if (!card2?.cards.some((card22) => {
      return get.position(card22, true) !== "o";
    })) {
      target.equip(card2);
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
  filter(event, player) {
    if (event.name == "damage") return true;
    return player.hasHistory("lose", (evt) => {
      return evt.getParent() == event && Object.values(evt.gaintag_map).some((value) => value.join(" ").includes("shimomrfz_"));
    }) || get.is.yingbianConditional(event.card);
  },
  content: async function(event, trigger, player) {
    if (trigger.name == "damage") {
      const equip = player.getCards("e", function(card2) {
        return card2.name == "jianzhumrfz";
      });
      player.discard({ cards: equip });
      return;
    }
    trigger.forceYingbian = true;
  }
});
cardTranslate({
  jianzhumrfz: "剑助",
  jianzhumrfz_skill: "剑助",
  jianzhumrfz_info: "锁定技，使用带有应变效果的牌可无视条件直接生效；当你受到伤害后或此牌离开了你的装备区时，你将【剑助】销毁之。"
});
