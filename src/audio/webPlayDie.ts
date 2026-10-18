import { lib } from "noname";
import { whichWayToast } from "../toast/index.ts";
import { whichWayUtil } from "../utill.js";
import { whichWayAudio } from "./index.ts";

export class whichWayWebPlayDie {
	constructor(char: WhichWayCharacter) {
		this.that = char.whichWay;
	}
	that: WhichWayCharConfig;
    voicesTitle: string[] = ["行动失败"];
	get useLocalAudio(): boolean {
		return whichWayUtil.config("useLocalAudio") || false;
	}

	get lang(): string {
		return whichWayAudio.getCharacterLang(this.that.charId);
	}

	get voiceUrl(): string[] {
		return this.voicesTitle.map(title => whichWayAudio.compileVoicePath(this.that.charId, this.lang, title));
	}

    play():HTMLAudioElement {
        const audio = new Audio(this.voiceUrl.randomGet());
        //与引擎自己的 game.playAudio 保持同一换算（volumn_audio 取值范围 0~8）
        audio.volume = lib.config.volumn_audio / 8;
        audio.play();

        if(!whichWayUtil.config("noTipUseWeb")){
            whichWayToast.showToast(`[驶舰之向] 正在使用网络!`);
        }

        return audio;
    }
}
