<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { DEFAULT_PORTRAIT_SCALE, clampOffset, getCover } from "./portraitPos.js";
import { whichWayFile } from "../file.js";
import { whichWayUtil } from "../utill.js";

/**
 * 立绘的两层背景：外层铺扩展自己的默认背板并裁掉溢出，内层是一张**装着完整原图**的画布。
 *
 * 存在的理由是引擎的 `setBackground(name, "character")` 贴的是 `url(立绘),url(本体保底图)` 两层
 * （`init/polyfill.ts` 的 `setBackgroundImage([src, lib.characterDefaultPicturePath + sex])`），
 * 明日方舟立绘的透明区域透出来的就是本体那张默认武将图。拆成两层子元素之后就能只留立绘、
 * 背板换成 `ui:background/default.png`。
 *
 * 内层为什么不能是「框那么大的一张 background」：`background-size: cover` 是**按框的宽高比**裁图的，
 * 一张 2000×1200 的皮肤放进 114×174 的武将卡，cover 的贴合系数取 `max(114/2000, 174/1200)`，
 * 于是只有中间竖条被画出来，左右约六成内容**从来没被绘制过**。旧写法在此基础上再加 `transform`，
 * 挪的、放大的都只是那条竖条 ⇒ 偏移一大就像被截断。现在内层是一张 `<img>`：宽高比取**原图**的，
 * 尺寸取「`scale` 倍框」的 cover 贴合结果（`getCover`），整张原图都在里面，框只是开在它上面的一扇窗，
 * 拖到边界显示的就是原图自己的边缘。
 *
 * 既由 `avatarBackground.ts` 用 `render()` 挂进引擎创建的头像 / 武将卡节点，也可以当普通组件直接用。
 */
const props = withDefaults(
	defineProps<{
		/** 内层立绘的 `background-image`，形如 `url("…")`；留空则只画背板 */
		image?: string;
		/** 水平偏移，单位「框宽的比例」，可为负 */
		offsetX?: number;
		/** 垂直偏移，单位「框高的比例」，可为负 */
		offsetY?: number;
		/** 缩放倍率（绝对值）：画布是「`scale` 倍框」的 cover 贴合矩形 */
		scale?: number;
	}>(),
	{
		image: "",
		offsetX: 0,
		offsetY: 0,
		scale: DEFAULT_PORTRAIT_SCALE,
	}
);

/**
 * 「立绘/皮肤直接用cover铺满」：开启时忽略 pos.json 的偏移与缩放。
 *
 * 写成函数而不是 `computed`：`whichWayUtil.config` 读的是 `lib.config`，不是响应式数据，
 * 无依赖的 `computed` 只算一次就永久缓存，而组件实例在换肤时是被 `render()` patch 复用的，
 * 那样改完设置永远读不到新值。在样式里现取，就跟着每次重绘（换肤 / `$reinit` / 拖拽刷新）重新读一次。
 */
function coverOnly() {
	return whichWayUtil.config("portraitUseCover") === true;
}

/**
 * 从 `url("…")` 里取出裸路径给 `<img src>`。
 *
 * 绘制入口统一传的是 `background-image` 形态（`avatarBackground.ts` 的 `firstLayer`），
 * 这里得拆出路径。`url(undefined)` / `none` / 空串一律当「没有图」：留着它们 img 会去请求一个
 * 必然 404 的地址，然后在卡面中间画出一枚碎图图标。
 */
const imgSrc = computed(() => {
	const matched = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)$/.exec(props.image.trim());
	const src = (matched?.[1] ?? matched?.[2] ?? matched?.[3] ?? "").trim();
	if (!src || src === "none" || src === "undefined") return "";
	return src;
});

const wrapperEl = ref<HTMLDivElement>();
const imgEl = ref<HTMLImageElement>();
/** 这张图加载失败过：失败就别留 `<img>` 在这儿，否则会卡正中间显示一枚碎图图标 */
const imgBroken = ref(false);

/**
 * 背板：`ui:background/default.png`。
 *
 * 它**不是**灰色遮罩的来源 —— 之前那块灰是引擎的 `default_silhouette_*.jpg`
 * 被 `setBackgroundImage([立绘, 保底图])` 原样写回节点造成的（两层叠在一起），
 * 与这张背板无关。背板是立绘透明处的**设计底色**，去掉会让卡面看起来「背景不见了」。
 */
const backdrop = computed(() => `url("${whichWayFile.compilePath("ui:background/default.png")}")`);

/** 原图宽高比（宽/高）；0 表示还不知道 */
const imgAspect = ref(0);
/** 框宽高比（宽/高）；0 表示还没量到 */
const frameAspect = ref(0);

/**
 * 量原图比例：`naturalWidth/Height` 直接读图片自身的解码尺寸，不碰布局（不像 `offsetWidth` 会强制重排）。
 */
function measureImage() {
	const img = imgEl.value;
	imgAspect.value = img && img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 0;
}

/** 量框比例：`clientWidth/Height` 是布局像素，与无名杀的 `ui_zoom`（body 上的 scale）无关，所以比值稳定 */
function measureFrame() {
	const el = wrapperEl.value;
	if (!el || el.clientWidth <= 0 || el.clientHeight <= 0) return;
	frameAspect.value = el.clientWidth / el.clientHeight;
}

