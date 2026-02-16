import { whichWayCharacterCard } from "./index.js";
import { game, get, ui, lib } from "noname";
import { whichWaySkin } from "../skin/index.js";
import { whichWayAudio } from "../audio/index.js";
import { spineWorker } from "../skin/spineWork.js";
import { whichWayCharacterModules } from "../modules/index.js";
class WhichWayCharacterCardClick {
  get charImage() {
    return document.body.querySelector(".charImage");
  }
  get tool() {
    return whichWayCharacterCard;
  }
  findButton(name) {
    const btns = document.body.querySelectorAll(".btn-background");
    for (let btn of btns) {
      if (btn.dataset && btn.dataset.btnName === name) return btn;
    }
    return void 0;
  }
  getCharName() {
    return document.body.querySelector(".container-CC-SJZX").dataset.charName;
  }
  quit() {
    const target = this.findButton("quit");
    const displayArenaSJZX = document.querySelector(".displayArenaSJZX");
    const btnSelected = document.querySelector(".btn-selected-SJZX");
    if (btnSelected) btnSelected.classList.remove("btn-selected-SJZX");
    target.classList.add("btn-selected-SJZX");
    this.showResumeChar(displayArenaSJZX, this.getCharName());
  }
  skill() {
    const target = this.findButton("skill");
    const displayArenaSJZX = document.querySelector(".displayArenaSJZX");
    const btnSelected = document.querySelector(".btn-selected-SJZX");
    if (btnSelected) btnSelected.classList.remove("btn-selected-SJZX");
    target.classList.add("btn-selected-SJZX");
    this.showCharSkill(displayArenaSJZX, this.getCharName());
  }
  async skin() {
    const target = this.findButton("skin");
    const displayArenaSJZX = document.querySelector(".displayArenaSJZX");
    const btnSelected = document.querySelector(".btn-selected-SJZX");
    if (btnSelected) btnSelected.classList.remove("btn-selected-SJZX");
    target.classList.add("btn-selected-SJZX");
    await this.showSkinChar(displayArenaSJZX, this.getCharName());
  }
  mode() {
    const target = this.findButton("mode");
    const displayArenaSJZX = document.querySelector(".displayArenaSJZX");
    const btnSelected = document.querySelector(".btn-selected-SJZX");
    if (btnSelected) btnSelected.classList.remove("btn-selected-SJZX");
    target.classList.add("btn-selected-SJZX");
    this.showCharModules(displayArenaSJZX, this.getCharName());
  }
  async toggleSkin(e) {
    let name = this.getCharName();
    let skin = whichWaySkin.getCurentSkin(name);
    await spineWorker.toggleDycSkin(name, skin);
    let target = e.currentTarget;
    let buttonText = target.querySelector(".buttonText");
    target.classList.toggle("buttonWrapper-enableSkinBG");
    if (buttonText) buttonText.innerHTML = spineWorker.isEnabledSkin(name, skin) ? "关闭动皮" : "开启动皮";
    await spineWorker.updateDyc(name, this.charImage);
    for (let player of game.players) {
      if (get.name(player) === name) await spineWorker.updateDyc(name, player);
    }
  }
  async showCharSkill(container, name) {
    container.replaceChildren();
    let skills = get.character(name).skills;
    let derivation = {};
    skills.forEach((skill) => {
      let info = get.info(skill);
      if (info.derivation) derivation[skill] = Array.isArray(info.derivation) ? info.derivation : [info.derivation];
    });
    for (let skill of skills) {
      const skillWrapper = ui.create.div(".skillWrapper", container);
      const headWrapper = ui.create.div(".headWrapper", skillWrapper);
      const dragHandle = ui.create.div(".dragHandle", headWrapper);
      dragHandle.innerHTML = "≡";
      const skillname = ui.create.div(".skillname", headWrapper);
      skillname.innerHTML = get.translation(skill);
      const audioBtn = ui.create.div(".audioBtn", headWrapper);
      audioBtn.addEventListener("click", async (e) => {
        whichWayAudio.playSkillAudio(skill, name);
      });
      let info = get.info(skill);
      if (typeof info.frequent === "boolean") {
        const autoSkill = ui.create.div(".autoSkill", headWrapper);
        autoSkill.innerHTML = `自动发动`;
        let isAuto = lib.config.autoskilllist.includes(skill) ? false : info.frequent;
        autoSkill.classList.add(isAuto ? "autoSkillOpened" : "autoSkillClosed");
        autoSkill.dataset.auto = isAuto;
        autoSkill.addEventListener("click", async function(e) {
          let target = e.currentTarget;
          if (target === null) return;
          if (target.dataset.auto === "true") {
            target.dataset.auto = "false";
            target.classList.remove("autoSkillOpened");
            target.classList.add("autoSkillClosed");
            lib.config.autoskilllist.add(skill);
          } else {
            target.dataset.auto = "true";
            target.classList.remove("autoSkillClosed");
            target.classList.add("autoSkillOpened");
            if (lib.config.autoskilllist.includes(skill)) lib.config.autoskilllist.remove(skill);
          }
          game.saveConfig("autoskilllist", lib.config.autoskilllist);
        });
      }
      const skillInfo = ui.create.div(".skillInfo", skillWrapper);
      let str = get.skillInfoTranslation(skill, void 0, false);
      if (lib.translate[`${skill}_append`]) str += `<br>${get.translation(`${skill}_append`)}`;
      skillInfo.innerHTML = str;
      if (derivation[skill])
        derivation[skill].forEach((dskill) => {
          const dskillWrapper = ui.create.div(".skillWrapper", container);
          const dheadWrapper = ui.create.div(".headWrapper", dskillWrapper);
          const ddragHandle = ui.create.div(".dragHandle", dheadWrapper);
          ddragHandle.innerHTML = "≡";
          const dskillname = ui.create.div(".dskillname", dheadWrapper);
          dskillname.innerHTML = get.translation(dskill);
          const daudioBtn = ui.create.div(".audioBtn", dheadWrapper);
          daudioBtn.addEventListener("click", async () => {
            whichWayAudio.playSkillAudio(skill, name);
          });
          let dinfo = get.info(dskill);
          if (typeof dinfo.frequent === "boolean") {
            const dautoSkill = ui.create.div(".autoSkill", dheadWrapper);
            dautoSkill.innerHTML = `自动发动`;
            let isAuto = lib.config.autoskilllist.includes(dskill) ? false : dinfo.frequent;
            dautoSkill.classList.add(isAuto ? "autoSkillOpened" : "autoSkillClosed");
            dautoSkill.dataset.auto = isAuto;
            dautoSkill.addEventListener("click", async function(e) {
              let target = e.currentTarget;
              if (target.dataset.auto === "true") {
                target.dataset.auto = "false";
                target.classList.remove("autoSkillOpened");
                target.classList.add("autoSkillClosed");
                lib.config.autoskilllist.add(dskill);
              } else {
                target.dataset.auto = "true";
                target.classList.remove("autoSkillClosed");
                target.classList.add("autoSkillOpened");
                if (lib.config.autoskilllist.includes(dskill)) lib.config.autoskilllist.remove(dskill);
              }
              game.saveConfig("autoskilllist", lib.config.autoskilllist);
            });
          }
          const dskillInfo = ui.create.div(".skillInfo", dskillWrapper);
          let str2 = get.skillInfoTranslation(dskill, void 0, false);
          if (lib.translate[`${dskill}_append`]) str2 += `<br>${get.translation(`${dskill}_append`)}`;
          dskillInfo.innerHTML = str2;
        });
    }
  }
  async showResumeChar(container, name) {
    container.replaceChildren();
    const charInfoText = get.characterIntro(name);
    const charInfoWrapper = ui.create.div(".charInfoWrapper", container);
    const charTitle = ui.create.div(".charTitle", charInfoWrapper);
    charTitle.innerHTML = "干员档案";
    const charInfo = ui.create.div(".charInfo", charInfoWrapper);
    charInfo.innerHTML = charInfoText;
    const gloryTitle = ui.create.div(".charTitle", charInfoWrapper);
    gloryTitle.innerHTML = "光荣之路";
    ui.create.div(".charInfo", charInfoWrapper, {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center"
    });
  }
  async showCharModules(container, name) {
    container.replaceChildren();
    const modules = whichWayCharacterModules.getCharModules(name, false);
    for (let key in modules) {
      let info = modules[key];
      const charModulesWrapper = ui.create.div(".charModulesWrapper", container);
      charModulesWrapper.dataset.moduleId = key;
      const modulesTitle = ui.create.div(".modulesTitle", charModulesWrapper);
      modulesTitle.innerHTML = info.name;
      const modulesInfoWrapper = ui.create.div(".modulesInfoWrapper", charModulesWrapper);
      const modulesImage = ui.create.div(".modulesImage", modulesInfoWrapper);
      modulesImage.style.backgroundImage = "url(" + info.url + ")";
      const modulesInfo = ui.create.div(".modulesInfo", modulesInfoWrapper);
      let intro = Array.isArray(info.intro) ? info.intro : [info.intro];
      modulesInfo.style.height = getComputedStyle(modulesInfoWrapper).height;
      for (let text of intro) {
        ui.create.div(".infoText", modulesInfo).innerHTML = text;
      }
      if (info.effect) {
        const modulesEffectTitle = ui.create.div(".modulesEffectTitle", charModulesWrapper);
        modulesEffectTitle.innerHTML = `模组效果`;
        const modulesEffectInfo = ui.create.div(".modulesEffectInfo", charModulesWrapper);
        modulesEffectInfo.innerHTML = await initIntro(info.effect.intro);
      }
      let current = whichWayCharacterModules.getCharModules(name);
      if (current.id === key) {
        ui.create.div(".modulesSelectedSJZX", charModulesWrapper);
        charModulesWrapper.classList.add("modulesSelectedWrapper");
      }
      charModulesWrapper.addEventListener("click", async (e) => {
        let target = e.currentTarget;
        let selected = document.querySelector(".modulesSelectedWrapper");
        if (target.classList.contains("modulesSelectedWrapper")) return;
        selected.classList.remove("modulesSelectedWrapper");
        selected.removeChild(selected.querySelector(".modulesSelectedSJZX"));
        target.classList.add("modulesSelectedWrapper");
        ui.create.div(".modulesSelectedSJZX", target);
        whichWayCharacterModules.setCharModules(name, target.dataset.moduleId);
        if (!lib.config.noMentionModulesChange && lib.config.extension_whitherHelm_sjzxAutoReloadByChooseModule) {
          let c = confirm("更换模组后部分效果需要重启才能生效，即将自动重启（如果不希望自动重启请去设置里关闭“更换模组自动重启游戏”）！选择“确定”则不再弹出此提示");
          if (c) lib.config.noMentionModulesChange = true;
          game.saveConfig("noMentionModulesChange", lib.config.noMentionModulesChange);
        }
        if (lib.config.extension_whitherHelm_sjzxAutoReloadByChooseModule) game.reload();
      });
    }
    async function initIntro(intro) {
      if (!intro) {
        console.warn("intro 不存在");
        return "";
      }
      intro = Array.isArray(intro) ? intro : [intro];
      for (let i = 0; i < intro.length; i++) {
        let content = intro[i];
        if (typeof content === "function") intro[i] = content();
      }
      return intro.join("<br>");
    }
  }
  async showSkinChar(container, name) {
    container.replaceChildren();
    const skinList = whichWaySkin.getCharacterSkin(name);
    for (const skinname in skinList) {
      const path = skinList[skinname];
      const skinListWrapper = ui.create.div(".skinListWrapper", container);
      const skinAvatorWrapper = ui.create.div(".skinAvatorWrapper", skinListWrapper);
      const imageSkin = ui.create.div(".imageSkin", skinAvatorWrapper);
      imageSkin.style.backgroundImage = "url(" + path + ")";
      const skinTextWrapper = ui.create.div(".skinTextWrapper", skinListWrapper);
      const skinText = ui.create.div(".skinText", skinTextWrapper);
      skinText.innerHTML = `${skinname}`;
      skinListWrapper.dataset.skinUrl = path;
      skinListWrapper.dataset.skinName = skinname;
      skinListWrapper.dataset.charName = name;
      skinListWrapper.addEventListener("click", async (e) => {
        let target = e.currentTarget;
        let selected = document.querySelector(".skinListSelectedWrapper");
        let skinUrl = target.dataset.skinUrl;
        let skinName = target.dataset.skinName;
        let charName = target.dataset.charName;
        if (target.classList.contains("skinListSelectedWrapper")) return;
        if (selected) {
          selected.classList.remove("skinListSelectedWrapper");
          selected.removeChild(selected.querySelector(".skinSelectedSJZX"));
        }
        target.classList.add("skinListSelectedWrapper");
        ui.create.div(".skinSelectedSJZX", target);
        whichWaySkin.setCharacterSkin(charName, skinName);
        this.tool.updateSkinImage(skinName, skinUrl, name);
        whichWaySkin.refreshSkin();
      });
      if (whichWaySkin.getCurentSkin(name) === skinname) {
        ui.create.div(".skinSelectedSJZX", skinListWrapper);
        skinListWrapper.classList.add("skinListSelectedWrapper");
      }
    }
  }
}
const whichWayCharacterCardClick = new WhichWayCharacterCardClick();
export {
  whichWayCharacterCardClick
};
//# sourceMappingURL=click.js.map
