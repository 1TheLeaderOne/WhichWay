import { lib as h, get as Tt, game as Rt } from "noname";
import { defineComponent as Nt, ref as f, computed as Ot, reactive as wt, onMounted as Dt, nextTick as _, onBeforeUnmount as zt, openBlock as L, createElementBlock as A, createElementVNode as c, normalizeStyle as xt, toDisplayString as $, Fragment as _t, renderList as kt, normalizeClass as Et, createApp as Yt } from "vue";
import { _ as Ft } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { onConfig as Bt } from "./hooks-BscfO9lD.js";
import { whichWayToast as Ht } from "./toast-BKImUKDM.js";
const Ut = { class: "mcb-root" }, qt = { class: "mcb-container-box" }, Kt = { class: "mcb-current" }, Vt = { class: "mcb-current-info" }, jt = { class: "mcb-info-wrapper" }, Gt = { class: "mcb-detail" }, Xt = { class: "mcb-nav-wrapper" }, Zt = ["onClick"], Jt = { class: "mcb-list-wrapper" }, Qt = ["onClick"], te = { class: "mcb-list-item-name" }, Lt = 20, ee = /* @__PURE__ */ Nt({
  __name: "ModeCarousel",
  props: {
    items: {},
    bg: {},
    initialMode: {}
  },
  emits: ["pick"],
  setup(s, { emit: e }) {
    const a = s, y = e, m = f(0), v = f(!1), I = f(""), T = f(""), R = f(""), Q = f(""), N = f(!1), tt = f(null), O = f(null), D = f(null), et = f(null), z = f(null), nt = f(null), st = f(null), at = f(null), Mt = Ot(() => a.items[m.value] || null), Y = (t) => t ? `url("${t}")` : "none", it = (t) => new Promise((n) => setTimeout(n, t));
    async function F(t, n, i) {
      if (!t) return;
      const o = n * 50;
      t.style.setProperty("--mcb-dx", o + "px"), t.classList.add("mcb-t-out"), await it(180), t.classList.remove("mcb-t-out"), i(), await _(), t.classList.add("mcb-t-in"), await _(), t.classList.remove("mcb-t-in");
    }
    async function ot(t, n) {
      const i = tt.value;
      if (!i) return;
      for (; i.children.length < 2; ) {
        const d = document.createElement("div");
        d.className = "mcb-stage-img mcb-stage-hidden", i.appendChild(d);
      }
      const o = i.children[0], r = i.children[1], u = t === 1 ? "right bottom" : "left top", x = t === 1 ? "left top" : "right bottom";
      for (r.classList.remove("mcb-stage-hidden"), r.style.backgroundImage = Y(n), o.style.transformOrigin = u, r.style.transformOrigin = x, o.style.transition = "none", r.style.transition = "none", o.style.transform = "scale(1)", r.style.transform = "scale(0)", o.style.opacity = "1", r.style.opacity = "1", await _(), o.style.transition = "transform .42s cubic-bezier(.6,.05,.3,1)", r.style.transition = "transform .42s cubic-bezier(.6,.05,.3,1)", o.style.transform = "scale(0)", r.style.transform = "scale(1)", await it(420), o.remove(), r.classList.remove("mcb-stage-img-active"), Q.value = n, r.style.transform = "none", r.style.transition = "none"; i.children.length < 2; ) {
        const d = document.createElement("div");
        d.className = "mcb-stage-img mcb-stage-hidden", i.appendChild(d);
      }
    }
    const rt = /* @__PURE__ */ new Set();
    function ct(t) {
      if (!t || rt.has(t)) return;
      rt.add(t);
      const n = new Image();
      n.decoding = "async", n.src = t, n.decode?.().catch(() => {
      });
    }
    function lt(t) {
      const n = a.items.length;
      if (!n) return;
      const i = (u) => a.items[(u % n + n) % n].art;
      [t, t + 1, t - 1].forEach((u) => ct(i(u)));
      const o = () => a.items.forEach((u) => ct(u.art)), r = window.requestIdleCallback;
      typeof r == "function" ? r(o, { timeout: 2e3 }) : setTimeout(o, 600);
    }
    async function B(t, n) {
      if (v.value || N.value) return;
      const i = a.items.length;
      if (!i) return;
      const o = (t + i) % i, r = a.items[o];
      v.value = !0, m.value = o, await _(), ut(), lt(o), await Promise.all([F(nt.value, n, () => I.value = r.serial), F(st.value, n, () => T.value = r.title), F(at.value, n, () => R.value = r.desc), ot(n, r.art)]), v.value = !1;
    }
    function ut() {
      const t = et.value;
      if (!t) return;
      const n = t.children;
      if (!n.length) return;
      const i = n[0].offsetWidth || 200, o = m.value, r = n.length;
      for (let u = 0; u < r; u++) {
        const x = n[u], d = u - o;
        let g = d * i, l = "1", j = "auto";
        d <= -3 ? (g = -i, l = "0", j = "none") : d >= 3 && (g = i * 3, l = "0", j = "none"), x.style.transform = `translateX(${g}px)`, x.style.opacity = l, x.style.pointerEvents = j;
      }
    }
    function H() {
      B(m.value - 1, -1);
    }
    function U() {
      B(m.value + 1, 1);
    }
    function dt(t) {
      B(t, t > m.value ? 1 : -1);
    }
    function q() {
      const t = Mt.value;
      !t || N.value || (N.value = !0, document.querySelector(".mcb-root")?.classList.add("mcb-leave"), y("pick", t.mode));
    }
    function mt(t) {
      t.key === "ArrowLeft" ? H() : t.key === "ArrowRight" ? U() : t.key === "Enter" && q();
    }
    const w = wt({ x: 0.5, y: 0.5 }), p = wt({ x: 0.5, y: 0.5 }), ft = (t) => t * Lt - Lt / 2;
    function ht(t) {
      w.x = t.clientX / window.innerWidth, w.y = t.clientY / window.innerHeight, vt();
    }
    let S = 0, K = !1;
    function yt() {
      const t = ft(p.x), n = ft(p.y);
      O.value && (O.value.style.transform = `translate3d(${t}px, ${n}px, 0) rotateX(${-n}deg) rotateY(${t}deg)`), D.value && (D.value.style.transform = `translate3d(${t * 7.7}px, ${n * 3}px, 50px) rotateX(${-n}deg) rotateY(${t}deg)`);
    }
    function pt() {
      if (p.x += (w.x - p.x) / 10, p.y += (w.y - p.y) / 10, Math.abs(w.x - p.x) < 5e-4 && Math.abs(w.y - p.y) < 5e-4) {
        p.x = w.x, p.y = w.y, yt(), S = 0, K = !1;
        return;
      }
      yt(), S = requestAnimationFrame(pt);
    }
    function vt() {
      K || (K = !0, S = requestAnimationFrame(pt));
    }
    let gt = [], V = 0, W = null;
    function It() {
      const t = z.value;
      if (!t || (W = t.getContext("2d"), !W)) return;
      const n = Math.min(window.devicePixelRatio || 1, 2), i = () => {
        t.width = t.clientWidth * n, t.height = t.clientHeight * n, W.setTransform(n, 0, 0, n, 0, 0);
      };
      i(), window.addEventListener("resize", i), gt = Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.3,
        vx: -0.01 + Math.random() * 0.02,
        vy: -5e-3 + Math.random() * 0.01,
        a: 0.1 + Math.random() * 0.32
      }));
      const o = 1e3 / 30;
      let r = 0;
      const u = (x = 0) => {
        if (x - r < o) {
          V = requestAnimationFrame(u);
          return;
        }
        r = x;
        const d = W, g = z.value;
        if (d && g) {
          d.clearRect(0, 0, g.clientWidth, g.clientHeight);
          for (const l of gt)
            l.x += l.vx, l.y += l.vy, l.x < -0.02 && (l.x = 1.02), l.x > 1.02 && (l.x = -0.02), l.y < -0.02 && (l.y = 1.02), l.y > 1.02 && (l.y = -0.02), d.beginPath(), d.arc(l.x * g.clientWidth, l.y * g.clientHeight, l.r, 0, Math.PI * 2), d.fillStyle = `rgba(232,196,140,${l.a})`, d.fill();
        }
        V = requestAnimationFrame(u);
      };
      u();
    }
    function bt(t) {
      t.deltaY > 0 ? U() : t.deltaY < 0 && H();
    }
    return Dt(async () => {
      if (!a.items.length) return;
      const t = a.items.findIndex((r) => r.mode === a.initialMode), n = a.items.findIndex((r) => r.mode === "identity"), i = t >= 0 ? t : n >= 0 ? n : 0;
      m.value = i;
      const o = a.items[i];
      I.value = o.serial, T.value = o.title, R.value = o.desc, Q.value = o.art, await _(), ot(1, o.art), await _(), ut(), lt(i), window.addEventListener("mousemove", ht), window.addEventListener("keydown", mt), document.addEventListener("wheel", bt, { passive: !0 }), vt(), It();
    }), zt(() => {
      cancelAnimationFrame(S), cancelAnimationFrame(V), window.removeEventListener("mousemove", ht), window.removeEventListener("keydown", mt), document.removeEventListener("wheel", bt);
    }), (t, n) => (L(), A("div", Ut, [
      c("canvas", {
        ref_key: "canvasEl",
        ref: z,
        class: "mcb-particles"
      }, null, 512),
      c("div", {
        class: "mcb-bg",
        style: xt({ backgroundImage: s.bg ? Y(s.bg) : "none" })
      }, null, 4),
      n[2] || (n[2] = c("div", { class: "mcb-logo" }, [
        c("div", { class: "mcb-logo-main" }, "明日方舟"),
        c("div", { class: "mcb-logo-sub" }, "DIRECT LINK"),
        c("div", { class: "mcb-logo-sub2" }, "A.L.L.")
      ], -1)),
      c("div", {
        class: "mcb-arrow mcb-arrow-prev",
        onClick: H
      }, [...n[0] || (n[0] = [
        c("svg", { viewBox: "0 0 60 60" }, [
          c("path", {
            d: "M38 12 L22 30 L38 48",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          })
        ], -1)
      ])]),
      c("div", qt, [
        c("div", {
          ref_key: "mediaViewEl",
          ref: O,
          class: "mcb-media-view"
        }, [
          c("div", Kt, [
            c("div", {
              ref_key: "stageEl",
              ref: tt,
              class: "mcb-stage-pic",
              onClick: q
            }, null, 512),
            c("div", {
              ref_key: "frontEl",
              ref: D,
              class: "mcb-user-interactive"
            }, [
              c("div", Vt, [
                c("div", jt, [
                  c("div", {
                    ref_key: "serialEl",
                    ref: nt,
                    class: "mcb-serial"
                  }, $(I.value), 513),
                  c("h1", {
                    ref_key: "titleEl",
                    ref: st,
                    class: "mcb-title",
                    onClick: q
                  }, $(T.value), 513),
                  c("div", Gt, [
                    c("p", {
                      ref_key: "descEl",
                      ref: at,
                      class: "mcb-desc"
                    }, $(R.value), 513)
                  ])
                ]),
                c("div", Xt, [
                  (L(!0), A(_t, null, kt(s.items, (i, o) => (L(), A("span", {
                    key: "nav-" + i.mode,
                    class: Et(["mcb-ind", { on: o === m.value }]),
                    onClick: (r) => dt(o)
                  }, null, 10, Zt))), 128))
                ])
              ])
            ], 512)
          ]),
          c("div", Jt, [
            c("div", {
              ref_key: "thumbRow",
              ref: et,
              class: "mcb-list"
            }, [
              (L(!0), A(_t, null, kt(s.items, (i, o) => (L(), A("div", {
                key: "th-" + i.mode,
                class: Et(["mcb-list-item", { on: o === m.value }]),
                onClick: (r) => dt(o)
              }, [
                c("div", {
                  class: "mcb-list-item-img",
                  style: xt({ backgroundImage: Y(i.thumb || i.art) })
                }, [
                  c("span", te, $(i.title), 1)
                ], 4)
              ], 10, Qt))), 128))
            ], 512)
          ])
        ], 512)
      ]),
      c("div", {
        class: "mcb-arrow mcb-arrow-next",
        onClick: U
      }, [...n[1] || (n[1] = [
        c("svg", { viewBox: "0 0 60 60" }, [
          c("path", {
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
}), ne = /* @__PURE__ */ Ft(ee, [["__scopeId", "data-v-8a0e90fa"]]), se = "ext:WhichWay/image/splash/carousel/", G = 18, ae = {
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
}, ie = {};
function Pt(s) {
  if (!s) return "";
  try {
    return h.init.parseResourceAddress(s)?.href || "";
  } catch {
    return "";
  }
}
function X(s) {
  const e = (s % G + G) % G + 1;
  return Pt(`${se}carousel_${e}.png`);
}
function St(s) {
  return Array.isArray(h.config.all.stockmode) && h.config.all.stockmode.includes(s);
}
function oe(s, e) {
  const a = ie[s];
  return typeof a == "number" ? X(a - 1) : St(s) ? X(e) : Pt(h.mode[s]?.splash) || X(e);
}
function re() {
  return (Array.isArray(h.config.all.mode) ? h.config.all.mode : []).map((e, a) => {
    let y = "";
    try {
      y = Tt.translation(e) || e;
    } catch {
      y = e;
    }
    const m = St(e), v = oe(e, a);
    return {
      mode: e,
      serial: String(a + 1).padStart(2, "0"),
      title: y,
      desc: ae[e] || (m ? "选择此模式开始游戏" : "WhichWay 提供的自定义玩法"),
      art: v,
      thumb: v
    };
  }).filter((e) => e.art || e.thumb);
}
const b = "whichway-carousel", C = "驶舰之向", E = "extension_WhichWay_launchPad", At = "WhichWay_launchpad_prevStyle", ce = "extension_WhichWay_launchpad_autoset", Wt = "style1";
function P(s) {
  try {
    return h.config[s];
  } catch {
    return;
  }
}
function k(s, e) {
  try {
    Rt.saveConfig(s, e);
  } catch (a) {
    console.warn(`[launchPad] 写入配置 ${s} 失败`, a);
  }
}
function J() {
  return P(E) === !0;
}
function M() {
  const s = P("splash_style");
  return typeof s == "string" && s ? s : "";
}
function le() {
  return M() === b;
}
function $t(s) {
  const e = M();
  if (s)
    e && e !== b && k(At, e), k("splash_style", b);
  else if (e === b) {
    const a = P(At);
    k("splash_style", typeof a == "string" && a && a !== b ? a : Wt);
  }
  k(E, !!s);
}
function ue() {
  if (typeof P(E) == "boolean") {
    J() && M() && !le() && k(E, !1);
    return;
  }
  const e = M();
  P(ce) === !0 || !e || e === Wt || e === b ? $t(!0) : k(E, !1);
}
const Z = "launchPad";
let Ct = !1;
function de() {
  return Ct ? !1 : (ue(), Bt({
    name: Z,
    priority: 798,
    obj: {
      name: Z,
      options: {
        name: `${C}启动页`,
        intro: "开启后,游戏启动页默认切换为「驶舰之向」视差轮播（下次启动游戏时生效;也可在 选项→外观→启动页 中手动切换）",
        init: J(),
        onclick(s) {
          $t(s), Ht.showToast(
            s ? `[${C}] 已开启驶舰之向启动页,下次启动游戏时生效` : `[${C}] 已关闭驶舰之向启动页,已还原为之前的启动页样式`,
            3e3,
            "topLeft",
            "configTips_launchPad"
          );
        }
      }
    }
  }), Ct = !0, console.info(`[launchPad] 设置项已注册：${Z}（${E}）`), !0);
}
let me = !1;
class fe {
  id = b;
  name = C;
  app = null;
  /** 启动页渲染：把 node 变为全屏轮播，用户点选模式后 resolve(mode) */
  async init(e, a) {
    const y = re();
    if (!y.length) {
      a(h.config.mode), e.remove();
      return;
    }
    e.id = "mcb-host", e.style.cssText = "position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;background:#0c0e13!important;z-index:2147483000!important;", e.classList.add("mcb-host-root");
    let m = "";
    try {
      m = h.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/bg.jpg").href || "";
    } catch {
      m = "";
    }
    this.app = Yt(ne, {
      items: y,
      bg: m,
      //默认停在上一次启动的模式：引擎在 splash 返回后就会 game.saveConfig("mode", result)
      //（见 noname/init/index.ts），所以 lib.config.mode 就是「上一次启动的模式」；
      //没有记录、或该模式已不在列表里时，由组件回落到身份模式。
      initialMode: typeof h.config.mode == "string" ? h.config.mode : "",
      onPick: (v) => {
        this.dispose(e), a(v);
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
      const a = h.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/whichway_preview.png");
      e.setBackgroundImage(a.href);
    } catch (a) {
      console.warn("[launchPad] 预览图加载失败", a);
    }
  }
}
function be() {
  try {
    const s = h.onloadSplashes;
    if (!Array.isArray(s)) return !1;
    const e = s.some((a) => a.id === b);
    return e || s.push(new fe()), me = !0, de(), console.info(
      `[launchPad] 启动页样式已注册：${C}（${b}），设置项状态：${J() ? "开启" : "关闭"}（可在 选项→扩展→WhichWay 或 选项→外观→启动页 调整）`
    ), !e;
  } catch (s) {
    return console.error("[launchPad] 启动页样式注册失败（不影响扩展本体）", s), !1;
  }
}
export {
  b as LAUNCH_PAD_ID,
  C as LAUNCH_PAD_NAME,
  $t as applyLaunchPadStyle,
  ue as ensureLaunchPadDefault,
  le as isLaunchPadActive,
  J as isLaunchPadEnabled,
  be as registerLaunchPadSplash
};
