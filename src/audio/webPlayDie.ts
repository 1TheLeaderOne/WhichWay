import { lib } from "noname";
import { whichWayToast } from "../toast/index.ts";
import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.ts";

export class whichWayWebPlayDie {
	/**
	 * 创建阵亡配音的在线播放器（与 `whichWayWebPlay` 对齐）。
	 *
	 * @param {WhichWayCharacter} char 角色
	 * @param {string[]} [voices] 配音标题，为空时退回「行动失败」
	 * @param {Array<string|undefined>} [voiceIds] 与 `voices` 等长：第 i 条来自哪个语音库
	 *   （`skin_table` 的 `voiceId`，`undefined` 表示干员自己的基础语音）
	 * @param {string} [audioBaseName] 本地下载时的文件名前缀（引擎拼出的 `DieAudio.name`）
	 */
	constructor(char: WhichWayCharacter, voices: string[] = [], voiceIds: Array<string | undefined> = [], audioBaseName?: string) {
		this.that = char.whichWay;
		this.audioBaseName = audioBaseName || char.whichWay?.charId || "";
		this.voicesTitle = voices.length ? voices.slice() : ["行动失败"];
		this.voiceIds = voiceIds.slice();
	}
	that: WhichWayCharConfig;
	/** 本地下载的文件名前缀（引擎解析时用的 `DieAudio.name`，即武将的注册名） */
	audioBaseName: string;
	voicesTitle: string[] = ["行动失败"];
	/** 与 `voicesTitle` 等长：第 i 条用哪个语音库（`undefined` = 基础语音） */
	voiceIds: Array<string | undefined> = [];
	get useLocalAudio(): boolean {
		return whichWayUtil.config("useLocalAudio") || false;
	}

	get lang(): string {
		return whichWayAudio.getCharacterLang(this.that.charId);
	}

	get voiceUrl(): string[] {
		return this.voicesTitle.map((title, i) => whichWayAudio.compileVoicePath(this.that.charId, this.lang, title, this.voiceIds[i]));
	}

	get autoDownloadAudio(): boolean {
		return whichWayUtil.config("autoDownloadAudio") || false;
	}

	/** 上一次播放的音频实例：再次播放先停掉旧的，避免两段阵亡语音叠在一起 */
	private _playing?: HTMLAudioElement;

	/** 停止上一次播放的阵亡配音（可重复调用） */
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
	 * 播放指定的一条在线阵亡配音。
	 *
	 * 序号与本地文件名一一对应：`voicesTitle[i]` 就是下载后会写成 `die/{武将名}{i+1}.mp3`
	 * 的那一句（见 `downloadAudio`），所以「单条试听」在在线/本地两种来源下听到的是同一句。
	 *
	 * @param index `voicesTitle` 的下标；缺省随机取一条。显式传入但越界时返回 undefined
	 *   （宁可不播，也不要随机播别的一句）
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

		this.stop();
		const audio = new Audio(url);
		//与引擎自己的 game.playAudio 保持同一换算（volumn_audio 取值范围 0~8）
		audio.volume = lib.config.volumn_audio / 8;
		audio.play();
		this._playing = audio;

		if (!whichWayUtil.config("noTipUseWeb")) {
			whichWayToast.showToast(`[驶舰之向] 正在使用网络!`);
		}

		if (this.autoDownloadAudio) {
			whichWayAudio.downloadAudio("", this.audioBaseName, this.voiceUrl, this.lang, true);
		}

		return audio;
	}
}
