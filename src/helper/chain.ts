/**
 * helper/chain.ts —— 新手帮助的任务链状态机
 *
 * 与 DOM / Vue 解耦：只维护「当前第几步、下一步是谁、何时结束」，通过回调通知渲染层。
 * 这样同一套链逻辑既能给运行时用，也能给后续可视化编辑器做预览 / 单步调试。
 *
 * 序列化约定：
 * - `highlight` 为 Element / 函数、`position` 为函数时无法 JSON 序列化，导出会丢弃并给出 warning；
 * - 编辑器请优先使用 `{ selector }`、`{ rect }` 与对象形式的位置。
 */

import {
	isDomRect,
	isElement,
	isRectLike,
	normalizeRect,
} from "./layout.js";
import type {
	HelperAbortPayload,
	HelperChain,
	HelperFinishPayload,
	HelperFinishReason,
	HelperHighlight,
	HelperHighlightOptions,
	HelperPosition,
	HelperPositionOptions,
	HelperPositionPreset,
	HelperRect,
	HelperRectLike,
	HelperStep,
	HelperStepEventPayload,
} from "./types.js";

/** 位置预设白名单 */
const POSITION_PRESETS = new Set<string>(["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"]);

/** 方位白名单 */
const PLACEMENTS = new Set<string>(["auto", "top", "bottom", "left", "right"]);

/** 对齐白名单 */
const ALIGNS = new Set<string>(["start", "center", "end"]);

/** 校验失败错误 */
export class HelperValidationError extends Error {
	readonly errors: string[];

	constructor(errors: string[]) {
		super(`[WhichWayHelper] 提示链校验失败：\n${errors.map(error => `  - ${error}`).join("\n")}`);
		this.name = "HelperValidationError";
		this.errors = errors;
	}
}

/** 任务链回调 */
export interface HelperTaskChainCallbacks {
	onStart?: (chain: HelperChain, preview: boolean) => void;
	onStep?: (step: HelperStep, index: number, total: number) => void;
	onAdvance?: (from: number, to: number | null, step: HelperStep, total: number) => void;
	onFinish?: (payload: HelperFinishPayload) => void;
	onAbort?: (payload: HelperAbortPayload) => void;
	onUpdate?: (step: HelperStep, index: number, total: number) => void;
	onPreviewEnd?: (step: HelperStep, index: number, total: number) => void;
}

/** 判断是否为普通对象（排除元素 / DOMRect） */
function isPlainRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !isElement(value) && !isDomRect(value);
}

/** 克隆高亮配置（保留元素 / 函数引用，普通对象做浅拷贝） */
export function cloneHelperHighlight(highlight: HelperHighlight | undefined): HelperHighlight | undefined {
	if (highlight === undefined || highlight === null) return undefined;
	if (typeof highlight === "string" || typeof highlight === "function" || isElement(highlight)) return highlight;
	if (isDomRect(highlight) || isRectLike(highlight)) return normalizeRect(highlight);
	if (isPlainRecord(highlight)) {
		const clone: Record<string, unknown> = { ...highlight };
		if (clone.rect && (isDomRect(clone.rect) || isRectLike(clone.rect))) clone.rect = normalizeRect(clone.rect as HelperRectLike | DOMRect);
		return clone as unknown as HelperHighlight;
	}
	return highlight;
}

/** 克隆单步（不深拷贝 data，避免破坏自定义对象） */
export function cloneHelperStep(step: HelperStep): HelperStep {
	const clone: HelperStep = { ...step };
	if (step.portrait && typeof step.portrait === "object") clone.portrait = { ...step.portrait };
	if (step.style) clone.style = { ...step.style };
	if (step.data) clone.data = { ...step.data };
	if (step.highlight) clone.highlight = cloneHelperHighlight(step.highlight);
	if (step.position && typeof step.position === "object") clone.position = { ...(step.position as HelperPositionOptions) };
	return clone;
}

