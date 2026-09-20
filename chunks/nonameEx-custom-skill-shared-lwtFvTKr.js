import { whichWayUtil as d } from "./utill-DpF3UCI4.js";
import { _status as h, lib as u } from "noname";
const r = window.whichWaySave.customFucSave.skill;
class y {
  /**
   * 使一些卡牌在使用吉占时隐藏花色和数字
   * @param { Card } card
   * @param { Player } player
   *
   * @returns { Card }
   */
  invisableJiZhan(t, n) {
    let e = d.config("enable", "十周年UI") ? t.querySelector(".suit-num") : t.querySelector(".info");
    return e ? e.classList.add("fuckJiZhan") : t.classList.add("fuckJiZhan"), r.eventStackIsProxy || (r.eventStackIsProxy = !0, h.eventManager.eventStack = new Proxy(h.eventManager.eventStack, {
      set(i, o, l, a) {
        let s = i[i.length - 1];
        if (!s)
          return Reflect.set(i, o, l, a);
        let c = s.getParent("oljizhan"), f = `${n.playerid}_oljizhan`;
        return Object.keys(c).length > 0 && !r.hiddenCardInJiZhan.includes(f) ? (r.hiddenCard.add(f), d.setCSSVariable("--SJZX-fuckJiZhan", 0)) : Object.keys(c).length === 0 && r.hiddenCardInJiZhan.includes(f) && (r.hiddenCard.remove(f), d.setCSSVariable("--SJZX-fuckJiZhan", 1)), Reflect.set(i, o, l, a);
      }
    })), t;
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
  getSkillAudioPath(t, n) {
    if (!u.skill[t]) {
      console.warn(`技能${t}不存在`);
      return;
    }
    !Array.isArray(n) && n !== void 0 && (n = [n]);
    let e = u.skill[t].logAudio ? u.skill[t].logAudio() : u.skill[t].audio;
    return e = e.replace(e.slice(-2), ""), n ? n.map((i) => e + `/${t}${i}.mp3`) : e;
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
  defineAccessor(t, n, e, i) {
    const o = typeof e == "function" || Array.isArray(e) && e.some((a) => typeof a == "function"), l = typeof i == "function" || Array.isArray(i) && i.some((a) => typeof a == "function");
    if (!o && !l)
      throw new Error("get 和 set 至少有一个是 function!");
    if (Array.isArray(n))
      for (let a = 0; a < n.length; a++) {
        let s = e?.[a] || e?.[0] || e, c = i?.[a] || i?.[0] || i;
        this.defineAccessor(t, n[a], s, c);
      }
    Object.defineProperty(t, n, {
      get: typeof e == "function" ? e : void 0,
      set: typeof i == "function" ? i : void 0,
      enumerable: !0,
      configurable: !0
    });
  }
}
const A = new y();
export {
  A as s
};
