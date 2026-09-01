import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("yuanyamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "hongmrfz",
			hp: 4,
			skills: ["bingximrfz","ningshenmrfz","yuanmengmrfz"],
		});

skill({
	"yuanmengmrfz": {
			audio: 4,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				if (player.inRange(event.player)) return false;
				if (!player.hasSha()) return false;
				return event.card.name == "sha" && event.player != player;
			},
			direct: true,
			async content(event, trigger, player) {
				const target = trigger.targets[0];
				const source = trigger.player;
				let result;
				let skipToStep2 = false;

				// step 0
				if (target === player) {
					result = await player
						.chooseControl("确定", "cancel2")
						.set("prompt", get.prompt("yuanmengmrfz"))
						.set("prompt2", "你可以对" + get.translation(source) + "使用【杀】")
						.set("ai", () => {
							const aiPlayer = _status.event.player;
							const aiTarget = _status.event.getTrigger().player;
							const aiSource = _status.event.getTrigger().source;
							if (get.attitude(aiPlayer, aiTarget) > 2) return 1;
							return 0;
						})
						.forResult();
				} else {
					skipToStep2 = true;
				}

				// step 1 (only if target === player)
				if (!skipToStep2) {
					if (result && result.index === 0) {
						if (player.hasSha()) {
							await player
								.chooseToUse(true, function (card, player, event) {
									if (get.name(card) !== "sha") return false;
									//@ts-ignore
									return lib.filter.cardEnabled.apply(this, arguments);
								})
								.set("complexSelect", true)
								.set("filterTarget", function (card, player, target) {
									if (target !== _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
									//@ts-ignore
									return lib.filter.targetEnabled.apply(this, arguments);
								})
								.set("targetx", source);
							//@ts-ignore
							player.logSkill("yuanmengmrfz", source);
							await player.draw();
						}
					}
					return;
				}

				// step 2
				result = await player
					.chooseControl(get.translation(target), get.translation(source), "cancel2")
					.set("prompt", get.prompt("yuanmengmrfz"))
					.set("prompt2", "你可以对其中一名角色使用【杀】")
					.set("ai", () => {
						const aiPlayer = _status.event.player;
						const aiTarget = _status.event.getTrigger().player;
						const aiSource = _status.event.getTrigger().source;
						if (get.attitude(aiPlayer, aiTarget) < 2) return 1;
						if (get.attitude(aiPlayer, aiSource) < 2) return 0;
						return 2;
					})
					.forResult();

				// step 3
				if (result.index !== 2) {
					const resulty = result.index === 1 ? target : source;
					const resultx = result.index === 0 ? target : source;
					if (player.hasSha()) {
						await player
							.chooseToUse(true, function (card, player, event) {
								if (get.name(card) !== "sha") return false;
								//@ts-ignore
								return lib.filter.cardEnabled.apply(this, arguments);
							})
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target !== _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
								//@ts-ignore
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("targetx", result.index === 0 ? target : source);
						await player.draw();
						await resulty.draw();
						//@ts-ignore
						player.logSkill("yuanmengmrfz", resultx);
					} else {
						return;
					}
				}
			},
			ai: {
				expose: 0.5,
				threaten: 1.2,
			},
		},
	"ningshenmrfz": {
			intro: {
				content: function (event, player) {
					return (
						(player.storage.ningshenmrfz_damage ? "·本轮已受到过伤害</br>" : "") +
						(player.countMark("ningshenmrfz") == 0
							? "·已连续0个回合没有成为其他角色使用牌的目标。"
							: "·已连续" + player.countMark("ningshenmrfz") + "个回合没有成为其他角色使用牌的目标。") +
						(player.storage.ningshenmrfz_mark != 0 ? "</br>·下一张带有伤害类标签的牌伤害基数+" + player.storage.ningshenmrfz_mark : "")
					);
				},
			},
			mark: true,
			audio: 2,
			direct: true,
			trigger: { global: "phaseEnd" },
			filter: function (event, player) {
				if (!event.player.isAlive()) return false;
				return true;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				const history = trigger.player.getHistory("useCard");
				if (trigger.player !== player) {
					for (let i = 0; i < history.length; i++) {
						if (!history[i].targets) continue;
						for (let j = 0; j < history[i].targets.length; j++) {
							if (history[i].targets[j] === player) {
								player.removeMark("ningshenmrfz", player.countMark("ningshenmrfz"));
								return;
							}
						}
					}
				}

				// step 1
				player.addMark("ningshenmrfz");

				// step 2
				if (player.countMark("ningshenmrfz") >= 2) {
					result = await player
						.chooseControl("摸牌", "获得杀")
						.set("prompt", get.prompt("ningshenmrfz"))
						.set("prompt2", "请选择一项")
						.set("ai", (event, player) => {
							if (
								player.hp <= 2 ||
								player.hasCard(card => {
									return card.name === "sha";
								})
							)
								return 0;
							return 1;
						})
						.forResult();
					player.removeMark("ningshenmrfz", player.countMark("ningshenmrfz"));
					player.popup("ningshenmrfz");
					//@ts-ignore
					player.logSkill("ningshenmrfz");
				} else {
					return;
				}

				// step 3
				const cards = get.cardPile2("sha");
				if (result.index === 0) {
					await player.draw();
				} else if (cards) {
					await player.gain(cards, "gain2", "log");
				}
			},
			group: ["ningshenmrfz_mark", "ningshenmrfz_damage", "ningshenmrfz_remove"],
			subSkill: {
				mark: {
					trigger: { player: "useCard1" },
					forced: true,
					firstDo: true,
					charlotte: true,
					filter: function (event, player) {
						return get.tag(event.card, "damage") && player.storage.ningshenmrfz_mark > 0;
					},
					async content(event, trigger, player) {
						trigger.baseDamage += player.storage.ningshenmrfz_mark;
						player.storage.ningshenmrfz_mark = 0;
						//@ts-ignore
						player.logSkill("ningshenmrfz");
					},
					init: function (player) {
						player.storage.ningshenmrfz_mark = 0;
					},
					onremove: function (player) {
						delete player.storage.ningshenmrfz_mark;
					},
					ai: {
						damageBonus: true,
					},
				},
				damage: {
					silent: true,
					charlotte: true,
					popup: false,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						if (!player.storage.ningshenmrfz_damage) {
							//@ts-ignore
							player.logSkill("ningshenmrfz");
							player.storage.ningshenmrfz_mark++;
						} else player.storage.ningshenmrfz_damage = false;
					},
				},
				remove: {
					silent: true,
					charlotte: true,
					popup: false,
					trigger: { player: "damageEnd" },
					async content(event, trigger, player) {
						if (!player.storage.ningshenmrfz_damage) player.storage.ningshenmrfz_damage = true;
					},
				},
			},
			ai: {
				threaten: 1.1,
			},
		},
	"bingximrfz": {
			mod: {
				attackRangeBase: function (player, num) {
					if (player != _status.currentPhase && player.hp <= player.countCards("h")) return (num = 0);
					return num;
				},
			},
		},
});

