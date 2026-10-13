import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const resigter = function (name = "char_4232_hbound") {
	character(name, {
		sex: "male",
		hp: 4,
		skills: ["zuoqianmrfz", "fenshenmrfz", "chujiaomrfz"],
		pack: "epicSJZX",
		group: "yimrfz",
		llm: "Qwen-3.8-Flash",
		designer: ["Flandre"],
	});

	characterTitle(name, whichWayUtil.colorize("#r捡海者#"));
	characterIntro(name, "纳乔，阿戈尔岛民，精通水文测绘及地理建模。港都打捞工程结束后，经由克莱门莎引荐加入罗德岛，作为合作干员常驻伊比利亚，协助罗德岛进行伊比利亚沿海地区的水文观测与气候监测等工作。");

	translate({
		[name]: "旅骨",

		zuoqianmrfz: "座浅",
		zuoqianmrfz_info: "出牌阶段限一次，若场上有已受伤的角色，你可摸场上已受伤角色数张牌且你因此摸的牌本轮不计入手牌上限。",
		fenshenmrfz: "奋身",
		fenshenmrfz_info: "当有角色勾玉颜色不因【奋身】而变化后，你可以<br>1.失去一半体力（向上取整），你与目标角色各摸等同于此次失去体力值张牌。<br>2.弃置一半手牌（至少1张），你视为使用一张多目标锦囊牌。<br>背水：你失去一点体力上限并摸体力上限张牌，本轮你对已受伤角色使用牌无次数限制且重置“座浅”。",
		fenshenmrfz_beishui: "背水",
		chujiaomrfz: "触礁",
		chujiaomrfz_info: "锁定技,你对已受伤角色使用牌无距离限制。",
	});

	//多目标锦囊的判断，参考 tyxunshi（get.info(card).multitarget）与引擎的 ai.tag.multitarget 标记
	const getMultitargetTricks = () => {
		const names: string[] = [];
		for (const name of lib.inpile) {
			const info = lib.card[name];
			if (!info || info.type !== "trick") {
				continue;
			}
			if (info.multitarget || info.ai?.tag?.multitarget) {
				names.push(name);
			}
		}
		return names;
	};

	let flag_banAudio: boolean = false;
	skill({
		zuoqianmrfz: {
			audio: ["作战中1", "作战中2"],
			enable: "phaseUse",
			usable: 1,
			init(player, skill) {
				game.broadcastAll(() => {
					lib.translate["zuoqianmrfz_tag"] = "invisible";
				});
			},
			onremove(player, type) {
				player.removePromptSJZX("zuoqianmrfz_tips");
			},
			filter(event, player, name, target) {
				return game.players.some(i => i.getDamagedHp() > 0);
			},
			async content(event, trigger, player) {
				const num = game.players.filter(i => i.getDamagedHp() > 0).length;
				const result = await player.draw({ num, gaintag: ["zuoqianmrfz_tag"] }).forResult();
				if (result.cards) {
					result.cards.forEach(card => card.addPromptSJZX("不计入手牌上限", "zuoqianmrfz_tips"));
					if (!player.hasSkill("zuoqianmrfz_clear")) {
						player.addTempSkill("zuoqianmrfz_clear", { global: "roundStart" });
					}
				}
			},
			subSkill: {
				clear: {
					mod: {
						ignoredHandcard(card, player) {
							if (card.hasGaintag("zuoqianmrfz_tag")) {
								return true;
							}
						},
						cardDiscardable(card, player, name) {
							if (name == "phaseDiscard" && card.hasGaintag("zuoqianmrfz_tag")) {
								return false;
							}
						},
					},
					charlotte: true,
					silent: true,
					onremove(player, type) {
						player.removeGaintag("zuoqianmrfz_tag");
						player.removePromptSJZX("zuoqianmrfz_tips");
					},
				},
			},
		},
		fenshenmrfz: {
			audio: ["作战中3", "作战中4"],
			//参考 olzhuohun：以勾玉颜色变化为触发时机
			trigger: {
				global: ["changeHpAfter", "loseMaxHpAfter", "gainMaxHpAfter"],
			},
			logTarget: "player",
			filter(event, player) {
				//参考 zishu：由【奋身】自身结算引起的颜色变化（父事件名为 fenshenmrfz）不再触发，即"不因【奋身】"
				if (event.getParent("fenshenmrfz", true)) {
					return false;
				}
				const changed = event.player;
				if (!changed || changed.removed) {
					return false;
				}
				//参考 olzhuohun：一次颜色跃迁只在"结算后定格"的那次体力变化事件上触发，避免连锁/批量变化重复发动
				const curColor = get.hpColor(changed);
				const prevColor = get.hpColor({ hp: event.originalHp, maxHp: event.originalMaxHp });
				if (curColor == prevColor) {
					return false;
				}
				const list: string[] = [];
				for (const evt of _status.globalHistory[_status.globalHistory.length - 1]["everything"]) {
					if (!["changeHp", "gainMaxHp", "loseMaxHp"].includes(evt.name)) {
						continue;
					}
					if (evt.player != changed) {
						continue;
					}
					const { originalHp, originalMaxHp, changedHp, changedMaxHp } = evt;
					const cur = get.hpColor({ hp: originalHp + changedHp, maxHp: originalMaxHp + changedMaxHp });
					const prev = get.hpColor({ hp: originalHp, maxHp: originalMaxHp });
					if (cur == prev || list.includes(cur)) {
						continue;
					}
					list.add(cur);
					if (cur == curColor && evt == event) {
						return true;
					}
				}
				return false;
			},
			//参考 mbhanyong：把"选择选项"放在 cost 中，content 只按所选执行
			async cost(event, trigger, player) {
				const tricks = getMultitargetTricks();
				const opts: string[] = [];
				if (player.hp >= 2) {
					opts.push("loseHp");
				}
				if (player.countCards("h") >= 1 && tricks.length) {
					opts.push("trick");
				}
				if (player.maxHp >= 2) {
					opts.push("beishui");
				}
				if (!opts.length) {
					return;
				}
				const label: Record<string, string> = { loseHp: "选项一", trick: "选项二", beishui: "背水" };
				const desc: Record<string, string> = {
					loseHp: `失去一半体力（向上取整），你与目标角色各摸${get.cnNumber(Math.ceil(player.hp / 2))}张牌`,
					trick: "弃置一半手牌（至少1张），你视为使用一张多目标锦囊牌",
					beishui: `背水：失去1点体力上限并摸${get.cnNumber(player.maxHp - 1)}张牌，本轮你对已受伤角色使用牌无次数限制且重置【座浅】`,
				};
				const result = await player
					.chooseControl({
						prompt: get.prompt(event.skill),
						choiceList: opts.map(key => desc[key]),
						controls: [...opts.map(key => label[key]), "cancel2"],
						choice: (() => {
							const enemies = game.filterPlayer(i => i !== player && get.attitude(player, i) < 0);
							const hurtEnemies = enemies.filter(i => i.getDamagedHp() > 0);
							const iLose = opts.indexOf("loseHp");
							const iTrick = opts.indexOf("trick");
							const iBeishui = opts.indexOf("beishui");
							if (iBeishui >= 0 && player.hp >= 2 && hurtEnemies.length >= 2) {
								return iBeishui;
							}
							if (iTrick >= 0 && enemies.length >= 2) {
								return iTrick;
							}
							if (iLose >= 0 && player.hp >= 4) {
								return iLose;
							}
							return 0;
						})(),
					})
					.forResult();
				if (typeof result.index !== "number") {
					return;
				}
				if (result.control !== "cancel2" && opts[result.index]) {
					event.result = {
						bool: true,
						cost_data: { key: opts[result.index] },
					};
				}
			},
			async content(event, trigger, player) {
				const { key } = event.cost_data;
				const target = trigger.player;
				if (key === "loseHp") {
					//失去体力会再次引发颜色变化，但已由 filter 的"不因【奋身】"判断过滤，无需额外加锁
					const num = Math.ceil(player.hp / 2);
					await player.loseHp(num);
					player.draw(num);
					if (target && target !== player && !target.removed) {
						target.draw(num);
					}
				} else if (key === "trick") {
					const tricks = getMultitargetTricks();
					const num = Math.max(1, Math.floor(player.countCards("h") / 2));
					await player
						.chooseToDiscard({
							position: "h",
							selectCard: num,
							forced: true,
							prompt: `【奋身】:弃置${get.cnNumber(num)}张手牌`,
						})
						.forResult();
					const cards = tricks.map(name => get.autoViewAs({ name }));
					const picked = await player
						.chooseFakeCardTarget({
							cards,
							tagName: "fenshenmrfz",
							selectCard: 1,
							selectTarget: -1,
							forced: true,
							prompt: "【奋身】:视为你使用一张多目标锦囊牌",
							filterTarget: (card, p, t) => !!card && p.canUse(card, t),
							ai1: card => {
								const enemies = game.filterPlayer(i => i !== player && get.attitude(player, i) < 0);
								const hurtAllies = game.filterPlayer(i => i !== player && get.attitude(player, i) > 0 && i.getDamagedHp() > 0);
								switch (card.name) {
									case "taoyuan":
										return hurtAllies.length >= enemies.length ? 5 : 0;
									case "wanjian":
									case "nanman":
										return enemies.length >= 2 ? 4 : 0;
									default:
										return 1;
								}
							},
						})
						.forResult();
					if (picked.bool && picked.links?.length && picked.targets?.length) {
						await player.useCard(picked.links[0], picked.targets, "fenshenmrfz");
					}
				} else if (key === "beishui") {
					await player.loseMaxHp(1);
					player.draw(player.maxHp);
					player.addTempSkill("fenshenmrfz_beishui", "roundEnd");
					player.refreshSkill("zuoqianmrfz");
				}
			},
			subSkill: {
				beishui: {
					mark: true,
					charlotte: true,
					intro: {
						content: "·本轮你对已受伤角色使用牌无次数限制",
					},
					mod: {
						cardUsableTarget(card, player, target, result) {
							if (target && target.getDamagedHp() > 0) {
								return true;
							}
							return result;
						},
					},
				},
			},
		},
		chujiaomrfz: {
			audio: ["选中干员1", "选中干员2"],
			forced: true,
			mod: {
				targetInRange(card, player, target, result) {
					if (target.getDamagedHp() > 0) {
						return true;
					}
					return result;
				},
			},
			trigger: {
				player: "useCard",
			},
			filter(event, player, name, target) {
				return event.targets && event.targets.some(t => t.getDamagedHp() > 0) && flag_banAudio === false;
			},
			async content(event, trigger, player) {
				flag_banAudio = true;
				//5秒内最多播放一次语音
				setTimeout(() => {
					flag_banAudio = false;
				}, 5000);
			},
		},
	});
};

resigter();
