/**
 * campaign.ts —— 战役核心状态（单局流程的全部数据与推进规则）
 *
 * 结构：CampaignState（纯数据） + CampaignController（推进/结算逻辑）。
 * UI 只读状态、调用 controller，不直接改字段。
 *
 * TODO 路线（按策划案）：
 *  1. 战斗结算接入前：dispatch 只做占位结算（随机成功/失败），接口在 dungeon.ts 已留好。
 *  2. 永久死亡/折磨/美德结算：等标准对垒战斗可跑后，在 battleResult 里按击杀数计压力。
 *  3. 商店/培养/升级的具体数值表见 data/*.ts，全部是占位 0，待平衡。
 */

import { lib, game } from "noname";
import { BUILDINGS, BuildingId, buildingDailyEffect } from "../data/buildings.js";
import { UNITY, UNITY_EVENTS, UNITY_TIERS, MAX_DAY, STRESS } from "../data/resources.js";
import { OPERATOR_LEVELS, AGONY, BARRACKS_CAPACITY, rollAgonyOutcome, VirtueId } from "../data/operators.js";
import { ITEMS, ItemId } from "../data/items.js";
import { DUNGEONS, DUNGEON_EXP_CAP, Difficulty } from "../data/dungeons.js";

/** 模式 storage key（lib.storage 全局里按模式分命名空间） */
export const SAVE_KEY = "gloriousIdeal_campaign";

export interface OperatorState {
	/** 干员 id（WhichWay 角色名） */
	id: string;
	level: number;
	exp: number;
	/** 压力 0-200 */
	stress: number;
	/** 是否折磨状态 */
	agony: boolean;
	/** 压力抵 100 时触发过的美德（触发即清空压力）；null = 无 */
	virtue: VirtueId | null;
	/** 是否永久死亡（进墓园） */
	dead: boolean;
}

export interface CampaignData {
	day: number;
	unity: number;
	/** 源石碇（局外） */
	originite: number;
	buildings: Record<BuildingId, number>;
	roster: OperatorState[];
	/** 招募候选（未领走前固定） */
	candidates: string[];
	/** 局内背包：物品 id → 数量 */
	inventory: Record<string, number>;
	/** 各副本进度：经验与已击败 boss 的难度 */
	dungeonProgress: Record<string, { exp: number; bossSlain: Difficulty[] }>;
	/** 驼兽等级带来的额外背包栏 */
	backpackBonus: number;
	/** 副本胜/负次数（任务成功 +1.5 团结的依据） */
	missionResult: { win: number; fail: number };
	/** 是否已通关凯尔希军 / 是否失败 */
	win: boolean;
	lose: boolean;
	/** 阶段标记：由 UI 驱动 */
	phase: "camp" | "dungeon";
}

export const createInitialCampaign = (recruits: string[]): CampaignData => {
	const buildings = {} as Record<BuildingId, number>;
	for (const b of BUILDINGS) buildings[b.id] = b.initLevel;
	const roster: OperatorState[] = recruits.map(id => ({
		id,
		level: 1,
		exp: 0,
		stress: STRESS.init,
		agony: false,
		virtue: null,
		dead: false,
	}));
	return {
		day: 1,
		unity: UNITY.init,
		originite: 100,
		buildings,
		roster,
		candidates: [],
		inventory: {},
		dungeonProgress: Object.fromEntries(DUNGEONS.map(d => [d.id, { exp: 0, bossSlain: [] }])),
		backpackBonus: 0,
		missionResult: { win: 0, fail: 0 },
		win: false,
		lose: false,
		phase: "camp",
	};
};

export class CampaignController {
	data: CampaignData;

	constructor(data: CampaignData) {
		this.data = data;
	}

	// ---------- 读取 ----------

	liveOperators(): OperatorState[] {
		return this.data.roster.filter(o => !o.dead);
	}

	unityGrowMod(): number {
		const tier = UNITY_TIERS.find(t => this.data.unity >= t.min && this.data.unity <= t.max);
		return tier ? tier.growMod : 0;
	}

