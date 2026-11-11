/**
 * helper/index.ts —— WhichWayHelper 新手帮助管理器
 *
 * 职责：
 * 1. 维护当前任务链（HelperTaskChain）与运行选项；
 * 2. 首次使用时挂载常驻 Vue 应用（GuideOverlay.vue），之后复用；
 * 3. 对外提供 run / preview / next / stop / update / export / import 等 API；
 * 4. 给后续可视化编辑器预留：链注册表、事件订阅、状态快照、热更新、单步跳转。
 *
 * 本模块由 init.js 的 helper 阶段动态加载；加载即注册到 window.whichWay，
 * 开发者模式下额外暴露 window.whichWayHelper 与 window.whichWayHelperDemo。
 */

import { createApp, reactive, type App } from "vue";
import { whichWayFile } from "../file.js";
import { onSetDev } from "../hooks/index.js";
import GuideOverlay from "./GuideOverlay.vue";
import {
	cloneHelperChain,
	HelperTaskChain,
	HelperValidationError,
	normalizeChainInput,
	toSerializableChain,
	toSerializableStep,
	validateChain,
} from "./chain.js";
import { createHelperDemoChain } from "./demo.js";
import {
	DEFAULT_HELPER_ASSET_PATHS,
	DEFAULT_HELPER_PORTRAIT,
	resolveHelperStyle,
	type HelperAbortPayload,
	type HelperAssets,
	type HelperChain,
	type HelperChainInput,
	type HelperEventMap,
	type HelperEventName,
	type HelperFinishPayload,
	type HelperFinishReason,
	type HelperPoint,
	type HelperReadyPayload,
	type HelperRect,
	type HelperRunOptions,
	type HelperStateSnapshot,
	type HelperStep,
	type HelperStepEventPayload,
	type HelperViewState,
} from "./types.js";

/** 默认静态资源：按扩展路径 scheme 解析成真实 URL */
const helperAssets: HelperAssets = {
	defaultPortrait: whichWayFile.compilePath(DEFAULT_HELPER_PORTRAIT),
	dialogTexture: whichWayFile.compilePath(DEFAULT_HELPER_ASSET_PATHS.dialogTexture),
	portraitFrame: whichWayFile.compilePath(DEFAULT_HELPER_ASSET_PATHS.portraitFrame),
	portraitBacking: whichWayFile.compilePath(DEFAULT_HELPER_ASSET_PATHS.portraitBacking),
};

/** 渲染层共享状态（只由管理器写入） */
const viewState = reactive<HelperViewState>({
	visible: false,
	preview: false,
	step: null,
	index: 0,
	total: 0,
	style: resolveHelperStyle(),
	assets: helperAssets,
	escapable: true,
});

/**
 * 新手帮助管理器。
 *
 * @example 运行一条链
 * whichWayHelper.run({
 *   steps: [
 *     { text: "欢迎！点击任意位置继续。", position: "center" },
 *     { text: "点击这里打开菜单。", highlight: { selector: "#menu" }, advanceOn: "highlight" },
 *   ],
 * });
 *
 * @example 编辑器预览
 * whichWayHelper.preview({ text: "预览文本", highlight: { rect: { x: 80, y: 80, width: 320, height: 120 } } });
 * whichWayHelper.updateCurrent({ text: "实时改文本" });
 * whichWayHelper.stop();
 */
export class WhichWayHelper {
	#app: App | null = null;
	#host: HTMLElement | null = null;
	#runner: HelperTaskChain | null = null;
	#options: HelperRunOptions | null = null;
	#chain: HelperChain | null = null;
	#active = false;
	#advanceLock = false;
	#lockTimer: number | null = null;
	#hideTimer: number | null = null;
	#lastRect: HelperRect | null = null;
	#lastPosition: HelperPoint | null = null;
	#listeners = new Map<HelperEventName, Set<(payload: any) => void>>();
	#chains = new Map<string, HelperChain>();

	/** 当前是否正在运行任务链 */
	get isActive(): boolean {
		return this.#active;
	}

