class p {
  constructor() {
    this._generateHooks(), this._autoId = 0, this._hookContexts = {};
  }
  /**
   * 等待注册的钩子,注册后会自动拓展Before和After
   * @type {string[]}
   */
  _pendingHooks = ["extension", "arenaReady", "prepare", "precontent", "content", "config", "init", "character", "setDev"];
  _hooks = {
    config: []
  };
  /**
   * 自动生成钩子数组和 onXxx / onBeforeXxx / onAfterXxx 方法
   */
  _generateHooks() {
    for (const o of this._pendingHooks) {
      const t = o.charAt(0).toUpperCase() + o.slice(1);
      o in this._hooks || (this._hooks[o] = [], this._hooks[`before${t}`] = [], this._hooks[`after${t}`] = []);
      const e = (n) => (s) => this._registerHook(n, s);
      this[`on${t}`] = e(o), this[`onBefore${t}`] = e(`before${t}`), this[`onAfter${t}`] = e(`after${t}`);
    }
  }
  /**
   * 为某个 hook 阶段注册默认上下文参数
   * @param {string} hookName - 如 "init", "character"
   * @param {any[]} args - 要传入的参数数组
   */
  _registerHookContext(o, ...t) {
    const e = o.charAt(0).toUpperCase() + o.slice(1);
    this._hookContexts[`before${e}`] = t, this._hookContexts[`after${e}`] = t, this._hookContexts[o] = t;
  }
  /**
   * 为 hook 阶段在指定位置设置参数（从 0 开始）
   * @param {string} hookName
   * @param {number} index
   * @param {*} value
   */
  _registerHookContextAt(o, t, e) {
    const n = o.charAt(0).toUpperCase() + o.slice(1);
    this._hookContexts[o] || (this._hookContexts[o] = [], this._hookContexts[`before${n}`] = [], this._hookContexts[`after${n}`] = []), this._hookContexts[o][t] = e, this._hookContexts[`before${n}`][t] = e, this._hookContexts[`after${n}`][t] = e;
  }
  _registerHook(o, t) {
    if (typeof t == "function")
      t = { fn: t };
    else if (typeof t == "object" && t.fn === void 0 && typeof t.obj == "object") {
      if (t.obj.name === void 0) throw new Error(`[WhichWayHooks] Invalid config hook return object, missing "name" property: ${t.obj}`);
    } else if (typeof t != "object" || t.fn === void 0)
      throw new Error("[WhichWayHooks] Invalid hook registration object");
    let { name: e, priority: n = 0, fn: s, obj: c } = t;
    const i = e || `anonymous_${++this._autoId}`;
    if (this._hooks[o].find((f) => f.name === i))
      throw new Error(`[WhichWayHooks] Duplicate hook name "${i}" in "${o}". Hook names must be unique within the same lifecycle stage.`);
    s === void 0 && c !== void 0 && (s = () => c), this._hooks[o].push({ name: i, fn: s, priority: n, obj: c });
  }
  onConfig(o) {
    this._registerHook("config", o);
  }
  async _runHooks(o, t) {
    const e = this._hooks[o];
    if (!e?.length) return;
    const n = t !== void 0 ? t : this._hookContexts[o] || [], s = [...e].sort((c, i) => i.priority - c.priority);
    for (const { name: c, fn: i } of s)
      try {
        await i(...n);
      } catch (h) {
        throw console.error(`[WhichWayHooks] Error in hook "${c}" (${o}):`, h), h;
      }
  }
  /**
   * 运行生命周期阶段的钩子
   * @param {string} name - 生命周期阶段名称,如 "init", "content"
   * @param {any[]} [overrideArgs] - 要传入的额外参数数组,如 content(config, pack)
   */
  async _runLifecycle(o, t) {
    const e = o.charAt(0).toUpperCase() + o.slice(1);
    await this._runHooks(`before${e}`, t), await this._runHooks(o, t), await this._runHooks(`after${e}`, t);
  }
  _mergeConfig() {
    const o = this._hooks.config;
    if (!o.length) return {};
    const t = [...o].sort((n, s) => s.priority - n.priority);
    let e = {};
    for (const { name: n, fn: s, obj: c } of t)
      try {
        const i = typeof s == "function" ? s() : {}, { name: h, options: f } = i, k = {};
        if ([h, f].some((_) => _ === void 0)) throw new Error(`[WhichWayHooks] Invalid config hook return object: ${i}`);
        c !== void 0 && (f.obj = c), k[h] = f, e = { ...e, ...k };
      } catch (i) {
        throw console.error(`[WhichWayHooks] Error in config hook "${n}":`, i), i;
      }
    return e;
  }
  get whichWayHooksApi() {
    const o = this;
    return {
      arenaReady: async () => await o._runLifecycle("arenaReady"),
      prepare: async () => await o._runLifecycle("prepare"),
      precontent: async () => await o._runLifecycle("precontent"),
      content: async (t, e) => await o._runLifecycle("content", [t, e]),
      extension: async () => await o._runLifecycle("extension"),
      get config() {
        return o._mergeConfig();
      },
      setDev: async () => await o._runLifecycle("setDev"),
      character: async (t) => await o._runLifecycle("character", [t]),
      init: async () => await o._runLifecycle("init")
    };
  }
}
const r = new p(), y = {
  //这玩意不是方法,需要手动添加
  whichWayHooksApi: r.whichWayHooksApi,
  registerHookContext: r._registerHookContext.bind(r),
  registerHookContextAt: r._registerHookContextAt.bind(r)
};
for (const a of Object.keys(r))
  a.startsWith("on") && typeof r[a] == "function" && (y[a] = r[a].bind(r));
const { onSetDev: g, onExtension: w, onArenaReady: u, onContent: H, onBeforeContent: d, onConfig: C, onInit: l, onBeforeInit: b, whichWayHooksApi: x, registerHookContextAt: W } = y;
g({
  name: "whichWayHooks_dev",
  fn: () => {
    window.whichWayHooks = r;
  },
  priority: 114514
});
w({
  name: "whichWayHooks_register",
  fn: () => {
    window.whichWay.register("hooks", r);
  }
});
export {
  u as onArenaReady,
  d as onBeforeContent,
  b as onBeforeInit,
  C as onConfig,
  H as onContent,
  w as onExtension,
  l as onInit,
  g as onSetDev,
  W as registerHookContextAt,
  x as whichWayHooksApi
};
