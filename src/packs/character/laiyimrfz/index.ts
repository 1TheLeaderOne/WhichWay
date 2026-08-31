import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("laiyimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "leimrfz",
			hp: 3,
			skills: ["shaobanmrfz","tankuangmrfz"],
		});

skill({
	"shaobanmrfz": {
			mod: {
				inRange: function (from, to) {
					if (
						to.hasCard(card => {
							return card.name == "shadishoumrfz";
						}, "e")
					)
						return true;
				},
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			derivation: ["shadishoumrfz"],
			filter: function (event, player) {
				return (
					player.countCards("he") > 0 &&
					!game.hasPlayer(current => {
						return current.hasCard(card => {
							return card.name == "shadishoumrfz";
						}, "e");
					}) &&
					game.hasPlayer(current => {
						return current != player && !current.isDisabled(2);
					})
				);
			},
			filterCard: true,
			filterTarget: function (card, player, target) {
				return target != player && !target.isDisabled(2);
			},
			check: function (card) {
				return 6 - get.value(card);
			},
			async content(event, trigger, player) {
				const { target } = event;
				const card = game.createCard("shadishoumrfz", "heart", 13);
				target.$gain2(card);
				game.delayx();
				target.equip(card);
			},
			ai: {
				order: 5,
				result: {
					target: -1,
				},
			},
			group: "shaobanmrfz_dam",
			subSkill: {
				ban: {
					charlotte: true,
				},
				dam: {
					direct: true,
					trigger: { source: "damageBegin" },
					filter: function (event, player) {
						if (player.hasSkill("shaobanmrfz_ban")) return false;
						return (
							event.player != player &&
							event.player.hasCard(card => {
								return card.name == "shadishoumrfz";
							}, "e")
						);
					},
					async content(event, trigger, player) {
						trigger.num++;
						//@ts-ignore
						player.logSkill("shaobanmrfz", trigger.player);
						player.addTempSkill("shaobanmrfz_ban", {
							global: "phaseEnd",
						});
					},
				},
			},
		},
	"tankuangmrfz": {
			mark: true,
			intro: {
				content: "剩余#次",
			},
			onremove: true,
			audio: 2,
			trigger: { player: "useCardAfter" },
			getCountInRanger(player) {
				var num = 0,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (player.inRange(players[i])) {
						num++;
					}
				}
				return num;
			},
			filter: function (event, player) {
				return player.countMark("tankuangmrfz") > 0;
			},
			check: function (event, player) {
				if (player.hp < 2) return Math.random() > 0.4;
				return true;
			},
			async content(event, trigger, player) {
				const card = game.cardsGotoOrdering(get.cards(1)).cards[0];
				let num = 0;
				//@ts-ignore
				player.showCards(card, get.translation(player) + "展示了牌堆顶一张牌");
				if (get.color(card) == get.color(trigger.card)) num++;
				//@ts-ignore
				if (get.type(card, "trick") == get.type(trigger.card, "trick")) num++;
				if (Number(get.number(card)) >= Number(get.number(trigger.card))) num++;
				if (num > 0) {
					player.draw(num);
					if (num == 3) player.recoverTo(player.maxHp);
				} else {
					player.loseHp();
					player.removeSkill("tankuangmrfz");
					player.addTempSkill("tankuangmrfz_re3", {
						global: "phaseBegin",
					});
				}
				player.removeMark("tankuangmrfz", 1, false);
			},
			group: ["tankuangmrfz_re", "tankuangmrfz_re2"],
			subSkill: {
				re: {
					charlotte: true,
					silent: true,
					trigger: { global: "phaseBegin" },
					async content(event, trigger, player) {
						var num = Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player));
						player.removeMark("tankuangmrfz", player.countMark("tankuangmrfz"), false);
						player.addMark("tankuangmrfz", num, false);
					},
				},
				re2: {
					init: function (player) {
						player.storage.tankuangmrfz_re2 = lib.skill.tankuangmrfz.getCountInRanger(player);
					},
					charlotte: true,
					silent: true,
					trigger: {
						player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
						global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					filter: function (event, player) {
						return player.storage.tankuangmrfz_re2 - Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player)) != 0;
					},
					async content(event, trigger, player) {
						if (!player.storage.tankuangmrfz_re2) player.storage.tankuangmrfz_re2 = 0;
						var now = Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player));
						var last = player.storage.tankuangmrfz_re2;
						var num = now - last;
						if (num > 0) {
							player.addMark("tankuangmrfz", num, false);
						} else player.removeMark("tankuangmrfz", Math.abs(num), false);
						player.storage.tankuangmrfz_re2 = now;
					},
				},
				re3: {
					charlotte: true,
					silent: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.addSkill("tankuangmrfz");
					},
				},
			},
		},
});

translate({
	"laiyimrfz": "莱伊",
	"shaobanmrfz": "哨伴",
	"shaobanmrfz_info": "①出牌阶段限一次，若场上没有【沙地兽】，你可以弃置一张手牌并选择一名其他角色，将【沙地兽】置入其装备区。②锁定技，装备区有【沙地兽】的其他角色视为在你的攻击范围内；你每回合对装备有【沙地兽】的其他角色造成的第一次伤害+1。",
	"tankuangmrfz": "探矿",
	"tankuangmrfz_info": "每回合限X次，当你使用的牌结算完毕后，你可以展示牌堆顶一张牌，每满足一项你摸一张牌：1.展示的牌与你使用的牌颜色相同；2.展示的牌与你使用的牌类型相同；3.展示的牌的点数不小于你使用的牌，若均不满足，你失去一点体力且你失去本技能直到回合结束，若均满足，你将体力回复至体力上限。（X=在你攻击范围内的其他角色数，X至少为2）",
});

characterIntro("laiyimrfz", "莱伊，雷姆必拓人，无稳定职业，较常从事在雷姆必拓被称为“探井人”的矿井安保工作。偶遇故地重游的阿米娅、博士与暴行后，主动申请加入罗德岛。现作为罗德岛驻舰干员参与各类安保、战斗及勘探任务。");
