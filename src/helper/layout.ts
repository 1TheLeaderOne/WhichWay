/**
 * helper/layout.ts —— 新手帮助的纯布局算法
 *
 * 这里不碰 Vue / noname，只负责：
 * 1. 把 `highlight` 的四种写法（选择器 / 元素 / 任意矩形 / 惰性函数）归一成视口矩形；
 * 2. 根据位置协议计算左侧人物图 + 右侧文字框组成的提示组合该放在哪里；
 * 3. 把高亮矩形拆成四块遮罩，围出一个可交互的洞。
 *
 * 纯函数便于后续可视化编辑器单独调用（例如拖拽提示框时实时预览位置）。
 */

import type {
	HelperAlign,
	HelperComputedPosition,
	HelperHighlight,
	HelperHighlightOptions,
	HelperHighlightResolver,
	HelperLayoutContext,
	HelperMaskLayout,
	HelperPlacement,
	HelperPoint,
	HelperPosition,
	HelperPositionOptions,
	HelperPositionPreset,
	HelperRect,
	HelperRectLike,
	HelperResolvedHighlight,
	HelperSize,
	HelperStep,
	ResolvedHelperStyle,
} from "./types.js";

/** 空矩形 */
const EMPTY_RECT: HelperRect = { x: 0, y: 0, width: 0, height: 0 };

/** 当前视口尺寸 */
export function getViewportSize(): HelperSize {
	if (typeof window === "undefined") return { width: 0, height: 0 };
	return {
		width: window.innerWidth || document.documentElement?.clientWidth || 0,
		height: window.innerHeight || document.documentElement?.clientHeight || 0,
	};
}

/** 是否 DOM 元素 */
export function isElement(value: unknown): value is Element {
	return typeof Element !== "undefined" && value instanceof Element;
}

/** 是否 DOMRect */
export function isDomRect(value: unknown): value is DOMRect {
	return typeof DOMRect !== "undefined" && value instanceof DOMRect;
}

/** 是否普通对象（排除元素 / DOMRect） */
function isPlainRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !isElement(value) && !isDomRect(value);
}

/**
 * 是否是「矩形写法」：必须同时有 width / height，以及 x 或 left、y 或 top。
 *
 * 带 `selector` / `element` / `rect` 的包装对象会被排除，交给 resolveHighlight 处理。
 */
export function isRectLike(value: unknown): value is HelperRectLike {
	if (!isPlainRecord(value)) return false;
	if ("selector" in value || "element" in value || "rect" in value) return false;
	const record = value as Record<string, unknown>;
	const hasWidth = typeof record.width === "number";
	const hasHeight = typeof record.height === "number";
	const hasX = typeof record.x === "number" || typeof record.left === "number";
	const hasY = typeof record.y === "number" || typeof record.top === "number";
	return hasWidth && hasHeight && hasX && hasY;
}

/** 把各种矩形写法归一成 {@link HelperRect} */
export function normalizeRect(value: HelperRectLike | DOMRect): HelperRect {
	const record = value as HelperRectLike & { left?: number; top?: number };
	const x = typeof record.x === "number" ? record.x : typeof record.left === "number" ? record.left : 0;
	const y = typeof record.y === "number" ? record.y : typeof record.top === "number" ? record.top : 0;
	const width = typeof record.width === "number" ? record.width : 0;
	const height = typeof record.height === "number" ? record.height : 0;
	return {
		x: Number.isFinite(x) ? x : 0,
		y: Number.isFinite(y) ? y : 0,
		width: Number.isFinite(width) ? Math.max(0, width) : 0,
		height: Number.isFinite(height) ? Math.max(0, height) : 0,
	};
}

/** 元素当前视口矩形 */
export function elementToRect(element: Element): HelperRect {
	return normalizeRect(element.getBoundingClientRect());
}

/** 向四周扩张矩形 */
export function inflateRect(rect: HelperRect, padding: number): HelperRect {
	if (!padding) return { ...rect };
	return {
		x: rect.x - padding,
		y: rect.y - padding,
		width: rect.width + padding * 2,
		height: rect.height + padding * 2,
	};
}

