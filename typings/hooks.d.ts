interface HookRegistrationObject {
	/**钩子名字 */
	name?: string;
	/**钩子的优先级,数字越大优先级越高,默认为0 */
	priority?: number;
	/**钩子的函数 */
	fn: (...args: any[]) => any;
}

type HookInitArgs = [Array<WhichWayObjectificationCharacterPack>]

interface HookRegistrationInit {
	/**钩子名字 */
	name?: string;
	/**钩子的优先级,数字越大优先级越高,默认为0 */
	priority?: number;
	/**钩子的函数 */
	fn: (...args: HookInitArgs) => any;
}

interface HookRegistrationCharacter {
	/**钩子名字 */
	name?: string;
	/**钩子的优先级,数字越大优先级越高,默认为0 */
	priority?: number;
	/**钩子的函数 */
	fn: (pack: WhichWayObjectificationCharacterPack) => any;
}

type configHookReturnObject = {
	/**
	 * 配置项的名字
	 */
	name: string;
	/**
	 * 配置项的内容
	 */
	options: whichWayConfigOptions;
};

interface ConfigHookRegistrationObject {
	/**钩子名字 */
	name?: string;
	/**
	 * 优先级越高越靠前
	 * 设置的范围在399-799之间
	 * 致谢的范围在<399
	 * 扩展介绍的范围在>799
	 */
	priority?: number;
	/**
	 * 钩子函数,与obj选择其一即可,优先执行fn
	 */
	fn?: () => configHookReturnObject;
	/**
	 * 钩子函数,与fn选择其一即可,优先执行fn
	 */
	obj?: configHookReturnObject;
}

interface WhichWayHooksApi {
	arenaReady(): Promise<void>;
	prepare(): Promise<void>;
	precontent(): Promise<void>;
	content(config: Record<string, any>, pack: any): Promise<void>;
	extension(): Promise<void>;
	setDev(): Promise<void>;
	readonly config: Record<string, any>;
	character(pack: WhichWayCharacterPack): Promise<void>;
	init(): Promise<void>;
}

declare interface WhichWayExportHooks {
	onSetDev(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onCharacter(fnOrObj: ((pack: WhichWayObjectificationCharacterPack) => any) | HookRegistrationCharacter): void;
	onBeforeCharacter(fnOrObj: ((pack: WhichWayObjectificationCharacterPack) => any) | HookRegistrationCharacter): void;
	onAfterCharacter(fnOrObj: ((pack: WhichWayObjectificationCharacterPack) => any) | HookRegistrationCharacter): void;
	onInit(fnOrObj: ((...args: HookInitArgs) => any) | HookRegistrationInit): void;
	onBeforeInit(fnOrObj: ((...args: HookInitArgs) => any) | HookRegistrationInit): void;
	onAfterInit(fnOrObj: ((...args: HookInitArgs) => any) | HookRegistrationInit): void;

	onExtension(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onBeforeExtension(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onAfterExtension(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;

	onArenaReady(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onBeforeArenaReady(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onAfterArenaReady(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;

	onPrepare(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onBeforePrepare(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onAfterPrepare(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;

	onPrecontent(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onBeforePrecontent(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onAfterPrecontent(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;

	onContent(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onBeforeContent(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;
	onAfterContent(fnOrObj: ((...args: any[]) => any) | HookRegistrationObject): void;

	onConfig(fnOrObj: (() => Record<string, any>) | ConfigHookRegistrationObject): void;

	whichWayHooksApi: WhichWayHooksApi;

	/**
	 * 注册一个钩子上下文
	 * @param name 钩子名字
	 * @param context 钩子上下文
	 */
	registerHookContext(name: string, context: any): void;

	/**
	 * 注册一个钩子上下文(可指定位置)
	 */
	registerHookContextAt(name: string, index: number, value: any): void;
}
