/**
 * battleHost.ts —— 战斗宿主（父窗口侧）：iframe 隔离方案的父端编排器 + 载入遮罩。
 *
 * 每场战斗在【同源 iframe】里跑一个全新 noname 实例（子端见 battleChild.ts + start.ts 的 giBattle 分支）：
 *   父建 iframe + 载入遮罩 → 子 boot 完 postMessage 'gi-battle-ready' → 父把遮罩进度补满并淡出、
 *   淡出开始时下发 BattleInit（子随即解除默认暂停、开局）→ 子跑完一局 postMessage 'gi-battle-result'
 *   → 父销毁 iframe 并 resolve。父窗口的 GI 覆盖层 / 战役存档全程不被触碰，从而得到“重载级别”的
 *   干净对局态却不重载父页。同源前提已由 P0 验证：dev/electron 均走 http 源（electron 另设 webSecurity:false）。
 *
 * 载入遮罩（本文件）：子实例要完整 boot（含 WhichWay 全扩展 + 武将/卡牌），有数秒延迟。为遮掉这段“黑屏像卡死”，
 *   在 iframe 之上盖一层随机 image/background 氛围图 + 底部进度条：
 *     - 进度条是“心理作用”：默认 LOAD_MS 内从 0 爬到 90% 后停住；
 *     - 若在此之前子实例已就绪（收到 ready），立刻从当前值快速补到 100%；
 *     - 若 5s 未就绪，则一直卡在 90%，直到就绪那一刻再快速补满。补满后淡出、淡出伊始即下发 init。
 *
 * 注意：BOOT_TIMEOUT 只是“子实例能否 boot 起来”的看门狗，收到 ready 即解除；
 * 之后对局由真人游玩、时长不定，父一直等 result（子实例崩溃则靠用户重开，与旧就地方案同等）。
 */

import { lib } from "noname";
import { whichWayFile } from "../file.js";
import type { BattleInit, BattleResult } from "./dungeon.js";
import { rollBattleRewards } from "./data/monsters.js";

/** 子实例 boot + 回 ready 的等待上限；超时按占位结果兜底，绝不卡死战役 */
const BOOT_TIMEOUT = 30000;
/** 进度条“心理”爬满到 90% 的时长 */
const LOAD_MS = 5000;
/** 收到 ready 后从当前值快速补到 100% 的时长 */
const ZOOM_MS = 500;
/** 到 100% 后的短暂停顿 */
const HOLD_MS = 250;
/** 遮罩淡出时长 */
const FADE_MS = 320;

/** image/background 下的氛围图（构建随 image/ 原样复制；运行时按文件名拼 URL） */
const MASK_BACKGROUNDS = [
	"battlefront.jpg",
	"PrimevalChaos.jpg",
	"breakingCage.jpg",
	"MonumentalMelodyTracey.jpg",
	"PeaceAndProsperity.jpg",
	"FantasyGarden.jpg",
	"ecologicalPark.jpg",
	"dew.jpg",
	"hope.jpg",
	"ideal.jpg",
	"illumination.jpg",
	"landLife.jpg",
	"liberty.jpg",
	"peer.jpg",
	"priestess.jpg",
];

/** 随机挑一张背景，拼成可直接用于 CSS 的资源 URL（同 format.ts 的 giImg：走 img: scheme） */
const maskBackgroundUrl = (): string => {
	const f = MASK_BACKGROUNDS[Math.floor(Math.random() * MASK_BACKGROUNDS.length)];
	try {
		return whichWayFile.compilePath(`img:background/${f}`);
	} catch {
		return "";
	}
};

/** 战斗子实例 URL：与父同源、同入口，仅加 giBattle=1 让 start() 走裸对局分支 */
const battleSrc = (): string => {
	const u = new URL(location.href);
	u.searchParams.set("giBattle", "1");
	return u.href;
};

