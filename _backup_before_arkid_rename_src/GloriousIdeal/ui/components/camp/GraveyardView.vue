<script setup lang="ts">
/**
 * camp/GraveyardView.vue —— 墓园：展示全体长眠干员的临终档案
 * 每人显示：死亡时等级 / 死亡时压力 / 死因（第几天·哪个副本·被谁杀死，含自杀/友军误伤/意外/压力崩溃）。
 * 数据来自 OperatorState.death（战役层在阵亡时冻结的快照）；旧存档缺字段时降级为「无名碑」。
 */
import { view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import OperatorAvatar from "../common/OperatorAvatar.vue";
import { opName, levelStars, deathReasonText, deathCauseBadge, stressTone } from "../common/format.js";

const deadOps = () => (view.ctrl?.data.roster ?? []).filter(o => o.dead);

/** 死因短标签样式 */
const cause = (id: string) => {
	const op = view.ctrl?.data.roster.find(o => o.id === id);
	return op?.death ? deathCauseBadge(op.death) : { label: "无名碑", cls: "dead" };
};
const reason = (id: string) => {
	const op = view.ctrl?.data.roster.find(o => o.id === id);
	return op?.death ? deathReasonText(op.death) : "死因已不可考";
};
const lvAt = (id: string) => {
	const op = view.ctrl?.data.roster.find(o => o.id === id);
	return op?.death?.level ?? op?.level ?? 1;
};
const stressAt = (id: string) => {
	const op = view.ctrl?.data.roster.find(o => o.id === id);
	return op?.death?.stress ?? op?.stress ?? 0;
};
</script>

<template>
  <div class="gi-page gi-grave">
    <StatusBar />

    <div class="gi-grave-head">
      <div>
        <h2 class="gi-h2">🪦 墓园 · 长眠者</h2>
        <p class="gi-sub dim">他们把理想留在了路上。永不再归来，也永不被遗忘。</p>
      </div>
      <button class="gi-btn gi-btn-ghost" @click="store.goCamp()">← 返回营地</button>
    </div>

    <p v-if="!deadOps().length" class="gi-empty dim">墓园尚空 —— 愿你的名字永远不必刻在这里。</p>

    <div v-else class="gi-grave-grid">
      <div v-for="op in deadOps()" :key="op.id" class="gi-tomb">
        <div class="gi-tomb-top">
          <OperatorAvatar :id="op.id" shape="rounded" dead class="gi-tomb-av" />
          <div class="gi-tomb-id">
            <div class="gi-tomb-name">{{ opName(op.id) }}</div>
            <div class="gi-tomb-level dim">{{ levelStars(lvAt(op.id)) || "无等级" }}</div>
          </div>
          <span class="gi-badge" :class="cause(op.id).cls">{{ cause(op.id).label }}</span>
        </div>

        <div class="gi-tomb-reason">{{ reason(op.id) }}</div>

        <div class="gi-tomb-stats">
          <div class="gi-tomb-stat">
            <span class="dim">临终等级</span>
            <b>{{ lvAt(op.id) }}</b>
          </div>
          <div class="gi-tomb-stat">
            <span class="dim">临终压力</span>
            <b :class="`stress-${stressTone(stressAt(op.id))}`">{{ Math.round(stressAt(op.id)) }}</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gi-grave {
  padding-right: 20px;
}
.gi-grave-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  margin-bottom: 18px;
}
.gi-grave-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}
.gi-tomb {
  background: linear-gradient(180deg, var(--gi-panel), var(--gi-bg1));
  border: 1px solid var(--gi-line);
  border-top: 3px solid var(--gi-gold-dim);
  border-radius: var(--gi-radius);
  padding: 14px 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gi-tomb-top {
  display: flex;
  align-items: center;
  gap: 11px;
}
.gi-tomb-av {
  --gi-av-size: 52px;
}
.gi-tomb-id {
  flex: 1;
  min-width: 0;
}
.gi-tomb-name {
  font-size: 15px;
  color: var(--gi-text);
  font-weight: 600;
  letter-spacing: 0.5px;
}
.gi-tomb-level {
  font-size: 12px;
  color: var(--gi-gold-dim);
  letter-spacing: 1px;
}
.gi-tomb-reason {
  font-size: 13px;
  line-height: 1.7;
  color: var(--gi-text);
  background: var(--gi-bg0);
  border-left: 3px solid var(--gi-line2);
  border-radius: 6px;
  padding: 9px 11px;
}
.gi-tomb-stats {
  display: flex;
  gap: 10px;
}
.gi-tomb-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--gi-panel2);
  border: 1px solid var(--gi-line);
  border-radius: 8px;
  padding: 7px 10px;
}
.gi-tomb-stat span {
  font-size: 11px;
}
.gi-tomb-stat b {
  font-size: 16px;
  font-variant-numeric: tabular-nums;
}
.gi-tomb-stat b.stress-low {
  color: var(--gi-green);
}
.gi-tomb-stat b.stress-mid {
  color: var(--gi-orange);
}
.gi-tomb-stat b.stress-high {
  color: var(--gi-red);
}
</style>
