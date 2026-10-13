/**
 * loot.ts —— 战利品掉落（策划案「掉落规则」+ 用户 2026-10-02 给定的装备口径）
 *
 * 装备走**两段式**判定（用户口径，务必照此实现）：
 *  1. 先 roll「这场/这个节点掉不掉装备」：基础概率 EQUIP_DROP_BASE_CHANCE = 10%，
 *     增量走 addEquipDropChance()（给后续设计留的开口：技能/建筑/宝箱加成等都调它）。
 *  2. **命中之后**才按难度抽品级，再从该品级的装备里随机取一件：
 *     侦查 普通/罕见/史诗/传奇 = 0.8/0.2/0/0；小队 = 0.6/0.3/0.1/0；主力 = 0.4/0.3/0.2/0.1。
 *
 * 其余（消耗品包 / 兑换物 / 货币）沿用策划案数值：消耗品 50%、货币 30%（10~20 源石碇），
 * 兑换物品级分布与难度系数属占位，标注待平衡。
 *
 * 入账口径（用户确认）：掉落一律**当场 roll 进 run.loot 暂存**，撤退/完成时由战役层结算入账；
 * 全员阵亡则整包丢弃。回收价（非战前商店的出售）统一 CONSUMABLE_RECYCLE_PRICE。
 */

import { type Difficulty } from "./dungeons.js";
import { type EquipRarity, equipsOfRarity } from "./equipment.js";
import { getItem, type ItemId } from "./items.js";

/** 装备掉落的「是否掉落」基础概率（用户给定：10%） */
export const EQUIP_DROP_BASE_CHANCE = 0.1;

/** 概率增量累加器：由 addEquipDropChance 维护，rollEquipDrop 读取 */
let equipDropBonus = 0;

/**
 * 增加装备掉落概率（正数提高、负数降低），返回调整后的累计增量。
 * 这是给后续设计留的唯一开口：任何「+x% 装备掉率」都调它，不要改基础常量。
 */
export function addEquipDropChance(delta: number): number {
	equipDropBonus += delta;
	return equipDropBonus;
}

/** 当前累计的装备掉率增量（只读） */
export const equipDropChanceBonus = (): number => equipDropBonus;

/** 复位增量（新开一局战役时调用，避免跨局残留） */
export const resetEquipDropChance = (): void => {
	equipDropBonus = 0;
};

/** 实际生效的装备掉落概率 = 基础 + 增量，夹在 0~1 */
export function equipDropChance(): number {
	return Math.min(1, Math.max(0, EQUIP_DROP_BASE_CHANCE + equipDropBonus));
}

/** 各难度下的装备品级权重（用户给定，顺序：普通/罕见/史诗/传奇） */
export const RARITY_WEIGHTS: Record<Difficulty, Record<EquipRarity, number>> = {
	recon: { common: 0.8, rare: 0.2, epic: 0, legendary: 0 },
	squad: { common: 0.6, rare: 0.3, epic: 0.1, legendary: 0 },
	main: { common: 0.4, rare: 0.3, epic: 0.2, legendary: 0.1 },
};

/** 结算时消耗品回收价（非战前商店的出售一律按此价；战前补给站仍原价回购） */
export const CONSUMABLE_RECYCLE_PRICE = 2;

/** 开箱（宝箱节点）在通用装备掉率之上的额外加成 */
export const TREASURE_EQUIP_BONUS = 0.15;

/** 消耗品掉落池（策划案：与战前商店同一批消耗品） */
const CONSUMABLE_POOL: ItemId[] = ["provision", "bandage", "antidote", "cloak", "supply"];

/** 兑换物权重分布（占位，待平衡：难度越高越偏向高阶兑换物） */
const TOKEN_WEIGHTS: Record<Difficulty, Array<{ id: ItemId; w: number }>> = {
	recon: [
		{ id: "synthetic_jade", w: 0.75 },
		{ id: "originium_shard", w: 0.25 },
	],
	squad: [
		{ id: "synthetic_jade", w: 0.45 },
		{ id: "originium_shard", w: 0.35 },
		{ id: "originium_impure", w: 0.2 },
	],
	main: [
		{ id: "synthetic_jade", w: 0.2 },
		{ id: "originium_shard", w: 0.35 },
		{ id: "originium_impure", w: 0.3 },
		{ id: "originium_pure", w: 0.15 },
	],
};

/** 货币难度系数（占位，待平衡）：基础 10~20 局内源石碇 × 系数 */
const CURRENCY_MULT: Record<Difficulty, number> = { recon: 1, squad: 1.5, main: 2 };

/** 一次掉落的载体：消耗品/兑换物/局内货币 + 装备 + 局外源石碇 */
export interface LootBundle {
	/** 入背包的物品：物品 id → 数量（消耗品/兑换物/局内源石碇） */
	items: Record<string, number>;
	/** 入全局装备仓库的装备 id（可重复） */
	equips: string[];
	/** 直接入账的局外源石碇（商人/任务奖励口径，不走背包） */
	originite: number;
}

export const emptyLoot = (): LootBundle => ({ items: {}, equips: [], originite: 0 });

export const lootIsEmpty = (l: LootBundle): boolean => l.originite <= 0 && !l.equips.length && !Object.values(l.items).some(n => n > 0);

