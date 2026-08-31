import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("laolimrfz", { pack: "legendSJZX",
			sex: "male",
			group: "limrfz",
			hp: 3,
			skills: ["linhuamrfz","mingshimrfz","jixiongmrfz"],
		});

skill({
	"linhuamrfz": {
			audio: 4,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return event.source != undefined;
			},
			async content(event, trigger, player) {
				trigger.cancel();
				trigger.player.damage("nosource", trigger.num);
			},
			group: ["linhuamrfz_anti", "linhuamrfz_skip"],
			subSkill: {
				anti: {
					direct: true,
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						if (!event.nature) return false;
						return player.countCards("he") >= 2 && event.source != undefined;
					},
					logTarget: "source",
					async content(event, trigger, player) {
						const result = await player
							.chooseToDiscard("he", false, 2, "你可以弃置两张牌将此伤害转移给" + get.translation(trigger.source))
							.forResult();

						if (result.cards) {
							trigger.cancel();
							trigger.source.damage(trigger.num, trigger.nature);
							//@ts-ignore
							player.logSkill("linhuamrfz", trigger.source);
						}
					},
				},
				skip: {
					direct: true,
					trigger: { player: "phaseJudgeBegin" },
					filter: function (event, player) {
						return player.countCards("h") >= 2 && player.countCards("j");
					},
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.chooseToDiscard("h", false, 2, "你可以弃置两张牌并移动一张你判定区内的一张牌")
							.set("ai", card => {
								return 6 - get.value(card);
							})
							.forResult();

						// step 1
						if (result.cards && result.cards.length) {
							const cards = player.getCards("j");
							result = await player.chooseButton(["将你判定区的一张牌移动至一名角色的判定区", cards]).forResult();
						} else {
							return;
						}

						// step 2
						if (result.links && result.links.length) {
							event.card = result.links[0];
							result = await player
								.chooseTarget(true, "选择" + get.translation(event.card) + "的移动目标", (card, player, target) => {
									return target !== player && target.canAddJudge(event.card);
								})
								.forResult();
						} else {
							return;
						}

						// step 3
						if (result.targets) {
							const target = result.targets[0];
							player.$give(event.card, target);
							await game.delayx();
							//@ts-ignore
							player.logSkill("linhuamrfz");
							//@ts-ignore
							const name = event.card.viewAs || event.card.name;
							if (event.card.name !== name) {
								//@ts-ignore
								target.addJudge(name, event.card);
							} else {
								//@ts-ignore
								target.addJudge(event.card);
							}
						}
					},
				},
			},
		},
	"mingshimrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 2,
			filterTarget: function (card, player, target) {
				return target != player && !target.hasSkill("mingshimrfz2");
			},
			selectTarget: 1,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				let result;

				// step 0
				result = await player
					.chooseCard("he", "请选择一张牌交给" + get.translation(target), true)
					.set("ai", card => {
						return 6 - get.value(card);
					})
					.forResult();
				player.addTempSkill("mingshimrfz2");

				// step 1
				if (result.cards && result.cards.length) {
					await player.give(result.cards, target);
					target.addTempSkill("mingshimrfz2");
					player.line(target);
				}

				// step 2
				player.viewHandcards(target);
				game.log(player, "观看了", target, "的手牌");
				if (target.countCards("h") > 3) {
					await player.discardPlayerCard(target, "h", [1, 3]).set("forceAuto", true);
					target.addSkill("mingshimrfz_draw1");
					return;
				} else {
					result = await player
						.chooseControl("令其摸一张", "令其摸两张")
						.set("prompt", "【明事】:请选择一项")
						.set("prompt2", "你可以令其摸[2/1]张牌，然后于下一个准备阶段弃置[1/2]张牌")
						.set("ai", () => {
							const att = get.attitude(target, player);
							if (att > 0) return 1;
							return 0;
						})
						.forResult();
				}

				// step 3
				if (result.index === 0) {
					await target.draw();
					target.addSkill("mingshimrfz_dis2");
				} else {
					await target.draw(2);
					target.addSkill("mingshimrfz_dis1");
				}
			},
			group: "mingshimrfz_ed",
			subSkill: {
				ed: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseJieshuBegin" },
					filter: function (event, player) {
						return player.hasSkill("mingshimrfz2");
					},
					async content(event, trigger, player) {
						player.draw();
					},
				},
				draw1: {
					direct: true,
					charlotte: true,
					trigger: { player: "phaseJieshuBegin" },
					async content(event, trigger, player) {
						player.draw();
						player.removeSkill("mingshimrfz_draw1");
					},
				},
				dis1: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return player.countCards("he") > 0;
					},
					async content(event, trigger, player) {
						player.chooseToDiscard("he", true, "【明事】:弃置一张牌");
						player.removeSkill("mingshimrfz_dis1");
					},
				},
				dis2: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return player.countCards("he") > 0;
					},
					async content(event, trigger, player) {
						player.chooseToDiscard("he", true, 2, "【明事】:弃置两张牌");
						player.removeSkill("mingshimrfz_dis2");
					},
				},
			},
			ai: {
				order: 1,
				expose: 0.2,
				threaten: 1.2,
				result: {
					target: function (player, target) {
						var att = get.attitude(player, target);
						if (att > 0 && target.countCards("h") < 3) return 1;
						if (att < 0) return -1;
					},
				},
			},
		},
	"jixiongmrfz": {
			group: "jixiongmrfz2",
			audio: 2,
			forced: true,
			trigger: { global: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return event.player.hasMark("jixiongxmrfz");
			},
			async content(event, trigger, player) {
				let result;

				while (true) {
					// step 0
					result = await trigger.player
						.judge(card => {
							const color = get.color(card);
							if (color === "black") return 4;
							return -4;
						})
						.forResult();
					trigger.player.removeMark("jixiongxmrfz");

					// step 1
					if (result.color === "black") {
						result = await trigger.player.chooseToDiscard("he", true, "【吉凶】:请弃置一张牌").forResult();
						await trigger.player.loseHp();
					} else {
						// step 2 (仅当非黑色时执行)
						if (result.cards && result.cards.length) {
							await player.gain(result.cards, "gain2");
						}
					}
					// event.goto(0) / event.finish() 由 while 循环条件控制

					if (!trigger.player.hasMark("jixiongxmrfz")) break;
				}
			},
			ai: {
				expose: 0.9,
			},
		},
	"jixiongmrfz2": {
			trigger: { global: "gainEnd" },
			filter: function (event, player) {
				return event.source && event.source.hasSkill("jixiongmrfz");
			},
			logTarget: "source",
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseControl("确定", "取消")
					.set("prompt", "是否发动【吉凶】？")
					.set("ai", function () {
						var att = get.attitude(trigger.source, player);
						if (att > 0) return 1;
						return 0;
					})
					.forResult();
				if (result.control == "确定") {
					trigger.player.addMark("jixiongxmrfz");
				}
			},
		},
});

