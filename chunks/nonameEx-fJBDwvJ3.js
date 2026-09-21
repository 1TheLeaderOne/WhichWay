import { game as l, ui as x, _status as g, lib as i, get as m, Game as B, Get as j } from "noname";
import { r as V, a as K } from "./tips-prompt-shared-DbrTQVVF.js";
import { onBeforeContent as Y } from "./hooks-BscfO9lD.js";
import { s as Q } from "./nonameEx-custom-skill-shared-lwtFvTKr.js";
const X = "whichWayFakeCard", ee = ["prompt", "prompt2", "promptx", "selectCard", "filterOk", "ai", "forced", "complexCard", "complexSelect", "allowChooseAll", "hsskill", "type"];
function te(a, t) {
  const e = a.node.handcards1, r = a.node.handcards2, n = x.handcards1Container, s = x.handcards2Container;
  if (!n || !e) return null;
  const o = new Set(t), f = 10;
  let u = "real";
  const d = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
  let k = 0;
  const S = [], _ = [
    { inner: e, outer: n },
    { inner: r, outer: s }
  ], h = x.updatehl, p = (c) => o.has(c) || c.classList.contains("glows"), v = (c) => u === "fake" ? p(c) : !p(c), A = (c) => {
    let C = 0;
    for (const { inner: b } of _)
      if (b)
        for (const P of b.childNodes) {
          const F = (
            /** @type { HTMLElement } */
            P
          );
          !F.classList || !F.classList.contains("card") || F.classList.contains("removing") || p(F) === c && C++;
        }
    return C;
  }, E = () => {
    const c = u === "real" ? "fake" : "real";
    A(c === "fake") && (u = c, x.updatehl());
  }, G = function() {
    if (g.dragged || g.justdragged || !v(this) || this.classList.contains("removing")) return;
    const c = Date.now();
    c - k < 350 || (k = c, E());
  }, H = (c) => {
    y.has(c) || (y.add(c), c.addEventListener(i.config.touchscreen ? "touchend" : "click", G));
  }, T = () => {
    const c = x._handcardHover;
    for (const { inner: C, outer: b } of _) {
      if (!C || !b || !C.childNodes.length) continue;
      const P = Array.from(C.childNodes).filter(
        (L) => L.classList && L.classList.contains("card") && !L.classList.contains("removing")
      );
      if (!P.length) continue;
      const F = (L, I, w) => {
        const O = /translateX\((-?[\d.]+)px\)/.exec(L.style.transform || "");
        return O ? parseFloat(O[1]) : I * w;
      }, R = i.config.fold_card && P.length > 1 ? Math.max(32, Math.min(112, (b.offsetWidth - 128) / (P.length - 1))) : 112;
      let U = 0, $, N = 0;
      P.forEach((L, I) => {
        const w = (
          /** @type { HTMLElement } */
          L
        );
        if (H(w), v(w)) {
          const z = w === c ? Math.max(f, w.offsetWidth || 0) : f;
          N = I * R - U, U += R - z, w.classList.contains("selectable") && (d.add(w), w.classList.remove("selectable"));
        } else
          N = F(w, I, R) - U, d.delete(w) && w.classList.add("selectable");
        const O = `translateX(${Math.round(N)}px)`;
        w._transform = O, w.style.transform = w.classList.contains("selected") ? `${O} translateY(-20px)` : O, $ = w;
      });
      const J = Math.round(N) + ($?.offsetWidth || 0);
      C.style.setProperty("width", `${J}px`, "important"), b.classList.toggle("scrollh", J > b.offsetWidth);
    }
  }, q = function(...c) {
    const C = h.apply(this, c);
    try {
      T();
    } catch (b) {
      console.warn("[chooseFakeCard] 应用假牌布局失败：", b);
    }
    return C;
  }, W = () => {
    x.updatehl = h;
    for (const c of y) c.removeEventListener(i.config.touchscreen ? "touchend" : "click", G);
    y.clear();
    for (const c of d) c.classList.add("selectable");
    d.clear();
    for (const { inner: c, outer: C } of _)
      !c || !C || (c.style.removeProperty("width"), C.classList.remove("scrollh"));
    for (const { card: c, origin: C } of S)
      c.parentNode !== e && c.parentNode !== r || C.appendChild(c);
    x.updatehl();
  };
  try {
    if (!m.is.singleHandcard())
      for (const c of Array.from(r.childNodes)) {
        const C = (
          /** @type { Card } */
          c
        );
        C.classList.contains("removing") || C.classList.contains("glows") || o.has(C) || (S.push({ card: C, origin: r }), e.appendChild(C));
      }
    x.updatehl = q, x.updatehl();
  } catch (c) {
    throw W(), c;
  }
  return W;
}
const Z = {
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
      const o = a.tagName ?? a.name, f = X in i.translate, u = i.translate[X];
      o && (i.translate[X] = m.translation(o));
      try {
        n.push(...l.createFakeCards(r)), n.forEach((h, p) => {
          h._cardid || (h._cardid = `whichWayFake_${p}_${m.id()}`);
        });
        const d = new Map(n.map((h, p) => [h, r[p]])), y = new Set(n);
        e.directgains(n, null, X), e == l.me && (s = te(e, n));
        const k = {
          //position 固定为 "s"：只迭代「特殊区」。配合 filterCard 限定，
          //既不会误选真手牌，也不会误选木牛流马等其它既有的特殊区牌
          position: "s",
          //filterCard 需要额外包裹：只允许选中本次创建的假牌
          filterCard: (h, p, v) => y.has(h) && a.filterCard(h, p, v)
        };
        for (const h of ee)
          a[h] != null && (k[h] = a[h]);
        const S = await e.chooseCard(k).forResult() || {}, _ = (S.cards || []).map((h) => d.get(h) || h);
        a.result = {
          ...S,
          bool: S.bool ?? !1,
          //cards 与本体 result 保持一致：就是玩家选中的那几张假牌
          cards: S.cards || [],
          //links 携带上面的假牌对应的真实值（本体在纯选牌场景下不会往 links 写内容）
          links: _
        }, a.glow_result && _.forEach((h) => h?.classList?.add("glow"));
      } finally {
        s && s(), n.length && l.deleteFakeCards(n), f ? i.translate[X] = u : delete i.translate[X];
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
      let o, f, u = null, d, y = !1;
      const k = (h) => {
        const p = typeof a.controls == "function" ? a.controls(h.slice()) : a.controls;
        return Array.isArray(p) ? p.slice() : [];
      };
      function S(h, p) {
        if (!(y || g.dragged || g.justdragged)) {
          if (y = !0, setTimeout(() => y = !1, 200), r = h, h === "cancel2") {
            x.confirm && (x.confirm.close(), delete x.confirm), x.click.cancel();
            return;
          }
          _(), l.check();
        }
      }
      function _() {
        const h = x.selected.targets.slice();
        h.length && (n = h);
        const p = k(h), v = p.join("\0");
        if (v !== u && (u = v, r != null && !p.includes(r) && (r = void 0), s && (p.length ? f ? f.replace(p.concat(S)) : f = x.create.control(p.concat(S)) : f && (f.close(), f = void 0))), !!f)
          for (const A of Array.from(f.childNodes)) A.classList.toggle("glow", A.link === r);
      }
      try {
        if (s && (l.uncheck(), o = x.create.dialog("", "hidden"), a.prompt && o.addText(a.prompt, a.prompt.length <= 20), a.prompt2 && o.addText(a.prompt2, a.prompt2.length <= 20), o.open(), _()), d = e.chooseTarget({
          filterTarget: a.filterTarget,
          selectTarget: a.selectTarget,
          //隐藏技能：与本体一致，引擎会在需要时（`_status.prehidden_skills`）直接取消本次选择
          hsskill: a.hsskill,
          ai: a.ai,
          forced: a.forced,
          dialog: o,
          //隐藏「取消」按钮：本函数的约束是"必须同时选定目标与选项才结束"（fakeforce 只影响这个按钮，
          //不影响 forced 对目标数下限的门控；想允许放弃的调用方请在 controls 里加 "cancel2"）
          fakeforce: !0,
          //「确定」门控：本地交互时必须已点选选项才会出现（见文件头注释）。
          //AI / 托管 / 联机客机走引擎自己的收尾（选项由事件结束后按 controlAi 补），这里不能拦：
          //引擎的 AI 分支会因 filterOk 不通过而直接取消事件，AI 就永远选不到选项了。
          filterOk: () => typeof a.filterOk == "function" && !a.filterOk() ? !1 : !s || g.auto || d?.result === "ai" ? !0 : r != null || !k(x.selected.targets.slice()).length
        }), s) {
          d.custom || (d.custom = { add: {}, replace: {} }), d.custom.add || (d.custom.add = {});
          const H = d.custom.add.target;
          d.custom.add.target = () => {
            typeof H == "function" && H.call(this), _();
          };
        }
        const h = await d.forResult() || {}, p = !!h.bool, v = p && Array.isArray(h.targets) ? h.targets.slice() : n.slice();
        if (r == null && v.length) {
          const H = k(v);
          if (H.length) {
            let T = typeof a.controlAi == "function" ? a.controlAi(a.getParent(), e) : void 0;
            typeof T == "number" && (T = H[T]), T == null && (T = H[0]), r = T;
          }
        }
        const A = k(v), E = r != null && A.includes(r) ? r : void 0, G = E != null && E !== "cancel2";
        a.result = {
          bool: p && G,
          targets: v,
          control: E,
          index: E != null ? A.indexOf(E) : -1,
          confirm: G ? "ok" : "cancel"
        };
      } finally {
        f && f.close(), o && o.close(), l.uncheck();
      }
    }
  ]
};
class re extends i.element.Player {
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
    this.getSkills().includes(t) || console.warn(`${m.translation(this)}(${this.name}) 没有技能 ${t}`), this.getStat("skill")?.[t] && (this.getStat("skill")[t] += e, typeof this.stat.allSkills == "number" && (this.stat.allSkills += e)), typeof this.storage?.counttrigger?.[t] == "number" && (this.storage.counttrigger[t] += e);
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
    const e = l.createEvent("chooseFakeCard");
    return e.player = this, Object.assign(e, t), e.filterCard != null && typeof e.filterCard == "object" && (e.filterCard = m.filter(e.filterCard)), typeof e.selectCard == "number" && (e.selectCard = [e.selectCard, e.selectCard]), t != null && t.prompt != null && (delete e.prompt, m.evtprompt(e, t.prompt)), e.cards = Array.isArray(e.cards) ? e.cards.slice(0) : [], e.filterCard == null && (e.filterCard = i.filter.all), e.selectCard == null && (e.selectCard = [1, 1]), e.ai == null && (e.ai = m.unuseful3), e.setContent("chooseFakeCard"), e._args = [t], e;
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
    const e = l.createEvent("chooseTargetControl");
    return e.player = this, Object.assign(e, t), typeof e.selectTarget == "number" && (e.selectTarget = [e.selectTarget, e.selectTarget]), e.filterTarget == null && (e.filterTarget = i.filter.all), e.selectTarget == null && (e.selectTarget = [1, 1]), e.ai == null && (e.ai = m.attitude2), e.controls == null && Array.isArray(e.choiceList) && (e.controls = e.choiceList.slice()), e.controls == null && (e.controls = []), t && t.prompt != null && (delete e.prompt, m.evtprompt(e, t.prompt)), e.setContent("chooseTargetControl"), e._args = [t], e;
  }
  /**
   * 显示提示
   * @param {string} str 显示的内容
   * @param {string} nature 颜色
   * @param {boolean} [clear=false] 是否清除原内容
   */
  showPrompt(t, e, r = !1) {
    let n;
    r === !0 && this.node.prompt && (this.node.prompt.remove(), delete this.node.prompt), this.node.prompt ? (n = this.node.prompt, n.innerHTML = n.innerHTML) : (n = x.create.div("promptCharacterSJZX", this), this.node.prompt = n, x.refresh(n)), n.classList.add("promptCharacterSJZX"), n.classList.add("hiddenSJZX"), n.innerHTML = n.innerHTML + t, n.dataset.nature = e || "soil", function(o) {
      if (!o) return;
      const f = o.querySelectorAll(".promptTextSJZX"), u = o.clientWidth;
      f.forEach((d) => {
        let y = parseFloat(window.getComputedStyle(d).fontSize);
        const k = () => d.offsetWidth > u - 10;
        for (; k() && y > 12; )
          y -= 1, d.style.fontSize = `${y}px`;
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
    typeof t == "string" && (t = { name: t }), t = m.autoViewAs(t);
    var n = m.info(t).usable;
    return typeof n == "function" && (n = n(t, r)), n = l.checkMod(t, r, n, "cardUsable", r), typeof n == "boolean" && n === !1 ? 0 : typeof n != "number" ? 1 / 0 : !e && g.currentPhase == r ? n - r.countUsed(t) : n;
  }
  /**
   * @description: 是否满足某个应变条件
   * @param {string | 'kongchao' | 'canqu' | 'zhuzhan' | 'fujia' } conditional 条件
   * @param {GameEvent} event 事件
   *
   * @return {boolean}
   */
  satisfyYingbian(t, e = m.event()) {
    const r = new Map([...i.yingbian.condition.simple, ...i.yingbian.condition.complex]);
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
    if (t != !1 && (i.skill[n] = {
      charlotte: !0,
      mark: !0,
      intro: {
        content: "隐匿前体力值"
      }
    }, i.translate[n] = `${e.hp}/${e.maxHp}`, e.storage[n] = {
      hp: e.hp,
      maxHp: e.maxHp
    }, e.addTempSkill(n, { player: "showCharacterAfter" }), e.when("showCharacterAfter").then(() => {
      e.hp = hp, e.maxHp = maxHp, delete e.storage[n];
    }).vars({
      hp: e.hp,
      maxHp: e.maxHp,
      skillName: n
    })), r && i.character[r]) {
      e.storage.rawHp = e.hp, e.storage.rawMaxHp = e.maxHp, e.hp = 1, e.maxHp = 1, e.update();
      var s = i.character[r][3];
      if (e.name2)
        for (var o of i.character[e.name2][3])
          s.add(o);
      for (var o = 0; o < s.length; o++)
        i.translate[s[o] + "_info"] || s.splice(o--, 1);
      for (var o of s)
        e.removeSkill(o);
      e.hiddenSkills || (e.hiddenSkills = []), e.hiddenSkills.addArray(s), e.classList.add("unseen"), e.name2 && e.classList.add("unseen2"), e.name = "unknown", !e.node.name_seat && !g.video && (e.node.name_seat = x.create.div(".name.name_seat", m.verticalStr(m.translation(e.name)), e), e.node.name_seat.dataset.nature = m.groupnature(e.group)), e.sex = "male", e.storage.nohp = !0, e.node.hp.hide(), e.update();
    }
    t != !1 && setTimeout(() => {
      let f = document.querySelector(".mark-text.small-text");
      f && f.textContent && (f.textContent = i.translate[n]);
    }, 500);
  }
  adjustHandCardTo(t) {
    if (typeof t != "number") return console.error("ERROR:num must be number!");
    let e = this.countCards("h") - t;
    e > 0 ? this.chooseToDiscard(!0, `请弃置${m.cnNumber(this.countCards("h") - t)}张牌`, e) : e < 0 && this.draw(Math.abs(e));
  }
  canUseCardAtt(t, e, r) {
    return r === void 0 && (r = !0), e === void 0 && (e = !0), l.hasPlayer((n) => {
      var s = m.attitude(n, this);
      return this.canUse(t, n, r) && (e == !0 ? s > 0 : s < 0);
    });
  }
  getNumberInRange() {
    for (var t = 0, e = l.filterPlayer(), r = 0; r < e.length; r++)
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
      return m.type2(r) == e;
    }).length;
  }
  isPhase(t, e) {
    return !e && g.currentPhase != this ? !1 : g.event.name == t || g.event.getParent(t).name == t;
  }
  canUseToAnyone(t, e = !0, r = !0) {
    typeof t == "string" && (t = { name: t, isCard: !0 });
    for (var n = 0; n < l.players.length; n++)
      if (!(r == !1 && l.players[n] == this)) {
        if (e != !1) {
          if (this.canUse(t, l.players[n], !1))
            return !0;
        } else if (this.canUse(t, l.players[n]))
          return !0;
      }
    return !1;
  }
  isMaxHandCardLimit(t) {
    for (var e = this.getHandcardLimit(), r = 0; r < l.players.length; r++)
      if (!(l.players[r].isOut() || l.players[r] == this)) {
        if (t) {
          if (l.players[r].getHandcardLimit() >= e) return !1;
        } else if (l.players[r].getHandcardLimit() > e) return !1;
      }
    return !0;
  }
  isMinHandCardLimit(t) {
    for (var e = this.getHandcardLimit(), r = 0; r < l.players.length; r++)
      if (!(l.players[r].isOut() || l.players[r] == this)) {
        if (t) {
          if (l.players[r].getHandcardLimit() <= e) return !1;
        } else if (l.players[r].getHandcardLimit() < e) return !1;
      }
    return !0;
  }
  getSkillsList(t, e) {
    t !== !0 && (t = !1), typeof e == "string" && (e = [e]);
    let r = this;
    var n = [], s = [], o = [];
    r.name1 != null ? s = i.character[r.name1][3] : s = i.character[r.name][3], r.name2 != null && (o = i.character[r.name2][3]), s = s.concat(o);
    for (var f = function(y) {
      var k = m.info(y);
      if (!k || k.charlotte) return !1;
      if (Array.isArray(e)) {
        for (var S of e)
          if (k[S]) return !1;
      }
      return !0;
    }, u = 0; u < s.length; u++)
      f(s[u]) && n.add(s[u]);
    if (r.disabledSkills && t)
      for (var d in r.disabledSkills)
        n.remove(d);
    return n;
  }
}
class ne extends i.element.Card {
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
    return K(this, { id: e || t, text: t, type: "card" }), this;
  }
  isConnect() {
    return l.broadcastAll(() => {
      g.sxrmConnectCards ??= [];
    }), g.sxrmConnectCards.includes(this);
  }
  addConnect() {
    if (this.isConnect()) return this;
    l.broadcastAll((e) => {
      e.addGaintag("visible_sxrm_connect_tag"), g.sxrmConnectCards.add(e);
    }, this);
    const t = m.owner(this);
    return t?.isIn() && t.markSkill("_sxrm_connect"), this.refreshMark(), this;
  }
  removeConnect() {
    return g.sxrmConnectCards ??= [], g.sxrmConnectCards.remove(this), l.broadcast((t) => {
      g.sxrmConnectCards = t;
    }, g.sxrmConnectCards), l.broadcastAll((t) => {
      t.removeGaintag("visible_sxrm_connect_tag");
    }, this), this.refreshMark(), this;
  }
  refreshMark() {
    l.filterPlayer((t) => {
      t.getCards("h", (e) => e.isConnect()).length ? t.markSkill("_sxrm_connect") : t.unmarkSkill("_sxrm_connect");
    });
  }
}
class ae extends B {
  /**
   * 获得所有连接牌
   * @returns { Card[] | Array }
   */
  getConnectCards() {
    return g.sxrmConnectCards || [];
  }
  /**
   * 刷新连接标记
   */
  refreshMark() {
    l.filterPlayer((t) => {
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
    let n = 0, s = r ? l.players.concat(l.dead) : l.players;
    typeof e != "function" && (e = () => !0);
    for (let o of s)
      e(o) && (n += o.countMark(t));
    return n;
  }
  /**
   * @param { string } name
   * @param {*} info
   * @param { { translate: string, config: { [key: string]: object } } } info2
   */
  addModeSJZX(t, e, r) {
    i.config.all.mode.push(t), i.translate[t] = r.translate;
    let n, s = g.extension || r.extension;
    e.splash ? n = e.splash : g.evaluatingExtension ? n = "extension-" + s + ":image/mode/backgroud/" + t + ".jpg" : n = "ext:" + s + "/image/mode/backgroud/" + t + ".jpg", i.mode[t] = {
      name: r.translate,
      config: r.config,
      splash: n,
      fromextension: !0
    }, i.init["setMode_" + t] = async () => {
      await l.import("mode", (o, f, u, d, y, k) => (e.name = t, e));
    }, i.config.extensionInfo[s] || (i.config.extensionInfo[s] = {}), i.config.extensionInfo[s].mode || (i.config.extensionInfo[s].mode = []), i.config.extensionInfo[s].mode.indexOf(t) == -1 && i.config.extensionInfo[s].mode.push(t), l.saveConfig("extensionMode", i.config.extensionInfo);
  }
  totalmark(t) {
    let e = 0;
    for (let r = 0; r < l.players.length; r++)
      l.players[r].hasMark(t) && (e += l.players[r].countMark(t));
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
    let e = t.slice().sort(), r = 0, n = [], s = 1, o = e[0];
    for (let f = 1; f <= e.length; f++)
      f < e.length && e[f] === o ? s++ : (s >= r && (s > r && (n = []), r = s, n.push(o)), f < e.length && (o = e[f], s = 1));
    return n;
  }
  getGlobalmark(t) {
    for (var e = 0, r = 0; r < l.players.length; r++) {
      var n = l.players[r];
      n.hasMark(t) && (e += n.countMark(t));
    }
    return e;
  }
}
class se extends j {
  /**
   * 获取此牌的目标数
   * @param { VCard | string } card
   * @returns {number}
   */
  targetCounts(t) {
    let e = t?.name;
    if (typeof t == "string") e = t;
    else if (t === void 0) return 0;
    let r = i.card[e];
    return r.notarget ? 0 : r.selectTarget !== void 0 ? Array.isArray(r.selectTarget) ? Math.max(r.selectTarget) : r.selectTarget === -1 && r.toself ? 1 : r.selectTarget === -1 ? 1 / 0 : r.selectTarget : r.filterTarget ? 1 : 0;
  }
  /**
   * @description: 判断该牌是否为单一目标
   * @param {Card | string} card
   *
   * @return {boolean}
   */
  isSingle(t) {
    typeof t == "string" && (t = { name: t });
    let e = m.info(t);
    return !e.notarget && e.selectTarget && e.selectTarget === 1;
  }
  isView(t) {
    if (Array.isArray(t))
      for (var e of t)
        this.isView(e);
    else {
      if (t && m.is.object(t))
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
        for (let o = 0; o < e.length; o++)
          if (s === e[o]) {
            n.push(r[o]);
            break;
          }
      }), n;
    }
  }
  randomNumberSJZX() {
    return Math.floor(Math.random() * 1e6).toString().padStart(6, "0") + "SJZX";
  }
}
class oe extends i.element.GameEvent {
  getChildren(t, e = 20) {
    let r = this;
    if (e <= 0) return {};
    let n = t;
    if (t === void 0)
      return console.warn("getChildren: filter is not a function or string !"), {};
    if (typeof t == "string") {
      const s = t;
      n = (o) => o.name === s;
    }
    if (n(r))
      return r;
    for (const s of this.childEvents || []) {
      const o = s.getChildren(t, e - 1);
      if (o && Object.keys(o).length > 0)
        return o;
    }
    return {};
  }
}
class ie extends Array {
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
    let o = n ? this : f(this);
    if (s) {
      if (typeof t == "number" && t >= -o.length - 1 && t <= o.length) {
        let u = t < 0 ? o.length + t + 1 : t, d = r ? u + 1 : u;
        o.splice(d, 0, e);
      }
    } else {
      let u = o.indexOf(t);
      if (u !== -1) {
        let d = r ? u + 1 : u;
        o.splice(d, 0, e);
      }
    }
    return n ? this : o;
    function f(u) {
      if (u === null || typeof u != "object")
        return u;
      if (u instanceof Date)
        return new Date(u.getTime());
      if (u instanceof Array)
        return u.map((d) => f(d));
      if (typeof u == "object") {
        const d = {};
        for (let y in u)
          u[y] && (d[y] = f(u[y]));
        return d;
      }
    }
  }
}
class le extends HTMLDivElement {
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
const ce = {
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
    name: i.hookmap,
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
      for (let r of i.phaseName) this.translation[r] = m.translation(r);
      for (let r in this.translation)
        a.some((n) => r.endsWith(n)) || (t.hasOwnProperty(r + "Begin") || (t[r + "Begin"] = this.translation[r] + "时", delete t[r]), t.hasOwnProperty(r + "After") || (t[r + "After"] = this.translation[r] + "后", delete t[r]));
      let e = Object.keys({ ...this.name });
      for (let r of e)
        !r in this.translation && e.remove(r);
      return {
        triggers: e,
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
        return t.countCards("h") > g.weinaData[e].random.num.num(a, t);
      }
    },
    countCard_lower: {
      intro: "手牌数小于X",
      filter: function(a, t, e) {
        return t.countCards("h") < g.weinaData[e].random.num.num(a, t);
      }
    },
    countHp_bigger: {
      intro: "体力值大于X",
      filter: function(a, t, e) {
        return t.hp > g.weinaData[e].random.num.num(a, t);
      }
    },
    countHp_lower: {
      intro: "体力值小于X",
      filter: function(a, t, e) {
        return t.hp < g.weinaData[e].random.num.num(a, t);
      }
    },
    countloseCard_bigger: {
      intro: "本回合失去过不少于X牌",
      filter: function(a, t, e) {
        return t.getHistory("lose").length > g.weinaData[e].random.num.num(a, t);
      }
    },
    countloseCard_lower: {
      intro: "本回合失去过至多X张牌",
      filter: function(a, t, e) {
        return !t.getHistory("lose").length < g.weinaData[e].random.num.num(a, t);
      }
    },
    countUseCard_bigger: {
      intro: "本回合使用过至少X+1张牌名不同的牌",
      filter: function(a, t, e) {
        return Object.keys(t.getStat().card).length > g.weinaData[e].random.num.num(a, t);
      }
    },
    countUseCard_lower: {
      intro: "本回合使用过至多X+1张牌名不同的牌",
      filter: function(a, t, e) {
        return Object.keys(t.getStat().card).length < g.weinaData[e].random.num.num(a, t);
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
          player.hasUseTarget(event.weinaData.name) && player.chooseToUse(`你可以使用一张${m.translation(event.weinaData.name)}`, (a) => m.name(a) == event.weinaData.name);
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
            }).set("ai", (a) => m.attitude2(player) < 0), result.targets && player.gainPlayerCard("hej", result.targets[0], !0).set("target", result.targets[0]).set("complexSelect", !1).set("ai", i.card.shunshou.ai.button);
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
        return l.countGroup();
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
        return new Set(t.getCards("h").map((e) => m.type2(e))).size;
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
    return i.inpile.filter((t) => m.type(t) !== "delay" && m.type(t) !== "equip").randomGet();
  },
  getPhase() {
    return i.phaseName.randomGet();
  },
  getInfo(a, t = "", e = {}, r) {
    a || (a = this);
    for (let n in a)
      if (typeof a[n] == "object" && a[n] !== null && !Array.isArray(a[n]) && this.getInfo(a[n], n, e, r), n === "intro") {
        let s = a[n];
        s = s.replace(/\$name/g, m.translation(r.name)).replace(/\$phase/g, m.translation(r.phase)).replace(/X/g, `X(${r.num?.intro || "default"})`), e[t] = s;
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
window.whichWaySave.weinaData = ce;
window.whichWay.nonameEx ??= {};
const M = window.whichWay.nonameEx;
M.customFuc = {
  skill: Q
};
M.jsExt ??= {};
M.ArrayExt = D(ie, Array.prototype, Array.prototype);
M.HTMLDivElementExt = D(le, HTMLDivElement.prototype);
Y({
  name: "WhichWayNonameEx",
  fn: async () => {
    M.CardExt = D(ne, i.element.card), M.PlayerExt = D(re, i.element.player), M.GameExt = D(ae, B.prototype), M.GetExt = D(se, j.prototype), M.GameEventExt = D(oe, i.element.GameEvent.prototype), M.ContentExt = Z, Object.assign(i.element.content, Z), await import("./nonameEx-custom-override-9gwO7PAk.js");
  }
});
function D(a, t, e) {
  e = e || Object.getPrototypeOf(t);
  const r = Object.getOwnPropertyDescriptors(a.prototype), n = {};
  for (const [s, o] of Object.entries(r))
    s !== "constructor" && typeof o.value == "function" && (s in e || (Object.defineProperty(t, s, {
      ...o,
      enumerable: !1,
      configurable: !0,
      writable: !0
    }), n[s] = o.value));
  return {
    injected: n,
    count: Object.keys(n).length,
    target: t,
    source: a,
    base: e,
    timestamp: Date.now()
  };
}
