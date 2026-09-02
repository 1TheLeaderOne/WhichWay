import { _status, get } from "noname";
import { card, cardSkill, cardTranslate } from "../hooks.js";
card("baitiemrfzcard3", {
  image: `ext:WhichWay/image/card/baitiemrfzcard3.jpg`,
  type: "equip",
  subtype: "equip5",
  skills: ["baitiemrfzcard3_skill"],
  ai: {
    basic: {
      equipValue: 7.8
    }
  }
});
cardSkill("baitiemrfzcard3_skill", {
  enable: "phaseUse",
  filter: function(event, player) {
    return player.getCards("h", function(card2) {
      return get.tag(card2, "damage");
    }).length > player.countSkill("baitiemrfzcard3_skill");
  },
  filterCard: function(card2) {
    return get.tag(card2, "damage");
  },
  selectCard: function() {
    let player = _status.event.player;
    return player.countSkill("baitiemrfzcard3_skill") + 1;
  },
  filterTarget: function(card2, player, target) {
    return target != player && player.inRange(target);
  },
  position: "h",
  prompt: function() {
    let player = _status.event.player;
    return "你可以弃置" + (player.countSkill("baitiemrfzcard3_skill") + 1) + "张带有伤害类标签的牌并对攻击范围内的一名角色造成一点伤害";
  },
  content: async function(event, trigger, player) {
    const { target } = event;
    target.damage();
    player.logSkill("baitiemrfzcardad", target);
  },
  ai: {
    order: 6,
    result: {
      target: -1
    }
  }
});
cardTranslate({
  baitiemrfzcard3: "铁钳号",
  baitiemrfzcard3_skill: "援备",
  baitiemrfzcard3_info: "出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。"
});