/** 把 src 并入 dst（就地累加），返回 dst 便于链式使用 */
export function mergeLoot(dst: LootBundle, src: LootBundle): LootBundle {
	for (const [id, n] of Object.entries(src.items)) {
		if (n > 0) dst.items[id] = (dst.items[id] ?? 0) + n;
	}
	dst.equips.push(...src.equips);
	dst.originite += src.originite;
	return dst;
}

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** 按权重抽一项（权重和为 0 时返回 undefined） */
function pickWeighted<T>(list: Array<{ item: T; w: number }>): T | undefined {
	const total = list.reduce((s, e) => s + e.w, 0);
	if (total <= 0) return undefined;
	let r = Math.random() * total;
	for (const e of list) {
		r -= e.w;
		if (r <= 0) return e.item;
	}
	return list[list.length - 1]?.item;
}

/** 第 2 段：已判定掉装备后，按难度权重抽品级，再取该品级的一件装备。品级池空则逐级降级。 */
export function rollEquipByRarity(difficulty: Difficulty): string | undefined {
	const weights = RARITY_WEIGHTS[difficulty];
	const order: EquipRarity[] = ["legendary", "epic", "rare", "common"];
	const rarities = order.filter(r => (weights[r] ?? 0) > 0);
	const first = pickWeighted(rarities.map(r => ({ item: r, w: weights[r] })));
	if (!first) return undefined;
	// 高品级还没填表时降级取最近的可掉档，避免「判定掉装备却掉出空气」
	for (const r of order.slice(order.indexOf(first))) {
		const pool = equipsOfRarity(r);
		if (pool.length) return pick(pool).id;
	}
	return undefined;
}

/**
 * 第 1 段 + 第 2 段：一次完整的装备掉落判定。
 * @param extraBonus 本次判定的临时额外加成（如宝箱节点），不污染全局增量
 */
export function rollEquipDrop(difficulty: Difficulty, extraBonus = 0): string[] {
	const chance = Math.min(1, Math.max(0, EQUIP_DROP_BASE_CHANCE + equipDropBonus + extraBonus));
	if (Math.random() >= chance) return [];
	const id = rollEquipByRarity(difficulty);
	return id ? [id] : [];
}

/** 消耗品包：随机 1~2 件（数量随难度上浮，占位数值） */
function rollConsumablePack(difficulty: Difficulty, dst: LootBundle) {
	const kinds = difficulty === "main" ? 2 : 1;
	for (let i = 0; i < kinds; i++) {
		const id = pick(CONSUMABLE_POOL);
		dst.items[id] = (dst.items[id] ?? 0) + randInt(1, difficulty === "recon" ? 2 : 3);
	}
}

/** 兑换物：按难度分布抽一类 1 个 */
function rollToken(difficulty: Difficulty, dst: LootBundle) {
	const id = pickWeighted(TOKEN_WEIGHTS[difficulty].map(e => ({ item: e.id, w: e.w })));
	if (id) dst.items[id] = (dst.items[id] ?? 0) + 1;
}

/** 货币：10~20 局内源石碇 × 难度系数 */
function rollCurrency(difficulty: Difficulty, dst: LootBundle) {
	dst.items.originite = (dst.items.originite ?? 0) + Math.round(randInt(10, 20) * CURRENCY_MULT[difficulty]);
}

/**
 * 一场战斗的掉落（策划案「掉落规则」+ 用户装备口径）。
 * 胜利才 roll：50% 消耗品包、35% 兑换物、30% 货币，装备走 rollEquipDrop。
 * 失败不掉任何东西（暗黑地牢式：败局只带走人）。
 */
export function rollBattleRewards(win: boolean, difficulty: Difficulty): LootBundle {
	const loot = emptyLoot();
	if (!win) return loot;
	if (Math.random() < 0.5) rollConsumablePack(difficulty, loot);
	if (Math.random() < 0.35) rollToken(difficulty, loot);
	if (Math.random() < 0.3) rollCurrency(difficulty, loot);
	loot.equips.push(...rollEquipDrop(difficulty));
	return loot;
}

/**
 * 宝箱节点的掉落（消耗 1 后勤小队后 roll）：
 * 必出 1 件消耗品，另按 50%/40% 追加分支，装备掉率有额外加成（TREASURE_EQUIP_BONUS）。
 */
export function rollTreasureLoot(difficulty: Difficulty): LootBundle {
	const loot = emptyLoot();
	rollConsumablePack(difficulty, loot);
	if (Math.random() < 0.5) rollToken(difficulty, loot);
	if (Math.random() < 0.4) rollCurrency(difficulty, loot);
	loot.equips.push(...rollEquipDrop(difficulty, TREASURE_EQUIP_BONUS));
	return loot;
}

/** 供 UI 展示：把 items 映射成 { id, name, count } 列表（跳过未注册 id 与 0 数量） */
export const lootItemList = (loot: LootBundle): Array<{ id: ItemId; name: string; count: number }> =>
	Object.entries(loot.items)
		.filter(([, n]) => n > 0)
		.map(([id, n]) => ({ id: id as ItemId, name: getItem(id as ItemId)?.name ?? id, count: n }));
