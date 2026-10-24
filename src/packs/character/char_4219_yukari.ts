import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const resigter = function (name = "char_4219_yukari") {
	character(name, {
		sex: "female",
		hp: 3,
		skills: ["longjuanmrfz", "mingjinmrfz"],
		pack: "epicSJZX",
		group: "persona",
		designer: ["Flandre"],
		llm: "Qwen-3.8-Flash",
		whichWay: {
			linkage: true,
			arknight: {
				camp: "persona",
			},
		},
	});

	characterTitle(name, whichWayUtil.colorize("#r恋人#"));
	characterIntro(name, "岳羽由加莉，1102年3月于中庭公证所登记为第三类驻留人员，根据拉特兰公民权利章程附录第三十六条、入境人员管理条例第二章第五条，由圣马尔索综合学校接收入学。<br>教师评语：岳羽由加莉同学聪慧友善，温柔开朗，善于沟通，有很强的独立意识。在类铳型武装系列课程中，岳羽同学的弓术给任课教师留下了深刻的印象。希望岳羽同学在面对困难时，亦不妨接受来自师长同学的帮助，与大家一同建设互帮互助、温暖和谐的班集体。");

	translate({
		[name]: "岳羽由加莉",

		longjuanmrfz: "龙卷",
		longjuanmrfz_info: `当你受到伤害后，你可以摸一张牌并与一名其他角色议事，若议事结果为：<br><b>无结果</b>:所有参与议事的角色对其他参与议事角色造成一点伤害;<br><b>${whichWayUtil.colorize("#r红色#")}</b>:所有参与议事的角色将手牌调整至与所有议事角色中手牌数最多的角色一致;<br><b>${whichWayUtil.colorize("#black#黑色#")}</b>:所有议事角色将体力值调整至与所有议事角色中体力值最少的角色一致`,
		mingjinmrfz: "明镜",
		mingjinmrfz_info: "每项每回合限一次，当有角色体力值不因【明镜】而发生变动时，①你可以令至多X名角色本轮下次受到伤害后受到一点无来源伤害;②你可以令至多X名角色本轮下次受到伤害后回复一点体力。（X = 你的体力值）",
		// mingjinmrfz_sh: "明镜",
		// mingjinmrfz_sh_info: "明镜标记：本轮下次受到伤害后，受到1点无来源伤害。",
		// mingjinmrfz_hf: "明镜",
		// mingjinmrfz_hf_info: "明镜标记：本轮下次受到伤害后，回复1点体力。",
	});

	skill({
		longjuanmrfz: {
			audio: ["作战中1", "作战中2"],
			trigger: {
				player: "damageEnd",
			},
			filter(event, player, name, target) {
				return game.hasPlayer(char => char !== player && char.countCards("h") > 0);
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt("longjuanmrfz"),
						prompt2: get.skillInfoTranslation("longjuanmrfz"),
						filterTarget(card, player, target) {
							return target !== player && target.countCards("h") > 0;
						},
						ai(target) {
							const player = get.player();
							const hasRed = player.countCards("h", { color: "red" }) > 0;
							const hasBlack = player.countCards("h", { color: "black" }) > 0;
							const [t_cardNum, p_cardNum] = [target.countCards("h"), player.countCards("h")];
							const isFriend = get.attitude2(target) > 0;

							let val = get.rand(-2, 5);
							if (get.attitude2(target) < 0) val += 2;
							if (get.attitude2(target) > 0 && target.countCards("h") < 3) val -= 5;
							//没牌并且对方手牌多
							if (p_cardNum === 0 && t_cardNum > p_cardNum) {
								//体力值不比对方多
								if (player.hp <= target.hp) {
									if (isFriend) val += (t_cardNum - p_cardNum) * 0.5;
									else val += (t_cardNum - p_cardNum) * 3;
								} else {
									if (isFriend) val -= player.hp - target.hp;
									else val -= (player.hp - target.hp) * 0.8;
								}
							}

							//有红时
							if (hasRed) {
								if (t_cardNum > p_cardNum) {
									//AI更倾向于让自己多摸牌
									val += (t_cardNum - p_cardNum) * 0.8;
								} else {
									if (get.attitude2(target) > 0) {
										val += Math.abs(t_cardNum - p_cardNum) * 0.6;
									} else {
										//不能让敌人多摸牌
										val -= Math.abs(t_cardNum - p_cardNum);
									}
								}
							}
							//没红时
							else {
								if (t_cardNum > p_cardNum) {
									if (get.attitude2(target) > 0) {
										val -= 2;
									} else {
										if (player.hp > 1) val += 5;
										else val += 1;
									}
								} else {
									if (get.attitude2(target) < 0) val -= Math.abs(t_cardNum - p_cardNum);
									else {
										if (target.countCards("h") >= 2) val += Math.abs(t_cardNum - p_cardNum) * 0.5;
									}
								}
							}

							//有黑时
							if (hasBlack) {
								if (isFriend) val -= 4;
								else {
									if (player.hp > target.hp) val -= 4;
									else val += Math.abs(player.hp - target.hp) * 0.8;
								}
							}

							return val;
						},
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const target = event.targets?.[0];
				const result = await player
					.chooseToDebate({
						list: [player, target],
						args: [],
					})
					.set("ai", (card: Card) => aiChoose(card, get.player(), target))
					.set("aiCard", () => {
						const hs = target.getCards("h").sort((a, b) => aiChoose(b, target, player) - aiChoose(a, target, player));
						return { bool: true, cards: [hs[0]] };
					})
					.forResult();

				/**
                 * event.result = {
			bool: true,
			opinion,
			opinions: event.opinions,
			targets,
		};
                 */
				if (!result.targets) return;
				if (result.opinion === "red") {
					const max = Math.max(...result.targets.map(i => i.countCards("h")));
					for (let target of result.targets) {
						target.adjustHandCardTo(max);
					}
				} else if (result.opinion === "black") {
					const min = Math.min(...result.targets.map(i => i.hp));
					for (let target of result.targets) {
						if (target.hp === min) continue;
						target.changeHp(min - target.hp);
					}
				} else {
					for (let target of result.targets) {
						for (let targetx of result.targets) {
							if (target === targetx) continue;
							target.line(targetx);
							targetx.damage({ source: target });
						}
					}
				}

				function aiChoose(card: Card, player: Player, target: Player): number {
					const [t_cardNum, p_cardNum] = [target.countCards("h"), player.countCards("h")];
					const [t_hp, p_hp] = [target.hp, player.hp];
					const abs_cardNum = Math.abs(t_cardNum - p_cardNum);
					const abs_hp = Math.abs(t_hp - p_hp);
					const isFriend = get.attitude2(target) > 0;

					let val = get.rand(1, 3);
					if (get.color(card) === "red") {
						if (t_cardNum === p_cardNum) {
							if (isFriend) val += 5;
						} else if (t_cardNum > p_cardNum) {
							if (isFriend) val += abs_cardNum * 0.8;
							else {
								if (player.hp < 2) val += abs_cardNum * 0.1;
								else val -= abs_cardNum * 0.8;
							}
						} else {
							if (isFriend) val += abs_cardNum * 0.6;
							else {
								if (player.hp < 2) val += abs_cardNum * 0.1;
								else val -= abs_cardNum * 0.8;
							}
						}
					}
					if (get.color(card) === "black") {
						if (isFriend) {
							if (abs_hp === 0) val += 5;
							else val -= abs_hp * 1.2;
						} else {
							if (t_hp > p_hp) val += abs_hp * 0.9;
							else if (t_hp < p_hp) val -= abs_hp * 0.8;
							else val += get.rand(-5, 5);
						}
					}

					return val;
				}
			},
		},
		mingjinmrfz: {
			audio: ["作战中3", "作战中4"],
			//体力值发生变动（不区分对象）后触发；以 changeHpAfter 为时机（damage / recover / loseHp / gainHp 都会经过它）
			trigger: {
				global: "changeHpAfter",
			},
			filter(event, player) {
				if (!player.isAlive()) {
					return false;
				}
				//排除【明镜】自身标记造成的体力变动（①的无来源伤害 / ②的回复），否则会自触发连环
				//getParent(name, true)：未命中返回 undefined（见 gameEvent.ts），命中才为真值
				if (event.getParent("mingjinmrfz_sh", true) || event.getParent("mingjinmrfz_hf", true)) {
					return false;
				}
				//每项每回合限一次：两项都已在本回合（你的回合开始才清零）用过就不再提示
				const stat = player.getStat("skill");
				return !(stat.mingjinmrfz_sh && stat.mingjinmrfz_hf);
			},
			async cost(event, trigger, player) {
				const stat = player.getStat("skill");
				const opts: string[] = [];
				if (!stat.mingjinmrfz_sh) opts.push("sh");
				if (!stat.mingjinmrfz_hf) opts.push("hf");
				if (!opts.length) return;
				//X = 发动时的体力值
				const x = player.hp;
				const desc: Record<string, string> = {
					sh: `造成伤害：令至多${get.cnNumber(x)}名角色本轮下次受到伤害后受到1点无来源伤害`,
					hf: `回复体力：令至多${get.cnNumber(x)}名角色本轮下次受到伤害后回复1点体力`,
				};
				const transMaps: Record<string, string> = {
					sh: "造成伤害",
					hf: "回复体力",
				};
				const result = await player
					.chooseControl({
						prompt: "请选择一项",
						choiceList: opts.map(k => desc[k]),
						controls: [...opts.map(k => transMaps[k]), "cancel2"],
						ai(event, player) {
                            const list = [0,1];
                            if(player.hp < 2) list.push(0);
                            return list.randomGet();
                        },
					})
                    .set("displayIndex",false)
					.forResult();
				if (typeof result.index === "number" && result.control !== "cancel2" && opts[result.index]) {
					event.result = {
						bool: true,
						cost_data: { key: opts[result.index], x },
					};
				}
			},
			async content(event, trigger, player) {
				const { key, x } = event.cost_data;
				//记一次使用（player.stat 会在你下个回合开始时自动重置，即"每回合限一次"）
				player.getStat("skill")["mingjinmrfz_" + key] = 1;
				const result = await player
					.chooseTarget({
						prompt: `选择至多${get.cnNumber(x)}名角色`,
						prompt2: key === "sh" ? "本轮下次受到伤害后受到1点无来源伤害" : "本轮下次受到伤害后回复1点体力",
						selectTarget: [1, x],
						forced: true,
						filterTarget(card, p, target) {
							return target.isAlive();
						},
						ai(target) {
							const att = get.attitude(player, target);
							//伤害标记偏向敌人；回复标记偏向友方、尤其是已受伤者
							return key === "sh" ? -att : att + (target.getDamagedHp() > 0 ? 3 : 0);
						},
					})
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						//本轮（roundEnd）内挂上一次性标记；标记触发即自我移除，故只作用于"下次"受到伤害
						const id = "mingjinmrfz_" + key;
						target.addTempSkill(id, { global: "roundEnd" });
						target.storage[id] ??= 0;
						target.storage[id] += 1;
					}
				}
			},
		},
		//①标记：本轮下次受到伤害后受到1点无来源伤害（独立技能，仅通过 addTempSkill 挂到被选定角色身上）
		mingjinmrfz_sh: {
			charlotte: true,
			mark: true,
            marktext:"明",
			onremove: true,
			intro: {
                name:"明镜①",
				content: "·本轮下次受到伤害后受到#点无来源伤害",
			},
			trigger: {
				player: "damageEnd",
			},
			forced: true,
			async content(event, trigger, player) {
				player.removeSkill("mingjinmrfz_sh");
				await player.damage({ num: 1 }).set("noSource", true);
			},
		},
		//②标记：本轮下次受到伤害后回复1点体力
		mingjinmrfz_hf: {
			charlotte: true,
			mark: true,
            marktext:"明",
			onremove: true,
			intro: {
                name:"明镜②",
				content: "·本轮下次受到伤害后回复#点体力",
			},
			trigger: {
				player: "damageEnd",
			},
			forced: true,
			async content(event, trigger, player) {
				player.removeSkill("mingjinmrfz_hf");
				await player.recover({ num: 1 });
			},
		},
	});
};

resigter();
