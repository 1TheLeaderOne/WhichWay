import { createApp, reactive } from "vue";
import type { App } from "vue";
import PromptSJZX from "./promptSJZX.vue";

/**
 * 卡牌 / 角色提示条的创建与维护（基于 `promptSJZX.vue` 组件）。
 *
 * 用法（宿主元素通常是卡牌 / 角色节点本身，它们都是 HTMLDivElement）：
 * ```ts
 * const handle = addPromptTo(card, { id: "shenci", text: "可摸牌", type: "card" });
 * handle.upsert({ id: "shenci", text: "可摸牌（2）", type: "card" }); // 同 id 更新
 * handle.remove("shenci");                                            // 删单条
 * handle.remove();                                                    // 删全部（容器一并移除）
 * ```
 *
 * 约定：
 * - **同一个宿主元素只有一个容器**（`WeakMap` 缓存），多条提示在容器里依次排列 —— 与改造前的 DOM 结构一致；
 * - **卡牌提示默认「离手自动清除」**：卡牌离开手牌区（进弃牌堆 / 装备区 / 判定区 / 牌堆 / 特殊区…）后，
 *   该牌上所有 `type: "card"` 的提示会被自动清掉；需要让提示跟着牌走时传 `keepOnLeave: true`。
 *   判定口径与引擎 `get.position` 一致（父容器或移动目标带 `handcards` 类），并且只在**曾经在手牌区**
 *   的牌上触发 —— 刚生成、还没进过手牌的牌（如 `directgains` 前的副本）不会被误清；
 * - 容器里的条目删空后自动销毁（不会留下空的 `.promptSJZX-Wrapper` 影响布局）；
 * - 模块只依赖 vue，不 import 扩展内其它模块（避免与 `nonameEx` 形成循环依赖）。
 */

/** 提示条类型：`card` 黑底白字，`character` 黑底红字 */
export type PromptType = "card" | "character";

/** 一条提示 */
export interface PromptItem {
	/** 同一宿主元素内的唯一标识（相同 id 视为更新，而非新增） */
	id: string;
	/** 提示内容（按 HTML 渲染，与改造前 `innerHTML` 的行为一致） */
	text: string;
	/** 提示类型 */
	type: PromptType;
	/**
	 * 卡牌离开手牌区时是否保留这条提示（默认 `false`，即自动清除）。
	 * 只对 `type: "card"` 有意义；角色提示不受影响。
	 */
	keepOnLeave?: boolean;
}

/** 一个宿主元素上的提示容器句柄 */
export interface PromptHandle {
	/** 容器元素（`.promptSJZX-Wrapper`），已被插入宿主元素内部 */
	readonly el: HTMLElement;
	/** 当前所有提示（每次读取返回快照） */
	readonly items: PromptItem[];
	/** 新增或更新一条提示（id 相同则更新文本 / 类型） */
	upsert(item: PromptItem): void;
	/** 删除提示：不传 id 时删除全部；删空后容器会自动从宿主元素上移除 */
	remove(id?: string): void;
	/** 销毁整个容器（卸载组件并移除 DOM） */
	destroy(): void;
}

/** 宿主元素 → 句柄：同一个元素上的提示共用一个容器 */
const hosts = new WeakMap<HTMLElement, PromptHandle>();

/** 宿主元素 → 「离手复核」函数（只有卡牌提示会登记） */
const handGuards = new WeakMap<HTMLElement, () => void>();

/** 已登记宿主的弱引用（`WeakMap` 无法遍历，这里额外存一份以便统一复核；取不到即已回收） */
const handGuardRefs = new Set<WeakRef<HTMLElement>>();

/** 手牌容器的类名（引擎 `get.position` 判 "h" 的口径） */
const HAND_CLASS = "handcards";

/** 全局共享的手牌容器监听：牌进 / 出手牌都会在这些容器上产生变更 */
let handObserver: MutationObserver | null = null;
/** 复核定时器（同一批变更合并成一次复核） */
let handTimer: number | null = null;

/**
 * 卡牌是否在手牌区。
 *
 * 与引擎 `get.position` 保持一致：移动动画期间（`card.timeout` + `card.destiny`）以**目标容器**为准，
 * 其余时候看当前父容器；容器带 `handcards` 类就算在手牌区。
 * 这里刻意不直接调 `get.position()` —— 它对带 `glows` 类的手牌返回 "s"（特殊区），
 * 会把手牌上被高亮的牌误判成"已离手"。
 *
 * @param el 卡牌元素
 * @returns 是否在手牌区
 */
function isCardInHand(el: HTMLElement): boolean {
	//@ts-ignore 引擎在移动动画期间挂在牌上的内部字段
	const moving = el.timeout && el.destiny?.classList ? el.destiny : null;
	const container = (moving ?? el.parentNode) as HTMLElement | null;
	return !!container?.classList?.contains(HAND_CLASS);
}

