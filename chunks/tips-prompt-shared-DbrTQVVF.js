import { ref as x, onMounted as C, watch as H, nextTick as A, onBeforeUnmount as T, openBlock as h, createElementBlock as v, normalizeStyle as b, Fragment as z, renderList as E, normalizeClass as O, createElementVNode as Z, reactive as I, createApp as M } from "vue";
import { _ as X } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const J = ["innerHTML"], N = 15, W = 8, P = {
  __name: "promptSJZX",
  props: {
    /**
     * 提示列表：同一宿主元素上的多条提示会在容器里依次排列（各占一行）
     * @type {Array<{ id: string, text: string, type: "card" | "character" }>}
     */
    prompts: { type: Array, default: () => [] }
  },
  setup(e) {
    const r = e, t = x(null), p = x(!1);
    function f(l) {
      const s = (
        /** @type {HTMLElement & { _fitKey?: string }} */
        l
      ), o = s?.firstElementChild, n = s?.clientWidth;
      if (!o || !n) return !1;
      const i = `${n}|${o.textContent}`;
      if (s._fitKey === i) return !0;
      s._fitKey = i;
      let a = N;
      for (s.style.fontSize = `${a}px`; a > W && o.scrollWidth > n; )
        a -= 1, s.style.fontSize = `${a}px`;
      return !0;
    }
    function c() {
      const l = t.value;
      if (!l) return;
      let s = !1;
      for (const o of Array.from(l.children)) s = f(o) || s;
      (s || !l.children.length) && (p.value = !0);
    }
    let d = null;
    return C(() => {
      c(), typeof ResizeObserver == "function" ? (d = new ResizeObserver(() => c()), d.observe(t.value)) : window.addEventListener("resize", c), document.fonts?.ready?.then(() => c());
    }), H(
      () => r.prompts.map((l) => l.text).join("\0"),
      () => A(c)
    ), T(() => {
      d?.disconnect(), window.removeEventListener("resize", c);
    }), (l, s) => (h(), v("div", {
      ref_key: "wrapper",
      ref: t,
      class: "promptSJZX-Wrapper",
      style: b(p.value ? null : { visibility: "hidden" })
    }, [
      (h(!0), v(z, null, E(e.prompts, (o) => (h(), v("div", {
        key: o.id,
        class: O(["promptSJZX", o.type === "character" ? "promptCharacterSJZX" : "promptCardSJZX"])
      }, [
        Z("span", {
          class: "promptSJZX-Text",
          innerHTML: o.text
        }, null, 8, J)
      ], 2))), 128))
    ], 4));
  }
}, $ = /* @__PURE__ */ X(P, [["__scopeId", "data-v-089c25af"]]), m = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new Set(), L = "handcards";
let S = null, y = null;
function _(e) {
  return !!((e.timeout && e.destiny?.classList ? e.destiny : null) ?? e.parentNode)?.classList?.contains(L);
}
function k() {
  S ??= new MutationObserver(F);
  for (const e of document.querySelectorAll(`.${L}`))
    S.observe(e, { childList: !0 });
}
function F() {
  y == null && (y = window.setTimeout(() => {
    y = null, k();
    for (const e of Array.from(w)) {
      const r = e.deref();
      r ? u.get(r)?.() : w.delete(e);
    }
  }, 0));
}
function R(e, r) {
  u.has(e) || (u.set(e, r), w.add(new WeakRef(e)), k());
}
function B(e) {
  const r = m.get(e);
  if (r) return r;
  const t = I({ prompts: [] }), p = document.createElement("div"), f = M($, t);
  f.mount(p);
  const c = p.firstElementChild;
  e.appendChild(c);
  let d = _(e);
  const l = () => t.prompts.some((n) => n.type === "card" && !n.keepOnLeave), s = () => {
    if (!l()) return;
    const n = _(e);
    if (d && !n && (t.prompts = t.prompts.filter((i) => i.type !== "card" || i.keepOnLeave), !t.prompts.length)) {
      o.destroy();
      return;
    }
    d = n;
  }, o = {
    el: c,
    get items() {
      return t.prompts.map((n) => ({ ...n }));
    },
    upsert(n) {
      const i = t.prompts.findIndex((a) => a.id === n.id);
      i < 0 ? t.prompts.push({ ...n }) : t.prompts.splice(i, 1, { ...n }), n.type === "card" && !n.keepOnLeave && !u.has(e) && (d = _(e), R(e, s));
    },
    remove(n) {
      if (n == null) t.prompts.length = 0;
      else {
        const i = t.prompts.findIndex((a) => a.id === n);
        i >= 0 && t.prompts.splice(i, 1);
      }
      t.prompts.length || o.destroy();
    },
    destroy() {
      m.delete(e), u.delete(e), f.unmount(), c.remove();
    }
  };
  return m.set(e, o), o;
}
function K(e, r) {
  const t = B(e);
  return t.upsert(r), t;
}
function V(e, r) {
  m.get(e)?.remove(r);
}
export {
  K as a,
  V as r
};
