/**
 * items.ts —— 局内可携带物品/宝物（策划案「局内资源」）
 *
 * 8 个格子（每类占一格）。背包在战役中持久，战斗（副本）结算按规则增减。
 */

export type ItemId =
	| "provision" // 粮草
	| "bandage" // 绷带
	| "antidote" // 解毒剂
	| "cloak" // 匿踪装置
	| "supply" // 后勤小队
	| "originite" // 源石碇（局内用，与局外金钱同名但区分）
	| "synthetic_jade" // 合成玉
	| "originium_shard" // 源石碎片
	| "originium_impure" // 含杂质的源石
	| "originium_pure"; // 至纯源石

export interface ItemDef {
	id: ItemId;
	name: string;
	/** 可堆叠上限 */
	maxStack: number;
	/** 任务结算时自动兑换源石碇（无则不换） */
	convertAtSettle?: number;
	desc: string;
}

export const ITEMS: ItemDef[] = [
	{ id: "provision", name: "粮草", maxStack: 9, desc: "每行动 10 次消耗 1 点（缺粮→压力+20/团结-0.2/流失1体力）；可主动用 1 点给 1 名干员回 1 体力（每 3 次行动 1 次）" },
	{ id: "bandage", name: "绷带", maxStack: 3, desc: "消除流血状态" },
	{ id: "antidote", name: "解毒剂", maxStack: 3, desc: "消除中毒状态" },
	{ id: "cloak", name: "匿踪装置", maxStack: 3, desc: "消除标记状态" },
	{ id: "supply", name: "后勤小队", maxStack: 6, desc: "用于铲除障碍和拾取宝箱" },
	{ id: "originite", name: "源石碇", maxStack: 30, desc: "局内货币" },
	{ id: "synthetic_jade", name: "合成玉", maxStack: 10, convertAtSettle: 3, desc: "任务结算时每个换 3 源石碇" },
	{ id: "originium_shard", name: "源石碎片", maxStack: 8, convertAtSettle: 5, desc: "任务结算时每个换 5 源石碇" },
	{ id: "originium_impure", name: "含杂质的源石", maxStack: 5, convertAtSettle: 10, desc: "任务结算时每个换 10 源石碇" },
	{ id: "originium_pure", name: "至纯源石", maxStack: 2, convertAtSettle: 50, desc: "任务结算时每个换 50 源石碇" },
];

export const INVENTORY_SLOTS_BASE = 8;
export const getItem = (id: ItemId): ItemDef => ITEMS.find(i => i.id === id)!;
