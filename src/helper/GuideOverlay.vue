<script setup lang="ts">
/**
 * helper/GuideOverlay.vue —— 新手帮助的渲染层
 *
 * 由 helper/index.ts 挂在 document.body 上的常驻 Vue 应用渲染。本组件只读 state，
 * 点击通过 advance / abort 回调交给管理器，不在组件内维护任务链。
 *
 * 关键行为：
 * - 遮罩用四块 fixed 矩形围出高亮洞，洞里的真实元素可以正常接收点击（不阻断游戏）；
 * - advanceOn="any"：点遮罩 / 点提示框 / 点高亮目标都推进；
 * - advanceOn="highlight"：只有点高亮区域才推进，点别处只轻微抖动提示；
 * - 提示组合位置支持绝对坐标、视口锚点、相对高亮目标自动/指定方位；
 * - 文字框宽度由内容撑开（fit-content），并受最小 / 最大宽高约束。
 *
 * 样式注意：引擎全局有 div { display:inline-block; position:absolute; transition:all .5s }，
 * 因此每个用到的 div 都显式声明 position / display / transition，不能省略。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import {
	computeGuidePosition,
	computeMaskLayout,
	elementToRect,
	getViewportSize,
	inflateRect,
	isDomRect,
	isElement,
	isRectLike,
	normalizeRect,
	pointInRect,
	rectsEqual,
	resolveHighlight,
} from "./layout.js";
import type { HelperHighlight, HelperReadyPayload, HelperRect, HelperRectLike, HelperSize, HelperViewState } from "./types.js";

const props = defineProps<{
	state: HelperViewState;
	advance: () => void;
	abort: (reason: string) => void;
	notifyReady: (payload: HelperReadyPayload) => void;
	notifyLayout: (payload: HelperReadyPayload) => void;
	resolveImage?: (src: string) => string;
}>();

const rootEl = ref<HTMLElement | null>(null);
const guideEl = ref<HTMLElement | null>(null);
const dialogEl = ref<HTMLElement | null>(null);

const ready = ref(false);
const viewport = ref<HelperSize>({ width: 0, height: 0 });
const highlightRect = ref<HelperRect | null>(null);
const guidePosition = ref<{ x: number; y: number } | null>(null);
const guideSize = ref<HelperSize>({ width: 0, height: 0 });
const dialogSize = ref<HelperSize>({ width: 0, height: 0 });
const targetEl = ref<Element | null>(null);
const activePadding = ref(8);
const activeRadius = ref(8);
const activeFollow = ref(true);
const targetHitTestable = ref(true);
const effectiveAdvanceOn = ref<"any" | "highlight">("any");

const step = computed(() => props.state.step);
const style = computed(() => props.state.style);

const hasSpotlight = computed(() => {
	const rect = highlightRect.value;
	return !!rect && rect.width > 0 && rect.height > 0;
});
/** 元素自己可命中时不放 catcher（保持点击穿透）；不可命中 / 任意矩形高亮时放透明点击层 */
const showCatcher = computed(() => hasSpotlight.value && (!targetEl.value || !targetHitTestable.value));
const maskLayout = computed(() => computeMaskLayout(highlightRect.value, viewport.value));

const stepKey = computed(() => String(props.state.index) + "-" + (props.state.step?.id ?? ""));
const stepNumber = computed(() => String(props.state.index + 1).padStart(2, "0"));
const totalNumber = computed(() => String(props.state.total).padStart(2, "0"));
const showProgress = computed(() => props.state.style.showProgress && props.state.total > 1);
const showHint = computed(() => props.state.style.showHint);
const showFooter = computed(() => showProgress.value || showHint.value || props.state.preview);
const hintText = computed(() => (effectiveAdvanceOn.value === "highlight" ? "点击高亮区域继续" : "点击任意位置继续"));

