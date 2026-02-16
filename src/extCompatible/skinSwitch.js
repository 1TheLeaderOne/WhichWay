import { whichWayUtil } from "../utill.js";

export const skinSwitchtCompatible = function () {
	let piqieData;
	if (whichWayUtil.config("enable", "皮肤切换")) {
		piqieData = { ...window.whichWaySave.dycSave.assets };
		for (let charName in piqieData) {
			let char = piqieData[charName];
			for (let skinName in char) {
				let skin = char[skinName];
				if (Array.isArray(skin.action)) skin.action = skin.action[0];
			}
		}
		// @ts-ignore
		if (!decadeUI.dynamicSkin) decadeUI.dynamicSkin = {};
		// @ts-ignore
		Object.assign(decadeUI.dynamicSkin, piqieData);

		// @ts-ignore
		if (!skinSwitch.saveSkinParams) skinSwitch.saveSkinParams = {};
		// @ts-ignore
		Object.assign(skinSwitch.saveSkinParams, piqieData);
	}
};
