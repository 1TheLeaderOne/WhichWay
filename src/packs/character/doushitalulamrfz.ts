import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, line } from "../hooks.ts";

/**
 * 斗士塔露拉
 *
 * 三个技能都围绕引擎既有的「**明置手牌**」机制：
 * 明置 = 给手牌打上 `visible_*` 的 gaintag（`get/index.js` 的 `get.is.shownCard` 只认这个前缀），
 * 唯一正规入口是 `player.addShownCards({ cards, gaintag })` / `player.hideShownCards(...)`
 * （`library/element/player.js:1274`、`:1308`），它内部会处理手牌区重排与动效。
 *
 * ⚠️ 不要直接 `card.addGaintag("visible_xxx")`：那只改了 tag 不改 UI，
 * 且 `addShownCards` 还会走 `_status.event` 补一条事件给其它技能/回放读取。
 *
 * 📌 本文件所有 `chooseTarget` / `chooseCard` / `chooseCardTarget` / `choosePlayerCard` /
 * `chooseToDiscard` / `chooseBool` 一律使用**对象参数**：引擎的 TS 声明
 * （`library/element/Player/type.d.ts`）已是单对象签名，无序参数只是 `player.js` 里
 * 保留的兼容分支，新技能不应再依赖。
 *
 * 📌 除 `direct` / `silent` 外不手动 `player.logSkill()`：技能正常结算时引擎会自动记录，
 * 重复调用会在日志里出现两条。
 */

const VISIBLE_YINGHUO = "visible_yinghuomrfz";
const VISIBLE_FENFENG = "visible_fenfengmrfz";

/** 明置用的 gaintag 需要翻译，否则牌角显示英文 tag */
function initVisibleTag(tag: string) {
	game.broadcastAll((tag: string) => {
		lib.translate[tag] = "明置";
	}, tag);
}

/**
 * 取出「本次事件里，原本属于 `player` 且现在落在弃牌堆的牌」。
 *
 * 引擎里「进弃牌堆」分两条互斥链路，必须分别处理：
 *
 * ① **弃置类**（`chooseToDiscard` / `loseToDiscardpile` / 回合弃牌）
 *    走 `player.lose(cards, ui.discardPile)`，`lose` 的 content 里
 *    `card.goto(ui.discardPile)` **同步** `appendChild`（`init/polyfill.ts:103-119`），
 *    之后发出 `loseAfter`。此时 `event.getd(player)` 天然是
 *    「从 `player` 离开、且 position 是弃牌堆」的牌（`player.js:8859-8869`），直接用。
 *
 * ② **使用 / 打出类**
 *    牌先离开手牌进**处理区**（`ui.ordering`），而且那次 `lose` 带 `getlx: false`
 *    （`content.ts:10043`），会让 `getd` 直接返回空数组（`player.js:8863`）——
 *    所以 `loseAfter` 这条**拿不到**它们。真正送进弃牌堆的是 `cardsGotoOrdering`
 *    挂在 `evt.after` 上的 `orderingDiscard`（`content.ts:3033-3040`、`:3083-3089`），
 *    它调 `game.cardsDiscard(cards)` 并发出 `cardsDiscardAfter`；
 *    该 `orderingDiscard` 的 `relatedEvent` 指向原始 `useCard`/`useSkill`（`:3079`），
 *    其 `.player` 就是使用者。归位到 `player` 才算「你有」。
 *
 * @param event 触发事件（`lose` / `loseAsync` / `cardsDiscard`）
 * @param player 技能拥有者
 * @returns 落在弃牌堆、且原本属于自己的牌
 */
