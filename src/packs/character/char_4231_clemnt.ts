import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const resigter = (name: string) => {
	character(name, {
		sex: "female",
		hp: 3,
		maxHp: 4,
		skills: ["zhenchaomrfz", "xiulingmrfz"],
		group: "a_groupmrfz",
		pack: "legendSJZX",
	});

	characterTitle(name, whichWayUtil.colorize("#b挽澜交邦#"));
	characterIntro(name, "克莱门莎，阿戈尔荣誉军团长、荣誉执政官、荣誉总战争设计师，负责阿戈尔已经或计划在陆上开展的一切项目。现以合作姿态协助罗德岛在伊比利亚及阿戈尔开展工作，并希望通过罗德岛与更多陆上政治实体建立合作关系。");

	translate({
		[name]: "克莱门莎",

		zhenchaomrfz: "镇潮",
		zhenchaomrfz_info: "每回合每项限一次，[①当你成为【杀】的目标后;②当你使用【杀】指定目标后]，你可以摸一张牌并和[①【杀】的使用者;②【杀】的目标之一]拼点，若你赢，此【杀】[①对你无效;②无视防具]，然后你获得其一张牌并对其造成一点伤害。",
		xiulingmrfz: "修邻",
		xiulingmrfz_info: `当你每回合首次获得牌后，你可以令至多X名角色摸一张牌，然后所有除你以外的被选择的角色可以令你下次拼点牌点数+X。（X=此次你获得牌的数量，X至多为5）`,
	});

	skill({
		zhenchaomrfz: {
			audio: ["作战中1", "作战中2", "作战中3"],
			trigger: {
				player: "useCardToPlayered",
				target: "useCardToTargeted",
			},
			init: initStorage,
			mark: true,
			intro: {
				content(storage, player, skill) {
					return `·【镇潮①】${getUsage("be", player) === true ? "已发动" : "未发动"}<br>·【镇潮②】${getUsage("to", player) === true ? "已发动" : "未发动"}`;
				},
			},
			onremove: true,
			filter(event, player, name, target) {
				if (!event.card || get.name(event.card) !== "sha") return false;
				//成为目标
				// console.log(event,event.target);
				if (event.target === player) {
					// console.log(getUsage("be", player),player.canCompare(event.target))
					return getUsage("be", player) === false && player.canCompare(event.player,true);
				}
				//指定目标
				return getUsage("to", player) === false && event.targets.some(char => player.canCompare(char,true)) && event.getParent()!.triggeredTargets3.length == 1;
			},
			async cost(event, trigger, player) {
				//成为目标
				if (trigger.target === player) {
					const target = trigger.player;
					const target_cn = get.translation(target);
					event.result = await player
						.chooseBool({
							prompt: get.prompt("zhenchaomrfz"),
							prompt2: `是否和${target_cn}拼点，若你赢，若你赢，此【杀】对你无效，然后你弃置${target_cn}一张牌并对${target_cn}造成一点伤害。`,
							ai(event, player) {
								let val = ai_val(event, player, target);
								if (!player.hasShan()) val += player.countCards("h", c => get.value(c) < 6) > 0 ? 10 : 5;
								return val >= 1 + get.rand(0, 5);
							},
						})
						.forResult();
					return;
				}
				//指定目标
				if (trigger.targets.length === 1) {
					const target = trigger.targets[0];
					const target_cn = get.translation(target);
					event.result = await player
						.chooseBool({
							prompt: get.prompt("zhenchaomrfz"),
							prompt2: `是否和${target_cn}拼点，若你赢，若你赢，此【杀】无视防具，然后你弃置${target_cn}一张牌并对${target_cn}造成一点伤害。`,
							ai(event, player) {
								let val = ai_val(event, player, target);
								if (player.countCards("h", c => get.value(c) < 6) > 0) val += 10;
								return val >= 1 + get.rand(0, 5);
							},
						})
						.forResult();
				} else {
					const targets = trigger.targets;
					event.result = await player
						.chooseTarget({
							prompt: get.prompt("zhenchaomrfz"),
							prompt2: `选择和${targets}中的一名角色拼点，若你赢，若你赢，此【杀】无视防具，然后你弃置其一张牌并对其造成一点伤害。`,
							filterTarget(card, player, target) {
								return player.canCompare(target,true) && targets.includes(target);
							},
							ai(target) {
								let val = ai_val(get.event(), get.player(), target);
								if (player.countCards("h", c => get.value(c) < 6) > 0) val += 6;
								if (target.hp < 2) val += 8;
								else if (target.hp < 3) val += 4;
								return val;
							},
						})
						.forResult();
				}

				function ai_val(event: GameEvent, player: Player, target: Player): number {
					let val = 0;
					if (get.attitude2(target) > 0) val -= 20;
					const max = whichWayUtil.filterArray(player.getCards("h"), (i, tools) => {
						return tools.isMax(i);
					})[0];
					val += max;
					if (player.hasSkill("xiulingmrfz")) {
						const num = player.getStorage("xiulingmrfz");
						val += typeof num === "number" ? num : 0;
					}
					return val;
				}
			},
			async content(event, trigger, player) {
				await player.draw();
				//成为目标
				if (trigger.target === player) {
					player.storage["zhenchaomrfz"].be = true;
					player.addTip("zhenchaomrfz_tipsIndex_0", "镇潮①已发动");
					const result = await player.chooseToCompare(trigger.player).forResult();

					if (result.bool === true) {
						trigger.targets.remove(player);
						await eff(trigger.player);
					}
					return;
				}

				//指定目标
				player.storage["zhenchaomrfz"].to = true;
				player.addTip("zhenchaomrfz_tipsIndex_1", "镇潮②已发动");
				const target = event.targets?.[0] || trigger.targets[0];
				const result = await player.chooseToCompare(target).forResult();

				if (result.bool === true) {
					target.addTempSkill("qinggang2");
					target.storage.qinggang2.add(trigger.card);
					target.markSkill("qinggang2");

					await eff(target);
				}

				async function eff(target: Player) {
					await player.gainPlayerCard({
						target,
						forced: true,
						prompt: `【镇潮】:获得${get.translation(target)}的一张牌`,
						position: "he",
					});
					await target.damage({ source: player, num: 1 });
					player.line(target);
				}
			},
			group: "zhenchaomrfz_refresh",
			subSkill: {
				refresh: {
					charlotte: true,
					silent: true,
					trigger: {
						global: "phaseBegin",
					},
					async content(event, trigger, player) {
						initStorage(player, "zhenchaomrfz");
					},
				},
			},
		},
		xiulingmrfz: {
			audio: ["3星结束行动", "行动出发"],
			trigger: {
				player: "gainAfter",
			},
			init(player, skill) {
				player.storage[skill] = 0;
			},
			onremove(player, type) {
				["zhenchaomrfz_tipsIndex_1", "zhenchaomrfz_tipsIndex_0"].forEach(id => player.removeTip(id));
				player.storage[type] = undefined;
			},
			intro: {
				content(storage, player, skill) {
					return `·下次拼点时点数+${storage}`;
				},
			},
			filter(event, player, name, target) {
				return player.getHistory("gain", evt => evt !== event).length < 1;
			},
			async cost(event, trigger, player) {
				const num = trigger.cards.length;
				event.result = await player
					.chooseTarget({
						prompt: get.prompt("xiulingmrfz"),
						prompt2: `你可以令至多${get.cnNumber(num)}名角色摸一张牌，然后所有除你以外的被选择的角色可以令你下次拼点牌点数+${num}。`,
						filterTarget(card, player, target) {
							return true;
						},
						selectTarget() {
							return [1, num];
						},
						ai(target) {
							const player = get.player();
							let val = -1;
							if (get.attitude2(target) > 0) val += 3;
							if (player === target) val += 2;
							return val;
						},
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const num = trigger.cards.length;
				const { targets } = event;
				await game.asyncDraw(targets, 1);
				for (let t of targets) {
					if (t === player) continue;
					const result = await t
						.chooseBool({
							prompt: `【修邻】:是否令${get.translation(player)}下次拼点时点数+${num}？`,
							ai(event, player) {
								const target = get.event().targetx as Player;
								return get.attitude2(target) > 0;
							},
						})
						.set("targetx", player)
						.forResult();
					if (result.bool === true) {
						player.addMark("xiulingmrfz", num, false);
					}
				}
			},
			group: ["xiulingmrfz_extra"],
			subSkill: {
				extra: {
					charlotte: true,
					forced: true,
					audio: "xiulingmrfz",
					trigger: { player: "compare", target: "compare" },
					filter(event, player, name, target) {
						return player.countMark("xiulingmrfz") > 0;
					},
					async content(event, trigger, player) {
						if (player == trigger.target || !trigger.iwhile) {
							trigger[player == trigger.player ? "num1" : "num2"] += player.countMark("xiulingmrfz");
							game.log(player, "的拼点牌点数+" + player.countMark("xiulingmrfz"));
							player.storage.xiulingmrfz = 0;
							player.unmarkSkill("xiulingmrfz");
						}
					},
				},
			},
		},
	});

	type storageTypes = { be: boolean; to: boolean };
	function getUsage(type: "be" | "to", player: Player): boolean {
		const storage: storageTypes = player.getStorage("zhenchaomrfz");
		if (!storage || Object.keys(storage).length < 1) initStorage(player, "zhenchaomrfz");
		return storage[type];
	}

	function initStorage(player: Player, skill: string) {
		player.storage[skill] = {
			be: false,
			to: false,
		};
		["zhenchaomrfz_tipsIndex_1", "zhenchaomrfz_tipsIndex_0"].forEach(id => player.removeTip(id));
	}
};

resigter("char_4231_clemnt");
