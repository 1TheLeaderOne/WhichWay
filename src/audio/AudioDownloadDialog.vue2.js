import { defineComponent, onMounted, onUnmounted, openBlock, createElementBlock, withModifiers, createElementVNode, createStaticVNode } from "vue";
const _hoisted_1 = { class: "audio-download-dialog" };
const _hoisted_2 = { class: "dialog-content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AudioDownloadDialog",
  props: {
    onSelect: { type: Function },
    onClose: { type: Function }
  },
  emits: ["select", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleClose = () => {
      if (props.onClose) {
        props.onClose();
      } else {
        emit("close");
      }
    };
    const selectMode = (mode) => {
      if (props.onSelect) {
        props.onSelect(mode === "all");
      } else {
        emit("select", mode === "all");
      }
    };
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    onMounted(() => {
      document.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeydown);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "audio-download-dialog-overlay",
        onClick: withModifiers(handleClose, ["self"])
      }, [
        createElementVNode("div", _hoisted_1, [
          createElementVNode("div", { class: "dialog-header" }, [
            createElementVNode("div", {
              class: "dialog-close",
              onClick: handleClose
            }),
            _cache[2] || (_cache[2] = createElementVNode("div", { class: "dialog-title" }, "选择下载模式", -1))
          ]),
          createElementVNode("div", _hoisted_2, [
            createElementVNode("div", {
              class: "option-item",
              onClick: _cache[0] || (_cache[0] = ($event) => selectMode("current"))
            }, [..._cache[3] || (_cache[3] = [
              createStaticVNode('<div class="option-icon current-icon" data-v-3dec52d1><div class="icon-text" data-v-3dec52d1>当</div></div><div class="option-info" data-v-3dec52d1><div class="option-title" data-v-3dec52d1>下载当前语言</div><div class="option-desc" data-v-3dec52d1>仅下载当前选择的配音语言</div></div>', 2)
            ])]),
            createElementVNode("div", {
              class: "option-item",
              onClick: _cache[1] || (_cache[1] = ($event) => selectMode("all"))
            }, [..._cache[4] || (_cache[4] = [
              createStaticVNode('<div class="option-icon all-icon" data-v-3dec52d1><div class="icon-text" data-v-3dec52d1>全</div></div><div class="option-info" data-v-3dec52d1><div class="option-title" data-v-3dec52d1>下载所有可用语言</div><div class="option-desc" data-v-3dec52d1>下载角色的所有配音语言</div></div>', 2)
            ])])
          ])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=AudioDownloadDialog.vue2.js.map
