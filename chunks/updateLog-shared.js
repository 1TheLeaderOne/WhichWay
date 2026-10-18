import { computed as P, onMounted as J, nextTick as A, onBeforeUnmount as K, watch as X, openBlock as b, createElementBlock as v, createElementVNode as y, toDisplayString as L, unref as W, Fragment as O, renderList as tt, createCommentVNode as et, createApp as ot } from "vue";
import { whichWayFile as st } from "./file.js";
import { onContent as nt, onSetDev as rt } from "./hooks.js";
import { ui as it } from "noname";
import { w as T } from "./arknight-arkidMigration-shared.js";
import { _ as ct } from "./_plugin-vue_export-helper.js";
const at = {
  /**
   * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
   * @type {string}
   */
  md: `
### 更新概要
- **新增武将**: 旅骨、岳羽由加莉、克莱门莎、结城理、托莱多
- **技能 / 武将调整**：灵知
- **新增皮肤**: 皮肤更新至\`恒远津梁\`版本
- **重构**：露托、温米、迷迭香的技能部分改用新写法
- **重构**：所有干员id统一化，现在明日方舟已实装角色的武将id将与明日方舟同步
- **新增 API**：\`Player.chooseFakeCardTarget\`
- **新增**: 明日方舟扩展设置界面新增\`征稿在前\`、\`配音设置\`、\`模组设置\`、\`皮肤位置设这\`（仅开发者模式可用）界面
- **新增**: 为明日方舟干员新增立绘双层渲染，重定向头像绘制入口以 \`default.png\` 背板替代透明区保底图，并兼容换肤重绘与战报克隆
- **优化**: 优化势力显示，现在联动角色会正确显示其势力
- **优化**: 干员id统一化，现在所有明日方舟实装角色的id均与明日方舟id相同
- **修复**: 修复黍、信仰搅拌机因AI批量迁移导致的bug
- **修复**: 修复嵯峨、普瑞赛斯模组技能丢失的bug
- **修复**：仍处于开发中的模式\`GloriousIdeal\`在非开发环境下会加载的bug
- **修复**：跃跃因 AI 批量修改导致代码错误的 bug
- **修复**：部分配音不受无名杀音量控制的影响
`,
  /**
   * 干员按钮组（干员 id），分「新增」与「调整」两组渲染，按钮可双击查看信息卡
   * @type {{ add: string[], adjust: string[] }}
   */
  player: {
    /** 本版新增的干员 */
    add: ["char_4232_hbound", "char_4219_yukari", "char_4231_clemnt", "char_4217_makoto", "char_393_toledo"],
    /** 本版调整过技能 / 数据的干员 */
    adjust: ["char_206_gnosis"]
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
}, lt = {
  player: "player",
  players: "player",
  character: "player",
  card: "card",
  cards: "card",
  vcard: "card"
}, dt = {
  add: "add",
  new: "add",
  新增: "add",
  adjust: "adjust",
  change: "adjust",
  modify: "adjust",
  调整: "adjust"
}, N = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/, D = /^\s*(#{1,6})\s+(.*)$/, M = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/, k = /^\s*>\s?/, I = /^\s*```/, q = /^\s*:::\s*([^\s:]+)(?:\s+([^\s:]+))?\s*$/, F = /^\s*:::\s*$/, ht = /^\s*\|?[\s:|-]*-{3,}[\s:|-]*\|?\s*$/;
function V(l, e, s) {
  const t = e === "player" ? l?.player : l?.cards;
  if (Array.isArray(t)) return s === "add" ? t.slice() : [];
  const o = t?.[s];
  return Array.isArray(o) ? o.slice() : [];
}
function j(l) {
  const e = [];
  let s = String(l ?? "").replace(/`([^`\n]+)`/g, (t, o) => `\0${e.push(o) - 1}\0`);
  return s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_\n]+)__/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (t, o, c) => `<a class="md-a" href="${/^\s*(?:javascript|data|vbscript):/i.test(c) ? "#" : c}" target="_blank" rel="noreferrer noopener">${o}</a>`), s.replace(/\u0000(\d+)\u0000/g, (t, o) => `<code class="md-code">${e[Number(o)]}</code>`);
}
function pt(l) {
  const e = [];
  let s = "";
  for (const t of l) {
    const o = Math.max(0, Math.floor(t.indent / 2));
    for (; e.length && e[e.length - 1].level > o; ) {
      const c = e.pop();
      s += c.ordered ? "</ol>" : "</ul>";
    }
    if (!e.length || e[e.length - 1].level < o)
      e.push({ ordered: t.ordered, level: o }), s += t.ordered ? '<ol class="md-ol">' : '<ul class="md-ul">';
    else if (e[e.length - 1].ordered !== t.ordered) {
      const c = e.pop();
      s += c.ordered ? "</ol>" : "</ul>", e.push({ ordered: t.ordered, level: o }), s += t.ordered ? '<ol class="md-ol">' : '<ul class="md-ul">';
    }
    s += `<li>${j(t.text)}</li>`;
  }
  for (; e.length; ) {
    const t = e.pop();
    s += t.ordered ? "</ol>" : "</ul>";
  }
  return s;
}
function H(l) {
  const e = String(l ?? "").replace(/\r\n?/g, `
`).split(`
`), s = [];
  let t = 0;
  for (; t < e.length; ) {
    const o = e[t];
    if (!o.trim()) {
      t++;
      continue;
    }
    if (I.test(o)) {
      const n = [];
      for (t++; t < e.length && !I.test(e[t]); )
        n.push(e[t++]);
      t++, s.push(`<pre class="md-pre"><code>${n.join(`
`)}</code></pre>`);
      continue;
    }
    if (M.test(o)) {
      s.push('<hr class="md-hr">'), t++;
      continue;
    }
    const c = o.match(D);
    if (c) {
      const n = c[1].length;
      s.push(`<h${n} class="md-h md-h${n}">${j(c[2].trim())}</h${n}>`), t++;
      continue;
    }
    if (k.test(o)) {
      const n = [];
      for (; t < e.length && k.test(e[t]); )
        n.push(e[t++].replace(k, ""));
      s.push(`<blockquote class="md-quote">${H(n.join(`
`))}</blockquote>`);
      continue;
    }
    if (o.includes("|") && t + 1 < e.length && ht.test(e[t + 1])) {
      const n = (u) => u.trim().replace(/^\||\|$/g, "").split("|").map((w) => j(w.trim())), r = n(o);
      t += 2;
      const h = [];
      for (; t < e.length && e[t].includes("|") && e[t].trim(); )
        h.push(n(e[t++]));
      const p = r.map((u) => `<th>${u}</th>`).join(""), g = h.map((u) => `<tr>${u.map((w) => `<td>${w}</td>`).join("")}</tr>`).join("");
      s.push(`<table class="md-table"><thead><tr>${p}</tr></thead><tbody>${g}</tbody></table>`);
      continue;
    }
    if (o.match(N)) {
      const n = [];
      for (; t < e.length; ) {
        const r = e[t].match(N);
        if (r) {
          n.push({
            indent: r[1].replace(/\t/g, "  ").length,
            ordered: /\d/.test(r[2]),
            text: r[3]
          }), t++;
          continue;
        }
        if (n.length && e[t].trim() && /^\s{2,}\S/.test(e[t])) {
          n[n.length - 1].text += ` ${e[t].trim()}`, t++;
          continue;
        }
        break;
      }
      s.push(pt(n));
      continue;
    }
    const _ = [];
    for (; t < e.length; ) {
      const n = e[t];
      if (!n.trim() || I.test(n) || M.test(n) || D.test(n) || k.test(n) || N.test(n) || q.test(n) || F.test(n))
        break;
      _.push(n.trim()), t++;
    }
    _.length && s.push(`<p class="md-p">${j(_.join(`
`)).replace(/\n/g, "<br>")}</p>`);
  }
  return s.join(`
`);
}
function B(l, e = {}) {
  let s = l;
  typeof s != "string" && (s = Array.isArray(e?.intro) ? e.intro.map((r) => `- ${r}`).join(`

`) : "");
  const t = s.replace(/\r\n?/g, `
`).split(`
`), o = [];
  let c = [];
  const d = () => {
    c.some((r) => r.trim()) && o.push({ type: "html", html: H(c.join(`
`)) }), c = [];
  }, _ = ["player", "card"], n = ["add", "adjust"];
  for (let r = 0; r < t.length; r++) {
    const h = t[r].match(q), p = h ? lt[h[1].toLowerCase()] : void 0, g = p && h[2] ? dt[h[2].toLowerCase()] : p ? "add" : void 0;
    if (!p || !g) {
      c.push(t[r]);
      continue;
    }
    const u = [];
    for (r++; r < t.length && !F.test(t[r]); )
      t[r].trim() && u.push(t[r].trim()), r++;
    d();
    const w = V(e, p, g);
    o.push({ type: p, group: g, items: u.length ? u : w });
  }
  d();
  for (const r of _)
    for (const h of n) {
      if (o.some((g) => g.type === r && g.group === h)) continue;
      const p = V(e, r, h);
      p.length && o.push({ type: r, group: h, items: p });
    }
  return o;
}
function ut(l = {}) {
  return B(l?.md, l).some((s) => s.type === "html" ? !!s.html.trim() : s.items.length > 0);
}
const mt = { class: "update-notice" }, ft = { class: "notice-header" }, gt = { class: "notice-content" }, yt = { class: "update-section" }, _t = ["innerHTML"], wt = {
  key: 1,
  class: "update-section"
}, bt = {
  key: 2,
  class: "update-section"
}, vt = {
  key: 0,
  class: "empty-state"
}, Et = {
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
  setup(l, { emit: e }) {
    let s = T.ext, t = T.noname.over;
    const o = l, c = e, d = P(() => B(o.info?.md, o.info)), _ = P(() => ut(o.info)), n = (i) => {
      const m = i.type === "player", a = i.group !== "adjust";
      return m ? a ? "👥 新增干员" : "🔧 调整干员" : a ? "🃏 新增卡片" : "🔧 调整卡牌";
    }, r = /* @__PURE__ */ new Map(), h = (i, m) => {
      i ? r.set(m, i) : r.delete(m);
    }, p = {
      player: { width: 80, height: 100 },
      card: { width: 100, height: 140 }
    }, g = () => it?.create?.buttonPresets ?? window?.ui?.create?.buttonPresets, u = (i, m) => {
      !i || !i.style || m.forEach((a) => {
        const f = a.indexOf(":");
        f < 0 || i.style.setProperty(a.slice(0, f), a.slice(f + 1), "important");
      });
    }, w = (i) => {
      const m = i.closest?.(".update-section") ?? i.parentElement;
      u(m, [
        "display:block",
        "height:auto",
        "min-height:0",
        "max-height:none",
        "contain:none",
        "overflow:visible",
        "position:relative"
      ]), u(i, [
        "position:static",
        "float:none",
        "inset:auto",
        "clear:none",
        "width:100%",
        "height:auto",
        "max-height:none",
        "contain:none",
        "overflow:visible"
      ]);
    }, U = () => {
      r.forEach((i, m) => {
        const a = d.value[m];
        if (!i || !a || a.type === "html") return;
        for (; i.firstChild; ) i.removeChild(i.firstChild);
        w(i);
        const f = a.type === "player", E = g(), R = f ? E?.character : E?.vcard;
        if (typeof R != "function") {
          console.warn(`[UpdateNotice] 按钮 API 不可用，跳过渲染：${a.type}`);
          return;
        }
        const { width: z, height: Q } = p[f ? "player" : "card"];
        a.items.forEach((S) => {
          try {
            const $ = R(S);
            if ($?.nodeType !== 1) return;
            const C = document.createElement("div");
            C.className = "button-cell", C.style.cssText = `position:relative;flex:none;width:${z}px;height:${Q}px;`;
            for (const [Y, Z] of Object.entries({
              position: "relative",
              left: "auto",
              top: "auto",
              right: "auto",
              bottom: "auto",
              margin: "0",
              width: "100%",
              height: "100%"
            }))
              $.style.setProperty(Y, Z, "important");
            C.appendChild($), i.appendChild(C);
          } catch ($) {
            console.error(`渲染${f ? "干员" : "卡片"}按钮失败 (${S}):`, $);
          }
        });
      });
    }, G = () => {
      c("close"), typeof o.onClose == "function" && o.onClose();
    };
    return J(() => {
      A(U);
    }), K(() => {
      r.forEach((i) => {
        for (; i.firstChild; ) i.removeChild(i.firstChild);
      }), r.clear();
    }), X(
      () => o.info,
      () => {
        A(U);
      },
      { deep: !0 }
    ), (i, m) => (b(), v("div", mt, [
      y("div", ft, [
        y("h2", null, "驶舰之向 v" + L(W(s)) + " 更新公告", 1),
        y("button", {
          onClick: G,
          class: "close-btn"
        }, "×")
      ]),
      y("div", gt, [
        y("div", yt, "最低适配版本: " + L(W(t)), 1),
        (b(!0), v(O, null, tt(d.value, (a, f) => (b(), v(O, { key: f }, [
          a.type === "html" ? (b(), v("section", {
            key: 0,
            class: "update-section md-body",
            innerHTML: a.html
          }, null, 8, _t)) : a.type === "player" ? (b(), v("section", wt, [
            y("h3", null, L(n(a)), 1),
            y("div", {
              ref_for: !0,
              ref: (E) => h(E, f),
              class: "character-grid"
            }, null, 512)
          ])) : (b(), v("section", bt, [
            y("h3", null, L(n(a)), 1),
            y("div", {
              ref_for: !0,
              ref: (E) => h(E, f),
              class: "card-grid"
            }, null, 512)
          ]))
        ], 64))), 128)),
        _.value ? et("", !0) : (b(), v("div", vt, "暂无更新内容"))
      ])
    ]));
  }
}, $t = /* @__PURE__ */ ct(Et, [["__scopeId", "data-v-41c274e9"]]);
class Ct {
  async init() {
    this.updateLog = await st.readFile("src:updateLog/updateContent.txt"), nt({
      name: "WhichWayUpdateLog_showUpdateNotice",
      fn: () => {
        T.extVersionChanged && this.showUpdateNotice();
      }
    });
  }
  currentLog = at;
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
  createUpdateNotice(e = this.currentLog, s = () => {
  }) {
    const t = document.createElement("div");
    t.className = "update-notice-wrapper";
    const o = ot($t, {
      info: e,
      onClose: () => {
        typeof s == "function" && s(), o.unmount(), t.parentNode && t.parentNode.removeChild(t);
      }
    });
    return o.mount(t), t.firstElementChild;
  }
  /**
   * 快速显示更新提示（自动添加到 body）
   * @param {Object} [info] - 更新信息数据
   * @param {Function} [onClose] - 关闭回调
   * @returns {Object} { dom, close } - DOM 元素和关闭方法
   */
  showUpdateNotice(e = this.currentLog, s = () => {
  }) {
    const t = this.createUpdateNotice(e, c), o = document.createElement("div");
    o.classList.add("whichWayUpdateNoticeOverlay"), o.style.cssText = `
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
        `, o.appendChild(t), document.body.appendChild(o);
    function c(d = document.querySelector(".whichWayUpdateNoticeOverlay")) {
      if (!d)
        throw new Error("未找到更新提示的遮罩层");
      d.style.opacity = "0", setTimeout(() => {
        d.parentNode && document.body.removeChild(d), s();
      }, 300);
    }
    return o.addEventListener("click", (d) => {
      d.target === o && c();
    }), { dom: t, close: c, overlay: o };
  }
}
const x = new Ct();
await x.init();
rt({
  name: "WhichWayUpdateLog_setDev",
  fn: () => {
    window.whichWayUpdateLog = x;
  }
});
window.whichWay.register("updateLog", x);
const Tt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayUpdateLog: x
}, Symbol.toStringTag, { value: "Module" }));
export {
  Tt as i,
  j as r,
  B as s,
  x as w
};
