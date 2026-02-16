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
		await this.autoUpdate();

		//加载明日方舟数据
		await this.loadArknightData();

		await this.loadShcema();

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
	 * @param {string} [path="json:arknight"] json文件的路径
	 */
	async loadArknightData(path: string = "json:arknight/") {
		//@ts-ignore
		if (!this.arknightData) this.arknightData = {};
		//获取文件列表
		const { files } = await whichWayFile.getFileTree(path);

		const jsonNames = files.filter(file => file.name.endsWith(".json")).map(file => file.name);
		const jsonPaths = files.filter(file => file.path.endsWith(".json")).map(file => file.path);

		for (let i = 0; i < jsonNames.length; i++) {
			const jsonName = jsonNames[i],
				jsonPath = jsonPaths[i];
			const jsonData = await whichWayFile.readFile(jsonPath);
			this.arknightData[jsonName.replace(".json", "")] = jsonData;
		}
	}

	/**
	 * 构建映射表
	 */
	async loadShcema() {
		const {
			character: { whichWayUID: extUID, chineseName: cn, arknightUID: arkUID },
		} = this.shcema;
		const characters = window.whichWaySave.allCharacters;
		const arkData: Record<string, ArknightCharacter> = this.arknightData.character_table;
		for (let key in arkData) {
			let info = arkData[key];
			if (!this.isCharacter(info)) continue;

			const trans = characters.map(i => this.redirect.transfer(get.translation(i)));

			if (trans.includes(info.name)) {
				const whichWayUID: string = characters.find(i => this.redirect.transfer(get.translation(i)) === info.name)!;
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
			if (characters.map(i => get.translation(i)).includes(amiyaName)) {
				const whichWayUID: string = characters.find(i => this.redirect.transfer(get.translation(i)) === amiyaName)!;

				extUID[whichWayUID] = key;
				arkUID[key] = whichWayUID;
				cn.set([key, whichWayUID], amiyaName);
			}
		}
	}

	/**
	 * 是否是干员
	 * @param { ArknightCharacter | string } info 明日方舟角色信息或明日方舟角色uid
	 * @returns { boolean }
	 */
	isCharacter(info: ArknightCharacter | string): boolean {
		if (typeof info === "string") info = this.arknightData.character_table[info];
		if (info === undefined) return false;
		return !(/** @type {ArknightCharacter} */ info.subProfessionId.startsWith("notchar"));
	}

	/**
	 * 判断是否在明日方舟角色列表中
	 * @param {string} name 角色名（驶舰之向角色）
	 * @returns {boolean}
	 */
	inArknightChars(name:string):boolean{
		const chars = window.whichWaySave.allCharacters;
		if(!chars){
			console.warn("allCharacters is not initialized!");
			return false;
		}
		if(!chars.includes(name)) return false;
		return !!this.shcema.transfer(name, "character", "whichWayUID");
	}

	/**
	 * 初始化角色的明日方舟数据
	 * @param {WhichWayCharacter} char 角色数据
	 */
	initCharArknight(char: WhichWayCharacter) {
		//@ts-ignore 设置明日方舟uid
		char.whichWay.arknight.charId = this.shcema.transfer(char.whichWay.charId, "character", "whichWayUID");

		//@ts-ignore 设置对应阵容
		char.whichWay.arknight.camp = this.getCamp(char);

		//@ts-ignore 设置可用的语音语言
		char.whichWay.arknight.avaiableLangs = this.getAviableLangs(char.whichWay.charId) || [];

		//角色tag
		char.whichWay.arknight.tags = this.getTags(char.whichWay.charId) || [];
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
		if(lang === "CUSTOM") return "本地"
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
			if (window.whichWaySave.allCharacters.includes(uid)) {
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
		const { files } = await whichWayFile.getFileTree("json:arknight/");
		const fileNames = files.map(file => file.name);

		if (fileNames.length < 1 || !this.updateFile.every(file => fileNames.includes(file + '.json'))) {
			await this.updateArknigtData();
		}
		else if (whichWayVersion.extVersionChanged) {
			await this.updateArknigtData();
		}
		return true;
	}

	/**
	 * 更新明日方舟数据
	 */
	async updateArknigtData() {
		const { updateFile, updateUrl } = this;
		whichWayToast.showToast(`[驶舰之向] 正在更新明日方舟数据...`, 3000, "topRight","whichWayArknightUpdateTitle");
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
	 * TODO添加新的JSON后需要自行补充TS声明
	 * 加载的JSON的原始数据
	 */
	arknightData: {
		character_table: Record<string, ArknightCharacter>;
		charword_table: ArknightVoice;
		handbook_team_table: ArknightTeams;
		char_patch_table: ArknightCharacterPatch;
	};

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
