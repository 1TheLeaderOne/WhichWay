<template>
	<div class="promptSJZX-Wrapper">
		<div
			v-for="prompt in prompts"
			:key="prompt.id"
			class="promptSJZX"
			:class="prompt.type === 'character' ? 'promptCharacterSJZX' : 'promptCardSJZX'"
			v-html="prompt.text"
		></div>
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
 * 调用方不要手写 DOM：用 `whichWayTips.addPrompt()` / `card.addPromptSJZX()`
 * 或 `src/tips/prompt.js` 的 `addPromptTo()`（都基于本组件）。
 */
defineProps({
	/**
	 * 提示列表：同一宿主元素上的多条提示会在容器里依次排列
	 * @type {Array<{ id: string, text: string, type: "card" | "character" }>}
	 */
	prompts: { type: Array, default: () => [] },
});
</script>

<style scoped>
/*
 * 数值与 !important 与改造前的 css/extension.css 保持一致（只删掉了重复声明的 width），
 * 避免"修样式"变成"改外观"。
 */
.promptSJZX-Wrapper {
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 114514 !important;
}

.promptSJZX-Wrapper .promptSJZX {
	width: 85% !important;
	height: 12%;
	left: 7.5%;
	top: 60%;
	margin-top: 2%;
	position: relative;
	font-family: charname;
	font-size: 15px;
	white-space: nowrap;
	text-align: center;
	bottom: 5%;
	z-index: 92 !important;
	pointer-events: none;
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
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
