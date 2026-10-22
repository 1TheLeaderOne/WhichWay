import { get as te, lib as Z, game as Qe, ui as mt } from "noname";
import { ref as A, onMounted as yt, nextTick as Pt, onBeforeUnmount as nn, openBlock as p, createElementBlock as _, Fragment as G, renderList as ne, createElementVNode as d, toDisplayString as B, normalizeClass as V, createCommentVNode as ie, withDirectives as wt, vShow as St, computed as P, normalizeStyle as ye, createBlock as Ne, createApp as on } from "vue";
import { whichWayFile as le } from "./file.js";
import { whichWayUtil as Pe } from "./utill.js";
import { w as ae, s as be } from "./skin-PortraitLayers-shared.js";
import { whichWayAudio as We } from "./audio.js";
import { whichWayToast as Lt } from "./toast.js";
import { whichWayArknight as an } from "./arknight.js";
import { whichWayCharacterModules as qe } from "./modules.js";
import { b as rn, c as sn, g as ln, e as cn } from "./packs-base-characterDesigner-shared.js";
import { _ as Ee } from "./_plugin-vue_export-helper.js";
import { w as dn } from "./config-data-shared.js";
import { onContent as un, onConfig as Dt, onSetDev as fn } from "./hooks.js";
import { whichWayAPIOverride as hn } from "./override.js";
function ce(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
const pe = ce(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), ot = ce(/Edge/i), Tt = ce(/firefox/i), Ze = ce(/safari/i) && !ce(/chrome/i) && !ce(/android/i), bt = ce(/iP(ad|od|hone)/i), At = ce(/chrome/i) && ce(/android/i), Bt = {
  capture: !1,
  passive: !1
};
function T(e, n, t) {
  e.addEventListener(n, t, !pe && Bt);
}
function D(e, n, t) {
  e.removeEventListener(n, t, !pe && Bt);
}
function et(e, n) {
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
function Ht(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode;
}
function ee(e, n, t, i) {
  if (e) {
    t = t || document;
    do {
      if (n != null && (n[0] === ">" ? e.parentNode === t && et(e, n) : et(e, n)) || i && e === t)
        return e;
      if (e === t) break;
    } while (e = Ht(e));
  }
  return null;
}
const Et = /\s+/g;
function z(e, n, t) {
  if (e && n)
    if (e.classList)
      e.classList[t ? "add" : "remove"](n);
    else {
      let i = (" " + e.className + " ").replace(Et, " ").replace(" " + n + " ", " ");
      e.className = (i + (t ? " " + n : "")).replace(Et, " ");
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
function Te(e, n) {
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
function Xt(e, n, t) {
  if (e) {
    let i = e.getElementsByTagName(n), o = 0, a = i.length;
    if (t)
      for (; o < a; o++)
        t(i[o], o);
    return i;
  }
  return [];
}
function he() {
  let e = document.scrollingElement;
  return e || document.documentElement;
}
function L(e, n, t, i, o) {
  if (!e.getBoundingClientRect && e !== window) return;
  let a, r, s, l, c, h, k;
  if (e !== window && e.parentNode && e !== he() ? (a = e.getBoundingClientRect(), r = a.top, s = a.left, l = a.bottom, c = a.right, h = a.height, k = a.width) : (r = 0, s = 0, l = window.innerHeight, c = window.innerWidth, h = window.innerHeight, k = window.innerWidth), (n || t) && e !== window && (o = o || e.parentNode, !pe))
    do
      if (o && o.getBoundingClientRect && (g(o, "transform") !== "none" || t && g(o, "position") !== "static")) {
        let S = o.getBoundingClientRect();
        r -= S.top + parseInt(g(o, "border-top-width")), s -= S.left + parseInt(g(o, "border-left-width")), l = r + a.height, c = s + a.width;
        break;
      }
    while (o = o.parentNode);
  if (i && e !== window) {
    let S = Te(o || e), C = S && S.a, f = S && S.d;
    S && (r /= f, s /= C, k /= C, h /= f, l = r + h, c = s + k);
  }
  return {
    top: r,
    left: s,
    bottom: l,
    right: c,
    width: k,
    height: h
  };
}
function xt(e, n, t) {
  let i = It(e, !0), o = L(e)[n];
  for (; i; ) {
    let a = L(i)[t], r;
    if (r = o >= a, !r) return i;
    if (i === he()) break;
    i = It(i, !1);
  }
  return !1;
}
function He(e, n, t, i) {
  let o = 0, a = 0, r = e.children;
  for (; a < r.length; ) {
    if (r[a].style.display !== "none" && r[a] !== v.ghost && (i || r[a] !== v.dragged) && ee(r[a], t.draggable, e, !1)) {
      if (o === n)
        return r[a];
      o++;
    }
    a++;
  }
  return null;
}
function kt(e, n) {
  let t = e.lastElementChild;
  for (; t && (t === v.ghost || g(t, "display") === "none" || n && !et(t, n)); )
    t = t.previousElementSibling;
  return t || null;
}
function K(e, n) {
  let t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== v.clone && (!n || et(e, n)) && t++;
  return t;
}
function Mt(e) {
  let n = 0, t = 0, i = he();
  if (e)
    do {
      let o = Te(e), a = o.a, r = o.d;
      n += e.scrollLeft * a, t += e.scrollTop * r;
    } while (e !== i && (e = e.parentNode));
  return [n, t];
}
function pn(e, n) {
  for (let t in e)
    if (e.hasOwnProperty(t)) {
      for (let i in n)
        if (n.hasOwnProperty(i) && n[i] === e[t][i]) return Number(t);
    }
  return -1;
}
function It(e, n) {
  if (!e || !e.getBoundingClientRect) return he();
  let t = e, i = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      let o = g(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return he();
        if (i || n) return t;
        i = !0;
      }
    }
  while (t = t.parentNode);
  return he();
}
function gn(e, n) {
  if (e && n)
    for (let t in n)
      n.hasOwnProperty(t) && (e[t] = n[t]);
  return e;
}
function lt(e, n) {
  return Math.round(e.top) === Math.round(n.top) && Math.round(e.left) === Math.round(n.left) && Math.round(e.height) === Math.round(n.height) && Math.round(e.width) === Math.round(n.width);
}
let ct;
function mn(e, n) {
  return function() {
    if (!ct) {
      let t = arguments, i = this;
      t.length === 1 ? e.call(i, t[0]) : e.apply(i, t), ct = setTimeout(function() {
        ct = void 0;
      }, n);
    }
  };
}
function vn(e, n, t) {
  e.scrollLeft += n, e.scrollTop += t;
}
function Rt(e) {
  let n = window.Polymer, t = window.jQuery || window.Zepto;
  return n && n.dom ? n.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Ft(e, n, t) {
  const i = {};
  return Array.from(e.children).forEach((o) => {
    if (!ee(o, n.draggable, e, !1) || o.animated || o === t) return;
    const a = L(o);
    i.left = Math.min(i.left ?? 1 / 0, a.left), i.top = Math.min(i.top ?? 1 / 0, a.top), i.right = Math.max(i.right ?? -1 / 0, a.right), i.bottom = Math.max(i.bottom ?? -1 / 0, a.bottom);
  }), i.width = i.right - i.left, i.height = i.bottom - i.top, i.x = i.left, i.y = i.top, i;
}
const J = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function _n() {
  let e = [], n;
  return {
    captureAnimationState() {
      if (e = [], !this.options.animation) return;
      [].slice.call(this.el.children).forEach((i) => {
        if (g(i, "display") === "none" || i === v.ghost) return;
        e.push({
          target: i,
          rect: L(i)
        });
        let o = { ...e[e.length - 1].rect };
        if (i.thisAnimationDuration) {
          let a = Te(i, !0);
          a && (o.top -= a.f, o.left -= a.e);
        }
        i.fromRect = o;
      });
    },
    addAnimationState(t) {
      e.push(t);
    },
    removeAnimationState(t) {
      e.splice(pn(e, { target: t }), 1);
    },
    animateAll(t) {
      if (!this.options.animation) {
        clearTimeout(n), typeof t == "function" && t();
        return;
      }
      let i = !1, o = 0;
      e.forEach((a) => {
        let r = 0, s = a.target, l = s.fromRect, c = L(s), h = s.prevFromRect, k = s.prevToRect, S = a.rect, C = Te(s, !0);
        C && (c.top -= C.f, c.left -= C.e), s.toRect = c, s.thisAnimationDuration && lt(h, c) && !lt(l, c) && // Make sure animatingRect is on line between toRect & fromRect
        (S.top - c.top) / (S.left - c.left) === (l.top - c.top) / (l.left - c.left) && (r = bn(S, h, k, this.options)), lt(c, l) || (s.prevFromRect = l, s.prevToRect = c, r || (r = this.options.animation), this.animate(
          s,
          S,
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
        let r = Te(this.el), s = r && r.a, l = r && r.d, c = (i.left - o.left) / (s || 1), h = (i.top - o.top) / (l || 1);
        t.animatingX = !!c, t.animatingY = !!h, g(t, "transform", "translate3d(" + c + "px," + h + "px,0)"), this.forRepaintDummy = yn(t), g(t, "transition", "transform " + a + "ms" + (this.options.easing ? " " + this.options.easing : "")), g(t, "transform", "translate3d(0,0,0)"), typeof t.animated == "number" && clearTimeout(t.animated), t.animated = setTimeout(function() {
          g(t, "transition", ""), g(t, "transform", ""), t.animated = !1, t.animatingX = !1, t.animatingY = !1;
        }, a);
      }
    }
  };
}
function yn(e) {
  return e.offsetWidth;
}
function bn(e, n, t, i) {
  return Math.sqrt(Math.pow(n.top - e.top, 2) + Math.pow(n.left - e.left, 2)) / Math.sqrt(Math.pow(n.top - t.top, 2) + Math.pow(n.left - t.left, 2)) * i.animation;
}
let ke = [];
const dt = {
  initializeByDefault: !0
}, Re = {
  mount(e) {
    for (let n in dt)
      dt.hasOwnProperty(n) && !(n in e) && (e[n] = dt[n]);
    ke.forEach((n) => {
      if (n.pluginName === e.pluginName)
        throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
    }), ke.push(e);
  },
  pluginEvent(e, n, t) {
    this.eventCanceled = !1, t.cancel = () => {
      this.eventCanceled = !0;
    };
    const i = e + "Global";
    ke.forEach((o) => {
      n[o.pluginName] && (n[o.pluginName][i] && n[o.pluginName][i]({ sortable: n, ...t }), n.options[o.pluginName] && n[o.pluginName][e] && n[o.pluginName][e]({ sortable: n, ...t }));
    });
  },
  initializePlugins(e, n, t, i) {
    ke.forEach((o) => {
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
    return ke.forEach((i) => {
      typeof i.eventProperties == "function" && Object.assign(t, i.eventProperties.call(n[i.pluginName], e));
    }), t;
  },
  modifyOption(e, n, t) {
    let i;
    return ke.forEach((o) => {
      e[o.pluginName] && o.optionListeners && typeof o.optionListeners[n] == "function" && (i = o.optionListeners[n].call(e[o.pluginName], t));
    }), i;
  }
};
function kn({
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
  newDraggableIndex: h,
  originalEvent: k,
  putSortable: S,
  extraEventProperties: C
}) {
  if (e = e || n && n[J], !e) return;
  let f, w = e.options, y = "on" + t.charAt(0).toUpperCase() + t.substr(1);
  window.CustomEvent && !pe && !ot ? f = new CustomEvent(t, {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent(t, !0, !0)), f.to = a || n, f.from = r || n, f.item = i || n, f.clone = o, f.oldIndex = s, f.newIndex = l, f.oldDraggableIndex = c, f.newDraggableIndex = h, f.originalEvent = k, f.pullMode = S ? S.lastPutMode : void 0;
  let I = { ...C, ...Re.getEventProperties(t, e) };
  for (let E in I)
    f[E] = I[E];
  n && n.dispatchEvent(f), w[y] && w[y].call(e, f);
}
let U = function(e, n, { evt: t, ...i } = {}) {
  Re.pluginEvent.bind(v)(e, n, {
    dragEl: u,
    parentEl: O,
    ghostEl: m,
    rootEl: $,
    nextEl: _e,
    lastDownEl: Ve,
    cloneEl: N,
    cloneHidden: fe,
    dragStarted: Oe,
    putSortable: H,
    activeSortable: v.active,
    originalEvent: t,
    oldIndex: De,
    oldDraggableIndex: Le,
    newIndex: q,
    newDraggableIndex: ue,
    hideGhostForTarget: jt,
    unhideGhostForTarget: zt,
    cloneNowHidden() {
      fe = !0;
    },
    cloneNowShown() {
      fe = !1;
    },
    dispatchSortableEvent(o) {
      Y({ sortable: n, name: o, originalEvent: t });
    },
    ...i
  });
};
function Y(e) {
  kn({
    putSortable: H,
    cloneEl: N,
    targetEl: u,
    rootEl: $,
    oldIndex: De,
    oldDraggableIndex: Le,
    newIndex: q,
    newDraggableIndex: ue,
    ...e
  });
}
let u, O, m, $, _e, Ve, N, fe, De, q, Le, ue, Ye, H, Se = !1, tt = !1, nt = [], me, Q, ut, ft, $t, Nt, Oe, Ce, Ae, Be = !1, Ue = !1, Je, F, ht = [], vt = !1, it = [];
const at = typeof document < "u", Ge = bt, Wt = ot || pe ? "cssFloat" : "float", Cn = at && !At && !bt && "draggable" in document.createElement("div"), Yt = (function() {
  if (!at) return;
  if (pe)
    return !1;
  let e = document.createElement("x");
  return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
})(), Ut = function(e, n) {
  let t = g(e), i = parseInt(t.width) - parseInt(t.paddingLeft) - parseInt(t.paddingRight) - parseInt(t.borderLeftWidth) - parseInt(t.borderRightWidth), o = He(e, 0, n), a = He(e, 1, n), r = o && g(o), s = a && g(a), l = r && parseInt(r.marginLeft) + parseInt(r.marginRight) + L(o).width, c = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + L(a).width;
  if (t.display === "flex")
    return t.flexDirection === "column" || t.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (t.display === "grid")
    return t.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (o && r.float && r.float !== "none") {
    let h = r.float === "left" ? "left" : "right";
    return a && (s.clear === "both" || s.clear === h) ? "vertical" : "horizontal";
  }
  return o && (r.display === "block" || r.display === "flex" || r.display === "table" || r.display === "grid" || l >= i && t[Wt] === "none" || a && t[Wt] === "none" && l + c > i) ? "vertical" : "horizontal";
}, wn = function(e, n, t) {
  let i = t ? e.left : e.top, o = t ? e.right : e.bottom, a = t ? e.width : e.height, r = t ? n.left : n.top, s = t ? n.right : n.bottom, l = t ? n.width : n.height;
  return i === r || o === s || i + a / 2 === r + l / 2;
}, Sn = function(e, n) {
  let t;
  return nt.some((i) => {
    const o = i[J].options.emptyInsertThreshold;
    if (!o || kt(i)) return;
    const a = L(i), r = e >= a.left - o && e <= a.right + o, s = n >= a.top - o && n <= a.bottom + o;
    if (r && s)
      return t = i;
  }), t;
}, Gt = function(e) {
  function n(o, a) {
    return function(r, s, l, c) {
      let h = r.options.group.name && s.options.group.name && r.options.group.name === s.options.group.name;
      if (o == null && (a || h))
        return !0;
      if (o == null || o === !1)
        return !1;
      if (a && o === "clone")
        return o;
      if (typeof o == "function")
        return n(o(r, s, l, c), a)(r, s, l, c);
      {
        let k = (a ? r : s).options.group.name;
        return o === !0 || typeof o == "string" && o === k || o.join && o.indexOf(k) > -1;
      }
    };
  }
  let t = {}, i = e.group;
  (!i || typeof i != "object") && (i = { name: i }), t.name = i.name, t.checkPull = n(i.pull, !0), t.checkPut = n(i.put), t.revertClone = i.revertClone, e.group = t;
}, jt = function() {
  !Yt && m && g(m, "display", "none");
}, zt = function() {
  !Yt && m && g(m, "display", "");
};
at && !At && document.addEventListener("click", function(e) {
  if (tt)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), tt = !1, !1;
}, !0);
let ve = function(e) {
  if (u) {
    e = e.touches ? e.touches[0] : e;
    let n = Sn(e.clientX, e.clientY);
    if (n) {
      let t = {};
      for (let i in e)
        e.hasOwnProperty(i) && (t[i] = e[i]);
      t.target = t.rootEl = n, t.preventDefault = void 0, t.stopPropagation = void 0, n[J]._onDragOver(t);
    }
  }
}, Dn = function(e) {
  u && u.parentNode[J]._isOutsideThisEl(e.target);
};
function v(e, n) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
  this.el = e, this.options = n = Object.assign({}, n), e[J] = this;
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
      return Ut(e, this.options);
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
    supportPointer: v.supportPointer !== !1 && "PointerEvent" in window && (!Ze || bt),
    emptyInsertThreshold: 5
  };
  Re.initializePlugins(this, e, t);
  for (let i in t)
    !(i in n) && (n[i] = t[i]);
  Gt(n);
  for (let i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = n.forceFallback ? !1 : Cn, this.nativeDraggable && (this.options.touchStartThreshold = 1), n.supportPointer ? T(e, "pointerdown", this._onTapStart) : (T(e, "mousedown", this._onTapStart), T(e, "touchstart", this._onTapStart)), this.nativeDraggable && (T(e, "dragover", this), T(e, "dragenter", this)), nt.push(this.el), n.store && n.store.get && this.sort(n.store.get(this) || []), Object.assign(this, _n());
}
v.prototype = /** @lends Sortable.prototype */
{
  constructor: v,
  _isOutsideThisEl: function(e) {
    !this.el.contains(e) && e !== this.el && (Ce = null);
  },
  _getDirection: function(e, n) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, e, n, u) : this.options.direction;
  },
  _onTapStart: function(e) {
    if (!e.cancelable) return;
    let n = this, t = this.el, i = this.options, o = i.preventOnFilter, a = e.type, r = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (r || e).target, l = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, c = i.filter;
    if (Wn(t), !u && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || i.disabled) && !l.isContentEditable && !(!this.nativeDraggable && Ze && s && s.tagName.toUpperCase() === "SELECT") && (s = ee(s, i.draggable, t, !1), !(s && s.animated) && Ve !== s)) {
      if (De = K(s), Le = K(s, i.draggable), typeof c == "function") {
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
      } else if (c && (c = c.split(",").some(function(h) {
        if (h = ee(l, h.trim(), t, !1), h)
          return Y({
            sortable: n,
            rootEl: h,
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
      if ($ = o, u = t, O = u.parentNode, _e = u.nextSibling, Ve = t, Ye = a.group, v.dragged = u, me = {
        target: u,
        clientX: (n || e).clientX,
        clientY: (n || e).clientY
      }, $t = me.clientX - l.left, Nt = me.clientY - l.top, this._lastX = (n || e).clientX, this._lastY = (n || e).clientY, u.style["will-change"] = "all", s = function() {
        if (U("delayEnded", i, { evt: e }), v.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !Tt && i.nativeDraggable && (u.draggable = !0), i._triggerDragStart(e, n), Y({
          sortable: i,
          name: "choose",
          originalEvent: e
        }), z(u, a.chosenClass, !0);
      }, a.ignore.split(",").forEach(function(c) {
        Xt(u, c.trim(), pt);
      }), T(r, "dragover", ve), T(r, "mousemove", ve), T(r, "touchmove", ve), a.supportPointer ? (T(r, "pointerup", i._onDrop), !this.nativeDraggable && T(r, "pointercancel", i._onDrop)) : (T(r, "mouseup", i._onDrop), T(r, "touchend", i._onDrop), T(r, "touchcancel", i._onDrop)), Tt && this.nativeDraggable && (this.options.touchStartThreshold = 4, u.draggable = !0), U("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || n) && (!this.nativeDraggable || !(ot || pe))) {
        if (v.eventCanceled) {
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
    u && pt(u), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    let e = this.el.ownerDocument;
    D(e, "mouseup", this._disableDelayedDrag), D(e, "touchend", this._disableDelayedDrag), D(e, "touchcancel", this._disableDelayedDrag), D(e, "pointerup", this._disableDelayedDrag), D(e, "pointercancel", this._disableDelayedDrag), D(e, "mousemove", this._delayedDragTouchMoveHandler), D(e, "touchmove", this._delayedDragTouchMoveHandler), D(e, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(e, n) {
    n = n || e.pointerType == "touch" && e, !this.nativeDraggable || n ? this.options.supportPointer ? T(document, "pointermove", this._onTouchMove) : n ? T(document, "touchmove", this._onTouchMove) : T(document, "mousemove", this._onTouchMove) : (T(u, "dragend", this), T($, "dragstart", this._onDragStart));
    try {
      document.selection ? Ke(() => {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(e, n) {
    if (Se = !1, $ && u) {
      U("dragStarted", this, { evt: n }), this.nativeDraggable && T(document, "dragover", Dn);
      let t = this.options;
      !e && z(u, t.dragClass, !1), z(u, t.ghostClass, !0), v.active = this, e && this._appendGhost(), Y({
        sortable: this,
        name: "start",
        originalEvent: n
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (Q) {
      this._lastX = Q.clientX, this._lastY = Q.clientY, jt();
      let e = document.elementFromPoint(Q.clientX, Q.clientY), n = e;
      for (; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(Q.clientX, Q.clientY), e !== n); )
        n = e;
      if (u.parentNode[J]._isOutsideThisEl(e), n)
        do {
          if (n[J]) {
            let t;
            if (t = n[J]._onDragOver({
              clientX: Q.clientX,
              clientY: Q.clientY,
              target: e,
              rootEl: n
            }), t && !this.options.dragoverBubble)
              break;
          }
          e = n;
        } while (n = Ht(n));
      zt();
    }
  },
  _onTouchMove: function(e) {
    if (me) {
      let n = this.options, t = n.fallbackTolerance, i = n.fallbackOffset, o = e.touches ? e.touches[0] : e, a = m && Te(m, !0), r = m && a && a.a, s = m && a && a.d, l = Ge && F && Mt(F), c = (o.clientX - me.clientX + i.x) / (r || 1) + (l ? l[0] - ht[0] : 0) / (r || 1), h = (o.clientY - me.clientY + i.y) / (s || 1) + (l ? l[1] - ht[1] : 0) / (s || 1);
      if (!v.active && !Se) {
        if (t && Math.max(Math.abs(o.clientX - this._lastX), Math.abs(o.clientY - this._lastY)) < t)
          return;
        this._onDragStart(e, !0);
      }
      if (m) {
        a ? (a.e += c - (ut || 0), a.f += h - (ft || 0)) : a = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: c,
          f: h
        };
        let k = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
        g(m, "webkitTransform", k), g(m, "mozTransform", k), g(m, "msTransform", k), g(m, "transform", k), ut = c, ft = h, Q = o;
      }
      e.cancelable && e.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!m) {
      let e = this.options.fallbackOnBody ? document.body : $, n = L(u, !0, Ge, !0, e), t = this.options;
      if (Ge) {
        for (F = e; g(F, "position") === "static" && g(F, "transform") === "none" && F !== document; )
          F = F.parentNode;
        F !== document.body && F !== document.documentElement ? (F === document && (F = he()), n.top += F.scrollTop, n.left += F.scrollLeft) : F = he(), ht = Mt(F);
      }
      m = u.cloneNode(!0), z(m, t.ghostClass, !1), z(m, t.fallbackClass, !0), z(m, t.dragClass, !0), g(m, "transition", ""), g(m, "transform", ""), g(m, "box-sizing", "border-box"), g(m, "margin", 0), g(m, "top", n.top), g(m, "left", n.left), g(m, "width", n.width), g(m, "height", n.height), g(m, "opacity", "0.8"), g(m, "position", Ge ? "absolute" : "fixed"), g(m, "zIndex", "100000"), g(m, "pointerEvents", "none"), v.ghost = m, e.appendChild(m), g(m, "transform-origin", $t / parseInt(m.style.width) * 100 + "% " + Nt / parseInt(m.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(e, n) {
    let t = this, i = e.dataTransfer, o = t.options;
    if (U("dragStart", this, { evt: e }), v.eventCanceled) {
      this._onDrop();
      return;
    }
    U("setupClone", this), v.eventCanceled || (N = Rt(u), N.removeAttribute("id"), N.draggable = !1, N.style["will-change"] = "", this._hideClone(), z(N, this.options.chosenClass, !1), v.clone = N), t.cloneId = Ke(function() {
      U("clone", t), !v.eventCanceled && (t.options.removeCloneOnHide || $.insertBefore(N, u), t._hideClone(), Y({
        sortable: t,
        name: "clone"
      }));
    }), !n && z(u, o.dragClass, !0), n ? (tt = !0, t._loopId = setInterval(t._emulateDragOver, 50)) : (D(document, "mouseup", t._onDrop), D(document, "touchend", t._onDrop), D(document, "touchcancel", t._onDrop), i && (i.effectAllowed = "move", o.setData && o.setData.call(t, i, u)), T(document, "drop", t), g(u, "transform", "translateZ(0)")), Se = !0, t._dragStartId = Ke(t._dragStarted.bind(t, n, e)), T(document, "selectstart", t), Oe = !0, window.getSelection().removeAllRanges(), Ze && g(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(e) {
    let n = this.el, t = e.target, i, o, a, r = this.options, s = r.group, l = v.active, c = Ye === s, h = r.sort, k = H || l, S, C = this, f = !1;
    if (vt) return;
    function w(x, X) {
      U(x, C, {
        evt: e,
        isOwner: c,
        axis: S ? "vertical" : "horizontal",
        revert: a,
        dragRect: i,
        targetRect: o,
        canSort: h,
        fromSortable: k,
        target: t,
        completed: I,
        onMove(R, j) {
          return je($, n, u, i, R, L(R), e, j);
        },
        changed: E,
        ...X
      });
    }
    function y() {
      w("dragOverAnimationCapture"), C.captureAnimationState(), C !== k && k.captureAnimationState();
    }
    function I(x) {
      return w("dragOverCompleted", { insertion: x }), x && (c ? l._hideClone() : l._showClone(C), C !== k && (z(u, H ? H.options.ghostClass : l.options.ghostClass, !1), z(u, r.ghostClass, !0)), H !== C && C !== v.active ? H = C : C === v.active && H && (H = null), k === C && (C._ignoreWhileAnimating = t), C.animateAll(function() {
        w("dragOverAnimationComplete"), C._ignoreWhileAnimating = null;
      }), C !== k && (k.animateAll(), k._ignoreWhileAnimating = null)), (t === u && !u.animated || t === n && !t.animated) && (Ce = null), !r.dragoverBubble && !e.rootEl && t !== document && (u.parentNode[J]._isOutsideThisEl(e.target), !x && ve(e)), !r.dragoverBubble && e.stopPropagation && e.stopPropagation(), f = !0;
    }
    function E() {
      q = K(u), ue = K(u, r.draggable), Y({
        sortable: C,
        name: "change",
        toEl: n,
        newIndex: q,
        newDraggableIndex: ue,
        originalEvent: e
      });
    }
    if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), t = ee(t, r.draggable, n, !0), w("dragOver"), v.eventCanceled) return f;
    if (u.contains(e.target) || t.animated && t.animatingX && t.animatingY || C._ignoreWhileAnimating === t)
      return I(!1);
    if (tt = !1, l && !r.disabled && (c ? h || (a = O !== $) : H === this || (this.lastPutMode = Ye.checkPull(this, l, u, e)) && s.checkPut(this, l, u, e))) {
      if (S = this._getDirection(e, t) === "vertical", i = L(u), w("dragOverValid"), v.eventCanceled) return f;
      if (a)
        return O = $, y(), this._hideClone(), w("revert"), v.eventCanceled || (_e ? $.insertBefore(u, _e) : $.appendChild(u)), I(!0);
      let x = kt(n, r.draggable);
      if (!x || Mn(e, S, this) && !x.animated) {
        if (x === u)
          return I(!1);
        if (x && n === e.target && (t = x), t && (o = L(t)), je($, n, u, i, t, o, e, !!t) !== !1)
          return y(), x && x.nextSibling ? n.insertBefore(u, x.nextSibling) : n.appendChild(u), O = n, E(), I(!0);
      } else if (x && xn(e, S, this)) {
        let X = He(n, 0, r, !0);
        if (X === u)
          return I(!1);
        if (t = X, o = L(t), je($, n, u, i, t, o, e, !1) !== !1)
          return y(), n.insertBefore(u, X), O = n, E(), I(!0);
      } else if (t.parentNode === n) {
        o = L(t);
        let X = 0, R, j = u.parentNode !== n, re = !wn(u.animated && u.toRect || i, t.animated && t.toRect || o, S), xe = S ? "top" : "left", de = xt(t, "top", "top") || xt(u, "top", "top"), Me = de ? de.scrollTop : void 0;
        Ce !== t && (R = o[xe], Be = !1, Ue = !re && r.invertSwap || j), X = In(
          e,
          t,
          o,
          S,
          re ? 1 : r.swapThreshold,
          r.invertedSwapThreshold == null ? r.swapThreshold : r.invertedSwapThreshold,
          Ue,
          Ce === t
        );
        let oe;
        if (X !== 0) {
          let Fe = K(u);
          do
            Fe -= X, oe = O.children[Fe];
          while (oe && (g(oe, "display") === "none" || oe === m));
        }
        if (X === 0 || oe === t)
          return I(!1);
        Ce = t, Ae = X;
        let Ie = t.nextElementSibling, ge = !1;
        ge = X === 1;
        let se = je($, n, u, i, t, o, e, ge);
        if (se !== !1)
          return (se === 1 || se === -1) && (ge = se === 1), vt = !0, setTimeout(En, 30), y(), ge && !Ie ? n.appendChild(u) : t.parentNode.insertBefore(u, ge ? Ie : t), de && vn(de, 0, Me - de.scrollTop), O = u.parentNode, R !== void 0 && !Ue && (Je = Math.abs(R - L(t)[xe])), E(), I(!0);
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
    if (q = K(u), ue = K(u, t.draggable), U("drop", this, {
      evt: e
    }), O = u && u.parentNode, q = K(u), ue = K(u, t.draggable), v.eventCanceled) {
      this._nulling();
      return;
    }
    Se = !1, Ue = !1, Be = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), _t(this.cloneId), _t(this._dragStartId), this.nativeDraggable && (D(document, "drop", this), D(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ze && g(document.body, "user-select", ""), g(u, "transform", ""), e && (Oe && (e.cancelable && e.preventDefault(), !t.dropBubble && e.stopPropagation()), m && m.parentNode && m.parentNode.removeChild(m), ($ === O || H && H.lastPutMode !== "clone") && N && N.parentNode && N.parentNode.removeChild(N), u && (this.nativeDraggable && D(u, "dragend", this), pt(u), u.style["will-change"] = "", Oe && !Se && z(u, H ? H.options.ghostClass : this.options.ghostClass, !1), z(u, this.options.chosenClass, !1), Y({
      sortable: this,
      name: "unchoose",
      toEl: O,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: e
    }), $ !== O ? (q >= 0 && (Y({
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
    })), H && H.save()) : q !== De && q >= 0 && (Y({
      sortable: this,
      name: "update",
      toEl: O,
      originalEvent: e
    }), Y({
      sortable: this,
      name: "sort",
      toEl: O,
      originalEvent: e
    })), v.active && ((q == null || q === -1) && (q = De, ue = Le), Y({
      sortable: this,
      name: "end",
      toEl: O,
      originalEvent: e
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    U("nulling", this), $ = u = O = m = _e = N = Ve = fe = me = Q = Oe = q = ue = De = Le = Ce = Ae = H = Ye = v.dragged = v.ghost = v.clone = v.active = null, it.forEach(function(e) {
      e.checked = !0;
    }), it.length = ut = ft = 0;
  },
  handleEvent: function(e) {
    switch (e.type) {
      case "drop":
      case "dragend":
        this._onDrop(e);
        break;
      case "dragenter":
      case "dragover":
        u && (this._onDragOver(e), Tn(e));
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
      n = t[i], ee(n, a.draggable, this.el, !1) && e.push(n.getAttribute(a.dataIdAttr) || Nn(n));
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
      let i = Re.modifyOption(this, e, n);
      typeof i < "u" ? t[e] = i : t[e] = n, e === "group" && Gt(t);
    }
  },
  /**
   * Destroy
   */
  destroy: function() {
    U("destroy", this);
    let e = this.el;
    e[J] = null, D(e, "mousedown", this._onTapStart), D(e, "touchstart", this._onTapStart), D(e, "pointerdown", this._onTapStart), this.nativeDraggable && (D(e, "dragover", this), D(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(n) {
      n.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), nt.splice(nt.indexOf(this.el), 1), this.el = e = null;
  },
  _hideClone: function() {
    if (!fe) {
      if (U("hideClone", this), v.eventCanceled) return;
      g(N, "display", "none"), this.options.removeCloneOnHide && N.parentNode && N.parentNode.removeChild(N), fe = !0;
    }
  },
  _showClone: function(e) {
    if (e.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (fe) {
      if (U("showClone", this), v.eventCanceled) return;
      u.parentNode == $ && !this.options.group.revertClone ? $.insertBefore(N, u) : _e ? $.insertBefore(N, _e) : $.appendChild(N), this.options.group.revertClone && this.animate(u, N), g(N, "display", ""), fe = !1;
    }
  }
};
function Tn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function je(e, n, t, i, o, a, r, s) {
  let l, c = e[J], h = c.options.onMove, k;
  return window.CustomEvent && !pe && !ot ? l = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = n, l.from = e, l.dragged = t, l.draggedRect = i, l.related = o || n, l.relatedRect = a || L(n), l.willInsertAfter = s, l.originalEvent = r, e.dispatchEvent(l), h && (k = h.call(c, l, r)), k;
}
function pt(e) {
  e.draggable = !1;
}
function En() {
  vt = !1;
}
function xn(e, n, t) {
  let i = L(He(t.el, 0, t.options, !0));
  const o = Ft(t.el, t.options, m), a = 10;
  return n ? e.clientX < o.left - a || e.clientY < i.top && e.clientX < i.right : e.clientY < o.top - a || e.clientY < i.bottom && e.clientX < i.left;
}
function Mn(e, n, t) {
  const i = L(kt(t.el, t.options.draggable)), o = Ft(t.el, t.options, m), a = 10;
  return n ? e.clientX > o.right + a || e.clientY > i.bottom && e.clientX > i.left : e.clientY > o.bottom + a || e.clientX > i.right && e.clientY > i.top;
}
function In(e, n, t, i, o, a, r, s) {
  let l = i ? e.clientY : e.clientX, c = i ? t.height : t.width, h = i ? t.top : t.left, k = i ? t.bottom : t.right, S = !1;
  if (!r) {
    if (s && Je < c * o) {
      if (!Be && (Ae === 1 ? l > h + c * a / 2 : l < k - c * a / 2) && (Be = !0), Be)
        S = !0;
      else if (Ae === 1 ? l < h + Je : l > k - Je)
        return -Ae;
    } else if (l > h + c * (1 - o) / 2 && l < k - c * (1 - o) / 2)
      return $n(n);
  }
  return S = S || r, S && (l < h + c * a / 2 || l > k - c * a / 2) ? l > h + c / 2 ? 1 : -1 : 0;
}
function $n(e) {
  return K(u) < K(e) ? 1 : -1;
}
function Nn(e) {
  let n = e.tagName + e.className + e.src + e.href + e.textContent, t = n.length, i = 0;
  for (; t--; )
    i += n.charCodeAt(t);
  return i.toString(36);
}
function Wn(e) {
  it.length = 0;
  let n = e.getElementsByTagName("input"), t = n.length;
  for (; t--; ) {
    let i = n[t];
    i.checked && it.push(i);
  }
}
function Ke(e) {
  return setTimeout(e, 0);
}
function _t(e) {
  return clearTimeout(e);
}
at && T(document, "touchmove", function(e) {
  (v.active || Se) && e.cancelable && e.preventDefault();
});
v.utils = {
  on: T,
  off: D,
  css: g,
  find: Xt,
  is: function(e, n) {
    return !!ee(e, n, e, !1);
  },
  extend: gn,
  throttle: mn,
  closest: ee,
  toggleClass: z,
  clone: Rt,
  index: K,
  nextTick: Ke,
  cancelNextTick: _t,
  detectDirection: Ut,
  getChild: He,
  expando: J
};
v.get = function(e) {
  return e[J];
};
v.mount = function(...e) {
  e[0].constructor === Array && (e = e[0]), e.forEach((n) => {
    if (!n.prototype || !n.prototype.constructor)
      throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(n)}`;
    n.utils && (v.utils = { ...v.utils, ...n.utils }), Re.mount(n);
  });
};
v.create = function(e, n) {
  return new v(e, n);
};
v.version = "1.15.6";
const On = { class: "headWrapper" }, Pn = { class: "skillname" }, Ln = ["onClick"], An = ["onClick"], Bn = ["innerHTML"], Hn = {
  key: 0,
  class: "derivationBox"
}, Xn = ["onClick"], Rn = { class: "derivationBody" }, Fn = { class: "headWrapper" }, Yn = { class: "dskillname" }, Un = ["onClick"], Gn = ["onClick"], jn = ["innerHTML"], zn = {
  key: 1,
  class: "derivationBox derivationCardBox"
}, qn = ["onClick"], Zn = { class: "derivationBody" }, Vn = { class: "cardText" }, Jn = { class: "cardName" }, Kn = ["innerHTML"];
let we = null;
const Qn = () => {
  if (we) return we;
  we = /* @__PURE__ */ new Map();
  for (const e in Z.card) {
    const n = Z.card[e]?.skills;
    if (Array.isArray(n))
      for (const t of n)
        we.has(t) || we.set(t, e);
  }
  return we;
}, ei = {
  __name: "SkillPanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = A(null);
    let i = null;
    const o = A([]), a = /* @__PURE__ */ new Map(), r = (f, w) => {
      w ? a.set(f, w) : a.delete(f);
    }, s = (f) => {
      const w = Z.skill[f];
      if (typeof w?.frequent == "boolean")
        return Z.config.autoskilllist.includes(f) ? !1 : w.frequent;
    }, l = (f) => {
      let w = te.skillInfoTranslation(f, void 0, !1);
      return Z.translate[`${f}_append`] && (w += `<br>${te.translation(`${f}_append`)}`), w;
    }, c = (f) => {
      if (Z.skill[f]?.equipSkill) {
        const w = Qn().get(f);
        return w ? { type: "card", id: w } : { type: "skill", id: f };
      }
      return Z.card[f] ? { type: "card", id: f } : { type: "skill", id: f };
    }, h = () => {
      const f = te.character(n.name)?.skills || [], w = [];
      for (const y of f) {
        const I = s(y), E = {
          id: y,
          label: te.translation(y),
          frequent: I,
          auto: I,
          info: l(y),
          derivations: [],
          cards: [],
          //两块衍生区默认展开，点标题旁的按钮折叠
          foldDerivations: !1,
          foldCards: !1
        }, x = Z.skill[y]?.derivation, X = Array.isArray(x) ? x : x ? [x] : [];
        for (const R of X) {
          const j = c(R);
          if (j.type === "card") {
            E.cards.push({ id: j.id, label: te.translation(j.id), info: l(j.id) });
            continue;
          }
          const re = s(R);
          E.derivations.push({ id: R, label: te.translation(R), frequent: re, auto: re, info: l(R) });
        }
        w.push(E);
      }
      return w;
    }, k = () => {
      for (const f of o.value)
        for (const w of f.cards) {
          const y = a.get(`${f.id}|${w.id}`);
          if (!y || y.hasChildNodes()) continue;
          const I = Qe.createCard(w.id);
          mt.create.buttons([I], "card", y, !0), I.remove();
        }
    };
    function S(f) {
      We.playSkillAudio(f, n.name);
    }
    function C(f) {
      f.auto = !f.auto, f.auto ? Z.config.autoskilllist.remove(f.id) : Z.config.autoskilllist.add(f.id), Qe.saveConfig("autoskilllist", Z.config.autoskilllist);
    }
    return yt(async () => {
      o.value = h(), await Pt(), k(), i = new v(t.value, {
        draggable: ".skillWrapper",
        animation: 150,
        handle: ".dragHandle"
      });
    }), nn(() => {
      i?.destroy?.(), i = null, a.clear();
    }), (f, w) => (p(), _("div", {
      ref_key: "listEl",
      ref: t,
      class: "skillList"
    }, [
      (p(!0), _(G, null, ne(o.value, (y, I) => (p(), _("div", {
        key: I,
        class: "skillWrapper"
      }, [
        d("div", On, [
          w[0] || (w[0] = d("div", { class: "dragHandle" }, "≡", -1)),
          d("div", Pn, B(y.label), 1),
          d("div", {
            class: "audioBtn",
            onClick: (E) => S(y.id)
          }, null, 8, Ln),
          y.frequent !== void 0 ? (p(), _("div", {
            key: 0,
            class: V(["autoSkill", y.auto ? "autoSkillOpened" : "autoSkillClosed"]),
            onClick: (E) => C(y)
          }, " 自动发动 ", 10, An)) : ie("", !0)
        ]),
        d("div", {
          class: "skillInfo",
          innerHTML: y.info
        }, null, 8, Bn),
        y.derivations.length ? (p(), _("div", Hn, [
          d("div", {
            class: V(["derivationTitle", { derivationTitleFolded: y.foldDerivations }]),
            onClick: (E) => y.foldDerivations = !y.foldDerivations
          }, " 衍生技能 ", 10, Xn),
          wt(d("div", Rn, [
            (p(!0), _(G, null, ne(y.derivations, (E) => (p(), _("div", {
              key: E.id,
              class: "derivationItem"
            }, [
              d("div", Fn, [
                d("div", Yn, B(E.label), 1),
                d("div", {
                  class: "audioBtn",
                  onClick: (x) => S(y.id)
                }, null, 8, Un),
                E.frequent !== void 0 ? (p(), _("div", {
                  key: 0,
                  class: V(["autoSkill", E.auto ? "autoSkillOpened" : "autoSkillClosed"]),
                  onClick: (x) => C(E)
                }, " 自动发动 ", 10, Gn)) : ie("", !0)
              ]),
              d("div", {
                class: "derivationInfo",
                innerHTML: E.info
              }, null, 8, jn)
            ]))), 128))
          ], 512), [
            [St, !y.foldDerivations]
          ])
        ])) : ie("", !0),
        y.cards.length ? (p(), _("div", zn, [
          d("div", {
            class: V(["derivationTitle", { derivationTitleFolded: y.foldCards }]),
            onClick: (E) => y.foldCards = !y.foldCards
          }, " 衍生卡牌 ", 10, qn),
          wt(d("div", Zn, [
            (p(!0), _(G, null, ne(y.cards, (E) => (p(), _("div", {
              key: E.id,
              class: "derivationCardItem"
            }, [
              d("div", {
                class: "derivationCards buttons",
                ref_for: !0,
                ref: (x) => r(y.id + "|" + E.id, x)
              }, null, 512),
              d("div", Vn, [
                d("div", Jn, B(E.label), 1),
                d("div", {
                  class: "derivationInfo",
                  innerHTML: E.info
                }, null, 8, Kn)
              ])
            ]))), 128))
          ], 512), [
            [St, !y.foldCards]
          ])
        ])) : ie("", !0)
      ]))), 128))
    ], 512));
  }
}, ti = /* @__PURE__ */ Ee(ei, [["__scopeId", "data-v-14e833c9"]]), ni = { class: "skinList" }, ii = ["onClick"], oi = { class: "skinAvatorWrapper" }, ai = { class: "skinTextWrapper" }, ri = { class: "skinText" }, si = {
  key: 0,
  class: "skinSelectedSJZX"
}, li = {
  __name: "SkinPanel",
  props: { name: { type: String, required: !0 } },
  emits: ["skinChange"],
  setup(e, { emit: n }) {
    const t = e, i = n, o = P(() => {
      const s = ae.getCharacterSkin(t.name) || {};
      return Object.keys(s).map((l) => ({ name: l, path: s[l] }));
    }), a = A(ae.getCurentSkin(t.name));
    function r(s) {
      s.name !== a.value && ae.setCharacterSkin(t.name, s.name) && (a.value = s.name, i("skinChange", { skinName: s.name, path: s.path }));
    }
    return (s, l) => (p(), _("div", ni, [
      (p(!0), _(G, null, ne(o.value, (c) => (p(), _("div", {
        key: c.name,
        class: V(["skinListWrapper", { skinListSelectedWrapper: c.name === a.value }]),
        onClick: (h) => r(c)
      }, [
        d("div", oi, [
          d("div", {
            class: "imageSkin",
            style: ye({ backgroundImage: `url('${c.path}')` })
          }, null, 4)
        ]),
        d("div", ai, [
          d("div", ri, B(c.name), 1)
        ]),
        c.name === a.value ? (p(), _("div", si)) : ie("", !0)
      ], 10, ii))), 128))
    ]));
  }
}, ci = /* @__PURE__ */ Ee(li, [["__scopeId", "data-v-7d4d9e46"]]), di = { class: "moduleList" }, ui = ["onClick"], fi = { class: "modulesTitle" }, hi = { class: "modulesInfoWrapper" }, pi = { class: "modulesInfo" }, gi = ["innerHTML"], mi = ["innerHTML"], vi = {
  key: 1,
  class: "modulesSelectedSJZX"
}, _i = {
  __name: "ModulePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = A(0), i = P(() => {
      t.value;
      const s = qe.getCharModules(n.name, !1) || {};
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
    }), o = P(() => (t.value, qe.getCharModules(n.name)?.id));
    function a(s) {
      s !== o.value && (qe.setCharModules(n.name, s), t.value++, Lt.showToast("[驶舰之向] 更换模组后部分效果可能需要重启才能生效"));
    }
    function r(s) {
      return s ? (Array.isArray(s) ? s : [s]).map((c) => typeof c == "function" ? c() : c).join("<br>") : "";
    }
    return (s, l) => (p(), _("div", di, [
      (p(!0), _(G, null, ne(i.value, (c) => (p(), _("div", {
        key: c.id,
        class: V(["charModulesWrapper", { modulesSelectedWrapper: c.id === o.value }]),
        onClick: (h) => a(c.id)
      }, [
        d("div", fi, B(c.name), 1),
        d("div", hi, [
          d("div", {
            class: "modulesImage",
            style: ye({ backgroundImage: `url('${c.url}')` })
          }, null, 4),
          d("div", pi, [
            (p(!0), _(G, null, ne(c.intro, (h, k) => (p(), _("div", {
              key: k,
              class: "infoText",
              innerHTML: h
            }, null, 8, gi))), 128))
          ])
        ]),
        c.effectIntro ? (p(), _(G, { key: 0 }, [
          l[0] || (l[0] = d("div", { class: "modulesEffectTitle" }, "模组效果", -1)),
          d("div", {
            class: "modulesEffectInfo",
            innerHTML: c.effectIntro
          }, null, 8, mi)
        ], 64)) : ie("", !0),
        c.id === o.value ? (p(), _("div", vi)) : ie("", !0)
      ], 10, ui))), 128))
    ]));
  }
}, yi = /* @__PURE__ */ Ee(_i, [["__scopeId", "data-v-e86d65dc"]]), bi = { class: "charInfoWrapper" }, ki = ["innerHTML"], Ci = {
  __name: "ResumePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = P(() => te.characterIntro(n.name) || "");
    return (i, o) => (p(), _("div", bi, [
      o[0] || (o[0] = d("div", { class: "charTitle" }, "干员档案", -1)),
      d("div", {
        class: "charInfo",
        innerHTML: t.value
      }, null, 8, ki)
    ]));
  }
}, wi = /* @__PURE__ */ Ee(Ci, [["__scopeId", "data-v-489a3cf2"]]), qt = "characterCardBackgroundSource", Si = {
  featured: "精选",
  all: "全部"
};
function Di() {
  return Pe.config(qt) === "all" ? "all" : "featured";
}
const Ti = { class: "backgroundPanel" }, Ei = {
  key: 0,
  class: "backgroundLoading"
}, xi = {
  key: 1,
  class: "backgroundLoading"
}, Mi = { class: "backgroundList" }, Ii = ["onClick"], $i = ["src"], Ni = { class: "backgroundText" };
let gt = null;
const Wi = {
  __name: "BackgroundPanel",
  props: {
    /** 当前选中的背景值（`<scheme>:<相对路径>`） */
    value: { type: String, default: "" }
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const t = n, i = A([]), o = A(!0), a = { dir: "dybg:", prefix: "dybg:" }, r = {
      featured: [a],
      all: [a, { dir: "ui:background/", prefix: "ui:background/" }, { dir: "bg:", prefix: "bg:" }]
    };
    return yt(async () => {
      const s = Di();
      if (gt?.mode === s) {
        i.value = gt.list, o.value = !1;
        return;
      }
      try {
        const l = dn.getBackgroundData?.() || {}, c = [];
        for (const { dir: h, prefix: k } of r[s]) {
          const C = ((await le.getFileTree(h, 0))?.files || []).slice().sort((f, w) => f.name.localeCompare(w.name));
          for (const f of C) {
            const w = k + f.name, y = f.name.replace(/\.[^.]+$/, "");
            c.push({ value: w, url: le.compilePath(w), label: l[y] || y });
          }
        }
        gt = { mode: s, list: c }, i.value = c;
      } catch (l) {
        console.warn("[WhichWay] 读取武将卡背景列表失败：", l);
      } finally {
        o.value = !1;
      }
    }), (s, l) => (p(), _("div", Ti, [
      l[0] || (l[0] = d("div", { class: "backgroundHint" }, "点击选择武将卡背景", -1)),
      o.value ? (p(), _("div", Ei, "正在读取背景列表…")) : i.value.length ? ie("", !0) : (p(), _("div", xi, "没有找到可用的背景图片")),
      d("div", Mi, [
        (p(!0), _(G, null, ne(i.value, (c) => (p(), _("div", {
          key: c.value,
          class: V(["backgroundItem", { backgroundSelected: c.value === e.value }]),
          onClick: (h) => t("select", c.value)
        }, [
          d("img", {
            class: "backgroundPreview",
            src: c.url,
            loading: "lazy",
            decoding: "async",
            fetchpriority: "low",
            alt: ""
          }, null, 8, $i),
          d("div", Ni, B(c.label), 1)
        ], 10, Ii))), 128))
      ])
    ]));
  }
}, Oi = /* @__PURE__ */ Ee(Wi, [["__scopeId", "data-v-d493a85a"]]), Pi = { class: "camplogo-wrapper" }, Li = {
  key: 0,
  class: "group-text"
}, Ai = { class: "topMenu-wrapper" }, Bi = { class: "imageBox" }, Hi = ["src"], Xi = ["onClick"], Ri = { class: "btn-enSJZX" }, Fi = { class: "btn-cnSJZX" }, Yi = { class: "btnImage-wrapper" }, Ui = ["src"], Gi = { class: "skinnameAudio-wrapper" }, ji = { class: "skinnameWrapper" }, zi = { class: "titleWrapper" }, qi = { class: "imageWrapper" }, Zi = ["src"], Vi = { class: "textWrapper" }, Ji = { class: "designerWrapper" }, Ki = { class: "titleWrapper" }, Qi = { class: "imageWrapper" }, eo = ["src"], to = { class: "textWrapper" }, no = { class: "audioTitleWrapper" }, io = { class: "imageWrapper" }, oo = ["src"], ao = { class: "textWrapper" }, ro = ["src"], so = { class: "content" }, lo = ["onClick"], co = { class: "selectTextSJZX" }, uo = { class: "charName-wrapper" }, fo = { class: "charNameTitleWrapper" }, ho = ["innerHTML"], po = { class: "charNameTextWrapper" }, go = ["innerHTML"], mo = { class: "hpWrapper" }, vo = { class: "hpNumWrapper" }, _o = { class: "hpNumText" }, yo = {
  key: 0,
  class: "hpNumWrapper"
}, bo = { class: "hpNumText" }, ko = {
  key: 0,
  class: "charDycWrapper"
}, Co = {
  key: 1,
  class: "charImageWrapper"
}, wo = { class: "buttonText" }, So = { class: "displayArenaSJZX" }, Do = {
  key: 2,
  class: "UseLLMTips-wrapper"
}, To = { class: "LLM-wrapper" }, Eo = { class: "LLM-Icon" }, xo = ["src"], Mo = { class: "LLM-Text" }, ze = "ui:background/default.png", Io = {
  __name: "CharacterCard",
  props: {
    /** 武将名（char id） */
    name: { type: String, required: !0 },
    /** 关闭回调：由 WhichWayCharacterCard 卸载应用并复原 */
    onClose: { type: Function, default: null }
  },
  setup(e) {
    const n = e, t = A(Pe.config("characterCardBackground") || ze), i = A(t.value), o = A(!1), a = P(() => le.compilePath(i.value)), r = P(() => ({ backgroundImage: `url("${o.value ? le.compilePath(ze) : a.value}")` })), s = A("skill"), l = (b) => le.compilePath(`ui:${b}`), c = (b) => le.compilePath(`logo:${b}`), h = P(() => {
      const b = rn(n.name), W = te.character(n.name), M = W?.whichWay?.arknight?.camp, $e = sn(W?.group, Pe.getCharExtConfig(n.name)?.reallyGroup, M), st = M || $e?.logo || $e?.reallyGroup, Ct = $e?.filter ?? !!st;
      return st ? { useFilter: Ct, logoUrl: `${le.extDir}image/camplogo/arknight/${st}.png`, text: "" } : b ? { useFilter: Ct, logoUrl: `${le.extDir}image/camplogo/noname/name_${b}.png`, text: "" } : { useFilter: !1, logoUrl: "", text: Z.translate[W?.group] || "" };
    }), k = P(() => Z.characterTitle[n.name] || ""), S = P(() => te.translation(n.name)), C = P(() => {
      const { maxHp: b = 0, hp: W = 0, hujia: M = 0 } = te.character(n.name) || {};
      return { maxHp: b, hp: W, hujia: M };
    }), f = P(() => {
      const b = [
        { key: "resume", en: "QUIT", cn: "简介", image: "resume.png" },
        { key: "skill", en: "SKILL", cn: "技能", image: "skill.png" },
        { key: "skin", en: "SKIN", cn: "皮肤", image: "skin.png" }
      ];
      return qe.getCharModules(n.name, !1) && b.push({ key: "mode", en: "MODE", cn: "模组", image: "mode.png" }), b.push({ key: "background", en: "BG", cn: "背景", image: "back_switch.png" }), b;
    }), w = A(ae.getCurentSkin(n.name)), y = P(() => ln(n.name).join("、")), I = A(null), E = A(null), x = A(ae.getCurrentSkinPath(n.name)), X = P(() => {
      const b = x.value;
      return { backgroundImage: b.startsWith("url") ? b : `url("${b}")` };
    }), R = A(!1), j = A(!1);
    function re() {
      const b = ae.getCurentSkin(n.name);
      R.value = !!be.getSkinData(n.name, b), j.value = be.isEnabledSkin(n.name, b);
    }
    const xe = P(() => R.value && j.value && be.needEnable()), de = P(() => xe.value ? E.value : I.value);
    async function Me() {
      await Pt(), de.value && await be.updateDyc(n.name, de.value);
    }
    const oe = A(We.getCharacterLang(n.name)), Ie = P(() => We.getCharacterAvailableLang(n.name) || []), ge = P(() => We.getCharacterLang(n.name, !0)), se = A(!0), Fe = (b) => an.getVoiceLangTranslation(b);
    async function Zt(b) {
      if (b !== oe.value) {
        if (!window.whichWaySave.hasChar(n.name)) {
          Lt.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
          return;
        }
        await We.setCustomAudio(n.name, b), oe.value = b;
      }
    }
    async function Vt({ skinName: b, path: W }) {
      w.value = b, x.value = ae.getCurrentSkinPath(n.name), re(), await Me(), ae.refreshSkin();
    }
    function Jt(b) {
      if (b === t.value) return;
      t.value = b, o.value = !1, Pe.saveConfig("characterCardBackground", b);
      const W = new Image();
      W.decoding = "async", W.src = le.compilePath(b);
      const M = () => {
        t.value === b && (i.value = b);
      };
      W.decode().then(M, M);
    }
    async function Kt() {
      const b = ae.getCurentSkin(n.name);
      await be.toggleDycSkin(n.name, b), re(), await Me();
      for (const W of Qe.players)
        te.name(W) === n.name && await be.updateDyc(n.name, W);
    }
    function Qt() {
      typeof n.onClose == "function" && n.onClose();
    }
    yt(async () => {
      if (i.value !== ze) {
        const b = new Image();
        b.onerror = () => {
          i.value !== ze && (o.value = !0);
        }, b.src = a.value;
      }
      re(), await Me();
    });
    const rt = P(() => cn(n.name)), en = P(() => rt.value ?? "占位符"), tn = P(() => {
      const b = rt.value?.split("-")[0];
      return c((b || "deepseek") + ".png");
    });
    return (b, W) => (p(), _("div", {
      class: "container-CC-SJZX",
      style: ye(r.value)
    }, [
      d("div", Pi, [
        d("div", {
          class: V(["img-def", { arknightCamp: h.value.useFilter }]),
          style: ye(h.value.logoUrl ? { backgroundImage: `url('${h.value.logoUrl}')` } : null)
        }, [
          !h.value.logoUrl && h.value.text ? (p(), _("div", Li, B(h.value.text), 1)) : ie("", !0)
        ], 6)
      ]),
      d("div", Ai, [
        d("div", {
          class: "btn-back",
          onClick: Qt
        }, [
          d("div", Bi, [
            d("img", {
              src: l("back.png"),
              alt: ""
            }, null, 8, Hi)
          ])
        ]),
        (p(!0), _(G, null, ne(f.value, (M) => (p(), _("div", {
          key: M.key,
          class: V(["btn-background", { "btn-selected-SJZX": s.value === M.key }]),
          onClick: ($e) => s.value = M.key
        }, [
          d("div", Ri, B(M.en), 1),
          d("div", Fi, B(M.cn), 1),
          d("div", Yi, [
            d("img", {
              class: "btn-img",
              src: l(M.image),
              alt: ""
            }, null, 8, Ui)
          ])
        ], 10, Xi))), 128))
      ]),
      d("div", Gi, [
        d("div", ji, [
          d("div", zi, [
            d("div", qi, [
              d("img", {
                src: l("painter.png"),
                alt: ""
              }, null, 8, Zi)
            ]),
            d("div", Vi, B(w.value), 1)
          ])
        ]),
        d("div", Ji, [
          d("div", Ki, [
            d("div", Qi, [
              d("img", {
                class: "imageLimit",
                src: l("designer.png"),
                alt: ""
              }, null, 8, eo)
            ]),
            d("div", to, B(y.value), 1)
          ])
        ]),
        d("div", {
          class: "audioWrapper",
          style: ye(se.value ? null : { height: `${(Ie.value.length + 1) * 50}px` })
        }, [
          d("div", no, [
            d("div", io, [
              d("img", {
                src: l("cv.png"),
                alt: ""
              }, null, 8, oo)
            ]),
            d("div", ao, B(ge.value), 1),
            d("div", {
              class: "collapseWrapper",
              onClick: W[0] || (W[0] = (M) => se.value = !se.value)
            }, [
              d("img", {
                src: l(se.value ? "plus.png" : "sub.png"),
                style: { height: "50%" },
                alt: ""
              }, null, 8, ro)
            ])
          ]),
          d("div", so, [
            (p(!0), _(G, null, ne(Ie.value, (M) => (p(), _("div", {
              key: M,
              class: "selectWrapper",
              onClick: ($e) => Zt(M)
            }, [
              d("div", {
                class: V(M === oe.value ? "choice" : "nochoice")
              }, null, 2),
              d("div", {
                class: V(M === oe.value ? "choice-contentTextWrapper" : "nochoice-contentTextWrapper")
              }, [
                d("div", co, B(Fe(M)), 1)
              ], 2)
            ], 8, lo))), 128))
          ])
        ], 4)
      ]),
      d("div", uo, [
        d("div", fo, [
          d("div", {
            class: "charNameTitle",
            innerHTML: k.value
          }, null, 8, ho)
        ]),
        d("div", po, [
          d("div", {
            class: "charNameText",
            innerHTML: S.value
          }, null, 8, go)
        ]),
        d("div", mo, [
          C.value.maxHp + C.value.hujia > 6 ? (p(), _(G, { key: 0 }, [
            d("div", vo, [
              W[1] || (W[1] = d("div", { class: "actualHpSJZX" }, null, -1)),
              d("div", _o, B(C.value.hp) + "/" + B(C.value.maxHp), 1)
            ]),
            C.value.hujia > 0 ? (p(), _("div", yo, [
              W[2] || (W[2] = d("div", { class: "shieldSJZX" }, null, -1)),
              d("div", bo, B(C.value.hujia), 1)
            ])) : ie("", !0)
          ], 64)) : (p(), _(G, { key: 1 }, [
            (p(!0), _(G, null, ne(C.value.maxHp, (M) => (p(), _("div", {
              key: `hp${M}`,
              class: V(M <= C.value.hp ? "actualHpSJZX" : "emptyHpSJZX")
            }, null, 2))), 128)),
            (p(!0), _(G, null, ne(C.value.hujia, (M) => (p(), _("div", {
              key: `shield${M}`,
              class: "shieldSJZX"
            }))), 128))
          ], 64))
        ])
      ]),
      xe.value ? (p(), _("div", ko, [
        d("div", {
          ref_key: "charDycEl",
          ref: E,
          class: "charDyc"
        }, null, 512)
      ])) : (p(), _("div", Co, [
        d("div", {
          ref_key: "charImageEl",
          ref: I,
          class: "charImage",
          style: ye(X.value)
        }, null, 4)
      ])),
      d("div", {
        class: "charSkinBottomUIWrapper",
        style: ye({ display: R.value ? "" : "none" })
      }, [
        d("div", {
          class: V(["buttonWrapper", { "buttonWrapper-enableSkinBG": j.value }]),
          onClick: Kt
        }, [
          d("div", wo, B(j.value ? "关闭动皮" : "开启动皮"), 1)
        ], 2)
      ], 4),
      d("div", So, [
        s.value === "skill" ? (p(), Ne(ti, {
          key: 0,
          name: e.name
        }, null, 8, ["name"])) : s.value === "skin" ? (p(), Ne(ci, {
          key: 1,
          name: e.name,
          onSkinChange: Vt
        }, null, 8, ["name"])) : s.value === "mode" ? (p(), Ne(yi, {
          key: 2,
          name: e.name
        }, null, 8, ["name"])) : s.value === "background" ? (p(), Ne(Oi, {
          key: 3,
          value: t.value,
          onSelect: Jt
        }, null, 8, ["value"])) : (p(), Ne(wi, {
          key: 4,
          name: e.name
        }, null, 8, ["name"]))
      ]),
      rt.value ? (p(), _("div", Do, [
        d("div", To, [
          d("div", Eo, [
            d("img", {
              src: tn.value,
              alt: "",
              class: "imageLimit"
            }, null, 8, xo)
          ]),
          d("div", Mo, B(en.value), 1)
        ]),
        W[3] || (W[3] = d("div", { class: "LLM-Content" }, "技能代码由AI生成", -1))
      ])) : ie("", !0)
    ], 4));
  }
}, $o = /* @__PURE__ */ Ee(Io, [["__scopeId", "data-v-a8e1654c"]]), Ot = "enableWhichWayCharacterCardStyle";
class No {
  /** 当前武将卡的 Vue 应用与挂载容器（同一时刻只会存在一张卡） */
  #e = null;
  #t = null;
  constructor() {
    un({
      name: "whichWayCharacterCardStyleOverride_add",
      fn() {
        Object.defineProperty(mt.click, "charactercard", {
          value: mt.click.charactercard,
          writable: !0,
          configurable: !0,
          enumerable: !0
        }), hn.appendHook("ui.click.charactercard", {
          before: function(n, t, i, o, a, r) {
            if (Xe.shouldUseStyle(n))
              return Xe.create(n), !1;
          }
        });
      }
    }), Dt({
      name: "whichWayCharacterCardStyleConfig_add",
      priority: 770,
      obj: {
        name: Ot,
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
    }), Dt({
      name: "whichWayCharacterCardBackgroundSourceConfig_add",
      priority: 769,
      obj: {
        name: qt,
        options: {
          name: "武将卡背景来源",
          intro: "武将卡「背景」面板扫描哪些目录（精选：仅 dynamicSkin/background，省性能；全部：再加上 image/background 与 image/ui/background）",
          init: "featured",
          item: Si
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
    const n = Pe.config(Ot);
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
    const l = on($o, {
      name: n,
      onClose: () => this.close()
    });
    l.mount(s), this.#e = l, this.#t = s;
  }
  /** 关闭武将卡：卸载 Vue 应用、移除容器，并让场上玩家头像与动皮同步 */
  close() {
    this.#e?.unmount(), this.#e = null, this.#t?.remove(), this.#t = null, ae.refreshSkin(), Qe.resume2();
  }
}
const Xe = new No();
fn({
  name: "whichwayCharacterCard_dev",
  fn: () => {
    window.whichWayCharacterCard = Xe;
  }
});
window.whichWay.register("characterCard", Xe);
const zo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayCharacterCard: Xe
}, Symbol.toStringTag, { value: "Module" }));
export {
  yi as M,
  zo as i,
  Xe as w
};
