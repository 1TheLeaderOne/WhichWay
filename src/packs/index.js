import __variableDynamicImportRuntimeHelper from "../../_virtual/dynamic-import-helper.js";
import { whichWayFile } from "../file.js";
import { onSetDev, onContent } from "../hooks/index.js";
import { pendingRun } from "./hooks.js";
class WhichWayPackManager {
  /**
   * 初始化
   */
  async init() {
    this.pendingRun = pendingRun;
    await this.initCharacterPack();
    onContent({
      name: "whichWayPackManager_init",
      fn: async () => {
        for (const fn of this.pendingRun) {
          await fn();
        }
      }
    });
  }
  async initCharacterPack() {
    const { files, folders } = await whichWayFile.getFileTree("src:packs/character");
    for (const file of files) {
      const name = whichWayFile.removeExt(file.name);
      if (!name.endsWith("mrfz")) continue;
      await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${name}.js`, 3);
    }
    for (const folder of folders) {
      if (!folder.name.endsWith("mrfz")) continue;
      for (const file of folder.files) {
        if (file.name === "index.js") {
          await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./character/wangmrfz/index.js": () => import("./character/wangmrfz/index.js") }), `./character/${folder.name}/index.js`, 4);
        } else if (file.name === "index.ts") {
          await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${folder.name}/index.ts`, 4);
        }
      }
    }
  }
  pendingRun = [];
}
const whichWayPackManager = new WhichWayPackManager();
whichWayPackManager.init();
window.whichWay.register("packManager", whichWayPackManager);
onSetDev({
  name: "whichWayPackManager_Dev",
  fn: () => {
    window.whichWayPackManager = whichWayPackManager;
  }
});
export {
  whichWayPackManager
};
//# sourceMappingURL=index.js.map
