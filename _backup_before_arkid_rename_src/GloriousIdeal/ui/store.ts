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
import { generateDungeon, isBlockedObstacle, isEventNode, DungeonLayout, type BattleResult } from "../dungeon.js";
import { rollBattleRewards, type LootBundle } from "../data/loot.js";
import { Difficulty } from "../data/dungeons.js";
import { BUILDINGS, BuildingId } from "../data/buildings.js";
import { DUNGEONS, DIFFICULTY, SPECIAL_UNLOCK } from "../data/dungeons.js";
import { BARRACKS_CAPACITY } from "../data/operators.js";
import { UNITY, MAX_DAY } from "../data/resources.js";
import { ITEMS, INVENTORY_SLOTS_BASE, getItem, type ItemId } from "../data/items.js";
import { getEquipment } from "../data/equipment.js";
import { opName } from "./components/common/format.js";

export type Phase = "title" | "start" | "camp" | "recruit" | "dispatch" | "supply" | "dungeon" | "settle" | "graveyard" | "shop" | "end";

/** 开局初始干员选择：从 WhichWay 池给出 4 名候选、玩家选 2 名（四选二）；另有自由选将可浏览全部武将 */
export const INITIAL_PICK_COUNT = 2;
export const INITIAL_CANDIDATE_COUNT = 4;

/**
 * 战斗简报（#5）：真实对局结束后先弹出展示，待玩家点击确认再落库结算。
 * 直接携带 startBattle 的返回值 + 战前血量快照，供 UI 计算我方每个干员的体力变化。
 * loot 在这里就 roll 好（当场 roll、结算页入账），确认时原样交给战役层，保证展示与落库一致。
 */
export interface BattleReport {
	result: BattleResult;
	/** 战前我方体力（id→hp），用于对比出「体力变化 / 阵亡」 */
	preHp: Record<string, number>;
	/** 参战我方 id（战前小队，保证阵亡者也出现在简报里） */
	party: string[];
	/** 本场掉落（暂存进 run.loot，撤退/完成时才入账） */
	loot: LootBundle;
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
	/** 待玩家答复的节点 index（null=无弹窗）：障碍/宝箱走上去都要弹一层 */
	nodeDialog: number | null;
	/** 开局四选二：本批候选（WhichWay 武将 id） */
	initialCandidates: string[];
	/** 开局已选初始干员（≤INITIAL_PICK_COUNT，可来自候选或自由选将） */
	initialPicked: string[];
	/** 自由选将面板是否展开 */
	initialFreeOpen: boolean;
	/** 自由选将池（全部可玩武将，含非 WhichWay；懒建） */
	initialFreePool: string[];
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
	nodeDialog: null,
	initialCandidates: [],
	initialPicked: [],
	initialFreeOpen: false,
	initialFreePool: [],
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
	view.nodeDialog = null;
	view.initialCandidates = [];
	view.initialPicked = [];
	view.initialFreeOpen = false;
	view.initialFreePool = [];
	refreshHasSave();
	bump();
}

export function startNew() {
	clearCampaignSave();
	view.ctrl = null;
	rollInitialCandidates();
	view.initialPicked = [];
	view.initialFreeOpen = false;
	view.initialFreePool = [];
	view.phase = "start";
	bump();
}

/** 抽一批开局候选（WhichWay 池里随机 N 名，构成「四选二」的四） */
export function rollInitialCandidates() {
	view.initialCandidates = shuffle(view.pool).slice(0, INITIAL_CANDIDATE_COUNT);
}

/** 切换选择某名初始干员（候选或自由池均可）；上限 INITIAL_PICK_COUNT */
export function toggleInitialPick(id: string) {
	const i = view.initialPicked.indexOf(id);
	if (i >= 0) view.initialPicked.splice(i, 1);
	else if (view.initialPicked.length < INITIAL_PICK_COUNT) view.initialPicked.push(id);
	bump();
}

/** 展开/收起自由选将；首次展开时懒建全武将池（含非 WhichWay） */
export function toggleInitialFree() {
	view.initialFreeOpen = !view.initialFreeOpen;
	if (view.initialFreeOpen && !view.initialFreePool.length) view.initialFreePool = allSelectableCharacters();
	bump();
}

/** 确认开局：选满 INITIAL_PICK_COUNT 名即创建战役并进入营地 */
export function confirmInitialStart() {
	if (view.initialPicked.length !== INITIAL_PICK_COUNT) {
		console.warn(`[GloriousIdeal] 请选择 ${INITIAL_PICK_COUNT} 名初始干员`);
		return;
	}
	view.ctrl = new CampaignController(createInitialCampaign(view.initialPicked.slice()));
	persist();
	view.initialCandidates = [];
	view.initialPicked = [];
	view.initialFreeOpen = false;
	view.initialFreePool = [];
	goCamp();
}