const portrait = computed(() => {
	let src = props.state.assets.defaultPortrait;
	let alt = props.state.step?.title || "新手帮助";
	let fit = props.state.style.portraitFit;
	const value = props.state.step?.portrait;
	if (typeof value === "string") {
		if (value) src = value;
	} else if (value) {
		if (value.src) src = value.src;
		if (value.alt) alt = value.alt;
		if (value.fit) fit = value.fit;
	}
	return { src, alt, fit };
});
const portraitUrl = computed(() => resolvePortraitImage(portrait.value.src));

const rootStyle = computed<Record<string, string>>(() => {
	const current = props.state.style;
	const vars: Record<string, string> = {
		"--wwh-z-index": String(current.zIndex),
		"--wwh-mask-color": current.maskColor,
		"--wwh-mask-opacity": String(current.maskOpacity),
		"--wwh-highlight-color": current.highlightColor,
		"--wwh-highlight-width": current.highlightWidth + "px",
		"--wwh-highlight-radius": current.highlightRadius + "px",
		"--wwh-portrait-size": current.portraitSize + "px",
		"--wwh-portrait-fit": current.portraitFit,
		"--wwh-dialog-min-width": current.dialogMinWidth + "px",
		"--wwh-dialog-max-width": current.dialogMaxWidth + "px",
		"--wwh-dialog-min-height": current.dialogMinHeight + "px",
		"--wwh-line-height": String(current.lineHeight),
		"--wwh-dialog-border": current.dialogBorderColor,
		"--wwh-texture": 'url("' + props.state.assets.dialogTexture + '")',
		"--wwh-frame": 'url("' + props.state.assets.portraitFrame + '")',
		"--wwh-portrait-backing": 'url("' + props.state.assets.portraitBacking + '")',
	};
	if (current.fontSize) vars["--wwh-font-size"] = current.fontSize + "px";
	return vars;
});

const guideStyle = computed<Record<string, string>>(() => ({
	left: (guidePosition.value?.x ?? -10000) + "px",
	top: (guidePosition.value?.y ?? -10000) + "px",
	visibility: ready.value ? "visible" : "hidden",
}));

const spotStyle = computed<Record<string, string>>(() => {
	const rect = highlightRect.value;
	if (!rect) return { display: "none" };
	return {
		left: rect.x + "px",
		top: rect.y + "px",
		width: rect.width + "px",
		height: rect.height + "px",
		borderRadius: activeRadius.value + "px",
	};
});

const catcherStyle = computed<Record<string, string>>(() => {
	const rect = highlightRect.value;
	if (!rect) return { display: "none" };
	return {
		left: rect.x + "px",
		top: rect.y + "px",
		width: rect.width + "px",
		height: rect.height + "px",
		borderRadius: activeRadius.value + "px",
	};
});

function panelStyle(part: "top" | "bottom" | "left" | "right" | "full"): Record<string, string> {
	let panel: HelperRect;
	if (part === "full") panel = { x: 0, y: 0, width: viewport.value.width, height: viewport.value.height };
	else panel = maskLayout.value[part];
	return {
		left: panel.x + "px",
		top: panel.y + "px",
		width: panel.width + "px",
		height: panel.height + "px",
		backgroundColor: props.state.style.maskColor,
		opacity: String(props.state.style.maskOpacity),
	};
}

function resolvePortraitImage(src: string): string {
	if (!src) return props.state.assets.defaultPortrait;
	try {
		return props.resolveImage?.(src) || src;
	} catch (error) {
		console.warn("[WhichWayHelper] 解析人物图路径失败", error);
		return src;
	}
}

function nextFrame(): Promise<void> {
	return new Promise(resolve => window.requestAnimationFrame(() => resolve()));
}

/**
 * 判断高亮元素是否能被鼠标直接命中。
 *
 * 有些界面元素（例如纯展示的标题）会被祖先设成 pointer-events:none，点击会落到祖先上；
 * 这时需要在高亮洞里铺一层透明 catcher，否则「必须点中高亮元素」的步骤无法完成。
 * 命中的元素若属于帮助层自身（提示框 / 遮罩），用 elementsFromPoint 继续往下找。
 */
