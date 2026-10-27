import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_134_ifrit", { pack: "legendSJZX", sex: "female", group: "lymrfz", hp: 3, skills: ["yanzhuomrfz", "yanbaomrfz", "huishenmrfz"], llm: "DeepSeek-4.1-Flash" });

/**
 * 伊芙利特
 *
 * 三个技能都围绕「火属性伤害」与「伤害类牌」：
 * - 炎灼：距离 1 的角色的准备阶段逼其二选一（给你攻击范围，或吃火伤）；
 *   自身受火伤时取消并永久 +1 手牌上限。
 * - 炎爆：把一张【杀】改成「攻击范围内全体」。
 * - 毁神：伤害类牌指定目标时，令对方执行 0~3 项惩罚，按执行的项数摸牌。
 */

/**
 * 判断一张牌是否为「伤害类牌」。
 *
 * 用 `get.tag(card, "damage") > 0` —— 这是引擎判断伤害类牌的官方口径
 * （`get.tag` 会把 `damage` / `damage1` 等一并折算），比手写 `get.type() == "trick"`
 * 更准：`【杀】`、`【万箭齐发】`、`【火攻】`、`【决斗】` 都能命中，而 `【桃】` 不会。
 *
 * @param card 待判定的牌
 */
function isDamageCard(card: Card | VCard): boolean {
	if (!card) return false;
	return get.tag(card, "damage") > 0;
}

