<script setup lang="ts">
import { computed } from "vue";
import { DEFAULT_PORTRAIT_SCALE } from "./portraitPos.js";
import { whichWayFile } from "../file.js";

/**
 * 立绘的两层背景：外层铺扩展自己的默认背板并裁掉溢出，内层只贴立绘。
 *
 * 存在的理由是引擎的 `setBackground(name, "character")` 贴的是 `url(立绘),url(本体保底图)` 两层
 * （`init/polyfill.ts` 的 `setBackgroundImage([src, lib.characterDefaultPicturePath + sex])`），
 * 明日方舟立绘的透明区域透出来的就是本体那张默认武将图。拆成两层子元素之后就能只留立绘、
 * 背板换成 `ui:background/default.png`。
 *
 * 既由 `avatarBackground.ts` 用 `render()` 挂进引擎创建的头像 / 武将卡节点，也可以当普通组件直接用。
 */
const props = withDefaults(
	defineProps<{
		/** 内层的 `background-image`，形如 `url("…")`；留空则只画背板 */
		image?: string;
		/** 水平偏移，单位「框宽的比例」，可为负 */
		offsetX?: number;
		/** 垂直偏移，单位「框高的比例」，可为负 */
		offsetY?: number;
		/** 缩放倍率（绝对值） */
		scale?: number;
	}>(),
	{
		image: "",
		offsetX: 0,
		offsetY: 0,
		scale: DEFAULT_PORTRAIT_SCALE,
	}
);

//背板路径要读 lib.assetURL，取值推迟到渲染时
const backdrop = computed(() => `url("${whichWayFile.compilePath("ui:background/default.png")}")`);

/**
 * 内层的位移与缩放。
 *
 * `translate` 的百分比按元素自身尺寸换算，而元素就是 `inset: 0` 的框（等于宿主节点尺寸），
 * 所以存进 `pos.json` 的比例值可以直接在这里线性还原，与分辨率、与无名杀的 `ui_zoom` 都无关。
 * 写在行内而不是样式表里：缩放要能被皮肤拖拽实时改掉，硬编码在 `<style>` 就覆盖不掉了。
 */
const imageStyle = computed(() => ({
	backgroundImage: props.image,
	transform: `translate(${props.offsetX * 100}%, ${props.offsetY * 100}%) scale(${props.scale})`,
}));
</script>

<template>
	<div class="sjzxPortraitWrapper" :style="{ backgroundImage: backdrop }">
		<div class="sjzxPortraitImage" :style="imageStyle" />
	</div>
</template>

<style scoped>
.sjzxPortraitWrapper {
	position: absolute;
	inset: 0;
	overflow: hidden;
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
	inset: 0;
	background-size: cover;
	/* 引擎给立绘用的就是 cover + 水平居中（纵向 0%，头朝上），这里与它对齐 */
	background-position: center top;
	/* 偏移与缩放走行内 style（见 imageStyle），硬编码在 <style> 就覆盖不掉 */
}
</style>
