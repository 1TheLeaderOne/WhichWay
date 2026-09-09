/**
 * launchPad/index.ts —— WhichWay「启动页美化」注册入口
 *
 * 无名杀引擎自带扩展启动页接口（OnloadSplash，见 noname/init/onload/onload-splash.d.ts）：
 * 扩展只需把实现类实例 push 进 lib.onloadSplashes，玩家即可在
 * 「选项 → 外观 → 启动页样式」中选用（id / name 自动加入选项列表）。
 *
 * 本模块提供「WhichWay 视差轮播」样式：把引擎的全部玩法模式（lib.config.all.mode，
 * 与官方 splash 页同口径）渲染为明日方舟官网风格的 3D 视差轮播，每个模式一页，
 * 点击「进入」即 resolve(mode) 交给引擎加载对应模式。
 *
 * 开关联动：样式始终注册进引擎（玩家可在「选项 → 外观 → 启动页」里随时选用），
 * 是否**默认**切到本样式由设置项「驶舰之向启动页」决定，见 ./setting.ts 与 src/config/index.js。
 *
 * 接入点：WhichWay 的 init.js 扩展启动阶段调用 registerLaunchPadSplash()（幂等）。
 */

import { lib } from "noname";
import { createApp } from "vue";
import ModeCarousel from "./ModeCarousel.vue";
import { buildLaunchPadItems } from "./data.js";
import { registerLaunchPadConfig } from "./config.ts";
import { LAUNCH_PAD_ID, LAUNCH_PAD_NAME, isLaunchPadEnabled } from "./setting.ts";

export { LAUNCH_PAD_ID, LAUNCH_PAD_NAME };
export { isLaunchPadEnabled, isLaunchPadActive, applyLaunchPadStyle, ensureLaunchPadDefault } from "./setting.ts";

/** 注册后能否在选项中看到（供 init.js 打日志用） */
let registered = false;
export function isLaunchPadRegistered(): boolean {
	return registered;
}

class WhichWayCarouselSplash {
	readonly id: string = LAUNCH_PAD_ID;
	readonly name: string = LAUNCH_PAD_NAME;

	private app: ReturnType<typeof createApp> | null = null;

	/** 启动页渲染：把 node 变为全屏轮播，用户点选模式后 resolve(mode) */
	async init(node: HTMLDivElement, resolve: (mode: string) => void): Promise<void> {
		const items = buildLaunchPadItems();

		// 兜底：没有任何可选模式（理论上不会发生）→ 直接按当前默认模式进入
		if (!items.length) {
			resolve(lib.config.mode as string);
			node.remove();
			return;
		}

		// 接管节点：全屏、无引擎默认 splash 排版
		node.id = "mcb-host";
		node.style.cssText =
			"position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;" +
			"overflow:hidden!important;background:#0c0e13!important;z-index:2147483000!important;";
		// 引擎 #splash 可能带来的字体/指针样式复位
		node.classList.add("mcb-host-root");

		let bg = "";
		try {
			const u = lib.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/bg.jpg") as URL;
			bg = u.href || "";
		} catch {
			bg = "";
		}

		this.app = createApp(ModeCarousel, {
			items,
			bg,
			onPick: (mode: string) => {
				this.dispose(node);
				resolve(mode);
			},
		});
		this.app.mount(node);
	}

	/** 点击进入后的清理：卸载组件、移除节点（自行管理，返回 true 告知引擎） */
	async dispose(node: HTMLDivElement): Promise<boolean> {
		try {
			if (this.app) {
				this.app.unmount();
				this.app = null;
			}
		} catch {
			/* ignore */
		}
		try {
			node.remove();
		} catch {
			/* ignore */
		}
		return true;
	}

	/** 外观设置里的样式小预览 */
	async preview(node: HTMLDivElement): Promise<void> {
		node.className = "button character";
		node.style.width = "200px";
		node.style.height = `${(node.offsetWidth * 9) / 16}px`;
		node.style.display = "flex";
		node.style.flexDirection = "column";
		node.style.alignItems = "center";
		node.style.backgroundSize = "100% 100%";
		try {
			// 与 DefaultSplash.preview 同款：node.setBackgroundImage 传入已解析 URL
			const u = lib.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/whichway_preview.png") as URL;
			(node as any).setBackgroundImage(u.href);
		} catch (e) {
			console.warn("[launchPad] 预览图加载失败", e);
		}
	}
}

/**
 * 注册启动页样式（幂等）。在扩展启动阶段调用即可 —— 引擎在初始化
 * 「选项 → 启动页样式」选项时遍历 lib.onloadSplashes 生成可选项。
 *
 * 注：样式注册与「是否默认启用」解耦——样式始终注册（玩家可在
 * 选项 → 外观 → 启动页 里随时选用），是否默认切到本样式由设置项
 * 「驶舰之向启动页」控制，该设置项由 ./config.ts 通过 onConfig 钩子注册。
 */
export function registerLaunchPadSplash(): boolean {
	try {
		const list = (lib as any).onloadSplashes;
		if (!Array.isArray(list)) return false;
		const existed = list.some((s: { id: string }) => s.id === LAUNCH_PAD_ID);
		if (!existed) {
			list.push(new WhichWayCarouselSplash());
		}
		registered = true;

		// 设置项「驶舰之向启动页」：通过 onConfig 钩子注册（内含默认值处理，幂等）
		registerLaunchPadConfig();

		console.info(
			`[launchPad] 启动页样式已注册：${LAUNCH_PAD_NAME}（${LAUNCH_PAD_ID}），设置项状态：${
				isLaunchPadEnabled() ? "开启" : "关闭"
			}（可在 选项→扩展→WhichWay 或 选项→外观→启动页 调整）`
		);
		return !existed;
	} catch (e) {
		console.error("[launchPad] 启动页样式注册失败（不影响扩展本体）", e);
		return false;
	}
}
