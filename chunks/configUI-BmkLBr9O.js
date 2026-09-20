import { ui as S, lib as V, game as O } from "noname";
import { ref as p, computed as j, onMounted as D, nextTick as z, onUnmounted as F, watch as ne, openBlock as i, createElementBlock as a, createElementVNode as e, toDisplayString as b, Fragment as T, renderList as P, reactive as se, createCommentVNode as I, withDirectives as G, vModelText as Y, createTextVNode as U, normalizeClass as W, vShow as oe, unref as J, createBlock as ie, resolveDynamicComponent as ae, createApp as re } from "vue";
import { onArenaReady as le, onContent as ce, onSetDev as de } from "./hooks-BscfO9lD.js";
import { w as K } from "./version-shared-C3acQ_GF.js";
import { w as N, s as ue } from "./updateLog-shared-eMt4sRyN.js";
import { whichWayCharacterCard as pe } from "./characterCard-BLQBYyJf.js";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { w as X, E as ge } from "./config-data-shared-Dp8x7s31.js";
import * as Z from "pinyin-pro";
import { whichWayFile as ee } from "./file-CXhVBbUa.js";
import { whichWayUtil as q } from "./utill-DpF3UCI4.js";
const he = { class: "updateCurrent" }, ve = { class: "UpdateCurrentTitle" }, fe = { class: "UpdateCurrentOverVersion" }, me = ["innerHTML"], _e = {
  key: 1,
  class: "UpdateCurrentOther"
}, ye = { class: "section-title" }, Ce = {
  key: 2,
  class: "UpdateCurrentOther"
}, we = { class: "section-title" }, $e = {
  __name: "updateCurrent",
  setup(A) {
    const h = p(K.ext), B = p(K.noname.over), y = N.currentLog, g = j(() => ue(y?.md, y)), L = (r) => {
      const v = r.type === "player", c = r.group !== "adjust";
      return v ? c ? "新增干员" : "调整干员" : c ? "新增卡牌" : "调整卡牌";
    }, u = /* @__PURE__ */ new Map(), k = (r, v) => {
      r ? u.set(v, r) : u.delete(v);
    }, C = () => {
      u.forEach((r, v) => {
        const c = g.value[v];
        if (!r || !c || c.type === "html") return;
        r.innerHTML = "";
        const n = c.type === "player", l = n ? S?.create?.buttonPresets?.character : S?.create?.buttonPresets?.vcard;
        if (typeof l != "function") {
          console.warn(`[UpdateCurrent] 按钮 API 不可用，跳过渲染：${c.type}`);
          return;
        }
        c.items.forEach((t) => {
          try {
            const o = l(t, n ? "player" : "card");
            if (o?.nodeType !== 1) return;
            n && o.addEventListener("dblclick", (f) => {
              f.stopPropagation(), pe.create(t);
            }), r.appendChild(o);
          } catch (o) {
            console.error(`创建${n ? "角色" : "卡片"} ${t} 失败:`, o);
          }
        });
      });
    };
    return D(() => {
      z(C);
    }), F(() => {
      u.forEach((r) => {
        r.innerHTML = "";
      }), u.clear();
    }), ne(
      () => g.value,
      () => {
        z(C);
      },
      { deep: !0 }
    ), (r, v) => (i(), a("div", he, [
      e("div", ve, "驶舰之向 v" + b(h.value) + "更新内容", 1),
      e("div", fe, "最低适配版本: " + b(B.value), 1),
      (i(!0), a(T, null, P(g.value, (c, n) => (i(), a(T, { key: n }, [
        c.type === "html" ? (i(), a("div", {
          key: 0,
          class: "UpdateCurrentContent md-body",
          innerHTML: c.html
        }, null, 8, me)) : c.type === "player" ? (i(), a("div", _e, [
          e("div", ye, b(L(c)), 1),
          e("div", {
            ref_for: !0,
            ref: (l) => k(l, n),
            class: "character-container"
          }, null, 512)
        ])) : (i(), a("div", Ce, [
          e("div", we, b(L(c)), 1),
          e("div", {
            ref_for: !0,
            ref: (l) => k(l, n),
            class: "card-container"
          }, null, 512)
        ]))
      ], 64))), 128))
    ]));
  }
}, xe = /* @__PURE__ */ R($e, [["__scopeId", "data-v-fe723f39"]]), ke = { class: "background-setting-wrapper" }, be = { class: "search-box" }, Le = { class: "image-box" }, Ue = ["src"], Ie = { class: "bg-section" }, Be = { class: "bg-title" }, Te = { class: "highlight" }, Me = ["onClick"], We = { class: "img-box" }, Pe = ["src", "alt"], Ee = { class: "title" }, He = {
  key: 0,
  class: "current-tag"
}, Ve = { class: "bg-section" }, je = { class: "bg-title" }, Ae = { class: "highlight" }, Se = ["onClick"], Oe = { class: "img-box" }, ze = ["src", "alt"], De = { class: "title" }, Re = {
  key: 0,
  class: "current-tag"
}, Ge = {
  __name: "backgroundSet",
  emits: ["loaded"],
  setup(A, { emit: h }) {
    const B = h, y = p(null), g = p(""), L = p(""), u = p(!1), k = p(!1), C = se({
      original: {},
      ext: {}
    }), r = p(""), v = p(`${V.assetURL}image/background/`), c = p(""), n = p("");
    D(async () => {
      try {
        C.original = V.configMenu.appearence.config.image_background.item || {};
        const d = X.getBackgroundData();
        C.ext = d || {};
        const s = X.getBackgroundData(null, !0);
        r.value = s?.url || "";
        const _ = V.config.ChangeBgI_mrfz || V.config.image_background;
        c.value = _, Object.keys(C.ext).includes(_) ? n.value = "ext" : Object.keys(C.original).includes(_) && (n.value = "original"), L.value = ee.compilePath("ui:watch.png"), y.value && B("loaded");
      } catch (d) {
        console.error("[BackgroundSetting] 初始化失败:", d);
      }
    });
    const l = j(() => o(C.ext)), t = j(() => o(C.original));
    function o(d) {
      const s = g.value.trim().toLowerCase();
      if (!s) return d;
      const _ = {};
      for (const [x, M] of Object.entries(d)) {
        if (M.toLowerCase().includes(s)) {
          _[x] = M;
          continue;
        }
        try {
          typeof Z < "u" && Z.pinyin(M, {
            type: "array",
            toneType: "none"
          }).join(" ").toLowerCase().includes(s) && (_[x] = M);
        } catch (Q) {
          return console.warn("拼音转换失败:", Q), d;
        }
      }
      return _;
    }
    function f(d) {
      return `${r.value}${d}.jpg`;
    }
    function w(d) {
      return `${v.value}${d}.jpg`;
    }
    function $(d, s) {
      return c.value === d && n.value === s;
    }
    function m(d, s) {
      $(d, s) || (c.value = d, n.value = s, s === "ext" ? (O.saveConfig("ChangeBgI_mrfz", d), q.setBgI()) : (O.saveConfig("ChangeBgI_mrfz", void 0), q.setBgI(), V.configMenu.appearence.config.image_background.onclick(d)));
    }
    function E() {
      u.value = !u.value;
    }
    function H() {
      k.value = !k.value;
    }
    return F(() => {
    }), (d, s) => (i(), a("div", ke, [
      e("div", be, [
        e("div", Le, [
          L.value ? (i(), a("img", {
            key: 0,
            src: L.value,
            alt: "搜索图标"
          }, null, 8, Ue)) : I("", !0)
        ]),
        G(e("input", {
          "onUpdate:modelValue": s[0] || (s[0] = (_) => g.value = _),
          type: "text",
          class: "search-input",
          placeholder: "支持中文和拼音搜索~"
        }, null, 512), [
          [Y, g.value]
        ])
      ]),
      e("div", {
        ref_key: "scrollContainer",
        ref: y,
        class: "scroll-container"
      }, [
        e("div", Ie, [
          e("div", Be, [
            s[3] || (s[3] = U(" 驶舰之向扩展背景 ", -1)),
            e("span", {
              class: "hidden-button",
              onClick: E
            }, [
              s[1] || (s[1] = U(" [", -1)),
              e("span", Te, b(u.value ? "展示" : "隐藏"), 1),
              s[2] || (s[2] = U("] ", -1))
            ])
          ]),
          e("div", {
            class: W(["bg-container", { "hidden-sjzx": u.value }])
          }, [
            (i(!0), a(T, null, P(l.value, (_, x) => (i(), a("div", {
              key: `ext-${x}`,
              class: W(["bg-box", { "current-bg": $(x, "ext") }]),
              onClick: (M) => m(x, "ext")
            }, [
              e("div", We, [
                e("img", {
                  src: f(x),
                  alt: _
                }, null, 8, Pe)
              ]),
              e("div", Ee, [
                U(b(_) + " ", 1),
                $(x, "ext") ? (i(), a("span", He, "(当前背景)")) : I("", !0)
              ])
            ], 10, Me))), 128))
          ], 2)
        ]),
        e("div", Ve, [
          e("div", je, [
            s[6] || (s[6] = U(" 无名杀自带背景 ", -1)),
            e("span", {
              class: "hidden-button",
              onClick: H
            }, [
              s[4] || (s[4] = U(" [", -1)),
              e("span", Ae, b(k.value ? "展示" : "隐藏"), 1),
              s[5] || (s[5] = U("] ", -1))
            ])
          ]),
          e("div", {
            class: W(["bg-container", { "hidden-sjzx": k.value }])
          }, [
            (i(!0), a(T, null, P(t.value, (_, x) => (i(), a("div", {
              key: `original-${x}`,
              class: W(["bg-box", { "current-bg": $(x, "original") }]),
              onClick: (M) => m(x, "original")
            }, [
              e("div", Oe, [
                e("img", {
                  src: w(x),
                  alt: _
                }, null, 8, ze)
              ]),
              e("div", De, [
                U(b(_) + " ", 1),
                $(x, "original") ? (i(), a("span", Re, "(当前背景)")) : I("", !0)
              ])
            ], 10, Se))), 128))
          ], 2)
        ])
      ], 512)
    ]));
  }
}, Ne = /* @__PURE__ */ R(Ge, [["__scopeId", "data-v-b56c40f0"]]), qe = { class: "update-log-wrapper" }, Fe = { class: "search-box" }, Qe = { class: "image-box" }, Je = ["src"], Ke = {
  key: 0,
  class: "welcome-section"
}, Xe = ["innerHTML"], Ze = { class: "version-list" }, Ye = ["onClick"], et = { class: "version-info" }, tt = { class: "version-number" }, nt = { class: "version-date" }, st = { class: "version-toggle" }, ot = { class: "toggle-icon" }, it = { class: "update-count" }, at = { class: "version-content" }, rt = { class: "update-items" }, lt = ["innerHTML"], ct = {
  key: 0,
  class: "no-results"
}, dt = {
  __name: "updateLog",
  emits: ["loaded"],
  setup(A, { emit: h }) {
    const B = h, y = p(null), g = p(""), L = p(""), u = p(""), k = p([]), C = j(() => {
      if (!g.value.trim())
        return k.value;
      const n = g.value.trim().toLowerCase();
      return k.value.filter((l) => l.version.toLowerCase().includes(n) || l.date.toLowerCase().includes(n) ? !0 : l.items.some((t) => t.replace(/<[^>]*>/g, "").toLowerCase().includes(n)));
    });
    function r(n) {
      if (!n) {
        console.warn("[UpdateLog] 更新日志为空");
        return;
      }
      try {
        const t = n.replace(/<pre[^>]*>/g, "").replace(/<\/pre>/g, "").trim().split(`
`).map((m) => m.trim()), o = [];
        let f = 0;
        for (let m = 0; m < t.length; m++) {
          if (/^\d{4}\.\d{1,2}\.\d{1,2}\s+v\d+\.\d+/.test(t[m])) {
            f = m;
            break;
          }
          t[m] && o.push(t[m]);
        }
        o.length > 0 && (u.value = o.join("<br>"));
        const w = [];
        let $ = null;
        for (let m = f; m < t.length; m++) {
          const E = t[m].trim(), H = E.match(/^(\d{4}\.\d{1,2}\.\d{1,2})\s+(v\d+\.\d+(?:\.\d+)?)/);
          if (H) {
            $ && w.push($), $ = {
              id: `v${w.length + 1}`,
              date: H[1],
              version: H[2],
              items: [],
              collapsed: w.length > 2
              // 默认折叠较旧的版本
            };
            continue;
          }
          if ($ && E) {
            let d = E.replace(/^"/, "").replace(/",?$/, "").trim();
            d && $.items.push(d);
          }
        }
        $ && w.push($), k.value = w, console.log("[UpdateLog] 已解析", w.length, "个版本");
      } catch (l) {
        console.error("[UpdateLog] 解析更新日志失败:", l);
      }
    }
    function v(n) {
      n = n.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const l = [
        { pattern: /新增(干员|皮肤|动态皮肤|背景|成就|模组|功能|模式)/g, class: "keyword-add" },
        { pattern: /调整(技能|武将)/g, class: "keyword-modify" },
        { pattern: /修复.*?的bug/g, class: "keyword-fix" },
        { pattern: /优化.*?/g, class: "keyword-optimize" },
        { pattern: /删除.*?/g, class: "keyword-remove" }
      ];
      let t = n;
      return l.forEach(({ pattern: o, class: f }) => {
        t = t.replace(o, (w) => `<span class="${f}">${w}</span>`);
      }), t;
    }
    function c(n) {
      n.collapsed = !n.collapsed;
    }
    return D(async () => {
      try {
        N.updateLog ? r(N.updateLog) : console.warn("[UpdateLog] 未找到更新日志数据"), L.value = ee.compilePath("ui:watch.png"), y.value && B("loaded");
      } catch (n) {
        console.error("[UpdateLog] 初始化失败:", n);
      }
    }), F(() => {
    }), (n, l) => (i(), a("div", qe, [
      e("div", Fe, [
        e("div", Qe, [
          L.value ? (i(), a("img", {
            key: 0,
            src: L.value,
            alt: "搜索图标"
          }, null, 8, Je)) : I("", !0)
        ]),
        G(e("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (t) => g.value = t),
          type: "text",
          class: "search-input",
          placeholder: "搜索版本号、日期或更新内容..."
        }, null, 512), [
          [Y, g.value]
        ])
      ]),
      e("div", {
        ref_key: "scrollContainer",
        ref: y,
        class: "scroll-container"
      }, [
        u.value ? (i(), a("div", Ke, [
          e("div", {
            class: "welcome-content",
            innerHTML: u.value
          }, null, 8, Xe)
        ])) : I("", !0),
        e("div", Ze, [
          (i(!0), a(T, null, P(C.value, (t, o) => (i(), a("div", {
            key: t.id,
            class: W(["version-card", { collapsed: t.collapsed }])
          }, [
            e("div", {
              class: "version-header",
              onClick: (f) => c(t)
            }, [
              e("div", et, [
                e("span", tt, b(t.version), 1),
                e("span", nt, b(t.date), 1)
              ]),
              e("div", st, [
                e("span", ot, b(t.collapsed ? "▶" : "▼"), 1),
                e("span", it, b(t.items.length) + " 项更新", 1)
              ])
            ], 8, Ye),
            G(e("div", at, [
              e("ul", rt, [
                (i(!0), a(T, null, P(t.items, (f, w) => (i(), a("li", {
                  key: w,
                  class: "update-item",
                  innerHTML: v(f)
                }, null, 8, lt))), 128))
              ])
            ], 512), [
              [oe, !t.collapsed]
            ])
          ], 2))), 128)),
          C.value.length === 0 ? (i(), a("div", ct, [...l[1] || (l[1] = [
            e("div", { class: "no-results-icon" }, "🔍", -1),
            e("div", { class: "no-results-text" }, "没有找到匹配的更新记录", -1)
          ])])) : I("", !0)
        ])
      ], 512)
    ]));
  }
}, ut = /* @__PURE__ */ R(dt, [["__scopeId", "data-v-b99f319e"]]), pt = {
  key: 0,
  class: "backgroundConfigUI"
}, gt = { class: "container" }, ht = { class: "functionBox" }, vt = { class: "titleBox" }, ft = { class: "imageBox" }, mt = ["src"], _t = ["onClick"], yt = { class: "displayArea" }, Ct = {
  __name: "main",
  setup(A, { expose: h }) {
    let B = "./extension/WhichWay/image/ui/painter.png";
    const y = [
      { name: "更新公告", component: xe, autoLoad: !0 },
      { name: "更新日志", component: ut },
      { name: "扩展介绍", component: ge },
      { name: "背景设置", component: Ne }
    ], g = p(""), L = j(() => {
      const t = y.find((o) => o.name === g.value);
      return t ? t.component : null;
    }), u = p(null), k = async (t) => {
      u.value && (u.value.scrollTop = 0, u.value.style.overflow = ""), g.value = t.name, t.autoLoad && t.onLoad && (await z(), t.onLoad());
    }, C = () => {
      u.value && (u.value.style.overflow = "auto");
    };
    D(async () => {
      if (y[0]) {
        g.value = y[0].name;
        const t = y.find((o) => o.autoLoad);
        t && (await z(), t.onLoad && t.onLoad());
      }
    });
    let r = p(!1);
    const v = () => document.querySelector(".whichWayConfigUIApp"), c = () => {
      r.value = !0;
      const t = v();
      t && (t.style.display = ""), O.pause2();
    }, n = () => {
      r.value = !1;
      const t = v();
      t && (t.style.display = "none"), O.resume2();
    };
    return h({
      show: c,
      hide: n,
      toggle: () => {
        const t = v();
        t && (t.style.display = t.style.display === "none" ? "" : "none"), r.value = !r.value;
      }
    }), (t, o) => J(r) ? (i(), a("div", pt, [
      e("div", gt, [
        e("div", { class: "titleBox" }, [
          e("div", {
            class: "ControlCPClose",
            onClick: n
          }),
          o[0] || (o[0] = e("div", { class: "titleText" }, "文明的存续", -1))
        ]),
        e("div", ht, [
          e("div", vt, [
            e("div", ft, [
              e("img", { src: J(B) }, null, 8, mt)
            ]),
            o[1] || (o[1] = e("div", { class: "title" }, "功能设置", -1))
          ]),
          (i(), a(T, null, P(y, (f, w) => e("div", {
            key: w,
            class: W(["funcButton", { selectedButton_ConfigUI_SJZX: g.value === f.name }]),
            onClick: ($) => k(f)
          }, b(f.name), 11, _t)), 64))
        ]),
        e("div", yt, [
          g.value ? (i(), ie(ae(L.value), {
            key: 0,
            onLoaded: C
          }, null, 32)) : I("", !0)
        ])
      ])
    ])) : I("", !0);
  }
}, wt = /* @__PURE__ */ R(Ct, [["__scopeId", "data-v-320292cc"]]);
class $t {
  constructor() {
    this.app = this.createApp(), this.vueInstance = null, this.mainComponent = null, le({
      name: "configUI_system",
      fn: () => {
        S.create.system("驶舰之向", () => {
          this.show();
        });
      }
    }), ce({
      name: "configUI_initBackground",
      fn: () => {
        q.setBgI();
      }
    });
  }
  app;
  vueInstance;
  mainComponent;
  /**
   * 创建vue应用的容器
   * @returns {HTMLElement}
   */
  createApp() {
    const h = S.create.div(".whichWayConfigUIApp", document.body);
    return h.style.width = "100%", h.style.height = "100%", h.style.position = "absolute", h.style.top = "0px", h.style.left = "0px", h.style.zIndex = "19", h.style.display = "none", h;
  }
  /**
   * 打开快速配置界面
   */
  show() {
    this.vueInstance || (this.vueInstance = re(wt), this.mainComponent = this.vueInstance.mount(this.app)), this.mainComponent?.show && this.mainComponent.show();
  }
  toggle() {
    this.mainComponent?.toggle && this.mainComponent.toggle();
  }
  hide() {
    this.mainComponent?.hide && this.mainComponent.hide();
  }
}
const te = new $t();
de({
  name: "whichWayConfigUI_setDev",
  fn: () => {
    window.whichwayConfigUI = te;
  }
});
window.whichWay.register("configUI", te);
export {
  te as whichWayConfigUI
};