/** 把矩形夹到视口内（用于遮罩挖洞） */
export function clampRectToViewport(rect: HelperRect, viewport: HelperSize): HelperRect {
	const left = Math.max(0, Math.min(viewport.width, rect.x));
	const top = Math.max(0, Math.min(viewport.height, rect.y));
	const right = Math.max(left, Math.min(viewport.width, rect.x + rect.width));
	const bottom = Math.max(top, Math.min(viewport.height, rect.y + rect.height));
	return { x: left, y: top, width: right - left, height: bottom - top };
}

/** 两个矩形是否近似相等 */
export function rectsEqual(a: HelperRect | null, b: HelperRect | null, epsilon = 0.5): boolean {
	if (a === b) return true;
	if (!a || !b) return false;
	return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon && Math.abs(a.width - b.width) <= epsilon && Math.abs(a.height - b.height) <= epsilon;
}

/** 点是否在矩形内（含边界） */
export function pointInRect(x: number, y: number, rect: HelperRect): boolean {
	return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

/**
 * 等待选择器对应的元素出现。
 *
 * @param selector CSS 选择器
 * @param timeoutMs 超时时间；<= 0 时只查询一次
 * @param signal 中止信号（步骤切换时组件会 abort）
 */
export function waitForSelector(selector: string, timeoutMs = 0, signal?: AbortSignal): Promise<Element | null> {
	let invalidSelector = false;
	const query = (): Element | null => {
		try {
			return document.querySelector(selector);
		} catch (error) {
			invalidSelector = true;
			console.warn(`[WhichWayHelper] 无效的高亮选择器：${selector}`, error);
			return null;
		}
	};

	const initial = query();
	if (initial || invalidSelector || timeoutMs <= 0 || signal?.aborted) return Promise.resolve(initial);

	return new Promise<Element | null>(resolve => {
		let settled = false;
		let interval = 0;
		let timeout = 0;

		const onAbort = () => finish(null);
		const cleanup = () => {
			if (interval) window.clearInterval(interval);
			if (timeout) window.clearTimeout(timeout);
			signal?.removeEventListener("abort", onAbort);
		};
		const finish = (element: Element | null) => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(element);
		};

		signal?.addEventListener("abort", onAbort, { once: true });
		interval = window.setInterval(() => {
			if (signal?.aborted) return finish(null);
			const element = query();
			if (element) finish(element);
		}, 50);
		timeout = window.setTimeout(() => finish(null), timeoutMs);
	});
}

/** 解析高亮目标的选项 */
function applyHighlightOptions(source: unknown, target: { padding: number; radius: number; follow: boolean }): void {
	if (!isPlainRecord(source)) return;
	const options = source as HelperHighlightOptions;
	if (typeof options.padding === "number" && Number.isFinite(options.padding)) target.padding = Math.max(0, options.padding);
	if (typeof options.radius === "number" && Number.isFinite(options.radius)) target.radius = Math.max(0, options.radius);
	if (typeof options.follow === "boolean") target.follow = options.follow;
}

/** resolveHighlight 的可选项 */
export interface ResolveHighlightOptions {
	/** 等待元素出现的最长时间（ms） */
	waitFor?: number;
	/** 中止信号 */
	signal?: AbortSignal;
	/** 默认 padding（通常来自样式） */
	defaultPadding?: number;
	/** 默认 radius（通常来自样式） */
	defaultRadius?: number;
}

/**
 * 解析 `highlight`。
 *
 * 返回的 `rect` 已经包含 padding；`element` 仅在目标是真实元素时非空。
 * 目标找不到 / 选择器非法 / 元素已脱离文档时返回 `null`，由调用方降级成全屏遮罩。
 */