function getDiscardedOwnCards(event: GameEvent, player: Player): Card[] {
	/** 只保留「现在真的在弃牌堆」的牌 */
	const inPile = (cards: Card[] | undefined) => (cards || []).filter(card => card && get.position(card, true) === "d");

	// —— ② 进处理区后再进弃牌堆（使用牌 / 打出牌 / **拼点** / 判定等共用的收尾）
	//
	// 这条链上 `game.cardsDiscard(cards)` 的 `event.cards` 只是「这批要丢的牌」，
	// 它**不记录归属**，而 `orderingDiscard.relatedEvent` 指向的原始事件五花八门
	// （`useCard`、拼点、判定……），有的根本没有 `.player` ——
	// 靠事件链追归属会把拼点这类场景漏掉（实测日志：
	// `lose player=doushitalulamrfz pos=ordering cards=[shan]` → `cardsDiscard cards=[shan]`）。
	//
	// 所以改成**按牌本身查归属**：从本轮全局历史的 `lose` / `loseAsync` 里，
	// 找这张牌最近一次「离开某人区域」的记录，那个 `player` 就是它原来的主人。
	// 引擎的 `lose` 一定带 `player`（`player.lose()` 的第一个参数），拼点也不例外。
	if (event.name === "cardsDiscard") {
		return inPile(event.cards).filter(card => wasOwnedBy(card, player));
	}

	// —— ① 直接丢进弃牌堆：`getd(player)` 天然是「从我这里离开 + 落点弃牌堆」
	if (typeof event.getd === "function") return inPile(event.getd(player));

	return [];
}

/**
 * 这张牌进弃牌堆之前，是不是 `player` 的？
 *
 * 牌一旦落在弃牌堆，`get.owner()` 就查不到主人了（`get/index.js:4622-4650` 只看
 * 手/装/判/储四区），所以从本轮全局历史里反向找它最近一次 `lose` / `loseAsync` 记录。
 *
 * ⚠️ 用 `"everything"`（本轮所有事件的聚合数组，`game/index.js:7`），
 * 不是 `"cardMove"` —— 后者只是其中一个子集，引擎自带同类技能也是查 `everything`
 * （`apps/core/character/bingshi/skill.js:7443-7453`）。
 *
 * @param card 待判定的牌
 * @param player 技能拥有者
 */
function wasOwnedBy(card: Card, player: Player): boolean {
	//还没离区（理论上不会）——直接按现主人算
	if (get.owner(card) === player) return true;
	const history = game.getGlobalHistory("everything");
	if (!Array.isArray(history)) return false;
	//从最近往回找「这张牌离开某玩家区域」的记录
	for (let i = history.length - 1; i >= 0; i--) {
		const evt = history[i] as any;
		if (!evt || !["lose", "loseAsync"].includes(evt.name)) continue;
		//`loseAsync` 用 `lose_list`（`[[player, cards], …]`），`lose` 用 `cards`
		if (evt.name === "loseAsync") {
			if (!Array.isArray(evt.lose_list)) continue;
			for (const entry of evt.lose_list) {
				if (!Array.isArray(entry) || entry.length < 2) continue;
				const [owner, cards] = entry as [Player, Card[]];
				if (Array.isArray(cards) && cards.includes(card)) return owner === player;
			}
			continue;
		}
		if (!Array.isArray(evt.cards)) continue;
		if (!evt.cards.includes(card)) continue;
		return evt.player === player;
	}
	return false;
}

character("doushitalulamrfz", {
	pack: "plotSJZX",
	sex: "female",
	group: "zhmrfz",
	hp: 4,
	skills: ["yinghuomrfz", "fenfengmrfz", "furimrfz"],
	whichWay: {
		arknight: {
			camp: "ReunionMovement",
		},
	},
	llm:"DeepSeek-4.1-Flash"
});

