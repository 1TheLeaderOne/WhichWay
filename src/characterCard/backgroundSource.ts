import { whichWayUtil } from "../utill.js";

/**
 * 「武将卡背景来源」配置项名（运行时键为 `lib.config.extension_WhichWay_<它>`）。
 *
 * 声明在 `./index.ts`（与武将卡样式开关放在一起），读取方为背景面板。
 * 这里单独成一个模块是因为面板不能反向 import `./index.ts`：
 * `index.ts` → `CharacterCard.vue` → `BackgroundPanel.vue` 已经构成链路，再导回来就是循环依赖。
 */
export const BACKGROUND_SOURCE_CONFIG_NAME = "characterCardBackgroundSource";

/** 背景来源模式：精选 / 全部 */
export type BackgroundSourceMode = "featured" | "all";

/** 模式的界面文案（配置项与面板共用） */
export const backgroundSourceItems: Record<BackgroundSourceMode, string> = {
	featured: "精选",
	all: "全部",
};

/**
 * 当前背景来源模式。
 * 值缺失或异常（从未配置过）时按默认值「精选」处理。
 */
export function getBackgroundSourceMode(): BackgroundSourceMode {
	const value = whichWayUtil.config(BACKGROUND_SOURCE_CONFIG_NAME);
	return value === "all" ? "all" : "featured";
}
