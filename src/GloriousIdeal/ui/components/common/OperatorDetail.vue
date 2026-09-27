<script setup lang="ts">
/**
 * common/OperatorDetail.vue —— 干员详情面板（点击干员弹出）
 * 内容：立绘 / 简介 / 基础属性 / 技能 / 压力 / 装备 /（副本内）当前体力。
 * 由 view.detailId 驱动；detailId=null 时不渲染。营地与副本页共用。
 */
import { computed, ref } from "vue";
import { view, opMaxHp } from "../../store.js";
import * as store from "../../store.js";
import { AGONY, VIRTUES } from "../../../data/operators.js";
import { getEquipment } from "../../../data/equipment.js";
import {
	opName,
	opIntro,
	opTitle,
	opGroup,
	opSex,
	opMeta,
	opSkills,
	levelStars,
	statusBadge,
	stressTone,
} from "./format.js";
import OperatorAvatar from "./OperatorAvatar.vue";

const id = computed(() => view.detailId);
const rosterOp = computed(() => (id.value ? (view.ctrl?.data.roster ?? []).find(o => o.id === id.value) : undefined));

/** 是否在副本中且该干员随队 —— 只有此时展示「当前体力/上限」 */
const inDungeon = computed(() => !!id.value && view.phase === "dungeon" && view.party.includes(id.value));
const hp = computed(() => (id.value ? (view.dungeonHp[id.value] ?? opMaxHp(id.value)) : 0));
const maxHp = computed(() => (id.value ? opMaxHp(id.value) : 0));

const intro = computed(() => (id.value ? opIntro(id.value) : ""));
const title = computed(() => (id.value ? opTitle(id.value) : ""));
const skills = computed(() => (id.value ? opSkills(id.value) : []));
const meta = computed(() => (id.value ? opMeta(id.value) : ""));

/** 装备栏上限：读战役层个人槽（初始 1，2 级 +1，见 campaign.addExp） */
const equipSlots = computed(() => rosterOp.value?.maxEquipSlots ?? 1);
/** 已穿戴装备（id + 定义） */
const equippedList = computed(() => (rosterOp.value?.equipped ?? []).map(eid => ({ eid, def: getEquipment(eid) })));
/** 可用装备池：已拥有但未穿戴的实例（按数量去重展示，取一个即可穿） */
const availableList = computed(() => {
	const pool = view.ctrl?.availableEquips() ?? [];
	const seen = new Set<string>();
	const out: { eid: string; def: ReturnType<typeof getEquipment> }[] = [];
	for (const eid of pool) {
		if (seen.has(eid)) continue;
		seen.add(eid);
		out.push({ eid, def: getEquipment(eid) });
	}
	return out;
});
/** 面板操作反馈 */
const eqNotice = ref("");
const canEquip = computed(() => !!rosterOp.value && !rosterOp.value.dead && rosterOp.value.equipped.length < equipSlots.value);
const equip = (eid: string) => {
	if (!id.value) return;
	const r = store.equipOp(id.value, eid);
	eqNotice.value = r.ok ? "" : r.reason ?? "";
};
const unequip = (eid: string) => {
	if (!id.value) return;
	const r = store.unequipOp(id.value, eid);
	eqNotice.value = r.ok ? "" : r.reason ?? "";
};

const virtueName = computed(() => {
	const v = rosterOp.value?.virtue;
	return v ? VIRTUES.find(x => x.id === v)?.name ?? v : "";
});

const stressPct = computed(() => Math.max(0, Math.min(100, ((rosterOp.value?.stress ?? 0) / AGONY.deathAt) * 100)));

const close = () => store.closeDetail();
</script>

