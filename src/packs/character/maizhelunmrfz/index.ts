import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("maizhelunmrfz", {
			sex: "female",
			group: "lymrfz",
			hp: 3,
			skills: ["kanchamrfz","longtengmrfz"],
		});

skill({
	"kanchamrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			filterCard: true,
			intro: {
				content: "已发动#次【勘查】",
			},
			check: function (card) {
				var player = _status.event.player;
				if (
					player.hasCard(function (card) {
						return get.type(card) == "equip";
					})
				)
					return get.type(card) == "equip";
				if (
					player.hasCard(function (card) {
						return get.type(card) == "trick";
					})
				)
					return get.type(card) == "trick";
				return 6 - get.value(card);
			},
			async content(event, trigger, player) {
				const { cards } = event;
				let result;

				// step 0
				event.cards2 = cards[0];
				result = await player
					.chooseControl("顶部", "底部")
					.set("prompt", get.prompt("kanchamrfz"))
					.set("prompt2", "【勘查】:请选择展示牌堆顶还是牌堆底" + (player.countMark("kanchamrfz") + 3) + "张牌")
					.set("ai", () => {
						return [0, 1].randomGet();
					})
					.forResult();

				// step 1
				const num = player.countMark("kanchamrfz") + 3;
				if (result.index === 0) {
					const cards = game.cardsGotoOrdering(get.cards(num)).cards;
					event.cards = cards;
				} else if (result.index === 1) {
					//@ts-ignore
					event.cards = get.bottomCards(num);
				} else {
					return;
				}

				// step 2
				const list = [];
				player.showCards(event.cards, get.translation(player) + "发动了【勘查】");
				for (let i = 0; i < event.cards.length; i++) {
					if (get.type(event.cards2, "trick") !== get.type(event.cards[i], "trick")) {
						list.push(event.cards[i]);
					}
				}
				if (list.length) {
					await player.gain(list, "gain2");
				}

				// step 3
				if (player.countMark("kanchamrfz") < 3) {
					player.addMark("kanchamrfz", 1, false);
				}
			},
			ai: {
				order: 13,
				threaten: 1.1,
				result: {
					player: 1,
				},
			},
		},
	"longtengmrfz": {
			markimage: "extension/WhichWay/image/skill/mrfz_LTF.png",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 8,
			trigger: {
				player: "loseAfter",
				global: "loseAsyncAfter",
			},
			filter: function (event, player) {
				if (player.isPhase("phaseDiscard", false)) return false;
				if (event.type != "discard" || event.getlx === false) return;
				var evt = event.getl(player);
				for (var i = 0; i < evt.cards2.length; i++) {
					if (get.position(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false) == "d") {
						return true;
					}
				}
				return false;
			},
			direct: true,
			async content(event, trigger, player) {
				let result;

				// step 0
				event.cards2 = cards[0];
				const cards = [];
				const evt = trigger.getl(player);
				for (let i = 0; i < evt.cards2.length; i++) {
					if (get.position(evt.cards2[i]) === "d") {
						cards.push(evt.cards2[i]);
					}
				}
				if (!cards.length) {
					return;
				}

				if (cards.length > 1) {
					result = await player
						.chooseButton(["【龙腾】:请选择一张牌", cards])
						.set("ai", button => {
							const aiPlayer = _status.event.player;
							if (
								game.hasPlayer(current => {
									return get.attitude(aiPlayer, current) > 2;
								})
							)
								return get.type(button.link) === "equip" || get.type(button.link, "trick") === "trick";
							return get.type(button.link) === "basic";
						})
						.forResult();

					// step 1
					if (result.links && result.links.length) {
						event.cards = result.links;
					}
				} else {
					event.cards = cards;
					// goto 2: skip step 1 assignment, proceed to step 2
				}

				// step 2
				result = await player
					.chooseTarget(
						"【龙腾】:请选择一名角色，并将" +
							get.translation(event.cards) +
							"(" +
							get.translation(get.type(event.cards[0], "trick")) +
							"牌) 置于该角色武将牌上",
						(card, player, target) => {
							return target.getExpansions("longtengmrfz").length === 0;
						}
					)
					.set("ai", target => {
						const aiPlayer = _status.event.player;
						const type = get.type2(event.cards[0]);
						if (type === "basic") return -get.attitude(aiPlayer, target);
						else return get.attitude(aiPlayer, target) > 2;
					})
					.forResult();

				// step 3
				if (result.targets) {
					const target = result.targets[0];
					const next = target.addToExpansion(event.cards, target, "give");
					next.gaintag.add("longtengmrfz");
					await next;
					target.addSkill("longtengmrfz_changeI");
					//@ts-ignore
					player.logSkill("longtengmrfz", target);
				}
			},
			group: "longtengmrfz_clear",
			global: ["longtengmrfz_basic_1", "longtengmrfz_basic_2", "longtengmrfz_trick", "longtengmrfz_equip"],
			subSkill: {
				changeI: {
					silent: true,
					charlotte: true,
					trigger: { player: "longtengmrfzAfter" },
					async content(event, trigger, player) {
						player.removeSkill("longtengmrfz_changeI");
						if (player.isTypeExpansions("longtengmrfz", "basic")) player.changeMarkImage("longtengmrfz", "mrfz_LTF");
						if (player.isTypeExpansions("longtengmrfz", "trick")) player.changeMarkImage("longtengmrfz", "mrfz_LTL");
						if (player.isTypeExpansions("longtengmrfz", "equip")) player.changeMarkImage("longtengmrfz", "mrfz_LTA");
					},
				},
				basic_1: {
					charlotte: true,
					forced: true,
					trigger: { player: "phaseDrawBegin" },
					filter: function (event, player) {
						return player.isTypeExpansions("longtengmrfz", "basic");
					},
					async content(event, trigger, player) {
						trigger.num--;
						//@ts-ignore
						player.logSkill("longtengmrfz");
					},
				},
				basic_2: {
					charlotte: true,
					forced: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.isTypeExpansions("longtengmrfz", "basic");
					},
					async content(event, trigger, player) {
						player.draw();
						//@ts-ignore
						player.logSkill("longtengmrfz");
					},
				},
				trick: {
					direct: true,
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						//@ts-ignore
						if (get.type(event.card, "trick") != "trick") return false;
						if (player.hasSkill("longtengmrfz_trick2")) return false;
						if (player.isTypeExpansions("longtengmrfz", "trick") == false) return false;
						var info = get.info(event.card);
						if (info.allowMultiple == false) return false;
						if (event.targets && !info.multitarget) {
							if (
								game.hasPlayer(function (current) {
									return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
								})
							) {
								return true;
							}
						}
						return false;
					},
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.chooseTarget(
								"【龙腾】:你可以为此牌 (" + get.translation(trigger.card) + ") 额外指定一个目标",
								(card, player, target) => {
									const aiPlayer = _status.event.player;
									if (_status.event.targets.includes(target)) return false;
									//@ts-ignore
									if (aiPlayer.canUse(trigger.card, target, true) === false) return false;
									return lib.filter.targetEnabled2(_status.event.card, aiPlayer, target);
								}
							)
							.set("ai", target => {
								const aiTrigger = _status.event.getTrigger();
								const aiPlayer = _status.event.player;
								return get.effect(target, aiTrigger.card, aiPlayer, aiPlayer);
							})
							.set("targets", trigger.targets)
							.set("card", trigger.card)
							.forResult();

						// step 1
						if (result.targets) {
							if (!event.isMine() && !event.isOnline()) {
								await game.delayx();
							}
							event.targets = result.targets;
						} else {
							return;
						}

						//@ts-ignore step 2
						player.logSkill("longtengmrfz", event.targets);
						trigger.targets.addArray(event.targets);

						// step 3
						if (get.tag(trigger.card, "damage")) {
							result = await player.chooseBool("【龙腾】:是否令此牌伤害 +1？").forResult();
						} else {
							return;
						}

						// step 4
						trigger.baseDamage++;
						player.addTempSkill("longtengmrfz_trick2");
					},
				},
				trick2: {
					charlotte: true,
				},
				equip: {
					trigger: { player: "useCard2" },
					firstDo: true,
					filter: function (event, player) {
						//@ts-ignore
						if (get.type(event.card) != "basic") return false;
						if (player.isTypeExpansions("longtengmrfz", "equip") == false) return false;
						return true;
					},
					async content(event, trigger, player) {
						let result;

						// step 0
						const list = ["不计入次数限制"];
						if (
							game.hasPlayer(current => {
								return !trigger.targets.includes(current) && !!player.canUse(trigger.card, current, false);
							})
						)
							list.add("增加目标");
						if (trigger.card.name === "sha") list.add("伤害基数 +1");

						result = await player
							.chooseControl(list)
							.set("prompt", "【龙腾】:请选择一项")
							.set("ai", () => {
								const aiPlayer = _status.event.player;
								const num = [];
								for (let i = 0; i < list.length; i++) {
									num.add(i);
								}
								if (
									get.name(_status.event.TriCard) === "sha" &&
									aiPlayer.getCardUsable("sha") === 0 &&
									aiPlayer.countCards("h", "sha") > 0
								)
									return 0;
								if (
									get.name(_status.event.TriCard) === "sha" &&
									(aiPlayer.countCards("h", "sha") === 0 || aiPlayer.getCardUsable("sha") > 0)
								)
									return list.length - 1;
								if (get.name(_status.event.TriCard) === "jiu") return 0;
								return num.randomGet();
							})
							.set("TriCard", trigger.card)
							.forResult();

						// step 1
						if (result && result.control) {
							game.log(player, "选择了", result.control);
							player.popup(result.control);
							//@ts-ignore
							player.logSkill("longtengmrfz");
						}

						if (result.control === "不计入次数限制") {
							if (trigger.addCount !== false && (trigger.card.name === "sha" || trigger.card.name === "jiu")) {
								trigger.addCount = false;
								if (trigger.card.name === "sha") trigger.player.getStat().card.sha--;
								else trigger.player.getStat().card.jiu--;
							}
							return;
						} else if (result.control === "增加目标") {
							result = await player
								.chooseTarget(
									[1, 2],
									"【龙腾】:你可以为此牌 (" + get.translation(trigger.card) + ") 额外指定两个目标",
									(card, player, target) => {
										const aiPlayer = _status.event.player;
										if (_status.event.targets.includes(target)) return false;
										//@ts-ignore
										if (aiPlayer.canUse(trigger.card, target, true) === false) return false;
										return lib.filter.targetEnabled2(_status.event.card, aiPlayer, target);
									}
								)
								.set("ai", target => {
									const aiTrigger = _status.event.getTrigger();
									const aiPlayer = _status.event.player;
									return get.effect(target, aiTrigger.card, aiPlayer, aiPlayer);
								})
								.set("targets", trigger.targets)
								.set("card", trigger.card)
								.forResult();

							// step 2
							if (result.targets) {
								for (let i = 0; i < result.targets.length; i++) {
									trigger.targets.push(result.targets[i]);
									player.line(result.targets[i]);
								}
							}
						} else if (result.control === "伤害基数 +1") {
							if (!trigger.baseDamage) trigger.baseDamage = 1;
							trigger.baseDamage += 1;
							return;
						} else {
							return;
						}
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: ["phaseZhunbeiBegin", "dieBegin"] },
					async content(event, trigger, player) {
						for (const current of game.players) {
							const cards = current.getExpansions("longtengmrfz");
							if (current.getExpansions("longtengmrfz").length) current.loseToDiscardpile(cards);
						}
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
	"quanshanmrfz": {
			audio: 2,
			trigger: { global: "phaseEnd" },
			filter: function (event, player) {
				return event.player.countCards("h") == 0 && event.player != player;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.player) + "将手牌补至3张并令其获得一些负面效果？";
			},
			check: function (event, player) {
				if (event.player.hp < 2 && get.attitude(player, event.player) > 0) return true;
				if (get.attitude(player, event.player) > 2 && event.player.maxHp > 2) return Math.random() > 0.6;
				if (event.player.hp < 2) return false;
				return get.attitude(player, event.player) < 2;
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				//@ts-ignore
				target.drawTo(Math.min(3, target.maxHp));
				target.addSkill("quanshanmrfz_eff");
			},
			group: ["quanshanmrfz_clear", "quanshanmrfz_clear2"],
			subSkill: {
				clear2: {
					silent: true,
					charlotte: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						return event.player.hasSkill("quanshanmrfz_eff");
					},
					async content(event, trigger, player) {
						const target = trigger.player;
						target.removeMark("quanshanmrfz_eff", target.countMark("quanshanmrfz_eff"));
						target.removeSkill("quanshanmrfz_eff");
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "dieBegin" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.hasMark("quanshanmrfz") || current.hasSkill("quanshanmrfz_eff");
						});
					},
					async content(event, trigger, player) {
						for (const current of game.players) {
							current.removeMark("quanshanmrfz_eff", current.countMark("quanshanmrfz_eff"));
							current.removeSkill("quanshanmrfz_eff");
						}
					},
				},
				eff: {
					marktext: "恶",
					intro: {
						name: "恶",
						content: "·当你造成伤害时，你获得一个‘恶’</br>·你共有#个‘恶’",
					},
					mark: true,
					trigger: { source: "damageEnd" },
					async content(event, trigger, player) {
						//@ts-ignore
						player.logSkill("quanshanmrfz");
						player.addMark("quanshanmrfz_eff");
						if (player.getHandcardLimit() <= 0) {
							//@ts-ignore
							event.getParent("phaseUse").skipped = true;
						}
					},
					mod: {
						maxHandcard: function (player, num) {
							return num - player.countMark("quanshanmrfz_eff");
						},
					},
				},
			},
		},
	"chuemrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0 && player.inRange(current);
				});
			},
			filterTarget: function (card, player, target) {
				return player.inRange(target) && target != player && target.countCards("h") > 0;
			},
			check: function () {
				return -1;
			},
			selectTarget: [1, 2],
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let result;
				const targets = event.targets;

				// Main loop (original event.num iteration with goto logic)
				while (event.num < targets.length) {
					const target = targets[event.num];
					const hs = target.getCards("h");
					let colred = false;

					// Check for red cards in hand
					for (const card of hs) {
						if (get.color(card) === "red") {
							colred = true;
							break;
						}
					}

					player.viewHandcards(target);
					game.log(player, "观看了", target, "的手牌");

					if (colred) {
						// Has red cards: choose suit to discard
						const list = [];
						for (const card of hs) {
							if (list.length === 2) break;
							if (get.suit(card) === "club" && !list.includes("梅花")) list.add("梅花");
							if (get.suit(card) === "spade" && !list.includes("黑桃")) list.add("黑桃");
						}
						list.add("cancel2");

						if (list.length > 1) {
							result = await player
								.chooseControl(list)
								.set("prompt", "【除恶】:请选择一个花色，然后其 (" + get.translation(target) + ") 弃置该花色的所有牌")
								.set("ai", () => {
									const aiPlayer = _status.event.player;
									const handCards = target.getCards();
									let num = 0;
									for (const c of handCards) {
										if (get.suit(c) === "club") num++;
										if (get.suit(c) === "spade") num--;
									}
									if (list.length === 1) return 0;
									if (num > 0) return 0;
									return 1;
								})
								.forResult();

							// Step 2 logic: discard cards of chosen suit
							if (result.control !== "cancel2") {
								const dis = [];
								for (const card of target.getCards()) {
									if (get.suit(card) === (result.control === "黑桃" ? "spade" : "club")) {
										dis.push(card);
									}
								}
								await target.discard(dis);
								await player.draw(dis.length);
							}
						}
					} else {
						// No red cards: choose to discard all handcards
						result = await player.chooseBool("【除恶】:是否弃置其 (" + get.translation(target) + ") 所有手牌？").forResult();

						if (result.bool) {
							const dis = target.getCards();
							await target.discard(dis);

							if (target.hasMark("quanshanmrfz_eff")) {
								const markCount = target.countMark("quanshanmrfz_eff");
								await target.damage(markCount);
								target.removeMark("quanshanmrfz_eff", markCount);
							}
						}
					}

					// Step 5 logic (executed after bool branch or skipped after suit branch)
					if (!colred && result?.bool && !target.hasSkill("quanshanmrfz_eff")) {
						//@ts-ignore
						await target.drawTo(Math.min(3, target.maxHp));
						target.addSkill("quanshanmrfz_eff");
						player.popup("劝善");
						//@ts-ignore
						player.logSkill("quanshanmrfz", target);
					}

					// Loop control: move to next target
					event.num++;
				}
			},
			ai: {
				order: 13,
				result: {
					player: 1,
					target: -1,
				},
			},
		},
	"xuebianmrfz2": {
			charlotte: true,
		},
	"xinbangmrfz": {
			audio: 2,
			trigger: {
				player: "phaseDrawBegin2",
			},
			direct: true,
			filter: function (event, player) {
				return event.num > 0 && !event.numFixed;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				player.storage.xinbangmrfz = [];
				const num = get.copy(trigger.num);
				result = await player
					.chooseTarget(
						get.prompt("xinbangmrfz"),
						"选择至多" + get.translation(num) + "名其他角色，其选择让你定向摸牌，然后你少摸等量的牌",
						[1, num],
						(card, player, target) => {
							return player !== target;
						}
					)
					.set("ai", target => {
						const att = get.attitude(_status.event.player, target);
						return att > 0;
					})
					.forResult();

				// step 1
				if (result && result.targets) {
					event.targets = result.targets;
					trigger.num -= result.targets.length;

					// step 2, 3, 4 loop (original event.goto(2))
					for (let i = 0; i < event.targets.length; i++) {
						const target = event.targets[i];
						const att = get.attitude(target, player);
						target.addTempSkill("xinbangmrfz2", {
							player: "phaseUseEnd",
						});
						result = await target
							.chooseControl("basic", "trick", "equip")
							.set("prompt", "【兴邦】：请让" + get.translation(player) + "摸一张指定类型牌，当此牌造成伤害时，你与其各摸一张牌")
							.set("ai", () => {
								if (att > 0) return [1, 2].randomGet();
								return 0;
							})
							.forResult();

						// step 3
						const card = get.cardPile2(c => {
							return get.type(c, "trick") === result.control;
						});
						if (card) {
							const next = player.gain(card, "gain2");
							next.gaintag = ["xinbangmrfz"];
							await next;
						} else {
							player.chat("牌堆中没有" + get.translation(result.control) + "牌了！");
						}

						// step 4
						const cards = player.getCards("h", c => {
							return c.hasGaintag("xinbangmrfz");
						});
						for (const c of cards) {
							c.storage.xinbangmrfz = true;
						}
					}
				} else {
					return;
				}

				// step 5
				if (trigger.num <= 0) {
					await game.delay();
				}
			},
			group: ["xinbangmrfz_draw", "xinbangmrfz_lose"],
			subSkill: {
				draw: {
					audio: "xinbangmrfz",
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						if (!event.cards || event.cards.length > 1) return false;
						return event.card.storage && event.card.storage.xinbangmrfz == true;
					},
					forced: true,
					async content(event, trigger, player) {
						const result = await player
							.chooseTarget("【兴邦】:请选择一名其他角色，然后你与其各摸一张牌", true, function (card, player, target) {
								return target != player && target.hasSkill("xinbangmrfz2");
							})
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.attitude(player, target) > 0;
							})
							.forResult();
						if (result.targets) {
							result.targets[0].draw();
							player.draw();
						}
					},
				},
				lose: {
					silent: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return (
							player.countCards("h", function (card) {
								return card.hasGaintag("xinbangmrfz");
							}) > 0
						);
					},
					async content(event, trigger, player) {
						player.removeGaintag("xinbangmrfz");
					},
				},
			},
		},
	"xinbangmrfz2": {
			charlotte: true,
			silent: true,
			onremove: true,
		},
	"ruiyamrfz": {
			mark: true,
			intro: {
				content: function (event, player) {
					return "上一个成为一唯一目标的【杀】的角色：" + (player.storage.ruiyamrfz ? get.translation(player.storage.ruiyamrfz) : "无");
				},
			},
			audio: 2,
			trigger: {
				player: "useCard2",
			},
			filter: function (event, player) {
				return (
					event.cards &&
					event.card.name == "sha" &&
					event.targets &&
					event.targets.length == 1 &&
					event.targets[0] == player.storage.ruiyamrfz
				);
			},
			prompt: "【锐牙】:是否令此杀伤害+1？",
			check: function (event, player) {
				return get.attitude(player, event.targets[0]) < 2;
			},
			async content(event, trigger, player) {
				const target = trigger.targets[0];
				target.addTempSkill("ruiyamrfz_dam");
				target.storage.ruiyamrfz_dam = {
					card: trigger.card,
				};
			},
			group: "ruiyamrfz_mark",
			subSkill: {
				mark: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event, player) {
						if (!event.targets || event.targets.length > 1) return false;
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						player.storage.ruiyamrfz = trigger.target;
					},
				},
				dam: {
					onremove: function (player) {
						delete player.storage.ruiyamrfz_dam;
					},
					trigger: {
						player: "damageBegin3",
					},
					filter: function (event, player) {
						var info = player.storage.ruiyamrfz_dam;
						return event.card && event.card == info.card;
					},
					silent: true,
					popup: false,
					forced: true,
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
		},
	"shouliemrfz": {
			marktext: "矢",
			intro: {
				name: "矢",
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 4,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.getExpansions("shouliemrfz").length >= 3) return false;
				return (
					player.countCards("he", function (card) {
						return get.tag(card, "damage") > 0;
					}) > 0
				);
			},
			filterCard: function (card) {
				return get.tag(card, "damage");
			},
			selectCard: function () {
				var player = _status.event.player;
				return [1, 3 - player.getExpansions("shouliemrfz").length];
			},
			check: function (card) {
				return 10 - get.value(card) || card.name == "sha";
			},
			prompt: "【狩猎】：将任意张带有伤害标签的牌置于你的武将牌上，称之为‘矢’",
			discard: false,
			lose: false,
			async content(event, trigger, player) {
				const { cards } = event;
				player.addToExpansion(cards, player, "giveAuto").gaintag.add("shouliemrfz");
			},
			group: ["shouliemrfz_use", "shouliemrfz_shasha"],
			ai: {
				order: 13,
				threaten: function () {
					var player = _status.event.player;
					return 1.4 + player.getExpansions("shouliemrfz").length * 0.2;
				},
				result: {
					player: 1,
				},
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
				use: {
					audio: "shouliemrfz",
					enable: ["chooseToRespond", "chooseToUse"],
					filter: function (event, player) {
						if (player.getExpansions("shouliemrfz").length < 1 || player.hasSkill("shouliemrfz_ban")) return false;
						return event.filterCard({ name: "sha" }, player, event);
					},
					chooseButton: {
						dialog: function (event, player) {
							return ui.create.dialog("狩猎", player.getExpansions("shouliemrfz"), "hidden");
						},
						backup: function (links, player) {
							return {
								viewAs: {
									name: "sha",
									nature: "stab",
								},
								cards: links,
								selectCard: -1,
								position: "x",
								filterCard: card => lib.skill["shouliemrfz_use_backup"].cards.includes(card),
								popname: true,
								precontent: function () {
									player.addTempSkill("shouliemrfz_ban", "phaseEnd");
								},
							};
						},
						prompt: function (links, player) {
							//@ts-ignore
							return "【狩猎】：将" + get.translation(links.name) + "当做一张刺【杀】使用或打出";
						},
					},
					ai: {
						order: 2.95,
						respondSha: true,
						result: {
							player: 1,
						},
						skillTagFilter: function (player, tag, arg) {
							if (player.getExpansions("shouliemrfz").length < 1) return false;
						},
					},
				},
				shasha: {
					markimage: "extension/WhichWay/image/skill/taifengmrfz.png",
					intro: {
						content: function (event, player) {
							return (
								"你成为了" +
								get.translation(
									game.findPlayer(function (current) {
										return current != player && current.hasSkill("shouliemrfz");
									})
								) +
								"的猎物"
							);
						},
					},
					audio: "shouliemrfz",
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						//@ts-ignore
						if (player.getHistory("skipped").includes("phaseUse") || player.getHistory("skipped").includes("phaseDiscard")) return false;
						return true;
					},
					check: function (event, player) {
						if (
							player.countCards("j", function (card) {
								return get.name(card) == "lebu";
							}) > 0 &&
							player.countCards("h") + 2 > player.getHandcardLimit()
						)
							return true;
						return (
							player.getExpansions("shouliemrfz").length +
								player.countCards("h", function (card) {
									return get.name(card) == "sha";
								}) >
							2
						);
					},
					prompt: "【狩猎】：是否跳过出牌阶段和弃牌阶段，然后选择一名其他角色，直到你的下个回合开始时，每个其他角色的结束阶段，你都可以对其使用一张【杀】？",
					async content(event, trigger, player) {
						player.skip("phaseUse");
						player.skip("phaseDiscard");
						player.addSkill("shouliemrfz_usesha");
						const result = await player
							.chooseTarget(
								"【狩猎】：请选择一名其他角色",
								function (card, player, target) {
									return target != player;
								},
								true
							)
							.set("ai", target => get.attitude2(target) < 0)
							.forResult();

						if (result.targets) {
							var target = result.targets[0];
							player.storage.shouliemrfz_shasha = target;
							target.addMark("shouliemrfz_shasha", 1, false);
							player.line(target);
						}
					},
					ai: {
						expose: 0.1,
					},
				},
				rem: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseBegin" },
					async content(event, trigger, player) {
						for (const current of game.players) {
							current.removeMark("shouliemrfz_shasha", 1145141919810, false);
						}
						player.removeSkill("shouliemrfz_usesha");
						delete player.storage.shouliemrfz_shasha;
					},
				},
				usesha: {
					trigger: {
						global: "phaseJieshuBegin",
					},
					direct: true,
					filter: function (event, player) {
						if (event.player == player) return false;
						return (
							event.player.isIn() &&
							lib.filter.targetEnabled({ name: "sha" }, player, event.player) &&
							(player.hasSha() || _status.connectMode || player.getExpansions("shouliemrfz").length > 0)
						);
					},
					async content(event, trigger, player) {
						const target = game.findPlayer(function (current) {
							return current != player && player.storage.shouliemrfz_shasha == current;
						});
						player
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") return false;
									//@ts-ignore
									return lib.filter.filterCard.apply(this, arguments);
								},
								"【狩猎】：是否对" + get.translation(target) + "使用一张【杀】？"
							)
							.set("logSkill", "shouliemrfz")
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								//@ts-ignore
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("sourcex", target);
					},
					group: "shouliemrfz_rem",
				},
			},
		},
	"zhuhuo2mrfz": {
			audio: 2,
		},
	"newgaihuamrfz_backup": {
			sourceSkill: "newgaihuamrfz",
			async precontent(event, trigger, player) {
				delete event.result.skill;
				var name = event.result.card?.name,
					//@ts-ignore
					cards = event.result.card?.cards.slice(0);
				event.result.cards = cards;
				var rcard = cards[0],
					card;
				if (rcard.name == name) card = get.autoViewAs(rcard);
				else card = get.autoViewAs({ name, isCard: true });
				event.result.card = card;
			},
			filterCard: function () {
				return false;
			},
			selectCard: -1,
		},
});

