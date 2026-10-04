<script setup lang="ts">
/**
 * battle/RunSummary.vue —— 远征结算页（撤退 / 完成讨伐后进入）
 * 只读预览：干员压力·经验·体力前后变化 + 本次带回（或丢弃）的战利品 + 随身消耗品回收。
 * 点击「确认」才调用 store.confirmSettlement() 落库（入账/丢弃/回收/任务结算都在那时发生）。
 */
import { computed } from "vue";
import { view } from "../../store.js";
import * as store from "../../store.js";
import { CONSUMABLE_RECYCLE_PRICE } from "../../../data/loot.js";
import { getItem, type ItemId } from "../../../data/items.js";
import { getEquipment, RARITY_LABEL } from "../../../data/equipment.js";
import { opName } from "../common/format.js";
import OperatorAvatar from "../common/OperatorAvatar.vue";
import StatusBar from "../common/StatusBar.vue";

interface OpRow {
	id: string;
	dead: boolean;
	hpFrom: number;
	hpTo: number;
	stressFrom: number;
	stressTo: number;
	expFrom: number;
	expTo: number;
	levelFrom: number;
	levelTo: number;
}

const run = computed(() => view.ctrl?.data.run ?? null);
const win = computed(() => run.value?.settleWin === true);

const rows = computed<OpRow[]>(() => {
	const r = run.value;
	const ctrl = view.ctrl;
	if (!r || !ctrl) return [];
	return Object.keys(r.snapshot).map(id => {
		const s = r.snapshot[id];
		const op = ctrl.data.roster.find(o => o.id === id);
		return {
			id,
			dead: !!op?.dead,
			hpFrom: s.hp,
			hpTo: r.hp[id] ?? 0,
			stressFrom: s.stress,
			stressTo: op?.stress ?? s.stress,
			expFrom: s.exp,
			expTo: op?.exp ?? s.exp,
			levelFrom: s.level,
			levelTo: op?.level ?? s.level,
		};
	});
});

const preview = computed(() => view.ctrl?.settlePreview() ?? null);
const carried = computed(() => preview.value?.carried ?? false);

/** 战利品条目：物品名 × 数量；局内源石碇单独标注（带回即 1:1 变现为局外源石碇） */
const lootItems = computed(() => {
	const loot = preview.value?.loot;
	if (!loot) return [];
	return Object.entries(loot.items)
		.filter(([, n]) => n > 0)
		.map(([id, n]) => ({ id, name: id === "originite" ? "源石碇（直接变现）" : (getItem(id as ItemId)?.name ?? id), count: n }));
});
const lootEquips = computed(() => (preview.value?.loot.equips ?? []).map(id => ({ id, name: getEquipment(id)?.name ?? id, rarity: getEquipment(id)?.rarity })));
const lootMoney = computed(() => preview.value?.loot.originite ?? 0);
const recycle = computed(() => preview.value?.recycle ?? []);
const hasLoot = computed(() => lootItems.value.length > 0 || lootEquips.value.length > 0 || lootMoney.value > 0);
/** 出发前买的补给一只没剩（全用光/全丢）时，回收区显示一句说明 */
const nothingToRecycle = computed(() => carried.value && recycle.value.length === 0);

const confirm = () => store.confirmSettlement();
</script>

