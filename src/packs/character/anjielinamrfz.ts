import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("anjielinamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "xumrfz",
			hp: 3,
			skills: ["xinshimrfz","fanzhongmrfz"],
		});

skill({
	"fanzhongmrfz": {
			intro: {
				content: "重力紊乱",
			},
			audio: 4,
			global: ["fanzhongmrfz2", "fanzhongmrfz_gain", "fanzhongmrfz_gain2", "fanzhongmrfz_lose"],
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return game.hasPlayer(function (target) {
					return target != player && player.inRange(target) && target.countMark("fanzhongmrfz") < 3;
				});
			},
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(
						get.prompt("fanzhongmrfz"),
						"你可以选择攻击范围内的一名其他角色，令其获得‘反重’标记",
						function (card, player, target) {
							return target != player && player.inRange(target) && target.countMark("fanzhongmrfz") < 3;
						}
					)
					.set("ai", target => -get.attitude2(target))
					.forResult();
				if (result.bool && result.targets) {
					result.targets[0].addMark("fanzhongmrfz");
					//@ts-ignore
					player.logSkill("fanzhongmrfz", result.targets[0]);
				}
			},
			subSkill: {
				gain: {
					direct: true,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						return player.hasMark("fanzhongmrfz") && player.getExpansions("fanzhongmrfz2").length > 0;
					},
					async content(event, trigger, player) {
						let result;
						const cards = player.getExpansions("fanzhongmrfz2");
						if (cards.length) result = await player.chooseButton(["获得一张牌", cards], true).forResult();
						else return;
						if (result && result.links) player.gain(result.links, "gain2");
					},
				},
				gain2: {
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseDiscardBefore" },
					filter: function (event, player) {
						return player.hasMark("fanzhongmrfz");
					},
					async content(event, trigger, player) {
						const cards = player.getExpansions("fanzhongmrfz2");
						if (cards) player.gain(cards, "gain2");
						player.removeMark("fanzhongmrfz", player.countMark("fanzhongmrfz"), false);
					},
				},
				lose: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { player: "die" },
					filter: function (event, player) {
						return player.hasMark("fanzhongmrfz");
					},
					async content(event, trigger, player) {
						const cards = player.getExpansions("fanzhongmrfz2");
						player.removeMark("fanzhongmrfz", player.countMark("fanzhongmrfz"), false);
						if (cards) player.loseToDiscardpile(cards);
					},
				},
			},
			ai: {
				expose: 0.6,
				threaten: 1.2,
			},
		},
	"xinshimrfz": {
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("xinshimrfz")) {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("xinshimrfz")) {
						return false;
					}
				},
			},
			audio: 4,
			enable: "phaseUse",
			discard: false,
			lose: false,
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			filterTarget: function (card, player, target) {
				return target != player && !target.tempSkills.xinshimrfz2 && !target.hasMark("xinshimrfz");
			},
			filterCard: function (card, player) {
				return !player.storage.xinshimrfz || !player.storage.xinshimrfz.includes(get.type(card, "trick"));
			},
			check: function (card) {
				return 10 - get.value(card);
			},
			delay: 0,
			prompt: "你可以将一张本回合你未以此法交出过的类型的牌交给本回合你未以此法选择过的角色",
			async content(event, trigger, player) {
				const { cards, target } = event;
				let result;

				// step 0
				if (!player.storage.xinshimrfz) player.storage.xinshimrfz = [];
				player.storage.xinshimrfz.push(get.type(cards[0], "trick"));

				// step 1
				await player.give(cards, target);
				target.addTempSkill("xinshimrfz2");

				// step 2
				const mark = player.storage.xinshimrfz.length;
				if (mark === 1) {
					await player.draw();
					return;
				}

				// Step 3 & 4 (Executed if mark != 1 and mark != 3)
				// 原逻辑：mark==2 跳转至 3，其他情况顺延至 3；mark==3 跳转至 5
				if (mark !== 3) {
					// step 3
					if (target.countCards("h") > 0) {
						result = await target.chooseCard("h", true).forResult();
					} else {
						return;
					}

					// step 4
					if (result?.cards?.length) {
						await target.give(result.cards, player);
						await target.draw();
					}
					return;
				}

				// Step 5 & 6 (Executed only if mark == 3)
				// step 5
				if (player.storage.xinshimrfz.length === 3) {
					result = await player
						.chooseTarget(true, "【信使】:请选择一名其他角色，令其获得‘反重’标记", (card, player, target) => {
							return target !== player && !target.hasMark("xinshimrfz");
						})
						.set("ai", target => {
							return -get.attitude(player, target);
						})
						.forResult();
					//@ts-ignore
					player.logSkill("xinshimrfz");
				} else {
					return;
				}

				// step 6
				if (result?.bool && result?.targets?.length) {
					result.targets[0].addMark("fanzhongmrfz");
				}
			},
			ai: {
				order: 9,
				expose: 0.2,
				threaten: 1.2,
				result: {
					target: function (player, target) {
						if (player.countCards("h") > 2) return 1;
					},
				},
			},
			group: ["xinshimrfz_clear", "xinshimrfz_give"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.xinshimrfz = [];
						player.removeGaintag("xinshimrfz");
					},
				},
				give: {
					direct: true,
					trigger: { player: "gainEnd" },
					filter: function (event, player) {
						return event.source;
					},
					logTarget: "source",
					async content(event, trigger, player) {
						let result;

						// step 0
						if (trigger.cards.length) {
							player.addMark("xinshimrfz_give", trigger.cards.length, false);
						}

						// step 1 & 2 loop (original event.goto(1))
						while (player.countMark("xinshimrfz_give") >= 2) {
							// step 1
							result = await player
								.chooseControl("basic", "trick", "equip", "cancel2")
								.set("prompt", "选择获得一种类型的牌")
								.set("ai", () => {
									const aiPlayer = _status.event.player;
									if (
										aiPlayer.hp <= 3 &&
										!aiPlayer.countCards("h", {
											name: ["shan", "tao"],
										})
									)
										return "basic";
									if (
										aiPlayer.countCards("he", {
											type: "equip",
										}) < 2
									)
										return "equip";
									return "trick";
								})
								.forResult();
							player.removeMark("xinshimrfz_give", 2, false);

							// step 2
							if (result.control !== "cancel2") {
								const card = get.cardPile2(c => {
									return get.type(c, "trick") === result.control;
								});
								if (card) {
									const next = player.gain(card, "gain2", "log");
									next.gaintag.add("xinshimrfz");
									await next;
								}
								//@ts-ignore
								player.logSkill("xinshimrfz");
							}
							// event.goto(1) is handled by while loop condition
						}
					},
				},
			},
		},
});

