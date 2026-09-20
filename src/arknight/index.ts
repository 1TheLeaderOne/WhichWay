import { whichWayFile } from "../file.js";
import { onInit, onSetDev, onConfig, onContent } from "../hooks/index.js";
import { whichWayArknightShcema } from "./shcema.js";
import { whichWayUtil } from "../utill.js";
import { whichWayArknightRedirect } from "./redirect.js";
import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayVersion } from "../version.js";
import { whichWayToast } from "../toast/index.js";

class WhichWayArknight {
	/**
	 * 初始化
	 */
	async init() {
		//更新明日方舟数据
		const t0 = performance.now();
		await this.autoUpdate();
		const tUpd = performance.now() - t0;

		//加载明日方舟数据
		const t1 = performance.now();
		await this.loadArknightData();
		const tLoad = performance.now() - t1;

		const t2 = performance.now();
		await this.loadShcema();
		const tShcema = performance.now() - t2;

		//arknight 三段总耗时 > 500ms 时才展开折叠明细
		const total = tUpd + tLoad + tShcema;
		if (total > 500) {
			console.groupCollapsed(`%c[WhichWay·arknight] init ${total.toFixed(0)}ms`, "color:#e67e22;");
			console.log(`  autoUpdate:       ${tUpd.toFixed(0)}ms`);
			console.log(`  loadArknightData: ${tLoad.toFixed(0)}ms`);
			console.log(`  loadShcema:       ${tShcema.toFixed(0)}ms`);
			console.groupEnd();
		}

		//为所有扩展角色添加对应的明日方舟角色数据
		onInit({
			name: "arknight_init",
			fn: packs => {
				for (let pack of packs) {
					for (let name in pack.character) {
						this.initCharArknight(pack.character[name]);
					}
				}
			},
			priority: -1145141919810,
		});

		onConfig({
			name: "whichWayNumberOfArknigtChars_add",
			fn() {
				return {
					name: "numberOfArknigtChars",
					options: {
						name: `明日方舟干员数:${Object.keys(whichWayArknight.arknightData.charword_table.charDefaultTypeDict).length}`,
						clear: true,
					},
				};
			},
			priority: 998,
		});
	}

	/**
	 * 加载明日方舟相关数据
	 *
	 * 两级加载（`json/arknight/` 下的全量数据 character_table ≈7.5MB + charword_table ≈8.1MB，
	 * 读盘 + JSON.parse 会长时间占住主线程，是启动耗时的主要来源之一）：
	 *
	 * 1. **快路径**：`json/cache/arknight.json` 存在、结构版本与扩展版本都匹配、
	 *    且本次启动没有重新下载过数据时，直接使用精简缓存（实测约 153KB），
	 *    **完全不触碰 json/arknight/ 下的全量文件**。
	 * 2. **慢路径**（首次启动 / 扩展版本变化 / 精简缓存结构版本变化 / 本次下载过数据）：
	 *    读全量 JSON → 按白名单裁剪（slimArknightData）→ 写回缓存 → 使用裁剪结果。
	 *
	 * @param {string} [path="json:arknight"] json文件的路径
	 */
	async loadArknightData(path: string = "json:arknight/") {
		//@ts-ignore
		if (!this.arknightData) this.arknightData = {};

		if (!this.arknightDataUpdated) {
			const cached = await this.readSlimCache();
			if (cached) {
				Object.assign(this.arknightData, cached);
				return;
			}
		}

		//只需要本层的 .json，step 传 0 让扫描只列一次目录（不必递归子目录）
		const { files } = await whichWayFile.getFileTree(path, 0);

		const jsonFiles = files.filter(file => file.name.endsWith(".json") && !this.loadSkipFiles.includes(file.name.replace(".json", "")));
		//各 JSON 相互独立，并行读取（character_table 体积较大，串行读取会明显拖慢启动）
		const jsonDatas = await Promise.all(jsonFiles.map(file => whichWayFile.readFile(file.path)));
		const raw: Record<string, any> = {};
		jsonFiles.forEach((file, i) => {
			raw[file.name.replace(".json", "")] = jsonDatas[i];
		});

		const slim = this.slimArknightData(raw);
		Object.assign(this.arknightData, slim);

		//写回精简缓存供下次启动使用；写失败只影响下次启动速度，不影响本次运行
		try {
			await whichWayFile.writeFileAsJson({ schema: this.slimCacheSchema, version: whichWayVersion.ext, data: slim }, "json:cache/", "arknight.json");
		} catch (e) {
			console.warn("[WhichWay] 写入明日方舟精简缓存失败（不影响本次运行）", e);
		}
	}

