import { get } from "noname";
import { cardSkill, cardTranslate } from "../hooks.js";
cardSkill("jingtoumrfz_skill", {
  mod: {
    inRangeOf: function(from, to) {
      return true;
    },
    attackRange: function(player, num) {
      if (player.hasCard("jingtouE1mrfz", "e")) return num -= 1;
    }
  },
  trigger: { player: ["gainAfter", "equipAfter"] },
  forced: true,
  filter: (event, player) => {
    return player.countCards("h", (card) => !get.is.shownCard(card)) > 0;
  },
  content: async function(event, trigger, player) {
    let hs = player.getCards("h", (card) => !get.is.shownCard(card));
    if (hs.length == 0) return;
    player.addShownCards({
      gaintag: ["visible_jingtoumrfz"],
      cards: hs
    });
  }
});
cardSkill("baitiemrfzcardad", {
  audio: "ext:WhichWay/audio:4"
});
cardTranslate({
  baitiemrfzcardad: "支援装备",
  jingtoumrfz_skill: "镜头",
  visible_jingtoumrfz: "明置"
});
