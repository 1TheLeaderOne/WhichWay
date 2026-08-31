import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yineisimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["yingzhimrfz","yingshaomrfz"],
		});

skill({
	"yingzhimrfz": {
			mark: true,
			intro: {
				content: function (event, player) {
					var str = "·摸牌阶段摸牌数+" + player.countMark("yingzhimrfz_draw") + "</br>·手牌上限+" + player.countMark("yingzhimrfz_mhand");
					str = str + "</br>·使用【杀】的次数+" + player.countMark("yingzhimrfz_sha");
					if (!player.hasMark("yingzhimrfz_dying")) return str;
					return str + "</br>·下次造成的伤害+1";
				},
			},
			audio: 6,
			silent: true,
			firstDo: true,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				game.countPlayer(current => {
					if (current != player) current.storage.yingzhimrfz_draw = false;
					if (current != player) current.storage.yingzhimrfz_mhand = false;
					if (current != player) current.storage.yingzhimrfz_sha = false;
					if (current != player) current.storage.yingzhimrfz_dying = false;
					return true;
				});
			},
			group: ["yingzhimrfz_draw", "yingzhimrfz_drbuff", "yingzhimrfz_mhand", "yingzhimrfz_sha", "yingzhimrfz_dying", "yingzhimrfz_dybuff"],
			subSkill: {
				//标记
				mark: {
					mark: true,
					charlotte: true,
					intro: {
						content: function (event, player) {
							var str =
								"·摸牌阶段摸牌数-" +
								player.countMark("yingzhimrfz_drdebuff") +
								"</br>·手牌上限-" +
								player.countMark("yingzhimrfz_mhddebuff");
							str = str + "</br>·使用【杀】的次数-" + player.countMark("yingzhimrfz_shadebuff");
							if (!player.hasSkill("yingzhimrfz_dydebuff")) return str;
							return str + "</br>·下次造成的伤害-1";
						},
					},
				},
				//非延时锦囊牌 摸牌阶段摸牌数
				draw: {
					audio: "yingzhimrfz",
					trigger: { player: "useCardToTargeted" },
					filter: function (event, player) {
						if (event.targets.length > 1) return false;
						if (event.target.storage.yingzhimrfz_draw) return false;
						//@ts-ignore
						return get.type(event.card) == "trick" && event.target != player;
					},
					check: function (event, player) {
						return get.attitude(player, event.target) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.target) + "下个摸牌阶段摸牌数-1且你摸牌阶段摸牌数+1？";
					},
					async content(event, trigger, player) {
						if (player.countMark("yingzhimrfz_draw") < 2) player.addMark("yingzhimrfz_draw", 1, false);
						trigger.targets[0].storage.yingzhimrfz_draw = true;
						trigger.targets[0].addSkill("yingzhimrfz_drdebuff");
						trigger.targets[0].addMark("yingzhimrfz_drdebuff", 1, false);
						trigger.targets[0].addSkill("yingzhimrfz_mark");
					},
				},
				drbuff: {
					audio: "yingzhimrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_draw");
					},
					async content(event, trigger, player) {
						trigger.num += player.countMark("yingzhimrfz_draw");
					},
				},
				drdebuff: {
					audio: "yingzhimrfz",
					trigger: { player: "phaseDrawBegin" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_drdebuff");
					},
					async content(event, trigger, player) {
						trigger.num -= player.countMark("yingzhimrfz_drdebuff");
						player.removeMark("yingzhimrfz_drdebuff", player.countMark("yingzhimrfz_drdebuff"), false);
						player.removeSkill("yingzhimrfz_drdebuff");
						if (
							!player.hasMark("yingzhimrfz_mhddebuff") &&
							!player.hasMark("yingzhimrfz_shadebuff") &&
							!player.hasSkill("yingzhimrfz_dydebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
				},
				//其他角色响应你的牌 手牌上限
				mhand: {
					audio: "yingzhimrfz",
					trigger: { global: ["respond", "useCard"] },
					filter: function (event, player) {
						if (!event.respondTo) return false;
						if (event.player == player) return false;
						if (player != event.respondTo[0]) return false;
						return !event.player.storage.yingzhimrfz_mhand;
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.player) + "的下个回合手牌上限-1且你的手牌上限+1？";
					},
					async content(event, trigger, player) {
						if (player.countMark("yingzhimrfz_mhand") < 3) player.addMark("yingzhimrfz_mhand", 1, false);
						trigger.player.addMark("yingzhimrfz_mhddebuff", 1, false);
						trigger.player.storage.yingzhimrfz_mhand = true;
						trigger.player.addSkill("yingzhimrfz_mhddebuff");
						trigger.player.addSkill("yingzhimrfz_mark");
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + player.countMark("yingzhimrfz_mhand");
						},
					},
				},
				mhddebuff: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_mhddebuff");
					},
					async content(event, trigger, player) {
						player.removeMark("yingzhimrfz_mhddebuff", player.countMark("yingzhimrfz_mhddebuff"), false);
						player.removeSkill("yingzhimrfz_mhddebuff");
						if (
							!player.hasMark("yingzhimrfz_drdebuff") &&
							!player.hasMark("yingzhimrfz_shadebuff") &&
							!player.hasSkill("yingzhimrfz_dydebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
					mod: {
						maxHandcard: function (player, num) {
							return num - player.countMark("yingzhimrfz_mhddebuff");
						},
					},
				},
				//进入濒死 伤害+1
				dying: {
					audio: "yingzhimrfz",
					trigger: { global: "dying" },
					filter: function (event, player) {
						if (event.player.storage.yingzhimrfz_dying) return false;
						if (event.player.hasSkill("yingzhimrfz_dydebuff") && player.hasMark("yingzhimrfz_dying")) return false;
						return (
							event.player != player &&
							event.parent &&
							event.parent.name == "damage" &&
							event.parent.source &&
							event.parent.source == player
						);
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.player) + "下次造成的伤害-1且你下次造成的伤害+1？";
					},
					async content(event, trigger, player) {
						if (!player.hasMark("yingzhimrfz_dying")) player.addMark("yingzhimrfz_dying", 1, false);
						if (!trigger.player.hasSkill("yingzhimrfz_dydebuff")) {
							trigger.player.addSkill("yingzhimrfz_dydebuff", false);
							trigger.player.addSkill("yingzhimrfz_mark");
							trigger.player.storage.yingzhimrfz_dying = true;
						}
					},
				},
				dybuff: {
					audio: "yingzhimrfz",
					forced: true,
					charlotte: true,
					trigger: { source: "damageBegin" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_dying");
					},
					async content(event, trigger, player) {
						trigger.num++;
						player.removeMark("yingzhimrfz_dying", 1, false);
					},
				},
				dydebuff: {
					audio: "yingzhimrfz",
					forced: true,
					charlotte: true,
					trigger: { source: "damageBegin" },
					async content(event, trigger, player) {
						trigger.num--;
						player.removeSkill("yingzhimrfz_dydebuff");
						if (
							!player.hasMark("yingzhimrfz_drdebuff") &&
							!player.hasMark("yingzhimrfz_mhddebuff") &&
							!player.hasMark("yingzhimrfz_shadebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
				},
				//你响应其他角色牌 使用杀的次数
				sha: {
					audio: "yingzhimrfz",
					trigger: { player: ["useCard", "respond"] },
					filter: function (event, player) {
						if (!Array.isArray(event.respondTo)) return false;
						if (player == event.respondTo[0]) return false;
						return !event.player.storage.sha;
					},
					check: function (event, player) {
						return get.attitude(player, event.respondTo[0]) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.respondTo[0]) + "的下个回合使用【杀】的次数-1且你使用【杀】的次数+1？";
					},
					async content(event, trigger, player) {
						const target = trigger.respondTo[0];
						target.addMark("yingzhimrfz_shadebuff", 1, false);
						target.addSkill("yingzhimrfz_shadebuff");
						target.addSkill("yingzhimrfz_mark");
						target.storage.yingzhimrfz_sha = true;
						player.addMark("yingzhimrfz_sha", 1, false);
						player.addSkill("yingzhimrfz_sharem");
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("yingzhimrfz_sha");
						},
					},
				},
				sharem: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseUseEnd" },
					async content(event, trigger, player) {
						player.removeMark("yingzhimrfz_sha", player.countMark("yingzhimrfz_sha"), false);
						player.removeSkill("yingzhimrfz_sharem");
					},
				},
				shadebuff: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_shadebuff");
					},
					async content(event, trigger, player) {
						player.removeMark("yingzhimrfz_shadebuff", player.countMark("yingzhimrfz_shadebuff"), false);
						player.removeSkill("yingzhimrfz_shadebuff");
						if (
							!player.hasMark("yingzhimrfz_drdebuff") &&
							!player.hasMark("yingzhimrfz_mhddebuff") &&
							!player.hasSkill("yingzhimrfz_dydebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num - player.countMark("yingzhimrfz_shadebuff");
						},
					},
				},
			},
			ai: {
				threaten: 1.1,
				expose: 0.1,
			},
		},
	"yingshaomrfz": {
			audio: 2,
			trigger: { player: "dyingAfter" },
			filter: function (event, player) {
				return event.parent && event.parent.name == "damage" && event.parent.source;
			},
			check: function (event, player) {
				return (get.attitude(player, event.parent?.source) || 0) < 2;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event?.parent?.source) + "获得‘影哨’标记？";
			},
			async content(event, trigger, player) {
				if (!trigger.parent) return;
				trigger.parent.source.addSkill("yingshaomrfz_ban");
			},
			group: "yingshaomrfz_dying",
			subSkill: {
				ban2: {
					charlotte: true,
					mod: {
						cardEnabled: function (card) {
							if (card.name == "sha") return false;
						},
					},
				},
				ban: {
					mark: true,
					intro: {
						content: function (event, player) {
							if (player.hasSkill("yingshaomrfz_ban2")) return "·手牌上限-1</br>·本出牌阶段不能使用【杀】";
							return "·手牌上限-1</br>·使用【杀】的次数至多为1";
						},
					},
					charlotte: true,
					forced: true,
					popup: false,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						if (!player.isPhaseUsing()) return false;
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						player.addTempSkill("yingshaomrfz_ban2", {
							player: "phaseUseEnd",
						});
					},
					mod: {
						maxHandcard: function (player, num) {
							return num - 1;
						},
					},
				},
				dying: {
					audio: "yingshaomrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "dying" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.hasSkill("yingshaomrfz_ban");
						});
					},
					async content(event, trigger, player) {
						game.countPlayer(current => {
							if (current.hasSkill("yingshaomrfz_ban")) {
								current.removeSkill("yingshaomrfz_ban");
								if (current.hasSkill("yingshaomrfz_ban2")) current.removeSkill("yingshaomrfz_ban2");
								current.damage(player);
							}
							return false;
						});
						player.recover(2 - player.hp);
						player.removeSkill("yingshaomrfz");
					},
				},
			},
			ai: {
				expose: 0.2,
			},
		},
});