	/**
	 * 读取精简缓存。
	 *
	 * 不存在 / 解析失败 / 结构版本或扩展版本不匹配时返回 undefined（不抛错，由调用方走慢路径重建）。
	 */
	private async readSlimCache(): Promise<ArknightSlimData | undefined> {
		try {
			const cache: { schema?: number; version?: string; data?: ArknightSlimData } = await whichWayFile.readFile(`json:${this.slimCacheFile}`);
			if (!cache || cache.schema !== this.slimCacheSchema || cache.version !== whichWayVersion.ext || !cache.data) return;
			return cache.data;
		} catch (e) {
			//首次启动没有缓存文件是正常情况
			return;
		}
	}

	/**
	 * 把 `json/arknight/` 的全量数据裁剪成启动期真正用到的字段。
	 *
	 * ⚠️ 白名单必须与「本文件的实际读取点」严格一致：
	 * 若新增了读取 character_table / charword_table / char_patch_table 其它字段的代码，
	 * 必须同时（1）在此保留该字段、（2）同步 typings/arknight.d.ts 的 *Slim 类型、
	 * （3）把 slimCacheSchema +1 让老缓存失效——否则精简缓存会静默缺字段。
	 *
	 * 白名单依据（全仓核实：除本文件外没有任何位置读取这三张表）：
	 * - character_table[uid]：name（译名匹配）、subProfessionId（isCharacter）、tagList（getTags）、键存在性
	 * - char_patch_table.patchChars[uid]：name、subProfessionId、tagList
	 * - charword_table.charDefaultTypeDict：仅 Object.keys().length
	 * - charword_table.voiceLangTypeDict：Object.keys() 与 [lang].name
	 * - charword_table.voiceLangDict[uid].dict：仅真值判断与 Object.keys()
	 */
	slimArknightData(raw: Record<string, any>): ArknightSlimData {
		const rawCharacters: Record<string, ArknightCharacter> = raw.character_table ?? {};
		const character_table: Record<string, ArknightCharacterSlim> = {};
		for (const uid in rawCharacters) {
			const info = rawCharacters[uid];
			character_table[uid] = { name: info.name, subProfessionId: info.subProfessionId, tagList: info.tagList };
		}

		const rawPatchChars: Record<string, ArknightCharacter> | undefined = raw.char_patch_table?.patchChars;
		const patchChars: Record<string, ArknightCharacterSlim> = {};
		for (const uid in rawPatchChars ?? {}) {
			const info = rawPatchChars![uid];
			patchChars[uid] = { name: info.name, subProfessionId: info.subProfessionId, tagList: info.tagList };
		}

		const rawVoice: Partial<ArknightVoice> = raw.charword_table ?? {};

		//只需键存在性
		const charDefaultTypeDict: Record<string, boolean> = {};
		for (const key in rawVoice.charDefaultTypeDict ?? {}) charDefaultTypeDict[key] = true;

		//只需键 + 显示名
		const voiceLangTypeDict: Record<string, { name: string }> = {};
		const rawLangTypes = rawVoice.voiceLangTypeDict ?? {};
		for (const lang in rawLangTypes) voiceLangTypeDict[lang] = { name: rawLangTypes[lang].name };

		//只需「某干员在某语言下是否有台词」这一事实，因此把每个语言的对象压成键
		const voiceLangDict: Record<string, { dict: Record<string, boolean> }> = {};
		for (const uid in rawVoice.voiceLangDict ?? {}) {
			const dict: Record<string, boolean> = {};
			for (const lang in rawVoice.voiceLangDict![uid]?.dict ?? {}) dict[lang] = true;
			voiceLangDict[uid] = { dict };
		}

		return {
			character_table,
			char_patch_table: { patchChars },
			charword_table: { charDefaultTypeDict, voiceLangTypeDict, voiceLangDict },
		};
	}

