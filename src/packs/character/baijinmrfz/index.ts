import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("baijinmrfz", {
			sex: "female",
			group: "kamrfz",
			hp: 3,
			skills: ["xujimrfz","shiyumrfz"],
		});

skill({
	"xujimrfz": {
			init: function (player) {
				player.storage.xujimrfz = {
					damage: 0,
					maxhand: 0,
				};
			},
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.xujimrfz;
					var str;
					if (storage["damage"] > 0) str = "下次使用【杀】的伤害基数+" + storage["damage"] + "</br>";
					if (storage["maxhand"] > 0) str = str + "手牌上限+" + storage["maxhand"];
					if (!str) return "没有效果";
					return str;
				},
			},
			audio: 3,
			trigger: { player: "phaseDiscardBegin" },
			frequent: true,
			filter: function (event, player) {
				return (
					player.getHistory("useCard", function (evt) {
						if (!get.tag(evt.card, "damage")) return false;
						if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
							var targets = evt.targets.slice(0);
							while (targets.includes(player)) targets.remove(player);
							return targets.length > 0;
						}
						return false;
					}).length === 0
				);
			},
			async content(event, trigger, player) {
				let result;

				player.storage.xujimrfz["damage"] += 1;
				player.storage.xujimrfz["maxhand"] += 5;
				if (player.hasUseTarget("sha", false) && player.hasSha())
					result = await player.chooseControl("摸牌", "出杀").set("prompt", "【蓄击】:请选择一项").forResult();
				else {
					var num = 2 + player.storage.shiyumrfz_buff;
					player.draw(num || 2);
					event.finish();
				}

				if (result && result.index == 0) {
					var num = 2 + player.storage.shiyumrfz_buff;
					player.draw(num || 2);
				} else {
					player.addTempSkill("xujimrfz_sha", "xujimrfzAfter");
					player
						.chooseToUse(
							true,
							function (card, player, event) {
								if (get.name(card) != "sha") return false;
								//@ts-ignore
								return lib.filter.filterCard.apply(this, arguments);
							},
							"【蓄击】：请你使用一张【杀】"
						)
						.set("logSkill", "xujimrfz")
						.set("complexSelect", true);
				}
			},
			group: ["xujimrfz_clear", "xujimrfz_dam"],
			subSkill: {
				sha: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event, player) {
						//@ts-ignore
						return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
					},
					logTarget: "target",
					async content(event, trigger, player) {
						var storage = player.storage.shiyumrfz_buff;
						if (!storage) storage = 0;
						const id = trigger.target.playerid;
						const map = trigger.getParent()?.customArgs;

						if (!id || !map) return;

						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired++;
						} else {
							map[id].shanRequired = 2 + storage;
						}
						player.removeSkill("xujimrfz_sha");
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.xujimrfz["maxhand"] = 0;
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + (player.storage.xujimrfz["maxhand"] || 0);
						},
					},
				},
				dam: {
					charlotte: true,
					direct: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (player.storage.xujimrfz["damage"] < 1) return false;
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						const storage = player.storage.xujimrfz["damage"];
						//@ts-ignore
						player.logSkill("xujimrfz");
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage += storage;
						player.storage.xujimrfz["damage"] = 0;
					},
				},
			},
		},
	"shiyumrfz": {
			audio: 2,
			skillAnimation: true,
			animationColor: "wood",
			juexingji: true,
			forced: true,
			unique: true,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				return event.num >= 2;
			},
			async content(event, trigger, player) {
				player.storage.shiyumrfz = true;
				player.awakenSkill("shiyumrfz");
				player.addSkill("shiyumrfz_buff");
				if (!player.storage.shiyumrfz_buff) player.storage.shiyumrfz_buff = 0;
				player.storage.shiyumrfz_buff += 1;
			},
			subSkill: {
				buff: {
					charlotte: true,
					mod: {
						attackRange: function (player, num) {
							return (num += 1);
						},
					},
					ai: {
						viewHandcard: true,
						skillTagFilter(player, tag, arg) {
							if (player === arg || !player.inRange(arg)) return false;
						},
					},
				},
			},
		},
});

translate({
	"baijinmrfz": "白金",
	"xujimrfz": "蓄击",
	"xujimrfz_info": "弃牌阶段开始时，若你本回合出牌阶段没有使用伤害类牌指定其他角色为目标，你可以令你下一张【杀】的伤害基数+1，然后你的手牌上限+5且选择一项:1.摸[ 2 ]张牌；2.使用一张【杀】且此杀需要[ 2 ]张【闪】才可抵消。",
	"shiyumrfz": "视域",
	"shiyumrfz_info": "觉醒技，当你一次造成至少两点伤害后，你获得如下效果并令【蓄击】中[ ]内的数字+1：</br>1.攻击距离+1；</br>2.攻击范围内的其他角色的手牌均对你可见。",
});

characterIntro("baijinmrfz", "白金，卡西米尔无胄盟刺客，其他履历缺失。在机动作战、歼灭战与巷战中皆表现出极高的战斗技巧与特殊的战术素养。</br>现于凯尔希医生的指导下，作为狙击干员为罗德岛提供服务。");
