import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("hongmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["qunlangmrfz","cigumrfz","qingchumrfz"],
			hasHiddenSkill: true,
		});

skill({
	"qunlangmrfz": {
			audio: 2,
			trigger: {
				player: "showCharacterAfter",
			},
			hiddenSkill: true,
			filter: function (event, player) {
				if (!event.toShow || !event.toShow.includes("hongmrfz")) return false;
				return game.hasPlayer(current => {
					return current != player && player.inRangeOf(current);
				});
			},
			check: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && player.inRangeOf(current) && get.attitude(current, player) < 0;
				});
			},
			prompt: "【群狼】:你可以对你攻击范围内的一名其他角色造成一点伤害",
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(true, "【群狼】:请选择一名其他角色并对其造成一点伤害", function (card, player, target) {
						return target != player && player.inRangeOf(target);
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					})
					.forResult();

				if (result.targets) {
					const target = result.targets[0];
					target.damage("player");
				}
			},
		},
	"cigumrfz": {
			mod: {
				cardnature: function (card, player) {
					if (!card.nature && card.name == "sha") return "stab";
				},
			},
			audio: 2,
			trigger: {
				global: ["respond", "useCard"],
			},
			frequent: true,
			filter: function (event, player) {
				if (!event.respondTo) return false;
				if (event.player == player) return false;
				if (player != event.respondTo[0]) return false;
				else return event.cards.filterInD("o").filterInD("d").length > 0;
			},
			prompt: function (event, player) {
				var cards = event.cards.filterInD("o").filterInD("d");
				return "【刺骨】:是否获得" + get.translation(cards) + "?";
			},
			async content(event, trigger, player) {
				var cards = trigger.cards.filterInD("o").filterInD("d");
				player.gain(cards, "log", "gain2");
			},
		},
	"qingchumrfz": {
			group: ["qingchumrfz_sha", "qingchumrfz_shan"],
			audio: 2,
			trigger: { player: ["useCard", "respond"] },
			filter: function (event, player) {
				var target = _status.currentPhase;
				if (!target || target.countCards("he") == 0) return false;
				return event.card && event.card.name == "sha" && target != player;
			},
			check: function (event, player) {
				var target = _status.currentPhase;
				return get.attitude(target, player) < 0;
			},
			prompt: function (event, player) {
				var target = _status.currentPhase;
				return "【清处】:是否弃置当前回合角色（" + get.translation(target) + "）一张牌？";
			},
			async content(event, trigger, player) {
				const target = _status.currentPhase;
				let result;
				if (!target || target.countCards("he") == 0) event.finish();
				else result = await player.discardPlayerCard(target, "he", true).forResult();

				if (result?.cards) {
					if (get.suit(result.cards[0]) == get.suit(trigger.card)) {
						event.goto(0);
					}
				}
			},
			subSkill: {
				shan: {
					audio: "qingchumrfz",
					enable: ["chooseToRespond", "chooseToUse"],
					filter: function (event, player) {
						return _status.currentPhase != player;
					},
					filterCard: {
						name: "sha",
					},
					viewAs: {
						name: "shan",
					},
					prompt: "将一张杀当闪使用或打出",
					check: function () {
						return 1;
					},
					position: "hs",
					viewAsFilter: function (player) {
						if (!player.countCards("hs", "sha")) return false;
					},
					ai: {
						respondShan: true,
						skillTagFilter: function (player) {
							if (!player.countCards("hs", "sha") || _status.currentPhase != player) return false;
						},
						effect: {
							target: function (card, player, target, current) {
								if (get.tag(card, "respondShan") && current < 0) return 0.6;
							},
						},
						order: 4,
						useful: -1,
						value: -1,
						basic: {
							useful: [7, 5.1, 2],
							value: [7, 5.1, 2],
						},
						result: {
							player: 1,
						},
					},
				},
				sha: {
					audio: "qingchumrfz",
					enable: ["chooseToUse", "chooseToRespond"],
					filter: function (event, player) {
						return _status.currentPhase != player;
					},
					filterCard: {
						name: "shan",
					},
					viewAs: {
						name: "sha",
					},
					viewAsFilter: function (player) {
						if (!player.countCards("hs", "shan")) return false;
					},
					position: "hs",
					prompt: "将一张闪当杀使用或打出",
					check: function () {
						return 1;
					},
					ai: {
						effect: {
							target: function (card, player, target, current) {
								if (get.tag(card, "respondSha") && current < 0) return 0.6;
							},
						},
						respondSha: true,
						skillTagFilter: function (player) {
							if (!player.countCards("hs", "shan") || _status.currentPhase != player) return false;
						},
						order: function () {
							return get.order({ name: "sha" }) + 0.1;
						},
						useful: -1,
						value: -1,
						yingbian: function (card, player, targets, viewer) {
							if (get.attitude(viewer, player) <= 0) return 0;
							var base = 0,
								hit = false;
							if (get.cardtag(card, "yingbian_hit")) {
								hit = true;
								if (
									targets.filter(function (target) {
										return (
											target.hasShan() &&
											get.attitude(viewer, target) < 0 &&
											get.damageEffect(target, player, viewer, get.nature(card)) > 0
										);
									})
								)
									base += 5;
							}
							if (get.cardtag(card, "yingbian_all")) {
								if (
									game.hasPlayer(function (current) {
										return (
											!targets.includes(current) &&
											lib.filter.targetEnabled2(card, player, current) &&
											get.effect(current, card, player, player) > 0
										);
									})
								)
									base += 5;
							}
							if (get.cardtag(card, "yingbian_damage")) {
								if (
									targets.filter(function (target) {
										return (
											get.attitude(player, target) < 0 &&
											(hit ||
												!target.mayHaveShan() ||
												player.hasSkillTag(
													"directHit_ai",
													true,
													{
														target: target,
														card: card,
													},
													true
												)) &&
											!target.hasSkillTag("filterDamage", null, {
												player: player,
												card: card,
												jiu: true,
											})
										);
									})
								)
									base += 5;
							}
							return base;
						},
						canLink: function (player, target, card) {
							if (!target.isLinked() && !player.hasSkill("wutiesuolian_skill")) return false;
							if (
								target.mayHaveShan() &&
								!player.hasSkillTag(
									"directHit_ai",
									true,
									{
										target: target,
										card: card,
									},
									true
								)
							)
								return false;
							if (player.hasSkill("jueqing") || player.hasSkill("gangzhi") || target.hasSkill("gangzhi")) return false;
							return true;
						},
						basic: {
							useful: [5, 3, 1],
							value: [5, 3, 1],
						},
						result: {
							target: function (player, target, card, isLink) {
								var eff = (function () {
									if (!isLink && player.hasSkill("jiu")) {
										if (
											!target.hasSkillTag("filterDamage", null, {
												player: player,
												card: card,
												jiu: true,
											})
										) {
											if (get.attitude(player, target) > 0) {
												return -7;
											} else {
												return -4;
											}
										}
										return -0.5;
									}
									return -1.5;
								})();
								if (
									!isLink &&
									target.mayHaveShan() &&
									!player.hasSkillTag(
										"directHit_ai",
										true,
										{
											target: target,
											card: card,
										},
										true
									)
								)
									return eff / 1.2;
								return eff;
							},
						},
						tag: {
							respond: 1,
							respondShan: 1,
							damage: function (card) {
								if (game.hasNature(card, "poison")) return false;
								return 1;
							},
							natureDamage: function (card) {
								if (game.hasNature(card)) return 1;
								return 0;
							},
							fireDamage: function (card, nature) {
								if (game.hasNature(card, "fire")) return 1;
								return 0;
							},
							thunderDamage: function (card, nature) {
								if (game.hasNature(card, "thunder")) return 1;
								return 0;
							},
							poisonDamage: function (card, nature) {
								if (game.hasNature(card, "poison")) return 1;
								return 0;
							},
						},
					},
				},
			},
		},
});

translate({
	"hongmrfz": "红",
	"qunlangmrfz": "群狼",
	"qunlangmrfz_info": "隐匿技，当你登场时，你可以对你攻击范围内的一名其他角色造成一点伤害。",
	"cigumrfz": "刺骨",
	"cigumrfz_info": "①锁定技，你的非属性【杀】均视为刺【杀】。</br>②当其他角色响应你使用的牌后，你可以获得其响应的牌。",
	"qingchumrfz": "清处",
	"qingchumrfz_info": "你的回合外，你获得如下效果：</br>1.你可以将【闪】当【杀】，【杀】当【闪】使用或打出;</br>2.当你使用或打出【杀】后，你可以弃置当前回合角色的一张牌，若此牌与你使用或打出的【杀】花色相同，你重复这个流程。",
});

characterIntro("hongmrfz", "红，身份不明，履历缺失，由凯尔希医生接收、监护并担保。于机动作战，特种作战与隐秘作战中表现出极高天赋，成绩斐然。</br>现于凯尔希医生的指导下，作为特种干员为罗德岛提供服务。");
