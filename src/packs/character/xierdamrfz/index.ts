import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xierdamrfz", {
			group: "weimrfz",
			sex: "female",
			skills: ["shencimrfz", "lanshengmrfz"],
			hp: 3,
		});

skill({
	"shencimrfz": {
			audio: 2,
			trigger: { global: "phaseBegin" },
			forced: true,
			filter(event, player) {
				return player.countCards("h", card => card.hasGaintag("shencimrfz")) < 1;
			},
			async content(event, trigger, player) {
				let cards = [];
				for (let name of lib.inpile) {
					if (!["basic", "trick"].includes(get.type(name))) continue;
					let list = lib.card.list.filter(arr => arr[2] === name).randomGet();
					//@ts-ignore
					cards.push(game.createCard(name, list[0], list[1], list[3]));
				}
				const result = await player
					//@ts-ignore
					.chooseCardHand()
					.set("ai", card => get.player().getUseValue(card))
					.set("cards", cards)
					.set("forced", true)
					.set("complexSelect", true)
					.set("prompt", `【神赐】:请选择你要获得的牌`)
					.forResult();
				if (!result?.cards) return;
				const { name, suit, number, nature } = result.cards[0];
				let card = game.createCard(name, suit, number, nature);
				//@ts-ignore
				card._destroy = true;
				player.gain(card, "gain2").set("gaintag", ["shencimrfz"]);
			},
			group: ["shencimrfz_onlose", "shencimrfz_dying"],
			subSkill: {
				dying: {
					audio: "shencimrfz",
					forced: true,
					trigger: { player: "dying" },
					filter(event, player) {
						return player.countCards("h", card => card.hasGaintag("shencimrfz")) > 0;
					},
					async content(event, trigger, player) {
						await player.discard(player.getCards("h", card => card.hasGaintag("shencimrfz")));
						player.recoverTo(1);
					},
				},
				onlose: {
					audio: false,
					silent: true,
					charlotte: true,
					trigger: { player: "loseAfter" },
					filter(event, player) {
						//@ts-ignore
						for (let id in event.gaintag_map) {
							//@ts-ignore
							let tags = event.gaintag_map[id];
							if (event.cards.some(card => card.cardid === id) && tags.includes("shencimrfz")) return true;
						}
						return false;
					},
					async content(event, trigger, player) {
						//补一个销毁的log
						let destory = [];
						//@ts-ignore
						for (let id in trigger.gaintag_map) {
							//@ts-ignore
							let tags = trigger.gaintag_map[id];
							if (!tags.includes("shencimrfz")) continue;
							destory.addArray(trigger.cards.filter(card => card.cardid === id));
						}
						game.log(destory, `被销毁了`);
					},
				},
			},
		},
	"lanshengmrfz": {
			audio: 2,
			trigger: {
				player: "damageEnd",
				source: "damageEnd",
			},
			filter(event, player) {
				//@ts-ignore
				return (
					new Set(
						game
							.getAllGlobalHistory("everything", evt => evt.name === "gain" && evt.gaintag.includes("shencimrfz"))
							.map(evt => evt.cards.map(i => get.suit(i)))
							.flat()
					).size > 0
				);
			},
			async cost(event, trigger, player) {
				//@ts-ignore
				let suits = new Set(
					game
						.getAllGlobalHistory("everything", evt => evt.name === "gain" && evt.gaintag.includes("shencimrfz"))
						.map(evt => evt.cards.map(i => get.suit(i)))
						.flat()
				);
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("lanshengmrfz"))
					.set("prompt2", `你可以重铸至多${suits.size}张牌，若包含了与获得过的“神赐”牌相同牌名的牌，你摸一张牌`)
					.set("filterCard", card => {
						//@ts-ignore
						if (get.event().shenciCard.has(get.name(card))) {
							let info = ui.create.div(".promptSJZX", card);
							info.classList.add("promptCardSJZX");
							info.innerHTML = `可摸牌`;
						}
						return true;
					})
					.set("ai", card => {
						//@ts-ignore
						let names = get.event().shenciCard;
						return (
							6 -
							get.value(card) +
							(names.has(get.name(card)) && !ui.selected.cards.map(i => get.name(i)).includes(get.name(card)) ? 5 : 0)
						);
					})
					.set("selectCard", [1, suits.size])
					//@ts-ignore
					.set(
						"shenciCard",
						new Set(
							game
								.getAllGlobalHistory("everything", evt => evt.name === "gain" && evt.gaintag.includes("shencimrfz"))
								.map(evt => evt.cards.map(i => get.name(i)))
								.flat()
						)
					)
					.forResult();

				player.getCards("hes", card => {
					if (card.querySelector(".promptSJZX")) {
						card.querySelector(".promptSJZX")?.remove();
					}
				});
			},
			async content(event, trigger, player) {
				//@ts-ignore
				let names = new Set(
					game
						.getAllGlobalHistory("everything", evt => evt.name === "gain" && evt.gaintag.includes("shencimrfz"))
						.map(evt => evt.cards.map(i => get.name(i)))
						.flat()
				);
				let { cards } = event;
				player.recast(cards, undefined, (player, cards) => {
					if (cards.map(i => get.name(i)).some(i => names.has(i))) {
						player.draw(cards.length + 1);
					} else player.draw(cards.length);
				});
			},
		},
});

translate({
	"xierdamrfz": "希尔达",
	"shencimrfz": "神赐",
	"shencimrfz_info": "锁定技。<br>➀任意角色的回合开始时，若你没有“神赐”牌，你选择一个基本牌或普通锦囊的牌名，然后从游戏外获得此牌名的牌。<br>➁当“神赐”牌离开你的手牌区时，销毁之。<br>➂当你进入濒死状态后，若你有“神赐”牌，你弃置之并将体力调整至1。",
	"lanshengmrfz": "览生",
	"lanshengmrfz_info": "当你造成或受到伤害后,你可以重铸至多X张牌，若你重铸的牌的牌名中有你获得过的“神赐”的牌名，此次重铸的摸牌数+1。（X=你获得过的“神赐”的花色数）",
});

characterTitle("xierdamrfz", "<font color = red>神祇代理人</font>");

characterIntro("xierdamrfz", "一路在伦蒂尼姆救助难民，最后死于矿石病的感染者少女。被前文明语言学家普瑞赛斯以源石信息重构为宇宙投影。她在“罗德岛”内化宇宙中窥见文明墓碑与毁灭真理，仍选择回归泰拉。被普瑞赛斯赋予“消除源石痛苦”的权柄，治愈了几名矿工。");
