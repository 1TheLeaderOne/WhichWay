import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("kongxianmrfz", {
			sex: "female",
			group: "lamrfz",
			hp: 3,
			hujia: 1,
			skills: ["sanyimrfz","baofengmrfz","tiexianmrfz"],
		});

skill({
	"tiexianmrfz": {
			mod: {
				maxHandcard: function (player, num) {
					if (!player.hujia) return num + 1;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "damageEnd" },
			filter: function (event, player) {
				return event.hujia;
			},
			async content(event, trigger, player) {
				player.draw(3);
			},
			group: ["tiexianmrfz_draw", "tiexianmrfz_k"],
			subSkill: {
				ban: {
					charlotte: true,
				},
				k: {
					mod: {
						cardnumber(card) {
							if (card.hasGaintag("tiexianmrfz")) return 13;
						},
					},
					charlotte: true,
					direct: true,
					trigger: { player: "gainAfter" },
					filter(event, player) {
						return !player.hujia && !player.hasSkill("tiexianmrfz_ban");
					},
					async content(event, trigger, player) {
						player.addTempSkill("tiexianmrfz_ban", {
							global: "roundStart",
						});
						for (var i of trigger.cards) {
							i.addGaintag("tiexianmrfz");
						}
					},
				},
				draw: {
					audio: "tiexianmrfz",
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return !player.hujia;
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
		},
	"sanyimrfz": {
			audio: "lieshimrfz",
			trigger: { player: "useCard2" },
			filter(event, player) {
				if (!event.card) return false;
				if (get.name(event.card) != "sha" || get.number(event.card) == null) return false;
				return event.targets && event.targets.length == 1;
			},
			direct: true,
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget()
					.set("forced", true)
					.set("filterTarget", (card, player, target) => {
						if (target == player || _status.event.targets.includes(target) || !player.canUse(_status.event.cardx, target, false))
							return false;
						var selected = ui.selected.targets,
							base = _status.event.targetx.hp;
						var total = Object.values(selected).reduce((accumulator, currentValue) => {
							if (currentValue["hp"]) {
								return accumulator + currentValue.hp;
							}
							return accumulator;
						}, 0);
						return target.hp + total + base <= _status.event.cardx.number;
					})
					.set("prompt", `【散逸】:你可以额外指定任意名体力值之和不超过${trigger.card.number - trigger.targets[0].hp}的角色`)
					.set("selectTarget", [0, Infinity])
					.set("complexTarget", true)
					.set("ai", target => {
						return get.effect(target, _status.event.cardx, _status.event.player, _status.event.player) > 0;
					})
					.set("targets", trigger.targets)
					.set("targetx", trigger.targets[0])
					.set("cardx", trigger.card)
					.forResult();
				if (!targets) return false;
				for (var i of targets) {
					trigger.targets.push(i);
					player.line(i);
				}
				//@ts-ignore
				player.logSkill("sanyimrfz");
			},
		},
	"baofengmrfz": {
			audio: 2,
			trigger: { source: "damageEnd" },
			filter(event, player) {
				return event.card && get.name(event.card) == "sha" && get.color(event.card) != "none";
			},
			forced: true,
			async content(event, trigger, player) {
				const { bool } = await player
					.chooseUseTarget(
						{
							name: "sha",
							suit: "none",
							number: trigger.card.number,
							nature: trigger.card.nature,
						},
						false,
						false
					)
					.set("prompt", `【追矢】:你可以视为使用一张无色且点数为${trigger.card.number}的${get.translation(trigger.card.nature)}【杀】`)
					.forResult();
				if (!bool) return;
			},
		},
});

translate({
	"kongxianmrfz": "空弦",
	"tiexianmrfz": "铁弦",
	"tiexianmrfz_info": "锁定技，当你受到伤害后，若你的护甲因此减少，你摸三张牌；当你没有护甲时，你的手牌上限和摸牌阶段额定摸牌数+1，且每轮第一次获得牌的点数均视为K。",
	"sanyimrfz": "散逸",
	"sanyimrfz_info": "锁定技，当你使用的单一目标的【杀】选择目标后，你额外选择任意名体力值之和（包含已经成为此杀目标的角色的体力值）不大于此杀的点数的其他角色成为此杀的目标（无距离限制）。",
	"baofengmrfz": "追矢",
	"baofengmrfz_info": "当你使用的有色【杀】造成伤害后，你可以视为使用一张点数与此牌相同的无色【杀】（不计入次数限制）。",
});

characterIntro("kongxianmrfz", "设计：今天整点什么、林登万<br>空弦，来自兰登修道院的修士，本名席德佳。出于某些商业合作目的暂留罗德岛，并积极提出各项合作条款，敦促双方展开友好商业来往。同时在各项行动中均展现出极优秀的作战技巧，经本人要求，现作为罗德岛狙击干员活跃于各项任务中。");
