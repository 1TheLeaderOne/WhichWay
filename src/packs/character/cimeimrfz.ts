import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("cimeimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["huabumrfz","shixinmrfz"],
		});

skill({
	"huabumrfz": {
			audio: 2,
			global: "huabumrfz_eff",
			subSkill: {
				eff: {
					enable: "phaseUse",
					usable: 1,
					filter: function (event, player) {
						return (
							!player.hasSkill("huabumrfz") &&
							game.hasPlayer(current => {
								return current.hasSkill("huabumrfz");
							})
						);
					},
					async content(event, trigger, player) {
						let result, target;

						// step 0
						const targets = game.filterPlayer(current => {
							return current.hasSkill("huabumrfz");
						});

						if (targets.length === 1) {
							//@ts-ignore
							player.logSkill("huabumrfz", targets);
							target = targets[0];
							// goto 2: skip target selection, proceed to draw
						} else if (targets.length > 1) {
							result = await player
								.chooseTarget(true, "选择【花卜】的目标", (card, player, target) => {
									return _status.event.list.includes(target);
								})
								.set("list", targets)
								.set("ai", target => {
									const aiPlayer = _status.event.player;
									return get.attitude(aiPlayer, target);
								})
								.forResult();

							// step 1
							if (result.targets && result.targets.length) {
								//@ts-ignore
								player.logSkill("huabumrfz", result.targets);
								target = result.targets[0];
							} else {
								return;
							}
						} else {
							return;
						}

						// step 2
						if (target) {
							result = await target.draw().forResult();
						} else {
							return;
						}

						// step 3
						if (result && result.cards && result.cards.length) {
							const card = result.cards[0];
							const cards = player.getCards("h");
							let bool = false;
							for (const c of cards) {
								if (get.type2(c) === get.type2(card)) {
									bool = true;
									break;
								}
							}
							event.is = bool;

							result = await target
								.chooseControl("有", "没有")
								.set(
									"prompt",
									"【花卜】:" +
										get.translation(player) +
										"手牌中是否有与" +
										get.translation(card) +
										"(" +
										get.translation(get.type2(card)) +
										")" +
										"类型相同的牌？"
								)
								.set("ai", () => {
									const aiPlayer = _status.event.player;
									const is = _status.event.is;
									const aiTarget = _status.event.target;
									const answer = is === true ? "有" : "没有";
									if (get.attitude(aiPlayer, aiTarget) > 0 && aiTarget.hasSkill("shixinmrfz")) return answer;
									else if (aiTarget.hasSkill("shixinmrfz")) return answer === "有" ? "没有" : "有";
									return ["有", "没有"].randomGet();
								})
								.set("is", event.is)
								.set("target", target)
								.forResult();
						} else {
							return;
						}

						// step 4
						if (result.control) {
							const bool = result.control === "有";
							if (event.is === bool) {
								await player.draw();
								await target.draw();
							} else {
								await target.chooseToDiscard("【花卜】:请选择弃置一张牌", true);
							}
						}
					},
					ai: {
						order: 13,
						threaten: 1.5,
						result: {
							player: function (player, target) {
								target =
									game.findPlayer(function (current) {
										return current.hasSkill("huabumrfz");
									}) || target;
								if (target) {
									return get.attitude(player, target);
								}
							},
						},
					},
				},
			},
		},
	"shixinmrfz": {
			audio: 2,
			trigger: { player: "gainAfter" },
			filter: function (event, player) {
				if (!_status.currentPhase) return false;
				if (player.hasSkill("shixinmrfz_ban")) return false;
				if (_status.currentPhase.countCards("h") == 0) return false;
				return _status.currentPhase != player;
			},
			prompt: "【识心】:是否观看当前回合角色的手牌？",
			async content(event, trigger, player) {
				if (!_status.currentPhase) return;
				player.viewHandcards(_status.currentPhase);
				player.addTempSkill("shixinmrfz_ban", "phaseEnd");
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
});

translate({
	"cimeimrfz": "刺玫",
	"huabumrfz": "花卜",
	"huabumrfz_info": "其他角色出牌阶段限一次，其可以令你摸一张牌，然后你猜测其手牌中是否有与此牌类型相同的牌，若你猜测正确，你与其各摸一张牌，反之你弃置一张牌。",
	"shixinmrfz": "识心",
	"shixinmrfz_info": "每回合限一次，当你于回合外获得牌后，你可以观看当前回合角色的手牌。",
});

characterIntro("cimeimrfz", "刺玫，本名玛格达尔·肖，布伦特伍德镇上血魔大君仪式的幸存者，小镇近乎大半被夷为废墟，她所珍爱的家传温室也被彻底摧毁。</br>受伦蒂尼姆市民自救军成员洛洛与费斯特的邀请，玛格达尔加入自救军，以后勤人员的身份提供帮助，后加入罗德岛。伦蒂尼姆事件结束之后，玛格达尔主动申请回到维多利亚重建家乡，并担任当地罗德岛办事处的联络员。");
