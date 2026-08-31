import { onSetDev } from "../hooks/index.js";
class DataManager {
  _data = {};
  _listeners = /* @__PURE__ */ new Map();
  get(key) {
    return this._data[key];
  }
  set(key, value) {
    this._data[key] = value;
    this._emit(key, value);
  }
  remove(key) {
    if (!Array.isArray(key)) key = [key];
    key.forEach((i) => delete this._data[i]);
  }
  on(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, /* @__PURE__ */ new Set());
    }
    this._listeners.get(key).add(callback);
  }
  off(key, callback) {
    this._listeners.get(key)?.delete(callback);
  }
  offAll(key) {
    this._listeners.delete(key);
  }
  async _emit(key, value) {
    const listeners = this._listeners.get(key);
    if (listeners) {
      for (const listener of listeners) {
        await listener(value, key);
      }
    }
  }
}
const dataManager = new DataManager();
window.whichWay.register("dataManager", dataManager);
onSetDev({
  name: "whichWayDataManager_dev",
  fn: () => {
    window.whichWayDataManager = dataManager;
  }
});
export {
  dataManager
};
//# sourceMappingURL=index.js.map
