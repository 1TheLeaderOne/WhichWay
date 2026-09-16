import { lib, game, ui, get, ai, _status } from "noname";

/** 临时假牌使用的 gaintag：directgains 会带上它，用于识别与清理本次选择产生的假牌 */
const FAKE_CARD_TAG = "whichWayFakeCard";

/** 折叠真牌时的重叠偏移（px）。引擎的最小折叠偏移是 32，取略大以免被夹到 32 而多出横向滚动条 */
const FOLD_OFFSET = 34;

/**
 * 从 chooseFakeCard 的事件对象透传给内层 chooseCard 的参数名，
 * 与本体 chooseCard 的参数集（ChooseBase / CheckCardParams / EventChooseCardParams）保持一致。
 * position 固定为 "s"、filterCard 需要额外包裹、glow_result 由本函数自己处理，故不在此列表中。
 */
const PASSTHROUGH_KEYS = ["prompt", "prompt2", "promptx", "selectCard", "filterOk", "ai", "forced", "complexCard", "complexSelect", "allowChooseAll", "hsskill", "type"];

/**
 * 选择期间折叠真实手牌（只改本地 UI，不动游戏状态）。
 *
 * 这里刻意**不自己算布局**，而是借引擎自己的折叠能力：
 * `ui.updatehl` 会分别对 handcards1 / handcards2 按
 * `offset = min(112, (容器 offsetWidth - 128) / (张数 - 1))` 计算重叠偏移，而两个手牌容器
 * 各自定位、各自设宽（如 default 布局：hc1 在左半、hc2 在右半，宽度均为 calc(50% - 140px)），
 * 所以只要把真牌集中到 handcards1 并收窄它，引擎就会把真牌压成只露左边缘的重叠条，
 * 而假牌所在的 handcards2 宽度不变、仍按 112px 正常间距平铺。
 *
 * 折叠后的「悬停 / 点选展开」同样是引擎原生的：`ui.click.cardmouseenter` 会设置
 * `ui._handcardHover` 并调用 `ui.updatehl()`，由 `ui.getSpreadOffset` 把被指向的牌及其邻居摊开。
 *
 * 已知降级：`single-handcard` 布局（mobile / long / long2 / nova）下 `#handcards2` 被隐藏，
 * 且 `directgains` 也会把假牌放进 handcards1，无法做到「只折真牌」，此时整行一起折叠。
 *
 * @param { Player } player 本地玩家（game.me）
 * @param { Card[] } fakes 本次创建的假牌
 * @returns { (() => void) | null } 复原函数；没有可折叠的手牌时返回 null
 */
function foldRealHand(player, fakes) {
	const container = ui.handcards1Container;
	if (!container || !container.firstChild) return null;
	const cards1 = player.node.handcards1;
	const cards2 = player.node.handcards2;
	const fakeSet = new Set(fakes);
	/** @type { Array<{ card: Card, origin: HTMLElement }> } 被挪动的真牌及其原容器，复原时按此归位 */
	const moved = [];
	const style = container.style;
	const prevWidth = style.width;
	const prevFold = lib.config.fold_card;

	/** 把本函数造成的改动（容器宽度、fold_card、牌的所属容器）全部还原，并让引擎重新布局 */
	const restore = () => {
		style.width = prevWidth;
		lib.config.fold_card = prevFold;
		for (const { card, origin } of moved) {
			//牌可能在选择期间被弃置 / 移走（此时它已不在手牌区），只在仍留在手牌区时归位
			if (card.parentNode !== cards1 && card.parentNode !== cards2) continue;
			origin.appendChild(card);
		}
		ui.updatehl();
	};

	try {
		//single-handcard 布局只有一个手牌容器，真假牌混在一起，只能整行折叠
		if (!get.is.singleHandcard()) {
			//把真手牌集中到 handcards1。两个容器同属 node.handcards1/2，getCards("h"/"s") 会同时遍历它们，
			//因此在两者之间移动牌不影响任何游戏逻辑（只是显示位置变了）。
			//带 glows 的牌属于「特殊区」（directgains 加上去的），与本次的假牌同类，留在 handcards2 一起平铺
			for (const node of Array.from(cards2.childNodes)) {
				const card = /** @type { Card } */ (node);
				if (card.classList.contains("removing") || card.classList.contains("glows") || fakeSet.has(card)) continue;
				moved.push({ card, origin: cards2 });
				cards1.appendChild(card);
			}
		}

		//引擎只在 fold_card 为真时才按宽度算重叠偏移；否则对任何容器都用 112px 间距并给容器加
		//scrollh（横向滚动），此时收窄容器不会折叠、只会出现滚动条。
		//这里只改运行期值，绝不 saveConfig 写回配置。
		lib.config.fold_card = true;

		//各布局的盒模型 / padding 不同，先测出 style.width 与 offsetWidth 之间的差值再换算，避免硬编码
		const naturalWidth = parseFloat(window.getComputedStyle(container).width) || container.offsetWidth;
		const gap = container.offsetWidth - naturalWidth;
		const count = Array.from(cards1.childNodes).filter(node => !node.classList.contains("removing")).length;
		if (count < 2) {
			//只有 0~1 张真牌，没有重叠可言，交给引擎原生布局
			ui.updatehl();
			return restore;
		}
		//按引擎公式反推 offsetWidth = FOLD_OFFSET * (count - 1) + 128，使算出的 offset 刚好不小于 32
		//（既折叠到只露左边缘，又不出现滚动条）；不超过容器在布局里的原宽度，避免压到假牌区域
		let width = FOLD_OFFSET * (count - 1) + 128 - gap;
		for (let i = 0; i < 3; i++) {
			style.width = Math.max(Math.min(width, naturalWidth), 0) + "px";
			ui.updatehl();
			//仍然是 scrollh，说明算出的 offset 被夹到了 32（宽度不够），加宽一点再试
			if (!container.classList.contains("scrollh")) break;
			width += 32;
		}
	} catch (e) {
		//任何一步出错都立刻回滚：fold_card 与容器宽度是全局状态，绝不能泄漏出去
		restore();
		throw e;
	}
	return restore;
}

