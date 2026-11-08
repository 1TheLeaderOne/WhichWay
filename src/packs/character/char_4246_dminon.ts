import { game, get } from "noname";
import { register } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";
import { whichWayFile } from "../../file.js";

/** 拥有〖托体〗的角色数（至少为 1） */
const tuotiCount = () => Math.max(1, game.countPlayer(current => current.hasSkill("tuotimrfz", null, null, false)));

/** 取给予该角色〖托体〗的角色（即国度） */
const tuotiGiver = player => {
	const id = player?.storage?.tuotimrfz;
	if (id == null) return;
	return game.players.concat(game.dead || []).find(current => current.playerid === id);
};

/** 本回合置入弃牌堆、且当前仍位于弃牌堆中的牌 */
const tuotiPool = () => get.discarded().filterInD("d");

register("char_4246_dminon", {
	character: {
		designer: ["Flandre"],
		hp: 3,
		maxHp: 4,
		group: "wumrfz",
		pack: "legendSJZX",
		skills: ["xuanxianmrfz", "jianglimrfz"],
		sex: "none",
		llm: "DeepSeek-4.1-Flash",
	},
	skillInfo: {
		xuanxianmrfz: {
			skillName: "玄霰",
			info: "与你距离不大于X的一名其他角色成为牌的目标时，若此牌的使用者本局未对你造成过伤害，你可以选择一项：①弃置其一张牌，然后其对你造成1点伤害；②对其造成1点伤害，然后本回合你不能再对其发动〖玄霰〗。（X为拥有〖托体〗的角色数，且至少为1）",
			skill: {
				audio: ["部署2","部署1"],
				group: ["xuanxianmrfz_ban"],
				trigger: { global: "useCardToTarget" },
				filter(event, player) {
					const target = event.target;
					if (!target || target === player || !target.isIn()) return false;
					if (player.distanceTo(target) > tuotiCount()) return false;
					// 本回合已因选项②对该角色发动过
					if ((player.storage.xuanxianmrfz_ban || []).includes(target)) return false;
					const user = event.player;
					if (!user) return false;
					// 此牌的使用者本局未对你造成过伤害
					const damaged = game.getAllGlobalHistory("everything", evt => evt.name === "damage" && evt.source === user && evt.player === player);
					return !damaged.length;
				},
				check(event, player) {
					return get.attitude(player, event.target) < 0;
				},
				async content(event, trigger, player) {
					const target = trigger.target;
					const discardControl = "弃置其一张牌，然后其对你造成1点伤害";
					const damageControl = "对其造成1点伤害，然后本回合你不能再对其发动〖玄霰〗";
					const controls = target.countDiscardableCards(target, "he") > 0 ? [discardControl, damageControl] : [damageControl];
					const result = await player
						.chooseControl({
							controls,
							prompt: `玄霰：是否对${get.translation(target)}发动？`,
							prompt2: get.skillInfoTranslation("xuanxianmrfz"),
							ai() {
								// AI 一律选择对其造成伤害并封锁
								return controls.length - 1;
							},
						})
						.forResult();
					if (!result?.control || result.control === "cancel2") return;
					player.logSkill("xuanxianmrfz", target);
					if (result.control === discardControl) {
						await player.discardPlayerCard({
							target,
							position: "he",
							forced: true,
							prompt: `玄霰：弃置${get.translation(target)}的一张牌`,
						});
						await player.damage({ num: 1, source: target });
					} else {
						await target.damage({ num: 1, source: player });
						// 封锁记录由 subSkill ban 在回合结束时清空
						player.storage.xuanxianmrfz_ban = (player.storage.xuanxianmrfz_ban || []).concat([target]);
					}
				},
				subSkill: {
					ban: {
						charlotte: true,
						popup: false,
						forced: true,
						trigger: { global: "phaseAfter" },
						async content(event, trigger, player) {
							delete player.storage.xuanxianmrfz_ban;
						},
					},
				},
			},
		},
		jianglimrfz: {
			skillName: "疆理",
			info: "当一名角色的体力值发生变化后，若其没有〖托体〗，你可以令其获得技能〖托体〗；你的手牌上限和使用【杀】的次数上限均+X。当你死亡时，所有拥有〖托体〗的角色弃置区域内所有的牌。（X为拥有〖托体〗的角色数，且至少为1）",
			skill: {
				audio: ["作战中3","作战中4"],
				derivation: ["tuotimrfz"],
				whichway: {
					affiliates: ["tuotimrfz"],
				},
				group: ["jianglimrfz_grant", "jianglimrfz_die"],
                mark:true,
                intro:{
                    markcount(storage, player, skill) {
                        return tuotiCount();
                    },
                    content(storage, player, skill) {
                        return `·你的手牌上限和使用【杀】的次数上限+${tuotiCount()}`
                    },
                },
                onremove(player, type) {
                    game.players.forEach(char=>{
                        if(char.hasSkill("tuotimrfz")&&tuotiGiver(char) === player){
                            char.removeSkill("tuotimrfz");
                        }
                    })
                },
				mod: {
					maxHandcard(player, num) {
						return num + tuotiCount();
					},
					cardUsable(card, player, num) {
						if (card.name === "sha") return num + tuotiCount();
					},
				},
				subSkill: {
					grant: {
						audio: "jianglimrfz",
						trigger: { global: "changeHpAfter" },
						filter(event, player) {
							const target = event.player;
							if (!target || target === player || !target.isIn()) return false;
							if (!event.changedHp) return false;
							return !target.hasSkill("tuotimrfz", null, null, false);
						},
						check(event, player) {
							return get.attitude(player, event.player) <= 0;
						},
						async content(event, trigger, player) {
							const target = trigger.player;
							player.logSkill("jianglimrfz", target);
							player.line(target, "green");
							target.addSkill("tuotimrfz");
							target.storage.tuotimrfz = player.playerid;
							game.log(target, "获得了技能", "#g【托体】");
						},
					},
					die: {
						audio: "jianglimrfz",
						forced: true,
						forceDie: true,
						trigger: { player: "die" },
						filter(event, player) {
							return game.hasPlayer(current => current.hasSkill("tuotimrfz", null, null, false));
						},
						async content(event, trigger, player) {
							const holders = game.filterPlayer(current => current.hasSkill("tuotimrfz", null, null, false));
							for (const holder of holders) player.line(holder, "thunder");
							for (const holder of holders) {
								const cards = holder.getCards("hej");
								if (cards.length) await holder.discard({ cards });
								holder.removeSkill("tuotimrfz");
								game.log(holder, "失去了技能", "#g【托体】");
							}
						},
					},
				},
			},
		},
		tuotimrfz: {
			skillName: "托体",
			info: "当你使用牌指定角色A为目标时，角色A可以弃置一张与此牌类别相同的牌，令此牌对角色A无效；你的回合结束时，角色A可以使用弃牌堆中本回合置入的至多X张牌。（X为你已损失的体力值，角色A为给予你此技能的角色）",
			skill: {
				audio: ["完成高难行动","非3星结束行动"],
				onremove: true,
				group: ["tuotimrfz_end"],
				trigger: { global: "useCardToTarget" },
                mark:true,
                markimage:whichWayFile.compilePath("skill:tuotimrfz.png"),
                intro:{
                    name:"████",
                    content(storage, player, skill) {
                        const giver = tuotiGiver(player);
                        if(!giver) return `·受██了████的影███`
                        return `·受到了${get.translation(giver)}的影响`
                    },
                },
				filter(event, player) {
					const giver = tuotiGiver(player);
					if (!giver || giver === player || !giver.isIn()) return false;
					if (event.player !== player || event.target !== giver) return false;
					return giver.countDiscardableCards(giver, "he", card => get.type2(card) === get.type2(event.card)) > 0;
				},
				check(event, player) {
					const giver = tuotiGiver(player);
					if (!giver) return false;
					return get.effect(giver, event.card, player, giver) < 0;
				},
				async content(event, trigger, player) {
					const giver = tuotiGiver(player);
					if (!giver?.isIn()) return;
					const cardType = get.type2(trigger.card);
					const result = await giver
						.chooseToDiscard({
							position: "he",
							prompt: `托体：是否弃置一张与${get.translation(trigger.card)}类别相同的牌，令此牌对你无效？`,
							filterCard: card => get.type2(card) === cardType,
						})
						.forResult();
					if (!result?.bool) return;
					player.logSkill("tuotimrfz", giver);
					trigger.targets.remove(giver);
					trigger.getParent()!.triggeredTargets2.remove(giver);
					trigger.untrigger();
				},
				subSkill: {
					end: {
						audio: "tuotimrfz",
						trigger: { player: "phaseEnd" },
						filter(event, player) {
							const giver = tuotiGiver(player);
							if (!giver || !giver.isIn()) return false;
							if (player.maxHp - player.hp <= 0) return false;
							return tuotiPool().length > 0;
						},
						check() {
							return true;
						},
						async content(event, trigger, player) {
							const giver = tuotiGiver(player);
							if (!giver?.isIn()) return;
							const num = player.maxHp - player.hp;
							const cards = tuotiPool();
							if (num <= 0 || !cards.length) return;
							player.logSkill("tuotimrfz", giver);
							// 用过的牌会回到弃牌堆，从候选里移除以免重复使用
							const pool = cards.slice(0);
							let used = 0;
							while (used < num) {
								// 牌留在弃牌堆，直接从弃牌堆里选用
								const usable = pool.filterInD("d").filter(card => giver.hasUseTarget(card));
								if (!usable.length) break;
								// 一次只选一张；选择取消即视为不再使用
								const result = await giver
									.chooseButton({
										createDialog: ["托体：选择一张要使用的牌", usable],
										selectButton: 1,
										ai: button => giver.getUseValue(button.link) + 0.1,
									})
									.forResult();
								if (!result?.bool || !result.links?.length) break;
								const card = result.links[0];
								await giver
									.chooseUseTarget({
										card,
										forced: true,
										prompt: "托体：使用选择的牌",
										prompt2: `至多使用${num}张，还可使用${num - used}张`,
									})
									.forResult();
								pool.remove(card);
								used++;
							}
						},
					},
				},
			},
		},
	},
	characterTranslate: "国度",
	title: "唯余黑雪",
	intro: "国度，以乌萨斯皇帝内卫形式现身的坍缩体，已确认不对任何乌萨斯官方机构负责，且不像其他内卫一样受乌萨斯意志掌控。圣骏堡事变后自主出现在罗德岛驻圣骏堡办事处，经考察决定，现将其收容于罗德岛本部。",
});
