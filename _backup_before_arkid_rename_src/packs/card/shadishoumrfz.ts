import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("shadishoumrfz", {
	image: `ext:WhichWay/image/card/shadishoumrfz.jpg`,
	type: "equip",
	subtype: "equip2",
	onLose: async function (event,trigger,player) {
		const { cards } = event;
		const par2 = event.getParent(2);
		const par = event.getParent();
		if ((!par2 || par2.name != "swapEquip") && par && (par.type != "equip" || par.swapEquip)) {
			cards.forEach(card => {
				card.fix();
				card.remove();
				card.destroyed = true;
				game.log(card, "被销毁了");
			});
		}
	},
	equipDelay: false,
	loseDelay: false,
	skills: ["shadishoumrfz_skill"],
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
	content: async function (event,trigger,player) {
		const { cards, target } = event;
		if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
	},
	toself: true,
});

cardSkill("shadishoumrfz_skill", {
	enable: "phaseUse",
	usable: 1,
	filter: function (event, player) {
		return player.countCards("h") > 0;
	},
	filterCard: true,
	selectCard: 1,
	prompt: "是否发动【沙地兽】？",
	prompt2: "出牌阶段限一次，你可以弃置一张手牌，然后弃置【沙地兽】",
	check(card) {
		return 8 - get.value(card);
	},
	async content(event, trigger, player) {
		let equips = player.getCards("e", function (card) {
			return card.name == "shadishoumrfz";
		});
		player.discard({cards:equips});
	},
	ai: {
		order: 1,
		result: {
			player: 1,
		},
	},
});

cardTranslate({
	shadishoumrfz: "沙地兽",
	shadishoumrfz_skill: "沙地兽",
	shadishoumrfz_info: "①锁定技，当此牌不因交换装备或移动离开你的装备区时，销毁之。②出牌阶段限一次，你可以弃置一张手牌并弃置此牌。",
});
