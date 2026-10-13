import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("yanweimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "hongmrfz",
			hp: 4,
			skills: ["fengjianmrfz","hongsongmrfz"],
		});

skill({
	"fengjianmrfz": {
			intro: {
				content: "当你使用下一张非的【闪】基本牌后，你可以视为使用一张相同的基本牌。",
			},
			audio: 2,
			trigger: { player: ["respond", "useCardAfter"] },
			forced: true,
			firstDo: true,
			filter: function (event, player) {
				if (!event.respondTo) return false;
				return !player.hasMark("fengjianmrfz");
			},
			async content(event, trigger, player) {
				player.addMark("fengjianmrfz");
			},
			group: "fengjianmrfz_use",
			subSkill: {
				use: {
					trigger: { player: "useCardAfter" },
					forced: true,
					firstDo: true,
					filter: function (event, player) {
						if (event.card.name == "shan") return false;
						//@ts-ignore
						return player.hasMark("fengjianmrfz") && get.type(event.card) == "basic";
					},
					async content(event, trigger, player) {
						var cards = trigger.card;
						player.removeMark("fengjianmrfz");
						if ((cards.name == "tao" && player.getDamagedHp() > 0) || cards.name != "shan") {
							player.chooseUseTarget(cards, false, get.prompt2("fengjianmrfz"), "你可以使用一张" + get.translation(cards));
							//@ts-ignore
							player.logSkill("fengjianmrfz");
						}
					},
				},
			},
		},
	"hongsongmrfz": {
			intro: {
				content:
					"你有#个‘红松’标记</br>·有‘红松’标记的角色需要使用或打出闪时可以进行判定，若不为♥，视为使用一张【闪】并获得此判定牌，然后移除一个‘红松’标记。",
			},
			onremove: true,
			audio: 2,
			trigger: { player: ["respond", "useCardAfter"] },
			forced: true,
			filter: function (event, player) {
				var num = 0;
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].hasMark("hongsongmrfz")) num += game.players[i].countMark("hongsongmrfz");
				}
				if (!event.respondTo) return false;
				return num < 3;
			},
			async content(event, trigger, player) {
				player.addMark("hongsongmrfz");
			},
			group: ["hongsongmrfz_shan", "hongsongmrfz_give"],
			subSkill: {
				shan: {
					audio: "hongsongmrfz",
					trigger: {
						global: ["chooseToRespondBegin", "chooseToUseBegin"],
					},
					filter: function (event, player) {
						if (event.responded) return false;
						if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) return false;
						if (event.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) return false;
						if (event.player != player && !event.player.hasMark("hongsongmrfz")) return false;
						return true;
					},
					forced: true,
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await trigger.player
							.chooseControl("确定", "取消")
							.set("prompt", get.prompt("hongsongmrfz"))
							.set("prompt2", "你可以进行判定，若不为♥，其视为使用或打出一张【闪】并获得判定牌")
							.forResult();

						// step 1
						if (result.control === "确定") {
							const next = trigger.player
								.judge(card => {
									return get.suit(card) === "heart" ? -0.5 : 1.5;
								})
								.set("callback", lib.skill.hongsongmrfz_shan.callback);
							next.judge2 = result => {
								return result.bool;
							};
							result = await next.forResult();
						} else {
							return;
						}

						// step 2
						if (result.judge > 0) {
							trigger.untrigger();
							trigger.set("responded", true);
							trigger.result = {
								bool: true,
								card: { name: "shan", isCard: true },
							};
							if (trigger.player !== player) {
								trigger.player.removeMark("hongsongmrfz");
							}
						}
					},
					async callback(event, trigger, player) {
						if (get.suit(event.card) != "heart") player.gain(event.card, "gain2");
					},
					ai: {
						respondShan: true,
					},
				},
				give: {
					direct: true,
					trigger: { player: "phaseBegin" },
					filter: function (event, player) {
						return player.hasMark("hongsongmrfz");
					},
					async content(event, trigger, player) {
						let result;

						// step 0 loop (original event.goto(0))
						while (player.hasMark("hongsongmrfz")) {
							// step 0
							result = await player
								.chooseTarget(get.prompt("hongsongmrfz"), "你可以将任意个'红松'标记交给任意名其他角色", (card, player, target) => {
									return target !== player;
								})
								.set("ai", target => {
									return get.attitude(player, target) > 0;
								})
								.forResult();

							// step 1
							if (result.bool && result.targets && result.targets.length) {
								const target = result.targets[0];
								target.addMark("hongsongmrfz");
								player.removeMark("hongsongmrfz");
								//@ts-ignore
								player.logSkill("hongsongmrfz", target);
								// event.goto(0) is handled by while loop condition
							} else {
								break;
							}
						}
					},
				},
			},
			ai: {
				threaten: 0.5,
			},
		},
});

translate({
	"yanweimrfz": "焰尾",
	"fengjianmrfz": "锋剑",
	"fengjianmrfz_info": "锁定技，当你响应牌后，你获得如下效果：当你使用下一张非【闪】的基本牌后，你可以视为使用一张相同的基本牌（不计入使用次数）。",
	"hongsongmrfz": "红松",
	"hongsongmrfz_info": "①锁定技，当你响应牌后，若场上‘红松’标记小于3，你获得一个‘红松’标记；拥有‘红松’标记的角色或你需要使用或打出【闪】时，其可以进行判定，若不为♥，其视为使用或打出一张【闪】并获得判定牌，然后若该角色不为你，其移除‘红松’标记。②回合开始时，若你有‘红松’标记，你可以将任意个‘红松’标记交给任意名其他角色。",
});

characterIntro("yanweimrfz", "焰尾，卡西米尔的感染者骑士，同时也是自发组建的感染者骑士团“红松”的实际领袖。于卡西米尔合作期间与罗德岛接触，并主动寻求罗德岛的治疗。");
