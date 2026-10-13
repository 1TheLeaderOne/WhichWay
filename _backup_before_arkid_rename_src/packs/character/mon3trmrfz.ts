import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("mon3trmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["shulimrfz","ronghuimrfz"],
		});

skill({
	"shulimrfz": {
			audio: false,
			forced: true,
			silent: true,
			mod: {
				cardUsable(card, player, num) {
					if (player.countCards("h") >= game.roundNumber * 2 && ["equip", "delay"].includes(get.type(card))) return false;
					if (player.countCards("h") >= game.roundNumber && get.type(card) === "basic" && typeof num === "number") return (num += 1);
				},
			},
		},
	"ronghuimrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			async content(event, trigger, player) {
				const discardPlie = Array.from(ui.discardPile.childNodes);
				const cards = player.getCards("h");
				await player.lose(cards);
				await player.gain(discardPlie, "gain2");

				player.addTempSkill("ronghuimrfz_lose", { player: "phaseUseEnd" });
				player
					.when({ player: "phaseUseEnd" })
					.step(async (event,trigger,player) =>{})
					.assign({
						mod: {
							cardUsable(card, player, num) {
								if (typeof num === "number") return num;
								return 1;
							},
						},
					});
				player.when({ player: "phaseDiscardBegin" }).step(async (event, trigger, player) => {
					const discardPlie = Array.from(ui.discardPile.childNodes);
					const cards = player.getCards("h");
					await player.lose(cards);
					await player.gain(discardPlie, "gain2");
					//@ts-ignore
					player.logSkill("ronghuimrfz");
				});
			},
			subSkill: {
				lose: {
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: {
						player: "loseAfter",
						global: "loseAsyncAfter",
					},
					filter(event, player) {
						if (event.type !== "use") return false;
						//@ts-ignore
						let evt = event.getl(player);
						return evt.cards2 && evt.cards2.some(card => get.position(card) === "d" && !["equip", "delay"].includes(get.type(card)));
					},
					async content(event, trigger, player) {
						//@ts-ignore
						let cards2 = trigger.getl(player).cards2;
						cards2 = cards2.filter(card => get.position(card) === "d" && !["equip", "delay"].includes(get.type(card)));
						for (let card of cards2) {
							card.fix();
							ui.cardPile.appendChild(card);
						}
						game.log(player, `将`, `#y${get.translation(cards2)}`, `张牌置于了牌堆底`);
					},
				},
			},
			ai: {
				threaten: 1.8,
				order: 3.4,
				result: {
					player(player) {
						let transferValue = function (cards) {
							return cards.map(card => player.getUseValue(card)).reduce((acc, curr) => acc + curr, 0);
						};
						let filterCards = function (cards) {
							//@ts-ignore
							return cards.filter(
								card =>
									player.getCardUsable2(card) > 0 &&
									(get.type(card) === "basic" || (get.type(card) !== "basic" && player.countUsed(card) < 1))
							);
						};
						let cards = filterCards(player.getCards("h"));
						let discardPlie = filterCards(Array.from(ui.discardPile.childNodes));
						return transferValue(cards) > transferValue(discardPlie) ? -1 : 1;
					},
				},
			},
		},
});

translate({
	"mon3trmrfz": "mon3tr",
	"shulimrfz": "疏历",
	"shulimrfz_info": "锁定技，当你的手牌数不小于X时，你的基本牌使用次数+1；当你手牌数不小于2X时，你不能使用延时锦囊牌或装备牌。（X=游戏轮数）",
	"ronghuimrfz": "融毁",
	"ronghuimrfz_info": "出牌阶段限一次，你可以交换手牌和弃牌堆，令你本阶段每种牌名的牌最多使用次数的基数为1且因使用而进入弃牌堆的牌改为置于牌堆底，然后你于弃牌阶段开始时交换你的手牌和弃牌堆。",
});

characterTitle("mon3trmrfz", "<font color='#8b008b'>旧日重拾</font>");

characterIntro("mon3trmrfz", "Mon3tr，在生命科学、矿石病诊疗、历史系谱学等诸多领域具备渊博学识，拥有丰富的移动作战经验，为罗德岛重建工作提供了至关重要的帮助，现为罗德岛医疗部、工程部、外勤部特别顾问。");
