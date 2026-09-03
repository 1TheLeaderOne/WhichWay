/**
 * start.ts —— 模式启动入口：挂载 Vue UI（start() 由引擎事件系统调用，支持 async）
 */

import { createApp, type App } from "vue";
import App from "./ui/App.vue";
import * as store from "./ui/store.js";

const MOUNT_ID = "gi-mount";

let vueApp: App | null = null;

/** 引擎在选定本模式后调用 */
export async function start(): Promise<void> {
	const pool: string[] = (window.whichWaySave?.allCharacters || []) as string[];
	store.setPool(pool);
	store.refreshHasSave();

	if (!vueApp) {
		let host = document.getElementById(MOUNT_ID);
		if (!host) {
			host = document.createElement("div");
			host.style.width = "100%";
			host.style.height = "100%";
			host.id = MOUNT_ID;
			document.body.appendChild(host);
		}
		vueApp = createApp(App);
		vueApp.mount(host);
	}

	// 每次进入本模式回到标题（有存档则显示“继续”）
	store.goTitle();
	console.log("[GloriousIdeal] 模式启动（框架版 · Vue UI）：营地 → 派遣 → 副本探索 → 结算 → 下一天");
}

/** 供调试/控制台访问 */
export const GloriousIdealDebug = {
	get controller() {
		return store.view.ctrl;
	},
	get view() {
		return store.view;
	},
	get pool() {
		return store.view.pool;
	},
};
