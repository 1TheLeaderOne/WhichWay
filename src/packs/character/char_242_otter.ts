import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_242_otter", { pack: "epicSJZX", sex: "female", group: "lymrfz", hp: 3, skills: ["shuitamrfz"] });

skill({
	shuitamrfz: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove: function (player, skill) {
			let cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile({ cards });
				cards.forEach(card => delete card.storage.shuitamrfzx);
			}
		},
		mod: {
			ignoredHandcard: function (card, player) {
				if (card.hasGaintag("shuitamrfzx")) {
					return true;
				}
			},
			cardDiscardable: function (card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("shuitamrfzx")) return false;
			},
		},
		audio: ["编入队伍", "行动开始","作战中2","作战中3"],
		derivation: ["baopomrfz", "mihuomrfz"],
		whichway: {
			affiliates: ["baopomrfz", "mihuomrfz"],
		},
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter: function (event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			const result = await player
				.chooseCard({
					//true, "【水獭】:请选择至多三张牌并标记为‘咪啵’", [1, 3]
					forced: true,
					prompt: "【水獭】:请选择至多三张牌并标记为‘咪啵’",
					selectCard: [1, 3],
					ai(card) {
						let val = get.value(card);
						if (["delay", "equip"].includes(get.type(card))) {
							return 0.1;
						}
						const name = get.name(card);
						switch (name) {
							case "tao":
								val += 4;
								break;
							case "shan":
								val += 2;
								break;
							case "sha":
								val += 1;
								break;
							case "jiu":
								val += 2.5;
								break;
							case "wuxie":
								val += 2.5;
								break;
							case "wuzhong":
								val += 2.5;
								break;
						}
						return val;
					},
				})
				.forResult();

			if (result.cards) {
				player.addGaintag(result.cards, "shuitamrfzx");
				for (let i of result.cards) {
					i.storage.shuitamrfzx = true;
				}
			}

			const { index } = await player
				.chooseControl({ controls: ["爆破", "迷惑"] })
				.set("prompt", "【水獭】:请选择获得一个技能")
				.set("ai", function () {
					//我说苟住才能赢
					return [0, 1, 1, 1].randomGet();
				})
				.forResult();

			if (index === 0) {
				player.addSkill("baopomrfz");
			} else if (index === 1) {
				player.addSkill("mihuomrfz");
			}
		},
		group: ["shuitamrfz_reget", "shuitamrfz_end"],
		subSkill: {
			end: {
				audio: "shuitamrfz",
				trigger: { global: "phaseEnd" },
				filter: function (event, player) {
					return player.getExpansions("shuitamrfz").length > 0;
				},
				async content(event, trigger, player) {
					let result;

					const cards = player.getExpansions("shuitamrfz");
					if (cards.length === 1) {
						for (let i of cards) {
							i.storage.shuitamrfzx = true;
						}
						player.gain({ cards, animate: "gain2" }).gaintag = ["shuitamrfzx"];
						game.log(player, "收回了" + get.translation(cards));
						return;
					} else {
						result = await player
							.chooseButton({
								createDialog: ["【水獭】:请选择获得其中一张牌", cards],
							})
							.set("ai", button => get.value(button.links))
							.forResult();
					}

					if (result?.links) {
						for (let i of result.links) {
							i.storage.shuitamrfzx = true;
						}
						player.gain({ cards: result.links, animate: "gain2" }).gaintag = ["shuitamrfzx"];
						game.log(player, "收回了" + get.translation(result.links));
					}
				},
			},
			reget: {
				direct: true,
				trigger: {
					player: "loseAfter",
				},
				filter: function (event, player) {
					let evt = event.getl(player);
					if (!evt || !evt.hs || !evt.hs.length) return false;
					if (event.name == "lose") {
						for (let i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("shuitamrfzx")) return true;
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) return false;
						for (let i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("shuitamrfzx")) return true;
						}
						return false;
					});
				},
				async content(event, trigger, player) {
					if (trigger.delay == false) game.delay();
					let cards: Card[] = [];
					for (let i = 0; i < trigger.cards2.length; i++) {
						let card = trigger.cards2[i];
						if (card.storage.shuitamrfzx) {
							cards.push(card);
							clearTimeout(card.timeout);
							card.classList.remove("removing");
						}
					}
					if (cards.length > 0) {
						player.logSkill("shuitamrfz");
						player.addToExpansion({ cards, source: player, animate: "giveAuto" }).gaintag.add("shuitamrfz");
					}
				},
			},
		},
	},
	baopomrfz: {
		init: function (player) {
			player.storage.baopomrfz = false;
		},
		audio: ["作战中4","作战中1"],
		limited: true,
		charlotte: true,
		skillAnimation: true,
		animationColor: "gray",
		trigger: { player: "phaseZhunbeiBegin" },
		filter: function (event, player) {
			return (
				!player.storage.baopomrfz &&
				player.countCards("h", function (card) {
					return card.storage.shuitamrfzx;
				}) > 0
			);
		},
		check: function (event, player) {
			if (player.hasUnknown()) return false;
			return true;
		},
		async content(event, trigger, player) {
			let result;

			// step 0
			player.awakenSkill(event.name);
			player.storage.baopomrfz = true;
			player.removeGaintag("shuitamrfzx");
			for (const card of player.getCards("h")) {
				delete card.storage.shuitamrfzx;
			}
			player.addTempSkill("baopomrfz_tmp", { player: "baopomrfzAfter" });

			result = await player
				.chooseTarget({
					/**
					 * true, "【爆破】:请选择至多三名其他角色", [1, 3], (card, player, target) => {
					return target !== player;
				}
					 */
					prompt: "【爆破】:请选择至多三名其他角色",
					filterTarget: lib.filter.notMe,
					forced: true,
				})
				.set("ai", target => {
					if (target.hasSkillTag("nofire")) return -1;
					return get.damageEffect(target, player, player, "fire");
				})
				.forResult();

			// step 1
			if (result.targets && result.targets.length) {
				event.targets = result.targets;
				event.cards = [];
			} else {
				return;
			}

			// step 2 & 3 loop (original event.goto(2))
			while (event.targets.length > 0) {
				const currentTarget = event.targets[0];

				// step 2: judge with custom judge2
				const judgeEvent = currentTarget.judge({
					judge(card) {
						if (get.color(card) === "red") return -4;
						return 0;
					},
				});
				judgeEvent.judge2 = judgeResult => {
					return judgeResult.bool === false;
				};
				result = await judgeEvent.forResult();

				// step 3 logic
				if (result.bool === false) {
					await currentTarget.damage({ num: 2, nature: "fire" });
					player.logSkill("baopomrfz", currentTarget);
				}
				if (result.card) event.cards.push(result.card);
				event.targets.shift();
			}

			// step 4
			if (event.cards && event.cards.length) {
				const cards:Card[] = [];
				for (const card of event.cards) {
					if (get.position(card, true) === "d") {
						cards.push(card);
					}
				}
				for (const card of cards) {
					card.storage.shuitamrfzx = true;
				}
				const next = player.gain({animate:"gain2",cards});
				next.gaintag.add("shuitamrfzx");
				await next;
			}
		},
		subSkill: {
			tmp: {
				charlotte: true,
			},
		},
	},
	mihuomrfz: {
		audio: ["完成高难行动","非3星结束行动"],
		trigger: { player: "damageBegin" },
		filter: function (event, player) {
			if (event.source == undefined) return false;
			return player.countCards("h") > 0;
		},
		prompt: function (event, player) {
			return "【迷惑】:你可以令" + get.translation(event.source) + "展示你的一张手牌，若为‘咪啵’则此伤害-1";
		},
		check: function (event, player) {
			for (let i of player.getCards("h")) {
				if (i.storage.shuitamrfzx) return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			const result = await trigger.source.choosePlayerCard({
				target:player,
				position:"h",
				forced:true
			}).forResult();

			if (!result.cards) return;

			player.showCards(result.cards, get.translation(trigger.source) + "展示了" + get.translation(player) + "一张牌</br>此牌" + (result.cards[0].storage.shuitamrfzx ? "<font color=#FF0000>有</font>" : "<font color=#00FF1A>无</font>") + "‘咪啵’标记");
			if (result.cards[0].storage.shuitamrfzx) {
				player.discard({cards:result.cards});
				trigger.num--;
			}
		},
	},
});