	/**
	 * 构建映射表
	 */
	async loadShcema() {
		const {
			character: { whichWayUID: extUID, chineseName: cn, arknightUID: arkUID },
		} = this.shcema;
		const characters = window.whichWaySave.allCharacters;
		const arkData: Record<string, ArknightCharacterSlim> = this.arknightData.character_table;

		//以下中间量与具体 key 无关，提前算好。
		//原先它们在循环体内构建，每个 key 都对全部干员重算一遍 filter/map
		const hasArkCharacters = characters.filter(i => {
			const char = get.character(i) as WhichWayCharacter;
			return !!char && typeof char.arkuid === "string";
		});
		//显式声明了 arkuid 的干员按 arkuid 建索引：原实现是
		//「每个明日方舟 key 都遍历一遍全部干员」的二重循环
		//（表大小 × 干员数），建索引后整段降为线性。
		const arkUidToNames = new Map<string, string[]>();
		for (const name of hasArkCharacters) {
			const arkuid = (get.character(name) as WhichWayCharacter).arkuid!;
			let names = arkUidToNames.get(arkuid);
			if (!names) arkUidToNames.set(arkuid, (names = []));
			names.push(name);
		}
		const translations: (string | undefined)[] = characters.map(i => get.translation(i));
		const transToId = new Map<string, string>();
		characters.forEach((i, idx) => {
			const t = this.redirect.transfer(translations[idx]);
			if (t !== undefined && !transToId.has(t)) transToId.set(t, i);
		});

		for (let key in arkData) {
			const info = arkData[key];
			if (!this.isCharacter(info)) continue;

			//先判断对应的Character是否有arkuid（索引命中顺序与原内层循环一致）
			const declaredNames = arkUidToNames.get(key);
			if (declaredNames) {
				for (const name of declaredNames) {
					extUID[name] = key;
					arkUID[key] = name;
					cn.set([key, name], get.translation(name));
				}
			}

			const whichWayUID = transToId.get(info.name);
			if (whichWayUID !== undefined) {
				extUID[whichWayUID] = key;
				arkUID[key] = whichWayUID;
				cn.set([key, whichWayUID], info.name);
			}
		}

		//byd鹰角为什么就不能把升变阿米娅的数据合并到character_table???
		const amiyaData = this.arknightData.char_patch_table.patchChars;
		for (let key in amiyaData) {
			let info = amiyaData[key];
			if (!this.isCharacter(info)) continue;

			//滚到character_table里去
			arkData[key] = info;

			const amiyaName = this.redirect.transfer(key, "amiya");
			if (translations.includes(amiyaName)) {
				const whichWayUID: string = characters[translations.indexOf(amiyaName)]!;

				extUID[whichWayUID] = key;
				arkUID[key] = whichWayUID;
				cn.set([key, whichWayUID], amiyaName);
			}
		}
	}

	/**
	 * 明日方舟干员名 → 明日方舟uid 的反查索引（懒构建，仅构建一次）
	 *
	 * 原先 addShcema 对每个干员都遍历整张 character_table，且循环体内还对全部干员
	 * 反复做 filter/map，规模为 干员数 × 全表大小 × 干员数，是扩展加载的最大热点。
	 */
	private _arkNameIndex: Map<string, string> | null = null;

	private _getArkNameIndex(): Map<string, string> {
		if (!this._arkNameIndex) {
			const index = new Map<string, string>();
			const arkData: Record<string, ArknightCharacterSlim> = this.arknightData.character_table;
			for (const key in arkData) {
				if (!this.isCharacter(arkData[key])) continue;
				index.set(arkData[key].name, key);
			}
			this._arkNameIndex = index;
		}
		return this._arkNameIndex;
	}

