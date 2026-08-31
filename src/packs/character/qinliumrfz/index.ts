import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("qinliumrfz", {
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["junqimrfz","butuimrfz","zhiqimrfz"],
		});

skill({
	"junqimrfz": {
			audio: 4,
			group: ["junqimrfz_reget", "junqimrfz_get"],
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "die" },
					filter: function (event, player) {
						return event.player.hasSkill("junqimrfz");
					},
					async content(event, trigger, player) {
						var isSkillandRemove = function (str, who) {
							if (who.hasSkill(str)) who.removeSkill(str);
						};
						isSkillandRemove("junqimrfz_zhiyu", player);
						isSkillandRemove("junqimrfz_zhiyuan", player);
						isSkillandRemove("junqimrfz_jingong", player);
						isSkillandRemove("butuimrfz", player);
					},
				},
				zhiyu: {
					mark: true,
					marktext: "军旗",
					intro: {
						name: "军旗（治愈之旗）",
						content: "出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸一张牌",
					},
					trigger: { player: "phaseUseBegin" },
					filter: function (event, player) {
						return player.countCards("h") > 0;
					},
					prompt: "是否发动【军旗(治愈之旗)】",
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.chooseToDiscard("he", true, [1, 3], "请弃置至多三张牌")
							.set("ai", card => {
								return 6 - get.value(card);
							})
							.forResult();

						// step 1
						if (result.cards) {
							result = await player
								.chooseTarget(true, [1, result.cards.length], "请选择至多" + result.cards.length + "名角色")
								.set("ai", target => {
									return get.attitude(_status.event.player, target);
								})
								.forResult();
						}

						// step 2
						if (result.bool && result.targets) {
							let min = player.countCards("h");
							let min_player = player;
							//@ts-ignore
							player.logSkill("junqimrfz");
							for (const target of result.targets) {
								await target.recover();
							}
							for (const target of result.targets) {
								if (target === player) continue;
								const num = target.countCards("h");
								if (num < min) {
									min = num;
									min_player = target;
								} else if (num === min) {
									//@ts-ignore
									min_player = undefined;
								}
							}
							if (min_player) {
								await min_player.draw();
							} else {
								await game.delayx();
							}
						}
					},
					group: "junqimrfz_rem",
					ai: {
						expose: 0.6,
					},
				},
				jingong: {
					mark: true,
					marktext: "军旗",
					intro: {
						name: "军旗（进攻之旗）",
						content: "当与你距离不大于2的其他角色受到伤害时，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1",
					},
					trigger: { global: "damageBegin3" },
					filter: function (event, player) {
						return (
							get.distance(player, event.player) <= 2 && event.player.isIn() && event.player != player && player.countCards("he") > 0
						);
					},
					prompt: function (event, player) {
						return "【军旗(进攻之旗)】:是否弃置一张牌，令此伤害对" + get.translation(event.player) + "+1？";
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 0;
					},
					async content(event, trigger, player) {
						player.chooseToDiscard("he", true, "弃置一张牌");
						trigger.num++;
						//@ts-ignore
						player.logSkill("junqimrfz", trigger.player);
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
					group: "junqimrfz_rem",
					ai: {
						expose: 0.8,
					},
				},
				zhiyuan: {
					mark: true,
					marktext: "军旗",
					intro: {
						name: "军旗（支援之旗）",
						content: "与其距离不大于1的角色受到伤害后，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1",
					},
					trigger: { global: "damageEnd" },
					filter: function (event, player) {
						return get.distance(player, event.player) <= 1 && event.player.isIn();
					},
					check: function (event, player) {
						return get.attitude(player, event.player) > 0;
					},
					prompt: function (event, player) {
						if (event.player == player) return "【军旗(支援之旗)】:你是否摸一张牌？";
						return "【军旗(支援之旗)】:是否摸一张牌并交给" + get.translation(event.player) + "一张牌？";
					},
					async content(event, trigger, player) {
						let result;

						player.draw();
						//@ts-ignore
						player.logSkill("junqimrfz", trigger.player);
						if (trigger.player != player) {
							result = await player
								.chooseCard(true, "he", "交给" + get.translation(trigger.player) + "一张牌")
								.set("ai", function (card) {
									if (get.position(card) == "e") return -1;
									if (card.name == "shan" || card.name == "tao" || card.name == "jiu") return 1;
									return 0;
								})
								.forResult();
						} else {
							return;
						}

						//@ts-ignore
						if (result && result.cards) player.give(result.cards, trigger.player, "give");
					},
					group: ["junqimrfz_draw", "junqimrfz_rem"],
					ai: {
						expose: 0.4,
					},
				},
				draw: {
					audio: "junqimrfz",
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
				get: {
					audio: "junqimrfz",
					forced: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					async content(event, trigger, player) {
						const str1 = "【支援之旗】:与其距离不大于 1 的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数 +1";
						const str2 =
							"【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至 4 张";
						const str3 = "【进攻之旗】:当与你距离不大于 2 的角色受到伤害后，你可以弃置一张牌，令此伤害 +1；使用【杀】的次数 +1";
						let result;

						// step 0
						result = await player
							.chooseControl("支援之旗", "治愈之旗", "进攻之旗")
							.set("choiceList", [str1, str2, str3])
							.set("ai", (event, player) => {
								return [0, 2].randomGet();
							})
							.forResult();

						// step 1
						const list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
						for (let i = 0; i < list.length; i++) {
							if (result.index === i) {
								player.addSkill(list[i]);
							}
						}
						player.removeSkill("junqimrfz_get");
					},
				},
				reget: {
					forced: true,
					trigger: { player: "phaseZhunbeiBegin" },
					async content(event, trigger, player) {
						const list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
						let result;

						// step 0
						//@ts-ignore
						player.logSkill("junqimrfz");
						if (
							game.hasPlayer(current => {
								return (
									current.hasSkill("junqimrfz_zhiyuan") ||
									current.hasSkill("junqimrfz_jingong") ||
									current.hasSkill("junqimrfz_zhiyu")
								);
							})
						) {
							game.countPlayer(current => {
								for (let i = 0; i < list.length; i++) {
									if (current.hasSkill(list[i]) && current !== player) {
										current.removeSkill(list[i]);
										player.addSkill(list[i]);
									}
								}
								return true;
							});
						}

						// step 1
						result = await player
							.chooseControl("确定", "cancel2")
							.set("prompt", get.prompt("junqimrfz"))
							.set("prompt2", "是否更换‘军旗’类型")
							.forResult();

						// step 2
						if (result.control === "cancel2") {
							return;
						} else {
							for (let i = 0; i < list.length; i++) {
								if (player.hasSkill(list[i])) {
									player.removeSkill(list[i]);
								}
							}
						}

						// step 3
						const str1 = "【支援之旗】:与其距离不大于 1 的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数 +1";
						const str2 =
							"【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至 4 张";
						const str3 = "【进攻之旗】:当与你距离不大于 2 的角色受到伤害后，你可以弃置一张牌，令此伤害 +1；使用【杀】的次数 +1";

						result = await player
							.chooseControl("支援之旗", "治愈之旗", "进攻之旗")
							.set("choiceList", [str1, str2, str3])
							.set("ai", (event, player) => {
								const num = Math.random();
								if (player.hp <= 1) return 1;
								if (num > 0.6) return 2;
								if (num < 0.3) return 0;
								else return [0, 1, 2].randomGet();
							})
							.forResult();

						// step 4
						for (let i = 0; i < list.length; i++) {
							if (result.index === i) {
								player.addSkill(list[i]);
							}
						}
					},
				},
			},
		},
	"zhiqimrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			filter: function (event, player) {
				return player.hasSkill("junqimrfz_zhiyuan") || player.hasSkill("junqimrfz_jingong") || player.hasSkill("junqimrfz_zhiyu");
			},
			async content(event, trigger, player) {
				const { target } = event;
				const list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
				for (const skill of list) {
					if (player.hasSkill(skill)) {
						target.addSkill(skill);
						player.removeSkill(skill);
					}
				}
			},
			group: "junqimrfz_rem",
			ai: {
				order: 1,
				expose: 0.8,
				threaten: 1.1,
				result: {
					target: function (player, target) {
						if (get.attitude(player, target) < 0) return 0;
						if (get.attitude(player, target) > 0) return 1;
					},
				},
			},
		},
	"butuimrfz": {
			audio: 2,
			direct: true,
			trigger: { global: "phaseBegin" },
			filter: function (event, player) {
				return (
					event.player.hasSkill("junqimrfz_zhiyuan") ||
					event.player.hasSkill("junqimrfz_jingong") ||
					event.player.hasSkill("junqimrfz_zhiyu")
				);
			},
			async content(event, trigger, player) {
				const list = ["摸一张牌"];
				let result;

				// step 0
				if (trigger.player.countCards("he") > 0) {
					list.add("弃两张牌并跳过判定阶段");
				}
				result = await trigger.player
					.chooseControl(list, "cancel2")
					.set("prompt2", get.prompt("butuimrfz"))
					.set("prompt", "请选择一项")
					.set("ai", () => {
						const aiPlayer = _status.event.playerx;
						if (aiPlayer.countCards("j") > 0 && aiPlayer.countCards("he") > 0) return 1;
						else return 0;
					})
					.set("playerx", trigger.player)
					.forResult();

				// step 1
				if (result.control !== "cancel2") {
					if (result.control === "摸一张牌") {
						await trigger.player.draw();
						//@ts-ignore
						trigger.player.logSkill("butuimrfz");
					} else if (trigger.player.countCards("he") > 0) {
						await trigger.player.chooseToDiscard("he", true, "弃置两张牌", 2);
						trigger.player.addTempSkill("butuimrfz_skip", {
							global: "phaseEnd",
						});
						//@ts-ignore
						player.logSkill("butuimrfz", trigger.player);
					}
				}
			},
			subSkill: {
				skip: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseJudgeBefore" },
					async content(event, trigger, player) {
						trigger.cancel();
					},
				},
			},
		},
});

