import { whichWayUtil } from "../../utill.js";
import { _status, lib } from "noname";
const skillSave = window.whichWaySave.customFucSave.skill;
class SkillCustomFunc {
  /**
   * 使一些卡牌在使用吉占时隐藏花色和数字
   * @param { Card } card
   * @param { Player } player
   *
   * @returns { Card }
   */
  invisableJiZhan(card, player) {
    let el = whichWayUtil.config("enable", "十周年UI") ? card.querySelector(".suit-num") : card.querySelector(".info");
    if (el) el.classList.add("fuckJiZhan");
    else card.classList.add("fuckJiZhan");
    if (!skillSave.eventStackIsProxy) {
      skillSave.eventStackIsProxy = true;
      _status.eventManager.eventStack = new Proxy(_status.eventManager.eventStack, {
        set(t, p, v, r) {
          let event = t[t.length - 1];
          if (!event) {
            return Reflect.set(t, p, v, r);
          }
          let evt = event.getParent("oljizhan");
          let tag = `${player.playerid}_oljizhan`;
          if (Object.keys(evt).length > 0 && !skillSave.hiddenCardInJiZhan.includes(tag)) {
            skillSave.hiddenCard.add(tag);
            whichWayUtil.setCSSVariable("--SJZX-fuckJiZhan", 0);
          } else if (Object.keys(evt).length === 0 && skillSave.hiddenCardInJiZhan.includes(tag)) {
            skillSave.hiddenCard.remove(tag);
            whichWayUtil.setCSSVariable("--SJZX-fuckJiZhan", 1);
          }
          return Reflect.set(t, p, v, r);
        }
      });
    }
    return card;
  }
  /**
   * 获取技能音频文件的路径
   *
   * 该函数用于构建指定技能的音频文件路径。如果技能不存在，则会输出警告并返回 undefined。
   * 音频路径基于技能的 logAudio 或 audio 属性生成，并可选择性地附加数字后缀。
   *
   * @param {string} skill - 技能名称，用于查找对应的音频资源
   * @param {number|number[]} [num] - 可选的音频文件编号，用于指定具体哪一个音频文件（如 skill1.mp3, skill2.mp3）
   *                                  如果传入数组，则会返回多个音频路径
   * @returns {string|string[]|undefined} 返回音频文件路径:
   *                                      - 如果没有提供 num 参数，返回基础路径字符串
   *                                      - 如果提供了 num 参数，返回对应音频文件路径的数组
   *                                      - 如果技能不存在则返回 undefined
   *
   */
  getSkillAudioPath(skill, num) {
    if (!lib.skill[skill]) {
      console.warn(`技能${skill}不存在`);
      return void 0;
    }
    if (!Array.isArray(num) && num !== void 0) num = [num];
    let path = lib.skill[skill].logAudio ? lib.skill[skill].logAudio() : lib.skill[skill].audio;
    path = path.replace(path.slice(-2), "");
    return num ? num.map((i) => path + `/${skill}${i}.mp3`) : path;
  }
  /**
   * 定义 setter 和 getter
   * @param {object} target - 目标对象。
   *
   * @param {object} target - 目标对象。
   * @param {string | string[]} prop - 属性名或属性名数组。
   * @param {(() => any) | (() => any)[]=} get - getter 函数或函数数组。
   * @param {((value: any) => void) | ((value: any) => void)[]=} set - setter 函数或函数数组。
   */
  defineAccessor(target, prop, get2, set) {
    const hasValidGet = typeof get2 === "function" || Array.isArray(get2) && get2.some((fn) => typeof fn === "function");
    const hasValidSet = typeof set === "function" || Array.isArray(set) && set.some((fn) => typeof fn === "function");
    if (!hasValidGet && !hasValidSet) {
      throw new Error("get 和 set 至少有一个是 function!");
    }
    if (Array.isArray(prop)) {
      for (let i = 0; i < prop.length; i++) {
        let g = get2?.[i] || get2?.[0] || get2;
        let s = set?.[i] || set?.[0] || set;
        this.defineAccessor(target, prop[i], g, s);
      }
    }
    Object.defineProperty(target, prop, {
      get: typeof get2 === "function" ? get2 : void 0,
      set: typeof set === "function" ? set : void 0,
      enumerable: true,
      configurable: true
    });
  }
}
const skillCustomFunc = new SkillCustomFunc();
export {
  skillCustomFunc
};
//# sourceMappingURL=skill.js.map
