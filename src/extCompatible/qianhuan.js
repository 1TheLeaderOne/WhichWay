import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { spineWorker } from "../skin/spineWork.js";

/**
 * 驶舰之向 → 千幻聆音 的皮肤包登记。
 *
 * 千幻按 `skin.standard + 武将id/` 列皮肤、按「皮肤名 + 扩展名」拼图，而本扩展的静皮在
 * `illustration/skin/{id}/` 下，且文件名经常不是皮肤名（`夏卉 FA075.png`、`时遗14.png`）。
 * 两者对不齐时会出现下面这些现象：
 * - 千幻自己扫不到本扩展的静皮 ⇒ 动皮在千幻里没有图；
 * - 千幻按「有动皮、没同名静皮」补一张 `皮肤名.jpg` ⇒ 同一张皮肤出现两张卡片（本扩展的静皮全是 png，
 *   那张补出来的 jpg 必然 404）；
 * - 只有动作数据、没有静皮的条目（`时遗2`、`远行前的野餐`…）被当成独立皮肤列出来。
 *
 * 本文件用千幻的几个可扩展点各管一段：
 * - `skin.standard` 指向本扩展的静皮目录，千幻能自己列出全部静皮；
 * - `getAdditionalSkins` 把**动皮对应的那张静皮**交给千幻，名字用**动皮名**
 *   （千幻判断「有没有同名静皮」用的就是名字，名字对上了才不会补 jpg）；
 * - `replaceAvatarDestination` 把「皮肤名 → 磁盘上真实文件」告诉千幻（`夏卉` → `夏卉 FA075.png`）；
 * - `hideSkin` 挡掉「只有动作数据、没有静皮」的动皮条目。
 *
 * ⚠️ `skin.standard` 与 `replaceAvatarDestination` 的返回值都是**相对路径**（不带 `lib.assetURL`）：
 * - 千幻显示图片时是 `img.src = lib.assetURL + file`（`content.js:11131`），
 *   `setBackgroundImage` 内部也是 `url("${lib.assetURL}${img}")`（`polyfill.ts:250-262`）⇒ 带前缀会双重前缀；
 * - 与千幻自带 `'extension/千幻聆音/sanguoskin/'`、以及它自动生成的扩展包
 *   （`qhly_foundPackageExt`：`'extension/' + extName + '/skin/image/'`）形态保持一致。
 *
 * ⚠️ **Web 端「读不到皮肤」是千幻上游的缺陷**，与本扩展无关：`qhly_getSkinList` 第一步调
 * `game.qhly_checkFileExist(path)`，而它只实现了 `lib.node.fs.statSync(__dirname + '/' + path)`
 * 与 Cordova 两条分支，Web 端直接 `callback(false)` ⇒ 列表为空。需要上游改成
 * `game.checkFile` 一类实现（它自己的 `skinSwitch/js/core/skin-switch-core.js:56` 就是正确写法）。
 * 上游修好后，这里的相对路径即可正常工作。
 */

/** 皮肤目录（**相对路径**，千幻会自己补 `lib.assetURL`，见上） */
const extSkinBase = whichWayFile.compilePath("qs:");

