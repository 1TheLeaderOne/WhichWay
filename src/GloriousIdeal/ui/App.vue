<script setup lang="ts">
/**
 * App.vue —— 「特蕾西娅与瑰丽理想」根组件
 * 职责仅两件：① 按 phase 分发到各「系统」页面；② 提供整套 gi-* 设计系统样式（全局）。
 *
 * 系统划分（每个系统独立目录，可各自演进）：
 *   title/   标题与结算（着陆/收尾屏）
 *   camp/    营地系统（经营养成：建筑 / 名册 / 招募）
 *   battle/  战斗系统（出征链路：Dispatch 战前准备 → Dungeon 副本探索 → 未来 Battle 对局层）
 *
 * 页面切换以 :key="view.tick" 强制整体重建（与旧实现一致）。
 */
import { view } from "./store.js";
import TitleScreen from "./components/title/TitleScreen.vue";
import EndScreen from "./components/title/EndScreen.vue";
import CampView from "./components/camp/CampView.vue";
import RecruitView from "./components/camp/RecruitView.vue";
import DispatchView from "./components/battle/DispatchView.vue";
import DungeonView from "./components/battle/DungeonView.vue";
</script>

<template>
  <div id="gi-layer" :key="view.tick">
    <!-- 标题 / 结算 -->
    <TitleScreen v-if="view.phase === 'title'" />
    <EndScreen v-else-if="view.phase === 'end'" />

    <!-- 营地系统 -->
    <CampView v-else-if="view.phase === 'camp'" />
    <RecruitView v-else-if="view.phase === 'recruit'" />

    <!-- 战斗系统 -->
    <DispatchView v-else-if="view.phase === 'dispatch'" />
    <DungeonView v-else-if="view.phase === 'dungeon'" />
  </div>
</template>

<style>
/* =========================================================
   GloriousIdeal 设计系统（全局，gi- 前缀，避免与游戏本体冲突）
   ========================================================= */
#gi-layer {
  --gi-bg0: #0c0f18;
  --gi-bg1: #121627;
  --gi-panel: #181e2e;
  --gi-panel2: #222a40;
  --gi-line: #2a3145;
  --gi-line2: #3a4562;
  --gi-text: #dbe3f0;
  --gi-dim: #8490a9;
  --gi-gold: #e0b357;
  --gi-gold2: #f0d08a;
  --gi-gold-dim: #8a6d33;
  --gi-red: #e06a5e;
  --gi-green: #6fce8f;
  --gi-orange: #e59a4b;
  --gi-radius: 12px;

  position: absolute;
  inset: 0;
  z-index: 120;
  overflow: auto;
  color: var(--gi-text);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  background:
    radial-gradient(1100px 460px at 50% -180px, rgba(224, 179, 87, 0.09), transparent 62%),
    linear-gradient(180deg, #10141f 0%, #0a0d15 100%);
  -webkit-font-smoothing: antialiased;
}
#gi-layer ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
#gi-layer ::-webkit-scrollbar-thumb {
  background: var(--gi-line2);
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
}

/* ============ 引擎兼容重置（关键！勿删） ============
   非ame layout/default/layout.css 有一条全局规则：
     div { display: inline-block; position: absolute; transition: all 0.5s; }
   即游戏内所有 div 默认是绝对定位（靠 left/top/transform 手排）。
   本模式的 Vue UI 是文档流布局，必须在 #gi-layer 内把后代 div 拉回静态定位，
   否则页面里每个组件 div 都会 absolute 叠在左上角 —— 即“全部重叠/位置错乱”。 */
#gi-layer div {
  position: static;
}
/* 模式内表格恢复自动列宽（引擎 table { table-layout: fixed } 会压扁名册） */
#gi-layer table {
  table-layout: auto;
}
/* 少数需要绝对定位的装饰性 div：在通用重置之后显式恢复 */
#gi-layer .gi-title-rings {
  position: absolute;
}

/* ---------- 页面容器 ---------- */
.gi-page {
  display: block; /* 引擎把 div 置 inline-block，块级容器须显式恢复以让 margin:auto 居中 */
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 18px 20px 40px;
  box-sizing: border-box;
}

/* ---------- 标题 ---------- */
.gi-h2 {
  margin: 0;
  font-size: 19px;
  color: var(--gi-text);
  letter-spacing: 1.5px;
  position: relative;
  padding-left: 14px;
}
.gi-h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--gi-gold), var(--gi-gold-dim));
}
.gi-h3 {
  margin: 0;
  font-size: 15px;
  color: var(--gi-text);
  letter-spacing: 0.5px;
}
.gi-sub {
  font-size: 12.5px;
  margin: 2px 0 0;
}

