import { lib, game, ui, get, ai, _status } from "noname";

/**
 * 二星武将的第一部分
 */
const tmpSave = window.whichWaySave.tmpSave;

/** @type {WhichWayCharacterPack} */
export default {
	character: {
	},
	skill: {
		//friston3 弗里斯腾3
		shantanmrfz: {
			audio: 2,
			trigger: { global: "gainAfter" },
			filter: function (event, player) {
				return event.player != player && !player.hasSkill("shantanmrfz_ban");
			},
			prompt: "【善谈】:是否摸一张牌？",
			async content(event, trigger, player) {
				await player.draw();

				if (player.isMaxHandcard(true)) {
					player.addTempSkill("shantanmrfz_ban", { global: "roundStart" });
				}
			},
			group: "shantanmrfz_give",
			subSkill: {
				give: {
					audio: "shantanmrfz",
					trigger: {
						global: ["loseAfter", "loseAsyncAfter"],
					},
					filter: function (event, player) {
						if (event.type != "discard") return false;
						if (player.countCards("he") < 1) return false;
						if (player.hasSkill("shantanmrfz_used")) return false;
						return game.hasPlayer(current => {
							if (current == player) return false;
							var evt = event.getl(current);
							if (!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 1) return false;
							return true;
						});
					},
					check: function (event, player) {
						return get.attitude(player, event.player) > 0;
					},
					prompt: function (event, player) {
						return "【善谈】:你可以弃置一张牌令" + get.translation(event.player) + "获得其弃置的牌";
					},
					async content(event, trigger, player) {
						if (player.countCards("he") <= 0) return;
						const result = await player.chooseToDiscard(true, 1, "he", "【善谈】:请弃置一张牌").set("card",card=>get.value(card) < 8).forResult();

						if (result.cards) {
							var targets = [],
								cardsList = [];
							var players = game.filterPlayer().sortBySeat(_status.currentPhase);
							for (var current of players) {
								if (current == player) continue;
								var cards = [];
								var evt = trigger.getl(current);
								if (!evt || !evt.cards2) continue;
								var cardsx = evt.cards2.filterInD("d");
								cards.addArray(cardsx);
								if (cards.length) {
									targets.push(current);
									cardsList.push(cards);
								}
							}
							targets[0].gain(cardsList[0], "gain2");
							player.addTempSkill("shantanmrfz_used", { global: "phaseEnd" });
						}
					},
				},
				used: {
					charlotte: true,
				},
				ban: {
					mark: true,
					charlotte: true,
					intro: {
						content: "【善谈①】本轮失效",
					},
				},
			},
		},
	},
};
