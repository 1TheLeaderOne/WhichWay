import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onAfterInit, onContent, onSetDev } from "../hooks/index.js";
import { pendingRun, registerExecute } from "./hooks.js";
import { initCharConfig } from "../character/extCharConfig.js";
import { designer, getDesigner } from "../character/index.js";
import { whichWayUtil } from "../utill.js";
import { groupData } from "../character/groups.js";

class WhichWayPackManager {
	static readonly CHARACTER_PACKS = [
		"epicSJZX",
		"legendSJZX",
		"especialSJZX",
		"plotSJZX",
		"specialSJZX",
		"rareSJZX",
		"mediocreSJZX",
		"normalSJZX",
	] as const;
	/**
	 * 初始化
	 */
	async init() {
		this.pendingRun = pendingRun;
		//读取并初始化character的内容
		await this.initCharacterPack();

		//初始化翻译
		registerExecute("translate", (trans: string, name) => {
			if (trans.endsWith("_prefix")) {
				let tran = this.setNamePrefix(name);
				trans = tran.name || trans;
			}

			trans = whichWayUtil.colorize(trans);

			return trans;
		});

		// const cardPack = await whichWayFile.getFileTree("src:packs/card");

		onContent({
			name: "whichWayPackManager_init",
			fn: async () => {
				for (const fn of this.pendingRun) {
					await fn();
				}
			},
		});
	}

	async initCharacterPack() {
		const { files, folders } = await whichWayFile.getFileTree("src:packs/character/");
		for (const file of files) {
			const name = whichWayFile.removeExt(file.name);
			if (!name.endsWith("mrfz")) continue;
			await import(`./character/${name}.js`);
		}

		for (const folder of folders) {
			if (!folder.name.endsWith("mrfz")) continue;
			for (const file of folder.files) {
				try {
					await import(`./character/${folder.name}/index.js`);
				} catch (e) {
					await import(`./character/${folder.name}/index.ts`);
				}
			}
		}

		//将包初始化
		for (const name of WhichWayPackManager.CHARACTER_PACKS) {
			lib.characterPack[name] ??= {};
			if (!lib.config.characters.includes(name)) lib.config.characters.push(name);
			let translate =
				lib.config.extension_WhichWay_compatibleMode === true
					? `驶舰:${this.getPackTranslation(name)}`
					: "<img style='width:90px;height:25px;' src=" +
						lib.assetURL +
						`extension/WhichWay/image/decoration/${this.getPackTranslation(name, 1)}.png>`;
			lib.translate[`${name}_character_config`] = translate;
		}

		//初始化武将
		registerExecute("character", (char: WhichWayCharacter, name) => {
			if (!window.whichWaySave.allCharacters.includes(name)) window.whichWaySave.allCharacters.push(name);

			//@ts-ignore
			if (Array.isArray(char)) char = get.convertedCharacter(char);

			//————初始化武将图片————//
			char.img = whichWayFile.compilePath(`img:character/${name}.jpg`);

			//————初始化WhichWay配置————//
			char = initCharConfig(char);

			//————势力设置————//
			char.whichWay.reallyGroup = char.group;

			//————添加WhichWay配置————//
			char.whichWay.charId = name;

			//————设置将包————//
			if (!char.pack) {
				char.pack = "specialSJZX";
			}

			lib.characterPack[char.pack][name] ??= char;

			//@ts-ignore
			if (char.designer) {
				char.whichWay.designer = Array.isArray(char.designer) ? char.designer : [char.designer];
				designer[name] ??= [];
				designer[name].push(...char.whichWay.designer.filter(designer => !char.designer[name].includes(designer)));
			} else {
				char.whichWay.designer = getDesigner(char, false, true);
			}

			if (!whichWayUtil.config("unityGroup")) {
				if (this._addedGroup === false) {
					this._addedGroup = true;
					let data = groupData;
					for (let key in data) {
						lib.group.push(key);
						lib.groupnature[key] = key;
						lib.translate[key] = data[key].group;
						lib.translate[key + "2"] = data[key].group;
					}
				}
			} else {
				char.group = "sjzx_group";
				if (!lib.translate["sjzx_group"]) lib.translate["sjzx_group"] = "泰拉";
			}

			onAfterInit({
				name: `whichWayCharacterWhichWayExtraConfig_${name}`,
				fn: () => {
					char.whichWay.supportingEquipment = char.whichWay.arknight.tags.includes("支援机器");
					char.whichWay.linkage = char.whichWay.arknight.avaiableLangs.includes("LINKAGE");
				},
			});

			return char;
		});

		//初始化技能
		registerExecute("skill", (info, name) => {
			if (!window.whichWaySave.allSkills.includes(name)) {
				window.whichWaySave.allSkills.push(name);
			}

			return info;
		});
	}

	getPackTranslation(str: string, index?: number) {
		let translateMap: Record<characterSort[number], string[]> = {
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

	setNamePrefix(obj: any): {
		name: string;
		color: string;
		nature: string;
	} {
		const layout = {
			amiya: {
				color: "#191970",
				nature: "woodmm",
			},
		};

		const defaultColor = {
			color: "#00FFFF",
			nature: "woodmm",
		};
		if (typeof obj === "string") {
			obj = {
				name: obj,
				...defaultColor,
			};
		}
		if (layout[obj.layout]) {
			obj = {
				name: obj.name,
				...layout[obj.layout],
			};
		}
		lib.namePrefix.set(obj.name, {
			color: obj.color,
			nature: obj.nature,
		});

		return obj;
	}

	pendingRun: Function[] = [];

	private _addedGroup = false;
}

export const whichWayPackManager = new WhichWayPackManager();

await whichWayPackManager.init();

window.whichWay.register("packManager", whichWayPackManager);

onSetDev({
	name: "whichWayPackManager_Dev",
	fn: () => {
		//@ts-ignore
		window.whichWayPackManager = whichWayPackManager;
	},
});
