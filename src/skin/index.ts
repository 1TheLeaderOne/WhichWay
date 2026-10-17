import { createApp } from "vue";
import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onArenaReady, onConfig, onContent, onInit, onPrecontent, onSetDev } from "../hooks/index.js";
import { whichWayAPIOverride } from "../override/index.js";
import { whichWayToast } from "../toast/index.ts";
import { whichWayUtil } from "../utill.js";
import { whichWayVersion } from "../version.js";
import { spineWorker } from "./spineWork.js";
import ConfOverride from "./confOverride.vue";
import { confictedSkin } from "./confictedSkin.ts";

//立绘透明图层的两层背景结构（劫持 $init / $reinit）
import { mountPortrait } from "./avatarBackground.ts";
import { DEFAULT_SKIN_NAME, flushSave, getPos, getPosData, loadPos, type PortraitPos } from "./portraitPos.js";
import { togglePortraitDragging } from "./portraitDrag.js";

/** v1.6 清缓存的标记位（与 arkidMigrated 同一套一次性开关写法，落库为 extension_WhichWay_ 前缀） */
const SKIN_CACHE_CLEARED_KEY = "skinCacheClearedV16";

class WhichWaySkin {
	/**
	 * 皮肤组件初始化
	 */
	async init() {
		await whichWayUtil
			.measureExecutionTime(async () => {
				//立绘位置设定要先于任何一次绘制就位，否则首帧会按默认值画一遍再跳一次
				await loadPos();
				await this.autoUpdateSkinData();
				this.syncAllSkinConfig();
			})
			.then(({ duration }) => {
				if (whichWayUtil.isDeveloperMode()) console.log(`[whichWaySkin] init skin time ${duration}ms`);
			});

		// onArenaReady({
		// 	name: "whichWaySkinInitSkinData_precontent_sort",
		// 	fn: async () => {
		// 		this.initConfictedSkins();
		// 		if(this.confictedSkins.size > 0) await this.showConflictedSkin();
		// 		this.syncAllSkinConfig();
		// 	},
		// });

		onInit({
			name: "whichWaySkinInitSkinData_init",
			fn: async () => {
				//为所有角色添加皮肤"经典形象"
				for (const name of window.whichWaySave.allCharacters) {
					this.skinData[name] ??= {
						name: name,
						skins: {},
					};

					//为了让经典形象在皮肤列表的最前面
					this.skinData[name].skins = {
						经典形象: {
							name: whichWayFile.getCharacterPortraitFile(name),
							path: whichWayFile.getCharacterPortraitPath(name),
						},
						...this.skinData[name].skins,
					};
				}
			},
		});

		onContent({
			name: "whichWaySkinAddInitDyc",
			fn() {
				if (!spineWorker.needEnable()) return;
				let mode = whichWayUtil.config("WhichWayDynamicSkinSwitch");
				if (mode === "sjzx") {
					whichWayAPIOverride.appendHook("lib.element.player.init", {
						before(character, character2) {
							// @ts-ignore
							if (this.dycSJZX) spineWorker.dispose(this.dycSJZX);
							if (
								(function () {
									let mode = lib.config.mode;
									switch (mode) {
										case "single":
											return get.config("double_character", mode) !== "single";
										default:
											return get.config("double_character", mode);
									}
								})()
							) {
								whichWayToast.showToast("【驶舰之向】:双将时无法使用动皮！", 5000, "bottomCenter", "sjzx_doubleCharacterWarn");
							} else spineWorker.updateDyc(character, this);
						},
					});

					whichWayAPIOverride.appendHook("lib.element.player.reinit", {
						before(character, character2) {
							// @ts-ignore
							if (this.dycSJZX) spineWorker.dispose(this.dycSJZX);
							if (
								(function () {
									let mode = lib.config.mode;
									switch (mode) {
										case "single":
											return get.config("double_character", mode) !== "single";
										default:
											return get.config("double_character", mode);
									}
								})()
							) {
								whichWayToast.showToast("【驶舰之向】:双将时无法使用动皮！", 5000, "bottomCenter", "sjzx_doubleCharacterWarn");
							} else spineWorker.updateDyc(character, this);
						},
					});
				} else if (mode === "piqie") {
					let piqieData = { ...lib.config.sjzxDycAssets };
					for (let charName in piqieData) {
						let char = piqieData[charName];
						for (let skinName in char) {
							let skin = char[skinName];
							if (Array.isArray(skin.action)) skin.action = skin.action[0];
						}
					}
					// @ts-ignore
					if (!decadeUI.dynamicSkin) decadeUI.dynamicSkin = {};
					// @ts-ignore
					Object.assign(decadeUI.dynamicSkin, piqieData);

					// @ts-ignore
					if (!skinSwitch.saveSkinParams) skinSwitch.saveSkinParams = {};
					// @ts-ignore
					Object.assign(skinSwitch.saveSkinParams, piqieData);
				}
			},
		});

		onArenaReady({
			name: "whichWayInitDycDragging",
			fn() {
				//动皮参数调整
				if (spineWorker.needEnable() && whichWayUtil.isDeveloperMode()) {
					ui.create.system(
						"动皮拖拽",
						() => {
							//@ts-ignore
							spineWorker.draggingDyc(game.me.dycSJZX);
						},
						true
					);
				}
			},
		});

		onArenaReady({
			name: "whichWayInitPortraitDragging",
			fn() {
				//皮肤拖拽：玩家自助调整干员立绘/皮肤的位置与大小（仅本扩展绘制的方舟立绘可拖）。
				//和上面「动皮拖拽」的区别是它不锁开发模式 —— 位置设定是给玩家用的功能。
				ui.create.system("皮肤拖拽", togglePortraitDragging, true);
			},
		});

		onConfig({
			name: "whichWaySkinUpdateSkinData_add",
			priority: 899,
			obj: {
				name: "updateSkinData",
				options: {
					name: "<button type=`button`>更新皮肤数据</button>",
					clear: true,
					async onclick() {
						if (window.whichWaySave.updatingSkinData) {
							whichWayToast.showToast("[驶舰之向] 正在更新皮肤数据，请勿重复操作...", 3000, "topLeft", "configTips_updateSkinData_updatingSkinData");
							return;
						}
						window.whichWaySave.updatingSkinData = true;
						whichWayToast.showToast("[驶舰之向] 正在更新皮肤数据...", true, "topLeft", "configTips_updateSkinData");
						await whichWaySkin.autoUpdateSkinData(true).then(() => {
							window.whichWaySave.updatingSkinData = false;
							whichWayToast.removeToastById("configTips_updateSkinData_updatingSkinData");
							whichWayToast.showToast("[驶舰之向] 皮肤数据更新完成!", 3000, "topLeft", "configTips_updateSkinData");
						});
					},
				},
			},
		});

		onConfig({
			name: "WhichWayDynamicSkinSwitch_add",
			priority: 755,
			obj: {
				name: "WhichWayDynamicSkinSwitch",
				options: {
					name: "动皮组件",
					intro: "选择动皮组件",
					init: "sjzx",
					item: {
						sjzx: "驶舰之向",
						piqie: "皮肤切换",
					},
				},
			},
		});

		onConfig({
			name: "whichwaySkinConfigAdd_enableWhichWayDynamicSkin",
			priority: 756,
			obj: {
				name: "enableWhichWayDynamicSkin",
				options: {
					name: "启用驶舰之向动皮",
					intro: "选择后会启用驶舰之向动皮组件",
					init: true,
				},
			},
		});

		onConfig({
			name: "whichwaySkinConfigAdd_portraitUseCover",
			priority: 757,
			obj: {
				name: "portraitUseCover",
				options: {
					name: "立绘/皮肤直接用cover铺满",
					intro: "开启后干员的立绘与皮肤只按 background-size:cover 铺满，忽略自定义的位置与缩放设定（pos.json）；关闭则沿用自定义的pos。改完需要换肤或重开一局才生效",
					init: false,
				},
			},
		});

		onConfig({
			name: "whichwaySkinConfigAdd_skinOverride",
			priority: 754,
			obj: {
				name: "skinOverride",
				options: {
					name: "皮肤配置优先级",
					intro: "选择皮肤配置优先级",
					init: "whichWay",
					item: {
						noname: "本体优先",
						whichWay: "驶舰之向优先",
						qhly: "千幻聆音优先",
					},
				},
			},
		});

		//导入动皮数据
		await import("./dynamicConfig.js");
	}

