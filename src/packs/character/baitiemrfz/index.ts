import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("baitiemrfz", { pack: "legendSJZX",
			sex: "male",
			group: "weimrfz",
			hp: 4,
			skills: ["jigongmrfz","jiefeimrfz"],
		});

skill({
	"jigongmrfz": {
			derivation: ["jigongmrfz_card"],
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				const next = player
					.chooseControl()
					.set("choiceList", [
						"白铁多功能平台 - 攻击型：当你造成至少两点伤害时，你可以令此伤害 +1。",
						"白铁多功能平台 - 支援型：锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。",
						"铁钳号原型机：出牌阶段你可以弃置 X 张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数 +1）。",
					])
					.set("ai", () => {
						return [0, 1, 2].randomGet();
					});
				next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
				result = await next.forResult();

				// step 1
				const list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
				for (let i = 0; i < list.length; i++) {
					if (result.index === i) {
						//@ts-ignore
						event.card = game.createCard(list[i], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
						await player.gain(event.card, "gain2");
						event.card2 = list[i];
					}
				}

				// step 2
				const card = event.card;
				//@ts-ignore
				if (player.getCards("h").includes(card) && get.name(card, player) === event.card2) {
					await player.chooseUseTarget(card, "nopopup", true);
				}
			},
			group: ["jigongmrfz_gcard", "jigongmrfz_zb", "jigongmrfz_discard"],
			subSkill: {
				gcard: {
					direct: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (player.countCards("e", list[i])) return true;
						}
					},
					firstDo: true,
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.chooseTarget("你可以将【支援装备】移动至一名其他角色的装备区", (card, player, target) => {
								return target !== player && !target.getEquip(5) && !target.isDisabled(5);
							})
							.set("ai", target => {
								return get.attitude(player, target);
							})
							.forResult();

						// step 1
						const list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						if (result.targets) {
							for (let i = 0; i < list.length; i++) {
								if (player.countCards("e", list[i])) {
									//@ts-ignore
									event.card = player.getCards("e", card => {
										return card.name === list[i];
									});
									await player.lose(event.card, ui.ordering, "visible");
									player.line(result.targets[0]);
									event.target = result.targets[0];
								}
							}
						} else {
							return;
						}

						// step 2
						event.target.equip(event.card[0]);
						//@ts-ignore
						player.logSkill("jigongmrfz", event.target);
					},
				},
				zb: {
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (player.countCards("e", list[i])) return false;
						}
						return true;
					},
					async content(event, trigger, player) {
						let result;

						// step 0
						const next = player
							.chooseControl()
							.set("choiceList", [
								"白铁多功能平台 - 攻击型：当你造成至少两点伤害时，你可以令此伤害 +1。",
								"白铁多功能平台 - 支援型：锁定技，弃牌阶段开始时，你额外执行一个出牌阶段和摸牌阶段。",
								"铁钳号原型机：出牌阶段你可以弃置 X 张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数 +1）。",
							])
							.set("ai", () => {
								return [0, 1, 2].randomGet();
							});
						next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
						result = await next.forResult();

						// step 1
						const list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (let i = 0; i < list.length; i++) {
							if (result.index === i) {
								//@ts-ignore
								event.card = game.createCard(list[i], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
								await player.gain(event.card, "gain2");
								event.card2 = list[i];
							}
						}

						// step 2
						const card = event.card;
						//@ts-ignore
						if (player.getCards("h").includes(card) && get.name(card, player) === event.card2) {
							await player.chooseUseTarget(card, "nopopup", true);
						}
						//@ts-ignore
						player.logSkill("jigongmrfz");
					},
				},
				discard: {
					direct: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (event.player.countCards("e", list[i])) return true;
						}
					},
					async content(event, trigger, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (trigger.player.countCards("e", list[i])) {
								let card = trigger.player.getCards("e", function (card) {
									return card.name == list[i];
								});
								trigger.player.discard(card);
							}
						}
					},
				},
			},
		},
	"jiefeimrfz": {
			audio: 2,
			trigger: { global: ["loseEnd", "cardsDiscardEnd"] },
			direct: true,
			popup: false,
			filter: function (event, player) {
				var cs = event.cards;
				for (var i = 0; i < cs.length; i++) {
					if (cs[i].name.indexOf("baitiemrfzcard") == 0 && get.position(cs[i], true) == "d") return true;
				}
				return false;
			},
			forceDie: true,
			async content(event, trigger, player) {
				let result;

				// step 0
				//@ts-ignore
				if (!_status.jigongmrfz) _status.jigongmrfz = {};
				const list = [];
				const list2 = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
				const cs = trigger.cards;
				for (let i = 0; i < cs.length; i++) {
					if (cs[i].name.indexOf("baitiemrfzcard") === 0 && get.position(cs[i], true) === "d") {
						//@ts-ignore
						_status.jigongmrfz[cs[i].name] = false;
						list.push(cs[i]);
					}
					for (let j = 0; j < list2.length; j++) {
						//@ts-ignore
						if (cs[i].name === list2[j]) event.card = list2[j];
					}
				}
				game.log(list, "已被移出游戏");
				game.cardsGotoSpecial(list);
				//@ts-ignore
				event.card = game.createCard(list[0].name, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
				player.popup("jigongmrfz");

				// step 1
				result = await player.chooseBool(get.prompt("jigongmrfz")).forResult();

				// step 2
				if (result.bool) {
					//@ts-ignore
					player.logSkill("jiefeimrfz");
					const next = player.judge(card => {
						const color = get.color(card);
						if (color === "red") return -4;
						return 0;
					});
					next.judge2 = result => {
						return result.bool === false;
					};
					result = await next.forResult();
				} else {
					return;
				}

				// step 3
				if (result.color === "red") {
					await player.draw();
					result = await player
						.chooseTarget("你可以令一名角色装备【支援装备】", (card, player, target) => {
							return !target.getEquip(5) && !target.isDisabled(5);
						})
						.set("ai", target => {
							return get.attitude(player, target);
						})
						.forResult();
				} else {
					return;
				}

				// step 4
				if (result.targets) {
					const cards = game.createCard(event.card, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
					const target = result.targets[0];
					await target.gain(cards, "gain2");
					target.equip(cards);
					//@ts-ignore
					player.logSkill("jiefeimrfz");
				}
			},
		},
});

