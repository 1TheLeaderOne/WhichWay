import { whichWayUtil } from "../utill.js";
const skinSwitchtCompatible = function() {
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
    if (!decadeUI.dynamicSkin) decadeUI.dynamicSkin = {};
    Object.assign(decadeUI.dynamicSkin, piqieData);
    if (!skinSwitch.saveSkinParams) skinSwitch.saveSkinParams = {};
    Object.assign(skinSwitch.saveSkinParams, piqieData);
  }
};
export {
  skinSwitchtCompatible
};
//# sourceMappingURL=skinSwitch.js.map
