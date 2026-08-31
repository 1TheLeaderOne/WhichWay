import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("puruisaisimrfz", {
			sex: "female",
			group: "qianmrfz",
			hp: 3,
			skills: ["qianmianmrfz","neihuamrfz"],
		});

skill({
	"qianmianmrfz": {
			audio: 2,
			trigger: { player: ["chooseToUseBegin", "chooseToRespondBegin"] },
			getResAndUseCard(event, player) {
				let result = [];
				for (let name of lib.inpile) {
					if (event.filterCard && event.filterCard({ name: name, suit: "none", number: null }, player, event)) result.add(name);
				}
				return result;
			},
			// @ts-ignore
			hiddenCard(player, name) {
				return player.countCards("h") > 0;
			},
			filter(event, player) {
				// @ts-ignore
				return (
					((event.respondTo && event.respondTo[0] !== player) || event.type === "wuxie") &&
					player.countCards("h") > 0 &&
					lib.skill.qianmianmrfz.getResAndUseCard(event, player).length > 0
				);
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				let names = lib.skill.qianmianmrfz.getResAndUseCard(trigger, player);
				let cardx = trigger.card;
				if (names.length === 1) {
					player
						.when({ player: ["chooseToUseAfter", "chooseToRespondAfter"] })
						// @ts-ignore
						.step(() => {})
						.assign({
							mod: {
								// @ts-ignore
								cardname(card, player, name) {
									if (card !== cardx) return names[0];
								},
							},
						});
				}
			},
		},
	"neihuamrfz": {
			audio: 2,
			trigger: { player: ["useCardAfter", "respondAfter"] },
			// @ts-ignore
			init(player, skill) {
				player.storage.neihuamrfz = [];
				lib.translate["neihuamrfzx"] = "信息流";
			},
			filter(event, player) {
				let nameList = player.getExpansions("neihuamrfz").map(card => card.name);
				// @ts-ignore
				return !nameList.includes(event.card.name) && !event.cards.some(card => card.neihuamrfz);
			},
			forced: true,
			mark: true,
			marktext: "信息流",
			intro: {
				name: "信息流",
				content: "expansion",
				markcount: "expansion",
			},
			onremove(player, skill) {
				const cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let card = trigger.card;
				let cardcopy = ui.create.card();
				let info = ["none", null, get.name(card), get.nature(card), undefined];
				// @ts-ignore
				cardcopy.init(info);
				// @ts-ignore
				cardcopy.neihuamrfz = true;
				// @ts-ignore
				player.addToExpansion(cardcopy, player, "give").gaintag.add("neihuamrfz");
			},
			group: ["neihuamrfz_snyc", "neihuamrfz_destroy", "neihuamrfz_snyc_lose"],
			subSkill: {
				destroy: {
					silent: true,
					charlotte: true,
					trigger: {
						global: ["loseEnd", "cardsDiscardEnd"],
					},
					// @ts-ignore
					filter(event, player) {
						if (event.name == "lose" && event.position != ui.discardPile) return false;
						for (let card of event.cards) {
							// @ts-ignore
							if (card.neihuamrfz) return true;
						}
						return false;
					},
					// @ts-ignore
					async content(event, trigger, player) {
						let cards = [];
						for (let card of trigger.cards) {
							// @ts-ignore
							if (card.neihuamrfz) cards.push(card);
						}
						game.cardsGotoSpecial(cards);
						game.log(cards, "被移出了游戏");
					},
				},
				snyc: {
					silent: true,
					charlotte: true,
					trigger: {
						player: ["addToExpansionAfter"],
					},
					// @ts-ignore
					filter(event, player) {
						// @ts-ignore
						return event.cards.some(card => card.neihuamrfz);
					},
					// @ts-ignore
					async content(event, trigger, player) {
						// @ts-ignore
						let cards = trigger.cards.filter(card => card.neihuamrfz);
						let cardsx = cards.map(card => {
							let cardx = ui.create.card();
							// @ts-ignore
							cardx.init(get.cardInfo(card));
							// @ts-ignore
							cardx._cardid = card.cardid;
							// @ts-ignore
							cardx.neihuamrfz = true;
							return cardx;
						});
						player.directgains(cardsx, null, "neihuamrfzx");
					},
				},
				snyc_lose: {
					silent: true,
					charlotte: true,
					trigger: {
						player: ["loseBegin"],
					},
					// @ts-ignore
					filter(event, player) {
						// @ts-ignore
						return event.cards.filter(card => card.neihuamrfz);
					},
					// @ts-ignore
					async content(event, trigger, player) {
						let cards = trigger.cards;
						let loseCards = player.getExpansions("neihuamrfz").filter(card => {
							// @ts-ignore
							return cards.some(cardt => cardt._cardid === card.cardid);
						});
						game.cardsGotoSpecial(loseCards, false);
					},
				},
			},
		},
});

translate({
	"puruisaisimrfz": "普瑞赛斯",
	"qianmianmrfz": "千面",
	"qianmianmrfz_info": "锁定技，当你成为牌的目标时或你需要使用【无懈可击】时，你所有的手牌均视为可以响应此牌的牌直到此牌结算完毕。",
	"neihuamrfz": "内化",
	"neihuamrfz_info": "锁定技。<br>当你使用或打出牌后，若“信息流”中没有与此牌相同牌名的牌，你创建一张与此牌名相同且无花色和点数的牌置入“信息流”之中；<br>你如手牌般使用或打出“信息流”中的牌，且当“信息流”中的牌进入弃牌堆后，销毁之。",
});

characterTitle("puruisaisimrfz", "<font color=#77be6a>女祭司</font>");

characterIntro("puruisaisimrfz", "博士面对石棺的回忆中的神秘女性人物，是源石的起点，曾与博士亲密无间。");
