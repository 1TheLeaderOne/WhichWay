import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_102_texas", { pack: "epicSJZX", sex: "female", group: "qimrfz", hp: 4, skills: ["sudimrfz", "jianyumrfz"] });

/**
 * 德克萨斯
 *
 * 两个技能都以「观看牌堆顶 4 张、取其中**花色互不相同**的牌」为核心，
 * 因此把「取牌堆顶 + 花色去重筛选」抽成公用助手，避免两处各写一遍。
 */

/** 观看牌堆顶的牌数 */
const LOOK_COUNT = 4;

/**
 * 从牌堆顶取 `LOOK_COUNT` 张牌。
 *
 * 用 `get.cards(n)` 而不是 `ui.cardPile.childNodes`：前者会处理「牌堆不足时洗牌」等边界，
 * 且返回的是引擎认可的牌对象数组（与 `game.cardsGotoOrdering` 等配套）。
 *
 * @returns {Card[]} 牌堆顶的牌（按牌堆顺序，最多 `LOOK_COUNT` 张）
 */
function takeTopCards() {
	return get.cards(LOOK_COUNT);
}

/**
 * 从一组牌里筛出「花色互不相同」的合法子集，供玩家挑选。
 *
 * 玩法要求是「选择其中任意张**不同花色**牌」，也就是同一个花色最多选一张；
 * 因此给 `chooseButton` 的 `filterButton` 加一条：已选牌里不得出现相同花色。
 *
 * ⚠️ 花色用 `get.suit(card, false)` 取**牌面原始花色**（不做技能修正），
 * 否则会受到「视为某花色」类技能干扰，与本技能「看牌堆」的语义不符。
 *
 * @param {Card[]} cards 候选牌
 * @returns {Card[]} 按花色去重后的候选（每个花色最多保留先出现的一张，仅用于 AI 评分参考）
 */