	backpackSlots(): number {
		return 8 + this.data.backpackBonus;
	}

	// ---------- 团结度 ----------

	/** 应用一次团结度事件（自动叠加区间修正后再上下限截断） */
	applyUnityEvent(key: keyof typeof UNITY_EVENTS | "starvation") {
		const raw = UNITY_EVENTS[key];
		if (raw == null) return;
		let delta = raw;
		if (delta > 0) {
			// TODO 修正仅作用于“增长”还是增减都套，见 design doc 注释
			delta *= 1 + this.unityGrowMod();
		}
		this.data.unity = Math.max(0, Math.min(UNITY.max, this.data.unity + delta));
		this.checkFail();
	}

	// ---------- 建筑 ----------

	upgradeBuilding(id: BuildingId) {
		const def = BUILDINGS.find(b => b.id === id)!;
		const lv = this.data.buildings[id];
		if (lv < 0) {
			// 废弃建筑：第一次修建
			if (this.data.originite < def.cost[0]) return { ok: false, reason: "源石碇不足" };
			this.data.originite -= def.cost[0];
			this.data.buildings[id] = 1;
			return { ok: true as const };
		}
		if (lv >= def.maxLevel) return { ok: false, reason: "已满级" };
		const cost = def.cost[lv]; // index = 目标等级 - 1
		if (this.data.originite < cost) return { ok: false, reason: "源石碇不足" };
		this.data.originite -= cost;
		this.data.buildings[id] = lv + 1;
		return { ok: true as const };
	}

	/** 每日结算：建筑被动效果 + 干员压力修正参考 */
	dailyBuildingEffects(): { unity: number } {
		let unity = 0;
		for (const b of BUILDINGS) {
			const lv = this.data.buildings[b.id];
			const eff = buildingDailyEffect(b.id, lv);
			if (eff.unity) unity += eff.unity;
		}
		this.data.unity = Math.max(0, Math.min(UNITY.max, this.data.unity + unity));
		return { unity };
	}

	// ---------- 干员 ----------

	/** 招募（从将池抽 4 名候选人，不会抽到已在队伍/已死亡的干员） */
	rollCandidates(pool: string[]): string[] {
		const taken = new Set(this.data.roster.map(o => o.id));
		const left = pool.filter(id => !taken.has(id));
		// 洗牌取前 N
		const n = Math.min(4, left.length);
		for (let i = left.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[left[i], left[j]] = [left[j], left[i]];
		}
		this.data.candidates = left.slice(0, n);
		return this.data.candidates;
	}

	acceptCandidate(id: string): { ok: boolean; reason?: string } {
		if (!this.data.candidates.includes(id)) return { ok: false, reason: "不是候选干员" };
		const cap = BARRACKS_CAPACITY[this.data.buildings.barracks] ?? 8;
		if (this.liveOperators().length >= cap) return { ok: false, reason: "军营名额已满" };
		this.data.roster.push({ id, level: 1, exp: 0, stress: 0, agony: false, virtue: null, dead: false });
		this.data.candidates = this.data.candidates.filter(c => c !== id);
		return { ok: true };
	}

	/** 压力增加（按等级/建筑/折磨修正；>=100 判定美德/折磨；>=200 永久死亡） */
	addStress(op: OperatorState, raw: number) {
		if (op.dead || op.agony) return;
		let delta = raw;
		if (op.level >= 2) delta *= 0.9; // 2 级：受到压力 -10%
		if (op.agony) delta *= 1 + 0.2; // 折磨状态压力增长 +20%（占用）
		// TODO：巴别塔/军事委员会的修正作用于「执行任务的角色」，需要在派遣结算处按建筑等级折算
		op.stress = Math.min(STRESS.max, op.stress + delta);
		if (op.stress >= AGONY.deathAt) {
			op.dead = true;
			this.applyUnityEvent("operatorPermanentDeath");
		} else if (op.stress >= AGONY.stressAt) {
			const outcome = rollAgonyOutcome();
			if (outcome === "agony") {
				op.agony = true;
				this.applyUnityEvent("operatorAgony");
			} else {
				op.virtue = outcome;
				op.stress = 0; // 美德立刻清空压力
			}
		}
	}

