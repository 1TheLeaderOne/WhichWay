import { lib } from "noname";
import { whichWayHooksApi } from "./hooks/index.js";
import { whichWayVersion } from "./version.js";
import { runStages } from "./stageLoader.js";

/**
 * 驶舰之向初始化
 *
 * 阶段通过 src/stageLoader.js 以「依赖波次」并发执行。
 *
 * 关于 deps：绝大多数阶段不需要声明依赖——阶段模块之间的静态 import 已经由
 * 打包器编码了真实顺序（例如 packs 静态 import 了 base/arknight，audio 静态
 * import 了 arknight），模块系统保证它们按依赖图求值。deps 只用于表达**运行时
 * 注册**这种模块图看不见的顺序，例如 css 阶段要读 file 阶段注册到
 * window.whichWay.file 上的实例。
 */

/** 阶段耗时明细：[阶段名, 耗时(ms)]，按声明顺序排列 */
const _wwTimings = [];
const _wwFlushTimings = total => {
	const lines = _wwTimings.map(([label, ms]) => `  ${label.padEnd(26)} ${ms.toFixed(0).padStart(5)} ms`);
	//找出前 3 大耗时（除总计外），方便定位后续优化目标
	const top = [..._wwTimings].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l);
	console.groupCollapsed(`%c[WhichWay] 加载完成 · 总计 ${total.toFixed(0)}ms`, "color:#4a9eff;font-weight:bold;");
	console.log(`%c阶段耗时（无依赖的阶段并发执行，各行之和 ≥ 总计）`, "color:#888;font-weight:bold;");
	console.log(lines.join("\n"));
	if (top.length) console.log(`%c最耗时: ${top.join(" / ")}`, "color:#e67e22;");
	console.groupEnd();
};

export const whichWayInit = async () => {
	/**
	 * 别问,我也不知道为什么,删了就报错
	 */
	// await new Promise(resolve => setTimeout(resolve, 600));

	//配置中文翻译
	lib.translate.extension_WhichWay = "驶舰之向";

	//检查版本
	whichWayVersion.checkVersionCompatible();

	const stages = [
		//导入toast组件
		{ name: "toast", load: () => import("./toast/index.ts") },

		//导入文件管理组件
		{ name: "file", load: () => import("./file.js") },

		//@ts-ignore 加载css（要等 file 阶段把实例注册到 window.whichWay.file 上）
		{
			name: "css",
			deps: ["file"],
			load: async () => {
				await window.whichWay.file.autoLoadCSS();
			},
		},

		//导入覆盖API
		{ name: "override", load: () => import("./override/index.js") },

		/**
		 * 导入noname扩展
		 * TODO 这坨东西真要该全删了xd
		 */
		{ name: "nonameEx", load: () => import("./nonameEx/index.js") },

		//导入配置
		{ name: "config", load: () => import("./config/index.js") },

		//————————————启动页美化（WhichWay 视差轮播）————————————//
		// 注册自定义启动页样式：玩家可在「选项 → 外观 → 启动页样式」中选择。
		// 在引擎构建 splash 选项前注册即可（WhichWay 扩展加载早于引擎 splash 初始化）。
		// optional：启动页美化失败不应影响扩展本体。
		{
			name: "launchPad(启动页美化)",
			optional: true,
			load: async () => {
				const { registerLaunchPadSplash } = await import("./launchPad/index.js");
				registerLaunchPadSplash();
			},
		},

		//————————————模式：特蕾西娅与瑰丽理想————————————//
		// 还处于测试阶段,暂时不进行添加
		// {
		// 	name: "gloriousIdeal(新模式)",
		// 	optional: true,
		// 	load: async () => {
		// 		const { registerGloriousIdealMode } = await import("./GloriousIdeal/index.js");
		// 		registerGloriousIdealMode();
		// 	},
		// },

		//导入视频播放组件
		{ name: "videoPlayer", load: () => import("./videoPlayer/index.js") },

		//————————————武将包————————————//

		/**
		 * 基础配置（势力/设计者/翻译）
		 */
		{ name: "base(配置)", load: () => import("./packs/base/index.js") },

		/**
		 * 新的添加将包的方法（干员/卡牌模块清单在构建期由 import.meta.glob 确定，
		 * 整个武将包只占一个 chunk）
		 */
		{ name: "packs(新)", load: () => import("./packs/index.ts") },

		//导入明日方舟数据
		{ name: "arknight", load: () => import("./arknight/index.ts") },

		//导入音频组件
		{ name: "audio", load: () => import("./audio/index.ts") },

		//导入皮肤
		{ name: "skin", load: () => import("./skin/index.ts") },

		//导入poptip
		{ name: "poptip", load: () => import("./poptip/index.js") },

		//导入tips
		{ name: "tips", load: () => import("./tips/index.ts") },

		//导入角色卡片
		{ name: "characterCard", load: () => import("./characterCard/index.ts") },

		//扩展适配
		{ name: "extCompatible", load: () => import("./extCompatible/index.js") },

		//导入更新日志
		{ name: "updateLog", load: () => import("./updateLog/index.js") },

		//快速设置界面
		{ name: "configUI", load: () => import("./configUI/index.js") },

		//导入模组系统
		{ name: "modules", load: () => import("./modules/index.js") },
	];

	const begunAt = performance.now();
	_wwTimings.push(...(await runStages(stages)));

	//收尾：必须等**全部**阶段模块求值完毕后才能触发 init 周期——
	//各模块在顶层注册 onBeforeInit/onInit 钩子、把内容缓冲进 packHooks，
	//提前跑 init 会漏掉尚未注册的钩子与尚未落库的干员/技能。
	const initBegin = performance.now();
	await whichWayHooksApi.init();
	_wwTimings.push(["hooksApi.init(pendingRun)", performance.now() - initBegin]);

	_wwFlushTimings(performance.now() - begunAt);
};
