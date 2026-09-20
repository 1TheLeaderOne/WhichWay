import { get as o, _status as m, game as k, lib as a } from "noname";
import { whichWayFile as f } from "./file-CXhVBbUa.js";
import { onContent as y, onSetDev as S } from "./hooks-BscfO9lD.js";
import { whichWayUtil as u } from "./utill-DpF3UCI4.js";
const h = {
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
          () => o.skillInfoTranslation("bianyimrfz")
        ],
        content(d, e) {
          e && (e.hp = 4, e.maxHp = 4);
        }
      }
    }
  },
  //嵯峨
  cuoemrfz: {
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
          () => o.skillInfoTranslation("qianxianmrfz"),
          "【自悟】",
          () => o.skillInfoTranslation("ziwumrfz"),
          "【遁空】(非初始技能)",
          () => o.skillInfoTranslation("dunkongmrfz")
        ]
      }
    }
  }
}, g = Object.entries(h).flatMap(
  ([d, e]) => Object.entries(e).map(([r, l]) => l.id ?? r)
), s = window.whichWaySave.modulesSet;
class w {
  modules = {};
  modulesList = [];
  async init() {
    this.modules = {
      ...h
    }, this.modulesList.push(...g), y({
      name: "whichWayCharacterModules_init",
      fn: () => {
        this.initCharModules();
      }
    });
  }
  /**
   * 获取指定角色的所有可用模组或当前装备的模组。
   *
   * 如果 `current` 为 true，则返回该角色当前激活的模组（若存在），否则返回默认模组。
   * 如果 `current` 为 false，则返回该角色在 `modulesList` 中定义的所有模组；
   * 若该角色未定义任何模组，则返回一个默认的基础模组。
   *
   * @param {string | Player} name - 角色名或者模组名
   * @param {boolean} [current=true] - 是否只获取当前激活的模组（仅name为角色名时有效）。
   * @returns {Object} 返回一个表示模组或模组集合的对象。
   *
   * @example
   * // 获取当前激活模组
   * const currentModule = getCharModules('character1');
   *
   * // 获取所有可用模组
   * const allModules = getCharModules('character1', false);
   */
  getCharModules(e, r = !0) {
    o.itemtype(e) === "player" && (e = o.name(e));
    const l = {
      default: {
        url: f.compilePath("mod:default.png"),
        name: "基础证章",
        id: "default",
        intro: ["基础证章，无特殊效果。", `${o.translation(e)}通过罗德岛人事部考核，准许参加外勤任务`, "特别颁发此证章", "以兹证明"]
      }
    };
    if (window.whichWaySave.hasChar(e) && this.modulesList.includes(e))
      throw new Error(`${e} 即是角色名也是模组名，请重新命名模组！`);
    if (e === "default") return l.default;
    if (window.whichWaySave.hasChar(e)) {
      if (r)
        return s[e] ? this.getCharModules(s[e]) : l.default;
      if (!Object.keys(this.modules).includes(e)) return l;
      let t = {
        default: l.default,
        ...this.modules[e]
      };
      for (let i in t) {
        let n = t[i];
        n.url || (n.url = f.compilePath(`mod:${e}/${i}.png`)), n.id || (n.id = i);
      }
      return t;
    } else if (this.modulesList.includes(e))
      for (let t in this.modules) {
        let i = this.modules[t];
        if (Object.keys(i).includes(e))
          return {
            url: f.compilePath(`mod:${t}/${e}.png`),
            id: e,
            /** @ts-ignore */
            ...i[e]
          };
      }
    u.isDeveloperMode() && console.warn(`角色或模组 ${e} 不存在`);
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
  setCharModules(e, r) {
    if (r || (r = "default"), !this.getCharModules(e, !1)[r]) throw new Error(`设置失败：${e} 的模组 ${r} 不存在`);
    return s[e] = r, u.saveConfig("modulesSet", s), this.initCharModules(), r;
  }
  initCharModules() {
    if (m.gameStarted)
      k.players.forEach((e) => {
        if (Object.keys(s).includes(e.name)) {
          let l = this.getCharModules(e);
          if (a.character[e.name].copySJZX || (a.character[e.name].copySJZX = {
            ...a.character[e.name]
          }), l.id === "default") {
            let { skills: t } = a.character[e.name].copySJZX;
            a.character[e.name].skills !== t && (e.removeSkill(a.character[e.name].skills), e.addSkill(t)), a.character[e.name] = a.character[e.name].copySJZX;
            return;
          }
          if (l.effect) {
            let t = l.effect;
            if (t.content && t.content(e, a.character[e.name]), t.changeSkill) {
              let i = Array.isArray(t.changeSkill) ? t.changeSkill : [t.changeSkill];
              e.removeSkill(e.getOriginalSkills()), e.addSkill(i), a.character[e.name].skills = i;
            }
          }
        }
      });
    else {
      this.clearCharModuleDefaultSet();
      for (let e in s) {
        let r = s[e], l = this.getCharModules(r), t = a.character[e];
        if (l.effect) {
          let i = l.effect;
          if (i.content && i.content(void 0, t), i.changeSkill) {
            let n = Array.isArray(i.changeSkill) ? i.changeSkill : [i.changeSkill];
            a.character[e].skills = n;
          }
        }
      }
    }
  }
  clearCharModuleDefaultSet() {
    for (let e in s)
      s[e] === "default" && delete s[e];
    return u.saveConfig("modulesSet", s), s;
  }
}
const c = new w();
await c.init();
S({
  name: "whichWayCharacterModules_setDev",
  fn: () => {
    window.whichWayCharacterModules = c;
  }
});
window.whichWay.register("characterModules", c);
export {
  c as whichWayCharacterModules
};
