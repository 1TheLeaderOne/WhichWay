/**
 * launchPad/config.ts —— 把「驶舰之向启动页」开关以 `onConfig` 钩子的形式注册进扩展设置
 *
 * 之所以不走 src/config/index.js 的 whichWayOriginConfig：
 * 那里是 WhichWay 主配置的集中声明处，启动页属于独立功能模块，
 * 通过 onConfig 钩子注册可以让它自带全部逻辑（默认值、点击行为、提示），
 * 与主配置表解耦——删掉整个 launchPad 目录也不会在主配置里留下残渣。
 *
 * 注册时机：由 registerLaunchPadSplash() 调用（init.js 扩展启动阶段），
 * 必须早于引擎读取 extension 的 config（即 extension.js 的 default 导出）。
 */

import { onConfig } from "../hooks/index.js";
import { whichWayToast } from "../toast/index.ts";
import { LAUNCH_PAD_CONFIG_KEY, LAUNCH_PAD_NAME, applyLaunchPadStyle, ensureLaunchPadDefault, isLaunchPadEnabled } from "./setting.ts";

/** 设置项名（引擎会自动补 `extension_WhichWay_` 前缀，与 LAUNCH_PAD_CONFIG_KEY 对应） */
const CONFIG_NAME = "launchPad";

let registered = false;

/**
 * 注册启动页设置项（幂等）。
 *
 * 引擎侧约定：扩展的 config 项若自带 `onclick`，引擎**不会**自动保存开关状态
 * （见 noname/ui/create/menu/pages/exetensionMenu.js），因此 onclick 内部必须自己落盘。
 */
export function registerLaunchPadConfig(): boolean {
	if (registered) return false;

	// 先跑一次默认值/一致性处理（幂等），保证 init 与引擎实际的 splash_style 一致
	ensureLaunchPadDefault();

	onConfig({
		name: CONFIG_NAME,
		priority: 798,
		obj: {
			name: CONFIG_NAME,
			options: {
				name: `${LAUNCH_PAD_NAME}启动页`,
				intro: "开启后,游戏启动页默认切换为「驶舰之向」视差轮播（下次启动游戏时生效;也可在 选项→外观→启动页 中手动切换）",
				init: isLaunchPadEnabled(),
				onclick(bool: boolean) {
					applyLaunchPadStyle(bool);
					whichWayToast.showToast(
						bool
							? `[${LAUNCH_PAD_NAME}] 已开启驶舰之向启动页,下次启动游戏时生效`
							: `[${LAUNCH_PAD_NAME}] 已关闭驶舰之向启动页,已还原为之前的启动页样式`,
						3000,
						"topLeft",
						"configTips_launchPad"
					);
				},
			},
		},
	});

	registered = true;
	console.info(`[launchPad] 设置项已注册：${CONFIG_NAME}（${LAUNCH_PAD_CONFIG_KEY}）`);
	return true;
}
