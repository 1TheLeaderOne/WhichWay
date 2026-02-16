import { whichWayArknight } from "../arknight/index.ts";
import { whichWayFile } from "../file.js";
import { lib, game, ui, get, ai, _status } from "noname";
import { onArenaReady, onConfig, onSetDev } from "../hooks/index.js";
import { whichWayUtil } from "../utill.js";
import { whichWayWebPlay } from "./webPlay.ts";
import { whichWayWebPlayDie } from "./webPlayDie.ts";
import { whichWayAPIOverride } from "../override/index.js";
import { whichWayToast } from "../toast/index.ts";

const audioSave = window.whichWaySave.audioConfig;

class WhichWayAudio {
	/**
	 * PRTS路径
	 */
	resourceUrl: string = `https://torappu.prts.wiki/`;

	/**
	 * 全局配置中的默认语言
	 * 只开放中、日，因为其他的某些角色不一定有
	 */
	vaildDefaultLang: Array<ArkAllLangs> = ["CN_MANDARIN", "JP"];

	/**
	 * 配音组件初始化
	 */
	async init(): Promise<void> {
		await this.checkAudioFolder();

		onArenaReady({
			name: "whichWayAudio_init",
			fn: async () => {
				for (const name of window.whichWaySave.allCharacters) {
					const char = get.character(name);
					//@ts-ignore
					await whichWayAudio.initDieAudio(char);
					for (const skill of char.skills) {
						await whichWayAudio.initAudio(skill, name);
					}
				}

				//覆盖api
				await whichWayAudio.override();
			},
		});

		onConfig({
			name: "whichWayAudioDefaultConfig_add",
			priority: 777,
			obj: {
				name: "audioDefaultLang",
				options: {
					name: "默认配音",
					intro: "默认配音语言",
					init: whichWayUtil.config("audioConfig")?.default || "CN_MANDARIN",
					item: Object.fromEntries(this.vaildDefaultLang.map(i => [i, whichWayArknight.getVoiceLangTranslation(i)])),
					onclick(item: string) {
						audioSave.default = item;
						whichWayUtil.saveConfig("audioDefaultLang", item);
					},
				},
			},
		});

		onConfig({
			name: "whichWayAudioUseLocalAudioConfig_add",
			priority: 776,
			obj: {
				name: "useLocalAudio",
				options: {
					name: "强制使用本地音频",
					intro: "是否强制使用本地音频,开启后不会从PRTS请求音频",
					init: false,
				},
			},
		});

		onConfig({
			name: "whichWayAudioNoTipUseWebConfig_add",
			obj: {
				name: "noTipUseWeb",
				options: {
					name: "不提示使用网络",
					intro: "开启后获取PRTS上的配音时不会再提示'正在使用网络'",
					init: false,
				},
			},
			priority: 775,
		});

		onConfig({
			name: "whichWayAudioAutoDownloadAudio_add",
			obj: {
				name: "autoDownloadAudio",
				options: {
					name: "自动下载缺失音频",
					intro: "开启后播放缺失音频时会自动下载",
					init: false,
				},
			},
			priority: 774,
		});
	}

	/**
	 * 检查音频文件夹是否存在，不存在则创建
	 */
	async checkAudioFolder(): Promise<void> {
		const audioLangs = whichWayArknight.getVoiceLangs();
		for (const lang of audioLangs) {
			if (await whichWayFile.exsitFile(`audio:${lang}`, "folder")) continue;
			await whichWayFile.createFolder(`audio:${lang}`);
			await whichWayFile.createFolder(`audio:${lang}/die`);
		}
	}

