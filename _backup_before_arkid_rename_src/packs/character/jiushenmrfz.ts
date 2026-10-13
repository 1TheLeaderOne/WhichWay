import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("jiushenmrfz", { pack: "legendSJZX",
			sex: "male",
			group: "weimrfz",
			hp: 1,
			maxHp: 3,
			skills: ["xinyunmrfz","zongyinmrfz","zhanwangmrfz"],
		});

skill({
	"xinyunmrfz": {
			audio: 2,
			trigger: { global: "dying" },
			usable: 1,
			filter(event, player) {
				return !event.player.storage.xinyunmrfz_ban;
			},
			prompt(event, player) {
				//@ts-ignore
				return `【欣殒】:是否令${event.player === player ? "你" : get.translation(event.player)}摸4张牌并使用其中能使用的牌？`;
			},
			check(event, player) {
				return get.attitude(player, event.player) > 2;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				const result = await target.draw(4).forResult();
				if (!result) return;
				game.broadcastAll(
					(target, cards) => {
						target.storage.xinyunmrfz = true;
						target.storage.xinyunmrfz_ban = true;
						target.storage.xinyunmrfz_cards = result.cards;
					},
					//@ts-ignore
					target,
					result
				);
				target
					.when({
						source: "damageEnd",
						player: "dyingAfter",
					})
					.filter((event, player) => {
						if (event.name !== "damage") return true;
						return player.hasHistory("sourceDamage", evt => {
							if (evt.player && evt.player === player) return false;
							//@ts-ignore
							return evt.cards && evt.cards.some(card => result.cards.includes(card));
						});
					})
					.then(async (event, trigger, player) => {
						game.broadcastAll(player => {
							delete player.storage.xinyunmrfz;
							delete player.storage.xinyunmrfz_ban;
							//@ts-ignore
						}, player);
					});
				while (true) {
					let cards = target.getCards("h", card => {
						//@ts-ignore
						if (!result.cards.includes(card)) return false;
						return target.hasUseTarget(card);
					});
					if (cards.length < 1) break;
					await target
						.chooseToUse()
						.set("filterCard", function (card, player, event) {
							let cards = player.storage.xinyunmrfz_cards;
							if (!cards.includes(card)) return false;
							//@ts-ignore
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("prompt", `请使用一张牌`)
						.set("forced", true)
						.set("addCount", false);
				}
				if (target.storage.xinyunmrfz) {
					await target.loseHp();
				} else player.recoverTo(1);
				game.broadcastAll(target => {
					delete target.storage.xinyunmrfz_ban;
					delete target.storage.xinyunmrfz_cards;
					//@ts-ignore
				}, target);
			},
			ai: {
				threaten: 2,
				maixie: true,
				maixie_hp: true,
				skillTagFilter(player, tag, arg) {
					return !!(player.getStat("skill").xinyunmrfz && player.getStat("skill").xinyunmrfz > 0);
				},
				effect: {
					target: function (card, player, target) {
						if (player.hp < 2 && get.tag(card, "damage")) return [1, 0.55];
					},
				},
			},
		},
	"zongyinmrfz": {
			audio: 2,
			enable: "chooseToUse",
			mark: true,
			intro: {
				content(storage) {
					return `本轮已使用的花色:${get.translation(storage)}`;
				},
			},
			init: (player, skill) => (player.storage[skill] = []),
			position: "hes",
			viewAs: {
				name: "jiu",
			},
			viewAsFilter(player) {
				return player.countCards("he", card => !player.storage.zongyinmrfz.includes(get.suit(card))) > 0;
			},
			filterCard(card, player, target) {
				return !player.storage.zongyinmrfz.includes(get.suit(card));
			},
			onuse(result, player) {
				let card = result.card;
				game.broadcastAll(
					function (card, player) {
						player.storage.zongyinmrfz.add(get.suit(card));
					},
					//@ts-ignore
					card,
					player
				);
			},
			check(card) {
				if (_status.event.type === "dying") return 1 / Math.max(0.1, get.value(card));
				return 4 - get.value(card);
			},
			group: "zongyinmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					trigger: {
						global: "roundStart",
					},
					silent: true,
					content: async function (event, trigger, player) {
						player.storage.zongyinmrfz = [];
					},
				},
			},
			ai: {
				threaten: 1.5,
				basic: {
					useful: (card, i) => {
						if (_status.event.player.hp > 1) {
							if (i === 0) return 4;
							return 1;
						}
						if (i === 0) return 7.3;
						return 3;
					},
					value: (card, player, i) => {
						if (player.hp > 1) {
							if (i === 0) return 5;
							return 1;
						}
						if (i === 0) return 7.3;
						return 3;
					},
				},
				order(item, playerx) {
					const player = playerx || get.player();
					//@ts-ignore
					if (_status.event.dying) return 9;
					let sha = get.order({ name: "sha" });
					if (sha <= 0) return 0;
					let usable = player.getCardUsable("sha");
					if (
						usable < 2 &&
						player.hasCard(i => {
							return get.name(i, player) == "zhuge";
						}, "hs")
					)
						usable = Infinity;
					//@ts-ignore
					let shas = Math.min(usable, player.mayHaveSha(player, "use", item, "count"));
					//@ts-ignore
					if (shas != 1 || (lib.config.mode === "stone" && !player.isMin() && player.getActCount() + 1 >= player.actcount)) return 0;
					return sha + 0.2;
				},
				result: {
					target: (player, target, card) => {
						if (target && target.isDying()) return 2;
						//@ts-ignore
						if (!target || target._jiu_temp || !target.isPhaseUsing()) return 0;
						let effs = { order: 0 },
							temp;
						target.getCards("hs", i => {
							if (get.name(i) !== "sha" || ui.selected.cards.includes(i)) return false;
							temp = get.order(i, target);
							if (temp < effs.order) return false;
							if (temp > effs.order) effs = { order: temp };
							effs[i.cardid] = {
								card: i,
								target: null,
								eff: 0,
							};
						});
						//@ts-ignore
						delete effs.order;
						for (let i in effs) {
							if (!lib.filter.filterCard(effs[i].card, target)) continue;
							game.filterPlayer(current => {
								if (
									get.attitude(target, current) >= 0 ||
									//@ts-ignore
									!target.canUse(effs[i].card, current, null, true) ||
									current.hasSkillTag("filterDamage", null, {
										player: target,
										card: effs[i].card,
										jiu: true,
									})
								)
									return false;
								temp = get.effect(current, effs[i].card, target, player);
								if (temp <= effs[i].eff) return false;
								effs[i].target = current;
								effs[i].eff = temp;
								return false;
							});
							if (!effs[i].target) continue;
							if (
								target.hasSkillTag(
									"directHit_ai",
									true,
									{
										target: effs[i].target,
										card: i,
									},
									true
								) ||
								//(Math.min(target.getCardUsable("sha"), target.mayHaveSha(player, "use", item, "count")) === 1 && (
								target.needsToDiscard() > Math.max(0, 3 - target.hp) ||
								!effs[i].target.mayHaveShan(
									player,
									"use",
									effs[i].target.getCards(i => {
										return i.hasGaintag("sha_notshan");
									})
								)
								//))
							) {
								//@ts-ignore
								delete target._jiu_temp;
								return 1;
							}
						}
						//@ts-ignore
						delete target._jiu_temp;
						return 0;
					},
				},
				tag: {
					save: 1,
					recover: 0.1,
				},
			},
		},
	"zhanwangmrfz": {
			audio: 2,
			trigger: { player: "useCard2" },
			filter(event, player) {
				return !event.targets.includes(player) && !["delay", "equip"].includes(get.type(event.card));
			},
			forced: true,
			intro: {
				content: "本回合手牌上限+#",
			},
			async content(event, trigger, player) {
				trigger.targets.push(player);
			},
			group: "zhanwangmrfz_handLimit",
			subSkill: {
				handLimit: {
					audio: false,
					silent: true,
					trigger: {
						target: "useCardToTargeted",
					},
					filter(event, player) {
						return event.card && get.tag(event.card, "damage") && event.targets.includes(player);
					},
					async content(event, trigger, player) {
						player.addMark("zhanwangmrfz", 1, false);
						if (
							player.getSkills().some(skill => {
								let info = get.info(skill);
								return info.zhanwangmrfz;
							})
						)
							return;
						player
							.when({ global: "phaseEnd" })
							.then(async (event,trigger,player) => {
								player.unmarkSkill("zhanwangmrfz");
								player.removeMark("zhanwangmrfz", player.countMark("zhanwangmrfz"), false);
							})
							.assign({
								zhanwangmrfz: true,
								mod: {
									maxHandcard(player, num) {
										return num + player.getStorage("zhanwangmrfz");
									},
								},
							});
					},
				},
			},
		},
});

translate({
	"jiushenmrfz": "酒神",
	"xinyunmrfz": "欣殒",
	"xinyunmrfz_info": "每回合限一次，当有角色进入濒死状态时，你可以令其摸4张牌并使用其中的所有能使用的牌，若其因此对其他角色造成伤害，其将体力值回复至1，反之，其失去一点体力。",
	"zongyinmrfz": "纵饮",
	"zongyinmrfz_info": "每轮每种花色限一次，你可以将一张牌当【酒】使用。",
	"zhanwangmrfz": "谵妄",
	"zhanwangmrfz_info": "锁定技，你始终成为你使用的普通锦囊和基本牌的目标;当你成为伤害类牌的目标时，你本回合手牌上限+1（可叠加）。",
});

characterTitle("jiushenmrfz", "<font color='#124FFF'>戏中人</font>");

characterIntro("jiushenmrfz", "酒神，曾以独立刺客的身份受雇于罗德岛，担任特种干员。结束蓝卡坞的拍摄归来时，干员傀影已经实现自己最早来罗德岛的目的。在同博士协商后，他决定继续保留与罗德岛的合作关系，在游历泰拉的旅程中，以辅助干员的身份为落脚地附近的办事处提供相应支持。");
