import { lib } from "noname";
import { whichWayUtil } from "../utill.js";

/**
 * 「皮肤切换」兼容层（千幻聆音**内置**的那套也在内）。
 *
 * ## 为什么放在这里而不是 `skin/`
 *
 * 把动皮资产写进 `decadeUI.dynamicSkin` / `skinSwitch.saveSkinParams` 这件事，
 * **完全是为「皮肤切换 / 千幻」服务的**：
 * - 数据形状由它们定义（`dynamicSkin[干员id][皮肤名]`、`saveSkinParams` 同构）；
 * - 消费方全在它们内部（千幻的皮肤列表 `qhly_skinManage.js:881`、手杀小窗 `content.js:1363`、
 *   动/静按钮 `qhly_shoushaSkinCards.js:135`、出框 worker `qhly_chukuangWorker.js:66`、
 *   参数编辑 `qhly_bigEdit.js:187`；皮切小窗 `skinSwitch/js/modules/qhly-open-small.js:189`）；
 * - 时机由它们的初始化顺序决定（见下面的 `arenaReady`）。
 *
 * 驶舰之向自己的皮肤系统（`skin/index.ts`）不读这些键，只负责产出 `dycSave.assets`。
 * 所以这是**单向的对外适配**，放在 `extCompatible` 才对。
 *
 * ## 什么时候注入
 *
 * 以下任一成立就注入：
 * 1. **动皮组件 = 皮肤切换**（配置 `WhichWayDynamicSkinSwitch === "piqie"`）：本来就是让它们播；
 * 2. **千幻聆音已开启**：千幻**内置了整套皮肤切换** —— `千幻/extension/precontent.js:113` 在
 *    `qhly_useSkinSwitch !== false` 时调 `initSkinSwitch()` 建出 `window.skinSwitch`，
 *    所以「开了千幻」等价于「开了皮肤切换」。
 *
 * ⚠️ **不要用 `spineWorker.needEnable()` 当门控**：那个函数是给「驶舰之向自己渲染动皮」用的，
 * 它在 `piqie` 分支要求 `lib.extensionPack["皮肤切换"]`、`["千幻聆音"]`、`["十周年UI"]`
 * 三者都注册成扩展（`skin/spineWork.js:1245-1252`）。而 `皮肤切换` 根本**不会**注册成扩展
 * （它是千幻目录下的 `skinSwitch/`，由千幻直接 `initSkinSwitch()` 建对象，
 * 从不 `game.import("extension", …)`），所以那个判断在 `piqie` 下**恒为 false** ——
 * 用它当门控，注入永远不会发生。这里按「配置值」与「千幻是否真的开了」来判断。
 *
 * ## 为什么必须是 `arenaReady`
 *
 * `decadeUI.dynamicSkin` 在 `content` 阶段会被**整体覆盖**：
 * 1. 十周年UI 的 `setupDynamicSkin()`（`十周年UI/src/skins/dynamicSkin.js:21`）——
 *    `decadeUI.dynamicSkin = { ...dynamicSkinConfig }`，换掉整个对象；
 * 2. 「皮肤切换」的 `dynamicInit()` → `updateDecadeDynamicSkin()`
 *    （`skinSwitch/js/modules/dynamic-init.js:11-18`）—— 按 `saveSkinParams` 逐字段合并，
 *    `decadeUI.dynamicSkin[k][m]` 不存在就**整条跳过**。
 *
 * 而 `content` 是各扩展 `Promise.allSettled` **并发**跑的（`init/index.ts:588-590`）。
 * `arenaReady` 在**所有扩展 content 都完成之后**才触发
 * （`init/index.ts:597` 的 `ui.create.arena()` → `ui/create/index.js:3133-3136` 清空队列），
 * 此刻注入的内容不会再被覆盖。
 */

/** 皮肤切换对应的「动皮组件」配置值 */
const PIQIE_MODE = "piqie";

/**
 * 千幻聆音是否真的在运行（在 `extensions` 列表里且没被显式关掉）。
 *
 * 与千幻自己的判法一致（`qhly_dynamicEngine.js:703`）：只看 `extension_千幻聆音_enable`，
 * **不看** `qhly_useSkinSwitch` —— 后者缺省时 `precontent` 判的是 `!== false`，
 * 也就是界面显示「关闭」而内置 skinSwitch 实际是开着的。
 */
function qhlyEnabled() {
	const list = lib.config?.extensions;
	if (!Array.isArray(list) || !list.includes("千幻聆音")) return false;
	return lib.config["extension_千幻聆音_enable"] !== false;
}

