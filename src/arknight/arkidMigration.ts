import { lib, game } from "noname";
import { whichWayUtil } from "../utill.js";
import { legacyCharIds } from "./legacyCharIds.js";

/**
 * 一次性旧干员id 存档迁移
 *
 * 干员id 已全部换成明日方舟uid（aibulanamrfz → char_450_necras），但玩家改名的**前**
 * 存下来的配置里的键还是旧id，不改写就会出现「皮肤丢失、配音语言回退、模组失效、
 * 战役进度里查不到干员」。这里在启动早期一次性把它们换成新id，之后写标记位不再重复执行。
 *
 * 必须在 whichWayInit 的阶段跑起来之前调用：globalSave 在入口就求值，
 * skinConfig / audioConfig.custom 与 modules/index.ts 里的 modulesSet 抓走的都是
 * 「lib.config 里那个对象引用」，所以本文件一律**原地改写**而不是换一个新对象——
 * 换对象会让这些已经存在的引用继续指向旧数据。
 */

/** 迁移标记位（与 extension_WhichWay_characterPackDefaulted 同一套一次性开关写法） */
const MIGRATED_KEY = "arkidMigrated";

/**
 * 把「旧干员id 作键」的对象原地改写为新id。
 * @returns 改写的键数量
 */
function remapKeys(obj: Record<string, any> | undefined | null): number {
	if (!obj || typeof obj !== "object") return 0;
	let count = 0;
	//先快照键名，避免新写入的键被本轮再读一遍
	for (const key of Object.keys(obj)) {
		const next = legacyCharIds[key];
		if (next === undefined) continue;
		//新键已经有值：说明改名后又手动设置过，旧值已经过期，两边都丢弃旧值
		if (!Object.prototype.hasOwnProperty.call(obj, next)) obj[next] = obj[key];
		delete obj[key];
		count++;
	}
	return count;
}

/**
 * 改写字符串里出现的旧id（按「标识符片段」整段匹配，所以路径/URL 也能安全处理：
 * `extension/WhichWay/image/skin/gelaidunmrfz/经典形象.jpg` 只会命中 gelaidunmrfz）。
 */
function remapIdsInString(text: string): string {
	return text.replace(/[A-Za-z0-9_]+/g, word => legacyCharIds[word] ?? word);
}

/** 递归改写任意 JSON 结构里的旧id（键与字符串值都查表） */
function deepRemap(node: any): number {
	if (Array.isArray(node)) {
		let count = 0;
		for (let i = 0; i < node.length; i++) {
			const value = node[i];
			if (typeof value === "string") {
				const next = legacyCharIds[value];
				if (next !== undefined) {
					node[i] = next;
					count++;
				}
			} else count += deepRemap(value);
		}
		return count;
	}
	if (!node || typeof node !== "object") return 0;
	let count = remapKeys(node);
	for (const key in node) {
		const value = node[key];
		//字符串值本身就是id（如 roster[].id）时也要换，换不掉才继续往里钻
		if (typeof value === "string") {
			const next = legacyCharIds[value];
			if (next !== undefined) {
				node[key] = next;
				count++;
			}
		} else count += deepRemap(value);
	}
	return count;
}

/**
 * 瑰丽理想战役存档的 localStorage key。
 * 这里写死字面量而不去 import GloriousIdeal/state/campaign.ts：那个模块只在开发服务器下加载，
 * 迁移却要在所有环境跑；两边改动时必须同步（SAVE_KEY 在 campaign.ts:24）。
 */
const GLORIOUS_IDEAL_SAVE_KEY = "gloriousIdeal_campaign_v1";

function migrateGloriousIdeal(): number {
	let raw: string | null = null;
	try {
		raw = localStorage.getItem(GLORIOUS_IDEAL_SAVE_KEY);
	} catch {
		return 0;
	}
	if (!raw) return 0;
	try {
		const data = JSON.parse(raw);
		const count = deepRemap(data);
		if (count) localStorage.setItem(GLORIOUS_IDEAL_SAVE_KEY, JSON.stringify(data));
		return count;
	} catch (e) {
		console.error("[WhichWay] 瑰丽理想战役存档迁移失败，已跳过", e);
		return 0;
	}
}