	/**
	 * 添加到映射表
	 * @param { string } id 驶舰之向干员id（或明日方舟uid）
	 * @param { WhichWayCharacter } [char] 干员数据对象；传入后可识别干员显式声明的 arkuid
	 */
	async addShcema(id: string, char?: WhichWayCharacter) {
		const {
			character: { whichWayUID: extUID, chineseName: cn, arknightUID: arkUID },
		} = this.shcema;
		const arkData: Record<string, ArknightCharacterSlim> = this.arknightData.character_table;
		const characters = window.whichWaySave.allCharacters;

		if (window.whichWaySave.hasChar(id)) {
			//显式声明了 arkuid 的干员直接按声明映射
			//（原先该分支扫的是"已写入 characterPack 的其他干员"，当前干员自身要等后续调用才被间接映射，
			//  且一旦命中就提前 return，会吞掉后续干员的按名映射）
			const declaredArkuid = (char as { arkuid?: string } | undefined)?.arkuid;
			if (typeof declaredArkuid === "string" && declaredArkuid in arkData) {
				extUID[id] = declaredArkuid;
				arkUID[declaredArkuid] = id;
				cn.set([declaredArkuid, id], get.translation(id));
				return;
			}

			//按译名 O(1) 反查（原先在此处对整张表逐 key 做全量 filter/map）
			const key = this._getArkNameIndex().get(this.redirect.transfer(get.translation(id)));
			if (key !== undefined) {
				extUID[id] = key;
				arkUID[key] = id;
				cn.set([key, id], arkData[key].name);
				return;
			}
			console.warn(`角色${id}不存在`);
		} else if (id in arkData) {
			const info = arkData[id];
			if (this.isCharacter(info)) {
				const whichWayName = window.whichWaySave.allCharacters.find(i => this.redirect.transfer(get.translation(i)) === info.name)!;
				extUID[whichWayName] = id;
				arkUID[id] = id;
				cn.set([id, whichWayName], info.name);
				return;
			} else {
				console.warn(`角色${id}不存在`);
			}
		}
	}

	/**
	 * 是否是干员
	 * @param { ArknightCharacter | string } info 明日方舟角色信息或明日方舟角色uid
	 * @returns { boolean }
	 */
	isCharacter(info: ArknightCharacterSlim | string): boolean {
		if (typeof info === "string") info = this.arknightData.character_table[info];
		//缺字段一律视为非干员：精简缓存若因白名单变动少了 subProfessionId，
		//这里返回 false 而不是抛错，避免一个缓存问题直接崩掉启动
		if (!info?.subProfessionId) return false;
		return !info.subProfessionId.startsWith("notchar");
	}

	/**
	 * 判断是否在明日方舟角色列表中
	 * @param {string} name 角色名（驶舰之向角色）
	 * @returns {boolean}
	 */
	inArknightChars(name: string): boolean {
		const chars = window.whichWaySave.allCharacters;
		if (!chars) {
			console.warn("allCharacters is not initialized!");
			return false;
		}
		if (!window.whichWaySave.hasChar(name)) return false;
		return !!this.shcema.transfer(name, "character", "whichWayUID");
	}

	/**
	 * 初始化角色的明日方舟数据（**每个字段都支持自定义**）
	 *
	 * `whichWay.arknight` 里声明过的值一律保留（包括空数组），只补 `undefined` 的字段；
	 * `supportingEquipment` / `linkage` 同理：缺省（`undefined`）时才按明日方舟数据推导。
	 *
	 * @param {WhichWayCharacterInitialized} char 角色数据（`initCharConfig` 之后的初始化态）
	 */
	initCharArknight(char: WhichWayCharacterInitialized) {
		const config = char.whichWay;
		const arknight = (config.arknight ??= {});
		//@ts-ignore arkuid 为武将包声明字段（不在 WhichWayCharacterPrototype 内）
		const arkuid: string | undefined = char.arkuid;

		//明日方舟uid：声明（含 arkuid）优先，缺省时按角色id反查
		arknight.charId ??= arkuid || (this.shcema.transfer(config.charId, "character", "whichWayUID") as string) || "";

		//阵营：缺省时按真实势力（reallyGroup）映射
		arknight.camp ??= (this.getCamp(char) as string) ?? "";

		//可用语音语言 / tag：声明了就完全采用声明的列表
		arknight.avaiableLangs ??= this.getAviableLangs(config.charId) || [];
		arknight.tags ??= this.getTags(config.charId) || [];

		//这两项同样是"缺省才推导"：显式写 false 也以声明为准
		config.supportingEquipment ??= arknight.tags.includes("支援机器");
		config.linkage ??= arknight.avaiableLangs.includes("LINKAGE");
	}