translate({
	"yuanyamrfz": "远牙",
	"yuanmengmrfz": "援盟",
	"yuanmengmrfz_info": "当你的攻击范围外有角色A使用【杀】仅指定角色B时，你可以选择对[角色A/角色B]使用一张【杀】(若角色B为你，则你只能选择对角色A使用【杀】)，然后你与[角色B/角色A]各摸一张牌(若角色B为你，改为你摸一张牌)。",
	"ningshenmrfz": "凝神",
	"ningshenmrfz_info": "锁定技，当你连续两个回合没有成为当前回合角色使用的牌（你自己使用的牌除外）的目标时，你选择摸一张牌或从牌堆中获得一张【杀】；每轮开始时，若你上一轮没有受到伤害或本轮为第一轮，你下一张伤害类标签的牌伤害基数+1。",
	"bingximrfz": "屏息",
	"bingximrfz_info": "锁定技，你的回合外，若你手牌数不小于你的体力值，你的攻击范围视为0。",
});

characterIntro("yuanyamrfz", "“远牙”骑士查丝汀娜，于特锦赛上打响名气，目前隶属于由感染者骑士组建的红松骑士团，是一名在卡西米尔拥有相当程度知名度的感染者骑士。在卡西米尔本届特锦赛及一系列风波之后，红松骑士团与罗德岛达成合作关系，远牙骑士也作为合作者来到罗德岛，接受矿石病相关治疗，并为罗德岛提供战斗支援。");
