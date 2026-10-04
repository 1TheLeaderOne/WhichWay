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

import { BUILDINGS, BuildingId, buildingDailyEffect } from "../data/buildings.js";
import { UNITY, UNITY_EVENTS, UNITY_TIERS, MAX_DAY, STRESS, PROVISION, OBSTACLE, TREASURE } from "../data/resources.js";
import { OPERATOR_LEVELS, AGONY, BARRACKS_CAPACITY, rollAgonyOutcome, KILL_STRESS_RELIEF, VirtueId } from "../data/operators.js";
import { ITEMS, ItemId, INVENTORY_SLOTS_BASE } from "../data/items.js";
import { getEquipment, type EquipStat } from "../data/equipment.js";
import { CONSUMABLE_PRICES, rollMerchantStock, merchantDiscount, merchantDailyRefresh, discountedPrice } from "../data/shop.js";
import { DUNGEONS, DIFFICULTY, DUNGEON_EXP_CAP, Difficulty, getDungeon } from "../data/dungeons.js";
import { CONSUMABLE_RECYCLE_PRICE, emptyLoot, lootIsEmpty, mergeLoot, resetEquipDropChance, rollBattleRewards, rollTreasureLoot, type LootBundle } from "../data/loot.js";
import { ACTION_TO_RATION, type DungeonLayout, type DungeonNode } from "../dungeon.js";

/** 存档 localStorage key（战役数据整体 JSON 存一份，不依赖引擎按模式隔离的 lib.storage） */
export const SAVE_KEY = "gloriousIdeal_campaign_v1";

/** 进副本时的干员状态快照：结算页用它展示「压力 / 经验 / 体力」的前后变化 */
export interface RunOpSnapshot {
	level: number;
	exp: number;
	stress: number;
	hp: number;
}

/**
 * 副本进行态：需要在「真实对局」离栈（game.switchMode → identity → 结算返回）后仍能恢复，
 * 故随 CampaignData 一起持久化，而非只留在内存 view 里。
 */
export interface DungeonRun {
	dungeonId: string;
	difficulty: Difficulty;
	layout: DungeonLayout;
	/** 当前所在节点 index */
	cur: number;
	/** 随队干员 id */
	party: string[];
	/** 干员当前体力（id→hp，副本内跨节点不重置） */
	hp: Record<string, number>;
	/** 我方各干员体力上限（id→maxHp，主动投喂回体力时封顶用） */
	maxHp: Record<string, number>;
	/** 已消耗行动数：每经过一个通路/驻扎点 +1 */
	actions: number;
	/** 下一次「投喂」所需达到的行动数（feedGap 冷却；actions >= 该值才可投喂） */
	feedReadyAt: number;
	/** 刚结束一场战斗、待结算返回的节点 index（null=无待处理战斗） */
	pendingBattle: number | null;
	/** 本次远征暂存的战利品：节点/战斗当场 roll 进来，撤退或完成时才入账 */
	loot: LootBundle;
	/** 进副本时的消耗品持有量快照：结算时其中「仍带在身上」的部分按回收价折算 */
	startConsumables: Record<string, number>;
	/** 进副本时的干员状态快照（id→快照），供结算页对比 */
	snapshot: Record<string, RunOpSnapshot>;
	/** 待结算：null=仍在探索；true/false=已判胜/判负，等玩家在结算页确认 */
	settleWin: boolean | null;
}

/** 一次远征结算的结果摘要（供结算页/提示展示） */
export interface RunSettlement {
	win: boolean;
	/** 是否把收获带回了营地（全员阵亡=false → 整包丢弃） */
	carried: boolean;
	/** 实际入账的战利品 */
	gained: LootBundle;
	/** 因背包满/全员阵亡而未能入账的条目 */
	lost: LootBundle;
	/** 按回收价折算的消耗品：件数与源石碇 */
	recycled: { count: number; originite: number };
}

/** 死因分类：战斗中被杀 / 意外（无明确来源）/ 压力爆炸 */
export type DeathCause = "combat" | "accident" | "stress";
/** 击杀者阵营：敌军 / 友军（死于友方之手）/ 自己（自杀） */
export type KillerFaction = "enemy" | "ally" | "self";

/** 干员死亡时冻结的档案（墓园展示用） */
export interface DeathInfo {
	cause: DeathCause;
	/** 死亡发生于第几天 */
	day: number;
	/** 死亡时所处副本 id（不在副本内则 null） */
	dungeonId: string | null;
	/** 死亡时等级快照 */
	level: number;
	/** 死亡时压力快照 */
	stress: number;
	/** 击杀者角色 id（combat 时有效；stress/accident 为 null） */
	killerId: string | null;
	killerFaction: KillerFaction | null;
}

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
	/** 死亡档案（仅 dead 时有值） */
	death?: DeathInfo;
	/** 装备栏上限（战役层个人槽）：初始 1，2 级 +1（见 addExp，后续手动加槽改这里） */
	maxEquipSlots: number;
	/** 已穿戴装备 id 列表（长度 <= maxEquipSlots；装备实例来自全局仓库 ownedEquips，不占局内背包） */
	equipped: string[];
}

