import { game as d, get as n, lib as r } from "noname";
import { whichWayAPIOverride as s } from "./override-B27IQjje.js";
s.overrideAPI("lib.skill.jiu", {
  trigger: {
    player: "useCard1"
  },
  filter: function(e, a) {
    return a.hasSkill("tiaojiumrfz") ? e.card && (n.type(e.card) == "trick" || n.type(e.card) == "basic") && e.card.name != "jiu" : e.card && e.card.name == "sha";
  },
  forced: !0,
  charlotte: !0,
  firstDo: !0,
  content: async function(e, a, i) {
    i.hasSkill("tiaojiumrfz") ? a.effectCount += i.storage.jiu : (a.baseDamage || (a.baseDamage = 1), a.baseDamage += i.storage.jiu), a.jiu = !0, a.jiu_add = i.storage.jiu, d.addVideo("jiuNode", i, !1), d.broadcastAll(function(c) {
      c.removeSkill("jiu");
    }, i);
  },
  temp: !0,
  vanish: !0,
  silent: !0,
  popup: !1,
  nopop: !0,
  onremove: function(e) {
    e.node.jiu && (e.node.jiu.delete(), e.node.jiu2.delete(), delete e.node.jiu, delete e.node.jiu2), delete e.storage.jiu;
  },
  ai: {
    damageBonus: !0,
    skillTagFilter: function(e, a, i) {
      if (a === "damageBonus") return i && i.card && i.card.name === "sha" && !e.hasSkill("tiaojiumrfz");
    }
  },
  group: "jiu2"
});
s.overrideAPI("lib.skill.jiu2.filter", function(e, a) {
  return a.hasSkillTag("jiuSustain", null, e.name) ? !1 : e.name == "useCard" ? a.hasSkill("tiaojiumrfz") ? e.card && (n.type(e.card) == "trick" || n.type(e.card) == "basic") && e.card.name != "jiu" : e.card && e.card.name == "sha" : !0;
});
r.card.binglinchengxia || (r.card.binglinchengxia = {
  fullskin: !0,
  image: "ext:WhichWay/image/card/binglinchengxia.webp",
  type: "delay",
  filterTarget: function(e, a, i) {
    return r.filter.judge(e, a, i) && a != i;
  },
  judge: function(e) {
    return n.suit(e) == "diamond" ? 0 : -3;
  },
  effect: async function(e, a, i) {
    const c = e.result;
    if (c.bool == !1)
      if (i.countCards("e", function(t) {
        return r.filter.cardDiscardable(t, i, "shuiyanqijuny");
      }))
        i.chooseControl({
          controls: ["discard_card", "take_damage"],
          ai(t, u) {
            return n.damageEffect(u, t.player, u) >= 0 || u.hp >= 3 && u.countCards("e") >= 2 ? "take_damage" : "discard_card";
          }
        });
      else {
        i.damage().set("nosource", !0);
        return;
      }
    else return;
    c.control == "discard_card" ? i.discard({
      cards: i.getCards("e", function(t) {
        return r.filter.cardDiscardable(t, i, "shuiyanqijuny");
      })
    }) : i.damage().set("nosource", !0);
  },
  ai: {
    order: 1,
    value: 3,
    useful: 2,
    tag: {
      damage: 1,
      loseCard: 1
    },
    result: {
      target: function(e, a, i, c) {
        let t = a.getCards("e");
        if (!t.length) return -1.5;
        let u = 0;
        for (let o of t) u += n.value(o, a);
        return -Math.min(1.5, u / 5);
      }
    }
  }
}, r.translate.binglinchengxia = "兵临城下", r.translate.binglinchengxia_info = "出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。");
let l = ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz"], f = n.info("chenkemrfz");
for (let e of l)
  r.translate[e] = r.translate.chenkemrfz, r.translate[e + "_info"] = r.translate.chenkemrfz_info, r.skill[e] = {
    ...f,
    audio: e === "chenke3mrfz" ? "chenkemrfz" : !1
  };
