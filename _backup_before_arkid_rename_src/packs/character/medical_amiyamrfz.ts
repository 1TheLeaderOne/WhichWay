import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("medical_amiyamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["tongqingmrfz","cibeimrfz"],
			arkuid:"char_1037_amiya3"
		});

skill({
	"tongqingmrfz": {
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: function (player, skill) {
				let cards = player.getCards("s", function (card) {
					return card.hasGaintag("tongqingmrfzx");
				});
				if (cards.length) {
					player.lose({cards:cards,position:ui.discardPile});
					player.$throw(cards, 1000);
					game.log(cards, "进入了弃牌堆");
				}
			},
			marktext: "情绪",
			intro: {
				name: "情绪",
				mark(dialog, content, player) {
					let cards = player.getCards("s", function (card) {
						return card.hasGaintag("tongqingmrfzx");
					});
					if (!cards || cards.length < 1) {
						dialog.addText(`没有‘情绪’`);
					} else {
						dialog.addText(`共有${cards.length}张‘情绪’`);
						dialog.addSmall(cards);
					}
				},
			},
			audio: 2,
			trigger: { global: "phaseJieshuBegin" },
			getDiscard: function (event, player) {
				let cards = [] as Card[];
				for (let character of game.players) {
					let history = character.getHistory("lose", function (evt) {
						return evt && evt.type == "discard";
					});
					if (history.length == 0) continue;
					for (let i = 0; i < history.length; i++) {
						let cardsList = history[i].cards;
						for (let j = 0; j < cardsList.length; j++) {
							if (get.position(cardsList[j], true) != "d") continue;
							cards.push(cardsList[j]);
						}
					}
				}
				return cards;
			},
			filter(event, player) {
				let cardsList = lib.skill.tongqingmrfz.getDiscard(event, player);
				return cardsList && cardsList.length > 0;
			},
			prompt2(event, player) {
				let cardsList = lib.skill.tongqingmrfz.getDiscard(event, player),
					cards = player.getCards("s", function (card) {
						return card.hasGaintag("tongqingmrfzx");
					});
				return `【恸请】:你可以将所有的‘情绪’（${cards.length > 0 ? `共有${cards.length}张‘情绪’` : "没有‘情绪’"}）置入弃牌堆，然后将${get.translation(cardsList)}置于你的武将牌上，称之为‘情绪’`;
			},
			check(event, player) {
				let cardsList = lib.skill.tongqingmrfz.getDiscard(event, player),
					cards = player.getCards("s", function (card) {
						return card.hasGaintag("tongqingmrfzx");
					});
				if (cards.length < 1) return true;
				return get.value(cardsList) - get.value(cards) > 0;
			},
			async content(event, trigger, player) {
				let cards = player.getCards("s", function (card) {
					return card.hasGaintag("tongqingmrfzx");
				});
				if (cards && cards.length > 0) {
					await player.loseToDiscardpile({cards});
				}
				let cardsList = lib.skill.tongqingmrfz.getDiscard(trigger, player);
				game.log(player, "将", cardsList.length, "张牌置于在武将牌上");
				player.loseToSpecial(cardsList, "tongqingmrfzx");
				player.markSkill("tongqingmrfz");
			},
		},
	"cibeimrfz": {
			audio: 2,
			trigger: { player: "loseAfter" },
			filter(event, player) {
				let position = event.cards.map(i => i.original);
				return position.every(item => item != "h");
			},
			direct: true,
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget()
					.set("prompt", `【慈悲】:你可以令你攻击范围内的一名角色或你回复一点体力或摸一张牌`)
					.set("filterTarget", (card, player, target) => {
						return player.inRange(target) || target == player;
					})
					.set("ai", target => get.attitude(_status.event.player, target) > 0)
					.forResult();
				if (!targets) return;
				let target = targets[0];
				if (target.getDamagedHp() < 1) {
					target.draw();
					player.logSkill("cibeimrfz", target);
					return;
				}
				const { control } = await player
					.chooseControl({
						controls:["回复体力", "摸一张牌"]
					})
					.set("prompt", `【慈悲】:请选择一项`)
					.set("ai", () => 0)
					.forResult();
				if (!control) return;
				if (control == "回复体力") {
					target.recover();
				} else target.draw();
				player.logSkill("cibeimrfz", target);
			},
		},
});

translate({
	"medical_amiyamrfz": "医疗阿米娅",
	"medical_amiyamrfz_prefix": "医疗",
	"tongqingmrfz": "恸情",
	"tongqingmrfz_info": "一名角色的结束阶段，若本回合有牌因弃置而进入弃牌堆，你可以将所有的‘情绪’置入弃牌堆，然后将本回合因弃置而进入弃牌堆的牌置于你的武将牌上，称之为‘情绪’，你可以如手牌般使用‘情绪’。",
	"cibeimrfz": "慈悲",
	"cibeimrfz_info": "当你失去除手牌区以外的牌后，你可以令一名攻击范围内的角色或你回复一点体力或摸一张牌。",
});

characterTitle("medical_amiyamrfz", "<font color=#00868B>万千愿景</font>");

characterIntro("medical_amiyamrfz", "罗德岛的公开领袖，在内部拥有最高执行权。虽然，从外表上看起来仅仅是个不成熟的少女，实际上，她却是深受大家信任的合格的领袖。<br>现在，阿米娅正带领着罗德岛，为了感染者的未来，为了让这片大地挣脱矿石病的阴霾而不懈努力。<br>\"但有时，我也会想，这艘船是否能在某一天......实现殿下的愿望。\"");
