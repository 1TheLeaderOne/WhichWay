/**
 * battleOverlay.ts —— 战斗内「队友手牌 / 装备」覆盖层（跑在战斗子实例 realm）
 *
 * 本文件只做**引擎侧接线**：为每名我方干员挂一个 Vue 应用、把每阶段算好的视图数据写进 reactive、
 * 以及浮层的暂停/恢复与自建手牌面板的挂载定位。所有 DOM 结构与样式都在
 * `ui/components/battle/BattleAllyOverlay.vue` / `BattleHandPanel.vue` / `BattleEquipModal.vue` 里。
 *
 * 需求（用户 2026-10-01）：
 *  1. 非当前操控的我方干员：卡片右侧挂卡背面板（牌背图标下方＝手牌数，右侧＝手牌牌名纵向一行一张且全量列出可滚轮滚动，
 *     红牌红字/黑牌黑字），点击用**自建浮层**展开完整手牌并暂停对局；卡片下方挂装备图标，点击弹「装备 + 效果」浮层。
 *  2. 当前操控的我方干员（game.me）：手牌无需面板（自己看得见），装备图标改挂到卡片上方，其余同上。
 *  3. 角色右侧离视口太近时，卡背面板改挂卡片左侧。
 *  4. 展开的手牌：**不走引擎 dialog 接口**（dialog 有对话框栈与固定 top/left，会跟引擎自己的对话框互相覆盖），
 *     只能用浮层自己的「关闭」按钮关闭（点别处、按 Esc、再点面板都不关），且**允许多个同时存在**（每个干员各一个）；
 *     缩略面板与所有展开的浮层都要**随摸牌/出牌实时同步**（不能等到阶段边界）。
 *  5. 展开的手牌窗**默认视口居中**（贴武将展开会有边界问题）、高大于宽且不留多余空白，
 *     并**支持拖动**（拖标题栏；用开源库 interactjs，MIT，与本体 GPL-3.0 兼容）。
 *
 * 引擎事实：Player 即 `position:absolute` 的 HTMLDivElement，可作绝对定位锚点（覆盖层宿主铺满它）；
 * 手牌 `player.getCards("h")` 读的就是 `node.handcards1/2` 的子节点，故用 MutationObserver 盯这两处即可实时感知手牌增减；
 * 暂停 `game.pause()/resume()`；`game.me` 为当前操控者，`game.swapPlayer/swapControl` 会改判它，故包裹二者在换人后刷新布局。
 */

import { lib, game, get, ui, _status } from "noname";
import interact from "interactjs";
import { createApp, reactive, type App } from "vue";
import { getEquipment } from "./data/equipment.js";
import BattleAllyOverlay from "./ui/components/battle/BattleAllyOverlay.vue";
import BattleEquipModal from "./ui/components/battle/BattleEquipModal.vue";
import BattleHandPanel from "./ui/components/battle/BattleHandPanel.vue";
import {
	HAND_PANEL_W,
	type AllyOverlayState,
	type EquipModalState,
	type EquipView,
	type HandCardView,
	type HandPanelState,
} from "./ui/components/battle/battleOverlayTypes.js";

/** 只读用到的 brawlinfo 字段 */
interface AllyInfo {
	playercontrol?: boolean;
	equipIds?: string[];
}

/** 玩家显示名（角色 id → 中文） */
const playerName = (p: any): string => {
	try {
		return get.translation(p.name1 || p.name) || p.name1 || "干员";
	} catch {
		return "干员";
	}
};

/** 红牌：红桃/方块；其余（黑桃/梅花）按黑牌 */
const isRedCard = (card: any): boolean => card?.suit === "heart" || card?.suit === "diamond";

const handView = (card: any): HandCardView => ({ name: get.translation(card.name) || card.name, red: isRedCard(card) });

const equipViews = (p: any): EquipView[] => {
	const ids = (p.brawlinfo as AllyInfo | undefined)?.equipIds;
	if (!Array.isArray(ids)) return [];
	return ids.map(id => {
		const def = getEquipment(id);
		return { id, name: def ? def.name : id, img: def?.img, desc: def ? def.desc : "未知装备" };
	});
};

interface AllyEntry {
	player: any;
	state: AllyOverlayState;
	host: HTMLElement;
	app: App;
	observer?: MutationObserver;
}

/**
 * interactjs 的 Interactable，只声明本文件用到的 `unset()`。
 * 它的公开类型包 `@interactjs/types` 只是 interactjs 的内层依赖（没提到顶层 node_modules），
 * 在这里引绝对路径反而会把依赖面摊开，所以只写用到的这一个方法。
 */
interface Interactable {
	unset(): unknown;
}

