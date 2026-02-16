import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayHooksApi } from "./src/hooks/index.js";
import { whichWayInit } from "./src/init.js";
import { whichWayUtil } from "./src/utill.js";
import { whichWayVersion } from "./src/version.js";

await start();

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
		package: {
			character: {
				character: {},
				translate: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				skill: {},
				translate: {},
			},
			intro: "",
			author: "TheLeaderOne、圣晴天空",
			diskURL: "",
			forumURL: "",
			version: whichWayVersion.ext,
		},
		files: { character: [], card: [], skill: [], audio: [] },
		connect: true,
	};
}

/**
 * 驶舰之向,启动!
 */
async function start() {
	//暴露驶舰之向组件管理器
	await import("./src/whichWay.js");

	//暴露驶舰之向全局储存
	await import("./src/globalSave/index.js");

	//执行初始化
	await whichWayInit();

	//判断是否是开发者模式
	await whichWayUtil.developerSet();
}