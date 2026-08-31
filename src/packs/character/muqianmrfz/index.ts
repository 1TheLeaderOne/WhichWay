import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("muqianmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "samrfz",
			hp: 4,
			skills: ["cangshimrfz"],
		});

skill({
	"cangshimrfz": {
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			onremove(player) {
				player.removeTip("cangshimrfz_tip");
			},
			intro: {
				// @ts-ignore
				content(event, player) {
					return `当你获得${get.translation(player.storage.cangshimrfz)}的牌时，你摸两张牌`;
				},
			},
			// @ts-ignore
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const { control } = await player
					.chooseControl(lib.suit)
					.set("prompt", `【藏石】：请选择一种花色，当你获得这种花色的牌后你摸两张牌`)
					.set("ai", () => {
						return "diamond";
					})
					.forResult();
				if (control) {
					player.storage.cangshimrfz = control;
					player.markSkill("cangshimrfz");
					player.addTip("cangshimrfz_tip", `藏石 ${get.translation(control)}`);
				}
			},
			group: ["cangshimrfz_draw"],
			subSkill: {
				draw: {
					audio: "cangshimrfz",
					trigger: { player: "gainAfter" },
					filter: (event, player) => {
						// @ts-ignore
						if (!player.storage.cangshimrfz || event.getParent(2).name === "cangshimrfz_draw") return false;
						return event.cards && event.cards.some(card => get.suit(card) === player.storage.cangshimrfz);
					},
					forced: true,
					// @ts-ignore
					async content(event, trigger, player) {
						await player.draw(2);
						let next = game.createEvent("cangshimrfz");
						// @ts-ignore
						next.player = player;
						// @ts-ignore
						next.setContent(lib.skill.cangshimrfz.content);
					},
				},
			},
			ai: {
				threaten: 1.3,
			},
		},
});

translate({
	"muqianmrfz": "钼铅",
	"cangshimrfz": "藏石",
	"cangshimrfz_info": "锁定技，游戏开始时，你选择一种花色，然后当你不因此技能而获得这种花色的牌后，你摸两张牌，然后你重复这个流程。",
});

characterTitle("muqianmrfz", "<font color='#8a2be2'>矿石收藏家</font>");

characterIntro("muqianmrfz", "钼铅，探险家，矿石收藏家，同时也是哥伦比亚城际网络中颇为知名的社交媒体视频创作者。在地质考察过程中，不慎感染矿石病，来到罗德岛接受治疗。其后，经过交涉，作为特种干员加入罗德岛，以丰富的地质学知识和荒野求生经验，为罗德岛诸多队伍的野外探索任务提供支持。");
