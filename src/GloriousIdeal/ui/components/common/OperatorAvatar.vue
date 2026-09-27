<script setup lang="ts">
/**
 * common/OperatorAvatar.vue —— 干员头像（真实立绘，失败回退首字）
 * 全 UI 通用：给出 id 即渲染 image/character/{id}.jpg，加载失败自动回退到名字首字渐变块。
 * 尺寸由外层用 width/height（或 --gi-av-size）控制；本组件只负责裁切与回退。
 */
import { ref, computed } from "vue";
import { opPortrait, opAvatar } from "./format.js";

const props = withDefaults(
	defineProps<{
		id: string;
		/** 形状：圆形（默认）或圆角方块 */
		shape?: "circle" | "rounded";
		/** 阵亡态：灰度 + 暗化 */
		dead?: boolean;
	}>(),
	{ shape: "circle", dead: false }
);

const failed = ref(false);
const url = computed(() => opPortrait(props.id));
const letter = computed(() => opAvatar(props.id));
</script>

<template>
  <span class="gi-av" :class="[shape === 'rounded' ? 'is-rounded' : 'is-circle', { dead }]">
    <img v-if="!failed" class="gi-av-img" :src="url" alt="" loading="lazy" @error="failed = true" />
    <span v-else class="gi-av-letter">{{ letter }}</span>
    <span class="gi-av-ring" aria-hidden="true" />
  </span>
</template>

<style scoped>
.gi-av {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--gi-av-size, 44px);
  height: var(--gi-av-size, 44px);
  flex-shrink: 0;
  overflow: hidden;
  background: radial-gradient(circle at 50% 28%, var(--gi-panel2), var(--gi-bg1));
  color: var(--gi-gold);
  font-weight: 700;
  font-size: calc(var(--gi-av-size, 44px) * 0.42);
  line-height: 1;
}
.gi-av.is-circle {
  border-radius: 50%;
}
.gi-av.is-rounded {
  border-radius: 22%;
}
.gi-av-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}
.gi-av-letter {
  position: relative;
  z-index: 1;
}
/* 内描边：不占布局，避免与外层 border 叠加错位 */
.gi-av-ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--gi-line2);
  box-shadow: inset 0 -14px 22px -12px rgba(0, 0, 0, 0.65);
  pointer-events: none;
}
.gi-av.dead .gi-av-img {
  filter: grayscale(1) brightness(0.6);
}
.gi-av.dead {
  color: var(--gi-dim);
}
.gi-av.dead .gi-av-ring {
  border-color: var(--gi-line);
}
</style>
