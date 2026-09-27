<script setup lang="ts">
/**
 * camp/ShopView.vue —— 商店（两种入口，同一组件）
 *  · 营地「砍诺特」(phase=shop)：只卖装备（每日随机库存，可刷新）。穿戴在干员详情完成。
 *  · 战前补给站 (phase=supply)：选定讨伐后、进入副本前，只卖消耗品；底部「返回选派 / 出发进入副本」。
 */
import { computed, ref } from "vue";
import { view, CONFIG } from "../../store.js";
import * as store from "../../store.js";
import { ITEMS, getItem } from "../../../data/items.js";
import { CONSUMABLE_PRICES } from "../../../data/shop.js";
import { getEquipment, RARITY_LABEL } from "../../../data/equipment.js";
import { getDungeon } from "../../../data/dungeons.js";
import { opName } from "../common/format.js";
import StatusBar from "../common/StatusBar.vue";

const notice = ref("");

/** 战前补给 vs 营地装备商人 */
const isSupply = computed(() => view.phase === "supply");

const originite = () => Math.floor(view.ctrl?.data.originite ?? 0);
const freeSlots = () => view.ctrl?.freeBackpackSlots() ?? 0;
const merchantLv = () => view.ctrl?.merchantLevel() ?? 1;
const refreshLeft = () => view.ctrl?.data.shop.refreshLeft ?? 0;

/** 待出发讨伐摘要（战前补给页顶部展示） */
const pending = computed(() => {
	const pd = view.pendingDispatch;
	if (!pd) return null;
	const dungeon = getDungeon(pd.dungeonId);
	const diff = CONFIG.DIFFICULTY[pd.difficulty];
	return { name: dungeon?.name ?? pd.dungeonId, difficulty: diff?.name ?? pd.difficulty, party: pd.party.map(opName).join("、") };
});

/** 消耗品货架：定价值 + 当前持有量 + 可否购买 */
const consumables = computed(() => {
	const inv = view.ctrl?.data.inventory ?? {};
	return CONSUMABLE_PRICES.map(entry => {
		const def = getItem(entry.id);
		const have = inv[entry.id] ?? 0;
		const isnew = have === 0;
		const full = have >= def.maxStack;
		const poor = originite() < entry.price;
		const noBag = isnew && freeSlots() <= 0;
		return { id: entry.id, name: def.name, desc: def.desc, price: entry.price, have, maxStack: def.maxStack, disabled: full || poor || noBag, reason: full ? `堆叠已满 ${def.maxStack}` : poor ? "源石碇不足" : noBag ? "背包已满" : "" };
	});
});

/** 装备库存：按原始 stock 顺序（下标须与 purchaseEquipment(stockIndex) 对齐，不能重排） */
const stock = computed(() => {
	const s = view.ctrl?.data.shop.stock ?? [];
	return s.map((id, index) => {
		const def = getEquipment(id);
		const price = view.ctrl ? view.ctrl.equipPrice(id) : 0;
		const poor = originite() < price;
		const noBag = freeSlots() <= 0;
		return { index, id, name: def?.name ?? id, desc: def?.desc ?? "", rarity: def?.rarity ?? "common", price, base: def?.price ?? price, disabled: poor || noBag, reason: poor ? "源石碇不足" : noBag ? "背包已满" : "" };
	});
});

/** 背包内容：消耗品（含数量）+ 装备实例，逐格展示 */
const bagSlots = computed(() => {
	const total = view.ctrl?.backpackSlots() ?? 8;
	const cells: Array<{ key: string; name: string; sub: string; kind: "consumable" | "equip" }> = [];
	const inv = view.ctrl?.data.inventory ?? {};
	for (const d of ITEMS) {
		const n = inv[d.id] ?? 0;
		if (n > 0) cells.push({ key: `c_${d.id}`, name: d.name, sub: `×${n}`, kind: "consumable" });
	}
	(view.ctrl?.data.ownedEquips ?? []).forEach((id, i) => {
		const def = getEquipment(id);
		cells.push({ key: `e_${id}_${i}`, name: def?.name ?? id, sub: def ? RARITY_LABEL[def.rarity] : "", kind: "equip" });
	});
	const used = cells.length;
	for (let i = used; i < total; i++) cells.push({ key: `empty_${i}`, name: "", sub: "", kind: "consumable" });
	return { cells, used, total };
});

