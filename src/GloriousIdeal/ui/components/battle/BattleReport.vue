<script setup lang="ts">
/**
 * battle/BattleReport.vue —— 战斗简报（#5）
 * 真实对局结束后弹出（此时覆盖层已随 battling 复位重新可见）。
 * 内容：击杀的敌人 / 我方体力变化与阵亡 / 本场掉落（当场 roll，结算页才入账）。
 * 仅作展示：点击「确认」才调用 store.confirmBattleReport() 落库并推进副本。
 */
import { computed } from "vue";
import { view, opMaxHp } from "../../store.js";
import * as store from "../../store.js";
import { getItem, type ItemId } from "../../../data/items.js";
import { getEquipment, RARITY_LABEL, type EquipRarity } from "../../../data/equipment.js";
import { opName } from "../common/format.js";
import OperatorAvatar from "../common/OperatorAvatar.vue";

const report = computed(() => view.battleReport);
const win = computed(() => report.value?.result.win ?? false);

interface AllyRow {
	id: string;
	from: number;
	to: number;
	dead: boolean;
	delta: number;
	/** 本场击杀数（1 级：击杀 -3 压力） */
	kills: number;
}
const allies = computed<AllyRow[]>(() => {
	const r = report.value;
	if (!r) return [];
	return r.party.map(id => {
		const from = r.preHp[id] ?? opMaxHp(id);
		const to = Math.max(0, Math.floor(r.result.finalHp[id] ?? 0));
		return { id, from, to, dead: to <= 0, delta: to - from, kills: r.result.kills?.[id] ?? 0 };
	});
});

/** 胜利经验：全体存活干员 +2（结算在 campaign.applyBattleResult，这里仅提示） */
const xpGain = 2;
const survivors = computed(() => allies.value.filter(a => !a.dead).length);

const enemies = computed(() => report.value?.result.killedEnemies ?? []);
/** 本场掉落（当场 roll，确认后进暂存战利品，撤退/完成时才入账） */
const loot = computed(() => report.value?.loot);
const lootItems = computed(() => {
	const l = loot.value;
	if (!l) return [];
	return Object.entries(l.items)
		.filter(([, n]) => n > 0)
		.map(([id, n]) => ({ id, name: id === "originite" ? "源石碇" : (getItem(id as ItemId)?.name ?? id), count: n }));
});
const lootEquips = computed(() => (loot.value?.equips ?? []).map(id => ({ id, name: getEquipment(id)?.name ?? id, rarity: getEquipment(id)?.rarity })));
const eqBadge = (r?: EquipRarity) => (r === "epic" || r === "legendary" ? "gold" : r === "rare" ? "virtue" : "dead");
const lootMoney = computed(() => loot.value?.originite ?? 0);
const lootEmpty = computed(() => lootItems.value.length === 0 && lootEquips.value.length === 0 && lootMoney.value === 0);

const confirm = () => store.confirmBattleReport();
</script>

