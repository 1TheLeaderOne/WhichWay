<template>
	<div ref="wrapper" class="promptSJZX-Wrapper" :style="ready ? null : { visibility: 'hidden' }">
		<div
			v-for="prompt in prompts"
			:key="prompt.id"
			class="promptSJZX"
			:class="prompt.type === 'character' ? 'promptCharacterSJZX' : 'promptCardSJZX'"
		>
			<span class="promptSJZX-Text" v-html="prompt.text"></span>
		</div>
	</div>
</template>

<script setup>
/**
 * 卡牌 / 角色身上的「提示条」容器（原 `css/extension.css` 里的 `.promptSJZX` 系列样式已挪到这里）。
 *
 * 为什么组件化：
 * - 提示挂在引擎元素（`.card` / `.player`）内部，全局 CSS 既要和引擎自身的卡片样式抢优先级，
 *   又依赖 `extension.css` 的加载顺序；scoped 样式会带上 `data-v-*` 属性，优先级天然更高、且随组件走；
 * - 之前 `xierdamrfz` 直接把 `.promptSJZX` 挂在卡上（没有 `.promptSJZX-Wrapper` 祖先），
 *   而选择器是 `.promptSJZX-Wrapper .promptSJZX` ⇒ 样式必然不生效。现在 wrapper 由组件自己渲染，
 *   调用方不可能漏掉。
 *
 * 渲染保证（卡牌与角色**共用本组件**，两边行为一致）：
 * 1. **多条提示分行**：wrapper 是纵向 flex 列，每条提示各占一行；旧实现给每条提示单独加相对偏移
 *    `top: 60%`，多条时位置互相打架（挤在一起）。整体下移 60% 的观感改由 wrapper 承担，
 *    单条时的位置与改造前一致。
 * 2. **文字自适应且居中**：条目是 `white-space: nowrap`，长文本不换行，由脚本从 15px 逐像素缩到
 *    装得下为止；文字与底色条之间用 flex 双向居中 —— 缩过字号之后仍然居中（旧实现是块级 + 顶部对齐，
 *    字号一小文字就贴在条子上边）。
 * 3. **不出现"先按大字号显示、再缩小"的可见动画**（添加提示是高频操作，闪烁很显眼）：
 *    - 首次适配完成前 wrapper 先 `visibility: hidden`（隐藏但**仍有布局**，能量宽），适配完再显示；
 *    - `.promptSJZX` 上 `transition: none !important`，避免外部样式（引擎 / 皮肤）把字号变化变成过渡动画；
 *    - 适配结果按「宽度 + 文本」缓存，`ResizeObserver` 在卡片布局期间重复触发时不会反复重排；
 *    - 自定义字体（`charname` / `dy_sjzx`）晚于首次布局加载完成时 `document.fonts.ready` 再算一次。
 *
 * 调用方不要手写 DOM：用 `whichWayTips.addPrompt()` / `card.addPromptSJZX()`
 * 或 `src/tips/prompt.js` 的 `addPromptTo()`（都基于本组件）。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
	/**
	 * 提示列表：同一宿主元素上的多条提示会在容器里依次排列（各占一行）
	 * @type {Array<{ id: string, text: string, type: "card" | "character" }>}
	 */
	prompts: { type: Array, default: () => [] },
});

/** 提示字号上限（与原样式一致）与下限（再小就看不清了，到下限就允许溢出） */
const MAX_FONT_SIZE = 15;
const MIN_FONT_SIZE = 8;

const wrapper = ref(null);
/** 首次适配完成后才显示（避免"先大后小"的闪烁） */
const ready = ref(false);

/**
 * 把一条提示的文字缩到不超出它自己的宽度。
 *
 * 文字不换行（`white-space: nowrap`），所以只能靠缩字号来适配：从 `MAX_FONT_SIZE` 逐像素往下试，
 * 直到文字宽度不再超出条目宽度（最多 `MAX - MIN` 次循环，约 7 次）。
 *
 * 量的是内层 `span` 的宽度而不是条目自己的 `scrollWidth`：条目是 flex 居中容器，
 * 内容溢出时 `scrollWidth` 不反映真实文字宽度（居中溢出会往两边跑），会漏判、算不出该缩多少。
 *
 * @param {HTMLElement | undefined} node 提示条元素
 */
