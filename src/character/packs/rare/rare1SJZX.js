import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayMath } from "./../../../math/index.ts";

const tmpSave = window.whichWaySave.tmpSave;

/** @type {WhichWayCharacterPack} */
export default {
	character: {
		shuangyemrfz: ["female", "luomrfz", 4, ["canyinmrfz", "bingrenmrfz"], []],
		yueyuemrfz: ["female", "bomrfz", 4, ["xiyumrfz"], []],
		lutuomrfz: ["female", "bomrfz", 4, ["zhengyimrfz", "daosimrfz"], []],
		shendianmrfz: ["female", "yimrfz", 3, ["fumumrfz", "rouguangmrfz", "mizongmrfz"], []],
		yunjimrfz: ["female", "gemrfz", 3, ["lingkongmrfz", "mijianmrfz"], []],
		chengfengmrfz: ["male", "yanmrfz", 3, ["xiadaomrfz", "qunxiamrfz"], []],
		dongshimrfz: {
			sex: "female",
			group: "wumrfz",
			hp: 3,
			skills: ["gelimrfz"],
		},
		xielvmrfz: {
			sex: "female",
			group: "laimrfz",
			hp: 3,
			skills: ["lvmaimrfz", "tiaoxiemrfz"],
		},
	},
	skill: {
		//协律
		lvmaimrfz: {
			audio: ["作战中1", "作战中2"],
			zhuanhuanji(player, skill) {
				if (player.storage[skill] < 3) player.storage[skill]++;
				else player.storage[skill] = 0;
			},
			init(player, skill) {
				player.storage.lvmaimrfz = 0;
				player.addTip("lvmaimrfz_tip", `律脉 ${get.translation(lib.skill.lvmaimrfz.transfer(player))}`);
			},
			trigger: {
				player: ["useCardAfter", "respondAfter"],
			},
			filter(event, player) {
				return player.countCards("he") > 0;
			},
			mark: true,
			intro: {
				content(storage, player) {
					return `当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为${get.translation(lib.skill.lvmaimrfz.transfer(player))}，你摸一张牌。`;
				},
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("lvmaimrfz"))
					.set("prompt2", `你可以重铸一张牌,然后若你手牌中最多的花色为${get.translation(lib.skill.lvmaimrfz.transfer(player))},你摸一张牌`)
					.set("filterCard", card => {
						return get.player().canRecast(card);
					})
					.set("ai", function (card) {
						return 8 - get.value(card);
					})
					.set("position", "he")
					.forResult();
			},
			async content(event, trigger, player) {
				await player.recast(event.cards);
				let suit = lib.skill.lvmaimrfz.transfer(player);
				let suitcount = lib.suit.map(s => player.countCards("h", { suit: s }));
				let max = Math.max(...suitcount);
				if (player.countCards("h", { suit: suit }) === max) {
					await player.draw();
					player.changeZhuanhuanji("lvmaimrfz");
					player.addTip("lvmaimrfz_tip", `律脉 ${get.translation(lib.skill.lvmaimrfz.transfer(player))}`);
				}
			},
			transfer(player) {
				switch (player.storage.lvmaimrfz) {
					case 0:
						return "spade";
					case 1:
						return "club";
					case 2:
						return "heart";
					case 3:
						return "diamond";
					default:
						return "";
				}
			},
		},
		tiaoxiemrfz: {
			audio: ["作战中3", "作战中4"],
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: true,
			mark: true,
			intro: {
				content(storage, player) {
					return `已使用的花色：${get.translation(storage)}`;
				},
			},
			enable: "chooseToUse",
			filter(event, player) {
				return (
					player.getCards("h", card => {
						if (!["basic", "trick"].includes(get.type(card))) return false;
						let suit = get.suit(card);
						return player.countCards("h", card => get.suit(card) !== suit) > 0 && event.filterCard(card, player, event);
					}).length > 0
				);
			},
			filterCard(card) {
				let player = get.player(),
					event = get.event();
				let suit = get.suit(card);
				//@ts-ignore
				if (event.skillDialog instanceof HTMLElement) {
					//@ts-ignore
					event.skillDialog.remove();
					//@ts-ignore
					event.skillDialog = ui.create.dialog(`###【调协】###${lib.skill.tiaoxiemrfz.prompt()}`);
				}
				if (ui.selected.cards.length < 1) {
					//@ts-ignore
					if (Object.keys(event.getParent("phaseUse")).length > 0 && event.getParent("phaseUse").player === player && !player.hasUseTarget(card)) return false;
					else if (!event._backup.filterCard(card, player)) return false;
					return player.countCards("h", card => get.suit(card) !== suit) > 0 && ["basic", "trick"].includes(get.type(card)) && !player.getStorage("tiaoxiemrfz").includes(suit);
				}
				return suit !== get.suit(ui.selected.cards[0]);
			},
			selectCard: 2,
			check(card) {
				let player = get.player();
				if (ui.selected.cards.length < 1) return player.getUseValue(card);
				return player.getUseValue(card) - player.getUseValue(ui.selected.cards[0]);
			},
			prompt() {
				let player = get.player();
				return ui.selected.cards.length < 1 ? `【调协】:请选择你要被当作使用的牌<br>(当前已使用的花色：${get.translation(player.getStorage("tiaoxiemrfz"))})` : `你可以将一张手牌当【${get.translation(ui.selected.cards[0].name)}】使用`;
			},
			complexCard: true,
			discard: false,
			lose: false,
			delay: 0,
			async content(event, trigger, player) {
				player.storage.tiaoxiemrfz.push(get.suit(event.cards[0]));
				let name = get.name(event.cards[0]);

				//@ts-ignore
				if (Object.keys(event.getParent("phaseUse")).length>0 && event.getParent("phaseUse").player === player) await player.chooseUseTarget({ name: name }, [event.cards[1]]).set("forced", true);
				else {
					//@ts-ignore
					if (name === "wuxie") event._trigger = event.getParent(2)._trigger;
					const result = await player.useCard({ name: name }, [event.cards[1]]).set("forced", true).forResult();
					//@ts-ignore
					event.getParent(2)._result = result;
				}
			},
			group: ["tiaoxiemrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.storage.tiaoxiemrfz = [];
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},

		//冬时
		gelimrfz: {
			audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
			forced: true,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				//@ts-ignore
				let discarded = Array.from(ui.discardPile.childNodes)
					//@ts-ignore
					.map(i => get.number(i))
					// @ts-ignore
					.filter(i => ![null, "unsure", undefined].includes(i));
				if (discarded.length < 1) return false;
				//@ts-ignore
				let mean = whichWayMath.mean(discarded);
				//@ts-ignore
				let sd = whichWayMath.std(discarded);
				//@ts-ignore
				return get.number(event.card) > mean + sd || get.number(event.card) < mean - sd;
			},
			mark: true,
			intro: {
				content() {
					let discarded = Array.from(ui.discardPile.childNodes)
						//@ts-ignore
						.map(i => get.number(i))
						// @ts-ignore
						.filter(i => ![null, "unsure", undefined].includes(i));
					if (discarded.length < 1) return `弃牌堆中没有牌!`;
					//@ts-ignore
					let mean = whichWayMath.mean(discarded);
					//@ts-ignore
					let sd = whichWayMath.std(discarded);
					let str = [];
					for (let i = 1; i < 4; i++) {
						str.push(`正负${i}个标准差:(${mean - i * sd} , ${mean + i * sd})`);
					}
					return str.join("<br>");
				},
			},
			// @ts-ignore
			async content(event, trigger, player) {
				//@ts-ignore
				let discarded = Array.from(ui.discardPile.childNodes)
					//@ts-ignore
					.map(i => get.number(i))
					// @ts-ignore
					.filter(i => ![null, "unsure", undefined].includes(i));
				//@ts-ignore
				let mean = whichWayMath.mean(discarded);
				//@ts-ignore
				let sd = whichWayMath.std(discarded);
				let num = get.number(trigger.card);
				let draw = 0;

				for (let i = 1; i < 4; i++) {
					//@ts-ignore
					if (num > mean + i * sd || num < mean - i * sd) {
						draw = i;
					}
				}

				if (draw > 0) player.draw(draw);
			},
		},

		//霜叶
		canyinmrfz: {
			mark: true,
			intro: {
				// @ts-ignore
				content: function (event, player) {
					var storage = player.storage.canyinmrfz;
					if (!storage || !player.isPhaseUsing()) return "无";
					return "本阶段不能使用或打出" + get.translation(storage) + "牌";
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "phaseUseBegin" },
			content: function () {
				"step 0";
				var cs = 1;
				// @ts-ignore
				if (player.hp < 2 && player.countCards("h", "tao") > 0) cs = 2;
				// @ts-ignore
				else if (
					// @ts-ignore
					player.hasSha() &&
					// @ts-ignore
					player.countCards("h", function (card) {
						return get.type(card) == "equip";
						// @ts-ignore
					}) < 3 &&
					// @ts-ignore
					player.canUseCardAtt("sha", false, true)
				)
					cs = 2;
				// @ts-ignore
				else if (
					// @ts-ignore
					player.countCards("h", function (card) {
						return get.type2(card) == "trick" && card.name != "wuxie";
					}) > 2
				)
					cs = 0;
				// @ts-ignore
				player
					.chooseControl()
					.set("choiceList", ["基本：使用牌无距离限制且不可响应", "锦囊：摸两张牌", "装备：本阶段使用的第一张带有伤害类标签的牌伤害值或回复值+1"])
					.set("prompt", "【蚕吟】:请选择你不能使用的类型")
					.set("ai", function () {
						// @ts-ignore
						return _status.event.cs;
					})
					.set("cs", cs);
				("step 1");
				// @ts-ignore
				if (result.control) {
					var list = ["basic", "trick", "equip"];
					for (var i = 0; i < list.length; i++) {
						// @ts-ignore
						if (result.index == i) {
							// @ts-ignore
							if (result.index != 1) player.addTempSkill("canyinmrfz_" + list[i], "phaseUseEnd");
							// @ts-ignore
							else player.draw(2);
							// @ts-ignore
							player.addTempSkill("canyinmrfz_ban", "phaseUseEnd");
							// @ts-ignore
							player.storage.canyinmrfz = list[i];
							break;
						}
					}
				}
			},
			group: "canyinmrfz_rec",
			subSkill: {
				rec: {
					audio: "canyinmrfz",
					forced: true,
					trigger: { source: "dieAfter" },
					filter: function (event, player) {
						return event.player != player;
					},
					content: function () {
						// @ts-ignore
						player.recoverTo(player.maxHp);
					},
				},
				used: {
					charlotte: true,
				},
				ban: {
					mod: {
						cardEnabled: function (card, player) {
							if (get.type2(card) == player.storage.canyinmrfz) return false;
						},
					},
				},
				basic: {
					mod: {
						// @ts-ignore
						// @ts-ignore
						targetInRange(card, player, target, now) {
							if (["trick", "delay", "basic"].includes(get.type(card))) return true;
						},
					},
					audio: "canyinmrfz",
					forced: true,
					trigger: {
						player: "useCard",
					},
					filter: function (event, player) {
						return (
							event.card &&
							(get.type(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
							game.hasPlayer(function (current) {
								return current != player;
							})
						);
					},
					content: function () {
						// @ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								// @ts-ignore
								return current != player;
							})
						);
					},
					ai: {
						directHit_ai: true,
					},
				},
				equip: {
					trigger: {
						player: "useCard",
					},
					usable: 1,
					forced: true,
					// @ts-ignore
					// @ts-ignore
					filter: function (event, player) {
						return get.tag(event.card, "damage") > 0 || get.tag(event.card, "recover") > 0;
					},
					content: function () {
						// @ts-ignore
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						// @ts-ignore
						trigger.baseDamage += 1;
						// @ts-ignore
						game.log(trigger.card, "的伤害值/回复值", "#y+1");
					},
				},
			},
		},
		bingrenmrfz: {
			audio: 2,
			trigger: {
				player: "useCardToTargeted",
				target: "useCardToTargeted",
			},
			filter: function (event, player) {
				// @ts-ignore
				if (event.card.name != "sha" || event.getParent(2).name == "bingrenmrfz") return false;
				// @ts-ignore
				return player == event.target || event.getParent().triggeredTargets3.length == 1;
			},
			check: function (event, player) {
				var target = player == event.player ? event.target : event.player;
				return (
					get.attitude(target, player) < 0 &&
					(player.countCards("h", card => {
						return card.name == "tao" || card.name == "jiu";
					}) > 0 ||
						player.hp > 1)
				);
			},
			prompt2: function (event, player) {
				// @ts-ignore
				var target = player == event.player ? event.target : event.player;
				return "【冰刃】:你可以<span class=firetext>流失一点体力</span>并视为对" + get.translation(target) + "使用一张冰【杀】";
			},
			content: function () {
				//成为目标 player==trigger.target
				//指定目标 player==trigger.player
				"step 0";
				// @ts-ignore
				player.loseHp();
				("step 1");
				// @ts-ignore
				if (player.isAlive()) {
					// @ts-ignore
					var target = player == trigger.player ? trigger.target : trigger.player;
					// @ts-ignore
					player.addTempSkill("bingrenmrfz_dam", "bingrenmrfzAfter");
					// @ts-ignore
					player.useCard({ name: "sha", nature: "ice", isCard: true, bingrenmrfz: true }, target).set("addCount", false);
				}
				// @ts-ignore
				else event.finish();
			},
			subSkill: {
				dam: {
					charlotte: true,
					silent: true,
					trigger: {
						source: "damageEnd",
					},
					// @ts-ignore
					// @ts-ignore
					filter: function (event, player) {
						if (!event.card) return false;
						// @ts-ignore
						return event.card.bingrenmrfz == true;
					},
					content: function () {
						"step 0";
						// @ts-ignore
						if (trigger.player.countCards("he") < 2) {
							// @ts-ignore
							player.removeSkill("bingrenmrfz_dam");
							// @ts-ignore
							trigger.player.turnOver();
							// @ts-ignore
							event.finish();
						} else {
							// @ts-ignore
							trigger.player.chooseToDiscard("【冰刃】:请弃置两张牌，或选择取消翻面", 2, "he").set("ai", function (card) {
								var player = _status.event.player;
								if (player.isTurnedOver()) return -1;
								return 8 - get.value(card);
							});
						}
						("step 1");
						// @ts-ignore
						if (result.bool == false) {
							// @ts-ignore
							trigger.player.turnOver();
						}
						// @ts-ignore
						player.removeSkill("bingrenmrfz_dam");
					},
				},
			},
		},
		//跃跃
		xiyumrfz: {
			onremove: true,
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			// @ts-ignore
			// @ts-ignore
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			filterCard: true,
			// @ts-ignore
			// @ts-ignore
			filterTarget: function (card, player, target) {
				return target != player;
			},
			check: card => {
				var ban = ["shan", "tao", "jiu"];
				for (var i of ban) {
					if (card.name == i) return false;
				}
				return 8 - get.value(card);
			},
			discard: false,
			lose: false,
			delay: false,
			content: function () {
				"step 0";
				// @ts-ignore
				for (var i of cards) {
					i.storage.xiyumrfz_give = true;
				}
				// @ts-ignore
				player.give(cards, target);
				("step 1");
				// @ts-ignore
				if (player.canUse("sha", target, false)) {
					// @ts-ignore
					player.storage.xiyumrfz = target;
					// @ts-ignore
					target.addTempSkill("xiyumrfz_suit", { global: "phaseUseEnd" });
					// @ts-ignore
					player.addTempSkill("xiyumrfz_gain", "phaseUseEnd");
					// @ts-ignore
					player.useCard({ name: "sha", storage: { xiyumrfz: true } }, target).set("addCount", false);
				}
			},
			subSkill: {
				gain: {
					charlotte: true,
					forced: true,
					trigger: { player: "useCardAfter" },
					// @ts-ignore
					// @ts-ignore
					filter: function (event, player) {
						return event.card && event.card.storage.xiyumrfz == true;
					},
					content: function () {
						"step 0";
						// @ts-ignore
						var target = player.storage.xiyumrfz,
							cards = target.getCards("he"),
							suit = target.getCards("he", card => {
								return card.storage.xiyumrfz_give;
							});
						// @ts-ignore
						event.cards = [];
						var storage = target.storage.xiyumrfz_suit;
						for (var i of suit) {
							if (!storage.includes(i.suit)) storage.add(i.suit);
						}
						for (var i of cards) {
							// @ts-ignore
							if (storage.includes(i.suit)) event.cards.push(i);
						}
						("step 1");
						// @ts-ignore
						if (event.cards.length) player.gain(event.cards, "gain2");
						// @ts-ignore
						player.removeSkill("xiyumrfz_gain");
						// @ts-ignore
						player.removeSkill("xiyumrfz_suit");
					},
				},
				suit: {
					audio: false,
					charlotte: true,
					silent: true,
					lastDo: true,
					onremove: player => {
						delete player.storage.xiyumrfz_suit;
					},
					init: player => {
						player.storage.xiyumrfz_suit = [];
					},
					trigger: { player: ["useCard", "respond"] },
					filter: function (event, player) {
						if (event.card.suit == undefined) return false;
						return lib.suit.includes(event.card.suit) && (!player.storage.xiyumrfz_suit || !player.storage.xiyumrfz_suit.includes(event.card.suit));
					},
					content: function () {
						// @ts-ignore
						if (!player.storage.xiyumrfz_suit) player.storage.xiyumrfz_suit = [];
						// @ts-ignore
						player.storage.xiyumrfz_suit.add(trigger.card.suit);
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},
		// 露托
		zhengyimrfz: {
			mod: {
				// @ts-ignore
				// @ts-ignore
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("zhengyimrfz")) {
						return true;
					}
				},
				// @ts-ignore
				// @ts-ignore
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("zhengyimrfz")) return false;
				},
				targetInRange: function (card) {
					if (card.hasGaintag && card.hasGaintag("zhengyimrfz")) return true;
				}, //QQQ
			},
			audio: 2,
			trigger: {
				global: "die",
			},
			// @ts-ignore
			// @ts-ignore
			filter(event, player) {
				return event.player.countCards("hej") > 0;
			},
			frequent: true,
			// @ts-ignore
			// @ts-ignore
			prompt2(event, player) {
				// @ts-ignore
				return `是否获得${get.translation(event.player)}区域内的${event.player.countCards("hej")}张牌？`;
			},
			async content(event, trigger, player) {
				// @ts-ignore
				event.togain = trigger.player.getCards("hej");
				// @ts-ignore
				player.gain(event.togain, trigger.player, "giveAuto", "bySelf").gaintag.add("zhengyimrfz");
			},
			group: "zhengyimrfz_draw",
			subSkill: {
				draw: {
					audio: "zhengyimrfz",
					forced: true,
					trigger: { player: "useCardAfter" },
					filter(event, player) {
						return player.hasHistory("lose", function (evt) {
							if (event != evt.getParent()) return false;
							// @ts-ignore
							for (var i in evt.gaintag_map) {
								if (
									// @ts-ignore
									evt.gaintag_map[i].includes("zhengyimrfz")
								)
									return true;
							}
							return false;
						});
					},
					// @ts-ignore
					async content(event, trigger, player) {
						let tagCards = player.getCards("h").filter(i => i.hasGaintag("zhengyimrfz"));
						//@ts-ignore
						player.drawTo(player.maxHp + tagCards.length);
					},
				},
			},
		},
		daosimrfz: {
			audio: 2,
			enable: ["chooseToUse", "chooseToRespond"],
			filter(event, player) {
				// @ts-ignore
				return (
					ui.discardPile.lastChild &&
					// @ts-ignore
					get.type(ui.discardPile.lastChild) != "equip" &&
					// @ts-ignore
					event.filterCard({ name: ui.discardPile.lastChild.name }, player, event)
				);
			},
			filterCard: true,
			check(card) {
				return get.value(ui.discardPile.lastChild) - get.value(card);
			},
			viewAs() {
				return {
					// @ts-ignore
					name: ui.discardPile.lastChild.name,
					// @ts-ignore
					nature: ui.discardPile.lastChild.nature,
				};
			},
			prompt() {
				return `你可以将一张手牌当做${get.translation(ui.discardPile.lastChild)}使用或打出`;
			},
			ai: {
				order: 8,
				result: {
					player: 1,
				},
			},
		},

		// 深靛
		fumumrfz: {
			audio: 2,
			trigger: {
				player: "useCard",
				target: "useCardToTargeted",
			},
			filter(event, player) {
				if (event.name !== "useCard" && event.player == player) return false;
				// @ts-ignore
				return get.isView(event.card);
			},
			forced: true,
			content() {
				// @ts-ignore
				if (trigger.name == "useCard") {
					// @ts-ignore
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							// @ts-ignore
							return current != player;
						})
					);
				} else {
					// @ts-ignore
					trigger.getParent().excluded.add(player);
				}
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					//@ts-ignore
					return get.isView(arg.card);
				},
				effect: {
					// @ts-ignore
					// @ts-ignore
					target: function (card, player, target, current) {
						if (!card.isCard) return "zeroplayertarget";
					},
				},
			},
		},
		rouguangmrfz: {
			init(player, skill) {
				player.storage[skill] = {
					x: 0,
					type: [],
				};
			},
			onremove: true,
			mark: true,
			intro: {
				// @ts-ignore
				// @ts-ignore
				content(event, player) {
					let storage = player.storage.rouguangmrfz;
					return `·额定摸牌数和手牌上限+${storage["x"]}<br>·本轮已使用的类型:${get.translation(storage["type"])}`;
				},
			},
			audio: 2,
			trigger: {
				global: "roundStart",
				player: "useCardAfter",
			},
			silent: true,
			forced: true,
			filter(event, player) {
				let storage = player.storage.rouguangmrfz;
				if (event.name === "useCard") return !storage["type"].includes(get.type2(event.card));
				else return true;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				if (trigger.name === "useCard") {
					player.storage.rouguangmrfz["type"].push(get.type2(trigger.card));
				} else {
					let storage = player.storage.rouguangmrfz;
					if (game.roundNumber > 1 && storage["x"] < 3 && storage["type"].length === 3) {
						player.storage.rouguangmrfz["x"]++;
						// @ts-ignore
						player.logSkill("rouguangmrfz");
					}
					player.storage.rouguangmrfz["type"] = [];
				}
			},
			group: "rouguangmrfz_eff",
			subSkill: {
				eff: {
					mod: {
						maxHandcard: function (player, num) {
							return (num += player.storage.rouguangmrfz["x"]);
						},
					},
					audio: "rouguangmrfz",
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					filter(event, player) {
						return !event.numFixed && player.storage.rouguangmrfz["x"] > 0;
					},
					// @ts-ignore
					// @ts-ignore
					async content(event, trigger, player) {
						trigger.num += player.storage.rouguangmrfz["x"];
					},
				},
			},
		},
		mizongmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			// @ts-ignore
			// @ts-ignore
			filter(event, player) {
				return true;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				let targets = game.players.slice().filter(i => player.inRange(i) || player == i);
				let names = targets.map(i => i.name);
				let {moved} = await player
					.chooseToMove(`【迷踪】:请为${get.cnNumber(targets.length, true)}名角色分配效果`)
					.set("list", [[`你攻击范围内的角色`, [names, "character"]], [`直到该角色的出牌阶段<font color = red>开始时</font>，所有当前时机<font color = red>可以使用</font>的牌随机视为当前时机<font color = red>不可使用</font>的牌`], [`直到该角色的出牌阶段<font color = red>结束时</font>，所有当前时机<font color = red>不可以使用</font>的牌随机视为当前时机<font color = red>可使用</font>的牌`]])
					.set("processAI", list => {
						let moved = [[], [], []],
							player = get.player(),
							targets = list[0][1][0].map(i =>
								// @ts-ignore
								_status.event.chars.find(t => t.name === i)
							);
						let func = function (to) {
							let previous;
							while (true) {
								previous = previous || to.getPrevious();
								if (previous === player && get.attitude(player, previous) > 2) return true;
								else if (previous !== player && get.attitude(player, previous) > 2) {
									previous.getPrevious();
									continue;
								}
								return false;
							}
						};
						for (var target of targets) {
							//@ts-ignore
							if (target === player) moved[2].push(target);
							//@ts-ignore
							else if (get.attitude(target, player) < 2) moved[1].push(target);
							//@ts-ignore
							else if (func(target)) moved[2].push(target);
						}
						return moved;
					})
					.set("chars", targets)
					.forResult();
				if (!moved) return;

				let findPlayer = function (name, targets) {
					if (typeof name === "string") return targets.find(t => t.name === name);
					return name;
				};
				moved = [moved[0], moved[1].map(i => findPlayer(i, targets)), moved[2].map(i => findPlayer(i, targets))];

				for (var i of moved[1]) {
					i.addTempSkill("mizongmrfz_eff", { player: "phaseUseBegin" });
					i.storage.mizongmrfz_eff = true;
				}
				for (var i of moved[2]) {
					i.addTempSkill("mizongmrfz_eff", { player: "phaseUseEnd" });
					i.storage.mizongmrfz_eff = false;
				}
			},
			subSkill: {
				eff: {
					init(player) {
						if (!player.storage.mizongmrfz_cardData) {
							player.storage.mizongmrfz_cardData = {};
						}
						lib.skill.mizongmrfz_eff.inpile = lib.inpile.filter(i => get.type(i) != "equip");
					},
					group: "mizongmrfz_cardData",
					charlotte: true,
					silent: true,
					onremove(player) {
						delete player.storage.mizongmrfz_cardData;
						delete player.storage.mizongmrfz_eff;
					},
					inpile: [],
					mod: {
						// @ts-ignore
						// @ts-ignore
						cardname(card, player, name) {
							const storage = player.storage.mizongmrfz_eff;
							const event = get.event();

							if (event.name === "_wuxie") {
								if (card.name !== "wuxie" && storage === false) return "wuxie";
								if (card.name === "wuxie" && storage === true) {
									return lib.skill.mizongmrfz_eff.inpile.filter(i => i.name !== "wuxie").randomGet();
								}
							}

							if (!["chooseToUse", "chooseToRespond"].includes(event.name)) return;

							const canUse = [];
							const notUse = [];
							lib.skill.mizongmrfz_eff.inpile.forEach(i => {
								const autoViewCard = get.autoViewAs({ name: i }, "unsure");
								if (event.filterCard(autoViewCard, player, event)) {
									canUse.push(i);
								} else {
									notUse.push(i);
								}
							});

							// @ts-ignore
							const cardClone = game.createCard(card.name, card.suit, card.number, card.natrue);
							Object.assign(cardClone, {
								_cardid: card.cardid,
								storage: card.storage,
								gaintag: card.gaintag,
							});

							//@ts-ignore
							const cardData = player.storage.mizongmrfz_cardData[card.cardid];

							if ((!cardData || event.filterCard({ name: cardData }, player, event)) && storage === true && event.filterCard(cardClone, player, event)) {
								//@ts-ignore
								player.storage.mizongmrfz_cardData[card.cardid] = notUse.randomGet();
							}

							if ((!cardData || !event.filterCard({ name: cardData }, player, event)) && storage === false && !event.filterCard(cardClone, player, event)) {
								//@ts-ignore
								player.storage.mizongmrfz_cardData[card.cardid] = canUse.randomGet();
							}

							//@ts-ignore
							return player.storage.mizongmrfz_cardData[card.cardid];
						},
					},
				},
				cardData: {
					charlotte: true,
					silent: true,
					trigger: {
						global: ["loseAfter", "gainAfter", "loseAsyncAfter", "_wuxieAfter"],
					},
					content() {
						// @ts-ignore
						player.storage.mizongmrfz_cardData = {};
					},
				},
			},
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
		},

		// 云迹
		lingkongmrfz: {
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
		mijianmrfz: {
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

		// 骋风
		xiadaomrfz: {
			audio: 2,
			trigger: {
				global: ["gainAfter", "loseAsyncAfter"],
			},
			init() {
				lib.translate["xiadaomrfz_tag"] = "待分配";
				lib.translate["xiadaomrfz_tag_allocated"] = "已分配";
			},
			filter(event, player) {
				// @ts-ignore
				if (event.getParent(2).name === "xiadaomrfz") return false;
				return event.player !== player && event.cards && event.cards.filter(i => get.position(i) === "h").length > 1;
			},
			async cost(event, trigger, player) {
				trigger.player.addTempSkill("xiadaomrfz_damage", { global: "xiadaoAfter" });
				// @ts-ignore
				const { result } = await player
					// @ts-ignore
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							// @ts-ignore
							return lib.filter.filterCard.apply(this, arguments);
						},
						`【侠盗】:是否对${get.translation(trigger.player)}使用一张【杀】，若造成伤害，你获得其本次获得的（${get.cnNumber(trigger.cards.filter(i => get.position(i) === "h").length)}张）牌？`
					)
					.set("complexSelect", true)
					// @ts-ignore
					// @ts-ignore
					.set("filterTarget", function (card, player, target) {
						// @ts-ignore
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						// @ts-ignore
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player);
				event.result = result;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				if (!player.storage.xiadaomrfz_damage) return false;
				delete player.storage.xiadaomrfz_damage;
				let cards = trigger.cards.filter(i => get.position(i) === "h");
				if (cards.length < 1) return;
				let cardsx = cards.map(card => {
					var cardx = ui.create.card();
					// @ts-ignore
					cardx.init(get.cardInfo(card));
					// @ts-ignore
					cardx._cardid = card.cardid;
					return cardx;
				});
				await player.directgains(cardsx, null, "xiadaomrfz_tag");
				let list = [];
				while (player.countCards("s", card => card.hasGaintag("xiadaomrfz_tag")) > 0) {
					const { result } = await player.chooseCardTarget({
						forced: true,
						prompt: `分配获得的牌`,
						filterCard(card) {
							return card.hasGaintag("xiadaomrfz_tag");
						},
						selectCard: [1, Infinity],
						selectTarget: [1, Infinity],
						position: "s",
						// @ts-ignore
						// @ts-ignore
						ai1: card => {
							if (ui.selected.cards.length === 0) return 1;
							return 0;
						},
						ai2: target => {
							const att = get.attitude(_status.event.player, target);
							if (get.value(ui.selected.cards[0], target) < 0) {
								return -att;
							} else if (att > 0) {
								return att / (1 + target.countCards("h"));
							} else {
								return att / 100;
							}
						},
					});
					//@ts-ignore
					list.add([result.targets[0], result.cards]);
					//@ts-ignore
					result.cards.forEach(i => {
						i.removeGaintag("xiadaomrfz_tag");
						i.addGaintag("xiadaomrfz_tag_allocated");
					});
				}
				let deleteCards = player.getCards("s", card => card.hasGaintag("xiadaomrfz_tag_allocated"));
				if (player.isOnline2()) {
					player.send(
						function (cards, player) {
							cards.forEach(i => i.delete());
							if (player == game.me) ui.updatehl();
						},
						deleteCards,
						player
					);
				}
				deleteCards.forEach(i => i.delete());
				if (player == game.me) ui.updatehl();
				list = list.map(arr => {
					let cards = arr[1];
					let gain = [];
					let j = trigger.player.getCards("h");
					for (let card of j) {
						if (cards.some(cardx => cardx._cardid == card.cardid)) gain.push(card);
					}
					return [arr[0], gain];
				});
				game.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				}).setContent("gaincardMultiple");
			},
			subSkill: {
				damage: {
					charlotte: true,
					silent: true,
					trigger: { player: "damageEnd" },
					// @ts-ignore
					// @ts-ignore
					filter(event, player) {
						// @ts-ignore
						return event.getParent(4).name === "xiadaomrfz_cost" && event.source && event.card && event.card.name === "sha";
					},
					// @ts-ignore
					// @ts-ignore
					async content(event, trigger, player) {
						trigger.source.storage.xiadaomrfz_damage = true;
					},
				},
			},
			ai: {
				// @ts-ignore
				// @ts-ignore
				threaten(player, target) {
					return target.hasSkill("qunxiamrfz") ? 5 : 2;
				},
			},
		},
		qunxiamrfz: {
			audio: 2,
			getUntapped(player) {
				let result = [];
				player.getRoundHistory("useCard", evt => {
					if (evt.player === player) {
						result.add(get.suit(evt.card));
					}
				});
				return result;
			},
			// @ts-ignore
			// @ts-ignore
			init(player, skill) {
				player.storage.qunxiamrfz = [];
				let trans = "";
				for (let i of player.storage.qunxiamrfz) {
					trans += get.translation(i);
				}
				player.addTip("qunxiamrfz", `群侠 ${player.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
			},
			trigger: {
				player: "useCard",
			},
			filter(event, player) {
				return event.card && !player.storage.qunxiamrfz.includes(get.suit(event.card));
			},
			check(event) {
				return ["basic", "trick"].includes(get.type(event.card)) && ["tao", "shan", "jiu", "wugu"].includes(event.card.name);
			},
			prompt(event) {
				//@ts-ignore
				return `【群侠】:是否令${get.translation(event.card)}不可被其他角色响应？`;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current !== player;
					})
				);
				player.storage.qunxiamrfz.add(get.suit(trigger.card));
				let trans = "";
				for (let i of player.storage.qunxiamrfz) {
					trans += get.translation(i);
				}
				player.addTip("qunxiamrfz", `群侠 ${player.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
			},
			group: ["qunxiamrfz_clear", "qunxiamrfz_sha"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.qunxiamrfz = [];
						let trans = "";
						for (let i of player.storage.qunxiamrfz) {
							trans += get.translation(i);
						}
						player.addTip("qunxiamrfz", `群侠 ${player.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
					},
				},
				sha: {
					audio: "qunxiamrfz",
					enable: ["chooseToUse"],
					filterCard(card, player) {
						return !lib.skill.qunxiamrfz.getUntapped(player).includes(get.suit(card));
					},
					position: "hes",
					viewAs: {
						name: "sha",
					},
					viewAsFilter(player) {
						return player.countCards("hes", card => !lib.skill.qunxiamrfz.getUntapped(player).includes(get.suit(card))) > 0;
					},
					prompt: "将一张本轮未使用的花色的牌当杀使用",
					check(card) {
						const val = get.value(card);
						return 5 - val;
					},
				},
			},
			ai: {
				directHit_ai: true,
				// @ts-ignore
				skillTagFilter(player, tag, arg) {
					return arg && arg.card && !player.storage.qunxiamrfz.includes(get.suit(arg.card));
				},
			},
		},
	},
};
