import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_225_haak", { pack: "legendSJZX", sex: "male", group: "limrfz", hp: 4, skills: ["guaiyaomrfz", "qizhenmrfz"],llm:"DeepSeek-4.1-Flash" });

/**
 * 【奇针】AI 辅助函数。
 *
 * 技能的机制（决定 AI 怎么算）：
 * - 弃 N 张**类型互异**的牌 → 视为对目标使用 N 张【杀】（无次数限制）；
 * - 每张【杀】造成伤害后，阿与该角色各累积 1 层「下一张伤害牌不可响应」，结算完再各摸等量的牌；
 * - 所以「弃 N 张」的收益 ≈ N 点伤害 + 双方各 N 张牌，代价是 N 张手牌。
 *
 * 因此 AI 的核心判断只有两件事：**这套杀打不打得死/值不值**，以及**弃几张最划算**。
 */

/** 卖血标签：任一即视为卖血角色（含防御型卖血） */
const GAIHUA_MAIXIE_TAGS = ["maixie", "maixie_hp", "maixie_defend"];

/** 是否卖血角色 */
function isMaixie(player) {
	return GAIHUA_MAIXIE_TAGS.some(tag => player.hasSkillTag(tag, true, null, true));
}

/** 手牌中某牌名的张数（只数自己能看到的，即自己的手牌） */
function countHandCards(player, name) {
	return player.countCards("h", card => get.name(card) === name);
}

/**
 * 技能能把目标打到什么程度。
 *
 * - 敌方：需要 `N + 手里【杀】数 ≥ 体力（卖血则 +2）`，才是「可能击杀」；
 * - 己方：目标是卖血角色，且「全中之后」仍能被手里的【桃】救回来才算安全。
 */

/** 敌方视角：能造成击杀所需的【杀】总数下界 */
function enemyRequiredDamage(target) {
	return target.hp + (isMaixie(target) ? 2 : 0);
}

/**
 * 可供弃置的牌按类型分组后的最大可选张数（受「类型互异」与 `selectCard: [1,3]` 限制）。
 * 类型用 `get.type2` 判断，与技能里的 `filterCard` 保持一致。
 */
function maxDiscardable(player) {
	const types = new Set();
	for (const card of player.getCards("he")) {
		types.add(get.type2(card));
		if (types.size >= 3) break;
	}
	return Math.min(3, types.size);
}

/**
 * 选中该目标时，**应该弃几张牌**（1~3，0 表示不该选）。
 *
 * 这决定了实际打出的【杀】张数，所以选牌 AI（`ai1`）需要知道它，
 * 否则会出现「喂残血队友却弃了 3 张」这种会把人打死的操作。
 *
 * - 喂己方：`N = min(可弃上限, 体力 + 手中【桃】数 − 1, 3)`——保证全中之后仍能被【桃】救回；
 * - 打敌方：能用几张就用几张（伤害与层数都随 N 线性增长，见 `enemyRequiredDamage`）。
 */
function qizhenDiscardCount(player, target) {
	// 打不到就不该选（距离 / 次数等由引擎判定）
	if (!player.canUse("sha", target, undefined, false)) return 0;
	const maxCards = maxDiscardable(player);
	if (maxCards < 1) return 0;
	if (get.attitude(player, target) > 0) {
		if (!isMaixie(target)) return 0;
		// 取满足「体力 + 桃数 − N > 0」的最大 N
		const safeMax = target.hp + countHandCards(player, "tao") - 1;
		if (safeMax < 1) return 0;
		return Math.min(maxCards, safeMax, 3);
	}
	// 敌方：能把人打死才值得打，且尽量多弃
	const need = enemyRequiredDamage(target);
	if (maxCards + countHandCards(player, "sha") < need) return 0;
	return maxCards;
}

/**
 * 本轮 AI 计划弃几张牌：取「收益最高的那个目标」所需的张数。
 *
 * 选牌（`ai1`）发生在选目标之前，此时还没有目标可选，
 * 所以先按这一步把计划定下来，选牌与选目标都读同一个值，二者才不会打架。
 * 结果缓存在事件上，避免每张牌都重算一遍。
 */