/**
 * 自由选将池：全部可玩武将（含非 WhichWay，如本体/其他扩展）。
 * 过滤口径对齐引擎 ui.create.characterDialog2：跳过 boss/隐藏皮肤/禁用/封禁项，且需具备面板血量。
 */
export function allSelectableCharacters(): string[] {
	const out: string[] = [];
	const chars = lib.character as Record<string, any>;
	const banned = ((lib.config as unknown as { banned?: string[] }).banned ?? []) as string[];
	const filt = lib.filter as unknown as { characterDisabled?: (id: string) => boolean; characterDisabled2?: (id: string) => boolean };
	for (const id in chars) {
		if (!Object.prototype.hasOwnProperty.call(chars, id)) continue;
		if (id === "unknown" || id === "shadow") continue;
		const c = chars[id];
		if (!c || typeof c !== "object") continue;
		if (c.isBoss || c.isHiddenBoss || c.isMinskin || c.isUnseen || c.isHiddenInStoneMode) continue;
		if (banned.includes(id)) continue;
		// 需像武将：对象含面板血量，或为 [hp, maxHp] 数组形态
		if (!Array.isArray(c) && c.hp == null && c.maxHp == null) continue;
		try {
			if (filt.characterDisabled?.(id)) continue;
			if (filt.characterDisabled2?.(id)) continue;
		} catch {
			/* ignore */
		}
		out.push(id);
	}
	return out;
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
	view.nodeDialog = null;
	view.phase = "dungeon";
	bump();
}

/** 从存档里的进行态恢复副本探索（真实对局结束/刷新页面后回到副本页；已判定胜负的回到结算页） */
export function resumeRun() {
	const run = view.ctrl?.data.run;
	if (!run) return false;
	view.layout = run.layout;
	view.party = run.party.slice();
	view.cur = run.cur;
	view.dungeonHp = { ...run.hp };
	view.phase = run.settleWin == null ? "dungeon" : "settle";
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
		// 当天已招募过干员则不可再刷新候选（换天后自动恢复）
		if (view.ctrl.hasRecruitedToday()) {
			console.warn("[GloriousIdeal] 今日已招募，天灾信使暂不提供刷新");
			return;
		}
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
	// 脚下是没铲开的障碍：这条路整个堵死，只能重新尝试铲除或撤退
	const here = view.layout.nodes.find(n => n.index === view.cur);
	if (here && isBlockedObstacle(here)) return;

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
		const allyEquip = Object.fromEntries(party.map(id => [id, view.ctrl?.equipStatOf(id) ?? {}]));
		// equipped 处于 reactive 视图内是 Proxy，postMessage 的结构化克隆会拒绝 Proxy → 必须转成普通数组再下发
		const allyEquips = Object.fromEntries(party.map(id => [id, [...(view.ctrl?.data.roster.find(o => o.id === id)?.equipped ?? [])]]));
		view.battling = true; // 隐藏 GI 覆盖层，露出真实对局界面
		bump();
		let res: BattleResult;
		try {
			const { startBattle } = await import("../battleHost.js");
			res = await startBattle({
				dungeonId: view.layout.dungeonId,
				nodeIndex: index,
				party,
				allyHp: preHp,
				allyLevel,
				allyEquip,
				allyEquips,
			});
		} finally {
			view.battling = false;
		}
		// 掉落当场 roll 好随简报一起展示；玩家确认简报时才并入 run.loot。
		view.battleReport = { result: res, preHp, party, loot: rollBattleRewards(res.win, view.layout.difficulty) };
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
	// 障碍/宝箱：走上去就要玩家答复（障碍不铲不开、宝箱可放弃），答复过就不再弹
	if (isEventNode(node) && !node.cleared && !node.decided) view.nodeDialog = index;
	bump();
}

/** 当前脚下节点是否还能再交互（未铲的障碍 / 未开的宝箱）：行动区据此给「交互」入口 */
export function curInteractable(): boolean {
	const l = view.layout;
	if (!l) return false;
	const here = l.nodes.find(n => n.index === view.cur);
	if (!here || !isEventNode(here) || here.cleared) return false;
	// 障碍即使已放弃交互也仍待处理（它就是堵路的那块石头）
	return here.event === "obstacle" || !here.decided;
}

/** 重新打开当前节点的交互弹窗 */
export function reopenNodeDialog() {
	if (!curInteractable()) return;
	view.nodeDialog = view.cur;
	bump();
}

