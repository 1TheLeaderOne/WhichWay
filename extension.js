/**
 * ⚠️ 驶舰之向扩展入口 —— 本文件只允许静态 import "noname"，不得静态 import 任何 ./src/** 内部模块。
 *
 * 原因：本模块必须用「顶层 await」阻塞到初始化结束（宿主 await import(本文件) 之后会立刻
 * 同步读取扩展的 config / package，所以不能改成惰性启动）。而 rollup 在打包时会把入口模块
 * 与它静态依赖里的共享模块合并进同一个 chunk；只要该 chunk 被动态 chunk 反向静态依赖，
 * 就会形成 ESM 顶层 await 死锁：
 *
 *     入口(TLA: await whichWayInit()) ──动态 import──▶ packs chunk
 *              ▲                                            │
 *              └────────────── 静态 import ─────────────────┘
 *
 * 带顶层 await 的模块 [[AsyncEvaluation]] 为 true，任何静态依赖它的模块都必须等它“完成”；
 * 于是入口等 packs 求值完、packs 又等入口完成 —— 双方互等，扩展加载永久挂起（既不报错也不继续）。
 * 曾经踩过的实例：入口与 src/version.js、Vue 的 _export_sfc 被合进同一个 chunk，
 * 而 packs / arknight / audio / skin / configUI / updateLog / launchPad 都静态 import 了它。
 *
 * 因此：入口一律只做「顶层 await + 动态 import」。若需要新增启动步骤，也请写成动态 import。
 * 自检方式（构建产物）：chunks/ 下不应出现任何 `from "./extension.js"`。
 */
import { lib, game, ui, get, ai, _status } from "noname";

/**
 * 驶舰之向,启动!
 *
 * 启动顺序不可调整：
 * 1. 先暴露全局组件管理器 / 全局存储（后续所有模块的顶层代码都会用到它们）
 * 2. 执行初始化
 * 3. 判断是否是开发者模式
 * 4. 触发 extension 生命周期
 */
//暴露驶舰之向组件管理器
await import("./src/whichWay.js");

//暴露驶舰之向全局储存
await import("./src/globalSave/index.js");

const { whichWayInit } = await import("./src/init.js");
const { whichWayHooksApi } = await import("./src/hooks/index.js");
const { whichWayUtil } = await import("./src/utill.js");
const { mainPackage } = await import("./src/package/index.js");

//执行初始化
await whichWayInit();

//判断是否是开发者模式
await whichWayUtil.developerSet();

await whichWayHooksApi.extension();

export const type = "extension";
export default function () {
	return {
		name: "WhichWay",
		arenaReady: async function () {
            await whichWayHooksApi.arenaReady();
        },
		content: async function (config, pack) {
            await whichWayHooksApi.content(config, pack);
        },
		prepare: async function () {
            await whichWayHooksApi.prepare();
        },
		precontent: async function () {
            await whichWayHooksApi.precontent();
        },
		config: whichWayHooksApi.config,
		help: {},
		package: mainPackage(),
		files: { character: [], card: [], skill: [], audio: [] },
		connect: true,
	};
}
