import { whichWayArknight } from "../arknight/index.js";
import { whichWayFile } from "../file.js";
import { whichWayUtil } from "../utill.js";
import { whichWayUtil } from "../utill.js";

/**
 * 干员立绘的「位置/大小」设定（皮肤拖拽功能的数据层）
 *
 * 存档结构落在 `json/pos.json`：
 * ```json
 * { "schema": 1, "data": { "char_002_amiya": { "经典形象": { "x": 0, "y": -0.05, "scale": 1.5 } } } }
 * ```
 * 为什么用「相对比例」而不是像素：`x / y` 是**偏移量 ÷ 立绘框尺寸**、`scale` 是最终倍率，
 * 所以同一份配置在任意分辨率、任意 `ui_zoom`（无名杀自带缩放）下效果一致；
 * 换算发生在拖拽侧（见 `portraitDrag.ts`），这里只负责存取。
 *
 * 为什么键是「干员id + 皮肤名」而不是「干员id」：同一个干员的不同皮肤构图差别很大
 * （全身/半身/横图），位置设定必须跟着皮肤走，否则换肤就会错位。
 */

/** 立绘框的偏移与缩放 */
export type PortraitPos = {
	/** 水平偏移，单位是「框宽」的比例，可为负 */
	x: number;
	/** 垂直偏移，单位是「框高」的比例，可为负 */
	y: number;
	/** 缩放倍率，绝对值（不是相对比例） */
	scale: number;
};

/**
 * 默认缩放。
 *
 * 1.5 是这套两层背景最早硬编码在 `PortraitLayers.vue` 里的值，
 * 现在它变成「没有配置时的缺省」，好让老用户的观感保持不变。
 */
export const DEFAULT_PORTRAIT_SCALE = 1.5;

/** 没有配置时的缺省设定：不偏移 + 默认缩放 */
const DEFAULT_POS: PortraitPos = { x: 0, y: 0, scale: DEFAULT_PORTRAIT_SCALE };

/** 「经典形象」皮肤名——立绘直接从 `illustration/character/{id}.png` 取图，没有皮肤目录 */
export const DEFAULT_SKIN_NAME = "经典形象";

const POS_FILE = "json:pos.json";
const POS_NAME = "pos.json";

/** 干员id → 皮肤名 → 设定 */
let posData: Record<string, Record<string, PortraitPos>> = {};

/** 读取过文件了没：没读过时 `get` 一律给缺省值，避免拖拽期间被异步加载覆盖 */
let loaded = false;

function clampFinite(value: unknown, fallback: number): number {
	const num = typeof value === "number" ? value : Number(value);
	return Number.isFinite(num) ? num : fallback;
}

/**
 * 从 `background-image` 的 url 反解出「干员id + 皮肤名」。
 *
 * 两种落盘形态：
 * - `…/illustration/skin/{干员id}/{皮肤文件名}.png` ⇒ 皮肤名取文件名去扩展名
 * - `…/illustration/character/{干员id}.png` ⇒ 视为「经典形象」
 * 其它（本体保底图、其它扩展的图、`db:` 之类）返回 undefined，即不参与拖拽设定。
 *
 * 之所以从 url 反解而不是直接取干员名：绘制入口之一（`setBackgroundImage` 的重定向）只有图片路径、
 * 没有角色名，两条入口用同一套解析才能保证读到同一条配置。
 * @param url 形如 `url("…")`、`url(…)` 或裸路径
 */
export function resolvePortraitKey(url: string): { charId: string; skin: string } | undefined {
	if (typeof url !== "string" || url.length === 0) return;

	const matched = /^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)$/.exec(url.trim());
	const raw = (matched?.[1] ?? matched?.[2] ?? matched?.[3] ?? url).trim();
	if (!raw) return;

	//还原成真实文件名再当键：浏览器序列化 `style.backgroundImage` 时会把空格与中文转成 `%20`、`%E4%B8%AD`
	//（`paintPortrait` 的 url 就是从 `getComputedStyle` 那条路上取的），而 `mountPortrait` 是自己拼的原始路径。
	//不统一解码，同一个皮肤就会有两个键。
	let path = raw;
	try {
		path = decodeURIComponent(raw);
	} catch (error) {
		//% 后面跟的不是合法十六进制（文件名里真有 `%` 的极端情况）就按原文用
	}

	const segments = path.split("/").filter(segment => segment.length > 0);
	if (segments.length < 2) return;

	const file = segments[segments.length - 1];
	const parent = segments[segments.length - 2];
	const fileName = whichWayFile.removeExt(file);

	//皮肤目录形态：上一级目录名就是干员id
	if (whichWayArknight.isArknght(parent)) return { charId: parent, skin: fileName };
	//立绘形态：文件名就是干员id
	if (whichWayArknight.isArknght(fileName)) return { charId: fileName, skin: DEFAULT_SKIN_NAME };
}

