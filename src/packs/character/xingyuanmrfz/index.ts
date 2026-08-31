import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xingyuanmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "lymrfz",
			hp: 4,
			skills: ["daoliumrfz","gewumrfz"],
		});

skill({
	"daoliumrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 2,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			check: function (card) {
				return 6 - get.value(card);
			},
			filterCard: true,
			selectCard: 1,
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			lose: false,
			discard: false,
			async content(event, trigger, player) {
				const target = event.target;
				const cards = event.cards;

				// step 0
				event.targetx = target;
				event.targets = [];
				event.discard = [];
				event.discard.push(target);
				//@ts-ignore
				if (target.getNext()) event.targets.push(target.getNext());
				//@ts-ignore
				if (target.getPrevious()) event.targets.push(target.getPrevious());
				if (event.targets.includes(player)) event.targets.remove(player);
				await player.give(cards, target);

				// step 1 & 2 loop (original event.goto(1))
				while (event.targets.length && event.targetx.countCards("he") > 0) {
					const currentTarget = event.targets[0];
					const result = await event.targetx
						.chooseCard("【导流】:请交给" + get.translation(currentTarget) + "一张牌", "he")
						.set("forced", true)
						.forResult();

					if (result.cards && result.cards.length) {
						const card = result.cards[0];
						await event.targetx.give(card, currentTarget);
						event.discard.push(currentTarget);
					}
					event.targets.shift();
				}

				// step 3 loop (original event.redo())
				while (event.discard.length) {
					const discardTarget = event.discard[0];
					if (discardTarget.countCards("he") > 0) {
						await discardTarget.chooseToDiscard("he", true, "【导流】:请弃置一张牌");
					}
					event.discard.shift();
				}
			},
			ai: {
				order: 4,
				expose: 0.1,
				result: {
					target: function (player, target) {
						var pre = target.getPrevious(),
							net = target.getNext(),
							num = 0;
						if (game.players.length == 2) return 0;
						if (get.attitude(pre, player) > 2 && get.attitude(net, player) > 2) return 0;
						return -1;
					},
				},
			},
		},
	"gewumrfz": {
			audio: 2,
			trigger: {
				global: "gainEnd",
			},
			filter: function (event, player) {
				return event.source && event.source.isIn() && event.source == player && event.cards.length >= 1;
			},
			direct: true,
			logTarget: "source",
			async content(event, trigger, player) {
				if (player.countMark("gewumrfz") < 5) {
					player.addMark("gewumrfz", 1, false);
					//@ts-ignore
					player.logSkill("gewumrfz");
				}
				for (var i = 0; i < trigger.cards.length; i++) {
					if (!player.getStorage("gewumrfz_mark").includes(trigger.cards[i].name)) {
						player.markAuto("gewumrfz_mark", [trigger.cards[i].name]);
						if (player.storage.gewumrfz_mark.length % 2 == 0) {
							player.draw();
							//@ts-ignore
							player.logSkill("gewumrfz");
						}
						if (player.storage.gewumrfz_mark.length % 4 == 0) {
							player.addMark("gewumrfz_draw", 1, false);
							//@ts-ignore
							player.logSkill("gewumrfz");
						}
					}
				}
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + player.countMark("gewumrfz");
				},
			},
			group: ["gewumrfz_mark", "gewumrfz_draw"],
			subSkill: {
				mark: {
					intro: {
						content: function (event, player) {
							return (
								"记录的牌名：" +
								get.translation(player.storage.gewumrfz_mark) +
								"</br>" +
								(player.countMark("gewumrfz_draw") > 0 ? "额定摸牌数+" + player.countMark("gewumrfz_draw") : "")
							);
						},
					},
					onremove: true,
					charlotte: true,
				},
				draw: {
					audio: "gewumrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.countMark("gewumrfz_draw") > 0;
					},
					async content(event, trigger, player) {
						trigger.num += player.countMark("gewumrfz_draw");
					},
				},
			},
		},
});

translate({
	"xingyuanmrfz": "星源",
	"daoliumrfz": "导流",
	"daoliumrfz_info": "出牌阶段限两次，你可以选择一名其他角色并交给其一张牌，其须分别交给其上家和下家（你除外）各一张牌，然后因此获得牌的角色均须弃置一张牌。",
	"gewumrfz": "格物",
	"gewumrfz_info": "锁定技，每当其他角色获得你的牌后，你的手牌上限+1（至多为5），然后你记录此牌的牌名（每种牌名的牌仅记录一次）；每当你【格物】记录的牌名的牌的数量是[2/4]的整数倍时，[你摸一张牌/你的摸牌阶段额定摸牌数+1]。",
});

characterIntro("xingyuanmrfz", "星源，本名埃琳娜·乌比卡，莱茵生命能量科研究员。在罗德岛驻留期间则使用其原名作为代号以示区分。</br>使用自制法杖以极具特色的源石技艺制衡敌人，但比起前线作战，本人更希望在后方承接专业研究及器械维护方面的工作。");
