<script setup lang="ts">
/**
 * title/InitialSelectView.vue —— 开局初始干员选择（四选二 + 自由选将）
 * 从 WhichWay 将池给出 4 名候选、玩家选 2 名；「自由选将」展开全部可玩武将（含非 WhichWay）自选。
 * 信息直接内联在通用干员卡片 OperatorCard 上（左立绘+名字+体力/护盾 / 右技能），整卡可点选中。
 * 打开自由选将时隐藏四选二候选区；自由选将采用增量渲染（滚到底部再加载下一批），滚动只作用于其容器。
 */
import { computed, ref, watch } from "vue";
import { view, INITIAL_PICK_COUNT } from "../../store.js";
import * as store from "../../store.js";
import { opName } from "../common/format.js";
import OperatorCard from "../common/OperatorCard.vue";

const isPicked = (id: string) => view.initialPicked.includes(id);
const canPickMore = () => view.initialPicked.length < INITIAL_PICK_COUNT;

const query = ref("");
const filteredFree = computed(() => {
	const s = query.value.trim().toLowerCase();
	const list = view.initialFreePool;
	if (!s) return list;
	return list.filter(id => id.toLowerCase().includes(s) || opName(id).toLowerCase().includes(s));
});

/** 增量渲染：每次多渲染 PAGE 名，避免上百张卡片一次性挂载卡顿 */
const PAGE = 24;
const shown = ref(PAGE);
const visibleFree = computed(() => filteredFree.value.slice(0, shown.value));
const hasMore = computed(() => shown.value < filteredFree.value.length);

watch([query, () => view.initialFreeOpen], () => {
	shown.value = PAGE;
});

function onFreeScroll(e: Event) {
	const el = e.target as HTMLElement;
	if (!hasMore.value) return;
	if (el.scrollTop + el.clientHeight >= el.scrollHeight - 240) shown.value += PAGE;
}
</script>

<template>
  <div class="gi-page gi-startsel">
    <div class="gi-startsel-head">
      <div>
        <h2 class="gi-h2">⚔ 选择初始干员</h2>
        <p class="gi-sub dim">从驶舰之向武将中挑选你的第一批同伴 —— 四选二（{{ INITIAL_PICK_COUNT }} / {{ INITIAL_PICK_COUNT }}）。</p>
      </div>
      <div class="gi-startsel-count">
        已选 <b>{{ view.initialPicked.length }}</b> / {{ INITIAL_PICK_COUNT }}
      </div>
    </div>

    <div class="gi-sec-title">
      <span>{{ view.initialFreeOpen ? "" : "候选" }}</span>
      <button v-if="!view.initialFreeOpen" class="gi-btn gi-btn-mini" @click="store.rollInitialCandidates()">🎲 换一批</button>
      <button class="gi-btn gi-btn-ghost gi-btn-mini gi-free-toggle" @click="store.toggleInitialFree()">
        {{ view.initialFreeOpen ? "← 返回四选二" : "🗂 自由选将（含非驶舰之向武将）" }}
      </button>
    </div>

    <!-- 四选二候选（自由选将打开时隐藏） -->
    <template v-if="!view.initialFreeOpen">
      <div v-if="view.initialCandidates.length" class="gi-init-grid">
        <OperatorCard
          v-for="id in view.initialCandidates"
          :key="id"
          :id="id"
          :picked="isPicked(id)"
          :locked="!isPicked(id) && !canPickMore()"
          @toggle="store.toggleInitialPick(id)"
        />
      </div>
      <div v-else class="gi-empty-card dim">
        <p>将池为空：无法给出候选（需先启用含干员包的扩展）。</p>
      </div>
    </template>

    <!-- 自由选将：搜索 + 卡片列表，增量渲染，滚动作用于本容器 -->
    <div v-else class="gi-free">
      <input v-model="query" class="gi-free-search" type="text" placeholder="搜索武将名 / id…" />
      <div class="gi-free-scroll" @scroll.passive="onFreeScroll">
        <OperatorCard
          v-for="id in visibleFree"
          :key="id"
          :id="id"
          :picked="isPicked(id)"
          :locked="!isPicked(id) && !canPickMore()"
          @toggle="store.toggleInitialPick(id)"
        />
        <p v-if="!filteredFree.length" class="gi-free-empty dim">没有匹配的武将。</p>
        <p v-else-if="hasMore" class="gi-free-more dim">下拉加载更多（已显示 {{ visibleFree.length }} / {{ filteredFree.length }}）</p>
      </div>
    </div>

    <!-- 底部：已选 + 出发 -->
    <div class="gi-startsel-foot">
      <div class="gi-picked-chips">
        <span v-for="id in view.initialPicked" :key="id" class="gi-picked-chip" @click="store.toggleInitialPick(id)">
          {{ opName(id) }} ✕
        </span>
        <span v-if="!view.initialPicked.length" class="dim">尚未选择任何干员</span>
      </div>
      <div class="gi-startsel-actions">
        <button class="gi-btn gi-btn-ghost" @click="store.goTitle()">← 返回标题</button>
        <button class="gi-btn gi-btn-primary" :disabled="view.initialPicked.length !== INITIAL_PICK_COUNT" @click="store.confirmInitialStart()">
          出发 →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gi-startsel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 18px 0 16px;
}
.gi-startsel-count {
  font-size: 12.5px;
  color: var(--gi-dim);
}
.gi-startsel-count b {
  color: var(--gi-text);
  font-size: 15px;
  margin: 0 2px;
}
.gi-sec-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--gi-text);
}
.gi-free-toggle {
  margin-left: auto;
}
.gi-init-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 14px;
}
.gi-empty-card {
  background: var(--gi-panel);
  border: 1px dashed var(--gi-line2);
  border-radius: var(--gi-radius);
  padding: 32px 20px;
  text-align: center;
  font-size: 13px;
}
.gi-free {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 12px;
}
.gi-free-search {
  width: 100%;
  box-sizing: border-box;
  background: var(--gi-bg0);
  border: 1px solid var(--gi-line2);
  border-radius: 8px;
  color: var(--gi-text);
  padding: 8px 10px;
  font-size: 13px;
  margin-bottom: 10px;
}
/* 滚动只作用于自由选将容器，不波及整页 */
.gi-free-scroll {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 10px;
  max-height: min(62vh, 620px);
  overflow-y: auto;
  padding-right: 6px;
  align-content: start;
}
.gi-free-empty,
.gi-free-more {
  grid-column: 1 / -1;
  text-align: center;
  padding: 16px;
  font-size: 12px;
}
.gi-startsel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 22px;
}
.gi-picked-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12.5px;
}
.gi-picked-chip {
  background: rgba(224, 179, 87, 0.16);
  border: 1px solid var(--gi-gold-dim);
  border-radius: 999px;
  padding: 4px 12px;
  cursor: pointer;
}
.gi-startsel-actions {
  display: flex;
  gap: 12px;
}
.gi-btn-mini {
  padding: 4px 10px;
  font-size: 12px;
}
</style>
