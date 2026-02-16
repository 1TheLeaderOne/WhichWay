import { ui, lib, get, game } from "noname";
import { whichWayFile } from "../file.js";
import { whichWayCharacterCardClick } from "./click.js";
import { whichWayUtil } from "../utill.js";
import { whichWaySkin } from "../skin/index.js";
import { getCamp, getDesigner } from "../character/index.js";
import { whichWayAudio } from "../audio/index.js";
import { whichWayToast } from "../toast/index.js";
import Sortable from "../../lib/Sortable/Sortable.js";
import { onSetDev, onContent, onConfig } from "../hooks/index.js";
import { whichWayArknight } from "../arknight/index.js";
import { whichWayAPIOverride } from "../override/index.js";
import { spineWorker } from "../skin/spineWork.js";
import { whichWayCharacterModules } from "../modules/index.js";
class WhichWayCharacterCard {
  constructor() {
    onContent({
      name: "whichWayCharacterCardStyleOverride_add",
      fn() {
        Object.defineProperty(ui.click, "charactercard", {
          value: ui.click.charactercard,
          writable: true,
          configurable: true,
          enumerable: true
        });
        whichWayAPIOverride.appendHook("ui.click.charactercard", {
          before: async function(name, sourcenode, noedit, resume, avatar, audioName) {
            if (whichWayUtil.config("enableWhichWayCharacterCardStyle")) {
              await whichWayCharacterCard.create(name, sourcenode, noedit, resume, avatar, audioName);
              return false;
            }
          }
        });
      }
    });
    onConfig({
      name: "whichWayCharacterCardStyleConfig_add",
      priority: 770,
      obj: {
        name: "enableWhichWayCharacterCardStyle",
        options: {
          name: "启用驶舰之向武将卡样式",
          intro: "开启后启用驶舰之向武将卡样式",
          init: true
        }
      }
    });
  }
  async create(name, sourcenode, noedit, resume, avatar, audioName) {
    const container = this.createBackground();
    container.dataset.charName = name;
    await this.createTopMenu(container, name);
    await this.createAudioSkinName(container, name);
    await this.createCharName(container, name);
    await this.createCharImageWrapper(container, name);
    await this.createCampLogo(container, name);
    await this.createDisplayArena(container, name);
    whichWayCharacterCardClick.skill();
  }
  /**
   * 角色卡牌初始化
   */
  async init() {
  }
  /**
   * 获取默认皮肤
   */
  getDefaultSkin(sex) {
    return `${whichWayFile.extDir}image/character/default_${sex}.png`;
  }
  getUrl(url, folder, ext = "png") {
    if (!url.endsWith(`.${ext}`) && typeof ext === "string" && ext.length > 0) url += `.${ext}`;
    if (folder) return whichWayFile.compilePath(`ui:${folder}/${url}`);
    return whichWayFile.compilePath(`ui:${url}`);
  }
  /**
   * 创建势力logo
   * @param { HTMLElement } container
   * @param { string } name
   */
  async createCampLogo(container, name) {
    const campWrapper = ui.create.div(".camplogo-wrapper", container);
    const imgDef = ui.create.div(".img-def", campWrapper);
    let camp = getCamp(name);
    if (camp) {
      const isNoname = !whichWayArknight.shcema.group.arknight.includes(camp);
      if (!isNoname) imgDef.classList.add("arknightCamp");
      let url = whichWayFile.extDir + "/image/camplogo/" + (isNoname ? "noname" : "arknight") + "/" + (isNoname ? "name_" : "") + getCamp(name) + ".png";
      imgDef.style.backgroundImage = "url(" + url + ")";
    } else {
      if (lib.translate[get.character(name).group]) {
        const groupText = ui.create.div(".group-text", imgDef);
        groupText.innerHTML = lib.translate[get.character(name).group];
      }
    }
    return campWrapper;
  }
  createBackground() {
    const bg = ui.create.div(".container-CC-SJZX", document.body);
    bg.style.backgroundImage = "url(" + this.getUrl("default", "background") + ")";
    return bg;
  }
  async createTopMenu(container, name) {
    const wrapper = ui.create.div(".topMenu-wrapper", container);
    const btnBack = ui.create.div(".btn-back", wrapper);
    btnBack.addEventListener("click", () => {
      document.body.removeChild(container);
      whichWaySkin.refreshSkin();
      game.resume2();
    });
    const btnBackImageBox = ui.create.div(".imageBox", btnBack);
    const imageBack = new Image();
    imageBack.src = this.getUrl("back");
    btnBackImageBox.appendChild(imageBack);
    await this.createTopMenuButton(
      wrapper,
      "QUIT",
      "简介",
      "resume",
      (e) => {
        whichWayCharacterCardClick.quit();
      },
      "quit"
    );
    this.createTopMenuButton(
      wrapper,
      "SKILL",
      "技能",
      "skill",
      (e) => {
        whichWayCharacterCardClick.skill();
      },
      "skill"
    );
    this.createTopMenuButton(
      wrapper,
      "SKIN",
      "皮肤",
      "skin",
      async (e) => {
        await whichWayCharacterCardClick.skin();
      },
      "skin"
    );
    if (whichWayCharacterModules.getCharModules(name, false))
      this.createTopMenuButton(
        wrapper,
        "MODE",
        "模组",
        "mode",
        async (e) => {
          await whichWayCharacterCardClick.mode();
        },
        "mode"
      );
    return wrapper;
  }
  async createTopMenuButton(container, en, cn, image, onclick, btnName) {
    const skinWrapper = ui.create.div(".btn-background", container);
    const outfitEnSJZX = ui.create.div(".btn-enSJZX", skinWrapper);
    outfitEnSJZX.innerHTML = en;
    const outfitCnSJZX = ui.create.div(".btn-cnSJZX", skinWrapper);
    outfitCnSJZX.innerHTML = cn;
    const btnImageWrapper = ui.create.div(".btnImage-wrapper", skinWrapper);
    const btnImage = new Image();
    btnImage.classList.add(".btn-image");
    btnImage.src = this.getUrl(image);
    btnImageWrapper.appendChild(btnImage);
    if (typeof onclick === "function") skinWrapper.addEventListener("click", onclick);
    if (btnName) skinWrapper.dataset.btnName = btnName;
    return skinWrapper;
  }
  async createAudioSkinName(container, name) {
    const wrapper = ui.create.div(".skinnameAudio-wrapper", container);
    const skinnameWrapper = ui.create.div(".skinnameWrapper", wrapper);
    const titleWrapper = ui.create.div(".titleWrapper", skinnameWrapper);
    const titleImageWrapper = ui.create.div(".imageWrapper", titleWrapper);
    const titleImage = new Image();
    titleImage.src = this.getUrl("painter");
    titleImageWrapper.appendChild(titleImage);
    const titleTextWrapper = ui.create.div(".textWrapper", titleWrapper);
    titleTextWrapper.innerHTML = whichWaySkin.getCurentSkin(name);
    const designerWrapper = ui.create.div(".designerWrapper", wrapper);
    const designerTitleWrapper = ui.create.div(".titleWrapper", designerWrapper);
    const designerTitleImageWrapper = ui.create.div(".imageWrapper", designerTitleWrapper);
    const designerTitleImage = new Image();
    designerTitleImage.classList.add("imageLimit");
    designerTitleImage.src = this.getUrl("designer");
    designerTitleImageWrapper.appendChild(designerTitleImage);
    const designerTextWrapper = ui.create.div(".textWrapper", designerTitleWrapper);
    designerTextWrapper.innerHTML = getDesigner(name).join("、");
    const audioWrapper = ui.create.div(".audioWrapper", wrapper);
    const audioTitleWrapper = ui.create.div(".audioTitleWrapper", audioWrapper);
    const audioImageWrapper = ui.create.div(".imageWrapper", audioTitleWrapper);
    const audioImage = new Image();
    audioImage.src = this.getUrl("cv");
    audioImageWrapper.appendChild(audioImage);
    const audioTextWrapper = ui.create.div(".textWrapper", audioTitleWrapper);
    audioTextWrapper.innerHTML = whichWayAudio.getCharacterLang(name, true);
    const audioCollapseWrapper = ui.create.div(".collapseWrapper", audioTitleWrapper);
    audioCollapseWrapper.dataset.collapse = "false";
    const audioCollapseImage = new Image();
    audioCollapseImage.src = this.getUrl("plus");
    audioCollapseImage.style.height = "50%";
    audioCollapseWrapper.appendChild(audioCollapseImage);
    audioCollapseWrapper.addEventListener("click", async (e) => {
      if (!window.whichWaySave.allCharacters.includes(name)) {
        whichWayToast.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
        return;
      }
      if (audioCollapseWrapper.dataset.collapse === "false") {
        audioCollapseWrapper.dataset.collapse = "true";
        audioCollapseImage.dataset.originalHeight = audioWrapper.style.height;
        audioWrapper.style.height = `${(1 + whichWayAudio.getCharacterAvailableLang(name).length) * 50}px`;
        audioCollapseImage.src = this.getUrl("sub");
      } else {
        audioCollapseWrapper.dataset.collapse = "false";
        audioWrapper.style.height = audioCollapseImage.dataset.originalHeight;
        audioCollapseImage.src = this.getUrl("plus");
      }
    });
    const audioContent = ui.create.div(".content", audioWrapper);
    let charSetAudio = whichWayAudio.getCharacterLang(name);
    for (let language of whichWayAudio.getCharacterAvailableLang(name)) {
      const selectWrapper = ui.create.div(".selectWrapper", audioContent);
      selectWrapper.dataset.choiceSJZX = language;
      if (language === charSetAudio) {
        ui.create.div(".choice", selectWrapper);
        const choiceContentTextWrapper = ui.create.div(".choice-contentTextWrapper", selectWrapper);
        const selectText = ui.create.div(".selectTextSJZX", choiceContentTextWrapper);
        selectText.innerHTML = whichWayArknight.getVoiceLangTranslation(language);
      } else {
        ui.create.div(".nochoice", selectWrapper);
        const nochoiceContentTextWrapper = ui.create.div(".nochoice-contentTextWrapper", selectWrapper);
        const selectText = ui.create.div(".selectTextSJZX", nochoiceContentTextWrapper);
        selectText.innerHTML = whichWayArknight.getVoiceLangTranslation(language);
      }
      selectWrapper.addEventListener("click", async (event) => {
        let target = event.currentTarget;
        let curLaunguage = target.dataset.choiceSJZX;
        if (target.dataset.choiceSJZX !== whichWayAudio.getCharacterLang(name)) {
          const choice = document.querySelector(".selectWrapper .choice");
          const choiceContent = document.querySelector(".selectWrapper .choice-contentTextWrapper");
          whichWayUtil.toggleClass([choice, target.querySelector(".selectWrapper .nochoice")], "choice", "nochoice");
          whichWayUtil.toggleClass([choiceContent, target.querySelector(".selectWrapper .nochoice-contentTextWrapper")], "choice-contentTextWrapper", "nochoice-contentTextWrapper");
          await whichWayAudio.setCustomAudio(name, curLaunguage).then(async () => {
            audioTextWrapper.innerHTML = whichWayAudio.getCharacterLang(name, true);
          });
        }
      });
    }
    return wrapper;
  }
  async createCharName(container, name) {
    const wrapper = ui.create.div(".charName-wrapper", container);
    const charNameTitleWrapper = ui.create.div(".charNameTitleWrapper", wrapper);
    const charNameTitle = ui.create.div(".charNameTitle", charNameTitleWrapper);
    charNameTitle.innerHTML = lib.characterTitle[name] ? lib.characterTitle[name] : "";
    const charNameTextWrapper = ui.create.div(".charNameTextWrapper", wrapper);
    const charNameText = ui.create.div(".charNameText", charNameTextWrapper);
    charNameText.innerHTML = get.translation(name);
    const hpWrapper = ui.create.div(".hpWrapper", wrapper);
    let charInfo = get.character(name);
    let { maxHp, hp, hujia } = charInfo;
    if (maxHp + hujia > 6) {
      const hpNumWrapper = ui.create.div(".hpNumWrapper", hpWrapper);
      ui.create.div(".actualHpSJZX", hpNumWrapper);
      const hpNumText = ui.create.div(".hpNumText", hpNumWrapper);
      hpNumText.innerHTML = `${hp}/${maxHp}`;
      if (hujia > 0) {
        const hpNumWrapper2 = ui.create.div(".hpNumWrapper", hpWrapper);
        ui.create.div(".shieldSJZX", hpNumWrapper2);
        const hpNumText2 = ui.create.div(".hpNumText", hpNumWrapper2);
        hpNumText2.innerHTML = `${hujia}`;
      }
    } else {
      for (let i = 0; i < maxHp; i++) {
        let num = i + 1;
        if (num <= hp) {
          ui.create.div(".actualHpSJZX", hpWrapper);
        } else {
          ui.create.div(".emptyHpSJZX", hpWrapper);
        }
      }
      for (let i = 0; i < hujia; i++) {
        ui.create.div(".shieldSJZX", hpWrapper);
      }
    }
    return wrapper;
  }
  async createCharImageWrapper(container, name) {
    const charImageWrapper = ui.create.div(".charImageWrapper", container);
    let url = whichWaySkin.getCurrentSkinPath(name);
    const charImage = ui.create.div(".charImage", charImageWrapper);
    charImage.style.backgroundImage = url.startsWith("url") ? url : "url(" + url + ")";
    await spineWorker.updateDyc(name, charImage);
    await this.createToggleSkin(name);
    return charImageWrapper;
  }
  /**
   * 创建关闭动皮的按钮
   * @param {String} name
   * @param {HTMLElement} [container]
   * @returns {Promise<HTMLElement>}
   */
  async createToggleSkin(name, container = document.querySelector(".charImageWrapper")) {
    const skin = whichWaySkin.getCurentSkin(name);
    const bottomUI = container.querySelector(".charSkinBottomUIWrapper");
    if (!spineWorker.getSkinData(name, skin)) {
      if (bottomUI) {
        bottomUI.style.display = "none";
        updateButton();
      }
      return bottomUI;
    }
    if (bottomUI) {
      bottomUI.style.display = "";
      updateButton();
      return bottomUI;
    }
    const charSkinBottomUIWrapper = ui.create.div(".charSkinBottomUIWrapper", container);
    const buttonWrapper = ui.create.div(".buttonWrapper", charSkinBottomUIWrapper);
    ui.create.div(".buttonText", buttonWrapper);
    buttonWrapper.addEventListener("click", async (e) => {
      await whichWayCharacterCardClick.toggleSkin(e);
    });
    updateButton();
    return charSkinBottomUIWrapper;
    function updateButton() {
      let wrapper = document.querySelector(".charSkinBottomUIWrapper .buttonWrapper");
      let text = document.querySelector(".charSkinBottomUIWrapper .buttonText");
      if (!wrapper || !text) return;
      if (spineWorker.isEnabledSkin(name, skin)) wrapper.classList.add("buttonWrapper-enableSkinBG");
      else wrapper.classList.remove("buttonWrapper-enableSkinBG");
      text.innerHTML = spineWorker.isEnabledSkin(name, skin) ? "关闭动皮" : "开启动皮";
    }
  }
  async createDisplayArena(container, name) {
    const displayArenaSJZX = ui.create.div(".displayArenaSJZX", container);
    new Sortable(displayArenaSJZX, {
      draggable: ".skillWrapper",
      animation: 150,
      handle: ".dragHandle"
    });
    return displayArenaSJZX;
  }
  async updateSkinImage(name, path, playerName) {
    const charImage = document.querySelector(".charImageWrapper .charImage");
    const skinName = document.querySelector(".skinnameWrapper .titleWrapper .textWrapper");
    if (charImage) {
      charImage.style.backgroundImage = "url(" + path + ")";
      await spineWorker.updateDyc(playerName, charImage);
    }
    if (skinName) skinName.innerHTML = name;
    await this.createToggleSkin(playerName);
  }
}
const whichWayCharacterCard = new WhichWayCharacterCard();
onSetDev({
  name: "whichwayCharacterCard_dev",
  fn: () => {
    window.whichWayCharacterCard = whichWayCharacterCard;
  }
});
window.whichWay.register("characterCard", whichWayCharacterCard);
export {
  whichWayCharacterCard
};
//# sourceMappingURL=index.js.map