	/**
	 * 通过索引获取音频信息
	 * @param { number } index - 索引
	 * @returns { { index: string, name: string }}
	 */
	getAudioByIndex(index: number): { index: string; name: string } {
		if (this.shcema.audio.name.length < index) throw new Error(`索引超出范围,最大索引为${this.shcema.audio.name.length - 1}: ${index}`);
		return {
			index: this.shcema.audio.index[index],
			name: this.shcema.audio.name[index],
		};
	}

	/**
	 * 获取所有的配音语言
	 * @returns {string[]}
	 * @param {boolean} lowerCase 是否返回小写
	 */
	getVoiceLangs(lowerCase: boolean = false): string[] {
		let temp = Object.keys(this.arknightData.charword_table.voiceLangTypeDict);
		temp.push("CUSTOM");
		return lowerCase ? temp.map(i => i.toLowerCase()) : temp;
	}

	/**
	 * 获取语言的中文翻译
	 * @param {string} lang 语言
	 * @returns {string | undefined}
	 */
	getVoiceLangTranslation(lang: string): string | undefined {
		if (lang === "CUSTOM") return "本地";
		let langs = this.arknightData.charword_table.voiceLangTypeDict;
		if (!langs[lang]) return;
		return langs[lang].name;
	}

	/**
	 * 通过uid获取角色的标签
	 * @param {string} uid 明日方舟角色uid或驶舰之向角色
	 * @returns {string[] | undefined}
	 */
	getTags(uid: string): string[] | undefined {
		const arkUid = this.shcema.transfer(uid, "character", "whichWayUID") || uid;
		if (arkUid in this.arknightData.character_table) {
			return this.arknightData.character_table[arkUid].tagList || [];
		}
	}

	/**
	 * 获得角色可用的语音语言
	 * @param {string} uid 明日方舟角色uid或驶舰之向角色
	 * @returns {string[] | undefined}
	 */
	getAviableLangs(uid: string): string[] | undefined {
		const { voiceLangDict } = this.arknightData.charword_table;
		const arkUid = this.shcema.transfer(uid, "character", "whichWayUID") || uid;
		if (!voiceLangDict[arkUid]?.dict) return ["CUSTOM"];
		return Object.keys(voiceLangDict[arkUid].dict) || undefined;
	}

	/**
	 * 获得角色在明日方舟中的阵营id
	 * @param {string | Player | WhichWayCharacter} uid 驶舰之向角色或驶舰之向角色的阵营
	 * @returns {ArksCamps | undefined}
	 */
	getCamp(uid: string | Player | WhichWayCharacter): ArksCamps | undefined {
		//@ts-ignore
		if (get.itemtype(uid) === "player") uid = uid.name;

		if (get.is.object(uid)) {
			//@ts-ignore
			let char: WhichWayCharacter = uid;
			if (!char.whichWay) return undefined;
			//@ts-ignore
			return this.shcema.transfer(char.whichWay?.reallyGroup, "group", "arknight");
		} else if (typeof uid === "string") {
			if (window.whichWaySave.hasChar(uid)) {
				const group = whichWayUtil.getCharExtConfig(uid)?.reallyGroup || "";
				//@ts-ignore
				return this.shcema.transfer(group, "group", "arknight");
			}
		}
	}

	/**
	 * 通过uid获取角色的中文名
	 * @param {string} uid 明日方舟角色uid
	 * @returns {string | undefined}
	 */
	getTranslation(uid: string): string | undefined {
		return this.shcema.transfer(uid, "character", "chineseName");
	}

