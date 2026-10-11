import { get as te, lib as q, game as Ve, ui as pt } from "noname";
import { ref as F, onMounted as vt, nextTick as qt, onBeforeUnmount as Zt, openBlock as m, createElementBlock as b, Fragment as G, renderList as ne, createElementVNode as d, toDisplayString as A, normalizeClass as Z, createCommentVNode as ie, withDirectives as Ct, vShow as kt, computed as X, normalizeStyle as be, createBlock as $e, createApp as Vt } from "vue";
import { whichWayFile as re } from "./file.js";
import { whichWayUtil as Oe } from "./utill.js";
import { w as oe, s as me } from "./skin-confOverride-shared.js";
import { whichWayAudio as Ne } from "./audio.js";
import { whichWayToast as Wt } from "./toast.js";
import { whichWayArknight as Jt } from "./arknight.js";
import { whichWayCharacterModules as Ge } from "./modules.js";
import { b as Kt, c as Qt, g as en, e as tn } from "./packs-base-characterDesigner-shared.js";
import { _ as Me } from "./_plugin-vue_export-helper.js";
import { w as nn } from "./config-data-shared.js";
import { onContent as on, onConfig as wt, onSetDev as an } from "./hooks.js";
import { whichWayAPIOverride as rn } from "./override.js";
function ae(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
const de = ae(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), nt = ae(/Edge/i), St = ae(/firefox/i), je = ae(/safari/i) && !ae(/chrome/i) && !ae(/android/i), _t = ae(/iP(ad|od|hone)/i), Ot = ae(/chrome/i) && ae(/android/i), Lt = {
  capture: !1,
  passive: !1
};
function T(e, n, t) {
  e.addEventListener(n, t, !de && Lt);
}
function D(e, n, t) {
  e.removeEventListener(n, t, !de && Lt);
}
function Je(e, n) {
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
function Pt(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode;
}
function ee(e, n, t, i) {
  if (e) {
    t = t || document;
    do {
      if (n != null && (n[0] === ">" ? e.parentNode === t && Je(e, n) : Je(e, n)) || i && e === t)
        return e;
      if (e === t) break;
    } while (e = Pt(e));
  }
  return null;
}
const Dt = /\s+/g;
function j(e, n, t) {
  if (e && n)
    if (e.classList)
      e.classList[t ? "add" : "remove"](n);
    else {
      let i = (" " + e.className + " ").replace(Dt, " ").replace(" " + n + " ", " ");
      e.className = (i + (t ? " " + n : "")).replace(Dt, " ");
    }
}
function g(e, n, t) {
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
      let o = g(e, "transform");
      o && o !== "none" && (t = o + " " + t);
    } while (!n && (e = e.parentNode));
  const i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return i && new i(t);
}
function At(e, n, t) {
  if (e) {
    let i = e.getElementsByTagName(n), o = 0, a = i.length;
    if (t)
      for (; o < a; o++)
        t(i[o], o);
    return i;
  }
  return [];
}
function ce() {
  let e = document.scrollingElement;
  return e || document.documentElement;
}
function L(e, n, t, i, o) {
  if (!e.getBoundingClientRect && e !== window) return;
  let a, r, s, l, c, p, h;
  if (e !== window && e.parentNode && e !== ce() ? (a = e.getBoundingClientRect(), r = a.top, s = a.left, l = a.bottom, c = a.right, p = a.height, h = a.width) : (r = 0, s = 0, l = window.innerHeight, c = window.innerWidth, p = window.innerHeight, h = window.innerWidth), (n || t) && e !== window && (o = o || e.parentNode, !de))
    do
      if (o && o.getBoundingClientRect && (g(o, "transform") !== "none" || t && g(o, "position") !== "static")) {
        let w = o.getBoundingClientRect();
        r -= w.top + parseInt(g(o, "border-top-width")), s -= w.left + parseInt(g(o, "border-left-width")), l = r + a.height, c = s + a.width;
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
function Tt(e, n, t) {
  let i = xt(e, !0), o = L(e)[n];
  for (; i; ) {
    let a = L(i)[t], r;
    if (r = o >= a, !r) return i;
    if (i === ce()) break;
    i = xt(i, !1);
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
function yt(e, n) {
  let t = e.lastElementChild;
  for (; t && (t === y.ghost || g(t, "display") === "none" || n && !Je(t, n)); )
    t = t.previousElementSibling;
  return t || null;
}
function J(e, n) {
  let t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== y.clone && (!n || Je(e, n)) && t++;
  return t;
}
function Et(e) {
  let n = 0, t = 0, i = ce();
  if (e)
    do {
      let o = xe(e), a = o.a, r = o.d;
      n += e.scrollLeft * a, t += e.scrollTop * r;
    } while (e !== i && (e = e.parentNode));
  return [n, t];
}
function sn(e, n) {
  for (let t in e)
    if (e.hasOwnProperty(t)) {
      for (let i in n)
        if (n.hasOwnProperty(i) && n[i] === e[t][i]) return Number(t);
    }
  return -1;
}
function xt(e, n) {
  if (!e || !e.getBoundingClientRect) return ce();
  let t = e, i = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      let o = g(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return ce();
        if (i || n) return t;
        i = !0;
      }
    }
  while (t = t.parentNode);
  return ce();
}
function ln(e, n) {
  if (e && n)
    for (let t in n)
      n.hasOwnProperty(t) && (e[t] = n[t]);
  return e;
}
function rt(e, n) {
  return Math.round(e.top) === Math.round(n.top) && Math.round(e.left) === Math.round(n.left) && Math.round(e.height) === Math.round(n.height) && Math.round(e.width) === Math.round(n.width);
}
let st;
function cn(e, n) {
  return function() {
    if (!st) {
      let t = arguments, i = this;
      t.length === 1 ? e.call(i, t[0]) : e.apply(i, t), st = setTimeout(function() {
        st = void 0;
      }, n);
    }
  };
}
function dn(e, n, t) {
  e.scrollLeft += n, e.scrollTop += t;
}
function Bt(e) {
  let n = window.Polymer, t = window.jQuery || window.Zepto;
  return n && n.dom ? n.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Ht(e, n, t) {
  const i = {};
  return Array.from(e.children).forEach((o) => {
    if (!ee(o, n.draggable, e, !1) || o.animated || o === t) return;
    const a = L(o);
    i.left = Math.min(i.left ?? 1 / 0, a.left), i.top = Math.min(i.top ?? 1 / 0, a.top), i.right = Math.max(i.right ?? -1 / 0, a.right), i.bottom = Math.max(i.bottom ?? -1 / 0, a.bottom);
  }), i.width = i.right - i.left, i.height = i.bottom - i.top, i.x = i.left, i.y = i.top, i;
}
const V = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function un() {
  let e = [], n;
  return {
    captureAnimationState() {
      if (e = [], !this.options.animation) return;
      [].slice.call(this.el.children).forEach((i) => {
        if (g(i, "display") === "none" || i === y.ghost) return;
        e.push({
          target: i,
          rect: L(i)
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
      e.splice(sn(e, { target: t }), 1);
    },
    animateAll(t) {
      if (!this.options.animation) {
        clearTimeout(n), typeof t == "function" && t();
        return;
      }
      let i = !1, o = 0;
      e.forEach((a) => {
        let r = 0, s = a.target, l = s.fromRect, c = L(s), p = s.prevFromRect, h = s.prevToRect, w = a.rect, S = xe(s, !0);
        S && (c.top -= S.f, c.left -= S.e), s.toRect = c, s.thisAnimationDuration && rt(p, c) && !rt(l, c) && // Make sure animatingRect is on line between toRect & fromRect
        (w.top - c.top) / (w.left - c.left) === (l.top - c.top) / (l.left - c.left) && (r = hn(w, p, h, this.options)), rt(c, l) || (s.prevFromRect = l, s.prevToRect = c, r || (r = this.options.animation), this.animate(
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
        g(t, "transition", ""), g(t, "transform", "");
        let r = xe(this.el), s = r && r.a, l = r && r.d, c = (i.left - o.left) / (s || 1), p = (i.top - o.top) / (l || 1);
        t.animatingX = !!c, t.animatingY = !!p, g(t, "transform", "translate3d(" + c + "px," + p + "px,0)"), this.forRepaintDummy = fn(t), g(t, "transition", "transform " + a + "ms" + (this.options.easing ? " " + this.options.easing : "")), g(t, "transform", "translate3d(0,0,0)"), typeof t.animated == "number" && clearTimeout(t.animated), t.animated = setTimeout(function() {
          g(t, "transition", ""), g(t, "transform", ""), t.animated = !1, t.animatingX = !1, t.animatingY = !1;
        }, a);
      }
    }
  };
}
function fn(e) {
  return e.offsetWidth;
}
function hn(e, n, t, i) {
  return Math.sqrt(Math.pow(n.top - e.top, 2) + Math.pow(n.left - e.left, 2)) / Math.sqrt(Math.pow(n.top - t.top, 2) + Math.pow(n.left - t.left, 2)) * i.animation;
}
let we = [];
const lt = {
  initializeByDefault: !0
}, He = {
  mount(e) {
    for (let n in lt)
      lt.hasOwnProperty(n) && !(n in e) && (e[n] = lt[n]);
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
function pn({
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
  let f, C = e.options, v = "on" + t.charAt(0).toUpperCase() + t.substr(1);
  window.CustomEvent && !de && !nt ? f = new CustomEvent(t, {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent(t, !0, !0)), f.to = a || n, f.from = r || n, f.item = i || n, f.clone = o, f.oldIndex = s, f.newIndex = l, f.oldDraggableIndex = c, f.newDraggableIndex = p, f.originalEvent = h, f.pullMode = w ? w.lastPutMode : void 0;
  let $ = { ...S, ...He.getEventProperties(t, e) };
  for (let E in $)
    f[E] = $[E];
  n && n.dispatchEvent(f), C[v] && C[v].call(e, f);
}
let U = function(e, n, { evt: t, ...i } = {}) {
  He.pluginEvent.bind(y)(e, n, {
    dragEl: u,
    parentEl: O,
    ghostEl: _,
    rootEl: I,
    nextEl: ye,
    lastDownEl: ze,
    cloneEl: N,
    cloneHidden: le,
    dragStarted: We,
    putSortable: H,
    activeSortable: y.active,
    originalEvent: t,
    oldIndex: Ee,
    oldDraggableIndex: Le,
    newIndex: z,
    newDraggableIndex: se,
    hideGhostForTarget: Yt,
    unhideGhostForTarget: Ut,
    cloneNowHidden() {
      le = !0;
    },
    cloneNowShown() {
      le = !1;
    },
    dispatchSortableEvent(o) {
      Y({ sortable: n, name: o, originalEvent: t });
    },
    ...i
  });
};
function Y(e) {
  pn({
    putSortable: H,
    cloneEl: N,
    targetEl: u,
    rootEl: I,
    oldIndex: Ee,
    oldDraggableIndex: Le,
    newIndex: z,
    newDraggableIndex: se,
    ...e
  });
}
let u, O, _, I, ye, ze, N, le, Ee, z, Le, se, Re, H, Te = !1, Ke = !1, Qe = [], ve, Q, ct, dt, Mt, It, We, Se, Pe, Ae = !1, Fe = !1, qe, R, ut = [], gt = !1, et = [];
const it = typeof document < "u", Ye = _t, $t = nt || de ? "cssFloat" : "float", gn = it && !Ot && !_t && "draggable" in document.createElement("div"), Xt = (function() {
  if (!it) return;
  if (de)
    return !1;
  let e = document.createElement("x");
  return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
})(), Rt = function(e, n) {
  let t = g(e), i = parseInt(t.width) - parseInt(t.paddingLeft) - parseInt(t.paddingRight) - parseInt(t.borderLeftWidth) - parseInt(t.borderRightWidth), o = Be(e, 0, n), a = Be(e, 1, n), r = o && g(o), s = a && g(a), l = r && parseInt(r.marginLeft) + parseInt(r.marginRight) + L(o).width, c = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + L(a).width;
  if (t.display === "flex")
    return t.flexDirection === "column" || t.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (t.display === "grid")
    return t.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (o && r.float && r.float !== "none") {
    let p = r.float === "left" ? "left" : "right";
    return a && (s.clear === "both" || s.clear === p) ? "vertical" : "horizontal";
  }
  return o && (r.display === "block" || r.display === "flex" || r.display === "table" || r.display === "grid" || l >= i && t[$t] === "none" || a && t[$t] === "none" && l + c > i) ? "vertical" : "horizontal";
}, mn = function(e, n, t) {
  let i = t ? e.left : e.top, o = t ? e.right : e.bottom, a = t ? e.width : e.height, r = t ? n.left : n.top, s = t ? n.right : n.bottom, l = t ? n.width : n.height;
  return i === r || o === s || i + a / 2 === r + l / 2;
}, vn = function(e, n) {
  let t;
  return Qe.some((i) => {
    const o = i[V].options.emptyInsertThreshold;
    if (!o || yt(i)) return;
    const a = L(i), r = e >= a.left - o && e <= a.right + o, s = n >= a.top - o && n <= a.bottom + o;
    if (r && s)
      return t = i;
  }), t;
}, Ft = function(e) {
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
}, Yt = function() {
  !Xt && _ && g(_, "display", "none");
}, Ut = function() {
  !Xt && _ && g(_, "display", "");
};
it && !Ot && document.addEventListener("click", function(e) {
  if (Ke)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Ke = !1, !1;
}, !0);
let _e = function(e) {
  if (u) {
    e = e.touches ? e.touches[0] : e;
    let n = vn(e.clientX, e.clientY);
    if (n) {
      let t = {};
      for (let i in e)
        e.hasOwnProperty(i) && (t[i] = e[i]);
      t.target = t.rootEl = n, t.preventDefault = void 0, t.stopPropagation = void 0, n[V]._onDragOver(t);
    }
  }
}, _n = function(e) {
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
      return Rt(e, this.options);
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
    supportPointer: y.supportPointer !== !1 && "PointerEvent" in window && (!je || _t),
    emptyInsertThreshold: 5
  };
  He.initializePlugins(this, e, t);
  for (let i in t)
    !(i in n) && (n[i] = t[i]);
  Ft(n);
  for (let i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = n.forceFallback ? !1 : gn, this.nativeDraggable && (this.options.touchStartThreshold = 1), n.supportPointer ? T(e, "pointerdown", this._onTapStart) : (T(e, "mousedown", this._onTapStart), T(e, "touchstart", this._onTapStart)), this.nativeDraggable && (T(e, "dragover", this), T(e, "dragenter", this)), Qe.push(this.el), n.store && n.store.get && this.sort(n.store.get(this) || []), Object.assign(this, un());
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
    if (Tn(t), !u && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || i.disabled) && !l.isContentEditable && !(!this.nativeDraggable && je && s && s.tagName.toUpperCase() === "SELECT") && (s = ee(s, i.draggable, t, !1), !(s && s.animated) && ze !== s)) {
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
      let l = L(t);
      if (I = o, u = t, O = u.parentNode, ye = u.nextSibling, ze = t, Re = a.group, y.dragged = u, ve = {
        target: u,
        clientX: (n || e).clientX,
        clientY: (n || e).clientY
      }, Mt = ve.clientX - l.left, It = ve.clientY - l.top, this._lastX = (n || e).clientX, this._lastY = (n || e).clientY, u.style["will-change"] = "all", s = function() {
        if (U("delayEnded", i, { evt: e }), y.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !St && i.nativeDraggable && (u.draggable = !0), i._triggerDragStart(e, n), Y({
          sortable: i,
          name: "choose",
          originalEvent: e
        }), j(u, a.chosenClass, !0);
      }, a.ignore.split(",").forEach(function(c) {
        At(u, c.trim(), ft);
      }), T(r, "dragover", _e), T(r, "mousemove", _e), T(r, "touchmove", _e), a.supportPointer ? (T(r, "pointerup", i._onDrop), !this.nativeDraggable && T(r, "pointercancel", i._onDrop)) : (T(r, "mouseup", i._onDrop), T(r, "touchend", i._onDrop), T(r, "touchcancel", i._onDrop)), St && this.nativeDraggable && (this.options.touchStartThreshold = 4, u.draggable = !0), U("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || n) && (!this.nativeDraggable || !(nt || de))) {
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
    u && ft(u), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    let e = this.el.ownerDocument;
    D(e, "mouseup", this._disableDelayedDrag), D(e, "touchend", this._disableDelayedDrag), D(e, "touchcancel", this._disableDelayedDrag), D(e, "pointerup", this._disableDelayedDrag), D(e, "pointercancel", this._disableDelayedDrag), D(e, "mousemove", this._delayedDragTouchMoveHandler), D(e, "touchmove", this._delayedDragTouchMoveHandler), D(e, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(e, n) {
    n = n || e.pointerType == "touch" && e, !this.nativeDraggable || n ? this.options.supportPointer ? T(document, "pointermove", this._onTouchMove) : n ? T(document, "touchmove", this._onTouchMove) : T(document, "mousemove", this._onTouchMove) : (T(u, "dragend", this), T(I, "dragstart", this._onDragStart));
    try {
      document.selection ? Ze(() => {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(e, n) {
    if (Te = !1, I && u) {
      U("dragStarted", this, { evt: n }), this.nativeDraggable && T(document, "dragover", _n);
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
      this._lastX = Q.clientX, this._lastY = Q.clientY, Yt();
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
        } while (n = Pt(n));
      Ut();
    }
  },
  _onTouchMove: function(e) {
    if (ve) {
      let n = this.options, t = n.fallbackTolerance, i = n.fallbackOffset, o = e.touches ? e.touches[0] : e, a = _ && xe(_, !0), r = _ && a && a.a, s = _ && a && a.d, l = Ye && R && Et(R), c = (o.clientX - ve.clientX + i.x) / (r || 1) + (l ? l[0] - ut[0] : 0) / (r || 1), p = (o.clientY - ve.clientY + i.y) / (s || 1) + (l ? l[1] - ut[1] : 0) / (s || 1);
      if (!y.active && !Te) {
        if (t && Math.max(Math.abs(o.clientX - this._lastX), Math.abs(o.clientY - this._lastY)) < t)
          return;
        this._onDragStart(e, !0);
      }
      if (_) {
        a ? (a.e += c - (ct || 0), a.f += p - (dt || 0)) : a = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: p
        };
        let h = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
        g(_, "webkitTransform", h), g(_, "mozTransform", h), g(_, "msTransform", h), g(_, "transform", h), ct = c, dt = p, Q = o;
      }
      e.cancelable && e.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!_) {
      let e = this.options.fallbackOnBody ? document.body : I, n = L(u, !0, Ye, !0, e), t = this.options;
      if (Ye) {
        for (R = e; g(R, "position") === "static" && g(R, "transform") === "none" && R !== document; )
          R = R.parentNode;
        R !== document.body && R !== document.documentElement ? (R === document && (R = ce()), n.top += R.scrollTop, n.left += R.scrollLeft) : R = ce(), ut = Et(R);
      }
      _ = u.cloneNode(!0), j(_, t.ghostClass, !1), j(_, t.fallbackClass, !0), j(_, t.dragClass, !0), g(_, "transition", ""), g(_, "transform", ""), g(_, "box-sizing", "border-box"), g(_, "margin", 0), g(_, "top", n.top), g(_, "left", n.left), g(_, "width", n.width), g(_, "height", n.height), g(_, "opacity", "0.8"), g(_, "position", Ye ? "absolute" : "fixed"), g(_, "zIndex", "100000"), g(_, "pointerEvents", "none"), y.ghost = _, e.appendChild(_), g(_, "transform-origin", Mt / parseInt(_.style.width) * 100 + "% " + It / parseInt(_.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(e, n) {
    let t = this, i = e.dataTransfer, o = t.options;
    if (U("dragStart", this, { evt: e }), y.eventCanceled) {
      this._onDrop();
      return;
    }
    U("setupClone", this), y.eventCanceled || (N = Bt(u), N.removeAttribute("id"), N.draggable = !1, N.style["will-change"] = "", this._hideClone(), j(N, this.options.chosenClass, !1), y.clone = N), t.cloneId = Ze(function() {
      U("clone", t), !y.eventCanceled && (t.options.removeCloneOnHide || I.insertBefore(N, u), t._hideClone(), Y({
        sortable: t,
        name: "clone"
      }));
    }), !n && j(u, o.dragClass, !0), n ? (Ke = !0, t._loopId = setInterval(t._emulateDragOver, 50)) : (D(document, "mouseup", t._onDrop), D(document, "touchend", t._onDrop), D(document, "touchcancel", t._onDrop), i && (i.effectAllowed = "move", o.setData && o.setData.call(t, i, u)), T(document, "drop", t), g(u, "transform", "translateZ(0)")), Te = !0, t._dragStartId = Ze(t._dragStarted.bind(t, n, e)), T(document, "selectstart", t), We = !0, window.getSelection().removeAllRanges(), je && g(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(e) {
    let n = this.el, t = e.target, i, o, a, r = this.options, s = r.group, l = y.active, c = Re === s, p = r.sort, h = H || l, w, S = this, f = !1;
    if (gt) return;
    function C(x, P) {
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
        completed: $,
        onMove(B, K) {
          return Ue(I, n, u, i, B, L(B), e, K);
        },
        changed: E,
        ...P
      });
    }
    function v() {
      C("dragOverAnimationCapture"), S.captureAnimationState(), S !== h && h.captureAnimationState();
    }
    function $(x) {
      return C("dragOverCompleted", { insertion: x }), x && (c ? l._hideClone() : l._showClone(S), S !== h && (j(u, H ? H.options.ghostClass : l.options.ghostClass, !1), j(u, r.ghostClass, !0)), H !== S && S !== y.active ? H = S : S === y.active && H && (H = null), h === S && (S._ignoreWhileAnimating = t), S.animateAll(function() {
        C("dragOverAnimationComplete"), S._ignoreWhileAnimating = null;
      }), S !== h && (h.animateAll(), h._ignoreWhileAnimating = null)), (t === u && !u.animated || t === n && !t.animated) && (Se = null), !r.dragoverBubble && !e.rootEl && t !== document && (u.parentNode[V]._isOutsideThisEl(e.target), !x && _e(e)), !r.dragoverBubble && e.stopPropagation && e.stopPropagation(), f = !0;
    }
    function E() {
      z = J(u), se = J(u, r.draggable), Y({
        sortable: S,
        name: "change",
        toEl: n,
        newIndex: z,
        newDraggableIndex: se,
        originalEvent: e
      });
    }
    if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), t = ee(t, r.draggable, n, !0), C("dragOver"), y.eventCanceled) return f;
    if (u.contains(e.target) || t.animated && t.animatingX && t.animatingY || S._ignoreWhileAnimating === t)
      return $(!1);
    if (Ke = !1, l && !r.disabled && (c ? p || (a = O !== I) : H === this || (this.lastPutMode = Re.checkPull(this, l, u, e)) && s.checkPut(this, l, u, e))) {
      if (w = this._getDirection(e, t) === "vertical", i = L(u), C("dragOverValid"), y.eventCanceled) return f;
      if (a)
        return O = I, v(), this._hideClone(), C("revert"), y.eventCanceled || (ye ? I.insertBefore(u, ye) : I.appendChild(u)), $(!0);
      let x = yt(n, r.draggable);
      if (!x || kn(e, w, this) && !x.animated) {
        if (x === u)
          return $(!1);
        if (x && n === e.target && (t = x), t && (o = L(t)), Ue(I, n, u, i, t, o, e, !!t) !== !1)
          return v(), x && x.nextSibling ? n.insertBefore(u, x.nextSibling) : n.appendChild(u), O = n, E(), $(!0);
      } else if (x && Cn(e, w, this)) {
        let P = Be(n, 0, r, !0);
        if (P === u)
          return $(!1);
        if (t = P, o = L(t), Ue(I, n, u, i, t, o, e, !1) !== !1)
          return v(), n.insertBefore(u, P), O = n, E(), $(!0);
      } else if (t.parentNode === n) {
        o = L(t);
        let P = 0, B, K = u.parentNode !== n, ue = !mn(u.animated && u.toRect || i, t.animated && t.toRect || o, w), fe = w ? "top" : "left", he = Tt(t, "top", "top") || Tt(u, "top", "top"), ot = he ? he.scrollTop : void 0;
        Se !== t && (B = o[fe], Ae = !1, Fe = !ue && r.invertSwap || K), P = wn(
          e,
          t,
          o,
          w,
          ue ? 1 : r.swapThreshold,
          r.invertedSwapThreshold == null ? r.swapThreshold : r.invertedSwapThreshold,
          Fe,
          Se === t
        );
        let pe;
        if (P !== 0) {
          let ke = J(u);
          do
            ke -= P, pe = O.children[ke];
          while (pe && (g(pe, "display") === "none" || pe === _));
        }
        if (P === 0 || pe === t)
          return $(!1);
        Se = t, Pe = P;
        let Xe = t.nextElementSibling, ge = !1;
        ge = P === 1;
        let Ce = Ue(I, n, u, i, t, o, e, ge);
        if (Ce !== !1)
          return (Ce === 1 || Ce === -1) && (ge = Ce === 1), gt = !0, setTimeout(bn, 30), v(), ge && !Xe ? n.appendChild(u) : t.parentNode.insertBefore(u, ge ? Xe : t), he && dn(he, 0, ot - he.scrollTop), O = u.parentNode, B !== void 0 && !Fe && (qe = Math.abs(B - L(t)[fe])), E(), $(!0);
      }
      if (n.contains(u))
        return $(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    D(document, "mousemove", this._onTouchMove), D(document, "touchmove", this._onTouchMove), D(document, "pointermove", this._onTouchMove), D(document, "dragover", _e), D(document, "mousemove", _e), D(document, "touchmove", _e);
  },
  _offUpEvents: function() {
    let e = this.el.ownerDocument;
    D(e, "mouseup", this._onDrop), D(e, "touchend", this._onDrop), D(e, "pointerup", this._onDrop), D(e, "pointercancel", this._onDrop), D(e, "touchcancel", this._onDrop), D(document, "selectstart", this);
  },
  _onDrop: function(e) {
    let n = this.el, t = this.options;
    if (z = J(u), se = J(u, t.draggable), U("drop", this, {
      evt: e
    }), O = u && u.parentNode, z = J(u), se = J(u, t.draggable), y.eventCanceled) {
      this._nulling();
      return;
    }
    Te = !1, Fe = !1, Ae = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), mt(this.cloneId), mt(this._dragStartId), this.nativeDraggable && (D(document, "drop", this), D(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), je && g(document.body, "user-select", ""), g(u, "transform", ""), e && (We && (e.cancelable && e.preventDefault(), !t.dropBubble && e.stopPropagation()), _ && _.parentNode && _.parentNode.removeChild(_), (I === O || H && H.lastPutMode !== "clone") && N && N.parentNode && N.parentNode.removeChild(N), u && (this.nativeDraggable && D(u, "dragend", this), ft(u), u.style["will-change"] = "", We && !Te && j(u, H ? H.options.ghostClass : this.options.ghostClass, !1), j(u, this.options.chosenClass, !1), Y({
      sortable: this,
      name: "unchoose",
      toEl: O,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: e
    }), I !== O ? (z >= 0 && (Y({
      rootEl: O,
      name: "add",
      toEl: O,
      fromEl: I,
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
      fromEl: I,
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
    })), y.active && ((z == null || z === -1) && (z = Ee, se = Le), Y({
      sortable: this,
      name: "end",
      toEl: O,
      originalEvent: e
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    U("nulling", this), I = u = O = _ = ye = N = ze = le = ve = Q = We = z = se = Ee = Le = Se = Pe = H = Re = y.dragged = y.ghost = y.clone = y.active = null, et.forEach(function(e) {
      e.checked = !0;
    }), et.length = ct = dt = 0;
  },
  handleEvent: function(e) {
    switch (e.type) {
      case "drop":
      case "dragend":
        this._onDrop(e);
        break;
      case "dragenter":
      case "dragover":
        u && (this._onDragOver(e), yn(e));
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
      n = t[i], ee(n, a.draggable, this.el, !1) && e.push(n.getAttribute(a.dataIdAttr) || Dn(n));
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
      let i = He.modifyOption(this, e, n);
      typeof i < "u" ? t[e] = i : t[e] = n, e === "group" && Ft(t);
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
    }), this._onDrop(), this._disableDelayedDragEvents(), Qe.splice(Qe.indexOf(this.el), 1), this.el = e = null;
  },
  _hideClone: function() {
    if (!le) {
      if (U("hideClone", this), y.eventCanceled) return;
      g(N, "display", "none"), this.options.removeCloneOnHide && N.parentNode && N.parentNode.removeChild(N), le = !0;
    }
  },
  _showClone: function(e) {
    if (e.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (le) {
      if (U("showClone", this), y.eventCanceled) return;
      u.parentNode == I && !this.options.group.revertClone ? I.insertBefore(N, u) : ye ? I.insertBefore(N, ye) : I.appendChild(N), this.options.group.revertClone && this.animate(u, N), g(N, "display", ""), le = !1;
    }
  }
};
function yn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ue(e, n, t, i, o, a, r, s) {
  let l, c = e[V], p = c.options.onMove, h;
  return window.CustomEvent && !de && !nt ? l = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = n, l.from = e, l.dragged = t, l.draggedRect = i, l.related = o || n, l.relatedRect = a || L(n), l.willInsertAfter = s, l.originalEvent = r, e.dispatchEvent(l), p && (h = p.call(c, l, r)), h;
}
function ft(e) {
  e.draggable = !1;
}
function bn() {
  gt = !1;
}
function Cn(e, n, t) {
  let i = L(Be(t.el, 0, t.options, !0));
  const o = Ht(t.el, t.options, _), a = 10;
  return n ? e.clientX < o.left - a || e.clientY < i.top && e.clientX < i.right : e.clientY < o.top - a || e.clientY < i.bottom && e.clientX < i.left;
}
function kn(e, n, t) {
  const i = L(yt(t.el, t.options.draggable)), o = Ht(t.el, t.options, _), a = 10;
  return n ? e.clientX > o.right + a || e.clientY > i.bottom && e.clientX > i.left : e.clientY > o.bottom + a || e.clientX > i.right && e.clientY > i.top;
}
function wn(e, n, t, i, o, a, r, s) {
  let l = i ? e.clientY : e.clientX, c = i ? t.height : t.width, p = i ? t.top : t.left, h = i ? t.bottom : t.right, w = !1;
  if (!r) {
    if (s && qe < c * o) {
      if (!Ae && (Pe === 1 ? l > p + c * a / 2 : l < h - c * a / 2) && (Ae = !0), Ae)
        w = !0;
      else if (Pe === 1 ? l < p + qe : l > h - qe)
        return -Pe;
    } else if (l > p + c * (1 - o) / 2 && l < h - c * (1 - o) / 2)
      return Sn(n);
  }
  return w = w || r, w && (l < p + c * a / 2 || l > h - c * a / 2) ? l > p + c / 2 ? 1 : -1 : 0;
}
function Sn(e) {
  return J(u) < J(e) ? 1 : -1;
}
function Dn(e) {
  let n = e.tagName + e.className + e.src + e.href + e.textContent, t = n.length, i = 0;
  for (; t--; )
    i += n.charCodeAt(t);
  return i.toString(36);
}
function Tn(e) {
  et.length = 0;
  let n = e.getElementsByTagName("input"), t = n.length;
  for (; t--; ) {
    let i = n[t];
    i.checked && et.push(i);
  }
}
function Ze(e) {
  return setTimeout(e, 0);
}
function mt(e) {
  return clearTimeout(e);
}
it && T(document, "touchmove", function(e) {
  (y.active || Te) && e.cancelable && e.preventDefault();
});
y.utils = {
  on: T,
  off: D,
  css: g,
  find: At,
  is: function(e, n) {
    return !!ee(e, n, e, !1);
  },
  extend: ln,
  throttle: cn,
  closest: ee,
  toggleClass: j,
  clone: Bt,
  index: J,
  nextTick: Ze,
  cancelNextTick: mt,
  detectDirection: Rt,
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
    n.utils && (y.utils = { ...y.utils, ...n.utils }), He.mount(n);
  });
};
y.create = function(e, n) {
  return new y(e, n);
};
y.version = "1.15.6";
const En = { class: "headWrapper" }, xn = { class: "skillname" }, Mn = ["onClick"], In = ["onClick"], $n = ["innerHTML"], Nn = {
  key: 0,
  class: "derivationBox"
}, Wn = ["onClick"], On = { class: "derivationBody" }, Ln = { class: "headWrapper" }, Pn = { class: "dskillname" }, An = ["onClick"], Bn = ["onClick"], Hn = ["innerHTML"], Xn = {
  key: 1,
  class: "derivationBox derivationCardBox"
}, Rn = ["onClick"], Fn = { class: "derivationBody" }, Yn = { class: "cardText" }, Un = { class: "cardName" }, Gn = ["innerHTML"];
let De = null;
const jn = () => {
  if (De) return De;
  De = /* @__PURE__ */ new Map();
  for (const e in q.card) {
    const n = q.card[e]?.skills;
    if (Array.isArray(n))
      for (const t of n)
        De.has(t) || De.set(t, e);
  }
  return De;
}, zn = {
  __name: "SkillPanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = F(null);
    let i = null;
    const o = F([]), a = /* @__PURE__ */ new Map(), r = (f, C) => {
      C ? a.set(f, C) : a.delete(f);
    }, s = (f) => {
      const C = q.skill[f];
      if (typeof C?.frequent == "boolean")
        return q.config.autoskilllist.includes(f) ? !1 : C.frequent;
    }, l = (f) => {
      let C = te.skillInfoTranslation(f, void 0, !1);
      return q.translate[`${f}_append`] && (C += `<br>${te.translation(`${f}_append`)}`), C;
    }, c = (f) => {
      if (q.skill[f]?.equipSkill) {
        const C = jn().get(f);
        return C ? { type: "card", id: C } : { type: "skill", id: f };
      }
      return q.card[f] ? { type: "card", id: f } : { type: "skill", id: f };
    }, p = () => {
      const f = te.character(n.name)?.skills || [], C = [];
      for (const v of f) {
        const $ = s(v), E = {
          id: v,
          label: te.translation(v),
          frequent: $,
          auto: $,
          info: l(v),
          derivations: [],
          cards: [],
          //两块衍生区默认展开，点标题旁的按钮折叠
          foldDerivations: !1,
          foldCards: !1
        }, x = q.skill[v]?.derivation, P = Array.isArray(x) ? x : x ? [x] : [];
        for (const B of P) {
          const K = c(B);
          if (K.type === "card") {
            E.cards.push({ id: K.id, label: te.translation(K.id), info: l(K.id) });
            continue;
          }
          const ue = s(B);
          E.derivations.push({ id: B, label: te.translation(B), frequent: ue, auto: ue, info: l(B) });
        }
        C.push(E);
      }
      return C;
    }, h = () => {
      for (const f of o.value)
        for (const C of f.cards) {
          const v = a.get(`${f.id}|${C.id}`);
          if (!v || v.hasChildNodes()) continue;
          const $ = Ve.createCard(C.id);
          pt.create.buttons([$], "card", v, !0), $.remove();
        }
    };
    function w(f) {
      Ne.playSkillAudio(f, n.name);
    }
    function S(f) {
      f.auto = !f.auto, f.auto ? q.config.autoskilllist.remove(f.id) : q.config.autoskilllist.add(f.id), Ve.saveConfig("autoskilllist", q.config.autoskilllist);
    }
    return vt(async () => {
      o.value = p(), await qt(), h(), i = new y(t.value, {
        draggable: ".skillWrapper",
        animation: 150,
        handle: ".dragHandle"
      });
    }), Zt(() => {
      i?.destroy?.(), i = null, a.clear();
    }), (f, C) => (m(), b("div", {
      ref_key: "listEl",
      ref: t,
      class: "skillList"
    }, [
      (m(!0), b(G, null, ne(o.value, (v, $) => (m(), b("div", {
        key: $,
        class: "skillWrapper"
      }, [
        d("div", En, [
          C[0] || (C[0] = d("div", { class: "dragHandle" }, "≡", -1)),
          d("div", xn, A(v.label), 1),
          d("div", {
            class: "audioBtn",
            onClick: (E) => w(v.id)
          }, null, 8, Mn),
          v.frequent !== void 0 ? (m(), b("div", {
            key: 0,
            class: Z(["autoSkill", v.auto ? "autoSkillOpened" : "autoSkillClosed"]),
            onClick: (E) => S(v)
          }, " 自动发动 ", 10, In)) : ie("", !0)
        ]),
        d("div", {
          class: "skillInfo",
          innerHTML: v.info
        }, null, 8, $n),
        v.derivations.length ? (m(), b("div", Nn, [
          d("div", {
            class: Z(["derivationTitle", { derivationTitleFolded: v.foldDerivations }]),
            onClick: (E) => v.foldDerivations = !v.foldDerivations
          }, " 衍生技能 ", 10, Wn),
          Ct(d("div", On, [
            (m(!0), b(G, null, ne(v.derivations, (E) => (m(), b("div", {
              key: E.id,
              class: "derivationItem"
            }, [
              d("div", Ln, [
                d("div", Pn, A(E.label), 1),
                d("div", {
                  class: "audioBtn",
                  onClick: (x) => w(v.id)
                }, null, 8, An),
                E.frequent !== void 0 ? (m(), b("div", {
                  key: 0,
                  class: Z(["autoSkill", E.auto ? "autoSkillOpened" : "autoSkillClosed"]),
                  onClick: (x) => S(E)
                }, " 自动发动 ", 10, Bn)) : ie("", !0)
              ]),
              d("div", {
                class: "derivationInfo",
                innerHTML: E.info
              }, null, 8, Hn)
            ]))), 128))
          ], 512), [
            [kt, !v.foldDerivations]
          ])
        ])) : ie("", !0),
        v.cards.length ? (m(), b("div", Xn, [
          d("div", {
            class: Z(["derivationTitle", { derivationTitleFolded: v.foldCards }]),
            onClick: (E) => v.foldCards = !v.foldCards
          }, " 衍生卡牌 ", 10, Rn),
          Ct(d("div", Fn, [
            (m(!0), b(G, null, ne(v.cards, (E) => (m(), b("div", {
              key: E.id,
              class: "derivationCardItem"
            }, [
              d("div", {
                class: "derivationCards buttons",
                ref_for: !0,
                ref: (x) => r(v.id + "|" + E.id, x)
              }, null, 512),
              d("div", Yn, [
                d("div", Un, A(E.label), 1),
                d("div", {
                  class: "derivationInfo",
                  innerHTML: E.info
                }, null, 8, Gn)
              ])
            ]))), 128))
          ], 512), [
            [kt, !v.foldCards]
          ])
        ])) : ie("", !0)
      ]))), 128))
    ], 512));
  }
}, qn = /* @__PURE__ */ Me(zn, [["__scopeId", "data-v-14e833c9"]]), Zn = { class: "skinList" }, Vn = ["onClick"], Jn = { class: "skinAvatorWrapper" }, Kn = { class: "skinTextWrapper" }, Qn = { class: "skinText" }, ei = {
  key: 0,
  class: "skinSelectedSJZX"
}, ti = {
  __name: "SkinPanel",
  props: { name: { type: String, required: !0 } },
  emits: ["skinChange"],
  setup(e, { emit: n }) {
    const t = e, i = n, o = X(() => {
      const s = oe.getCharacterSkin(t.name) || {};
      return Object.keys(s).map((l) => ({ name: l, path: s[l] }));
    }), a = F(oe.getCurentSkin(t.name));
    function r(s) {
      s.name !== a.value && oe.setCharacterSkin(t.name, s.name) && (a.value = s.name, i("skinChange", { skinName: s.name, path: s.path }));
    }
    return (s, l) => (m(), b("div", Zn, [
      (m(!0), b(G, null, ne(o.value, (c) => (m(), b("div", {
        key: c.name,
        class: Z(["skinListWrapper", { skinListSelectedWrapper: c.name === a.value }]),
        onClick: (p) => r(c)
      }, [
        d("div", Jn, [
          d("div", {
            class: "imageSkin",
            style: be({ backgroundImage: `url(${c.path})` })
          }, null, 4)
        ]),
        d("div", Kn, [
          d("div", Qn, A(c.name), 1)
        ]),
        c.name === a.value ? (m(), b("div", ei)) : ie("", !0)
      ], 10, Vn))), 128))
    ]));
  }
}, ni = /* @__PURE__ */ Me(ti, [["__scopeId", "data-v-26d0169f"]]), ii = { class: "moduleList" }, oi = ["onClick"], ai = { class: "modulesTitle" }, ri = { class: "modulesInfoWrapper" }, si = { class: "modulesInfo" }, li = ["innerHTML"], ci = ["innerHTML"], di = {
  key: 1,
  class: "modulesSelectedSJZX"
}, ui = {
  __name: "ModulePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = F(0), i = X(() => {
      t.value;
      const s = Ge.getCharModules(n.name, !1) || {};
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
    }), o = X(() => (t.value, Ge.getCharModules(n.name)?.id));
    function a(s) {
      s !== o.value && (Ge.setCharModules(n.name, s), t.value++, Wt.showToast("[驶舰之向] 更换模组后部分效果可能需要重启才能生效"));
    }
    function r(s) {
      return s ? (Array.isArray(s) ? s : [s]).map((c) => typeof c == "function" ? c() : c).join("<br>") : "";
    }
    return (s, l) => (m(), b("div", ii, [
      (m(!0), b(G, null, ne(i.value, (c) => (m(), b("div", {
        key: c.id,
        class: Z(["charModulesWrapper", { modulesSelectedWrapper: c.id === o.value }]),
        onClick: (p) => a(c.id)
      }, [
        d("div", ai, A(c.name), 1),
        d("div", ri, [
          d("div", {
            class: "modulesImage",
            style: be({ backgroundImage: `url(${c.url})` })
          }, null, 4),
          d("div", si, [
            (m(!0), b(G, null, ne(c.intro, (p, h) => (m(), b("div", {
              key: h,
              class: "infoText",
              innerHTML: p
            }, null, 8, li))), 128))
          ])
        ]),
        c.effectIntro ? (m(), b(G, { key: 0 }, [
          l[0] || (l[0] = d("div", { class: "modulesEffectTitle" }, "模组效果", -1)),
          d("div", {
            class: "modulesEffectInfo",
            innerHTML: c.effectIntro
          }, null, 8, ci)
        ], 64)) : ie("", !0),
        c.id === o.value ? (m(), b("div", di)) : ie("", !0)
      ], 10, oi))), 128))
    ]));
  }
}, fi = /* @__PURE__ */ Me(ui, [["__scopeId", "data-v-4540a4c6"]]), hi = { class: "charInfoWrapper" }, pi = ["innerHTML"], gi = {
  __name: "ResumePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = X(() => te.characterIntro(n.name) || "");
    return (i, o) => (m(), b("div", hi, [
      o[0] || (o[0] = d("div", { class: "charTitle" }, "干员档案", -1)),
      d("div", {
        class: "charInfo",
        innerHTML: t.value
      }, null, 8, pi)
    ]));
  }
}, mi = /* @__PURE__ */ Me(gi, [["__scopeId", "data-v-489a3cf2"]]), Gt = "characterCardBackgroundSource", vi = {
  featured: "精选",
  all: "全部"
};
function _i() {
  return Oe.config(Gt) === "all" ? "all" : "featured";
}
const yi = { class: "backgroundPanel" }, bi = {
  key: 0,
  class: "backgroundLoading"
}, Ci = {
  key: 1,
  class: "backgroundLoading"
}, ki = { class: "backgroundList" }, wi = ["onClick"], Si = ["src"], Di = { class: "backgroundText" };
let ht = null;
const Ti = {
  __name: "BackgroundPanel",
  props: {
    /** 当前选中的背景值（`<scheme>:<相对路径>`） */
    value: { type: String, default: "" }
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const t = n, i = F([]), o = F(!0), a = { dir: "dybg:", prefix: "dybg:" }, r = {
      featured: [a],
      all: [a, { dir: "ui:background/", prefix: "ui:background/" }, { dir: "bg:", prefix: "bg:" }]
    };
    return vt(async () => {
      const s = _i();
      if (ht?.mode === s) {
        i.value = ht.list, o.value = !1;
        return;
      }
      try {
        const l = nn.getBackgroundData?.() || {}, c = [];
        for (const { dir: p, prefix: h } of r[s]) {
          const S = ((await re.getFileTree(p, 0))?.files || []).slice().sort((f, C) => f.name.localeCompare(C.name));
          for (const f of S) {
            const C = h + f.name, v = f.name.replace(/\.[^.]+$/, "");
            c.push({ value: C, url: re.compilePath(C), label: l[v] || v });
          }
        }
        ht = { mode: s, list: c }, i.value = c;
      } catch (l) {
        console.warn("[WhichWay] 读取武将卡背景列表失败：", l);
      } finally {
        o.value = !1;
      }
    }), (s, l) => (m(), b("div", yi, [
      l[0] || (l[0] = d("div", { class: "backgroundHint" }, "点击选择武将卡背景", -1)),
      o.value ? (m(), b("div", bi, "正在读取背景列表…")) : i.value.length ? ie("", !0) : (m(), b("div", Ci, "没有找到可用的背景图片")),
      d("div", ki, [
        (m(!0), b(G, null, ne(i.value, (c) => (m(), b("div", {
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
          }, null, 8, Si),
          d("div", Di, A(c.label), 1)
        ], 10, wi))), 128))
      ])
    ]));
  }
}, Ei = /* @__PURE__ */ Me(Ti, [["__scopeId", "data-v-d493a85a"]]), xi = { class: "camplogo-wrapper" }, Mi = {
  key: 0,
  class: "group-text"
}, Ii = { class: "topMenu-wrapper" }, $i = { class: "imageBox" }, Ni = ["src"], Wi = ["onClick"], Oi = { class: "btn-enSJZX" }, Li = { class: "btn-cnSJZX" }, Pi = { class: "btnImage-wrapper" }, Ai = ["src"], Bi = { class: "skinnameAudio-wrapper" }, Hi = { class: "skinnameWrapper" }, Xi = { class: "titleWrapper" }, Ri = { class: "imageWrapper" }, Fi = ["src"], Yi = { class: "textWrapper" }, Ui = { class: "designerWrapper" }, Gi = { class: "titleWrapper" }, ji = { class: "imageWrapper" }, zi = ["src"], qi = { class: "textWrapper" }, Zi = { class: "audioTitleWrapper" }, Vi = { class: "imageWrapper" }, Ji = ["src"], Ki = { class: "textWrapper" }, Qi = ["src"], eo = { class: "content" }, to = ["onClick"], no = { class: "selectTextSJZX" }, io = { class: "charName-wrapper" }, oo = { class: "charNameTitleWrapper" }, ao = ["innerHTML"], ro = { class: "charNameTextWrapper" }, so = ["innerHTML"], lo = { class: "hpWrapper" }, co = { class: "hpNumWrapper" }, uo = { class: "hpNumText" }, fo = {
  key: 0,
  class: "hpNumWrapper"
}, ho = { class: "hpNumText" }, po = { class: "charImageWrapper" }, go = { class: "buttonText" }, mo = { class: "displayArenaSJZX" }, vo = {
  key: 0,
  class: "UseLLMTips-wrapper"
}, _o = { class: "LLM-wrapper" }, yo = { class: "LLM-Icon" }, bo = ["src"], Co = { class: "LLM-Text" }, ko = "ui:background/default.png", wo = {
  __name: "CharacterCard",
  props: {
    /** 武将名（char id） */
    name: { type: String, required: !0 },
    /** 关闭回调：由 WhichWayCharacterCard 卸载应用并复原 */
    onClose: { type: Function, default: null }
  },
  setup(e) {
    const n = e, t = F(Oe.config("characterCardBackground") || ko), i = F(t.value), o = X(() => re.compilePath(i.value)), a = F("skill"), r = (k) => re.compilePath(`ui:${k}`), s = (k) => re.compilePath(`logo:${k}`), l = X(() => {
      const k = Kt(n.name), W = te.character(n.name), M = W?.whichWay?.arknight?.camp, Ie = Qt(W?.group, Oe.getCharExtConfig(n.name)?.reallyGroup, M), at = M || Ie?.logo || Ie?.reallyGroup, bt = Ie?.filter ?? !!at;
      return at ? { useFilter: bt, logoUrl: `${re.extDir}image/camplogo/arknight/${at}.png`, text: "" } : k ? { useFilter: bt, logoUrl: `${re.extDir}image/camplogo/noname/name_${k}.png`, text: "" } : { useFilter: !1, logoUrl: "", text: q.translate[W?.group] || "" };
    }), c = X(() => q.characterTitle[n.name] || ""), p = X(() => te.translation(n.name)), h = X(() => {
      const { maxHp: k = 0, hp: W = 0, hujia: M = 0 } = te.character(n.name) || {};
      return { maxHp: k, hp: W, hujia: M };
    }), w = X(() => {
      const k = [
        { key: "resume", en: "QUIT", cn: "简介", image: "resume.png" },
        { key: "skill", en: "SKILL", cn: "技能", image: "skill.png" },
        { key: "skin", en: "SKIN", cn: "皮肤", image: "skin.png" }
      ];
      return Ge.getCharModules(n.name, !1) && k.push({ key: "mode", en: "MODE", cn: "模组", image: "mode.png" }), k.push({ key: "background", en: "BG", cn: "背景", image: "back_switch.png" }), k;
    }), S = F(oe.getCurentSkin(n.name)), f = X(() => en(n.name).join("、")), C = F(null), v = F(oe.getCurrentSkinPath(n.name)), $ = X(() => {
      const k = v.value;
      return { backgroundImage: k.startsWith("url") ? k : `url(${k})` };
    }), E = F(!1), x = F(!1);
    function P() {
      const k = oe.getCurentSkin(n.name);
      E.value = !!me.getSkinData(n.name, k), x.value = me.isEnabledSkin(n.name, k);
    }
    const B = F(Ne.getCharacterLang(n.name)), K = X(() => Ne.getCharacterAvailableLang(n.name) || []), ue = X(() => Ne.getCharacterLang(n.name, !0)), fe = F(!0), he = (k) => Jt.getVoiceLangTranslation(k);
    async function ot(k) {
      if (k !== B.value) {
        if (!window.whichWaySave.hasChar(n.name)) {
          Wt.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
          return;
        }
        await Ne.setCustomAudio(n.name, k), B.value = k;
      }
    }
    async function pe({ skinName: k, path: W }) {
      S.value = k, v.value = oe.getCurrentSkinPath(n.name), P(), await me.updateDyc(n.name, C.value), oe.refreshSkin();
    }
    function Xe(k) {
      if (k === t.value) return;
      t.value = k, Oe.saveConfig("characterCardBackground", k);
      const W = new Image();
      W.decoding = "async", W.src = re.compilePath(k);
      const M = () => {
        t.value === k && (i.value = k);
      };
      W.decode().then(M, M);
    }
    async function ge() {
      const k = oe.getCurentSkin(n.name);
      await me.toggleDycSkin(n.name, k), P(), await me.updateDyc(n.name, C.value);
      for (const W of Ve.players)
        te.name(W) === n.name && await me.updateDyc(n.name, W);
    }
    function Ce() {
      typeof n.onClose == "function" && n.onClose();
    }
    vt(async () => {
      P(), await me.updateDyc(n.name, C.value);
    });
    const ke = X(() => tn(n.name)), jt = X(() => ke.value ?? "占位符"), zt = X(() => {
      const k = ke.value?.split("-")[0];
      return s((k || "deepseek") + ".png");
    });
    return (k, W) => (m(), b("div", {
      class: "container-CC-SJZX",
      style: be({ backgroundImage: `url(${o.value})` })
    }, [
      d("div", xi, [
        d("div", {
          class: Z(["img-def", { arknightCamp: l.value.useFilter }]),
          style: be(l.value.logoUrl ? { backgroundImage: `url(${l.value.logoUrl})` } : null)
        }, [
          !l.value.logoUrl && l.value.text ? (m(), b("div", Mi, A(l.value.text), 1)) : ie("", !0)
        ], 6)
      ]),
      d("div", Ii, [
        d("div", {
          class: "btn-back",
          onClick: Ce
        }, [
          d("div", $i, [
            d("img", {
              src: r("back.png"),
              alt: ""
            }, null, 8, Ni)
          ])
        ]),
        (m(!0), b(G, null, ne(w.value, (M) => (m(), b("div", {
          key: M.key,
          class: Z(["btn-background", { "btn-selected-SJZX": a.value === M.key }]),
          onClick: (Ie) => a.value = M.key
        }, [
          d("div", Oi, A(M.en), 1),
          d("div", Li, A(M.cn), 1),
          d("div", Pi, [
            d("img", {
              class: "btn-img",
              src: r(M.image),
              alt: ""
            }, null, 8, Ai)
          ])
        ], 10, Wi))), 128))
      ]),
      d("div", Bi, [
        d("div", Hi, [
          d("div", Xi, [
            d("div", Ri, [
              d("img", {
                src: r("painter.png"),
                alt: ""
              }, null, 8, Fi)
            ]),
            d("div", Yi, A(S.value), 1)
          ])
        ]),
        d("div", Ui, [
          d("div", Gi, [
            d("div", ji, [
              d("img", {
                class: "imageLimit",
                src: r("designer.png"),
                alt: ""
              }, null, 8, zi)
            ]),
            d("div", qi, A(f.value), 1)
          ])
        ]),
        d("div", {
          class: "audioWrapper",
          style: be(fe.value ? null : { height: `${(K.value.length + 1) * 50}px` })
        }, [
          d("div", Zi, [
            d("div", Vi, [
              d("img", {
                src: r("cv.png"),
                alt: ""
              }, null, 8, Ji)
            ]),
            d("div", Ki, A(ue.value), 1),
            d("div", {
              class: "collapseWrapper",
              onClick: W[0] || (W[0] = (M) => fe.value = !fe.value)
            }, [
              d("img", {
                src: r(fe.value ? "plus.png" : "sub.png"),
                style: { height: "50%" },
                alt: ""
              }, null, 8, Qi)
            ])
          ]),
          d("div", eo, [
            (m(!0), b(G, null, ne(K.value, (M) => (m(), b("div", {
              key: M,
              class: "selectWrapper",
              onClick: (Ie) => ot(M)
            }, [
              d("div", {
                class: Z(M === B.value ? "choice" : "nochoice")
              }, null, 2),
              d("div", {
                class: Z(M === B.value ? "choice-contentTextWrapper" : "nochoice-contentTextWrapper")
              }, [
                d("div", no, A(he(M)), 1)
              ], 2)
            ], 8, to))), 128))
          ])
        ], 4)
      ]),
      d("div", io, [
        d("div", oo, [
          d("div", {
            class: "charNameTitle",
            innerHTML: c.value
          }, null, 8, ao)
        ]),
        d("div", ro, [
          d("div", {
            class: "charNameText",
            innerHTML: p.value
          }, null, 8, so)
        ]),
        d("div", lo, [
          h.value.maxHp + h.value.hujia > 6 ? (m(), b(G, { key: 0 }, [
            d("div", co, [
              W[1] || (W[1] = d("div", { class: "actualHpSJZX" }, null, -1)),
              d("div", uo, A(h.value.hp) + "/" + A(h.value.maxHp), 1)
            ]),
            h.value.hujia > 0 ? (m(), b("div", fo, [
              W[2] || (W[2] = d("div", { class: "shieldSJZX" }, null, -1)),
              d("div", ho, A(h.value.hujia), 1)
            ])) : ie("", !0)
          ], 64)) : (m(), b(G, { key: 1 }, [
            (m(!0), b(G, null, ne(h.value.maxHp, (M) => (m(), b("div", {
              key: `hp${M}`,
              class: Z(M <= h.value.hp ? "actualHpSJZX" : "emptyHpSJZX")
            }, null, 2))), 128)),
            (m(!0), b(G, null, ne(h.value.hujia, (M) => (m(), b("div", {
              key: `shield${M}`,
              class: "shieldSJZX"
            }))), 128))
          ], 64))
        ])
      ]),
      d("div", po, [
        d("div", {
          ref_key: "charImageEl",
          ref: C,
          class: "charImage",
          style: be($.value)
        }, null, 4),
        d("div", {
          class: "charSkinBottomUIWrapper",
          style: be({ display: E.value ? "" : "none" })
        }, [
          d("div", {
            class: Z(["buttonWrapper", { "buttonWrapper-enableSkinBG": x.value }]),
            onClick: ge
          }, [
            d("div", go, A(x.value ? "关闭动皮" : "开启动皮"), 1)
          ], 2)
        ], 4)
      ]),
      d("div", mo, [
        a.value === "skill" ? (m(), $e(qn, {
          key: 0,
          name: e.name
        }, null, 8, ["name"])) : a.value === "skin" ? (m(), $e(ni, {
          key: 1,
          name: e.name,
          onSkinChange: pe
        }, null, 8, ["name"])) : a.value === "mode" ? (m(), $e(fi, {
          key: 2,
          name: e.name
        }, null, 8, ["name"])) : a.value === "background" ? (m(), $e(Ei, {
          key: 3,
          value: t.value,
          onSelect: Xe
        }, null, 8, ["value"])) : (m(), $e(mi, {
          key: 4,
          name: e.name
        }, null, 8, ["name"]))
      ]),
      ke.value ? (m(), b("div", vo, [
        d("div", _o, [
          d("div", yo, [
            d("img", {
              src: zt.value,
              alt: "",
              class: "imageLimit"
            }, null, 8, bo)
          ]),
          d("div", Co, A(jt.value), 1)
        ]),
        W[3] || (W[3] = d("div", { class: "LLM-Content" }, "技能代码由AI生成", -1))
      ])) : ie("", !0)
    ], 4));
  }
}, So = /* @__PURE__ */ Me(wo, [["__scopeId", "data-v-6af827b6"]]), Nt = "enableWhichWayCharacterCardStyle";
class Do {
  /** 当前武将卡的 Vue 应用与挂载容器（同一时刻只会存在一张卡） */
  #e = null;
  #t = null;
  constructor() {
    on({
      name: "whichWayCharacterCardStyleOverride_add",
      fn() {
        Object.defineProperty(pt.click, "charactercard", {
          value: pt.click.charactercard,
          writable: !0,
          configurable: !0,
          enumerable: !0
        }), rn.appendHook("ui.click.charactercard", {
          before: function(n, t, i, o, a, r) {
            if (tt.shouldUseStyle(n))
              return tt.create(n), !1;
          }
        });
      }
    }), wt({
      name: "whichWayCharacterCardStyleConfig_add",
      priority: 770,
      obj: {
        name: Nt,
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
    }), wt({
      name: "whichWayCharacterCardBackgroundSourceConfig_add",
      priority: 769,
      obj: {
        name: Gt,
        options: {
          name: "武将卡背景来源",
          intro: "武将卡「背景」面板扫描哪些目录（精选：仅 dynamicSkin/background，省性能；全部：再加上 image/background 与 image/ui/background）",
          init: "featured",
          item: vi
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
    const n = Oe.config(Nt);
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
    const l = Vt(So, {
      name: n,
      onClose: () => this.close()
    });
    l.mount(s), this.#e = l, this.#t = s;
  }
  /** 关闭武将卡：卸载 Vue 应用、移除容器，并让场上玩家头像与动皮同步 */
  close() {
    this.#e?.unmount(), this.#e = null, this.#t?.remove(), this.#t = null, oe.refreshSkin(), Ve.resume2();
  }
}
const tt = new Do();
an({
  name: "whichwayCharacterCard_dev",
  fn: () => {
    window.whichWayCharacterCard = tt;
  }
});
window.whichWay.register("characterCard", tt);
export {
  tt as whichWayCharacterCard
};