/** 无法拉起子实例时的占位结算（沿用历史兜底口径：随机胜负 + 掉血），保证战役可继续 */
const fallbackResult = (init: BattleInit): BattleResult => {
	const win = Math.random() > 0.4;
	const finalHp: Record<string, number> = {};
	for (const id of init.party) finalHp[id] = Math.max(0, Math.floor((init.allyHp[id] ?? 4) - (win ? 1 : 2)));
	return { win, nodeIndex: init.nodeIndex, finalHp, killedEnemies: [], kills: {}, deaths: {}, rewards: rollBattleRewards(win, init.dungeonId) };
};

/** 父窗口发起一场战斗：拉起 iframe 子实例 + 载入遮罩，await 其回传的结算结果 */
export function startBattle(init: BattleInit): Promise<BattleResult> {
	return new Promise(resolve => {
		const origin = location.origin && location.origin !== "null" ? location.origin : "*";

		// —— iframe 子实例 ——
		const iframe = document.createElement("iframe");
		iframe.id = "gi-battle-frame";
		iframe.setAttribute("allow", "autoplay");
		Object.assign(iframe.style, {
			position: "fixed",
			inset: "0",
			width: "100%",
			height: "100%",
			border: "0",
			zIndex: "99999",
			background: "#000",
		});

		// —— 载入遮罩（盖在 iframe 之上，z-index 更高）——
		// 三层独立叠放：氛围图（满铺）→ 暗化渐变蒙层 → 底部「载入中 + 进度条」。
		// 把氛围图拆成单独子层（而非多背景字符串），是因为字符串里若拼进空/坏 url 会让整条 background-image
		// 失效、连渐变一起不显示（即“遮罩不生效、背景图没应用”的根因）；独立层拿不到 url 时仅该层留空，其余不受累。
		const mask = document.createElement("div");
		Object.assign(mask.style, {
			position: "fixed",
			inset: "0",
			zIndex: "100000",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "flex-end",
			backgroundColor: "#05070d",
			overflow: "hidden",
			opacity: "1",
			transition: `opacity ${FADE_MS}ms ease`,
			pointerEvents: "all",
		} as Partial<CSSStyleDeclaration>);

		const imgUrl = maskBackgroundUrl();
		const bgEl = document.createElement("div");
		Object.assign(bgEl.style, {
			position: "absolute",
			inset: "0",
			zIndex: "0",
			backgroundColor: "#0a0d15",
			backgroundImage: imgUrl ? `url("${imgUrl}")` : "",
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		} as Partial<CSSStyleDeclaration>);

		const veilEl = document.createElement("div");
		Object.assign(veilEl.style, {
			position: "absolute",
			inset: "0",
			zIndex: "1",
			background: "linear-gradient(180deg, rgba(6,8,14,0.35) 0%, rgba(6,8,14,0.62) 100%)",
		} as Partial<CSSStyleDeclaration>);

		const label = document.createElement("div");
		label.textContent = "战斗载入中…";
		Object.assign(label.style, {
			position: "relative",
			zIndex: "2",
			color: "rgba(236,222,184,0.9)",
			fontSize: "16px",
			letterSpacing: "2px",
			marginBottom: "14px",
			textShadow: "0 1px 6px rgba(0,0,0,0.6)",
			fontFamily: "sans-serif",
		} as Partial<CSSStyleDeclaration>);

		const track = document.createElement("div");
		Object.assign(track.style, {
			position: "relative",
			zIndex: "2",
			width: "min(420px, 70vw)",
			height: "8px",
			marginBottom: "48px",
			borderRadius: "999px",
			background: "rgba(255,255,255,0.14)",
			overflow: "hidden",
			boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
		} as Partial<CSSStyleDeclaration>);

		const fill = document.createElement("div");
		Object.assign(fill.style, {
			width: "0%",
			height: "100%",
			borderRadius: "999px",
			background: "linear-gradient(90deg, #d8a84c, #ecc068)",
			transition: "width 80ms linear",
		} as Partial<CSSStyleDeclaration>);

		track.appendChild(fill);
		mask.appendChild(bgEl); // 底：氛围图（满铺、绝对定位不占 flex）
		mask.appendChild(veilEl); // 中：暗化蒙层
		mask.appendChild(label); // 顶：文案 + 进度条（后置故叠在上层）
		mask.appendChild(track);

		let settled = false;
		let ready = false;
		let maskShown = false;
		let raf = 0;
		let watchdog: ReturnType<typeof setTimeout> | undefined;

		const removeMask = () => {
			if (maskShown) {
				maskShown = false;
				try {
					mask.remove();
				} catch {
					/* ignore */
				}
			}
		};
		const cleanup = () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener("message", onMessage);
			if (watchdog !== undefined) clearTimeout(watchdog);
			removeMask();
			try {
				iframe.remove();
			} catch {
				/* ignore */
			}
		};
		const finish = (r: BattleResult) => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(r);
		};
		const sendInit = () => {
			try {
				iframe.contentWindow?.postMessage({ type: "gi-battle-init", init }, origin);
			} catch (e) {
				console.error("[GloriousIdeal] 下发 BattleInit 失败", e);
			}
		};

		const onMessage = (e: MessageEvent) => {
			if (origin !== "*" && e.origin !== origin) return;
			const d = e.data as { type?: string; result?: BattleResult } | null;
			if (!d || typeof d !== "object") return;
			if (d.type === "gi-battle-ready") {
				if (watchdog !== undefined) {
					clearTimeout(watchdog); // 子实例已 boot：解除看门狗，安心等真人打完
					watchdog = undefined;
				}
				ready = true; // 交由进度动画补满后下发 init
			} else if (d.type === "gi-battle-result" && d.result) {
				finish(d.result);
			}
		};

		// —— 进度动画状态机：climb(→90) → zoom(→100) → hold → fade(此刻下发 init) → 移除 ——
		const startT = performance.now();
		let mode: "climb" | "zoom" | "hold" | "fade" = "climb";
		let zoomFrom = 0;
		let zoomStart = 0;
		let holdStart = 0;
		let fadeStart = 0;
		const setP = (p: number) => {
			fill.style.width = p + "%";
		};
		const tick = () => {
			if (settled) return;
			const now = performance.now();
			if (mode === "climb") {
				const p = Math.min(90, ((now - startT) / LOAD_MS) * 90);
				setP(p);
				if (ready) {
					mode = "zoom";
					zoomFrom = p;
					zoomStart = now;
				}
			} else if (mode === "zoom") {
				const t = Math.min(1, (now - zoomStart) / ZOOM_MS);
				setP(zoomFrom + (100 - zoomFrom) * t);
				if (t >= 1) {
					mode = "hold";
					holdStart = now;
				}
			} else if (mode === "hold") {
				setP(100);
				if (now - holdStart >= HOLD_MS) {
					mode = "fade";
					fadeStart = now;
					mask.style.opacity = "0";
					sendInit(); // 淡出伊始即下发：子解除默认暂停、开局，正随遮罩消失而露出
				}
			} else if (mode === "fade") {
				if (now - fadeStart >= FADE_MS) {
					removeMask();
					return; // 停止循环
				}
			}
			raf = requestAnimationFrame(tick);
		};

		watchdog = setTimeout(() => {
			console.error("[GloriousIdeal] 战斗子实例超时未就绪，使用占位结算兜底");
			finish(fallbackResult(init));
		}, BOOT_TIMEOUT);
		window.addEventListener("message", onMessage);

		try {
			// 子实例是全新 realm：boot 见 lib.imported.mode 为空会在 init/index.ts:477 弹「选模式」splash 并 await 用户，
			// 与战役无关且挡住子实例。引擎自带 directstart 快通道（index.ts:335）→ 预置 directstart 令其静默 boot 进本模式，
			// 再由 start() 的 giBattle 分支转入裸对局路径。子实例 boot 后 index.ts:476 会自行清掉该标志（一次性）。
			localStorage.setItem(lib.configprefix + "directstart", "true");
			document.body.appendChild(iframe);
			document.body.appendChild(mask); // 盖在 iframe 之上
			maskShown = true;
			iframe.src = battleSrc();
			raf = requestAnimationFrame(tick);
		} catch (e) {
			console.error("[GloriousIdeal] 创建战斗 iframe 失败，使用占位结算兜底", e);
			finish(fallbackResult(init));
		}
	});
}