/** 克隆整条链 */
export function cloneHelperChain(chain: HelperChain): HelperChain {
	const clone: HelperChain = { ...chain, steps: chain.steps.map(cloneHelperStep) };
	if (chain.style) clone.style = { ...chain.style };
	return clone;
}

/** 把数组 / 单步写法归一成链对象 */
export function normalizeChainInput(input: HelperChain | HelperStep[] | HelperStep): HelperChain {
	if (Array.isArray(input)) return { steps: input };
	if (!input || typeof input !== "object") {
		throw new TypeError("[WhichWayHelper] 提示链必须是 HelperChain、HelperStep[] 或 HelperStep");
	}
	if (Array.isArray((input as HelperChain).steps)) return input as HelperChain;
	if (typeof (input as HelperStep).text === "string") return { steps: [input as HelperStep] };
	throw new TypeError("[WhichWayHelper] 提示链必须是 HelperChain、HelperStep[] 或 HelperStep");
}

/** 校验高亮配置 */
function validateHighlight(highlight: unknown, errors: string[], label: string): void {
	if (highlight === undefined || highlight === null) return;
	if (typeof highlight === "string") {
		if (!highlight.trim()) errors.push(`${label}：selector 不能为空`);
		return;
	}
	if (typeof highlight === "function" || isElement(highlight)) return;
	if (isDomRect(highlight) || isRectLike(highlight)) {
		const rect = normalizeRect(highlight);
		if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height)) errors.push(`${label}：矩形 width / height 必须是有限数字`);
		return;
	}
	if (!isPlainRecord(highlight)) {
		errors.push(`${label}：无法识别的 highlight 配置`);
		return;
	}

	const options = highlight as HelperHighlightOptions;
	if (options.padding !== undefined && (!Number.isFinite(options.padding) || options.padding < 0)) errors.push(`${label}：padding 必须是非负数字`);
	if (options.radius !== undefined && (!Number.isFinite(options.radius) || options.radius < 0)) errors.push(`${label}：radius 必须是非负数字`);
	if (options.follow !== undefined && typeof options.follow !== "boolean") errors.push(`${label}：follow 必须是布尔值`);

	if (typeof highlight.selector === "string") {
		if (!highlight.selector.trim()) errors.push(`${label}：selector 不能为空`);
		return;
	}
	if (isElement(highlight.element)) return;
	if (highlight.rect && (isDomRect(highlight.rect) || isRectLike(highlight.rect))) {
		const rect = normalizeRect(highlight.rect as HelperRectLike | DOMRect);
		if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height)) errors.push(`${label}：矩形 width / height 必须是有限数字`);
		return;
	}
	errors.push(`${label}：必须提供 selector / element / rect 之一`);
}

/** 校验位置配置 */
function validatePosition(position: unknown, errors: string[], label: string): void {
	if (position === undefined || position === null) return;
	if (typeof position === "string") {
		if (!POSITION_PRESETS.has(position)) {
			errors.push(`${label}：未知的位置预设 "${position}"`);
		}
		return;
	}
	if (typeof position === "function") return;
	if (!isPlainRecord(position)) {
		errors.push(`${label}：position 必须是预设字符串、对象或函数`);
		return;
	}

	const options = position as HelperPositionOptions;
	const hasX = options.x !== undefined;
	const hasY = options.y !== undefined;
	if (hasX !== hasY) errors.push(`${label}：x 与 y 必须同时提供`);
	if (hasX && (typeof options.x !== "number" || !Number.isFinite(options.x))) errors.push(`${label}：x 必须是有限数字`);
	if (hasY && (typeof options.y !== "number" || !Number.isFinite(options.y))) errors.push(`${label}：y 必须是有限数字`);
	if (options.anchor !== undefined && !POSITION_PRESETS.has(options.anchor)) errors.push(`${label}：未知的 anchor "${options.anchor}"`);
	if (options.placement !== undefined && !PLACEMENTS.has(options.placement)) errors.push(`${label}：未知的 placement "${options.placement}"`);
	if (options.align !== undefined && !ALIGNS.has(options.align)) errors.push(`${label}：未知的 align "${options.align}"`);
	if (options.gap !== undefined && (typeof options.gap !== "number" || !Number.isFinite(options.gap))) errors.push(`${label}：gap 必须是有限数字`);
	if (options.offsetX !== undefined && (typeof options.offsetX !== "number" || !Number.isFinite(options.offsetX))) errors.push(`${label}：offsetX 必须是有限数字`);
	if (options.offsetY !== undefined && (typeof options.offsetY !== "number" || !Number.isFinite(options.offsetY))) errors.push(`${label}：offsetY 必须是有限数字`);
	if (options.clamp !== undefined && typeof options.clamp !== "boolean") errors.push(`${label}：clamp 必须是布尔值`);
}