function getQizhenWanted(player) {
	const evt = get.event();
	if (evt._qizhenWanted === undefined) {
		let bestScore = 0,
			bestNum = 1;
		for (const current of game.filterPlayer(cur => cur !== player && player.canUse("sha", cur, undefined, false))) {
			const score = qizhenTargetScore(player, current);
			if (score > bestScore) {
				bestScore = score;
				bestNum = qizhenDiscardCount(player, current);
			}
		}
		evt._qizhenWanted = Math.max(1, bestNum);
	}
	return evt._qizhenWanted;
}

/**
 * 【奇针】对单个目标的收益评分（`<= 0` 表示不该选）。
 *
 * 两条线并行：
 *
 * **打敌方**——只有当这套杀「可能打死」时才考虑：
 *   `可弃张数 + 手牌【杀】数 ≥ 其体力（卖血角色 +2）`。
 *   目标手牌越少越容易命中，因此权重随其手牌数下降而上升。
 *
 * **喂己方**——目标是卖血角色，且「全中也死不了」：
 *   弃 N 张后其剩余体力仍能被自己手里的【桃】救回（`体力 + 桃数 − N > 0`），
 *   N 取满足该式的最大值（≤3），因为伤害与摸牌都按 N 线性增长。
 */
function qizhenTargetScore(player, target) {
	if (!target || target === player) return 0;
	// 打不到就不该选（距离 / 次数等由引擎判定）
	if (!player.canUse("sha", target, undefined, false)) return 0;
	const num = qizhenDiscardCount(player, target);
	if (num < 1) return 0;

	if (get.attitude(player, target) > 0) {
		// —— 喂己方 ——
		// 每层奇针（不可响应 + 双方各摸一张）对卖血角色价值很高
		return 6 + num * 2.5 + (target.hp <= 2 ? 2 : 0);
	}

	// —— 打敌方 ——
	let value = 8;
	// 手牌越少越容易命中
	value += Math.max(0, 2 - target.countCards("h") * 0.35);
	if (isMaixie(target)) value -= 1.5;
	value -= Math.min(2, target.countCards("h") * 0.15);
	return value;
}