	/**
	 * 初始化皮肤数据（只会读取本扩展的）
	 */
	async initSkinData() {
		const { folders } = await whichWayFile.getFileTree("skin:");
		for (const folder of folders) {
			this.skinData[folder.name] = {
				name: folder.name,
				skins: {},
			};
			if (folder.files.length > 0) {
				for (const file of folder.files) {
					this.skinData[folder.name].skins[file.name.replace(".jpg", "").replace(".png", "")] = {
						name: file.name,
						path: file.path,
					};
				}
			}
		}
	}

	/**
	 * 保存皮肤数据
	 */
	async saveSkinData() {
		await whichWayFile.writeFileAsJson(
			{
				version: whichWayVersion.ext,
				data: this.skinData,
			},
			"json:cache/",
			"skin.json"
		);
	}

	/**
	 * v1.6 一次性删除皮肤缓存文件。
	 *
	 * 缓存里烙的是扫描当时的图片路径，立绘/皮肤目录迁移后这些路径就是坏的；
	 * 而 autoUpdateSkinData 只要看到缓存版本号和当前扩展版本一致就直接复用，
	 * 坏路径会一路活到 1.6.x 的每个小版本。所以 1.6 首次启动时强制删一次，
	 * 让它按新目录重建；标记位保证只删一次。
	 * @returns 本次是否执行了清理（版本不是 1.6、已清理过、或删除失败时返回 false）
	 */
	async clearSkinCacheOnce(): Promise<boolean> {
		if (!whichWayVersion.ext.startsWith("1.6")) return false;
		if (whichWayUtil.config(SKIN_CACHE_CLEARED_KEY)) return false;

		try {
			//先判存在再删：引擎的 removeFile 对不存在的路径是 reject，不是静默成功
			if (await whichWayFile.exsitFile("json:cache/skin.json", "file")) {
				await game.promises.removeFile(whichWayFile.compilePath("json:cache/skin.json"));
			}
		} catch (error) {
			//删不掉（例如没有 fs 后端）就不写标记位，下次启动重试
			console.error("[whichWaySkin] 删除皮肤缓存失败，将在下次启动重试", error);
			return false;
		}

		whichWayUtil.saveConfig(SKIN_CACHE_CLEARED_KEY, true);
		return true;
	}