function distinctSuitCandidates(cards) {
	const seen = new Set();
	const result = [];
	for (const card of cards) {
		const suit = get.suit(card, false);
		if (!lib.suit.includes(suit)) continue;
		if (seen.has(suit)) continue;
		seen.add(suit);
		result.push(card);
	}
	return result;
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
	 * - **展示牌堆顶四张** ⇒ `player.showCards(cards)`，让全场看到（这是「展示」而非「观看」，
	 *   与【速递】的「观看」不同，后者只有自己看）。
	 * - **选其中任意张不同花色牌** ⇒ `chooseButton` + `filterButton` 保证同花色不可重复选。
	 * - **当指定等量目标的【万箭齐发】使用** ⇒ 用 `new lib.element.VCard({ name: "wanjian" })`
	 *   走 `chooseUseTarget`，目标数固定等于选牌数（`selectTarget` 返回牌数的函数）。
	 *   注意 VCard 不带实体牌，所以「因此牌受到伤害」要用 `card.storage` 打标记追踪。
	 * - **受到伤害的角色二选一** ⇒ 在本次使用的 `damageSource` 里筛出「伤害来自这张 VCard」的角色，
	 *   逐个让他们 `chooseToDiscard` 两张手牌，或选「下一出牌阶段【杀】次数-1」。
	 *   「不可叠加」⇒ 记在 `player.storage.jianyumrfz_sha` 里，重复命中不重复减。
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
		/** 选牌（牌堆顶四张里挑任意张不同花色） */
		async content(event, trigger, player) {
			const cards = takeTopCards();
			if (!cards.length) return;
			//「展示」：全场可见
			await player.showCards(cards, `${get.translation(player)}发动了【剑雨】，展示牌堆顶${get.cnNumber(cards.length)}张牌`);

			const legal = distinctSuitCandidates(cards);
			if (!legal.length) return;

			//选牌：同花色最多一张
			//
			//`chooseButton` 的候选靠 `createDialog` 数组描述（`content.ts:7504-7510` 会把它原样
			//交给 `ui.create.dialog.apply`），`["提示文本", 牌数组]` 即渲染成「一行提示 + 一排可选牌」；
			//`filterButton` 每条都按当前已选复算，因此「同花色不可重复」在这里天然生效。
			const choose = await player
				.chooseButton({
					createDialog: [`【剑雨】:请选择任意张不同花色的牌（当作【万箭齐发】使用）`, legal],
					selectButton: () => [1, legal.length],
					filterButton(button) {
						const card = button.link;
						const selected = ui.selected.buttons.map(btn => btn.link);
						const suit = get.suit(card, false);
						//同花色不可重复选
						return !selected.some(other => get.suit(other, false) === suit);
					},
					ai(button) {
						//优先选价值高的（当万箭用出去，越贵越赚）
						return get.value(button.link, get.player());
					},
					prompt: `【剑雨】:请选择任意张不同花色的牌（当作【万箭齐发】使用）`,
				})
				.forResult();
			const chosen = choose?.links || [];
			if (!chosen.length) return;

			//当作【万箭齐发】使用，目标数 = 选牌数
			const num = chosen.length;
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
				forced: true,
				selectTarget: () => [num, num],
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
			const damagedTargets = [];
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

				const choices = [];
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
					//加一个「下个出牌阶段【杀】次数-1」的临时副技能，回合结束后自动移除（不可叠加）
					target.addSkill("jianyumrfz_shaDebuff");
					target.addMark("jianyumrfz_shaDebuff", 1, false);
				}
			}
		},
		subSkill: {
			/**
			 * 「下一个出牌阶段使用【杀】的次数-1」的承载技能。
			 *
			 * 用 `mod.cardUsable`？不行 —— 【杀】的次数限制由引擎的 `_status.currentPhase`
			 * 与 `player.getStat("card")` 共同决定，最稳的做法是**直接预支一次使用次数**：
			 * 在出牌阶段开始时把 `getStat("card")["sha"]` 加 1（等价于「少用一次才能回到上限」）。
			 * 这里改为在 `phaseUseBegin` 时给玩家记一次已使用的【杀】。
			 *
			 * 「不可叠加」由 `jianyumrfz_shaDebuff` 是否已存在保证（加过就不再选这个选项），
			 * 且该技能在出牌阶段结束后自行移除，只影响「下一个」出牌阶段。
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
	 * - **每轮开始时** ⇒ `trigger: { global: "roundStart" }`（引擎在每轮开始发一次，与谁先手无关）。
	 * - **观看**（非「展示」）⇒ 不能调 `showCards`，只把牌放进一个只有自己看得到的对话框里选。
	 * - **任意张不同花色牌** ⇒ 与剑雨同一套去重规则（同花色最多一张）。
	 * - **给任意角色** ⇒ 先选牌，再对每张牌分别选一名接收者（允许同一个人接收全部）。
	 */
	sudimrfz: {
		audio: ["完成高难行动", "作战中2"],
		frequent: true,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return get.cards(1).length > 0;
		},
		async content(event, trigger, player) {
			const cards = takeTopCards();
			if (!cards.length) return;
			const legal = distinctSuitCandidates(cards);
			if (!legal.length) {
				//没有可给的不同花色牌，原样放回牌堆顶
				await game.cardsGotoOrdering(cards);
				return;
			}

			//「观看」：只有自己能看到这些牌（`createDialog` 渲染的对话框只对发起者可见）
			const choose = await player
				.chooseButton({
					createDialog: [`【速递】:你可以观看牌堆顶${get.cnNumber(cards.length)}张牌，并将其中任意张不同花色牌交给任意角色`, legal],
					selectButton: () => [0, legal.length],
					filterButton(button) {
						const card = button.link;
						const selected = ui.selected.buttons.map(btn => btn.link);
						const suit = get.suit(card, false);
						return !selected.some(other => get.suit(other, false) === suit);
					},
					ai(button) {
						return get.value(button.link, get.player());
					},
					prompt: `【速递】:你可以观看牌堆顶${get.cnNumber(cards.length)}张牌，并将其中任意张不同花色牌交给任意角色`,
				})
				.forResult();
			let chosen = (choose?.links || []).slice();

			//玩家可以放弃（选 0 张）：把看过的牌放回牌堆顶
			if (!chosen.length) {
				await game.cardsGotoOrdering(cards);
				return;
			}

			//给牌：每张牌选一个接收者（可全部给同一人）
			/** @type {Map<Player, Card[]>} */
			const giveMap = new Map();
			for (const card of chosen) {
				const result = await player
					.chooseTarget({
						prompt: `【速递】:请选择「${get.translation(card)}」的接收者`,
						filterTarget(cardx, playerx, target) {
							return true;
						},
						ai(target) {
							//优先给自己/友方
							return get.attitude(player, target);
						},
					})
					.forResult();
				const target = result?.targets?.[0];
				if (!target) continue;
				if (!giveMap.has(target)) giveMap.set(target, []);
				giveMap.get(target).push(card);
			}

			//把没有分配出去的牌放回牌堆顶
			const given = [...giveMap.values()].flat();
			const leftover = cards.filter(card => !given.includes(card));
			if (leftover.length) await game.cardsGotoOrdering(leftover);

			//逐一发牌（gain2 有动画）
			for (const [target, list] of giveMap) {
				player.line(target, "green");
				await target.gain({ cards: list, animate: "gain2" });
			}
		},
	},
});

translate({
	char_102_texas: "德克萨斯",
	jianyumrfz: "剑雨",
	jianyumrfz_info:
		"出牌阶段限一次，你可以展示牌堆顶四张牌，并选择其中任意张不同花色牌当指定等量目标的【万箭齐发】使用，因此牌而受到伤害的角色选择弃置两张手牌或下一个出牌阶段使用【杀】的次数-1（不可叠加）。",
	sudimrfz: "速递",
	sudimrfz_info: `每轮开始时，你可以观看牌堆顶四张牌并将其中任意张不同花色牌给任意角色。`,
	"jianyumrfz_shaDebuff": "剑雨",
	"jianyumrfz_shaDebuff_info": "下个出牌阶段使用【杀】的次数-1。",
});

characterIntro("char_102_texas", "德克萨斯，企鹅物流员工，单兵作战能力出类拔萃。</br>于合约期内任企鹅物流驻罗德岛联络人员，同时为罗德岛的多项行动提供协助。");

characterTitle("char_102_texas", whichWayUtil.colorize("#b叙拉古的逃难者#"));
