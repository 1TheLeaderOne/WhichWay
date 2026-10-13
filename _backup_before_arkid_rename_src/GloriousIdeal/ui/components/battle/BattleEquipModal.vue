<script setup lang="ts">
/**
 * battle/BattleEquipModal.vue —— 战斗内「装备详情」浮层（图标 + 名称 + 效果文案）
 *
 * 由 battleOverlay.ts 挂在 document.body 上的单例应用渲染；props.modal 为 reactive 容器，
 * modal.equip 非空即打开（同时由 battleOverlay.ts 负责暂停对局），点遮罩/✕ 触发 close 由其收回。
 * 手牌展开不走这里——那是另一套自建浮层（见 BattleHandPanel.vue / battleOverlay.ts openHandPanel）。
 */
import EquipIcon from "../common/EquipIcon.vue";
import type { EquipModalState } from "./battleOverlayTypes.js";

defineProps<{ modal: { equip: EquipModalState | null } }>();
const emit = defineEmits<{ (e: "close"): void }>();
</script>

<template>
  <div v-if="modal.equip" class="gi-bvem-mask" @click.self="emit('close')">
    <div class="gi-bvem">
      <button class="gi-bvem-x" @click="emit('close')">✕</button>
      <h3>{{ modal.equip.title }}</h3>
      <p v-if="!modal.equip.equips.length" class="gi-bvem-empty">未穿戴装备。</p>
      <div v-for="e in modal.equip.equips" :key="e.id" class="gi-bvem-row">
        <EquipIcon :id="e.id" :img="e.img" :size="38" />
        <div class="gi-bvem-main">
          <div class="gi-bvem-name">{{ e.name }}</div>
          <div class="gi-bvem-desc">{{ e.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gi-bvem-mask {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 6, 12, 0.62);
}
.gi-bvem {
  position: relative;
  width: min(420px, 90vw);
  max-height: 80vh;
  overflow: auto;
  padding: 16px;
  border: 1px solid rgba(224, 179, 87, 0.6);
  border-radius: 14px;
  background: #12151f;
  color: #ece6b8;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}
.gi-bvem h3 {
  display: inline-block;
  margin: 0 0 12px;
  font-size: 16px;
}
/* 引擎有全局 `div{position:absolute;transition:all .5s}`，浮层内的普通 div 一律复位成常规流 */
.gi-bvem div {
  position: static;
  transition: none;
}
.gi-bvem-x {
  float: right;
  padding: 2px 10px;
  border: 1px solid rgba(224, 179, 87, 0.5);
  border-radius: 8px;
  background: transparent;
  color: #ece6b8;
  font-size: 14px;
  cursor: pointer;
}
.gi-bvem-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}
.gi-bvem-main {
  flex: 1;
  min-width: 0;
}
.gi-bvem-name {
  font-size: 13.5px;
  font-weight: 700;
}
.gi-bvem-desc {
  font-size: 12px;
  opacity: 0.85;
}
.gi-bvem-empty {
  padding: 10px 0;
  font-size: 12.5px;
  opacity: 0.6;
}
</style>
