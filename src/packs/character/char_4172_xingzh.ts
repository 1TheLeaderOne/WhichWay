import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_4172_xingzh", { pack: "epicSJZX", sex: "female", group: "yanmrfz", hp: 3, skills: ["char_4172_xingzh_xingzhumrfz", "zhizhumrfz"] });

skill({
	char_4172_xingzh_xingzhumrfz: {
		marktext: "帙",
		intro: {
			name: "帙",
			content: "expansion",
			markcount: "expansion",
		},
		onremove: function (player, skill) {
			let cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile({ cards });
		},
		audio: ["作战中1","作战中2"],
		forced: true,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter: function (event, player) {
			if (event.type != "discard") return false;
			for (let current of game.players) {
				if (current === player) continue;
				let evt = event.getl(current);
				if (!evt || !evt.cards2) continue;
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			let cards = [];
			let players = game.filterPlayer();
			for (let current of players) {
				if (current === player) continue;
				let evt = trigger.getl(current);
				if (!evt || !evt.cards2) continue;
				let cardsx = evt.cards2.filterInD("d");
				cards.addArray(cardsx);
			}
			if (cards.length) {
				player.addToExpansion({ cards, source: player, animate: "giveAuto" }).gaintag.add("char_4172_xingzh_xingzhumrfz");
			}
		},
		group: ["char_4172_xingzh_xingzhumrfz_start", "char_4172_xingzh_xingzhumrfz_check", "char_4172_xingzh_xingzhumrfz_init"],
		subSkill: {
			check: {
				audio: false,
				charlotte: true,
				silent: true,
				trigger: {
					player: "addToExpansionEnd",
				},
				filter: function (event, player) {
					return event.gaintag.includes("char_4172_xingzh_xingzhumrfz");
				},
				lastDo: true,
				async content(event, trigger, player) {
					let cards = player.getExpansions("char_4172_xingzh_xingzhumrfz");
					if (cards.length >= 9) {
						const { links } = await player
							.chooseCardButton({ cards, forced: true, prompt: `【行著】:请弃置${Math.max(1, cards.length - 9)}张‘帙’` })
							.set("selectButton", () => {
								let cards2 = get.player().getExpansions("char_4172_xingzh_xingzhumrfz");
								return Math.max(1, cards2.length - 9);
							})
							.set("ai", button => {
								return -get.value(button.link);
							})
							.forResult();
						if (!links) return;
						player.loseToDiscardpile({ cards: links });
					}
				},
			},
			start: {
				audio: "char_4172_xingzh_xingzhumrfz",
				forced: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					player.addToExpansion({ cards: get.cards(3), animate: "draw" }).gaintag.add("char_4172_xingzh_xingzhumrfz");
				},
			},
			init: {
				audio: "char_4172_xingzh_xingzhumrfz",
				trigger: {
					player: ["loseEnd", "dying", "phaseBefore", "phaseAfter", "dyingAfter", "die"],
					global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				filter: function (event, player) {
					//@ts-ignore
					return (player.getExpansions("char_4172_xingzh_xingzhumrfz").length > 0) ^ player.hasSkill("xingzhumrfz_in");
				},
				forced: true,
				firstDo: true,
				silent: true,
				forceDie: true,
				async content(event, trigger, player) {
					if (player.getExpansions("char_4172_xingzh_xingzhumrfz").length) {
						let cards = player.getExpansions("char_4172_xingzh_xingzhumrfz");
						let cardsx = cards.map(card => {
							let cardx = ui.create.card();
							cardx.init(get.cardInfo(card));
							cardx._cardid = card.cardid;
							return cardx;
						});
						player.directgains(cardsx, null, "char_4172_xingzh_xingzhumrfz_tag");
						player.addSkill("char_4172_xingzh_xingzhumrfz_in");
					} else player.removeSkill("char_4172_xingzh_xingzhumrfz_in");
				},
			},
			in: {
				charlotte: true,
				audio: false,
				trigger: {
					player: "addToExpansionEnd",
				},
				filter: function (event, player) {
					return event.gaintag.includes("char_4172_xingzh_xingzhumrfz");
				},
				forced: true,
				locked: false,
				silent: true,
				async content(event, trigger, player) {
					let cards2 = player.getCards("s", card => card.hasGaintag("char_4172_xingzh_xingzhumrfz_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) ui.updatehl();
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());

					let cards = player.getExpansions("char_4172_xingzh_xingzhumrfz");
					let cardsx = cards.map(card => {
						let cardx = ui.create.card();
						cardx.init(get.cardInfo(card));
						cardx._cardid = card.cardid;
						return cardx;
					});
					player.directgains(cardsx, null, "char_4172_xingzh_xingzhumrfz_tag");
				},
				onremove: function (player) {
					let cards2 = player.getCards("s", card => card.hasGaintag("char_4172_xingzh_xingzhumrfz_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) ui.updatehl();
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) ui.updatehl();
				},
				group: ["char_4172_xingzh_xingzhumrfz_use", "char_4172_xingzh_xingzhumrfz_sync"],
			},
			use: {
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore"],
				},
				filter: function (event, player) {
					let cards = player.getCards("s", card => card.hasGaintag("char_4172_xingzh_xingzhumrfz_tag") && card._cardid);
					return (
						event.cards &&
						event.cards.some(card => {
							return cards.includes(card);
						})
					);
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					let idList = player.getCards("s", card => card.hasGaintag("char_4172_xingzh_xingzhumrfz_tag")).map(i => i._cardid);
					let cards = player.getExpansions("char_4172_xingzh_xingzhumrfz");
					let cards2 = [];
					for (let card of trigger.cards) {
						let cardx = cards.find(cardx => cardx.cardid == card._cardid);
						if (cardx) cards2.push(cardx);
					}
					let cards3 = trigger.cards.slice();
					trigger.cards = cards2;
					trigger.card.cards = cards2;
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) ui.updatehl();
							},
							cards3,
							player
						);
					}
					cards3.forEach(i => i.delete());
					if (player == game.me) ui.updatehl();
				},
			},
			sync: {
				charlotte: true,
				silent: true,
				audio: false,
				trigger: {
					player: ["loseToDiscardpileEnd"],
				},
				filter(event, player) {
					let cardsx = player.getCards("s", card => card.hasGaintag("char_4172_xingzh_xingzhumrfz_tag"));
					let cards = player.getExpansions("char_4172_xingzh_xingzhumrfz");
					return cardsx.length !== cards.length;
				},
				async content(event, trigger, player) {
					let cardsx = player.getCards("s", card => card.hasGaintag("char_4172_xingzh_xingzhumrfz_tag"));
					let cards = player.getExpansions("char_4172_xingzh_xingzhumrfz");
					cardsx.forEach(i => {
						if (!cards.map(i => i.cardid).includes(i._cardid)) i.delete();
					});
					ui.updatehl();
				},
			},
		},
	},
	zhizhumrfz: {
		audio: ["作战中3","作战中4"],
		trigger: { player: "useCardAfter" },
		init(player, skill) {
			player.storage[skill] = [];
		},
		mark: true,
		intro: {
			content(event, player) {
				let storage = player.storage.zhizhumrfz;
				return `·本轮已使用的花色：${get.translation(storage)}`;
			},
		},
		firstDo: true,
		filter(event, player) {
			if (!player.storage.zhizhumrfz_check || player.storage.zhizhumrfz.includes(get.suit(event.card)) || get.position(event.card) !== "d") return false;
			for (let current of game.players) {
				if (current === player) continue;
				for (let key in player.storage.zhizhumrfz_check) {
					if (event.card.cardid !== key) continue;
					let arrs = player.storage.zhizhumrfz_check[key];
					for (let arr of arrs) {
						if (arr[0] === current && arr[1] != current.countCards("h")) return true;
					}
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			player.storage.zhizhumrfz.push(get.suit(trigger.card));
			player.addToExpansion({ cards: trigger.cards, source: player, animate: "giveAuto" }).gaintag.add("char_4172_xingzh");
		},
		group: ["zhizhumrfz_check", "zhizhumrfz_remove"],
		subSkill: {
			remove: {
				audio: false,
				charlotte: true,
				silent: true,
				trigger: {
					global: "roundStart",
					player: "useCardAfter",
				},
				lastDo: true,
				async content(event, trigger, player) {
					if (trigger.name === "useCard") {
						if (player.storage.zhizhumrfz_check.hasOwnProperty(trigger.card.cardid)) {
							delete player.storage.zhizhumrfz_check[trigger.card.cardid];
						}
					} else {
						player.storage.zhizhumrfz = [];
					}
				},
			},
			check: {
				audio: false,
				charlotte: true,
				silent: true,
				trigger: {
					player: "useCard",
				},
				async content(event, trigger, player) {
					if (!player.storage.zhizhumrfz_check) player.storage.zhizhumrfz_check = {};
					for (let current of game.players) {
						if (current === player) continue;
						if (!player.storage.zhizhumrfz_check[trigger.card.cardid]) player.storage.zhizhumrfz_check[trigger.card.cardid] = [];
						player.storage.zhizhumrfz_check[trigger.card.cardid].push([current, current.countCards("h")]);
					}
				},
			},
		},
	},
});

translate({
	char_4172_xingzh: "行著",

	char_4172_xingzh_xingzhumrfz:"行著",
	char_4172_xingzh_xingzhumrfz_info: "锁定技，当其他角色有牌因弃置进入弃牌堆后/游戏开始时，你[将此牌/将牌堆顶三张牌]置于你的武将牌上，称之为“帙”，若“帙”的数量不小于9，你将“帙”的数量调整至9；你可以如手牌般使用“帙”。",
	zhizhumrfz: "止著",
	zhizhumrfz_info: "每种花色每轮限一次，当你使用的牌结算完毕后，若在此牌结算过程中其他角色手牌数发生变化，你可以将此牌当作“帙”置于你的武将牌上。",
});

characterTitle("char_4172_xingzh", "<font color='#b8860b'>行止于坊</font>");

characterIntro("char_4172_xingzh", "行箸，就任于炎国太史阁的历史研究者，畅销美食类散记《百灶食珍录》作者。经干员煌介绍，以访客身份来到罗德岛。");
