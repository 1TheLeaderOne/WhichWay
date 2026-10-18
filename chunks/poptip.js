import { get as f, lib as e } from "noname";
import { onArenaReady as h, onSetDev as y } from "./hooks.js";
const d = {
  //回合轮
  huihelun: {
    name: "回合轮",
    info: ["回合轮", "指一名角色上一轮其回合开始（若本轮为第一轮则改为本轮开始时）到其本轮回合开始这一时间段。"],
    type: "rule",
    trim: !0
  },
  AveMujica: {
    info: ["AveMujica角色", "丰川祥子、若叶睦、祐天寺若麦、三角初华、八幡海铃"],
    trim: !0
  },
  centralArea: {
    name: "中央区",
    info: "特指本回合进入弃牌堆的牌"
  },
  cardUseType: {
    name: "牌的结算方法",
    info: "『牌的结算方法』<br>使用、打出、重铸、弃置"
  },
  byRecast: {
    name: "以重铸的方式",
    info: ["以重铸的方式", "将一张牌同时执行重铸效果和其他效果"],
    trim: !0
  },
  zhiheng: {
    name: "制衡",
    info: ["制衡", "往往以“制衡X”的描述出现，效果为“弃置X张牌，然后摸X张牌”"],
    trim: !0
  },
  jishipai: {
    name: "即时牌",
    info: ["即时牌", "即普通锦囊牌和基本牌"],
    trim: !0
  },
  enchanting: {
    name: "附魔",
    info: ["附魔", "若附魔的是：", "属性：令附魔对象的属性或特性改为附魔词条。", "牌：令附魔对象的作用效果加入附魔词条中的作用效果，附魔牌的作用效果于附魔对象的作用效果后执行。", "技能：令附魔对象的拥有者在附魔对象或附魔事件的结算过程中视为拥有附魔词条中包含的技能。"],
    trim: !0
  },
  /**
   * ♠：上
   * ♣：下
   * ♦：左
   * ♥：右
   */
  stratagemSupport: {
    name: "战略支援",
    info: [
      "根据弃置的牌的花色（有顺序要求）组成对应的战略指令，并执行相应的效果。",
      "(下述描述的格式为“名称（花色要求）：对应的效果”)",
      "重新补给（♣♣♠♦）：令一名角色摸两张牌并回复一点体力。",
      "“骏鹰”扫射（♠♦♦）：对攻击范围内的一名其他角色造成1点伤害。",
      "“骏鹰”烟雾攻击（♠♦♠♣）：令一名其他角色下一张使用的牌无效。",
      "“骏鹰”空袭（♠♦♣♦）：对攻击范围内的一名其他角色造成2点伤害。",
      "“骏鹰”500kg（♠♦♣♣♣）：对攻击范围内的一名其他角色造成3点伤害。",
      "城防炮空爆攻击（♦♦♦）：视为对至多两名其他角色使用一张【万箭齐发】。",
      "城防炮精准攻击（♦♦♠）：视为对一名其他角色使用两张【万箭齐发】。",
      "城防炮毒气攻击（♦♦♣♠）：令一名其他角色弃置两张手牌。",
      "城防炮凝固汽油弹火力网（♥♥♣♦♥♠）：视为对至多三名其他角色使用一张【万箭齐发】",
      "380mm城防炮高爆火力网（♥♣♠♠♦♣♣）：视为对任意名其他角色使用五张【万箭齐发】。"
    ],
    trim: !1
  },
  orbArea: {
    name: "充能球区",
    info: ["充能球区上限为3张牌，超出上限的牌将被置入弃牌堆并触发对应的激发效果", "每轮开始时，会执行每张牌对应的被动效果"],
    trim: !1
  },
  persona: {
    name: "人格面具",
    info: ["结城理的专属技能，总共有两个：", "塔纳托斯:", `转换技，当你脱离濒死状态后，你令至多X（X = 你的[①体力值;②已损失体力值])名角色[①进行三次${f.poptip("shandian")}判定;②弃一张手牌并受到一点伤害]。本技能的状态切换条件改为进入濒死状态时切换且你失去此技能不会重置此技能的状态。`, "俄尔普斯：", "转换技，回合结束时，你令至多[①Y;②一]名角色各回复[①一;②Y]点体力，且溢出的体力值改为摸等量张牌（Y = 你的[①体力值;②已损失体力值]）。本技能的状态切换条件改为进入濒死状态时切换且你失去此技能不会重置此技能的状态。"],
    trim: !1
  }
};
class u {
  constructor() {
    this.registerPopTip(d), h({
      name: "WhichWayPoptip_init",
      fn: () => {
        this.compilePopTipTranslate(window.whichWaySave.allSkills);
      },
      priority: 1e4
    });
  }
  /**
   * 注册过的popTip
   */
  popTips = {};
  /**
   * 编译popTip，会将derivation内的技能标注出来
   * @param {object | Array<string>} skills - 技能对象
   * @returns {void}
   */
  compilePopTipTranslate(o) {
    Array.isArray(o) && (o = o.reduce((t, n) => (t[n] = e.skill[n], t), {}));
    for (let t in o) {
      let n = o[t];
      if (n.derivation) {
        let i = Array.isArray(n.derivation) ? n.derivation : [n.derivation];
        for (let r of i)
          if (e.translate[r]) {
            let a = `${t}_info`;
            if (e.translate[a] && e.translate[a].includes(f.translation(r))) {
              let l = f.translation(r), c = e.translate[a].indexOf(l) - 1, s = "";
              for (let p = 0; p < l.length + 2; p++)
                s += e.translate[a][c + p];
              e.translate[a] = e.translate[a].replaceAll(s, f.poptip(r));
            }
          }
      }
    }
  }
  /**
   * 注册poptip
   * @param {Record<string,WhichWayPopTipConfig>} popTips
   * @returns {void}
   */
  registerPopTip(o) {
    let t = [];
    for (let n in o) {
      if (n in this.popTips) {
        console.warn(`popTip ${n} 已存在`);
        continue;
      }
      let i = o[n];
      if (i.id || (i.id = `sjzx_${n}`), i.name || (i.name = n), i.info || (i.info = "无详细信息"), Array.isArray(i.info) || (i.info = [i.info]), i.trim !== void 0 && i.trim !== !1) {
        if (i.trim === !0) i.info[0] = `『${i.info[0]}』`;
        else if (typeof i.trim == "number" || Array.isArray(i.trim)) {
          i.trim = Array.isArray(i.trim) ? i.trim : [i.trim];
          for (let r = 0; r < i.info.length; r++)
            i.trim.includes(r) && (i.info[r] = `『${i.info[r]}』`);
        }
      }
      i.info = i.info.join("<br>"), i.sourceInfo ? i.info = `${i.info}<br><font color="red">来自${i.sourceInfo}</font>` : i.info = `${i.info}<br><font color="red">来自驶舰之向</font>`, t.push(i), this.popTips[n] = i;
    }
    t.length > 0 && t.forEach((n) => e.poptip.add(n));
  }
}
const m = new u();
y({
  name: "whichWayPoptip_dev",
  fn: () => {
    window.whichWayPoptip = m;
  },
  priority: 0
});
window.whichWay.register("poptip", m);
export {
  m as whichWayPoptip
};
