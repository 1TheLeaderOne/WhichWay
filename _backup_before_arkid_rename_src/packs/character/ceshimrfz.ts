import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("ceshimrfz", { pack: "specialSJZX",
			sex: "female",
			group: "wei",
			hp: 10,
			skills: ["ceshiSkillmrfz"],
			isAiForbidden: true,
		});

skill({
	"ceshiSkillmrfz": {
			audio:false,
			trigger:{player:"drawBegin"},
			async content(event,trigger,player){
				trigger.num *= 2;
				//@ts-ignore
				trigger.gaintag.push("example_tag");
			},
		},
});

translate({
	"ceshimrfz": "测试",
	"ceshiSkillmrfz": "测试",
	"ceshiSkillmrfz_info": "测试喵",
});
