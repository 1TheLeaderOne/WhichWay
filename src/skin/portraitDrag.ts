import { game } from "noname";
import { whichWayToast } from "../toast/index.js";
import { getPortraitKey, hasPortraitLayers, repaintPortrait } from "./avatarBackground.js";
import { flushSave, getPos, restorePos, setPos, snapshotPos, type PortraitPos } from "./portraitPos.js";

/**
 * 皮肤拖拽：用鼠标/手指直接调整干员立绘（含皮肤）的位置与大小
 *
 * 只能拖「明日方舟干员」的头像节点：判据是 `hasPortraitLayers`（即这块立绘由 `avatarBackground.ts`
 * 的两层背景绘制）。本体武将与其它扩展的角色走引擎原流程，节点上没有我们的子元素，也就没有可移动的东西，
 * 所以「仅对明日方舟干员有效」不需要额外判断角色表，天然成立。
 *
 * 与动皮拖拽（`spineWork.draggingDyc`）的差别：
 * - 动皮改的是 spine 骨骼坐标，本模块改的是 CSS `transform`，落盘在 `json/pos.json`；
 * - 动皮是开发模式专属，本功能是给玩家用的（普通模式也开放）；
 * - 这里用 Pointer Events（一套代码同时覆盖鼠标与触摸）而不是拆成 mouse/touch 两套，
 *   也不用 interactjs：为这点交互再引一份 ~140kB 依赖进 skin 分块不划算。
 *
 * 无名杀自带缩放（`ui_zoom` → `document.body` 的 `scale`）的处理：指针事件的 `clientX/Y` 是**屏幕像素**，
 * 而 CSS 里写的是**布局像素**，两者的比值就是 `game.documentZoom`。所以所有位移先除以它换算成布局像素，
 * 再除以节点尺寸得到比例 —— 这样无论缩放调到多少，拖动手感都与画面实际一致，存档里存的也是与分辨率无关的比例。
 */

/** 缩放上下限：下限避免立绘小到看不见，上限避免贴图放大到糊成一片 */
const MIN_SCALE = 0.2;
const MAX_SCALE = 5;

/** HUD 刷新间隔（ms），与动皮拖拽一致 */
const HUD_INTERVAL = 200;

/** 节点 → 退出拖拽的还原函数；非空即处于拖拽模式 */
let teardownMap: Map<HTMLDivElement, () => void> | undefined;

/** 进入拖拽模式时的设定备份，供「重置」回滚 */
let snapshot: string | undefined;

/**
 * 本次模式弹过的 HUD toast id。
 * 自己记账而不是遍历 `toastRegistry`：id 是按干员动态生成的，退出时要全部撤掉，
 * 遍历登记表要碰 `toastRegistry` 的内部结构（它带自定义 `get` 方法，键类型并不规整）。
 */
const hudToastIds = new Set<string>();

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

/** 屏幕像素 → 布局像素（抵消无名杀自带缩放） */
function toLayoutDelta(delta: number) {
	return delta / (game.documentZoom || 1);
}

/**
 * 遍历场上所有「已套两层背景」的立绘节点。
 * 主将 `node.avatar`、副将 `node.avatar2` 都要，阵亡角色也保留立绘（方便调整死者的构图）。
 */
function forEachPortraitNode(fn: (node: HTMLDivElement) => void) {
	if (!game?.players) return;
	for (const player of game.players.concat(game.dead ?? [])) {
		for (const node of [player.node?.avatar, player.node?.avatar2]) {
			// @ts-ignore PointerEvent / HTMLDivElement 在引擎的类型声明里对不上，节点本身确实是 div
			if (hasPortraitLayers(node)) fn(node);
		}
	}
}

/**
 * 给单个节点装拖拽交互
 * @returns 还原函数；解析不出该立绘属于哪个干员时返回 undefined（不装）
 */
