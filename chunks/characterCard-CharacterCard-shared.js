import { get as te, lib as q, game as Ke, ui as gt } from "noname";
import { ref as X, onMounted as _t, nextTick as Ot, onBeforeUnmount as Qt, openBlock as g, createElementBlock as b, Fragment as G, renderList as ne, createElementVNode as d, toDisplayString as B, normalizeClass as Z, createCommentVNode as ie, withDirectives as kt, vShow as wt, computed as P, normalizeStyle as ye, createBlock as $e, createApp as en } from "vue";
import { whichWayFile as le } from "./file.js";
import { whichWayUtil as Oe } from "./utill.js";
import { w as ae, b as ke } from "./skin-PortraitLayers-shared.js";
import { whichWayAudio as Ne } from "./audio.js";
import { whichWayToast as Lt } from "./toast.js";
import { whichWayArknight as tn } from "./arknight.js";
import { whichWayCharacterModules as ze } from "./modules.js";
import { b as nn, c as on, g as an, e as rn } from "./packs-base-characterDesigner-shared.js";
import { _ as Me } from "./_plugin-vue_export-helper.js";
import { w as sn } from "./config-data-shared.js";
import { onContent as ln, onConfig as St, onSetDev as cn } from "./hooks.js";
import { whichWayAPIOverride as dn } from "./override.js";
function re(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
const fe = re(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), it = re(/Edge/i), Dt = re(/firefox/i), qe = re(/safari/i) && !re(/chrome/i) && !re(/android/i), yt = re(/iP(ad|od|hone)/i), Pt = re(/chrome/i) && re(/android/i), At = {
  capture: !1,
  passive: !1
};
function T(e, n, t) {
  e.addEventListener(n, t, !fe && At);
}
function D(e, n, t) {
  e.removeEventListener(n, t, !fe && At);
}
function Qe(e, n) {
  if (n) {
    if (n[0] === ">" && (n = n.substring(1)), e)
      try {
        if (e.matches)
          return e.matches(n);
        if (e.msMatchesSelector)
          return e.msMatchesSelector(n);
        if (e.webkitMatchesSelector)
          return e.webkitMatchesSelector(n);
      } catch {
        return !1;
      }
    return !1;
  }
}
function Bt(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode;
}
function ee(e, n, t, i) {
  if (e) {
    t = t || document;
    do {
      if (n != null && (n[0] === ">" ? e.parentNode === t && Qe(e, n) : Qe(e, n)) || i && e === t)
        return e;
      if (e === t) break;
    } while (e = Bt(e));
  }
  return null;
}
const Tt = /\s+/g;
function j(e, n, t) {
  if (e && n)
    if (e.classList)
      e.classList[t ? "add" : "remove"](n);
    else {
      let i = (" " + e.className + " ").replace(Tt, " ").replace(" " + n + " ", " ");
      e.className = (i + (t ? " " + n : "")).replace(Tt, " ");
    }
}
function m(e, n, t) {
  let i = e && e.style;
  if (i) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), n === void 0 ? t : t[n];
    !(n in i) && n.indexOf("webkit") === -1 && (n = "-webkit-" + n), i[n] = t + (typeof t == "string" ? "" : "px");
  }
}
function xe(e, n) {
  let t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      let o = m(e, "transform");
      o && o !== "none" && (t = o + " " + t);
    } while (!n && (e = e.parentNode));
  const i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return i && new i(t);
}
function Ht(e, n, t) {
  if (e) {
    let i = e.getElementsByTagName(n), o = 0, a = i.length;
    if (t)
      for (; o < a; o++)
        t(i[o], o);
    return i;
  }
  return [];
}
function ue() {
  let e = document.scrollingElement;
  return e || document.documentElement;
}
function A(e, n, t, i, o) {
  if (!e.getBoundingClientRect && e !== window) return;
  let a, r, s, l, c, p, h;
  if (e !== window && e.parentNode && e !== ue() ? (a = e.getBoundingClientRect(), r = a.top, s = a.left, l = a.bottom, c = a.right, p = a.height, h = a.width) : (r = 0, s = 0, l = window.innerHeight, c = window.innerWidth, p = window.innerHeight, h = window.innerWidth), (n || t) && e !== window && (o = o || e.parentNode, !fe))
    do
      if (o && o.getBoundingClientRect && (m(o, "transform") !== "none" || t && m(o, "position") !== "static")) {
        let w = o.getBoundingClientRect();
        r -= w.top + parseInt(m(o, "border-top-width")), s -= w.left + parseInt(m(o, "border-left-width")), l = r + a.height, c = s + a.width;
        break;
      }
    while (o = o.parentNode);
  if (i && e !== window) {
    let w = xe(o || e), S = w && w.a, f = w && w.d;
    w && (r /= f, s /= S, h /= S, p /= f, l = r + p, c = s + h);
  }
  return {
    top: r,
    left: s,
    bottom: l,
    right: c,
    width: h,
    height: p
  };
}
function Et(e, n, t) {
  let i = Mt(e, !0), o = A(e)[n];
  for (; i; ) {
    let a = A(i)[t], r;
    if (r = o >= a, !r) return i;
    if (i === ue()) break;
    i = Mt(i, !1);
  }
  return !1;
}
function Be(e, n, t, i) {
  let o = 0, a = 0, r = e.children;
  for (; a < r.length; ) {
    if (r[a].style.display !== "none" && r[a] !== y.ghost && (i || r[a] !== y.dragged) && ee(r[a], t.draggable, e, !1)) {
      if (o === n)
        return r[a];
      o++;
    }
    a++;
  }
  return null;
}
function bt(e, n) {
  let t = e.lastElementChild;
  for (; t && (t === y.ghost || m(t, "display") === "none" || n && !Qe(t, n)); )
    t = t.previousElementSibling;
  return t || null;
}
function J(e, n) {
  let t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== y.clone && (!n || Qe(e, n)) && t++;
  return t;
}
function xt(e) {
  let n = 0, t = 0, i = ue();
  if (e)
    do {
      let o = xe(e), a = o.a, r = o.d;
      n += e.scrollLeft * a, t += e.scrollTop * r;
    } while (e !== i && (e = e.parentNode));
  return [n, t];
}
function un(e, n) {
  for (let t in e)
    if (e.hasOwnProperty(t)) {
      for (let i in n)
        if (n.hasOwnProperty(i) && n[i] === e[t][i]) return Number(t);
    }
  return -1;
}
function Mt(e, n) {
  if (!e || !e.getBoundingClientRect) return ue();
  let t = e, i = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      let o = m(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return ue();
        if (i || n) return t;
        i = !0;
      }
    }
  while (t = t.parentNode);
  return ue();
}
function fn(e, n) {
  if (e && n)
    for (let t in n)
      n.hasOwnProperty(t) && (e[t] = n[t]);
  return e;
}
function st(e, n) {
  return Math.round(e.top) === Math.round(n.top) && Math.round(e.left) === Math.round(n.left) && Math.round(e.height) === Math.round(n.height) && Math.round(e.width) === Math.round(n.width);
}
let lt;
function hn(e, n) {
  return function() {
    if (!lt) {
      let t = arguments, i = this;
      t.length === 1 ? e.call(i, t[0]) : e.apply(i, t), lt = setTimeout(function() {
        lt = void 0;
      }, n);
    }
  };
}
function pn(e, n, t) {
  e.scrollLeft += n, e.scrollTop += t;
}
function Xt(e) {
  let n = window.Polymer, t = window.jQuery || window.Zepto;
  return n && n.dom ? n.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Rt(e, n, t) {
  const i = {};
  return Array.from(e.children).forEach((o) => {
    if (!ee(o, n.draggable, e, !1) || o.animated || o === t) return;
    const a = A(o);
    i.left = Math.min(i.left ?? 1 / 0, a.left), i.top = Math.min(i.top ?? 1 / 0, a.top), i.right = Math.max(i.right ?? -1 / 0, a.right), i.bottom = Math.max(i.bottom ?? -1 / 0, a.bottom);
  }), i.width = i.right - i.left, i.height = i.bottom - i.top, i.x = i.left, i.y = i.top, i;
}
const V = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function gn() {
  let e = [], n;
  return {
    captureAnimationState() {
      if (e = [], !this.options.animation) return;
      [].slice.call(this.el.children).forEach((i) => {
        if (m(i, "display") === "none" || i === y.ghost) return;
        e.push({
          target: i,
          rect: A(i)
        });
        let o = { ...e[e.length - 1].rect };
        if (i.thisAnimationDuration) {
          let a = xe(i, !0);
          a && (o.top -= a.f, o.left -= a.e);
        }
        i.fromRect = o;
      });
    },
    addAnimationState(t) {
      e.push(t);
    },
    removeAnimationState(t) {
      e.splice(un(e, { target: t }), 1);
    },
    animateAll(t) {
      if (!this.options.animation) {
        clearTimeout(n), typeof t == "function" && t();
        return;
      }
      let i = !1, o = 0;
      e.forEach((a) => {
        let r = 0, s = a.target, l = s.fromRect, c = A(s), p = s.prevFromRect, h = s.prevToRect, w = a.rect, S = xe(s, !0);
        S && (c.top -= S.f, c.left -= S.e), s.toRect = c, s.thisAnimationDuration && st(p, c) && !st(l, c) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - c.top) / (w.left - c.left) === (l.top - c.top) / (l.left - c.left) && (r = vn(w, p, h, this.options)), st(c, l) || (s.prevFromRect = l, s.prevToRect = c, r || (r = this.options.animation), this.animate(
          s,
          w,
          c,
          r
        )), r && (i = !0, o = Math.max(o, r), clearTimeout(s.animationResetTimer), s.animationResetTimer = setTimeout(function() {
          s.animationTime = 0, s.prevFromRect = null, s.fromRect = null, s.prevToRect = null, s.thisAnimationDuration = null;
        }, r), s.thisAnimationDuration = r);
      }), clearTimeout(n), i ? n = setTimeout(function() {
        typeof t == "function" && t();
      }, o) : typeof t == "function" && t(), e = [];
    },
    animate(t, i, o, a) {
      if (a) {
        m(t, "transition", ""), m(t, "transform", "");
        let r = xe(this.el), s = r && r.a, l = r && r.d, c = (i.left - o.left) / (s || 1), p = (i.top - o.top) / (l || 1);
        t.animatingX = !!c, t.animatingY = !!p, m(t, "transform", "translate3d(" + c + "px," + p + "px,0)"), this.forRepaintDummy = mn(t), m(t, "transition", "transform " + a + "ms" + (this.options.easing ? " " + this.options.easing : "")), m(t, "transform", "translate3d(0,0,0)"), typeof t.animated == "number" && clearTimeout(t.animated), t.animated = setTimeout(function() {
          m(t, "transition", ""), m(t, "transform", ""), t.animated = !1, t.animatingX = !1, t.animatingY = !1;
        }, a);
      }
    }
  };
}
function mn(e) {
  return e.offsetWidth;
}
function vn(e, n, t, i) {
  return Math.sqrt(Math.pow(n.top - e.top, 2) + Math.pow(n.left - e.left, 2)) / Math.sqrt(Math.pow(n.top - t.top, 2) + Math.pow(n.left - t.left, 2)) * i.animation;
}
let we = [];
const ct = {
  initializeByDefault: !0
}, Xe = {
  mount(e) {
    for (let n in ct)
      ct.hasOwnProperty(n) && !(n in e) && (e[n] = ct[n]);
    we.forEach((n) => {
      if (n.pluginName === e.pluginName)
        throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
    }), we.push(e);
  },
  pluginEvent(e, n, t) {
    this.eventCanceled = !1, t.cancel = () => {
      this.eventCanceled = !0;
    };
    const i = e + "Global";
    we.forEach((o) => {
      n[o.pluginName] && (n[o.pluginName][i] && n[o.pluginName][i]({ sortable: n, ...t }), n.options[o.pluginName] && n[o.pluginName][e] && n[o.pluginName][e]({ sortable: n, ...t }));
    });
  },
  initializePlugins(e, n, t, i) {
    we.forEach((o) => {
      const a = o.pluginName;
      if (!e.options[a] && !o.initializeByDefault) return;
      let r = new o(e, n, e.options);
      r.sortable = e, r.options = e.options, e[a] = r, Object.assign(t, r.defaults);
    });
    for (let o in e.options) {
      if (!e.options.hasOwnProperty(o)) continue;
      let a = this.modifyOption(e, o, e.options[o]);
      typeof a < "u" && (e.options[o] = a);
    }
  },
  getEventProperties(e, n) {
    let t = {};
    return we.forEach((i) => {
      typeof i.eventProperties == "function" && Object.assign(t, i.eventProperties.call(n[i.pluginName], e));
    }), t;
  },
  modifyOption(e, n, t) {
    let i;
    return we.forEach((o) => {
      e[o.pluginName] && o.optionListeners && typeof o.optionListeners[n] == "function" && (i = o.optionListeners[n].call(e[o.pluginName], t));
    }), i;
  }
};
function _n({
  sortable: e,
  rootEl: n,
  name: t,
  targetEl: i,
  cloneEl: o,
  toEl: a,
  fromEl: r,
  oldIndex: s,
  newIndex: l,
  oldDraggableIndex: c,
  newDraggableIndex: p,
  originalEvent: h,
  putSortable: w,
  extraEventProperties: S
}) {
  if (e = e || n && n[V], !e) return;
  let f, k = e.options, v = "on" + t.charAt(0).toUpperCase() + t.substr(1);
  window.CustomEvent && !fe && !it ? f = new CustomEvent(t, {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent(t, !0, !0)), f.to = a || n, f.from = r || n, f.item = i || n, f.clone = o, f.oldIndex = s, f.newIndex = l, f.oldDraggableIndex = c, f.newDraggableIndex = p, f.originalEvent = h, f.pullMode = w ? w.lastPutMode : void 0;
  let I = { ...S, ...Xe.getEventProperties(t, e) };
  for (let E in I)
    f[E] = I[E];
  n && n.dispatchEvent(f), k[v] && k[v].call(e, f);
}
let U = function(e, n, { evt: t, ...i } = {}) {
  Xe.pluginEvent.bind(y)(e, n, {
    dragEl: u,
    parentEl: O,
    ghostEl: _,
    rootEl: $,
    nextEl: _e,
    lastDownEl: Ze,
    cloneEl: N,
    cloneHidden: de,
    dragStarted: We,
    putSortable: H,
    activeSortable: y.active,
    originalEvent: t,
    oldIndex: Ee,
    oldDraggableIndex: Le,
    newIndex: z,
    newDraggableIndex: ce,
    hideGhostForTarget: Gt,
    unhideGhostForTarget: jt,
    cloneNowHidden() {
      de = !0;
    },
    cloneNowShown() {
      de = !1;
    },
    dispatchSortableEvent(o) {
      Y({ sortable: n, name: o, originalEvent: t });
    },
    ...i
  });
};
function Y(e) {
  _n({
    putSortable: H,
    cloneEl: N,
    targetEl: u,
    rootEl: $,
    oldIndex: Ee,
    oldDraggableIndex: Le,
    newIndex: z,
    newDraggableIndex: ce,
    ...e
  });
}
let u, O, _, $, _e, Ze, N, de, Ee, z, Le, ce, Ye, H, Te = !1, et = !1, tt = [], me, Q, dt, ut, It, $t, We, Se, Pe, Ae = !1, Ue = !1, Ve, F, ft = [], mt = !1, nt = [];
const ot = typeof document < "u", Ge = yt, Nt = it || fe ? "cssFloat" : "float", yn = ot && !Pt && !yt && "draggable" in document.createElement("div"), Ft = (function() {
  if (!ot) return;
  if (fe)
    return !1;
  let e = document.createElement("x");
  return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
})(), Yt = function(e, n) {
  let t = m(e), i = parseInt(t.width) - parseInt(t.paddingLeft) - parseInt(t.paddingRight) - parseInt(t.borderLeftWidth) - parseInt(t.borderRightWidth), o = Be(e, 0, n), a = Be(e, 1, n), r = o && m(o), s = a && m(a), l = r && parseInt(r.marginLeft) + parseInt(r.marginRight) + A(o).width, c = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + A(a).width;
  if (t.display === "flex")
    return t.flexDirection === "column" || t.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (t.display === "grid")
    return t.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (o && r.float && r.float !== "none") {
    let p = r.float === "left" ? "left" : "right";
    return a && (s.clear === "both" || s.clear === p) ? "vertical" : "horizontal";
  }
  return o && (r.display === "block" || r.display === "flex" || r.display === "table" || r.display === "grid" || l >= i && t[Nt] === "none" || a && t[Nt] === "none" && l + c > i) ? "vertical" : "horizontal";
}, bn = function(e, n, t) {
  let i = t ? e.left : e.top, o = t ? e.right : e.bottom, a = t ? e.width : e.height, r = t ? n.left : n.top, s = t ? n.right : n.bottom, l = t ? n.width : n.height;
  return i === r || o === s || i + a / 2 === r + l / 2;
}, Cn = function(e, n) {
  let t;
  return tt.some((i) => {
    const o = i[V].options.emptyInsertThreshold;
    if (!o || bt(i)) return;
    const a = A(i), r = e >= a.left - o && e <= a.right + o, s = n >= a.top - o && n <= a.bottom + o;
    if (r && s)
      return t = i;
  }), t;
}, Ut = function(e) {
  function n(o, a) {
    return function(r, s, l, c) {
      let p = r.options.group.name && s.options.group.name && r.options.group.name === s.options.group.name;
      if (o == null && (a || p))
        return !0;
      if (o == null || o === !1)
        return !1;
      if (a && o === "clone")
        return o;
      if (typeof o == "function")
        return n(o(r, s, l, c), a)(r, s, l, c);
      {
        let h = (a ? r : s).options.group.name;
        return o === !0 || typeof o == "string" && o === h || o.join && o.indexOf(h) > -1;
      }
    };
  }
  let t = {}, i = e.group;
  (!i || typeof i != "object") && (i = { name: i }), t.name = i.name, t.checkPull = n(i.pull, !0), t.checkPut = n(i.put), t.revertClone = i.revertClone, e.group = t;
}, Gt = function() {
  !Ft && _ && m(_, "display", "none");
}, jt = function() {
  !Ft && _ && m(_, "display", "");
};
ot && !Pt && document.addEventListener("click", function(e) {
  if (et)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), et = !1, !1;
}, !0);
let ve = function(e) {
  if (u) {
    e = e.touches ? e.touches[0] : e;
    let n = Cn(e.clientX, e.clientY);
    if (n) {
      let t = {};
      for (let i in e)
        e.hasOwnProperty(i) && (t[i] = e[i]);
      t.target = t.rootEl = n, t.preventDefault = void 0, t.stopPropagation = void 0, n[V]._onDragOver(t);
    }
  }
}, kn = function(e) {
  u && u.parentNode[V]._isOutsideThisEl(e.target);
};
function y(e, n) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
  this.el = e, this.options = n = Object.assign({}, n), e[V] = this;
  let t = {
    group: null,
    sort: !0,
    disabled: !1,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(e.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: !1,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: !0,
    direction: function() {
      return Yt(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(i, o) {
      i.setData("Text", o.textContent);
    },
    dropBubble: !1,
    dragoverBubble: !1,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: !1,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: !1,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: !1,
    fallbackTolerance: 0,
    fallbackOffset: { x: 0, y: 0 },
    // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
    supportPointer: y.supportPointer !== !1 && "PointerEvent" in window && (!qe || yt),
    emptyInsertThreshold: 5
  };
  Xe.initializePlugins(this, e, t);
  for (let i in t)
    !(i in n) && (n[i] = t[i]);
  Ut(n);
  for (let i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = n.forceFallback ? !1 : yn, this.nativeDraggable && (this.options.touchStartThreshold = 1), n.supportPointer ? T(e, "pointerdown", this._onTapStart) : (T(e, "mousedown", this._onTapStart), T(e, "touchstart", this._onTapStart)), this.nativeDraggable && (T(e, "dragover", this), T(e, "dragenter", this)), tt.push(this.el), n.store && n.store.get && this.sort(n.store.get(this) || []), Object.assign(this, gn());
}
y.prototype = /** @lends Sortable.prototype */
{
  constructor: y,
  _isOutsideThisEl: function(e) {
    !this.el.contains(e) && e !== this.el && (Se = null);
  },
  _getDirection: function(e, n) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, e, n, u) : this.options.direction;
  },
  _onTapStart: function(e) {
    if (!e.cancelable) return;
    let n = this, t = this.el, i = this.options, o = i.preventOnFilter, a = e.type, r = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (r || e).target, l = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, c = i.filter;
    if (In(t), !u && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || i.disabled) && !l.isContentEditable && !(!this.nativeDraggable && qe && s && s.tagName.toUpperCase() === "SELECT") && (s = ee(s, i.draggable, t, !1), !(s && s.animated) && Ze !== s)) {
      if (Ee = J(s), Le = J(s, i.draggable), typeof c == "function") {
        if (c.call(this, e, s, this)) {
          Y({
            sortable: n,
            rootEl: l,
            name: "filter",
            targetEl: s,
            toEl: t,
            fromEl: t
          }), U("filter", n, { evt: e }), o && e.preventDefault();
          return;
        }
      } else if (c && (c = c.split(",").some(function(p) {
        if (p = ee(l, p.trim(), t, !1), p)
          return Y({
            sortable: n,
            rootEl: p,
            name: "filter",
            targetEl: s,
            fromEl: t,
            toEl: t
          }), U("filter", n, { evt: e }), !0;
      }), c)) {
        o && e.preventDefault();
        return;
      }
      i.handle && !ee(l, i.handle, t, !1) || this._prepareDragStart(e, r, s);
    }
  },
  _prepareDragStart: function(e, n, t) {
    let i = this, o = i.el, a = i.options, r = o.ownerDocument, s;
    if (t && !u && t.parentNode === o) {
      let l = A(t);
      if ($ = o, u = t, O = u.parentNode, _e = u.nextSibling, Ze = t, Ye = a.group, y.dragged = u, me = {
        target: u,
        clientX: (n || e).clientX,
        clientY: (n || e).clientY
      }, It = me.clientX - l.left, $t = me.clientY - l.top, this._lastX = (n || e).clientX, this._lastY = (n || e).clientY, u.style["will-change"] = "all", s = function() {
        if (U("delayEnded", i, { evt: e }), y.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !Dt && i.nativeDraggable && (u.draggable = !0), i._triggerDragStart(e, n), Y({
          sortable: i,
          name: "choose",
          originalEvent: e
        }), j(u, a.chosenClass, !0);
      }, a.ignore.split(",").forEach(function(c) {
        Ht(u, c.trim(), ht);
      }), T(r, "dragover", ve), T(r, "mousemove", ve), T(r, "touchmove", ve), a.supportPointer ? (T(r, "pointerup", i._onDrop), !this.nativeDraggable && T(r, "pointercancel", i._onDrop)) : (T(r, "mouseup", i._onDrop), T(r, "touchend", i._onDrop), T(r, "touchcancel", i._onDrop)), Dt && this.nativeDraggable && (this.options.touchStartThreshold = 4, u.draggable = !0), U("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || n) && (!this.nativeDraggable || !(it || fe))) {
        if (y.eventCanceled) {
          this._onDrop();
          return;
        }
        a.supportPointer ? (T(r, "pointerup", i._disableDelayedDrag), T(r, "pointercancel", i._disableDelayedDrag)) : (T(r, "mouseup", i._disableDelayedDrag), T(r, "touchend", i._disableDelayedDrag), T(r, "touchcancel", i._disableDelayedDrag)), T(r, "mousemove", i._delayedDragTouchMoveHandler), T(r, "touchmove", i._delayedDragTouchMoveHandler), a.supportPointer && T(r, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(s, a.delay);
      } else
        s();
    }
  },
  _delayedDragTouchMoveHandler: function(e) {
    let n = e.touches ? e.touches[0] : e;
    Math.max(Math.abs(n.clientX - this._lastX), Math.abs(n.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    u && ht(u), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    let e = this.el.ownerDocument;
    D(e, "mouseup", this._disableDelayedDrag), D(e, "touchend", this._disableDelayedDrag), D(e, "touchcancel", this._disableDelayedDrag), D(e, "pointerup", this._disableDelayedDrag), D(e, "pointercancel", this._disableDelayedDrag), D(e, "mousemove", this._delayedDragTouchMoveHandler), D(e, "touchmove", this._delayedDragTouchMoveHandler), D(e, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(e, n) {
    n = n || e.pointerType == "touch" && e, !this.nativeDraggable || n ? this.options.supportPointer ? T(document, "pointermove", this._onTouchMove) : n ? T(document, "touchmove", this._onTouchMove) : T(document, "mousemove", this._onTouchMove) : (T(u, "dragend", this), T($, "dragstart", this._onDragStart));
    try {
      document.selection ? Je(() => {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(e, n) {
    if (Te = !1, $ && u) {
      U("dragStarted", this, { evt: n }), this.nativeDraggable && T(document, "dragover", kn);
      let t = this.options;
      !e && j(u, t.dragClass, !1), j(u, t.ghostClass, !0), y.active = this, e && this._appendGhost(), Y({
        sortable: this,
        name: "start",
        originalEvent: n
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Q) {
      this._lastX = Q.clientX, this._lastY = Q.clientY, Gt();
      let e = document.elementFromPoint(Q.clientX, Q.clientY), n = e;
      for (; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(Q.clientX, Q.clientY), e !== n); )
        n = e;
      if (u.parentNode[V]._isOutsideThisEl(e), n)
        do {
          if (n[V]) {
            let t;
            if (t = n[V]._onDragOver({
              clientX: Q.clientX,
              clientY: Q.clientY,
              target: e,
              rootEl: n
            }), t && !this.options.dragoverBubble)
              break;
          }
          e = n;
        } while (n = Bt(n));
      jt();
    }
  },
  _onTouchMove: function(e) {
    if (me) {
      let n = this.options, t = n.fallbackTolerance, i = n.fallbackOffset, o = e.touches ? e.touches[0] : e, a = _ && xe(_, !0), r = _ && a && a.a, s = _ && a && a.d, l = Ge && F && xt(F), c = (o.clientX - me.clientX + i.x) / (r || 1) + (l ? l[0] - ft[0] : 0) / (r || 1), p = (o.clientY - me.clientY + i.y) / (s || 1) + (l ? l[1] - ft[1] : 0) / (s || 1);
      if (!y.active && !Te) {
        if (t && Math.max(Math.abs(o.clientX - this._lastX), Math.abs(o.clientY - this._lastY)) < t)
          return;
        this._onDragStart(e, !0);
      }
      if (_) {
        a ? (a.e += c - (dt || 0), a.f += p - (ut || 0)) : a = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: p
        };
        let h = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
        m(_, "webkitTransform", h), m(_, "mozTransform", h), m(_, "msTransform", h), m(_, "transform", h), dt = c, ut = p, Q = o;
      }
      e.cancelable && e.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!_) {
      let e = this.options.fallbackOnBody ? document.body : $, n = A(u, !0, Ge, !0, e), t = this.options;
      if (Ge) {
        for (F = e; m(F, "position") === "static" && m(F, "transform") === "none" && F !== document; )
          F = F.parentNode;
        F !== document.body && F !== document.documentElement ? (F === document && (F = ue()), n.top += F.scrollTop, n.left += F.scrollLeft) : F = ue(), ft = xt(F);
      }
      _ = u.cloneNode(!0), j(_, t.ghostClass, !1), j(_, t.fallbackClass, !0), j(_, t.dragClass, !0), m(_, "transition", ""), m(_, "transform", ""), m(_, "box-sizing", "border-box"), m(_, "margin", 0), m(_, "top", n.top), m(_, "left", n.left), m(_, "width", n.width), m(_, "height", n.height), m(_, "opacity", "0.8"), m(_, "position", Ge ? "absolute" : "fixed"), m(_, "zIndex", "100000"), m(_, "pointerEvents", "none"), y.ghost = _, e.appendChild(_), m(_, "transform-origin", It / parseInt(_.style.width) * 100 + "% " + $t / parseInt(_.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(e, n) {
    let t = this, i = e.dataTransfer, o = t.options;
    if (U("dragStart", this, { evt: e }), y.eventCanceled) {
      this._onDrop();
      return;
    }
    U("setupClone", this), y.eventCanceled || (N = Xt(u), N.removeAttribute("id"), N.draggable = !1, N.style["will-change"] = "", this._hideClone(), j(N, this.options.chosenClass, !1), y.clone = N), t.cloneId = Je(function() {
      U("clone", t), !y.eventCanceled && (t.options.removeCloneOnHide || $.insertBefore(N, u), t._hideClone(), Y({
        sortable: t,
        name: "clone"
      }));
    }), !n && j(u, o.dragClass, !0), n ? (et = !0, t._loopId = setInterval(t._emulateDragOver, 50)) : (D(document, "mouseup", t._onDrop), D(document, "touchend", t._onDrop), D(document, "touchcancel", t._onDrop), i && (i.effectAllowed = "move", o.setData && o.setData.call(t, i, u)), T(document, "drop", t), m(u, "transform", "translateZ(0)")), Te = !0, t._dragStartId = Je(t._dragStarted.bind(t, n, e)), T(document, "selectstart", t), We = !0, window.getSelection().removeAllRanges(), qe && m(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(e) {
    let n = this.el, t = e.target, i, o, a, r = this.options, s = r.group, l = y.active, c = Ye === s, p = r.sort, h = H || l, w, S = this, f = !1;
    if (mt) return;
    function k(x, L) {
      U(x, S, {
        evt: e,
        isOwner: c,
        axis: w ? "vertical" : "horizontal",
        revert: a,
        dragRect: i,
        targetRect: o,
        canSort: p,
        fromSortable: h,
        target: t,
        completed: I,
        onMove(R, K) {
          return je($, n, u, i, R, A(R), e, K);
        },
        changed: E,
        ...L
      });
    }
    function v() {
      k("dragOverAnimationCapture"), S.captureAnimationState(), S !== h && h.captureAnimationState();
    }
    function I(x) {
      return k("dragOverCompleted", { insertion: x }), x && (c ? l._hideClone() : l._showClone(S), S !== h && (j(u, H ? H.options.ghostClass : l.options.ghostClass, !1), j(u, r.ghostClass, !0)), H !== S && S !== y.active ? H = S : S === y.active && H && (H = null), h === S && (S._ignoreWhileAnimating = t), S.animateAll(function() {
        k("dragOverAnimationComplete"), S._ignoreWhileAnimating = null;
      }), S !== h && (h.animateAll(), h._ignoreWhileAnimating = null)), (t === u && !u.animated || t === n && !t.animated) && (Se = null), !r.dragoverBubble && !e.rootEl && t !== document && (u.parentNode[V]._isOutsideThisEl(e.target), !x && ve(e)), !r.dragoverBubble && e.stopPropagation && e.stopPropagation(), f = !0;
    }
    function E() {
      z = J(u), ce = J(u, r.draggable), Y({
        sortable: S,
        name: "change",
        toEl: n,
        newIndex: z,
        newDraggableIndex: ce,
        originalEvent: e
      });
    }
    if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), t = ee(t, r.draggable, n, !0), k("dragOver"), y.eventCanceled) return f;
    if (u.contains(e.target) || t.animated && t.animatingX && t.animatingY || S._ignoreWhileAnimating === t)
      return I(!1);
    if (et = !1, l && !r.disabled && (c ? p || (a = O !== $) : H === this || (this.lastPutMode = Ye.checkPull(this, l, u, e)) && s.checkPut(this, l, u, e))) {
      if (w = this._getDirection(e, t) === "vertical", i = A(u), k("dragOverValid"), y.eventCanceled) return f;
      if (a)
        return O = $, v(), this._hideClone(), k("revert"), y.eventCanceled || (_e ? $.insertBefore(u, _e) : $.appendChild(u)), I(!0);
      let x = bt(n, r.draggable);
      if (!x || Tn(e, w, this) && !x.animated) {
        if (x === u)
          return I(!1);
        if (x && n === e.target && (t = x), t && (o = A(t)), je($, n, u, i, t, o, e, !!t) !== !1)
          return v(), x && x.nextSibling ? n.insertBefore(u, x.nextSibling) : n.appendChild(u), O = n, E(), I(!0);
      } else if (x && Dn(e, w, this)) {
        let L = Be(n, 0, r, !0);
        if (L === u)
          return I(!1);
        if (t = L, o = A(t), je($, n, u, i, t, o, e, !1) !== !1)
          return v(), n.insertBefore(u, L), O = n, E(), I(!0);
      } else if (t.parentNode === n) {
        o = A(t);
        let L = 0, R, K = u.parentNode !== n, se = !bn(u.animated && u.toRect || i, t.animated && t.toRect || o, w), be = w ? "top" : "left", oe = Et(t, "top", "top") || Et(u, "top", "top"), Re = oe ? oe.scrollTop : void 0;
        Se !== t && (R = o[be], Ae = !1, Ue = !se && r.invertSwap || K), L = En(
          e,
          t,
          o,
          w,
          se ? 1 : r.swapThreshold,
          r.invertedSwapThreshold == null ? r.swapThreshold : r.invertedSwapThreshold,
          Ue,
          Se === t
        );
        let he;
        if (L !== 0) {
          let Fe = J(u);
          do
            Fe -= L, he = O.children[Fe];
          while (he && (m(he, "display") === "none" || he === _));
        }
        if (L === 0 || he === t)
          return I(!1);
        Se = t, Pe = L;
        let pe = t.nextElementSibling, ge = !1;
        ge = L === 1;
        let Ce = je($, n, u, i, t, o, e, ge);
        if (Ce !== !1)
          return (Ce === 1 || Ce === -1) && (ge = Ce === 1), mt = !0, setTimeout(Sn, 30), v(), ge && !pe ? n.appendChild(u) : t.parentNode.insertBefore(u, ge ? pe : t), oe && pn(oe, 0, Re - oe.scrollTop), O = u.parentNode, R !== void 0 && !Ue && (Ve = Math.abs(R - A(t)[be])), E(), I(!0);
      }
      if (n.contains(u))
        return I(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    D(document, "mousemove", this._onTouchMove), D(document, "touchmove", this._onTouchMove), D(document, "pointermove", this._onTouchMove), D(document, "dragover", ve), D(document, "mousemove", ve), D(document, "touchmove", ve);
  },
  _offUpEvents: function() {
    let e = this.el.ownerDocument;
    D(e, "mouseup", this._onDrop), D(e, "touchend", this._onDrop), D(e, "pointerup", this._onDrop), D(e, "pointercancel", this._onDrop), D(e, "touchcancel", this._onDrop), D(document, "selectstart", this);
  },
  _onDrop: function(e) {
    let n = this.el, t = this.options;
    if (z = J(u), ce = J(u, t.draggable), U("drop", this, {
      evt: e
    }), O = u && u.parentNode, z = J(u), ce = J(u, t.draggable), y.eventCanceled) {
      this._nulling();
      return;
    }
    Te = !1, Ue = !1, Ae = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), vt(this.cloneId), vt(this._dragStartId), this.nativeDraggable && (D(document, "drop", this), D(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), qe && m(document.body, "user-select", ""), m(u, "transform", ""), e && (We && (e.cancelable && e.preventDefault(), !t.dropBubble && e.stopPropagation()), _ && _.parentNode && _.parentNode.removeChild(_), ($ === O || H && H.lastPutMode !== "clone") && N && N.parentNode && N.parentNode.removeChild(N), u && (this.nativeDraggable && D(u, "dragend", this), ht(u), u.style["will-change"] = "", We && !Te && j(u, H ? H.options.ghostClass : this.options.ghostClass, !1), j(u, this.options.chosenClass, !1), Y({
      sortable: this,
      name: "unchoose",
      toEl: O,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: e
    }), $ !== O ? (z >= 0 && (Y({
      rootEl: O,
      name: "add",
      toEl: O,
      fromEl: $,
      originalEvent: e
    }), Y({
      sortable: this,
      name: "remove",
      toEl: O,
      originalEvent: e
    }), Y({
      rootEl: O,
      name: "sort",
      toEl: O,
      fromEl: $,
      originalEvent: e
    }), Y({
      sortable: this,
      name: "sort",
      toEl: O,
      originalEvent: e
    })), H && H.save()) : z !== Ee && z >= 0 && (Y({
      sortable: this,
      name: "update",
      toEl: O,
      originalEvent: e
    }), Y({
      sortable: this,
      name: "sort",
      toEl: O,
      originalEvent: e
    })), y.active && ((z == null || z === -1) && (z = Ee, ce = Le), Y({
      sortable: this,
      name: "end",
      toEl: O,
      originalEvent: e
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    U("nulling", this), $ = u = O = _ = _e = N = Ze = de = me = Q = We = z = ce = Ee = Le = Se = Pe = H = Ye = y.dragged = y.ghost = y.clone = y.active = null, nt.forEach(function(e) {
      e.checked = !0;
    }), nt.length = dt = ut = 0;
  },
  handleEvent: function(e) {
    switch (e.type) {
      case "drop":
      case "dragend":
        this._onDrop(e);
        break;
      case "dragenter":
      case "dragover":
        u && (this._onDragOver(e), wn(e));
        break;
      case "selectstart":
        e.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function() {
    let e = [], n, t = this.el.children, i = 0, o = t.length, a = this.options;
    for (; i < o; i++)
      n = t[i], ee(n, a.draggable, this.el, !1) && e.push(n.getAttribute(a.dataIdAttr) || Mn(n));
    return e;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(e, n) {
    let t = {}, i = this.el;
    this.toArray().forEach(function(o, a) {
      let r = i.children[a];
      ee(r, this.options.draggable, i, !1) && (t[o] = r);
    }, this), n && this.captureAnimationState(), e.forEach(function(o) {
      t[o] && (i.removeChild(t[o]), i.appendChild(t[o]));
    }), n && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function() {
    let e = this.options.store;
    e && e.set && e.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function(e, n) {
    return ee(e, n || this.options.draggable, this.el, !1);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function(e, n) {
    let t = this.options;
    if (n === void 0)
      return t[e];
    {
      let i = Xe.modifyOption(this, e, n);
      typeof i < "u" ? t[e] = i : t[e] = n, e === "group" && Ut(t);
    }
  },
  /**
   * Destroy
   */
  destroy: function() {
    U("destroy", this);
    let e = this.el;
    e[V] = null, D(e, "mousedown", this._onTapStart), D(e, "touchstart", this._onTapStart), D(e, "pointerdown", this._onTapStart), this.nativeDraggable && (D(e, "dragover", this), D(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(n) {
      n.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), tt.splice(tt.indexOf(this.el), 1), this.el = e = null;
  },
  _hideClone: function() {
    if (!de) {
      if (U("hideClone", this), y.eventCanceled) return;
      m(N, "display", "none"), this.options.removeCloneOnHide && N.parentNode && N.parentNode.removeChild(N), de = !0;
    }
  },
  _showClone: function(e) {
    if (e.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (de) {
      if (U("showClone", this), y.eventCanceled) return;
      u.parentNode == $ && !this.options.group.revertClone ? $.insertBefore(N, u) : _e ? $.insertBefore(N, _e) : $.appendChild(N), this.options.group.revertClone && this.animate(u, N), m(N, "display", ""), de = !1;
    }
  }
};
function wn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function je(e, n, t, i, o, a, r, s) {
  let l, c = e[V], p = c.options.onMove, h;
  return window.CustomEvent && !fe && !it ? l = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = n, l.from = e, l.dragged = t, l.draggedRect = i, l.related = o || n, l.relatedRect = a || A(n), l.willInsertAfter = s, l.originalEvent = r, e.dispatchEvent(l), p && (h = p.call(c, l, r)), h;
}
function ht(e) {
  e.draggable = !1;
}
function Sn() {
  mt = !1;
}
function Dn(e, n, t) {
  let i = A(Be(t.el, 0, t.options, !0));
  const o = Rt(t.el, t.options, _), a = 10;
  return n ? e.clientX < o.left - a || e.clientY < i.top && e.clientX < i.right : e.clientY < o.top - a || e.clientY < i.bottom && e.clientX < i.left;
}
function Tn(e, n, t) {
  const i = A(bt(t.el, t.options.draggable)), o = Rt(t.el, t.options, _), a = 10;
  return n ? e.clientX > o.right + a || e.clientY > i.bottom && e.clientX > i.left : e.clientY > o.bottom + a || e.clientX > i.right && e.clientY > i.top;
}
function En(e, n, t, i, o, a, r, s) {
  let l = i ? e.clientY : e.clientX, c = i ? t.height : t.width, p = i ? t.top : t.left, h = i ? t.bottom : t.right, w = !1;
  if (!r) {
    if (s && Ve < c * o) {
      if (!Ae && (Pe === 1 ? l > p + c * a / 2 : l < h - c * a / 2) && (Ae = !0), Ae)
        w = !0;
      else if (Pe === 1 ? l < p + Ve : l > h - Ve)
        return -Pe;
    } else if (l > p + c * (1 - o) / 2 && l < h - c * (1 - o) / 2)
      return xn(n);
  }
  return w = w || r, w && (l < p + c * a / 2 || l > h - c * a / 2) ? l > p + c / 2 ? 1 : -1 : 0;
}
function xn(e) {
  return J(u) < J(e) ? 1 : -1;
}
function Mn(e) {
  let n = e.tagName + e.className + e.src + e.href + e.textContent, t = n.length, i = 0;
  for (; t--; )
    i += n.charCodeAt(t);
  return i.toString(36);
}
function In(e) {
  nt.length = 0;
  let n = e.getElementsByTagName("input"), t = n.length;
  for (; t--; ) {
    let i = n[t];
    i.checked && nt.push(i);
  }
}
function Je(e) {
  return setTimeout(e, 0);
}
function vt(e) {
  return clearTimeout(e);
}
ot && T(document, "touchmove", function(e) {
  (y.active || Te) && e.cancelable && e.preventDefault();
});
y.utils = {
  on: T,
  off: D,
  css: m,
  find: Ht,
  is: function(e, n) {
    return !!ee(e, n, e, !1);
  },
  extend: fn,
  throttle: hn,
  closest: ee,
  toggleClass: j,
  clone: Xt,
  index: J,
  nextTick: Je,
  cancelNextTick: vt,
  detectDirection: Yt,
  getChild: Be,
  expando: V
};
y.get = function(e) {
  return e[V];
};
y.mount = function(...e) {
  e[0].constructor === Array && (e = e[0]), e.forEach((n) => {
    if (!n.prototype || !n.prototype.constructor)
      throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(n)}`;
    n.utils && (y.utils = { ...y.utils, ...n.utils }), Xe.mount(n);
  });
};
y.create = function(e, n) {
  return new y(e, n);
};
y.version = "1.15.6";
const $n = { class: "headWrapper" }, Nn = { class: "skillname" }, Wn = ["onClick"], On = ["onClick"], Ln = ["innerHTML"], Pn = {
  key: 0,
  class: "derivationBox"
}, An = ["onClick"], Bn = { class: "derivationBody" }, Hn = { class: "headWrapper" }, Xn = { class: "dskillname" }, Rn = ["onClick"], Fn = ["onClick"], Yn = ["innerHTML"], Un = {
  key: 1,
  class: "derivationBox derivationCardBox"
}, Gn = ["onClick"], jn = { class: "derivationBody" }, zn = { class: "cardText" }, qn = { class: "cardName" }, Zn = ["innerHTML"];
let De = null;
const Vn = () => {
  if (De) return De;
  De = /* @__PURE__ */ new Map();
  for (const e in q.card) {
    const n = q.card[e]?.skills;
    if (Array.isArray(n))
      for (const t of n)
        De.has(t) || De.set(t, e);
  }
  return De;
}, Jn = {
  __name: "SkillPanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = X(null);
    let i = null;
    const o = X([]), a = /* @__PURE__ */ new Map(), r = (f, k) => {
      k ? a.set(f, k) : a.delete(f);
    }, s = (f) => {
      const k = q.skill[f];
      if (typeof k?.frequent == "boolean")
        return q.config.autoskilllist.includes(f) ? !1 : k.frequent;
    }, l = (f) => {
      let k = te.skillInfoTranslation(f, void 0, !1);
      return q.translate[`${f}_append`] && (k += `<br>${te.translation(`${f}_append`)}`), k;
    }, c = (f) => {
      if (q.skill[f]?.equipSkill) {
        const k = Vn().get(f);
        return k ? { type: "card", id: k } : { type: "skill", id: f };
      }
      return q.card[f] ? { type: "card", id: f } : { type: "skill", id: f };
    }, p = () => {
      const f = te.character(n.name)?.skills || [], k = [];
      for (const v of f) {
        const I = s(v), E = {
          id: v,
          label: te.translation(v),
          frequent: I,
          auto: I,
          info: l(v),
          derivations: [],
          cards: [],
          //两块衍生区默认展开，点标题旁的按钮折叠
          foldDerivations: !1,
          foldCards: !1
        }, x = q.skill[v]?.derivation, L = Array.isArray(x) ? x : x ? [x] : [];
        for (const R of L) {
          const K = c(R);
          if (K.type === "card") {
            E.cards.push({ id: K.id, label: te.translation(K.id), info: l(K.id) });
            continue;
          }
          const se = s(R);
          E.derivations.push({ id: R, label: te.translation(R), frequent: se, auto: se, info: l(R) });
        }
        k.push(E);
      }
      return k;
    }, h = () => {
      for (const f of o.value)
        for (const k of f.cards) {
          const v = a.get(`${f.id}|${k.id}`);
          if (!v || v.hasChildNodes()) continue;
          const I = Ke.createCard(k.id);
          gt.create.buttons([I], "card", v, !0), I.remove();
        }
    };
    function w(f) {
      Ne.playSkillAudio(f, n.name);
    }
    function S(f) {
      f.auto = !f.auto, f.auto ? q.config.autoskilllist.remove(f.id) : q.config.autoskilllist.add(f.id), Ke.saveConfig("autoskilllist", q.config.autoskilllist);
    }
    return _t(async () => {
      o.value = p(), await Ot(), h(), i = new y(t.value, {
        draggable: ".skillWrapper",
        animation: 150,
        handle: ".dragHandle"
      });
    }), Qt(() => {
      i?.destroy?.(), i = null, a.clear();
    }), (f, k) => (g(), b("div", {
      ref_key: "listEl",
      ref: t,
      class: "skillList"
    }, [
      (g(!0), b(G, null, ne(o.value, (v, I) => (g(), b("div", {
        key: I,
        class: "skillWrapper"
      }, [
        d("div", $n, [
          k[0] || (k[0] = d("div", { class: "dragHandle" }, "≡", -1)),
          d("div", Nn, B(v.label), 1),
          d("div", {
            class: "audioBtn",
            onClick: (E) => w(v.id)
          }, null, 8, Wn),
          v.frequent !== void 0 ? (g(), b("div", {
            key: 0,
            class: Z(["autoSkill", v.auto ? "autoSkillOpened" : "autoSkillClosed"]),
            onClick: (E) => S(v)
          }, " 自动发动 ", 10, On)) : ie("", !0)
        ]),
        d("div", {
          class: "skillInfo",
          innerHTML: v.info
        }, null, 8, Ln),
        v.derivations.length ? (g(), b("div", Pn, [
          d("div", {
            class: Z(["derivationTitle", { derivationTitleFolded: v.foldDerivations }]),
            onClick: (E) => v.foldDerivations = !v.foldDerivations
          }, " 衍生技能 ", 10, An),
          kt(d("div", Bn, [
            (g(!0), b(G, null, ne(v.derivations, (E) => (g(), b("div", {
              key: E.id,
              class: "derivationItem"
            }, [
              d("div", Hn, [
                d("div", Xn, B(E.label), 1),
                d("div", {
                  class: "audioBtn",
                  onClick: (x) => w(v.id)
                }, null, 8, Rn),
                E.frequent !== void 0 ? (g(), b("div", {
                  key: 0,
                  class: Z(["autoSkill", E.auto ? "autoSkillOpened" : "autoSkillClosed"]),
                  onClick: (x) => S(E)
                }, " 自动发动 ", 10, Fn)) : ie("", !0)
              ]),
              d("div", {
                class: "derivationInfo",
                innerHTML: E.info
              }, null, 8, Yn)
            ]))), 128))
          ], 512), [
            [wt, !v.foldDerivations]
          ])
        ])) : ie("", !0),
        v.cards.length ? (g(), b("div", Un, [
          d("div", {
            class: Z(["derivationTitle", { derivationTitleFolded: v.foldCards }]),
            onClick: (E) => v.foldCards = !v.foldCards
          }, " 衍生卡牌 ", 10, Gn),
          kt(d("div", jn, [
            (g(!0), b(G, null, ne(v.cards, (E) => (g(), b("div", {
              key: E.id,
              class: "derivationCardItem"
            }, [
              d("div", {
                class: "derivationCards buttons",
                ref_for: !0,
                ref: (x) => r(v.id + "|" + E.id, x)
              }, null, 512),
              d("div", zn, [
                d("div", qn, B(E.label), 1),
                d("div", {
                  class: "derivationInfo",
                  innerHTML: E.info
                }, null, 8, Zn)
              ])
            ]))), 128))
          ], 512), [
            [wt, !v.foldCards]
          ])
        ])) : ie("", !0)
      ]))), 128))
    ], 512));
  }
}, Kn = /* @__PURE__ */ Me(Jn, [["__scopeId", "data-v-14e833c9"]]), Qn = { class: "skinList" }, ei = ["onClick"], ti = { class: "skinAvatorWrapper" }, ni = { class: "skinTextWrapper" }, ii = { class: "skinText" }, oi = {
  key: 0,
  class: "skinSelectedSJZX"
}, ai = {
  __name: "SkinPanel",
  props: { name: { type: String, required: !0 } },
  emits: ["skinChange"],
  setup(e, { emit: n }) {
    const t = e, i = n, o = P(() => {
      const s = ae.getCharacterSkin(t.name) || {};
      return Object.keys(s).map((l) => ({ name: l, path: s[l] }));
    }), a = X(ae.getCurentSkin(t.name));
    function r(s) {
      s.name !== a.value && ae.setCharacterSkin(t.name, s.name) && (a.value = s.name, i("skinChange", { skinName: s.name, path: s.path }));
    }
    return (s, l) => (g(), b("div", Qn, [
      (g(!0), b(G, null, ne(o.value, (c) => (g(), b("div", {
        key: c.name,
        class: Z(["skinListWrapper", { skinListSelectedWrapper: c.name === a.value }]),
        onClick: (p) => r(c)
      }, [
        d("div", ti, [
          d("div", {
            class: "imageSkin",
            style: ye({ backgroundImage: `url('${c.path}')` })
          }, null, 4)
        ]),
        d("div", ni, [
          d("div", ii, B(c.name), 1)
        ]),
        c.name === a.value ? (g(), b("div", oi)) : ie("", !0)
      ], 10, ei))), 128))
    ]));
  }
}, ri = /* @__PURE__ */ Me(ai, [["__scopeId", "data-v-7d4d9e46"]]), si = { class: "moduleList" }, li = ["onClick"], ci = { class: "modulesTitle" }, di = { class: "modulesInfoWrapper" }, ui = { class: "modulesInfo" }, fi = ["innerHTML"], hi = ["innerHTML"], pi = {
  key: 1,
  class: "modulesSelectedSJZX"
}, gi = {
  __name: "ModulePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = X(0), i = P(() => {
      t.value;
      const s = ze.getCharModules(n.name, !1) || {};
      return Object.keys(s).map((l) => {
        const c = s[l];
        return {
          id: l,
          name: c.name,
          url: c.url,
          intro: (Array.isArray(c.intro) ? c.intro : [c.intro]).filter(Boolean),
          effectIntro: r(c.effect?.intro)
        };
      });
    }), o = P(() => (t.value, ze.getCharModules(n.name)?.id));
    function a(s) {
      s !== o.value && (ze.setCharModules(n.name, s), t.value++, Lt.showToast("[驶舰之向] 更换模组后部分效果可能需要重启才能生效"));
    }
    function r(s) {
      return s ? (Array.isArray(s) ? s : [s]).map((c) => typeof c == "function" ? c() : c).join("<br>") : "";
    }
    return (s, l) => (g(), b("div", si, [
      (g(!0), b(G, null, ne(i.value, (c) => (g(), b("div", {
        key: c.id,
        class: Z(["charModulesWrapper", { modulesSelectedWrapper: c.id === o.value }]),
        onClick: (p) => a(c.id)
      }, [
        d("div", ci, B(c.name), 1),
        d("div", di, [
          d("div", {
            class: "modulesImage",
            style: ye({ backgroundImage: `url('${c.url}')` })
          }, null, 4),
          d("div", ui, [
            (g(!0), b(G, null, ne(c.intro, (p, h) => (g(), b("div", {
              key: h,
              class: "infoText",
              innerHTML: p
            }, null, 8, fi))), 128))
          ])
        ]),
        c.effectIntro ? (g(), b(G, { key: 0 }, [
          l[0] || (l[0] = d("div", { class: "modulesEffectTitle" }, "模组效果", -1)),
          d("div", {
            class: "modulesEffectInfo",
            innerHTML: c.effectIntro
          }, null, 8, hi)
        ], 64)) : ie("", !0),
        c.id === o.value ? (g(), b("div", pi)) : ie("", !0)
      ], 10, li))), 128))
    ]));
  }
}, mi = /* @__PURE__ */ Me(gi, [["__scopeId", "data-v-e86d65dc"]]), vi = { class: "charInfoWrapper" }, _i = ["innerHTML"], yi = {
  __name: "ResumePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = P(() => te.characterIntro(n.name) || "");
    return (i, o) => (g(), b("div", vi, [
      o[0] || (o[0] = d("div", { class: "charTitle" }, "干员档案", -1)),
      d("div", {
        class: "charInfo",
        innerHTML: t.value
      }, null, 8, _i)
    ]));
  }
}, bi = /* @__PURE__ */ Me(yi, [["__scopeId", "data-v-489a3cf2"]]), zt = "characterCardBackgroundSource", Ci = {
  featured: "精选",
  all: "全部"
};
function ki() {
  return Oe.config(zt) === "all" ? "all" : "featured";
}
const wi = { class: "backgroundPanel" }, Si = {
  key: 0,
  class: "backgroundLoading"
}, Di = {
  key: 1,
  class: "backgroundLoading"
}, Ti = { class: "backgroundList" }, Ei = ["onClick"], xi = ["src"], Mi = { class: "backgroundText" };
let pt = null;
const Ii = {
  __name: "BackgroundPanel",
  props: {
    /** 当前选中的背景值（`<scheme>:<相对路径>`） */
    value: { type: String, default: "" }
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const t = n, i = X([]), o = X(!0), a = { dir: "dybg:", prefix: "dybg:" }, r = {
      featured: [a],
      all: [a, { dir: "ui:background/", prefix: "ui:background/" }, { dir: "bg:", prefix: "bg:" }]
    };
    return _t(async () => {
      const s = ki();
      if (pt?.mode === s) {
        i.value = pt.list, o.value = !1;
        return;
      }
      try {
        const l = sn.getBackgroundData?.() || {}, c = [];
        for (const { dir: p, prefix: h } of r[s]) {
          const S = ((await le.getFileTree(p, 0))?.files || []).slice().sort((f, k) => f.name.localeCompare(k.name));
          for (const f of S) {
            const k = h + f.name, v = f.name.replace(/\.[^.]+$/, "");
            c.push({ value: k, url: le.compilePath(k), label: l[v] || v });
          }
        }
        pt = { mode: s, list: c }, i.value = c;
      } catch (l) {
        console.warn("[WhichWay] 读取武将卡背景列表失败：", l);
      } finally {
        o.value = !1;
      }
    }), (s, l) => (g(), b("div", wi, [
      l[0] || (l[0] = d("div", { class: "backgroundHint" }, "点击选择武将卡背景", -1)),
      o.value ? (g(), b("div", Si, "正在读取背景列表…")) : i.value.length ? ie("", !0) : (g(), b("div", Di, "没有找到可用的背景图片")),
      d("div", Ti, [
        (g(!0), b(G, null, ne(i.value, (c) => (g(), b("div", {
          key: c.value,
          class: Z(["backgroundItem", { backgroundSelected: c.value === e.value }]),
          onClick: (p) => t("select", c.value)
        }, [
          d("img", {
            class: "backgroundPreview",
            src: c.url,
            loading: "lazy",
            decoding: "async",
            fetchpriority: "low",
            alt: ""
          }, null, 8, xi),
          d("div", Mi, B(c.label), 1)
        ], 10, Ei))), 128))
      ])
    ]));
  }
}, $i = /* @__PURE__ */ Me(Ii, [["__scopeId", "data-v-d493a85a"]]), Ni = { class: "camplogo-wrapper" }, Wi = {
  key: 0,
  class: "group-text"
}, Oi = { class: "topMenu-wrapper" }, Li = { class: "imageBox" }, Pi = ["src"], Ai = ["onClick"], Bi = { class: "btn-enSJZX" }, Hi = { class: "btn-cnSJZX" }, Xi = { class: "btnImage-wrapper" }, Ri = ["src"], Fi = { class: "skinnameAudio-wrapper" }, Yi = { class: "skinnameWrapper" }, Ui = { class: "titleWrapper" }, Gi = { class: "imageWrapper" }, ji = ["src"], zi = { class: "textWrapper" }, qi = { class: "designerWrapper" }, Zi = { class: "titleWrapper" }, Vi = { class: "imageWrapper" }, Ji = ["src"], Ki = { class: "textWrapper" }, Qi = { class: "audioTitleWrapper" }, eo = { class: "imageWrapper" }, to = ["src"], no = { class: "textWrapper" }, io = ["src"], oo = { class: "content" }, ao = ["onClick"], ro = { class: "selectTextSJZX" }, so = { class: "charName-wrapper" }, lo = { class: "charNameTitleWrapper" }, co = ["innerHTML"], uo = { class: "charNameTextWrapper" }, fo = ["innerHTML"], ho = { class: "hpWrapper" }, po = { class: "hpNumWrapper" }, go = { class: "hpNumText" }, mo = {
  key: 0,
  class: "hpNumWrapper"
}, vo = { class: "hpNumText" }, _o = {
  key: 0,
  class: "charDycWrapper"
}, yo = {
  key: 1,
  class: "charImageWrapper"
}, bo = { class: "buttonText" }, Co = { class: "displayArenaSJZX" }, ko = {
  key: 2,
  class: "UseLLMTips-wrapper"
}, wo = { class: "LLM-wrapper" }, So = { class: "LLM-Icon" }, Do = ["src"], To = { class: "LLM-Text" }, Eo = "ui:background/default.png", xo = {
  __name: "CharacterCard",
  props: {
    /** 武将名（char id） */
    name: { type: String, required: !0 },
    /** 关闭回调：由 WhichWayCharacterCard 卸载应用并复原 */
    onClose: { type: Function, default: null }
  },
  setup(e) {
    const n = e, t = X(Oe.config("characterCardBackground") || Eo), i = X(t.value), o = P(() => le.compilePath(i.value)), a = X("skill"), r = (C) => le.compilePath(`ui:${C}`), s = (C) => le.compilePath(`logo:${C}`), l = P(() => {
      const C = nn(n.name), W = te.character(n.name), M = W?.whichWay?.arknight?.camp, Ie = on(W?.group, Oe.getCharExtConfig(n.name)?.reallyGroup, M), rt = M || Ie?.logo || Ie?.reallyGroup, Ct = Ie?.filter ?? !!rt;
      return rt ? { useFilter: Ct, logoUrl: `${le.extDir}image/camplogo/arknight/${rt}.png`, text: "" } : C ? { useFilter: Ct, logoUrl: `${le.extDir}image/camplogo/noname/name_${C}.png`, text: "" } : { useFilter: !1, logoUrl: "", text: q.translate[W?.group] || "" };
    }), c = P(() => q.characterTitle[n.name] || ""), p = P(() => te.translation(n.name)), h = P(() => {
      const { maxHp: C = 0, hp: W = 0, hujia: M = 0 } = te.character(n.name) || {};
      return { maxHp: C, hp: W, hujia: M };
    }), w = P(() => {
      const C = [
        { key: "resume", en: "QUIT", cn: "简介", image: "resume.png" },
        { key: "skill", en: "SKILL", cn: "技能", image: "skill.png" },
        { key: "skin", en: "SKIN", cn: "皮肤", image: "skin.png" }
      ];
      return ze.getCharModules(n.name, !1) && C.push({ key: "mode", en: "MODE", cn: "模组", image: "mode.png" }), C.push({ key: "background", en: "BG", cn: "背景", image: "back_switch.png" }), C;
    }), S = X(ae.getCurentSkin(n.name)), f = P(() => an(n.name).join("、")), k = X(null), v = X(null), I = X(ae.getCurrentSkinPath(n.name)), E = P(() => {
      const C = I.value;
      return { backgroundImage: C.startsWith("url") ? C : `url("${C}")` };
    }), x = X(!1), L = X(!1);
    function R() {
      const C = ae.getCurentSkin(n.name);
      x.value = !!ke.getSkinData(n.name, C), L.value = ke.isEnabledSkin(n.name, C);
    }
    const K = P(() => x.value && L.value && ke.needEnable()), se = P(() => K.value ? v.value : k.value);
    async function be() {
      await Ot(), se.value && await ke.updateDyc(n.name, se.value);
    }
    const oe = X(Ne.getCharacterLang(n.name)), Re = P(() => Ne.getCharacterAvailableLang(n.name) || []), he = P(() => Ne.getCharacterLang(n.name, !0)), pe = X(!0), ge = (C) => tn.getVoiceLangTranslation(C);
    async function Ce(C) {
      if (C !== oe.value) {
        if (!window.whichWaySave.hasChar(n.name)) {
          Lt.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
          return;
        }
        await Ne.setCustomAudio(n.name, C), oe.value = C;
      }
    }
    async function Fe({ skinName: C, path: W }) {
      S.value = C, I.value = ae.getCurrentSkinPath(n.name), R(), await be(), ae.refreshSkin();
    }
    function qt(C) {
      if (C === t.value) return;
      t.value = C, Oe.saveConfig("characterCardBackground", C);
      const W = new Image();
      W.decoding = "async", W.src = le.compilePath(C);
      const M = () => {
        t.value === C && (i.value = C);
      };
      W.decode().then(M, M);
    }
    async function Zt() {
      const C = ae.getCurentSkin(n.name);
      await ke.toggleDycSkin(n.name, C), R(), await be();
      for (const W of Ke.players)
        te.name(W) === n.name && await ke.updateDyc(n.name, W);
    }
    function Vt() {
      typeof n.onClose == "function" && n.onClose();
    }
    _t(async () => {
      R(), await be();
    });
    const at = P(() => rn(n.name)), Jt = P(() => at.value ?? "占位符"), Kt = P(() => {
      const C = at.value?.split("-")[0];
      return s((C || "deepseek") + ".png");
    });
    return (C, W) => (g(), b("div", {
      class: "container-CC-SJZX",
      style: ye({ backgroundImage: `url('${o.value}')` })
    }, [
      d("div", Ni, [
        d("div", {
          class: Z(["img-def", { arknightCamp: l.value.useFilter }]),
          style: ye(l.value.logoUrl ? { backgroundImage: `url('${l.value.logoUrl}')` } : null)
        }, [
          !l.value.logoUrl && l.value.text ? (g(), b("div", Wi, B(l.value.text), 1)) : ie("", !0)
        ], 6)
      ]),
      d("div", Oi, [
        d("div", {
          class: "btn-back",
          onClick: Vt
        }, [
          d("div", Li, [
            d("img", {
              src: r("back.png"),
              alt: ""
            }, null, 8, Pi)
          ])
        ]),
        (g(!0), b(G, null, ne(w.value, (M) => (g(), b("div", {
          key: M.key,
          class: Z(["btn-background", { "btn-selected-SJZX": a.value === M.key }]),
          onClick: (Ie) => a.value = M.key
        }, [
          d("div", Bi, B(M.en), 1),
          d("div", Hi, B(M.cn), 1),
          d("div", Xi, [
            d("img", {
              class: "btn-img",
              src: r(M.image),
              alt: ""
            }, null, 8, Ri)
          ])
        ], 10, Ai))), 128))
      ]),
      d("div", Fi, [
        d("div", Yi, [
          d("div", Ui, [
            d("div", Gi, [
              d("img", {
                src: r("painter.png"),
                alt: ""
              }, null, 8, ji)
            ]),
            d("div", zi, B(S.value), 1)
          ])
        ]),
        d("div", qi, [
          d("div", Zi, [
            d("div", Vi, [
              d("img", {
                class: "imageLimit",
                src: r("designer.png"),
                alt: ""
              }, null, 8, Ji)
            ]),
            d("div", Ki, B(f.value), 1)
          ])
        ]),
        d("div", {
          class: "audioWrapper",
          style: ye(pe.value ? null : { height: `${(Re.value.length + 1) * 50}px` })
        }, [
          d("div", Qi, [
            d("div", eo, [
              d("img", {
                src: r("cv.png"),
                alt: ""
              }, null, 8, to)
            ]),
            d("div", no, B(he.value), 1),
            d("div", {
              class: "collapseWrapper",
              onClick: W[0] || (W[0] = (M) => pe.value = !pe.value)
            }, [
              d("img", {
                src: r(pe.value ? "plus.png" : "sub.png"),
                style: { height: "50%" },
                alt: ""
              }, null, 8, io)
            ])
          ]),
          d("div", oo, [
            (g(!0), b(G, null, ne(Re.value, (M) => (g(), b("div", {
              key: M,
              class: "selectWrapper",
              onClick: (Ie) => Ce(M)
            }, [
              d("div", {
                class: Z(M === oe.value ? "choice" : "nochoice")
              }, null, 2),
              d("div", {
                class: Z(M === oe.value ? "choice-contentTextWrapper" : "nochoice-contentTextWrapper")
              }, [
                d("div", ro, B(ge(M)), 1)
              ], 2)
            ], 8, ao))), 128))
          ])
        ], 4)
      ]),
      d("div", so, [
        d("div", lo, [
          d("div", {
            class: "charNameTitle",
            innerHTML: c.value
          }, null, 8, co)
        ]),
        d("div", uo, [
          d("div", {
            class: "charNameText",
            innerHTML: p.value
          }, null, 8, fo)
        ]),
        d("div", ho, [
          h.value.maxHp + h.value.hujia > 6 ? (g(), b(G, { key: 0 }, [
            d("div", po, [
              W[1] || (W[1] = d("div", { class: "actualHpSJZX" }, null, -1)),
              d("div", go, B(h.value.hp) + "/" + B(h.value.maxHp), 1)
            ]),
            h.value.hujia > 0 ? (g(), b("div", mo, [
              W[2] || (W[2] = d("div", { class: "shieldSJZX" }, null, -1)),
              d("div", vo, B(h.value.hujia), 1)
            ])) : ie("", !0)
          ], 64)) : (g(), b(G, { key: 1 }, [
            (g(!0), b(G, null, ne(h.value.maxHp, (M) => (g(), b("div", {
              key: `hp${M}`,
              class: Z(M <= h.value.hp ? "actualHpSJZX" : "emptyHpSJZX")
            }, null, 2))), 128)),
            (g(!0), b(G, null, ne(h.value.hujia, (M) => (g(), b("div", {
              key: `shield${M}`,
              class: "shieldSJZX"
            }))), 128))
          ], 64))
        ])
      ]),
      K.value ? (g(), b("div", _o, [
        d("div", {
          ref_key: "charDycEl",
          ref: v,
          class: "charDyc"
        }, null, 512)
      ])) : (g(), b("div", yo, [
        d("div", {
          ref_key: "charImageEl",
          ref: k,
          class: "charImage",
          style: ye(E.value)
        }, null, 4)
      ])),
      d("div", {
        class: "charSkinBottomUIWrapper",
        style: ye({ display: x.value ? "" : "none" })
      }, [
        d("div", {
          class: Z(["buttonWrapper", { "buttonWrapper-enableSkinBG": L.value }]),
          onClick: Zt
        }, [
          d("div", bo, B(L.value ? "关闭动皮" : "开启动皮"), 1)
        ], 2)
      ], 4),
      d("div", Co, [
        a.value === "skill" ? (g(), $e(Kn, {
          key: 0,
          name: e.name
        }, null, 8, ["name"])) : a.value === "skin" ? (g(), $e(ri, {
          key: 1,
          name: e.name,
          onSkinChange: Fe
        }, null, 8, ["name"])) : a.value === "mode" ? (g(), $e(mi, {
          key: 2,
          name: e.name
        }, null, 8, ["name"])) : a.value === "background" ? (g(), $e($i, {
          key: 3,
          value: t.value,
          onSelect: qt
        }, null, 8, ["value"])) : (g(), $e(bi, {
          key: 4,
          name: e.name
        }, null, 8, ["name"]))
      ]),
      at.value ? (g(), b("div", ko, [
        d("div", wo, [
          d("div", So, [
            d("img", {
              src: Kt.value,
              alt: "",
              class: "imageLimit"
            }, null, 8, Do)
          ]),
          d("div", To, B(Jt.value), 1)
        ]),
        W[3] || (W[3] = d("div", { class: "LLM-Content" }, "技能代码由AI生成", -1))
      ])) : ie("", !0)
    ], 4));
  }
}, Mo = /* @__PURE__ */ Me(xo, [["__scopeId", "data-v-8407c024"]]), Wt = "enableWhichWayCharacterCardStyle";
class Io {
  /** 当前武将卡的 Vue 应用与挂载容器（同一时刻只会存在一张卡） */
  #e = null;
  #t = null;
  constructor() {
    ln({
      name: "whichWayCharacterCardStyleOverride_add",
      fn() {
        Object.defineProperty(gt.click, "charactercard", {
          value: gt.click.charactercard,
          writable: !0,
          configurable: !0,
          enumerable: !0
        }), dn.appendHook("ui.click.charactercard", {
          before: function(n, t, i, o, a, r) {
            if (He.shouldUseStyle(n))
              return He.create(n), !1;
          }
        });
      }
    }), St({
      name: "whichWayCharacterCardStyleConfig_add",
      priority: 770,
      obj: {
        name: Wt,
        options: {
          name: "启用驶舰之向武将卡样式",
          intro: "选择哪些武将使用驶舰之向的武将卡样式（关闭 / 仅驶舰之向角色 / 所有角色）",
          init: "whichWay",
          item: {
            off: "关闭",
            whichWay: "扩展角色",
            all: "所有角色"
          }
        }
      }
    }), St({
      name: "whichWayCharacterCardBackgroundSourceConfig_add",
      priority: 769,
      obj: {
        name: zt,
        options: {
          name: "武将卡背景来源",
          intro: "武将卡「背景」面板扫描哪些目录（精选：仅 dynamicSkin/background，省性能；全部：再加上 image/background 与 image/ui/background）",
          init: "featured",
          item: Ci
        }
      }
    });
  }
  /**
   * 当前样式模式。
   *
   * 兼容旧版本的布尔配置：旧版本这个选项是开关（`true` / `false`），
   * 老存档里存的就是布尔值 —— `true` 视为「所有角色」（旧版开启后对所有武将生效）、`false` 视为「关闭」。
   */
  getStyleMode() {
    const n = Oe.config(Wt);
    return n === !0 ? "all" : n === !1 ? "off" : n === "off" || n === "whichWay" || n === "all" ? n : "whichWay";
  }
  /** 该武将是否应使用驶舰之向武将卡样式 */
  shouldUseStyle(n) {
    const t = this.getStyleMode();
    return t === "off" ? !1 : t === "all" ? !0 : window.whichWaySave.hasChar(n);
  }
  /**
   * 打开某位武将的武将卡。
   *
   * 额外参数（`sourcenode` / `noedit` / `resume` / `avatar` / `audioName`）是引擎 `ui.click.charactercard`
   * 的原始入参，本实现用不到，保留形参只是为了让劫持处的调用签名保持兼容。
   */
  async create(n, t, i, o, a, r) {
    this.#e && this.close();
    const s = document.createElement("div");
    Object.assign(s.style, {
      //用 fixed 而不是 absolute：fixed 的包含块一定是视口，不受 body/html 高度定义的影响，
      //这样 100%×100% 必定等于整屏（absolute 一旦碰上高度为 auto 的定位祖先就会塌成 0）
      position: "fixed",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      zIndex: "20"
    }), document.body.appendChild(s);
    const l = en(Mo, {
      name: n,
      onClose: () => this.close()
    });
    l.mount(s), this.#e = l, this.#t = s;
  }
  /** 关闭武将卡：卸载 Vue 应用、移除容器，并让场上玩家头像与动皮同步 */
  close() {
    this.#e?.unmount(), this.#e = null, this.#t?.remove(), this.#t = null, ae.refreshSkin(), Ke.resume2();
  }
}
const He = new Io();
cn({
  name: "whichwayCharacterCard_dev",
  fn: () => {
    window.whichWayCharacterCard = He;
  }
});
window.whichWay.register("characterCard", He);
const Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayCharacterCard: He
}, Symbol.toStringTag, { value: "Module" }));
export {
  mi as M,
  Go as i,
  He as w
};
