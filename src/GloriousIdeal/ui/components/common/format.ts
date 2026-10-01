/**
 * format.ts —— 两个 UI 系统共用的展示辅助（干员名 / 状态徽章 / 等级星等 / 立绘与资源 URL）
 * 数据来源：引擎 get.character（中文名）、campaign 的 OperatorState、WhichWay 立绘资源。
 */
import { get, lib } from "noname";
import { whichWayFile } from "../../../../file.js";
import type { OperatorState, DeathInfo } from "../../state/campaign.js";
import { getDungeon } from "../../../data/dungeons.js";

/** 扩展内图片资源 URL（相对 image/ 目录，如 "character/amiyamrfz.jpg"、"background/ideal.jpg"） */
export const giImg = (rel: string): string => whichWayFile.compilePath(`img:${rel}`);

/** 干员立绘 URL：image/character/{id}.jpg（部分干员可能缺图，配合 <img @error> 回退到首字头像） */
export const opPortrait = (id: string): string => giImg(`character/${id}.jpg`);

/**
 * 干员「当前皮肤」立绘 URL：优先走驶舰之向皮肤系统（whichWay.skin.getCurrentSkinPath），
 * 它会按玩家选定的皮肤返回对应图片、非 WhichWay 武将回退本体 img，取不到再退回基础立绘。
 */
export const opSkinPortrait = (id: string): string => {
	const skin = (window as unknown as { whichWay?: { skin?: { getCurrentSkinPath?: (n: string) => string } } }).whichWay?.skin;
	if (skin?.getCurrentSkinPath) {
		try {
			const p = skin.getCurrentSkinPath(id);
			if (typeof p === "string" && p) return p;
		} catch {
			/* ignore */
		}
	}
	return opPortrait(id);
};

/**
 * 装备图 URL：image/model/GloriousIdeal/equips/{img ?? id}.png。
 * 可为装备指定图片名（img 字段）；缺省用同 id 图片。磁盘上找不到时由 EquipIcon 的 @error 回退到默认图。
 */
export const equipImage = (id: string, img?: string): string => giImg(`model/GloriousIdeal/equips/${img || id}.png`);
/** 缺省装备图（equips 中找不到对应图片时回退） */
export const equipDefaultImage = (): string => giImg(`model/GloriousIdeal/equips/rogue_6_relic_legacy_1.png`);