/** 铲除障碍（不给任何奖励，只开路）：消耗 1 后勤小队，或全员 -1 体力 +12 压力 */
export function clearObstacle(index: number, mode: "supply" | "force"): { ok: boolean; reason?: string } {
	if (!view.ctrl) return { ok: false, reason: "无战役" };
	const r = view.ctrl.clearObstacle(index, mode);
	if (r.ok) {
		const run = view.ctrl.data.run;
		if (run) {
			view.dungeonHp = { ...run.hp };
			view.party = run.party.slice();
			if (!run.party.length) requestSettlement(false); // 开路开到人没了
		}
		view.dungeonNotice = r.died?.length ? `💀 铲除障碍时倒下：${r.died.map(opName).join("、")}` : "🪨 障碍已铲除，路通了";
		view.nodeDialog = null;
		persist();
		bump();
	}
	return r;
}

/** 开启宝箱：消耗 1 后勤小队，掉落当场 roll 进暂存战利品 */
export function openTreasure(index: number): { ok: boolean; reason?: string } {
	if (!view.ctrl) return { ok: false, reason: "无战役" };
	const r = view.ctrl.openTreasure(index);
	if (r.ok) {
		const list = lootNames(r.loot);
		view.dungeonNotice = list ? `✨ 开箱收获（结算时入账）：${list}` : "✨ 箱子是空的";
		view.nodeDialog = null;
		persist();
		bump();
	}
	return r;
}

/** 放弃节点交互：不消耗任何东西。宝箱＝直接路过；障碍＝继续堵着（弹窗关掉，人还站在原地） */
export function dismissNode() {
	const index = view.nodeDialog;
	if (index == null || !view.ctrl) return;
	view.ctrl.dismissNode(index);
	view.nodeDialog = null;
	view.dungeonNotice = "🚶 你没有动它";
	persist();
	bump();
}

/** 掉落摘要文案（物品名 + 装备名），供提示条使用 */
function lootNames(loot?: LootBundle): string {
	if (!loot) return "";
	const parts: string[] = [];
	for (const [id, n] of Object.entries(loot.items)) {
		if (n > 0) parts.push(`${getItem(id as ItemId)?.name ?? id}×${n}`);
	}
	for (const q of loot.equips) parts.push(getEquipment(q)?.name ?? q);
	if (loot.originite > 0) parts.push(`源石碇 ${loot.originite}`);
	return parts.join("、");
}

/**
 * 请求结束本次远征（只打标记 + 进结算页，真正入账/丢弃等结算页确认）。
 * 撤退走 win=false（讨伐失败口径），完成走 win=true。
 */
export function requestSettlement(win: boolean) {
	if (!view.ctrl?.data.run) return;
	view.ctrl.requestSettlement(win);
	view.nodeDialog = null;
	view.battleReport = null;
	view.phase = "settle";
	persist();
	bump();
}

/** 撤退：按讨伐失败结算（UI 需先做二次确认） */
export const retreat = () => requestSettlement(false);

/** 完成讨伐：仅在主将已被击败后可用 */
export function canComplete(): boolean {
	const l = view.layout;
	if (!l) return false;
	const boss = l.nodes.find(n => n.event === "boss");
	return !!boss?.cleared;
}

export const completeDungeon = () => requestSettlement(true);

/** 结算页确认：此刻才落库（战利品入账/丢弃 + 消耗品回收 + 任务结算 + 清进行态） */
export function confirmSettlement() {
	const ctrl = view.ctrl;
	if (!ctrl?.data.run) {
		view.phase = "camp";
		goCamp();
		return;
	}
	const s = ctrl.finishRun();
	console.log("[GloriousIdeal] 远征结算", s);
	view.layout = null;
	view.dungeonHp = {};
	view.dungeonNotice = "";
	view.nodeDialog = null;
	view.party = [];
	persist();
	goCamp();
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
 * 胜利 → 节点通过并把当前节点设为该战斗节点（#4）；
 * 失败 / 小队打光 → 进结算页（撤退同一路径），由玩家在结算页确认后统一落库。
 */
export function confirmBattleReport() {
	const rep = view.battleReport;
	if (!rep || !view.ctrl) return;
	view.battleReport = null;
	const { result } = rep;
	const out = view.ctrl.applyBattleResult(result.win, result.finalHp, result.nodeIndex, result.deaths, result.kills, rep.loot);
	persist();

	const run = view.ctrl.data.run;
	if (!run) return;
	view.party = run.party.slice();
	view.dungeonHp = { ...run.hp };
	if (out.ended) {
		requestSettlement(false); // 讨伐失败：走结算页（按失败口径）
		return;
	}
	run.cur = result.nodeIndex;
	view.cur = result.nodeIndex;
	bump();
}
