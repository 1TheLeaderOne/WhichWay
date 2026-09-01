import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("shijunzhemrfz", { pack: "legendSJZX",
			sex: "female",
			group: "xumrfz",
			hp: 4,
			skills: ["fengyanmrfz","weimingmrfz"],
		});

skill({
	"fengyanmrfz": {
			onremove(player) {
				for (let i of game.players) {
					i.removeSkill("xingxingmrfz");
					i.unmarkSkill("xingxingmrfz");
				}
				game.broadcastAll(function () {
					whichWayUtil.setBgI();
				});
			},
			audio: 2,
			derivation: ["xingxingmrfz"],
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				return player.countCards("he", card => get.type(card) != "basic") > 0;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCardTarget({
						prompt: "是否发动【烽烟】？",
						prompt2: "你可以弃置一张非基本牌并选择至多三名角色，令其获得【行刑】",
						filterCard(card) {
							return get.type(card) != "basic";
						},
						filterTarget: true,
						selectTarget: [1, 3],
						position: "he",
						ai1(card) {
							return 8 - get.value(card);
						},
						ai2(target) {
							let player = get.player();
							return get.attitude(player, target) > 0;
						},
					})
					.forResult();
				event.result.cost_data = {
					cards: event.result.cards,
					targets: event.result.targets,
				};
			},
			async content(event, trigger, player) {
				const { cards, targets } = event.cost_data;
				await player.discard(cards);
				for (let target of targets) {
					target.addSkill("xingxingmrfz");
				}
				player.addTempSkill("fengyanmrfz_expire", { player: "phaseUseBegin" });
				game.broadcastAll(function () {
					ui.background.setBackgroundImage("extension/WhichWay/image/skill/fengyanmrfz.jpg");
				});
			},
			subSkill: {
				expire: {
					charlotte: true,
					silent:true,
					forceDie:true,
					onremove(player) {
						for (let i of game.players) {
							i.removeSkill("xingxingmrfz");
							i.unmarkSkill("xingxingmrfz");
						}
						game.broadcastAll(function () {
							whichWayUtil.setBgI();
						});
					},
				},
			},
		},
	"xingxingmrfz": {
			global: "xingxingmrfz_effect",
			audio: 2,
			direct: true,
			trigger: { global: "phaseEnd" },
			mark:true,
			intro:{
				content:"“我将杀死冠冕”",
			},
			filter(event, player) {
				return event.player && event.player.isIn() && !event.player.hasSkill("xingxingmrfz");
			},
			async content(event, trigger, player) {
				player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						"【行刑】:是否对" + get.translation(trigger.player) + "使用一张杀？"
					)
					.set("logSkill", "xingxingmrfz")
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player);
			},
			subSkill: {
				effect: {
					audio: false,
					forced: true,
					trigger: { player: "damageBegin3" },
					filter(event, player) {
						return !event.source || !event.source.hasSkill("xingxingmrfz");
					},
					async content(event, trigger, player) {
						player.logSkill("xingxingmrfz");
						const { color } = await player
							.judge(function (card) {
								var color = get.color(card);
								if (color == "black") return -4;
								return 0;
							})
							.forResult();
						if (color !== "black") trigger.cancel();
					},
				},
			},
		},
	"weimingmrfz": {
			mod: {
				targetEnabled(card, player, target) {
					if (!player.getEquip(1) && get.tag(card, "damage") && get.type(card) === "trick") return false;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return (
					event.card &&
					(get.type(event.card) == "trick" ||
						(get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
					game.hasPlayer(function (current) {
						return current != player && !current.getEquip(2);
					})
				);
			},
			content() {
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player && !current.getEquip(2);
					})
				);
			},
			group: ["weimingmrfz_get"],
			subSkill: {
				get: {
					audio: "weimingmrfz",
					forced: true,
					trigger: { source: "damageEnd" },
					filter(event, player) {
						return (
							event.player &&
							event.player.isIn() &&
							event.player.countCards("he") > 0 &&
							!event.player.getEquip(3) &&
							!event.player.getEquip(4)
						);
					},
					async content(event, trigger, player) {
						const { cards } = await trigger.player
							.chooseCard("he", true)
							.set("prompt", `请交给${get.translation(player)}一张牌`)
							.set("ai", card => -get.value(card))
							.forResult();
						if (!cards) return;
						player.gain(cards);
					},
				},
			},
		},
});

translate({
	"shijunzhemrfz": "弑君者",
	"fengyanmrfz": "烽烟",
	"fengyanmrfz_info": "出牌阶段开始时，你可以弃置一张非基本牌，并令至多3名角色获得【行刑】直到你的下个出牌阶段。",
	"xingxingmrfz": "行刑",
	"xingxingmrfz_info": "锁定技。①所有没有此技能的角色造成伤害时，进行判定，若不为黑色，此伤害取消之。②任意回合结束后，若当前回合角色没有此技能，你可以对其使用一张【杀】。",
	"weimingmrfz": "威名",
	"weimingmrfz_info": "锁定技，防具栏为空的角色不能响应你使用的牌；坐骑栏为空的角色受到你的伤害后须交给你一张牌；武器栏为空的角色使用伤害类锦囊牌不能指定你为目标。",
});

characterTitle("shijunzhemrfz", "<font color='#d2691e'>尘烟蔽目</font>");

characterIntro("shijunzhemrfz", "弑君者，柳德米拉·伊里尼奇娜，原整合运动干部，从事潜伏活动与突袭暗杀行动，擅长近身攻击及突破防御阵线进行奇袭，于切尔诺伯格-龙门事件之后脱离整合运动，1100年末主动与罗德岛接洽，现正在监督下接受矿石病治疗。");
