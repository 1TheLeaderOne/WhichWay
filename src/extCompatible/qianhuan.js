import { lib, game, ui, get, ai, _status } from "noname";

// 来自随笔录

//@ts-ignore
if(!lib.qhlypkg){
	//@ts-ignore
	lib.qhlypkg=[];
}

const config = {
	isExt:true,
	filterCharacter:function(name){
		return window.whichWaySave.allCharacters.includes(name);
	},
	characterNameTranslate:function(name){
		return get.translation(name);
	},
	prefix:'extension/WhichWay/image/character/',
	skin:{
		standard:'extension/WhichWay/image/skin/',
	},
}

//@ts-ignore
lib.qhlypkg.push(config)

export const qianhuanSetting = config;