/**
 * 取设定；没有配置时返回缺省值（调用方因此不需要处理 undefined）
 */
export function getPos(charId: string, skin: string): PortraitPos {
	if (!loaded) return { ...DEFAULT_POS };
	return { ...DEFAULT_POS, ...posData[charId]?.[skin] };
}

/**
 * 取「干员id → 皮肤名 → 设定」的**活引用**（不是拷贝），供 `whichWaySkin.posData` 暴露出去。
 *
 * 给控制台/外部面板直接看当前生效的配置；因为是同一个对象，改动会立刻反映出来 ——
 * 这是有意的：调试要的就是「现在内存里到底是什么」，落盘只是它的副本。
 */
export function getPosData(): Record<string, Record<string, PortraitPos>> {
	return posData;
}

/** 按 url 取设定；url 解析不出干员时返回缺省值 */
export function getPosByUrl(url: string): PortraitPos {
	const key = resolvePortraitKey(url);
	if (!key) return { ...DEFAULT_POS };
	return getPos(key.charId, key.skin);
}

/**
 * 写入设定并安排落盘
 */
export function setPos(charId: string, skin: string, pos: PortraitPos): void {
	const data = (posData[charId] ??= {});
	data[skin] = {
		x: clampFinite(pos.x, 0),
		y: clampFinite(pos.y, 0),
		scale: clampFinite(pos.scale, DEFAULT_PORTRAIT_SCALE),
	};
	scheduleSave();
}

/**
 * 读档：`json/pos.json` 不存在（首次使用）或解析失败都按空表继续，不抛错。
 */
export async function loadPos(): Promise<void> {
	try {
		if (!(await whichWayFile.exsitFile(POS_FILE, "file"))) {
			loaded = true;
			return;
		}
		const content = await whichWayFile.readFile(POS_FILE);
		const data = content?.data;
		if (data && typeof data === "object") {
			for (const charId in data) {
				const skins = data[charId];
				if (!skins || typeof skins !== "object") continue;
				const fixed: Record<string, PortraitPos> = {};
				for (const skin in skins) {
					const pos = skins[skin];
					if (!pos || typeof pos !== "object") continue;
					fixed[skin] = {
						x: clampFinite(pos.x, 0),
						y: clampFinite(pos.y, 0),
						scale: clampFinite(pos.scale, DEFAULT_PORTRAIT_SCALE),
					};
				}
				posData[charId] = fixed;
			}
		}
	} catch (error) {
		console.error("[whichWayPortraitPos] 读取 pos.json 失败，本次按默认位置显示", error);
	} finally {
		loaded = true;
	}
}

let saveTimer: any;

/**
 * 真正写盘。
 *
 * 落盘位置是**运行时**的扩展目录（`extDir = lib.assetURL + extension/WhichWay/`），
 * 不是仓库里的 `packages/extension/WhichWay/json/pos.json`：开发时跑的是构建产物，
 * 所以调完位置要去 `apps/core/extension/WhichWay/json/pos.json` 看（源目录那份只是随包发布的空白模板，
 * 而且每次完整构建都会被 `viteStaticCopy` 重新覆盖成空白）。
 */
function writePosFile() {
	whichWayFile
		.writeFileAsJson({ schema: 1, data: posData }, "json:", POS_NAME)
		.then(() => {
			if (whichWayUtil.isDeveloperMode()) console.log("[whichWayPortraitPos] 已写入", whichWayFile.compilePath(POS_FILE), "共", Object.keys(posData).length, "名干员");
		})
		.catch(error => {
			console.error("[whichWayPortraitPos] 保存 pos.json 失败", error);
		});
}

/**
 * 拖拽期间每个 move 都写盘会打成百上千次 IPC，所以合并短时间内的连续修改。
 * 落盘失败只记日志：设定已在内存里，本次游戏内效果不受影响。
 */
function scheduleSave() {
	clearTimeout(saveTimer);
	saveTimer = setTimeout(writePosFile, 300);
}

/** 立刻落盘（退出拖拽模式时调用，避免 300ms 内关页面丢最后一次调整） */
export function flushSave(): void {
	clearTimeout(saveTimer);
	writePosFile();
}

/**
 * 备份当前设定，供拖拽模式的「重置」回滚。
 * 深拷贝：重置要恢复到进入拖拽时的状态，浅拷贝会让两层的皮肤对象共用同一个引用。
 */
export function snapshotPos(): string {
	return JSON.stringify(posData);
}

/** 恢复备份并重绘由调用方负责（本函数只改数据） */
export function restorePos(snapshot: string): void {
	try {
		posData = JSON.parse(snapshot);
	} catch (error) {
		console.error("[whichWayPortraitPos] 恢复备份失败", error);
	}
	scheduleSave();
}
