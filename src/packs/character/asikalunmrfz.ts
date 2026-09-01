import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("asikalunmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["dunyingmrfz","niximrfz"],
		});

skill({
	"dunyingmrfz": {
			mod: {
				globalTo(from, to, distance) {
					var cards = to.getCards("s", function (card) {
						return card.hasGaintag("dunyingmrfz");
					});
					if (cards.length) return distance + 1;
				},
			},
			marktext: "影",
			intro: {
				mark: function (dialog, storage, player) {
					var cards = player.getCards("s", function (card) {
						return card.hasGaintag("dunyingmrfz");
					});
					if (game.me == player) dialog.addAuto(cards);
					else return `共有${cards.length}张牌`;
				},
			},
			onremove: function (player, skill) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("dunyingmrfz");
				});
				if (cards.length) {
					player.lose(cards, ui.discardPile);
					player.$throw(cards, 1000);
					game.log(cards, "进入了弃牌堆");
				}
			},
			audio: 2,
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter: function (event, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("dunyingmrfz");
				});
				if (
					player.countCards("h", card => {
						return !card.hasGaintag("dunyingmrfz");
					}) < 1
				)
					return false;
				return cards.length < player.maxHp;
			},
			async content(event, trigger, player) {
				var num = player.getCards("s", function (card) {
					return card.hasGaintag("dunyingmrfz");
				}).length;
				const { cards } =
					player.countCards("h", card => {
						return !card.hasGaintag("dunyingmrfz");
					}) +
						num <=
					player.maxHp
						? { cards: player.getCards("h") }
						: await player
								.chooseCard("h", get.prompt("dunyingmrfz"), "将所有手牌置于武将牌上，称之为“影”", true)
								.set("selectCard", () => {
									var player = _status.event.player;
									var num = player.getCards("s", function (card) {
										return card.hasGaintag("dunyingmrfz");
									}).length;
									return player.maxHp - num;
								})
								.set("filterCard", card => {
									return !card.hasGaintag("dunyingmrfz");
								})
								.set("ai", function (card) {
									var player = _status.event.player;
									if (player.hasUseTarget(card) && !player.hasValueTarget(card)) return 0;
									if (["sha", "shan", "wuxie", "caochuan"].includes(card.name)) return 2 + Math.random();
									return 1 + Math.random();
								})
								.forResult();
				if (!cards) return;
				game.log(player, "将", cards.length, "张牌置于在武将牌上");
				//@ts-ignore
				player.loseToSpecial(cards, "dunyingmrfz");
				player.markSkill("dunyingmrfz");
			},
			group: ["dunyingmrfz_gain"],
			subSkill: {
				gain: {
					audio: "dunyingmrfz",
					trigger: { player: "useCard" },
					usable: 1,
					filter(event, player) {
						var cards = player.getCards("s", function (card) {
							return card.hasGaintag("dunyingmrfz");
						});
						if (!event.cards.length) return cards.length < player.maxHp;
						//@ts-ignore
						var position = event.card.cards.map(i => i.original);
						return position.every(item => item != "h") && cards.length < player.maxHp;
					},
					prompt: "【遁影】:你可以将牌堆顶的一张牌置于你的武将牌上，称之为“影”",
					async content(event, trigger, player) {
						var cards = get.cards();
						game.log(player, "将一张牌置于在武将牌上");
						//@ts-ignore
						player.loseToSpecial(cards, "dunyingmrfz");
						player.markSkill("dunyingmrfz");
					},
				},
			},
		},
	"niximrfz": {
			audio: 2,
			trigger: { global: "phaseJieshuBegin" },
			filter(event, player) {
				return event.player.isIn() && event.player != player && player.canUse("sha", event.player, false);
			},
			direct: true,
			async content(event, trigger, player) {
				const { cards } = await player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							//@ts-ignore
							return lib.filter.filterCard.apply(this, arguments);
						},
						"【匿袭】是否对" + get.translation(trigger.player) + "使用一张杀？"
					)
					.set("logSkill", "niximrfz")
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						//@ts-ignore
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player)
					.forResult();
				if (!cards) return;
				var isDamaged = player.hasHistory("useCard", evt => {
					return (
						evt.getParent(2) == event &&
						evt.card &&
						evt.card.cardid &&
						player.hasHistory("sourceDamage", evtx => {
							return evtx.card && evt.card.cardid == evtx.card.cardid;
						})
					);
				});
				if (!isDamaged && player.isIn() && trigger.player.isIn()) {
					var target = trigger.player,
						targetx = trigger.player,
						list = [];
					if (target.getNext() == player) return;
					const { bool } = await player.chooseBool(`【匿袭】:是否将座位移到${get.translation(trigger.player)}下家？`).forResult();
					if (!bool) return;
					while (targetx.getNext() != player) {
						//@ts-ignore
						targetx = targetx.getNext();
						list.push(targetx);
					}
					if (list.length == 0) return;
					list.reverse();
					for (var i of list) {
						await game.broadcastAll(
							function (target1, target2) {
								game.swapSeat(target1, target2);
							},
							i,
							player
						);
					}
				}
			},
		},
});

translate({
	"asikalunmrfz": "阿斯卡纶",
	"dunyingmrfz": "遁影",
	"dunyingmrfz_info": "①结束阶段，你可以将所有手牌置于你的武将牌上，称之为“影”（仅对你可见，且“影”的数量不能超过你的体力上限），你可以如手牌般使用或打出“影”。<br>②每回合限一次，当你使用手牌时，若此牌对应的全部实体牌来源不为你的手牌区，你可以将牌堆顶一张牌作为“影”置于你的武将牌上。",
	"niximrfz": "匿袭",
	"niximrfz_info": "一名其他角色的结束阶段，你可以对其使用一张【杀】，若此【杀】没有造成伤害，你可以将你的座次移动至其下家。",
});

characterIntro("asikalunmrfz", "阿斯卡纶，巴别塔时期担任情报官，后作为S.W.E.E.P.负责人，为罗德岛负责反渗透工作。");
