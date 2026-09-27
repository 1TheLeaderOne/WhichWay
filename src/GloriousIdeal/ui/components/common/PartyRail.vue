<script setup lang="ts">
/**
 * common/PartyRail.vue —— 暗黑地牢 1 式右侧队伍栏（营地 / 副本复用）
 * 竖排卡片：立绘头像 + 金色名 + 压力格 +（副本内）体力；点击卡片打开干员详情面板。
 */
import { computed, ref } from "vue";
import { view, opMaxHp } from "../../store.js";
import * as store from "../../store.js";
import { opName } from "./format.js";
import OperatorAvatar from "./OperatorAvatar.vue";

const props = withDefaults(defineProps<{ ids: string[]; showHp?: boolean; allowFeed?: boolean }>(), { showHp: false, allowFeed: false });

interface PartyCard {
	id: string;
	level: number;
	exp: number;
	stress: number;
	dead: boolean;
	agony: boolean;
	hp: number;
	maxHp: number;
}

const run = () => view.ctrl?.data.run ?? null;
const provisions = () => view.ctrl?.data.inventory.provision ?? 0;
/** 主动投喂（1 粮草→体力+1）可用性判定 + 置灰原因 */
const feedState = (c: PartyCard): { ok: boolean; title: string } => {
	const r = run();
	if (!r) return { ok: false, title: "不在副本中" };
	if (c.dead) return { ok: false, title: "该干员已阵亡" };
	if (c.hp >= c.maxHp) return { ok: false, title: "体力已满" };
	if (provisions() < 1) return { ok: false, title: "没有粮草" };
	if (r.actions < r.feedReadyAt) return { ok: false, title: `投喂冷却中（还需 ${r.feedReadyAt - r.actions} 次行动）` };
	return { ok: true, title: "投喂：消耗 1 粮草，体力 +1" };
};
const onFeed = (id: string) => store.feedOperator(id);

const cards = computed<PartyCard[]>(() => {
	const roster = view.ctrl?.data.roster || [];
	return props.ids.map(id => {
		const o = roster.find(r => r.id === id);
		const maxHp = opMaxHp(id);
		return {
			id,
			level: o?.level ?? 1,
			exp: o?.exp ?? 0,
			stress: o?.stress ?? 0,
			dead: !!o?.dead,
			agony: !!o?.agony,
			hp: view.dungeonHp[id] ?? maxHp,
			maxHp,
		};
	});
});

/** 压力 0~200 → 10 格 */
const stressPips = (s: number) => Math.max(0, Math.min(10, Math.ceil(s / 20)));
/** 体力 → 心形（1 格 = 上限的 1/8，至少显示已损） */
const hpRatio = (c: PartyCard) => (c.maxHp > 0 ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : 0);

const listRef = ref<HTMLElement | null>(null);
const scroll = (dir: number) => listRef.value?.scrollBy({ top: dir * 150, behavior: "smooth" });
</script>

<template>
  <aside class="gi-party-rail">
    <button class="gi-rail-arrow up" title="上翻" @click="scroll(-1)">▲</button>
    <div class="gi-rail-head">小队</div>
    <div class="gi-rail-list" ref="listRef">
      <div
        v-for="c in cards"
        :key="c.id"
        class="gi-rail-card"
        :class="{ dead: c.dead, agony: c.agony }"
        title="点击查看干员详情"
        @click="store.openDetail(c.id)"
      >
        <OperatorAvatar :id="c.id" shape="rounded" :dead="c.dead" class="gi-rail-av" />
        <div class="gi-rail-info">
          <div class="gi-rail-name">{{ opName(c.id) }}</div>
          <div class="gi-rail-pips" :title="`压力 ${Math.round(c.stress)}/200`">
            <i v-for="k in 10" :key="k" :class="{ on: k <= stressPips(c.stress) }" />
          </div>
          <div v-if="showHp" class="gi-rail-hp" :title="`体力 ${c.hp}/${c.maxHp}`">
            <span class="gi-rail-hp-bar"><span class="gi-rail-hp-fill" :style="{ width: hpRatio(c) * 100 + '%' }" /></span>
            <span class="gi-rail-hp-num">{{ c.hp }}/{{ c.maxHp }}</span>
            <button
              v-if="allowFeed"
              class="gi-rail-feed"
              :class="{ ready: feedState(c).ok }"
              :disabled="!feedState(c).ok"
              :title="feedState(c).title"
              @click.stop="onFeed(c.id)"
            >
              🍞
            </button>
          </div>
          <div class="gi-rail-stats">
            <span class="gi-rail-lv">Lv {{ c.level }}</span>
            <span class="gi-rail-exp">✦ {{ c.exp }}</span>
          </div>
        </div>
      </div>
    </div>
    <button class="gi-rail-arrow down" title="下翻" @click="scroll(1)">▼</button>
  </aside>
