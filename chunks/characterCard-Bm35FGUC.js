import { get as z, lib as ge, game as ut, ui as gt } from "noname";
import { ref as H, onMounted as dt, onBeforeUnmount as Lt, openBlock as y, createElementBlock as w, Fragment as q, renderList as ee, createElementVNode as d, normalizeClass as K, toDisplayString as B, createCommentVNode as me, computed as F, normalizeStyle as ae, createBlock as De, createApp as Xt } from "vue";
import { whichWayFile as be } from "./file-CXhVBbUa.js";
import { whichWayUtil as He } from "./utill-DpF3UCI4.js";
import { w as Q, s as de } from "./skin-confOverride-shared-6cQoTXiO.js";
import { whichWayAudio as Te } from "./audio-C8ufhcsM.js";
import { whichWayToast as Dt } from "./toast-BKImUKDM.js";
import { whichWayArknight as Bt } from "./arknight-B76Ucf1-.js";
import { whichWayCharacterModules as Re } from "./modules-CttU88aU.js";
import { b as Ht, c as Rt, g as Ft } from "./packs-base-characterDesigner-shared-CffpBhTy.js";
import { _ as ke } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { w as Yt } from "./config-data-shared-Dp8x7s31.js";
import { onContent as Ut, onConfig as Gt, onSetDev as jt } from "./hooks-BscfO9lD.js";
import { whichWayAPIOverride as zt } from "./override-B27IQjje.js";
function te(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
const le = te(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Je = te(/Edge/i), mt = te(/firefox/i), Fe = te(/safari/i) && !te(/chrome/i) && !te(/android/i), ft = te(/iP(ad|od|hone)/i), Tt = te(/chrome/i) && te(/android/i), Et = {
  capture: !1,
  passive: !1
};
function k(e, n, t) {
  e.addEventListener(n, t, !le && Et);
}
function C(e, n, t) {
  e.removeEventListener(n, t, !le && Et);
}
function je(e, n) {
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
function xt(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode;
}
function J(e, n, t, i) {
  if (e) {
    t = t || document;
    do {
      if (n != null && (n[0] === ">" ? e.parentNode === t && je(e, n) : je(e, n)) || i && e === t)
        return e;
      if (e === t) break;
    } while (e = xt(e));
  }
  return null;
}
const vt = /\s+/g;
function Y(e, n, t) {
  if (e && n)
    if (e.classList)
      e.classList[t ? "add" : "remove"](n);
    else {
      let i = (" " + e.className + " ").replace(vt, " ").replace(" " + n + " ", " ");
      e.className = (i + (t ? " " + n : "")).replace(vt, " ");
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
function Ce(e, n) {
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
function It(e, n, t) {
  if (e) {
    let i = e.getElementsByTagName(n), o = 0, a = i.length;
    if (t)
      for (; o < a; o++)
        t(i[o], o);
    return i;
  }
  return [];
}
function se() {
  let e = document.scrollingElement;
  return e || document.documentElement;
}
function N(e, n, t, i, o) {
  if (!e.getBoundingClientRect && e !== window) return;
  let a, r, s, c, l, f, p;
  if (e !== window && e.parentNode && e !== se() ? (a = e.getBoundingClientRect(), r = a.top, s = a.left, c = a.bottom, l = a.right, f = a.height, p = a.width) : (r = 0, s = 0, c = window.innerHeight, l = window.innerWidth, f = window.innerHeight, p = window.innerWidth), (n || t) && e !== window && (o = o || e.parentNode, !le))
    do
      if (o && o.getBoundingClientRect && (g(o, "transform") !== "none" || t && g(o, "position") !== "static")) {
        let h = o.getBoundingClientRect();
        r -= h.top + parseInt(g(o, "border-top-width")), s -= h.left + parseInt(g(o, "border-left-width")), c = r + a.height, l = s + a.width;
        break;
      }
    while (o = o.parentNode);
  if (i && e !== window) {
    let h = Ce(o || e), _ = h && h.a, S = h && h.d;
    h && (r /= S, s /= _, p /= _, f /= S, c = r + f, l = s + p);
  }
  return {
    top: r,
    left: s,
    bottom: c,
    right: l,
    width: p,
    height: f
  };
}
function _t(e, n, t) {
  let i = bt(e, !0), o = N(e)[n];
  for (; i; ) {
    let a = N(i)[t], r;
    if (r = o >= a, !r) return i;
    if (i === se()) break;
    i = bt(i, !1);
  }
  return !1;
}
function We(e, n, t, i) {
  let o = 0, a = 0, r = e.children;
  for (; a < r.length; ) {
    if (r[a].style.display !== "none" && r[a] !== v.ghost && (i || r[a] !== v.dragged) && J(r[a], t.draggable, e, !1)) {
      if (o === n)
        return r[a];
      o++;
    }
    a++;
  }
  return null;
}
function ht(e, n) {
  let t = e.lastElementChild;
  for (; t && (t === v.ghost || g(t, "display") === "none" || n && !je(t, n)); )
    t = t.previousElementSibling;
  return t || null;
}
function j(e, n) {
  let t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== v.clone && (!n || je(e, n)) && t++;
  return t;
}
function yt(e) {
  let n = 0, t = 0, i = se();
  if (e)
    do {
      let o = Ce(e), a = o.a, r = o.d;
      n += e.scrollLeft * a, t += e.scrollTop * r;
    } while (e !== i && (e = e.parentNode));
  return [n, t];
}
function qt(e, n) {
  for (let t in e)
    if (e.hasOwnProperty(t)) {
      for (let i in n)
        if (n.hasOwnProperty(i) && n[i] === e[t][i]) return Number(t);
    }
  return -1;
}
function bt(e, n) {
  if (!e || !e.getBoundingClientRect) return se();
  let t = e, i = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      let o = g(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return se();
        if (i || n) return t;
        i = !0;
      }
    }
  while (t = t.parentNode);
  return se();
}
function Zt(e, n) {
  if (e && n)
    for (let t in n)
      n.hasOwnProperty(t) && (e[t] = n[t]);
  return e;
}
function tt(e, n) {
  return Math.round(e.top) === Math.round(n.top) && Math.round(e.left) === Math.round(n.left) && Math.round(e.height) === Math.round(n.height) && Math.round(e.width) === Math.round(n.width);
}
let nt;
function Vt(e, n) {
  return function() {
    if (!nt) {
      let t = arguments, i = this;
      t.length === 1 ? e.call(i, t[0]) : e.apply(i, t), nt = setTimeout(function() {
        nt = void 0;
      }, n);
    }
  };
}
function Jt(e, n, t) {
  e.scrollLeft += n, e.scrollTop += t;
}
function Mt(e) {
  let n = window.Polymer, t = window.jQuery || window.Zepto;
  return n && n.dom ? n.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Wt(e, n, t) {
  const i = {};
  return Array.from(e.children).forEach((o) => {
    if (!J(o, n.draggable, e, !1) || o.animated || o === t) return;
    const a = N(o);
    i.left = Math.min(i.left ?? 1 / 0, a.left), i.top = Math.min(i.top ?? 1 / 0, a.top), i.right = Math.max(i.right ?? -1 / 0, a.right), i.bottom = Math.max(i.bottom ?? -1 / 0, a.bottom);
  }), i.width = i.right - i.left, i.height = i.bottom - i.top, i.x = i.left, i.y = i.top, i;
}
const G = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Kt() {
  let e = [], n;
  return {
    captureAnimationState() {
      if (e = [], !this.options.animation) return;
      [].slice.call(this.el.children).forEach((i) => {
        if (g(i, "display") === "none" || i === v.ghost) return;
        e.push({
          target: i,
          rect: N(i)
        });
        let o = { ...e[e.length - 1].rect };
        if (i.thisAnimationDuration) {
          let a = Ce(i, !0);
          a && (o.top -= a.f, o.left -= a.e);
        }
        i.fromRect = o;
      });
    },
    addAnimationState(t) {
      e.push(t);
    },
    removeAnimationState(t) {
      e.splice(qt(e, { target: t }), 1);
    },
    animateAll(t) {
      if (!this.options.animation) {
        clearTimeout(n), typeof t == "function" && t();
        return;
      }
      let i = !1, o = 0;
      e.forEach((a) => {
        let r = 0, s = a.target, c = s.fromRect, l = N(s), f = s.prevFromRect, p = s.prevToRect, h = a.rect, _ = Ce(s, !0);
        _ && (l.top -= _.f, l.left -= _.e), s.toRect = l, s.thisAnimationDuration && tt(f, l) && !tt(c, l) && // Make sure animatingRect is on line between toRect & fromRect
        (h.top - l.top) / (h.left - l.left) === (c.top - l.top) / (c.left - l.left) && (r = en(h, f, p, this.options)), tt(l, c) || (s.prevFromRect = c, s.prevToRect = l, r || (r = this.options.animation), this.animate(
          s,
          h,
          l,
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
        let r = Ce(this.el), s = r && r.a, c = r && r.d, l = (i.left - o.left) / (s || 1), f = (i.top - o.top) / (c || 1);
        t.animatingX = !!l, t.animatingY = !!f, g(t, "transform", "translate3d(" + l + "px," + f + "px,0)"), this.forRepaintDummy = Qt(t), g(t, "transition", "transform " + a + "ms" + (this.options.easing ? " " + this.options.easing : "")), g(t, "transform", "translate3d(0,0,0)"), typeof t.animated == "number" && clearTimeout(t.animated), t.animated = setTimeout(function() {
          g(t, "transition", ""), g(t, "transform", ""), t.animated = !1, t.animatingX = !1, t.animatingY = !1;
        }, a);
      }
    }
  };
}
function Qt(e) {
  return e.offsetWidth;
}
function en(e, n, t, i) {
  return Math.sqrt(Math.pow(n.top - e.top, 2) + Math.pow(n.left - e.left, 2)) / Math.sqrt(Math.pow(n.top - t.top, 2) + Math.pow(n.left - t.left, 2)) * i.animation;
}
let ve = [];
const it = {
  initializeByDefault: !0
}, Ne = {
  mount(e) {
    for (let n in it)
      it.hasOwnProperty(n) && !(n in e) && (e[n] = it[n]);
    ve.forEach((n) => {
      if (n.pluginName === e.pluginName)
        throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
    }), ve.push(e);
  },
  pluginEvent(e, n, t) {
    this.eventCanceled = !1, t.cancel = () => {
      this.eventCanceled = !0;
    };
    const i = e + "Global";
    ve.forEach((o) => {
      n[o.pluginName] && (n[o.pluginName][i] && n[o.pluginName][i]({ sortable: n, ...t }), n.options[o.pluginName] && n[o.pluginName][e] && n[o.pluginName][e]({ sortable: n, ...t }));
    });
  },
  initializePlugins(e, n, t, i) {
    ve.forEach((o) => {
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
    return ve.forEach((i) => {
      typeof i.eventProperties == "function" && Object.assign(t, i.eventProperties.call(n[i.pluginName], e));
    }), t;
  },
  modifyOption(e, n, t) {
    let i;
    return ve.forEach((o) => {
      e[o.pluginName] && o.optionListeners && typeof o.optionListeners[n] == "function" && (i = o.optionListeners[n].call(e[o.pluginName], t));
    }), i;
  }
};
function tn({
  sortable: e,
  rootEl: n,
  name: t,
  targetEl: i,
  cloneEl: o,
  toEl: a,
  fromEl: r,
  oldIndex: s,
  newIndex: c,
  oldDraggableIndex: l,
  newDraggableIndex: f,
  originalEvent: p,
  putSortable: h,
  extraEventProperties: _
}) {
  if (e = e || n && n[G], !e) return;
  let S, O = e.options, $ = "on" + t.charAt(0).toUpperCase() + t.substr(1);
  window.CustomEvent && !le && !Je ? S = new CustomEvent(t, {
    bubbles: !0,
    cancelable: !0
  }) : (S = document.createEvent("Event"), S.initEvent(t, !0, !0)), S.to = a || n, S.from = r || n, S.item = i || n, S.clone = o, S.oldIndex = s, S.newIndex = c, S.oldDraggableIndex = l, S.newDraggableIndex = f, S.originalEvent = p, S.pullMode = h ? h.lastPutMode : void 0;
  let M = { ..._, ...Ne.getEventProperties(t, e) };
  for (let Z in M)
    S[Z] = M[Z];
  n && n.dispatchEvent(S), O[$] && O[$].call(e, S);
}
let R = function(e, n, { evt: t, ...i } = {}) {
  Ne.pluginEvent.bind(v)(e, n, {
    dragEl: u,
    parentEl: x,
    ghostEl: m,
    rootEl: T,
    nextEl: pe,
    lastDownEl: Ye,
    cloneEl: E,
    cloneHidden: re,
    dragStarted: Ee,
    putSortable: P,
    activeSortable: v.active,
    originalEvent: t,
    oldIndex: we,
    oldDraggableIndex: xe,
    newIndex: U,
    newDraggableIndex: oe,
    hideGhostForTarget: At,
    unhideGhostForTarget: $t,
    cloneNowHidden() {
      re = !0;
    },
    cloneNowShown() {
      re = !1;
    },
    dispatchSortableEvent(o) {
      X({ sortable: n, name: o, originalEvent: t });
    },
    ...i
  });
};
function X(e) {
  tn({
    putSortable: P,
    cloneEl: E,
    targetEl: u,
    rootEl: T,
    oldIndex: we,
    oldDraggableIndex: xe,
    newIndex: U,
    newDraggableIndex: oe,
    ...e
  });
}
let u, x, m, T, pe, Ye, E, re, we, U, xe, oe, $e, P, ye = !1, ze = !1, qe = [], fe, V, ot, at, wt, Ct, Ee, _e, Ie, Me = !1, Le = !1, Ue, A, rt = [], lt = !1, Ze = [];
const Ke = typeof document < "u", Xe = ft, kt = Je || le ? "cssFloat" : "float", nn = Ke && !Tt && !ft && "draggable" in document.createElement("div"), Nt = (function() {
  if (!Ke) return;
  if (le)
    return !1;
  let e = document.createElement("x");
  return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
})(), Pt = function(e, n) {
  let t = g(e), i = parseInt(t.width) - parseInt(t.paddingLeft) - parseInt(t.paddingRight) - parseInt(t.borderLeftWidth) - parseInt(t.borderRightWidth), o = We(e, 0, n), a = We(e, 1, n), r = o && g(o), s = a && g(a), c = r && parseInt(r.marginLeft) + parseInt(r.marginRight) + N(o).width, l = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + N(a).width;
  if (t.display === "flex")
    return t.flexDirection === "column" || t.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (t.display === "grid")
    return t.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (o && r.float && r.float !== "none") {
    let f = r.float === "left" ? "left" : "right";
    return a && (s.clear === "both" || s.clear === f) ? "vertical" : "horizontal";
  }
  return o && (r.display === "block" || r.display === "flex" || r.display === "table" || r.display === "grid" || c >= i && t[kt] === "none" || a && t[kt] === "none" && c + l > i) ? "vertical" : "horizontal";
}, on = function(e, n, t) {
  let i = t ? e.left : e.top, o = t ? e.right : e.bottom, a = t ? e.width : e.height, r = t ? n.left : n.top, s = t ? n.right : n.bottom, c = t ? n.width : n.height;
  return i === r || o === s || i + a / 2 === r + c / 2;
}, an = function(e, n) {
  let t;
  return qe.some((i) => {
    const o = i[G].options.emptyInsertThreshold;
    if (!o || ht(i)) return;
    const a = N(i), r = e >= a.left - o && e <= a.right + o, s = n >= a.top - o && n <= a.bottom + o;
    if (r && s)
      return t = i;
  }), t;
}, Ot = function(e) {
  function n(o, a) {
    return function(r, s, c, l) {
      let f = r.options.group.name && s.options.group.name && r.options.group.name === s.options.group.name;
      if (o == null && (a || f))
        return !0;
      if (o == null || o === !1)
        return !1;
      if (a && o === "clone")
        return o;
      if (typeof o == "function")
        return n(o(r, s, c, l), a)(r, s, c, l);
      {
        let p = (a ? r : s).options.group.name;
        return o === !0 || typeof o == "string" && o === p || o.join && o.indexOf(p) > -1;
      }
    };
  }
  let t = {}, i = e.group;
  (!i || typeof i != "object") && (i = { name: i }), t.name = i.name, t.checkPull = n(i.pull, !0), t.checkPut = n(i.put), t.revertClone = i.revertClone, e.group = t;
}, At = function() {
  !Nt && m && g(m, "display", "none");
}, $t = function() {
  !Nt && m && g(m, "display", "");
};
Ke && !Tt && document.addEventListener("click", function(e) {
  if (ze)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), ze = !1, !1;
}, !0);
let he = function(e) {
  if (u) {
    e = e.touches ? e.touches[0] : e;
    let n = an(e.clientX, e.clientY);
    if (n) {
      let t = {};
      for (let i in e)
        e.hasOwnProperty(i) && (t[i] = e[i]);
      t.target = t.rootEl = n, t.preventDefault = void 0, t.stopPropagation = void 0, n[G]._onDragOver(t);
    }
  }
}, rn = function(e) {
  u && u.parentNode[G]._isOutsideThisEl(e.target);
};
function v(e, n) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
  this.el = e, this.options = n = Object.assign({}, n), e[G] = this;
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
      return Pt(e, this.options);
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
    supportPointer: v.supportPointer !== !1 && "PointerEvent" in window && (!Fe || ft),
    emptyInsertThreshold: 5
  };
  Ne.initializePlugins(this, e, t);
  for (let i in t)
    !(i in n) && (n[i] = t[i]);
  Ot(n);
  for (let i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = n.forceFallback ? !1 : nn, this.nativeDraggable && (this.options.touchStartThreshold = 1), n.supportPointer ? k(e, "pointerdown", this._onTapStart) : (k(e, "mousedown", this._onTapStart), k(e, "touchstart", this._onTapStart)), this.nativeDraggable && (k(e, "dragover", this), k(e, "dragenter", this)), qe.push(this.el), n.store && n.store.get && this.sort(n.store.get(this) || []), Object.assign(this, Kt());
}
v.prototype = /** @lends Sortable.prototype */
{
  constructor: v,
  _isOutsideThisEl: function(e) {
    !this.el.contains(e) && e !== this.el && (_e = null);
  },
  _getDirection: function(e, n) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, e, n, u) : this.options.direction;
  },
  _onTapStart: function(e) {
    if (!e.cancelable) return;
    let n = this, t = this.el, i = this.options, o = i.preventOnFilter, a = e.type, r = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (r || e).target, c = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, l = i.filter;
    if (pn(t), !u && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || i.disabled) && !c.isContentEditable && !(!this.nativeDraggable && Fe && s && s.tagName.toUpperCase() === "SELECT") && (s = J(s, i.draggable, t, !1), !(s && s.animated) && Ye !== s)) {
      if (we = j(s), xe = j(s, i.draggable), typeof l == "function") {
        if (l.call(this, e, s, this)) {
          X({
            sortable: n,
            rootEl: c,
            name: "filter",
            targetEl: s,
            toEl: t,
            fromEl: t
          }), R("filter", n, { evt: e }), o && e.preventDefault();
          return;
        }
      } else if (l && (l = l.split(",").some(function(f) {
        if (f = J(c, f.trim(), t, !1), f)
          return X({
            sortable: n,
            rootEl: f,
            name: "filter",
            targetEl: s,
            fromEl: t,
            toEl: t
          }), R("filter", n, { evt: e }), !0;
      }), l)) {
        o && e.preventDefault();
        return;
      }
      i.handle && !J(c, i.handle, t, !1) || this._prepareDragStart(e, r, s);
    }
  },
  _prepareDragStart: function(e, n, t) {
    let i = this, o = i.el, a = i.options, r = o.ownerDocument, s;
    if (t && !u && t.parentNode === o) {
      let c = N(t);
      if (T = o, u = t, x = u.parentNode, pe = u.nextSibling, Ye = t, $e = a.group, v.dragged = u, fe = {
        target: u,
        clientX: (n || e).clientX,
        clientY: (n || e).clientY
      }, wt = fe.clientX - c.left, Ct = fe.clientY - c.top, this._lastX = (n || e).clientX, this._lastY = (n || e).clientY, u.style["will-change"] = "all", s = function() {
        if (R("delayEnded", i, { evt: e }), v.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !mt && i.nativeDraggable && (u.draggable = !0), i._triggerDragStart(e, n), X({
          sortable: i,
          name: "choose",
          originalEvent: e
        }), Y(u, a.chosenClass, !0);
      }, a.ignore.split(",").forEach(function(l) {
        It(u, l.trim(), st);
      }), k(r, "dragover", he), k(r, "mousemove", he), k(r, "touchmove", he), a.supportPointer ? (k(r, "pointerup", i._onDrop), !this.nativeDraggable && k(r, "pointercancel", i._onDrop)) : (k(r, "mouseup", i._onDrop), k(r, "touchend", i._onDrop), k(r, "touchcancel", i._onDrop)), mt && this.nativeDraggable && (this.options.touchStartThreshold = 4, u.draggable = !0), R("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || n) && (!this.nativeDraggable || !(Je || le))) {
        if (v.eventCanceled) {
          this._onDrop();
          return;
        }
        a.supportPointer ? (k(r, "pointerup", i._disableDelayedDrag), k(r, "pointercancel", i._disableDelayedDrag)) : (k(r, "mouseup", i._disableDelayedDrag), k(r, "touchend", i._disableDelayedDrag), k(r, "touchcancel", i._disableDelayedDrag)), k(r, "mousemove", i._delayedDragTouchMoveHandler), k(r, "touchmove", i._delayedDragTouchMoveHandler), a.supportPointer && k(r, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(s, a.delay);
      } else
        s();
    }
  },
  _delayedDragTouchMoveHandler: function(e) {
    let n = e.touches ? e.touches[0] : e;
    Math.max(Math.abs(n.clientX - this._lastX), Math.abs(n.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    u && st(u), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    let e = this.el.ownerDocument;
    C(e, "mouseup", this._disableDelayedDrag), C(e, "touchend", this._disableDelayedDrag), C(e, "touchcancel", this._disableDelayedDrag), C(e, "pointerup", this._disableDelayedDrag), C(e, "pointercancel", this._disableDelayedDrag), C(e, "mousemove", this._delayedDragTouchMoveHandler), C(e, "touchmove", this._delayedDragTouchMoveHandler), C(e, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(e, n) {
    n = n || e.pointerType == "touch" && e, !this.nativeDraggable || n ? this.options.supportPointer ? k(document, "pointermove", this._onTouchMove) : n ? k(document, "touchmove", this._onTouchMove) : k(document, "mousemove", this._onTouchMove) : (k(u, "dragend", this), k(T, "dragstart", this._onDragStart));
    try {
      document.selection ? Ge(() => {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(e, n) {
    if (ye = !1, T && u) {
      R("dragStarted", this, { evt: n }), this.nativeDraggable && k(document, "dragover", rn);
      let t = this.options;
      !e && Y(u, t.dragClass, !1), Y(u, t.ghostClass, !0), v.active = this, e && this._appendGhost(), X({
        sortable: this,
        name: "start",
        originalEvent: n
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (V) {
      this._lastX = V.clientX, this._lastY = V.clientY, At();
      let e = document.elementFromPoint(V.clientX, V.clientY), n = e;
      for (; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(V.clientX, V.clientY), e !== n); )
        n = e;
      if (u.parentNode[G]._isOutsideThisEl(e), n)
        do {
          if (n[G]) {
            let t;
            if (t = n[G]._onDragOver({
              clientX: V.clientX,
              clientY: V.clientY,
              target: e,
              rootEl: n
            }), t && !this.options.dragoverBubble)
              break;
          }
          e = n;
        } while (n = xt(n));
      $t();
    }
  },
  _onTouchMove: function(e) {
    if (fe) {
      let n = this.options, t = n.fallbackTolerance, i = n.fallbackOffset, o = e.touches ? e.touches[0] : e, a = m && Ce(m, !0), r = m && a && a.a, s = m && a && a.d, c = Xe && A && yt(A), l = (o.clientX - fe.clientX + i.x) / (r || 1) + (c ? c[0] - rt[0] : 0) / (r || 1), f = (o.clientY - fe.clientY + i.y) / (s || 1) + (c ? c[1] - rt[1] : 0) / (s || 1);
      if (!v.active && !ye) {
        if (t && Math.max(Math.abs(o.clientX - this._lastX), Math.abs(o.clientY - this._lastY)) < t)
          return;
        this._onDragStart(e, !0);
      }
      if (m) {
        a ? (a.e += l - (ot || 0), a.f += f - (at || 0)) : a = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: l,
          f
        };
        let p = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
        g(m, "webkitTransform", p), g(m, "mozTransform", p), g(m, "msTransform", p), g(m, "transform", p), ot = l, at = f, V = o;
      }
      e.cancelable && e.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!m) {
      let e = this.options.fallbackOnBody ? document.body : T, n = N(u, !0, Xe, !0, e), t = this.options;
      if (Xe) {
        for (A = e; g(A, "position") === "static" && g(A, "transform") === "none" && A !== document; )
          A = A.parentNode;
        A !== document.body && A !== document.documentElement ? (A === document && (A = se()), n.top += A.scrollTop, n.left += A.scrollLeft) : A = se(), rt = yt(A);
      }
      m = u.cloneNode(!0), Y(m, t.ghostClass, !1), Y(m, t.fallbackClass, !0), Y(m, t.dragClass, !0), g(m, "transition", ""), g(m, "transform", ""), g(m, "box-sizing", "border-box"), g(m, "margin", 0), g(m, "top", n.top), g(m, "left", n.left), g(m, "width", n.width), g(m, "height", n.height), g(m, "opacity", "0.8"), g(m, "position", Xe ? "absolute" : "fixed"), g(m, "zIndex", "100000"), g(m, "pointerEvents", "none"), v.ghost = m, e.appendChild(m), g(m, "transform-origin", wt / parseInt(m.style.width) * 100 + "% " + Ct / parseInt(m.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(e, n) {
    let t = this, i = e.dataTransfer, o = t.options;
    if (R("dragStart", this, { evt: e }), v.eventCanceled) {
      this._onDrop();
      return;
    }
    R("setupClone", this), v.eventCanceled || (E = Mt(u), E.removeAttribute("id"), E.draggable = !1, E.style["will-change"] = "", this._hideClone(), Y(E, this.options.chosenClass, !1), v.clone = E), t.cloneId = Ge(function() {
      R("clone", t), !v.eventCanceled && (t.options.removeCloneOnHide || T.insertBefore(E, u), t._hideClone(), X({
        sortable: t,
        name: "clone"
      }));
    }), !n && Y(u, o.dragClass, !0), n ? (ze = !0, t._loopId = setInterval(t._emulateDragOver, 50)) : (C(document, "mouseup", t._onDrop), C(document, "touchend", t._onDrop), C(document, "touchcancel", t._onDrop), i && (i.effectAllowed = "move", o.setData && o.setData.call(t, i, u)), k(document, "drop", t), g(u, "transform", "translateZ(0)")), ye = !0, t._dragStartId = Ge(t._dragStarted.bind(t, n, e)), k(document, "selectstart", t), Ee = !0, window.getSelection().removeAllRanges(), Fe && g(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(e) {
    let n = this.el, t = e.target, i, o, a, r = this.options, s = r.group, c = v.active, l = $e === s, f = r.sort, p = P || c, h, _ = this, S = !1;
    if (lt) return;
    function O(W, L) {
      R(W, _, {
        evt: e,
        isOwner: l,
        axis: h ? "vertical" : "horizontal",
        revert: a,
        dragRect: i,
        targetRect: o,
        canSort: f,
        fromSortable: p,
        target: t,
        completed: M,
        onMove(ne, ie) {
          return Be(T, n, u, i, ne, N(ne), e, ie);
        },
        changed: Z,
        ...L
      });
    }
    function $() {
      O("dragOverAnimationCapture"), _.captureAnimationState(), _ !== p && p.captureAnimationState();
    }
    function M(W) {
      return O("dragOverCompleted", { insertion: W }), W && (l ? c._hideClone() : c._showClone(_), _ !== p && (Y(u, P ? P.options.ghostClass : c.options.ghostClass, !1), Y(u, r.ghostClass, !0)), P !== _ && _ !== v.active ? P = _ : _ === v.active && P && (P = null), p === _ && (_._ignoreWhileAnimating = t), _.animateAll(function() {
        O("dragOverAnimationComplete"), _._ignoreWhileAnimating = null;
      }), _ !== p && (p.animateAll(), p._ignoreWhileAnimating = null)), (t === u && !u.animated || t === n && !t.animated) && (_e = null), !r.dragoverBubble && !e.rootEl && t !== document && (u.parentNode[G]._isOutsideThisEl(e.target), !W && he(e)), !r.dragoverBubble && e.stopPropagation && e.stopPropagation(), S = !0;
    }
    function Z() {
      U = j(u), oe = j(u, r.draggable), X({
        sortable: _,
        name: "change",
        toEl: n,
        newIndex: U,
        newDraggableIndex: oe,
        originalEvent: e
      });
    }
    if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), t = J(t, r.draggable, n, !0), O("dragOver"), v.eventCanceled) return S;
    if (u.contains(e.target) || t.animated && t.animatingX && t.animatingY || _._ignoreWhileAnimating === t)
      return M(!1);
    if (ze = !1, c && !r.disabled && (l ? f || (a = x !== T) : P === this || (this.lastPutMode = $e.checkPull(this, c, u, e)) && s.checkPut(this, c, u, e))) {
      if (h = this._getDirection(e, t) === "vertical", i = N(u), O("dragOverValid"), v.eventCanceled) return S;
      if (a)
        return x = T, $(), this._hideClone(), O("revert"), v.eventCanceled || (pe ? T.insertBefore(u, pe) : T.appendChild(u)), M(!0);
      let W = ht(n, r.draggable);
      if (!W || un(e, h, this) && !W.animated) {
        if (W === u)
          return M(!1);
        if (W && n === e.target && (t = W), t && (o = N(t)), Be(T, n, u, i, t, o, e, !!t) !== !1)
          return $(), W && W.nextSibling ? n.insertBefore(u, W.nextSibling) : n.appendChild(u), x = n, Z(), M(!0);
      } else if (W && cn(e, h, this)) {
        let L = We(n, 0, r, !0);
        if (L === u)
          return M(!1);
        if (t = L, o = N(t), Be(T, n, u, i, t, o, e, !1) !== !1)
          return $(), n.insertBefore(u, L), x = n, Z(), M(!0);
      } else if (t.parentNode === n) {
        o = N(t);
        let L = 0, ne, ie = u.parentNode !== n, Pe = !on(u.animated && u.toRect || i, t.animated && t.toRect || o, h), Oe = h ? "top" : "left", ce = _t(t, "top", "top") || _t(u, "top", "top"), Qe = ce ? ce.scrollTop : void 0;
        _e !== t && (ne = o[Oe], Me = !1, Le = !Pe && r.invertSwap || ie), L = dn(
          e,
          t,
          o,
          h,
          Pe ? 1 : r.swapThreshold,
          r.invertedSwapThreshold == null ? r.swapThreshold : r.invertedSwapThreshold,
          Le,
          _e === t
        );
        let ue;
        if (L !== 0) {
          let D = j(u);
          do
            D -= L, ue = x.children[D];
          while (ue && (g(ue, "display") === "none" || ue === m));
        }
        if (L === 0 || ue === t)
          return M(!1);
        _e = t, Ie = L;
        let Ae = t.nextElementSibling, b = !1;
        b = L === 1;
        let I = Be(T, n, u, i, t, o, e, b);
        if (I !== !1)
          return (I === 1 || I === -1) && (b = I === 1), lt = !0, setTimeout(ln, 30), $(), b && !Ae ? n.appendChild(u) : t.parentNode.insertBefore(u, b ? Ae : t), ce && Jt(ce, 0, Qe - ce.scrollTop), x = u.parentNode, ne !== void 0 && !Le && (Ue = Math.abs(ne - N(t)[Oe])), Z(), M(!0);
      }
      if (n.contains(u))
        return M(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    C(document, "mousemove", this._onTouchMove), C(document, "touchmove", this._onTouchMove), C(document, "pointermove", this._onTouchMove), C(document, "dragover", he), C(document, "mousemove", he), C(document, "touchmove", he);
  },
  _offUpEvents: function() {
    let e = this.el.ownerDocument;
    C(e, "mouseup", this._onDrop), C(e, "touchend", this._onDrop), C(e, "pointerup", this._onDrop), C(e, "pointercancel", this._onDrop), C(e, "touchcancel", this._onDrop), C(document, "selectstart", this);
  },
  _onDrop: function(e) {
    let n = this.el, t = this.options;
    if (U = j(u), oe = j(u, t.draggable), R("drop", this, {
      evt: e
    }), x = u && u.parentNode, U = j(u), oe = j(u, t.draggable), v.eventCanceled) {
      this._nulling();
      return;
    }
    ye = !1, Le = !1, Me = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), ct(this.cloneId), ct(this._dragStartId), this.nativeDraggable && (C(document, "drop", this), C(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Fe && g(document.body, "user-select", ""), g(u, "transform", ""), e && (Ee && (e.cancelable && e.preventDefault(), !t.dropBubble && e.stopPropagation()), m && m.parentNode && m.parentNode.removeChild(m), (T === x || P && P.lastPutMode !== "clone") && E && E.parentNode && E.parentNode.removeChild(E), u && (this.nativeDraggable && C(u, "dragend", this), st(u), u.style["will-change"] = "", Ee && !ye && Y(u, P ? P.options.ghostClass : this.options.ghostClass, !1), Y(u, this.options.chosenClass, !1), X({
      sortable: this,
      name: "unchoose",
      toEl: x,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: e
    }), T !== x ? (U >= 0 && (X({
      rootEl: x,
      name: "add",
      toEl: x,
      fromEl: T,
      originalEvent: e
    }), X({
      sortable: this,
      name: "remove",
      toEl: x,
      originalEvent: e
    }), X({
      rootEl: x,
      name: "sort",
      toEl: x,
      fromEl: T,
      originalEvent: e
    }), X({
      sortable: this,
      name: "sort",
      toEl: x,
      originalEvent: e
    })), P && P.save()) : U !== we && U >= 0 && (X({
      sortable: this,
      name: "update",
      toEl: x,
      originalEvent: e
    }), X({
      sortable: this,
      name: "sort",
      toEl: x,
      originalEvent: e
    })), v.active && ((U == null || U === -1) && (U = we, oe = xe), X({
      sortable: this,
      name: "end",
      toEl: x,
      originalEvent: e
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    R("nulling", this), T = u = x = m = pe = E = Ye = re = fe = V = Ee = U = oe = we = xe = _e = Ie = P = $e = v.dragged = v.ghost = v.clone = v.active = null, Ze.forEach(function(e) {
      e.checked = !0;
    }), Ze.length = ot = at = 0;
  },
  handleEvent: function(e) {
    switch (e.type) {
      case "drop":
      case "dragend":
        this._onDrop(e);
        break;
      case "dragenter":
      case "dragover":
        u && (this._onDragOver(e), sn(e));
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
      n = t[i], J(n, a.draggable, this.el, !1) && e.push(n.getAttribute(a.dataIdAttr) || hn(n));
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
      J(r, this.options.draggable, i, !1) && (t[o] = r);
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
    return J(e, n || this.options.draggable, this.el, !1);
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
      let i = Ne.modifyOption(this, e, n);
      typeof i < "u" ? t[e] = i : t[e] = n, e === "group" && Ot(t);
    }
  },
  /**
   * Destroy
   */
  destroy: function() {
    R("destroy", this);
    let e = this.el;
    e[G] = null, C(e, "mousedown", this._onTapStart), C(e, "touchstart", this._onTapStart), C(e, "pointerdown", this._onTapStart), this.nativeDraggable && (C(e, "dragover", this), C(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(n) {
      n.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), qe.splice(qe.indexOf(this.el), 1), this.el = e = null;
  },
  _hideClone: function() {
    if (!re) {
      if (R("hideClone", this), v.eventCanceled) return;
      g(E, "display", "none"), this.options.removeCloneOnHide && E.parentNode && E.parentNode.removeChild(E), re = !0;
    }
  },
  _showClone: function(e) {
    if (e.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (re) {
      if (R("showClone", this), v.eventCanceled) return;
      u.parentNode == T && !this.options.group.revertClone ? T.insertBefore(E, u) : pe ? T.insertBefore(E, pe) : T.appendChild(E), this.options.group.revertClone && this.animate(u, E), g(E, "display", ""), re = !1;
    }
  }
};
function sn(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Be(e, n, t, i, o, a, r, s) {
  let c, l = e[G], f = l.options.onMove, p;
  return window.CustomEvent && !le && !Je ? c = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = n, c.from = e, c.dragged = t, c.draggedRect = i, c.related = o || n, c.relatedRect = a || N(n), c.willInsertAfter = s, c.originalEvent = r, e.dispatchEvent(c), f && (p = f.call(l, c, r)), p;
}
function st(e) {
  e.draggable = !1;
}
function ln() {
  lt = !1;
}
function cn(e, n, t) {
  let i = N(We(t.el, 0, t.options, !0));
  const o = Wt(t.el, t.options, m), a = 10;
  return n ? e.clientX < o.left - a || e.clientY < i.top && e.clientX < i.right : e.clientY < o.top - a || e.clientY < i.bottom && e.clientX < i.left;
}
function un(e, n, t) {
  const i = N(ht(t.el, t.options.draggable)), o = Wt(t.el, t.options, m), a = 10;
  return n ? e.clientX > o.right + a || e.clientY > i.bottom && e.clientX > i.left : e.clientY > o.bottom + a || e.clientX > i.right && e.clientY > i.top;
}
function dn(e, n, t, i, o, a, r, s) {
  let c = i ? e.clientY : e.clientX, l = i ? t.height : t.width, f = i ? t.top : t.left, p = i ? t.bottom : t.right, h = !1;
  if (!r) {
    if (s && Ue < l * o) {
      if (!Me && (Ie === 1 ? c > f + l * a / 2 : c < p - l * a / 2) && (Me = !0), Me)
        h = !0;
      else if (Ie === 1 ? c < f + Ue : c > p - Ue)
        return -Ie;
    } else if (c > f + l * (1 - o) / 2 && c < p - l * (1 - o) / 2)
      return fn(n);
  }
  return h = h || r, h && (c < f + l * a / 2 || c > p - l * a / 2) ? c > f + l / 2 ? 1 : -1 : 0;
}
function fn(e) {
  return j(u) < j(e) ? 1 : -1;
}
function hn(e) {
  let n = e.tagName + e.className + e.src + e.href + e.textContent, t = n.length, i = 0;
  for (; t--; )
    i += n.charCodeAt(t);
  return i.toString(36);
}
function pn(e) {
  Ze.length = 0;
  let n = e.getElementsByTagName("input"), t = n.length;
  for (; t--; ) {
    let i = n[t];
    i.checked && Ze.push(i);
  }
}
function Ge(e) {
  return setTimeout(e, 0);
}
function ct(e) {
  return clearTimeout(e);
}
Ke && k(document, "touchmove", function(e) {
  (v.active || ye) && e.cancelable && e.preventDefault();
});
v.utils = {
  on: k,
  off: C,
  css: g,
  find: It,
  is: function(e, n) {
    return !!J(e, n, e, !1);
  },
  extend: Zt,
  throttle: Vt,
  closest: J,
  toggleClass: Y,
  clone: Mt,
  index: j,
  nextTick: Ge,
  cancelNextTick: ct,
  detectDirection: Pt,
  getChild: We,
  expando: G
};
v.get = function(e) {
  return e[G];
};
v.mount = function(...e) {
  e[0].constructor === Array && (e = e[0]), e.forEach((n) => {
    if (!n.prototype || !n.prototype.constructor)
      throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(n)}`;
    n.utils && (v.utils = { ...v.utils, ...n.utils }), Ne.mount(n);
  });
};
v.create = function(e, n) {
  return new v(e, n);
};
v.version = "1.15.6";
const gn = { class: "headWrapper" }, mn = ["onClick"], vn = ["onClick"], _n = ["innerHTML"], yn = {
  __name: "SkillPanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = H(null);
    let i = null;
    const o = H([]), a = () => {
      const c = z.character(n.name)?.skills || [], l = (h) => {
        const _ = z.info(h);
        if (typeof _?.frequent == "boolean")
          return ge.config.autoskilllist.includes(h) ? !1 : _.frequent;
      }, f = (h) => {
        let _ = z.skillInfoTranslation(h, void 0, !1);
        return ge.translate[`${h}_append`] && (_ += `<br>${z.translation(`${h}_append`)}`), _;
      }, p = [];
      for (const h of c) {
        const _ = z.info(h), S = l(h);
        p.push({ id: h, label: z.translation(h), isDerivation: !1, autoSkill: h, frequent: S, auto: S, info: f(h) });
        const O = _?.derivation;
        if (O)
          for (const $ of Array.isArray(O) ? O : [O]) {
            const M = l($);
            p.push({
              id: $,
              label: z.translation($),
              isDerivation: !0,
              //衍生技的试听按钮播的仍是主技能的音（与原实现一致）
              autoSkill: h,
              frequent: M,
              auto: M,
              info: f($)
            });
          }
      }
      return p;
    };
    function r(c) {
      Te.playSkillAudio(c.autoSkill, n.name);
    }
    function s(c) {
      c.auto = !c.auto, c.auto ? ge.config.autoskilllist.remove(c.id) : ge.config.autoskilllist.add(c.id), ut.saveConfig("autoskilllist", ge.config.autoskilllist);
    }
    return dt(() => {
      o.value = a(), i = new v(t.value, {
        draggable: ".skillWrapper",
        animation: 150,
        handle: ".dragHandle"
      });
    }), Lt(() => {
      i?.destroy?.(), i = null;
    }), (c, l) => (y(), w("div", {
      ref_key: "listEl",
      ref: t,
      class: "skillList"
    }, [
      (y(!0), w(q, null, ee(o.value, (f, p) => (y(), w("div", {
        key: p,
        class: "skillWrapper"
      }, [
        d("div", gn, [
          l[0] || (l[0] = d("div", { class: "dragHandle" }, "≡", -1)),
          d("div", {
            class: K(f.isDerivation ? "dskillname" : "skillname")
          }, B(f.label), 3),
          d("div", {
            class: "audioBtn",
            onClick: (h) => r(f)
          }, null, 8, mn),
          f.frequent !== void 0 ? (y(), w("div", {
            key: 0,
            class: K(["autoSkill", f.auto ? "autoSkillOpened" : "autoSkillClosed"]),
            onClick: (h) => s(f)
          }, " 自动发动 ", 10, vn)) : me("", !0)
        ]),
        d("div", {
          class: "skillInfo",
          innerHTML: f.info
        }, null, 8, _n)
      ]))), 128))
    ], 512));
  }
}, bn = /* @__PURE__ */ ke(yn, [["__scopeId", "data-v-2fada3e0"]]), wn = { class: "skinList" }, Cn = ["onClick"], kn = { class: "skinAvatorWrapper" }, Sn = { class: "skinTextWrapper" }, Dn = { class: "skinText" }, Tn = {
  key: 0,
  class: "skinSelectedSJZX"
}, En = {
  __name: "SkinPanel",
  props: { name: { type: String, required: !0 } },
  emits: ["skinChange"],
  setup(e, { emit: n }) {
    const t = e, i = n, o = F(() => {
      const s = Q.getCharacterSkin(t.name) || {};
      return Object.keys(s).map((c) => ({ name: c, path: s[c] }));
    }), a = H(Q.getCurentSkin(t.name));
    function r(s) {
      s.name !== a.value && Q.setCharacterSkin(t.name, s.name) && (a.value = s.name, i("skinChange", { skinName: s.name, path: s.path }));
    }
    return (s, c) => (y(), w("div", wn, [
      (y(!0), w(q, null, ee(o.value, (l) => (y(), w("div", {
        key: l.name,
        class: K(["skinListWrapper", { skinListSelectedWrapper: l.name === a.value }]),
        onClick: (f) => r(l)
      }, [
        d("div", kn, [
          d("div", {
            class: "imageSkin",
            style: ae({ backgroundImage: `url(${l.path})` })
          }, null, 4)
        ]),
        d("div", Sn, [
          d("div", Dn, B(l.name), 1)
        ]),
        l.name === a.value ? (y(), w("div", Tn)) : me("", !0)
      ], 10, Cn))), 128))
    ]));
  }
}, xn = /* @__PURE__ */ ke(En, [["__scopeId", "data-v-26d0169f"]]), In = { class: "moduleList" }, Mn = ["onClick"], Wn = { class: "modulesTitle" }, Nn = { class: "modulesInfoWrapper" }, Pn = { class: "modulesInfo" }, On = ["innerHTML"], An = ["innerHTML"], $n = {
  key: 1,
  class: "modulesSelectedSJZX"
}, Ln = {
  __name: "ModulePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = H(0), i = F(() => {
      t.value;
      const s = Re.getCharModules(n.name, !1) || {};
      return Object.keys(s).map((c) => {
        const l = s[c];
        return {
          id: c,
          name: l.name,
          url: l.url,
          intro: (Array.isArray(l.intro) ? l.intro : [l.intro]).filter(Boolean),
          effectIntro: r(l.effect?.intro)
        };
      });
    }), o = F(() => (t.value, Re.getCharModules(n.name)?.id));
    function a(s) {
      s !== o.value && (Re.setCharModules(n.name, s), t.value++, Dt.showToast("[驶舰之向] 更换模组后部分效果可能需要重启才能生效"));
    }
    function r(s) {
      return s ? (Array.isArray(s) ? s : [s]).map((l) => typeof l == "function" ? l() : l).join("<br>") : "";
    }
    return (s, c) => (y(), w("div", In, [
      (y(!0), w(q, null, ee(i.value, (l) => (y(), w("div", {
        key: l.id,
        class: K(["charModulesWrapper", { modulesSelectedWrapper: l.id === o.value }]),
        onClick: (f) => a(l.id)
      }, [
        d("div", Wn, B(l.name), 1),
        d("div", Nn, [
          d("div", {
            class: "modulesImage",
            style: ae({ backgroundImage: `url(${l.url})` })
          }, null, 4),
          d("div", Pn, [
            (y(!0), w(q, null, ee(l.intro, (f, p) => (y(), w("div", {
              key: p,
              class: "infoText",
              innerHTML: f
            }, null, 8, On))), 128))
          ])
        ]),
        l.effectIntro ? (y(), w(q, { key: 0 }, [
          c[0] || (c[0] = d("div", { class: "modulesEffectTitle" }, "模组效果", -1)),
          d("div", {
            class: "modulesEffectInfo",
            innerHTML: l.effectIntro
          }, null, 8, An)
        ], 64)) : me("", !0),
        l.id === o.value ? (y(), w("div", $n)) : me("", !0)
      ], 10, Mn))), 128))
    ]));
  }
}, Xn = /* @__PURE__ */ ke(Ln, [["__scopeId", "data-v-4540a4c6"]]), Bn = { class: "charInfoWrapper" }, Hn = ["innerHTML"], Rn = {
  __name: "ResumePanel",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const n = e, t = F(() => z.characterIntro(n.name) || "");
    return (i, o) => (y(), w("div", Bn, [
      o[0] || (o[0] = d("div", { class: "charTitle" }, "干员档案", -1)),
      d("div", {
        class: "charInfo",
        innerHTML: t.value
      }, null, 8, Hn)
    ]));
  }
}, Fn = /* @__PURE__ */ ke(Rn, [["__scopeId", "data-v-489a3cf2"]]), Yn = { class: "backgroundPanel" }, Un = {
  key: 0,
  class: "backgroundLoading"
}, Gn = {
  key: 1,
  class: "backgroundLoading"
}, jn = { class: "backgroundList" }, zn = ["onClick"], qn = { class: "backgroundText" }, Zn = {
  __name: "BackgroundPanel",
  props: {
    /** 当前选中的背景值（`<scheme>:<相对路径>`） */
    value: { type: String, default: "" }
  },
  emits: ["select"],
  setup(e, { emit: n }) {
    const t = n, i = H([]), o = H(!0), a = [
      { scheme: "ui", dir: "ui:background/", prefix: "ui:background/" },
      { scheme: "bg", dir: "bg:", prefix: "bg:" }
    ];
    return dt(async () => {
      try {
        const r = Yt.getBackgroundData?.() || {}, s = [];
        for (const { dir: c, prefix: l } of a) {
          const f = await be.getFileTree(c, 0);
          for (const p of f?.files || []) {
            const h = l + p.name, _ = p.name.replace(/\.[^.]+$/, "");
            s.push({ value: h, url: be.compilePath(h), label: r[_] || _ });
          }
        }
        i.value = s.sort((c, l) => c.value.localeCompare(l.value));
      } catch (r) {
        console.warn("[WhichWay] 读取武将卡背景列表失败：", r);
      } finally {
        o.value = !1;
      }
    }), (r, s) => (y(), w("div", Yn, [
      s[0] || (s[0] = d("div", { class: "backgroundHint" }, "点击选择武将卡背景", -1)),
      o.value ? (y(), w("div", Un, "正在读取背景列表…")) : i.value.length ? me("", !0) : (y(), w("div", Gn, "没有找到可用的背景图片")),
      d("div", jn, [
        (y(!0), w(q, null, ee(i.value, (c) => (y(), w("div", {
          key: c.value,
          class: K(["backgroundItem", { backgroundSelected: c.value === e.value }]),
          onClick: (l) => t("select", c.value)
        }, [
          d("div", {
            class: "backgroundPreview",
            style: ae({ backgroundImage: `url(${c.url})` })
          }, null, 4),
          d("div", qn, B(c.label), 1)
        ], 10, zn))), 128))
      ])
    ]));
  }
}, Vn = /* @__PURE__ */ ke(Zn, [["__scopeId", "data-v-ed41b6d9"]]), Jn = { class: "camplogo-wrapper" }, Kn = {
  key: 0,
  class: "group-text"
}, Qn = { class: "topMenu-wrapper" }, ei = { class: "imageBox" }, ti = ["src"], ni = ["onClick"], ii = { class: "btn-enSJZX" }, oi = { class: "btn-cnSJZX" }, ai = { class: "btnImage-wrapper" }, ri = ["src"], si = { class: "skinnameAudio-wrapper" }, li = { class: "skinnameWrapper" }, ci = { class: "titleWrapper" }, ui = { class: "imageWrapper" }, di = ["src"], fi = { class: "textWrapper" }, hi = { class: "designerWrapper" }, pi = { class: "titleWrapper" }, gi = { class: "imageWrapper" }, mi = ["src"], vi = { class: "textWrapper" }, _i = { class: "audioTitleWrapper" }, yi = { class: "imageWrapper" }, bi = ["src"], wi = { class: "textWrapper" }, Ci = ["src"], ki = { class: "content" }, Si = ["onClick"], Di = { class: "selectTextSJZX" }, Ti = { class: "charName-wrapper" }, Ei = { class: "charNameTitleWrapper" }, xi = ["innerHTML"], Ii = { class: "charNameTextWrapper" }, Mi = ["innerHTML"], Wi = { class: "hpWrapper" }, Ni = { class: "hpNumWrapper" }, Pi = { class: "hpNumText" }, Oi = {
  key: 0,
  class: "hpNumWrapper"
}, Ai = { class: "hpNumText" }, $i = { class: "charImageWrapper" }, Li = { class: "buttonText" }, Xi = { class: "displayArenaSJZX" }, Bi = "ui:background/default.png", Hi = {
  __name: "CharacterCard",
  props: {
    /** 武将名（char id） */
    name: { type: String, required: !0 },
    /** 关闭回调：由 WhichWayCharacterCard 卸载应用并复原 */
    onClose: { type: Function, default: null }
  },
  setup(e) {
    const n = e, t = H(He.config("characterCardBackground") || Bi), i = F(() => be.compilePath(t.value)), o = H("skill"), a = (b) => be.compilePath(`ui:${b}`), r = F(() => {
      const b = Ht(n.name), I = z.character(n.name), D = I?.whichWay?.arknight?.camp, Se = Rt(I?.group, He.getCharExtConfig(n.name)?.reallyGroup, D), et = D || Se?.logo || Se?.reallyGroup, pt = Se?.filter ?? !!et;
      return et ? { useFilter: pt, logoUrl: `${be.extDir}image/camplogo/arknight/${et}.png`, text: "" } : b ? { useFilter: pt, logoUrl: `${be.extDir}image/camplogo/noname/name_${b}.png`, text: "" } : { useFilter: !1, logoUrl: "", text: ge.translate[I?.group] || "" };
    }), s = F(() => ge.characterTitle[n.name] || ""), c = F(() => z.translation(n.name)), l = F(() => {
      const { maxHp: b = 0, hp: I = 0, hujia: D = 0 } = z.character(n.name) || {};
      return { maxHp: b, hp: I, hujia: D };
    }), f = F(() => {
      const b = [
        { key: "resume", en: "QUIT", cn: "简介", image: "resume.png" },
        { key: "skill", en: "SKILL", cn: "技能", image: "skill.png" },
        { key: "skin", en: "SKIN", cn: "皮肤", image: "skin.png" }
      ];
      return Re.getCharModules(n.name, !1) && b.push({ key: "mode", en: "MODE", cn: "模组", image: "mode.png" }), b.push({ key: "background", en: "BG", cn: "背景", image: "back_switch.png" }), b;
    }), p = H(Q.getCurentSkin(n.name)), h = F(() => Ft(n.name).join("、")), _ = H(null), S = H(Q.getCurrentSkinPath(n.name)), O = F(() => {
      const b = S.value;
      return { backgroundImage: b.startsWith("url") ? b : `url(${b})` };
    }), $ = H(!1), M = H(!1);
    function Z() {
      const b = Q.getCurentSkin(n.name);
      $.value = !!de.getSkinData(n.name, b), M.value = de.isEnabledSkin(n.name, b);
    }
    const W = H(Te.getCharacterLang(n.name)), L = F(() => Te.getCharacterAvailableLang(n.name) || []), ne = F(() => Te.getCharacterLang(n.name, !0)), ie = H(!0), Pe = (b) => Bt.getVoiceLangTranslation(b);
    async function Oe(b) {
      if (b !== W.value) {
        if (!window.whichWaySave.hasChar(n.name)) {
          Dt.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
          return;
        }
        await Te.setCustomAudio(n.name, b), W.value = b;
      }
    }
    async function ce({ skinName: b, path: I }) {
      p.value = b, S.value = Q.getCurrentSkinPath(n.name), Z(), await de.updateDyc(n.name, _.value), Q.refreshSkin();
    }
    function Qe(b) {
      t.value = b, He.saveConfig("characterCardBackground", b);
    }
    async function ue() {
      const b = Q.getCurentSkin(n.name);
      await de.toggleDycSkin(n.name, b), Z(), await de.updateDyc(n.name, _.value);
      for (const I of ut.players)
        z.name(I) === n.name && await de.updateDyc(n.name, I);
    }
    function Ae() {
      typeof n.onClose == "function" && n.onClose();
    }
    return dt(async () => {
      Z(), await de.updateDyc(n.name, _.value);
    }), (b, I) => (y(), w("div", {
      class: "container-CC-SJZX",
      style: ae({ backgroundImage: `url(${i.value})` })
    }, [
      d("div", Jn, [
        d("div", {
          class: K(["img-def", { arknightCamp: r.value.useFilter }]),
          style: ae(r.value.logoUrl ? { backgroundImage: `url(${r.value.logoUrl})` } : null)
        }, [
          !r.value.logoUrl && r.value.text ? (y(), w("div", Kn, B(r.value.text), 1)) : me("", !0)
        ], 6)
      ]),
      d("div", Qn, [
        d("div", {
          class: "btn-back",
          onClick: Ae
        }, [
          d("div", ei, [
            d("img", {
              src: a("back.png"),
              alt: ""
            }, null, 8, ti)
          ])
        ]),
        (y(!0), w(q, null, ee(f.value, (D) => (y(), w("div", {
          key: D.key,
          class: K(["btn-background", { "btn-selected-SJZX": o.value === D.key }]),
          onClick: (Se) => o.value = D.key
        }, [
          d("div", ii, B(D.en), 1),
          d("div", oi, B(D.cn), 1),
          d("div", ai, [
            d("img", {
              class: "btn-img",
              src: a(D.image),
              alt: ""
            }, null, 8, ri)
          ])
        ], 10, ni))), 128))
      ]),
      d("div", si, [
        d("div", li, [
          d("div", ci, [
            d("div", ui, [
              d("img", {
                src: a("painter.png"),
                alt: ""
              }, null, 8, di)
            ]),
            d("div", fi, B(p.value), 1)
          ])
        ]),
        d("div", hi, [
          d("div", pi, [
            d("div", gi, [
              d("img", {
                class: "imageLimit",
                src: a("designer.png"),
                alt: ""
              }, null, 8, mi)
            ]),
            d("div", vi, B(h.value), 1)
          ])
        ]),
        d("div", {
          class: "audioWrapper",
          style: ae(ie.value ? null : { height: `${(L.value.length + 1) * 50}px` })
        }, [
          d("div", _i, [
            d("div", yi, [
              d("img", {
                src: a("cv.png"),
                alt: ""
              }, null, 8, bi)
            ]),
            d("div", wi, B(ne.value), 1),
            d("div", {
              class: "collapseWrapper",
              onClick: I[0] || (I[0] = (D) => ie.value = !ie.value)
            }, [
              d("img", {
                src: a(ie.value ? "plus.png" : "sub.png"),
                style: { height: "50%" },
                alt: ""
              }, null, 8, Ci)
            ])
          ]),
          d("div", ki, [
            (y(!0), w(q, null, ee(L.value, (D) => (y(), w("div", {
              key: D,
              class: "selectWrapper",
              onClick: (Se) => Oe(D)
            }, [
              d("div", {
                class: K(D === W.value ? "choice" : "nochoice")
              }, null, 2),
              d("div", {
                class: K(D === W.value ? "choice-contentTextWrapper" : "nochoice-contentTextWrapper")
              }, [
                d("div", Di, B(Pe(D)), 1)
              ], 2)
            ], 8, Si))), 128))
          ])
        ], 4)
      ]),
      d("div", Ti, [
        d("div", Ei, [
          d("div", {
            class: "charNameTitle",
            innerHTML: s.value
          }, null, 8, xi)
        ]),
        d("div", Ii, [
          d("div", {
            class: "charNameText",
            innerHTML: c.value
          }, null, 8, Mi)
        ]),
        d("div", Wi, [
          l.value.maxHp + l.value.hujia > 6 ? (y(), w(q, { key: 0 }, [
            d("div", Ni, [
              I[1] || (I[1] = d("div", { class: "actualHpSJZX" }, null, -1)),
              d("div", Pi, B(l.value.hp) + "/" + B(l.value.maxHp), 1)
            ]),
            l.value.hujia > 0 ? (y(), w("div", Oi, [
              I[2] || (I[2] = d("div", { class: "shieldSJZX" }, null, -1)),
              d("div", Ai, B(l.value.hujia), 1)
            ])) : me("", !0)
          ], 64)) : (y(), w(q, { key: 1 }, [
            (y(!0), w(q, null, ee(l.value.maxHp, (D) => (y(), w("div", {
              key: `hp${D}`,
              class: K(D <= l.value.hp ? "actualHpSJZX" : "emptyHpSJZX")
            }, null, 2))), 128)),
            (y(!0), w(q, null, ee(l.value.hujia, (D) => (y(), w("div", {
              key: `shield${D}`,
              class: "shieldSJZX"
            }))), 128))
          ], 64))
        ])
      ]),
      d("div", $i, [
        d("div", {
          ref_key: "charImageEl",
          ref: _,
          class: "charImage",
          style: ae(O.value)
        }, null, 4),
        d("div", {
          class: "charSkinBottomUIWrapper",
          style: ae({ display: $.value ? "" : "none" })
        }, [
          d("div", {
            class: K(["buttonWrapper", { "buttonWrapper-enableSkinBG": M.value }]),
            onClick: ue
          }, [
            d("div", Li, B(M.value ? "关闭动皮" : "开启动皮"), 1)
          ], 2)
        ], 4)
      ]),
      d("div", Xi, [
        o.value === "skill" ? (y(), De(bn, {
          key: 0,
          name: e.name
        }, null, 8, ["name"])) : o.value === "skin" ? (y(), De(xn, {
          key: 1,
          name: e.name,
          onSkinChange: ce
        }, null, 8, ["name"])) : o.value === "mode" ? (y(), De(Xn, {
          key: 2,
          name: e.name
        }, null, 8, ["name"])) : o.value === "background" ? (y(), De(Vn, {
          key: 3,
          value: t.value,
          onSelect: Qe
        }, null, 8, ["value"])) : (y(), De(Fn, {
          key: 4,
          name: e.name
        }, null, 8, ["name"]))
      ])
    ], 4));
  }
}, Ri = /* @__PURE__ */ ke(Hi, [["__scopeId", "data-v-82afe2e9"]]), St = "enableWhichWayCharacterCardStyle";
class Fi {
  /** 当前武将卡的 Vue 应用与挂载容器（同一时刻只会存在一张卡） */
  #e = null;
  #t = null;
  constructor() {
    Ut({
      name: "whichWayCharacterCardStyleOverride_add",
      fn() {
        Object.defineProperty(gt.click, "charactercard", {
          value: gt.click.charactercard,
          writable: !0,
          configurable: !0,
          enumerable: !0
        }), zt.appendHook("ui.click.charactercard", {
          before: function(n, t, i, o, a, r) {
            if (Ve.shouldUseStyle(n))
              return Ve.create(n), !1;
          }
        });
      }
    }), Gt({
      name: "whichWayCharacterCardStyleConfig_add",
      priority: 770,
      obj: {
        name: St,
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
    });
  }
  /**
   * 当前样式模式。
   *
   * 兼容旧版本的布尔配置：旧版本这个选项是开关（`true` / `false`），
   * 老存档里存的就是布尔值 —— `true` 视为「所有角色」（旧版开启后对所有武将生效）、`false` 视为「关闭」。
   */
  getStyleMode() {
    const n = He.config(St);
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
    const c = Xt(Ri, {
      name: n,
      onClose: () => this.close()
    });
    c.mount(s), this.#e = c, this.#t = s;
  }
  /** 关闭武将卡：卸载 Vue 应用、移除容器，并让场上玩家头像与动皮同步 */
  close() {
    this.#e?.unmount(), this.#e = null, this.#t?.remove(), this.#t = null, Q.refreshSkin(), ut.resume2();
  }
}
const Ve = new Fi();
jt({
  name: "whichwayCharacterCard_dev",
  fn: () => {
    window.whichWayCharacterCard = Ve;
  }
});
window.whichWay.register("characterCard", Ve);
export {
  Ve as whichWayCharacterCard
};
