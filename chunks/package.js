import { defineComponent as _, openBlock as h, createElementBlock as d, createElementVNode as t, Fragment as p, renderList as m, toDisplayString as g, createApp as y } from "vue";
import { lib as v, ui as b } from "noname";
import { _ as w } from "./_plugin-vue_export-helper.js";
import { w as L } from "./arknight-arkidMigration-shared.js";
import { onArenaReady as k } from "./hooks.js";
const E = { class: "author-background" }, $ = ["src"], x = { class: "author-name" }, W = ["src"], A = { class: "author-name agent-name" }, S = /* @__PURE__ */ _({
  __name: "author",
  setup(e) {
    const r = `${v.assetURL}extension/WhichWay/image/decoration/`, a = `${v.assetURL}extension/WhichWay/image/logo/`, n = [
      ["TheLeaderOne", `${r}1.jpg`],
      ["圣晴天空", `${r}0.jpg`]
    ], c = [
      ["DeepSeek-v4.1-Flash", `${a}DeepSeek.png`],
      ["Qwen3.8-Flash", `${a}Qwen.png`]
    ], l = `${a}github.png`;
    return (s, o) => (h(), d("div", E, [
      o[1] || (o[1] = t("div", { class: "author-title" }, "作者", -1)),
      (h(), d(p, null, m(n, (i, u) => t("div", {
        key: u,
        class: "author-container"
      }, [
        t("img", {
          src: i[1],
          class: "author-icon",
          alt: ""
        }, null, 8, $),
        t("div", x, g(i[0]), 1)
      ])), 64)),
      o[2] || (o[2] = t("div", { class: "author-title" }, "LLM", -1)),
      (h(), d(p, null, m(c, (i, u) => t("div", {
        key: u,
        class: "author-container"
      }, [
        t("img", {
          src: i[1],
          class: "author-icon",
          alt: ""
        }, null, 8, W),
        t("div", A, g(i[0]), 1)
      ])), 64)),
      t("div", { class: "github-container" }, [
        t("img", {
          src: l,
          class: "github-img",
          alt: ""
        }),
        o[0] || (o[0] = t("div", { class: "github-text" }, "访问本扩展仓库", -1))
      ])
    ]));
  }
}), R = /* @__PURE__ */ w(S, [["__scopeId", "data-v-61952602"]]);
await Promise.resolve({ });
const O = () => {
  const e = {
    character: {
      character: {},
      translate: {}
    },
    card: {
      card: {},
      translate: {},
      list: []
    },
    skill: {
      skill: {},
      translate: {}
    },
    diskURL: "",
    forumURL: ""
  };
  return e.author = T(), e.version = L.ext, e;
};
let f = !1;
function T() {
  const e = document.createElement("div");
  return y(R).mount(e), k({
    name: "whichWayPackage_AuthorCreate_change",
    fn: () => {
      C(
        "whichway-author-layout",
        (r) => {
          if (f) return;
          f = !0;
          const a = r.parentElement.parentElement;
          a.appendChild(r), a.querySelector("span")?.remove();
          const n = r.querySelector(".github-container");
          n ? n.addEventListener("click", () => {
            navigator.clipboard.writeText("https://github.com/1TheLeaderOne/WhichWay"), alert("已复制到剪贴板,请使用浏览器访问,访问可能需要科学上网");
          }) : console.warn("找不到.github-container元素");
        },
        b.menuContainer
      );
    }
  }), `<div class = "whichway-author-layout">${e.innerHTML}</div>`;
}
function C(e, r, a = document.body) {
  const n = new MutationObserver((c) => {
    c.forEach((l) => {
      l.addedNodes.forEach((s) => {
        s.nodeType === 1 && (s.classList.contains(e) && r(s), s.querySelectorAll(`.${e}`).forEach((o) => {
          r(o);
        }));
      });
    });
  });
  return n.observe(a, {
    childList: !0,
    subtree: !0
  }), n;
}
export {
  O as mainPackage
};
