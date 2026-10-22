import { ui as Z, lib as Q, game as se, get as z } from "noname";
import { ref as C, computed as T, onMounted as K, nextTick as G, onUnmounted as ue, watch as X, openBlock as o, createElementBlock as a, createElementVNode as e, toDisplayString as m, unref as R, createCommentVNode as E, Fragment as W, renderList as j, reactive as we, withDirectives as ne, vModelText as re, createTextVNode as N, normalizeClass as M, vShow as Ce, renderSlot as be, createVNode as de, normalizeStyle as xe, createBlock as ye, onBeforeUnmount as $e, withCtx as Le, withModifiers as pe, resolveDynamicComponent as Te, createApp as Ue } from "vue";
import { onArenaReady as Ie, onContent as Pe, onSetDev as Se } from "./hooks.js";
import { whichWayUtil as oe } from "./utill.js";
import { w as he } from "./arknight-arkidMigration-shared.js";
import { w as ce, s as Ae, r as Be } from "./updateLog-shared.js";
import { w as Ve, M as He } from "./characterCard-CharacterCard-shared.js";
import { _ as q } from "./_plugin-vue_export-helper.js";
import { w as me, E as Me } from "./config-data-shared.js";
import * as Y from "pinyin-pro";
import { whichWayFile as D } from "./file.js";
import { whichWayAudio as ie } from "./audio.js";
import { w as F, i as We, D as ee, a as Ee, e as ge, m as je, b as Ne } from "./skin-PortraitLayers-shared.js";
import { whichWayArknight as te } from "./arknight.js";
import { whichWayToast as J } from "./toast.js";
import { whichWayCharacterModules as Oe } from "./modules.js";
const De = { class: "UpdateCurrentTitle" }, qe = {
  key: 0,
  class: "UpdateCurrentActions"
}, Re = ["disabled"], Fe = { class: "UpdateCurrentOverVersion" }, ze = ["innerHTML"], Ge = {
  key: 1,
  class: "UpdateCurrentOther"
}, Ke = { class: "section-title" }, Qe = {
  key: 2,
  class: "UpdateCurrentOther"
}, Je = { class: "section-title" }, Xe = {
  __name: "updateCurrent",
  setup(A) {
    const w = C(he.ext), p = C(he.noname.over), c = ce.currentLog, g = T(() => Ae(c?.md, c)), _ = (i) => {
      const s = i.type === "player", t = i.group !== "adjust";
      return s ? t ? "新增干员" : "调整干员" : t ? "新增卡牌" : "调整卡牌";
    }, f = /* @__PURE__ */ new Map(), b = (i, s) => {
      i ? f.set(s, i) : f.delete(s);
    }, L = () => {
      f.forEach((i, s) => {
        const t = g.value[s];
        if (!i || !t || t.type === "html") return;
        i.innerHTML = "";
        const l = t.type === "player", v = l ? Z?.create?.buttonPresets?.character : Z?.create?.buttonPresets?.vcard;
        if (typeof v != "function") {
          console.warn(`[UpdateCurrent] 按钮 API 不可用，跳过渲染：${t.type}`);
          return;
        }
        t.items.forEach((x) => {
          try {
            const S = v(x, l ? "player" : "card");
            if (S?.nodeType !== 1) return;
            l && S.addEventListener("dblclick", (B) => {
              B.stopPropagation(), Ve.create(x);
            }), i.appendChild(S);
          } catch (S) {
            console.error(`创建${l ? "角色" : "卡片"} ${x} 失败:`, S);
          }
        });
      });
    };
    K(() => {
      G(L);
    }), ue(() => {
      f.forEach((i) => {
        i.innerHTML = "";
      }), f.clear();
    }), X(
      () => g.value,
      () => {
        G(L);
      },
      { deep: !0 }
    );
    const y = C(null), $ = C(!1), I = oe.isDeveloperMode(), k = async () => {
      const i = y.value;
      if (!i || $.value) return;
      $.value = !0;
      const s = {
        transition: i.style.transition,
        position: i.style.position,
        height: i.style.height,
        maxHeight: i.style.maxHeight,
        overflow: i.style.overflow
      };
      i.style.transition = "none", i.style.position = "static", i.style.height = "auto", i.style.maxHeight = "none", i.style.overflow = "visible", i.offsetHeight;
      const t = i.offsetWidth, l = i.offsetHeight;
      try {
        const { domToJpeg: v } = await import("./index.js"), x = await v(i, {
          width: t,
          height: l,
          scale: 1.5,
          quality: 0.82,
          backgroundColor: "#1e2733",
          //排除操作栏（截图按钮自身）
          filter: (B) => !(B instanceof HTMLElement && B.classList.contains("UpdateCurrentActions"))
        }), S = document.createElement("a");
        S.download = `驶舰之向-更新公告-v${w.value}.jpg`, S.href = x, S.click();
      } catch (v) {
        console.error("[UpdateCurrent] 截图失败:", v), alert("截图失败，详见控制台");
      } finally {
        i.style.transition = s.transition, i.style.position = s.position, i.style.height = s.height, i.style.maxHeight = s.maxHeight, i.style.overflow = s.overflow, $.value = !1;
      }
    };
    return (i, s) => (o(), a("div", {
      ref_key: "rootRef",
      ref: y,
      class: "updateCurrent"
    }, [
      e("div", De, "驶舰之向 v" + m(w.value) + "更新内容", 1),
      R(I) ? (o(), a("div", qe, [
        e("button", {
          type: "button",
          class: "capture-btn",
          disabled: $.value,
          onClick: k
        }, m($.value ? "截图中…" : "截图本页"), 9, Re)
      ])) : E("", !0),
      e("div", Fe, "最低适配版本: " + m(p.value), 1),
      (o(!0), a(W, null, j(g.value, (t, l) => (o(), a(W, { key: l }, [
        t.type === "html" ? (o(), a("div", {
          key: 0,
          class: "UpdateCurrentContent md-body",
          innerHTML: t.html
        }, null, 8, ze)) : t.type === "player" ? (o(), a("div", Ge, [
          e("div", Ke, m(_(t)), 1),
          e("div", {
            ref_for: !0,
            ref: (v) => b(v, l),
            class: "character-container"
          }, null, 512)
        ])) : (o(), a("div", Qe, [
          e("div", Je, m(_(t)), 1),
          e("div", {
            ref_for: !0,
            ref: (v) => b(v, l),
            class: "card-container"
          }, null, 512)
        ]))
      ], 64))), 128))
    ], 512));
  }
}, Ze = /* @__PURE__ */ q(Xe, [["__scopeId", "data-v-1106bf04"]]), Ye = { class: "background-setting-wrapper" }, et = { class: "search-box" }, tt = { class: "image-box" }, st = ["src"], nt = { class: "bg-section" }, ot = { class: "bg-title" }, at = { class: "highlight" }, it = ["onClick"], lt = { class: "img-box" }, rt = ["src", "alt"], ct = { class: "title" }, ut = {
  key: 0,
  class: "current-tag"
}, dt = { class: "bg-section" }, vt = { class: "bg-title" }, pt = { class: "highlight" }, ht = ["onClick"], mt = { class: "img-box" }, gt = ["src", "alt"], _t = { class: "title" }, ft = {
  key: 0,
  class: "current-tag"
}, yt = {
  __name: "backgroundSet",
  emits: ["loaded"],
  setup(A, { emit: w }) {
    const p = w, c = C(null), g = C(""), _ = C(""), f = C(!1), b = C(!1), L = we({
      original: {},
      ext: {}
    }), y = C(""), $ = C(`${Q.assetURL}image/background/`), I = C(""), k = C("");
    K(async () => {
      try {
        L.original = Q.configMenu.appearence.config.image_background.item || {};
        const u = me.getBackgroundData();
        L.ext = u || {};
        const n = me.getBackgroundData(null, !0);
        y.value = n?.url || "";
        const d = Q.config.ChangeBgI_mrfz || Q.config.image_background;
        I.value = d, Object.keys(L.ext).includes(d) ? k.value = "ext" : Object.keys(L.original).includes(d) && (k.value = "original"), _.value = D.compilePath("ui:watch.png"), c.value && p("loaded");
      } catch (u) {
        console.error("[BackgroundSetting] 初始化失败:", u);
      }
    });
    const i = T(() => t(L.ext)), s = T(() => t(L.original));
    function t(u) {
      const n = g.value.trim().toLowerCase();
      if (!n) return u;
      const d = {};
      for (const [U, O] of Object.entries(u)) {
        if (O.toLowerCase().includes(n)) {
          d[U] = O;
          continue;
        }
        try {
          typeof Y < "u" && Y.pinyin(O, {
            type: "array",
            toneType: "none"
          }).join(" ").toLowerCase().includes(n) && (d[U] = O);
        } catch (r) {
          return console.warn("拼音转换失败:", r), u;
        }
      }
      return d;
    }
    function l(u) {
      return `${y.value}${u}.jpg`;
    }
    function v(u) {
      return `${$.value}${u}.jpg`;
    }
    function x(u, n) {
      return I.value === u && k.value === n;
    }
    function S(u, n) {
      x(u, n) || (I.value = u, k.value = n, n === "ext" ? (se.saveConfig("ChangeBgI_mrfz", u), oe.setBgI()) : (se.saveConfig("ChangeBgI_mrfz", void 0), oe.setBgI(), Q.configMenu.appearence.config.image_background.onclick(u)));
    }
    function B() {
      f.value = !f.value;
    }
    function V() {
      b.value = !b.value;
    }
    return ue(() => {
    }), (u, n) => (o(), a("div", Ye, [
      e("div", et, [
        e("div", tt, [
          _.value ? (o(), a("img", {
            key: 0,
            src: _.value,
            alt: "搜索图标"
          }, null, 8, st)) : E("", !0)
        ]),
        ne(e("input", {
          "onUpdate:modelValue": n[0] || (n[0] = (d) => g.value = d),
          type: "text",
          class: "search-input",
          placeholder: "支持中文和拼音搜索~"
        }, null, 512), [
          [re, g.value]
        ])
      ]),
      e("div", {
        ref_key: "scrollContainer",
        ref: c,
        class: "scroll-container"
      }, [
        e("div", nt, [
          e("div", ot, [
            n[3] || (n[3] = N(" 驶舰之向扩展背景 ", -1)),
            e("span", {
              class: "hidden-button",
              onClick: B
            }, [
              n[1] || (n[1] = N(" [", -1)),
              e("span", at, m(f.value ? "展示" : "隐藏"), 1),
              n[2] || (n[2] = N("] ", -1))
            ])
          ]),
          e("div", {
            class: M(["bg-container", { "hidden-sjzx": f.value }])
          }, [
            (o(!0), a(W, null, j(i.value, (d, U) => (o(), a("div", {
              key: `ext-${U}`,
              class: M(["bg-box", { "current-bg": x(U, "ext") }]),
              onClick: (O) => S(U, "ext")
            }, [
              e("div", lt, [
                e("img", {
                  src: l(U),
                  alt: d
                }, null, 8, rt)
              ]),
              e("div", ct, [
                N(m(d) + " ", 1),
                x(U, "ext") ? (o(), a("span", ut, "(当前背景)")) : E("", !0)
              ])
            ], 10, it))), 128))
          ], 2)
        ]),
        e("div", dt, [
          e("div", vt, [
            n[6] || (n[6] = N(" 无名杀自带背景 ", -1)),
            e("span", {
              class: "hidden-button",
              onClick: V
            }, [
              n[4] || (n[4] = N(" [", -1)),
              e("span", pt, m(b.value ? "展示" : "隐藏"), 1),
              n[5] || (n[5] = N("] ", -1))
            ])
          ]),
          e("div", {
            class: M(["bg-container", { "hidden-sjzx": b.value }])
          }, [
            (o(!0), a(W, null, j(s.value, (d, U) => (o(), a("div", {
              key: `original-${U}`,
              class: M(["bg-box", { "current-bg": x(U, "original") }]),
              onClick: (O) => S(U, "original")
            }, [
              e("div", mt, [
                e("img", {
                  src: v(U),
                  alt: d
                }, null, 8, gt)
              ]),
              e("div", _t, [
                N(m(d) + " ", 1),
                x(U, "original") ? (o(), a("span", ft, "(当前背景)")) : E("", !0)
              ])
            ], 10, ht))), 128))
          ], 2)
        ])
      ], 512)
    ]));
  }
}, $t = /* @__PURE__ */ q(yt, [["__scopeId", "data-v-b56c40f0"]]), kt = { class: "update-log-wrapper" }, wt = { class: "search-box" }, Ct = { class: "image-box" }, bt = ["src"], xt = {
  key: 0,
  class: "welcome-section"
}, Lt = ["innerHTML"], Tt = { class: "version-list" }, Ut = ["onClick"], It = { class: "version-info" }, Pt = { class: "version-number" }, St = { class: "version-date" }, At = { class: "version-toggle" }, Bt = { class: "toggle-icon" }, Vt = { class: "update-count" }, Ht = { class: "version-content" }, Mt = { class: "update-items" }, Wt = ["innerHTML"], Et = {
  key: 0,
  class: "no-results"
}, jt = {
  __name: "updateLog",
  emits: ["loaded"],
  setup(A, { emit: w }) {
    const p = w, c = C(null), g = C(""), _ = C(""), f = C(""), b = C([]), L = T(() => {
      if (!g.value.trim())
        return b.value;
      const s = g.value.trim().toLowerCase();
      return b.value.filter((t) => t.version.toLowerCase().includes(s) || t.date.toLowerCase().includes(s) ? !0 : t.items.some((l) => l.replace(/<[^>]*>/g, "").toLowerCase().includes(s)));
    });
    function y(s) {
      if (!s) {
        console.warn("[UpdateLog] 更新日志为空");
        return;
      }
      try {
        const l = s.replace(/<pre[^>]*>/g, "").replace(/<\/pre>/g, "").trim().split(`
`).map((V) => V.trim()), v = [];
        let x = 0;
        for (let V = 0; V < l.length; V++) {
          if (/^\d{4}\.\d{1,2}\.\d{1,2}\s+v\d+\.\d+/.test(l[V])) {
            x = V;
            break;
          }
          l[V] && v.push(l[V]);
        }
        v.length > 0 && (f.value = v.join("<br>"));
        const S = [];
        let B = null;
        for (let V = x; V < l.length; V++) {
          const u = l[V].trim(), n = u.match(/^(\d{4}\.\d{1,2}\.\d{1,2})\s+(v\d+\.\d+(?:\.\d+)?)/);
          if (n) {
            B && S.push(B), B = {
              id: `v${S.length + 1}`,
              date: n[1],
              version: n[2],
              items: [],
              collapsed: S.length > 2
              // 默认折叠较旧的版本
            };
            continue;
          }
          if (B && u) {
            let d = u.replace(/^"/, "").replace(/",?$/, "").trim();
            d && B.items.push(d);
          }
        }
        B && S.push(B), b.value = S, console.log("[UpdateLog] 已解析", S.length, "个版本");
      } catch (t) {
        console.error("[UpdateLog] 解析更新日志失败:", t);
      }
    }
    const $ = [
      { pattern: /新增(干员|皮肤|动态皮肤|背景|成就|模组|功能|模式)/g, className: "keyword-add" },
      { pattern: /调整(技能|武将)/g, className: "keyword-modify" },
      { pattern: /修复.*?的bug/g, className: "keyword-fix" },
      { pattern: /优化.*?/g, className: "keyword-optimize" },
      { pattern: /删除.*?/g, className: "keyword-remove" }
    ];
    function I(s, t, l) {
      return s.split(/(<[^>]+>)/).map((v) => v.startsWith("<") ? v : v.replace(t, (x) => `<span class="${l}">${x}</span>`)).join("");
    }
    function k(s) {
      let t = s;
      t = t.replace(/\\`/g, "`"), t = t.replace(/^[-*+]\s+/, ""), t = t.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      let l = Be(t);
      for (const { pattern: v, className: x } of $)
        l = I(l, v, x);
      return l;
    }
    function i(s) {
      s.collapsed = !s.collapsed;
    }
    return K(async () => {
      try {
        ce.updateLog ? y(ce.updateLog) : console.warn("[UpdateLog] 未找到更新日志数据"), _.value = D.compilePath("ui:watch.png"), c.value && p("loaded");
      } catch (s) {
        console.error("[UpdateLog] 初始化失败:", s);
      }
    }), ue(() => {
    }), (s, t) => (o(), a("div", kt, [
      e("div", wt, [
        e("div", Ct, [
          _.value ? (o(), a("img", {
            key: 0,
            src: _.value,
            alt: "搜索图标"
          }, null, 8, bt)) : E("", !0)
        ]),
        ne(e("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (l) => g.value = l),
          type: "text",
          class: "search-input",
          placeholder: "搜索版本号、日期或更新内容..."
        }, null, 512), [
          [re, g.value]
        ])
      ]),
      e("div", {
        ref_key: "scrollContainer",
        ref: c,
        class: "scroll-container"
      }, [
        f.value ? (o(), a("div", xt, [
          e("div", {
            class: "welcome-content",
            innerHTML: f.value
          }, null, 8, Lt)
        ])) : E("", !0),
        e("div", Tt, [
          (o(!0), a(W, null, j(L.value, (l) => (o(), a("div", {
            key: l.id,
            class: M(["version-card", { collapsed: l.collapsed }])
          }, [
            e("div", {
              class: "version-header",
              onClick: (v) => i(l)
            }, [
              e("div", It, [
                e("span", Pt, m(l.version), 1),
                e("span", St, m(l.date), 1)
              ]),
              e("div", At, [
                e("span", Bt, m(l.collapsed ? "▶" : "▼"), 1),
                e("span", Vt, m(l.items.length) + " 项更新", 1)
              ])
            ], 8, Ut),
            ne(e("div", Ht, [
              e("ul", Mt, [
                (o(!0), a(W, null, j(l.items, (v, x) => (o(), a("li", {
                  key: x,
                  class: "update-item",
                  innerHTML: k(v)
                }, null, 8, Wt))), 128))
              ])
            ], 512), [
              [Ce, !l.collapsed]
            ])
          ], 2))), 128)),
          L.value.length === 0 ? (o(), a("div", Et, [...t[1] || (t[1] = [
            e("div", { class: "no-results-icon" }, "🔍", -1),
            e("div", { class: "no-results-text" }, "没有找到匹配的更新记录", -1)
          ])])) : E("", !0)
        ])
      ], 512)
    ]));
  }
}, Nt = /* @__PURE__ */ q(jt, [["__scopeId", "data-v-236dc088"]]);
function le(A) {
  return String(z.translation(A) || A).replace(/<[^>]+>/g, "");
}
function Ot(A) {
  const w = /* @__PURE__ */ new Map();
  for (const p of A) {
    const c = le(p), g = [c, p];
    try {
      if (typeof Y < "u") {
        const _ = Y.pinyin(c, {
          type: "array",
          toneType: "none"
        }).join(" ").toLowerCase();
        g.push(_, _.replace(/\s/g, ""));
      }
    } catch (_) {
      console.warn("[charSearch] 拼音转换失败:", _);
    }
    for (const _ of z.character(p)?.skills || [])
      g.push(_), g.push(String(z.translation(_) || "").replace(/<[^>]+>/g, ""));
    w.set(p, g.join(" ").toLowerCase());
  }
  return w;
}
function Dt(A, w, p) {
  const c = w.trim().toLowerCase();
  if (!c) return A;
  const g = c.replace(/\s/g, ""), _ = [];
  for (const f of A) {
    const b = p.get(f) || "";
    (b.includes(c) || b.replace(/\s/g, "").includes(g)) && _.push(f);
  }
  return _;
}
const qt = { class: "char-picker" }, Rt = { class: "search-box" }, Ft = { class: "image-box" }, zt = ["src"], Gt = ["placeholder"], Kt = { class: "char-grid" }, Qt = ["onClick"], Jt = {
  key: 0,
  class: "empty-tip"
}, Xt = {
  __name: "charPicker",
  props: {
    /** 候选干员 id 列表 */
    names: { type: Array, default: () => [] },
    /** 当前选中的干员 id（v-model） */
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "支持中文、拼音和技能搜索~" },
    emptyText: { type: String, default: "没有匹配的干员" }
  },
  emits: ["update:modelValue", "filtered"],
  setup(A, { emit: w }) {
    const p = A, c = w, g = C(""), _ = D.compilePath("ui:watch.png"), f = ($) => le($), b = T(() => Ot(p.names)), L = T(() => Dt(p.names, g.value, b.value));
    X(
      L,
      ($) => c("filtered", $),
      { immediate: !0 }
    );
    function y($) {
      c("update:modelValue", $);
    }
    return ($, I) => (o(), a("div", qt, [
      e("div", Rt, [
        e("div", Ft, [
          R(_) ? (o(), a("img", {
            key: 0,
            src: R(_),
            alt: "搜索图标"
          }, null, 8, zt)) : E("", !0)
        ]),
        ne(e("input", {
          "onUpdate:modelValue": I[0] || (I[0] = (k) => g.value = k),
          type: "text",
          class: "search-input",
          placeholder: A.placeholder
        }, null, 8, Gt), [
          [re, g.value]
        ])
      ]),
      e("div", Kt, [
        (o(!0), a(W, null, j(L.value, (k) => (o(), a(W, { key: k }, [
          $.$slots.item ? be($.$slots, "item", {
            key: 0,
            char: k,
            active: k === A.modelValue,
            pick: y
          }, void 0, !0) : (o(), a("div", {
            key: 1,
            class: M(["char-item", { "char-item-active": k === A.modelValue }]),
            onClick: (i) => y(k)
          }, m(f(k)), 11, Qt))
        ], 64))), 128)),
        L.value.length ? E("", !0) : (o(), a("div", Jt, m(A.emptyText), 1))
      ])
    ]));
  }
}, ve = /* @__PURE__ */ q(Xt, [["__scopeId", "data-v-eb466f81"]]), Zt = { class: "audio-setting" }, Yt = { class: "picker-col" }, es = { class: "detail-col" }, ts = {
  key: 0,
  class: "hint"
}, ss = { class: "char-card" }, ns = { class: "char-meta" }, os = { class: "detail-title" }, as = { class: "current-line" }, is = { class: "current-value" }, ls = {
  key: 0,
  class: "lang-list"
}, rs = ["onClick"], cs = { class: "selectText" }, us = {
  key: 1,
  class: "hint"
}, ds = {
  key: 2,
  class: "play-list"
}, vs = { class: "play-name" }, ps = ["onClick"], hs = {
  key: 3,
  class: "hint"
}, ms = { class: "play-row" }, gs = { class: "play-name" }, _s = {
  __name: "audioSetting",
  emits: ["loaded"],
  setup(A, { emit: w }) {
    const p = w, c = C(""), g = C(0), _ = T(() => window.whichWaySave?.allCharacters || []), f = T(() => {
      const t = z.translation(c.value) || c.value;
      return String(t).replace(/<[^>]+>/g, "");
    }), b = T(() => {
      if (g.value, !c.value) return {};
      const t = F.getCurrentSkinPath(c.value) || "";
      return { backgroundImage: t.startsWith("url") ? t : `url("${t}")` };
    }), L = T(() => c.value ? ie.getCharacterAvailableLang(c.value) || [] : []), y = T(() => (g.value, c.value ? ie.getCharacterLang(c.value) : "")), $ = T(() => (g.value, c.value ? (z.character(c.value)?.skills || []).map((t) => ({ id: t, label: z.translation(t) })) : [])), I = (t) => te.getVoiceLangTranslation(t) || t;
    async function k(t) {
      if (t !== y.value) {
        if (!window.whichWaySave?.hasChar(c.value)) {
          J.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
          return;
        }
        await ie.setCustomAudio(c.value, t), g.value++;
      }
    }
    function i(t) {
      ie.playSkillAudio(t, c.value);
    }
    function s() {
      se.tryDieAudio(c.value);
    }
    return K(() => p("loaded")), (t, l) => (o(), a("div", Zt, [
      e("div", Yt, [
        de(ve, {
          modelValue: c.value,
          "onUpdate:modelValue": l[0] || (l[0] = (v) => c.value = v),
          names: _.value
        }, null, 8, ["modelValue", "names"])
      ]),
      e("div", es, [
        c.value ? (o(), a(W, { key: 1 }, [
          e("div", ss, [
            e("div", {
              class: "char-avatar",
              style: xe(b.value)
            }, null, 4),
            e("div", ns, [
              e("div", os, m(f.value), 1),
              e("div", as, [
                l[1] || (l[1] = N("当前配音：", -1)),
                e("span", is, m(I(y.value)), 1)
              ])
            ])
          ]),
          l[2] || (l[2] = e("div", { class: "section-title" }, "配音语言", -1)),
          L.value.length ? (o(), a("div", ls, [
            (o(!0), a(W, null, j(L.value, (v) => (o(), a("div", {
              key: v,
              class: "selectWrapper",
              onClick: (x) => k(v)
            }, [
              e("div", {
                class: M(v === y.value ? "choice" : "nochoice")
              }, null, 2),
              e("div", {
                class: M(v === y.value ? "choice-content" : "nochoice-content")
              }, [
                e("div", cs, m(I(v)), 1)
              ], 2)
            ], 8, rs))), 128))
          ])) : (o(), a("div", us, "该干员暂无可切换的配音语言")),
          l[3] || (l[3] = e("div", { class: "section-title" }, "技能配音", -1)),
          $.value.length ? (o(), a("div", ds, [
            (o(!0), a(W, null, j($.value, (v) => (o(), a("div", {
              key: v.id,
              class: "play-row"
            }, [
              e("div", vs, m(v.label), 1),
              e("div", {
                class: "play-btn",
                onClick: (x) => i(v.id)
              }, null, 8, ps)
            ]))), 128))
          ])) : (o(), a("div", hs, "该干员暂无技能")),
          l[4] || (l[4] = e("div", { class: "section-title" }, "死亡配音", -1)),
          e("div", ms, [
            e("div", gs, m(f.value) + " 阵亡语音", 1),
            e("div", {
              class: "play-btn",
              onClick: s
            })
          ])
        ], 64)) : (o(), a("div", ts, "请先在左侧选择一名驶舰之向干员"))
      ])
    ]));
  }
}, fs = /* @__PURE__ */ q(_s, [["__scopeId", "data-v-3cb8014e"]]), ys = { class: "module-setting" }, $s = { class: "picker-col" }, ks = { class: "detail-col" }, ws = {
  key: 0,
  class: "hint"
}, Cs = { class: "detail-title" }, bs = {
  __name: "moduleSetting",
  emits: ["loaded"],
  setup(A, { emit: w }) {
    const p = w, c = C(""), g = T(() => Object.keys(Oe.modules || {})), _ = T(() => {
      const f = z.translation(c.value) || c.value;
      return String(f).replace(/<[^>]+>/g, "");
    });
    return K(() => p("loaded")), (f, b) => (o(), a("div", ys, [
      e("div", $s, [
        de(ve, {
          modelValue: c.value,
          "onUpdate:modelValue": b[0] || (b[0] = (L) => c.value = L),
          names: g.value,
          "empty-text": "没有配置模组的干员"
        }, null, 8, ["modelValue", "names"])
      ]),
      e("div", ks, [
        c.value ? (o(), a(W, { key: 1 }, [
          e("div", Cs, m(_.value) + " · 模组", 1),
          (o(), ye(He, {
            key: c.value,
            name: c.value
          }, null, 8, ["name"]))
        ], 64)) : (o(), a("div", ws, "请先在左侧选择一名干员"))
      ])
    ]));
  }
}, xs = /* @__PURE__ */ q(bs, [["__scopeId", "data-v-03a92dac"]]), Ls = { class: "solicit-forth" }, Ts = { class: "left-pane" }, Us = { class: "search-box" }, Is = { class: "image-box" }, Ps = ["src"], Ss = { class: "card-grid" }, As = { class: "image-box-card" }, Bs = ["src", "alt"], Vs = {
  key: 1,
  class: "operator-image no-image"
}, Hs = { class: "operator-name" }, Ms = { class: "operator-id" }, Ws = {
  key: 0,
  class: "empty-tip"
}, Es = { class: "right-pane" }, js = { class: "submut-total submut-total-extra" }, Ns = { class: "submit-channel" }, Os = ["src"], Ds = { class: "group-btns" }, qs = { class: "submit-rules" }, Rs = { class: "rules-list" }, Fs = {
  key: 1,
  class: "char-plain"
}, _e = "104537053", fe = "ol_feiyi", zs = "https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=f5IbwM5In_2WKgo4e6-eGdRKpyszhmZV&authKey=cQ6aXKkQ4skbgLGtO6LP5IV66qaaU0sNn1BaDqK1dr02R2inCUGlHLpabzqc2JOS&noverify=0&group_code=104537053", Gs = {
  __name: "solicitForth",
  emits: ["loaded"],
  setup(A, { emit: w }) {
    const p = w, c = C(""), g = D.compilePath("ui:watch.png"), _ = D.compilePath("dec:qq1.jpg"), f = { backgroundImage: `url("${D.compilePath("ui:solicitForth/poster.png")}")` }, b = C([]);
    function L(h) {
      return D.characterPortraitExt[h] ? D.getCharacterPortraitPath(h) : "";
    }
    function y(h, r) {
      const P = [h, r];
      try {
        if (typeof Y < "u") {
          const H = Y.pinyin(r, {
            type: "array",
            toneType: "none"
          }).join(" ").toLowerCase();
          P.push(H, H.replace(/\s/g, ""));
        }
      } catch (H) {
        console.warn("[solicitForth] 拼音转换失败:", H);
      }
      return P.join(" ").toLowerCase();
    }
    K(() => {
      const h = te.arknightData?.character_table ?? {}, r = new Set(te.exsitArk), P = [];
      for (const H of te.vaildArkId) {
        const ae = h[H]?.name ?? H;
        P.push({
          id: H,
          name: ae,
          image: L(H),
          implemented: r.has(H),
          //游戏内拿不得到的角色不进征稿名单，但搜索时仍要说明原因，否则玩家以为表里没这个人
          obtainable: te.isObtainable(H),
          search: y(H, ae)
        });
      }
      P.sort((H, ae) => H.name.localeCompare(ae.name, "zh-Hans-CN")), b.value = P, p("loaded");
    });
    const $ = T(() => c.value.trim().toLowerCase());
    function I(h, r) {
      const P = h.search;
      return P.includes(r) || P.replace(/\s/g, "").includes(r.replace(/\s/g, ""));
    }
    const k = T(() => b.value.filter((h) => !h.implemented && h.obtainable)), i = T(() => {
      const h = $.value;
      return h ? k.value.filter((r) => I(r, h)) : k.value;
    }), s = T(() => {
      const h = $.value;
      return h ? b.value.filter((r) => r.implemented && r.obtainable && I(r, h)) : [];
    }), t = T(() => {
      const h = $.value;
      return h ? b.value.filter((r) => !r.implemented && !r.obtainable && I(r, h)) : [];
    }), l = T(() => {
      if (!$.value) {
        const h = b.value.filter((r) => r.obtainable).length;
        return `未实装 ${k.value.length} / 共 ${h} 名可获取干员`;
      }
      return `命中 ${i.value.length} 名`;
    }), v = T(() => $.value !== "" && (i.value.length > 0 || s.value.length > 0)), x = T(() => {
      if (!$.value) return "";
      if (s.value.length > 0) {
        const r = s.value.slice(0, 5).map((H) => H.name), P = s.value.length > r.length ? ` 等${s.value.length}名` : "";
        return `「${r.join("、")}${P}」明日方舟里有，驶舰之向也已实装`;
      }
      if (i.value.length > 0) return "";
      if (t.value.length > 0) {
        const r = t.value.slice(0, 5).map((H) => H.name), P = t.value.length > r.length ? ` 等${t.value.length}名` : "";
        return `「${r.join("、")}${P}」明日方舟里有，但游戏内无法获取（预备干员／活动 NPC 一类），不列入征稿名单`;
      }
      return "明日方舟的干员表里没有找到这个id／名字／拼音";
    }), S = T(() => $.value ? "没有匹配的未实装干员（试试干员id、中文名或拼音）" : "所有明日方舟干员都已实装"), B = C("复制群号");
    let V = null;
    $e(() => clearTimeout(V));
    function u() {
      window.open(zs);
    }
    async function n(h) {
      try {
        if (navigator.clipboard?.writeText)
          return await navigator.clipboard.writeText(h), !0;
      } catch (r) {
        console.warn("[solicitForth] Clipboard API 不可用，改用 execCommand:", r);
      }
      try {
        const r = document.createElement("textarea");
        r.value = h, r.style.cssText = "position:fixed;left:-9999px;top:-9999px;", document.body.appendChild(r), r.select();
        const P = document.execCommand("copy");
        return r.remove(), P;
      } catch (r) {
        return console.error("[solicitForth] 复制失败:", r), !1;
      }
    }
    async function d() {
      const h = await n(_e);
      B.value = h ? "已复制" : "复制失败", clearTimeout(V), V = setTimeout(() => B.value = "复制群号", 1500);
    }
    const U = !!Q.character[fe];
    function O() {
      Z.click.charactercard(fe, null, !0);
      const h = Z.window?.lastElementChild;
      h?.classList.contains("popup-container") && h.querySelector(".menubg.charactercard") && (h.style.zIndex = "20");
    }
    return (h, r) => (o(), a("div", Ls, [
      e("div", Ts, [
        e("div", { class: "submit-poster" }, [
          e("div", {
            class: "poster",
            style: f
          })
        ]),
        e("div", Us, [
          e("div", Is, [
            e("img", {
              src: R(g),
              alt: "搜索图标"
            }, null, 8, Ps)
          ]),
          ne(e("input", {
            "onUpdate:modelValue": r[0] || (r[0] = (P) => c.value = P),
            type: "text",
            class: "search-input",
            placeholder: "输入干员id、中文名或拼音搜索未实装的干员~"
          }, null, 512), [
            [re, c.value]
          ])
        ]),
        x.value ? (o(), a("div", {
          key: 0,
          class: M(["search-status", { "is-hit": v.value }])
        }, m(x.value), 3)) : E("", !0),
        e("div", Ss, [
          (o(!0), a(W, null, j(i.value, (P) => (o(), a("div", {
            key: P.id,
            class: "operator-card"
          }, [
            e("div", As, [
              P.image ? (o(), a("img", {
                key: 0,
                src: P.image,
                class: "operator-image",
                loading: "lazy",
                decoding: "async",
                fetchpriority: "low",
                alt: P.name
              }, null, 8, Bs)) : (o(), a("div", Vs, "暂无立绘"))
            ]),
            e("div", Hs, m(P.name), 1),
            e("div", Ms, m(P.id), 1),
            r[1] || (r[1] = e("div", { class: "operator-tag" }, "未实装", -1))
          ]))), 128)),
          i.value.length ? E("", !0) : (o(), a("div", Ws, m(S.value), 1))
        ])
      ]),
      e("div", Es, [
        e("div", js, m(l.value), 1),
        e("div", Ns, [
          r[2] || (r[2] = e("div", { class: "pane-title" }, "投稿渠道", -1)),
          e("img", {
            class: "qr-img",
            src: R(_),
            alt: "驶舰之向投稿群二维码"
          }, null, 8, Os),
          e("div", { class: "group-no-line" }, "群号：" + m(_e)),
          e("div", Ds, [
            e("div", {
              class: "pane-btn",
              onClick: u
            }, "加入群聊"),
            e("div", {
              class: "pane-btn",
              onClick: d
            }, m(B.value), 1)
          ])
        ]),
        e("div", qs, [
          r[8] || (r[8] = e("div", { class: "pane-title" }, "投稿规则", -1)),
          e("ol", Rs, [
            e("li", null, [
              r[3] || (r[3] = N(" 强度保持在 ", -1)),
              U ? (o(), a("span", {
                key: 0,
                class: "char-link",
                onClick: O
              }, "ol费祎")) : (o(), a("span", Fs, "ol费祎")),
              r[4] || (r[4] = N(" 上下 ", -1))
            ]),
            r[5] || (r[5] = e("li", null, "技能组设计须符合剧情", -1)),
            r[6] || (r[6] = e("li", null, "尽量投稿本扩展中没有的武将，如投稿已有武将，实装将会较慢", -1)),
            r[7] || (r[7] = e("li", null, "本人可能会对稿件进行修改再实装，如介意请在投稿时说明", -1))
          ])
        ])
      ])
    ]));
  }
}, Ks = /* @__PURE__ */ q(Gs, [["__scopeId", "data-v-d0c5e8df"]]), Qs = { class: "pos-setting" }, Js = { class: "picker-col" }, Xs = ["onClick"], Zs = { class: "listHead" }, Ys = { class: "listName" }, en = { class: "listId" }, tn = { class: "listSkins" }, sn = ["onClick"], nn = { class: "listSkinName" }, on = {
  key: 0,
  class: "listSkinEmpty"
}, an = { class: "stage-col" }, ln = { class: "toolRow" }, rn = { class: "toolHint" }, cn = { class: "skinRow" }, un = ["onClick"], dn = { class: "stageSide" }, vn = { class: "sideLine" }, pn = { class: "sideLine" }, hn = { class: "sideLine" }, mn = { class: "sideLine" }, gn = { class: "sideLine" }, _n = { class: "sideLine" }, fn = {
  __name: "portraitPosSetting",
  setup(A) {
    const w = T(() => window.whichWaySave?.allCharacters?.filter(We) ?? []), p = C(w.value[0] || ""), c = C([]), g = T(() => p.value ? le(p.value) : "（未选择干员）"), _ = C(0);
    function f(u, n) {
      const d = F.posData[u];
      return d != null && Object.prototype.hasOwnProperty.call(d, n);
    }
    function b(u) {
      if (_.value, !u) return [];
      const n = F.getCharacterSkin(u) || {}, d = [];
      n[ee] || d.push({ name: ee, path: D.getCharacterPortraitPath(u), modified: f(u, ee) });
      for (const U in n) d.push({ name: U, path: n[U], modified: f(u, U) });
      return d;
    }
    const L = T(() => b(p.value)), y = C(ee);
    function $(u, n) {
      y.value = n, p.value !== u && (p.value = u);
    }
    X(p, () => {
      L.value.some((u) => u.name === y.value) || (y.value = ee);
    }), X(p, async () => {
      await G(), document.querySelector(".listCardActive")?.scrollIntoView({ block: "nearest" });
    });
    const I = C(null);
    let k;
    const i = C(!1), s = T(() => (_.value, p.value ? F.getPortraitPos(p.value, y.value) : { x: 0, y: 0, scale: Ee }));
    async function t() {
      await G();
      const u = I.value;
      if (!u || !p.value) return;
      const n = L.value.find((d) => d.name === y.value);
      if (k?.(), k = void 0, !n?.path) {
        J.showToast(`[驶舰之向] 预览绘制失败：找不到 ${p.value} 的 ${y.value} 图片`, 3e3);
        return;
      }
      if (!je(u, n.path)) {
        J.showToast(`[驶舰之向] 预览绘制失败：找不到 ${p.value} 的 ${y.value} 图片`, 3e3);
        return;
      }
      i.value && (k = ge(u));
    }
    X([p, y], t), X(i, async () => {
      k?.(), k = void 0, i.value && (await G(), I.value && (k = ge(I.value), k || (J.showToast("[驶舰之向] 当前预览不是驶舰之向的干员立绘，无法拖拽", 3e3), i.value = !1)));
    });
    function l() {
      i.value = !i.value;
    }
    function v() {
      const u = c.value.length ? c.value : w.value;
      if (!u.length) return;
      const n = u.indexOf(p.value);
      p.value = u[n + 1 >= u.length ? 0 : n + 1];
    }
    let x;
    function S(u) {
      i.value || u.button !== 0 || (x = setTimeout(v, 2e3));
    }
    function B() {
      clearTimeout(x), x = void 0;
    }
    async function V() {
      F.flushPortraitPos();
      const u = Ne();
      try {
        await navigator.clipboard.writeText(u);
      } catch {
        const d = document.createElement("textarea");
        d.value = u, d.style.position = "fixed", d.style.opacity = "0", document.body.appendChild(d), d.select();
        const U = document.execCommand("copy");
        if (d.remove(), !U) {
          console.log(`[whichWayPosEditor] 复制失败，内容如下：
`, u), J.showToast("[驶舰之向] 复制失败，已打印到控制台", 3e3);
          return;
        }
      }
      J.showToast(`[驶舰之向] 已复制 pos.json（${Object.keys(F.posData).length} 名干员）`, 2500);
    }
    return $e(() => {
      clearTimeout(x), k?.(), F.flushPortraitPos();
    }), t(), (u, n) => (o(), a("div", Qs, [
      e("div", Js, [
        de(ve, {
          modelValue: p.value,
          "onUpdate:modelValue": n[0] || (n[0] = (d) => p.value = d),
          names: w.value,
          onFiltered: n[1] || (n[1] = (d) => c.value = d)
        }, {
          item: Le(({ char: d, active: U, pick: O }) => [
            e("div", {
              class: M(["listCard", { listCardActive: U }]),
              onClick: (h) => O(d)
            }, [
              e("div", Zs, [
                e("div", Ys, m(R(le)(d)), 1),
                e("div", en, m(d), 1)
              ]),
              e("div", tn, [
                (o(!0), a(W, null, j(b(d), (h) => (o(), a("div", {
                  key: h.name,
                  class: M(["listSkin", { listSkinActive: U && h.name === y.value }]),
                  onClick: pe((r) => $(d, h.name), ["stop"])
                }, [
                  e("div", nn, m(h.name), 1),
                  e("div", {
                    class: M(["skinFlag", { skinFlagOn: h.modified }])
                  }, m(h.modified ? "已调整" : "未调整"), 3)
                ], 10, sn))), 128)),
                b(d).length ? E("", !0) : (o(), a("div", on, "无皮肤数据"))
              ])
            ], 10, Xs)
          ]),
          _: 1
        }, 8, ["modelValue", "names"])
      ]),
      e("div", an, [
        e("div", ln, [
          e("div", {
            class: M(["toolBtn", { toolBtnActive: i.value }]),
            onClick: l
          }, m(i.value ? "关闭拖拽调整" : "开启拖拽调整"), 3),
          e("div", {
            class: "toolBtn",
            onClick: V
          }, "复制 pos.json"),
          e("div", rn, "右键" + m(i.value ? "" : " / 长按两秒") + "切到下一个干员", 1)
        ]),
        e("div", cn, [
          (o(!0), a(W, null, j(L.value, (d) => (o(), a("div", {
            key: d.name,
            class: M(["skinBtn", { skinBtnActive: d.name === y.value }]),
            onClick: (U) => y.value = d.name
          }, m(d.name), 11, un))), 128))
        ]),
        e("div", {
          class: M(["stage", { stageDragging: i.value }]),
          onContextmenu: pe(v, ["prevent"]),
          onPointerdown: S,
          onPointerup: B,
          onPointerleave: B,
          onPointercancel: B
        }, [
          e("div", {
            ref_key: "cardEl",
            ref: I,
            class: "previewCard",
            onPointerup: n[2] || (n[2] = (d) => _.value++),
            onWheelPassive: n[3] || (n[3] = (d) => _.value++)
          }, null, 544),
          e("div", dn, [
            e("div", vn, m(g.value), 1),
            e("div", pn, m(p.value), 1),
            e("div", hn, m(y.value), 1),
            e("div", mn, "x " + m(s.value.x.toFixed(3)), 1),
            e("div", gn, "y " + m(s.value.y.toFixed(3)), 1),
            e("div", _n, "scale " + m(s.value.scale.toFixed(2)), 1),
            n[4] || (n[4] = e("div", { class: "sideTip" }, "位置设定按「干员 + 皮肤」存进 json/pos.json，改动即时落盘（松手后约 300ms）。", -1)),
            n[5] || (n[5] = e("div", { class: "sideTip" }, "预览与场上同一套画法：内层是完整原图的画布，框只裁出其中一块，拖出框外的部分游戏里同样看不到。", -1)),
            n[6] || (n[6] = e("div", { class: "sideTip" }, "可拖范围 = 原图比框多出来的那一截（横图在 `x` 上余量最大）。拖到原图边缘就停住，读数跟着停 ≠ 拖拽失灵。", -1))
          ])
        ], 34)
      ])
    ]));
  }
}, yn = /* @__PURE__ */ q(fn, [["__scopeId", "data-v-943bea5f"]]), $n = {
  key: 0,
  class: "backgroundConfigUI"
}, kn = { class: "container" }, wn = { class: "functionBox" }, Cn = { class: "titleBox" }, bn = { class: "imageBox" }, xn = ["src"], Ln = ["onClick"], Tn = { class: "displayArea" }, Un = {
  __name: "main",
  setup(A, { expose: w }) {
    let p = "./extension/WhichWay/image/ui/painter.png";
    const c = [
      { name: "更新公告", component: Ze, autoLoad: !1 },
      //默认界面,祈求能有更多稿件
      { name: "征稿在前", component: Ks, autoLoad: !0 },
      { name: "更新日志", component: Nt },
      { name: "扩展介绍", component: Me },
      { name: "背景设置", component: $t },
      { name: "配音设置", component: fs },
      { name: "模组切换", component: xs },
      //皮肤位置调整是开发者工具：普通玩家没有调 pos.json 的需求，误拖还会改坏别人的构图设定
      ...oe.isDeveloperMode() ? [{ name: "皮肤位置调整", component: yn }] : []
    ], g = C(""), _ = T(() => {
      const s = c.find((t) => t.name === g.value);
      return s ? s.component : null;
    }), f = C(null), b = async (s) => {
      f.value && (f.value.scrollTop = 0, f.value.style.overflow = ""), g.value = s.name, s.autoLoad && s.onLoad && (await G(), s.onLoad());
    }, L = () => {
      f.value && (f.value.style.overflow = "auto");
    };
    K(async () => {
      const s = c.find((t) => t.autoLoad) || c[0];
      s && (g.value = s.name, s.onLoad && (await G(), s.onLoad()));
    });
    let y = C(!1);
    const $ = () => document.querySelector(".whichWayConfigUIApp"), I = () => {
      y.value = !0;
      const s = $();
      s && (s.style.display = ""), se.pause2();
    }, k = () => {
      y.value = !1;
      const s = $();
      s && (s.style.display = "none"), se.resume2();
    };
    return w({
      show: I,
      hide: k,
      toggle: () => {
        const s = $();
        s && (s.style.display = s.style.display === "none" ? "" : "none"), y.value = !y.value;
      }
    }), (s, t) => R(y) ? (o(), a("div", $n, [
      e("div", kn, [
        e("div", { class: "titleBox" }, [
          e("div", {
            class: "ControlCPClose",
            onClick: k
          }),
          t[0] || (t[0] = e("div", { class: "titleText" }, "文明的存续", -1))
        ]),
        e("div", wn, [
          e("div", Cn, [
            e("div", bn, [
              e("img", { src: R(p) }, null, 8, xn)
            ]),
            t[1] || (t[1] = e("div", { class: "title" }, "功能设置", -1))
          ]),
          (o(), a(W, null, j(c, (l, v) => e("div", {
            key: v,
            class: M(["funcButton", { selectedButton_ConfigUI_SJZX: g.value === l.name }]),
            onClick: (x) => b(l)
          }, m(l.name), 11, Ln)), 64))
        ]),
        e("div", Tn, [
          g.value ? (o(), ye(Te(_.value), {
            key: 0,
            onLoaded: L
          }, null, 32)) : E("", !0)
        ])
      ])
    ])) : E("", !0);
  }
}, In = /* @__PURE__ */ q(Un, [["__scopeId", "data-v-5393be7b"]]);
class Pn {
  constructor() {
    this.app = this.createApp(), this.vueInstance = null, this.mainComponent = null, Ie({
      name: "configUI_system",
      fn: () => {
        Z.create.system("驶舰之向", () => {
          this.show();
        });
      }
    }), Pe({
      name: "configUI_initBackground",
      fn: () => {
        oe.setBgI();
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
    const w = Z.create.div(".whichWayConfigUIApp", document.body);
    return w.style.width = "100%", w.style.height = "100%", w.style.position = "absolute", w.style.top = "0px", w.style.left = "0px", w.style.zIndex = "19", w.style.display = "none", w;
  }
  /**
   * 打开快速配置界面
   */
  show() {
    this.vueInstance || (this.vueInstance = Ue(In), this.mainComponent = this.vueInstance.mount(this.app)), this.mainComponent?.show && this.mainComponent.show();
  }
  toggle() {
    this.mainComponent?.toggle && this.mainComponent.toggle();
  }
  hide() {
    this.mainComponent?.hide && this.mainComponent.hide();
  }
}
const ke = new Pn();
Se({
  name: "whichWayConfigUI_setDev",
  fn: () => {
    window.whichwayConfigUI = ke;
  }
});
window.whichWay.register("configUI", ke);
export {
  ke as whichWayConfigUI
};
