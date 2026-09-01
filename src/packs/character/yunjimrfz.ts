import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("yunjimrfz", { pack: "rareSJZX",
			sex: "female",
			group: "gemrfz",
			hp: 3,
			skills: ["lingkongmrfz","mijianmrfz"],
		});

skill({
	"lingkongmrfz": {
			audio: 2,
			trigger: {
				player: "phaseChange",
			},
			// @ts-ignore
			// @ts-ignore
			filter(event, player) {
				const count = player.getHistory("useSkill", evt => evt.skill === "lingkongmrfz").length;
				return player.countCards("hs", card => player.hasUseTarget(card)) >= count + 1;
			},
			// @ts-ignore
			// @ts-ignore
			check(event, player) {
				// @ts-ignore
				return event.phaseList[event.num] !== "phaseDraw";
			},
			async cost(event, trigger, player) {
				let count = player.getHistory("useSkill", evt => evt.skill === "lingkongmrfz").length;
				while (count + 1 > 0) {
					const  result  = await player
						.chooseToUse()
						.set("prompt", `【翎空】:请选择的你要使用的牌`)
						// @ts-ignore
						.set("prompt2", `还需使用${count + 1}张牌即可将本阶段(${get.translation(trigger.phaseList[trigger.num])})改为出牌阶段`).forResult();
					if (result.card) count--;
					else break;
				}
				event.result = {};
				if (count + 1 > 0) event.result.bool = false;
				else event.result.bool = true;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				// @ts-ignore
				game.log(player, `的`, trigger.phaseList[trigger.num], `被改为了`, "#y出牌阶段");
				// @ts-ignore
				trigger.phaseList[trigger.num] = "phaseUse|lingkongmrfz";
			},
			ai: {
				threaten: 1.5,
			},
		},
	"mijianmrfz": {
			audio: 2,
			trigger: {
				player: ["phaseUseBegin", "damageEnd"],
			},
			filter(event, player) {
				if (event.name === "damage") return player.getDamagedHp() > 0;
				return player.countCards("he") > 0;
			},
			async cost(event, trigger, player) {
				let count = player.getHistory("useSkill", evt => evt.skill === "mijianmrfz").length;
				if (trigger.name === "damage") {
					event.result = await player
						.chooseBool()
						.set("prompt", get.prompt("mijianmrfz"))
						.set("prompt2", `你可以摸${count + 1}张牌`)
						.set("ai", () => true)
						.forResult();
				} else {
					event.result = await player
						.chooseCard("he")
						.set("prompt", get.prompt("mijianmrfz"))
						.set("prompt2", `你可以制衡${count + 1}`)
						.set("selectCard", () => {
							// @ts-ignore
							return [1, get.event().count + 1];
						})
						.set("ai", card => {
							return 8 - get.value(card);
						})
						.set("count", count)
						.forResult();
				}
			},
			async content(event, trigger, player) {
				if (trigger.name === "damage") {
					player.draw(player.getHistory("useSkill", evt => evt.skill === "mijianmrfz").length + 1);
				} else {
					let num = 1;
					for (let card of player.getCards("h")) {
						if (!event.cards.includes(card)) {
							num--;
							break;
						}
					}
					await player.discard(event.cards);
					await player.draw(event.cards.length + num);
				}
			},
			ai: {
				maixie: true,
				maixie_hp: true,
				effect: {
					target(card, player, target) {
						if (get.tag(card, "damage")) {
							if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
							if (!target.hasFriend()) return;
							let num = 1;
							if (get.attitude(player, target) > 0) {
								if (player.needsToDiscard()) num = 0.7;
								else num = 0.5;
							}
							if (target.hp >= 4) return [1, num * 2];
							if (target.hp == 3) return [1, num * 1.5];
							if (target.hp == 2) return [1, num * 0.5];
						}
					},
				},
			},
		},
});

translate({
	"yunjimrfz": "云迹",
	"lingkongmrfz": "翎空",
	"lingkongmrfz_info": "任意阶段开始前，你可以使用X张牌，然后你将此阶段改为出牌阶段。（X=本回合此技能发动的次数+1）",
	"mijianmrfz": "弥坚",
	"mijianmrfz_info": "当你[出牌阶段开始时/受到伤害后]，你可以(界)制衡X/摸X+1张牌。（X=本回合此技能发动的次数+1）",
});

characterTitle("yunjimrfz", "<font color='#6495ed'>鼯击长空</font>");

characterIntro("yunjimrfz", "云迹，出生于哥伦比亚的飞行冒险家，为进行飞行实验而旅居各地，对于飞行动力装备的开发与改良颇有心得，如今为治疗矿石病来到罗德岛，并为罗德岛工程部的机动装置研发项目提供技术支持。");
