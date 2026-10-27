import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_102_texas", { pack: "epicSJZX", sex: "female", group: "qimrfz", hp: 4, skills: ["sudimrfz", "jianyumrfz"] ,llm:"DeepSeek-4.1-Flash"});

/**
 * 德克萨斯
 *
 * 两个技能都以「查看牌堆顶 4 张、从中挑**花色互不相同**的牌」为核心。
 *
 * ⚠️ 设计原则：**选哪些牌完全由玩家决定**。
 * 因此这里**不做任何预先筛选** —— 牌堆顶 4 张全部原样交给玩家，
 * 只通过 `filterButton` / `filterCard` 声明「同花色不可重复选」这条合法性约束
 * （那是规则本身，不是代替玩家做选择）。
 * 早前版本的 `distinctSuitCandidates()` 会先把重复花色剔掉再给玩家看，
 * 等于系统替玩家过滤候选，已移除。
 */

/** 查看牌堆顶的牌数 */
const LOOK_COUNT = 4;

/**
 * 查看牌堆顶的牌。
 *
 * ⚠️ 第二个参数传 `true`（`get.cards(num, putBack)`，`get/index.js:3626-3655`）：
 * 牌取出后会被**立即按原顺序插回牌堆顶**，所以调用方**不需要自己归还**。
 * 拿到的只是「牌对象引用」，用来展示 / 供玩家挑选；
 * 真正要交出去的牌稍后用 `gain` / `cardsDiscard` 正式转移，被选走的牌届时才真正离开牌堆。
 *
 * @returns {Card[]} 牌堆顶的牌（已放回牌堆，仅作引用）
 */
function peekTopCards(): Card[] {
	return get.cards(LOOK_COUNT, true);
}

/**
 * 把指定的牌从牌堆里**真正取出**（不放回）。
 *
 * `peekTopCards()` 用 `get.cards(n, true)` 看牌，那些牌在看完后已自动回到牌堆顶。
 * 当玩家选定要交出去的牌时，需要先把这几张从牌堆里摘出来，之后引擎的
 * `gain` / `cardsDiscard` / `useCard` 才能正常把它们转移走。
 *
 * 逐张 `removeChild` 是引擎自己的做法（`get/index.js:3646-3647` 取牌时同样如此），
 * 并同步 `original = "c"` 标记它原本来自牌堆。
 *
 * @param cards 要取出的牌
 * @returns 实际取出的牌（已在牌堆里的才会被取出）
 */
function takeOutFromPile(cards: Card[]): Card[] {
	const taken: Card[] = [];
	for (const card of cards) {
		if (card && card.parentNode === ui.cardPile) {
			ui.cardPile.removeChild(card);
			card.original = "c";
			taken.push(card);
		} else if (card) {
			//不在牌堆里也照样交出去（例如已被别处移动），保证玩家选到的不会丢
			card.original ??= "c";
			taken.push(card);
		}
	}
	game.updateRoundNumber();
	return taken;
}

/**
 * 判断一张牌的花色是否已被已选牌占用。
 *
 * 玩法要求「任意张**不同花色**牌」⇒ 同一花色最多选一张。
 * 花色统一用 `get.suit(card, false)` 取**牌面原始花色**（不做技能修正），
 * 否则会被「视为某花色」类技能干扰，与「看牌堆」的语义不符。
 *
 * @param card 待判定的牌
 * @param selected 已选的牌
 * @returns 该牌花色是否与已选牌全部不同
 */
function suitNotTaken(card: Card, selected: Card[]): boolean {
	const suit = get.suit(card, false)!;
	if (!lib.suit.includes(suit)) return false;
	return !selected.some(other => get.suit(other, false) === suit);
}

/**
 * 判断一张牌的花色是否与「已用花色」都不冲突。
 *
 * 与 {@link suitNotTaken} 同一套规则，只是这边比较的是**花色字符串集合**，
 * 用于速递的「跨段记忆」（历次分配用掉的花色）。
 *
 * @param card 待判定的牌
 * @param usedSuits 已被占用的花色集合
 * @returns 该牌花色是否尚未被占用
 */
function suitAvailable(card: Card, usedSuits: Set<string>): boolean {
	const suit = get.suit(card, false)!;
	if (!lib.suit.includes(suit)) return false;
	return !usedSuits.has(suit);
}


