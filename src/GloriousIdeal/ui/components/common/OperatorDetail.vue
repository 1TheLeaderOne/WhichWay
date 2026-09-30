<script setup lang="ts">
/**
 * common/OperatorDetail.vue —— 干员详情 + 装备界面（点击干员弹出）
 * 左列：立绘 / 简介 / 属性 / 技能 / 压力 +（固定底部）该干员已穿戴装备。
 * 右列：全局装备仓库（独立面板）——点击条目装备到干员，点击已穿戴退回仓库；装备栏满时无法装备并提示。
 * 由 view.detailId 驱动；detailId=null 时不渲染。营地与副本页共用。
 */
import { computed, ref } from "vue";
import { view, opMaxHp } from "../../store.js";
import * as store from "../../store.js";
import { AGONY, VIRTUES } from "../../../data/operators.js";
import { getEquipment, RARITY_LABEL } from "../../../data/equipment.js";
import { opName, opIntro, opTitle, opSkills, levelStars, statusBadge, stressTone } from "./format.js";
import OperatorAvatar from "./OperatorAvatar.vue";
import EquipIcon from "./EquipIcon.vue";

const id = computed(() => view.detailId);
const rosterOp = computed(() => (id.value ? (view.ctrl?.data.roster ?? []).find(o => o.id === id.value) : undefined));

/** 是否在副本中且该干员随队 —— 只有此时展示「当前体力/上限」 */
const inDungeon = computed(() => !!id.value && view.phase === "dungeon" && view.party.includes(id.value));
const hp = computed(() => (id.value ? view.dungeonHp[id.value] ?? opMaxHp(id.value) : 0));
const maxHp = computed(() => (id.value ? opMaxHp(id.value) : 0));

const intro = computed(() => (id.value ? opIntro(id.value) : ""));
const title = computed(() => (id.value ? opTitle(id.value) : ""));
const skills = computed(() => (id.value ? opSkills(id.value) : []));

/** 装备栏上限：读战役层个人槽（初始 1，2 级 +1，见 campaign.addExp） */
const equipSlots = computed(() => rosterOp.value?.maxEquipSlots ?? 1);
/** 已穿戴装备（左列底部固定展示；点击退回仓库） */
const equippedList = computed(() => (rosterOp.value?.equipped ?? []).map(eid => ({ eid, def: getEquipment(eid) })));
/** 全局仓库可用池：已拥有且未被任何存活干员穿戴，按 id 聚合计数 */
const warehouse = computed(() => {
	const pool = view.ctrl?.availableEquips() ?? [];
	const counts = new Map<string, number>();
	for (const eid of pool) counts.set(eid, (counts.get(eid) ?? 0) + 1);
	return [...counts].map(([eid, count]) => ({ eid, count, def: getEquipment(eid) }));
});
const slotsFull = computed(() => !!rosterOp.value && rosterOp.value.equipped.length >= equipSlots.value);