translate({
	"anjielinamrfz": "安洁莉娜",
	"fanzhongmrfz": "反重",
	"fanzhongmrfz_info": "①准备阶段，你可以令你攻击范围内的一名没有‘反重’标记的其他角色获得‘反重’标记。②锁定技，拥有‘反重’标记的角色获得如下效果：1.当你不因此效果获得牌时，将牌置于武将牌上，你每使用一张牌便选择获得一张武将牌上的牌；2.弃牌阶段开始时，移除所有的‘反重’标记，其获得因此置于在武将牌上的牌。",
	"xinshimrfz": "信使",
	"xinshimrfz_info": "①当你累计获得来自其他角色的两张牌时，你可以从牌堆中获得一张你指定类型的牌；②出牌阶段，你可以选择一张手牌并交给一名其他角色（不能选择相同类型的牌且不能指定相同的角色），当你本回合因此：1.交出一张牌，摸一张牌：2.交出两张牌，获得你牌的角色交给你一张手牌，然后其摸一张牌；3.交出三张牌，你分配一个‘反重’标记给任意其他角色。③锁定技，你因【信使①】获得的牌本回合不计入手牌上限。",
});

characterIntro("anjielinamrfz", "安洁莉娜，本名安心院安洁莉娜。于叙拉古从事情报递送、货物运输等公开活动，推测身份：信使。</br>现作为实习术师干员，为罗德岛提供后勤保障、战场辅助与战术协同等服务。");
