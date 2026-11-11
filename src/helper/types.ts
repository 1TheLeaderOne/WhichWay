/**
 * helper/types.ts —— 新手帮助（WhichWayHelper）的公共数据协议
 *
 * 本文件只放**可序列化**的步骤 / 位置 / 样式协议，以及运行时共用的视图状态，
 * 不依赖 noname、Vue 或任何扩展内模块。后续可视化提示编辑器可以直接复用这些类型：
 * 编辑器产出的 JSON 只要满足 {@link HelperChain}，就能交给 `whichWayHelper.run()`。
 *
 * 约定：
 * - 所有坐标默认都是**视口坐标（px）**，与 `getBoundingClientRect()` 同口径；
 * - 步骤里除 `highlight` / `position` 允许运行时函数外，其余字段都应可 JSON 序列化；
 * - 样式字段全部可选，未设置的字段使用 {@link DEFAULT_HELPER_STYLE}。
 */

/** 视口坐标矩形（px） */
export interface HelperRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

/** 兼容 DOMRect 与 `{ left, top, width, height }` 的矩形写法 */
export interface HelperRectLike {
	x?: number;
	y?: number;
	left?: number;
	top?: number;
	width: number;
	height: number;
}

/** 视口九宫格锚点 */
export type HelperAnchor = "top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right";

/** 相对高亮目标的布局方位 */
export type HelperPlacement = "auto" | "top" | "bottom" | "left" | "right";

/** 相对高亮目标的对齐方式 */
export type HelperAlign = "start" | "center" | "end";

/**
 * 位置预设（相对**视口**）：
 * - `"center"` / `"top"` / `"bottom"` / `"left"` / `"right"` 为中点贴边；
 * - 其余为九宫格锚点（如 `"bottom-right"`）。
 */
export type HelperPositionPreset = "center" | "top" | "bottom" | "left" | "right" | HelperAnchor;

/** 屏幕坐标点 */
export interface HelperPoint {
	x: number;
	y: number;
}

/** 尺寸 */
export interface HelperSize {
	width: number;
	height: number;
}

/**
 * 位置参数。
 *
 * 优先级：`x/y`（绝对坐标） > `anchor`（视口锚点） > `placement`（相对高亮目标） > 自动/居中。
 * `offsetX/offsetY` 在最终坐标上叠加；`clamp` 默认 `true`，会把提示框夹在视口内。
 */
export interface HelperPositionOptions {
	/** 视口左上角 x（px）；与 y 同时提供时优先作为绝对坐标 */
	x?: number;
	/** 视口左上角 y（px）；与 x 同时提供时优先作为绝对坐标 */
	y?: number;
	/** 相对视口的九宫格锚点 */
	anchor?: HelperAnchor;
	/** 相对高亮目标的方位；`"auto"` 会按可用空间自动挑选 */
	placement?: HelperPlacement;
	/** 沿目标边的对齐方式，默认 `"center"` */
	align?: HelperAlign;
	/** 与高亮目标的间距，默认 20px */
	gap?: number;
	/** 最终坐标的额外偏移 */
	offsetX?: number;
	offsetY?: number;
	/** 是否把提示框夹在视口内，默认 `true` */
	clamp?: boolean;
}

/** 布局上下文：位置解析函数与编辑器共用 */
export interface HelperLayoutContext {
	step: HelperStep;
	index: number;
	total: number;
	/** 当前高亮矩形（已包含 padding）；无高亮时为 null */
	rect: HelperRect | null;
	viewport: HelperSize;
	/** 整个提示组合（左图 + 右框）的尺寸 */
	guide: HelperSize;
	/** 右侧文字框的尺寸 */
	dialog: HelperSize;
	/** 未指定位置时的默认点（居中） */
	defaultPoint: HelperPoint;
}

/**
 * 位置解析函数。返回：
 * - `{ x, y }` 或 {@link HelperPositionOptions}：按返回结果定位；
 * - 预设字符串：按视口锚点定位。
 *
 * 注意：函数无法被 JSON 序列化，编辑器产出的数据请使用对象形式。
 */
export type HelperPositionResolver = (context: HelperLayoutContext) => HelperPoint | HelperPositionOptions | HelperPositionPreset;

/** 提示框位置 */
export type HelperPosition = HelperPositionPreset | HelperPositionOptions | HelperPositionResolver;

/** 高亮目标的通用选项 */
export interface HelperHighlightOptions {
	/** 高亮框相对目标的额外内边距，默认取样式里的 highlightPadding */
	padding?: number;
	/** 高亮框圆角，默认取样式里的 highlightRadius */
	radius?: number;
	/** 目标位置变化（滚动 / 尺寸变化）时是否跟随，默认 true */
	follow?: boolean;
}