	/**
	 * 自动检测更新明日方舟数据
	 */
	async autoUpdate() {
		//只需要本层的 .json 文件名，step 传 0 让扫描只列一次目录（不必递归子目录）
		const { files } = await whichWayFile.getFileTree("json:arknight/", 0);
		const fileNames = files.map(file => file.name);

		if (fileNames.length < 1 || !this.updateFile.every(file => fileNames.includes(file + ".json"))) {
			await this.updateArknigtData();
		} else if (whichWayVersion.extVersionChanged) {
			await this.updateArknigtData();
		}
		return true;
	}

	/**
	 * 更新明日方舟数据
	 */
	async updateArknigtData() {
		const { updateFile, updateUrl } = this;
		//下载会覆盖 json/arknight/ 下的全量文件，因此本次启动的精简缓存必须作废重建
		//（即使扩展版本没变，也可能是「文件缺失被补下载」的情况）
		this.arknightDataUpdated = true;
		whichWayToast.showToast(`[驶舰之向] 正在更新明日方舟数据...`, 3000, "topRight", "whichWayArknightUpdateTitle");
		for (const file of updateFile) {
			const url = `${updateUrl}${file}.json`;
			await whichWayFile.download(url, `json:arknight/`, `${file}.json`, ({ percent, total, loaded }) => {
				if (percent !== null) {
					if (whichWayUtil.isDeveloperMode()) console.log(`正在下载文件${file}: ${percent}%`);
					whichWayToast.showToast(`正在下载文件${file}: ${percent}%`, 3000, "topRight", "whichWayArknightUpdate");
				} else {
					if (whichWayUtil.isDeveloperMode()) {
						console.log(`正在下载文件 ${file}: ${loaded} bytes`);
					}
					whichWayToast.showToast(`正在下载文件 ${file}: ${Math.floor(loaded / 1024)} KB`, 3000, "topRight", `whichWayArknightUpdate`);
				}
			});
			whichWayToast.showToast(`文件 ${file} 下载完成!`, 3000, "topRight");
			whichWayToast.removeToastById("whichWayArknightUpdate");
			whichWayToast.removeToastById("whichWayArknightUpdateTitle");
		}
		return true;
	}

	/**
	 * 明日方舟数据（**精简后的**，见 slimArknightData 的白名单与 typings 的 *Slim 类型；
	 * 不是 json/arknight/ 下的全量原始 JSON）
	 */
	arknightData: ArknightSlimData;

	/**
	 * 精简缓存文件（相对 json: 的路径），与 json/cache/skin.json 同目录、同读写方式
	 */
	private readonly slimCacheFile = "cache/arknight.json";

	/**
	 * 精简缓存的结构版本：白名单字段发生变化时必须 +1，否则老缓存不会被重建
	 * （只靠扩展版本号覆盖不了「改了白名单但没升版本」的情况）
	 */
	private readonly slimCacheSchema = 1;

	/**
	 * 本次启动是否重新下载过明日方舟数据。
	 *
	 * 置位后 loadArknightData 会强制走慢路径重建精简缓存——否则会出现
	 * 「json/arknight/ 下文件缺失被重新下载、但扩展版本未变 → 读到旧缓存」的错误场景。
	 */
	private arknightDataUpdated = false;

	/**
	 * 启动期不读入内存的数据文件名（仍保留在 updateFile 清单里，自动更新/下载不受影响）。
	 *
	 * handbook_team_table 全扩展零运行时读取（只出现在本文件的 updateFile 清单中），
	 * 也不在精简缓存的裁剪范围内——裁剪只保留 ArknightSlimData 声明的三张表。
	 */
	private readonly loadSkipFiles: Array<string> = ["handbook_team_table"];

	/**
	 * 需要更新的JSON文件名
	 */
	updateFile: Array<string> = ["character_table", "charword_table", "handbook_team_table", "char_patch_table"];

	/**
	 * 更新的JSON文件地址
	 */
	updateUrl: string = "https://torappu.prts.wiki/gamedata/latest/excel/";

	shcema = whichWayArknightShcema;

	redirect = whichWayArknightRedirect;
}

export const whichWayArknight = new WhichWayArknight();

await whichWayArknight.init();

onSetDev({
	name: "whichWayArknight",
	fn: () => {
		//@ts-ignore
		window.whichWayArknight = whichWayArknight;
	},
});

window.whichWay.register("arknight", whichWayArknight);
