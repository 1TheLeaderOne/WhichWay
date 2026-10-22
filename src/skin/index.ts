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
		//这里是模块顶层 await（文件末尾 whichWaySkin.init()）的一环：皮肤数据/位置档案只要抛一次
		//（没有 fs 后端、首帧写缓存失败等），整个 init() 就 reject，后面的 onInit/onConfig/onArenaReady
		//注册全都不会执行 ⇒ 配音、模组、干员等一起跟着失效。皮肤读不到不该有这种连带面积。
		await whichWayUtil
			.measureExecutionTime(async () => {
				//立绘位置设定要先于任何一次绘制就位，否则首帧会按默认值画一遍再跳一次
				await loadPos();
				await this.autoUpdateSkinData();
			})
			.then(({ duration }) => {
				if (whichWayUtil.isDeveloperMode()) console.log(`[whichWaySkin] init skin time ${duration}ms`);
			})
			.catch(error => {
				console.error("[whichWaySkin] 皮肤数据初始化失败，已跳过皮肤层，其余功能继续加载", error);
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

					//为了让经典形象在皮肤列表的最前面。
					//⚠️ 不能靠 `getCharacterPortraitFile()` 兜底的 `.jpg`：目录里没有这位干员的立绘时，
					//那会得到一条必然 404 的路径。索引里没有就干脆不加这条（皮肤列表里只剩真实存在的皮肤）。
					if (!whichWayFile.characterPortraitExt[name]) continue;
					this.skinData[name].skins = {
						经典形象: {
							name: whichWayFile.getCharacterPortraitFile(name),
							path: whichWayFile.getCharacterPortraitPath(name),
						},
						...this.skinData[name].skins,
					};
				}

				//皮肤配置的合并必须赶在第一次绘制之前：
				//引擎的 `setBackground` 只认 `lib.config.skin[name]`（数组形态），千幻只认
				//`lib.config.qhly_skinset.skin[name]`（字符串形态）。在本体 init 末尾（各扩展包的 init
				//都已跑完、`saveConfig` 也都落盘完）合并一次，两种形态才是一致的、当场绘制也才是对的。
				//⚠️ 不能放进 `init()`：那时千幻的扩展包可能还没 init，搬过去的 `qhly_skinset` 会被它的默认值覆盖。
				this.syncAllSkinConfig();

				//同步后立刻把当前对局里的立绘刷一遍（已经上场的玩家）。
				//选将预览不需要单独处理：它的每个候选都是 `ui.create.buttonPresets.character` 建出来的，
				//`avatarBackground.ts` 在该预设的 after 钩子里会按当前皮肤重画。
				this.refreshSkin();
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
					//{ ...lib.config.sjzxDycAssets } 只是浅拷贝，下面那句 skin.action = skin.action[0]
					//写在嵌套的 { 皮肤: { action } } 上 ⇒ 直接改到了 lib.config 里那份存盘的原始数据，
					//数组形态被永久削成字符串。这里改成深拷贝，归一化只作用于本次要广播出去的副本。
					let piqieData = structuredClone(lib.config.sjzxDycAssets ?? {});
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
						//原来只在 .then 里复位：autoUpdateSkinData 一旦 reject（扫描/写缓存失败）
						//updatingSkinData 就永久停在 true，这个按钮之后每次都只弹「请勿重复操作」。
						try {
							await whichWaySkin.autoUpdateSkinData(true);
						} catch (error) {
							//不让异常从 onclick 里逃出去（否则变成 unhandled rejection），也不要在失败后报「更新完成」
							console.error("[whichWaySkin] 皮肤数据更新失败", error);
							whichWayToast.showToast("[驶舰之向] 皮肤数据更新失败，详见控制台", 3000, "topLeft", "configTips_updateSkinData");
							return;
						} finally {
							window.whichWaySave.updatingSkinData = false;
							whichWayToast.removeToastById("configTips_updateSkinData_updatingSkinData");
						}
						whichWayToast.showToast("[驶舰之向] 皮肤数据更新完成!", 3000, "topLeft", "configTips_updateSkinData");
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
		//文件名不一定是「皮肤名.png」（`夏卉 FA075.png`、`时遗14.png` 之类），
		//所以皮肤列表与文件名索引必须来自同一次目录扫描
		await whichWayFile.initSkinFileIndex(this.skinData);
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
		const entry = data.skins[skin] ?? data.skins[whichWayFile.removeExt(skin)];
		if (entry) return entry;
		//皮肤目录里真实存在的文件兜底：条目丢了（缓存过期、条目名与文件名不一致）也不至于切不过去
		const fileName = whichWayFile.getSkinFileName(name, skin);
		return fileName ? { name: fileName, path: whichWayFile.compilePath(`skin:${name}/${fileName}`) } : undefined;
	}

	/**
	 * 皮肤名 → 皮肤目录里**真实存在**的文件名（带扩展名）。
	 *
	 * 静皮目录里有不少文件名不是「皮肤名.png」（`时遗14.png`、`远行前的野餐.png` 之类），
	 * 而动皮数据用的是短名；这里按目录扫描出来的索引取，**取不到就返回 undefined**，
	 * 绝不硬拼一个 `{皮肤名}.png`（那在改名过的皮肤上必然 404）。
	 * @param name 干员id
	 * @param skin 皮肤名或文件名（带不带扩展名都行）
	 */
	getSkinFileName(name: string, skin: string): string | undefined {
		const fileName = whichWayFile.getSkinFileName(name, skin);
		if (fileName) return fileName;
		const base = whichWayFile.removeExt(skin ?? "");
		const entry = base ? this.skinData[name]?.skins?.[base] : undefined;
		return entry?.name;
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
		if (skin === DEFAULT_SKIN_NAME) {
			//「经典形象」一律按「删键」处理（引擎落到 `char.img`）：即使本扩展此刻没有这条存档也要执行，
			//否则千幻那边的字符串存档会原样留着，下次启动 `syncAllSkinConfig` 又把它搬回来
			this.syncSkin({ key: name, del: true });
			return true;
		}
		const skinData = this.getCharacterSkin(name, skin);
		if (!skinData) {
			console.warn(`[whichWaySkin] 找不到皮肤「${skin}」（角色：${name}），本次切换已忽略`);
			return false;
		}
		this.syncSkin({ key: name, value: [skinData.name, skinData.path] });
		return true;
	}

	/**
	 * 写一条皮肤配置，并把**同一条选择**同步到千幻与本体存档。
	 *
	 * 三处配置是三个消费者各看各的：引擎看 `lib.config.skin`（数组）、千幻看 `qhly_skinset.skin`（字符串）、
	 * 本扩展看自己的 `skinConfig`。只写自己那一份的话，下一次启动 `syncAllSkinConfig()` 会拿另外两份
	 * （其中还停留在旧选择）来覆盖，表现出来就是「换了皮肤，重开又变回去了」。
	 */
	syncSkin({ key, value, del }: { key: string; value?: [string, string]; del?: boolean }) {
		lib.config.skin ??= {};
		this.checkSkinSetting();
		if (del === true) {
			delete this._skinStore[key];
			delete window.whichWaySave.skinConfig[key];
			delete lib.config.skin[key];
			delete lib.config.qhly_skinset.skin[key];
		} else {
			if (value === void 0) throw new Error("value is undefined");
			this._skinStore[key] = value;
			window.whichWaySave.skinConfig[key] = value[0];
			lib.config.skin[key] = value;
			lib.config.qhly_skinset.skin[key] = value[0];
		}
		whichWayUtil.saveConfig("skin", lib.config.skin, undefined);
		whichWayUtil.saveConfig("skinConfig", window.whichWaySave.skinConfig);
		whichWayUtil.saveConfig("qhly_skinset", lib.config.qhly_skinset, undefined);
	}

	/**
	 * 按当前皮肤配置重绘场上的玩家。
	 *
	 * 引擎的 `setBackground` 只管「角色 id → 立绘」，对干员来说皮肤是另一套配置（`lib.config.skin`），
	 * 所以换肤/同步之后必须重新贴一次图。副将走 `name2`：`player.name` 在双将时是 `a+b/dual` 这种合成名，
	 * 拿它去查皮肤表永远查不到。
	 */
	refreshSkin() {
		const allPlayers = game.players.concat(game.dead);
		if (allPlayers.length === 0) return;
		for (const player of allPlayers) {
			const name1 = player.name1 || player.name;
			if (name1 && player.node?.avatar) {
				player.node.avatar.setBackground(name1, "character");
				spineWorker.updateDyc(name1, player);
			}
			if (player.name2 && player.node?.avatar2) {
				player.node.avatar2.setBackground(player.name2, "character");
				spineWorker.updateDyc(player.name2, player);
			}
		}
	}

	/**
	 * 获取角色的当前皮肤
	 * @param name 干员id
	 * @param igExt 是否去掉扩展名（返回值形态：`夏卉 FA075` / `夏卉 FA075.png`）
	 */
	getCurentSkin(name: string, igExt: boolean = true): string {
		let skin = this._skinStore?.[name]?.[0];
		if (!skin) skin = `${DEFAULT_SKIN_NAME}.jpg`;
		return igExt ? whichWayFile.removeExt(skin) : skin;
	}

	/**
	 * 「某个武将在本扩展的皮肤配置里应该显示哪张图」—— 与 `getCurrentSkinPath` 的区别在于：
	 * **没有选择时返回 undefined**，把「没有配置」与「配置里是一张坏图」分开。
	 *
	 * 给绘制层用：有结果就用它（本扩展解析的路径最可靠），没有就走引擎自己的 `setBackground`。
	 * - 本扩展武将没有选择 ⇒ 立绘（经典形象）；
	 * - 其它武将没有选择 ⇒ undefined（交回引擎，`char.img` 之类由引擎处理）；
	 * - 其它武将**有**选择 ⇒ 存档里的路径（玩家在千幻/本体里换过动皮/皮肤）。
	 * @param name 武将id
	 */
	skinPathOf(name: string): string | undefined {
		const selected = this._skinStore?.[name]?.[1];
		if (typeof selected === "string" && selected.length > 0) return selected;
		if (window.whichWaySave?.hasChar?.(name) === true) return whichWayFile.getCharacterPortraitPath(name);
		return undefined;
	}

	/**
	 * 获取角色的当前皮肤路径
	 */
	getCurrentSkinPath(name: string): string {
		let skin = this._skinStore?.[name]?.[1];
		if (!skin) {
			//非本扩展武将：走引擎的 `img` / `trashBin` / 默认图，路径也是相对 `lib.assetURL` 的
			if (!window.whichWaySave.hasChar(name)) {
				const char = get.character(name);
				if (!char) return `image/character/${name}.jpg`;
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
			skin = whichWayFile.getCharacterPortraitPath(name);
		}
		return skin;
	}

	/**
	 * 检查皮肤设置,不全的自动补全,并且判断是否需要同步
	 */
	checkSkinSetting() {
		//逐字段补齐：千幻读过一次配置后会把 `qhly_skinset` 建出来，但未必带齐 `skin` 等字段
		//（`??=` 只在整体是 undefined 时才赋值），缺字段时后面 `qhly_skinset.skin[key] = …` 会直接抛
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

	/**
	 * 合并三份皮肤存档（本扩展 / 本体 / 千幻），并写回三处。
	 *
	 * 合并规则（`skinOverride` 配置决定「谁排最后」，排最后的源赢）：
	 * - **本扩展武将**：以本扩展的皮肤表为准。干员的皮肤由本扩展提供，存档里只需记住**皮肤名**，
	 *   路径一律按名字从本次扫描出的皮肤表重新解析 —— 存盘里的旧路径（目录迁移、改名）不能压住真实位置。
	 *   解析不到就**保留原选择**而不是删键：删键等于把玩家选好的皮肤悄悄退回「经典形象」。
	 * - **非本扩展武将**：原样保留，只剔除 `undefined`/`null` 的路径。
	 *   以前这里是「解析不到就删键」，而本扩展的皮肤表里根本没有本体武将 ——
	 *   于是本体武将的动皮选择在每次启动时都被删掉，再被本扩展的存档覆盖成「经典形象」（重开即丢）。
	 */
	syncAllSkinConfig() {
		if (this._isSyncing) return;
		this._isSyncing = true;
		this.checkSkinSetting();

		const self = this;

		/** 干员id → { 皮肤名, 路径 }（本次合并的结果） */
		const resolved: Record<string, [string, string]> = {};

		/**
		 * 记一条皮肤配置。
		 *
		 * 本扩展武将走 `resolveOwnSkin`：路径按皮肤名重新解析，解析不到就沿用存档里的路径（而不是删键）——
		 * 引擎的 `setBackground` 只看 `lib.config.skin[name]` 这个键在不在（`init/polyfill.ts:205-206`），
		 * 键被删就等于「没人选过皮肤」，回落到经典形象；而 `[皮肤名, undefined]` 又会被贴成 `url("…undefined")`。
		 * 两种坏结果都避开：只会写入非空字符串路径。
		 */
		const store = (key: string, skinName: unknown, path: unknown) => {
			if (typeof skinName !== "string" || skinName.length === 0) return;
			const own = window.whichWaySave?.hasChar?.(key) === true;
			if (own) {
				const resolvedPath = self.getCharacterSkin(key, skinName)?.path ?? (typeof path === "string" && path.length > 0 ? path : undefined);
				if (resolvedPath === undefined) {
					console.warn(`[whichWaySkin] 皮肤「${skinName}」（干员：${key}）在本扩展的皮肤表里找不到，且存档中没有可用路径，本条已丢弃`);
					return;
				}
				resolved[key] = [skinName, resolvedPath];
				return;
			}
			if (typeof path === "string" && path.length > 0) resolved[key] = [skinName, path];
			else console.warn(`[whichWaySkin] 皮肤「${skinName}」（角色：${key}）没有有效的图片路径，本条已丢弃`);
		};

		const loadFrom = (obj: unknown, isTransformed: boolean) => {
			if (!obj || typeof obj !== "object") return;
			for (const key in obj as Record<string, any>) {
				const val = (obj as Record<string, any>)[key];
				if (isTransformed) {
					if (typeof val === "string") store(key, val, self.getCharacterSkin(key, whichWayFile.removeExt(val))?.path);
				} else if (Array.isArray(val) && typeof val[0] === "string") {
					store(key, val[0], val[1]);
				} else if (typeof val === "string") {
					//旧格式：本体皮肤配置里直接存皮肤名字符串
					store(key, val, `image/skin/${key}/${val}.jpg`);
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

		try {
			tasks.forEach(t => t.run());

			//三处存档里**已经生效**的键必须保留：合并只负责补齐/修正路径，不能把一份存档里
			//另一份没有的条目（例如玩家在千幻里给本体武将挑的皮肤）顺手清掉。
			for (const source of [window.whichWaySave?.skinConfig, lib.config.qhly_skinset?.skin]) {
				if (!source || typeof source !== "object") continue;
				for (const key in source) {
					const val = source[key];
					if (typeof val === "string" && val.length > 0 && !(key in resolved)) {
						store(key, val, self.getCharacterSkin(key, whichWayFile.removeExt(val))?.path);
					}
				}
			}
			const current = lib.config.skin;
			if (current && typeof current === "object") {
				for (const key in current) {
					const val = current[key];
					if (Array.isArray(val) && typeof val[0] === "string" && val[0].length > 0 && !(key in resolved)) {
						store(key, val[0], val[1]);
					}
				}
			}

			const full: Record<string, [string, string]> = {};
			for (const [key, val] of Object.entries(this._skinStore)) {
				//内存里的活引用优先（换肤刚写过、还没合并到的条目）
				if (Array.isArray(val) && typeof val[0] === "string" && typeof val[1] === "string" && val[1].length > 0) full[key] = val;
			}
			Object.assign(full, resolved);

			const simple = this.transformSkinData(full);

			this._skinStore = full;
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
	 * 皮肤数据：干员id → { name, skins: { 皮肤名 → { name: 文件名, path: 绝对路径 } } }
	 * 由 `initSkinData()`（= `whichWayFile.initSkinFileIndex()`）重建，缓存里存的就是这个形状。
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