	addExp(op: OperatorState, exp: number) {
		op.exp += exp;
		for (const cfg of OPERATOR_LEVELS) {
			if (op.exp >= cfg.exp && op.level < cfg.level) op.level = cfg.level;
		}
	}

	markOperatorDead(id: string) {
		const op = this.roster(id);
		if (op && !op.dead) {
			op.dead = true;
			this.applyUnityEvent("operatorPermanentDeath");
		}
	}

	// ---------- 背包 ----------

	addItem(id: ItemId, count: number) {
		const def = ITEMS.find(i => i.id === id)!;
		this.data.inventory[id] = Math.min(def.maxStack, (this.data.inventory[id] ?? 0) + count);
	}

	consumeItem(id: ItemId, count = 1): boolean {
		if ((this.data.inventory[id] ?? 0) < count) return false;
		this.data.inventory[id] -= count;
		return true;
	}

	// ---------- 天/流程 ----------

	/**
	 * 进入下一天：每日结算 + 一天结束。
	 * TODO 与战斗阶段的关系：战斗结束（无论成败）进入第二天；
	 *      撤退全员阵亡则不带回物资（回营地时丢弃，规则实现点）
	 */
	advanceDay() {
		this.data.day++;
		this.dailyBuildingEffects();
		// 度过一天 -1（100 以上额外 -1）
		this.applyUnityEvent("passDay");
		if (this.data.unity > 100) this.applyUnityEvent("unityAbove100PerDay");
		this.data.phase = "camp";
		this.checkFail();
		this.checkDayLimit();
	}

	/** 任务结算（临时占位：真实结果接入战斗后替换） */
	settleMission(win: boolean) {
		if (win) {
			this.applyUnityEvent("missionSuccess");
			this.data.missionResult.win++;
		} else {
			this.applyUnityEvent("missionFail");
			this.data.missionResult.fail++;
		}
		// 结算背包兑换物
		for (const def of ITEMS) {
			const n = this.data.inventory[def.id] ?? 0;
			if (def.convertAtSettle && n > 0) {
				this.data.originite += n * def.convertAtSettle;
				this.data.inventory[def.id] = 0;
			}
		}
		this.advanceDay();
	}

	/** 添加副本经验（上限 100，用于解锁更高难度） */
	addDungeonExp(dungeonId: string, exp: number) {
		const p = this.data.dungeonProgress[dungeonId];
		if (p) p.exp = Math.min(DUNGEON_EXP_CAP, p.exp + exp);
	}

	/** 通关凯尔希军 → 胜利 */
	winGame() {
		this.data.win = true;
		this.data.phase = "camp";
	}

	checkFail() {
		if (this.data.unity <= UNITY.failAt && !this.data.win) {
			this.data.lose = true;
		}
	}

	checkDayLimit() {
		if (this.data.day > MAX_DAY && !this.data.win) {
			// TODO：超出 100 天是否直接判负，与设计者确认（可能只是“越快越好”）
			this.data.lose = true;
		}
	}

	private roster(id: string): OperatorState | undefined {
		return this.data.roster.find(o => o.id === id);
	}
}

// ---------- 存档 ----------
// 引擎按模式隔离存储：game.save(key, value) 写入当前模式（lib.config.mode）的 lib.storage，
// 并在 DB（data 表，key=mode）持久化；离开模式/下次进入自动可读。

export const saveCampaign = (data: CampaignData) => {
	try {
		game.save(SAVE_KEY, data);
	} catch (e) {
		console.error("[GloriousIdeal] 存档失败", e);
	}
};

export const loadCampaign = (): CampaignData | null => {
	try {
		const storage: Record<string, unknown> = (lib.storage as Record<string, unknown>) || {};
		return (storage[SAVE_KEY] as CampaignData) || null;
	} catch {
		return null;
	}
};

export const clearCampaignSave = () => {
	try {
		game.save(SAVE_KEY, undefined);
	} catch {
		/* ignore */
	}
};
