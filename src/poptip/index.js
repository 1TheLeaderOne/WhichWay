import { lib, get } from "noname";
import { onSetDev, onArenaReady } from "../hooks/index.js";
import { WhichWayPopTipsConfig } from "./poptip.js";
class WhichWayPoptip {
  constructor() {
    this.registerPopTip(WhichWayPopTipsConfig);
    onArenaReady({
      name: "WhichWayPoptip_init",
      fn: () => {
        this.compilePopTipTranslate(window.whichWaySave.allSkills);
      },
      priority: 1e4
    });
  }
  /**
   * 注册过的popTip
   */
  popTips = {};
  /**
   * 编译popTip，会将derivation内的技能标注出来
   * @param {object | Array<string>} skills - 技能对象
   * @returns {void}
   */
  compilePopTipTranslate(skills) {
    if (Array.isArray(skills)) {
      skills = skills.reduce((obj, name) => {
        obj[name] = lib.skill[name];
        return obj;
      }, {});
    }
    for (let name in skills) {
      let info = skills[name];
      if (info.derivation) {
        let derivations = Array.isArray(info.derivation) ? info.derivation : [info.derivation];
        for (let maySkill of derivations) {
          if (lib.translate[maySkill]) {
            let infoTrans = `${name}_info`;
            if (lib.translate[infoTrans] && lib.translate[infoTrans].includes(get.translation(maySkill))) {
              let cnMaySkill = get.translation(maySkill);
              let index = lib.translate[infoTrans].indexOf(cnMaySkill) - 1;
              let splicing = "";
              for (let i = 0; i < cnMaySkill.length + 2; i++) {
                splicing += lib.translate[infoTrans][index + i];
              }
              lib.translate[infoTrans] = lib.translate[infoTrans].replaceAll(splicing, get.poptip(maySkill));
            }
          }
        }
      }
    }
  }
  /**
   * 注册poptip
   * @param {Record<string,WhichWayPopTipConfig>} popTips
   * @returns {void}
   */
  registerPopTip(popTips) {
    let popTipList = [];
    for (let name in popTips) {
      if (name in this.popTips) {
        console.warn(`popTip ${name} 已存在`);
        continue;
      }
      let info = popTips[name];
      if (!info.id) info.id = `sjzx_${name}`;
      if (!info.name) info.name = name;
      if (!info.info) info.info = `无详细信息`;
      if (!Array.isArray(info.info)) info.info = [info.info];
      if (info.trim !== void 0 && info.trim !== false) {
        if (info.trim === true) info.info[0] = `『${info.info[0]}』`;
        else if (typeof info.trim === "number" || Array.isArray(info.trim)) {
          info.trim = Array.isArray(info.trim) ? info.trim : [info.trim];
          for (let i = 0; i < info.info.length; i++) {
            if (info.trim.includes(i)) info.info[i] = `『${info.info[i]}』`;
          }
        }
      }
      info.info = info.info.join("<br>");
      if (!info.sourceInfo) info.info = `${info.info}<br><font color="red">来自驶舰之向</font>`;
      else info.info = `${info.info}<br><font color="red">来自${info.sourceInfo}</font>`;
      popTipList.push(info);
      this.popTips[name] = info;
    }
    if (popTipList.length > 0) {
      popTipList.forEach((i) => lib.poptip.add(i));
    }
  }
}
const whichWayPoptip = new WhichWayPoptip();
onSetDev({
  name: "whichWayPoptip_dev",
  fn: () => {
    window.whichWayPoptip = whichWayPoptip;
  },
  priority: 0
});
window.whichWay.register("poptip", whichWayPoptip);
export {
  whichWayPoptip
};
//# sourceMappingURL=index.js.map
