import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("jixingmrfz", { pack: "epicSJZX",
			sex: "female",
			hp: 4,
			group: "dongmrfz",
			skills: ["tiandingmrfz", "renweimrfz"],
		});

skill({
	"renweimrfz": {
			audio: 2,
			usable: 1,
			trigger: {
				player: "phaseChange",
			},
			firstDo: true,
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			async cost(event, trigger, player) {
				//@ts-ignore
				let phase = trigger.phaseList[trigger.num];
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("renweimrfz"))
					.set("prompt", `你可以交换牌堆顶和手牌中的一张牌<br>当前阶段:<font color='red'>${get.translation(phase)}</font>`)
					.set("ai", card => {
						//@ts-ignore
						let phase = get.event().phaseName;
						let player = get.player();
						switch (phase) {
							case "phaseDraw":
							case "phaseUse":
								return get.color(card) === "red" ? 100 - get.value(card) : 0;
							case "phaseDiscard":
								return get.color(card) === "black" ? 100 - get.value(card) : 0;
							default:
								return player.hasSkill("tiandingmrfz") ? 0 : 6 - get.value(card);
						}
					})
					.set("phaseName", phase)
					.forResult();
			},
			async content(event, trigger, player) {
				let card = event.cards[0];
				//@ts-ignore
				await player.gain(_status.pileTop);
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				//@ts-ignore
				let name = trigger.phaseList[trigger.num + 1] ? trigger.phaseList[trigger.num + 1] + "End" : "phaseEnd";
				player.addTempSkill("renweimrfz_knowFirstCard", { player: name });
			},
			subSkill: {
				knowFirstCard: {
					charlotte: true,
				},
			},
		},
	"tiandingmrfz": {
			audio: 2,
			trigger: {
				player: "phaseChange",
			},
			lastDo: true,
			init(player, skill) {
				player.storage[skill] = 2;
			},
			// @ts-ignore
			filter(event, player) {
				let num = player.getHistory("useSkill", evt => evt.skill === "tiandingmrfz").length;
				return player.storage.tiandingmrfz > num;
			},
			check(event, player) {
				//@ts-ignore
				let phase = event.phaseList[event.num];
				let know = player.hasSkill("renweimrfz_knowFirstCard");
				if (know) {
					//@ts-ignore
					let color = get.color(_status.pileTop);
					switch (phase) {
						case "phaseDraw":
						case "phaseUse":
							if (color !== "red") return false;
							break;
						case "phaseDiscard":
							if (color !== "black" && player.countCards("h") + 1 > player.getHandcardLimit()) return false;
					}
					return true;
				}
				return !["phaseUse", "phaseDraw"].includes(phase);
			},
			// @ts-ignore
			prompt2(event, player) {
				//@ts-ignore
				let phase = event.phaseList[event.num];
				return `是否进行判定，若判定牌为红，你本回合使用【杀】的次数和攻击距离+1且本技能本回合发动次数+1，反之你跳过此阶段(${get.translation(phase)})？`;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const { card, color } = await player
					.judge()
					.set("judge", card => {
						let color = get.color(card);
						return color === "red" ? -4 : 0;
					})
					.set("judge2", result => result.bool === false)
					.forResult();
				if (get.position(card) === "d") player.gain(card, "gain2");
				if (color === "red") {
					player.storage.tiandingmrfz++;
					if (!player.hasSkill("tiandingmrfz_eff")) player.addTempSkill("tiandingmrfz_eff", { player: "phaseEnd" });
					player.addMark("tiandingmrfz_eff", 1, false);
				} else {
					//@ts-ignore
					player.skip(trigger.phaseList[trigger.num]);
				}
			},
			group: "tiandingmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					firstDo: true,
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.tiandingmrfz = 2;
					},
				},
				eff: {
					charlotte: true,
					silent: true,
					onremove: true,
					mark: true,
					intro: {
						content: "·使用【杀】的次数+#<br>·攻击距离+#",
					},
					mod: {
						cardUsable(card, player, num) {
							if (card.name === "sha") {
								return num + player.countMark("tiandingmrfz_eff");
							}
						},
						attackRange: function (player, num) {
							return num + player.countMark("tiandingmrfz_eff");
						},
					},
				},
			},
		},
});

translate({
	"jixingmrfz": "吉星",
	"renweimrfz": "人为",
	"renweimrfz_info": "每回合限一次，任意阶段开始时，你可以交换牌堆顶和手牌中的一张牌。",
	"tiandingmrfz": "天定",
	"tiandingmrfz_info": "每回合限两次，任意阶段开始时，你可以进行一次判定并获得判定牌，若判定牌为红，你本回合使用【杀】的次数和攻击距离+1且本技能本回合发动次数+1，反之你跳过此阶段。",
});

characterTitle("jixingmrfz", "<font color = #a52a2a>命由天定</font>");

characterIntro("jixingmrfz", "吉星，活跃在锻冶町的珠宝鉴定师，杂货铺“吉星”的所有者，在金石会事件后失去了店铺与家，经介绍来到罗德岛接受矿石病治疗，现作为狙击干员为罗德岛提供服务。");