export async function resolveHighlight(source: HelperHighlight | undefined | null, options: ResolveHighlightOptions = {}): Promise<HelperResolvedHighlight | null> {
	if (source === undefined || source === null) return null;

	const meta = {
		padding: options.defaultPadding ?? 8,
		radius: options.defaultRadius ?? 8,
		follow: true,
	};

	let target: unknown = source;
	if (typeof target === "function") {
		try {
			target = (target as HelperHighlightResolver)();
		} catch (error) {
			console.warn("[WhichWayHelper] 高亮解析函数抛错", error);
			return null;
		}
	}

	let element: Element | null = null;
	let rect: HelperRect | null = null;
	let fromElement = false;

	if (typeof target === "string") {
		element = await waitForSelector(target, options.waitFor ?? 0, options.signal);
		fromElement = true;
		if (!element) {
			console.warn(`[WhichWayHelper] 未找到高亮元素：${target}`);
			return null;
		}
	} else if (isElement(target)) {
		element = target;
		fromElement = true;
	} else if (isDomRect(target) || isRectLike(target)) {
		rect = normalizeRect(target);
	} else if (isPlainRecord(target)) {
		applyHighlightOptions(target, meta);
		const record = target;
		if (typeof record.selector === "string" && record.selector) {
			element = await waitForSelector(record.selector, options.waitFor ?? 0, options.signal);
			fromElement = true;
			if (!element) {
				console.warn(`[WhichWayHelper] 未找到高亮元素：${record.selector}`);
				return null;
			}
		} else if (isElement(record.element)) {
			element = record.element;
			fromElement = true;
		} else if (record.rect && (isDomRect(record.rect) || isRectLike(record.rect))) {
			rect = normalizeRect(record.rect);
		} else {
			console.warn("[WhichWayHelper] 无法识别的 highlight 配置", target);
			return null;
		}
	} else {
		console.warn("[WhichWayHelper] 无法识别的 highlight 配置", target);
		return null;
	}

	if (element) {
		if (!element.isConnected) {
			console.warn("[WhichWayHelper] 高亮元素不在文档中", element);
			return null;
		}
		rect = elementToRect(element);
	}
	if (!rect) return null;

	return {
		element: fromElement ? element : null,
		rect: inflateRect(rect, meta.padding),
		padding: meta.padding,
		radius: meta.radius,
		follow: meta.follow,
	};
}

/**
 * 计算四块遮罩，使中间矩形区域保持无遮罩（可点击）。
 *
 * 无高亮、洞完全在视口外或洞尺寸为 0 时，返回整屏遮罩（top 为全屏，其余为 0）。
 */
export function computeMaskLayout(rect: HelperRect | null, viewport: HelperSize): HelperMaskLayout {
	const fullScreen = (): HelperMaskLayout => ({
		top: { x: 0, y: 0, width: viewport.width, height: viewport.height },
		bottom: { ...EMPTY_RECT },
		left: { ...EMPTY_RECT },
		right: { ...EMPTY_RECT },
		hole: null,
	});

	if (!rect || rect.width <= 0 || rect.height <= 0) return fullScreen();

	const hole = clampRectToViewport(rect, viewport);
	if (hole.width <= 0 || hole.height <= 0) return fullScreen();

	// 用 ceil / floor 让四块遮罩互相压 0.5~1px，避免亚像素缝隙
	const topHeight = Math.ceil(hole.y);
	const bottomY = Math.floor(hole.y + hole.height);
	const leftWidth = Math.ceil(hole.x);
	const rightX = Math.floor(hole.x + hole.width);

	return {
		top: { x: 0, y: 0, width: viewport.width, height: Math.max(0, Math.min(viewport.height, topHeight)) },
		bottom: { x: 0, y: Math.max(0, bottomY), width: viewport.width, height: Math.max(0, viewport.height - Math.max(0, bottomY)) },
		left: { x: 0, y: hole.y, width: Math.max(0, Math.min(viewport.width, leftWidth)), height: hole.height },
		right: { x: Math.max(0, rightX), y: hole.y, width: Math.max(0, viewport.width - Math.max(0, rightX)), height: hole.height },
		hole,
	};
}

/** computeGuidePosition 参数 */
export interface ComputeGuidePositionOptions {
	position: HelperPosition | undefined;
	rect: HelperRect | null;
	viewport: HelperSize;
	/** 整个提示组合尺寸 */
	guide: HelperSize;
	/** 右侧文字框尺寸 */
	dialog: HelperSize;
	style: ResolvedHelperStyle;
	step: HelperStep;
	index: number;
	total: number;
}