/**
 * 生成高亮目标的稳定签名，用于判断热更新是否可以只重排、不重建。
 * 元素 / 函数 / 无法稳定描述的目标返回 null，强制走完整刷新。
 */
function highlightSignature(highlight: HelperHighlight | undefined): string | null {
	const styleKey = ":" + props.state.style.highlightPadding + ":" + props.state.style.highlightRadius;
	if (!highlight) return "none" + styleKey;
	if (typeof highlight === "string") return "selector:" + highlight + styleKey;
	if (typeof highlight === "function" || isElement(highlight)) return null;
	if (isDomRect(highlight) || isRectLike(highlight)) return "rect:" + JSON.stringify(normalizeRect(highlight)) + styleKey;
	if (typeof highlight === "object") {
		const record = highlight as Record<string, unknown>;
		if (typeof record.selector === "string") {
			return "selector:" + record.selector + ":" + String(record.padding ?? "") + ":" + String(record.radius ?? "") + ":" + String(record.follow ?? "");
		}
		if (record.rect && (isDomRect(record.rect) || isRectLike(record.rect))) {
			return "rect:" + JSON.stringify(normalizeRect(record.rect as HelperRectLike | DOMRect)) + ":" + String(record.padding ?? "") + ":" + String(record.radius ?? "") + ":" + String(record.follow ?? "");
		}
	}
	return null;
}

function checkTargetHitTestable(): void {
	const target = targetEl.value;
	const rect = highlightRect.value;
	if (!target || !rect) {
		targetHitTestable.value = true;
		return;
	}
	if (!target.isConnected) {
		targetHitTestable.value = false;
		return;
	}
	const x = Math.min(Math.max(0, rect.x + rect.width / 2), Math.max(0, window.innerWidth - 1));
	const y = Math.min(Math.max(0, rect.y + rect.height / 2), Math.max(0, window.innerHeight - 1));
	const stack =
		typeof document.elementsFromPoint === "function"
			? document.elementsFromPoint(x, y)
			: ([document.elementFromPoint(x, y)].filter(Boolean) as Element[]);
	const outside = stack.find(element => !rootEl.value?.contains(element));
	targetHitTestable.value = !!outside && (outside === target || target.contains(outside));
}

let advanceTimer: number | null = null;
let nudgeTimer: number | null = null;
let relayoutRaf = 0;
let relayoutRunning = false;
let generation = 0;
let abortController: AbortController | null = null;
let targetObserver: ResizeObserver | null = null;
let guideObserver: ResizeObserver | null = null;
let disconnectedWarned = false;
let lastRenderedIndex = -1;
let lastRenderedHighlight: string | null = null;

function scheduleAdvance(): void {
	if (advanceTimer !== null) return;
	// 延后一拍：让高亮目标自己的点击逻辑先执行（例如打开下一步要用的面板），
	// 再推进任务链；目标后续仍由 waitFor 兜底。
	advanceTimer = window.setTimeout(() => {
		advanceTimer = null;
		if (props.state.visible && ready.value) props.advance();
	}, 0);
}

function nudge(): void {
	const guide = guideEl.value;
	if (!guide) return;
	guide.classList.remove("wwh-nudge");
	// 强制 reflow，让同一个 class 能重新播放动画
	void guide.offsetWidth;
	guide.classList.add("wwh-nudge");
	if (nudgeTimer !== null) window.clearTimeout(nudgeTimer);
	nudgeTimer = window.setTimeout(() => {
		nudgeTimer = null;
		guide.classList.remove("wwh-nudge");
	}, 380);
}

function handleMaskClick(event: MouseEvent): void {
	event.stopPropagation();
	if (!ready.value) return;
	if (effectiveAdvanceOn.value === "highlight") {
		nudge();
		return;
	}
	scheduleAdvance();
}

function handleGuideClick(event: MouseEvent): void {
	event.stopPropagation();
	if (!ready.value) return;
	if (effectiveAdvanceOn.value === "highlight") {
		nudge();
		return;
	}
	scheduleAdvance();
}

