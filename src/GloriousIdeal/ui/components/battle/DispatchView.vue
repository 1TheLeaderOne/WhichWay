<script setup lang="ts">
/**
 * battle/DispatchView.vue —— 战斗系统 · 战前准备（出征链路第 1 步）
 * 左：挑 3 人小队 + 选副本与难度；右：出征集结单。
 * 点选难度按钮即出发（当前框架阶段：选择 = 进入副本探索）。
 */
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import type { Difficulty } from "../../data/dungeons.js";
import { opName, opAvatar, statusBadge } from "../common/format.js";

const livings = () => view.ctrl?.liveOperators() ?? [];
const selected = () => view.selected ?? [];
const selectedOps = () => livings().filter(o => selected().includes(o.id));
const roomLeft = () => 3 - selected().length;

/** 难度解锁判定（与旧 App 一致） */
const isUnlocked = (dungeonId: string, diff: string): boolean => {
	const d = diff as Difficulty;
	const c = view.ctrl?.data;
	if (!c) return false;
	const progress = c.dungeonProgress[dungeonId];
	const exp = progress?.exp ?? 0;
	const cfg = CONFIG.DIFFICULTY[d];
	const isSpecial = CONFIG.DUNGEONS.find(x => x.id === dungeonId)?.isSpecial;
	const needExp = isSpecial ? CONFIG.SPECIAL_UNLOCK[d] : cfg.needExp;
	const needBoss = !isSpecial && cfg.needBoss && !(progress?.bossSlain ?? []).includes(d);
	return exp >= needExp && !needBoss;
};

const unlockHint = (dungeonId: string, diff: string): string => {
	const d = diff as Difficulty;
	const cfg = CONFIG.DIFFICULTY[d];
	const isSpecial = CONFIG.DUNGEONS.find(x => x.id === dungeonId)?.isSpecial;
	const needExp = isSpecial ? CONFIG.SPECIAL_UNLOCK[d] : cfg.needExp;
	const conds: string[] = [`需要副本经验 ${needExp}`];
	if (!isSpecial && cfg.needBoss) conds.push("并击败该难度 BOSS");
	return `解锁：${conds.join("；")}。通关 +${cfg.gainExp} 副本经验 · ${cfg.outposts} 个驻扎点`;
};

const go = (dungeonId: string, diff: string) => {
	if (!selected().length) {
		console.warn("[GloriousIdeal] 请先选择出战干员（1~3 名）");
		return;
	}
	store.goDungeon(selected(), dungeonId, diff as Difficulty);
};
</script>