skill({
	qizhenmrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player, name, target) {
			return player.countCards("he") > 1 && player.hasUseTarget("sha", undefined, false);
		},
		filterCard(card, player) {
			return !ui.selected.cards.map(i=>get.type2(i)).includes(get.type2(card)!);
		},
		complexCard:true,
		selectCard: [1, 3],
		filterTarget(card, player, target) {
			return target !== player && player.canUse("sha", target, undefined, false);
		},
		async content(event, trigger, player) {
			const num = event.cards.length;
			const target = event.targets[0];
			player.addTempSkill("qizhenmrfz_eff", { player: "phaseUseEnd" });
			// 【需求3】按敌我关系临时改变目标对【杀】的响应倾向：
			//   己方 → `noShan`：挨完不死就不出【闪】（吃伤害以触发卖血、并累积层数）
			//   敌方 → `useShan`：有机会就一定出【闪】
			//
			// ⚠️ 必须在**打完这几刀之后**立刻移除，不能挂到 `phaseUseEnd`：
			// 否则同一出牌阶段内后续任何一张【杀】都会被带偏。
			const tag = get.attitude(player, target) > 0 ? "noShan" : "useShan";
			const skill = `qizhenmrfz_${tag}`;
			target.addSkill(skill);
			try {
				for (let i = 0; i < num; i++) {
					await player.chooseUseTarget({
						card: get.autoViewAs({ name: "sha", isCard: true, storage: { qizhenmrfz: true } }),
						forced: true,
						filterTarget(card, player, target) {
							return event.targets.includes(target);
						},
						addCount:false
					});
				}
			} finally {
				target.removeSkill(skill);
				delete target.storage[skill];
			}
		},
		async contentAfter(event, trigger, player) {
			const chars = [player, event.targets[0]].filter(i=>i.isAlive());
			for (const char of chars) {
				while (char.storage.qizhenmrfz_eff--) {
					if (!char.hasSkill("qizhenmrfz_buff")) char.addTempSkill("qizhenmrfz_buff", { player: "dieAfter" });
					char.addMark("qizhenmrfz_buff", 1, false);
					char.addTip("qizhenmrfz_buff_tips", `奇针${player.countMark("qizhenmrfz_buff")}`);
					char.draw();
				}
			}
		},
		/**
		 * 【奇针】AI。
		 *
		 * 两条线并行判断，取收益最高的那个目标：
		 *
		 * **打敌方**——只有当这套杀「可能打死」时才考虑：
		 *   `可弃张数 + 手牌【杀】数 ≥ 其体力（卖血角色 +2）`。
		 *   目标手牌越少越容易命中，因此权重随其手牌数下降而上升。
		 *
		 * **喂己方**——目标是卖血角色，且「全中也死不了」：
		 *   弃 N 张后其剩余体力仍能被自己手里的【桃】救回（`体力 + 桃数 − N > 0`）。
		 *   N 取满足该式的最大值（≤3），因为伤害与摸牌都按 N 线性增长。
		 */
		ai: {
			order: 6,
			result: {
				/**
				 * `target` 的返回值即该目标对本技能的收益评分（`ai.basic.chooseTarget` 用它挑目标）。
				 * 返回 ≤0 表示不该选。
				 */
				target(player, target) {
					if (!target || target === player) return 0;
					return qizhenTargetScore(player, target);
				},
			},
		},
		/**
		 * 选牌 AI（`ai.basic.chooseCard` 逐张调用）。
		 *
		 * ⚠️ 顺序很关键：`chooseCardTarget` 里**先选牌、再选目标**
		 * （`content.ts`：`chooseCard` → `chooseTarget`），所以这里拿不到目标，
		 * 必须自己先算出「本轮最优目标」，再按它需要的张数决定弃几张。
		 *
		 * 两个目标：
		 * 1. **弃张数跟着计划走**——喂残血队友时只弃到「打不死」为止，不能一上来就弃满 3 张；
		 * 2. 在符合条件的牌里挑**最不值钱**的，同时保护【桃】（留着救人）与【杀】（输出与击杀基数）。
		 */
		ai1(card) {
			const player = get.player();
			const wanted = getQizhenWanted(player);
			// 已经弃够计划张数就不再往上加
			if (ui.selected.cards.length >= wanted) return -1;
			let value = get.value(card, player);
			const name = get.name(card);
			if (name === "tao") value += player.hp >= player.maxHp ? 1 : 6;
			else if (name === "sha") value += 3;
			return 9 - value;
		},
		/**
		 * 选目标 AI：与 `ai.result.target` 同一套评分，但还要与**已选牌数**相容——
		 * 已选几张牌就只会打出几刀，收益按 `已选/应弃` 打折。
		 *
		 * 随机性（按需求）：**场上没有任何正收益目标时**，以 20% 概率改打「收益最高的那个」
		 * （把它抬成正分让 `ai.basic.chooseTarget` 选中），否则整体放弃。
		 * 掷骰结果缓存到事件上，保证同一轮评估内所有目标看到**同一个**随机结果，
		 * 不会出现「A 说打、B 说不打」的互相矛盾。
		 */
		ai2(target) {
			const player = get.player();
			const wanted = getQizhenWanted(player);
			const selected = Math.max(1, ui.selected.cards.length);
			const weight = Math.min(1, selected / Math.max(1, wanted));
			const score = qizhenTargetScore(player, target);
			if (score > 0) return score * weight;

			// —— 全场无正收益目标：20% 概率勉强发动一次 ——
			const evt = get.event();
			if (evt._qizhenRoll === undefined) evt._qizhenRoll = Math.random() <= 0.2;
			if (!evt._qizhenRoll) return 0;
			// 掷中了：只在「原始分数最高」的那个目标上成立，其余仍然放弃
			const candidates = game.filterPlayer(current => current !== player && player.canUse("sha", current, undefined, false));
			const top = Math.max(...candidates.map(current => qizhenTargetScore(player, current)));
			return qizhenTargetScore(player, target) === top ? weight : 0;
		},
		subSkill: {
			eff: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: {
					source: "damageEnd",
				},
				filter(event, player, name, target) {
					return event.card && event.card.storage.qizhenmrfz && event.player;
				},
				async content(event, trigger, player) {
					const chars = [player, trigger.player].filter(i=>i.isAlive());
					chars.forEach(char => {
						char.storage.qizhenmrfz_eff ??= 0;
						char.storage.qizhenmrfz_eff += 1;
					});
				},
			},
			buff: {
				charlotte: true,
				forceDie: true,
				forced: true,
				silent: true,
				onremove(player, type) {
					delete player.storage[type];
					delete player.storage["qizhenmrfz_eff"];
					player.removeTip("qizhenmrfz_buff_tips");
				},
				intro: {
					content(storage, player, skill) {
						const num = player.countMark("qizhenmrfz_buff");
						if (num < 1) return `·当你能看到这条信息说明这个技能出现了bug，请向作者反馈`;
						if (!player.isPhaseUsing()) return `·不是你的出牌阶段`;
						return `·下${get.cnNumber(num)}张伤害类牌无距离、次数限制且不可响应`;
					},
				},
				trigger: {
					player: "useCard",
				},
				filter(event, player, name, target) {
					return get.is.damageCard(event.card) && player.countMark("qizhenmrfz_buff") > 0 && player.isPhaseUsing();
				},
				async content(event, trigger, player) {
					player.popup(get.translation("qizhenmrfz"));
					trigger.directHit.addArray(game.players);
					player.removeMark("qizhenmrfz_buff", 1, false);
				},
				group: "qizhenmrfz_buff_next",
				mod: {
					targetInRange(card: Card, player, target) {
						if (get.is.damageCard(card) && player.countMark("qizhenmrfz_buff") > 0) {
							return true;
						}
					},
					cardUsable(card, player, num) {
						if (get.is.damageCard(card) && player.countMark("qizhenmrfz_buff") > 0) {
							return Infinity;
						}
					},
				},
			},
			buff_next: {
				charlotte: true,
				forced: true,
				silent: true,
				trigger: {
					player: "qizhenmrfz_buffAfter",
				},
				async content(event, trigger, player) {
					player.addTip("qizhenmrfz_buff_tips", `奇针${player.countMark("qizhenmrfz_buff")}`);
					if (player.countMark("qizhenmrfz_buff") < 1) player.removeSkill("qizhenmrfz_buff");
				},
			},
			/**
			 * 【需求3】己方目标：受到这一刀的伤害不会阵亡时，不出【闪】。
			 *
			 * 用的是引擎现成的 `ai.noShan` 标签——`card/standard.js` 的【杀】结算里会读它
			 * （`target.hasSkillTag("noShan", null, "use")`），为真则直接判定不闪。
			 *
			 * 作用范围靠**挂载时机**限定：本技能只在奇针那几刀结算期间被临时挂到目标身上，
			 * 打完立刻用 `removeSkill` 摘掉（见 `content`），因此不需要在过滤里反查事件，
			 * 也不会污染同一阶段内后续其它【杀】。
			 */
			noShan: {
				charlotte: true,
				silent: true,
				ai: {
					noShan: true,
					skillTagFilter(player, tag, arg) {
						if (arg !== "use") return false;
						// 挨这一刀不会阵亡才不闪（会死的话仍然正常出闪保命）
						return player.hp > 1 || player.countCards("hs", "tao") > 0;
					},
				},
			},
			/**
			 * 【需求3】敌方目标：有【闪】就一定出。
			 *
			 * `ai.useShan` 会让【杀】结算的 `toUse` 判定直接为真（`card/standard.js`）。
			 * 与 `noShan` 一样，靠挂载窗口限定作用范围。
			 */
			useShan: {
				charlotte: true,
				silent: true,
				ai: {
					useShan: true,
					skillTagFilter(player, tag, arg) {
						return arg === "use";
					},
				},
			},
		},
	},
	guaiyaomrfz: {
		audio: ["选中干员2", "选中干员1"],
		trigger: {
			source: "damageEnd",
		},
		async content(event, trigger, player) {
			const effects: Record<string, { prompt: string; filterTarget: (card: Card, player: Player, target: Player) => boolean; ai: (target: Player) => number; content: (target: Player) => void }> = {
				draw: {
					prompt: "令一名角色摸一张牌",
					filterTarget(card, player, target) {
						return true;
					},
					ai(target) {
						return get.attitude2(target);
					},
					async content(target) {
						await target.draw();
					},
				},
				recover: {
					prompt: "令一名角色回复一点体力",
					filterTarget(card, player, target) {
						return true;
					},
					ai(target) {
						if (target.getDamagedHp() < 1) return -1;
						return get.attitude2(target);
					},
					async content(target) {
						await target.recover();
					},
				},
				lose: {
					prompt: "令一名角色流失一点体力",
					filterTarget(card, player, target) {
						return true;
					},
					ai(target) {
						return -get.attitude2(target);
					},
					async content(target) {
						await target.loseHp();
					},
				},
				discard: {
					prompt: "令一名角色弃置一张牌",
					filterTarget(card, player, target) {
						return target.countCards("he") > 0;
					},
					ai(target) {
						return -get.attitude2(target);
					},
					async content(target) {
						await target.chooseToDiscard({
							forced: true,
							prompt: "【怪药】:请弃置一张牌",
							position: "he",
							ai(card) {
								return -get.value(card);
							},
						});
					},
				},
			};

			const trans = {
				draw: "怪药·摸牌",
				recover: "怪药·回复",
				lose: "怪药·体流",
				discard: "怪药·弃牌",
			};

			//原本是执行两项的，但是太超模了
			const acts = Object.keys(effects).randomGets(1);

			// game.log(player,"的","#y【怪药】","即将执行",acts.map(i=>trans[i]).join("和"));

			for (const key of acts) {
				const { prompt, filterTarget, content, ai } = effects[key];
				player.popup(trans[key]);
				const result = await player
					.chooseTarget({
						prompt,
						filterTarget,
						ai,
						forced: true,
					})
					.forResult();
				if (result.targets) {
					content(result.targets[0]);
				}
			}
		},
	},
});