translate({
	char_242_otter: "梅尔",
	shuitamrfz: "水獭",
	shuitamrfz_info: "锁定技，游戏开始时，你摸两张牌，然后标记你的至多三张手牌为‘咪啵’并选择获得【爆破】和【自毁】中的一个技能；‘咪啵’不占用你的手牌上限；当‘咪啵’进入弃牌堆后，你将其置于你的武将牌上，然后于一名角色回合结束后获得你以此法置于武将牌上的一张牌。",
	baopomrfz: "爆破",
	baopomrfz_info: "限定技，准备阶段，你可以移除你手牌中所有的‘咪啵’标记，然后令至多三名其他角色进行判定，若为红，其受到一点火焰伤害并翻面，然后你获得所有的判定牌并将这些牌标记为‘咪啵’。",
	mihuomrfz: "迷惑",
	mihuomrfz_info: "当你受到伤害时，你可以令伤害来源展示你的一张手牌，若此牌有‘咪啵’标记，弃置之，然后此伤害-1。",
});

characterIntro("char_242_otter", "梅尔，哥伦比亚出身，莱茵生命研究室所属成员，线控机械装置“咪波”的创造者。能力出众，科研能力极强，经营着个人工作室“鲁特拉”。现与罗德岛合作，在建筑、设计、开发方面提供援助。");

characterTitle("char_242_otter", "造物之心");