function handleCatcherClick(event: MouseEvent): void {
	event.stopPropagation();
	if (!ready.value) return;
	scheduleAdvance();
}

function handleDocumentClick(event: MouseEvent): void {
	if (!props.state.visible || !ready.value) return;
	const node = event.target as Node | null;
	if (node && rootEl.value?.contains(node)) return;
	if (node instanceof Element && node.closest("[data-wwh-ignore]")) return;
	if (effectiveAdvanceOn.value === "highlight") {
		// 有真实元素时严格要求点中元素本身；任意矩形高亮才按矩形判定
		const target = targetEl.value;
		if (target) {
			if (!(node instanceof Node) || !target.contains(node)) return;
		} else {
			const rect = highlightRect.value;
			if (!rect || !pointInRect(event.clientX, event.clientY, rect)) return;
		}
	}
	scheduleAdvance();
}

function handleKeydown(event: KeyboardEvent): void {
	if (event.key !== "Escape" || !props.state.escapable) return;
	event.preventDefault();
	event.stopPropagation();
	props.abort("escape");
}

function attachRuntime(): void {
	// window 捕获：游戏自身 stopPropagation 也不影响推进判定；帮助层内部由 rootEl 过滤
	window.addEventListener("click", handleDocumentClick, true);
	document.addEventListener("keydown", handleKeydown, true);
	window.addEventListener("resize", scheduleRelayout);
	if (activeFollow.value) window.addEventListener("scroll", scheduleRelayout, true);

	const target = targetEl.value;
	if (target && typeof ResizeObserver !== "undefined") {
		targetObserver = new ResizeObserver(scheduleRelayout);
		targetObserver.observe(target);
	}

	const guide = guideEl.value;
	if (guide && typeof ResizeObserver !== "undefined") {
		guideObserver = new ResizeObserver(scheduleRelayout);
		guideObserver.observe(guide);
	}
}

function detachRuntime(): void {
	window.removeEventListener("click", handleDocumentClick, true);
	document.removeEventListener("keydown", handleKeydown, true);
	window.removeEventListener("resize", scheduleRelayout);
	window.removeEventListener("scroll", scheduleRelayout, true);
	targetObserver?.disconnect();
	targetObserver = null;
	guideObserver?.disconnect();
	guideObserver = null;
	if (relayoutRaf) window.cancelAnimationFrame(relayoutRaf);
	relayoutRaf = 0;
	if (advanceTimer !== null) window.clearTimeout(advanceTimer);
	advanceTimer = null;
	if (nudgeTimer !== null) window.clearTimeout(nudgeTimer);
	nudgeTimer = null;
}

function measure(): boolean {
	const guide = guideEl.value;
	if (!guide) return false;
	guideSize.value = { width: guide.offsetWidth, height: guide.offsetHeight };
	const dialog = dialogEl.value;
	dialogSize.value = dialog ? { width: dialog.offsetWidth, height: dialog.offsetHeight } : { ...guideSize.value };
	return guideSize.value.width > 0 && guideSize.value.height > 0;
}

function place(): boolean {
	const current = props.state.step;
	if (!current || !guideEl.value) return false;
	const computedPosition = computeGuidePosition({
		position: current.position,
		rect: highlightRect.value,
		viewport: viewport.value,
		guide: guideSize.value,
		dialog: dialogSize.value,
		style: props.state.style,
		step: current,
		index: props.state.index,
		total: props.state.total,
	});
	guidePosition.value = { x: computedPosition.x, y: computedPosition.y };
	return true;
}

function buildPayload(): HelperReadyPayload | null {
	const current = props.state.step;
	if (!current || !guidePosition.value) return null;
	return {
		step: current,
		index: props.state.index,
		total: props.state.total,
		rect: highlightRect.value ? { ...highlightRect.value } : null,
		position: { ...guidePosition.value },
		guide: { ...guideSize.value },
		dialog: { ...dialogSize.value },
	};
}

function notify(kind: "ready" | "layout"): void {
	const payload = buildPayload();
	if (!payload) return;
	if (kind === "ready") props.notifyReady(payload);
	else props.notifyLayout(payload);
}

