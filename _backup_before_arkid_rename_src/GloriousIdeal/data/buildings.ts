/**
 * buildings.ts —— 卡兹戴尔营地建筑（策划案「卡兹戴尔」）
 *
 * 每个建筑可升级（耗源石碇，各等级额度不同——额度未定，以 0 占位并标 TODO）。
 * 部分建筑初始为「废弃」，需先修建。
 */

export type BuildingId = "military" | "babel" | "courier" | "barracks" | "merchant" | "graveyard" | "camel";

export interface BuildingDef {
	id: BuildingId;
	name: string;
	/** 初始等级（废弃用特殊态表示：-1） */
	initLevel: number;
	maxLevel: number;
	/** 每级升级费用（index=目标等级-1），TODO 未定，占位 0 */
	cost: number[];
	desc: string;
}

export const BUILDINGS: BuildingDef[] = [
	{
		id: "military",
		name: "军事委员会",
		initLevel: -1,
		maxLevel: 5,
		cost: [0, 0, 0, 0, 0],
		desc: "初始为废弃状态。修建完成后每天团结度+5；执行任务的角色压力增长+20%。",
	},
	{
		id: "babel",
		name: "巴别塔",
		initLevel: -1,
		maxLevel: 5,
		cost: [0, 0, 0, 0, 0],
		desc: "初始为废弃状态。修建完成后每天团结度+1；执行任务的角色压力增长-1%。",
	},
	{
		id: "courier",
		name: "天灾信使",
		initLevel: 1,
		maxLevel: 5,
		cost: [0, 0, 0, 0, 0],
		desc: "初始 1 级，可招募干员（免费）进入队伍。1 级可出现 4 名候选人（从将池抽取，不会抽到已招募干员）。",
	},
	{
		id: "barracks",
		name: "卡兹戴尔军营",
		initLevel: 1,
		maxLevel: 3,
		cost: [0, 0],
		desc: "提供招募干员上限：1 级 8 人，每升一级 +2 人，最高 3 级。",
	},
	{
		id: "merchant",
		name: "砍诺特（商人）",
		initLevel: 1,
		maxLevel: 5,
		cost: [0, 0, 0, 0, 0],
		desc: "初始可刷新 0 次；售卖装备（强化战斗力）；初始售 10 件商品；每级 +1 次每日刷新与 5% 折扣。",
	},
	{
		id: "graveyard",
		name: "墓园",
		initLevel: 0,
		maxLevel: 0,
		cost: [],
		desc: "不可升级。展示永久死亡的干员。",
	},
	{
		id: "camel",
		name: "驼兽运输队",
		initLevel: 0,
		maxLevel: 8,
		cost: [0, 0, 0, 0, 0, 0, 0, 0],
		desc: "初始 0 级，最高 8 级；每升一级在下副本时额外提供一个背包栏位。",
	},
];

export const getBuilding = (id: BuildingId): BuildingDef => BUILDINGS.find(b => b.id === id)!;

/** 各建筑在每日结算时的被动效果（由 campaign 调用，-1 表示废弃不生效） */
export const buildingDailyEffect = (id: BuildingId, level: number): { unity?: number; stressMod?: number } => {
	if (level < 1) return {};
	switch (id) {
		case "military":
			return { unity: 5, stressMod: 0.2 };
		case "babel":
			return { unity: 1, stressMod: -0.01 };
		default:
			return {};
	}
};
