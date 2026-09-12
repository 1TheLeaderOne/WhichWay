import { lib } from "noname";
import { createApp } from "vue";
import ModeCarousel from "./ModeCarousel.vue.js";
import { buildLaunchPadItems } from "./data.js";
import { registerLaunchPadConfig } from "./config.js";
import { LAUNCH_PAD_ID, LAUNCH_PAD_NAME, isLaunchPadEnabled } from "./setting.js";
import { applyLaunchPadStyle, ensureLaunchPadDefault, isLaunchPadActive } from "./setting.js";
let registered = false;
function isLaunchPadRegistered() {
  return registered;
}
class WhichWayCarouselSplash {
  id = LAUNCH_PAD_ID;
  name = LAUNCH_PAD_NAME;
  app = null;
  /** 启动页渲染：把 node 变为全屏轮播，用户点选模式后 resolve(mode) */
  async init(node, resolve) {
    const items = buildLaunchPadItems();
    if (!items.length) {
      resolve(lib.config.mode);
      node.remove();
      return;
    }
    node.id = "mcb-host";
    node.style.cssText = "position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;background:#0c0e13!important;z-index:2147483000!important;";
    node.classList.add("mcb-host-root");
    let bg = "";
    try {
      const u = lib.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/bg.jpg");
      bg = u.href || "";
    } catch {
      bg = "";
    }
    this.app = createApp(ModeCarousel, {
      items,
      bg,
      onPick: (mode) => {
        this.dispose(node);
        resolve(mode);
      }
    });
    this.app.mount(node);
  }
  /** 点击进入后的清理：卸载组件、移除节点（自行管理，返回 true 告知引擎） */
  async dispose(node) {
    try {
      if (this.app) {
        this.app.unmount();
        this.app = null;
      }
    } catch {
    }
    try {
      node.remove();
    } catch {
    }
    return true;
  }
  /** 外观设置里的样式小预览 */
  async preview(node) {
    node.className = "button character";
    node.style.width = "200px";
    node.style.height = `${node.offsetWidth * 9 / 16}px`;
    node.style.display = "flex";
    node.style.flexDirection = "column";
    node.style.alignItems = "center";
    node.style.backgroundSize = "100% 100%";
    try {
      const u = lib.init.parseResourceAddress("ext:WhichWay/image/splash/carousel/whichway_preview.png");
      node.setBackgroundImage(u.href);
    } catch (e) {
      console.warn("[launchPad] 预览图加载失败", e);
    }
  }
}
function registerLaunchPadSplash() {
  try {
    const list = lib.onloadSplashes;
    if (!Array.isArray(list)) return false;
    const existed = list.some((s) => s.id === LAUNCH_PAD_ID);
    if (!existed) {
      list.push(new WhichWayCarouselSplash());
    }
    registered = true;
    registerLaunchPadConfig();
    console.info(
      `[launchPad] 启动页样式已注册：${LAUNCH_PAD_NAME}（${LAUNCH_PAD_ID}），设置项状态：${isLaunchPadEnabled() ? "开启" : "关闭"}（可在 选项→扩展→WhichWay 或 选项→外观→启动页 调整）`
    );
    return !existed;
  } catch (e) {
    console.error("[launchPad] 启动页样式注册失败（不影响扩展本体）", e);
    return false;
  }
}
export {
  LAUNCH_PAD_ID,
  LAUNCH_PAD_NAME,
  applyLaunchPadStyle,
  ensureLaunchPadDefault,
  isLaunchPadActive,
  isLaunchPadEnabled,
  isLaunchPadRegistered,
  registerLaunchPadSplash
};
