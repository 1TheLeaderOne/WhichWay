import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yunxingmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["yxliumingmrfz","dingyuanmrfz"],
		});

skill({
	"dingyuanmrfz": {
			derivation: "zhimingmrfz",
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.yxliumingmrfz_count;
					if (player.awakenedSkills && player.awakenedSkills.includes("dingyuanmrfz")) {
						return "置于过武将牌上的牌:" + get.translation(storage["card"]);
					}
					return (
						"已置于过武将牌上" +
						storage["count"] +
						"张牌</br>置于过武将牌上的牌（装备牌和延时锦囊除外）:" +
						get.translation(storage["card"])
					);
				},
			},
			onremove: true,
			audio: 2,
			forced: true,
			skillAnimation: true,
			animationColor: "thunder",
			unique: true,
			juexingji: true,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter: function (event, player) {
				return player.storage.yxliumingmrfz_count["count"] >= 3;
			},
			async content(event, trigger, player) {
				player.awakenSkill("dingyuanmrfz");
				player.loseMaxHp();
				player.addSkill("zhimingmrfz");
			},
		},
	"yxliumingmrfz": {
			audio: 2,
			forced: true,
			trigger: {
				global: "phaseBegin",
			},
			marktext: "铭",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			filter: function (event, player) {
				return player.getExpansions("yxliumingmrfz").length < 1;
			},
			async content(event, trigger, player) {
				var cards = game.cardsGotoOrdering(get.cards(1)).cards[0];
				player.addToExpansion(cards, player, "giveAuto").gaintag.add("yxliumingmrfz");
			},
			group: ["yxliumingmrfz_target", "yxliumingmrfz_use", "yxliumingmrfz_count"],
			subSkill: {
				count: {
					init: function (player) {
						player.storage.yxliumingmrfz_count = {
							count: 0,
							card: [],
						};
					},
					onremove: function (player) {
						delete player.storage.yxliumingmrfz_count;
					},
					silent: true,
					charlotte: true,
					trigger: {
						player: "addToExpansionAfter",
					},
					filter: function (event, player) {
						//@ts-ignore
						return event.getParent().name == "yxliumingmrfz";
					},
					async content(event, trigger, player) {
						if (!player.storage.yxliumingmrfz_count)
							player.storage.yxliumingmrfz_count = {
								count: 0,
								card: [],
							};
						if (!player.awakenedSkills || !player.awakenedSkills.includes("dingyuanmrfz")) player.storage.yxliumingmrfz_count["count"]++;
						if (trigger.cards) {
							for (var i of trigger.cards) {
								if (get.type(i) == "equip" || get.type(i) == "delay") continue;
								if (player.storage.yxliumingmrfz_count["card"].includes(i.name)) continue;
								player.storage.yxliumingmrfz_count["card"].add(i.name);
							}
						}
					},
				},
				ban: {
					charlotte: true,
				},
				use: {
					enable: "chooseToUse",
					hiddenCard: function (player, name) {
						if (player.getExpansions("yxliumingmrfz").length < 1) return false;
						return name == player.getExpansions("yxliumingmrfz")[0].name;
					},
					filter: function (event, player) {
						if (player.getExpansions("yxliumingmrfz").length < 1) return false;
						return event.filterCard({ name: player.getExpansions("yxliumingmrfz")[0].name, isCard: true }, player, event);
					},
					chooseButton: {
						dialog: function (event, player) {
							var vcards = [];
							var card = player.getExpansions("yxliumingmrfz")[0].name;
							var type = get.translation(get.type2(card));
							if (event.filterCard({ name: card, isCard: true }, player, event)) vcards.push([type, "", card]);

							/**
							 * @type { Dialog }
							 */
							//@ts-ignore
							var dialog = ui.create.dialog("流铭", [vcards, "vcard"], "hidden");
							//@ts-ignore
							dialog.direct = true;
							return dialog;
						},
						backup: function (links, player) {
							return {
								filterCard: card => {
									var player = _status.event.player;
									return !!player.getExpansions("yxliumingmrfz")[0];
								},
								selectCard: -1,
								position: "x",
								viewAs: {
									name: links[0][2],
									nature: links[0][3],
								},
								async precontent(event, trigger, player) {
									//@ts-ignore
									player.logSkill("yxliumingmrfz");
								},
							};
						},
						prompt: function (links, player) {
							return (
								"【流铭】：使用一张" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】"
							);
						},
					},
					ai: {
						order: function () {
							var player = _status.event.player;
							var card = player.getExpansions("yxliumingmrfz")[0];
							return get.order(card) + 0.1;
						},
						result: {
							player: 1,
						},
					},
				},
				target: {
					trigger: {
						target: "useCardToPlayered",
					},
					filter: function (event, player) {
						if (event.player == player) return false;
						if (player.getExpansions("yxliumingmrfz").length == 0 || !event.card) return false;
						var suit = get.suit(event.card);
						return !!player.getExpansions("yxliumingmrfz").filter(function (magic) {
							return get.suit(magic) == suit || magic.number != event.card.number;
						}).length;
					},
					forced: true,
					async content(event, trigger, player) {
						const card = player.getExpansions("yxliumingmrfz")[0];
						var num1 = card.number,
							num2 = trigger.card.number;
						if (num1 != num2) {
							var type = get.type2(card);
							var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
							const result = await trigger.player
								.chooseToDiscard(
									"【流铭】:请弃置一张" + get.translation(get.type(card)) + "牌，否则此牌对" + get.translation(player) + "无效"
								)
								.set("filterCard", function (card) {
									return get.type2(card) == _status.event.type;
								})
								.set("ai", function (card) {
									if (_status.event.eff > 0) {
										return 10 - get.value(card);
									}
									return 0;
								})
								.set("eff", eff)
								.set("type", type)
								.forResult();

							if (result.bool == false) {
								trigger.targets.remove(player);
								//@ts-ignore
								trigger.getParent().triggeredTargets2.remove(player);
								trigger.untrigger();
								player.removeSkill("yxliumingmrfz_target");
								player.addTempSkill("yxliumingmrfz_reget", { global: "phaseBegin" });
								player.addTempSkill("yxliumingmrfz_ban", { global: "phaseEnd" });
							}
						}
						("step 1");
						const cardx = player.getExpansions("yxliumingmrfz")[0];
						if (get.suit(cardx) == get.suit(trigger.card)) {
							player.gain(cardx, "gain2");
						}
						//@ts-ignore
						player.logSkill("yxliumingmrfz");
					},
				},
				reget: {
					silent: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.addSkill("yxliumingmrfz_target");
					},
				},
			},
		},
});

translate({
	"yunxingmrfz": "陨星",
	"dingyuanmrfz": "定愿",
	"dingyuanmrfz_info": "觉醒技，准备阶段，若你于本局游戏中置于武将牌上过至少三张‘铭’，你失去一点体力上限并获得技能【祗铭】。",
	"yxliumingmrfz": "流铭",
	"yxliumingmrfz_info": "①锁定技，一名角色的回合开始时，若你武将牌上没有‘铭’，你将牌堆顶的一张牌置于你的武将牌上，称之为‘铭’。②锁定技，当你成为其他角色使用的牌的目标后，若此牌[花色/点数]与‘铭’[相同/不同]，则[你获得武将牌上的‘铭’/其须弃置一张与‘铭’类型一致的牌，否则此牌对你无效且你失去此技能直到本回合结束]。③你可以使用‘铭’。",
});

characterIntro("yunxingmrfz", "陨星，前“守林人”组织成员，现自由佣兵，此外履历不详。</br>现作为狙击干员为罗德岛服务，使用手中的弩炮发挥出卓越的范围杀伤力。");