function scheduleRelayout(): void {
	if (relayoutRaf) return;
	relayoutRaf = window.requestAnimationFrame(() => {
		relayoutRaf = 0;
		void relayout();
	});
}

async function relayout(): Promise<void> {
	if (relayoutRunning || !props.state.visible || !ready.value || !props.state.step) return;
	const currentGeneration = generation;
	relayoutRunning = true;
	try {
		const current = props.state.step;
		if (current) {
			effectiveAdvanceOn.value = current.advanceOn === "highlight" && (targetEl.value || highlightRect.value) ? "highlight" : "any";
		}
		viewport.value = getViewportSize();

		const target = targetEl.value;
		if (target && activeFollow.value) {
			if (target.isConnected) {
				const nextRect = inflateRect(elementToRect(target), activePadding.value);
				if (!rectsEqual(nextRect, highlightRect.value)) highlightRect.value = nextRect;
			} else if (!disconnectedWarned) {
				disconnectedWarned = true;
				console.warn("[WhichWayHelper] 高亮目标已从文档中移除，保留最后一次位置");
			}
		}

		await nextTick();
		if (currentGeneration !== generation || !props.state.visible || !ready.value) return;
		checkTargetHitTestable();
		if (!measure()) return;
		place();
		await nextTick();
		if (currentGeneration !== generation) return;
		notify("layout");
	} finally {
		relayoutRunning = false;
	}
}

async function refresh(): Promise<void> {
	const currentGeneration = ++generation;
	detachRuntime();
	abortController?.abort();
	abortController = null;
	ready.value = false;
	guidePosition.value = null;
	highlightRect.value = null;
	targetEl.value = null;
	effectiveAdvanceOn.value = "any";
	activePadding.value = props.state.style.highlightPadding;
	activeRadius.value = props.state.style.highlightRadius;
	activeFollow.value = true;
	targetHitTestable.value = true;
	disconnectedWarned = false;
	viewport.value = getViewportSize();

	const current = props.state.step;
	if (!props.state.visible || !current) {
		lastRenderedIndex = -1;
		lastRenderedHighlight = null;
		return;
	}
	lastRenderedIndex = props.state.index;
	lastRenderedHighlight = highlightSignature(current.highlight);

	abortController = new AbortController();
	await nextFrame();
	if (currentGeneration !== generation) return;

	let resolved: Awaited<ReturnType<typeof resolveHighlight>> = null;
	if (current.highlight) {
		try {
			resolved = await resolveHighlight(current.highlight, {
				waitFor: current.waitFor ?? 0,
				signal: abortController.signal,
				defaultPadding: props.state.style.highlightPadding,
				defaultRadius: props.state.style.highlightRadius,
			});
		} catch (error) {
			console.warn("[WhichWayHelper] 解析高亮目标失败", error);
			resolved = null;
		}
	}
	if (currentGeneration !== generation) return;

	if (current.highlight && !resolved) {
		console.warn("[WhichWayHelper] 第 " + (props.state.index + 1) + " 步高亮目标未找到，本步降级为全屏遮罩");
		effectiveAdvanceOn.value = "any";
	} else {
		effectiveAdvanceOn.value = current.advanceOn === "highlight" ? "highlight" : "any";
	}
	highlightRect.value = resolved?.rect ?? null;
	targetEl.value = resolved?.element ?? null;
	activePadding.value = resolved?.padding ?? props.state.style.highlightPadding;
	activeRadius.value = resolved?.radius ?? props.state.style.highlightRadius;
	activeFollow.value = resolved?.follow ?? true;

	await nextTick();
	if (currentGeneration !== generation) return;
	checkTargetHitTestable();
	if (!guideEl.value) {
		await nextFrame();
		if (currentGeneration !== generation) return;
	}
	if (!guideEl.value) return;
	if (!measure()) {
		await nextFrame();
		if (currentGeneration !== generation) return;
		if (!measure()) return;
	}
	place();
	await nextTick();
	if (currentGeneration !== generation) return;
	ready.value = true;
	attachRuntime();
	notify("ready");
}

