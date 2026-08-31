import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("nuoweiermrfz", {
			sex: "male",
			group: "weimrfz",
			hp: 3,
			skills: ["butingmrfz","buximrfz"],
		});

skill({
	"butingmrfz": {
			audio: 2,
			comboSkill: true,
			mod: {
				aiOrder(player, card, num) {
					if (typeof card == "object") {
						const evt = player.getLastUsed(1);
						if (evt?.card && get.type2(evt.card) === get.type2(card)) {
							return num + 10;
						}
					}
				},
			},
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				let evt = player.getLastUsed(1);
				return evt && get.type2(evt.card) === get.type2(event.card);
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw();
			},
			ai: {
				threaten: 1.5,
			},
		},
	"buximrfz": {
			audio: 2,
			trigger: {
				player: "dyingAfter",
			},
			filter(event, player) {
				return player.hasUseTarget("tao");
			},
			async content(event, trigger, player) {
				player.chooseUseTarget({ name: "tao" }, true);
			},
		},
});

translate({
	"nuoweiermrfz": "诺威尔",
	"butingmrfz": "不停",
	"butingmrfz_info": "连招技（任意牌 + 与上一张牌类别相同的牌）。你摸一张牌。",
	"buximrfz": "不息",
	"buximrfz_info": "当你脱离濒死状态时，你可以视为使用一张【桃】。",
});

characterTitle("nuoweiermrfz", "<font color='#8b008b'>无证的配镜师</font>");

characterIntro("nuoweiermrfz", "诺威尔，维多利亚配镜师。在与九及其领导的新整合运动短暂同行前，曾于泰拉多地游历寻人，同时以为当地人配镜维持生计。伦蒂尼姆事件结束后，诺威尔与往日的一位顾客重遇，经其引荐，开始与罗德岛接触。");
