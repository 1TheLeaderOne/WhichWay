import { lib, game, ui, get, ai, _status } from "noname";
import { groupData } from "./groups.js";
import { whichWayUtil } from "../utill.js";
import { whichWayTranslate } from "./translate/index.js";
import { whichWayFile } from "../file.js";
import { onConfig, onSetDev, whichWayHooksApi, registerHookContextAt, onAfterInit } from "../hooks/index.js";
import { initCharConfig } from "./extCharConfig.ts";
import { charDes } from "./characterDesigner.js";

const whichWaySave = window.whichWaySave;

class WhichWayCharacterPack {
	/**
	 * 武将包模块
	 * @type {Array}
	 */
	moduleList = [];

	/**
	 * 设计者
	 * @type {Record<string, string[]>}
	 */
	designer = charDes;

	/**
	 * 初始化武将包
	 */
	async init() {
		await this.initModuleList();

		this.initTranslate();

		const packs = [];
		for (let module of this.moduleList) {
			let m = await this.createImportModule(module[0], module[1], true);
			packs.push(m);
		}

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
	 * 初始化武将包模块
	 */
	async initModuleList() {
		const { folders } = await whichWayFile.getFileTree("pack:");
		for (let folder of folders) {
			if (folder.files.length < 0) continue;
			let module = [`${folder.name}SJZX`, []];
			for (let file of folder.files) {
				if (file.name.endsWith(".js")) {
					//@ts-ignore ${file.path}
					module[1].push(await import(`./packs/${folder.name}/${whichWayFile.removeExt(file.name)}.js`).then(res => res.default));
				}
			}
			if (module[1].length > 0) {
				//@ts-ignore
				this.moduleList.push(module);
			}
		}
	}

	/**
	 * 初始化武将包翻译
	 */
	initTranslate() {
		//导入所有翻译
		const { translates, otherTranslates } = whichWayTranslate;

		for (let key in translates) {
			lib.translate[key] = translates[key];
		}

		for (let key in otherTranslates) {
			lib[key] = otherTranslates[key];
		}

		//分包翻译
		for (let key in groupData) {
			lib.translate[key + "_group"] = groupData[key].sort;
		}
	}

	/**
	 * 创建导入模块
	 * @param {string} moduleName - 武将包名称
	 * @param {Object} moduleInfo - 武将包具体内容
	 * @param {boolean} autoImport - 是否自动导入
	 *
	 * @return {Promise<Object>} - 编译后的武将包
	 */
	async createImportModule(moduleName, moduleInfo, autoImport) {
		let compile = {
			name: moduleName,
			connect: true,
			characterSort: {},
			characterTitle: {},
			dynamicTranslate: {},
			character: {},
			characterIntro: {},
			skill: {},
			translate: {},
		};

		let keys = Object.keys(compile).filter(key => get.is.object(compile[key]));
		if (!Array.isArray(moduleInfo)) moduleInfo = [moduleInfo];
		moduleInfo.forEach(module => {
			for (let key of keys) {
				if (get.is.object(module[key])) compile[key] = Object.assign(compile[key], module[key]);
			}
		});

		//——————内容设置——————//
		await this.setImportModule(compile);

		//——————武将分包——————//
		let characterSort = {};
		let groups = (function () {
			let list = [];
			for (let i in compile.character) {
				list.push(compile.character[i].originalGroup);
			}
			return list;
		})();
		for (let name in groupData) {
			let sortName = name + "_group";
			if (!groups.includes(name)) continue;
			if (!characterSort[sortName]) characterSort[sortName] = [];
			for (let key in compile.character) {
				let info = compile.character[key];
				if (info.originalGroup === name) characterSort[sortName].add(key);
			}
		}
		compile.characterSort[moduleName] = characterSort;

		//————武将图片路径设置————//
		if (lib.device || lib.node || whichWayUtil.isViteDevServer()) {
			for (let i in compile.character) {
				compile.character[i][4].push("ext:WhichWay/image/character/" + i + ".jpg");
			}
		} else {
			for (let i in compile.character) {
				compile.character[i][4].push("db:extension-WhichWay/image/character/:" + i + ".jpg");
			}
		}

		function findTranslation(str, index) {
			let translateMap = {
				legendSJZX: ["6星", "SJZXStar6"],
				epicSJZX: ["5星", "SJZXStar5"],
				rareSJZX: ["4星", "SJZXStar4"],
				normalSJZX: ["3星", "SJZXStar3"],
				especialSJZX: ["2星", "SJZXStar2"],
				mediocreSJZX: ["1星", "SJZXStar1"],
				plotSJZX: ["剧情", "SJZXPlot"],
				specialSJZX: ["特殊", "SJZXSpecial"],
			};
			return translateMap[str][index ? index : 0];
		}

		if (!lib.config.characters.includes(moduleName)) lib.config.characters.push(moduleName);
		let translate = lib.config.extension_WhichWay_compatibleMode === true ? `驶舰:${findTranslation(moduleName)}` : "<img style='width:90px;height:25px;' src=" + lib.assetURL + `extension/WhichWay/image/decoration/${findTranslation(moduleName, 1)}.png>`;
		lib.translate[`${moduleName}_character_config`] = translate;

		if (autoImport) {
			await game.import("character", () => compile);
		}

		return compile;
	}

	/**
	 * @param {Object} packname 扩展包
	 * 对武将扩展包进行初始化设置
	 */
	async setImportModule(packname) {
		//————统计扩展武将————//
		var names = Object.keys(packname.character).filter(
			key =>
				key.endsWith("mrfz") &&
				/** @ts-ignore */
				!whichWaySave.allCharacters.includes(key)
		);
		whichWaySave.allCharacters.push(...names);

		whichWaySave.allSkills.push(...Object.keys(packname.skill));

		//————将角色对象化————//
		packname.character = this.characterObjectification(packname, true);

		for (let key in packname.character) {
			/**
			 * @type {WhichWayCharacter}
			 */
			let info = packname.character[key];
			//————初始化WhichWay配置————//
			initCharConfig(info);

			//————势力设置————//
			info.whichWay.reallyGroup = info.group;

			//————添加WhichWay配置————//
			info.whichWay.charId = key;

			onAfterInit({
				name: `whichWayCharacterWhichWayExtraConfig_${key}`,
				fn: () => {
					info.whichWay.supportingEquipment = info.whichWay.arknight.tags.includes("支援机器");
					info.whichWay.linkage = info.whichWay.arknight.avaiableLangs.includes("LINKAGE");
				},
			});

			//@ts-ignore
			if (info.designer) {
				//@ts-ignore
				info.whichWay.designer = Array.isArray(info.designer) ? info.designer : [info.designer];
				this.designer[key] ??= [];
				this.designer[key].push(...info.whichWay.designer.filter(designer => !this.designer[key].includes(designer)));
			} else {
				info.whichWay.designer = this.getDesigner(info, false, true);
			}
		}
		if (!whichWayUtil.config("unityGroup")) {
			let data = groupData;
			for (let key in data) {
				lib.group.push(key);
				lib.groupnature[key] = key;
				lib.translate[key] = data[key].group;
				lib.translate[key + "2"] = data[key].group;
			}
		} else {
			var keys = Object.keys(packname.character);
			var result = keys.filter(key => key.endsWith("mrfz"));
			result.forEach(key => {
				packname.character[key].group = "sjzx_group";
			});
			if (!lib.translate["sjzx_group"]) lib.translate["sjzx_group"] = "泰拉";
		}

		//————卖钩————//
		await whichWayHooksApi.character(packname);
	}

	/**
	 * 将角色数据对象中的每个角色信息转换为标准的角色对象格式。
	 *
	 * @param {Object} characters - 包含角色信息的对象。该对象的每个属性代表一个角色。
	 * @param {boolean} [isPack=false] - 如果为 true，则表示传入的是一个完整的扩展包对象
	 * @returns {Object} 返回经过转换后的角色对象，其中每个角色值都已通过 `get.convertedCharacter` 处理。
	 */
	characterObjectification(characters, isPack = false) {
		if (!get.is.object(characters)) throw new Error(`${characters} 不是一个对象`);
		if (isPack) characters = characters.character;
		for (let key in characters) {
			let info = characters[key];
			characters[key] = get.convertedCharacter(info);
		}
		return characters;
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

export const { getDesigner, getCamp } = whichWayCharacterPack;

await whichWayCharacterPack.init();

onSetDev({
	name: "whichWayCharacterPack_dev",
	fn: () => {
		//@ts-ignore
		window.whichWayCharacterPack = whichWayCharacterPack;
	},
});

window.whichWay.register("characterPack", whichWayCharacterPack);