const show = (r: { ok: boolean; reason?: string }) => {
	notice.value = r.ok ? "" : r.reason ?? "无法购买";
};
const buy = (id: Parameters<typeof store.buyConsumable>[0]) => show(store.buyConsumable(id, 1));
const buyEquip = (i: number) => show(store.buyEquipment(i));
const doRefresh = () => show(store.refreshShop());
const depart = () => store.goDungeon();
</script>

<template>
  <div class="gi-page gi-shop">
    <StatusBar />

    <div class="gi-shop-head">
      <div>
        <h2 v-if="isSupply" class="gi-h2">🛒 战前补给站</h2>
        <h2 v-else class="gi-h2">🏪 砍诺特 · 装备商人</h2>
        <p v-if="isSupply" class="gi-sub dim">出发前用源石碇为小队备好消耗品。粮草、绷带等可在副本内使用。</p>
        <p v-else class="gi-sub dim">用源石碇换取装备。库存每日更换，可消耗次数刷新；购买后到「干员详情 → 装备」穿戴。</p>
      </div>
      <div class="gi-shop-meta">
        <span class="gi-chip" title="局外源石碇余额">💠 {{ originite() }}</span>
        <span v-if="!isSupply" class="gi-chip" title="商人等级：影响折扣与每日刷新次数">商人 Lv{{ merchantLv() }}</span>
        <span class="gi-chip" :title="`背包 ${bagSlots.used}/${bagSlots.total}（基础 8 + 驼兽等级）`">
          🎒 {{ bagSlots.used }}/{{ bagSlots.total }}
        </span>
        <button v-if="!isSupply" class="gi-btn gi-btn-ghost" @click="store.goCamp()">← 返回营地</button>
      </div>
    </div>

    <!-- 战前补给：讨伐目标摘要 -->
    <div v-if="isSupply && pending" class="gi-supply-target">
      <span class="gi-chip">🎯 {{ pending.name }} · {{ pending.difficulty }}</span>
      <span class="gi-supply-party dim">出战：{{ pending.party }}</span>
    </div>

    <!-- 营地：装备库存工具条 -->
    <div v-if="!isSupply" class="gi-shop-tabs">
      <span class="gi-badge lv">今日库存</span>
      <span class="dim">剩 {{ refreshLeft() }} 次刷新</span>
      <button class="gi-btn gi-btn-sm gi-btn-outline" :disabled="refreshLeft() <= 0" @click="doRefresh">🎲 刷新库存</button>
    </div>

    <p v-if="notice" class="gi-shop-notice">{{ notice }}</p>

    <!-- 战前补给：消耗品货架 -->
    <div v-if="isSupply" class="gi-goods">
      <div v-for="g in consumables" :key="g.id" class="gi-good">
        <div class="gi-good-top">
          <span class="gi-good-name">{{ g.name }}</span>
          <span class="gi-good-own dim">持有 {{ g.have }}/{{ g.maxStack }}</span>
        </div>
        <p class="gi-good-desc dim">{{ g.desc }}</p>
        <div class="gi-good-foot">
          <span class="gi-price">💠 {{ g.price }}</span>
          <button class="gi-btn gi-btn-primary gi-btn-sm" :disabled="g.disabled" :title="g.reason" @click="buy(g.id)">购买</button>
        </div>
      </div>
    </div>

    <!-- 营地：装备库存 -->
    <div v-else class="gi-goods">
      <p v-if="!stock.length" class="gi-empty dim">今日库存已售罄，明天再来。</p>
      <div v-for="g in stock" :key="g.index" class="gi-good" :class="'rarity-' + g.rarity">
        <div class="gi-good-top">
          <span class="gi-good-name">{{ g.name }}</span>
          <span class="gi-badge" :class="g.rarity === 'epic' ? 'gold' : g.rarity === 'rare' ? 'virtue' : 'dead'">{{ RARITY_LABEL[g.rarity] }}</span>
        </div>
        <p class="gi-good-desc dim">{{ g.desc }}</p>
        <div class="gi-good-foot">
          <span class="gi-price">
            <s v-if="g.price < g.base" class="dim">💠 {{ g.base }}</s> 💠 {{ g.price }}
          </span>
          <button class="gi-btn gi-btn-primary gi-btn-sm" :disabled="g.disabled" :title="g.reason" @click="buyEquip(g.index)">购买</button>
        </div>
      </div>
    </div>

    <!-- 背包 -->
    <section class="gi-bag">
      <h3 class="gi-bag-title">🎒 背包 <span class="dim">{{ bagSlots.used }}/{{ bagSlots.total }}</span></h3>
      <div class="gi-bag-grid">
        <div v-for="c in bagSlots.cells" :key="c.key" class="gi-bag-cell" :class="[c.kind, { blank: !c.name }]">
          <template v-if="c.name">
            <span class="gi-bag-name">{{ c.name }}</span>
            <span class="gi-bag-sub dim">{{ c.sub }}</span>
          </template>
          <span v-else class="gi-bag-empty">·</span>
        </div>
      </div>
      <p class="gi-bag-note dim">每件装备与每类消耗品各占一格；消耗品在副本内使用，装备请到干员详情穿戴。</p>
    </section>

    <!-- 战前补给：出发 / 返回选派 -->
    <div v-if="isSupply" class="gi-supply-foot">
      <button class="gi-btn gi-btn-ghost" @click="store.backToDispatch()">← 返回选派</button>
      <button class="gi-btn gi-btn-primary" @click="depart">出发进入副本 →</button>
    </div>
  </div>
