import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("baitiemrfzcard2", {
	image: `ext:WhichWay/image/card/baitiemrfzcard2.jpg`,
	type: "equip",
	subtype: "equip5",
	skills: ["baitiemrfzcard2_skill"],
	ai: {
		basic: {
			equipValue: 7.5,
		},
	},
});

cardSkill("baitiemrfzcard2_skill", {
	trigger: { player: "phaseDiscardBefore" },
	forced: true,
	content: async function (event, trigger, player) {
		let next = player.phaseUse();
		event.next.remove(next);
		trigger.next.push(next);
		game.log(player, "额外执行了一个出牌阶段");
		player.logSkill("baitiemrfzcardad");
		player.draw();
	},
});

cardTranslate({
	baitiemrfzcard2: "支援型平台",
	baitiemrfzcard2_skill: "援备",
	baitiemrfzcard2_info: "锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。",
});