/** 把位置预设映射为九宫格锚点 */
function presetToAnchor(preset: HelperPositionPreset): HelperPositionPreset {
	if (preset === "top" || preset === "bottom" || preset === "left" || preset === "right" || preset === "center") return preset;
	return preset;
}

/** 解析位置值（函数会递归解析返回值） */
function resolvePositionValue(
	position: HelperPosition | undefined,
	context: HelperLayoutContext,
	depth = 0,
): { preset?: HelperPositionPreset; options?: HelperPositionOptions } {
	if (position === undefined || position === null) return {};
	if (typeof position === "string") return { preset: position };
	if (typeof position === "function") {
		if (depth >= 3) {
			console.warn("[WhichWayHelper] position 函数递归层级过深，已忽略");
			return {};
		}
		try {
			const result = position(context);
			return resolvePositionValue(result as HelperPosition, context, depth + 1);
		} catch (error) {
			console.warn("[WhichWayHelper] position 解析函数抛错", error);
			return {};
		}
	}
	if (typeof position === "object") return { options: position };
	return {};
}

/** 按锚点计算左上角 */
function pointFromAnchor(anchor: HelperPositionPreset, guide: HelperSize, viewport: HelperSize): HelperPoint {
	if (anchor === "top" || anchor === "bottom" || anchor === "left" || anchor === "right" || anchor === "center") {
		switch (anchor) {
			case "top":
				return { x: (viewport.width - guide.width) / 2, y: 0 };
			case "bottom":
				return { x: (viewport.width - guide.width) / 2, y: viewport.height - guide.height };
			case "left":
				return { x: 0, y: (viewport.height - guide.height) / 2 };
			case "right":
				return { x: viewport.width - guide.width, y: (viewport.height - guide.height) / 2 };
			default:
				return { x: (viewport.width - guide.width) / 2, y: (viewport.height - guide.height) / 2 };
		}
	}

	const hasLeft = anchor.includes("left");
	const hasRight = anchor.includes("right");
	const hasTop = anchor.includes("top");
	const hasBottom = anchor.includes("bottom");
	return {
		x: hasLeft ? 0 : hasRight ? viewport.width - guide.width : (viewport.width - guide.width) / 2,
		y: hasTop ? 0 : hasBottom ? viewport.height - guide.height : (viewport.height - guide.height) / 2,
	};
}

/** 按对齐方式计算沿目标边的坐标 */
function alignOffset(start: number, size: number, targetStart: number, targetSize: number, align: HelperAlign): number {
	if (align === "start") return targetStart;
	if (align === "end") return targetStart + targetSize - size;
	return targetStart + (targetSize - size) / 2;
}

/** 计算某一侧的位置 */
function pointForSide(side: Exclude<HelperPlacement, "auto">, rect: HelperRect, guide: HelperSize, gap: number, align: HelperAlign): HelperPoint {
	switch (side) {
		case "right":
			return { x: rect.x + rect.width + gap, y: alignOffset(0, guide.height, rect.y, rect.height, align) };
		case "left":
			return { x: rect.x - guide.width - gap, y: alignOffset(0, guide.height, rect.y, rect.height, align) };
		case "bottom":
			return { x: alignOffset(0, guide.width, rect.x, rect.width, align), y: rect.y + rect.height + gap };
		case "top":
			return { x: alignOffset(0, guide.width, rect.x, rect.width, align), y: rect.y - guide.height - gap };
	}
}

/** 某点距离视口的溢出量（越小越合适） */
function overflowScore(point: HelperPoint, guide: HelperSize, viewport: HelperSize, padding: number): number {
	return (
		Math.max(0, padding - point.x) +
		Math.max(0, point.x + guide.width - (viewport.width - padding)) +
		Math.max(0, padding - point.y) +
		Math.max(0, point.y + guide.height - (viewport.height - padding))
	);
}

/** 点是否完整落在视口安全区内 */
function fitsViewport(point: HelperPoint, guide: HelperSize, viewport: HelperSize, padding: number): boolean {
	return point.x >= padding && point.y >= padding && point.x + guide.width <= viewport.width - padding && point.y + guide.height <= viewport.height - padding;
}