</template>

<style scoped>
.gi-shop-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 8px 0 16px;
}
.gi-shop-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.gi-supply-target {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 0 0 14px;
  font-size: 13px;
}
.gi-supply-party {
  font-size: 12.5px;
}
.gi-shop-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  font-size: 12.5px;
}
.gi-shop-notice {
  margin: 0 0 12px;
  font-size: 12.5px;
  color: var(--gi-red);
}
.gi-goods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.gi-good {
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 12px 13px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gi-good.rarity-rare {
  border-color: rgba(224, 179, 87, 0.35);
}
.gi-good.rarity-epic {
  border-color: rgba(224, 179, 87, 0.6);
  box-shadow: 0 0 0 1px rgba(224, 179, 87, 0.15) inset;
}
.gi-good-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.gi-good-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--gi-text);
}
.gi-good-own {
  font-size: 11.5px;
  white-space: nowrap;
}
.gi-good-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  min-height: 34px;
}
.gi-good-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gi-price {
  font-size: 13px;
  color: var(--gi-gold);
  font-variant-numeric: tabular-nums;
}
.gi-price s {
  font-size: 11px;
  margin-right: 4px;
}
/* ---------- 背包 ---------- */
.gi-bag {
  margin-top: 26px;
  padding-top: 16px;
  border-top: 1px solid var(--gi-line);
}
.gi-bag-title {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--gi-gold);
  letter-spacing: 1px;
}
.gi-bag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px;
}
.gi-bag-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 58px;
  padding: 8px 6px;
  border-radius: 8px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-panel2);
  text-align: center;
}
.gi-bag-cell.equip {
  border-color: rgba(224, 179, 87, 0.4);
}
.gi-bag-cell.blank {
  border-style: dashed;
  background: transparent;
  color: var(--gi-line2);
}
.gi-bag-name {
  font-size: 12px;
  color: var(--gi-text);
  line-height: 1.3;
}
.gi-bag-sub {
  font-size: 11px;
}
.gi-bag-empty {
  color: var(--gi-line2);
  font-size: 18px;
}
.gi-bag-note {
  margin: 10px 0 0;
  font-size: 11.5px;
}
/* ---------- 战前补给底栏 ---------- */
.gi-supply-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid var(--gi-line);
}
</style>