/** 校验单步 */
export function validateHelperStep(step: HelperStep, index: number): string[] {
	const errors: string[] = [];
	const label = `第 ${index + 1} 步`;
	if (!step || typeof step !== "object") {
		errors.push(`${label}：步骤必须是对象`);
		return errors;
	}
	if (typeof step.text !== "string") errors.push(`${label}：text 必须是字符串`);
	if (step.id !== undefined && typeof step.id !== "string") errors.push(`${label}：id 必须是字符串`);
	if (step.title !== undefined && typeof step.title !== "string") errors.push(`${label}：title 必须是字符串`);
	if (step.advanceOn !== undefined && step.advanceOn !== "any" && step.advanceOn !== "highlight") {
		errors.push(`${label}：advanceOn 只能是 "any" 或 "highlight"`);
	}
	if (step.advanceOn === "highlight" && (step.highlight === undefined || step.highlight === null)) {
		errors.push(`${label}：advanceOn 为 "highlight" 时必须提供 highlight`);
	}
	if (step.waitFor !== undefined && (typeof step.waitFor !== "number" || !Number.isFinite(step.waitFor) || step.waitFor < 0)) {
		errors.push(`${label}：waitFor 必须是非负数字`);
	}
	if (step.portrait !== undefined && typeof step.portrait !== "string" && !isPlainRecord(step.portrait)) {
		errors.push(`${label}：portrait 必须是字符串或 { src, alt, fit } 对象`);
	}
	if (step.portrait && typeof step.portrait === "object") {
		if (step.portrait.fit !== undefined && step.portrait.fit !== "cover" && step.portrait.fit !== "contain") {
			errors.push(`${label}：portrait.fit 只能是 "cover" 或 "contain"`);
		}
	}
	validateHighlight(step.highlight, errors, `${label}：highlight`);
	validatePosition(step.position, errors, `${label}：position`);
	return errors;
}

/** 校验整条链 */
export function validateChain(chain: HelperChain): string[] {
	const errors: string[] = [];
	if (!chain || typeof chain !== "object") return ["提示链必须是对象"];
	if (!Array.isArray(chain.steps) || chain.steps.length === 0) {
		errors.push("steps 不能为空");
		return errors;
	}
	if (chain.id !== undefined && typeof chain.id !== "string") errors.push("id 必须是字符串");
	if (chain.name !== undefined && typeof chain.name !== "string") errors.push("name 必须是字符串");
	if (chain.closeOnFinish !== undefined && typeof chain.closeOnFinish !== "boolean") errors.push("closeOnFinish 必须是布尔值");
	if (chain.escapable !== undefined && typeof chain.escapable !== "boolean") errors.push("escapable 必须是布尔值");

	const ids = new Set<string>();
	chain.steps.forEach((step, index) => {
		errors.push(...validateHelperStep(step, index));
		if (step && typeof step.id === "string" && step.id) {
			if (ids.has(step.id)) errors.push(`第 ${index + 1} 步：id "${step.id}" 重复`);
			ids.add(step.id);
		}
	});
	return errors;
}

