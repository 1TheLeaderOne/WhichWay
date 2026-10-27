import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { gameUtils } from "../../nonameEx/custom/gameUtils.ts";

character("char_250_phatom", { pack: "legendSJZX", sex: "male", group: "weimrfz", hp: 3, skills: ["xuyingmrfz", "xuegemrfz", "huanxiangmrfz"] });

skill({
	xuyingmrfz: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove: function (player, skill) {
			let cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile({ cards });
		},
		audio: ["选中干员2", "部署1"],
		trigger: { player: "useCard" },
		filter: function (event, player) {
			if (event.xuyingmrfz_buff || !event.targets.length || player.hasSkill("xuyingmrfz_buff")) return false;
			let type = get.type(event.card);
			if (type != "basic" && type != "trick" && player.getExpansions("xuyingmrfz").length > 0) return false;
			return (
				player.getExpansions("xuyingmrfz").filter(function (magic) {
					return get.type2(magic) != get.type2(event.card);
				}).length > 0
			);
		},
		async cost(event, trigger, player) {
			let cards = player.getExpansions("xuyingmrfz").filter(function (magic) {
				return get.type2(magic) != get.type2(trigger.card);
			});
			const result = await player
				.chooseButton({
					createDialog: ["你可以选择移去一张与你使用的牌类型不同的“虚影”，令此牌结算两次", cards],
					ai(button) {
						const link = button.link;
						const card = trigger.card;
						if (get.name(card) === "tao" && player.getDamagedHp() < 2) return -1;
						return get.type2(link) === "equip" ? 0.1 : Math.random();
					},
				})
				.forResult();
			event.result = gameUtils.createResult({
				bool: result.bool,
				cards: result.links,
			});
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			player.logSkill("xuyingmrfz");
			player.loseToDiscardpile({ cards });
			player.addTempSkill("xuyingmrfz_buff", "phaseUseAfter");
			trigger.xuyingmrfz_buff = player;
		},
		group: ["xuyingmrfz_discard", "xuyingmrfz_judge"],
		subSkill: {
			discard: {
				audio: "xuyingmrfz",
				trigger: { global: "loseAfter" },
				filter: function (event, player) {
					if (event.type != "discard" || event.getlx === false) return false;
					if (player.getExpansions("xuyingmrfz").length >= 3) return false;
					let cards = event.cards.slice(0);
					let evt = event.getl(player);
					for (let i = 0; i < cards.length; i++) {
						if (cards[i].original != "j" && get.suit(cards[i], event.player) == "spade" && get.position(cards[i], true) == "d") {
							return true;
						}
					}
					return false;
				},
				direct: true,
				async content(event, trigger, player) {
					if (trigger.delay == false) game.delay();

					let cards: Card[] = [],
						cards2 = trigger.cards.slice(0),
						evt = trigger.getl(player);
					let num = player.getExpansions("xuyingmrfz").length;
					for (let i = 0; i < cards2.length; i++) {
						if (cards2[i].original != "j" && get.suit(cards2[i], trigger.player) == "spade" && get.position(cards2[i], true) == "d") {
							cards.push(cards2[i]);
						}
					}

					let result;

					if (cards.length && num + cards.length <= 3) {
						result = await player
							.chooseButton({
								//["虚影：选择置于武将牌上的牌", cards], [1, cards.length]
								createDialog: ["虚影：选择置于武将牌上的牌", cards],
								selectButton: [1, cards.length],
								ai(button) {
									return get.type(button.link) === "equip" ? 1 : Math.random();
								},
							})
							.forResult();
					} else if (cards.length) {
						result = await player
							.chooseButton({
								createDialog: ["虚影：选择置于武将牌上的牌", cards],
								selectButton: [1, 3 - num],
								ai(button) {
									return get.type(button.link) === "equip" ? 1 : Math.random();
								},
							})
							.forResult();
					}

					if (result && result.bool && result.links && result.links.length) {
						player.logSkill("xuyingmrfz");
						player
							.addToExpansion({
								//result.links, player, "giveAuto"
								cards: result.links,
								source: player,
								animate: "giveAuto",
							})
							.gaintag.add("xuyingmrfz");
					}
				},
			},
			judge: {
				audio: "xuyingmrfz",
				trigger: { global: "cardsDiscardAfter" },
				direct: true,
				filter: function (event, player) {
					let evt = event.getParent()!.relatedEvent;
					if (!evt || evt.name != "judge") return;
					if (player.getExpansions("xuyingmrfz").length >= 3) return false;
					if (get.position(event.cards[0], true) != "d") return false;
					return get.suit(event.cards[0]) == "spade";
				},
				async content(event, trigger, player) {
					let card = trigger.cards.length;
					let num = player.getExpansions("xuyingmrfz").length;

					let result;
					if (card + num <= 3)
						result = await player
							.chooseButton({
								//["虚影：选择置于武将牌上的牌", trigger.cards], [1, card]
								createDialog: ["虚影：选择置于武将牌上的牌", trigger.cards],
								selectButton: [1, card],
								ai(button) {
									return get.type(button.link) === "equip" ? 1 : Math.random();
								},
							})
							.forResult();
					else
						result = await player
							.chooseButton({
								//["虚影：选择置于武将牌上的牌", trigger.cards], [1, 3 - num]
								createDialog: ["虚影：选择置于武将牌上的牌", trigger.cards],
								selectButton: [1, 3 - num],
								ai(button) {
									return get.type(button.link) === "equip" ? 1 : Math.random();
								},
							})
							.forResult();

					if (result && result.links && result.bool && result.links.length) {
						player.logSkill("xuyingmrfz");
						player.addToExpansion({ cards: result.links, source: player, animate: "giveAuto" }).gaintag.add("xuyingmrfz");
					}
				},
			},
			buff: {
				trigger: { global: "useCardToTargeted" },
				forced: true,
				charlotte: true,
				popup: false,
				lastDo: true,
				filter: function (event, player) {
					return event.parent && event.parent.xuyingmrfz_buff == player && event.targets.length == event.parent.triggeredTargets4.length;
				},
				async content(event, trigger, player) {
					if (!trigger.parent) return;
					trigger.parent.targets = trigger.parent.targets.concat(trigger.targets);
					trigger.parent.triggeredTargets4 = trigger.parent.triggeredTargets4.concat(trigger.targets);
					player.removeSkill("xuyingmrfz_buff");
				},
				onremove: true,
			},
		},
	},
	xuegemrfz: {
		audio: ["作战中2", "作战中4"],
		trigger: { player: "damageEnd" },
		filter: function (event, player) {
			return game.hasPlayer(function (target) {
				return target != player && player.inRange(target);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					/**
					 * "请选择【血歌】的目标", "对一名你的攻击范围内其他角色造成一点伤害", true, function (card, player, target) {
					return target != player && player.inRange(target);
				}
					 */
					prompt: "请选择【血歌】的目标",
					prompt2: "对一名你的攻击范围内其他角色造成一点伤害",
					filterTarget(card, player, target) {
						return target !== player && player.inRange(target);
					},
					ai(target) {
						return get.damageEffect(target, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;

			player.line(targets);
			targets[0].damage();
			if (targets[0].hp > player.hp || player.getExpansions("xuyingmrfz").length >= 3) return;

			if (player.countCards("he") && player.getExpansions("xuyingmrfz").length >= 3) return;

			const { cards } = await player
				.chooseCard({
					prompt:"你可以将一张牌置于武将牌上作为“虚影”",
					position:"he"
				})
				.set("ai", card => 6 - get.value(card))
				.forResult();
			if (cards && cards.length) {
				player
					.addToExpansion({
						cards: cards,
						source: player,
						animate: "giveAuto",
					})
					.gaintag.add("xuyingmrfz");
			}
		},
	},
	huanxiangmrfz: {
		audio: ["任命队长","编入队伍"],
		trigger: { player: "useCardAfter" },
		filter: function (event, player) {
			return event.card && (event.card.name == "shan" || event.card.name == "wuxie");
		},
		frequent: true,
		async content(event, trigger, player) {
			player.draw();
		},
	},
});

translate({
	char_250_phatom: "傀影",
	xuyingmrfz: "虚影",
	xuyingmrfz_info: "当有黑桃牌因弃置进入弃牌堆后，你可以将其置于你的武将牌上，称为‘影’（影的上限至多为3）；当你使用一张基本或非延时锦囊牌时，你可以移去一张与你使用的牌类别不同的‘影’，然后此牌结算两次。",
	xuegemrfz: "血歌",
	xuegemrfz_info: "当你受到伤害后，你可以你攻击范围内的一名角色造成一点伤害，然后若该角色体力值不大于你，你可以将一张牌作为‘影’置于武将牌上。",
	huanxiangmrfz: "幻象",
	huanxiangmrfz_info: "当你使用或打出一张【闪】或【无懈可击】结算完成后，你可以摸一张牌。",
});

characterIntro("char_250_phatom", "独自行动于维多利亚及周边地区的刺客傀影，过去行踪难以查定，背景履历尚未完全实证。</br>现作为特种干员加入罗德岛，作战能力优秀，但仍需谨慎对待。");

characterTitle("char_250_phatom", "歌剧魅影");
