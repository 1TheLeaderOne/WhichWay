import { defineComponent, reactive, openBlock, createElementBlock, createElementVNode, unref, Fragment, renderList, toDisplayString, withDirectives, normalizeClass } from "vue";
import { lib } from "noname";
import { whichWayFile } from "../file.js";
import { whichWaySkin } from "./index.js";
const _hoisted_1 = { class: "conf-override" };
const _hoisted_2 = { class: "config-container" };
const _hoisted_3 = { class: "title-container" };
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "confilct-card-container" };
const _hoisted_6 = { class: "card-title" };
const _hoisted_7 = { class: "card-content" };
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "skin-container" };
const _hoisted_10 = ["src"];
const _hoisted_11 = { class: "intro-container" };
const _hoisted_12 = { class: "skin-item" };
const _hoisted_13 = { class: "from-item" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "confOverride",
  setup(__props) {
    const IMG_SKIN = whichWayFile.compilePath("ui:skin.png");
    const confictedSkin = whichWaySkin.confictedSkins.data;
    const selectedSkins = reactive({});
    function initSelections() {
      Object.keys(confictedSkin).forEach((cardTitle) => {
        if (confictedSkin[cardTitle].length > 0) {
          selectedSkins[cardTitle] = whichWaySkin.confictedSkins.selected[cardTitle] || confictedSkin[cardTitle][0].skin;
        }
      });
    }
    function isSelected(cardTitle, skin) {
      return selectedSkins[cardTitle] === skin;
    }
    function selectSkin(cardTitle, skin) {
      selectedSkins[cardTitle] = skin;
      console.log(`已选择 ${cardTitle} 的皮肤: ${skin}`);
    }
    function applySelections() {
      whichWaySkin.confictedSkins.selected = selectedSkins;
      const overlay = document.querySelector(".conflictedSkinOverlay-whichWaySkin.whichWayOverlay");
      overlay && overlay.remove();
      if (whichWaySkin.pendingReslove["showConflictedSkin"]) {
        whichWaySkin.pendingReslove["showConflictedSkin"](true);
        whichWaySkin.pendingReslove["showConflictedSkin"] = null;
      }
    }
    function resetSelections() {
      initSelections();
    }
    initSelections();
    const fromTranslate = {
      noname: "无名杀",
      whichWay: "驶舰之向",
      qhly: "千幻聆音"
    };
    function translate(name) {
      if (fromTranslate[name]) return fromTranslate[name];
      if (lib.translate[name]) return lib.translate[name];
      return name;
    }
    const vHorizontalScroll = {
      mounted(el) {
        const handleWheel = (e) => {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        };
        el.addEventListener("wheel", handleWheel, { passive: false });
        el._handleWheel = handleWheel;
      },
      unmounted(el) {
        const handler = el._handleWheel;
        if (handler) {
          el.removeEventListener("wheel", handler);
          el._handleWheel = null;
        }
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", _hoisted_3, [
            createElementVNode("img", { src: unref(IMG_SKIN) }, null, 8, _hoisted_4),
            _cache[0] || (_cache[0] = createElementVNode("div", { class: "title" }, "皮肤配置冲突", -1))
          ]),
          createElementVNode("div", _hoisted_5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(confictedSkin), (items, cardTitle) => {
              return openBlock(), createElementBlock("div", {
                key: cardTitle,
                class: "confilct-card"
              }, [
                createElementVNode("div", _hoisted_6, toDisplayString(translate(cardTitle)), 1),
                withDirectives((openBlock(), createElementBlock("div", _hoisted_7, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(items, (item, index) => {
                    return openBlock(), createElementBlock("div", {
                      key: `${cardTitle}-${index}`,
                      class: normalizeClass(["item-content", { "selected": isSelected(cardTitle, item.skin) }]),
                      onClick: ($event) => selectSkin(cardTitle, item.skin)
                    }, [
                      createElementVNode("div", _hoisted_9, [
                        createElementVNode("img", {
                          src: unref(whichWaySkin).getCharacterSkin(cardTitle, item.skin)?.path
                        }, null, 8, _hoisted_10)
                      ]),
                      createElementVNode("div", _hoisted_11, [
                        createElementVNode("span", _hoisted_12, toDisplayString(unref(whichWayFile).removeExt(item.skin)), 1),
                        createElementVNode("span", _hoisted_13, toDisplayString(translate(item.from)), 1)
                      ])
                    ], 10, _hoisted_8);
                  }), 128))
                ])), [
                  [vHorizontalScroll]
                ])
              ]);
            }), 128))
          ])
        ]),
        createElementVNode("div", { class: "quick-container" }, [
          createElementVNode("button", {
            class: "apply-btn",
            onClick: applySelections
          }, "应用选择"),
          createElementVNode("button", {
            class: "reset-btn",
            onClick: resetSelections
          }, "重置")
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=confOverride.vue2.js.map