/**
 * 商人（砍诺特）每日库存状态：随战役存档持久。
 * day != 当前 day 时按商人等级重 roll 库存并重置当日刷新次数（见 ensureShopToday）。
 */
export interface ShopState {
	/** 库存所属天数 */
	day: number;
	/** 今日剩余刷新次数 */
	refreshLeft: number;
	/** 当前上架的装备 id 列表 */
	stock: string[];
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
	/** 最近一次成功招募的天数：等于当前 day 表示「今天已招募过」→ 天灾信使不可再刷新候选 */
	recruitDay: number;
	/** 局内背包：物品 id → 数量（消耗品/兑换物，按类型各占 1 格） */
	inventory: Record<string, number>;
	/** 全局装备仓库：已拥有装备 id 列表（无上限、不占局内背包；可离散重复拥有） */
	ownedEquips: string[];
	/** 商人每日库存状态 */
	shop: ShopState;
	/** 各副本进度：经验与已击败 boss 的难度 */
	dungeonProgress: Record<string, { exp: number; bossSlain: Difficulty[] }>;
	/** 副本胜/负次数（任务成功 +1.5 团结的依据） */
	missionResult: { win: number; fail: number };
	/** 是否已通关凯尔希军 / 是否失败 */
	win: boolean;
	lose: boolean;
	/** 阶段标记：由 UI 驱动 */
	phase: "camp" | "dungeon";
	/** 副本进行态（进入副本时写入，撤离/失败清空）；跨真实对局持久化 */
	run: DungeonRun | null;
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
		maxEquipSlots: 1,
		equipped: [],
	}));
	return {
		day: 1,
		unity: UNITY.init,
		originite: 100,
		buildings,
		roster,
		candidates: [],
		recruitDay: 0,
		inventory: {},
		ownedEquips: [],
		shop: { day: 0, refreshLeft: 0, stock: [] },
		dungeonProgress: Object.fromEntries(DUNGEONS.map(d => [d.id, { exp: 0, bossSlain: [] }])),
		missionResult: { win: 0, fail: 0 },
		win: false,
		lose: false,
		phase: "camp",
		run: null,
	};
};

/**
 * 读档归一化：为旧版本存档补齐后加字段（装备/商店系统），避免 undefined 崩溃。
 * 只在加载边界调用一次；不影响新建战役。
 */
function normalizeCampaign(data: CampaignData): CampaignData {
	const d = data as CampaignData & { backpackBonus?: number };
	if (!Array.isArray(d.ownedEquips)) d.ownedEquips = [];
	if (!d.shop || typeof d.shop !== "object") d.shop = { day: 0, refreshLeft: 0, stock: [] };
	if (!Array.isArray(d.shop.stock)) d.shop.stock = [];
	if (typeof d.shop.day !== "number") d.shop.day = 0;
	if (typeof d.shop.refreshLeft !== "number") d.shop.refreshLeft = 0;
	if (typeof d.recruitDay !== "number") d.recruitDay = 0;
	if (Array.isArray(d.roster)) {
		for (const op of d.roster) {
			if (typeof op.maxEquipSlots !== "number") op.maxEquipSlots = op.level >= 2 ? 2 : 1;
			if (!Array.isArray(op.equipped)) op.equipped = [];
		}
	}
	// 进行态回填（Phase B 新增字段）：旧存档续跑副本时补齐，避免 undefined 崩溃
	if (d.run) {
		if (typeof d.run.actions !== "number") d.run.actions = 0;
		if (typeof d.run.feedReadyAt !== "number") d.run.feedReadyAt = 0;
		if (!d.run.maxHp || typeof d.run.maxHp !== "object") d.run.maxHp = { ...d.run.hp };
		// Phase D：战利品暂存 / 出发前消耗品快照 / 状态快照 / 待结算标记
		if (!d.run.loot || typeof d.run.loot !== "object") d.run.loot = emptyLoot();
		if (!d.run.loot.items || typeof d.run.loot.items !== "object") d.run.loot.items = {};
		if (!Array.isArray(d.run.loot.equips)) d.run.loot.equips = [];
		if (typeof d.run.loot.originite !== "number") d.run.loot.originite = 0;
		if (!d.run.startConsumables || typeof d.run.startConsumables !== "object") d.run.startConsumables = {};
		if (!d.run.snapshot || typeof d.run.snapshot !== "object") d.run.snapshot = {};
		if (d.run.settleWin !== true && d.run.settleWin !== false) d.run.settleWin = null;
	}
	delete d.backpackBonus;
	return d;
}

export class CampaignController {
	data: CampaignData;

	constructor(data: CampaignData) {
		this.data = normalizeCampaign(data);
	}

	// ---------- 读取 ----------

	liveOperators(): OperatorState[] {
		return this.data.roster.filter(o => !o.dead);
	}

