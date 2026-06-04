import { onSetDev, onContent } from "../hooks/index.js";
const TOAST_POSITIONS = ["topLeft", "topRight", "bottomLeft", "bottomRight", "bottomCenter"];
class ToastManager {
  toastRegistry;
  constructor() {
    this.toastRegistry = this._initRegistry();
  }
  _initRegistry() {
    const registry = {
      topLeft: [],
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
      bottomCenter: []
    };
    registry.get = (id) => {
      for (const pos of TOAST_POSITIONS) {
        const found = registry[pos].find((t) => t.id === id);
        if (found) return found;
      }
      return null;
    };
    return registry;
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
  showToast(message, duration = 3e3, position = "bottomCenter", id) {
    const positionPresets = {
      topLeft: { top: "80px", left: "20px" },
      topRight: { top: "80px", right: "20px" },
      bottomLeft: { bottom: "20px", left: "20px" },
      bottomRight: { bottom: "20px", right: "20px" },
      bottomCenter: {
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)"
      }
    };
    const validPosition = Object.hasOwn(positionPresets, position) ? position : "bottomCenter";
    const baseStyle = positionPresets[validPosition];
    const toastId = id ?? this._generateRandomId();
    if (typeof toastId === "string" && toastId.startsWith("dragging_") && !message.includes("骨骼")) {
      console.warn(`${toastId} 以 dragging_ 开头，在关闭动皮拖拽时会被删除！`);
    }
    const existing = this.toastRegistry.get(toastId);
    if (existing) {
      existing.toast.innerHTML = message;
      if (existing.timeout !== null) {
        clearTimeout(existing.timeout);
      }
      let newTimeout = null;
      if (duration !== true) {
        newTimeout = window.setTimeout(() => {
          this._removeToast(validPosition, toastId, existing.toast);
        }, duration);
      }
      existing.timeout = newTimeout;
      return () => {
        if (existing.timeout !== null) {
          clearTimeout(existing.timeout);
        }
        this._removeToast(validPosition, toastId, existing.toast);
      };
    }
    const toast = document.createElement("div");
    toast.className = "toastSJZX";
    toast.id = `toastSJZX-${String(toastId)}`;
    toast.innerHTML = message;
    Object.assign(toast.style, baseStyle);
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    const currentList = this.toastRegistry[validPosition];
    const spacing = 60;
    if (validPosition.startsWith("top")) {
      toast.style.top = `${80 + currentList.length * spacing}px`;
      toast.style.bottom = "";
    } else {
      toast.style.bottom = `${20 + currentList.length * spacing}px`;
      toast.style.top = "";
    }
    document.body.appendChild(toast);
    const newToastData = { id: toastId, toast, timeout: null };
    currentList.push(newToastData);
    if (duration !== true) {
      newToastData.timeout = window.setTimeout(() => {
        this._removeToast(validPosition, toastId, toast);
      }, duration);
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
  removeToastById(id) {
    for (const position of TOAST_POSITIONS) {
      const list = this.toastRegistry[position];
      const index = list.findIndex((t) => t.id === id);
      if (index !== -1) {
        const toastData = list[index];
        this._removeToast(position, id, toastData.toast);
        return true;
      }
    }
    return false;
  }
  _generateRandomId() {
    return Math.floor(Math.random() * 1e9).toString(36);
  }
  _removeToast(position, toastId, toastElement) {
    toastElement.style.opacity = "0";
    toastElement.style.visibility = "hidden";
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.remove();
      }
    }, 500);
    this.toastRegistry[position] = this.toastRegistry[position].filter((t) => t.id !== toastId);
    this._repositionToasts(position);
  }
  _repositionToasts(position) {
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
const whichWayToast = new ToastManager();
onSetDev({
  name: "whichWayToast_dev",
  fn: () => {
    window.whichWayToast = whichWayToast;
  }
});
onContent({
  name: "whichWayToast_register",
  fn: () => {
    window.whichWay.register("toast", whichWayToast);
  }
});
export {
  whichWayToast
};
//# sourceMappingURL=index.js.map
