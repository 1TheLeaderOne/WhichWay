import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("baitiemrfzcard1", {
				image: `ext:WhichWay/image/card/baitiemrfzcard1.jpg`,
				type: "equip",
				subtype: "equip5",
				skills: ['baitiemrfzcard1_skill'],
				ai: {
					basic: {
						equipValue: 7,
					}
				},
});

cardSkill("baitiemrfzcard1_skill", {
				trigger: { source: 'damageBegin3' },
				filter: function (event, player) {
					return event.num > 1 && event.player != player;
				},
				prompt: '是否令此伤害+1？',
				content: function () {
					trigger.num++;
					player.logSkill('baitiemrfzcardad', trigger.player);
				},
});

cardTranslate({
	baitiemrfzcard1: "攻击型平台",
	baitiemrfzcard1_skill: '援备',
	'baitiemrfzcard1_info': '当你造成至少两点伤害时，你可以令此伤害+1。',
});