</template>

<style scoped>
/* 固定在最右；#gi-layer .cls 特异性压过引擎 #gi-layer div{position:static}。 */
#gi-layer .gi-party-rail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 210px;
  display: flex;
  flex-direction: column;
  z-index: 8;
  background: linear-gradient(180deg, #0b0e17, #0a0d15);
  border-left: 1px solid var(--gi-line);
  box-shadow: -10px 0 26px rgba(0, 0, 0, 0.5);
}
.gi-rail-head {
  flex: 0 0 auto;
  text-align: center;
  font-size: 13px;
  letter-spacing: 6px;
  color: var(--gi-gold);
  padding: 14px 0 8px;
  border-bottom: 1px solid var(--gi-line);
  text-indent: 6px;
}
.gi-rail-arrow {
  flex: 0 0 auto;
  height: 26px;
  border: none;
  background: rgba(224, 179, 87, 0.06);
  color: var(--gi-gold-dim);
  font-size: 12px;
  cursor: pointer;
  line-height: 1;
  font-family: inherit;
}
.gi-rail-arrow:hover {
  background: rgba(224, 179, 87, 0.16);
  color: var(--gi-gold2);
}
.gi-rail-list {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 6px;
}
.gi-rail-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 8px;
  margin-bottom: 8px;
  background: linear-gradient(180deg, #161c2c, #12162180);
  border: 1px solid var(--gi-line);
  border-left: 3px solid var(--gi-gold-dim);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}
.gi-rail-card:hover {
  border-color: var(--gi-gold-dim);
  transform: translateX(-2px);
}
.gi-rail-card.agony {
  border-left-color: var(--gi-orange);
}
.gi-rail-card.dead {
  border-left-color: var(--gi-red);
  filter: saturate(0.4);
  opacity: 0.72;
}
.gi-rail-av {
  --gi-av-size: 52px;
}
.gi-rail-info {
  flex: 1 1 auto;
  min-width: 0;
}
.gi-rail-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--gi-gold2);
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gi-rail-pips {
  display: flex;
  gap: 2px;
  margin: 5px 0 4px;
}
.gi-rail-pips i {
  flex: 1 1 0;
  height: 5px;
  border-radius: 1px;
  background: #262d40;
}
.gi-rail-pips i.on {
  background: linear-gradient(180deg, var(--gi-red), #a5382f);
  box-shadow: 0 0 4px rgba(224, 106, 94, 0.5);
}
/* 副本体力条 */
.gi-rail-hp {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.gi-rail-hp-bar {
  flex: 1 1 auto;
  height: 6px;
  border-radius: 3px;
  background: #262d40;
  overflow: hidden;
}
.gi-rail-hp-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #6fce8f, #3f9d5f);
}
.gi-rail-hp-num {
  font-size: 10.5px;
  color: var(--gi-green);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* 投喂按钮（1 粮草→体力+1） */
.gi-rail-feed {
  flex: 0 0 auto;
  width: 22px;
  height: 20px;
  padding: 0;
  border: 1px solid var(--gi-line2);
  border-radius: 5px;
  background: var(--gi-bg1);
  font-size: 12px;
  line-height: 1;
  cursor: default;
  opacity: 0.45;
  filter: grayscale(0.6);
}
.gi-rail-feed.ready {
  opacity: 1;
  filter: none;
  border-color: var(--gi-gold-dim);
  background: rgba(224, 179, 87, 0.12);
  cursor: pointer;
}
.gi-rail-feed.ready:hover {
  background: rgba(224, 179, 87, 0.24);
}
.gi-rail-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}
.gi-rail-lv {
  color: var(--gi-text);
}
.gi-rail-exp {
  color: var(--gi-gold);
}
</style>
