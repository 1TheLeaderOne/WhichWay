import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("spshihuaiyamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "longmrfz",
			hp: 3,
			skills: ["mianzaimrfz","zhijinmrfz"],
		});

skill({
	"zhijinmrfz": {
			mod: {
				aiOrder: function (player, card, num) {
					if (typeof card == "object" && player.isPhaseUsing()) {
						var evt = lib.skill.zhijinmrfz.getLastUsed(player);
						if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) {
							return num + 10;
						}
					}
				},
			},
			marktext: "钱",
			intro: {
				name: "钱",
				content: "共有#个钱",
			},
			audio: 4,
			trigger: { player: "useCard" },
			forced: true,
			getLastUsed: function (player, event) {
				var history = player.getAllHistory("useCard");
				var index;
				if (event) index = history.indexOf(event) - 1;
				else index = history.length - 1;
				if (index >= 0) return history[index];
				return false;
			},
			filter: function (event, player) {
				var evt = lib.skill.dcjianying.getLastUsed(player, event);
				if (!evt || !evt.card) return false;
				//@ts-ignore
				return lib.suit.includes(get.suit(evt.card)) && get.suit(evt.card) == get.suit(event.card);
			},
			async content(event, trigger, player) {
				player.addMark("zhijinmrfz");
			},
			group: ["zhijinmrfz_round", "zhijinmrfz_use"],
			subSkill: {
				use: {
					audio: "zhijinmrfz",
					enable: ["chooseToUse", "chooseToRespond"],
					filter: function (event, player) {
						var vcards = [],
							list = [],
							mark = player.countMark("zhijinmrfz");
						if (mark >= 1) list.push("sha");
						if (mark >= 2) list.push("juedou");
						if (mark >= 3) list.push("wuzhong");
						if (mark >= 4) list.push("tao");
						if (mark >= 5) list.push("wanjian");
						if (!player.isPhaseUsing() || player.countMark("zhijinmrfz") == 0 || list.length == 0) return false;
						for (var name of list) {
							if (event.filterCard({ name: name, isCard: false }, player, event)) return true;
						}
						return false;
					},
					chooseButton: {
						dialog: function (event, player) {
							var vcards = [],
								list = [],
								mark = player.countMark("zhijinmrfz");
							if (mark >= 1) list.push("sha");
							if (mark >= 2) list.push("juedou");
							if (mark >= 3) list.push("wuzhong");
							if (mark >= 4) list.push("tao");
							if (mark >= 5) list.push("wanjian");
							for (var name of list) {
								const card = { name: name };
								if (event.filterCard(card, player, event)) {
									if (name == "sha") {
										for (var j of lib.inpile_nature) {
											if (j != "fire") continue;
											vcards.push(["基本", "", "sha", j]);
										}
									} else if (get.type(name) == "trick") {
										vcards.push(["锦囊", "", name]);
									} else if (get.type(name) == "basic") {
										vcards.push(["基本", "", name]);
									}
								}
							}
							var dialog = ui.create.dialog("掷金", [vcards, "vcard"], "hidden");
							//@ts-ignore
							dialog.direct = true;
							return dialog;
						},
						check: function (button) {
							var player = _status.event.player;
							var recover = 0,
								lose = 1,
								players = game.filterPlayer(),
								//@ts-ignore
								choose = button.link[2];
							var mark = player.countMark("zhijinmrfz");
							if (mark >= 5) {
								if (player.hp < 3) return choose == "tao" ? 2 : -1;
								for (var i = 0; i < players.length; i++) {
									var att = get.attitude(player, players[i]);
									if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
										//@ts-ignore
										return button.link[2] == "juedou" ? 2 : -1;
									}
									if (att < 0) lose++;
									if (att > 0 && players[i].hp > 2) lose = lose - 0.5;
									if (att > 0 && players[i].hp < 2) lose--;
									//@ts-ignore
									if (att > 2 && players[i] == 1) lose -= 3;
								}
								if (lose > 0) return choose == "wanjian" ? 1 : -1;
								if (
									player.countCards("h", function (card) {
										return (card.name = "sha");
									}) >= player.getCardUsable("sha") ||
									player.getCardUsable("sha") == 0
								)
									return choose == "wuzhong" ? 1 : -1;
								return choose == "sha" ? 1 : -1;
							}
							if (mark >= 4) {
								if (player.hp < 3) return choose == "tao" ? 1 : -1;
								for (var i = 0; i < players.length; i++) {
									var att = get.attitude(player, players[i]);
									if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
										//@ts-ignore
										return button.link[2] == "juedou" ? 2 : -1;
									}
								}
								if (
									player.countCards("h", function (card) {
										return (card.name = "sha");
									}) >= player.getCardUsable("sha") ||
									player.getCardUsable("sha") == 0
								)
									return choose == "wuzhong" ? 1 : -1;
								return choose == "sha" ? 1 : -1;
							}
							if (mark >= 3) {
								for (var i = 0; i < players.length; i++) {
									var att = get.attitude(player, players[i]);
									if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
										//@ts-ignore
										return button.link[2] == "juedou" ? 2 : -1;
									}
								}
								if (
									player.countCards("h", function (card) {
										return (card.name = "sha");
									}) >= player.getCardUsable("sha") ||
									player.getCardUsable("sha") == 0
								)
									return choose == "wuzhong" ? 1 : -1;
								return choose == "sha" ? 1 : -1;
							}
							if (mark >= 2) {
								for (var i = 0; i < players.length; i++) {
									var att = get.attitude(player, players[i]);
									if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
										//@ts-ignore
										return button.link[2] == "juedou" ? 2 : -1;
									}
								}
								return choose == "sha" ? 1 : -1;
							}
							return choose == "sha" ? 1 : -1;
						},
						backup: function (links, player) {
							return {
								filterCard: () => true,
								selectCard: 1,
								viewAs: {
									name: links[0][2],
									nature: links[0][3],
									isCard: false,
								},
								position: "he",
								popname: true,
								async precontent(event, trigger, player) {
									const card = event.result.card?.name,
										mark = player.countMark("zhijinmrfz");
									if (card == "sha") {
										if (mark == 1) player.draw();
										player.removeMark("zhijinmrfz");
									}
									if (card == "juedou") {
										if (mark == 2) player.draw();
										player.removeMark("zhijinmrfz", 2);
									}
									if (card == "wuzhong") {
										if (mark == 3) player.draw();
										player.removeMark("zhijinmrfz", 3);
									}
									if (card == "tao") {
										if (mark == 4) player.draw();
										player.removeMark("zhijinmrfz", 4);
									}
									if (card == "wanjian") {
										if (mark == 5) player.draw();
										player.removeMark("zhijinmrfz", 5);
									}
								},
							};
						},
						prompt: function (links, player) {
							return "【掷金】：视为使用一张" + (links[0][3] == undefined ? "" : "火") + "【" + get.translation(links[0][2]) + "】";
						},
					},
					ai: {
						respondSha: true,
						fireAttack: true,
						order: function (item, player) {
							var player = _status.event.player;
							var event = _status.event;
							var mark = player.countMark("zhijinmrfz");
							if (event.filterCard({ name: "tao" }, player, event) && mark >= 4) {
								return 10;
							}
							if (event.filterCard({ name: "wuzhong" }, player, event) && mark >= 3) {
								return 13;
							}
							if (event.filterCard({ name: "juedou" }, player, event) && mark >= 2) {
								return 4.95;
							}
							if (event.filterCard({ name: "sha" }, player, event) && mark >= 1) {
								return 2.95;
							}
						},
						skillTagFilter: function (player, tag, arg) {
							return player.countMark("zhijinmrfz") > 0;
						},
						result: {
							player: 1,
						},
					},
				},
				round: {
					audio: "zhijinmrfz",
					trigger: { global: "roundStart" },
					forced: true,
					charlotte: true,
					async content(event, trigger, player) {
						player.addMark("zhijinmrfz");
					},
				},
			},
		},
	"mianzaimrfz": {
			markimage: "extension/WhichWay/image/skill/mianzaimrfz_money.png",
			intro: {
				content: "累计点数：#",
			},
			audio: 2,
			trigger: {
				player: "dying",
			},
			forced: true,
			async content(event, trigger, player) {
				const cards = game.cardsGotoOrdering(get.cards(6)).cards;
				let num = 0;
				for (let i = 0; i < cards.length; i++) {
					//@ts-ignore
					num = num + cards[i].number;
				}
				player.showCards(cards, get.translation(player) + "发动了【免灾】</br>点数之和为：" + num);
				if (num <= player.countMark("mianzaimrfz")) {
					player.recoverTo(3);
					//@ts-ignore
					player.drawTo(3);
					player.removeMark("mianzaimrfz", player.countMark("mianzaimrfz"), false);
				}
			},
			group: ["mianzaimrfz_number"],
			subSkill: {
				number: {
					silent: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						return event.cards && event.cards.length == 1;
					},
					async content(event, trigger, player) {
						const num = trigger.card.number;
						player.addMark("mianzaimrfz", num, false);
					},
				},
			},
		},
});

