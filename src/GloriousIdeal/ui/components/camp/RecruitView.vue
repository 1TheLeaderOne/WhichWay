<script setup lang="ts">
/**
 * camp/RecruitView.vue —— 招募页（天灾信使）
 * 复用通用干员卡片 OperatorCard 展示候选（左立绘+名字+体力/护盾、右技能），整卡点击即招募。
 * 「刷新候选」仅在今天尚未招募过任何干员时可用；一旦当天招募过即锁定，换天后自动恢复。
 * 名额受军营等级限制，满员时卡片锁定。
 */
import { computed } from "vue";
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import OperatorCard from "../common/OperatorCard.vue";

const candidates = computed(() => view.ctrl?.data.candidates ?? []);
const capacity = computed(() => CONFIG.BARRACKS_CAPACITY[view.ctrl?.data.buildings.barracks ?? 1] ?? 8);
const alive = computed(() => view.ctrl?.liveOperators().length ?? 0);
const full = computed(() => alive.value >= capacity.value);
/** 今天是否还能刷新候选：未招募过任何干员才可 */
const canRefresh = computed(() => !!view.ctrl && !view.ctrl.hasRecruitedToday());
</script>

<template>
  <div class="gi-page gi-recruit">
    <StatusBar />

    <div class="gi-recruit-head">
      <div>
        <h2 class="gi-h2">🕊 天灾信使 · 招募</h2>
        <p class="gi-sub dim">信使每天带来新的旅人。招募免费，但军营容量有限；招募一名后当日不再刷新候选。</p>
      </div>
      <div class="gi-recruit-cap">
        在营 <b>{{ alive }}</b> / {{ capacity }}
        <span v-if="full" class="gi-badge warn">名额已满</span>
      </div>
    </div>

    <div class="gi-recruit-bar">
      <button
        class="gi-btn gi-btn-mini"
        :disabled="!canRefresh"
        :title="canRefresh ? '刷新候选干员' : '今日已招募，换天前不能再刷新'"
        @click="store.rollRecruits()"
      >
        🎲 刷新候选
      </button>
      <span v-if="!canRefresh" class="dim gi-recruit-hint">今日已招募过干员，暂时无法刷新</span>
    </div>

    <!-- 候选卡（复用通用卡片，整卡点击即招募） -->
    <div v-if="candidates.length" class="gi-cand-grid">
      <OperatorCard
        v-for="id in candidates"
        :key="id"
        :id="id"
        :show-check="false"
        :locked="full"
        @toggle="store.acceptCandidate(id)"
      >
        <template #meta>
          <span class="dim gi-cand-tip">{{ full ? "名额已满" : "点击卡片招募 · 1 级" }}</span>
        </template>
      </OperatorCard>
    </div>

    <!-- 无候选 -->
    <div v-else class="gi-empty-card dim">
      <p>今天信使还没有带来候选人。</p>
      <button v-if="view.pool.length && canRefresh" class="gi-btn" @click="store.rollRecruits()">🎲 等待信使（刷新候选）</button>
      <p v-else-if="view.pool.length" class="dim">今日已招募，明天信使会再带来候选人。</p>
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
  margin: 18px 0 12px;
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
.gi-recruit-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.gi-recruit-hint {
  font-size: 12px;
}
.gi-cand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 14px;
}
.gi-cand-tip {
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
.gi-btn-mini {
  padding: 4px 10px;
  font-size: 12px;
}
</style>
