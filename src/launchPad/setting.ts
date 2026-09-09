/**
 * launchPad/setting.ts —— 启动页开关的「轻量共享层」
 *
 * 只依赖 noname 全局对象，不引入 Vue / 组件，以便：
 *   - src/config/index.js（扩展设置界面）在很早的阶段就能读写开关；
 *   - src/launchPad/index.ts（启动页实现）读取开关决定默认样式。
 *
 * 引擎侧约定：
 *   - 扩展设置项会被引擎自动加上 `extension_WhichWay_` 前缀落盘
 *     （见 noname/game/index.js loadExtension），故这里直接写全名便于读写；
 *   - 启动页样式由 `lib.config.splash_style` 决定，取值即启动页实现的 id
 *     （见 noname/init/index.ts：lib.onloadSplashes.find(i => i.id === lib.config.splash_style)）。
 */

import { lib, game } from "noname";

/** 本启动页样式的 id（同时也是 splash_style 的取值） */
export const LAUNCH_PAD_ID = "whichway-carousel";
/** 显示在「选项 → 外观 → 启动页」里的名字 */
export const LAUNCH_PAD_NAME = "驶舰之向";

/** 扩展设置项在 lib.config 中的完整 key（引擎前缀 + 设置项名） */
export const LAUNCH_PAD_CONFIG_KEY = "extension_WhichWay_launchPad";

/** 关闭开关时用来还原的「上一个启动页样式」。
 *  刻意不带 `extension_` 前缀，避免被 loadExtension 收集成扩展设置项。 */
const PREV_STYLE_KEY = "WhichWay_launchpad_prevStyle";

/** 旧版一次性自动启用标记（兼容存量存档，新逻辑用 LAUNCH_PAD_CONFIG_KEY） */
const LEGACY_AUTOSET_KEY = "extension_WhichWay_launchpad_autoset";

/** 引擎内置启动页样式的默认 id（关闭本开关时的兜底还原目标） */
const STOCK_SPLASH_ID = "style1";

function readConfig(key: string): any {
	try {
		return (lib.config as any)[key];
	} catch {
		return undefined;
	}
}

function writeConfig(key: string, value: any): void {
	try {
		game.saveConfig(key, value);
	} catch (e) {
		console.warn(`[launchPad] 写入配置 ${key} 失败`, e);
	}
}

/** 开关当前是否开启 */
export function isLaunchPadEnabled(): boolean {
	return readConfig(LAUNCH_PAD_CONFIG_KEY) === true;
}

/** 当前引擎实际使用的启动页样式 id */
export function getCurrentSplashStyle(): string {
	const v = readConfig("splash_style");
	return typeof v === "string" && v ? v : "";
}

/** 启动页样式是否已经指向「驶舰之向」 */
export function isLaunchPadActive(): boolean {
	return getCurrentSplashStyle() === LAUNCH_PAD_ID;
}

/**
 * 应用开关：
 *   - 开启 → 记录当前样式（用于还原）并把 splash_style 切到「驶舰之向」；
 *   - 关闭 → 仅当当前确实是「驶舰之向」时，还原到记录中的样式（没有记录则用引擎默认 style1），
 *           避免覆盖玩家在「选项 → 外观 → 启动页」里的其它选择。
 */
export function applyLaunchPadStyle(on: boolean): void {
	const cur = getCurrentSplashStyle();
	if (on) {
		if (cur && cur !== LAUNCH_PAD_ID) writeConfig(PREV_STYLE_KEY, cur);
		writeConfig("splash_style", LAUNCH_PAD_ID);
	} else if (cur === LAUNCH_PAD_ID) {
		const prev = readConfig(PREV_STYLE_KEY);
		writeConfig("splash_style", typeof prev === "string" && prev && prev !== LAUNCH_PAD_ID ? prev : STOCK_SPLASH_ID);
	}
	writeConfig(LAUNCH_PAD_CONFIG_KEY, !!on);
}

/**
 * 处理「首次加载」：玩家从没设置过这个开关时给一个默认值。
 *
 * 规则：
 *   - 已经明确设置过（true/false）→ 完全尊重，只在开关为「开」但样式被改走时补正；
 *   - 从未设置过 → 若当前样式是引擎默认（style1 / 未设置）或旧版自动启用过，则默认开启，
 *     否则（玩家自己选了别的样式）默认关闭，不抢玩家的选择。
 *
 * 幂等，可重复调用。
 */
export function ensureLaunchPadDefault(): void {
	const known = typeof readConfig(LAUNCH_PAD_CONFIG_KEY) === "boolean";
	if (known) {
		// 开关为「开」但玩家后来在外观里换了别的样式 → 不再强行改回来，只同步开关状态
		if (isLaunchPadEnabled() && getCurrentSplashStyle() && !isLaunchPadActive()) {
			writeConfig(LAUNCH_PAD_CONFIG_KEY, false);
		}
		return;
	}
	const style = getCurrentSplashStyle();
	const legacy = readConfig(LEGACY_AUTOSET_KEY) === true;
	// 旧版本（只有一次性 autoset 标记、没有设置项）已经把样式切过来的老玩家也算「已开启」
	const on = legacy || !style || style === STOCK_SPLASH_ID || style === LAUNCH_PAD_ID;
	if (on) applyLaunchPadStyle(true);
	else writeConfig(LAUNCH_PAD_CONFIG_KEY, false);
}
