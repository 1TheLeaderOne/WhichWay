import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yumaobimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "bomrfz",
			hp: 4,
			skills: ["tiaojiumrfz","rujingmrfz"],
		});

skill({
	"tiaojiumrfz": {
			audio: 2,
			audioname: ["longshelanmrfz"],
			derivation: ["jiu"],
			enable: "chooseToUse",
			filterCard: function (card, player) {
				if (ui.selected.cards.length) {
					return get.color(card) != get.color(ui.selected.cards[0]);
				}
				return true;
			},
			complexCard: true,
			selectCard: 2,
			viewAs: {
				name: "jiu",
			},
			position: "hs",
			viewAsFilter: function (player) {
				var hs = player.getCards("hs");
				if (hs.length < 2) return false;
				var bool = false,
					map = {};
				for (var card of hs) {
					var color = get.color(card);
					if (!map[color]) map[color] = true;
					else {
						bool = true;
						break;
					}
				}
				if (!bool) return false;
				return true;
			},
			prompt: "【调酒】:将两张不同颜色的手牌当酒使用",
			check: function (card) {
				return 10 - get.value(card);
			},
			ai: {
				threaten: 1.5,
				order: () => {
					let player = _status.event.player;
					if (_status.event.dying) return 9;
					let cards = player.getCards("h", card => {
						return get.type(card) != "equip" && get.type(card) != "delay";
					});
					if (cards.length > 0) return 13;
					return 0;
				},
				result: {
					target: 1,
				},
				tag: {
					save: 1,
					recover: 0.1,
				},
			},
		},
	"rujingmrfz": {
			audio: 2,
			direct: true,
			lastDo: true,
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.rujingmrfz;
					storage["number"].sort(function (a, b) {
						return a - b;
					});
					var str1 = "",
						str2 = "";
					if (storage["number"].length) str1 = str1 + storage["number"];
					else str1 = "无";
					if (storage["suit"].length) str2 = str2 + get.translation(storage["suit"]);
					else str2 = "无";
					return "记录的数字:" + str1 + "</br>" + "记录的花色:" + str2;
				},
			},
			init: player => {
				player.storage.rujingmrfz = {
					suit: [],
					number: [],
					ban: [],
					card: [],
				};
			},
			onremove: player => {
				delete player.storage.rujingmrfz;
			},
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				return event.card && (event.card.number || event.card.suit);
			},
			async content(event, trigger, player) {
				if (!player.storage.rujingmrfz)
					player.storage.rujingmrfz = {
						suit: [],
						number: [],
						ban: [],
						card: [],
					};
				var card = trigger.card,
					storage = player.storage.rujingmrfz;
				if (!storage["card"].includes(trigger.card)) {
					if (card.number && !storage["number"].includes(card.number)) {
						player.storage.rujingmrfz["number"].add(card.number);
					}
					if (card.suit && !storage["suit"].includes(card.suit) && card.suit != "none") {
						player.storage.rujingmrfz["suit"].add(card.suit);
					}
				} else player.storage.rujingmrfz["card"].remove(trigger.card);
			},
			group: ["rujingmrfz_addcount", "rujingmrfz_clear"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					lastDo: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.storage.rujingmrfz;
					},
					async content(event, trigger, player) {
						player.storage.rujingmrfz["ban"] = [];
					},
				},
				addcount: {
					audio: "rujingmrfz",
					trigger: { player: "useCard" },
					direct: true,
					filter: function (event, player) {
						var storage = player.storage.rujingmrfz;
						if (!event.card || !(event.card.number && event.card.suit)) return false;
						var cardNumber = event.card.number;
						var cardSuit = event.card.suit;
						if (!storage["number"].includes(cardNumber) && !storage["suit"].includes(cardSuit)) return false;
						//@ts-ignore
						if (get.type(event.card) == "equip" || get.type(event.card) == "delay") return false;
						if (["shan", "wuxie"].includes(event.card.name)) return false;
						return (
							(storage["number"].includes(cardNumber) && !storage["ban"].includes("number")) ||
							(storage["suit"].includes(cardSuit) && !storage["ban"].includes("suit"))
						);
					},
					async content(event, trigger, player) {
						let result;
						let storage = player.storage.rujingmrfz,
							number = trigger.card.number,
							suit = trigger.card.suit;
						const list = [];
						if (storage["number"].includes(number) && !storage["ban"].includes("number")) list.add("number");
						if (storage["suit"].includes(suit) && !storage["ban"].includes("suit")) list.add("suit");
						event.list = list;
						if (list.length == 1) {
							var goon = true;
							if (trigger.card.name == "du") goon = false;
							if (trigger.card.name == "jiedao") goon = false;
							if (trigger.card.name == "tao" && player.getDamagedHp() == 1) goon = false;
							if (list.includes("suit")) {
								result = await player
									.chooseBool("【入境】:是否令此牌额外结算一次？（同花色）")
									.set("ai", function () {
										return _status.event.goon;
									})
									.set("goon", goon)
									.forResult();
							} else {
								result = await player
									.chooseBool("【入境】:是否令此牌额外结算一次？（同点数）")
									.set("ai", function () {
										return _status.event.goon;
									})
									.set("goon", goon)
									.forResult();
							}
						} else {
							result = await player
								.chooseControl("点数", "花色", "全部", "cancel2")
								.set("prompt", "【入境】:请选择一项")
								.set("prompt2", "选择‘点数’或者‘花色’为额外结算一次，选择‘全部’为额外结算两次，选择‘取消’为不发动此技能")
								.set("ai", function () {
									var player = _status.event.player,
										card = _status.event.card;
									if (card.name == "du" || card.name == "jiedao") return "cancel2";
									if (card.name == "tao") {
										var hp = player.getDamagedHp();
										switch (hp) {
											case 0:
												return "cancel2";
											case 1:
												return ["点数", "花色"].randomGet();
											default:
												return "全部";
										}
									}
									return "全部";
								})
								.set("card", trigger.card)
								.forResult();
						}

						if (result?.bool) {
							player.storage.rujingmrfz["card"].add(trigger.card);
							if (event.list.includes("suit")) {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("suit");
								player.storage.rujingmrfz["suit"].remove(suit);
							} else {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("number");
								player.storage.rujingmrfz["number"].remove(number);
							}
						} else if (result.control != "cancel2" && result.bool != false) {
							player.storage.rujingmrfz["card"].add(trigger.card);
							if (result.control == "点数") {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("number");
								player.storage.rujingmrfz["number"].remove(number);
							} else if (result.control == "花色") {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("suit");
								player.storage.rujingmrfz["suit"].remove(suit);
							} else {
								trigger.effectCount += 2;
								player.storage.rujingmrfz["ban"].add("suit");
								player.storage.rujingmrfz["suit"].remove(suit);
								player.storage.rujingmrfz["ban"].add("number");
								player.storage.rujingmrfz["number"].remove(number);
							}
						}
					},
				},
			},
		},
});

translate({
	"yumaobimrfz": "羽毛笔",
	"tiaojiumrfz": "调酒",
	"tiaojiumrfz_info": "①你可以将两张颜色不同的手牌当作【酒】使用。</br>②锁定技，你使用的【酒】的描述中‘本回合目标角色下一张使用的【杀】的伤害值基数+1’改成‘本回合目标角色下一张使用的基本牌（【酒】除外）和非延时锦囊牌额外结算一次’。",
	"rujingmrfz": "入境",
	"rujingmrfz_info": "①锁定技，当你使用牌后，你记录此牌的点数和花色。②出牌阶段每项限一次，当你使用牌时，若【入境①】中包含此牌的[①点数/②花色]，你可以令此牌额外结算一次，然后你清除【入境①】中记录的该[①点数/②花色]且此牌的点数和花色不能被【入境①】记录。",
});

characterIntro("yumaobimrfz", "羽毛笔，真正玻利瓦尔人某中尉之女，父亲死后被父亲战友潘乔收养，成为其养女，而后一同辗转至多索雷斯。</br>多索雷斯事件后，与龙舌兰一同来到罗德岛，由于身份特殊，经过会议审查，最终同意其加入罗德岛。");
