import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("Castle3mrfz", { pack: "mediocreSJZX",
			hp: 4,
			group: "luomrfz",
			sex: "male",
			skills: ["xunrongmrfz", "chongcimrfz"],
		});

skill({
	"xunrongmrfz": {
			audio: ["作战中3", "作战中4"],
			forced: true,
			mod: {
				cardUsable(card, player, num) {
					if (card.name === "sha") return (num += game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length);
				},
			},
			mark: true,
			intro: {
				content(_, player) {
					return `·额定摸牌数和出牌阶段使用【杀】的次数+${game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length}`;
				},
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter(event, player) {
				return game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length > 0 && !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num += game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length;
			},
		},
	"chongcimrfz": {
			audio: ["作战中1", "作战中2", "行动开始", "任命队长"],
			forced: true,
			derivation: ["retieji", "yimie"],
			init(player) {
				//@ts-ignore
				game.broadcastAll(function (name) {
					["retieji", "yimie"].forEach(skill => {
						if (!lib.skill[skill].audioname2) lib.skill[skill].audioname2 = {};
						lib.skill[skill].audioname2[name] = "chongcimrfz";
					});
					//@ts-ignore
				}, player.name);
				//@ts-ignore
				lib.skill.chongcimrfz.content(_status.event, null, player);
			},
			trigger: {
				player: ["loseAfter", "gainAfter"],
				global: ["equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			filter(event, player) {
				return (!player.getOriginalSkills().includes("retieji") && player.hasSkill("retieji") !== player.hasEmptySlot(2)) || (!player.getOriginalSkills().includes("yimie") && player.hasSkill("yimie") !== player.hasEmptySlot(3));
			},
			async content(event, trigger, player) {
				if (!player.getOriginalSkills().includes("retieji")) {
					if (player.hasSkill("retieji") && !player.hasEmptySlot(2)) {
						player.removeSkill("retieji");
					} else if (!player.hasSkill("retieji") && player.hasEmptySlot(2)) {
						player.addSkill("retieji");
					}
				}

				if (!player.getOriginalSkills().includes("yimie")) {
					if (player.hasSkill("yimie") && !player.hasEmptySlot(3)) {
						player.removeSkill("yimie");
					} else if (!player.hasSkill("yimie") && player.hasEmptySlot(3)) {
						player.addSkill("yimie");
					}
				}
			},
		},
});

translate({
	"Castle3mrfz": "Castle-3",
	"xunrongmrfz": "勋荣",
	"xunrongmrfz_info": "锁定技，你的额定摸牌数和【杀】的使用次数+X。（X=其他角色因你而进入濒死状态的次数）",
	"chongcimrfz": "冲刺",
	"chongcimrfz_info": "锁定技，当你防具/防御马栏为空时，你视为拥有“铁骑”/“夷灭”。",
});

characterTitle("Castle3mrfz", "<font color = #b7229c66>冲刺！冲刺！</font>");

characterIntro("Castle3mrfz", "Castle-3是可露希尔客制化后的雷神存在者™Plus六轮作业平台。受人喜爱，也是吉祥物一般的存在不过因为性格比较正常所以没有获得那么多关注。<br>Castle-3方方正正的形象给人以坚定可靠的感觉。<br>身上的标记可能代表着杀敌数，但是他自己没有手，所以是谁刻上去的呢？");
