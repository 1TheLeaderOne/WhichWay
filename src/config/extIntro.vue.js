import { computed, openBlock, createElementBlock, createElementVNode, createStaticVNode, Fragment, renderList, toDisplayString, createTextVNode } from "vue";
import { whichWayFile } from "../file.js";
import { whichWayConfigData } from "./data.js";
/* empty css              */
import _export_sfc from "../../_virtual/_plugin-vue_export-helper.js";
const _hoisted_1 = { class: "whichWay-intro" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "voice-list" };
const _hoisted_4 = { class: "voice-list" };
const _hoisted_5 = { class: "custom" };
const _hoisted_6 = ["src"];
const _hoisted_7 = { class: "custom" };
const _hoisted_8 = ["src"];
const prtsUrl = "https://prts.wiki/";
const _sfc_main = {
  __name: "extIntro",
  setup(__props) {
    const designers = computed(() => whichWayConfigData.thanks.designer);
    const specials = computed(() => whichWayConfigData.thanks.special);
    const ASSET_BASE = computed(() => whichWayFile.compilePath("dec:"));
    const getImageUrl = (filename) => `${ASSET_BASE.value}/${filename}`;
    const copyText = (content) => {
      if (typeof content !== "string") {
        alert("❌ 复制失败：内容必须是文本");
        return;
      }
      content = content.trim();
      if (!content) {
        alert("❌ 复制失败：内容为空");
        return;
      }
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          navigator.clipboard.writeText(content).then(
            () => alert("✅ 已复制"),
            (err) => {
              console.error("Clipboard API 失败:", err);
              fallbackCopy(content);
            }
          );
          return;
        }
        fallbackCopy(content);
      } catch (err) {
        console.error("复制过程出错:", err);
        fallbackCopy(content);
      }
    };
    function fallbackCopy(content) {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.cssText = "position:absolute;left:-9999px;top:-9999px;";
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, content.length);
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (success) {
        alert("✅ 已复制");
      } else {
        alert("❌ 复制失败，请手动选择并复制");
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("img", {
          src: getImageUrl("SJZX.jpg"),
          alt: "扩展封面",
          class: "main-image"
        }, null, 8, _hoisted_2),
        _cache[5] || (_cache[5] = createStaticVNode('<div class="section-title" data-v-ea1d3cff><span class="title-arrow" data-v-ea1d3cff>←←</span><span class="title-text" data-v-ea1d3cff>扩展介绍</span><span class="title-arrow" data-v-ea1d3cff>→→</span></div><p data-v-ea1d3cff>本扩展主要由<span class="highlight" data-v-ea1d3cff>林登万</span>制作，武将技能设计主要由<span class="highlight" data-v-ea1d3cff>林登万</span>和<span class="highlight" data-v-ea1d3cff>圣晴天空</span>提供。</p><div class="section-title" data-v-ea1d3cff><span class="title-arrow" data-v-ea1d3cff>←←</span><span class="title-text" data-v-ea1d3cff>感谢名单</span><span class="title-arrow" data-v-ea1d3cff>→→</span></div><p data-v-ea1d3cff>感谢以下干员设计者对本扩展的支持：</p>', 4)),
        createElementVNode("ul", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(designers.value, (name) => {
            return openBlock(), createElementBlock("li", {
              key: `${name}`
            }, toDisplayString(name), 1);
          }), 128))
        ]),
        _cache[6] || (_cache[6] = createElementVNode("p", null, "感谢以下人员对本扩展的支持：", -1)),
        createElementVNode("ul", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(specials.value, (name) => {
            return openBlock(), createElementBlock("li", {
              key: `${name}`
            }, toDisplayString(name), 1);
          }), 128))
        ]),
        _cache[7] || (_cache[7] = createElementVNode("div", { class: "section-title" }, [
          createElementVNode("span", { class: "title-arrow" }, "←←"),
          createElementVNode("span", { class: "title-text" }, "资料来源"),
          createElementVNode("span", { class: "title-arrow" }, "→→")
        ], -1)),
        createElementVNode("p", null, [
          _cache[2] || (_cache[2] = createTextVNode(" 干员介绍和势力均参考 PRTS，大部分干员语言也来自 PRTS： ", -1)),
          createElementVNode("a", {
            href: prtsUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "link"
          }, toDisplayString(prtsUrl))
        ]),
        _cache[8] || (_cache[8] = createStaticVNode('<p data-v-ea1d3cff>少部分干员（主要是剧情角色）配音使用 B 站 UP 主配音或 AI 合成：</p><ul class="voice-list" data-v-ea1d3cff><li data-v-ea1d3cff> 保存者、克丽斯腾： <a href="https://www.bilibili.com/video/BV1Yh411L72H" target="_blank" rel="noopener noreferrer" class="link" data-v-ea1d3cff> BV1Yh411L72H </a></li><li data-v-ea1d3cff> AI 配音（GPT-SoVITS）： <ul class="sub-list" data-v-ea1d3cff><li data-v-ea1d3cff>特雷西斯（音源：赫德雷、赫拉格）</li><li data-v-ea1d3cff>特蕾西娅（音源：黍、九色鹿）</li><li data-v-ea1d3cff>普瑞赛斯（音源：魔王、黍）</li><li data-v-ea1d3cff>特蕾西娅 &amp; 特雷西斯（音源：赫德雷、赫拉格、黍、九色鹿）</li></ul></li><li data-v-ea1d3cff> ACE： <span class="highlight" data-v-ea1d3cff>明日方舟：黎明前奏</span></li></ul><div class="section-title" data-v-ea1d3cff><span class="title-arrow" data-v-ea1d3cff>←←</span><span class="title-text" data-v-ea1d3cff>资源下载与 BUG 反馈</span><span class="title-arrow" data-v-ea1d3cff>→→</span></div>', 3)),
        createElementVNode("div", _hoisted_5, [
          _cache[3] || (_cache[3] = createTextVNode(" 反馈 bug、提供意见或资源下载可以加 QQ 群： ", -1)),
          createElementVNode("span", {
            class: "copyable link",
            onClick: _cache[0] || (_cache[0] = ($event) => copyText("104537053"))
          }, " 104537053（点击复制群号） ")
        ]),
        createElementVNode("img", {
          src: getImageUrl("qq1.jpg"),
          alt: "QQ群二维码",
          class: "qr-code"
        }, null, 8, _hoisted_6),
        createElementVNode("div", _hoisted_7, [
          _cache[4] || (_cache[4] = createTextVNode(" 百度网盘链接： ", -1)),
          createElementVNode("span", {
            class: "copyable link",
            onClick: _cache[1] || (_cache[1] = ($event) => copyText("https://pan.baidu.com/s/1Dw4pXRujfIaSfTBC_qDAiw?pwd=mess"))
          }, " 【点击复制链接】密码 mess ")
        ]),
        createElementVNode("img", {
          src: getImageUrl("baidupan.png"),
          alt: "百度网盘图标",
          class: "baidu-icon"
        }, null, 8, _hoisted_8)
      ]);
    };
  }
};
const ExtIntro = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ea1d3cff"]]);
export {
  ExtIntro as default
};
//# sourceMappingURL=extIntro.vue.js.map
