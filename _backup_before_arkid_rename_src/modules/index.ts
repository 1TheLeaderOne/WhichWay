import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onContent, onSetDev } from "../hooks/index.js";
import { whichWayUtil } from "../utill.js";
import { modules, modulesList , modulesConfig } from "./data.js";

const modulesSet = window.whichWaySave.modulesSet;

class WhichWayCharacterModules {
	modules:Record<string,Record<string,modulesConfig>> = {};

	modulesList: string[] = [];

	async init() {
		//初始化模组
		this.modules = {
			...modules,
		};
		this.modulesList.push(...modulesList);

		onContent({
			name: "whichWayCharacterModules_init",
			fn: () => {
				this.initCharModules();
			},
		});
	}

	/**
	 * 构造基础证章（`default`）模组。`intro` 会内嵌角色译名，故需传入角色名。
	 */
	private buildDefaultModule(charName: string): characterModulesUIConfig {
		return {
			url: whichWayFile.compilePath("mod:default.png"),
			name: `基础证章`,
			id: "default",
			intro: ["基础证章，无特殊效果。", `${get.translation(charName)}通过罗德岛人事部考核，准许参加外勤任务`, "特别颁发此证章", "以兹证明"],
		};
	}

	/**
	 * 获取指定角色的所有可用模组或当前装备的模组。
	 *
	 * 返回值有三种形态，由 `current` 与 `name` 的语义共同决定，用重载签名精确表达：
	 * - `current === true`（默认）：返回**单个**当前模组（未装备则返回基础证章 `default`；
	 *   当 `name` 本身是模组 ID 时，返回该模组）。类型为 `characterModulesUIConfig | undefined`。
	 * - `current === false` 且 `name` 为角色名：返回该角色**全部可用模组的字典**
	 *   （键为模组 ID，含 `default`）。类型为 `characterModulesUIConfigs | undefined`。
	 * - 角色名/模组 ID 都不匹配时：返回 `undefined`。
	 *
	 * @param name - 角色名、模组 ID，或 Player 对象
	 * @param current - 是否只获取当前激活的模组（仅当 `name` 为角色名时影响返回值形态）。
	 */
	getCharModules(name: string | Player, current?: true): characterModulesUIConfig | undefined;
	getCharModules(name: string | Player, current: false): characterModulesUIConfigs | undefined;
	getCharModules(name: string | Player, current: boolean = true): characterModulesUIConfig | characterModulesUIConfigs | undefined {
		const id = get.itemtype(name) === "player" ? (name as Player).name : (name as string);

		if (window.whichWaySave.hasChar(id) && this.modulesList.includes(id)) {
			throw new Error(`${id} 即是角色名也是模组名，请重新命名模组！`);
		}

		if (id === "default") return this.buildDefaultModule(id);

		if (window.whichWaySave.hasChar(id)) {
			if (current) {
				if (!modulesSet[id]) return this.buildDefaultModule(id);

				// modulesSet[id] 存的是模组 ID，递归解析为单个模组
				return this.getCharModules(modulesSet[id]);
			}

			// 返回该角色全部模组：以模组 ID 为键，附带 default 基础证章
			const allModules: characterModulesUIConfigs = { default: this.buildDefaultModule(id) };
			const charModules = this.modules[id];
			if (!charModules) return allModules;
			for (const key in charModules) {
				const info = charModules[key] as unknown as characterModulesUIConfig;
				if (!info.url) info.url = whichWayFile.compilePath(`mod:${id}/${key}.png`);
				if (!info.id) info.id = key;
				allModules[key] = info;
			}
			return allModules;
		}

		if (this.modulesList.includes(id)) {
			for (const key in this.modules) {
				const info = this.modules[key];

				if (Object.keys(info).includes(id)) {
					return {
						url: whichWayFile.compilePath(`mod:${key}/${id}.png`),
						id,

						...info[id],
					};
				}
			}
		}

		if (whichWayUtil.isDeveloperMode()) console.warn(`角色或模组 ${id} 不存在`);
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
	setCharModules(name: string, moduleName: string = "default"): string {
		const charModules = this.getCharModules(name, false);
		if (!charModules) return moduleName;
		if (!charModules[moduleName]) throw new Error(`设置失败：${name} 的模组 ${moduleName} 不存在`);
		modulesSet[name] = moduleName;
		whichWayUtil.saveConfig("modulesSet", modulesSet);
		this.initCharModules();
		return moduleName;
	}

	initCharModules() {
		if (_status.gameStarted) {
			for (let char of game.players) {
				let modulesChars = Object.keys(modulesSet);
				if (modulesChars.includes(char.name)) {
					let module = this.getCharModules(char);

					if (!module) continue;

					if (!lib.character[char.name].copySJZX)
						lib.character[char.name].copySJZX = {
							...lib.character[char.name],
						};
					if (module.id === "default") {
						let { skills: originalSkills } = lib.character[char.name].copySJZX;
						if (lib.character[char.name].skills !== originalSkills) {
							char.removeSkill(lib.character[char.name].skills);

							char.addSkill(originalSkills);
						}

						lib.character[char.name] = lib.character[char.name].copySJZX;
						continue;
					}
					if (module.effect) {
						let effect = module.effect;
						if (effect.content) effect.content(lib.character[char.name],char);
						if (effect.changeSkill) {
							let changeSkill = Array.isArray(effect.changeSkill) ? effect.changeSkill : [effect.changeSkill];
							char.removeSkill(char.getOriginalSkills());

							char.addSkill(changeSkill);
							lib.character[char.name].skills = changeSkill;
						}
					}
				}
			}
		} else {
			this.clearCharModuleDefaultSet();
			for (let name in modulesSet) {
				let moduleName = modulesSet[name];
				let module = this.getCharModules(moduleName);
				let playerObj = lib.character[name];

				if(!module) continue;

				if (module.effect) {
					let effect = module.effect;
					if (effect.content) effect.content(playerObj);
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
