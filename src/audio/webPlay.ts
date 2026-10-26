import { lib } from "noname";
import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.ts";
import { whichWayToast } from "../toast/index.ts";

export class whichWayWebPlay {
	/**
	 * 创建webPlay组件
	 *
	 * 在线配音是**按 (技能, 干员) 一对一**的：同一个共享技能（如阵营技）由不同干员使用时，
	 * 应当播放各自干员的 PRTS 配音，而不是共用一份。因此实例由 whichWayAudio 以
	 * 二级 Map（技能 → 干员 → 实例）统一持有，不再挂在 lib.skill[skill].whichWayWebPlay 上。
	 *
	 * @param {string} skill 配音技能名
	 * @param {string} char 角色名
	 * @param {string[]} [voices] 配音标题，为空时按 (技能, 干员) 取/生成
	 * @param {string} [audioBaseName] 本地下载时的文件名前缀（共享技能为「技能_干员」）
	 */
	constructor(skill: string, char: string, voices: string[] = [], audioBaseName?: string) {
		this.skill = skill;
		this.char = char;
		this.audioBaseName = audioBaseName || skill;
		this.voicesTitle = voices.length > 0 ? voices.slice() : whichWayAudio.getSkillVoices(skill, char);
	}
	/**
	 * PRTS路径
	 */
	resourceUrl: string = `https://torappu.prts.wiki/`;
	skill: string;
	char: string;
	/**
	 * 本地下载时使用的文件名前缀（不含序号与扩展名）
	 */
	audioBaseName: string;
	voicesTitle: string[] = [];

	get useLocalAudio(): boolean {
		return whichWayUtil.config("useLocalAudio") || false;
	}

	get lang(): string {
		return whichWayAudio.getSkillLang(this.skill, this.char);
	}

	get voiceUrl(): string[] {
		return this.voicesTitle.map(title => whichWayAudio.compileVoicePath(this.char, this.lang, title));
	}

	get autoDownloadAudio(): boolean {
		return whichWayUtil.config("autoDownloadAudio") || false;
	}

	/**
	 * 上一次播放的音频实例。
	 *
	 * 同一个 (技能, 干员) 再次播放时会先停掉旧的：技能被反复触发时（例如触发技在
	 * 玩家选择期间再次结算），否则多段配音会叠在一起，听起来像「配音一直在响」。
	 */
	private _playing?: HTMLAudioElement;

	/**
	 * 停止这个 (技能, 干员) 上一次播放的配音
	 */
	stop(): void {
		if (!this._playing) return;
		try {
			this._playing.pause();
		} catch (e) {
			//忽略：pause 在部分环境可能抛错，不影响后续播放
		}
		this._playing = undefined;
	}

	play(): HTMLAudioElement | undefined {
		return this.playLine();
	}

	/**
	 * 播放指定的一条在线配音。
	 *
	 * 序号与本地文件名一一对应：`voicesTitle[i]` 就是下载后会写成 `{前缀}{i+1}.mp3` 的那一句
	 * （见 `downloadAudio` 的循环），所以「单条试听」在在线/本地两种来源下听到的是同一句。
	 *
	 * @param index `voicesTitle` 的下标；缺省随机取一条。显式传入但越界时返回 undefined
	 *   （宁可不播，也不要随机播别的一句——用户点的是确定的第几条）
	 */
	playLine(index?: number): HTMLAudioElement | undefined {
		const urls = this.voiceUrl;
		let url: string | undefined;
		if (typeof index === "number") {
			url = urls[index];
			if (!url) return undefined;
		} else {
			url = urls.randomGet();
		}
		if (!url) return undefined;

		const audio = new Audio(url);
		//与引擎自己的 game.playAudio 保持同一换算（volumn_audio 取值范围 0~8）
		audio.volume = lib.config.volumn_audio / 8;
		audio.play();
		this._playing = audio;

		if (!whichWayUtil.config("noTipUseWeb")) {
			whichWayToast.showToast(`[驶舰之向] 正在使用网络!`);
		}

		if (this.autoDownloadAudio) {
			whichWayAudio.downloadAudio(this.skill, this.char, this.voiceUrl, this.lang);
		}

		return audio;
	}
}
