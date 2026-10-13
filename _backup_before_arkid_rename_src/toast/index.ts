import { onContent, onSetDev } from "../hooks/index.js";

type ToastPosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "bottomCenter";

interface ToastData {
	id: string | symbol;
	toast: HTMLDivElement;
	timeout: number | null;
}

const TOAST_POSITIONS: ToastPosition[] = ["topLeft", "topRight", "bottomLeft", "bottomRight", "bottomCenter"];

class ToastManager {
	toastRegistry: ToastRegistry;

	constructor() {
		this.toastRegistry = this._initRegistry();
	}

	private _initRegistry(): ToastRegistry {
		const registry = {
			topLeft: [] as ToastData[],
			topRight: [] as ToastData[],
			bottomLeft: [] as ToastData[],
			bottomRight: [] as ToastData[],
			bottomCenter: [] as ToastData[],
		} satisfies Record<ToastPosition, ToastData[]>;

		// 添加 get 方法
		(registry as ToastRegistry).get = (id: string | symbol): ToastData | null => {
			for (const pos of TOAST_POSITIONS) {
				const found = registry[pos].find(t => t.id === id);
				if (found) return found;
			}
			return null;
		};

		return registry as ToastRegistry;
	}

	/**
	 * 显示一个浮动提示（Toast）
	 *
	 * @param message - 提示内容
	 * @param duration - 显示时长（毫秒）或 true 表示永久
	 * @param position - 位置
	 * @param id - 唯一标识符（string 或 Symbol）
	 * @returns 关闭函数
	 */
	showToast(message: string, duration: number | boolean = 3000, position: ToastPosition = "bottomCenter", id?: string | symbol): () => void {
		const positionPresets: Record<ToastPosition, Partial<CSSStyleDeclaration>> = {
			topLeft: { top: "80px", left: "20px" },
			topRight: { top: "80px", right: "20px" },
			bottomLeft: { bottom: "20px", left: "20px" },
			bottomRight: { bottom: "20px", right: "20px" },
			bottomCenter: {
				bottom: "20px",
				left: "50%",
				transform: "translateX(-50%)",
			},
		};

		const validPosition = Object.hasOwn(positionPresets, position) ? position : ("bottomCenter" as const);

		const baseStyle = positionPresets[validPosition];

		const toastId = id ?? this._generateRandomId();

		// 警告：特定前缀 ID 的使用（仅对 string 类型）
		if (typeof toastId === "string" && toastId.startsWith("dragging_") && !message.includes("骨骼")) {
			console.warn(`${toastId} 以 dragging_ 开头，在关闭动皮拖拽时会被删除！`);
		}

		const existing = this.toastRegistry.get(toastId);
		if (existing) {
			existing.toast.innerHTML = message;
			if (existing.timeout !== null) {
				clearTimeout(existing.timeout);
			}

			let newTimeout: number | null = null;
			if (duration !== true) {
				newTimeout = window.setTimeout(() => {
					this._removeToast(validPosition, toastId, existing.toast);
				}, duration as number);
			}

			existing.timeout = newTimeout;

			return () => {
				if (existing.timeout !== null) {
					clearTimeout(existing.timeout);
				}
				this._removeToast(validPosition, toastId, existing.toast);
			};
		}

		// 创建新 toast
		const toast = document.createElement("div");
		toast.className = "toastSJZX";
		toast.id = `toastSJZX-${String(toastId)}`;
		toast.innerHTML = message;

		// 应用基础样式
		Object.assign(toast.style, baseStyle);
		toast.style.visibility = "visible";
		toast.style.opacity = "1";

		// 计算偏移
		const currentList = this.toastRegistry[validPosition];
		const spacing = 60;

		if (validPosition.startsWith("top")) {
			toast.style.top = `${80 + currentList.length * spacing}px`;
			toast.style.bottom = ""; // 清除 bottom
		} else {
			toast.style.bottom = `${20 + currentList.length * spacing}px`;
			toast.style.top = ""; // 清除 top
		}

		document.body.appendChild(toast);

		const newToastData: ToastData = { id: toastId, toast, timeout: null };
		currentList.push(newToastData);

		if (duration !== true) {
			newToastData.timeout = window.setTimeout(() => {
				this._removeToast(validPosition, toastId, toast);
			}, duration as number);
		}

		return () => {
			if (newToastData.timeout !== null) {
				clearTimeout(newToastData.timeout);
			}
			this._removeToast(validPosition, toastId, toast);
		};
	}

	/**
	 * 通过唯一 ID 移除指定的 Toast
	 * @param id - Toast 的唯一标识符（string 或 symbol）
	 * @returns 是否成功移除
	 */
	removeToastById(id: string | symbol): boolean {
		for (const position of TOAST_POSITIONS) {
			const list = this.toastRegistry[position];
			const index = list.findIndex(t => t.id === id);
			if (index !== -1) {
				const toastData = list[index];
				this._removeToast(position, id, toastData.toast);
				return true;
			}
		}
		return false;
	}

	private _generateRandomId(): string {
		return Math.floor(Math.random() * 1e9).toString(36);
	}

	private _removeToast(position: ToastPosition, toastId: string | symbol, toastElement: HTMLDivElement): void {
		toastElement.style.opacity = "0";
		toastElement.style.visibility = "hidden";

		setTimeout(() => {
			if (toastElement.parentNode) {
				toastElement.remove();
			}
		}, 500);

		// 从注册表中移除
		this.toastRegistry[position] = this.toastRegistry[position].filter(t => t.id !== toastId);

		// 重新排列
		this._repositionToasts(position);
	}

	private _repositionToasts(position: ToastPosition): void {
		const list = this.toastRegistry[position];
		const spacing = 60;

		list.forEach((item, index) => {
			if (position.startsWith("top")) {
				item.toast.style.top = `${80 + index * spacing}px`;
				item.toast.style.bottom = "";
			} else {
				item.toast.style.bottom = `${20 + index * spacing}px`;
				item.toast.style.top = "";
			}
		});
	}
}

interface ToastRegistry extends Record<ToastPosition, ToastData[]> {
	get(id: string | symbol): ToastData | null;
}

export const whichWayToast = new ToastManager();

onSetDev({
	name: "whichWayToast_dev",
	fn: () => {
		//@ts-ignore
		window.whichWayToast = whichWayToast;
	},
});

onContent({
	name: "whichWayToast_register",
	fn:()=>{
		window.whichWay.register("toast", whichWayToast);
	}
})
