import { defineComponent, ref, onMounted, openBlock, createElementBlock, createElementVNode, toDisplayString, Fragment, renderList, unref } from "vue";
import { dataManager } from "../../../dataManager/index.js";
import { get } from "noname";
import { whichWayFile } from "../../../file.js";
const _hoisted_1 = { class: "control-container" };
const _hoisted_2 = { class: "title" };
const _hoisted_3 = { class: "item-container" };
const _hoisted_4 = ["onClick"];
const _hoisted_5 = ["src"];
const _hoisted_6 = { class: "item-text" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "control",
  setup(__props) {
    const list = ref([]);
    const prompt = ref("");
    onMounted(() => {
      const pending = dataManager.get("list").map((i) => [
        i[0],
        i[1],
        whichWayFile.compilePath(`img:skill/qushimrfz/${i[0].replace("wangmrfz_", "")}.png`)
      ]);
      list.value = pending;
      prompt.value = dataManager.get("prompt");
    });
    const handleClick = (item) => {
      const key = item[0];
      console.log("点击了:", key);
      dataManager.set("selected", key);
      return key;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, toDisplayString(prompt.value), 1),
        createElementVNode("div", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(list.value, (item, index) => {
            return openBlock(), createElementBlock("div", {
              key: index,
              class: "control-item",
              onClick: ($event) => handleClick(item)
            }, [
              createElementVNode("img", {
                src: item[2],
                class: "item-bg",
                alt: ""
              }, null, 8, _hoisted_5),
              createElementVNode("span", _hoisted_6, toDisplayString(unref(get).translation(item[0])) + " - " + toDisplayString(item[1]), 1)
            ], 8, _hoisted_4);
          }), 128))
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=control.vue2.js.map
