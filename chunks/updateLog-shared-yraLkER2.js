import { computed as U, onMounted as J, nextTick as R, onBeforeUnmount as K, watch as X, openBlock as b, createElementBlock as v, createElementVNode as y, toDisplayString as x, unref as A, Fragment as O, renderList as tt, createCommentVNode as et, createApp as ot } from "vue";
import { whichWayFile as st } from "./file-CXhVBbUa.js";
import { onContent as nt, onSetDev as rt } from "./hooks-BscfO9lD.js";
import { ui as it } from "noname";
import { w as I } from "./version-shared-BUx8npJy.js";
import { _ as ct } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const at = {
  /**
   * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
   * @type {string}
   */
  md: "\n### 更新概要\n\n- **新增武将**: 晓歌、埃癸斯\n- **技能 / 武将调整**：白面鸮、重岳、帕拉斯\n- **新增 API**：`Player.chooseTargetControl`、`Player.chooseFakeCard`\n- **修复**：`override.ts`中仍然使用`StepContent`的bug\n- **修复**：嘉欣塔【飞旅】`dynamicTranslate` 仍停留在未削弱版本的 bug\n- **修复**：浊心斯卡蒂【迁徙】报错的bug\n- **修复**：浊心斯卡蒂【迁徙】缺失语音的bug\n- **修复**：信仰搅拌机【铳胄】因使用 Step-Content 而导致打包出错的 bug\n- **修复**：卡涅里安、阿斯卡纶、波卜、裁度、骋风、帕拉斯、电弧、蒂比、斗士塔露拉、海霓、黑键、左乐、荒芜拉普兰德因 AI 批量修改导致代码错误的 bug\n- **修复**：希尔达语音解码错误导致无限递归播放语音的 bug\n- **重构**：阿、安洁莉娜、安哲拉、ASH、白金、白铁、柏喙、澄闪、斥罪、重岳、初雪、刺玫、魔王、戴菲恩、德克萨斯、医生、多萝西、艾拉、菲莱、风笛、风丸、弗里斯腾、格劳克斯、黑、歌蕾蒂娅、瑰盐、哈蒂娅、海沫、号角、红、红隼的技能部分改用新写法\n- **优化**：优化加载流程，减少加载时间\n- **优化**: 优化`WhichWayTips`，现在绑定在Card上的Prompt会在Card离开手牌区时自动销毁\n- **优化**: 优化`WhichWayTips`，现在Prompt会自动调整文字大小\n- **优化**: 使用Vue重构了`CharacterCard`，为`CharacterCard`添加了替换背景的功能\n- **优化**: 删除`src/skin.ts`，该文件为重复文件，功能已被`src/skin/index.ts`替代\n- **优化**: 现在`sjzxDycWrapper`最大`width`和`height`不会超过父容器\n\n### 进行中\n- **优化**: 优化势力显示，现在联动角色会正确显示其势力\n",
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
}, N = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/, D = /^\s*(#{1,6})\s+(.*)$/, M = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/, L = /^\s*>\s?/, T = /^\s*```/, z = /^\s*:::\s*([^\s:]+)(?:\s+([^\s:]+))?\s*$/, H = /^\s*:::\s*$/, pt = /^\s*\|?[\s:|-]*-{3,}[\s:|-]*\|?\s*$/;
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
function ht(l) {
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
function q(l) {
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
    if (T.test(o)) {
      const n = [];
      for (t++; t < e.length && !T.test(e[t]); )
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
    if (L.test(o)) {
      const n = [];
      for (; t < e.length && L.test(e[t]); )
        n.push(e[t++].replace(L, ""));
      s.push(`<blockquote class="md-quote">${q(n.join(`
`))}</blockquote>`);
      continue;
    }
    if (o.includes("|") && t + 1 < e.length && pt.test(e[t + 1])) {
      const n = (u) => u.trim().replace(/^\||\|$/g, "").split("|").map((w) => j(w.trim())), r = n(o);
      t += 2;
      const p = [];
      for (; t < e.length && e[t].includes("|") && e[t].trim(); )
        p.push(n(e[t++]));
      const h = r.map((u) => `<th>${u}</th>`).join(""), g = p.map((u) => `<tr>${u.map((w) => `<td>${w}</td>`).join("")}</tr>`).join("");
      s.push(`<table class="md-table"><thead><tr>${h}</tr></thead><tbody>${g}</tbody></table>`);
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
      s.push(ht(n));
      continue;
    }
    const _ = [];
    for (; t < e.length; ) {
      const n = e[t];
      if (!n.trim() || T.test(n) || M.test(n) || D.test(n) || L.test(n) || N.test(n) || z.test(n) || H.test(n))
        break;
      _.push(n.trim()), t++;
    }
    _.length && s.push(`<p class="md-p">${j(_.join(`
`)).replace(/\n/g, "<br>")}</p>`);
  }
  return s.join(`
`);
}
function F(l, e = {}) {
  let s = l;
  typeof s != "string" && (s = Array.isArray(e?.intro) ? e.intro.map((r) => `- ${r}`).join(`

`) : "");
  const t = s.replace(/\r\n?/g, `
`).split(`
`), o = [];
  let c = [];
  const d = () => {
    c.some((r) => r.trim()) && o.push({ type: "html", html: q(c.join(`
`)) }), c = [];
  }, _ = ["player", "card"], n = ["add", "adjust"];
  for (let r = 0; r < t.length; r++) {
    const p = t[r].match(z), h = p ? lt[p[1].toLowerCase()] : void 0, g = h && p[2] ? dt[p[2].toLowerCase()] : h ? "add" : void 0;
    if (!h || !g) {
      c.push(t[r]);
      continue;
    }
    const u = [];
    for (r++; r < t.length && !H.test(t[r]); )
      t[r].trim() && u.push(t[r].trim()), r++;
    d();
    const w = V(e, h, g);
    o.push({ type: h, group: g, items: u.length ? u : w });
  }
  d();
  for (const r of _)
    for (const p of n) {
      if (o.some((g) => g.type === r && g.group === p)) continue;
      const h = V(e, r, p);
      h.length && o.push({ type: r, group: p, items: h });
    }
  return o;
}
function ut(l = {}) {
  return F(l?.md, l).some((s) => s.type === "html" ? !!s.html.trim() : s.items.length > 0);
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
}, Ct = {
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
    let s = I.ext, t = I.noname.over;
    const o = l, c = e, d = U(() => F(o.info?.md, o.info)), _ = U(() => ut(o.info)), n = (i) => {
      const m = i.type === "player", a = i.group !== "adjust";
      return m ? a ? "👥 新增干员" : "🔧 调整干员" : a ? "🃏 新增卡片" : "🔧 调整卡牌";
    }, r = /* @__PURE__ */ new Map(), p = (i, m) => {
      i ? r.set(m, i) : r.delete(m);
    }, h = {
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
    }, S = () => {
      r.forEach((i, m) => {
        const a = d.value[m];
        if (!i || !a || a.type === "html") return;
        for (; i.firstChild; ) i.removeChild(i.firstChild);
        w(i);
        const f = a.type === "player", C = g(), P = f ? C?.character : C?.vcard;
        if (typeof P != "function") {
          console.warn(`[UpdateNotice] 按钮 API 不可用，跳过渲染：${a.type}`);
          return;
        }
        const { width: G, height: Q } = h[f ? "player" : "card"];
        a.items.forEach((W) => {
          try {
            const E = P(W);
            if (E?.nodeType !== 1) return;
            const $ = document.createElement("div");
            $.className = "button-cell", $.style.cssText = `position:relative;flex:none;width:${G}px;height:${Q}px;`;
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
              E.style.setProperty(Y, Z, "important");
            $.appendChild(E), i.appendChild($);
          } catch (E) {
            console.error(`渲染${f ? "干员" : "卡片"}按钮失败 (${W}):`, E);
          }
        });
      });
    }, B = () => {
      c("close"), typeof o.onClose == "function" && o.onClose();
    };
    return J(() => {
      R(S);
    }), K(() => {
      r.forEach((i) => {
        for (; i.firstChild; ) i.removeChild(i.firstChild);
      }), r.clear();
    }), X(
      () => o.info,
      () => {
        R(S);
      },
      { deep: !0 }
    ), (i, m) => (b(), v("div", mt, [
      y("div", ft, [
        y("h2", null, "驶舰之向 v" + x(A(s)) + " 更新公告", 1),
        y("button", {
          onClick: B,
          class: "close-btn"
        }, "×")
      ]),
      y("div", gt, [
        y("div", yt, "最低适配版本: " + x(A(t)), 1),
        (b(!0), v(O, null, tt(d.value, (a, f) => (b(), v(O, { key: f }, [
          a.type === "html" ? (b(), v("section", {
            key: 0,
            class: "update-section md-body",
            innerHTML: a.html
          }, null, 8, _t)) : a.type === "player" ? (b(), v("section", wt, [
            y("h3", null, x(n(a)), 1),
            y("div", {
              ref_for: !0,
              ref: (C) => p(C, f),
              class: "character-grid"
            }, null, 512)
          ])) : (b(), v("section", bt, [
            y("h3", null, x(n(a)), 1),
            y("div", {
              ref_for: !0,
              ref: (C) => p(C, f),
              class: "card-grid"
            }, null, 512)
          ]))
        ], 64))), 128)),
        _.value ? et("", !0) : (b(), v("div", vt, "暂无更新内容"))
      ])
    ]));
  }
}, Et = /* @__PURE__ */ ct(Ct, [["__scopeId", "data-v-41c274e9"]]);
class $t {
  async init() {
    this.updateLog = await st.readFile("src:updateLog/updateContent.txt"), nt({
      name: "WhichWayUpdateLog_showUpdateNotice",
      fn: () => {
        I.extVersionChanged && this.showUpdateNotice();
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
    const o = ot(Et, {
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
const k = new $t();
await k.init();
rt({
  name: "WhichWayUpdateLog_setDev",
  fn: () => {
    window.whichWayUpdateLog = k;
  }
});
window.whichWay.register("updateLog", k);
const It = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayUpdateLog: k
}, Symbol.toStringTag, { value: "Module" }));
export {
  It as i,
  F as s,
  k as w
};
