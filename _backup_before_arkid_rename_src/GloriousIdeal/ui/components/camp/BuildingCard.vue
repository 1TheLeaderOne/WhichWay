<script setup lang="ts">
/**
 * camp/BuildingCard.vue —— 单个建筑卡（等级 / 描述 / 升级或修建按钮）
 */
import type { BuildingDef } from "../../data/buildings.js";
import { view } from "../../store.js";
import * as store from "../../store.js";
import { buildingIcon } from "../common/format.js";

const props = defineProps<{ def: BuildingDef }>();

const level = () => view.ctrl?.data.buildings[props.def.id] ?? props.def.initLevel;
const isRuin = () => level() < 0;
const maxed = () => level() >= props.def.maxLevel;

/** 升级按钮文案与费用展示（cost 全 0 时显示“免费”，TODO 定值后自动变为数字） */
const nextCost = () => {
	const lv = level();
	if (lv < 0) return props.def.cost[0] ?? 0;
	if (lv >= props.def.maxLevel) return null;
	return props.def.cost[lv] ?? 0;
};

const buttonText = () => {
	if (isRuin()) return "修建";
	if (maxed()) return "已满级";
	return "升级";
};
</script>

<template>
  <div class="gi-building" :class="{ ruin: isRuin(), maxed: maxed() }">
    <div class="gi-building-head">
      <span class="gi-building-icon">{{ buildingIcon(def.id) }}</span>
      <div class="gi-building-id">
        <div class="gi-building-name">
          {{ def.name }}
          <span v-if="isRuin()" class="gi-badge ruin">废弃</span>
          <span v-else class="gi-badge lv">Lv.{{ level() }}</span>
        </div>
        <div v-if="maxed() && !isRuin()" class="gi-building-lvcap dim">已达最高等级</div>
      </div>
    </div>
    <p class="gi-building-desc dim">{{ def.desc }}</p>
    <div class="gi-building-foot">
      <span v-if="!isRuin() && !maxed()" class="gi-cost">💠 {{ nextCost() === 0 ? "免费" : nextCost() }}</span>
      <span v-else-if="isRuin()" class="gi-cost">💠 {{ nextCost() === 0 ? "免费" : nextCost() }}</span>
      <button
        v-if="!maxed()"
        class="gi-btn gi-btn-sm"
        :class="isRuin() ? 'gi-btn-primary' : ''"
        @click="store.upgradeBuilding(def.id)"
      >
        {{ buttonText() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.gi-building {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s, transform 0.2s;
}
.gi-building:hover {
  border-color: var(--gi-line2);
  transform: translateY(-1px);
}
.gi-building.maxed {
  opacity: 0.78;
}
.gi-building.ruin {
  border-style: dashed;
}
.gi-building-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.gi-building-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: linear-gradient(180deg, var(--gi-panel2), var(--gi-bg1));
  border: 1px solid var(--gi-line);
}
.gi-building-name {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.gi-building-lvcap {
  font-size: 11px;
  margin-top: 2px;
}
.gi-building-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  flex: 1;
}
.gi-building-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.gi-cost {
  font-size: 12px;
  color: var(--gi-orange);
  font-variant-numeric: tabular-nums;
}
</style>
