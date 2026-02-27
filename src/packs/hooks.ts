import { lib, game, ui, get, ai, _status } from "noname";

type HookName = typeof WhichWayPackHooks._STRING_HOOKS[number] | typeof WhichWayPackHooks._ARRAY_HOOKS[number] | typeof WhichWayPackHooks._OBJECT_HOOKS[number] | typeof WhichWayPackHooks._FUNCTION_HOOKS[number];

type executeFn = (obj: any, key: string, hookName: string) => any | Promise<any>;

class WhichWayPackHooks {
	constructor() {
		this._generateHooks();
	}

	private _autoId = 0;

	private _execute: Record<HookName | string, executeFn[]> = {};

	// ===== 钩子分组定义 =====
	static readonly _STRING_HOOKS = ["translate", "characterIntro", "characterTitle"] as const;
	static readonly _ARRAY_HOOKS = ["characterReplace"] as const;
	static readonly _OBJECT_HOOKS = ["character", "skill"] as const;
	static readonly _FUNCTION_HOOKS = ["dynamicTranslate"] as const;


	private _hooks: Record<string, Array<Record<string, any>>> = {};

	// ===== 新增：注册 execute 预处理函数 =====
	/**
	 * 为指定 hook 注册预处理函数
	 * @param hookName 钩子名称（如 "translate"）
	 * @param executeFn 预处理函数，接收 (obj, key, hookName)，返回处理后的值
	 */
	public registerExecute = (
		hookName: HookName, 
		executeFn: (obj: any, key: string, hookName: string) => any
	): void => {
		// 校验 hook 是否存在
		if (!this._hooks[hookName]) {
			const available = Object.keys(this._hooks).join(", ");
			throw new Error(
				`[WhichWayPackHooks] Cannot register execute for unknown hook: "${hookName}". ` +
				`Available hooks: ${available || "none (call _generateHooks first)"}`
			);
		}
		// 校验函数类型
		if (typeof executeFn !== "function") {
			throw new Error(
				`[WhichWayPackHooks] executeFn must be a function for hook "${hookName}", got ${typeof executeFn}`
			);
		}
		this._execute[hookName].push(executeFn);
	}

	private _generateHooks() {
		this._hooks = {};
		this._execute = {};

		// ===== 第一组：string: string 钩子 =====
		for (const name of WhichWayPackHooks._STRING_HOOKS) {
			this._hooks[name] = [];
			this._execute[name] = [];
			this[name] = ((...args: any[]) => {
				this._registerTypedHook(name, args, "string");
			}) as any;
			this.pendingRun.push(() => this._runHooks(name));
		}

		// ===== 第二组：string: Array 钩子 =====
		for (const name of WhichWayPackHooks._ARRAY_HOOKS) {
			this._hooks[name] = [];
			this._execute[name] = [];
			this[name] = ((...args: any[]) => {
				this._registerTypedHook(name, args, "array");
			}) as any;
			this.pendingRun.push(() => this._runHooks(name));
		}

		// ===== 第三组：string: Object 钩子 =====
		for (const name of WhichWayPackHooks._OBJECT_HOOKS) {
			this._hooks[name] = [];
			this._execute[name] = [];
			this[name] = ((...args: any[]) => {
				this._registerTypedHook(name, args, "object");
			}) as any;
			this.pendingRun.push(() => this._runHooks(name));
		}

		// ===== 第四组：string: Function 钩子 =====
		for (const name of WhichWayPackHooks._FUNCTION_HOOKS) {
			this._hooks[name] = [];
			this._execute[name] = [];
			this[name] = ((...args: any[]) => {
				this._registerTypedHook(name, args, "function");
			}) as any;
			this.pendingRun.push(() => this._runHooks(name));
		}
	}

