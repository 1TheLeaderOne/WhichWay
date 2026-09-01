import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onAfterInit, onSetDev, onInit, onAfterContent, onBeforeInit } from "../hooks/index.js";
import { packHooks, pendingRun, registerExecute } from "./hooks.js";
import { initCharConfig } from "./base/extCharConfig.js";
import { designer, getDesigner } from "./base/index.js";
import { whichWayUtil } from "../utill.js";
import { groupData } from "./base/groups.js";
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

		//初始化卡牌（模块化卡牌包：每张卡一个文件，自动扫描加载后 game.import("card")）
		await this.initCardPack();

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
		//只扫一层：干员入口支持两种形态——扁平文件（{名}mrfz.ts）与目录（{名}mrfz/index.ts），
		//两者并存时以目录优先（getFileTree 同时返回 files 与 folders，各取所需）。
		const t0 = performance.now();
		const { files, folders } = await whichWayFile.getFileTree("src:packs/character/", 1);
		const tList = performance.now() - t0;

		/**
		 * 干员模块相互独立：模块顶层只把内容缓冲进 packHooks，统一在 onBeforeInit 落库，
		 * 因此可以放心并行加载。原先逐个 await import，几百个干员时串行加载是主要耗时之一。
		 * 用 16 并发窗口限流：浏览器/V8 的动态 import 内部也是用 microtask 队列，盲
		 * 意 Promise.all 让 280+ 个 import() 同时进入会导致 vite 服务端同时打开大量
		 * 文件句柄，原本 1100ms 的操作反而退到更慢。
		 * @type {Promise<unknown>[]}
		 */
		const importTasks: Promise<unknown>[] = [];
		// 记录已按扁平形态加载的干员名，目录形态遇到同名则跳过（避免重复注册）
		const loadedFlats = new Set<string>();

		// 扁平文件形态：character/xxx.ts
		for (const file of files) {
			// 只处理源码文件，跳过 sourcemap 等（产物模式下 .js.map 的 removeExt 会得到 "xxx.js"）
			if (!/\.(ts|js)$/.test(file.name)) continue;
			const name = whichWayFile.removeExt(file.name);
			if (!name.endsWith("mrfz")) continue;
			loadedFlats.add(name);
			importTasks.push(
				(async () => {
					try {
						await import(`./character/${name}.js`);
					} catch (e) {
						try {
							await import(`./character/${name}.ts`);
						} catch (e) {
							console.warn(`${name} 加载失败 : ${e}`);
						}
					}
				})()
			);
		}

		// 目录形态：character/xxx/index.ts
		for (const folder of folders) {
			const name = folder.name;
			if (!name.endsWith("mrfz")) continue;
			// 若同名的扁平文件已加载过，跳过目录形态避免重复注册
			if (loadedFlats.has(name)) continue;
			importTasks.push(
				(async () => {
					try {
						await import(`./character/${name}/index.js`);
					} catch (e) {
						try {
							await import(`./character/${name}/index.ts`);
						} catch (e) {
							console.warn(`${name} 加载失败 : ${e}`);
						}
					}
				})()
			);
		}

		const t1 = performance.now();
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
		const tImports = performance.now() - t1;

		const t2 = performance.now();
		this.register();
		const tRegister = performance.now() - t2;

		//只在 packs(新) 总耗时 > 500ms 时打详细明细，正常 <300ms 直接静默
		const total = tList + tImports + tRegister;
		if (total > 500) {
			console.groupCollapsed(`%c[WhichWay·packs] initCharacterPack ${total.toFixed(0)}ms`, "color:#e67e22;");
			console.log(`  listDirNames:    ${tList.toFixed(0)}ms`);
			console.log(`  imports (限16):  ${tImports.toFixed(0)}ms  (${importTasks.length} 模块)`);
			console.log(`  register:        ${tRegister.toFixed(0)}ms`);
			console.groupEnd();
		}

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

	/**
	 * 初始化卡牌包
	 *
	 * 与干员加载同一模式（性能红线，勿改）：
	 * - getFileTree 单层扫描 src:packs/card/ 下的扁平文件（{卡牌}.ts）
	 * - 16 并发窗口限流并行 import，避免过度并行打爆 vite 文件句柄
	 * - 卡牌模块顶层只调用 card()/cardSkill()/cardTranslate() 钩子缓冲进 packHooks
	 *   （这三个钩子不进 pendingRun，不会自动落库），统一在本方法内收集后组装
	 *   mrfzcard 包，game.import("card") 注册给引擎
	 *
	 * 新增卡牌：在 src/packs/card/ 下新建 {新卡}.ts 即可自动加载，
	 * 无需修改任何文件。共享技能（多卡共用的）请放入 shared.ts。
	 */
	async initCardPack() {
		const t0 = performance.now();
		const { files } = await whichWayFile.getFileTree("src:packs/card/", 1);
		const tList = performance.now() - t0;

		const importTasks: Promise<unknown>[] = [];
		for (const file of files) {
			// 只处理源码文件，跳过 sourcemap 等（产物模式下 .js.map 的 removeExt 会得到 "xxx.js"）
			if (!/\.(ts|js)$/.test(file.name)) continue;
			const name = whichWayFile.removeExt(file.name);
			// 跳过旧组装器入口（index.ts）；shared.ts 是共享技能模块，正常加载
			if (name === "index") continue;
			importTasks.push(
				(async () => {
					try {
						await import(`./card/${name}.js`);
					} catch (e) {
						try {
							await import(`./card/${name}.ts`);
						} catch (e) {
							console.warn(`${name} 卡牌加载失败 : ${e}`);
						}
					}
				})()
			);
		}

		const t1 = performance.now();
		// 16 并发限流（与干员加载一致）
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
		const tImports = performance.now() - t1;

		const t2 = performance.now();
		// 从 packHooks 收集卡牌钩子（card/cardSkill/cardTranslate 不进 pendingRun，
		// 不会自动落库 lib，由本方法统一收集后构造 mrfzcard 包给引擎 loadCard 处理）
		const cardHooks = packHooks.getHooks("card");
		const skillHooks = packHooks.getHooks("cardSkill");
		const transHooks = packHooks.getHooks("cardTranslate");

		const card: Record<string, any> = {};
		const skill: Record<string, any> = {};
		const translate: Record<string, any> = {};
		for (const h of cardHooks) card[h.key] = h.obj;
		for (const h of skillHooks) skill[h.key] = h.obj;
		for (const h of transHooks) translate[h.key] = h.obj;

		// 兜底：引擎 loadCard 要求每张卡必须有 `${id}_info` 翻译才进 lib.cardPack。
		// card/ 目录的卡牌文件都自带 _info；但干员文件里通过 card() 钩子注册的
		// 卡牌容易漏写，会导致卡牌被引擎静默丢弃（不进卡牌包、游戏里选不到）。
		// 这里统一兜底：缺 _info 时用卡牌名翻译（或卡牌 id）补上，保证进包。
		for (const cardKey of Object.keys(card)) {
			const infoKey = `${cardKey}_info`;
			if (translate[infoKey] === undefined) {
				translate[infoKey] = translate[cardKey] ?? cardKey;
			}
		}

		const mrfzcard = { name: "mrfzcard", connect: true, card, skill, translate, list: [] };
		lib.translate["mrfzcard_card_config"] = "驶舰之向";
		if (!lib.config.cards.includes("mrfzcard")) lib.config.cards.push("mrfzcard");
		await game.import("card", () => mrfzcard);
		const tAssemble = performance.now() - t2;

		// 只在总耗时 > 500ms 时打详细明细（与 initCharacterPack 一致的折叠风格）
		const total = tList + tImports + tAssemble;
		if (total > 500) {
			console.groupCollapsed(`%c[WhichWay·packs] initCardPack ${total.toFixed(0)}ms`, "color:#e67e22;");
			console.log(`  listFiles:      ${tList.toFixed(0)}ms`);
			console.log(`  imports (限16): ${tImports.toFixed(0)}ms  (${importTasks.length} 模块)`);
			console.log(`  assemble:       ${tAssemble.toFixed(0)}ms`);
			console.groupEnd();
		}
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
