import { whichWayUtil } from "../utill.js";
const ConfictedSkinPrototype = {
  has(name, skin, from) {
    if ([name, skin, from].includes(void 0)) throw new Error("参数不能为undefined");
    if (!Array.isArray(this.data[name])) return false;
    return this.data[name].some((item) => item.from === from && item.skin === skin);
  },
  add(name, skin, from) {
    if ([name, skin, from].includes(void 0)) throw new Error("参数不能为undefined");
    if (!this.has(name, skin, from)) {
      if (!Array.isArray(this.data[name])) this.data[name] = [];
      this.data[name].push({ skin, from });
    }
  },
  get(name) {
    if (name === void 0) throw new Error("参数不能为undefined");
    return this.data[name];
  },
  get size() {
    return Object.keys(this.data).length;
  },
  data: {},
  get selected() {
    return whichWayUtil.config("whichWay_ConfictedSkin_selectedSkins") || {};
  },
  set selected(value) {
    whichWayUtil.saveConfig("whichWay_ConfictedSkin_selectedSkins", value);
  }
};
const confictedSkin = Object.create(ConfictedSkinPrototype);
export {
  confictedSkin
};
//# sourceMappingURL=confictedSkin.js.map
