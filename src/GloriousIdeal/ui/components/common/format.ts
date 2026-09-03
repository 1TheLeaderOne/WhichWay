/**
 * format.ts —— 两个 UI 系统共用的展示辅助（干员名 / 状态徽章 / 等级星等）
 * 数据来源：引擎 get.character（中文名）、campaign 的 OperatorState。
 */
import { get } from "noname";
import type { OperatorState } from "../../state/campaign.js";

/** 干员显示名：优先引擎角色中文名，取不到退回原始 id（如 amiyamrfz） */
export const opName = (id: string): string => {
	try {
		const c = get.character(id) as { name?: string } | undefined;
		if (c && typeof c.name === "string" && c.name) return c.name;
	} catch {
		/* ignore */
	}
	return id;
};

/** 等级 → 星等展示（◆ x level，6 级即满 6 星） */
export const levelStars = (level: number): string => "◆".repeat(Math.max(0, Math.min(6, level)));

/** 状态徽章描述 + 语义色（正常/美德/折磨/阵亡） */
export interface StatusBadge {
	label: string;
	cls: string; // ok | warn | bad | dead | virtue
}

export const statusBadge = (op: OperatorState): StatusBadge => {
	if (op.dead) return { label: "☠ 阵亡", cls: "dead" };
	if (op.agony) return { label: "折磨", cls: "bad" };
	if (op.virtue) return { label: `美德 · ${op.virtue}`, cls: "virtue" };
	return { label: "正常", cls: "ok" };
};

/** 压力条色阶：<50 安稳，50-99 警戒（将抵 100），>=100 崩溃边缘/折磨 */
export const stressTone = (s: number): "low" | "mid" | "high" => {
	if (s >= 100) return "high";
	if (s >= 50) return "mid";
	return "low";
};

/** 建筑 emoji 图标 */
export const buildingIcon = (id: string): string => {
	const map: Record<string, string> = {
		military: "🛡",
		babel: "🏛",
		courier: "🕊",
		barracks: "🏕",
		merchant: "⚖",
		graveyard: "🪦",
		camel: "🐫",
	};
	return map[id] ?? "🏗";
};

/** 干员卡占位头像：取中文名首字，取不到用 id 首字母 */
export const opAvatar = (id: string): string => {
	const n = opName(id);
	return n !== id ? n.charAt(0) : id.charAt(0).toUpperCase();
};
