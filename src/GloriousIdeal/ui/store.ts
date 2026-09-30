/**
 * store.ts —— GloriousIdeal UI 的 Vue 响应式状态与流转
 *
 * 约定：所有页面渲染都读 view（reactive），所有操作都走本文件的 action；
 * 需要强制重绘时调 bump()（tick+1，根节点以 :key 挂 tick）。
 * 战斗等重量级 TODO 照旧标记。
 */

import { reactive } from "vue";
import { lib } from "noname";
import { CampaignController, CampaignData, createInitialCampaign, saveCampaign, loadCampaign, clearCampaignSave } from "../state/campaign.js";
import { generateDungeon, DungeonLayout, type BattleResult } from "../dungeon.js";
import { Difficulty } from "../data/dungeons.js";
import { BUILDINGS, BuildingId } from "../data/buildings.js";
import { DUNGEONS, DIFFICULTY, SPECIAL_UNLOCK } from "../data/dungeons.js";
import { BARRACKS_CAPACITY } from "../data/operators.js";
import { UNITY, MAX_DAY } from "../data/resources.js";
import { ITEMS, INVENTORY_SLOTS_BASE, type ItemId } from "../data/items.js";
import { opName } from "./components/common/format.js";

export type Phase = "title" | "camp" | "recruit" | "dispatch" | "supply" | "dungeon" | "graveyard" | "shop" | "end";

/**
 * 战斗简报（#5）：真实对局结束后先展示，待玩家点击确认再落库结算。
 * 直接携带 startBattle 的返回值 + 战前血量快照，供 UI 计算我方每个干员的体力变化。
 */
export interface BattleReport {
	result: BattleResult;
	/** 战前我方体力（id→hp），用于对比出「体力变化 / 阵亡」 */
	preHp: Record<string, number>;
	/** 参战我方 id（战前小队，保证阵亡者也出现在简报里） */
	party: string[];
}

export interface ViewState {
	phase: Phase;
	tick: number;
	ctrl: CampaignController | null;
	pool: string[];
	/** 是否已有存档（决定标题页“继续”按钮） */
	hasSave: boolean;
	/** 结算面板文案 */
	endText: string;
	endWin: boolean;
	/** 当前副本探索 */
	layout: DungeonLayout | null;
	/** 当前所在节点 */
	cur: number;
	party: string[];
	/** 派遣页已选干员 */
	selected: string[];
	/** 当前打开详情面板的干员 id（null=关闭） */
	detailId: string | null;
	/** 副本内各干员当前体力（id→hp），进入副本时按上限初始化 */
	dungeonHp: Record<string, number>;
	/** 正在进行真实对局：隐藏 GI 覆盖层让位给战斗界面（#1） */
	battling: boolean;
	/** 待确认的战斗简报（null=无）（#5） */
	battleReport: null | BattleReport;
	/** 已选定但尚未进入的讨伐（开局商店购买消耗品 → 出发时据此进入副本） */
	pendingDispatch: { party: string[]; dungeonId: string; difficulty: Difficulty } | null;
	/** 副本内一次行动/投喂的结算提示（粮草消耗、缺粮惩罚等）；瞬态、不入存档 */
	dungeonNotice: string;
}

export const view = reactive<ViewState>({
	phase: "title",
	tick: 0,
	ctrl: null,
	pool: [],
	hasSave: false,
	endText: "",
	endWin: false,
	layout: null,
	cur: 0,
	party: [],
	selected: [],
	detailId: null,
	dungeonHp: {},
	battling: false,
	battleReport: null,
	pendingDispatch: null,
	dungeonNotice: "",
});

export const bump = () => {
	view.tick++;
};

export const CONFIG = {
	UNITY,
	MAX_DAY,
	BUILDINGS,
	DUNGEONS,
	DIFFICULTY,
	SPECIAL_UNLOCK,
	BARRACKS_CAPACITY,
	ITEMS,
	INVENTORY_SLOTS_BASE,
};

// ---------------- actions ----------------

/** 干员体力上限（读引擎角色定义，缺省 4） */
export const opMaxHp = (id: string): number => {
	try {
		return (lib.character as Record<string, { maxHp?: number }>)[id]?.maxHp ?? 4;
	} catch {
		return 4;
	}
};

