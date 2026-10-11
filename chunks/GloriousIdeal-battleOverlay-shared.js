import { defineComponent as ve, ref as je, computed as X, openBlock as m, createElementBlock as b, normalizeStyle as ze, createElementVNode as l, unref as D, normalizeClass as J, toDisplayString as x, withModifiers as dt, Fragment as ee, renderList as re, createCommentVNode as U, createVNode as ge, onMounted as cs, reactive as Zt, createApp as en, createStaticVNode as ds, createTextVNode as ue, renderSlot as Zo, watch as us, createBlock as Me, withDirectives as er, vModelText as tr, withCtx as nr, nextTick as Ni } from "vue";
import { lib as fe, get as nt, game as pe, _status as He, ui as qn } from "noname";
import { whichWayFile as ir } from "./file.js";
import { _ as ye } from "./_plugin-vue_export-helper.js";
const sn = [
  {
    id: "military",
    name: "军事委员会",
    initLevel: -1,
    maxLevel: 5,
    cost: [0, 0, 0, 0, 0],
    desc: "初始为废弃状态。修建完成后每天团结度+5；执行任务的角色压力增长+20%。"
  },
  {
    id: "babel",
    name: "巴别塔",
    initLevel: -1,
    maxLevel: 5,
    cost: [0, 0, 0, 0, 0],
    desc: "初始为废弃状态。修建完成后每天团结度+1；执行任务的角色压力增长-1%。"
  },
  {
    id: "courier",
    name: "天灾信使",
    initLevel: 1,
    maxLevel: 5,
    cost: [0, 0, 0, 0, 0],
    desc: "初始 1 级，可招募干员（免费）进入队伍。1 级可出现 4 名候选人（从将池抽取，不会抽到已招募干员）。"
  },
  {
    id: "barracks",
    name: "卡兹戴尔军营",
    initLevel: 1,
    maxLevel: 3,
    cost: [0, 0],
    desc: "提供招募干员上限：1 级 8 人，每升一级 +2 人，最高 3 级。"
  },
  {
    id: "merchant",
    name: "砍诺特（商人）",
    initLevel: 1,
    maxLevel: 5,
    cost: [0, 0, 0, 0, 0],
    desc: "初始可刷新 0 次；售卖装备（强化战斗力）；初始售 10 件商品；每级 +1 次每日刷新与 5% 折扣。"
  },
  {
    id: "graveyard",
    name: "墓园",
    initLevel: 0,
    maxLevel: 0,
    cost: [],
    desc: "不可升级。展示永久死亡的干员。"
  },
  {
    id: "camel",
    name: "驼兽运输队",
    initLevel: 0,
    maxLevel: 8,
    cost: [0, 0, 0, 0, 0, 0, 0, 0],
    desc: "初始 0 级，最高 8 级；每升一级在下副本时额外提供一个背包栏位。"
  }
], sr = (c, s) => {
  if (s < 1) return {};
  switch (c) {
    case "military":
      return { unity: 5, stressMod: 0.2 };
    case "babel":
      return { unity: 1, stressMod: -0.01 };
    default:
      return {};
  }
}, Ot = {
  init: 80,
  max: 200,
  /** 抵达 0 即游戏失败 */
  failAt: 0
}, or = [
  { min: 0, max: 50, growMod: 0.1, buff: null },
  { min: 51, max: 100, growMod: 0.05, buff: null },
  { min: 101, max: 120, growMod: -0.1, buff: null },
  { min: 121, max: 150, growMod: -0.5, buff: null },
  { min: 151, max: 190, growMod: -0.8, buff: null },
  { min: 191, max: 200, growMod: -0.95, buff: null }
], rr = {
  /** 干员永久死亡 -5/人 */
  operatorPermanentDeath: -5,
  /** 干员进入折磨状态 -1/人 */
  operatorAgony: -1,
  /** 团结度高于100 -1/天 */
  unityAbove100PerDay: -1,
  /** 任务失败 -5/次 */
  missionFail: -5,
  /** 度过一天 -1/天 */
  passDay: -1,
  /** 无法提供粮草 -0.2/次 */
  starvation: -0.2,
  /** 任务成功 +1.5/次 */
  missionSuccess: 1.5
}, ps = { init: 0, max: 200 }, tt = {
  /** 手段一：消耗 1 个后勤小队 */
  supplyCost: 1,
  /** 手段二：在场每名干员失去 1 点体力 */
  hpLoss: 1,
  /** 手段二：在场每名干员压力 +12 */
  stress: 12
}, jn = { supplyCost: 1 }, Mn = {
  /** 主动投喂（1 粮草→1 干员 +1 体力）两次之间的最小行动间隔 */
  feedGap: 3,
  /** 缺粮：压力 +20 */
  starveStress: 20,
  /** 缺粮：流失 1 点体力 */
  starveHpLoss: 1
}, fs = 100, ar = [
  { level: 1, exp: 0, desc: "击杀敌人减少自身 3 点压力" },
  { level: 2, exp: 10, desc: "受到的压力-10%，额外获得一个装备栏" },
  { level: 3, exp: 25, desc: "游戏开始时，摸一张牌" },
  { level: 4, exp: 45, desc: "游戏开始时，从牌堆获得一张【闪】和【杀】" },
  { level: 5, exp: 70, desc: "游戏开始时，获得一点护甲值" },
  { level: 6, exp: 100, desc: "手牌上限+1" }
], Ne = {
  stressAt: 100,
  /** 压力抵 100 时：20% 美德 / 80% 折磨（实现见 rollAgonyOutcome） */
  virtueChance: 0.2,
  /** 压力上限 200 → 永久死亡；战斗死亡同样永久死亡 */
  deathAt: 200
}, Ln = [
  { id: "zhenfen", name: "振奋", desc: "出牌阶段结束时，令所有友方角色回复一点体力", implement: "trigger phaseEnd + recover" },
  { id: "wuwei", name: "无畏", desc: "【杀】的使用次数+1", implement: "mod.attackRange? → 用 limitShan/额外次数 mod" },
  { id: "zhuanzhu", name: "专注", desc: "出牌阶段使用的第一张【杀】无法被响应", implement: "firstSha + directHit" },
  { id: "yongmeng", name: "勇猛", desc: "出牌阶段首次造成的伤害+1", implement: "damageBegin buff 一次" },
  { id: "jianding", name: "坚定", desc: "所有友方角色压力-20且获得一点护甲", implement: "全员 stress-20 + armor +1" }
], hs = { 1: 8, 2: 10, 3: 12 }, lr = () => Math.random() < Ne.virtueChance ? Ln[Math.floor(Math.random() * Ln.length)].id : "agony", Ye = [
  { id: "provision", name: "粮草", maxStack: 9, desc: "每行动 10 次消耗 1 点（缺粮→压力+20/团结-0.2/流失1体力）；可主动用 1 点给 1 名干员回 1 体力（每 3 次行动 1 次）" },
  { id: "bandage", name: "绷带", maxStack: 3, desc: "消除流血状态" },
  { id: "antidote", name: "解毒剂", maxStack: 3, desc: "消除中毒状态" },
  { id: "cloak", name: "匿踪装置", maxStack: 3, desc: "消除标记状态" },
  { id: "supply", name: "后勤小队", maxStack: 6, desc: "用于铲除障碍和拾取宝箱" },
  { id: "originite", name: "源石碇", maxStack: 30, desc: "局内货币" },
  { id: "synthetic_jade", name: "合成玉", maxStack: 10, convertAtSettle: 3, desc: "任务结算时每个换 3 源石碇" },
  { id: "originium_shard", name: "源石碎片", maxStack: 8, convertAtSettle: 5, desc: "任务结算时每个换 5 源石碇" },
  { id: "originium_impure", name: "含杂质的源石", maxStack: 5, convertAtSettle: 10, desc: "任务结算时每个换 10 源石碇" },
  { id: "originium_pure", name: "至纯源石", maxStack: 2, convertAtSettle: 50, desc: "任务结算时每个换 50 源石碇" }
], gs = 8, jt = (c) => Ye.find((s) => s.id === c), on = { common: "普通", rare: "罕见", epic: "史诗", legendary: "传奇" }, zn = /* @__PURE__ */ new Map();
function cr(c) {
  return zn.set(c.id, c), c;
}
const Ae = (c) => zn.get(c), vs = () => [...zn.values()], dr = (c) => vs().filter((s) => s.rarity === c), ur = [
  { id: "eq_first_aid", name: "急救包", rarity: "common", price: 20, stat: { maxHp: 1 }, desc: "体力上限 +1" },
  { id: "eq_plate", name: "防弹插板", rarity: "common", price: 24, stat: { hujia: 1 }, desc: "开局获得 1 点护甲" },
  { id: "eq_ration_pouch", name: "口粮囊", rarity: "common", price: 18, stat: { drawStart: 1 }, desc: "游戏开始时额外摸 1 张牌" },
  { id: "eq_scope", name: "战术瞄具", rarity: "common", price: 22, stat: { attackExtra: 1 }, desc: "出牌阶段【杀】次数 +1" },
  { id: "eq_grimoire", name: "源石法典", rarity: "common", price: 20, stat: { maxHandcard: 1 }, desc: "手牌上限 +1" },
  { id: "eq_charm", name: "静心护符", rarity: "common", price: 26, stat: { stressReduce: 0.1 }, desc: "受到伤害时压力减免 10%" },
  { id: "eq_vest", name: "复合战术背心", rarity: "rare", price: 46, stat: { maxHp: 1, hujia: 1 }, desc: "体力上限 +1，开局护甲 +1" },
  { id: "eq_dual", name: "双持武器组", rarity: "rare", price: 52, stat: { attackExtra: 1, drawStart: 1 }, desc: "【杀】次数 +1，开局额外摸 1 张" },
  { id: "eq_focus", name: "稳定药剂环", rarity: "rare", price: 50, stat: { maxHandcard: 1, stressReduce: 0.1 }, desc: "手牌上限 +1，压力减免 10%" },
  { id: "eq_ward", name: "守护符文", rarity: "rare", price: 54, stat: { hujia: 2 }, desc: "开局获得 2 点护甲" },
  { id: "eq_banner", name: "军旗", rarity: "rare", price: 48, stat: { drawStart: 2 }, desc: "游戏开始时额外摸 2 张牌" },
  { id: "eq_ace", name: "王牌瞄准镜", rarity: "epic", price: 90, stat: { attackExtra: 2 }, desc: "出牌阶段【杀】次数 +2" },
  { id: "eq_aegis", name: "埃癸斯装甲", rarity: "epic", price: 100, stat: { maxHp: 2, hujia: 2 }, desc: "体力上限 +2，开局护甲 +2" },
  { id: "eq_crown", name: "王冠残片", rarity: "epic", price: 110, stat: { maxHandcard: 2, stressReduce: 0.2 }, desc: "手牌上限 +2，压力减免 20%" },
  // 传奇（Phase D 新增第四档；仅供主力难度 10% 传奇权重抽取，数值待平衡）
  { id: "eq_calamity", name: "天灾核心", rarity: "legendary", price: 180, stat: { attackExtra: 2, drawStart: 2 }, desc: "【杀】次数 +2，开局额外摸 2 张" },
  { id: "eq_monument", name: "卡兹戴尔纪念碑", rarity: "legendary", price: 200, stat: { maxHp: 2, hujia: 3, stressReduce: 0.2 }, desc: "体力上限 +2，开局护甲 +3，压力减免 20%" },
  { id: "eq_starsteel", name: "星钢法典", rarity: "legendary", price: 190, stat: { maxHandcard: 3, drawStart: 1 }, desc: "手牌上限 +3，开局额外摸 1 张" }
];
for (const c of ur) cr(c);
const pr = 10, ht = [
  { id: "provision", price: 5 },
  // 粮草
  { id: "bandage", price: 8 },
  // 绷带
  { id: "antidote", price: 8 },
  // 解毒剂
  { id: "cloak", price: 10 },
  // 匿踪装置
  { id: "supply", price: 12 }
  // 后勤小队
], fr = (c) => Math.max(0, 0.05 * (Math.max(1, c) - 1)), hr = (c) => Math.max(0, Math.max(1, c) - 1), gr = (c, s) => Math.max(1, Math.round(c * (1 - s)));
function Bi() {
  const c = vs().map((a) => a.id), s = [...c];
  for (let a = s.length - 1; a > 0; a--) {
    const u = Math.floor(Math.random() * (a + 1));
    [s[a], s[u]] = [s[u], s[a]];
  }
  return s.slice(0, Math.min(pr, c.length));
}
const Fn = [
  { id: "kelsey", name: "凯尔希军", isSpecial: !0, desc: "特殊副本：100 天内通关即胜利" },
  { id: "victoria", name: "维多利亚公爵联军", desc: "" },
  { id: "kazimierz", name: "卡西米尔商业联合军", desc: "" },
  { id: "gaul", name: "高卢联军", desc: "" },
  { id: "terra", name: "泰拉联合志愿军", desc: "" }
], Nn = {
  recon: { needExp: 0, gainExp: 5, outposts: 8, name: "侦查" },
  squad: { needExp: 10, needBoss: !0, gainExp: 10, outposts: 12, name: "小队" },
  main: { needExp: 50, needBoss: !0, gainExp: 25, outposts: 18, name: "主力" }
}, vr = 100, mr = { recon: 10, squad: 50, main: 100 }, Bn = (c) => Fn.find((s) => s.id === c), yr = 0.1;
let ms = 0;
const br = () => {
  ms = 0;
}, _r = {
  recon: { common: 0.8, rare: 0.2, epic: 0, legendary: 0 },
  squad: { common: 0.6, rare: 0.3, epic: 0.1, legendary: 0 },
  main: { common: 0.4, rare: 0.3, epic: 0.2, legendary: 0.1 }
}, Pt = 2, xr = 0.15, kr = ["provision", "bandage", "antidote", "cloak", "supply"], wr = {
  recon: [
    { id: "synthetic_jade", w: 0.75 },
    { id: "originium_shard", w: 0.25 }
  ],
  squad: [
    { id: "synthetic_jade", w: 0.45 },
    { id: "originium_shard", w: 0.35 },
    { id: "originium_impure", w: 0.2 }
  ],
  main: [
    { id: "synthetic_jade", w: 0.2 },
    { id: "originium_shard", w: 0.35 },
    { id: "originium_impure", w: 0.3 },
    { id: "originium_pure", w: 0.15 }
  ]
}, $r = { recon: 1, squad: 1.5, main: 2 }, We = () => ({ items: {}, equips: [], originite: 0 }), Sr = (c) => c.originite <= 0 && !c.equips.length && !Object.values(c.items).some((s) => s > 0);
function Ui(c, s) {
  for (const [a, u] of Object.entries(s.items))
    u > 0 && (c.items[a] = (c.items[a] ?? 0) + u);
  return c.equips.push(...s.equips), c.originite += s.originite, c;
}
const ys = (c, s) => c + Math.floor(Math.random() * (s - c + 1)), bs = (c) => c[Math.floor(Math.random() * c.length)];
function _s(c) {
  const s = c.reduce((u, y) => u + y.w, 0);
  if (s <= 0) return;
  let a = Math.random() * s;
  for (const u of c)
    if (a -= u.w, a <= 0) return u.item;
  return c[c.length - 1]?.item;
}
function Er(c) {
  const s = _r[c], a = ["legendary", "epic", "rare", "common"], u = a.filter((v) => (s[v] ?? 0) > 0), y = _s(u.map((v) => ({ item: v, w: s[v] })));
  if (y)
    for (const v of a.slice(a.indexOf(y))) {
      const w = dr(v);
      if (w.length) return bs(w).id;
    }
}
function xs(c, s = 0) {
  const a = Math.min(1, Math.max(0, yr + ms + s));
  if (Math.random() >= a) return [];
  const u = Er(c);
  return u ? [u] : [];
}
function ks(c, s) {
  const a = c === "main" ? 2 : 1;
  for (let u = 0; u < a; u++) {
    const y = bs(kr);
    s.items[y] = (s.items[y] ?? 0) + ys(1, c === "recon" ? 2 : 3);
  }
}
function ws(c, s) {
  const a = _s(wr[c].map((u) => ({ item: u.id, w: u.w })));
  a && (s.items[a] = (s.items[a] ?? 0) + 1);
}
function $s(c, s) {
  s.items.originite = (s.items.originite ?? 0) + Math.round(ys(10, 20) * $r[c]);
}
function Ss(c, s) {
  const a = We();
  return c && (Math.random() < 0.5 && ks(s, a), Math.random() < 0.35 && ws(s, a), Math.random() < 0.3 && $s(s, a), a.equips.push(...xs(s))), a;
}
function Ir(c) {
  const s = We();
  return ks(c, s), Math.random() < 0.5 && ws(c, s), Math.random() < 0.4 && $s(c, s), s.equips.push(...xs(c, xr)), s;
}
const Tr = {
  // kelsey: [ [ { charId: "..." }, { charId: "...", hp: 3 } ], /* ... */ ],
}, Cr = 4;
function Mr() {
  let c = null;
  try {
    const s = window.whichWaySave;
    s && typeof s.hasChar == "function" && (c = (a) => s.hasChar(a));
  } catch {
  }
  try {
    return Object.keys(fe.character ?? {}).filter((s) => {
      const a = fe.character[s];
      return !(!a || a.hidden || c && c(s));
    });
  } catch {
    return [];
  }
}
function Or(c, s = 1) {
  return Cr + (s >= 3 ? 1 : 0);
}
const Pr = 3, Dr = (c) => Tr[c] ?? [];
function Ar(c, s) {
  const a = Dr(c);
  return a.length ? a[Math.floor(Math.random() * a.length)].map((y) => ({ ...y, hand: y.hand ? [...y.hand] : void 0, equips: y.equips ? [...y.equips] : void 0 })) : Rr();
}
function Rr(c = Pr) {
  const s = Mr(), a = [], u = [...s];
  for (let y = 0; y < c && u.length; y++) {
    const v = Math.floor(Math.random() * u.length), [w] = u.splice(v, 1);
    a.push({ charId: w });
  }
  return a;
}
function Gi(c) {
  return 0;
}
function qr(c) {
  return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
}
var Mt = { exports: {} }, jr = Mt.exports, Vi;
function Lr() {
  return Vi || (Vi = 1, (function(c, s) {
    (function(a, u) {
      c.exports = u();
    })(jr, (function() {
      function a(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t);
          e && (i = i.filter((function(o) {
            return Object.getOwnPropertyDescriptor(t, o).enumerable;
          }))), n.push.apply(n, i);
        }
        return n;
      }
      function u(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e] != null ? arguments[e] : {};
          e % 2 ? a(Object(n), !0).forEach((function(i) {
            M(t, i, n[i]);
          })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach((function(i) {
            Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
          }));
        }
        return t;
      }
      function y(t) {
        return y = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
          return typeof e;
        } : function(e) {
          return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        }, y(t);
      }
      function v(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }
      function w(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, C(i.key), i);
        }
      }
      function k(t, e, n) {
        return e && w(t.prototype, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
      }
      function M(t, e, n) {
        return (e = C(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
      }
      function P(t, e) {
        if (typeof e != "function" && e !== null) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && A(t, e);
      }
      function T(t) {
        return T = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        }, T(t);
      }
      function A(t, e) {
        return A = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, i) {
          return n.__proto__ = i, n;
        }, A(t, e);
      }
      function G(t) {
        if (t === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }
      function q(t) {
        var e = (function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {
            }))), !0;
          } catch {
            return !1;
          }
        })();
        return function() {
          var n, i = T(t);
          if (e) {
            var o = T(this).constructor;
            n = Reflect.construct(i, arguments, o);
          } else n = i.apply(this, arguments);
          return (function(r, d) {
            if (d && (typeof d == "object" || typeof d == "function")) return d;
            if (d !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
            return G(r);
          })(this, n);
        };
      }
      function I() {
        return I = typeof Reflect < "u" && Reflect.get ? Reflect.get.bind() : function(t, e, n) {
          var i = (function(r, d) {
            for (; !Object.prototype.hasOwnProperty.call(r, d) && (r = T(r)) !== null; ) ;
            return r;
          })(t, e);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, e);
            return o.get ? o.get.call(arguments.length < 3 ? t : n) : o.value;
          }
        }, I.apply(this, arguments);
      }
      function C(t) {
        var e = (function(n, i) {
          if (typeof n != "object" || n === null) return n;
          var o = n[Symbol.toPrimitive];
          if (o !== void 0) {
            var r = o.call(n, i);
            if (typeof r != "object") return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return String(n);
        })(t, "string");
        return typeof e == "symbol" ? e : e + "";
      }
      var ie = function(t) {
        return !(!t || !t.Window) && t instanceof t.Window;
      }, ae = void 0, z = void 0;
      function F(t) {
        ae = t;
        var e = t.document.createTextNode("");
        e.ownerDocument !== t.document && typeof t.wrap == "function" && t.wrap(e) === e && (t = t.wrap(t)), z = t;
      }
      function R(t) {
        return ie(t) ? t : (t.ownerDocument || t).defaultView || z.window;
      }
      typeof window < "u" && window && F(window);
      var N = function(t) {
        return !!t && y(t) === "object";
      }, ce = function(t) {
        return typeof t == "function";
      }, E = { window: function(t) {
        return t === z || ie(t);
      }, docFrag: function(t) {
        return N(t) && t.nodeType === 11;
      }, object: N, func: ce, number: function(t) {
        return typeof t == "number";
      }, bool: function(t) {
        return typeof t == "boolean";
      }, string: function(t) {
        return typeof t == "string";
      }, element: function(t) {
        if (!t || y(t) !== "object") return !1;
        var e = R(t) || z;
        return /object|function/.test(typeof Element > "u" ? "undefined" : y(Element)) ? t instanceof Element || t instanceof e.Element : t.nodeType === 1 && typeof t.nodeName == "string";
      }, plainObject: function(t) {
        return N(t) && !!t.constructor && /function Object\b/.test(t.constructor.toString());
      }, array: function(t) {
        return N(t) && t.length !== void 0 && ce(t.splice);
      } };
      function $e(t) {
        var e = t.interaction;
        if (e.prepared.name === "drag") {
          var n = e.prepared.axis;
          n === "x" ? (e.coords.cur.page.y = e.coords.start.page.y, e.coords.cur.client.y = e.coords.start.client.y, e.coords.velocity.client.y = 0, e.coords.velocity.page.y = 0) : n === "y" && (e.coords.cur.page.x = e.coords.start.page.x, e.coords.cur.client.x = e.coords.start.client.x, e.coords.velocity.client.x = 0, e.coords.velocity.page.x = 0);
        }
      }
      function Se(t) {
        var e = t.iEvent, n = t.interaction;
        if (n.prepared.name === "drag") {
          var i = n.prepared.axis;
          if (i === "x" || i === "y") {
            var o = i === "x" ? "y" : "x";
            e.page[o] = n.coords.start.page[o], e.client[o] = n.coords.start.client[o], e.delta[o] = 0;
          }
        }
      }
      var be = { id: "actions/drag", install: function(t) {
        var e = t.actions, n = t.Interactable, i = t.defaults;
        n.prototype.draggable = be.draggable, e.map.drag = be, e.methodDict.drag = "draggable", i.actions.drag = be.defaults;
      }, listeners: { "interactions:before-action-move": $e, "interactions:action-resume": $e, "interactions:action-move": Se, "auto-start:check": function(t) {
        var e = t.interaction, n = t.interactable, i = t.buttons, o = n.options.drag;
        if (o && o.enabled && (!e.pointerIsDown || !/mouse|pointer/.test(e.pointerType) || (i & n.options.drag.mouseButtons) != 0)) return t.action = { name: "drag", axis: o.lockAxis === "start" ? o.startAxis : o.lockAxis }, !1;
      } }, draggable: function(t) {
        return E.object(t) ? (this.options.drag.enabled = t.enabled !== !1, this.setPerAction("drag", t), this.setOnEvents("drag", t), /^(xy|x|y|start)$/.test(t.lockAxis) && (this.options.drag.lockAxis = t.lockAxis), /^(xy|x|y)$/.test(t.startAxis) && (this.options.drag.startAxis = t.startAxis), this) : E.bool(t) ? (this.options.drag.enabled = t, this) : this.options.drag;
      }, beforeMove: $e, move: Se, defaults: { startAxis: "xy", lockAxis: "xy" }, getCursor: function() {
        return "move";
      }, filterEventType: function(t) {
        return t.search("drag") === 0;
      } }, qe = be, xe = { init: function(t) {
        var e = t;
        xe.document = e.document, xe.DocumentFragment = e.DocumentFragment || De, xe.SVGElement = e.SVGElement || De, xe.SVGSVGElement = e.SVGSVGElement || De, xe.SVGElementInstance = e.SVGElementInstance || De, xe.Element = e.Element || De, xe.HTMLElement = e.HTMLElement || xe.Element, xe.Event = e.Event, xe.Touch = e.Touch || De, xe.PointerEvent = e.PointerEvent || e.MSPointerEvent;
      }, document: null, DocumentFragment: null, SVGElement: null, SVGSVGElement: null, SVGElementInstance: null, Element: null, HTMLElement: null, Event: null, Touch: null, PointerEvent: null };
      function De() {
      }
      var V = xe, S = { init: function(t) {
        var e = V.Element, n = t.navigator || {};
        S.supportsTouch = "ontouchstart" in t || E.func(t.DocumentTouch) && V.document instanceof t.DocumentTouch, S.supportsPointerEvent = n.pointerEnabled !== !1 && !!V.PointerEvent, S.isIOS = /iP(hone|od|ad)/.test(n.platform), S.isIOS7 = /iP(hone|od|ad)/.test(n.platform) && /OS 7[^\d]/.test(n.appVersion), S.isIe9 = /MSIE 9/.test(n.userAgent), S.isOperaMobile = n.appName === "Opera" && S.supportsTouch && /Presto/.test(n.userAgent), S.prefixedMatchesSelector = "matches" in e.prototype ? "matches" : "webkitMatchesSelector" in e.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in e.prototype ? "mozMatchesSelector" : "oMatchesSelector" in e.prototype ? "oMatchesSelector" : "msMatchesSelector", S.pEventTypes = S.supportsPointerEvent ? V.PointerEvent === t.MSPointerEvent ? { up: "MSPointerUp", down: "MSPointerDown", over: "mouseover", out: "mouseout", move: "MSPointerMove", cancel: "MSPointerCancel" } : { up: "pointerup", down: "pointerdown", over: "pointerover", out: "pointerout", move: "pointermove", cancel: "pointercancel" } : null, S.wheelEvent = V.document && "onmousewheel" in V.document ? "mousewheel" : "wheel";
      }, supportsTouch: null, supportsPointerEvent: null, isIOS7: null, isIOS: null, isIe9: null, isOperaMobile: null, prefixedMatchesSelector: null, pEventTypes: null, wheelEvent: null }, B = S;
      function W(t, e) {
        if (t.contains) return t.contains(e);
        for (; e; ) {
          if (e === t) return !0;
          e = e.parentNode;
        }
        return !1;
      }
      function ke(t, e) {
        for (; E.element(t); ) {
          if (Te(t, e)) return t;
          t = _e(t);
        }
        return null;
      }
      function _e(t) {
        var e = t.parentNode;
        if (E.docFrag(e)) {
          for (; (e = e.host) && E.docFrag(e); ) ;
          return e;
        }
        return e;
      }
      function Te(t, e) {
        return z !== ae && (e = e.replace(/\/deep\//g, " ")), t[B.prefixedMatchesSelector](e);
      }
      var Ce = function(t) {
        return t.parentNode || t.host;
      };
      function he(t, e) {
        for (var n, i = [], o = t; (n = Ce(o)) && o !== e && n !== o.ownerDocument; ) i.unshift(o), o = n;
        return i;
      }
      function Be(t, e, n) {
        for (; E.element(t); ) {
          if (Te(t, e)) return !0;
          if ((t = _e(t)) === n) return Te(t, e);
        }
        return !1;
      }
      function Fe(t) {
        return t.correspondingUseElement || t;
      }
      function vt(t) {
        var e = t instanceof V.SVGElement ? t.getBoundingClientRect() : t.getClientRects()[0];
        return e && { left: e.left, right: e.right, top: e.top, bottom: e.bottom, width: e.width || e.right - e.left, height: e.height || e.bottom - e.top };
      }
      function mt(t) {
        var e, n = vt(t);
        if (!B.isIOS7 && n) {
          var i = { x: (e = (e = R(t)) || z).scrollX || e.document.documentElement.scrollLeft, y: e.scrollY || e.document.documentElement.scrollTop };
          n.left += i.x, n.right += i.x, n.top += i.y, n.bottom += i.y;
        }
        return n;
      }
      function Xn(t) {
        for (var e = []; t; ) e.push(t), t = _e(t);
        return e;
      }
      function Kn(t) {
        return !!E.string(t) && (V.document.querySelector(t), !0);
      }
      function Z(t, e) {
        for (var n in e) t[n] = e[n];
        return t;
      }
      function Jn(t, e, n) {
        return t === "parent" ? _e(n) : t === "self" ? e.getRect(n) : ke(n, t);
      }
      function yt(t, e, n, i) {
        var o = t;
        return E.string(o) ? o = Jn(o, e, n) : E.func(o) && (o = o.apply(void 0, i)), E.element(o) && (o = mt(o)), o;
      }
      function Lt(t) {
        return t && { x: "x" in t ? t.x : t.left, y: "y" in t ? t.y : t.top };
      }
      function an(t) {
        return !t || "x" in t && "y" in t || ((t = Z({}, t)).x = t.left || 0, t.y = t.top || 0, t.width = t.width || (t.right || 0) - t.x, t.height = t.height || (t.bottom || 0) - t.y), t;
      }
      function Ht(t, e, n) {
        t.left && (e.left += n.x), t.right && (e.right += n.x), t.top && (e.top += n.y), t.bottom && (e.bottom += n.y), e.width = e.right - e.left, e.height = e.bottom - e.top;
      }
      function bt(t, e, n) {
        var i = n && t.options[n];
        return Lt(yt(i && i.origin || t.options.origin, t, e, [t && e])) || { x: 0, y: 0 };
      }
      function ot(t, e) {
        var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(h) {
          return !0;
        }, i = arguments.length > 3 ? arguments[3] : void 0;
        if (i = i || {}, E.string(t) && t.search(" ") !== -1 && (t = Qn(t)), E.array(t)) return t.forEach((function(h) {
          return ot(h, e, n, i);
        })), i;
        if (E.object(t) && (e = t, t = ""), E.func(e) && n(t)) i[t] = i[t] || [], i[t].push(e);
        else if (E.array(e)) for (var o = 0, r = e; o < r.length; o++) {
          var d = r[o];
          ot(t, d, n, i);
        }
        else if (E.object(e)) for (var p in e)
          ot(Qn(p).map((function(h) {
            return "".concat(t).concat(h);
          })), e[p], n, i);
        return i;
      }
      function Qn(t) {
        return t.trim().split(/ +/);
      }
      var _t = function(t, e) {
        return Math.sqrt(t * t + e * e);
      }, Hs = ["webkit", "moz"];
      function zt(t, e) {
        t.__set || (t.__set = {});
        var n = function(o) {
          if (Hs.some((function(r) {
            return o.indexOf(r) === 0;
          }))) return 1;
          typeof t[o] != "function" && o !== "__set" && Object.defineProperty(t, o, { get: function() {
            return o in t.__set ? t.__set[o] : t.__set[o] = e[o];
          }, set: function(r) {
            t.__set[o] = r;
          }, configurable: !0 });
        };
        for (var i in e) n(i);
        return t;
      }
      function Ft(t, e) {
        t.page = t.page || {}, t.page.x = e.page.x, t.page.y = e.page.y, t.client = t.client || {}, t.client.x = e.client.x, t.client.y = e.client.y, t.timeStamp = e.timeStamp;
      }
      function Zn(t) {
        t.page.x = 0, t.page.y = 0, t.client.x = 0, t.client.y = 0;
      }
      function ei(t) {
        return t instanceof V.Event || t instanceof V.Touch;
      }
      function Nt(t, e, n) {
        return t = t || "page", (n = n || {}).x = e[t + "X"], n.y = e[t + "Y"], n;
      }
      function ti(t, e) {
        return e = e || { x: 0, y: 0 }, B.isOperaMobile && ei(t) ? (Nt("screen", t, e), e.x += window.scrollX, e.y += window.scrollY) : Nt("page", t, e), e;
      }
      function xt(t) {
        return E.number(t.pointerId) ? t.pointerId : t.identifier;
      }
      function zs(t, e, n) {
        var i = e.length > 1 ? ni(e) : e[0];
        ti(i, t.page), (function(o, r) {
          r = r || {}, B.isOperaMobile && ei(o) ? Nt("screen", o, r) : Nt("client", o, r);
        })(i, t.client), t.timeStamp = n;
      }
      function ln(t) {
        var e = [];
        return E.array(t) ? (e[0] = t[0], e[1] = t[1]) : t.type === "touchend" ? t.touches.length === 1 ? (e[0] = t.touches[0], e[1] = t.changedTouches[0]) : t.touches.length === 0 && (e[0] = t.changedTouches[0], e[1] = t.changedTouches[1]) : (e[0] = t.touches[0], e[1] = t.touches[1]), e;
      }
      function ni(t) {
        for (var e = { pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0 }, n = 0; n < t.length; n++) {
          var i = t[n];
          for (var o in e) e[o] += i[o];
        }
        for (var r in e) e[r] /= t.length;
        return e;
      }
      function cn(t) {
        if (!t.length) return null;
        var e = ln(t), n = Math.min(e[0].pageX, e[1].pageX), i = Math.min(e[0].pageY, e[1].pageY), o = Math.max(e[0].pageX, e[1].pageX), r = Math.max(e[0].pageY, e[1].pageY);
        return { x: n, y: i, left: n, top: i, right: o, bottom: r, width: o - n, height: r - i };
      }
      function dn(t, e) {
        var n = e + "X", i = e + "Y", o = ln(t), r = o[0][n] - o[1][n], d = o[0][i] - o[1][i];
        return _t(r, d);
      }
      function un(t, e) {
        var n = e + "X", i = e + "Y", o = ln(t), r = o[1][n] - o[0][n], d = o[1][i] - o[0][i];
        return 180 * Math.atan2(d, r) / Math.PI;
      }
      function ii(t) {
        return E.string(t.pointerType) ? t.pointerType : E.number(t.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][t.pointerType] : /touch/.test(t.type || "") || t instanceof V.Touch ? "touch" : "mouse";
      }
      function si(t) {
        var e = E.func(t.composedPath) ? t.composedPath() : t.path;
        return [Fe(e ? e[0] : t.target), Fe(t.currentTarget)];
      }
      var Bt = (function() {
        function t(e) {
          v(this, t), this.immediatePropagationStopped = !1, this.propagationStopped = !1, this._interaction = e;
        }
        return k(t, [{ key: "preventDefault", value: function() {
        } }, { key: "stopPropagation", value: function() {
          this.propagationStopped = !0;
        } }, { key: "stopImmediatePropagation", value: function() {
          this.immediatePropagationStopped = this.propagationStopped = !0;
        } }]), t;
      })();
      Object.defineProperty(Bt.prototype, "interaction", { get: function() {
        return this._interaction._proxy;
      }, set: function() {
      } });
      var oi = function(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          t.push(i);
        }
        return t;
      }, ri = function(t) {
        return oi([], t);
      }, kt = function(t, e) {
        for (var n = 0; n < t.length; n++) if (e(t[n], n, t)) return n;
        return -1;
      }, wt = function(t, e) {
        return t[kt(t, e)];
      }, pt = (function(t) {
        P(n, t);
        var e = q(n);
        function n(i, o, r) {
          var d;
          v(this, n), (d = e.call(this, o._interaction)).dropzone = void 0, d.dragEvent = void 0, d.relatedTarget = void 0, d.draggable = void 0, d.propagationStopped = !1, d.immediatePropagationStopped = !1;
          var p = r === "dragleave" ? i.prev : i.cur, h = p.element, _ = p.dropzone;
          return d.type = r, d.target = h, d.currentTarget = h, d.dropzone = _, d.dragEvent = o, d.relatedTarget = o.target, d.draggable = o.interactable, d.timeStamp = o.timeStamp, d;
        }
        return k(n, [{ key: "reject", value: function() {
          var i = this, o = this._interaction.dropState;
          if (this.type === "dropactivate" || this.dropzone && o.cur.dropzone === this.dropzone && o.cur.element === this.target) if (o.prev.dropzone = this.dropzone, o.prev.element = this.target, o.rejected = !0, o.events.enter = null, this.stopImmediatePropagation(), this.type === "dropactivate") {
            var r = o.activeDrops, d = kt(r, (function(h) {
              var _ = h.dropzone, g = h.element;
              return _ === i.dropzone && g === i.target;
            }));
            o.activeDrops.splice(d, 1);
            var p = new n(o, this.dragEvent, "dropdeactivate");
            p.dropzone = this.dropzone, p.target = this.target, this.dropzone.fire(p);
          } else this.dropzone.fire(new n(o, this.dragEvent, "dragleave"));
        } }, { key: "preventDefault", value: function() {
        } }, { key: "stopPropagation", value: function() {
          this.propagationStopped = !0;
        } }, { key: "stopImmediatePropagation", value: function() {
          this.immediatePropagationStopped = this.propagationStopped = !0;
        } }]), n;
      })(Bt);
      function ai(t, e) {
        for (var n = 0, i = t.slice(); n < i.length; n++) {
          var o = i[n], r = o.dropzone, d = o.element;
          e.dropzone = r, e.target = d, r.fire(e), e.propagationStopped = e.immediatePropagationStopped = !1;
        }
      }
      function pn(t, e) {
        for (var n = (function(r, d) {
          for (var p = [], h = 0, _ = r.interactables.list; h < _.length; h++) {
            var g = _[h];
            if (g.options.drop.enabled) {
              var $ = g.options.drop.accept;
              if (!(E.element($) && $ !== d || E.string($) && !Te(d, $) || E.func($) && !$({ dropzone: g, draggableElement: d }))) for (var O = 0, L = g.getAllElements(); O < L.length; O++) {
                var j = L[O];
                j !== d && p.push({ dropzone: g, element: j, rect: g.getRect(j) });
              }
            }
          }
          return p;
        })(t, e), i = 0; i < n.length; i++) {
          var o = n[i];
          o.rect = o.dropzone.getRect(o.element);
        }
        return n;
      }
      function li(t, e, n) {
        for (var i = t.dropState, o = t.interactable, r = t.element, d = [], p = 0, h = i.activeDrops; p < h.length; p++) {
          var _ = h[p], g = _.dropzone, $ = _.element, O = _.rect, L = g.dropCheck(e, n, o, r, $, O);
          d.push(L ? $ : null);
        }
        var j = (function(H) {
          for (var K, Y, Q, se = [], le = 0; le < H.length; le++) {
            var te = H[le], oe = H[K];
            if (te && le !== K) if (oe) {
              var Pe = Ce(te), me = Ce(oe);
              if (Pe !== te.ownerDocument) if (me !== te.ownerDocument) if (Pe !== me) {
                se = se.length ? se : he(oe);
                var Re = void 0;
                if (oe instanceof V.HTMLElement && te instanceof V.SVGElement && !(te instanceof V.SVGSVGElement)) {
                  if (te === me) continue;
                  Re = te.ownerSVGElement;
                } else Re = te;
                for (var Le = he(Re, oe.ownerDocument), Ve = 0; Le[Ve] && Le[Ve] === se[Ve]; ) Ve++;
                var Qt = [Le[Ve - 1], Le[Ve], se[Ve]];
                if (Qt[0]) for (var Ct = Qt[0].lastChild; Ct; ) {
                  if (Ct === Qt[1]) {
                    K = le, se = Le;
                    break;
                  }
                  if (Ct === Qt[2]) break;
                  Ct = Ct.previousSibling;
                }
              } else Q = oe, (parseInt(R(Y = te).getComputedStyle(Y).zIndex, 10) || 0) >= (parseInt(R(Q).getComputedStyle(Q).zIndex, 10) || 0) && (K = le);
              else K = le;
            } else K = le;
          }
          return K;
        })(d);
        return i.activeDrops[j] || null;
      }
      function fn(t, e, n) {
        var i = t.dropState, o = { enter: null, leave: null, activate: null, deactivate: null, move: null, drop: null };
        return n.type === "dragstart" && (o.activate = new pt(i, n, "dropactivate"), o.activate.target = null, o.activate.dropzone = null), n.type === "dragend" && (o.deactivate = new pt(i, n, "dropdeactivate"), o.deactivate.target = null, o.deactivate.dropzone = null), i.rejected || (i.cur.element !== i.prev.element && (i.prev.dropzone && (o.leave = new pt(i, n, "dragleave"), n.dragLeave = o.leave.target = i.prev.element, n.prevDropzone = o.leave.dropzone = i.prev.dropzone), i.cur.dropzone && (o.enter = new pt(i, n, "dragenter"), n.dragEnter = i.cur.element, n.dropzone = i.cur.dropzone)), n.type === "dragend" && i.cur.dropzone && (o.drop = new pt(i, n, "drop"), n.dropzone = i.cur.dropzone, n.relatedTarget = i.cur.element), n.type === "dragmove" && i.cur.dropzone && (o.move = new pt(i, n, "dropmove"), n.dropzone = i.cur.dropzone)), o;
      }
      function hn(t, e) {
        var n = t.dropState, i = n.activeDrops, o = n.cur, r = n.prev;
        e.leave && r.dropzone.fire(e.leave), e.enter && o.dropzone.fire(e.enter), e.move && o.dropzone.fire(e.move), e.drop && o.dropzone.fire(e.drop), e.deactivate && ai(i, e.deactivate), n.prev.dropzone = o.dropzone, n.prev.element = o.element;
      }
      function ci(t, e) {
        var n = t.interaction, i = t.iEvent, o = t.event;
        if (i.type === "dragmove" || i.type === "dragend") {
          var r = n.dropState;
          e.dynamicDrop && (r.activeDrops = pn(e, n.element));
          var d = i, p = li(n, d, o);
          r.rejected = r.rejected && !!p && p.dropzone === r.cur.dropzone && p.element === r.cur.element, r.cur.dropzone = p && p.dropzone, r.cur.element = p && p.element, r.events = fn(n, 0, d);
        }
      }
      var di = { id: "actions/drop", install: function(t) {
        var e = t.actions, n = t.interactStatic, i = t.Interactable, o = t.defaults;
        t.usePlugin(qe), i.prototype.dropzone = function(r) {
          return (function(d, p) {
            if (E.object(p)) {
              if (d.options.drop.enabled = p.enabled !== !1, p.listeners) {
                var h = ot(p.listeners), _ = Object.keys(h).reduce((function($, O) {
                  return $[/^(enter|leave)/.test(O) ? "drag".concat(O) : /^(activate|deactivate|move)/.test(O) ? "drop".concat(O) : O] = h[O], $;
                }), {}), g = d.options.drop.listeners;
                g && d.off(g), d.on(_), d.options.drop.listeners = _;
              }
              return E.func(p.ondrop) && d.on("drop", p.ondrop), E.func(p.ondropactivate) && d.on("dropactivate", p.ondropactivate), E.func(p.ondropdeactivate) && d.on("dropdeactivate", p.ondropdeactivate), E.func(p.ondragenter) && d.on("dragenter", p.ondragenter), E.func(p.ondragleave) && d.on("dragleave", p.ondragleave), E.func(p.ondropmove) && d.on("dropmove", p.ondropmove), /^(pointer|center)$/.test(p.overlap) ? d.options.drop.overlap = p.overlap : E.number(p.overlap) && (d.options.drop.overlap = Math.max(Math.min(1, p.overlap), 0)), "accept" in p && (d.options.drop.accept = p.accept), "checker" in p && (d.options.drop.checker = p.checker), d;
            }
            return E.bool(p) ? (d.options.drop.enabled = p, d) : d.options.drop;
          })(this, r);
        }, i.prototype.dropCheck = function(r, d, p, h, _, g) {
          return (function($, O, L, j, H, K, Y) {
            var Q = !1;
            if (!(Y = Y || $.getRect(K))) return !!$.options.drop.checker && $.options.drop.checker(O, L, Q, $, K, j, H);
            var se = $.options.drop.overlap;
            if (se === "pointer") {
              var le = bt(j, H, "drag"), te = ti(O);
              te.x += le.x, te.y += le.y;
              var oe = te.x > Y.left && te.x < Y.right, Pe = te.y > Y.top && te.y < Y.bottom;
              Q = oe && Pe;
            }
            var me = j.getRect(H);
            if (me && se === "center") {
              var Re = me.left + me.width / 2, Le = me.top + me.height / 2;
              Q = Re >= Y.left && Re <= Y.right && Le >= Y.top && Le <= Y.bottom;
            }
            return me && E.number(se) && (Q = Math.max(0, Math.min(Y.right, me.right) - Math.max(Y.left, me.left)) * Math.max(0, Math.min(Y.bottom, me.bottom) - Math.max(Y.top, me.top)) / (me.width * me.height) >= se), $.options.drop.checker && (Q = $.options.drop.checker(O, L, Q, $, K, j, H)), Q;
          })(this, r, d, p, h, _, g);
        }, n.dynamicDrop = function(r) {
          return E.bool(r) ? (t.dynamicDrop = r, n) : t.dynamicDrop;
        }, Z(e.phaselessTypes, { dragenter: !0, dragleave: !0, dropactivate: !0, dropdeactivate: !0, dropmove: !0, drop: !0 }), e.methodDict.drop = "dropzone", t.dynamicDrop = !1, o.actions.drop = di.defaults;
      }, listeners: { "interactions:before-action-start": function(t) {
        var e = t.interaction;
        e.prepared.name === "drag" && (e.dropState = { cur: { dropzone: null, element: null }, prev: { dropzone: null, element: null }, rejected: null, events: null, activeDrops: [] });
      }, "interactions:after-action-start": function(t, e) {
        var n = t.interaction, i = (t.event, t.iEvent);
        if (n.prepared.name === "drag") {
          var o = n.dropState;
          o.activeDrops = [], o.events = {}, o.activeDrops = pn(e, n.element), o.events = fn(n, 0, i), o.events.activate && (ai(o.activeDrops, o.events.activate), e.fire("actions/drop:start", { interaction: n, dragEvent: i }));
        }
      }, "interactions:action-move": ci, "interactions:after-action-move": function(t, e) {
        var n = t.interaction, i = t.iEvent;
        if (n.prepared.name === "drag") {
          var o = n.dropState;
          hn(n, o.events), e.fire("actions/drop:move", { interaction: n, dragEvent: i }), o.events = {};
        }
      }, "interactions:action-end": function(t, e) {
        if (t.interaction.prepared.name === "drag") {
          var n = t.interaction, i = t.iEvent;
          ci(t, e), hn(n, n.dropState.events), e.fire("actions/drop:end", { interaction: n, dragEvent: i });
        }
      }, "interactions:stop": function(t) {
        var e = t.interaction;
        if (e.prepared.name === "drag") {
          var n = e.dropState;
          n && (n.activeDrops = null, n.events = null, n.cur.dropzone = null, n.cur.element = null, n.prev.dropzone = null, n.prev.element = null, n.rejected = !1);
        }
      } }, getActiveDrops: pn, getDrop: li, getDropEvents: fn, fireDropEvents: hn, filterEventType: function(t) {
        return t.search("drag") === 0 || t.search("drop") === 0;
      }, defaults: { enabled: !1, accept: null, overlap: "pointer" } }, Fs = di;
      function gn(t) {
        var e = t.interaction, n = t.iEvent, i = t.phase;
        if (e.prepared.name === "gesture") {
          var o = e.pointers.map((function(_) {
            return _.pointer;
          })), r = i === "start", d = i === "end", p = e.interactable.options.deltaSource;
          if (n.touches = [o[0], o[1]], r) n.distance = dn(o, p), n.box = cn(o), n.scale = 1, n.ds = 0, n.angle = un(o, p), n.da = 0, e.gesture.startDistance = n.distance, e.gesture.startAngle = n.angle;
          else if (d || e.pointers.length < 2) {
            var h = e.prevEvent;
            n.distance = h.distance, n.box = h.box, n.scale = h.scale, n.ds = 0, n.angle = h.angle, n.da = 0;
          } else n.distance = dn(o, p), n.box = cn(o), n.scale = n.distance / e.gesture.startDistance, n.angle = un(o, p), n.ds = n.scale - e.gesture.scale, n.da = n.angle - e.gesture.angle;
          e.gesture.distance = n.distance, e.gesture.angle = n.angle, E.number(n.scale) && n.scale !== 1 / 0 && !isNaN(n.scale) && (e.gesture.scale = n.scale);
        }
      }
      var vn = { id: "actions/gesture", before: ["actions/drag", "actions/resize"], install: function(t) {
        var e = t.actions, n = t.Interactable, i = t.defaults;
        n.prototype.gesturable = function(o) {
          return E.object(o) ? (this.options.gesture.enabled = o.enabled !== !1, this.setPerAction("gesture", o), this.setOnEvents("gesture", o), this) : E.bool(o) ? (this.options.gesture.enabled = o, this) : this.options.gesture;
        }, e.map.gesture = vn, e.methodDict.gesture = "gesturable", i.actions.gesture = vn.defaults;
      }, listeners: { "interactions:action-start": gn, "interactions:action-move": gn, "interactions:action-end": gn, "interactions:new": function(t) {
        t.interaction.gesture = { angle: 0, distance: 0, scale: 1, startAngle: 0, startDistance: 0 };
      }, "auto-start:check": function(t) {
        if (!(t.interaction.pointers.length < 2)) {
          var e = t.interactable.options.gesture;
          if (e && e.enabled) return t.action = { name: "gesture" }, !1;
        }
      } }, defaults: {}, getCursor: function() {
        return "";
      }, filterEventType: function(t) {
        return t.search("gesture") === 0;
      } }, Ns = vn;
      function Bs(t, e, n, i, o, r, d) {
        if (!e) return !1;
        if (e === !0) {
          var p = E.number(r.width) ? r.width : r.right - r.left, h = E.number(r.height) ? r.height : r.bottom - r.top;
          if (d = Math.min(d, Math.abs((t === "left" || t === "right" ? p : h) / 2)), p < 0 && (t === "left" ? t = "right" : t === "right" && (t = "left")), h < 0 && (t === "top" ? t = "bottom" : t === "bottom" && (t = "top")), t === "left") {
            var _ = p >= 0 ? r.left : r.right;
            return n.x < _ + d;
          }
          if (t === "top") {
            var g = h >= 0 ? r.top : r.bottom;
            return n.y < g + d;
          }
          if (t === "right") return n.x > (p >= 0 ? r.right : r.left) - d;
          if (t === "bottom") return n.y > (h >= 0 ? r.bottom : r.top) - d;
        }
        return !!E.element(i) && (E.element(e) ? e === i : Be(i, e, o));
      }
      function ui(t) {
        var e = t.iEvent, n = t.interaction;
        if (n.prepared.name === "resize" && n.resizeAxes) {
          var i = e;
          n.interactable.options.resize.square ? (n.resizeAxes === "y" ? i.delta.x = i.delta.y : i.delta.y = i.delta.x, i.axes = "xy") : (i.axes = n.resizeAxes, n.resizeAxes === "x" ? i.delta.y = 0 : n.resizeAxes === "y" && (i.delta.x = 0));
        }
      }
      var Ue, rt, Ge = { id: "actions/resize", before: ["actions/drag"], install: function(t) {
        var e = t.actions, n = t.browser, i = t.Interactable, o = t.defaults;
        Ge.cursors = (function(r) {
          return r.isIe9 ? { x: "e-resize", y: "s-resize", xy: "se-resize", top: "n-resize", left: "w-resize", bottom: "s-resize", right: "e-resize", topleft: "se-resize", bottomright: "se-resize", topright: "ne-resize", bottomleft: "ne-resize" } : { x: "ew-resize", y: "ns-resize", xy: "nwse-resize", top: "ns-resize", left: "ew-resize", bottom: "ns-resize", right: "ew-resize", topleft: "nwse-resize", bottomright: "nwse-resize", topright: "nesw-resize", bottomleft: "nesw-resize" };
        })(n), Ge.defaultMargin = n.supportsTouch || n.supportsPointerEvent ? 20 : 10, i.prototype.resizable = function(r) {
          return (function(d, p, h) {
            return E.object(p) ? (d.options.resize.enabled = p.enabled !== !1, d.setPerAction("resize", p), d.setOnEvents("resize", p), E.string(p.axis) && /^x$|^y$|^xy$/.test(p.axis) ? d.options.resize.axis = p.axis : p.axis === null && (d.options.resize.axis = h.defaults.actions.resize.axis), E.bool(p.preserveAspectRatio) ? d.options.resize.preserveAspectRatio = p.preserveAspectRatio : E.bool(p.square) && (d.options.resize.square = p.square), d) : E.bool(p) ? (d.options.resize.enabled = p, d) : d.options.resize;
          })(this, r, t);
        }, e.map.resize = Ge, e.methodDict.resize = "resizable", o.actions.resize = Ge.defaults;
      }, listeners: { "interactions:new": function(t) {
        t.interaction.resizeAxes = "xy";
      }, "interactions:action-start": function(t) {
        (function(e) {
          var n = e.iEvent, i = e.interaction;
          if (i.prepared.name === "resize" && i.prepared.edges) {
            var o = n, r = i.rect;
            i._rects = { start: Z({}, r), corrected: Z({}, r), previous: Z({}, r), delta: { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 } }, o.edges = i.prepared.edges, o.rect = i._rects.corrected, o.deltaRect = i._rects.delta;
          }
        })(t), ui(t);
      }, "interactions:action-move": function(t) {
        (function(e) {
          var n = e.iEvent, i = e.interaction;
          if (i.prepared.name === "resize" && i.prepared.edges) {
            var o = n, r = i.interactable.options.resize.invert, d = r === "reposition" || r === "negate", p = i.rect, h = i._rects, _ = h.start, g = h.corrected, $ = h.delta, O = h.previous;
            if (Z(O, g), d) {
              if (Z(g, p), r === "reposition") {
                if (g.top > g.bottom) {
                  var L = g.top;
                  g.top = g.bottom, g.bottom = L;
                }
                if (g.left > g.right) {
                  var j = g.left;
                  g.left = g.right, g.right = j;
                }
              }
            } else g.top = Math.min(p.top, _.bottom), g.bottom = Math.max(p.bottom, _.top), g.left = Math.min(p.left, _.right), g.right = Math.max(p.right, _.left);
            for (var H in g.width = g.right - g.left, g.height = g.bottom - g.top, g) $[H] = g[H] - O[H];
            o.edges = i.prepared.edges, o.rect = g, o.deltaRect = $;
          }
        })(t), ui(t);
      }, "interactions:action-end": function(t) {
        var e = t.iEvent, n = t.interaction;
        if (n.prepared.name === "resize" && n.prepared.edges) {
          var i = e;
          i.edges = n.prepared.edges, i.rect = n._rects.corrected, i.deltaRect = n._rects.delta;
        }
      }, "auto-start:check": function(t) {
        var e = t.interaction, n = t.interactable, i = t.element, o = t.rect, r = t.buttons;
        if (o) {
          var d = Z({}, e.coords.cur.page), p = n.options.resize;
          if (p && p.enabled && (!e.pointerIsDown || !/mouse|pointer/.test(e.pointerType) || (r & p.mouseButtons) != 0)) {
            if (E.object(p.edges)) {
              var h = { left: !1, right: !1, top: !1, bottom: !1 };
              for (var _ in h) h[_] = Bs(_, p.edges[_], d, e._latestPointer.eventTarget, i, o, p.margin || Ge.defaultMargin);
              h.left = h.left && !h.right, h.top = h.top && !h.bottom, (h.left || h.right || h.top || h.bottom) && (t.action = { name: "resize", edges: h });
            } else {
              var g = p.axis !== "y" && d.x > o.right - Ge.defaultMargin, $ = p.axis !== "x" && d.y > o.bottom - Ge.defaultMargin;
              (g || $) && (t.action = { name: "resize", axes: (g ? "x" : "") + ($ ? "y" : "") });
            }
            return !t.action && void 0;
          }
        }
      } }, defaults: { square: !1, preserveAspectRatio: !1, axis: "xy", margin: NaN, edges: null, invert: "none" }, cursors: null, getCursor: function(t) {
        var e = t.edges, n = t.axis, i = t.name, o = Ge.cursors, r = null;
        if (n) r = o[i + n];
        else if (e) {
          for (var d = "", p = 0, h = ["top", "bottom", "left", "right"]; p < h.length; p++) {
            var _ = h[p];
            e[_] && (d += _);
          }
          r = o[d];
        }
        return r;
      }, filterEventType: function(t) {
        return t.search("resize") === 0;
      }, defaultMargin: null }, Us = Ge, Gs = { id: "actions", install: function(t) {
        t.usePlugin(Ns), t.usePlugin(Us), t.usePlugin(qe), t.usePlugin(Fs);
      } }, pi = 0, Ke = { request: function(t) {
        return Ue(t);
      }, cancel: function(t) {
        return rt(t);
      }, init: function(t) {
        if (Ue = t.requestAnimationFrame, rt = t.cancelAnimationFrame, !Ue) for (var e = ["ms", "moz", "webkit", "o"], n = 0; n < e.length; n++) {
          var i = e[n];
          Ue = t["".concat(i, "RequestAnimationFrame")], rt = t["".concat(i, "CancelAnimationFrame")] || t["".concat(i, "CancelRequestAnimationFrame")];
        }
        Ue = Ue && Ue.bind(t), rt = rt && rt.bind(t), Ue || (Ue = function(o) {
          var r = Date.now(), d = Math.max(0, 16 - (r - pi)), p = t.setTimeout((function() {
            o(r + d);
          }), d);
          return pi = r + d, p;
        }, rt = function(o) {
          return clearTimeout(o);
        });
      } }, ne = { defaults: { enabled: !1, margin: 60, container: null, speed: 300 }, now: Date.now, interaction: null, i: 0, x: 0, y: 0, isScrolling: !1, prevTime: 0, margin: 0, speed: 0, start: function(t) {
        ne.isScrolling = !0, Ke.cancel(ne.i), t.autoScroll = ne, ne.interaction = t, ne.prevTime = ne.now(), ne.i = Ke.request(ne.scroll);
      }, stop: function() {
        ne.isScrolling = !1, ne.interaction && (ne.interaction.autoScroll = null), Ke.cancel(ne.i);
      }, scroll: function() {
        var t = ne.interaction, e = t.interactable, n = t.element, i = t.prepared.name, o = e.options[i].autoScroll, r = fi(o.container, e, n), d = ne.now(), p = (d - ne.prevTime) / 1e3, h = o.speed * p;
        if (h >= 1) {
          var _ = { x: ne.x * h, y: ne.y * h };
          if (_.x || _.y) {
            var g = hi(r);
            E.window(r) ? r.scrollBy(_.x, _.y) : r && (r.scrollLeft += _.x, r.scrollTop += _.y);
            var $ = hi(r), O = { x: $.x - g.x, y: $.y - g.y };
            (O.x || O.y) && e.fire({ type: "autoscroll", target: n, interactable: e, delta: O, interaction: t, container: r });
          }
          ne.prevTime = d;
        }
        ne.isScrolling && (Ke.cancel(ne.i), ne.i = Ke.request(ne.scroll));
      }, check: function(t, e) {
        var n;
        return (n = t.options[e].autoScroll) == null ? void 0 : n.enabled;
      }, onInteractionMove: function(t) {
        var e = t.interaction, n = t.pointer;
        if (e.interacting() && ne.check(e.interactable, e.prepared.name)) if (e.simulation) ne.x = ne.y = 0;
        else {
          var i, o, r, d, p = e.interactable, h = e.element, _ = e.prepared.name, g = p.options[_].autoScroll, $ = fi(g.container, p, h);
          if (E.window($)) d = n.clientX < ne.margin, i = n.clientY < ne.margin, o = n.clientX > $.innerWidth - ne.margin, r = n.clientY > $.innerHeight - ne.margin;
          else {
            var O = vt($);
            d = n.clientX < O.left + ne.margin, i = n.clientY < O.top + ne.margin, o = n.clientX > O.right - ne.margin, r = n.clientY > O.bottom - ne.margin;
          }
          ne.x = o ? 1 : d ? -1 : 0, ne.y = r ? 1 : i ? -1 : 0, ne.isScrolling || (ne.margin = g.margin, ne.speed = g.speed, ne.start(e));
        }
      } };
      function fi(t, e, n) {
        return (E.string(t) ? Jn(t, e, n) : t) || R(n);
      }
      function hi(t) {
        return E.window(t) && (t = window.document.body), { x: t.scrollLeft, y: t.scrollTop };
      }
      var Vs = { id: "auto-scroll", install: function(t) {
        var e = t.defaults, n = t.actions;
        t.autoScroll = ne, ne.now = function() {
          return t.now();
        }, n.phaselessTypes.autoscroll = !0, e.perAction.autoScroll = ne.defaults;
      }, listeners: { "interactions:new": function(t) {
        t.interaction.autoScroll = null;
      }, "interactions:destroy": function(t) {
        t.interaction.autoScroll = null, ne.stop(), ne.interaction && (ne.interaction = null);
      }, "interactions:stop": ne.stop, "interactions:action-move": function(t) {
        return ne.onInteractionMove(t);
      } } }, Ys = Vs;
      function $t(t, e) {
        var n = !1;
        return function() {
          return n || (z.console.warn(e), n = !0), t.apply(this, arguments);
        };
      }
      function mn(t, e) {
        return t.name = e.name, t.axis = e.axis, t.edges = e.edges, t;
      }
      function Ws(t) {
        return E.bool(t) ? (this.options.styleCursor = t, this) : t === null ? (delete this.options.styleCursor, this) : this.options.styleCursor;
      }
      function Xs(t) {
        return E.func(t) ? (this.options.actionChecker = t, this) : t === null ? (delete this.options.actionChecker, this) : this.options.actionChecker;
      }
      var Ks = { id: "auto-start/interactableMethods", install: function(t) {
        var e = t.Interactable;
        e.prototype.getAction = function(n, i, o, r) {
          var d = (function(p, h, _, g, $) {
            var O = p.getRect(g), L = h.buttons || { 0: 1, 1: 4, 3: 8, 4: 16 }[h.button], j = { action: null, interactable: p, interaction: _, element: g, rect: O, buttons: L };
            return $.fire("auto-start:check", j), j.action;
          })(this, i, o, r, t);
          return this.options.actionChecker ? this.options.actionChecker(n, i, d, this, r, o) : d;
        }, e.prototype.ignoreFrom = $t((function(n) {
          return this._backCompatOption("ignoreFrom", n);
        }), "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."), e.prototype.allowFrom = $t((function(n) {
          return this._backCompatOption("allowFrom", n);
        }), "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."), e.prototype.actionChecker = Xs, e.prototype.styleCursor = Ws;
      } };
      function gi(t, e, n, i, o) {
        return e.testIgnoreAllow(e.options[t.name], n, i) && e.options[t.name].enabled && Ut(e, n, t, o) ? t : null;
      }
      function Js(t, e, n, i, o, r, d) {
        for (var p = 0, h = i.length; p < h; p++) {
          var _ = i[p], g = o[p], $ = _.getAction(e, n, t, g);
          if ($) {
            var O = gi($, _, g, r, d);
            if (O) return { action: O, interactable: _, element: g };
          }
        }
        return { action: null, interactable: null, element: null };
      }
      function vi(t, e, n, i, o) {
        var r = [], d = [], p = i;
        function h(g) {
          r.push(g), d.push(p);
        }
        for (; E.element(p); ) {
          r = [], d = [], o.interactables.forEachMatch(p, h);
          var _ = Js(t, e, n, r, d, i, o);
          if (_.action && !_.interactable.options[_.action.name].manualStart) return _;
          p = _e(p);
        }
        return { action: null, interactable: null, element: null };
      }
      function mi(t, e, n) {
        var i = e.action, o = e.interactable, r = e.element;
        i = i || { name: null }, t.interactable = o, t.element = r, mn(t.prepared, i), t.rect = o && i.name ? o.getRect(r) : null, bi(t, n), n.fire("autoStart:prepared", { interaction: t });
      }
      function Ut(t, e, n, i) {
        var o = t.options, r = o[n.name].max, d = o[n.name].maxPerElement, p = i.autoStart.maxInteractions, h = 0, _ = 0, g = 0;
        if (!(r && d && p)) return !1;
        for (var $ = 0, O = i.interactions.list; $ < O.length; $++) {
          var L = O[$], j = L.prepared.name;
          if (L.interacting() && (++h >= p || L.interactable === t && ((_ += j === n.name ? 1 : 0) >= r || L.element === e && (g++, j === n.name && g >= d))))
            return !1;
        }
        return p > 0;
      }
      function yi(t, e) {
        return E.number(t) ? (e.autoStart.maxInteractions = t, this) : e.autoStart.maxInteractions;
      }
      function yn(t, e, n) {
        var i = n.autoStart.cursorElement;
        i && i !== t && (i.style.cursor = ""), t.ownerDocument.documentElement.style.cursor = e, t.style.cursor = e, n.autoStart.cursorElement = e ? t : null;
      }
      function bi(t, e) {
        var n = t.interactable, i = t.element, o = t.prepared;
        if (t.pointerType === "mouse" && n && n.options.styleCursor) {
          var r = "";
          if (o.name) {
            var d = n.options[o.name].cursorChecker;
            r = E.func(d) ? d(o, n, i, t._interacting) : e.actions.map[o.name].getCursor(o);
          }
          yn(t.element, r || "", e);
        } else e.autoStart.cursorElement && yn(e.autoStart.cursorElement, "", e);
      }
      var Qs = { id: "auto-start/base", before: ["actions"], install: function(t) {
        var e = t.interactStatic, n = t.defaults;
        t.usePlugin(Ks), n.base.actionChecker = null, n.base.styleCursor = !0, Z(n.perAction, { manualStart: !1, max: 1 / 0, maxPerElement: 1, allowFrom: null, ignoreFrom: null, mouseButtons: 1 }), e.maxInteractions = function(i) {
          return yi(i, t);
        }, t.autoStart = { maxInteractions: 1 / 0, withinInteractionLimit: Ut, cursorElement: null };
      }, listeners: { "interactions:down": function(t, e) {
        var n = t.interaction, i = t.pointer, o = t.event, r = t.eventTarget;
        n.interacting() || mi(n, vi(n, i, o, r, e), e);
      }, "interactions:move": function(t, e) {
        (function(n, i) {
          var o = n.interaction, r = n.pointer, d = n.event, p = n.eventTarget;
          o.pointerType !== "mouse" || o.pointerIsDown || o.interacting() || mi(o, vi(o, r, d, p, i), i);
        })(t, e), (function(n, i) {
          var o = n.interaction;
          if (o.pointerIsDown && !o.interacting() && o.pointerWasMoved && o.prepared.name) {
            i.fire("autoStart:before-start", n);
            var r = o.interactable, d = o.prepared.name;
            d && r && (r.options[d].manualStart || !Ut(r, o.element, o.prepared, i) ? o.stop() : (o.start(o.prepared, r, o.element), bi(o, i)));
          }
        })(t, e);
      }, "interactions:stop": function(t, e) {
        var n = t.interaction, i = n.interactable;
        i && i.options.styleCursor && yn(n.element, "", e);
      } }, maxInteractions: yi, withinInteractionLimit: Ut, validateAction: gi }, bn = Qs, Zs = { id: "auto-start/dragAxis", listeners: { "autoStart:before-start": function(t, e) {
        var n = t.interaction, i = t.eventTarget, o = t.dx, r = t.dy;
        if (n.prepared.name === "drag") {
          var d = Math.abs(o), p = Math.abs(r), h = n.interactable.options.drag, _ = h.startAxis, g = d > p ? "x" : d < p ? "y" : "xy";
          if (n.prepared.axis = h.lockAxis === "start" ? g[0] : h.lockAxis, g !== "xy" && _ !== "xy" && _ !== g) {
            n.prepared.name = null;
            for (var $ = i, O = function(j) {
              if (j !== n.interactable) {
                var H = n.interactable.options.drag;
                if (!H.manualStart && j.testIgnoreAllow(H, $, i)) {
                  var K = j.getAction(n.downPointer, n.downEvent, n, $);
                  if (K && K.name === "drag" && (function(Y, Q) {
                    if (!Q) return !1;
                    var se = Q.options.drag.startAxis;
                    return Y === "xy" || se === "xy" || se === Y;
                  })(g, j) && bn.validateAction(K, j, $, i, e)) return j;
                }
              }
            }; E.element($); ) {
              var L = e.interactables.forEachMatch($, O);
              if (L) {
                n.prepared.name = "drag", n.interactable = L, n.element = $;
                break;
              }
              $ = _e($);
            }
          }
        }
      } } };
      function _n(t) {
        var e = t.prepared && t.prepared.name;
        if (!e) return null;
        var n = t.interactable.options;
        return n[e].hold || n[e].delay;
      }
      var eo = { id: "auto-start/hold", install: function(t) {
        var e = t.defaults;
        t.usePlugin(bn), e.perAction.hold = 0, e.perAction.delay = 0;
      }, listeners: { "interactions:new": function(t) {
        t.interaction.autoStartHoldTimer = null;
      }, "autoStart:prepared": function(t) {
        var e = t.interaction, n = _n(e);
        n > 0 && (e.autoStartHoldTimer = setTimeout((function() {
          e.start(e.prepared, e.interactable, e.element);
        }), n));
      }, "interactions:move": function(t) {
        var e = t.interaction, n = t.duplicate;
        e.autoStartHoldTimer && e.pointerWasMoved && !n && (clearTimeout(e.autoStartHoldTimer), e.autoStartHoldTimer = null);
      }, "autoStart:before-start": function(t) {
        var e = t.interaction;
        _n(e) > 0 && (e.prepared.name = null);
      } }, getHoldDuration: _n }, to = eo, no = { id: "auto-start", install: function(t) {
        t.usePlugin(bn), t.usePlugin(to), t.usePlugin(Zs);
      } }, io = function(t) {
        return /^(always|never|auto)$/.test(t) ? (this.options.preventDefault = t, this) : E.bool(t) ? (this.options.preventDefault = t ? "always" : "never", this) : this.options.preventDefault;
      };
      function so(t) {
        var e = t.interaction, n = t.event;
        e.interactable && e.interactable.checkAndPreventDefault(n);
      }
      var _i = { id: "core/interactablePreventDefault", install: function(t) {
        var e = t.Interactable;
        e.prototype.preventDefault = io, e.prototype.checkAndPreventDefault = function(n) {
          return (function(i, o, r) {
            var d = i.options.preventDefault;
            if (d !== "never") if (d !== "always") {
              if (o.events.supportsPassive && /^touch(start|move)$/.test(r.type)) {
                var p = R(r.target).document, h = o.getDocOptions(p);
                if (!h || !h.events || h.events.passive !== !1) return;
              }
              /^(mouse|pointer|touch)*(down|start)/i.test(r.type) || E.element(r.target) && Te(r.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *") || r.preventDefault();
            } else r.preventDefault();
          })(this, t, n);
        }, t.interactions.docEvents.push({ type: "dragstart", listener: function(n) {
          for (var i = 0, o = t.interactions.list; i < o.length; i++) {
            var r = o[i];
            if (r.element && (r.element === n.target || W(r.element, n.target))) return void r.interactable.checkAndPreventDefault(n);
          }
        } });
      }, listeners: ["down", "move", "up", "cancel"].reduce((function(t, e) {
        return t["interactions:".concat(e)] = so, t;
      }), {}) };
      function Gt(t, e) {
        if (e.phaselessTypes[t]) return !0;
        for (var n in e.map) if (t.indexOf(n) === 0 && t.substr(n.length) in e.phases) return !0;
        return !1;
      }
      function ft(t) {
        var e = {};
        for (var n in t) {
          var i = t[n];
          E.plainObject(i) ? e[n] = ft(i) : E.array(i) ? e[n] = ri(i) : e[n] = i;
        }
        return e;
      }
      var xn = (function() {
        function t(e) {
          v(this, t), this.states = [], this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 }, this.startDelta = void 0, this.result = void 0, this.endResult = void 0, this.startEdges = void 0, this.edges = void 0, this.interaction = void 0, this.interaction = e, this.result = Vt(), this.edges = { left: !1, right: !1, top: !1, bottom: !1 };
        }
        return k(t, [{ key: "start", value: function(e, n) {
          var i, o, r = e.phase, d = this.interaction, p = (function(_) {
            var g = _.interactable.options[_.prepared.name], $ = g.modifiers;
            return $ && $.length ? $ : ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map((function(O) {
              var L = g[O];
              return L && L.enabled && { options: L, methods: L._methods };
            })).filter((function(O) {
              return !!O;
            }));
          })(d);
          this.prepareStates(p), this.startEdges = Z({}, d.edges), this.edges = Z({}, this.startEdges), this.startOffset = (i = d.rect, o = n, i ? { left: o.x - i.left, top: o.y - i.top, right: i.right - o.x, bottom: i.bottom - o.y } : { left: 0, top: 0, right: 0, bottom: 0 }), this.startDelta = { x: 0, y: 0 };
          var h = this.fillArg({ phase: r, pageCoords: n, preEnd: !1 });
          return this.result = Vt(), this.startAll(h), this.result = this.setAll(h);
        } }, { key: "fillArg", value: function(e) {
          var n = this.interaction;
          return e.interaction = n, e.interactable = n.interactable, e.element = n.element, e.rect || (e.rect = n.rect), e.edges || (e.edges = this.startEdges), e.startOffset = this.startOffset, e;
        } }, { key: "startAll", value: function(e) {
          for (var n = 0, i = this.states; n < i.length; n++) {
            var o = i[n];
            o.methods.start && (e.state = o, o.methods.start(e));
          }
        } }, { key: "setAll", value: function(e) {
          var n = e.phase, i = e.preEnd, o = e.skipModifiers, r = e.rect, d = e.edges;
          e.coords = Z({}, e.pageCoords), e.rect = Z({}, r), e.edges = Z({}, d);
          for (var p = o ? this.states.slice(o) : this.states, h = Vt(e.coords, e.rect), _ = 0; _ < p.length; _++) {
            var g, $ = p[_], O = $.options, L = Z({}, e.coords), j = null;
            (g = $.methods) != null && g.set && this.shouldDo(O, i, n) && (e.state = $, j = $.methods.set(e), Ht(e.edges, e.rect, { x: e.coords.x - L.x, y: e.coords.y - L.y })), h.eventProps.push(j);
          }
          Z(this.edges, e.edges), h.delta.x = e.coords.x - e.pageCoords.x, h.delta.y = e.coords.y - e.pageCoords.y, h.rectDelta.left = e.rect.left - r.left, h.rectDelta.right = e.rect.right - r.right, h.rectDelta.top = e.rect.top - r.top, h.rectDelta.bottom = e.rect.bottom - r.bottom;
          var H = this.result.coords, K = this.result.rect;
          if (H && K) {
            var Y = h.rect.left !== K.left || h.rect.right !== K.right || h.rect.top !== K.top || h.rect.bottom !== K.bottom;
            h.changed = Y || H.x !== h.coords.x || H.y !== h.coords.y;
          }
          return h;
        } }, { key: "applyToInteraction", value: function(e) {
          var n = this.interaction, i = e.phase, o = n.coords.cur, r = n.coords.start, d = this.result, p = this.startDelta, h = d.delta;
          i === "start" && Z(this.startDelta, d.delta);
          for (var _ = 0, g = [[r, p], [o, h]]; _ < g.length; _++) {
            var $ = g[_], O = $[0], L = $[1];
            O.page.x += L.x, O.page.y += L.y, O.client.x += L.x, O.client.y += L.y;
          }
          var j = this.result.rectDelta, H = e.rect || n.rect;
          H.left += j.left, H.right += j.right, H.top += j.top, H.bottom += j.bottom, H.width = H.right - H.left, H.height = H.bottom - H.top;
        } }, { key: "setAndApply", value: function(e) {
          var n = this.interaction, i = e.phase, o = e.preEnd, r = e.skipModifiers, d = this.setAll(this.fillArg({ preEnd: o, phase: i, pageCoords: e.modifiedCoords || n.coords.cur.page }));
          if (this.result = d, !d.changed && (!r || r < this.states.length) && n.interacting()) return !1;
          if (e.modifiedCoords) {
            var p = n.coords.cur.page, h = { x: e.modifiedCoords.x - p.x, y: e.modifiedCoords.y - p.y };
            d.coords.x += h.x, d.coords.y += h.y, d.delta.x += h.x, d.delta.y += h.y;
          }
          this.applyToInteraction(e);
        } }, { key: "beforeEnd", value: function(e) {
          var n = e.interaction, i = e.event, o = this.states;
          if (o && o.length) {
            for (var r = !1, d = 0; d < o.length; d++) {
              var p = o[d];
              e.state = p;
              var h = p.options, _ = p.methods, g = _.beforeEnd && _.beforeEnd(e);
              if (g) return this.endResult = g, !1;
              r = r || !r && this.shouldDo(h, !0, e.phase, !0);
            }
            r && n.move({ event: i, preEnd: !0 });
          }
        } }, { key: "stop", value: function(e) {
          var n = e.interaction;
          if (this.states && this.states.length) {
            var i = Z({ states: this.states, interactable: n.interactable, element: n.element, rect: null }, e);
            this.fillArg(i);
            for (var o = 0, r = this.states; o < r.length; o++) {
              var d = r[o];
              i.state = d, d.methods.stop && d.methods.stop(i);
            }
            this.states = null, this.endResult = null;
          }
        } }, { key: "prepareStates", value: function(e) {
          this.states = [];
          for (var n = 0; n < e.length; n++) {
            var i = e[n], o = i.options, r = i.methods, d = i.name;
            this.states.push({ options: o, methods: r, index: n, name: d });
          }
          return this.states;
        } }, { key: "restoreInteractionCoords", value: function(e) {
          var n = e.interaction, i = n.coords, o = n.rect, r = n.modification;
          if (r.result) {
            for (var d = r.startDelta, p = r.result, h = p.delta, _ = p.rectDelta, g = 0, $ = [[i.start, d], [i.cur, h]]; g < $.length; g++) {
              var O = $[g], L = O[0], j = O[1];
              L.page.x -= j.x, L.page.y -= j.y, L.client.x -= j.x, L.client.y -= j.y;
            }
            o.left -= _.left, o.right -= _.right, o.top -= _.top, o.bottom -= _.bottom;
          }
        } }, { key: "shouldDo", value: function(e, n, i, o) {
          return !(!e || e.enabled === !1 || o && !e.endOnly || e.endOnly && !n || i === "start" && !e.setStart);
        } }, { key: "copyFrom", value: function(e) {
          this.startOffset = e.startOffset, this.startDelta = e.startDelta, this.startEdges = e.startEdges, this.edges = e.edges, this.states = e.states.map((function(n) {
            return ft(n);
          })), this.result = Vt(Z({}, e.result.coords), Z({}, e.result.rect));
        } }, { key: "destroy", value: function() {
          for (var e in this) this[e] = null;
        } }]), t;
      })();
      function Vt(t, e) {
        return { rect: e, coords: t, delta: { x: 0, y: 0 }, rectDelta: { left: 0, right: 0, top: 0, bottom: 0 }, eventProps: [], changed: !0 };
      }
      function Je(t, e) {
        var n = t.defaults, i = { start: t.start, set: t.set, beforeEnd: t.beforeEnd, stop: t.stop }, o = function(r) {
          var d = r || {};
          for (var p in d.enabled = d.enabled !== !1, n) p in d || (d[p] = n[p]);
          var h = { options: d, methods: i, name: e, enable: function() {
            return d.enabled = !0, h;
          }, disable: function() {
            return d.enabled = !1, h;
          } };
          return h;
        };
        return e && typeof e == "string" && (o._defaults = n, o._methods = i), o;
      }
      function St(t) {
        var e = t.iEvent, n = t.interaction.modification.result;
        n && (e.modifiers = n.eventProps);
      }
      var oo = { id: "modifiers/base", before: ["actions"], install: function(t) {
        t.defaults.perAction.modifiers = [];
      }, listeners: { "interactions:new": function(t) {
        var e = t.interaction;
        e.modification = new xn(e);
      }, "interactions:before-action-start": function(t) {
        var e = t.interaction, n = t.interaction.modification;
        n.start(t, e.coords.start.page), e.edges = n.edges, n.applyToInteraction(t);
      }, "interactions:before-action-move": function(t) {
        var e = t.interaction, n = e.modification, i = n.setAndApply(t);
        return e.edges = n.edges, i;
      }, "interactions:before-action-end": function(t) {
        var e = t.interaction, n = e.modification, i = n.beforeEnd(t);
        return e.edges = n.startEdges, i;
      }, "interactions:action-start": St, "interactions:action-move": St, "interactions:action-end": St, "interactions:after-action-start": function(t) {
        return t.interaction.modification.restoreInteractionCoords(t);
      }, "interactions:after-action-move": function(t) {
        return t.interaction.modification.restoreInteractionCoords(t);
      }, "interactions:stop": function(t) {
        return t.interaction.modification.stop(t);
      } } }, xi = oo, ki = { base: { preventDefault: "auto", deltaSource: "page" }, perAction: { enabled: !1, origin: { x: 0, y: 0 } }, actions: {} }, kn = (function(t) {
        P(n, t);
        var e = q(n);
        function n(i, o, r, d, p, h, _) {
          var g;
          v(this, n), (g = e.call(this, i)).relatedTarget = null, g.screenX = void 0, g.screenY = void 0, g.button = void 0, g.buttons = void 0, g.ctrlKey = void 0, g.shiftKey = void 0, g.altKey = void 0, g.metaKey = void 0, g.page = void 0, g.client = void 0, g.delta = void 0, g.rect = void 0, g.x0 = void 0, g.y0 = void 0, g.t0 = void 0, g.dt = void 0, g.duration = void 0, g.clientX0 = void 0, g.clientY0 = void 0, g.velocity = void 0, g.speed = void 0, g.swipe = void 0, g.axes = void 0, g.preEnd = void 0, p = p || i.element;
          var $ = i.interactable, O = ($ && $.options || ki).deltaSource, L = bt($, p, r), j = d === "start", H = d === "end", K = j ? G(g) : i.prevEvent, Y = j ? i.coords.start : H ? { page: K.page, client: K.client, timeStamp: i.coords.cur.timeStamp } : i.coords.cur;
          return g.page = Z({}, Y.page), g.client = Z({}, Y.client), g.rect = Z({}, i.rect), g.timeStamp = Y.timeStamp, H || (g.page.x -= L.x, g.page.y -= L.y, g.client.x -= L.x, g.client.y -= L.y), g.ctrlKey = o.ctrlKey, g.altKey = o.altKey, g.shiftKey = o.shiftKey, g.metaKey = o.metaKey, g.button = o.button, g.buttons = o.buttons, g.target = p, g.currentTarget = p, g.preEnd = h, g.type = _ || r + (d || ""), g.interactable = $, g.t0 = j ? i.pointers[i.pointers.length - 1].downTime : K.t0, g.x0 = i.coords.start.page.x - L.x, g.y0 = i.coords.start.page.y - L.y, g.clientX0 = i.coords.start.client.x - L.x, g.clientY0 = i.coords.start.client.y - L.y, g.delta = j || H ? { x: 0, y: 0 } : { x: g[O].x - K[O].x, y: g[O].y - K[O].y }, g.dt = i.coords.delta.timeStamp, g.duration = g.timeStamp - g.t0, g.velocity = Z({}, i.coords.velocity[O]), g.speed = _t(g.velocity.x, g.velocity.y), g.swipe = H || d === "inertiastart" ? g.getSwipe() : null, g;
        }
        return k(n, [{ key: "getSwipe", value: function() {
          var i = this._interaction;
          if (i.prevEvent.speed < 600 || this.timeStamp - i.prevEvent.timeStamp > 150) return null;
          var o = 180 * Math.atan2(i.prevEvent.velocityY, i.prevEvent.velocityX) / Math.PI;
          o < 0 && (o += 360);
          var r = 112.5 <= o && o < 247.5, d = 202.5 <= o && o < 337.5;
          return { up: d, down: !d && 22.5 <= o && o < 157.5, left: r, right: !r && (292.5 <= o || o < 67.5), angle: o, speed: i.prevEvent.speed, velocity: { x: i.prevEvent.velocityX, y: i.prevEvent.velocityY } };
        } }, { key: "preventDefault", value: function() {
        } }, { key: "stopImmediatePropagation", value: function() {
          this.immediatePropagationStopped = this.propagationStopped = !0;
        } }, { key: "stopPropagation", value: function() {
          this.propagationStopped = !0;
        } }]), n;
      })(Bt);
      Object.defineProperties(kn.prototype, { pageX: { get: function() {
        return this.page.x;
      }, set: function(t) {
        this.page.x = t;
      } }, pageY: { get: function() {
        return this.page.y;
      }, set: function(t) {
        this.page.y = t;
      } }, clientX: { get: function() {
        return this.client.x;
      }, set: function(t) {
        this.client.x = t;
      } }, clientY: { get: function() {
        return this.client.y;
      }, set: function(t) {
        this.client.y = t;
      } }, dx: { get: function() {
        return this.delta.x;
      }, set: function(t) {
        this.delta.x = t;
      } }, dy: { get: function() {
        return this.delta.y;
      }, set: function(t) {
        this.delta.y = t;
      } }, velocityX: { get: function() {
        return this.velocity.x;
      }, set: function(t) {
        this.velocity.x = t;
      } }, velocityY: { get: function() {
        return this.velocity.y;
      }, set: function(t) {
        this.velocity.y = t;
      } } });
      var ro = k((function t(e, n, i, o, r) {
        v(this, t), this.id = void 0, this.pointer = void 0, this.event = void 0, this.downTime = void 0, this.downTarget = void 0, this.id = e, this.pointer = n, this.event = i, this.downTime = o, this.downTarget = r;
      })), ao = (function(t) {
        return t.interactable = "", t.element = "", t.prepared = "", t.pointerIsDown = "", t.pointerWasMoved = "", t._proxy = "", t;
      })({}), wi = (function(t) {
        return t.start = "", t.move = "", t.end = "", t.stop = "", t.interacting = "", t;
      })({}), lo = 0, co = (function() {
        function t(e) {
          var n = this, i = e.pointerType, o = e.scopeFire;
          v(this, t), this.interactable = null, this.element = null, this.rect = null, this._rects = void 0, this.edges = null, this._scopeFire = void 0, this.prepared = { name: null, axis: null, edges: null }, this.pointerType = void 0, this.pointers = [], this.downEvent = null, this.downPointer = {}, this._latestPointer = { pointer: null, event: null, eventTarget: null }, this.prevEvent = null, this.pointerIsDown = !1, this.pointerWasMoved = !1, this._interacting = !1, this._ending = !1, this._stopped = !0, this._proxy = void 0, this.simulation = null, this.doMove = $t((function(g) {
            this.move(g);
          }), "The interaction.doMove() method has been renamed to interaction.move()"), this.coords = { start: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, prev: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, cur: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, delta: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, velocity: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 } }, this._id = lo++, this._scopeFire = o, this.pointerType = i;
          var r = this;
          this._proxy = {};
          var d = function(g) {
            Object.defineProperty(n._proxy, g, { get: function() {
              return r[g];
            } });
          };
          for (var p in ao) d(p);
          var h = function(g) {
            Object.defineProperty(n._proxy, g, { value: function() {
              return r[g].apply(r, arguments);
            } });
          };
          for (var _ in wi) h(_);
          this._scopeFire("interactions:new", { interaction: this });
        }
        return k(t, [{ key: "pointerMoveTolerance", get: function() {
          return 1;
        } }, { key: "pointerDown", value: function(e, n, i) {
          var o = this.updatePointer(e, n, i, !0), r = this.pointers[o];
          this._scopeFire("interactions:down", { pointer: e, event: n, eventTarget: i, pointerIndex: o, pointerInfo: r, type: "down", interaction: this });
        } }, { key: "start", value: function(e, n, i) {
          return !(this.interacting() || !this.pointerIsDown || this.pointers.length < (e.name === "gesture" ? 2 : 1) || !n.options[e.name].enabled) && (mn(this.prepared, e), this.interactable = n, this.element = i, this.rect = n.getRect(i), this.edges = this.prepared.edges ? Z({}, this.prepared.edges) : { left: !0, right: !0, top: !0, bottom: !0 }, this._stopped = !1, this._interacting = this._doPhase({ interaction: this, event: this.downEvent, phase: "start" }) && !this._stopped, this._interacting);
        } }, { key: "pointerMove", value: function(e, n, i) {
          this.simulation || this.modification && this.modification.endResult || this.updatePointer(e, n, i, !1);
          var o, r, d = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
          this.pointerIsDown && !this.pointerWasMoved && (o = this.coords.cur.client.x - this.coords.start.client.x, r = this.coords.cur.client.y - this.coords.start.client.y, this.pointerWasMoved = _t(o, r) > this.pointerMoveTolerance);
          var p, h, _, g = this.getPointerIndex(e), $ = { pointer: e, pointerIndex: g, pointerInfo: this.pointers[g], event: n, type: "move", eventTarget: i, dx: o, dy: r, duplicate: d, interaction: this };
          d || (p = this.coords.velocity, h = this.coords.delta, _ = Math.max(h.timeStamp / 1e3, 1e-3), p.page.x = h.page.x / _, p.page.y = h.page.y / _, p.client.x = h.client.x / _, p.client.y = h.client.y / _, p.timeStamp = _), this._scopeFire("interactions:move", $), d || this.simulation || (this.interacting() && ($.type = null, this.move($)), this.pointerWasMoved && Ft(this.coords.prev, this.coords.cur));
        } }, { key: "move", value: function(e) {
          e && e.event || Zn(this.coords.delta), (e = Z({ pointer: this._latestPointer.pointer, event: this._latestPointer.event, eventTarget: this._latestPointer.eventTarget, interaction: this }, e || {})).phase = "move", this._doPhase(e);
        } }, { key: "pointerUp", value: function(e, n, i, o) {
          var r = this.getPointerIndex(e);
          r === -1 && (r = this.updatePointer(e, n, i, !1));
          var d = /cancel$/i.test(n.type) ? "cancel" : "up";
          this._scopeFire("interactions:".concat(d), { pointer: e, pointerIndex: r, pointerInfo: this.pointers[r], event: n, eventTarget: i, type: d, curEventTarget: o, interaction: this }), this.simulation || this.end(n), this.removePointer(e, n);
        } }, { key: "documentBlur", value: function(e) {
          this.end(e), this._scopeFire("interactions:blur", { event: e, type: "blur", interaction: this });
        } }, { key: "end", value: function(e) {
          var n;
          this._ending = !0, e = e || this._latestPointer.event, this.interacting() && (n = this._doPhase({ event: e, interaction: this, phase: "end" })), this._ending = !1, n === !0 && this.stop();
        } }, { key: "currentAction", value: function() {
          return this._interacting ? this.prepared.name : null;
        } }, { key: "interacting", value: function() {
          return this._interacting;
        } }, { key: "stop", value: function() {
          this._scopeFire("interactions:stop", { interaction: this }), this.interactable = this.element = null, this._interacting = !1, this._stopped = !0, this.prepared.name = this.prevEvent = null;
        } }, { key: "getPointerIndex", value: function(e) {
          var n = xt(e);
          return this.pointerType === "mouse" || this.pointerType === "pen" ? this.pointers.length - 1 : kt(this.pointers, (function(i) {
            return i.id === n;
          }));
        } }, { key: "getPointerInfo", value: function(e) {
          return this.pointers[this.getPointerIndex(e)];
        } }, { key: "updatePointer", value: function(e, n, i, o) {
          var r, d, p, h = xt(e), _ = this.getPointerIndex(e), g = this.pointers[_];
          return o = o !== !1 && (o || /(down|start)$/i.test(n.type)), g ? g.pointer = e : (g = new ro(h, e, n, null, null), _ = this.pointers.length, this.pointers.push(g)), zs(this.coords.cur, this.pointers.map((function($) {
            return $.pointer;
          })), this._now()), r = this.coords.delta, d = this.coords.prev, p = this.coords.cur, r.page.x = p.page.x - d.page.x, r.page.y = p.page.y - d.page.y, r.client.x = p.client.x - d.client.x, r.client.y = p.client.y - d.client.y, r.timeStamp = p.timeStamp - d.timeStamp, o && (this.pointerIsDown = !0, g.downTime = this.coords.cur.timeStamp, g.downTarget = i, zt(this.downPointer, e), this.interacting() || (Ft(this.coords.start, this.coords.cur), Ft(this.coords.prev, this.coords.cur), this.downEvent = n, this.pointerWasMoved = !1)), this._updateLatestPointer(e, n, i), this._scopeFire("interactions:update-pointer", { pointer: e, event: n, eventTarget: i, down: o, pointerInfo: g, pointerIndex: _, interaction: this }), _;
        } }, { key: "removePointer", value: function(e, n) {
          var i = this.getPointerIndex(e);
          if (i !== -1) {
            var o = this.pointers[i];
            this._scopeFire("interactions:remove-pointer", { pointer: e, event: n, eventTarget: null, pointerIndex: i, pointerInfo: o, interaction: this }), this.pointers.splice(i, 1), this.pointerIsDown = !1;
          }
        } }, { key: "_updateLatestPointer", value: function(e, n, i) {
          this._latestPointer.pointer = e, this._latestPointer.event = n, this._latestPointer.eventTarget = i;
        } }, { key: "destroy", value: function() {
          this._latestPointer.pointer = null, this._latestPointer.event = null, this._latestPointer.eventTarget = null;
        } }, { key: "_createPreparedEvent", value: function(e, n, i, o) {
          return new kn(this, e, this.prepared.name, n, this.element, i, o);
        } }, { key: "_fireEvent", value: function(e) {
          var n;
          (n = this.interactable) == null || n.fire(e), (!this.prevEvent || e.timeStamp >= this.prevEvent.timeStamp) && (this.prevEvent = e);
        } }, { key: "_doPhase", value: function(e) {
          var n = e.event, i = e.phase, o = e.preEnd, r = e.type, d = this.rect;
          if (d && i === "move" && (Ht(this.edges, d, this.coords.delta[this.interactable.options.deltaSource]), d.width = d.right - d.left, d.height = d.bottom - d.top), this._scopeFire("interactions:before-action-".concat(i), e) === !1) return !1;
          var p = e.iEvent = this._createPreparedEvent(n, i, o, r);
          return this._scopeFire("interactions:action-".concat(i), e), i === "start" && (this.prevEvent = p), this._fireEvent(p), this._scopeFire("interactions:after-action-".concat(i), e), !0;
        } }, { key: "_now", value: function() {
          return Date.now();
        } }]), t;
      })();
      function $i(t) {
        Si(t.interaction);
      }
      function Si(t) {
        if (!(function(n) {
          return !(!n.offset.pending.x && !n.offset.pending.y);
        })(t)) return !1;
        var e = t.offset.pending;
        return wn(t.coords.cur, e), wn(t.coords.delta, e), Ht(t.edges, t.rect, e), e.x = 0, e.y = 0, !0;
      }
      function uo(t) {
        var e = t.x, n = t.y;
        this.offset.pending.x += e, this.offset.pending.y += n, this.offset.total.x += e, this.offset.total.y += n;
      }
      function wn(t, e) {
        var n = t.page, i = t.client, o = e.x, r = e.y;
        n.x += o, n.y += r, i.x += o, i.y += r;
      }
      wi.offsetBy = "";
      var po = { id: "offset", before: ["modifiers", "pointer-events", "actions", "inertia"], install: function(t) {
        t.Interaction.prototype.offsetBy = uo;
      }, listeners: { "interactions:new": function(t) {
        t.interaction.offset = { total: { x: 0, y: 0 }, pending: { x: 0, y: 0 } };
      }, "interactions:update-pointer": function(t) {
        return (function(e) {
          e.pointerIsDown && (wn(e.coords.cur, e.offset.total), e.offset.pending.x = 0, e.offset.pending.y = 0);
        })(t.interaction);
      }, "interactions:before-action-start": $i, "interactions:before-action-move": $i, "interactions:before-action-end": function(t) {
        var e = t.interaction;
        if (Si(e)) return e.move({ offset: !0 }), e.end(), !1;
      }, "interactions:stop": function(t) {
        var e = t.interaction;
        e.offset.total.x = 0, e.offset.total.y = 0, e.offset.pending.x = 0, e.offset.pending.y = 0;
      } } }, Ei = po, fo = (function() {
        function t(e) {
          v(this, t), this.active = !1, this.isModified = !1, this.smoothEnd = !1, this.allowResume = !1, this.modification = void 0, this.modifierCount = 0, this.modifierArg = void 0, this.startCoords = void 0, this.t0 = 0, this.v0 = 0, this.te = 0, this.targetOffset = void 0, this.modifiedOffset = void 0, this.currentOffset = void 0, this.lambda_v0 = 0, this.one_ve_v0 = 0, this.timeout = void 0, this.interaction = void 0, this.interaction = e;
        }
        return k(t, [{ key: "start", value: function(e) {
          var n = this.interaction, i = Yt(n);
          if (!i || !i.enabled) return !1;
          var o = n.coords.velocity.client, r = _t(o.x, o.y), d = this.modification || (this.modification = new xn(n));
          if (d.copyFrom(n.modification), this.t0 = n._now(), this.allowResume = i.allowResume, this.v0 = r, this.currentOffset = { x: 0, y: 0 }, this.startCoords = n.coords.cur.page, this.modifierArg = d.fillArg({ pageCoords: this.startCoords, preEnd: !0, phase: "inertiastart" }), this.t0 - n.coords.cur.timeStamp < 50 && r > i.minSpeed && r > i.endSpeed) this.startInertia();
          else {
            if (d.result = d.setAll(this.modifierArg), !d.result.changed) return !1;
            this.startSmoothEnd();
          }
          return n.modification.result.rect = null, n.offsetBy(this.targetOffset), n._doPhase({ interaction: n, event: e, phase: "inertiastart" }), n.offsetBy({ x: -this.targetOffset.x, y: -this.targetOffset.y }), n.modification.result.rect = null, this.active = !0, n.simulation = this, !0;
        } }, { key: "startInertia", value: function() {
          var e = this, n = this.interaction.coords.velocity.client, i = Yt(this.interaction), o = i.resistance, r = -Math.log(i.endSpeed / this.v0) / o;
          this.targetOffset = { x: (n.x - r) / o, y: (n.y - r) / o }, this.te = r, this.lambda_v0 = o / this.v0, this.one_ve_v0 = 1 - i.endSpeed / this.v0;
          var d = this.modification, p = this.modifierArg;
          p.pageCoords = { x: this.startCoords.x + this.targetOffset.x, y: this.startCoords.y + this.targetOffset.y }, d.result = d.setAll(p), d.result.changed && (this.isModified = !0, this.modifiedOffset = { x: this.targetOffset.x + d.result.delta.x, y: this.targetOffset.y + d.result.delta.y }), this.onNextFrame((function() {
            return e.inertiaTick();
          }));
        } }, { key: "startSmoothEnd", value: function() {
          var e = this;
          this.smoothEnd = !0, this.isModified = !0, this.targetOffset = { x: this.modification.result.delta.x, y: this.modification.result.delta.y }, this.onNextFrame((function() {
            return e.smoothEndTick();
          }));
        } }, { key: "onNextFrame", value: function(e) {
          var n = this;
          this.timeout = Ke.request((function() {
            n.active && e();
          }));
        } }, { key: "inertiaTick", value: function() {
          var e, n, i, o, r, d, p, h = this, _ = this.interaction, g = Yt(_).resistance, $ = (_._now() - this.t0) / 1e3;
          if ($ < this.te) {
            var O, L = 1 - (Math.exp(-g * $) - this.lambda_v0) / this.one_ve_v0;
            this.isModified ? (e = 0, n = 0, i = this.targetOffset.x, o = this.targetOffset.y, r = this.modifiedOffset.x, d = this.modifiedOffset.y, O = { x: Ii(p = L, e, i, r), y: Ii(p, n, o, d) }) : O = { x: this.targetOffset.x * L, y: this.targetOffset.y * L };
            var j = { x: O.x - this.currentOffset.x, y: O.y - this.currentOffset.y };
            this.currentOffset.x += j.x, this.currentOffset.y += j.y, _.offsetBy(j), _.move(), this.onNextFrame((function() {
              return h.inertiaTick();
            }));
          } else _.offsetBy({ x: this.modifiedOffset.x - this.currentOffset.x, y: this.modifiedOffset.y - this.currentOffset.y }), this.end();
        } }, { key: "smoothEndTick", value: function() {
          var e = this, n = this.interaction, i = n._now() - this.t0, o = Yt(n).smoothEndDuration;
          if (i < o) {
            var r = { x: Ti(i, 0, this.targetOffset.x, o), y: Ti(i, 0, this.targetOffset.y, o) }, d = { x: r.x - this.currentOffset.x, y: r.y - this.currentOffset.y };
            this.currentOffset.x += d.x, this.currentOffset.y += d.y, n.offsetBy(d), n.move({ skipModifiers: this.modifierCount }), this.onNextFrame((function() {
              return e.smoothEndTick();
            }));
          } else n.offsetBy({ x: this.targetOffset.x - this.currentOffset.x, y: this.targetOffset.y - this.currentOffset.y }), this.end();
        } }, { key: "resume", value: function(e) {
          var n = e.pointer, i = e.event, o = e.eventTarget, r = this.interaction;
          r.offsetBy({ x: -this.currentOffset.x, y: -this.currentOffset.y }), r.updatePointer(n, i, o, !0), r._doPhase({ interaction: r, event: i, phase: "resume" }), Ft(r.coords.prev, r.coords.cur), this.stop();
        } }, { key: "end", value: function() {
          this.interaction.move(), this.interaction.end(), this.stop();
        } }, { key: "stop", value: function() {
          this.active = this.smoothEnd = !1, this.interaction.simulation = null, Ke.cancel(this.timeout);
        } }]), t;
      })();
      function Yt(t) {
        var e = t.interactable, n = t.prepared;
        return e && e.options && n.name && e.options[n.name].inertia;
      }
      var ho = { id: "inertia", before: ["modifiers", "actions"], install: function(t) {
        var e = t.defaults;
        t.usePlugin(Ei), t.usePlugin(xi), t.actions.phases.inertiastart = !0, t.actions.phases.resume = !0, e.perAction.inertia = { enabled: !1, resistance: 10, minSpeed: 100, endSpeed: 10, allowResume: !0, smoothEndDuration: 300 };
      }, listeners: { "interactions:new": function(t) {
        var e = t.interaction;
        e.inertia = new fo(e);
      }, "interactions:before-action-end": function(t) {
        var e = t.interaction, n = t.event;
        return (!e._interacting || e.simulation || !e.inertia.start(n)) && null;
      }, "interactions:down": function(t) {
        var e = t.interaction, n = t.eventTarget, i = e.inertia;
        if (i.active) for (var o = n; E.element(o); ) {
          if (o === e.element) {
            i.resume(t);
            break;
          }
          o = _e(o);
        }
      }, "interactions:stop": function(t) {
        var e = t.interaction.inertia;
        e.active && e.stop();
      }, "interactions:before-action-resume": function(t) {
        var e = t.interaction.modification;
        e.stop(t), e.start(t, t.interaction.coords.cur.page), e.applyToInteraction(t);
      }, "interactions:before-action-inertiastart": function(t) {
        return t.interaction.modification.setAndApply(t);
      }, "interactions:action-resume": St, "interactions:action-inertiastart": St, "interactions:after-action-inertiastart": function(t) {
        return t.interaction.modification.restoreInteractionCoords(t);
      }, "interactions:after-action-resume": function(t) {
        return t.interaction.modification.restoreInteractionCoords(t);
      } } };
      function Ii(t, e, n, i) {
        var o = 1 - t;
        return o * o * e + 2 * o * t * n + t * t * i;
      }
      function Ti(t, e, n, i) {
        return -n * (t /= i) * (t - 2) + e;
      }
      var go = ho;
      function Ci(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          if (t.immediatePropagationStopped) break;
          i(t);
        }
      }
      var Mi = (function() {
        function t(e) {
          v(this, t), this.options = void 0, this.types = {}, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.global = void 0, this.options = Z({}, e || {});
        }
        return k(t, [{ key: "fire", value: function(e) {
          var n, i = this.global;
          (n = this.types[e.type]) && Ci(e, n), !e.propagationStopped && i && (n = i[e.type]) && Ci(e, n);
        } }, { key: "on", value: function(e, n) {
          var i = ot(e, n);
          for (e in i) this.types[e] = oi(this.types[e] || [], i[e]);
        } }, { key: "off", value: function(e, n) {
          var i = ot(e, n);
          for (e in i) {
            var o = this.types[e];
            if (o && o.length) for (var r = 0, d = i[e]; r < d.length; r++) {
              var p = d[r], h = o.indexOf(p);
              h !== -1 && o.splice(h, 1);
            }
          }
        } }, { key: "getRect", value: function(e) {
          return null;
        } }]), t;
      })(), vo = (function() {
        function t(e) {
          v(this, t), this.currentTarget = void 0, this.originalEvent = void 0, this.type = void 0, this.originalEvent = e, zt(this, e);
        }
        return k(t, [{ key: "preventOriginalDefault", value: function() {
          this.originalEvent.preventDefault();
        } }, { key: "stopPropagation", value: function() {
          this.originalEvent.stopPropagation();
        } }, { key: "stopImmediatePropagation", value: function() {
          this.originalEvent.stopImmediatePropagation();
        } }]), t;
      })();
      function Et(t) {
        return E.object(t) ? { capture: !!t.capture, passive: !!t.passive } : { capture: !!t, passive: !1 };
      }
      function Wt(t, e) {
        return t === e || (typeof t == "boolean" ? !!e.capture === t && !e.passive : !!t.capture == !!e.capture && !!t.passive == !!e.passive);
      }
      var mo = { id: "events", install: function(t) {
        var e, n = [], i = {}, o = [], r = { add: d, remove: p, addDelegate: function(g, $, O, L, j) {
          var H = Et(j);
          if (!i[O]) {
            i[O] = [];
            for (var K = 0; K < o.length; K++) {
              var Y = o[K];
              d(Y, O, h), d(Y, O, _, !0);
            }
          }
          var Q = i[O], se = wt(Q, (function(le) {
            return le.selector === g && le.context === $;
          }));
          se || (se = { selector: g, context: $, listeners: [] }, Q.push(se)), se.listeners.push({ func: L, options: H });
        }, removeDelegate: function(g, $, O, L, j) {
          var H, K = Et(j), Y = i[O], Q = !1;
          if (Y)
            for (H = Y.length - 1; H >= 0; H--) {
              var se = Y[H];
              if (se.selector === g && se.context === $) {
                for (var le = se.listeners, te = le.length - 1; te >= 0; te--) {
                  var oe = le[te];
                  if (oe.func === L && Wt(oe.options, K)) {
                    le.splice(te, 1), le.length || (Y.splice(H, 1), p($, O, h), p($, O, _, !0)), Q = !0;
                    break;
                  }
                }
                if (Q) break;
              }
            }
        }, delegateListener: h, delegateUseCapture: _, delegatedEvents: i, documents: o, targets: n, supportsOptions: !1, supportsPassive: !1 };
        function d(g, $, O, L) {
          if (g.addEventListener) {
            var j = Et(L), H = wt(n, (function(K) {
              return K.eventTarget === g;
            }));
            H || (H = { eventTarget: g, events: {} }, n.push(H)), H.events[$] || (H.events[$] = []), wt(H.events[$], (function(K) {
              return K.func === O && Wt(K.options, j);
            })) || (g.addEventListener($, O, r.supportsOptions ? j : j.capture), H.events[$].push({ func: O, options: j }));
          }
        }
        function p(g, $, O, L) {
          if (g.addEventListener && g.removeEventListener) {
            var j = kt(n, (function(Pe) {
              return Pe.eventTarget === g;
            })), H = n[j];
            if (H && H.events) if ($ !== "all") {
              var K = !1, Y = H.events[$];
              if (Y) {
                if (O === "all") {
                  for (var Q = Y.length - 1; Q >= 0; Q--) {
                    var se = Y[Q];
                    p(g, $, se.func, se.options);
                  }
                  return;
                }
                for (var le = Et(L), te = 0; te < Y.length; te++) {
                  var oe = Y[te];
                  if (oe.func === O && Wt(oe.options, le)) {
                    g.removeEventListener($, O, r.supportsOptions ? le : le.capture), Y.splice(te, 1), Y.length === 0 && (delete H.events[$], K = !0);
                    break;
                  }
                }
              }
              K && !Object.keys(H.events).length && n.splice(j, 1);
            } else for ($ in H.events) H.events.hasOwnProperty($) && p(g, $, "all");
          }
        }
        function h(g, $) {
          for (var O = Et($), L = new vo(g), j = i[g.type], H = si(g)[0], K = H; E.element(K); ) {
            for (var Y = 0; Y < j.length; Y++) {
              var Q = j[Y], se = Q.selector, le = Q.context;
              if (Te(K, se) && W(le, H) && W(le, K)) {
                var te = Q.listeners;
                L.currentTarget = K;
                for (var oe = 0; oe < te.length; oe++) {
                  var Pe = te[oe];
                  Wt(Pe.options, O) && Pe.func(L);
                }
              }
            }
            K = _e(K);
          }
        }
        function _(g) {
          return h(g, !0);
        }
        return (e = t.document) == null || e.createElement("div").addEventListener("test", null, { get capture() {
          return r.supportsOptions = !0;
        }, get passive() {
          return r.supportsPassive = !0;
        } }), t.events = r, r;
      } }, $n = { methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"], search: function(t) {
        for (var e = 0, n = $n.methodOrder; e < n.length; e++) {
          var i = n[e], o = $n[i](t);
          if (o) return o;
        }
        return null;
      }, simulationResume: function(t) {
        var e = t.pointerType, n = t.eventType, i = t.eventTarget, o = t.scope;
        if (!/down|start/i.test(n)) return null;
        for (var r = 0, d = o.interactions.list; r < d.length; r++) {
          var p = d[r], h = i;
          if (p.simulation && p.simulation.allowResume && p.pointerType === e) for (; h; ) {
            if (h === p.element) return p;
            h = _e(h);
          }
        }
        return null;
      }, mouseOrPen: function(t) {
        var e, n = t.pointerId, i = t.pointerType, o = t.eventType, r = t.scope;
        if (i !== "mouse" && i !== "pen") return null;
        for (var d = 0, p = r.interactions.list; d < p.length; d++) {
          var h = p[d];
          if (h.pointerType === i) {
            if (h.simulation && !Oi(h, n)) continue;
            if (h.interacting()) return h;
            e || (e = h);
          }
        }
        if (e) return e;
        for (var _ = 0, g = r.interactions.list; _ < g.length; _++) {
          var $ = g[_];
          if (!($.pointerType !== i || /down/i.test(o) && $.simulation)) return $;
        }
        return null;
      }, hasPointer: function(t) {
        for (var e = t.pointerId, n = 0, i = t.scope.interactions.list; n < i.length; n++) {
          var o = i[n];
          if (Oi(o, e)) return o;
        }
        return null;
      }, idle: function(t) {
        for (var e = t.pointerType, n = 0, i = t.scope.interactions.list; n < i.length; n++) {
          var o = i[n];
          if (o.pointers.length === 1) {
            var r = o.interactable;
            if (r && (!r.options.gesture || !r.options.gesture.enabled)) continue;
          } else if (o.pointers.length >= 2) continue;
          if (!o.interacting() && e === o.pointerType) return o;
        }
        return null;
      } };
      function Oi(t, e) {
        return t.pointers.some((function(n) {
          return n.id === e;
        }));
      }
      var yo = $n, Sn = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
      function Pi(t, e) {
        return function(n) {
          var i = e.interactions.list, o = ii(n), r = si(n), d = r[0], p = r[1], h = [];
          if (/^touch/.test(n.type)) {
            e.prevTouchTime = e.now();
            for (var _ = 0, g = n.changedTouches; _ < g.length; _++) {
              var $ = g[_], O = { pointer: $, pointerId: xt($), pointerType: o, eventType: n.type, eventTarget: d, curEventTarget: p, scope: e }, L = Di(O);
              h.push([O.pointer, O.eventTarget, O.curEventTarget, L]);
            }
          } else {
            var j = !1;
            if (!B.supportsPointerEvent && /mouse/.test(n.type)) {
              for (var H = 0; H < i.length && !j; H++) j = i[H].pointerType !== "mouse" && i[H].pointerIsDown;
              j = j || e.now() - e.prevTouchTime < 500 || n.timeStamp === 0;
            }
            if (!j) {
              var K = { pointer: n, pointerId: xt(n), pointerType: o, eventType: n.type, curEventTarget: p, eventTarget: d, scope: e }, Y = Di(K);
              h.push([K.pointer, K.eventTarget, K.curEventTarget, Y]);
            }
          }
          for (var Q = 0; Q < h.length; Q++) {
            var se = h[Q], le = se[0], te = se[1], oe = se[2];
            se[3][t](le, n, te, oe);
          }
        };
      }
      function Di(t) {
        var e = t.pointerType, n = t.scope, i = { interaction: yo.search(t), searchDetails: t };
        return n.fire("interactions:find", i), i.interaction || n.interactions.new({ pointerType: e });
      }
      function En(t, e) {
        var n = t.doc, i = t.scope, o = t.options, r = i.interactions.docEvents, d = i.events, p = d[e];
        for (var h in i.browser.isIOS && !o.events && (o.events = { passive: !1 }), d.delegatedEvents) p(n, h, d.delegateListener), p(n, h, d.delegateUseCapture, !0);
        for (var _ = o && o.events, g = 0; g < r.length; g++) {
          var $ = r[g];
          p(n, $.type, $.listener, _);
        }
      }
      var bo = { id: "core/interactions", install: function(t) {
        for (var e = {}, n = 0; n < Sn.length; n++) {
          var i = Sn[n];
          e[i] = Pi(i, t);
        }
        var o, r = B.pEventTypes;
        function d() {
          for (var p = 0, h = t.interactions.list; p < h.length; p++) {
            var _ = h[p];
            if (_.pointerIsDown && _.pointerType === "touch" && !_._interacting) for (var g = function() {
              var L = O[$];
              t.documents.some((function(j) {
                return W(j.doc, L.downTarget);
              })) || _.removePointer(L.pointer, L.event);
            }, $ = 0, O = _.pointers; $ < O.length; $++) g();
          }
        }
        (o = V.PointerEvent ? [{ type: r.down, listener: d }, { type: r.down, listener: e.pointerDown }, { type: r.move, listener: e.pointerMove }, { type: r.up, listener: e.pointerUp }, { type: r.cancel, listener: e.pointerUp }] : [{ type: "mousedown", listener: e.pointerDown }, { type: "mousemove", listener: e.pointerMove }, { type: "mouseup", listener: e.pointerUp }, { type: "touchstart", listener: d }, { type: "touchstart", listener: e.pointerDown }, { type: "touchmove", listener: e.pointerMove }, { type: "touchend", listener: e.pointerUp }, { type: "touchcancel", listener: e.pointerUp }]).push({ type: "blur", listener: function(p) {
          for (var h = 0, _ = t.interactions.list; h < _.length; h++)
            _[h].documentBlur(p);
        } }), t.prevTouchTime = 0, t.Interaction = (function(p) {
          P(_, p);
          var h = q(_);
          function _() {
            return v(this, _), h.apply(this, arguments);
          }
          return k(_, [{ key: "pointerMoveTolerance", get: function() {
            return t.interactions.pointerMoveTolerance;
          }, set: function(g) {
            t.interactions.pointerMoveTolerance = g;
          } }, { key: "_now", value: function() {
            return t.now();
          } }]), _;
        })(co), t.interactions = { list: [], new: function(p) {
          p.scopeFire = function(_, g) {
            return t.fire(_, g);
          };
          var h = new t.Interaction(p);
          return t.interactions.list.push(h), h;
        }, listeners: e, docEvents: o, pointerMoveTolerance: 1 }, t.usePlugin(_i);
      }, listeners: { "scope:add-document": function(t) {
        return En(t, "add");
      }, "scope:remove-document": function(t) {
        return En(t, "remove");
      }, "interactable:unset": function(t, e) {
        for (var n = t.interactable, i = e.interactions.list.length - 1; i >= 0; i--) {
          var o = e.interactions.list[i];
          o.interactable === n && (o.stop(), e.fire("interactions:destroy", { interaction: o }), o.destroy(), e.interactions.list.length > 2 && e.interactions.list.splice(i, 1));
        }
      } }, onDocSignal: En, doOnInteractions: Pi, methodNames: Sn }, _o = bo, Qe = (function(t) {
        return t[t.On = 0] = "On", t[t.Off = 1] = "Off", t;
      })(Qe || {}), xo = (function() {
        function t(e, n, i, o) {
          v(this, t), this.target = void 0, this.options = void 0, this._actions = void 0, this.events = new Mi(), this._context = void 0, this._win = void 0, this._doc = void 0, this._scopeEvents = void 0, this._actions = n.actions, this.target = e, this._context = n.context || i, this._win = R(Kn(e) ? this._context : e), this._doc = this._win.document, this._scopeEvents = o, this.set(n);
        }
        return k(t, [{ key: "_defaults", get: function() {
          return { base: {}, perAction: {}, actions: {} };
        } }, { key: "setOnEvents", value: function(e, n) {
          return E.func(n.onstart) && this.on("".concat(e, "start"), n.onstart), E.func(n.onmove) && this.on("".concat(e, "move"), n.onmove), E.func(n.onend) && this.on("".concat(e, "end"), n.onend), E.func(n.oninertiastart) && this.on("".concat(e, "inertiastart"), n.oninertiastart), this;
        } }, { key: "updatePerActionListeners", value: function(e, n, i) {
          var o, r = this, d = (o = this._actions.map[e]) == null ? void 0 : o.filterEventType, p = function(h) {
            return (d == null || d(h)) && Gt(h, r._actions);
          };
          (E.array(n) || E.object(n)) && this._onOff(Qe.Off, e, n, void 0, p), (E.array(i) || E.object(i)) && this._onOff(Qe.On, e, i, void 0, p);
        } }, { key: "setPerAction", value: function(e, n) {
          var i = this._defaults;
          for (var o in n) {
            var r = o, d = this.options[e], p = n[r];
            r === "listeners" && this.updatePerActionListeners(e, d.listeners, p), E.array(p) ? d[r] = ri(p) : E.plainObject(p) ? (d[r] = Z(d[r] || {}, ft(p)), E.object(i.perAction[r]) && "enabled" in i.perAction[r] && (d[r].enabled = p.enabled !== !1)) : E.bool(p) && E.object(i.perAction[r]) ? d[r].enabled = p : d[r] = p;
          }
        } }, { key: "getRect", value: function(e) {
          return e = e || (E.element(this.target) ? this.target : null), E.string(this.target) && (e = e || this._context.querySelector(this.target)), mt(e);
        } }, { key: "rectChecker", value: function(e) {
          var n = this;
          return E.func(e) ? (this.getRect = function(i) {
            var o = Z({}, e.call(n, i));
            return "width" in o || (o.width = o.right - o.left, o.height = o.bottom - o.top), o;
          }, this) : e === null ? (delete this.getRect, this) : this.getRect;
        } }, { key: "_backCompatOption", value: function(e, n) {
          if (Kn(n) || E.object(n)) {
            for (var i in this.options[e] = n, this._actions.map) this.options[i][e] = n;
            return this;
          }
          return this.options[e];
        } }, { key: "origin", value: function(e) {
          return this._backCompatOption("origin", e);
        } }, { key: "deltaSource", value: function(e) {
          return e === "page" || e === "client" ? (this.options.deltaSource = e, this) : this.options.deltaSource;
        } }, { key: "getAllElements", value: function() {
          var e = this.target;
          return E.string(e) ? Array.from(this._context.querySelectorAll(e)) : E.func(e) && e.getAllElements ? e.getAllElements() : E.element(e) ? [e] : [];
        } }, { key: "context", value: function() {
          return this._context;
        } }, { key: "inContext", value: function(e) {
          return this._context === e.ownerDocument || W(this._context, e);
        } }, { key: "testIgnoreAllow", value: function(e, n, i) {
          return !this.testIgnore(e.ignoreFrom, n, i) && this.testAllow(e.allowFrom, n, i);
        } }, { key: "testAllow", value: function(e, n, i) {
          return !e || !!E.element(i) && (E.string(e) ? Be(i, e, n) : !!E.element(e) && W(e, i));
        } }, { key: "testIgnore", value: function(e, n, i) {
          return !(!e || !E.element(i)) && (E.string(e) ? Be(i, e, n) : !!E.element(e) && W(e, i));
        } }, { key: "fire", value: function(e) {
          return this.events.fire(e), this;
        } }, { key: "_onOff", value: function(e, n, i, o, r) {
          E.object(n) && !E.array(n) && (o = i, i = null);
          var d = ot(n, i, r);
          for (var p in d) {
            p === "wheel" && (p = B.wheelEvent);
            for (var h = 0, _ = d[p]; h < _.length; h++) {
              var g = _[h];
              Gt(p, this._actions) ? this.events[e === Qe.On ? "on" : "off"](p, g) : E.string(this.target) ? this._scopeEvents[e === Qe.On ? "addDelegate" : "removeDelegate"](this.target, this._context, p, g, o) : this._scopeEvents[e === Qe.On ? "add" : "remove"](this.target, p, g, o);
            }
          }
          return this;
        } }, { key: "on", value: function(e, n, i) {
          return this._onOff(Qe.On, e, n, i);
        } }, { key: "off", value: function(e, n, i) {
          return this._onOff(Qe.Off, e, n, i);
        } }, { key: "set", value: function(e) {
          var n = this._defaults;
          for (var i in E.object(e) || (e = {}), this.options = ft(n.base), this._actions.methodDict) {
            var o = i, r = this._actions.methodDict[o];
            this.options[o] = {}, this.setPerAction(o, Z(Z({}, n.perAction), n.actions[o])), this[r](e[o]);
          }
          for (var d in e) d !== "getRect" ? E.func(this[d]) && this[d](e[d]) : this.rectChecker(e.getRect);
          return this;
        } }, { key: "unset", value: function() {
          if (E.string(this.target)) for (var e in this._scopeEvents.delegatedEvents) for (var n = this._scopeEvents.delegatedEvents[e], i = n.length - 1; i >= 0; i--) {
            var o = n[i], r = o.selector, d = o.context, p = o.listeners;
            r === this.target && d === this._context && n.splice(i, 1);
            for (var h = p.length - 1; h >= 0; h--) this._scopeEvents.removeDelegate(this.target, this._context, e, p[h][0], p[h][1]);
          }
          else this._scopeEvents.remove(this.target, "all");
        } }]), t;
      })(), ko = (function() {
        function t(e) {
          var n = this;
          v(this, t), this.list = [], this.selectorMap = {}, this.scope = void 0, this.scope = e, e.addListeners({ "interactable:unset": function(i) {
            var o = i.interactable, r = o.target, d = E.string(r) ? n.selectorMap[r] : r[n.scope.id], p = kt(d, (function(h) {
              return h === o;
            }));
            d.splice(p, 1);
          } });
        }
        return k(t, [{ key: "new", value: function(e, n) {
          n = Z(n || {}, { actions: this.scope.actions });
          var i = new this.scope.Interactable(e, n, this.scope.document, this.scope.events);
          return this.scope.addDocument(i._doc), this.list.push(i), E.string(e) ? (this.selectorMap[e] || (this.selectorMap[e] = []), this.selectorMap[e].push(i)) : (i.target[this.scope.id] || Object.defineProperty(e, this.scope.id, { value: [], configurable: !0 }), e[this.scope.id].push(i)), this.scope.fire("interactable:new", { target: e, options: n, interactable: i, win: this.scope._win }), i;
        } }, { key: "getExisting", value: function(e, n) {
          var i = n && n.context || this.scope.document, o = E.string(e), r = o ? this.selectorMap[e] : e[this.scope.id];
          if (r) return wt(r, (function(d) {
            return d._context === i && (o || d.inContext(e));
          }));
        } }, { key: "forEachMatch", value: function(e, n) {
          for (var i = 0, o = this.list; i < o.length; i++) {
            var r = o[i], d = void 0;
            if ((E.string(r.target) ? E.element(e) && Te(e, r.target) : e === r.target) && r.inContext(e) && (d = n(r)), d !== void 0) return d;
          }
        } }]), t;
      })(), wo = (function() {
        function t() {
          var e = this;
          v(this, t), this.id = "__interact_scope_".concat(Math.floor(100 * Math.random())), this.isInitialized = !1, this.listenerMaps = [], this.browser = B, this.defaults = ft(ki), this.Eventable = Mi, this.actions = { map: {}, phases: { start: !0, move: !0, end: !0 }, methodDict: {}, phaselessTypes: {} }, this.interactStatic = (function(i) {
            var o = function r(d, p) {
              var h = i.interactables.getExisting(d, p);
              return h || ((h = i.interactables.new(d, p)).events.global = r.globalEvents), h;
            };
            return o.getPointerAverage = ni, o.getTouchBBox = cn, o.getTouchDistance = dn, o.getTouchAngle = un, o.getElementRect = mt, o.getElementClientRect = vt, o.matchesSelector = Te, o.closest = ke, o.globalEvents = {}, o.version = "1.10.28", o.scope = i, o.use = function(r, d) {
              return this.scope.usePlugin(r, d), this;
            }, o.isSet = function(r, d) {
              return !!this.scope.interactables.get(r, d && d.context);
            }, o.on = $t((function(r, d, p) {
              if (E.string(r) && r.search(" ") !== -1 && (r = r.trim().split(/ +/)), E.array(r)) {
                for (var h = 0, _ = r; h < _.length; h++) {
                  var g = _[h];
                  this.on(g, d, p);
                }
                return this;
              }
              if (E.object(r)) {
                for (var $ in r) this.on($, r[$], d);
                return this;
              }
              return Gt(r, this.scope.actions) ? this.globalEvents[r] ? this.globalEvents[r].push(d) : this.globalEvents[r] = [d] : this.scope.events.add(this.scope.document, r, d, { options: p }), this;
            }), "The interact.on() method is being deprecated"), o.off = $t((function(r, d, p) {
              if (E.string(r) && r.search(" ") !== -1 && (r = r.trim().split(/ +/)), E.array(r)) {
                for (var h = 0, _ = r; h < _.length; h++) {
                  var g = _[h];
                  this.off(g, d, p);
                }
                return this;
              }
              if (E.object(r)) {
                for (var $ in r) this.off($, r[$], d);
                return this;
              }
              var O;
              return Gt(r, this.scope.actions) ? r in this.globalEvents && (O = this.globalEvents[r].indexOf(d)) !== -1 && this.globalEvents[r].splice(O, 1) : this.scope.events.remove(this.scope.document, r, d, p), this;
            }), "The interact.off() method is being deprecated"), o.debug = function() {
              return this.scope;
            }, o.supportsTouch = function() {
              return B.supportsTouch;
            }, o.supportsPointerEvent = function() {
              return B.supportsPointerEvent;
            }, o.stop = function() {
              for (var r = 0, d = this.scope.interactions.list; r < d.length; r++) d[r].stop();
              return this;
            }, o.pointerMoveTolerance = function(r) {
              return E.number(r) ? (this.scope.interactions.pointerMoveTolerance = r, this) : this.scope.interactions.pointerMoveTolerance;
            }, o.addDocument = function(r, d) {
              this.scope.addDocument(r, d);
            }, o.removeDocument = function(r) {
              this.scope.removeDocument(r);
            }, o;
          })(this), this.InteractEvent = kn, this.Interactable = void 0, this.interactables = new ko(this), this._win = void 0, this.document = void 0, this.window = void 0, this.documents = [], this._plugins = { list: [], map: {} }, this.onWindowUnload = function(i) {
            return e.removeDocument(i.target);
          };
          var n = this;
          this.Interactable = (function(i) {
            P(r, i);
            var o = q(r);
            function r() {
              return v(this, r), o.apply(this, arguments);
            }
            return k(r, [{ key: "_defaults", get: function() {
              return n.defaults;
            } }, { key: "set", value: function(d) {
              return I(T(r.prototype), "set", this).call(this, d), n.fire("interactable:set", { options: d, interactable: this }), this;
            } }, { key: "unset", value: function() {
              I(T(r.prototype), "unset", this).call(this);
              var d = n.interactables.list.indexOf(this);
              d < 0 || (n.interactables.list.splice(d, 1), n.fire("interactable:unset", { interactable: this }));
            } }]), r;
          })(xo);
        }
        return k(t, [{ key: "addListeners", value: function(e, n) {
          this.listenerMaps.push({ id: n, map: e });
        } }, { key: "fire", value: function(e, n) {
          for (var i = 0, o = this.listenerMaps; i < o.length; i++) {
            var r = o[i].map[e];
            if (r && r(n, this, e) === !1) return !1;
          }
        } }, { key: "init", value: function(e) {
          return this.isInitialized ? this : (function(n, i) {
            return n.isInitialized = !0, E.window(i) && F(i), V.init(i), B.init(i), Ke.init(i), n.window = i, n.document = i.document, n.usePlugin(_o), n.usePlugin(mo), n;
          })(this, e);
        } }, { key: "pluginIsInstalled", value: function(e) {
          var n = e.id;
          return n ? !!this._plugins.map[n] : this._plugins.list.indexOf(e) !== -1;
        } }, { key: "usePlugin", value: function(e, n) {
          if (!this.isInitialized) return this;
          if (this.pluginIsInstalled(e)) return this;
          if (e.id && (this._plugins.map[e.id] = e), this._plugins.list.push(e), e.install && e.install(this, n), e.listeners && e.before) {
            for (var i = 0, o = this.listenerMaps.length, r = e.before.reduce((function(p, h) {
              return p[h] = !0, p[Ai(h)] = !0, p;
            }), {}); i < o; i++) {
              var d = this.listenerMaps[i].id;
              if (d && (r[d] || r[Ai(d)])) break;
            }
            this.listenerMaps.splice(i, 0, { id: e.id, map: e.listeners });
          } else e.listeners && this.listenerMaps.push({ id: e.id, map: e.listeners });
          return this;
        } }, { key: "addDocument", value: function(e, n) {
          if (this.getDocIndex(e) !== -1) return !1;
          var i = R(e);
          n = n ? Z({}, n) : {}, this.documents.push({ doc: e, options: n }), this.events.documents.push(e), e !== this.document && this.events.add(i, "unload", this.onWindowUnload), this.fire("scope:add-document", { doc: e, window: i, scope: this, options: n });
        } }, { key: "removeDocument", value: function(e) {
          var n = this.getDocIndex(e), i = R(e), o = this.documents[n].options;
          this.events.remove(i, "unload", this.onWindowUnload), this.documents.splice(n, 1), this.events.documents.splice(n, 1), this.fire("scope:remove-document", { doc: e, window: i, scope: this, options: o });
        } }, { key: "getDocIndex", value: function(e) {
          for (var n = 0; n < this.documents.length; n++) if (this.documents[n].doc === e) return n;
          return -1;
        } }, { key: "getDocOptions", value: function(e) {
          var n = this.getDocIndex(e);
          return n === -1 ? null : this.documents[n].options;
        } }, { key: "now", value: function() {
          return (this.window.Date || Date).now();
        } }]), t;
      })();
      function Ai(t) {
        return t && t.replace(/\/.*$/, "");
      }
      var Ri = new wo(), Oe = Ri.interactStatic, $o = typeof globalThis < "u" ? globalThis : window;
      Ri.init($o);
      var So = Object.freeze({ __proto__: null, edgeTarget: function() {
      }, elements: function() {
      }, grid: function(t) {
        var e = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter((function(i) {
          var o = i[0], r = i[1];
          return o in t || r in t;
        })), n = function(i, o) {
          for (var r = t.range, d = t.limits, p = d === void 0 ? { left: -1 / 0, right: 1 / 0, top: -1 / 0, bottom: 1 / 0 } : d, h = t.offset, _ = h === void 0 ? { x: 0, y: 0 } : h, g = { range: r, grid: t, x: null, y: null }, $ = 0; $ < e.length; $++) {
            var O = e[$], L = O[0], j = O[1], H = Math.round((i - _.x) / t[L]), K = Math.round((o - _.y) / t[j]);
            g[L] = Math.max(p.left, Math.min(p.right, H * t[L] + _.x)), g[j] = Math.max(p.top, Math.min(p.bottom, K * t[j] + _.y));
          }
          return g;
        };
        return n.grid = t, n.coordFields = e, n;
      } }), Eo = { id: "snappers", install: function(t) {
        var e = t.interactStatic;
        e.snappers = Z(e.snappers || {}, So), e.createSnapGrid = e.snappers.grid;
      } }, Io = Eo, To = { start: function(t) {
        var e = t.state, n = t.rect, i = t.edges, o = t.pageCoords, r = e.options, d = r.ratio, p = r.enabled, h = e.options, _ = h.equalDelta, g = h.modifiers;
        d === "preserve" && (d = n.width / n.height), e.startCoords = Z({}, o), e.startRect = Z({}, n), e.ratio = d, e.equalDelta = _;
        var $ = e.linkedEdges = { top: i.top || i.left && !i.bottom, left: i.left || i.top && !i.right, bottom: i.bottom || i.right && !i.top, right: i.right || i.bottom && !i.left };
        if (e.xIsPrimaryAxis = !(!i.left && !i.right), e.equalDelta) {
          var O = ($.left ? 1 : -1) * ($.top ? 1 : -1);
          e.edgeSign = { x: O, y: O };
        } else e.edgeSign = { x: $.left ? -1 : 1, y: $.top ? -1 : 1 };
        if (p !== !1 && Z(i, $), g != null && g.length) {
          var L = new xn(t.interaction);
          L.copyFrom(t.interaction.modification), L.prepareStates(g), e.subModification = L, L.startAll(u({}, t));
        }
      }, set: function(t) {
        var e = t.state, n = t.rect, i = t.coords, o = e.linkedEdges, r = Z({}, i), d = e.equalDelta ? Co : Mo;
        if (Z(t.edges, o), d(e, e.xIsPrimaryAxis, i, n), !e.subModification) return null;
        var p = Z({}, n);
        Ht(o, p, { x: i.x - r.x, y: i.y - r.y });
        var h = e.subModification.setAll(u(u({}, t), {}, { rect: p, edges: o, pageCoords: i, prevCoords: i, prevRect: p })), _ = h.delta;
        return h.changed && (d(e, Math.abs(_.x) > Math.abs(_.y), h.coords, h.rect), Z(i, h.coords)), h.eventProps;
      }, defaults: { ratio: "preserve", equalDelta: !1, modifiers: [], enabled: !1 } };
      function Co(t, e, n) {
        var i = t.startCoords, o = t.edgeSign;
        e ? n.y = i.y + (n.x - i.x) * o.y : n.x = i.x + (n.y - i.y) * o.x;
      }
      function Mo(t, e, n, i) {
        var o = t.startRect, r = t.startCoords, d = t.ratio, p = t.edgeSign;
        if (e) {
          var h = i.width / d;
          n.y = r.y + (h - o.height) * p.y;
        } else {
          var _ = i.height * d;
          n.x = r.x + (_ - o.width) * p.x;
        }
      }
      var Oo = Je(To, "aspectRatio"), qi = function() {
      };
      qi._defaults = {};
      var Xt = qi;
      function at(t, e, n) {
        return E.func(t) ? yt(t, e.interactable, e.element, [n.x, n.y, e]) : yt(t, e.interactable, e.element);
      }
      var Kt = { start: function(t) {
        var e = t.rect, n = t.startOffset, i = t.state, o = t.interaction, r = t.pageCoords, d = i.options, p = d.elementRect, h = Z({ left: 0, top: 0, right: 0, bottom: 0 }, d.offset || {});
        if (e && p) {
          var _ = at(d.restriction, o, r);
          if (_) {
            var g = _.right - _.left - e.width, $ = _.bottom - _.top - e.height;
            g < 0 && (h.left += g, h.right += g), $ < 0 && (h.top += $, h.bottom += $);
          }
          h.left += n.left - e.width * p.left, h.top += n.top - e.height * p.top, h.right += n.right - e.width * (1 - p.right), h.bottom += n.bottom - e.height * (1 - p.bottom);
        }
        i.offset = h;
      }, set: function(t) {
        var e = t.coords, n = t.interaction, i = t.state, o = i.options, r = i.offset, d = at(o.restriction, n, e);
        if (d) {
          var p = (function(h) {
            return !h || "left" in h && "top" in h || ((h = Z({}, h)).left = h.x || 0, h.top = h.y || 0, h.right = h.right || h.left + h.width, h.bottom = h.bottom || h.top + h.height), h;
          })(d);
          e.x = Math.max(Math.min(p.right - r.right, e.x), p.left + r.left), e.y = Math.max(Math.min(p.bottom - r.bottom, e.y), p.top + r.top);
        }
      }, defaults: { restriction: null, elementRect: null, offset: null, endOnly: !1, enabled: !1 } }, Po = Je(Kt, "restrict"), ji = { top: 1 / 0, left: 1 / 0, bottom: -1 / 0, right: -1 / 0 }, Li = { top: -1 / 0, left: -1 / 0, bottom: 1 / 0, right: 1 / 0 };
      function Hi(t, e) {
        for (var n = 0, i = ["top", "left", "bottom", "right"]; n < i.length; n++) {
          var o = i[n];
          o in t || (t[o] = e[o]);
        }
        return t;
      }
      var It = { noInner: ji, noOuter: Li, start: function(t) {
        var e, n = t.interaction, i = t.startOffset, o = t.state, r = o.options;
        r && (e = Lt(at(r.offset, n, n.coords.start.page))), e = e || { x: 0, y: 0 }, o.offset = { top: e.y + i.top, left: e.x + i.left, bottom: e.y - i.bottom, right: e.x - i.right };
      }, set: function(t) {
        var e = t.coords, n = t.edges, i = t.interaction, o = t.state, r = o.offset, d = o.options;
        if (n) {
          var p = Z({}, e), h = at(d.inner, i, p) || {}, _ = at(d.outer, i, p) || {};
          Hi(h, ji), Hi(_, Li), n.top ? e.y = Math.min(Math.max(_.top + r.top, p.y), h.top + r.top) : n.bottom && (e.y = Math.max(Math.min(_.bottom + r.bottom, p.y), h.bottom + r.bottom)), n.left ? e.x = Math.min(Math.max(_.left + r.left, p.x), h.left + r.left) : n.right && (e.x = Math.max(Math.min(_.right + r.right, p.x), h.right + r.right));
        }
      }, defaults: { inner: null, outer: null, offset: null, endOnly: !1, enabled: !1 } }, Do = Je(It, "restrictEdges"), Ao = Z({ get elementRect() {
        return { top: 0, left: 0, bottom: 1, right: 1 };
      }, set elementRect(t) {
      } }, Kt.defaults), Ro = Je({ start: Kt.start, set: Kt.set, defaults: Ao }, "restrictRect"), qo = { width: -1 / 0, height: -1 / 0 }, jo = { width: 1 / 0, height: 1 / 0 }, Lo = Je({ start: function(t) {
        return It.start(t);
      }, set: function(t) {
        var e = t.interaction, n = t.state, i = t.rect, o = t.edges, r = n.options;
        if (o) {
          var d = an(at(r.min, e, t.coords)) || qo, p = an(at(r.max, e, t.coords)) || jo;
          n.options = { endOnly: r.endOnly, inner: Z({}, It.noInner), outer: Z({}, It.noOuter) }, o.top ? (n.options.inner.top = i.bottom - d.height, n.options.outer.top = i.bottom - p.height) : o.bottom && (n.options.inner.bottom = i.top + d.height, n.options.outer.bottom = i.top + p.height), o.left ? (n.options.inner.left = i.right - d.width, n.options.outer.left = i.right - p.width) : o.right && (n.options.inner.right = i.left + d.width, n.options.outer.right = i.left + p.width), It.set(t), n.options = r;
        }
      }, defaults: { min: null, max: null, endOnly: !1, enabled: !1 } }, "restrictSize"), In = { start: function(t) {
        var e, n = t.interaction, i = t.interactable, o = t.element, r = t.rect, d = t.state, p = t.startOffset, h = d.options, _ = h.offsetWithOrigin ? (function(O) {
          var L = O.interaction.element, j = Lt(yt(O.state.options.origin, null, null, [L])), H = j || bt(O.interactable, L, O.interaction.prepared.name);
          return H;
        })(t) : { x: 0, y: 0 };
        if (h.offset === "startCoords") e = { x: n.coords.start.page.x, y: n.coords.start.page.y };
        else {
          var g = yt(h.offset, i, o, [n]);
          (e = Lt(g) || { x: 0, y: 0 }).x += _.x, e.y += _.y;
        }
        var $ = h.relativePoints;
        d.offsets = r && $ && $.length ? $.map((function(O, L) {
          return { index: L, relativePoint: O, x: p.left - r.width * O.x + e.x, y: p.top - r.height * O.y + e.y };
        })) : [{ index: 0, relativePoint: null, x: e.x, y: e.y }];
      }, set: function(t) {
        var e = t.interaction, n = t.coords, i = t.state, o = i.options, r = i.offsets, d = bt(e.interactable, e.element, e.prepared.name), p = Z({}, n), h = [];
        o.offsetWithOrigin || (p.x -= d.x, p.y -= d.y);
        for (var _ = 0, g = r; _ < g.length; _++) for (var $ = g[_], O = p.x - $.x, L = p.y - $.y, j = 0, H = o.targets.length; j < H; j++) {
          var K = o.targets[j], Y = void 0;
          (Y = E.func(K) ? K(O, L, e._proxy, $, j) : K) && h.push({ x: (E.number(Y.x) ? Y.x : O) + $.x, y: (E.number(Y.y) ? Y.y : L) + $.y, range: E.number(Y.range) ? Y.range : o.range, source: K, index: j, offset: $ });
        }
        for (var Q = { target: null, inRange: !1, distance: 0, range: 0, delta: { x: 0, y: 0 } }, se = 0; se < h.length; se++) {
          var le = h[se], te = le.range, oe = le.x - p.x, Pe = le.y - p.y, me = _t(oe, Pe), Re = me <= te;
          te === 1 / 0 && Q.inRange && Q.range !== 1 / 0 && (Re = !1), Q.target && !(Re ? Q.inRange && te !== 1 / 0 ? me / te < Q.distance / Q.range : te === 1 / 0 && Q.range !== 1 / 0 || me < Q.distance : !Q.inRange && me < Q.distance) || (Q.target = le, Q.distance = me, Q.range = te, Q.inRange = Re, Q.delta.x = oe, Q.delta.y = Pe);
        }
        return Q.inRange && (n.x = Q.target.x, n.y = Q.target.y), i.closest = Q, Q;
      }, defaults: { range: 1 / 0, targets: null, offset: null, offsetWithOrigin: !0, origin: null, relativePoints: null, endOnly: !1, enabled: !1 } }, Ho = Je(In, "snap"), Jt = { start: function(t) {
        var e = t.state, n = t.edges, i = e.options;
        if (!n) return null;
        t.state = { options: { targets: null, relativePoints: [{ x: n.left ? 0 : 1, y: n.top ? 0 : 1 }], offset: i.offset || "self", origin: { x: 0, y: 0 }, range: i.range } }, e.targetFields = e.targetFields || [["width", "height"], ["x", "y"]], In.start(t), e.offsets = t.state.offsets, t.state = e;
      }, set: function(t) {
        var e = t.interaction, n = t.state, i = t.coords, o = n.options, r = n.offsets, d = { x: i.x - r[0].x, y: i.y - r[0].y };
        n.options = Z({}, o), n.options.targets = [];
        for (var p = 0, h = o.targets || []; p < h.length; p++) {
          var _ = h[p], g = void 0;
          if (g = E.func(_) ? _(d.x, d.y, e) : _) {
            for (var $ = 0, O = n.targetFields; $ < O.length; $++) {
              var L = O[$], j = L[0], H = L[1];
              if (j in g || H in g) {
                g.x = g[j], g.y = g[H];
                break;
              }
            }
            n.options.targets.push(g);
          }
        }
        var K = In.set(t);
        return n.options = o, K;
      }, defaults: { range: 1 / 0, targets: null, offset: null, endOnly: !1, enabled: !1 } }, zo = Je(Jt, "snapSize"), Tn = { aspectRatio: Oo, restrictEdges: Do, restrict: Po, restrictRect: Ro, restrictSize: Lo, snapEdges: Je({ start: function(t) {
        var e = t.edges;
        return e ? (t.state.targetFields = t.state.targetFields || [[e.left ? "left" : "right", e.top ? "top" : "bottom"]], Jt.start(t)) : null;
      }, set: Jt.set, defaults: Z(ft(Jt.defaults), { targets: void 0, range: void 0, offset: { x: 0, y: 0 } }) }, "snapEdges"), snap: Ho, snapSize: zo, spring: Xt, avoid: Xt, transform: Xt, rubberband: Xt }, Fo = { id: "modifiers", install: function(t) {
        var e = t.interactStatic;
        for (var n in t.usePlugin(xi), t.usePlugin(Io), e.modifiers = Tn, Tn) {
          var i = Tn[n], o = i._defaults, r = i._methods;
          o._methods = r, t.defaults.perAction[n] = o;
        }
      } }, No = Fo, zi = (function(t) {
        P(n, t);
        var e = q(n);
        function n(i, o, r, d, p, h) {
          var _;
          if (v(this, n), zt(G(_ = e.call(this, p)), r), r !== o && zt(G(_), o), _.timeStamp = h, _.originalEvent = r, _.type = i, _.pointerId = xt(o), _.pointerType = ii(o), _.target = d, _.currentTarget = null, i === "tap") {
            var g = p.getPointerIndex(o);
            _.dt = _.timeStamp - p.pointers[g].downTime;
            var $ = _.timeStamp - p.tapTime;
            _.double = !!p.prevTap && p.prevTap.type !== "doubletap" && p.prevTap.target === _.target && $ < 500;
          } else i === "doubletap" && (_.dt = o.timeStamp - p.tapTime, _.double = !0);
          return _;
        }
        return k(n, [{ key: "_subtractOrigin", value: function(i) {
          var o = i.x, r = i.y;
          return this.pageX -= o, this.pageY -= r, this.clientX -= o, this.clientY -= r, this;
        } }, { key: "_addOrigin", value: function(i) {
          var o = i.x, r = i.y;
          return this.pageX += o, this.pageY += r, this.clientX += o, this.clientY += r, this;
        } }, { key: "preventDefault", value: function() {
          this.originalEvent.preventDefault();
        } }]), n;
      })(Bt), Tt = { id: "pointer-events/base", before: ["inertia", "modifiers", "auto-start", "actions"], install: function(t) {
        t.pointerEvents = Tt, t.defaults.actions.pointerEvents = Tt.defaults, Z(t.actions.phaselessTypes, Tt.types);
      }, listeners: { "interactions:new": function(t) {
        var e = t.interaction;
        e.prevTap = null, e.tapTime = 0;
      }, "interactions:update-pointer": function(t) {
        var e = t.down, n = t.pointerInfo;
        !e && n.hold || (n.hold = { duration: 1 / 0, timeout: null });
      }, "interactions:move": function(t, e) {
        var n = t.interaction, i = t.pointer, o = t.event, r = t.eventTarget;
        t.duplicate || n.pointerIsDown && !n.pointerWasMoved || (n.pointerIsDown && Cn(t), Ze({ interaction: n, pointer: i, event: o, eventTarget: r, type: "move" }, e));
      }, "interactions:down": function(t, e) {
        (function(n, i) {
          for (var o = n.interaction, r = n.pointer, d = n.event, p = n.eventTarget, h = n.pointerIndex, _ = o.pointers[h].hold, g = Xn(p), $ = { interaction: o, pointer: r, event: d, eventTarget: p, type: "hold", targets: [], path: g, node: null }, O = 0; O < g.length; O++) {
            var L = g[O];
            $.node = L, i.fire("pointerEvents:collect-targets", $);
          }
          if ($.targets.length) {
            for (var j = 1 / 0, H = 0, K = $.targets; H < K.length; H++) {
              var Y = K[H].eventable.options.holdDuration;
              Y < j && (j = Y);
            }
            _.duration = j, _.timeout = setTimeout((function() {
              Ze({ interaction: o, eventTarget: p, pointer: r, event: d, type: "hold" }, i);
            }), j);
          }
        })(t, e), Ze(t, e);
      }, "interactions:up": function(t, e) {
        Cn(t), Ze(t, e), (function(n, i) {
          var o = n.interaction, r = n.pointer, d = n.event, p = n.eventTarget;
          o.pointerWasMoved || Ze({ interaction: o, eventTarget: p, pointer: r, event: d, type: "tap" }, i);
        })(t, e);
      }, "interactions:cancel": function(t, e) {
        Cn(t), Ze(t, e);
      } }, PointerEvent: zi, fire: Ze, collectEventTargets: Fi, defaults: { holdDuration: 600, ignoreFrom: null, allowFrom: null, origin: { x: 0, y: 0 } }, types: { down: !0, move: !0, up: !0, cancel: !0, tap: !0, doubletap: !0, hold: !0 } };
      function Ze(t, e) {
        var n = t.interaction, i = t.pointer, o = t.event, r = t.eventTarget, d = t.type, p = t.targets, h = p === void 0 ? Fi(t, e) : p, _ = new zi(d, i, o, r, n, e.now());
        e.fire("pointerEvents:new", { pointerEvent: _ });
        for (var g = { interaction: n, pointer: i, event: o, eventTarget: r, targets: h, type: d, pointerEvent: _ }, $ = 0; $ < h.length; $++) {
          var O = h[$];
          for (var L in O.props || {}) _[L] = O.props[L];
          var j = bt(O.eventable, O.node);
          if (_._subtractOrigin(j), _.eventable = O.eventable, _.currentTarget = O.node, O.eventable.fire(_), _._addOrigin(j), _.immediatePropagationStopped || _.propagationStopped && $ + 1 < h.length && h[$ + 1].node !== _.currentTarget) break;
        }
        if (e.fire("pointerEvents:fired", g), d === "tap") {
          var H = _.double ? Ze({ interaction: n, pointer: i, event: o, eventTarget: r, type: "doubletap" }, e) : _;
          n.prevTap = H, n.tapTime = H.timeStamp;
        }
        return _;
      }
      function Fi(t, e) {
        var n = t.interaction, i = t.pointer, o = t.event, r = t.eventTarget, d = t.type, p = n.getPointerIndex(i), h = n.pointers[p];
        if (d === "tap" && (n.pointerWasMoved || !h || h.downTarget !== r)) return [];
        for (var _ = Xn(r), g = { interaction: n, pointer: i, event: o, eventTarget: r, type: d, path: _, targets: [], node: null }, $ = 0; $ < _.length; $++) {
          var O = _[$];
          g.node = O, e.fire("pointerEvents:collect-targets", g);
        }
        return d === "hold" && (g.targets = g.targets.filter((function(L) {
          var j, H;
          return L.eventable.options.holdDuration === ((j = n.pointers[p]) == null || (H = j.hold) == null ? void 0 : H.duration);
        }))), g.targets;
      }
      function Cn(t) {
        var e = t.interaction, n = t.pointerIndex, i = e.pointers[n].hold;
        i && i.timeout && (clearTimeout(i.timeout), i.timeout = null);
      }
      var Bo = Object.freeze({ __proto__: null, default: Tt });
      function Uo(t) {
        var e = t.interaction;
        e.holdIntervalHandle && (clearInterval(e.holdIntervalHandle), e.holdIntervalHandle = null);
      }
      var Go = { id: "pointer-events/holdRepeat", install: function(t) {
        t.usePlugin(Tt);
        var e = t.pointerEvents;
        e.defaults.holdRepeatInterval = 0, e.types.holdrepeat = t.actions.phaselessTypes.holdrepeat = !0;
      }, listeners: ["move", "up", "cancel", "endall"].reduce((function(t, e) {
        return t["pointerEvents:".concat(e)] = Uo, t;
      }), { "pointerEvents:new": function(t) {
        var e = t.pointerEvent;
        e.type === "hold" && (e.count = (e.count || 0) + 1);
      }, "pointerEvents:fired": function(t, e) {
        var n = t.interaction, i = t.pointerEvent, o = t.eventTarget, r = t.targets;
        if (i.type === "hold" && r.length) {
          var d = r[0].eventable.options.holdRepeatInterval;
          d <= 0 || (n.holdIntervalHandle = setTimeout((function() {
            e.pointerEvents.fire({ interaction: n, eventTarget: o, type: "hold", pointer: i, event: i }, e);
          }), d));
        }
      } }) }, Vo = Go, Yo = { id: "pointer-events/interactableTargets", install: function(t) {
        var e = t.Interactable;
        e.prototype.pointerEvents = function(i) {
          return Z(this.events.options, i), this;
        };
        var n = e.prototype._backCompatOption;
        e.prototype._backCompatOption = function(i, o) {
          var r = n.call(this, i, o);
          return r === this && (this.events.options[i] = o), r;
        };
      }, listeners: { "pointerEvents:collect-targets": function(t, e) {
        var n = t.targets, i = t.node, o = t.type, r = t.eventTarget;
        e.interactables.forEachMatch(i, (function(d) {
          var p = d.events, h = p.options;
          p.types[o] && p.types[o].length && d.testIgnoreAllow(h, i, r) && n.push({ node: i, eventable: p, props: { interactable: d } });
        }));
      }, "interactable:new": function(t) {
        var e = t.interactable;
        e.events.getRect = function(n) {
          return e.getRect(n);
        };
      }, "interactable:set": function(t, e) {
        var n = t.interactable, i = t.options;
        Z(n.events.options, e.pointerEvents.defaults), Z(n.events.options, i.pointerEvents || {});
      } } }, Wo = Yo, Xo = { id: "pointer-events", install: function(t) {
        t.usePlugin(Bo), t.usePlugin(Vo), t.usePlugin(Wo);
      } }, Ko = Xo, Jo = { id: "reflow", install: function(t) {
        var e = t.Interactable;
        t.actions.phases.reflow = !0, e.prototype.reflow = function(n) {
          return (function(i, o, r) {
            for (var d = i.getAllElements(), p = r.window.Promise, h = p ? [] : null, _ = function() {
              var $ = d[g], O = i.getRect($);
              if (!O) return 1;
              var L, j = wt(r.interactions.list, (function(Y) {
                return Y.interacting() && Y.interactable === i && Y.element === $ && Y.prepared.name === o.name;
              }));
              if (j) j.move(), h && (L = j._reflowPromise || new p((function(Y) {
                j._reflowResolve = Y;
              })));
              else {
                var H = an(O), K = /* @__PURE__ */ (function(Y) {
                  return { coords: Y, get page() {
                    return this.coords.page;
                  }, get client() {
                    return this.coords.client;
                  }, get timeStamp() {
                    return this.coords.timeStamp;
                  }, get pageX() {
                    return this.coords.page.x;
                  }, get pageY() {
                    return this.coords.page.y;
                  }, get clientX() {
                    return this.coords.client.x;
                  }, get clientY() {
                    return this.coords.client.y;
                  }, get pointerId() {
                    return this.coords.pointerId;
                  }, get target() {
                    return this.coords.target;
                  }, get type() {
                    return this.coords.type;
                  }, get pointerType() {
                    return this.coords.pointerType;
                  }, get buttons() {
                    return this.coords.buttons;
                  }, preventDefault: function() {
                  } };
                })({ page: { x: H.x, y: H.y }, client: { x: H.x, y: H.y }, timeStamp: r.now() });
                L = (function(Y, Q, se, le, te) {
                  var oe = Y.interactions.new({ pointerType: "reflow" }), Pe = { interaction: oe, event: te, pointer: te, eventTarget: se, phase: "reflow" };
                  oe.interactable = Q, oe.element = se, oe.prevEvent = te, oe.updatePointer(te, te, se, !0), Zn(oe.coords.delta), mn(oe.prepared, le), oe._doPhase(Pe);
                  var me = Y.window, Re = me.Promise, Le = Re ? new Re((function(Ve) {
                    oe._reflowResolve = Ve;
                  })) : void 0;
                  return oe._reflowPromise = Le, oe.start(le, Q, se), oe._interacting ? (oe.move(Pe), oe.end(te)) : (oe.stop(), oe._reflowResolve()), oe.removePointer(te, te), Le;
                })(r, i, $, o, K);
              }
              h && h.push(L);
            }, g = 0; g < d.length && !_(); g++) ;
            return h && p.all(h).then((function() {
              return i;
            }));
          })(this, n, t);
        };
      }, listeners: { "interactions:stop": function(t, e) {
        var n = t.interaction;
        n.pointerType === "reflow" && (n._reflowResolve && n._reflowResolve(), (function(i, o) {
          i.splice(i.indexOf(o), 1);
        })(e.interactions.list, n));
      } } }, Qo = Jo;
      if (Oe.use(_i), Oe.use(Ei), Oe.use(Ko), Oe.use(go), Oe.use(No), Oe.use(no), Oe.use(Gs), Oe.use(Ys), Oe.use(Qo), Oe.default = Oe, y(c) === "object" && c) try {
        c.exports = Oe;
      } catch {
      }
      return Oe.default = Oe, Oe;
    }));
  })(Mt, Mt.exports)), Mt.exports;
}
var Hr = /* @__PURE__ */ Lr();
const Yi = /* @__PURE__ */ qr(Hr), st = (c) => ir.compilePath(`img:${c}`), Es = (c) => st(`character/${c}.jpg`), zr = (c) => {
  const s = window.whichWay?.skin;
  if (s?.getCurrentSkinPath)
    try {
      const a = s.getCurrentSkinPath(c);
      if (typeof a == "string" && a) return a;
    } catch {
    }
  return Es(c);
}, Fr = (c, s) => st(`model/GloriousIdeal/equips/${s || c}.png`), Nr = () => st("model/GloriousIdeal/equips/rogue_6_relic_legacy_1.png"), Ie = (c) => {
  try {
    const s = nt.translation(c);
    if (typeof s == "string" && s && s !== c) return s;
  } catch {
  }
  return c;
}, Un = (c) => "◆".repeat(Math.max(0, Math.min(6, c))), Dt = (c) => c.dead ? { label: "☠ 阵亡", cls: "dead" } : c.agony ? { label: "折磨", cls: "bad" } : c.virtue ? { label: `美德 · ${c.virtue}`, cls: "virtue" } : { label: "正常", cls: "ok" }, At = (c) => c >= 100 ? "high" : c >= 50 ? "mid" : "low", Br = (c) => ({
  military: "🛡",
  babel: "🏛",
  courier: "🕊",
  barracks: "🏕",
  merchant: "⚖",
  graveyard: "🪦",
  camel: "🐫"
})[c] ?? "🏗", Ur = (c) => {
  const s = Ie(c);
  return s !== c ? s.charAt(0) : c.charAt(0).toUpperCase();
}, Gn = (c) => {
  try {
    return fe.character[c] || {};
  } catch {
    return {};
  }
}, Gr = (c) => {
  const s = Gn(c), a = s.hp;
  let u, y = s.maxHp;
  return Array.isArray(a) ? (u = a[0], y === void 0 && (y = a[1])) : u = a, y === void 0 && (y = u), u === void 0 && (u = y), { hp: u ?? 4, maxHp: y ?? 4 };
}, Vr = (c) => Gn(c).hujia ?? 0, Yr = (c) => {
  const { hp: s, maxHp: a } = Gr(c), u = Vr(c);
  return { hp: s, maxHp: a, hujia: u, compact: a + u > 6 };
}, Wr = () => st("ui/actualHp.png"), Xr = () => st("ui/emptyHp.png"), Kr = () => st("ui/shield.png"), Jr = (c) => {
  try {
    const s = fe.characterIntro?.[c];
    if (typeof s == "string" && s) return s.replace(/<br\s*\/?>/gi, `
`).replace(/<[^>]+>/g, "").trim();
  } catch {
  }
  return "";
}, Qr = (c) => {
  try {
    const s = fe.characterTitle?.[c];
    if (typeof s == "string" && s) return s.replace(/<[^>]+>/g, "").trim();
  } catch {
  }
  return "";
}, Is = (c) => (Gn(c).skills || []).map((a) => {
  let u = a, y = "";
  try {
    const v = fe.translate[a];
    typeof v == "string" && v && (u = v);
    const w = fe.translate[a + "_info"];
    typeof w == "string" && (y = w);
  } catch {
  }
  return { id: a, name: u, info: y };
}).filter((a) => a.name || a.info), Zr = (c) => {
  if (!c) return "";
  try {
    return Bn(c)?.name ?? c;
  } catch {
    return c;
  }
}, ea = (c) => {
  const s = `第 ${c.day} 天`, a = c.dungeonId ? `在「${Zr(c.dungeonId)}」` : "";
  if (c.cause === "stress") return `${s}${a}压力崩溃而亡`;
  if (c.cause === "accident" || !c.killerFaction) return `${s}${a}意外牺牲`;
  const u = c.killerId ? Ie(c.killerId) : c.killerFaction === "enemy" ? "敌军" : "友军";
  switch (c.killerFaction) {
    case "self":
      return `${s}${a}自杀`;
    case "ally":
      return `${s}${a}死于友方（${u}）之手`;
    default:
      return `${s}${a}被${u}杀死`;
  }
}, ta = (c) => {
  switch (c.cause) {
    case "stress":
      return { label: "压力崩溃", cls: "warn" };
    case "accident":
      return { label: "意外", cls: "dead" };
    default:
      return c.killerFaction === "self" ? { label: "自杀", cls: "dead" } : c.killerFaction === "ally" ? { label: "误伤", cls: "warn" } : { label: "战死", cls: "bad" };
  }
}, na = ["src"], ia = /* @__PURE__ */ ve({
  __name: "EquipIcon",
  props: {
    id: {},
    img: {},
    size: { default: 40 }
  },
  setup(c) {
    const s = c, a = je(!1), u = X(() => a.value ? Nr() : Fr(s.id, s.img));
    return (y, v) => (m(), b("span", {
      class: "gi-eq",
      style: ze({ width: c.size + "px", height: c.size + "px" })
    }, [
      l("img", {
        class: "gi-eq-img",
        src: u.value,
        alt: "",
        loading: "lazy",
        onError: v[0] || (v[0] = (w) => a.value = !0)
      }, null, 40, na)
    ], 4));
  }
}), Rt = /* @__PURE__ */ ye(ia, [["__scopeId", "data-v-7629fd2b"]]), Ts = 112, sa = 92, oa = { class: "gi-bvo" }, ra = { class: "gi-bvo-num" }, aa = /* @__PURE__ */ ve({
  __name: "BattleAllyOverlay",
  props: {
    ally: {}
  },
  emits: ["openHand", "openEquip"],
  setup(c, { emit: s }) {
    const a = c, u = s, y = { backgroundImage: `url("${st("model/GloriousIdeal/ui/cardbackOL.png")}")` }, v = X(() => !a.ally.hidden && !a.ally.isMe), w = X(() => !a.ally.hidden && a.ally.equips.length > 0);
    return (k, M) => (m(), b("div", oa, [
      v.value ? (m(), b("div", {
        key: 0,
        class: J(["gi-bvo-hand", { "is-flip": c.ally.flipLeft }]),
        style: ze([y, { width: D(Ts) + "px", height: D(sa) + "px" }]),
        onClick: M[1] || (M[1] = (P) => u("openHand"))
      }, [
        l("div", ra, x(c.ally.count), 1),
        l("div", {
          class: "gi-bvo-cards",
          onWheel: M[0] || (M[0] = dt(() => {
          }, ["stop"]))
        }, [
          (m(!0), b(ee, null, re(c.ally.hand, (P, T) => (m(), b("span", {
            key: T,
            class: J(["gi-bvo-card", P.red ? "is-red" : "is-black"])
          }, x(P.name), 3))), 128))
        ], 32)
      ], 6)) : U("", !0),
      w.value ? (m(), b("div", {
        key: 1,
        class: J(["gi-bvo-equips", c.ally.isMe ? "is-above" : "is-below"])
      }, [
        (m(!0), b(ee, null, re(c.ally.equips, (P) => (m(), b("span", {
          key: P.id,
          class: "gi-bvo-eq",
          onClick: M[2] || (M[2] = dt((T) => u("openEquip"), ["stop"]))
        }, [
          ge(Rt, {
            id: P.id,
            img: P.img,
            size: 30
          }, null, 8, ["id", "img"])
        ]))), 128))
      ], 2)) : U("", !0)
    ]));
  }
}), la = /* @__PURE__ */ ye(aa, [["__scopeId", "data-v-2fc586de"]]), ca = { class: "gi-bvem" }, da = {
  key: 0,
  class: "gi-bvem-empty"
}, ua = { class: "gi-bvem-main" }, pa = { class: "gi-bvem-name" }, fa = { class: "gi-bvem-desc" }, ha = /* @__PURE__ */ ve({
  __name: "BattleEquipModal",
  props: {
    modal: {}
  },
  emits: ["close"],
  setup(c, { emit: s }) {
    const a = s;
    return (u, y) => c.modal.equip ? (m(), b("div", {
      key: 0,
      class: "gi-bvem-mask",
      onClick: y[1] || (y[1] = dt((v) => a("close"), ["self"]))
    }, [
      l("div", ca, [
        l("button", {
          class: "gi-bvem-x",
          onClick: y[0] || (y[0] = (v) => a("close"))
        }, "✕"),
        l("h3", null, x(c.modal.equip.title), 1),
        c.modal.equip.equips.length ? U("", !0) : (m(), b("p", da, "未穿戴装备。")),
        (m(!0), b(ee, null, re(c.modal.equip.equips, (v) => (m(), b("div", {
          key: v.id,
          class: "gi-bvem-row"
        }, [
          ge(Rt, {
            id: v.id,
            img: v.img,
            size: 38
          }, null, 8, ["id", "img"]),
          l("div", ua, [
            l("div", pa, x(v.name), 1),
            l("div", fa, x(v.desc), 1)
          ])
        ]))), 128))
      ])
    ])) : U("", !0);
  }
}), ga = /* @__PURE__ */ ye(ha, [["__scopeId", "data-v-0ffdab8a"]]), va = { class: "gi-bhp-bar" }, ma = { class: "gi-bhp-title" }, ya = {
  key: 0,
  class: "gi-bhp-empty"
}, ba = /* @__PURE__ */ ve({
  __name: "BattleHandPanel",
  props: {
    panel: {}
  },
  emits: ["close", "ready"],
  setup(c, { emit: s }) {
    const a = s, u = je(null), y = je(null);
    return cs(() => {
      u.value && y.value && a("ready", u.value, y.value);
    }), (v, w) => (m(), b("div", {
      ref_key: "root",
      ref: y,
      class: "gi-bhp"
    }, [
      l("div", va, [
        l("span", ma, x(c.panel.title), 1),
        l("button", {
          class: "gi-bhp-close",
          onClick: w[0] || (w[0] = (k) => a("close"))
        }, "关闭")
      ]),
      l("div", {
        ref_key: "cardsBox",
        ref: u,
        class: "gi-bhp-cards buttons",
        onWheel: w[1] || (w[1] = dt(() => {
        }, ["stop"]))
      }, null, 544),
      c.panel.count === 0 ? (m(), b("p", ya, "没有手牌。")) : U("", !0)
    ], 512));
  }
}), _a = /* @__PURE__ */ ye(ba, [["__scopeId", "data-v-3667dc4b"]]), Cs = (c) => {
  try {
    return nt.translation(c.name1 || c.name) || c.name1 || "干员";
  } catch {
    return "干员";
  }
}, xa = (c) => c?.suit === "heart" || c?.suit === "diamond", ka = (c) => ({ name: nt.translation(c.name) || c.name, red: xa(c) }), Wi = (c) => {
  const s = c.brawlinfo?.equipIds;
  return Array.isArray(s) ? s.map((a) => {
    const u = Ae(a);
    return { id: a, name: u ? u.name : a, img: u?.img, desc: u ? u.desc : "未知装备" };
  }) : [];
}, Xi = (c, s) => `${Cs(c)}的手牌（${s}）`;
function wa() {
  const c = [];
  let s = 0, a = !1;
  const u = (V) => {
    const S = V.brawlinfo;
    return !!S && S.playercontrol === !0;
  }, y = () => {
    !a && !He.paused && (pe.pause(), a = !0), s++;
  }, v = () => {
    if (s--, s <= 0 && a) {
      s = 0, a = !1;
      try {
        pe.resume();
      } catch {
      }
    }
  }, w = Zt({ equip: null }), k = () => {
    w.equip && (w.equip = null, v());
  }, M = (V) => {
    w.equip || y(), w.equip = { title: `${Cs(V)} 的装备`, equips: Wi(V) };
  }, P = document.createElement("div");
  document.body.appendChild(P);
  const T = en(ga, { modal: w, onClose: k });
  T.mount(P);
  const A = [];
  let G;
  const q = (V) => V.map((S) => `${S.cardid}:${S.name}${S.number}${S.suit}`).join("|"), I = (V, S) => {
    const B = V.box;
    B && (B.innerHTML = "", S.length && qn.create.buttons(S, "card", B, !0), V.sig = q(S), qn.update());
  }, C = (V, S) => {
    const B = V.root;
    if (!B) return;
    const W = { x: S, y: 0 };
    B.style.transform = `translate(${W.x}px, ${W.y}px)`, V.drag = Yi(B).draggable({
      allowFrom: ".gi-bhp-bar",
      ignoreFrom: ".gi-bhp-close",
      modifiers: [Yi.modifiers.restrictRect({ restriction: "parent" })],
      listeners: {
        move: (ke) => {
          W.x += ke.dx, W.y += ke.dy, B.style.transform = `translate(${W.x}px, ${W.y}px)`;
        }
      }
    });
  }, ie = () => {
    A.length === 0 && G !== void 0 && (clearInterval(G), G = void 0);
  }, ae = (V) => {
    const S = A.indexOf(V);
    S < 0 || (A.splice(S, 1), V.drag?.unset(), V.app.unmount(), V.host.remove(), v(), ie());
  }, z = () => {
    for (const V of A) {
      if (!V.player.parentNode) continue;
      const S = V.player.getCards("h") || [];
      V.state.count = S.length, V.state.title = Xi(V.player, S.length), q(S) !== V.sig && I(V, S);
    }
  }, F = (V) => {
    if (A.some((he) => he.player === V)) return;
    const S = V.getCards("h") || [];
    y();
    const B = Math.min(A.length, 5) * 28, W = Zt({
      title: Xi(V, S.length),
      count: S.length
    }), ke = document.createElement("div");
    ke.style.cssText = "position:fixed;inset:0;z-index:999998;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:none;", document.body.appendChild(ke);
    const _e = () => A.find((he) => he.player === V), Te = en(_a, {
      panel: W,
      onClose: () => {
        const he = _e();
        he && ae(he);
      },
      onReady: (he, Be) => {
        const Fe = _e();
        Fe && (Fe.box = he, Fe.root = Be);
      }
    }), Ce = { player: V, state: W, host: ke, app: Te, box: null, root: null, sig: "" };
    A.push(Ce), Te.mount(ke), I(Ce, S), C(Ce, B), G === void 0 && (G = window.setInterval(N, 500));
  }, R = (V) => {
    const S = Zt({
      hand: [],
      count: 0,
      equips: Wi(V),
      isMe: !1,
      hidden: !1,
      flipLeft: !1
    }), B = document.createElement("div");
    B.style.cssText = "position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;", V.appendChild(B);
    const W = en(la, {
      ally: S,
      onOpenHand: () => F(V),
      onOpenEquip: () => M(V)
    });
    return W.mount(B), { player: V, state: S, host: B, app: W };
  }, N = () => {
    const V = document.documentElement.clientWidth || window.innerWidth;
    for (const S of c) {
      if (!S.player.parentNode) continue;
      const B = S.player.getCards("h") || [];
      S.state.isMe = S.player === pe.me, S.state.hidden = typeof S.player.isDead == "function" && S.player.isDead(), S.state.count = B.length, S.state.hand = B.map(ka);
      const W = S.player.getBoundingClientRect();
      S.state.flipLeft = W.right + Ts + 8 > V;
    }
    z();
  };
  let ce = !1;
  const E = () => {
    ce || (ce = !0, Promise.resolve().then(() => {
      ce = !1, N();
    }));
  }, $e = (V) => {
    const S = V.node;
    if (!S?.handcards1) return;
    const B = new MutationObserver(E);
    return B.observe(S.handcards1, { childList: !0 }), S.handcards2 && B.observe(S.handcards2, { childList: !0 }), B;
  };
  for (const V of pe.players) {
    if (!u(V)) continue;
    const S = R(V);
    S.observer = $e(V), c.push(S);
  }
  N();
  const Se = () => N();
  fe.onphase.push(Se);
  const be = pe, qe = be.swapPlayer, xe = be.swapControl, De = () => {
    Promise.resolve().then(N);
  };
  return qe && (be.swapPlayer = function(V) {
    const S = qe.call(this, V);
    return De(), S;
  }), xe && (be.swapControl = function(V) {
    const S = xe.call(this, V);
    return De(), S;
  }), {
    refresh: N,
    uninstall: () => {
      const V = fe.onphase.indexOf(Se);
      V >= 0 && fe.onphase.splice(V, 1), qe && (be.swapPlayer = qe), xe && (be.swapControl = xe);
      for (const S of A.slice()) ae(S);
      k();
      for (const S of c)
        S.observer?.disconnect(), S.app.unmount(), S.host.remove();
      if (c.length = 0, T.unmount(), P.remove(), s = 0, a) {
        a = !1;
        try {
          pe.resume();
        } catch {
        }
      }
    }
  };
}
const On = (c, s) => c + Math.floor(Math.random() * (s - c + 1));
function $a(c, s) {
  const u = Nn[s].outposts, y = [], v = (I, C) => {
    const ie = { index: y.length, kind: I, neighbors: [], ...C };
    return y.push(ie), ie;
  }, w = (I, C) => {
    I.neighbors.push(C.index), C.neighbors.push(I.index);
  }, k = [];
  for (let I = 0; I < u; I++) k.push(v("outpost", { event: I === 0 ? "normal" : I === u - 1 ? "boss" : "normal", hasEnemy: !0 }));
  const M = [], P = (I, C) => {
    let ie = I;
    const ae = On(1, 5);
    for (let z = 0; z < ae; z++) {
      const F = v("path");
      M.push(F), w(ie, F), ie = F;
    }
    w(ie, C);
  };
  for (let I = 0; I < u - 1; I++) P(k[I], k[I + 1]);
  for (let I = 0; I < Math.floor(u / 4); I++) {
    const C = k[On(0, u - 3)], ie = k[On(C.index + 1, u - 1)];
    C !== ie && !C.neighbors.includes(ie.index) && P(C, ie);
  }
  const T = (I, C, ie) => Math.max(C, Math.min(ie, I)), A = T(Math.round(u * 0.4), 2, 6), G = T(Math.round(u * 0.3), 1, 4), q = [...M];
  for (let I = q.length - 1; I > 0; I--) {
    const C = Math.floor(Math.random() * (I + 1));
    [q[I], q[C]] = [q[C], q[I]];
  }
  for (const I of q.splice(0, A)) I.event = "treasure";
  for (const I of q.splice(0, G)) I.event = "obstacle";
  return { dungeonId: c, difficulty: s, nodes: y, entry: 0 };
}
const tn = 10, Ms = (c) => c.event === "treasure" || c.event === "obstacle", nn = (c) => c.event === "obstacle" && !c.cleared, Pn = (c) => {
  const s = fe.character[c] || {};
  return { hp: s.hp ?? 4, maxHp: s.maxHp ?? 4 };
}, Ki = (c) => (c ?? []).map((s) => [s, "random", "random"]), Sa = (c) => Ar(c);
function Ea() {
  const c = /* @__PURE__ */ new Map(), s = fe.element?.player, a = s && typeof s.die == "function" ? s.die : void 0;
  return s && a && (s.die = function(...u) {
    try {
      c.has(this) || c.set(this, u[0]?.source);
    } catch {
    }
    return a.apply(this, u);
  }), {
    read: (u) => c.get(u),
    uninstall: () => {
      s && a && (s.die = a);
    }
  };
}
function Ia() {
  const c = fe.element?.player, s = c && typeof c.isUnderControl == "function" ? c.isUnderControl : void 0;
  c && s && (c.isUnderControl = function(u, y) {
    if (He.gameStarted && this !== (y || pe.me)) {
      const v = this.brawlinfo;
      if (v && v.playercontrol === !0 && !this.isDead() && !this.isMad()) return !0;
    }
    return s.call(this, u, y);
  });
  const a = pe.modeSwapPlayer;
  return pe.modeSwapPlayer = (u) => {
    pe.swapPlayer?.(u);
  }, pe.addGlobalSkill("autoswap"), {
    uninstall: () => {
      c && s && (c.isUnderControl = s);
      const u = pe;
      a ? u.modeSwapPlayer = a : delete u.modeSwapPlayer, pe.removeGlobalSkill("autoswap");
    }
  };
}
async function Ag(c) {
  const s = Sa(c.dungeonId), a = [];
  c.party.forEach((w, k) => {
    const M = Pn(w), P = c.allyEquip?.[w];
    a.push({
      name2: "none",
      position: 0,
      identity: k === 0 ? "zhu" : "zhong",
      hp: Math.max(1, Math.floor(c.allyHp[w] ?? M.hp)),
      maxHp: M.maxHp + (P?.maxHp ?? 0),
      level: c.allyLevel[w] ?? 1,
      equip: P,
      equipIds: c.allyEquips?.[w],
      handcards: [],
      // 初始手牌交给 gameDraw + onphase 归一化(getInitHandSize)
      equips: [],
      judges: [],
      playercontrol: !0,
      linked: !1,
      turnedover: !1
    });
  });
  for (const w of s) {
    const k = Pn(w.charId);
    a.push({
      name2: "none",
      position: 0,
      identity: "fan",
      hp: Math.max(1, Math.floor(w.hp ?? k.hp)),
      maxHp: Math.max(w.maxHp ?? k.maxHp, Math.floor(w.hp ?? k.hp)),
      handcards: w.hand ? Ki(w.hand) : [],
      // 未配置手牌 → 默认 gameDraw(4)
      equips: Ki(w.equips),
      judges: [],
      playercontrol: !1,
      linked: !1,
      turnedover: !1
    });
  }
  const u = a.map((w, k) => {
    const M = w.playercontrol ? c.party[k] : s[k - c.party.length].charId;
    return { ...w, name: M };
  });
  for (const w of u) w._r = Math.random();
  u.sort((w, k) => Gi(k.name) - Gi(w.name) || w._r - k._r).forEach((w, k) => {
    w.position = k + 1;
  });
  const y = { players: u }, v = {
    submode: "normal",
    noAddSetting: !0,
    identityShown: !0,
    playerNumber: u.length,
    scene: y,
    init: () => {
      pe.saveConfig("double_character", !1, "identity");
    },
    chooseCharacterBefore: Ta(),
    chooseCharacterAi: Ca(),
    chooseCharacter: Ma(),
    gameStart: Pa(),
    checkResult: Da()
  };
  return await new Promise((w) => {
    let k = !1, M = !1;
    const P = Ea();
    let T = null, A = null;
    const G = (ae) => {
      if (k) return;
      k = !0, A?.uninstall(), T?.uninstall();
      const z = fe.onover.indexOf(ie);
      z >= 0 && fe.onover.splice(z, 1);
      const F = fe.onphase.indexOf(I);
      F >= 0 && fe.onphase.splice(F, 1);
      const R = He.ai;
      if (Array.isArray(R?.customAttitude)) {
        const N = R.customAttitude.indexOf(C);
        N >= 0 && R.customAttitude.splice(N, 1);
      }
      P.uninstall(), w(ae);
    }, q = () => {
      if (M) return;
      M = !0;
      const ae = [];
      for (const z of pe.players) {
        const F = z.brawlinfo;
        if (F) {
          if (F.maxHp && (z.maxHp = F.maxHp, z.hp > z.maxHp && (z.hp = z.maxHp)), F.hp && (z.hp = F.hp, z.hp > z.maxHp && (z.maxHp = z.hp)), F.playercontrol) {
            const R = Or(F.name, F.level ?? 1) + (F.equip?.drawStart ?? 0), N = z.countCards("h");
            N < R && z.draw(R - N), ae.push({ player: z, ids: F.equipIds });
          }
          z.update();
        }
      }
      for (const { player: z, ids: F } of ae)
        if (F)
          for (const R of F) {
            const N = Ae(R)?.effect;
            if (typeof N == "function")
              try {
                N(He.event, z);
              } catch (ce) {
                console.error(`[GloriousIdeal] 装备 effect 执行失败 ${R}`, ce);
              }
          }
      if (!A)
        try {
          A = wa();
        } catch (z) {
          console.error("[GloriousIdeal] 战斗覆盖层安装失败", z);
        }
    }, I = () => {
      q();
    }, C = (ae, z) => {
      if (ae === z) return;
      const F = ae.brawlinfo?.playercontrol, R = z.brawlinfo?.playercontrol;
      if (!(F === void 0 || R === void 0))
        return F === R ? 10 : -10;
    }, ie = (ae) => {
      q();
      const z = {}, F = [], R = {}, N = {};
      for (const E of [...pe.players, ...pe.dead]) {
        const $e = E.brawlinfo;
        if ($e) {
          if ($e.playercontrol) {
            const Se = Math.max(0, Math.floor(E.hp ?? 0));
            if (z[$e.name] = Se, Se <= 0 || E.isDead()) {
              const be = P.read(E);
              if (be) {
                const qe = be.brawlinfo, xe = be === E ? "self" : qe?.playercontrol ? "ally" : "enemy";
                N[$e.name] = { id: be.name1 || null, faction: xe };
              } else
                N[$e.name] = void 0;
            }
          } else if (E.isDead()) {
            F.push(E.name1 || $e.name);
            const be = P.read(E)?.brawlinfo;
            be?.playercontrol && (R[be.name] = (R[be.name] ?? 0) + 1);
          }
        }
      }
      for (const E of c.party) z[E] == null && (z[E] = 0);
      G({ win: ae === !0, nodeIndex: c.nodeIndex, finalHp: z, killedEnemies: F, kills: R, deaths: N });
    };
    try {
      fe.configOL.number = u.length, He.brawl = v;
      const ae = He.ai ??= {};
      (Array.isArray(ae.customAttitude) ? ae.customAttitude : ae.customAttitude = []).push(C), fe.onphase.push(I), fe.onover.push(ie), pe.switchMode("identity"), T = Ia(), v.init();
    } catch (ae) {
      console.error("[GloriousIdeal] 拉起真实对局失败，回退到占位结算", ae);
      const z = Math.random() > 0.4, F = {};
      for (const R of c.party) F[R] = Math.max(0, Math.floor(c.allyHp[R] ?? Pn(R).hp) - (z ? 1 : 2));
      G({ win: z, nodeIndex: c.nodeIndex, finalHp: F, killedEnemies: [], kills: {}, deaths: {} });
    }
  });
}
function Ta() {
  return function() {
    const c = He.brawl.scene, s = [];
    let a = 0;
    for (const k of c.players)
      k.playercontrol && s.push(k), a = Math.max(a, k.position);
    a < c.players.length && (a = c.players.length);
    const u = [];
    for (let k = 1; k <= a; k++) u.push(k);
    for (const k of c.players) k.position && u.remove(k.position);
    for (const k of c.players) k.position || (k.position = u.randomRemove());
    s.length ? pe.me.brawlinfo = s[0] : pe.me.brawlinfo = c.players.randomGet();
    const y = (k) => {
      let M = k.position - pe.me.brawlinfo.position;
      return M < 0 && (M += a), M;
    };
    c.players.sort((k, M) => y(k) - y(M));
    let v = pe.me;
    const w = (k) => {
      const M = [];
      return M.push(k[1] === "random" ? ["club", "spade", "heart", "diamond"].randomGet() : k[1]), M.push(k[2] === "random" ? String(Math.ceil(Math.random() * 13)) : k[2]), M.push(k[0] === "random" ? fe.inpile.randomGet() : k[0]), qn.create.card().init(M);
    };
    He.firstAct = pe.me;
    for (const k of c.players) {
      v.brawlinfo = k, v.identity = k.identity, v.identity === "zhu" && (v.isZhu = !0), v.setIdentity(k.identity), v.node.marks.hide(), k.name !== "random" && v.init(k.name), k.maxHp && (v.maxHp = k.maxHp, v.hp > v.maxHp && (v.hp = v.maxHp)), k.hp && (v.hp = k.hp, v.hp > v.maxHp && (v.maxHp = v.hp)), v.update(), k.linked && v.classList.add("linked" + (nt.is.linked2(v) ? "2" : "")), k.turnedover && v.classList.add("turnedover"), k.position < He.firstAct.brawlinfo.position && (He.firstAct = v);
      const M = k.handcards.map(w);
      M.length && v.directgain(M);
      for (const P of k.equips) {
        const T = w(P);
        v.addVirtualEquip(nt.autoViewAs(T, void 0, !1), [T]);
      }
      for (const P of k.judges) {
        const T = w(P);
        v.addVirtualJudge(nt.autoViewAs(T, void 0, !1), [T]);
      }
      v = v.next;
    }
  };
}
function Ca() {
  return function(c, s) {
    c.brawlinfo.name === "random" && c.init(s.randomGet());
  };
}
function Ma() {
  return function(c) {
    const s = pe.me.brawlinfo, a = He.event;
    return s.name && s.name !== "random" && (a.chosen = [s.name]), pe.me.identity === "zhu" ? !1 : "nozhu";
  };
}
const lt = "gloriousIdealLv6Hand", ct = "gloriousIdealEquip", Ji = (c) => c.brawlinfo?.equip;
let Qi = !1;
function Oa() {
  if (Qi) return;
  const c = fe.skill;
  c && !c[lt] && (c[lt] = {
    lock: !0,
    mod: { maxHandcard: (a, u) => u + 1 }
  }), c && !c[ct] && (c[ct] = {
    lock: !0,
    mod: {
      cardUsable: (a, u, y) => {
        if (a.name === "sha") return y + (Ji(u)?.attackExtra ?? 0);
      },
      maxHandcard: (a, u) => u + (Ji(a)?.maxHandcard ?? 0)
    }
  });
  const s = fe.translate;
  s && (s[lt] === void 0 && (s[lt] = "久经沙场"), s[lt + "_info"] === void 0 && (s[lt + "_info"] = "手牌上限+1。"), s[ct] === void 0 && (s[ct] = "装备加成"), s[ct + "_info"] === void 0 && (s[ct + "_info"] = "来自所穿戴装备的持续加成。")), Qi = !0;
}
function Pa() {
  return function() {
    Oa();
    for (const c of pe.players) {
      const s = c.brawlinfo;
      if (!s || !s.playercontrol) continue;
      const a = s.level ?? 1;
      if (a >= 4) {
        const y = [], v = nt.cardPile("shan", "cardPile"), w = nt.cardPile("sha", "cardPile");
        v && y.push(v), w && y.push(w), y.length && c.directgain(y);
      }
      a >= 5 && c.changeHujia(1), a >= 6 && c.addSkill(lt);
      const u = s.equip;
      u && (u.hujia && c.changeHujia(u.hujia), (u.attackExtra || u.maxHandcard) && c.addSkill(ct));
    }
  };
}
function Da() {
  return function() {
    const c = [...pe.players, ...pe.dead], s = c.filter((u) => u.brawlinfo?.playercontrol === !1), a = c.filter((u) => u.brawlinfo?.playercontrol === !0);
    s.every((u) => u.isDead()) ? pe.over(!0) : a.every((u) => u.isDead()) && pe.over(!1);
  };
}
const Vn = "gloriousIdeal_campaign_v1", Aa = (c) => {
  const s = {};
  for (const u of sn) s[u.id] = u.initLevel;
  const a = c.map((u) => ({
    id: u,
    level: 1,
    exp: 0,
    stress: ps.init,
    agony: !1,
    virtue: null,
    dead: !1,
    maxEquipSlots: 1,
    equipped: []
  }));
  return {
    day: 1,
    unity: Ot.init,
    originite: 100,
    buildings: s,
    roster: a,
    candidates: [],
    recruitDay: 0,
    inventory: {},
    ownedEquips: [],
    shop: { day: 0, refreshLeft: 0, stock: [] },
    dungeonProgress: Object.fromEntries(Fn.map((u) => [u.id, { exp: 0, bossSlain: [] }])),
    missionResult: { win: 0, fail: 0 },
    win: !1,
    lose: !1,
    phase: "camp",
    run: null
  };
};
function Ra(c) {
  const s = c;
  if (Array.isArray(s.ownedEquips) || (s.ownedEquips = []), (!s.shop || typeof s.shop != "object") && (s.shop = { day: 0, refreshLeft: 0, stock: [] }), Array.isArray(s.shop.stock) || (s.shop.stock = []), typeof s.shop.day != "number" && (s.shop.day = 0), typeof s.shop.refreshLeft != "number" && (s.shop.refreshLeft = 0), typeof s.recruitDay != "number" && (s.recruitDay = 0), Array.isArray(s.roster))
    for (const a of s.roster)
      typeof a.maxEquipSlots != "number" && (a.maxEquipSlots = a.level >= 2 ? 2 : 1), Array.isArray(a.equipped) || (a.equipped = []);
  return s.run && (typeof s.run.actions != "number" && (s.run.actions = 0), typeof s.run.feedReadyAt != "number" && (s.run.feedReadyAt = 0), (!s.run.maxHp || typeof s.run.maxHp != "object") && (s.run.maxHp = { ...s.run.hp }), (!s.run.loot || typeof s.run.loot != "object") && (s.run.loot = We()), (!s.run.loot.items || typeof s.run.loot.items != "object") && (s.run.loot.items = {}), Array.isArray(s.run.loot.equips) || (s.run.loot.equips = []), typeof s.run.loot.originite != "number" && (s.run.loot.originite = 0), (!s.run.startConsumables || typeof s.run.startConsumables != "object") && (s.run.startConsumables = {}), (!s.run.snapshot || typeof s.run.snapshot != "object") && (s.run.snapshot = {}), s.run.settleWin !== !0 && s.run.settleWin !== !1 && (s.run.settleWin = null)), delete s.backpackBonus, s;
}
class Yn {
  data;
  constructor(s) {
    this.data = Ra(s);
  }
  // ---------- 读取 ----------
  liveOperators() {
    return this.data.roster.filter((s) => !s.dead);
  }
  unityGrowMod() {
    const s = or.find((a) => this.data.unity >= a.min && this.data.unity <= a.max);
    return s ? s.growMod : 0;
  }
  /** 背包格数 = 基础 8 + 驼兽运输队等级（buildings.camel，初始 0，最高 8） */
  backpackSlots() {
    return gs + Math.max(0, this.data.buildings.camel ?? 0);
  }
  /** 已占用局内背包格：仅统计有库存的消耗品类型数（装备存全局仓库、不占格） */
  usedBackpackSlots() {
    return Ye.filter((s) => (this.data.inventory[s.id] ?? 0) > 0).length;
  }
  freeBackpackSlots() {
    return Math.max(0, this.backpackSlots() - this.usedBackpackSlots());
  }
  // ---------- 团结度 ----------
  /** 应用一次团结度事件（自动叠加区间修正后再上下限截断） */
  applyUnityEvent(s) {
    const a = rr[s];
    if (a == null) return;
    let u = a;
    u > 0 && (u *= 1 + this.unityGrowMod()), this.data.unity = Math.max(0, Math.min(Ot.max, this.data.unity + u)), this.checkFail();
  }
  // ---------- 建筑 ----------
  upgradeBuilding(s) {
    const a = sn.find((v) => v.id === s), u = this.data.buildings[s];
    if (u < 0)
      return this.data.originite < a.cost[0] ? { ok: !1, reason: "源石碇不足" } : (this.data.originite -= a.cost[0], this.data.buildings[s] = 1, { ok: !0 });
    if (u >= a.maxLevel) return { ok: !1, reason: "已满级" };
    const y = a.cost[u];
    return this.data.originite < y ? { ok: !1, reason: "源石碇不足" } : (this.data.originite -= y, this.data.buildings[s] = u + 1, { ok: !0 });
  }
  /** 每日结算：建筑被动效果 + 干员压力修正参考 */
  dailyBuildingEffects() {
    let s = 0;
    for (const a of sn) {
      const u = this.data.buildings[a.id], y = sr(a.id, u);
      y.unity && (s += y.unity);
    }
    return this.data.unity = Math.max(0, Math.min(Ot.max, this.data.unity + s)), { unity: s };
  }
  // ---------- 干员 ----------
  /** 招募（从将池抽 4 名候选人，不会抽到已在队伍/已死亡的干员） */
  rollCandidates(s) {
    const a = new Set(this.data.roster.map((v) => v.id)), u = s.filter((v) => !a.has(v)), y = Math.min(4, u.length);
    for (let v = u.length - 1; v > 0; v--) {
      const w = Math.floor(Math.random() * (v + 1));
      [u[v], u[w]] = [u[w], u[v]];
    }
    return this.data.candidates = u.slice(0, y), this.data.candidates;
  }
  acceptCandidate(s) {
    if (!this.data.candidates.includes(s)) return { ok: !1, reason: "不是候选干员" };
    const a = hs[this.data.buildings.barracks] ?? 8;
    return this.liveOperators().length >= a ? { ok: !1, reason: "军营名额已满" } : (this.data.roster.push({ id: s, level: 1, exp: 0, stress: 0, agony: !1, virtue: null, dead: !1, maxEquipSlots: 1, equipped: [] }), this.data.candidates = this.data.candidates.filter((u) => u !== s), this.data.recruitDay = this.data.day, { ok: !0 });
  }
  /** 今天是否已招募过干员：招募过则天灾信使当天不能再刷新候选（换天后自动恢复） */
  hasRecruitedToday() {
    return this.data.recruitDay === this.data.day;
  }
  /** 压力增加（按等级/建筑/折磨修正；>=100 判定美德/折磨；>=200 压力爆炸死亡） */
  addStress(s, a) {
    if (s.dead || s.agony) return;
    let u = a;
    if (s.level >= 2 && (u *= 0.9), s.agony && (u *= 1 + 0.2), s.stress = Math.min(ps.max, s.stress + u), s.stress >= Ne.deathAt)
      this.explodeStress(s);
    else if (s.stress >= Ne.stressAt) {
      const y = lr();
      y === "agony" ? (s.agony = !0, this.applyUnityEvent("operatorAgony")) : (s.virtue = y, s.stress = 0);
    }
  }
  /**
   * 通用压力增减接口（按干员 id）。
   * delta>0 走 addStress 的美德/折磨/爆炸判定；delta<0 直接减压（回落到阈值下可解除折磨）。
   * @returns 结算后的压力值；干员不存在返回 undefined。
   */
  changeStress(s, a) {
    const u = this.roster(s);
    if (u)
      return u.dead || (a >= 0 ? this.addStress(u, a) : (u.stress = Math.max(0, u.stress + a), u.agony && u.stress < Ne.stressAt && (u.agony = !1))), u.stress;
  }
  /**
   * 压力爆炸死亡（对外预留的独立死亡通道接口）。
   * 达到压力上限即调用；也可由外部剧情/事件直接触发。记录死因为 "stress"。
   */
  explodeStress(s) {
    s.dead || (s.dead = !0, s.death = {
      cause: "stress",
      day: this.data.day,
      dungeonId: this.data.run?.dungeonId ?? null,
      level: s.level,
      stress: s.stress,
      killerId: null,
      killerFaction: null
    }, this.applyUnityEvent("operatorPermanentDeath"));
  }
  addExp(s, a) {
    s.exp += a;
    for (const u of ar)
      s.exp >= u.exp && s.level < u.level && (s.level = u.level);
    s.level >= 2 && s.maxEquipSlots < 2 && (s.maxEquipSlots = 2);
  }
  /**
   * 标记阵亡并冻结死亡档案。
   * @param killer 击杀来源；提供则记为战斗死亡（含阵营），省略则记为「意外死亡」（无来源）。
   */
  markOperatorDead(s, a) {
    const u = this.roster(s);
    u && !u.dead && (u.dead = !0, u.death = {
      cause: a ? "combat" : "accident",
      day: this.data.day,
      dungeonId: this.data.run?.dungeonId ?? null,
      level: u.level,
      stress: u.stress,
      killerId: a ? a.id : null,
      killerFaction: a ? a.faction : null
    }, this.applyUnityEvent("operatorPermanentDeath"));
  }
  // ---------- 副本进行态 ----------
  /** 进入副本：把进行态挂到存档（跨真实对局持久化），返回该 run 供 UI 使用 */
  beginRun(s, a, u, y) {
    br();
    const v = {};
    for (const M of a) {
      const P = this.roster(M);
      P && (v[M] = { level: P.level, exp: P.exp, stress: P.stress, hp: u[M] ?? 0 });
    }
    const w = {};
    for (const M of ht) {
      const P = this.data.inventory[M.id] ?? 0;
      P > 0 && (w[M.id] = P);
    }
    const k = {
      dungeonId: s.dungeonId,
      difficulty: s.difficulty,
      layout: s,
      cur: s.entry,
      party: [...a],
      hp: u,
      maxHp: { ...y ?? u },
      actions: 0,
      feedReadyAt: 0,
      pendingBattle: null,
      loot: We(),
      startConsumables: w,
      snapshot: v,
      settleWin: null
    };
    return this.data.run = k, this.data.phase = "dungeon", k;
  }
  /** 撤离 / 副本结束：清进行态，回营地 */
  clearRun() {
    this.data.run = null, this.data.phase = "camp";
  }
  /** 本次远征是否已结束（胜/负已判定，等结算页确认） */
  pendingSettlement() {
    return this.data.run?.settleWin != null;
  }
  /**
   * 结束本次远征的判定入口：只打标记、不改数据，真正入账/丢弃由结算页确认后调 finishRun。
   * 战斗失败与主动撤退都走 win=false（撤退按讨伐失败算，用户口径）。
   */
  requestSettlement(s) {
    this.data.run && (this.data.run.settleWin = s);
  }
  /**
   * 推进一次行动（每经过一个通路/驻扎点 +1）。
   * 粮草经济：行动数每满 ACTION_TO_RATION(10) 触发一次进食——在场每名干员各消耗 1 粮草；
   * 缺粮则该干员承受「压力 +starveStress / 团结 -0.2 / 体力 -starveHpLoss」，体力归 0 视为意外阵亡并移出小队。
   * @returns 供 UI 组装提示的本次结算摘要。
   */
  advanceAction() {
    const s = this.data.run;
    if (!s) return { actions: 0, consumed: 0, starved: [], died: [] };
    s.actions++;
    let a = 0;
    const u = [], y = [];
    if (s.actions % tn === 0)
      for (const v of [...s.party]) {
        const w = this.roster(v);
        if (!(!w || w.dead)) {
          if (this.consumeItem("provision", 1)) {
            a++;
            continue;
          }
          u.push(v), this.changeStress(v, Mn.starveStress), this.applyUnityEvent("starvation"), s.hp[v] = (s.hp[v] ?? 0) - Mn.starveHpLoss, (s.hp[v] ?? 0) <= 0 && (this.markOperatorDead(v), s.party.remove(v), y.push(v));
        }
      }
    return { actions: s.actions, consumed: a, starved: u, died: y };
  }
  /**
   * 主动投喂：消耗 1 粮草给 1 名在场干员 +1 体力（封顶 maxHp），受 feedGap 行动冷却限制。
   */
  feedOperator(s) {
    const a = this.data.run;
    if (!a) return { ok: !1, reason: "不在副本中" };
    const u = this.roster(s);
    if (!u || u.dead || !a.party.includes(s)) return { ok: !1, reason: "干员不在队中" };
    if ((this.data.inventory.provision ?? 0) < 1) return { ok: !1, reason: "没有粮草" };
    if (a.actions < a.feedReadyAt) return { ok: !1, reason: `投喂冷却中（还需 ${a.feedReadyAt - a.actions} 次行动）` };
    const y = a.hp[s] ?? 0, v = a.maxHp[s];
    if (v != null && y >= v) return { ok: !1, reason: "体力已满" };
    this.consumeItem("provision", 1);
    const w = y + 1;
    return a.hp[s] = v != null && w > v ? v : w, a.feedReadyAt = a.actions + Mn.feedGap, { ok: !0 };
  }
  // ---------- 节点事件（障碍 / 宝箱）：当场 roll 进 run.loot，结算页确认后才入账 ----------
  /** 把一次掉落并入本次远征的暂存战利品（撤退/完成时才入背包与仓库） */
  addLoot(s) {
    const a = this.data.run;
    !a || Sr(s) || Ui(a.loot, s);
  }
  /** 当前所在节点 */
  curNode() {
    const s = this.data.run;
    return s?.layout.nodes.find((a) => a.index === s.cur);
  }
  node(s) {
    return this.data.run?.layout.nodes.find((a) => a.index === s);
  }
  /**
   * 铲除障碍：不给任何东西，只是把路打开（用户口径）。
   *  - `supply`：消耗 1 个后勤小队；
   *  - `force` ：在场每名干员失去 1 点体力并 +12 压力（体力归零即阵亡离队）。
   * 放弃交互不走这里——那样节点保持 cleared=false，依旧不可通行。
   */
  clearObstacle(s, a) {
    const u = this.data.run, y = this.node(s);
    if (!u || !y) return { ok: !1, reason: "不在副本中" };
    if (y.event !== "obstacle") return { ok: !1, reason: "这里没有障碍" };
    if (y.cleared) return { ok: !1, reason: "障碍已经清开了" };
    const v = [];
    if (a === "supply") {
      if (!this.consumeItem("supply", tt.supplyCost)) return { ok: !1, reason: `后勤小队不足（需要 ${tt.supplyCost} 个）` };
    } else {
      if (!u.party.length) return { ok: !1, reason: "没有干员能干活" };
      for (const w of [...u.party])
        u.hp[w] = (u.hp[w] ?? 0) - tt.hpLoss, this.changeStress(w, tt.stress), (u.hp[w] ?? 0) <= 0 && (this.markOperatorDead(w), u.party.remove(w), v.push(w));
    }
    return y.cleared = !0, y.explored = !0, { ok: !0, died: v };
  }
  /**
   * 开宝箱：消耗 1 个后勤小队，掉落当场 roll 进暂存战利品（不进背包）。
   * 不想花小队的玩家走 dismissNode()——不消耗、无奖励，但节点照常通过。
   */
  openTreasure(s) {
    const a = this.data.run, u = this.node(s);
    if (!a || !u) return { ok: !1, reason: "不在副本中" };
    if (u.event !== "treasure") return { ok: !1, reason: "这里没有宝箱" };
    if (u.cleared) return { ok: !1, reason: "箱子已经开过了" };
    if (!this.consumeItem("supply", jn.supplyCost)) return { ok: !1, reason: `后勤小队不足（需要 ${jn.supplyCost} 个）` };
    const y = Ir(a.difficulty);
    return u.cleared = !0, u.explored = !0, u.decided = !0, this.addLoot(y), { ok: !0, loot: y };
  }
  /** 放弃本次节点交互：不消耗任何东西；宝箱视作路过，障碍则继续堵着 */
  dismissNode(s) {
    const a = this.node(s);
    a && (a.decided = !0, a.explored = !0);
  }
  /** 战利品入背包：受堆叠上限与新占格限制，返回实际入账数量（差额即为丢弃量） */
  addLootItem(s, a) {
    const u = Ye.find((w) => w.id === s);
    if (!u || a <= 0) return 0;
    const y = this.data.inventory[s] ?? 0;
    if (y === 0 && this.freeBackpackSlots() <= 0) return 0;
    const v = Math.min(a, u.maxStack - y);
    return v > 0 && (this.data.inventory[s] = y + v), Math.max(0, v);
  }
  /**
   * 结算页预览（纯读、不改状态）：本次远征能带回什么、消耗品能回收多少源石碇。
   * 与 finishRun 的口径保持一致：回收量按「战利品入账后」的持有权重算，避免预览与实际不符。
   */
  settlePreview() {
    const s = this.data.run, a = s?.loot ?? We(), u = (s?.party.length ?? 0) > 0, y = [];
    let v = 0;
    if (s && u)
      for (const [w, k] of Object.entries(s.startConsumables)) {
        const M = (this.data.inventory[w] ?? 0) + (a.items[w] ?? 0), P = Math.min(k, M);
        if (P <= 0) continue;
        const T = Ye.find((A) => A.id === w);
        y.push({ id: w, name: T?.name ?? w, count: P }), v += P;
      }
    return { carried: u, loot: a, recycle: y, recycled: v, refund: v * Pt };
  }
  /**
   * 结束远征并落库（结算页确认后调用）：
   *  - 有存活随队干员 → 战利品入账（消耗品/兑换物进背包、装备进全局仓库、局内源石碇按 1:1 变现），
   *    出发前购买的消耗品按 CONSUMABLE_RECYCLE_PRICE 逐个回收；
   *  - 全员阵亡 → 战利品与随身消耗品全部丢弃（暗黑地牢口径）。
   * 随后走 settleMission（团结度 / 兑换物自动兑换 / 进入第二天）并清空进行态。
   */
  finishRun() {
    const s = this.data.run, a = s?.settleWin === !0;
    if (!s) return { win: a, carried: !1, gained: We(), lost: We(), recycled: { count: 0, originite: 0 } };
    const u = s.party.length > 0, y = We(), v = We(), w = { count: 0, originite: 0 };
    if (u) {
      for (const [k, M] of Object.entries(s.loot.items)) {
        if (M <= 0) continue;
        if (k === "originite") {
          this.data.originite += M, y.items[k] = M;
          continue;
        }
        const P = this.addLootItem(k, M);
        P > 0 && (y.items[k] = P), P < M && (v.items[k] = (v.items[k] ?? 0) + (M - P));
      }
      y.equips.push(...s.loot.equips), this.data.ownedEquips.push(...s.loot.equips), s.loot.originite > 0 && (this.data.originite += s.loot.originite, y.originite = s.loot.originite);
      for (const [k, M] of Object.entries(s.startConsumables)) {
        const P = this.data.inventory[k] ?? 0, T = Math.min(M, P);
        if (T <= 0) continue;
        const A = P - T;
        A > 0 ? this.data.inventory[k] = A : delete this.data.inventory[k], w.count += T, w.originite += T * Pt;
      }
      this.data.originite += w.originite;
    } else {
      Ui(v, s.loot);
      for (const k of Object.keys(s.startConsumables)) delete this.data.inventory[k];
    }
    if (a && (this.addDungeonExp(s.dungeonId, Nn[s.difficulty].gainExp), s.layout.nodes.find((M) => M.event === "boss")?.cleared)) {
      const M = this.data.dungeonProgress[s.dungeonId];
      M && !M.bossSlain.includes(s.difficulty) && M.bossSlain.push(s.difficulty), Bn(s.dungeonId)?.isSpecial && this.winGame();
    }
    return this.settleMission(a), this.clearRun(), { win: a, carried: u, gained: y, lost: v, recycled: w };
  }
  /**
   * 应用一场真实对局的结果（战斗系统回调入口）。
   * @param win       是否击杀了全部敌方（判定通过）
   * @param finalHp   我方各干员最终体力（id→hp，<=0 视为阵亡）
   * @param nodeIndex 触发本场战斗的节点 index
   * @param deaths    阵亡归因：干员 id → 击杀者（阵营 + 角色 id）。缺省则按「意外死亡」记录。
   * @param kills     我方各干员击杀数（干员 id → 击杀敌人数）：驱动 1 级「击杀减压力」。
   *
   * 规则：血量在本副本内跨节点不重置（写入 run.hp）；我方阵亡者移出小队并进墓地
   * （markOperatorDead，墓地成员不再进招募候选）；胜利=节点通过，失败=不通过并进入第二天。
   * 结算：1 级效果——每名干员按击杀数减压（击杀 ×3，胜败都算）；胜利——全体存活随队干员 +2 经验。
   * @param loot 本场战斗的掉落（简报页已 roll 过就传进来，保证展示与入账一致；缺省则此处现 roll）
   */
  applyBattleResult(s, a, u, y, v, w) {
    const k = this.data.run, M = [];
    if (!k) return { win: s, deaths: M, ended: !1 };
    for (const P of k.party) {
      const T = a[P];
      T != null && (k.hp[P] = Math.max(0, Math.floor(T)));
    }
    if (v)
      for (const [P, T] of Object.entries(v))
        T > 0 && this.changeStress(P, -3 * T);
    for (const P of [...k.party])
      (k.hp[P] ?? 0) <= 0 && (this.markOperatorDead(P, y?.[P]), k.party.remove(P), M.push(P));
    if (s) {
      for (const T of k.party) {
        const A = this.roster(T);
        A && this.addExp(A, 2);
      }
      const P = k.layout.nodes.find((T) => T.index === u);
      P && (P.hasEnemy = !1, P.cleared = !0, P.explored = !0), k.pendingBattle = null, this.data.missionResult.win++, this.applyUnityEvent("missionSuccess"), this.addLoot(w ?? Ss(!0, k.difficulty));
    } else
      k.pendingBattle = null, this.requestSettlement(!1);
    return k.party.length || this.requestSettlement(!1), { win: s, deaths: M, ended: k.settleWin != null };
  }
  // ---------- 背包 ----------
  addItem(s, a) {
    const u = Ye.find((y) => y.id === s);
    this.data.inventory[s] = Math.min(u.maxStack, (this.data.inventory[s] ?? 0) + a);
  }
  consumeItem(s, a = 1) {
    return (this.data.inventory[s] ?? 0) < a ? !1 : (this.data.inventory[s] -= a, !0);
  }
  // ---------- 商店 / 装备（Phase A：货架购买 + 装备选取；战斗施加在 Phase C） ----------
  /** 商人等级（建筑 merchant，初始 1） */
  merchantLevel() {
    return Math.max(1, this.data.buildings.merchant ?? 1);
  }
  /** 装备折后价（局外源石碇） */
  equipPrice(s) {
    const a = Ae(s);
    return a ? gr(a.price, fr(this.merchantLevel())) : 0;
  }
  /** 进入商店时确保库存对应当天：跨天则重 roll 库存并按商人等级重置当日刷新次数 */
  ensureShopToday() {
    const s = this.data.shop;
    s.day === this.data.day && s.stock.length || (s.day = this.data.day, s.stock = Bi(), s.refreshLeft = hr(this.merchantLevel()));
  }
  /** 刷新商人库存（消耗一次当日刷新次数） */
  refreshShop() {
    this.ensureShopToday();
    const s = this.data.shop;
    return s.refreshLeft <= 0 ? { ok: !1, reason: "今日刷新次数已用完" } : (s.refreshLeft--, s.stock = Bi(), { ok: !0 });
  }
  /** 购买消耗品（固定货架，可反复买）：校验余额 + 背包格（新类型才占格） */
  purchaseConsumable(s, a = 1) {
    const u = ht.find((k) => k.id === s), y = Ye.find((k) => k.id === s);
    if (!u || !y) return { ok: !1, reason: "商品不存在" };
    if (a <= 0) return { ok: !1, reason: "数量需大于 0" };
    const v = this.data.inventory[s] ?? 0;
    if (v + a > y.maxStack) return { ok: !1, reason: `已达堆叠上限 ${y.maxStack}` };
    if (v === 0 && this.freeBackpackSlots() <= 0) return { ok: !1, reason: "背包已满" };
    const w = u.price * a;
    return this.data.originite < w ? { ok: !1, reason: "源石碇不足" } : (this.data.originite -= w, this.data.inventory[s] = v + a, { ok: !0 });
  }
  /** 出售消耗品（战前补给站原价回购）：按 CONSUMABLE_PRICES 单价退款，扣减库存 */
  sellConsumable(s, a = 1) {
    const u = ht.find((v) => v.id === s);
    if (!u) return { ok: !1, reason: "商品不存在" };
    if (a <= 0) return { ok: !1, reason: "数量需大于 0" };
    const y = this.data.inventory[s] ?? 0;
    return y < a ? { ok: !1, reason: "持有数量不足" } : (this.data.inventory[s] = y - a, this.data.originite += u.price * a, { ok: !0 });
  }
  /** 放弃本次讨伐：把局内背包中所有「可出售消耗品」按原价全额回售、清空。返回出售后退款额（供提示） */
  sellAllConsumables() {
    let s = 0, a = 0;
    for (const u of ht) {
      const y = this.data.inventory[u.id] ?? 0;
      y <= 0 || (a += u.price * y, s += y, delete this.data.inventory[u.id]);
    }
    return a > 0 && (this.data.originite += a), { sold: s, refund: a };
  }
  /** 购买一件库存装备（仅校验余额；装备入全局仓库、不占局内背包），成功从库存移除 */
  purchaseEquipment(s) {
    this.ensureShopToday();
    const a = this.data.shop, u = a.stock[s];
    if (!u || !Ae(u)) return { ok: !1, reason: "该商品已售出" };
    const y = this.equipPrice(u);
    return this.data.originite < y ? { ok: !1, reason: "源石碇不足" } : (this.data.originite -= y, this.data.ownedEquips.push(u), a.stock.splice(s, 1), { ok: !0 });
  }
  /** 把一件已拥有装备穿戴给干员（受 maxEquipSlots 限制；同一装备不可重复穿） */
  equipOp(s, a) {
    const u = this.roster(s);
    return !u || u.dead ? { ok: !1, reason: "干员不存在" } : Ae(a) ? this.data.ownedEquips.includes(a) ? u.equipped.includes(a) ? { ok: !1, reason: "该干员已穿戴" } : u.equipped.length >= u.maxEquipSlots ? { ok: !1, reason: "需要有空置的装备栏" } : (u.equipped.push(a), { ok: !0 }) : { ok: !1, reason: "未拥有该装备" } : { ok: !1, reason: "装备不存在" };
  }
  /** 卸下干员身上的一件装备（回到全局仓库/可用池，不占局内背包） */
  unequipOp(s, a) {
    const u = this.roster(s);
    if (!u) return { ok: !1, reason: "干员不存在" };
    const y = u.equipped.indexOf(a);
    return y < 0 ? { ok: !1, reason: "并未穿戴" } : (u.equipped.splice(y, 1), { ok: !0 });
  }
  /** 干员“可用”装备池：已拥有但未被任何存活干员穿戴的实例（按剩余数量列出） */
  availableEquips() {
    const s = /* @__PURE__ */ new Map();
    for (const u of this.data.ownedEquips) s.set(u, (s.get(u) ?? 0) + 1);
    for (const u of this.data.roster)
      if (!u.dead)
        for (const y of u.equipped) s.set(y, (s.get(y) ?? 0) - 1);
    const a = [];
    for (const [u, y] of s) for (let v = 0; v < y; v++) a.push(u);
    return a;
  }
  /**
   * 汇总某干员已穿戴装备的属性加成为一份 EquipStat（供战斗开局施加）。
   * 仅累加存活/在册干员身上的实例；stressReduce 属战役层压力结算，一并汇总但战斗内不使用。
   */
  equipStatOf(s) {
    const a = this.roster(s), u = { maxHp: 0, hujia: 0, maxHandcard: 0, drawStart: 0, attackExtra: 0, stressReduce: 0 };
    if (a)
      for (const y of a.equipped) {
        const v = Ae(y)?.stat;
        v && (u.maxHp += v.maxHp ?? 0, u.hujia += v.hujia ?? 0, u.maxHandcard += v.maxHandcard ?? 0, u.drawStart += v.drawStart ?? 0, u.attackExtra += v.attackExtra ?? 0, u.stressReduce += v.stressReduce ?? 0);
      }
    return u;
  }
  // ---------- 天/流程 ----------
  /**
   * 进入下一天：每日结算 + 一天结束。
   * 由 finishRun（远征结算页确认）与旧的占位路径调用；
   * 「全员阵亡不带回物资」的规则在 finishRun 的 carryBack 分支里落地。
   */
  advanceDay() {
    this.data.day++, this.dailyBuildingEffects(), this.applyUnityEvent("passDay"), this.data.unity > 100 && this.applyUnityEvent("unityAbove100PerDay"), this.data.phase = "camp", this.checkFail(), this.checkDayLimit();
  }
  /**
   * 任务结算：团结度增减 + 背包兑换物自动换钱 + 进入第二天。
   * win 由 finishRun 给出真实判定（击败 boss 后才允许走完成；撤退一律 false）。
   */
  settleMission(s) {
    s ? (this.applyUnityEvent("missionSuccess"), this.data.missionResult.win++) : (this.applyUnityEvent("missionFail"), this.data.missionResult.fail++);
    for (const a of Ye) {
      const u = this.data.inventory[a.id] ?? 0;
      a.convertAtSettle && u > 0 && (this.data.originite += u * a.convertAtSettle, this.data.inventory[a.id] = 0);
    }
    this.advanceDay();
  }
  /** 添加副本经验（上限 100，用于解锁更高难度） */
  addDungeonExp(s, a) {
    const u = this.data.dungeonProgress[s];
    u && (u.exp = Math.min(vr, u.exp + a));
  }
  /** 通关凯尔希军 → 胜利 */
  winGame() {
    this.data.win = !0, this.data.phase = "camp";
  }
  checkFail() {
    this.data.unity <= Ot.failAt && !this.data.win && (this.data.lose = !0);
  }
  checkDayLimit() {
    this.data.day > fs && !this.data.win && (this.data.lose = !0);
  }
  roster(s) {
    return this.data.roster.find((a) => a.id === s);
  }
}
const qa = (c) => {
  try {
    localStorage.setItem(Vn, JSON.stringify(c));
  } catch (s) {
    console.error("[GloriousIdeal] 存档失败", s);
  }
}, Wn = () => {
  try {
    const c = localStorage.getItem(Vn);
    return c ? JSON.parse(c) : null;
  } catch {
    return null;
  }
}, Os = () => {
  try {
    localStorage.removeItem(Vn);
  } catch {
  }
}, et = 2, ja = 4, f = Zt({
  phase: "title",
  tick: 0,
  ctrl: null,
  pool: [],
  hasSave: !1,
  endText: "",
  endWin: !1,
  layout: null,
  cur: 0,
  party: [],
  selected: [],
  detailId: null,
  dungeonHp: {},
  battling: !1,
  battleReport: null,
  pendingDispatch: null,
  dungeonNotice: "",
  nodeDialog: null,
  initialCandidates: [],
  initialPicked: [],
  initialFreeOpen: !1,
  initialFreePool: []
}), de = () => {
  f.tick++;
}, Ee = {
  UNITY: Ot,
  MAX_DAY: fs,
  BUILDINGS: sn,
  DUNGEONS: Fn,
  DIFFICULTY: Nn,
  SPECIAL_UNLOCK: mr,
  BARRACKS_CAPACITY: hs,
  ITEMS: Ye,
  INVENTORY_SLOTS_BASE: gs
}, qt = (c) => {
  try {
    return fe.character[c]?.maxHp ?? 4;
  } catch {
    return 4;
  }
}, La = (c) => {
  f.pool = c;
}, Ha = (c) => {
  for (let s = c.length - 1; s > 0; s--) {
    const a = Math.floor(Math.random() * (s + 1));
    [c[s], c[a]] = [c[a], c[s]];
  }
  return c;
}, Ps = () => {
  f.hasSave = !!Wn();
};
function gt() {
  f.phase = "title", f.layout = null, f.party = [], f.selected = [], f.detailId = null, f.dungeonHp = {}, f.battling = !1, f.battleReport = null, f.pendingDispatch = null, f.dungeonNotice = "", f.nodeDialog = null, f.initialCandidates = [], f.initialPicked = [], f.initialFreeOpen = !1, f.initialFreePool = [], Ps(), de();
}
function Ds() {
  Os(), f.ctrl = null, As(), f.initialPicked = [], f.initialFreeOpen = !1, f.initialFreePool = [], f.phase = "start", de();
}
function As() {
  f.initialCandidates = Ha(f.pool).slice(0, ja);
}
function Dn(c) {
  const s = f.initialPicked.indexOf(c);
  s >= 0 ? f.initialPicked.splice(s, 1) : f.initialPicked.length < et && f.initialPicked.push(c), de();
}
function za() {
  f.initialFreeOpen = !f.initialFreeOpen, f.initialFreeOpen && !f.initialFreePool.length && (f.initialFreePool = Na()), de();
}
function Fa() {
  if (f.initialPicked.length !== et) {
    console.warn(`[GloriousIdeal] 请选择 ${et} 名初始干员`);
    return;
  }
  f.ctrl = new Yn(Aa(f.initialPicked.slice())), we(), f.initialCandidates = [], f.initialPicked = [], f.initialFreeOpen = !1, f.initialFreePool = [], it();
}
function Na() {
  const c = [], s = fe.character, a = fe.config.banned ?? [], u = fe.filter;
  for (const y in s) {
    if (!Object.prototype.hasOwnProperty.call(s, y) || y === "unknown" || y === "shadow") continue;
    const v = s[y];
    if (!(!v || typeof v != "object") && !(v.isBoss || v.isHiddenBoss || v.isMinskin || v.isUnseen || v.isHiddenInStoneMode) && !a.includes(y) && !(!Array.isArray(v) && v.hp == null && v.maxHp == null)) {
      try {
        if (u.characterDisabled?.(y) || u.characterDisabled2?.(y)) continue;
      } catch {
      }
      c.push(y);
    }
  }
  return c;
}
function Ba() {
  const c = Wn();
  if (!c) return gt();
  f.ctrl = new Yn(c), it();
}
function it() {
  const c = f.ctrl;
  if (!c) return gt();
  if (c.data.win) return ts(!0, "已通关凯尔希军！卡兹戴尔迎来瑰丽理想。");
  if (c.data.lose) return ts(!1, "团结度归零或超出时限，旅程失败。");
  f.phase = "camp", de();
}
function Zi() {
  f.ctrl && !f.ctrl.data.candidates.length && f.pool.length && f.ctrl.rollCandidates(f.pool), f.phase = "recruit", de();
}
function Ua() {
  f.phase = "dispatch", f.selected = [], f.pendingDispatch = null, de();
}
function Ga(c, s, a) {
  if (f.ctrl) {
    if (!c.length) {
      console.warn("[GloriousIdeal] 请先选择出战干员（1~3 名）");
      return;
    }
    f.pendingDispatch = { party: c.slice(), dungeonId: s, difficulty: a }, f.phase = "supply", de();
  }
}
function Va() {
  f.phase === "supply" && f.ctrl?.sellAllConsumables(), f.phase = "dispatch", we(), de();
}
function es() {
  f.phase = "graveyard", de();
}
function Ya() {
  if (!f.ctrl) return gt();
  f.ctrl.ensureShopToday(), f.phase = "shop", de();
}
function Wa(c, s = 1) {
  const a = f.ctrl?.purchaseConsumable(c, s) ?? { ok: !1, reason: "无战役" };
  return a.ok && (we(), de()), a;
}
function Xa(c, s = 1) {
  const a = f.ctrl?.sellConsumable(c, s) ?? { ok: !1, reason: "无战役" };
  return a.ok && (we(), de()), a;
}
function Ka(c) {
  const s = f.ctrl?.purchaseEquipment(c) ?? { ok: !1, reason: "无战役" };
  return s.ok && (we(), de()), s;
}
function Ja() {
  const c = f.ctrl?.refreshShop() ?? { ok: !1, reason: "无战役" };
  return c.ok && (we(), de()), c;
}
function Qa(c, s) {
  const a = f.ctrl?.equipOp(c, s) ?? { ok: !1, reason: "无战役" };
  return a.ok && (we(), de()), a;
}
function Za(c, s) {
  const a = f.ctrl?.unequipOp(c, s) ?? { ok: !1, reason: "无战役" };
  return a.ok && (we(), de()), a;
}
function el(c, s, a) {
  if (!f.ctrl) return;
  let u = f.pendingDispatch;
  if (!u) return;
  f.pendingDispatch = null;
  const y = $a(u.dungeonId, u.difficulty), v = Object.fromEntries(u.party.map((w) => [w, qt(w)]));
  f.ctrl.beginRun(y, u.party, v, { ...v }), we(), f.layout = y, f.party = u.party.slice(), f.cur = y.entry, f.dungeonHp = v, f.dungeonNotice = "", f.nodeDialog = null, f.phase = "dungeon", de();
}
function tl() {
  const c = f.ctrl?.data.run;
  return c ? (f.layout = c.layout, f.party = c.party.slice(), f.cur = c.cur, f.dungeonHp = { ...c.hp }, f.phase = c.settleWin == null ? "dungeon" : "settle", de(), !0) : !1;
}
function Rs() {
  we(), it();
}
function nl() {
  const c = Wn();
  if (!c) {
    gt();
    return;
  }
  f.ctrl = new Yn(c), !(f.ctrl.data.run && tl()) && it();
}
function il() {
  Os(), f.ctrl = null, gt();
}
const we = () => {
  f.ctrl && qa(f.ctrl.data);
};
function ts(c, s) {
  f.endWin = c, f.endText = s, f.phase = "end", de();
}
function sl(c) {
  f.ctrl && (f.ctrl.upgradeBuilding(c), we(), de());
}
function ns() {
  if (f.ctrl) {
    if (f.ctrl.hasRecruitedToday()) {
      console.warn("[GloriousIdeal] 今日已招募，天灾信使暂不提供刷新");
      return;
    }
    f.ctrl.data.candidates = [], f.ctrl.rollCandidates(f.pool), de();
  }
}
function ol(c) {
  if (f.ctrl) {
    const s = f.ctrl.acceptCandidate(c);
    s.ok || console.warn("[GloriousIdeal] 招募失败：", s.reason), we(), de();
  }
}
const rl = (c) => {
  f.selected.includes(c) ? f.selected = f.selected.filter((s) => s !== c) : f.selected.length < 3 && (f.selected = [...f.selected, c]), de();
}, qs = (c) => {
  f.detailId = c;
}, al = () => {
  f.detailId = null;
}, ll = (c) => {
  const s = [];
  return c.consumed > 0 && s.push(`🍞 小队进食，消耗 ${c.consumed} 粮草`), c.starved.length > 0 && s.push(`⚠ 缺粮：${c.starved.map(Ie).join("、")}（压力↑·体力流失）`), c.died.length > 0 && s.push(`💀 因缺粮倒下：${c.died.map(Ie).join("、")}`), s.join("　");
};
async function cl(c) {
  if (!f.ctrl || !f.layout) return;
  const s = f.ctrl.data.run, a = f.layout.nodes.find((v) => v.index === c);
  if (!a) return;
  const u = f.layout.nodes.find((v) => v.index === f.cur);
  if (u && nn(u)) return;
  const y = f.ctrl.advanceAction();
  if ((y.consumed || y.starved.length) && (f.dungeonNotice = ll(y)), s && (f.dungeonHp = { ...s.hp }, f.party = s.party.slice()), we(), de(), a.kind === "outpost" && a.hasEnemy) {
    const v = { ...f.dungeonHp }, w = f.party.slice(), k = Object.fromEntries(w.map((A) => [A, f.ctrl?.data.roster.find((G) => G.id === A)?.level ?? 1])), M = Object.fromEntries(w.map((A) => [A, f.ctrl?.equipStatOf(A) ?? {}])), P = Object.fromEntries(w.map((A) => [A, [...f.ctrl?.data.roster.find((G) => G.id === A)?.equipped ?? []]]));
    f.battling = !0, de();
    let T;
    try {
      const { startBattle: A } = await import("./GloriousIdeal-battleHost.js");
      T = await A({
        dungeonId: f.layout.dungeonId,
        nodeIndex: c,
        party: w,
        allyHp: v,
        allyLevel: k,
        allyEquip: M,
        allyEquips: P
      });
    } finally {
      f.battling = !1;
    }
    f.battleReport = { result: T, preHp: v, party: w, loot: Ss(T.win, f.layout.difficulty) }, de();
    return;
  }
  a.explored = !0, f.cur = c, s && (s.cur = c, s.hp = { ...f.dungeonHp }, we()), Ms(a) && !a.cleared && !a.decided && (f.nodeDialog = c), de();
}
function js() {
  const c = f.layout;
  if (!c) return !1;
  const s = c.nodes.find((a) => a.index === f.cur);
  return !s || !Ms(s) || s.cleared ? !1 : s.event === "obstacle" || !s.decided;
}
function dl() {
  js() && (f.nodeDialog = f.cur, de());
}
function is(c, s) {
  if (!f.ctrl) return { ok: !1, reason: "无战役" };
  const a = f.ctrl.clearObstacle(c, s);
  if (a.ok) {
    const u = f.ctrl.data.run;
    u && (f.dungeonHp = { ...u.hp }, f.party = u.party.slice(), u.party.length || rn(!1)), f.dungeonNotice = a.died?.length ? `💀 铲除障碍时倒下：${a.died.map(Ie).join("、")}` : "🪨 障碍已铲除，路通了", f.nodeDialog = null, we(), de();
  }
  return a;
}
function ul(c) {
  if (!f.ctrl) return { ok: !1, reason: "无战役" };
  const s = f.ctrl.openTreasure(c);
  if (s.ok) {
    const a = pl(s.loot);
    f.dungeonNotice = a ? `✨ 开箱收获（结算时入账）：${a}` : "✨ 箱子是空的", f.nodeDialog = null, we(), de();
  }
  return s;
}
function ss() {
  const c = f.nodeDialog;
  c == null || !f.ctrl || (f.ctrl.dismissNode(c), f.nodeDialog = null, f.dungeonNotice = "🚶 你没有动它", we(), de());
}
function pl(c) {
  if (!c) return "";
  const s = [];
  for (const [a, u] of Object.entries(c.items))
    u > 0 && s.push(`${jt(a)?.name ?? a}×${u}`);
  for (const a of c.equips) s.push(Ae(a)?.name ?? a);
  return c.originite > 0 && s.push(`源石碇 ${c.originite}`), s.join("、");
}
function rn(c) {
  f.ctrl?.data.run && (f.ctrl.requestSettlement(c), f.nodeDialog = null, f.battleReport = null, f.phase = "settle", we(), de());
}
const fl = () => rn(!1);
function hl() {
  const c = f.layout;
  return c ? !!c.nodes.find((a) => a.event === "boss")?.cleared : !1;
}
const gl = () => rn(!0);
function vl() {
  const c = f.ctrl;
  if (!c?.data.run) {
    f.phase = "camp", it();
    return;
  }
  const s = c.finishRun();
  console.log("[GloriousIdeal] 远征结算", s), f.layout = null, f.dungeonHp = {}, f.dungeonNotice = "", f.nodeDialog = null, f.party = [], we(), it();
}
function ml(c) {
  const s = f.ctrl?.feedOperator(c) ?? { ok: !1, reason: "无战役" };
  if (f.dungeonNotice = s.ok ? "🍞 投喂成功，体力 +1" : s.reason ?? "无法投喂", s.ok) {
    const a = f.ctrl?.data.run;
    a && (f.dungeonHp = { ...a.hp }), we();
  }
  return de(), s;
}
const yl = () => {
  f.dungeonNotice = "";
};
function bl() {
  const c = f.battleReport;
  if (!c || !f.ctrl) return;
  f.battleReport = null;
  const { result: s } = c, a = f.ctrl.applyBattleResult(s.win, s.finalHp, s.nodeIndex, s.deaths, s.kills, c.loot);
  we();
  const u = f.ctrl.data.run;
  if (u) {
    if (f.party = u.party.slice(), f.dungeonHp = { ...u.hp }, a.ended) {
      rn(!1);
      return;
    }
    u.cur = s.nodeIndex, f.cur = s.nodeIndex, de();
  }
}
const _l = { class: "gi-title-screen" }, xl = { class: "gi-feature-grid" }, kl = { class: "gi-feature-icon" }, wl = { class: "gi-feature-title" }, $l = { class: "dim gi-feature-desc" }, Sl = { class: "gi-title-actions" }, El = /* @__PURE__ */ ve({
  __name: "TitleScreen",
  setup(c) {
    const s = [
      { icon: "🏰", title: "经营卡兹戴尔", desc: "修建筑、招干员、攒物资，让营地生生不息" },
      { icon: "⚔", title: "远征五大副本", desc: "维多利亚 · 卡西米尔 · 高卢 · 泰拉 · 凯尔希军" },
      { icon: "⚖", title: "团结与压力", desc: "团结度维系存亡，压力抵 100 触发美德或折磨" },
      { icon: "⏳", title: "100 天倒计时", desc: "在限期内攻略凯尔希军，为卡兹戴尔赢下理想" }
    ];
    return (a, u) => (m(), b("div", _l, [
      u[3] || (u[3] = ds('<div class="gi-title-badge" data-v-0f1f867a>WHICHWAY · 新模式</div><div class="gi-title-rings" aria-hidden="true" data-v-0f1f867a></div><h1 class="gi-title-main" data-v-0f1f867a>特蕾西娅与瑰丽理想</h1><p class="gi-title-en" data-v-0f1f867a>Theresa and the Glorious Ideal</p><p class="gi-title-desc dim" data-v-0f1f867a> 破碎的卡兹戴尔百废待兴。身为特蕾西娅，你将重建营地、统帅干员， <br data-v-0f1f867a>在 <b data-v-0f1f867a>100 天</b>内击破五大联军的围剿，为萨卡兹的明天夺回一份瑰丽理想。 </p>', 5)),
      l("div", xl, [
        (m(), b(ee, null, re(s, (y) => l("div", {
          key: y.title,
          class: "gi-feature"
        }, [
          l("div", kl, x(y.icon), 1),
          l("div", null, [
            l("div", wl, x(y.title), 1),
            l("div", $l, x(y.desc), 1)
          ])
        ])), 64))
      ]),
      l("div", Sl, [
        D(f).hasSave ? (m(), b("button", {
          key: 0,
          class: "gi-btn gi-btn-primary gi-btn-xl",
          onClick: u[0] || (u[0] = (y) => Ba())
        }, " 📜 继续上次旅程 ")) : U("", !0),
        l("button", {
          class: J(["gi-btn gi-btn-xl", D(f).hasSave ? "gi-btn-outline" : "gi-btn-primary"]),
          onClick: u[1] || (u[1] = (y) => Ds())
        }, x(D(f).hasSave ? "⚠ 开启新旅程（覆盖存档）" : "⚔ 开始旅程"), 3),
        l("button", {
          class: "gi-btn gi-btn-ghost gi-btn-xl",
          onClick: u[2] || (u[2] = (y) => D(pe).reload())
        }, "返回主菜单")
      ]),
      u[4] || (u[4] = l("p", { class: "gi-title-foot dim" }, "框架版：营地 / 招募 / 派遣 / 副本流程可跑通，数值与标准对垒战斗为占位", -1))
    ]));
  }
}), Il = /* @__PURE__ */ ye(El, [["__scopeId", "data-v-0f1f867a"]]), Tl = { class: "gi-end-screen" }, Cl = { class: "gi-end-card" }, Ml = { class: "gi-end-text dim" }, Ol = {
  key: 0,
  class: "gi-end-stats"
}, Pl = { class: "gi-end-stat" }, Dl = { class: "gi-end-stat" }, Al = { class: "gi-end-stat" }, Rl = { class: "dim" }, ql = { class: "gi-end-stat" }, jl = { class: "gi-end-actions" }, Ll = /* @__PURE__ */ ve({
  __name: "EndScreen",
  setup(c) {
    return (s, a) => (m(), b("div", Tl, [
      l("div", Cl, [
        l("div", {
          class: J(["gi-end-mark", D(f).endWin ? "win" : "lose"])
        }, x(D(f).endWin ? "🏆" : "🕯"), 3),
        l("h1", {
          class: J(["gi-end-title", D(f).endWin ? "win" : "lose"])
        }, x(D(f).endWin ? "瑰丽理想 · 达成" : "旅程终结"), 3),
        l("p", Ml, x(D(f).endText), 1),
        D(f).ctrl?.data ? (m(), b("div", Ol, [
          l("div", Pl, [
            a[2] || (a[2] = l("span", { class: "dim" }, "历经", -1)),
            l("b", null, x(D(f).ctrl.data.day), 1),
            a[3] || (a[3] = l("span", { class: "dim" }, "天", -1))
          ]),
          l("div", Dl, [
            a[4] || (a[4] = l("span", { class: "dim" }, "团结度", -1)),
            l("b", null, x(Math.round(D(f).ctrl.data.unity)), 1)
          ]),
          l("div", Al, [
            a[5] || (a[5] = l("span", { class: "dim" }, "任务", -1)),
            l("b", null, [
              ue(x(D(f).ctrl.data.missionResult.win), 1),
              l("span", Rl, "胜 / " + x(D(f).ctrl.data.missionResult.fail) + "负", 1)
            ])
          ]),
          l("div", ql, [
            a[6] || (a[6] = l("span", { class: "dim" }, "余存干员", -1)),
            l("b", null, x(D(f).ctrl.liveOperators().length), 1)
          ])
        ])) : U("", !0),
        l("div", jl, [
          l("button", {
            class: "gi-btn gi-btn-primary gi-btn-xl",
            onClick: a[0] || (a[0] = (u) => Ds())
          }, "🔄 重新开始"),
          l("button", {
            class: "gi-btn gi-btn-ghost gi-btn-xl",
            onClick: a[1] || (a[1] = (u) => D(pe).reload())
          }, "返回主菜单")
        ])
      ])
    ]));
  }
}), Hl = /* @__PURE__ */ ye(Ll, [["__scopeId", "data-v-828b4b49"]]), zl = ["src"], Fl = {
  key: 1,
  class: "gi-av-letter"
}, Nl = /* @__PURE__ */ ve({
  __name: "OperatorAvatar",
  props: {
    id: {},
    shape: { default: "circle" },
    dead: { type: Boolean, default: !1 },
    skin: { type: Boolean, default: !1 }
  },
  setup(c) {
    const s = c, a = je(!1), u = X(() => s.skin ? zr(s.id) : Es(s.id)), y = X(() => Ur(s.id));
    return (v, w) => (m(), b("span", {
      class: J(["gi-av", [c.shape === "rounded" ? "is-rounded" : "is-circle", { dead: c.dead }]])
    }, [
      a.value ? (m(), b("span", Fl, x(y.value), 1)) : (m(), b("img", {
        key: 0,
        class: "gi-av-img",
        src: u.value,
        alt: "",
        loading: "lazy",
        onError: w[0] || (w[0] = (k) => a.value = !0)
      }, null, 40, zl)),
      w[1] || (w[1] = l("span", {
        class: "gi-av-ring",
        "aria-hidden": "true"
      }, null, -1))
    ], 2));
  }
}), Xe = /* @__PURE__ */ ye(Nl, [["__scopeId", "data-v-d7a17a43"]]), Bl = ["title"], Ul = ["src"], Gl = ["src"], Vl = ["src"], Yl = ["src"], Wl = { class: "hp-num" }, Xl = ["src"], Kl = { class: "hp-num" }, Jl = /* @__PURE__ */ ve({
  __name: "OperatorHp",
  props: {
    id: {}
  },
  setup(c) {
    const s = c, a = X(() => Yr(s.id)), u = Wr(), y = Xr(), v = Kr(), w = X(() => Math.max(0, Math.round(a.value.hp))), k = X(() => Math.max(0, Math.round(a.value.maxHp - a.value.hp))), M = X(() => Math.max(0, Math.round(a.value.hujia)));
    return (P, T) => (m(), b("div", {
      class: "hp-row",
      title: `体力 ${a.value.hp}/${a.value.maxHp}${M.value ? ` · 护盾 ${a.value.hujia}` : ""}`
    }, [
      a.value.compact ? (m(), b(ee, { key: 1 }, [
        l("img", {
          class: "hp-pip",
          src: D(u),
          alt: ""
        }, null, 8, Yl),
        l("span", Wl, x(a.value.hp) + "/" + x(a.value.maxHp), 1),
        M.value ? (m(), b(ee, { key: 0 }, [
          l("img", {
            class: "hp-pip hp-pip-shield",
            src: D(v),
            alt: ""
          }, null, 8, Xl),
          l("span", Kl, x(a.value.hujia), 1)
        ], 64)) : U("", !0)
      ], 64)) : (m(), b(ee, { key: 0 }, [
        (m(!0), b(ee, null, re(w.value, (A) => (m(), b("img", {
          key: "f" + A,
          class: "hp-pip",
          src: D(u),
          alt: ""
        }, null, 8, Ul))), 128)),
        (m(!0), b(ee, null, re(k.value, (A) => (m(), b("img", {
          key: "e" + A,
          class: "hp-pip",
          src: D(y),
          alt: ""
        }, null, 8, Gl))), 128)),
        (m(!0), b(ee, null, re(M.value, (A) => (m(), b("img", {
          key: "s" + A,
          class: "hp-pip",
          src: D(v),
          alt: ""
        }, null, 8, Vl))), 128))
      ], 64))
    ], 8, Bl));
  }
}), Ql = /* @__PURE__ */ ye(Jl, [["__scopeId", "data-v-0a34dfb5"]]), Zl = { class: "op-left" }, ec = { class: "op-portrait" }, tc = {
  key: 0,
  class: "op-check"
}, nc = { class: "op-name" }, ic = { class: "op-skills" }, sc = { class: "op-skill-name" }, oc = ["innerHTML"], rc = {
  key: 0,
  class: "op-skill-empty dim"
}, ac = /* @__PURE__ */ ve({
  __name: "OperatorCard",
  props: {
    id: {},
    picked: { type: Boolean, default: !1 },
    locked: { type: Boolean, default: !1 },
    showCheck: { type: Boolean, default: !0 }
  },
  emits: ["toggle"],
  setup(c, { emit: s }) {
    const a = c, u = s, y = X(() => Is(a.id)), v = X(() => !a.locked);
    function w() {
      v.value && u("toggle");
    }
    return (k, M) => (m(), b("div", {
      class: J(["op-card", { "is-picked": c.picked, "is-locked": c.locked, "is-clickable": v.value }]),
      onClick: w
    }, [
      l("div", Zl, [
        l("div", ec, [
          ge(Xe, {
            id: c.id,
            shape: "rounded",
            skin: "",
            class: "op-av"
          }, null, 8, ["id"]),
          c.showCheck && c.picked ? (m(), b("div", tc, "✓")) : U("", !0)
        ]),
        l("div", nc, x(D(Ie)(c.id)), 1),
        ge(Ql, {
          class: "op-hp",
          id: c.id
        }, null, 8, ["id"]),
        Zo(k.$slots, "meta", {}, void 0, !0)
      ]),
      l("div", ic, [
        (m(!0), b(ee, null, re(y.value, (P) => (m(), b("div", {
          key: P.id,
          class: "op-skill"
        }, [
          l("div", sc, "【" + x(P.name) + "】", 1),
          P.info ? (m(), b("div", {
            key: 0,
            class: "op-skill-info",
            innerHTML: P.info
          }, null, 8, oc)) : U("", !0)
        ]))), 128)),
        y.value.length ? U("", !0) : (m(), b("p", rc, "无技能数据。"))
      ])
    ], 2));
  }
}), Hn = /* @__PURE__ */ ye(ac, [["__scopeId", "data-v-6288cd9f"]]), lc = { class: "gi-page gi-startsel" }, cc = { class: "gi-startsel-head" }, dc = { class: "gi-sub dim" }, uc = { class: "gi-startsel-count" }, pc = { class: "gi-sec-title" }, fc = {
  key: 0,
  class: "gi-init-grid"
}, hc = {
  key: 1,
  class: "gi-empty-card dim"
}, gc = {
  key: 1,
  class: "gi-free"
}, vc = {
  key: 0,
  class: "gi-free-empty dim"
}, mc = {
  key: 1,
  class: "gi-free-more dim"
}, yc = { class: "gi-startsel-foot" }, bc = { class: "gi-picked-chips" }, _c = ["onClick"], xc = {
  key: 0,
  class: "dim"
}, kc = { class: "gi-startsel-actions" }, wc = ["disabled"], An = 24, $c = /* @__PURE__ */ ve({
  __name: "InitialSelectView",
  setup(c) {
    const s = (P) => f.initialPicked.includes(P), a = () => f.initialPicked.length < et, u = je(""), y = X(() => {
      const P = u.value.trim().toLowerCase(), T = f.initialFreePool;
      return P ? T.filter((A) => A.toLowerCase().includes(P) || Ie(A).toLowerCase().includes(P)) : T;
    }), v = je(An), w = X(() => y.value.slice(0, v.value)), k = X(() => v.value < y.value.length);
    us([u, () => f.initialFreeOpen], () => {
      v.value = An;
    });
    function M(P) {
      const T = P.target;
      k.value && T.scrollTop + T.clientHeight >= T.scrollHeight - 240 && (v.value += An);
    }
    return (P, T) => (m(), b("div", lc, [
      l("div", cc, [
        l("div", null, [
          T[5] || (T[5] = l("h2", { class: "gi-h2" }, "⚔ 选择初始干员", -1)),
          l("p", dc, "从驶舰之向武将中挑选你的第一批同伴 —— 四选二（" + x(D(et)) + " / " + x(D(et)) + "）。", 1)
        ]),
        l("div", uc, [
          T[6] || (T[6] = ue(" 已选 ", -1)),
          l("b", null, x(D(f).initialPicked.length), 1),
          ue(" / " + x(D(et)), 1)
        ])
      ]),
      l("div", pc, [
        l("span", null, x(D(f).initialFreeOpen ? "" : "候选"), 1),
        D(f).initialFreeOpen ? U("", !0) : (m(), b("button", {
          key: 0,
          class: "gi-btn gi-btn-mini",
          onClick: T[0] || (T[0] = (A) => As())
        }, "🎲 换一批")),
        l("button", {
          class: "gi-btn gi-btn-ghost gi-btn-mini gi-free-toggle",
          onClick: T[1] || (T[1] = (A) => za())
        }, x(D(f).initialFreeOpen ? "← 返回四选二" : "🗂 自由选将（含非驶舰之向武将）"), 1)
      ]),
      D(f).initialFreeOpen ? (m(), b("div", gc, [
        er(l("input", {
          "onUpdate:modelValue": T[2] || (T[2] = (A) => u.value = A),
          class: "gi-free-search",
          type: "text",
          placeholder: "搜索武将名 / id…"
        }, null, 512), [
          [tr, u.value]
        ]),
        l("div", {
          class: "gi-free-scroll",
          onScrollPassive: M
        }, [
          (m(!0), b(ee, null, re(w.value, (A) => (m(), Me(Hn, {
            key: A,
            id: A,
            picked: s(A),
            locked: !s(A) && !a(),
            onToggle: (G) => Dn(A)
          }, null, 8, ["id", "picked", "locked", "onToggle"]))), 128)),
          y.value.length ? k.value ? (m(), b("p", mc, "下拉加载更多（已显示 " + x(w.value.length) + " / " + x(y.value.length) + "）", 1)) : U("", !0) : (m(), b("p", vc, "没有匹配的武将。"))
        ], 32)
      ])) : (m(), b(ee, { key: 0 }, [
        D(f).initialCandidates.length ? (m(), b("div", fc, [
          (m(!0), b(ee, null, re(D(f).initialCandidates, (A) => (m(), Me(Hn, {
            key: A,
            id: A,
            picked: s(A),
            locked: !s(A) && !a(),
            onToggle: (G) => Dn(A)
          }, null, 8, ["id", "picked", "locked", "onToggle"]))), 128))
        ])) : (m(), b("div", hc, [...T[7] || (T[7] = [
          l("p", null, "将池为空：无法给出候选（需先启用含干员包的扩展）。", -1)
        ])]))
      ], 64)),
      l("div", yc, [
        l("div", bc, [
          (m(!0), b(ee, null, re(D(f).initialPicked, (A) => (m(), b("span", {
            key: A,
            class: "gi-picked-chip",
            onClick: (G) => Dn(A)
          }, x(D(Ie)(A)) + " ✕ ", 9, _c))), 128)),
          D(f).initialPicked.length ? U("", !0) : (m(), b("span", xc, "尚未选择任何干员"))
        ]),
        l("div", kc, [
          l("button", {
            class: "gi-btn gi-btn-ghost",
            onClick: T[3] || (T[3] = (A) => gt())
          }, "← 返回标题"),
          l("button", {
            class: "gi-btn gi-btn-primary",
            disabled: D(f).initialPicked.length !== D(et),
            onClick: T[4] || (T[4] = (A) => Fa())
          }, " 出发 → ", 8, wc)
        ])
      ])
    ]));
  }
}), Sc = /* @__PURE__ */ ye($c, [["__scopeId", "data-v-6afbc358"]]), Ec = { class: "gi-statusbar" }, Ic = { class: "gi-sb-left" }, Tc = { class: "gi-sb-day" }, Cc = {
  key: 0,
  class: "gi-sb-record dim"
}, Mc = { class: "gi-sb-right" }, Oc = {
  class: "gi-chip",
  title: "源石碇（局外资源）"
}, Pc = {
  class: "gi-chip gi-chip-unity",
  title: "团结度：抵达 0 即失败"
}, Dc = { class: "gi-progress" }, Ac = { class: "dim" }, Rc = /* @__PURE__ */ ve({
  __name: "StatusBar",
  setup(c) {
    const s = () => Math.max(0, Math.min(100, (f.ctrl?.data.unity ?? 0) / Ee.UNITY.max * 100));
    return (a, u) => (m(), b("div", Ec, [
      l("div", Ic, [
        u[2] || (u[2] = l("span", { class: "gi-sb-brand" }, "🏰 卡兹戴尔", -1)),
        u[3] || (u[3] = l("span", { class: "gi-sb-sep" }, null, -1)),
        l("span", Tc, [
          u[1] || (u[1] = ue(" 第 ", -1)),
          l("b", null, x(D(f).ctrl?.data.day ?? "—"), 1),
          ue(" / " + x(D(Ee).MAX_DAY) + " 天 ", 1)
        ]),
        D(f).ctrl?.data.missionResult ? (m(), b("span", Cc, " 任务 " + x(D(f).ctrl.data.missionResult.win) + " 胜 / " + x(D(f).ctrl.data.missionResult.fail) + " 负 ", 1)) : U("", !0)
      ]),
      l("div", Mc, [
        l("span", Oc, "💠 " + x(Math.floor(D(f).ctrl?.data.originite ?? 0)), 1),
        l("span", Pc, [
          u[4] || (u[4] = l("span", { class: "gi-chip-label" }, "团结", -1)),
          l("span", Dc, [
            l("span", {
              class: J(["gi-progress-fill", { "is-low": (D(f).ctrl?.data.unity ?? 0) <= 50 }]),
              style: ze({ width: s() + "%" })
            }, null, 6)
          ]),
          l("b", null, x(Math.round(D(f).ctrl?.data.unity ?? 0)), 1),
          l("span", Ac, "/" + x(D(Ee).UNITY.max), 1)
        ]),
        l("button", {
          class: "gi-btn gi-btn-danger gi-btn-sm",
          title: "放弃当前旅程（清空存档）",
          onClick: u[0] || (u[0] = (y) => il())
        }, " ✕ 结束旅程 ")
      ])
    ]));
  }
}), ut = /* @__PURE__ */ ye(Rc, [["__scopeId", "data-v-fd68b3e7"]]), qc = { class: "gi-party-rail" }, jc = ["onClick"], Lc = { class: "gi-rail-info" }, Hc = { class: "gi-rail-name" }, zc = ["title"], Fc = ["title"], Nc = { class: "gi-rail-hp-bar" }, Bc = { class: "gi-rail-hp-num" }, Uc = ["disabled", "title", "onClick"], Gc = { class: "gi-rail-stats" }, Vc = { class: "gi-rail-lv" }, Yc = { class: "gi-rail-exp" }, Wc = /* @__PURE__ */ ve({
  __name: "PartyRail",
  props: {
    ids: {},
    showHp: { type: Boolean, default: !1 },
    allowFeed: { type: Boolean, default: !1 }
  },
  setup(c) {
    const s = c, a = () => f.ctrl?.data.run ?? null, u = () => f.ctrl?.data.inventory.provision ?? 0, y = (A) => {
      const G = a();
      return G ? A.dead ? { ok: !1, title: "该干员已阵亡" } : A.hp >= A.maxHp ? { ok: !1, title: "体力已满" } : u() < 1 ? { ok: !1, title: "没有粮草" } : G.actions < G.feedReadyAt ? { ok: !1, title: `投喂冷却中（还需 ${G.feedReadyAt - G.actions} 次行动）` } : { ok: !0, title: "投喂：消耗 1 粮草，体力 +1" } : { ok: !1, title: "不在副本中" };
    }, v = (A) => ml(A), w = X(() => {
      const A = f.ctrl?.data.roster || [];
      return s.ids.map((G) => {
        const q = A.find((C) => C.id === G), I = qt(G);
        return {
          id: G,
          level: q?.level ?? 1,
          exp: q?.exp ?? 0,
          stress: q?.stress ?? 0,
          dead: !!q?.dead,
          agony: !!q?.agony,
          hp: f.dungeonHp[G] ?? I,
          maxHp: I
        };
      });
    }), k = (A) => Math.max(0, Math.min(10, Math.ceil(A / 20))), M = (A) => A.maxHp > 0 ? Math.max(0, Math.min(1, A.hp / A.maxHp)) : 0, P = je(null), T = (A) => P.value?.scrollBy({ top: A * 150, behavior: "smooth" });
    return (A, G) => (m(), b("aside", qc, [
      l("button", {
        class: "gi-rail-arrow up",
        title: "上翻",
        onClick: G[0] || (G[0] = (q) => T(-1))
      }, "▲"),
      G[2] || (G[2] = l("div", { class: "gi-rail-head" }, "小队", -1)),
      l("div", {
        class: "gi-rail-list",
        ref_key: "listRef",
        ref: P
      }, [
        (m(!0), b(ee, null, re(w.value, (q) => (m(), b("div", {
          key: q.id,
          class: J(["gi-rail-card", { dead: q.dead, agony: q.agony }]),
          title: "点击查看干员详情",
          onClick: (I) => qs(q.id)
        }, [
          ge(Xe, {
            id: q.id,
            shape: "rounded",
            dead: q.dead,
            class: "gi-rail-av"
          }, null, 8, ["id", "dead"]),
          l("div", Lc, [
            l("div", Hc, x(D(Ie)(q.id)), 1),
            l("div", {
              class: "gi-rail-pips",
              title: `压力 ${Math.round(q.stress)}/200`
            }, [
              (m(), b(ee, null, re(10, (I) => l("i", {
                key: I,
                class: J({ on: I <= k(q.stress) })
              }, null, 2)), 64))
            ], 8, zc),
            c.showHp ? (m(), b("div", {
              key: 0,
              class: "gi-rail-hp",
              title: `体力 ${q.hp}/${q.maxHp}`
            }, [
              l("span", Nc, [
                l("span", {
                  class: "gi-rail-hp-fill",
                  style: ze({ width: M(q) * 100 + "%" })
                }, null, 4)
              ]),
              l("span", Bc, x(q.hp) + "/" + x(q.maxHp), 1),
              c.allowFeed ? (m(), b("button", {
                key: 0,
                class: J(["gi-rail-feed", { ready: y(q).ok }]),
                disabled: !y(q).ok,
                title: y(q).title,
                onClick: dt((I) => v(q.id), ["stop"])
              }, " 🍞 ", 10, Uc)) : U("", !0)
            ], 8, Fc)) : U("", !0),
            l("div", Gc, [
              l("span", Vc, "Lv " + x(q.level), 1),
              l("span", Yc, "✦ " + x(q.exp), 1)
            ])
          ])
        ], 10, jc))), 128))
      ], 512),
      l("button", {
        class: "gi-rail-arrow down",
        title: "下翻",
        onClick: G[1] || (G[1] = (q) => T(1))
      }, "▼")
    ]));
  }
}), Ls = /* @__PURE__ */ ye(Wc, [["__scopeId", "data-v-e3e41651"]]), Xc = { class: "gi-building-head" }, Kc = { class: "gi-building-icon" }, Jc = { class: "gi-building-id" }, Qc = { class: "gi-building-name" }, Zc = {
  key: 0,
  class: "gi-badge ruin"
}, ed = {
  key: 1,
  class: "gi-badge lv"
}, td = {
  key: 0,
  class: "gi-building-lvcap dim"
}, nd = { class: "gi-building-desc dim" }, id = { class: "gi-building-foot" }, sd = {
  key: 0,
  class: "gi-cost"
}, od = {
  key: 1,
  class: "gi-cost"
}, rd = /* @__PURE__ */ ve({
  __name: "BuildingCard",
  props: {
    def: {}
  },
  setup(c) {
    const s = c, a = () => f.ctrl?.data.buildings[s.def.id] ?? s.def.initLevel, u = () => a() < 0, y = () => a() >= s.def.maxLevel, v = () => {
      const k = a();
      return k < 0 ? s.def.cost[0] ?? 0 : k >= s.def.maxLevel ? null : s.def.cost[k] ?? 0;
    }, w = () => u() ? "修建" : y() ? "已满级" : "升级";
    return (k, M) => (m(), b("div", {
      class: J(["gi-building", { ruin: u(), maxed: y() }])
    }, [
      l("div", Xc, [
        l("span", Kc, x(D(Br)(c.def.id)), 1),
        l("div", Jc, [
          l("div", Qc, [
            ue(x(c.def.name) + " ", 1),
            u() ? (m(), b("span", Zc, "废弃")) : (m(), b("span", ed, "Lv." + x(a()), 1))
          ]),
          y() && !u() ? (m(), b("div", td, "已达最高等级")) : U("", !0)
        ])
      ]),
      l("p", nd, x(c.def.desc), 1),
      l("div", id, [
        !u() && !y() ? (m(), b("span", sd, "💠 " + x(v() === 0 ? "免费" : v()), 1)) : u() ? (m(), b("span", od, "💠 " + x(v() === 0 ? "免费" : v()), 1)) : U("", !0),
        y() ? U("", !0) : (m(), b("button", {
          key: 2,
          class: J(["gi-btn gi-btn-sm", u() ? "gi-btn-primary" : ""]),
          onClick: M[0] || (M[0] = (P) => sl(c.def.id))
        }, x(w()), 3))
      ])
    ], 2));
  }
}), ad = /* @__PURE__ */ ye(rd, [["__scopeId", "data-v-cda07fbc"]]), ld = { class: "gi-table gi-roster" }, cd = ["onClick"], dd = { class: "gi-op-name" }, ud = { class: "gi-op-id dim" }, pd = {
  key: 0,
  class: "gi-lv dim"
}, fd = { class: "gi-num" }, hd = {
  key: 0,
  class: "gi-stress"
}, gd = { class: "gi-progress" }, vd = {
  key: 1,
  class: "dim"
}, md = /* @__PURE__ */ ve({
  __name: "RosterTable",
  setup(c) {
    const s = () => [...f.ctrl?.data.roster ?? []].sort((y, v) => Number(y.dead) - Number(v.dead) || v.level - y.level || y.id.localeCompare(v.id)), a = (u) => Math.min(100, Math.max(0, u / 2));
    return (u, y) => (m(), b("table", ld, [
      y[0] || (y[0] = l("thead", null, [
        l("tr", null, [
          l("th", { style: { width: "46px" } }),
          l("th", null, "干员"),
          l("th", { style: { width: "110px" } }, "等级"),
          l("th", { style: { width: "70px" } }, "经验"),
          l("th", { style: { width: "40%" } }, "压力"),
          l("th", { style: { width: "96px" } }, "状态")
        ])
      ], -1)),
      l("tbody", null, [
        (m(!0), b(ee, null, re(s(), (v) => (m(), b("tr", {
          key: v.id,
          class: J({ dead: v.dead }),
          title: "点击查看干员详情",
          onClick: (w) => qs(v.id)
        }, [
          l("td", null, [
            ge(Xe, {
              id: v.id,
              shape: "rounded",
              dead: v.dead,
              class: "gi-roster-av"
            }, null, 8, ["id", "dead"])
          ]),
          l("td", null, [
            l("span", dd, x(D(Ie)(v.id)), 1),
            l("span", ud, x(v.id), 1)
          ]),
          l("td", null, [
            l("span", {
              class: J(["gi-stars", v.dead ? "dim" : ""])
            }, x(D(Un)(v.level)), 3),
            v.dead ? U("", !0) : (m(), b("span", pd, "Lv" + x(v.level), 1))
          ]),
          l("td", fd, x(v.exp), 1),
          l("td", null, [
            v.dead ? (m(), b("span", vd, "—")) : (m(), b("div", hd, [
              l("div", gd, [
                l("div", {
                  class: J(["gi-progress-fill", "stress-" + D(At)(v.stress)]),
                  style: ze({ width: a(v.stress) + "%" })
                }, null, 6)
              ]),
              l("span", {
                class: J(["gi-stress-num", "txt-" + D(At)(v.stress)])
              }, x(Math.round(v.stress)), 3)
            ]))
          ]),
          l("td", null, [
            l("span", {
              class: J(["gi-badge", D(Dt)(v).cls])
            }, x(D(Dt)(v).label), 3)
          ])
        ], 10, cd))), 128))
      ])
    ]));
  }
}), yd = /* @__PURE__ */ ye(md, [["__scopeId", "data-v-abf86641"]]), bd = { class: "gi-page gi-camp" }, _d = { class: "gi-camp-body" }, xd = { class: "gi-camp-main" }, kd = { class: "gi-section" }, wd = { class: "gi-buildings" }, $d = { class: "gi-section" }, Sd = { class: "gi-section-head" }, Ed = { class: "dim gi-hint" }, Id = ["disabled"], Td = {
  key: 0,
  class: "gi-empty dim"
}, Cd = { class: "gi-camp-side" }, Md = { class: "gi-side-card" }, Od = ["disabled"], Pd = { class: "gi-side-card" }, Dd = { class: "gi-brief" }, Ad = { class: "gi-brief-gold" }, Rd = /* @__PURE__ */ ve({
  __name: "CampView",
  setup(c) {
    const s = () => {
      const v = f.ctrl?.data.buildings.barracks ?? 1;
      return Ee.BARRACKS_CAPACITY[v] ?? 8;
    }, a = () => f.ctrl?.liveOperators().length ?? 0, u = () => (f.ctrl?.data.roster ?? []).filter((v) => v.dead).length, y = () => (f.ctrl?.data.roster ?? []).filter((v) => !v.dead).map((v) => v.id);
    return (v, w) => (m(), b("div", bd, [
      ge(ut),
      l("div", _d, [
        l("div", xd, [
          l("section", kd, [
            w[6] || (w[6] = l("div", { class: "gi-section-head" }, [
              l("h2", { class: "gi-h2" }, "卡兹戴尔 · 营地建设"),
              l("span", { class: "dim gi-hint" }, "升级建筑获得每日团结/压力修正")
            ], -1)),
            l("div", wd, [
              (m(!0), b(ee, null, re(D(Ee).BUILDINGS, (k) => (m(), Me(ad, {
                key: k.id,
                def: k
              }, null, 8, ["def"]))), 128))
            ])
          ]),
          l("section", $d, [
            l("div", Sd, [
              w[7] || (w[7] = l("h2", { class: "gi-h2" }, "队伍名册", -1)),
              l("span", Ed, [
                ue(x(a()) + " / " + x(s()) + " 在营 · ", 1),
                l("button", {
                  class: "gi-link",
                  disabled: !u(),
                  onClick: w[0] || (w[0] = (k) => es())
                }, "墓园 " + x(u()) + " 人", 9, Id)
              ])
            ]),
            ge(yd),
            a() ? U("", !0) : (m(), b("p", Td, [
              w[8] || (w[8] = ue("队伍空无一人 —— 先去 ", -1)),
              l("button", {
                class: "gi-link",
                onClick: w[1] || (w[1] = (k) => Zi())
              }, "招募干员"),
              w[9] || (w[9] = ue(" 吧。", -1))
            ]))
          ])
        ]),
        l("aside", Cd, [
          l("div", Md, [
            w[10] || (w[10] = l("h3", { class: "gi-side-title" }, "行动中心", -1)),
            l("button", {
              class: "gi-btn gi-btn-primary gi-btn-block gi-btn-lg",
              onClick: w[2] || (w[2] = (k) => Ua())
            }, " ⚔ 派遣 · 远征副本 "),
            l("button", {
              class: "gi-btn gi-btn-block",
              onClick: w[3] || (w[3] = (k) => Zi())
            }, "🕊 招募干员"),
            l("button", {
              class: "gi-btn gi-btn-block",
              disabled: !u(),
              onClick: w[4] || (w[4] = (k) => es())
            }, "🪦 墓园", 8, Od),
            l("button", {
              class: "gi-btn gi-btn-block",
              onClick: w[5] || (w[5] = (k) => Ya())
            }, "🏪 装备商人 · 砍诺特")
          ]),
          l("div", Pd, [
            w[15] || (w[15] = l("h3", { class: "gi-side-title" }, "局势简报", -1)),
            l("ul", Dd, [
              l("li", null, [
                w[11] || (w[11] = l("span", { class: "dim" }, "队伍", -1)),
                l("b", null, x(a()) + " 名干员", 1)
              ]),
              l("li", null, [
                w[12] || (w[12] = l("span", { class: "dim" }, "墓园", -1)),
                l("b", null, x(u()) + " 人长眠", 1)
              ]),
              w[14] || (w[14] = l("li", null, [
                l("span", { class: "dim" }, "每日"),
                l("b", null, "可出征 1 次小队")
              ], -1)),
              l("li", null, [
                w[13] || (w[13] = l("span", { class: "dim" }, "目标", -1)),
                l("b", Ad, "第 " + x(D(Ee).MAX_DAY) + " 天前通关凯尔希军", 1)
              ])
            ])
          ]),
          w[16] || (w[16] = l("p", { class: "gi-side-note dim" }, " 💡 派遣消耗 1 天行动。派遣归来将推进到次日并结算团结度。 ", -1))
        ])
      ]),
      y().length ? (m(), Me(Ls, {
        key: 0,
        ids: y()
      }, null, 8, ["ids"])) : U("", !0)
    ]));
  }
}), qd = /* @__PURE__ */ ye(Rd, [["__scopeId", "data-v-50975433"]]), jd = { class: "gi-page gi-recruit" }, Ld = { class: "gi-recruit-head" }, Hd = { class: "gi-recruit-cap" }, zd = {
  key: 0,
  class: "gi-badge warn"
}, Fd = { class: "gi-recruit-bar" }, Nd = ["disabled", "title"], Bd = {
  key: 0,
  class: "dim gi-recruit-hint"
}, Ud = {
  key: 0,
  class: "gi-cand-grid"
}, Gd = { class: "dim gi-cand-tip" }, Vd = {
  key: 1,
  class: "gi-empty-card dim"
}, Yd = {
  key: 1,
  class: "dim"
}, Wd = {
  key: 2,
  class: "dim"
}, Xd = { class: "gi-foot-actions" }, Kd = /* @__PURE__ */ ve({
  __name: "RecruitView",
  setup(c) {
    const s = X(() => f.ctrl?.data.candidates ?? []), a = X(() => Ee.BARRACKS_CAPACITY[f.ctrl?.data.buildings.barracks ?? 1] ?? 8), u = X(() => f.ctrl?.liveOperators().length ?? 0), y = X(() => u.value >= a.value), v = X(() => !!f.ctrl && !f.ctrl.hasRecruitedToday());
    return (w, k) => (m(), b("div", jd, [
      ge(ut),
      l("div", Ld, [
        k[4] || (k[4] = l("div", null, [
          l("h2", { class: "gi-h2" }, "🕊 天灾信使 · 招募"),
          l("p", { class: "gi-sub dim" }, "信使每天带来新的旅人。招募免费，但军营容量有限；招募一名后当日不再刷新候选。")
        ], -1)),
        l("div", Hd, [
          k[3] || (k[3] = ue(" 在营 ", -1)),
          l("b", null, x(u.value), 1),
          ue(" / " + x(a.value) + " ", 1),
          y.value ? (m(), b("span", zd, "名额已满")) : U("", !0)
        ])
      ]),
      l("div", Fd, [
        l("button", {
          class: "gi-btn gi-btn-mini",
          disabled: !v.value,
          title: v.value ? "刷新候选干员" : "今日已招募，换天前不能再刷新",
          onClick: k[0] || (k[0] = (M) => ns())
        }, " 🎲 刷新候选 ", 8, Nd),
        v.value ? U("", !0) : (m(), b("span", Bd, "今日已招募过干员，暂时无法刷新"))
      ]),
      s.value.length ? (m(), b("div", Ud, [
        (m(!0), b(ee, null, re(s.value, (M) => (m(), Me(Hn, {
          key: M,
          id: M,
          "show-check": !1,
          locked: y.value,
          onToggle: (P) => ol(M)
        }, {
          meta: nr(() => [
            l("span", Gd, x(y.value ? "名额已满" : "点击卡片招募 · 1 级"), 1)
          ]),
          _: 1
        }, 8, ["id", "locked", "onToggle"]))), 128))
      ])) : (m(), b("div", Vd, [
        k[5] || (k[5] = l("p", null, "今天信使还没有带来候选人。", -1)),
        D(f).pool.length && v.value ? (m(), b("button", {
          key: 0,
          class: "gi-btn",
          onClick: k[1] || (k[1] = (M) => ns())
        }, "🎲 等待信使（刷新候选）")) : D(f).pool.length ? (m(), b("p", Yd, "今日已招募，明天信使会再带来候选人。")) : (m(), b("p", Wd, "将池为空：没有可招募的干员（需先启用含干员包的扩展）。"))
      ])),
      l("div", Xd, [
        l("button", {
          class: "gi-btn gi-btn-ghost",
          onClick: k[2] || (k[2] = (M) => Rs())
        }, "← 返回营地"),
        k[6] || (k[6] = l("span", { class: "dim gi-foot-hint" }, "招募不消耗天数", -1))
      ])
    ]));
  }
}), Jd = /* @__PURE__ */ ye(Kd, [["__scopeId", "data-v-54f266c5"]]), Qd = { class: "gi-page gi-grave" }, Zd = { class: "gi-grave-head" }, eu = {
  key: 0,
  class: "gi-empty dim"
}, tu = {
  key: 1,
  class: "gi-grave-grid"
}, nu = { class: "gi-tomb-top" }, iu = { class: "gi-tomb-id" }, su = { class: "gi-tomb-name" }, ou = { class: "gi-tomb-level dim" }, ru = { class: "gi-tomb-reason" }, au = { class: "gi-tomb-stats" }, lu = { class: "gi-tomb-stat" }, cu = { class: "gi-tomb-stat" }, du = /* @__PURE__ */ ve({
  __name: "GraveyardView",
  setup(c) {
    const s = () => (f.ctrl?.data.roster ?? []).filter((w) => w.dead), a = (w) => {
      const k = f.ctrl?.data.roster.find((M) => M.id === w);
      return k?.death ? ta(k.death) : { label: "无名碑", cls: "dead" };
    }, u = (w) => {
      const k = f.ctrl?.data.roster.find((M) => M.id === w);
      return k?.death ? ea(k.death) : "死因已不可考";
    }, y = (w) => {
      const k = f.ctrl?.data.roster.find((M) => M.id === w);
      return k?.death?.level ?? k?.level ?? 1;
    }, v = (w) => {
      const k = f.ctrl?.data.roster.find((M) => M.id === w);
      return k?.death?.stress ?? k?.stress ?? 0;
    };
    return (w, k) => (m(), b("div", Qd, [
      ge(ut),
      l("div", Zd, [
        k[1] || (k[1] = l("div", null, [
          l("h2", { class: "gi-h2" }, "🪦 墓园 · 长眠者"),
          l("p", { class: "gi-sub dim" }, "他们把理想留在了路上。永不再归来，也永不被遗忘。")
        ], -1)),
        l("button", {
          class: "gi-btn gi-btn-ghost",
          onClick: k[0] || (k[0] = (M) => it())
        }, "← 返回营地")
      ]),
      s().length ? (m(), b("div", tu, [
        (m(!0), b(ee, null, re(s(), (M) => (m(), b("div", {
          key: M.id,
          class: "gi-tomb"
        }, [
          l("div", nu, [
            ge(Xe, {
              id: M.id,
              shape: "rounded",
              dead: "",
              class: "gi-tomb-av"
            }, null, 8, ["id"]),
            l("div", iu, [
              l("div", su, x(D(Ie)(M.id)), 1),
              l("div", ou, x(D(Un)(y(M.id)) || "无等级"), 1)
            ]),
            l("span", {
              class: J(["gi-badge", a(M.id).cls])
            }, x(a(M.id).label), 3)
          ]),
          l("div", ru, x(u(M.id)), 1),
          l("div", au, [
            l("div", lu, [
              k[2] || (k[2] = l("span", { class: "dim" }, "临终等级", -1)),
              l("b", null, x(y(M.id)), 1)
            ]),
            l("div", cu, [
              k[3] || (k[3] = l("span", { class: "dim" }, "临终压力", -1)),
              l("b", {
                class: J(`stress-${D(At)(v(M.id))}`)
              }, x(Math.round(v(M.id))), 3)
            ])
          ])
        ]))), 128))
      ])) : (m(), b("p", eu, "墓园尚空 —— 愿你的名字永远不必刻在这里。"))
    ]));
  }
}), uu = /* @__PURE__ */ ye(du, [["__scopeId", "data-v-b105a42c"]]), pu = { class: "gi-page gi-shop" }, fu = { class: "gi-shop-head" }, hu = {
  key: 0,
  class: "gi-h2"
}, gu = {
  key: 1,
  class: "gi-h2"
}, vu = {
  key: 2,
  class: "gi-sub dim"
}, mu = {
  key: 3,
  class: "gi-sub dim"
}, yu = { class: "gi-shop-meta" }, bu = {
  class: "gi-chip",
  title: "局外源石碇余额"
}, _u = {
  key: 0,
  class: "gi-chip",
  title: "商人等级：影响折扣与每日刷新次数"
}, xu = ["title"], ku = {
  key: 0,
  class: "gi-supply-target"
}, wu = { class: "gi-chip" }, $u = { class: "gi-supply-party dim" }, Su = {
  key: 1,
  class: "gi-shop-tabs"
}, Eu = { class: "dim" }, Iu = ["disabled"], Tu = {
  key: 2,
  class: "gi-shop-notice"
}, Cu = {
  key: 3,
  class: "gi-goods"
}, Mu = { class: "gi-good-top" }, Ou = { class: "gi-good-name" }, Pu = { class: "gi-good-own dim" }, Du = { class: "gi-good-desc dim" }, Au = { class: "gi-good-foot" }, Ru = { class: "gi-price" }, qu = { class: "gi-good-btns" }, ju = ["onClick"], Lu = ["disabled", "title", "onClick"], Hu = {
  key: 4,
  class: "gi-goods"
}, zu = {
  key: 0,
  class: "gi-empty dim"
}, Fu = { class: "gi-good-top" }, Nu = { class: "gi-good-titlerow" }, Bu = { class: "gi-good-name" }, Uu = { class: "gi-good-desc dim" }, Gu = { class: "gi-good-foot" }, Vu = { class: "gi-price" }, Yu = {
  key: 0,
  class: "dim"
}, Wu = ["disabled", "title", "onClick"], Xu = { class: "gi-bag" }, Ku = { class: "gi-bag-title" }, Ju = { class: "dim" }, Qu = { class: "gi-bag-grid" }, Zu = ["title", "onClick"], ep = { class: "gi-bag-name" }, tp = { class: "gi-bag-sub dim" }, np = { class: "gi-bag-sell" }, ip = { class: "gi-bag-name" }, sp = { class: "gi-bag-sub dim" }, op = {
  key: 1,
  class: "gi-bag-empty"
}, rp = {
  key: 0,
  class: "gi-bag-note dim"
}, ap = {
  key: 1,
  class: "gi-bag-note dim"
}, lp = {
  key: 5,
  class: "gi-supply-foot"
}, cp = /* @__PURE__ */ ve({
  __name: "ShopView",
  setup(c) {
    const s = je(""), a = X(() => f.phase === "supply"), u = () => Math.floor(f.ctrl?.data.originite ?? 0), y = () => f.ctrl?.freeBackpackSlots() ?? 0, v = () => f.ctrl?.merchantLevel() ?? 1, w = () => f.ctrl?.data.shop.refreshLeft ?? 0, k = X(() => {
      const z = f.pendingDispatch;
      if (!z) return null;
      const F = Bn(z.dungeonId), R = Ee.DIFFICULTY[z.difficulty];
      return { name: F?.name ?? z.dungeonId, difficulty: R?.name ?? z.difficulty, party: z.party.map(Ie).join("、") };
    }), M = (z) => z === "legendary" ? "warn" : z === "epic" ? "gold" : z === "rare" ? "virtue" : "dead", P = X(() => {
      const z = f.ctrl?.data.inventory ?? {};
      return ht.map((F) => {
        const R = jt(F.id), N = z[F.id] ?? 0, ce = N === 0, E = N >= R.maxStack, $e = u() < F.price, Se = ce && y() <= 0;
        return { id: F.id, name: R.name, desc: R.desc, price: F.price, have: N, maxStack: R.maxStack, disabled: E || $e || Se, canSell: N > 0, reason: E ? `堆叠已满 ${R.maxStack}` : $e ? "源石碇不足" : Se ? "背包已满" : "" };
      });
    }), T = X(() => (f.ctrl?.data.shop.stock ?? []).map((F, R) => {
      const N = Ae(F), ce = f.ctrl ? f.ctrl.equipPrice(F) : 0, E = u() < ce;
      return { index: R, id: F, img: N?.img, name: N?.name ?? F, desc: N?.desc ?? "", rarity: N?.rarity ?? "common", price: ce, base: N?.price ?? ce, disabled: E, reason: E ? "源石碇不足" : "" };
    })), A = X(() => {
      const z = f.ctrl?.backpackSlots() ?? 8, F = [], R = f.ctrl?.data.inventory ?? {};
      for (const ce of Ye) {
        const E = R[ce.id] ?? 0;
        if (E <= 0) continue;
        const $e = ht.find((Se) => Se.id === ce.id);
        F.push({ key: `c_${ce.id}`, id: ce.id, name: ce.name, sub: `×${E}`, price: $e?.price ?? 0, sellable: !!$e });
      }
      const N = F.length;
      for (let ce = N; ce < z; ce++) F.push({ key: `empty_${ce}`, name: "", sub: "", price: 0, sellable: !1 });
      return { cells: F, used: N, total: z };
    }), G = (z) => {
      s.value = z.ok ? "" : z.reason ?? "无法购买";
    }, q = (z) => G(Wa(z, 1)), I = (z) => G(Xa(z, 1)), C = (z) => G(Ka(z)), ie = () => G(Ja()), ae = () => el();
    return (z, F) => (m(), b("div", pu, [
      ge(ut),
      l("div", fu, [
        l("div", null, [
          a.value ? (m(), b("h2", hu, "🛒 战前补给站")) : (m(), b("h2", gu, "🏪 砍诺特 · 装备商人")),
          a.value ? (m(), b("p", vu, "出发前用源石碇为小队备好消耗品。粮草、绷带等可在副本内使用。")) : (m(), b("p", mu, "用源石碇换取装备。库存每日更换，可消耗次数刷新；购买后到「干员详情 → 装备」穿戴。"))
        ]),
        l("div", yu, [
          l("span", bu, "💠 " + x(u()), 1),
          a.value ? U("", !0) : (m(), b("span", _u, "商人 Lv" + x(v()), 1)),
          l("span", {
            class: "gi-chip",
            title: `背包 ${A.value.used}/${A.value.total}（基础 8 + 驼兽等级）`
          }, " 🎒 " + x(A.value.used) + "/" + x(A.value.total), 9, xu),
          a.value ? U("", !0) : (m(), b("button", {
            key: 1,
            class: "gi-btn gi-btn-ghost",
            onClick: F[0] || (F[0] = (R) => it())
          }, "← 返回营地"))
        ])
      ]),
      a.value && k.value ? (m(), b("div", ku, [
        l("span", wu, "🎯 " + x(k.value.name) + " · " + x(k.value.difficulty), 1),
        l("span", $u, "出战：" + x(k.value.party), 1)
      ])) : U("", !0),
      a.value ? U("", !0) : (m(), b("div", Su, [
        F[2] || (F[2] = l("span", { class: "gi-badge lv" }, "今日库存", -1)),
        l("span", Eu, "剩 " + x(w()) + " 次刷新", 1),
        l("button", {
          class: "gi-btn gi-btn-sm gi-btn-outline",
          disabled: w() <= 0,
          onClick: ie
        }, "🎲 刷新库存", 8, Iu)
      ])),
      s.value ? (m(), b("p", Tu, x(s.value), 1)) : U("", !0),
      a.value ? (m(), b("div", Cu, [
        (m(!0), b(ee, null, re(P.value, (R) => (m(), b("div", {
          key: R.id,
          class: "gi-good"
        }, [
          l("div", Mu, [
            l("span", Ou, x(R.name), 1),
            l("span", Pu, "持有 " + x(R.have) + "/" + x(R.maxStack), 1)
          ]),
          l("p", Du, x(R.desc), 1),
          l("div", Au, [
            l("span", Ru, "💠 " + x(R.price), 1),
            l("div", qu, [
              R.canSell ? (m(), b("button", {
                key: 0,
                class: "gi-btn gi-btn-ghost gi-btn-sm",
                title: "原价回购",
                onClick: (N) => I(R.id)
              }, "出售 💠" + x(R.price), 9, ju)) : U("", !0),
              l("button", {
                class: "gi-btn gi-btn-primary gi-btn-sm",
                disabled: R.disabled,
                title: R.reason,
                onClick: (N) => q(R.id)
              }, "购买", 8, Lu)
            ])
          ])
        ]))), 128))
      ])) : (m(), b("div", Hu, [
        T.value.length ? U("", !0) : (m(), b("p", zu, "今日库存已售罄，明天再来。")),
        (m(!0), b(ee, null, re(T.value, (R) => (m(), b("div", {
          key: R.index,
          class: J(["gi-good", "rarity-" + R.rarity])
        }, [
          l("div", Fu, [
            ge(Rt, {
              id: R.id,
              img: R.img,
              size: 40,
              class: "gi-good-icon"
            }, null, 8, ["id", "img"]),
            l("div", Nu, [
              l("span", Bu, x(R.name), 1),
              l("span", {
                class: J(["gi-badge", M(R.rarity)])
              }, x(D(on)[R.rarity]), 3)
            ])
          ]),
          l("p", Uu, x(R.desc), 1),
          l("div", Gu, [
            l("span", Vu, [
              R.price < R.base ? (m(), b("s", Yu, "💠 " + x(R.base), 1)) : U("", !0),
              ue(" 💠 " + x(R.price), 1)
            ]),
            l("button", {
              class: "gi-btn gi-btn-primary gi-btn-sm",
              disabled: R.disabled,
              title: R.reason,
              onClick: (N) => C(R.index)
            }, "购买", 8, Wu)
          ])
        ], 2))), 128))
      ])),
      l("section", Xu, [
        l("h3", Ku, [
          F[3] || (F[3] = ue("🎒 局内背包 ", -1)),
          l("span", Ju, x(A.value.used) + "/" + x(A.value.total), 1)
        ]),
        l("div", Qu, [
          (m(!0), b(ee, null, re(A.value.cells, (R) => (m(), b(ee, {
            key: R.key
          }, [
            a.value && R.sellable ? (m(), b("button", {
              key: 0,
              class: "gi-bag-cell sellable",
              title: `点击出售 1 个（原价 💠${R.price}）`,
              onClick: (N) => I(R.id)
            }, [
              l("span", ep, x(R.name), 1),
              l("span", tp, x(R.sub), 1),
              l("span", np, "出售 💠" + x(R.price), 1)
            ], 8, Zu)) : (m(), b("div", {
              key: 1,
              class: J(["gi-bag-cell", { blank: !R.name }])
            }, [
              R.name ? (m(), b(ee, { key: 0 }, [
                l("span", ip, x(R.name), 1),
                l("span", sp, x(R.sub), 1)
              ], 64)) : (m(), b("span", op, "·"))
            ], 2))
          ], 64))), 128))
        ]),
        a.value ? (m(), b("p", rp, "点击背包中的消耗品即可原价出售（每点一次卖 1 个）；返回上一页会自动出售背包内全部补给。")) : (m(), b("p", ap, "局内背包只放消耗品（每类占一格），在副本内使用。装备存放于全局仓库（无上限），到干员详情穿戴。"))
      ]),
      a.value ? (m(), b("div", lp, [
        l("button", {
          class: "gi-btn gi-btn-ghost",
          onClick: F[1] || (F[1] = (R) => Va())
        }, "← 返回选派"),
        l("button", {
          class: "gi-btn gi-btn-primary",
          onClick: ae
        }, "出发进入副本 →")
      ])) : U("", !0)
    ]));
  }
}), dp = /* @__PURE__ */ ye(cp, [["__scopeId", "data-v-5e77ca30"]]), up = { class: "gi-page gi-dispatch" }, pp = { class: "gi-dispatch-head" }, fp = { class: "gi-dispatch-body" }, hp = { class: "gi-dispatch-main" }, gp = { class: "gi-section" }, vp = { class: "gi-section-head" }, mp = { class: "dim gi-hint" }, yp = {
  key: 0,
  class: "gi-op-grid"
}, bp = ["onClick"], _p = { class: "gi-op-check" }, xp = { class: "gi-op-name" }, kp = { class: "gi-op-tags" }, wp = { class: "gi-tag" }, $p = {
  key: 0,
  class: "gi-tag bad"
}, Sp = {
  key: 1,
  class: "gi-empty dim"
}, Ep = { class: "gi-section" }, Ip = { class: "gi-dun-list" }, Tp = { class: "gi-dun-top" }, Cp = { class: "gi-dun-id" }, Mp = { class: "gi-dun-name" }, Op = {
  key: 0,
  class: "gi-badge gold"
}, Pp = {
  key: 0,
  class: "gi-dun-desc dim"
}, Dp = { class: "gi-dun-exp" }, Ap = { class: "gi-progress gi-progress-sm" }, Rp = { class: "dim" }, qp = { class: "gi-dun-diffs" }, jp = ["disabled", "title", "onClick"], Lp = { class: "gi-btn-sub" }, Hp = { class: "gi-dispatch-side" }, zp = { class: "gi-side-card gi-order" }, Fp = { class: "gi-order-squad" }, Np = { class: "gi-order-info" }, Bp = { class: "dim" }, Up = {
  key: 0,
  class: "dim gi-order-empty"
}, Gp = { class: "gi-order-foot" }, Vp = { class: "dim" }, Yp = /* @__PURE__ */ ve({
  __name: "DispatchView",
  setup(c) {
    const s = () => f.ctrl?.liveOperators() ?? [], a = () => f.selected ?? [], u = () => s().filter((M) => a().includes(M.id)), y = () => 3 - a().length, v = (M, P) => {
      const T = P, A = f.ctrl?.data;
      if (!A) return !1;
      const G = A.dungeonProgress[M], q = G?.exp ?? 0, I = Ee.DIFFICULTY[T], C = Ee.DUNGEONS.find((z) => z.id === M)?.isSpecial, ie = C ? Ee.SPECIAL_UNLOCK[T] : I.needExp, ae = !C && I.needBoss && !(G?.bossSlain ?? []).includes(T);
      return q >= ie && !ae;
    }, w = (M, P) => {
      const T = P, A = Ee.DIFFICULTY[T], G = Ee.DUNGEONS.find((C) => C.id === M)?.isSpecial, I = [`需要副本经验 ${G ? Ee.SPECIAL_UNLOCK[T] : A.needExp}`];
      return !G && A.needBoss && I.push("并击败该难度 BOSS"), `解锁：${I.join("；")}。通关 +${A.gainExp} 副本经验 · ${A.outposts} 个驻扎点`;
    }, k = (M, P) => {
      if (!a().length) {
        console.warn("[GloriousIdeal] 请先选择出战干员（1~3 名）");
        return;
      }
      Ga(a(), M, P);
    };
    return (M, P) => (m(), b("div", up, [
      ge(ut),
      l("div", pp, [
        P[1] || (P[1] = l("div", null, [
          l("h2", { class: "gi-h2" }, "⚔ 远征备战"),
          l("p", { class: "gi-sub dim" }, "每日可出征一次 · 每次 1~3 名干员。干员压力与资源在副本中持续保留。")
        ], -1)),
        l("button", {
          class: "gi-btn gi-btn-ghost",
          onClick: P[0] || (P[0] = (T) => Rs())
        }, "← 返回营地")
      ]),
      l("div", fp, [
        l("div", hp, [
          l("section", gp, [
            l("div", vp, [
              P[2] || (P[2] = l("h3", { class: "gi-h3" }, "① 挑选出战干员", -1)),
              l("span", mp, "已选 " + x(a().length) + " / 3", 1)
            ]),
            s().length ? (m(), b("div", yp, [
              (m(!0), b(ee, null, re(s(), (T) => (m(), b("button", {
                key: T.id,
                class: J(["gi-op", { on: a().includes(T.id), dimed: !a().includes(T.id) && y() <= 0 }]),
                onClick: (A) => rl(T.id)
              }, [
                l("span", _p, x(a().includes(T.id) ? "✓" : ""), 1),
                ge(Xe, {
                  id: T.id,
                  class: "gi-op-avatar"
                }, null, 8, ["id"]),
                l("span", xp, x(D(Ie)(T.id)), 1),
                l("span", kp, [
                  l("span", wp, "Lv" + x(T.level), 1),
                  T.agony ? (m(), b("span", $p, "折磨")) : U("", !0)
                ]),
                l("span", {
                  class: J(["gi-op-stress", "txt-" + (T.stress >= 100 ? "high" : T.stress >= 50 ? "mid" : "low")])
                }, " 压 " + x(Math.round(T.stress)), 3)
              ], 10, bp))), 128))
            ])) : (m(), b("p", Sp, "没有可出战的干员，请先返回营地招募。"))
          ]),
          l("section", Ep, [
            P[3] || (P[3] = l("div", { class: "gi-section-head" }, [
              l("h3", { class: "gi-h3" }, "② 选择讨伐目标"),
              l("span", { class: "dim gi-hint" }, "每个副本需累积副本经验解锁更高难度")
            ], -1)),
            l("div", Ip, [
              (m(!0), b(ee, null, re(D(Ee).DUNGEONS, (T) => (m(), b("div", {
                key: T.id,
                class: "gi-dun"
              }, [
                l("div", Tp, [
                  l("span", {
                    class: J(["gi-dun-icon", { special: T.isSpecial }])
                  }, x(T.isSpecial ? "👑" : "🏰"), 3),
                  l("div", Cp, [
                    l("div", Mp, [
                      ue(x(T.name) + " ", 1),
                      T.isSpecial ? (m(), b("span", Op, "特殊 · 通关即胜利")) : U("", !0)
                    ]),
                    T.desc ? (m(), b("div", Pp, x(T.desc), 1)) : U("", !0),
                    l("div", Dp, [
                      l("span", Ap, [
                        l("span", {
                          class: "gi-progress-fill",
                          style: ze({ width: Math.min(100, D(f).ctrl?.data.dungeonProgress[T.id]?.exp ?? 0) + "%" })
                        }, null, 4)
                      ]),
                      l("span", Rp, "副本经验 " + x(D(f).ctrl?.data.dungeonProgress[T.id]?.exp ?? 0) + "/100", 1)
                    ])
                  ])
                ]),
                l("div", qp, [
                  (m(!0), b(ee, null, re(D(Ee).DIFFICULTY, (A, G) => (m(), b("button", {
                    key: G,
                    class: J(["gi-btn gi-btn-sm", { locked: !v(T.id, G) }]),
                    disabled: !v(T.id, G),
                    title: w(T.id, G),
                    onClick: (q) => k(T.id, G)
                  }, [
                    ue(x(A.name) + " ", 1),
                    l("span", Lp, x(A.outposts) + " 驻点 · +" + x(A.gainExp) + " 经", 1)
                  ], 10, jp))), 128))
                ])
              ]))), 128))
            ])
          ])
        ]),
        l("aside", Hp, [
          l("div", zp, [
            P[4] || (P[4] = l("h3", { class: "gi-side-title" }, "📋 出征集结单", -1)),
            l("div", Fp, [
              (m(!0), b(ee, null, re(u(), (T) => (m(), b("div", {
                key: T.id,
                class: "gi-order-op"
              }, [
                ge(Xe, {
                  id: T.id,
                  shape: "rounded",
                  class: "gi-order-avatar"
                }, null, 8, ["id"]),
                l("div", Np, [
                  l("b", null, x(D(Ie)(T.id)), 1),
                  l("span", Bp, x(D(Dt)(T).label), 1)
                ])
              ]))), 128)),
              a().length ? U("", !0) : (m(), b("p", Up, "尚未选择干员"))
            ]),
            l("div", Gp, [
              l("span", Vp, x(y() > 0 ? `还可选 ${y()} 名` : "小队已满（3/3）"), 1),
              l("span", {
                class: J(["gi-tag gold", { warn: a().some((T) => s().find((A) => A.id === T)?.agony) }])
              }, " 每日 1 次 ", 2)
            ])
          ]),
          P[5] || (P[5] = l("p", { class: "gi-side-note dim" }, [
            ue(" 💡 点击下方副卡上的「副本难度」即出发；"),
            l("br"),
            ue(" 高压力干员出征存在风险，记得先休息恢复。 ")
          ], -1))
        ])
      ])
    ]));
  }
}), Wp = /* @__PURE__ */ ye(Yp, [["__scopeId", "data-v-b337d777"]]), Xp = { class: "gi-page gi-dungeon" }, Kp = {
  key: 0,
  class: "gi-run-head"
}, Jp = { class: "gi-run-title" }, Qp = { class: "gi-h2" }, Zp = { class: "gi-diff-chip" }, ef = { class: "gi-sub dim" }, tf = {
  key: 1,
  class: "gi-run-map"
}, nf = ["viewBox"], sf = ["x1", "y1", "x2", "y2"], of = ["x1", "y1", "x2", "y2"], rf = ["disabled", "title", "onClick"], af = {
  key: 0,
  class: "gi-mnode-flag"
}, lf = { class: "gi-mnode-medal" }, cf = { class: "gi-mnode-icon" }, df = {
  key: 0,
  class: "gi-mnode-tick"
}, uf = {
  key: 2,
  class: "gi-run-notice"
}, pf = { class: "gi-run-actions" }, ff = { class: "gi-run-info" }, hf = { class: "gi-run-hint" }, gf = { class: "gi-economy" }, vf = { class: "gi-eco-chip" }, mf = ["title"], yf = { class: "gi-run-btns" }, bf = {
  class: "gi-ask",
  role: "dialog",
  "aria-modal": "true"
}, _f = { class: "gi-ask-body" }, os = 64, rs = 56, as = 600, xf = /* @__PURE__ */ ve({
  __name: "DungeonView",
  setup(c) {
    const s = () => f.layout, a = () => f.cur, u = () => s()?.nodes.find((S) => S.index === a()), y = (S) => {
      const B = u();
      return !B || nn(B) ? !1 : B.neighbors.includes(S.index) && S.index !== a();
    }, v = () => s() ? Ee.DIFFICULTY[s().difficulty].name : "", w = X(() => {
      const S = f.layout;
      if (!S) return null;
      const B = /* @__PURE__ */ new Map(), W = [S.entry];
      for (B.set(S.entry, 0); W.length; ) {
        const Ce = W.shift();
        for (const he of S.nodes[Ce].neighbors)
          B.has(he) || (B.set(he, B.get(Ce) + 1), W.push(he));
      }
      const ke = Math.max(...B.values()), _e = /* @__PURE__ */ new Map();
      for (const Ce of S.nodes) {
        const he = B.get(Ce.index) ?? 0;
        _e.set(he, [..._e.get(he) ?? [], Ce.index]);
      }
      const Te = /* @__PURE__ */ new Map();
      for (const [Ce, he] of _e) {
        const Be = rs + (ke - Ce) * os, Fe = 100 / (he.length + 1);
        he.forEach((vt, mt) => Te.set(vt, { x: Fe * (mt + 1), y: Be }));
      }
      return { pos: Te, height: rs * 2 + ke * os };
    }), k = X(() => {
      const S = f.layout, B = w.value;
      if (!S || !B) return [];
      const W = [];
      for (const ke of S.nodes)
        for (const _e of ke.neighbors) {
          if (_e <= ke.index) continue;
          const Te = ke.index === a() || _e === a(), Ce = _e === a() ? ke.index : _e, he = S.nodes[Ce], Be = Te && (y(he) || he.explored || he.cleared), Fe = !S.nodes[ke.index].explored && !he.explored && !Te;
          W.push({ a: ke.index, b: _e, active: Be, dim: Fe });
        }
      return W;
    }), M = (S) => w.value?.pos.get(S) ?? { x: 50, y: 0 }, P = (S) => M(S).x / 100 * as, T = (S) => M(S).y, A = (S) => ({ left: M(S.index).x + "%", top: M(S.index).y + "px" }), G = (S) => y(S) || !!S.explored || !!S.cleared || S.index === a(), q = (S) => G(S) ? S.event === "obstacle" ? "🪨" : S.kind === "outpost" ? S.event === "boss" ? "💀" : S.hasEnemy ? "⚔" : "🏕" : S.event === "treasure" ? "✨" : "·" : "?", I = (S) => S.index === a() ? nn(S) ? "cur blocked" : "cur" : y(S) ? "go" : G(S) ? S.event === "obstacle" && !S.cleared ? "blocked" : S.kind === "outpost" && S.event === "boss" && S.hasEnemy ? "boss" : S.hasEnemy ? "foe" : S.cleared ? "cleared" : S.explored ? "seen" : "dark" : "unknown", C = (S) => S.index === f.layout?.entry ? "出发点" : S.event === "obstacle" ? S.cleared ? "路障（已清除）" : "路障" : S.kind === "outpost" ? S.event === "boss" ? "敌军主将" : `营地 ${S.index}` : S.event === "treasure" ? "物资" : "", ie = () => s()?.nodes.filter((S) => S.kind === "outpost" && !S.hasEnemy).length ?? 0, ae = () => s()?.nodes.filter((S) => S.kind === "outpost").length ?? 0, z = () => f.ctrl?.data.run ?? null, F = () => z()?.actions ?? 0, R = () => f.ctrl?.data.inventory.provision ?? 0, N = () => tn - F() % tn, ce = () => {
      const S = z();
      return S ? Math.max(0, S.feedReadyAt - S.actions) : 0;
    }, E = (S) => {
      cl(S.index);
    }, $e = (S) => S.index === a() ? nn(S) ? "我军当前位置 · 脚下障碍未铲除，先处理它" : "我军当前位置" : y(S) ? S.hasEnemy ? "前往：遭遇敌军！" : "前往此地" : S.event === "obstacle" && !S.cleared && G(S) ? "路障：不铲除无法通过" : G(S) ? "（需绕路抵达）" : "未知区域", Se = je(!1), be = () => Se.value = !0, qe = () => Se.value = !1, xe = () => {
      Se.value = !1, fl();
    }, De = je(null), V = (S = !0) => {
      if (!w.value || !De.value) return;
      const W = M(a()).y - De.value.clientHeight / 2;
      De.value.scrollTo({ top: Math.max(0, W), behavior: S ? "smooth" : "auto" });
    };
    return cs(() => Ni(() => V(!1))), us(a, () => Ni(() => V(!0))), (S, B) => (m(), b("div", Xp, [
      ge(ut),
      D(f).layout ? (m(), b("div", Kp, [
        l("div", Jp, [
          l("h2", Qp, [
            ue(x(D(Ee).DUNGEONS.find((W) => W.id === D(f).layout.dungeonId)?.name ?? D(f).layout.dungeonId) + " ", 1),
            l("span", Zp, x(v()), 1)
          ]),
          l("p", ef, "已清扫 " + x(ie()) + "/" + x(ae()) + " 处营地 · 在地图上点击发光的节点即可前进", 1)
        ])
      ])) : U("", !0),
      D(f).layout && w.value ? (m(), b("div", tf, [
        l("div", {
          class: "gi-map-frame",
          ref_key: "frameRef",
          ref: De
        }, [
          l("div", {
            class: "gi-map-canvas",
            style: ze({ height: w.value.height + "px" })
          }, [
            (m(), b("svg", {
              class: "gi-map-roads",
              viewBox: `0 0 ${as} ${w.value.height}`,
              preserveAspectRatio: "none"
            }, [
              (m(!0), b(ee, null, re(k.value, (W) => (m(), b(ee, {
                key: W.a + "-" + W.b
              }, [
                l("line", {
                  class: J(["gi-road-base", { active: W.active, dim: W.dim }]),
                  x1: P(W.a),
                  y1: T(W.a),
                  x2: P(W.b),
                  y2: T(W.b)
                }, null, 10, sf),
                l("line", {
                  class: J(["gi-road-dash", { active: W.active, dim: W.dim }]),
                  x1: P(W.a),
                  y1: T(W.a),
                  x2: P(W.b),
                  y2: T(W.b)
                }, null, 10, of)
              ], 64))), 128))
            ], 8, nf)),
            (m(!0), b(ee, null, re(D(f).layout.nodes, (W) => (m(), b("button", {
              key: W.index,
              class: J(["gi-mnode", [W.kind === "outpost" ? "kind-outpost" : "kind-path", I(W), { clickable: y(W) }]]),
              disabled: !y(W),
              style: ze(A(W)),
              title: $e(W),
              onClick: (ke) => E(W)
            }, [
              W.index === a() ? (m(), b("span", af, "我军")) : U("", !0),
              l("span", lf, [
                l("span", cf, x(q(W)), 1),
                W.cleared && W.kind === "outpost" ? (m(), b("span", df, "✓")) : U("", !0)
              ]),
              C(W) ? (m(), b("span", {
                key: 1,
                class: J(["gi-mnode-label", { gold: W.event === "boss" && G(W) }])
              }, x(C(W)), 3)) : U("", !0)
            ], 14, rf))), 128))
          ], 4)
        ], 512),
        B[4] || (B[4] = ds('<div class="gi-map-legend dim" data-v-57392a89><span data-v-57392a89><i class="lg lg-cur" data-v-57392a89></i> 当前位置</span><span data-v-57392a89><i class="lg lg-go" data-v-57392a89></i> 可前往（点击）</span><span data-v-57392a89><i class="lg lg-foe" data-v-57392a89></i> 遭遇敌人</span><span data-v-57392a89><i class="lg lg-boss" data-v-57392a89></i> 敌军主将</span><span data-v-57392a89><i class="lg lg-block" data-v-57392a89></i> 路障（挡路）</span><span data-v-57392a89><i class="lg lg-cleared" data-v-57392a89></i> 已清扫</span><span data-v-57392a89><i class="lg lg-dark" data-v-57392a89></i> 未知</span></div>', 1))
      ])) : U("", !0),
      D(f).dungeonNotice ? (m(), b("div", uf, [
        l("span", null, x(D(f).dungeonNotice), 1),
        l("button", {
          class: "gi-notice-x",
          title: "关闭",
          onClick: B[0] || (B[0] = (W) => yl())
        }, "✕")
      ])) : U("", !0),
      l("div", pf, [
        l("div", ff, [
          l("p", hf, [
            l("b", null, "当前：" + x(u() ? C(u()) || `通路 #${a()}` : "—"), 1),
            B[5] || (B[5] = l("span", { class: "dim" }, " · 每次移动 = 1 行动", -1))
          ]),
          l("p", gf, [
            l("span", vf, "🚶 行动 " + x(F()), 1),
            l("span", {
              class: J(["gi-eco-chip", { warn: R() === 0 }])
            }, "🍞 粮草 " + x(R()), 3),
            l("span", {
              class: "gi-eco-chip dim",
              title: `每经过一个节点算 1 行动；每满 ${D(tn)} 行动，在场干员各消耗 1 粮草`
            }, "下次进食还需 " + x(N()) + " 行动", 9, mf),
            l("span", {
              class: J(["gi-eco-chip", { dim: ce() === 0, warn: ce() > 0 }]),
              title: "主动投喂：1 粮草→1 名干员 +1 体力，每次投喂后需再走若干行动"
            }, " 投喂" + x(ce() > 0 ? `冷却 ${ce()} 行动` : "就绪"), 3)
          ]),
          B[6] || (B[6] = l("p", { class: "gi-hint-sm dim" }, "体力跨战斗保留，手牌每场重置（占位）。路障不铲除就哪儿也去不了；抵达 BOSS 前先清空沿途敌军吧。", -1))
        ]),
        l("div", yf, [
          js() ? (m(), b("button", {
            key: 0,
            class: "gi-btn gi-btn-primary",
            title: "处理脚下的路障 / 物资箱",
            onClick: B[1] || (B[1] = (W) => dl())
          }, " ✋ 交互 ")) : U("", !0),
          hl() ? (m(), b("button", {
            key: 1,
            class: "gi-btn gi-btn-outline",
            title: "主将已被击败，可结束讨伐",
            onClick: B[2] || (B[2] = (W) => gl())
          }, " 🏆 完成讨伐 → ")) : U("", !0),
          l("button", {
            class: "gi-btn gi-btn-danger",
            title: "按讨伐失败结算，收获按能否带回决定去留",
            onClick: B[3] || (B[3] = (W) => be())
          }, " 🏳️ 撤退 ")
        ])
      ]),
      ge(Ls, {
        ids: D(f).party,
        "show-hp": "",
        "allow-feed": ""
      }, null, 8, ["ids"]),
      Se.value ? (m(), b("div", {
        key: 3,
        class: "gi-ask-scrim",
        onClick: dt(qe, ["self"])
      }, [
        l("div", bf, [
          B[11] || (B[11] = l("h3", { class: "gi-ask-title" }, "确认撤退？", -1)),
          l("p", _f, [
            B[7] || (B[7] = ue(" 撤退会以", -1)),
            B[8] || (B[8] = l("b", { class: "gi-ask-bad" }, "讨伐失败", -1)),
            B[9] || (B[9] = ue("进入结算页：本次一路暂存的收获，只要还有干员活着就能带回营地， 全员阵亡则整趟遗落在副本里。出发前购买的补给会在结算页按每个 ", -1)),
            l("b", null, x(D(Pt)), 1),
            B[10] || (B[10] = ue(" 源石碇回收。 ", -1))
          ]),
          B[12] || (B[12] = l("p", { class: "gi-ask-hint dim" }, "已清扫的营地与击败的敌人不会被抹除，但主将仍未倒下。", -1)),
          l("div", { class: "gi-ask-btns" }, [
            l("button", {
              class: "gi-btn gi-btn-ghost",
              onClick: qe
            }, "再想想"),
            l("button", {
              class: "gi-btn gi-btn-danger",
              onClick: xe
            }, "确认撤退")
          ])
        ])
      ])) : U("", !0)
    ]));
  }
}), kf = /* @__PURE__ */ ye(xf, [["__scopeId", "data-v-57392a89"]]), wf = {
  key: 0,
  class: "gi-page gi-settle"
}, $f = { class: "gi-h2" }, Sf = { class: "gi-sub dim" }, Ef = {
  key: 0,
  class: "gi-settle-wipe"
}, If = { class: "gi-settle-sec" }, Tf = { class: "gi-settle-table" }, Cf = { class: "gi-settle-who" }, Mf = {
  key: 0,
  class: "gi-badge dead"
}, Of = { class: "dim" }, Pf = { class: "dim" }, Df = { class: "dim" }, Af = {
  key: 0,
  class: "ok"
}, Rf = {
  key: 0,
  class: "gi-badge lv"
}, qf = {
  key: 1,
  class: "dim"
}, jf = {
  key: 0,
  class: "gi-empty dim"
}, Lf = { class: "gi-settle-sec" }, Hf = { class: "gi-h3" }, zf = {
  key: 0,
  class: "gi-empty dim"
}, Ff = {
  key: 1,
  class: "gi-settle-loot"
}, Nf = { class: "gi-settle-lootname" }, Bf = { class: "gi-settle-lootname" }, Uf = {
  key: 2,
  class: "gi-hint dim"
}, Gf = {
  key: 1,
  class: "gi-settle-sec"
}, Vf = { class: "gi-hint dim" }, Yf = {
  key: 0,
  class: "gi-settle-loot"
}, Wf = { class: "gi-settle-lootname" }, Xf = { class: "dim" }, Kf = { class: "gi-settle-lootrow total" }, Jf = {
  key: 1,
  class: "gi-empty dim"
}, Qf = /* @__PURE__ */ ve({
  __name: "RunSummary",
  setup(c) {
    const s = X(() => f.ctrl?.data.run ?? null), a = X(() => s.value?.settleWin === !0), u = X(() => {
      const q = s.value, I = f.ctrl;
      return !q || !I ? [] : Object.keys(q.snapshot).map((C) => {
        const ie = q.snapshot[C], ae = I.data.roster.find((z) => z.id === C);
        return {
          id: C,
          dead: !!ae?.dead,
          hpFrom: ie.hp,
          hpTo: q.hp[C] ?? 0,
          stressFrom: ie.stress,
          stressTo: ae?.stress ?? ie.stress,
          expFrom: ie.exp,
          expTo: ae?.exp ?? ie.exp,
          levelFrom: ie.level,
          levelTo: ae?.level ?? ie.level
        };
      });
    }), y = X(() => f.ctrl?.settlePreview() ?? null), v = X(() => y.value?.carried ?? !1), w = X(() => {
      const q = y.value?.loot;
      return q ? Object.entries(q.items).filter(([, I]) => I > 0).map(([I, C]) => ({ id: I, name: I === "originite" ? "源石碇（直接变现）" : jt(I)?.name ?? I, count: C })) : [];
    }), k = X(() => (y.value?.loot.equips ?? []).map((q) => ({ id: q, name: Ae(q)?.name ?? q, rarity: Ae(q)?.rarity }))), M = X(() => y.value?.loot.originite ?? 0), P = X(() => y.value?.recycle ?? []), T = X(() => w.value.length > 0 || k.value.length > 0 || M.value > 0), A = X(() => v.value && P.value.length === 0), G = () => vl();
    return (q, I) => s.value ? (m(), b("div", wf, [
      ge(ut),
      l("header", {
        class: J(["gi-settle-head", a.value ? "is-win" : "is-lose"])
      }, [
        l("h2", $f, x(a.value ? "讨伐成功" : "撤退结算"), 1),
        l("p", Sf, x(a.value ? "主将已击败，队伍带着这一路的收获返回营地。" : "本次行动以讨伐失败计：收获按能否带回决定去留。"), 1)
      ], 2),
      v.value ? U("", !0) : (m(), b("p", Ef, "☠ 小队全员阵亡 —— 战利品与随身补给全部遗失，无法带回营地。")),
      l("section", If, [
        I[4] || (I[4] = l("h3", { class: "gi-h3" }, "队伍状态", -1)),
        l("table", Tf, [
          I[3] || (I[3] = l("thead", null, [
            l("tr", null, [
              l("th", null, "干员"),
              l("th", null, "体力"),
              l("th", null, "压力"),
              l("th", null, "经验"),
              l("th", null, "等级")
            ])
          ], -1)),
          l("tbody", null, [
            (m(!0), b(ee, null, re(u.value, (C) => (m(), b("tr", {
              key: C.id,
              class: J({ dead: C.dead })
            }, [
              l("td", Cf, [
                ge(Xe, {
                  id: C.id,
                  shape: "rounded",
                  dead: C.dead,
                  class: "gi-settle-av"
                }, null, 8, ["id", "dead"]),
                l("span", null, x(D(Ie)(C.id)), 1),
                C.dead ? (m(), b("span", Mf, "☠ 阵亡")) : U("", !0)
              ]),
              l("td", null, [
                l("span", Of, x(C.hpFrom), 1),
                I[0] || (I[0] = ue(" → ", -1)),
                l("b", {
                  class: J(C.hpTo <= 0 ? "bad" : C.hpTo < C.hpFrom ? "warn" : "ok")
                }, x(C.dead ? 0 : C.hpTo), 3)
              ]),
              l("td", null, [
                l("span", Pf, x(C.stressFrom), 1),
                I[1] || (I[1] = ue(" → ", -1)),
                l("b", {
                  class: J(C.stressTo > C.stressFrom ? "bad" : C.stressTo < C.stressFrom ? "ok" : "")
                }, x(C.stressTo), 3),
                C.stressTo !== C.stressFrom ? (m(), b("span", {
                  key: 0,
                  class: J(C.stressTo > C.stressFrom ? "bad" : "ok")
                }, "(" + x(C.stressTo > C.stressFrom ? "+" : "") + x(C.stressTo - C.stressFrom) + ")", 3)) : U("", !0)
              ]),
              l("td", null, [
                l("span", Df, x(C.expFrom), 1),
                I[2] || (I[2] = ue(" → ", -1)),
                l("b", null, x(C.expTo), 1),
                C.expTo !== C.expFrom ? (m(), b("span", Af, "(+" + x(C.expTo - C.expFrom) + ")", 1)) : U("", !0)
              ]),
              l("td", null, [
                C.levelTo !== C.levelFrom ? (m(), b("span", Rf, x(C.levelFrom) + " → " + x(C.levelTo), 1)) : (m(), b("span", qf, x(C.levelTo), 1))
              ])
            ], 2))), 128))
          ])
        ]),
        u.value.length ? U("", !0) : (m(), b("p", jf, "本次没有带队干员。"))
      ]),
      l("section", Lf, [
        l("h3", Hf, x(v.value ? "带回物资" : "遗落的物资"), 1),
        T.value ? (m(), b("div", Ff, [
          (m(!0), b(ee, null, re(w.value, (C) => (m(), b("div", {
            key: C.id,
            class: J(["gi-settle-lootrow", { lost: !v.value }])
          }, [
            l("span", Nf, x(C.name), 1),
            l("b", null, "×" + x(C.count), 1)
          ], 2))), 128)),
          (m(!0), b(ee, null, re(k.value, (C) => (m(), b("div", {
            key: C.id,
            class: J(["gi-settle-lootrow", { lost: !v.value }])
          }, [
            l("span", Bf, x(C.name), 1),
            C.rarity ? (m(), b("span", {
              key: 0,
              class: J(["gi-badge", C.rarity === "epic" || C.rarity === "legendary" ? "gold" : C.rarity === "rare" ? "virtue" : "dead"])
            }, x(D(on)[C.rarity]), 3)) : U("", !0),
            I[5] || (I[5] = l("b", null, "装备", -1))
          ], 2))), 128)),
          M.value > 0 ? (m(), b("div", {
            key: 0,
            class: J(["gi-settle-lootrow", { lost: !v.value }])
          }, [
            I[6] || (I[6] = l("span", { class: "gi-settle-lootname" }, "💠 源石碇", -1)),
            l("b", null, "+" + x(M.value), 1)
          ], 2)) : U("", !0)
        ])) : (m(), b("p", zf, "这一路没有拿到任何物资。")),
        v.value ? U("", !0) : (m(), b("p", Uf, "全员阵亡时物资一律丢弃，以上条目不会入账。"))
      ]),
      v.value ? (m(), b("section", Gf, [
        I[8] || (I[8] = l("h3", { class: "gi-h3" }, "随身补给回收", -1)),
        l("p", Vf, "出发前购买的消耗品按每个 " + x(D(Pt)) + " 源石碇回收（仅战前补给站支持原价出售）。", 1),
        P.value.length ? (m(), b("div", Yf, [
          (m(!0), b(ee, null, re(P.value, (C) => (m(), b("div", {
            key: C.id,
            class: "gi-settle-lootrow"
          }, [
            l("span", Wf, x(C.name), 1),
            l("span", Xf, "×" + x(C.count), 1),
            l("b", null, "💠 " + x(C.count * D(Pt)), 1)
          ]))), 128)),
          l("div", Kf, [
            I[7] || (I[7] = l("span", { class: "gi-settle-lootname" }, "回收合计", -1)),
            l("b", null, "💠 " + x(y.value?.refund ?? 0), 1)
          ])
        ])) : A.value ? (m(), b("p", Jf, "背包里的出发补给已全部用完，无可回收项。")) : U("", !0)
      ])) : U("", !0),
      l("footer", { class: "gi-settle-foot" }, [
        l("button", {
          class: "gi-btn gi-btn-primary gi-btn-lg",
          onClick: G
        }, "确认返回营地 →")
      ])
    ])) : U("", !0);
  }
}), Zf = /* @__PURE__ */ ye(Qf, [["__scopeId", "data-v-cfe2b371"]]), eh = {
  key: 0,
  class: "gi-report-scrim"
}, th = {
  class: "gi-report",
  role: "dialog",
  "aria-modal": "true"
}, nh = { class: "gi-report-body" }, ih = { class: "gi-report-sec" }, sh = { class: "gi-report-list" }, oh = { class: "gi-report-name" }, rh = {
  key: 0,
  class: "gi-report-kills ok"
}, ah = { class: "gi-report-hp" }, lh = { class: "dim" }, ch = {
  key: 1,
  class: "gi-badge dead"
}, dh = {
  key: 0,
  class: "gi-report-xp dim"
}, uh = { class: "gi-report-sec" }, ph = {
  key: 0,
  class: "gi-report-tags"
}, fh = {
  key: 1,
  class: "gi-empty dim"
}, hh = { class: "gi-report-sec" }, gh = {
  key: 0,
  class: "gi-empty dim"
}, vh = {
  key: 1,
  class: "gi-report-rewards"
}, mh = {
  key: 0,
  class: "gi-report-reward"
}, yh = 2, bh = /* @__PURE__ */ ve({
  __name: "BattleReport",
  setup(c) {
    const s = X(() => f.battleReport), a = X(() => s.value?.result.win ?? !1), u = X(() => {
      const q = s.value;
      return q ? q.party.map((I) => {
        const C = q.preHp[I] ?? qt(I), ie = Math.max(0, Math.floor(q.result.finalHp[I] ?? 0));
        return { id: I, from: C, to: ie, dead: ie <= 0, delta: ie - C, kills: q.result.kills?.[I] ?? 0 };
      }) : [];
    }), y = X(() => u.value.filter((q) => !q.dead).length), v = X(() => s.value?.result.killedEnemies ?? []), w = X(() => s.value?.loot), k = X(() => {
      const q = w.value;
      return q ? Object.entries(q.items).filter(([, I]) => I > 0).map(([I, C]) => ({ id: I, name: I === "originite" ? "源石碇" : jt(I)?.name ?? I, count: C })) : [];
    }), M = X(() => (w.value?.equips ?? []).map((q) => ({ id: q, name: Ae(q)?.name ?? q, rarity: Ae(q)?.rarity }))), P = (q) => q === "epic" || q === "legendary" ? "gold" : q === "rare" ? "virtue" : "dead", T = X(() => w.value?.originite ?? 0), A = X(() => k.value.length === 0 && M.value.length === 0 && T.value === 0), G = () => bl();
    return (q, I) => s.value ? (m(), b("div", eh, [
      l("div", th, [
        l("header", {
          class: J(["gi-report-head", a.value ? "is-win" : "is-lose"])
        }, [
          I[0] || (I[0] = l("span", { class: "gi-report-title" }, "战斗简报", -1)),
          l("span", {
            class: J(["gi-badge", a.value ? "ok" : "bad"])
          }, x(a.value ? "✓ 目标达成" : "✕ 行动失败"), 3)
        ], 2),
        l("div", nh, [
          l("section", ih, [
            I[2] || (I[2] = l("h3", { class: "gi-h3" }, "我方战况", -1)),
            l("ul", sh, [
              (m(!0), b(ee, null, re(u.value, (C) => (m(), b("li", {
                key: C.id,
                class: J(["gi-report-row", { dead: C.dead }])
              }, [
                ge(Xe, {
                  id: C.id,
                  shape: "rounded",
                  dead: C.dead,
                  class: "gi-report-av"
                }, null, 8, ["id", "dead"]),
                l("span", oh, x(D(Ie)(C.id)), 1),
                C.kills > 0 ? (m(), b("span", rh, "击杀 " + x(C.kills) + " · 压力 −" + x(C.kills * 3), 1)) : U("", !0),
                l("span", ah, [
                  l("span", lh, x(C.from), 1),
                  I[1] || (I[1] = l("span", { class: "gi-report-arrow" }, "→", -1)),
                  l("b", {
                    class: J(C.dead ? "bad" : C.delta < 0 ? "warn" : "ok")
                  }, x(C.to), 3)
                ]),
                C.dead ? (m(), b("span", ch, "☠ 阵亡")) : U("", !0)
              ], 2))), 128))
            ]),
            a.value && y.value ? (m(), b("p", dh, "胜利：全体存活干员 +" + x(yh) + " 经验（" + x(y.value) + " 人）", 1)) : U("", !0)
          ]),
          l("section", uh, [
            I[3] || (I[3] = l("h3", { class: "gi-h3" }, "歼灭敌军", -1)),
            v.value.length ? (m(), b("div", ph, [
              (m(!0), b(ee, null, re(v.value, (C) => (m(), b("span", {
                key: C,
                class: "gi-tag gold"
              }, x(D(Ie)(C)), 1))), 128))
            ])) : (m(), b("p", fh, "本次未歼灭任何敌人。"))
          ]),
          l("section", hh, [
            I[6] || (I[6] = l("h3", { class: "gi-h3" }, "获得奖励", -1)),
            A.value ? (m(), b("p", gh, "本次没有拾获任何物资。")) : (m(), b("div", vh, [
              (m(!0), b(ee, null, re(k.value, (C) => (m(), b("span", {
                key: C.id,
                class: "gi-report-reward"
              }, [
                ue(x(C.name) + " ", 1),
                l("b", null, "×" + x(C.count), 1)
              ]))), 128)),
              (m(!0), b(ee, null, re(M.value, (C, ie) => (m(), b("span", {
                key: ie,
                class: "gi-report-reward gi-report-equip"
              }, [
                l("b", null, x(C.name), 1),
                C.rarity ? (m(), b("span", {
                  key: 0,
                  class: J(["gi-badge", P(C.rarity)])
                }, x(D(on)[C.rarity]), 3)) : U("", !0)
              ]))), 128)),
              T.value > 0 ? (m(), b("span", mh, [
                I[4] || (I[4] = l("span", { class: "gi-report-dot" }, null, -1)),
                I[5] || (I[5] = ue(" 💠 源石碇 ", -1)),
                l("b", null, x(T.value), 1)
              ])) : U("", !0)
            ])),
            I[7] || (I[7] = l("p", { class: "gi-hint dim" }, "奖励先记入本次远征的暂存行囊，撤退或完成讨伐时在结算页统一入账。", -1))
          ])
        ]),
        l("footer", { class: "gi-report-foot" }, [
          l("button", {
            class: "gi-btn gi-btn-primary gi-btn-lg",
            onClick: G
          }, "确认")
        ])
      ])
    ])) : U("", !0);
  }
}), _h = {
  key: 0,
  class: "gi-report-scrim"
}, xh = {
  class: "gi-nd",
  role: "dialog",
  "aria-modal": "true"
}, kh = { class: "gi-nd-head" }, wh = { class: "gi-nd-icon" }, $h = { class: "gi-h3" }, Sh = { class: "gi-sub dim" }, Eh = { class: "gi-nd-body" }, Ih = ["disabled"], Th = { class: "gi-nd-opt-sub dim" }, Ch = { class: "gi-nd-opt-sub dim" }, Mh = ["disabled"], Oh = { class: "gi-nd-opt-sub dim" }, Ph = {
  key: 2,
  class: "gi-nd-notice"
}, Dh = /* @__PURE__ */ ve({
  __name: "NodeDialog",
  setup(c) {
    const s = je(""), a = X(() => {
      const q = f.layout, I = f.nodeDialog;
      return I == null || !q ? null : q.nodes.find((C) => C.index === I) ?? null;
    }), u = X(() => a.value?.event === "obstacle"), y = jt("supply")?.name ?? "后勤小队", v = () => f.ctrl?.data.inventory.supply ?? 0, w = () => u.value ? tt.supplyCost : jn.supplyCost, k = X(() => v() >= w()), M = X(() => f.party.some((q) => (f.dungeonHp[q] ?? 0) <= tt.hpLoss)), P = (q) => {
      s.value = q.ok ? "" : q.reason ?? "办不到";
    }, T = () => P(is(a.value.index, "supply")), A = () => P(is(a.value.index, "force")), G = () => P(ul(a.value.index));
    return (q, I) => a.value ? (m(), b("div", _h, [
      l("div", xh, [
        l("header", kh, [
          l("span", wh, x(u.value ? "🪨" : "✨"), 1),
          l("div", null, [
            l("h3", $h, x(u.value ? "通路障碍" : "物资箱"), 1),
            l("p", Sh, x(u.value ? `堵在通路 #${a.value.index} 上，不铲除就只能绕路或撤退。铲开它没有任何收获。` : `搁在通路 #${a.value.index} 上，开箱要花一支后勤小队；也可以不碰它直接走。`), 1)
          ])
        ]),
        l("div", Eh, [
          u.value ? (m(), b(ee, { key: 0 }, [
            l("button", {
              class: "gi-nd-opt",
              disabled: !k.value,
              onClick: T
            }, [
              I[2] || (I[2] = l("span", { class: "gi-nd-opt-title" }, "派后勤小队清开", -1)),
              l("span", Th, "消耗 " + x(w()) + " 个" + x(D(y)) + "（持有 " + x(v()) + "）", 1)
            ], 8, Ih),
            l("button", {
              class: J(["gi-nd-opt", { danger: M.value }]),
              onClick: A
            }, [
              I[3] || (I[3] = l("span", { class: "gi-nd-opt-title" }, "亲手挖开", -1)),
              l("span", Ch, [
                ue(" 在场 " + x(D(f).party.length) + " 名干员各 −" + x(D(tt).hpLoss) + " 体力、压力 +" + x(D(tt).stress), 1),
                M.value ? (m(), b(ee, { key: 0 }, [
                  ue("（有人只剩 1 点体力，会倒下）")
                ], 64)) : U("", !0)
              ])
            ], 2),
            l("button", {
              class: "gi-nd-opt ghost",
              onClick: I[0] || (I[0] = (C) => ss())
            }, [...I[4] || (I[4] = [
              l("span", { class: "gi-nd-opt-title" }, "放弃交互", -1),
              l("span", { class: "gi-nd-opt-sub dim" }, "什么都不消耗，但这条路依旧堵着", -1)
            ])])
          ], 64)) : (m(), b(ee, { key: 1 }, [
            l("button", {
              class: "gi-nd-opt",
              disabled: !k.value,
              onClick: G
            }, [
              I[5] || (I[5] = l("span", { class: "gi-nd-opt-title" }, "撬开箱子", -1)),
              l("span", Oh, "消耗 " + x(w()) + " 个" + x(D(y)) + "（持有 " + x(v()) + "）· 收获先记下，结算时带回", 1)
            ], 8, Mh),
            l("button", {
              class: "gi-nd-opt ghost",
              onClick: I[1] || (I[1] = (C) => ss())
            }, [...I[6] || (I[6] = [
              l("span", { class: "gi-nd-opt-title" }, "不碰它", -1),
              l("span", { class: "gi-nd-opt-sub dim" }, "不消耗任何东西，直接路过（以后回来也还是不拆）", -1)
            ])])
          ], 64)),
          s.value ? (m(), b("p", Ph, x(s.value), 1)) : U("", !0)
        ])
      ])
    ])) : U("", !0);
  }
}), Ah = /* @__PURE__ */ ye(Dh, [["__scopeId", "data-v-58886d0a"]]), Rh = {
  class: "gi-detail",
  role: "dialog",
  "aria-modal": "true"
}, qh = { class: "gi-detail-head" }, jh = { class: "gi-detail-idblock" }, Lh = { class: "gi-detail-nameline" }, Hh = { class: "gi-detail-name" }, zh = {
  key: 0,
  class: "gi-detail-title"
}, Fh = { class: "gi-detail-lvline" }, Nh = { class: "gi-stars" }, Bh = { class: "dim" }, Uh = { class: "dim" }, Gh = { class: "gi-detail-split" }, Vh = { class: "gi-detail-main" }, Yh = {
  key: 0,
  class: "gi-detail-sec"
}, Wh = { class: "gi-hpbar" }, Xh = { class: "gi-progress" }, Kh = { class: "gi-hp-num" }, Jh = { class: "gi-detail-sec" }, Qh = { class: "gi-detail-hrow" }, Zh = { class: "gi-progress gi-stressbar" }, eg = { class: "gi-detail-note dim" }, tg = { class: "gi-detail-sec" }, ng = { class: "gi-detail-intro" }, ig = { class: "gi-detail-sec" }, sg = {
  key: 0,
  class: "gi-skill-list"
}, og = { class: "gi-skill-name" }, rg = ["innerHTML"], ag = {
  key: 1,
  class: "gi-detail-note dim"
}, lg = { class: "gi-detail-sec gi-detail-sec-last" }, cg = { class: "gi-detail-hrow" }, dg = { class: "gi-equip-grid" }, ug = ["onClick"], pg = { class: "gi-equip-info" }, fg = { class: "gi-equip-slot-name" }, hg = { class: "gi-equip-slot-sub dim" }, gg = { class: "gi-detail-note dim" }, vg = { class: "gi-detail-warehouse" }, mg = { class: "gi-wh-head" }, yg = {
  key: 0,
  class: "gi-equip-notice"
}, bg = {
  key: 1,
  class: "gi-wh-list"
}, _g = ["title", "onClick"], xg = { class: "gi-wh-info" }, kg = { class: "gi-wh-name" }, wg = {
  key: 0,
  class: "gi-wh-count"
}, $g = { class: "gi-wh-sub dim" }, Sg = {
  key: 2,
  class: "gi-empty dim"
}, Eg = /* @__PURE__ */ ve({
  __name: "OperatorDetail",
  setup(c) {
    const s = X(() => f.detailId), a = X(() => s.value ? (f.ctrl?.data.roster ?? []).find((F) => F.id === s.value) : void 0), u = X(() => !!s.value && f.phase === "dungeon" && f.party.includes(s.value)), y = X(() => s.value ? f.dungeonHp[s.value] ?? qt(s.value) : 0), v = X(() => s.value ? qt(s.value) : 0), w = X(() => s.value ? Jr(s.value) : ""), k = X(() => s.value ? Qr(s.value) : ""), M = X(() => s.value ? Is(s.value) : []), P = X(() => a.value?.maxEquipSlots ?? 1), T = X(() => (a.value?.equipped ?? []).map((F) => ({ eid: F, def: Ae(F) }))), A = X(() => {
      const F = f.ctrl?.availableEquips() ?? [], R = /* @__PURE__ */ new Map();
      for (const N of F) R.set(N, (R.get(N) ?? 0) + 1);
      return [...R].map(([N, ce]) => ({ eid: N, count: ce, def: Ae(N) }));
    }), G = X(() => !!a.value && a.value.equipped.length >= P.value), q = je(""), I = (F) => {
      if (!s.value) return;
      const R = Qa(s.value, F);
      q.value = R.ok ? "" : `装备失败：${R.reason ?? "无法装备"}`;
    }, C = (F) => {
      if (!s.value) return;
      const R = Za(s.value, F);
      q.value = R.ok ? "" : R.reason ?? "";
    }, ie = X(() => {
      const F = a.value?.virtue;
      return F ? Ln.find((R) => R.id === F)?.name ?? F : "";
    }), ae = X(() => Math.max(0, Math.min(100, (a.value?.stress ?? 0) / Ne.deathAt * 100))), z = () => {
      q.value = "", al();
    };
    return (F, R) => s.value && a.value ? (m(), b("div", {
      key: 0,
      class: "gi-detail-scrim",
      onClick: dt(z, ["self"])
    }, [
      l("div", Rh, [
        l("header", qh, [
          ge(Xe, {
            id: s.value,
            shape: "rounded",
            dead: a.value.dead,
            class: "gi-detail-av"
          }, null, 8, ["id", "dead"]),
          l("div", jh, [
            l("div", Lh, [
              l("span", Hh, x(D(Ie)(s.value)), 1),
              l("span", {
                class: J(["gi-badge", D(Dt)(a.value).cls])
              }, x(D(Dt)(a.value).label), 3)
            ]),
            k.value ? (m(), b("div", zh, x(k.value), 1)) : U("", !0),
            l("div", Fh, [
              l("span", Nh, x(D(Un)(a.value.level)), 1),
              l("span", Bh, "Lv " + x(a.value.level), 1),
              l("span", Uh, "· 经验 " + x(a.value.exp), 1)
            ])
          ]),
          l("button", {
            class: "gi-detail-x",
            title: "关闭",
            onClick: z
          }, "✕")
        ]),
        l("div", Gh, [
          l("div", Vh, [
            u.value ? (m(), b("section", Yh, [
              R[0] || (R[0] = l("h4", { class: "gi-detail-h" }, "当前体力", -1)),
              l("div", Wh, [
                l("div", Xh, [
                  l("div", {
                    class: "gi-progress-fill",
                    style: ze({ width: y.value / v.value * 100 + "%" })
                  }, null, 4)
                ]),
                l("span", Kh, x(y.value) + " / " + x(v.value), 1)
              ])
            ])) : U("", !0),
            l("section", Jh, [
              l("div", Qh, [
                R[1] || (R[1] = l("h4", { class: "gi-detail-h" }, "压力", -1)),
                l("span", {
                  class: J(["gi-detail-val", "txt-" + D(At)(a.value.stress)])
                }, x(Math.round(a.value.stress)) + " / " + x(D(Ne).deathAt), 3)
              ]),
              l("div", Zh, [
                l("div", {
                  class: J(["gi-progress-fill", "stress-" + D(At)(a.value.stress)]),
                  style: ze({ width: ae.value + "%" })
                }, null, 6)
              ]),
              l("p", eg, [
                a.value.dead ? (m(), b(ee, { key: 0 }, [
                  ue("压力突破 " + x(D(Ne).deathAt) + "，干员已永久牺牲。", 1)
                ], 64)) : a.value.agony ? (m(), b(ee, { key: 1 }, [
                  ue("已达 " + x(D(Ne).stressAt) + " 陷入「折磨」：压力增长 +20%。", 1)
                ], 64)) : ie.value ? (m(), b(ee, { key: 2 }, [
                  ue("曾触发美德「" + x(ie.value) + "」。", 1)
                ], 64)) : (m(), b(ee, { key: 3 }, [
                  ue("达 " + x(D(Ne).stressAt) + " 判定美德 / 折磨，达 " + x(D(Ne).deathAt) + " 永久牺牲。", 1)
                ], 64))
              ])
            ]),
            l("section", tg, [
              R[2] || (R[2] = l("h4", { class: "gi-detail-h" }, "简介", -1)),
              l("p", ng, x(w.value || "（该干员暂无档案记载。）"), 1)
            ]),
            l("section", ig, [
              R[3] || (R[3] = l("h4", { class: "gi-detail-h" }, "技能", -1)),
              M.value.length ? (m(), b("ul", sg, [
                (m(!0), b(ee, null, re(M.value, (N) => (m(), b("li", {
                  key: N.id,
                  class: "gi-skill"
                }, [
                  l("span", og, x(N.name), 1),
                  l("span", {
                    class: "gi-skill-info",
                    innerHTML: N.info || "—"
                  }, null, 8, rg)
                ]))), 128))
              ])) : (m(), b("p", ag, "该干员未配置技能。"))
            ]),
            l("section", lg, [
              l("div", cg, [
                R[4] || (R[4] = l("h4", { class: "gi-detail-h" }, "已穿戴", -1)),
                l("span", {
                  class: J(["gi-detail-val dim", { "txt-high": G.value }])
                }, x(T.value.length) + "/" + x(P.value), 3)
              ]),
              l("div", dg, [
                (m(!0), b(ee, null, re(T.value, (N, ce) => (m(), b("button", {
                  key: "w" + ce,
                  class: "gi-equip-slot worn",
                  title: "点击退回右侧仓库",
                  onClick: (E) => C(N.eid)
                }, [
                  ge(Rt, {
                    id: N.eid,
                    img: N.def?.img,
                    size: 36
                  }, null, 8, ["id", "img"]),
                  l("span", pg, [
                    l("span", fg, x(N.def?.name ?? N.eid), 1),
                    l("span", hg, x(N.def?.desc ?? ""), 1)
                  ]),
                  R[5] || (R[5] = l("span", {
                    class: "gi-equip-return",
                    title: "退回仓库"
                  }, "↩", -1))
                ], 8, ug))), 128)),
                (m(!0), b(ee, null, re(P.value - T.value.length, (N) => (m(), b("div", {
                  key: "e" + N,
                  class: "gi-equip-slot empty"
                }, "空装备栏"))), 128))
              ]),
              l("p", gg, x(P.value) + " 个装备栏" + x(a.value.level >= 2 ? "（2 级额外 +1）" : "，升到 2 级可再 +1") + "。点击已穿戴可退回右侧仓库。 ", 1)
            ])
          ]),
          l("aside", vg, [
            l("div", mg, [
              R[6] || (R[6] = l("h4", { class: "gi-detail-h" }, "装备仓库", -1)),
              l("span", {
                class: J(["gi-badge", G.value ? "dead" : "ok"])
              }, x(G.value ? "栏位已满" : "可装备"), 3)
            ]),
            q.value ? (m(), b("p", yg, x(q.value), 1)) : U("", !0),
            A.value.length ? (m(), b("div", bg, [
              (m(!0), b(ee, null, re(A.value, (N) => (m(), b("button", {
                key: N.eid,
                class: J(["gi-wh-item", { blocked: G.value }]),
                title: G.value ? "需要有空置的装备栏" : "装备到该干员",
                onClick: (ce) => I(N.eid)
              }, [
                ge(Rt, {
                  id: N.eid,
                  img: N.def?.img,
                  size: 40
                }, null, 8, ["id", "img"]),
                l("span", xg, [
                  l("span", kg, [
                    ue(x(N.def?.name ?? N.eid) + " ", 1),
                    N.count > 1 ? (m(), b("span", wg, "×" + x(N.count), 1)) : U("", !0)
                  ]),
                  l("span", $g, x(N.def?.desc ?? ""), 1)
                ]),
                N.def ? (m(), b("span", {
                  key: 0,
                  class: J(["gi-wh-rar", "r-" + N.def.rarity])
                }, x(D(on)[N.def.rarity]), 3)) : U("", !0)
              ], 10, _g))), 128))
            ])) : (m(), b("p", Sg, "仓库中暂无可穿戴装备。去营地「砍诺特」购入后到此装备。"))
          ])
        ])
      ])
    ])) : U("", !0);
  }
}), Ig = /* @__PURE__ */ ye(Eg, [["__scopeId", "data-v-65885e74"]]), Tg = /* @__PURE__ */ ve({
  __name: "App",
  setup(c) {
    const s = {
      title: "background/MonumentalMelodyTracey.jpg",
      start: "background/companion.jpg",
      camp: "background/landLife.jpg",
      recruit: "background/companion.jpg",
      graveyard: "background/landLife.jpg",
      shop: "background/landLife.jpg",
      supply: "background/battlefront.jpg",
      dispatch: "background/battlefront.jpg",
      dungeon: "background/PrimevalChaos.jpg",
      settle: "background/PrimevalChaos.jpg",
      end: "background/ideal.jpg"
    }, a = X(() => f.phase === "end" && !f.endWin ? "background/PrimevalChaos.jpg" : s[f.phase] ?? s.title), u = X(() => `url("${st(a.value)}")`), y = X(() => f.phase === "title" || f.phase === "end");
    return (v, w) => (m(), b("div", {
      id: "gi-layer",
      class: J({ "gi-battling": D(f).battling }),
      key: D(f).tick
    }, [
      l("div", {
        class: J(["gi-backdrop", { hero: y.value }]),
        style: ze({ backgroundImage: u.value }),
        "aria-hidden": "true"
      }, null, 6),
      D(f).phase === "title" ? (m(), Me(Il, { key: 0 })) : D(f).phase === "end" ? (m(), Me(Hl, { key: 1 })) : D(f).phase === "start" ? (m(), Me(Sc, { key: 2 })) : D(f).phase === "camp" ? (m(), Me(qd, { key: 3 })) : D(f).phase === "recruit" ? (m(), Me(Jd, { key: 4 })) : D(f).phase === "graveyard" ? (m(), Me(uu, { key: 5 })) : D(f).phase === "shop" || D(f).phase === "supply" ? (m(), Me(dp, { key: 6 })) : D(f).phase === "dispatch" ? (m(), Me(Wp, { key: 7 })) : D(f).phase === "dungeon" ? (m(), Me(kf, { key: 8 })) : D(f).phase === "settle" ? (m(), Me(Zf, { key: 9 })) : U("", !0),
      D(f).battleReport ? (m(), Me(bh, { key: 10 })) : U("", !0),
      D(f).nodeDialog != null ? (m(), Me(Ah, { key: 11 })) : U("", !0),
      ge(Ig)
    ], 2));
  }
}), ls = "gi-mount";
let Rn = null;
async function Cg() {
  if (new URLSearchParams(location.search).get("giBattle") === "1") {
    const { runBattleChild: s } = await import("./GloriousIdeal-battleChild.js");
    s();
    return;
  }
  const c = window.whichWaySave?.allCharacters || [];
  if (La(c), Ps(), !Rn) {
    let s = document.getElementById(ls);
    s || (s = document.createElement("div"), s.style.width = "100%", s.style.height = "100%", s.id = ls, document.body.appendChild(s)), Rn = en(Tg), Rn.mount(s);
  }
  nl(), console.log("[GloriousIdeal] 模式启动（框架版 · Vue UI）：营地 → 派遣 → 副本探索 → 结算 → 下一天");
}
const Rg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  start: Cg
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ag as l,
  Rg as s
};