watch(
	() => [props.state.visible, props.state.step, props.state.index, props.state.total, props.state.style, props.state.escapable],
	() => {
		const current = props.state.step;
		if (props.state.visible && ready.value && current) {
			const signature = highlightSignature(current.highlight);
			// 高亮还没解析出来时不要走增量路径：可能在等元素挂载，完整刷新会重新等
			if (signature !== null && signature === lastRenderedHighlight && props.state.index === lastRenderedIndex && (!current.highlight || highlightRect.value)) {
				void relayout();
				return;
			}
		}
		void refresh();
	},
	{ deep: true, immediate: true },
);

onBeforeUnmount(() => {
	generation++;
	abortController?.abort();
	abortController = null;
	detachRuntime();
});
</script>

<template>
	<div
		v-if="state.visible && state.step"
		ref="rootEl"
		class="wwh-root"
		:class="{ 'wwh-no-animation': !state.style.animation, 'wwh-highlight-only': effectiveAdvanceOn === 'highlight' }"
		:style="rootStyle"
		role="dialog"
		aria-modal="true"
		:aria-label="state.step.title || '新手帮助'"
	>
		<template v-if="hasSpotlight">
			<div class="wwh-mask wwh-mask-top" :style="panelStyle('top')" @click="handleMaskClick"></div>
			<div class="wwh-mask wwh-mask-bottom" :style="panelStyle('bottom')" @click="handleMaskClick"></div>
			<div class="wwh-mask wwh-mask-left" :style="panelStyle('left')" @click="handleMaskClick"></div>
			<div class="wwh-mask wwh-mask-right" :style="panelStyle('right')" @click="handleMaskClick"></div>
			<div class="wwh-spot" :style="spotStyle" aria-hidden="true"></div>
			<div v-if="showCatcher" class="wwh-catcher" :style="catcherStyle" aria-hidden="true" @click="handleCatcherClick"></div>
		</template>
		<div v-else class="wwh-mask wwh-mask-full" :style="panelStyle('full')" @click="handleMaskClick"></div>

		<div
			:key="stepKey"
			ref="guideEl"
			class="wwh-guide"
			:class="{ 'is-ready': ready }"
			:style="guideStyle"
			@click="handleGuideClick"
		>
			<div class="wwh-portrait">
				<img class="wwh-portrait-img" :src="portraitUrl" :alt="portrait.alt" :style="{ objectFit: portrait.fit }" draggable="false" />
				<div class="wwh-portrait-vignette" aria-hidden="true"></div>
				<div class="wwh-portrait-frame" aria-hidden="true"></div>
			</div>

			<div ref="dialogEl" class="wwh-dialog" :class="{ 'wwh-dialog-clickable': effectiveAdvanceOn === 'any' }">
				<div class="wwh-dialog-texture" aria-hidden="true"></div>
				<div class="wwh-dialog-content">
					<div v-if="state.step.title" class="wwh-title">{{ state.step.title }}</div>
					<div class="wwh-text" aria-live="polite">{{ state.step.text }}</div>
					<div v-if="showFooter" class="wwh-footer">
						<span v-if="showProgress" class="wwh-progress">{{ stepNumber }}<span class="wwh-progress-divider">/</span>{{ totalNumber }}</span>
						<span v-if="state.preview" class="wwh-preview-badge">预览</span>
						<span v-if="showHint" class="wwh-hint">{{ hintText }}<span class="wwh-chevron">›</span></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* --wwh-portrait-real：默认 176px 的肖像在窄屏会被夹到 28vw / 42vh 以内 */
.wwh-root {
	--wwh-portrait-real: clamp(96px, var(--wwh-portrait-size, 176px), min(28vw, 42vh));
	position: fixed;
	inset: 0;
	z-index: var(--wwh-z-index, 2147483000);
	display: block;
	width: 100vw;
	height: 100vh;
	overflow: visible;
	pointer-events: none;
	font-family: "dy_sjzx", "SJZX_youyuan", "Microsoft YaHei", "STHeiti", sans-serif;
	color: #f4f4f4;
	-webkit-font-smoothing: antialiased;
	-webkit-tap-highlight-color: transparent;
	user-select: none;
}

