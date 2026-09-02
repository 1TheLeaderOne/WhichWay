import { ref, computed, onMounted, onUnmounted, openBlock, createElementBlock, createElementVNode, createCommentVNode, withDirectives, vModelText, Fragment, renderList, normalizeClass, toDisplayString, vShow } from "vue";
import { whichWayUpdateLog } from "../../updateLog/index.js";
import { whichWayFile } from "../../file.js";
/* empty css               */
import _export_sfc from "../../../_virtual/_plugin-vue_export-helper.js";
const _hoisted_1 = { class: "update-log-wrapper" };
const _hoisted_2 = { class: "search-box" };
const _hoisted_3 = { class: "image-box" };
const _hoisted_4 = ["src"];
const _hoisted_5 = {
  key: 0,
  class: "welcome-section"
};
const _hoisted_6 = ["innerHTML"];
const _hoisted_7 = { class: "version-list" };
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "version-info" };
const _hoisted_10 = { class: "version-number" };
const _hoisted_11 = { class: "version-date" };
const _hoisted_12 = { class: "version-toggle" };
const _hoisted_13 = { class: "toggle-icon" };
const _hoisted_14 = { class: "update-count" };
const _hoisted_15 = { class: "version-content" };
const _hoisted_16 = { class: "update-items" };
const _hoisted_17 = ["innerHTML"];
const _hoisted_18 = {
  key: 0,
  class: "no-results"
};
const _sfc_main = {
  __name: "updateLog",
  emits: ["loaded"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const scrollContainer = ref(null);
    const searchQuery = ref("");
    const searchIconUrl = ref("");
    const welcomeMessage = ref("");
    const versions = ref([]);
    const filteredVersions = computed(() => {
      if (!searchQuery.value.trim()) {
        return versions.value;
      }
      const query = searchQuery.value.trim().toLowerCase();
      return versions.value.filter((version) => {
        if (version.version.toLowerCase().includes(query)) {
          return true;
        }
        if (version.date.toLowerCase().includes(query)) {
          return true;
        }
        return version.items.some((item) => {
          const text = item.replace(/<[^>]*>/g, "").toLowerCase();
          return text.includes(query);
        });
      });
    });
    function parseUpdateLog(logText) {
      if (!logText) {
        console.warn("[UpdateLog] 更新日志为空");
        return;
      }
      try {
        const cleanText = logText.replace(/<pre[^>]*>/g, "").replace(/<\/pre>/g, "").trim();
        const lines = cleanText.split("\n").map((line) => line.trim());
        const welcomeLines = [];
        let versionStartIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (/^\d{4}\.\d{1,2}\.\d{1,2}\s+v\d+\.\d+/.test(lines[i])) {
            versionStartIndex = i;
            break;
          }
          if (lines[i]) {
            welcomeLines.push(lines[i]);
          }
        }
        if (welcomeLines.length > 0) {
          welcomeMessage.value = welcomeLines.join("<br>");
        }
        const versionList = [];
        let currentVersion = null;
        for (let i = versionStartIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          const versionMatch = line.match(/^(\d{4}\.\d{1,2}\.\d{1,2})\s+(v\d+\.\d+(?:\.\d+)?)/);
          if (versionMatch) {
            if (currentVersion) {
              versionList.push(currentVersion);
            }
            currentVersion = {
              id: `v${versionList.length + 1}`,
              date: versionMatch[1],
              version: versionMatch[2],
              items: [],
              collapsed: versionList.length > 2
              // 默认折叠较旧的版本
            };
            continue;
          }
          if (currentVersion && line) {
            let item = line.replace(/^"/, "").replace(/",?$/, "").trim();
            if (item) {
              currentVersion.items.push(item);
            }
          }
        }
        if (currentVersion) {
          versionList.push(currentVersion);
        }
        versions.value = versionList;
        console.log("[UpdateLog] 已解析", versionList.length, "个版本");
      } catch (error) {
        console.error("[UpdateLog] 解析更新日志失败:", error);
      }
    }
    function formatUpdateItem(item) {
      item = item.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const highlightPatterns = [
        { pattern: /新增(干员|皮肤|动态皮肤|背景|成就|模组|功能|模式)/g, class: "keyword-add" },
        { pattern: /调整(技能|武将)/g, class: "keyword-modify" },
        { pattern: /修复.*?的bug/g, class: "keyword-fix" },
        { pattern: /优化.*?/g, class: "keyword-optimize" },
        { pattern: /删除.*?/g, class: "keyword-remove" }
      ];
      let result = item;
      highlightPatterns.forEach(({ pattern, class: className }) => {
        result = result.replace(pattern, (match) => {
          return `<span class="${className}">${match}</span>`;
        });
      });
      return result;
    }
    function toggleVersion(version) {
      version.collapsed = !version.collapsed;
    }
    onMounted(async () => {
      try {
        if (whichWayUpdateLog.updateLog) {
          parseUpdateLog(whichWayUpdateLog.updateLog);
        } else {
          console.warn("[UpdateLog] 未找到更新日志数据");
        }
        searchIconUrl.value = whichWayFile.compilePath("ui:watch.png");
        if (scrollContainer.value) {
          emit("loaded");
        }
      } catch (error) {
        console.error("[UpdateLog] 初始化失败:", error);
      }
    });
    onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", _hoisted_3, [
            searchIconUrl.value ? (openBlock(), createElementBlock("img", {
              key: 0,
              src: searchIconUrl.value,
              alt: "搜索图标"
            }, null, 8, _hoisted_4)) : createCommentVNode("", true)
          ]),
          withDirectives(createElementVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
            type: "text",
            class: "search-input",
            placeholder: "搜索版本号、日期或更新内容..."
          }, null, 512), [
            [vModelText, searchQuery.value]
          ])
        ]),
        createElementVNode("div", {
          ref_key: "scrollContainer",
          ref: scrollContainer,
          class: "scroll-container"
        }, [
          welcomeMessage.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
            createElementVNode("div", {
              class: "welcome-content",
              innerHTML: welcomeMessage.value
            }, null, 8, _hoisted_6)
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_7, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(filteredVersions.value, (version, index) => {
              return openBlock(), createElementBlock("div", {
                key: version.id,
                class: normalizeClass(["version-card", { collapsed: version.collapsed }])
              }, [
                createElementVNode("div", {
                  class: "version-header",
                  onClick: ($event) => toggleVersion(version)
                }, [
                  createElementVNode("div", _hoisted_9, [
                    createElementVNode("span", _hoisted_10, toDisplayString(version.version), 1),
                    createElementVNode("span", _hoisted_11, toDisplayString(version.date), 1)
                  ]),
                  createElementVNode("div", _hoisted_12, [
                    createElementVNode("span", _hoisted_13, toDisplayString(version.collapsed ? "▶" : "▼"), 1),
                    createElementVNode("span", _hoisted_14, toDisplayString(version.items.length) + " 项更新", 1)
                  ])
                ], 8, _hoisted_8),
                withDirectives(createElementVNode("div", _hoisted_15, [
                  createElementVNode("ul", _hoisted_16, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(version.items, (item, itemIndex) => {
                      return openBlock(), createElementBlock("li", {
                        key: itemIndex,
                        class: "update-item",
                        innerHTML: formatUpdateItem(item)
                      }, null, 8, _hoisted_17);
                    }), 128))
                  ])
                ], 512), [
                  [vShow, !version.collapsed]
                ])
              ], 2);
            }), 128)),
            filteredVersions.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_18, [..._cache[1] || (_cache[1] = [
              createElementVNode("div", { class: "no-results-icon" }, "🔍", -1),
              createElementVNode("div", { class: "no-results-text" }, "没有找到匹配的更新记录", -1)
            ])])) : createCommentVNode("", true)
          ])
        ], 512)
      ]);
    };
  }
};
const UpdateLog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b99f319e"]]);
export {
  UpdateLog as default
};
