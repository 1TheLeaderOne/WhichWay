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
	 * 干员模块清单（构建期由 import.meta.glob 静态确定，eager 求值）。
	 *
	 * 取代原先的「启动期 getFileTree 扫目录 + import(`./character/${name}.js`) + .js/.ts 双次 try/catch」：
	 * - 启动期不再发起任何目录扫描 IPC；
	 * - 不再依赖产物文件名为 .js 的假设，也无需失败重试兜底；
	 * - 清单在构建期确定，rollup 据此把这 267 个模块合并进同一个 chunk
	 *   （本模块自身只被 init.js 动态 import），启动期请求数从 267 降到 1。
	 *
	 * 为什么用 eager：干员模块必须在「packs 阶段」才求值——它们的顶层只把内容
	 * 缓冲进 packHooks，而 packHooks 的 pendingRun 统一由 onBeforeInit 落库。
	 * 若改用 lazy glob + manualChunks 把干员单独分组，rollup 会因为该组与入口
	 * 共享核心模块而把它提升为入口的静态依赖，导致干员模块在 start() 之前就被
	 * 求值（语义变化）。eager 静态依赖则严格保证「本模块被 import 时才求值」。
	 *
	 * 新增干员依旧是「丢文件即可」：在 src/packs/character/ 下新建
	 * {名}mrfz.ts（或 {名}mrfz/index.ts）后重新构建即生效，无需改动任何代码。
	 *
	 * 注意合并顺序即优先级（同名时先出现者胜出）：扁平 .ts > 扁平 .js >
	 * 目录 index.ts > 目录 index.js。
	 */
	private readonly characterModules: Record<string, unknown> = {
		...import.meta.glob("./character/*mrfz.ts", { eager: true }),
		...import.meta.glob("./character/*mrfz.js", { eager: true }),
		...import.meta.glob("./character/*mrfz/index.ts", { eager: true }),
		...import.meta.glob("./character/*mrfz/index.js", { eager: true }),
	};

	/**
	 * 卡牌模块清单（构建期确定，与干员同理）。
	 * 新增卡牌：在 src/packs/card/ 下新建 {新卡}.ts 即可自动加载，无需修改任何文件；
	 * 共享技能放入 shared.ts。index.ts 为旧组装器入口，会被跳过。
	 */
	private readonly cardModules: Record<string, unknown> = {
		...import.meta.glob("./card/*.ts", { eager: true }),
		...import.meta.glob("./card/*.js", { eager: true }),
	};

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
		//干员模块是 characterModules 的 eager 静态依赖：本模块被 init.js 动态 import
		//的那一刻，它们已经全部求值完毕（顶层只把内容缓冲进 packHooks，不落库 lib），
		//因此这里不需要再逐个 import —— 只统计清单，真正的落库在 onBeforeInit。
		const t0 = performance.now();
		const characterNames = this.collectCharacterModuleNames();
		const tModules = performance.now() - t0;

		const t1 = performance.now();
		this.register();
		const tRegister = performance.now() - t1;

		//只在 packs(新) 总耗时 > 300ms 时打详细明细，正常直接静默
		const total = tModules + tRegister;
		if (total > 300) {
			console.groupCollapsed(`%c[WhichWay·packs] initCharacterPack ${total.toFixed(0)}ms`, "color:#e67e22;");
			console.log(`  清单收集:  ${tModules.toFixed(0)}ms  (${characterNames.length} 模块 / 单 chunk)`);
			console.log(`  register:  ${tRegister.toFixed(0)}ms`);
			console.groupEnd();
		}

		//将包初始化
		for (const name of WhichWayPackManager.CHARACTER_PACKS) {
			lib.characterPack[name] ??= {};
			let translate = lib.config.extension_WhichWay_compatibleMode === true ? `驶舰:${this.getPackTranslation(name)}` : "<img style='width:90px;height:25px;' src=" + lib.assetURL + `extension/WhichWay/image/decoration/${this.getPackTranslation(name, 1)}.png>`;
			lib.translate[`${name}_character_config`] = translate;
		}

		// —— 武将包子包开关初始化 ——
		// 旧版本在每次启动都无条件 lib.config.characters.push(子包)，导致玩家在
		// 「武将包」菜单关闭某子包后，重启又被强行加回来（开关无法关闭）。
		// 现在改为：仅在「首次运行」时把子包默认加入 characters 并持久化一次，
		// 之后完全尊重 players 在菜单里的开关（characters 随 toggle 持久化），重启不再干预。
		if (!lib.config.extension_WhichWay_characterPackDefaulted) {
			let changed = false;
			for (const name of WhichWayPackManager.CHARACTER_PACKS) {
				if (!lib.config.characters.includes(name)) {
					lib.config.characters.push(name);
					changed = true;
				}
			}
			if (changed) {
				try {
					game.saveConfig("characters", lib.config.characters);
				} catch (e) {
					console.warn("[WhichWay] 初始化默认武将包子包失败", e);
				}
			}
			game.saveConfig("extension_WhichWay_characterPackDefaulted", true);
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

			//————引擎可用性注册————//
			// WhichWay 的干员不走引擎普通武将包导入流程（game.import/addCharacterPack），
			// 角色仅挂在 lib.characterPack 下，引擎开局会把 characterPack 全量并入 lib.character，
			// 因此“包开关/仅点将”在这里无法被引擎原逻辑过滤。这里对齐引擎普通包语义：
			// - 扩展整体关闭（extension_WhichWay_characters_enable=false）→ 全部角色 isUnseen（不可选）
			// - 子包在“武将包”菜单被关闭（不在 lib.config.characters）→ isUnseen（不可选，等同引擎关闭包）
			// - 子包勾选“仅点将可用”（forbidai_user_<子包>）→ 加入 lib.config.forbidai（常规/AI 将池禁用，
			//   玩家点将仍可选用；与引擎普通包的 forbidai 语义一致）
			// isUnseen 角色仍保留在 lib.characterPack 中，WhichWay 图鉴/立绘等内部逻辑不受影响。
			const packEnabled =
				lib.config.extension_WhichWay_characters_enable !== false && lib.config.characters.includes(char.pack);
			if (!packEnabled) {
				//@ts-ignore isUnseen 为引擎角色标记字段（类型未在 WhichWayCharacter 上声明）
				(char as any).isUnseen = true;
			} else if (
				// 整体“仅点将可用”（引擎扩展包 tab：forbidai_user_mode_extension_WhichWay）
				lib.config.forbidai_user_mode_extension_WhichWay === true ||
				// 子包“仅点将可用”（forbidai_user_<子包>）
				lib.config[`forbidai_user_${char.pack}`] === true
			) {
				if (!lib.config.forbidai.includes(name)) {
					lib.config.forbidai.add(name);
				}
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
	 * 与干员加载同一模式：
	 * - 模块清单由 import.meta.glob(eager) 在构建期确定，随本模块一起求值
	 * - 卡牌模块顶层只调用 card()/cardSkill()/cardTranslate() 钩子缓冲进 packHooks
	 *   （这三个钩子不进 pendingRun，不会自动落库），统一在本方法内收集后组装
	 *   mrfzcard 包，game.import("card") 注册给引擎
	 *
	 * 新增卡牌：在 src/packs/card/ 下新建 {新卡}.ts 即可自动加载，
	 * 无需修改任何文件。共享技能（多卡共用的）请放入 shared.ts。
	 */
	async initCardPack() {
		const t0 = performance.now();
		const cardNames = this.collectCardModuleNames();
		const tModules = performance.now() - t0;

		const t1 = performance.now();
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
		const tAssemble = performance.now() - t1;

		// 只在总耗时 > 300ms 时打详细明细（与 initCharacterPack 一致的折叠风格）
		const total = tModules + tAssemble;
		if (total > 300) {
			console.groupCollapsed(`%c[WhichWay·packs] initCardPack ${total.toFixed(0)}ms`, "color:#e67e22;");
			console.log(`  清单收集:  ${tModules.toFixed(0)}ms  (${cardNames.length} 模块 / 单 chunk)`);
			console.log(`  assemble:  ${tAssemble.toFixed(0)}ms`);
			console.groupEnd();
		}
	}

	/**
	 * 干员模块名清单，按名称去重（同名时先出现者胜出：
	 * 扁平 .ts > 扁平 .js > 目录 index.ts > 目录 index.js）。
	 *
	 * 这些模块在 eager glob 下是本模块的静态依赖，被 import 时已全部求值，
	 * 因此这里只返回名字（用于埋点与自检），不需要再 import 一次。
	 */
	collectCharacterModuleNames(): string[] {
		return this.pickModuleNames(this.characterModules, path => this.getCharacterModuleName(path));
	}

	/**
	 * 卡牌模块名清单，跳过旧组装器入口 index；
	 * shared.ts 是共享技能模块，正常加载。
	 */
	collectCardModuleNames(): string[] {
		return this.pickModuleNames(this.cardModules, path => whichWayFile.removeExt(path.slice(path.lastIndexOf("/") + 1)), name => name !== "index");
	}

	/**
	 * 按名称去重（保留首次出现者）后返回模块名清单。
	 * @param modules import.meta.glob 得到的「路径 → 模块」映射
	 * @param getName 从路径推导模块名
	 * @param accept 可选的过滤条件
	 */
	private pickModuleNames(modules: Record<string, unknown>, getName: (path: string) => string, accept?: (name: string, path: string) => boolean): string[] {
		const picked = new Set<string>();
		for (const path in modules) {
			const name = getName(path);
			if (accept && !accept(name, path)) continue;
			picked.add(name);
		}
		return [...picked];
	}

	/**
	 * 从模块路径推导干员名：
	 * - 扁平形态 "./character/beiluoneimrfz.ts" → "beiluoneimrfz"
	 * - 目录形态 "./character/wangmrfz/index.ts" → "wangmrfz"
	 */
	getCharacterModuleName(path: string): string {
		const segments = path.split("/");
		if (/\/index\.(ts|js)$/.test(path)) return segments[segments.length - 2];
		return whichWayFile.removeExt(segments[segments.length - 1]);
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
