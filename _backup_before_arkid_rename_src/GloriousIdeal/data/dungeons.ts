/**
 * dungeons.ts —— 副本与难度（策划案「游戏流程/五大副本」）
 *
 * 副本图（驻扎点/通路）运行时按 dungeon.ts 生成；这里只放静态配置。
 */

export type Difficulty = "recon" | "squad" | "main";
export type MissionGoal = "explore" | "clear" | "boss";

export interface DungeonDef {
	/** 英文 id（用于 storage key / 图标） */
	id: string;
	name: string;
	/** 是否为特殊副本（凯尔希军，解锁条件特殊） */
	isSpecial?: boolean;
	desc: string;
}

/** 五大副本（顺序 = 策划案原文） */
export const DUNGEONS: DungeonDef[] = [
	{ id: "kelsey", name: "凯尔希军", isSpecial: true, desc: "特殊副本：100 天内通关即胜利" },
	{ id: "victoria", name: "维多利亚公爵联军", desc: "" },
	{ id: "kazimierz", name: "卡西米尔商业联合军", desc: "" },
	{ id: "gaul", name: "高卢联军", desc: "" },
	{ id: "terra", name: "泰拉联合志愿军", desc: "" },
];

/**
 * 难度参数（策划案）：
 *  - 需要副本经验解锁；击败对应 boss 可解锁更高难度
 *  - 通关获得副本经验 / 驻扎点数
 */
export const DIFFICULTY: Record<Difficulty, { needExp: number; needBoss?: boolean; gainExp: number; outposts: number; name: string }> = {
	recon: { needExp: 0, gainExp: 5, outposts: 8, name: "侦查" },
	squad: { needExp: 10, needBoss: true, gainExp: 10, outposts: 12, name: "小队" },
	main: { needExp: 50, needBoss: true, gainExp: 25, outposts: 18, name: "主力" },
};

/** 每个副本的副本经验上限 */
export const DUNGEON_EXP_CAP = 100;

/**
 * 特殊副本（凯尔希军）的解锁条件：
 *  - 侦查：其余副本副本经验达到 10 解锁
 *  - 小队：其余副本副本经验均达到 50 解锁
 *  - 主力：其余副本副本经验均达到 100 解锁
 */
export const SPECIAL_UNLOCK: Record<Difficulty, number> = { recon: 10, squad: 50, main: 100 };

export const MISSION_GOALS: Record<MissionGoal, { name: string; desc: string }> = {
	explore: { name: "绘图", desc: "探索该副本 80% 的驻扎点" },
	clear: { name: "清扫", desc: "杀死驻扎点内的所有敌军" },
	boss: { name: "击败boss", desc: "杀死 boss（boss 只在驻扎点出现）" },
};

export const getDungeon = (id: string): DungeonDef => DUNGEONS.find(d => d.id === id)!;
