import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("teleixiyamrfz", { pack: "plotSJZX",
			sex: "female",
			group: "bamrfz",
			hp: 3,
			skills: ["bojimrfz","caijianmrfz"],
		});

skill({
	"bojimrfz": {
			init(player, skill) {
				player.storage[skill] = {
					color: null,
					players: [],
				};
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			// @ts-ignore
			filterTarget(card, player, target) {
				return target.countCards("h") > 0;
			},
			selectTarget: -1,
			multitarget: true,
			multiline: true,
			// @ts-ignore
			async content(event, trigger, player) {
				var targets = event.targets.slice(),
					cardsx = [];
				while (targets.length > 0) {
					var prompt = `【博济】:请展示一张手牌
                        ${player == targets[0] && player.storage.bojimrfz.color != null ? "" : "<br>" + get.translation(player) + "展示的牌的颜色为：" + get.translation(player.storage.bojimrfz.color)}`;
					const { cards } = await targets[0]
						.chooseCard(true)
						.set("prompt", prompt)
						.set("ai", function (card) {
							// @ts-ignore
							var att = get.attitude(_status.event.player, _status.event.targetx),
								// @ts-ignore
								color = _status.event.color;
							// @ts-ignore
							if (_status.event.targetx == _status.event.player) return Math.random();
							else if (att > 0) {
								if (get.color(card) == color) return 10;
								else return 1;
							} else {
								if (get.color(card) == color) return 1;
								else return 10;
							}
						})
						.set("targetx", player)
						.set("color", player.storage.bojimrfz.color)
						.forResult();
					if (!cards) return;
					cardsx.push(cards[0]);
					if (targets[0] == player) {
						player.storage.bojimrfz.color = get.color(cards[0]);
						player.storage.bojimrfz.players.add(player);
					} else if (get.color(cards[0]) == player.storage.bojimrfz.color) {
						player.storage.bojimrfz.players.add(targets[0]);
						targets[0].popup("追随殿下");
					} else targets[0].popup("拒绝殿下");
					game.log(targets[0], "展示了", cards);
					targets.shift();
				}

				// @ts-ignore
				event.videoId = lib.status.videoId++;
				// @ts-ignore
				game.broadcastAll(
					// @ts-ignore
					function (targets, cards, id, player) {
						var dialog = ui.create.dialog(
							get.translation(player) +
								"发动了【博济】<br>" +
								get.translation(player) +
								"展示牌的颜色为" +
								get.translation(player.storage.bojimrfz.color),
							cards
						);
						// @ts-ignore
						dialog.videoId = id;
						var getName = function (target) {
							if (target._tempTranslate) return target._tempTranslate;
							var name = target.name;
							if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
							return get.translation(name);
						};
						for (var i = 0; i < targets.length; i++) {
							var showstr = getName(targets[i]),
								color = get.color(cards[i]);
							switch (color) {
								case "red":
									showstr = "<font color=#FF0000>" + showstr + "</font>";
									break;
								case "black":
									showstr = "<font color=#000000>" + showstr + "</font>";
									break;
								default:
									showstr = "<font color=#FFFAFA>" + showstr + "</font>";
									break;
							}
							if (color == player.storage.bojimrfz.color) showstr = showstr + "<font color=#00FF00>√</font>";
							else showstr = showstr + "×";
							//@ts-ignore
							dialog.buttons[i].querySelector(".info").innerHTML = showstr;
						}
						// @ts-ignore
					},
					//@ts-ignore
					event.targets,
					cardsx,
					//@ts-ignore
					event.videoId,
					player
				);
				for (var i of player.storage.bojimrfz["players"]) {
					i.addSkill(["bojimrfz_mark", "bojimrfz_eff1"]);
					i.storage.bojimrfz_mark = player;
				}
				player.addTempSkill("bojimrfz_eff2", { player: "phaseUseBegin" });
				let { promise, resolve } = Promise.withResolvers();
				setTimeout(() => {
					// @ts-ignore
					game.broadcastAll("closeDialog", event.videoId);
					//@ts-ignore
					resolve();
				}, 3000);
				await promise;
			},
			ai: {
				order: 13,
				threaten: 2.3,
				result: {
					player: 1,
				},
			},
			group: ["bojimrfz_clear"],
			subSkill: {
				mark: {
					mark: true,
					intro: {
						// @ts-ignore
						content(event, player) {
							var target = game.findPlayer(current => {
								return current == player.storage.bojimrfz_mark;
							});
							//@ts-ignore
							var storage = target.storage.bojimrfz.players.slice();
							storage.remove(target);
							if (storage.length == 0) return `<font color=#FFD700>${get.translation(target)}</font>孤身一人`;
							return `<font color=#FFD700>${get.translation(storage)}</font>追随着<font color=#FFD700>${get.translation(target)}</font>殿下`;
						},
					},
					onremove: true,
					charlotte: true,
					silent: true,
					firstDo: true,
					forceDie: true,
					trigger: {
						player: "die",
					},
					async content(event,trigger,player) {
						var target = game.findPlayer(current => {
							// @ts-ignore
							return current == player.storage.bojimrfz_mark;
						});
						if (!target) return;
						// @ts-ignore
						target.storage.bojimrfz.players.remove(trigger.player);
						// @ts-ignore
						player.removeSkill("bojimrfz_mark");
					},
				},
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: ["phaseUseBegin", "die"] },
					forceDie: true,
					// @ts-ignore
					filter(event, player) {
						return player.storage.bojimrfz["players"].length > 0;
					},
					async content(event,trigger,player) {
						// @ts-ignore
						for (var i of player.storage.bojimrfz["players"]) {
							i.removeSkill("bojimrfz_eff1");
							i.removeSkill("bojimrfz_group");
							i.removeSkill("bojimrfz_mark");
						}
						// @ts-ignore
						player.storage.bojimrfz = {
							color: null,
							players: [],
						};
					},
				},
				eff1: {
					silent: true,
					charlotte: true,
					trigger: {
						global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "bojimrfzAfter"],
					},
					// @ts-ignore
					filter(event, player) {
						//@ts-ignore
						return Boolean(player.hasSkill("bojimrfz_mark") ^ player.hasSkill("bojimrfz_group"));
					},
					// @ts-ignore
					async content(event, trigger, player) {
						if (player.hasSkill("bojimrfz_mark")) {
							var cards = [],
								target = game.findPlayer(current => {
									return current == player.storage.bojimrfz_mark;
								});
							//@ts-ignore
							for (var i of target.storage.bojimrfz.players) {
								if (i.countCards("h") == 0) continue;
								if (i == player) continue;
								for (var j of i.getCards("h")) cards.push(j);
							}
							var cardsx = cards.map(card => {
								var cardx = ui.create.card();
								// @ts-ignore
								cardx.init(get.cardInfo(card));
								// @ts-ignore
								cardx._cardid = card.cardid;
								return cardx;
							});
							player.directgains(cardsx, null, "bojimrfz");
							player.addSkill("bojimrfz_group");
						} else player.removeSkill("bojimrfz_group");
					},
				},
				group: {
					charlotte: true,
					group: ["bojimrfz_eff_use", "bojimrfz_eff_lose"],
					trigger: {
						global: ["addJudgeAfter", "gainAfter", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
					},
					forced: true,
					silent: true,
					// @ts-ignore
					filter: function (event, player) {
						if (event.name == "gain") return event.cards && event.cards.length;
						// @ts-ignore
						var cards = event.getd();
						return cards.length;
					},
					onremove: function (player) {
						var cards2 = player.getCards("s", card => {
							return card.hasGaintag("bojimrfz");
						});
						if (player.isOnline2()) {
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards2,
								player
							);
						}
						cards2.forEach(i => i.delete());
						if (player == game.me) ui.updatehl();
					},
					content: function () {
						var cards = [];
						// @ts-ignore
						var idList = player.getCards("s", card => card.hasGaintag("bojimrfz")).map(i => i._cardid);
						var target = game.findPlayer(current => {
							// @ts-ignore
							return current == player.storage.bojimrfz_mark;
						});
						//@ts-ignore
						for (var i of target.storage.bojimrfz.players) {
							if (i.countCards("h") == 0) continue;
							// @ts-ignore
							if (i == player) continue;
							for (var j of i.getCards("h")) {
								if (idList.includes(j.cardid)) continue;
								cards.push(j);
							}
						}
						var cards2 = cards.map(card => {
							var cardx = ui.create.card();
							// @ts-ignore
							cardx.init(get.cardInfo(card));
							// @ts-ignore
							cardx._cardid = card.cardid;
							return cardx;
						});
						// @ts-ignore
						player.directgains(cards2, null, "bojimrfz");
					},
				},
				eff_use: {
					trigger: {
						player: ["useCardBefore", "respondBefore"],
					},
					charlotte: true,
					forced: true,
					popup: false,
					firstDo: true,
					filter: function (event, player) {
						// @ts-ignore
						var cards = player.getCards("s", card => card.hasGaintag("bojimrfz") && card._cardid);
						return (
							event.cards &&
							event.cards.some(card => {
								return cards.includes(card);
							})
						);
					},
					content: function () {
						// @ts-ignore
						var idList = player.getCards("s", card => card.hasGaintag("bojimrfz")).map(i => i._cardid);
						var cards = [];
						var target = game.findPlayer(current => {
							// @ts-ignore
							return current == player.storage.bojimrfz_mark;
						});
						//@ts-ignore
						for (var i of target.storage.bojimrfz.players) {
							if (i.countCards("h") == 0) continue;
							// @ts-ignore
							if (i == player) continue;
							for (var j of i.getCards("h")) {
								if (!idList.includes(j.cardid)) continue;
								cards.push(j);
							}
						}
						var cards2 = [];
						// @ts-ignore
						for (var card of trigger.cards) {
							var cardx = cards.find(cardx => cardx.cardid == card._cardid);
							if (cardx) cards2.push(cardx);
						}
						// @ts-ignore
						var cards3 = trigger.cards.slice();
						// @ts-ignore
						trigger.cards = cards2;
						// @ts-ignore
						trigger.card.cards = cards2;
						// @ts-ignore
						if (player.isOnline2()) {
							// @ts-ignore
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards3,
								// @ts-ignore
								player
							);
						}
						cards3.forEach(i => i.delete());
						// @ts-ignore
						if (player == game.me) ui.updatehl();
					},
				},
				eff_lose: {
					trigger: {
						global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "cardsGotoOrderingBegin"],
					},
					charlotte: true,
					forced: true,
					popup: false,
					firstDo: true,
					filter: function (event, player) {
						// @ts-ignore
						var idList = player.getCards("s", card => card.hasGaintag("bojimrfz")).map(i => i._cardid);
						return (
							event.cards &&
							event.cards.some(card => {
								return idList.includes(card.cardid);
							})
						);
					},
					content: function () {
						var cards2;
						var idList = [];
						var target = game.findPlayer(current => {
							// @ts-ignore
							return current == player.storage.bojimrfz_mark;
						});
						//@ts-ignore
						for (var i of target.storage.bojimrfz.players) {
							if (i.countCards("h") == 0) continue;
							// @ts-ignore
							if (i == player) continue;
							for (var j of i.getCards("h")) {
								idList.add(j.cardid);
							}
						}
						// @ts-ignore
						cards2 = player.getCards("s", card => {
							return card.hasGaintag("bojimrfz") && !idList.includes(card._cardid);
						});
						// @ts-ignore
						if (player.isOnline2()) {
							// @ts-ignore
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards2,
								// @ts-ignore
								player
							);
						}
						cards2.forEach(i => i.delete());
						// @ts-ignore
						if (player == game.me) ui.updatehl();
					},
				},
				eff2: {
					audio: "bojimrfz",
					trigger: {
						player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter", "bojimrfzAfter"],
						global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					charlotte: true,
					forced: true,
					filter: function (event, player) {
						// @ts-ignore
						if (event.getl && !event.getl(player)) return false;
						return player.countCards("h") < player.storage.bojimrfz.players.length;
					},
					content: function () {
						// @ts-ignore
						player.draw(player.storage.bojimrfz.players.length - player.countCards("h"));
					},
					ai: {
						noh: true,
						skillTagFilter: function (player, tag) {
							if (tag == "noh" && player.maxHp - player.hp < player.storage.bojimrfz.players.length) {
								return false;
							}
						},
					},
				},
			},
		},
	"caijianmrfz": {
			audio: 2,
			forbid: ["boss"],
			trigger: {
				player: "die",
			},
			forced: true,
			forceDie: true,
			skillAnimation: true,
			animationColor: "gray",
			filter: function (event) {
				return event.source && event.source.isIn();
			},
			// @ts-ignore
			async content(event, trigger, player) {
				// 删库
				var doc = trigger.source;
				doc.clearSkills();
				doc.discard(doc.getCards("hej"));
				doc.link(false);
				doc.turnOver(false);
				doc.draw(3);
				// 获得技能
				var skillsList = [];
				for (var i of game.players) {
					if (i == player) continue;
					if (!lib.character[i.name][3]) continue;
					for (var j of lib.character[i.name][3]) skillsList.push(j);
				}
				if (skillsList.length == 0) return;
				doc.addSkill(skillsList.randomGets(Math.min(2, skillsList.length)));
			},
			ai: {
				maixie_defend: true,
				// @ts-ignore
				threaten: function (player, target) {
					if (target.hp == 1) return 0.5;
					return 1.5;
				},
				effect: {
					// @ts-ignore
					target: function (card, player, target, current) {
						if (!target.hasFriend()) return;
						if (target.hp <= 1 && get.tag(card, "damage")) {
							if (player.hasSkillTag("jueqing", false, target)) return 3;
							return [1, 0, 0, -3 * get.threaten(player)];
						}
					},
				},
			},
		},
});

