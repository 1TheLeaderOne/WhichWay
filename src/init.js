import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayHooksApi } from "./hooks/index.js";
import { whichWayVersion } from "./version.js";

/**
 * 驶舰之向初始化
 */

/* ===== 加载耗时统计：折叠输出，加载完成后一次性给出 =====
 * 控制台默认收起，点开可看明细。不影响性能（每阶段仅一次 performance.now）。
 */
const _wwTimings = [];
const _wwTotal = performance.now();
const _wwMark = async (label, mod) => {
	const s = performance.now();
	const m = await mod();
	_wwTimings.push([label, performance.now() - s]);
	return m;
};

const _wwFlushTimings = () => {
	const total = performance.now() - _wwTotal;
	const lines = _wwTimings.map(([label, ms]) => `  ${label.padEnd(28)} ${ms.toFixed(0).padStart(5)} ms`);
	//找出前 3 大耗时（除总计外），方便定位后续优化目标
	const top = [..._wwTimings].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l);
	console.groupCollapsed(`%c[WhichWay] 加载完成 · 总计 ${total.toFixed(0)}ms`, "color:#4a9eff;font-weight:bold;");
	console.log(`%c耗时明细（总 ${total.toFixed(0)}ms）`, "color:#888;font-weight:bold;");
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

	//导入toast组件
	await _wwMark("toast", () => import("./toast/index.ts"));

	//导入文件管理组件
	await _wwMark("file", () => import("./file.js"));

	//@ts-ignore 加载css
	await _wwMark("css", async () => {
		await window.whichWay.file.autoLoadCSS();
	});

	//导入覆盖API
	await _wwMark("override", () => import("./override/index.js"));

	/**
	 * 导入noname扩展
	 * TODO 这坨东西真要该全删了xd
	 */
	await _wwMark("nonameEx", () => import("./nonameEx/index.js"));

	//导入配置
	await _wwMark("config", () => import("./config/index.js"));

	//————————————模式：特蕾西娅与瑰丽理想————————————//
	// 还处于测试阶段,暂时不进行添加
	// try {
	// 	await _wwMark("gloriousIdeal(新模式)", async () => {
	// 		const { registerGloriousIdealMode } = await import("./GloriousIdeal/index.js");
	// 		registerGloriousIdealMode();
	// 	});
	// } catch (e) {
	// 	console.error("[GloriousIdeal] 新模式注册失败（可忽略，不影响扩展本体）", e);
	// }

	//导入视频播放组件
	await _wwMark("videoPlayer", () => import("./videoPlayer/index.js"));

	//————————————武将包————————————//

	/**
	 * 基础配置（势力/设计者/翻译）
	 */
	await _wwMark("base(配置)", () => import("./packs/base/index.js"));

	/**
	 * 新的添加将包的方法
	 */
	await _wwMark("packs(新)", () => import("./packs/index.ts"));

	//导入明日方舟数据
	await _wwMark("arknight", () => import("./arknight/index.ts"));

	//导入音频组件
	await _wwMark("audio", () => import("./audio/index.ts"));

	//导入皮肤
	await _wwMark("skin", () => import("./skin/index.ts"));

	//导入poptip
	await _wwMark("poptip", () => import("./poptip/index.js"));

	//导入tips
	await _wwMark("tips", () => import("./tips/index.ts"));

	//导入角色卡片
	await _wwMark("characterCard", () => import("./characterCard/index.ts"));

	//扩展适配
	await _wwMark("extCompatible", () => import("./extCompatible/index.js"));

	//导入更新日志
	await _wwMark("updateLog", () => import("./updateLog/index.js"));

	//快速设置界面
	await _wwMark("configUI", () => import("./configUI/index.js"));

	//导入模组系统
	await _wwMark("modules", () => import("./modules/index.js"));

	await _wwMark("hooksApi.init(pendingRun)", async () => {
		await whichWayHooksApi.init();
	});

	_wwFlushTimings();
};