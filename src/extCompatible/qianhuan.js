import { lib, get } from "noname";
if (!lib.qhlypkg) {
  lib.qhlypkg = [];
}
const config = {
  isExt: true,
  filterCharacter: function(name) {
    return window.whichWaySave.allCharacters.includes(name);
  },
  characterNameTranslate: function(name) {
    return get.translation(name);
  },
  prefix: "extension/WhichWay/image/character/",
  skin: {
    standard: "extension/WhichWay/image/skin/"
  }
};
lib.qhlypkg.push(config);
const qianhuanSetting = config;
export {
  qianhuanSetting
};
//# sourceMappingURL=qianhuan.js.map
