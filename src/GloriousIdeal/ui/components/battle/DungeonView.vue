<script setup lang="ts">
/**
 * battle/DungeonView.vue —— 战斗系统 · 副本探索（出征链路第 2 步）
 * 将生成的副本图渲染为横向「行军地图」：驻扎点 = 方卡、通路 = 圆点。
 * 当前节点金色高亮，邻居可点击前往（gold 描边 + 脉冲）；BOSS 在最远端。
 *
 * TODO：真实标准对垒接好后，在 moveTo 命中敌人时切到战斗层（battle 系统扩展点）。
 */
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import type { DungeonNode } from "../../dungeon.js";
import { opName, opAvatar } from "../common/format.js";

const layout = () => view.layout;
const curIndex = () => view.cur;
const curNode = (): DungeonNode | undefined => layout()?.nodes.find(n => n.index === curIndex());

/** 当前所在节点的可前往邻居 */
const canGo = (n: DungeonNode): boolean => {
	const c = curNode();
	if (!c) return false;
	return c.neighbors.includes(n.index) && n.index !== curIndex();
};

const diffName = () => (layout() ? CONFIG.DIFFICULTY[layout()!.difficulty].name : "");

/** 节点图标与语义色 */
const nodeIcon = (n: DungeonNode): string => {
	if (n.kind === "outpost") {
		if (n.event === "boss") return "💀";
		if (n.hasEnemy) return "⚔";
		return "🏕";
	}
	return n.event === "treasure" ? "✨" : "·";
};

const nodeState = (n: DungeonNode): string => {
	if (n.index === curIndex()) return "cur";
	if (canGo(n)) return "go";
	if (n.kind === "outpost" && n.event === "boss" && n.hasEnemy) return "boss";
	if (n.hasEnemy) return "foe";
	if (n.cleared) return "cleared";
	if (n.explored) return "seen";
	return "dark";
};

/** 统计：已清扫的敌占驻扎点（含入口；初始全部有敌） */
const clearedOutposts = () => layout()?.nodes.filter(n => n.kind === "outpost" && !n.hasEnemy).length ?? 0;
const totalOutposts = () => layout()?.nodes.filter(n => n.kind === "outpost").length ?? 0;

const moveTo = (n: DungeonNode) => {
	store.moveTo(n.index);
};
</script>