export const ContentExt = {
	/**
	 * 假牌选牌（`player.chooseFakeCard()` 的 content）。
	 *
	 * 只有一段：造牌 → 置入手牌 → 折叠真手牌 → 委托引擎的 chooseCard 完成真正的选择
	 * → 把选中的假牌回映射成原牌放进 `result.links` → finally 中复原手牌布局并删除假牌。
	 *
	 * 为什么把选择委托给 chooseCard：对话框、提示计数、cardChooseAll、selectCard 范围解析、
	 * AI 选牌、在线 / 多端、glow_result 等行为全部白拿，且天然与 chooseCard 保持一致；
	 * 同时折叠的接管与复原能放进同一个 try / finally，即使中途抛错也一定复原。
	 *
	 * @type { ContentFuncByAll[] }
	 */
	chooseFakeCard: [
		async function (event, trigger, player) {
			//兜底：任何提前返回 / 异常路径下 result 都是合法的空结果
			event.result = { bool: false, cards: [], targets: [], buttons: [], links: [], confirm: "ok" };
			const originals = Array.isArray(event.cards) ? event.cards.slice() : [];
			if (!originals.length) return;

			/** @type { Card[] } */
			const fakes = [];
			/** @type { (() => void) | null } */
			let restore = null;
			//临时给假牌的 gaintag 一个显示名（引擎会把 gaintag 的翻译渲染在牌面上）：
			//默认取事件名，调用方可用 params.tagName 指定（常传技能名，显示成技能的中文名）
			const tagName = event.tagName ?? event.name;
			const hadTagTranslate = FAKE_CARD_TAG in lib.translate;
			const prevTagTranslate = lib.translate[FAKE_CARD_TAG];
			if (tagName) lib.translate[FAKE_CARD_TAG] = get.translation(tagName);
			//造牌、置入手牌、折叠真手牌、委托选择、结果回映射整段都放进 try：
			//任何一步抛错都由 finally 统一复原手牌布局、还原翻译并清掉假牌
			try {
				fakes.push(...game.createFakeCards(originals));
				fakes.forEach((fake, index) => {
					//createFakeCards 用源牌的 cardid 作为 _cardid，而 deleteFakeCards 只认 _cardid 为真的假牌；
					//VCard 可能没有 cardid（由 { name } 这类普通对象构造而来），这里补一个合成 id，
					//否则本地与在线都不会删除这张假牌（会残留在手牌里）
					if (!fake._cardid) fake._cardid = `whichWayFake_${index}_${get.id()}`;
				});
				/** @type { Map<Card, Card|VCard> } 假牌 → 原牌（比依赖 _cardid 更精确，且天然支持 VCard） */
				const fakeToOriginal = new Map(fakes.map((fake, index) => [fake, originals[index]]));
				const fakeSet = new Set(fakes);

				//directgains 会 addGaintag 并给牌加 glows：假牌归入「特殊区」（s），
				//既不触发任何获得事件，也不会被 countCards("h") / 手牌上限 / 弃牌结算算作真手牌
				player.directgains(fakes, null, FAKE_CARD_TAG);

				//折叠真手牌（只改本地 UI）
				if (player == game.me) restore = foldRealHand(player, fakes);

				/** @type { Record<string, any> } */
				const params = {
					//position 固定为 "s"：只迭代「特殊区」。配合 filterCard 限定，
					//既不会误选真手牌，也不会误选木牛流马等其它既有的特殊区牌
					position: "s",
					//filterCard 需要额外包裹：只允许选中本次创建的假牌
					filterCard: (card, current, currentEvent) => fakeSet.has(card) && event.filterCard(card, current, currentEvent),
				};
				//调用方传进来的其余 chooseCard 参数原样透传
				for (const key of PASSTHROUGH_KEYS) {
					if (event[key] != null) params[key] = event[key];
				}

				const inner = (await player.chooseCard(params).forResult()) || {};
				//选中的假牌 → 调用方传入的原牌（Card / VCard）。假牌选完即被删除，
				//所以调用方真正能用的是这份映射，它放在 result.links 里。
				const chosen = (inner.cards || []).map(card => fakeToOriginal.get(card) || card);
				event.result = {
					...inner,
					bool: inner.bool ?? false,
					//cards 与本体 result 保持一致：就是玩家选中的那几张假牌
					cards: inner.cards || [],
					//links 携带上面的假牌对应的真实值（本体在纯选牌场景下不会往 links 写内容）
					links: chosen,
				};
				//引擎的 glow_result 只会照亮假牌（马上就被删掉），所以改成照亮它们对应的真实牌
				if (event.glow_result) {
					chosen.forEach(card => card?.classList?.add("glow"));
				}
			} finally {
				if (restore) restore();
				//引擎自带：本地 delete + updatehl，在线时 send 给持有者删除
				if (fakes.length) game.deleteFakeCards(fakes);
				//还原 lib.translate：临时显示名只在这段选择期间有效
				if (hadTagTranslate) lib.translate[FAKE_CARD_TAG] = prevTagTranslate;
				else delete lib.translate[FAKE_CARD_TAG];
			}
		},
	],
};