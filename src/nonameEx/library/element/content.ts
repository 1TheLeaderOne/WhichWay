import { lib, game, ui, get, ai, _status } from "noname";

/** 临时假牌使用的 gaintag：directgains 会带上它，用于识别与清理本次选择产生的假牌 */
const FAKE_CARD_TAG = "whichWayFakeCard";

/**
 * 从 chooseFakeCard 的事件对象透传给内层 chooseCard 的参数名，
 * 与本体 chooseCard 的参数集（ChooseBase / CheckCardParams / EventChooseCardParams）保持一致。
 * position 固定为 "s"、filterCard 需要额外包裹、glow_result 由本函数自己处理，故不在此列表中。
 */
const PASSTHROUGH_KEYS = ["prompt", "prompt2", "promptx", "selectCard", "filterOk", "ai", "forced", "complexCard", "complexSelect", "allowChooseAll", "hsskill", "type"];

/**
 * 选择期间重排本地玩家的手牌：**一组折成细条、另一组按引擎自己的折叠展示**（只改本地 UI，不动游戏状态）。
 *
 * 分工（`foldedGroup` 决定当前折的是哪一组，默认折**真牌**）：
 * - **展开的那一组**：完全不干预引擎的布局 —— 引擎 `ui.updatehl` 会按容器宽度折叠
 *   （`offset = min(112, (容器宽 - 128) / (张数 - 1))`，下限 32px），并负责悬停摊开
 *   （`getSpreadOffset`）、`selected` 抬升、横向滚动与各种动画，这些"特效"都要原样保留；
 * - **折叠的那一组**：压成比引擎下限更小的 `FOLD_PITCH`（10px，几乎只剩左边缘），并把压缩出来的
 *   位移量补给其后的牌，因此展开组之间的相对间距、悬停摊开的形状都不变。
 *
 * **点击切换视图**（点击"折叠的那一组"即可）：
 * - 点折叠的**真牌** → 折叠假牌、展开真牌；点折叠的**假牌** → 折叠真牌、展开假牌；
 * - 折叠组**不会被误选**：布局时把它们的 `selectable` 摘掉并记账（`strippedSelectable`），
 *   重新展开或复原时补回 —— 引擎 `ui.click.card` 在 `selectable` 缺失时会直接返回
 *   （`ui/click/index.js`），所以既不用拦截事件（不会破坏引擎的拖拽 / 触摸收尾与 `_status.clicked`
 *   复位），也绝对不会选中折叠的牌。
 *
 * 真牌假牌同处一个容器时（`single-handcard` 布局：`#handcards2` 被隐藏、`directgains` 把假牌也放进
 * handcards1）也成立 —— 这正是引擎做不到"分组折叠"的场景（它只能整容器一个间距）。
 *
 * 为了"引擎一重排就被纠正"，折叠期间把 `ui.updatehl` 包一层（见 `patchedUpdatehl`）：
 * 引擎初始化、摸牌、悬停、选牌等任何一次重排之后都会立刻重新应用本布局 ——
 * 既不会出现"假牌进手牌几秒后才折叠"的延迟，也不会被引擎的原生折叠覆盖。
 *
 * `restore` 会还原 `ui.updatehl`、解绑点击监听、把摘掉的 `selectable` 补回、清掉内层宽度与 `scrollh`、
 * 把集中过来的真牌放回原容器，最后让引擎自己重新排版一次（它会整行重写 transform）。
 *
 * @param { Player } player 本地玩家（game.me）
 * @param { Card[] } fakes 本次创建的假牌
 * @returns { (() => void) | null } 复原函数；没有可重排的手牌时返回 null
 */
