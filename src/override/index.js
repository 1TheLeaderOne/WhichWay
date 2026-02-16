import { onSetDev } from "../hooks/index.js";
import { _status, ai, get, ui, game, lib } from "noname";
class WhichWayAPIOverride {
  constructor() {
    this.overrides = /* @__PURE__ */ new Map();
  }
  /**
   * 允许修改的API列表
   * @type {Record<string, any>}
   */
  apis = {
    lib,
    game,
    ui,
    get,
    ai,
    _status
  };
  /**
   * 是否是合法的API
   * @param {string} name
   * 
   * @returns {boolean} 
   */
  isVaildAPI(name) {
    return Object.keys(this.apis).includes(name);
  }
  /**
   * 完全替换指定 API
   * @param {string} apiName - 如 "game.check"
   * @param {any} apiNew - 新实现
   */
  overrideAPI(apiName, apiNew) {
    this._validateAndSet(apiName, "override", apiNew);
  }
  /**
   * 在原 API 执行前后追加逻辑（不替换原函数）
   * @param {string} apiName - API 路径
   * @param {{ before?: Function, after?: Function }} options
   *   - before(...args): 可返回新参数数组，或返回 false 阻止执行
   *   - after(result, ...originalArgs): 可返回新结果
   */
  async appendHook(apiName, { before, after }) {
    if (!before && !after) {
      throw new Error('At least one of "before" or "after" must be provided');
    }
    const parts = apiName.split(".");
    const prop = parts.pop();
    let obj = this.apis;
    if (!this.isVaildAPI(parts[0])) {
      throw new Error(`Invalid API name: ${parts[0]} , must be one of ${Object.keys(this.apis)}`);
    }
    try {
      for (const part of parts) {
        if (obj == null || typeof obj !== "object") {
          throw new Error(`Invalid path: ${apiName}`);
        }
        obj = obj[part];
      }
    } catch (e) {
      throw new Error(`Cannot access property ${apiName}, current Object is ${obj}`);
    }
    if (obj == null || typeof obj !== "object") {
      throw new Error(`Parent of '${prop}' is not an object in path: ${apiName}`);
    }
    const original = obj[prop];
    if (typeof original !== "function") {
      throw new Error(`Target API '${apiName}' is not a function — hooks only work on functions`);
    }
    const wrapped = async function(...args) {
      if (before) {
        const beforeResult = await before.apply(this, args);
        if (beforeResult === false) {
          return void 0;
        }
        if (Array.isArray(beforeResult)) {
          args = beforeResult;
        }
      }
      const result = await original.apply(this, args);
      if (after) {
        const afterResult = await after.call(this, result, ...args);
        return afterResult !== void 0 ? afterResult : result;
      }
      return result;
    };
    const record = {
      original,
      current: wrapped,
      type: "hook",
      hook: { before, after },
      path: apiName,
      overriddenAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      obj[prop] = wrapped;
      this.overrides.set(apiName, record);
      console.debug(`[WhichWayAPIOverride] Hook added to: ${apiName}`);
    } catch (e) {
      throw new Error(`Failed to hook '${apiName}': ${e.message}`);
    }
  }
  /**
   * 内部通用设置逻辑（用于 override 和 hook）
   */
  _validateAndSet(apiName, type, newValue) {
    if (typeof apiName !== "string" || !apiName.trim()) {
      throw new Error("apiName must be a non-empty string");
    }
    const parts = apiName.split(".");
    const prop = parts.pop();
    let obj = this.apis;
    if (!this.isVaildAPI(parts[0])) {
      throw new Error(`Invalid API name: ${parts[0]} , must be one of ${Object.keys(this.apis)}`);
    }
    if (prop === void 0) throw new Error("apiName must be a non-empty string");
    try {
      for (const part of parts) {
        if (obj == null || typeof obj !== "object") {
          throw new Error(`Cannot access property '${part}' in path '${apiName}'`);
        }
        obj = obj[part];
      }
      if (obj == null || typeof obj !== "object") {
        throw new Error(`Parent object of '${prop}' is invalid in path: ${apiName}`);
      }
    } catch (e) {
      throw new Error(`Cannot access property ${apiName}, current Object is ${obj}`);
    }
    const original = obj[prop];
    const record = {
      original,
      current: newValue,
      type,
      path: apiName,
      overriddenAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      obj[prop] = newValue;
      this.overrides.set(apiName, record);
      console.debug(`[WhichWayAPIOverride] ${type === "override" ? "Overrode" : "Hooked"}: ${apiName}`);
    } catch (e) {
      throw new Error(`Failed to set '${apiName}': ${e.message}`);
    }
  }
  /**
   * 恢复指定 API 到原始状态
   */
  restoreAPI(apiName) {
    const record = this.overrides.get(apiName);
    if (!record) {
      console.warn(`[WhichWayAPIOverride] No override/hook found for: ${apiName}`);
      return false;
    }
    const parts = apiName.split(".");
    const prop = parts.pop();
    let obj = globalThis;
    for (const part of parts) obj = obj[part];
    try {
      obj[prop] = record.original;
      this.overrides.delete(apiName);
      console.debug(`[WhichWayAPIOverride] Restored: ${apiName}`);
      return true;
    } catch (e) {
      console.error(`[WhichWayAPIOverride] Failed to restore ${apiName}:`, e);
      return false;
    }
  }
  /**
   * 获取所有被覆盖/挂钩的 API 列表
   */
  getOverrideList() {
    return Array.from(this.overrides.entries()).map(([path, info]) => ({
      path,
      type: info.type,
      overriddenAt: info.overriddenAt
    }));
  }
  /**
   * 打印调试信息
   */
  debug() {
    if (this.overrides.size === 0) {
      console.log("[WhichWayAPIOverride] No APIs have been overridden or hooked.");
      return;
    }
    console.group(`[WhichWayAPIOverride] ${this.overrides.size} modified API(s):`);
    for (const [path, info] of this.overrides) {
      console.log(`- ${path} (${info.type}) at ${info.overriddenAt}`);
      if (info.type === "hook") {
        console.log(`  Before:`, info.hook?.before);
        console.log(`  After:`, info.hook?.after);
      }
    }
    console.groupEnd();
  }
}
const whichWayAPIOverride = new WhichWayAPIOverride();
onSetDev({
  name: "whichWayAPIOverride_dev",
  fn: () => {
    window.whichWayAPIOverride = whichWayAPIOverride;
  }
});
window.whichWay.register("override", whichWayAPIOverride);
export {
  whichWayAPIOverride
};
//# sourceMappingURL=index.js.map