/** 校验并抛错 */
export function assertValidChain(chain: HelperChain): void {
	const errors = validateChain(chain);
	if (errors.length) throw new HelperValidationError(errors);
}

/** 把元素尽量转成选择器；没有 id 时返回 null */
function elementToSelector(element: Element): string | null {
	const id = element.id;
	if (!id) return null;
	try {
		if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return `#${CSS.escape(id)}`;
	} catch {
		/* 忽略：退回手写转义 */
	}
	if (/^[A-Za-z][\w-]*$/.test(id)) return `#${id}`;
	return null;
}

/** 递归 JSON 化，丢弃函数 / 元素 / 循环引用 */
function toJsonSafe(value: unknown, warnings: string[], path: string, seen: WeakSet<object>): unknown {
	if (value === null) return null;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
	if (typeof value === "function") {
		warnings.push(`${path} 是函数，导出时已丢弃`);
		return undefined;
	}
	if (isElement(value)) {
		warnings.push(`${path} 是 DOM 元素，导出时已丢弃`);
		return undefined;
	}
	if (typeof value !== "object") return undefined;
	if (isDomRect(value) || isRectLike(value)) return normalizeRect(value as HelperRectLike | DOMRect);
	if (seen.has(value)) {
		warnings.push(`${path} 存在循环引用，导出时已丢弃`);
		return undefined;
	}
	seen.add(value);
	if (Array.isArray(value)) {
		const list: unknown[] = [];
		value.forEach((item, index) => {
			const converted = toJsonSafe(item, warnings, `${path}[${index}]`, seen);
			if (converted !== undefined) list.push(converted);
		});
		return list;
	}
	const result: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
		const converted = toJsonSafe(item, warnings, `${path}.${key}`, seen);
		if (converted !== undefined) result[key] = converted;
	}
	return result;
}

/** 序列化单步（用于编辑器保存 / getState） */
export function toSerializableStep(step: HelperStep | null, index = 0): { step: HelperStep | null; warnings: string[] } {
	if (!step) return { step: null, warnings: [] };
	const warnings: string[] = [];
	const clone = cloneHelperStep(step);

	if (typeof step.highlight === "function") {
		clone.highlight = undefined;
		warnings.push(`第 ${index + 1} 步的 highlight 是函数，导出时已丢弃`);
	} else if (isElement(step.highlight)) {
		const selector = elementToSelector(step.highlight);
		if (selector) clone.highlight = { selector };
		else {
			clone.highlight = undefined;
			warnings.push(`第 ${index + 1} 步的 highlight 是元素但没有 id，导出时已丢弃`);
		}
	} else if (step.highlight && isPlainRecord(step.highlight) && isElement(step.highlight.element)) {
		const selector = elementToSelector(step.highlight.element);
		if (selector) {
			const options = step.highlight as HelperHighlightOptions;
			clone.highlight = { ...options, selector, element: undefined } as unknown as HelperHighlight;
		} else {
			clone.highlight = undefined;
			warnings.push(`第 ${index + 1} 步的 highlight 是元素但没有 id，导出时已丢弃`);
		}
	}

	if (typeof step.position === "function") {
		clone.position = undefined;
		warnings.push(`第 ${index + 1} 步的 position 是函数，导出时已丢弃`);
	}

	if (step.data) {
		const converted = toJsonSafe(step.data, warnings, `第 ${index + 1} 步的 data`, new WeakSet());
		if (converted === undefined) clone.data = undefined;
		else clone.data = converted as Record<string, unknown>;
	}

	return { step: clone, warnings };
}

