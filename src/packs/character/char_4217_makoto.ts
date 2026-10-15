import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const resigter = function (name = "char_4217_makoto") {
	character(name, {
		skills: ["bujimrfz", "fuanmrfz"],
		sex: "male",
		hp: 4,
		group: "persona",
		whichWay: {
			linkage: true,
			arknight: {
				camp: "persona",
			},
		},
		pack: "legendSJZX",
		llm: "Qwen-3.8-Flash",
	});

	characterTitle(name, whichWayUtil.colorize("#blue#开辟明日之人#"));
	characterIntro(name, "结城理，1102年3月于中庭公证所登记为拉特兰公民亲属，根据拉特兰公民权利章程附录第三十四条，由圣马尔索综合学校接收入学。<br>教师评语：结城理同学处事冷静，团结同学，尊敬师长，积极参加社会实践活动，在志愿实践中获得了一致赞赏。望持之以恒，再接再厉，百尺竿头，更进一步。");

	/**
	 * 人格面具的静态描述。dynamicTranslate 会在其后追加一行当前状态注脚，
	 * 因此这里保留[①…;②…]的完整写法，图鉴/无主视角也能看到两个分支。
	 */
	const THANATOS_INFO = `转换技，当你脱离濒死状态后，你令至多X（X = 你的[①体力值;②已损失体力值])名角色[①进行三次${get.poptip("shandian")}判定;②弃一张手牌并受到一点伤害]。本技能的状态切换条件改为进入濒死状态时切换且你失去此技能不会重置此技能的状态。`;
	const ORPHEUS_INFO = "转换技，回合结束时，你令至多[①Y;②一]名角色各回复[①一;②Y]点体力，且溢出的体力值改为摸等量张牌（Y = 你的[①体力值;②已损失体力值]）。本技能的状态切换条件改为进入濒死状态时切换且你失去此技能不会重置此技能的状态。";

	translate({
		[name]: "结城理",

		bujimrfz: "不羁",
		bujimrfz_info: `每轮开始时，你可以流失N（N∈[1,你的体力上限-1]）点体力，摸N张牌、本轮手牌上限+N并且本轮获得前N个“${get.poptip("sjzx_persona")}”。`,
		thanatos_mrfz: "塔纳托斯",
		thanatos_mrfz_info: THANATOS_INFO,
		orpheus_mrfz: "俄尔普斯",
		orpheus_mrfz_info: ORPHEUS_INFO,

		fuanmrfz: "赴暗",
		fuanmrfz_info: "锁定技，当你进入濒死状态时，你将牌堆顶3-Z张牌置于你的武将牌上，称之为“坚”，然后若你的“坚”中有相同点数的牌，你将其置入弃牌堆，否则你将体力调整至1。（Z=你的“人格面具”数）",
	});

	const CLEARS = ["bujimrfz_handcard", "thanatos_mrfz", "orpheus_mrfz"];
	/** “人格面具”清单（不羁赋予的两个转换技），赴暗据此决定“坚”的张数 */
	const PERSONAS = ["thanatos_mrfz", "orpheus_mrfz"];

	/** 人格面具的分支取值：状态①取体力值，状态②取已损失体力值（即塔纳托斯的 X 与俄尔普斯的 Y） */
	const personaValue = (player: Player, mark: number) => (mark === 1 ? player.hp : player.getDamagedHp());
	/** 人格面具的当前状态：只有 storage 为 2 才是②，未初始化等其余情况一律按①显示 */
	const personaState = (player: Player, skill: string) => (player.storage[skill] === 2 ? 2 : 1);
	/** 赴暗要置于武将牌上的“坚”的张数：3 - 持有的“人格面具”数 */
	const fuanCount = (player: Player) => 3 - PERSONAS.filter(i => player.hasSkill(i)).length;

	/**
	 * 把描述里的 `[①甲;②乙]` 分支段按当前状态上色：在用的那段红（#r）、没在用的那段灰（#s），
	 * 写法与 `titimrfz_mingshimrfz`/`lvmaimrfz` 的动态翻译一致。
	 * 直接从静态文案替换而不是另写一句，避免动态版与图鉴版的描述各改各的。
	 */
	const colorBranches = (text: string, mark: number) =>
		text.replace(/\[①([^;\]]*);②([^\]]*)\]/g, (_m, one, two) => (mark === 1 ? `#r①${one}#;#s②${two}#` : `#s①${one}#;#r②${two}#`));

	/** 塔纳托斯的状态注脚：标记悬停、动态翻译后缀、选目标提示共用这一份文案 */
	const thanatosNote = (player: Player) => {
		const mark = personaState(player, "thanatos_mrfz");
		const x = Math.max(0, personaValue(player, mark));
		const effect = mark === 1 ? `进行三次${get.poptip("shandian")}判定` : "弃一张手牌并受到一点伤害";
		return whichWayUtil.colorize(`#r${mark === 1 ? "①X=体力值" : "②X=已损失体力值"}=${get.cnNumber(x)}：你令至多${get.cnNumber(x)}名角色${effect}#`);
	};
	/** 俄尔普斯的状态注脚 */
	const orpheusNote = (player: Player) => {
		const mark = personaState(player, "orpheus_mrfz");
		const y = Math.max(0, personaValue(player, mark));
		const effect = mark === 1 ? `至多${get.cnNumber(y)}名角色各回复一点体力` : `一名角色回复${get.cnNumber(y)}点体力`;
		return whichWayUtil.colorize(`#r${mark === 1 ? "①Y=体力值" : "②Y=已损失体力值"}=${get.cnNumber(y)}：${effect}，溢出的体力值改为摸等量张牌#`);
	};

	//动态翻译会整体替换 _info：描述里的[①…;②…]按当前状态上色（在用的红、没在用的灰），末尾再补一行已经算好的数值
	dynamicTranslate({
		thanatos_mrfz(player) {
			const mark = personaState(player, "thanatos_mrfz");
			return whichWayUtil.colorize(colorBranches(THANATOS_INFO, mark)) + "<br>" + thanatosNote(player);
		},
		orpheus_mrfz(player) {
			const mark = personaState(player, "orpheus_mrfz");
			return whichWayUtil.colorize(colorBranches(ORPHEUS_INFO, mark)) + "<br>" + orpheusNote(player);
		},
	});

	skill({
		bujimrfz: {
			audio: ["作战中1", "作战中2"],
			derivation: PERSONAS,
			onremove(player, type) {
				player.removeSkill(CLEARS.filter(i => player.hasSkill(i)));
			},
			trigger: {
				global: "roundStart",
			},
			async cost(event, trigger, player) {
				const result = await player
					.chooseNumbers({
						list: [
							{
								min: 1,
								max: player.maxHp - 1,
								prompt: `你可以流失N（N∈[1,你的体力上限-1]）点体力，摸N张牌、本轮手牌上限+N并且本轮获得前N个“${get.poptip("sjzx_persona")}”。`,
							},
						],
						processAI(event) {
							const player = get.player();
							if (!["buqu", "fuanmrfz"].some(s => player.hasSkill(s))) {
								return player.hp > 2 ? [1] : false;
							}
							if (player.hp > 2) return [2];
							return Math.random() >= 0.2 ? [2] : false;
						},
					})
					.forResult();

				if (result.bool) {
					event.result = {
						bool: true,
						cost_data: result.numbers[0],
					};
				}
			},
			async content(event, trigger, player) {
				const num: number = event.cost_data;

				if (num >= 1) {
					player.addSkill("thanatos_mrfz");
				}
				if (num >= 2) {
					player.addSkill("orpheus_mrfz");
				}

				//摸N张牌、本轮手牌上限+N
				await player.draw(num);
				player.addMark("bujimrfz_handcard", num, false);
				player.markSkill("bujimrfz_handcard");
				player.addSkill("bujimrfz_handcard");
				await player.loseHp(num);
			},
			group: "bujimrfz_clear",
			subSkill: {
				handcard: {
					charlotte: true,
					silent: true,
					onremove(player, type) {
						delete player.storage[type];
						player.unmarkSkill(type);
					},
					mark: true,
					intro: {
						content(storage, player, skill) {
							return `·本轮手牌上限+${storage}`;
						},
					},
					mod: {
						maxHandcard(player, num) {
							return (num += player.countMark("bujimrfz_handcard"));
						},
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "roundStart",
					},
					firstDo: true,
					filter(event, player, name, target) {
						return CLEARS.some(i => player.hasSkill(i));
					},
					async content(event, trigger, player) {
						player.removeSkill(CLEARS.filter(i => player.hasSkill(i)));
					},
				},
			},
		},
		/**
		 * 转换技，当你脱离濒死状态后，你令至多X（X = 你的[①体力值;②已损失体力值])名角色[①进行三次${get.poptip("shandian")}判定;②弃一张手牌并受到一点伤害]。本技能的状态切换条件改为进入濒死状态时切换且你失去此技能不会重置此技能的状态。
		 */
		thanatos_mrfz: {
			audio: ["选中干员1", "选中干员2"],
			charlotte: true,
			//同 orpheus_mrfz：forced 会让引擎跳过 cost，导致 content 拿不到 event.targets
			mark: true,
			marktext: "☯",
			intro: {
				//角标直接写①/②：☯只有正倒两种朝向，光靠旋转不足以辨认当前分支
				markcount(storage) {
					return storage === 2 ? "②" : "①";
				},
				content(storage, player) {
					return `·${thanatosNote(player)}`;
				},
			},
			trigger: {
				player: "dyingAfter",
			},
			init(player, skill) {
				player.storage[skill] = 1;
			},
			zhuanhuanji(player, skill) {
				player.storage[skill] = player.storage[skill] === 1 ? 2 : 1;
				//changeZhuanhuanji 的默认广播只把 ☯ 再转 180°，不重算角标；同步 storage 让各端刷新①/②
				player.syncStorage(skill);
			},
			filter(event, player, name, target) {
				const mark = personaState(player, "thanatos_mrfz");
				const x = personaValue(player, mark);
				if (x < 1) return false;
				if (mark === 1) return game.hasPlayer(c => lib.filter.judge(get.autoViewAs({ name: "shandian" }), player, c));
				return mark === 2;
			},
			async cost(event, trigger, player) {
				const mark = personaState(player, "thanatos_mrfz");
				const x = personaValue(player, mark);
				event.result = await player
					.chooseTarget({
						prompt: get.prompt("thanatos_mrfz"),
						prompt2: thanatosNote(player),
						selectTarget() {
							return [1, x];
						},
						ai(target) {
							return get.attitude2(target) < 0 ? [1, 2, 3].randomGet() : -1;
						},
						filterTarget(card, player, target) {
							if (mark === 1) return lib.filter.judge(get.autoViewAs({ name: "shandian" }), player, target);
							return true;
						},
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const targets = event.targets;
				const mark = personaState(player, "thanatos_mrfz");
				for (let target of targets) {
					if (mark === 1) {
						for (let i of [0, 1, 2]) {
							if (target.isAlive()) {
								const r = await judgeThunder(target);
							}
						}
					} else {
						if (target.countCards("h") > 0) {
							await target.chooseToDiscard({
								prompt: "【塔纳托斯】:请弃置一张手牌",
								forced: true,
								ai(card) {
									return -get.value(card);
								},
							});
						}
						await target.damage({
							num: 1,
							source: player,
						});
					}
				}

				async function judgeThunder(player: Player) {
					const result = await player
						.judge({
							judge(card) {
								return lib.card["shandian"].judge(card);
							},
							judge2(result) {
								return lib.card["shandian"].judge2(result);
							},
							card: get.autoViewAs({ name: "shandian" }),
						})
						.forResult();
					if (result.bool === false) {
						await player.damage(3, "thunder", "nosource");
					}
					return result;
				}
			},
			group: "thanatos_mrfz_change",
			subSkill: {
				change: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "dying",
					},
					async content(event, trigger, player) {
						player.changeZhuanhuanji("thanatos_mrfz");
					},
				},
			},
		},
		/**
		 * 转换技，回合结束时，你令至多[①Y;②一]名角色各回复[①一;②Y]点体力，且溢出的体力值改为摸等量张牌（Y = 你的[①体力值;②已损失体力值]）。本技能的状态切换条件改为进入濒死状态时切换且你失去此技能不会重置此技能的状态。
		 */
		orpheus_mrfz: {
			audio: ["部署1", "部署2"],
			charlotte: true,
			//不能写 forced：content.ts:4125 对 forced 技能直接用 {bool:true} 跳过整个 cost，
			//选目标不会发生，content 里的 event.targets 会是 undefined
			mark: true,
			marktext: "☯",
			intro: {
				markcount(storage) {
					return storage === 2 ? "②" : "①";
				},
				content(storage, player) {
					return `·${orpheusNote(player)}`;
				},
			},
			trigger: {
				player: "phaseEnd",
			},
			init(player, skill) {
				player.storage[skill] = 1;
			},
			zhuanhuanji(player, skill) {
				player.storage[skill] = player.storage[skill] === 1 ? 2 : 1;
				//同 thanatos_mrfz：让①/②角标与悬停内容跟着刷新
				player.syncStorage(skill);
			},
			filter(event, player, name, target) {
				//状态①的 Y 是目标数上限、状态②的 Y 是回复量，为 0 时发动无意义
				return personaValue(player, personaState(player, "orpheus_mrfz")) >= 1;
			},
			async cost(event, trigger, player) {
				const mark = personaState(player, "orpheus_mrfz");
				const y = personaValue(player, mark);
				const max = mark === 1 ? y : 1;
				event.result = await player
					.chooseTarget({
						prompt: get.prompt("orpheus_mrfz"),
						prompt2: orpheusNote(player),
						selectTarget: [1, max],
						ai(target) {
							return get.attitude2(target) < 0 ? -1 : 1;
						},
						//满血的角色也可以被选：回复不掉的体力值会折算成摸牌
						filterTarget(card, player, target) {
							return target.isIn();
						},
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const mark = personaState(player, "orpheus_mrfz");
				//状态①每名目标回复1点，状态②（唯一那名目标）回复Y点
				const num = mark === 1 ? 1 : personaValue(player, mark);
				for (let target of event.targets) {
					//体力上限被压低时 getDamagedHp 可能为负，这里按“回复不了几点”取非负值
					const recoverNum = Math.max(0, Math.min(num, target.getDamagedHp()));
					const overflow = num - recoverNum;
					if (recoverNum > 0) {
						await target.recover({ num: recoverNum, source: player });
					}
					if (overflow > 0) {
						await target.draw(overflow);
					}
				}
			},
			group: "orpheus_mrfz_change",
			subSkill: {
				change: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "dying",
					},
					async content(event, trigger, player) {
						player.changeZhuanhuanji("orpheus_mrfz");
					},
				},
			},
		},
		/**
		 * 锁定技，当你进入濒死状态时，你将牌堆顶3-Z张牌置于你的武将牌上，称之为“坚”，然后若你的“坚”中有相同点数的牌，你将其置入弃牌堆，否则你将体力调整至1。（Z=你的“人格面具”数）
		 */
		fuanmrfz: {
			audio: ["作战中3", "作战中4"],
			forced: true,
			trigger: {
				player: "dying",
			},
			firstDo: true,
			priority: 20,
			marktext: "坚",
			intro: {
				name: "坚",
				content: "expansion",
				markcount: "expansion",
			},
			onremove(player, skill) {
				const cards = player.getExpansions(skill);
				if (cards.length) {
					player.loseToDiscardpile({ cards });
				}
			},
			filter(event, player, name, target) {
				return player.isDying() && fuanCount(player) > 0;
			},
			async content(event, trigger, player) {
				const next = player.addToExpansion({
					/**
					 * get.cards(fuanCount(player)), "gain2"
					 */
					cards: get.cards(fuanCount(player)),
					animate: "gain2",
				});
				next.gaintag.add("fuanmrfz");
				await next;

				const expansions = player.getExpansions("fuanmrfz");
				//点数不唯一的“坚”全部弃掉（含新置入的牌彼此重复的情况），留存的“坚”因此始终点数互不相同
				const duplicated = expansions.filter(card => expansions.filter(i => get.number(i) == get.number(card)).length > 1);
				if (duplicated.length) {
					await player.loseToDiscardpile({ cards: duplicated });
					return;
				}
				//体力调至1：changeHp 会把角色移出濒死队列并结束本次濒死流程，无需再求桃
				await player.recoverTo(1);
			},
		},
	});
};

resigter();
