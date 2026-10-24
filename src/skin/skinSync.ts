import { lib, game } from "noname";
import { whichWayFile } from "../file.js";
import { whichWayUtil } from "../utill.js";
import { onContent, onInit, onSetDev } from "../hooks/index.js";
import { whichWayAPIOverride } from "../override/index.js";

/**
 * 皮肤存档同步层：**驶舰之向 ⇄ 千幻聆音 ⇄ 无名杀本体**。
 *
 * 三处存档各有一套格式，谁都只认自己那份，于是「在一个地方换了皮肤，重启后又变回去」：
 *
 * | 存储 | 键 | 值形态 | 「经典形象」 |
 * | --- | --- | --- | --- |
 * | `lib.config.skin`（本体） | 武将id | `[文件名, 相对路径]` | **删键** |
 * | `lib.config.qhly_skinset.skin`（千幻） | 武将id | `文件名`（字符串） | **删键** |
 * | `window.whichWaySave.skinConfig`（本扩展） | 干员id | `文件名` | 删键 |
 *
 * 动/静开关也是两套、极性还不同（两边都是 `true` = 静皮/关动皮，但键形态有三种）：
 * - `lib.config.qhly_skinset.djtoggle[武将][皮肤]`：手杀小窗写**无扩展名**键、皮肤切换写 `皮肤名 + '.jpg'`、经典形象写 `'经典形象'` 或立绘图名；
 * - `lib.config.banSkinSJZX[干员][皮肤]`：本扩展自己的，只有无扩展名一种。
 *
 * 本模块只做三件事：
 * 1. **归一化**（{@link normalize}）：把任意一处读到的值翻译成同一份 {@link Selection}；
 * 2. **统一落库**（{@link applyAll}）：一份选择同时写进三处，任何一处都不再单独承担「整体覆盖」；
 * 3. **拦截外部写入**（{@link installSkinSync}）：本体换肤、千幻换肤、千幻切静皮最终都会落到
 *    `game.saveConfig`，在那里做 diff 后补齐其余两处 —— 这就是「双向」的实现方式。
 *
 * 三级门控（{@link mode}）：
 * - `off`：千幻没开 ⇒ **整层只处理本体 ↔ 本扩展**，不碰任何千幻的键；
 * - `qhlyOnly`：千幻开着 ⇒ 三向同步 + 动/静双向；
 * - `full`：千幻开着且「皮肤切换」（`window.skinSwitch`）在跑 ⇒ 再多同步它那份动皮选择。
 *
 * ⚠️ 判据一律是**运行期事实**（`lib.config.extensions` / `window.skinSwitch`），不看设置界面的值：
 * 千幻「皮肤切换功能」这个开关的 `init` 默认 `false`，但 `precontent.js` 实际判的是 `!== false`，
 * 全新安装时界面显示关闭而功能是开的（见 `extension/config.js:72-83` 与 `extension/precontent.js:113`）。
 */

/** 「经典形象」的皮肤名，与 `spineWork.js` / `portraitPos.ts` 保持一致 */
const CLASSIC_SKIN_NAME = "经典形象";

/** 「皮肤切换」扩展（随千幻内置）的动皮选择存档键，见 `skinSwitch/js/core/skin-switch-core.js:12` */
const SKIN_SWITCH_DYN_KEY = "extension_皮肤切换_dynamicSkin";

/** 千幻的哨兵：它接管 `lib.config.skin` 后写入的标志位（`千幻/extension/content.js:729-732`） */
const QHLY_SENTINEL = "qhly_config";

/**
 * 归一化之后的一条「皮肤选择」。
 *
 * 三个字段都按各家能直接用的形态给出，`applyAll` 不再做第二次翻译。
 */
