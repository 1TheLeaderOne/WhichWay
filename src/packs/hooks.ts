import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../utill.js";

type HookName = typeof WhichWayPackHooks._STRING_HOOKS[number] | typeof WhichWayPackHooks._ARRAY_HOOKS[number] | typeof WhichWayPackHooks._OBJECT_HOOKS[number] | typeof WhichWayPackHooks._FUNCTION_HOOKS[number] | typeof WhichWayPackHooks._CARD_HOOKS[number];

type executeFn = (obj: any, key: string, hookName: string) => any | Promise<any>;

/**
 * `register()` 里 `skillInfo` 的单项内容。
 */
export interface RegisterSkillInfo {
	/** 技能中文名，注册为 `lib.translate[技能名]`（技能面板上显示的技能名） */
	skillName: string;
	/** 技能描述，注册为 `lib.translate["{技能名}_info"]`（技能面板上显示的那段文字） */
	info: string;
	/** 技能本体，注册为 `lib.skill[技能名]` */
	skill: ExtendedSkill;
	/** 动态翻译（可选），注册为 `lib.dynamicTranslate[技能名]` */
	dyncTrans?: (player: Player) => string;
	/**
	 * 台词（可选）。第 i 条经 `line()` 落成 `lib.translate["#{技能名}{i + 1}"]`，
	 * 正好对上 `audio: 2` 这类多段配音的 `#技能名1` / `#技能名2`。
	 */
	line?: string[];
}

/**
 * `register()` 的第二个参数。
 *
 * 必填：`character` / `characterTranslate` / `title` / `intro` / `skillInfo`；
 * 可选：`translate` / `characterNamePrefix` / `skill`。
 */