skill({
	/**
	 * 炎灼
	 *
	 * > 锁定技，与你距离为1的其他角色准备阶段，其须选择令你本轮攻击范围+1或受到一点火属性伤害；
	 * > 当你受到火属性伤害时，取消之，然后你的手牌上限+1。
	 *
	 * 实现拆解：
	 * - 前半是**锁定技**：`forced: true`，距离 1 的其他角色准备阶段强制二选一。
	 *   「令你本轮攻击范围+1」⇒ 给**你自己**挂一个 `roundStart` 到期的临时技能，
	 *   由它的 `mod.attackRange` 提供 +1（每被选一次就多一层，用 `mark` 计数）。
	 * - 后半是**受到火属性伤害时取消**：盯 `damageBegin`（此时还没扣血，
	 *   `trigger.num` 还在），确认 `nature === "fire"` 后 `trigger.cancel()`，
	 *   然后永久 +1 手牌上限（存 `storage`，由常驻 `mod.maxHandcard` 读取）。
	 *   注意用 `damageBegin` 而非 `damageEnd`：伤害要「取消」，必须在结算前拦下。
	 */
	yanzhuomrfz: {
		audio: ["部署1", "作战中1"],
		/**
		 * 前段：距离 1 的其他角色准备阶段二选一。
		 *
		 * 用 `global: "phaseZhunbeiBegin"` + `filter` 限制「与你距离为 1 的其他角色」。
		 * 距离判定用 `get.distance(target, player)`（与 `char_112_siege.ts:45` 的写法一致），
		 * 注意方向：算的是**目标到你**的距离（「与你距离为1」）。
		 */
		trigger: { global: "phaseZhunbeiBegin" },
		forced: true,
		onremove:true,
		filter(event, player) {
			const target = event.player;
			if (!target || target === player) return false;
			if (!target.isIn()) return false;
			if (get.distance(target, player) !== 1) return false;
			return true;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.line(target, "fire");
			const choices = ["令其本轮攻击范围+1", "受到一点火属性伤害"];
			const result = await target
				.chooseControl({
					controls: choices,
					prompt: `【炎灼】:请选择一项`,
					ai() {
						/**
						 * AI 判断：`attacker` 用闭包捕获，不能靠 `get.event().xxx` ——
						 * `get.event()` 返回的是**当前事件**，未必是 `.set("xxx", …)` 的那个，
						 * 取值可能拿到 undefined。
						 */
						const self = get.player();
						const attacker = player;
						const friendly = get.attitude(self, attacker) > 0;
						if (friendly) return choices[0];
						return get.damageEffect(self,self,self,"fire") > 0 ? choices[1] : choices[0];
					},
				})
				.forResult();
			const choice = result?.control ?? choices[1];

			if (choice === choices[0]) {
				//令其（炎灼拥有者）本轮攻击范围 +1
				player.addTempSkill("yanzhuomrfz_range", { global: "roundStart" });
				player.addMark("yanzhuomrfz_range", 1, false);
			} else {
				//受到一点火属性伤害（来源是炎灼拥有者？描述未指明来源，按「无来源」处理更保守）
				await target.damage({ num: 1, nature: "fire",source:player });
			}
		},
		group: "yanzhuomrfz_fire",
		subSkill: {
			/** 「本轮攻击范围+1」的承载技能（每次被选 +1，可叠加） */
			range: {
				charlotte: true,
				silent: true,
				onremove: true,
				mark: true,
				intro: {
					name: "炎灼",
					content: "本轮攻击范围+#",
				},
				mod: {
					attackRange(player, num) {
						return num + (player.countMark("yanzhuomrfz_range") || 0);
					},
				},
			},
			/**
			 * 「当你受到火属性伤害时，取消之，然后你的手牌上限+1」。
			 *
			 * 挂在 `damageBegin`（伤害结算前），确认是火属性后 `trigger.cancel()`；
			 * 手牌上限用 storage 计数 + 常驻 `mod.maxHandcard` 读取（永久生效）。
			 */
			fire: {
				audio:"yanzhuomrfz",
				trigger: { player: "damageBegin" },
				forced: true,
				filter(event, player) {
					return event.nature === "fire" && event.num > 0;
				},
				async content(event, trigger, player) {
					//取消这次火属性伤害
					trigger.cancel();
					//手牌上限永久 +1
					player.storage.yanzhuomrfz_handcard = (player.storage.yanzhuomrfz_handcard || 0) + 1;
					player.markSkill("yanzhuomrfz");
				},
			},
		},
		intro: {
			content(storage, player) {
				const n = player?.storage?.yanzhuomrfz_handcard || 0;
				return `·手牌上限+${n}`;
			},
		},
		mod: {
			/** 受到的每次火属性伤害都换成手牌上限 */
			maxHandcard(player, num) {
				return num + (player.storage.yanzhuomrfz_handcard || 0);
			},
		},
	},

	/**
	 * 炎爆
	 *
	 * > 每回合限一次，当你使用【杀】时，你可以改为指定你攻击范围内所有角色为目标，
	 * > 若此杀造成了伤害，【炎爆】视为未发动过。
	 *
	 * 实现拆解：
	 * - **每回合限一次** ⇒ `usable: 1`（引擎按「每回合」重置 `getStat("skill")`）。
	 * - **当你使用【杀】时** ⇒ 挂 `useCard`（不是 `useCardTo`，要改的是这张牌的目标列表）。
	 * - **改为指定你攻击范围内所有角色** ⇒ 在 `content` 里把 `trigger.targets` 换成
	 *   `game.filterPlayer(可被此杀指定 && 在攻击范围内)`。
	 * - **若此杀造成了伤害，视为未发动过** ⇒ 记下本次 `useCard` 事件的 id，
	 *   再用一个 `damageBegin`/`damageEnd` 监听该牌是否造成过伤害；造成过就
	 *   把 `getStat("skill").yanbaomrfz` 减回去（等价于「视为未发动过」）。
	 */
	yanbaomrfz: {
		audio: ["完成高难行动", "作战中4"],
		trigger: { player: "useCard" },
		usable: 1,
		filter(event, player) {
			//只对【杀】生效
			if (!event.card || get.name(event.card, player) !== "sha") return false;
			//至少要能改到别的目标（原目标之外还有攻击范围内的角色）
			return game.hasPlayer(current => current !== player && player.canUse(event.card, current, false) && get.distance(player, current) <= player.getAttackRange());
		},
		async cost(event, trigger, player) {
			/** 闭包捕获这张【杀】：`ai` 里不能靠 `get.event()` 取，见炎灼的同款说明 */
			const card = trigger.card;
			const result = await player
				.chooseBool({
					prompt: get.prompt("yanbaomrfz"),
					prompt2: "你可以改为指定你攻击范围内所有角色为目标；若此杀造成伤害，【炎爆】视为未发动过",
					ai() {
						const self = get.player();
						//统计改目标后的收益：打到敌人赚、波及友方亏
						let gain = 0;
						for (const current of game.filterPlayer(p => p !== self && self.canUse(card, p, false) && get.distance(self, p) <= self.getAttackRange())) {
							const att = get.attitude(self, current);
							if (att < 0) gain += 1;
							else gain -= 0.8;
						}
						return gain > 0;
					},
				})
				.forResult();
			if (result.bool) event.result = { bool: true };
		},
		async content(event, trigger, player) {
			const card = trigger.card;
			//收集「攻击范围内、且此杀可以指定」的所有其他角色
			const newTargets = game.filterPlayer(current => current !== player && player.canUse(card,current, false) && get.distance(player, current) <= player.getAttackRange());
			if (!newTargets.length) return;

			//替换目标列表（引擎在 useCard 阶段读 trigger.targets）
			const oldTargets = trigger.targets.slice();
			for (const other of oldTargets) {
				if (!newTargets.includes(other)) trigger.targets.remove(other);
			}
			for (const current of newTargets) {
				if (!trigger.targets.includes(current)) trigger.targets.push(current);
			}
			trigger.targets.sortBySeat();
			player.line(trigger.targets, "fire");
			game.log(player, "发动了【炎爆】，将", card, "的目标改为", get.translation(trigger.targets));

			//记下本次使用事件，供「造成伤害则视为未发动过」判断
			const useEventId = get.id();
			player.storage.yanbaomrfz_events ??= [];
			player.storage.yanbaomrfz_events.push(useEventId);
			card.storage ??= {};
			card.storage.yanbaomrfz_id = useEventId;
			//挂监听：本张牌造成伤害后回退次数
			player.addTempSkill("yanbaomrfz_refund", { player: "phaseAfter" });
		},
		subSkill: {
			/**
			 * 「若此杀造成了伤害，【炎爆】视为未发动过」。
			 *
			 * 监听 `damageSource`（伤害已结算、确认造成过），检查该伤害是否来自带
			 * `yanbaomrfz_id` 标记的牌；是则把这次「已发动」记录抹掉，并移除本技能。
			 *
			 * ⚠️ `usable` 的次数是记在 **`getStat("triggerSkill")[技能名]`** 上的
			 * （`library/index.js:11141-11147`：`(player.getStat("triggerSkill")[skill] ?? 0) >= num`
			 * 时就 `return false`），**不是** `getStat("skill")`。减错键的话「视为未发动过」不会生效。
			 */
			refund: {
				charlotte: true,
				silent: true,
				trigger: { source: "damageSource" },
				forced: true,
				filter(event, player) {
					return !!(event.card && event.card.storage && event.card.storage.yanbaomrfz_id);
				},
				async content(event, trigger, player) {
					//@ts-ignore
					const stat = player.getStat().triggerSkill;
					if (stat && typeof stat.yanbaomrfz === "number" && stat.yanbaomrfz > 0) {
						stat.yanbaomrfz--;
					}
					//清掉标记，避免同一张牌后续伤害重复回退
					if (trigger.card?.storage) delete trigger.card.storage.yanbaomrfz_id;
					game.log(player, "的【炎爆】造成了伤害，视为未发动过");
					player.removeSkill("yanbaomrfz_refund");
				},
			},
		},
	},

	/**
	 * 毁神
	 *
	 * > 每名角色每轮限一次，当你使用伤害类牌指定其他角色为目标后，或当你成为伤害类牌指定的目标后，
	 * > 你可以令其执行下列任意项：1.弃置一张手牌;2.本轮下次受到的伤害+1;3.本回合非锁定技失效;
	 * > 然后你摸X张牌。（X=3-其执行的项数）
	 *
	 * 实现拆解：
	 * - **两个时机** ⇒ 引擎在 `useCard` 内部对**每个目标**分别发出
	 *   `useCardToPlayer` / `useCardToTarget` / `useCardToPlayered` / `useCardToTargeted`
	 *   四个时机（`content.ts:10216-10243`，由 `_triggerTo` 逐个目标触发）。
	 *   每个事件都带 `target`（本次这个目标）、`targets`（全部目标）、
	 *   `card`、`player`（**使用者**）。
	 *   这里用 `{ player: "useCardToPlayered", target: "useCardToTargeted" }`：
	 *   前者是「**我**使用的牌指定了目标之后」、后者是「**我**成为别人牌的目标之后」。
	 *   ⚠️ 不要用 `useCardToAfter` —— 引擎里**没有**这个事件名。
	 * - **「令其执行」⇒ 选择权与执行权都在对方**：
	 *   `cost` 只让技能拥有者决定「是否发动」，面板与后续惩罚都问**对方**（`other`）。
	 *   早前版本把面板放在 `cost` 里问 `player`，等于自己替对方选，与描述不符。
	 * - **面板** ⇒ 用 OL 吴懿【奔袭】那套 `chooseButton` + `tdnodes`，三项**每行一项**。
	 * - **每名角色每轮限一次** ⇒ `storage.huishenmrfz_used[playerid] = roundNumber`。
	 * - **你摸X张牌**（X = 3 − 其执行的项数）⇒ 由技能拥有者按实际执行项数摸牌。
	 */
	huishenmrfz: {
		audio: ["作战中3", "作战中2"],
		trigger: { player: "useCardToPlayered", target: "useCardToTargeted" },
		filter(event, player) {
			const target = event.target;
			const source = event.player;
			if (!target || !source) return false;
			//必须有一方是「攻击方」、另一方是「被指定方」，且是本技能拥有者参与的
			const isAttacker = source === player && target !== player;
			const isVictim = target === player && source !== player;
			if (!isAttacker && !isVictim) return false;
			//必须是伤害类牌
			if (!isDamageCard(event.card)) return false;
			//每名角色每轮限一次：这里「每名角色」指被令执行惩罚的那个人
			const other = isAttacker ? target : source;
			if (!other.isIn()) return false;
			const used = player.storage.huishenmrfz_used;
			return !used || used[other.playerid!] !== game.roundNumber;
		},
		/**
		 * `cost` 只让**技能拥有者**决定「是否发动」。
		 *
		 * ⚠️ 选哪几项**不能**放在 `cost` 里：描述是「你可以**令其**执行下列任意项」，
		 * 选择权与执行权都在**对方**（被指定的那个人），而 `cost` 事件是由技能拥有者应答的
		 * （`content.ts:4150-4177` 里 `next.player = player`），把它放这儿就会变成自己替对方选。
		 */
		async cost(event, trigger, player) {
			const target = trigger.target;
			const source = trigger.player;
			const other = source === player ? target : source;
			const result = await player
				.chooseBool({
					prompt: get.prompt("huishenmrfz"),
					prompt2: `你可以令${get.translation(other)}执行下列任意项：1.弃置一张手牌；2.本轮下次受到的伤害+1；3.本回合非锁定技失效；然后你摸X张牌（X=3-其执行的项数）`,
				})
				.forResult();
			if (result.bool) event.result = { bool: true };
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			const source = trigger.player;
			const isAttacker = source === player;
			const other = isAttacker ? target : source;

			//标记本轮已对其使用过
			player.storage.huishenmrfz_used ??= {};
			player.storage.huishenmrfz_used[other.playerid!] = game.roundNumber;

			/**
			 * 由**对方自己**选择要执行哪几项。
			 *
			 * 面板样式照搬 OL 吴懿【奔袭】（`apps/core/character/yijiang/skill.js:24-31`）的
			 * `chooseButton` + `tdnodes`，但**询问对象是 `other`**（被指定的角色），
			 * 因为描述是「令其执行」—— 选与执行都在对方。
			 *
			 * **每项单独一行**：`ui.create.dialog` 的每个 `[items, type]` 条目都会新建一个
			 * `.buttons` 容器（`library/element/dialog.js:334-339`），同一容器内的项是横排的。
			 * 所以「一行一项」必须让每一项各自占一个容器：`[[[i, text]], "tdnodes"]`。
			 */
			const optionTexts = ["弃置一张手牌", "本轮下次受到的伤害+1", "本回合非锁定技失效"];
			const dialogItems: any[] = [`【毁神】:请选择你要执行的项（执行几项，${get.translation(player)}摸几张）`];
			optionTexts.forEach((text, i) => {
				//每项一个容器 ⇒ 每行一项
				dialogItems.push([[[i, text]], "tdnodes"]);
			});

			const select = await other
				.chooseButton({
					createDialog: dialogItems,
					selectButton: [0, 3],
					forced: false,
					filterButton(button) {
						//自己没有手牌时「弃置一张手牌」不可选
						if (button.link === 0 && other.countCards("h") <= 0) return false;
						return true;
					},
					ai(button) {
						const self = get.player();
						const link = button.link as number;
						const enemy = get.attitude(self, player) < 0;
						//站在**自己**（被惩罚方）的角度：执行越多项，对面摸得越少，但自己越亏
						switch (link) {
							case 0:
								//弃牌：手牌少时尽量不执行
								return enemy && self.countCards("h") >= 2 ? 1.2 : 0.2;
							case 1:
								//伤害+1：血少时绝不执行
								return enemy && self.hp >= 3 ? 1.0 : 0.1;
							case 2:
								//非锁定技失效：技能多时少执行
								return enemy && self.getSkills().length < 2 ? 0.8 : 0.1;
						}
						return 0;
					},
				})
				.forResult();
			/** 对方选择执行的项下标 */
			const picked = (select?.links || []) as number[];

			/** 已实际执行的项 */
			const done: number[] = [];

			//① 弃置一张手牌（由对方自己弃）
			if (picked.includes(0) && other.countCards("h") > 0) {
				await other.chooseToDiscard({
					position: "h",
					selectCard: 1,
					forced: true,
					prompt: `【毁神】:请弃置一张手牌`,
					ai(card) {
						return 6 - get.value(card);
					},
				});
				done.push(0);
			}

			//② 本轮下次受到的伤害+1
			if (picked.includes(1)) {
				other.addTempSkill("huishenmrfz_dam", { global: "roundEnd" });
				other.addMark("huishenmrfz_dam", 1, false);
				done.push(1);
			}

			//③ 本回合非锁定技失效
			if (picked.includes(2)) {
				const skillList = other.getSkills().filter(s => {
					const info = lib.skill[s];
					return info && !info.locked && !info.charlotte && !info.silent && s !== "huishenmrfz_disable";
				});
				if (skillList.length) {
					other.disableSkill("huishenmrfz_disable", skillList);
					other.addTempSkill("huishenmrfz_disable", { player: "phaseAfter" });
					done.push(2);
				}
			}

			//摸 X 张（X = 3 - 执行项数）
			const x = Math.max(0, 3 - done.length);
			if (x > 0) await player.draw(x);
		},
		subSkill: {
			/** 「本轮下次受到的伤害+1」的承载技能（用后自毁，不叠加） */
			dam: {
				charlotte: true,
				silent: true,
				onremove: true,
				mark: true,
				intro: {
					name: "毁神",
					content: "本轮下次受到的伤害+1",
				},
				trigger: { player: "damageBegin" },
				forced: true,
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("huishenmrfz_dam");
				},
			},
			/** 「本回合非锁定技失效」的承载技能（`disableSkill` 的 blocker 容器） */
			disable: {
				charlotte: true,
				silent: true,
				onremove(player) {
					/**
					 * 临时技能到期时要**逐个恢复**被禁的技能。
					 *
					 * `disableSkill(blocker, skillName)` 把记录存进 `player.disabledSkills[blocker]`
					 * （数组，见 `player.js:11575-11620`）；而 `enableSkill(skillName)` 是按
					 * **被禁的技能名**从**所有** blocker 里剔除（`player.js:11624-11633`），
					 * 传 blocker 名是无效的。所以这里要遍历那个数组逐个 enable。
					 */
					const list = player.disabledSkills?.["huishenmrfz_disable"];
					if (Array.isArray(list)) {
						for (const skillName of list.slice()) {
							player.enableSkill(skillName);
						}
					}
					delete player.disabledSkills?.["huishenmrfz_disable"];
				},
			},
		},
	},
});

