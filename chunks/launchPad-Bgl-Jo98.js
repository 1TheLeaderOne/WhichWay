import { lib as f, get as Pt, game as St } from "noname";
import { defineComponent as Wt, ref as u, computed as $t, reactive as ht, onMounted as Mt, nextTick as b, onBeforeUnmount as Tt, openBlock as x, createElementBlock as k, createElementVNode as a, normalizeStyle as pt, toDisplayString as P, Fragment as vt, renderList as yt, normalizeClass as gt, createApp as It } from "vue";
import { _ as Rt } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { onConfig as Nt } from "./hooks-BscfO9lD.js";
import { whichWayToast as Ot } from "./toast-BKImUKDM.js";
const Dt = { class: "mcb-root" }, zt = { class: "mcb-container-box" }, Yt = { class: "mcb-current" }, Bt = { class: "mcb-current-info" }, Ht = { class: "mcb-info-wrapper" }, Ut = { class: "mcb-detail" }, Ft = { class: "mcb-nav-wrapper" }, Kt = ["onClick"], Vt = { class: "mcb-list-wrapper" }, jt = ["onClick"], Gt = { class: "mcb-list-item-name" }, bt = 20, Xt = /* @__PURE__ */ Wt({
  __name: "ModeCarousel",
  props: {
    items: {},
    bg: {}
  },
  emits: ["pick"],
  setup(n, { emit: e }) {
    const o = n, h = e, m = u(0), p = u(!1), W = u(""), $ = u(""), M = u(""), q = u(""), T = u(!1), Z = u(null), I = u(null), R = u(null), J = u(null), N = u(null), Q = u(null), tt = u(null), et = u(null), At = $t(() => o.items[m.value] || null), O = (t) => t ? `url("${t}")` : "none", nt = (t) => new Promise((s) => setTimeout(s, t));
    async function D(t, s, i) {
      if (!t) return;
      const c = s * 50;
      t.style.setProperty("--mcb-dx", c + "px"), t.classList.add("mcb-t-out"), await nt(230), t.classList.remove("mcb-t-out"), i(), await b(), t.classList.add("mcb-t-in"), await b(), t.classList.remove("mcb-t-in");
    }
    async function st(t, s) {
      const i = Z.value;
      if (!i) return;
      for (; i.children.length < 2; ) {
        const v = document.createElement("div");
        v.className = "mcb-stage-img mcb-stage-hidden", i.appendChild(v);
      }
      const c = i.children[0], r = i.children[1], d = t === 1 ? "right bottom" : "left top", l = t === 1 ? "left top" : "right bottom";
      for (r.classList.remove("mcb-stage-hidden"), r.style.backgroundImage = O(s), c.style.transformOrigin = d, r.style.transformOrigin = l, c.style.transition = "none", r.style.transition = "none", c.style.transform = "scale(1)", r.style.transform = "scale(0)", c.style.opacity = "1", r.style.opacity = "1", await b(), c.style.transition = "transform .6s cubic-bezier(.6,.05,.3,1)", r.style.transition = "transform .6s cubic-bezier(.6,.05,.3,1)", c.style.transform = "scale(0)", r.style.transform = "scale(1)", await nt(620), c.remove(), r.classList.remove("mcb-stage-img-active"), q.value = s, r.style.transform = "none", r.style.transition = "none"; i.children.length < 2; ) {
        const v = document.createElement("div");
        v.className = "mcb-stage-img mcb-stage-hidden", i.appendChild(v);
      }
    }
    async function z(t, s) {
      if (p.value || T.value) return;
      const i = o.items.length;
      if (!i) return;
      const c = (t + i) % i, r = o.items[c];
      p.value = !0, await Promise.all([D(Q.value, s, () => W.value = r.serial), D(tt.value, s, () => $.value = r.title), D(et.value, s, () => M.value = r.desc), st(s, r.art)]), m.value = c, p.value = !1, await b(), ot();
    }
    function ot() {
      const t = J.value;
      if (!t) return;
      const s = t.children;
      if (!s.length) return;
      const i = s[0].offsetWidth || 200, c = m.value, r = s.length;
      for (let d = 0; d < r; d++) {
        const l = s[d], v = d - c;
        let U = v * i, F = "1", K = "auto";
        v <= -3 ? (U = -i, F = "0", K = "none") : v >= 3 && (U = i * 3, F = "0", K = "none"), l.style.transform = `translateX(${U}px)`, l.style.opacity = F, l.style.pointerEvents = K;
      }
    }
    function Y() {
      z(m.value - 1, -1);
    }
    function B() {
      z(m.value + 1, 1);
    }
    function at(t) {
      z(t, t > m.value ? 1 : -1);
    }
    function H() {
      const t = At.value;
      !t || T.value || (T.value = !0, document.querySelector(".mcb-root")?.classList.add("mcb-leave"), h("pick", t.mode));
    }
    function it(t) {
      t.key === "ArrowLeft" ? Y() : t.key === "ArrowRight" ? B() : t.key === "Enter" && H();
    }
    const A = ht({ x: 0.5, y: 0.5 }), g = ht({ x: 0.5, y: 0.5 }), rt = (t) => t * bt - bt / 2;
    function ct(t) {
      A.x = t.clientX / window.innerWidth, A.y = t.clientY / window.innerHeight;
    }
    let lt = 0;
    function ut() {
      g.x += (A.x - g.x) / 10, g.y += (A.y - g.y) / 10;
      const t = rt(g.x), s = rt(g.y);
      I.value && (I.value.style.transform = `translate3d(${t}px, ${s}px, 0) rotateX(${-s}deg) rotateY(${t}deg)`), R.value && (R.value.style.transform = `translate3d(${t * 7.7}px, ${s * 3}px, 50px) rotateX(${-s}deg) rotateY(${t}deg)`), lt = requestAnimationFrame(ut);
    }
    let mt = [], dt = 0, C = null;
    function Ct() {
      const t = N.value;
      if (!t || (C = t.getContext("2d"), !C)) return;
      const s = Math.min(window.devicePixelRatio || 1, 2), i = () => {
        t.width = t.clientWidth * s, t.height = t.clientHeight * s, C.setTransform(s, 0, 0, s, 0, 0);
      };
      i(), window.addEventListener("resize", i), mt = Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.3,
        vx: -0.01 + Math.random() * 0.02,
        vy: -5e-3 + Math.random() * 0.01,
        a: 0.1 + Math.random() * 0.32
      }));
      const c = () => {
        const r = C, d = N.value;
        if (r && d) {
          r.clearRect(0, 0, d.clientWidth, d.clientHeight);
          for (const l of mt)
            l.x += l.vx, l.y += l.vy, l.x < -0.02 && (l.x = 1.02), l.x > 1.02 && (l.x = -0.02), l.y < -0.02 && (l.y = 1.02), l.y > 1.02 && (l.y = -0.02), r.beginPath(), r.arc(l.x * d.clientWidth, l.y * d.clientHeight, l.r, 0, Math.PI * 2), r.fillStyle = `rgba(232,196,140,${l.a})`, r.fill();
        }
        dt = requestAnimationFrame(c);
      };
      c();
    }
    function ft(t) {
      t.deltaY > 0 ? B() : t.deltaY < 0 && Y();
    }
    return Mt(async () => {
      if (!o.items.length) return;
      const t = o.items[0];
      W.value = t.serial, $.value = t.title, M.value = t.desc, q.value = t.art, await b(), st(1, t.art), await b(), ot(), window.addEventListener("mousemove", ct), window.addEventListener("keydown", it), document.addEventListener("wheel", ft, { passive: !0 }), ut(), Ct();
    }), Tt(() => {
      cancelAnimationFrame(lt), cancelAnimationFrame(dt), window.removeEventListener("mousemove", ct), window.removeEventListener("keydown", it), document.removeEventListener("wheel", ft);
    }), (t, s) => (x(), k("div", Dt, [
      a("canvas", {
        ref_key: "canvasEl",
        ref: N,
        class: "mcb-particles"
      }, null, 512),
      a("div", {
        class: "mcb-bg",
        style: pt({ backgroundImage: n.bg ? O(n.bg) : "none" })
      }, null, 4),
      s[2] || (s[2] = a("div", { class: "mcb-logo" }, [
        a("div", { class: "mcb-logo-main" }, "明日方舟"),
        a("div", { class: "mcb-logo-sub" }, "DIRECT LINK"),
        a("div", { class: "mcb-logo-sub2" }, "A.L.L.")
      ], -1)),
      a("div", {
        class: "mcb-arrow mcb-arrow-prev",
        onClick: Y
      }, [...s[0] || (s[0] = [
        a("svg", { viewBox: "0 0 60 60" }, [
          a("path", {
            d: "M38 12 L22 30 L38 48",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])]),
      a("div", zt, [
        a("div", {
          ref_key: "mediaViewEl",
          ref: I,
          class: "mcb-media-view"
        }, [
          a("div", Yt, [
            a("div", {
              ref_key: "stageEl",
              ref: Z,
              class: "mcb-stage-pic",
              onClick: H
            }, null, 512),
            a("div", {
              ref_key: "frontEl",
              ref: R,
              class: "mcb-user-interactive"
            }, [
              a("div", Bt, [
                a("div", Ht, [
                  a("div", {
                    ref_key: "serialEl",
                    ref: Q,
                    class: "mcb-serial"
                  }, P(W.value), 513),
                  a("h1", {
                    ref_key: "titleEl",
                    ref: tt,
                    class: "mcb-title",
                    onClick: H
                  }, P($.value), 513),
                  a("div", Ut, [
                    a("p", {
                      ref_key: "descEl",
                      ref: et,
                      class: "mcb-desc"
                    }, P(M.value), 513)
                  ])
                ]),
                a("div", Ft, [
                  (x(!0), k(vt, null, yt(n.items, (i, c) => (x(), k("span", {
                    key: "nav-" + i.mode,
                    class: gt(["mcb-ind", { on: c === m.value }]),
                    onClick: (r) => at(c)
                  }, null, 10, Kt))), 128))
                ])
              ])
            ], 512)
          ]),
          a("div", Vt, [
            a("div", {
              ref_key: "thumbRow",
              ref: J,
              class: "mcb-list"
            }, [
              (x(!0), k(vt, null, yt(n.items, (i, c) => (x(), k("div", {
                key: "th-" + i.mode,
                class: gt(["mcb-list-item", { on: c === m.value }]),
                onClick: (r) => at(c)
              }, [
                a("div", {
                  class: "mcb-list-item-img",
                  style: pt({ backgroundImage: O(i.thumb || i.art) })
                }, [
                  a("span", Gt, P(i.title), 1)
                ], 4)
              ], 10, jt))), 128))
            ], 512)
          ])
        ], 512)
      ]),
      a("div", {
        class: "mcb-arrow mcb-arrow-next",
        onClick: B
      }, [...s[1] || (s[1] = [
        a("svg", { viewBox: "0 0 60 60" }, [
          a("path", {
            d: "M22 12 L38 30 L22 48",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])])
    ]));
  }
}), qt = /* @__PURE__ */ Rt(Xt, [["__scopeId", "data-v-6e118780"]]), Zt = "ext:WhichWay/image/splash/carousel/", V = 18, Jt = {
  identity: "身份局：主公与忠臣讨伐内奸与反贼的经典对局",
  guozhan: "国战：群雄逐鹿，问鼎中原",
  boss: "身份 3v3：三人小队携手挑战高难 BOSS",
  brawl: "乱斗模式：规则与武将池大幅改动的娱乐对局",
  versus: "1v1 对决：单挑见真章",
  doudizhu: "斗地主：农民与地主的三方博弈",
  tafang: "塔防模式：以将筑塔，抵御进犯",
  stone: "炉石模式：趣味性对抗玩法",
  chess: "战旗模式：战场如棋局",
  connect: "联机对战：与好友线上切磋",
  single: "单人挑战：自己与 AI 的对局",
  guandu: "官渡之战：历史战役还原"
}, Qt = {};
function xt(n) {
  if (!n) return "";
  try {
    return f.init.parseResourceAddress(n)?.href || "";
  } catch {
    return "";
  }
}
function j(n) {
  const e = (n % V + V) % V + 1;
  return xt(`${Zt}carousel_${e}.png`);
}
function kt(n) {
  return Array.isArray(f.config.all.stockmode) && f.config.all.stockmode.includes(n);
}
function te(n, e) {
  const o = Qt[n];
  return typeof o == "number" ? j(o - 1) : kt(n) ? j(e) : xt(f.mode[n]?.splash) || j(e);
}
function ee() {
  return (Array.isArray(f.config.all.mode) ? f.config.all.mode : []).map((e, o) => {
    let h = "";
    try {
      h = Pt.translation(e) || e;
    } catch {
      h = e;
    }
    const m = kt(e), p = te(e, o);
    return {
      mode: e,
      serial: String(o + 1).padStart(2, "0"),
      title: h,
      desc: Jt[e] || (m ? "选择此模式开始游戏" : "WhichWay 提供的自定义玩法"),
      art: p,
      thumb: p
    };
  }).filter((e) => e.art || e.thumb);
}
const y = "whichway-carousel", E = "驶舰之向", _ = "extension_WhichWay_launchPad", wt = "WhichWay_launchpad_prevStyle", ne = "extension_WhichWay_launchpad_autoset", Et = "style1";
function L(n) {
  try {
    return f.config[n];
  } catch {
    return;
  }
}
function w(n, e) {
  try {
    St.saveConfig(n, e);
  } catch (o) {
    console.warn(`[launchPad] 写入配置 ${n} 失败`, o);
  }
}
function X() {
  return L(_) === !0;
}
function S() {
  const n = L("splash_style");
  return typeof n == "string" && n ? n : "";
}
function se() {
  return S() === y;
}
function Lt(n) {
  const e = S();
  if (n)
    e && e !== y && w(wt, e), w("splash_style", y);
  else if (e === y) {
    const o = L(wt);
    w("splash_style", typeof o == "string" && o && o !== y ? o : Et);
  }
  w(_, !!n);
}
function oe() {
  if (typeof L(_) == "boolean") {
    X() && S() && !se() && w(_, !1);
    return;
  }
  const e = S();
  L(ne) === !0 || !e || e === Et || e === y ? Lt(!0) : w(_, !1);
}
const G = "launchPad";
let _t = !1;
function ae() {
  return _t ? !1 : (oe(), Nt({
    name: G,
    priority: 798,
    obj: {
      name: G,
      options: {
        name: `${E}启动页`,
        intro: "开启后,游戏启动页默认切换为「驶舰之向」视差轮播（下次启动游戏时生效;也可在 选项→外观→启动页 中手动切换）",
        init: X(),
        onclick(n) {
          Lt(n), Ot.showToast(
            n ? `[${E}] 已开启驶舰之向启动页,下次启动游戏时生效` : `[${E}] 已关闭驶舰之向启动页,已还原为之前的启动页样式`,
            3e3,
            "topLeft",
            "configTips_launchPad"
          );
        }
      }
    }
  }), _t = !0, console.info(`[launchPad] 设置项已注册：${G}（${_}）`), !0);
}
let ie = !1;
class re {
  id = y;
  name = E;
  app = null;
  /** 启动页渲染：把 node 变为全屏轮播，用户点选模式后 resolve(mode) */
  async init(e, o) {
    const h = ee();
    if (!h.length) {
      o(f.config.mode), e.remove();
      return;
    }
    e.id = "mcb-host", e.style.cssText = "position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;background:#0c0e13!important;z-index:2147483000!important;", e.classList.add("mcb-host-root");
    let m = "";
    try {
      m = f.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/bg.jpg").href || "";
    } catch {
      m = "";
    }
    this.app = It(qt, {
      items: h,
      bg: m,
      onPick: (p) => {
        this.dispose(e), o(p);
      }
    }), this.app.mount(e);
  }
  /** 点击进入后的清理：卸载组件、移除节点（自行管理，返回 true 告知引擎） */
  async dispose(e) {
    try {
      this.app && (this.app.unmount(), this.app = null);
    } catch {
    }
    try {
      e.remove();
    } catch {
    }
    return !0;
  }
  /** 外观设置里的样式小预览 */
  async preview(e) {
    e.className = "button character", e.style.width = "200px", e.style.height = `${e.offsetWidth * 9 / 16}px`, e.style.display = "flex", e.style.flexDirection = "column", e.style.alignItems = "center", e.style.backgroundSize = "100% 100%";
    try {
      const o = f.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/whichway_preview.png");
      e.setBackgroundImage(o.href);
    } catch (o) {
      console.warn("[launchPad] 预览图加载失败", o);
    }
  }
}
function fe() {
  try {
    const n = f.onloadSplashes;
    if (!Array.isArray(n)) return !1;
    const e = n.some((o) => o.id === y);
    return e || n.push(new re()), ie = !0, ae(), console.info(
      `[launchPad] 启动页样式已注册：${E}（${y}），设置项状态：${X() ? "开启" : "关闭"}（可在 选项→扩展→WhichWay 或 选项→外观→启动页 调整）`
    ), !e;
  } catch (n) {
    return console.error("[launchPad] 启动页样式注册失败（不影响扩展本体）", n), !1;
  }
}
export {
  y as LAUNCH_PAD_ID,
  E as LAUNCH_PAD_NAME,
  Lt as applyLaunchPadStyle,
  oe as ensureLaunchPadDefault,
  se as isLaunchPadActive,
  X as isLaunchPadEnabled,
  fe as registerLaunchPadSplash
};