function enableNode(node: HTMLDivElement): (() => void) | undefined {
	const key = getPortraitKey(node);
	if (!key) return;

	//进入前的内联样式要记住：退出时按原值写回，不能一刀切清空（引擎给某些节点自己设过 pointer-events）
	const previousStyle = {
		pointerEvents: node.style.pointerEvents,
		cursor: node.style.cursor,
		touchAction: node.style.touchAction,
	};
	node.style.pointerEvents = "all";
	node.style.cursor = "move";
	//不关掉浏览器的默认手势，手机上拖动会变成页面滚动、双指会变成页面缩放
	node.style.touchAction = "none";

	/** 当前按下的指针（屏幕坐标），size 为 2 时进入双指捏合 */
	const pointers = new Map<number, { x: number; y: number }>();
	/** 上一帧两指间距，用于算捏合倍率 */
	let pinchDistance = 0;
	let lastHudTime = 0;

	const currentPos = (): PortraitPos => getPos(key.charId, key.skin);

	const apply = (next: PortraitPos) => {
		//先写数据再重绘：重绘会读 layers.url，而引擎可能在重绘途中又画一次（读到的是同一条设定）
		setPos(key.charId, key.skin, next);
		repaintPortrait(node, next);
	};

	const showHud = (force = false) => {
		const now = Date.now();
		if (!force && now - lastHudTime < HUD_INTERVAL) return;
		lastHudTime = now;
		const pos = currentPos();
		const id = `dragging_portrait_${key.charId}_${key.skin}`;
		hudToastIds.add(id);
		whichWayToast.showToast(
			`[${key.charId} · ${key.skin}] x=${pos.x.toFixed(3)} y=${pos.y.toFixed(3)} scale=${pos.scale.toFixed(2)}`,
			true,
			"topLeft",
			id
		);
	};

	/** 位移（屏幕像素增量）→ 按比例写进设定 */
	const moveBy = (screenDx: number, screenDy: number) => {
		const width = node.clientWidth;
		const height = node.clientHeight;
		if (!width || !height) return;
		const pos = currentPos();
		apply({ x: pos.x + toLayoutDelta(screenDx) / width, y: pos.y + toLayoutDelta(screenDy) / height, scale: pos.scale });
	};

	const zoomBy = (factor: number) => {
		const pos = currentPos();
		apply({ x: pos.x, y: pos.y, scale: clamp(pos.scale * factor, MIN_SCALE, MAX_SCALE) });
	};

	const distance = () => {
		const [a, b] = [...pointers.values()];
		if (!a || !b) return 0;
		return Math.hypot(b.x - a.x, b.y - a.y);
	};

	const onPointerDown = (event: PointerEvent) => {
		event.preventDefault();
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		if (pointers.size === 2) pinchDistance = distance();
		//捕获指针：移出头像（甚至移出窗口）也继续收到 move/up，不会拖到一半断掉
		node.setPointerCapture?.(event.pointerId);
		node.addEventListener("pointermove", onPointerMove);
		node.addEventListener("pointerup", onPointerUp);
		node.addEventListener("pointercancel", onPointerUp);
	};

	const onPointerMove = (event: PointerEvent) => {
		const last = pointers.get(event.pointerId);
		if (!last) return;
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

		if (pointers.size >= 2) {
			//双指：捏合间距的比值即缩放倍率（只改大小，中点平移不做——单手能拖，不必两套手势抢同一段位移）
			const nextDistance = distance();
			if (pinchDistance > 0 && nextDistance > 0) zoomBy(nextDistance / pinchDistance);
			pinchDistance = nextDistance;
			showHud();
			return;
		}

		moveBy(event.clientX - last.x, event.clientY - last.y);
		showHud();
	};

	const onPointerUp = (event: PointerEvent) => {
		pointers.delete(event.pointerId);
		node.releasePointerCapture?.(event.pointerId);
		node.removeEventListener("pointermove", onPointerMove);
		node.removeEventListener("pointerup", onPointerUp);
		node.removeEventListener("pointercancel", onPointerUp);
		if (pointers.size < 2) pinchDistance = 0;
		//松手就把最终值落盘（300ms 的合并写入之外再补一次，避免拖完立刻关游戏丢数据）
		flushSave();
		showHud(true);
	};

	/** 滚轮缩放：`passive: false` 才能 preventDefault，否则会连带滚动页面 */
	const onWheel = (event: WheelEvent) => {
		event.preventDefault();
		//指数映射：滚一格（deltaY≈100）约 ±20%，触控板的小增量也平滑
		zoomBy(clamp(Math.exp(-event.deltaY * 0.002), 0.8, 1.25));
		showHud(true);
	};

	/**
	 * 拖拽期间吃掉点击：引擎的点击查看绑在 player 节点（头像的父级）上，
	 * 不拦住的话每拖一次就弹一次玩家菜单。点副将/主将的立绘本身在拖拽模式里没有别的用途。
	 */
	const onClick = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();
	};

	node.addEventListener("pointerdown", onPointerDown);
	node.addEventListener("wheel", onWheel, { passive: false });
	node.addEventListener("click", onClick, true);

	return () => {
		node.removeEventListener("pointerdown", onPointerDown);
		node.removeEventListener("wheel", onWheel);
		node.removeEventListener("click", onClick, true);
		node.removeEventListener("pointermove", onPointerMove);
		node.removeEventListener("pointerup", onPointerUp);
		node.removeEventListener("pointercancel", onPointerUp);
		pointers.clear();
		node.style.pointerEvents = previousStyle.pointerEvents;
		node.style.cursor = previousStyle.cursor;
		node.style.touchAction = previousStyle.touchAction;
	};
}