.wwh-root * {
	box-sizing: border-box;
}

.wwh-mask {
	position: fixed;
	display: block;
	margin: 0;
	padding: 0;
	pointer-events: auto;
	cursor: pointer;
	transition: opacity 0.18s ease;
}

.wwh-mask-full {
	inset: 0;
}

.wwh-root.wwh-highlight-only .wwh-mask {
	cursor: default;
}

.wwh-spot {
	position: fixed;
	display: block;
	pointer-events: none;
	z-index: 3;
	border: var(--wwh-highlight-width, 2px) solid var(--wwh-highlight-color, #c94b4b);
	box-shadow:
		0 0 0 1px rgba(0, 0, 0, 0.55),
		0 0 18px var(--wwh-highlight-color, #c94b4b);
	animation: wwh-pulse 2.6s ease-in-out infinite;
}

.wwh-catcher {
	position: fixed;
	display: block;
	pointer-events: auto;
	cursor: pointer;
	z-index: 1;
	background: transparent;
}

.wwh-guide {
	position: fixed;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	z-index: 4;
	pointer-events: auto;
	opacity: 0;
	transform: translateY(12px) scale(0.985);
	transition:
		opacity 0.22s ease,
		transform 0.22s ease;
	will-change: left, top;
}

.wwh-guide.is-ready {
	opacity: 1;
	transform: none;
}

.wwh-guide.wwh-nudge {
	animation: wwh-nudge 0.34s ease;
}

.wwh-root.wwh-no-animation .wwh-guide,
.wwh-root.wwh-no-animation .wwh-spot,
.wwh-root.wwh-no-animation .wwh-hint,
.wwh-root.wwh-no-animation .wwh-chevron {
	transition: none;
	animation: none;
}

.wwh-portrait {
	position: relative;
	display: block;
	flex: 0 0 auto;
	width: var(--wwh-portrait-real);
	height: var(--wwh-portrait-real);
	margin: 0 -2px 0 0;
	padding: 5px;
	overflow: hidden;
	background-color: #08090c;
	background-image: var(--wwh-portrait-backing);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	border: 1px solid rgba(255, 255, 255, 0.16);
	box-shadow:
		inset 0 0 28px rgba(0, 0, 0, 0.85),
		0 12px 32px rgba(0, 0, 0, 0.5);
	z-index: 2;
}

.wwh-portrait-img {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
	object-fit: var(--wwh-portrait-fit, cover);
	object-position: center 22%;
	filter: saturate(0.96) contrast(1.03);
	user-select: none;
	pointer-events: none;
}

.wwh-portrait-vignette {
	position: absolute;
	inset: 0;
	display: block;
	background:
		linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.02) 45%, rgba(0, 0, 0, 0.42) 100%),
		radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.28) 100%);
	pointer-events: none;
	z-index: 2;
}

.wwh-portrait-frame {
	position: absolute;
	inset: 0;
	display: block;
	border: 9px solid transparent;
	border-image: var(--wwh-frame) 34 / 9px stretch;
	pointer-events: none;
	z-index: 3;
}

