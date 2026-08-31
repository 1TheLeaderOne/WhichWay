import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("lindongmrfz", {
			sex: "female",
			group: "wumrfz",
			hp: 4,
			skills: ["xianlingmrfz","dongjiangmrfz"],
		});

skill({
	"dongjiangmrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			check: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && get.attitude(current, player) > 0;
				});
			},
			async content(event, trigger, player) {
				let result;

				// Steps 0-3 loop (original event.goto(0))
				while (player.countCards("h") > 0) {
					// step 0
					result = await player.chooseCard("【冬将】:请选择你要分配的牌", true, [1, Infinity]).forResult();

					// step 1
					let cards = result.cards;

					if (!cards) continue;

					result = await player
						.chooseTarget("【冬将】:请选择你要分配的角色（" + get.translation(cards) + "）", true, (card, player, target) => {
							return target !== player;
						})
						.set("ai", target => {
							return get.attitude(target, player) > 0;
						})
						.forResult();

					// step 2
					if (result.targets) await player.give(cards, result.targets[0]);
					// step 3: loop condition checked at while start
				}

				// step 4
				if (player.hasUseTarget("sha")) {
					player.addTempSkill("dongjiangmrfz_dam", "useCardAfter");
					await player
						.chooseUseTarget(
							{
								name: "sha",
								isCard: true,
							},
							"请选择【杀】的目标"
						)
						.set("forced", true)
						.set("addCount", false)
						.forResult();
				}
			},
			subSkill: {
				dam: {
					direct: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.card.name == "sha" && event.card.cards.length == 0;
					},
					async content(event, trigger, player) {
						//@ts-ignore
						player.drawTo(3);
						player.removeSkill("dongjiangmrfz_dam");
						//@ts-ignore
						player.logSkill("dongjiangmrfz");
					},
				},
			},
		},
	"xianlingmrfz": {
			audio: 2,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				let result;

				// Steps 0-1 Loop: Player prepares to use a card (draw until usable)
				while (true) {
					const cards = player.getCards("h");
					if (player.countCards("h") < 1) {
						await player.draw();
						continue;
					}
					let hasUsable = false;
					for (const card of cards) {
						if (player.hasUseTarget(card, false)) {
							hasUsable = true;
							break;
						}
					}
					if (hasUsable) break;
					await player.draw();
				}

				// Step 2: Player chooses to use a card
				await player
					.chooseToUse("【先领】:请使用一张牌", true)
					.set("complexSelect", true)
					.set("filterTarget", (card, player, target) => {
						return player.canUse(card, target, false);
					})
					.set("addCount", false)
					.set("forced", true);

				// Steps 3-4: Select target to repeat (if not round 1)
				if (game.roundNumber !== 1) {
					result = await player
						.chooseTarget("【先领】:你可以令一名其他角色执行一次相同的流程", (card, player, target) => {
							return target !== player;
						})
						.set("ai", target => {
							return get.attitude(target, player) > 0;
						})
						.forResult();

					if (result.targets && result.targets.length) {
						event.target = result.targets[0];
					} else {
						return;
					}
				} else {
					return;
				}

				// Steps 5-6 Loop: Target prepares to use a card (draw until usable)
				while (true) {
					const cards = event.target.getCards("h");
					if (event.target.countCards("h") < 1) {
						await event.target.draw();
						continue;
					}
					let hasUsable = false;
					for (const card of cards) {
						if (event.target.hasUseTarget(card, false)) {
							hasUsable = true;
							break;
						}
					}
					if (hasUsable) break;
					await event.target.draw();
				}

				// Step 7: Target chooses to use a card
				await event.target
					.chooseToUse("【先领】:请使用一张牌")
					.set("complexSelect", true)
					.set("filterTarget", (card, player, target) => {
						return event.target.canUse(card, target, false);
					})
					.set("addCount", false)
					.set("forced", true);
			},
		},
});

translate({
	"lindongmrfz": "凛冬",
	"dongjiangmrfz": "冬将",
	"dongjiangmrfz_info": "准备阶段，你可以将你的所有手牌分配给任意名其他角色，然后视为使用一张【杀】，若此牌造成伤害，你将手牌补至3张。",
	"xianlingmrfz": "先领",
	"xianlingmrfz_info": "每轮开始时，你可以使用一张牌（无距离限制），若你手牌中没有能够使用的牌，你摸一张牌，你重复这个流程直到有能使用的牌。若不为第一轮，你可以令一名其他角色也执行一次此流程。",
});

characterIntro("lindongmrfz", "凛冬，切尔诺伯格事变前于切城某中学就读，在校期间已表现出对战斗与突击行为的热情。在多项测试中表现出乌萨斯人与生俱来的强健力量和坚实体质。</br>现作为先锋干员担任作战小队队长。");