export const setPool = (pool: string[]) => {
	view.pool = pool;
};

const shuffle = <T,>(arr: T[]): T[] => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

export const refreshHasSave = () => {
	view.hasSave = !!loadCampaign();
};

export function goTitle() {
	view.phase = "title";
	view.layout = null;
	view.party = [];
	view.selected = [];
	view.detailId = null;
	view.dungeonHp = {};
	view.battling = false;
	view.battleReport = null;
	view.pendingDispatch = null;
	view.dungeonNotice = "";
	refreshHasSave();
	bump();
}

export function startNew() {
	clearCampaignSave();
	// TODO: 开局初始 3 名干员提供可选 UI；现在随机
	const initOps = shuffle(view.pool).slice(0, 3);
	view.ctrl = new CampaignController(createInitialCampaign(initOps));
	persist();
	goCamp();
}

export function continueLast() {
	const saved = loadCampaign();
	if (!saved) return goTitle();
	view.ctrl = new CampaignController(saved);
	goCamp();
}

export function goCamp() {
	const ctrl = view.ctrl;
	if (!ctrl) return goTitle();
	if (ctrl.data.win) return showEnd(true, "已通关凯尔希军！卡兹戴尔迎来瑰丽理想。");
	if (ctrl.data.lose) return showEnd(false, "团结度归零或超出时限，旅程失败。");
	view.phase = "camp";
	bump();
}

export function goRecruit() {
	if (view.ctrl && !view.ctrl.data.candidates.length && view.pool.length) {
		view.ctrl.rollCandidates(view.pool);
	}
	view.phase = "recruit";
	bump();
}

export function goDispatch() {
	view.phase = "dispatch";
	view.selected = [];
	view.pendingDispatch = null;
	bump();
}

/** 选定讨伐目标 → 进入开局商店（购买消耗品），此处仅暂存编成，真正进入副本由 goDungeon 完成 */
export function goSupply(party: string[], dungeonId: string, difficulty: Difficulty) {
	if (!view.ctrl) return;
	if (!party.length) {
		console.warn("[GloriousIdeal] 请先选择出战干员（1~3 名）");
		return;
	}
	view.pendingDispatch = { party: party.slice(), dungeonId, difficulty };
	view.phase = "supply";
	bump();
}

/** 从开局商店返回选派（保留已选干员，不清空 selected）：放弃本次出击 → 自动原价回售背包全部消耗品 */
export function backToDispatch() {
	if (view.phase === "supply") view.ctrl?.sellAllConsumables();
	view.phase = "dispatch";
	persist();
	bump();
}

/** 打开墓园（展示全体阵亡干员档案） */
export function goGraveyard() {
	view.phase = "graveyard";
	bump();
}

// ---------------- 商店 / 装备 ----------------

/** 打开商店：确保库存对应当天后再进页面 */
export function goShop() {
	if (!view.ctrl) return goTitle();
	view.ctrl.ensureShopToday();
	view.phase = "shop";
	bump();
}

export function buyConsumable(id: ItemId, qty = 1): { ok: boolean; reason?: string } {
	const r = view.ctrl?.purchaseConsumable(id, qty) ?? { ok: false, reason: "无战役" };
	if (r.ok) {
		persist();
		bump();
	}
	return r;
}

export function sellConsumable(id: ItemId, qty = 1): { ok: boolean; reason?: string } {
	const r = view.ctrl?.sellConsumable(id, qty) ?? { ok: false, reason: "无战役" };
	if (r.ok) {
		persist();
		bump();
	}
	return r;
}

export function buyEquipment(stockIndex: number): { ok: boolean; reason?: string } {
	const r = view.ctrl?.purchaseEquipment(stockIndex) ?? { ok: false, reason: "无战役" };
	if (r.ok) {
		persist();
		bump();
	}
	return r;
}

export function refreshShop(): { ok: boolean; reason?: string } {
	const r = view.ctrl?.refreshShop() ?? { ok: false, reason: "无战役" };
	if (r.ok) {
		persist();
		bump();
	}
	return r;
}

export function equipOp(opId: string, equipId: string): { ok: boolean; reason?: string } {
	const r = view.ctrl?.equipOp(opId, equipId) ?? { ok: false, reason: "无战役" };
	if (r.ok) {
		persist();
		bump();
	}
	return r;
}

