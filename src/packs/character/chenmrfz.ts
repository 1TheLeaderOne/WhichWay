import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("chenmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "longmrfz",
			hp: 4,
			skills: ["danweimrfz","hechimrfz","jueyingmrfz","newjingsimrfz"],
			isZhugong: true,
		});

skill({
	"danweimrfz": {
			onremove: true,
			intro: {
				content: "已有#个胆",
			},
			audio: 2,
			usable: 2,
			trigger: { global: ["respond", "useCard"] },
			filter: function (event, player) {
				if (!event.respondTo) return false;
				if (player != event.respondTo[0]) return false;
				return event.cards.filterInD("o").filterInD("d").length > 0;
			},
			logTarget: "player",
			async content(event, trigger, player) {
				var cards = trigger.cards.filterInD("o").filterInD("d");
				player.gain(cards, "log", "gain2");
				player.addMark("danweimrfz");
			},
			group: ["danweimrfz_use"],
			subSkill: {
				use: {
					audio: "danweimrfz",
					trigger: { player: ["respond", "useCard"] },
					usable: 2,
					filter: function (event, player) {
						if (!event.respondTo) return false;
						return event.cards.filterInD("o").filterInD("d").length > 0;
					},
					logTarget: "player",
					async content(event, trigger, player) {
						var cards = [];
						if (get.itemtype(trigger.respondTo[1]) == "card") cards.push(trigger.respondTo[1]);
						else if (trigger.respondTo[1].cards) cards.addArray(trigger.respondTo[1].cards);
						cards = cards.filterInD("o").filterInD("d");
						player.gain(cards, "gain2", "log");
						player.addMark("danweimrfz");
					},
				},
			},
		},
	"hechimrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			selectTarget: 1,
			filterTarget: true,
			filter: function (event, player) {
				return player.countMark("danweimrfz") > 0 || player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;

				let result;
				if (player.countCards("h") == 0) result = { index: 1 };
				if (player.countMark("danweimrfz") == 0) result = { index: 0 };
				if (player.countMark("danweimrfz") > 0 && player.countCards("h") > 0)
					result = await player
						.chooseControl()
						.set("choiceList", [
							"弃置一张手牌", //0
							"失去一个‘胆’", //1
						])
						.set("ai", function (card) {
							var player = _status.event.player;
							if (
								player.hasCard(function (card) {
									return get.value(card) < 7;
								}, "h")
							)
								return 0;
							return 1;
						})
						.forResult();
				if (result && result.index == 0) {
					await player.chooseToDiscard(true, "h", "弃置一张手牌");
				} else {
					player.removeMark("danweimrfz");
				}

				if (!target.hasSkill("hechimrfz2")) target.addSkill("hechimrfz2");
				target.addMark("hechimrfz2");
				target.draw(2);
				if (target != player) player.draw();
			},
			ai: {
				order: 13,
			},
		},
	"jueyingmrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countMark("danweimrfz") >= 5;
			},
			async content(event, trigger, player) {
				player.removeMark("danweimrfz", 5);

				let num = 0;
				while (num < 2) {
					await player.chooseUseTarget(
						{
							name: "sha",
							nature: "thunder",
							isCard: true,
						},
						"请选择雷【杀】的目标（雷【杀】：" + num + "/2；普通【杀】:0/1）",
						false,
						"nodistance"
					);
					num++;
				}

				player.chooseUseTarget(
					{
						name: "sha",
						isCard: true,
					},
					"请选择【杀】的目标（雷【杀】：2/2；普通【杀】:1/1）",
					false,
					"nodistance"
				);
			},
		},
	"newjingsimrfz": {
			audio: 2,
			zhuSkill: true,
			trigger: { global: "useCardToTarget" },
			filter: function (event, player) {
				if (player.hasSkill("newjingsimrfz_ban")) return false;
				if (event.targets.length > 1) return false;
				if (event.player == player || event.target == player || event.source == player || player == _status.currentPhase) return false;
				return event.card.name == "sha" || event.card.name == "juedou";
			},
			direct: true,
			async content(event, trigger, player) {
				var target = trigger.target,
					card = trigger.card;
				const result = await target
					.chooseBool("【警司】：是否请求将此" + get.translation(trigger.card) + "的目标改为" + get.translation(player) + "?")
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.getTrigger().player;
						return get.attitude(player, target) > 2;
					})
					.forResult();
				if (result.bool) {
					const { bool } = await player
						.chooseBool(
							"【警司】：是否接受" + get.translation(trigger.player) + "的请求，令" + get.translation(trigger.card) + "的目标改为你？"
						)
						.set("ai", function () {
							var player = _status.event.player,
								target = _status.event.getTrigger().player;
							var nametmp = _status.event.name;
							if (
								nametmp == "sha" &&
								player.countCards("h", function (card) {
									return card.name == "shan";
								}) < 1
							)
								return false;
							if (
								nametmp == "juedou" &&
								player.countCards("h", function (card) {
									return card.name == "sha";
								}) < 2
							)
								return false;
							if (player.hp < 3) return false;
							return get.attitude(player, target) > 2;
						})
						.set("name", trigger.card.name)
						.forResult();
					if (bool === true) {
						player.draw();
						player.addMark("danweimrfz");
						player.addTempSkill("newjingsimrfz_ban", "phaseEnd");
						var target = trigger.target;
						trigger.targets.remove(target);
						//@ts-ignore
						trigger.getParent().triggeredTargets1.remove(target);
						trigger.untrigger();
						game.delayx();
						trigger.targets.push(player);
						trigger.player.line(player, "fire");
						game.log(trigger.card, "的目标被改为", player);
						//@ts-ignore
						player.logSkill("newjingsimrfz");
					}
				}
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
});

translate({
	"chenmrfz": "陈",
	"danweimrfz": "胆威",
	"danweimrfz_info": "每回合各限两次，当[①其他角色/②你]响应[①你/②其他角色]使用的牌时，你可以获得其[①响应你牌/②使用]的牌，然后你获得一个‘胆’标记。",
	"hechimrfz": "呵斥",
	"hechimrfz_info": "出牌阶段限一次，你可以弃置一张牌或移去一个'胆'，然后选择一名角色，其摸两张牌，然后其手牌上限-1直到其回合结束，若其不为你，你摸一张牌。",
	"jueyingmrfz": "赤霄",
	"jueyingmrfz_info": "准备阶段，你可以移去5个'胆'，然后你可以视为使用两张雷【杀】和一张【杀】（无距离限制）。",
	"newjingsimrfz": "警司",
	"newjingsimrfz_info": "主公技，每回合限一次，你的回合外，当其他角色成为【杀】或【决斗】的唯一目标时且使用者不是你，其可以请求将目标转移至你，若你接受，你摸一张牌并获得一个‘胆’。",
});

characterIntro("chenmrfz", "陈，龙门高级警司，龙门近卫局特别督察组组长，毕业于维多利亚皇家近卫学校，成绩优异，表现突出。在龙门近卫局供职期间，力主取缔龙门境内非法活动，对抗暴力犯罪和有组织犯罪，追缉武装逃犯与国际重犯等行动，并取得多项重大成果。</br>现作为特别人员协助罗德岛行动，并为现场提供战术指挥支援。");
