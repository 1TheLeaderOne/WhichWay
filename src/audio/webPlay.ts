import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.ts";
import { whichWayToast } from "../toast/index.ts";

export class whichWayWebPlay {
	/**
	 * 创建webPlay组件
	 * @param {string} skill 配音技能名
	 * @param {string} char 角色名
	 * @param {string[]} [voices] 配音标题
	 */
	constructor(skill: string, char: string, voices: string[] = []) {
		this.skill = skill;
		this.char = char;
		this.voicesTitle = voices.length > 0 ? voices : this.randomGetVoicesTilte();
	}
	/**
	 * PRTS路径
	 */
	resourceUrl: string = `https://torappu.prts.wiki/`;
	skill: string;
	char: string;
	voicesTitle: string[] = [];
	defaultVoicesTitle: string[] = ["选中干员1", "选中干员2", "部署1", "部署2", "作战中1", "作战中2", "作战中3", "作战中4"];

	get useLocalAudio(): boolean {
		return whichWayUtil.config("useLocalAudio") || false;
	}

	get lang(): string {
		return whichWayAudio.getSkillLang(this.skill, this.char);
	}

	get voiceUrl(): string[] {
		return this.voicesTitle.map(title => whichWayAudio.compileVoicePath(this.char, this.lang, title));
	}

	get autoDownloadAudio():boolean {
		return whichWayUtil.config("autoDownloadAudio") || false;
	}

	play(): HTMLAudioElement {
		const audio = new Audio(this.voiceUrl.randomGet());
		audio.play();

		if (!whichWayUtil.config("noTipUseWeb")) {
			whichWayToast.showToast(`[驶舰之向] 正在使用网络!`);
		}

		if(this.autoDownloadAudio){
			whichWayAudio.downloadAudio(this.skill,this.char,this.voiceUrl,this.lang);
		}

		return audio;
	}

	randomGetVoicesTilte(): string[] {
		const audioConfig = window.whichWaySave.audioConfig;
		if (audioConfig.onlineVoicesTitle[this.skill]) return audioConfig.onlineVoicesTitle[this.skill];
		let titles = this.defaultVoicesTitle.randomGets(2);
		audioConfig.onlineVoicesTitle[this.skill] = titles;
		return titles;
	}
}