	/**
	 * 自动更新皮肤数据
	 * @param forced 是否强制更新
	 */
	async autoUpdateSkinData(forced = false) {
		await this.clearSkinCacheOnce();
		if ((await whichWayFile.exsitFile("json:cache/skin.json", "file")) && forced === false) {
			const { version, data } = await whichWayFile.readFile("json:cache/skin.json");
			if (version === whichWayVersion.ext) {
				this.skinData = data;
				return;
			}
		}
		await this.initSkinData();
		await this.saveSkinData();
	}

	/**
	 * 获取角色的皮肤，如果没有指定皮肤，则返回所有皮肤
	 * @param name 角色名
	 * @param skin 皮肤名（可选）
	 * @returns 皮肤路径或皮肤名数组
	 */
	getCharacterSkin(name: string, skin?: string): Record<string, string> | { name: string; path: string } | undefined {
		const data = this.skinData[name];
		if (!data) return;
		if (!skin) {
			const result: Record<string, string> = {};
			for (const key in data.skins) {
				result[key] = data.skins[key].path;
			}
			return result;
		}
		//皮肤名既可能是条目名，也可能是带扩展名的文件名，两种都认
		return data.skins[skin] ?? data.skins[whichWayFile.removeExt(skin)];
	}

	/**
	 * 把干员的图片/皮肤**添加**到任意节点上（走 `avatarBackground.ts` 的两层背景，而不是引擎的单层背景）
	 *
	 * 存在的理由：场上头像的立绘由劫持入口自动画，但「主动贴一张干员图」的场景（投稿预览、
	 * 自定义面板、对话框卡片）没有劫持可用，直接用 `style.backgroundImage` 就会踩回老问题 ——
	 * 立绘的透明区域透出底下的东西。这里统一走 `mountPortrait`，保证和场上头像同一套结构、
	 * 同一份位置设定（`pos.json`）。
	 * @param node 目标节点：必须是 div，且自身有尺寸（两层背景是 `position:absolute; inset:0`）
	 * @param name 干员id
	 * @param skin 皮肤名；留空则用该干员当前生效的皮肤
	 * @returns 是否画上：解析不到图片或非 div 时返回 false，节点保持原样
	 */
	addPortrait(node: HTMLElement, name: string, skin?: string): boolean {
		const path = skin ? this.getCharacterSkin(name, skin)?.path : this.getCurrentSkinPath(name);
		if (!path) {
			console.warn(`[whichWaySkin] 找不到图片（角色：${name}${skin ? `，皮肤：${skin}` : ""}），未添加`);
			return false;
		}
		return mountPortrait(node, path);
	}