translate({
	"maizhelunmrfz": "麦哲伦",
	"kanchamrfz": "勘查",
	"kanchamrfz_info": "出牌阶段限一次，你可以弃置一张手牌，然后你展示牌堆顶或牌堆底的X+3张牌，获得与你弃置的牌类别不同的牌。（X=你发动此技能的次数，X至多为3）",
	"longtengmrfz": "龙腾",
	"longtengmrfz_info": "①当你不在弃牌阶段因弃置而失去牌时，你可以将其中一张牌置于一名武将牌上没有“龙腾”角色的武将牌上，此牌称之为“龙腾”；拥有“龙腾”的角色根据“龙腾”牌的类型获得对应的效果：</br>1.基本牌：锁定技，摸牌阶段摸牌数-1，出牌阶段结束时摸一张牌。</br>2.锦囊牌：当你使用一张单一目标的普通锦囊牌时，你可以令此牌的目标+1，若此牌带有伤害标签，你可以令此牌造成的伤害+1，然后本回合此技能失效。</br>3.装备牌：当你使用一张基本牌选择目标后，你可以令此牌的目标+2、伤害基数+1或此牌不计入使用次数。</br>②锁定技，你的准备阶段或你死亡时，你移除全场所有的“龙腾”。",
	"quanshanmrfz": "劝善",
	"quanshanmrfz_info": "①每名其他角色的回合结束时，若该角色没有手牌，你可以令其将手牌补至体力上限（至多补至3张），然后其直到其回合结束阶段，其造成伤害后，获得一个‘恶’标记。②锁定技，有‘恶’标记角色的回合结束阶段，其移除其所有的‘恶’标记；拥有‘恶’标记的角色获得如下效果：1.手牌上限-X；2.出牌阶段，若你的手牌上限为0，你立刻结束出牌阶段。（X=你的‘恶’标记数量）",
	"chuemrfz": "除恶",
	"chuemrfz_info": "出牌阶段限一次，你可以依次观看你攻击范围内或有‘恶’标记的至多两名其他角色的手牌，若其中有红色的牌，你可以选择弃置其手牌中所有♣或♠牌并令你摸等量的牌，反之，你可以弃置其所有手牌，然后若其没有‘恶’标记，你对其发动一次【劝善】，反之你移除其所有的‘恶’标记并对其造成等量的伤害。",
	"xinbangmrfz": "兴邦",
	"xinbangmrfz_info": "摸牌阶段开始时，你可以少摸任意张牌并选择等量名的其他角色，令其选择让你从牌堆中获得一张一种类型的牌，然后你本回合使用这张牌造成伤害时，你与其各摸一张牌。",
	"ruiyamrfz": "锐牙",
	"ruiyamrfz_info": "当一名其他角色成为你使用的【杀】的唯一目标后，若其是你上次使用【杀】的唯一目标，你可以令此杀伤害+1。",
	"shouliemrfz": "狩猎",
	"shouliemrfz_info": "①出牌阶段，你可以将任意张带有伤害标签的牌置于你的武将牌上，称之为“矢”（至多为3）；每回合限一次，你可以将“矢”当做刺【杀】使用或打出。</br>②准备阶段，你可以跳过本回合的出牌阶段和弃牌阶段并选择一名其他角色，然后直到你下个回合开始阶段：其他角色的回合结束阶段，你可以对你选择的角色使用一张【杀】。",
});

characterIntro("maizhelunmrfz", "麦哲伦，莱茵生命实验室外勤专员，在合作协议的作用下，暂计划以罗德岛为据点，开始新一轮的探索活动。擅长操控高度模块化无人机，因地制宜进行攻击或支援友军。");
