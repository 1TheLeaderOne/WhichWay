import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("geleidiyamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "liemrfz",
			hp: 3,
			maxHp: 4,
			skills: ["quliemrfz","newxunxiangmrfz","xueshuomrfz","tongmaimrfz"],
			clans: ["深海猎人"],
		});

skill({
	"quliemrfz": {
			intro: {
				markcount: "expansion",
				mark: function (dialog, storage, player) {
					var cards = player.getExpansions("quliemrfz");
					if (player.isUnderControl(true)) dialog.addAuto(cards);
					else return "共有" + get.cnNumber(cards.length) + "张牌";
				},
			},
			onremove(player) {
				game.countPlayer(current => {
					var cards = current.getExpansions("quliemrfz");
					if (cards) current.loseToDiscardpile(cards);
					return false;
				});
			},
			audio: "ronghangmrfz",
			trigger: { player: "useCard" },
			filter(event, player) {
				return (
					get.tag(event.card, "damage") &&
					game.hasPlayer(current => {
						return current != player && !current.hasMark("quliemrfz_eff");
					})
				);
			},
			check(event, player) {
				return game.hasPlayer(current => {
					return current != player && !current.hasMark("quliemrfz_eff") && get.attitude(player, current) < 0;
				});
			},
			prompt2: "当你使用带有伤害类标签的牌时，你可以令其他角色若在此牌结算完成前使用或打出牌后，其须将一半（向上取整）的牌置于武将牌上",
			async content(event, trigger, player) {
				game.countPlayer(current => {
					if (current == player) return false;
					current.addMark("quliemrfz_eff", 1, false);
					return false;
				});
				if (!player.storage.newxunxiangmrfz) player.storage.newxunxiangmrfz = [];
				player.storage.newxunxiangmrfz.add(trigger.card);
				player
					.when("useCardAfter")
					.filter((event, player) => {
						return player.storage.newxunxiangmrfz.includes(event.card);
					})
					.then(async (event, trigger, player) => {
						game.countPlayer(current => {
							current.removeMark("quliemrfz_eff", 1, false);
							return false;
						});
						player.storage.newxunxiangmrfz.remove(trigger.card);
					})
					.assign({ lastDo: true });
			},
			group: ["quliemrfz_eff", "quliemrfz_die"],
			subSkill: {
				die: {
					charlotte: true,
					silent: true,
					trigger: { global: "dieAfter" },
					forceDie: true,
					filter(event, player) {
						return event.player.getExpansions("quliemrfz").length;
					},
					async content(event, trigger, player) {
						trigger.player.loseToDiscardpile(trigger.player.getExpansions("quliemrfz"));
					},
				},
				eff: {
					charlotte: true,
					silent: true,
					firstDo: true,
					trigger: {
						global: ["useCardAfter", "respondAfter", "phaseZhunbeiBegin"],
					},
					filter(event, player) {
						if (event.name == "phaseZhunbei") {
							return event.player.getExpansions("quliemrfz").length > 0;
						} else return event.player.countCards("h") > 0 && event.player != player && event.player.hasMark("quliemrfz_eff");
					},
					async content(event, trigger, player) {
						if (trigger.name == "phaseZhunbei") {
							var current = trigger.player;
							var cards = current.getExpansions("quliemrfz");
							const { links } =
								new Set(cards.map(i => get.type2(i, current))).size == 1
									? { links: [] }
									: await current
											.chooseCardButton(cards)
											.set("prompt", `请选择至少两张不同类型的牌`)
											.set("selectButton", [2, Infinity])
											.set("filterButton", button => {
												var player = get.event().player,
													cards = ui.selected.buttons;
												return !cards.some(cardx => get.type2(cardx, player) == get.type2(button, player));
											})
											.set("ai", button => {
												return get.value(button.link, _status.event.player);
											})
											.forResult();

							if (!links) return;
							if (links.length > 0) {
								current.gain(links, "draw");
								game.log(current, "收回了" + get.cnNumber(links.length) + "因【驱猎】而置于武将牌上的张牌");
							}
							if (cards.length != links.length) current.discard(cards.removeArray(links));
							current.unmarkSkill("quliemrfz");
						} else {
							let current = trigger.player;
							var num = Math.ceil(current.countCards("h") / 2);
							const { cards } = await current
								.chooseCard(true)
								.set("prompt", `请选择${get.cnNumber(num, false)}张牌`)
								.set("selectCard", num)
								.set("ai", card => {
									var player = get.event().player;
									return 6 - get.value(card);
								})
								.forResult();
							current.addToExpansion(cards, "giveAuto", current).gaintag.add("quliemrfz");
							current.markSkill("quliemrfz");
						}
					},
				},
			},
		},
	"newxunxiangmrfz": {
			audio: "xunxiangmrfz",
			trigger: {
				global: "phaseJieshuBegin",
			},
			filter(event, player) {
				var cards = lib.skill.zheqimrfz_eff2.getDiscard(event);
				return cards.length > 0 && player.canCompare(event.player);
			},
			prompt2(event, player) {
				return `你可以与${get.translation(event.player)}进行拼点，若你赢，你获得其本回合因弃置而进入弃牌堆的不同类型的牌各一张，并将拼点牌当雷【杀】对其使用`;
			},
			check(event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				const result = await player.chooseToCompare(trigger.player).forResult();
				if (result.bool) {
					var discards = lib.skill.zheqimrfz_eff2.getDiscard(trigger);
					const { links } =
						new Set(discards.map(i => get.type(i))).size <= 1
							? { links: discards }
							: await player
									.chooseCardButton(discards)
									.set("prompt", `请选择不同类型的牌`)
									.set("selectButton", [0, Infinity])
									.set("filterButton", button => {
										var player = get.event().player,
											cards = ui.selected.buttons;
										//@ts-ignore
										return !cards.some(cardx => get.type(cardx, player) == get.type(button, player));
									})
									.set("ai", button => {
										return get.value(button.link, _status.event.player);
									})
									.forResult();
					if (links) player.gain(links, "gain2");
					var cards = [result.player, result.target];
					cards = cards.filter(i => get.position(i) == "d");
					if (
						cards.length > 0 &&
						player.canUse(
							{
								name: "sha",
								cards: cards,
								nature: "thunder",
							},
							trigger.player,
							false
						)
					) {
						player.useCard({
							card:get.autoViewAs({name:"sha",nature:"thunder"}),
							cards:cards,
							targets:[trigger.player]
						});
					}
				}
			},
		},
	"xueshuomrfz": {
			audio: 2,
			trigger: {
				source: "damageBegin3",
			},
			filter(event, player) {
				return player.countCards("h") >= event.player.countCards("h");
			},
			prompt2(event, player) {
				return `你可以令${get.translation(event.player)}额外受到1点伤害`;
			},
			check(event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
		},
});

translate({
	"geleidiyamrfz": "歌蕾蒂娅",
	"quliemrfz": "驱猎",
	"quliemrfz_info": "①当你使用带有伤害类标签的牌时，你可以令其他角色若在此牌结算完成前使用或打出牌后，其须将一半（向上取整）的牌置于武将牌上。<br>②每名角色的准备阶段，若其有因【驱猎①】而置于武将牌上的牌，其选择获得至少两张不同类型的牌，然后弃置其余的牌。",
	"newxunxiangmrfz": "寻相",
	"newxunxiangmrfz_info": "一名其他角色的结束阶段，若其本回合有牌因弃置而进入弃牌堆，你可以与其拼点，若你赢，你获得其本回合因弃置而进入弃牌堆的不同类型的牌各一张，并将拼点牌当雷【杀】对其使用。",
	"xueshuomrfz": "血槊",
	"xueshuomrfz_info": "当你对手牌数不大于你的角色造成伤害时，你可以令此伤害+1。",
});

characterTitle("geleidiyamrfz", "<font color=rgb(1,255,22)>执政官</font>");

characterIntro("geleidiyamrfz", "歌蕾蒂娅，阿戈尔人，阿戈尔技术执政官、荣誉军团长，阿戈尔军事团体“深海猎人”总战争设计师之一。登陆时间地点俱不明。于对抗大型生物，破坏硬目标，攻坚战，歼灭战，机动战与谍报战等多类行动中展现出非凡实力。现以合作姿态协助罗德岛、辅助罗德岛部分工作，在保留阿戈尔国家职能身份的同时，兼任罗德岛的阿戈尔事务负责人。");
