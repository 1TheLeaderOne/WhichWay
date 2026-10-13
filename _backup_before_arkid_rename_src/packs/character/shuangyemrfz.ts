import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("shuangyemrfz", { pack: "rareSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["canyinmrfz","bingrenmrfz"],
		});

skill({
	"canyinmrfz": {
			mark: true,
			intro: {
				// @ts-ignore
				content: function (event, player) {
					var storage = player.storage.canyinmrfz;
					if (!storage || !player.isPhaseUsing()) return "无";
					return "本阶段不能使用或打出" + get.translation(storage) + "牌";
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "phaseUseBegin" },
			async content(event, trigger, player) {
				var cs = 1;
				if (player.hp < 2 && player.countCards("h", "tao") > 0) cs = 2;
				else if (
					player.hasSha() &&
					player.countCards("h", function (card) {
						return get.type(card) == "equip";
					}) < 3 &&
					player.canUseCardAtt("sha", false, true)
				)
					cs = 2;
				else if (
					player.countCards("h", function (card) {
						return get.type2(card) == "trick" && card.name != "wuxie";
					}) > 2
				)
					cs = 0;
				const result = await player
					.chooseControl()
					.set("choiceList", ["基本：使用牌无距离限制且不可响应", "锦囊：摸两张牌", "装备：本阶段使用的第一张带有伤害类标签的牌伤害值或回复值+1"])
					.set("prompt", "【蚕吟】:请选择你不能使用的类型")
					.set("ai", function () {
						return _status.event.cs;
					})
					.set("cs", cs).forResult();

				if (result.control) {
					var list = ["basic", "trick", "equip"];
					for (var i = 0; i < list.length; i++) {
						if (result.index == i) {
							if (result.index != 1) player.addTempSkill("canyinmrfz_" + list[i], "phaseUseEnd");
							else player.draw(2);
							player.addTempSkill("canyinmrfz_ban", "phaseUseEnd");
							player.storage.canyinmrfz = list[i];
							break;
						}
					}
				}
			},
			group: "canyinmrfz_rec",
			subSkill: {
				rec: {
					audio: "canyinmrfz",
					forced: true,
					trigger: { source: "dieAfter" },
					filter: function (event, player) {
						return event.player != player;
					},
					content: function () {
						// @ts-ignore
						player.recoverTo(player.maxHp);
					},
				},
				used: {
					charlotte: true,
				},
				ban: {
					mod: {
						cardEnabled: function (card, player) {
							if (get.type2(card) == player.storage.canyinmrfz) return false;
						},
					},
				},
				basic: {
					mod: {
						// @ts-ignore
						// @ts-ignore
						targetInRange(card, player, target, now) {
							if (["trick", "delay", "basic"].includes(get.type(card))) return true;
						},
					},
					audio: "canyinmrfz",
					forced: true,
					trigger: {
						player: "useCard",
					},
					filter: function (event, player) {
						return (
							event.card &&
							(get.type(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
							game.hasPlayer(function (current) {
								return current != player;
							})
						);
					},
					content: function () {
						// @ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								// @ts-ignore
								return current != player;
							})
						);
					},
					ai: {
						directHit_ai: true,
					},
				},
				equip: {
					trigger: {
						player: "useCard",
					},
					usable: 1,
					forced: true,
					// @ts-ignore
					// @ts-ignore
					filter: function (event, player) {
						return get.tag(event.card, "damage") > 0 || get.tag(event.card, "recover") > 0;
					},
					content: function () {
						// @ts-ignore
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						// @ts-ignore
						trigger.baseDamage += 1;
						// @ts-ignore
						game.log(trigger.card, "的伤害值/回复值", "#y+1");
					},
				},
			},
		},
	"bingrenmrfz": {
			audio: 2,
			trigger: {
				player: "useCardToTargeted",
				target: "useCardToTargeted",
			},
			filter: function (event, player) {
				// @ts-ignore
				if (event.card.name != "sha" || event.getParent(2).name == "bingrenmrfz") return false;
				// @ts-ignore
				return player == event.target || event.getParent().triggeredTargets3.length == 1;
			},
			check: function (event, player) {
				var target = player == event.player ? event.target : event.player;
				return (
					get.attitude(target, player) < 0 &&
					(player.countCards("h", card => {
						return card.name == "tao" || card.name == "jiu";
					}) > 0 ||
						player.hp > 1)
				);
			},
			prompt2: function (event, player) {
				// @ts-ignore
				var target = player == event.player ? event.target : event.player;
				return "【冰刃】:你可以<span class=firetext>流失一点体力</span>并视为对" + get.translation(target) + "使用一张冰【杀】";
			},
			async content(event, trigger, player) {
				//成为目标 player==trigger.target
				//指定目标 player==trigger.player
				await player.loseHp();

				if (player.isAlive()) {
					var target = player == trigger.player ? trigger.target : trigger.player;
					player.addTempSkill("bingrenmrfz_dam", "bingrenmrfzAfter");
					player.useCard({ name: "sha", nature: "ice", isCard: true, bingrenmrfz: true }, target).set("addCount", false);
				}
			},
			subSkill: {
				dam: {
					charlotte: true,
					silent: true,
					trigger: {
						source: "damageEnd",
					},
					// @ts-ignore
					// @ts-ignore
					filter: function (event, player) {
						if (!event.card) return false;
						// @ts-ignore
						return event.card.bingrenmrfz == true;
					},
					async content(event, trigger, player) {
						let result;
						if (trigger.player.countCards("he") < 2) {
							player.removeSkill("bingrenmrfz_dam");
							trigger.player.turnOver();
							return;
						} else {
							result = await trigger.player.chooseToDiscard("【冰刃】:请弃置两张牌，或选择取消翻面", 2, "he").set("ai", function (card) {
								var player = _status.event.player;
								if (player.isTurnedOver()) return -1;
								return 8 - get.value(card);
							}).forResult();
						}

						if (result.bool == false) {
							trigger.player.turnOver();
						}
						player.removeSkill("bingrenmrfz_dam");
					},
				},
			},
		},
});

translate({
	"shuangyemrfz": "霜叶",
	"canyinmrfz": "蚕吟",
	"canyinmrfz_info": "①锁定技，出牌阶段开始时，你选择一种类型的牌，然后你本阶段不能使用该种类型的牌，若你选择的类型是:</br>1.基本:本阶段使用牌无距离限制且不可响应；</br>2.锦囊:摸两张牌；</br>3.装备:本阶段使用的第一张带有伤害类或回复类标签的牌伤害值或回复值+1。</br>②锁定技，当你杀死一名其他角色后，你将体力值调整至体力上限。",
	"bingrenmrfz": "冰刃",
	"bingrenmrfz_info": "当你[不因此技能而使用【杀】选择目标后/成为【杀】的目标后]，你可以流失一点体力，然后你视为对[目标角色/杀的使用者]使用一张冰【杀】（不计入次数限制），若此杀造成伤害，[目标角色/杀的使用者]须弃置两张牌或翻面。",
});

characterIntro("shuangyemrfz", "霜叶，前哥伦比亚少年兵，所属部队覆灭后被“退役”。在随后的流浪佣兵生活中和罗德岛建立关系，经过一段时间合作后被吸收进入罗德岛。</br>拥有非常丰富的战场经验，本身的战斗技巧也不容小觑，对罗德岛来说，是不可多得的优秀战力。");
