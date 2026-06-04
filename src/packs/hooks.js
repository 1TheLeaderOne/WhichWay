import { lib } from "noname";
class WhichWayPackHooks {
  constructor() {
    this._generateHooks();
  }
  _autoId = 0;
  _execute = {};
  // ===== 钩子分组定义 =====
  static _STRING_HOOKS = ["translate", "characterIntro", "characterTitle"];
  static _ARRAY_HOOKS = ["characterReplace"];
  static _OBJECT_HOOKS = ["character", "skill"];
  static _FUNCTION_HOOKS = ["dynamicTranslate"];
  _hooks = {};
  getHooks(hookName) {
    return this._hooks[hookName] || [];
  }
  // ===== 新增：注册 execute 预处理函数 =====
  /**
   * 为指定 hook 注册预处理函数
   * @param hookName 钩子名称（如 "translate"）
   * @param executeFn 预处理函数，接收 (obj, key, hookName)，返回处理后的值
   */
  registerExecute = (hookName, executeFn) => {
    if (!this._hooks[hookName]) {
      const available = Object.keys(this._hooks).join(", ");
      throw new Error(
        `[WhichWayPackHooks] Cannot register execute for unknown hook: "${hookName}". Available hooks: ${available || "none (call _generateHooks first)"}`
      );
    }
    if (typeof executeFn !== "function") {
      throw new Error(
        `[WhichWayPackHooks] executeFn must be a function for hook "${hookName}", got ${typeof executeFn}`
      );
    }
    this._execute[hookName].push(executeFn);
  };
  _generateHooks() {
    this._hooks = {};
    this._execute = {};
    for (const name of WhichWayPackHooks._STRING_HOOKS) {
      this._hooks[name] = [];
      this._execute[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "string");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
    for (const name of WhichWayPackHooks._ARRAY_HOOKS) {
      this._hooks[name] = [];
      this._execute[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "array");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
    for (const name of WhichWayPackHooks._OBJECT_HOOKS) {
      this._hooks[name] = [];
      this._execute[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "object");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
    for (const name of WhichWayPackHooks._FUNCTION_HOOKS) {
      this._hooks[name] = [];
      this._execute[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "function");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
  }
  // ========== 统一类型注册入口 ==========
  _registerTypedHook(hookName, args, valueType) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && !Array.isArray(args[0])) {
      for (const key in args[0]) {
        if (Object.prototype.hasOwnProperty.call(args[0], key)) {
          this._validateAndRegister(hookName, key, args[0][key], valueType);
        }
      }
      return;
    }
    if (args.length === 2 && typeof args[0] === "string") {
      this._validateAndRegister(hookName, args[0], args[1], valueType);
      return;
    }
    const examples = {
      string: `  ${hookName}("key", "value")
  ${hookName}({ key1: "value1", key2: "value2" })`,
      array: `  ${hookName}("key", ["item1", "item2"])
  ${hookName}({ key1: ["a"], key2: ["b", "c"] })`,
      object: `  ${hookName}("key", { prop: value })
  ${hookName}({ key1: { ... }, key2: { ... } })`,
      function: `  ${hookName}("key", (player) => "text")
  ${hookName}({ key1: (p) => "a", key2: (p) => "b" })`
    };
    throw new Error(
      `[${hookName}] Invalid invocation. Expected:
${examples[valueType]}`
    );
  }
  // ========== 类型校验与注册 ==========
  _validateAndRegister(hookName, key, value, valueType) {
    switch (valueType) {
      case "string":
        if (typeof value !== "string") {
          throw new Error(
            `[${hookName}] Value for key "${key}" must be string, got ${typeof value}`
          );
        }
        break;
      case "array":
        if (!Array.isArray(value)) {
          throw new Error(
            `[${hookName}] Value for key "${key}" must be Array, got ${typeof value}`
          );
        }
        break;
      case "object":
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
          throw new Error(
            `[${hookName}] Value for key "${key}" must be plain object, got ${typeof value}`
          );
        }
        break;
      case "function":
        if (typeof value !== "function") {
          throw new Error(
            `[${hookName}] Value for key "${key}" must be function, got ${typeof value}`
          );
        }
        break;
    }
    this._hooks[hookName].push({
      key,
      obj: value
    });
  }
  // ========== 运行钩子 ==========
  async _runHooks(hookName, args = []) {
    const hooks = this._hooks[hookName];
    if (!hooks?.length) return;
    const sorted = [...hooks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    for (const hook of sorted) {
      const { key, obj } = hook;
      if (lib[hookName]?.[key] !== void 0) {
        throw new Error(
          `[WhichWayPackHooks] Duplicate hook key "${String(key)}" in "${hookName}". lib.${hookName}["${String(key)}"] already exists and cannot be overwritten.`
        );
      }
      try {
        let finalValue = obj;
        if (this._execute[hookName] && this._execute[hookName].length > 0) {
          for (const fn of this._execute[hookName]) {
            finalValue = fn(obj, key, hookName) || finalValue;
          }
        }
        lib[hookName][key] = finalValue;
      } catch (err) {
        console.error(`[WhichWayPackHooks] Error setting hook "${String(key)}" (${hookName}):`, err);
        throw err;
      }
    }
  }
  pendingRun = [];
}
const packHooks = new WhichWayPackHooks();
const {
  skill,
  character,
  translate,
  characterIntro,
  characterTitle,
  characterReplace,
  dynamicTranslate,
  pendingRun,
  registerExecute
} = packHooks;
export {
  character,
  characterIntro,
  characterReplace,
  characterTitle,
  dynamicTranslate,
  packHooks,
  pendingRun,
  registerExecute,
  skill,
  translate
};
//# sourceMappingURL=hooks.js.map