function migrateAudioConfig(save: any): number {
	const audioConfig = save?.audioConfig;
	const count = remapKeys(audioConfig?.custom);
	//每个干员记录的 skills 是技能id 列表，跟着干员id 一起换才与改名后的注册表一致
	for (const entry of Object.values(audioConfig?.custom ?? {})) {
		if (Array.isArray((entry as any).skills)) (entry as any).skills = (entry as any).skills.map((skill: string) => legacyCharIds[skill] ?? skill);
	}
	if (count) whichWayUtil.saveConfig("audioConfig", audioConfig);
	return count;
}

/**
 * 执行迁移；无论是否有改动都写标记位，只跑这一次。
 */
export function migrateLegacyCharIds(): void {
	if (whichWayUtil.config(MIGRATED_KEY) === true) return;

	const detail: string[] = [];
	const step = (label: string, run: () => number) => {
		try {
			const count = run();
			if (count) detail.push(`${label} ${count}`);
		} catch (e) {
			//单项失败不影响其余：配置结构可能被别的扩展改过
			console.error(`[WhichWay] ${label} 迁移失败，已跳过`, e);
		}
	};

	const save = window.whichWaySave;

	step("皮肤", () => {
		const count = remapKeys(save?.skinConfig);
		if (count) whichWayUtil.saveConfig("skinConfig", save.skinConfig);
		return count;
	});

	step("本体皮肤", () => {
		const skin = lib.config.skin;
		if (!skin) return 0;
		let count = remapKeys(skin);
		for (const value of Object.values(skin)) {
			//值为 [皮肤名, 路径]，路径里的 image/skin/{旧id}/ 段同样要换
			if (!Array.isArray(value)) continue;
			const path = value[1];
			if (typeof path !== "string") continue;
			const next = remapIdsInString(path);
			if (next !== path) {
				value[1] = next;
				count++;
			}
		}
		if (count) whichWayUtil.saveConfig("skin", skin, undefined);
		return count;
	});

	step("千幻皮肤", () => {
		const qhly = lib.config.qhly_skinset;
		if (!qhly) return 0;
		let count = 0;
		for (const key of ["skin", "skinAudioList", "audioReplace", "djtoggle"]) count += remapKeys(qhly[key]);
		if (count) whichWayUtil.saveConfig("qhly_skinset", qhly, undefined);
		return count;
	});

	step("禁用动皮", () => {
		const ban = lib.config.banSkinSJZX;
		if (!ban) return 0;
		const count = remapKeys(ban);
		if (count) game.saveConfig("banSkinSJZX", ban);
		return count;
	});

	step("配音", () => migrateAudioConfig(save));

	step("模组", () => {
		//modulesSet 是 getter，返回的就是 lib.config 里的对象，remapKeys 原地改后直接落库
		const modulesSet = save?.modulesSet;
		const count = remapKeys(modulesSet);
		if (count) whichWayUtil.saveConfig("modulesSet", modulesSet);
		return count;
	});

	step("冲突皮肤选择", () => {
		const selected = whichWayUtil.config("whichWay_ConfictedSkin_selectedSkins");
		if (!selected) return 0;
		const count = remapKeys(selected);
		if (count) whichWayUtil.saveConfig("whichWay_ConfictedSkin_selectedSkins", selected);
		return count;
	});

	step("瑰丽理想", migrateGloriousIdeal);

	game.saveConfig(`extension_WhichWay_${MIGRATED_KEY}`, true);
	if (detail.length) console.log(`%c[WhichWay] 旧干员id 存档迁移完成：${detail.join("，")}`, "color:#4a9eff;");
}