	/**
	 * 立绘位置/缩放设定（`json/pos.json` 的内存形态）：干员id → 皮肤名 → `{ x, y, scale }`。
	 *
	 * 返回的是**活引用**，改它就是在改当前生效的设定（要重绘才看得见，且不会自动落盘）；
	 * 想直接落盘调 `flushPortraitPos()`。暴露的用途：控制台查配置、外部面板批量重置。
	 */
	get posData(): Record<string, Record<string, PortraitPos>> {
		return getPosData();
	}

	/** 把内存里的立绘设定立刻写进 `json/pos.json`（拖拽松手/退出拖拽时已会自动调，这里给手动兜底） */
	flushPortraitPos(): void {
		flushSave();
	}

	/** 读某干员某皮肤当前生效的立绘设定；没有配置时返回缺省值，不会返回 undefined */
	getPortraitPos(name: string, skin = DEFAULT_SKIN_NAME): PortraitPos {
		return getPos(name, skin);
	}

	/**
	 * 设置角色皮肤
	 * @returns 是否写入成功：找不到该皮肤时为 false（调用方据此决定要不要更新界面，避免"界面切了但配置没变"）
	 */
	setCharacterSkin(name: string, skin: string): boolean {
		if (whichWayUtil.isDeveloperMode()) console.log(`[whichWaySkin] setCharacterSkin ${name} ${skin}`);
		if (skin === "经典形象" && whichWaySkin._skinStore[name]) {
			this.syncSkin({key:name,del:true});
			return true;
		}
		const skinData = this.getCharacterSkin(name, skin);
		if (!skinData) {
			console.warn(`[whichWaySkin] 找不到皮肤「${skin}」（角色：${name}），本次切换已忽略`);
			return false;
		}
		this.syncSkin({key:name,value:[skinData.name,skinData.path]});
		return true;
	}

	syncSkin({key, value,del}: {key:string,value?:[string,string],del?:boolean}){
		if(del === true){
			delete this._skinStore[key];
			delete window.whichWaySave.skinConfig[key];
			delete lib.config.skin[key];
			whichWayUtil.saveConfig("skin", lib.config.skin, undefined);
			whichWayUtil.saveConfig("skinConfig", window.whichWaySave.skinConfig);
		}else{
			if(value === void 0) throw new Error("value is undefined");
			this._skinStore[key] = value;
			window.whichWaySave.skinConfig[key] = value[0];
			lib.config.skin[key] = value;
			whichWayUtil.saveConfig("skin", lib.config.skin, undefined);
			whichWayUtil.saveConfig("skinConfig", window.whichWaySave.skinConfig);
		}
	}

	refreshSkin() {
		const allPlayers = game.players.concat(game.dead);
		if (allPlayers.length === 0) return;
		for (const player of allPlayers) {
			player.node.avatar.setBackground(player.name1, "character");
			if (player.name2) player.node.avatar2.setBackground(player.name2, "character");
			spineWorker.updateDyc(player.name, player);
		}
	}

	/**
	 * 获取角色的当前皮肤
	 */
	getCurentSkin(name: string, igExt: boolean = true): string {
		let skin = this._skinStore?.[name]?.[0];
		if (!skin) skin = "经典形象.jpg";
		return igExt ? whichWayFile.removeExt(skin) : skin;
	}

