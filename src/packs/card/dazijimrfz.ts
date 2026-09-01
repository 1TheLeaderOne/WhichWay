import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("dazijimrfz", {
	image: `ext:WhichWay/image/card/dazijimrfz.jpg`,
	type: "equip",
	subtype: "equip1",
	destroy: true,
	derivation: "hongxuemrfz",
	distance: {
		attackFrom: -2,
	},
	ai: {
		basic: {
			equipValue: 5,
			order: function (card, player) {
				if (player && player.hasSkillTag("reverseEquip")) {
					return 8.5 - get.equipValue(card, player) / 20;
				} else {
					return 8 + get.equipValue(card, player) / 20;
				}
			},
			useful: 2,
			value: function (card, player, index, method) {
				if (player.isDisabled(get.subtype(card))) return 0.01;
				let value = 0;
				let info = get.info(card);
				let current = player.getEquip(info.subtype);
				if (current && card != current) {
					value = get.value(current, player);
				}
				let equipValue = info.ai.equipValue;
				if (equipValue == undefined) {
					equipValue = info.ai.basic.equipValue;
				}
				if (typeof equipValue == "function") {
					if (method == "raw") return equipValue(card, player);
					if (method == "raw2") return equipValue(card, player) - value;
					return Math.max(0.1, equipValue(card, player) - value);
				}
				if (typeof equipValue != "number") equipValue = 0;
				if (method == "raw") return equipValue;
				if (method == "raw2") return equipValue - value;
				return Math.max(0.1, equipValue - value);
			},
		},
		result: {
			target: function (player, target, card) {
				return get.equipResult(player, target, card.name);
			},
		},
	},
	skills: ["dazijimrfzskill"],
	enable: true,
	selectTarget: -1,
	filterTarget: function (card, player, target) {
		return target == player;
	},
	modTarget: true,
	allowMultiple: false,
	content:function () {
		if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
	},
	toself: true,
	fullimage: true,
});

cardSkill("dazijimrfzskill", {
	trigger: {
		player: "useCard",
	},
	direct: true,
	filter: function (event, player) {
		if (!player.hasSkill("ruibimrfz")) return false;
		if (event.dazijimrfzskill_buff || !event.targets.length || player.hasSkill("dazijimrfz_buff")) return false;
		return event.card.name == "sha";
	},
	content: async function (event,trigger,player) {
		player.addTempSkill("dazijimrfzskill_buff", "phaseUseAfter");
		trigger.dazijimrfzskill_buff = player;
	},
	subSkill: {
		buff: {
			trigger: {
				global: "useCardToTargeted",
			},
			charlotte: true,
			popup: false,
			lastDo: true,
			filter: function (event, player) {
				return event.parent.dazijimrfzskill_buff == player && event.targets.length == event.parent.triggeredTargets4.length;
			},
			content: async function (event,trigger,player) {
				trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
				trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
			},
			sub: true,
		},
	},
});

cardTranslate({
	dazijimrfz: "打字机",
	dazijimrfz_info: "当你使用【杀】指定目标时，你可以令此【杀】结算两次。（此装备离开你的装备区时，销毁之）",
});
