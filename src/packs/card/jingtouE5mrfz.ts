import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("jingtouE5mrfz", {
				image: `ext:WhichWay/image/card/jingtouE5mrfz.jpg`,
				type: "equip",
				subtype: "equip5",
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
					var player = _status.event.player,
						hs = player.getCards('h', card => get.is.shownCard(card));
					if (hs.length > 0) player.hideShownCards(hs);
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["jingtoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
});

cardTranslate({
	jingtouE5mrfz: '镜头',
	'jingtouE5mrfz_info': '锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。',
});
