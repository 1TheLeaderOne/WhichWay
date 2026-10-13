class WhichWayHooks {
	constructor() {
		this._generateHooks();
		this._autoId = 0;
		this._hookContexts = {};
	}

	/**
	 * 等待注册的钩子,注册后会自动拓展Before和After
	 * @type {string[]}
	 */
	_pendingHooks = ["extension", "arenaReady", "prepare", "precontent", "content", "config", "init", "character", "setDev"];

	_hooks = {
		config: [],
	};

	/**
	 * 自动生成钩子数组和 onXxx / onBeforeXxx / onAfterXxx 方法
	 */
	_generateHooks() {
		for (const name of this._pendingHooks) {
			const capName = name.charAt(0).toUpperCase() + name.slice(1);

			// 初始化钩子队列（避免重复）
			if (!(name in this._hooks)) {
				this._hooks[name] = [];
				this._hooks[`before${capName}`] = [];
				this._hooks[`after${capName}`] = [];
			}

			// 自动生成 onXxx 方法（绑定 this）
			const createOnMethod = hookKey => {
				return fnOrObj => this._registerHook(hookKey, fnOrObj);
			};

			// 定义 onXxx, onBeforeXxx, onAfterXxx
			this[`on${capName}`] = createOnMethod(name);
			this[`onBefore${capName}`] = createOnMethod(`before${capName}`);
			this[`onAfter${capName}`] = createOnMethod(`after${capName}`);
		}
	}

	/**
	 * 为某个 hook 阶段注册默认上下文参数
	 * @param {string} hookName - 如 "init", "character"
	 * @param {any[]} args - 要传入的参数数组
	 */
	_registerHookContext(hookName, ...args) {
		const capName = hookName.charAt(0).toUpperCase() + hookName.slice(1);
		this._hookContexts[`before${capName}`] = args;
		this._hookContexts[`after${capName}`] = args;
		this._hookContexts[hookName] = args;
	}

	/**
	 * 为 hook 阶段在指定位置设置参数（从 0 开始）
	 * @param {string} hookName
	 * @param {number} index
	 * @param {*} value
	 */
	_registerHookContextAt(hookName, index, value) {
		const capName = hookName.charAt(0).toUpperCase() + hookName.slice(1);
		if (!this._hookContexts[hookName]) {
			this._hookContexts[hookName] = [];
			this._hookContexts[`before${capName}`] = [];
			this._hookContexts[`after${capName}`] = [];
		}
		this._hookContexts[hookName][index] = value;
		this._hookContexts[`before${capName}`][index] = value;
		this._hookContexts[`after${capName}`][index] = value;
	}

	_registerHook(hookKey, fn) {
		if (typeof fn === "function") {
			fn = { fn };
		} else if (typeof fn === "object" && fn.fn === undefined && typeof fn.obj === "object") {
			//后续处理,此处留空
			//检查下fn.obj.name是否存在,作为config,必须要有name
			if (fn.obj.name === undefined) throw new Error(`[WhichWayHooks] Invalid config hook return object, missing "name" property: ${fn.obj}`);
		} else if (typeof fn !== "object" || fn.fn === undefined) {
			throw new Error("[WhichWayHooks] Invalid hook registration object");
		}

		let { name: givenName, priority = 0, fn: hookFn, obj: hookObj } = fn;
		const name = givenName || `anonymous_${++this._autoId}`;

		const existing = this._hooks[hookKey].find(h => h.name === name);
		if (existing) {
			throw new Error(`[WhichWayHooks] Duplicate hook name "${name}" in "${hookKey}". ` + `Hook names must be unique within the same lifecycle stage.`);
		}

		if (hookFn === void 0 && hookObj !== void 0) {
			hookFn = () => hookObj;
		}

		this._hooks[hookKey].push({ name, fn: hookFn, priority, obj: hookObj });
	}

	onConfig(fnOrObj) {
		this._registerHook("config", fnOrObj);
	}

	async _runHooks(name, overrideArgs) {
		const hooks = this._hooks[name];
		if (!hooks?.length) return;

		// 优先使用传入的 overrideArgs，否则用注册的上下文
		const args = overrideArgs !== void 0 ? overrideArgs : this._hookContexts[name] || [];

		const sorted = [...hooks].sort((a, b) => b.priority - a.priority);
		for (const { name: hookName, fn } of sorted) {
			try {
				await fn(...args);
			} catch (err) {
				console.error(`[WhichWayHooks] Error in hook "${hookName}" (${name}):`, err);
				throw err;
			}
		}
	}

	/**
	 * 运行生命周期阶段的钩子
	 * @param {string} name - 生命周期阶段名称,如 "init", "content"
	 * @param {any[]} [overrideArgs] - 要传入的额外参数数组,如 content(config, pack)
	 */
	async _runLifecycle(name, overrideArgs) {
		const capName = name.charAt(0).toUpperCase() + name.slice(1);
		await this._runHooks(`before${capName}`, overrideArgs);
		await this._runHooks(name, overrideArgs);
		await this._runHooks(`after${capName}`, overrideArgs);
	}

	_mergeConfig() {
		const hooks = this._hooks.config;
		if (!hooks.length) return {};

		const sorted = [...hooks].sort((a, b) => b.priority - a.priority);

		let merged = {};
		for (const { name: hookName, fn, obj: hookObj } of sorted) {
			try {
				const part = typeof fn === "function" ? fn() : {};

				const { name, options } = part;

				const option = {};

				if ([name, options].some(v => v === void 0)) throw new Error(`[WhichWayHooks] Invalid config hook return object: ${part}`);

				if (hookObj !== void 0) options["obj"] = hookObj;

				option[name] = options;

				merged = { ...merged, ...option };
			} catch (err) {
				console.error(`[WhichWayHooks] Error in config hook "${hookName}":`, err);
				throw err;
			}
		}
		return merged;
	}

	get whichWayHooksApi() {
		const self = this;
		return {
			arenaReady: async () => await self._runLifecycle("arenaReady"),
			prepare: async () => await self._runLifecycle("prepare"),
			precontent: async () => await self._runLifecycle("precontent"),
			content: async (config, pack) => await self._runLifecycle("content", [config, pack]),
			extension: async () => await self._runLifecycle("extension"),
			get config() {
				return self._mergeConfig();
			},

			setDev: async () => await self._runLifecycle("setDev"),
			character: async pack => await self._runLifecycle("character", [pack]),
			init: async () => await self._runLifecycle("init"),
		};
	}
}

