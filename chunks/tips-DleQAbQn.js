import { onSetDev as l } from "./hooks-BscfO9lD.js";
import { lib as h, game as n, get as y } from "noname";
import { a as f, r as g } from "./tips-prompt-shared-DbrTQVVF.js";
class m {
  registerHook(r, e) {
    if (e || (e = this._hookTriggerDefaultFunc), this.triggerHooks[r]) {
      console.warn(`[WhichWayTips] hook ${r} already registered`);
      return;
    }
    if (this.triggerHooks[r] = e, h.hooks[r]) h.hooks[r].push((...a) => e(r, ...a));
    else throw new Error(`[WhichWayTips] hook ${r} not found`);
  }
  _hookTriggerDefaultFunc(r, ...e) {
    const [a] = e;
    if (!a) return;
    const t = {
      player: [],
      card: []
    }, o = c.autoDelPrompt;
    if (!(Object.keys(o.card).length === 0 && Object.keys(o.player).length === 0)) {
      for (const i of n.players.concat(n.dead)) {
        for (const p in o.player) {
          const s = o.player[p];
          typeof s == "function" ? s(a, r, i) && (c.removePrompt(i, p), t.player.add(p)) : s === !0 && (c.removePrompt(i, p), t.player.add(p));
        }
        for (const p of i.getCards("h"))
          for (const s in o.card) {
            const d = o.card[s];
            typeof d == "function" ? d(a, r, i) && (c.removePrompt(p, s), t.card.add(s)) : d === !0 && (c.removePrompt(p, s), t.card.add(s));
          }
      }
      t.player.length && t.player.forEach((i) => {
        delete o.player[i];
      }), t.card.length && t.card.forEach((i) => {
        delete o.card[i];
      });
    }
  }
  getID(r) {
    return y.itemtype(r) === "player" ? r.playerid : r.cardid;
  }
  registerDel(r, e, a, t) {
    const o = this.isPlayer(r);
    this.autoDelPrompt ??= { player: {}, card: {} }, this.autoDelPrompt[o ? "player" : "card"][a] = t || !0, this.triggerHooks[e] || this.registerHook(e);
  }
  isPlayer = (r) => y.itemtype(r) === "player";
  /**
   * 在卡牌 / 角色上添加一条提示（同 id 则更新文本）。
   *
   * 提示的 DOM 与样式由 `src/tips/promptSJZX.vue` 组件负责（原 `css/extension.css` 里的
   * `.promptSJZX` 系列已挪进该组件，`.promptSJZX-Wrapper` 也由组件渲染 —— 不会再出现
   * "只挂了 `.promptSJZX`、导致 `.promptSJZX-Wrapper .promptSJZX` 匹配不上"的情况），
   * 这里只负责登记与（配合 `registerDel` 的）自动清除。
   *
   * **卡牌提示默认「离手自动清除」**：卡牌离开手牌区（进弃牌堆 / 装备区 / 判定区 / 牌堆 / 特殊区…）后，
   * 该牌上所有未声明保留的提示都会被清掉；需要让提示跟着牌走时把 `keepOnLeave` 传 `true`。
   *
   * @param el 目标卡牌 / 角色
   * @param str 提示内容（按 HTML 渲染，与改造前 `innerHTML` 一致）
   * @param id 提示 id，缺省用内容本身；同 id 视为更新
   * @param del 自动清除的触发时机
   * @param keepOnLeave 仅对卡牌提示有意义：离开手牌区后是否保留，默认 false（自动清除）
   */
  addPrompt(r, e, a, t, o = !1) {
    const i = a || e;
    return f(r, {
      id: i,
      text: e,
      type: this.isPlayer(r) ? "character" : "card",
      keepOnLeave: o
    }), t && this.registerDel(r, t, i), r;
  }
  /**
   * 移除卡牌 / 角色上的提示（删空后容器会自动收掉）
   * @param el 目标卡牌 / 角色
   * @param id 只移除该 id 的提示；不传则移除全部
   */
  removePrompt(r, e) {
    return g(r, typeof e == "string" ? e : void 0), r;
  }
  autoDelPrompt = {
    player: {},
    card: {}
  };
  //@ts-ignore
  triggerHooks = {};
}
const c = new m();
l({
  name: "WhichWayTips_dev",
  fn() {
    window.whichWayTips = c;
  }
});
window.whichWay.register("tips", c);
export {
  c as whichWayTips
};
