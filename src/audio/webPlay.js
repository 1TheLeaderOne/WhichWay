import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.js";
import { whichWayToast } from "../toast/index.js";
class whichWayWebPlay {
  /**
   * 创建webPlay组件
   *
   * 在线配音是**按 (技能, 干员) 一对一**的：同一个共享技能（如阵营技）由不同干员使用时，
   * 应当播放各自干员的 PRTS 配音，而不是共用一份。因此实例由 whichWayAudio 以
   * 二级 Map（技能 → 干员 → 实例）统一持有，不再挂在 lib.skill[skill].whichWayWebPlay 上。
   *
   * @param {string} skill 配音技能名
   * @param {string} char 角色名
   * @param {string[]} [voices] 配音标题，为空时按 (技能, 干员) 取/生成
   * @param {string} [audioBaseName] 本地下载时的文件名前缀（共享技能为「技能_干员」）
   */
  constructor(skill, char, voices = [], audioBaseName) {
    this.skill = skill;
    this.char = char;
    this.audioBaseName = audioBaseName || skill;
    this.voicesTitle = voices.length > 0 ? voices.slice() : whichWayAudio.getSkillVoices(skill, char);
  }
  /**
   * PRTS路径
   */
  resourceUrl = `https://torappu.prts.wiki/`;
  skill;
  char;
  /**
   * 本地下载时使用的文件名前缀（不含序号与扩展名）
   */
  audioBaseName;
  voicesTitle = [];
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
}
export {
  whichWayWebPlay
};
