<script setup lang="ts">
/**
 * title/TitleScreen.vue —— 模式标题页（进入模式后的着陆屏）
 * 说明模式目标，展示存档时提供“继续上次旅程”。
 */
import { game } from "noname";
import { view } from "../../store.js";
import * as store from "../../store.js";

const FEATURES = [
	{ icon: "🏰", title: "经营卡兹戴尔", desc: "修建筑、招干员、攒物资，让营地生生不息" },
	{ icon: "⚔", title: "远征五大副本", desc: "维多利亚 · 卡西米尔 · 高卢 · 泰拉 · 凯尔希军" },
	{ icon: "⚖", title: "团结与压力", desc: "团结度维系存亡，压力抵 100 触发美德或折磨" },
	{ icon: "⏳", title: "100 天倒计时", desc: "在限期内攻略凯尔希军，为卡兹戴尔赢下理想" },
];
</script>

<template>
  <div class="gi-title-screen">
    <div class="gi-title-badge">WHICHWAY · 新模式</div>
    <div class="gi-title-rings" aria-hidden="true" />
    <h1 class="gi-title-main">特蕾西娅与瑰丽理想</h1>
    <p class="gi-title-en">Theresa and the Glorious Ideal</p>

    <p class="gi-title-desc dim">
      破碎的卡兹戴尔百废待兴。身为特蕾西娅，你将重建营地、统帅干员，
      <br />在 <b>100 天</b>内击破五大联军的围剿，为萨卡兹的明天夺回一份瑰丽理想。
    </p>

    <div class="gi-feature-grid">
      <div v-for="f in FEATURES" :key="f.title" class="gi-feature">
        <div class="gi-feature-icon">{{ f.icon }}</div>
        <div>
          <div class="gi-feature-title">{{ f.title }}</div>
          <div class="dim gi-feature-desc">{{ f.desc }}</div>
        </div>
      </div>
    </div>

    <div class="gi-title-actions">
      <button v-if="view.hasSave" class="gi-btn gi-btn-primary gi-btn-xl" @click="store.continueLast()">
        📜 继续上次旅程
      </button>
      <button class="gi-btn gi-btn-xl" :class="view.hasSave ? 'gi-btn-outline' : 'gi-btn-primary'" @click="store.startNew()">
        {{ view.hasSave ? "⚠ 开启新旅程（覆盖存档）" : "⚔ 开始旅程" }}
      </button>
      <button class="gi-btn gi-btn-ghost gi-btn-xl" @click="game.reload()">返回主菜单</button>
    </div>

    <p class="gi-title-foot dim">框架版：营地 / 招募 / 派遣 / 副本流程可跑通，数值与标准对垒战斗为占位</p>
  </div>
</template>

<style scoped>
.gi-title-screen {
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px 40px;
  overflow: hidden;
}
.gi-title-badge {
  position: relative;
  z-index: 1;
  font-size: 12px;
  letter-spacing: 4px;
  color: var(--gi-gold);
  border: 1px solid var(--gi-line2);
  border-radius: 999px;
  padding: 5px 16px;
  background: rgba(224, 179, 87, 0.06);
  margin-bottom: 26px;
}
.gi-title-rings {
  position: absolute;
  left: 50%;
  top: 6%;
  width: 560px;
  height: 560px;
  transform: translateX(-50%);
  border-radius: 50%;
  border: 1px solid rgba(224, 179, 87, 0.16);
  box-shadow:
    0 0 0 64px rgba(224, 179, 87, 0.04),
    0 0 0 128px rgba(224, 179, 87, 0.025),
    inset 0 0 120px rgba(224, 179, 87, 0.04);
  pointer-events: none;
}
.gi-title-main {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 42px;
  letter-spacing: 10px;
  color: var(--gi-gold);
  text-shadow: 0 0 42px rgba(224, 179, 87, 0.35);
}
.gi-title-en {
  position: relative;
  z-index: 1;
  margin: 10px 0 0;
  font-size: 13px;
  letter-spacing: 3px;
  color: var(--gi-dim);
}
.gi-title-desc {
  position: relative;
  z-index: 1;
  margin: 30px 0 6px;
  font-size: 14px;
  line-height: 2;
}
.gi-title-desc b {
  color: var(--gi-gold);
}
.gi-feature-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  width: min(920px, 92%);
  margin: 30px 0 36px;
}
.gi-feature {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 14px 14px;
  transition: border-color 0.2s, transform 0.2s;
}
.gi-feature:hover {
  border-color: var(--gi-line2);
  transform: translateY(-2px);
}
.gi-feature-icon {
  font-size: 22px;
  line-height: 1.2;
}
.gi-feature-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 3px;
}
.gi-feature-desc {
  font-size: 11.5px;
  line-height: 1.7;
}
.gi-title-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.gi-title-foot {
  position: relative;
  z-index: 1;
  margin-top: 34px;
  font-size: 11.5px;
}
@media (max-width: 720px) {
  .gi-feature-grid {
    grid-template-columns: 1fr;
  }
  .gi-title-main {
    font-size: 30px;
    letter-spacing: 6px;
  }
}
</style>
