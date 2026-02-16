import { lib, game, ui, get, ai, _status } from "noname";
import { skillCustomFunc } from "../../../nonameEx/custom/skill.ts";
import { whichWayTips } from "../../../tips/index.ts";
import { whichWayToast } from "../../../toast/index.ts";
import { whichWayUtil } from "../../../utill.js";

const tmpSave = window.whichWaySave.tmpSave;

/** @type {WhichWayCharacterPack} */
export default {
	character: {
		shuidengxinmrfz: ["female", "weimrfz", 3, ["sanyanmrfz", "dongqumrfz"], []],
		muqianmrfz: ["female", "samrfz", 4, ["cangshimrfz"], []],
		alannamrfz: ["female", "leimrfz", 4, ["qixiemrfz"], []],
		lingyinmrfz: ["female", "lamrfz", 4, ["qiansongmrfz", "qiancimrfz"], []],
		dibimrfz: ["female", "gemrfz", 4, ["penhuimrfz"], []],
		Christinemrfz: ["female", "weimrfz", 3, ["mixumrfz", "yashimrfz"], []],
		spheijiaomrfz: ["male", "luomrfz", 3, ["lianqimrfz", "juhemrfz", "denglongmrfz"], []],
		yunqingpingmrfz: ["male", "yanmrfz", 4, ["luwumrfz", "baizhaomrfz"], []],
		songtongmrfz: {
			sex: "male",
			hp: 3,
			maxHp: 4,
			group: "dongmrfz",
			skills: ["xianchoumrfz"],
		},
		jixingmrfz: {
			sex: "female",
			hp: 4,
			group: "dongmrfz",
			skills: ["tiandingmrfz", "renweimrfz"],
		},
		landumrfz: {
			sex: "female",
			hp: 3,
			group: "yimrfz",
			skills: ["landu_shixinmrfz", "picaimrfz"],
		},
		ruoyemumrfz: {
			sex: "female",
			group: "othermrfz",
			hp: 1,
			maxHp: 3,
			skills: ["lingwomrfz", "pojianmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		},
		youtiansiruomaimrfz: {
			sex: "female",
			group: "othermrfz",
			hp: 4,
			skills: ["leigumrfz", "jiaoyingmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		},
		sanjiaochuhuamrfz: {
			sex: "female",
			group: "othermrfz",
			hp: 5,
			skills: ["weimianmrfz", "weiquanmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		},
		bafanhailingmrfz: {
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["chendiemrfz", "umiri_chenxianmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		},
		innamrfz: {
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["guiyingmrfz", "sheguomrfz"],
		},
		fengwanmrfz: {
			sex: "female",
			group: "dongmrfz",
			hp: 3,
			skills: ["zhiyimrfz", "huayingmrfz"],
		},
		zheyamrfz: {
			sex: "female",
			group: "wumrfz",
			hp: 3,
			skills: ["mingzhongmrfz", "zhiyanmrfz", "hanshengmrfz"],
		},
		yelamrfz: {
			sex: "female",
			group: "xiemrfz",
			hp: 4,
			skills: ["shengshimrfz", "xueweimrfz"],
		},
		hadiyamrfz: {
			sex: "female",
			group: "samrfz",
			hp: 4,
			skills: ["juetumrfz"],
		},
		xueliemrfz: {
			sex: "female",
			group: "xiemrfz",
			hp: 4,
			skills: ["queliemrfz", "liexuemrfz"],
		},
		tiankonghemrfz: {
			sex: "male",
			group: "gemrfz",
			hp: 4,
			skills: ["souchamrfz", "tiankonghe_zhenlimrfz"],
		},
		baidurenmrfz: {
			sex: "male",
			group: "mimrfz",
			hp: 4,
			skills: ["wenchoumrfz"],
		},
		xiangshimrfz: {
			sex: "female",
			group: "gemrfz",
			hp: 3,
			skills: ["xuanshuimrfz", "pozemrfz"],
			designer: ["培嵩", "林登万"],
		},
		sptiaoxiangshimrfz: {
			sex: "female",
			group: "samrfz",
			hp: 3,
			skills: ["youchenmrfz", "biaodaomrfz"],
			designer: ["涵涵"],
		},
	},
	skill: {
		//撷英调香师
		youchenmrfz: {
			audio: ["作战中1", "作战中2"],
			trigger: { global: "roundStart" },
			filter(event, player) {
				return player.countCards("he") >= 2 && game.hasPlayer(c => c !== player && c.countCards("he") >= 2);
			},
			onremove: true,
			mark: true,
			intro: {
				mark: function (dialog, storage, player) {
					if (!storage) return `·没有使用过【诱嗔】`;
					dialog.addText(`·首次【诱嗔】的角色：${get.translation(storage)}`);
					dialog.addSmall([[storage].slice().map(i=>i.name), "character"]);
				},
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("youchenmrfz"))
					.set("prompt2", get.skillInfoTranslation("youchenmrfz"))
					.set("filterTarget", (card, player, target) => {
						return player !== target && target.countCards("he") >= 2;
					})
					.set(
						"ai",
						/** @param {Player} target  */
						target => {
							const player = get.player();
							if (player.countCards("he", card => get.value(card) < 8) < 2) return -1;
							if (get.attitude(player, target) > 0) return -1;
							return 1145141919810 - target.countCards("he");
						}
					)
					.forResult();
			},
			async content(event, trigger, player) {
				const {
					targets: [target],
				} = event;
				if (!target) return;
				for (let char of [target, player].sort(lib.sort.seat)) {
					await char.chooseToDiscard("he", true, `【诱嗔】:请弃置两张牌`, 2).set("ai", card => -get.value(card));
				}
				if (!player.isMaxHandcard(false)) await player.draw(2);
				if (!player.storage.youchenmrfz) {
					player.storage.youchenmrfz = target;
					target.addSkill("biaodaomrfz_distance");
				}

				const playerx = player;

				target.when({ player: "useCardAfter", global: "roundStart" }).step(async (event, trigger, player) => {
					if (trigger.name === "useCard") {
						if (!trigger.targets) discard();
						if (!trigger.targets.includes(playerx)) discard();
					}
					function discard() {
						player.chooseToDiscard("he", true, `【诱嗔】:请弃置一张牌`);
					}
				});
			},
			ai: {
				expose: 0.1,
			},
		},
		biaodaomrfz: {
			forced: true,
			audio: ["作战中3", "作战中4"],
			derivation: ["clananran"],
			init(player, skill) {
				game.broadcastAll(player => {
					let info = get.info("clananran");
					if (!info.audioname2) info.audioname2 = {};
					info.audioname2[player.name] = "biaodaomrfz";
					//@ts-ignore
				}, player);
				player.storage[skill] = 0;
			},
			group: ["clananran","biaodaomrfz_clearTips"],
			trigger: {
				player: "loseAfter",
			},
			filter(event, player) {
				const target = player.storage.youchenmrfz;
				return target && target.isAlive() && player.countCards("h") - target.countCards("h") < 0;
			},
			async content(event, trigger, player) {
				player.refreshSkill("clananran");

				/**
				 * @type {Player}
				 */
				const target = player.storage.youchenmrfz;
				if (!target) return;

				let index;

				if (player.storage.biaodaomrfz > 2) index = 0;
				else {
					const result = await target
						.chooseControl("获得护甲", "增加距离")
						.set("prompt", `【镳道】:请选择一项`)
						.set("displayIndex", false)
						.set("choiceList", [`获得护甲:你与${get.translation(player)}各获得一点护甲值`, `增加距离:你与${get.translation(player)}计算与对方的距离+1（当前+${player.storage.biaodaomrfz}）`])
						.set("ai", () => {
							const player = get.player();
							//@ts-ignore
							const target = get.event().targetx;
							if (get.attitude(player, target) > 0 || player.hp <= 2) return 0;
							return 1;
						})
						.set("targetx", target)
						.forResult();
					if (typeof result.index === "number") index = result.index;
					else index = 0;
				}

				switch (index) {
					case 0: {
						[player, target].sort(lib.sort.seat).forEach(char => char.changeHujia(1));
						break;
					}
					case 1: {
						player.storage.biaodaomrfz += 1;
						whichWayTips.addPrompt(player, `与${get.translation(target)}的距离+${player.storage.biaodaomrfz}`,"biaodaomrfz_distance")
						whichWayTips.addPrompt(target, `与${get.translation(player)}的距离+${player.storage.biaodaomrfz}`,"biaodaomrfz_distance")
						break;
					}
				}
			},
			mod:{
				globalFrom(from, to, num) {
					const target = from?.storage?.youchenmrfz;
					if(target && to === target && typeof from.storage.biaodaomrfz === "number"){
						return num + from.storage.biaodaomrfz;
					}
				}
			},
			subSkill: {
				clearTips:{
					trigger:{
						global:"dieAfter"
					},
					silent:true,
					charlotte:true,
					forceDie:true,
					filter(event,player){
						return [player, player.storage.youchenmrfz].includes(event.player);
					},
					async content(event,trigger,player){
						whichWayTips.removePrompt(player, "biaodaomrfz_distance");
						if(player.storage.youchenmrfz) whichWayTips.removePrompt(player.storage.youchenmrfz, "biaodaomrfz_distance");
						delete player.storage.youchenmrfz;
					}
				},
				distance: {
					charlotte: true,
					forced: true,
					mod: {
						globalFrom(from, to, num) {
							const target = to?.storage?.youchenmrfz;
							if (target && from === target && typeof to.storage.biaodaomrfz === "number") {
								return num + to.storage.biaodaomrfz;
							}
						},
					},
				},
			},
		},

		//响石
		xuanshuimrfz: {
			audio: ["作战中1", "作战中2", "作战中3"],
			zhuanhuanji(player, skill) {
				if (!player.storage.xuanshuimrfz) {
					//@ts-ignore
					lib.skill.xuanshuimrfz.init(player, skill);
				}
				let storage = player.storage.xuanshuimrfz;
				if (storage.index >= 3) storage.index = 0;
				else storage.index += 1;
				lib.skill.xuanshuimrfz.updateSuit(player);
			},
			/**@param {Player} player  */
			updateSuit(player) {
				game.broadcastAll(player => {
					lib.translate[`xuanshuimrfz_bg`] = get.translation(lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0]);
					const ui = player.marks?.xuanshuimrfz?.querySelector(".background.skillmark");
					if (ui) {
						ui.innerHTML = lib.translate[`xuanshuimrfz_bg`];
					}
					//@ts-ignore
				}, player);
			},
			/**@param {Player} player  */
			getUsedSuit(player) {
				const used = [];
				const histroies = player.getHistory("useSkill", evt => evt.skill === "xuanshuimrfz");
				for (const history of histroies) {
					const event = history.event;
					/** @type {GameEvent} */
					//@ts-ignore
					const evt = event.getParent(2);
					if (Object.keys(evt).length > 0 && evt !== null && evt.card) {
						if (lib.skill.xuanshuimrfz.suitList.includes(get.suit(evt.card))) used.add(get.suit(evt.card));
					}
				}

				return used;
			},
			forced: true,
			init(player, skill) {
				player.storage[skill] = {
					index: 0,
					get used() {
						return lib.skill.xuanshuimrfz.getUsedSuit(player);
					},
				};
				lib.skill.xuanshuimrfz.updateSuit(player);
			},
			suitList: ["spade", "club", "heart", "diamond"],
			mark: true,
			intro: {
				content(storage, player) {
					return `·当前花色:${get.translation(lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0])}<br>·已使用花色:${get.translation(player.storage.xuanshuimrfz.used)}`;
				},
			},
			onremove: true,
			trigger: {
				player: "useCard1",
			},
			prompt(event) {
				//@ts-ignore
				const num = lib.skill.xuanshuimrfz.suitList.indexOf(get.suit(event.card)) || 0;
				return `【旋说】:是否摸${num + 1}张牌`;
			},
			filter(event, player) {
				return _status.currentPhase === player;
			},
			async content(event, trigger, player) {
				let used = player.storage.xuanshuimrfz.used;
				if (used.length >= 4) {
					player.disableSkill("xuanshuimrfz", ["xuanshuimrfz"]);
					player.when({ global: "phaseEnd" }).step(async (event, trigger, player) => {
						player.enableSkill("xuanshuimrfz");
					});
				}

				if (get.is.zhuanhuanji("xuanshuimrfz", player)) {
					const num = player.storage.xuanshuimrfz.index + 1 || 1;
					player.changeZhuanhuanji("xuanshuimrfz");
					player.draw(num);
				} else {
					const num = lib.skill.xuanshuimrfz.suitList.indexOf(get.suit(trigger.card));
					if (num !== -1) player.draw(num + 1);
					lib.skill.xuanshuimrfz.updateSuit(player);
				}
			},
			mod: {
				cardEnabled(card, player) {
					const suit = lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0];
					if (get.suit(card) !== suit && lib.skill.xuanshuimrfz.forced === true && _status.currentPhase === player) {
						return false;
					}
				},
				cardSavable(card, player) {
					const suit = lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0];
					if (get.suit(card) !== suit && lib.skill.xuanshuimrfz.forced === true && _status.currentPhase === player) {
						return false;
					}
				},
			},
		},
		pozemrfz: {
			audio: ["部署2", "进驻设施"],
			limited: true,
			enable: "phaseUse",
			usable: 1,
			onremove: true,
			filter(event, player) {
				const skills = player.getOriginalSkills().filter(skill => {
					const info = get.info(skill);
					return Object.keys(info).some(key => ["forced", "zhuanhuanji", "juexingji", "limited"].includes(key));
				});
				return player.storage.pozemrfz !== true && skills.length > 0;
			},
			async content(event, trigger, player) {
				player.awakenSkill("pozemrfz");

				const skills = player.getOriginalSkills().filter(skill => {
					const info = get.info(skill);
					//就这么多吧，其它的技能标签懒得加了
					return Object.keys(info).some(key => ["forced", "locked", "zhuanhuanji", "juexingji", "limited", "dutySkill"].includes(key));
				});
				const { index } = await player
					.chooseControl(skills.map(skill => get.translation(skill)))
					.set(
						"choiceList",
						skills.map(skill => `${get.translation(skill)}:${get.skillInfoTranslation(skill)}`)
					)
					.set("displayIndex", false)
					.set("prompt", `请选择你要删除标签的技能`)
					.set("ai", () => {
						//@ts-ignore
						const { skills, player } = get.event();
						if (!skills.includes("xuanshuimrfz")) return "pozemrfz";
						if (player.countCards("he", "zhuge") > 0 || player.countCards("h", card => get.type(card) === "equip" || get.type(card) === "trick") > 2) return "xuanshuimrfz";
						if (player.hp <= 1) return "xuanshuimrfz";
						return "pozemrfz";
					})
					.set("skills", skills)
					.forResult();
				if (typeof index === "number") {
					let num = 0;
					const skill = skills[index];
					let info = get.info(skill);
					tmpSave[`${player.playerid}_pozemrfz`] = { name: skill, info: { ...info } };

					const tags = ["forced", "locked", "zhuanhuanji", "juexingji", "limited", "dutySkill"];

					tags.forEach(tag => {
						if (info[tag]) {
							num++;
							if (tag === "limited") player.restoreSkill(skill);
							delete info[tag];
						}
					});

					if (num > 0) player.draw(num);

					player.when({ player: "phaseEnd", global: "phaseEnd" }).step(async (event, trigger, player) => {
						const save = tmpSave[`${player.playerid}_pozemrfz`];
						if (save && Object.keys(save).length > 0) {
							lib.skill[save.name] = save.info;
						}
					});
				}
			},
		},

		//摆渡人
		wenchoumrfz: {
			audio: ["作战中3", "作战中4", "作战中1", "作战中2"],
			trigger: {
				player: "phaseChange",
			},
			filter(event, player) {
				return player.countCards("he", card => player.canRecast(card)) > 0;
			},
			init(player, skill) {
				player.storage[skill] = 4;
			},
			onremove: true,
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard("he")
					.set("prompt", get.prompt("wenchoumrfz"))
					.set("prompt2", whichWayUtil.colorize(`你可以重铸一张牌,若你重铸的牌是：<br>①【杀】或武器牌：令包含你在内的至多两名角色将手牌调整至#r${player.storage.wenchoumrfz || 4}#并跳过此阶段；<br>②非伤害类基本牌：你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效，并令此技能中的红色数字-1。`))
					.set("ai", card => {
						const player = get.player(),
							num = player.storage.wenchoumrfz || 4,
							val = get.value(card);
						let res = 8 - val;
						if (get.subtype(card) === "equip1" || get.name(card) === "sha") {
							if (player.countCards("h") < num) res += 2;
							else res -= player.countCards("h") - num;

							if (game.hasPlayer(char => get.attitude2(char) > 0 && char.countCards("h") < num)) res += 2;
							if (game.hasPlayer(char => get.attitude2(char) < 0 && char.countCards("h") >= num)) res += 2;
						} else if (get.type(card) === "basic" && !get.tag(card, "damage")) {
							res -= 4 - num;
							let tmp_res = 0;
							for (const char of game.players) {
								tmp_res = Math.max(tmp_res, get.effect(char, { name: "sha" }, player, player));
							}
							res += tmp_res;
						}
						return res;
					})
					.set("filterCard", card => get.player().canRecast(card))
					.forResult();
			},
			async content(event, trigger, player) {
				const {
					cards: [card],
				} = event;
				if (!card) return;
				await player.recast(card);
				if (get.subtype(card) === "equip1" || get.name(card) === "sha") {
					//@ts-ignore
					player.skip(trigger.phaseList[trigger.num]);
					//@ts-ignore
					game.log(player, "跳过了", get.translation(trigger.phaseList[trigger.num]));
					const {
						//@ts-ignore
						targets: [target],
					} = await player
						.chooseTarget(true, [0, 1])
						.set("prompt", whichWayUtil.colorize(`【问丑】：请选择一名其他角色，令其和#r你#将手牌调整至${player.storage.wenchoumrfz || 4}`))
						.set("prompt2", whichWayUtil.colorize(`#s或许，旧时的恩怨已经结束了#`))
						.set("filterTarget", lib.filter.notMe)
						.set(
							"ai",
							/**@param {Player} target */ target => {
								const player = get.player();
								const num = player.storage.wenchoumrfz || 4;
								const att = get.attitude2(target) > 0 ? 1 : -1;
								return att * (num - target.countCards("h"));
							}
						)
						.forResult();
					if (!target) return;
					[target, player].sort(lib.sort.seat).forEach(i => adjust(i));
					/**@param {Player} target */
					function adjust(target) {
						const num = player.storage.wenchoumrfz || 4;
						//@ts-ignore
						if (target.countCards("h") < num) target.drawTo(num);
						else if (target.countCards("h") > num) {
							target
								.chooseToDiscard(target.countCards("h") - num, true)
								.set("ai", card => -get.value(card))
								.set("prompt", `【问仇】：将手牌调整至${num}张`)
								.set("prompt2", whichWayUtil.colorize(`#s化干戈为玉帛，也是需要代价的#`));
						}
					}
				}
				if (get.type(card) === "basic" && !get.tag(card, "damage")) {
					await player.chooseUseTarget({ name: "sha", isCard: true }).set("forced", true).set("addCount", false).set("nodistance", true).set("prompt", "你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效").set("prompt2", whichWayUtil.colorize(`#s血债血偿！#`));
					player.storage.wenchoumrfz--;
					player.disableSkill("wenchoumrfz", ["wenchoumrfz"]);
					player.when({ global: "phaseEnd" }).step(async (event, trigger, player) => {
						//@ts-ignore
						player.enableSkill("wenchoumrfz");
					});
				}
			},
		},

		//天空盒
		souchamrfz: {
			audio: ["任命队长", "行动开始"],
			trigger: {
				player: "damageEnd",
				source: "damageSource",
			},
			filter(event, player) {
				/** @type {Player} */
				const source = event.source;
				if (source === player) return event.player && event.player.isIn() && player.canCompare(event.player);
				return source && source.isIn() && player.canCompare(source);
			},
			prompt2(event) {
				//@ts-ignore
				return `你可以与${get.translation(get.player() === event.player ? event.player : event.source)}拼点,若你赢,你观看其手牌并获得其中一张牌`;
			},
			async content(event, trigger, player) {
				const target = trigger.source === player ? trigger.player : trigger.source;
				const result = await player
					//@ts-ignore
					.chooseToCompare(target)
					.set("prompt", `【搜查】：请选择一张手牌与${get.translation(target)}拼点`)
					.set("forced", true)
					.set("ai", card => {
						const player = get.player();
						let max;
						for (let card of player.getCards("h")) {
							if (!max) max = card;
							//@ts-ignore
							if (get.number(max) <= get.number(card)) max = get.value(card) > get.number(max) ? max : card;
						}
						return card === max ? 1 : 0;
					})
					.forResult();
				if (!result) return;
				if (result.winner === player) {
					player
						.gainPlayerCard(target, true, "h")
						.set("visible", true)
						.set("filterButton", () => true)
						.set("prompt", `获得${get.translation(target)}的一张手牌`);
				}
			},
		},
		tiankonghe_zhenlimrfz: {
			audio: ["作战中3", "作战中4"],
			trigger: {
				player: "compare",
				target: "compare",
			},
			usable: 1,
			filter(event, player) {
				//@ts-ignore
				if (event.player === player && event.num1 > event.num2) return false;
				//@ts-ignore
				if (event.player !== player && event.num1 < event.num2) return false;
				//@ts-ignore
				return !event.iwhile;
			},
			check(event) {
				let player = get.player();
				return game.hasPlayer(char => char !== player && get.effect(char, { name: "sha" }, player, player) > 0 && event.list.includes(char));
			},
			async content(event, trigger, player) {
				/** @type {Array<Player>} */
				//@ts-ignore
				const targets = trigger.list.filter(char => char !== player);
				const random = whichWayUtil.getRandomNumber();
				await player
					.chooseUseTarget({ name: "sha", isCard: true, storage: { tiankonghe_zhenlimrfz: random } })
					.set("forced", true)
					.set("addCount", false)
					.set("nodistance", true)
					.set("filterTarget", (card, player, target) => targets.includes(target))
					.set("prompt", `【真理】:对参与拼点的其他角色视为使用一张【杀】`);
				if (player.hasHistory("sourceDamage", evt => evt.card && evt.card?.storage.tiankonghe_zhenlimrfz === random)) {
					trigger[trigger.player === player ? "num1" : "num2"] += 1908;
					game.log(whichWayUtil.colorize(`#r天空管理局突击中#`));
					game.log(player, "的拼点牌点数+1908");
				}
			},
		},

		//雪猎
		queliemrfz: {
			audio: ["闲置", "行动出发"],
			trigger: {
				source: "damageSource",
			},
			filter(event, player) {
				return player.getHistory("sourceDamage", evt => evt !== event).length > 0 && event.player.isIn();
			},
			check(event) {
				return get.attitude(get.player(), event.player) > 0;
			},
			prompt2(event) {
				//@ts-ignore
				return `你可以令${get.translation(event.player)}回复${event.num}点体力？`;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				target.recover(trigger.num);
				//@ts-ignore
				target.markSkill("queliemrfz", {
					content: `下次获得牌后，${get.translation(player)}摸等量的牌`,
				});
				if (
					target.getSkills().filter(skill => {
						let info = get.info(skill);
						return info && info.queliemrfz_release;
					}).length < 1
				)
					target
						.when({ player: "gainAfter" })
						.step(async (event, trigger, playerx) => {
							if (player.isIn()) {
								player.draw(trigger.cards.length);
								//@ts-ignore
								player.logSkill("queliemrfz", playerx);
							}
							//@ts-ignore
							playerx.unmarkSkill("queliemrfz");
						})
						.assign({
							queliemrfz_release: true,
						});
			},
		},
		liexuemrfz: {
			audio: ["作战中1", "作战中4"],
			forced: true,
			trigger: {
				player: "useCardToPlayered",
			},
			/**
			 * @param { Player } player
			 * @param { Player } target
			 */
			getTargets(player, target) {
				if (target === player) return [];

				const clockwise = [],
					anticlockwise = [];
				let current;
				//优先逆时针找，再顺时针找，最后取角色最多的边，若相同则取逆时针的一边
				while (true) {
					if (current === target) break;
					else current = current ? current.getNext() : player.getNext();

					anticlockwise.push(current);
				}

				current = null;
				while (true) {
					if (current === target) break;
					else current = current ? current.getPrevious() : player.getPrevious();

					clockwise.push(current);
				}

				return clockwise.length > anticlockwise.length ? clockwise : anticlockwise;
			},
			filter(event, player) {
				return event.card.name === "sha" && event.targets && event.targets.length === 1 && lib.skill.liexuemrfz.getTargets(player, event.targets[0]).length > 0;
			},
			async content(event, trigger, player) {
				let targets = lib.skill.liexuemrfz.getTargets(player, trigger.targets[0]);
				trigger.targets.addArray(targets);
				//@ts-ignore
				player.line(targets);
			},
			group: ["liexuemrfz_direct"],
			subSkill: {
				direct: {
					silent: true,
					trigger: {
						player: "useCard",
						source: "damageBegin3",
					},
					filter(event, player) {
						const neighbour = [player.getPrevious(), player.getNext()];
						if (event.name === "damage") return event.card && event.card.name === "sha" && !event.numFixed && neighbour.includes(event.player);
						return event.card.name === "sha" && event.targets.some(t => neighbour.includes(t));
					},
					async content(event, trigger, player) {
						if (trigger.name === "damage") trigger.num += 1;
						else {
							//@ts-ignore
							trigger.directHit.addArray(
								game.filterPlayer(function (current) {
									return current != player && [player.getPrevious(), player.getNext()].includes(current);
								})
							);
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter(player, tag, arg) {
							return [player.getPrevious(), player.getNext()].includes(arg.target);
						},
					},
				},
			},
		},

		//哈蒂娅
		juetumrfz: {
			init(player, skill) {
				player.storage[skill] = {
					draw: 3,
					record: [],
				};
			},
			intro: {
				content(storage) {
					if (!storage) return `无信息`;
					return `·获胜过的点数：${storage.record.length > 0 ? storage.record.join("、") : "无"}`;
				},
			},
			mark: true,
			audio: ["作战中1", "作战中2"],
			enable: "phaseUse",
			usable: 1,
			filterTarget(card, target, player) {
				return player.canCompare(target, true);
			},
			async content(event, trigger, player) {
				const {
					targets: [target],
				} = event;
				await player.draw(player.storage.juetumrfz.draw);
				//@ts-ignore
				const result = await player.chooseToCompare().set("target", target).forResult();
				const { num1, winner } = result;
				if (winner === player && !player.storage.juetumrfz.record.includes(num1)) {
					player.storage.juetumrfz.record.add(num1);
					player.storage.juetumrfz.draw++;
					player.popup("数字+1");
				} else if (winner !== player) {
					if (player.storage.juetumrfz.draw > 1) player.storage.juetumrfz.draw--;
					player.popup("数字-1");
				}

				if (winner !== player) player.damage(target);
				if (winner !== target) target.damage(player);
			},
			ai: {
				order: 5,
				result: {
					target(player, target) {
						let att = get.attitude2(target);
						if (att > 0) return;
						return -1;
					},
				},
			},
		},

		//耶拉纲徳 耶拉 冈门
		shengshimrfz: {
			mod: {
				aiValue(player, card, num) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return num - 10;
				},
				cardUsable(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
				cardEnabled(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
				cardEnabled2(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
				cardSavable(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
			},
			audio: ["任命队长", "行动出发"],
			onremove(player, skill) {
				player.getCards("s", card => card.hasGaintag("shengshimrfz_pile")).forEach(i => i.delete());
				if (!player.playerid) return;
				tmpSave[player.playerid]["observer_shengshimrfz"].disconnect();
				tmpSave[player.playerid]["observer_shengshimrfz"].takeRecords();
				tmpSave[player.playerid]["observer_shengshimrfz"] = null;
			},
			init(player, skill) {
				lib.translate["shengshimrfz_pile"] = "牌堆顶";

				let recordCount;
				const observer = new MutationObserver(() => {
					if (player.isDead()) {
						//@ts-ignore
						lib.skill.shengshimrfz.onremove(player, skill);
						return;
					}
					let currentCount = ui.cardPile.childNodes.length;
					if (currentCount !== recordCount) {
						recordCount = currentCount;

						let pileCards = player.getCards("s", card => card.hasGaintag("shengshimrfz_pile"));
						pileCards.forEach(card => card.delete());

						let cards = get.cards(4, true);
						//@ts-ignore
						let copy_cards = cards.map(card => {
							let copy_card = ui.create.card();
							//@ts-ignore
							copy_card.init(get.cardInfo(card));
							//@ts-ignore
							copy_card._cardid = card.cardid;
							//@ts-ignore
							copy_card._destroy = true;
							return copy_card;
						});
						for (let i = 0; i < copy_cards.length; i++) {
							/** @type { Card } */
							let card = copy_cards[i];
							whichWayTips.addPrompt(card, `第${i + 1}张`, "shengshimrfz_pile");
							skillCustomFunc.invisableJiZhan(card, player);
						}
						player.directgains(copy_cards, null, "shengshimrfz_pile");
					}
				});

				observer.observe(ui.cardPile, {
					childList: true,
					subtree: false,
				});

				if (player.playerid) {
					tmpSave[player.playerid] ??= {};
					tmpSave[player.playerid]["observer_shengshimrfz"] = observer;
				}
			},
			trigger: {
				player: "chooseToDiscardBegin",
			},
			forced: true,
			async content(event, trigger, player) {
				if (typeof trigger.position === "string") trigger.position += "s";
				else trigger.position = "hs";
			},
			group: ["shengshimrfz_replace"],
			subSkill: {
				replace: {
					audio: false,
					silent: true,
					charlotte: true,
					trigger: { player: "chooseToDiscardEnd" },
					filter(event, player) {
						if (!event.result?.cards) return false;
						//@ts-ignore
						let cardsid = get.cards(4, true).map(i => i.cardid);
						//@ts-ignore
						return event.result.cards.some(card => cardsid.includes(card._cardid));
					},
					async content(event, trigger, player) {
						//@ts-ignore
						let cardsid = get.cards(4, true).map(i => i.cardid);

						//@ts-ignore
						trigger.result.cards = trigger.result.cards.map(card => {
							//@ts-ignore
							if (!cardsid.includes(card._cardid)) return card;
							//@ts-ignore
							return get.cards(4, true).find(cardx => cardx.cardid === card._cardid);
						});
						//@ts-ignore
						trigger.done = game.cardsDiscard(trigger.result.cards);
					},
				},
			},
		},
		xueweimrfz: {
			audio: ["作战中3", "作战中4"],
			enable: "phaseUse",
			usable: 1,
			getSelect(player) {
				let evts = player.getHistory("useCard", evt => evt.card.name === "huogong");
				if (evts.length < 1) return 3;
				let evt = evts[evts.length - 1];
				let card = evt.card,
					num = 0,
					/** @type { Array<Player> } */
					targets = evt.targets;
				for (let target of targets) {
					let historys = target.getHistory("damage", evtx => evtx.card === card);
					if (historys.length > 0) num += historys.length;
				}
				return num;
			},
			filter(event, player) {
				let num = lib.skill.xueweimrfz.getSelect(player);
				return player.countCards("h") > 0 && player.hasUseTarget("huogong") && num > 0;
			},
			filterCard: true,
			lose: false,
			discard: false,
			filterTarget(card, player, target) {
				return player.canUse("huogong", target) === true;
			},
			selectTarget() {
				let player = get.player();
				let num = lib.skill.xueweimrfz.getSelect(player);
				return [1, num];
			},
			multitarget: true,
			multiline: true,
			check(card) {
				return 8 - get.value(card);
			},
			async content(event, trigger, player) {
				await player
					.chooseUseTarget({ name: "huogong", xueweimrfz: true }, event.cards, event.targets)
					//@ts-ignore
					.set("filterTarget", (card, player, target) => get.event().targetx.includes(target))
					.set("selectTarget", event.targets.length)
					.set("forced", true)
					.set("targetx", event.targets);
				//@ts-ignore
				if (!lib.skill.xueweimrfz.filter(trigger, player)) return;
				const result = await player
					.chooseCardTarget({
						prompt: `是否将一张手牌当【火攻】（目标数:${lib.skill.xueweimrfz.getSelect(player)}）使用？`,
						filterCard: true,
						filterTarget: lib.skill.xueweimrfz.filterTarget,
						selectTarget: lib.skill.xueweimrfz.selectTarget,
						ai1: card => 8 - get.value(card),
						ai2: target => {
							let player = get.player();
							return get.damageEffect(target, player, player, "ice");
						},
					})
					.forResult();
				if (result.bool !== true) return;
				//@ts-ignore
				await lib.skill.xueweimrfz.content(
					//@ts-ignore
					{
						...event,
						//@ts-ignore
						cards: result.cards,
						//@ts-ignore
						targets: result.targets,
					},
					trigger,
					player
				);
			},
			group: "xueweimrfz_ice",
			subSkill: {
				ice: {
					charlotte: true,
					silent: true,
					audio: false,
					trigger: { source: "damageBegin" },
					filter(event, player) {
						//@ts-ignore
						return event.card && event.card.xueweimrfz;
					},
					async content(event, trigger, player) {
						trigger.nature = "ice";
					},
				},
			},
			ai: {
				order: 1,
				result: {
					target(player, target) {
						let val = get.damageEffect(target, player, player, "ice");
						if (val > 0) return -val;
					},
				},
			},
		},

		//折桠
		mingzhongmrfz: {
			audio: ["任命队长", "行动出发"],
			derivation: ["shijingmrfz"],
			round: 1,
			trigger: {
				global: "useCard2",
			},
			filter(event, player) {
				return event.targets && event.targets.includes(player) && event.player !== player;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseBool()
					.set("prompt", get.prompt("mingzhongmrfz"))
					.set("prompt2", `是否将此牌的类型（${get.translation(get.type2(trigger.card))}）标记为“警”获得'示警'直到本轮结束？`)
					.set("ai", () => {
						let player = get.player();
						let event = get.event();
						return get.type2(event.card, player) === "equip";
					})
					.forResult();
			},
			async content(event, trigger, player) {
				player.addTempSkill("shijingmrfz", { global: "roundStart" });
				if (player.storage.shijingmrfz) player.storage.shijingmrfz = [];
				player.storage.shijingmrfz.add(get.type2(trigger.card));
			},
		},
		shijingmrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			mark: true,
			marktext: "警",
			intro: {
				name: "警",
				content(stroage) {
					if (!Array.isArray(stroage)) return `没有“警”`;
					return `·成为${get.translation(stroage)}牌的目标后摸一张牌<br>·<span class="text" style="font-family: yuanli;color:red">钟声来过，钟声记得。</span>`;
				},
			},
			audio: ["行动开始"],
			onremove: true,
			trigger: {
				target: "useCardToTargeted",
			},
			filter(event, player) {
				/**@type {Array} */
				let types = player.getStorage("shijingmrfz");
				return types.includes(get.type2(event.card));
			},
			forced: true,
			async content(event, trigger, player) {
				await player.draw();
				const { targets } = await player
					.chooseTarget()
					.set("prompt", "你令至多一名没有“示警”的角色获得“示警”直到本轮结束")
					.set("selectTarget", [0, 1])
					.set("filterTarget", (card, player, target) => {
						return !target.hasSkill("shijingmrfz");
					})
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
				if (Array.isArray(targets) && targets.length > 0) {
					let target = targets[0];
					target.addTempSkill("shijingmrfz", { global: "roundStart" });
					if (target.storage.shijingmrfz) target.storage.shijingmrfz = [];
					target.storage.shijingmrfz.addArray(player.storage.shijingmrfz);
				}
			},
		},
		zhiyanmrfz: {
			audio: ["选中干员1", "选中干员2"],
			trigger: {
				player: "useCardAfter",
				global: "phaseChange",
			},
			forced: true,
			init(player, skill) {
				player.storage[skill] = [];
			},
			mark: true,
			onremove: true,
			intro: {
				content(storage) {
					if (!Array.isArray(storage) || storage.length < 1) return `没有需要额外结算的牌`;
					return storage.map(info => `·对${get.translation(info[0])}使用${get.translation(info[1])}`).join("<br>");
				},
			},
			filter(event, player) {
				return (event.name === "useCard" && event.targets && event.targets.length > 0 && event.card && ["basic", "trick"].includes(get.type(event.card))) || (event.name !== "useCard" && Array.isArray(player.storage.zhiyanmrfz) && player.storage.zhiyanmrfz.length > 0);
			},
			async content(event, trigger, player) {
				if (trigger.name === "useCard") {
					if (!Array.isArray(player.storage.zhiyanmrfz)) player.storage.zhiyanmrfz = [];
					player.storage.zhiyanmrfz.push([trigger.targets, trigger.card]);
				} else {
					let infos = (player.storage.zhiyanmrfz || []).slice();

					for (let info of infos) {
						let [targets, card] = info;
						targets.forEach(target => {
							//@ts-ignore
							if (!player.canUse(card, target, true, false)) info[0].remove(target);
						});
						await player.useCard(card, targets, false);
					}

					player.storage.zhiyanmrfz = [];
				}
			},
			group: ["zhiyanmrfz_respond"],
			subSkill: {
				respond: {
					audio: "zhiyanmrfz",
					forced: true,
					trigger: {
						player: "chooseToRespondBegin",
					},
					async content(event, trigger, player) {
						const { bool } = await player
							.chooseToDiscard()
							.set("prompt", `你需要弃置一张牌，否则无法打出牌`)
							.set("ai", card => {
								//@ts-ignore
								let trigger = get.event().triggerx;
								let player = get.player();
								//@ts-ignore
								let respond = get.canRespond(trigger.respondTo[1], player);
								//@ts-ignore
								let respondNum = player.countCards("h", card => !respond.includes(get.name(card)));
								if (respondNum < 1) return -114514;
								//@ts-ignore
								if (respond.includes(get.name(card))) return 4 - get.value(card);
								if (player.hp < 2) return 10 - get.value(card);
								return 6 - get.value(card);
							})
							.set("triggerx", trigger)
							.forResult();
						if (bool !== true) {
							trigger.result = {
								bool: false,
								confirm: "cancel",
							};
							trigger.cancel(undefined, undefined, true);
						}
					},
				},
			},
		},
		hanshengmrfz: {
			audio: ["作战中1", "作战中2"],
			enable: ["chooseToUse", "chooseToRespond"],
			/**@param {Player} player  */
			getSkillCount(player) {
				return player.getAllHistory("useSkill", evt => {
					return evt.skill === "hanshengmrfz";
				}).length;
			},
			filter(event, player) {
				return game.hasPlayer(char => char.countCards("he") >= this.getSkillCount(player) + 1 && char !== player) && event.filterCard({ name: "tao" }, player, event);
			},
			filterTarget(card, player, target) {
				return target !== player && target.countCards("he") >= lib.skill.hanshengmrfz.getSkillCount(player);
			},
			hiddenCard(player, name) {
				if (!game.hasPlayer(char => char.countCards("he") >= lib.skill.hanshengmrfz.getSkillCount(player) && char !== player)) return false;
				return name === "tao";
			},
			async content(event, trigger, player) {
				const num = lib.skill.hanshengmrfz.getSkillCount(player);
				const {
					targets: [target],
				} = event;
				const { cards } = await target
					.chooseCard()
					.set("prompt", `你可以交给${get.translation(player)}${get.cnNumber(num)}张牌，然后其视为使用一张【桃】`)
					.set("filterCard", () => true)
					.set("selectCard", num)
					.set("ai", card => {
						let event = get.event;
						//@ts-ignore
						if (event.att < 0) return -114514;
						return event.name === "dying" ? 10 - get.value(card) : 6 - get.value(card);
					})
					.set("att", get.attitude(target, player))
					.forResult();
				if (cards && cards.length > 0) {
					await target.give(cards, player, true);
					player.chooseUseTarget({ name: "tao", isCard: true }).set("forced", true);
				} else {
					player.disableSkill("hanshengmrfz", ["hanshengmrfz"]);
					player.when({ global: "phaseEnd" }).then(() => {
						player.enableSkill("hanshengmrfz");
					});
				}
			},
			ai: {
				order: 1,
				result: {
					target(player, target) {
						if (get.attitude(player, target) < 0) return;
						return target.countCards("he");
					},
				},
			},
		},

		//风丸
		zhiyimrfz: {
			audio: ["作战中2", "作战中3", "作战中4"],
			trigger: {
				global: "roundStart",
			},
			forced: true,
			filter(event, player) {
				return player.countCards("h") > 0 && player.countEnabledSlot() > 0;
			},
			async content(event, trigger, player) {
				const { cards } = await player.chooseCard("h", true).set("prompt", `你展示一张手牌，然后令“纸偶”随机获得技能描述中包含此牌牌名的技能`).forResult();
				if (!cards) return;
				const card = cards[0];
				//@ts-ignore
				player.showCards(card);
				const manager = lib.skill.zhiyimrfz.cardManager;
				let skill = await manager.getSkill(card, player);
				if (skill === undefined) {
					player.chat(`没有技能描述中存在【${get.translation(get.name(card))}】！`);
					return;
				}
				let subtype = get.rand(1, 5);
				manager.addSlot(player, subtype);

				if (!lib.card[`zhiyimrfz_card_${skill}`]) {
					game.broadcastAll(
						//@ts-ignore
						function (skill, subtype, manager) {
							manager.createCard(skill, subtype);
						},
						skill,
						//@ts-ignore
						subtype,
						manager
					);
				}

				let equip = game.createCard(`zhiyimrfz_card_${skill}`, "none", "none");

				player.$gain2(equip);
				game.delayx();
				player.equip(equip);
			},
			cardManager: {
				cache: {},
				addSlot(player, subtype) {
					if (typeof subtype === "number") subtype = `equip${subtype}`;
					game.broadcastAll(
						//@ts-ignore
						function (player, subtype) {
							if (typeof player.expandedSlots[subtype] !== "number") player.expandedSlots[subtype] = 0;
							player.expandedSlots[subtype]++;
						},
						player,
						subtype
					);
				},
				loseSlot(player, subtype) {
					if (typeof subtype === "number") subtype = `equip${subtype}`;
					game.broadcastAll(
						//@ts-ignore
						function (player, subtype) {
							if (typeof player.expandedSlots[subtype] !== "number" || player.expandedSlots[subtype] === 0) return;
							player.expandedSlots[subtype]--;
						},
						player,
						subtype
					);
				},
				updateCard(name, hp) {
					let info = lib.card[name];
					info.characterManager.maxHp = hp[1];
					info.characterManager.hp = hp[0];
				},
				createCard(skills, subtype, charName, hp) {
					skills = Array.isArray(skills) ? skills : [skills];
					let name = `zhiyimrfz_card_${skills.join("_")}`;

					if (!charName) charName = "fengwan_zhioumrfz";
					const character = get.character(charName);
					let characterName = charName !== "fengwan_zhioumrfz" ? charName : `${charName}_${skills.join("_")}`;

					if (!lib.character[characterName]) {
						//@ts-ignore
						lib.character[characterName] = {
							...character,
							maxHp: Array.isArray(hp) ? hp[1] : 2,
							hp: Array.isArray(hp) ? hp[0] : 1,
							skills: [...skills],
						};
						lib.translate[characterName] = `纸偶·${skills.map(i => get.translation(i)).join("-")}`;
					}

					let card = {
						characterManager: {
							name: characterName,
							maxHp: Array.isArray(hp) ? hp[1] : 2,
							hp: Array.isArray(hp) ? hp[0] : 1,
							group: character.group,
							skills: [...skills],
							isCharacter: !charName.startsWith("fengwan_zhioumrfz"),
						},
						fullimage: true,
						image: "character:fengwan_zhioumrfz",
						type: "equip",
						subtype: `equip${subtype}`,
						enable: true,
						selectTarget: -1,
						filterTarget(card, player, target) {
							if (player != target) {
								return false;
							}
							return target.canEquip(card, true);
						},
						modTarget: true,
						allowMultiple: false,
						content: lib.element.content.equipCard,
						toself: true,
						ai: {
							// @ts-ignore
							equipValue(card, player) {
								return player.hasSkill("zhiyimrfz") ? 1.2 : 1.6;
							},
						},
						skills: ["zhiyimrfz_destroy", ...skills],
					};
					if (card.subtype === "equip1") {
						card.distance = { attackFrom: -2 };
					} else if (card.subtype === "equip4") {
						card.distance = { globalFrom: -1 };
					} else if (card.subtype === "equip3") {
						card.distance = { globalTo: 1 };
					}
					let node = ui.create.buttonPresets.character(characterName, "character", null, false);
					node.style.width = "100%";
					let hpNode = node.querySelector(".hp .text");
					//@ts-ignore
					hpNode.innerHTML = Array.isArray(hp) ? hp.join("/") : "1/2";
					lib.translate[`${name}_info`] = `锁定技，你视为拥有技能${skills.map(s => "〖" + get.translation(s) + "〗").join("、")}，此牌不因【化影】而离开你的装备区后，销毁之。<br>` + node.outerHTML + "<br>";
					let append = "";
					for (var skill of skills) {
						if (lib.skill[skill].nobracket) {
							append += '<div class="skilln">' + get.translation(skill) + '</div><div><span style="font-family: yuanli">' + get.plainText(get.skillInfoTranslation(skill)) + "</span></div><br><br>";
						} else {
							var translation = lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2);
							append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.plainText(get.skillInfoTranslation(skill)) + "</span></div><br><br>";
						}
					}

					lib.translate[`${name}_append`] = append;
					lib.card[name] = card;
					lib.translate[name] = card.characterManager.isCharacter ? get.translation(card.characterManager.name) : `纸偶·${skills.map(i => get.translation(i)).join("-")}`;
				},
				async change(player, card) {
					let characterManager = { ...get.info(card).characterManager };
					const expandedSlots = { ...player.expandedSlots };
					await player.reinitCharacter(player.name, characterManager.name);
					player.expandedSlots = expandedSlots;
					player.hp = characterManager.hp;
					player.maxHp = characterManager.maxHp;
					player.update();
					player.zhiyimrfz_linkCard = get.name(card);

					this.loseSlot(player, get.subtype(card));

					if (player.hp <= 0) {
						player.dying();
					}
				},
				async getSkill(card, player) {
					const cache = this.cache;
					let name = get.name(card);
					if (!name) return;
					if (cache[name]) {
						return cache[name].filter(i => !player.getSkills().includes(i) && !lib.skill[i].charlotte).randomGet();
					}
					let list = [];
					for (let skill in lib.skill) {
						let info = lib.skill[skill];
						if (info.charlotte || info.equipSkill || info.zhuSkill) continue;
						let intro = get.skillInfoTranslation(skill);
						if (intro && intro.includes(`【${get.translation(name)}】`)) list.add(skill);
					}
					game.broadcastAll(
						//@ts-ignore
						function (list, name) {
							lib.skill.zhiyimrfz.cardManager.cache[name] = list;
						},
						list,
						//@ts-ignore
						name
					);
					return await this.getSkill(card, player);
				},
			},
			subSkill: {
				destroy: {
					trigger: {
						player: "loseBegin",
					},
					equipSkill: true,
					forceDie: true,
					charlotte: true,
					forced: true,
					popup: false,
					// @ts-ignore
					filter(event, player) {
						return event.cards.some(card => card.name.indexOf("zhiyimrfz_card_") === 0);
					},
					// @ts-ignore
					async content(event, trigger, player) {
						const manager = lib.skill.zhiyimrfz.cardManager;
						for (let card of trigger.cards) {
							if (card.name.indexOf("zhiyimrfz_card_") === 0) {
								if (Object.keys(trigger.getParent("huayingmrfz") || {}).length > 0) {
									//@ts-ignore
									card._destroy = true;
									//@ts-ignore
									trigger.zhiyimrfz_trigger = true;
									player.addTempSkill("zhiyimrfz_destroy2");
								}
								let subtype = get.subtype(card);
								manager.loseSlot(player, subtype);
							}
						}
					},
				},
				destroy2: {
					trigger: {
						player: "loseAfter",
					},
					equipSkill: true,
					forceDie: true,
					charlotte: true,
					forced: true,
					popup: false,
					filter(event, player) {
						//@ts-ignore
						return event.cards.some(card => card.name.indexOf("zhiyimrfz_card_") === 0) && event.zhiyimrfz_trigger === true;
					},
					async content(event, trigger, player) {
						const manager = lib.skill.zhiyimrfz.cardManager;
						for (let card of trigger.cards) {
							if (card.name.indexOf("zhiyimrfz_card_") !== 0) continue;
							let info = get.info(card);
							//@ts-ignore
							let name = player.zhiyimrfz_linkCard;
							if (info.characterManager?.isCharacter) {
								if (name) {
									if (!lib.card[name]) {
										game.broadcastAll(
											//@ts-ignore
											function (skill, subtype, manager) {
												manager.createCard(skill, subtype);
											},
											//@ts-ignore
											player.getOriginalSkills(),
											get.rand(1, 5),
											manager
										);
									}
									let cardx = game.createCard(name, "none", "none");
									manager.addSlot(player, get.subtype(cardx));
									player.equip(cardx);
								}
								await manager.change(player, card);
							}
						}
					},
				},
			},
		},
		huayingmrfz: {
			audio: ["选中干员2", "部署2"],
			trigger: {
				player: "dying",
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("e", card => card.name.indexOf("zhiyimrfz_card_") === 0) > 0;
			},
			// @ts-ignore
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard("e")
					.set("prompt", get.prompt("huayingmrfz"))
					.set("prompt2", `你可以切换一个“纸偶”和你当前的武将牌`)
					.set("filterCard", card => card.name.indexOf("zhiyimrfz_card_") === 0)
					.set("ai", card => get.value(card) < 4)
					.forResult();
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let manager = lib.skill.zhiyimrfz.cardManager;
				let equip = event.cards[0];
				let subtype = get.rand(1, 5);

				let skills = player.getOriginalSkills();

				if (!lib.card[`zhiyimrfz_card_${skills.join("_")}`]) {
					game.broadcastAll(
						//@ts-ignore
						function (skill, subtype, manager, name, hp) {
							manager.createCard(skill, subtype, name, hp);
						},
						//@ts-ignore
						skills,
						subtype,
						manager,
						get.name(player),
						[player.hp, player.maxHp]
					);
				}

				let card = game.createCard(`zhiyimrfz_card_${skills.join("_")}`, "none", "none");
				let info = get.info(card);
				game.broadcastAll(
					//@ts-ignore
					function (manager, name, hp) {
						manager.updateCard(name, hp);
					},
					manager,
					//@ts-ignore
					get.name(card),
					[player.hp, player.maxHp]
				);
				//@ts-ignore
				equip._destroy = true;
				//@ts-ignore
				player.loseToDiscardpile(equip).log = false;
				await manager.change(player, equip);
				manager.addSlot(player, subtype);
				if (info?.characterManager) {
					let characterManager = info.characterManager;
					if (!characterManager.isCharacter && (characterManager.hp === 0 || characterManager.maxHp === 0)) {
						game.log(`#y${get.translation(info.characterManager.name)}`, "被销毁了");
						return;
					}
				}
				player.equip(card);
			},
		},

		//inna 双月
		guiyingmrfz: {
			audio: ["晋升后交谈1", "行动出发"],
			trigger: {
				player: ["chooseToUseAfter", "chooseToRespondAfter"],
				global: "_wuxieAfter",
			},
			filter(event, player) {
				if (event.name === "chooseToUse" && event.type === "wuxie") {
					return false;
				}
				if (event.name === "_wuxie") {
					//@ts-ignore
					if (event.wuxieresult && event.wuxieresult === player) {
						return false;
					}
					//@ts-ignore
					if (event._info_map.player === player) {
						return false;
					}
					return true;
				}
				//@ts-ignore
				return event.respondTo && event.respondTo[0] !== player && !event.result.bool;
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				//@ts-ignore
				let triggerCard = trigger.name === "_wuxie" ? trigger._info_map.card : trigger.respondTo[1];
				let canRespond = get.canRespond(triggerCard, player);
				if (trigger.name === "_wuxie") canRespond.add("wuxie");

				canRespond = canRespond.filter(
					name =>
						!player
							.getCards("h")
							.map(i => get.name(i))
							.includes(name)
				);

				//@ts-ignore
				if (canRespond.length < 1) player.draw().log = false;
				else {
					let cards = canRespond.map(function (card) {
						return get.cardPile(card);
					});
					//@ts-ignore
					if (cards.length < 1) player.draw().log = false;
					else {
						const result = await player
							.chooseCardButton("【诡影】:请选择你要获得的牌<br>选择‘取消’则模一张牌", cards)
							.set("ai", card => get.value(card) > 8)
							.forResult();
						if (result.bool === false) {
							//@ts-ignore
							player.draw().log = false;
						} else {
							//@ts-ignore
							player.gain(result.links[0]).log = false;
						}
					}
				}
				game.log(player, "从牌堆中获得了一张牌");
			},
		},
		sheguomrfz: {
			audio: ["交谈2", "交谈1"],
			trigger: {
				player: "damageEnd",
			},
			filter(event, player) {
				if (!event.card) return false;
				let canRespond = get.canRespond(event.card, player).concat(get.canRespond(get.type2(event.card)));
				return player.countCards("h", card => canRespond.includes(get.name(card) || "")) > 0;
			},
			async cost(event, trigger, player) {
				const result = await player
					.chooseControl("cancel2")
					.set("choiceList", [`视为对${trigger.source && trigger.source.isIn() ? get.translation(trigger.source) : "上天（不存在伤害来源）"}使用一张【杀】`, "回复一点体力、摸两张牌且此技能本回合失效"])
					.set("ai", () => {
						let { source, player } = get.event();
						if (!source || !source.isIn() || player.hp < 2) return 1;
						return 0;
					})
					.set("source", trigger.source)
					.forResult();
				event.result = {
					...result,
					cost_data: {
						index: result.index,
					},
				};
			},
			async content(event, trigger, player) {
				const index = event.cost_data.index;
				if (index === 0 && trigger.source && trigger.source.isIn() && player.canUse("sha", trigger.source, false, false)) {
					player
						.chooseUseTarget({ name: "sha" })
						// @ts-ignore
						.set("filterTarget", (card, player, target) => target === get.event().source)
						.set("forced", true)
						.set("nodistance", true)
						.set("addCount", false)
						.set("source", trigger.source);
				} else if (index === 1) {
					player.draw(2);
					player.recover();
					player.disableSkill("sheguomrfz_disable", ["sheguomrfz"]);
					player.when({ global: "phaseEnd" }).then(() => {
						player.enableSkill("sheguomrfz_disable");
					});
				}
			},
		},

		//八幡海铃
		chendiemrfz: {
			audio: 2,
			trigger: { player: "useCardBegin" },
			filter(event, player) {
				let num = lib.skill.wuweimrfz.getNum(player, "chendiemrfz");
				//@ts-ignore
				if (event.noTrigger_chendiemrfz) return false;
				return player.getHistory("useCard").length < num + 2 && player.isPhaseUsing();
			},
			forced: true,
			mark: true,
			intro: {
				content(_, player) {
					if (!player.isPhaseUsing()) return `不是你的出牌阶段`;
					return `已使用的牌数/上限：${player.getHistory("useCard").length}/${lib.skill.wuweimrfz.getNum(player, "chendiemrfz") + 2}`;
				},
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let cards = trigger.cards;
				await player.recast(trigger.cards, () => {});

				let cardsTags = cards.map(card => card.gaintag).flat();
				if (cardsTags) {
					cardsTags.forEach(tag => player.addGaintag(player.getCards("h"), tag));
				}
			},
		},
		umiri_chenxianmrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "gainAfter",
			},
			// @ts-ignore
			init(player) {
				//@ts-ignore
				game.broadcastAll(() => {
					lib.translate["umiri_chenxianmrfz_yingbian"] = "无视条件";
					Array.from(lib.yingbian.effect.keys()).forEach(tag => (lib.translate[`yingbian_${tag}`] = lib.translate[`yingbian_${tag}_tag`]));
				});
			},
			// @ts-ignore
			filter(event, player) {
				//@ts-ignore
				return player === _status.currentPhase;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let effTag = Array.from(lib.yingbian.effect.keys()).map(tag => `yingbian_${tag}`);
				trigger.cards.forEach(card => {
					card.addGaintag("umiri_chenxianmrfz_yingbian");
					if (!get.is.yingbian(card)) {
						let num = lib.skill.wuweimrfz.getNum(player, "umiri_chenxianmrfz") + 1;
						for (let i = 0; i < num; i++) {
							card.addGaintag(effTag.randomGet());
						}
					}
				});
			},
			group: "umiri_chenxianmrfz_yingbian",
			subSkill: {
				yingbian: {
					trigger: {
						player: "yingbian",
					},
					forced: true,
					//@ts-ignore
					filter: (event, player) => event.card.isCard && player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("umiri_chenxianmrfz_yingbian"))),
					// @ts-ignore
					async content(event, trigger, player) {
						let tags;
						//@ts-ignore
						player.getHistory("lose", evt => {
							if (evt.getParent() !== trigger) return;
							//@ts-ignore
							const maps = evt.gaintag_map;
							for (let key in maps) {
								if (maps[key].join(" ").includes("yingbian_")) tags = maps[key];
							}
						});
						//@ts-ignore
						if (!Array.isArray(trigger.temporaryYingbian)) {
							//@ts-ignore
							trigger.temporaryYingbian = [];
						}
						//@ts-ignore
						trigger.temporaryYingbian.add("force");
						//@ts-ignore
						for (let tag of tags) {
							if (tag.startsWith("yingbian_")) {
								//@ts-ignore
								trigger.temporaryYingbian.add(tag.slice(9));
							}
						}
					},
				},
			},
		},

		//三角初华
		weimianmrfz: {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				return ["basic", "trick"].includes(get.type(event.card)) && player.countCards("he", card => player.canRecast(card)) > 0;
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				let num = lib.skill.wuweimrfz.getNum(player, "weimianmrfz");
				let centralArea = get.discarded().slice();
				//@ts-ignore
				let max = centralArea.length > 0 ? Math.max(...centralArea.map(card => get.number(card))) : 0;

				const { cards } = await player
					.chooseCard("he", true)
					.set("prompt", `【伪面】:请重铸一张牌,然后若重铸的牌的点数为${get.poptip("sjzx_centralArea")}的牌中点数最大的，你摸${2 * num}张牌。`)
					.set("prompt2", `${get.poptip("sjzx_centralArea")}点数最大的牌：${max}`)
					.set("filterCard", card => player.canRecast(card))
					.set("ai", card => -get.value(card))
					.forResult();
				if (!cards) return;
				let card = cards[0];
				if (card) await player.recast(card);
				//@ts-ignore
				if (get.number(card) > max && num > 0) await player.draw(2 * num);
			},
		},
		weiquanmrfz: {
			audio: 2,
			trigger: {
				player: "damageBegin3",
			},
			forced: true,
			// @ts-ignore
			filter(event, player) {
				return !!event.card;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let num = lib.skill.wuweimrfz.getNum(player, "weiquanmrfz");
				//@ts-ignore
				if (get.number(trigger.card) > 3 * num) trigger.num++;
				else num--;
			},
		},

		//佑天寺若麦 祐天寺若麦
		leigumrfz: {
			audio: 4,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				// @ts-ignore
				if (!event.leigumrfz || !event.leigumrfz[player.playerid]) {
					return false;
				}
				// @ts-ignore
				return event.leigumrfz[player.playerid].some(value => value === true);
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				// @ts-ignore
				if (trigger.leigumrfz[player.playerid][0] === true) await player.draw();
				// @ts-ignore
				if (trigger.leigumrfz[player.playerid][1] === true) {
					const { cards } = await player
						.chooseCard("he")
						.set("prompt", `你可以重铸一张牌`)
						.set("filterCard", card => player.canRecast(card))
						.set("ai", card => 7 - get.value(card))
						.forResult();
					if (cards) await player.recast(cards);
				}
				const num = lib.skill.wuweimrfz.getNum(player, "leigumrfz");
				if (num > 0) {
					player.markSkill("leigumrfz_eff");
					player.storage.leigumrfz_eff = Math.max(player.storage.leigumrfz_eff || 0, num);
					player.addTempSkill("leigumrfz_eff", { global: ["phaseEnd", "roundStart"] });
				}
			},
			group: ["leigumrfz_mark"],
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					onremove: true,
					intro: {
						content(storage) {
							return `本回合所有牌的使用次数+${storage}`;
						},
					},
					mod: {
						// @ts-ignore
						cardUsable(card, player, num) {
							if (typeof num === "number") return (num += player.storage.leigumrfz_eff || 0);
						},
					},
				},
				mark: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "useCardBegin",
					},
					filter(event, player) {
						const cards = player.getCards("h");
						if (!cards.length) {
							return false;
						}
						return (event.cards || []).some(card => cards[0] === card || cards[cards.length - 1] === card);
					},
					// @ts-ignore
					async content(event, trigger, player) {
						const cards = player.getCards("h");
						// @ts-ignore
						if (!trigger.leigumrfz) {
							// @ts-ignore
							trigger.leigumrfz = {};
						}
						// @ts-ignore
						trigger.leigumrfz[player.playerid] = [trigger.cards.some(card => cards[0] === card), trigger.cards.some(card => cards[cards.length - 1] === card)];
					},
				},
			},
			mod: {
				aiOrder(player, card, num) {
					if (typeof card == "object") {
						const cards = player.getCards("h");
						if (cards.indexOf(card) === 0) return num + 10;
						if (cards.indexOf(card) === cards.length - 1) return num + 9;
					}
				},
			},
			ai: {
				noSortCard: true,
			},
		},
		jiaoyingmrfz: {
			audio: 2,
			trigger: {
				player: ["phaseUseBegin", "phaseUseEnd"],
			},
			// @ts-ignore
			filter(event, player) {
				const num = lib.skill.wuweimrfz.getNum(player, "jiaoyingmrfz");
				return player.countCards("he") > 0 && num > 0;
			},
			// @ts-ignore
			async cost(event, trigger, player) {
				const num = lib.skill.wuweimrfz.getNum(player, "jiaoyingmrfz");
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("jiaoyingmrfz"))
					.set("prompt2", `你可以${get.poptip("sjzx_zhiheng")}${num}`)
					.set("ai", card => 8 - get.value(card))
					.set("selectCard", () => {
						return [1, get.event().num];
					})
					.set("num", num)
					.forResult();
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player.discard(event.cards);
				player.draw(event.cards.length);
			},
		},

		//若叶睦
		lingwomrfz: {
			audio: 2,
			trigger: {
				player: "dying",
			},
			forced: true,
			// @ts-ignore
			filter(event, player) {
				return (
					player.countCards("he", card => {
						return game.hasPlayer(target => target.canEquip(card) || get.type(card) !== "equip");
					}) > 0
				);
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const num = lib.skill.wuweimrfz.getNum(player, event.name);
				const result = await player
					.chooseCardTarget({
						forced: true,
						prompt: `你${get.poptip("sjzx_byRecast")}将一张牌赠予一名其他角色，并将体力至调整至${Math.max(1, num)}`,
						// @ts-ignore
						filterTarget: (card, player, target) =>
							ui.selected.cards.every(value => {
								return target !== player && (target.canEquip(value) || get.type(value) !== "equip");
							}),
						filterCard(card) {
							return game.hasPlayer(current => {
								return current.canEquip(card) || get.type(card) !== "equip";
							});
						},
						position: "he",
						ai1: card => {
							return 8 - get.value(card);
						},
						ai2: target => {
							let player = get.player();
							// @ts-ignore
							return lib.skill._gifting.ai.result.target(player, target);
						},
					})
					.forResult();
				const { cards, targets } = result;
				if (!cards || !targets) return;
				const target = targets[0];
				player.recast(cards);
				player.gift(cards, target);
				player.recoverTo(Math.max(1, lib.skill.wuweimrfz.getNum(player, event.name)));

				let skills = player.getSkills(null, null, false).filter(skill => {
					let info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				});
				const { control } = await player
					.chooseControl(skills)
					.set("prompt", `请选择失去一个技能直到本轮结束`)
					.set("ai", () => {
						// @ts-ignore
						let { skills, player } = get.event();
						if (skills.includes("wuweimrfz")) return "wuweimrfz";
						if (skills.length > 1 && skills.includes("pojianmrfz")) skills.remove("pojianmrfz");
						return skills.randomGet();
					})
					.set("skills", skills)
					.forResult();
				if (control) {
					player.removeSkill(control);
					player
						.when({ global: "roundStart" })
						// @ts-ignore
						.step(async (event, trigger, player) => {
							player.addSkill(control);
						});
				}
			},
			ai: {
				threaten: 0.8,
			},
		},
		pojianmrfz: {
			audio: 2,
			trigger: {
				player: "damageEnd",
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0 && player.hasUseTarget("taoyuan");
			},
			usable: 3,
			// @ts-ignore
			async cost(event, trigger, player) {
				// @ts-ignore
				let skills = player.getSkills(null, null, false).filter(skill => {
					let info = get.info(skill);
					return info && !info.charlotte;
				});
				let num = lib.skill.wuweimrfz.getNum(player, "pojianmrfz");
				const { result } = await player
					.chooseCardTarget({
						prompt: `你可以将一张牌${get.poptip("sjzx_byRecast")}当目标数至多为${Math.max(1, num)}的【桃园结义】使用，然后因此回复体力值的角色摸${num}张牌，反之其本回合使用的下一张牌额外结算${num}次`,
						filterCard: true,
						// @ts-ignore
						filterTarget(card, player, target) {
							return player.canUse("taoyuan", target);
						},
						selectTarget() {
							let num = get.event().num;
							return [1, num];
						},
						ai1(card) {
							let player = get.player();
							if (player.isPhaseUsing() && player.countCards("h", card => player.hasUseTarget(card) && ["equip", "delay"].includes(get.type(card))) > 0) return false;
							if (!player.isPhaseUsing() && !game.hasPlayer(char => get.attitude2(char) > 0 && char.getDamagedHp() > 0)) return false;
							return 8 - get.value(card);
						},
						ai2(target) {
							// @ts-ignore
							let player = get.player();
							let num = 0;
							if (get.attitude2(target) < 0) return -1;
							if (target.getDamagedHp() > 0) num += target.hp === 1 ? 5 : 2;
							if (target.isPhaseUsing() && target.getDamagedHp() < 1 && game.hasPlayer(char => char.countCards("h", card => char.hasUseTarget(card) && ["equip", "delay"].includes(get.type(card))) > 0)) num += 1;
							return num;
						},
					})
					.set("num", num);
				event.result = result;
			},
			async content(event, trigger, player) {
				const { cards, targets } = event;
				//@ts-ignore
				let randomId = get.randomNumberSJZX();
				let damageCard = trigger.card;

				player
					.when({ player: "useCardAfter" })
					.filter((event, player) => {
						return event.card?.storage?.pojianmrfz;
					})
					.step(async (event, trigger, player) => {
						const num = lib.skill.wuweimrfz.getNum(player, "pojianmrfz");
						if (num < 1) return;
						//@ts-ignore
						game.getRoundHistory("changeHp", evt => {
							/** @type { GameEvent } */
							//@ts-ignore
							let evtx = evt.getParent();
							if (evtx.name === "recover" && targets.includes(evtx.player) && evtx.card && evtx.card?.storage?.pojianmrfz_id === randomId) {
								evtx.player.draw(num);
								targets.remove(evtx.player);
							}
						});
						targets.forEach(target => {
							target.markSkill("pojianmrfz", {
								content: `本回合下次使用牌额外结算${lib.skill.wuweimrfz.getNum(player, "pojianmrfz")}次`,
							});
							target
								.when({
									player: "useCard",
									global: "phaseEnd",
								})
								// @ts-ignore
								.filter((event, player) => {
									if (event.name !== "useCard") return true;
									return !event.card?.storage?.pojianmrfz && event.card !== damageCard;
								})
								.then(() => {
									player.unmarkSkill("pojianmrfz");
									if (trigger.name !== "useCard") return;
									//@ts-ignore
									if (numx > 0) trigger.effectCount += numx;
								})
								.vars({
									numx: lib.skill.wuweimrfz.getNum(player, "pojianmrfz"),
									damageCard: damageCard,
								});
						});
					});

				player.recast(cards);
				await player
					.chooseUseTarget(
						{
							name: "taoyuan",
							isCard: true,
							storage: {
								pojianmrfz: true,
								pojianmrfz_id: randomId,
							},
						},
						cards,
						targets
					)
					.set("forced", true);
			},
			ai: {
				threaten: 0.5,
				maixie: true,
				maixie_hp: true,
				effect: {
					target(card, player, target) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						if (target.hasFriend() && get.tag(card, "damage")) {
							return [1, 0, 0, -0.7];
						}
					},
				},
			},
		},

		//蓝毒
		landu_shixinmrfz: {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			init() {
				lib.translate["landu_shixinmrfz_tag"] = "毒";
			},
			filter(event, player) {
				if (!event.targets || event.targets.length > 1) return false;
				let target = event.targets[0];
				return target !== player && target.countCards("h", card => !card.storage.landu_shixinmrfz) > 0;
			},
			async cost(event, trigger, player) {
				let target = trigger.targets[0];
				event.result = await player
					.choosePlayerCard(target, "h")
					.set("prompt", get.prompt("landu_shixinmrfz"))
					.set("filterButton", button => {
						return !button.link.storage.landu_shixinmrfz;
					})
					.set("complexSelect", true)
					.forResult();
			},
			async content(event, trigger, player) {
				let target = trigger.targets[0];
				let cards = event.cards;
				//@ts-ignore
				player.showCards(cards, `${get.translation(player)}因【蚀心】展示了${get.translation(target)}的${get.cnNumber(cards.length)}张牌`);
				game.delay(1);
				cards.forEach(card => {
					card.addGaintag("landu_shixinmrfz_tag");
					card.storage.landu_shixinmrfz = true;
				});
			},
			group: ["landu_shixinmrfz_lose"],
			subSkill: {
				lose: {
					audio: "landu_shixinmrfz",
					charlotte: true,
					forced: true,
					trigger: {
						global: "loseAfter",
					},
					// @ts-ignore
					filter(event, player) {
						return event.cards.some(card => card.storage.landu_shixinmrfz);
					},
					// @ts-ignore
					async content(event, trigger, player) {
						let cardsx = trigger.cards.filter(card => card.storage.landu_shixinmrfz && get.position(card) === "d");
						let target = trigger.player;
						trigger.cards.forEach(card => {
							if (card.storage.landu_shixinmrfz) delete card.storage.landu_shixinmrfz;
						});
						if (cardsx.length > 0) player.gain(cardsx, "gain2");

						const { cards } =
							target.countCards("h", card => !card.storage.landu_shixinmrfz) < 1
								? { cards: undefined }
								: await target
										.chooseCard("h")
										.set("prompt", `是否将一张手牌标记为“毒”并令${get.translation(player)}模一张牌，否则失去一点体力`)
										.set("filterCard", card => !card.storage.landu_shixinmrfz)
										.set("ai", card => {
											if (player.hp < 2) return 114514 - get.value(card);
											return 8 - get.value(card);
										})
										.forResult();
						if (cards) {
							cards.forEach(card => {
								card.addGaintag("landu_shixinmrfz_tag");
								card.storage.landu_shixinmrfz = true;
							});
							player.draw();
						} else target.loseHp();
					},
				},
			},
		},
		picaimrfz: {
			audio: 2,
			usable: 1,
			trigger: {
				player: "damageBegin3",
			},
			filter(event, player) {
				return player.countCards("h") > 0 && event.num > 0;
			},
			async cost(event, trigger, player) {
				let str = trigger.card ? `若你展示的牌的花色是${get.translation(get.suit(trigger.card))}，则此伤害-1` : "<font color='red'>此伤害为无来源伤害！</font>";
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("picaimrfz"))
					.set("prompt2", str)
					.set("ai", card => {
						//@ts-ignore
						let cardx = get.event().cardx;
						if (!cardx) return -114514;
						if (get.suit(cardx) !== get.suit(card)) return -114514;
						return Math.random();
					})
					.set("cardx", trigger.card)
					.forResult();
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let source = trigger.source;
				trigger.num--;
				if (source && source.isIn() && source.countCards("h", card => !card.storage.landu_shixinmrfz) > 0) {
					const { cards } = await player
						.choosePlayerCard(source, "h")
						.set("prompt", get.prompt("landu_shixinmrfz"))
						.set("filterButton", button => {
							return !button.link.storage.landu_shixinmrfz;
						})
						.set("complexSelect", true)
						.forResult();
					if (cards) {
						cards.forEach(card => {
							card.addGaintag("landu_shixinmrfz_tag");
							card.storage.landu_shixinmrfz = true;
						});
					}
				}
			},
			ai: {
				threaten: 0.8,
			},
		},

		//吉星
		renweimrfz: {
			audio: 2,
			usable: 1,
			trigger: {
				player: "phaseChange",
			},
			firstDo: true,
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			async cost(event, trigger, player) {
				//@ts-ignore
				let phase = trigger.phaseList[trigger.num];
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("renweimrfz"))
					.set("prompt", `你可以交换牌堆顶和手牌中的一张牌<br>当前阶段:<font color='red'>${get.translation(phase)}</font>`)
					.set("ai", card => {
						//@ts-ignore
						let phase = get.event().phaseName;
						let player = get.player();
						switch (phase) {
							case "phaseDraw":
							case "phaseUse":
								return get.color(card) === "red" ? 100 - get.value(card) : 0;
							case "phaseDiscard":
								return get.color(card) === "black" ? 100 - get.value(card) : 0;
							default:
								return player.hasSkill("tiandingmrfz") ? 0 : 6 - get.value(card);
						}
					})
					.set("phaseName", phase)
					.forResult();
			},
			async content(event, trigger, player) {
				let card = event.cards[0];
				//@ts-ignore
				await player.gain(_status.pileTop);
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				//@ts-ignore
				let name = trigger.phaseList[trigger.num + 1] ? trigger.phaseList[trigger.num + 1] + "End" : "phaseEnd";
				player.addTempSkill("renweimrfz_knowFirstCard", { player: name });
			},
			subSkill: {
				knowFirstCard: {
					charlotte: true,
				},
			},
		},
		tiandingmrfz: {
			audio: 2,
			trigger: {
				player: "phaseChange",
			},
			lastDo: true,
			init(player, skill) {
				player.storage[skill] = 2;
			},
			// @ts-ignore
			filter(event, player) {
				let num = player.getHistory("useSkill", evt => evt.skill === "tiandingmrfz").length;
				return player.storage.tiandingmrfz > num;
			},
			check(event, player) {
				//@ts-ignore
				let phase = event.phaseList[event.num];
				let know = player.hasSkill("renweimrfz_knowFirstCard");
				if (know) {
					//@ts-ignore
					let color = get.color(_status.pileTop);
					switch (phase) {
						case "phaseDraw":
						case "phaseUse":
							if (color !== "red") return false;
							break;
						case "phaseDiscard":
							if (color !== "black" && player.countCards("h") + 1 > player.getHandcardLimit()) return false;
					}
					return true;
				}
				return !["phaseUse", "phaseDraw"].includes(phase);
			},
			// @ts-ignore
			prompt2(event, player) {
				//@ts-ignore
				let phase = event.phaseList[event.num];
				return `是否进行判定，若判定牌为红，你本回合使用【杀】的次数和攻击距离+1且本技能本回合发动次数+1，反之你跳过此阶段(${get.translation(phase)})？`;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const { card, color } = await player
					.judge()
					.set("judge", card => {
						let color = get.color(card);
						return color === "red" ? -4 : 0;
					})
					.set("judge2", result => result.bool === false)
					.forResult();
				if (get.position(card) === "d") player.gain(card, "gain2");
				if (color === "red") {
					player.storage.tiandingmrfz++;
					if (!player.hasSkill("tiandingmrfz_eff")) player.addTempSkill("tiandingmrfz_eff", { player: "phaseEnd" });
					player.addMark("tiandingmrfz_eff", 1, false);
				} else {
					//@ts-ignore
					player.skip(trigger.phaseList[trigger.num]);
				}
			},
			group: "tiandingmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					firstDo: true,
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.tiandingmrfz = 2;
					},
				},
				eff: {
					charlotte: true,
					silent: true,
					onremove: true,
					mark: true,
					intro: {
						content: "·使用【杀】的次数+#<br>·攻击距离+#",
					},
					mod: {
						cardUsable(card, player, num) {
							if (card.name === "sha") {
								return num + player.countMark("tiandingmrfz_eff");
							}
						},
						attackRange: function (player, num) {
							return num + player.countMark("tiandingmrfz_eff");
						},
					},
				},
			},
		},

		//松桐
		xianchoumrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			init(player, skill) {
				player.storage[skill] = [];
			},
			mark: true,
			intro: {
				content(_, player) {
					let str = [];
					if (player.hasSkill("xianchoumrfz")) {
						str.push(`·已经使用过的类型:${get.translation(player.storage["xianchoumrfz"])}`);
					}
					return str.join("<br>");
				},
			},
			filter(event, player) {
				//@ts-ignore
				return event.card && !event.card.xianchoumrfz && !player.storage["xianchoumrfz"].includes(get.type2(event.card));
			},
			async cost(event, trigger, player) {
				//@ts-ignore
				let num = game.getRoundHistory("everything", evt => evt.name === "xianchoumrfz").length + 1;
				event.result = await player
					.chooseTarget()
					.set("prompt", `你可以令一名其他角色视为使用${num}张【无中生有】并弃置${num}张牌`)
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
				player.storage["xianchoumrfz"].add(get.type2(trigger.card));
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const [target] = event.targets;
				//@ts-ignore
				let num = game.getRoundHistory("everything", evt => evt.name === "xianchoumrfz").length;

				for (let i = 0; i < num; i++) {
					await target.useCard({ name: "wuzhong", isCard: true, xianchoumrfz: true }, target);
				}

				await target.chooseToDiscard(num, true, "he").set("ai", card => {
					const evt = _status.event;
					return evt.name === "phaseUse" && evt.player === get.player() ? -get.player().getUseValue(card) : -get.value(card);
				});

				const { cards } = await target
					.chooseCard([0, num])
					.set("filterCard", card => {
						return !card.hasGaintag("xianchoumrfz");
					})
					// @ts-ignore
					.set("ai", (card, player) => {
						let info = get.info(card);
						if (typeof info.usable === "number") return 114514;
						return get.value(card);
					})
					.set("prompt", `你可以令至多${num}张手牌本轮使用无次数限制`)
					.forResult();

				if (cards) {
					target.addGaintag(cards, "xianchoumrfz");
					if (!target.storage.xianchoumrfz_igCount) {
						target.storage.xianchoumrfz_igCount = true;
						target
							.when({ global: "roundStart" })
							.then(() => {
								delete player.storage.xianchoumrfz_igCount;
								player.removeGaintag("xianchoumrfz");
							})
							.assign({
								mod: {
									// @ts-ignore
									cardUsable(card, player, num) {
										//@ts-ignore
										if (card.cards && card.cards.length === 1 && card.cards[0].hasGaintag("xianchoumrfz")) return Infinity;
									},
									// @ts-ignore
									aiOrder(player, card, num) {
										if (card.hasGaintag && card.hasGaintag("xianchoumrfz")) return (num -= 0.1);
									},
								},
							});
					}
				}
			},
			group: ["xianchoumrfz_clear"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage["xianchoumrfz"] = [];
					},
				},
			},
		},
		//录武官 云青萍
		luwumrfz: {
			audio: 2,
			usable: 1,
			trigger: {
				global: "cardsDiscardAfter",
			},
			onremove: true,
			init() {
				//@ts-ignore
				game.broadcastAll(() => {
					lib.translate["luwumrfz_tag"] = "invisible";
				});
			},
			// @ts-ignore
			filter(event, player) {
				//@ts-ignore
				let target = _status.currentPhase;
				return (
					target &&
					target.hasHistory("sourceDamage", evt => {
						return evt.cards && evt.cards.every(card => event.cards.includes(card));
					})
				);
			},
			marktext: "录武簿",
			intro: {
				name: "录武簿",
				// @ts-ignore
				content(storage, player) {
					if (!Array.isArray(storage) || storage.length === 0) return `没有招式被记录`;
					let trans = storage.map(arr => {
						let cn = [];
						cn.add(arr[1] === undefined ? get.translation(arr[0]) : get.translation(arr[1]) + get.translation(arr[0]));
						return cn.join("、");
					});
					return `记录的招式:${trans}`;
				},
			},
			mark: true,
			// @ts-ignore
			prompt2(event, player) {
				//@ts-ignore
				let target = _status.currentPhase;
				//@ts-ignore
				return `是否令${get.translation(target)}模一张牌，然后你获得${get.cnNumber(event.cards.length)}张牌(${get.translation(event.cards)})，然后你将一张手牌视为【影】?`;
			},
			// @ts-ignore
			check(event, player) {
				if (event.cards?.some(card => get.value(card) < 0)) return false;
				//@ts-ignore
				return get.attitude2(_status.currentPhase) > 0;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				let target = _status.currentPhase;
				target.draw();
				await player.gain(trigger.cards, "gain2");
				if (player.countCards("h", card => get.name(card) !== "ying") < 1) return;
				const { cards } = await player
					.chooseCard(1, true)
					.set("prompt", "请选择一张手牌视为【影】")
					.set("ai", card => -get.value(card))
					.forResult();
				if (!cards) return;
				let card = cards[0];
				card.addGaintag("luwumrfz_tag");
				target
					.when({ player: "phaseEnd" })
					.then(() => {
						player.unmarkSkill(event.name);
						//@ts-ignore
						game.broadcastAll(skill => {
							delete lib.translate[skill];
							//@ts-ignore
						}, event.name);
					})
					.assign({
						mod: {
							// @ts-ignore
							cardUsable(card, player, num) {
								//@ts-ignore
								if (card.name === trigger.getParent(2)?.card?.name) return (num += 1);
							},
						},
						intro: {
							name: "录武",
							content() {
								//@ts-ignore
								return `本回合使用的${get.translation(trigger.getParent(2).card.name)}次数+1`;
							},
						},
						luwumrfz: true,
						//@ts-ignore
						luwumrfzName: trigger.getParent(2).card.name,
					});
				if (!Array.isArray(player.storage.luwumrfz)) player.storage.luwumrfz = [];
				let storage = player.storage.luwumrfz;
				for (let card of trigger.cards) {
					if (storage.some(arr => arr[0] === get.name(card) && arr[1] === get.nature(card))) continue;
					player.storage.luwumrfz.add([card.name, card.nature]);
				}

				target.getSkills().forEach(skill => {
					if (skill.startsWith("player_when")) {
						let info = get.info(skill);
						if (info.luwumrfz) {
							game.broadcastAll(
								//@ts-ignore
								(skill, name) => {
									lib.translate[skill] = `${get.translation(name)[0]}↑`;
								},
								skill,
								info.luwumrfzName
							);
							target.markSkill(skill);
						}
					}
				});
			},
			ai: {
				threaten: 1.2,
			},
			mod: {
				// @ts-ignore
				cardname(card, player, name) {
					if (card.hasGaintag("luwumrfz_tag")) {
						return "ying";
					}
				},
			},
		},
		baizhaomrfz: {
			audio: 2,
			enable: "chooseToUse",
			filter(event, player) {
				let storage = player.storage.luwumrfz;
				if (!Array.isArray(storage) || storage.length === 0) return false;
				let names = storage.map(arr => arr[0]);
				for (let name of names) {
					if (!event.filterCard({ name: name }, player, event)) continue;
					return player.countCards("h", card => get.name(card) === "ying") > 0;
				}
				return false;
			},
			chooseButton: {
				dialog(event, player) {
					let list = [];
					let storage = player.storage.luwumrfz;
					for (let arr of storage) {
						list.push([get.translation(get.type(arr[0])), "", arr[0], arr[1]]);
					}
					/**
					 * @type {Dialog}
					 */
					//@ts-ignore
					const dialog = ui.create.dialog("百招", [list, "vcard"]);
					return dialog;
				},
				filter(button, player) {
					//@ts-ignore
					return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
				},
				check(button) {
					var player = _status.event.player;
					//@ts-ignore
					if (player.countCards("hs", button.link[2]) > 0) {
						return 0;
					}
					//@ts-ignore
					if (button.link[2] == "wugu") {
						return;
					}
					//@ts-ignore
					var effect = player.getUseValue(button.link[2]);
					if (effect > 0) {
						return effect;
					}
					return 0;
				},
				// @ts-ignore
				backup(links, player) {
					return {
						// @ts-ignore
						filterCard(card, player) {
							return get.name(card) === "ying";
						},
						audio: "baizhaomrfz",
						selectCard: 1,
						popname: true,
						check(card) {
							return 6 - get.value(card);
						},
						position: "h",
						viewAs: { name: links[0][2], nature: links[0][3] },
					};
				},
				// @ts-ignore
				prompt(links, player) {
					return "将一张【影】当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
				},
			},
			ai: {
				order: 10,
				combo: "luwumrfz",
			},
		},

		//火龙S黑角 太刀侠
		lianqimrfz: {
			audio: 2,
			trigger: { player: "useCard2" },
			filter(event, player) {
				return event.card && get.tag(event.card, "damage") && player.countMark("lianqimrfz") < 3;
			},
			forced: true,
			marktext: "刃",
			mark: true,
			intro: {
				name: "气刃",
				content(storage) {
					switch (storage) {
						case 1:
							return "黑龙歼灭刀已解放不屈白刃！";
						case 2:
							return "黑龙歼灭刀已解放华贵黄刃！";
						case 3:
							return "黑龙歼灭刀已解放至尊红刃！";
						default:
							return "孩子别怕，我带着黑龙歼灭刀来救你了！";
					}
				},
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player.addMark("lianqimrfz", 1);
			},
			group: "lianqimrfz_damage",
			subSkill: {
				damage: {
					audio: "lianqimrfz",
					trigger: { source: "damageBegin" },
					forced: true,
					filter(event, player) {
						return event.card !== undefined;
					},
					// @ts-ignore
					async content(event, trigger, player) {
						let evt = trigger.getParent(2);
						let num = player.countMark("lianqimrfz");
						//@ts-ignore
						if (typeof evt.baseDamage === "number") num += evt.baseDamage - 1;
						trigger.num = num;
					},
				},
			},
			ai: {
				combo: "denglongmrfz",
				threaten: 1.8,
			},
		},
		denglongmrfz: {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			// @ts-ignore
			filter(event, player) {
				return event.card.name === "sha" && event.targets && event.targets.length === 1;
			},
			usable: 1,
			check(event, player) {
				return get.effect(event.targets[0], event.card, player, player) > 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player
					.when("useCardAfter")
					// @ts-ignore
					.filter((event, player) => {
						return event.card === trigger.card;
					})
					.then(() => {
						player.removeMark("lianqimrfz", 1);
					});

				let data = lib.config.sjzxDenglongData || {
					total: 0,
					success: 0,
				};
				//获取玩家操作的登龙的成功率
				let probability = data.success / data.total || 0;
				if (_status.auto || !player.isUnderControl(true)) {
					probability = Math.max(0.6, probability); //设置一个最小值
					if (Math.random() < probability) {
						//@ts-ignore
						trigger.getParent().effectCount++;
						player.say("黑龙歼灭刀大人登龙成功！其他武器原地纳刀敬礼！");
					} else {
						player.say("力竭倒下");
					}
					return;
				}
				let target = trigger.targets[0];
				let targetCopy = target.cloneNode(true);
				let playerCopy = player.cloneNode(true);
				//@ts-ignore
				targetCopy.trueElement = target;
				//@ts-ignore
				playerCopy.trueElement = player;

				//@ts-ignore
				playerCopy.style.position = "absolute";
				//@ts-ignore
				playerCopy.style.left = "50%";
				//@ts-ignore
				playerCopy.style.zIndex = 114514;
				//@ts-ignore
				playerCopy.style.transform = "scale(0.2)";

				//@ts-ignore
				targetCopy.style.zIndex = 114514;
				//@ts-ignore
				targetCopy.style.position = "absolute";
				//@ts-ignore
				targetCopy.style.transform = "scale(0.5)";

				document.body.appendChild(targetCopy);
				document.body.appendChild(playerCopy);
				target.hide();
				player.hide();
				game.pause();

				//开登！
				const enemy = {
					element: targetCopy,
					x: target.getBoundingClientRect().x,
					y: target.getBoundingClientRect().y,
					dx: 0,
					dy: 0,
					width: 0,
					height: 0,
					bodyRect: null,

					init() {
						//@ts-ignore
						const rect = this.element.getBoundingClientRect();
						const bodyRect = document.body.getBoundingClientRect();

						this.x = rect.left;
						this.y = rect.top;
						this.width = rect.width;
						this.height = rect.height;
						//@ts-ignore
						this.bodyRect = bodyRect;

						this.dx = (Math.random() * 3 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
						this.dy = (Math.random() * 3 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
					},

					update() {
						this.x += this.dx;
						this.y += this.dy;

						//@ts-ignore 左右边界反弹
						if (this.x <= 0 || this.x + this.width >= this.bodyRect.width) {
							this.dx *= -1;
							//@ts-ignore
							this.x = Math.max(0, Math.min(this.x, this.bodyRect.width - this.width));
						}

						// 上边界反弹
						if (this.y <= 0) {
							this.dy *= -1;
							this.y = 0;
						}
						//@ts-ignore
						const bottomMargin = 1.2 * (this.bodyRect.height - playerCopy.getBoundingClientRect().y);
						//@ts-ignore
						if (this.y + this.height >= this.bodyRect.height - bottomMargin) {
							this.dy *= -1;
							//@ts-ignore
							this.y = this.bodyRect.height - this.height - bottomMargin;
						}
						//@ts-ignore
						this.element.style.left = `${this.x}px`;
						//@ts-ignore
						this.element.style.top = `${this.y}px`;
					},
				};
				const taidaoxia = {
					element: playerCopy,
					x: 0,
					y: 0,
					targetX: null,
					targetY: null,
					moving: false,
					duration: 500,
					startTimestamp: null,
					listen: [],
					clickCount: 0,
					hasMoved: false,
					//@ts-ignore
					init(playerElement = this.element) {
						this.element = playerElement;
						// @ts-ignore
						this.x = this.element.offsetLeft;
						// @ts-ignore
						this.y = this.element.offsetTop;

						function listen(e) {
							// @ts-ignore
							const targetX = e.clientX - taidaoxia.element.offsetWidth / 2;
							// @ts-ignore
							const targetY = e.clientY - taidaoxia.element.offsetHeight / 2;

							taidaoxia.setTarget(targetX, targetY);
						}
						//@ts-ignore
						this.listen.push(listen);

						setTimeout(function () {
							document.addEventListener("click", listen);
						}, 1000);
					},

					setTarget(x, y) {
						this.targetX = x;
						this.targetY = y;
						this.moving = true;
						this.startTimestamp = null;
					},

					update() {
						if (!this.moving || this.targetX === null || this.targetY === null) {
							return;
						}

						const now = performance.now();

						if (!this.startTimestamp) {
							//@ts-ignore
							this.startTimestamp = now;
						}
						//@ts-ignore
						const elapsed = now - this.startTimestamp;
						const progress = Math.min(elapsed / this.duration, 1);

						const prevX = this.x;
						const prevY = this.y;

						this.x += (this.targetX - this.x) * progress;
						this.y += (this.targetY - this.y) * progress;

						// @ts-ignore
						this.element.style.left = `${Math.round(this.x)}px`;
						// @ts-ignore
						this.element.style.top = `${Math.round(this.y)}px`;

						if (Math.abs(this.x - prevX) > 1 || Math.abs(this.y - prevY) > 1) {
							this.hasMoved = true;
						}

						if (progress >= 1) {
							this.moving = false;
							this.startTimestamp = null;

							if (this.hasMoved) {
								this.clickCount++;
								this.hasMoved = false;
							}
						}
					},
				};

				taidaoxia.init();
				enemy.init();
				mainLoop();

				function recover() {
					data.total++;

					target.show();
					player.show();

					// @ts-ignore
					targetCopy.delete();
					// @ts-ignore
					playerCopy.delete();

					taidaoxia.listen.forEach(listen => {
						document.removeEventListener("click", listen);
					});

					game.resume();
				}

				function success() {
					recover();
					data.success++;
					// @ts-ignore
					trigger.getParent().effectCount++;
					player.say("黑龙歼灭刀大人登龙成功！其他武器原地纳刀敬礼！");
				}

				function detectCollisions() {
					const playerEl = taidaoxia.element;
					const enemyEl = enemy.element;

					return isColliding(playerEl, enemyEl);
				}

				function mainLoop() {
					taidaoxia.update();
					enemy.update();

					const collided = detectCollisions();

					if (collided) {
						success();
						game.saveConfig("sjzxDenglongData", data);
						return;
					}

					if (taidaoxia.clickCount >= 1) {
						recover();
						game.saveConfig("sjzxDenglongData", data);
						player.say("力竭倒下");
						whichWayToast.showToast("🦐太刀侠", 2000);
						if (probability !== 0 && probability <= 0.5) {
							target.chat("玩太刀玩的");
						}
						return;
					}

					requestAnimationFrame(mainLoop);
				}

				function isColliding(elementA, elementB) {
					const rectA = elementA.getBoundingClientRect();
					const rectB = elementB.getBoundingClientRect();

					return !(rectA.top > rectB.bottom || rectA.bottom < rectB.top || rectA.right < rectB.left || rectA.left > rectB.right);
				}
			},
		},
		juhemrfz: {
			audio: 2,
			trigger: {
				target: "shaMiss",
				global: "eventNeutralized",
			},
			filter(event, player, name) {
				if (event.type !== "card" || event.player === player) return false;
				if (name !== "shaMiss" && event._neutralize_event.player !== player) return false;
				return event.player;
			},
			// @ts-ignore
			prompt(event, player) {
				return `是否视为对${get.translation(event.player)}使用一张【杀】？`;
			},
			check(event, player) {
				return get.effect(event.player, { name: "sha", isCard: true }, player, player) > 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player.useCard({ name: "sha", isCard: true }, trigger.player).set("addCount", false);
			},
			ai: {
				threaten: 0.8,
			},
		},
		//Christine
		mixumrfz: {
			audio: 2,
			trigger: {
				global: ["loseAfter", "loseAsyncAfter"],
			},
			onremove(player, skill) {
				const cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			filter(event, player) {
				const cards = player.getExpansions("mixumrfz");
				if (cards.length >= player.maxHp * 2) return false;
				if (event.type !== "discard") return false;
				return game.hasPlayer(current => {
					// @ts-ignore
					let evt = event.getl(current);
					return !(!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 1);
				});
			},
			async cost(event, trigger, player) {
				let cardsList = [];
				// @ts-ignore
				let players = game.filterPlayer().sortBySeat(_status.currentPhase);
				for (var current of players) {
					var cards = [];
					// @ts-ignore
					var evt = trigger.getl(current);
					if (!evt || !evt.cards2) continue;
					let cardsx = evt.cards2.filterInD("d");
					cards.addArray(cardsx);
					if (cards.length) {
						cardsList.push(...cards);
					}
				}
				const result = await player
					.chooseButton(["选择置于武将牌上的牌", cardsList])
					.set("selectButton", () => {
						// @ts-ignore
						return [1, get.event().numx];
					})
					.set("numx", player.maxHp * 2 - player.getExpansions("mixumrfz").length)
					.set("ai", button => get.value(button.link))
					.forResult();
				event.result = {
					...result,
					cost_data: {
						cards: result.links,
					},
				};
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const next = player.addToExpansion(event.cost_data.cards, player, "give");
				// @ts-ignore
				next.gaintag.add("mixumrfz");
				await next;
			},
			marktext: "绪",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			ai: {
				combo: "yashimrfz",
			},
		},
		yashimrfz: {
			audio: 2,
			init() {
				// @ts-ignore
				game.broadcastAll(() => {
					lib.translate["yashimrfz_backup"] = "雅食";
				});
			},
			enable: "phaseUse",
			// @ts-ignore
			filter(event, player) {
				const cards = player.getExpansions("mixumrfz");
				if (cards.length < 1) return false;
				let list = ["color", "type2", "suit"];
				for (let i = 0; i < list.length; i++) {
					if (judge(list[i], cards).size === i + 2) return true;
				}
				return false;
				function judge(item, cards) {
					return new Set(cards.map(card => get[item](card)));
				}
			},
			chooseButton: {
				dialog(event, player) {
					let cards = player.getExpansions("mixumrfz");
					let check = {
						suit: [],
						type: [],
						color: [],
					};

					let seenSuit = new Set();
					let seenType = new Set();
					let seenColor = new Set();

					for (let card of cards) {
						const suit = get.suit(card);
						const type = get.type2(card);
						const color = get.color(card);

						if (!seenSuit.has(suit)) {
							seenSuit.add(suit);
							//@ts-ignore
							check.suit.push(card);
						}

						if (!seenType.has(type)) {
							seenType.add(type);
							//@ts-ignore
							check.type.push(card);
						}

						if (!seenColor.has(color)) {
							seenColor.add(color);
							//@ts-ignore
							check.color.push(card);
						}
					}
					for (let key in check) {
						let info = check[key];
						if (key === "suit" && info.length === 4) {
							game.broadcastAll(
								//@ts-ignore
								function (event, info) {
									event.yashimrfz_aiCheck = info;
								},
								//@ts-ignore
								event,
								info
							);
							break;
						}
						if (key === "type" && info.length === 3) {
							game.broadcastAll(
								//@ts-ignore
								function (event, info) {
									event.yashimrfz_aiCheck = info;
								},
								//@ts-ignore
								event,
								info
							);
							break;
						}
						if (key === "color" && info.length === 2) {
							game.broadcastAll(
								//@ts-ignore
								function (event, info) {
									event.yashimrfz_aiCheck = info;
								},
								//@ts-ignore
								event,
								info
							);
							break;
						}
					}
					return ui.create.dialog("雅食", cards, "hidden");
				},
				check(button) {
					let event = get.event().parent;
					// @ts-ignore
					let check = event.yashimrfz_aiCheck;
					// @ts-ignore
					return check.includes(button.link);
				},
				select() {
					return [1, Infinity];
				},
				// @ts-ignore
				filterOk() {
					// @ts-ignore
					const player = get.player();
					const buttons = ui.selected.buttons;
					let list = ["color", "type2", "suit"];
					let bool = false;
					for (let i = 0; i < list.length; i++) {
						let tmp = buttons.map(button => get[list[i]](button));
						if (tmp.length === i + 2 && new Set(tmp).size === i + 2) {
							bool = true;
							break;
						}
					}
					return bool;
				},
				complexSelect: true,
				// @ts-ignore
				backup(links, player) {
					return {
						audio: "yashimrfz",
						filterCard() {
							return false;
						},
						selectCard: -1,
						card: links,
						delay: false,
						// @ts-ignore
						async content(event, trigger, player) {
							const lines = ["Are people so unhappy when they love?", "Pitiful creature of darkness, what kind of life have you known? God, give me courage to show you you are not alone!", "I am your angel of music."];
							const cards = lib.skill.yashimrfz_backup.card;
							await player.loseToDiscardpile(cards);
							await player.draw(cards.length);

							const cardsx = player.getExpansions("mixumrfz");
							if (cardsx.length > 0) {
								let i = Math.min(3, cardsx.length);
								player.say(lines[i - 1]);
								player.recover();
								player.loseToDiscardpile(cardsx);
								player.draw();
							}
						},
					};
				},
			},
			ai: {
				combo: "mixumrfz",
				threaten: 1.5,
				order: 13,
				result: {
					player: 1,
				},
			},
		},

		//蒂比
		penhuimrfz: {
			audio: 3,
			trigger: {
				player: "useCardAfter",
			},
			transferRGB(card) {
				let [r, g, b] = [0, 0, 0];
				let number = get.number(card),
					color = get.color(card),
					type = get.type2(card);
				// @ts-ignore
				let num = (number || 0) * 10;
				if (color === "red") {
					if (type === "basic") r += num;
					if (type === "equip") b += num;
					if (type === "trick") g += num;
				} else {
					if (type === "basic") r -= num;
					if (type === "equip") b -= num;
					if (type === "trick") g -= num;
				}
				return {
					r: r,
					g: g,
					b: b,
				};
			},
			async addColors(color1, color2) {
				function parseColor(color) {
					if (typeof color === "string") {
						const [r, g, b] = color.split(/[,|]/).map(Number);
						return { r, g, b };
					}
					return color;
				}

				const c1 = parseColor(color1);
				const c2 = parseColor(color2);

				function convert(num) {
					return ((num % 256) + 256) % 256;
				}

				return {
					r: convert(c1.r + c2.r),
					g: convert(c1.g + c2.g),
					b: convert(c1.b + c2.b),
				};
			},
			classifyColor(rgb) {
				const colorCenters = {
					red: { r: 255, g: 0, b: 0 },
					green: { r: 0, g: 255, b: 0 },
					blue: { r: 0, g: 0, b: 255 },
				};

				let minDist = Infinity;
				let closestType = null;

				for (let key in colorCenters) {
					const dist = getDistance(rgb, colorCenters[key]);
					if (dist < minDist) {
						minDist = dist;
						closestType = key;
					}
				}

				return closestType;

				function getDistance(c1, c2) {
					return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
				}
			},
			// @ts-ignore
			filter(event, player) {
				return event.card && typeof get.number(event.card) === "number";
			},
			mark: true,
			intro: {
				mark(dialog, storage) {
					if (storage === undefined)
						storage = {
							r: 64,
							g: 128,
							b: 128,
						};

					const content = dialog.querySelector(".content-container .content");

					const hsvFromRGB = rgbToHsv(storage.r, storage.g, storage.b);
					const v = hsvFromRGB.v;

					const panelSize = {
						width: 150,
						height: 75,
					};

					const panelContainer = ui.create.div(
						"penhuimrfz_color_panel_container",
						{
							width: `${panelSize.width}px`,
							height: `${panelSize.height}px`,
							margin: "10px auto",
							position: "relative",
							border: "1px solid #ccc",
						},
						content
					);

					const canvas = document.createElement("canvas");
					canvas.width = panelSize.width;
					canvas.height = panelSize.height;
					const ctx = canvas.getContext("2d");

					for (let x = 0; x < panelSize.width; x++) {
						for (let y = 0; y < panelSize.height; y++) {
							const hue = (x / panelSize.width) * 360;
							const sat = y / panelSize.height;

							const rgb = hsvToRgb(hue, sat, v);
							//@ts-ignore
							const pixelData = ctx.createImageData(1, 1);
							const data = pixelData.data;
							data[0] = rgb.r;
							data[1] = rgb.g;
							data[2] = rgb.b;
							data[3] = 255;
							//@ts-ignore
							ctx.putImageData(pixelData, x, y);
						}
					}

					panelContainer.appendChild(canvas);

					function getMarkerPosition(r, g, b) {
						const hsv = rgbToHsv(r, g, b);
						const x = (hsv.h / 360) * panelSize.width;
						const y = hsv.s * panelSize.height;
						return { x, y };
					}

					const markerPos = getMarkerPosition(storage.r, storage.g, storage.b);

					// @ts-ignore
					const marker = ui.create.div(
						"penhuimrfz_2d_marker",
						{
							width: "8px",
							height: "8px",
							position: "absolute",
							top: `${markerPos.y - 4}px`,
							left: `${markerPos.x - 4}px`,
							border: "2px solid white",
							borderRadius: "50%",
							boxShadow: "0 0 2px black",
							pointerEvents: "none",
							zIndex: "2",
						},
						panelContainer
					);

					const valueSliderContainer = ui.create.div(
						"penhuimrfz_value_slider_container",
						{
							width: "150px",
							height: "10px",
							margin: "10px auto",
							background: "linear-gradient(to right, black, white)",
							position: "relative",
							borderRadius: "5px",
						},
						content
					);

					// @ts-ignore
					const valueSliderMarker = ui.create.div(
						"penhuimrfz_value_slider_marker",
						{
							width: "4px",
							height: "100%",
							background: "red",
							position: "absolute",
							left: `${v * 100}%`,
							transform: "translateX(-2px)",
							pointerEvents: "none",
						},
						valueSliderContainer
					);

					const colorPreview = ui.create.div("penhuimrfz_preview", {
						width: "40px",
						height: "20px",
						display: "inline-block",
						backgroundColor: `rgb(${storage.r},${storage.g},${storage.b})`,
						border: "1px solid #999",
						marginRight: "10px",
						position: "relative",
					});

					const rgbDisplay = ui.create.div(
						"penhuimrfz_rgb_display",
						{
							display: "flex",
							fontSize: "14px",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "5px",
						},
						content
					);
					rgbDisplay.appendChild(colorPreview);
					rgbDisplay.innerHTML += `RGB(${storage.r}, ${storage.g}, ${storage.b})`;

					// HSV/RGB conversion utils
					function hsvToRgb(h, s, v) {
						let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
						return {
							r: Math.round(f(5) * 255),
							g: Math.round(f(3) * 255),
							b: Math.round(f(1) * 255),
						};
					}

					function rgbToHsv(r, g, b) {
						((r /= 255), (g /= 255), (b /= 255));
						let max = Math.max(r, g, b),
							min = Math.min(r, g, b);
						let h,
							s,
							v = max;
						let d = max - min;
						s = max === 0 ? 0 : d / max;

						if (max === min) {
							h = 0;
						} else {
							switch (max) {
								case r:
									h = (g - b) / d + (g < b ? 6 : 0);
									break;
								case g:
									h = (b - r) / d + 2;
									break;
								case b:
									h = (r - g) / d + 4;
									break;
							}
							//@ts-ignore
							h /= 6;
						}
						//@ts-ignore
						return { h: h * 360, s: s, v: v };
					}
				},
			},
			forced: true,
			async content(event, trigger, player) {
				let rgb = lib.skill.penhuimrfz.transferRGB(trigger.card);
				game.broadcastAll(
					//@ts-ignore
					async function (rgb, player) {
						player.storage.penhuimrfz = await lib.skill.penhuimrfz.addColors(player.storage.penhuimrfz, rgb);
					},
					rgb,
					//@ts-ignore
					player
				);

				let color = lib.skill.penhuimrfz.classifyColor(player.storage.penhuimrfz);
				const translate = {
					blue: "蓝色",
					green: "绿色",
					red: "红色",
				};
				player.popup(translate[color]);
				switch (color) {
					case "blue":
						player.draw();
						break;
					case "green":
						player.markSkill("penhuimrfz_mark");
						player
							.when({ player: "useCardEnd" })
							.then(() => {
								player.unmarkSkill("penhuimrfz_mark");
							})
							.assign({
								mod: {
									// @ts-ignore
									targetInRange(card, player, target, now) {
										return true;
									},
								},
							});
						break;
					case "red": {
						const { targets } = await player
							.chooseTarget(true)
							.set("prompt", `对一名其他角色造成一点伤害`)
							.set("ai", target => get.attitude(player, target) < 0)
							.set("filterTarget", lib.filter.notMe)
							.forResult();
						if (!targets) return;
						if (targets[0]) targets[0].damage();
						break;
					}
				}
			},
			group: ["penhuimrfz_init", "penhuimrfz_tip"],
			subSkill: {
				mark: {
					charlotte: true,
					intro: {
						content: "下次使用牌无距离限制",
					},
				},
				init: {
					audio: "penhuimrfz",
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					forced: true,
					// @ts-ignore
					filter: function (event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.penhuimrfz = {
							r: 64,
							g: 128,
							b: 128,
						};
					},
				},
				tip: {
					charlotte: true,
					silent: true,
					init() {
						// @ts-ignore
						game.broadcastAll(function () {
							lib.translate["penhuimrfz_tip_blue"] = "<font color = blue>摸牌</font>";
							lib.translate["penhuimrfz_tip_red"] = "<font color = red>伤害</font>";
							lib.translate["penhuimrfz_tip_green"] = "<font color = green>距离</font>";
						});
					},
					trigger: {
						player: ["useCardAfter", "loseBegin", "gainBegin"],
					},
					lastDo: true,
					// @ts-ignore
					async content(event, trigger, player) {
						let tag = ["penhuimrfz_tip_blue", "penhuimrfz_tip_red", "penhuimrfz_tip_green"];
						tag.forEach(t => {
							player.removeGaintag(t);
						});
						let cards = trigger.name === "useCard" ? player.getCards("h") : player.getCards("h").concat(trigger.cards);
						for (let card of cards) {
							let rgb = lib.skill.penhuimrfz.transferRGB(card);
							let color = lib.skill.penhuimrfz.classifyColor(await lib.skill.penhuimrfz.addColors(player.storage.penhuimrfz, rgb));
							card.addGaintag(`penhuimrfz_tip_${color}`);
						}
					},
				},
			},
		},
		//聆音
		qiansongmrfz: {
			audio: 2,
			trigger: { player: "phaseUseBegin" },
			intro: {
				content: "回合结束时摸三张牌",
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h", card => !get.tag(card, "damage") && player.canRecast(card)) > 0;
			},
			prompt2() {
				let cards = get.player().getCards("h", card => !get.tag(card, "damage") && get.player().canRecast(card));
				return `重铸${get.translation(cards)}，然后若你所有手牌均带有伤害类标签，你于回合结束时摸两张牌。`;
			},
			// @ts-ignore
			check(event, player) {
				let cards = get.player().getCards("h", card => !get.tag(card, "damage") && get.player().canRecast(card));
				let value = cards.reduce((prev, card) => prev + get.value(card), 0);
				return value <= 15;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let cards = player.getCards("h", card => !get.tag(card, "damage") && player.canRecast(card));
				await player.recast(cards);
				let a = player.countCards("h", card => get.tag(card, "damage"));
				let b = player.countCards("h", card => !get.tag(card, "damage"));
				if (a > b) {
					player.markSkill("qiansongmrfz");
					player
						.when({ player: "phaseEnd" })
						// @ts-ignore
						.step(() => {
							player.draw(3);
							// @ts-ignore
							player.logSkill("qiansongmrfz");
							player.unmarkSkill("qiansongmrfz");
						});
				} else {
					let card = get.cardPile2("sha", "random");
					if (card) player.gain(card, "gain2");
				}
			},
		},
		qiancimrfz: {
			audio: 2,
			enable: "phaseUse",
			init() {
				lib.translate["qiancimrfz_tips"] = "伤害类牌";
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			// @ts-ignore
			usable(skill, player) {
				let num = player.storage.qiancimrfz || 0;
				return num + 1;
			},
			intro: {
				// @ts-ignore
				content(event, player) {
					return `【虔赐】出牌阶段使用次数上限：${(player.storage.qiancimrfz || 0) + 1}`;
				},
			},
			filterTarget: lib.filter.notMe,
			filterCard: () => true,
			discard: false,
			lose: false,
			onremove: true,
			check(card) {
				return get.tag(card, "damage") > 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let {
					cards: cardsx,
					targets: [target],
				} = event;
				await player.give(cardsx, target);
				const { cards } =
					target.getCards("h").length <= 3
						? { cards: target.getCards("h") }
						: await player
								.choosePlayerCard("h", target, true)
								// @ts-ignore
								.set("ai", card => get.rand(0, 1))
								.set("prompt", `请展示${get.translation(target)}的三张手牌`)
								.set("selectButton", 3)
								.forResult();
				if (!cards) return;
				// @ts-ignore
				await player.showCards(cards, `${get.translation(player)}展示了${get.translation(target)}${get.cnNumber(cards.length)}张手牌`);
				let damage = cards.filter(card => get.tag(card, "damage")).length;
				if (damage > 0) {
					player.line(target);
					target.damage(damage, player).set("qiancimrfz", true);
				}
			},
			group: ["qiancimrfz_recover"],
			subSkill: {
				recover: {
					charlotte: true,
					silent: true,
					trigger: { source: ["damageEnd", "dieAfter"] },
					// @ts-ignore
					filter(event, player) {
						// @ts-ignore
						return (event.qiancimrfz && event.name === "damage") || (event.name === "die" && event.getParent(2).qiancimrfz);
					},
					// @ts-ignore
					async content(event, trigger, player) {
						if (trigger.name === "damage") player.recover();
						else {
							if (!player.storage.qiancimrfz) {
								player.storage.qiancimrfz = 0;
								player.markSkill("qiancimrfz");
							}
							player.storage.qiancimrfz++;
						}
					},
				},
			},
			ai: {
				order: 5,
				result: {
					player(player) {
						return player.countCards("h", card => get.value(card) < 8) > 0;
					},
					target(player, target) {
						let att = get.attitude(player, target);
						let cards = target.getCards("h");
						let num = -1.5;
						if (att < 0) {
							if (cards.length < 2) num += 1;
							if (target.hp < 3) num -= 1.5;
						}
						return num;
					},
				},
			},
		},

		// 钼铅
		cangshimrfz: {
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			onremove(player) {
				player.removeTip("cangshimrfz_tip");
			},
			intro: {
				// @ts-ignore
				content(event, player) {
					return `当你获得${get.translation(player.storage.cangshimrfz)}的牌时，你摸两张牌`;
				},
			},
			// @ts-ignore
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const { control } = await player
					.chooseControl(lib.suit)
					.set("prompt", `【藏石】：请选择一种花色，当你获得这种花色的牌后你摸两张牌`)
					.set("ai", () => {
						return "diamond";
					})
					.forResult();
				if (control) {
					player.storage.cangshimrfz = control;
					player.markSkill("cangshimrfz");
					player.addTip("cangshimrfz_tip", `藏石 ${get.translation(control)}`);
				}
			},
			group: ["cangshimrfz_draw"],
			subSkill: {
				draw: {
					audio: "cangshimrfz",
					trigger: { player: "gainAfter" },
					filter: (event, player) => {
						// @ts-ignore
						if (!player.storage.cangshimrfz || event.getParent(2).name === "cangshimrfz_draw") return false;
						return event.cards && event.cards.some(card => get.suit(card) === player.storage.cangshimrfz);
					},
					forced: true,
					// @ts-ignore
					async content(event, trigger, player) {
						await player.draw(2);
						let next = game.createEvent("cangshimrfz");
						// @ts-ignore
						next.player = player;
						// @ts-ignore
						next.setContent(lib.skill.cangshimrfz.content);
					},
				},
			},
			ai: {
				threaten: 1.3,
			},
		},

		// 水灯心
		sanyanmrfz: {
			audio: 2,
			trigger: {
				global: "phaseEnd",
			},
			getSatisfied(player, stroage) {
				let history = player.getHistory();
				let result = [];
				for (let key in history) {
					if (!stroage.includes(key)) continue;
					let subHistory = history[key];
					if (key === "useCard") {
						for (let evt of subHistory) {
							if (evt.card && get.type2(evt.card) === "equip") {
								result.add(key);
								break;
							}
						}
					} else if (key === "gain") {
						if (subHistory.length > 0) {
							result.add(key);
						}
					}
				}
				if (player.hasSkill("sanyanmrfz_recovered") && stroage.includes("recover")) result.add("recover");

				return result;
			},
			init(player, skill) {
				player.storage[skill] = ["gain", "useCard", "recover"];
			},
			prompt2(event, player) {
				let result = lib.skill.sanyanmrfz.getSatisfied(event.player, player.storage.sanyanmrfz);
				return `你可以摸${get.cnNumber(2 * result.length)}张牌，然后令至多${get.cnNumber(result.length)}名其他角色摸一张牌`;
			},
			filter(event, player) {
				return lib.skill.sanyanmrfz.getSatisfied(event.player, player.storage.sanyanmrfz).length > 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let result = lib.skill.sanyanmrfz.getSatisfied(trigger.player, player.storage.sanyanmrfz);
				let num = result.length;
				await player.draw(2 * num);
				const { targets } = await player
					.chooseTarget()
					.set("filterTarget", lib.filter.notMe)
					.set("selectTarget", [1, num])
					.set("ai", target => get.attitude2(target) > 0)
					.set("prompt", `【三焰】：你可以令至多${get.cnNumber(num)}名其他角色摸一张牌`)
					.forResult();
				if (targets) {
					targets.forEach(target => player.line(target));
					await game.asyncDraw(targets, 1);
				}
				player.storage.sanyanmrfz.remove(...result);
			},
			group: ["sanyanmrfz_count", "sanyanmrfz_reset"],
			subSkill: {
				reset: {
					charlotte: true,
					silent: true,
					trigger: {
						global: "roundStart",
					},
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage["sanyanmrfz"] = ["gain", "useCard", "recover"];
					},
				},
				count: {
					charlotte: true,
					silent: true,
					trigger: { global: "recoverEnd" },
					filter(event, player) {
						// @ts-ignore
						return event.player === _status.currentPhase && !player.hasSkill("sanyanmrfz_recovered");
					},
					// @ts-ignore
					async content(event, trigger, player) {
						player.addTempSkill("sanyanmrfz_recovered", { global: "phaseAfter" });
					},
				},
			},
			ai: {
				threaten: 1.8,
			},
		},
		dongqumrfz: {
			audio: 2,
			trigger: { global: "roundStart" },
			// @ts-ignore
			filter(event, player) {
				return game.hasPlayer(current => current.countCards("h", card => current.canRecast(card)) > 0);
			},
			// @ts-ignore
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("dongqumrfz"))
					.set("prompt2", `你可以令至多${get.cnNumber(player.maxHp)}名角色重铸一张手牌，若重铸的牌点数之和大于21，则这些角色回复一点体力`)
					// @ts-ignore
					.set("filterTarget", (card, player, target) => target.countCards("h", card => target.canRecast(card)) > 0)
					.set("selectTarget", [1, player.maxHp])
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let targets = [...event.targets];
				let cards = [];
				while (targets.length > 0) {
					let target = targets.shift();
					if (target) {
						let { cards: cardsx } = await target
							.chooseCard(true)
							.set("ai", card => -get.value(card))
							.set("prompt", "【冬去】:请重铸一张手牌")
							// @ts-ignore
							.set("filterCard", card => get.event().targetx.canRecast(card))
							.set("targetx", target)
							.forResult();
						if (cardsx) {
							cards.push(...cardsx);
							target.recast(cardsx);
						}
					}
				}
				// @ts-ignore
				let sum = Number(cards.map(card => get.number(card)).reduce((acc, num) => acc + num, 0)) || 0;
				if (sum > 21) {
					event.targets.forEach(target => {
						target.recover();
					});
				}
			},
		},

		// 阿兰娜
		qixiemrfz: {
			audio: 2,
			enable: "phaseUse",
			init(player, skill) {
				player.storage[skill] = [];
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h", card => !player.storage.qixiemrfz.includes(get.type2(card))) > 0;
			},
			filterCard(card, player) {
				return !player.storage.qixiemrfz.includes(get.type2(card));
			},
			// @ts-ignore
			filterTarget(card, player, target) {
				return (target === player || target.inRange(player)) && target.hasEnabledSlot();
			},
			check(card) {
				let player = get.player();
				let num = 8 - get.value(card, player);
				if (card.name === "sha" || card.name === "shan") num += 5;
				if (get.type2(card) === "equip") num -= 5;
				return num;
			},
			discard: false,
			lose: false,
			delay: 0,
			// @ts-ignore
			async content(event, trigger, player) {
				let card = event.cards[0];
				let target = event.targets[0];
				player.storage.qixiemrfz.push(get.type2(card));
				let skillpool = Object.keys(lib.skill).filter(skill => {
					let info = get.info(skill);
					if (!info || info.charlotte || !lib.translate[skill + "_info"]) return false;
					return get.skillInfoTranslation(skill).includes(`【${get.translation(card.name)}】`);
				});
				if (!skillpool.length) {
					player.chat("无对应的技能");
					return;
				}
				let subtypes = ["equip1", "equip2", "equip3", "equip4", "equip5"];
				subtypes = subtypes.filter(i => player.hasEnabledSlot(i));
				const { control } = await player
					.chooseControl(subtypes)
					.set("prompt", "请选择一个装备栏")
					.set("ai", () => {
						// @ts-ignore
						let subtypes = get.event().subtypes;
						let player = get.player();
						let list = subtypes.filter(i => !player.getEquip(i));
						return list.length > 0 ? list.randomGet() : subtypes.randomGet();
					})
					.set("subtypes", subtypes)
					.forResult();
				let name = skillpool.randomGet();
				await lib.skill.qixiemrfz.createEquip(name, control);
				let cardx = {
					name: "qixiemrfz_" + name,
					suit: "none",
					number: "none",
				};
				target.useCard(cardx, [card], target);
			},
			async createEquip(skill, subtype) {
				if (!lib.card["qixiemrfz_" + skill]) {
					if (lib.translate[skill + "_ab"]) lib.translate["qixiemrfz_" + skill] = lib.translate[skill + "_ab"] + "-" + get.translation(subtype)[subtype === "equip2" ? 1 : 0];
					else lib.translate["qixiemrfz_" + skill] = lib.translate[skill] + "-" + get.translation(subtype)[subtype === "equip2" ? 1 : 0];
					lib.translate["qixiemrfz_" + skill + "_info"] = `锁定技，你视为拥有【${get.translation(skill)}】；当此牌离开你的装备区后，销毁之`;
					lib.translate["qixiemrfz_" + skill + "_append"] = '<div class="skill">【' + get.translation(skill) + '】</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + "</span></div><br><br>";
					var card = {
						fullimage: true,
						image: "ext:whitherHelm/image/orther/alannamrfz_equip.png",
						type: "equip",
						enable: true,
						selectTarget: -1,
						filterCard(card, player, target) {
							if (player != target) return false;
							return target.canEquip(card, true);
						},
						modTarget: true,
						allowMultiple: false,
						content: lib.element.content.equipCard,
						toself: true,
						ai: {},
						skills: [],
						destroy: true,
					};
					if (subtype === "equip1") card.distance = { attackFrom: -2 };
					else if (subtype === "equip3") card.distance = { globalTo: 1 };
					else if (subtype === "equip4") card.distance = { globalFrom: -1 };
					// @ts-ignore
					card.ai.equipValue = function (card, player) {
						let val = 10;
						if (player.hasSkill("qixiemrfz")) val *= 0.4;
						else val *= 0.6;
						return val;
					};
					card.subtype = subtype;
					// @ts-ignore
					card.skills.add(skill);

					lib.card["qixiemrfz_" + skill] = card;
				}
			},
			group: ["qixiemrfz_clear"],
			subSkill: {
				clear: {
					trigger: { player: "phaseEnd" },
					charlotte: true,
					silent: true,
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.qixiemrfz = [];
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player(player) {
						if (game.countPlayer(char => char.hasEmptySlot() && get.attitude(player, char) > 2) < 1) return 0;
						return 1;
					},
					target(player, target) {
						let att = get.attitude(player, target);
						let num = 1;
						if (att > 2 && target.hasEmptySlot()) num += 1;
						if (target === player) num += 0.5;
						return num;
					},
				},
			},
		},
	},
};
