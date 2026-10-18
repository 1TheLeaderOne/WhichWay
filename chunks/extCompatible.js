import { onConfig as U, onContent as h, onArenaReady as I, onSetDev as g } from "./hooks.js";
import { whichWayFile as d } from "./file.js";
import { whichWayToast as u } from "./toast.js";
import { whichWayUtil as e } from "./utill.js";
import { get as w, lib as p } from "noname";
class b {
  prefixPath = "extension/十周年UI/";
  /**
   * 启用的十周年UI的动皮效果
   * @type {[string]}
   */
  enableDecadeUISpineEffect = e.config("enableDecadeUISpineEffect") || ["effect_youxikaishi", "effect_shoujidonghua", "../../../十周年UI/assets/animation/globaltexiao/shanghaishuzi/SZN_shuzi", "effect_jisha1", "effect_xianding", "../../../十周年UI/assets/animation/globaltexiao/huifushuzi/shuzi2"];
  copys = [
    [d.compilePath("img:decadeUI/group/name_sjzx_group.png"), `${this.prefixPath}image/styles/decade/`],
    [d.compilePath("img:decadeUI/images/name2_sjzx_group.png"), `${this.prefixPath}image/styles/shousha/`]
  ];
  async init() {
    U({
      priority: 600,
      name: "WhichWay_decadeUI_addConfig",
      obj: {
        name: "banDecadeUIAnimation",
        options: {
          name: "十周年动画效果",
          intro: "可以关闭十周年UI的动画效果，在一定程度上避免动画纹理缺失导致的白屏",
          init: "enable",
          item: {
            enable: "启用",
            partly: "部分启用",
            disable: "关闭"
          },
          onclick: (i) => {
            e.config("enable", "十周年UI") ? c.setDecadeUIAnimation(i) : u.showToast("您已关闭了十周年UI，请勿使用此功能！");
          }
        }
      }
    }), e.config("enable", "十周年UI") && (this.noTipsCopyFile !== !0 && await this.copy(), e.config("banDecadeUIAnimation") !== "enable" && this.setDecadeUIAnimation(e.config("banDecadeUIAnimation"), !0));
  }
  async copy() {
    const i = window.confirm("【驶舰之向】:是否将素材导入至十周年UI？");
    this.noTipsCopyFile = !0, i === !0 && h({
      name: "WhichWay_decadeUI_copyFile",
      fn: async () => {
        for (const n of this.copys)
          await d.copyFile(n[0], n[1]);
      }
    });
  }
  /**
   * 控制是否显示十周年UI的部分动画
   *
   *
   * @param {"enable" | "disable" | "partly"} item - 是否显示十年UI动画画布
   *   - true: 显示所有动画
   *   - partly : 显示部分动画
   *   - false: 隐藏部分动画
   * @param {boolean} [arenReady=false] - 是否在游戏准备就绪后执行隐藏操作
   *   - true: 游戏准备就绪后执行
   *   - false: 立即执行隐藏操作
   * @returns {boolean | undefined} 返回传入的bool参数值，十周年UI未开启时为undefined
   */
  setDecadeUIAnimation(i, n = !1) {
    return i === "enable" ? decadeUI.AnimationPlayer.prototype.copyPlaySpine && (decadeUI.AnimationPlayer.prototype.playSpine = decadeUI.AnimationPlayer.prototype.copyPlaySpine, delete decadeUI.AnimationPlayer.prototype.copyPlaySpine) : n ? I({
      name: "WhichWay_decadeUI_setDecadeUIAnimation",
      fn: () => {
        this.setDecadeUIAnimation(i, !1);
      }
    }) : s(), e.saveConfig("banDecadeUIAnimation", i), i;
    function s() {
      if (decadeUI.AnimationPlayer.prototype.copyPlaySpine) return;
      const t = decadeUI.AnimationPlayer.prototype.playSpine;
      decadeUI.AnimationPlayer.prototype.copyPlaySpine = t, decadeUI.AnimationPlayer.prototype.playSpine = function(l, r) {
        const o = t.call(this, l, r);
        return e.isDeveloperMode() && !c.enableDecadeUISpineEffect.includes(o?.name) && console.log(o?.name), window.decadeUI && window.decadeUI.animation && e.config("banDecadeUIAnimation") === "partly" && !c.enableDecadeUISpineEffect.includes(o?.name) ? (window.decadeUI.animation.stopSpineAll(), window.decadeUI.animation.gl && window.decadeUI.animation.render(performance.now())) : e.config("banDecadeUIAnimation") === "disable" && (document.querySelector(".animation-player").style.display = "none"), o;
      };
      const f = decadeUI.AnimationPlayerPool.prototype.playSpineTo;
      decadeUI.AnimationPlayerPool.prototype.playSpineTo = function(l, r, o) {
        if (e.config("banDecadeUIAnimation") !== "disable")
          return f.call(this, l, r, o);
      };
    }
  }
  get noTipsCopyFile() {
    return e.config("noTipsCopyFile");
  }
  set noTipsCopyFile(i) {
    e.saveConfig("noTipsCopyFile", i);
  }
  get banDecadeUIAnimation() {
    return e.config("banDecadeUIAnimation");
  }
  set banDecadeUIAnimation(i) {
    e.saveConfig("banDecadeUIAnimation", i);
  }
}
const c = new b();
await c.init();
p.qhlypkg || (p.qhlypkg = []);
const m = {
  isExt: !0,
  filterCharacter: function(a) {
    return window.whichWaySave.hasChar(a);
  },
  characterNameTranslate: function(a) {
    return w.translation(a);
  },
  prefix: "extension/WhichWay/image/illustration/character/",
  skin: {
    standard: "extension/WhichWay/image/illustration/skin/"
  }
};
p.qhlypkg.push(m);
const S = m, A = function() {
  let a;
  if (e.config("enable", "皮肤切换")) {
    a = { ...window.whichWaySave.dycSave.assets };
    for (let i in a) {
      let n = a[i];
      for (let s in n) {
        let t = n[s];
        Array.isArray(t.action) && (t.action = t.action[0]);
      }
    }
    decadeUI.dynamicSkin || (decadeUI.dynamicSkin = {}), Object.assign(decadeUI.dynamicSkin, a), skinSwitch.saveSkinParams || (skinSwitch.saveSkinParams = {}), Object.assign(skinSwitch.saveSkinParams, a);
  }
};
class P {
  async init() {
    this.qianhuan = S, this.decade = c, this.skinSwitch = A, h({
      name: "whichWayExtCompatible_skinSwitch",
      fn: () => {
        this.skinSwitch();
      }
    });
  }
  /**
   * 千幻相关配置
   * @type {any}
   */
  qianhuan;
  decade;
  skinSwitch;
}
const y = new P();
await y.init();
g({
  name: "whichWayExtCompatible_setDev",
  fn() {
    window.whichWayExtCompatible = y;
  }
});
window.whichWay.register("extCompatible", y);
export {
  y as whichWayExtCompatible
};