<template>
  <div v-if="report" class="gi-report-scrim">
    <div class="gi-report" role="dialog" aria-modal="true">
      <header class="gi-report-head" :class="win ? 'is-win' : 'is-lose'">
        <span class="gi-report-title">战斗简报</span>
        <span class="gi-badge" :class="win ? 'ok' : 'bad'">{{ win ? "✓ 目标达成" : "✕ 行动失败" }}</span>
      </header>

      <div class="gi-report-body">
        <!-- 我方战果：体力变化 / 阵亡 -->
        <section class="gi-report-sec">
          <h3 class="gi-h3">我方战况</h3>
          <ul class="gi-report-list">
            <li v-for="a in allies" :key="a.id" class="gi-report-row" :class="{ dead: a.dead }">
              <OperatorAvatar :id="a.id" shape="rounded" :dead="a.dead" class="gi-report-av" />
              <span class="gi-report-name">{{ opName(a.id) }}</span>
              <span v-if="a.kills > 0" class="gi-report-kills ok">击杀 {{ a.kills }} · 压力 −{{ a.kills * 3 }}</span>
              <span class="gi-report-hp">
                <span class="dim">{{ a.from }}</span>
                <span class="gi-report-arrow">→</span>
                <b :class="a.dead ? 'bad' : a.delta < 0 ? 'warn' : 'ok'">{{ a.to }}</b>
              </span>
              <span v-if="a.dead" class="gi-badge dead">☠ 阵亡</span>
            </li>
          </ul>
          <p v-if="win && survivors" class="gi-report-xp dim">胜利：全体存活干员 +{{ xpGain }} 经验（{{ survivors }} 人）</p>
        </section>

        <!-- 击杀敌人 -->
        <section class="gi-report-sec">
          <h3 class="gi-h3">歼灭敌军</h3>
          <div v-if="enemies.length" class="gi-report-tags">
            <span v-for="e in enemies" :key="e" class="gi-tag gold">{{ opName(e) }}</span>
          </div>
          <p v-else class="gi-empty dim">本次未歼灭任何敌人。</p>
        </section>

        <!-- 本场掉落（当场 roll；撤退/完成时才在结算页入账） -->
        <section class="gi-report-sec">
          <h3 class="gi-h3">获得奖励</h3>
          <p v-if="lootEmpty" class="gi-empty dim">本次没有拾获任何物资。</p>
          <div v-else class="gi-report-rewards">
            <span v-for="it in lootItems" :key="it.id" class="gi-report-reward">
              {{ it.name }} <b>×{{ it.count }}</b>
            </span>
            <span v-for="(q, i) in lootEquips" :key="i" class="gi-report-reward gi-report-equip">
              <b>{{ q.name }}</b>
              <span v-if="q.rarity" class="gi-badge" :class="eqBadge(q.rarity)">{{ RARITY_LABEL[q.rarity] }}</span>
            </span>
            <span v-if="lootMoney > 0" class="gi-report-reward">
              <span class="gi-report-dot" /> 💠 源石碇 <b>{{ lootMoney }}</b>
            </span>
          </div>
          <p class="gi-hint dim">奖励先记入本次远征的暂存行囊，撤退或完成讨伐时在结算页统一入账。</p>
        </section>
      </div>

      <footer class="gi-report-foot">
        <button class="gi-btn gi-btn-primary gi-btn-lg" @click="confirm">确认</button>
      </footer>
    </div>
  </div>
</template>

<style>
/* 遮罩：#gi-layer .cls 压过引擎全局 #gi-layer div{position:static}，使浮层回到固定定位 */
#gi-layer .gi-report-scrim {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(6, 8, 14, 0.72);
  backdrop-filter: blur(2px);
}
#gi-layer .gi-report {
  position: relative;
  display: block;
  width: min(520px, 100%);
  max-height: min(86vh, 720px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #141a29, #0e1220);
  border: 1px solid var(--gi-line2);
  border-radius: var(--gi-radius);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
}
.gi-report-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--gi-line);
}
.gi-report-head.is-win {
  background: radial-gradient(240px 80px at 20% 0%, rgba(111, 206, 143, 0.12), transparent 70%);
}
.gi-report-head.is-lose {
  background: radial-gradient(240px 80px at 20% 0%, rgba(224, 106, 94, 0.12), transparent 70%);
}
.gi-report-title {
  font-size: 18px;
  letter-spacing: 2px;
  color: var(--gi-gold);
}
.gi-report-body {
  padding: 6px 18px 14px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.gi-report-sec {
  padding-top: 12px;
  border-top: 1px solid var(--gi-line);
}
.gi-report-sec:first-child {
  border-top: none;
}
.gi-report-list {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gi-report-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.gi-report-row.dead {
  opacity: 0.75;
}
.gi-report-av {
  --gi-av-size: 40px;
}
.gi-report-name {
  flex: 1 1 auto;
  min-width: 0;
}
.gi-report-kills {
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--gi-green);
}
.gi-report-xp {
  margin: 10px 0 0;
  font-size: 13px;
}
.gi-report-hp {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
}
.gi-report-arrow {
  color: var(--gi-dim);
}
.gi-report-hp .ok {
  color: var(--gi-green);
}
.gi-report-hp .warn {
  color: var(--gi-orange);
}
.gi-report-hp .bad {
  color: var(--gi-red);
}
.gi-report-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.gi-report-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 10px;
}
.gi-report-reward {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.gi-report-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, var(--gi-gold2), var(--gi-gold-dim));
  box-shadow: 0 0 6px rgba(224, 179, 87, 0.5);
}
.gi-report-foot {
  display: flex;
  justify-content: flex-end;
  padding: 12px 18px;
  border-top: 1px solid var(--gi-line);
  background: var(--gi-bg1);
}
</style>