	/**
	 * 获取角色的当前皮肤路径
	 */
	getCurrentSkinPath(name: string): string {
		let skin = this._skinStore?.[name]?.[1];
		if (!skin) {
			if (window.whichWaySave.hasChar(name)) skin = whichWayFile.getCharacterPortraitPath(name);
			else {
				const char = get.character(name);
				if (char.img !== undefined) return char.img;
				else if (char.trashBin) {
					for (let any of char.trashBin) {
						if (any.startsWith("ext:")) {
							return any.replace("ext:", "extension/");
						}
					}
				}
				return `image/character/${name}.jpg`;
			}
		}
		return skin;
	}

	/**
	 * 检查皮肤设置,不全的自动补全,并且判断是否需要同步
	 */
	checkSkinSetting() {
		lib.config.qhly_skinset ??= {
			skin: {
				//key-value方式，存放武将皮肤名
			},
			skinAudioList: {
				//key-value方式，存放武将皮肤配音
			},
			audioReplace: {
				//key-value方式，存放配音映射逻辑。
			},
			djtoggle: {},
		};
		lib.config.qhly_skinset.skin ??= {};
		lib.config.qhly_skinset.skinAudioList ??= {};
		lib.config.qhly_skinset.audioReplace ??= {};
		lib.config.qhly_skinset.djtoggle ??= {};

		lib.config.skin ??= {};

		this._skinStore = this._skinStore || {};
	}

	/**
	 * 选择冲突皮肤
	 */
	showConflictedSkin() {
		const overlay = ui.create.div(".conflictedSkinOverlay-whichWaySkin .whichWayOverlay", document.body);
		const app = createApp(ConfOverride).mount(overlay);
		return new Promise(resolve => {
			this.pendingReslove["showConflictedSkin"] = resolve;
		});
	}

	syncAllSkinConfig() {
		if (this._isSyncing) return;
		this._isSyncing = true;
		this.checkSkinSetting();

		const self = this;

		/**
		 * 写入一条皮肤配置；**路径解析不出来时删键，绝不留下 `undefined`**。
		 *
		 * 引擎的 `setBackground` 只看 `lib.config.skin[name]` 这个键在不在（`init/polyfill.ts:205-206`），
		 * 键在就无条件取 `[1]`，不再回落到武将数据上的 `img`；`setBackgroundImage` 又是字符串拼接
		 * （`polyfill.ts:250-262`），于是 `[皮肤名, undefined]` 会被贴成 `url("<assetURL>undefined")` ——
		 * 立绘画空，还把本来有效的 `char.img`（即本扩展注册时写好的「经典形象」立绘）挤掉。
		 * 删键后引擎走 `nameinfo.img` 那条分支；下面的 `lib.config.skin = full` 与各处 `saveConfig`
		 * 会把这条失效存档一并清掉，重启后不会复现。
		 */
		const store = (key: string, skinName: string, path: unknown) => {
			if (typeof path === "string" && path.length > 0) {
				self._skinStore[key] = [skinName, path];
				return;
			}
			console.warn(`[whichWaySkin] 皮肤「${skinName}」（角色：${key}）解析不到图片路径，本条配置已丢弃，回落到经典形象`);
			delete self._skinStore[key];
		};

		const loadFrom = (obj: Record<string, any>, isTransformed: boolean) => {
			for (const key in obj) {
				const val = obj[key];
				if (isTransformed) {
					if (typeof val === "string") {
						//@ts-ignore
						store(key, val, self.getCharacterSkin(key, whichWayFile.removeExt(val))?.path ?? self._skinStore[key]?.[1]);
					}
				} else {
					if (Array.isArray(val) && val.length >= 1 && typeof val[0] === "string") {
						//路径按皮肤名重新解析：皮肤目录整体迁移后，存档里烙着的旧路径要让位给
						//本次扫描到的真实路径；解析不到（如本体/其它扩展的皮肤）才沿用原值。
						store(key, val[0], self.getCharacterSkin(key, whichWayFile.removeExt(val[0]))?.path ?? val[1]);
					} else if (typeof val === "string") {
						//@ts-ignore
						store(key, val, self.getCharacterSkin(key, whichWayFile.removeExt(val))?.path);
					}
				}
			}
		};
		const config = whichWayUtil.config("skinOverride");
		const tasks = [
			{ key: "whichWay", run: () => loadFrom(window.whichWaySave?.skinConfig || {}, true) },
			{ key: "noname", run: () => loadFrom(lib.config.skin || {}, false) },
			{ key: "qhly", run: () => loadFrom(lib.config.qhly_skinset?.skin || {}, true) },
		];

		const idx = tasks.findIndex(t => t.key === config);
		if (idx !== -1) {
			tasks.push(...tasks.splice(idx, 1));
		}

		tasks.forEach(t => t.run());

		try {
			const full = { ...this._skinStore };
			const simple = this.transformSkinData(full);

			lib.config.skin = full;
			lib.config.qhly_skinset.skin = simple;
			window.whichWaySave.skinConfig = simple;

			whichWayUtil.saveConfig("skin", full, undefined);
			whichWayUtil.saveConfig("qhly_skinset", lib.config.qhly_skinset, undefined);
			whichWayUtil.saveConfig("skinConfig", window.whichWaySave.skinConfig);
		} finally {
			this._isSyncing = false;
		}
	}

