<script setup lang="ts">
/**
 * common/EquipIcon.vue —— 装备图标（equips/{id} 图片，缺图回退 rogue_6_relic_legacy_1）
 * 给出装备 id（可选 img 指定图片名）即渲染 image/model/GloriousIdeal/equips/ 下的图；
 * 加载失败自动切到默认图（默认图也失败则停留在默认图，不会循环）。尺寸由 props.size 控制。
 */
import { ref, computed } from "vue";
import { equipImage, equipDefaultImage } from "./format.js";

const props = withDefaults(defineProps<{ id: string; img?: string; size?: number }>(), { size: 40 });

const failed = ref(false);
const src = computed(() => (failed.value ? equipDefaultImage() : equipImage(props.id, props.img)));
</script>

<template>
  <span class="gi-eq" :style="{ width: size + 'px', height: size + 'px' }">
    <img class="gi-eq-img" :src="src" alt="" loading="lazy" @error="failed = true" />
  </span>
</template>

<style scoped>
.gi-eq {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-panel2);
}
.gi-eq-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
</style>