translate({
	"baitiemrfz": "白铁",
	"jigongmrfz": "机工",
	"jigongmrfz_info": "锁定技，游戏开始时或你的准备阶段，若你的装备区没有【支援装备】，你选择装备一个支援装备；回合结束时，若你的装备区有【支援装备】，你可以将其移动至一名其他角色的装备区（不可以替换原装备）。",
	"jigongmrfz_card": "支援装备",
	"jigongmrfz_card_info": "锁定技，根据【支援装备】的类型获得对应的效果。</br>支援装备类型：</br>白铁多功能平台-攻击型：当你造成至少两点伤害时，你可以令此伤害+1.</br>白铁多功能平台-支援型：锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。</br>铁钳号原型机：出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）",
	"jiefeimrfz": "节费",
	"jiefeimrfz_info": "①当【支援装备】被移出游戏时，你可以进行判定，若为红色，你摸一张牌并可令一名角色装备与此次被移出游戏的【支援装备】类型相同的【支援装备】。②锁定技，[任意角色的回合结束阶段，若其装备区有【支援装备】/【支援装备】进入弃牌堆时]，将此牌[置入弃牌堆/移出游戏]。",
});

characterIntro("baitiemrfz", "白铁，机械工程师，伦蒂尼姆市民自救军十一小队队长。于伦蒂尼姆事件中与罗德岛协同作战，后与罗德岛签订长期合作条款，作为工程干员与行动队成员活跃在维多利亚地区的各项任务中。");
