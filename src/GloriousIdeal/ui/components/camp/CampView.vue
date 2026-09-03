<script setup lang="ts">
/**
 * camp/CampView.vue —— 营地系统主页（经营养成）
 * 分区：顶栏状态 → [建筑网格 | 行动中心侧栏] → 队伍名册
 */
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import BuildingCard from "./BuildingCard.vue";
import RosterTable from "./RosterTable.vue";

const campCapacity = () => {
	const lv = view.ctrl?.data.buildings.barracks ?? 1;
	return CONFIG.BARRACKS_CAPACITY[lv] ?? 8;
};
const aliveCount = () => view.ctrl?.liveOperators().length ?? 0;
const deadCount = () => (view.ctrl?.data.roster ?? []).filter(o => o.dead).length;
</script>

<template>
  <div class="gi-page gi-camp">
    <StatusBar />

    <div class="gi-camp-body">
      <!-- ========== 主体：建筑 + 名册 ========== -->
      <div class="gi-camp-main">
        <section class="gi-section">
          <div class="gi-section-head">
            <h2 class="gi-h2">卡兹戴尔 · 营地建设</h2>
            <span class="dim gi-hint">升级建筑获得每日团结/压力修正</span>
          </div>
          <div class="gi-buildings">
            <BuildingCard v-for="b in CONFIG.BUILDINGS" :key="b.id" :def="b" />
          </div>
        </section>

        <section class="gi-section">
          <div class="gi-section-head">
            <h2 class="gi-h2">队伍名册</h2>
            <span class="dim gi-hint">
              {{ aliveCount() }} / {{ campCapacity() }} 在营 · 墓园 {{ deadCount() }} 人
            </span>
          </div>
          <RosterTable />
          <p v-if="!aliveCount()" class="gi-empty dim">队伍空无一人 —— 先去 <button class="gi-link" @click="store.goRecruit()">招募干员</button> 吧。</p>
        </section>
      </div>

      <!-- ========== 侧栏：行动中心 ========== -->
      <aside class="gi-camp-side">
        <div class="gi-side-card">
          <h3 class="gi-side-title">行动中心</h3>
          <button class="gi-btn gi-btn-primary gi-btn-block gi-btn-lg" @click="store.goDispatch()">
            ⚔ 派遣 · 远征副本
          </button>
          <button class="gi-btn gi-btn-block" @click="store.goRecruit()">🕊 招募干员</button>
          <button class="gi-btn gi-btn-block" disabled title="尚未开放">🏪 商店（建设中）</button>
        </div>

        <div class="gi-side-card">
          <h3 class="gi-side-title">局势简报</h3>
          <ul class="gi-brief">
            <li><span class="dim">队伍</span><b>{{ aliveCount() }} 名干员</b></li>
            <li><span class="dim">墓园</span><b>{{ deadCount() }} 人长眠</b></li>
            <li><span class="dim">每日</span><b>可出征 1 次小队</b></li>
            <li>
              <span class="dim">目标</span>
              <b class="gi-brief-gold">第 {{ CONFIG.MAX_DAY }} 天前通关凯尔希军</b>
            </li>
          </ul>
        </div>

        <p class="gi-side-note dim">
          💡 派遣消耗 1 天行动。派遣归来将推进到次日并结算团结度。
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.gi-camp-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 264px;
  gap: 16px;
  align-items: start;
  margin-top: 14px;
}
.gi-camp-main {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}
.gi-buildings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 12px;
}
.gi-empty {
  margin: 12px 0 0;
}
/* ---------- 侧栏 ---------- */
.gi-camp-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 0;
}
.gi-brief {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.gi-brief li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  line-height: 1.5;
}
.gi-brief b {
  text-align: right;
  font-weight: 600;
}
.gi-brief-gold {
  color: var(--gi-gold);
}
@media (max-width: 900px) {
  .gi-camp-body {
    grid-template-columns: 1fr;
  }
  .gi-camp-side {
    position: static;
  }
}
</style>