export function unequipOp(opId: string, equipId: string): { ok: boolean; reason?: string } {
	const r = view.ctrl?.unequipOp(opId, equipId) ?? { ok: false, reason: "无战役" };
	if (r.ok) {
		persist();
		bump();
	}
	return r;
}

/** 从开局商店出发：消费 pendingDispatch；也可直接传参（兼容旧调用） */
export function goDungeon(party?: string[], dungeonId?: string, difficulty?: Difficulty) {
	if (!view.ctrl) return;
	let pd = party && dungeonId && difficulty ? { party, dungeonId, difficulty } : view.pendingDispatch;
	if (!pd) return;
	// 出发即离开开局商店
	view.pendingDispatch = null;
	const layout = generateDungeon(pd.dungeonId, pd.difficulty);
	const hp = Object.fromEntries(pd.party.map(id => [id, opMaxHp(id)]));
	// 进行态挂进存档（跨真实对局持久化）；开局体力=上限，maxHp 供投喂/缺粮封顶
	view.ctrl.beginRun(layout, pd.party, hp, { ...hp });
	persist();
	view.layout = layout;
	view.party = pd.party.slice();
	view.cur = layout.entry;
	view.dungeonHp = hp;
	view.dungeonNotice = "";
	view.phase = "dungeon";
	bump();
}

/** 从存档里的进行态恢复副本探索（真实对局结束/刷新页面后回到副本页） */
export function resumeRun() {
	const run = view.ctrl?.data.run;
	if (!run) return false;
	view.layout = run.layout;
	view.party = run.party.slice();
	view.cur = run.cur;
	view.dungeonHp = { ...run.hp };
	view.phase = "dungeon";
	bump();
	return true;
}

export function backToCamp() {
	persist();
	goCamp();
}

/**
 * 模式启动入口：有存档则恢复（副本进行态优先），否则回标题。
 * 战斗就地运行、不再 reload，故这里没有「消费回传战斗结果」的分支——
 * 结果由 moveTo 内的 await 直接拿到并弹简报。
 */
export function bootFromSaveOrTitle() {
	const saved = loadCampaign();
	if (!saved) {
		goTitle();
		return;
	}
	view.ctrl = new CampaignController(saved);
	// 进行态存在（如中途刷新页面）则续跑副本，否则回营地
	if (view.ctrl.data.run && resumeRun()) return;
	goCamp();
}

export function endJourney() {
	clearCampaignSave();
	view.ctrl = null;
	goTitle();
}

const persist = () => {
	if (view.ctrl) saveCampaign(view.ctrl.data);
};

function showEnd(win: boolean, text: string) {
	view.endWin = win;
	view.endText = text;
	view.phase = "end";
	bump();
}

// ---------------- 营地操作 ----------------

export function upgradeBuilding(id: BuildingId) {
	if (view.ctrl) {
		view.ctrl.upgradeBuilding(id);
		persist();
		bump();
	}
}

// ---------------- 招募 ----------------

export function rollRecruits() {
	if (view.ctrl) {
		view.ctrl.data.candidates = [];
		view.ctrl.rollCandidates(view.pool);
		bump();
	}
}

export function acceptCandidate(id: string) {
	if (view.ctrl) {
		const r = view.ctrl.acceptCandidate(id);
		if (!r.ok) console.warn("[GloriousIdeal] 招募失败：", r.reason);
		persist();
		bump();
	}
}

// ---------------- 派遣 ----------------

export const toggleSelected = (id: string) => {
	if (view.selected.includes(id)) {
		view.selected = view.selected.filter(x => x !== id);
	} else if (view.selected.length < 3) {
		view.selected = [...view.selected, id];
	}
	bump();
};

// ---------------- 详情面板 ----------------

export const openDetail = (id: string) => {
	view.detailId = id;
};
export const closeDetail = () => {
	view.detailId = null;
};

// ---------------- 副本探索 ----------------