/** 把提示框夹进视口 */
function clampPoint(point: HelperPoint, guide: HelperSize, viewport: HelperSize, padding: number): HelperPoint {
	const maxX = Math.max(0, viewport.width - guide.width);
	const maxY = Math.max(0, viewport.height - guide.height);
	const minX = Math.min(padding, maxX);
	const minY = Math.min(padding, maxY);
	const maxAllowedX = Math.max(minX, maxX - padding);
	const maxAllowedY = Math.max(minY, maxY - padding);
	return {
		x: Math.min(Math.max(point.x, minX), maxAllowedX),
		y: Math.min(Math.max(point.y, minY), maxAllowedY),
	};
}

/**
 * 计算提示组合的位置。
 *
 * - 指定 x/y：绝对坐标（会被夹进视口）；
 * - 指定 anchor / 预设：相对视口九宫格；
 * - 指定 placement：相对高亮目标的上/下/左/右；`auto` 会挑第一个放得下的方向；
 * - 都没有：有高亮时自动摆放，无高亮时居中。
 */
export function computeGuidePosition(options: ComputeGuidePositionOptions): HelperComputedPosition {
	const { position, rect, viewport, guide, dialog, style, step, index, total } = options;
	const padding = Math.max(0, style.viewportPadding);
	const defaultPoint: HelperPoint = {
		x: (viewport.width - guide.width) / 2,
		y: (viewport.height - guide.height) / 2,
	};

	const context: HelperLayoutContext = { step, index, total, rect, viewport, guide, dialog, defaultPoint };
	const { preset, options: positionOptions } = resolvePositionValue(position, context);
	const config: HelperPositionOptions = positionOptions ?? {};
	const gap = typeof config.gap === "number" && Number.isFinite(config.gap) ? config.gap : 20;
	const align: HelperAlign = config.align === "start" || config.align === "end" ? config.align : "center";
	const offsetX = typeof config.offsetX === "number" && Number.isFinite(config.offsetX) ? config.offsetX : 0;
	const offsetY = typeof config.offsetY === "number" && Number.isFinite(config.offsetY) ? config.offsetY : 0;
	const shouldClamp = config.clamp !== false;

	let point: HelperPoint;
	let placement: HelperComputedPosition["placement"];
	let basePoint: HelperPoint;

	if (typeof config.x === "number" && typeof config.y === "number") {
		basePoint = { x: config.x, y: config.y };
		placement = "absolute";
	} else if (preset) {
		basePoint = pointFromAnchor(presetToAnchor(preset), guide, viewport);
		placement = "anchor";
	} else if (config.anchor) {
		basePoint = pointFromAnchor(config.anchor, guide, viewport);
		placement = "anchor";
	} else if (rect) {
		const requested = config.placement ?? "auto";
		if (requested === "auto") {
			const sides: Array<Exclude<HelperPlacement, "auto">> = ["right", "left", "bottom", "top"];
			const candidates = sides.map(side => ({ side, point: pointForSide(side, rect, guide, gap, align) }));
			const fitting = candidates.find(candidate => fitsViewport(candidate.point, guide, viewport, padding));
			const chosen =
				fitting ??
				candidates.reduce((best, candidate) => (overflowScore(candidate.point, guide, viewport, padding) < overflowScore(best.point, guide, viewport, padding) ? candidate : best), candidates[0]);
			basePoint = chosen.point;
			placement = chosen.side;
		} else {
			basePoint = pointForSide(requested, rect, guide, gap, align);
			placement = requested;
		}
	} else {
		basePoint = defaultPoint;
		placement = "center";
	}

	point = shouldClamp ? clampPoint(basePoint, guide, viewport, padding) : { ...basePoint };
	point.x += offsetX;
	point.y += offsetY;

	const clamped = Math.abs(point.x - basePoint.x - offsetX) > 0.5 || Math.abs(point.y - basePoint.y - offsetY) > 0.5;
	return { x: point.x, y: point.y, placement, clamped };
}