translate({
	"qinliumrfz": "琴柳",
	"junqimrfz": "军旗",
	"junqimrfz_info": "①锁定技，游戏开始时，你选择获得‘军旗’标记；根据拥有‘军旗’标记角色的‘军旗’的类型获得不同的效果：</br><span class=thundertext>【支援之旗】</span>:与其距离不大于1的角色受到伤害后，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1。</br><span class=greentext>【治愈之旗】</span>:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至4张。</br><span class=firetext>【进攻之旗】</span>:当与你距离不大于2的角色受到伤害时，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1。</br>②锁定技，准备阶段，若[场上有‘军旗’且你没有军旗/场上没有‘军旗’]，你[将‘军旗’标记转移至你/你获得‘军旗’标记]，然后你可以改变‘军旗’的类型。",
	"zhiqimrfz": "掷旗",
	"zhiqimrfz_info": "出牌阶段限一次，若你有‘军旗’标记，你可以将‘军旗’标记转移给一名其他角色。",
	"butuimrfz": "不退",
	"butuimrfz_info": "拥有‘军旗’标记的角色回合开始时，其可以选择跳过本回合的判定阶段并弃两张牌或摸一张牌。",
});

characterIntro("qinliumrfz", "琴柳，前维多利亚仪仗队执旗手，服役于维多利亚小丘郡地方部队，经历战乱后，由小丘郡办事处负责人引荐，成为罗德岛合作干员。接受过维多利亚军的基础训练，体能优异，在各类任务中展现出了强大的支援能力。");