skill({
	/**
	 * 萤火
	 *
	 * > 当你有红色牌进入弃牌堆后，你可以明置一名其他角色的手牌，若与你因此进入弃牌堆的牌中有与明置牌：
	 * > 1.类型相同的牌：令一名角色摸一张牌；
	 * > 2.花色相同的牌：令一名角色弃置一张牌；
	 * > 乘势：你的攻击距离+1。
	 *
	 * 实现要点：
	 * - **「有红色牌进入弃牌堆」不限进入方式**。引擎里「进弃牌堆」有**两条互斥**的链路，
	 *   必须同时监听，否则会漏掉其中一类：
	 *
	 *   ① **弃置类**（`chooseToDiscard`、`loseToDiscardpile`）：`player.lose(cards, ui.discardPile)`
	 *   → `lose` 的 content 里 `card.goto(ui.discardPile)` **同步** `appendChild`
	 *   （`init/polyfill.ts:103-119`）→ 发出 `loseAfter`。此时 `event.getd(player)` 可直接取到牌。
	 *
	 *   ② **使用/打出类**：牌先离开手牌进**处理区**（`content.ts:9756` 附近的
	 *   `owner.lose(cards, "visible", ui.ordering).set("getlx", false)`），
	 *   **`getlx: false` 会让 `lose.getd` / `loseAsync.getd` 直接返回空数组**
	 *   （`player.js:8863`、`game/index.js:1130`），而且 position 是 `ui.ordering` 不是弃牌堆
	 *   —— 所以 `loseAfter` 这条路**拿不到**使用后进堆的牌。
	 *   真正把它送进弃牌堆的是 `cardsGotoOrdering` 里挂到 `evt.after` 的 `orderingDiscard`
	 *   （`content.ts:3033-3040`、`:3083-3089`），它调 `game.cardsDiscard(cards)`
	 *   → 发出 **`cardsDiscardAfter`**，牌就在 `event.cards` 里。
	 *
	 *   因此 trigger 同时挂三者，filter 用 `get.position(card, true) === "d"` 统一判定落点，
	 *   不依赖 `event.type`。`getd` 取不到时（使用路径）回落到 `event.cards`。
	 * - 「**你可以明置一名其他角色的手牌**」⇒ 由**技能拥有者**决定明置谁、哪张牌
	 *   （不是让手牌主人自选）。因此用 `choosePlayerCard` 从目标手牌里挑。
	 * - **乘势永久、可叠加**：每满足一次（两个分支都命中）`+1` 攻击距离，
	 *   用 `storage` 累加、由常驻 `mod.attackRange` 读取，不会随回合结束消失。
	 */
	yinghuomrfz: {
		audio: 2,
		/**
		 * 三条事件都用 `global`：归属由 {@link getDiscardedOwnCards} 自己判定。
		 *
		 * ⚠️ 不能写成 `{ player: [...], global: "cardsDiscardAfter" }`：
		 * `cardsDiscard` 事件**没有 `.player`**（`game.cardsDiscard()` 只设 `cards`，
		 * 见 `game/index.js:1463-1482`），所以挂在 `player` 角色下的 `loseAfter` 能匹配、
		 * `cardsDiscardAfter` 却永远匹配不到；而写成 `global` 后两种事件都会送到 `filter`，
		 * 由「牌是否原本属于自己」来决定 —— 这也正是引擎自带技能的做法
		 * （`apps/core/character/bingshi/skill.js:7435`：
		 * `trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] }`）。
		 */
		trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
		init(player, skill) {
			initVisibleTag(VISIBLE_YINGHUO);
			//乘势累计层数（永久，不随回合清空）
			player.storage[skill] ??= 0;
		},
		onremove: true,
		filter(event, player) {
			const discarded = getDiscardedOwnCards(event, player);
			if (!discarded.length) return false;
			if (!discarded.some(card => get.color(card, false) === "red")) return false;
			//必须有其他角色、且他有手牌可明置
			return game.hasPlayer(target => target !== player && target.countCards("h", c => !get.is.shownCard(c)) > 0);
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget({
					prompt: get.prompt("yinghuomrfz"),
					prompt2: "你可以明置一名其他角色的一张手牌",
					filterTarget(card, player, target) {
						return target !== player && target.countCards("h", c => !get.is.shownCard(c)) > 0;
					},
					ai(target) {
						//对敌方明置（暴露其手牌）= 有利；对友方尽量避免
						return -get.attitude(player, target) * (1 + target.countCards("h", c => !get.is.shownCard(c)) / 10);
					},
				})
				.forResult();
			if (result.bool) event.result = result;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			//与 filter 同一口径：弃置类走 getd，使用类走 cardsDiscard 的 event.cards
			const discarded = getDiscardedOwnCards(trigger, player);

			//由**技能拥有者**选择明置目标的哪张手牌（不是让目标自选）
			const { cards } = await player
				.choosePlayerCard({
					target,
					position: "h",
					forced: true,
					prompt: `【萤火】:请明置${get.translation(target)}一张手牌`,
					filterButton(button, player) {
						return !get.is.shownCard(button.link);
					},
					ai(button) {
						//优先挑能同时满足类型/花色的牌，其次挑价值低的
						const card = button.link;
						const me = get.player();
						let score = 0;
						for (const c of discarded) {
							if (get.type2(c, false) === get.type2(card, false)) score += 2;
							if (get.suit(c, false) === get.suit(card, false)) score += 2;
						}
						return score - get.value(card, me) / 10;
					},
				})
				.forResult();
			if (!cards || !cards.length) return;
			const shown = cards[0];
			player.line(target, "green");
			await target.addShownCards({ cards: [shown], gaintag: [VISIBLE_YINGHUO] });

			//分支 1：进入弃牌堆的牌里有与明置牌**类型相同**的 ⇒ 令一名角色摸一张牌
			//「类型」按 `basic / trick / equip` 三类比，`get.type2` 会把延时锦囊并进 trick
			//（`get/index.js:3385`），与玩家对「同类型」的直觉一致。
			let gotDraw = false;
			if (discarded.some(card => get.type2(card, false) === get.type2(shown, false))) {
				gotDraw = true;
				const result = await player
					.chooseTarget({
						prompt: `【萤火】:令一名角色摸一张牌`,
						ai(target) {
							const att = get.attitude(player, target);
							//优先自己/友方
							return att > 0 ? att * (2 - target.countCards("h") / 20) : att;
						},
					})
					.forResult();
				const gainTarget = result.targets?.[0] || player;
				if (gainTarget) {
					player.line(gainTarget, "green");
					await gainTarget.draw(1);
				}
			}

			//分支 2：进入弃牌堆的牌里有与明置牌**花色相同**的 ⇒ 令一名角色弃置一张牌
			let gotDiscard = false;
			if (discarded.some(card => get.suit(card, false) === get.suit(shown, false))) {
				gotDiscard = true;
				const result = await player
					.chooseTarget({
						prompt: `【萤火】:令一名角色弃置一张牌`,
						filterTarget(card, player, target) {
							return target.countDiscardableCards(player, "he") > 0;
						},
						ai(target) {
							const att = get.attitude(player, target);
							const useful = target.countCards("he");
							//敌方且牌多 ⇒ 收益高
							return att < 0 ? -att * (1 + useful / 10) : -att;
						},
					})
					.forResult();
				const discardTarget = result.targets?.[0];
				if (discardTarget) {
					player.line(discardTarget, "green");
					await discardTarget.chooseToDiscard({
						position: "he",
						forced: true,
						ai(card) {
							return get.value(card);
						},
					});
				}
			}

			//乘势：两个分支都命中 ⇒ 攻击距离永久 +1（可叠加，存进 storage 由常驻 mod 读取）
			if (gotDraw && gotDiscard) {
				player.storage.yinghuomrfz = (player.storage.yinghuomrfz || 0) + 1;
				player.markSkill("yinghuomrfz");
			}
		},
		mark: true,
		intro: {
			content(storage) {
				const n = storage || 0;
				return n > 0 ? `·攻击距离 +${n}` : "·无效果";
			},
		},
		mod: {
			/** 乘势：每次 +1，永久保留（读 storage，不随回合清空） */
			attackRange(player, num) {
				return num + (player.storage.yinghuomrfz || 0);
			},
		},
	},

	/**
	 * 焚风
	 *
	 * > 准备阶段，你可以弃置你区域内一张牌，并明置一名没有明置手牌角色的一张手牌，
	 * > 然后若场上其他角色明置的手牌数不小于暗置的手牌数，你对一名有明置手牌角色造成一点火属性伤害。
	 *
	 * 实现要点：
	 * - 「弃置你区域内一张牌」+「明置一名角色一张手牌」在**同一次询问**里完成：
	 *   用 `player.ext.chooseCardTarget`（本扩展的非无名杀增强版，AI 拆成 `ai1` 选牌 / `ai2` 选目标），
	 *   避免先后两次弹窗。**必须用 `ext` 版**：本体那个选不到判定区（`j`）的牌，
	 *   而「区域内」明确包含判定区。
	 * - 「明置一名**没有明置手牌**角色的一张手牌」⇒ 目标必须 `countCards("h", shownCard) === 0`；
	 *   由**技能拥有者**挑牌，与萤火一致。
	 * - 「场上其他角色明置的手牌数不小于暗置的手牌数」⇒ 只统计**其他角色**。
	 */
	fenfengmrfz: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		init(player, skill) {
			initVisibleTag(VISIBLE_FENFENG);
		},
		filter(event, player) {
			//要有可弃的区域牌，且存在「没有明置手牌」的其他角色（否则明置那步无从谈起）
			return player.countCards("hej") > 0 && game.hasPlayer(target => target !== player && target.countCards("h") > 0 && target.countCards("h", card => get.is.shownCard(card)) === 0);
		},
		async cost(event, trigger, player) {
			//弃牌 + 选目标合并成一次询问。
			//
			//⚠️ 必须用 `player.ext.chooseCardTarget`（本扩展的增强版），不能用本体那个：
			//「区域内」包含**判定区（`j`）**，但本体的 `chooseCardTarget` 只迭代手牌 / 装备区 /
			//特殊区，判定牌根本点不到，`position: "hej"` 里的 `j` 形同虚设。
			//`ext` 版会把判定牌复制成假牌放进特殊区（带 gaintag `ExtChooseCardTargetJudgeGainTag`，
			//牌面显示「判定区」），选完再把 `result.cards` 换回**真实判定牌**，
			//所以下面 `player.discard({ cards })` 拿到的就是判定区那张真牌。
			const result = await player.ext
				.chooseCardTarget({
					prompt: get.prompt("fenfengmrfz"),
					prompt2: "你可以弃置你区域内一张牌，并明置一名没有明置手牌角色的一张手牌",
					position: "hej",
					selectCard: 1,
					filterCard() {
						return true;
					},
					filterTarget(card, player, target) {
						return target !== player && target.countCards("h") > 0 && target.countCards("h", c => get.is.shownCard(c)) === 0;
					},
					//弃价值最低的牌
					ai1(card) {
						return -get.value(card);
					},
					//优先对敌方明置（暴露其手牌）
					ai2(target) {
						return -get.attitude(get.player(), target);
					},
				})
				.forResult();
			if (result.bool) event.result = result;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = event.cards;

			//① 弃置 cost 里选中的区域牌
			//`discard(params)` 的对象分支是 `Object.assign(next, params)`（`player.js:8064-8070`），
			//所以必须写成 `{ cards }`；直接传数组会被当成「无序参数」分支而拿不到牌。
			if (cards && cards.length) {
				await player.discard({ cards });
			}

			//② 由技能拥有者挑目标一张手牌明置
			if(target.countCards("h",c=>!get.is.shownCard(c))<1){
				game.log(target,"没有可明置的牌");
				return;
			}
			const pick = await player
				.choosePlayerCard({
					target,
					position: "h",
					forced: true,
					prompt: `【焚风】:请明置${get.translation(target)}一张手牌`,
					filterButton(button, player) {
						return !get.is.shownCard(button.link);
					},
					ai(button) {
						return -get.value(button.link, get.player());
					},
				})
				.forResult();
			const shownCards = pick.cards;
			if (!shownCards || !shownCards.length) return;
			player.line(target, "green");
			await target.addShownCards({ cards: [shownCards[0]], gaintag: [VISIBLE_FENFENG] });

			//③ 场上其他角色：明置手牌数 ≥ 暗置手牌数 ⇒ 对一名有明置手牌的角色造成 1 点火伤
			let shownCount = 0;
			let hiddenCount = 0;
			for (const current of game.filterPlayer(p => p !== player)) {
				for (const card of current.getCards("h")) {
					if (get.is.shownCard(card)) shownCount++;
					else hiddenCount++;
				}
			}
			if (shownCount < hiddenCount) return;

			const result = await player
				.chooseTarget({
					prompt: `【焚风】:对一名有明置手牌的角色造成一点火属性伤害`,
					filterTarget(card, player, current) {
						return current.countCards("h", c => get.is.shownCard(c)) > 0;
					},
					ai(current) {
						return get.damageEffect(current, player, player, "fire") > 0 ? 1 : -1;
					},
				})
				.forResult();
			const damageTarget = result.targets?.[0];
			if (damageTarget) {
				player.line(damageTarget, "fire");
				await damageTarget.damage({ num: 1, nature: "fire", source: player });
			}
		},
	},

	/**
	 * 覆日
	 *
	 * > 结束阶段，你可以弃置场上所有明置的手牌并对因此弃牌的角色造成一点火属性伤害，
	 * > 若除你以外有角色没有因此弃牌，这些角色各对你造成一点伤害。
	 *
	 * 实现要点：
	 * - 「场上所有明置的手牌」⇒ 遍历全部角色，取 `h` 区里 `get.is.shownCard` 的牌，**一次性**弃置
	 *   （按角色分组，以便知道谁真的交出了牌）。
	 * - 「对**因此弃牌**的角色造成 1 点火伤」⇒ 只有真被弃掉明置牌的角色才吃伤害（含自己）。
	 * - 「除你以外有角色**没有因此弃牌**」⇒ 那些其他角色反过来各对你造成 1 点伤害。
	 */
	furimrfz: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			//场上任意角色有明置手牌才能发动
			return game.hasPlayer(target => target.countCards("h", card => get.is.shownCard(card)) > 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool({
					prompt: get.prompt("furimrfz"),
					prompt2: "你可以弃置场上所有明置的手牌，并对因此弃牌的角色各造成一点火属性伤害",
					ai() {
						//粗略估算：自己因此掉血的风险 vs 打掉敌方明置牌的收益
						let gain = 0;
						for (const current of game.filterPlayer(p => p !== player)) {
							const shown = current.countCards("h", card => get.is.shownCard(card));
							if (shown > 0) gain += get.damageEffect(current, player, player, "fire") * 0.8;
						}
						const selfShown = player.countCards("h", card => get.is.shownCard(card));
						const risk = selfShown > 0 ? get.damageEffect(player, player, player, "fire") : 0;
						//还会被「没有因此弃牌」的其他角色反噬
						const backlash = game.filterPlayer(p => p !== player && p.countCards("h", card => get.is.shownCard(card)) === 0).length;
						return gain > risk + backlash * 0.8;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			//按角色收集明置手牌，便于知道谁交出了牌
			const groups: { player: Player; cards: Card[] }[] = [];
			for (const current of game.filterPlayer(() => true)) {
				const shown = current.getCards("h", card => get.is.shownCard(card));
				if (shown.length) groups.push({ player: current, cards: shown });
			}
			if (!groups.length) return;

			//① 一次性弃置所有明置手牌
			//`discardMultiple` 读的是 `event.lose_list`（`content.ts:6255` 逐条 `target.lose(cards, position)`），
			//自己会累计 `event.cards`、记日志、播弃牌动画 —— 不用再传 `cards` / `discard`。
			for (const group of groups) player.line(group.player, "fire");
			await game
				.loseAsync({
					lose_list: groups.map(group => [group.player, group.cards.slice()]),
				})
				.setContent("discardMultiple");

			//② 对因此弃牌的角色各造成 1 点火伤（含自己）
			for (const group of groups) {
				await group.player.damage({ num: 1, nature: "fire", source: player });
			}

			//③ 除你以外、没有因此弃牌的其他角色，各对你造成 1 点伤害
			const discardedPlayers = new Set(groups.map(group => group.player));
			const backlash = game.filterPlayer(current => current !== player && !discardedPlayers.has(current));
			for (const current of backlash) {
				player.line(current, "fire");
				await player.damage({ num: 1, nature: "fire", source: current });
			}
		},
	},
});

translate({
	doushitalulamrfz: "斗士塔露拉",
	doushitalulamrfz_prefix: "斗士",

	yinghuomrfz: "萤火",
	yinghuomrfz_info: "当你有红色牌进入弃牌堆后，你可以明置一名其他角色的手牌，若与你因此进入弃牌堆的牌中有与明置牌:<br>1.类型相同的牌：令一名角色摸一张牌;<br>2.花色相同的牌：令一名角色弃置一张牌;<br>乘势：你的攻击距离+1。",
	fenfengmrfz: "焚风",
	fenfengmrfz_info: "准备阶段，你可以弃置你区域内一张牌，并明置一名没有明置手牌角色的一张手牌，然后若场上其他角色明置的手牌数不小于暗置的手牌数，你对一名有明置手牌角色造成一点火属性伤害。",
	furimrfz: "覆日",
	furimrfz_info: "结束阶段，你可以弃置场上所有明置的手牌并对因此弃牌的角色造成一点火属性伤害，若除你以外有角色没有因此弃牌，这些角色各对你造成一点伤害。",
});

line({
	yinghuomrfz1:"斗士没有名字。你只要记得，在你最冷的时候，有人替你点过火。",
	yinghuomrfz2:"一盏灯照不穿乌萨斯的夜——那就再点一盏。总有人要先亮起来。",
	fenfengmrfz1:"萤火盖不过太阳，我知道。可太阳不照雪原的时候，总得有什么东西烧着。",
	fenfengmrfz2:"烧死自己也无妨。灰烬落在哪里，哪里就会长出下一个春天。",
	furimrfz1:"我们感染者怎么活、怎么死，只该我们自己决定——什么时候轮到你来定？",
	furimrfz2:"被逼上山顶的风，越过去就是热风。你们最好祈祷，它永远不要越过来。"
});

characterTitle("doushitalulamrfz", "<font color=#be260e>烛火覆日</font>");

characterIntro("doushitalulamrfz", "摘自PRST的梗概</br>塔露拉，全名塔露拉·雅特利亚斯，种族德拉克。整合运动领袖兼发言人，性格坚定而富有感染力。使用火焰系源石技艺。爱德华的遗腹子。幼年时与陈相伴，后被科西切公爵掳走并受其教育。为防止科西切利用自己，将一小块源石结晶刺进自己的胳膊，成为了感染者，后将科西切杀死。为了自己的理想在乌萨斯的雪原上建立了感染者组织“整合运动”。但在到达雪原上的某个村庄时，目睹了人们对感染者残酷对待的现实并对自己的信念产生怀疑。受科西切留下的法术的影响，其身体被科西切的意识控制。随后将整合运动单纯地用作工具。与阿米娅和陈于切尔诺伯格核心城的指挥塔塔顶决战后，在两人的劝说下回归其原本人格，被罗德岛收监。后被九劫走。目前扣押于新整合并与其一同活跃于维多利亚，由于其被黑蛇掌控时的作为并不被维多利亚人所知，因此作为新整合用以拉拢维多利亚感染者的旗帜。");
