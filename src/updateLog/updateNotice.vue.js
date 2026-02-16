import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch, openBlock, createElementBlock, createElementVNode, toDisplayString, unref, Fragment, renderList, createCommentVNode } from "vue";
import { whichWayVersion } from "../version.js";
/* empty css                  */
import _export_sfc from "../../_virtual/_plugin-vue_export-helper.js";
const _hoisted_1 = { class: "update-notice" };
const _hoisted_2 = { class: "notice-header" };
const _hoisted_3 = { class: "notice-content" };
const _hoisted_4 = { class: "update-section" };
const _hoisted_5 = {
  key: 0,
  class: "update-section"
};
const _hoisted_6 = { class: "intro-list" };
const _hoisted_7 = {
  key: 1,
  class: "update-section"
};
const _hoisted_8 = {
  key: 2,
  class: "update-section"
};
const _hoisted_9 = {
  key: 3,
  class: "empty-state"
};
const _sfc_main = {
  __name: "updateNotice",
  props: {
    info: {
      type: Object,
      required: true,
      default: () => ({ intro: [], player: [], cards: [] })
    },
    onClose: {
      type: Function,
      default: () => {
      }
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    let version = whichWayVersion.ext;
    let over = whichWayVersion.noname.over;
    const props = __props;
    const emit = __emit;
    const playerContainer = ref(null);
    const cardsContainer = ref(null);
    const hasRendered = ref(false);
    const hasContent = computed(() => {
      return props.info.intro?.length || props.info.player?.length || props.info.cards?.length;
    });
    const clearContainer = (containerRef) => {
      const container = containerRef.value;
      if (!container) return;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
    const renderPlayers = () => {
      if (!playerContainer.value || !Array.isArray(props.info.player)) return;
      clearContainer(playerContainer);
      props.info.player.forEach((name) => {
        try {
          if (typeof window?.ui?.create?.buttonPresets?.character !== "function") {
            console.warn(`[UpdateNotice] character API not available for: ${name}`);
            return;
          }
          const btn = window.ui.create.buttonPresets.character(name);
          if (btn?.nodeType === 1) playerContainer.value.appendChild(btn);
        } catch (e) {
          console.error(`渲染干员按钮失败 (${name}):`, e);
        }
      });
    };
    const renderCards = () => {
      if (!cardsContainer.value || !Array.isArray(props.info.cards)) return;
      clearContainer(cardsContainer);
      props.info.cards.forEach((name) => {
        try {
          if (typeof window?.ui?.create?.buttonPresets?.vcard !== "function") {
            console.warn(`[UpdateNotice] vcard API not available for: ${name}`);
            return;
          }
          const btn = window.ui.create.buttonPresets.vcard(name);
          if (btn?.nodeType === 1) cardsContainer.value.appendChild(btn);
        } catch (e) {
          console.error(`渲染卡片按钮失败 (${name}):`, e);
        }
      });
    };
    const handleClose = () => {
      emit("close");
      if (typeof props.onClose === "function") {
        props.onClose();
      }
    };
    onMounted(() => {
      nextTick(() => {
        renderPlayers();
        renderCards();
        hasRendered.value = true;
      });
    });
    onBeforeUnmount(() => {
      clearContainer(playerContainer);
      clearContainer(cardsContainer);
    });
    watch(
      () => props.info.player,
      () => {
        renderPlayers();
      },
      { deep: true }
    );
    watch(
      () => props.info.cards,
      () => {
        renderCards();
      },
      { deep: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("h2", null, "驶舰之向 v" + toDisplayString(unref(version)) + " 更新公告", 1),
          createElementVNode("button", {
            onClick: handleClose,
            class: "close-btn"
          }, "×")
        ]),
        createElementVNode("div", _hoisted_3, [
          createElementVNode("div", _hoisted_4, "最低适配版本: " + toDisplayString(unref(over)), 1),
          __props.info.intro?.length ? (openBlock(), createElementBlock("section", _hoisted_5, [
            _cache[0] || (_cache[0] = createElementVNode("h3", null, "📝 更新概要", -1)),
            createElementVNode("ul", _hoisted_6, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.info.intro, (item, index) => {
                return openBlock(), createElementBlock("li", { key: index }, toDisplayString(item), 1);
              }), 128))
            ])
          ])) : createCommentVNode("", true),
          __props.info.player?.length ? (openBlock(), createElementBlock("section", _hoisted_7, [
            _cache[1] || (_cache[1] = createElementVNode("h3", null, "👥 新增干员", -1)),
            createElementVNode("div", {
              ref_key: "playerContainer",
              ref: playerContainer,
              class: "character-grid"
            }, null, 512)
          ])) : createCommentVNode("", true),
          __props.info.cards?.length ? (openBlock(), createElementBlock("section", _hoisted_8, [
            _cache[2] || (_cache[2] = createElementVNode("h3", null, "🃏 新增卡片", -1)),
            createElementVNode("div", {
              ref_key: "cardsContainer",
              ref: cardsContainer,
              class: "card-grid"
            }, null, 512)
          ])) : createCommentVNode("", true),
          !hasContent.value ? (openBlock(), createElementBlock("div", _hoisted_9, "暂无更新内容")) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const UpdateNotice = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0eb8b0cc"]]);
export {
  UpdateNotice as default
};
//# sourceMappingURL=updateNotice.vue.js.map
