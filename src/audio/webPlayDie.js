import { whichWayToast } from "../toast/index.js";
import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.js";
class whichWayWebPlayDie {
  constructor(char) {
    this.that = char.whichWay;
  }
  that;
  voicesTitle = ["行动失败"];
  get useLocalAudio() {
    return whichWayUtil.config("useLocalAudio") || false;
  }
  get lang() {
    return whichWayAudio.getCharacterLang(this.that.charId);
  }
  get voiceUrl() {
    return this.voicesTitle.map((title) => whichWayAudio.compileVoicePath(this.that.charId, this.lang, title));
  }
  play() {
    const audio = new Audio(this.voiceUrl.randomGet());
    audio.play();
    if (!whichWayUtil.config("noTipUseWeb")) {
      whichWayToast.showToast(`[驶舰之向] 正在使用网络!`);
    }
    return audio;
  }
}
export {
  whichWayWebPlayDie
};
//# sourceMappingURL=webPlayDie.js.map
