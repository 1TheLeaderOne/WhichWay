/**
 * shop.ts —— 开局商店数据（策划案「局内资源：开局可以在商店处购买下列物品」+「砍诺特（商人）」）
 *
 * 口径（用户 2026-09-22 确认）：
 *  - 开局商店用**局外源石碇 `originite`** 结算（与局内“源石碇”物品是两回事，后者是任务 loot，结算才兑换）。
 *  - 消耗品固定货架（可反复买）；装备为商人每日**库存**（从注册表随机 roll），受等级影响：
 *      库存件数固定 10；每日刷新次数 = 商人等级-1；折扣 = 5% ×（商人等级-1）。
 *  - 兑换物（合成玉/源石碎片/含杂质/至纯）与局内货币（源石碇）属 loot/兑换，不在货架。
 */

import { type ItemId } from "./items.js";
import { RARITY_ORDER, allEquipment, type EquipmentDef } from "./equipment.js";

/** 商人一次上架的装备件数（策划案：初始售卖 10 件商品） */
export const MERCHANT_STOCK_SIZE = 10;

/** 可购消耗品：{ 物品 id, 局外源石碇单价 } */
export const CONSUMABLE_PRICES: Array<{ id: ItemId; price: number }> = [
	{ id: "provision", price: 5 }, // 粮草
	{ id: "bandage", price: 8 }, // 绷带
	{ id: "antidote", price: 8 }, // 解毒剂
	{ id: "cloak", price: 10 }, // 匿踪装置
	{ id: "supply", price: 12 }, // 后勤小队
];

/** 商人在给定等级下的折扣（0~1）：每级 +5% */
export const merchantDiscount = (merchantLevel: number): number => Math.max(0, 0.05 * (Math.max(1, merchantLevel) - 1));

/** 商人每日可刷新次数：每级 +1（1 级为 0） */
export const merchantDailyRefresh = (merchantLevel: number): number => Math.max(0, Math.max(1, merchantLevel) - 1);

/** 装备折后价（向上取整到整数源石碇，保证最低 1） */
export const discountedPrice = (base: number, discount: number): number => Math.max(1, Math.round(base * (1 - discount)));

/**
 * roll 一份商人库存：从装备注册表随机抽 MERCHANT_STOCK_SIZE 件（不重复）。
 * 池不足时全给。为让“刷新”有意义，注册表件数应 > 库存数。
 */
export function rollMerchantStock(): string[] {
	const ids = allEquipment().map(e => e.id);
	const bag = [...ids];
	for (let i = bag.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[bag[i], bag[j]] = [bag[j], bag[i]];
	}
	return bag.slice(0, Math.min(MERCHANT_STOCK_SIZE, ids.length));
}

/** 供 UI 展示：把库存 id 列表映射回定义（跳过未注册项） */
export const resolveStock = (stock: string[]): EquipmentDef[] =>
	stock
		.map(id => allEquipment().find(e => e.id === id))
		.filter((e): e is EquipmentDef => !!e)
		.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity] || a.price - b.price);