function foldRealHand(player, fakes) {
	const cards1 = player.node.handcards1;
	const cards2 = player.node.handcards2;
	const box1 = ui.handcards1Container;
	const box2 = ui.handcards2Container;
	if (!box1 || !cards1) return null;
	const fakeSet = new Set(fakes);
	/** 折叠组的间距：比引擎的折叠下限（32px）更小，压成一条几乎只剩左边缘的细边 */
	const FOLD_PITCH = 10;
	/** 当前被折成细条的那一组（另一组按引擎的折叠展示）；默认折真牌，点折叠组即可切换 */
	let foldedGroup: "fake" | "real" = "real";
	/** 被临时摘掉 `selectable` 的牌（折叠期间不允许被选中），重新展开或复原时补回 */
	const strippedSelectable = new Set<HTMLElement>();
	/** 已绑定"点击切换视图"监听的牌 */
	const boundCards = new Set<HTMLElement>();
	/** 上一次切换的时间戳：触摸端 touchend 之后浏览器可能再补一个 click，只算一次 */
	let lastToggle = 0;
	/** @type { Array<{ card: Card, origin: HTMLElement }> } 被挪动的真牌及其原容器，复原时按此归位 */
	const moved = [];
	/** 内层（放牌）+ 外层（管横向滚动）两个手牌容器 */
	const boxes = [
		{ inner: cards1, outer: box1 },
		{ inner: cards2, outer: box2 },
	];
	/** 引擎原本的 `ui.updatehl`：折叠期间被包一层，复原时还原 */
	const originalUpdatehl = ui.updatehl;

	/**
	 * 该牌是不是本次的假牌（归"假牌组"）。
	 *
	 * `directgains` 会给假牌加 `glows`（特殊区标记），所以除 `fakeSet` 之外，
	 * 带 `glows` 的牌也按"假牌组"处理 —— 那类牌同样不是玩家的真手牌。
	 */
	const isFake = card => fakeSet.has(card) || card.classList.contains("glows");

	/** 该牌是否属于"当前被折叠的那一组"（点它切换视图，而不是选牌） */
	const isFolded = card => (foldedGroup === "fake" ? isFake(card) : !isFake(card));

	/** 数一数某一组在容器里有多少张：切换前确认另一组确实有牌可展开 */
	const countGroup = fakeGroup => {
		let count = 0;
		for (const { inner } of boxes) {
			if (!inner) continue;
			for (const node of inner.childNodes) {
				const card = /** @type { HTMLElement } */ (node);
				if (!card.classList || !card.classList.contains("card") || card.classList.contains("removing")) continue;
				if (isFake(card) === fakeGroup) count++;
			}
		}
		return count;
	};

	/**
	 * 切换视图：把当前折叠的组展开、把另一组折起来。
	 *
	 * 直接调 `ui.updatehl()` 让引擎整行重排（它会按自己的算法重写所有 transform），
	 * 随后由 `patchedUpdatehl` 立刻套用新布局 —— 展开组的悬停摊开等特效依旧由引擎负责。
	 */
	const toggleFold = () => {
		const next = foldedGroup === "real" ? "fake" : "real";
		//另一组一张牌都没有（比如全是假牌）⇒ 展开也没意义，保持现状
		if (!countGroup(next === "fake")) return;
		foldedGroup = next;
		ui.updatehl();
	};

	/**
	 * 折叠组的牌被点击：切换视图（**不会选中牌**）。
	 *
	 * 之所以点折叠组不会误选：布局时已把折叠牌的 `selectable` 摘掉，而引擎 `ui.click.card`
	 * 在 `selectable` 缺失时会直接返回（`ui/click/index.js`），所以这里只管切视图 ——
	 * 不拦截事件，引擎自己的拖拽 / 触摸收尾与 `_status.clicked` 复位都照常进行。
	 */
	const onFoldClick = function () {
		//拖动手牌（横向滚动）之后浏览器仍可能补一个 click，别把它当成点击
		if (_status.dragged || _status.justdragged) return;
		if (!isFolded(this) || this.classList.contains("removing")) return;
		const now = Date.now();
		if (now - lastToggle < 350) return;
		lastToggle = now;
		toggleFold();
	};

	/** 给牌绑上点击切换的监听（与引擎一致：触屏用 touchend，桌面用 click） */
	const bindCard = card => {
		if (boundCards.has(card)) return;
		boundCards.add(card);
		card.addEventListener(lib.config.touchscreen ? "touchend" : "click", onFoldClick);
	};

	/**
	 * 重排一次手牌：**折叠组压成更细的一条，展开组完全沿用引擎自己的折叠结果**。
	 *
	 * 引擎 `ui.updatehl` 会把两个容器各自按宽度折叠（`offset = min(112, (容器宽 - 128) / (张数 - 1))`，
	 * 下限 32px），并处理悬停摊开（`getSpreadOffset`）、`selected` 抬升、横向滚动 —— 这些"特效"
	 * 都要保留，所以**展开组的位置我们不动**（只整体减去折叠组压缩出来的位移量，牌与牌之间的相对
	 * 间距、悬停摊开的形状都保持引擎原样），只把**折叠组**换成更小的 `FOLD_PITCH`。
	 *
	 * 折叠组的位置取**引擎的基准位置**（下标 × 间距），**不跟随悬停摊开**：引擎的摊开是把悬停点之前
	 * 的牌整体左移、之后的整体右移（`spreadLeft / spreadRight`），照抄会让整条折叠带跟着鼠标漂。
	 *
	 * 折叠组还会被摘掉 `selectable`：点击它只切换视图，绝不会被误选（见 `onFoldClick`）。
	 */
	const applyLayout = () => {
		//@ts-ignore 引擎在 cardmouseenter 时记下的当前悬停牌
		const hover = ui._handcardHover;
		for (const { inner, outer } of boxes) {
			if (!inner || !outer || !inner.childNodes.length) continue;
			const cards = Array.from(inner.childNodes).filter(
				node => node.classList && node.classList.contains("card") && !node.classList.contains("removing")
			);
			if (!cards.length) continue;
			/** 读引擎刚写在这张牌上的 translateX（读不到就按下标推算） */
			const readX = (card, index, fallback) => {
				const matched = /translateX\((-?[\d.]+)px\)/.exec(card.style.transform || "");
				return matched ? parseFloat(matched[1]) : index * fallback;
			};
			//引擎给这个容器算的折叠间距：与 ui.updatehl 用同一个式子 —— 关了 `fold_card` 就是 112；否则
			//min(112, (容器宽 - 128) / (张数 - 1))，张数 > 1 时下限 32（只有一张牌时该式天然得 112）。
			//**不能**用"前两张牌的位置差"反推：引擎的悬停摊开会把悬停点之前的牌整体左移、之后的整体右移，
			//位置差被污染，折叠组就会跟着鼠标漂。
			const enginePitch = !lib.config.fold_card
				? 112
				: cards.length > 1
					? Math.max(32, Math.min(112, (outer.offsetWidth - 128) / (cards.length - 1)))
					: 112;
			/** 折叠组每压小一张，后面的牌就要跟进的位移 */
			let shift = 0;
			/** @type { HTMLElement | undefined } */
			let last;
			let lastX = 0;
			cards.forEach((node, index) => {
				const card = /** @type { HTMLElement } */ (node);
				bindCard(card);
				if (isFolded(card)) {
					//折叠组：压成 FOLD_PITCH 的细条；被悬停时给它让出一张牌宽，能看清是哪张。
					//位置取**引擎的基准位置**（下标 × 间距），而不是牌上的 transform —— 后者带着悬停摊开的
					//偏移，照抄会让整条折叠带跟着鼠标左右漂。
					const pitch = card === hover ? Math.max(FOLD_PITCH, card.offsetWidth || 0) : FOLD_PITCH;
					lastX = index * enginePitch - shift;
					shift += enginePitch - pitch;
					//折叠期间禁止被选中：摘掉 selectable（引擎 ui.click.card 见它缺失即直接返回）
					if (card.classList.contains("selectable")) {
						strippedSelectable.add(card);
						card.classList.remove("selectable");
					}
				} else {
					//展开组：沿用引擎算好的位置（含悬停摊开），只跟进折叠组压缩造成的整体位移
					lastX = readX(card, index, enginePitch) - shift;
					//之前被折叠过、重新展开的牌，把 selectable 补回去
					if (strippedSelectable.delete(card)) card.classList.add("selectable");
				}
				const base = `translateX(${Math.round(lastX)}px)`;
				//@ts-ignore 引擎用 _transform 记录基准位置，悬停摊开以它为起点
				card._transform = base;
				card.style.transform = card.classList.contains("selected") ? `${base} translateY(-20px)` : base;
				last = card;
			});
			const total = Math.round(lastX) + (last?.offsetWidth || 0);
			inner.style.setProperty("width", `${total}px`, "important");
			outer.classList.toggle("scrollh", total > outer.offsetWidth);
		}
	};

	/**
	 * 包住 `ui.updatehl`：引擎每次重排（初始化、摸牌、悬停、选牌…）后立刻重新应用我们的布局。
	 *
	 * 这样"真牌折叠、假牌平铺"始终成立，也不会再出现"假牌进手牌几秒后才折叠"的延迟。
	 */
	const patchedUpdatehl = function (...args) {
		const result = originalUpdatehl.apply(this, args);
		try {
			applyLayout();
		} catch (e) {
			//布局失败不能影响引擎自身的重排
			console.warn("[chooseFakeCard] 应用假牌布局失败：", e);
		}
		return result;
	};

	/** 把本函数造成的改动（updatehl 包装、点击监听、摘掉的 selectable、内层宽度、scrollh、牌的所属容器）全部还原 */
	const restore = () => {
		ui.updatehl = originalUpdatehl;
		for (const card of boundCards) card.removeEventListener(lib.config.touchscreen ? "touchend" : "click", onFoldClick);
		boundCards.clear();
		//折叠期间摘掉的 selectable 补回去，免得引擎的选牌逻辑少认了牌
		for (const card of strippedSelectable) card.classList.add("selectable");
		strippedSelectable.clear();
		for (const { inner, outer } of boxes) {
			if (!inner || !outer) continue;
			inner.style.removeProperty("width");
			outer.classList.remove("scrollh");
			//牌上的 transform 交回引擎：紧接着的 ui.updatehl() 会按它自己的算法整行重写
		}
		for (const { card, origin } of moved) {
			//牌可能在选择期间被弃置 / 移走（此时它已不在手牌区），只在仍留在手牌区时归位
			if (card.parentNode !== cards1 && card.parentNode !== cards2) continue;
			origin.appendChild(card);
		}
		//交回引擎自己排版（它会重写 transform，并重新计算 scrollh）
		ui.updatehl();
	};

	try {
		//single-handcard 布局只有一个手牌容器（handcards2 被隐藏），真假牌混在一起 —— 这时不搬牌，
		//靠逐张定位把真牌折起来、假牌留平铺（见 applyLayout）
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

		//接管"引擎重排之后的收尾"，并立刻排一次：不依赖容器宽度，因此不受外部样式影响，也没有延迟
		ui.updatehl = patchedUpdatehl;
		ui.updatehl();

	} catch (e) {
		//任何一步出错都立刻回滚：updatehl 包装与各种内联样式都是全局状态，绝不能泄漏出去
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

	/**
	 * 同时选择角色与选项（`player.chooseTargetControl()` 的 content）。
	 *
	 * 布局：提示文本在对话框里，**选项渲染在 `ui.control`（`#control`）里**，与引擎的「确定」同栏
	 * （`ui.create.control`，与本体 `chooseControl` 的 controlbar 形态一致）；角色仍在战场点选。
	 * 目标选择由引擎的 `chooseTarget` 流程托管 —— 把自建 dialog 作为 `dialog` 传进去后，
	 * 引擎会把 `prompt` 置为 false，于是它会跳过自建提示与 promptbar，但仍负责 AI / 在线 / 多端、
	 * `selectTarget` 范围门控（不满足范围时「确定」不出现）与收尾关框。
	 *
	 * **结束条件：必须同时选定目标与选项才会结束**（本 content 的核心约束）：
	 * - 引擎的「确定」由 `filterOk` 门控：本地交互时只有**已点选选项**（或该目标没有可选项）才会出现；
	 *   目标数不满足 `selectTarget` 时引擎本来就不显示「确定」；
	 * - 引擎的「取消」按钮被 `fakeforce` 隐藏，否则"只选目标、不选选项"也能结束，与上面的约束冲突；
	 *   需要允许放弃的调用方，请在 `controls` 里自己加 `"cancel2"` —— 点它即取消
	 *   （立即结束，`bool=false`、`control="cancel2"`，与本体 `chooseControl` 一致）。
	 *
	 * ⛔ 选项条目的点击**不能**走引擎默认的 `ui.click.control`：它会直接写 `_status.event.result`
	 * 并无条件 `game.resume()`，把暂停中的目标选择提前结束（结果还缺 `bool/targets`）。
	 * 这里用 `ui.create.control([...controls, handler])` 传入自定义处理函数：引擎会把它存进
	 * `control.custom`，点击条目时以 `(link, node)` 调用并**跳过**默认逻辑（`ui/click/index.js`），
	 * 于是我们只记录选项、刷新高亮，再调 `game.check()` 重算「确定」是否出现。
	 *
	 * 选项随目标联动：引擎在每次目标点选 / `game.check()` 后都会调用当前事件的 `custom.add.target`
	 * （`ui/click/index.js`、`game/check.js`），我们在那里重建选项条；同时留档已选目标，
	 * 因为取消时 `game.uncheck()` 会清空 `ui.selected.targets`，而结果里需要保留"选了人没选选项"的信息。
	 *
	 * @type { ContentFuncByAll[] }
	 */
	chooseTargetControl: [
		async function (event, trigger, player) {
			//兜底：任何提前返回 / 异常路径下 result 都是合法的空结果
			event.result = { bool: false, targets: [], control: undefined, index: -1, confirm: "cancel" };
			/** 本次点选的选项（条目点击只记录，最终是否生效由「确定」决定） */
			let picked;
			/** 已选目标快照：取消时 game.uncheck() 会清空选择，这里留档以便结果里仍能带上 targets */
			let snapTargets = [];
			/** 是否是本地玩家的交互路径（AI / 托管 / 联机客机不渲染选项条，选项由 controlAi 补） */
			const interactive = event.isMine();
			/** @type { Dialog | undefined } */
			let dialog;
			/** 选项条：`ui.control` 里的一个 `.control`（无可选项时不创建） */
			let bar;
			/** 已渲染的选项集合签名：集合没变就只刷高亮，避免重建带来的闪烁 */
			let rendered = null;
			/** @type { GameEvent | undefined } 目标事件（`filterOk` 需要读它的 result 判断是否走 AI 路径） */
			let targetEvent;
			//防连点：引擎的控件点击也有类似保护，这里用局部锁避免污染全局 _status.clicked
			let lock = false;

			/** 选项列表：`controls` 可为 `(targets) => string[]` 以随已选目标动态变化 */
			const resolveControls = targets => {
				const list = typeof event.controls === "function" ? event.controls(targets.slice()) : event.controls;
				return Array.isArray(list) ? list.slice() : [];
			};

			/**
			 * 选项条目被点击：只记录选择、刷新高亮、重算「确定」是否出现（**绝不写 result、不 resume**）。
			 * `"cancel2"` 特殊：与本体 `chooseControl` 一致，点它**立即**取消本次选择（见文件头注释）。
			 */
			function onClickOption(link, node) {
				if (lock || _status.dragged || _status.justdragged) return;
				lock = true;
				setTimeout(() => (lock = false), 200);
				//先记录再分流：cancel2 也写进 picked，这样结果里仍能拿到 control="cancel2"（与 chooseControl 一致）
				picked = link;
				if (link === "cancel2") {
					//「确定」栏可能因为上一步选过普通选项而存在；ui.click.cancel()（不带 node）不会关它，
					//这里按引擎 ui.create.confirm("") 的做法清掉，避免事件结束后残留按钮
					if (ui.confirm) {
						ui.confirm.close();
						delete ui.confirm;
					}
					//引擎的取消路径会写 result（confirm: "cancel"）并 resume
					ui.click.cancel();
					return;
				}
				updateBar();
				game.check();
			}

			/** 同步选项条：集合变化才重建条目，否则只更新高亮；已失效的点选会被作废 */
			function updateBar() {
				const targets = ui.selected.targets.slice();
				if (targets.length) snapTargets = targets;
				const list = resolveControls(targets);
				const signature = list.join("\u0000");
				if (signature !== rendered) {
					rendered = signature;
					//选项集合变了：之前点的选项若已不在列表里就作废（否则「确定」会带着失效的选项出现）
					if (picked != null && !list.includes(picked)) picked = void 0;
					if (interactive) {
						if (list.length) {
							//引擎会把最后一个函数存成 control.custom，点击条目时以 (link, node) 调用它
							if (bar) bar.replace(list.concat(onClickOption));
							else bar = ui.create.control(list.concat(onClickOption));
						} else if (bar) {
							//调用方没给可选项：不占用控制栏（「确定」此时不受选项门控，见 filterOk）
							bar.close();
							bar = void 0;
						}
					}
				}
				if (!bar) return;
				//复用引擎的高亮样式（`.glow:not(.button):not(.card)`）标示已选项
				for (const node of Array.from(bar.childNodes)) node.classList.toggle("glow", node.link === picked);
			}

			try {
				if (interactive) {
					//清掉上一个事件可能残留的选择，避免污染本次判定
					game.uncheck();
					dialog = ui.create.dialog("", "hidden");
					if (event.prompt) dialog.addText(event.prompt, event.prompt.length <= 20);
					if (event.prompt2) dialog.addText(event.prompt2, event.prompt2.length <= 20);
					dialog.open();
					//选项条：渲染在 ui.control（#control）里，与引擎的「确定」同栏
					updateBar();
				}

				//把自建 dialog 交给引擎托管：引擎据 dialog 参数把 prompt 置 false，从而跳过自建提示/promptbar，
				//同时负责 AI / 在线 / 多端、范围门控与收尾（收尾会 close 这个 dialog）
				targetEvent = player.chooseTarget({
					filterTarget: event.filterTarget,
					selectTarget: event.selectTarget,
					//隐藏技能：与本体一致，引擎会在需要时（`_status.prehidden_skills`）直接取消本次选择
					hsskill: event.hsskill,
					ai: event.ai,
					forced: event.forced,
					dialog: dialog,
					//隐藏「取消」按钮：本函数的约束是"必须同时选定目标与选项才结束"（fakeforce 只影响这个按钮，
					//不影响 forced 对目标数下限的门控；想允许放弃的调用方请在 controls 里加 "cancel2"）
					fakeforce: true,
					//「确定」门控：本地交互时必须已点选选项才会出现（见文件头注释）。
					//AI / 托管 / 联机客机走引擎自己的收尾（选项由事件结束后按 controlAi 补），这里不能拦：
					//引擎的 AI 分支会因 filterOk 不通过而直接取消事件，AI 就永远选不到选项了。
					filterOk: () => {
						if (typeof event.filterOk === "function" && !event.filterOk()) return false;
						if (!interactive || _status.auto || targetEvent?.result === "ai") return true;
						//没有可选项时不要求选（否则玩家无路可走；此时结果 bool 仍为 false）
						return picked != null || !resolveControls(ui.selected.targets.slice()).length;
					},
				});
				if (interactive) {
					//传了 dialog 时引擎不会再占用 custom.add.target，这里接管它做"选项随目标联动"
					if (!targetEvent.custom) targetEvent.custom = { add: {}, replace: {} };
					if (!targetEvent.custom.add) targetEvent.custom.add = {};
					const addTarget = targetEvent.custom.add.target;
					targetEvent.custom.add.target = () => {
						if (typeof addTarget === "function") addTarget.call(this);
						updateBar();
					};
				}

				const inner = (await targetEvent.forResult()) || {};
				const ok = !!inner.bool;
				const targets = ok && Array.isArray(inner.targets) ? inner.targets.slice() : snapTargets.slice();

				//AI / 托管 / 联机客机：目标选完后，再按 controlAi（缺省第一个选项）补上选项
				if (picked == null && targets.length) {
					const list = resolveControls(targets);
					if (list.length) {
						let choice = typeof event.controlAi === "function" ? event.controlAi(event.getParent(), player) : void 0;
						if (typeof choice === "number") choice = list[choice];
						if (choice == null) choice = list[0];
						picked = choice;
					}
				}

				const finalList = resolveControls(targets);
				const control = picked != null && finalList.includes(picked) ? picked : void 0;
				//"cancel2" 视为取消（与本体 chooseControl 的惯例一致）
				const engaged = control != null && control !== "cancel2";
				event.result = {
					bool: ok && engaged,
					targets: targets,
					control: control,
					index: control != null ? finalList.indexOf(control) : -1,
					confirm: engaged ? "ok" : "cancel",
				};
			} finally {
				//选项条与提示对话框都可能不存在（AI / 提前异常），逐一清理
				if (bar) bar.close();
				if (dialog) dialog.close();
				game.uncheck();
			}
		},
	],
};