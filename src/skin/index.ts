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
class WhichWaySkin {
	/**
	 * 皮肤组件初始化
	 */
	async init() {
		await whichWayUtil
			.measureExecutionTime(async () => {
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
							name: "经典形象.jpg",
							path: whichWayFile.compilePath(`img:character/${name}.jpg`),
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
	 * 自动更新皮肤数据
	 * @param forced 是否强制更新
	 */
	async autoUpdateSkinData(forced = false) {
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
	getCharacterSkin(name: string, skin?: string): Record<string, string> | undefined {
		if (!this.skinData[name]) return;
		if (!skin) {
			const result = {};
			for (const key in this.skinData[name].skins) {
				result[key] = this.skinData[name].skins[key].path;
			}
			return result;
		}
		skin = whichWayFile.removeExt(skin);
		return this.skinData[name].skins[skin];
	}

	/**
	 * 设置角色皮肤
	 */
	setCharacterSkin(name: string, skin: string): void {
		if (whichWayUtil.isDeveloperMode()) console.log(`[whichWaySkin] setCharacterSkin ${name} ${skin}`);
		if (skin === "经典形象" && whichWaySkin._skinStore[name]) {
			this.syncSkin({key:name,del:true});
			return;
		}
		const skinData = this.getCharacterSkin(name, skin);
		if (!skinData) return;
		this.syncSkin({key:name,value:[skinData.name,skinData.path]});
	}

	syncSkin({key, value,del}: {key:string,value?:[string,string|undefined],del?:boolean}){
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
			if (window.whichWaySave.allCharacters.includes(name)) skin = whichWayFile.compilePath(`img:character/${name}.jpg`);
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

		const loadFrom = (obj: Record<string, any>, isTransformed: boolean) => {
			for (const key in obj) {
				const val = obj[key];
				if (isTransformed) {
					if (typeof val === "string") {
						const existing = self._skinStore[key];
						//@ts-ignore
						const path = self.getCharacterSkin(key, whichWayFile.removeExt(val))?.path ?? existing?.[1];
						self._skinStore[key] = [val, path];
					}
				} else {
					if (Array.isArray(val) && val.length >= 1 && typeof val[0] === "string") {
						self._skinStore[key] = [val[0], val[1]];
					} else if (typeof val === "string") {
						self._skinStore[key] = [val, undefined];
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
			if (!window.whichWaySave.allCharacters.includes(key)) continue;

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
	 */
	private _skinStore: Record<string, [string, string | undefined]> = {};

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
