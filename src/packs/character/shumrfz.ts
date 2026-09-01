import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("shumrfz", { pack: "legendSJZX",
			sex: "female",
			group: "suimrfz",
			hp: 3,
			skills: ["kenyemrfz","heyingmrfz","rancuimrfz"],
		});

skill({
	"kenyemrfz": {
			init: player => {
				player.storage.kenyemrfz = [];
			},
			marktext: "黍",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 2,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				var bool = false,
					type = get.type2(event.card);
				for (var i of ["basic", "trick", "equip"]) {
					if (
						type === i &&
						event.player
							.getHistory("useCard", evt => {
								return get.type2(evt.card) === i;
							})
							.indexOf(event) === 0
					) {
						bool = true;
						break;
					}
				}
				if (event.cards.length < 1) return false;
				return event.cards.filterInD().length > 0 && bool;
			},
			prompt: function (event, player) {
				//@ts-ignore
				return `【垦野】:是否将${get.translation(event.cards)}置于${get.translation(event.player)}的武将牌上?`;
			},
			prompt2: function () {
				return get.skillInfoTranslation("kenyemrfz").replace(/<\/br>[\s\S]*/, "");
			},
			check: function (event, player) {
				if (get.attitude2(event.player) < 0) return false;
				return !get.tag(event.card, "damage");
			},
			async content(event, trigger, player) {
				var target = trigger.player;
				if (!player.storage.kenyemrfz) player.storage.kenyemrfz = [];
				if (!player.storage.kenyemrfz.includes(target)) player.storage.kenyemrfz.add(target);

				target
					.when({
						global: ["damageBegin", "phaseEnd"],
					})
					.filter((event, player) => {
						if (event.name === "phase") return true;
						return event.cards && event.cards.some(card => cardsx.includes(card));
					})
					.step(async (event, trigger, player) => {
						if (trigger.name === "phase") return;
						trigger.num = 0;
					});

				let cardsx = trigger.cards;
				target
					.when({
						global: ["cardsDiscardAfter", "phaseEnd"],
					})
					.filter((event, player) => {
						if (event.name === "phase") return true;
						//@ts-ignore
						let bool = event.cards && event.cards.some(card => cardsx.includes(card)) && !event.kenyemrfz_checked;
						//@ts-ignore
						if (bool) event.kenyemrfz_checked = true;
						return bool;
					})
					.step(async (event, trigger, player) => {
						if (trigger.name === "phase") return;
						//@ts-ignore
						player.addToExpansion(trigger.cards, player, "give").gaintag.add("kenyemrfz");
					})
					.vars({
						cardsx: cardsx,
					});
			},
			global: "kenyemrfz_use",
			subSkill: {
				use: {
					trigger: { player: "phaseEnd" },
					charlotte: true,
					direct: true,
					filter: function (event, player) {
						if (player.getExpansions("kenyemrfz").length < 1) return false;
						return player.canUse("wuzhong", player) || player.canUse("tao", player);
					},
					async content(event, trigger, player) {
						let result;

						while (player.getExpansions("kenyemrfz").length > 0) {
							// step 0
							const list = [];
							if (player.hasUseTarget("tao")) list.add("tao");
							if (player.hasUseTarget("wuzhong")) list.add("wuzhong");

							if (list.length === 1) {
								await player.useCard({ name: list[0] }, [player.getExpansions("kenyemrfz")[0]], player);
								//@ts-ignore
								player.logSkill("kenyemrfz");
							} else if (list.length > 1) {
								result = await player
									.chooseBool("【垦野】:选择'确定'使用【桃】，选择'取消'使用【无中生有】")
									.set("ai", () => {
										const aiPlayer = _status.event.player;
										if (aiPlayer.hp < 3) return 0;
										return [0, 1].randomGet();
									})
									.forResult();

								// step 3 (内联，因原流程中 step 3 仅在 chooseBool 后执行)
								if (result.bool) {
									await player.useCard({ name: "tao" }, [player.getExpansions("kenyemrfz")[0]], player);
								} else {
									await player.useCard({ name: "wuzhong" }, [player.getExpansions("kenyemrfz")[0]], player);
								}
								//@ts-ignore
								player.logSkill("kenyemrfz");
								// goto(0): while 循环自动回到开头
								continue;
							} else {
								break; // 无可用卡牌，结束流程
							}

							// step 1 (原 goto(0) 由 while 循环条件控制)
							// 循环条件 player.getExpansions("kenyemrfz").length > 0 已隐含此判断
						}
						// 循环条件不满足时自动结束，等价于 event.finish()
					},
				},
			},
		},
	"heyingmrfz": {
			audio: 2,
			trigger: { global: "gainAfter" },
			filter: function (event, player) {
				var evt = event.getParent("phaseDraw");
				if (evt && evt.player == event.player) return false;
				if (!event.cards || event.cards.length < 2) return false;
				//@ts-ignore
				if (event.getParent(1).name != "draw") return false;
				return event.player.hasUseTarget("wugu");
			},
			usable: 1,
			direct: true,
			async content(event, trigger, player) {
				let result;

				// step 0
				const target = trigger.player;
				const cards = trigger.cards;
				const type = [];
				for (const card of cards) {
					if (type.includes(get.type2(card))) continue;
					type.add(get.type2(card));
				}
				//@ts-ignore
				event.type = type;

				let skipToStep2 = false;
				if (target === player) {
					result = await player
						.chooseTarget(
							`【禾盈】:你可以将${get.translation(trigger.cards)}当做至多指定${get.cnNumber(type.length)}角色且结算${get.cnNumber(type.length)}次的【五谷丰登】使用`
						)
						.set("selectTarget", [1, type.length])
						.set("filterTarget", (card, player, target) => {
							return player.canUse("wugu", target);
						})
						.set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, ""))
						.set("ai", target => {
							const aiPlayer = _status.event.player;
							const aiCards = _status.event.cards;
							const num = _status.event.num;
							if (aiCards.length >= num * 2) return false;
							if (get.value(aiCards) > 8) return false;
							return get.effect(target, get.autoViewAs({ name: "wugu" }, aiCards), aiPlayer, aiPlayer);
						})
						.set("cards", trigger.cards)
						.set("num", event.type.length)
						.forResult();
				} else {
					skipToStep2 = true;
				}

				// step 1 (only if target === player)
				if (!skipToStep2) {
					if (result && result.targets) {
						trigger.player
							.when("useCard")
							.filter((event, player) => {
								return event.card && get.name(event.card) === "wugu" && event.card.storage.heyingmrfz === true;
							})
							.step(async (event, trigger, player) => {
								trigger.effectCount = type.length;
							})
							.vars({ type: event.type });
						await trigger.player.useCard({ name: "wugu", storage: { heyingmrfz: true } }, trigger.cards, result.targets);
						//@ts-ignore
						player.logSkill("heyingmrfz", result.targets);
						return;
					} else {
						player.storage.counttrigger.heyingmrfz--;
						return;
					}
				}

				// step 2
				result = await player
					.chooseBool(`【禾盈】:是否令${get.translation(trigger.player)}选择是否将此次摸的牌当做五谷丰登使用？`)
					.set("ai", () => {
						const aiPlayer = _status.event.player;
						const aiTarget = _status.event.target;
						return get.attitude(aiTarget, aiPlayer) > 0;
					})
					.set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, ""))
					.set("target", trigger.player)
					.forResult();

				// step 3
				if (result.bool) {
					result = await trigger.player
						.chooseTarget(
							`【禾盈】:你可以将${get.translation(trigger.cards)}当做至多指定${get.cnNumber(event.type.length)}角色且结算${get.cnNumber(event.type.length)}次的【五谷丰登】使用`
						)
						.set("selectTarget", [1, event.type.length])
						.set("filterTarget", (card, player, target) => {
							return player.canUse("wugu", target);
						})
						.set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, ""))
						.set("ai", target => {
							const aiPlayer = _status.event.playerx;
							const aiCards = _status.event.cards;
							const num = _status.event.num;
							if (aiCards.length >= num * 2) return false;
							if (get.value(aiCards) > 8) return false;
							return get.effect(target, get.autoViewAs({ name: "wugu" }, aiCards), aiPlayer, aiPlayer);
						})
						.set("cards", trigger.cards)
						.set("playerx", trigger.player)
						.set("num", event.type.length)
						.forResult();
				} else {
					player.storage.counttrigger.heyingmrfz--;
					return;
				}

				// step 4
				if (result.targets) {
					trigger.player
						.when("useCard")
						.filter((event, player) => {
							return event.card && get.name(event.card) === "wugu" && event.card.storage.heyingmrfz === true;
						})
						.step(async (event, trigger, player) => {
							trigger.effectCount = type.length;
						})
						.vars({ type: event.type });
					await trigger.player.useCard({ name: "wugu", storage: { heyingmrfz: true } }, trigger.cards, result.targets);
					//@ts-ignore
					trigger.player.logSkill("heyingmrfz", result.targets);
				} else {
					player.storage.counttrigger.heyingmrfz--;
				}
			},
		},
	"rancuimrfz": {
			derivation: "liangtianmrfz",
			audio: 2,
			trigger: {
				player: "die",
			},
			direct: true,
			skillAnimation: true,
			animationColor: "wood",
			forceDie: true,
			content: async function (event, trigger, player) {
				var list = player.storage.kenyemrfz;
				for (var i of game.players) {
					if (i == player || !list.includes(i)) continue;
					i.addSkill("liangtianmrfz");
					i.line("liangtianmrfz");
				}
				//@ts-ignore
				player.logSkill("liangtianmrfz");
			},
		},
});