export interface Selection {
	/** 皮肤名（**无**扩展名）：`报童` / `经典形象` / 动皮名 `时遗2`。动/静开关用它当键 */
	skinId: string;
	/** 文件名（**带**扩展名）：本体数组第一项、千幻字符串存档、本扩展 `skinConfig` 都用它 */
	fileName: string;
	/** 相对 `lib.assetURL` 的路径：本体数组第二项 */
	path: string;
	/** 是否是「经典形象」（对外两处一律删键，只有内存里保留立绘） */
	classic: boolean;
	/** 是否只有动皮、没有同名静皮（`时遗2` / `远行前的野餐`）：这类条目的底图要回落到基皮 */
	dynamicOnly: boolean;
}

/** `WhichWaySkin` / `SpineWorker` 实例，由 `skin/index.ts` 在模块求值末尾注入（避开循环依赖） */
let skinRef: any = null;
let spineRef: any = null;

/**
 * 注入两个皮肤子系统实例。
 *
 * 为什么不在本文件顶部 `import`：`skin/index.ts` → 本文件 → `skin/spineWork.js` → `skin/index.ts`
 * 会形成三模块环，虽然「只在函数体内用」能跑，但这层环没有必要 —— 由 skin 模块在末尾一次性交过来最稳。
 */
export function bindSkinSync(instances: { skin: any; spine: any }) {
	skinRef = instances.skin;
	spineRef = instances.spine;
	//动皮渲染侧要问「这张皮肤是不是被千幻切成了静皮」，把判据交过去
	spineRef?.setDynamicDisabledProbe?.(isDynamicDisabled);
}

/**
 * 重入守卫。两个计数器分开，因为它们拦的是**不同**的东西：
 * - {@link writeDepth}：本模块正在写存档 ⇒ `game.saveConfig` 钩子不要再 reconcile（否则自己写自己触发）；
 * - {@link reconcileDepth}：正在 reconcile ⇒ 不许再嵌套一次 reconcile（`applyAll` 落库会再触发钩子）。
 *
 * ⚠️ 以前共用一个 `depth` 是错的：`reconcile` 一进门就 `depth++`，接着调 `applyAll` 时
 * `depth > 0` 直接把落库拦掉 —— 同步层看起来装上了，实际一条都没写出去。
 */
let writeDepth = 0;
let reconcileDepth = 0;

/** 首次 `onInit` 跑完之前不动手：那时各家的初始值还在陆续落库，diff 起来全是噪音 */
let ready = false;

/** 钩子是否已装（幂等） */
let installed = false;

/** 三处存档的「上次已知状态」，用来自 `game.saveConfig` 里做 diff（引擎只传值、不传旧值） */
const snapshot: {
	skin: Record<string, any>;
	qhly: Record<string, any>;
	djtoggle: Record<string, Record<string, any>>;
	ban: Record<string, Record<string, any>>;
	dyn: Record<string, any>;
} = { skin: {}, qhly: {}, djtoggle: {}, ban: {}, dyn: {} };

// ============================ 门控 ============================

export type SyncMode = "off" | "qhlyOnly" | "full";

/** 千幻是否真的在用（与千幻自己的判法一致：在 `extensions` 列表里且没被显式关掉） */
function qhlyEnabled(): boolean {
	const list = lib.config?.extensions;
	if (!Array.isArray(list) || !list.includes("千幻聆音")) return false;
	return lib.config["extension_千幻聆音_enable"] !== false;
}

/** 当前同步等级 */
export function mode(): SyncMode {
	if (!qhlyEnabled()) return "off";
	return window.skinSwitch ? "full" : "qhlyOnly";
}

/**
 * 千幻是否已经把本体的 `lib.config.skin` 换成了哨兵对象。
 *
 * 是 ⇒ 本体那份**归千幻管**（它会自己按 `qhly_skinset` 贴图），我们只读不写，
 * 既不拆它的标志位，也不会把 `qhly_config` 这个假键当成武将条目。
 */
export function qhlySentinelMode(): boolean {
	const skin = lib.config?.skin;
	return !!skin && typeof skin === "object" && !Array.isArray(skin) && skin[QHLY_SENTINEL] === "yes";
}