translate({
	"laolimrfz": "老鲤",
	"linhuamrfz": "鳞滑",
	"linhuamrfz_info": "①锁定技，当你造成伤害时，改为对其造成等量的无来源伤害。②当你受到属性伤害时，你可以弃置两张牌改为你对伤害来源造成等量伤害。③准备阶段，当你的判定区有牌时，你可以弃置两张手牌移动之。",
	"mingshimrfz": "明事",
	"mingshimrfz_info": "出牌阶段限两次，每名角色每回合限一次，你可以交给一名其他角色一张牌，然后观看其手牌，若其手牌在交予牌后：①大于3：你弃置其至多三张手牌，其于下个结束阶段摸一张牌；②小于等于3：你可以令其摸[2/1]张牌，然后于下一个准备阶段弃置[1/2]张牌。发动该技能后，你于结束阶段摸一张牌。",
	"jixiongmrfz": "吉凶",
	"jixiongmrfz_info": "当有其他角色获得你的牌的时候，你可以令其获得“符纸”标记；锁定技，有‘符纸’标记的角色的准备阶段开始时，其进行一次判定且移除一个‘符纸’标记，若判定结果为黑色，则其须弃置一张牌并流失一点体力，然后你获得其弃置的牌，若其仍有‘符纸’标记，重复此流程。",
	"jixiongmrfz2": "吉凶",
});

characterIntro("laolimrfz", "老鲤，私家侦探，龙门鲤氏侦探事务所的创办者。在罗德岛于龙门发展业务的过程中与罗德岛相识，随后建立合作关系。为罗德岛提供关于龙门本地信息的咨询服务，也向罗德岛引荐过一些人才。");