/**
 * 画布尺寸 ÷ 框尺寸（两轴）。
 *
 * 图片尺寸或框尺寸还没量到时（首帧、图尚未加载完）退回 `{ scale, scale }` —— 也就是「框 × scale」，
 * 与改动前 `transform: scale` 的画面逐像素一致（此时 `object-fit: cover` 会替我们把原图按 cover 裁好，
 * 不会出现空白）。量到真实比例后画布只在**原图溢出的那一轴**变大，另一轴仍是 `scale` 倍框 ⇒ 只会看到更多内容。
 */
function coverOf(scale: number) {
	if (!(imgAspect.value > 0) || !(frameAspect.value > 0)) return { x: scale, y: scale };
	return getCover(imgAspect.value, frameAspect.value, scale);
}

/**
 * 内层画布的位置与大小。
 *
 * 四个值全是**相对框（外层）的百分比**：`pos.json` 里 `x/y` 的单位本来就是「偏移 ÷ 框尺寸」，
 * 所以这里线性还原即可，与分辨率、与 `ui_zoom` 都无关，也不需要 `transform`。
 * 让画布中心落在 `0.5 + x` 处：`left = 中心 − 半宽 = (50 + x·100 − cover·50)%`。
 * 越界值（老存档里 `x=0.79` 这类）由 `clampOffset` 停在原图边缘，绝不会露出背板。
 */
const imageStyle = computed(() => {
	const flat = coverOnly();
	const scale = flat ? 1 : props.scale;
	const cover = coverOf(scale);
	const pos = clampOffset({ x: flat ? 0 : props.offsetX, y: flat ? 0 : props.offsetY, scale }, cover);
	return {
		width: `${cover.x * 100}%`,
		height: `${cover.y * 100}%`,
		left: `${50 + pos.x * 100 - cover.x * 50}%`,
		top: `${50 + pos.y * 100 - cover.y * 50}%`,
	};
});

//换图就把上一次的比例清掉，否则会拿旧图的构图画新图（同一节点换肤时会闪现错位）
watch(imgSrc, async () => {
	imgAspect.value = 0;
	imgBroken.value = false;
	await nextTick();
	//缓存命中时 `load` 事件在监听器装上之前就已经过去了，这里主动补测一次
	measureImage();
	measureFrame();
});

/**
 * 框尺寸观察者。
 *
 * 立绘节点常常是「先画好再插进文档」（`avatarBackground.ts` 在 `$init` 途中就会 `setBackground`），
 * 那一刻 `clientWidth` 还是 0 ⇒ 框比例量不到，画布只能按兜底的「框 × scale」画，完整原图就白装了。
 * 观察者会在元素真正有尺寸的那一刻再量一次，把画布换算回原图比例。回调只写一个 ref、不改观察目标的尺寸，
 * 所以不会出现 ResizeObserver 的回环告警。
 */
let frameObserver: ResizeObserver | undefined;

onMounted(() => {
	measureFrame();
	//挂载即已 decode 完成的图（同一张皮肤第二次绘制）不会再来 load 事件
	measureImage();
	const el = wrapperEl.value;
	if (el && typeof ResizeObserver !== "undefined") {
		frameObserver = new ResizeObserver(() => measureFrame());
		frameObserver.observe(el);
	}
});

onBeforeUnmount(() => frameObserver?.disconnect());
</script>

<template>
	<div ref="wrapperEl" class="sjzxPortraitWrapper" :style="{ backgroundImage: backdrop }">
		<img
			v-if="imgSrc && !imgBroken"
			ref="imgEl"
			class="sjzxPortraitImage"
			:src="imgSrc"
			:style="imageStyle"
			draggable="false"
			alt=""
			@load="measureImage"
			@error="imgBroken = true"
		/>
	</div>
</template>

<style scoped>
.sjzxPortraitWrapper {
	position: absolute;
	inset: 0;
	overflow: hidden;
	/* 引擎全局有 `div { transition: all 0.5s }`（`layout/default/layout.css:31`），
	   不关掉的话拖拽时每改一次位置都要走 0.5s 缓动 —— 表现为拖动慢半拍、松手后图还在往回追。 */
	transition: none;
	/* 圆角跟着宿主节点走：主题样式表给 `.avatar`/`.button`/`.card` 写了 `border-radius: 8px`
	   （`theme/woodden/style.css`、`theme/simple/style.css`），玩家还能用「圆角大小」设置改成
	   4px/0/16px（`layout.css` 的 `#window[data-radius_size=…] .avatar`）。
	   本层是绝对定位的实心方块，不写这条就会把宿主那圈圆角盖成直角。
	   `border-radius` 本身不继承，但 `inherit` 关键字能显式取父元素的计算值，所以改设置、换主题都不用跟着改这里。 */
	border-radius: inherit;
	pointer-events: none;
	background-size: cover;
	background-position: center;
}

.sjzxPortraitImage {
	position: absolute;
	/* 尺寸与位置全走行内 style（见 imageStyle），硬编码在 <style> 就覆盖不掉 */
	/* 画布宽高比按原图算，正常情况下图片正好铺满、`cover` 不起裁切作用；
	   只有在量不到比例的那一帧兜底成「框 × scale」时它才生效，观感与引擎原生的 cover 一致。 */
	object-fit: cover;
	object-position: center top;
	transition: none;
	pointer-events: none;
	user-select: none;
	-webkit-user-drag: none;
}
</style>
