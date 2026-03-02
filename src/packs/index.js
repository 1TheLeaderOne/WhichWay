import __variableDynamicImportRuntimeHelper from "../../_virtual/dynamic-import-helper.js";
import { lib, get } from "noname";
import { whichWayFile } from "../file.js";
import { onSetDev, onBeforeInit } from "../hooks/index.js";
import { pendingRun, registerExecute, packHooks } from "./hooks.js";
import { initCharConfig } from "../character/extCharConfig.js";
import { designer, getDesigner } from "../character/index.js";
import { whichWayUtil } from "../utill.js";
import { groupData } from "../character/groups.js";
import { whichWayArknight } from "../arknight/index.js";
class WhichWayPackManager {
  static CHARACTER_PACKS = [
    "epicSJZX",
    "legendSJZX",
    "especialSJZX",
    "plotSJZX",
    "specialSJZX",
    "rareSJZX",
    "mediocreSJZX",
    "normalSJZX"
  ];
  /**
   * 初始化
   */
  async init() {
    this.pendingRun = pendingRun;
    await this.initCharacterPack();
    registerExecute("translate", (trans, name) => {
      if (trans.endsWith("_prefix")) {
        let tran = this.setNamePrefix(name);
        trans = tran.name || trans;
      }
      trans = whichWayUtil.colorize(trans);
      return trans;
    });
    onBeforeInit({
      name: "whichWayPackManager_init",
      fn: async () => {
        for (const fn of this.pendingRun) {
          await fn();
        }
      }
    });
  }
  async initCharacterPack() {
    const { files, folders } = await whichWayFile.getFileTree("src:packs/character/");
    for (const file of files) {
      const name = whichWayFile.removeExt(file.name);
      if (!name.endsWith("mrfz")) continue;
      await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${name}.js`, 3);
    }
    for (const folder of folders) {
      if (!folder.name.endsWith("mrfz")) continue;
      for (const file of folder.files) {
        try {
          await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${folder.name}/index.js`, 4);
        } catch (e) {
          await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./character/wangmrfz/index.ts": () => import("./character/wangmrfz/index.js") }), `./character/${folder.name}/index.ts`, 4);
        }
      }
    }
    this.register();
    for (const name of WhichWayPackManager.CHARACTER_PACKS) {
      lib.characterPack[name] ??= {};
      if (!lib.config.characters.includes(name)) lib.config.characters.push(name);
      let translate = lib.config.extension_WhichWay_compatibleMode === true ? `驶舰:${this.getPackTranslation(name)}` : "<img style='width:90px;height:25px;' src=" + lib.assetURL + `extension/WhichWay/image/decoration/${this.getPackTranslation(name, 1)}.png>`;
      lib.translate[`${name}_character_config`] = translate;
    }
    registerExecute("character", (char, name) => {
      if (Array.isArray(char)) char = get.convertedCharacter(char);
      char.img = whichWayFile.compilePath(`img:character/${name}.jpg`);
      char = initCharConfig(char);
      char.whichWay.reallyGroup = char.group;
      char.whichWay.charId = name;
      if (!char.pack) {
        char.pack = "specialSJZX";
      }
      lib.characterPack[char.pack][name] ??= char;
      if (char.designer) {
        char.whichWay.designer = Array.isArray(char.designer) ? char.designer : [char.designer];
        designer[name] ??= [];
        designer[name].push(...char.whichWay.designer.filter((designer2) => !char.designer[name].includes(designer2)));
      } else {
        char.whichWay.designer = getDesigner(char, false, true);
      }
      if (!whichWayUtil.config("unityGroup")) {
        if (this._addedGroup === false) {
          this._addedGroup = true;
          let data = groupData;
          for (let key in data) {
            lib.group.push(key);
            lib.groupnature[key] = key;
            lib.translate[key] = data[key].group;
            lib.translate[key + "2"] = data[key].group;
          }
        }
      } else {
        char.group = "sjzx_group";
        if (!lib.translate["sjzx_group"]) lib.translate["sjzx_group"] = "泰拉";
      }
      whichWayArknight.addShcema(name);
      whichWayArknight.initCharArknight(char);
      return char;
    });
  }
  getPackTranslation(str, index) {
    let translateMap = {
      legendSJZX: ["6星", "SJZXStar6"],
      epicSJZX: ["5星", "SJZXStar5"],
      rareSJZX: ["4星", "SJZXStar4"],
      normalSJZX: ["3星", "SJZXStar3"],
      especialSJZX: ["2星", "SJZXStar2"],
      mediocreSJZX: ["1星", "SJZXStar1"],
      plotSJZX: ["剧情", "SJZXPlot"],
      specialSJZX: ["特殊", "SJZXSpecial"]
    };
    return translateMap[str][index ? index : 0];
  }
  setNamePrefix(obj) {
    const layout = {
      amiya: {
        color: "#191970",
        nature: "woodmm"
      }
    };
    const defaultColor = {
      color: "#00FFFF",
      nature: "woodmm"
    };
    if (typeof obj === "string") {
      obj = {
        name: obj,
        ...defaultColor
      };
    }
    if (layout[obj.layout]) {
      obj = {
        name: obj.name,
        ...layout[obj.layout]
      };
    }
    lib.namePrefix.set(obj.name, {
      color: obj.color,
      nature: obj.nature
    });
    return obj;
  }
  /**
   * 为allCharacters和allSkills添加数据
   */
  register() {
    const characters = this._hooks.getHooks("character");
    const skills = this._hooks.getHooks("skill");
    for (const char of characters) {
      const name = char.key;
      if (!window.whichWaySave.allCharacters.includes(name)) {
        window.whichWaySave.allCharacters.push(name);
      }
    }
    for (const skill of skills) {
      const name = skill.key;
      if (!window.whichWaySave.allSkills.includes(name)) {
        window.whichWaySave.allSkills.push(name);
      }
    }
  }
  pendingRun = [];
  _addedGroup = false;
  _hooks = packHooks;
}
const whichWayPackManager = new WhichWayPackManager();
await whichWayPackManager.init();
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
