/**
 * dungeon.ts —— 副本探索图（策划案「副本流程」）
 *
 * 副本 = 驻扎点(outpost) + 通路(path)。每条通路由 1~5 个通路节点组成；
 * 每经过一个通路/驻扎点算一次行动。驻扎点可能遭遇敌人；boss 只在驻扎点。
 *
 * 本模块只负责“图”的生成与行动计数；遭遇/战斗在 startBattle 的 TODO 处接入标准对垒。
 */

import { game } from "noname";
import { DIFFICULTY, Difficulty } from "./data/dungeons.js";

export type NodeKind = "outpost" | "path";

export interface DungeonNode {
	/** 全局编号 */
	index: number;
	kind: NodeKind;
	/** 驻扎点类型占位：normal | elite | boss | treasure(宝箱) | obstacle(障碍) */
	event?: "normal" | "elite" | "boss" | "treasure" | "obstacle";
	/** 本节点是否已有敌人（清扫目标） */
	hasEnemy?: boolean;
	/** 通往的邻居 index 列表（无向） */
	neighbors: number[];
	/** 是否已被探索/清扫 */
	explored?: boolean;
	cleared?: boolean;
}

export interface DungeonLayout {
	dungeonId: string;
	difficulty: Difficulty;
	nodes: DungeonNode[];
	/** 起始驻扎点 */
	entry: number;
}

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * 生成一个副本布局：
 *  - 先把 outposts 个驻扎点按“链 + 随机捷径”连成主干；
 *  - 每条相邻驻扎点之间的通路插入 1~5 个通路节点；
 *  - boss 出现在最远端驻扎点（TODO：具体哪只 boss 由敌人配置表给出）。
 */
export function generateDungeon(dungeonId: string, difficulty: Difficulty): DungeonLayout {
	const cfg = DIFFICULTY[difficulty];
	const outposts = cfg.outposts;

	const nodes: DungeonNode[] = [];
	const mk = (kind: NodeKind, extra?: Partial<DungeonNode>): DungeonNode => {
		const n: DungeonNode = { index: nodes.length, kind, neighbors: [], ...extra };
		nodes.push(n);
		return n;
	};
	const link = (a: DungeonNode, b: DungeonNode) => {
		a.neighbors.push(b.index);
		b.neighbors.push(a.index);
	};

	// 主干驻扎点
	const opList: DungeonNode[] = [];
	for (let i = 0; i < outposts; i++) opList.push(mk("outpost", { event: i === 0 ? "normal" : i === outposts - 1 ? "boss" : "normal", hasEnemy: true }));

	// 驻扎点之间插通路节点（1~5 个），并连成一段
	const bridge = (a: DungeonNode, b: DungeonNode) => {
		let prev = a;
		const seg = randInt(1, 5);
		for (let s = 0; s < seg; s++) {
			const node = mk("path", { event: Math.random() < 0.3 ? "treasure" : undefined });
			link(prev, node);
			prev = node;
		}
		link(prev, b);
	};

	for (let i = 0; i < outposts - 1; i++) bridge(opList[i], opList[i + 1]);
	// 少量捷径，让图有分支感
	for (let i = 0; i < Math.floor(outposts / 4); i++) {
		const a = opList[randInt(0, outposts - 3)];
		const b = opList[randInt(a.index + 1, outposts - 1)];
		if (a !== b && !a.neighbors.includes(b.index)) bridge(a, b);
	}

	return { dungeonId, difficulty, nodes, entry: 0 };
}

/** 行动计数器：每 10 次行动消耗 1 粮草（实际扣减在战役层处理） */
export const ACTION_TO_RATION = 10;

/** 任务目标结算辅助：绘图 = 探索 >= outposts*0.8 */
export const exploreGoalRatio = 0.8;

/** 占位：BOSS 战 / 遭遇战拉起标准对垒（TODO 实现点，返回是否胜利） */
export async function startBattle(layout: DungeonLayout, nodeIndex: number, party: string[]): Promise<boolean> {
	console.warn("[GloriousIdeal] startBattle 尚未接入标准对垒战斗，此处占位返回随机结果", { layout, nodeIndex, party });
	// TODO
	//  1) 用 party 的干员 id 建玩家阵营（game.addPlayers / createCharacter）
	//  2) 按副本难度生成敌人阵营（WhichWay 干员池 or 敌人模板）
	//  3) 体力跨战斗保留、手牌每场重置 —— 在副本实例上做 HP/压力持久
	await game.delay(500);
	return Math.random() > 0.4;
}
