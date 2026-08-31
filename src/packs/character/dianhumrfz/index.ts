import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("dianhumrfz", {
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["gandianmrfz"],
		});

skill({
	"gandianmrfz": {
			audio: 2,
			forced: true,
			trigger: {
				global: "roundStart",
			},
			init(player) {
				game.broadcastAll(() => {
					lib.translate["gandianmrfz_zhou"] = "小轴";
					lib.translate["gandianmrfz_shu"] = "小树";
					//@ts-ignore
					_status.gandianmrfz_ig = [];
				});
			},
			mark: true,
			onremove(player) {
				//@ts-ignore
				delete _status.gandianmrfz_ig;
				delete player.storage.gandianmrfz;
				for (let char of game.players) {
					char.removeGaintag("gandianmrfz_zhou");
					char.removeGaintag("gandianmrfz_shu");
				}
			},
			intro: {
				content(storage) {
					let shu = Object.keys(lib.color).remove(storage);
					//@ts-ignore
					return `·小树:${get.translation(shu)}<br>·小轴:${get.translation(storage)}<br>·不受影响的角色:${get.translation(_status.gandianmrfz_ig)}`;
				},
			},
			global: ["gandianmrfz_effect", "gandianmrfz_effect2"],
			async content(event, trigger, player) {
				for (let char of game.players) {
					char.removeGaintag("gandianmrfz_zhou");
					char.removeGaintag("gandianmrfz_shu");
				}

				const { control } = await player
					.chooseControl("red", "black")
					.set("prompt", "【感电】：请选择令一种颜色的牌称之为“小轴”，其余颜色的牌则称之为“小树”")
					.set("ai", () => {
						return "red";
					})
					.forResult();

				if (control) player.storage.gandianmrfz = control;

				game.broadcastAll(color => {
					//@ts-ignore
					_status.gandianmrfzColor = color;
					//@ts-ignore
					_status.gandianmrfz_ig = [];
				}, player.storage.gandianmrfz);

				for (let char of game.players) {
					char.addGaintag(char.getCards("h", { color: player.storage.gandianmrfz }), "gandianmrfz_zhou");
					char.addGaintag(
						char.getCards("h", card => get.color(card) !== player.storage.gandianmrfz),
						"gandianmrfz_shu"
					);
				}

				const result = await player
					.chooseCardTarget({
						prompt: `【感电】:弃置N张牌并令N-1名角色不受【感电①】的影响且本轮第一个出牌阶段开始时摸X张牌（X=其手牌中“小树”的数量和“小轴”的数量中的最小值）`,
						filterTarget(card, player, target) {
							return ui.selected.targets.length - 1 < ui.selected.cards.length;
						},
						selectTarget: [0, Infinity],
						filterCard: true,
						selectCard: [0, Infinity],
						complexCard: true,
						complexTarget: true,
						ai1(card) {
							let player = get.player();
							//@ts-ignore
							let num = game.countPlayer(char => get.attitude2(char > 0));
							if (ui.selected.cards.length >= num) return false;
							return 6 - get.value(card, player);
						},
						ai2(target) {
							let player = get.player();
							if (target === player) return 114514;
							return get.attitude2(target) > 2;
						},
					})
					.forResult();
				let { targets, cards } = result;
				game.broadcastAll(arr => {
					//@ts-ignore
					_status.gandianmrfz_ig.push(...arr);
					//@ts-ignore
				}, targets);
				//@ts-ignore
				targets.forEach(target => {
					target
						.when({
							player: "phaseUseBegin",
							global: "phaseBefore",
						})
						.then(() => {
							if (trigger.name === "phaseUse") {
								let shu = player.countCards("h", card => card.hasGaintag("gandianmrfz_shu"));
								let zhou = player.countCards("h", card => card.hasGaintag("gandianmrfz_zhou"));
								let num = Math.min(shu, zhou, 5);
								if (num > 0) {
									player.draw(num);
									//@ts-ignore
									player.logSkill("gandianmrfz");
								}
							}
						});
				});
				player.discard(cards);
			},
			ai: {
				viewHandcard: true,
				skillTagFilter(player, tag, arg) {
					if (player == arg) {
						return false;
					}
				},
			},
			subSkill: {
				effect: {
					mod: {
						cardRespondable(card, player) {
							//@ts-ignore
							let ig = _status.gandianmrfz_ig || [];
							let evt = _status.event.parent;
							//@ts-ignore
							let color = _status.gandianmrfzColor;
							//@ts-ignore
							let isZhou = get.color(evt.card) === color;
							if ((isZhou && get.color(card) !== color) || ig.includes(player)) return true;
							return false;
						},
					},
					charlotte: true,
					silent: true,
					trigger: { player: "gainAfter" },
					async content(event, trigger, player) {
						let color = player.storage.gandianmrfz;
						for (let card of trigger.cards) {
							if (get.color(card) === color) card.addGaintag("gandianmrfz_zhou");
							else card.addGaintag("gandianmrfz_shu");
						}
					},
				},
				effect2: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "useCardToPlayered",
					},
					filter(event, player) {
						//@ts-ignore
						let ig = _status.gandianmrfz_ig || [];
						return !ig.includes(event.target);
					},
					async content(event, trigger, player) {
						const target = trigger.target;
						target.addTempSkill("gandianmrfz_block");
						target.markAuto("gandianmrfz_block", [trigger.card]);
					},
				},
				block: {
					mod: {
						cardEnabled(card, player) {
							if (!player.storage.gandianmrfz_block) {
								return;
							}
							const storage = player.getStorage("gandianmrfz_block");
							let evt = get.event();
							if (evt.name != "chooseToUse") {
								//@ts-ignore
								evt = evt.getParent("chooseToUse");
							}
							//@ts-ignore
							if (!evt || !evt.respondTo || !storage.some(i => i.cardid == evt.respondTo[1].cardid)) {
								return;
							}
							const color = get.color(card);
							//@ts-ignore
							let zhouColor = _status.gandianmrfzColor;
							//@ts-ignore
							return get.color(evt.respondTo[1]) === zhouColor && color !== zhouColor;
						},
					},
					onremove(player) {
						delete player.storage.gandianmrfz_block;
					},
					charlotte: true,
					trigger: {
						player: ["damageBefore", "damageCancelled", "damageZero"],
						target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
						global: ["useCardEnd"],
					},
					filter(event, player) {
						const evt = event.getParent("useCard", true, true);
						//@ts-ignore
						if (evt && evt.effectedCount < evt.effectCount) {
							return false;
						}
						if (!event.card || !player.storage.gandianmrfz_block) {
							return false;
						}
						return player.getStorage("gandianmrfz_block").includes(event.card);
					},
					forced: true,
					popup: false,
					firstDo: true,
					async content(event, trigger, player) {
						player.unmarkAuto(event.name, [trigger.card]);
						if (!player.getStorage(event.name).length) {
							player.removeSkill(event.name);
						}
					},
				},
			},
		},
});

translate({
	"dianhumrfz": "电弧",
	"gandianmrfz": "感电",
	"gandianmrfz_info": "锁定技。<br>①所有角色只能用“小树”响应“小轴”。<br>②每轮开始时，你选择令一种颜色的牌称之为“小轴”，其余颜色的牌则称之为“小树”，然后你弃置N-1张牌并令N名角色不受【感电①】的影响且本轮第一个出牌阶段开始时摸X张牌（X=其手牌中“小树”的数量和“小轴”的数量中的最小值，X至多为5）。<br>③其他角色的手牌对你可见。",
});

characterTitle("dianhumrfz", "<font color = #6495ed>无言的慈爱</font>");

characterIntro("dianhumrfz", "电弧，罗德岛精英干员。曾为巴别塔提供通讯支援，主导罗德岛早期的通讯系统建设，为相关通讯工作提供了必要的框架支持。");
