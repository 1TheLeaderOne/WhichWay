import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.js";
import { whichWayToast } from "../toast/index.js";
class whichWayWebPlay {
  /**
   * 创建webPlay组件
   * @param {string} skill 配音技能名
   * @param {string} char 角色名
   * @param {string[]} [voices] 配音标题
   */
  constructor(skill, char, voices = []) {
    this.skill = skill;
    this.char = char;
    this.voicesTitle = voices.length > 0 ? voices : this.randomGetVoicesTilte();
  }
  /**
   * PRTS路径
   */
  resourceUrl = `https://torappu.prts.wiki/`;
  skill;
  char;
  voicesTitle = [];
  defaultVoicesTitle = ["选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4"];
  get useLocalAudio() {
    return whichWayUtil.config("useLocalAudio") || false;
  }
  get lang() {
    return whichWayAudio.getSkillLang(this.skill, this.char);
  }
  get voiceUrl() {
    return this.voicesTitle.map((title) => whichWayAudio.compileVoicePath(this.char, this.lang, title));
  }
  get autoDownloadAudio() {
    return whichWayUtil.config("autoDownloadAudio") || false;
  }
  play() {
    const audio = new Audio(this.voiceUrl.randomGet());
    audio.play();
    if (!whichWayUtil.config("noTipUseWeb")) {
      whichWayToast.showToast(`[驶舰之向] 正在使用网络!`);
    }
    if (this.autoDownloadAudio) {
      whichWayAudio.downloadAudio(this.skill, this.char, this.voiceUrl, this.lang);
    }
    return audio;
  }
  randomGetVoicesTilte() {
    const audioConfig = window.whichWaySave.audioConfig;
    if (audioConfig.onlineVoicesTitle[this.skill]) return audioConfig.onlineVoicesTitle[this.skill];
    let titles = this.defaultVoicesTitle.randomGets(2);
    audioConfig.onlineVoicesTitle[this.skill] = titles;
    return titles;
  }
}
export {
  whichWayWebPlay
};
//# sourceMappingURL=webPlay.js.map
