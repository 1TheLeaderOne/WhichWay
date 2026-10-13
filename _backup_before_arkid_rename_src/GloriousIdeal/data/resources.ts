/**
 * resources.ts —— 局外资源与团结度（策划案「资源/局外资源」）
 *
 * 数值都集中在配置文件里，便于后续调平衡。改动只改这里 + campaign 的结算逻辑。
 */

/** 初始源石碇（金钱），用于购买物资 / 培养角色 / 升级建筑 */
export const START_ORIGINITE = 100;

/** 团结度：初始 / 上限 / 失败阈值 */
export const UNITY = {
	init: 80,
	max: 200,
	/** 抵达 0 即游戏失败 */
	failAt: 0,
} as const;

/**
 * 团结度阶梯修正：按当前团结度区间给出增长修正倍率。
 * 注意原案中 51-100 也写 +5%（看似笔误，保留原样，TODO 确认）
 * @see 设计案：团结度区间（低于50/51-100/101-120/121-150/151-190/191-200）
 */
export const UNITY_TIERS: Array<{ min: number; max: number; growMod: number; buff: null }> = [
	{ min: 0, max: 50, growMod: 0.1, buff: null },
	{ min: 51, max: 100, growMod: 0.05, buff: null },
	{ min: 101, max: 120, growMod: -0.1, buff: null },
	{ min: 121, max: 150, growMod: -0.5, buff: null },
	{ min: 151, max: 190, growMod: -0.8, buff: null },
	{ min: 191, max: 200, growMod: -0.95, buff: null },
];

/**
 * 团结度增减条目（固定值，倍率修正见 UNITY_TIERS.growMod）
 * TODO：是否所有增减都套阶梯修正、还是只有“增加”套，需与作者确认
 */
export const UNITY_EVENTS = {
	/** 干员永久死亡 -5/人 */
	operatorPermanentDeath: -5,
	/** 干员进入折磨状态 -1/人 */
	operatorAgony: -1,
	/** 团结度高于100 -1/天 */
	unityAbove100PerDay: -1,
	/** 任务失败 -5/次 */
	missionFail: -5,
	/** 度过一天 -1/天 */
	passDay: -1,
	/** 无法提供粮草 -0.2/次 */
	starvation: -0.2,
	/** 任务成功 +1.5/次 */
	missionSuccess: 1.5,
} as const;

/** 每名干员携带/消耗：压力相关见 operators.ts */
export const STRESS = { init: 0, max: 200, agonyAt: 100 } as const;

/**
 * 障碍节点（策划案「通路障碍」）：铲除不给任何奖励，只是开路。
 * 两种手段 + 放弃（放弃后该节点依旧不可通行）。
 */
export const OBSTACLE = {
	/** 手段一：消耗 1 个后勤小队 */
	supplyCost: 1,
	/** 手段二：在场每名干员失去 1 点体力 */
	hpLoss: 1,
	/** 手段二：在场每名干员压力 +12 */
	stress: 12,
} as const;

/** 宝箱节点：开启消耗 1 个后勤小队（放弃则不消耗、无奖励） */
export const TREASURE = { supplyCost: 1 } as const;

/**
 * 粮草 / 行动经济（策划案「局内资源」，行动计数阈值 ACTION_TO_RATION 见 dungeon.ts）。
 * 缺粮惩罚与主动投喂冷却集中在此，便于后续调平衡。
 */
export const PROVISION = {
	/** 主动投喂（1 粮草→1 干员 +1 体力）两次之间的最小行动间隔 */
	feedGap: 3,
	/** 缺粮：压力 +20 */
	starveStress: 20,
	/** 缺粮：流失 1 点体力 */
	starveHpLoss: 1,
} as const;

/** 模式最长天数：超过视为失败（设计案：100 天内通关凯尔希军） */
export const MAX_DAY = 100;