translate({
	"yineisimrfz": "伊内丝",
	"yingzhimrfz": "影织",
	"yingzhimrfz_info": "每名角色每项每轮限一次，①当你使用一张单一目标的非延时锦囊牌指定目标后，你可以令其下一个摸牌阶段摸牌数-1，你的摸牌阶段摸牌数+1（至多+2）；②当一名其他角色响应你使用或打出的牌时，你可以令其下一回合手牌上限－1，你的手牌上限+1（至多+3）；③当一名角色因你造成的伤害而进入濒死状态时，你可以使其下次造成的伤害－1，你下次造成的伤害+1（不可叠加）；④当你使用或打出牌响应一名其他角色的牌时，你可以使其下一个出牌阶段使用【杀】的次数－1，你的下个出牌阶段使用【杀】的次数+1。",
	"yingshaomrfz": "影哨",
	"yingshaomrfz_info": "①当你脱离濒死状态时，若场上没有‘影哨’标记，你可以令使你进入濒死状态的角色获得一个‘影哨’标记；锁定技，拥有‘影哨’标记的角色手牌上限-1，每回合至多使用1张杀。②锁定技，当你进入濒死状态时，若场上有‘影哨’，你移去‘影哨’标记并对拥有‘影哨’标记的角色造成一点伤害，然后你将体力值回复至2并失去【影哨】。",
});

characterIntro("yineisimrfz", "伊内丝，前萨卡兹佣兵头目。曾短暂参与卡兹戴尔的混乱内战，直到切尔诺伯格事件时，她借助假死彻底消失在所有人的视野中。此后，伊内丝隐藏了自己的踪迹，但通过最近的伦蒂尼姆事件，她正式与罗德岛恢复了联系。期间她经历了什么无从查验，最后在阿斯卡纶的担保下与罗德岛签订了战略合作条款。");
