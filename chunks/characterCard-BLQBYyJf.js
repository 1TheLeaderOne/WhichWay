import { game as fe, get as O, ui as c, lib as I } from "noname";
import { whichWayFile as me } from "./file-CXhVBbUa.js";
import { whichWayUtil as De } from "./utill-DpF3UCI4.js";
import { w as j, s as V } from "./skin-confOverride-shared-BVzlctbo.js";
import { b as bt, c as wt, g as Ct } from "./packs-base-characterDesigner-shared-CffpBhTy.js";
import { whichWayAudio as z } from "./audio-2wIS4ukw.js";
import { whichWayToast as Tt } from "./toast-BKImUKDM.js";
import { onContent as kt, onConfig as Dt, onSetDev as _t } from "./hooks-BscfO9lD.js";
import { whichWayArknight as et } from "./arknight-CNwD5MVC.js";
import { whichWayAPIOverride as Et } from "./override-B27IQjje.js";
import { whichWayCharacterModules as Ie } from "./modules-CttU88aU.js";
class Wt {
  get charImage() {
    return document.body.querySelector(".charImage");
  }
  get tool() {
    return Je;
  }
  findButton(n) {
    const t = document.body.querySelectorAll(".btn-background");
    for (let i of t)
      if (i.dataset && i.dataset.btnName === n) return i;
  }
  getCharName() {
    return document.body.querySelector(".container-CC-SJZX").dataset.charName;
  }
  quit() {
    const n = this.findButton("quit"), t = document.querySelector(".displayArenaSJZX"), i = document.querySelector(".btn-selected-SJZX");
    i && i.classList.remove("btn-selected-SJZX"), n.classList.add("btn-selected-SJZX"), this.showResumeChar(t, this.getCharName());
  }
  skill() {
    const n = this.findButton("skill"), t = document.querySelector(".displayArenaSJZX"), i = document.querySelector(".btn-selected-SJZX");
    i && i.classList.remove("btn-selected-SJZX"), n.classList.add("btn-selected-SJZX"), this.showCharSkill(t, this.getCharName());
  }
  async skin() {
    const n = this.findButton("skin"), t = document.querySelector(".displayArenaSJZX"), i = document.querySelector(".btn-selected-SJZX");
    i && i.classList.remove("btn-selected-SJZX"), n.classList.add("btn-selected-SJZX"), await this.showSkinChar(t, this.getCharName());
  }
  mode() {
    const n = this.findButton("mode"), t = document.querySelector(".displayArenaSJZX"), i = document.querySelector(".btn-selected-SJZX");
    i && i.classList.remove("btn-selected-SJZX"), n.classList.add("btn-selected-SJZX"), this.showCharModules(t, this.getCharName());
  }
  async toggleSkin(n) {
    let t = this.getCharName(), i = j.getCurentSkin(t);
    await V.toggleDycSkin(t, i);
    let r = n.currentTarget, a = r.querySelector(".buttonText");
    r.classList.toggle("buttonWrapper-enableSkinBG"), a && (a.innerHTML = V.isEnabledSkin(t, i) ? "关闭动皮" : "开启动皮"), await V.updateDyc(t, this.charImage);
    for (let o of fe.players)
      O.name(o) === t && await V.updateDyc(t, o);
  }
  async showCharSkill(n, t) {
    n.replaceChildren();
    let i = O.character(t).skills, r = {};
    i.forEach((a) => {
      let o = O.info(a);
      o.derivation && (r[a] = Array.isArray(o.derivation) ? o.derivation : [o.derivation]);
    });
    for (let a of i) {
      const o = c.create.div(".skillWrapper", n), s = c.create.div(".headWrapper", o), l = c.create.div(".dragHandle", s);
      l.innerHTML = "≡";
      const u = c.create.div(".skillname", s);
      u.innerHTML = O.translation(a), c.create.div(".audioBtn", s).addEventListener("click", async (f) => {
        z.playSkillAudio(a, t);
      });
      let p = O.info(a);
      if (typeof p.frequent == "boolean") {
        const f = c.create.div(".autoSkill", s);
        f.innerHTML = "自动发动";
        let b = I.config.autoskilllist.includes(a) ? !1 : p.frequent;
        f.classList.add(b ? "autoSkillOpened" : "autoSkillClosed"), f.dataset.auto = b, f.addEventListener("click", async function(k) {
          let T = k.currentTarget;
          T !== null && (T.dataset.auto === "true" ? (T.dataset.auto = "false", T.classList.remove("autoSkillOpened"), T.classList.add("autoSkillClosed"), I.config.autoskilllist.add(a)) : (T.dataset.auto = "true", T.classList.remove("autoSkillClosed"), T.classList.add("autoSkillOpened"), I.config.autoskilllist.includes(a) && I.config.autoskilllist.remove(a)), fe.saveConfig("autoskilllist", I.config.autoskilllist));
        });
      }
      const g = c.create.div(".skillInfo", o);
      let y = O.skillInfoTranslation(a, void 0, !1);
      I.translate[`${a}_append`] && (y += `<br>${O.translation(`${a}_append`)}`), g.innerHTML = y, r[a] && r[a].forEach((f) => {
        const b = c.create.div(".skillWrapper", n), k = c.create.div(".headWrapper", b), T = c.create.div(".dragHandle", k);
        T.innerHTML = "≡";
        const q = c.create.div(".dskillname", k);
        q.innerHTML = O.translation(f), c.create.div(".audioBtn", k).addEventListener("click", async () => {
          z.playSkillAudio(a, t);
        });
        let E = O.info(f);
        if (typeof E.frequent == "boolean") {
          const P = c.create.div(".autoSkill", k);
          P.innerHTML = "自动发动";
          let Y = I.config.autoskilllist.includes(f) ? !1 : E.frequent;
          P.classList.add(Y ? "autoSkillOpened" : "autoSkillClosed"), P.dataset.auto = Y, P.addEventListener("click", async function(B) {
            let x = B.currentTarget;
            x.dataset.auto === "true" ? (x.dataset.auto = "false", x.classList.remove("autoSkillOpened"), x.classList.add("autoSkillClosed"), I.config.autoskilllist.add(f)) : (x.dataset.auto = "true", x.classList.remove("autoSkillClosed"), x.classList.add("autoSkillOpened"), I.config.autoskilllist.includes(f) && I.config.autoskilllist.remove(f)), fe.saveConfig("autoskilllist", I.config.autoskilllist);
          });
        }
        const G = c.create.div(".skillInfo", b);
        let Q = O.skillInfoTranslation(f, void 0, !1);
        I.translate[`${f}_append`] && (Q += `<br>${O.translation(`${f}_append`)}`), G.innerHTML = Q;
      });
    }
  }
  async showResumeChar(n, t) {
    n.replaceChildren();
    const i = O.characterIntro(t), r = c.create.div(".charInfoWrapper", n), a = c.create.div(".charTitle", r);
    a.innerHTML = "干员档案";
    const o = c.create.div(".charInfo", r);
    o.innerHTML = i;
    const s = c.create.div(".charTitle", r);
    s.innerHTML = "光荣之路", c.create.div(".charInfo", r, {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center"
    });
  }
  async showCharModules(n, t) {
    n.replaceChildren();
    const i = Ie.getCharModules(t, !1);
    for (let a in i) {
      let o = i[a];
      const s = c.create.div(".charModulesWrapper", n);
      s.dataset.moduleId = a;
      const l = c.create.div(".modulesTitle", s);
      l.innerHTML = o.name;
      const u = c.create.div(".modulesInfoWrapper", s), h = c.create.div(".modulesImage", u);
      h.style.backgroundImage = "url(" + o.url + ")";
      const p = c.create.div(".modulesInfo", u);
      let g = Array.isArray(o.intro) ? o.intro : [o.intro];
      p.style.height = getComputedStyle(u).height;
      for (let f of g)
        c.create.div(".infoText", p).innerHTML = f;
      if (o.effect) {
        const f = c.create.div(".modulesEffectTitle", s);
        f.innerHTML = "模组效果";
        const b = c.create.div(".modulesEffectInfo", s);
        b.innerHTML = await r(o.effect.intro);
      }
      Ie.getCharModules(t).id === a && (c.create.div(".modulesSelectedSJZX", s), s.classList.add("modulesSelectedWrapper")), s.addEventListener("click", async (f) => {
        let b = f.currentTarget, k = document.querySelector(".modulesSelectedWrapper");
        b.classList.contains("modulesSelectedWrapper") || (k.classList.remove("modulesSelectedWrapper"), k.removeChild(k.querySelector(".modulesSelectedSJZX")), b.classList.add("modulesSelectedWrapper"), c.create.div(".modulesSelectedSJZX", b), Ie.setCharModules(t, b.dataset.moduleId), !I.config.noMentionModulesChange && I.config.extension_whitherHelm_sjzxAutoReloadByChooseModule && (confirm("更换模组后部分效果需要重启才能生效，即将自动重启（如果不希望自动重启请去设置里关闭“更换模组自动重启游戏”）！选择“确定”则不再弹出此提示") && (I.config.noMentionModulesChange = !0), fe.saveConfig("noMentionModulesChange", I.config.noMentionModulesChange)), I.config.extension_whitherHelm_sjzxAutoReloadByChooseModule && fe.reload());
      });
    }
    async function r(a) {
      if (!a)
        return console.warn("intro 不存在"), "";
      a = Array.isArray(a) ? a : [a];
      for (let o = 0; o < a.length; o++) {
        let s = a[o];
        typeof s == "function" && (a[o] = s());
      }
      return a.join("<br>");
    }
  }
  async showSkinChar(n, t) {
    n.replaceChildren();
    const i = j.getCharacterSkin(t);
    for (const r in i) {
      const a = i[r], o = c.create.div(".skinListWrapper", n), s = c.create.div(".skinAvatorWrapper", o), l = c.create.div(".imageSkin", s);
      l.style.backgroundImage = "url(" + a + ")";
      const u = c.create.div(".skinTextWrapper", o), h = c.create.div(".skinText", u);
      h.innerHTML = `${r}`, o.dataset.skinUrl = a, o.dataset.skinName = r, o.dataset.charName = t, o.addEventListener("click", async (p) => {
        let g = p.currentTarget, y = document.querySelector(".skinListSelectedWrapper"), f = g.dataset.skinUrl, b = g.dataset.skinName, k = g.dataset.charName;
        g.classList.contains("skinListSelectedWrapper") || (y && (y.classList.remove("skinListSelectedWrapper"), y.removeChild(y.querySelector(".skinSelectedSJZX"))), g.classList.add("skinListSelectedWrapper"), c.create.div(".skinSelectedSJZX", g), j.setCharacterSkin(k, b), this.tool.updateSkinImage(b, f, t), j.refreshSkin());
      }), j.getCurentSkin(t) === r && (c.create.div(".skinSelectedSJZX", o), o.classList.add("skinListSelectedWrapper"));
    }
  }
}
const ce = new Wt();
function K(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
const ie = K(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Be = K(/Edge/i), tt = K(/firefox/i), Le = K(/safari/i) && !K(/chrome/i) && !K(/android/i), Ve = K(/iP(ad|od|hone)/i), ct = K(/chrome/i) && K(/android/i), dt = {
  capture: !1,
  passive: !1
};
function C(e, n, t) {
  e.addEventListener(n, t, !ie && dt);
}
function w(e, n, t) {
  e.removeEventListener(n, t, !ie && dt);
}
function Xe(e, n) {
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
function ut(e) {
  return e.host && e !== document && e.host.nodeType ? e.host : e.parentNode;
}
function U(e, n, t, i) {
  if (e) {
    t = t || document;
    do {
      if (n != null && (n[0] === ">" ? e.parentNode === t && Xe(e, n) : Xe(e, n)) || i && e === t)
        return e;
      if (e === t) break;
    } while (e = ut(e));
  }
  return null;
}
const nt = /\s+/g;
function Z(e, n, t) {
  if (e && n)
    if (e.classList)
      e.classList[t ? "add" : "remove"](n);
    else {
      let i = (" " + e.className + " ").replace(nt, " ").replace(" " + n + " ", " ");
      e.className = (i + (t ? " " + n : "")).replace(nt, " ");
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
function ge(e, n) {
  let t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      let r = m(e, "transform");
      r && r !== "none" && (t = r + " " + t);
    } while (!n && (e = e.parentNode));
  const i = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return i && new i(t);
}
function ft(e, n, t) {
  if (e) {
    let i = e.getElementsByTagName(n), r = 0, a = i.length;
    if (t)
      for (; r < a; r++)
        t(i[r], r);
    return i;
  }
  return [];
}
function ne() {
  let e = document.scrollingElement;
  return e || document.documentElement;
}
function L(e, n, t, i, r) {
  if (!e.getBoundingClientRect && e !== window) return;
  let a, o, s, l, u, h, p;
  if (e !== window && e.parentNode && e !== ne() ? (a = e.getBoundingClientRect(), o = a.top, s = a.left, l = a.bottom, u = a.right, h = a.height, p = a.width) : (o = 0, s = 0, l = window.innerHeight, u = window.innerWidth, h = window.innerHeight, p = window.innerWidth), (n || t) && e !== window && (r = r || e.parentNode, !ie))
    do
      if (r && r.getBoundingClientRect && (m(r, "transform") !== "none" || t && m(r, "position") !== "static")) {
        let g = r.getBoundingClientRect();
        o -= g.top + parseInt(m(r, "border-top-width")), s -= g.left + parseInt(m(r, "border-left-width")), l = o + a.height, u = s + a.width;
        break;
      }
    while (r = r.parentNode);
  if (i && e !== window) {
    let g = ge(r || e), y = g && g.a, f = g && g.d;
    g && (o /= f, s /= y, p /= y, h /= f, l = o + h, u = s + p);
  }
  return {
    top: o,
    left: s,
    bottom: l,
    right: u,
    width: p,
    height: h
  };
}
function it(e, n, t) {
  let i = at(e, !0), r = L(e)[n];
  for (; i; ) {
    let a = L(i)[t], o;
    if (o = r >= a, !o) return i;
    if (i === ne()) break;
    i = at(i, !1);
  }
  return !1;
}
function we(e, n, t, i) {
  let r = 0, a = 0, o = e.children;
  for (; a < o.length; ) {
    if (o[a].style.display !== "none" && o[a] !== v.ghost && (i || o[a] !== v.dragged) && U(o[a], t.draggable, e, !1)) {
      if (r === n)
        return o[a];
      r++;
    }
    a++;
  }
  return null;
}
function Ke(e, n) {
  let t = e.lastElementChild;
  for (; t && (t === v.ghost || m(t, "display") === "none" || n && !Xe(t, n)); )
    t = t.previousElementSibling;
  return t || null;
}
function $(e, n) {
  let t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== v.clone && (!n || Xe(e, n)) && t++;
  return t;
}
function rt(e) {
  let n = 0, t = 0, i = ne();
  if (e)
    do {
      let r = ge(e), a = r.a, o = r.d;
      n += e.scrollLeft * a, t += e.scrollTop * o;
    } while (e !== i && (e = e.parentNode));
  return [n, t];
}
function Mt(e, n) {
  for (let t in e)
    if (e.hasOwnProperty(t)) {
      for (let i in n)
        if (n.hasOwnProperty(i) && n[i] === e[t][i]) return Number(t);
    }
  return -1;
}
function at(e, n) {
  if (!e || !e.getBoundingClientRect) return ne();
  let t = e, i = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      let r = m(t);
      if (t.clientWidth < t.scrollWidth && (r.overflowX == "auto" || r.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (r.overflowY == "auto" || r.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return ne();
        if (i || n) return t;
        i = !0;
      }
    }
  while (t = t.parentNode);
  return ne();
}
function It(e, n) {
  if (e && n)
    for (let t in n)
      n.hasOwnProperty(t) && (e[t] = n[t]);
  return e;
}
function Re(e, n) {
  return Math.round(e.top) === Math.round(n.top) && Math.round(e.left) === Math.round(n.left) && Math.round(e.height) === Math.round(n.height) && Math.round(e.width) === Math.round(n.width);
}
let qe;
function Lt(e, n) {
  return function() {
    if (!qe) {
      let t = arguments, i = this;
      t.length === 1 ? e.call(i, t[0]) : e.apply(i, t), qe = setTimeout(function() {
        qe = void 0;
      }, n);
    }
  };
}
function xt(e, n, t) {
  e.scrollLeft += n, e.scrollTop += t;
}
function ht(e) {
  let n = window.Polymer, t = window.jQuery || window.Zepto;
  return n && n.dom ? n.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function pt(e, n, t) {
  const i = {};
  return Array.from(e.children).forEach((r) => {
    if (!U(r, n.draggable, e, !1) || r.animated || r === t) return;
    const a = L(r);
    i.left = Math.min(i.left ?? 1 / 0, a.left), i.top = Math.min(i.top ?? 1 / 0, a.top), i.right = Math.max(i.right ?? -1 / 0, a.right), i.bottom = Math.max(i.bottom ?? -1 / 0, a.bottom);
  }), i.width = i.right - i.left, i.height = i.bottom - i.top, i.x = i.left, i.y = i.top, i;
}
const R = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Nt() {
  let e = [], n;
  return {
    captureAnimationState() {
      if (e = [], !this.options.animation) return;
      [].slice.call(this.el.children).forEach((i) => {
        if (m(i, "display") === "none" || i === v.ghost) return;
        e.push({
          target: i,
          rect: L(i)
        });
        let r = { ...e[e.length - 1].rect };
        if (i.thisAnimationDuration) {
          let a = ge(i, !0);
          a && (r.top -= a.f, r.left -= a.e);
        }
        i.fromRect = r;
      });
    },
    addAnimationState(t) {
      e.push(t);
    },
    removeAnimationState(t) {
      e.splice(Mt(e, { target: t }), 1);
    },
    animateAll(t) {
      if (!this.options.animation) {
        clearTimeout(n), typeof t == "function" && t();
        return;
      }
      let i = !1, r = 0;
      e.forEach((a) => {
        let o = 0, s = a.target, l = s.fromRect, u = L(s), h = s.prevFromRect, p = s.prevToRect, g = a.rect, y = ge(s, !0);
        y && (u.top -= y.f, u.left -= y.e), s.toRect = u, s.thisAnimationDuration && Re(h, u) && !Re(l, u) && // Make sure animatingRect is on line between toRect & fromRect
        (g.top - u.top) / (g.left - u.left) === (l.top - u.top) / (l.left - u.left) && (o = Xt(g, h, p, this.options)), Re(u, l) || (s.prevFromRect = l, s.prevToRect = u, o || (o = this.options.animation), this.animate(
          s,
          g,
          u,
          o
        )), o && (i = !0, r = Math.max(r, o), clearTimeout(s.animationResetTimer), s.animationResetTimer = setTimeout(function() {
          s.animationTime = 0, s.prevFromRect = null, s.fromRect = null, s.prevToRect = null, s.thisAnimationDuration = null;
        }, o), s.thisAnimationDuration = o);
      }), clearTimeout(n), i ? n = setTimeout(function() {
        typeof t == "function" && t();
      }, r) : typeof t == "function" && t(), e = [];
    },
    animate(t, i, r, a) {
      if (a) {
        m(t, "transition", ""), m(t, "transform", "");
        let o = ge(this.el), s = o && o.a, l = o && o.d, u = (i.left - r.left) / (s || 1), h = (i.top - r.top) / (l || 1);
        t.animatingX = !!u, t.animatingY = !!h, m(t, "transform", "translate3d(" + u + "px," + h + "px,0)"), this.forRepaintDummy = At(t), m(t, "transition", "transform " + a + "ms" + (this.options.easing ? " " + this.options.easing : "")), m(t, "transform", "translate3d(0,0,0)"), typeof t.animated == "number" && clearTimeout(t.animated), t.animated = setTimeout(function() {
          m(t, "transition", ""), m(t, "transform", ""), t.animated = !1, t.animatingX = !1, t.animatingY = !1;
        }, a);
      }
    }
  };
}
function At(e) {
  return e.offsetWidth;
}
function Xt(e, n, t, i) {
  return Math.sqrt(Math.pow(n.top - e.top, 2) + Math.pow(n.left - e.left, 2)) / Math.sqrt(Math.pow(n.top - t.top, 2) + Math.pow(n.left - t.left, 2)) * i.animation;
}
let de = [];
const Ye = {
  initializeByDefault: !0
}, Ce = {
  mount(e) {
    for (let n in Ye)
      Ye.hasOwnProperty(n) && !(n in e) && (e[n] = Ye[n]);
    de.forEach((n) => {
      if (n.pluginName === e.pluginName)
        throw `Sortable: Cannot mount plugin ${e.pluginName} more than once`;
    }), de.push(e);
  },
  pluginEvent(e, n, t) {
    this.eventCanceled = !1, t.cancel = () => {
      this.eventCanceled = !0;
    };
    const i = e + "Global";
    de.forEach((r) => {
      n[r.pluginName] && (n[r.pluginName][i] && n[r.pluginName][i]({ sortable: n, ...t }), n.options[r.pluginName] && n[r.pluginName][e] && n[r.pluginName][e]({ sortable: n, ...t }));
    });
  },
  initializePlugins(e, n, t, i) {
    de.forEach((r) => {
      const a = r.pluginName;
      if (!e.options[a] && !r.initializeByDefault) return;
      let o = new r(e, n, e.options);
      o.sortable = e, o.options = e.options, e[a] = o, Object.assign(t, o.defaults);
    });
    for (let r in e.options) {
      if (!e.options.hasOwnProperty(r)) continue;
      let a = this.modifyOption(e, r, e.options[r]);
      typeof a < "u" && (e.options[r] = a);
    }
  },
  getEventProperties(e, n) {
    let t = {};
    return de.forEach((i) => {
      typeof i.eventProperties == "function" && Object.assign(t, i.eventProperties.call(n[i.pluginName], e));
    }), t;
  },
  modifyOption(e, n, t) {
    let i;
    return de.forEach((r) => {
      e[r.pluginName] && r.optionListeners && typeof r.optionListeners[n] == "function" && (i = r.optionListeners[n].call(e[r.pluginName], t));
    }), i;
  }
};
function Ot({
  sortable: e,
  rootEl: n,
  name: t,
  targetEl: i,
  cloneEl: r,
  toEl: a,
  fromEl: o,
  oldIndex: s,
  newIndex: l,
  oldDraggableIndex: u,
  newDraggableIndex: h,
  originalEvent: p,
  putSortable: g,
  extraEventProperties: y
}) {
  if (e = e || n && n[R], !e) return;
  let f, b = e.options, k = "on" + t.charAt(0).toUpperCase() + t.substr(1);
  window.CustomEvent && !ie && !Be ? f = new CustomEvent(t, {
    bubbles: !0,
    cancelable: !0
  }) : (f = document.createEvent("Event"), f.initEvent(t, !0, !0)), f.to = a || n, f.from = o || n, f.item = i || n, f.clone = r, f.oldIndex = s, f.newIndex = l, f.oldDraggableIndex = u, f.newDraggableIndex = h, f.originalEvent = p, f.pullMode = g ? g.lastPutMode : void 0;
  let T = { ...y, ...Ce.getEventProperties(t, e) };
  for (let q in T)
    f[q] = T[q];
  n && n.dispatchEvent(f), b[k] && b[k].call(e, f);
}
let H = function(e, n, { evt: t, ...i } = {}) {
  Ce.pluginEvent.bind(v)(e, n, {
    dragEl: d,
    parentEl: M,
    ghostEl: S,
    rootEl: D,
    nextEl: le,
    lastDownEl: xe,
    cloneEl: W,
    cloneHidden: te,
    dragStarted: ye,
    putSortable: N,
    activeSortable: v.active,
    originalEvent: t,
    oldIndex: pe,
    oldDraggableIndex: Se,
    newIndex: J,
    newDraggableIndex: ee,
    hideGhostForTarget: St,
    unhideGhostForTarget: vt,
    cloneNowHidden() {
      te = !0;
    },
    cloneNowShown() {
      te = !1;
    },
    dispatchSortableEvent(r) {
      X({ sortable: n, name: r, originalEvent: t });
    },
    ...i
  });
};
function X(e) {
  Ot({
    putSortable: N,
    cloneEl: W,
    targetEl: d,
    rootEl: D,
    oldIndex: pe,
    oldDraggableIndex: Se,
    newIndex: J,
    newDraggableIndex: ee,
    ...e
  });
}
let d, M, S, D, le, xe, W, te, pe, J, Se, ee, _e, N, he = !1, Oe = !1, He = [], oe, F, $e, Fe, ot, st, ye, ue, ve, be = !1, Ee = !1, Ne, A, Ue = [], ze = !1, Pe = [];
const Ze = typeof document < "u", We = Ve, lt = Be || ie ? "cssFloat" : "float", Ht = Ze && !ct && !Ve && "draggable" in document.createElement("div"), gt = (function() {
  if (!Ze) return;
  if (ie)
    return !1;
  let e = document.createElement("x");
  return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
})(), mt = function(e, n) {
  let t = m(e), i = parseInt(t.width) - parseInt(t.paddingLeft) - parseInt(t.paddingRight) - parseInt(t.borderLeftWidth) - parseInt(t.borderRightWidth), r = we(e, 0, n), a = we(e, 1, n), o = r && m(r), s = a && m(a), l = o && parseInt(o.marginLeft) + parseInt(o.marginRight) + L(r).width, u = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + L(a).width;
  if (t.display === "flex")
    return t.flexDirection === "column" || t.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (t.display === "grid")
    return t.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && o.float && o.float !== "none") {
    let h = o.float === "left" ? "left" : "right";
    return a && (s.clear === "both" || s.clear === h) ? "vertical" : "horizontal";
  }
  return r && (o.display === "block" || o.display === "flex" || o.display === "table" || o.display === "grid" || l >= i && t[lt] === "none" || a && t[lt] === "none" && l + u > i) ? "vertical" : "horizontal";
}, Pt = function(e, n, t) {
  let i = t ? e.left : e.top, r = t ? e.right : e.bottom, a = t ? e.width : e.height, o = t ? n.left : n.top, s = t ? n.right : n.bottom, l = t ? n.width : n.height;
  return i === o || r === s || i + a / 2 === o + l / 2;
}, Bt = function(e, n) {
  let t;
  return He.some((i) => {
    const r = i[R].options.emptyInsertThreshold;
    if (!r || Ke(i)) return;
    const a = L(i), o = e >= a.left - r && e <= a.right + r, s = n >= a.top - r && n <= a.bottom + r;
    if (o && s)
      return t = i;
  }), t;
}, yt = function(e) {
  function n(r, a) {
    return function(o, s, l, u) {
      let h = o.options.group.name && s.options.group.name && o.options.group.name === s.options.group.name;
      if (r == null && (a || h))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (a && r === "clone")
        return r;
      if (typeof r == "function")
        return n(r(o, s, l, u), a)(o, s, l, u);
      {
        let p = (a ? o : s).options.group.name;
        return r === !0 || typeof r == "string" && r === p || r.join && r.indexOf(p) > -1;
      }
    };
  }
  let t = {}, i = e.group;
  (!i || typeof i != "object") && (i = { name: i }), t.name = i.name, t.checkPull = n(i.pull, !0), t.checkPut = n(i.put), t.revertClone = i.revertClone, e.group = t;
}, St = function() {
  !gt && S && m(S, "display", "none");
}, vt = function() {
  !gt && S && m(S, "display", "");
};
Ze && !ct && document.addEventListener("click", function(e) {
  if (Oe)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Oe = !1, !1;
}, !0);
let se = function(e) {
  if (d) {
    e = e.touches ? e.touches[0] : e;
    let n = Bt(e.clientX, e.clientY);
    if (n) {
      let t = {};
      for (let i in e)
        e.hasOwnProperty(i) && (t[i] = e[i]);
      t.target = t.rootEl = n, t.preventDefault = void 0, t.stopPropagation = void 0, n[R]._onDragOver(t);
    }
  }
}, Zt = function(e) {
  d && d.parentNode[R]._isOutsideThisEl(e.target);
};
function v(e, n) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw `Sortable: \`el\` must be an HTMLElement, not ${{}.toString.call(e)}`;
  this.el = e, this.options = n = Object.assign({}, n), e[R] = this;
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
      return mt(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(i, r) {
      i.setData("Text", r.textContent);
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
    supportPointer: v.supportPointer !== !1 && "PointerEvent" in window && (!Le || Ve),
    emptyInsertThreshold: 5
  };
  Ce.initializePlugins(this, e, t);
  for (let i in t)
    !(i in n) && (n[i] = t[i]);
  yt(n);
  for (let i in this)
    i.charAt(0) === "_" && typeof this[i] == "function" && (this[i] = this[i].bind(this));
  this.nativeDraggable = n.forceFallback ? !1 : Ht, this.nativeDraggable && (this.options.touchStartThreshold = 1), n.supportPointer ? C(e, "pointerdown", this._onTapStart) : (C(e, "mousedown", this._onTapStart), C(e, "touchstart", this._onTapStart)), this.nativeDraggable && (C(e, "dragover", this), C(e, "dragenter", this)), He.push(this.el), n.store && n.store.get && this.sort(n.store.get(this) || []), Object.assign(this, Nt());
}
v.prototype = /** @lends Sortable.prototype */
{
  constructor: v,
  _isOutsideThisEl: function(e) {
    !this.el.contains(e) && e !== this.el && (ue = null);
  },
  _getDirection: function(e, n) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, e, n, d) : this.options.direction;
  },
  _onTapStart: function(e) {
    if (!e.cancelable) return;
    let n = this, t = this.el, i = this.options, r = i.preventOnFilter, a = e.type, o = e.touches && e.touches[0] || e.pointerType && e.pointerType === "touch" && e, s = (o || e).target, l = e.target.shadowRoot && (e.path && e.path[0] || e.composedPath && e.composedPath()[0]) || s, u = i.filter;
    if (Gt(t), !d && !(/mousedown|pointerdown/.test(a) && e.button !== 0 || i.disabled) && !l.isContentEditable && !(!this.nativeDraggable && Le && s && s.tagName.toUpperCase() === "SELECT") && (s = U(s, i.draggable, t, !1), !(s && s.animated) && xe !== s)) {
      if (pe = $(s), Se = $(s, i.draggable), typeof u == "function") {
        if (u.call(this, e, s, this)) {
          X({
            sortable: n,
            rootEl: l,
            name: "filter",
            targetEl: s,
            toEl: t,
            fromEl: t
          }), H("filter", n, { evt: e }), r && e.preventDefault();
          return;
        }
      } else if (u && (u = u.split(",").some(function(h) {
        if (h = U(l, h.trim(), t, !1), h)
          return X({
            sortable: n,
            rootEl: h,
            name: "filter",
            targetEl: s,
            fromEl: t,
            toEl: t
          }), H("filter", n, { evt: e }), !0;
      }), u)) {
        r && e.preventDefault();
        return;
      }
      i.handle && !U(l, i.handle, t, !1) || this._prepareDragStart(e, o, s);
    }
  },
  _prepareDragStart: function(e, n, t) {
    let i = this, r = i.el, a = i.options, o = r.ownerDocument, s;
    if (t && !d && t.parentNode === r) {
      let l = L(t);
      if (D = r, d = t, M = d.parentNode, le = d.nextSibling, xe = t, _e = a.group, v.dragged = d, oe = {
        target: d,
        clientX: (n || e).clientX,
        clientY: (n || e).clientY
      }, ot = oe.clientX - l.left, st = oe.clientY - l.top, this._lastX = (n || e).clientX, this._lastY = (n || e).clientY, d.style["will-change"] = "all", s = function() {
        if (H("delayEnded", i, { evt: e }), v.eventCanceled) {
          i._onDrop();
          return;
        }
        i._disableDelayedDragEvents(), !tt && i.nativeDraggable && (d.draggable = !0), i._triggerDragStart(e, n), X({
          sortable: i,
          name: "choose",
          originalEvent: e
        }), Z(d, a.chosenClass, !0);
      }, a.ignore.split(",").forEach(function(u) {
        ft(d, u.trim(), Ge);
      }), C(o, "dragover", se), C(o, "mousemove", se), C(o, "touchmove", se), a.supportPointer ? (C(o, "pointerup", i._onDrop), !this.nativeDraggable && C(o, "pointercancel", i._onDrop)) : (C(o, "mouseup", i._onDrop), C(o, "touchend", i._onDrop), C(o, "touchcancel", i._onDrop)), tt && this.nativeDraggable && (this.options.touchStartThreshold = 4, d.draggable = !0), H("delayStart", this, { evt: e }), a.delay && (!a.delayOnTouchOnly || n) && (!this.nativeDraggable || !(Be || ie))) {
        if (v.eventCanceled) {
          this._onDrop();
          return;
        }
        a.supportPointer ? (C(o, "pointerup", i._disableDelayedDrag), C(o, "pointercancel", i._disableDelayedDrag)) : (C(o, "mouseup", i._disableDelayedDrag), C(o, "touchend", i._disableDelayedDrag), C(o, "touchcancel", i._disableDelayedDrag)), C(o, "mousemove", i._delayedDragTouchMoveHandler), C(o, "touchmove", i._delayedDragTouchMoveHandler), a.supportPointer && C(o, "pointermove", i._delayedDragTouchMoveHandler), i._dragStartTimer = setTimeout(s, a.delay);
      } else
        s();
    }
  },
  _delayedDragTouchMoveHandler: function(e) {
    let n = e.touches ? e.touches[0] : e;
    Math.max(Math.abs(n.clientX - this._lastX), Math.abs(n.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    d && Ge(d), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    let e = this.el.ownerDocument;
    w(e, "mouseup", this._disableDelayedDrag), w(e, "touchend", this._disableDelayedDrag), w(e, "touchcancel", this._disableDelayedDrag), w(e, "pointerup", this._disableDelayedDrag), w(e, "pointercancel", this._disableDelayedDrag), w(e, "mousemove", this._delayedDragTouchMoveHandler), w(e, "touchmove", this._delayedDragTouchMoveHandler), w(e, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(e, n) {
    n = n || e.pointerType == "touch" && e, !this.nativeDraggable || n ? this.options.supportPointer ? C(document, "pointermove", this._onTouchMove) : n ? C(document, "touchmove", this._onTouchMove) : C(document, "mousemove", this._onTouchMove) : (C(d, "dragend", this), C(D, "dragstart", this._onDragStart));
    try {
      document.selection ? Ae(() => {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(e, n) {
    if (he = !1, D && d) {
      H("dragStarted", this, { evt: n }), this.nativeDraggable && C(document, "dragover", Zt);
      let t = this.options;
      !e && Z(d, t.dragClass, !1), Z(d, t.ghostClass, !0), v.active = this, e && this._appendGhost(), X({
        sortable: this,
        name: "start",
        originalEvent: n
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (F) {
      this._lastX = F.clientX, this._lastY = F.clientY, St();
      let e = document.elementFromPoint(F.clientX, F.clientY), n = e;
      for (; e && e.shadowRoot && (e = e.shadowRoot.elementFromPoint(F.clientX, F.clientY), e !== n); )
        n = e;
      if (d.parentNode[R]._isOutsideThisEl(e), n)
        do {
          if (n[R]) {
            let t;
            if (t = n[R]._onDragOver({
              clientX: F.clientX,
              clientY: F.clientY,
              target: e,
              rootEl: n
            }), t && !this.options.dragoverBubble)
              break;
          }
          e = n;
        } while (n = ut(n));
      vt();
    }
  },
  _onTouchMove: function(e) {
    if (oe) {
      let n = this.options, t = n.fallbackTolerance, i = n.fallbackOffset, r = e.touches ? e.touches[0] : e, a = S && ge(S, !0), o = S && a && a.a, s = S && a && a.d, l = We && A && rt(A), u = (r.clientX - oe.clientX + i.x) / (o || 1) + (l ? l[0] - Ue[0] : 0) / (o || 1), h = (r.clientY - oe.clientY + i.y) / (s || 1) + (l ? l[1] - Ue[1] : 0) / (s || 1);
      if (!v.active && !he) {
        if (t && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < t)
          return;
        this._onDragStart(e, !0);
      }
      if (S) {
        a ? (a.e += u - ($e || 0), a.f += h - (Fe || 0)) : a = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: u,
          f: h
        };
        let p = `matrix(${a.a},${a.b},${a.c},${a.d},${a.e},${a.f})`;
        m(S, "webkitTransform", p), m(S, "mozTransform", p), m(S, "msTransform", p), m(S, "transform", p), $e = u, Fe = h, F = r;
      }
      e.cancelable && e.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!S) {
      let e = this.options.fallbackOnBody ? document.body : D, n = L(d, !0, We, !0, e), t = this.options;
      if (We) {
        for (A = e; m(A, "position") === "static" && m(A, "transform") === "none" && A !== document; )
          A = A.parentNode;
        A !== document.body && A !== document.documentElement ? (A === document && (A = ne()), n.top += A.scrollTop, n.left += A.scrollLeft) : A = ne(), Ue = rt(A);
      }
      S = d.cloneNode(!0), Z(S, t.ghostClass, !1), Z(S, t.fallbackClass, !0), Z(S, t.dragClass, !0), m(S, "transition", ""), m(S, "transform", ""), m(S, "box-sizing", "border-box"), m(S, "margin", 0), m(S, "top", n.top), m(S, "left", n.left), m(S, "width", n.width), m(S, "height", n.height), m(S, "opacity", "0.8"), m(S, "position", We ? "absolute" : "fixed"), m(S, "zIndex", "100000"), m(S, "pointerEvents", "none"), v.ghost = S, e.appendChild(S), m(S, "transform-origin", ot / parseInt(S.style.width) * 100 + "% " + st / parseInt(S.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(e, n) {
    let t = this, i = e.dataTransfer, r = t.options;
    if (H("dragStart", this, { evt: e }), v.eventCanceled) {
      this._onDrop();
      return;
    }
    H("setupClone", this), v.eventCanceled || (W = ht(d), W.removeAttribute("id"), W.draggable = !1, W.style["will-change"] = "", this._hideClone(), Z(W, this.options.chosenClass, !1), v.clone = W), t.cloneId = Ae(function() {
      H("clone", t), !v.eventCanceled && (t.options.removeCloneOnHide || D.insertBefore(W, d), t._hideClone(), X({
        sortable: t,
        name: "clone"
      }));
    }), !n && Z(d, r.dragClass, !0), n ? (Oe = !0, t._loopId = setInterval(t._emulateDragOver, 50)) : (w(document, "mouseup", t._onDrop), w(document, "touchend", t._onDrop), w(document, "touchcancel", t._onDrop), i && (i.effectAllowed = "move", r.setData && r.setData.call(t, i, d)), C(document, "drop", t), m(d, "transform", "translateZ(0)")), he = !0, t._dragStartId = Ae(t._dragStarted.bind(t, n, e)), C(document, "selectstart", t), ye = !0, window.getSelection().removeAllRanges(), Le && m(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(e) {
    let n = this.el, t = e.target, i, r, a, o = this.options, s = o.group, l = v.active, u = _e === s, h = o.sort, p = N || l, g, y = this, f = !1;
    if (ze) return;
    function b(_, E) {
      H(_, y, {
        evt: e,
        isOwner: u,
        axis: g ? "vertical" : "horizontal",
        revert: a,
        dragRect: i,
        targetRect: r,
        canSort: h,
        fromSortable: p,
        target: t,
        completed: T,
        onMove(G, Q) {
          return Me(D, n, d, i, G, L(G), e, Q);
        },
        changed: q,
        ...E
      });
    }
    function k() {
      b("dragOverAnimationCapture"), y.captureAnimationState(), y !== p && p.captureAnimationState();
    }
    function T(_) {
      return b("dragOverCompleted", { insertion: _ }), _ && (u ? l._hideClone() : l._showClone(y), y !== p && (Z(d, N ? N.options.ghostClass : l.options.ghostClass, !1), Z(d, o.ghostClass, !0)), N !== y && y !== v.active ? N = y : y === v.active && N && (N = null), p === y && (y._ignoreWhileAnimating = t), y.animateAll(function() {
        b("dragOverAnimationComplete"), y._ignoreWhileAnimating = null;
      }), y !== p && (p.animateAll(), p._ignoreWhileAnimating = null)), (t === d && !d.animated || t === n && !t.animated) && (ue = null), !o.dragoverBubble && !e.rootEl && t !== document && (d.parentNode[R]._isOutsideThisEl(e.target), !_ && se(e)), !o.dragoverBubble && e.stopPropagation && e.stopPropagation(), f = !0;
    }
    function q() {
      J = $(d), ee = $(d, o.draggable), X({
        sortable: y,
        name: "change",
        toEl: n,
        newIndex: J,
        newDraggableIndex: ee,
        originalEvent: e
      });
    }
    if (e.preventDefault !== void 0 && e.cancelable && e.preventDefault(), t = U(t, o.draggable, n, !0), b("dragOver"), v.eventCanceled) return f;
    if (d.contains(e.target) || t.animated && t.animatingX && t.animatingY || y._ignoreWhileAnimating === t)
      return T(!1);
    if (Oe = !1, l && !o.disabled && (u ? h || (a = M !== D) : N === this || (this.lastPutMode = _e.checkPull(this, l, d, e)) && s.checkPut(this, l, d, e))) {
      if (g = this._getDirection(e, t) === "vertical", i = L(d), b("dragOverValid"), v.eventCanceled) return f;
      if (a)
        return M = D, k(), this._hideClone(), b("revert"), v.eventCanceled || (le ? D.insertBefore(d, le) : D.appendChild(d)), T(!0);
      let _ = Ke(n, o.draggable);
      if (!_ || Yt(e, g, this) && !_.animated) {
        if (_ === d)
          return T(!1);
        if (_ && n === e.target && (t = _), t && (r = L(t)), Me(D, n, d, i, t, r, e, !!t) !== !1)
          return k(), _ && _.nextSibling ? n.insertBefore(d, _.nextSibling) : n.appendChild(d), M = n, q(), T(!0);
      } else if (_ && qt(e, g, this)) {
        let E = we(n, 0, o, !0);
        if (E === d)
          return T(!1);
        if (t = E, r = L(t), Me(D, n, d, i, t, r, e, !1) !== !1)
          return k(), n.insertBefore(d, E), M = n, q(), T(!0);
      } else if (t.parentNode === n) {
        r = L(t);
        let E = 0, G, Q = d.parentNode !== n, P = !Pt(d.animated && d.toRect || i, t.animated && t.toRect || r, g), Y = g ? "top" : "left", B = it(t, "top", "top") || it(d, "top", "top"), x = B ? B.scrollTop : void 0;
        ue !== t && (G = r[Y], be = !1, Ee = !P && o.invertSwap || Q), E = $t(
          e,
          t,
          r,
          g,
          P ? 1 : o.swapThreshold,
          o.invertedSwapThreshold == null ? o.swapThreshold : o.invertedSwapThreshold,
          Ee,
          ue === t
        );
        let re;
        if (E !== 0) {
          let Qe = $(d);
          do
            Qe -= E, re = M.children[Qe];
          while (re && (m(re, "display") === "none" || re === S));
        }
        if (E === 0 || re === t)
          return T(!1);
        ue = t, ve = E;
        let Te = t.nextElementSibling, ae = !1;
        ae = E === 1;
        let ke = Me(D, n, d, i, t, r, e, ae);
        if (ke !== !1)
          return (ke === 1 || ke === -1) && (ae = ke === 1), ze = !0, setTimeout(Rt, 30), k(), ae && !Te ? n.appendChild(d) : t.parentNode.insertBefore(d, ae ? Te : t), B && xt(B, 0, x - B.scrollTop), M = d.parentNode, G !== void 0 && !Ee && (Ne = Math.abs(G - L(t)[Y])), q(), T(!0);
      }
      if (n.contains(d))
        return T(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    w(document, "mousemove", this._onTouchMove), w(document, "touchmove", this._onTouchMove), w(document, "pointermove", this._onTouchMove), w(document, "dragover", se), w(document, "mousemove", se), w(document, "touchmove", se);
  },
  _offUpEvents: function() {
    let e = this.el.ownerDocument;
    w(e, "mouseup", this._onDrop), w(e, "touchend", this._onDrop), w(e, "pointerup", this._onDrop), w(e, "pointercancel", this._onDrop), w(e, "touchcancel", this._onDrop), w(document, "selectstart", this);
  },
  _onDrop: function(e) {
    let n = this.el, t = this.options;
    if (J = $(d), ee = $(d, t.draggable), H("drop", this, {
      evt: e
    }), M = d && d.parentNode, J = $(d), ee = $(d, t.draggable), v.eventCanceled) {
      this._nulling();
      return;
    }
    he = !1, Ee = !1, be = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), je(this.cloneId), je(this._dragStartId), this.nativeDraggable && (w(document, "drop", this), w(n, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Le && m(document.body, "user-select", ""), m(d, "transform", ""), e && (ye && (e.cancelable && e.preventDefault(), !t.dropBubble && e.stopPropagation()), S && S.parentNode && S.parentNode.removeChild(S), (D === M || N && N.lastPutMode !== "clone") && W && W.parentNode && W.parentNode.removeChild(W), d && (this.nativeDraggable && w(d, "dragend", this), Ge(d), d.style["will-change"] = "", ye && !he && Z(d, N ? N.options.ghostClass : this.options.ghostClass, !1), Z(d, this.options.chosenClass, !1), X({
      sortable: this,
      name: "unchoose",
      toEl: M,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: e
    }), D !== M ? (J >= 0 && (X({
      rootEl: M,
      name: "add",
      toEl: M,
      fromEl: D,
      originalEvent: e
    }), X({
      sortable: this,
      name: "remove",
      toEl: M,
      originalEvent: e
    }), X({
      rootEl: M,
      name: "sort",
      toEl: M,
      fromEl: D,
      originalEvent: e
    }), X({
      sortable: this,
      name: "sort",
      toEl: M,
      originalEvent: e
    })), N && N.save()) : J !== pe && J >= 0 && (X({
      sortable: this,
      name: "update",
      toEl: M,
      originalEvent: e
    }), X({
      sortable: this,
      name: "sort",
      toEl: M,
      originalEvent: e
    })), v.active && ((J == null || J === -1) && (J = pe, ee = Se), X({
      sortable: this,
      name: "end",
      toEl: M,
      originalEvent: e
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    H("nulling", this), D = d = M = S = le = W = xe = te = oe = F = ye = J = ee = pe = Se = ue = ve = N = _e = v.dragged = v.ghost = v.clone = v.active = null, Pe.forEach(function(e) {
      e.checked = !0;
    }), Pe.length = $e = Fe = 0;
  },
  handleEvent: function(e) {
    switch (e.type) {
      case "drop":
      case "dragend":
        this._onDrop(e);
        break;
      case "dragenter":
      case "dragover":
        d && (this._onDragOver(e), Jt(e));
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
    let e = [], n, t = this.el.children, i = 0, r = t.length, a = this.options;
    for (; i < r; i++)
      n = t[i], U(n, a.draggable, this.el, !1) && e.push(n.getAttribute(a.dataIdAttr) || Ut(n));
    return e;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(e, n) {
    let t = {}, i = this.el;
    this.toArray().forEach(function(r, a) {
      let o = i.children[a];
      U(o, this.options.draggable, i, !1) && (t[r] = o);
    }, this), n && this.captureAnimationState(), e.forEach(function(r) {
      t[r] && (i.removeChild(t[r]), i.appendChild(t[r]));
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
    return U(e, n || this.options.draggable, this.el, !1);
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
      let i = Ce.modifyOption(this, e, n);
      typeof i < "u" ? t[e] = i : t[e] = n, e === "group" && yt(t);
    }
  },
  /**
   * Destroy
   */
  destroy: function() {
    H("destroy", this);
    let e = this.el;
    e[R] = null, w(e, "mousedown", this._onTapStart), w(e, "touchstart", this._onTapStart), w(e, "pointerdown", this._onTapStart), this.nativeDraggable && (w(e, "dragover", this), w(e, "dragenter", this)), Array.prototype.forEach.call(e.querySelectorAll("[draggable]"), function(n) {
      n.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), He.splice(He.indexOf(this.el), 1), this.el = e = null;
  },
  _hideClone: function() {
    if (!te) {
      if (H("hideClone", this), v.eventCanceled) return;
      m(W, "display", "none"), this.options.removeCloneOnHide && W.parentNode && W.parentNode.removeChild(W), te = !0;
    }
  },
  _showClone: function(e) {
    if (e.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (te) {
      if (H("showClone", this), v.eventCanceled) return;
      d.parentNode == D && !this.options.group.revertClone ? D.insertBefore(W, d) : le ? D.insertBefore(W, le) : D.appendChild(W), this.options.group.revertClone && this.animate(d, W), m(W, "display", ""), te = !1;
    }
  }
};
function Jt(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Me(e, n, t, i, r, a, o, s) {
  let l, u = e[R], h = u.options.onMove, p;
  return window.CustomEvent && !ie && !Be ? l = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (l = document.createEvent("Event"), l.initEvent("move", !0, !0)), l.to = n, l.from = e, l.dragged = t, l.draggedRect = i, l.related = r || n, l.relatedRect = a || L(n), l.willInsertAfter = s, l.originalEvent = o, e.dispatchEvent(l), h && (p = h.call(u, l, o)), p;
}
function Ge(e) {
  e.draggable = !1;
}
function Rt() {
  ze = !1;
}
function qt(e, n, t) {
  let i = L(we(t.el, 0, t.options, !0));
  const r = pt(t.el, t.options, S), a = 10;
  return n ? e.clientX < r.left - a || e.clientY < i.top && e.clientX < i.right : e.clientY < r.top - a || e.clientY < i.bottom && e.clientX < i.left;
}
function Yt(e, n, t) {
  const i = L(Ke(t.el, t.options.draggable)), r = pt(t.el, t.options, S), a = 10;
  return n ? e.clientX > r.right + a || e.clientY > i.bottom && e.clientX > i.left : e.clientY > r.bottom + a || e.clientX > i.right && e.clientY > i.top;
}
function $t(e, n, t, i, r, a, o, s) {
  let l = i ? e.clientY : e.clientX, u = i ? t.height : t.width, h = i ? t.top : t.left, p = i ? t.bottom : t.right, g = !1;
  if (!o) {
    if (s && Ne < u * r) {
      if (!be && (ve === 1 ? l > h + u * a / 2 : l < p - u * a / 2) && (be = !0), be)
        g = !0;
      else if (ve === 1 ? l < h + Ne : l > p - Ne)
        return -ve;
    } else if (l > h + u * (1 - r) / 2 && l < p - u * (1 - r) / 2)
      return Ft(n);
  }
  return g = g || o, g && (l < h + u * a / 2 || l > p - u * a / 2) ? l > h + u / 2 ? 1 : -1 : 0;
}
function Ft(e) {
  return $(d) < $(e) ? 1 : -1;
}
function Ut(e) {
  let n = e.tagName + e.className + e.src + e.href + e.textContent, t = n.length, i = 0;
  for (; t--; )
    i += n.charCodeAt(t);
  return i.toString(36);
}
function Gt(e) {
  Pe.length = 0;
  let n = e.getElementsByTagName("input"), t = n.length;
  for (; t--; ) {
    let i = n[t];
    i.checked && Pe.push(i);
  }
}
function Ae(e) {
  return setTimeout(e, 0);
}
function je(e) {
  return clearTimeout(e);
}
Ze && C(document, "touchmove", function(e) {
  (v.active || he) && e.cancelable && e.preventDefault();
});
v.utils = {
  on: C,
  off: w,
  css: m,
  find: ft,
  is: function(e, n) {
    return !!U(e, n, e, !1);
  },
  extend: It,
  throttle: Lt,
  closest: U,
  toggleClass: Z,
  clone: ht,
  index: $,
  nextTick: Ae,
  cancelNextTick: je,
  detectDirection: mt,
  getChild: we,
  expando: R
};
v.get = function(e) {
  return e[R];
};
v.mount = function(...e) {
  e[0].constructor === Array && (e = e[0]), e.forEach((n) => {
    if (!n.prototype || !n.prototype.constructor)
      throw `Sortable: Mounted plugin must be a constructor function, not ${{}.toString.call(n)}`;
    n.utils && (v.utils = { ...v.utils, ...n.utils }), Ce.mount(n);
  });
};
v.create = function(e, n) {
  return new v(e, n);
};
v.version = "1.15.6";
class zt {
  constructor() {
    kt({
      name: "whichWayCharacterCardStyleOverride_add",
      fn() {
        Object.defineProperty(c.click, "charactercard", {
          value: c.click.charactercard,
          writable: !0,
          configurable: !0,
          enumerable: !0
        }), Et.appendHook("ui.click.charactercard", {
          before: function(n, t, i, r, a, o) {
            if (De.config("enableWhichWayCharacterCardStyle"))
              return Je.create(n, t, i, r, a, o), !1;
          }
        });
      }
    }), Dt({
      name: "whichWayCharacterCardStyleConfig_add",
      priority: 770,
      obj: {
        name: "enableWhichWayCharacterCardStyle",
        options: {
          name: "启用驶舰之向武将卡样式",
          intro: "开启后启用驶舰之向武将卡样式",
          init: !0
        }
      }
    });
  }
  async create(n, t, i, r, a, o) {
    const s = this.createBackground();
    s.dataset.charName = n, await this.createTopMenu(s, n), await this.createAudioSkinName(s, n), await this.createCharName(s, n), await this.createCharImageWrapper(s, n), await this.createCampLogo(s, n), await this.createDisplayArena(s, n), ce.skill();
  }
  /**
   * 角色卡牌初始化
   */
  async init() {
  }
  /**
   * 获取默认皮肤
   */
  getDefaultSkin(n) {
    return `${me.extDir}image/character/default_${n}.png`;
  }
  getUrl(n, t, i = "png") {
    return !n.endsWith(`.${i}`) && typeof i == "string" && i.length > 0 && (n += `.${i}`), t ? me.compilePath(`ui:${t}/${n}`) : me.compilePath(`ui:${n}`);
  }
  /**
   * 创建势力logo
   * @param { HTMLElement } container
   * @param { string } name
   */
  async createCampLogo(n, t) {
    const i = c.create.div(".camplogo-wrapper", n), r = c.create.div(".img-def", i), a = bt(t), o = O.character(t), s = o?.whichWay?.arknight?.camp, l = wt(o?.group, De.getCharExtConfig(t)?.reallyGroup, s), u = s || l?.logo || l?.reallyGroup, h = l?.filter ?? !!u;
    if (u)
      return h && r.classList.add("arknightCamp"), r.style.backgroundImage = `url(${me.extDir}/image/camplogo/arknight/${u}.png)`, i;
    if (a)
      h && r.classList.add("arknightCamp"), r.style.backgroundImage = `url(${me.extDir}/image/camplogo/noname/name_${a}.png)`;
    else if (I.translate[o?.group]) {
      const p = c.create.div(".group-text", r);
      p.innerHTML = I.translate[o.group];
    }
    return i;
  }
  createBackground() {
    const n = c.create.div(".container-CC-SJZX", document.body);
    return n.style.backgroundImage = "url(" + this.getUrl("default", "background") + ")", n;
  }
  async createTopMenu(n, t) {
    const i = c.create.div(".topMenu-wrapper", n), r = c.create.div(".btn-back", i);
    r.addEventListener("click", () => {
      document.body.removeChild(n), j.refreshSkin(), fe.resume2();
    });
    const a = c.create.div(".imageBox", r), o = new Image();
    return o.src = this.getUrl("back"), a.appendChild(o), await this.createTopMenuButton(
      i,
      "QUIT",
      "简介",
      "resume",
      (s) => {
        ce.quit();
      },
      "quit"
    ), this.createTopMenuButton(
      i,
      "SKILL",
      "技能",
      "skill",
      (s) => {
        ce.skill();
      },
      "skill"
    ), this.createTopMenuButton(
      i,
      "SKIN",
      "皮肤",
      "skin",
      async (s) => {
        await ce.skin();
      },
      "skin"
    ), Ie.getCharModules(t, !1) && this.createTopMenuButton(
      i,
      "MODE",
      "模组",
      "mode",
      async (s) => {
        await ce.mode();
      },
      "mode"
    ), i;
  }
  async createTopMenuButton(n, t, i, r, a, o) {
    const s = c.create.div(".btn-background", n), l = c.create.div(".btn-enSJZX", s);
    l.innerHTML = t;
    const u = c.create.div(".btn-cnSJZX", s);
    u.innerHTML = i;
    const h = c.create.div(".btnImage-wrapper", s), p = new Image();
    return p.classList.add(".btn-image"), p.src = this.getUrl(r), h.appendChild(p), typeof a == "function" && s.addEventListener("click", a), o && (s.dataset.btnName = o), s;
  }
  async createAudioSkinName(n, t) {
    const i = c.create.div(".skinnameAudio-wrapper", n), r = c.create.div(".skinnameWrapper", i), a = c.create.div(".titleWrapper", r), o = c.create.div(".imageWrapper", a), s = new Image();
    s.src = this.getUrl("painter"), o.appendChild(s);
    const l = c.create.div(".textWrapper", a);
    l.innerHTML = j.getCurentSkin(t);
    const u = c.create.div(".designerWrapper", i), h = c.create.div(".titleWrapper", u), p = c.create.div(".imageWrapper", h), g = new Image();
    g.classList.add("imageLimit"), g.src = this.getUrl("designer"), p.appendChild(g);
    const y = c.create.div(".textWrapper", h);
    y.innerHTML = Ct(t).join("、");
    const f = c.create.div(".audioWrapper", i), b = c.create.div(".audioTitleWrapper", f), k = c.create.div(".imageWrapper", b), T = new Image();
    T.src = this.getUrl("cv"), k.appendChild(T);
    const q = c.create.div(".textWrapper", b);
    q.innerHTML = z.getCharacterLang(t, !0);
    const _ = c.create.div(".collapseWrapper", b);
    _.dataset.collapse = "false";
    const E = new Image();
    E.src = this.getUrl("plus"), E.style.height = "50%", _.appendChild(E), _.addEventListener("click", async (P) => {
      if (!window.whichWaySave.hasChar(t)) {
        Tt.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
        return;
      }
      _.dataset.collapse === "false" ? (_.dataset.collapse = "true", E.dataset.originalHeight = f.style.height, f.style.height = `${(1 + z.getCharacterAvailableLang(t).length) * 50}px`, E.src = this.getUrl("sub")) : (_.dataset.collapse = "false", f.style.height = E.dataset.originalHeight, E.src = this.getUrl("plus"));
    });
    const G = c.create.div(".content", f);
    let Q = z.getCharacterLang(t);
    for (let P of z.getCharacterAvailableLang(t)) {
      const Y = c.create.div(".selectWrapper", G);
      if (Y.dataset.choiceSJZX = P, P === Q) {
        c.create.div(".choice", Y);
        const B = c.create.div(".choice-contentTextWrapper", Y), x = c.create.div(".selectTextSJZX", B);
        x.innerHTML = et.getVoiceLangTranslation(P);
      } else {
        c.create.div(".nochoice", Y);
        const B = c.create.div(".nochoice-contentTextWrapper", Y), x = c.create.div(".selectTextSJZX", B);
        x.innerHTML = et.getVoiceLangTranslation(P);
      }
      Y.addEventListener("click", async (B) => {
        let x = B.currentTarget, re = x.dataset.choiceSJZX;
        if (x.dataset.choiceSJZX !== z.getCharacterLang(t)) {
          const Te = document.querySelector(".selectWrapper .choice"), ae = document.querySelector(".selectWrapper .choice-contentTextWrapper");
          De.toggleClass([Te, x.querySelector(".selectWrapper .nochoice")], "choice", "nochoice"), De.toggleClass([ae, x.querySelector(".selectWrapper .nochoice-contentTextWrapper")], "choice-contentTextWrapper", "nochoice-contentTextWrapper"), await z.setCustomAudio(t, re).then(async () => {
            q.innerHTML = z.getCharacterLang(t, !0);
          });
        }
      });
    }
    return i;
  }
  async createCharName(n, t) {
    const i = c.create.div(".charName-wrapper", n), r = c.create.div(".charNameTitleWrapper", i), a = c.create.div(".charNameTitle", r);
    a.innerHTML = I.characterTitle[t] ? I.characterTitle[t] : "";
    const o = c.create.div(".charNameTextWrapper", i), s = c.create.div(".charNameText", o);
    s.innerHTML = O.translation(t);
    const l = c.create.div(".hpWrapper", i);
    let u = O.character(t), { maxHp: h, hp: p, hujia: g } = u;
    if (h + g > 6) {
      const y = c.create.div(".hpNumWrapper", l);
      c.create.div(".actualHpSJZX", y);
      const f = c.create.div(".hpNumText", y);
      if (f.innerHTML = `${p}/${h}`, g > 0) {
        const b = c.create.div(".hpNumWrapper", l);
        c.create.div(".shieldSJZX", b);
        const k = c.create.div(".hpNumText", b);
        k.innerHTML = `${g}`;
      }
    } else {
      for (let y = 0; y < h; y++)
        y + 1 <= p ? c.create.div(".actualHpSJZX", l) : c.create.div(".emptyHpSJZX", l);
      for (let y = 0; y < g; y++)
        c.create.div(".shieldSJZX", l);
    }
    return i;
  }
  async createCharImageWrapper(n, t) {
    const i = c.create.div(".charImageWrapper", n);
    let r = j.getCurrentSkinPath(t);
    const a = c.create.div(".charImage", i);
    return a.style.backgroundImage = r.startsWith("url") ? r : "url(" + r + ")", await V.updateDyc(t, a), await this.createToggleSkin(t), i;
  }
  /**
   * 创建关闭动皮的按钮
   * @param {String} name
   * @param {HTMLElement} [container]
   * @returns {Promise<HTMLElement>}
   */
  async createToggleSkin(n, t = document.querySelector(".charImageWrapper")) {
    const i = j.getCurentSkin(n), r = t.querySelector(".charSkinBottomUIWrapper");
    if (!V.getSkinData(n, i))
      return r && (r.style.display = "none", s()), r;
    if (r)
      return r.style.display = "", s(), r;
    const a = c.create.div(".charSkinBottomUIWrapper", t), o = c.create.div(".buttonWrapper", a);
    return c.create.div(".buttonText", o), o.addEventListener("click", async (l) => {
      await ce.toggleSkin(l);
    }), s(), a;
    function s() {
      let l = document.querySelector(".charSkinBottomUIWrapper .buttonWrapper"), u = document.querySelector(".charSkinBottomUIWrapper .buttonText");
      !l || !u || (V.isEnabledSkin(n, i) ? l.classList.add("buttonWrapper-enableSkinBG") : l.classList.remove("buttonWrapper-enableSkinBG"), u.innerHTML = V.isEnabledSkin(n, i) ? "关闭动皮" : "开启动皮");
    }
  }
  async createDisplayArena(n, t) {
    const i = c.create.div(".displayArenaSJZX", n);
    return new v(i, {
      draggable: ".skillWrapper",
      animation: 150,
      handle: ".dragHandle"
    }), i;
  }
  async updateSkinImage(n, t, i) {
    const r = document.querySelector(".charImageWrapper .charImage"), a = document.querySelector(".skinnameWrapper .titleWrapper .textWrapper");
    r && (r.style.backgroundImage = "url(" + t + ")", await V.updateDyc(i, r)), a && (a.innerHTML = n), await this.createToggleSkin(i);
  }
}
const Je = new zt();
_t({
  name: "whichwayCharacterCard_dev",
  fn: () => {
    window.whichWayCharacterCard = Je;
  }
});
window.whichWay.register("characterCard", Je);
export {
  Je as whichWayCharacterCard
};
