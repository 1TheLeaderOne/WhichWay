import { get as c, _status as k, game as S, lib as l } from "noname";
import { whichWayFile as u } from "./file.js";
import { onContent as g, onSetDev as y } from "./hooks.js";
import { whichWayUtil as f } from "./utill.js";
const m = {
  //普瑞赛斯
  puruisaisimrfz: {
    zaowuzhu: {
      name: "造物主",
      intro: ["博士，", "你想要的一切我都能实现"],
      effect: {
        changeSkill: ["bianyimrfz"],
        intro: [
          "·体力上限/初始体力值 + 1",
          "·变更技能组：",
          "【编译】",
          () => c.skillInfoTranslation("bianyimrfz")
        ],
        content(o) {
          o && (o.hp = 4, o.maxHp = 4);
        }
      }
    }
  },
  //嵯峨
  char_362_saga: {
    hechuxuntuo: {
      name: "何处寻驼？",
      intro: [
        "<font color='#8a2be2'>设计者：涵涵喵</font>",
        "温热的气息拂过脸庞，熟悉的景象开始在视野边缘生长。回过神来，周遭的一切已然与回忆中别无二致，老樟树下还倚着师兄亲手雕的木驮兽，黑毛的小牙兽正抱在上面磨着长牙。",
        "斗笠边沿毛毛刺刺的棕丝刮过她的额头，挟来熟悉的棉霉气味。嵯峨心里一惊，从眼前踱过的老僧不是别人，正是住持爷爷。她赶忙打起精神，端正姿态，但僵硬的腰背却不允许她挺起身子。当初下山时，年少的嵯峨才刚及住持爷爷的肩高，而如今，她已被上百个春天的落雨和上百个秋天的落叶压得佝偻龙钟，又一次只及住持爷爷的肩高了。",
        "“住持爷爷，小僧......”",
        "老住持似乎对她要说的话不以为意，只撇了撇头，示意她挪挪脚，然后毫不客气地将拖把伸了过来。她只得拖着沉重的双腿，一面颤颤巍巍避着拖把，一面磕磕巴巴诉说困惑。这拖把杆子嵯峨是认得的——那是住持爷爷曾经与她过招时所用的栎木杆。只是不知为何，如今它被绑上布条，成了擦地的拖把。",
        "“小僧......愚僧惭愧，但愚僧还有疑惑要求问！",
        "“愚僧在外游历，至今也有百年之久了，可到头来，却好像越来越糊涂了。初下山时，愚僧以为事物总有分明的道理，诚然世间种种都令人感到不解，但也处处皆有答案可寻，因此在夕先生的画卷中盘桓十载，也只觉得妙趣横生。",
        "“可后来，愚僧自认的道理全都没了道理。见得越多，就越觉得世间的人和事全是同一副模样。人活在世间不过都是拿一面镜子，或照着自己，或照着别人，然后四处取些色彩，在镜子里的人形上涂涂抹抹、修修补补罢了。人将那镜子涂得满满当当、密不透光，便以为自己通善恶、知真假了。愚僧求学问道上百年，最后瞅瞅行囊，得来的全是脏兮兮的镜子。愚僧不明白，如果世道净是如此，还能在何处见道？”",
        "待嵯峨说完，老住持才停下手中活计，抬头答道：“若你是驮兽，便能见道了。”说罢，不等她再发问，老住持便抄起拖把，直朝她脸上打来。",
        "",
        "嵯峨从梦中惊醒时已是正午。定睛一瞧，原来是同行的驮兽等得不耐烦，正用粗大的舌头舔刷着她的脸。",
        "“好了，走了！”"
      ],
      effect: {
        changeSkill: ["qianxianmrfz", "ziwumrfz"],
        intro: [
          "·变更技能组：",
          "【千相】",
          () => c.skillInfoTranslation("qianxianmrfz"),
          "【自悟】",
          () => c.skillInfoTranslation("ziwumrfz"),
          "【遁空】(非初始技能)",
          () => c.skillInfoTranslation("dunkongmrfz")
        ]
      }
    }
  }
}, w = Object.values(m).flatMap((o) => Object.keys(o)), r = window.whichWaySave.modulesSet;
class M {
  modules = {};
  modulesList = [];
  async init() {
    this.modules = {
      ...m
    }, this.modulesList.push(...w), g({
      name: "whichWayCharacterModules_init",
      fn: () => {
        this.initCharModules();
      }
    });
  }
  /**
   * 构造基础证章（`default`）模组。`intro` 会内嵌角色译名，故需传入角色名。
   */
  buildDefaultModule(e) {
    return {
      url: u.compilePath("mod:default.png"),
      name: "基础证章",
      id: "default",
      intro: ["基础证章，无特殊效果。", `${c.translation(e)}通过罗德岛人事部考核，准许参加外勤任务`, "特别颁发此证章", "以兹证明"]
    };
  }
  getCharModules(e, n = !0) {
    const t = c.itemtype(e) === "player" ? e.name : e;
    if (window.whichWaySave.hasChar(t) && this.modulesList.includes(t))
      throw new Error(`${t} 即是角色名也是模组名，请重新命名模组！`);
    if (t === "default") return this.buildDefaultModule(t);
    if (window.whichWaySave.hasChar(t)) {
      if (n)
        return r[t] ? this.getCharModules(r[t]) : this.buildDefaultModule(t);
      const i = { default: this.buildDefaultModule(t) }, a = this.modules[t];
      if (!a) return i;
      for (const s in a) {
        const h = a[s];
        h.url || (h.url = u.compilePath(`mod:${t}/${s}.png`)), h.id || (h.id = s), i[s] = h;
      }
      return i;
    }
    if (this.modulesList.includes(t))
      for (const i in this.modules) {
        const a = this.modules[i];
        if (Object.keys(a).includes(t))
          return {
            url: u.compilePath(`mod:${i}/${t}.png`),
            id: t,
            ...a[t]
          };
      }
    f.isDeveloperMode() && console.warn(`角色或模组 ${t} 不存在`);
  }
  /**
   * 设置角色的模组
   *
   * 如果尚未存在全局配置对象 `lib.config.sjzxModuleSet`，则会自动创建。
   * 如果未提供 `moduleName`，则默认使用 "default" 模组。
   * 如果指定的角色或模组不存在，则会抛出错误。
   *
   * @param {string} name - 角色名称，用于标识要设置模组的角色。
   * @param {string} [moduleName] - 要设置的模组名称，默认为 "default"。
   * @returns {string} 模组名。
   */
  setCharModules(e, n = "default") {
    const t = this.getCharModules(e, !1);
    if (!t) return n;
    if (!t[n]) throw new Error(`设置失败：${e} 的模组 ${n} 不存在`);
    return r[e] = n, f.saveConfig("modulesSet", r), this.initCharModules(), n;
  }
  initCharModules() {
    if (k.gameStarted) {
      for (let e of S.players)
        if (Object.keys(r).includes(e.name)) {
          let t = this.getCharModules(e);
          if (!t) continue;
          if (l.character[e.name].copySJZX || (l.character[e.name].copySJZX = {
            ...l.character[e.name]
          }), t.id === "default") {
            let { skills: i } = l.character[e.name].copySJZX;
            l.character[e.name].skills !== i && (e.removeSkill(l.character[e.name].skills), e.addSkill(i)), l.character[e.name] = l.character[e.name].copySJZX;
            continue;
          }
          if (t.effect) {
            let i = t.effect;
            if (i.content && i.content(l.character[e.name], e), i.changeSkill) {
              let a = Array.isArray(i.changeSkill) ? i.changeSkill : [i.changeSkill];
              e.removeSkill(e.getOriginalSkills()), e.addSkill(a), l.character[e.name].skills = a;
            }
          }
        }
    } else {
      this.clearCharModuleDefaultSet();
      for (let e in r) {
        let n = r[e], t = this.getCharModules(n), i = l.character[e];
        if (t && t.effect) {
          let a = t.effect;
          if (a.content && a.content(i), a.changeSkill) {
            let s = Array.isArray(a.changeSkill) ? a.changeSkill : [a.changeSkill];
            l.character[e].skills = s;
          }
        }
      }
    }
  }
  clearCharModuleDefaultSet() {
    for (let e in r)
      r[e] === "default" && delete r[e];
    return f.saveConfig("modulesSet", r), r;
  }
}
const d = new M();
await d.init();
y({
  name: "whichWayCharacterModules_setDev",
  fn: () => {
    window.whichWayCharacterModules = d;
  }
});
window.whichWay.register("characterModules", d);
export {
  d as whichWayCharacterModules
};
