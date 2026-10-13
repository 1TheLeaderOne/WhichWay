import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("liumingmrfz", { pack: "legendSJZX",
			sex: "male",
			group: "yimrfz",
			hp: 4,
			skills: ["fanyuanmrfz","yingjimrfz","new_weiguangmrfz"],
		});

skill({
	"fanyuanmrfz": {
			intro: {
				name: "凡人之愿",
				content: "“直到灯火明亮”",
			},
			audio: 2,
			trigger: { global: "useCardToTargeted" },
			filter: function (event, player) {
				//@ts-ignore
				if (get.type(event.card) != "delay") return false;
				return game.hasPlayer(function (current) {
					return current.hasMark("fanyuanmrfz");
				});
			},
			direct: true,
			async content(event, trigger, player) {
				//@ts-ignore
				player.logSkill("fanyuanmrfz");
			},
			global: "fanyuanmrfz_eff",
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					filter: function (event, player) {
						return player.hasMark("fanyuanmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("fanyuanmrfz", 1, false);
					},
					mod: {
						targetEnabled: function (card, player, target) {
							if (get.type(card) == "delay" && target.hasMark("fanyuanmrfz")) return false;
						},
					},
				},
			},
		},
	"new_weiguangmrfz": {
			mark: true,
			intro: {
				name: "灯火不灭",
				content: function (event, player) {
					return "剩余次数:" + (5 - player.countMark("new_weiguangmrfz"));
				},
			},
			audio: 4,
			trigger: {
				global: ["turnOverAfter", "linkAfter", "addJudgeBefore"],
			},
			filter: function (event, player) {
				if (player.countMark("new_weiguangmrfz") > 4) return false;
				if (event.name == "link") return event.player.isLinked();
				if (event.name == "turnOver") return event.player.isTurnedOver();
				return event.name == "addJudge";
			},
			prompt: function (event, player) {
				return "是否对" + get.translation(event.player) + "发动【微光】(" + (5 - player.countMark("new_weiguangmrfz")) + "/5)？";
			},
			check: function (event, player) {
				var att = get.attitude(player, event.player);
				if (event.player.hasSkill("xinfu_limu") && att > 2 && event.name == "addJudge" && event.player.isPhaseUsing()) return false;
				if (event.player.hasSkill("xinfu_limu") && att < 0 && event.name == "addJudge" && event.player.isPhaseUsing()) return true;
				return att > 2;
			},
			async content(event, trigger, player) {
				const target = trigger.player;

				// step 0
				player.addMark("new_weiguangmrfz", 1, false);
				if (!target.hasMark("fanyuanmrfz")) {
					target.addMark("fanyuanmrfz", 1, false);
				}

				// step 1
				let num = 3;
				if (target.isLinked()) {
					target.link(false);
					num--;
				}
				if (target.isTurnedOver()) {
					target.turnOver(false);
					num--;
				}
				if (trigger.name === "addJudge" || target.countCards("j") > 0) {
					if (trigger.name === "addJudge") {
						trigger.cancel();
						//@ts-ignore
						const owner = get.owner(trigger.card);
						//@ts-ignore
						if (owner && owner.getCards("hej").includes(trigger.card)) {
							await owner.lose(trigger.card, ui.discardPile);
						} else {
							//@ts-ignore
							game.cardsDiscard(trigger.card);
						}
						game.log(trigger.card, "进入了弃牌堆");
					}
					await target.chooseToDiscard(true, "j", target.countCards("j"));
					num--;
				}
				await target.draw(num);
			},
			group: "new_weiguangmrfz_rem",
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.countMark("new_weiguangmrfz") > 0;
					},
					async content(event, trigger, player) {
						player.removeMark("new_weiguangmrfz", player.countMark("new_weiguangmrfz"), false);
					},
				},
			},
		},
	"yingjimrfz": {
			audio: 2,
			trigger: { global: "useCardToTarget" },
			filter: function (event, player) {
				if (event.target == player) return false;
				if (event.targets.length > 1) return false;
				//@ts-ignore
				return get.type(event.card) == "delay" && !player.hasMark("yingjimrfz");
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.target) + "回复一点体力并摸一张牌";
			},
			check: function (event, player) {
				return get.attitude(player, event.target) > 2;
			},
			async content(event, trigger, player) {
				trigger.targets[0].recover();
				trigger.targets[0].draw();
				player.addMark("yingjimrfz", 1, false);
			},
			group: "yingjimrfz_rem",
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					filter: function (event, player) {
						return player.hasMark("yingjimrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("yingjimrfz", 1, false);
					},
				},
			},
		},
});

translate({
	"liumingmrfz": "流明",
	"fanyuanmrfz": "凡愿",
	"fanyuanmrfz_info": "锁定技，本轮成为过【微光】目标的角色不能成为延时锦囊的目标。",
	"new_weiguangmrfz": "微光",
	"new_weiguangmrfz_info": "每轮限五次，当有角色被横置、武将牌翻至背面朝上或成为延时锦囊的目标后，你可以令其执行满足条件的下列选项：1.被横置：解除横置状态；2.武将牌背面朝上：将武将牌翻面；3.成为延时锦囊的目标：取消之并弃置判定区内所有的牌。然后其摸X张牌。(X=没有执行的选项数)",
	"yingjimrfz": "应急",
	"yingjimrfz_info": "每轮限一次，其他角色成为延时锦囊牌的唯一目标时，你可以令其恢复一点体力并摸一张牌。",
});

characterIntro("liumingmrfz", "流明，经由极境以及凯尔希引荐，现作为罗德岛驻伊比利亚干员，协助罗德岛执行伊比利亚地区感染者的医疗救护工作。同时，流明也会列席罗德岛、阿戈尔、审判庭三方的一系列会议，基于自己的视角提出建议，与各方一起寻找一种协同合作、面对未来的可能。");
