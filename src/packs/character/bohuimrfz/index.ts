import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("bohuimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "samimrfz",
			hp: 4,
			skills: ["shehunmrfz","yirenmrfz"],
		});

skill({
	"yirenmrfz": {
			audio: 4,
			chargeGet: 1,
			chargeSkill: true,
			forced: true,
			onremove: true,
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter: function (event, player) {
				var num = 0;
				var history = player.getHistory("useCard");
				for (var i = 0; i < history.length; i++) {
					//@ts-ignore
					if (history[i].card.name == "sha" && history[i].isPhaseUsing()) {
						num++;
					}
				}
				if (player.countMark("charge") + player.getCardUsable("sha") - num >= 15) return false;
				return player.getCardUsable("sha") - num > 0;
			},
			async content(event, trigger, player) {
				var num = 0;
				var history = player.getHistory("useCard");
				for (var i = 0; i < history.length; i++) {
					//@ts-ignore
					if (history[i].card.name == "sha" && history[i].isPhaseUsing()) {
						num++;
					}
				}
				num = player.getCardUsable("sha") - num;
				num = Math.min(num, 15 - player.countMark("charge"));
				player.addMark("charge", num);
			},
			group: "yirenmrfz_use",
			subSkill: {
				lim: {
					silent: true,
					charlotte: true,
					onremove: true,
					intro: {
						content: "下回合使用【杀】的次数-#",
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num - player.countMark("yirenmrfz_lim");
						},
					},
				},
				use: {
					init: (player, skill) => (player.storage[skill] = 1),
					audio: "yirenmrfz",
					enable: "phaseUse",
					filter: function (event, player) {
						if (player.countMark("charge") < player.storage.yirenmrfz_use) return false;
						if (player.countCards("h") < 2) return false;
						return game.hasPlayer(function (current) {
							return current != player && !!player.canUse("sha", current);
						});
					},
					selectCard: 2,
					position: "h",
					filterCard: true,
					selectTarget: [1, 2],
					filterTarget: function (card, player, target) {
						return player.canUse("sha", target) === true && target != player;
					},
					multitarget: true,
					multiline: true,
					check: function (card) {
						return 8 - get.value(card);
					},
					prompt: "【异刃】：请弃置两张手牌并选择至多两名角色",
					async content(event, trigger, player) {
						for (let i of event.targets) {
							if (player.canUse("sha", i)) player.useCard({ name: "sha", isCard: true }, i, false);
							i.addTempSkill("yirenmrfz_lim", { player: "phaseEnd" });
							i.addMark("yirenmrfz_lim", 1, false);
						}
						player.removeMark("charge", player.storage.yirenmrfz_use);
						player.storage.yirenmrfz_use++;
					},
					ai: {
						order: function (item, player) {
							if (player.hasSkillTag("presha", true, null, true)) return 10;
							if (game.hasNature(item, "linked")) {
								if (
									game.hasPlayer(function (current) {
										return (
											current != player &&
											current.isLinked() &&
											player.canUse(item, current, undefined, true) &&
											get.effect(current, item, player, player) > 0 &&
											lib.card.sha.ai.canLink(player, current, item)
										);
									}) &&
									game.countPlayer(function (current) {
										//@ts-ignore
										return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
									}) > 1
								)
									return 3.1;
								return 3;
							}
							return 3.05;
						},
						result: {
							target: function (player, target) {
								var enemyIR = game.filterPlayer(function (current) {
									return current != player && get.attitude(player, current) < 0 && !!player.canUse("sha", current);
								});
								if (enemyIR.length < 1) return 0;
								else if (enemyIR.length == 1) {
									if (target.hp <= 2) return -4;
								}
								return -1;
							},
						},
					},
				},
			},
		},
	"shehunmrfz": {
			trigger: {
				source: "damageEnd",
			},
			intro: {
				content: "使用【杀】的次数+#",
			},
			onremove: true,
			forced: true,
			popup: false,
			filter: function (event, player) {
				return player.countMark("shehunmrfz") < 5;
			},
			async content(event, trigger, player) {
				var mark = player.countMark("shehunmrfz");
				var num = trigger.num;
				if (mark + num > 5) var add = 5 - mark;
				else var add = num;
				player.addMark("shehunmrfz", add, false);
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("shehunmrfz");
				},
			},
		},
});

translate({
	"bohuimrfz": "柏喙",
	"yirenmrfz": "异刃",
	"yirenmrfz_info": "蓄力技（1/15）。①锁定技，回合结束时，你增加X点蓄力值。（X=本回合出牌阶段剩余使用【杀】的次数）②出牌阶段，你可以消耗[ 1 ]点蓄力值，弃置两张手牌并选择至多两名其他角色，视为你对其各使用一张【杀】（目标必须合法且不计入次数限制）且其下个回合使用【杀】的次数-1，然后令[ ]中的数字+1（至多为5）。",
	"shehunmrfz": "摄魂",
	"shehunmrfz_info": "锁定技，你使用【杀】的次数+X。（X=你本局游戏造成伤害的数量，X至多为5）",
});

characterIntro("bohuimrfz", "柏喙，雷神工业装备设计师之女，遭遇工厂工人暴动而不幸感染矿石病。</br>现作为医疗救助对象加入罗德岛，依照本人的意愿，允许调入作战部门，她的剑术如同她纺线一般优雅而有韵律。");