translate({
	"shumrfz": "黍",
	"kenyemrfz": "垦野",
	"kenyemrfz_info": "当一名角色于本回合第一次使用一种类型的牌时，你可以令此牌进入弃牌堆后将其置于其武将牌上且将此牌的伤害基数改为0，然后其回合结束时将武将牌上的每张牌视为【无中生有】或【桃】使用。</br><span style=\"font-family: yuanli\">解民济，饱餐时，良田出国土。<br>荒难生，民改之，万物生如此。</span>",
	"heyingmrfz": "禾盈",
	"heyingmrfz_info": "每回合限一次，当[一名其他角色/你]于摸牌阶段外一次性从牌堆中获得两张牌后，[你可以令其选择是否/你可以]将此次摸的牌当作至多指定X名角色且结算X次的【五谷丰登】使用。（X=此次摸的牌类型的数量）</br><span style=\"font-family: yuanli\">良田万顷岁无饥。</span>",
	"rancuimrfz": "染翠",
	"rancuimrfz_info": "锁定技，当你死亡后，所有被发动过【垦野】的角色获得技能【良田】。</br><span style=\"font-family: yuanli\">寸心枯荣，百谷长青。</span>",
});

characterTitle("shumrfz", "<font color=#42b983>百谷长青</font>");

characterIntro("shumrfz", "黍，炎国农业天师，天师府授业天师。曾于炎国北部农业基地大荒城从事农业研究多年且已有丰富的科研成果。现因访问亲属，以访客身份暂驻罗德岛。");
