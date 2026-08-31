import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onAfterInit, onSetDev, onInit, onAfterContent, onBeforeInit } from "../hooks/index.js";
import { packHooks, pendingRun, registerExecute } from "./hooks.js";
import { initCharConfig } from "../character/extCharConfig.js";
import { designer, getDesigner } from "../character/index.js";
import { whichWayUtil } from "../utill.js";
import { groupData } from "../character/groups.js";
import { whichWayArknight } from "../arknight/index.js";

class WhichWayPackManager {
	static readonly CHARACTER_PACKS = ["epicSJZX", "legendSJZX", "especialSJZX", "plotSJZX", "specialSJZX", "rareSJZX", "mediocreSJZX", "normalSJZX"] as const;
	/**
	 * 初始化
	 */
	async init() {
		this.pendingRun = pendingRun;
		//读取并初始化character的内容
		await this.initCharacterPack();

		//初始化翻译
		registerExecute("translate", (trans: string, name) => {
			if (name.endsWith("_prefix")) {
				let tran = this.setNamePrefix(trans);
				trans = tran.name || trans;
			}

			trans = whichWayUtil.colorize(trans);

			return trans;
		});

		// const cardPack = await whichWayFile.getFileTree("src:packs/card");

		onBeforeInit({
			name: "whichWayPackManager_init",
			fn: async () => {
				for (const fn of this.pendingRun) {
					await fn();
				}
			},
		});
	}

	async initCharacterPack() {
		console.time("[WW] packs:getFileList");
		//只扫一层：262 个干员目录都是单文件入口（index.ts），递归进子目录会再发 280+ 次
		//空目录的 IPC，原 getFileTree 的 step=3 走过子目录纯粹是浪费时间。
		const folders = await whichWayFile.listDirNames("src:packs/character/");
		console.timeEnd("[WW] packs:getFileList");

		/**
		 * 干员模块相互独立：模块顶层只把内容缓冲进 packHooks，统一在 onBeforeInit 落库，
		 * 因此可以放心并行加载。原先逐个 await import，几百个干员时串行加载是主要耗时之一。
		 * 用 16 并发窗口限流：浏览器/V8 的动态 import 内部也是用 microtask 队列，盲
		 * 意 Promise.all 让 280+ 个 import() 同时进入会导致 vite 服务端同时打开大量
		 * 文件句柄，原本 1100ms 的操作反而退到更慢。
		 * @type {Promise<unknown>[]}
		 */
		const importTasks: Promise<unknown>[] = [];

		for (const folderName of folders) {
			if (!folderName.endsWith("mrfz")) continue;
			importTasks.push(
				(async () => {
					try {
						await import(`./character/${folderName}/index.js`);
					} catch (e) {
						try {
							await import(`./character/${folderName}/index.ts`);
						} catch (e) {
							console.warn(`${folderName} 加载失败 : ${e}`);
						}
					}
				})()
			);
		}

		console.time("[WW] packs:imports(限流 16)");
		const limit = 16;
		let cursor = 0;
		const workers = Array.from({ length: Math.min(limit, importTasks.length) }, async () => {
			while (true) {
				const idx = cursor++;
				if (idx >= importTasks.length) return;
				await importTasks[idx];
			}
		});
		await Promise.all(workers);
		console.timeEnd("[WW] packs:imports(限流 16)");

		console.time("[WW] packs:register");
		this.register();
		console.timeEnd("[WW] packs:register");

		//将包初始化
		for (const name of WhichWayPackManager.CHARACTER_PACKS) {
			lib.characterPack[name] ??= {};
			if (!lib.config.characters.includes(name)) lib.config.characters.push(name);
			let translate = lib.config.extension_WhichWay_compatibleMode === true ? `驶舰:${this.getPackTranslation(name)}` : "<img style='width:90px;height:25px;' src=" + lib.assetURL + `extension/WhichWay/image/decoration/${this.getPackTranslation(name, 1)}.png>`;
			lib.translate[`${name}_character_config`] = translate;
		}

		//初始化武将
		registerExecute("character", (char: WhichWayCharacter, name) => {
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
				designer[name].push(...char.whichWay.designer.filter(designerx => !designer[name].includes(designerx)));
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

			//————设置Arknight配置————//
			whichWayArknight.addShcema(name, char);

			whichWayArknight.initCharArknight(char);

			// onAfterInit({
			// 	name:`whichWayPackManager_ArknightInit_${name}`,
			// 	fn: (func) => {
			// 		func(char);

			// 		char.whichWay.supportingEquipment = char.whichWay.arknight.tags.includes("支援机器");
			// 		char.whichWay.linkage = char.whichWay.arknight.avaiableLangs.includes("LINKAGE");

			// 		console.log(char);
			// 	}
			// })

			// char.whichWay.supportingEquipment = char.whichWay.arknight.tags.includes("支援机器");
			// char.whichWay.linkage = char.whichWay.arknight.avaiableLangs.includes("LINKAGE");

			return char;
		});

		//初始化技能
		// registerExecute("skill", (info, name) => {
		// 	return info;
		// });
	}

	getPackTranslation(str: string, index?: number) {
		let translateMap: Record<WhichWayCharacterPackNames, string[]> = {
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

	/**
	 * 为allCharacters和allSkills添加数据
	 */
	register(): void {
		const characters = this._hooks.getHooks("character");
		const skills = this._hooks.getHooks("skill");
		//用 Set 判重，避免对几百个干员做 O(n²) 的数组 includes
		const knownChars = new Set<string>(window.whichWaySave.allCharacters);
		for (const char of characters) {
			const name = char.key;
			if (!knownChars.has(name)) {
				knownChars.add(name);
				window.whichWaySave.allCharacters.push(name);
			}
		}
		const knownSkills = new Set<string>(window.whichWaySave.allSkills);
		for (const skill of skills) {
			const name = skill.key;
			if (!knownSkills.has(name)) {
				knownSkills.add(name);
				window.whichWaySave.allSkills.push(name);
			}
		}
	}

	pendingRun: Function[] = [];

	private _addedGroup = false;

	private _hooks = packHooks;
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
