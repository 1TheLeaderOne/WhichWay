<script setup lang="ts">
/**
 * title/EndScreen.vue —— 旅程结算页（胜利 / 失败）
 */
import { game } from "noname";
import { view } from "../../store.js";
import * as store from "../../store.js";
</script>

<template>
  <div class="gi-end-screen">
    <div class="gi-end-card">
      <div class="gi-end-mark" :class="view.endWin ? 'win' : 'lose'">
        {{ view.endWin ? "🏆" : "🕯" }}
      </div>
      <h1 class="gi-end-title" :class="view.endWin ? 'win' : 'lose'">
        {{ view.endWin ? "瑰丽理想 · 达成" : "旅程终结" }}
      </h1>
      <p class="gi-end-text dim">{{ view.endText }}</p>

      <div class="gi-end-stats" v-if="view.ctrl?.data">
        <div class="gi-end-stat">
          <span class="dim">历经</span>
          <b>{{ view.ctrl.data.day }}</b>
          <span class="dim">天</span>
        </div>
        <div class="gi-end-stat">
          <span class="dim">团结度</span>
          <b>{{ Math.round(view.ctrl.data.unity) }}</b>
        </div>
        <div class="gi-end-stat">
          <span class="dim">任务</span>
          <b>{{ view.ctrl.data.missionResult.win }}<span class="dim">胜 / {{ view.ctrl.data.missionResult.fail }}负</span></b>
        </div>
        <div class="gi-end-stat">
          <span class="dim">余存干员</span>
          <b>{{ view.ctrl.liveOperators().length }}</b>
        </div>
      </div>

      <div class="gi-end-actions">
        <button class="gi-btn gi-btn-primary gi-btn-xl" @click="store.startNew()">🔄 重新开始</button>
        <button class="gi-btn gi-btn-ghost gi-btn-xl" @click="game.reload()">返回主菜单</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gi-end-screen {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}
.gi-end-card {
  width: min(560px, 100%);
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: 18px;
  padding: 40px 40px 34px;
  text-align: center;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
}
.gi-end-mark {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  border: 2px solid currentColor;
}
.gi-end-mark.win {
  color: var(--gi-gold);
  background: rgba(224, 179, 87, 0.08);
  box-shadow: 0 0 34px rgba(224, 179, 87, 0.25);
}
.gi-end-mark.lose {
  color: var(--gi-red);
  background: rgba(224, 106, 94, 0.08);
  box-shadow: 0 0 34px rgba(224, 106, 94, 0.2);
}
.gi-end-title {
  margin: 0 0 10px;
  font-size: 30px;
  letter-spacing: 4px;
}
.gi-end-title.win {
  color: var(--gi-gold);
}
.gi-end-title.lose {
  color: var(--gi-red);
}
.gi-end-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
}
.gi-end-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 26px 0 30px;
}
.gi-end-stat {
  background: var(--gi-bg0);
  border: 1px solid var(--gi-line);
  border-radius: 10px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.gi-end-stat b {
  font-size: 20px;
  color: var(--gi-gold);
}
.gi-end-stat span {
  font-size: 11px;
}
.gi-end-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
@media (max-width: 560px) {
  .gi-end-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
