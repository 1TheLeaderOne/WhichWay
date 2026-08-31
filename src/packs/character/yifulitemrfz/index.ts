import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yifulitemrfz", { pack: "legendSJZX",
			sex: "female",
			group: "lymrfz",
			hp: 3,
			skills: ["yanmomrfz","yanbaomrfz","huishenmrfz"],
		});

skill({
	"yanmomrfz": {
			audio: 4,
			mod: {
				attackRange: function (player, num) {
					return num + 2;
				},
				playerEnabled: function (card, player, target) {
					var gone = [];
					for (var i = 0; i < game.players.length; i++) {
						var players = game.players[i];
						if (players.isAction()) gone.add(players);
					}
					if (target != player && _status.currentPhase == player) {
						if (!gone.includes(target) && player.storage.yanmomrfz == true) return false;
						if (gone.includes(target) && player.storage.yanmomrfz == false) return false;
					}
				},
			},
			trigger: { player: "phaseBegin" },
			direct: true,
			async content(event, trigger, player) {
				let result;

				// step 0
				let num = 0;
				const gone = [];
				const wlgo = [];
				for (const players of game.players) {
					if (players.isAction()) {
						gone.add(players);
					} else {
						wlgo.add(players);
					}
				}

				result = await player
					.chooseControl()
					.set("choiceList", [
						"只能指定本轮<font color=#f61e46>已进行</font>回合的其他角色<br>(" + get.translation(gone) + ")",
						"只能指定本轮<font color=#f61e46>未进行</font>回合的其他角色<br>(" + get.translation(wlgo) + ")",
					])
					.set("ai", () => {
						if (num > game.players.length - num) return 0;
						return 1;
					})
					.forResult();

				// step 1
				if (result.index === 0) {
					player.storage.yanmomrfz = true;
				} else {
					player.storage.yanmomrfz = false;
				}
				//@ts-ignore
				player.logSkill("yanmomrfz");
			},
			group: ["yanmomrfz_add"],
			subSkill: {
				gone: {
					charlotte: true,
				},
				eff: {
					init: function (player) {
						player.storage.yanmomrfz_eff = false;
					},
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseBegin" },
					async content(event, trigger, player) {
						player.storage.yanmomrfz_eff = true;
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						game.players.forEach(i => (i.storage.yanmomrfz_eff = false));
					},
				},
				add: {
					trigger: { player: "useCard" },
					filter: function (event, player) {
						//@ts-ignore
						if (get.type(event.card) == "delay") return false;
						//@ts-ignore
						if (get.type(event.card) == "equip") return false;
						return game.hasPlayer(function (current) {
							return !event.targets.includes(current) && !!player.canUse(event.card, current) && current != player;
						});
					},
					check: function (event, player) {
						var num = 0;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player || event.targets.includes(game.players[i])) continue;
							if (!player.inRange(game.players[i])) continue;
							if (player.canUse(event.card, game.players[i])) {
								num = num + get.attitude(player, game.players[i]);
							}
						}
						return num > -1;
					},
					prompt: function (event, player) {
						var list = [];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player || event.targets.includes(game.players[i])) continue;
							if (!player.inRange(game.players[i])) continue;
							if (player.canUse(event.card, game.players[i])) list.add(get.translation(game.players[i]));
						}
						return "是否增加" + list + "为" + get.translation(event.card) + "的目标？";
					},
					async content(event, trigger, player) {
						// step 0
						const targets = [];
						for (const current of game.players) {
							if (current === player || trigger.targets.includes(current)) continue;
							if (!player.inRange(current)) continue;
							if (player.canUse(trigger.card, current)) {
								targets.push(current);
								player.line(current);
							}
						}
						if (targets.length > 0) {
							if (!event.isMine() && !event.isOnline()) {
								await game.delayx();
							}
							event.targets = targets;
						} else {
							return;
						}

						// step 1
						//@ts-ignore
						player.logSkill("yanmomrfz");
						game.log(event.targets, "成为了", trigger.card, "的目标");
						trigger.targets.addArray(event.targets);
					},
				},
			},
		},
	"yanbaomrfz": {
			intro: {
				content: '<span style="text-decoration:line-through">防御力-100</span></br>本轮下次因【杀】受到的伤害+1',
			},
			audio: 2,
			trigger: { source: "damageEnd" },
			global: ["yanbaomrfz_eff", "yanbaomrfz_clear"],
			filter: function (event, player) {
				if (!event.player.isAlive()) return false;
				return !event.player.hasMark("yanbaomrfz") && event.player != player && !event.player.storage.yanbaomrfz2;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 2;
			},
			async content(event, trigger, player) {
				trigger.player.addMark("yanbaomrfz", 1, false);
				trigger.player.storage.yanbaomrfz2 = true;
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					async content(event, trigger, player) {
						player.removeMark("yanbaomrfz", 1, false);
						player.storage.yanbaomrfz2 = false;
					},
				},
				eff: {
					silent: true,
					charlotte: true,
					trigger: { player: "damageBegin" },
					filter: function (event, player) {
						if (!player.hasMark("yanbaomrfz")) return false;
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						trigger.num++;
						player.removeMark("yanbaomrfz", 1, false);
						//@ts-ignore
						player.logSkill("yanbaomrfz");
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
	"huishenmrfz": {
			audio: 2,
			usable: 1,
			trigger: { player: "useCardToPlayer" },
			filter: function (event, player) {
				return event.target != player;
			},
			async content(event, trigger, player) {
				player.addTempSkill("huishenmrfz_eff", "useCardAfter");
			},
			subSkill: {
				eff: {
					silent: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						return event.target != player;
					},
					async content(event, trigger, player) {
						const result = await trigger.target
							.chooseToDiscard("弃置一张手牌，或令" + get.translation(player) + "摸一张牌")
							.set("ai", function (card) {
								var trigger = _status.event.getTrigger();
								return -get.attitude(trigger.target, trigger.player) - get.value(card);
							})
							.forResult();

						if (result.bool == false) player.draw();
					},
				},
			},
		},
});

translate({
	"yifulitemrfz": "伊芙利特",
	"yanmomrfz": "炎魔",
	"yanmomrfz_info": "①锁定技，你的攻击距离+2，你使用牌仅能指定你攻击范围内的角色；你的回合开始时，你选择一项：1.本回合你对其他角色使用牌只能指定本轮已进行回合的其他角色;2.本回合你对其他角色使用牌只能指定本轮未进行回合的其他角色。②你使用的非延时锦囊牌或基本牌可以增加你攻击范围内的所有的合法角色为目标。",
	"yanbaomrfz": "炎爆",
	"yanbaomrfz_info": "每轮每名角色限一次，当你对一名其他角色造成伤害时，你可以令该角色本轮内下次受到【杀】的伤害+1（效果不可叠加）。",
	"huishenmrfz": "毁神",
	"huishenmrfz_info": "出牌阶段限一次，当你使用的牌指定其他角色为目标时，你可以令成为此牌目标的角色选择令你摸一张牌或弃置一张手牌。",
});

characterIntro("yifulitemrfz", "伊芙利特，前莱茵生命医疗对象，重度感染者。拥有极高的源石适应性，伴随有多发性点火现象。进入莱茵生命前的履历缺失。</br>现于罗德岛接受治疗，由医疗干员赫默担任监护与担保人。");