const config = {
	isExt: true,
	filterCharacter: function (name) {
		return window.whichWaySave.hasChar(name);
	},
	characterNameTranslate: function (name) {
		return get.translation(name);
	},
	prefix: "extension/WhichWay/image/illustration/character/",
	skin: {
		standard: extSkinBase,
	},
	/**
	 * 额外皮肤（动皮对应的静皮）。名字必须是**动皮名**：千幻用
	 * `i.skinId.substring(0, 最后一个点)` 与动皮名比（`qhly_getSkinModels`），名字对上了才不会
	 * 再补一张 `皮肤名.jpg`（那张必然 404，于是同一张皮肤出现两张卡片）。
	 * @param {string} name 干员id
	 * @returns {{ name: string, skinName: string }[]}
	 */
	getAdditionalSkins: function (name) {
		if (!window.whichWaySave.hasChar(name)) return [];
		return spineWorker.getDynamicSkinEntries().filter(entry => entry.name === name);
	},
	/**
	 * **千幻真正会调用的路径解析钩子**（`qhly_getSkinFile` / `setBackground` / `setBackgroundImage`
	 * 三处都先问它）。返回本扩展解析出的**磁盘上真实存在**的文件路径，千幻拿到就直接贴图，
	 * 绕开它自己的「`skin.standard + 干员id + "/" + 皮肤名`」拼接。
	 *
	 * 为什么必须有它：千幻的静皮文件名不一定是皮肤名（`夏卉` ↔ `夏卉 FA075.png`、`时遗` ↔ `时遗14.png`），
	 * 它自己拼路径必然 404；而且扩展的静皮是 png，它默认补的却是 `.jpg`。
	 *
	 * ⚠️ 返回值必须是**不带 `lib.assetURL`** 的相对路径：千幻拿到后还会自己拼
	 * （`content.js:11131` 的 `img.src = lib.assetURL + file`，以及 `setBackgroundImage` 内部
	 * 也走 `polyfill.ts` 的 `url("${lib.assetURL}${img}")`）。带了前缀就是双重前缀、必然 404
	 * —— 这正是「千幻读不到皮肤」的第二个根因。
	 * 本扩展自己的绘制侧（`whichWaySkin.skinPathOf` / `avatarBackground`）另走 `toCssUrl` 补前缀，
	 * 两边互不影响。
	 * @param {string} name 干员id
	 * @param {string} skin 皮肤名或文件名（可能带扩展名）
	 * @returns {string | undefined} 解析不到时返回 undefined，让千幻走它自己的默认规则
	 */
	replaceAvatarDestination: function (name, skin) {
		if (typeof name !== "string" || name.length === 0) return undefined;
		if (!window.whichWaySave.hasChar(name)) return undefined;
		if (typeof skin !== "string" || skin.length === 0) return undefined;
		const base = whichWayFile.removeExt(skin);
		//「经典形象」用立绘，落盘位置不在皮肤目录里
		if (base === "经典形象") return `extension/WhichWay/image/illustration/character/${whichWayFile.getCharacterPortraitFile(name)}`;
		const fileName = spineWorker.getStaticSkinFileName(name, base);
		if (!fileName) return undefined;
		return `extension/WhichWay/image/illustration/skin/${name}/${fileName}`;
	},
	/**
	 * 千幻列皮肤时用它过滤（`qhly_getSkinList` 的 `handleHide`）。用来挡掉
	 * **本身没有静皮、只有动作数据**的动皮条目（`时遗2`、`远行前的野餐`、`重装芯片`…），
	 * 否则千幻会给它们各补一张 `皮肤名.jpg`，变成一堆点开是空图的卡片。
	 * @param {string} name 干员id
	 * @param {string} skin 皮肤文件名
	 * @returns {boolean} true 表示隐藏
	 */
	hideSkin: function (name, skin) {
		if (typeof name !== "string" || !window.whichWaySave.hasChar(name)) return false;
		if (typeof skin !== "string" || skin.length === 0) return false;
		const base = whichWayFile.removeExt(skin);
		if (base === "经典形象") return false;
		//真实存在的静皮（含动皮对应的那张）不隐藏
		if (spineWorker.getStaticSkinFileName(name, base)) return false;
		//只有动作数据、没有静皮的动皮名 ⇒ 隐藏
		const assets = window.whichWaySave?.dycSave?.assets?.[name];
		if (assets && base in assets && !spineWorker.isStandaloneDynamicSkin(name, base)) return true;
		return false;
	},
	/**
	 * 卡片显示名：认不出来的返回 undefined，让千幻按它自己的默认规则取名。
	 * @param {string} name 干员id
	 * @param {string} skinName 皮肤名
	 * @returns {{ translation: string, info: string } | undefined}
	 */
	skininfo: function (name, skinName) {
		if (typeof skinName !== "string" || skinName.length === 0) return undefined;
		//「经典形象」的动皮由立绘文件名区分（`char_xxx.png`），千幻那边它本来就叫「经典形象」
		if (skinName === whichWayFile.removeExt(whichWayFile.getCharacterPortraitFile(name))) {
			return { translation: "经典形象", info: "" };
		}
		return undefined;
	},
	// 本扩展没有为千幻准备台词 / 立绘 / 原画补充信息，交给千幻的默认实现
	characterTaici: function () {
		return null;
	},
	characterLihui: function () {
		return null;
	},
	/** 千幻卡片「原画」页的补充信息（`qhly_getOriginSkinInfo` 会问它），本扩展没有额外内容 */
	originSkinInfo: function () {
		return "";
	},
};

//@ts-ignore
if (!lib.qhlypkg) {
	lib.qhlypkg = [];
}

//@ts-ignore
lib.qhlypkg.push(config);

export const qianhuanSetting = config;
export { extSkinBase };