<template>
  <div class="gi-page gi-dungeon">
    <StatusBar />

    <!-- 任务头卡 -->
    <div class="gi-run-head" v-if="view.layout">
      <div class="gi-run-title">
        <h2 class="gi-h2">
          {{ CONFIG.DUNGEONS.find(d => d.id === view.layout.dungeonId)?.name ?? view.layout.dungeonId }}
          <span class="gi-diff-chip">{{ diffName() }}</span>
        </h2>
        <p class="gi-sub dim">目标副本：{{ view.layout.dungeonId }} · 难度 {{ diffName() }}</p>
      </div>
      <div class="gi-run-party">
        <span class="gi-run-party-label dim">出征小队</span>
        <div class="gi-run-chips">
          <span v-for="id in view.party" :key="id" class="gi-run-chip">
            <span class="gi-run-chip-av">{{ opAvatar(id) }}</span>
            {{ opName(id) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 地图轨道 -->
    <div class="gi-run-map">
      <div class="gi-map-track" v-if="view.layout">
        <template v-for="n in view.layout.nodes" :key="n.index">
          <!-- 节点 -->
          <button
            class="gi-node"
            :class="[n.kind === 'outpost' ? 'gi-node-outpost' : 'gi-node-path', nodeState(n)]"
            :disabled="!canGo(n)"
            :title="
              n.index === curIndex()
                ? '当前位置'
                : canGo(n)
                  ? '可前往'
                  : n.event === 'boss'
                    ? 'BOSS 驻地'
                    : n.kind === 'outpost'
                      ? '驻扎点'
                      : '通路'
            "
            @click="moveTo(n)"
          >
            <span class="gi-node-icon">{{ nodeIcon(n) }}</span>
            <span v-if="n.kind === 'outpost'" class="gi-node-no">#{{ n.index }}</span>
          </button>
          <!-- 若当前节点即本节点之后的衔接：不画线，用箭头示意 -->
          <span v-if="n.index === curIndex()" class="gi-node-flag">▼</span>
        </template>
      </div>

      <!-- 图例 -->
      <div class="gi-map-legend dim">
        <span><i class="lg lg-cur" /> 当前位置</span>
        <span><i class="lg lg-go" /> 可前往</span>
        <span><i class="lg lg-foe" /> 遭遇敌人</span>
        <span><i class="lg lg-boss" /> BOSS</span>
        <span><i class="lg lg-cleared" /> 已清扫</span>
        <span><i class="lg lg-dark" /> 未知</span>
      </div>
    </div>

    <!-- 行动区 -->
    <div class="gi-run-actions">
      <div class="gi-run-info">
        <p class="gi-run-hint">
          <b>当前驻扎点 #{{ curIndex() }}</b>
          <span class="dim"> · 已清扫 {{ clearedOutposts() }}/{{ totalOutposts() }} 个驻扎点</span>
        </p>
        <p class="gi-hint-sm dim">
          每次移动 = 1 行动；体力跨战斗保留，手牌每场重置（占位）。抵达 BOSS 前先清空沿途敌军吧。
        </p>
      </div>
      <div class="gi-run-btns">
        <button class="gi-btn gi-btn-outline" title="返回营地，按任务完成度结算" @click="store.endDungeon()">
          撤离并结算 →
        </button>
      </div>
    </div>

    <div class="gi-danger-zone" v-if="view.ctrl">
      <!-- 危险：全部干员阵亡会失去本次收获；未来战斗失败处置在此实现 -->
    </div>
  </div>
</template>

<style scoped>
.gi-run-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin: 18px 0 14px;
}
.gi-h2 {
  margin: 0;
}
.gi-diff-chip {
  display: inline-block;
  vertical-align: middle;
  font-size: 11px;
  font-weight: 500;
  color: var(--gi-gold);
  border: 1px solid var(--gi-gold-dim);
  border-radius: 999px;
  padding: 2px 10px;
  margin-left: 6px;
}
.gi-run-party {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.gi-run-party-label {
  font-size: 12px;
}
.gi-run-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.gi-run-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--gi-panel);
  border: 1px solid var(--gi-line2);
  border-radius: 999px;
  padding: 3px 12px 3px 4px;
  font-size: 12px;
}
.gi-run-chip-av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--gi-gold);
  background: var(--gi-panel2);
  border: 1px solid var(--gi-line2);
}
/* ---------- 地图 ---------- */
.gi-run-map {
  display: block; /* 引擎 div 全局 inline-block，块级容器须显式恢复 */
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 18px 12px 10px;
}
.gi-map-track {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  overflow-x: auto;
  padding: 6px 4px 16px;
  min-height: 92px;
}
.gi-map-track::-webkit-scrollbar {
  height: 8px;
}
.gi-map-track::-webkit-scrollbar-thumb {
  background: var(--gi-line2);
  border-radius: 4px;
}
.gi-node {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  padding: 0;
  border-radius: 10px;
  cursor: default;
  transition: transform 0.15s;
  font-family: inherit;
}
.gi-node:disabled {
  cursor: default;
}
.gi-node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.gi-node-no {
  font-size: 9px;
  color: var(--gi-dim);
  line-height: 1;
}
/* 驻扎点卡 */
.gi-node-outpost {
  width: 56px;
  height: 56px;
  background: var(--gi-bg1);
  border: 2px solid var(--gi-line);
}
.gi-node-outpost .gi-node-icon {
  font-size: 20px;
}
/* 通路圆点 */
.gi-node-path {
  width: 34px;
  height: 34px;
  margin-bottom: 10px;
  border-radius: 50%;
  border: 2px solid var(--gi-line);
  background: var(--gi-bg0);
}
.gi-node-path .gi-node-icon {
  font-size: 13px;
}
/* 状态配色 */
.gi-node.dark {
  opacity: 0.32;
}
.gi-node.seen {
  opacity: 0.75;
}
.gi-node.cleared {
  border-color: var(--gi-green);
}
.gi-node.cleared .gi-node-icon {
  filter: grayscale(0.3);
}
.gi-node.foe,
.gi-node.boss {
  border-color: var(--gi-red);
  box-shadow: 0 0 12px rgba(224, 106, 94, 0.25);
}
.gi-node.boss {
  border-color: #d9534f;
  animation: gi-boss-pulse 1.6s ease-in-out infinite;
}
.gi-node.go {
  cursor: pointer;
  border-color: var(--gi-gold);
  animation: gi-go-pulse 1.4s ease-in-out infinite;
}
.gi-node.go:hover {
  transform: translateY(-3px);
}
.gi-node.cur {
  border-color: var(--gi-gold);
  background: linear-gradient(180deg, rgba(224, 179, 87, 0.25), rgba(224, 179, 87, 0.08));
  box-shadow: 0 0 0 3px rgba(224, 179, 87, 0.18), 0 0 22px rgba(224, 179, 87, 0.35);
  z-index: 2;
}
.gi-node-flag {
  align-self: center;
  font-size: 11px;
  color: var(--gi-gold);
  margin-top: -2px;
}
@keyframes gi-go-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(224, 179, 87, 0.35);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(224, 179, 87, 0);
  }
}
@keyframes gi-boss-pulse {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(217, 83, 79, 0.25);
  }
  50% {
    box-shadow: 0 0 18px rgba(217, 83, 79, 0.55);
  }
}
/* 图例 */
.gi-map-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid var(--gi-line);
  padding: 10px 6px 0;
  font-size: 11px;
}
.gi-map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.gi-map-legend .lg {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-bg1);
}
.lg-cur {
  background: rgba(224, 179, 87, 0.5) !important;
  border-color: var(--gi-gold) !important;
}
.lg-go {
  border-color: var(--gi-gold) !important;
}
.lg-foe,
.lg-boss {
  border-color: var(--gi-red) !important;
}
.lg-cleared {
  border-color: var(--gi-green) !important;
}
.lg-dark {
  opacity: 0.35;
}
/* 行动区 */
.gi-run-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
}
.gi-run-hint {
  margin: 0;
  font-size: 13px;
}
.gi-run-hint b {
  color: var(--gi-gold);
}
.gi-hint-sm {
  margin: 4px 0 0;
  font-size: 11.5px;
}
.gi-run-btns {
  display: flex;
  gap: 10px;
}
</style>