<template>
  <div v-if="id && rosterOp" class="gi-detail-scrim" @click.self="close">
    <div class="gi-detail" role="dialog" aria-modal="true">
      <!-- 头部：立绘 + 名称 -->
      <header class="gi-detail-head">
        <OperatorAvatar :id="id" shape="rounded" :dead="rosterOp.dead" class="gi-detail-av" />
        <div class="gi-detail-idblock">
          <div class="gi-detail-nameline">
            <span class="gi-detail-name">{{ opName(id) }}</span>
            <span class="gi-badge" :class="statusBadge(rosterOp).cls">{{ statusBadge(rosterOp).label }}</span>
          </div>
          <div v-if="title" class="gi-detail-title">{{ title }}</div>
          <div class="gi-detail-sub dim">
            {{ opGroup(id) }} · {{ opSex(id) }}<template v-if="meta"> · {{ meta }}</template>
          </div>
          <div class="gi-detail-lvline">
            <span class="gi-stars">{{ levelStars(rosterOp.level) }}</span>
            <span class="dim">Lv {{ rosterOp.level }}</span>
            <span class="dim">· 经验 {{ rosterOp.exp }}</span>
          </div>
        </div>
        <button class="gi-detail-x" title="关闭" @click="close">✕</button>
      </header>

      <div class="gi-detail-body">
        <!-- 副本体力 -->
        <section v-if="inDungeon" class="gi-detail-sec">
          <h4 class="gi-detail-h">当前体力</h4>
          <div class="gi-hpbar">
            <div class="gi-progress">
              <div class="gi-progress-fill" :style="{ width: (hp / maxHp) * 100 + '%' }" />
            </div>
            <span class="gi-hp-num">{{ hp }} / {{ maxHp }}</span>
          </div>
        </section>

        <!-- 压力 -->
        <section class="gi-detail-sec">
          <div class="gi-detail-hrow">
            <h4 class="gi-detail-h">压力</h4>
            <span class="gi-detail-val" :class="'txt-' + stressTone(rosterOp.stress)">
              {{ Math.round(rosterOp.stress) }} / {{ AGONY.deathAt }}
            </span>
          </div>
          <div class="gi-progress gi-stressbar">
            <div class="gi-progress-fill" :class="'stress-' + stressTone(rosterOp.stress)" :style="{ width: stressPct + '%' }" />
          </div>
          <p class="gi-detail-note dim">
            <template v-if="rosterOp.dead">压力突破 {{ AGONY.deathAt }}，干员已永久牺牲。</template>
            <template v-else-if="rosterOp.agony">已达 {{ AGONY.stressAt }} 陷入「折磨」：压力增长 +20%。</template>
            <template v-else-if="virtueName">曾触发美德「{{ virtueName }}」。</template>
            <template v-else>达 {{ AGONY.stressAt }} 判定美德 / 折磨，达 {{ AGONY.deathAt }} 永久牺牲。</template>
          </p>
        </section>

        <!-- 装备 -->
        <section class="gi-detail-sec">
          <h4 class="gi-detail-h">装备</h4>
          <div class="gi-equip-grid">
            <div v-for="(e, i) in equippedList" :key="'w' + i" class="gi-equip-slot worn">
              <span class="gi-equip-slot-name">{{ e.def?.name ?? e.eid }}</span>
              <span class="gi-equip-slot-sub dim">{{ e.def?.desc ?? "" }}</span>
              <button class="gi-equip-x" title="卸下" @click="unequip(e.eid)">✕</button>
            </div>
            <span v-for="k in (equipSlots - equippedList.length)" :key="'e' + k" class="gi-equip-slot empty">空装备栏</span>
          </div>

          <p v-if="availableList.length" class="gi-equip-pool-label dim">行囊中可装备：</p>
          <div v-if="availableList.length" class="gi-equip-pool">
            <button v-for="a in availableList" :key="a.eid" class="gi-equip-chip" :disabled="!canEquip" :title="canEquip ? '穿戴' : '装备栏已满'" @click="equip(a.eid)">
              <b>{{ a.def?.name ?? a.eid }}</b>
              <span class="dim">{{ a.def?.desc ?? "" }}</span>
            </button>
          </div>

          <p v-if="eqNotice" class="gi-equip-notice">{{ eqNotice }}</p>
          <p class="gi-detail-note dim">
            {{ equipSlots }} 个装备栏{{ rosterOp.level >= 2 ? "（2 级额外 +1）" : "，升到 2 级可再 +1" }}。装备效果将在进入战斗时生效。
          </p>
        </section>

        <!-- 简介 -->
        <section class="gi-detail-sec">
          <h4 class="gi-detail-h">简介</h4>
          <p class="gi-detail-intro">{{ intro || "（该干员暂无档案记载。）" }}</p>
        </section>

        <!-- 技能 -->
        <section class="gi-detail-sec">
          <h4 class="gi-detail-h">技能</h4>
          <ul v-if="skills.length" class="gi-skill-list">
            <li v-for="s in skills" :key="s.id" class="gi-skill">
              <span class="gi-skill-name">{{ s.name }}</span>
              <span class="gi-skill-info" v-html="s.info || '—'" />
            </li>
          </ul>
          <p v-else class="gi-detail-note dim">该干员未配置技能。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 遮罩层：#gi-layer .cls 压过引擎 #gi-layer div{position:static} */
