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
  filter: function(event, player2) {
    return player2.getCards("h", function(card2) {
      return get.tag(card2, "damage");
    }).length > player2.countSkill("baitiemrfzcard3_skill");
  },
  filterCard: function(card2) {
    return get.tag(card2, "damage");
  },
  selectCard: function() {
    var player2 = _status.event.player;
    return player2.countSkill("baitiemrfzcard3_skill") + 1;
  },
  filterTarget: function(card2, player2, target2) {
    return target2 != player2 && player2.inRange(target2);
  },
  position: "h",
  prompt: function() {
    var player2 = _status.event.player;
    return "你可以弃置" + (player2.countSkill("baitiemrfzcard3_skill") + 1) + "张带有伤害类标签的牌并对攻击范围内的一名角色造成一点伤害";
  },
  content: function() {
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
  "baitiemrfzcard3_info": "出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。"
});
//# sourceMappingURL=baitiemrfzcard3.js.map
