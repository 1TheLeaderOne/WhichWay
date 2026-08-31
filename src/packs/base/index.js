import { lib, game, ui, get, ai, _status } from "noname";
import { groupData } from "./groups.js";
import { whichWayUtil } from "../../utill.js";
import dynamicTranslate from "./translate/dynamicTranslate.js";
import { onConfig, onSetDev, whichWayHooksApi, registerHookContextAt, onAfterInit } from "../../hooks/index.js";
import { initCharConfig } from "./extCharConfig.ts";
import { charDes } from "./characterDesigner.js";

const whichWaySave = window.whichWaySave;

class WhichWayCharacterPack {
	/**
	 * 设计者
	 * @type {Record<string, string[]>}
	 */
	designer = charDes;

	/**
	 * 初始化
	 * 旧式武将包已迁移至新式体系（src/packs/character/），此处不再加载旧式包，
	 * 仅保留翻译初始化、init 钩子上下文与统一势力配置。
	 */
	async init() {
		this.initTranslate();

		const packs = [];

		registerHookContextAt("init", 0, packs);

		onConfig({
			priority: 401,
			name: "unityGroup_add",
			obj: {
				name: "unityGroup",
				options: {
					name: "统一势力",
					intro: "开启后本扩展所有武将将统一势力。",
					init: true,
				},
			},
		});
		onConfig({
			priority: 997,
			name: "whichWayNumberOfExtChars_add",
			obj: {
				name: "numberOfExtChars",
				options: {
					name: `已实装干员数:${window.whichWaySave.allCharacters.length}`,
					clear:true,
				},
			},
		});
	}

	/**
	 * 初始化翻译
	 * 角色/技能/称号/介绍翻译已迁移至新式体系（src/packs/character/*mrfz/index.ts），
	 * 此处仅保留新式体系未覆盖的内容：
	 *   - lib.dynamicTranslate：动态翻译函数
	 *   - 势力分组翻译（groupData）
	 */
	initTranslate() {
		lib.dynamicTranslate = dynamicTranslate;

		for (let key in groupData) {
			lib.translate[key + "_group"] = groupData[key].sort;
		}
	}

	/**
	 * 获取角色设计者
	 * @param {string | WhichWayCharacter } char - 角色名
	 * @param {boolean} [igDefault=false] - 是否忽略默认设计者
	 * @param {boolean} [fromStorage=false] - 是否从charDes中获取
	 * @returns {string[]} 角色设计者
	 */
	getDesigner(char, igDefault = false, fromStorage = false) {
		//@ts-ignore 不是本扩展的角色直接返回佚名
		if ((get.is.object(char) && !char?.whichWay) || (typeof char === "string" && !window.whichWaySave.allCharacters.includes(char))) {
			return ["佚名"];
		}

		if (typeof char === "string") {
			if (Object.keys(whichWayCharacterPack.designer).includes(char)) return whichWayCharacterPack.designer[char];
		} else if (get.is.object(char)) {
			if (char.whichWay.designer && char.whichWay.designer.length > 0 && !fromStorage) return char.whichWay.designer;
			if (Object.keys(whichWayCharacterPack.designer).includes(char.whichWay.charId)) return whichWayCharacterPack.designer[char.whichWay.charId];
		}
		return igDefault ? ["佚名"] : ["林登万"];
	}

	/**
	 * 获取角色阵营
	 * @param {string} name - 角色名
	 * @returns {string | undefined} 角色阵营
	 */
	getCamp(name) {
		let char = get.character(name);
		return char.whichWay?.arknight.camp || char.group;
	}
}

const whichWayCharacterPack = new WhichWayCharacterPack();

export const { getDesigner, getCamp, designer } = whichWayCharacterPack;

await whichWayCharacterPack.init();

onSetDev({
	name: "whichWayCharacterPack_dev",
	fn: () => {
		//@ts-ignore
		window.whichWayCharacterPack = whichWayCharacterPack;
	},
});

window.whichWay.register("characterPack", whichWayCharacterPack);