	/**
	 * 将本体皮肤数据格式转变为千幻、驶舰之向数据格式
	 * - 若值为 [string, string] 数组，则取第一个元素；
	 * - 否则保留原始值不变。
	 */
	transformSkinData(data: Record<string, unknown>): Record<string, string> {
		return Object.fromEntries(
			Object.entries(data).map(([key, value]) => {
				if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
					return [key, value[0]];
				}
				return [key, String(value)];
			})
		);
	}

	/**
	 * 清除皮肤配置
	 */
	clearSkinConfig() {
		if (!whichWayUtil.isDeveloperMode()) {
			console.warn("WhichWaySkin.clearSkinConfig can only be called in developer mode.");
			return;
		}
		// 清空所有属性
		for (const key in this._skinStore) {
			delete this._skinStore[key];
		}
	}

	initConfictedSkins() {
		this.checkSkinSetting();

		const skinConfig = window.whichWaySave.skinConfig;
		const skin = lib.config.skin;
		const qhly_skinset = lib.config.qhly_skinset.skin;
		const selected = this.confictedSkins.selected;

		for (const key in skinConfig) {
			if (selected[key] && [skinConfig[key], skin[key], qhly_skinset[key]].includes(selected[key])) continue;
			//暂时只处理本扩展武将
			if (!window.whichWaySave.hasChar(key)) continue;

			if (skin[key]) {
				if (Array.isArray(skin[key]) && skin[key][0] !== skinConfig[key]) {
					this.confictedSkins.add(key, skin[key][0], "noname");
					this.confictedSkins.add(key, skinConfig[key], "whichWay");
				}
			}
			if (qhly_skinset[key] && qhly_skinset[key] !== skinConfig[key]) {
				this.confictedSkins.add(key, qhly_skinset[key], "qhly");
				this.confictedSkins.add(key, skinConfig[key], "whichWay");
			}
		}
	}

	/**
	 * 皮肤数据
	 */
	private skinData: Record<
		string,
		{
			name: string;
			skins: Record<
				string,
				{
					name: string;
					path: string;
				}
			>;
		}
	> = {};

	/**
	 * 共享的皮肤配置对象
	 *
	 * 路径一定是非空字符串：`[皮肤名, undefined]` 会被引擎贴成 `url(undefined)` 并挤掉有效的 `char.img`，
	 * 写入口（`syncAllSkinConfig` 的 `store()` 与 `setCharacterSkin`）都保证解析不到就不写键。
	 */
	private _skinStore: Record<string, [string, string]> = {};

	private _isSyncing = false;

	/**
	 * 冲突的皮肤
	 */
	confictedSkins = confictedSkin;

	/**
	 * 等待的Promise
	 */
	pendingReslove: Record<string, any> = {};
}

export const whichWaySkin = new WhichWaySkin();

await whichWaySkin.init();

onSetDev({
	name: "WhichWaySkin_dev",
	fn: () => {
		//@ts-ignore
		window.whichWaySkin = whichWaySkin;
	},
});

window.whichWay.register("skin", whichWaySkin);
