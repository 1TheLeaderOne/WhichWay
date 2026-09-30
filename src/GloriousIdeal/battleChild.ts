/**
 * battleChild.ts —— 战斗子实例（iframe 内、独立 realm）侧握手逻辑。
 *
 * 由 start() 在 location.search 带 giBattle=1 时动态导入并调用 runBattleChild()，
 * 此时本 realm 已完成 boot（arena 已建、WhichWay 已注册、gloriousideal 模式已导入），
 * 但**不挂载 GI Vue、不触碰战役存档**——子实例只负责“跑完一局并把结果送回父窗口”。
 *
 * 握手协议（同源 postMessage）：
 *   子 → 父 { type: 'gi-battle-ready' }                    本 realm 就绪，可开局
 *   父 → 子 { type: 'gi-battle-init',   init: BattleInit } 下发入场参数（父在载入遮罩淡出时才发）
 *   子 → 父 { type: 'gi-battle-result', result: BattleResult } 一局打完，回传结算
 * 回传后父窗口销毁本 iframe，故子实例只跑一局即“退场”，不做任何就地复用。
 *
 * 子场景锁定（本模式战斗专用，屏蔽其它功能）：
 *   - 隐藏 ui.system（`#system` 内含 选项/暂停/托管/重来 等“其它功能”按钮）：注入 `display:none!important`
 *     样式，令 identity 每回合的 ui.system.show() 也无法显示（普通一次性 hide 会被 show() 覆盖）。
 *   - 默认暂停：boot 后即置 `_status.paused=true`，令 game.loop 空转、对局不因遮罩期间的时序而自行推进；
 *     收到 init（遮罩淡出）时解除，再开局。注：随后 launchBrawlMatch 内的 switchMode 会重跑并复位 paused，
 *     这里的 paused 只覆盖“boot 完成→init 到达”这段裸对局前的空档。
 *
 * 隔离要点：BattleInit/BattleResult 均为纯 JSON（可结构化克隆）。
 */

import { _status } from "noname";
import { whichWayUtil } from "../utill.js";
import { launchBrawlMatch, type BattleInit } from "./dungeon.js";

/** 在子文档注入样式，全程隐藏 ui.system（不受 identity 每回合 show() 影响）。幂等：样式只注入一次。
 *  开发者模式下不隐藏：开发者需要 #system 的选项/暂停/牌堆等按钮来排查子对局。 */
let systemStyleInjected = false;
function hideSystemBar(): void {
	try {
		if (whichWayUtil.isDeveloperMode()) return;
		if (!systemStyleInjected) {
			const style = document.createElement("style");
			style.textContent = "#system{display:none !important;}";
			(document.head || document.documentElement).appendChild(style);
			systemStyleInjected = true;
		}
		// 直接再压一次当前存在的 #system（switchMode/clearArena 可能重建过它；上方的 !important 样式已能覆盖新节点）。
		const sys = document.getElementById("system") as HTMLElement | null;
		if (sys) sys.style.display = "none";
	} catch {
		/* ignore */
	}
}

export function runBattleChild(): void {
	const origin = location.origin && location.origin !== "null" ? location.origin : "*";
	const parent = window.parent;

	hideSystemBar();
	// 默认暂停：boot 结束后 game.loop 会因 _status.paused 而空转，直到收到 init 才解除并开局。
	_status.paused = true;

	let started = false;

	const onMessage = (e: MessageEvent) => {
		if (origin !== "*" && e.origin !== origin) return;
		const d = e.data as { type?: string; init?: BattleInit } | null;
		if (!d || d.type !== "gi-battle-init" || !d.init) return;
		if (started) return; // 一场 iframe 只跑一局
		started = true;
		window.removeEventListener("message", onMessage);
		// 解除默认暂停（父在遮罩淡出时才发 init，此刻正露出对局）。launchBrawlMatch 内部 switchMode 也会复位 paused。
		_status.paused = false;
		hideSystemBar(); // switchMode/arena 可能重建了 #system，再压一次
		// launchBrawlMatch 内部 try/catch 恒 resolve（绝不 reject），故无需 .catch；父侧另有看门狗兜底。
		launchBrawlMatch(d.init).then(result => {
			try {
				parent.postMessage({ type: "gi-battle-result", result }, origin);
			} catch (err) {
				console.error("[GloriousIdeal] 子实例回传战斗结果失败", err);
			}
		});
	};

	// 先挂监听再报就绪，确保父端下发的 init 不会被漏接。
	window.addEventListener("message", onMessage);
	try {
		parent.postMessage({ type: "gi-battle-ready" }, origin);
	} catch (e) {
		console.error("[GloriousIdeal] 子实例上报就绪失败", e);
	}
}