	/** 当前是否可见（预览停在最后一步、closeOnFinish=false 时 active 为 false 但 visible 仍为 true） */
	get isVisible(): boolean {
		return viewState.visible;
	}

	/** 当前任务链状态机（供高级调用 / 测试使用；编辑器可改用 below 的封装 API） */
	get taskChain(): HelperTaskChain | null {
		return this.#runner;
	}

	/** 当前步骤（序列化清洗后的副本） */
	get currentStep(): HelperStep | null {
		const step = this.#runner?.currentStep ?? viewState.step;
		return toSerializableStep(step, this.#runner?.index ?? viewState.index).step;
	}

	/**
	 * 启动任务链。
	 *
	 * @param input 链对象、步骤数组，或已注册的链 id
	 * @param options 运行选项（起始步、样式覆盖、预览、事件回调）
	 * @throws {HelperValidationError} 链结构非法
	 */
	run(input: HelperChainInput, options: HelperRunOptions = {}): this {
		let source: HelperChain | HelperStep[] | HelperStep;
		if (typeof input === "string") {
			const registered = this.#chains.get(input);
			if (!registered) throw new Error("[WhichWayHelper] 未注册的提示链：" + input);
			source = registered;
		} else {
			source = input;
		}

		const chain = normalizeChainInput(source);
		const errors = validateChain(chain);
		if (errors.length) throw new HelperValidationError(errors);
		if (this.#active && options.replace === false) {
			throw new Error("[WhichWayHelper] 已有新手帮助正在运行；如需替换请传 replace: true");
		}
		if (this.#active) this.stop("replaced");

		this.#ensureMounted();
		this.#clearHideTimer();
		this.#chain = chain;
		this.#options = options;
		this.#active = true;
		this.#advanceLock = false;
		this.#clearLockTimer();
		this.#lastRect = null;
		this.#lastPosition = null;

		viewState.preview = options.preview === true;
		viewState.visible = true;
		viewState.step = null;
		viewState.index = 0;
		viewState.total = chain.steps.length;
		viewState.style = resolveHelperStyle(chain.style, options.style);
		viewState.escapable = chain.escapable ?? true;

		const runner = new HelperTaskChain({
			onStart: (startedChain, preview) => {
				this.#emit("start", { chain: startedChain, preview });
			},
			onStep: (step, index, total) => {
				this.#handleStep(step, index, total);
			},
			onAdvance: (from, to, step, total) => {
				this.#emit("advance", { from, to, step, total });
			},
			onFinish: payload => {
				this.#handleFinish(payload);
			},
			onAbort: payload => {
				this.#handleAbort(payload);
			},
			onUpdate: (step, index, total) => {
				this.#handleUpdate(step, index, total);
			},
			onPreviewEnd: (step, index, total) => {
				this.#handlePreviewEnd(step, index, total);
			},
		});
		this.#runner = runner;
		runner.start(chain, { startIndex: options.startIndex, preview: options.preview });
		return this;
	}

	/**
	 * 编辑器预览：与 run 相同，但最后一步被点击时不自动关闭，只发 preview-end。
	 * 预览期间可以用 updateCurrent / setStep 热更新，用 stop() 关闭。
	 */
	preview(input: HelperChainInput, options: HelperRunOptions = {}): this {
		return this.run(input, { ...options, preview: true, replace: true });
	}

	/** 程序化进入下一步（不受点击锁影响，但会受任务链 150ms 防连点限制） */
	next(): boolean {
		return this.#runner?.next(true) ?? false;
	}

	/** 跳到指定步骤（编辑器单步调试） */
	goto(index: number): boolean {
		return this.#runner?.goto(index) ?? false;
	}

	/** 中止当前帮助；reason 会透传给 abort 事件 */
	stop(reason = "api"): this {
		if (this.#runner?.active) {
			this.#runner.abort(reason);
		} else {
			this.#active = false;
			this.#options = null;
			if (viewState.visible) this.#hide();
		}
		return this;
	}

	/** 直接结束当前帮助（会触发 finish 事件） */
	finish(reason: HelperFinishReason = "api"): this {
		if (this.#runner?.active) {
			this.#runner.finish(reason);
		} else if (viewState.visible) {
			this.#hide();
		}
		return this;
	}

	/**
	 * 热更新当前步骤（只合并传入字段）。
	 *
	 * 编辑器拖拽提示框时可直接传 { position: { x, y } }；改文案传 { text }。
	 * 校验失败会抛错，不会写入坏数据。
	 */
	updateCurrent(patch: Partial<HelperStep>): HelperStep | null {
		return this.#runner?.updateCurrent(patch) ?? null;
	}

	/** 整体替换当前步骤 */
	replaceCurrent(step: HelperStep): HelperStep | null {
		const result = this.#runner?.replaceCurrent(step) ?? null;
		this.#syncChainFromRunner();
		return result;
	}

	/** 替换指定步骤（编辑非当前步骤用） */
	setStep(index: number, step: HelperStep): HelperStep | null {
		const result = this.#runner?.setStep(index, step) ?? null;
		this.#syncChainFromRunner();
		return result;
	}

	/** 替换全部步骤（编辑器重建链用） */
	setSteps(steps: HelperStep[]): void {
		this.#runner?.setSteps(steps);
		this.#syncChainFromRunner();
	}

	/** 当前链（序列化清洗后的副本） */
	export(): HelperChain | null {
		const { chain, warnings } = toSerializableChain(this.#chain ?? this.#runner?.chain ?? null);
		if (warnings.length) console.warn("[WhichWayHelper] 导出提示链时丢弃了以下内容：\n" + warnings.join("\n"));
		return chain;
	}

	/** 导出并保留 warnings（编辑器需要提示用户哪些字段无法序列化） */
	serialize(): { chain: HelperChain | null; warnings: string[] } {
		return toSerializableChain(this.#chain ?? this.#runner?.chain ?? null);
	}

	/**
	 * 导入 / 规范化一条链（只校验与克隆，不会运行）。
	 * 编辑器可以先用它校验用户导入的 JSON，再交给 run()。
	 */
	importChain(input: HelperChain | HelperStep[] | HelperStep): HelperChain {
		const chain = normalizeChainInput(input);
		const errors = validateChain(chain);
		if (errors.length) throw new HelperValidationError(errors);
		return cloneHelperChain(chain);
	}

	/** 注册一条可被 run(id) 引用的提示链（必须有唯一 id） */
	registerChain(input: HelperChain): string {
		const errors = validateChain(input);
		if (errors.length) throw new HelperValidationError(errors);
		if (!input.id) throw new Error("[WhichWayHelper] registerChain 需要链 id");
		this.#chains.set(input.id, cloneHelperChain(input));
		return input.id;
	}

	/** 注销已注册的链 */
	unregisterChain(id: string): boolean {
		return this.#chains.delete(id);
	}

	/** 取已注册的链（克隆副本） */
	getChain(id: string): HelperChain | null {
		const chain = this.#chains.get(id);
		return chain ? cloneHelperChain(chain) : null;
	}

	/** 列出已注册的链（供编辑器列表使用） */
	listChains(): Array<{ id: string; name?: string; steps: number }> {
		return Array.from(this.#chains.values()).map(chain => ({ id: chain.id ?? "", name: chain.name, steps: chain.steps.length }));
	}

	/** 当前状态快照（编辑器同步 UI 用；关闭后 step / rect / position 归空） */
	getState(): HelperStateSnapshot {
		const visible = viewState.visible;
		const step = visible ? this.#runner?.currentStep ?? viewState.step : null;
		const index = visible ? this.#runner?.index ?? viewState.index : 0;
		return {
			active: this.#active,
			visible,
			preview: viewState.preview,
			chainId: this.#chain?.id,
			index,
			total: visible ? viewState.total : 0,
			step: toSerializableStep(step, index).step,
			rect: visible && this.#lastRect ? { ...this.#lastRect } : null,
			position: visible && this.#lastPosition ? { ...this.#lastPosition } : null,
		};
	}

	/**
	 * 订阅事件。
	 * @returns 取消订阅函数
	 */
	on<K extends HelperEventName>(event: K, handler: (payload: HelperEventMap[K]) => void): () => void {
		let handlers = this.#listeners.get(event);
		if (!handlers) {
			handlers = new Set();
			this.#listeners.set(event, handlers);
		}
		handlers.add(handler as (payload: any) => void);
		return () => this.off(event, handler);
	}

	/** 取消订阅 */
	off<K extends HelperEventName>(event: K, handler: (payload: HelperEventMap[K]) => void): void {
		this.#listeners.get(event)?.delete(handler as (payload: any) => void);
	}

	/** 运行内置演示链（开发者模式入口；正式环境也可手动调用） */
	runDemo(): this {
		return this.run(createHelperDemoChain(), { replace: true });
	}

	/** 卸载 Vue 应用、清空注册表（扩展卸载 / 测试用） */
	destroy(): void {
		this.stop("destroy");
		this.#clearHideTimer();
		this.#clearLockTimer();
		try {
			this.#app?.unmount();
		} catch (error) {
			console.warn("[WhichWayHelper] 卸载 Vue 应用失败", error);
		}
		this.#app = null;
		this.#host?.remove();
		this.#host = null;
		this.#runner = null;
		this.#options = null;
		this.#chain = null;
		this.#active = false;
		this.#listeners.clear();
		this.#chains.clear();
	}

	/** 首次运行时挂载常驻 Vue 应用 */
	#ensureMounted(): void {
		if (this.#app) return;
		const host = document.createElement("div");
		host.className = "wwh-host";
		host.style.cssText = "position:static;display:contents;";
		// 挂在 html 上而不是 body：引擎会按布局给 body 加 transform: scale(...)，
		// fixed 覆盖层若在 body 内会被一起缩放，遮罩只能盖住一部分视口。
		(document.documentElement || document.body).appendChild(host);
		this.#host = host;
		this.#app = createApp(GuideOverlay, {
			state: viewState,
			advance: () => this.#handleOverlayAdvance(),
			abort: (reason: string) => this.stop(reason),
			notifyReady: (payload: HelperReadyPayload) => this.#handleReady(payload),
			notifyLayout: (payload: HelperReadyPayload) => this.#handleLayout(payload),
			resolveImage: (src: string) => whichWayFile.compilePath(src),
		});
		this.#app.mount(host);
	}

	/** 点击 / 遮罩推进（带锁，防止一次点击跳两步） */
	#handleOverlayAdvance(): void {
		if (!this.#active || this.#advanceLock) return;
		this.#advanceLock = true;
		this.#clearLockTimer();
		this.#lockTimer = window.setTimeout(() => {
			this.#lockTimer = null;
			this.#advanceLock = false;
		}, 1200);
		const moved = this.#runner?.next() ?? false;
		if (!moved) {
			this.#advanceLock = false;
			this.#clearLockTimer();
		}
	}

	/** 步骤切换 */
	#handleStep(step: HelperStep, index: number, total: number): void {
		const options = this.#options;
		this.#lastRect = null;
		this.#lastPosition = null;
		viewState.step = step;
		viewState.index = index;
		viewState.total = total;
		viewState.style = resolveHelperStyle(this.#chain?.style, this.#options?.style, step.style);
		viewState.escapable = this.#chain?.escapable ?? true;
		viewState.visible = true;
		this.#clearHideTimer();
		const payload: HelperStepEventPayload = { step, index, total };
		this.#emit("step", payload);
		options?.onStep?.(step, index, total);
	}

	/** 布局完成 */
	#handleReady(payload: HelperReadyPayload): void {
		const options = this.#options;
		this.#lastRect = payload.rect ? { ...payload.rect } : null;
		this.#lastPosition = { ...payload.position };
		this.#advanceLock = false;
		this.#clearLockTimer();
		this.#emit("ready", payload);
		options?.onReady?.(payload);
	}