/** 是否是本扩展干员（只有干员的皮肤表在本扩展手里，路径才有「磁盘真相」） */
function isOwn(char: string): boolean {
	return window.whichWaySave?.hasChar?.(char) === true;
}

// ============================ 读存档 ============================

function isPlainObject(value: any): boolean {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

/** 本体那份；处于千幻哨兵模式时返回 null（= 别碰） */
function readSkin(): Record<string, any> | null {
	if (qhlySentinelMode()) return null;
	const skin = lib.config?.skin;
	return isPlainObject(skin) ? { ...skin } : {};
}

function readQhlySkin(): Record<string, any> {
	const skin = lib.config?.qhly_skinset?.skin;
	return isPlainObject(skin) ? { ...skin } : {};
}

function readDjToggle(): Record<string, Record<string, any>> {
	const toggle = lib.config?.qhly_skinset?.djtoggle;
	if (!isPlainObject(toggle)) return {};
	const out: Record<string, Record<string, any>> = {};
	for (const char in toggle) out[char] = isPlainObject(toggle[char]) ? { ...toggle[char] } : {};
	return out;
}

function readBanSkin(): Record<string, Record<string, any>> {
	const ban = lib.config?.banSkinSJZX;
	if (!isPlainObject(ban)) return {};
	const out: Record<string, Record<string, any>> = {};
	for (const char in ban) out[char] = isPlainObject(ban[char]) ? { ...ban[char] } : {};
	return out;
}

function readSkinSwitchDyn(): Record<string, any> {
	const dyn = lib.config?.[SKIN_SWITCH_DYN_KEY];
	return isPlainObject(dyn) ? { ...dyn } : {};
}

// ============================ 写存档 ============================

/** 本模块是否正在写存档（`syncSkin` 用它决定要不要再走一遍 `applyAll`，避免自我递归） */
export function isSyncingWrites(): boolean {
	return writeDepth > 0;
}

/**
 * 持久化一个**引擎级**配置项。
 *
 * ⚠️ 必须传空字符串而不是 `undefined`：`whichWayUtil.saveConfig(key, value, ext = "WhichWay")`
 * 的默认参数对显式 `undefined` 同样生效，于是会写进 `extension_WhichWay_<key>` 而**不落盘** `lib.config[key]`。
 * 这正是「换了皮肤、重开又变回去」最直接的一条根因（含 `skin` / `qhly_skinset` 两处调用）。
 */
function persist(key: string, value: any) {
	lib.config[key] = value;
	game.saveConfig(key, value);
}

/**
 * 把一份选择写进**本扩展自己**的那份（`_skinStore` + `skinConfig`）。
 * 「经典形象」按删键处理：引擎只看 `lib.config.skin[name]` 这个键在不在。
 */
function writeOwnStore(char: string, sel: Selection) {
	if (!isOwn(char) || !skinRef) return;
	if (sel.classic) skinRef.syncSkin({ key: char, del: true });
	else skinRef.syncSkin({ key: char, value: [sel.fileName, sel.path] });
}

/**
 * 统一落库：一处选择 → 三处存档。
 *
 * @param char 武将/干员 id
 * @param sel 归一化后的选择
 * @param src 变更来源，仅用于日志（写回时三处都写，来源不影响结果）
 */
export function applyAll(char: string, sel: Selection, src: "whichWay" | "qhly" | "noname" = "whichWay") {
	if (writeDepth > 0) return;
	writeDepth++;
	try {
		// ① 本扩展那份：只对干员有效（非干员的皮肤不归本扩展管，路径也不在我们手里）
		writeOwnStore(char, sel);

		// ② 千幻那份：字符串文件名；经典形象=删键（千幻自己也是这么表示的，见 content.js:1589）
		if (qhlyEnabled()) {
			const box = (lib.config.qhly_skinset ??= {});
			(box.skin ??= {});
			const want = sel.classic ? undefined : sel.fileName;
			const now = box.skin[char];
			if (want === undefined ? now !== undefined : now !== want) {
				if (want === undefined) delete box.skin[char];
				else box.skin[char] = want;
				persist("qhly_skinset", box);
			}
		}

		// ③ 本体那份：数组形态。千幻接管期间**不写**（哨兵归它，拆了它就每次重启重新接管一次）
		if (!qhlySentinelMode()) {
			const skin = (lib.config.skin ??= {});
			if (sel.classic) {
				if (char in skin) {
					delete skin[char];
					persist("skin", skin);
				}
			} else {
				const now = skin[char];
				const changed = !Array.isArray(now) || now[0] !== sel.fileName || now[1] !== sel.path;
				if (changed) {
					skin[char] = [sel.fileName, sel.path];
					persist("skin", skin);
				}
			}
		}

		repaint(char);
	} catch (error) {
		console.error("[whichWaySkinSync] 皮肤存档同步失败", src, char, error);
	} finally {
		writeDepth--;
	}
}

/** 让场上同名武将立刻重画（换肤后不重画就要等下一次 `setBackground`） */
function repaint(char: string) {
	const players = (game.players ?? []).concat(game.dead ?? []);
	for (const player of players) {
		if (!player?.node) continue;
		if (player.name1 === char || player.name === char) player.node.avatar?.setBackground?.(char, "character");
		if (player.name2 === char) player.node.avatar2?.setBackground?.(char, "character");
	}
}

// ============================ 归一化 ============================

/** 干员的「经典形象」：图在立绘目录，不在皮肤目录 */
function classicSelection(char: string): Selection {
	const file = whichWayFile.getCharacterPortraitFile(char);
	return {
		skinId: CLASSIC_SKIN_NAME,
		fileName: file,
		path: whichWayFile.getCharacterPortraitPath(char),
		classic: true,
		dynamicOnly: false,
	};
}

/** 把 `raw` 里能当「文件名」的那一项拎出来（本体是数组、千幻/本扩展是字符串） */
function pickFileName(raw: any): string {
	if (typeof raw === "string") return raw;
	if (Array.isArray(raw) && typeof raw[0] === "string") return raw[0];
	return "";
}

/**
 * 归一化：任意一处存档的原始值 → {@link Selection}。
 *
 * @returns `undefined` = **解析不出来，就不要动这条**（宁可保留原值也不删键/不写坏路径）
 */
export function normalize(char: string, raw: any): Selection | undefined {
	if (typeof char !== "string" || char.length === 0) return;
	//千幻接管时往 `lib.config.skin` 里写的哨兵键，不是武将
	if (char === QHLY_SENTINEL) return;

	const file = pickFileName(raw);

	if (isOwn(char)) {
		//没有值 = 从来没选过 / 选了经典形象
		if (!file) return classicSelection(char);
		const base = whichWayFile.removeExt(file);
		//「经典形象」有三种写法：字段名、立绘图名、千幻的 translation
		if (base === CLASSIC_SKIN_NAME) return classicSelection(char);
		if (base === whichWayFile.removeExt(whichWayFile.getCharacterPortraitFile(char))) return classicSelection(char);

		//静皮条目（含「皮肤名 ≠ 文件名」：`夏卉` ↔ `夏卉 FA075.png`）
		const entry = skinRef?.getCharacterSkin?.(char, base);
		if (entry && typeof entry.name === "string" && typeof entry.path === "string") {
			return {
				skinId: whichWayFile.removeExt(entry.name),
				fileName: entry.name,
				path: entry.path,
				classic: false,
				dynamicOnly: false,
			};
		}

		if (spineRef) {
			//只有动作数据、没有同名静皮的动皮（`时遗2` / `远行前的野餐`）：底图回落到它的基皮
			if (spineRef.isStandaloneDynamicSkin?.(char, base)) {
				const staticKey = spineRef.getStaticSkinName?.(char, base);
				const fileName = staticKey && spineRef.getStaticSkinFileName?.(char, staticKey);
				if (fileName) {
					return {
						skinId: base,
						fileName,
						path: whichWayFile.compilePath(`skin:${char}/${fileName}`),
						classic: false,
						dynamicOnly: true,
					};
				}
			}
			//「皮肤切换」会把动皮的**资产目录名**（`dyn_illust_xxx`，没有 `skinName` 字段时回落成它）塞给千幻，反查回动皮名
			const byAsset = spineRef.getSkinNameByAssetName?.(char, base);
			if (typeof byAsset === "string" && byAsset.length > 0 && byAsset !== base) return normalize(char, byAsset);
		}

		//干员但解析不到：不动（以前这里是「删键 ⇒ 退回经典形象」，正是重启后选择丢失的那条路）
		return;
	}

	//非干员：本扩展没有它的皮肤表，只能原样透传（路径优先用存档里已有的，其次问千幻）
	if (!file) return { skinId: CLASSIC_SKIN_NAME, fileName: "", path: "", classic: true, dynamicOnly: false };
	const base = whichWayFile.removeExt(file);
	const storedPath = Array.isArray(raw) && typeof raw[1] === "string" && raw[1].length > 0 ? raw[1] : "";
	let path = storedPath;
	if (!path) {
		const viaQhly = typeof game.qhly_getSkinFile === "function" ? game.qhly_getSkinFile(char, file) : undefined;
		path = typeof viaQhly === "string" && viaQhly.length > 0 ? viaQhly : `image/skin/${char}/${file}`;
	}
	return { skinId: base, fileName: file, path, classic: false, dynamicOnly: /\.jpe?g$/i.test(file) };
}

// ============================ 动/静开关 ============================

/** 千幻 `djtoggle` 的键形态有三种（无扩展名 / `+'.jpg'` / 经典形象用立绘图名），统一成一个皮肤名 */
function canonicalDycKey(char: string, rawKey: string): string {
	const base = whichWayFile.removeExt(rawKey);
	if (base === CLASSIC_SKIN_NAME) return CLASSIC_SKIN_NAME;
	if (base === whichWayFile.removeExt(whichWayFile.getCharacterPortraitFile(char))) return CLASSIC_SKIN_NAME;
	return base;
}

/**
 * 该皮肤在当前配置下是否**关了动皮**。
 *
 * 两处都读：千幻的 `djtoggle`（玩家在千幻里点的）与本扩展的 `banSkinSJZX`（玩家在本扩展里点的）。
 * 任一处为 `true` 就算关 —— 两边是同一个意思，没必要再分谁优先。
 *
 * ⚠️ 只读不写，且**兼容历史脏键**（`.jpg` 后缀那份是「皮肤切换」写出来的，见 `skinSwitch/js/modules/dynamic.js:519`）。
 *
 * @param char 干员/武将 id
 * @param skinId 皮肤名（无扩展名）
 */
export function isDynamicDisabled(char: string, skinId: string): boolean {
	if (!char || !skinId) return false;
	const keys = [skinId];
	if (skinId === CLASSIC_SKIN_NAME) keys.push(whichWayFile.removeExt(whichWayFile.getCharacterPortraitFile(char)));
	const dj = lib.config?.qhly_skinset?.djtoggle?.[char];
	const ban = lib.config?.banSkinSJZX?.[char];
	for (const key of keys) {
		if (dj?.[key] === true || dj?.[`${key}.jpg`] === true) return true;
		if (ban?.[key] === true) return true;
	}
	return false;
}

/**
 * 把「静皮/动皮」这一个布尔量同时写进千幻与本扩展（键统一用无扩展名形态）。
 *
 * 两侧**都写**：千幻读 `djtoggle`、本扩展读 `banSkinSJZX`，缺一边就有一边「点了没反应」。
 * 键只用无扩展名形态 —— `.jpg` 那份是皮肤切换产出的历史脏键，读取端仍兼容（见 `isDynamicDisabled`），
 * 但不再写新的进去。
 */
function setStaticBoth(char: string, skinId: string, isStatic: boolean) {
	if (writeDepth > 0) return;
	writeDepth++;
	try {
		if (qhlyEnabled()) {
			const box = (lib.config.qhly_skinset ??= {});
			const toggle = (box.djtoggle ??= {});
			const per = (toggle[char] ??= {});
			if ((per[skinId] === true) !== isStatic) {
				per[skinId] = isStatic;
				persist("qhly_skinset", box);
			}
		}
		const ban = (lib.config.banSkinSJZX ??= {});
		const banPer = (ban[char] ??= {});
		if ((banPer[skinId] === true) !== isStatic) {
			banPer[skinId] = isStatic;
			persist("banSkinSJZX", ban);
		}
	} finally {
		writeDepth--;
	}
}

/** 千幻那边改了「静/动」→ 镜像到本扩展并当场生效 */
function mirrorToggleFromQhly(char: string, rawKey: string, isStatic: boolean) {
	const skinId = canonicalDycKey(char, rawKey);
	setStaticBoth(char, skinId, isStatic);
	const players = (game.players ?? []).concat(game.dead ?? []);
	for (const player of players) {
		if (player?.name1 === char || player?.name === char || player?.name2 === char) {
			spineRef?.updateDyc?.(char, player);
		}
	}
}

// ============================ diff & 落库 ============================

function sameJson(a: any, b: any): boolean {
	return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/** 记录当前三处存档的快照（每次 reconcile 结束都刷新，钩子靠它做 diff） */
function refreshSnapshot() {
	snapshot.skin = readSkin() ?? {};
	snapshot.qhly = readQhlySkin();
	snapshot.djtoggle = readDjToggle();
	snapshot.ban = readBanSkin();
	snapshot.dyn = readSkinSwitchDyn();
}

/**
 * 核对三处存档，把差异补齐。
 *
 * 由 `game.saveConfig` 钩子触发：本体/千幻/皮肤切换改完自己的存档后都会调它，
 * 我们在这里读 `lib.config`（而不是钩子传进来的 `value` —— 引擎常常传的是**已经被改过的同一个引用**），
 * 与快照比对得出「谁改了什么」，再写回其余各处。
 */
function reconcile() {
	//`writeDepth > 0`：这批变化是本模块自己刚写的，没必要再对一遍（也正是防自我回环的那道闸）
	if (!ready || writeDepth > 0 || reconcileDepth > 0) return;
	reconcileDepth++;
	try {
		// ── 本体 → 其余（千幻接管期间 `readSkin()` 为 null，整段跳过）
		const skinNow = readSkin();
		if (skinNow) {
			for (const char of new Set([...Object.keys(snapshot.skin), ...Object.keys(skinNow)])) {
				if (char === QHLY_SENTINEL) continue;
				if (sameJson(snapshot.skin[char], skinNow[char])) continue;
				const sel = normalize(char, skinNow[char]);
				if (sel) applyAll(char, sel, "noname");
			}
		}

		// ── 千幻静态皮肤 → 其余
		const qhlyNow = readQhlySkin();
		for (const char of new Set([...Object.keys(snapshot.qhly), ...Object.keys(qhlyNow)])) {
			if (sameJson(snapshot.qhly[char], qhlyNow[char])) continue;
			const sel = normalize(char, qhlyNow[char]);
			if (sel) applyAll(char, sel, "qhly");
		}

		// ── 千幻「静/动」→ 本扩展
		const djNow = readDjToggle();
		for (const char of new Set([...Object.keys(snapshot.djtoggle), ...Object.keys(djNow)])) {
			const before = snapshot.djtoggle[char] ?? {};
			const after = djNow[char] ?? {};
			for (const rawKey of new Set([...Object.keys(before), ...Object.keys(after)])) {
				if (before[rawKey] === after[rawKey]) continue;
				mirrorToggleFromQhly(char, rawKey, after[rawKey] === true);
			}
		}

		// ── 本扩展「静/动」→ 千幻
		const banNow = readBanSkin();
		for (const char of new Set([...Object.keys(snapshot.ban), ...Object.keys(banNow)])) {
			const before = snapshot.ban[char] ?? {};
			const after = banNow[char] ?? {};
			for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
				if (before[key] === after[key]) continue;
				if (qhlyEnabled()) setStaticBoth(char, canonicalDycKey(char, key), after[key] === true);
			}
		}

		// ── 「皮肤切换」的动皮选择 → 千幻 + 本扩展（仅 `full`）
		if (mode() === "full") {
			const dynNow = readSkinSwitchDyn();
			for (const char of new Set([...Object.keys(snapshot.dyn), ...Object.keys(dynNow)])) {
				if (snapshot.dyn[char] === dynNow[char]) continue;
				const value = dynNow[char];
				//`'none'` = 玩家在皮肤切换里点了「静皮」；无值 = 没选过（不推断，别把别处的选择清掉）
				if (value === "none") setStaticBoth(char, CLASSIC_SKIN_NAME, true);
				else if (typeof value === "string" && value.length > 0) {
					const skinId = canonicalDycKey(char, value);
					setStaticBoth(char, skinId, false);
				}
			}
		}
	} catch (error) {
		console.error("[whichWaySkinSync] 同步核对失败", error);
	} finally {
		reconcileDepth--;
		refreshSnapshot();
	}
}

/**
 * `game.saveConfig` 的同步钩子。
 *
 * ⚠️ 必须挂 **after**：引擎的 `saveConfig` 是「先 `base[key] = value` 再落盘」（`game/index.js:9851-9857`），
 * `before` 阶段读 `lib.config` 还是旧值，diff 会永远看不出变化。
 *
 * ⚠️ 同时必须是**同步**函数：`whichWayAPIOverride.appendHook` 的同步包装层靠返回值决定
 * 「是否阻止执行」/「是否替换参数」，`async` 会让两种语义同时失效。
 */
function onSaveConfig(this: any, result: any, key: string) {
	if (key === "skin" || key === "qhly_skinset" || key === "banSkinSJZX" || key === SKIN_SWITCH_DYN_KEY) reconcile();
	return result;
}

/**
 * 把 `syncAllSkinConfig()` 合并出来的结果落库。
 *
 * 只处理**本扩展干员**：非干员的皮肤不归我们管，写进去只会在别人的存档里留脏数据。
 * 而且这里逐条 patch、不再整体替换 —— 旧实现 `lib.config.qhly_skinset.skin = simple` 会把
 * 玩家在千幻里给本体武将挑的皮肤一并抹掉（`simple` 里没有那些键）。
 *
 * @param full 干员id → `[文件名, 路径]`
 */
export function adoptOwnSkins(full: Record<string, [string, string]>) {
	if (writeDepth > 0) return;
	writeDepth++;
	try {
		for (const [char, value] of Object.entries(full)) {
			if (!isOwn(char) || !Array.isArray(value) || typeof value[0] !== "string") continue;
			const sel = normalize(char, value[0]);
			if (!sel) continue;
			//本扩展那份已经是权威，跳过 `writeOwnStore`，只补千幻与本体
			if (qhlyEnabled()) {
				const box = (lib.config.qhly_skinset ??= {});
				(box.skin ??= {});
				const want = sel.classic ? undefined : sel.fileName;
				const now = box.skin[char];
				if (want === undefined ? now !== undefined : now !== want) {
					if (want === undefined) delete box.skin[char];
					else box.skin[char] = want;
					persist("qhly_skinset", box);
				}
			}
			if (!qhlySentinelMode() && !sel.classic) {
				const skin = (lib.config.skin ??= {});
				const now = skin[char];
				if (!Array.isArray(now) || now[0] !== sel.fileName || now[1] !== sel.path) {
					skin[char] = [sel.fileName, sel.path];
					persist("skin", skin);
				}
			}
		}
	} catch (error) {
		console.error("[whichWaySkinSync] 落库失败", error);
	} finally {
		writeDepth--;
		refreshSnapshot();
	}
}

// ============================ 千幻事件订阅 ============================

/**
 * 订阅千幻的换肤事件。
 *
 * 千幻换肤成功后会同时发 `lib.announce.publish('qhlyChangeSkin', {characterName, skinName})`
 * 与回调 `lib.qhly_callbackList[*].onChangeSkin(name, skin)`（`千幻/extension/content.js:1507-1522`），
 * 两条都接：不同版本走不同的那条，重复触发也只是幂等的 `applyAll`。
 *
 * 「静默预览」跟随千幻：它 `silent=true` 时**照样**写 `qhly_skinset.skin` 并落库
 * （`content.js:1501-1503` 不判 silent），所以我们跟着同步；不额外加开关。
 */
function subscribeQhly() {
	if (!qhlyEnabled()) return;
	const onChange = (name: string, skin: string) => {
		if (!name) return;
		const sel = normalize(name, skin);
		if (sel) applyAll(name, sel, "qhly");
	};
	try {
		if (typeof lib.announce?.subscribe === "function") lib.announce.subscribe("qhlyChangeSkin", (payload: any) => onChange(payload?.characterName, payload?.skinName));
	} catch (error) {
		console.warn("[whichWaySkinSync] 订阅 qhlyChangeSkin 失败", error);
	}
	//`lib.qhly_callbackList` 由千幻自己在 CONTENT 里建（`千幻/content.js:496-499`）。谁先跑不一定，
	//所以这里用 `??=` 建出来再 push —— 千幻那边同样是 `if (!lib.qhly_callbackList) { … = [] }`，不会互斥。
	try {
		const box = lib as any;
		if (!Array.isArray(box.qhly_callbackList)) box.qhly_callbackList = [];
		box.qhly_callbackList.push({ onChangeSkin: onChange });
	} catch (error) {
		console.warn("[whichWaySkinSync] 注册 qhly_callbackList 失败", error);
	}
}

// ============================ 安装 ============================

/** 装上同步层（幂等；由 `skin/index.ts` 在所有皮肤子系统求值完毕后调用一次） */
export function installSkinSync() {
	if (installed) return;
	installed = true;
	refreshSnapshot();
	try {
		whichWayAPIOverride.appendHook("game.saveConfig", { after: onSaveConfig });
	} catch (error) {
		console.error("[whichWaySkinSync] 安装 saveConfig 钩子失败，同步层降级为手动写三处", error);
	}
	onContent({ name: "whichWaySkinSync_subscribeQhly", fn: subscribeQhly });
	onInit({
		name: "whichWaySkinSync_ready",
		/**
		 * 排在本扩展 `onInit` 队列的**最前面**（`priority` 越大越先跑），而不是最后。
		 *
		 * 理由：`skin/index.ts` 的 `whichWaySkinInitSkinData_init`（里面会调 `syncAllSkinConfig()`）
		 * 用的也是 `onInit`，默认 `priority: 0`。同步层必须先 `ready = true`，
		 * 否则那一次合并写下去的存档不会触发后续对齐 —— 启动那一次就白跑了。
		 * 而 `skinData` 的扫描在 `init()` 的顶层 `await` 里早就完成了，此时 `normalize()` 已经可用。
		 */
		priority: 100,
		fn: () => {
			ready = true;
			refreshSnapshot();
		},
	});
}

// ============================ 开发者模式 ============================

onSetDev({
	name: "whichWaySkinSync_dev",
	fn() {
		//@ts-ignore
		window.whichWaySkinSync = { mode, normalize, applyAll, isDynamicDisabled, qhlySentinelMode, refreshSnapshot, snapshot };
	},
});
