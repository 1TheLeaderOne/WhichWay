<script setup lang="ts">
/**
 * camp/RecruitView.vue —— 招募页（天灾信使）
 * 展示当前候选（最多 4 名），可逐人招募；名额受军营等级限制。
 */
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import { opName } from "../common/format.js";
import OperatorAvatar from "../common/OperatorAvatar.vue";

const candidates = () => view.ctrl?.data.candidates ?? [];
const capacity = () => {
	const lv = view.ctrl?.data.buildings.barracks ?? 1;
	return CONFIG.BARRACKS_CAPACITY[lv] ?? 8;
};
const alive = () => view.ctrl?.liveOperators().length ?? 0;
const full = () => alive() >= capacity();
</script>

<template>
  <div class="gi-page gi-recruit">
    <StatusBar />

    <div class="gi-recruit-head">
      <div>
        <h2 class="gi-h2">🕊 天灾信使 · 招募</h2>
        <p class="gi-sub dim">信使每天带来新的旅人。招募免费，但军营容量有限。</p>
      </div>
      <div class="gi-recruit-cap">
        在营 <b>{{ alive() }}</b> / {{ capacity() }}
        <span v-if="full()" class="gi-badge warn">名额已满</span>
      </div>
    </div>

    <!-- 候选卡 -->
    <div v-if="candidates().length" class="gi-cand-grid">
      <div v-for="id in candidates()" :key="id" class="gi-cand" :class="{ 'is-full': full() }">
        <div class="gi-cand-portrait">
          <OperatorAvatar :id="id" shape="rounded" class="gi-cand-av" />
          <div class="gi-cand-shade" />
          <div class="gi-cand-namebar">
            <div class="gi-cand-name">{{ opName(id) }}</div>
            <div class="gi-cand-id dim">{{ id }}</div>
          </div>
        </div>
        <p class="gi-cand-tip dim">免费招募 · 加入即 1 级</p>
        <button
          class="gi-btn gi-btn-primary gi-btn-block"
          :disabled="full()"
          :title="full() ? '军营名额已满，请先升级军营' : '招募这名干员'"
          @click="store.acceptCandidate(id)"
        >
          招募
        </button>
      </div>
    </div>

    <!-- 无候选 -->
    <div v-else class="gi-empty-card dim">
      <p>今天信使还没有带来候选人。</p>
      <button v-if="view.pool.length" class="gi-btn" @click="store.rollRecruits()">🎲 等待信使（刷新候选）</button>
      <p v-else class="dim">将池为空：没有可招募的干员（需先启用含干员包的扩展）。</p>
    </div>

    <div class="gi-foot-actions">
      <button class="gi-btn gi-btn-ghost" @click="store.backToCamp()">← 返回营地</button>
      <span class="dim gi-foot-hint">招募不消耗天数</span>
    </div>
  </div>
</template>

<style scoped>
.gi-recruit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 18px 0 16px;
}
.gi-recruit-cap {
  font-size: 12.5px;
  color: var(--gi-dim);
}
.gi-recruit-cap b {
  color: var(--gi-text);
  font-size: 15px;
  margin: 0 2px;
}
.gi-cand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 14px;
}
.gi-cand {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: 14px;
  padding: 10px 10px 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.gi-cand:hover {
  border-color: var(--gi-gold-dim);
  transform: translateY(-3px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.4);
}
.gi-cand.is-full {
  opacity: 0.6;
}
/* 立绘主视觉 */
.gi-cand-portrait {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
}
.gi-cand-av {
  --gi-av-size: 100%;
  width: 100%;
  height: 100%;
  display: block;
}
.gi-cand-av :deep(.gi-av-ring) {
  border: none;
  box-shadow: none;
}
.gi-cand-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(8, 10, 16, 0.85) 100%);
  pointer-events: none;
}
.gi-cand-namebar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 6px 8px 8px;
  text-align: left;
}
.gi-cand-name {
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}
.gi-cand-id {
  font-size: 10px;
}
.gi-cand-tip {
  margin: 0;
  font-size: 11px;
}
.gi-empty-card {
  background: var(--gi-panel);
  border: 1px dashed var(--gi-line2);
  border-radius: var(--gi-radius);
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  font-size: 13px;
}
.gi-foot-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
  flex-wrap: wrap;
}
.gi-foot-hint {
  font-size: 11.5px;
}
</style>