/** 现在是否应该把动皮资产交给皮肤切换 / 千幻 */
export function shouldShareDynamicSkinAssets() {
	if (whichWayUtil.config("WhichWayDynamicSkinSwitch") === PIQIE_MODE) return true;
	return qhlyEnabled();
}

/**
 * 把驶舰之向的动皮资产注入 `decadeUI.dynamicSkin` 与 `skinSwitch.saveSkinParams`。
 *
 * ⚠️ 数据源是 `whichWaySave.dycSave.assets`（`skin/dynamicConfig.js:1334` 写入的全量资产），
 * **不是** `lib.config.sjzxDycAssets` —— 后者在全仓库没有任何写入点、恒为 `undefined`，
 * 读它只会注入一个空对象（旧实现让 `piqie` 模式一直不生效的原因）。
 *
 * ⚠️ 必须深拷贝：下面要把 `action` 从数组削成字符串、并补 `skinName`，
 * 直接改会污染 `dycSave.assets` 本体（它同时是驶舰之向自渲染的数据源）。
 *
 * @returns {boolean} 是否真的注入了（缺 `decadeUI` 或资产为空时返回 false）
 */
export function shareDynamicSkinAssets() {
	const assets = window.whichWaySave?.dycSave?.assets;
	if (!assets || typeof assets !== "object" || Object.keys(assets).length === 0) return false;

	//千幻/皮肤切换都依赖十周年UI 的 spine 能力，没有它注入也没人用
	// @ts-ignore
	if (typeof decadeUI === "undefined" || !decadeUI) return false;

	// @ts-ignore
	const data = structuredClone(assets);
	for (const charName in data) {
		const char = data[charName];
		for (const skinName in char) {
			const skin = char[skinName];
			//「皮肤切换」只认单个动作名，数组会让它取不到
			if (Array.isArray(skin.action)) skin.action = skin.action[0];
			//皮切/千幻小窗按 `skinName` 当皮肤名、按 `name` 当素材目录，两个都要有。
			//驶舰之向的条目里只有 `name`（素材目录名，如 `dyn_illust_char_1012_skadi2_boc4`）；
			//缺 `skinName` 时它们会回落成素材名，再传给 `game.qhly_setCurrentSkin(name, skinName + '.jpg')`
			//（`skinSwitch/js/modules/dynamic.js:507`）⇒ 千幻拼出必然 404 的路径，还会写坏存档。
			if (typeof skin.skinName !== "string" || skin.skinName.length === 0) skin.skinName = skinName;
		}
	}

	// @ts-ignore
	if (!decadeUI.dynamicSkin) decadeUI.dynamicSkin = {};
	// @ts-ignore
	Object.assign(decadeUI.dynamicSkin, data);

	/**
	 * 让千幻的皮肤列表缓存失效。
	 *
	 * `qhly_getSkinList` 首次扫描后会把结果按武将 id 缓存进 `_status.qhly_skinListCache`
	 * （`qhly_skinManage.js:750-780、807-833`），之后直接复用、**不再看 `decadeUI.dynamicSkin`**。
	 * 若玩家在我们注入之前就打开过千幻的武将卡，那份缓存里没有动皮条目，注入就白做了。
	 */
	// @ts-ignore —— `qhly_skinListCache` 是千幻挂在 `_status` 上的运行时字段，没有类型声明
	const status = window._status ?? lib.status;
	if (status && status.qhly_skinListCache) status.qhly_skinListCache = {};

	// @ts-ignore —— 玩家调过的动皮参数（x/y/scale/特殊动作）按同一份键合并
	if (typeof skinSwitch !== "undefined" && skinSwitch) {
		// @ts-ignore
		if (!skinSwitch.saveSkinParams) skinSwitch.saveSkinParams = {};
		// @ts-ignore
		Object.assign(skinSwitch.saveSkinParams, data);
	}
	return true;
}

/**
 * `extCompatible` 阶段挂载的入口（由 `extCompatible/index.js` 在 `arenaReady` 调用）。
 *
 * 独立安装版「皮肤切换」扩展也走这里：它与千幻内置的那份共用同一套数据结构，
 * 因此不需要第二份实现（此前两份各自维护，才出现「主路径读 `sjzxDycAssets` 恒空、
 * 兼容层读 `dycSave.assets` 反而正确」的分裂）。
 */
export const skinSwitchtCompatible = function () {
	if (!shouldShareDynamicSkinAssets()) return;
	shareDynamicSkinAssets();
};