#gi-layer .gi-detail-scrim {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(6, 8, 14, 0.66);
  backdrop-filter: blur(2px);
}
#gi-layer .gi-detail {
  position: relative;
  width: min(560px, 100%);
  max-height: min(86vh, 720px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #141a29, #0e1220);
  border: 1px solid var(--gi-line2);
  border-radius: var(--gi-radius);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
}
/* 头部 */
.gi-detail-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 44px 14px 16px;
  border-bottom: 1px solid var(--gi-line);
  background: radial-gradient(220px 80px at 20% 0%, rgba(224, 179, 87, 0.1), transparent 70%);
}
.gi-detail-av {
  --gi-av-size: 84px;
}
.gi-detail-idblock {
  flex: 1 1 auto;
  min-width: 0;
}
.gi-detail-nameline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gi-detail-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--gi-gold2);
  letter-spacing: 1px;
}
.gi-detail-title {
  font-size: 12px;
  color: var(--gi-gold);
  margin-top: 2px;
}
.gi-detail-sub {
  font-size: 12px;
  margin-top: 3px;
}
.gi-detail-lvline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 12px;
}
.gi-stars {
  color: var(--gi-gold);
  letter-spacing: 1px;
  font-size: 11px;
}
.gi-detail-x {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 1px solid var(--gi-line2);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--gi-dim);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  font-family: inherit;
}
.gi-detail-x:hover {
  color: var(--gi-text);
  border-color: var(--gi-gold-dim);
}
/* 主体（可滚动） */
.gi-detail-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 4px 16px 18px;
}
.gi-detail-sec {
  padding: 12px 0;
  border-bottom: 1px solid rgba(42, 50, 70, 0.5);
}
.gi-detail-sec:last-child {
  border-bottom: none;
}
.gi-detail-h {
  margin: 0 0 8px;
  font-size: 12.5px;
  color: var(--gi-gold);
  letter-spacing: 2px;
}
.gi-detail-hrow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.gi-detail-hrow .gi-detail-h {
  margin: 0;
}
.gi-detail-val {
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}
.txt-low {
  color: var(--gi-green);
}
.txt-mid {
  color: var(--gi-orange);
}
.txt-high {
  color: var(--gi-red);
}
.gi-detail-note {
  margin: 7px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
}
/* 体力条 */
.gi-hpbar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.gi-hpbar .gi-progress {
  flex: 1 1 auto;
  height: 10px;
}
.gi-hp-num {
  font-size: 13px;
  color: var(--gi-green);
  font-variant-numeric: tabular-nums;
  min-width: 52px;
  text-align: right;
}
.gi-stressbar {
  display: block;
  width: 100%;
  height: 10px;
}
/* 装备 */
.gi-equip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.gi-equip-slot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-panel2);
  font-size: 12px;
  color: var(--gi-text);
}
.gi-equip-slot.empty {
  border-style: dashed;
  color: var(--gi-dim);
  background: transparent;
}
.gi-equip-slot.worn {
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 30px 8px 12px;
  border-color: var(--gi-gold-dim);
  background: rgba(224, 179, 87, 0.06);
}
.gi-equip-slot-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--gi-gold2);
}
.gi-equip-slot-sub {
  font-size: 11px;
  line-height: 1.4;
}
.gi-equip-x {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  border: 1px solid var(--gi-line2);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--gi-dim);
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  font-family: inherit;
}
.gi-equip-x:hover {
  color: var(--gi-red);
  border-color: rgba(224, 106, 94, 0.55);
}
.gi-equip-pool-label {
  margin: 12px 0 6px;
  font-size: 11.5px;
}
.gi-equip-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.gi-equip-chip {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 7px 11px;
  border-radius: 8px;
  border: 1px dashed var(--gi-line2);
  background: transparent;
  color: var(--gi-text);
  font-family: inherit;
  font-size: 11.5px;
  line-height: 1.4;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}
.gi-equip-chip b {
  font-size: 12.5px;
  color: var(--gi-text);
}
.gi-equip-chip:hover:not(:disabled) {
  border-style: solid;
  border-color: var(--gi-gold-dim);
  background: rgba(224, 179, 87, 0.06);
}
.gi-equip-chip:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.gi-equip-notice {
  margin: 8px 0 0;
  font-size: 11.5px;
  color: var(--gi-red);
}
/* 简介 */
.gi-detail-intro {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--gi-text);
  white-space: pre-wrap;
}
/* 技能 */
.gi-skill-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gi-skill {
  display: block;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--gi-line);
  border-left: 3px solid var(--gi-gold-dim);
  background: rgba(255, 255, 255, 0.02);
}
.gi-skill-name {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--gi-gold2);
  margin-bottom: 3px;
}
.gi-skill-info {
  display: block;
  font-size: 12px;
  line-height: 1.7;
  color: var(--gi-text);
}
</style>
