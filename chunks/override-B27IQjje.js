import { onSetDev as w } from "./hooks-BscfO9lD.js";
import { _status as v, ai as A, get as $, ui as g, game as I, lib as b } from "noname";
class P {
  constructor() {
    this.overrides = /* @__PURE__ */ new Map();
  }
  /**
   * 允许修改的API列表
   * @type {Record<string, any>}
   */
  apis = {
    lib: b,
    game: I,
    ui: g,
    get: $,
    ai: A,
    _status: v
  };
  /**
   * 是否是合法的API
   * @param {string} name
   *
   * @returns {boolean}
   */
  isVaildAPI(r) {
    return Object.keys(this.apis).includes(r);
  }
  /**
   * 完全替换指定 API
   * @param {string} apiName - 如 "game.check"
   * @param {any} apiNew - 新实现
   */
  overrideAPI(r, e) {
    this._validateAndSet(r, "override", e);
  }
  /**
   * 在原 API 执行前后追加逻辑（不替换原函数）
   * @param {string} apiName - API 路径
   * @param {{ before?: Function, after?: Function }} options
   *   - before(...args): 可返回新参数数组，或返回 false 阻止执行
   *   - after(result, ...originalArgs): 可返回新结果
   */
  async appendHook(r, { before: e, after: i }) {
    if (!e && !i)
      throw new Error('At least one of "before" or "after" must be provided');
    const c = r.split("."), s = c.pop();
    let o = this.apis;
    if (!this.isVaildAPI(c[0]))
      throw new Error(`Invalid API name: ${c[0]} , must be one of ${Object.keys(this.apis)}`);
    const f = (t) => t != null && (typeof t == "object" || typeof t == "function");
    try {
      for (const t of c) {
        if (!f(o))
          throw new Error(`Invalid path: ${r}`);
        o = o[t];
      }
    } catch {
      throw new Error(`Cannot access property ${r}, current Object is ${o}`);
    }
    if (!f(o))
      throw new Error(`Parent of '${s}' is not an object in path: ${r}`);
    const d = o[s];
    if (typeof d != "function")
      throw new Error(`Target API '${r}' is not a function — hooks only work on functions`);
    const h = p(d);
    let a;
    h ? a = async function(...t) {
      if (e) {
        const n = await e.apply(this, t);
        if (n === !1) return;
        Array.isArray(n) && (t = n);
      }
      let l = await d.apply(this, t);
      if (i) {
        const n = await i.call(this, l, ...t);
        return n !== void 0 ? n : l;
      }
      return l;
    } : a = function(...t) {
      if (e) {
        const n = e.apply(this, t);
        if (n === !1) return;
        Array.isArray(n) && (t = n);
      }
      let l = d.apply(this, t);
      if (i) {
        const n = i.call(this, l, ...t);
        return n !== void 0 ? n : l;
      }
      return l;
    };
    const y = {
      original: d,
      current: a,
      type: "hook",
      hook: { before: e, after: i },
      path: r,
      overriddenAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      o[s] = a, this.overrides.set(r, y), console.debug(`[WhichWayAPIOverride] Hook added to: ${r}`);
    } catch (t) {
      throw new Error(`Failed to hook '${r}': ${t.message}`);
    }
    function p(t) {
      return typeof t != "function" ? !1 : t[Symbol.toStringTag] === "AsyncFunction" || t.constructor?.name === "AsyncFunction" || t.toString().startsWith("async ") || t.toString().startsWith("async function");
    }
  }
  /**
   * 内部通用设置逻辑（用于 override 和 hook）
   */
  _validateAndSet(r, e, i) {
    if (typeof r != "string" || !r.trim())
      throw new Error("apiName must be a non-empty string");
    const c = r.split("."), s = c.pop();
    let o = this.apis;
    if (!this.isVaildAPI(c[0]))
      throw new Error(`Invalid API name: ${c[0]} , must be one of ${Object.keys(this.apis)}`);
    if (s === void 0) throw new Error("apiName must be a non-empty string");
    try {
      for (const h of c) {
        if (o == null || typeof o != "object")
          throw new Error(`Cannot access property '${h}' in path '${r}'`);
        o = o[h];
      }
      if (o == null || typeof o != "object")
        throw new Error(`Parent object of '${s}' is invalid in path: ${r}`);
    } catch {
      throw new Error(`Cannot access property ${r}, current Object is ${o}`);
    }
    const d = {
      original: o[s],
      current: i,
      type: e,
      path: r,
      overriddenAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      o[s] = i, this.overrides.set(r, d), console.debug(`[WhichWayAPIOverride] ${e === "override" ? "Overrode" : "Hooked"}: ${r}`);
    } catch (h) {
      throw new Error(`Failed to set '${r}': ${h.message}`);
    }
  }
  /**
   * 恢复指定 API 到原始状态
   */
  restoreAPI(r) {
    const e = this.overrides.get(r);
    if (!e)
      return console.warn(`[WhichWayAPIOverride] No override/hook found for: ${r}`), !1;
    const i = r.split("."), c = i.pop();
    let s = globalThis;
    for (const o of i) s = s[o];
    try {
      return s[c] = e.original, this.overrides.delete(r), console.debug(`[WhichWayAPIOverride] Restored: ${r}`), !0;
    } catch (o) {
      return console.error(`[WhichWayAPIOverride] Failed to restore ${r}:`, o), !1;
    }
  }
  /**
   * 获取所有被覆盖/挂钩的 API 列表
   */
  getOverrideList() {
    return Array.from(this.overrides.entries()).map(([r, e]) => ({
      path: r,
      type: e.type,
      overriddenAt: e.overriddenAt
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
    for (const [r, e] of this.overrides)
      console.log(`- ${r} (${e.type}) at ${e.overriddenAt}`), e.type === "hook" && (console.log("  Before:", e.hook?.before), console.log("  After:", e.hook?.after));
    console.groupEnd();
  }
}
const u = new P();
w({
  name: "whichWayAPIOverride_dev",
  fn: () => {
    window.whichWayAPIOverride = u;
  }
});
window.whichWay.register("override", u);
export {
  u as whichWayAPIOverride
};
