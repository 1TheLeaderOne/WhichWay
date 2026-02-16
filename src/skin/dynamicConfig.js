import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";

const sjzxDycPath = {
	bg: `../../../WhichWay/dynamicSkin/background/{xxx}.png`,
	illust: `../../../WhichWay/dynamicSkin/illust/{xxx}/{yyy}/{zzz}`,
};

function sjzxDycInit(dyc) {
	for (let char in dyc) {
		const character = dyc[char];
		for (let key in character) {
			const illust = character[key];
			if (illust.background) {
				illust.background = sjzxDycPath.bg.replace("{xxx}", illust.background);
			}
			if (illust.name) {
				illust.name = sjzxDycPath.illust.replace("{xxx}", char).replace("{yyy}", key).replace("{zzz}", illust.name);
			}
			if (illust.alpha === undefined) illust.alpha = true;
			if (illust.speed === undefined) illust.speed = 1.5;
			if (!Array.isArray(illust.x)) illust.x = [0, 0];
			if (!Array.isArray(illust.y)) illust.y = [0, 0];
			if (illust.scale === undefined) illust.scale = 0;
			if (illust.action === undefined) illust.action = "Idle";
			if (illust.version === undefined) illust.version = "3.8";
			if (illust.weighting === undefined) {
				illust.weighting = [8];
				let actions = Array.isArray(illust.action) ? illust.action : [illust.action];
				if (illust.action.length > 1) {
					let avg = 2 / (actions.length - 1);
					for (let i = 0; i < actions.length - 1; i++) {
						illust.weighting.push(avg);
					}
				} else illust.weighting = [1];
			}
			for (let effectKey in illust) {
				const effect = illust[effectKey];
				if (!get.is.object(effect)) continue;
				if (window.whichWaySave.dycOtherEffect !== true) {
					delete dyc[char][key][effectKey];
					continue;
				}
				if (effect.name) {
					effect.name = sjzxDycPath.illust.replace("{xxx}", char).replace("{yyy}", key).replace("{zzz}", effect.name);
				} else effect.name = illust.name;
				if (effect.alpha === undefined) effect.alpha = false;
				if (effect.speed === undefined) effect.speed = 1.5;
				if (!Array.isArray(effect.x)) effect.x = [0, 0];
				if (!Array.isArray(effect.y)) effect.y = [0, 0];
				if (effect.scale === undefined) effect.scale = 0;
				if (effect.version === undefined) effect.version = "3.8";
				if (effectKey === "gongji" && effect.action === undefined) effect.action = "Special";
				if (effectKey === "chuchang" && effect.action === undefined) effect.action = "Interact";
				if (effectKey === "teshu" && effect.action === undefined) effect.action = "Special";
				if (effect.weighting === undefined) {
					effect.weighting = [8];
					let actions = Array.isArray(effect.action) ? effect.action : [effect.action];
					if (effect.action.length > 1) {
						let avg = 2 / (actions.length - 1);
						for (let i = 0; i < actions.length - 1; i++) {
							effect.weighting.push(avg);
						}
					} else effect.weighting = [1];
				}
			}
		}
	}
	return dyc;
}

