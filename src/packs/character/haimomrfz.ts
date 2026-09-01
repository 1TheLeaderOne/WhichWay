import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("haimomrfz", { pack: "epicSJZX",
			sex: "female",
			group: "yimrfz",
			hp: 4,
			skills: ["xunchaomrfz","paoyingmrfz"],
		});

skill({
	"xunchaomrfz": {
			intro: {
				content: "下次造成的伤害+#",
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				if (player.countCards("h") < 1) return false;
				return game.hasPlayer(current => {
					return (
						current != player &&
						(current.hp > player.hp ||
							current.countCards("h") > player.countCards("h") ||
							current.countCards("e") > player.countCards("e"))
					);
				});
			},
			complexCard: true,
			filterCard: function (card, player) {
				var selected = ui.selected.cards;
				if (!selected.length) return true;
				for (var i = 0; i < selected.length; i++) {
					if (get.type2(card) == get.type2(selected[i])) return false;
				}
				return true;
			},
			filterTarget: function (card, player, target) {
				return (
					target != player &&
					(target.hp > player.hp || target.countCards("h") > player.countCards("h") || target.countCards("e") > player.countCards("e"))
				);
			},
			selectCard: [1, Infinity],
			check: function (card) {
				return 10 - get.value(card);
			},
			discard: false,
			lose: false,
			delay: false,
			async content(event, trigger, player) {
				const { cards, target } = event;

				await player.give(cards, target);

				const num = cards.length;
				if (num >= 1) {
					player.recover();
				}
				if (num >= 2) {
					player.adjustHandCardTo(target.countCards("h"));
				}
				if (num >= 3) {
					player.addMark("xunchaomrfz", 1, false);
					player.when({ source: "damageBegin3" }).then(async (event, trigger, player) => {
						player.removeMark("xunchaomrfz", 1, false);
						trigger.num++;
					});
					// .emb({ firstDo: true });
				}
			},
			ai: {
				expose: 0.1,
				order: 3,
				result: {
					target: function (player, target) {
						if (get.attitude(target, player) > 0) {
							return 1 + target.countCards("h") * 0.1;
						}
					},
				},
			},
		},
	"paoyingmrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("h") > player.hp && player.getDamagedHp() > 0;
			},
			async content(event, trigger, player) {
				let num = player.hp,
					result;
				let differ = player.countCards("h") - num;
				if (differ > 0) {
					result = await player.chooseToDiscard(true, `请弃置${get.cnNumber(player.countCards("h") - num)}张牌`, differ).forResult();
				} else if (differ < 0) {
					player.draw(Math.abs(differ));
				}
				if (result?.cards) {
					player.recover(Math.min(result.cards.length, 2));
				}
			},
		},
});

translate({
	"haimomrfz": "海沫",
	"xunchaomrfz": "寻潮",
	"xunchaomrfz_info": "出牌阶段限一次，你可以将任意张类型不同的手牌交给一名[手牌数/体力值/装备区牌数]大于你的的其他角色，然后你执行前等同于你交给其的牌数量项：</br>1.回复一点体力；</br>2.将手牌调整至与该角色一致；</br>3.你下次造成的伤害+1。",
	"paoyingmrfz": "泡影",
	"paoyingmrfz_info": "锁定技，准备阶段，若你的手牌数大于你的体力值且你已受伤，你将你的手牌调整至与你体力值一致，然后回复等同于你弃置的牌的数量（至多为2）点体力。",
});

characterTitle("haimomrfz", "<font color=#8ccfcc>归于海潮</font>");

characterIntro("haimomrfz", "海沫，在某次针对伊比利亚地区的行动中受到波及，作为伤员被带回本舰施行救治。经考察并结合测试结果，批准其成为外勤干员，于伊比利亚地区周边支援各项任务。");
