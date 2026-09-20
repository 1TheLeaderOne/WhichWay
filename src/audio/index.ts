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

/**
 * audio 为数字时用于随机抽取的配音标题池
 */
const DEFAULT_VOICE_TITLES = ["选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4"];

/**
 * 取出一个玩家所有可能的名字。
 *
 * 引擎的 audioname / audioname2 匹配会依次尝试 tempname、name、name1、name2
 * （见 get/audio.ts 的 SkillAudio.getName），这里保持同样的候选顺序，
 * 避免皮肤名/双将名导致在线配音查不到。
 */
function resolvePlayerNames(player: Player | string): string[] {
	if (typeof player === "string") return [player];
	if (!player) return [];
	const list: string[] = [];
	for (const name of [(player as any).name, (player as any).name1, (player as any).name2]) {
		if (typeof name === "string" && name && !list.includes(name)) list.push(name);
	}
	const shown = get.name(player);
	if (typeof shown === "string" && shown && !list.includes(shown)) list.push(shown);
	return list;
}

/** getFileList 的容错包装：目录不存在时返回空结果，不抛错 */
async function listDirSafe(dir: string): Promise<[string[], string[]]> {
	try {
		return await game.promises.getFileList(dir);
	} catch (e) {
		return [[], []];
	}
}

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

	/** 技能配音最近一次播放时间：`技能|干员` → 时间戳。用于识别同一次技能触发的重复请求 */
	private _voicePlayedAt: Map<string, number> = new Map();

	/**
	 * 判定本次 `trySkillAudio` 是否为「同一次技能触发的重复请求」。
	 *
	 * 引擎对**一次**技能触发会调用两次 `game.trySkillAudio`：
	 * ① `player.logSkill` 方法里（同步，技能发动瞬间，`directaudio === true`）；
	 * ② `logSkill` 事件 content 里（异步，可能隔数秒，`directaudio == null`）。
	 * 两次都会真的播出声音：引擎的 `_status.skillaudio` 只在 1 秒内按**文件路径**去重
	 * （`game/index.js:2500`），而两次间隔常常超过 1 秒，且扩展语音包每个技能有多条变体
	 * （`tryAudio` 每次都随机取一条，路径还不同），于是就成了
	 * 「一句播完立刻又随机播另一句」—— 有扩展语音包的干员（如希尔达）才明显。
	 *
	 * 判定用两次调用的特征差异：**只有 ②（`directaudio == null`）且同一 (技能, 干员)
	 * 在最近 30 秒内已经播过**，才判为重复；① 永不拦截 —— 技能真的再次触发时
	 * 一定会经 ① 播出声音，因此不会误伤正常触发。
	 *
	 * @param directaudio 引擎传入的第三个参数（`true` = ①，`null`/`undefined` = ②）
	 * @returns 返回 true 表示应跳过本次播放
	 */
	isRepeatedSkillAudio(skill: string, player: Player | string, directaudio?: boolean | null): boolean {
		if (directaudio) return false;
		const key = `${skill}|${typeof player === "string" ? player : get.name(player) || ""}`;
		const last = this._voicePlayedAt.get(key);
		return last != null && Date.now() - last < 30000;
	}

	/** 记录一次技能配音的播放时间（判定通过、确定会播放后调用） */
	markSkillAudioPlayed(skill: string, player: Player | string): void {
		this._voicePlayedAt.set(`${skill}|${typeof player === "string" ? player : get.name(player) || ""}`, Date.now());
	}

	/**
	 * 交给引擎播放时**只保留一条**候选（优先挑确实存在的那条）。
	 *
	 * 为什么必须是"一条"：引擎 `game.tryAudio`（`game/index.js:2569-2613`）的机制是
	 * ```js
	 * const check = () => { if (list.length) return true; if (refresh) { list = audioList.slice(); return true; } return false; };
	 * const play  = () => { ...; return game.playAudio({ path: audio, onCanPlay: () => (refresh = true), onError: play }); };
	 * ```
	 * `refresh` 一旦被 `onCanPlay` 置真就**不会复位**，此后任何一条加载失败的候选都会让
	 * `onError → play → check()` 把整表重填并再随机取一条 ⇒ **无限重试**（debug 时能看到
	 * `list` 在 `[]` 与单条之间反复横跳、`refresh` 名义上为 false 却仍在重填）。
	 * 候选**全部存在**也没用：只要运行期有一条拉不下来（文件正在被构建覆盖、404、解码失败…）就会中招。
	 *
	 * 只留一条时结果必然是二者之一：
	 * - 能播 ⇒ 播完即止（`onended` 只做 remove，不会再产生 error）；
	 * - 不能播 ⇒ `onError` 一次后 `list` 已空且 `refresh` 仍为 false ⇒ `check()` 返回 false ⇒ **立即终止**。
	 * 因此"一条"是唯一能做到「循环不可能发生」的形态；随机取一条也保持了原本的随机播放体验。
	 */
	filterExistingAudio(result: any): any {
		const list = result?.audioList;
		if (!Array.isArray(list) || list.length <= 1) return result;
		//@ts-ignore 引擎给 Array 扩展了 randomGet
		let candidates: any[] = list;
		if (this._audioExistCache) {
			const exist = list.filter(item => {
				const file = item?.file;
				if (typeof file !== "string") return false;
				//file 形如 ext:WhichWay/audio/CUSTOM/xxx1.mp3 → 扩展缓存使用的键是 audio:CUSTOM/xxx1.mp3
				return this._audioExistCache!.has(whichWayFile.compilePath("audio:" + file.replace(/^ext:WhichWay\/audio\//, "")));
			});
			//有确认存在的就只在这些里挑；一条都没有时退回原列表随机取一条（同样只留一条）
			if (exist.length) candidates = exist;
		}
		const picked = candidates.randomGet();
		return {
			audioList: [picked],
			fileList: [picked?.file],
			textList: [picked?.text].filter((text: any) => text != void 0),
		};
	}

	customVoiceGroup:string[] = ["CN_TOPOLECT","ITA","GER","RUS","FRE","SPA"]

	/**
	 * 配音组件初始化
	 */
	async init(): Promise<void> {
		onArenaReady({
			name: "whichWayAudio_init",
			fn: async () => {
				await this.ensureAudioCache();
				this.initAllAudio();

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
						//语言变更 → 清缓存并重建索引
						whichWayAudio.refreshAudioIndex();
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

	// ============ 缓存 / 索引 ============

	/**
	 * 已存在的音频文件路径集合。
	 *
	 * 原先每次 exsitAudio 都发一趟 checkFile IPC，开局 262 个干员 × 各自技能会串行检查上千次；
	 * 现在改为首次访问时一次性扁平扫描（3 轮并发），之后退化为 O(1) 的 Set 查找。
	 */
	private _audioExistCache: Set<string> | null = null;
	private _audioExistPromise: Promise<void> | null = null;

	/** 已报警过的「技能|干员」候选对账，避免每次技能触发都刷同样的日志 */
	private _auditedKeys = new Set<string>();

	/**
	 * 扩展语音加载失败时允许的重试次数。
	 *
	 * 默认为 0：失败即熔断（按需求「静默、只熔断不重试」）。`game.tryAudio` 的重试链是由
	 * `game.playAudio` 的 `onError` 驱动的（`onError: play`），把它掐断就不会再有下一次播放尝试。
	 * 若日后希望"失败后换一条候选再试一次"，把这个数字改成 1 即可。
	 */
	skillAudioErrorRetry: number = 0;

	/**
	 * 语音失败计数：键为**被包装的原始 onError 闭包**。
	 *
	 * `game.tryAudio` 每次调用都会新建一个 `play` 闭包并把它同时用作 `onError`，因此以闭包为键
	 * 恰好等于"以一次重试链为计数"：一次技能触发产生的重试链之间互不干扰，之后正常的再次触发
	 * 是全新的闭包、计数从零开始，不会被误熔断。
	 */
	private _audioErrorCount = new WeakMap<Function, number>();

	/** 已打印过失败详情的路径，避免同一路径反复刷屏 */
	private _reportedAudioError = new Set<string>();

	/** 干员 → 是否属于明日方舟干员（inArknightChars 内部是数组 includes，需缓存） */
	private _inArkCache = new Map<string, boolean>();
	/** 干员 → 配音语言 */
	private _charLangCache = new Map<string, string>();
	/** `技能|干员` → 配音语言 */
	private _skillLangCache = new Map<string, string>();
	/** 技能 → 引用链终点技能 */
	private _referCache = new Map<string, string>();
	/** `技能_干员` → 在线配音标题 */
	private _voiceCache = new Map<string, string[]>();
	/** 启用了 audioname 后缀命名的共享技能 */
	private _suffixSkills = new Set<string>();
	/** 技能 → (干员 → 在线配音实例) */
	private _webPlayMap = new Map<string, Map<string, whichWayWebPlay>>();
	/** 技能 → 被音频系统改写前的原始 audio 配置（用于切换语言后还原） */
	private _originalAudio = new Map<string, unknown>();

	/**
	 * 确保音频目录存在并建立存在性缓存（幂等，并发出一次）
	 */
	async ensureAudioCache(): Promise<void> {
		if (this._audioExistCache) return;
		if (!this._audioExistPromise) {
			this._audioExistPromise = this._buildAudioCache();
		}
		return this._audioExistPromise;
	}

	/**
	 * 建立缓存：建目录 + 扁平扫描。
	 *
	 * 这里刻意不用 whichWayFile.getFileTree —— 它对每一层目录都会「列一次 + 再递归列一次」，
	 * 同一目录被扫描两遍；音频目录的固定结构是 audio/{语言}/{文件} 与 audio/{语言}/die/{文件}，
	 * 只有两层，直接分 3 轮并发列出即可（1 + 语言数 + 子目录数 次 IPC）。
	 */
	private async _buildAudioCache(): Promise<void> {
		const root = whichWayFile.compilePath("audio:");
		const allLangs = whichWayArknight.getVoiceLangs();
		const cache = new Set<string>();

		//第 1 轮：列出语言目录，缺失的连同 die/ 一起创建
		const [existingLangs] = await listDirSafe(root);
		const missingLangs = allLangs.filter(lang => !existingLangs.includes(lang));
		if (missingLangs.length) {
			await Promise.all(
				missingLangs.map(async lang => {
					await whichWayFile.createFolder(`audio:${lang}`);
					await whichWayFile.createFolder(`audio:${lang}/die`);
				})
			);
		}
		const langNames = existingLangs.concat(missingLangs);

		//第 2 轮：并发列出各语言目录（直接文件 + 子目录名）
		const langPaths = langNames.map(lang => (root.endsWith("/") ? root + lang : `${root}/${lang}`));
		const langLists = await Promise.all(langPaths.map(listDirSafe));
		const subPaths: string[] = [];
		for (let i = 0; i < langPaths.length; i++) {
			const [subFolders, files] = langLists[i];
			for (const file of files) cache.add(`${langPaths[i]}/${file}`);
			for (const sub of subFolders) subPaths.push(`${langPaths[i]}/${sub}`);
		}

		//第 3 轮：并发列出子目录（die/ 等）
		const subLists = await Promise.all(subPaths.map(listDirSafe));
		for (let i = 0; i < subPaths.length; i++) {
			for (const file of subLists[i][1]) cache.add(`${subPaths[i]}/${file}`);
		}

		this._audioExistCache = cache;
		console.debug(`[whichWayAudio] 音频缓存就绪：${cache.size} 个文件，${langPaths.length} 个语言目录`);
	}

	private _addAudioCacheEntry(fullPath: string): void {
		this._audioExistCache?.add(fullPath);
	}

	/** 清空所有派生缓存（语言/引用/索引），下次访问时重建 */
	clearCaches(): void {
		this._charLangCache.clear();
		this._skillLangCache.clear();
		this._referCache.clear();
		this._suffixSkills.clear();
		this._webPlayMap.clear();
	}

	/** 配置变更后重建整套音频索引 */
	async refreshAudioIndex(): Promise<void> {
		//还原被改写过的 audio，避免残留上一次语言生成的路径
		for (const [skill, audio] of this._originalAudio) {
			const info = lib.skill[skill];
			if (info) (info as any).audio = audio;
		}
		this._originalAudio.clear();
		this.clearCaches();
		await this.ensureAudioCache();
		this.initAllAudio();
	}

	// ============ 索引构建 ============

	/**
	 * 一次性为所有干员建立音频索引（全程同步，无 IPC）。
	 *
	 * 原先的写法有两类问题：
	 * 1. 对 262 个干员 × 各自技能逐次 `await exsitAudio`，即使命中缓存也有上千次微任务调度；
	 * 2. `lib.skill[skill].audio` 被每个干员反复覆盖（共享技能最终只保留最后一个干员的路径），
	 *    在线配音也只挂在技能上的单例 whichWayWebPlay，导致不同干员共用同一份配音。
	 *
	 * 现在改为：
	 * 1. 先汇总「技能 → 拥有该技能的干员」，为共享技能自动登记 audioname（引擎会据此解析
	 *    `{技能}_{干员}{n}.mp3`）；
	 * 2. 再按 (技能, 干员) 把结果写到 lib.skill[目标技能].audioname2 —— 这是引擎原生的
	 *    「按角色覆盖 audio」机制（见 docs/audio-guide.md），各干员互不干扰；
	 * 3. 本地缺失的登记到「技能 → 干员」二级在线配音表，每个干员播自己的 PRTS 配音。
	 */
	initAllAudio(): void {
		if (!this._audioExistCache) return;

		const characters: Array<[string, string[]]> = [];
		const owners = new Map<string, string[]>();
		for (const name of window.whichWaySave.allCharacters) {
			const skills = get.character(name)?.skills;
			if (!skills?.length) continue;
			characters.push([name, skills]);
			for (const skill of skills) {
				let list = owners.get(skill);
				if (!list) owners.set(skill, (list = []));
				list.push(name);
			}
		}

		//共享技能：决定是否启用 audioname 后缀命名，并把干员登记进引擎的 audioname
		for (const [skill, list] of owners) {
			if (list.length < 2) continue;
			if (!this.shouldUseAudioNameSuffix(skill, list)) continue;
			const info = lib.skill[this.getReferSkill(skill)];
			if (!info) continue;
			if (!Array.isArray(info.audioname)) info.audioname = [];
			for (const char of list) {
				if (!info.audioname.includes(char)) info.audioname.push(char);
			}
			this._suffixSkills.add(skill);
		}

		for (const [name, skills] of characters) {
			this.initDieAudio(get.character(name));
			for (const skill of skills) this.applySkillAudio(skill, name);
		}
	}

	/**
	 * 共享技能是否改用 `{技能}_{干员}{n}.mp3` 命名。
	 *
	 * 多个干员共用一份 `{技能}{n}.mp3` 会互相覆盖，所以新下载一律用带干员名的后缀命名；
	 * 但若已存在旧命名文件（老版本下载产物），则沿用旧命名以免已下载的配音失效。
	 */
	private shouldUseAudioNameSuffix(skill: string, owners: string[]): boolean {
		//注意：引擎解析路径用的是引用链终点技能名，这里必须与之保持一致
		const target = this.getReferSkill(skill);
		for (const char of owners) {
			if (this._audioExistCache!.has(whichWayFile.compilePath(`audio:${this.getSkillLang(skill, char)}/${target}_${char}1.mp3`))) {
				return true;
			}
		}
		for (const char of owners) {
			if (this._audioExistCache!.has(whichWayFile.compilePath(`audio:${this.getSkillLang(skill, char)}/${target}1.mp3`))) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 为「技能 × 干员」这一组合确定音频来源并写入引擎可识别的位置。
	 *
	 * - 本地文件存在 → `lib.skill[目标技能].audioname2[干员] = "ext:WhichWay/audio/{语言}:{数量}"`
	 * - 本地文件缺失 → 登记在线配音实例（每个干员一份）
	 */
	applySkillAudio(skill: string, char: string): void {
		if (!window.whichWaySave.hasSkill(skill)) return;
		const info = lib.skill[skill];
		if (!info) return;
		if (!info.logAudio) info.logAudio = () => info.audio;

		const target = this.getReferSkill(skill);
		const targetInfo = lib.skill[target];
		//引用到核心技能（如 audio: "eagle"）时不干预，交给引擎默认处理
		if (!targetInfo || !window.whichWaySave.hasSkill(target)) return;

		const parsed = this.parseAudioCount(targetInfo.audio);
		if (!parsed) {
			this.clearWebPlay(skill, char);
			return;
		}
		//数组型 audio 指定了具体配音标题（如 ["作战中1","作战中2"]），先固化下来：
		//下面会把 info.audio 改写成路径字符串，之后再解析就只剩数量、拿不到标题了
		if (parsed.voices.length) this.cacheSkillVoices(skill, char, parsed.voices);

		const lang = this.getSkillLang(skill, char);
		const base = this.getAudioBaseName(skill, char);
		const exists = this._audioExistCache!.has(whichWayFile.compilePath(`audio:${lang}/${base}1.mp3`));

		if (exists) {
			//本地配音：路径写在 info.audio（'ext:...' 格式），引擎解析时按
			//`info.audioname` 数组匹配自动追加 `_干员` 后缀得到 `{技能}_{干员}{n}.mp3`。
			//注意：这里**不要**把路径写进 `lib.skill[].audioname2[干员]`——
			//该字段是引擎原生的"借用另一技能配音"机制（值应为另一技能名），
			//把路径字符串塞进去会让千幻聆音等扩展按错误语义执行（`lib.skill[路径]` 取不到
			//目标，触发 TypeError）。所有按角色解析的需求已由 `info.audioname` + `info.audio`
			//覆盖共同完成。
			this.clearWebPlay(skill, char);
		} else if (lang !== "CUSTOM") {
			//本地缺失 → 在线配音（按干员独立）
			this.setWebPlay(skill, char, new whichWayWebPlay(skill, char, parsed.voices, base));
		} else {
			//CUSTOM 语言又没有本地文件 → 确实无音可播
			this.clearWebPlay(skill, char);
			console.warn(`[whichWayAudio] 角色 ${char} 的技能 ${skill} 的语言设置为 ${lang}，但音频文件不存在！`);
		}

		//info.audio 保留一个稳定的默认路径字符串，供 logAudio / getSkillAudioPath 等按原样使用。
		//数量取「本地实际存在」与「技能配置数量」的较小值：引擎按这个数量生成候选路径
		//（`{前缀}1.mp3 ... {前缀}N.mp3`），只要候选里混入缺失文件，game.tryAudio 就会无限重试
		//（见 filterExistingAudio / wrapSkillAudioError 的说明）——配置写 2 条而只下到 1 条时就会中招。
		const existCount = this.getExistingAudioCount(base, lang);
		if (typeof info.audio !== "string") this._originalAudio.set(skill, info.audio);
		(info as any).audio = `ext:WhichWay/audio/${lang}:${existCount ? Math.max(1, Math.min(existCount, parsed.count)) : parsed.count}`;
	}

	/**
	 * 解析 audio 配置得到音频数量与（可选的）配音标题列表
	 */
	private parseAudioCount(audio: unknown): { count: number; voices: string[] } | undefined {
		if (audio === false || audio === undefined || audio === null) return undefined;
		if (audio === true) return { count: 1, voices: [] };
		if (typeof audio === "number") return { count: audio, voices: [] };
		if (Array.isArray(audio)) return { count: audio.length, voices: audio.slice() };
		if (typeof audio === "string") {
			//形如 "ext:WhichWay/audio/CN_MANDARIN:2"
			const matched = audio.match(/:(\d+)$/);
			if (matched) return { count: parseInt(matched[1]), voices: [] };
		}
		return undefined;
	}

	/**
	 * 该技能在该干员名下的本地文件名前缀。
	 *
	 * 引擎在解析路径时用的是**引用链终点技能名**，并在 audioname 命中该干员时追加 `_干员`，
	 * 这里必须与之完全一致，否则存在性判断与下载文件名都会错位。
	 */
	getAudioBaseName(skill: string, char: string): string {
		const target = this.getReferSkill(skill);
		if (this._suffixSkills.has(skill)) return `${target}_${char}`;
		const info = lib.skill[target];
		if (info && Array.isArray(info.audioname) && info.audioname.includes(char)) return `${target}_${char}`;
		return target;
	}

	/**
	 * 取 (技能, 干员) 的在线配音标题；数字型 audio 从中随机抽取并持久化，保证每次选中一致
	 */
	getSkillVoices(skill: string, char: string): string[] {
		const key = `${skill}_${char}`;
		const cached = this._voiceCache.get(key);
		if (cached) return cached;

		const stored = audioSave.onlineVoicesTitle[key];
		if (Array.isArray(stored) && stored.length) {
			this._voiceCache.set(key, stored);
			return stored;
		}

		const parsed = this.parseAudioCount(lib.skill[this.getReferSkill(skill)]?.audio);
		let titles: string[];
		if (parsed?.voices.length) {
			titles = parsed.voices.slice();
		} else {
			const count = Math.max(1, Math.min(parsed?.count ?? 2, DEFAULT_VOICE_TITLES.length));
			titles = DEFAULT_VOICE_TITLES.randomGets(count);
		}
		return this.cacheSkillVoices(skill, char, titles);
	}

	/** 固化 (技能, 干员) 的在线配音标题 */
	cacheSkillVoices(skill: string, char: string, titles: string[]): string[] {
		const key = `${skill}_${char}`;
		this._voiceCache.set(key, titles);
		audioSave.onlineVoicesTitle[key] = titles;
		return titles;
	}

	// ============ 在线配音表 ============

	getWebPlay(skill: string, char: string): whichWayWebPlay | undefined {
		return this._webPlayMap.get(skill)?.get(char);
	}

	setWebPlay(skill: string, char: string, instance: whichWayWebPlay): void {
		let map = this._webPlayMap.get(skill);
		if (!map) this._webPlayMap.set(skill, (map = new Map()));
		map.set(char, instance);
	}

	clearWebPlay(skill: string, char: string): void {
		this._webPlayMap.get(skill)?.delete(char);
	}

	/**
	 * 按玩家查找在线配音实例：依次尝试 name/name1/name2/显示名，再回退到引用技能
	 */
	findWebPlay(skill: string, player: Player | string): whichWayWebPlay | undefined {
		const names = resolvePlayerNames(player);
		const target = this.getReferSkill(skill);
		for (const skillName of skill === target ? [skill] : [skill, target]) {
			for (const name of names) {
				const found = this.getWebPlay(skillName, name);
				if (found) return found;
			}
		}
		return undefined;
	}

	/**
	 * 取 audioname2 中命中该玩家的配置值。
	 *
	 * 引擎原生 audioname2 用于"按角色覆盖 audio"，命中后通常为以下几种：
	 * - 干员代码写的「借用别的技能配音」（`info.audioname2[player.name] = "bianyimrfz"`）→
	 *   需要转交那个技能处理，否则在线配音会播错人；
	 * - 其它（如引用核心技能）→ 交回引擎。
	 *
	 * 注意：**本地配音的路径不再走 audioname2**（会与"技能别名"语义冲突，
	 * 并会让千幻聆音等扩展崩溃）——本地路径由 `info.audio` 覆写 + `info.audioname`
	 * 数组按角色追加后缀共同完成。
	 */
	getAudioname2Value(info: Skill, player: Player | string): string | undefined {
		const map = (info as any)?.audioname2 as Record<string, unknown> | undefined;
		if (!map) return undefined;
		for (const name of resolvePlayerNames(player)) {
			const value = map[name];
			if (typeof value === "string") return value;
		}
		return undefined;
	}

	// ============ 引擎 API 覆盖 ============

	async override(): Promise<void> {
		await whichWayAPIOverride.appendHook("game.trySkillAudio", {
			//⚠ 这里**必须是同步函数**：appendHook 的同步包装层用 `beforeResult === false` 判断是否短路
			//（override/index.js:116），而 async 函数返回的是 Promise，`return false` 永远拦不住引擎。
			//一旦拦不住，引擎就会继续执行 trySkillAudio → get.Audio.skill → game.tryAudio，
			//而 tryAudio 在「列表里既有能播的文件、又有缺失的文件」时会无限重试
			//（能播的那条触发 onCanPlay 置 refresh，之后每条缺失文件的 onError 都会把列表重新填满
			//再随机取一条，见 game/index.js:2577-2602），听感就是「一句播完又随机播另一句、永不停歇」。
			before: function (skill, player, directaudio, nobroadcast, skillInfo, args) {
				if (!lib.config.background_speak) {
					return false;
				}

				if (whichWayAudio.isRepeatedSkillAudio(skill, player, directaudio)) {
					console.log(`[驶舰之向] 已拦截重复的技能配音：${skill} / ${typeof player === "string" ? player : get.name(player)}`);
					return false;
				}
				whichWayAudio.markSkillAudioPlayed(skill, player);

				const trueSkill = whichWayAudio.getReferSkill(skill);
				const info: Skill = skillInfo || lib.skill[trueSkill];
				const infox: Skill = skillInfo || lib.skill[skill];

				if (!info || !infox) {
					return false;
				}
				if (infox.direct && !directaudio) {
					return false;
				}
				if (lib.skill.global.includes(skill) && !infox.forceaudio) {
					return false;
				}

				const audioname2 = whichWayAudio.getAudioname2Value(infox, player);
				if (audioname2 !== undefined) {
					if (audioname2 !== skill && !audioname2.startsWith("ext:") && window.whichWaySave.hasSkill(audioname2)) {
						game.trySkillAudio(audioname2, player, directaudio, true, void 0, args);
						return false;
					}
					return;
				}

				const web = whichWayAudio.findWebPlay(skill, player);
				if (web && !web.useLocalAudio) {
					//在线配音：本地文件必然缺失，交回引擎只会刷 404，因此由扩展播放并短路
					web.play();
					return false;
				}

				//本地配音：**仍然交给引擎按原生方式播放**（兼容性优先，例如录像回放、其它扩展的
				//音频钩子都依赖引擎流程）。安全性由 get.Audio.skill 钩子保证：它只把确实存在的
				//文件交给引擎，因此不会出现「能播 + 缺失」的混合列表去触发 tryAudio 的重试循环。
				return;
			},
		});

		await whichWayAPIOverride.appendHook("game.tryDieAudio", {
			before: function (player) {
				const name = typeof player === "string" ? player : player ? get.name(player) : void 0;
				if (!name) return;
				const info: WhichWayCharacter = get.character(name);

				//initDieAudio 只在本地文件缺失时才挂 dieAudio，因此有实例就意味着要走在线
				if (!info?.whichWay?.dieAudio) return;
				if (whichWayUtil.config("useLocalAudio")) return;

				info.whichWay.dieAudio.play();
				return false;
			},
		});

		// ============ 在线配音的「本地请求」补漏 ============
		// 引擎除 trySkillAudio / tryDieAudio（上面已短路）外，还有其它入口会直接对技能/阵亡
		// 台词解析**本地文件列表**并发起请求——典型如武将详情弹窗里点击技能页签时的语音预览
		// （ui/click 直接 get.Audio.skill(...).fileList + game.tryAudio，不走 trySkillAudio）。
		// 在线配音组合的本地文件必然缺失，这类请求会刷 404。
		// 因此在解析层拦截：在线组合返回空文件列表（音频仍由 trySkillAudio/tryDieAudio
		// 钩子走在线播放），本地组合原样放行。
		//@ts-ignore 返回结构与引擎 Audio 实例读取的字段一致（audioList/fileList/textList）
		const onlineAudioStub = Object.freeze({ audioList: [], fileList: [], textList: [] });

		await whichWayAPIOverride.appendHook("get.Audio.skill", {
			after(result: any, options: any) {
				if (!result || typeof options?.skill !== "string" || !options?.player) return result;
				try {
					const web = whichWayAudio.findWebPlay(options.skill, options.player);
					//有在线实例 = 本地必然缺文件；useLocalAudio 时不干预（用户强制走本地）
					if (!web || web.useLocalAudio) {
						//体检：把引擎解析出的候选与本地文件对账，部分缺失时在控制台报警（见 auditEngineAudioList 注释）
						whichWayAudio.auditEngineAudioList(options.skill, options.player, result);
						//本地播放仍然交给引擎（兼容性优先），但只把**确实存在**的文件交过去：
						//game.tryAudio 只要遇到「能播 + 缺失」混合列表，就会在 onError 下无限重试
						//（听感是「一句播完又随机播另一句」），过滤后全部存在即无 error 可触发（见 filterExistingAudio）。
						return whichWayAudio.filterExistingAudio(result);
					}
				} catch (e) {
					return result;
				}
				return onlineAudioStub;
			},
		});

		await whichWayAPIOverride.appendHook("get.Audio.die", {
			after(result: any, options: any) {
				if (!result || !options?.player) return result;
				try {
					const name = typeof options.player === "string" ? options.player : get.name(options.player);
					if (!name) return result;
					const char = get.character(name);
					//initDieAudio 只在本地缺失时才挂 dieAudio 实例
					if (!char?.whichWay?.dieAudio) return whichWayAudio.filterExistingAudio(result);
					if (whichWayUtil.config("useLocalAudio")) return whichWayAudio.filterExistingAudio(result);
				} catch (e) {
					return result;
				}
				return onlineAudioStub;
			},
		});

		// ============ 扩展语音的 onError 熔断 ============
		// 引擎 game.tryAudio 的 `refresh` 只由 onCanPlay 置真且**永不复位**：一旦成功加载过一次，
		// 之后任何一次 onError 都会让 play() 把候选列表重新填满再随机播一条 ⇒
		// 「一句配音播完又随机播另一句、永不停止」。候选只剩一条也没用（单条反复失败同样循环）。
		// 唯一出口就是 game.playAudio 的 onError（game/index.js:2540），这里把它换成熔断版本：
		// 失败即静默结束（默认不重试），并打印一次失败详情（实际请求地址 / MediaError.code / 状态）。
		await whichWayAPIOverride.appendHook("game.playAudio", {
			//必须是同步函数：appendHook 的同步包装层用 `beforeResult === false` 判短路、用数组替换参数
			before: function (...args: any[]) {
				//只接管「单对象 options」形态；位置参数形态（playAudio("a","b")）一律透传
				const options = args.length === 1 ? args[0] : void 0;
				if (!options || typeof options !== "object" || Array.isArray(options)) return;
				if (!whichWayAudio.isOwnAudioPath(options.path)) return;
				//浅拷贝后替换 onError，避免污染调用方（tryAudio 闭包）持有的对象
				return [{ ...options, onError: whichWayAudio.wrapSkillAudioError(options.path, options.onError) }];
			},
		});
	}

	// ============ 对外 API ============

	/**
	 * 检查音频文件夹是否存在，不存在则创建
	 *
	 * 已并入 ensureAudioCache：建目录与扫描在同一次扁平遍历中完成，不再各自发起 IPC。
	 */
	async checkAudioFolder(): Promise<void> {
		await this.ensureAudioCache();
	}

	/**
	 * 下载音频
	 * @param {string} skill 技能名
	 * @param {string} char 角色名
	 * @param {string[]} urls 音频地址
	 * @param {string} [lang] 配音语言
	 * @param {boolean} [dieAudio=false] 是否是死亡音频
	 */
	async downloadAudio(skill: string, char: string, urls: string[], lang?: string, dieAudio: boolean = false): Promise<void> {
		if (urls === void 0) throw new Error("url is undefined");
		if (lang === void 0) {
			lang = this.getCharacterLang(char);
		}

		const path = whichWayFile.compilePath(`audio:${lang}${dieAudio ? "/die" : ""}/`);
		//文件名必须与引擎解析出的路径一致：引用技能用终点技能名，共享技能带干员后缀
		const base = dieAudio ? char : this.getAudioBaseName(skill, char);

		for (let i = 0; i < urls.length; i++) {
			const file = `${dieAudio ? base : `${base}${i + 1}`}.mp3`;
			await whichWayFile.download(urls[i], path, file);
			//增量更新缓存，避免后续 initAudio/initDieAudio 误判为缺失
			this._addAudioCacheEntry(`${path}${file}`);
			whichWayToast.showToast(`下载${file}成功`);
			whichWayToast.removeToastById(`whichWayAudioDownLoad_${file}`);
		}

		if (!dieAudio) await this.initAudio(skill, char);
		else this.initDieAudio(get.character(char));
	}

	/**
	 * 获取所有缺失配音的信息列表
	 * @param {boolean} [allLangs=false] 是否获取所有可用语言的配音，而不仅仅是当前语言
	 * @returns {Promise<Array<{type: 'skill'|'die', skill?: string, char: string, urls: string[], lang: string}>>}
	 */
	async getMissingAudioList(
		allLangs: boolean = false
	): Promise<Array<{ type: "skill" | "die"; skill?: string; char: string; urls: string[]; lang: string }>> {
		await this.ensureAudioCache();
		const tasks: Array<{ type: "skill" | "die"; skill?: string; char: string; urls: string[]; lang: string }> = [];

		for (const char of window.whichWaySave.allCharacters) {
			const charData = get.character(char);
			if (!charData?.skills) continue;

			const avaiableLangs = whichWayArknight.getAviableLangs(char) || [];
			const defaultLang = this.getCharacterLang(char);
			const langsToCheck = allLangs ? avaiableLangs.filter(l => l !== "CUSTOM") : [defaultLang];
			if (!langsToCheck.length) continue;

			for (const skill of charData.skills) {
				if (!window.whichWaySave.hasSkill(skill)) continue;
				const base = this.getAudioBaseName(skill, char);
				for (const lang of langsToCheck) {
					if (lang === "CUSTOM") continue;
					if (!allLangs && this._audioExistCache!.has(whichWayFile.compilePath(`audio:${lang}/${base}1.mp3`))) {
						continue;
					}
					const voiceTitles = this.getSkillVoices(skill, char);
					if (!voiceTitles.length) continue;
					tasks.push({
						type: "skill",
						skill,
						char,
						urls: voiceTitles.map(title => this.compileVoicePath(char, lang, title)),
						lang,
					});
				}
			}

			for (const lang of langsToCheck) {
				if (lang === "CUSTOM") continue;
				if (!allLangs && this.exsitAudioSync(null!, char, true)) continue;
				tasks.push({
					type: "die",
					char,
					urls: [this.compileVoicePath(char, lang, "行动失败")],
					lang,
				});
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
		let finished = 0;

		//小并发下载：串行时每个任务都要等一次网络往返，4 路并发能显著缩短总耗时，
		//又不至于把 fs server 的写队列打满
		const concurrency = 4;
		let cursor = 0;
		const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
			while (true) {
				const index = cursor++;
				if (index >= tasks.length) return;
				const task = tasks[index];
				const current = ++finished;

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
		});
		await Promise.all(workers);

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
		if (char === void 0 || skill === void 0) throw new Error("char or skill is undefined");

		const key = `${skill}|${char}`;
		const cached = this._skillLangCache.get(key);
		if (cached !== undefined) return cached;

		let result: string;
		if (!this.inArknightChars(char)) {
			result = "CUSTOM";
		} else {
			const defaultLang = this.getCharacterLang(char) || audioSave.default;
			const custom = audioSave.custom[char];
			if (!custom) result = defaultLang;
			else result = this.expandSkills(custom.skills).includes(skill) ? custom.lang : defaultLang;
		}

		this._skillLangCache.set(key, result);
		return result;
	}

	/** inArknightChars 的记忆化包装（内部是数组 includes，逐个调用是 O(n²)） */
	private inArknightChars(char: string): boolean {
		let cached = this._inArkCache.get(char);
		if (cached === undefined) {
			cached = whichWayArknight.inArknightChars(char);
			this._inArkCache.set(char, cached);
		}
		return cached;
	}

	/**
	 * 播放技能音频(无视trySkillAudio的限制)
	 */
	playSkillAudio(skill: string, name: string) {
		const web = this.findWebPlay(skill, name);
		if (web) return web.play();

		const audioList = get.Audio.skill({ skill, player: name }).fileList;
		return game.tryAudio({ audioList });
	}

	/**
	 * 扩展技能组
	 */
	expandSkills(skills: string[]): string[] {
		const result = [...skills];
		for (const skill of skills) {
			const info = lib.skill[skill];
			if (!info) continue;
			//@ts-ignore
			const audio: string = info.audio;
			if (window.whichWaySave.hasSkill(audio)) {
				result.push(this.getReferSkill(audio));
			}
			if (info.derivation) {
				const extraSkills = Array.isArray(info.derivation) ? info.derivation : [info.derivation];
				for (const extraSkill of extraSkills) {
					if (window.whichWaySave.hasSkill(extraSkill)) {
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

		let lang = this._charLangCache.get(char);
		if (lang === undefined) {
			const custom = audioSave.custom[char];
			if (custom) {
				lang = custom.lang;
			} else {
				const langs = this.getCharacterAvailableLang(char);
				if (!langs.length) lang = "CUSTOM";
				else if (langs.includes(audioSave.default)) lang = audioSave.default;
				else lang = langs[0];
			}
			this._charLangCache.set(char, lang);
		}

		return translate ? whichWayArknight.getVoiceLangTranslation(lang)! : lang;
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
	 * 技能的音频是否存在（同步版本，需先 ensureAudioCache）
	 * @param {string} skill 技能名,如果是死亡配音此参数没有意义
	 * @param {string} char 角色名
	 * @param {boolean} [dieAudio=false] 是否是死亡音频
	 */
	exsitAudioSync(skill: string, char: string, dieAudio: boolean = false): boolean {
		if (!this._audioExistCache) return false;
		if (dieAudio) {
			const lang = this.getCharacterLang(char);
			return this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang}/die/${char}.mp3`));
		}
		const lang = this.getSkillLang(skill, char);
		const base = this.getAudioBaseName(skill, char);
		return this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang}/${base}1.mp3`));
	}

	/**
	 * 对账「引擎解析出的候选音频」与「本地实际存在的文件」，**部分缺失**时在控制台报警。
	 *
	 * ⛔ **只对本扩展语音生效**：本体技能（如 `skill/wfyuyan1.mp3`）与其它扩展的音频不在扩展的
	 * 存在性缓存（`_audioExistCache`）里，让它们参与对账只会被误报成"全部缺失"。
	 * 因此这里先用 `toAudioCacheKey()`（与 `game.playAudio` 熔断钩子共用同一套归一化）
	 * 筛出属于本扩展的候选；一条都筛不出来就直接返回，不做任何对账与打印。
	 *
	 * 排查价值：引擎的 `game.tryAudio` 只在候选列表里**既有能加载的、又有加载失败的**时才会无限重试
	 * （能加载的那条触发 `onCanPlay` 把 `refresh` 置真，之后每一次 `onError` 都会把列表重新填满再随机取一条，
	 * 见 `game/index.js:2577-2602`）；全部缺失只会静默失败、全部存在只会播一条，都不会循环。
	 * 因此"是否部分缺失"就是判断某位干员会不会中招的唯一条件，而这里会把**具体哪一条缺失**打出来。
	 *
	 * @param result 引擎 `get.Audio.skill` 解析出的 Audio 实例（含 audioList/fileList/textList）
	 */
	auditEngineAudioList(skill: string, player: Player | string, result: any): void {
		if (!this._audioExistCache) return;
		const list = result?.fileList as string[] | undefined;
		if (!Array.isArray(list) || !list.length) return;
		//只取能映射到扩展缓存的条目；本体技能的 `skill/xxx.mp3` 等一律映射失败 ⇒ 不参与对账
		const own: Array<{ file: string; key: string }> = [];
		for (const file of list) {
			const key = this.toAudioCacheKey(file);
			if (key) own.push({ file: file as string, key });
		}
		if (!own.length) return;
		const missing = own.filter(item => !this._audioExistCache!.has(whichWayFile.compilePath(item.key))).map(item => item.file);
		//全部存在是正常情况，不需要提醒
		if (!missing.length) return;
		const char = typeof player === "string" ? player : get.name(player) || "";
		//同一个 (技能, 干员) 只报警一次，避免每次触发都刷屏
		const auditKey = `${skill}|${char}`;
		if (this._auditedKeys.has(auditKey)) return;
		this._auditedKeys.add(auditKey);
		//部分缺失 = 引擎 tryAudio 无限重试的充要条件（能播的触发 onCanPlay 置 refresh，
		//缺失的 onError 再把列表填满再随机取一条）；全部缺失只会静默失败一次。
		const partial = missing.length < own.length;
		console.warn(
			`[whichWayAudio] ${char} 的技能 ${skill}：本扩展的 ${own.length} 条候选语音里有 ${missing.length} 条在本地找不到，` +
				`${partial ? "属于「部分缺失」⇒ 会让引擎 tryAudio 无限重试（配音一句播完又播一句），已由 game.playAudio 的 onError 熔断拦截" : "属于「全部缺失」⇒ 只会静默失败一次，不会循环"}` +
				`。候选与缺失项如下：`,
			{ 候选: own.map(item => item.file), 缺失: missing }
		);
	}

	/**
	 * 该 (技能, 干员) 本地**连续存在**的音频文件数（从 1 开始数到第一个缺失为止）。
	 *
	 * 用于写入 `info.audio` 的数量：引擎按这个数量生成候选路径 `{前缀}1.mp3 ... {前缀}N.mp3`，
	 * 只要其中混入缺失文件就会触发 `game.tryAudio` 的无限重试，所以数量必须与磁盘实际文件数一致。
	 */
	getExistingAudioCount(base: string, lang: string): number {
		if (!this._audioExistCache) return 0;
		let count = 0;
		//上限只是防御：正常情况下一个技能的配音不会超过 32 条
		while (count < 32) {
			const name = `${base}${count + 1}.mp3`;
			if (!this._audioExistCache.has(whichWayFile.compilePath(`audio:${lang}/${name}`))) break;
			count++;
		}
		return count;
	}

	/**
	 * 剥离各种前缀，把音频路径归一化成扩展内的相对路径（`WhichWay/...`）。
	 *
	 * 扩展语音在不同入口的写法不同，必须都能归一化到同一形态：
	 * - 技能语音：`ext:WhichWay/audio/{语言}/{技能}{序号}.mp3`（引擎会把 `ext:` 换成 `extension/`）
	 * - 阵亡语音：`whichWayFile.compilePath("audio:...")` 产物，形如 `${lib.assetURL}extension/WhichWay/audio/...`
	 * - 其它扩展改写后可能出现 `../extension/WhichWay/audio/...`
	 *
	 * @returns 归一化后的路径；入参不是字符串或为空时返回 undefined
	 */
	private normalizeOwnPath(file: unknown): string | undefined {
		if (typeof file !== "string" || !file) return undefined;
		let normalized = file;
		//`../extension/WhichWay/...` → `extension/WhichWay/...`
		if (normalized.startsWith("../")) normalized = normalized.slice(3);
		//带资源前缀的形态 → 去掉前缀（lib.assetURL 为空串时跳过，避免"以空前缀开头"恒真）
		const assetURL = lib.assetURL || "";
		if (assetURL && normalized.startsWith(assetURL)) normalized = normalized.slice(assetURL.length);
		//`ext:WhichWay/...` → `WhichWay/...`
		if (normalized.startsWith("ext:")) normalized = normalized.slice(4);
		//`extension/WhichWay/...` → `WhichWay/...`
		if (normalized.startsWith("extension/")) normalized = normalized.slice("extension/".length);
		return normalized;
	}

	/**
	 * 把引擎解析出的音频路径映射成扩展存在性缓存（`_audioExistCache`）使用的键 `audio:{语言}/{文件名}`。
	 *
	 * 对账（`auditEngineAudioList`）靠它判断"这条候选是不是扩展语音"，
	 * 与 `isOwnAudioPath` 共用同一段归一化，避免两处判定漂移造成误报/漏判。
	 *
	 * @returns 扩展缓存键；不是扩展语音（例如本体技能的 `skill/xxx1.mp3`）时返回 undefined
	 */
	toAudioCacheKey(file: unknown): string | undefined {
		const normalized = this.normalizeOwnPath(file);
		if (!normalized || !normalized.startsWith("WhichWay/audio/")) return undefined;
		return "audio:" + normalized.slice("WhichWay/audio/".length);
	}

	/**
	 * 归一化判断：这条播放请求是否属于「扩展自己的音频」。
	 *
	 * 熔断钩子（`game.playAudio` 的 before）用它决定是否接管，因此判定要比 `toAudioCacheKey`
	 * 更宽一点：归一化后只要落在 `WhichWay/` 下即算扩展路径（不限于 `audio/` 子目录）。
	 */
	isOwnAudioPath(path: unknown): boolean {
		return this.normalizeOwnPath(path)?.startsWith("WhichWay/") ?? false;
	}

	/**
	 * 给 `game.playAudio` 的 `onError` 套一层熔断，切断 `game.tryAudio` 的无限重试。
	 *
	 * 背景：`game.tryAudio`（`game/index.js:2569-2613`）里
	 * ```js
	 * const check = () => { if (list.length) return true; if (refresh) { list = audioList.slice(); return true; } return false; };
	 * const play  = () => { ...; return game.playAudio({ path: audio, onCanPlay: () => (refresh = true), onError: play }); };
	 * ```
	 * `refresh` 只由 `onCanPlay` 置真且**永不复位**：一旦成功加载过一次，之后任何一次 `onError`
	 * 都会让 `play()` 把候选列表重新填满再随机播一条 ⇒ **无限循环**（表现为"一句播完又随机播另一句"）。
	 * 候选是否只有一条都无所谓——单条反复失败同样会循环。**唯一出口就是这里**。
	 *
	 * @param path 本次播放的路径（用于诊断）
	 * @param onError 引擎传入的错误回调（`tryAudio` 里就是重试函数 `play`）
	 */
	wrapSkillAudioError(path: string, onError: unknown): (...args: any[]) => void {
		const original = typeof onError === "function" ? (onError as (...args: any[]) => void) : void 0;
		return (...args: any[]) => {
			this.reportSkillAudioError(path, args[0]);
			if (!original) return;
			const used = (this._audioErrorCount.get(original) || 0) + 1;
			this._audioErrorCount.set(original, used);
			//达到上限即熔断：不再调用原始 onError ⇒ 引擎不会发起下一次 play ⇒ 循环终止
			if (used > this.skillAudioErrorRetry) return;
			original(...args);
		};
	}

	/**
	 * 打印扩展语音加载失败的详情（每个路径只打印一次），用于定位"为什么加载失败"。
	 *
	 * `game.playAudio` 的 `audio.onerror` 会先 `audio.remove()` 再回调，但事件对象仍在内存中，
	 * 因此 `evt.target` 上的 `error/currentSrc/readyState/networkState` 都可以读取。
	 */
	reportSkillAudioError(path: string, evt: any): void {
		if (this._reportedAudioError.has(path)) return;
		this._reportedAudioError.add(path);
		const audio = evt?.target as HTMLAudioElement | undefined;
		const code = audio?.error?.code;
		const codeText: Record<number, string> = {
			1: "请求被中断(ABORTED)",
			2: "网络/请求失败(NETWORK)",
			3: "解码失败(DECODE)",
			4: "源不支持(SRC_NOT_SUPPORTED)",
		};
		console.warn(
			`[whichWayAudio] 扩展语音加载失败，本次触发将静默且不再重试：${path}\n` +
				`  · 实际请求地址：${audio?.currentSrc || audio?.src || "(未知)"}\n` +
				`  · MediaError.code：${code ?? "(无)"} ${code != null ? codeText[code] || "" : ""}\n` +
				`  · readyState=${audio?.readyState ?? "?"} networkState=${audio?.networkState ?? "?"}`
		);
	}

	/**
	 * 技能的音频是否存在
	 * @param {string} skill 技能名,如果是死亡配音此参数没有意义
	 * @param {string} char 角色名
	 * @param {boolean} [dieAudio=false] 是否是死亡音频
	 * @returns {Promise<boolean>} 音频是否存在
	 */
	async exsitAudio(skill: string, char: string, dieAudio: boolean = false): Promise<boolean> {
		await this.ensureAudioCache();
		return this.exsitAudioSync(skill, char, dieAudio);
	}

	async setCustomAudio(char: string, lang: string): Promise<void> {
		const skills = get.character(char)?.skills || [];
		if (!audioSave.custom[char]) audioSave.custom[char] = { lang: lang, skills: skills };
		else {
			audioSave.custom[char].lang = lang;
			audioSave.custom[char].skills = skills;
		}

		whichWayUtil.saveConfig("audioConfig", audioSave);

		//语言变更 → 清掉该干员相关缓存后重建
		this._charLangCache.delete(char);
		for (const key of [...this._skillLangCache.keys()]) {
			if (key.endsWith(`|${char}`)) this._skillLangCache.delete(key);
		}

		await this.ensureAudioCache();
		for (const skill of skills) {
			this.applySkillAudio(skill, char);
		}
		this.initDieAudio(get.character(char));
	}

	/**
	 * 初始化单个技能的音频（下载完成 / 切换配音语言后调用）
	 */
	async initAudio(skill: string, char: string): Promise<void> {
		await this.ensureAudioCache();
		this.applySkillAudio(skill, char);
	}

	/**
	 * 初始化角色死亡音频
	 * @param {WhichWayCharacter} char 角色
	 */
	initDieAudio(char: WhichWayCharacter): void {
		if (!char?.whichWay?.charId) return;
		const name = char.whichWay.charId;

		//阵亡语音必须写成 `ext:` 形态：game.playAudio 只认 blob:/data:/ext:/db:，其余一律前置 `audio/`
		//（game/index.js:2488-2497）。旧写法（compilePath 产物 `extension/WhichWay/...`）会被拼成
		//`audio/extension/WhichWay/...` ⇒ 每次必然 404，所以这里改用引擎能正确解析的 ext: 前缀。
		//@ts-ignore
		char.dieAudios = [`ext:WhichWay/audio/${this.getCharacterLang(name)}/die/${name}.mp3`];

		//武将包自定义的 dieAudio（不是本模块挂的在线播放器）一律保留：
		//模块只对自己挂的那个负责（缺本地语音时挂、有本地语音时清）
		const customDieAudio = !!char.whichWay.dieAudio && !(char.whichWay.dieAudio instanceof whichWayWebPlayDie);
		if (!this.exsitAudioSync(null!, name, true)) {
			if (!customDieAudio && whichWayArknight.inArknightChars(name)) char.whichWay.dieAudio = new whichWayWebPlayDie(char);
		} else if (char.whichWay.dieAudio && !customDieAudio) {
			//@ts-ignore
			char.whichWay.dieAudio = undefined;
		}
	}

	/**
	 * 查找引用技能的最终目标技能
	 *
	 * 该方法用于递归查找技能引用链的最终目标技能。当一个技能的 audio 属性引用了另一个技能时，
	 * 会继续查找被引用技能的 audio 属性，直到找到不为字符串类型或为纯数字字符串的技能为止。
	 *
	 * 该方法会检测并处理循环引用情况，如果发现循环引用会输出警告并返回原始技能名。
	 * 结果会被记忆化，避免 262 个干员 × 各自技能重复走同一条引用链。
	 *
	 * @param {string} name - 起始技能名称
	 * @returns {string} 最终目标技能名称
	 */
	getReferSkill(name: string): string {
		const cached = this._referCache.get(name);
		if (cached !== undefined) return cached;
		const result = this._resolveReferSkill(name, new Set());
		this._referCache.set(name, result);
		return result;
	}

	private _resolveReferSkill(name: string, visited: Set<string>, lastName?: string): string {
		if (visited.has(name)) {
			console.warn(`Circular reference detected at skill: ${name}`);
			return name;
		}

		visited.add(name);

		const info = lib.skill[name];
		if (!info || !info.audio) return lastName || name;

		const audio = info.audio;
		if (typeof audio === "string" && !/^\d+$/.test(audio)) {
			return this._resolveReferSkill(audio, visited, name);
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
		if (lang === "CN_TOPOLECT") {
			uid = `${uid}_cn_topolect`;
		} else if(lang === "ITA"){
			//整个custom组就意大利语搞特殊是何意味
			uid = `${uid}_ita`;
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
			else if (this.customVoiceGroup.includes(lang)) {
				return "voice_custom";
			} else if (lang === "CN_MANDARIN") {
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