	async override(): Promise<void> {
		await whichWayAPIOverride.appendHook("game.trySkillAudio", {
			before: async function (skill, player, directaudio, nobroadcast, skillInfo, args) {
				if (!lib.config.background_speak) {
					return;
				}

				let trueSkill = whichWayAudio.getReferSkill(skill);
				let info: Skill = skillInfo || lib.skill[trueSkill];
				let infox = skillInfo || lib.skill[skill];

				if (!info) {
					return;
				}
				if (infox.direct && !directaudio) {
					return;
				}
				if (lib.skill.global.includes(skill) && !infox.forceaudio) {
					return;
				}

				if (infox.audioname2) {
					let playername = typeof player === "string" ? player : get.name(player);
					for (let name in infox.audioname2) {
						if (name.endsWith("mrfz") && playername === name) {
							return game.trySkillAudio(infox.audioname2[name], player, directaudio, nobroadcast, skillInfo, args);
						}
					}
				}
				if (info.whichWayWebPlay && info.whichWayWebPlay.useLocalAudio === false) {
					return info.whichWayWebPlay.play(trueSkill, typeof player === "string" ? player : get.name(player));
				}
			},
		});

		await whichWayAPIOverride.appendHook("game.tryDieAudio", {
			before: async function (player) {
				let name = typeof player === "string" ? player : get.name(player);

				let info: WhichWayCharacterPending = get.character(name!);

				if (info && info.whichWay && info.whichWay.dieAudio && (await whichWayAudio.exsitAudio(null!, name!, true))) {
					return info.whichWay.dieAudio.play();
				}
			},
		});
	}

	/**
	 * 下载音频
	 * @param {string} skill 技能名
	 * @param {string} char 角色名
	 * @param {boolean} [dieAudio=false] 是否是死亡音频
	 */
	async downloadAudio(skill: string, char: string, urls: string[], lang?: string, dieAudio: boolean = false): Promise<void> {
		if (urls === void 0) throw new Error("url is undefined");
		if (lang === void 0) {
			lang = this.getCharacterLang(char);
		}

		const path = whichWayFile.compilePath(`audio:${lang}${dieAudio ? "/die" : ""}/`);

		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const audioIndex = i + 1;
			const file = `${dieAudio ? char : `${skill}${audioIndex}`}.mp3`;
			await whichWayFile.download(url, path, file);
			whichWayToast.showToast(`下载${file}成功`);
			whichWayToast.removeToastById(`whichWayAudioDownLoad_${file}`);
		}

