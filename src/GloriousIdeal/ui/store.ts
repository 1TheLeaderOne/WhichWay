/**
 * store.ts —— GloriousIdeal UI 的 Vue 响应式状态与流转
 *
 * 约定：所有页面渲染都读 view（reactive），所有操作都走本文件的 action；
 * 需要强制重绘时调 bump()（tick+1，根节点以 :key 挂 tick）。
 * 战斗等重量级 TODO 照旧标记。
 */

import { reactive } from "vue";
import { CampaignController, CampaignData, createInitialCampaign, saveCampaign, loadCampaign, clearCampaignSave } from "../state/campaign.js";
import { generateDungeon, DungeonLayout } from "../dungeon.js";
import { Difficulty } from "../data/dungeons.js";
import { BUILDINGS, BuildingId } from "../data/buildings.js";
import { DUNGEONS, DIFFICULTY, SPECIAL_UNLOCK } from "../data/dungeons.js";
import { BARRACKS_CAPACITY } from "../data/operators.js";
import { UNITY, MAX_DAY } from "../data/resources.js";

export type Phase = "title" | "camp" | "recruit" | "dispatch" | "dungeon" | "end";

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
};

// ---------------- actions ----------------

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
	bump();
}

export function goDungeon(party: string[], dungeonId: string, difficulty: Difficulty) {
	if (!view.ctrl) return;
	view.layout = generateDungeon(dungeonId, difficulty);
	view.party = party.slice();
	view.cur = view.layout.entry;
	view.phase = "dungeon";
	bump();
}

export function backToCamp() {
	persist();
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

// ---------------- 副本探索 ----------------

export async function moveTo(index: number) {
	if (!view.ctrl || !view.layout) return;
	const node = view.layout.nodes.find(n => n.index === index);
	if (!node) return;
	if (node.kind === "outpost" && node.hasEnemy) {
		// TODO: 真实标准对垒（见 dungeon.ts startBattle）；当前按占位返回
		const { startBattle } = await import("../dungeon.js");
		const win = await startBattle(view.layout, index, view.party);
		if (win) {
			node.hasEnemy = false;
			node.cleared = true;
			console.log("[GloriousIdeal] 战斗胜利 —— TODO 压力/掉落/经验结算");
		} else {
			console.log("[GloriousIdeal] 战斗失败 —— TODO 撤退结算");
		}
	} else {
		node.explored = true;
	}
	view.cur = index;
	bump();
}

/** 结束探索：任务结算占位 → 回到营地（已推进到第二天） */
export function endDungeon() {
	if (!view.ctrl) return;
	// TODO: 按 绘图/清扫/击败boss 判定；成功加副本经验
	view.ctrl.settleMission(Math.random() > 0.4);
	persist();
	goCamp();
}