/** 展开的手牌浮层记录（自建 UI，可同时存在多个，每名干员各一个） */
interface HandPanel {
	player: any;
	state: HandPanelState;
	/** 挂在 body 上的居中宿主（Vue 应用 mount 在它里面；z-index 也归它） */
	host: HTMLElement;
	app: App;
	/** 组件 onMounted 时交出来的卡片区，真实牌面 div 由 renderPanelCards 填进这里 */
	box: HTMLElement | null;
	/** 组件 onMounted 时交出来的面板根元素，拖动绑在它上面 */
	root: HTMLElement | null;
	/** interactjs 建好的拖动手柄，关闭时必须 unset，否则监听器留在 body 上 */
	drag?: Interactable;
	/** 上次渲染的手牌指纹，用于判断是否需要重画 */
	sig: string;
}

/** 浮层标题：带上实时手牌数 */
const handCaption = (p: any, n: number): string => `${playerName(p)}的手牌（${n}）`;

/**
 * 安装战斗覆盖层。在角色初始化完成（normalize）后调用一次。
 * 返回 { refresh, uninstall }；uninstall 在战斗结束时卸载全部 Vue 应用并还原被包裹的 game 方法。
 */
export function installBattleOverlays(): { refresh: () => void; uninstall: () => void } {
	const entries: AllyEntry[] = [];
	let modalCount = 0;
	let pausedByUs = false;

	const isAlly = (p: any): boolean => {
		const info = p.brawlinfo as AllyInfo | undefined;
		return !!info && info.playercontrol === true;
	};

	// —— 浮层计数：打开即暂停对局，全部关闭后恢复（引擎自身已暂停时不接管恢复）——
	const holdPause = () => {
		if (!pausedByUs && !_status.paused) {
			game.pause();
			pausedByUs = true;
		}
		modalCount++;
	};
	const releasePause = () => {
		modalCount--;
		if (modalCount <= 0 && pausedByUs) {
			modalCount = 0;
			pausedByUs = false;
			try {
				game.resume();
			} catch {
				/* ignore */
			}
		}
	};

	// —— 装备详情浮层：单例 Vue 应用挂在 body 上，靠 reactive 容器开关 ——
	const equipModal = reactive<{ equip: EquipModalState | null }>({ equip: null });
	const closeEquipModal = () => {
		if (!equipModal.equip) return;
		equipModal.equip = null;
		releasePause();
	};
	const openEquipModal = (p: any) => {
		if (!equipModal.equip) holdPause();
		equipModal.equip = { title: `${playerName(p)} 的装备`, equips: equipViews(p) };
	};
	const modalHost = document.createElement("div");
	document.body.appendChild(modalHost);
	const modalApp = createApp(BattleEquipModal, { modal: equipModal, onClose: closeEquipModal });
	modalApp.mount(modalHost);

	/**
	 * 展开完整手牌：**自建浮层**（BattleHandPanel.vue），不用引擎 dialog——
	 * dialog 有对话框栈（open 会 hide 别人/被 hide）与固定 top/left，跟引擎自己的结算窗互相覆盖。
	 * 面板外壳由 Vue 画（标题栏 + 关闭按钮 + 滚动卡片区），卡牌本体仍走 `ui.create.buttons(cards, "card", box, true)`
	 * ——card 按钮预设内部 `copy()`，原件不会离开角色手牌区，且 `.buttons`/`.card` 在本体每种布局都有样式，
	 * 皮肤立绘照常生效。
	 *
	 * 位置：**默认视口居中**（宿主 `position:fixed;inset:0` + flex 居中），不再贴干员卡片算坐标，
	 * 于是也就没有「右侧放不下翻到左侧」那套边界判断。玩家可拖标题栏挪位置（interactjs，MIT），
	 * 拖动范围夹在宿主＝视口内。
	 *
	 * 层级：`z-index` 必须写在**宿主**上而不是面板上——`position:fixed` 元素自带层叠上下文，
	 * 宿主是 `z-index:auto` 时面板的 999998 只在自己那一层里比大小，压不过引擎对话框。
	 *
	 * 生命周期：**只有面板自己的「关闭」按钮能关**（不接管点击/Esc），支持同时开多个（每名干员至多一个）。
	 * 手牌变化由 refresh() 推进来实时重画。
	 */
	const panels: HandPanel[] = [];
	/** 展开期间的兜底轮询：牌面内容变化（变化类技能/改名）不碰 childList，观察器看不到 */
	let handSyncTimer: number | undefined;

	/** 手牌指纹：只有真的换了牌才重画，避免每次刷新都重建卡牌按钮 */
	const handSignature = (cards: any[]): string => cards.map(c => `${c.cardid}:${c.name}${c.number}${c.suit}`).join("|");

	/** 重画面板里的卡片区（清空后重新出牌；标题/数量由 syncHandPanels 单独写进 reactive） */
	const renderPanelCards = (rec: HandPanel, cards: any[]) => {
		const box = rec.box;
		if (!box) return;
		box.innerHTML = "";
		if (cards.length) {
			ui.create.buttons(cards, "card", box, true);
		}
		rec.sig = handSignature(cards);
		ui.update();
	};

	/**
	 * 绑定拖动手柄（interactjs）：只认标题栏，移动量累加到面板的 `transform` 上，
	 * `restrictRect({ restriction: 'parent' })` 把面板夹在宿主（＝视口）里。
	 * 关闭时务必 `unset()`——监听器挂在 document 上，面板 DOM removed 也不会自己解绑。
	 *
	 * `shiftX` 同时作为初始 transform 写进去：多块面板都默认居中会完全重叠，所以第 2 块起往右错开，
	 * 后面那块的标题栏仍露在左侧可拖。
	 */
	const bindPanelDrag = (rec: HandPanel, shiftX: number) => {
		const root = rec.root;
		if (!root) return;
		const offset = { x: shiftX, y: 0 };
		root.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
		rec.drag = interact(root).draggable({
			allowFrom: ".gi-bhp-bar",
			ignoreFrom: ".gi-bhp-close",
			modifiers: [interact.modifiers.restrictRect({ restriction: "parent" })],
			listeners: {
				move: (event: { dx: number; dy: number }) => {
					offset.x += event.dx;
					offset.y += event.dy;
					root.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
				},
			},
		});
	};

	/** 只在「还开着面板」期间轮询；最后一块关掉即停 */
	const stopHandSync = () => {
		if (panels.length === 0 && handSyncTimer !== undefined) {
			clearInterval(handSyncTimer);
			handSyncTimer = undefined;
		}
	};

	/** 关闭某块展开面板（唯一入口是面板上的「关闭」按钮；uninstall 时也走这里收尾） */
	const closeHandPanel = (rec: HandPanel) => {
		const i = panels.indexOf(rec);
		if (i < 0) return;
		panels.splice(i, 1);
		rec.drag?.unset();
		rec.app.unmount();
		rec.host.remove();
		releasePause();
		stopHandSync();
	};

	/** 把最新手牌推给每一块展开中的面板（缩略面板与详列同一数据源） */
	const syncHandPanels = () => {
		for (const rec of panels) {
			// 角色已离场：面板留着等玩家自己点关闭，只不再读它的牌
			if (!rec.player.parentNode) continue;
			const cards = (rec.player.getCards("h") || []) as any[];
			rec.state.count = cards.length;
			rec.state.title = handCaption(rec.player, cards.length);
			if (handSignature(cards) !== rec.sig) {
				renderPanelCards(rec, cards);
			}
		}
	};

	/** 打开某干员的手牌面板；同一干员已开着则什么都不做（点面板不是开关，关闭只走按钮） */
	const openHandPanel = (p: any) => {
		if (panels.some(rec => rec.player === p)) return;
		const cards = (p.getCards("h") || []) as any[];
		holdPause();
		// 已开着的块数（ push 之前取）：新面板从中心往右错开，免得几块居中的完全叠成一摞
		const shiftX = Math.min(panels.length, 5) * 28;
		const state = reactive<HandPanelState>({
			title: handCaption(p, cards.length),
			count: cards.length,
		});
		// 宿主铺满视口负责居中；z-index 也只能写在这里（见上方说明），面板自己 pointer-events:auto
		const host = document.createElement("div");
		host.style.cssText =
			"position:fixed;inset:0;z-index:999998;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:none;";
		document.body.appendChild(host);
		// 每名干员至多一块面板，回调里用 player 反查记录即可（闭包在 mount 之后才跑，届时记录已入列）
		const findRec = () => panels.find(r => r.player === p);
		const app = createApp(BattleHandPanel, {
			panel: state,
			onClose: () => {
				const rec = findRec();
				if (rec) closeHandPanel(rec);
			},
			onReady: (box: HTMLElement, root: HTMLElement) => {
				const rec = findRec();
				if (rec) {
					rec.box = box;
					rec.root = root;
				}
			},
		});
		const rec: HandPanel = { player: p, state, host, app, box: null, root: null, sig: "" };
		panels.push(rec);
		// mount 期间组件 onMounted 同步回调 onReady 交出卡片区与面板根节点，之后才能出牌/绑拖动
		app.mount(host);
		renderPanelCards(rec, cards);
		bindPanelDrag(rec, shiftX);
		if (handSyncTimer === undefined) {
			handSyncTimer = window.setInterval(refresh, 500);
		}
	};

	// —— 为一名我方干员挂一个覆盖层应用 ——
	const buildFor = (p: any): AllyEntry => {
		const state = reactive<AllyOverlayState>({
			hand: [],
			count: 0,
			equips: equipViews(p),
			isMe: false,
			hidden: false,
			flipLeft: false,
		});
		// 宿主铺满干员卡片但不吃点击（否则会挡住点将），组件内部的面板/图标各自恢复 pointer-events
		const host = document.createElement("div");
		host.style.cssText = "position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;";
		p.appendChild(host);
		const app = createApp(BattleAllyOverlay, {
			ally: state,
			onOpenHand: () => openHandPanel(p),
			onOpenEquip: () => openEquipModal(p),
		});
		app.mount(host);
		return { player: p, state, host, app };
	};

	// —— 刷新：把手牌/操控态/阵亡/贴边算成纯数据写进 reactive，Vue 自行重绘 ——
	const refresh = () => {
		const vw = document.documentElement.clientWidth || window.innerWidth;
		for (const e of entries) {
			if (!e.player.parentNode) continue;
			const cards = (e.player.getCards("h") || []) as any[];
			e.state.isMe = e.player === game.me;
			e.state.hidden = typeof e.player.isDead === "function" && e.player.isDead();
			e.state.count = cards.length;
			e.state.hand = cards.map(handView);
			// 角色右侧贴边时面板会被视口裁掉，改挂到卡片左侧
			const rect = e.player.getBoundingClientRect();
			e.state.flipLeft = rect.right + HAND_PANEL_W + 8 > vw;
		}
		syncHandPanels();
	};

	/** 合并同一批 DOM 变更，微任务里刷一次（摸牌/出牌/弃牌都会立刻改手牌区子节点） */
	let pendingRefresh = false;
	const scheduleRefresh = () => {
		if (pendingRefresh) return;
		pendingRefresh = true;
		Promise.resolve().then(() => {
			pendingRefresh = false;
			refresh();
		});
	};

	/**
	 * 盯住干员的手牌区子节点。`getCards("h")` 读的就是 `node.handcards1/2` 的子节点，
	 * 所以 childList 变化即手牌变化——比按阶段刷新实时得多（阶段只在回合边界触发，摸牌当下不触发）。
	 * game.me 的 handcards1 会被挪到底部手牌栏，但节点本身不变，观察不受影响。
	 */
	const observeHand = (p: any): MutationObserver | undefined => {
		const node = p.node;
		if (!node?.handcards1) return;
		const observer = new MutationObserver(scheduleRefresh);
		observer.observe(node.handcards1, { childList: true });
		if (node.handcards2) observer.observe(node.handcards2, { childList: true });
		return observer;
	};

	for (const p of game.players) {
		if (!isAlly(p)) continue;
		const entry = buildFor(p);
		entry.observer = observeHand(p);
		entries.push(entry);
	}
	refresh();

	// 每阶段刷新（队友手牌随回合变化）
	const phaseListener = () => refresh();
	lib.onphase.push(phaseListener);

	// 包裹换人 API：game.me 变更后重排（操控者手牌隐藏、装备置顶）
	const g = game as unknown as { swapPlayer?: (player: any) => void; swapControl?: (player: any) => void };
	const origSwapPlayer = g.swapPlayer;
	const origSwapControl = g.swapControl;
	const afterSwap = () => {
		Promise.resolve().then(refresh);
	};
	if (origSwapPlayer) {
		g.swapPlayer = function (this: unknown, player: any) {
			const r = origSwapPlayer.call(this, player);
			afterSwap();
			return r;
		};
	}
	if (origSwapControl) {
		g.swapControl = function (this: unknown, player: any) {
			const r = origSwapControl.call(this, player);
			afterSwap();
			return r;
		};
	}

	return {
		refresh,
		uninstall: () => {
			const oi = lib.onphase.indexOf(phaseListener as never);
			if (oi >= 0) lib.onphase.splice(oi, 1);
			if (origSwapPlayer) g.swapPlayer = origSwapPlayer;
			if (origSwapControl) g.swapControl = origSwapControl;
			// 先关浮层（各自 releasePause），再撤观察器与 Vue
			for (const rec of panels.slice()) closeHandPanel(rec);
			closeEquipModal();
			for (const e of entries) {
				e.observer?.disconnect();
				e.app.unmount();
				e.host.remove();
			}
			entries.length = 0;
			modalApp.unmount();
			modalHost.remove();
			modalCount = 0;
			if (pausedByUs) {
				pausedByUs = false;
				try {
					game.resume();
				} catch {
					/* ignore */
				}
			}
		},
	};
}
