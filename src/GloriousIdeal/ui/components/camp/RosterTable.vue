<script setup lang="ts">
/**
 * camp/RosterTable.vue —— 营地队伍名册（等级星等 / 经验 / 压力条 / 状态徽章）
 * 含已阵亡干员（灰显）。压力 >=100 即到判定线，200 永久死亡。
 */
import { view } from "../../store.js";
import { opAvatar, opName, levelStars, statusBadge, stressTone } from "../common/format.js";

/** 展示全部名册（阵亡者放末尾） */
const rows = () => {
	const list = [...(view.ctrl?.data.roster ?? [])];
	return list.sort((a, b) => Number(a.dead) - Number(b.dead) || b.level - a.level || a.id.localeCompare(b.id));
};

/** 压力条占满的强度（每格 10） */
const stressWidth = (s: number) => Math.min(100, Math.max(0, s / 2));
</script>

<template>
  <table class="gi-table gi-roster">
    <thead>
      <tr>
        <th style="width: 36px"></th>
        <th>干员</th>
        <th style="width: 110px">等级</th>
        <th style="width: 70px">经验</th>
        <th style="width: 40%">压力</th>
        <th style="width: 96px">状态</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="op in rows()" :key="op.id" :class="{ dead: op.dead }">
        <td>
          <span class="gi-avatar" :class="{ dead: op.dead }">{{ opAvatar(op.id) }}</span>
        </td>
        <td>
          <span class="gi-op-name">{{ opName(op.id) }}</span>
          <span class="gi-op-id dim">{{ op.id }}</span>
        </td>
        <td>
          <span class="gi-stars" :class="op.dead ? 'dim' : ''">{{ levelStars(op.level) }}</span>
          <span v-if="!op.dead" class="gi-lv dim">Lv{{ op.level }}</span>
        </td>
        <td class="gi-num">{{ op.exp }}</td>
        <td>
          <div v-if="!op.dead" class="gi-stress">
            <div class="gi-progress">
              <div
                class="gi-progress-fill"
                :class="'stress-' + stressTone(op.stress)"
                :style="{ width: stressWidth(op.stress) + '%' }"
              />
            </div>
            <span class="gi-stress-num" :class="'txt-' + stressTone(op.stress)">{{ Math.round(op.stress) }}</span>
          </div>
          <span v-else class="dim">—</span>
        </td>
        <td>
          <span class="gi-badge" :class="statusBadge(op).cls">{{ statusBadge(op).label }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.gi-roster {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.gi-roster tbody tr {
  transition: background 0.15s;
}
.gi-roster tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}
.gi-roster tr.dead {
  opacity: 0.45;
}
.gi-roster th {
  text-align: left;
  color: var(--gi-dim);
  font-weight: 500;
  padding: 8px 10px;
  border-bottom: 1px solid var(--gi-line);
  white-space: nowrap;
}
.gi-roster td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(42, 50, 70, 0.55);
  vertical-align: middle;
}
.gi-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--gi-gold);
  background: linear-gradient(180deg, var(--gi-panel2), var(--gi-bg1));
  border: 1px solid var(--gi-line2);
}
.gi-avatar.dead {
  color: var(--gi-dim);
  border-color: var(--gi-line);
}
.gi-op-name {
  font-weight: 600;
  margin-right: 6px;
}
.gi-op-id {
  font-size: 11px;
}
.gi-stars {
  color: var(--gi-gold);
  letter-spacing: 1px;
  font-size: 11px;
  margin-right: 6px;
}
.gi-lv {
  font-size: 11px;
}
.gi-num {
  font-variant-numeric: tabular-nums;
}
.gi-stress {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gi-progress {
  flex: 1;
  min-width: 60px;
}
.gi-stress-num {
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  min-width: 22px;
  text-align: right;
}
.txt-low {
  color: var(--gi-green);
}
.txt-mid {
  color: var(--gi-orange);
}
.txt-high {
  color: var(--gi-red);
}
</style>