.wwh-dialog {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex: 0 1 auto;
	width: fit-content;
	min-width: min(var(--wwh-dialog-min-width, 320px), calc(100vw - var(--wwh-portrait-real) - 24px));
	max-width: min(var(--wwh-dialog-max-width, 760px), calc(100vw - var(--wwh-portrait-real) - 24px));
	min-height: var(--wwh-dialog-min-height, 136px);
	margin-top: 14px;
	padding: clamp(18px, 2.6vh, 34px) clamp(24px, 2.8vw, 46px) clamp(12px, 1.9vh, 22px);
	overflow: hidden;
	background-color: rgba(13, 14, 17, 0.93);
	border: 1px solid var(--wwh-dialog-border, #b54242);
	border-radius: 3px;
	box-shadow:
		0 0 0 1px rgba(0, 0, 0, 0.55),
		0 20px 50px rgba(0, 0, 0, 0.55),
		inset 0 0 70px rgba(0, 0, 0, 0.38);
	color: #f4f4f4;
	z-index: 1;
	transition: min-width 0.18s ease, max-width 0.18s ease;
}

.wwh-dialog-clickable {
	cursor: pointer;
}

.wwh-dialog-texture {
	position: absolute;
	inset: 0;
	display: block;
	background-image: var(--wwh-texture);
	background-repeat: repeat;
	background-size: 180px 180px;
	opacity: 0.16;
	mix-blend-mode: overlay;
	pointer-events: none;
	z-index: 0;
}

.wwh-dialog-content {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 8px;
	z-index: 1;
	transition: none;
}

.wwh-title {
	position: relative;
	display: block;
	margin: 0;
	transition: none;
	color: var(--wwh-highlight-color, #c94b4b);
	font-size: clamp(11px, 1.3vh, 15px);
	line-height: 1.2;
	letter-spacing: 0.18em;
	opacity: 0.95;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.wwh-text {
	position: relative;
	display: block;
	width: max-content;
	max-width: 100%;
	margin: 0;
	transition: none;
	color: #f4f4f4;
	font-size: var(--wwh-font-size, clamp(18px, 2.4vh, 30px));
	line-height: var(--wwh-line-height, 1.65);
	font-weight: 400;
	letter-spacing: 0.035em;
	text-align: left;
	white-space: pre-wrap;
	word-break: break-word;
	overflow-wrap: anywhere;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.82);
}

.wwh-footer {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 16px;
	transition: none;
	min-height: 16px;
	margin-top: 2px;
	color: rgba(255, 255, 255, 0.42);
	font-size: clamp(10px, 1.15vh, 13px);
	letter-spacing: 0.08em;
	white-space: nowrap;
}

.wwh-progress {
	display: inline-flex;
	align-items: baseline;
	margin-right: auto;
	color: rgba(255, 255, 255, 0.52);
	font-variant-numeric: tabular-nums;
}

.wwh-progress-divider {
	margin: 0 4px;
	opacity: 0.5;
}

.wwh-preview-badge {
	display: inline-flex;
	align-items: center;
	padding: 1px 6px;
	border: 1px solid rgba(255, 255, 255, 0.16);
	border-radius: 2px;
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.9em;
	letter-spacing: 0.12em;
}

.wwh-hint {
	display: inline-flex;
	align-items: center;
	color: rgba(255, 255, 255, 0.4);
	transition: color 0.18s ease;
}

.wwh-dialog-clickable .wwh-hint,
.wwh-root.wwh-highlight-only .wwh-hint {
	color: rgba(255, 255, 255, 0.46);
}

.wwh-chevron {
	display: inline-block;
	margin-left: 5px;
	color: var(--wwh-highlight-color, #c94b4b);
	font-size: 1.35em;
	line-height: 0.7;
	animation: wwh-chevron 1.5s ease-in-out infinite;
}

@keyframes wwh-pulse {
	0%,
	100% {
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.55),
			0 0 14px var(--wwh-highlight-color, #c94b4b);
	}
	50% {
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.55),
			0 0 26px var(--wwh-highlight-color, #c94b4b);
	}
}

@keyframes wwh-chevron {
	0%,
	100% {
		transform: translateX(0);
		opacity: 0.6;
	}
	50% {
		transform: translateX(4px);
		opacity: 1;
	}
}

@keyframes wwh-nudge {
	0%,
	100% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(-5px);
	}
	50% {
		transform: translateX(5px);
	}
	75% {
		transform: translateX(-3px);
	}
}

@media (max-width: 720px) {
	.wwh-dialog {
		margin-top: 8px;
		padding: 18px 20px 12px;
	}
	.wwh-footer {
		gap: 10px;
	}
}
</style>
