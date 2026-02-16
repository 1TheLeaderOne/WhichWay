import { ui } from "noname";
import { createApp } from "vue";
import { onSetDev, onArenaReady, onContent } from "../hooks/index.js";
import Main from "./main.vue.js";
import { whichWayUtil } from "../utill.js";
class WhichWayConfigUI {
  constructor() {
    this.app = this.createApp();
    this.vueInstance = null;
    this.mainComponent = null;
    onArenaReady({
      name: "configUI_system",
      fn: () => {
        ui.create.system("驶舰之向", () => {
          this.show();
        });
      }
    });
    onContent({
      name: "configUI_initBackground",
      fn: () => {
        whichWayUtil.setBgI();
      }
    });
  }
  app;
  vueInstance;
  mainComponent;
  /**
   * 创建vue应用的容器
   * @returns {HTMLElement}
   */
  createApp() {
    const app = ui.create.div(".whichWayConfigUIApp", document.body);
    app.style.width = "100%";
    app.style.height = "100%";
    app.style.position = "absolute";
    app.style.top = "0px";
    app.style.left = "0px";
    app.style.zIndex = "19";
    app.style.display = "none";
    return app;
  }
  /**
   * 打开快速配置界面
   */
  show() {
    if (!this.vueInstance) {
      this.vueInstance = createApp(Main);
      this.mainComponent = this.vueInstance.mount(this.app);
    }
    if (this.mainComponent?.show) {
      this.mainComponent.show();
    }
  }
  toggle() {
    if (this.mainComponent?.toggle) {
      this.mainComponent.toggle();
    }
  }
  hide() {
    if (this.mainComponent?.hide) {
      this.mainComponent.hide();
    }
  }
}
const whichWayConfigUI = new WhichWayConfigUI();
onSetDev({
  name: "whichWayConfigUI_setDev",
  fn: () => {
    window.whichwayConfigUI = whichWayConfigUI;
  }
});
window.whichWay.register("configUI", whichWayConfigUI);
export {
  whichWayConfigUI
};
//# sourceMappingURL=index.js.map
