import { computed as I, onMounted as V, nextTick as x, onBeforeUnmount as z, watch as H, openBlock as y, createElementBlock as _, createElementVNode as f, toDisplayString as v, unref as U, Fragment as R, renderList as q, createCommentVNode as F, createApp as B } from "vue";
import { whichWayFile as G } from "./file-CXhVBbUa.js";
import { onContent as Q, onSetDev as Y } from "./hooks-BscfO9lD.js";
import { w as N } from "./version-shared-C3acQ_GF.js";
import { _ as J } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const K = {
  /**
   * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
   * @type {string}
   */
  md: `
### 更新概要

- **新增武将**: 晓歌、埃癸斯
- **技能 / 武将调整**：白面鸮、重岳、帕拉斯
- **新增 API**：\`Player.chooseTargetControl\`、\`Player.chooseFakeCard\`
- **修复**：\`override.ts\`中仍然使用\`StepContent\`的bug
- **修复**：嘉欣塔【飞旅】\`dynamicTranslate\` 仍停留在未削弱版本的 bug
- **修复**：信仰搅拌机【铳胄】因使用 Step-Content 而导致打包出错的 bug
- **修复**：卡涅里安、阿斯卡纶、波卜、裁度、骋风、帕拉斯、电弧、蒂比、斗士塔露拉、海霓、黑键、左乐因 AI 批量修改导致代码错误的 bug
- **修复**：希尔达语音解码错误导致无限递归播放语音的 bug
- **重构**：阿、安洁莉娜、安哲拉、ASH、白金、白铁、柏喙、澄闪、斥罪、重岳、初雪、刺玫、魔王、戴菲恩、德克萨斯、医生、多萝西、艾拉、菲莱、风笛、风丸、弗里斯腾、格劳克斯、黑、歌蕾蒂娅、瑰盐、哈蒂娅、海沫、号角、红、红隼的技能部分改用新写法
- **优化**：优化加载流程，减少加载时间
- **优化**: 优化\`WhichWayTips\`

### 进行中
- **优化**: 优化势力显示，现在联动角色会正确显示其势力
`,
  /**
   * 干员按钮组（干员 id），分「新增」与「调整」两组渲染，按钮可双击查看信息卡
   * @type {{ add: string[], adjust: string[] }}
   */
  player: {
    /** 本版新增的干员 */
    add: ["xiaogemrfz", "aiguisimrfz"],
    /** 本版调整过技能 / 数据的干员 */
    adjust: ["baimianxiaomrfz", "chongyuemrfz", "palasimrfz"]
  },
  /**
   * 卡牌按钮组（牌名 / 牌 id），同样分「新增」与「调整」
   * @type {{ add: string[], adjust: string[] }}
   */
  cards: {
    /** 本版新增的卡牌 */
    add: [],
    /** 本版调整过的卡牌 */
    adjust: []
  }
}, X = {
  player: "player",
  players: "player",
  character: "player",
  card: "card",
  cards: "card",
  vcard: "card"
}, Z = {
  add: "add",
  new: "add",
  新增: "add",
  adjust: "adjust",
  change: "adjust",
  modify: "adjust",
  调整: "adjust"
}, j = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/, S = /^\s*(#{1,6})\s+(.*)$/, W = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/, E = /^\s*>\s?/, k = /^\s*```/, P = /^\s*:::\s*([^\s:]+)(?:\s+([^\s:]+))?\s*$/, D = /^\s*:::\s*$/, ee = /^\s*\|?[\s:|-]*-{3,}[\s:|-]*\|?\s*$/;
function A(a, t, o) {
  const e = t === "player" ? a?.player : a?.cards;
  if (Array.isArray(e)) return o === "add" ? e.slice() : [];
  const s = e?.[o];
  return Array.isArray(s) ? s.slice() : [];
}
function $(a) {
  const t = [];
  let o = String(a ?? "").replace(/`([^`\n]+)`/g, (e, s) => `\0${t.push(s) - 1}\0`);
  return o = o.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_\n]+)__/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (e, s, i) => `<a class="md-a" href="${/^\s*(?:javascript|data|vbscript):/i.test(i) ? "#" : i}" target="_blank" rel="noreferrer noopener">${s}</a>`), o.replace(/\u0000(\d+)\u0000/g, (e, s) => `<code class="md-code">${t[Number(s)]}</code>`);
}
function te(a) {
  const t = [];
  let o = "";
  for (const e of a) {
    const s = Math.max(0, Math.floor(e.indent / 2));
    for (; t.length && t[t.length - 1].level > s; ) {
      const i = t.pop();
      o += i.ordered ? "</ol>" : "</ul>";
    }
    if (!t.length || t[t.length - 1].level < s)
      t.push({ ordered: e.ordered, level: s }), o += e.ordered ? '<ol class="md-ol">' : '<ul class="md-ul">';
    else if (t[t.length - 1].ordered !== e.ordered) {
      const i = t.pop();
      o += i.ordered ? "</ol>" : "</ul>", t.push({ ordered: e.ordered, level: s }), o += e.ordered ? '<ol class="md-ol">' : '<ul class="md-ul">';
    }
    o += `<li>${$(e.text)}</li>`;
  }
  for (; t.length; ) {
    const e = t.pop();
    o += e.ordered ? "</ol>" : "</ul>";
  }
  return o;
}
function M(a) {
  const t = String(a ?? "").replace(/\r\n?/g, `
`).split(`
`), o = [];
  let e = 0;
  for (; e < t.length; ) {
    const s = t[e];
    if (!s.trim()) {
      e++;
      continue;
    }
    if (k.test(s)) {
      const n = [];
      for (e++; e < t.length && !k.test(t[e]); )
        n.push(t[e++]);
      e++, o.push(`<pre class="md-pre"><code>${n.join(`
`)}</code></pre>`);
      continue;
    }
    if (W.test(s)) {
      o.push('<hr class="md-hr">'), e++;
      continue;
    }
    const i = s.match(S);
    if (i) {
      const n = i[1].length;
      o.push(`<h${n} class="md-h md-h${n}">${$(i[2].trim())}</h${n}>`), e++;
      continue;
    }
    if (E.test(s)) {
      const n = [];
      for (; e < t.length && E.test(t[e]); )
        n.push(t[e++].replace(E, ""));
      o.push(`<blockquote class="md-quote">${M(n.join(`
`))}</blockquote>`);
      continue;
    }
    if (s.includes("|") && e + 1 < t.length && ee.test(t[e + 1])) {
      const n = (c) => c.trim().replace(/^\||\|$/g, "").split("|").map((h) => $(h.trim())), r = n(s);
      e += 2;
      const p = [];
      for (; e < t.length && t[e].includes("|") && t[e].trim(); )
        p.push(n(t[e++]));
      const u = r.map((c) => `<th>${c}</th>`).join(""), m = p.map((c) => `<tr>${c.map((h) => `<td>${h}</td>`).join("")}</tr>`).join("");
      o.push(`<table class="md-table"><thead><tr>${u}</tr></thead><tbody>${m}</tbody></table>`);
      continue;
    }
    if (s.match(j)) {
      const n = [];
      for (; e < t.length; ) {
        const r = t[e].match(j);
        if (r) {
          n.push({
            indent: r[1].replace(/\t/g, "  ").length,
            ordered: /\d/.test(r[2]),
            text: r[3]
          }), e++;
          continue;
        }
        if (n.length && t[e].trim() && /^\s{2,}\S/.test(t[e])) {
          n[n.length - 1].text += ` ${t[e].trim()}`, e++;
          continue;
        }
        break;
      }
      o.push(te(n));
      continue;
    }
    const g = [];
    for (; e < t.length; ) {
      const n = t[e];
      if (!n.trim() || k.test(n) || W.test(n) || S.test(n) || E.test(n) || j.test(n) || P.test(n) || D.test(n))
        break;
      g.push(n.trim()), e++;
    }
    g.length && o.push(`<p class="md-p">${$(g.join(`
`)).replace(/\n/g, "<br>")}</p>`);
  }
  return o.join(`
`);
}
function O(a, t = {}) {
  let o = a;
  typeof o != "string" && (o = Array.isArray(t?.intro) ? t.intro.map((r) => `- ${r}`).join(`

`) : "");
  const e = o.replace(/\r\n?/g, `
`).split(`
`), s = [];
  let i = [];
  const d = () => {
    i.some((r) => r.trim()) && s.push({ type: "html", html: M(i.join(`
`)) }), i = [];
  }, g = ["player", "card"], n = ["add", "adjust"];
  for (let r = 0; r < e.length; r++) {
    const p = e[r].match(P), u = p ? X[p[1].toLowerCase()] : void 0, m = u && p[2] ? Z[p[2].toLowerCase()] : u ? "add" : void 0;
    if (!u || !m) {
      i.push(e[r]);
      continue;
    }
    const c = [];
    for (r++; r < e.length && !D.test(e[r]); )
      e[r].trim() && c.push(e[r].trim()), r++;
    d();
    const h = A(t, u, m);
    s.push({ type: u, group: m, items: c.length ? c : h });
  }
  d();
  for (const r of g)
    for (const p of n) {
      if (s.some((m) => m.type === r && m.group === p)) continue;
      const u = A(t, r, p);
      u.length && s.push({ type: r, group: p, items: u });
    }
  return s;
}
function se(a = {}) {
  return O(a?.md, a).some((o) => o.type === "html" ? !!o.html.trim() : o.items.length > 0);
}
const oe = { class: "update-notice" }, ne = { class: "notice-header" }, re = { class: "notice-content" }, ce = { class: "update-section" }, ie = ["innerHTML"], ae = {
  key: 1,
  class: "update-section"
}, le = {
  key: 2,
  class: "update-section"
}, de = {
  key: 0,
  class: "empty-state"
}, pe = {
  __name: "updateNotice",
  props: {
    info: {
      type: Object,
      required: !0,
      default: () => ({ md: "", intro: [], player: [], cards: [] })
    },
    onClose: {
      type: Function,
      default: () => {
      }
    }
  },
  emits: ["close"],
  setup(a, { emit: t }) {
    let o = N.ext, e = N.noname.over;
    const s = a, i = t, d = I(() => O(s.info?.md, s.info)), g = I(() => se(s.info)), n = (c) => {
      const h = c.type === "player", l = c.group !== "adjust";
      return h ? l ? "👥 新增干员" : "🔧 调整干员" : l ? "🃏 新增卡片" : "🔧 调整卡牌";
    }, r = /* @__PURE__ */ new Map(), p = (c, h) => {
      c ? r.set(h, c) : r.delete(h);
    }, u = () => {
      r.forEach((c, h) => {
        const l = d.value[h];
        if (!c || !l || l.type === "html") return;
        for (; c.firstChild; ) c.removeChild(c.firstChild);
        const w = window?.ui?.create?.buttonPresets, b = l.type === "player" ? w?.character : w?.vcard;
        if (typeof b != "function") {
          console.warn(`[UpdateNotice] 按钮 API 不可用，跳过渲染：${l.type}`);
          return;
        }
        l.items.forEach((T) => {
          try {
            const C = b(T);
            C?.nodeType === 1 && c.appendChild(C);
          } catch (C) {
            console.error(`渲染${l.type === "player" ? "干员" : "卡片"}按钮失败 (${T}):`, C);
          }
        });
      });
    }, m = () => {
      i("close"), typeof s.onClose == "function" && s.onClose();
    };
    return V(() => {
      x(u);
    }), z(() => {
      r.forEach((c) => {
        for (; c.firstChild; ) c.removeChild(c.firstChild);
      }), r.clear();
    }), H(
      () => s.info,
      () => {
        x(u);
      },
      { deep: !0 }
    ), (c, h) => (y(), _("div", oe, [
      f("div", ne, [
        f("h2", null, "驶舰之向 v" + v(U(o)) + " 更新公告", 1),
        f("button", {
          onClick: m,
          class: "close-btn"
        }, "×")
      ]),
      f("div", re, [
        f("div", ce, "最低适配版本: " + v(U(e)), 1),
        (y(!0), _(R, null, q(d.value, (l, w) => (y(), _(R, { key: w }, [
          l.type === "html" ? (y(), _("section", {
            key: 0,
            class: "update-section md-body",
            innerHTML: l.html
          }, null, 8, ie)) : l.type === "player" ? (y(), _("section", ae, [
            f("h3", null, v(n(l)), 1),
            f("div", {
              ref_for: !0,
              ref: (b) => p(b, w),
              class: "character-grid"
            }, null, 512)
          ])) : (y(), _("section", le, [
            f("h3", null, v(n(l)), 1),
            f("div", {
              ref_for: !0,
              ref: (b) => p(b, w),
              class: "card-grid"
            }, null, 512)
          ]))
        ], 64))), 128)),
        g.value ? F("", !0) : (y(), _("div", de, "暂无更新内容"))
      ])
    ]));
  }
}, ue = /* @__PURE__ */ J(pe, [["__scopeId", "data-v-2ef2351c"]]);
class he {
  async init() {
    this.updateLog = await G.readFile("src:updateLog/updateContent.txt"), Q({
      name: "WhichWayUpdateLog_showUpdateNotice",
      fn: () => {
        N.extVersionChanged && this.showUpdateNotice();
      }
    });
  }
  currentLog = K;
  /**
   * @type {string}
   */
  updateLog;
  /**
   * 创建更新提示的 DOM 对象
   * @param {Object} [info] - 更新信息数据
   * @param {Function} [onClose] - 关闭回调函数
   * @returns {HTMLElement} 渲染好的 DOM 元素
   */
  createUpdateNotice(t = this.currentLog, o = () => {
  }) {
    const e = document.createElement("div");
    e.className = "update-notice-wrapper";
    const s = B(ue, {
      info: t,
      onClose: () => {
        typeof o == "function" && o(), s.unmount(), e.parentNode && e.parentNode.removeChild(e);
      }
    });
    return s.mount(e), e.firstElementChild;
  }
  /**
   * 快速显示更新提示（自动添加到 body）
   * @param {Object} [info] - 更新信息数据
   * @param {Function} [onClose] - 关闭回调
   * @returns {Object} { dom, close } - DOM 元素和关闭方法
   */
  showUpdateNotice(t = this.currentLog, o = () => {
  }) {
    const e = this.createUpdateNotice(t, i), s = document.createElement("div");
    s.classList.add("whichWayUpdateNoticeOverlay"), s.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s;
        `, s.appendChild(e), document.body.appendChild(s);
    function i(d = document.querySelector(".whichWayUpdateNoticeOverlay")) {
      if (!d)
        throw new Error("未找到更新提示的遮罩层");
      d.style.opacity = "0", setTimeout(() => {
        d.parentNode && document.body.removeChild(d), o();
      }, 300);
    }
    return s.addEventListener("click", (d) => {
      d.target === s && i();
    }), { dom: e, close: i, overlay: s };
  }
}
const L = new he();
await L.init();
Y({
  name: "WhichWayUpdateLog_setDev",
  fn: () => {
    window.whichWayUpdateLog = L;
  }
});
window.whichWay.register("updateLog", L);
const we = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayUpdateLog: L
}, Symbol.toStringTag, { value: "Module" }));
export {
  we as i,
  O as s,
  L as w
};
