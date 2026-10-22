import { onConfig as g, onContent as y, onArenaReady as w, onSetDev as S } from "./hooks.js";
import { whichWayFile as o } from "./file.js";
import { whichWayToast as I } from "./toast.js";
import { whichWayUtil as a } from "./utill.js";
import { get as U, lib as h } from "noname";
import { s as l } from "./skin-PortraitLayers-shared.js";
class b {
  prefixPath = "extension/十周年UI/";
  /**
   * 启用的十周年UI的动皮效果
   * @type {[string]}
   */
  enableDecadeUISpineEffect = a.config("enableDecadeUISpineEffect") || ["effect_youxikaishi", "effect_shoujidonghua", "../../../十周年UI/assets/animation/globaltexiao/shanghaishuzi/SZN_shuzi", "effect_jisha1", "effect_xianding", "../../../十周年UI/assets/animation/globaltexiao/huifushuzi/shuzi2"];
  copys = [
    [o.compilePath("img:decadeUI/group/name_sjzx_group.png"), `${this.prefixPath}image/styles/decade/`],
    [o.compilePath("img:decadeUI/images/name2_sjzx_group.png"), `${this.prefixPath}image/styles/shousha/`]
  ];
  async init() {
    g({
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
            a.config("enable", "十周年UI") ? s.setDecadeUIAnimation(i) : I.showToast("您已关闭了十周年UI，请勿使用此功能！");
          }
        }
      }
    }), a.config("enable", "十周年UI") && (this.noTipsCopyFile !== !0 && await this.copy(), a.config("banDecadeUIAnimation") !== "enable" && this.setDecadeUIAnimation(a.config("banDecadeUIAnimation"), !0));
  }
  async copy() {
    const i = window.confirm("【驶舰之向】:是否将素材导入至十周年UI？");
    this.noTipsCopyFile = !0, i === !0 && y({
      name: "WhichWay_decadeUI_copyFile",
      fn: async () => {
        for (const n of this.copys)
          await o.copyFile(n[0], n[1]);
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
    return i === "enable" ? decadeUI.AnimationPlayer.prototype.copyPlaySpine && (decadeUI.AnimationPlayer.prototype.playSpine = decadeUI.AnimationPlayer.prototype.copyPlaySpine, delete decadeUI.AnimationPlayer.prototype.copyPlaySpine) : n ? w({
      name: "WhichWay_decadeUI_setDecadeUIAnimation",
      fn: () => {
        this.setDecadeUIAnimation(i, !1);
      }
    }) : t(), a.saveConfig("banDecadeUIAnimation", i), i;
    function t() {
      if (decadeUI.AnimationPlayer.prototype.copyPlaySpine) return;
      const c = decadeUI.AnimationPlayer.prototype.playSpine;
      decadeUI.AnimationPlayer.prototype.copyPlaySpine = c, decadeUI.AnimationPlayer.prototype.playSpine = function(d, f) {
        const r = c.call(this, d, f);
        return a.isDeveloperMode() && !s.enableDecadeUISpineEffect.includes(r?.name) && console.log(r?.name), window.decadeUI && window.decadeUI.animation && a.config("banDecadeUIAnimation") === "partly" && !s.enableDecadeUISpineEffect.includes(r?.name) ? (window.decadeUI.animation.stopSpineAll(), window.decadeUI.animation.gl && window.decadeUI.animation.render(performance.now())) : a.config("banDecadeUIAnimation") === "disable" && (document.querySelector(".animation-player").style.display = "none"), r;
      };
      const u = decadeUI.AnimationPlayerPool.prototype.playSpineTo;
      decadeUI.AnimationPlayerPool.prototype.playSpineTo = function(d, f, r) {
        if (a.config("banDecadeUIAnimation") !== "disable")
          return u.call(this, d, f, r);
      };
    }
  }
  get noTipsCopyFile() {
    return a.config("noTipsCopyFile");
  }
  set noTipsCopyFile(i) {
    a.saveConfig("noTipsCopyFile", i);
  }
  get banDecadeUIAnimation() {
    return a.config("banDecadeUIAnimation");
  }
  set banDecadeUIAnimation(i) {
    a.saveConfig("banDecadeUIAnimation", i);
  }
}
const s = new b();
await s.init();
const A = o.compilePath("qs:"), m = {
  isExt: !0,
  filterCharacter: function(e) {
    return window.whichWaySave.hasChar(e);
  },
  characterNameTranslate: function(e) {
    return U.translation(e);
  },
  prefix: "extension/WhichWay/image/illustration/character/",
  skin: {
    standard: A
  },
  /**
   * 额外皮肤（动皮对应的静皮）。名字必须是**动皮名**：千幻用
   * `i.skinId.substring(0, 最后一个点)` 与动皮名比（`qhly_getSkinModels`），名字对上了才不会
   * 再补一张 `皮肤名.jpg`（那张必然 404，于是同一张皮肤出现两张卡片）。
   * @param {string} name 干员id
   * @returns {{ name: string, skinName: string }[]}
   */
  getAdditionalSkins: function(e) {
    return window.whichWaySave.hasChar(e) ? l.getDynamicSkinEntries().filter((i) => i.name === e) : [];
  },
  /**
   * **千幻真正会调用的路径解析钩子**（`qhly_getSkinFile` / `setBackground` / `setBackgroundImage`
   * 三处都先问它）。返回本扩展解析出的**磁盘上真实存在**的文件路径，千幻拿到就直接贴图，
   * 绕开它自己的「`skin.standard + 干员id + "/" + 皮肤名`」拼接。
   *
   * 为什么必须有它：千幻的静皮文件名不一定是皮肤名（`夏卉` ↔ `夏卉 FA075.png`、`时遗` ↔ `时遗14.png`），
   * 它自己拼路径必然 404；而且扩展的静皮是 png，它默认补的却是 `.jpg`。
   *
   * ⚠️ 返回值必须是**不带 `lib.assetURL`** 的相对路径：千幻拿到后还会自己拼
   * （`content.js:11131` 的 `img.src = lib.assetURL + file`，以及 `setBackgroundImage` 内部
   * 也走 `polyfill.ts` 的 `url("${lib.assetURL}${img}")`）。带了前缀就是双重前缀、必然 404
   * —— 这正是「千幻读不到皮肤」的第二个根因。
   * 本扩展自己的绘制侧（`whichWaySkin.skinPathOf` / `avatarBackground`）另走 `toCssUrl` 补前缀，
   * 两边互不影响。
   * @param {string} name 干员id
   * @param {string} skin 皮肤名或文件名（可能带扩展名）
   * @returns {string | undefined} 解析不到时返回 undefined，让千幻走它自己的默认规则
   */
  replaceAvatarDestination: function(e, i) {
    if (typeof e != "string" || e.length === 0 || !window.whichWaySave.hasChar(e) || typeof i != "string" || i.length === 0) return;
    const n = o.removeExt(i);
    if (n === "经典形象") return `extension/WhichWay/image/illustration/character/${o.getCharacterPortraitFile(e)}`;
    const t = l.getStaticSkinFileName(e, n);
    if (t)
      return `extension/WhichWay/image/illustration/skin/${e}/${t}`;
  },
  /**
   * 千幻列皮肤时用它过滤（`qhly_getSkinList` 的 `handleHide`）。用来挡掉
   * **本身没有静皮、只有动作数据**的动皮条目（`时遗2`、`远行前的野餐`、`重装芯片`…），
   * 否则千幻会给它们各补一张 `皮肤名.jpg`，变成一堆点开是空图的卡片。
   * @param {string} name 干员id
   * @param {string} skin 皮肤文件名
   * @returns {boolean} true 表示隐藏
   */
  hideSkin: function(e, i) {
    if (typeof e != "string" || !window.whichWaySave.hasChar(e) || typeof i != "string" || i.length === 0) return !1;
    const n = o.removeExt(i);
    if (n === "经典形象" || l.getStaticSkinFileName(e, n)) return !1;
    const t = window.whichWaySave?.dycSave?.assets?.[e];
    return !!(t && n in t && !l.isStandaloneDynamicSkin(e, n));
  },
  /**
   * 卡片显示名：认不出来的返回 undefined，让千幻按它自己的默认规则取名。
   * @param {string} name 干员id
   * @param {string} skinName 皮肤名
   * @returns {{ translation: string, info: string } | undefined}
   */
  skininfo: function(e, i) {
    if (!(typeof i != "string" || i.length === 0) && i === o.removeExt(o.getCharacterPortraitFile(e)))
      return { translation: "经典形象", info: "" };
  },
  // 本扩展没有为千幻准备台词 / 立绘 / 原画补充信息，交给千幻的默认实现
  characterTaici: function() {
    return null;
  },
  characterLihui: function() {
    return null;
  },
  /** 千幻卡片「原画」页的补充信息（`qhly_getOriginSkinInfo` 会问它），本扩展没有额外内容 */
  originSkinInfo: function() {
    return "";
  }
};
h.qhlypkg || (h.qhlypkg = []);
h.qhlypkg.push(m);
const P = m, W = function() {
  let e;
  if (a.config("enable", "皮肤切换")) {
    e = { ...window.whichWaySave.dycSave.assets };
    for (let i in e) {
      let n = e[i];
      for (let t in n) {
        let c = n[t];
        Array.isArray(c.action) && (c.action = c.action[0]);
      }
    }
    decadeUI.dynamicSkin || (decadeUI.dynamicSkin = {}), Object.assign(decadeUI.dynamicSkin, e), skinSwitch.saveSkinParams || (skinSwitch.saveSkinParams = {}), Object.assign(skinSwitch.saveSkinParams, e);
  }
};
class x {
  async init() {
    this.qianhuan = P, this.decade = s, this.skinSwitch = W, y({
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
const p = new x();
await p.init();
S({
  name: "whichWayExtCompatible_setDev",
  fn() {
    window.whichWayExtCompatible = p;
  }
});
window.whichWay.register("extCompatible", p);
export {
  p as whichWayExtCompatible
};
