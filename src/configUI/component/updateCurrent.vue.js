import { ref, onMounted, onUnmounted, openBlock, createElementBlock, createElementVNode, toDisplayString, Fragment, renderList, unref, createCommentVNode } from "vue";
import { ui } from "noname";
import { whichWayVersion } from "../../version.js";
import { whichWayUpdateLog } from "../../updateLog/index.js";
import { whichWayCharacterCard } from "../../characterCard/index.js";
/* empty css                   */
import _export_sfc from "../../../_virtual/_plugin-vue_export-helper.js";
const _hoisted_1 = { class: "updateCurrent" };
const _hoisted_2 = { class: "UpdateCurrentTitle" };
const _hoisted_3 = { class: "UpdateCurrentOverVersion" };
const _hoisted_4 = { class: "UpdateCurrentContent" };
const _hoisted_5 = ["innerHTML"];
const _hoisted_6 = {
  key: 0,
  class: "UpdateCurrentOther"
};
const _hoisted_7 = {
  key: 1,
  class: "UpdateCurrentOther"
};
const _sfc_main = {
  __name: "updateCurrent",
  setup(__props) {
    const version = ref(whichWayVersion.ext);
    const over = ref(whichWayVersion.noname.over);
    const updateData = whichWayUpdateLog.currentLog;
    const playerContainerRef = ref(null);
    const cardContainerRef = ref(null);
    const createdElements = ref([]);
    const createCharacterButtons = () => {
      if (!playerContainerRef.value || !ui?.create?.buttonPresets?.character) return;
      playerContainerRef.value.innerHTML = "";
      updateData.player.forEach((name) => {
        try {
          const character = ui.create.buttonPresets.character(name, "player");
          character.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            whichWayCharacterCard.create(name);
          });
          playerContainerRef.value.appendChild(character);
          createdElements.value.push(character);
        } catch (error) {
          console.error(`创建角色 ${name} 失败:`, error);
        }
      });
    };
    const createCardButtons = () => {
      if (!cardContainerRef.value || !ui?.create?.buttonPresets?.vcard) return;
      cardContainerRef.value.innerHTML = "";
      updateData.cards.forEach((name) => {
        try {
          const card = ui.create.buttonPresets.vcard(name, "card");
          cardContainerRef.value.appendChild(card);
          createdElements.value.push(card);
        } catch (error) {
          console.error(`创建卡片 ${name} 失败:`, error);
        }
      });
    };
    const cleanupElements = () => {
      createdElements.value.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      createdElements.value = [];
    };
    onMounted(() => {
      createCharacterButtons();
      createCardButtons();
    });
    onUnmounted(() => {
      cleanupElements();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, "驶舰之向 v" + toDisplayString(version.value) + "更新内容", 1),
        createElementVNode("div", _hoisted_3, "最低适配版本: " + toDisplayString(over.value), 1),
        createElementVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(updateData).intro, (str, index) => {
            return openBlock(), createElementBlock("p", {
              key: `intro-${index}`,
              innerHTML: str
            }, null, 8, _hoisted_5);
          }), 128))
        ]),
        unref(updateData).player && unref(updateData).player.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [
          _cache[0] || (_cache[0] = createElementVNode("div", { class: "section-title" }, "新增干员", -1)),
          createElementVNode("div", {
            ref_key: "playerContainerRef",
            ref: playerContainerRef,
            class: "character-container"
          }, null, 512)
        ])) : createCommentVNode("", true),
        unref(updateData).cards && unref(updateData).cards.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_7, [
          _cache[1] || (_cache[1] = createElementVNode("div", { class: "section-title" }, "新增卡牌", -1)),
          createElementVNode("div", {
            ref_key: "cardContainerRef",
            ref: cardContainerRef,
            class: "card-container"
          }, null, 512)
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const UpdateCurrent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4234df41"]]);
export {
  UpdateCurrent as default
};
//# sourceMappingURL=updateCurrent.vue.js.map