/** 干员显示名：get.translation 查 lib.translate 中文译名（查不到退回原始 id） */
export const opName = (id: string): string => {
	try {
		const t = get.translation(id);
		if (typeof t === "string" && t && t !== id) return t;
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

/* ============ 干员资料读取（引擎 lib.character） ============ */

interface CharacterDef {
	hp?: number | [number, number];
	maxHp?: number;
	hujia?: number;
	group?: string;
	sex?: string;
	skills?: string[];
	whichWay?: { arknight?: { camp?: string; tags?: string[] } };
}

/** 取干员角色定义（读不到返回空对象，调用方需容错） */
export const opChar = (id: string): CharacterDef => {
	try {
		return (lib.character as Record<string, CharacterDef>)[id] || {};
	} catch {
		return {};
	}
};

/** 读取初始体力值 / 体力上限：兼容 `hp` 为数字或 `[体力, 上限]` 数组、缺省一方互相回填 */
const rawHpPair = (id: string): { hp: number; maxHp: number } => {
	const c = opChar(id);
	const raw = c.hp;
	let hp: number | undefined;
	let maxHp: number | undefined = c.maxHp;
	if (Array.isArray(raw)) {
		hp = raw[0];
		if (maxHp === undefined) maxHp = raw[1];
	} else {
		hp = raw;
	}
	if (maxHp === undefined) maxHp = hp;
	if (hp === undefined) hp = maxHp;
	return { hp: hp ?? 4, maxHp: maxHp ?? 4 };
};

/** 体力上限 */
export const opMaxHp = (id: string): number => rawHpPair(id).maxHp;
/** 初始体力值（可能小于体力上限） */
export const opHp = (id: string): number => rawHpPair(id).hp;
/** 护甲值（=初始护盾） */
export const opArmor = (id: string): number => opChar(id).hujia ?? 0;

/** 体力/护盾展示视图：compact=true 表示上限+护盾 >6，改用纯数字而非格子展示 */
export interface HpView {
	hp: number;
	maxHp: number;
	hujia: number;
	compact: boolean;
}
export const opHpView = (id: string): HpView => {
	const { hp, maxHp } = rawHpPair(id);
	const hujia = opArmor(id);
	return { hp, maxHp, hujia, compact: maxHp + hujia > 6 };
};

/** 体力条图片（image/ui 下引擎素材） */
export const hpFullIcon = (): string => giImg("ui/actualHp.png");
export const hpEmptyIcon = (): string => giImg("ui/emptyHp.png");
export const hpShieldIcon = (): string => giImg("ui/shield.png");

/** 干员简介：引擎档案人物介绍（lib.characterIntro[id]），去 HTML 标签后返回纯文本 */
export const opIntro = (id: string): string => {
	try {
		const raw = (lib as unknown as { characterIntro?: Record<string, string> }).characterIntro?.[id];
		if (typeof raw === "string" && raw) return raw.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
	} catch {
		/* ignore */
	}
	return "";
};

/** 干员称号：lib.characterTitle[id]（含 HTML 富文本，去标签） */
export const opTitle = (id: string): string => {
	try {
		const raw = (lib as unknown as { characterTitle?: Record<string, string> }).characterTitle?.[id];
		if (typeof raw === "string" && raw) return raw.replace(/<[^>]+>/g, "").trim();
	} catch {
		/* ignore */
	}
	return "";
};

export interface OpSkill {
	id: string;
	name: string;
	info: string;
}
/** 技能列表：名 + 描述（来自 lib.translate[skill] / [skill_info]） */
export const opSkills = (id: string): OpSkill[] => {
	const skills = opChar(id).skills || [];
	return skills
		.map(sk => {
			let name = sk;
			let info = "";
			try {
				const tn = lib.translate[sk];
				if (typeof tn === "string" && tn) name = tn;
				const ti = lib.translate[sk + "_info"];
				if (typeof ti === "string") info = ti;
			} catch {
				/* ignore */
			}
			return { id: sk, name, info };
		})
		.filter(s => s.name || s.info);
};

/* ============ 墓园：副本名 / 死因文案 ============ */

/** 副本显示名（无 id 返回空串） */
export const dungeonName = (id: string | null): string => {
	if (!id) return "";
	try {
		return getDungeon(id)?.name ?? id;
	} catch {
		return id;
	}
};

/**
 * 死因文案（墓园展示）：
 *  - 压力爆炸 → 崩溃而亡
 *  - 无来源   → 某天在某副本意外牺牲
 *  - 击杀者是自己 → 自杀；是友方 → 死于友方之手；是敌方 → 被其杀死
 */
export const deathReasonText = (d: DeathInfo): string => {
	const day = `第 ${d.day} 天`;
	const where = d.dungeonId ? `在「${dungeonName(d.dungeonId)}」` : "";
	if (d.cause === "stress") return `${day}${where}压力崩溃而亡`;
	if (d.cause === "accident" || !d.killerFaction) return `${day}${where}意外牺牲`;
	const who = d.killerId ? opName(d.killerId) : d.killerFaction === "enemy" ? "敌军" : "友军";
	switch (d.killerFaction) {
		case "self":
			return `${day}${where}自杀`;
		case "ally":
			return `${day}${where}死于友方（${who}）之手`;
		default:
			return `${day}${where}被${who}杀死`;
	}
};

/** 死因分类的短标签（徽章用） */
export const deathCauseBadge = (d: DeathInfo): { label: string; cls: string } => {
	switch (d.cause) {
		case "stress":
			return { label: "压力崩溃", cls: "warn" };
		case "accident":
			return { label: "意外", cls: "dead" };
		default:
			if (d.killerFaction === "self") return { label: "自杀", cls: "dead" };
			if (d.killerFaction === "ally") return { label: "误伤", cls: "warn" };
			return { label: "战死", cls: "bad" };
	}
};
