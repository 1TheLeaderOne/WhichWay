/**
 * monsters.ts —— 副本怪物池 / 怪物组（战斗系统数据层）
 *
 * 策划：每个副本一个专属怪物池；踩到怪物节点时从池中随机抽一个「怪物组」开打。
 * 怪物组里的每个成员可各自设定初始手牌 / 初始装备 / 血量；未设定则走默认规则：
 *   - 血量 / 体力上限：按武将面板（lib.character[id].hp / .maxHp）
 *   - 初始装备：空
 *   - 初始手牌：4 张（从牌堆摸）
 * 怪物池为空（或副本未配置）时：从全部武将里随机抽 3 名武将充当一个怪物组。
 *
 * 注：怪物组的具体编成属于平衡数据，暂以可留空的占位表提供，后续按策划填充。
 */

import { lib } from "noname";

/** 牌堆卡名（引擎 lib.card 的 key，如 "sha"/"shan"/"tao"…）；装备用其装备名 */
export type CardName = string;

/** 单个怪物成员 */
export interface MonsterDef {
	/** 武将 id（lib.character 的 key） */
	charId: string;
	/** 初始血量；留空则用武将面板 hp */
	hp?: number;
	/** 体力上限；留空则用武将面板 maxHp */
	maxHp?: number;
	/** 初始手牌卡名列表；留空则按默认摸 4 张 */
	hand?: CardName[];
	/** 初始装备卡名列表（进入装备栏）；留空则无装备 */
	equips?: CardName[];
}

/** 一个怪物组 = 若干怪物成员（作为敌方阵营上场） */
export type MonsterGroup = MonsterDef[];

/** 副本怪物池：某副本可选的所有怪物组 */
export type MonsterPool = MonsterGroup[];

/**
 * 各副本的怪物池（key = dungeons.ts 的 DungeonDef.id）。
 * 留空即触发「随机 3 武将」兜底。策划填表时往对应数组追加 MonsterGroup 即可。
 */
export const MONSTER_POOLS: Record<string, MonsterPool> = {
	// kelsey: [ [ { charId: "..." }, { charId: "...", hp: 3 } ], /* ... */ ],
};

/** 兜底/抽将时的默认开局手牌张数 */
export const DEFAULT_HAND_SIZE = 4;

/**
 * 随机敌人的取将池 = 「非驶舰之向干员」，即无名杀本体（及其它来源）的武将，排除全部 WhichWay 干员。
 * 策划案：我方干员来自驶舰之向（WhichWay）将池；故兜底随机敌人应改用本体武将，避免敌我都是同一批干员。
 * window.whichWaySave.hasChar(id) 为真即视为 WhichWay 干员，予以排除；隐藏位/占位也排除。
 * whichWaySave 尚未就绪时（异常兜底）退回「全部非隐藏本体武将」。
 */
export function getBaseEnemyPool(): string[] {
	let hasWWChar: ((id: string) => boolean) | null = null;
	try {
		const save = (window as unknown as { whichWaySave?: { hasChar?: (id: string) => boolean } }).whichWaySave;
		//@ts-ignore
		if (save && typeof save.hasChar === "function") hasWWChar = id => save.hasChar(id);
	} catch {
		/* whichWaySave 不可用：不排除，退化为全体非隐藏 */
	}
	try {
		return Object.keys(lib.character ?? {}).filter(id => {
			const c = (lib.character as Record<string, { hidden?: boolean }>)[id];
			if (!c || c.hidden) return false;
			if (hasWWChar && hasWWChar(id)) return false;
			return true;
		});
	} catch {
		return [];
	}
}

/**
 * 初始手牌张数（#2）：基础 4 张；干员达 3 级「游戏开始时摸一张牌」额外 +1。
 * 其余等级效果（4 级闪/杀、5 级护甲、6 级手牌上限）在战斗 gameStart 钩子内施加，不在此计。
 * @param level 干员等级（缺省按 1 级 = 无额外摸牌）
 */
export function getInitHandSize(_id: string, level = 1): number {
	return DEFAULT_HAND_SIZE + (level >= 3 ? 1 : 0);
}

/** 战斗奖励（#5）：源石碇 / 装备。数值未设计，暂返回空，仅留接口。 */
export interface BattleRewards {
	originite: number;
	equips: string[];
}

/** 结算一场战斗的奖励。目前留空——接入奖励表后按 win/dungeon 计算。 */
export function rollBattleRewards(_win: boolean, _dungeonId: string): BattleRewards {
	return { originite: 0, equips: [] };
}

/** 默认怪物组人数（池为空时随机抽的武将数） */
export const FALLBACK_GROUP_SIZE = 3;

/** 取某副本的怪物池（可能为空） */
export const getMonsterPool = (dungeonId: string): MonsterPool => MONSTER_POOLS[dungeonId] ?? [];

/**
 * 从副本怪物池随机抽取一个怪物组；池为空则随机抽取「非驶舰之向」本体武将。
 * @param dungeonId 副本 id
 * @param allChars  已废弃的旧参数：敌池现固定取本体武将（getBaseEnemyPool），不再使用 WhichWay 将池
 */
export function rollMonsterGroup(dungeonId: string, _allChars?: string[]): MonsterGroup {
	const pool = getMonsterPool(dungeonId);
	if (pool.length) {
		const group = pool[Math.floor(Math.random() * pool.length)];
		// 深拷贝一层，避免结算时污染模板数据
		return group.map(m => ({ ...m, hand: m.hand ? [...m.hand] : undefined, equips: m.equips ? [...m.equips] : undefined }));
	}
	return rollRandomGroup();
}

/**
 * 从本体（非驶舰之向）武将里随机抽 N 名组成一个怪物组（无任何自定义，全走默认规则）。
 * 敌池与友池解耦：我方干员来自 WhichWay，敌方随机一律取无名杀本体武将。
 */
export function rollRandomGroup(size = FALLBACK_GROUP_SIZE): MonsterGroup {
	const candidates = getBaseEnemyPool();
	const picked: MonsterGroup = [];
	const bag = [...candidates];
	for (let i = 0; i < size && bag.length; i++) {
		const j = Math.floor(Math.random() * bag.length);
		const [id] = bag.splice(j, 1);
		picked.push({ charId: id });
	}
	return picked;
}

/**
 * 武将「速度」——决定座位号（越快座位号越小）。
 * 速度系统尚未设计，此处仅留接口：目前所有武将返回同一默认值，座位号退化为随机排布。
 * TODO：接入真实速度后，改这里读取每个武将的速度值（如敏捷属性 / 面板字段）。
 */
export function getCharSpeed(_id: string): number {
	return 0;
}
