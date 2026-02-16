import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onContent, onSetDev } from "../hooks/index.js";
import { whichWayUtil } from "../utill.js";
import { modules, modulesList } from "./data.js";

const modulesSet = window.whichWaySave.modulesSet;

class WhichWayCharacterModules {
	modules = {};

	modulesList = [];

	async init() {
		//初始化模组
		this.modules = {
			...modules,
		};
		this.modulesList.push(...modulesList);

        onContent({
            name:"whichWayCharacterModules_init",
            fn:()=>{
                this.initCharModules();
            }
        })
	}

	/**
	 * 获取指定角色的所有可用模组或当前装备的模组。
	 *
	 * 如果 `current` 为 true，则返回该角色当前激活的模组（若存在），否则返回默认模组。
	 * 如果 `current` 为 false，则返回该角色在 `modulesList` 中定义的所有模组；
	 * 若该角色未定义任何模组，则返回一个默认的基础模组。
	 *
	 * @param {string | Player} name - 角色名或者模组名
	 * @param {boolean} [current=true] - 是否只获取当前激活的模组（仅name为角色名时有效）。
	 * @returns {Object} 返回一个表示模组或模组集合的对象。
	 *
	 * @example
	 * // 获取当前激活模组
	 * const currentModule = getCharModules('character1');
	 *
	 * // 获取所有可用模组
	 * const allModules = getCharModules('character1', false);
	 */
	getCharModules(name, current = true) {
		if (get.itemtype(name) === "player") {
            //@ts-ignore
			name = get.name(name);
		}
		const defaultModule = {
			default: {
				url: whichWayFile.compilePath("mod:default.png"),
				name: `基础证章`,
				id: "default",
				intro: ["基础证章，无特殊效果。", `${get.translation(name)}通过罗德岛人事部考核，准许参加外勤任务`, "特别颁发此证章", "以兹证明"],
			},
		};
        //@ts-ignore
		if (window.whichWaySave.allCharacters.includes(name) && this.modulesList.includes(name)) {
			throw new Error(`${name} 即是角色名也是模组名，请重新命名模组！`);
		}

		if (name === "default") return defaultModule.default;
        //@ts-ignore
		if (window.whichWaySave.allCharacters.includes(name)) {
			if (current) {
                //@ts-ignore
				if (!modulesSet[name]) return defaultModule.default;
                //@ts-ignore
				return this.getCharModules(modulesSet[name]);
			}
            //@ts-ignore
			if (!Object.keys(this.modules).includes(name)) return defaultModule;
			let copyCharModules = {
				default: defaultModule.default,
				...this.modules[name],
			};
			for (let key in copyCharModules) {
				let info = copyCharModules[key];
				if (!info.url) info.url = whichWayFile.compilePath(`mod:${name}/${key}.png`);
				if (!info.id) info.id = key;
			}
			return copyCharModules;
		} else if (this.modulesList.includes(name)) {
			for (let key in this.modules) {
				let info = this.modules[key];
				/** @ts-ignore */
				if (Object.keys(info).includes(name)) {
					return {
						url: whichWayFile.compilePath(`mod:${key}/${name}.png`),
						id: name,
						/** @ts-ignore */
						...info[name],
					};
				}
			}
		}
		if (whichWayUtil.isDeveloperMode()) console.warn(`角色或模组 ${name} 不存在`);
		return undefined;
	}

	/**
	 * 设置角色的模组
	 *
	 * 如果尚未存在全局配置对象 `lib.config.sjzxModuleSet`，则会自动创建。
	 * 如果未提供 `moduleName`，则默认使用 "default" 模组。
	 * 如果指定的角色或模组不存在，则会抛出错误。
	 *
	 * @param {string} name - 角色名称，用于标识要设置模组的角色。
	 * @param {string} [moduleName] - 要设置的模组名称，默认为 "default"。
	 * @returns {string} 模组名。
	 */
	setCharModules(name, moduleName) {
		if (!moduleName) moduleName = "default";
		let modules = this.getCharModules(name, false);
		if (!modules[moduleName]) throw new Error(`设置失败：${name} 的模组 ${moduleName} 不存在`);
		modulesSet[name] = moduleName;
		whichWayUtil.saveConfig("modulesSet", modulesSet);
		this.initCharModules();
		return moduleName;
	}

	initCharModules() {
		/** @ts-ignore */
		if (_status.gameStarted) {
			game.players.forEach(char => {
				let modulesChars = Object.keys(modulesSet);
				if (modulesChars.includes(char.name)) {
					let module = this.getCharModules(char);
					/** @ts-ignore */
					if (!lib.character[char.name].copySJZX)
						//@ts-ignore
						lib.character[char.name].copySJZX = {
							...lib.character[char.name],
						};
					if (module.id === "default") {
						/** @ts-ignore */
						let { skills: originalSkills } = lib.character[char.name].copySJZX;
						if (lib.character[char.name].skills !== originalSkills) {
							char.removeSkill(lib.character[char.name].skills);
							/** @ts-ignore */
							char.addSkill(originalSkills);
						}
						/** @ts-ignore */
						lib.character[char.name] = lib.character[char.name].copySJZX;
						return;
					}
					if (module.effect) {
						let effect = module.effect;
						if (effect.content) effect.content(char, lib.character[char.name]);
						if (effect.changeSkill) {
							let changeSkill = Array.isArray(effect.changeSkill) ? effect.changeSkill : [effect.changeSkill];
							char.removeSkill(char.getOriginalSkills());
							/** @ts-ignore */
							char.addSkill(changeSkill);
							lib.character[char.name].skills = changeSkill;
						}
					}
				}
			});
		} else {
			this.clearCharModuleDefaultSet();
			for (let name in modulesSet) {
				let moduleName = modulesSet[name];
				let module = this.getCharModules(moduleName);
				let playerObj = lib.character[name];
				if (module.effect) {
					let effect = module.effect;
					if (effect.content) effect.content(undefined, playerObj);
					if (effect.changeSkill) {
						let changeSkill = Array.isArray(effect.changeSkill) ? effect.changeSkill : [effect.changeSkill];
						lib.character[name].skills = changeSkill;
					}
				}
			}
		}
	}

	clearCharModuleDefaultSet() {
		for (let charName in modulesSet) {
			if (modulesSet[charName] === "default") delete modulesSet[charName];
		}
		whichWayUtil.saveConfig("modulesSet", modulesSet);
		return modulesSet;
	}
}

export const whichWayCharacterModules = new WhichWayCharacterModules();

await whichWayCharacterModules.init();

onSetDev({
	name: "whichWayCharacterModules_setDev",
	fn: () => {
		//@ts-ignore
		window.whichWayCharacterModules = whichWayCharacterModules;
	},
});

window.whichWay.register("characterModules", whichWayCharacterModules);
