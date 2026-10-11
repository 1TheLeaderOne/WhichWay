import { ui as V, lib as A, game as O } from "noname";
import { ref as p, computed as j, onMounted as R, nextTick as z, onUnmounted as J, watch as ne, openBlock as a, createElementBlock as c, createElementVNode as t, toDisplayString as w, unref as G, createCommentVNode as I, Fragment as H, renderList as E, reactive as oe, withDirectives as N, vModelText as Y, createTextVNode as B, normalizeClass as W, vShow as se, createBlock as ie, resolveDynamicComponent as ae, createApp as re } from "vue";
import { onArenaReady as le, onContent as ce, onSetDev as de } from "./hooks.js";
import { whichWayUtil as D } from "./utill.js";
import { w as K } from "./version-shared.js";
import { w as F, s as ue } from "./updateLog-shared.js";
import { whichWayCharacterCard as pe } from "./characterCard.js";
import { _ as q } from "./_plugin-vue_export-helper.js";
import { w as X, E as he } from "./config-data-shared.js";
import * as Z from "pinyin-pro";
import { whichWayFile as ee } from "./file.js";
const ge = { class: "UpdateCurrentTitle" }, ve = {
  key: 0,
  class: "UpdateCurrentActions"
}, fe = ["disabled"], me = { class: "UpdateCurrentOverVersion" }, _e = ["innerHTML"], ye = {
  key: 1,
  class: "UpdateCurrentOther"
}, Ce = { class: "section-title" }, we = {
  key: 2,
  class: "UpdateCurrentOther"
}, xe = { class: "section-title" }, ke = {
  __name: "updateCurrent",
  setup(S) {
    const f = p(K.ext), T = p(K.noname.over), _ = F.currentLog, v = j(() => ue(_?.md, _)), b = (n) => {
      const e = n.type === "player", o = n.group !== "adjust";
      return e ? o ? "新增干员" : "调整干员" : o ? "新增卡牌" : "调整卡牌";
    }, h = /* @__PURE__ */ new Map(), x = (n, e) => {
      n ? h.set(e, n) : h.delete(e);
    }, y = () => {
      h.forEach((n, e) => {
        const o = v.value[e];
        if (!n || !o || o.type === "html") return;
        n.innerHTML = "";
        const d = o.type === "player", r = d ? V?.create?.buttonPresets?.character : V?.create?.buttonPresets?.vcard;
        if (typeof r != "function") {
          console.warn(`[UpdateCurrent] 按钮 API 不可用，跳过渲染：${o.type}`);
          return;
        }
        o.items.forEach((g) => {
          try {
            const l = r(g, d ? "player" : "card");
            if (l?.nodeType !== 1) return;
            d && l.addEventListener("dblclick", (L) => {
              L.stopPropagation(), pe.create(g);
            }), n.appendChild(l);
          } catch (l) {
            console.error(`创建${d ? "角色" : "卡片"} ${g} 失败:`, l);
          }
        });
      });
    };
    R(() => {
      z(y);
    }), J(() => {
      h.forEach((n) => {
        n.innerHTML = "";
      }), h.clear();
    }), ne(
      () => v.value,
      () => {
        z(y);
      },
      { deep: !0 }
    );
    const k = p(null), $ = p(!1), U = D.isDeveloperMode(), s = async () => {
      const n = k.value;
      if (!n || $.value) return;
      $.value = !0;
      const e = {
        transition: n.style.transition,
        position: n.style.position,
        height: n.style.height,
        maxHeight: n.style.maxHeight,
        overflow: n.style.overflow
      };
      n.style.transition = "none", n.style.position = "static", n.style.height = "auto", n.style.maxHeight = "none", n.style.overflow = "visible", n.offsetHeight;
      const o = n.offsetWidth, d = n.offsetHeight;
      try {
        const { domToJpeg: r } = await import("./index.js"), g = await r(n, {
          width: o,
          height: d,
          scale: 1.5,
          quality: 0.82,
          backgroundColor: "#1e2733",
          //排除操作栏（截图按钮自身）
          filter: (L) => !(L instanceof HTMLElement && L.classList.contains("UpdateCurrentActions"))
        }), l = document.createElement("a");
        l.download = `驶舰之向-更新公告-v${f.value}.jpg`, l.href = g, l.click();
      } catch (r) {
        console.error("[UpdateCurrent] 截图失败:", r), alert("截图失败，详见控制台");
      } finally {
        n.style.transition = e.transition, n.style.position = e.position, n.style.height = e.height, n.style.maxHeight = e.maxHeight, n.style.overflow = e.overflow, $.value = !1;
      }
    };
    return (n, e) => (a(), c("div", {
      ref_key: "rootRef",
      ref: k,
      class: "updateCurrent"
    }, [
      t("div", ge, "驶舰之向 v" + w(f.value) + "更新内容", 1),
      G(U) ? (a(), c("div", ve, [
        t("button", {
          type: "button",
          class: "capture-btn",
          disabled: $.value,
          onClick: s
        }, w($.value ? "截图中…" : "截图本页"), 9, fe)
      ])) : I("", !0),
      t("div", me, "最低适配版本: " + w(T.value), 1),
      (a(!0), c(H, null, E(v.value, (o, d) => (a(), c(H, { key: d }, [
        o.type === "html" ? (a(), c("div", {
          key: 0,
          class: "UpdateCurrentContent md-body",
          innerHTML: o.html
        }, null, 8, _e)) : o.type === "player" ? (a(), c("div", ye, [
          t("div", Ce, w(b(o)), 1),
          t("div", {
            ref_for: !0,
            ref: (r) => x(r, d),
            class: "character-container"
          }, null, 512)
        ])) : (a(), c("div", we, [
          t("div", xe, w(b(o)), 1),
          t("div", {
            ref_for: !0,
            ref: (r) => x(r, d),
            class: "card-container"
          }, null, 512)
        ]))
      ], 64))), 128))
    ], 512));
  }
}, $e = /* @__PURE__ */ q(ke, [["__scopeId", "data-v-1106bf04"]]), be = { class: "background-setting-wrapper" }, Le = { class: "search-box" }, Ue = { class: "image-box" }, Ie = ["src"], Be = { class: "bg-section" }, Te = { class: "bg-title" }, He = { class: "highlight" }, Me = ["onClick"], We = { class: "img-box" }, Ee = ["src", "alt"], Pe = { class: "title" }, Ae = {
  key: 0,
  class: "current-tag"
}, je = { class: "bg-section" }, Se = { class: "bg-title" }, Ve = { class: "highlight" }, Oe = ["onClick"], ze = { class: "img-box" }, De = ["src", "alt"], Re = { class: "title" }, qe = {
  key: 0,
  class: "current-tag"
}, Ge = {
  __name: "backgroundSet",
  emits: ["loaded"],
  setup(S, { emit: f }) {
    const T = f, _ = p(null), v = p(""), b = p(""), h = p(!1), x = p(!1), y = oe({
      original: {},
      ext: {}
    }), k = p(""), $ = p(`${A.assetURL}image/background/`), U = p(""), s = p("");
    R(async () => {
      try {
        y.original = A.configMenu.appearence.config.image_background.item || {};
        const u = X.getBackgroundData();
        y.ext = u || {};
        const i = X.getBackgroundData(null, !0);
        k.value = i?.url || "";
        const m = A.config.ChangeBgI_mrfz || A.config.image_background;
        U.value = m, Object.keys(y.ext).includes(m) ? s.value = "ext" : Object.keys(y.original).includes(m) && (s.value = "original"), b.value = ee.compilePath("ui:watch.png"), _.value && T("loaded");
      } catch (u) {
        console.error("[BackgroundSetting] 初始化失败:", u);
      }
    });
    const n = j(() => o(y.ext)), e = j(() => o(y.original));
    function o(u) {
      const i = v.value.trim().toLowerCase();
      if (!i) return u;
      const m = {};
      for (const [C, M] of Object.entries(u)) {
        if (M.toLowerCase().includes(i)) {
          m[C] = M;
          continue;
        }
        try {
          typeof Z < "u" && Z.pinyin(M, {
            type: "array",
            toneType: "none"
          }).join(" ").toLowerCase().includes(i) && (m[C] = M);
        } catch (Q) {
          return console.warn("拼音转换失败:", Q), u;
        }
      }
      return m;
    }
    function d(u) {
      return `${k.value}${u}.jpg`;
    }
    function r(u) {
      return `${$.value}${u}.jpg`;
    }
    function g(u, i) {
      return U.value === u && s.value === i;
    }
    function l(u, i) {
      g(u, i) || (U.value = u, s.value = i, i === "ext" ? (O.saveConfig("ChangeBgI_mrfz", u), D.setBgI()) : (O.saveConfig("ChangeBgI_mrfz", void 0), D.setBgI(), A.configMenu.appearence.config.image_background.onclick(u)));
    }
    function L() {
      h.value = !h.value;
    }
    function P() {
      x.value = !x.value;
    }
    return J(() => {
    }), (u, i) => (a(), c("div", be, [
      t("div", Le, [
        t("div", Ue, [
          b.value ? (a(), c("img", {
            key: 0,
            src: b.value,
            alt: "搜索图标"
          }, null, 8, Ie)) : I("", !0)
        ]),
        N(t("input", {
          "onUpdate:modelValue": i[0] || (i[0] = (m) => v.value = m),
          type: "text",
          class: "search-input",
          placeholder: "支持中文和拼音搜索~"
        }, null, 512), [
          [Y, v.value]
        ])
      ]),
      t("div", {
        ref_key: "scrollContainer",
        ref: _,
        class: "scroll-container"
      }, [
        t("div", Be, [
          t("div", Te, [
            i[3] || (i[3] = B(" 驶舰之向扩展背景 ", -1)),
            t("span", {
              class: "hidden-button",
              onClick: L
            }, [
              i[1] || (i[1] = B(" [", -1)),
              t("span", He, w(h.value ? "展示" : "隐藏"), 1),
              i[2] || (i[2] = B("] ", -1))
            ])
          ]),
          t("div", {
            class: W(["bg-container", { "hidden-sjzx": h.value }])
          }, [
            (a(!0), c(H, null, E(n.value, (m, C) => (a(), c("div", {
              key: `ext-${C}`,
              class: W(["bg-box", { "current-bg": g(C, "ext") }]),
              onClick: (M) => l(C, "ext")
            }, [
              t("div", We, [
                t("img", {
                  src: d(C),
                  alt: m
                }, null, 8, Ee)
              ]),
              t("div", Pe, [
                B(w(m) + " ", 1),
                g(C, "ext") ? (a(), c("span", Ae, "(当前背景)")) : I("", !0)
              ])
            ], 10, Me))), 128))
          ], 2)
        ]),
        t("div", je, [
          t("div", Se, [
            i[6] || (i[6] = B(" 无名杀自带背景 ", -1)),
            t("span", {
              class: "hidden-button",
              onClick: P
            }, [
              i[4] || (i[4] = B(" [", -1)),
              t("span", Ve, w(x.value ? "展示" : "隐藏"), 1),
              i[5] || (i[5] = B("] ", -1))
            ])
          ]),
          t("div", {
            class: W(["bg-container", { "hidden-sjzx": x.value }])
          }, [
            (a(!0), c(H, null, E(e.value, (m, C) => (a(), c("div", {
              key: `original-${C}`,
              class: W(["bg-box", { "current-bg": g(C, "original") }]),
              onClick: (M) => l(C, "original")
            }, [
              t("div", ze, [
                t("img", {
                  src: r(C),
                  alt: m
                }, null, 8, De)
              ]),
              t("div", Re, [
                B(w(m) + " ", 1),
                g(C, "original") ? (a(), c("span", qe, "(当前背景)")) : I("", !0)
              ])
            ], 10, Oe))), 128))
          ], 2)
        ])
      ], 512)
    ]));
  }
}, Ne = /* @__PURE__ */ q(Ge, [["__scopeId", "data-v-b56c40f0"]]), Fe = { class: "update-log-wrapper" }, Je = { class: "search-box" }, Qe = { class: "image-box" }, Ke = ["src"], Xe = {
  key: 0,
  class: "welcome-section"
}, Ze = ["innerHTML"], Ye = { class: "version-list" }, et = ["onClick"], tt = { class: "version-info" }, nt = { class: "version-number" }, ot = { class: "version-date" }, st = { class: "version-toggle" }, it = { class: "toggle-icon" }, at = { class: "update-count" }, rt = { class: "version-content" }, lt = { class: "update-items" }, ct = ["innerHTML"], dt = {
  key: 0,
  class: "no-results"
}, ut = {
  __name: "updateLog",
  emits: ["loaded"],
  setup(S, { emit: f }) {
    const T = f, _ = p(null), v = p(""), b = p(""), h = p(""), x = p([]), y = j(() => {
      if (!v.value.trim())
        return x.value;
      const s = v.value.trim().toLowerCase();
      return x.value.filter((n) => n.version.toLowerCase().includes(s) || n.date.toLowerCase().includes(s) ? !0 : n.items.some((e) => e.replace(/<[^>]*>/g, "").toLowerCase().includes(s)));
    });
    function k(s) {
      if (!s) {
        console.warn("[UpdateLog] 更新日志为空");
        return;
      }
      try {
        const e = s.replace(/<pre[^>]*>/g, "").replace(/<\/pre>/g, "").trim().split(`
`).map((l) => l.trim()), o = [];
        let d = 0;
        for (let l = 0; l < e.length; l++) {
          if (/^\d{4}\.\d{1,2}\.\d{1,2}\s+v\d+\.\d+/.test(e[l])) {
            d = l;
            break;
          }
          e[l] && o.push(e[l]);
        }
        o.length > 0 && (h.value = o.join("<br>"));
        const r = [];
        let g = null;
        for (let l = d; l < e.length; l++) {
          const L = e[l].trim(), P = L.match(/^(\d{4}\.\d{1,2}\.\d{1,2})\s+(v\d+\.\d+(?:\.\d+)?)/);
          if (P) {
            g && r.push(g), g = {
              id: `v${r.length + 1}`,
              date: P[1],
              version: P[2],
              items: [],
              collapsed: r.length > 2
              // 默认折叠较旧的版本
            };
            continue;
          }
          if (g && L) {
            let u = L.replace(/^"/, "").replace(/",?$/, "").trim();
            u && g.items.push(u);
          }
        }
        g && r.push(g), x.value = r, console.log("[UpdateLog] 已解析", r.length, "个版本");
      } catch (n) {
        console.error("[UpdateLog] 解析更新日志失败:", n);
      }
    }
    function $(s) {
      s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const n = [
        { pattern: /新增(干员|皮肤|动态皮肤|背景|成就|模组|功能|模式)/g, class: "keyword-add" },
        { pattern: /调整(技能|武将)/g, class: "keyword-modify" },
        { pattern: /修复.*?的bug/g, class: "keyword-fix" },
        { pattern: /优化.*?/g, class: "keyword-optimize" },
        { pattern: /删除.*?/g, class: "keyword-remove" }
      ];
      let e = s;
      return n.forEach(({ pattern: o, class: d }) => {
        e = e.replace(o, (r) => `<span class="${d}">${r}</span>`);
      }), e;
    }
    function U(s) {
      s.collapsed = !s.collapsed;
    }
    return R(async () => {
      try {
        F.updateLog ? k(F.updateLog) : console.warn("[UpdateLog] 未找到更新日志数据"), b.value = ee.compilePath("ui:watch.png"), _.value && T("loaded");
      } catch (s) {
        console.error("[UpdateLog] 初始化失败:", s);
      }
    }), J(() => {
    }), (s, n) => (a(), c("div", Fe, [
      t("div", Je, [
        t("div", Qe, [
          b.value ? (a(), c("img", {
            key: 0,
            src: b.value,
            alt: "搜索图标"
          }, null, 8, Ke)) : I("", !0)
        ]),
        N(t("input", {
          "onUpdate:modelValue": n[0] || (n[0] = (e) => v.value = e),
          type: "text",
          class: "search-input",
          placeholder: "搜索版本号、日期或更新内容..."
        }, null, 512), [
          [Y, v.value]
        ])
      ]),
      t("div", {
        ref_key: "scrollContainer",
        ref: _,
        class: "scroll-container"
      }, [
        h.value ? (a(), c("div", Xe, [
          t("div", {
            class: "welcome-content",
            innerHTML: h.value
          }, null, 8, Ze)
        ])) : I("", !0),
        t("div", Ye, [
          (a(!0), c(H, null, E(y.value, (e, o) => (a(), c("div", {
            key: e.id,
            class: W(["version-card", { collapsed: e.collapsed }])
          }, [
            t("div", {
              class: "version-header",
              onClick: (d) => U(e)
            }, [
              t("div", tt, [
                t("span", nt, w(e.version), 1),
                t("span", ot, w(e.date), 1)
              ]),
              t("div", st, [
                t("span", it, w(e.collapsed ? "▶" : "▼"), 1),
                t("span", at, w(e.items.length) + " 项更新", 1)
              ])
            ], 8, et),
            N(t("div", rt, [
              t("ul", lt, [
                (a(!0), c(H, null, E(e.items, (d, r) => (a(), c("li", {
                  key: r,
                  class: "update-item",
                  innerHTML: $(d)
                }, null, 8, ct))), 128))
              ])
            ], 512), [
              [se, !e.collapsed]
            ])
          ], 2))), 128)),
          y.value.length === 0 ? (a(), c("div", dt, [...n[1] || (n[1] = [
            t("div", { class: "no-results-icon" }, "🔍", -1),
            t("div", { class: "no-results-text" }, "没有找到匹配的更新记录", -1)
          ])])) : I("", !0)
        ])
      ], 512)
    ]));
  }
}, pt = /* @__PURE__ */ q(ut, [["__scopeId", "data-v-b99f319e"]]), ht = {
  key: 0,
  class: "backgroundConfigUI"
}, gt = { class: "container" }, vt = { class: "functionBox" }, ft = { class: "titleBox" }, mt = { class: "imageBox" }, _t = ["src"], yt = ["onClick"], Ct = { class: "displayArea" }, wt = {
  __name: "main",
  setup(S, { expose: f }) {
    let T = "./extension/WhichWay/image/ui/painter.png";
    const _ = [
      { name: "更新公告", component: $e, autoLoad: !0 },
      { name: "更新日志", component: pt },
      { name: "扩展介绍", component: he },
      { name: "背景设置", component: Ne }
    ], v = p(""), b = j(() => {
      const e = _.find((o) => o.name === v.value);
      return e ? e.component : null;
    }), h = p(null), x = async (e) => {
      h.value && (h.value.scrollTop = 0, h.value.style.overflow = ""), v.value = e.name, e.autoLoad && e.onLoad && (await z(), e.onLoad());
    }, y = () => {
      h.value && (h.value.style.overflow = "auto");
    };
    R(async () => {
      if (_[0]) {
        v.value = _[0].name;
        const e = _.find((o) => o.autoLoad);
        e && (await z(), e.onLoad && e.onLoad());
      }
    });
    let k = p(!1);
    const $ = () => document.querySelector(".whichWayConfigUIApp"), U = () => {
      k.value = !0;
      const e = $();
      e && (e.style.display = ""), O.pause2();
    }, s = () => {
      k.value = !1;
      const e = $();
      e && (e.style.display = "none"), O.resume2();
    };
    return f({
      show: U,
      hide: s,
      toggle: () => {
        const e = $();
        e && (e.style.display = e.style.display === "none" ? "" : "none"), k.value = !k.value;
      }
    }), (e, o) => G(k) ? (a(), c("div", ht, [
      t("div", gt, [
        t("div", { class: "titleBox" }, [
          t("div", {
            class: "ControlCPClose",
            onClick: s
          }),
          o[0] || (o[0] = t("div", { class: "titleText" }, "文明的存续", -1))
        ]),
        t("div", vt, [
          t("div", ft, [
            t("div", mt, [
              t("img", { src: G(T) }, null, 8, _t)
            ]),
            o[1] || (o[1] = t("div", { class: "title" }, "功能设置", -1))
          ]),
          (a(), c(H, null, E(_, (d, r) => t("div", {
            key: r,
            class: W(["funcButton", { selectedButton_ConfigUI_SJZX: v.value === d.name }]),
            onClick: (g) => x(d)
          }, w(d.name), 11, yt)), 64))
        ]),
        t("div", Ct, [
          v.value ? (a(), ie(ae(b.value), {
            key: 0,
            onLoaded: y
          }, null, 32)) : I("", !0)
        ])
      ])
    ])) : I("", !0);
  }
}, xt = /* @__PURE__ */ q(wt, [["__scopeId", "data-v-320292cc"]]);
class kt {
  constructor() {
    this.app = this.createApp(), this.vueInstance = null, this.mainComponent = null, le({
      name: "configUI_system",
      fn: () => {
        V.create.system("驶舰之向", () => {
          this.show();
        });
      }
    }), ce({
      name: "configUI_initBackground",
      fn: () => {
        D.setBgI();
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
    const f = V.create.div(".whichWayConfigUIApp", document.body);
    return f.style.width = "100%", f.style.height = "100%", f.style.position = "absolute", f.style.top = "0px", f.style.left = "0px", f.style.zIndex = "19", f.style.display = "none", f;
  }
  /**
   * 打开快速配置界面
   */
  show() {
    this.vueInstance || (this.vueInstance = re(xt), this.mainComponent = this.vueInstance.mount(this.app)), this.mainComponent?.show && this.mainComponent.show();
  }
  toggle() {
    this.mainComponent?.toggle && this.mainComponent.toggle();
  }
  hide() {
    this.mainComponent?.hide && this.mainComponent.hide();
  }
}
const te = new kt();
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
