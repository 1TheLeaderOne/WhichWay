import { whichWayFile } from "../file.js";
import { onConfig, onContent, onArenaReady } from "../hooks/index.js";
import { whichWayToast } from "../toast/index.js";
import { whichWayUtil } from "../utill.js";
class DecadeExtCompatible {
  prefixPath = "extension/十周年UI/";
  /**
   * 启用的十周年UI的动皮效果
   * @type {[string]}
   */
  enableDecadeUISpineEffect = whichWayUtil.config("enableDecadeUISpineEffect") || ["effect_youxikaishi", "effect_shoujidonghua", "../../../十周年UI/assets/animation/globaltexiao/shanghaishuzi/SZN_shuzi", "effect_jisha1", "effect_xianding", "../../../十周年UI/assets/animation/globaltexiao/huifushuzi/shuzi2"];
  copys = [
    [whichWayFile.compilePath("img:decadeUI/group/name_sjzx_group.png"), `${this.prefixPath}image/styles/decade/`],
    [whichWayFile.compilePath("img:decadeUI/images/name2_sjzx_group.png"), `${this.prefixPath}image/styles/shousha/`]
  ];
  async init() {
    onConfig({
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
          onclick: (item) => {
            if (whichWayUtil.config("enable", "十周年UI")) {
              decadeExtCompatible.setDecadeUIAnimation(item);
            } else {
              whichWayToast.showToast("您已关闭了十周年UI，请勿使用此功能！");
            }
          }
        }
      }
    });
    if (!whichWayUtil.config("enable", "十周年UI")) return;
    if (this.noTipsCopyFile !== true) await this.copy();
    if (whichWayUtil.config("banDecadeUIAnimation") !== "enable") {
      this.setDecadeUIAnimation(whichWayUtil.config("banDecadeUIAnimation"), true);
    }
  }
  async copy() {
    const confirm = window.confirm(`【驶舰之向】:是否将素材导入至十周年UI？`);
    this.noTipsCopyFile = true;
    if (confirm !== true) return;
    onContent({
      name: "WhichWay_decadeUI_copyFile",
      fn: async () => {
        for (const copy of this.copys) {
          await whichWayFile.copyFile(copy[0], copy[1]);
        }
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
  setDecadeUIAnimation(item, arenReady = false) {
    if (item === "enable") {
      if (decadeUI.AnimationPlayer.prototype.copyPlaySpine) {
        decadeUI.AnimationPlayer.prototype.playSpine = decadeUI.AnimationPlayer.prototype.copyPlaySpine;
        delete decadeUI.AnimationPlayer.prototype.copyPlaySpine;
      }
    } else {
      if (arenReady) {
        onArenaReady({
          name: "WhichWay_decadeUI_setDecadeUIAnimation",
          fn: () => {
            this.setDecadeUIAnimation(item, false);
          }
        });
      } else {
        disableAnimation();
      }
    }
    whichWayUtil.saveConfig("banDecadeUIAnimation", item);
    return item;
    function disableAnimation() {
      const originalPlaySpine = decadeUI.AnimationPlayer.prototype.playSpine;
      decadeUI.AnimationPlayer.prototype.copyPlaySpine = decadeUI.animation.playSpine;
      decadeUI.AnimationPlayer.prototype.playSpine = function(sprite, position) {
        const result = originalPlaySpine.call(this, sprite, position);
        if (whichWayUtil.isDeveloperMode() && !decadeExtCompatible.enableDecadeUISpineEffect.includes(result?.name)) console.log(result?.name);
        if (window.decadeUI && window.decadeUI.animation && whichWayUtil.config === "partly" && !decadeExtCompatible.enableDecadeUISpineEffect.includes(result?.name)) {
          window.decadeUI.animation.stopSpineAll();
          if (window.decadeUI.animation.gl) window.decadeUI.animation.render(performance.now());
        } else if (whichWayUtil.config("banDecadeUIAnimation") === "disable") {
          document.querySelector(".animation-player").style.display = "none";
        }
        return result;
      };
      const originalPlaySpineTo = decadeUI.AnimationPlayerPool.prototype.playSpineTo;
      decadeUI.AnimationPlayerPool.prototype.playSpineTo = function(element, animation, position) {
        if (whichWayUtil.config("banDecadeUIAnimation") === "disable") return;
        return originalPlaySpineTo.call(this, element, animation, position);
      };
    }
  }
  get noTipsCopyFile() {
    return whichWayUtil.config("noTipsCopyFile");
  }
  set noTipsCopyFile(value) {
    whichWayUtil.saveConfig("noTipsCopyFile", value);
  }
  get banDecadeUIAnimation() {
    return whichWayUtil.config("banDecadeUIAnimation");
  }
  set banDecadeUIAnimation(value) {
    whichWayUtil.saveConfig("banDecadeUIAnimation", value);
  }
}
const decadeExtCompatible = new DecadeExtCompatible();
await decadeExtCompatible.init();
export {
  decadeExtCompatible
};
//# sourceMappingURL=decade.js.map
