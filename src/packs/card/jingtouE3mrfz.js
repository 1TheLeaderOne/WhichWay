import { get, game } from "noname";
import { card, cardTranslate } from "../hooks.js";
card("jingtouE3mrfz", {
  image: `ext:WhichWay/image/card/jingtouE3mrfz.jpg`,
  type: "equip",
  subtype: "equip3",
  distance: {
    globalTo: 1
  },
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
    let hs = player.getCards("h", (card2) => get.is.shownCard(card2));
    if (hs.length > 0) player.hideShownCards({ cards: hs });
  },
  equipDelay: false,
  loseDelay: false,
  skills: ["jingtoumrfz_skill"],
  ai: {
    basic: {
      equipValue: -1
    },
    result: {
      target: (player, target, card2) => get.equipResult(player, target, card2.name)
    }
  },
  enable: true,
  selectTarget: -1,
  filterTarget: (card2, player, target) => player == target && target.canEquip(card2, true),
  modTarget: true,
  allowMultiple: false,
  content: async function(event, trigger, player) {
    const { cards, target } = event;
    if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
  },
  toself: true
});
cardTranslate({
  jingtouE3mrfz: "镜头",
  jingtouE3mrfz_info: "锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。"
});