/** 用 CSS 选择器指定高亮元素 */
export interface HelperSelectorHighlight extends HelperHighlightOptions {
	selector: string;
}

/** 直接传 DOM 元素指定高亮目标 */
export interface HelperElementHighlight extends HelperHighlightOptions {
	element: Element;
}

/** 用任意视口矩形指定高亮位置 */
export interface HelperRectHighlight extends HelperHighlightOptions {
	rect: HelperRectLike | DOMRect;
}

/** 运行时惰性解析高亮目标 */
export type HelperHighlightResolver = () => Element | HelperRectLike | DOMRect | null;

/**
 * 高亮目标：
 * - 字符串：CSS 选择器；
 * - `Element`：直接高亮该元素，点击会**正常传给游戏**；
 * - 矩形：突出屏幕上的任意位置（该区域会拦截点击，只用于推进提示）；
 * - 对象/函数：上述形式的显式包装或惰性解析。
 */
export type HelperHighlight =
	| string
	| Element
	| HelperRectLike
	| DOMRect
	| HelperSelectorHighlight
	| HelperElementHighlight
	| HelperRectHighlight
	| HelperHighlightResolver;

/** 左侧人物图 */
export interface HelperPortraitOptions {
	/** 图片地址，支持本扩展的路径 scheme（`dec:` / `illu:` / `ui:` 等）或普通 URL */
	src?: string;
	/** 无障碍文本 */
	alt?: string;
	/** 图片填充方式，默认取样式里的 portraitFit */
	fit?: "cover" | "contain";
}

/** 左侧人物图：字符串等价于 `{ src }` */
export type HelperPortrait = string | HelperPortraitOptions;

/** 单步的推进规则 */
export type HelperAdvanceOn = "any" | "highlight";

/**
 * 一条新手提示。
 *
 * @example
 * {
 *   text: "点击这里进入设置。",
 *   highlight: { selector: "#menu" },
 *   advanceOn: "highlight",
 *   waitFor: 1000,
 *   position: { placement: "bottom", align: "center" },
 * }
 */
export interface HelperStep {
	/** 可选唯一标识，便于编辑器定位与事件追踪 */
	id?: string;
	/** 可选小标题 / 说话人，显示在正文上方 */
	title?: string;
	/** 右侧正文；纯文本，换行用 `\n` */
	text: string;
	/** 左侧人物图；不传时使用默认占位图（dec:1.jpg） */
	portrait?: HelperPortrait;
	/** 高亮目标；不传时整屏遮罩，没有挖洞 */
	highlight?: HelperHighlight;
	/** 提示框位置；不传时按高亮自动摆放，无高亮则居中 */
	position?: HelperPosition;
	/**
	 * 点击推进规则，默认 `"any"`：
	 * - `"any"`：点击遮罩、提示框或高亮目标都会推进；高亮元素本身的点击仍会传给游戏；
	 * - `"highlight"`：只有点击高亮区域才推进，点其它地方不响应。
	 * 选了 `"highlight"` 就必须提供 `highlight`。
	 */
	advanceOn?: HelperAdvanceOn;
	/** 等待高亮元素出现的最长时间（ms），默认 0（只等一帧） */
	waitFor?: number;
	/** 单步样式覆盖 */
	style?: HelperStyle;
	/** 自定义数据，原样透传给事件回调，编辑器可用来存节点 id 等 */
	data?: Record<string, unknown>;
}

/** 外观样式（全部可选） */
export interface HelperStyle {
	/** 遮罩颜色，默认 `#050608` */
	maskColor?: string;
	/** 遮罩不透明度 0~1，默认 0.72 */
	maskOpacity?: number;
	/** 高亮描边颜色，默认 `#c94b4b` */
	highlightColor?: string;
	/** 高亮描边宽度（px），默认 2 */
	highlightWidth?: number;
	/** 高亮框内边距（px），默认 8 */
	highlightPadding?: number;
	/** 高亮框圆角（px），默认 8 */
	highlightRadius?: number;
	/** 左侧方形人物图边长（px），默认 176；小屏会被 CSS 再夹小 */
	portraitSize?: number;
	/** 人物图填充方式，默认 `"cover"` */
	portraitFit?: "cover" | "contain";
	/** 右侧文字框最小宽度（px），默认 320 */
	dialogMinWidth?: number;
	/** 右侧文字框最大宽度（px），默认 760 */
	dialogMaxWidth?: number;
	/** 右侧文字框最小高度（px），默认 136 */
	dialogMinHeight?: number;
	/** 正文字号（px）；不设置时由 CSS 按视口自适应 */
	fontSize?: number;
	/** 正文行高倍数，默认 1.65 */
	lineHeight?: number;
	/** 提示框与视口边缘的最小距离（px），默认 16 */
	viewportPadding?: number;
	/** 遮罩层 z-index，默认 2147483000 */
	zIndex?: number;
	/** 右侧描边颜色，默认 `#b54242` */
	dialogBorderColor?: string;
	/** 是否显示多步进度（如 01 / 03），默认 true */
	showProgress?: boolean;
	/** 是否显示「点击继续」提示，默认 true */
	showHint?: boolean;
	/** 是否启用淡入 / 脉冲动画，默认 true */
	animation?: boolean;
}

