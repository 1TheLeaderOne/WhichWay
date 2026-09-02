import { game } from "noname";
import { card, cardSkill, cardTranslate } from "../hooks.js";
card("DP27mrfz", {
  image: `ext:WhichWay/image/card/DP27mrfz.jpg`,
  type: "equip",
  subtype: "equip1",
  destroy: true,
  derivation: "zhanchemrfz",
  distance: {
    attackFrom: -3
  },
  skills: ["DP27mrfz_skill"],
  ai: {
    basic: {
      equipValue: 8
    }
  }
});
cardSkill("DP27mrfz_skill", {
  mod: {
    cardnature: function(card2, player) {
      let history = player.getHistory("useCard"), tmp_bool = false;
      for (let i = 0; i < history.length; i++) {
        if (history[i].card.name == "sha") {
          tmp_bool = true;
          break;
        }
      }
      if (!card2.nature && card2.name == "sha" && tmp_bool) return "fire";
    }
  },
  trigger: { player: "useCard" },
  forced: true,
  firstDo: true,
  filter: function(event, player) {
    if (!event.card) return false;
    return event.card.name == "sha";
  },
  content: async function(event, trigger, player) {
    let history = player.getHistory("useCard"), tmp_bool = false;
    for (let i = 0; i < history.length; i++) {
      if (!history[i - 1]) continue;
      if (history[i - 1].card.name == "sha") {
        tmp_bool = true;
        break;
      }
    }
    if (tmp_bool == false) event.goto(1);
    else if (!trigger.card.nature) {
      trigger.card.nature = "fire";
    }
    if (game.hasNature(trigger.card)) {
      if (!trigger.baseDamage) trigger.baseDamage = 1;
      trigger.baseDamage += 1;
    }
  },
  group: "DP27mrfz_skill_wushi",
  subSkill: {
    wushi: {
      trigger: {
        player: "useCardToPlayered"
      },
      filter: function(event) {
        return event.card && event.card.name == "sha" && event.card.nature;
      },
      forced: true,
      logTarget: "target",
      content: async function(event, trigger, player) {
        trigger.target.addTempSkill("qinggang2");
        trigger.target.storage.qinggang2.add(trigger.card);
        trigger.target.markSkill("qinggang2");
      },
      ai: {
        unequip_ai: true,
        skillTagFilter: function(player, tag, arg) {
          if (arg && arg.name == "sha" && game.hasNature(arg)) return true;
          return false;
        }
      }
    }
  }
});
cardTranslate({
  DP27mrfz: "DP27",
  DP27mrfz_skill: "DP27",
  DP27mrfz_info: "①锁定技，若你于本回合使用过【杀】，则你的非属性【杀】均视为火【杀】。②锁定技，你的属性杀无视防具且伤害基数+1。"
});
