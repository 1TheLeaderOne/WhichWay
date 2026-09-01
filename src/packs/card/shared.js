import { get } from "noname";
import { cardSkill, cardTranslate } from "../hooks.js";
cardSkill("jingtoumrfz_skill", {
  mod: {
    inRangeOf: function(from, to) {
      return true;
    },
    attackRange: function(player2, num) {
      if (player2.hasCard("jingtouE1mrfz", "e")) return num -= 1;
    }
  },
  trigger: { player: ["gainAfter", "equipAfter"] },
  forced: true,
  filter: (event, player2) => {
    return player2.countCards("h", (card) => !get.is.shownCard(card)) > 0;
  },
  content() {
    let hs = player.getCards("h", (card) => !get.is.shownCard(card));
    if (hs.length == 0) return;
    player.addShownCards(hs, "visible_jingtoumrfz");
  }
});
cardSkill("baitiemrfzcardad", {
  audio: "ext:whitherHelm/audio:4"
});
cardTranslate({
  baitiemrfzcardad: "支援装备",
  jingtoumrfz_skill: "镜头",
  visible_jingtoumrfz: "明置"
});
//# sourceMappingURL=shared.js.map