/** 补齐默认值后的样式 */
export interface ResolvedHelperStyle {
	maskColor: string;
	maskOpacity: number;
	highlightColor: string;
	highlightWidth: number;
	highlightPadding: number;
	highlightRadius: number;
	portraitSize: number;
	portraitFit: "cover" | "contain";
	dialogMinWidth: number;
	dialogMaxWidth: number;
	dialogMinHeight: number;
	fontSize: number | null;
	lineHeight: number;
	viewportPadding: number;
	zIndex: number;
	dialogBorderColor: string;
	showProgress: boolean;
	showHint: boolean;
	animation: boolean;
}

/**
 * 一条提示链（任务链）。
 *
 * 用户每完成一步（默认点击一下），自动进入下一步；最后一步完成后默认关闭。
 */
export interface HelperChain {
	/** 可选唯一 id；注册到 helper 注册表时必填 */
	id?: string;
	/** 展示名，便于编辑器列表显示 */
	name?: string;
	steps: HelperStep[];
	/** 整体样式；单步的 `style` 会覆盖它 */
	style?: HelperStyle;
	/** 最后一步结束后是否自动关闭，默认 true */
	closeOnFinish?: boolean;
	/** 是否允许按 Esc 中止，默认 true */
	escapable?: boolean;
}

/** run() / preview() 的输入：链对象、步骤数组、单步对象，或注册表里的链 id */
export type HelperChainInput = HelperChain | HelperStep[] | HelperStep | string;

/** 单步事件载荷 */
export interface HelperStepEventPayload {
	step: HelperStep;
	index: number;
	total: number;
}

/** 提示框完成布局、可以交互时的载荷 */
export interface HelperReadyPayload extends HelperStepEventPayload {
	/** 当前高亮矩形（含 padding）；无高亮为 null */
	rect: HelperRect | null;
	/** 提示组合（左图 + 右框）的左上角 */
	position: HelperPoint;
	/** 提示组合尺寸 */
	guide: HelperSize;
	/** 右侧文字框尺寸 */
	dialog: HelperSize;
}

/** 推进事件载荷 */
export interface HelperAdvancePayload {
	from: number;
	/** 推进到的步骤下标；最后一步完成时为 null */
	to: number | null;
	/** 推进后的步骤；完成时是最后一步 */
	step: HelperStep;
	total: number;
}

/** 结束原因 */
export type HelperFinishReason = "complete" | "api" | "skip" | "replaced";

/** 结束载荷 */
export interface HelperFinishPayload extends HelperStepEventPayload {
	reason: HelperFinishReason;
}

/** 中止载荷 */
export interface HelperAbortPayload {
	/** 中止原因：escape / api / destroy / replaced 等 */
	reason: string;
	index: number;
	total: number;
	step: HelperStep | null;
}

/** 运行选项 */
export interface HelperRunOptions {
	/** 从第几步开始，默认 0 */
	startIndex?: number;
	/** 覆盖链上的整体样式 */
	style?: HelperStyle;
	/** 预览模式：点击推进但不会自动关闭，最后一步只发 `preview-end` */
	preview?: boolean;
	/** 已有引导在运行时是否替换它，默认 true；false 时直接抛错 */
	replace?: boolean;
	onStep?: (step: HelperStep, index: number, total: number) => void;
	onReady?: (payload: HelperReadyPayload) => void;
	onLayout?: (payload: HelperReadyPayload) => void;
	onFinish?: (payload: HelperFinishPayload) => void;
	onAbort?: (payload: HelperAbortPayload) => void;
	onPreviewEnd?: (payload: HelperStepEventPayload) => void;
}

/** 事件表（编辑器/外部模块可订阅） */
export interface HelperEventMap {
	start: { chain: HelperChain; preview: boolean };
	step: HelperStepEventPayload;
	ready: HelperReadyPayload;
	/** 滚动 / 缩放 / 内容变化导致的重新布局 */
	layout: HelperReadyPayload;
	advance: HelperAdvancePayload;
	finish: HelperFinishPayload;
	abort: HelperAbortPayload;
	/** 热更新当前步骤 */
	update: HelperStepEventPayload;
	/** 预览模式最后一步被点击 */
	"preview-end": HelperStepEventPayload;
}

export type HelperEventName = keyof HelperEventMap;

