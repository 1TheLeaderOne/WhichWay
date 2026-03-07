import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, toDisplayString } from "vue";
import { lib } from "noname";
const _hoisted_1 = { class: "author-background" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "author-name" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "author",
  setup(__props) {
    const path = `${lib.assetURL}extension/WhichWay/image/decoration/`;
    const authors = [
      ["TheLeaderOne", `${path}1.jpg`],
      ["圣晴天空", `${path}0.jpg`]
    ];
    const githubLogo = `${path}github.png`;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[1] || (_cache[1] = createElementVNode("div", { class: "author-title" }, "作者", -1)),
        (openBlock(), createElementBlock(Fragment, null, renderList(authors, (item, index) => {
          return createElementVNode("div", {
            key: index,
            class: "author-container"
          }, [
            createElementVNode("img", {
              src: item[1],
              class: "author-icon",
              alt: ""
            }, null, 8, _hoisted_2),
            createElementVNode("div", _hoisted_3, toDisplayString(item[0]), 1)
          ]);
        }), 64)),
        createElementVNode("div", { class: "github-container" }, [
          createElementVNode("img", {
            src: githubLogo,
            class: "github-img",
            alt: ""
          }),
          _cache[0] || (_cache[0] = createElementVNode("div", { class: "github-text" }, "访问本扩展仓库", -1))
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=author.vue2.js.map
