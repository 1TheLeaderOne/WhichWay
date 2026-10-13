/**
 * operators.ts —— 干员培养与压力/折磨/美德（策划案「角色（干员）」）
 */

/** 干员等级与升级经验、加成（策划案逐级原文） */
export const OPERATOR_LEVELS: Array<{ level: number; exp: number; desc: string }> = [
	{ level: 1, exp: 0, desc: "击杀敌人减少自身 3 点压力" },
	{ level: 2, exp: 10, desc: "受到的压力-10%，额外获得一个装备栏" },
	{ level: 3, exp: 25, desc: "游戏开始时，摸一张牌" },
	{ level: 4, exp: 45, desc: "游戏开始时，从牌堆获得一张【闪】和【杀】" },
	{ level: 5, exp: 70, desc: "游戏开始时，获得一点护甲值" },
	{ level: 6, exp: 100, desc: "手牌上限+1" },
];

/** 战斗中每击杀敌人减少的压力 */
export const KILL_STRESS_RELIEF = 3;

export const AGONY = {
	stressAt: 100,
	/** 压力抵 100 时：20% 美德 / 80% 折磨（实现见 rollAgonyOutcome） */
	virtueChance: 0.2,
	/** 压力上限 200 → 永久死亡；战斗死亡同样永久死亡 */
	deathAt: 200,
} as const;

/** 美德（触发即清空压力） */
export type VirtueId = "zhenfen" | "wuwei" | "zhuanzhu" | "yongmeng" | "jianding";
export interface VirtueDef {
	id: VirtueId;
	name: string;
	desc: string;
	/** TODO 具体实现占位：给出建议的引擎实现思路 */
	implement: string;
}
export const VIRTUES: VirtueDef[] = [
	{ id: "zhenfen", name: "振奋", desc: "出牌阶段结束时，令所有友方角色回复一点体力", implement: "trigger phaseEnd + recover" },
	{ id: "wuwei", name: "无畏", desc: "【杀】的使用次数+1", implement: "mod.attackRange? → 用 limitShan/额外次数 mod" },
	{ id: "zhuanzhu", name: "专注", desc: "出牌阶段使用的第一张【杀】无法被响应", implement: "firstSha + directHit" },
	{ id: "yongmeng", name: "勇猛", desc: "出牌阶段首次造成的伤害+1", implement: "damageBegin buff 一次" },
	{ id: "jianding", name: "坚定", desc: "所有友方角色压力-20且获得一点护甲", implement: "全员 stress-20 + armor +1" },
];

/** 折磨状态（进入后压力增长+20%，额外负面由对应逻辑处理） */
export const AGONY_TORTURE = {
	/** 出牌阶段结束时弃置区域内所有的牌 */
	discardOnPhaseEnd: true,
	/** 进入濒死状态时流失一点体力 */
	loseHpOnDying: true,
	/** 压力增长 +20% */
	stressGrowMod: 0.2,
} as const;

/** 招募名额：军营等级 → 最大可招募数（1 级 8 人，每级 +2，最高 3 级） */
export const BARRACKS_CAPACITY: Record<number, number> = { 1: 8, 2: 10, 3: 12 };

/** 天灾信使 1 级时的候选人数量 */
export const RECRUIT_CANDIDATE_COUNT = 4;

/**
 * 压力抵 100 的判定：20% 触发一种美德，80% 陷入折磨
 * 返回美德 id 或 'agony'
 */
export const rollAgonyOutcome = (): VirtueId | "agony" =>
	Math.random() < AGONY.virtueChance ? VIRTUES[Math.floor(Math.random() * VIRTUES.length)].id : "agony";