function fitText(node) {
	const el = /** @type {HTMLElement & { _fitKey?: string }} */ (node);
	const text = el?.firstElementChild;
	const width = el?.clientWidth;
	//容器还没布局（宽 0）时跳过，等 ResizeObserver 的下一帧再算
	if (!text || !width) return false;
	//宽度与文本都没变就不重算：ResizeObserver 在卡片布局 / 动画期间会多次触发
	const key = `${width}|${text.textContent}`;
	if (el._fitKey === key) return true;
	el._fitKey = key;

	let size = MAX_FONT_SIZE;
	el.style.fontSize = `${size}px`;
	while (size > MIN_FONT_SIZE && text.scrollWidth > width) {
		size -= 1;
		el.style.fontSize = `${size}px`;
	}
	return true;
}

/**
 * 适配容器内所有提示条。
 *
 * 只有**真的量到宽度**之后才把 wrapper 显示出来：宿主还没布局完时（宽 0）显示出来就是没适配的大字号，
 * 下一帧 ResizeObserver 再缩一次 —— 那正是要避免的"先大后小"闪烁。
 */
function fitAll() {
	const el = wrapper.value;
	if (!el) return;
	let fitted = false;
	for (const node of Array.from(el.children)) fitted = fitText(node) || fitted;
	if (fitted || !el.children.length) ready.value = true;
}

/** @type {ResizeObserver | null} */
let observer = null;

onMounted(() => {
	fitAll();
	//wrapper 的宽高都是百分比（跟随宿主），尺寸一变就重新适配：手牌折叠、窗口缩放、换行布局都会触发
	if (typeof ResizeObserver === "function") {
		observer = new ResizeObserver(() => fitAll());
		observer.observe(wrapper.value);
	} else {
		window.addEventListener("resize", fitAll);
	}
	//自定义字体晚于首次布局加载完成时字宽会变，补算一次（全局字体加载完成只触发一次）
	document.fonts?.ready?.then(() => fitAll());
});

//提示内容变化后（等 DOM 更新完）重新适配
watch(
	() => props.prompts.map(prompt => prompt.text).join("\u0000"),
	() => nextTick(fitAll)
);

onBeforeUnmount(() => {
	observer?.disconnect();
	window.removeEventListener("resize", fitAll);
});
</script>

<style scoped>
/*
 * 布局：wrapper 是「整体下移 60% 的纵向列」，每条提示各占一行（width 85% 居中）。
 * 数值与 !important 尽量与改造前的 css/extension.css 保持一致，避免"修样式"变成"改外观"：
 * 原来的 `top: 60%` + `left: 7.5%`（写在每条提示上，多条时互相打架）
 * 换成「容器下移 60% + 条目在列里居中」，单条提示的观感不变。
 */
.promptSJZX-Wrapper {
	position: relative;
	top: 60%;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	pointer-events: none;
	z-index: 114514 !important;
}

.promptSJZX-Wrapper .promptSJZX {
	width: 85% !important;
	height: 12%;
	margin-bottom: 2%;
	/*
	 * 位置完全交给上面这个 flex 列决定：卡片 / 玩家元素对子元素可能有自己的定位规则
	 * （引擎的宽泛选择器、第三方皮肤等），这里用 !important 把定位钉成「相对定位 + 不偏移」，
	 * 避免多条提示被拉到同一个位置叠在一起。
	 */
	position: relative !important;
	top: auto !important;
	left: auto !important;
	flex: none;
	/*
	 * 文字**横竖都居中**：底色条固定 12% 高，字号由脚本按宽度缩小，
	 * 不居中的话字号越小文字越贴着条子上边。
	 */
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-family: charname;
	font-size: 15px;
	white-space: nowrap;
	z-index: 92 !important;
	pointer-events: none;
	/* 字号是"一次算好"的，绝不能让过渡把它变成一段可见的缩小动画 */
	transition: none !important;
}

.promptSJZX-Wrapper .promptSJZX-Text {
	display: block;
	flex: none;
	/* 量文字宽度用的内层元素：字体 / 字号 / 颜色都继承条目，不改观感 */
	font-family: inherit;
	font-size: inherit;
	color: inherit;
	white-space: nowrap;
}

.promptSJZX-Wrapper .promptCardSJZX {
	color: white !important;
	font-family: dy_sjzx !important;
	background-color: rgba(0, 0, 0, 0.6) !important;
}

.promptSJZX-Wrapper .promptCharacterSJZX {
	color: rgb(243, 28, 28) !important;
	font-family: dy_sjzx !important;
	background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>
