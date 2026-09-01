import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("Christinemrfz", { pack: "epicSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["mixumrfz","yashimrfz"],
		});

skill({
	"mixumrfz": {
			audio: 2,
			trigger: {
				global: ["loseAfter", "loseAsyncAfter"],
			},
			onremove(player, skill) {
				const cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			filter(event, player) {
				const cards = player.getExpansions("mixumrfz");
				if (cards.length >= player.maxHp * 2) return false;
				if (event.type !== "discard") return false;
				return game.hasPlayer(current => {
					// @ts-ignore
					let evt = event.getl(current);
					return !(!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 1);
				});
			},
			async cost(event, trigger, player) {
				let cardsList = [];
				// @ts-ignore
				let players = game.filterPlayer().sortBySeat(_status.currentPhase);
				for (var current of players) {
					var cards = [];
					// @ts-ignore
					var evt = trigger.getl(current);
					if (!evt || !evt.cards2) continue;
					let cardsx = evt.cards2.filterInD("d");
					cards.addArray(cardsx);
					if (cards.length) {
						cardsList.push(...cards);
					}
				}
				const result = await player
					.chooseButton(["选择置于武将牌上的牌", cardsList])
					.set("selectButton", () => {
						// @ts-ignore
						return [1, get.event().numx];
					})
					.set("numx", player.maxHp * 2 - player.getExpansions("mixumrfz").length)
					.set("ai", button => get.value(button.link))
					.forResult();
				event.result = {
					...result,
					cost_data: {
						cards: result.links,
					},
				};
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const next = player.addToExpansion(event.cost_data.cards, player, "give");
				// @ts-ignore
				next.gaintag.add("mixumrfz");
				await next;
			},
			marktext: "绪",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			ai: {
				combo: "yashimrfz",
			},
		},
	"yashimrfz": {
			audio: 2,
			init() {
				// @ts-ignore
				game.broadcastAll(() => {
					lib.translate["yashimrfz_backup"] = "雅食";
				});
			},
			enable: "phaseUse",
			// @ts-ignore
			filter(event, player) {
				const cards = player.getExpansions("mixumrfz");
				if (cards.length < 1) return false;
				let list = ["color", "type2", "suit"];
				for (let i = 0; i < list.length; i++) {
					if (judge(list[i], cards).size === i + 2) return true;
				}
				return false;
				function judge(item, cards) {
					return new Set(cards.map(card => get[item](card)));
				}
			},
			chooseButton: {
				dialog(event, player) {
					let cards = player.getExpansions("mixumrfz");
					let check = {
						suit: [],
						type: [],
						color: [],
					};

					let seenSuit = new Set();
					let seenType = new Set();
					let seenColor = new Set();

					for (let card of cards) {
						const suit = get.suit(card);
						const type = get.type2(card);
						const color = get.color(card);

						if (!seenSuit.has(suit)) {
							seenSuit.add(suit);
							//@ts-ignore
							check.suit.push(card);
						}

						if (!seenType.has(type)) {
							seenType.add(type);
							//@ts-ignore
							check.type.push(card);
						}

						if (!seenColor.has(color)) {
							seenColor.add(color);
							//@ts-ignore
							check.color.push(card);
						}
					}
					for (let key in check) {
						let info = check[key];
						if (key === "suit" && info.length === 4) {
							game.broadcastAll(
								//@ts-ignore
								function (event, info) {
									event.yashimrfz_aiCheck = info;
								},
								//@ts-ignore
								event,
								info
							);
							break;
						}
						if (key === "type" && info.length === 3) {
							game.broadcastAll(
								//@ts-ignore
								function (event, info) {
									event.yashimrfz_aiCheck = info;
								},
								//@ts-ignore
								event,
								info
							);
							break;
						}
						if (key === "color" && info.length === 2) {
							game.broadcastAll(
								//@ts-ignore
								function (event, info) {
									event.yashimrfz_aiCheck = info;
								},
								//@ts-ignore
								event,
								info
							);
							break;
						}
					}
					return ui.create.dialog("雅食", cards, "hidden");
				},
				check(button) {
					let event = get.event().parent;
					// @ts-ignore
					let check = event.yashimrfz_aiCheck;
					// @ts-ignore
					return check.includes(button.link);
				},
				select() {
					return [1, Infinity];
				},
				// @ts-ignore
				filterOk() {
					// @ts-ignore
					const player = get.player();
					const buttons = ui.selected.buttons;
					let list = ["color", "type2", "suit"];
					let bool = false;
					for (let i = 0; i < list.length; i++) {
						let tmp = buttons.map(button => get[list[i]](button));
						if (tmp.length === i + 2 && new Set(tmp).size === i + 2) {
							bool = true;
							break;
						}
					}
					return bool;
				},
				complexSelect: true,
				// @ts-ignore
				backup(links, player) {
					return {
						audio: "yashimrfz",
						filterCard() {
							return false;
						},
						selectCard: -1,
						card: links,
						delay: false,
						// @ts-ignore
						async content(event, trigger, player) {
							const lines = ["Are people so unhappy when they love?", "Pitiful creature of darkness, what kind of life have you known? God, give me courage to show you you are not alone!", "I am your angel of music."];
							const cards = lib.skill.yashimrfz_backup.card;
							await player.loseToDiscardpile(cards);
							await player.draw(cards.length);

							const cardsx = player.getExpansions("mixumrfz");
							if (cardsx.length > 0) {
								let i = Math.min(3, cardsx.length);
								player.say(lines[i - 1]);
								player.recover();
								player.loseToDiscardpile(cardsx);
								player.draw();
							}
						},
					};
				},
			},
			ai: {
				combo: "mixumrfz",
				threaten: 1.5,
				order: 13,
				result: {
					player: 1,
				},
			},
		},
});

translate({
	"Christinemrfz": "Christine",
	"mixumrfz": "觅绪",
	"mixumrfz_info": "当有牌因弃置而进入弃牌堆后，你可以将其置于你的武将牌上，称之为“绪”（上限为你体力上限的两倍）。",
	"yashimrfz": "雅食",
	"yashimrfz_info": "出牌阶段，你可以将4/3/2张不同花色/类别/颜色的“绪”置入弃牌堆，然后摸等量张牌，若你仍有“绪”，你将所有的“绪”置入弃牌堆、模一张牌并回复一点体力。",
});

characterTitle("Christinemrfz", "<font color = #a52a2a>黑猫传说</font>");

characterIntro("Christinemrfz", "Miss.Christine，时常出现在干员傀影身边的美丽生物，经推测可能为“兽主”之一。现出于自我意愿加入罗德岛，目前并未分配任何相关职务。");
