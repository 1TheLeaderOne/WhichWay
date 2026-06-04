import { ref, reactive, onMounted, computed, onUnmounted, openBlock, createElementBlock, createElementVNode, createCommentVNode, withDirectives, vModelText, createTextVNode, toDisplayString, normalizeClass, Fragment, renderList } from "vue";
import * as pinyinPro from "pinyin-pro";
import { lib, game } from "noname";
import { whichWayConfig } from "../../config/index.js";
import { whichWayFile } from "../../file.js";
import { whichWayUtil } from "../../utill.js";
/* empty css                   */
import _export_sfc from "../../../_virtual/_plugin-vue_export-helper.js";
const _hoisted_1 = { class: "background-setting-wrapper" };
const _hoisted_2 = { class: "search-box" };
const _hoisted_3 = { class: "image-box" };
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "bg-section" };
const _hoisted_6 = { class: "bg-title" };
const _hoisted_7 = { class: "highlight" };
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "img-box" };
const _hoisted_10 = ["src", "alt"];
const _hoisted_11 = { class: "title" };
const _hoisted_12 = {
  key: 0,
  class: "current-tag"
};
const _hoisted_13 = { class: "bg-section" };
const _hoisted_14 = { class: "bg-title" };
const _hoisted_15 = { class: "highlight" };
const _hoisted_16 = ["onClick"];
const _hoisted_17 = { class: "img-box" };
const _hoisted_18 = ["src", "alt"];
const _hoisted_19 = { class: "title" };
const _hoisted_20 = {
  key: 0,
  class: "current-tag"
};
const _sfc_main = {
  __name: "backgroundSet",
  emits: ["loaded"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const scrollContainer = ref(null);
    const searchQuery = ref("");
    const watchImageUrl = ref("");
    const extHidden = ref(false);
    const originalHidden = ref(false);
    const backgroundData = reactive({
      original: {},
      ext: {}
    });
    const extUrl = ref("");
    const originalUrl = ref(`${lib.assetURL}image/background/`);
    const currentBackgroundKey = ref("");
    const currentBackgroundType = ref("");
    onMounted(async () => {
      try {
        backgroundData.original = lib.configMenu.appearence.config.image_background.item || {};
        const extResult = whichWayConfig.getBackgroundData();
        backgroundData.ext = extResult || {};
        const extConfig = whichWayConfig.getBackgroundData(null, true);
        extUrl.value = extConfig?.url || "";
        const currentBg = lib.config.ChangeBgI_mrfz || lib.config.image_background;
        currentBackgroundKey.value = currentBg;
        if (Object.keys(backgroundData.ext).includes(currentBg)) {
          currentBackgroundType.value = "ext";
        } else if (Object.keys(backgroundData.original).includes(currentBg)) {
          currentBackgroundType.value = "original";
        }
        watchImageUrl.value = whichWayFile.compilePath("ui:watch.png");
        if (scrollContainer.value) {
          emit("loaded");
        }
      } catch (error) {
        console.error("[BackgroundSetting] 初始化失败:", error);
      }
    });
    const filteredExtBG = computed(() => {
      return filterBackgrounds(backgroundData.ext);
    });
    const filteredOriginalBG = computed(() => {
      return filterBackgrounds(backgroundData.original);
    });
    function filterBackgrounds(bgData) {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) return bgData;
      const result = {};
      for (const [key, name] of Object.entries(bgData)) {
        const isMatch = name.toLowerCase().includes(query);
        if (isMatch) {
          result[key] = name;
          continue;
        }
        try {
          if (typeof pinyinPro !== "undefined") {
            const pinyin = pinyinPro.pinyin(name, {
              type: "array",
              toneType: "none"
            }).join(" ").toLowerCase();
            if (pinyin.includes(query)) {
              result[key] = name;
            }
          }
        } catch (e) {
          console.warn("拼音转换失败:", e);
          return bgData;
        }
      }
      return result;
    }
    function getExtImageUrl(key) {
      return `${extUrl.value}${key}.jpg`;
    }
    function getOriginalImageUrl(key) {
      return `${originalUrl.value}${key}.jpg`;
    }
    function isCurrent(key, type) {
      return currentBackgroundKey.value === key && currentBackgroundType.value === type;
    }
    function selectBackground(key, type) {
      if (isCurrent(key, type)) {
        return;
      }
      currentBackgroundKey.value = key;
      currentBackgroundType.value = type;
      if (type === "ext") {
        game.saveConfig("ChangeBgI_mrfz", key);
        whichWayUtil.setBgI();
      } else {
        game.saveConfig("ChangeBgI_mrfz", void 0);
        whichWayUtil.setBgI();
        lib.configMenu.appearence.config.image_background.onclick(key);
      }
    }
    function toggleExtHidden() {
      extHidden.value = !extHidden.value;
    }
    function toggleOriginalHidden() {
      originalHidden.value = !originalHidden.value;
    }
    onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", _hoisted_3, [
            watchImageUrl.value ? (openBlock(), createElementBlock("img", {
              key: 0,
              src: watchImageUrl.value,
              alt: "搜索图标"
            }, null, 8, _hoisted_4)) : createCommentVNode("", true)
          ]),
          withDirectives(createElementVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
            type: "text",
            class: "search-input",
            placeholder: "支持中文和拼音搜索~"
          }, null, 512), [
            [vModelText, searchQuery.value]
          ])
        ]),
        createElementVNode("div", {
          ref_key: "scrollContainer",
          ref: scrollContainer,
          class: "scroll-container"
        }, [
          createElementVNode("div", _hoisted_5, [
            createElementVNode("div", _hoisted_6, [
              _cache[3] || (_cache[3] = createTextVNode(" 驶舰之向扩展背景 ", -1)),
              createElementVNode("span", {
                class: "hidden-button",
                onClick: toggleExtHidden
              }, [
                _cache[1] || (_cache[1] = createTextVNode(" [", -1)),
                createElementVNode("span", _hoisted_7, toDisplayString(extHidden.value ? "展示" : "隐藏"), 1),
                _cache[2] || (_cache[2] = createTextVNode("] ", -1))
              ])
            ]),
            createElementVNode("div", {
              class: normalizeClass(["bg-container", { "hidden-sjzx": extHidden.value }])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filteredExtBG.value, (name, key) => {
                return openBlock(), createElementBlock("div", {
                  key: `ext-${key}`,
                  class: normalizeClass(["bg-box", { "current-bg": isCurrent(key, "ext") }]),
                  onClick: ($event) => selectBackground(key, "ext")
                }, [
                  createElementVNode("div", _hoisted_9, [
                    createElementVNode("img", {
                      src: getExtImageUrl(key),
                      alt: name
                    }, null, 8, _hoisted_10)
                  ]),
                  createElementVNode("div", _hoisted_11, [
                    createTextVNode(toDisplayString(name) + " ", 1),
                    isCurrent(key, "ext") ? (openBlock(), createElementBlock("span", _hoisted_12, "(当前背景)")) : createCommentVNode("", true)
                  ])
                ], 10, _hoisted_8);
              }), 128))
            ], 2)
          ]),
          createElementVNode("div", _hoisted_13, [
            createElementVNode("div", _hoisted_14, [
              _cache[6] || (_cache[6] = createTextVNode(" 无名杀自带背景 ", -1)),
              createElementVNode("span", {
                class: "hidden-button",
                onClick: toggleOriginalHidden
              }, [
                _cache[4] || (_cache[4] = createTextVNode(" [", -1)),
                createElementVNode("span", _hoisted_15, toDisplayString(originalHidden.value ? "展示" : "隐藏"), 1),
                _cache[5] || (_cache[5] = createTextVNode("] ", -1))
              ])
            ]),
            createElementVNode("div", {
              class: normalizeClass(["bg-container", { "hidden-sjzx": originalHidden.value }])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filteredOriginalBG.value, (name, key) => {
                return openBlock(), createElementBlock("div", {
                  key: `original-${key}`,
                  class: normalizeClass(["bg-box", { "current-bg": isCurrent(key, "original") }]),
                  onClick: ($event) => selectBackground(key, "original")
                }, [
                  createElementVNode("div", _hoisted_17, [
                    createElementVNode("img", {
                      src: getOriginalImageUrl(key),
                      alt: name
                    }, null, 8, _hoisted_18)
                  ]),
                  createElementVNode("div", _hoisted_19, [
                    createTextVNode(toDisplayString(name) + " ", 1),
                    isCurrent(key, "original") ? (openBlock(), createElementBlock("span", _hoisted_20, "(当前背景)")) : createCommentVNode("", true)
                  ])
                ], 10, _hoisted_16);
              }), 128))
            ], 2)
          ])
        ], 512)
      ]);
    };
  }
};
const BackgroundSet = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b56c40f0"]]);
export {
  BackgroundSet as default
};
//# sourceMappingURL=backgroundSet.vue.js.map
