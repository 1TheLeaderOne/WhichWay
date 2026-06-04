import { game, get, lib } from "noname";
import { whichWayAPIOverride } from "../../override/index.js";
whichWayAPIOverride.overrideAPI("lib.skill.jiu", {
  trigger: {
    player: "useCard1"
  },
  filter: function(event2, player2) {
    if (player2.hasSkill("tiaojiumrfz")) {
      return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic") && event2.card.name != "jiu";
    }
    return event2.card && event2.card.name == "sha";
  },
  forced: true,
  charlotte: true,
  firstDo: true,
  content: function() {
    if (!player.hasSkill("tiaojiumrfz")) {
      if (!trigger.baseDamage) trigger.baseDamage = 1;
      trigger.baseDamage += player.storage.jiu;
    } else {
      trigger.effectCount += player.storage.jiu;
    }
    trigger.jiu = true;
    trigger.jiu_add = player.storage.jiu;
    game.addVideo("jiuNode", player, false);
    game.broadcastAll(function(player2) {
      player2.removeSkill("jiu");
    }, player);
  },
  temp: true,
  vanish: true,
  silent: true,
  popup: false,
  nopop: true,
  onremove: function(player2) {
    if (player2.node.jiu) {
      player2.node.jiu.delete();
      player2.node.jiu2.delete();
      delete player2.node.jiu;
      delete player2.node.jiu2;
    }
    delete player2.storage.jiu;
  },
  ai: {
    damageBonus: true,
    skillTagFilter: function(player2, tag, arg) {
      if (tag === "damageBonus") return arg && arg.card && arg.card.name === "sha" && !player2.hasSkill("tiaojiumrfz");
    }
  },
  group: "jiu2"
});
whichWayAPIOverride.overrideAPI("lib.skill.jiu2.filter", function(event2, player2) {
  if (player2.hasSkillTag("jiuSustain", null, event2.name)) return false;
  if (event2.name == "useCard") {
    if (player2.hasSkill("tiaojiumrfz")) {
      return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic") && event2.card.name != "jiu";
    }
    return event2.card && event2.card.name == "sha";
  }
  return true;
});
if (!lib.card.binglinchengxia) {
  lib.card["binglinchengxia"] = {
    fullskin: true,
    image: "ext:WhichWay/image/card/binglinchengxia.webp",
    type: "delay",
    filterTarget: function(card, player2, target) {
      return lib.filter.judge(card, player2, target) && player2 != target;
    },
    judge: function(card) {
      if (get.suit(card) == "diamond") return 0;
      return -3;
    },
    effect: function() {
      "step 0";
      if (result.bool == false) {
        if (
          // @ts-ignore
          !player.countCards("e", function(card) {
            return lib.filter.cardDiscardable(
              card,
              // @ts-ignore
              player,
              "shuiyanqijuny"
            );
          })
        ) {
          player.damage("nosource");
          event.finish();
          return;
        } else
          player.chooseControl("discard_card", "take_damage", function(event2, player2) {
            if (get.damageEffect(player2, event2.player, player2) >= 0) {
              return "take_damage";
            }
            if (player2.hp >= 3 && player2.countCards("e") >= 2) {
              return "take_damage";
            }
            return "discard_card";
          });
      } else event.finish();
      if (result.control == "discard_card") {
        player.discard(
          // @ts-ignore
          player.getCards("e", function(card) {
            return lib.filter.cardDiscardable(
              card,
              // @ts-ignore
              player,
              "shuiyanqijuny"
            );
          })
        );
      } else player.damage("nosource");
    },
    ai: {
      order: 1,
      value: 3,
      useful: 2,
      tag: {
        damage: 1,
        loseCard: 1
      },
      result: {
        // @ts-ignore
        target: function(player2, target, card, isLink) {
          var es = target.getCards("e");
          if (!es.length) return -1.5;
          var val = 0;
          for (var i of es) val += get.value(i, target);
          return -Math.min(1.5, val / 5);
        }
      }
    }
  };
  lib.translate["binglinchengxia"] = "兵临城下";
  lib.translate["binglinchengxia_info"] = "出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。";
}
let duplicateSkills = ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz"];
let targetSkill = get.info("chenkemrfz");
for (let skill of duplicateSkills) {
  lib.translate[skill] = lib.translate["chenkemrfz"];
  lib.translate[skill + "_info"] = lib.translate["chenkemrfz_info"];
  lib.skill[skill] = {
    ...targetSkill,
    audio: skill === "chenke3mrfz" ? "chenkemrfz" : false
  };
}
//# sourceMappingURL=override.js.map