/** 监听所有手牌容器（新玩家 / 新容器会在复核时补挂；重复 observe 同一节点是安全的） */
function observeHandContainers() {
	handObserver ??= new MutationObserver(scheduleHandVerify);
	for (const node of document.querySelectorAll<HTMLElement>(`.${HAND_CLASS}`)) {
		handObserver.observe(node, { childList: true });
	}
}

/**
 * 延迟一帧再复核：引擎整理手牌时会「先摘掉节点再放回」，立即判定会误清提示；
 * 合并同一批变更后统一复核所有登记的牌。
 */
function scheduleHandVerify() {
	if (handTimer != null) return;
	handTimer = window.setTimeout(() => {
		handTimer = null;
		observeHandContainers();
		for (const ref of Array.from(handGuardRefs)) {
			const host = ref.deref();
			if (!host) handGuardRefs.delete(ref);
			else handGuards.get(host)?.();
		}
	}, 0);
}

/**
 * 登记某个卡牌宿主的「离手复核」（已在登记则跳过）。
 * @param target 卡牌元素
 * @param verify 复核函数
 */
function registerHandGuard(target: HTMLElement, verify: () => void) {
	if (handGuards.has(target)) return;
	handGuards.set(target, verify);
	handGuardRefs.add(new WeakRef(target));
	observeHandContainers();
}

/**
 * 取（必要时创建）某个宿主元素的提示容器。
 * @param target 宿主元素（卡牌 / 角色节点）
 * @returns 容器句柄
 */
export function getPromptHandle(target: HTMLElement): PromptHandle {
	const exists = hosts.get(target);
	if (exists) return exists;

	const state = reactive<{ prompts: PromptItem[] }>({ prompts: [] });
	//组件挂载到游离节点上，再把根元素（`.promptSJZX-Wrapper`）挪进宿主元素，
	//这样 DOM 里不会多出一层无意义的容器
	const container = document.createElement("div");
	const app: App = createApp(PromptSJZX, state);
	app.mount(container);
	const el = container.firstElementChild as HTMLElement;
	target.appendChild(el);

	/** 上次复核时是否在手牌区；只有"曾经在手牌区"的牌才判离手（避免误清刚生成、还没进手牌的牌） */
	let wasInHand = isCardInHand(target);

	/** 是否还有需要「离手自动清除」的提示 */
	const hasAutoClearPrompt = () => state.prompts.some(prompt => prompt.type === "card" && !prompt.keepOnLeave);

	/** 离手复核：离开手牌区则清掉未声明保留的卡牌提示 */
	const verifyHandLeave = () => {
		if (!hasAutoClearPrompt()) return;
		const inHand = isCardInHand(target);
		if (wasInHand && !inHand) {
			state.prompts = state.prompts.filter(prompt => prompt.type !== "card" || prompt.keepOnLeave);
			if (!state.prompts.length) {
				handle.destroy();
				return;
			}
		}
		wasInHand = inHand;
	};

	const handle: PromptHandle = {
		el,
		get items() {
			return state.prompts.map(prompt => ({ ...prompt }));
		},
		upsert(item) {
			const index = state.prompts.findIndex(current => current.id === item.id);
			if (index < 0) state.prompts.push({ ...item });
			else state.prompts.splice(index, 1, { ...item });
			//卡牌提示：登记「离手自动清除」（登记时以当前是否在手牌区为基准）
			if (item.type === "card" && !item.keepOnLeave && !handGuards.has(target)) {
				wasInHand = isCardInHand(target);
				registerHandGuard(target, verifyHandLeave);
			}
		},
		remove(id) {
			if (id == null) state.prompts.length = 0;
			else {
				const index = state.prompts.findIndex(prompt => prompt.id === id);
				if (index >= 0) state.prompts.splice(index, 1);
			}
			//删空后连容器一起收掉，避免空容器影响宿主元素的布局
			if (!state.prompts.length) handle.destroy();
		},
		destroy() {
			hosts.delete(target);
			//注销离手复核（弱引用会在下次复核时自动清理，这里只摘掉映射）
			handGuards.delete(target);
			app.unmount();
			el.remove();
		},
	};
	hosts.set(target, handle);
	return handle;
}

/**
 * 新增 / 更新一条提示。
 * @param target 宿主元素
 * @param item 提示内容
 * @returns 该宿主元素的容器句柄
 */
export function addPromptTo(target: HTMLElement, item: PromptItem): PromptHandle {
	const handle = getPromptHandle(target);
	handle.upsert(item);
	return handle;
}

/**
 * 删除提示。
 * @param target 宿主元素
 * @param id 只删除该 id；不传则删除全部
 */
export function removePromptsFrom(target: HTMLElement, id?: string): void {
	hosts.get(target)?.remove(id);
}