let data = {
    //近卫阿米娅 
	spamiyamrfz: {
		于万千宇宙之中:{
			name:'dyn_illust_char_1001_amiya2_sale16',
			x: [0,0.235],
			y: [0,-1.841],
			scale: 0.36,
			version:'3.8',
			action:["Idle","Special","Interact"],
			speed:1,
			alpha: false,
			background: `场景_庆典`,
		},
		于万千宇宙之中2:{
			name:'sp_dyn_illust_char_1001_amiya2_sale16',
			x: [0,0.438],
			y: [0,-1.663],
			scale: 0.32,
			version:'3.8',
			action:["Idle","Special","Interact"],
			speed:1,
			alpha: false,
			json: true,
			background: `场景_庆典`,
		},
	},

	//异客
	kamimrfz: {
		今昔须臾之梦: {
			name: "dyn_illust_char_472_pasngr_epoque17",
			x: [0, 0.2],
			y: [0, -1.91],
			scale: 0.38,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `废墟`,
		},
	},

	//凯尔希
	kaierximrfz: {
		残余: {
			name: "dyn_illust_char_003_kalts_boc6",
			x: [0, 0.52],
			y: [0, -1.33],
			scale: 0.4,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `废墟`,
		},
		时遗:{
			name:'dyn_illust_char_003_kalts_sale14',
			x:[0,0.26],
			y:[0,-1.03],
			scale:0.40,
			version:'3.8',
			action:["Idle","Special","Interact"],
			speed:1,
			alpha: false,
			background: `废墟`,
		},
		时遗2:{
			name:'sp_dyn_illust_char_003_kalts_sale14_2',
			x:[0,0.52],
			y:[0,-1.03],
			scale:0.20,
			version:'3.8',
			action:["Idle","Special","Interact"],
			speed:1,
			alpha: false,
			background: `废墟`,
		},
	},

	// 纯烬艾雅法拉 纯爱
	spxiaoyangmrfz: {
		经典形象: {
			name: "dyn_illust_char_1016_agoat2",
			x: [0, 0.35],
			y: [0, -1.41],
			scale: 0.41,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `火山旅梦`,
		},
		远行前的野餐: {
			name: "dyn_illust_char_1016_agoat2_epoque34",
			x: [0, 0.6],
			y: [0, -1.66],
			scale: 0.41,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			json: true,
			background: `火山旅梦`,
		},
	},

	// 缪尔赛思
	miumiumrfz: {
		经典形象: {
			name: "dyn_illust_char_249_mlyss",
			x: [0, -0.03],
			y: [0, -1.36],
			scale: 0.32,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `孤星`,
		},
		新枝: {
			name: "dyn_illust_char_249_mlyss_boc",
			x: [0, 0.56],
			y: [0, -1.26],
			scale: 0.27,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `孤星`,
		},
		漫步于黄金之梦: {
			name: "dyn_illust_char_249_mlyss_ambienceSynesthesia6",
			x: [0, 0.56],
			y: [0, -1.26],
			scale: 0.27,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `孤星`,
		},
	},

	//老鲤
	laolimrfz: {
		手到牌来: {
			name: "dyn_illust_char_322_lmlee_witch3",
			x: [0, 0.43],
			y: [0, -0.67],
			scale: 0.29,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `default`,
		},
	},

	//空弦
	kongxianmrfz: {
		至虔者荣光: {
			name: "dyn_illust_char_332_archet_sale14",
			x: [0, 0.59],
			y: [0, -0.9],
			scale: 0.33,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `拉特兰`,
		},
	},

	//傀影
	kuiyingmrfz: {
		焦点: {
			name: "dyn_illust_char_250_phatom_sale4",
			x: [0, 0.53],
			y: [0, -1.7],
			scale: 0.29,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `揭幕者们`,
		},
	},

	//水月
	shuiyuemrfz: {
		夏日餮宴: {
			name: "dyn_illust_char_437_mizuki_sale7",
			x: [0, 0.57],
			y: [0, -1.44],
			scale: 0.38,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `海滩`,
		},
	},

	// 迷迭香
	midiexiangmrfz: {
		经典形象: {
			name: "dyn_illust_char_391_rosmon",
			x: [0, 0.78],
			y: [0, -0.49],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			alpha: false,
			speed: 1,
			background: `花圃`,
		},
		拥抱新生: {
			name: "dyn_illust_char_391_rosmon_epoque17",
			x: [0, 0.73],
			y: [0, -0.82],
			scale: 0.28,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `废墟`,
		},
		轻盈一梦: {
			name: "dyn_illust_char_391_rosmon_sale16",
			x: [0, 0.73],
			y: [0, -0.82],
			scale: 0.28,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `场景_庆典`,
		},
	},

	// 黍
	shumrfz: {
		经典形象: {
			name: "dyn_illust_char_2025_shu",
			x: [0, 0.48],
			y: [0, -0.69],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `黍`,
		},
		春日宴: {
			name: "dyn_illust_char_2025_shu_nian11",
			x: [0, 0.48],
			y: [0, -0.69],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `黍`,
		},
	},

	// W w
	wmrfz: {
		经典形象: {
			name: "dyn_illust_char_113_cqbw",
			x: [0, 0.59],
			y: [0, -0.7],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `生于黑夜`,
		},
		恍惚: {
			name: "dyn_illust_char_113_cqbw_epoque7",
			x: [0, 0.94],
			y: [0, -0.61],
			scale: 0.24,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `生于黑夜`,
		},
	},

	// 塑心
	suxinmrfz: {
		经典形象: {
			name: "dyn_illust_char_245_cello",
			x: [0, 0.58],
			y: [0, -0.51],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `崔林特尔梅之金`,
		},
		无唯我识: {
			name: "dyn_illust_char_245_cello_sale12",
			x: [0, 0.39],
			y: [0, -2.03],
			scale: 0.42,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `崔林特尔梅之金`,
		},
	},

	// 浊心斯卡蒂
	spsikadimrfz: {
		经典形象: {
			name: "dyn_illust_char_1012_skadi2",
			x: [0, 0.48],
			y: [0, -0.48],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `生路`,
		},
		升华: {
			name: "dyn_illust_char_1012_skadi2_boc4",
			x: [0, 0.51],
			y: [0, -0.41],
			scale: 0.23,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `生路`,
		},
		红女爵: {
			name: "dyn_illust_char_1012_skadi2_iteration2",
			x: [0, 0.58],
			y: [0, -0.83],
			scale: 0.27,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `生路`,
		},
	},

	//焰影苇草
	spweicaomrfz: {
		博物: {
			name: "dyn_illust_char_1020_reed2_epoque30",
			x: [0, 0.36],
			y: [0, -1.36],
			scale: 0.41,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `default`,
		},
		夏卉: {
			name: "dyn_illust_char_1020_reed2_summer17",
			x: [0, -0.08],
			y: [0, -1.34],
			scale: 0.47,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			json: true,
			background: `海滩`,
		},
	},

	// 耀骑士临光
	splinguangmrfz: {
		经典形象: {
			name: "dyn_illust_char_1014_nearl2",
			x: [0, 0.93],
			y: [0, -0.62],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `长夜临光`,
		},
		复现荣光: {
			name: "dyn_illust_char_1014_nearl2_epoque17",
			x: [0, 0.36],
			y: [0, -1.33],
			scale: 0.28,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `长夜临光`,
		},
	},

	// 归溟幽灵鲨
	spyoulingshamrfz: {
		经典形象: {
			name: "dyn_illust_char_1023_ghost2",
			x: [0, 0.48],
			y: [0, -0.48],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `生路`,
		},
		生而为一: {
			name: "dyn_illust_char_1023_ghost2_boc6",
			x: [0, 0.02],
			y: [0, -1.79],
			scale: 0.35,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `长夜临光`,
		},
	},

	// 百炼嘉维尔
	spjiaweiermrfz: {
		经典形象: {
			name: "dyn_illust_char_1026_gvial2",
			x: [0, 0.78],
			y: [0, -0.76],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `理想城`,
		},
		悠然假日: {
			name: "dyn_illust_char_1026_gvial2_summer12",
			x: [0, 0.31],
			y: [0, -0.66],
			scale: 0.26,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `理想城`,
		},
	},

	//银灰
	yinhuimrfz: {
		不融冰: {
			name: "dyn_illust_char_172_svrash_ambienceSynesthesia4",
			x: [0, 0.41],
			y: [0, -0.65],
			scale: 0.22,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `喀兰`,
		},
	},

	//夜莺
	yeyingmrfz: {
		流辉: {
			name: "dyn_illust_char_179_cgbird_sightseer1",
			x: [0, 0.94],
			y: [0, -0.75],
			scale: 0.26,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `长夜临光`,
		},
	},

	// 缄默德克萨斯 德狗
	spdegoumrfz: {
		经典形象: {
			name: "dyn_illust_char_1028_texas2",
			x: [0, 0.51],
			y: [0, -0.24],
			scale: 0.4,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `生路`,
		},
		幽兰秘辛: {
			name: "dyn_illust_char_1028_texas2_epoque36",
			x: [0, 0.31],
			y: [0, -0.97],
			scale: 0.26,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `叙拉古人`,
		},
		破翼者: {
			name: "dyn_illust_char_1028_texas2_iteration1",
			x: [0, 0.57],
			y: [0, -2.64],
			scale: 0.5,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			background: `叙拉古人`,
		},
	},

	// 维什戴尔
	weishidaiermrfz: {
		经典形象: {
			name: "dyn_illust_char_1035_wisdel",
			x: [0, 0.49],
			y: [0, -0.6],
			scale: 0.26,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `花圃`,
		},
		超新星: {
			name: "dyn_illust_char_1035_wisdel_sale14",
			x: [0, 0.53],
			y: [0, -0.69],
			scale: 0.31,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `废墟`,
		},
	},

	// 年
	nianmrfz: {
		经典形象: {
			name: "dyn_illust_char_2014_nian2",
			x: [0, 0.48],
			y: [0, -0.48],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		霹雳导演: {
			name: "dyn_illust_char_2014_nian_cfa1",
			x: [0, 0.48],
			y: [0, -0.48],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		乐逍遥: {
			name: "dyn_illust_char_2014_nian_nian4",
			x: [0, 0.41],
			y: [0, -0.31],
			scale: 0.25,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
	},

	// 夕
	xigymrfz: {
		经典形象: {
			name: "dyn_illust_char_2015_dusk",
			x: [0, 0.56],
			y: [0, -1.26],
			scale: 0.26,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		染尘烟: {
			name: "rcy",
			x: [0, 0.49],
			y: [0, -1.06],
			scale: 0.2,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
	},

	// 令
	lingmrfz: {
		经典形象: {
			name: "dyn_illust_char_2023_ling",
			x: [0, 0.58],
			y: [0, -1.24],
			scale: 0.28,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		崖高梦远: {
			name: "ling2",
			x: [0, 0.47],
			y: [0, -2.01],
			scale: 0.41,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		濯缨: {
			name: "ling3",
			x: [0, 0.77],
			y: [0, -1.32],
			scale: 0.31,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
	},

	// 重岳
	chongyuemrfz: {
		经典形象: {
			name: "dyn_illust_char_2024_chyue",
			x: [0, 0.5],
			y: [0, -1.01],
			scale: 0.24,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		全能演员: {
			name: "chongyue2",
			x: [0, 0.47],
			y: [0, -0.79],
			scale: 0.24,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
		何处栖: {
			name: "chongyue3",
			x: [0, 0.49],
			y: [0, -1.68],
			scale: 0.36,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
	},

	// 荒芜拉普兰德
	splapulandemrfz: {
		经典形象: {
			name: "dyn_illust_char_1038_whitw2",
			x: [0, 0.51],
			y: [0, -0.6],
			scale: 0.35,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `揭幕者们`,
		},
		无序的谦卑: {
			name: "dyn_illust_char_1038_whitw2_sale15",
			x: [0, 0.45],
			y: [0, -0.94],
			scale: 0.36,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `揭幕者们`,
		},
	},

	//维多利亚 维纳
	spweinamrfz: {
		光耀之途: {
			name: "dyn_illust_char_1019_siege2_epoque50",
			x: [0, 0.58],
			y: [0, -1.12],
			scale: 0.28,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `叙拉古人`,
		},
	},

	//凛御银灰
	spyinhuimrfz: {
		经典形象: {
			name: "dyn_illust_char_1045_svash2",
			x: [0, 0.55],
			y: [0, -2.36],
			scale: 0.48,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `喀兰`,
		},
	},

	//魔王
	mowangmrfz: {
		追悼: {
			name: "dyn_illust_char_4134_cetsyr_epoque50",
			x: [0, 0.33],
			y: [0, -1.23],
			scale: 0.39,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `花圃`,
		},
	},

	// 新约能天使
	spnengtianshimrfz: {
		经典形象: {
			name: "dyn_illust_char_1041_angel2",
			x: [0, 0.35],
			y: [0, -1.87],
			scale: 0.38,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `拉特兰`,
		},
	},

	// 佩佩
	peipeimrfz: {
		经典形象: {
			name: "dyn_illust_char_4058_pepe",
			x: [0, 0.46],
			y: [0, -0.65],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			json: true,
			background: `花圃`,
		},
		星移: {
			name: "peipei_xingyi",
			x: [0, 0.5],
			y: [0, -1.04],
			scale: 0.33,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			json: true,
			background: `花圃`,
		},
	},

	//死芒 爱布拉娜
	aibulanamrfz: {
		夏卉: {
			name: "necras_xiahui",
			x: [0, 0.57],
			y: [0, -1.43],
			scale: 0.4,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
	},

	//引星棘刺 异格棘刺
	spjicimrfz: {
		无际之帆: {
			name: "spjici_wujizhifan",
			x: [0, 0.46],
			y: [0, -1.64],
			scale: 0.41,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
	},

	//斩业星熊
	spxingxiongmrfz: {
		经典形象: {
			name: "spxingxiong_default",
			x: [0, 0.53],
			y: [0, -0.76],
			scale: 0.24,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
	},

	//林
	linmrfz: {
		夏卉: {
			name: "linSummer",
			x: [0, -0.16],
			y: [0, -1.16],
			scale: 0.37,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
		列瑶台: {
			name: "dyn_illust_char_4080_lin_nian10",
			x: [0, 0.5],
			y: [0, -1.35],
			scale: 0.32,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `山顶`,
		},
	},

	//锏
	jianmrfz: {
		暗月的影子: {
			name: "dyn_illust_char_4116_blkkgt_witch5",
			x: [0, 0.47],
			y: [0, -1.46],
			scale: 0.37,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `山顶`,
		},
	},

	//伊内丝
	yineisimrfz: {
		蝶舞华章: {
			name: "dyn_illust_char_4087_ines_ambienceSynesthesia",
			x: [0, 0.6],
			y: [0, -0.06],
			scale: 0.32,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `花圃`,
		},
		燃烧天穹下: {
			name: "dyn_illust_char_4087_ines_boc8",
			x: [0, 0.46],
			y: [0, -1.32],
			scale: 0.36,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `废墟`,
		},
	},

	// 余
	yumrfz: {
		经典形象: {
			name: "dyn_illust_char_2026_yu",
			x: [0, 0.46],
			y: [0, -0.65],
			scale: 0.21,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `岁兽`,
		},
	},

	// 史尔特尔
	semrfz: {
		缤纷奇境: {
			name: "dyn_illust_char_350_surtr_summer9",
			x: [0, 0.29],
			y: [0, -0.81],
			scale: 0.3,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `海滩`,
		},
	},

	// 澄闪
	chengshanmrfz: {
		夏卉: {
			name: "dyn_illust_char_377_gdglow_summer12",
			x: [0, 0.63],
			y: [0, -1.27],
			scale: 0.27,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
	},

	// 水陈 假日威龙陈
	spzzxpmrfz: {
		万重山: {
			name: "dyn_illust_char_1013_chen2_boc6",
			x: [0, 0.62],
			y: [0, -0.88],
			scale: 0.27,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
		悠然假日: {
			name: "shuichen_youyoujiari",
			x: [0, 0.45],
			y: [0, -1.19],
			scale: 0.31,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
		重装芯片: {
			name: "dyn_illust_char_1013_chen2",
			x: [0, 0.66],
			y: [0, -0.77],
			scale: 0.27,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `海滩`,
		},
	},

	// 医疗阿米娅
	medical_amiyamrfz: {
		寰宇独奏: {
			name: "dyn_illust_char_1037_amiya3_sale13",
			x: [0, 0.28],
			y: [0, -1.23],
			scale: 0.28,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `夜空`,
		},
	},

	// 左乐
	zuolemrfz: {
		少年游: {
			name: "dyn_illust_char_4121_zuole_nian11",
			x: [0, 0.77],
			y: [0, -2.04],
			scale: 0.42,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `山顶`,
		},
	},

	//阿斯卡纶
	asikalunmrfz: {
		趋光之暗: {
			name: "asklFixed",
			x: [0, 0.45],
			y: [0, -2.5],
			scale: 0.42,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `生于黑夜`,
		},
	},

	//逻格斯 logos
	luogesimrfz: {
		辉煌的静谧: {
			name: "logos",
			x: [0, 0.19],
			y: [0, -1.11],
			scale: 0.34,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `花圃`,
		},
	},

	// 玛恩纳 叔叔
	maennamrfz: {
		远路: {
			name: "dyn_illust_char_4064_mlynar_epoque28",
			x: [0, 0.28],
			y: [0, -1.34],
			scale: 0.29,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: false,
			background: `花圃`,
		},
	},

	// 圣约送葬人
	spsongzangrenmrfz: {
		众志归一: {
			name: "dyn_illust_char_1032_excu2_sale12",
			x: [0, 0.55],
			y: [0, -1.03],
			scale: 0.32,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `拉特兰`,
		},
	},

	// 鸿雪
	hongxuemrfz: {
		字句中的雪原: {
			name: "hongxue",
			x: [0, 0.58],
			y: [0, -0.46],
			scale: 0.29,
			version: "3.8",
			action: ["Idle", "Special", "Interact"],
			speed: 1,
			alpha: true,
			background: `喀兰`,
		},
	},
	
	//隐德来希
	yindelaiximrfz: {
		耀目之蓝:{
			name:'dyn_illust_char_4010_etlchi_winter5',
			x: [0,0.593],
			y: [0,-0.746],
			scale: 0.25,
			version:'3.8',
			action:["Idle","Special","Interact"],
			speed:1,
			alpha: false,
			background: `场景_庆典`,
		},
	},
};

data = sjzxDycInit(data);

window.whichWaySave.dycSave.assets = data;

export const sjzxDycAssets = data;
