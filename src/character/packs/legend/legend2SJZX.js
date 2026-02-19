import { lib, game, ui, get, ai, _status } from "noname";
import { skillCustomFunc } from "../../../nonameEx/custom/skill.ts";
import { whichWayTips } from "../../../tips/index.ts";

/**
 * 六星武将的第二部分
 */
const tmpSave = window.whichWaySave.tmpSave;

/** @type {WhichWayCharacterPack} */
export default {
	character: {
		yindelaiximrfz: ["female", "samrfz", 4, ["pingyimrfz", "beinuomrfz"], []],
		aibulanamrfz: ["female", "weimrfz", 4, ["yizhamrfz", "kumianmrfz"], []],
		mon3trmrfz: ["female", "luomrfz", 4, ["shulimrfz", "ronghuimrfz"], []],
		spnengtianshimrfz: ["female", "lamrfz", 3, ["youhuomrfz", "letianmrfz"], []],
		leimiuanmrfz: ["female", "lamrfz", 3, ["feiyimrfz", "mingzhengmrfz", "zhuijimrfz"], []],
		xinyangjiaobanjimrfz: ["male", "lamrfz", 4, ["daoweimrfz", "chongzhoumrfz", "shiyimrfz"], []],
		jiushenmrfz: ["male", "weimrfz", "1/3", ["xinyunmrfz", "zongyinmrfz", "zhanwangmrfz"], []],
		spjingzhemrfz: ["female", "yanmrfz", 4, ["xiuyuanmrfz", "zhengningmrfz"], []],
		dianhumrfz: ["female", "luomrfz", 4, ["gandianmrfz"], []],
		ziyeyaomrfz: {
			sex: "female",
			group: "dongmrfz",
			hp: 3,
			skills: ["youlinmrfz", "miaomengmrfz", "fuyingmrfz"],
		},
		spxingxiongmrfz: {
			sex: "female",
			group: "yanmrfz",
			hp: 3,
			maxHp: 4,
			skills: ["wozhimrfz", "guishimrfz", "zhanyemrfz"],
		},
		cuoemrfz: {
			sex: "female",
			group: "dongmrfz",
			hp: 4,
			skills: ["huanyoumrfz", "wenxinmrfz"],
		},
		fengchuanxiangzimrfz: {
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["songyuemrfz", "yuxiangmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		},
		yeyingmrfz: {
			sex: "female",
			hp: 3,
			group: "shimrfz",
			skills: ["guqiumrfz", "newpolongmrfz"],
		},
		tifengmrfz: {
			sex: "female",
			hp: 4,
			group: "samrfz",
			skills: ["lieqiongmrfz", "tifengmrfz_lieshimrfz"],
		},
	},
	skill: {
		//新提丰
		lieqiongmrfz: {
			audio: "ruiyamrfz",
			derivation: ["wangong", "xinliegong"],
			trigger: {
				player: "useCard",
			},
			forced: true,
			firstDo: true,
			filter(event, player) {
				return event.card && get.name(event.card) === "sha" && event.card.cards && event.card.cards.some(card => ["red", "black"].includes(get.color(card) || ""));
			},
			async content(event, trigger, player) {
				let color = ["red", "black"];
				//@ts-ignore
				trigger.card.cards.forEach(card => {
					let colorx = get.color(card) || "";
					if (color.includes(colorx)) {
						color.remove(colorx);
						switch (colorx) {
							case "red":
								player.addSkill("wangong2");
								break;
							case "black":
								player
									.when({
										player: "useCardAfter",
										global: "roundStart",
									})
									.filter((event, player) => {
										if (event.name === "phase") return true;
										return event.card.cardid === trigger.card.cardid;
									})
									.step(async (event, trigger, player) => {
										if (trigger.name === "phase") return;
										player.removeSkill("lieqiongmrfz_enchanting_liegong");
									});
								player.storage.lieqiongmrfz_enchanting_liegong = trigger.card.cardid;
								player.addSkill("lieqiongmrfz_enchanting_liegong");
								break;
						}
					}
				});
			},
			subSkill: {
				enchanting_liegong: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "useCardToTargeted",
					},
					onremove: true,
					filter(event, player) {
						return event.card.cardid === player.storage.lieqiongmrfz_enchanting_liegong;
					},
					async content(event, trigger, player) {
						//@ts-ignore
						lib.skill.xinliegong.content(event, trigger, player);
					},
				},
			},
		},
		tifengmrfz_lieshimrfz: {
			audio: "shouliemrfz",
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return player.countCards("h") > 0 && player.hasUseTarget({ name: "sha", nature: "stab" }, false, false);
			},
			filterTarget(card, player, target) {
				const judge = () => player.canUse({ name: "sha", nature: "stab" }, target, false, false) && target !== player;

				if (judge()) whichWayTips.addPrompt(target, `摸${get.distance(player, target)}张牌`, "tifengmrfz_lieshimrfz", "uncheckBegin");
				else whichWayTips.addPrompt(target, `不是合法目标`, "tifengmrfz_lieshimrfz", "uncheckBegin");
				return !!judge();
			},
			selectCard: () => {
				let player = get.player();
				return Math.max(1, Math.floor(player.countCards("h") / 2));
			},
			filterCard: () => true,
			prompt: "你可以将一半的手牌（向下取整，至少为1）当作一张无距离和次数限制的刺【杀】对一名其他角色使用，然后你摸X张牌。（X=目标角色与你的距离）",
			discard: false,
			lose: false,
			delay: false,
			check(card) {
				let num = 8 - get.value(card);
				if (!ui.selected.cards.map(i => get.color(i)).includes(get.color(card))) num += 2;
				return num;
			},
			async content(event, trigger, player) {
				const { cards, targets } = event;
				await player
					.chooseUseTarget({ name: "sha", nature: "stab" }, cards)
					.set("forced", true)
					//@ts-ignore
					.set("filterTarget", (card, player, target) => target === get.event().targetx)
					.set("targetx", event.target)
					.set("nodistance", true)
					.set("addCount", false)
					.forResult();
				if (!cards || !targets) return;
				let target = targets[0];
				if (get.distance(player, target) > 0) player.draw(get.distance(player, target));
			},
			ai: {
				order: 3,
				result: {
					player: function (player, target) {
						if (get.attitude2(target) > 0) return -1;
						return get.distance(player, target) + Math.min(2, target.getDamagedHp());
					},
				},
			},
		},
		//新夜莺
		guqiumrfz: {
			mod: {
				cardnumber(card, player, num) {
					if (card.hasGaintag("guqiumrfz_number")) return (num += 3);
				},
			},
			derivation: ["shanzhuan"],
			audio: "qiulongmrfz",
			trigger: {
				global: "roundStart",
			},
			init() {
				lib.translate["guqiumrfz_number"] = `点数+3`;
			},
			forced: true,
			filter(event, player) {
				return game.hasPlayer(char => char !== player && char.inRange(player));
			},
			async content(event, trigger, player) {
				for (let char of game.players) {
					if (char === player || !char.inRange(player)) continue;
					let next = game.createEvent("guqiumrfz_shanzhuan");
					next.player = char;
					//@ts-ignore
					next._trigger = {
						player: player,
					};
					//@ts-ignore
					await next.setContent(lib.skill.shanzhuan.content);
				}
				//@ts-ignore
				player.drawTo(5).set("gaintag", ["guqiumrfz_number"]);
			},
			group: "guqiumrfz_compare",
			subSkill: {
				compare: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "compare",
						target: "compare",
					},
					filter(event, player) {
						//@ts-ignore
						if (event.iwhile && event.player === player) {
							return false;
						}
						return (
							//@ts-ignore
							player.getHistory("lose", evt => {
								let cardid = event[event.player === player ? "card1" : "card2"].cardid;
								//@ts-ignore
								if (evt.gaintag_map && Object.keys(evt.gaintag_map).includes(cardid) && evt.gaintag_map[cardid].includes("guqiumrfz_number")) return true;
							}).length > 0
						);
					},
					async content(event, trigger, player) {
						game.log(player, `的拼点牌点数+3`);
						trigger[trigger.player === player ? "num1" : "num2"] += 3;
					},
				},
			},
			ai: {
				combo: "newpolongmrfz",
			},
		},
		newpolongmrfz: {
			mod: {
				cardUsable: function (card, player, num) {
					//@ts-ignore
					if (typeof num === "number" && card?.cards?.some(cardx => cardx.hasGaintag("newpolongmrfz"))) return Infinity;
				},
				targetInRange: function (card, player, target, now) {
					//@ts-ignore
					if (card?.cards?.some(cardx => cardx.hasGaintag("newpolongmrfz"))) return true;
				},
			},
			audio: "polongmrfz",
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return game.countPlayer(char => char.countCards("h") > 0) > 1;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("newpolongmrfz"))
					.set("prompt2", `你可以令一名角色A与角色B(角色B不能为你)拼点，若角色A赢，你将判定区的牌翻面，然后摸2X张牌，且你因此获得的牌本回合无距离次数限制。（X=你因此翻面的牌数）`)
					.set("targetprompt", ["角色A", "角色B"])
					.set("filterTarget", (card, player, target) => {
						if (target.countCards("h") < 1) return false;
						let targets = ui.selected.targets;
						return targets.length < 1 || (targets[0].canCompare(target) && target !== player);
					})
					.set("ai", target => {
						let targets = ui.selected.targets;
						let player = get.player();
						if (player.countCards("j", card => get.type(card) === "delay") < 1) {
							return get.attitude2(target) < 0;
						} else if (targets.length < 1) {
							//@ts-ignore
							if (player.countCards("h", card => get.number(card) > 7) > 0) return target === player ? 114514 : -1;
							return get.attitude2(target) < 0 || (get.attitude2(target) > 0 && target.countCards("h") > 3);
						} else {
							return get.attitude2(target) < 0;
						}
					})
					.set("complexTarget", true)
					.set("selectTarget", 2)
					.forResult();
			},
			async content(event, trigger, player) {
				const [targetA, targetB] = event.targets;
				const result = await targetA.chooseToCompare(targetB).forResult();
				if (result.winner === targetA) {
					const cards = player.getCards("j").filter(card => get.type(card) === "delay");
					game.cardsGotoOrdering(cards);
					const links = cards
						.map(card => {
							//@ts-ignore
							return card.viewAs ? card.cards : get.autoViewAs(card);
						})
						.flat();
					console.log(links);
					links.forEach(card => {
						if (get.type(card, null, false) !== "delay") {
							card.fix();
							//@ts-ignore
							player.addJudge({ name: "xumou_jsrg" }, [card]);
						} else {
							//@ts-ignore
							player.addJudge({ name: "xumou_jsrg" }, card.cards);
						}
					});
					player.draw(links.length * 2).set("gaintag", ["newpolongmrfz"]);
				}
			},
			group: "newpolongmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeGaintag("newpolongmrfz", player.getCards("h"));
					},
				},
			},
		},

		//丰川祥子
		songyuemrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			frequent: true,
			async content(event, trigger, player) {
				for (let t of [1, 2, 3]) {
					const { color } = await player.judge().forResult();
					if (player.countCards("h") < 1) continue;
					const { cards } = await player
						.chooseCard("h", true)
						.set("prompt", `你可以重铸一张手牌，若重铸的牌与判定牌颜色(${get.translation(color)})一致，你摸${lib.skill.wuweimrfz.getNum(player, event.name)}张牌。`)
						.set("ai", card => {
							//@ts-ignore
							let { player, color, num } = get.event();
							return (get.color(card) === color ? 8 : 6) - get.value(card);
						})
						.set("color", color)
						.set("num", lib.skill.wuweimrfz.getNum(player, event.name))
						.forResult();
					if (!cards) return;
					let card = cards[0];
					player.recast(card);
					if (!card || lib.skill.wuweimrfz.getNum(player, event.name) < 1) continue;
					if (get.color(card) === color) player.draw(lib.skill.wuweimrfz.getNum(player, event.name));
				}
			},
		},

		yuxiangmrfz: {
			audio: 2,
			trigger: {
				global: "phaseEnd",
			},
			filter(event, player) {
				let centralArea = get.discarded();
				return (
					centralArea.filter(card => {
						return (
							game.getGlobalHistory("changeHp", evt => {
								let evtx = evt.getParent();
								//@ts-ignore
								if (evtx.name === "damage" && evtx.num > 0) return evtx.cards?.includes(card);
							}).length > 0
						);
					}).length > 0
				);
			},
			async cost(event, trigger, player) {
				let centralArea = get.discarded().filter(card => {
					return (
						game.getGlobalHistory("changeHp", evt => {
							let evtx = evt.getParent();
							//@ts-ignore
							if (evtx.name === "damage" && evtx.num > 0) return evtx.cards?.includes(card);
						}).length > 0
					);
				});

				const result = await player
					.chooseButton()
					.set("createDialog", [get.prompt(event.skill) + `选择你要${get.poptip("sjzx_byRecast")}使用的牌`, centralArea])
					.set("ai", button => {
						let player = get.player();
						return player.getUseValue(button);
					})
					.set("filterButton", button => {
						let player = get.player();
						return player.hasUseTarget(button);
					})
					.forResult();
				event.result = {
					...result,
					cost_data: {
						cards: result?.links,
					},
				};
			},
			async content(event, trigger, player) {
				let [card] = event.cost_data.cards;
				player.recast(card);
				player.chooseUseTarget(card, true);
			},
		},

		wuweimrfz: {
			audioname: ["ruoyemumrfz", "youtiansiruomaimrfz", "sanjiaochuhuamrfz", "bafanhailingmrfz"],
			audio: 2,
			init(player, skill) {
				player.storage[skill] = {};

				//添加动态翻译
				game.broadcastAll(skills => {
					skills.forEach(skill => {
						let info = get.skillInfoTranslation(skill);
						lib.dynamicTranslate[skill] = function (player) {
							if (!player.storage.wuweimrfz || lib.skill.wuweimrfz.getNum(player, skill) < 1) return info;
							return info + `（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`;
						};
					});

					lib.dynamicTranslate["wuweimrfz"] = function (player) {
						let info = get.skillInfoTranslation("wuweimrfz");
						if (!player.storage.wuweimrfz) return info;
						for (let skill of skills) {
							if (lib.skill.wuweimrfz.getNum(player, skill) > 0) return info.replace(`（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`, "");
						}
						return info;
					};
				}, lib.skill.wuweimrfz.validSkills);
			},
			clanSkill: true,
			getNum(receiver, skill) {
				for (let player of game.players) {
					let storage = player.storage.wuweimrfz;
					if (!storage) continue;
					for (let id in storage) {
						let info = storage[id];
						if (info.receiver.playerid !== receiver.playerid) continue;
						if (info.skill === skill) {
							let num = 0;
							//重铸
							if (receiver.getRoundHistory("lose", evt => evt.getParent(2).name === "recast").length > 0) num++;
							//使用
							if (receiver.getRoundHistory("useCard").length > 0) num++;
							//打出
							if (receiver.getRoundHistory("respond").length > 0) num++;
							//弃置
							if (receiver.getRoundHistory("lose", evt => evt.type === "discard").length > 0) num++;
							return num;
						}
					}
				}
				return 0;
			},
			trigger: {
				player: "recastAfter",
			},
			validSkills: ["songyuemrfz", "yuxiangmrfz", "lingwomrfz", "pojianmrfz", "leigumrfz", "jiaoyingmrfz", "weimianmrfz", "weiquanmrfz", "chendiemrfz", "umiri_chenxianmrfz"],
			filter(event, player) {
				return Object.keys(player.storage.wuweimrfz).length < 1;
			},
			async cost(event, trigger, player) {
				const { targets } = await player
					.chooseTarget()
					.set("prompt2", `你可以将本技能句号之后的描述移至同族武将的武将牌上任意一个技能直到本轮结束`)
					.set("prompt", `【毋畏】:请选择一名${get.poptip("sjzx_AveMujica")}角色`)
					.set("filterTarget", (card, player, target) => {
						let flag = false;
						let skills = target.getOriginalSkills().filter(skill => lib.skill.wuweimrfz.validSkills.includes(skill));
						for (let skill of skills) {
							if (lib.skill.wuweimrfz.getNum(target, skill) < 1) {
								flag = true;
								break;
							}
						}
						return flag && target.getClans(true).includes("AveMujica");
					})
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
				if (!targets) return;
				let target = targets[0];
				if (!target) {
					event.result = {
						bool: false,
					};
					return;
				}

				let skills = target.getOriginalSkills().filter(skill => lib.skill.wuweimrfz.validSkills.includes(skill));
				if (skills.length < 1) {
					event.result = {
						bool: false,
					};
					return;
				}
				const result = await player
					.chooseControl(skills.concat("cancel2"))
					.set("prompt", `为一个技能添加下列描述直到本轮结束：“（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）”`)
					.set("ai", () => {
						//@ts-ignore
						return get.event().skills.randomGet();
					})
					.set("skills", skills)
					.forResult();
				event.result = {
					...result,
					cost_data: result,
				};
			},
			async content(event, trigger, player) {
				let skill = event.cost_data.control;
				if (!player.storage.wuweimrfz) player.storage.wuweimrfz = {};
				if (player.playerid) {
					player.storage.wuweimrfz[player.playerid] = {
						skill: skill,
						receiver: player,
					};
					player.when({ global: "roundStart" }).then(() => {
						if (player.playerid) delete player.storage.wuweimrfz[player.playerid];
					});
				}
			},
		},

		//新嵯峨
		//默认技能组
		huanyoumrfz: {
			audio: "chuemrfz",
			forced: true,
			trigger: {
				player: "gainAfter",
			},
			filter(event, player) {
				return !player.isPhaseUsing() && event.cards.length > 0 && event.getParent().name !== "huanyoumrfz";
			},
			async content(event, trigger, player) {
				player.gain(lib.card.ying.getYing(trigger.cards.length), "gain2");
			},
			group: ["huanyoumrfz_hideHandCards"],
			subSkill: {
				hideHandCards: {
					audio: "huanyoumrfz",
					forced: true,
					trigger: { player: "phaseUseBegin" },
					async content(event, trigger, player) {
						let handcard = player.node.handcards1.parentElement;
						player.node.washTip = ui.create.div(handcard, ".washTip");
						player.node.washTip.innerHTML = "洗牌中...";

						let hs = [];
						let origin = player.getCards("h");
						for (let i = 0; i < player.getCards("h").length; i++) {
							let r = origin.randomGet();
							hs.push(r);
							origin.remove(r);
						}
						game.broadcastAll(
							function (hs, player) {
								//@ts-ignore
								hs.forEach(i => i.goto(ui.special));
								//@ts-ignore
								player.directgain(hs, false);
							},
							hs,
							//@ts-ignore
							player
						);
						player.addTempSkill("huanyoumrfz_hideHandCards_eff", { player: "phaseEnd" });
					},
				},
				hideHandCards_eff: {
					mod: {
						cardname(card, player, name) {
							if (card.storage.huanyoumrfz) {
								return "cuoe_huanyoumrfzCard";
							}
						},
					},
					charlotte: true,
					silent: true,
					init(player) {
						//@ts-ignore
						if (!player.node.handcards1.cardMod) {
							//@ts-ignore
							player.node.handcards1.cardMod = {};
						}
						//@ts-ignore
						if (!player.node.handcards2.cardMod) {
							//@ts-ignore
							player.node.handcards2.cardMod = {};
						}
						var cardMod = function (card) {
							return ["幻有", "手牌对你不可见"];
						};
						//@ts-ignore
						player.node.handcards1.cardMod.huanyoumrfz = cardMod;
						//@ts-ignore
						player.node.handcards2.cardMod.huanyoumrfz = cardMod;
						player.node.handcards1.classList.add("huanyoumrfz");
						player.node.handcards2.classList.add("huanyoumrfz");

						player.getCards("h").forEach(i => {
							i.storage.huanyoumrfz = true;
							i.dataset.skilltag = "huanyoumrfz";
						});

						setTimeout(() => {
							player.node.washTip.remove();
							delete player.node.washTip;
						}, 1000);
					},
					onremove(player) {
						player.node.handcards1.classList.remove("huanyoumrfz");
						player.node.handcards2.classList.remove("huanyoumrfz");
						//@ts-ignore
						delete player.node.handcards1.cardMod.huanyoumrfz;
						//@ts-ignore
						delete player.node.handcards2.cardMod.huanyoumrfz;
						player.getCards("h").forEach(i => {
							if (i.storage.huanyoumrfz) {
								delete i.storage.huanyoumrfz;
								delete i.dataset.skilltag;
							}
						});
					},
					trigger: {
						player: "useCardAfter",
					},
					filter(event, player) {
						//@ts-ignore
						return event.card.storage?.huanyoumrfz && event.cards.length === 1 && !event.card.failToUse && !event.getParent().noTriggerHuanyoumrfz;
					},
					async content(event, trigger, player) {
						trigger.cards.forEach(card => {
							if (card.storage.huanyoumrfz) player.draw();
						});
					},
				},
			},
			ai: {
				neg: true,
			},
		},
		wenxinmrfz: {
			audio: 3,
			derivation: "zhishuimrfz",
			group: ["wenxinmrfz_achieve", "wenxinmrfz_turnOver", "wenxinmrfz_fail"],
			subSkill: {
				achieve: {
					audio: true,
					logAudio() {
						return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 1);
					},
					forced: true,
					skillAnimation: true,
					animationColor: "metal",
					lastDo: true,
					trigger: {
						player: "phaseEnd",
					},
					filter(event, player) {
						let useList = player
							.getHistory("useCard", evt => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz)
							.map(evt => {
								//@ts-ignore
								return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
							});

						let count = 0;
						for (let name of useList) {
							if (name === "ying") {
								count = 0;
								continue;
							}
							count++;
							if (count >= 3) return true;
						}

						return false;
					},
					async content(event, trigger, player) {
						game.log(player, "成功完成使命");
						player.awakenSkill("wenxinmrfz");
						player.addSkills(["zhishuimrfz"]);
						player.loseMaxHp();
					},
				},
				turnOver: {
					audio: true,
					logAudio() {
						return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 3);
					},
					trigger: {
						player: "useCardAfter",
					},
					lastDo: true,
					filter(event, player) {
						//@ts-ignore
						return player.countCards("h", card => card.storage.huanyoumrfz) > 0 && event.card.storage?.huanyoumrfz && event.cards.length === 1 && !event.getParent().noTriggerHuanyoumrfz;
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseCard("h")
							.set("prompt", get.prompt("wenxinmrfz"))
							.set("prompt2", `你可以令一张背面朝上的手牌正面朝上`)
							.set("filterCard", card => card.storage.huanyoumrfz)
							.set("ai", () => Math.random())
							.forResult();
					},
					async content(event, trigger, player) {
						let card = event.cards[0];
						delete card.storage.huanyoumrfz;
						delete card.dataset.skilltag;
					},
				},
				fail: {
					audio: true,
					logAudio() {
						return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 2);
					},
					forced: true,
					trigger: {
						player: "phaseEnd",
					},
					firstDo: true,
					filter(event, player) {
						let useList = player
							.getHistory("useCard", evt => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz)
							.map(evt => {
								//@ts-ignore
								return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
							});
						//@ts-ignore
						return (useList.length === 0 || (useList[0] === "ying" && new Set(useList).size === 1)) && !player.getHistory("skipped").includes("phaseUse");
					},
					async content(event, trigger, player) {
						game.log(player, "使命失败");
						player.awakenSkill("wenxinmrfz");
						player.addSkill(["wenxinmrfz_fail_buff"]);
						player.markSkill("wenxinmrfz_fail_buff");
					},
				},
				fail_buff: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "phaseDrawBegin",
					},
					intro: {
						content: "·每个摸牌阶段开始时获得一张【影】<br>·如真似幻，扑朔迷离。",
					},
					async content(event, trigger, player) {
						player.gain(lib.card.ying.getYing(1), "gain2");
					},
				},
			},
		},
		zhishuimrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCardBegin",
			},
			filter(event, player) {
				return event.card.storage?.huanyoumrfz && !event.card.storage?.zhishuimrfz && event.card.cards.length === 1 && !player.hasUseTarget(event.card.cards[0].name);
			},
			async content(event, trigger, player) {
				await player.useCard(
					{
						name: "dongzhuxianji",
						suit: trigger.card.suit,
						number: trigger.card.number,
						nature: trigger.card.nature,
						storage: {
							...trigger.card.storage,
							zhishuimrfz: true,
						},
						isCard: true,
					},
					trigger.cards,
					player
				);
				trigger.cancel();
			},
		},
		//模组：何处寻驼？
		qianxianmrfz: {
			audio: "chuemrfz",
			trigger: {
				player: "useCardToPlayered",
				target: "useCardToTargeted",
			},
			forced: true,
			init(player, skill) {
				player.storage[skill] = [];
			},
			filter(event, player) {
				if (!["trick", "basic"].includes(get.type(event.card))) return false;
				return player === event.target || event.getParent().triggeredTargets3.length === 1;
			},
			mark: true,
			intro: {
				content(storage) {
					return `记录的牌名：${get.translation(storage)}`;
				},
			},
			onremove: true,
			async content(event, trigger, player) {
				if (player.storage.qianxianmrfz.includes(trigger.card.name)) {
					player.storage.qianxianmrfz.remove(trigger.card.name);
					player.draw();
				} else {
					player.storage.qianxianmrfz.push(trigger.card.name);
					//@ts-ignore
					trigger.getParent()?.excluded.add(...trigger.targets);
					trigger.player.draw(2);
				}
			},
			ai: {
				threaten: 2,
			},
		},
		ziwumrfz: {
			audio: "wenxinmrfz",
			derivation: "dunkongmrfz",
			forced: true,
			juexingji: true,
			skillAnimation: true,
			animationColor: "thunder",
			unique: true,
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return player.storage.qianxianmrfz?.length >= 5;
			},
			async content(event, trigger, player) {
				player.awakenSkill(event.name);
				player.recoverTo(3);
				await player.draw(player.storage.qianxianmrfz.length);
				player.storage.qianxianmrfz = [];
				player.addSkill("dunkongmrfz");
			},
			ai: {
				combo: "qianxianmrfz",
			},
		},
		dunkongmrfz: {
			audio: "zhishuimrfz",
			enable: "phaseUse",
			usable: 1,
			onremove(player, skill) {
				player.enableSkill(skill);
			},
			intro: {
				content(_, player) {
					let num = Math.min(5, player.storage.qianxianmrfz.length);
					return `·使用【杀】的次数+${num}<br>·手牌上限+${num}<br>·计算与其他角色的距离-${num}`;
				},
			},
			async content(event, trigger, player) {
				let numx = Math.min(5, player.storage.qianxianmrfz.length);
				player.draw(numx);
				player.disableSkill("dunkongmrfz", "qianxianmrfz");
				player.markSkill("dunkongmrfz");
				player
					.when("phaseEnd")
					.then(() => {
						player.enableSkill("dunkongmrfz");
						player.unmarkSkill("dunkongmrfz");
						if (player.storage.qianxianmrfz?.length > 0) {
							player.storage.qianxianmrfz.remove(player.storage.qianxianmrfz.randomGet());
						}
					})
					.assign({
						mod: {
							maxHandcard(player, num) {
								return num + numx;
							},
							cardUsable(card, player, num) {
								if (card.name === "sha") return num + numx;
							},
							globalFrom(from, to, distance) {
								return distance - numx;
							},
						},
					});
			},
			ai: {
				order: 13,
				result: {
					player(player) {
						return player.storage.qianxianmrfz.length > 1;
					},
				},
			},
		},

		//斩业星熊
		/** @type { Skill } */
		wozhimrfz: {
			audio: 2,
			trigger: {
				player: ["changeHp"],
			},
			forced: true,
			locked: true,
			mod: {
				maxHandcardBase(player, num) {
					return player.storage.zhanyemrfz ? player.maxHp : num;
				},
			},
			init(player) {
				//@ts-ignore设置getter和setter来更新hp显示
				player._hp = player.hp;
				//@ts-ignore
				player._maxHp = player.maxHp;
				let isUpdateHp = false;
				let isUpdateMaxHp = false;
				skillCustomFunc.defineAccessor(
					player,
					["hp", "maxHp"],
					//@ts-ignore
					[() => player._hp, () => player._maxHp],
					[
						value => {
							//@ts-ignore
							player._hp = value;
							if (!isUpdateHp) {
								isUpdateHp = true;
								lib.skill.wozhimrfz.updateHp(player);
								isUpdateHp = false;
							}
						},
						value => {
							//@ts-ignore
							player._maxHp = value;
							if (!isUpdateMaxHp) {
								isUpdateMaxHp = true;
								lib.skill.wozhimrfz.updateHp(player);
								isUpdateMaxHp = false;
							}
						},
					]
				);
			},
			intro: {
				content(storage, player) {
					let str = [];
					if (player.storage.zhanyemrfz) str.push("我执已修改");
					if (typeof storage !== "number" || storage === 0) str.push("体力值目前十分健康！");
					else str.push(`额外体力：${player.maxHp - storage}/${player.maxHp}`);
					return str.map(s => "·" + s).join("<br>");
				},
			},
			onremove(player, skill) {
				if (player.hp <= 0 && player.countMark("wozhimrfz") > 0) {
					//@ts-ignore
					player.die({});
					delete player.storage[skill];
				}
				lib.skill.wozhimrfz.updateHp(player);
			},
			updateHp(player) {
				let num = player.countMark("wozhimrfz");

				const hp = player.querySelector(".hp");
				let clone = player.querySelector(".hpClone") || tmpSave.spxingxiong_clone;
				const cloneMaxhp = clone?.children?.length;

				if (cloneMaxhp !== player.maxHp && clone) {
					clone.remove();
					delete tmpSave.spxingxiong_clone;
					lib.skill.wozhimrfz.updateHp(player);
					return;
				}

				if (player.hp <= 0) {
					if (!clone) {
						const parent = hp.parentNode;
						const hpClone = ui.create.div(".hp hpClone", parent);
						hpClone.style.zIndex = "114514";
						hpClone.dataset.condition = "low";

						for (let i = 0; i < player.maxHp; i++) {
							ui.create.div(hpClone);
						}

						clone = hpClone;

						tmpSave.spxingxiong_clone = clone;
					}
					hp.style.display = "none";
					let hps = Array.from(clone.childNodes);
					if (!hps) return;
					for (let i = 0; i < hps.length; i++) {
						if (i < num) hps[i].classList.remove("lost");
						else hps[i].classList.add("lost");
					}
				} else {
					hp.style.display = "";
					if (clone !== void 0) {
						clone.remove();
						delete tmpSave.spxingxiong_clone;
					}
					player.update();
				}
			},
			filter(event, player) {
				return player.hp <= 0 && event.num < 0;
			},
			async content(event, trigger, player) {
				const evt = trigger;
				const num = -evt.num - Math.max(player.hp - evt.num, 1) + 1;
				if (num > 0) player.addMark("wozhimrfz", num);

				if (player.countMark("wozhimrfz") < player.maxHp) {
					/** @type { GameEvent } */
					//@ts-ignore
					let evt2 = evt.getParent();
					let max = 3;
					while (max--) {
						if (evt2.name === "damage" || evt2.name === "loseHp") {
							//@ts-ignore
							evt2.nodying = true;
							break;
						}
					}
				}

				lib.skill.wozhimrfz.updateHp(player);
			},
			group: ["wozhimrfz_recover", "wozhimrfz_change"],
			subSkill: {
				change: {
					audio: "wozhimrfz",
					trigger: {
						player: "phaseAfter",
					},
					forced: true,
					filter(event, player) {
						return player.hp < 1 && player.storage.zhanyemrfz;
					},
					async content(event, trigger, player) {
						player.recover();
					},
				},
				recover: {
					trigger: {
						player: "recoverAfter",
					},
					filter(event, player) {
						return player.countMark("wozhimrfz") > 0 && event.num > 0;
					},
					forced: true,
					popup: false,
					async content(event, trigger, player) {
						await player.removeMark("wozhimrfz", trigger.num);

						if (player.countMark("wozhimrfz") < player.maxHp) {
							if (player.isDying()) {
								const histories = [event];
								let evt = event;
								while (true) {
									//@ts-ignore
									evt = event.getParent("dying");
									if (!evt || evt.name !== "dying" || histories.includes(evt)) {
										break;
									}
									histories.push(evt);
									if (evt.player === player) {
										//@ts-ignore
										evt.nodying = true;
									}
								}
							}
						}

						lib.skill.wozhimrfz.updateHp(player);
					},
				},
			},
			ai: {
				mingzhi: true,
				effect: {
					target(card, player, target) {
						if (get.tag(card, "damage") || get.tag(card, "losehp")) {
							let num = target.countMark("wozhimrfz") || target.getHp();
							return (num + 1) / 3;
						}
					},
				},
			},
		},
		guishimrfz: {
			audio: 2,
			locked(skill, player) {
				if (!player || !player.storage.zhanyemrfz) {
					return true;
				}
				return false;
			},
			trigger: {
				player: "phaseUseBegin",
			},
			async cost(event, trigger, player) {
				if (!player.storage.zhanyemrfz) {
					event.result = {
						bool: true,
					};
					return;
				}
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("guishimrfz"))
					.set("prompt2", `你可以失去一点体力，然后令一名角色摸${get.cnNumber(Math.min(player.getDamagedHp(), 5))}张牌，若该角色不为你，你可以在结束阶段再次发动【鬼势】`)
					.set("ai", target => {
						let player = get.player();
						let num = Math.max(player.hp, 0);
						if (player.hasSkill("wozhimrfz")) {
							num += player.maxHp - player.countMark("wozhimrfz");
						}
						return get.attitude2(target) > 0 && num >= 2;
					})
					.set("animate", false)
					.forResult();
			},
			async content(event, trigger, player) {
				if (!player.storage.zhanyemrfz) {
					await player.loseHp();
					player.draw(player.getDamagedHp());
				} else {
					let target = event.targets[0];
					await player.loseHp();
					target.draw(Math.min(5, player.getDamagedHp()));
					if (player !== target) {
						player.line(target);
						player
							.when({
								player: ["phaseJieshuBegin", "phaseEnd"],
							})
							.step(async (event, trigger, player) => {
								if (trigger.name === "phase") return;
								const { targets } = await player
									.chooseTarget()
									.set("prompt", get.prompt("guishimrfz"))
									.set("prompt2", `你可以失去一点体力，然后令一名角色摸${get.cnNumber(Math.min(4, player.getDamagedHp()))}张牌`)
									.set("ai", target => {
										let player = get.player();
										let num = Math.max(player.hp, 0);
										if (player.hasSkill("wozhimrfz")) {
											num += player.maxHp - player.countMark("wozhimrfz");
										}
										return get.attitude2(target) > 0 && num >= 2;
									})
									.set("animate", false)
									.forResult();
								if (!targets) return;
								await player.loseHp();
								targets[0].draw(Math.min(4, player.getDamagedHp()));
								player.line(targets[0]);
							});
					}
				}
			},
		},
		zhanyemrfz: {
			audio: 4,
			derivation: ["wozhimrfz_rewrite", "guishimrfz_rewrite"],
			dutySkill:true,
			group: ["zhanyemrfz_revenge", "zhanyemrfz_achieve", "zhanyemrfz_fail"],
			subSkill: {
				revenge: {
					audio: true,
					logAudio() {
						let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
						path = path.replace(path.slice(-2), "");
						return [1, 2].map(i => path + `/zhanyemrfz${i}.mp3`);
					},
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					onremove: true,
					mod: {
						targetInRange(card, player, target) {
							if (player.getStorage("zhanyemrfz_revenge").includes(target)) {
								return true;
							}
						},
						cardUsableTarget(card, player, target) {
							if (player.getStorage("zhanyemrfz_revenge").includes(target)) {
								return true;
							}
						},
					},
					intro: {
						mark(dialog, content, player) {
							let targets = player.storage.zhanyemrfz_revenge;
							if (targets) {
								targets.forEach(target => {
									dialog.addSmall([target]);
									dialog.addText(`<font color="red">向${get.translation(target)}复仇！</font>`);
								});
							} else {
								dialog.addText("无“业”角色");
							}
						},
					},
					locked: true,
					filter(event, player) {
						return game.hasPlayer(current => current !== player) && (event.name !== "phase" || game.phaseNumber === 0);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget()
							.set("filterTarget", lib.filter.notMe)
							.set("prompt", "游戏开始时，你令一名其他角色获得“业”标记，你对有“业”标记的角色使用牌无次数和距离限制。")
							.set("forced", true)
							.set("ai", function (target) {
								let att = get.attitude(_status.event.player, target);
								if (att > 0) {
									return -att - 1;
								}
								if (att === 0) {
									return Math.random();
								}
								return -att;
							})
							.set("animate", false)
							.forResult();
					},
					async content(event, trigger, player) {
						let targets = event.targets;
						if (!player.storage.zhanyemrfz_revenge) player.storage.zhanyemrfz_revenge = [];
						player.storage.zhanyemrfz_revenge.add(...targets);
						player.line(targets);
						player.markSkill("zhanyemrfz_revenge");
					},
				},
				fail: {
					audio: true,
					logAudio() {
						let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
						path = path.replace(path.slice(-2), "");
						return path + `/zhanyemrfz3.mp3`;
					},
					forced: true,
					trigger: {
						global: "dieAfter",
					},
					async content(event, trigger, player) {
						game.log(player, "使命失败");
						player.awakenSkill("zhanyemrfz");
						player.unmarkSkill("zhanyemrfz_revenge");

						let copy = game.players.filter(c => c !== player);
						for (let i = 0; i < 5; i++) {
							let targets = game.filterPlayer(c => isMinHp(c, copy) && c !== player);
							await player
								.chooseUseTarget({ name: "sha", isCard: true })
								.set("filterTarget", (card, player, target) => {
									return targets.includes(target);
								})
								.set("forced", true)
								.set("nodistance", true)
								.set("addCount", false);
						}
						player.loseMaxHp(2);

						function isMinHp(player, players, only, raw) {
							return players.every(value => {
								if (value.isOut() || value == player) {
									return true;
								}
								return only ? value.getHp(raw) > player.getHp(raw) : value.getHp(raw) >= player.getHp(raw);
							});
						}
					},
				},
				achieve: {
					audio: true,
					logAudio() {
						let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
						path = path.replace(path.slice(-2), "");
						return path + `/zhanyemrfz4.mp3`;
					},
					forced: true,
					skillAnimation: true,
					animationColor: "metal",
					trigger: {
						source: "damageEnd",
					},
					filter(event, player) {
						return player.getStorage("zhanyemrfz_revenge").includes(event.player) && event.player.isAlive() && event.player.hp === 1;
					},
					async content(event, trigger, player) {
						game.log(player, "成功完成使命");
						player.awakenSkill("zhanyemrfz");
						player.unmarkSkill("zhanyemrfz_revenge");
						player.storage.zhanyemrfz = true;
					},
				},
			},
		},

		//遥 羽生萌萌香 紫野遥
		youlinmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable(skill, player) {
				return player.hasSkill("youlinmrfz_addCount") ? 2 : 1;
			},
			filterCard: true,
			selectCard: [0, 3],
			filterTarget: true,
			selectTarget: [1, 3],
			discard: false,
			lose: false,
			delay: 0,
			multitarget: true,
			multiline: true,
			check(card) {
				if (ui.selected.cards.length < 1) return true;
				let num = 0;
				for (let i of ["type2", "number", "suit"]) {
					if (!isInclude(i)) {
						num++;
					}
				}
				return num;

				function isInclude(method) {
					return ui.selected.cards.map(cardx => get[method](cardx)).includes(get[method](card));
				}
			},
			async content(event, trigger, player) {
				let { cards, targets } = event,
					pileCards = [],
					showCards = [];
				let duplicateRemove = (arr, method) => Array.from(new Set(arr.map(card => get[method](card))));
				//@ts-ignore
				if (cards.length < 3) pileCards.push(...get.cards(3 - cards.length));
				showCards = [...cards, ...pileCards];
				let execute = [];
				if (duplicateRemove(showCards, "number").length === 3) execute.push("number");
				if (duplicateRemove(showCards, "suit").length === 3) execute.push("suit");
				if (duplicateRemove(showCards, "type2").length === 3) execute.push("type");
				let num = execute.length;
				let tips = {
					number: "<font color='red'>点数均不同</font>",
					suit: "<font color='yellow'>花色均不同</font>",
					type: "<font color='green'>类型均不同</font>",
				};
				let str = [];
				for (let i of execute) {
					str.push(tips[i]);
				}
				await player.showCards(showCards, `${get.translation(player)}【游鳞】展示的牌<br>${str.join("<br>")}`);
				game.delay(2);
				if (num > 0) {
					for (let name of execute) {
						switch (name) {
							case "number":
								targets.forEach(t => t.changeHujia());
								break;
							case "suit":
								targets.forEach(t => t.draw(num));
								break;
							case "type":
								player.addTempSkill("youlinmrfz_addCount", { player: ["phaseUseEnd", "phaseEnd"] });
								break;
						}
					}
				}
				if (num - cards.length > 0) targets.forEach(t => t.addMark("fuyingmrfz", num - cards.length));
			},
			ai: {
				order: 13,
				result: {
					player: 1,
					target: 1,
				},
			},
			subSkill: {
				addCount: {
					charlotte: true,
					silent: true,
				},
			},
		},
		miaomengmrfz: {
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			prompt(event, player) {
				//@ts-ignore
				let num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
				return `【渺梦】:你可以观看牌堆顶${num}张牌，并可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中，然后你获得等同与你插入的牌的数量的个“沫”标记。`;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				const num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
				let suits = [...lib.suit],
					types = ["basic", "trick", "equip"];
				let outCards = [];
				let pileCards = get.cards(num);
				for (let type of types) {
					let name = lib.inpile.filter(n => get.type2(n) === type).randomGet();
					let suit = suits.randomGet();
					suits.remove(suit);
					outCards.push(game.createCard(name, suit, [1, 3, 5, 8, 12].randomGet()));
				}
				let { moved } = await player
					.chooseToMove()
					.set("list", [
						["牌堆顶", pileCards],
						["游戏外的牌", outCards],
					])
					.set("prompt", `你可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中`)
					.set("filterMove", (from, to, moved) => {
						//@ts-ignore
						let pile = get.event().pileCards;
						let fakeMoved = [moved[0].slice(), moved[1].slice()];
						if (typeof to !== "number") {
							let fromPos = findElementPosition(fakeMoved, from.link);
							let toPos = findElementPosition(fakeMoved, to.link);

							if (fromPos && toPos) {
								[fakeMoved[fromPos.arrayIndex][fromPos.elementIndex], fakeMoved[toPos.arrayIndex][toPos.elementIndex]] = [fakeMoved[toPos.arrayIndex][toPos.elementIndex], fakeMoved[fromPos.arrayIndex][fromPos.elementIndex]];
							}
						} else {
							if (fakeMoved[0].includes(from.link)) fakeMoved[0].remove(from.link);
							if (fakeMoved[1].includes(from.link)) fakeMoved[1].remove(from.link);
							fakeMoved[to].push(from.link);
						}
						let adjusted = fakeMoved[0].filter(card => pile.includes(card));
						return JSON.stringify(pile) === JSON.stringify(adjusted);

						function findElementPosition(arrays, element) {
							for (let i = 0; i < arrays.length; i++) {
								let index = arrays[i].indexOf(element);
								if (index !== -1) {
									return { arrayIndex: i, elementIndex: index };
								}
							}
							return null;
						}
					})
					.set("filterOk", () => {
						//@ts-ignore
						let outs = get.event().outCards;
						//@ts-ignore
						let buttons = Array.from(get.event().buttonss[0].children).concat(Array.from(get.event().buttonss[1].children));
						buttons.forEach(button => {
							let link = button.link;
							if (!outs.includes(link)) {
								let tag = button.querySelector(".info");
								if (tag) tag.innerHTML = "不可改变顺序";
							}
						});
						return true;
					})
					.set("processAI", list => {
						const player = get.event().player;
						let pile = [...list[0][1]];
						let outs = [...list[1][1]];
						for (let card of outs) {
							let insertIndex = pile.findIndex(cardx => get.value(cardx) < get.value(card));
							if (insertIndex === -1) {
								pile.push(card);
							} else {
								pile.insert(insertIndex, card, false);
							}
						}
						let moved = [pile, outs];
						return moved;
					})
					.set("outCards", outCards)
					.set("pileCards", pileCards)
					.forResult();
				if (!moved) return;
				let top = moved[0];
				//@ts-ignore
				let count = top.length - pileCards.length;

				player.addMark("fuyingmrfz", count);

				top.reverse();
				for (let i = 0; i < top.length; i++) {
					ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
				}
				game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
				game.updateRoundNumber();
				game.delayx();
			},
		},
		fuyingmrfz: {
			forced: true,
			audio: 2,
			mark: true,
			marktext: "沫",
			intro: {
				name: "沫",
				content: '有#个“沫”标记<br><span style="color:rgb(138,43,226);font-family:yuanli">人生五十年，如梦亦如幻。</span>',
			},
			trigger: {
				global: "dying",
			},
			filter(event, player) {
				return event.player.isAlive() && event.player.hasMark("fuyingmrfz");
			},
			async content(event, trigger, player) {
				player.$fullscreenpop("泡泡破裂了...", "thunder");
				for (let target of game.players.sortBySeat(trigger.player).filter(c => c.hasMark("fuyingmrfz"))) {
					const { bool } =
						target.countMark("fuyingmrfz") > target.countCards("he")
							? { bool: false }
							: await target
									.chooseToDiscard("he")
									.set("filterCard", card => {
										let cards = ui.selected.cards;
										if (cards.length > 1) {
											return cards.every(cardx => get.suit(card) !== get.suit(cardx));
										}
										return true;
									})
									.set("ai", card => {
										return Math.abs(get.value(card, player) - 10000);
									})
									.set("complexCard", true)
									.set("selectCard", target.countMark("fuyingmrfz"))
									.set("prompt", `请弃置${target.countMark("fuyingmrfz")}张花色不同的牌或失去${target.countMark("fuyingmrfz")}点体力`)
									.forResult();
					if (bool === false) target.loseHp(target.countMark("fuyingmrfz"));
					target.removeMark("fuyingmrfz", target.countMark("fuyingmrfz"));
				}
			},
			ai: {
				neg: true,
			},
		},

		// 电弧
		gandianmrfz: {
			audio: 2,
			forced: true,
			trigger: {
				global: "roundStart",
			},
			init(player) {
				game.broadcastAll(() => {
					lib.translate["gandianmrfz_zhou"] = "小轴";
					lib.translate["gandianmrfz_shu"] = "小树";
					//@ts-ignore
					_status.gandianmrfz_ig = [];
				});
			},
			mark: true,
			onremove(player) {
				//@ts-ignore
				delete _status.gandianmrfz_ig;
				delete player.storage.gandianmrfz;
				for (let char of game.players) {
					char.removeGaintag("gandianmrfz_zhou");
					char.removeGaintag("gandianmrfz_shu");
				}
			},
			intro: {
				content(storage) {
					let shu = Object.keys(lib.color).remove(storage);
					//@ts-ignore
					return `·小树:${get.translation(shu)}<br>·小轴:${get.translation(storage)}<br>·不受影响的角色:${get.translation(_status.gandianmrfz_ig)}`;
				},
			},
			global: ["gandianmrfz_effect", "gandianmrfz_effect2"],
			async content(event, trigger, player) {
				for (let char of game.players) {
					char.removeGaintag("gandianmrfz_zhou");
					char.removeGaintag("gandianmrfz_shu");
				}

				const { control } = await player
					.chooseControl("red", "black")
					.set("prompt", "【感电】：请选择令一种颜色的牌称之为“小轴”，其余颜色的牌则称之为“小树”")
					.set("ai", () => {
						return "red";
					})
					.forResult();

				if (control) player.storage.gandianmrfz = control;

				game.broadcastAll(color => {
					//@ts-ignore
					_status.gandianmrfzColor = color;
					//@ts-ignore
					_status.gandianmrfz_ig = [];
				}, player.storage.gandianmrfz);

				for (let char of game.players) {
					char.addGaintag(char.getCards("h", { color: player.storage.gandianmrfz }), "gandianmrfz_zhou");
					char.addGaintag(
						char.getCards("h", card => get.color(card) !== player.storage.gandianmrfz),
						"gandianmrfz_shu"
					);
				}

				const result = await player
					.chooseCardTarget({
						prompt: `【感电】:弃置N张牌并令N-1名角色不受【感电①】的影响且本轮第一个出牌阶段开始时摸X张牌（X=其手牌中“小树”的数量和“小轴”的数量中的最小值）`,
						filterTarget(card, player, target) {
							return ui.selected.targets.length - 1 < ui.selected.cards.length;
						},
						selectTarget: [0, Infinity],
						filterCard: true,
						selectCard: [0, Infinity],
						complexCard: true,
						complexTarget: true,
						ai1(card) {
							let player = get.player();
							//@ts-ignore
							let num = game.countPlayer(char => get.attitude2(char > 0));
							if (ui.selected.cards.length >= num) return false;
							return 6 - get.value(card, player);
						},
						ai2(target) {
							let player = get.player();
							if (target === player) return 114514;
							return get.attitude2(target) > 2;
						},
					})
					.forResult();
				let { targets, cards } = result;
				game.broadcastAll(arr => {
					//@ts-ignore
					_status.gandianmrfz_ig.push(...arr);
					//@ts-ignore
				}, targets);
				//@ts-ignore
				targets.forEach(target => {
					target
						.when({
							player: "phaseUseBegin",
							global: "phaseBefore",
						})
						.then(() => {
							if (trigger.name === "phaseUse") {
								let shu = player.countCards("h", card => card.hasGaintag("gandianmrfz_shu"));
								let zhou = player.countCards("h", card => card.hasGaintag("gandianmrfz_zhou"));
								let num = Math.min(shu, zhou, 5);
								if (num > 0) {
									player.draw(num);
									//@ts-ignore
									player.logSkill("gandianmrfz");
								}
							}
						});
				});
				player.discard(cards);
			},
			ai: {
				viewHandcard: true,
				skillTagFilter(player, tag, arg) {
					if (player == arg) {
						return false;
					}
				},
			},
			subSkill: {
				effect: {
					mod: {
						cardRespondable(card, player) {
							//@ts-ignore
							let ig = _status.gandianmrfz_ig || [];
							let evt = _status.event.parent;
							//@ts-ignore
							let color = _status.gandianmrfzColor;
							//@ts-ignore
							let isZhou = get.color(evt.card) === color;
							if ((isZhou && get.color(card) !== color) || ig.includes(player)) return true;
							return false;
						},
					},
					charlotte: true,
					silent: true,
					trigger: { player: "gainAfter" },
					async content(event, trigger, player) {
						let color = player.storage.gandianmrfz;
						for (let card of trigger.cards) {
							if (get.color(card) === color) card.addGaintag("gandianmrfz_zhou");
							else card.addGaintag("gandianmrfz_shu");
						}
					},
				},
				effect2: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "useCardToPlayered",
					},
					filter(event, player) {
						//@ts-ignore
						let ig = _status.gandianmrfz_ig || [];
						return !ig.includes(event.target);
					},
					async content(event, trigger, player) {
						const target = trigger.target;
						target.addTempSkill("gandianmrfz_block");
						target.markAuto("gandianmrfz_block", [trigger.card]);
					},
				},
				block: {
					mod: {
						cardEnabled(card, player) {
							if (!player.storage.gandianmrfz_block) {
								return;
							}
							const storage = player.getStorage("gandianmrfz_block");
							let evt = get.event();
							if (evt.name != "chooseToUse") {
								//@ts-ignore
								evt = evt.getParent("chooseToUse");
							}
							//@ts-ignore
							if (!evt || !evt.respondTo || !storage.some(i => i.cardid == evt.respondTo[1].cardid)) {
								return;
							}
							const color = get.color(card);
							//@ts-ignore
							let zhouColor = _status.gandianmrfzColor;
							//@ts-ignore
							return get.color(evt.respondTo[1]) === zhouColor && color !== zhouColor;
						},
					},
					onremove(player) {
						delete player.storage.gandianmrfz_block;
					},
					charlotte: true,
					trigger: {
						player: ["damageBefore", "damageCancelled", "damageZero"],
						target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
						global: ["useCardEnd"],
					},
					filter(event, player) {
						const evt = event.getParent("useCard", true, true);
						//@ts-ignore
						if (evt && evt.effectedCount < evt.effectCount) {
							return false;
						}
						if (!event.card || !player.storage.gandianmrfz_block) {
							return false;
						}
						return player.getStorage("gandianmrfz_block").includes(event.card);
					},
					forced: true,
					popup: false,
					firstDo: true,
					async content(event, trigger, player) {
						player.unmarkAuto(event.name, [trigger.card]);
						if (!player.getStorage(event.name).length) {
							player.removeSkill(event.name);
						}
					},
				},
			},
		},
		//司霆惊蛰 小姨
		xiuyuanmrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCardToPlayered",
				target: "useCardToTargeted",
			},
			init() {
				//@ts-ignore
				game.broadcastAll(() => {
					lib.translate["visible_xiuyuanmrfz"] = "明置";
				});
			},
			filter(event, player) {
				if (!get.tag(event.card, "damage") || player.countCards("h", "ying") > player.maxHp) {
					return false;
				}
				return player === event.target || event.getParent().triggeredTargets3.length === 1;
			},
			async content(event, trigger, player) {
				await player.gain(lib.card.ying.getYing(1), "gain2");
				let needShown = player.getCards("h", card => get.name(card) === "ying" && !get.is.shownCard(card));
				if (needShown.length > 0) player.addShownCards(needShown, "visible_xiuyuanmrfz");
			},
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("visible_xiuyuanmrfz")) return true;
				},
				cardDiscardable: function (card, player, name) {
					if (name === "phaseDiscard" && card.hasGaintag("visible_xiuyuanmrfz")) return false;
				},
				globalTo(from, to, distance) {
					let num = to.countCards("h", "ying");
					return distance + num;
				},
			},
		},
		zhengningmrfz: {
			audio: 2,
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return player.countCards("h", "ying") > 0 || game.countPlayer(char => char.isLinked()) > 0;
			},
			async cost(event, trigger, player) {
				let result = {
					num: 0,
					discards: [],
					links: [],
				};
				if (player.countCards("h", "ying") > 0) {
					const { cards } = await player
						.chooseCard("h")
						.set("prompt", get.prompt("zhengningmrfz"))
						.set("prompt2", "<font color = red>选择“确定”即不弃置【影】</font><br>你可以弃置任意张【影】、横置至多等量角色并摸等量张牌，然后你展示所有手牌并令一名横置且本回合未以此法选择过的角色进行判定，若你手牌中有与判定牌花色相同的牌，你可以弃置之并对其造成一点雷属性伤害，若其受到伤害，你可以重复此流程。")
						.set("filterCard", card => get.name(card) === "ying")
						.set("selectCard", [0, Infinity])
						.set("ai", card => {
							let player = get.player();
							let num = game.countPlayer(char => !char.isLinked() && get.effect(char, { name: "tiesuo" }, player, player) > -1);
							return ui.selected.cards.length < num ? 1 : -1;
						})
						.forResult();
					if (cards?.length) {
						result.num = cards.length;
						//@ts-ignore
						result.discards = cards;
					} else return;
				}
				if (result.num > 0) {
					const { targets } = await player
						.chooseTarget()
						.set("prompt", get.prompt("zhengningmrfz"))
						.set("prompt2", `<font color = red>选择“确定”即不横置角色</font><br>你可以至多横置${get.cnNumber(result.num)}名角色`)
						.set("filterTarget", (card, player, target) => !target.isLinked())
						.set("selectTarget", [0, result.num])
						.set("ai", target => {
							let player = get.player();
							return get.effect(target, { name: "tiesuo" }, player, player) > -1;
						})
						.forResult();
					//@ts-ignore
					if (targets && targets.length) result.links = targets;
				}
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("zhengningmrfz"))
					.set("prompt2", `令一名被横置的角色进行判定，然后你可能对其造成一点雷属性伤害`)
					.set("filterTarget", (card, player, target) => {
						//@ts-ignore
						let links = get.event().links;
						for (let char of links) {
							char.showPrompt("即将被横置", undefined, true);
						}
						return target.isLinked() || links.includes(target);
					})
					.set("ai", target => {
						let player = get.player();
						return get.damageEffect(target, player, player, "thunder") > 0;
					})
					.set("links", result.links)
					.forResult();
				event.result.cost_data = result;
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				const { discards, links, num } = event.cost_data;

				if (num > 0) {
					await player.discard(discards);
					await player.draw(num);
					for (let i of links) await i.link(true);
				}

				if (!target.isLinked()) return;

				const { suit } = await target.judge().forResult();
				if (player.countCards("h", { suit: suit }) < 1) return;
				const { bool } = await player
					.chooseToDiscard()
					.set("prompt", `【震佞】:你可以弃置一张${get.translation(suit)}的牌并对${get.translation(target)}造成一点雷属性伤害`)
					.set("ai", card => 8 - get.value(card))
					.set("filterCard", card => get.suit(card) === suit)
					.forResult();
				if (bool === true) {
					await target.damage("thunder", player).set("zhengningmrfz", true);
					if (
						player.hasHistory("sourceDamage", evt => {
							//@ts-ignore
							return (evt.zhengningmrfz = true);
						})
					) {
						let next = game.createEvent("zhengningmrfz");
						next.player = player;
						//@ts-ignore
						next.event = event;
						next.setContent(async (event, trigger, player) => {
							event.result = {};
							//@ts-ignore
							await lib.skill.zhengningmrfz.cost(event, trigger, player);
							if (event.result.bool) {
								event.targets = event.result.targets;
								event.cost_data = event.result.cost_data;
								player.logSkill("zhengningmrfz");
								//@ts-ignore
								await lib.skill.zhengningmrfz.content(event, trigger, player);
							}
						});
					}
				}
			},
		},

		//黍
		kenyemrfz: {
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
					.then(() => {
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
					.then(() => {
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
					content: function () {
						"step 0";
						//@ts-ignore
						if (player.getExpansions("kenyemrfz").length > 0) {
							var list = [];
							//@ts-ignore
							if (player.canUseToAnyone("tao")) list.add("tao");
							//@ts-ignore
							if (player.canUseToAnyone("wuzhong")) list.add("wuzhong");
							if (list.length == 1) {
								//@ts-ignore
								player.useCard({ name: list[0] }, [player.getExpansions("kenyemrfz")[0]], player);
								//@ts-ignore
								player.logSkill("kenyemrfz");
							} else {
								//@ts-ignore
								event.list = list;
								//@ts-ignore
								event.goto(2);
							}
							//@ts-ignore
						} else event.finish();
						"step 1";
						//@ts-ignore
						if (player.getExpansions("kenyemrfz").length > 0) {
							//@ts-ignore
							event.goto(0);
							//@ts-ignore
						} else event.finish();
						"step 2";
						//@ts-ignore
						if (player.getExpansions("kenyemrfz").length > 0) {
							//@ts-ignore
							player.chooseBool("【垦野】:选择‘确定’使用【桃】，选择‘取消’使用【无中生有】").set("ai", function () {
								var player = _status.event.player;
								if (player.hp < 3) return 0;
								return [0, 1].randomGet();
							});
							//@ts-ignore
						} else event.finish();
						"step 3";
						//@ts-ignore
						if (result.bool) {
							//@ts-ignore
							player.useCard({ name: "tao" }, [player.getExpansions("kenyemrfz")[0]], player);
							//@ts-ignore
						} else player.useCard({ name: "wuzhong" }, [player.getExpansions("kenyemrfz")[0]], player);
						//@ts-ignore
						player.logSkill("kenyemrfz");
						//@ts-ignore
						event.goto(0);
					},
				},
			},
		},
		heyingmrfz: {
			audio: 2,
			trigger: { global: "gainAfter" },
			filter: function (event, player) {
				var evt = event.getParent("phaseDraw");
				if (evt && evt.player == event.player) return false;
				if (!event.cards || event.cards.length < 2) return false;
				if (event.getParent(1).name != "draw") return false;
				return event.player.canUseToAnyone("wugu");
			},
			usable: 1,
			direct: true,
			content: function () {
				"step 0";
				//@ts-ignore
				var target = trigger.player,
					//@ts-ignore
					cards = trigger.cards,
					type = [];
				for (var i of cards) {
					if (type.includes(get.type2(i))) continue;
					type.add(get.type2(i));
				}
				//@ts-ignore
				event.type = type;
				//@ts-ignore
				if (target == player) {
					//@ts-ignore
					player
					//@ts-ignore
						.chooseTarget(`【禾盈】:你可以将${get.translation(trigger.cards)}当做至多指定${get.cnNumber(type.length)}角色且结算${get.cnNumber(type.length)}次的【五谷丰登】使用`)
						.set("selectTarget", [1, type.length])
						.set("filterTarget", function (card, player, target) {
							return player.canUse("wugu", target);
						})
						.set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, ""))
						.set("ai", function (target) {
							var player = _status.event.player,
								cards = _status.event.cards,
								num = _status.event.num;
							if (cards.length >= num * 2) return false;
							if (get.value(cards) > 8) return false;
							return get.effect(target, get.autoViewAs({ name: "wugu" }, cards), player, player);
						})
						//@ts-ignore
						.set("cards", trigger.cards)
						//@ts-ignore
						.set("num", event.type.length);
						//@ts-ignore
				} else event.goto(2);
				"step 1";
				//@ts-ignore
				if (result.targets) {
					//@ts-ignore
					trigger.player
						.when("useCard")
						.filter((event, player) => {
							return event.card && get.name(event.card) == "wugu" && event.card.storage.heyingmrfz == true;
						})
						.then(() => {
							//@ts-ignore
							trigger.effectCount = type.length;
						})
						//@ts-ignore
						.vars({ type: event.type });
						//@ts-ignore
					trigger.player.useCard({ name: "wugu", storage: { heyingmrfz: true } }, trigger.cards, result.targets);
					//@ts-ignore
					player.logSkill("heyingmrfz", result.targets);
					//@ts-ignore
					event.finish();
				} else {
					//@ts-ignore
					player.storage.counttrigger.heyingmrfz--;
					//@ts-ignore
					event.finish();
				}
				"step 2";
				//@ts-ignore
				player
				//@ts-ignore
					.chooseBool(`【禾盈】:是否令${get.translation(trigger.player)}选择是否将此次摸的牌当做五谷丰登使用？`)
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.target;
						return get.attitude(target, player) > 0;
					})
					.set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, ""))
					//@ts-ignore
					.set("target", trigger.player);
				"step 3";
				//@ts-ignore
				if (result.bool) {
					//@ts-ignore
					trigger.player
					//@ts-ignore
						.chooseTarget(`【禾盈】:你可以将${get.translation(trigger.cards)}当做至多指定${get.cnNumber(event.type.length)}角色且结算${get.cnNumber(event.type.length)}次的【五谷丰登】使用`)
						//@ts-ignore
						.set("selectTarget", [1, event.type.length])
						.set("filterTarget", function (card, player, target) {
							return player.canUse("wugu", target);
						})
						.set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, ""))
						.set("ai", function (target) {
							//@ts-ignore
							var player = _status.event.playerx,
								cards = _status.event.cards,
								num = _status.event.num;
							if (cards.length >= num * 2) return false;
							if (get.value(cards) > 8) return false;
							return get.effect(target, get.autoViewAs({ name: "wugu" }, cards), player, player);
						})
						//@ts-ignore
						.set("cards", trigger.cards)
						//@ts-ignore
						.set("playerx", trigger.player)
						//@ts-ignore
						.set("num", event.type.length);
				} else {
					//@ts-ignore
					player.storage.counttrigger.heyingmrfz--;
					//@ts-ignore
					event.finish();
				}
				"step 4";
				//@ts-ignore
				if (result.targets) {
					//@ts-ignore
					trigger.player
						.when("useCard")
						.filter((event, player) => {
							return event.card && get.name(event.card) == "wugu" && event.card.storage.heyingmrfz == true;
						})
						.then(() => {
							//@ts-ignore
							trigger.effectCount = type.length;
						})
						//@ts-ignore
						.vars({ type: event.type });
						//@ts-ignore
					trigger.player.useCard({ name: "wugu", storage: { heyingmrfz: true } }, 
						//@ts-ignore
						trigger.cards, result.targets);
					//@ts-ignore
						trigger.player.logSkill("heyingmrfz", result.targets);
						//@ts-ignore
				} else player.storage.counttrigger.heyingmrfz--;
			},
		},
		rancuimrfz: {
			derivation: "liangtianmrfz",
			audio: 2,
			trigger: {
				player: "die",
			},
			direct: true,
			skillAnimation: true,
			animationColor: "wood",
			forceDie: true,
			content: async function (event,trigger,player) {
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
		liangtianmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "drawAfter" },
			filter: function (event, player) {
				if (player.hasSkill("liangtianmrfz_ban")) return false;
				return event.getParent(2).name != "liangtianmrfz";
			},
			content: async function (event,trigger,player) {
				var list = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"],
					phase;
				for (var i of list) {
					//@ts-ignore
					var evt = trigger.getParent(i).name;
					if (evt == i) {
						phase = i;
						break;
					}
				}
				//@ts-ignore
				var phase = phase + "After";
				player.draw();
				player.addTempSkill("liangtianmrfz_ban", { global: phase });
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},

		//新煌
		newyanxunmrfz: {
			audio: "yanxunmrfz",
			intro: {
				content: "本回合手牌上限+#",
			},
			trigger: {
				player: lib.phaseName.map(c => `${c}Skipped`),
			},
			forced: true,
			async content(event, trigger, player) {
				player.addMark("newyanxunmrfz", 1, false);
				player.draw();
				if (!player.storage.newyanxunmrfz_addTempSkill) {
					game.broadcastAll(player => {
						player.storage.newyanxunmrfz_addTempSkill = true;
						//@ts-ignore
					}, player);
					player
						.when({ player: "phaseEnd" })
						.then(() => {
							player.removeMark("newyanxunmrfz", player.countMark("newyanxunmrfz"), false);
							game.broadcastAll(player => {
								delete player.storage.newyanxunmrfz_addTempSkill;
								//@ts-ignore
							}, player);
						})
						.assign({
							mod: {
								maxHandcard(player, num) {
									return (num += player.countMark("newyanxunmrfz"));
								},
							},
						});
				}
			},
		},
		newfeixuemrfz: {
			audio: "feixuemrfz",
			trigger: {
				player: "useCard2",
			},
			mark: true,
			intro: {
				content(_, player) {
					//@ts-ignore
					return _status.currentPhase === player ? `被跳过的阶段：${get.translation(player.skipList)}` : "不是你的回合";
				},
			},
			filter(event, player) {
				let next = lib.skill.newfeixuemrfz.getNextPhase(event, player);
				//@ts-ignore
				return get.tag(event.card, "damage") && event.targets && next && _status.currentPhase === player;
			},
			getNextPhase(event, player) {
				let name;
				if (lib.phaseName.indexOf(event.name) === -1) {
					let evt = event;
					while (true) {
						if (lib.phaseName.includes(evt.name)) {
							name = evt.name;
							break;
						}
						evt = evt.parent;
					}
				} else {
					name = event.name;
				}
				let i = lib.phaseName.indexOf(name) + 1;
				while (true) {
					if (i > lib.phaseName.length) return;
					let phase = lib.phaseName[i];
					if (player.skipList.includes(phase)) {
						i++;
						continue;
					}
					return phase;
				}
			},
			prompt2(event, player) {
				let next = lib.skill.newfeixuemrfz.getNextPhase(event, player);
				//@ts-ignore
				return `你可以跳过本回合下个没有被跳过的阶段(${get.translation(next)})，然后此牌的目标角色(${get.translation(event.targets)})需要打出一张【闪】才能响应此牌。`;
			},
			check(event, player) {
				let next = lib.skill.newfeixuemrfz.getNextPhase(event, player);
				if (["phaseUse", "phaseDraw"].includes(next)) return false;
				let val = 0;
				event.targets.forEach(target => {
					val += get.effect(target, event.card, player, player);
				});
				return val > 0;
			},
			async content(event, trigger, player) {
				player.skip(lib.skill.newfeixuemrfz.getNextPhase(event, player));
				player.draw();
				for (let target of trigger.targets) {
					const { bool } = await target
						.chooseToRespond()
						.set("prompt", `请打出一张【闪】，否则${get.translation(trigger.card)}不可响应`)
						.set("filterCard", function (card, player) {
							if (get.name(card) !== "shan") return false;
							return lib.filter.cardRespondable(card, player);
						})
						.set("ai", card => {
							let evt = _status.event.getParent(4);
							//@ts-ignore
							let player = get.event().targetx;
							//@ts-ignore
							let target = get.event().targetxx;
							//@ts-ignore
							let cardx = get.event().cardx;
							if (player.hasSkillTag("freeShan")) return 1;
							if (
								//@ts-ignore
								player.countCards("hs", c => {
									return get.canRespond(cardx, player).includes(c.name);
								}) <
									cardx.name ===
								"sha"
									? 2
									: 1
							)
								return -1;
							if (get.damageEffect(player, target, player) >= 0) return 0;
							return get.order(card);
						})
						.set("targetx", target)
						.set("targetxx", player)
						.set("cardx", trigger.card)
						.forResult();
					//@ts-ignore
					if (bool === false) trigger.directHit.add(target);
				}
			},
		},

		//新铃兰
		newhualaomrfz: {
			audio: "hualaomrfz",
			trigger: {
				source: "damageBegin",
			},
			marktext: "脆弱",
			intro: {
				name: "脆弱",
				content: "下次受到的伤害翻倍#次",
			},
			filter(event, player) {
				return event.player !== player;
			},
			prompt2(event, player) {
				return `是否令${get.translation(event.player)}下次受到的伤害翻倍？`;
			},
			check(event, player) {
				if (get.attitude(player, event.player) > 0) return false;
				if (event.num + event.player.countMark("newhualaomrfz") - event.player.hp >= 0) return false;
				return true;
			},
			async content(event, trigger, player) {
				var target = trigger.player;
				target.addMark("newhualaomrfz", 1, false);
				target.addTempSkill("newhualaomrfz_eff", { player: "damageEnd" });
				trigger.num = 0;
			},
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					trigger: { player: "damageBegin4" },
					filter(event, player) {
						return event.num > 0 && player.countMark("newhualaomrfz") > 0;
					},
					async content(event, trigger, player) {
						trigger.num *= 2 ** player.countMark("newhualaomrfz");
						//@ts-ignore
						player.removeAllmark("newhualaomrfz");
					},
				},
			},
		},
		newhemingmrfz: {
			audio: "huhuomrfz",
			trigger: {
				source: "damageZero",
			},
			usable: 1,
			async cost(event, trigger, player) {
				let num = Math.floor(game.players.filter(char => char !== player && char.inRangeOf(player)).length / 2);
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("newhemingmrfz"))
					.set("prompt2", `你可以令至多两名角色摸${get.cnNumber(num)}张牌`)
					.set("ai", target => get.attitude2(target) > 0)
					.set("selectTarget", [1, 2])
					.forResult();
			},
			async content(event, trigger, player) {
				let num = Math.floor(game.players.filter(char => char !== player && char.inRangeOf(player)).length / 2);
				game.asyncDraw(event.targets, num);
			},
		},

		//酒神
		xinyunmrfz: {
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
						target.storage.xinyunmrfz_cards = cards;
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
							return evt.cards && evt.cards.some(card => result.includes(card));
						});
					})
					.then(() => {
						game.broadcastAll(player => {
							delete player.storage.xinyunmrfz;
							delete player.storage.xinyunmrfz_ban;
							//@ts-ignore
						}, player);
					});
				while (true) {
					let cards = target.getCards("h", card => {
						//@ts-ignore
						if (!result.includes(card)) return false;
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
		zongyinmrfz: {
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
				order(item, player) {
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
		zhanwangmrfz: {
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
							.then(() => {
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
		//信仰搅拌机
		daoweimrfz: {
			audio: 2,
			trigger: { player: "phaseDrawEnd" },
			forced: true,
			filter(event, player) {
				let cards = [];
				let histories = player.getHistory("gain", evt => {
					let evtx = evt.getParent(2);
					return evtx.name === "phaseDraw" || (evtx.triggername && evtx.triggername.includes("phaseDraw"));
				});
				for (let history of histories) {
					if (history.cards) cards.push(...history.cards);
				}
				return cards.length > 0;
			},
			async content(event, trigger, player) {
				let cards = [];
				let histories = player.getHistory("gain", evt => {
					let evtx = evt.getParent(2);
					//@ts-ignore
					return evtx.name === "phaseDraw" || (evtx.triggername && evtx.triggername.includes("phaseDraw"));
				});
				for (let history of histories) {
					if (history.cards) cards.push(...history.cards);
				}
				await player.discard(cards);
				player.draw(cards.length * 2);
				player.storage.daoweimrfz_ban = Array.from(new Set(cards.map(card => card.name)));
				player.addTempSkill("daoweimrfz_ban", { player: "phaseEnd" });
			},
			subSkill: {
				ban: {
					charlotte: true,
					onremove: true,
					mark: true,
					intro: {
						content(_, player) {
							return `·无法使用或打出${get.translation(player.storage.daoweimrfz_ban)}`;
						},
					},
					mod: {
						cardEnabled2(card, player) {
							if (player.storage.daoweimrfz_ban.includes(card.name)) return false;
						},
					},
				},
			},
		},
		chongzhoumrfz: {
			audio: 2,
			enable: ["chooseToUse", "chooseToRespond"],
			usable: 1,
			intro: {
				name: "铳胄",
				content: "本回合手牌上限+2",
			},
			filter(event, player) {
				if (event.type == "wuxie") return false;
				for (var name of ["sha", "shan"]) {
					if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog(event, player) {
					var vcards = [];
					for (var name of ["sha", "shan"]) {
						var card = { name: name, isCard: true };
						if (event.filterCard(card, player, event)) {
							if (name === "sha") {
								for (var j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
							}
							vcards.push(["基本", "", name]);
						}
					}
					/**@type {Dialog}*/
					//@ts-ignore
					var dialog = ui.create.dialog("铳胄", [vcards, "vcard"], "hidden");
					//@ts-ignore
					dialog.direct = true;
					return dialog;
				},
				backup(links, player) {
					return {
						audio: "chongzhoumrfz",
						filterCard: () => true,
						selectCard: 1,
						viewAs: {
							name: links[0][2],
							nature: links[0][3],
							isCard: true,
						},
						popname: true,
						async precontent(event, trigger, player) {
							//@ts-ignore
							let target = _status.currentPhase;
							if (
								target.getSkills().filter(skill => {
									let info = get.info(skill);
									return info.sourceSkill && info.sourceSkill === "chongzhoumrfz";
								}).length < 1
							) {
								target.markSkill("chongzhoumrfz");
								target
									.when({ player: "phaseEnd" })
									.then(() => {
										player.unmarkSkill("chongzhoumrfz");
									})
									.assign({
										mod: {
											maxHandcard: function (player, num) {
												return (num += 2);
											},
										},
									});
							}
						},
					};
				},
				prompt(links, player) {
					return "铳胄：视为使用一张" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】";
				},
			},
			ai: {
				order(item, player) {
					var player = _status.event.player;
					var event = _status.event;
					if (event.filterCard({ name: "sha" }, player, event)) {
						if (
							!player.hasShan() &&
							//@ts-ignore
							!game.hasPlayer(function (current) {
								return player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0;
							})
						) {
							return 0;
						}
						return 2.95;
					} else {
						var player = _status.event.player;
						if (player.hasSkill("qingzhong_give")) return 2.95;
						return 3.15;
					}
				},
				respondSha: true,
				respondShan: true,
				skillTagFilter(player, tag, arg) {
					if (arg === "respond") return false;
				},
				result: {
					player: 1,
				},
			},
		},
		shiyimrfz: {
			audio: 2,
			derivation: ["xiangle"],
			init(player, skill) {
				player.storage[skill] = false;

				let info = get.info("xiangle");
				if (!info.audioname2) info.audioname2 = {};
				info.audioname2["xinyangjiaobanjimrfz"] = "xiangle_xinyangjiaobanjimrfz";
			},
			trigger: {
				player: ["dying", "loseAfter"],
				global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			skillAnimation: true,
			animationColor: "wood",
			juexingji: true,
			unique: true,
			filter: function (event, player) {
				if (event.name === "dying") return !player.storage.shiyimrfz;
				else {
					if (player.countCards("h")) return false;
					const evt = event.getl(player);
					return evt && evt.player == player && evt.hs && evt.hs.length > 0 && !player.storage.shiyimrfz;
				}
			},
			forced: true,
			content: async function (event, trigger, player) {
				player.loseMaxHp();
				player.recover();
				player.addSkill("xiangle");
				player.removeSkill("daoweimrfz");
				game.log(player, "获得了技能", "#g【享乐】");
				player.awakenSkill(event.name);
				player.storage[event.name] = true;

				let num = 5 - player.getAllHistory("useSkill", evt => evt.skill === "daoweimrfz").length;
				num = Math.max(num, 1);
				player.draw(num);
				player.storage.shiyimrfz_eff = num;
				player.addSkill("shiyimrfz_eff");
			},
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					onremove: true,
					mark: true,
					intro: {
						content(_, player) {
							let num = player.storage.shiyimrfz_eff;
							return `·手牌上限+${num}<br>·额定摸牌数+${num}`;
						},
					},
					trigger: { player: "phaseDrawBegin2" },
					filter(event, player) {
						return !event.numFixed;
					},
					async content(event, trigger, player) {
						trigger.num += player.storage.shiyimrfz_eff;
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + player.storage.shiyimrfz_eff;
						},
					},
				},
			},
		},
		xiangle_xinyangjiaobanjimrfz: { audio: 2 },

		//蕾缪安
		feiyimrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			intro: {
				content(_, player) {
					let index;
					player.getSkills().forEach(skill => {
						let info = get.info(skill);
						if (typeof info.feiyimrfz === "number") {
							index = info.feiyimrfz;
						}
					});
					return `·回合内你的攻击距离${index === 0 ? "+1" : "-1"}<br>·其他角色计算与你的距离${index === 0 ? "-1" : "+1"}`;
				},
			},
			async cost(event, trigger, player) {
				const { index } = await player
					.chooseControl("选项一", "选项二", "cancel2")
					.set("prompt", get.prompt("feiyimrfz"))
					.set("prompt2", `1`)
					.set("choiceList", ["你可以令你本回合的攻击距离+1，然后直到下个准备阶段开始时，其他角色计算与你的距离-1。", "你可以令你本回合的攻击距离-1，然后直到下个准备阶段开始时，其他角色计算与你的距离+1。"])
					.set("ai", () => 1)
					.forResult();
				if (typeof index === "number")
					event.result = {
						bool: true,
						cost_data: {
							index: index,
						},
					};
				else event.result = { bool: false };
			},
			async content(event, trigger, player) {
				const { index } = event.cost_data;
				player.markSkill("feiyimrfz");
				player
					.when({ player: "phaseBegin" })
					.then(() => {
						player.unmarkSkill("feiyimrfz");
					})
					.assign({
						mod: {
							globalTo(from, to, distance) {
								return distance + (index === 0 ? -1 : 1);
							},
							attackRange: function (player, num) {
								return (num += index === 0 ? 1 : -1);
							},
						},
						feiyimrfz: index,
					});
			},
			ai: {
				threaten: 0.8,
				combo: "mingzhengmrfz",
			},
		},
		mingzhengmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return event.filterCard ? player.countCards("h", card => event.filterCard(card, player, event)) > 0 : player.countCards("h") > 0;
			},
			filterCard: (card, player, event) => {
				return !lib.filter.filterCard(card, player, event);
			},
			selectCard: () => {
				let player = get.player();
				let num = player.getCards("h", card => lib.filter.filterCard(card, player)).length;
				num = Math.max(num, 1);
				return [0, num];
			},
			discard: false,
			lose: false,
			intro: {
				content: "·使用牌无距离限制<br>·使用的牌无视防具",
			},
			check(card) {
				let player = get.player();
				return get.value(card, player) < 6;
			},
			async content(event, trigger, player) {
				await player.recast(event.cards);
				let canUseCount = player.getCards("h", card => lib.filter.filterCard(card, player)).length;
				let cantUseCount = player.getCards("h", card => !lib.filter.filterCard(card, player)).length;
				if (canUseCount > cantUseCount) {
					player.draw(2);
					player.markSkill("mingzhengmrfz");
					player.addTempSkill("mingzhengmrfz_ig", { player: "phaseEnd" });
					player
						.when({ player: "phaseEnd" })
						.then(() => {
							player.unmarkSkill("mingzhengmrfz");
						})
						.assign({
							mod: {
								targetInRange: function () {
									return true;
								},
							},
						});
				}
			},
			subSkill: {
				ig: {
					trigger: {
						player: "useCardToPlayered",
					},
					silent: true,
					charlotte: true,
					logTarget: "target",
					async content(event, trigger, player) {
						trigger.target.addTempSkill("qinggang2");
						trigger.target.storage.qinggang2.add(trigger.card);
						trigger.target.markSkill("qinggang2");
					},
					ai: {
						unequip_ai: true,
						skillTagFilter(player, tag, arg) {
							if (arg && arg.name == "sha") return true;
							return false;
						},
					},
				},
			},
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
		},
		zhuijimrfz: {
			audio: 3,
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				//@ts-ignore
				return game.countPlayer(c => c.countCards("h") && c !== player && !player.inRange(c)) > 0;
			},
			prompt2(event, player) {
				//@ts-ignore
				let targets = game.filterPlayer(c => c.countCards("h") && c !== player && !player.inRange(c));
				return `你可以展示你攻击范围外所有角色（${get.translation(targets)}）的一张牌，所有因此展示了伤害类牌的角色本阶段成为你使用牌的目标时，你可以对其造成一点伤害或摸一张牌（每项每名角色每阶段限一次）。`;
			},
			intro: {
				content(_, player) {
					return `成为通缉的目标`;
				},
			},
			async content(event, trigger, player) {
				//@ts-ignore
				let targets = game.filterPlayer(c => c.countCards("h") && c !== player && !player.inRange(c));
				let obj = {
					cards: [],
					targets: [],
				};
				for (let target of targets) {
					const { cards } = await player
						.choosePlayerCard("h", true, target)
						.set("ai", () => get.rand(0, 1))
						.set("prompt", `展示${target}一张手牌`)
						.forResult();
					if (!cards) return;
					let card = cards[0];
					if (card) {
						//@ts-ignore
						obj.cards.push(card);
						//@ts-ignore
						obj.targets.push(target);
						if (get.suit(card) !== "spade") {
							target.storage.zhuijimrfz = [];
							target.markSkill("zhuijimrfz");
						}
					}
				}
				if (obj.cards.length > 0) {
					//@ts-ignore
					event.videoId = lib.status.videoId++;
					game.log(player, "展示了", obj.targets, "的", obj.cards);
					game.broadcastAll(
						function (info, id, player) {
							let { targets, cards } = info;
							var dialog = ui.create.dialog(`因${get.translation(player)}的【追缉】而展示的牌`, cards);
							//@ts-ignore
							dialog.videoId = id;
							var getName = function (target) {
								if (target._tempTranslate) return target._tempTranslate;
								var name = target.name;
								if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
								return get.translation(name);
							};
							for (var i = 0; i < targets.length; i++) {
								//@ts-ignore
								dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]);
							}
							setTimeout(() => {
								dialog.show();
							}, 1);
						},
						//@ts-ignore
						obj,
						//@ts-ignore
						event.videoId,
						player
					);
					game.delay(3);
					setTimeout(() => {
						//@ts-ignore
						game.broadcastAll("closeDialog", event.videoId);
					}, 3000);
				}
			},
			group: ["zhuijimrfz_clear", "zhuijimrfz_eff"],
			subSkill: {
				eff: {
					mod: {
						cardUsableTarget(card, player, target) {
							if (Array.isArray(target.storage.zhuijimrfz)) return true;
						},
					},
					audio: "zhuijimrfz",
					charlotte: true,
					trigger: { player: "useCardToTargeted" },
					filter(event, player) {
						let storage = event.target.storage.zhuijimrfz;
						return storage && storage.length < 2;
					},
					async cost(event, trigger, player) {
						let storage = trigger.target.storage.zhuijimrfz;
						let list = ["摸一张牌", `对${get.translation(trigger.target)}造成一点伤害`];
						if (storage.includes("damage") || storage.includes("draw")) {
							let str = storage.includes("draw") ? `是否对${get.translation(trigger.target)}造成一点伤害？` : `是否摸一张牌？`;
							let aiBool = true;
							if (storage.includes("draw") && get.damageEffect(trigger.target, player, player) < 0) aiBool = false;
							const { bool } = await player
								.chooseBool()
								.set("prompt", str)
								.set("ai", () => aiBool)
								.forResult();
							event.result = {
								bool: bool,
								cost_data: {
									index: storage.includes("draw") ? 1 : 0,
								},
							};
						} else {
							const { index } = await player
								.chooseControl("选项一", "选项二", "cancel2")
								.set("choiceList", list)
								.set("ai", () => {
									let player = get.player();
									let target = get.event().target;
									return get.damageEffect(target, player, player) > 0 ? 1 : 0;
								})
								.set("target", trigger.target)
								.forResult();
							if (typeof index === "number") {
								event.result = {
									bool: true,
									cost_data: {
										index: index,
									},
								};
							} else event.result = { bool: false };
						}
					},
					async content(event, trigger, player) {
						const { index } = event.cost_data;
						if (index === 0) {
							player.draw();
						} else {
							trigger.target.damage(player);
							player.line(trigger.target);
						}
						trigger.target.storage.zhuijimrfz.push(index === 0 ? "draw" : "damage");
					},
				},
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseUseEnd" },
					content() {
						for (let char of game.players) {
							if (Array.isArray(char.storage.zhuijimrfz)) {
								char.unmarkSkill("zhuijimrfz");
								delete char.storage.zhuijimrfz;
							}
						}
					},
				},
			},
		},

		// 新约能天使
		youhuomrfz: {
			audio: 2,
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name === "sha" && player.countCards("h", card => player.canRecast(card)) > 0;
			},
			intro: {
				content(_, player) {
					let addCount = player.getSkills().filter(skill => {
						let info = get.info(skill);
						return info.youhuomrfz;
					}).length;
					return `·本回合可额外使用${addCount}张【杀】<br>·本回合剩余可使用【杀】的数量：${player.getCardUsable("sha")}`;
				},
			},
			async cost(event, trigger, player) {
				let num = player.getHistory("useSkill", evt => evt.skill === "youhuomrfz").length + 1;
				event.result = await player
					.chooseCard()
					.set("filterCard", (card, player) => player.canRecast(card))
					.set("prompt", get.prompt("youhuomrfz"))
					.set("prompt2", `你可以重铸一张手牌，若此牌为伤害类牌，此牌(${get.translation(trigger.card)})额外结算${num}次，且若此牌造成伤害，你本回合使用【杀】的次数+1`)
					.set("ai", card => {
						let num = 6 - get.value(card);
						if (get.tag(card, "damage")) num += 2;
						return num;
					})
					.forResult();
			},
			async content(event, trigger, player) {
				let num = player.getHistory("useSkill", evt => evt.skill === "youhuomrfz").length;
				await player.recast(event.cards);
				if (get.tag(event.cards[0], "damage") > 0) {
					//@ts-ignore
					trigger.effectCount += num;
					player
						.when({
							source: "damageEnd",
							global: lib.phaseName.map(i => i + "End"),
						})
						.filter(event => {
							return event.name !== "damage" || event.card === trigger.card;
						})
						.then(() => {
							if (trigger.name === "damage") {
								player.markSkill("youhuomrfz");
								player
									.when({ player: "phaseEnd" })
									.then(() => {
										player.unmarkSkill("youhuomrfz");
									})
									.assign({
										mod: {
											cardUsable(card, player, num) {
												if (card.name == "sha") return num + 1;
											},
										},
										youhuomrfz: true,
									});
							}
						});
				}
			},
		},
		letianmrfz: {
			audio: 2,
			init() {
				lib.translate["letianmrfz_tips"] = "旧约";
			},
			forced: true,
			trigger: { global: "phaseEnd" },
			filter(event, player) {
				return player.countCards("h", card => card.hasGaintag("letianmrfz_tips")) < 1;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.drawTo(4);
				player.removeGaintag("letianmrfz_tips");
			},
			group: ["letianmrfz_begin"],
			subSkill: {
				begin: {
					charlotte: true,
					silent: true,
					priority: 114514,
					trigger: {
						global: "phaseBegin",
					},
					async content(event, trigger, player) {
						for (let card of player.getCards("h")) {
							card.addGaintag("letianmrfz_tips");
						}
					},
				},
			},
		},

		//隐德莱希
		pingyimrfz: {
			audio: 2,
			trigger: { global: "phaseEnd" },
			getCharacter() {
				let result = {
					sourceDamage: [],
					damage: [],
					all: [],
				};
				for (let char of game.players) {
					//@ts-ignore
					char.getHistory("sourceDamage", evt => {
						//@ts-ignore
						if (evt.player) result.damage.add(evt.player);
						//@ts-ignore
						if (evt.source) result.sourceDamage.add(evt.source);
					});
				}
				result.all = result.sourceDamage.concat(result.damage);
				return result;
			},
			filter(event, player) {
				let { sourceDamage, damage } = lib.skill.pingyimrfz.getCharacter();
				return (sourceDamage.length > 0 || damage.length > 0) && event.player !== player;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("pingyimrfz"))
					.set("prompt2", get.prompt2("pingyimrfz").replace(/###([^#]+)###/g, ""))
					.set("filterTarget", (card, player, target) => {
						//@ts-ignore
						let { sourceDamage, damage, all } = get.event().info;
						//技能提示
						for (let char of game.players) {
							let prompt = [];
							if (sourceDamage.includes(char)) prompt.push("使用【杀】");
							if (damage.includes(char)) prompt.push("使用【桃】");
							if (prompt.length > 0) whichWayTips.addPrompt(char, prompt.length > 1 ? prompt.map(text => `<span class = "promptTextSJZX">${text}</span>`).join("<br>") : prompt[0], "pingyimrfz", "uncheckBegin");
						}
						return all.includes(target);
					})
					.set("info", lib.skill.pingyimrfz.getCharacter())
					.forResult();
			},
			async content(event, trigger, player) {
				let { sourceDamage, damage, all } = lib.skill.pingyimrfz.getCharacter();
				let target = event.targets[0];
				let name = [];
				if (sourceDamage.includes(target)) name.add("sha");
				if (damage.includes(target)) name.add("tao");
				let prompt = `对${get.translation(target)}使用一张`;
				if (name.length === 1) prompt = prompt + `【${get.translation(name[0])}】`;
				else prompt = prompt + `【${get.translation(name[0])}】或【${get.translation(name[1])}】`;
				await player
					.chooseToUse(target)
					.set("prompt", prompt)
					.set("filterCard", (card, player, event) => {
						//@ts-ignore
						return get.event().namex.includes(get.name(card));
					})
					.set("namex", name);
				if (player.storage.pingyimrfz_check) {
					delete player.storage.pingyimrfz_check;
					let next = game.createEvent("pingyimrfz_repeat");
					next.player = player;
					next.setContent(async function (event, trigger, player) {
						//@ts-ignore
						await lib.skill.pingyimrfz.cost(event, trigger, player);
						if (event.result.bool !== true) return;
						event.targets = event.result.targets;
						//@ts-ignore
						await lib.skill.pingyimrfz.content(event, trigger, player);
					});
				}
			},
			group: ["pingyimrfz_check"],
			subSkill: {
				check: {
					silent: true,
					audio: false,
					charlotte: true,
					trigger: {
						global: "changeHp",
					},
					filter(event, player) {
						//@ts-ignore
						return event.getParent(5).name === "pingyimrfz" || event.getParent(5).name === "pingyimrfz_repeat";
					},
					async content(event, trigger, player) {
						player.storage.pingyimrfz_check = true;
					},
				},
			},
		},
		beinuomrfz: {
			audio: 2,
			usable: 3,
			/*
			 * false为最后获得，true为最先获得
			 */
			getCard(bool, debug) {
				let player = get.player();
				let cards = player.getCards("h")?.filter(card => card.storage && typeof card.storage.beinuomrfz === "number");
				if (!cards) return;
				return debug
					? cards.sort((a, b) => {
							let num1 = a.storage.beinuomrfz;
							let num2 = b.storage.beinuomrfz;
							return num1 - num2;
						})
					: cards.sort((a, b) => {
							let num1 = a.storage.beinuomrfz;
							let num2 = b.storage.beinuomrfz;
							return num1 - num2;
						})[bool ? 0 : cards.length - 1];
			},
			init() {
				lib.translate["beinuomrfz_last"] = "最后获得";
				lib.translate["beinuomrfz_earliest"] = "最先获得";
			},
			enable: "chooseToUse",
			filterCard(card, player) {
				return card === lib.skill.beinuomrfz.getCard(false);
			},
			filter(event, player) {
				let name = lib.skill.beinuomrfz.getCard(true)?.name;
				if (!name) return false;
				let card = get.autoViewAs({ name: name }, [lib.skill.beinuomrfz.getCard(false)]);
				return event.filterCard(card, player, event);
			},
			viewAs(cards, player) {
				let name = lib.skill.beinuomrfz.getCard(true).name;
				return { name: name };
			},
			prompt() {
				return `你可以将最后获得的牌(${get.translation(lib.skill.beinuomrfz.getCard(false).name)})当作最先获得的牌(${get.translation(lib.skill.beinuomrfz.getCard(true).name)})使用`;
			},
			async precontent(event, trigger, player) {
				let last = lib.skill.beinuomrfz.getCard(false);
				let earliest = lib.skill.beinuomrfz.getCard(true);
				let cards = event.result.cards;
				if (get.type2(last) !== get.type2(earliest)) {
					player
						.when({ player: "useCardAfter" })
						.filter((event, player) => {
							//@ts-ignore
							return event.cards && event.cards[0] === cards[0];
						})
						.then(() => {
							player.draw(2);
						})
						.then(() => {
							// let cards = player.getCards("h")
							// 	.filter(card=>card.storage&&typeof card.storage.beinuomrfz === "number")
							// 	.sort((a,b)=>{
							// 		return a.storage.beinuomrfz - b.storage.beinuomrfz;
							// 	});
							// let last = cards[cards.length-1].storage.beinuomrfz;
							// let earliest = cards[0].storage.beinuomrfz;
							// cards[0].storage.beinuomrfz = last;
							// cards[cards.length-1].storage.beinuomrfz = earliest;
							player
								.chooseCard("你可以将一张手牌视为你最先获得的牌")
								.set("filterCard", card => {
									return card !== lib.skill.beinuomrfz.getCard(true);
								})
								.set("ai", card => {
									let earliest = lib.skill.beinuomrfz.getCard(true);
									let player = get.player();
									if (["sha", "tao"].includes(earliest.name)) return -1;
									if (["sha", "tao"].includes(card.name)) return 10 + player.hp < 3 ? get.value(card) : 0;
									return get.value(earliest) >= get.value(card) ? -1 : get.value(card);
								});
						})
						.then(() => {
							let result = event._result;
							if (result.cards) {
								result.cards[0].storage.beinuomrfz = lib.skill.beinuomrfz.getCard(true).storage.beinuomrfz - 1;
							}
						})
						.then(() => {
							//@ts-ignore
							lib.skill.beinuomrfz.subSkill.tip.content(event, trigger, player);
						});
				}
			},
			group: ["beinuomrfz_tag", "beinuomrfz_tip"],
			subSkill: {
				tag: {
					silent: true,
					audio: false,
					charlotte: true,
					trigger: {
						player: "gainAfter",
						global: "gameDrawAfter",
					},
					async content(event, trigger, player) {
						if (!player.storage.beinuomrfz_tag) player.storage.beinuomrfz_tag = 0;
						let cards = trigger.name === "gain" ? trigger.cards : player.getCards("h");
						for (let card of cards) {
							card.storage.beinuomrfz = player.storage.beinuomrfz_tag;
							player.storage.beinuomrfz_tag++;
						}
					},
				},
				tip: {
					silent: true,
					audio: false,
					charlotte: true,
					trigger: {
						player: ["gainAfter", "loseAfter"],
						global: "gameDrawAfter",
					},
					lastDo: true,
					async content(event, trigger, player) {
						for (let card of player.getCards("h").filter(card => card.storage && typeof card.storage.beinuomrfz === "number")) {
							card.removeGaintag("beinuomrfz_last");
							card.removeGaintag("beinuomrfz_earliest");
							if (card === lib.skill.beinuomrfz.getCard(false)) card.addGaintag("beinuomrfz_last");
							if (card === lib.skill.beinuomrfz.getCard(true)) card.addGaintag("beinuomrfz_earliest");
						}
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},

		// 爱布拉娜 香蕉姐 死芒
		yizhamrfz: {
			init() {
				lib.translate["yizhamrfz_tip1"] = "拼点";
				lib.translate["yizhamrfz_tip2"] = "议事";
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return game.hasPlayer(char => char !== player && char.countCards("h") > 0 && player.canCompare(char)) && player.countCards("h") > 0;
			},
			filterTarget(card, player, target) {
				return target !== player && target.countCards("h") > 0 && player.canCompare(target);
			},
			selectTarget: [1, 2],
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let { targets } = event;
				function aiChoose(char) {
					let cards = char.getCards("h");
					if (cards.length < 2) return cards;
					let sortNumber = cards.sort((a, b) => {
						//@ts-ignore
						return get.number(b, char) - get.number(a, char);
					});
					let sortValue = cards.sort((a, b) => {
						return get.value(b, char) - get.value(a, char);
					});
					let max = sortNumber[0];
					let min = sortNumber[sortNumber.length - 1];
					if (player.countCards("h", { color: "red" }) < 1) {
						return [max, sortValue[sortValue.length - 1]];
					} else if (player.countCards("h", { color: "black" }) < 1) {
						return [min, sortValue[sortValue.length - 1]];
					} else {
						if (Math.random() > 0.5) {
							let black = cards.filter(card => get.color(card) === "black" && card !== max);
							return [max, black.length > 0 ? black.randomGet() : cards.filter(card => card !== max).randomGet()];
						} else {
							let red = cards.filter(card => get.color(card) === "red" && card !== min);
							return [min, red.length > 0 ? red.randomGet() : cards.filter(card => card !== min).randomGet()];
						}
					}
				}
				let cardMaps = [];
				for (let target of [...targets, player]) {
					let cardsCompare;
					const result = await target
						.chooseCard(true)
						.set("prompt", "【刈诈】：请选择一张手牌进行拼点")
						.set("type", "compare")
						.set("ai", card => {
							let player = get.player();
							//@ts-ignore
							let result = get.event().aiChooseResult;
							return result[0] === card;
						})
						.set("aiChooseResult", aiChoose(target))
						.forResult();
					if (!result || !result.cards) return;
					if (result.skill) {
						//@ts-ignore
						cardsCompare = lib.skill[result.skill].onCompare(target)[0];
					} else cardsCompare = result.cards[0];
					const { cards } = await target
						.chooseCard(true)
						.set("type", "debate")
						.set("source", player)
						.set("prompt", "【刈诈】：请选择一张手牌进行议事")
						.set("filterCard", (card, player, event) => {
							//@ts-ignore
							let banCard = get.event().banCard;
							return card !== banCard;
						})
						.set("complexCard", true)
						.set("ai", card => {
							let player = get.player();
							//@ts-ignore
							let result = get.event().aiChooseResult;
							return result[0] === card;
						})
						.set("aiChooseResult", aiChoose(target))
						.set("banCard", cardsCompare)
						.forResult();
					if(!cards) return;
					const cardsDebate = cards[0];

					cardMaps.push([target, [cardsCompare, cardsDebate]]);
				}
				let compareMaps = {};
				let debateMaps = [];
				for (let arr of cardMaps) {
					//@ts-ignore
					compareMaps[arr[0].playerid] = arr[1][0];
					if (arr[1] && arr[1][1]) debateMaps.push([arr[0], arr[1][1]]);
				}
				//@ts-ignore
				let targetCompare = targets.filter(target => Object.keys(compareMaps).includes(target.playerid));
				let targetDebate = targets.filter(target => debateMaps.map(arr => arr[0]).includes(target));
				let  result1 = await player.chooseToCompare(targetCompare).set("fixedResult", compareMaps).forResult();
				let result2  = await player.chooseToDebate([...targetDebate, player]).set("fixedResult", debateMaps).forResult();
				[...targetDebate, player].forEach(target => target.removeGaintag("yizhamrfz_tip2"));
				let compareResult = {
					win: [],
					lose: [],
				};
				for (let i = 0; i < result1.num1.length; i++) {
					if (result1.num1[i] > result1.num2[i]) {
						//@ts-ignore
						compareResult.lose.add(targetCompare[i]);
						//@ts-ignore
						compareResult.win.add(player);
					} else {
						//@ts-ignore
						compareResult.lose.add(player);
						//@ts-ignore
						compareResult.win.add(targetCompare[i]);
					}
				}
				if (result2.opinion === "black") {
					for (let char of compareResult.lose) {
						//@ts-ignore
						if (!compareResult.win.includes(char)) await char.damage(player);
					}
				} else if (result2.opinion === "red") {
					for (let char of compareResult.win) {
						//@ts-ignore
						if (char.countDiscardableCards(player, "he")) await player.discardPlayerCard(char, true, 2, "he").set("ai", lib.card.guohe.ai.button);
					}
				} else {
					const {targets:targetsx} = await player
						.chooseTarget()
						.set("prompt", "【刈诈】：你可以对任意名角色造成一点伤害")
						.set("selectTarget", [1, Infinity])
						.set("ai", target => {
							let player = get.player();
							return get.damageEffect(target, player, player) > 0;
						})
						.forResult();
					if (targetsx) {
						for (let char of targetsx) {
							char.damage(player);
							player.line(char);
						}
					}
					player.draw(2);
				}
			},
			ai: {
				order: 10,
				result: {
					player: 1,
					target: -1,
				},
			},
		},
		kumianmrfz: {
			audio: 2,
			trigger: { player: "phaseJieshuEnd" },
			getNum(player) {
				let num = 0;
				let cards = [];
				num += player.getStat("damage") || 0;
				for (let char of game.players) {
					//@ts-ignore
					char.getHistory("lose", evt => {
						if (evt.type === "discard" && evt.cards) {
							let discards = get.discarded();
							let result = evt.cards.filter(card => discards.includes(card));
							if (result.length > 0) cards.push(...result);
						}
					});
				}
				if (cards.length > 0) num += new Set(cards.map(i => get.type2(i))).size;
				return num;
			},
			filter(event, player) {
				let num = lib.skill.kumianmrfz.getNum(player);
				return num > 0;
			},
			init(player) {
				game.broadcastAll(function () {
					let skills = ["new_rejianxiong", "shanzhuan", "olzaowang"];
					skills.forEach(skill => {
						let info = get.info(skill);
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2[player.name] = "kumianmrfz";
					});
				});
			},
			derivation: ["new_rejianxiong", "shanzhuan", "olzaowang"],
			forced: true,
			async content(event, trigger, player) {
				let num = lib.skill.kumianmrfz.getNum(player);
				if (num > 0) {
					player.draw();
				}
				if (num > 1) player.addTempSkill("new_rejianxiong", { player: "phaseJieshuBegin" });
				if (num > 2) player.addTempSkill("shanzhuan", { player: "phaseJieshuBegin" });
				if (num > 3) player.addTempSkill("olzaowang", { player: "phaseJieshuBegin" });
			},
		},

		// mon3tr m3
		// 想你了，牢猫
		shulimrfz: {
			audio: false,
			forced: true,
			silent: true,
			mod: {
				cardUsable(card, player, num) {
					if (player.countCards("h") >= game.roundNumber * 2 && ["equip", "delay"].includes(get.type(card))) return false;
					if (player.countCards("h") >= game.roundNumber && get.type(card) === "basic" && typeof num === "number") return (num += 1);
				},
			},
		},
		ronghuimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			async content(event, trigger, player) {
				const discardPlie = Array.from(ui.discardPile.childNodes);
				const cards = player.getCards("h");
				await player.lose(cards);
				await player.gain(discardPlie, "gain2");

				player.addTempSkill("ronghuimrfz_lose", { player: "phaseUseEnd" });
				player
					.when({ player: "phaseUseEnd" })
					.then(() => {})
					.assign({
						mod: {
							cardUsable(card, player, num) {
								if (typeof num === "number") return num;
								return 1;
							},
						},
					});
				player.when({ player: "phaseDiscardBegin" }).step(async (event, trigger, player) => {
					const discardPlie = Array.from(ui.discardPile.childNodes);
					const cards = player.getCards("h");
					await player.lose(cards);
					await player.gain(discardPlie, "gain2");
					//@ts-ignore
					player.logSkill("ronghuimrfz");
				});
			},
			subSkill: {
				lose: {
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: {
						player: "loseAfter",
						global: "loseAsyncAfter",
					},
					filter(event, player) {
						if (event.type !== "use") return false;
						//@ts-ignore
						let evt = event.getl(player);
						return evt.cards2 && evt.cards2.some(card => get.position(card) === "d" && !["equip", "delay"].includes(get.type(card)));
					},
					async content(event, trigger, player) {
						//@ts-ignore
						let cards2 = trigger.getl(player).cards2;
						cards2 = cards2.filter(card => get.position(card) === "d" && !["equip", "delay"].includes(get.type(card)));
						for (let card of cards2) {
							card.fix();
							ui.cardPile.appendChild(card);
						}
						game.log(player, `将`, `#y${get.translation(cards2)}`, `张牌置于了牌堆底`);
					},
				},
			},
			ai: {
				threaten: 1.8,
				order: 3.4,
				result: {
					player(player) {
						let transferValue = function (cards) {
							return cards.map(card => player.getUseValue(card)).reduce((acc, curr) => acc + curr, 0);
						};
						let filterCards = function (cards) {
							//@ts-ignore
							return cards.filter(card => player.getCardUsable2(card) > 0 && (get.type(card) === "basic" || (get.type(card) !== "basic" && player.countUsed(card) < 1)));
						};
						let cards = filterCards(player.getCards("h"));
						let discardPlie = filterCards(Array.from(ui.discardPile.childNodes));
						return transferValue(cards) > transferValue(discardPlie) ? -1 : 1;
					},
				},
			},
		},
	},
};
