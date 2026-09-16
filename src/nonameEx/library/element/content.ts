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