translate({
	char_134_ifrit: "伊芙利特",
	yanzhuomrfz: "炎灼",
	yanzhuomrfz_info:
		"锁定技，与你距离为1的其他角色准备阶段，其须选择令你本轮攻击范围+1或受到一点火属性伤害;当你受到火属性伤害时，取消之，然后你的手牌上限+1。",
	yanbaomrfz: "炎爆",
	yanbaomrfz_info: "每回合限一次，当你使用【杀】时，你可以改为指定你攻击范围内所有角色为目标，若此杀造成了伤害，【炎爆】视为未发动过。",
	huishenmrfz: "毁神",
	huishenmrfz_info:
		"每名角色每轮限一次，当你使用伤害类牌指定其他角色为目标后，或当你成为伤害类牌指定的目标后，你可以令其执行下列任意项：<br>1.弃置一张手牌;<br>2.本轮下次受到的伤害+1;<br>3.本回合非锁定技失效;<br>然后你摸X张牌。（X=3-其执行的项数）",
	"yanzhuomrfz_range": "炎灼",
	"yanzhuomrfz_range_info": "本轮攻击范围+1（可叠加）。",
	"huishenmrfz_dam": "毁神",
	"huishenmrfz_dam_info": "本轮下次受到的伤害+1。",
});

characterIntro(
	"char_134_ifrit",
	"伊芙利特，前莱茵生命医疗对象，重度感染者。拥有极高的源石适应性，伴随有多发性点火现象。进入莱茵生命前的履历缺失。</br>现于罗德岛接受治疗，由医疗干员赫默担任监护与担保人。"
);

characterTitle("char_134_ifrit", "融魇烈火");
