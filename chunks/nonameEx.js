import { game as c, ui as x, _status as p, lib as o, get as f, Game as B, Get as q } from "noname";
import { r as V, a as Y } from "./tips-prompt-shared.js";
import { onBeforeContent as Q } from "./hooks.js";
import { s as ee } from "./nonameEx-custom-skill-shared.js";
const b = "whichWayFakeCard", te = ["prompt", "prompt2", "promptx", "selectCard", "filterOk", "ai", "forced", "complexCard", "complexSelect", "allowChooseAll", "hsskill", "type"], re = [
  "prompt",
  "prompt2",
  "promptx",
  "selectCard",
  "selectTarget",
  "filterTarget",
  "filterOk",
  "ai1",
  "ai2",
  "forced",
  "hsskill",
  "deadTarget",
  "includeOut",
  "complexCard",
  "complexSelect",
  "allowChooseAll",
  "type",
  "animate"
];
function Z(a, t) {
  const e = a.node.handcards1, r = a.node.handcards2, n = x.handcards1Container, s = x.handcards2Container;
  if (!n || !e) return null;
  const i = new Set(t), d = 10;
  let u = "real";
  const g = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
  let C = 0;
  const w = [], _ = [
    { inner: e, outer: n },
    { inner: r, outer: s }
  ], l = x.updatehl, m = (h) => i.has(h) || h.classList.contains("glows"), T = (h) => u === "fake" ? m(h) : !m(h), E = (h) => {
    let k = 0;
    for (const { inner: M } of _)
      if (M)
        for (const O of M.childNodes) {
          const P = (
            /** @type { HTMLElement } */
            O
          );
          !P.classList || !P.classList.contains("card") || P.classList.contains("removing") || m(P) === h && k++;
        }
    return k;
  }, L = () => {
    const h = u === "real" ? "fake" : "real";
    E(h === "fake") && (u = h, x.updatehl());
  }, X = function() {
    if (p.dragged || p.justdragged || !T(this) || this.classList.contains("removing")) return;
    const h = Date.now();
    h - C < 350 || (C = h, L());
  }, H = (h) => {
    y.has(h) || (y.add(h), h.addEventListener(o.config.touchscreen ? "touchend" : "click", X));
  }, A = () => {
    const h = x._handcardHover;
    for (const { inner: k, outer: M } of _) {
      if (!k || !M || !k.childNodes.length) continue;
      const O = Array.from(k.childNodes).filter(
        (F) => F.classList && F.classList.contains("card") && !F.classList.contains("removing")
      );
      if (!O.length) continue;
      const P = (F, R, S) => {
        const G = /translateX\((-?[\d.]+)px\)/.exec(F.style.transform || "");
        return G ? parseFloat(G[1]) : R * S;
      }, $ = o.config.fold_card && O.length > 1 ? Math.max(32, Math.min(112, (M.offsetWidth - 128) / (O.length - 1))) : 112;
      let U = 0, I, N = 0;
      O.forEach((F, R) => {
        const S = (
          /** @type { HTMLElement } */
          F
        );
        if (H(S), T(S)) {
          const K = S === h ? Math.max(d, S.offsetWidth || 0) : d;
          N = R * $ - U, U += $ - K, S.classList.contains("selectable") && (g.add(S), S.classList.remove("selectable"));
        } else
          N = P(S, R, $) - U, g.delete(S) && S.classList.add("selectable");
        const G = `translateX(${Math.round(N)}px)`;
        S._transform = G, S.style.transform = S.classList.contains("selected") ? `${G} translateY(-20px)` : G, I = S;
      });
      const J = Math.round(N) + (I?.offsetWidth || 0);
      k.style.setProperty("width", `${J}px`, "important"), M.classList.toggle("scrollh", J > M.offsetWidth);
    }
  }, z = function(...h) {
    const k = l.apply(this, h);
    try {
      A();
    } catch (M) {
      console.warn("[chooseFakeCard] 应用假牌布局失败：", M);
    }
    return k;
  }, W = () => {
    x.updatehl = l;
    for (const h of y) h.removeEventListener(o.config.touchscreen ? "touchend" : "click", X);
    y.clear();
    for (const h of g) h.classList.add("selectable");
    g.clear();
    for (const { inner: h, outer: k } of _)
      !h || !k || (h.style.removeProperty("width"), k.classList.remove("scrollh"));
    for (const { card: h, origin: k } of w)
      h.parentNode !== e && h.parentNode !== r || k.appendChild(h);
    x.updatehl();
  };
  try {
    if (!f.is.singleHandcard())
      for (const h of Array.from(r.childNodes)) {
        const k = (
          /** @type { Card } */
          h
        );
        k.classList.contains("removing") || k.classList.contains("glows") || i.has(k) || (w.push({ card: k, origin: r }), e.appendChild(k));
      }
    x.updatehl = z, x.updatehl();
  } catch (h) {
    throw W(), h;
  }
  return W;
}
const j = {
  /**
   * 假牌选牌（`player.chooseFakeCard()` 的 content）。
   *
   * 只有一段：造牌 → 置入手牌 → 折叠真手牌 → 委托引擎的 chooseCard 完成真正的选择
   * → 把选中的假牌回映射成原牌放进 `result.links` → finally 中复原手牌布局并删除假牌。
   *
   * 为什么把选择委托给 chooseCard：对话框、提示计数、cardChooseAll、selectCard 范围解析、
   * AI 选牌、在线 / 多端、glow_result 等行为全部白拿，且天然与 chooseCard 保持一致；
   * 同时折叠的接管与复原能放进同一个 try / finally，即使中途抛错也一定复原。
   *
   * @type { ContentFuncByAll[] }
   */
  chooseFakeCard: [
    async function(a, t, e) {
      a.result = { bool: !1, cards: [], targets: [], buttons: [], links: [], confirm: "ok" };
      const r = Array.isArray(a.cards) ? a.cards.slice() : [];
      if (!r.length) return;
      const n = [];
      let s = null;
      const i = a.tagName ?? a.name, d = b in o.translate, u = o.translate[b];
      i && (o.translate[b] = f.translation(i));
      try {
        n.push(...c.createFakeCards(r)), n.forEach((l, m) => {
          l._cardid || (l._cardid = `whichWayFake_${m}_${f.id()}`);
        });
        const g = new Map(n.map((l, m) => [l, r[m]])), y = new Set(n);
        e.directgains(n, null, b), e == c.me && (s = Z(e, n));
        const C = {
          //position 固定为 "s"：只迭代「特殊区」。配合 filterCard 限定，
          //既不会误选真手牌，也不会误选木牛流马等其它既有的特殊区牌
          position: "s",
          //filterCard 需要额外包裹：只允许选中本次创建的假牌
          filterCard: (l, m, T) => y.has(l) && a.filterCard(l, m, T)
        };
        for (const l of te)
          a[l] != null && (C[l] = a[l]);
        const w = await e.chooseCard(C).forResult() || {}, _ = (w.cards || []).map((l) => g.get(l) || l);
        a.result = {
          ...w,
          bool: w.bool ?? !1,
          //cards 与本体 result 保持一致：就是玩家选中的那几张假牌
          cards: w.cards || [],
          //links 携带上面的假牌对应的真实值（本体在纯选牌场景下不会往 links 写内容）
          links: _
        }, a.glow_result && _.forEach((l) => l?.classList?.add("glow"));
      } finally {
        s && s(), n.length && c.deleteFakeCards(n), d ? o.translate[b] = u : delete o.translate[b];
      }
    }
  ],
  /**
   * 假牌选牌并选目标（`player.chooseFakeCardTarget()` 的 content）。
   *
   * 结构与 `chooseFakeCard` 完全一致：造牌 → 置入特殊区 → 折叠真手牌 → 委托本体 `chooseCardTarget`
   * 完成「选牌 + 选目标」→ 把选中的假牌回映射成原牌放进 `result.links`（`result.targets` 原样保留）→
   * finally 复原手牌布局并删除假牌。
   *
   * 为什么委托给本体 chooseCardTarget：cardChooseAll、提示计数、selectCard / selectTarget 范围门控、
   * `filterTarget(card, player, target)` 的目标侧语义、AI 选牌选目标（ai1 / ai2）、在线 / 多端、
   * 目标动画等全部白拿，且天然与 chooseCardTarget 保持一致；折叠的接管与复原同样放进同一个 try / finally。
   *
   * 与 chooseFakeCard 的唯一区别：这里的目标侧 `filterTarget` **原样透传**，收到的 `card` 就是玩家
   * 选中的那张假牌（与其原牌同名，`get.info` / `card.name` 一致），因此本体语义下无差别。
   *
   * @type { ContentFuncByAll[] }
   */
  chooseFakeCardTarget: [
    async function(a, t, e) {
      a.result = { bool: !1, cards: [], targets: [], links: [], confirm: "ok" };
      const r = Array.isArray(a.cards) ? a.cards.slice() : [];
      if (!r.length) return;
      const n = [];
      let s = null;
      const i = a.tagName ?? a.name, d = b in o.translate, u = o.translate[b];
      i && (o.translate[b] = f.translation(i));
      try {
        n.push(...c.createFakeCards(r)), n.forEach((l, m) => {
          l._cardid || (l._cardid = `whichWayFake_${m}_${f.id()}`);
        });
        const g = new Map(n.map((l, m) => [l, r[m]])), y = new Set(n);
        e.directgains(n, null, b), e == c.me && (s = Z(e, n));
        const C = {
          //position 固定为 "s"：Check.card 只迭代「特殊区」。配合 filterCard 限定，
          //既不会误选真手牌，也不会误选木牛流马等其它既有的特殊区牌
          position: "s",
          //filterCard 需要额外包裹：只允许选中本次创建的假牌
          filterCard: (l, m, T) => y.has(l) && a.filterCard(l, m, T)
        };
        for (const l of re)
          a[l] != null && (C[l] = a[l]);
        const w = await e.chooseCardTarget(C).forResult() || {}, _ = (w.cards || []).map((l) => g.get(l) || l);
        a.result = {
          ...w,
          bool: w.bool ?? !1,
          //cards 与本体 result 保持一致：就是玩家选中的那几张假牌
          cards: w.cards || [],
          //targets 原样保留（本体选目标阶段的产物）
          targets: w.targets || [],
          //links 携带上面的假牌对应的真实值
          links: _
        }, a.glow_result && _.forEach((l) => l?.classList?.add("glow"));
      } finally {
        s && s(), n.length && c.deleteFakeCards(n), d ? o.translate[b] = u : delete o.translate[b];
      }
    }
  ],
  /**
   * 同时选择角色与选项（`player.chooseTargetControl()` 的 content）。
   *
   * 布局：提示文本在对话框里，**选项渲染在 `ui.control`（`#control`）里**，与引擎的「确定」同栏
   * （`ui.create.control`，与本体 `chooseControl` 的 controlbar 形态一致）；角色仍在战场点选。
   * 目标选择由引擎的 `chooseTarget` 流程托管 —— 把自建 dialog 作为 `dialog` 传进去后，
   * 引擎会把 `prompt` 置为 false，于是它会跳过自建提示与 promptbar，但仍负责 AI / 在线 / 多端、
   * `selectTarget` 范围门控（不满足范围时「确定」不出现）与收尾关框。
   *
   * **结束条件：必须同时选定目标与选项才会结束**（本 content 的核心约束）：
   * - 引擎的「确定」由 `filterOk` 门控：本地交互时只有**已点选选项**（或该目标没有可选项）才会出现；
   *   目标数不满足 `selectTarget` 时引擎本来就不显示「确定」；
   * - 引擎的「取消」按钮被 `fakeforce` 隐藏，否则"只选目标、不选选项"也能结束，与上面的约束冲突；
   *   需要允许放弃的调用方，请在 `controls` 里自己加 `"cancel2"` —— 点它即取消
   *   （立即结束，`bool=false`、`control="cancel2"`，与本体 `chooseControl` 一致）。
   *
   * ⛔ 选项条目的点击**不能**走引擎默认的 `ui.click.control`：它会直接写 `_status.event.result`
   * 并无条件 `game.resume()`，把暂停中的目标选择提前结束（结果还缺 `bool/targets`）。
   * 这里用 `ui.create.control([...controls, handler])` 传入自定义处理函数：引擎会把它存进
   * `control.custom`，点击条目时以 `(link, node)` 调用并**跳过**默认逻辑（`ui/click/index.js`），
   * 于是我们只记录选项、刷新高亮，再调 `game.check()` 重算「确定」是否出现。
   *
   * 选项随目标联动：引擎在每次目标点选 / `game.check()` 后都会调用当前事件的 `custom.add.target`
   * （`ui/click/index.js`、`game/check.js`），我们在那里重建选项条；同时留档已选目标，
   * 因为取消时 `game.uncheck()` 会清空 `ui.selected.targets`，而结果里需要保留"选了人没选选项"的信息。
   *
   * @type { ContentFuncByAll[] }
   */
  chooseTargetControl: [
    async function(a, t, e) {
      a.result = { bool: !1, targets: [], control: void 0, index: -1, confirm: "cancel" };
      let r, n = [];
      const s = a.isMine();
      let i, d, u = null, g, y = !1;
      const C = (l) => {
        const m = typeof a.controls == "function" ? a.controls(l.slice()) : a.controls;
        return Array.isArray(m) ? m.slice() : [];
      };
      function w(l, m) {
        if (!(y || p.dragged || p.justdragged)) {
          if (y = !0, setTimeout(() => y = !1, 200), r = l, l === "cancel2") {
            x.confirm && (x.confirm.close(), delete x.confirm), x.click.cancel();
            return;
          }
          _(), c.check();
        }
      }
      function _() {
        const l = x.selected.targets.slice();
        l.length && (n = l);
        const m = C(l), T = m.join("\0");
        if (T !== u && (u = T, r != null && !m.includes(r) && (r = void 0), s && (m.length ? d ? d.replace(m.concat(w)) : d = x.create.control(m.concat(w)) : d && (d.close(), d = void 0))), !!d)
          for (const E of Array.from(d.childNodes)) E.classList.toggle("glow", E.link === r);
      }
      try {
        if (s && (c.uncheck(), i = x.create.dialog("", "hidden"), a.prompt && i.addText(a.prompt, a.prompt.length <= 20), a.prompt2 && i.addText(a.prompt2, a.prompt2.length <= 20), i.open(), _()), g = e.chooseTarget({
          filterTarget: a.filterTarget,
          selectTarget: a.selectTarget,
          //隐藏技能：与本体一致，引擎会在需要时（`_status.prehidden_skills`）直接取消本次选择
          hsskill: a.hsskill,
          ai: a.ai,
          forced: a.forced,
          dialog: i,
          //隐藏「取消」按钮：本函数的约束是"必须同时选定目标与选项才结束"（fakeforce 只影响这个按钮，
          //不影响 forced 对目标数下限的门控；想允许放弃的调用方请在 controls 里加 "cancel2"）
          fakeforce: !0,
          //「确定」门控：本地交互时必须已点选选项才会出现（见文件头注释）。
          //AI / 托管 / 联机客机走引擎自己的收尾（选项由事件结束后按 controlAi 补），这里不能拦：
          //引擎的 AI 分支会因 filterOk 不通过而直接取消事件，AI 就永远选不到选项了。
          filterOk: () => typeof a.filterOk == "function" && !a.filterOk() ? !1 : !s || p.auto || g?.result === "ai" ? !0 : r != null || !C(x.selected.targets.slice()).length
        }), s) {
          g.custom || (g.custom = { add: {}, replace: {} }), g.custom.add || (g.custom.add = {});
          const H = g.custom.add.target;
          g.custom.add.target = () => {
            typeof H == "function" && H.call(this), _();
          };
        }
        const l = await g.forResult() || {}, m = !!l.bool, T = m && Array.isArray(l.targets) ? l.targets.slice() : n.slice();
        if (r == null && T.length) {
          const H = C(T);
          if (H.length) {
            let A = typeof a.controlAi == "function" ? a.controlAi(a.getParent(), e) : void 0;
            typeof A == "number" && (A = H[A]), A == null && (A = H[0]), r = A;
          }
        }
        const E = C(T), L = r != null && E.includes(r) ? r : void 0, X = L != null && L !== "cancel2";
        a.result = {
          bool: m && X,
          targets: T,
          control: L,
          index: L != null ? E.indexOf(L) : -1,
          confirm: X ? "ok" : "cancel"
        };
      } finally {
        d && d.close(), i && i.close(), c.uncheck();
      }
    }
  ]
};
class ne extends o.element.Player {
  /**
   * 移除手牌中所有的（驶舰之向）提示
   * @param { string } id 删除指定id的描述，不填删除所有
   */
  removePromptSJZX(t) {
    this.getCards("h").forEach((r) => r.removePromptSJZX(t));
  }
  /**
   * 设置某一个技能的使用次数
   * @param { number } num 清除次数
   * @param { string } skill 技能名
   */
  setSkillCount(t, e) {
    this.getSkills().includes(t) || console.warn(`${f.translation(this)}(${this.name}) 没有技能 ${t}`), this.getStat("skill")?.[t] && (this.getStat("skill")[t] += e, typeof this.stat.allSkills == "number" && (this.stat.allSkills += e)), typeof this.storage?.counttrigger?.[t] == "number" && (this.storage.counttrigger[t] += e);
  }
  /**
   * 从传入的牌中选牌（假牌版）。
   *
   * 把 `params.cards` 里的每张牌复制成一张**假牌**直接置入自己的手牌（`directgains`，不触发获得事件），
   * 玩家从这些假牌中挑选；选择期间手牌分成两组：**一组折成只露左边缘的细条，另一组按引擎自己的折叠
   * 展示**（会折、会悬停摊开、有动画），默认折真牌、展开假牌。**点击折叠的那一组即可切换视图**
   * （点折叠的真牌 → 展开真牌、折叠假牌；点折叠的假牌 → 展开假牌、折叠真牌），
   * 折叠组的点击**不会选中牌**（选择期间它们的 `selectable` 被摘掉，重新展开时补回）。
   * 选择结束后假牌被全部删除、手牌布局完全复原。
   *
   * **参数是一个对象，字段与本体 `chooseCard` 一致**（`EventChooseCardParams`），另外多一个必填的 `cards`：
   * - `cards`（必填）供玩家选择的牌，由 `Card` / `VCard` 原对象组成的数组；
   * - `selectCard` 选择数量或范围（`number` 或 `[begin, end]`，`-1` 表示全选），默认 `[1, 1]`；
   * - `filterCard` 可选牌过滤（函数 / `get.filter` 用的对象 / `true`），默认 `lib.filter.all`；
   * - `ai` AI 选牌评分函数，默认 `get.unuseful3`；
   * - `forced` 是否强制选择，默认 false；
   * - `prompt` / `prompt2` / `promptx` 提示内容；
   * - `complexCard` / `complexSelect` / `allowChooseAll` / `filterOk` / `hsskill` / `type` 与 `chooseCard` 同义；
   * - `glow_result` 选完后高亮结果，注意高亮的是**原牌**（`result.links`），而不是选完即被删除的假牌；
   * - `tagName` 假牌 gaintag 的显示名：临时写进 `lib.translate`（引擎会把 gaintag 的翻译渲染在牌面上），
   *   选完还原；默认取事件名，常传技能名，这样牌面上显示技能的中文名；
   * - `position` 会被忽略：内部固定用 `"s"`（假牌所在的特殊区），以免误选真手牌。
   *
   * 与旧做法的区别：
   * - 临时牌走 `directgains` 带 gaintag，归入「特殊区」，因此**不污染真实手牌数据**
   *   （`countCards("h")` / 手牌上限 / 弃牌结算都只看到真牌）。
   * - `result.cards` 是玩家选中的假牌，它们对应的原牌（Card 或 VCard）放在 `result.links` 里。
   * - 手牌按"分组折叠"逐张定位，不依赖容器宽度，`single-handcard` 布局下同样成立。
   *
   * @param { import("@/library/element/Player/type.d").EventChooseCardParams & { cards: Array<Card|VCard> } } params 参数对象，见上方说明
   * @returns { GameEvent } 可链式 `.set(...)`、可 `.forResult()` 的事件；
   * result 形态与 `chooseCard` 一致（cards / targets / buttons / links / confirm / bool）。
   * 其中 `result.cards` 是玩家选中的**假牌**（与本体语义相同），而这些假牌选完即被删除，
   * 它们对应的真实值（调用方传入的 Card / VCard）放在 `result.links` 里；
   * 玩家未做出选择时 `result.bool` 为 false、`result.cards` 与 `result.links` 都是空数组。
   *
   * @example
   * ```js
   * const cards = player.getCards("h");
   * const result = await player
   * 	.chooseFakeCard({ cards, selectCard: 1, prompt: "请选择一张手牌" })
   * 	.forResult();
   * // result.cards[0] 是玩家选中的假牌，result.links[0] 才是 cards 里的那一张原牌
   * ```
   */
  chooseFakeCard(t) {
    const e = c.createEvent("chooseFakeCard");
    return e.player = this, Object.assign(e, t), e.filterCard != null && typeof e.filterCard == "object" && (e.filterCard = f.filter(e.filterCard)), typeof e.selectCard == "number" && (e.selectCard = [e.selectCard, e.selectCard]), t != null && t.prompt != null && (delete e.prompt, f.evtprompt(e, t.prompt)), e.cards = Array.isArray(e.cards) ? e.cards.slice(0) : [], e.filterCard == null && (e.filterCard = o.filter.all), e.selectCard == null && (e.selectCard = [1, 1]), e.ai == null && (e.ai = f.unuseful3), e.setContent("chooseFakeCard"), e._args = [t], e;
  }
  /**
   * 从传入的牌中选牌并选目标（假牌版）。
   *
   * 效果基于本体 `chooseCardTarget`：一次交互里既选牌又选目标，区别只在于**供选择的牌是假牌**。
   * 机制与 `chooseFakeCard` 完全一致 —— 把 `params.cards` 里的每张牌复制成假牌直接置入特殊区
   * （`directgains`，不触发获得事件），选择期间真手牌分组折叠、点折叠组切换视图，选完删除假牌并复原；
   * 不同之处在于底层委托的是本体 `chooseCardTarget`（而非 `chooseCard`），因此目标侧的
   * `filterTarget` / `selectTarget` / `ai2` 等全部沿用本体语义。
   *
   * 参数（对象式）= 本体 `chooseCardTarget` 的参数集（`EventChooseCardTargetParams`：`filterCard` /
   * `selectCard` / `filterTarget` / `selectTarget` / `ai1` / `ai2` / `filterOk` / `forced` / `prompt` /
   * `prompt2` / `hsskill` / `deadTarget` / `includeOut` / `complexSelect` / `allowChooseAll` 等），
   * 另多一个必填的 `cards`；`position` 会被忽略（内部固定 `"s"`，以免误选真手牌）；
   * `tagName` 与 `glow_result` 见 `chooseFakeCard` 同名字段。
   *
   * 结果：形态与本体 `chooseCardTarget` 一致（`cards` / `targets` / `bool` / `confirm`）。
   * 其中 `result.cards` 是玩家选中的**假牌**（选完即删除），它们对应的原牌（Card / VCard）放在
   * `result.links` 里；`result.targets` 就是本体选出的目标（不受假牌删除影响）。
   * 未做出选择时 `result.bool` 为 false，`cards` / `links` / `targets` 都是空数组。
   *
   * @param { import("@/library/element/Player/type.d").EventChooseCardTargetParams & { cards: Array<Card|VCard> } } params 参数对象，见上方说明
   * @returns { GameEvent } 可链式 `.set(...)`、可 `.forResult()` 的事件；`forResult()` 的返回值见 typings
   *
   * @example
   * ```js
   * const vcards = tricks.map(name => new lib.element.VCard({ name }));
   * const result = await player
   * 	.chooseFakeCardTarget({ cards: vcards, selectCard: 1, selectTarget: -1, prompt: "选择一张牌并选择目标" })
   * 	.forResult();
   * if (result.bool) {
   * 	// result.links[0] 是选中的原牌，result.targets 是选中的目标
   * }
   * ```
   */
  chooseFakeCardTarget(t) {
    const e = c.createEvent("chooseFakeCardTarget");
    return e.player = this, Object.assign(e, t), e.filterCard != null && typeof e.filterCard == "object" && (e.filterCard = f.filter(e.filterCard)), e.filterTarget != null && typeof e.filterTarget == "object" && (e.filterTarget = f.filter(e.filterTarget, 2)), typeof e.selectCard == "number" && (e.selectCard = [e.selectCard, e.selectCard]), typeof e.selectTarget == "number" && (e.selectTarget = [e.selectTarget, e.selectTarget]), t != null && t.prompt != null && (delete e.prompt, f.evtprompt(e, t.prompt)), e.cards = Array.isArray(e.cards) ? e.cards.slice(0) : [], e.filterCard == null && (e.filterCard = o.filter.all), e.filterTarget == null && (e.filterTarget = o.filter.all), e.selectCard == null && (e.selectCard = [1, 1]), e.selectTarget == null && (e.selectTarget = [1, 1]), e.ai1 == null && (e.ai1 = f.unuseful2), e.ai2 == null && (e.ai2 = f.attitude2), e.setContent("chooseFakeCardTarget"), e._args = [t], e;
  }
  /**
   * 同时选择角色（目标）与选项。
   *
   * 交互形态：**选项渲染在 `ui.control`（`#control`）里**，与引擎的「确定」同栏（与本体
   * `chooseControl` 的 controlbar 形态一致），角色仍在战场点选；选项支持随已选目标动态变化
   * （`controls` 可写成函数）。
   *
   * **必须同时选定目标与选项才会结束**：
   * - 「确定」由引擎生成并被门控 —— 只有已点选选项（或该目标确实没有可选项）才会出现，
   *   目标数不满足 `selectTarget` 范围时同样不会出现；
   * - 「取消」按钮被隐藏（`fakeforce`），所以**没有**"只选目标、不选选项"就结束的路径；
   * - 需要允许玩家放弃的调用方，请在 `controls` 里自己加 `"cancel2"` —— 点它即取消
   *   （立即结束，`bool=false`、`control="cancel2"`、`confirm="cancel"`，与本体 `chooseControl` 一致）。
   *
   * 参数（对象式，全部可选）：
   * - `filterTarget` / `selectTarget` / `filterOk` / `ai` / `forced` / `hsskill`：与本体 `chooseTarget` 完全一致；
   * - `controls`：选项列表，`string[]`；也可写成 `(targets: Player[]) => string[]` 以随已选目标动态生成；
   * - `choiceList`：等价于 `controls`（展示时会过 `get.translation`，值仍取原字符串）；
   * - `controlAi`：AI 选择选项的方式，`(event, player) => number | string`（number 取 `controls` 下标；缺省取第一个选项）；
   * - `prompt` / `prompt2`：对话框提示（`prompt` 支持 `get.evtprompt` 的 `"提示|提示2"` 写法）。
   *
   * 结果（`result`）：
   * - `bool`：**同时**选中了目标与选项（且选项不是 `"cancel2"`）才为 true（任一环节缺失都为 false）；
   * - `targets`：选中的角色。目标已选但未选选项（或选了 `"cancel2"` 取消）时**仍会保留**，便于调用方区分
   *   “完全没选人”与“选了人没选选项”；目标本身未选/被取消时为空数组；
   * - `control`：选中的选项原字符串（未选为 `undefined`；`"cancel2"` 视为取消）；
   * - `index`：`control` 在当时的选项列表中的下标（未选为 -1）；
   * - `confirm`：`"ok"` / `"cancel"`，与本体语义一致。
   *
   * @example
   * ```js
   * const result = await player
   * 	.chooseTargetControl({
   * 		filterTarget: (card, player, target) => target != player,
   * 		selectTarget: 1,
   * 		prompt: "选择一名角色，再选择一项",
   * 		//想允许玩家放弃时，把 "cancel2" 也放进来（点它即取消，与 chooseControl 一致）
   * 		controls: targets => (targets[0]?.countCards("h") > 0 ? ["弃置其一张牌", "令其摸一张牌"] : ["令其摸一张牌"]),
   * 	})
   * 	.forResult();
   * if (result.bool) {
   * 	// result.targets[0] 是选中的角色，result.control 是选中的选项
   * }
   * ```
   */
  chooseTargetControl(t) {
    const e = c.createEvent("chooseTargetControl");
    return e.player = this, Object.assign(e, t), typeof e.selectTarget == "number" && (e.selectTarget = [e.selectTarget, e.selectTarget]), e.filterTarget == null && (e.filterTarget = o.filter.all), e.selectTarget == null && (e.selectTarget = [1, 1]), e.ai == null && (e.ai = f.attitude2), e.controls == null && Array.isArray(e.choiceList) && (e.controls = e.choiceList.slice()), e.controls == null && (e.controls = []), t && t.prompt != null && (delete e.prompt, f.evtprompt(e, t.prompt)), e.setContent("chooseTargetControl"), e._args = [t], e;
  }
  /**
   * 显示提示
   * @param {string} str 显示的内容
   * @param {string} nature 颜色
   * @param {boolean} [clear=false] 是否清除原内容
   */
  showPrompt(t, e, r = !1) {
    let n;
    r === !0 && this.node.prompt && (this.node.prompt.remove(), delete this.node.prompt), this.node.prompt ? (n = this.node.prompt, n.innerHTML = n.innerHTML) : (n = x.create.div("promptCharacterSJZX", this), this.node.prompt = n, x.refresh(n)), n.classList.add("promptCharacterSJZX"), n.classList.add("hiddenSJZX"), n.innerHTML = n.innerHTML + t, n.dataset.nature = e || "soil", function(i) {
      if (!i) return;
      const d = i.querySelectorAll(".promptTextSJZX"), u = i.clientWidth;
      d.forEach((g) => {
        let y = parseFloat(window.getComputedStyle(g).fontSize);
        const C = () => g.offsetWidth > u - 10;
        for (; C() && y > 12; )
          y -= 1, g.style.fontSize = `${y}px`;
      });
    }(n), requestAnimationFrame(() => {
      n.classList.remove("hiddenSJZX");
    });
  }
  /**
   * @description: 获取卡牌的使用次数，cardusable返回的是false则为0次
   * @param {string | VCard} card 牌
   * @param {boolean} pure 是否仅返回次数
   *
   * @return {number}
   */
  getCardUsable2(t, e) {
    var r = this;
    typeof t == "string" && (t = { name: t }), t = f.autoViewAs(t);
    var n = f.info(t).usable;
    return typeof n == "function" && (n = n(t, r)), n = c.checkMod(t, r, n, "cardUsable", r), typeof n == "boolean" && n === !1 ? 0 : typeof n != "number" ? 1 / 0 : !e && p.currentPhase == r ? n - r.countUsed(t) : n;
  }
  /**
   * @description: 是否满足某个应变条件
   * @param {string | 'kongchao' | 'canqu' | 'zhuzhan' | 'fujia' } conditional 条件
   * @param {GameEvent} event 事件
   *
   * @return {boolean}
   */
  satisfyYingbian(t, e = f.event()) {
    const r = new Map([...o.yingbian.condition.simple, ...o.yingbian.condition.complex]);
    if (typeof t != "string") throw new TypeError("The parameter type is incorrect");
    if (!Array.from(r.keys()).includes(t)) throw new Error("The conditional does not exist");
    const n = r.get(t);
    return e.forceYingbian === !0 ? !0 : n(e);
  }
  /**
   * @description: 重新隐匿
   * @param {boolean} noChange 是否不改变体力/体力上限
   * @return {void}
   */
  async reUnseen(t) {
    var e = this, r = e.name || e.name1;
    let n = "noChangeSJZX_mark" + r;
    if (t != !1 && (o.skill[n] = {
      charlotte: !0,
      mark: !0,
      intro: {
        content: "隐匿前体力值"
      }
    }, o.translate[n] = `${e.hp}/${e.maxHp}`, e.storage[n] = {
      hp: e.hp,
      maxHp: e.maxHp
    }, e.addTempSkill(n, { player: "showCharacterAfter" }), e.when("showCharacterAfter").then(() => {
      e.hp = hp, e.maxHp = maxHp, delete e.storage[n];
    }).vars({
      hp: e.hp,
      maxHp: e.maxHp,
      skillName: n
    })), r && o.character[r]) {
      e.storage.rawHp = e.hp, e.storage.rawMaxHp = e.maxHp, e.hp = 1, e.maxHp = 1, e.update();
      var s = o.character[r][3].slice(0);
      if (e.name2)
        for (var i of o.character[e.name2][3])
          s.add(i);
      for (var i = 0; i < s.length; i++)
        o.translate[s[i] + "_info"] || s.splice(i--, 1);
      for (var i of s)
        e.removeSkill(i);
      e.hiddenSkills || (e.hiddenSkills = []), e.hiddenSkills.addArray(s), e.classList.add("unseen"), e.name2 && e.classList.add("unseen2"), e.name = "unknown", !e.node.name_seat && !p.video && (e.node.name_seat = x.create.div(".name.name_seat", f.verticalStr(f.translation(e.name)), e), e.node.name_seat.dataset.nature = f.groupnature(e.group)), e.sex = "male", e.storage.nohp = !0, e.node.hp.hide(), e.update();
    }
    t != !1 && setTimeout(() => {
      let d = document.querySelector(".mark-text.small-text");
      d && d.textContent && (d.textContent = o.translate[n]);
    }, 500);
  }
  adjustHandCardTo(t) {
    if (typeof t != "number") return console.error("ERROR:num must be number!");
    let e = this.countCards("h") - t;
    e > 0 ? this.chooseToDiscard({
      forced: !0,
      prompt: `请弃置${f.cnNumber(this.countCards("h") - t)}张牌`,
      selectCard: e,
      filterCard: () => !0
    }) : e < 0 && this.draw(Math.abs(e));
  }
  canUseCardAtt(t, e, r) {
    return r === void 0 && (r = !0), e === void 0 && (e = !0), c.hasPlayer((n) => {
      var s = f.attitude(n, this);
      return this.canUse(t, n, r) && (e == !0 ? s > 0 : s < 0);
    });
  }
  getNumberInRange() {
    for (var t = 0, e = c.filterPlayer(), r = 0; r < e.length; r++)
      this.inRange(e[r]) && t++;
    return t;
  }
  /**
   * @param {string} mark
   * @param {string} path
   * @param {boolean} bool
   * @description 改变标记图片
   */
  changeMarkImage(t, e, r = !1) {
    r ? e = 'url("' + e + '")' : e = 'url("extension/WhichWay/image/skill/' + e + '.png")', this.marks[t] && (this.marks[t].style.backgroundImage = e);
  }
  recastCount() {
    return !this.storage._recastGain || typeof this.storage._recastGain != "number" ? 0 : this.storage._recastGain;
  }
  isAction() {
    for (var t = this.actionHistory, e = t.length - 1; e >= 0; e--) {
      if (t[e].isMe) return !0;
      if (t[e].isRound) break;
    }
    return !1;
  }
  removeAllmark(t, e = !0) {
    return this.unmarkSkill(t), e == !1 ? this.removeMark(t, this.countMark(t), !1) : this.removeMark(t, this.countMark(t));
  }
  isTypeExpansions(t, e) {
    return !!this.getExpansions(t).filter(function(r) {
      return f.type2(r) == e;
    }).length;
  }
  isPhase(t, e) {
    return !e && p.currentPhase != this ? !1 : p.event.name == t || p.event.getParent(t).name == t;
  }
  canUseToAnyone(t, e = !0, r = !0) {
    typeof t == "string" && (t = { name: t, isCard: !0 });
    for (var n = 0; n < c.players.length; n++)
      if (!(r == !1 && c.players[n] == this)) {
        if (e != !1) {
          if (this.canUse(t, c.players[n], !1))
            return !0;
        } else if (this.canUse(t, c.players[n]))
          return !0;
      }
    return !1;
  }
  isMaxHandCardLimit(t) {
    for (var e = this.getHandcardLimit(), r = 0; r < c.players.length; r++)
      if (!(c.players[r].isOut() || c.players[r] == this)) {
        if (t) {
          if (c.players[r].getHandcardLimit() >= e) return !1;
        } else if (c.players[r].getHandcardLimit() > e) return !1;
      }
    return !0;
  }
  isMinHandCardLimit(t) {
    for (var e = this.getHandcardLimit(), r = 0; r < c.players.length; r++)
      if (!(c.players[r].isOut() || c.players[r] == this)) {
        if (t) {
          if (c.players[r].getHandcardLimit() <= e) return !1;
        } else if (c.players[r].getHandcardLimit() < e) return !1;
      }
    return !0;
  }
  getSkillsList(t, e) {
    t !== !0 && (t = !1), typeof e == "string" && (e = [e]);
    let r = this;
    var n = [], s = [], i = [];
    r.name1 != null ? s = o.character[r.name1][3] : s = o.character[r.name][3], r.name2 != null && (i = o.character[r.name2][3]), s = s.concat(i);
    for (var d = function(y) {
      var C = f.info(y);
      if (!C || C.charlotte) return !1;
      if (Array.isArray(e)) {
        for (var w of e)
          if (C[w]) return !1;
      }
      return !0;
    }, u = 0; u < s.length; u++)
      d(s[u]) && n.add(s[u]);
    if (r.disabledSkills && t)
      for (var g in r.disabledSkills)
        n.remove(g);
    return n;
  }
}
class ae extends o.element.Card {
  /**
   * 移除卡牌上的（驶舰之向）提示
   * @param {string} [id] 只移除该 id 的提示；不传则移除全部
   * @returns {this}
   */
  removePromptSJZX(t) {
    return V(this, typeof t == "string" ? t : void 0), this;
  }
  /**
   * 在卡牌上添加一条提示（同 id 则更新文本）
   *
   * DOM 与样式都在 `src/tips/promptSJZX.vue` 组件里（wrapper 也由组件渲染，
   * 不会再出现"没有 `.promptSJZX-Wrapper` 祖先导致样式匹配不上"的问题）。
   * @param {string} str 提示内容（按 HTML 渲染）
   * @param {string} [id] 提示 id，缺省用内容本身
   * @returns {this}
   */
  addPromptSJZX(t, e) {
    return Y(this, { id: e || t, text: t, type: "card" }), this;
  }
  isConnect() {
    return c.broadcastAll(() => {
      p.sxrmConnectCards ??= [];
    }), p.sxrmConnectCards.includes(this);
  }
  addConnect() {
    if (this.isConnect()) return this;
    c.broadcastAll((e) => {
      e.addGaintag("visible_sxrm_connect_tag"), p.sxrmConnectCards.add(e);
    }, this);
    const t = f.owner(this);
    return t?.isIn() && t.markSkill("_sxrm_connect"), this.refreshMark(), this;
  }
  removeConnect() {
    return p.sxrmConnectCards ??= [], p.sxrmConnectCards.remove(this), c.broadcast((t) => {
      p.sxrmConnectCards = t;
    }, p.sxrmConnectCards), c.broadcastAll((t) => {
      t.removeGaintag("visible_sxrm_connect_tag");
    }, this), this.refreshMark(), this;
  }
  refreshMark() {
    c.filterPlayer((t) => {
      t.getCards("h", (e) => e.isConnect()).length ? t.markSkill("_sxrm_connect") : t.unmarkSkill("_sxrm_connect");
    });
  }
}
class se extends B {
  /**
   * 获得所有连接牌
   * @returns { Card[] | Array }
   */
  getConnectCards() {
    return p.sxrmConnectCards || [];
  }
  /**
   * 刷新连接标记
   */
  refreshMark() {
    c.filterPlayer((t) => {
      t.getCards("h", (e) => e.isConnect()).length ? t.markSkill("_sxrm_connect") : t.unmarkSkill("_sxrm_connect");
    });
  }
  /**
   * 统计所有玩家身上指定标记的数量总和
   *
   * 该函数会遍历所有玩家（或包括死亡玩家），根据过滤条件统计指定标记名称的总数量。
   *k0
   * @param {string} name - 要统计的标记名称
   * @param {Function} [filter=()=>true] - 过滤函数，用于筛选需要统计的玩家，默认为全部玩家
   * @param {boolean} [includeDeath=false] - 是否包含死亡玩家，默认不包含
   * @returns {number} 返回所有符合条件的玩家身上的标记总数
   *
   * @example
   * // 统计所有玩家身上的"sha"标记总数
   * const totalShaMarks = game.countMark("sha");
   *
   * @example
   * // 统计存活玩家中，与当前玩家同阵营的"tao"标记总数
   * const sameGroupTaoMarks = game.countMark("tao", (player) => player.group === _status.event.player.group);
   *
   * @example
   * // 统计所有玩家（包括死亡玩家）身上的"fire"标记总数
   * const totalFireMarks = game.countMark("fire", ()=>true, true);
   */
  countMark(t, e, r = !1) {
    let n = 0, s = r ? c.players.concat(c.dead) : c.players;
    typeof e != "function" && (e = () => !0);
    for (let i of s)
      e(i) && (n += i.countMark(t));
    return n;
  }
  /**
   * @param { string } name
   * @param {*} info
   * @param { { translate: string, config: { [key: string]: object } } } info2
   */
  addModeSJZX(t, e, r) {
    o.config.all.mode.push(t), o.translate[t] = r.translate;
    let n, s = p.extension || r.extension;
    e.splash ? n = e.splash : p.evaluatingExtension ? n = "extension-" + s + ":image/mode/backgroud/" + t + ".jpg" : n = "ext:" + s + "/image/mode/backgroud/" + t + ".jpg", o.mode[t] = {
      name: r.translate,
      config: r.config,
      splash: n,
      fromextension: !0
    }, o.init["setMode_" + t] = async () => {
      await c.import("mode", (i, d, u, g, y, C) => (e.name = t, e));
    }, o.config.extensionInfo[s] || (o.config.extensionInfo[s] = {}), o.config.extensionInfo[s].mode || (o.config.extensionInfo[s].mode = []), o.config.extensionInfo[s].mode.indexOf(t) == -1 && o.config.extensionInfo[s].mode.push(t), c.saveConfig("extensionMode", o.config.extensionInfo);
  }
  totalmark(t) {
    let e = 0;
    for (let r = 0; r < c.players.length; r++)
      c.players[r].hasMark(t) && (e += c.players[r].countMark(t));
    return e;
  }
  shushuRDbet(t, e) {
    let r = (t + e) / 2;
    return Math.random() < 0.8 ? Math.floor(Math.random() * (e - r + 1)) + r : Math.floor(Math.random() * (r - t + 1)) + t;
  }
  RDNbet(t, e) {
    let r = 0;
    for (let n = 0; n < 6; n += 1)
      r += Math.random();
    return r = r / 6, Math.floor(r * (e - t + 1) + t);
  }
  RDbet(t, e) {
    return Math.floor(Math.random() * (e - t + 1) + t);
  }
  mostStr(t) {
    let e = t.slice().sort(), r = 0, n = [], s = 1, i = e[0];
    for (let d = 1; d <= e.length; d++)
      d < e.length && e[d] === i ? s++ : (s >= r && (s > r && (n = []), r = s, n.push(i)), d < e.length && (i = e[d], s = 1));
    return n;
  }
  getGlobalmark(t) {
    for (var e = 0, r = 0; r < c.players.length; r++) {
      var n = c.players[r];
      n.hasMark(t) && (e += n.countMark(t));
    }
    return e;
  }
}
class ie extends q {
  /**
   * 获取此牌的目标数
   * @param { VCard | string } card
   * @returns {number}
   */
  targetCounts(t) {
    let e = t?.name;
    if (typeof t == "string") e = t;
    else if (t === void 0) return 0;
    let r = o.card[e];
    return !r || r.notarget ? 0 : r.selectTarget !== void 0 ? Array.isArray(r.selectTarget) ? Math.max(...r.selectTarget) : r.selectTarget === -1 && r.toself ? 1 : r.selectTarget === -1 ? 1 / 0 : r.selectTarget : r.filterTarget ? 1 : 0;
  }
  /**
   * @description: 判断该牌是否为单一目标
   * @param {Card | string} card
   *
   * @return {boolean}
   */
  isSingle(t) {
    typeof t == "string" && (t = { name: t });
    let e = f.info(t);
    return !e.notarget && e.selectTarget === 1;
  }
  isView(t) {
    if (Array.isArray(t)) {
      for (var e of t)
        if (this.isView(e)) return !0;
      return !1;
    } else {
      if (t && f.is.object(t))
        return !t.cards || !t.cards[0] || t.cards.length > 1 || t.name != t.cards[0].name;
      throw new Error(
        "The first parameter of type must be Array or VCard!"
      );
    }
  }
  tranPhase(t) {
    let e = [
      "phaseZhunbei",
      "phaseJudge",
      "phaseDraw",
      "phaseUse",
      "phaseDiscard",
      "phaseJieshu"
    ], r = [
      "准备阶段",
      "判定阶段",
      "摸牌阶段",
      "出牌阶段",
      "弃牌阶段",
      "结束阶段"
    ];
    if (typeof t == "string") {
      for (let n = 0; n < e.length; n++)
        if (t === e[n])
          return r[n];
    } else if (Array.isArray(t)) {
      let n = [];
      return t.forEach((s) => {
        for (let i = 0; i < e.length; i++)
          if (s === e[i]) {
            n.push(r[i]);
            break;
          }
      }), n;
    }
  }
  randomNumberSJZX() {
    return Math.floor(Math.random() * 1e6).toString().padStart(6, "0") + "SJZX";
  }
}
class oe extends o.element.GameEvent {
  getChildren(t, e = 20) {
    let r = this;
    if (e <= 0) return {};
    let n = t;
    if (t === void 0)
      return console.warn("getChildren: filter is not a function or string !"), {};
    if (typeof t == "string") {
      const s = t;
      n = (i) => i.name === s;
    }
    if (n(r))
      return r;
    for (const s of this.childEvents || []) {
      const i = s.getChildren(t, e - 1);
      if (i && Object.keys(i).length > 0)
        return i;
    }
    return {};
  }
}
class le extends Array {
  /**
   * 判断两个数组是否相等
   * @param { Array } arr
   * @returns { boolean } 
   */
  isEquip(t) {
    if (this.length !== t.length) return !1;
    for (let e = 0; e < this.length; e++)
      if (this[e] !== t[e]) return !1;
    return !0;
  }
  /**
   * 异步串行遍历数组，对每个元素执行 async 回调（一个接一个地 await）。
   * @param {(value: any, index: number, array: any[]) => Promise<void>} callback - 异步回调函数
   * @param {any} [thisArg] - 回调中 `this` 的值（可选）
   * @returns {Promise<void>}
   */
  async asyncForEach(t, e) {
    for (let r = 0; r < this.length; r++)
      await t.call(e, this[r], r, this);
  }
  /**
   * @deprecated
   */
  add2() {
    for (var t = 0; t < arguments.length; t++)
      this.push(arguments[t]);
    return this;
  }
  /**
   * @deprecated
   */
  randomGet2(t) {
    return this.randomGets(t);
  }
  isSubset(t) {
    return this.every((e) => t.includes(e));
  }
  /**
   * 在数组中插入元素
   *
   * @param {*} target - 目标元素或索引位置
   * @param {*} element - 要插入的元素
   * @param {boolean} [isAfter=true] - 是否插入到目标元素之后，默认为true
   * @param {boolean} [fix=true] - 是否直接修改原数组，默认为true
   * @param {boolean} [byIndex=false] - 是否按索引查找目标位置，默认为false
   * @returns {Array} 返回修改后的数组或新数组
   *
   * @description
   * 该方法允许在数组的指定位置插入元素，支持按值查找或按索引定位。
   * 当byIndex为true时，target被视为索引；否则target被视为要查找的元素值。
   * 支持负数索引，-1表示最后一个元素，-2表示倒数第二个元素，以此类推。
   *
   * @example
   * // 按值查找插入
   * let arr = [1, 2, 4];
   * arr.insert(2, 3); // 在元素2之后插入3，结果为[1, 2, 3, 4]
   *
   * @example
   * // 按索引插入
   * let arr = [1, 2, 4];
   * arr.insert(1, 3, true, true, true); // 在索引1之后插入3，结果为[1, 2, 3, 4]
   *
   * @example
   * // 在开头插入（不修改原数组）
   * let arr = [2, 3, 4];
   * let newArr = arr.insert(2, 1, false, false); // 在元素2之前插入1，返回新数组[1, 2, 3, 4]
   *
   * @example
   * // 使用负数索引
   * let arr = [1, 2, 4];
   * arr.insert(-1, 3, true, true, true); // 在倒数第一个元素之后插入3，结果为[1, 2, 4, 3]
   */
  insert(t, e, r = !0, n = !0, s = !1) {
    let i = n ? this : d(this);
    if (s) {
      if (typeof t == "number" && t >= -i.length - 1 && t <= i.length) {
        let u = t < 0 ? i.length + t + 1 : t, g = r ? u + 1 : u;
        i.splice(g, 0, e);
      }
    } else {
      let u = i.indexOf(t);
      if (u !== -1) {
        let g = r ? u + 1 : u;
        i.splice(g, 0, e);
      }
    }
    return n ? this : i;
    function d(u) {
      if (u === null || typeof u != "object")
        return u;
      if (u instanceof Date)
        return new Date(u.getTime());
      if (u instanceof Array)
        return u.map((g) => d(g));
      if (typeof u == "object") {
        const g = {};
        for (let y in u)
          u[y] && (g[y] = d(u[y]));
        return g;
      }
    }
  }
}
class ce extends HTMLDivElement {
  /**
   * 当HTMLDivElement被移除时触发的回调方法
   * @param {Function} callback - 元素被移除时执行的回调函数
   * @returns {Function} 返回一个可以手动取消监听的方法
   */
  //@ts-ignore
  onRemoved(t) {
    if (typeof t != "function")
      throw new TypeError("Callback must be a function");
    const e = this;
    let r;
    const n = () => {
      document.body.contains(e) || (r.disconnect(), setTimeout(() => {
        t();
      }, 10));
    };
    return r = new MutationObserver((s) => {
      n();
    }), r.observe(document.documentElement, {
      childList: !0,
      subtree: !0
    }), document.body.contains(e) ? () => {
      r?.disconnect();
    } : (r.disconnect(), setTimeout(() => {
      t();
    }, 10), () => {
    });
  }
}
const fe = {
  HMS: {
    HMS_Anson: "安森",
    HMS_Rodney: "罗德尼",
    HMS_Nelson: "纳尔逊",
    HMS_Hood: "胡德",
    HMS_Repulse: "声望",
    HMS_Renown: "反击",
    HMS_Furious: "暴怒",
    HMS_Aurora: "曙光",
    HMS_York: "约克",
    HMS_Kent: "肯特",
    HMS_London: "伦敦",
    HMS_Zulu: "祖鲁",
    HMS_Tartar: "鞑靼",
    HMS_Javelin: "标枪",
    HMS_Kelly: "凯利",
    HMS_Legion: "军团",
    HMS_Matchless: "无比",
    HMS_Belfast: "贝法",
    HMS_Formidable: "可畏",
    HMS_Illustrious: "光辉",
    HMS_Valiant: "勇士",
    HMS_Fiji: "斐济",
    HMS_Jupiter: "木星",
    HMS_Glory: "光荣",
    HMS_Falcon: "猎鹰",
    HMS_Phoebe: "菲比",
    HMS_Dido: "狄多",
    HMS_Archer: "弓手"
  },
  trigger: {
    name: o.hookmap,
    translation: {
      addJudgeAfter: "添加判定牌后",
      addToExpansionAfter: "将牌移除游戏后",
      changeHp: "体力值改变",
      chooseToRespondBegin: "选择牌去响应后",
      damage: "受到伤害",
      damageAfter: "受到伤害后",
      damageBegin: "受到伤害时",
      die: "死亡",
      dieBegin: "死亡时",
      discardAfter: "弃牌后",
      dying: "进入濒死状态",
      equipAfter: "使用装备后",
      gainAfter: "获得牌后",
      gainMaxHpBegin: "获得体力上限时",
      judgeEnd: "判定后",
      logSkill: "触发技能",
      loseAfter: "失去牌后",
      loseMaxHpBegin: "失去体力上限时",
      phaseAfter: "回合结束时",
      phaseBegin: "回合开始时",
      respondBegin: "响应牌时",
      respondEnd: "响应牌后",
      showCharacter: "武将登场",
      useCard: "使用牌时"
    },
    get() {
      const a = ["Begin", "After", "End"], t = { ...this.translation };
      for (let r of o.phaseName) this.translation[r] = f.translation(r);
      for (let r in this.translation)
        a.some((n) => r.endsWith(n)) || (t.hasOwnProperty(r + "Begin") || (t[r + "Begin"] = this.translation[r] + "时", delete t[r]), t.hasOwnProperty(r + "After") || (t[r + "After"] = this.translation[r] + "后", delete t[r]));
      return {
        triggers: Object.keys(this.name).filter((r) => r in t),
        translation: t
      };
    }
  },
  filter: {
    damage_no: {
      intro: "本回合没有造成伤害",
      filter: function(a, t) {
        return !t.getHistory("sourceDamage").length;
      }
    },
    damage_yes: {
      intro: "本回合造成过伤害",
      filter: function(a, t) {
        return t.getHistory("sourceDamage").length;
      }
    },
    draw_yes: {
      intro: "本回合摸过牌",
      filter: function(a, t) {
        return t.getHistory("gain", function(e) {
          return e.getParent().name == "draw";
        }).length > 1;
      }
    },
    draw_no: {
      intro: "本回合没有摸过牌",
      filter: function(a, t) {
        return t.getHistory("gain", function(e) {
          return e.getParent().name == "draw";
        }).length < 1;
      }
    },
    loseCard_yes: {
      intro: "本回合失去过牌",
      filter: function(a, t) {
        return t.getHistory("lose").length;
      }
    },
    loseCard_no: {
      intro: "本回合没有失去过牌",
      filter: function(a, t) {
        return !t.getHistory("lose").length;
      }
    },
    useCard_yes: {
      intro: "本回合使用过牌",
      filter: function(a, t) {
        return t.getHistory("useCard").length > 0;
      }
    },
    useCard_no: {
      intro: "本回合没有使用过牌",
      filter: function(a, t) {
        return t.getHistory("useCard").length <= 0;
      }
    },
    countCard_bigger: {
      intro: "手牌数大于X",
      filter: function(a, t, e) {
        return t.countCards("h") > p.weinaData[e].random.num.num(a, t);
      }
    },
    countCard_lower: {
      intro: "手牌数小于X",
      filter: function(a, t, e) {
        return t.countCards("h") < p.weinaData[e].random.num.num(a, t);
      }
    },
    countHp_bigger: {
      intro: "体力值大于X",
      filter: function(a, t, e) {
        return t.hp > p.weinaData[e].random.num.num(a, t);
      }
    },
    countHp_lower: {
      intro: "体力值小于X",
      filter: function(a, t, e) {
        return t.hp < p.weinaData[e].random.num.num(a, t);
      }
    },
    countloseCard_bigger: {
      intro: "本回合失去过不少于X牌",
      filter: function(a, t, e) {
        return t.getHistory("lose").length > p.weinaData[e].random.num.num(a, t);
      }
    },
    countloseCard_lower: {
      intro: "本回合失去过至多X张牌",
      filter: function(a, t, e) {
        return !t.getHistory("lose").length < p.weinaData[e].random.num.num(a, t);
      }
    },
    countUseCard_bigger: {
      intro: "本回合使用过至少X+1张牌名不同的牌",
      filter: function(a, t, e) {
        return Object.keys(t.getStat().card).length > p.weinaData[e].random.num.num(a, t);
      }
    },
    countUseCard_lower: {
      intro: "本回合使用过至多X+1张牌名不同的牌",
      filter: function(a, t, e) {
        return Object.keys(t.getStat().card).length < p.weinaData[e].random.num.num(a, t);
      }
    }
  },
  content: {
    get() {
      return {
        ...this.card,
        ...this.target.solo
      };
    },
    card: {
      views: {
        intro: "视为使用一张【$name】",
        content() {
          player.hasUseTarget(event.weinaData.name) && player.chooseUseTarget({ name: event.weinaData.name, isCard: !0 });
        }
      },
      choose: {
        intro: "使用一张【$name】",
        content() {
          player.hasUseTarget(event.weinaData.name) && player.chooseToUse(`你可以使用一张${f.translation(event.weinaData.name)}`, (a) => f.name(a) == event.weinaData.name);
        }
      }
    },
    target: {
      solo: {
        draw: {
          intro: "摸一张牌",
          content() {
            player.draw();
          }
        },
        draw_x: {
          intro: "摸X张牌",
          content() {
            player.draw(event.weinaData.num);
          }
        },
        recover: {
          intro: "回复一点体力",
          content() {
            player.recover();
          }
        },
        reset: {
          intro: "复原武将牌",
          content() {
            player.turnOver(!1), player.link(!1);
          }
        },
        gain: {
          intro: "获得一名其他角色的一张牌",
          content() {
            "step 0";
            player.chooseTarget("请选择一名其他角色", function(a, t, e) {
              return e != t;
            }).set("ai", (a) => f.attitude2(player) < 0), result.targets && player.gainPlayerCard("hej", result.targets[0], !0).set("target", result.targets[0]).set("complexSelect", !1).set("ai", o.card.shunshou.ai.button);
          }
        },
        jump: {
          intro: "跳过$phase阶段",
          content() {
            player.skip(event.weinaData.phase);
          }
        }
      }
    }
  },
  x: {
    group: {
      intro: "场上势力数",
      num() {
        return c.countGroup();
      }
    },
    damage: {
      intro: "本回合造成伤害数",
      num(a, t) {
        let e = t.getStat().damage;
        return typeof e == "number" ? e : 0;
      }
    },
    type: {
      intro: "手牌中牌的类型数",
      num(a, t) {
        return new Set(t.getCards("h").map((e) => f.type2(e))).size;
      }
    },
    maxHp: {
      intro: "你的体力上限",
      num(a, t) {
        return t.maxHp;
      }
    }
  },
  getName() {
    return o.inpile.filter((t) => f.type(t) !== "delay" && f.type(t) !== "equip").randomGet();
  },
  getPhase() {
    return o.phaseName.randomGet();
  },
  getInfo(a, t = "", e = {}, r) {
    a || (a = this);
    for (let n in a)
      if (typeof a[n] == "object" && a[n] !== null && !Array.isArray(a[n]) && this.getInfo(a[n], n, e, r), n === "intro") {
        let s = a[n];
        s = s.replace(/\$name/g, f.translation(r.name)).replace(/\$phase/g, f.translation(r.phase)).replace(/X/g, `X(${r.num?.intro || "default"})`), e[t] = s;
      }
    return e;
  },
  findKey(a, t) {
    const e = [];
    switch (a) {
      case "triggers":
        a = this.trigger.get().translation;
        break;
      case "filter":
        a = this.filter;
        break;
      case "content":
        a = this.content.get();
        break;
    }
    function r(n) {
      for (const s in n)
        n.hasOwnProperty(s) && (s === t && e.push({ [s]: n[s] }), typeof n[s] == "object" && n[s] !== null && r(n[s]));
    }
    return r(a), e;
  }
};
window.whichWaySave.weinaData = fe;
window.whichWay.nonameEx ??= {};
const v = window.whichWay.nonameEx;
v.customFuc = {
  skill: ee
};
v.jsExt ??= {};
v.ArrayExt = D(le, Array.prototype, Array.prototype);
v.HTMLDivElementExt = D(ce, HTMLDivElement.prototype);
Q({
  name: "WhichWayNonameEx",
  fn: async () => {
    v.CardExt = D(ae, o.element.card), v.PlayerExt = D(ne, o.element.player), v.GameExt = D(se, B.prototype), v.GetExt = D(ie, q.prototype), v.GameEventExt = D(oe, o.element.GameEvent.prototype), v.ContentExt = j, Object.assign(o.element.content, j), await import("./nonameEx-custom-override.js");
  }
});
function D(a, t, e) {
  e = e || Object.getPrototypeOf(t);
  const r = Object.getOwnPropertyDescriptors(a.prototype), n = {};
  for (const [s, i] of Object.entries(r))
    s !== "constructor" && typeof i.value == "function" && (s in e || (Object.defineProperty(t, s, {
      ...i,
      enumerable: !1,
      configurable: !0,
      writable: !0
    }), n[s] = i.value));
  return {
    injected: n,
    count: Object.keys(n).length,
    target: t,
    source: a,
    base: e,
    timestamp: Date.now()
  };
}