	// ========== 统一类型注册入口 ==========
	private _registerTypedHook(
		hookName: string,
		args: any[],
		valueType: "string" | "array" | "object" | "function"
	): void {
		// 批量注册: hook({k: value})
		if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && !Array.isArray(args[0])) {
			for (const key in args[0]) {
				if (Object.prototype.hasOwnProperty.call(args[0], key)) {
					this._validateAndRegister(hookName, key, args[0][key], valueType);
				}
			}
			return;
		}

		// 单条注册: hook(key: string, value: T)
		if (args.length === 2 && typeof args[0] === "string") {
			this._validateAndRegister(hookName, args[0], args[1], valueType);
			return;
		}

		// 错误提示
		const typeDesc: Record<typeof valueType, string> = {
			string: "string",
			array: "Array",
			object: "object",
			function: "Function"
		};

		const examples: Record<typeof valueType, string> = {
			string: `  ${hookName}("key", "value")\n  ${hookName}({ key1: "value1", key2: "value2" })`,
			array: `  ${hookName}("key", ["item1", "item2"])\n  ${hookName}({ key1: ["a"], key2: ["b", "c"] })`,
			object: `  ${hookName}("key", { prop: value })\n  ${hookName}({ key1: { ... }, key2: { ... } })`,
			function: `  ${hookName}("key", (player) => "text")\n  ${hookName}({ key1: (p) => "a", key2: (p) => "b" })`
		};

		throw new Error(
			`[${hookName}] Invalid invocation. Expected:\n${examples[valueType]}`
		);
	}

	// ========== 类型校验与注册 ==========
	private _validateAndRegister(
		hookName: string,
		key: string,
		value: any,
		valueType: "string" | "array" | "object" | "function"
	): void {
		// 类型校验
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

		// 注册到钩子队列
		this._hooks[hookName].push({
			key,
			obj: value
		});
	}

	// ========== 运行钩子 ==========
	private async _runHooks(hookName: string, args: any[] = []): Promise<void> {
		const hooks = this._hooks[hookName];
		if (!hooks?.length) return;

		const sorted = [...hooks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

		for (const hook of sorted) {
			const { key, obj } = hook;

			// ===== 防重复校验：禁止覆盖已有属性 =====
			if (lib[hookName]?.[key] !== undefined) {
				throw new Error(
					`[WhichWayPackHooks] Duplicate hook key "${String(key)}" in "${hookName}". ` +
					`lib.${hookName}["${String(key)}"] already exists and cannot be overwritten.`
				);
			}

			try {
				// ===== execute 预处理逻辑 =====
				let finalValue = obj;
				
				// 如果该 hook 注册了 execute 函数，则先执行预处理
				if (this._execute[hookName] && this._execute[hookName].length>0) {
					for(const fn of this._execute[hookName]){
						finalValue = fn(obj, key, hookName) || finalValue;
					}
				}

				// 使用处理后的值进行赋值
				lib[hookName][key] = finalValue;
				
			} catch (err) {
				console.error(`[WhichWayPackHooks] Error setting hook "${String(key)}" (${hookName}):`, err);
				throw err;
			}
		}
	}

	pendingRun: Function[] = [];

	// ====== 类型声明 ======
	declare translate: (
		key: string | Record<string, string>,
		content?: string
	) => void;

	declare characterIntro: (
		key: string | Record<string, string>,
		content?: string
	) => void;

	declare characterTitle: (
		key: string | Record<string, string>,
		content?: string
	) => void;

	declare characterReplace: (
		key: string | Record<string, string[]>,
		content?: string[]
	) => void;

	declare character: (
		key: string | Record<string, WhichWayCharacterPending>,
		content?: WhichWayCharacterPending
	) => void;

	declare skill: (
		key: string | Record<string, ExtendedSkill>,
		content?: Record<string, ExtendedSkill>
	) => void;

	declare dynamicTranslate: (
		key: string | Record<string, (player: Player) => string>,
		content?: (player: Player) => string
	) => void;
}

const packHooks = new WhichWayPackHooks();

export const {
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