skill({
	/**
	 * 剑雨
	 *
	 * > 出牌阶段限一次，你可以展示牌堆顶四张牌，并选择其中任意张不同花色牌当指定等量目标的
	 * > 【万箭齐发】使用，因此牌而受到伤害的角色选择弃置两张手牌或下一个出牌阶段使用【杀】的次数-1
	 * > （不可叠加）。
	 *
	 * 实现拆解：
	 * - **出牌阶段限一次** ⇒ `enable: "phaseUse"` + `usable: 1`。
	 * - **展示牌堆顶四张** ⇒ `player.showCards(cards)`，让全场看到
	 *   （这是「展示」而非「观看」，与【速递】不同）。
	 * - **选其中任意张不同花色牌** ⇒ 4 张牌**全部**交给玩家选，`filterButton` 只约束「同花色不可重复」。
	 * - **当指定等量目标的【万箭齐发】使用** ⇒ `new lib.element.VCard({ name: "wanjian" })` +
	 *   `chooseUseTarget`，`selectTarget` 返回「选牌数」以保证目标数等量。
	 *   VCard 不带实体牌，所以「因此牌受到伤害」用 `card.storage` 打标记追踪。
	 * - **受到伤害的角色二选一** ⇒ 取本次使用前后 `sourceDamage` 的差集，筛出带标记的伤害。
	 */
	jianyumrfz: {
		audio: ["部署1", "作战中3"],
		enable: "phaseUse",
		usable: 1,
		/**
		 * 发动条件：牌堆有牌可看，且至少存在一名可对其使用【万箭齐发】的其他角色。
		 */
		filter(event, player) {
			if (!get.cards(1).length) return false;
			return game.hasPlayer(current => current !== player && player.canUse("wanjian", current));
		},
		async content(event, trigger, player) {
			//`peekTopCards()` 已经自动放回牌堆顶（`get.cards(4, true)`），这里只是拿引用给玩家看/选
			const cards = peekTopCards();
			if (!cards.length) return;
			//「展示」：全场可见
			await player.showCards(cards, `${get.translation(player)}发动了【剑雨】，展示牌堆顶${get.cnNumber(cards.length)}张牌`);

			//4 张牌**全部**交给玩家挑（不做任何预筛），只约束「同花色不可重复选」。
			//`game.check()` 每次点击都会重新跑 `filterButton`（`game/check.js:109` 的
			//`isSelectable` 就是 `event.filterButton(button, player)`），所以这条互斥实时生效。
			const choose: Partial<Result> = await player
				.chooseButton({
					createDialog: [`【剑雨】:请选择任意张不同花色的牌（当作【万箭齐发】使用）`, cards],
					selectButton: () => [1, cards.length],
					filterButton(button) {
						//`button.link` 与 `ui.selected.buttons[].link` 都是**原牌**（`chooseButton` 不涉假牌），
						//所以直接比花色即可。要把自身排除：`game.Check.button` 对每张都调 `filterButton`，
						//已选中的那张也会被问到，不排除就会跟自己同花色而被判不可选。
						const self = button.link as Card;
						const selected = ui.selected.buttons.map(btn => btn.link as Card).filter(c => c !== self);
						return suitNotTaken(self, selected);
					},
					ai(button) {
						//优先选价值高的（当万箭用出去，越贵越赚）
						return get.value(button.link, get.player());
					},
					prompt: `【剑雨】:请选择任意张不同花色的牌（当作【万箭齐发】使用）`,
					forced: true,
					//⛔ 必须开：不传时 `game.check` 会**缓存** `filterButton` 的结果、只算一遍
					//（`game/index.js:7376-7393`：`useCache = !event.skill && !event.multitarget`，
					// 随后 `filterCache(type)` 返回 `!event["complex" + Type]`；
					// 注意 button 会被改写成 `select`，所以按钮侧对应的开关是 **`complexSelect`**，
					// 不是 `complexCard`）。不开的话「同花色互斥」只在初始那一遍生效，
					// 玩家后续再点同花色的牌不会被拦（`filterButton` 实测恒 true 的原因）。
					complexSelect: true,
				})
				.forResult();
			const chosen: Card[] = (choose?.links || []) as Card[];

			//玩家没选或取消：这些牌本来就还在牌堆顶（`get.cards(4, true)` 已放回），直接结束
			if (!chosen.length) return;

			//选中的牌要真正离开牌堆：先按引用把它们从牌堆里摘出来
			const used = takeOutFromPile(chosen);
			const num = used.length;
			if (!num) return;

			//当作【万箭齐发】使用，目标数 = 选牌数
			const vcard = new lib.element.VCard({ name: "wanjian" });
			//打标记：后续筛「因此牌受到伤害」时用它认牌
			vcard.storage ??= {};
			vcard.storage.jianyumrfz = true;

			//⚠️ 这里必须 `await` 整个事件，不能用 `.forResult()`：
			//`chooseUseTarget` 的 content 末尾有 `await next`（`content.ts:2787`），
			//即它会**等这张【万箭齐发】完全结算完**；只拿 `forResult()` 会在「刚选完目标」时就返回，
			//那时伤害还没发生，下面的 `getHistory("sourceDamage")` 一定是空的。
			const useEvent = player.chooseUseTarget({
				card: vcard,
				cards: used,
				forced: true,
				selectTarget: () => [1,num],
				filterTarget(card, player, target) {
					return target !== player && player.canUse("wanjian", target);
				},
				ai(target) {
					return get.attitude2(target) < 0 ? 1 : -1;
				},
				prompt: `【剑雨】:请选择${num}名角色（视为对其使用【万箭齐发】）`,
			});
			//先记下「本次使用之前」的历史，用完只取这之后的伤害，
			//避免同一回合里其它【万箭齐发】（例如牌堆里的真牌）造成的历史被误算进来
			const beforeUse = player.getHistory("sourceDamage").slice();
			await useEvent;

			//收集「因此牌受到伤害」的角色：只取本次使用**之后**新增的伤害
			const afterUse = player.getHistory("sourceDamage");
			const newDamages = afterUse.filter(evt => !beforeUse.includes(evt));
			const damagedTargets: Player[] = [];
			for (const evt of newDamages) {
				if (!evt.card || !evt.card.storage || evt.card.storage.jianyumrfz !== true) continue;
				if (!evt.player || !evt.player.isIn()) continue;
				if (!damagedTargets.includes(evt.player)) damagedTargets.push(evt.player);
			}

			//逐个二选一：弃两张手牌 或 下个出牌阶段【杀】次数-1（不可叠加）
			for (const target of damagedTargets) {
				const canDiscard = target.countCards("h") >= 2;
				const alreadyPenalized = target.hasSkill("jianyumrfz_shaDebuff");
				if (!canDiscard && alreadyPenalized) continue;

				const choices: string[] = [];
				if (canDiscard) choices.push("弃置两张手牌");
				if (!alreadyPenalized) choices.push("下个出牌阶段使用【杀】次数-1");
				if (!choices.length) continue;

				//`chooseControl` 的对象参数用 `controls` 字段承载选项（`EventChooseControlParams`）
				const result = await target
					.chooseControl({
						controls: choices,
						prompt: `【剑雨】:请选择一项`,
						ai() {
							//手牌少时宁可挨一次使用次数惩罚，也不弃牌
							const self = get.player();
							return self.countCards("h") >= 3 ? "弃置两张手牌" : choices[choices.length - 1];
						},
					})
					.forResult();
				const choice = result?.control ?? choices[0];

				if (choice === "弃置两张手牌") {
					await target.chooseToDiscard({
						position: "h",
						selectCard: 2,
						forced: true,
						prompt: `【剑雨】:请弃置两张手牌`,
						ai(card) {
							return -get.value(card);
						},
					});
				} else {
					//「下个出牌阶段【杀】次数-1」的临时副技能（不可叠加，用后自毁）
					target.addSkill("jianyumrfz_shaDebuff");
					target.addMark("jianyumrfz_shaDebuff", 1, false);
				}
			}
		},
		subSkill: {
			/**
			 * 「下一个出牌阶段使用【杀】的次数-1」的承载技能。
			 *
			 * 【杀】的次数限制由 `lib.filter.cardUsable` 的
			 * `player.countUsed(card2) < num` 判定（`library/index.js:11506`），
			 * 而 `countUsed` 读的正是 `getStat("card")[card.name]`（`player.js:5084-5098`）。
			 * 所以在出牌阶段开始时把 `stat.sha` 加 1，等价于「本阶段上限 -1」。
			 *
			 * 「不可叠加」两层保证：技能层用 `hasSkill` 判断过就不再提供该选项；
			 * 本技能触发一次后立即 `removeSkill` 自毁，只影响**下一个**出牌阶段。
			 */
			shaDebuff: {
				charlotte: true,
				silent: true,
				onremove: true,
				mark: true,
				intro: {
					name: "剑雨",
					content: "下个出牌阶段使用【杀】的次数-1",
				},
				trigger: { player: "phaseUseBegin" },
				forced: true,
				async content(event, trigger, player) {
					//记一次已使用的【杀】，等价于本阶段少一次使用机会
					const stat = player.getStat("card");
					if (!stat.sha) stat.sha = 0;
					stat.sha++;
					player.removeSkill("jianyumrfz_shaDebuff");
				},
			},
		},
	},

	/**
	 * 速递
	 *
	 * > 每轮开始时，你可以观看牌堆顶四张牌并将其中任意张不同花色牌给任意角色。
	 *
	 * 实现拆解：
	 * - **每轮开始时** ⇒ `trigger: { global: "roundStart" }`（每轮开始发一次，与谁先手无关）。
	 * - **观看**（非「展示」）⇒ 不调 `showCards`，用 `chooseFakeCardTarget` 的对话框，只有自己看得到。
	 * - **任意张不同花色牌给任意角色** ⇒ **循环** `chooseFakeCardTarget` 分配：
	 *   每次必须「选一名角色 + 至少一张牌」，已分配的牌移出待分配列表，直到分完为止。
	 * - **跨段记忆**：花色互斥是**整轮分配**的约束，不是每段独立。
	 *   所以用 `usedSuits` 记住「历次分配中已经用掉的花色」，
	 *   后续段里这些花色的牌**都不能再选** —— 否则先给红桃、再给红桃就违反「不同花色」。
	 * - **全部不可分配即结束**：每次分配前先算「还剩哪些牌的花色没被用过」，
	 *   若一张都没有（全被 `usedSuits` 挡住），说明分配已完成，立即结束循环。
	 * - **牌堆归还**：`peekTopCards()` 用 `get.cards(4, true)`，看牌后牌已在牌堆顶，
	 *   没交出去的牌**无需任何处理**；真正要给的牌用 `takeOutFromPile()` 从牌堆摘出后再 `gain`。
	 */
	sudimrfz: {
		audio: ["完成高难行动", "作战中2"],
		frequent: true,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return get.cards(1).length > 0;
		},
		async content(event, trigger, player) {
			//已自动放回牌堆顶，这里只是拿引用供玩家观看/挑选
			const cards = peekTopCards();
			if (!cards.length) return;

			/** 待分配的牌（已分配的会从此列表移除） */
			let remaining: Card[] = cards.slice();
			/** 分配结果：谁拿哪些牌（最后一次性发放） */
			const allocations: Array<[Player, Card[]]> = [];
			/**
			 * **跨段记忆**：历次分配中已经用掉的花色。
			 * 「任意张不同花色牌」是对**整轮分配**的约束，所以这个集合必须跨段累积。
			 */
			const usedSuits = new Set<string>();

			/** 当前还能分的牌：花色没被历次分配占用 */
			const available = () => remaining.filter(card => suitAvailable(card, usedSuits));

			//循环分配：每次必须「选 1 名角色 + 至少 1 张牌」
			while (remaining.length > 0) {
				//**全部不可分配即结束**：没有任何牌的花色可用，说明已分配完成
				const candidates = available();
				if (!candidates.length) break;

				const result: ChooseFakeCardTargetResult | undefined = await player
					.chooseFakeCardTarget({
						//只把「花色还可用的牌」交给玩家（已被历次分配占用花色的牌不再出现）
						cards: candidates,
						tagName: "sudimrfz",
						//每段至少选一张牌
						selectCard: () => [1, candidates.length],
						//每段必须选一名角色
						selectTarget: 1,
						forced: true,
						prompt: `【速递】:请选择一名角色与至少一张牌交给其（本轮剩余${get.cnNumber(candidates.length)}张可选）`,
						filterCard(card) {
							//段内互斥：同一段里也不能选相同花色。
							//
							//⚠️ `ui.selected.cards` 里放的是 `chooseFakeCardTarget` 创建的**假牌**
							//（`chooseFakeCardTarget` 的 content 里 `position: "s"` + `directgains(fakes)`，
							// 见 `nonameEx/library/element/content.ts:674-679`），而 `candidates` 是**原牌**。
							// 早期版本用 `candidates.includes(c)` 去筛，假牌永远匹配不上 ⇒ `picked` 恒为空
							// ⇒ `suitNotTaken(card, [])` 恒为 true，段内排斥完全失效（实测 log 全 true 的原因）。
							//
							// 假牌是 `createFakeCards` 从原牌复制的（`game.createFakeCards` 用 `get.cardInfo(card)`
							// 初始化，`game/index.js:10385-10406`），所以**花色与它本身一致**，
							// 直接按传入的 `card` 判花色即可，不需要任何映射。
							//
							// 另：`game.Check.card` 会对**每一张**牌（含已选中的）调 `filterCard`，
							// 所以要把「当前这张牌」从已选集合里排除，否则已选的牌会跟自己比花色而被判为不可选。
							const self = card as Card;
							const selected = ((ui.selected.cards || []) as Card[]).filter(c => c !== self);
							return suitNotTaken(self, selected);
						},
						filterTarget() {
							return true;
						},
						ai1(card) {
							return get.value(card, get.player());
						},
						ai2(target) {
							//优先给自己/友方
							return get.attitude(get.player(), target);
						},
						//⛔ 必须开：不传时 `game.check` 会缓存 `filterCard` 结果、只算一遍
						//（`game/index.js:7376-7393` 的 `useCache` + `filterCache`）。
						//开了之后每次点选都对所有牌重新调用 `filterCard`，段内同花色互斥才生效。
						complexCard: true,
					})
					.forResult();

				const picked: Card[] = ((result?.links || []) as Card[]).slice();
				const target = result?.targets?.[0];
				//取消或没选到牌 ⇒ 结束分配
				if (!picked.length || !target) break;

				allocations.push([target, picked]);
				//把这次用掉的花色记进**跨段记忆**，后续段不能再选同花色
				for (const card of picked) {
					const suit = get.suit(card, false)!;
					if (lib.suit.includes(suit)) usedSuits.add(suit);
				}
				//把已分配的牌移出待分配列表
				remaining = remaining.filter(card => !picked.includes(card));
			}

			//没有任何分配：什么都没发生（牌本来就在牌堆顶）
			if (!allocations.length) return;

			//真正要交出去的牌：从牌堆里摘出来（没分出去的本就在牌堆顶，无需处理）
			const toGive = allocations.flatMap(([, list]) => list);
			takeOutFromPile(toGive);

			//**一次性**把所有牌分出去：先统一画指示线，再逐个 gain（动画更连贯）
			for (const [target] of allocations) {
				player.line(target, "green");
			}
			for (const [target, list] of allocations) {
				await target.gain({ cards: list, animate: "gain2" });
			}
		},
	},
});


translate({
	char_102_texas: "德克萨斯",
	jianyumrfz: "剑雨",
	jianyumrfz_info:
		"出牌阶段限一次，你可以展示牌堆顶四张牌，并选择其中任意张不同花色牌当指定至多等量目标的【万箭齐发】使用，因此牌而受到伤害的角色选择弃置两张手牌或下一个出牌阶段使用【杀】的次数-1（不可叠加）。",
	sudimrfz: "速递",
	sudimrfz_info: `每轮开始时，你可以观看牌堆顶四张牌并将其中任意张不同花色牌给任意角色。`,
	"jianyumrfz_shaDebuff": "剑雨",
	"jianyumrfz_shaDebuff_info": "下个出牌阶段使用【杀】的次数-1。",
});

characterIntro("char_102_texas", "德克萨斯，企鹅物流员工，单兵作战能力出类拔萃。</br>于合约期内任企鹅物流驻罗德岛联络人员，同时为罗德岛的多项行动提供协助。");

characterTitle("char_102_texas", whichWayUtil.colorize("#b叙拉古的逃难者#"));