translate({
	char_225_haak: "阿",
	qizhenmrfz: "奇针",
	qizhenmrfz_info: "出牌阶段限一次，你可以弃置至多三张类型不同的手牌并选择一名其他角色，然后你视为对其使用的等量的【杀】（无次数限制），你因此使用的杀造成伤害后，你与受伤角色于本技能结算完成后执行一次下列效果（可叠加）：<br>1.出牌阶段使用的下一张伤害类牌无距离、次数限制且不可响应（可叠加）;<br>2.摸一张牌。",
	guaiyaomrfz: "怪药",
	guaiyaomrfz_info: "当你造成伤害后，你可以随机执行下列效果中的任意一项：<br>1.令一名角色摸一张牌;<br>2.令一名角色回复一点体力;<br>3.令一名角色流失一点体力;<br>4.令一名角色弃置一张牌。",
});

characterIntro("char_225_haak", "阿，经龙门鲤氏侦探事务所所长老鲤推荐而来的医疗人员，曾是活跃于龙门灰色地带的知名黑医生。</br>在加入后，展现出了惊人的医疗理论知识储备以及临床经验，但也表现出让人担忧的医疗风格。</br>不过根据凯尔希医生的综合评估，被暂时推荐到医疗装备科和技术开发组。");

characterTitle("char_225_haak", "无证奇医");
