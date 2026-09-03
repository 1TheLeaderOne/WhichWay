<script setup lang="ts">
/**
 * camp/RecruitView.vue —— 招募页（天灾信使）
 * 展示当前候选（最多 4 名），可逐人招募；名额受军营等级限制。
 */
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import { opName, opAvatar } from "../common/format.js";

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
        <div class="gi-cand-avatar">{{ opAvatar(id) }}</div>
        <div class="gi-cand-name">{{ opName(id) }}</div>
        <div class="gi-cand-id dim">{{ id }}</div>
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
.gi-cand {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: 14px;
  padding: 18px 14px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: border-color 0.2s, transform 0.2s;
}
.gi-cand:hover {
  border-color: var(--gi-line2);
  transform: translateY(-2px);
}
.gi-cand.is-full {
  opacity: 0.6;
}
.gi-cand-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--gi-gold);
  background: radial-gradient(circle at 50% 32%, var(--gi-panel2), var(--gi-bg1));
  border: 1px solid var(--gi-gold-dim);
  margin-bottom: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}
.gi-cand-name {
  font-size: 13.5px;
  font-weight: 700;
}
.gi-cand-id {
  font-size: 10.5px;
}
.gi-cand-tip {
  margin: 4px 0 8px;
  font-size: 11px;
  flex: 1;
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
