import characterName from "./characterName.js";
import dynamicTranslate from "./dynamicTranslate.js";
import groupTranslate from "./groupTranslate.js";
import otherTranslate from "./otherTranslate.js";
import skillsTranslate from "./skillsTranslate.js";
import characterIntro from "./characterIntro.js";
import characterTitle from "./characterTitle.js";
import { lib, game, ui, get, ai, _status } from "noname";

let copyCharacterName = {...characterName};

for(let name in copyCharacterName){
	if(name.endsWith("_prefix")) {
		setNamePrefix(copyCharacterName[name]);
		copyCharacterName[name] = copyCharacterName[name].name || copyCharacterName[name];
	}
}

const translates = {
	...copyCharacterName,
  ...groupTranslate,
  ...otherTranslate,
  ...skillsTranslate,
}

const otherTranslates = {
	characterIntro:characterIntro,
	characterTitle:characterTitle,
	dynamicTranslate:dynamicTranslate,
}

export const whichWayTranslate = {
	otherTranslates,
	translates,
};

function setNamePrefix(obj){
	const layout = {
		amiya:{
			color: "#191970",
			nature: "woodmm",
		}
	}

	const defaultColor = {
		color: "#00FFFF",
		nature: "woodmm",
	}
	if(typeof obj === "string"){
		obj = {
			name: obj,
			...defaultColor,
		}
	}
	if(layout[obj.layout]){
		obj = {
			name: obj.name,
			...layout[obj.layout],
		}
	}
	lib.namePrefix.set(obj.name, {
		color: obj.color,
		nature: obj.nature,
	});
}
