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

		//构造全量明日方舟干员id清单（数据源是 arknightData，必须在 loadArknightData 之后）
		this.buildVaildArkId();

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
	 * - character_table[uid]：name（译名匹配）、subProfessionId（isCharacter）、tagList（getTags）、isNotObtainable（isObtainable）、键存在性
	 * - char_patch_table.patchChars[uid]：name、subProfessionId、tagList、isNotObtainable
	 * - charword_table.charDefaultTypeDict：仅 Object.keys().length
	 * - charword_table.voiceLangTypeDict：Object.keys() 与 [lang].name
	 * - charword_table.voiceLangDict[uid].dict：仅真值判断与 Object.keys()
	 */
	slimArknightData(raw: Record<string, any>): ArknightSlimData {
		const rawCharacters: Record<string, ArknightCharacter> = raw.character_table ?? {};
		const character_table: Record<string, ArknightCharacterSlim> = {};
		for (const uid in rawCharacters) {
			const info = rawCharacters[uid];
			character_table[uid] = { name: info.name, subProfessionId: info.subProfessionId, tagList: info.tagList, isNotObtainable: info.isNotObtainable };
		}

		const rawPatchChars: Record<string, ArknightCharacter> | undefined = raw.char_patch_table?.patchChars;
		const patchChars: Record<string, ArknightCharacterSlim> = {};
		for (const uid in rawPatchChars ?? {}) {
			const info = rawPatchChars![uid];
			patchChars[uid] = { name: info.name, subProfessionId: info.subProfessionId, tagList: info.tagList, isNotObtainable: info.isNotObtainable };
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

		//译名 → 干员id 的反查表与具体 key 无关，循环外算好（原先每个 key 都对全部干员重算一遍 map）
		const translations: (string | undefined)[] = characters.map(i => get.translation(i));
		const transToId = new Map<string, string>();
		characters.forEach((i, idx) => {
			const t = this.redirect.transfer(translations[idx]!);
			if (t !== undefined && !transToId.has(t)) transToId.set(t, i);
		});

		for (let key in arkData) {
			const info = arkData[key];
			if (!this.isCharacter(info)) continue;

			//干员id 已与明日方舟 uid 统一：同名的 key 自己就是那个干员，恒等映射即可
			//（旧实现靠干员逐个声明 arkuid 来补这一环，id 统一后声明值恒等于注册名，已无信息量）
			if (window.whichWaySave.hasChar(key)) {
				extUID[key] = key;
				arkUID[key] = key;
				cn.set([key, key], info.name);
				continue;
			}

			//旧式命名干员（id 不是明日方舟 uid）仍按译名反查
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
	 * 构造 vaildArkId：全量明日方舟干员uid清单。
	 *
	 * 数据源为 `json/arknight/` 下的角色表（经精简缓存加载后的 arknightData）：
	 * - character_table：游戏内正式干员主表
	 * - char_patch_table.patchChars：不在主表里的升变形态（如升变阿米娅）
	 *
	 * 两者都按 isCharacter 过滤（subProfessionId 以 notchar 开头的是敌方/ NPC 占位，
	 * 不是可选干员），并与 addVaildArk 一样保持去重。
	 */
	buildVaildArkId(): void {
		this.vaildArkId = [];
		const tables = [this.arknightData?.character_table, this.arknightData?.char_patch_table?.patchChars];
		for (const table of tables) {
			if (!table) continue;
			for (const uid in table) {
				if (this.isCharacter(table[uid])) this.addVaildArk(uid);
			}
		}
	}

	/**
	 * 是否是明日方舟干员
	 * @param {string} id 明日方舟干员uid
	 * @returns {boolean} id 是否在 vaildArkId 之中
	 */
	isArknght(id: string): boolean {
		return this.vaildArkId.includes(id);
	}

	/**
	 * 添加一个明日方舟干员uid到 vaildArkId（已存在则忽略）
	 * @param {string} id 明日方舟干员uid
	 */
	addVaildArk(id: string): void {
		if (!this.isArknght(id)) this.vaildArkId.push(id);
	}

	/**
	 * 登记「扩展里已经存在」的明日方舟干员uid（由武将包构造流程 addShcema 调用）
	 * @param {string} id 明日方舟干员uid
	 */
	addExsitArk(id: string): void {
		//只登记真正的明日方舟干员，保证 exsitArk ⊆ vaildArkId
		if (this.isArknght(id) && !this.exsitArk.includes(id)) this.exsitArk.push(id);
	}

	/**
	 * 明日方舟干员名 → 明日方舟uid 的反查索引（懒构建，仅构建一次）
	 *
	 * 原先 addShcema 对每个干员都遍历整张 character_table，且循环体内还对全部干员
	 * 反复做 filter/map，规模为 干员数 × 全表大小 × 干员数，是扩展加载的最大热点。
	 *
	 * 全表有 98 组同名干员，其中「阿米娅」三名共用：char_002_amiya 在主表，
	 * char_1001_amiya2 / char_1037_amiya3 由 loadShcema 从 char_patch_table 并进主表。
	 * 反查只服务于旧式命名干员（本体形态一律走 addShcema 的恒等分支），
	 * 因此排除升变形态并保留首个命中者——否则「阿米娅」会被后写入的 char_1037_amiya3 顶掉。
	 */
	private _arkNameIndex: Map<string, string> | null = null;

	private _getArkNameIndex(): Map<string, string> {
		if (!this._arkNameIndex) {
			const index = new Map<string, string>();
			const arkData: Record<string, ArknightCharacterSlim> = this.arknightData.character_table;
			const patchChars = this.arknightData.char_patch_table?.patchChars;
			for (const key in arkData) {
				if (patchChars?.[key]) continue;
				if (!this.isCharacter(arkData[key])) continue;
				const name = arkData[key].name;
				if (name !== undefined && !index.has(name)) index.set(name, key);
			}
			this._arkNameIndex = index;
		}
		return this._arkNameIndex;
	}

	/**
	 * 添加到映射表
	 * @param { string } id 驶舰之向干员id（已与明日方舟 uid 统一）
	 */
	async addShcema(id: string) {
		const {
			character: { whichWayUID: extUID, chineseName: cn, arknightUID: arkUID },
		} = this.shcema;
		const arkData: Record<string, ArknightCharacterSlim> = this.arknightData.character_table;

		//干员id 已与明日方舟 uid 统一：id 本身就在表里（含并入主表的升变形态）就是它自己，恒等映射。
		//旧实现靠干员逐个声明 arkuid 走这一步，声明值恒等于注册名，已无信息量。
		if (this.isCharacter(id)) {
			extUID[id] = id;
			arkUID[id] = id;
			cn.set([id, id], arkData[id].name);
			this.addExsitArk(id);
			return;
		}

		//旧式命名干员（id 不是明日方舟 uid，如 wangmrfz / plot_*）仍按译名 O(1) 反查
		const key = this._getArkNameIndex().get(this.redirect.transfer(get.translation(id)));
		if (key !== undefined) {
			extUID[id] = key;
			arkUID[key] = id;
			cn.set([key, id], arkData[key].name);
			this.addExsitArk(key);
			return;
		}
		console.warn(`角色${id}不存在`);
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
	 * 是否是明日方舟**游戏内可获取**的干员
	 *
	 * 判据是角色表的 `isNotObtainable`（全量 1382 条都带这个布尔，无需推测）。为 `true` 的是
	 * 「有完整干员数据但玩家拿不到」的角色：预备干员系列（`char_5xx_r*` / `char_6xx_c*`）、
	 * 集成战略/活动 NPC（Sharp、Pith、Touch、Stormeye、Raidian、Misery、Mechanist、暮落、郁金香）、
	 * 盟约·辅助干员等，共 29 条。它们与「阿消／洛洛／罗宾／迷迭香」这类正常可获取干员（`false`）
	 * 在数据上仅此一处区别，所以不能靠 `rarity`、`itemObtainApproach`（只是 null）或 id 前缀去猜。
	 *
	 * 字段缺失（读到了旧版精简缓存）一律按**可获取**处理：宁可多列一条待征稿，
	 * 也不要把正常干员悄悄排除在名单外。
	 * @param id 明日方舟干员uid
	 */
	isObtainable(id: string): boolean {
		const info = this.arknightData?.character_table?.[id] ?? this.arknightData?.char_patch_table?.patchChars?.[id];
		return info?.isNotObtainable !== true;
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

		//明日方舟uid：声明优先，缺省时按角色id反查（id 已与明日方舟统一，恒等映射即自身）
		arknight.charId ??= (this.shcema.transfer(config.charId!, "character", "whichWayUID") as string) || "";

		//阵营：缺省时按真实势力（reallyGroup）映射
		arknight.camp ??= (this.getCamp(char) as string) ?? "";

		//可用语音语言 / tag：声明了就完全采用声明的列表
		arknight.avaiableLangs ??= this.getAviableLangs(config.charId!) || [];
		arknight.tags ??= this.getTags(config.charId!) || [];

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
	 * 全量明日方舟干员uid清单（由 buildVaildArkId 在初始化时用 json/arknight 的角色表构造，
	 * 含 char_patch_table 的升变形态，已按 isCharacter 过滤）
	 */
	vaildArkId: string[] = [];

	/**
	 * 扩展里已经存在的明日方舟干员uid（武将包构造时由 addShcema 逐个登记，恒为 vaildArkId 的子集）。
	 *
	 * 用途：`vaildArkId` 与 `exsitArk` 的差集即「明日方舟有、扩展还没做」的干员。
	 */
	exsitArk: string[] = [];

	/**
	 * 精简缓存文件（相对 json: 的路径），与 json/cache/skin.json 同目录、同读写方式
	 */
	private readonly slimCacheFile = "cache/arknight.json";

	/**
	 * 精简缓存的结构版本：白名单字段发生变化时必须 +1，否则老缓存不会被重建
	 * （只靠扩展版本号覆盖不了「改了白名单但没升版本」的情况）
	 */
	private readonly slimCacheSchema = 2;

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
