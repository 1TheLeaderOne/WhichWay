<script setup lang="ts">
/**
 * common/OperatorHp.vue —— 体力 / 护盾展示条
 * 常规（上限+护盾 ≤6）：满体力用 actualHp、空缺用 emptyHp 铺满体力上限格，另按护盾数铺 shield（无护盾不显示）。
 * 精简（上限+护盾 >6）：改为「actualHp 体力/上限  shield 护盾」纯数字（无护盾时省略护盾段）。
 */
import { computed } from "vue";
import { opHpView, hpFullIcon, hpEmptyIcon, hpShieldIcon } from "./format.js";

const props = defineProps<{ id: string }>();

const view = computed(() => opHpView(props.id));
const FULL = hpFullIcon();
const EMPTY = hpEmptyIcon();
const SHIELD = hpShieldIcon();

/** 满体力格数 = 体力值，空格数 = 上限 - 体力值（负数夹到 0） */
const fullPips = computed(() => Math.max(0, Math.round(view.value.hp)));
const emptyPips = computed(() => Math.max(0, Math.round(view.value.maxHp - view.value.hp)));
const shieldPips = computed(() => Math.max(0, Math.round(view.value.hujia)));
</script>

<template>
  <div class="hp-row" :title="`体力 ${view.hp}/${view.maxHp}${shieldPips ? ` · 护盾 ${view.hujia}` : ''}`">
    <template v-if="!view.compact">
      <img v-for="n in fullPips" :key="'f' + n" class="hp-pip" :src="FULL" alt="" />
      <img v-for="n in emptyPips" :key="'e' + n" class="hp-pip" :src="EMPTY" alt="" />
      <img v-for="n in shieldPips" :key="'s' + n" class="hp-pip" :src="SHIELD" alt="" />
    </template>
    <template v-else>
      <img class="hp-pip" :src="FULL" alt="" />
      <span class="hp-num">{{ view.hp }}/{{ view.maxHp }}</span>
      <template v-if="shieldPips">
        <img class="hp-pip hp-pip-shield" :src="SHIELD" alt="" />
        <span class="hp-num">{{ view.hujia }}</span>
      </template>
    </template>
  </div>
</template>

<style scoped>
.hp-row {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-wrap: wrap;
}
.hp-pip {
  width: 14px;
  height: 14px;
  object-fit: contain;
  display: block;
}
.hp-pip-shield {
  margin-left: 5px;
}
.hp-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--gi-text);
  margin: 0 2px;
}
</style>