/** 序列化整条链 */
export function toSerializableChain(chain: HelperChain | null): { chain: HelperChain | null; warnings: string[] } {
	if (!chain) return { chain: null, warnings: [] };
	const warnings: string[] = [];
	const steps: HelperStep[] = [];
	chain.steps.forEach((step, index) => {
		const converted = toSerializableStep(step, index);
		if (converted.step) steps.push(converted.step);
		warnings.push(...converted.warnings);
	});
	const serializable: HelperChain = {
		id: chain.id,
		name: chain.name,
		steps,
		style: chain.style ? { ...chain.style } : undefined,
		closeOnFinish: chain.closeOnFinish,
		escapable: chain.escapable,
	};
	return { chain: serializable, warnings };
}

/**
 * 任务链状态机。
 *
 * @example
 * const chain = new HelperTaskChain({
 *   onStep: (step, index, total) => console.log(index + 1, "/", total),
 *   onFinish: () => console.log("完成"),
 * });
 * chain.start({ steps: [{ text: "第一步" }, { text: "第二步" }] });
 * chain.next();
 */
export class HelperTaskChain {
	#chain: HelperChain | null = null;
	#steps: HelperStep[] = [];
	#index = 0;
	#active = false;
	#preview = false;
	#lastAdvanceAt = 0;
	#callbacks: HelperTaskChainCallbacks;

	constructor(callbacks: HelperTaskChainCallbacks = {}) {
		this.#callbacks = callbacks;
	}

	/** 当前链（克隆后的内部副本） */
	get chain(): HelperChain | null {
		return this.#chain ? cloneHelperChain(this.#chain) : null;
	}

	/** 所有步骤（克隆后的内部副本） */
	get steps(): HelperStep[] {
		return this.#steps.map(step => cloneHelperStep(step));
	}

	/** 当前步骤；结束后仍保留最后一步，便于外部读取 */
	get currentStep(): HelperStep | null {
		return this.#steps[this.#index] ?? null;
	}

	/** 当前下标 */
	get index(): number {
		return this.#index;
	}

	/** 总步数 */
	get total(): number {
		return this.#steps.length;
	}

	/** 是否正在运行 */
	get active(): boolean {
		return this.#active;
	}

	/** 是否预览模式 */
	get preview(): boolean {
		return this.#preview;
	}

	/**
	 * 启动任务链。
	 *
	 * @param chain 提示链
	 * @param options.startIndex 起始下标（越界会被夹到合法范围）
	 * @param options.preview 预览模式：最后一步不 finish，只发 preview-end
	 */
	start(chain: HelperChain, options: { startIndex?: number; preview?: boolean } = {}): this {
		assertValidChain(chain);
		this.#chain = cloneHelperChain(chain);
		this.#steps = this.#chain.steps;
		this.#preview = options.preview === true;
		const requested = Math.floor(options.startIndex ?? 0);
		this.#index = Number.isFinite(requested) ? Math.min(Math.max(0, requested), this.#steps.length - 1) : 0;
		this.#active = true;
		this.#lastAdvanceAt = 0;
		this.#callbacks.onStart?.(this.cloneChain(), this.#preview);
		this.emitStep();
		return this;
	}

	/** 内部用：克隆当前链 */
	private cloneChain(): HelperChain {
		return this.#chain ? cloneHelperChain(this.#chain) : { steps: [] };
	}

	/** 触发 onStep */
	private emitStep(): void {
		const step = this.currentStep;
		if (!step) return;
		this.#callbacks.onStep?.(step, this.#index, this.total);
	}

