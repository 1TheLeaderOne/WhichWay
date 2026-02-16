import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "./file.js";
import { onConfig, onInit, onSetDev } from "./hooks/index.js";
import { whichWayToast } from "./toast/index.js";
import { whichWayUtil } from "./utill.js";
import { whichWayVersion } from "./version.js";
class WhichWaySkin {
	/**
	 * 皮肤组件初始化
	 */
	async init() {
		await whichWayUtil
			.measureExecutionTime(async () => {
				await this.autoUpdateSkinData();
				this.proxySkinConfig();
			})
			.then(({ duration }) => {
				if (whichWayUtil.isDeveloperMode()) console.log(`[whichWaySkin] init skin time ${duration}ms`);
			});

		onInit({
			name: "whichWaySkinInitSkinData",
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
		const skinData = this.getCharacterSkin(name, skin);
		if (!skinData) return;
		//直接动本体的,方便同步
		lib.config.skin[name] = [skinData.name, skinData.path];
	}

	refreshSkin() {
		const allPlayers = game.players.concat(game.dead);
		if (allPlayers.length === 0) return;
		for (const player of allPlayers) {
			player.node.avatar.setBackground(player.name1, "character");
			if (player.name2) player.node.avatar2.setBackground(player.name2, "character");
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
				const player = game.players.find((p) => p.name1 === name || p.name2 === name);
				const avatar = player?.node[player.name1 === name? "avatar" : "avatar2"];
				//@ts-ignore
				skin = avatar.style.backgroundImage;
			}
		}
		return skin;
	}

	/**
	 * 代理皮肤设置(千幻、本体、驶舰之向)，以实现皮肤同步更新
	 */
	proxySkinConfig(): void {
		lib.config.qhly_skinset ??= {};
		lib.config.qhly_skinset.skin ??= {};
		lib.config.skin ??= {};

		const self = this;

		self._skinStore = self._skinStore || {};

		const loadFrom = (obj: Record<string, any>, isTransformed: boolean) => {
			for (const key in obj) {
				const val = obj[key];
				if (isTransformed) {
					if (typeof val === "string") {
						const existing = self._skinStore[key];
						//@ts-ignore
						const path = existing?.[1] ?? self.getCharacterSkin(key, whichWayFile.removeExt(val))?.path;
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

		loadFrom(lib.config.skin || {}, false);
		loadFrom(lib.config.qhly_skinset.skin || {}, true);
		loadFrom(window.whichWaySave.skinConfig || {}, true);

		let isSyncing = false;
		const syncAll = () => {
			if (isSyncing) return;
			isSyncing = true;
			try {
				const full = { ...self._skinStore };
				const simple = self.transformSkinData(full);

				lib.config.skin = full;
				lib.config.qhly_skinset.skin = simple;
				window.whichWaySave.skinConfig = simple;

				whichWayUtil.saveConfig("skin", full, undefined);
				whichWayUtil.saveConfig("qhly_skinset", lib.config.qhly_skinset, undefined);
				whichWayUtil.saveConfig("skinConfig", window.whichWaySave.skinConfig);
			} finally {
				isSyncing = false;
			}
		};

		// 初始同步
		syncAll();

		const createSkinProxy = (isTransformed: boolean, obj: any) => {
			return new Proxy(obj, {
				get(target, prop: string | symbol) {
					if (prop === "__proto__" || typeof prop !== "string") return undefined;
					const entry = self._skinStore[prop];
					if (!entry) return undefined;
					return isTransformed ? entry[0] : entry;
				},

				set(target, prop: string | symbol, value: any): boolean {
					if (typeof prop !== "string") return true;
					if (isTransformed) {
						if (typeof value === "string") {
							const existing = self._skinStore[prop];
							//@ts-ignore
							const path = existing?.[1] ?? self.getCharacterSkin(prop, whichWayFile.removeExt(value))?.path;
							self._skinStore[prop] = [value, path];
						}
					} else {
						if (Array.isArray(value) && value.length >= 1 && typeof value[0] === "string") {
							self._skinStore[prop] = [value[0], value[1]];
						} else if (typeof value === "string") {
							self._skinStore[prop] = [value, undefined];
						}
					}
					syncAll();
					return true;
				},

				deleteProperty(target, prop: string | symbol): boolean {
					if (typeof prop === "string") {
						delete self._skinStore[prop];
						syncAll();
					}
					return true;
				},

				ownKeys(): (string | symbol)[] {
					return Object.keys(self._skinStore);
				},

				getOwnPropertyDescriptor(target, prop: string | symbol) {
					if (typeof prop !== "string" || !(prop in self._skinStore)) {
						return undefined;
					}
					return {
						enumerable: true,
						configurable: true,
						value: isTransformed ? self._skinStore[prop][0] : self._skinStore[prop],
					};
				},
			});
		};

		lib.config.skin = createSkinProxy(false, lib.config.skin);
		lib.config.qhly_skinset.skin = createSkinProxy(true, lib.config.qhly_skinset.skin);
		window.whichWaySave.skinConfig = createSkinProxy(true, window.whichWaySave.skinConfig);
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