<template>
  <div class="gi-page gi-dispatch">
    <StatusBar />

    <div class="gi-dispatch-head">
      <div>
        <h2 class="gi-h2">⚔ 远征备战</h2>
        <p class="gi-sub dim">每日可出征一次 · 每次 1~3 名干员。干员压力与资源在副本中持续保留。</p>
      </div>
      <button class="gi-btn gi-btn-ghost" @click="store.backToCamp()">← 返回营地</button>
    </div>

    <div class="gi-dispatch-body">
      <!-- ================= 左侧主区 ================= -->
      <div class="gi-dispatch-main">
        <!-- ① 选择干员 -->
        <section class="gi-section">
          <div class="gi-section-head">
            <h3 class="gi-h3">① 挑选出战干员</h3>
            <span class="dim gi-hint">已选 {{ selected().length }} / 3</span>
          </div>
          <div v-if="livings().length" class="gi-op-grid">
            <button
              v-for="op in livings()"
              :key="op.id"
              class="gi-op"
              :class="{ on: selected().includes(op.id), dimed: !selected().includes(op.id) && roomLeft() <= 0 }"
              @click="store.toggleSelected(op.id)"
            >
              <span class="gi-op-check">{{ selected().includes(op.id) ? "✓" : "" }}</span>
              <span class="gi-op-avatar">{{ opAvatar(op.id) }}</span>
              <span class="gi-op-name">{{ opName(op.id) }}</span>
              <span class="gi-op-tags">
                <span class="gi-tag">Lv{{ op.level }}</span>
                <span v-if="op.agony" class="gi-tag bad">折磨</span>
              </span>
              <span class="gi-op-stress" :class="'txt-' + (op.stress >= 100 ? 'high' : op.stress >= 50 ? 'mid' : 'low')">
                压 {{ Math.round(op.stress) }}
              </span>
            </button>
          </div>
          <p v-else class="gi-empty dim">没有可出战的干员，请先返回营地招募。</p>
        </section>

        <!-- ② 选择副本 -->
        <section class="gi-section">
          <div class="gi-section-head">
            <h3 class="gi-h3">② 选择讨伐目标</h3>
            <span class="dim gi-hint">每个副本需累积副本经验解锁更高难度</span>
          </div>
          <div class="gi-dun-list">
            <div v-for="dun in CONFIG.DUNGEONS" :key="dun.id" class="gi-dun">
              <div class="gi-dun-top">
                <span class="gi-dun-icon" :class="{ special: dun.isSpecial }">{{ dun.isSpecial ? "👑" : "🏰" }}</span>
                <div class="gi-dun-id">
                  <div class="gi-dun-name">
                    {{ dun.name }}
                    <span v-if="dun.isSpecial" class="gi-badge gold">特殊 · 通关即胜利</span>
                  </div>
                  <div v-if="dun.desc" class="gi-dun-desc dim">{{ dun.desc }}</div>
                  <div class="gi-dun-exp">
                    <span class="gi-progress gi-progress-sm">
                      <span
                        class="gi-progress-fill"
                        :style="{ width: Math.min(100, (view.ctrl?.data.dungeonProgress[dun.id]?.exp ?? 0)) + '%' }"
                      />
                    </span>
                    <span class="dim">副本经验 {{ view.ctrl?.data.dungeonProgress[dun.id]?.exp ?? 0 }}/100</span>
                  </div>
                </div>
              </div>
              <div class="gi-dun-diffs">
                <button
                  v-for="(cfg, diff) in CONFIG.DIFFICULTY"
                  :key="diff"
                  class="gi-btn gi-btn-sm"
                  :class="{ locked: !isUnlocked(dun.id, diff) }"
                  :disabled="!isUnlocked(dun.id, diff)"
                  :title="unlockHint(dun.id, diff)"
                  @click="go(dun.id, diff)"
                >
                  {{ cfg.name }}
                  <span class="gi-btn-sub">{{ cfg.outposts }} 驻点 · +{{ cfg.gainExp }} 经</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ================= 右侧：出征集结单 ================= -->
      <aside class="gi-dispatch-side">
        <div class="gi-side-card gi-order">
          <h3 class="gi-side-title">📋 出征集结单</h3>
          <div class="gi-order-squad">
            <div v-for="op in selectedOps()" :key="op.id" class="gi-order-op">
              <span class="gi-order-avatar">{{ opAvatar(op.id) }}</span>
              <div class="gi-order-info">
                <b>{{ opName(op.id) }}</b>
                <span class="dim">{{ statusBadge(op).label }}</span>
              </div>
            </div>
            <p v-if="!selected().length" class="dim gi-order-empty">尚未选择干员</p>
          </div>
          <div class="gi-order-foot">
            <span class="dim">{{ roomLeft() > 0 ? `还可选 ${roomLeft()} 名` : "小队已满（3/3）" }}</span>
            <span class="gi-tag gold" :class="{ warn: selected().some(id => livings().find(o => o.id === id)?.agony) }">
              每日 1 次
            </span>
          </div>
        </div>
        <p class="gi-side-note dim">
          💡 点击下方副卡上的「副本难度」即出发；<br />
          高压力干员出征存在风险，记得先休息恢复。
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.gi-dispatch-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 18px 0 16px;
}
.gi-dispatch-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 16px;
  align-items: start;
}
.gi-section {
  margin-bottom: 22px;
}
/* 干员选择 */
.gi-op-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.gi-op {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: 12px;
  padding: 14px 10px 10px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s, background 0.15s;
  text-align: center;
}
.gi-op:hover {
  border-color: var(--gi-line2);
  transform: translateY(-2px);
}
.gi-op.on {
  border-color: var(--gi-gold);
  background: linear-gradient(180deg, rgba(224, 179, 87, 0.12), rgba(224, 179, 87, 0.03));
}
.gi-op.dimed {
  opacity: 0.5;
}
.gi-op-check {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--gi-gold);
  color: #241a05;
  font-size: 12px;
  line-height: 18px;
  font-weight: 800;
}
.gi-op-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--gi-gold);
  background: radial-gradient(circle at 50% 32%, var(--gi-panel2), var(--gi-bg1));
  border: 1px solid var(--gi-line2);
}
.gi-op-name {
  font-size: 12.5px;
  font-weight: 700;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gi-op-tags {
  display: flex;
  gap: 4px;
}
.gi-op-stress {
  font-size: 11px;
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
/* 副本列表 */
.gi-dun-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gi-dun {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 12px 14px;
}
.gi-dun-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.gi-dun-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  background: var(--gi-panel2);
  border: 1px solid var(--gi-line);
}
.gi-dun-icon.special {
  background: rgba(224, 179, 87, 0.12);
  border-color: var(--gi-gold-dim);
}
.gi-dun-id {
  flex: 1;
  min-width: 0;
}
.gi-dun-name {
  font-weight: 700;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.gi-dun-desc {
  font-size: 11.5px;
  margin-top: 2px;
}
.gi-dun-exp {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 7px;
  font-size: 11px;
}
.gi-dun-exp .gi-progress-sm {
  width: 110px;
}
.gi-dun-diffs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  padding-left: 52px;
}
.gi-btn-sub {
  display: block;
  font-size: 10px;
  opacity: 0.75;
  margin-top: 2px;
  font-weight: 400;
}
.gi-btn.locked {
  border-style: dashed;
}
/* 右侧集结单 */
.gi-dispatch-side {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gi-order {
  gap: 12px;
}
.gi-order-squad {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gi-order-op {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--gi-bg0);
  border: 1px solid var(--gi-line);
  border-radius: 10px;
  padding: 8px 10px;
}
.gi-order-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--gi-gold);
  background: var(--gi-panel2);
  border: 1px solid var(--gi-line2);
}
.gi-order-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 12px;
}
.gi-order-empty {
  margin: 8px 0;
  text-align: center;
  font-size: 12px;
}
.gi-order-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--gi-line);
  padding-top: 10px;
  font-size: 11.5px;
}
@media (max-width: 920px) {
  .gi-dispatch-body {
    grid-template-columns: 1fr;
  }
  .gi-dispatch-side {
    position: static;
  }
}
</style>
