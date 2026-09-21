import { defineComponent as d, openBlock as u, createElementBlock as h, createElementVNode as o, Fragment as m, renderList as p, toDisplayString as g, createApp as f } from "vue";
import { lib as b, ui as v } from "noname";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { w as _ } from "./version-shared-BUx8npJy.js";
import { onArenaReady as w } from "./hooks-BscfO9lD.js";
const L = { class: "author-background" }, k = ["src"], E = { class: "author-name" }, x = /* @__PURE__ */ d({
  __name: "author",
  setup(t) {
    const e = `${b.assetURL}extension/WhichWay/image/decoration/`, n = [
      ["TheLeaderOne", `${e}1.jpg`],
      ["圣晴天空", `${e}0.jpg`]
    ], r = `${e}github.png`;
    return (c, i) => (u(), h("div", L, [
      i[1] || (i[1] = o("div", { class: "author-title" }, "作者", -1)),
      (u(), h(m, null, p(n, (a, s) => o("div", {
        key: s,
        class: "author-container"
      }, [
        o("img", {
          src: a[1],
          class: "author-icon",
          alt: ""
        }, null, 8, k),
        o("div", E, g(a[0]), 1)
      ])), 64)),
      o("div", { class: "github-container" }, [
        o("img", {
          src: r,
          class: "github-img",
          alt: ""
        }),
        i[0] || (i[0] = o("div", { class: "github-text" }, "访问本扩展仓库", -1))
      ])
    ]));
  }
}), A = /* @__PURE__ */ y(x, [["__scopeId", "data-v-abff5b72"]]);
await Promise.resolve({          });
const O = () => {
  const t = {
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
  return t.author = W(), t.version = _.ext, t;
};
let l = !1;
function W() {
  const t = document.createElement("div");
  return f(A).mount(t), w({
    name: "whichWayPackage_AuthorCreate_change",
    fn: () => {
      $(
        "whichway-author-layout",
        (e) => {
          if (l) return;
          l = !0;
          const n = e.parentElement.parentElement;
          n.appendChild(e), n.querySelector("span")?.remove();
          const r = e.querySelector(".github-container");
          r ? r.addEventListener("click", () => {
            navigator.clipboard.writeText("https://github.com/1TheLeaderOne/WhichWay"), alert("已复制到剪贴板,请使用浏览器访问,访问可能需要科学上网");
          }) : console.warn("找不到.github-container元素");
        },
        v.menuContainer
      );
    }
  }), `<div class = "whichway-author-layout">${t.innerHTML}</div>`;
}
function $(t, e, n = document.body) {
  const r = new MutationObserver((c) => {
    c.forEach((i) => {
      i.addedNodes.forEach((a) => {
        a.nodeType === 1 && (a.classList.contains(t) && e(a), a.querySelectorAll(`.${t}`).forEach((s) => {
          e(s);
        }));
      });
    });
  });
  return r.observe(n, {
    childList: !0,
    subtree: !0
  }), r;
}
export {
  O as mainPackage
};
