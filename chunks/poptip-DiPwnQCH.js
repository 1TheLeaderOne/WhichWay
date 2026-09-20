import { lib as e, get as p } from "noname";
import { onArenaReady as h, onSetDev as y } from "./hooks-BscfO9lD.js";
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
    Array.isArray(o) && (o = o.reduce((t, r) => (t[r] = e.skill[r], t), {}));
    for (let t in o) {
      let r = o[t];
      if (r.derivation) {
        let i = Array.isArray(r.derivation) ? r.derivation : [r.derivation];
        for (let n of i)
          if (e.translate[n]) {
            let a = `${t}_info`;
            if (e.translate[a] && e.translate[a].includes(p.translation(n))) {
              let l = p.translation(n), c = e.translate[a].indexOf(l) - 1, s = "";
              for (let f = 0; f < l.length + 2; f++)
                s += e.translate[a][c + f];
              e.translate[a] = e.translate[a].replaceAll(s, p.poptip(n));
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
    for (let r in o) {
      if (r in this.popTips) {
        console.warn(`popTip ${r} 已存在`);
        continue;
      }
      let i = o[r];
      if (i.id || (i.id = `sjzx_${r}`), i.name || (i.name = r), i.info || (i.info = "无详细信息"), Array.isArray(i.info) || (i.info = [i.info]), i.trim !== void 0 && i.trim !== !1) {
        if (i.trim === !0) i.info[0] = `『${i.info[0]}』`;
        else if (typeof i.trim == "number" || Array.isArray(i.trim)) {
          i.trim = Array.isArray(i.trim) ? i.trim : [i.trim];
          for (let n = 0; n < i.info.length; n++)
            i.trim.includes(n) && (i.info[n] = `『${i.info[n]}』`);
        }
      }
      i.info = i.info.join("<br>"), i.sourceInfo ? i.info = `${i.info}<br><font color="red">来自${i.sourceInfo}</font>` : i.info = `${i.info}<br><font color="red">来自驶舰之向</font>`, t.push(i), this.popTips[r] = i;
    }
    t.length > 0 && t.forEach((r) => e.poptip.add(r));
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