		if(!dieAudio) await this.initAudio(skill,char);
		//@ts-ignore
		else await this.initDieAudio(get.character(char));
	}

	/**
	 * 获取技能的配音语言
	 * @param {string} skill 技能名
	 * @param {string} char 角色名
	 * @returns {string} 技能的配音语言
	 */
	getSkillLang(skill: string, char: string): string {
		const defaultLang = this.getCharacterLang(char) || audioSave.default;

		if (char === void 0 || skill === void 0) throw new Error("char or skill is undefined");

		if (!whichWayArknight.inArknightChars(char)) return "CUSTOM";

		let custom = audioSave.custom;
		if (!custom[char]) return defaultLang;
		const info = custom[char],
			skills = this.expandSkills(info.skills);
		if (skills.includes(skill)) return info.lang;
		return defaultLang;
	}

	/**
	 * 播放技能音频(无视trySkillAudio的限制)
	 */
	playSkillAudio(skill: string, name: string) {
		const info = lib.skill[this.getReferSkill(skill)];
		if (!info) return;
		if (info.whichWayWebPlay && info.whichWayWebPlay.useLocalAudio === false) {
			return info.whichWayWebPlay.play(skill, name);
		}

		const audioList = get.Audio.skill({ skill, player: name }).fileList;
		return game.tryAudio({ audioList });
	}

	/**
	 * 扩展技能组
	 */
	expandSkills(skills: string[]): string[] {
		const result = [...skills];
		for (const skill of skills) {
			let info = lib.skill[skill];
			//@ts-ignore
			let audio: string = info.audio;
			if (window.whichWaySave.allSkills.includes(audio)) {
				result.push(this.getReferSkill(audio));
			}
			if (info.derivation) {
				const extraSkills = Array.isArray(info.derivation) ? info.derivation : [info.derivation];
				for (const extraSkill of extraSkills) {
					if (window.whichWaySave.allSkills.includes(extraSkill)) {
						result.push(this.getReferSkill(extraSkill));
					}
				}
			}
		}
		return result;
	}

	/**
	 * 获取角色的配音语言
	 * @param {string} char 角色名
	 * @param {boolean} [translate=false] 是否翻译
	 * @returns {string} 角色的配音语言
	 */
	getCharacterLang(char: string, translate: boolean = false): string {
		if (char === void 0) throw new Error("char is undefined");

		let custom = audioSave.custom;
		if (!custom[char]) {
			let langs = this.getCharacterAvailableLang(char);
			if (langs.length === 0) return autoTranslate("CUSTOM");
			if (langs.includes(audioSave.default)) return autoTranslate(audioSave.default);
			return autoTranslate(langs[0]);
		}
		return autoTranslate(custom[char].lang);

		function autoTranslate(str: string): string {
			return translate ? whichWayArknight.getVoiceLangTranslation(str)! : str;
		}
	}

	/**
	 * 获取角色可用的配音语言
	 * @param {string} char 角色名
	 * @returns {string[]} 角色可用的配音语言
	 */
	getCharacterAvailableLang(char: string): string[] {
		return get.character(char)?.whichWay?.arknight?.avaiableLangs || [];
	}

	/**
	 * 技能的音频是否存在
	 * @param {string} skill 技能名,如果是死亡配音此参数没有意义
	 * @param {string} char 角色名
	 * @param {boolean} [dieAudio=false] 是否是死亡音频
	 * @returns {Promise<boolean>} 音频是否存在
	 */
	async exsitAudio(skill: string, char: string, dieAudio: boolean = false): Promise<boolean> {
		if (dieAudio === false) {
			const info = lib.skill[skill];
			if (Array.isArray(info.audioname)) {
				const find = info.audioname.find(i => i === char);
				if (find) skill = `${skill}_${find}1`;
			}
		}
		const lang = dieAudio ? this.getCharacterLang(char) : this.getSkillLang(skill, char);
		return await whichWayFile.exsitFile(dieAudio ? `audio:${lang}/die/${char}.mp3` : `audio:${lang}/${skill}1.mp3`);
	}

	async setCustomAudio(char: string, lang: string): Promise<void> {
		const skills = get.character(char)?.skills || [];
		if (!audioSave.custom[char]) audioSave.custom[char] = { lang: lang, skills: skills };
		else {
			audioSave.custom[char].lang = lang;
			audioSave.custom[char].skills = skills;
		}

		whichWayUtil.saveConfig("audioConfig", audioSave);

		for (const skill of skills) {
			await this.initAudio(skill, char);
		}

		//@ts-ignore
		await this.initDieAudio(get.character(char));
	}

	/**
	 * 初始化技能的音频
	 */
	async initAudio(skill: string, char: string, range: Record<string, Skill> = lib.skill): Promise<void> {
		if (!window.whichWaySave.allSkills.includes(skill)) return;
		const info = range[skill];

		if (!info.logAudio) {
			info.logAudio = () => info.audio;
		}

		const lang = this.getSkillLang(skill, char);
		const audio = info.audio;
		if (typeof audio === "number") {
			if (await this.exsitAudio(skill, char)) {
				info.audio = `ext:WhichWay/audio/${lang}:${audio}`;
				delete info.whichWayWebPlay;
			} else if(lang !== "CUSTOM"){
				info.whichWayWebPlay = new whichWayWebPlay(skill, char);
			}
		} else if (typeof audio === "string") {
			if (audio.startsWith("ext:")) {
				//@ts-ignore
				const num = info.audio.split(":")[2];
				info.audio = `ext:WhichWay/audio/${lang}:${num}`;
				if (!(await this.exsitAudio(skill, char))) {
					if(lang !== "CUSTOM") info.whichWayWebPlay = new whichWayWebPlay(skill, char);
				} else delete info.whichWayWebPlay;
				return;
			}
			let realSkill = this.getReferSkill(skill);
			if (realSkill) await this.initAudio(realSkill, char, range);
		} else if (Array.isArray(audio)) {
			info.audio = `ext:WhichWay/audio/${lang}:${audio.length}`;
			if (!(await this.exsitAudio(skill, char))) {
				//@ts-ignore
				if(lang !== "CUSTOM") info.whichWayWebPlay = new whichWayWebPlay(skill, char, audio);
			} else delete info.whichWayWebPlay;
		}
	}

	/**
	 * 初始化角色死亡音频
	 * @param {WhichWayCharacter} char 角色
	 */
	async initDieAudio(char: WhichWayCharacter): Promise<void> {
		const name = char.whichWay.charId;

		//@ts-ignore
		char.dieAudios = [true, whichWayFile.compilePath(`audio:${this.getCharacterLang(name)}/die/${name}.mp3`)];

		if (!(await this.exsitAudio(null!, name, true))) {
			if(whichWayArknight.inArknightChars(name)) char.whichWay.dieAudio = new whichWayWebPlayDie(char);
		} else{
			//@ts-ignore
			if(char.whichWay.dieAudio) char.whichWay.dieAudio = undefined;
		}
	}

	/**
	 * 查找引用技能的最终目标技能
	 *
	 * 该方法用于递归查找技能引用链的最终目标技能。当一个技能的 audio 属性引用了另一个技能时，
	 * 会继续查找被引用技能的 audio 属性，直到找到不为字符串类型或为纯数字字符串的技能为止。
	 *
	 * 该方法会检测并处理循环引用情况，如果发现循环引用会输出警告并返回原始技能名。
	 *
	 * @param {string} name - 起始技能名称
	 * @param {Set<string>} [visited=new Set()] - 已访问的技能集合，用于检测循环引用
	 * @param {string} [lastName] - 上一个技能名称，用于返回默认值
	 * @returns {string} 最终目标技能名称或上一个技能名称或起始技能名称
	 */
	getReferSkill(name: string, visited: Set<string> = new Set(), lastName?: string): string {
		if (visited.has(name)) {
			console.warn(`Circular reference detected at skill: ${name}`);
			return name;
		}

		visited.add(name);

		const info = lib.skill[name];
		if (!info || !info.audio) return lastName || name;

		const audio = info.audio;
		if (typeof audio === "string" && !/^\d+$/.test(audio)) {
			return this.getReferSkill(audio, visited, name);
		}

		return name;
	}

	/**
	 * 拼接成音频路径
	 * @param {string} uid 角色UID
	 * @param {string} lang 配音语言
	 * @param {string} voiceTitle 音频标题
	 * @returns {string} 音频路径
	 */
	compileVoicePath(uid: string, lang: string, voiceTitle: string): string {
		lang = this.transferLang(lang);
		uid = whichWayArknight.shcema.transfer(uid, "character", "whichWayUID") || uid;
		voiceTitle = this.transferVoiceTitle(voiceTitle);
		return `${this.resourceUrl}assets/audio/${lang}/${uid}/${voiceTitle}.wav`;
	}

	/**
	 * 将配音语言转化为符合PRTS规范的格式
	 * @param {string} lang 配音
	 * @returns {string} 符合PRTS规范的格式
	 */
	transferLang(lang: string): string {
		if (whichWayArknight.getVoiceLangs().includes(lang)) {
			if (lang === "JP" || lang === "LINKAGE") return "voice";
			else if (lang === "CN_MANDARIN") {
				return "voice_cn";
			} else {
				return `voice_${lang.toLowerCase()}`;
			}
		}
		return lang;
	}

	/**
	 * 将音频标题转化为符合PRTS规范的格式
	 * @param {string} voiceTitle 音频标题
	 * @returns {string} 符合PRTS规范的格式
	 */
	transferVoiceTitle(voiceTitle: string): string {
		if (whichWayArknight.shcema.audio.index.includes(voiceTitle)) return voiceTitle;
		let result = whichWayArknight.shcema.transfer(voiceTitle, "audio", "index");
		if (result === void 0) throw new Error(`voiceTitle ${voiceTitle} is not exist`);
		return `cn_${result}`;
	}
}

export const whichWayAudio = new WhichWayAudio();

await whichWayAudio.init();

onSetDev({
	name: "whichWayAudio_dev",
	fn() {
		//@ts-ignore
		window.whichWayAudio = whichWayAudio;
	},
});

window.whichWay.register("audio", whichWayAudio);
