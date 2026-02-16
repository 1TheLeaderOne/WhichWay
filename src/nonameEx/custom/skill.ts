import { whichWayUtil } from "../../utill.js";
import { lib, game, ui, get, ai, _status, Game, Get } from "noname";

const skillSave = window.whichWaySave.customFucSave.skill;

class SkillCustomFunc {
	/**
	 * 使一些卡牌在使用吉占时隐藏花色和数字
	 * @param { Card } card
	 * @param { Player } player
	 *
	 * @returns { Card }
	 */
	invisableJiZhan(card: Card, player: Player): Card {
		let el = whichWayUtil.config("enable", "十周年UI") ? card.querySelector(".suit-num") : card.querySelector(".info");

		if (el) el.classList.add("fuckJiZhan");
		else card.classList.add("fuckJiZhan"); //保底，找不到就都别看了

		//代理技能组，用于检查是否有吉占
		if (!skillSave.eventStackIsProxy) {
			skillSave.eventStackIsProxy = true;
			_status.eventManager.eventStack = new Proxy(_status.eventManager.eventStack, {
				set(t, p, v, r) {
					//@ts-ignore
					let event: GameEvent = t[t.length - 1];
					if (!event) {
						return Reflect.set(t, p, v, r);
					}

					let evt = event.getParent("oljizhan")!;
					let tag = `${player.playerid}_oljizhan`;
					if (Object.keys(evt).length > 0 && !skillSave.hiddenCardInJiZhan.includes(tag)) {
						skillSave.hiddenCard.add(tag);
						whichWayUtil.setCSSVariable("--SJZX-fuckJiZhan", 0);
					} else if (Object.keys(evt).length === 0 && skillSave.hiddenCardInJiZhan.includes(tag)) {
						skillSave.hiddenCard.remove(tag);
						whichWayUtil.setCSSVariable("--SJZX-fuckJiZhan", 1);
					}

					//加个保底
					return Reflect.set(t, p, v, r);
				},
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
	getSkillAudioPath(skill:string, num?:number|number[]):string|string[]|undefined {
		if (!lib.skill[skill]) {
			console.warn(`技能${skill}不存在`);
			return undefined;
		}
		if (!Array.isArray(num) && num !== void 0) num = [num];
		let path = lib.skill[skill].logAudio ? lib.skill[skill].logAudio() : lib.skill[skill].audio;
		path = path.replace(path.slice(-2), "");
		//@ts-ignore
		return num ? num.map(i => path + `/${skill}${i}.mp3`) : path;
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
	defineAccessor(target, prop, get, set) {
		const hasValidGet = typeof get === "function" || (Array.isArray(get) && get.some(fn => typeof fn === "function"));
		const hasValidSet = typeof set === "function" || (Array.isArray(set) && set.some(fn => typeof fn === "function"));

		if (!hasValidGet && !hasValidSet) {
			throw new Error("get 和 set 至少有一个是 function!");
		}
		if (Array.isArray(prop)) {
			for (let i = 0; i < prop.length; i++) {
				let g = get?.[i] || get?.[0] || get;
				let s = set?.[i] || set?.[0] || set;
				this.defineAccessor(target, prop[i], g, s);
			}
		}
		//@ts-ignore
		Object.defineProperty(target, prop, {
			get: typeof get === "function" ? get : undefined,
			set: typeof set === "function" ? set : undefined,
			enumerable: true,
			configurable: true,
		});
	}
}

export const skillCustomFunc = new SkillCustomFunc();