/** 一次行动的粮草结算摘要 → 副本页提示文案 */
const provisioningNotice = (econ: { consumed: number; starved: string[]; died: string[] }): string => {
	const parts: string[] = [];
	if (econ.consumed > 0) parts.push(`🍞 小队进食，消耗 ${econ.consumed} 粮草`);
	if (econ.starved.length > 0) parts.push(`⚠ 缺粮：${econ.starved.map(opName).join("、")}（压力↑·体力流失）`);
	if (econ.died.length > 0) parts.push(`💀 因缺粮倒下：${econ.died.map(opName).join("、")}`);
	return parts.join("　");
};

export async function moveTo(index: number) {
	if (!view.ctrl || !view.layout) return;
	const run = view.ctrl.data.run;
	const node = view.layout.nodes.find(n => n.index === index);
	if (!node) return;

	// 每经过一个节点 = 1 行动：驱动粮草经济（进食/缺粮惩罚在 campaign.advanceAction）
	const econ = view.ctrl.advanceAction();
	if (econ.consumed || econ.starved.length) view.dungeonNotice = provisioningNotice(econ);
	if (run) {
		// 缺粮可能改动 run.hp / run.party：把 UI 侧副本同步上来（供战前 preHp、队伍栏）
		view.dungeonHp = { ...run.hp };
		view.party = run.party.slice();
	}
	persist();
	bump();

	if (node.kind === "outpost" && node.hasEnemy) {
		const preHp = { ...view.dungeonHp };
		const party = view.party.slice();
		const allyLevel = Object.fromEntries(party.map(id => [id, view.ctrl?.data.roster.find(o => o.id === id)?.level ?? 1]));
		view.battling = true; // 隐藏 GI 覆盖层，露出真实对局界面
		bump();
		let res: BattleResult;
		try {
			const { startBattle } = await import("../dungeon.js");
			res = await startBattle({
				dungeonId: view.layout.dungeonId,
				nodeIndex: index,
				party,
				allyHp: preHp,
				allyLevel,
			});
		} finally {
			view.battling = false;
		}
		// 战斗结束：先弹简报（#5），玩家确认后再落库结算，不即时推进。
		view.battleReport = { result: res, preHp, party };
		bump();
		return;
	}

	node.explored = true;
	view.cur = index;
	if (run) {
		run.cur = index;
		run.hp = { ...view.dungeonHp };
		persist();
	}
	bump();
}

/** 主动投喂：消耗 1 粮草给 1 名在场干员 +1 体力（受行动冷却限制） */
export function feedOperator(id: string): { ok: boolean; reason?: string } {
	const r = view.ctrl?.feedOperator(id) ?? { ok: false, reason: "无战役" };
	view.dungeonNotice = r.ok ? "🍞 投喂成功，体力 +1" : r.reason ?? "无法投喂";
	if (r.ok) {
		const run = view.ctrl?.data.run;
		if (run) view.dungeonHp = { ...run.hp };
		persist();
	}
	bump();
	return r;
}

/** 清除副本页提示横幅 */
export const clearDungeonNotice = () => {
	view.dungeonNotice = "";
};

/**
 * 确认战斗简报：此刻才把结果落库、推进副本。
 * 胜利 → 节点通过并把当前节点设为该战斗节点（#4）；失败 → 清进行态回营地（applyBattleResult 内已进第二天）。
 */
export function confirmBattleReport() {
	const rep = view.battleReport;
	if (!rep || !view.ctrl) return;
	view.battleReport = null;
	const { result } = rep;
	view.ctrl.applyBattleResult(result.win, result.finalHp, result.nodeIndex, result.deaths, result.kills);
	persist();

	if (!result.win) {
		view.layout = null;
		view.dungeonHp = {};
		goCamp();
		return;
	}

	const run = view.ctrl.data.run;
	if (run) {
		view.party = run.party.slice();
		view.dungeonHp = { ...run.hp };
		run.cur = result.nodeIndex;
	}
	view.cur = result.nodeIndex;
	bump();
}

/** 结束探索：任务结算占位 → 回到营地（已推进到第二天） */
export function endDungeon() {
	if (!view.ctrl) return;
	// TODO: 按 绘图/清扫/击败boss 判定；成功加副本经验
	view.ctrl.settleMission(Math.random() > 0.4);
	view.ctrl.clearRun(); // 撤离：清空进行态
	view.layout = null;
	view.dungeonHp = {};
	view.dungeonNotice = "";
	persist();
	goCamp();
}
