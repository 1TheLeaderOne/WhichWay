import { onSetDev as y, onContent as d } from "./hooks-BscfO9lD.js";
const p = ["topLeft", "topRight", "bottomLeft", "bottomRight", "bottomCenter"];
class T {
  toastRegistry;
  constructor() {
    this.toastRegistry = this._initRegistry();
  }
  _initRegistry() {
    const t = {
      topLeft: [],
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
      bottomCenter: []
    };
    return t.get = (i) => {
      for (const o of p) {
        const e = t[o].find((n) => n.id === i);
        if (e) return e;
      }
      return null;
    }, t;
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
  showToast(t, i = 3e3, o = "bottomCenter", e) {
    const n = {
      topLeft: { top: "80px", left: "20px" },
      topRight: { top: "80px", right: "20px" },
      bottomLeft: { bottom: "20px", left: "20px" },
      bottomRight: { bottom: "20px", right: "20px" },
      bottomCenter: {
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)"
      }
    }, l = Object.hasOwn(n, o) ? o : "bottomCenter", u = n[l], r = e ?? this._generateRandomId();
    typeof r == "string" && r.startsWith("dragging_") && !t.includes("骨骼") && console.warn(`${r} 以 dragging_ 开头，在关闭动皮拖拽时会被删除！`);
    const a = this.toastRegistry.get(r);
    if (a) {
      a.toast.innerHTML = t, a.timeout !== null && clearTimeout(a.timeout);
      let g = null;
      return i !== !0 && (g = window.setTimeout(() => {
        this._removeToast(l, r, a.toast);
      }, i)), a.timeout = g, () => {
        a.timeout !== null && clearTimeout(a.timeout), this._removeToast(l, r, a.toast);
      };
    }
    const s = document.createElement("div");
    s.className = "toastSJZX", s.id = `toastSJZX-${String(r)}`, s.innerHTML = t, Object.assign(s.style, u), s.style.visibility = "visible", s.style.opacity = "1";
    const m = this.toastRegistry[l], c = 60;
    l.startsWith("top") ? (s.style.top = `${80 + m.length * c}px`, s.style.bottom = "") : (s.style.bottom = `${20 + m.length * c}px`, s.style.top = ""), document.body.appendChild(s);
    const h = { id: r, toast: s, timeout: null };
    return m.push(h), i !== !0 && (h.timeout = window.setTimeout(() => {
      this._removeToast(l, r, s);
    }, i)), () => {
      h.timeout !== null && clearTimeout(h.timeout), this._removeToast(l, r, s);
    };
  }
  /**
   * 通过唯一 ID 移除指定的 Toast
   * @param id - Toast 的唯一标识符（string 或 symbol）
   * @returns 是否成功移除
   */
  removeToastById(t) {
    for (const i of p) {
      const o = this.toastRegistry[i], e = o.findIndex((n) => n.id === t);
      if (e !== -1) {
        const n = o[e];
        return this._removeToast(i, t, n.toast), !0;
      }
    }
    return !1;
  }
  _generateRandomId() {
    return Math.floor(Math.random() * 1e9).toString(36);
  }
  _removeToast(t, i, o) {
    o.style.opacity = "0", o.style.visibility = "hidden", setTimeout(() => {
      o.parentNode && o.remove();
    }, 500), this.toastRegistry[t] = this.toastRegistry[t].filter((e) => e.id !== i), this._repositionToasts(t);
  }
  _repositionToasts(t) {
    const i = this.toastRegistry[t], o = 60;
    i.forEach((e, n) => {
      t.startsWith("top") ? (e.toast.style.top = `${80 + n * o}px`, e.toast.style.bottom = "") : (e.toast.style.bottom = `${20 + n * o}px`, e.toast.style.top = "");
    });
  }
}
const f = new T();
y({
  name: "whichWayToast_dev",
  fn: () => {
    window.whichWayToast = f;
  }
});
d({
  name: "whichWayToast_register",
  fn: () => {
    window.whichWay.register("toast", f);
  }
});
export {
  f as whichWayToast
};