const whichWayHooks = new WhichWayHooks();

/**
 * @type {WhichWayExportHooks}
 */
//@ts-ignore
const exportsMethods = {
	//这玩意不是方法,需要手动添加
	whichWayHooksApi: whichWayHooks.whichWayHooksApi,
	registerHookContext: whichWayHooks._registerHookContext.bind(whichWayHooks),
	registerHookContextAt: whichWayHooks._registerHookContextAt.bind(whichWayHooks),
};

//对方法进行绑定,所有的方法必须以"on"开头,否则检测不到!
for (const key of Object.keys(whichWayHooks)) {
	if (key.startsWith("on") && typeof whichWayHooks[key] === "function") {
		exportsMethods[key] = whichWayHooks[key].bind(whichWayHooks);
	}
}

export const { onSetDev, onExtension, onBeforeExtension, onAfterExtension, onArenaReady, onBeforeArenaReady, onAfterArenaReady, onPrepare, onBeforePrepare, onAfterPrepare, onPrecontent, onBeforePrecontent, onAfterPrecontent, onContent, onBeforeContent, onAfterContent, onConfig, onCharacter, onAfterCharacter,onBeforeCharacter,onInit,onAfterInit, onBeforeInit, whichWayHooksApi, registerHookContext,registerHookContextAt } = exportsMethods;

// 开发者模式暴露
onSetDev({
	name: "whichWayHooks_dev",
	fn: () => {
		window.whichWayHooks = whichWayHooks;
	},
	priority: 114514,
});

//由于hooks加载顺序问题,需要推迟再注册到全局对象
onExtension({
	name: "whichWayHooks_register",
	fn: () => {
		window.whichWay.register("hooks", whichWayHooks);
	},
});