/** 对外状态快照（步骤已做序列化清洗） */
export interface HelperStateSnapshot {
	active: boolean;
	visible: boolean;
	preview: boolean;
	chainId?: string;
	index: number;
	total: number;
	step: HelperStep | null;
	rect: HelperRect | null;
	position: HelperPoint | null;
}

/** 提示框用到的静态资源地址（已按扩展路径 scheme 解析） */
export interface HelperAssets {
	defaultPortrait: string;
	dialogTexture: string;
	portraitFrame: string;
	portraitBacking: string;
}

/** 渲染层共享的响应式状态（由 index.ts 写入，GuideOverlay.vue 只读） */
export interface HelperViewState {
	visible: boolean;
	preview: boolean;
	step: HelperStep | null;
	index: number;
	total: number;
	style: ResolvedHelperStyle;
	assets: HelperAssets;
	/** 是否允许 Esc 中止 */
	escapable: boolean;
}

/** 高亮解析结果 */
export interface HelperResolvedHighlight {
	/** 解析到的元素；任意矩形高亮时为 null */
	element: Element | null;
	/** 已包含 padding 的视口矩形 */
	rect: HelperRect | null;
	padding: number;
	radius: number;
	follow: boolean;
}

/** 遮罩布局：四块遮罩围出一个矩形洞 */
export interface HelperMaskLayout {
	top: HelperRect;
	bottom: HelperRect;
	left: HelperRect;
	right: HelperRect;
	/** 夹到视口内的洞；无高亮 / 洞不可见时为 null */
	hole: HelperRect | null;
}

/** 计算出的提示框位置 */
export interface HelperComputedPosition extends HelperPoint {
	placement: HelperPlacement | "absolute" | "anchor" | "center";
	clamped: boolean;
}

/** 默认占位头像：不设置 portrait 时使用 `image/decoration/1.jpg` */
export const DEFAULT_HELPER_PORTRAIT = "dec:1.jpg";

/** 默认静态资源（相对扩展根目录的路径 scheme） */
export const DEFAULT_HELPER_ASSET_PATHS = {
	dialogTexture: "ui:guide/dialog_bg.png",
	portraitFrame: "ui:guide/frame_1px$0.png",
	portraitBacking: "ui:guide/emoji_bkg$0.png",
} as const;

/** 默认样式 */
export const DEFAULT_HELPER_STYLE: ResolvedHelperStyle = {
	maskColor: "#050608",
	maskOpacity: 0.72,
	highlightColor: "#c94b4b",
	highlightWidth: 2,
	highlightPadding: 8,
	highlightRadius: 8,
	portraitSize: 176,
	portraitFit: "cover",
	dialogMinWidth: 320,
	dialogMaxWidth: 760,
	dialogMinHeight: 136,
	fontSize: null,
	lineHeight: 1.65,
	viewportPadding: 16,
	zIndex: 2147483000,
	dialogBorderColor: "#b54242",
	showProgress: true,
	showHint: true,
	animation: true,
};

/** 数值夹取 */
const clampNumber = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/**
 * 合并并补齐样式。
 *
 * 后传入的样式覆盖先传入的；`undefined` / `null` 不覆盖。
 * 返回新对象，不会修改入参。
 *
 * @param styles 任意个样式（通常顺序：默认值 → 链样式 → 运行选项 → 单步样式）
 */
export function resolveHelperStyle(...styles: Array<HelperStyle | undefined | null>): ResolvedHelperStyle {
	const resolved: ResolvedHelperStyle = { ...DEFAULT_HELPER_STYLE };
	for (const style of styles) {
		if (!style) continue;
		for (const key of Object.keys(resolved) as Array<keyof ResolvedHelperStyle>) {
			const value = style[key as keyof HelperStyle];
			if (value !== undefined && value !== null) {
				(resolved as unknown as Record<string, unknown>)[key] = value;
			}
		}
	}

	resolved.maskOpacity = clampNumber(resolved.maskOpacity, 0, 1);
	resolved.highlightWidth = Math.max(0, resolved.highlightWidth);
	resolved.highlightPadding = Math.max(0, resolved.highlightPadding);
	resolved.highlightRadius = Math.max(0, resolved.highlightRadius);
	resolved.portraitSize = Math.max(48, resolved.portraitSize);
	resolved.dialogMinWidth = Math.max(0, resolved.dialogMinWidth);
	resolved.dialogMaxWidth = Math.max(resolved.dialogMinWidth, resolved.dialogMaxWidth);
	resolved.dialogMinHeight = Math.max(0, resolved.dialogMinHeight);
	resolved.fontSize = resolved.fontSize && resolved.fontSize > 0 ? resolved.fontSize : null;
	resolved.lineHeight = Math.max(0.8, resolved.lineHeight);
	resolved.viewportPadding = Math.max(0, resolved.viewportPadding);
	resolved.zIndex = Math.round(resolved.zIndex);
	return resolved;
}
