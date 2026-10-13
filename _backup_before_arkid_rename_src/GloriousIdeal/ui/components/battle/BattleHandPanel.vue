<script setup lang="ts">
/**
 * battle/BattleHandPanel.vue —— 战斗内「展开的完整手牌」浮层（自建 UI，不走引擎 dialog）
 *
 * 不用 `ui.create.dialog` 的原因：本体 dialog 有对话框栈与固定 top/left，多扇窗会与引擎自己的对话框互相覆盖。
 * 布局：外层由 battleOverlay.ts 建的宿主容器 **flex 居中**（不再贴武将卡算坐标，也就没有贴边翻转问题），
 * 面板本身 `position:relative`、高度随牌数自撑（上限 max-height，超出交给卡片区滚轮）；位置移动靠拖动写的 transform。
 * z-index 在宿主容器上——引擎全局 `div{position:absolute}` 会另起层叠上下文，写在面板自己身上不生效。
 * 真实卡牌由 battleOverlay.ts 命令式填进 onMounted 交出去的卡片区；关闭只认「关闭」按钮。
 */
import { onMounted, ref } from "vue";
import type { HandPanelState } from "./battleOverlayTypes.js";

defineProps<{ panel: HandPanelState }>();
const emit = defineEmits<{ (e: "close"): void; (e: "ready", box: HTMLElement, root: HTMLElement): void }>();

const cardsBox = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);
onMounted(() => {
	if (cardsBox.value && root.value) emit("ready", cardsBox.value, root.value);
});
</script>

<template>
  <div ref="root" class="gi-bhp">
    <div class="gi-bhp-bar">
      <span class="gi-bhp-title">{{ panel.title }}</span>
      <button class="gi-bhp-close" @click="emit('close')">关闭</button>
    </div>
    <div ref="cardsBox" class="gi-bhp-cards buttons" @wheel.stop></div>
    <p v-if="panel.count === 0" class="gi-bhp-empty">没有手牌。</p>
  </div>
</template>

<style scoped>
.gi-bhp {
  position: relative;
  /* 引擎全局 div 带 `transition:all .5s`：不关掉的话拖动会整块滑着跟 */
  transition: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* 宽容纳两张本体卡牌（104 + 左右 4 margin = 112×2），高度随牌数自撑 → 天然竖版 */
  width: 240px;
  max-height: 78vh;
  padding: 6px;
  border: 1px solid rgba(224, 179, 87, 0.6);
  border-radius: 14px;
  background: rgba(18, 21, 31, 0.96);
  color: #ece6b8;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  text-align: center;
  /* 宿主容器铺满视口且不吃点击（免得挡住对局），面板自己恢复响应 */
  pointer-events: auto;
  cursor: default;
}
/* 引擎全局 `div{display:inline-block;position:absolute;transition:all .5s}`：
   只复位自己这两块结构 div。**不能写成 .gi-bhp div**——那会连本体卡牌 .card 的 position:relative 一起打掉。 */
.gi-bhp-bar,
.gi-bhp-cards {
  position: static;
  transition: none;
}
/* 拖动只能从标题栏起手（interactjs allowFrom），整块面板留着给点牌/滚轮 */
.gi-bhp-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: none;
  cursor: move;
  touch-action: none;
}
.gi-bhp-title {
  font-size: 14px;
  font-weight: 700;
}
.gi-bhp-close {
  flex: none;
  padding: 2px 10px;
  border: 1px solid rgba(224, 179, 87, 0.5);
  border-radius: 8px;
  background: transparent;
  color: #ece6b8;
  font-size: 13px;
  cursor: pointer;
}
.gi-bhp-close:hover {
  background: rgba(224, 179, 87, 0.18);
}
/* 牌多时纵向溢出交给滚轮；滚动条按卡背面板的极简风格隐掉 */
.gi-bhp-cards {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}
.gi-bhp-cards::-webkit-scrollbar {
  display: none;
}
.gi-bhp-empty {
  margin: 4px 0;
  font-size: 12.5px;
  opacity: 0.6;
}
</style>
