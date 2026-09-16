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

	const handle: PromptHandle = {
		el,
		get items() {
			return state.prompts.map(prompt => ({ ...prompt }));
		},
		upsert(item) {
			const index = state.prompts.findIndex(current => current.id === item.id);
			if (index < 0) state.prompts.push({ ...item });
			else state.prompts.splice(index, 1, { ...item });
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
