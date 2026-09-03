/**
 * GloriousIdeal/index.ts —— 「特蕾西娅与瑰丽理想」模式的注册入口
 *
 * 无名杀扩展模式接入方式（引擎侧机制，见 noname/init/import.ts 与 game.addMode）：
 *   1. lib.mode[name] = { ..., fromextension: true }      → 让菜单/选模式页认识它
 *   2. lib.config.all.mode.push(name)                     → 加入模式列表
 *   3. lib.init["setMode_" + name] = async () => import   → 选定后导入模式本体
 * 引擎随后会执行 start()（本模式事件树的根，支持 async）。
 *
 * 注册时机：WhichWay 的 init.js 在扩展启动阶段调用 registerGloriousIdealMode()。
 * 因此本文件不产生副作用，只在显式调用时注册，避免重复注册/污染全局。
 */

import { lib, game } from "noname";

export const GLORIOUS_IDEAL_MODE = "gloriousideal";

/** 模式的中文名（会出现在选模式菜单） */
export const GLORIOUS_IDEAL_NAME = "特蕾西娅与瑰丽理想";

/**
 * 注册模式。可安全重复调用（幂等）。
 *
 * @returns 是否本次新注册
 */
export function registerGloriousIdealMode(): boolean {
	const name = GLORIOUS_IDEAL_MODE;
	if (lib.mode[name]) return false; // 已注册（例如热重载）

	if (!lib.config.all.mode.includes(name)) lib.config.all.mode.push(name);
	lib.translate[name] = GLORIOUS_IDEAL_NAME;

	lib.mode[name] = {
		name: GLORIOUS_IDEAL_NAME,
		config: getModeConfig(),
		// 选模式页背景（OnloadSplash 会用 parseResourceAddress 解析；图片见
		// image/mode/backgroud/gloriousideal.png，构建时随 image/ 整体复制）
		splash: "ext:WhichWay/image/mode/backgroud/gloriousideal.png",
		fromextension: true,
	};

	// 选定模式后的导入入口（引擎 importMode 会先走这里）
	lib.init["setMode_" + name] = async () => {
		await game.import("mode", () => makeModeInfo(name));
	};

	// 让「扩展管理」页面能看到本模式
	try {
		const extName = "WhichWay";
		lib.config.extensionInfo[extName] ??= {};
		lib.config.extensionInfo[extName].mode ??= [];
		if (!lib.config.extensionInfo[extName].mode.includes(name)) {
			lib.config.extensionInfo[extName].mode.push(name);
		}
	} catch (e) {
		console.warn("[GloriousIdeal] 写入扩展信息失败（不影响使用）", e);
	}

	console.info(`[GloriousIdeal] 模式已注册：${GLORIOUS_IDEAL_NAME}（${name}）`);
	return true;
}

/**
 * 该模式的配置项（显示在「选模式 → 配置」里，选 mode 后可用 game.get.config 读取）
 */
function getModeConfig(): Record<string, unknown> {
	return {
		// example: {
		//   name: "示例配置",
		//   init: 1,
		// },
	};
}

/**
 * 模式本体（importModeConfig 形状）。start 为根事件，支持 async。
 * 各子模块在此被引用，确保打包时被 vite 一并打进产物。
 */
function makeModeInfo(name: string) {
	return {
		name,
		// 模式特有技能/卡牌若需要可在此注册（TODO）
		async start() {
			const { start: startFlow } = await import("./start.js");
			await startFlow();
		},
	};
}