translate({
	"spshihuaiyamrfz": "琳琅诗怀雅",
	"spshihuaiyamrfz_prefix": "琳琅",
	"zhijinmrfz": "掷金",
	"zhijinmrfz_info": "①锁定技，当你使用的牌与你上一张花色相同或每轮开始时，你获得一个“钱”。②出牌阶段，你可以移除与选项数字相同的“钱”将一张牌按照下述规则当作一张牌使用：1.：火【杀】；2.：决斗；3.：无中生有；4.：桃；5.万箭齐发。若你因此移除了所有的“钱”，你摸一张牌。",
	"mianzaimrfz": "免灾",
	"mianzaimrfz_info": "锁定技，当你进入濒死阶段时，你展示牌堆顶6张牌，若其点数之和不大于你累计使用的牌的点数之和，你将体力回复至3点，手牌补至3张，然后重置你累计使用的牌的点数之和。",
});

characterTitle("spshihuaiyamrfz", "<font color=#e44997>万民安生</font>");

characterIntro("spshihuaiyamrfz", "诗怀雅，龙门近卫局局长。</br>于汐斯塔度假归来，目前仅以私人身份视情况为罗德岛工作提供协助。</br>龙门近卫局委任状</br>经会议决定，兹任命碧翠克斯·施怀雅为近卫局局长。</br>望日后长定龙门，护一方平安，万民安生。</br>此状</br>龙门总督魏彦吾</br></br>诗怀雅捏着这张薄薄的委任状，郑重地收进抽屉里。纸张之轻、之薄，字之简约，在她手中却仿佛重若千钧。");
