<script setup lang="ts">
/**
 * common/StatusBar.vue —— 局内顶部状态条（营地系与战斗系共用）
 * 展示：天数 / 源石碇 / 团结度进度条 / 副本战况（可选插槽），右侧操作按钮。
 * 所有值直接读 store.view（reactive），无需 props。
 */
import { view, CONFIG } from "../../store.js";
import * as store from "../../store.js";

const unityPct = () => Math.max(0, Math.min(100, ((view.ctrl?.data.unity ?? 0) / CONFIG.UNITY.max) * 100));
</script>

<template>
  <div class="gi-statusbar">
    <div class="gi-sb-left">
      <span class="gi-sb-brand">🏰 卡兹戴尔</span>
      <span class="gi-sb-sep" />
      <span class="gi-sb-day">
        第 <b>{{ view.ctrl?.data.day ?? "—" }}</b> / {{ CONFIG.MAX_DAY }} 天
      </span>
      <span v-if="view.ctrl?.data.missionResult" class="gi-sb-record dim">
        任务 {{ view.ctrl.data.missionResult.win }} 胜 / {{ view.ctrl.data.missionResult.fail }} 负
      </span>
    </div>

    <div class="gi-sb-right">
      <span class="gi-chip" title="源石碇（局外资源）">💠 {{ Math.floor(view.ctrl?.data.originite ?? 0) }}</span>
      <span class="gi-chip gi-chip-unity" title="团结度：抵达 0 即失败">
        <span class="gi-chip-label">团结</span>
        <span class="gi-progress">
          <span class="gi-progress-fill" :class="{ 'is-low': (view.ctrl?.data.unity ?? 0) <= 50 }" :style="{ width: unityPct() + '%' }" />
        </span>
        <b>{{ Math.round(view.ctrl?.data.unity ?? 0) }}</b>
        <span class="dim">/{{ CONFIG.UNITY.max }}</span>
      </span>
      <button class="gi-btn gi-btn-danger gi-btn-sm" title="放弃当前旅程（清空存档）" @click="store.endJourney()">
        ✕ 结束旅程
      </button>
    </div>
  </div>
</template>

<style scoped>
.gi-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 10px 18px;
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0));
  backdrop-filter: none;
}
.gi-sb-left,
.gi-sb-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.gi-sb-brand {
  color: var(--gi-gold);
  font-weight: 700;
  letter-spacing: 0.5px;
}
.gi-sb-sep {
  width: 1px;
  height: 16px;
  background: var(--gi-line);
}
.gi-sb-day {
  color: var(--gi-text);
}
.gi-sb-day b {
  color: var(--gi-gold);
  font-size: 15px;
}
.gi-sb-record {
  font-size: 12px;
}
/* 团结度进度条固定宽度（.gi-progress 默认不撑开） */
.gi-chip-unity :deep(.gi-progress) {
  width: 92px;
}
</style>