/** 面板操作反馈 */
const eqNotice = ref("");
const equip = (eid: string) => {
	if (!id.value) return;
	const r = store.equipOp(id.value, eid);
	eqNotice.value = r.ok ? "" : `装备失败：${r.reason ?? "无法装备"}`;
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

const close = () => {
	eqNotice.value = "";
	store.closeDetail();
};
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
          <div class="gi-detail-lvline">
            <span class="gi-stars">{{ levelStars(rosterOp.level) }}</span>
            <span class="dim">Lv {{ rosterOp.level }}</span>
            <span class="dim">· 经验 {{ rosterOp.exp }}</span>
          </div>
        </div>
        <button class="gi-detail-x" title="关闭" @click="close">✕</button>
      </header>

      <div class="gi-detail-split">
        <!-- ============ 左列：干员信息 ============ -->
        <div class="gi-detail-main">
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

          <!-- 已穿戴：固定在左列最下方 -->
          <section class="gi-detail-sec gi-detail-sec-last">
            <div class="gi-detail-hrow">
              <h4 class="gi-detail-h">已穿戴</h4>
              <span class="gi-detail-val dim" :class="{ 'txt-high': slotsFull }">{{ equippedList.length }}/{{ equipSlots }}</span>
            </div>
            <div class="gi-equip-grid">
              <button
                v-for="(e, i) in equippedList"
                :key="'w' + i"
                class="gi-equip-slot worn"
                title="点击退回右侧仓库"
                @click="unequip(e.eid)"
              >
                <EquipIcon :id="e.eid" :img="e.def?.img" :size="36" />
                <span class="gi-equip-info">
                  <span class="gi-equip-slot-name">{{ e.def?.name ?? e.eid }}</span>
                  <span class="gi-equip-slot-sub dim">{{ e.def?.desc ?? "" }}</span>
                </span>
                <span class="gi-equip-return" title="退回仓库">↩</span>
              </button>
              <div v-for="k in equipSlots - equippedList.length" :key="'e' + k" class="gi-equip-slot empty">空装备栏</div>
            </div>
            <p class="gi-detail-note dim">
              {{ equipSlots }} 个装备栏{{ rosterOp.level >= 2 ? "（2 级额外 +1）" : "，升到 2 级可再 +1" }}。点击已穿戴可退回右侧仓库。
            </p>
          </section>
        </div>

        <!-- ============ 右列：全局装备仓库（独立面板） ============ -->
        <aside class="gi-detail-warehouse">
          <div class="gi-wh-head">
            <h4 class="gi-detail-h">装备仓库</h4>
            <span class="gi-badge" :class="slotsFull ? 'dead' : 'ok'">{{ slotsFull ? "栏位已满" : "可装备" }}</span>
          </div>
          <p v-if="eqNotice" class="gi-equip-notice">{{ eqNotice }}</p>

          <div v-if="warehouse.length" class="gi-wh-list">
            <button
              v-for="w in warehouse"
              :key="w.eid"
              class="gi-wh-item"
              :class="{ blocked: slotsFull }"
              :title="slotsFull ? '需要有空置的装备栏' : '装备到该干员'"
              @click="equip(w.eid)"
            >
              <EquipIcon :id="w.eid" :img="w.def?.img" :size="40" />
              <span class="gi-wh-info">
                <span class="gi-wh-name">
                  {{ w.def?.name ?? w.eid }}
                  <span v-if="w.count > 1" class="gi-wh-count">×{{ w.count }}</span>
                </span>
                <span class="gi-wh-sub dim">{{ w.def?.desc ?? "" }}</span>
              </span>
              <span v-if="w.def" class="gi-wh-rar" :class="'r-' + w.def.rarity">{{ RARITY_LABEL[w.def.rarity] }}</span>
            </button>
          </div>
          <p v-else class="gi-empty dim">仓库中暂无可穿戴装备。去营地「砍诺特」购入后到此装备。</p>
        </aside>
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
  width: min(920px, 100%);
  max-height: min(88vh, 760px);
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
  flex: 0 0 auto;
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
/* 双栏主体 */
.gi-detail-split {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}
/* 左列（可滚动） */
.gi-detail-main {
  flex: 1 1 auto;
  min-width: 0;
  overflow-y: auto;
  padding: 4px 16px 18px;
}
.gi-detail-warehouse {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-left: 1px solid var(--gi-line);
  background: linear-gradient(180deg, #101522, #0c1019);
  padding: 14px;
}
.gi-wh-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.gi-wh-head .gi-detail-h {
  margin: 0;
}
.gi-wh-list {
  flex: 1 1 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gi-wh-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 9px;
  border: 1px solid var(--gi-line2);
  border-left: 3px solid var(--gi-gold-dim);
  background: linear-gradient(180deg, #161c2c, #12162180);
  color: var(--gi-text);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s, opacity 0.15s;
}
.gi-wh-item:hover:not(.blocked) {
  border-color: var(--gi-gold-dim);
  transform: translateX(2px);
}
.gi-wh-item.blocked {
  cursor: not-allowed;
}
.gi-wh-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.gi-wh-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--gi-gold2);
}
.gi-wh-count {
  color: var(--gi-gold);
  font-size: 11.5px;
  margin-left: 4px;
}
.gi-wh-sub {
  font-size: 11px;
  line-height: 1.4;
}
.gi-wh-rar {
  flex-shrink: 0;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid var(--gi-line2);
}
.gi-wh-rar.r-common {
  color: var(--gi-text);
}
.gi-wh-rar.r-rare {
  color: var(--gi-gold);
  border-color: var(--gi-gold-dim);
}
.gi-wh-rar.r-epic {
  color: #ffd27a;
  border-color: rgba(224, 179, 87, 0.6);
}
.gi-detail-sec {
  padding: 12px 0;
  border-bottom: 1px solid rgba(42, 50, 70, 0.5);
}
.gi-detail-sec-last {
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
/* 已穿戴（左下） */
.gi-equip-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gi-equip-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-panel2);
  font-size: 12px;
  color: var(--gi-text);
  font-family: inherit;
}
.gi-equip-slot.empty {
  justify-content: center;
  border-style: dashed;
  color: var(--gi-dim);
  background: transparent;
}
.gi-equip-slot.worn {
  cursor: pointer;
  border-color: var(--gi-gold-dim);
  background: rgba(224, 179, 87, 0.06);
  transition: border-color 0.15s;
}
.gi-equip-slot.worn:hover {
  border-color: var(--gi-red);
}
.gi-equip-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
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
.gi-equip-return {
  flex-shrink: 0;
  color: var(--gi-dim);
  font-size: 15px;
}
.gi-equip-notice {
  margin: 0 0 10px;
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