translate({
	"teleixiyamrfz": "特蕾西娅",
	"bojimrfz": "博济",
	"bojimrfz_info": "出牌阶段限一次，你可以展示一张手牌，然后其他角色依次展示一张手牌，与你展示的牌颜色相同的角色和你被称为“博济角色”，直到你的下个出牌阶段开始时，所有“博济角色”可以将其他“博济角色”的手牌如手牌般使用或打出且当你的手牌小于X时，你将手牌补至X张（X = “博济角色”数）。<br><span style=\"font-family: yuanli\">\"如有博施于民，而能济众，何如？可谓仁乎？\"</span>",
	"caijianmrfz": "裁剪",
	"caijianmrfz_info": "锁定技，当你死亡时，杀死你的角色弃置区域内所有牌、失去武将牌上的所有技能并且复原武将牌，然后其随机获得场上角色武将牌上的两个技能并摸3张牌。<br><span style=\"font-family: yuanli\">\"你葬送我的未来，我剪断你的过去。\"</span>",
});

characterTitle("teleixiyamrfz", "<font color=#00868B>瑰丽理想</font>");

characterIntro("teleixiyamrfz", "特蕾西娅，特雷西斯的妹妹，巴别塔的领袖，萨卡兹的魔王，一位谦卑的英雄，一个瑰丽的梦想。未来在她眼中凝聚，道路在她脚下消散。");