/** 拖拽模式期间的浮动按钮条（退出 / 重置） */
let modeBar: HTMLDivElement | undefined;

function createModeBar() {
	const bar = document.createElement("div");
	bar.id = "portraitDragBarSJZX";

	const exit = document.createElement("button");
	exit.textContent = "退出拖拽";
	exit.addEventListener("click", () => togglePortraitDragging());

	const reset = document.createElement("button");
	reset.textContent = "重置本次调整";
	reset.addEventListener("click", () => resetPortraitDragging());

	bar.append(exit, reset);
	document.body.appendChild(bar);
	return bar;
}

/** 关掉拖拽模式：还原所有节点、立刻落盘、清掉 HUD */
export function stopPortraitDragging() {
	if (!teardownMap) return;
	for (const teardown of teardownMap.values()) teardown();
	teardownMap = undefined;
	snapshot = void 0;
	modeBar?.remove();
	modeBar = void 0;
	flushSave();

	for (const id of hudToastIds) whichWayToast.removeToastById(id);
	hudToastIds.clear();
	whichWayToast.removeToastById("dragging_portrait_mode");
}

/** 按当前（重置后的）设定重绘场上所有可拖立绘 */
function repaintAll() {
	forEachPortraitNode(node => {
		const key = getPortraitKey(node);
		if (!key) return;
		repaintPortrait(node, getPos(key.charId, key.skin));
	});
}

function startPortraitDragging() {
	const nodes: HTMLDivElement[] = [];
	forEachPortraitNode(node => nodes.push(node));
	if (nodes.length === 0) {
		whichWayToast.showToast("[驶舰之向] 场上没有可拖拽的明日方舟立绘（只有本扩展绘制的干员立绘能调位置）", 4000);
		return;
	}

	snapshot = snapshotPos();
	teardownMap = new Map();
	for (const node of nodes) {
		const teardown = enableNode(node);
		if (teardown) teardownMap.set(node, teardown);
	}

	if (teardownMap.size === 0) {
		teardownMap = void 0;
		snapshot = void 0;
		whichWayToast.showToast("[驶舰之向] 场上没有可拖拽的明日方舟立绘", 4000);
		return;
	}

	modeBar = createModeBar();
	whichWayToast.showToast("[驶舰之向] 已进入皮肤拖拽：拖动改位置，滚轮/双指改大小，调整后自动保存", true, "bottomRight", "dragging_portrait_mode");
}

/**
 * 皮肤拖拽按钮入口（`ui.create.system` 注册的就是它）：一次进入、一次退出。
 */
export function togglePortraitDragging() {
	if (teardownMap) {
		stopPortraitDragging();
		whichWayToast.showToast("[驶舰之向] 已退出皮肤拖拽，位置已保存", 2500);
		return;
	}
	startPortraitDragging();
}

/**
 * 把本次拖拽模式内的所有调整回退到进模式之前的状态。
 */
export function resetPortraitDragging() {
	if (!teardownMap || snapshot === void 0) {
		whichWayToast.showToast("[驶舰之向] 请先点「皮肤拖拽」进入拖拽模式", 2500);
		return;
	}
	restorePos(snapshot);
	repaintAll();
	whichWayToast.showToast("[驶舰之向] 已恢复到进入皮肤拖拽前的位置", 2500);
}
