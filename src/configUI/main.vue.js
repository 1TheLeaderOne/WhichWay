import { ref, computed, onMounted, nextTick, unref, openBlock, createElementBlock, createElementVNode, Fragment, renderList, normalizeClass, toDisplayString, createBlock, resolveDynamicComponent, createCommentVNode } from "vue";
import { game } from "noname";
import UpdateCurrent from "./component/updateCurrent.vue.js";
import ExtIntro from "../config/extIntro.vue.js";
import BackgroundSet from "./component/backgroundSet.vue.js";
import UpdateLog from "./component/updateLog.vue.js";
/* empty css          */
import _export_sfc from "../../_virtual/_plugin-vue_export-helper.js";
const _hoisted_1 = {
  key: 0,
  class: "backgroundConfigUI"
};
const _hoisted_2 = { class: "container" };
const _hoisted_3 = { class: "functionBox" };
const _hoisted_4 = { class: "titleBox" };
const _hoisted_5 = { class: "imageBox" };
const _hoisted_6 = ["src"];
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "displayArea" };
const _sfc_main = {
  __name: "main",
  setup(__props, { expose: __expose }) {
    let imgTitleSrc = "./extension/WhichWay/image/ui/painter.png";
    const panels = [
      { name: "更新公告", component: UpdateCurrent, autoLoad: true },
      { name: "更新日志", component: UpdateLog },
      { name: "扩展介绍", component: ExtIntro },
      { name: "背景设置", component: BackgroundSet }
    ];
    const currentPanel = ref("");
    const currentComponent = computed(() => {
      const panel = panels.find((p) => p.name === currentPanel.value);
      return panel ? panel.component : null;
    });
    const displayAreaRef = ref(null);
    const selectPanel = async (panel) => {
      if (displayAreaRef.value) {
        displayAreaRef.value.scrollTop = 0;
        displayAreaRef.value.style.overflow = "";
      }
      currentPanel.value = panel.name;
      if (panel.autoLoad && panel.onLoad) {
        await nextTick();
        panel.onLoad();
      }
    };
    const handleContentLoaded = () => {
      if (displayAreaRef.value) {
        displayAreaRef.value.style.overflow = "auto";
      }
    };
    onMounted(async () => {
      if (panels[0]) {
        currentPanel.value = panels[0].name;
        const autoLoadPanel = panels.find((p) => p.autoLoad);
        if (autoLoadPanel) {
          await nextTick();
          if (autoLoadPanel.onLoad) {
            autoLoadPanel.onLoad();
          }
        }
      }
    });
    let configUIVisible = ref(false);
    const getCurrentEl = () => {
      return document.querySelector(".whichWayConfigUIApp");
    };
    const show = () => {
      configUIVisible.value = true;
      const el = getCurrentEl();
      if (el) {
        el.style.display = "";
      }
      game.pause2();
    };
    const hide = () => {
      configUIVisible.value = false;
      const el = getCurrentEl();
      if (el) {
        el.style.display = "none";
      }
      game.resume2();
    };
    const toggle = () => {
      const el = getCurrentEl();
      if (el) {
        el.style.display = el.style.display === "none" ? "" : "none";
      }
      configUIVisible.value = !configUIVisible.value;
    };
    __expose({
      show,
      hide,
      toggle
    });
    return (_ctx, _cache) => {
      return unref(configUIVisible) ? (openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", { class: "titleBox" }, [
            createElementVNode("div", {
              class: "ControlCPClose",
              onClick: hide
            }),
            _cache[0] || (_cache[0] = createElementVNode("div", { class: "titleText" }, "文明的存续", -1))
          ]),
          createElementVNode("div", _hoisted_3, [
            createElementVNode("div", _hoisted_4, [
              createElementVNode("div", _hoisted_5, [
                createElementVNode("img", { src: unref(imgTitleSrc) }, null, 8, _hoisted_6)
              ]),
              _cache[1] || (_cache[1] = createElementVNode("div", { class: "title" }, "功能设置", -1))
            ]),
            (openBlock(), createElementBlock(Fragment, null, renderList(panels, (panel, index) => {
              return createElementVNode("div", {
                key: index,
                class: normalizeClass(["funcButton", { selectedButton_ConfigUI_SJZX: currentPanel.value === panel.name }]),
                onClick: ($event) => selectPanel(panel)
              }, toDisplayString(panel.name), 11, _hoisted_7);
            }), 64))
          ]),
          createElementVNode("div", _hoisted_8, [
            currentPanel.value ? (openBlock(), createBlock(resolveDynamicComponent(currentComponent.value), {
              key: 0,
              onLoaded: handleContentLoaded
            }, null, 32)) : createCommentVNode("", true)
          ])
        ])
      ])) : createCommentVNode("", true);
    };
  }
};
const Main = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-320292cc"]]);
export {
  Main as default
};
//# sourceMappingURL=main.vue.js.map
