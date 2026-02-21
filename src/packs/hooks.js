import { lib } from "noname";
class WhichWayPackHooks {
  constructor() {
    this._generateHooks();
  }
  _autoId = 0;
  // ===== 钩子分组定义 =====
  _stringHooks = ["translate", "characterIntro", "characterTitle"];
  // string: string
  _arrayHooks = ["characterReplace"];
  // string: Array<any>
  _objectHooks = ["character", "skill"];
  // string: Object
  _functionHooks = ["dynamicTranslate"];
  // string: (player) => string
  _hooks = {};
  _generateHooks() {
    this._hooks = {};
    for (const name of this._stringHooks) {
      this._hooks[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "string");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
    for (const name of this._arrayHooks) {
      this._hooks[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "array");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
    for (const name of this._objectHooks) {
      this._hooks[name] = [];
      this[name] = ((...args) => {
        this._registerTypedHook(name, args, "object");
      });
      this.pendingRun.push(() => this._runHooks(name));
    }
    for (const name of this._functionHooks) {
      this._hooks[name] = [];
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
    }[valueType];
    throw new Error(
      `[${hookName}] Invalid invocation. Expected:
${examples}`
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
      // 所有值都通过 obj 存储，运行时直接赋值
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
        lib[hookName][key] = obj;
      } catch (err) {
        console.error(`[WhichWayPackHooks] Error setting hook "${String(key)}" (${hookName}):`, err);
        throw err;
      }
    }
  }
  pendingRun = [];
  // ======================
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
  pendingRun
} = packHooks;
export {
  character,
  characterIntro,
  characterReplace,
  characterTitle,
  dynamicTranslate,
  pendingRun,
  skill,
  translate
};
//# sourceMappingURL=hooks.js.map