	/** 滚动 / 缩放导致的重新布局 */
	#handleLayout(payload: HelperReadyPayload): void {
		const options = this.#options;
		this.#lastRect = payload.rect ? { ...payload.rect } : null;
		this.#lastPosition = { ...payload.position };
		this.#emit("layout", payload);
		options?.onLayout?.(payload);
	}

	/** 热更新 */
	#handleUpdate(step: HelperStep, index: number, total: number): void {
		viewState.step = step;
		viewState.index = index;
		viewState.total = total;
		viewState.style = resolveHelperStyle(this.#chain?.style, this.#options?.style, step.style);
		this.#syncChainFromRunner();
		this.#emit("update", { step, index, total });
	}

	/** 结束 */
	#handleFinish(payload: HelperFinishPayload): void {
		const runner = this.#runner;
		const chain = this.#chain;
		const options = this.#options;
		this.#active = false;
		this.#advanceLock = false;
		this.#clearLockTimer();
		this.#emit("finish", payload);
		options?.onFinish?.(payload);
		// 回调里可能立刻启动下一条引导：只有当前 runner 仍是本条链时才收尾
		const preview = runner?.preview === true;
		const close = !preview && (chain?.closeOnFinish ?? true);
		if (close && this.#runner === runner) this.#hide();
		if (this.#options === options) this.#options = null;
	}

	/** 中止 */
	#handleAbort(payload: HelperAbortPayload): void {
		const runner = this.#runner;
		const options = this.#options;
		this.#active = false;
		this.#advanceLock = false;
		this.#clearLockTimer();
		this.#emit("abort", payload);
		options?.onAbort?.(payload);
		// 同上：abort 回调里启动的新引导不能被旧的 hide 误伤
		if (this.#runner === runner) this.#hide();
		if (this.#options === options) this.#options = null;
	}

	/** 预览模式最后一步被点击 */
	#handlePreviewEnd(step: HelperStep, index: number, total: number): void {
		const options = this.#options;
		this.#advanceLock = false;
		this.#clearLockTimer();
		const payload: HelperStepEventPayload = { step, index, total };
		this.#emit("preview-end", payload);
		options?.onPreviewEnd?.(payload);
	}

	/** 隐藏覆盖层（延迟清空 step，让组件有机会做退出前的收尾） */
	#hide(): void {
		viewState.visible = false;
		this.#clearHideTimer();
		this.#hideTimer = window.setTimeout(() => {
			this.#hideTimer = null;
			if (!viewState.visible) {
				viewState.step = null;
				viewState.index = 0;
				viewState.total = 0;
			}
		}, 260);
	}

	#clearHideTimer(): void {
		if (this.#hideTimer !== null) window.clearTimeout(this.#hideTimer);
		this.#hideTimer = null;
	}

	#clearLockTimer(): void {
		if (this.#lockTimer !== null) window.clearTimeout(this.#lockTimer);
		this.#lockTimer = null;
	}

	/** 编辑 API 改了 runner 内部步骤后，同步管理器的导出副本 */
	#syncChainFromRunner(): void {
		if (this.#runner?.chain) this.#chain = this.#runner.chain;
	}

	#emit<K extends HelperEventName>(event: K, payload: HelperEventMap[K]): void {
		const handlers = this.#listeners.get(event);
		if (!handlers) return;
		for (const handler of Array.from(handlers)) {
			try {
				(handler as (data: HelperEventMap[K]) => void)(payload);
			} catch (error) {
				console.error("[WhichWayHelper] 事件监听器抛错：" + event, error);
			}
		}
	}
}

/** 单例 */
export const whichWayHelper = new WhichWayHelper();

/** 注册到扩展组件管理器 */
window.whichWay.register("helper", whichWayHelper);

/** 开发者模式：暴露调试入口与演示方法 */
onSetDev({
	name: "whichWayHelper_dev",
	fn: () => {
		(window as any).whichWayHelper = whichWayHelper;
		(window as any).whichWayHelperDemo = () => whichWayHelper.runDemo();
		console.log("[WhichWayHelper] 新手帮助已就绪。控制台运行 window.whichWayHelperDemo() 可查看演示；API 说明见 src/helper/README.md");
	},
});

export default whichWayHelper;