	unityGrowMod(): number {
		const tier = UNITY_TIERS.find(t => this.data.unity >= t.min && this.data.unity <= t.max);
		return tier ? tier.growMod : 0;
	}

	/** 背包格数 = 基础 8 + 驼兽运输队等级（buildings.camel，初始 0，最高 8） */
	backpackSlots(): number {
		return INVENTORY_SLOTS_BASE + Math.max(0, this.data.buildings.camel ?? 0);
	}

	/** 已占用局内背包格：仅统计有库存的消耗品类型数（装备存全局仓库、不占格） */
	usedBackpackSlots(): number {
		return ITEMS.filter(d => (this.data.inventory[d.id] ?? 0) > 0).length;
	}

	freeBackpackSlots(): number {
		return Math.max(0, this.backpackSlots() - this.usedBackpackSlots());
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
		this.data.roster.push({ id, level: 1, exp: 0, stress: 0, agony: false, virtue: null, dead: false, maxEquipSlots: 1, equipped: [] });
		this.data.candidates = this.data.candidates.filter(c => c !== id);
		this.data.recruitDay = this.data.day;
		return { ok: true };
	}

	/** 今天是否已招募过干员：招募过则天灾信使当天不能再刷新候选（换天后自动恢复） */
	hasRecruitedToday(): boolean {
		return this.data.recruitDay === this.data.day;
	}