export interface RegisterParams {
	/** 武将本体（同 `character()` 的第二个参数；`name` 由 `register()` 第一个参数提供） */
	character: WhichWayCharacter;
	/** 额外翻译，原样交给 `translate()` */
	translate?: Record<string, string>;
	/** 武将名翻译（落 `lib.translate[name]`） */
	characterTranslate: string;
	/** 武将名前缀，落 `lib.translate["{name}_prefix"]`（引擎 `get.rawName` 据此裁掉名字前缀） */
	characterNamePrefix?: string;
	/**
	 * 称号（同 `characterTitle(name, title)`）。会自动套 `whichWayUtil.colorize()`，
	 * 所以直接写 `#r称号#` 这类颜色代码即可，不用自己包 `<font>` / `<span>`。
	 */
	title: string;
	/** 介绍（同 `characterIntro(name, intro)`） */
	intro: string;
	/**
	 * 阵亡台词（可选）。
	 *
	 * - 字符串：落成 `lib.translate["#{武将名}:die"]`（单条；若 `dieAudios` 有多条，
	 *   它对应第 1 条）；
	 * - `string[]`：第 i 条落成 `lib.translate["#{武将名}{i + 1}:die"]`，与
	 *   `dieAudios` 展平后的第 i+1 条一一对应。
	 *
	 * 与技能台词一样只写「`#{武将名}:die`」这种**作者侧**的键即可：音频模块的
	 * `mirrorDieLines` 会在初始化时把它镜像到实际地址
	 * `#ext:WhichWay/audio/{语言}/die/{武将名}{序号}:die`，**只补空位、不覆盖**。
	 */
	dieLine?: string | string[];
	/** 散装技能，原样交给 `skill()` */
	skill?: Record<string, ExtendedSkill>;
	/** 技能集合：一次补齐技能本体、描述、动态翻译与台词 */
	skillInfo: Record<string, RegisterSkillInfo>;
}

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

	/**
	 * 卡牌专用钩子（不进 pendingRun，由 card 组装器统一收集后构造 mrfzcard 包
	 * 再 game.import("card") 注册给引擎）。
	 *
	 * - card：卡牌定义（key=卡牌id, value=卡牌对象）
	 * - cardSkill：卡牌相关技能（key=技能id, value=技能对象）
	 * - cardTranslate：卡牌相关翻译（key=翻译键, value=字符串）
	 *
	 * 与 character/skill/translate 钩子分开，避免与干员的 skill/translate 混入同一
	 * lib.skill/lib.translate 命名空间（loadCard 处理 card 包时会重复落库并刷
	 * duplicated 警告）。
	 */
	static readonly _CARD_HOOKS = ["card", "cardSkill", "cardTranslate"] as const;


	private _hooks: Record<string, Array<Record<string, any>>> = {};

	public getHooks(hookName: HookName): Array<Record<string, any>> {
		return this._hooks[hookName] || [];
	}

	// ===== 台词钩子（line） =====
	/**
	 * 为配音添加台词。
	 *
	 * 引擎的约定是「在 `lib.translate` 里以 `#音频地址` 为键存台词」（见 `docs/audio-guide.md`
	 * 的「台词配对」一节）；技能音频的地址就是技能名，所以 `audio: 2` 的技能对应
	 * `#技能名1`、`#技能名2` 两个键，`audio: true` 对应 `#技能名`。
	 *
	 * ⚠️ 这只在音频地址仍是**默认路径** `skill/` 时成立。本项目音频模块的 `applySkillAudio`
	 * 会把扩展技能的 `audio` 改写成 `ext:WhichWay/audio/{语言}:{N}`，届时引擎查询的键变成
	 * `#ext:WhichWay/audio/{语言}/{技能名}{序号}` —— 那种地址上的台词由 `mirrorSkillLines`
	 * 从这里的 `#技能名N` 自动镜像过去，所以**台词仍然照常按技能名写**，不要手写 `ext:` 键。
	 *
	 * 本钩子因此是 `translate()` 的语法糖：把「技能名」拼上 `#` 后交给 translate 队列，
	 * 从而与普通翻译共用同一套流程——缓冲进 `pendingRun`、由 `onBeforeInit` 统一落库、
	 * 重复键报错、`colorize` 预处理。
	 *
	 * 两种调用形态（`autoPrefix` 缺省均为 `true`）：
	 * - `line(技能名, 台词, autoPrefix?)`：为单个技能加台词
	 * - `line({ 技能名: 台词, ... }, autoPrefix?)`：批量加台词
	 *
	 * `autoPrefix` 为 `true` 时自动补 `#`：`line("lanshimrfz", "……")` 落库为
	 * `lib.translate["#lanshimrfz"]`。为 `false` 时第一个参数原样当作键，便于自行书写
	 * 带编号或带音频路径的键（如 `"#lanshimrfz1"`、`"#ext:WhichWay/audio/skill/xxx"`）。
	 * 传入的键已带 `#` 时不会重复补齐。
	 */
	public line = (skillOrLines: string | Record<string, string>, lineOrAutoPrefix?: string | boolean, autoPrefix?: boolean): void => {
		const register = (skill: string, content: string, auto: boolean): void => {
			if (typeof skill !== "string" || !skill) {
				throw new Error(`[line] Skill name must be a non-empty string, got ${typeof skill === "string" ? JSON.stringify(skill) : typeof skill}`);
			}
			if (typeof content !== "string") {
				throw new Error(`[line] Line for skill "${skill}" must be string, got ${typeof content}`);
			}
			const key = auto && !skill.startsWith("#") ? `#${skill}` : skill;
			this._assertLineUnique(key);
			this.translate(key, content);
		};

		// 批量注册: line({ skill: line, ... }, autoPrefix?)
		if (typeof skillOrLines === "object" && skillOrLines !== null && !Array.isArray(skillOrLines)) {
			if (lineOrAutoPrefix !== undefined && typeof lineOrAutoPrefix !== "boolean") {
				throw new Error(`[line] Second argument of batch form must be boolean (autoPrefix), got ${typeof lineOrAutoPrefix}`);
			}
			const auto = lineOrAutoPrefix ?? true;
			for (const skill in skillOrLines) {
				if (Object.prototype.hasOwnProperty.call(skillOrLines, skill)) {
					register(skill, skillOrLines[skill], auto);
				}
			}
			return;
		}

		// 单条注册: line(skill, line, autoPrefix?)
		if (typeof skillOrLines === "string") {
			if (typeof lineOrAutoPrefix !== "string") {
				throw new Error(`[line] Line for skill "${skillOrLines}" must be string, got ${typeof lineOrAutoPrefix}`);
			}
			register(skillOrLines, lineOrAutoPrefix, autoPrefix ?? true);
			return;
		}

		throw new Error(`[line] Invalid invocation. Expected:\n  line("skill", "台词", autoPrefix?)\n  line({ skill1: "台词1", skill2: "台词2" }, autoPrefix?)`);
	};

	/**
	 * 台词的重复校验：与 `_runHooks` 的「禁止覆盖已有属性」保持同一口径，
	 * 但提前到注册时抛出，避免错误堆栈指向 pendingRun 的落库现场。
	 */
	private _assertLineUnique(key: string): void {
		const duplicated =
			(this._hooks["translate"] ?? []).some(hook => hook.key === key) ||
			//@ts-ignore lib.translate 为引擎字典，索引签名未覆盖任意字符串键
			lib.translate?.[key] !== undefined;
		if (duplicated) {
			throw new Error(
				`[line] Duplicate line key "${key}". 同一配音地址只能有一条台词；` +
					`若同一技能要配多条，请用带编号的键，如 line({ ${key.replace(/^#/, "")}1: "…", ${key.replace(/^#/, "")}2: "…" })。`
			);
		}
	}

	// ===== 干员一键注册（语法糖） =====
	/**
	 * 干员注册语法糖：一次调用补齐「武将本体 + 名字翻译 + 名字前缀 + 称号 + 介绍 + 技能 + 技能名 + 技能描述 + 动态翻译 + 台词」，
	 * 所有以 `name` 为键的项都由第一个参数提供，不用再手写一遍。
	 *
	 * ⚠️ 它只做**转发**：每一项都仍然调用原有的 `character()` / `translate()` / `characterTitle()` /
	 * `characterIntro()` / `skill()` / `dynamicTranslate()` / `line()`，因此缓冲进 `pendingRun`、
	 * `onBeforeInit` 统一落库、`translate` 的 `colorize` 预处理、重复键拦截等行为与手写完全一致，
	 * 后续要统一调整注册流程只需改原 API。
	 *
	 * 必填：`character` / `characterTranslate` / `title` / `intro` / `skillInfo`；
	 * 可选：`translate` / `characterNamePrefix` / `skill` / `dieLine`。
	 *
	 * `title` 会自动套 `whichWayUtil.colorize()`，直接写 `#r称号#` 即可。
	 *
	 * @example
	 * register("char_2027_wang", {
	 * 	character: { sex: "male", group: "suimrfz", hp: 4, pack: "legendSJZX", skills: ["qushimrfz"] },
	 * 	characterTranslate: "望",
	 * 	characterNamePrefix: "炎国",
	 * 	title: "#b胜天半子#", // 自动 colorize 成蓝色
	 * 	intro: "望，曾担任炎国军事顾问……",
	 * 	dieLine: "落子无悔。", // 可选：→ lib.translate["#char_2027_wang:die"]
	 * 	skillInfo: {
	 * 		qushimrfz: {
	 * 			skillName: "取势", // → lib.translate["qushimrfz"]
	 * 			info: "锁定技，……",
	 * 			skill: { trigger: { player: "useCardBegin" }, async content(event, trigger, player) {} },
	 * 			line: ["劲发江潮落，气收秋毫平。"],
	 * 		},
	 * 	},
	 * });
	 * // ⇒ character("char_2027_wang", …) / translate("char_2027_wang", "望")
	 * //   translate("char_2027_wang_prefix", "炎国") / characterTitle(…) / characterIntro(…)
	 * //   skill("qushimrfz", …) / translate("qushimrfz", "取势") / translate("qushimrfz_info", …)
	 * //   translate("#qushimrfz1", …)
	 */
	public register = (name: string, params: RegisterParams): void => {
		// ===== 入参校验全部前置：避免注册到一半才抛错、留下半套数据 =====
		if (typeof name !== "string" || !name) {
			throw new Error(`[register] name 必须是非空字符串，收到 ${typeof name === "string" ? JSON.stringify(name) : typeof name}`);
		}
		if (!params || typeof params !== "object" || Array.isArray(params)) {
			throw new Error(`[register] "${name}" 的第二个参数必须是对象`);
		}
		const raw = params as unknown as Record<string, unknown>;
		const knownKeys = ["character", "translate", "characterTranslate", "characterNamePrefix", "title", "intro", "dieLine", "skill", "skillInfo"];
		for (const key of Object.keys(raw)) {
			if (!knownKeys.includes(key)) {
				throw new Error(`[register] "${name}" 的 params 里有未知字段 "${key}"，可用字段：${knownKeys.join(", ")}`);
			}
		}
		const requiredKeys = ["character", "characterTranslate", "title", "intro", "skillInfo"];
		const missing = requiredKeys.filter(key => raw[key] === undefined);
		if (missing.length) {
			throw new Error(`[register] "${name}" 缺少必填字段：${missing.join(", ")}`);
		}
		if (typeof params.skillInfo !== "object" || params.skillInfo === null || Array.isArray(params.skillInfo)) {
			throw new Error(`[register] "${name}" 的 skillInfo 必须是对象：Record<技能名, { skillName, info, skill, dyncTrans?, line? }>`);
		}
		//可选字段同样前置校验：避免武将/技能已经注册进队列、才因为 dieLine 写错而抛错
		const dieLineEntries = params.dieLine === void 0 ? undefined : this.dieLineEntries(name, params.dieLine);

		// ===== 1. 武将本体（name 即注册名） =====
		this.character(name, params.character);

		// ===== 2. 武将名翻译 / 名字前缀 =====
		this.translate(name, params.characterTranslate);
		if (params.characterNamePrefix !== undefined) {
			this.translate(`${name}_prefix`, params.characterNamePrefix);
		}

		// ===== 3. 称号 / 介绍 =====
		//称号统一走 colorize：作者直接写 "#r称号#" 即可，不必自己包 <font> / <span>（与现有干员的手写习惯一致）
		this.characterTitle(name, whichWayUtil.colorize(params.title));
		this.characterIntro(name, params.intro);

		// ===== 4. 额外翻译 / 散装技能 =====
		if (params.translate !== undefined) this.translate(params.translate);
		if (params.skill !== undefined) this.skill(params.skill);

		// ===== 5. skillInfo：技能本体 + 技能名 + 描述 + 动态翻译 + 台词 =====
		for (const skillName of Object.keys(params.skillInfo)) {
			const info = params.skillInfo[skillName];
			if (!info || typeof info !== "object") {
				throw new Error(`[register] "${name}" 的 skillInfo["${skillName}"] 必须是对象`);
			}
			// 走批量形态：`skill()` 的 declare 把第二个参数写成了 Record<string, ExtendedSkill>，
			// 单条形态直接传 ExtendedSkill 会类型报错（运行时两者等价）
			this.skill({ [skillName]: info.skill });
			this.translate(skillName, info.skillName);
			this.translate(`${skillName}_info`, info.info);
			if (info.dyncTrans !== undefined) this.dynamicTranslate(skillName, info.dyncTrans);
			if (info.line !== undefined) {
				if (!Array.isArray(info.line)) {
					throw new Error(`[register] "${name}" 的 skillInfo["${skillName}"].line 必须是 string[]`);
				}
				if (info.line.length) {
					// 交给 line() 统一处理：自动补 #、重复键校验、colorize 预处理都与手写台词一致
					const lines: Record<string, string> = {};
					info.line.forEach((text, index) => {
						lines[`${skillName}${index + 1}`] = text;
					});
					this.line(lines);
				}
			}
		}

		// ===== 6. 阵亡台词（可选） =====
		// 键的约定与音频模块 mirrorDieLines 的镜像规则一致：
		// 单条 → `#{武将名}:die`（对应第 1 条）；多条 → `#{武将名}{序号}:die`
		if (dieLineEntries && Object.keys(dieLineEntries).length) this.line(dieLineEntries);
	};

	/**
	 * 把 `register()` 的 `dieLine` 规整成 `line()` 需要的 `{ 键: 台词 }`。
	 *
	 * - 字符串：`#{武将名}:die`（单条，对应 `dieAudios` 展平后的第 1 条）；
	 * - 数组：`#{武将名}{i + 1}:die`，与 `dieAudios` 展平后的顺序一一对应。
	 *
	 * @param name 武将注册名
	 * @param dieLine 作者写的阵亡台词
	 * @returns 交给 `line()` 的键值对（未做 `#` 前缀，由 `line()` 统一补）
	 */
	private dieLineEntries(name: string, dieLine: string | string[]): Record<string, string> {
		if (typeof dieLine === "string") {
			if (!dieLine) throw new Error(`[register] "${name}" 的 dieLine 不能是空字符串`);
			return { [`${name}:die`]: dieLine };
		}
		if (!Array.isArray(dieLine)) {
			throw new Error(`[register] "${name}" 的 dieLine 必须是字符串或字符串数组`);
		}
		const entries: Record<string, string> = {};
		dieLine.forEach((text, index) => {
			if (typeof text !== "string" || !text) {
				throw new Error(`[register] "${name}" 的 dieLine 第 ${index + 1} 条必须是非空字符串`);
			}
			entries[`${name}${index + 1}:die`] = text;
		});
		return entries;
	}

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

		// ===== 第五组：卡牌专用钩子（不进 pendingRun，由 card 组装器收集） =====
		// card / cardSkill 为 object 类型，cardTranslate 为 string 类型
		for (const name of WhichWayPackHooks._CARD_HOOKS) {
			this._hooks[name] = [];
			this._execute[name] = [];
			const valueType = name === "cardTranslate" ? "string" : "object";
			this[name] = ((...args: any[]) => {
				this._registerTypedHook(name, args, valueType as any);
			}) as any;
			// 不 push pendingRun —— card 钩子不直接落库 lib.card
			// （会绕过 loadCard 的 cardPack 处理），由组装器收集后 game.import("card")
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

		//这里原本按 hook.priority 排序，但 _validateAndRegister 往队列里只 push { key, obj }，
		//注册 API 也没有任何地方能传 priority ⇒ 每一项都是 undefined，排序恒为 0-0 的空操作。
		//既然排序不生效，就别留这个「看起来支持优先级」的假象：执行顺序就是注册顺序。
		for (const hook of hooks) {
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
						//两处都会丢结果：传 obj 会让每个 execute 都从原始值起步（后一个覆盖前一个，链式预处理失效）；
						//而 `|| finalValue` 又把 execute 合法返回的 0 / "" / false 当成「没返回」，退回原值。
						const next = fn(finalValue, key, hookName);
						if (next !== undefined) finalValue = next;
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
		key: string | Record<string, WhichWayCharacter>,
		content?: WhichWayCharacter
	) => void;

	declare skill: (
		key: string | Record<string, ExtendedSkill>,
		content?: Record<string, ExtendedSkill>
	) => void;

	declare dynamicTranslate: (
		key: string | Record<string, (player: Player) => string>,
		content?: (player: Player) => string
	) => void;

	// ===== 卡牌专用钩子声明 =====
	declare card: (
		key: string | Record<string, CardInfo>,
		content?: CardInfo
	) => void;

	declare cardSkill: (
		key: string | Record<string, ExtendedSkill>,
		content?: ExtendedSkill
	) => void;

	declare cardTranslate: (
		key: string | Record<string, string>,
		content?: string
	) => void;

	// ===== 台词钩子声明 =====
	//`line` 有真实实现（见上方 public line），这里不能用 declare 重声明，否则
	//TypeScript 会报「标识符重复」；两种调用形态的类型由该属性的参数类型（联合类型）覆盖。
}

export const packHooks = new WhichWayPackHooks();

export const {
	skill,
	character,
	translate,
	characterIntro,
	characterTitle,
	characterReplace,
	dynamicTranslate,
	card,
	cardSkill,
	cardTranslate,
	line,
	register,
	pendingRun,
	registerExecute
} = packHooks;
