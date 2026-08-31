import { whichWayArknight } from "../arknight/index.ts";
import { whichWayFile } from "../file.js";
import { lib, game, ui, get, ai, _status } from "noname";
import { onArenaReady, onConfig, onSetDev } from "../hooks/index.js";
import { whichWayUtil } from "../utill.js";
import { whichWayWebPlay } from "./webPlay.ts";
import { whichWayWebPlayDie } from "./webPlayDie.ts";
import { whichWayAPIOverride } from "../override/index.js";
import { whichWayToast } from "../toast/index.ts";
import { createApp } from "vue";
import AudioDownloadDialog from "./AudioDownloadDialog.vue";

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
			//先一次性并行扫描 audio 目录建立存在性缓存，后续 initDieAudio/initAudio 里的
			//exsitAudio 全部退化为 Set 查找，不再逐个发起 checkFile IPC
			await this.ensureAudioCache();

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

		onConfig({
			name: "whichWayAudioDownloadAllMissing_add",
			obj: {
				name: "downloadAllMissingAudio",
				options: {
					name: "<button type='button'>一键下载所有缺失配音</button>",
					intro: "自动检测并下载所有缺失的技能配音和死亡配音",
					clear: true,
					onclick: async function () {
						const allLangs = await whichWayAudio.showDownloadModeDialog();
						if (allLangs !== null) {
							await whichWayAudio.downloadAllMissingAudio(undefined, allLangs);
						}
					},
				},
			},
			priority: 860,
		});
	}

	/**
	 * 检查音频文件夹是否存在，不存在则创建
	 */
	async checkAudioFolder(): Promise<void> {
		const audioLangs = whichWayArknight.getVoiceLangs();
		//各语言目录相互独立，并行检查/创建（原先串行）
		await Promise.all(
			audioLangs.map(async lang => {
				if (await whichWayFile.exsitFile(`audio:${lang}`, "folder")) return;
				await whichWayFile.createFolder(`audio:${lang}`);
				await whichWayFile.createFolder(`audio:${lang}/die`);
			})
		);
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
			//增量更新缓存，避免后续 initAudio/initDieAudio 误判为缺失
			this._addAudioCacheEntry(`audio:${lang}${dieAudio ? "/die" : ""}/${file}`);
			whichWayToast.showToast(`下载${file}成功`);
			whichWayToast.removeToastById(`whichWayAudioDownLoad_${file}`);
		}

		if (!dieAudio) await this.initAudio(skill, char);
		//@ts-ignore
		else await this.initDieAudio(get.character(char));
	}

	/**
	 * 获取所有缺失配音的信息列表
	 * @param {boolean} [allLangs=false] 是否获取所有可用语言的配音，而不仅仅是当前语言
	 * @returns {Promise<Array<{type: 'skill'|'die', skill?: string, char: string, urls: string[], lang: string}>>}
	 */
	async getMissingAudioList(
		allLangs: boolean = false
	): Promise<Array<{ type: "skill" | "die"; skill?: string; char: string; urls: string[]; lang: string }>> {
		const tasks: Array<{ type: "skill" | "die"; skill?: string; char: string; urls: string[]; lang: string }> = [];
		const allChars = window.whichWaySave.allCharacters;

		for (const char of allChars) {
			const charData = get.character(char);
			if (!charData?.skills) continue;

			const avaiableLangs = whichWayArknight.getAviableLangs(char) || [];
			const defaultLang = this.getCharacterLang(char);
			const langsToCheck = allLangs ? avaiableLangs.filter(l => l !== "CUSTOM") : [defaultLang];

			for (const skill of charData.skills) {
				if (!window.whichWaySave.allSkills.includes(skill)) continue;

				for (const lang of langsToCheck) {
					if (lang === "CUSTOM") continue;
					if (!(await this.exsitAudio(skill, char)) || allLangs) {
						const info = lib.skill[skill];
						let voiceTitles: string[] = [];

						if (Array.isArray(info.audio)) {
							voiceTitles = info.audio;
						} else if (typeof info.audio === "number") {
							const audioConfig = window.whichWaySave.audioConfig;
							const cacheKey = `${skill}_${lang}`;
							voiceTitles =
								audioConfig.onlineVoicesTitle[cacheKey] ||
								["选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4"].randomGets(2);
							audioConfig.onlineVoicesTitle[cacheKey] = voiceTitles;
						}

						const urls = voiceTitles.map(title => this.compileVoicePath(char, lang, title));
						if (urls.length > 0) {
							tasks.push({
								type: "skill",
								skill,
								char,
								urls,
								lang,
							});
						}
					}
				}
			}

			for (const lang of langsToCheck) {
				if (lang === "CUSTOM") continue;
				const fileExists = await this.exsitAudio(null!, char, true);

				if (!fileExists || allLangs) {
					const urls = ["行动失败"].map(title => this.compileVoicePath(char, lang, title));
					if (urls.length > 0) {
						tasks.push({
							type: "die",
							char,
							urls,
							lang,
						});
					}
				}
			}
		}

		return tasks;
	}

	/**
	 * 显示下载模式选择对话框
	 * @returns {Promise<boolean|null>} 用户选择：true=下载所有语言，false=仅下载当前语言，null=取消
	 */
	async showDownloadModeDialog(): Promise<boolean | null> {
		return new Promise(resolve => {
			const container = document.createElement("div");
			document.body.appendChild(container);

			const app = createApp(AudioDownloadDialog, {
				onSelect: (mode: boolean) => {
					app.unmount();
					container.remove();
					resolve(mode);
				},
				onClose: () => {
					app.unmount();
					container.remove();
					resolve(null);
				},
			});

			app.mount(container);
		});
	}

	/**
	 * 一键下载所有缺失配音
	 * @param {Function} [onProgress] 进度回调函数 (current: number, total: number, info: string) => void
	 * @param {boolean} [allLangs] 是否下载所有语言，true=所有语言，false=仅当前语言
	 */
	async downloadAllMissingAudio(onProgress?: (current: number, total: number, info: string) => void, allLangs?: boolean): Promise<void> {
		const tasks = await this.getMissingAudioList(allLangs ?? false);

		if (tasks.length === 0) {
			whichWayToast.showToast("没有发现缺失的配音文件", 3000, "topRight", "whichWayAudioDownloadAll");
			return;
		}

		const langLabel = allLangs ? "所有可用语言" : this.getCharacterLang(tasks[0]?.char);

		whichWayToast.showToast(`发现 ${tasks.length} 个缺失配音（${langLabel}），开始下载...`, 5000, "topRight", "whichWayAudioDownloadAll");

		let successCount = 0;
		let failCount = 0;

		for (let i = 0; i < tasks.length; i++) {
			const task = tasks[i];
			const current = i + 1;

			if (onProgress) {
				onProgress(current, tasks.length, `正在下载 ${task.char}${task.skill ? ` - ${task.skill}` : " 死亡配音"} [${task.lang}]`);
			}

			try {
				await this.downloadAudio(task.skill || "", task.char, task.urls, task.lang, task.type === "die");
				successCount++;
			} catch (e) {
				failCount++;
				console.warn(`下载失败: ${task.char}${task.skill ? ` - ${task.skill}` : " 死亡配音"}`, e);
			}
		}

		const message = `下载完成！成功 ${successCount} 个${failCount > 0 ? `，失败 ${failCount} 个` : ""}`;
		whichWayToast.showToast(message, 5000, "topRight", "whichWayAudioDownloadAll");
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
	 * 音频文件存在性缓存。
	 *
	 * 原先每次 exsitAudio 都调一次 game.promises.checkFile（一趟 IPC），
	 * 而 onArenaReady 会对 262 个干员 × 各自技能串行检查上千次，是开局耗时主因。
	 * 这里首次需要时一次性并行扫描 audio 目录，把所有已存在文件的路径装入 Set，
	 * 之后 exsitAudio 退化为 O(1) 的 Set 查找，不再发起任何 IPC。
	 *
	 * 下载新音频时会增量更新本缓存；若手动删除文件，需重启以重建。
	 */
	private _audioExistCache: Set<string> | null = null;

	async ensureAudioCache(): Promise<void> {
		if (this._audioExistCache) return;
		const cache = new Set<string>();
		// getFileTree 已并行扫描，约 5 个语言目录 + 各自 die/ 子目录，两轮 IPC 即可
		const { folders } = await whichWayFile.getFileTree("audio:");
		for (const langFolder of folders) {
			for (const f of langFolder.files) cache.add(f.path);
			for (const sub of langFolder.folders) {
				for (const f of sub.files) cache.add(f.path);
			}
		}
		this._audioExistCache = cache;
	}

	private _addAudioCacheEntry(relPath: string): void {
		this._audioExistCache?.add(whichWayFile.compilePath(relPath));
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
		const relPath = dieAudio ? `audio:${lang}/die/${char}.mp3` : `audio:${lang}/${skill}1.mp3`;
		await this.ensureAudioCache();
		return this._audioExistCache!.has(whichWayFile.compilePath(relPath));
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
			} else if (lang !== "CUSTOM") {
				info.whichWayWebPlay = new whichWayWebPlay(skill, char);
			} else {
				console.warn(`[whichWayAudio] 角色 ${char} 的技能 ${skill} 的语言设置为 ${lang}，但音频文件不存在！`);
			}
		} else if (typeof audio === "string") {
			if (audio.startsWith("ext:")) {
				//@ts-ignore
				const num = info.audio.split(":")[2];
				info.audio = `ext:WhichWay/audio/${lang}:${num}`;
				if (!(await this.exsitAudio(skill, char))) {
					if (lang !== "CUSTOM") info.whichWayWebPlay = new whichWayWebPlay(skill, char);
				} else delete info.whichWayWebPlay;
				return;
			}
			let realSkill = this.getReferSkill(skill);
			if (realSkill) await this.initAudio(realSkill, char, range);
		} else if (Array.isArray(audio)) {
			info.audio = `ext:WhichWay/audio/${lang}:${audio.length}`;
			if (!(await this.exsitAudio(skill, char))) {
				//@ts-ignore
				if (lang !== "CUSTOM") info.whichWayWebPlay = new whichWayWebPlay(skill, char, audio);
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
			if (whichWayArknight.inArknightChars(name)) char.whichWay.dieAudio = new whichWayWebPlayDie(char);
		} else {
			//@ts-ignore
			if (char.whichWay.dieAudio) char.whichWay.dieAudio = undefined;
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
		uid = whichWayArknight.shcema.transfer(uid, "character", "whichWayUID") || uid;
		if(lang === "CN_TOPOLECT"){
			uid = `${uid}_cn_topolect`
		}
		voiceTitle = this.transferVoiceTitle(voiceTitle);
		lang = this.transferLang(lang);
		return `${this.resourceUrl}assets/audio/${lang}/${uid}/${voiceTitle}.wav`;
	}

	/**
	 * 将配音语言转化为符合PRTS规范的格式
	 * @param {string} lang 配音
	 * @returns {string} 符合PRTS规范的格式
	 */
	transferLang(lang: string): string {
		//torappu.prts.wiki/assets/audio/voice_custom/char_2024_chyue_cn_topolect/cn_005.wav
		if (whichWayArknight.getVoiceLangs().includes(lang)) {
			if (lang === "JP" || lang === "LINKAGE") return "voice";
			else if(lang === "CN_TOPOLECT"){
				return "voice_custom"
			}
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