	/** 压力增加（按等级/建筑/折磨修正；>=100 判定美德/折磨；>=200 压力爆炸死亡） */
	addStress(op: OperatorState, raw: number) {
		if (op.dead || op.agony) return;
		let delta = raw;
		if (op.level >= 2) delta *= 0.9; // 2 级：受到压力 -10%
		if (op.agony) delta *= 1 + 0.2; // 折磨状态压力增长 +20%（占用）
		// TODO：巴别塔/军事委员会的修正作用于「执行任务的角色」，需要在派遣结算处按建筑等级折算
		op.stress = Math.min(STRESS.max, op.stress + delta);
		if (op.stress >= AGONY.deathAt) {
			this.explodeStress(op);
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

	/**
	 * 通用压力增减接口（按干员 id）。
	 * delta>0 走 addStress 的美德/折磨/爆炸判定；delta<0 直接减压（回落到阈值下可解除折磨）。
	 * @returns 结算后的压力值；干员不存在返回 undefined。
	 */
	changeStress(id: string, delta: number): number | undefined {
		const op = this.roster(id);
		if (!op) return undefined;
		if (op.dead) return op.stress;
		if (delta >= 0) {
			this.addStress(op, delta);
		} else {
			op.stress = Math.max(0, op.stress + delta);
			if (op.agony && op.stress < AGONY.stressAt) op.agony = false;
		}
		return op.stress;
	}

	/**
	 * 压力爆炸死亡（对外预留的独立死亡通道接口）。
	 * 达到压力上限即调用；也可由外部剧情/事件直接触发。记录死因为 "stress"。
	 */
	explodeStress(op: OperatorState) {
		if (op.dead) return;
		op.dead = true;
		op.death = {
			cause: "stress",
			day: this.data.day,
			dungeonId: this.data.run?.dungeonId ?? null,
			level: op.level,
			stress: op.stress,
			killerId: null,
			killerFaction: null,
		};
		this.applyUnityEvent("operatorPermanentDeath");
	}

	addExp(op: OperatorState, exp: number) {
		op.exp += exp;
		for (const cfg of OPERATOR_LEVELS) {
			if (op.exp >= cfg.exp && op.level < cfg.level) op.level = cfg.level;
		}
		// 2 级：额外获得一个装备栏（装备槽绑定在角色身上，需再加手动 +1）
		if (op.level >= 2 && op.maxEquipSlots < 2) op.maxEquipSlots = 2;
	}

	/**
	 * 标记阵亡并冻结死亡档案。
	 * @param killer 击杀来源；提供则记为战斗死亡（含阵营），省略则记为「意外死亡」（无来源）。
	 */
	markOperatorDead(id: string, killer?: { id: string | null; faction: KillerFaction | null }) {
		const op = this.roster(id);
		if (op && !op.dead) {
			op.dead = true;
			op.death = {
				cause: killer ? "combat" : "accident",
				day: this.data.day,
				dungeonId: this.data.run?.dungeonId ?? null,
				level: op.level,
				stress: op.stress,
				killerId: killer ? killer.id : null,
				killerFaction: killer ? killer.faction : null,
			};
			this.applyUnityEvent("operatorPermanentDeath");
		}
	}

	// ---------- 副本进行态 ----------

	/** 进入副本：把进行态挂到存档（跨真实对局持久化），返回该 run 供 UI 使用 */
	beginRun(layout: DungeonLayout, party: string[], hp: Record<string, number>, maxHp?: Record<string, number>): DungeonRun {
		// 装备掉率增量按「每局战役的设计加成」维护，新开一次远征即复位到基础值，避免跨局残留
		resetEquipDropChance();
		const snapshot: Record<string, RunOpSnapshot> = {};
		for (const id of party) {
			const op = this.roster(id);
			if (op) snapshot[id] = { level: op.level, exp: op.exp, stress: op.stress, hp: hp[id] ?? 0 };
		}
		const startConsumables: Record<string, number> = {};
		for (const c of CONSUMABLE_PRICES) {
			const n = this.data.inventory[c.id] ?? 0;
			if (n > 0) startConsumables[c.id] = n;
		}
		const run: DungeonRun = {
			dungeonId: layout.dungeonId,
			difficulty: layout.difficulty,
			layout,
			cur: layout.entry,
			party: [...party],
			hp,
			maxHp: { ...(maxHp ?? hp) },
			actions: 0,
			feedReadyAt: 0,
			pendingBattle: null,
			loot: emptyLoot(),
			startConsumables,
			snapshot,
			settleWin: null,
		};
		this.data.run = run;
		this.data.phase = "dungeon";
		return run;
	}

	/** 撤离 / 副本结束：清进行态，回营地 */
	clearRun() {
		this.data.run = null;
		this.data.phase = "camp";
	}

	/** 本次远征是否已结束（胜/负已判定，等结算页确认） */
	pendingSettlement(): boolean {
		return this.data.run?.settleWin != null;
	}

	/**
	 * 结束本次远征的判定入口：只打标记、不改数据，真正入账/丢弃由结算页确认后调 finishRun。
	 * 战斗失败与主动撤退都走 win=false（撤退按讨伐失败算，用户口径）。
	 */
	requestSettlement(win: boolean) {
		if (this.data.run) this.data.run.settleWin = win;
	}

	/**
	 * 推进一次行动（每经过一个通路/驻扎点 +1）。
	 * 粮草经济：行动数每满 ACTION_TO_RATION(10) 触发一次进食——在场每名干员各消耗 1 粮草；
	 * 缺粮则该干员承受「压力 +starveStress / 团结 -0.2 / 体力 -starveHpLoss」，体力归 0 视为意外阵亡并移出小队。
	 * @returns 供 UI 组装提示的本次结算摘要。
	 */
	advanceAction(): { actions: number; consumed: number; starved: string[]; died: string[] } {
		const run = this.data.run;
		if (!run) return { actions: 0, consumed: 0, starved: [], died: [] };
		run.actions++;
		let consumed = 0;
		const starved: string[] = [];
		const died: string[] = [];
		if (run.actions % ACTION_TO_RATION === 0) {
			for (const id of [...run.party]) {
				const op = this.roster(id);
				if (!op || op.dead) continue;
				if (this.consumeItem("provision", 1)) {
					consumed++;
					continue;
				}
				// 缺粮：压力↑ / 团结↓ / 体力流失
				starved.push(id);
				this.changeStress(id, PROVISION.starveStress);
				this.applyUnityEvent("starvation");
				run.hp[id] = (run.hp[id] ?? 0) - PROVISION.starveHpLoss;
				if ((run.hp[id] ?? 0) <= 0) {
					this.markOperatorDead(id); // 无致死来源 → 按意外死亡归档
					run.party.remove(id);
					died.push(id);
				}
			}
		}
		return { actions: run.actions, consumed, starved, died };
	}

	/**
	 * 主动投喂：消耗 1 粮草给 1 名在场干员 +1 体力（封顶 maxHp），受 feedGap 行动冷却限制。
	 */
	feedOperator(opId: string): { ok: boolean; reason?: string } {
		const run = this.data.run;
		if (!run) return { ok: false, reason: "不在副本中" };
		const op = this.roster(opId);
		if (!op || op.dead || !run.party.includes(opId)) return { ok: false, reason: "干员不在队中" };
		if ((this.data.inventory.provision ?? 0) < 1) return { ok: false, reason: "没有粮草" };
		if (run.actions < run.feedReadyAt) return { ok: false, reason: `投喂冷却中（还需 ${run.feedReadyAt - run.actions} 次行动）` };
		const cur = run.hp[opId] ?? 0;
		const max = run.maxHp[opId];
		if (max != null && cur >= max) return { ok: false, reason: "体力已满" };
		this.consumeItem("provision", 1);
		const healed = cur + 1;
		run.hp[opId] = max != null && healed > max ? max : healed;
		run.feedReadyAt = run.actions + PROVISION.feedGap;
		return { ok: true };
	}

	// ---------- 节点事件（障碍 / 宝箱）：当场 roll 进 run.loot，结算页确认后才入账 ----------

	/** 把一次掉落并入本次远征的暂存战利品（撤退/完成时才入背包与仓库） */
	addLoot(loot: LootBundle) {
		const run = this.data.run;
		if (!run || lootIsEmpty(loot)) return;
		mergeLoot(run.loot, loot);
	}

	/** 当前所在节点 */
	curNode(): DungeonNode | undefined {
		const run = this.data.run;
		return run?.layout.nodes.find(n => n.index === run.cur);
	}

	private node(index: number): DungeonNode | undefined {
		return this.data.run?.layout.nodes.find(n => n.index === index);
	}

	/**
	 * 铲除障碍：不给任何东西，只是把路打开（用户口径）。
	 *  - `supply`：消耗 1 个后勤小队；
	 *  - `force` ：在场每名干员失去 1 点体力并 +12 压力（体力归零即阵亡离队）。
	 * 放弃交互不走这里——那样节点保持 cleared=false，依旧不可通行。
	 */
	clearObstacle(index: number, mode: "supply" | "force"): { ok: boolean; reason?: string; died?: string[] } {
		const run = this.data.run;
		const node = this.node(index);
		if (!run || !node) return { ok: false, reason: "不在副本中" };
		if (node.event !== "obstacle") return { ok: false, reason: "这里没有障碍" };
		if (node.cleared) return { ok: false, reason: "障碍已经清开了" };
		const died: string[] = [];
		if (mode === "supply") {
			if (!this.consumeItem("supply", OBSTACLE.supplyCost)) return { ok: false, reason: `后勤小队不足（需要 ${OBSTACLE.supplyCost} 个）` };
		} else {
			if (!run.party.length) return { ok: false, reason: "没有干员能干活" };
			for (const id of [...run.party]) {
				run.hp[id] = (run.hp[id] ?? 0) - OBSTACLE.hpLoss;
				this.changeStress(id, OBSTACLE.stress);
				if ((run.hp[id] ?? 0) <= 0) {
					this.markOperatorDead(id); // 无致死来源 → 按意外死亡归档
					run.party.remove(id);
					died.push(id);
				}
			}
		}
		node.cleared = true;
		node.explored = true;
		return { ok: true, died };
	}

	/**
	 * 开宝箱：消耗 1 个后勤小队，掉落当场 roll 进暂存战利品（不进背包）。
	 * 不想花小队的玩家走 dismissNode()——不消耗、无奖励，但节点照常通过。
	 */
	openTreasure(index: number): { ok: boolean; reason?: string; loot?: LootBundle } {
		const run = this.data.run;
		const node = this.node(index);
		if (!run || !node) return { ok: false, reason: "不在副本中" };
		if (node.event !== "treasure") return { ok: false, reason: "这里没有宝箱" };
		if (node.cleared) return { ok: false, reason: "箱子已经开过了" };
		if (!this.consumeItem("supply", TREASURE.supplyCost)) return { ok: false, reason: `后勤小队不足（需要 ${TREASURE.supplyCost} 个）` };
		const loot = rollTreasureLoot(run.difficulty);
		node.cleared = true;
		node.explored = true;
		node.decided = true;
		this.addLoot(loot);
		return { ok: true, loot };
	}

	/** 放弃本次节点交互：不消耗任何东西；宝箱视作路过，障碍则继续堵着 */
	dismissNode(index: number) {
		const node = this.node(index);
		if (!node) return;
		node.decided = true;
		node.explored = true;
	}

	/** 战利品入背包：受堆叠上限与新占格限制，返回实际入账数量（差额即为丢弃量） */
	addLootItem(id: ItemId, count: number): number {
		const def = ITEMS.find(i => i.id === id);
		if (!def || count <= 0) return 0;
		const have = this.data.inventory[id] ?? 0;
		if (have === 0 && this.freeBackpackSlots() <= 0) return 0; // 新类型挤不出格子 → 整份丢弃
		const n = Math.min(count, def.maxStack - have);
		if (n > 0) this.data.inventory[id] = have + n;
		return Math.max(0, n);
	}

	/**
	 * 结算页预览（纯读、不改状态）：本次远征能带回什么、消耗品能回收多少源石碇。
	 * 与 finishRun 的口径保持一致：回收量按「战利品入账后」的持有权重算，避免预览与实际不符。
	 */
	settlePreview(): { carried: boolean; loot: LootBundle; recycle: Array<{ id: ItemId; name: string; count: number }>; recycled: number; refund: number } {
		const run = this.data.run;
		const loot = run?.loot ?? emptyLoot();
		const carried = (run?.party.length ?? 0) > 0;
		const recycle: Array<{ id: ItemId; name: string; count: number }> = [];
		let recycled = 0;
		if (run && carried) {
			for (const [id, start] of Object.entries(run.startConsumables)) {
				const projected = (this.data.inventory[id] ?? 0) + (loot.items[id] ?? 0);
				const n = Math.min(start, projected);
				if (n <= 0) continue;
				const def = ITEMS.find(i => i.id === id);
				recycle.push({ id: id as ItemId, name: def?.name ?? id, count: n });
				recycled += n;
			}
		}
		return { carried, loot, recycle, recycled, refund: recycled * CONSUMABLE_RECYCLE_PRICE };
	}

	/**
	 * 结束远征并落库（结算页确认后调用）：
	 *  - 有存活随队干员 → 战利品入账（消耗品/兑换物进背包、装备进全局仓库、局内源石碇按 1:1 变现），
	 *    出发前购买的消耗品按 CONSUMABLE_RECYCLE_PRICE 逐个回收；
	 *  - 全员阵亡 → 战利品与随身消耗品全部丢弃（暗黑地牢口径）。
	 * 随后走 settleMission（团结度 / 兑换物自动兑换 / 进入第二天）并清空进行态。
	 */
	finishRun(): RunSettlement {
		const run = this.data.run;
		const win = run?.settleWin === true;
		if (!run) return { win, carried: false, gained: emptyLoot(), lost: emptyLoot(), recycled: { count: 0, originite: 0 } };
		const carried = run.party.length > 0;
		const gained = emptyLoot();
		const lost = emptyLoot();
		const recycled = { count: 0, originite: 0 };

		if (carried) {
			for (const [id, n] of Object.entries(run.loot.items)) {
				if (n <= 0) continue;
				if (id === "originite") {
					// 局内货币没有「带回家继续用」的用途：带回即 1:1 变现为局外源石碇，也不占背包格
					this.data.originite += n;
					gained.items[id] = n;
					continue;
				}
				const got = this.addLootItem(id as ItemId, n);
				if (got > 0) gained.items[id] = got;
				if (got < n) lost.items[id] = (lost.items[id] ?? 0) + (n - got);
			}
			gained.equips.push(...run.loot.equips);
			this.data.ownedEquips.push(...run.loot.equips);
			if (run.loot.originite > 0) {
				this.data.originite += run.loot.originite;
				gained.originite = run.loot.originite;
			}
			for (const [id, start] of Object.entries(run.startConsumables)) {
				const have = this.data.inventory[id] ?? 0;
				const n = Math.min(start, have);
				if (n <= 0) continue;
				const left = have - n;
				if (left > 0) this.data.inventory[id] = left;
				else delete this.data.inventory[id];
				recycled.count += n;
				recycled.originite += n * CONSUMABLE_RECYCLE_PRICE;
			}
			this.data.originite += recycled.originite;
		} else {
			mergeLoot(lost, run.loot); // 全员阵亡：一整趟的收获留在地里
			for (const id of Object.keys(run.startConsumables)) delete this.data.inventory[id];
		}

		if (win) {
			this.addDungeonExp(run.dungeonId, DIFFICULTY[run.difficulty].gainExp);
			const boss = run.layout.nodes.find(n => n.event === "boss");
			if (boss?.cleared) {
				const p = this.data.dungeonProgress[run.dungeonId];
				if (p && !p.bossSlain.includes(run.difficulty)) p.bossSlain.push(run.difficulty);
				if (getDungeon(run.dungeonId)?.isSpecial) this.winGame(); // 特殊副本：通关即整局胜利
			}
		}
		this.settleMission(win);
		this.clearRun();
		return { win, carried, gained, lost, recycled };
	}

	/**
	 * 应用一场真实对局的结果（战斗系统回调入口）。
	 * @param win       是否击杀了全部敌方（判定通过）
	 * @param finalHp   我方各干员最终体力（id→hp，<=0 视为阵亡）
	 * @param nodeIndex 触发本场战斗的节点 index
	 * @param deaths    阵亡归因：干员 id → 击杀者（阵营 + 角色 id）。缺省则按「意外死亡」记录。
	 * @param kills     我方各干员击杀数（干员 id → 击杀敌人数）：驱动 1 级「击杀减压力」。
	 *
	 * 规则：血量在本副本内跨节点不重置（写入 run.hp）；我方阵亡者移出小队并进墓地
	 * （markOperatorDead，墓地成员不再进招募候选）；胜利=节点通过，失败=不通过并进入第二天。
	 * 结算：1 级效果——每名干员按击杀数减压（击杀 ×3，胜败都算）；胜利——全体存活随队干员 +2 经验。
	 * @param loot 本场战斗的掉落（简报页已 roll 过就传进来，保证展示与入账一致；缺省则此处现 roll）
	 */
	applyBattleResult(win: boolean, finalHp: Record<string, number>, nodeIndex: number, deaths?: Record<string, { id: string | null; faction: KillerFaction | null } | undefined>, kills?: Record<string, number>, loot?: LootBundle): { win: boolean; deaths: string[]; ended: boolean } {
		const run = this.data.run;
		const dead: string[] = [];
		if (!run) return { win, deaths: dead, ended: false };

		// 记录我方最终体力（仅仍在队的干员；本副本内持久，不重置）
		for (const id of run.party) {
			const hp = finalHp[id];
			if (hp != null) run.hp[id] = Math.max(0, Math.floor(hp));
		}
		// 1 级效果：击杀敌人减压（胜败均结算；阵亡者 changeStress 内部自动跳过）
		if (kills) {
			for (const [id, n] of Object.entries(kills)) {
				if (n > 0) this.changeStress(id, -KILL_STRESS_RELIEF * n);
			}
		}
		// 体力<=0（或面板缺席）视为阵亡：移出小队 + 进墓地（带上击杀归因）
		for (const id of [...run.party]) {
			if ((run.hp[id] ?? 0) <= 0) {
				this.markOperatorDead(id, deaths?.[id]);
				run.party.remove(id);
				dead.push(id);
			}
		}

		if (win) {
			// 胜利：全体存活随队干员 +2 经验（等级/升级由 addExp 内部处理）
			for (const id of run.party) {
				const op = this.roster(id);
				if (op) this.addExp(op, 2);
			}
			const node = run.layout.nodes.find(n => n.index === nodeIndex);
			if (node) {
				node.hasEnemy = false;
				node.cleared = true;
				node.explored = true;
			}
			run.pendingBattle = null;
			this.data.missionResult.win++;
			this.applyUnityEvent("missionSuccess");
			// 当场 roll 战利品：只暂存进 run.loot，撤退/完成时才入账（用户口径）
			this.addLoot(loot ?? rollBattleRewards(true, run.difficulty));
		} else {
			// 未通过：本次讨伐判负，但结算要等玩家在结算页确认后才落库
			run.pendingBattle = null;
			this.requestSettlement(false);
		}
		// 小队打光：没有存活者就没人把物资带回营地，远征就此结束（按失败结算）
		if (!run.party.length) this.requestSettlement(false);
		return { win, deaths: dead, ended: run.settleWin != null };
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

	// ---------- 商店 / 装备（Phase A：货架购买 + 装备选取；战斗施加在 Phase C） ----------

	/** 商人等级（建筑 merchant，初始 1） */
	merchantLevel(): number {
		return Math.max(1, this.data.buildings.merchant ?? 1);
	}

	/** 装备折后价（局外源石碇） */
	equipPrice(equipId: string): number {
		const def = getEquipment(equipId);
		if (!def) return 0;
		return discountedPrice(def.price, merchantDiscount(this.merchantLevel()));
	}

	/** 进入商店时确保库存对应当天：跨天则重 roll 库存并按商人等级重置当日刷新次数 */
	ensureShopToday() {
		const s = this.data.shop;
		if (s.day === this.data.day && s.stock.length) return;
		s.day = this.data.day;
		s.stock = rollMerchantStock();
		s.refreshLeft = merchantDailyRefresh(this.merchantLevel());
	}

	/** 刷新商人库存（消耗一次当日刷新次数） */
	refreshShop(): { ok: boolean; reason?: string } {
		this.ensureShopToday();
		const s = this.data.shop;
		if (s.refreshLeft <= 0) return { ok: false, reason: "今日刷新次数已用完" };
		s.refreshLeft--;
		s.stock = rollMerchantStock();
		return { ok: true };
	}

	/** 购买消耗品（固定货架，可反复买）：校验余额 + 背包格（新类型才占格） */
	purchaseConsumable(id: ItemId, qty = 1): { ok: boolean; reason?: string } {
		const entry = CONSUMABLE_PRICES.find(c => c.id === id);
		const def = ITEMS.find(i => i.id === id);
		if (!entry || !def) return { ok: false, reason: "商品不存在" };
		if (qty <= 0) return { ok: false, reason: "数量需大于 0" };
		const have = this.data.inventory[id] ?? 0;
		if (have + qty > def.maxStack) return { ok: false, reason: `已达堆叠上限 ${def.maxStack}` };
		// 该类型此前为 0 → 需要新占一格
		if (have === 0 && this.freeBackpackSlots() <= 0) return { ok: false, reason: "背包已满" };
		const cost = entry.price * qty;
		if (this.data.originite < cost) return { ok: false, reason: "源石碇不足" };
		this.data.originite -= cost;
		this.data.inventory[id] = have + qty;
		return { ok: true };
	}

	/** 出售消耗品（战前补给站原价回购）：按 CONSUMABLE_PRICES 单价退款，扣减库存 */
	sellConsumable(id: ItemId, qty = 1): { ok: boolean; reason?: string } {
		const entry = CONSUMABLE_PRICES.find(c => c.id === id);
		if (!entry) return { ok: false, reason: "商品不存在" };
		if (qty <= 0) return { ok: false, reason: "数量需大于 0" };
		const have = this.data.inventory[id] ?? 0;
		if (have < qty) return { ok: false, reason: "持有数量不足" };
		this.data.inventory[id] = have - qty;
		this.data.originite += entry.price * qty;
		return { ok: true };
	}

	/** 放弃本次讨伐：把局内背包中所有「可出售消耗品」按原价全额回售、清空。返回出售后退款额（供提示） */
	sellAllConsumables(): { sold: number; refund: number } {
		let sold = 0;
		let refund = 0;
		for (const entry of CONSUMABLE_PRICES) {
			const have = this.data.inventory[entry.id] ?? 0;
			if (have <= 0) continue;
			refund += entry.price * have;
			sold += have;
			delete this.data.inventory[entry.id];
		}
		if (refund > 0) this.data.originite += refund;
		return { sold, refund };
	}

	/** 购买一件库存装备（仅校验余额；装备入全局仓库、不占局内背包），成功从库存移除 */
	purchaseEquipment(stockIndex: number): { ok: boolean; reason?: string } {
		this.ensureShopToday();
		const s = this.data.shop;
		const equipId = s.stock[stockIndex];
		if (!equipId || !getEquipment(equipId)) return { ok: false, reason: "该商品已售出" };
		const cost = this.equipPrice(equipId);
		if (this.data.originite < cost) return { ok: false, reason: "源石碇不足" };
		this.data.originite -= cost;
		this.data.ownedEquips.push(equipId);
		s.stock.splice(stockIndex, 1);
		return { ok: true };
	}

	/** 把一件已拥有装备穿戴给干员（受 maxEquipSlots 限制；同一装备不可重复穿） */
	equipOp(opId: string, equipId: string): { ok: boolean; reason?: string } {
		const op = this.roster(opId);
		if (!op || op.dead) return { ok: false, reason: "干员不存在" };
		if (!getEquipment(equipId)) return { ok: false, reason: "装备不存在" };
		if (!this.data.ownedEquips.includes(equipId)) return { ok: false, reason: "未拥有该装备" };
		if (op.equipped.includes(equipId)) return { ok: false, reason: "该干员已穿戴" };
		if (op.equipped.length >= op.maxEquipSlots) return { ok: false, reason: "需要有空置的装备栏" };
		op.equipped.push(equipId);
		return { ok: true };
	}

	/** 卸下干员身上的一件装备（回到全局仓库/可用池，不占局内背包） */
	unequipOp(opId: string, equipId: string): { ok: boolean; reason?: string } {
		const op = this.roster(opId);
		if (!op) return { ok: false, reason: "干员不存在" };
		const i = op.equipped.indexOf(equipId);
		if (i < 0) return { ok: false, reason: "并未穿戴" };
		op.equipped.splice(i, 1);
		return { ok: true };
	}

	/** 干员“可用”装备池：已拥有但未被任何存活干员穿戴的实例（按剩余数量列出） */
	availableEquips(): string[] {
		const counts = new Map<string, number>();
		for (const id of this.data.ownedEquips) counts.set(id, (counts.get(id) ?? 0) + 1);
		for (const op of this.data.roster) {
			if (op.dead) continue;
			for (const id of op.equipped) counts.set(id, (counts.get(id) ?? 0) - 1);
		}
		const out: string[] = [];
		for (const [id, n] of counts) for (let k = 0; k < n; k++) out.push(id);
		return out;
	}

	/**
	 * 汇总某干员已穿戴装备的属性加成为一份 EquipStat（供战斗开局施加）。
	 * 仅累加存活/在册干员身上的实例；stressReduce 属战役层压力结算，一并汇总但战斗内不使用。
	 */
	equipStatOf(opId: string): EquipStat {
		const op = this.roster(opId);
		const sum: Required<EquipStat> = { maxHp: 0, hujia: 0, maxHandcard: 0, drawStart: 0, attackExtra: 0, stressReduce: 0 };
		if (op) {
			for (const id of op.equipped) {
				const s = getEquipment(id)?.stat;
				if (!s) continue;
				sum.maxHp += s.maxHp ?? 0;
				sum.hujia += s.hujia ?? 0;
				sum.maxHandcard += s.maxHandcard ?? 0;
				sum.drawStart += s.drawStart ?? 0;
				sum.attackExtra += s.attackExtra ?? 0;
				sum.stressReduce += s.stressReduce ?? 0;
			}
		}
		return sum;
	}

	// ---------- 天/流程 ----------

	/**
	 * 进入下一天：每日结算 + 一天结束。
	 * 由 finishRun（远征结算页确认）与旧的占位路径调用；
	 * 「全员阵亡不带回物资」的规则在 finishRun 的 carryBack 分支里落地。
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

	/**
	 * 任务结算：团结度增减 + 背包兑换物自动换钱 + 进入第二天。
	 * win 由 finishRun 给出真实判定（击败 boss 后才允许走完成；撤退一律 false）。
	 */
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
// 战斗就地运行（game.switchMode('identity') 不刷新页面），运行时 lib.config.mode 会切到 identity，
// 而引擎的 game.save / lib.storage 按当前模式分命名空间——若继续用它会写进 identity 的存储、
// 下次进本模式读不到。故战役数据改用独立的 localStorage key 直接持久化，与所在模式解耦。

export const saveCampaign = (data: CampaignData) => {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(data));
	} catch (e) {
		console.error("[GloriousIdeal] 存档失败", e);
	}
};

export const loadCampaign = (): CampaignData | null => {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as CampaignData;
	} catch {
		return null;
	}
};

export const clearCampaignSave = () => {
	try {
		localStorage.removeItem(SAVE_KEY);
	} catch {
		/* ignore */
	}
};