<template>
  <div class="gi-page gi-settle" v-if="run">
    <StatusBar />

    <!-- 任务头卡 -->
    <header class="gi-settle-head" :class="win ? 'is-win' : 'is-lose'">
      <h2 class="gi-h2">{{ win ? '讨伐成功' : '撤退结算' }}</h2>
      <p class="gi-sub dim">
        {{ win ? '主将已击败，队伍带着这一路的收获返回营地。' : '本次行动以讨伐失败计：收获按能否带回决定去留。' }}
      </p>
    </header>

    <!-- 全员阵亡：整趟收获留在副本里 -->
    <p v-if="!carried" class="gi-settle-wipe">☠ 小队全员阵亡 —— 战利品与随身补给全部遗失，无法带回营地。</p>

    <!-- ============ 干员状态变化（压力 / 经验 / 体力） ============ -->
    <section class="gi-settle-sec">
      <h3 class="gi-h3">队伍状态</h3>
      <table class="gi-settle-table">
        <thead>
          <tr>
            <th>干员</th>
            <th>体力</th>
            <th>压力</th>
            <th>经验</th>
            <th>等级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in rows" :key="o.id" :class="{ dead: o.dead }">
            <td class="gi-settle-who">
              <OperatorAvatar :id="o.id" shape="rounded" :dead="o.dead" class="gi-settle-av" />
              <span>{{ opName(o.id) }}</span>
              <span v-if="o.dead" class="gi-badge dead">☠ 阵亡</span>
            </td>
            <td>
              <span class="dim">{{ o.hpFrom }}</span> → <b :class="o.hpTo <= 0 ? 'bad' : o.hpTo < o.hpFrom ? 'warn' : 'ok'">{{ o.dead ? 0 : o.hpTo }}</b>
            </td>
            <td>
              <span class="dim">{{ o.stressFrom }}</span>
              → <b :class="o.stressTo > o.stressFrom ? 'bad' : o.stressTo < o.stressFrom ? 'ok' : ''">{{ o.stressTo }}</b>
              <span v-if="o.stressTo !== o.stressFrom" :class="o.stressTo > o.stressFrom ? 'bad' : 'ok'">({{ o.stressTo > o.stressFrom ? '+' : '' }}{{ o.stressTo - o.stressFrom }})</span>
            </td>
            <td>
              <span class="dim">{{ o.expFrom }}</span> → <b>{{ o.expTo }}</b>
              <span v-if="o.expTo !== o.expFrom" class="ok">(+{{ o.expTo - o.expFrom }})</span>
            </td>
            <td>
              <span v-if="o.levelTo !== o.levelFrom" class="gi-badge lv">{{ o.levelFrom }} → {{ o.levelTo }}</span>
              <span v-else class="dim">{{ o.levelTo }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="gi-empty dim">本次没有带队干员。</p>
    </section>

    <!-- ============ 战利品 ============ -->
    <section class="gi-settle-sec">
      <h3 class="gi-h3">{{ carried ? '带回物资' : '遗落的物资' }}</h3>
      <p v-if="!hasLoot" class="gi-empty dim">这一路没有拿到任何物资。</p>
      <div v-else class="gi-settle-loot">
        <div v-for="it in lootItems" :key="it.id" class="gi-settle-lootrow" :class="{ lost: !carried }">
          <span class="gi-settle-lootname">{{ it.name }}</span>
          <b>×{{ it.count }}</b>
        </div>
        <div v-for="q in lootEquips" :key="q.id" class="gi-settle-lootrow" :class="{ lost: !carried }">
          <span class="gi-settle-lootname">{{ q.name }}</span>
          <span v-if="q.rarity" class="gi-badge" :class="q.rarity === 'epic' || q.rarity === 'legendary' ? 'gold' : q.rarity === 'rare' ? 'virtue' : 'dead'">{{ RARITY_LABEL[q.rarity] }}</span>
          <b>装备</b>
        </div>
        <div v-if="lootMoney > 0" class="gi-settle-lootrow" :class="{ lost: !carried }">
          <span class="gi-settle-lootname">💠 源石碇</span>
          <b>+{{ lootMoney }}</b>
        </div>
      </div>
      <p v-if="!carried" class="gi-hint dim">全员阵亡时物资一律丢弃，以上条目不会入账。</p>
    </section>

    <!-- ============ 补给回收：非战前商店一律按 2 源石碇回收 ============ -->
    <section class="gi-settle-sec" v-if="carried">
      <h3 class="gi-h3">随身补给回收</h3>
      <p class="gi-hint dim">出发前购买的消耗品按每个 {{ CONSUMABLE_RECYCLE_PRICE }} 源石碇回收（仅战前补给站支持原价出售）。</p>
      <div v-if="recycle.length" class="gi-settle-loot">
        <div v-for="c in recycle" :key="c.id" class="gi-settle-lootrow">
          <span class="gi-settle-lootname">{{ c.name }}</span>
          <span class="dim">×{{ c.count }}</span>
          <b>💠 {{ c.count * CONSUMABLE_RECYCLE_PRICE }}</b>
        </div>
        <div class="gi-settle-lootrow total">
          <span class="gi-settle-lootname">回收合计</span>
          <b>💠 {{ preview?.refund ?? 0 }}</b>
        </div>
      </div>
      <p v-else-if="nothingToRecycle" class="gi-empty dim">背包里的出发补给已全部用完，无可回收项。</p>
    </section>

    <footer class="gi-settle-foot">
      <button class="gi-btn gi-btn-primary gi-btn-lg" @click="confirm">确认返回营地 →</button>
    </footer>
  </div>
</template>

<style scoped>
.gi-settle {
  width: min(860px, 100%);
}
.gi-settle-head {
  margin: 18px 0 14px;
  padding: 14px 16px;
  border-radius: var(--gi-radius);
  border: 1px solid var(--gi-line);
}
.gi-settle-head.is-win {
  background: radial-gradient(320px 100px at 15% 0%, rgba(111, 206, 143, 0.14), transparent 70%), var(--gi-panel);
}
.gi-settle-head.is-lose {
  background: radial-gradient(320px 100px at 15% 0%, rgba(224, 106, 94, 0.14), transparent 70%), var(--gi-panel);
}
.gi-settle-wipe {
  display: block;
  margin: 0 0 14px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(224, 106, 94, 0.55);
  background: rgba(224, 106, 94, 0.1);
  color: var(--gi-red);
  font-size: 13px;
}
.gi-settle-sec {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 14px 16px;
  margin-bottom: 14px;
}
.gi-settle-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}
.gi-settle-table th {
  text-align: left;
  color: var(--gi-dim);
  font-weight: 500;
  padding: 4px 8px;
  border-bottom: 1px solid var(--gi-line);
}
.gi-settle-table td {
  padding: 6px 8px;
  border-bottom: 1px solid rgba(42, 49, 69, 0.6);
}
.gi-settle-table tr.dead td {
  opacity: 0.75;
}
.gi-settle-who {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gi-settle-av {
  --gi-av-size: 30px;
}
.gi-settle-table .ok {
  color: var(--gi-green);
}
.gi-settle-table .warn {
  color: var(--gi-orange);
}
.gi-settle-table .bad,
.gi-settle-loot .bad {
  color: var(--gi-red);
}
.gi-settle-loot {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}
.gi-settle-lootrow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--gi-bg1);
  border: 1px solid var(--gi-line);
  font-size: 13px;
}
.gi-settle-lootrow.lost {
  border-style: dashed;
  color: var(--gi-dim);
  text-decoration: line-through;
}
.gi-settle-lootrow.total {
  border-color: var(--gi-gold-dim);
  background: rgba(224, 179, 87, 0.08);
}
.gi-settle-lootname {
  flex: 1 1 auto;
  min-width: 0;
}
.gi-hint {
  margin: 8px 0 0;
  font-size: 11.5px;
}
.gi-settle-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>