	/**
	 * 进入下一步。
	 *
	 * @param force 跳过 150ms 的防连点冷却（程序化调用可用）
	 * @returns 是否真的推进 / 触发了结束
	 */
	next(force = false): boolean {
		if (!this.#active) return false;
		const now = Date.now();
		if (!force && now - this.#lastAdvanceAt < 150) return false;
		this.#lastAdvanceAt = now;

		const from = this.#index;
		const current = this.currentStep;
		if (!current) return false;

		if (from + 1 >= this.#steps.length) {
			if (this.#preview) {
				this.#callbacks.onPreviewEnd?.(current, from, this.total);
				return true;
			}
			this.#callbacks.onAdvance?.(from, null, current, this.total);
			this.finish("complete");
			return true;
		}

		this.#index = from + 1;
		const step = this.currentStep;
		if (!step) return false;
		this.#callbacks.onAdvance?.(from, this.#index, step, this.total);
		this.emitStep();
		return true;
	}

	/**
	 * 跳到指定步骤（编辑器单步调试用）。
	 * @returns 下标非法或链未运行时返回 false
	 */
	goto(index: number): boolean {
		if (!this.#active) return false;
		const target = Math.floor(index);
		if (!Number.isFinite(target) || target < 0 || target >= this.#steps.length) return false;
		this.#index = target;
		this.#lastAdvanceAt = Date.now();
		this.emitStep();
		return true;
	}

	/** 结束（默认原因 complete） */
	finish(reason: HelperFinishReason = "complete"): void {
		if (!this.#active) return;
		const step = this.currentStep;
		const index = this.#index;
		const total = this.total;
		this.#active = false;
		if (!step) return;
		this.#callbacks.onFinish?.({ reason, step, index, total });
	}

	/** 中止（Esc / 外部 stop） */
	abort(reason = "abort"): void {
		if (!this.#active) return;
		const step = this.currentStep;
		const index = this.#index;
		const total = this.total;
		this.#active = false;
		this.#callbacks.onAbort?.({ reason, index, total, step });
	}

	/**
	 * 热更新当前步骤（只合并传入字段）。
	 *
	 * 校验失败会抛出 {@link HelperValidationError}，不会写入坏数据。
	 */
	updateCurrent(patch: Partial<HelperStep>): HelperStep | null {
		if (!this.#active) return null;
		const current = this.currentStep;
		if (!current) return null;
		const merged: HelperStep = { ...current, ...patch };
		if (patch.style) merged.style = { ...current.style, ...patch.style };
		const errors = validateHelperStep(merged, this.#index);
		if (errors.length) throw new HelperValidationError(errors);
		this.#steps[this.#index] = merged;
		this.#callbacks.onUpdate?.(merged, this.#index, this.total);
		return merged;
	}

	/** 整体替换当前步骤 */
	replaceCurrent(step: HelperStep): HelperStep {
		const errors = validateHelperStep(step, this.#index);
		if (errors.length) throw new HelperValidationError(errors);
		const clone = cloneHelperStep(step);
		this.#steps[this.#index] = clone;
		this.#callbacks.onUpdate?.(clone, this.#index, this.total);
		return clone;
	}

	/** 替换指定步骤（编辑非当前步骤用） */
	setStep(index: number, step: HelperStep): HelperStep {
		const target = Math.floor(index);
		if (!Number.isFinite(target) || target < 0 || target >= this.#steps.length) {
			throw new RangeError(`[WhichWayHelper] 步骤下标越界：${index}`);
		}
		const errors = validateHelperStep(step, target);
		if (errors.length) throw new HelperValidationError(errors);
		const clone = cloneHelperStep(step);
		this.#steps[target] = clone;
		if (target === this.#index) this.#callbacks.onUpdate?.(clone, target, this.total);
		return clone;
	}

	/** 替换全部步骤（编辑器重建链用） */
	setSteps(steps: HelperStep[]): void {
		const errors = validateChain({ ...(this.#chain ?? {}), steps });
		if (errors.length) throw new HelperValidationError(errors);
		this.#steps = steps.map(cloneHelperStep);
		if (this.#chain) this.#chain.steps = this.#steps;
		this.#index = Math.min(this.#index, this.#steps.length - 1);
		const step = this.currentStep;
		if (step) this.#callbacks.onUpdate?.(step, this.#index, this.total);
	}

	/** 导出当前链（序列化清洗后的副本） */
	export(): { chain: HelperChain | null; warnings: string[] } {
		return toSerializableChain(this.#chain);
	}
}
