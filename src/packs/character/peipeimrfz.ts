import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("peipeimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "samrfz",
			hp: 3,
			skills: ["boqingmrfz","kuisuimrfz","lianwenmrfz"],
		});

skill({
	"boqingmrfz": {
			audio: 2,
			trigger: {
				player: "drawBegin",
				global: "judgeBegin",
			},
			async content(event, trigger, player) {
				let cards = get.cards(4);
				let originalHandCards = player.getCards("h");
				const { moved } = await player
					.chooseToMove("【博青】:你可以交换牌堆顶和你的手牌并任意顺序放回牌堆顶或牌堆底")
					.set("list", [["牌堆顶", cards], ["牌堆底"], ["你的手牌", player.getCards("h")]])
					.set("processAI", list => {
						let moved = [[], [], []];
						let top = list[0][1];
						let originalHandCards = get.event().originalHandCards.slice();
						let current = _status.currentPhase;
						let evt = get.event().evt;
						let player = get.player();
						let all = [...top, ...list[2][1]];
						all.sort(function (a, b) {
							return get.value(b, player) - get.value(a, player);
						});
						/*
                                    TODO 开摆！有缘再说！
                                     */
						// if(evt.name=='draw'){
						for (let i = 0; i < originalHandCards.length; i++) {
							//@ts-ignore
							moved[2].push(all.shift());
						}
						while (all) {
							if (get.value(all[0], player) <= 5) break;
							//@ts-ignore
							moved[1].push(all.shift());
						}
						//@ts-ignore
						moved[0].addArray(all);
						// } else{
						// 	const evtx = evt.getParent('judge');
						// 	const attitude = get.attitude(player, evtx.player);
						// 	let reverseAll = all.reverse();
						// 	for(let i of reverseAll){
						// 		const result = evtx.judge(i) - evtx.judge(evtx.player.judging[0]);
						// 		if(result==0) continue;
						// 		if(originalHandCards.includes(i)&&(result - get.value(card) / 2)>0)
						// 	}
						// }
						return moved;
					})
					.set("filterOk", moved => {
						let originalHandCards = get.event().originalHandCards;
						return moved[2].length == originalHandCards.length;
					})
					.set("evt", event)
					.set("originalHandCards", originalHandCards)
					.forResult();
				if (!moved) return;
				const puts = player.getCards("h", i => moved[0].includes(i) || moved[1].includes(i));
				//@ts-ignore
				const gains = cards.filter(i => moved[2].includes(i));
				if (puts.length && gains.length) {
					player.$throw(puts.length, 1000);
					await player.gain(gains, "giveAuto");
				}

				const top = moved[0];
				const bottom = moved[1];
				top.reverse();
				for (var i = 0; i < top.length; i++) {
					ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
				}
				for (i = 0; i < bottom.length; i++) {
					ui.cardPile.appendChild(bottom[i]);
				}
				game.addCardKnower(top, [player]);
				game.addCardKnower(bottom, [player]);
				player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
				game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
				game.updateRoundNumber();
			},
		},
	"kuisuimrfz": {
			audio: 2,
			usable: 1,
			enable: "phaseUse",
			getLastAction(player) {
				const cards = [];
				const history = game.getAllGlobalHistory();
				if (history.length < 2) return [];
				const last = history[history.length - 2];
				if (last["cardMove"].length < 1) return [];
				for (let evt of last["cardMove"]) {
					if (!evt.cards) continue;
					for (let card of evt.cards) {
						if (get.position(card, true) == "d" && get.type(card) != "equip" && player.hasUseTarget(card, false)) cards.push(card);
					}
				}
				return cards;
			},
			filter(event, player) {
				const cards = lib.skill.kuisuimrfz.getLastAction(player);
				return player.countCards("he") > 0 && cards.length > 0;
			},
			filterCard: true,
			position: "he",
			check(card) {
				return 6 - get.value(card);
			},
			discard: false,
			lose: false,
			async content(event, trigger, player) {
				let card = event.cards[0];
				let names = [...new Set(lib.skill.kuisuimrfz.getLastAction(player).map(i => i.name))];
				let list = [];
				for (var i = 0; i < names.length; i++) {
					var name = names[i];
					if (get.type(name) == "basic") list.push(["基本", "", name]);
					else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
				}
				const { links } = await player
					.chooseButton(["窥岁", [list, "vcard"]])
					.set("ai", button => {
						let player = get.player(),
							card = {
								name: button.link[2],
							};
						return player.getUseValue(card, undefined, true);
					})
					.forResult();
				if (!links) return;
				player.chooseUseTarget({ name: links[0][2], isCard: true }, event.cards);
			},
			ai: {
				order: 5,
				result: {
					player: 1,
				},
			},
		},
	"lianwenmrfz": {
			audio: 2,
			trigger: { player: "damageBegin4" },
			usable: 1,
			filter(event, player) {
				return event.num > 0;
			},
			check(event, player) {
				if (!event.source) return true;
				return get.attitude(event.source, player) < 0 || player.hp == 1 || (event.card && get.type2(event.card) == "trick");
			},
			prompt2(event, player) {
				return `你可以进行一次判定，若为红，此伤害-1${event.source ? `且${get.translation(event.source)}手牌上限-1直到其回合结束` : ""}`;
			},
			async content(event, trigger, player) {
				const next = player.judge(function (card) {
					const color = get.color(card);
					if (color == "red") return 4;
					return 0;
				});
				next.judge2 = function (result) {
					return result.bool == false;
				};
				const { color } = await next.forResult();
				if (color == "red") {
					trigger.num--;
					trigger.source.addTempSkill("lianwenmrfz_eff", { player: "phaseEnd" });
					trigger.source.addMark("lianwenmrfz_eff", 1, false);
				}
			},
			subSkill: {
				eff: {
					charlotte: true,
					onremove: true,
					intro: {
						content(event, player) {
							return `·手牌上限-${player.countMark("lianwenmrfz_eff")}`;
						},
					},
					mod: {
						maxHandcard: function (player, num) {
							return (num -= player.countMark("lianwenmrfz_eff"));
						},
					},
				},
			},
		},
});

translate({
	"peipeimrfz": "佩佩",
	"boqingmrfz": "博青",
	"boqingmrfz_info": "当你摸牌时，或一名角色进行判定时，你可以观看牌堆顶4张牌，并与你的手牌交换，然后你以任意顺序放回牌堆顶或牌堆底。",
	"kuisuimrfz": "窥岁",
	"kuisuimrfz_info": "出牌阶段限一次，你可以将一张牌当本局游戏中上一回合进入弃牌堆的一张非装备牌使用。",
	"lianwenmrfz": "莲纹",
	"lianwenmrfz_info": "每回合限一次，当你受到伤害时，你可以进行判定，若为红色，此伤害-1且伤害来源手牌上限-1直到其回合结束。",
});

characterTitle("peipeimrfz", "<font color=#00868B>往昔传承</font>");

characterIntro("peipeimrfz", "佩佩，萨尔贡知名的历史学者，身世显赫，是萨尔贡一位尊贵帕夏的长女。现作为外勤干员协助罗德岛在萨尔贡当地进行一系列考古勘察。");
