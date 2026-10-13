import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("plot_keluxiermrfz", { pack: "plotSJZX",
			sex: "female",
			group: "bamrfz",
			hp: 4,
			skills: ["fuzhimrfz","kuorongmrfz"],
		});

skill({
	"jingxiangmrfz": {
			audio: 2,
			filter: function (event, player) {
				return false;
			},
			trigger: { player: "pointless" }, //免得十周年ui技能溢出屏幕,这是一个无意义的时机
			viewAs: {
				name: "sha",
				isCard: true,
			},
			limited: true,
			mark: false,
			filterCard: () => false,
			selectCard: -1,
			replaced: false,
			usedSJZX: false,
			async precontent(event, trigger, player) {
				let name = event.name.replace("pre_", "");
				player.awakenSkill(name);
				lib.skill[name].usedSJZX = true;
			},
		},
	"fuzhimrfz": {
			audio: 2,
			trigger: {
				target: "useCardToTargeted",
			},
			filter(event, player) {
				let skills = player.getSkills().filter(skill => {
					if (!skill.startsWith("jingxiangmrfz")) return false;
					let info = get.info(skill);
					return !info.replaced;
				});
				return skills.length > 0 && get.type(event.card) !== "delay" && get.type(event.card) !== "equip";
			},
			prompt(event) {
				//@ts-ignore
				return `是否将一个“镜像”中的‘undefined’替换为‘${get.translation(event.card.name)}’?`;
			},
			check(event, player) {
				let skills = player.getSkills().filter(skill => {
					if (!skill.startsWith("jingxiangmrfz")) return false;
					let info = get.info(skill);
					return info.replaced && !info.usedSJZX;
				});
				let calculate = {};
				skills.forEach(skill => {
					let info = get.info(skill);
					// @ts-ignore
					let viewName = info.viewAs.name;
					if (!calculate[viewName]) calculate[viewName] = 0;
					calculate[viewName]++;
				});
				return calculate[event.card.name] < (get.value(event.card) >= 6 ? 4 : 3);
			},
			async content(event, trigger, player) {
				let name = player.getSkills().filter(skill => {
					if (!skill.startsWith("jingxiangmrfz")) return false;
					let info = get.info(skill);
					return !info.replaced;
				})[0];
				const info = get.info(name);
				info.enable = "chooseToUse";
				info.trigger = undefined;
				info.replaced = true;
				info.audio = "jingxiangmrfz";
				info.viewAs = {
					// @ts-ignore
					...info.viewAs,
					name: trigger.card.name,
					nature: trigger.card.nature,
				};
				info.filter = () => true;
				let cardname =
					(get.translation(trigger.card.nature) ? get.translation(trigger.card.nature) : "") + get.translation(trigger.card.name);
				lib.translate[name] = lib.translate[name] + cardname.slice(0, 2);
				lib.translate[name + "_info"] = lib.translate[name + "_info"].replace("undefined", cardname);
			},
		},
	"kuorongmrfz": {
			audio: 2,
			forced: true,
			derivation: ["jingxiangmrfz", "clanzhongliu"],
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			async content(event, trigger, player) {
				for (let i = 0; i < 15; i++) {
					let name = "jingxiangmrfz" + i;
					let info = {
						...lib.skill.jingxiangmrfz,
					};
					lib.skill[name] = info;
					lib.translate[name] = lib.translate["jingxiangmrfz"];
					lib.translate[name + "_info"] = lib.translate["jingxiangmrfz_info"];
					player.addSkill(name);
				}
				let random = Math.random();
				if (random >= 0.95 || lib.config.lucky_star) {
					player.addSkill("clanzhongliu");
					let info = get.info("clanzhongliu");
					if (!info.audioname2) info.audioname2 = {};
					info.audioname2["keluxiermrfz"] = "clanzhongliu_keluxiermrfz";
					player.addSkill("kuorongmrfz_reset");
				}
			},
			subSkill: {
				reset: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "clanzhongliuAfter",
					},
					async content(event, trigger, player) {
						let skills = player.awakenedSkills.filter(skill => {
							return skill.startsWith("jingxiangmrfz");
						});
						skills.forEach(skill => {
							if (player.awakenedSkills && player.awakenedSkills.includes(skill)) {
								game.log(player, "重置了技能", "#g" + `【${get.translation(skill)}】`);
								player.awakenedSkills.remove(skill);
							}
							if (player.disabledSkills) {
								for (let key in player.disabledSkills) {
									if (key === skill) delete player.disabledSkills[key];
								}
							}
							lib.skill[skill].usedSJZX = false;
						});
					},
				},
			},
		},
});

translate({
	"plot_keluxiermrfz": "可露希尔",
	"plot_keluxiermrfz_prefix": "剧",
	"jingxiangmrfz": "镜像",
	"jingxiangmrfz_info": "限定技，你可以视为使用一张【undefined】。",
	"fuzhimrfz": "复制",
	"fuzhimrfz_info": "当你成为普通锦囊牌或基本牌的目标后，你可以将你的一个“镜像”描述中的“undefined”替换为此牌的牌名。",
	"kuorongmrfz": "扩容",
	"kuorongmrfz_info": "锁定技，游戏开始时，你获得15个“镜像”，然后若你此时足够幸运，你获得【中流】。",
});

characterTitle("plot_keluxiermrfz", "<font color='red'>Ctrl+C && Ctrl+V</font>");

characterIntro("plot_keluxiermrfz", "萨卡兹中的血魔，“巴别塔”组织成员，现罗德岛舰船总工程师，兼任罗德岛采购部负责人一职，与凯尔希关系紧密。权限等级：42，但依旧有未访问或无法访问的罗德岛舰船部分。加入前便是知名黑客，因特蕾西娅寻找人才上门而同意加入巴别塔。巴别塔解体后成为罗德岛建立最初的人员之一，亲手将罗德岛本舰设计改造成如今的状态。自称“42星干员”，偶尔会恶作剧，有一点点贪财，但始终都是值得信赖的罗德岛总工程师。平时总在自己的总控室里做自己想做的事，而她想做的事一般是看电影、玩游戏、写程序。基本不插手罗德岛的运营和政治事务，但并非对这些不了解，她会在自己认为必要的时候做出相应的行动。博士苏醒并从切城回归后带领博士熟悉舰船，后参与进入维多利亚伦蒂尼姆的行动。");
