<script setup lang="ts">
/**
 * battle/NodeDialog.vue —— 节点交互弹窗（Phase D）
 *
 * 口径（用户确认）：走上要弹窗让玩家决定是否使用道具。
 *  - 障碍：不铲除就无法通过，且铲除**不给任何东西**。三个选项——
 *      ① 消耗 1 个后勤小队；② 在场每名干员 −1 体力 +12 压力；③ 放弃交互（节点依旧堵着）。
 *  - 宝箱：可消耗 1 个后勤小队开箱（掉落当场 roll、结算页入账），也可放弃（不消耗、无奖励、照常通过）。
 * 只处理「答复」，真正的数据变更都在 campaign 控制器里。
 */
import { computed, ref } from "vue";
import { view } from "../../store.js";
import * as store from "../../store.js";
import { getItem } from "../../../data/items.js";
import { OBSTACLE, TREASURE } from "../../../data/resources.js";

const notice = ref("");

const node = computed(() => {
  const l = view.layout;
  const i = view.nodeDialog;
  return i == null || !l ? null : (l.nodes.find(n => n.index === i) ?? null);
});
const isObstacle = computed(() => node.value?.event === "obstacle");

const supplyName = getItem("supply")?.name ?? "后勤小队";
const haveSupply = () => view.ctrl?.data.inventory.supply ?? 0;
const cost = () => (isObstacle.value ? OBSTACLE.supplyCost : TREASURE.supplyCost);
const canSupply = computed(() => haveSupply() >= cost());

/** 强铲是否会把人直接放倒（体力 <= 损耗值的人会在过程中阵亡） */
const risky = computed(() => view.party.some(id => (view.dungeonHp[id] ?? 0) <= OBSTACLE.hpLoss));

const run = (r: { ok: boolean; reason?: string }) => {
  notice.value = r.ok ? "" : r.reason ?? "办不到";
};

const onSupply = () => run(store.clearObstacle(node.value!.index, "supply"));
const onForce = () => run(store.clearObstacle(node.value!.index, "force"));
const onOpen = () => run(store.openTreasure(node.value!.index));
</script>

<template>
  <div v-if="node" class="gi-report-scrim">
    <div class="gi-nd" role="dialog" aria-modal="true">
      <header class="gi-nd-head">
        <span class="gi-nd-icon">{{ isObstacle ? '🪨' : '✨' }}</span>
        <div>
          <h3 class="gi-h3">{{ isObstacle ? '通路障碍' : '物资箱' }}</h3>
          <p class="gi-sub dim">
            {{ isObstacle ? `堵在通路 #${node.index} 上，不铲除就只能绕路或撤退。铲开它没有任何收获。` : `搁在通路 #${node.index} 上，开箱要花一支后勤小队；也可以不碰它直接走。` }}
          </p>
        </div>
      </header>

      <div class="gi-nd-body">
        <template v-if="isObstacle">
          <button class="gi-nd-opt" :disabled="!canSupply" @click="onSupply">
            <span class="gi-nd-opt-title">派后勤小队清开</span>
            <span class="gi-nd-opt-sub dim">消耗 {{ cost() }} 个{{ supplyName }}（持有 {{ haveSupply() }}）</span>
          </button>
          <button class="gi-nd-opt" :class="{ danger: risky }" @click="onForce">
            <span class="gi-nd-opt-title">亲手挖开</span>
            <span class="gi-nd-opt-sub dim">
              在场 {{ view.party.length }} 名干员各 −{{ OBSTACLE.hpLoss }} 体力、压力 +{{ OBSTACLE.stress }}<template v-if="risky">（有人只剩 1 点体力，会倒下）</template>
            </span>
          </button>
          <button class="gi-nd-opt ghost" @click="store.dismissNode()">
            <span class="gi-nd-opt-title">放弃交互</span>
            <span class="gi-nd-opt-sub dim">什么都不消耗，但这条路依旧堵着</span>
          </button>
        </template>
        <template v-else>
          <button class="gi-nd-opt" :disabled="!canSupply" @click="onOpen">
            <span class="gi-nd-opt-title">撬开箱子</span>
            <span class="gi-nd-opt-sub dim">消耗 {{ cost() }} 个{{ supplyName }}（持有 {{ haveSupply() }}）· 收获先记下，结算时带回</span>
          </button>
          <button class="gi-nd-opt ghost" @click="store.dismissNode()">
            <span class="gi-nd-opt-title">不碰它</span>
            <span class="gi-nd-opt-sub dim">不消耗任何东西，直接路过（以后回来也还是不拆）</span>
          </button>
        </template>
        <p v-if="notice" class="gi-nd-notice">{{ notice }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#gi-layer .gi-nd {
  position: relative;
  display: block;
  width: min(440px, 100%);
  background: linear-gradient(180deg, #141a29, #0e1220);
  border: 1px solid var(--gi-line2);
  border-radius: var(--gi-radius);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
.gi-nd-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--gi-line);
}
.gi-nd-icon {
  font-size: 26px;
  line-height: 1.2;
}
.gi-nd-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 18px 18px;
}
.gi-nd-opt {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 10px 13px;
  border-radius: 9px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-panel2);
  color: var(--gi-text);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}
.gi-nd-opt:hover:not(:disabled) {
  background: #2b3550;
  border-color: var(--gi-gold-dim);
}
.gi-nd-opt:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.gi-nd-opt.ghost {
  background: transparent;
  border-color: var(--gi-line);
}
.gi-nd-opt.danger .gi-nd-opt-title {
  color: var(--gi-red);
}
.gi-nd-opt-title {
  font-size: 13.5px;
  font-weight: 600;
}
.gi-nd-opt-sub {
  font-size: 11.5px;
  line-height: 1.6;
}
.gi-nd-notice {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--gi-red);
}
</style>