/* ---------- 卡片 ---------- */
.gi-side-card {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gi-side-title {
  margin: 0;
  font-size: 13px;
  color: var(--gi-gold);
  letter-spacing: 1px;
}
.gi-side-note {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.8;
}

/* ---------- 段落标题区 ---------- */
.gi-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.gi-hint {
  font-size: 11.5px;
}
.gi-empty {
  font-size: 12.5px;
  margin: 0;
}

/* ---------- 按钮 ---------- */
.gi-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-panel2);
  color: var(--gi-text);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s, opacity 0.15s;
  user-select: none;
  white-space: normal;
}
.gi-btn:hover:not(:disabled) {
  background: #2b3550;
  border-color: #4a5878;
}
.gi-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.gi-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.gi-btn-primary {
  background: linear-gradient(180deg, #ecc068, #d8a84c);
  border-color: #e0b357;
  color: #241a05;
  font-weight: 600;
}
.gi-btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #f5ce7f, #e0b357);
  border-color: #f0d08a;
  color: #241a05;
}
.gi-btn-outline {
  background: transparent;
  border-color: var(--gi-gold-dim);
  color: var(--gi-gold);
}
.gi-btn-outline:hover:not(:disabled) {
  background: rgba(224, 179, 87, 0.1);
}
.gi-btn-ghost {
  background: transparent;
  border-color: var(--gi-line);
  color: var(--gi-dim);
}
.gi-btn-ghost:hover:not(:disabled) {
  color: var(--gi-text);
  border-color: var(--gi-line2);
  background: rgba(255, 255, 255, 0.03);
}
.gi-btn-danger {
  background: transparent;
  border-color: rgba(224, 106, 94, 0.55);
  color: var(--gi-red);
}
.gi-btn-danger:hover:not(:disabled) {
  background: rgba(224, 106, 94, 0.12);
}
.gi-btn-sm {
  padding: 4px 11px;
  font-size: 12px;
  border-radius: 6px;
}
.gi-btn-lg {
  padding: 10px 22px;
  font-size: 14px;
}
.gi-btn-xl {
  padding: 12px 30px;
  font-size: 15px;
  border-radius: 10px;
}
.gi-btn-block {
  width: 100%;
}

/* ---------- 芯片 / 徽章 ---------- */
.gi-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--gi-panel2);
  border: 1px solid var(--gi-line2);
  font-size: 12px;
  color: var(--gi-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.gi-chip-unity {
  gap: 8px;
}
.gi-chip-label {
  color: var(--gi-dim);
  font-size: 11px;
}
.gi-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1.6;
  border: 1px solid transparent;
  white-space: nowrap;
}
.gi-badge.ok {
  color: var(--gi-green);
  border-color: rgba(111, 206, 143, 0.45);
  background: rgba(111, 206, 143, 0.08);
}
.gi-badge.warn {
  color: var(--gi-orange);
  border-color: rgba(229, 154, 75, 0.45);
  background: rgba(229, 154, 75, 0.08);
}
.gi-badge.bad {
  color: var(--gi-red);
  border-color: rgba(224, 106, 94, 0.45);
  background: rgba(224, 106, 94, 0.08);
}
.gi-badge.dead {
  color: var(--gi-dim);
  border-color: var(--gi-line2);
  background: var(--gi-bg0);
}
.gi-badge.gold,
.gi-badge.virtue {
  color: var(--gi-gold);
  border-color: rgba(224, 179, 87, 0.5);
  background: rgba(224, 179, 87, 0.1);
}
.gi-badge.lv {
  color: var(--gi-gold2);
  border-color: var(--gi-line2);
  background: var(--gi-bg1);
}
.gi-badge.ruin {
  color: var(--gi-red);
  border-color: rgba(224, 106, 94, 0.5);
  background: rgba(224, 106, 94, 0.1);
}

/* ---------- 进度条 ---------- */
.gi-progress {
  position: relative;
  display: inline-block;
  height: 6px;
  border-radius: 3px;
  background: var(--gi-bg0);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  vertical-align: middle;
}
.gi-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--gi-gold-dim), var(--gi-gold));
  transition: width 0.4s ease;
}
.gi-progress-fill.is-low {
  background: linear-gradient(90deg, #8a3a34, var(--gi-red));
}
.gi-progress-fill.stress-low {
  background: linear-gradient(90deg, #3f8f62, var(--gi-green));
}
.gi-progress-fill.stress-mid {
  background: linear-gradient(90deg, #9a6b2c, var(--gi-orange));
}
.gi-progress-fill.stress-high {
  background: linear-gradient(90deg, #8a3a34, var(--gi-red));
}
.gi-progress-sm {
  height: 5px;
}

/* ---------- 标签 ---------- */
.gi-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border-radius: 5px;
  font-size: 10.5px;
  line-height: 1.7;
  background: var(--gi-bg1);
  border: 1px solid var(--gi-line);
  color: var(--gi-dim);
  white-space: nowrap;
}
.gi-tag.gold {
  color: var(--gi-gold);
  border-color: var(--gi-gold-dim);
}
.gi-tag.bad {
  color: var(--gi-red);
  border-color: rgba(224, 106, 94, 0.5);
}
.gi-tag.warn {
  color: var(--gi-orange);
  border-color: rgba(229, 154, 75, 0.5);
}

/* ---------- 杂项 ---------- */
.dim {
  color: var(--gi-dim) !important;
}
.gi-link {
  background: none;
  border: none;
  color: var(--gi-gold);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}
</style>
