import { lib, game, ui, get, ai, _status } from "noname";
import { skillCustomFunc } from "../../../nonameEx/custom/skill.ts";
import { whichWayTips } from "../../../tips/index.ts";
import { whichWayUtil } from "../../../utill.js";

/**
 * @type { WhichWayCharacterPack }
 */
export default {
	character: {
		maizhelunmrfz: ["female", "lymrfz", 3, ["kanchamrfz", "longtengmrfz"], []],
		palasimrfz: ["female", "mimrfz", 4, ["yingzhumrfz", "yingdanmrfz", "yingfenmrfz"], []],
		xiaguangmrfz: ["female", "kamrfz", 4, ["rencimrfz", "huiguangmrfz", "jiandunmrfz"], []],
		zaolumrfz: ["female", "wumrfz", 4, ["zhongxiemrfz", "rusuimrfz"], []],
		spshihuaiyamrfz: ["female", "longmrfz", 3, ["mianzaimrfz", "zhijinmrfz"], []],
		spsongzangrenmrfz: ["male", "lamrfz", 3, ["chongdanmrfz", "tianxuanmrfz", "shengcaimrfz"], []],
		spjiexikamrfz: ["female", "gemrfz", 4, ["yijiemrfz", "fuhuangmrfz"], []],
		weiweiannamrfz: ["female", "laimrfz", 4, ["zhanjumrfz", "zhuhuomrfz", "yunjiaomrfz"], []],
		spxiaoyangmrfz: ["female", "laimrfz", 3, ["lvmengmrfz", "rechenmrfz"], []],
		suxinmrfz: ["female", "lamrfz", 3, ["qinmingmrfz", "kongwomrfz"], []],
		hedeleimrfz: ["male", "luomrfz", "4/6", ["zhengrongmrfz", "siyanmrfz"], []],
		zhisongmrfz: ["male", "laimrfz", 4, ["kuxiumrfz", "lirenmrfz"], []],
		jianmrfz: ["female", "xiemrfz", 4, ["weiyamrfz", "zhiwumrfz"], []],
		laiyimrfz: ["female", "leimrfz", 3, ["shaobanmrfz", "tankuangmrfz"], []],
		shumrfz: ["female", "suimrfz", 3, ["kenyemrfz", "heyingmrfz", "rancuimrfz"], []],
		zuolemrfz: ["male", "yanmrfz", "4/5", ["qikumrfz", "bingzhumrfz"], []],
		elamrfz: ["female", "othermrfz", 3, ["leimingmrfz", "zuzhimrfz"], []],
		asikalunmrfz: ["female", "luomrfz", 3, ["dunyingmrfz", "niximrfz"], []],
		luogesimrfz: ["male", "luomrfz", 3, ["baidumrfz", "yuhuimrfz"], []],
		weishidaiermrfz: ["female", "bamrfz", 3, ["yuximrfz", "haolimrfz", "shezumrfz"], []],
		mowangmrfz: ["female", "luomrfz", 3, ["duanzhangmrfz", "chenaimrfz", "canxiangmrfz"], []],
		wuerbianmrfz: ["male", "a_groupmrfz", 4, ["guqianmrfz", "piweimrfz", "tongmaimrfz"], ["clan:深海猎人"]],
		nifumrfz: ["female", "luomrfz", 3, ["xunxinmrfz", "chixinmrfz", "kuixinmrfz"], []],
		narentuyamrfz: ["female", "samrfz", "4/6", ["eyanmrfz", "shafeimrfz"], []],
		peipeimrfz: ["female", "samrfz", 3, ["boqingmrfz", "kuisuimrfz", "lianwenmrfz"], []],
	},
	skill: {
		//麦哲伦
		kanchamrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			filterCard: true,
			intro: {
				content: "已发动#次【勘查】",
			},
			check: function (card) {
				var player = _status.event.player;
				if (
					player.hasCard(function (card) {
						return get.type(card) == "equip";
					})
				)
					return get.type(card) == "equip";
				if (
					player.hasCard(function (card) {
						return get.type(card) == "trick";
					})
				)
					return get.type(card) == "trick";
				return 6 - get.value(card);
			},
			content: function () {
				"step 0";
				event.cards2 = cards[0];
				player
					.chooseControl("顶部", "底部")
					.set("prompt", get.prompt("kanchamrfz"))
					.set("prompt2", "【勘查】:请选择展示牌堆顶还是牌堆底" + (player.countMark("kanchamrfz") + 3) + "张牌")
					.set("ai", function () {
						return [0, 1].randomGet();
					});
				("step 1");
				var num = player.countMark("kanchamrfz") + 3;
				if (result.index == 0) {
					var cards = game.cardsGotoOrdering(get.cards(num)).cards;
					event.cards = cards;
				} else if (result.index == 1) event.cards = get.bottomCards(num);
				else event.finish();
				("step 2");
				var list = [];
				player.showCards(event.cards, get.translation(player) + "发动了【勘查】");
				for (var i = 0; i < event.cards.length; i++) {
					if (get.type(event.cards2, "trick") != get.type(event.cards[i], "trick")) list.push(event.cards[i]);
				}
				if (list.length) player.gain(list, "gain2");
				("step 3");
				if (player.countMark("kanchamrfz") < 3) player.addMark("kanchamrfz", false);
			},
			ai: {
				order: 13,
				threaten: 1.1,
				result: {
					player: 1,
				},
			},
		},
		longtengmrfz: {
			markimage: "extension/WhichWay/image/skill/mrfz_LTF.png",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 8,
			trigger: {
				player: "loseAfter",
				global: "loseAsyncAfter",
			},
			filter: function (event, player) {
				if (player.isPhase("phaseDiscard", false)) return false;
				if (event.type != "discard" || event.getlx === false) return;
				var evt = event.getl(player);
				for (var i = 0; i < evt.cards2.length; i++) {
					if (get.position(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false) == "d") {
						return true;
					}
				}
				return false;
			},
			direct: true,
			content: function () {
				"step 0";
				var cards = [];
				var evt = trigger.getl(player);
				for (var i = 0; i < evt.cards2.length; i++) {
					if (get.position(evt.cards2[i]) == "d") {
						cards.push(evt.cards2[i]);
					}
				}
				if (!cards.length) {
					event.finish();
				} else {
					if (cards.length > 1)
						player.chooseButton(["【龙腾】:请选择一张牌", cards]).set("ai", button => {
							var player = _status.event.player;
							if (
								game.hasPlayer(function (current) {
									return get.attitude(player, current) > 2;
								})
							)
								return get.type(button.link) == "equip" || get.type(button.link, "trick") == "trick";
							return get.type(button.link) == "basic";
						});
					else {
						event.cards = cards;
						event.goto(2);
					}
				}
				("step 1");
				if (result.links && result.links.length) {
					event.cards = result.links;
				}
				("step 2");
				player.chooseTarget(
					"【龙腾】:请选择一名角色，并将" +
						get.translation(event.cards) +
						"(" +
						get.translation(get.type(event.cards[0], "trick")) +
						"牌)置于该角色武将牌上",
					function (card, player, target) {
						return target.getExpansions("longtengmrfz").length == 0;
					}
				).ai = function (target) {
					var player = _status.event.player;
					var type = get.type2(event.cards[0]);
					if (type == "basic") return -get.attitude(player, target);
					else return get.attitude(player, target) > 2;
				};
				("step 3");
				if (result.bool) {
					var target = result.targets[0];
					var type = get.type2(event.cards[0]);
					target.addToExpansion(event.cards, target, "give").gaintag.add("longtengmrfz");
					target.addSkill("longtengmrfz_changeI");
					player.logSkill("longtengmrfz", target);
				}
			},
			group: "longtengmrfz_clear",
			global: ["longtengmrfz_basic_1", "longtengmrfz_basic_2", "longtengmrfz_trick", "longtengmrfz_equip"],
			subSkill: {
				changeI: {
					silent: true,
					charlotte: true,
					trigger: { player: "longtengmrfzAfter" },
					content: function () {
						player.removeSkill("longtengmrfz_changeI");
						if (player.isTypeExpansions("longtengmrfz", "basic")) player.changeMarkImage("longtengmrfz", "mrfz_LTF");
						if (player.isTypeExpansions("longtengmrfz", "trick")) player.changeMarkImage("longtengmrfz", "mrfz_LTL");
						if (player.isTypeExpansions("longtengmrfz", "equip")) player.changeMarkImage("longtengmrfz", "mrfz_LTA");
					},
				},
				basic_1: {
					charlotte: true,
					forced: true,
					trigger: { player: "phaseDrawBegin" },
					filter: function (event, player) {
						return player.isTypeExpansions("longtengmrfz", "basic");
					},
					content: function () {
						trigger.num--;
						player.logSkill("longtengmrfz");
					},
				},
				basic_2: {
					charlotte: true,
					forced: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.isTypeExpansions("longtengmrfz", "basic");
					},
					content: function () {
						player.draw();
						player.logSkill("longtengmrfz");
					},
				},
				trick: {
					direct: true,
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						if (get.type(event.card, "trick") != "trick") return false;
						if (player.hasSkill("longtengmrfz_trick2")) return false;
						if (player.isTypeExpansions("longtengmrfz", "trick") == false) return false;
						var info = get.info(event.card);
						if (info.allowMultiple == false) return false;
						if (event.targets && !info.multitarget) {
							if (
								game.hasPlayer(function (current) {
									return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
								})
							) {
								return true;
							}
						}
						return false;
					},
					content: function () {
						"step 0";
						player
							.chooseTarget(
								"【龙腾】:你可以为此牌(" + get.translation(trigger.card) + ")额外指定一个目标",
								function (card, player, target) {
									var player = _status.event.player;
									if (_status.event.targets.includes(target)) return false;
									if (player.canUse(trigger.card, target, true) == false) return false;
									return lib.filter.targetEnabled2(_status.event.card, player, target);
								}
							)
							.set("ai", function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								return get.effect(target, trigger.card, player, player);
							})
							.set("targets", trigger.targets)
							.set("card", trigger.card);
						("step 1");
						if (result.bool) {
							if (!event.isMine() && !event.isOnline()) game.delayx();
							event.targets = result.targets;
						} else {
							event.finish();
						}
						("step 2");
						player.logSkill("longtengmrfz", event.targets);
						trigger.targets.addArray(event.targets);
						("step 3");
						if (get.tag(trigger.card, "damage")) {
							player.chooseBool("【龙腾】:是否令此牌伤害+1？");
						} else event.finish();
						("step 4");
						trigger.baseDamage++;
						player.addTempSkill("longtengmrfz_trick2");
					},
				},
				trick2: {
					charlotte: true,
				},
				equip: {
					trigger: { player: "useCard2" },
					firstDo: true,
					filter: function (event, player) {
						if (get.type(event.card) != "basic") return false;
						if (player.isTypeExpansions("longtengmrfz", "equip") == false) return false;
						return true;
					},
					content: function () {
						"step 0";
						var list = ["不计入次数限制"];
						if (
							game.hasPlayer(function (current) {
								return !trigger.targets.includes(current) && player.canUse(trigger.card, current, false);
							})
						)
							list.add("增加目标");
						if (trigger.card.name == "sha") list.add("伤害基数+1");
						player
							.chooseControl(list)
							.set("prompt", "【龙腾】:请选择一项")
							.set("ai", function () {
								var player = _status.event.player,
									num = [];
								for (var i = 0; i < list.length; i++) {
									num.add(i);
								}
								if (get.name(_status.event.TriCard) == "sha" && player.getCardUsable("sha") == 0 && player.countCards("h", "sha") > 0)
									return 0;
								if (
									get.name(_status.event.TriCard) == "sha" &&
									(player.countCards("h", "sha") == 0 || player.getCardUsable("sha") > 0)
								)
									return list.length - 1;
								if (get.name(_status.event.TriCard) == "jiu") return 0;
								return num.randomGet();
							})
							.set("TriCard", trigger.card);
						("step 1");
						game.log(player, "选择了", result.control);
						player.popup(result.control);
						player.logSkill("longtengmrfz");
						if (result.control == "不计入次数限制") {
							if (trigger.addCount !== false && (trigger.card.name == "sha" || trigger.card.name == "jiu")) {
								trigger.addCount = false;
								if (trigger.card.name == "sha") trigger.player.getStat().card.sha--;
								else trigger.player.getStat().card.jiu--;
							}
							event.finish();
						} else if (result.control == "增加目标") {
							player
								.chooseTarget(
									[1, 2],
									"【龙腾】:你可以为此牌(" + get.translation(trigger.card) + ")额外指定两个目标",
									function (card, player, target) {
										var player = _status.event.player;
										if (_status.event.targets.includes(target)) return false;
										if (player.canUse(trigger.card, target, true) == false) return false;
										return lib.filter.targetEnabled2(_status.event.card, player, target);
									}
								)
								.set("ai", function (target) {
									var trigger = _status.event.getTrigger();
									var player = _status.event.player;
									return get.effect(target, trigger.card, player, player);
								})
								.set("targets", trigger.targets)
								.set("card", trigger.card);
						} else if (result.control == "伤害基数+1") {
							if (!trigger.baseDamage) trigger.baseDamage = 1;
							trigger.baseDamage += 1;
							event.finish();
						} else event.finish();
						("step 2");
						if (result.bool) {
							for (var i = 0; i < result.targets.length; i++) {
								trigger.targets.push(result.targets[i]);
								player.line(result.targets[i]);
							}
						}
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: ["phaseZhunbeiBegin", "dieBegin"] },
					content: function () {
						game.countPlayer(function (current) {
							var cards = current.getExpansions("longtengmrfz");
							if (current.getExpansions("longtengmrfz").length) current.loseToDiscardpile(cards);
						});
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
		//嵯峨
		quanshanmrfz: {
			audio: 2,
			trigger: { global: "phaseEnd" },
			filter: function (event, player) {
				return event.player.countCards("h") == 0 && event.player != player;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.player) + "将手牌补至3张并令其获得一些负面效果？";
			},
			check: function (event, player) {
				if (event.player.hp < 2 && get.attitude(player, event.player) > 0) return true;
				if (get.attitude(player, event.player) > 2 && event.player.maxHp > 2) return Math.random() > 0.6;
				if (event.player.hp < 2) return false;
				return get.attitude(player, event.player) < 2;
			},
			content: function () {
				var target = trigger.player;
				target.drawTo(Math.min(3, target.maxHp));
				target.addSkill("quanshanmrfz_eff");
			},
			group: ["quanshanmrfz_clear", "quanshanmrfz_clear2"],
			subSkill: {
				clear2: {
					silent: true,
					charlotte: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						return event.player.hasSkill("quanshanmrfz_eff");
					},
					content: function () {
						var target = trigger.player;
						target.removeMark("quanshanmrfz_eff", target.countMark("quanshanmrfz_eff"));
						target.removeSkill("quanshanmrfz_eff");
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "dieBegin" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.hasMark("quanshanmrfz") || current.hasSkill("quanshanmrfz_eff");
						});
					},
					content: function () {
						game.countPlayer(function (current) {
							current.removeMark("quanshanmrfz_eff", current.countMark("quanshanmrfz_eff"));
							current.removeSkill("quanshanmrfz_eff");
						});
					},
				},
				eff: {
					marktext: "恶",
					intro: {
						name: "恶",
						content: "·当你造成伤害时，你获得一个‘恶’</br>·你共有#个‘恶’",
					},
					mark: true,
					trigger: { source: "damageEnd" },
					content: function () {
						"step 0";
						player.logSkill("quanshanmrfz");
						player.addMark("quanshanmrfz_eff");
						("step 1");
						if (player.getHandcardLimit() <= 0) {
							event.getParent("phaseUse").skipped = true;
						}
					},
					mod: {
						maxHandcard: function (player, num) {
							return num - player.countMark("quanshanmrfz_eff");
						},
					},
				},
			},
		},
		chuemrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0 && player.inRange(current);
				});
			},
			filterTarget: function (card, player, target) {
				return player.inRange(target) && target != player && target.countCards("h") > 0;
			},
			check: function () {
				return -1;
			},
			selectTarget: [1, 2],
			multitarget: true,
			multiline: true,
			content: function () {
				"step 0";
				event.num = 0;
				("step 1");
				var target = targets[event.num];
				var hs = target.getCards("h");
				var colred = false;
				for (var i = 0; i < hs.length; i++) {
					if (get.color(hs[i]) == "red") {
						colred = true;
						break;
					}
				}
				player.viewHandcards(target);
				game.log(player, "观看了", target, "的手牌");
				if (colred) {
					var list = [];
					for (var i = 0; i < hs.length; i++) {
						if (list.length == 2) break;
						if (get.suit(hs[i]) == "club" && !list.includes("梅花")) list.add("梅花");
						if (get.suit(hs[i]) == "spade" && !list.includes("黑桃")) list.add("黑桃");
					}
					list.add("cancel2");
					if (list.length > 1)
						player
							.chooseControl(list)
							.set("prompt", "【除恶】:请选择一个花色，然后其(" + get.translation(target) + ")弃置该花色的所有牌")
							.set("ai", function () {
								var player = _status.event.player,
									hs = target.getCards(),
									num = 0;
								for (var i = 0; i < hs.length; i++) {
									if (get.suit(hs[i]) == "club") num++;
									if (get.suit(hs[i]) == "spade") num--;
								}
								if (list.length == 1) return 0;
								if (num > 0) return 0;
								return 1;
							});
				} else if (!colred) {
					player.chooseBool("【除恶】:是否弃置其(" + get.translation(target) + ")所有手牌？");
					event.goto(3);
				} else event.finish();
				("step 2");
				var target = targets[event.num];
				if (result.control != "cancel2") {
					var hs = target.getCards();
					var dis = [];
					for (var i = 0; i < hs.length; i++) {
						if (get.suit(hs[i]) == (result.control == "黑桃" ? "spade" : "club")) dis.push(hs[i]);
					}
					target.discard(dis);
					player.draw(dis.length);
				}
				if (event.num < targets.length - 1) {
					event.num++;
					event.goto(1);
				} else event.finish();
				("step 3");
				var target = targets[event.num];
				if (result.bool) {
					var dis = target.getCards();
					target.discard(dis);
					if (target.hasMark("quanshanmrfz_eff")) {
						target.damage(target.countMark("quanshanmrfz_eff"));
						target.removeMark("quanshanmrfz_eff", target.countMark("quanshanmrfz_eff"));
					} else event.goto(5);
				}
				("step 4");
				if (event.num < targets.length - 1) {
					event.num++;
					event.goto(1);
				} else event.finish();
				("step 5");
				var target = targets[event.num];
				if (!target.hasSkill("quanshanmrfz_eff")) {
					target.drawTo(Math.min(3, target.maxHp));
					target.addSkill("quanshanmrfz_eff");
					player.popup("劝善");
					player.logSkill("quanshanmrfz", target);
				}
				event.goto(4);
			},
			ai: {
				order: 13,
				result: {
					player: 1,
					target: -1,
				},
			},
		},

		//新银灰
		xuebianmrfz: {
			intro: {
				content: "已造成#点伤害",
			},
			onremove: true,
			audio: 2,
			usable: 1,
			enable: "phaseUse",
			filter: function (event, player) {
				return (
					player.countCards("h") > 0 &&
					game.hasPlayer(function (current) {
						return current != player && current.countCards("h") > 0;
					})
				);
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			selectTarget: [1, 2],
			check: function () {
				return -1;
			},
			multitarget: true,
			multiline: true,
			content: function () {
				"step 0";
				event.cards1 = [];
				event.cards2 = [];
				event.cards3 = [];
				for (i of targets) i.addTempSkill("xuebianmrfz2", { player: "phaseEnd" });
				targets.push(player);
				targets.sortBySeat();
				var next = player
					.chooseCardOL(targets, "请选择要展示的牌", true, [1, 3])
					.set("ai", function (card) {
						return -get.value(card);
					})
					.set("source", player);
				next.aiCard = function (target) {
					var hs = target.getCards("h");
					return { bool: true, cards: [hs.randomGet()] };
				};
				next._args.remove("glow_result");
				("step 1");
				var cards = [];
				var num = 0;
				event.videoId = lib.status.videoId++;
				for (var i = 0; i < targets.length; i++) {
					for (var j = 0; j < result[i].cards.length; j++) {
						cards.push(result[i].cards[j]);
					}
				}
				event.cards = cards;
				game.log(player, "展示了", targets, "的", cards);
				game.broadcastAll(
					function (targets, cards, id, player) {
						var dialog = ui.create.dialog(get.translation(player) + "发动了【雪变】", cards);
						dialog.videoId = id;
						var getName = function (target) {
							if (target._tempTranslate) return target._tempTranslate;
							var name = target.name;
							if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
							return get.translation(name);
						};
						for (var i = 0; i < targets.length; i++) {
							if (i == 0) event.cards1 = result[i].cards;
							if (i == 1) event.cards2 = result[i].cards;
							if (i == 2) event.cards3 = result[i].cards;
							for (var j = 0; j < result[i].cards.length; j++) {
								if (i == 0) dialog.buttons[j].querySelector(".info").innerHTML = getName(targets[i]);
								else if (i == 1)
									dialog.buttons[j + result[i - 1].cards.length].querySelector(".info").innerHTML = getName(targets[i]);
								else
									dialog.buttons[j + result[i - 2].cards.length + result[i - 1].cards.length].querySelector(".info").innerHTML =
										getName(targets[i]);
								if (get.color(result[i].cards[j]) == "red") num++;
								else num--;
							}
						}
					},
					targets,
					cards,
					event.videoId,
					player
				);
				game.delay(4);
				//红多
				if (num > 0) {
					player
						.chooseTarget("【雪变】：你可以对其中一名角色造成一点伤害并令其弃置其展示的牌", function (card, player, target) {
							return target != player && target.hasSkill("xuebianmrfz2");
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.attitude(player, target) < 0;
						});
					event.targets = result;
				} else {
					for (var i = 0; i < targets.length; i++) {
						targets[i].discard(result[i].cards);
					}
				}
				("step 2");
				var list = [event.cards1, event.cards2, event.cards3];
				game.broadcastAll("closeDialog", event.videoId);
				if (result.bool) {
					result.targets[0].damage();
					for (var i = 0; i < event.targets.length; i++) {
						if (event.targets[i] == result.targets[0]) var cards = list[i];
					}
					result.targets[0].discard(cards);
				}
			},
			group: "xuebianmrfz_dam",
			subSkill: {
				dam: {
					silent: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.getParent().name == "xuebianmrfz";
					},
					content: function () {
						player.addMark("xuebianmrfz", trigger.num, false);
					},
				},
			},
			ai: {
				order: 12,
				expose: 0.1,
				result: {
					player: 1,
					target: -1,
				},
			},
		},
		xuebianmrfz2: {
			charlotte: true,
		},
		tonghemrfz: {
			audio: 2,
			derivation: ["xinyingshimrfz", "new_xinbangmrfz"],
			skillAnimation: true,
			animationColor: "thunder",
			unique: true,
			juexingji: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			filter: function (event, player) {
				return player.countMark("xuebianmrfz") >= 2 || game.roundNumber > 2;
			},
			content: function () {
				player.addMark("xinyingshimrfz", player.countMark("xuebianmrfz"), false);
				player.removeSkill("xuebianmrfz");
				player.addSkill("xinyingshimrfz");
				player.addSkill("new_xinbangmrfz");
				player.loseMaxHp();
				player.recoverTo(player.maxHp);
				player.awakenSkill("tonghemrfz");
			},
		},
		xinyingshimrfz: {
			audio: "yingshimrfz",
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return game.hasPlayer(current => lib.skill.xinyingshimrfz.filterTarget(null, player, current));
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			content: function () {
				var num = player.countMark("xinyingshimrfz") + 1;
				var max = target.countCards("h");
				if (max > num) return player.discardPlayerCard(num, target, "h", true, "visible");
				if (num >= max) return player.discardPlayerCard(max, target, "h", true, "visible");
				game.log(player, "观看了", target, "的手牌");
			},
			ai: {
				order: 13,
				expose: 0.1,
				threaten: 1.1,
				result: {
					player: 1,
					target: -1,
				},
			},
		},
		xinbangmrfz: {
			audio: 2,
			trigger: {
				player: "phaseDrawBegin2",
			},
			direct: true,
			filter: function (event, player) {
				return event.num > 0 && !event.numFixed;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				player.storage.xinbangmrfz = [];
				const num = get.copy(trigger.num);
				result = await player
					.chooseTarget(
						get.prompt("xinbangmrfz"),
						"选择至多" + get.translation(num) + "名其他角色，其选择让你定向摸牌，然后你少摸等量的牌",
						[1, num],
						(card, player, target) => {
							return player !== target;
						}
					)
					.set("ai", target => {
						const att = get.attitude(_status.event.player, target);
						return att > 0;
					})
					.forResult();

				// step 1
				if (result && result.targets) {
					event.targets = result.targets;
					trigger.num -= result.targets.length;

					// step 2, 3, 4 loop (original event.goto(2))
					for (let i = 0; i < event.targets.length; i++) {
						const target = event.targets[i];
						const att = get.attitude(target, player);
						target.addTempSkill("xinbangmrfz2", {
							player: "phaseUseEnd",
						});
						result = await target
							.chooseControl("basic", "trick", "equip")
							.set("prompt", "【兴邦】：请让" + get.translation(player) + "摸一张指定类型牌，当此牌造成伤害时，你与其各摸一张牌")
							.set("ai", () => {
								if (att > 0) return [1, 2].randomGet();
								return 0;
							})
							.forResult();

						// step 3
						const card = get.cardPile2(c => {
							return get.type(c, "trick") === result.control;
						});
						if (card) {
							const next = player.gain(card, "gain2");
							next.gaintag = ["xinbangmrfz"];
							await next;
						} else {
							player.chat("牌堆中没有" + get.translation(result.control) + "牌了！");
						}

						// step 4
						const cards = player.getCards("h", c => {
							return c.hasGaintag("xinbangmrfz");
						});
						for (const c of cards) {
							c.storage.xinbangmrfz = true;
						}
					}
				} else {
					return;
				}

				// step 5
				if (trigger.num <= 0) {
					await game.delay();
				}
			},
			group: ["xinbangmrfz_draw", "xinbangmrfz_lose"],
			subSkill: {
				draw: {
					audio: "xinbangmrfz",
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						if (!event.cards || event.cards.length > 1) return false;
						return event.card.storage && event.card.storage.xinbangmrfz == true;
					},
					forced: true,
					async content(event, trigger, player) {
						const result = await player
							.chooseTarget("【兴邦】:请选择一名其他角色，然后你与其各摸一张牌", true, function (card, player, target) {
								return target != player && target.hasSkill("xinbangmrfz2");
							})
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.attitude(player, target) > 0;
							})
							.forResult();
						if (result.targets) {
							result.targets[0].draw();
							player.draw();
						}
					},
				},
				lose: {
					silent: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return (
							player.countCards("h", function (card) {
								return card.hasGaintag("xinbangmrfz");
							}) > 0
						);
					},
					async content(event, trigger, player) {
						player.removeGaintag("xinbangmrfz");
					},
				},
			},
		},
		xinbangmrfz2: {
			charlotte: true,
			silent: true,
			onremove: true,
		},
		new_xinbangmrfz: {
			audio: "xinbangmrfz",
			frequent: true,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				var list = player.getStorage("xinbangmrfz2");
				if (!list.includes(get.type2(event.card, player))) return true;
				return false;
			},
			async content(event, trigger, player) {
				if (!player.storage.xinbangmrfz2) {
					player.addTempSkill("xinbangmrfz2");
					player.storage.xinbangmrfz2 = [];
				}
				player.storage.xinbangmrfz2.add(get.type2(trigger.card, player));
				const result = await player.draw().forResult();

				if (result.cards) {
					const card = result.cards[0],
						cards = player.getCards("h"),
						list = [];
					for (var i of cards) {
						if (i == card) continue;
						list.add(get.suit(i, player));
					}
					if (!list.includes(get.suit(card, player))) player.draw();
				}
			},
		},
		//帕拉斯
		yingzhumrfz: {
			audio: 2,
			trigger: { player: "phaseBegin" },
			direct: true,
			filter: function (event, player) {
				return !player.storage.yingzhumrfz;
			},
			content: function () {
				"step 0";
				var next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束", "cancel2").set("prompt", get.prompt("yingzhumrfz"));
				next.set("prompt2", "你可以令自己在任意阶段结束后额外执行一个该阶段");
				next.set("ai", function () {
					var player = _status.event.player;
					if (
						player.countCards("h", "sha") > player.getCardUsable("sha") &&
						game.hasPlayer(function (current) {
							return current != player && player.inRange(current) && get.attitude(player, current) < 0;
						})
					)
						return 3;
					return 2;
				});
				("step 1");
				if (result.control != "cancel2") {
					var list = [
						"yingzhumrfz_Zhunbei",
						"yingzhumrfz_judge",
						"yingzhumrfz_draw",
						"yingzhumrfz_use",
						"yingzhumrfz_discard",
						"yingzhumrfz_jieshu",
					];
					player.addTempSkill(list[result.index]);
					player.logSkill("yingzhumrfz");
				}
			},
			group: "yingzhumrfz_phase",
			subSkill: {
				phase: {
					direct: true,
					trigger: { global: "roundStart" },
					content: function () {
						"step 0";
						player.storage.yingzhumrfz = false;
						player
							.chooseTarget(
								get.prompt("yingzhumrfz"),
								"你可以选择一名其他角色，令其于任一阶段结束后额外执行一次此阶段",
								function (card, player, target) {
									return target != player;
								}
							)
							.set("ai", function (target) {
								var player = _status.event.player;
								var att = get.attitude(player, target);
								return att > 0;
							});
						("step 1");
						if (result.bool) {
							var att = get.attitude(player, result.targets[0]);
							var next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束");
							next.set("prompt", "【英祝】:请选择一个阶段," + get.translation(result.targets[0]) + "于此阶段结束后额外执行一次此阶段");
							next.set("ai", function () {
								var target = result.targets[0];
								return 2;
							});
							player.storage.yingzhumrfz = true;
							event.target = result.targets[0];
						} else event.finish();
						("step 2");
						var list = [
							"yingzhumrfz_Zhunbei",
							"yingzhumrfz_judge",
							"yingzhumrfz_draw",
							"yingzhumrfz_use",
							"yingzhumrfz_discard",
							"yingzhumrfz_jieshu",
						];
						event.target.addSkill(list[result.index]);
						player.logSkill("yingzhumrfz", event.target);
					},
					ai: {
						expose: 0.1,
					},
				},
				Zhunbei: {
					direct: true,
					trigger: { player: "phaseZhunbeiAfter" },
					mark: true,
					intro: {
						content: "于准备阶段结束后额外执行一个准备阶段",
					},
					content: function () {
						event.next.remove(player.phaseZhunbei());
						trigger.next.push(player.phaseZhunbei());
						player.removeSkill("yingzhumrfz_Zhunbei");
					},
				},
				judge: {
					direct: true,
					mark: true,
					intro: {
						content: "于判定阶段结束后额外执行一个判定阶段",
					},
					trigger: { player: "phaseJudgeAfter" },
					content: function () {
						event.next.remove(player.phaseJudge());
						trigger.next.push(player.phaseJudge());
						player.removeSkill("yingzhumrfz_judge");
					},
				},
				draw: {
					direct: true,
					mark: true,
					intro: {
						content: "于摸牌阶段结束后额外执行一个摸牌阶段",
					},
					trigger: { player: "phaseDrawAfter" },
					content: function () {
						event.next.remove(player.phaseDraw());
						trigger.next.push(player.phaseDraw());
						player.removeSkill("yingzhumrfz_draw");
					},
				},
				use: {
					direct: true,
					mark: true,
					intro: {
						content: "于出牌阶段结束后额外执行一个出牌阶段",
					},
					trigger: { player: "phaseUseAfter" },
					content: function () {
						event.next.remove(player.phaseUse());
						trigger.next.push(player.phaseUse());
						player.removeSkill("yingzhumrfz_use");
					},
				},
				discard: {
					direct: true,
					mark: true,
					intro: {
						content: "于弃牌阶段结束后额外执行一个弃牌阶段",
					},
					trigger: { player: "phaseDiscardAfter" },
					content: function () {
						event.next.remove(player.phaseDiscard());
						trigger.next.push(player.phaseDiscard());
						player.removeSkill("yingzhumrfz_discard");
					},
				},
				jieshu: {
					direct: true,
					mark: true,
					intro: {
						content: "于结束阶段结束后额外执行一个结束阶段",
					},
					trigger: { player: "phaseJieshuAfter" },
					content: function () {
						event.next.remove(player.phaseJieshu());
						trigger.next.push(player.phaseJieshu());
						player.removeSkill("yingzhumrfz_jieshu");
					},
				},
			},
		},
		yingdanmrfz: {
			audio: 2,
			silent: true,
			trigger: {
				global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"],
			},
			content: function () {
				trigger.player.addMark("yingdanmrfz", false);
			},
			group: "yingdanmrfz_draw",
			subSkill: {
				draw: {
					direct: true,
					trigger: { global: "phaseEnd" },
					content: function () {
						"step 0";
						var target = trigger.player;
						if (target.countMark("yingdanmrfz") > 6) {
							var next = player.chooseBool(
								"【英诞】:是否令" +
									(target == player ? "自己" : get.translation(target)) +
									"摸" +
									(target.countMark("yingdanmrfz") - 6) +
									"张牌？"
							);
							next.set("ai", function () {
								var player = _status.event.player;
								var target = trigger.player;
								return get.attitude(player, target) > 0;
							});
						}
						("step 1");
						var target = trigger.player;
						if (result.bool) {
							target.draw(target.countMark("yingdanmrfz") - 6);
							player.logSkill("yingdanmrfz", target);
						}
						target.removeMark("yingdanmrfz", target.countMark("yingdanmrfz"), false);
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
		yingfenmrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				if (player.storage.yingfenmrfz) return false;
				return event.card.name == "tao";
			},
			direct: true,
			content: function () {
				"step 0";
				player
					.chooseTarget(get.prompt("yingfenmrfz"), "你可以令一名其他角色恢复一点体力", function (card, player, target) {
						return target != player;
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.attitude(player, target) > 0;
					});
				("step 1");
				if (result.bool) {
					player.storage.yingfenmrfz = true;
					result.targets[0].recover();
					player.logSkill("yingfenmrfz", result.targets[0]);
				}
			},
			group: "yingfenmrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					firstDo: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.yingfenmrfz;
					},
					content: function () {
						player.storage.yingfenmrfz = false;
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
		//瑕光
		rencimrfz: {
			audio: 2,
			trigger: {
				global: "phaseEnd",
			},
			filter: function (event, player) {
				if (event.player == player || event.player.getHistory("skipped").length == 0) return false;
				return (
					lib.filter.targetEnabled({ name: "sha" }, player, event.player) &&
					(player.hasSha() || (_status.connectMode && player.countCards("h") > 0))
				);
			},
			direct: true,
			content: function () {
				player.addTempSkill("rencimrfz_dam", "useCardAfter");
				player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						"【仁慈】:是否对" + get.translation(trigger.player) + "使用一张杀？"
					)
					.set("logSkill", "rencimrfz")
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player);
			},
			subSkill: {
				dam: {
					silent: true,
					trigger: {
						source: "damageBegin",
						player: "shaMiss",
					},
					filter: function (event, player) {
						return event.card.name == "sha";
					},
					content: function () {
						if (trigger.name == "damage") trigger.num++;
						player.removeSkill("rencimrfz_dam");
					},
				},
			},
		},
		huiguangmrfz: {
			audio: 2,
			trigger: { player: "phaseEnd" },
			filter: function (event, player) {
				return player.hasMark("huiguangmrfz") && player.countMark("huiguangmrfz") <= 6;
			},
			direct: true,
			content: function () {
				"step 0";
				var num = player.countMark("huiguangmrfz") - 1;
				var list = ["准备", "判定", "摸牌", "出牌", "弃牌", "结束"];
				player
					.chooseTarget("【辉光】:你可以令一名其他角色跳过下个" + list[num] + "阶段", function (card, player, target) {
						return target != player && !target.hasSkill("huiguangmrfz_skip");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						var att = get.attitude(target, player),
							num = player.countMark("huiguangmrfz");
						if (num == 2 || num == 5) return att > 0;
						return att < 0;
					});
				("step 1");
				if (result.bool) {
					var target = result.targets[0],
						num = player.countMark("huiguangmrfz") - 1;
					target.addSkill("huiguangmrfz_skip");
					target.addMark("huiguangmrfz_skip", num + 1, false);
					player.logSkill("huiguangmrfz", target);
				}
				("step 2");
				player.removeMark("huiguangmrfz", player.countMark("huiguangmrfz"), false);
			},
			ai: {
				expose: 0.1,
			},
			group: ["huiguangmrfz_mark"],
			subSkill: {
				skip: {
					markimage: "extension/WhichWay/image/skill/sleepmrfz.png",
					intro: {
						name: "睡眠",
						content: function (event, player) {
							var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
							var num = player.countMark("huiguangmrfz_skip") - 1;
							return "跳过下个" + get.tranPhase(phase[num]);
						},
					},
					silent: true,
					trigger: { player: "phaseBegin" },
					content: function () {
						var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
						var num = player.countMark("huiguangmrfz_skip") - 1;
						player.skip(phase[num]);
						game.log(player, "跳过了", get.tranPhase(phase[num]));
						player.removeMark("huiguangmrfz_skip", player.countMark("huiguangmrfz_skip"), false);
						player.removeSkill("huiguangmrfz_skip");
					},
				},
				mark: {
					silent: true,
					trigger: {
						player: "useCardAfter",
					},
					filter: function (event, player) {
						return _status.currentPhase == player;
					},
					content: function () {
						player.addMark("huiguangmrfz", false);
					},
				},
			},
		},
		jiandunmrfz: {
			audio: 2,
			enable: ["chooseToRespond", "chooseToUse"],
			hiddenCard: function (player, name) {
				if (get.type(name) != "basic") return false;
				return player.hasCard(function (card) {
					return get.type2(card) == "trick";
				}, "hs");
			},
			filter: function (event, player) {
				if (
					!player.hasCard(function (card) {
						return get.type2(card) == "trick";
					}, "hs")
				)
					return false;
				for (var name of lib.inpile) {
					if (get.type(name) != "basic") continue;
					if (event.filterCard({ name: name }, player, event)) return true;
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (event.filterCard({ name: "sha", nature: nature }, player, event)) return true;
						}
					}
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var list = [];
					for (var name of lib.inpile) {
						if (get.type(name) != "basic") continue;
						if (event.filterCard({ name: name }, player, event)) {
							list.push(["基本", "", name]);
						}
						if (name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard({ name: name, nature: nature }, player, event)) list.push(["基本", "", "sha", nature]);
							}
						}
					}
					return ui.create.dialog("剑盾", [list, "vcard"], "hidden");
				},
				check: function (button) {
					var player = _status.event.player;
					var card = {
						name: button.link[2],
						nature: button.link[3],
					};
					if (
						_status.event.getParent().type != "phase" ||
						game.hasPlayer(function (current) {
							return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
						})
					) {
						switch (button.link[2]) {
							case "tao":
							case "shan":
								return 5;
							case "jiu": {
								if (
									player.countCards("hs", {
										type: "trick",
									}) > 2
								)
									return 3;
							}
							case "sha":
								if (button.link[3] == "fire") return 2.95;
								else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
								else return 2.9;
						}
					}
					return 0;
				},
				backup: function (links, player) {
					return {
						audio: "jiandunmrfz",
						filterCard: function (card, player, target) {
							return get.type2(card) == "trick";
						},
						complexCard: true,
						selectCard: 1,
						check: function (card, player, target) {
							return 6 - get.value(card);
						},
						viewAs: { name: links[0][2], nature: links[0][3] },
						position: "hes",
						popname: true,
					};
				},
				prompt: function (links, player) {
					return "你可以将一张锦囊牌当任意基本牌使用或打出";
				},
			},
			ai: {
				order: 3.1,
				skillTagFilter: function (player, tag, arg) {
					if (tag == "fireAttack") return true;
					if (
						!player.hasCard(function (card) {
							return get.type2(card) == "trick";
						}, "hes")
					) {
						return false;
					}
				},
				result: {
					player: 1,
				},
				respondSha: true,
				respondShan: true,
				fireAttack: true,
			},
		},
		//新星熊
		xinboremrfz: {
			audio: "banruomrfz",
			mark: false,
			markimage: "extension/WhichWay/image/skill/xinboremrfz.png",
			intro: {
				content: function (player) {
					var playerhas = game.findPlayer(function (current) {
						return current.hasSkill("xinboremrfz");
					});
					return get.translation(playerhas) + "正在保护你";
				},
			},
			group: ["xinboremrfz_choose", "xinboremrfz_card", "xinboremrfz_betarget"],
			subSkill: {
				betarget: {
					audio: "banruomrfz",
					trigger: {
						global: "useCardToPlayer",
					},
					filter: function (event, player) {
						if (event.targets > 1 || get.type(event.card) == "equip") return false;
						return event.target.hasMark("xinboremrfz") && player.getHandcardLimit() > 0;
					},
					prompt: function (event, player) {
						return "【般若】：是否令" + get.translation(event.card) + "的目标由" + get.translation(event.target) + "改为你？";
					},
					check: function (event, player) {
						var att = get.attitude(event.target, player);
						if ((event.card.name == "wuzhong" || event.card.name == "dongzhuxianji" || event.card.name == "zenbing") && att < 0)
							return true;
						return att > 0 && get.tag(event.card, "damage");
					},
					content: function () {
						"step 0";
						var target = trigger.target;
						trigger.targets.remove(target);
						trigger.getParent().triggeredTargets1.remove(target);
						trigger.untrigger();
						game.delayx();
						("step 1");
						trigger.targets.push(player);
						trigger.player.line(player, "fire");
						game.log(trigger.card, "的目标被改为", player);
						player.addMark("xinboremrfz_losehdlimit", false);
					},
					ai: {
						expose: 0.1,
					},
				},
				choose: {
					direct: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					filter: function (event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					content: function () {
						"step 0";
						player.chooseTarget(true, "【般若】：请选择一名其他角色，令其获得‘般若’标记", function (card, player, target) {
							return target != player;
						}).ai = function (target) {
							return get.attitude(player, target);
						};
						("step 1");
						if (result.bool) {
							var target = result.targets[0];
							target.addMark("xinboremrfz");
							player.logSkill("xinboremrfz", target);
							player.disableEquip("equip2");
							target.disableEquip("equip2");
							player.addSkill("xinboremrfz_handlit");
							target.addSkill("xinboremrfz_handlit");
						}
						player.addSkill("xinboremrfz_losehdlimit");
						player.removeSkill("xinboremrfz_choose");
					},
					ai: {
						expose: 0.1,
					},
				},
				card: {
					audio: "xinboremrfz",
					enable: "chooseToUse",
					hiddenCard: function (player, name) {
						if (
							player.hasSkill("xinboremrfz_usedwuxie") &&
							player.hasSkill("xinboremrfz_usedsha") &&
							player.hasSkill("xinboremrfz_usedshan")
						)
							return false;
						if (name == "wuxie" && player.hasSkill("xinboremrfz_usedwuxie")) return false;
						if (name == "sha" && player.hasSkill("xinboremrfz_usedsha")) return false;
						if (name == "shan" && player.hasSkill("xinboremrfz_usedshan")) return false;
						return (
							(name == "wuxie" || name == "sha" || name == "shan") && (player.getHandcardLimit() > 0 || player.countDisabledSlot() < 5)
						);
					},
					filter: function (event, player) {
						if (
							player.hasSkill("xinboremrfz_usedwuxie") &&
							player.hasSkill("xinboremrfz_usedsha") &&
							player.hasSkill("xinboremrfz_usedshan")
						)
							return false;
						return player.getHandcardLimit() > 0 || player.countDisabledSlot() < 5;
					},
					chooseButton: {
						dialog: function (event, player) {
							var vcards = [];
							for (var name of ["sha", "shan", "wuxie"]) {
								const card = { name: name };
								if (name == "wuxie" && player.hasSkill("xinboremrfz_usedwuxie")) continue;
								if (name == "shan" && player.hasSkill("xinboremrfz_usedshan")) continue;
								if (name == "sha" && player.hasSkill("xinboremrfz_usedsha")) continue;
								if (event.filterCard(card, player, event)) {
									//QQQ
									if (name == "sha") {
										vcards.push(["基本", "", "sha"]);
										for (var j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
									} else if (get.type(name) == "trick") {
										vcards.push(["锦囊", "", name]);
									} else if (get.type(name) == "basic") {
										vcards.push(["基本", "", name]);
									}
								}
							}
							var dialog = ui.create.dialog("般若", [vcards, "vcard"], "hidden");
							dialog.direct = true;
							return dialog;
						},
						filter: function (button, player) {
							return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
						},
						backup: function (links, player) {
							return {
								filterCard: () => false,
								selectCard: -1,
								viewAs: {
									name: links[0][2],
									nature: links[0][3],
									isCard: true,
								},
								popname: true,
								precontent: function () {
									"step 0";
									var card = event.result.card.name;
									if (card == "sha") {
										event.getParent().addCount = false;
										player.addSkill("xinboremrfz_usedsha");
									}
									if (card == "shan") player.addSkill("xinboremrfz_usedshan");
									if (card == "wuxie") player.addSkill("xinboremrfz_usedwuxie");
									player.logSkill("xinboremrfz");
									("step 1");
									var list = [];
									if (player.getHandcardLimit() > 0) list.push("手牌上限-1");
									if (player.countDisabledSlot() < 5) list.push("废除一个装备栏");
									if (list.length > 1)
										player
											.chooseControl(list)
											.set("prompt", "【般若】：请选择一项")
											.set("ai", function () {
												return 0;
											});
									else {
										if (player.getHandcardLimit() == 0)
											player.chooseToDisable().ai = function (event, player, list) {
												if (list.includes("equip5")) return "equip5";
												return list.randomGet();
											};
										else player.addMark("xinboremrfz_losehdlimit", false);
									}
									("step 2");
									if (result.index == 0) player.addMark("xinboremrfz_losehdlimit", false);
									else
										player.chooseToDisable().ai = function (event, player, list) {
											if (list.includes("equip5")) return "equip5";
											return list.randomGet();
										};
								},
							};
						},
						prompt: function (links, player) {
							return "【般若】：视为使用一张【" + get.translation(links[0][2]) + "】";
						},
					},
					ai: {
						order: function (item, player) {
							var player = _status.event.player;
							var event = _status.event;
							if (event.filterCard({ name: "sha" }, player, event)) {
								return 4;
							}
						},
						respondSha: true,
						respondShan: true,
						skillTagFilter: function (player, tag, arg) {
							if (
								player.hasSkill("xinboremrfz_usedwuxie") &&
								player.hasSkill("xinboremrfz_usedsha") &&
								player.hasSkill("xinboremrfz_usedshan")
							)
								return false;
							if (arg != "use") return false;
						},
						result: {
							player: 1,
						},
					},
				},
				losehdlimit: {
					silent: true,
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num - player.countMark("xinboremrfz_losehdlimit");
						},
					},
				},
				usedshan: {
					silent: true,
					charlotte: true,
					trigger: { global: "phaseZhunbeiBegin" },
					content: function () {
						player.removeSkill("xinboremrfz_usedshan");
					},
				},
				usedwuxie: {
					silent: true,
					charlotte: true,
					trigger: { global: "phaseZhunbeiBegin" },
					content: function () {
						player.removeSkill("xinboremrfz_usedwuxie");
					},
				},
				usedsha: {
					silent: true,
					charlotte: true,
					trigger: { global: "phaseZhunbeiBegin" },
					content: function () {
						player.removeSkill("xinboremrfz_usedsha");
					},
				},
				handlit: {
					silent: true,
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + 1;
						},
					},
				},
			},
		},
		xinyizhongmrfz: {
			audio: "yizhongmrfz",
			forced: true,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.hp >= player.getHandcardLimit();
			},
			content: function () {
				var num = 5 - player.countDisabledSlot() - 1;
				player.addMark("xinyizhongmrfz", num, false);
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + player.countMark("xinyizhongmrfz");
				},
			},
			group: "xinyizhongmrfz_lose",
			subSkill: {
				lose: {
					audio: "yizhongmrfz",
					direct: true,
					charlotte: true,
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.source != undefined && event.num > 0 && event.source.hasMark("xinboremrfz");
					},
					content: function () {
						player.removeSkill("xinboremrfz");
						player.removeSkill("xinyizhongmrfz_lose");
					},
				},
			},
		},

		//新缪尔赛思
		yuanliumrfz: {
			audio: "kaiyuanmrfz",
			trigger: {
				player: "enterGame",
				global: "phaseBefore",
			},
			direct: true,
			locked: false,
			markimage: "extension/WhichWay/image/skill/miumiuliuxingmrfz.png",
			intro: {
				name: "流形",
				content: "#/3",
			},
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			content: function () {
				"step 0";
				player
					.chooseControl()
					.set("choiceList", ["令一名角色摸两张牌", "获得一个‘流形’"])
					.set("ai", function () {
						return [0, 1].randomGet();
					});
				("step 1");
				if (result.index == 0) {
					player.chooseTarget(true, "【源流】：令一名角色摸两张牌").ai = function (target) {
						return get.attitude(player, target) > 2;
					};
				} else {
					player.logSkill("kaiyuanmrfz");
					player.addMark("yuanliumrfz");
					event.finish();
				}
				("step 2");
				if (result.bool) {
					var target = result.targets[0];
					target.draw(2);
					player.logSkill("kaiyuanmrfz");
				}
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + player.countMark("yuanliumrfz");
				},
			},
			group: "yuanliumrfz_get",
			subSkill: {
				get: {
					direct: true,
					trigger: {
						player: "phaseUseEnd",
					},
					filter: function (event, player) {
						return (
							player.getHistory("useCard", function (evt) {
								return evt.getParent("phaseUse") == event;
							}).length > 0 && player.countMark("yuanliumrfz") < 3
						);
					},
					content: function () {
						var list = [],
							mark = player.countMark("yuanliumrfz");
						player.getHistory("useCard", function (evt) {
							if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
						});
						if (mark + list.length > 3) player.addMark("yuanliumrfz", 3 - mark);
						else player.addMark("yuanliumrfz", list.length);
						player.logSkill("yuanliumrfz");
					},
				},
			},
		},
		xinjingshuimrfz: {
			audio: "jingshuimrfz",
			trigger: {
				player: "useCardToPlayered",
			},
			usable: 1,
			filter: function (event, player) {
				var evt = event.getParent("phaseUse"),
					type = get.type(event.card);
				if (type != "basic" && type != "trick") return false;
				if (!evt || evt.player != player) return false;
				if (!player.hasMark("yuanliumrfz")) return false;
				return event.targets && event.targets.length == 1;
			},
			prompt: function (event, player) {
				return "是否移除所有‘源流’并令【" + get.translation(event.card.name) + "】额外结算" + player.countMark("yuanliumrfz") + "次？";
			},
			check: function (event, player) {
				return !get.tag(event.card, "norepeat");
			},
			content: function () {
				var num = player.countMark("yuanliumrfz");
				trigger.getParent().effectCount += num;
				player.removeAllmark("yuanliumrfz");
			},
		},
		shuilingmrfz: {
			audio: "liuxingmrfz",
			forced: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				if (player.hasSkill("shuilingmrfz_ban")) return false;
				return !event.nature && player.countCards("h") >= player.hp;
			},
			content: function () {
				trigger.num--;
				player.addTempSkill("shuilingmrfz_ban", "phaseEnd");
			},
			subSkill: {
				ban: {
					charlotte: true,
					mark: true,
					intro: {
						content: "本回合已发动过【水灵】",
					},
				},
			},
		},
		//新归溟幽灵鲨
		xinyongwomrfz: {
			audio: "yongwomrfz",
			zhuanhuanji: true,
			locked: false,
			mark: true,
			marktext: "☯",
			intro: {
				content: function (storage, player, skill) {
					if (player.storage.xinyongwomrfz) return "阳：当你进入濒死状态时，你可以回复至一点体力";
					return "阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害";
				},
			},
			init: function (player) {
				player.storage.xinyongwomrfz = true;
			},
			trigger: { player: "dying" },
			filter: function (event, player) {
				return player.storage.xinyongwomrfz;
			},
			prompt: "【拥我】：是否将体力回复至1点",
			content: function () {
				player.recoverTo(1);
				player.changeZhuanhuanji("xinyongwomrfz");
			},
			group: "xinyongwomrfz_ying",
			subSkill: {
				//阴
				ying: {
					audio: "xinyongwomrfz",
					trigger: { player: "turnOverAfter" },
					filter: function (event, player) {
						return event.player.isTurnedOver() && !player.storage.xinyongwomrfz;
					},
					prompt: "【拥我】：你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。",
					check: function (event, player) {
						return game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) < 0;
						});
					},
					content: function () {
						"step 0";
						var choice = 0,
							max = 0;
						for (var i = 0; i < game.players.length; i++) {
							var target = game.players[i],
								tmp1 = 0;
							if (target == player) continue;
							if (!player.inRange(target)) continue;
							if (get.attitude(player, target) > 0) continue;
							if (target.countCards("e") > 0) tmp1++;
							if (target.countCards("h") > 0) tmp1++;
							if (target.countCards("j") > 0) tmp1--;
							if (tmp1 > max) max = tmp1;
						}
						if (
							game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) < 0 && current.hp <= 1;
							}) ||
							max < 2
						)
							choice = 1;
						player.draw(2);
						player
							.chooseControl()
							.set("choiceList", ["弃置你攻击范围内一名其他角色区域内各一张牌", "对你攻击范围内的一名其他角色造成一点伤害"])
							.set("ai", function () {
								return choice;
							});
						event.choice = choice;
						("step 1");
						event.index = result.index;
						if (
							game.hasPlayer(function (current) {
								return current != player && player.inRange(current);
							})
						) {
							player
								.chooseTarget("【拥我】:请选择一名其他角色", true, function (rd, player, target) {
									return target != player && player.inRange(target);
								})
								.set("ai", function (target) {
									var player = _status.event.player,
										att = get.attitude(player, target);
									if (event.choice == 0) {
										if (target.countCards("e") > 0) return att < 0 && target.countCards("e") > 0;
										else return att < 0;
									} else return get.damageEffect(target, player, player) > 0;
								});
						} else event.finish();
						("step 2");
						if (result.bool) {
							var target = result.targets[0];
							if (event.index == 0) {
								var num = 0;
								if (target.countCards("h")) num++;
								if (target.countCards("e")) num++;
								if (target.countCards("j")) num++;
								if (num) {
									player.discardPlayerCard(target, num, "hej", true).set("filterButton", function (button) {
										for (var i = 0; i < ui.selected.buttons.length; i++) {
											if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) return false;
										}
										return true;
									});
								}
							} else target.damage("player");
							player.logSkill("yongwomrfz", target);
							player.changeZhuanhuanji("xinyongwomrfz");
						}
					},
				},
			},
		},
		douzhengmrfz: {
			audio: 2,
			trigger: { global: "phaseEnd" },
			prompt: function (event, player) {
				return "【斗争】：是否失去所有体力并视为对" + get.translation(event.player) + "使用一张【杀】？";
			},
			filter: function (event, player) {
				return event.player != player;
			},
			check: function (event, player) {
				if (get.attitude(player, event.player) > 0) return false;
				return (
					player.countCards("h", function (card) {
						return card.name == "tao" || card.name == "jiu";
					}) > 0 || player.storage.xinyongwomrfz == true
				);
			},
			content: function () {
				player.loseHp(player.hp);
				player.useCard({ name: "sha", isCard: true }, false, trigger.player);
				player.turnOver();
			},
			ai: {
				expose: 0.1,
			},
		},
		shensuimrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "loseHpEnd" },
			filter: function (event, player) {
				return event.num > 1 && player.hujia < 1;
			},
			content: function () {
				player.changeHujia(trigger.num);
			},
			group: "shensuimrfz_change",
			subSkill: {
				change: {
					direct: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return !player.storage.xinyongwomrfz;
					},
					content: function () {
						player.changeZhuanhuanji("xinyongwomrfz");
					},
				},
			},
		},
		//早露
		zhongxiemrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCardToPlayered",
			},
			filter: function (event, player) {
				if (event.card.name != "sha" || typeof get.number(event.card) != "number") return false;
				return event.target.countCards("h") <= get.number(event.card);
			},
			content: function () {
				trigger.getParent().directHit.add(trigger.target);
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					if (tag == "directHit_ai") {
						if (arg.card.name == "sha" && typeof get.number(arg.card) == "number")
							return arg.card.name == "sha" && arg.target.countCards("h") <= get.number(arg.card);
					}
					return false;
				},
			},
			mod: {
				attackRange: function (player, num) {
					return (num += 2);
				},
			},
			group: ["zhongxiemrfz_damage", "zhongxiemrfz_wushi"],
			subSkill: {
				damage: {
					audio: "zhongxiemrfz",
					forced: true,
					trigger: { source: "damageBegin" },
					filter: function (event, player) {
						return event.player.hujia > 0;
					},
					content: function () {
						trigger.num += trigger.player.hujia;
					},
				},
				wushi: {
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event) {
						return event.card.name == "sha";
					},
					direct: true,
					logTarget: "target",
					content: function () {
						trigger.target.addTempSkill("qinggang2");
						trigger.target.storage.qinggang2.add(trigger.card);
						trigger.target.markSkill("qinggang2");
					},
					ai: {
						unequip_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg && arg.name == "sha") return true;
							return false;
						},
					},
				},
			},
		},
		rusuimrfz: {
			audio: 2,
			trigger: { source: "damageBegin2" },
			filter: function (event, player) {
				var num = 0,
					target = event.player;
				if (!event.card) return false;
				if (target.countCards("h") >= target.hp) num++;
				if (target.countCards("e") > 0) num++;
				if (target.getDamagedHp() <= target.hp) num++;
				return event.player != player && event.card.name == "sha" && num != 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			prompt: function (event, player) {
				var num = 0,
					target = event.player;
				if (target.countCards("h") >= target.hp) num++;
				if (target.countCards("e") > 0) num++;
				if (target.getDamagedHp() <= target.hp) num++;
				if (num < 3) return "【入髓】：是否令" + get.translation(target) + "弃置" + num + "张牌";
				else return "【入髓】：是否令" + get.translation(target) + "弃置" + num + "张牌并令此杀伤害+1";
			},
			prompt2: false,
			content: function () {
				var num = 0,
					target = trigger.player;
				if (target.countCards("h") >= target.hp) num++;
				if (target.countCards("e") > 0) num++;
				if (target.getDamagedHp() <= target.hp) num++;
				target.chooseToDiscard("he", true, "【入髓】：请弃置" + num + "张牌", num);
				if (num == 3) trigger.num++;
			},
		},
		//琳琅诗怀雅
		zhijinmrfz: {
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
				return lib.suit.includes(get.suit(evt.card)) && get.suit(evt.card) == get.suit(event.card);
			},
			content: function () {
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
							dialog.direct = true;
							return dialog;
						},
						check: function (button) {
							var player = _status.event.player;
							var recover = 0,
								lose = 1,
								players = game.filterPlayer(),
								choose = button.link[2];
							var mark = player.countMark("zhijinmrfz");
							if (mark >= 5) {
								if (player.hp < 3) return choose == "tao" ? 2 : -1;
								for (var i = 0; i < players.length; i++) {
									var att = get.attitude(player, players[i]);
									if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
										return button.link[2] == "juedou" ? 2 : -1;
									}
									if (att < 0) lose++;
									if (att > 0 && players[i].hp > 2) lose = lose - 0.5;
									if (att > 0 && players[i].hp < 2) lose--;
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
								precontent: function () {
									var card = event.result.card.name,
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
					content: function () {
						player.addMark("zhijinmrfz");
					},
				},
			},
		},
		mianzaimrfz: {
			markimage: "extension/WhichWay/image/skill/mianzaimrfz_money.png",
			intro: {
				content: "累计点数：#",
			},
			audio: 2,
			trigger: {
				player: "dying",
			},
			forced: true,
			content: function () {
				var cards = game.cardsGotoOrdering(get.cards(6)).cards,
					num = 0;
				for (var i = 0; i < cards.length; i++) {
					num = num + cards[i].number;
				}
				player.showCards(cards, get.translation(player) + "发动了【免灾】</br>点数之和为：" + num);
				if (num <= player.countMark("mianzaimrfz")) {
					player.recoverTo(3);
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
					content: function () {
						var num = trigger.card.number;
						player.addMark("mianzaimrfz", num, false);
					},
				},
			},
		},
		//圣约送葬人
		chongdanmrfz: {
			audio: 2,
			frequent: true,
			subfrequent: ["chongdanmrfz_player"],
			trigger: {
				source: "damageSource",
			},
			filter: function (event, player) {
				if (player.countCards("h") == 0 && player.getDamagedHp() == 0) return false;
				return !player.storage.chongdanmrfz;
			},
			content: function () {
				"step 0";
				player.storage.chongdanmrfz = true;
				if (player.getDamagedHp() == 0) player.draw(player.hp);
				else {
					player
						.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？")
						.set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力")
						.set("ai", function () {
							var player = _status.event.player;
							var hp = player.hp;
							if (player.countCards("h") == 0) return 0;
							if (hp < 2) return 1;
							if (player.countCards("j") > 0) return 1;
							if (
								player.isPhaseUsing() &&
								player.countCards("h", function (card) {
									return card.name == "tao";
								}) >= player.getDamagedHp()
							)
								return 1;
							return 0;
						});
				}
				("step 1");
				if (result.bool) {
					player.draw(player.hp);
				} else {
					player.recover(player.countCards("h"));
				}
			},
			mod: {
				cardEnabled: function (card, player) {
					if (player.countMark("chongdanmrfz_lim") >= 2 * player.maxHp) return false;
				},
				cardUsable: function (card, player) {
					if (player.countMark("chongdanmrfz_lim") >= 2 * player.maxHp) return false;
				},
				cardSavable: function (card, player) {
					if (player.countMark("chongdanmrfz_lim") >= 2 * player.maxHp) return false;
				},
			},
			ai: {
				presha: true,
				pretao: true,
			},
			group: ["chongdanmrfz_clear", "chongdanmrfz_player", "chongdanmrfz_lim"],
			subSkill: {
				lim: {
					mark: true,
					intro: {
						content: "已使用：#张牌",
					},
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: {
						player: "useCard",
					},
					filter: function (event, player) {
						return player.countMark("chongdanmrfz_lim") < 2 * player.maxHp;
					},
					content: function () {
						player.addMark("chongdanmrfz_lim", false);
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						if (player.storage.chongdanmrfz_player) player.storage.chongdanmrfz_player = false;
						if (player.storage.chongdanmrfz) player.storage.chongdanmrfz = false;
						if (player.countMark("chongdanmrfz_lim") > 0)
							player.removeMark("chongdanmrfz_lim", player.countMark("chongdanmrfz_lim"), false);
					},
				},
				player: {
					audio: "chongdanmrfz",
					trigger: {
						player: "damageEnd",
					},
					filter: function (event, player) {
						if (player.countCards("h") == 0 && player.getDamagedHp() == 0) return false;
						return !player.storage.chongdanmrfz_player;
					},
					content: function () {
						"step 0";
						player.storage.chongdanmrfz_player = true;
						if (player.getDamagedHp() == 0) player.draw(player.hp);
						else {
							player
								.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？")
								.set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力")
								.set("ai", function () {
									var player = _status.event.player;
									var hp = player.hp;
									if (player.countCards("h") == 0) return 0;
									if (hp < 3) return 1;
									if (player.countCards("j") > 0) return 1;
									if (
										player.isPhaseUsing() &&
										player.countCards("h", function (card) {
											return card.name == "tao";
										}) >= player.getDamagedHp()
									)
										return 1;
									return 0;
								});
						}
						("step 1");
						if (result.bool) {
							player.draw(player.hp);
						} else {
							player.recover(player.countCards("h"));
						}
					},
				},
			},
		},
		tianxuanmrfz: {
			audio: 2,
			mark: true,
			intro: {
				content: function (event, player) {
					return "已有的花色：" + get.translation(player.storage.tianxuanmrfz);
				},
			},
			trigger: {
				player: "useCard1",
			},
			filter: function (event, player) {
				return get.tag(event.card, "damage") > 0 && player.isPhaseUsing();
			},
			init: function (player) {
				player.storage.tianxuanmrfz = ["heart"];
			},
			prompt: function (event, player) {
				var list = player.storage.tianxuanmrfz;
				return "【天选】：是否进行判定，若为" + get.translation(list) + ",则" + get.translation(event.card) + "结算两次";
			},
			content: function () {
				"step 0";
				var list = player.storage.tianxuanmrfz;
				player.judge(function (card) {
					for (var i = 0; i < list.length; i++) {
						var suit = get.suit(card);
						if (suit == list[i]) return -4;
					}
					return 0;
				}).judge2 = function (result) {
					return result.bool == false ? true : false;
				};
				("step 1");
				if (result.bool == false) {
					trigger.effectCount++;
					player.storage.tianxuanmrfz = [];
					event.finish();
				} else {
					var suit = player.storage.tianxuanmrfz,
						list = [];
					for (i of lib.suit) {
						if (suit.includes(i)) continue;
						list.push(i);
					}
					player
						.chooseControl(list)
						.set("prompt", "【天选】：请选择为[]内增加一个花色")
						.set("ai", function () {
							if (list.includes("diamond")) return "diamond";
							return list.randomGet();
						});
				}
				("step 2");
				if (result.control) {
					player.storage.tianxuanmrfz.add(result.control);
					player.storage.tianxuanmrfz.sort();
				}
			},
		},
		shengcaimrfz: {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (!get.tag(event.card, "damage") || !player.isPhaseUsing()) return false;
				return (
					player.getHistory("useCard", function (evt) {
						return get.tag(evt.card, "damage") > 0;
					}).length > 1
				);
			},
			prompt: function (event, player) {
				return "【圣裁】：是否令" + get.translation(event.card) + "伤害基数+1？";
			},
			content: function () {
				if (!trigger.baseDamage) trigger.baseDamage = 1;
				trigger.baseDamage++;
			},
			group: "shengcaimrfz_damage",
			subSkill: {
				damage: {
					direct: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return (
							game.countPlayer(current => {
								return current != player && current.getHistory("damage").length > 0;
							}) > 0
						);
					},
					content: function () {
						"step 0";
						var next = player.chooseTarget(
							[1, Infinity],
							"【圣裁】：你可以对本回合造成过伤害的其他角色造成一点伤害",
							function (card, player, target) {
								return target != player && target.getHistory("damage").length > 0;
							}
						);
						next.ai = function (target) {
							return get.attitude(player, target) < 0;
						};
						("step 1");
						if (result.targets) {
							player.logSkill("shengcaimrfz");
							for (i of result.targets) {
								i.damage("player");
								player.line(i);
							}
						}
					},
				},
			},
		},
		//涤火杰西卡
		yijiemrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				if (player.countCards("he") == 0) return false;
				return (
					game.countPlayer(function (current) {
						return current != player && current.countCards("h") > 0;
					}) > 0
				);
			},
			filterTarget: function (card, player, target) {
				return target != player;
			},
			targetprompt: ["被出杀(A)", "出杀(B)", "出杀(B)"],
			selectTarget: [2, 3],
			multitarget: true,
			line: false,
			content: function () {
				"step 0";
				event.num = 0;
				targets.push(player);
				var frsTargets = targets[0],
					secTargets = targets.slice(1);
				for (var i of secTargets) i.line(frsTargets);
				("step 1");
				var frsTargets = targets[0],
					secTargets = targets.slice(1);
				if (event.num < secTargets.length) {
					secTargets[event.num].storage.yijiemrfz = frsTargets;
					secTargets[event.num].addTempSkill("yijiemrfz_gain", "shaMiss");
					secTargets[event.num]
						.chooseToUse(
							function (card, player, event) {
								if (get.name(card) != "sha") return false;
								return lib.filter.filterCard.apply(this, arguments);
							},
							"【义劫】：是否对" + get.translation(frsTargets) + "使用一张杀？"
						)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.frsTargets && !ui.selected.targets.includes(_status.event.frsTargets)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("addCount", false)
						.set("frsTargets", frsTargets);
					event.num++;
					event.redo();
				}
			},
			ai: {
				order: 4.1,
				expose: 0.1,
				result: {
					player: 1,
					target: function (player, target) {
						if (ui.selected.targets.length == 0) {
							return -3;
						} else return 1;
					},
				},
			},
			//group:'tuohuangmrfz',
			subSkill: {
				gain: {
					direct: true,
					charlotte: true,
					trigger: {
						source: "damageEnd",
					},
					onremove: function (player) {
						delete player.storage.yijiemrfz;
					},
					filter: function (event, player) {
						return event.card && event.card.name == "sha" && event.player == player.storage.yijiemrfz;
					},
					content: function () {
						if (trigger.player.countCards("he") > 0) player.gainPlayerCard(trigger.player, true, "he");
						else trigger.player.damage("player");
						player.removeSkill("yijiemrfz_gain");
						delete player.storage.yijiemrfz;
					},
				},
			},
		},
		fuhuangmrfz: {
			audio: 2,
			derivation: ["tuohuangmrfz", "weihumrfz"],
			skillAnimation: true,
			animationColor: "fire",
			unique: true,
			juexingji: true,
			forced: true,
			trigger: {
				player: "gainAfter",
				global: "loseAsyncAfter",
			},
			filter: function (event, player) {
				return player.countMark("fuhuangmrfz_mark") >= 2;
			},
			content: function () {
				player.removeMark("fuhuangmrfz_mark", player.countMark("fuhuangmrfz_mark"), false);
				player.awakenSkill("fuhuangmrfz");
				player.removeSkill("yijiemrfz");
				player.addSkill("tuohuangmrfz");
				player.addSkill("weihumrfz");
				player.draw(2);
				player.changeHujia(1);
				player.loseMaxHp(1);
			},
			group: "fuhuangmrfz_mark",
			subSkill: {
				mark: {
					intro: {
						content: "已获得#张牌",
					},
					silent: true,
					firstDo: true,
					trigger: {
						player: "gainAfter",
						global: "loseAsyncAfter",
					},
					filter: function (event, player) {
						if (player.countMark("fuhuangmrfz_mark") >= 2) return false;
						return event.getg(player).length && event.getParent("phaseDraw").player != player;
					},
					content: function () {
						player.addMark("fuhuangmrfz_mark", false, trigger.num);
					},
				},
			},
		},
		tuohuangmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return game.hasPlayer(function (current) {
					return current.countCards("he") > 0;
				});
			},
			multitarget: true,
			multiline: true,
			filterTarget: function (card, player, target) {
				return target.countCards("h") > 0;
			},
			selectTarget: [1, 3],
			content: function () {
				"step 0";
				var num = 4 - targets.length;
				var cards = game.cardsGotoOrdering(get.cards(num)).cards;
				event.cards = cards;
				player.showCards(event.cards, get.translation(player) + "发动了【拓荒】");
				event.num = 0;
				("step 1");
				if (event.num < targets.length) {
					var suit = [];
					for (var i of event.cards) {
						if (!suit.includes(get.suit(i)) && lib.suit.includes(get.suit(i))) suit.push(get.suit(i));
					}
					targets[event.num]
						.chooseToDiscard(
							"h",
							"【拓荒】：你可以弃置" + get.translation(suit) + "花色的手牌并摸等量+1张牌",
							[1, Infinity],
							function (card) {
								var suitcard = get.suit(card);
								if (suit.includes("diamond") && suitcard == "diamond") return true;
								if (suit.includes("heart") && suitcard == "heart") return true;
								if (suit.includes("spade") && suitcard == "spade") return true;
								if (suit.includes("club") && suitcard == "club") return true;
							}
						)
						.set("ai", function (card) {
							return 8 - get.value(card);
						});
				} else event.finish();
				("step 2");
				if (result.cards) {
					targets[event.num].draw(1 + result.cards.length);
				}
				event.num++;
				event.goto(1);
			},
			ai: {
				expose: 0.1,
				threaten: 1.35,
				order: 1,
				result: {
					player: 1,
					target: 1,
				},
			},
		},
		weihumrfz: {
			mod: {
				maxHandcard: function (player, num) {
					if (player.hujia > 0) return num + 1;
				},
			},
			audio: 2,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return player.hujia < 1;
			},
			forced: true,
			content: function () {
				player.changeHujia();
			},
			group: "weihumrfz_give",
			subSkill: {
				give: {
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.hujia > 0;
					},
					direct: true,
					content: function () {
						"step 0";
						player.chooseTarget(
							[1, player.hujia + 1],
							"【卫护】：你可以失去至少一点护甲，然后令等量+1名没有护甲的其他角色获得一点护甲",
							function (card, player, target) {
								return target != player && target.hujia < 1;
							}
						).ai = function (target) {
							return get.attitude(player, target) > 2;
						};
						("step 1");
						if (result.targets) {
							player.logSkill("weihumrfz");
							player.changeHujia(Math.min(-1, -result.targets.length + 1));
							for (i of result.targets) {
								i.changeHujia();
								player.line(i);
							}
						}
					},
				},
			},
		},
		//提丰 小台风
		ruiyamrfz: {
			mark: true,
			intro: {
				content: function (event, player) {
					return "上一个成为一唯一目标的【杀】的角色：" + (player.storage.ruiyamrfz ? get.translation(player.storage.ruiyamrfz) : "无");
				},
			},
			audio: 2,
			trigger: {
				player: "useCard2",
			},
			filter: function (event, player) {
				return (
					event.cards &&
					event.card.name == "sha" &&
					event.targets &&
					event.targets.length == 1 &&
					event.targets[0] == player.storage.ruiyamrfz
				);
			}, //QQQ
			prompt: "【锐牙】:是否令此杀伤害+1？",
			check: function (event, player) {
				return get.attitude(player, event.targets[0]) < 2;
			}, //QQQ
			content: function () {
				var target = trigger.targets[0];
				target.addTempSkill("ruiyamrfz_dam");
				target.storage.ruiyamrfz_dam = {
					card: trigger.card,
				};
			},
			group: "ruiyamrfz_mark",
			subSkill: {
				mark: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event, player) {
						if (!event.targets || event.targets > 1) return false;
						return event.card && event.card.name == "sha";
					},
					content: function () {
						player.storage.ruiyamrfz = trigger.target;
					},
				},
				dam: {
					onremove: function (player) {
						delete player.storage.ruiyamrfz_dam;
					},
					trigger: {
						player: "damageBegin3",
					},
					filter: function (event, player) {
						var info = player.storage.ruiyamrfz_dam;
						return event.card && event.card == info.card;
					},
					silent: true,
					popup: false,
					forced: true,
					content: function () {
						trigger.num++;
					},
				},
			},
		},
		shouliemrfz: {
			marktext: "矢",
			intro: {
				name: "矢",
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 4,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.getExpansions("shouliemrfz").length >= 3) return false;
				return (
					player.countCards("he", function (card) {
						return get.tag(card, "damage") > 0;
					}) > 0
				);
			},
			filterCard: function (card) {
				return get.tag(card, "damage");
			},
			selectCard: function () {
				var player = _status.event.player;
				return [1, 3 - player.getExpansions("shouliemrfz").length];
			},
			check: function (card) {
				return 10 - get.value(card) || card.name == "sha";
			},
			prompt: "【狩猎】：将任意张带有伤害标签的牌置于你的武将牌上，称之为‘矢’",
			discard: false,
			lose: false,
			content: function () {
				player.addToExpansion(cards, player, "giveAuto").gaintag.add("shouliemrfz");
			},
			group: ["shouliemrfz_use", "shouliemrfz_shasha"],
			ai: {
				order: 13,
				threaten: function () {
					var player = _status.event.player;
					return 1.4 + player.getExpansions("shouliemrfz").length * 0.2;
				},
				result: {
					player: 1,
				},
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
				use: {
					audio: "shouliemrfz",
					enable: ["chooseToRespond", "chooseToUse"],
					filter: function (event, player) {
						if (player.getExpansions("shouliemrfz").length < 1 || player.hasSkill("shouliemrfz_ban")) return false;
						return event.filterCard({ name: "sha" }, player, event);
					},
					chooseButton: {
						dialog: function (event, player) {
							return ui.create.dialog("狩猎", player.getExpansions("shouliemrfz"), "hidden");
						},
						backup: function (links, player) {
							return {
								viewAs: {
									name: "sha",
									nature: "stab",
								},
								cards: links,
								selectCard: -1,
								position: "x",
								filterCard: card => lib.skill["shouliemrfz_use_backup"].cards.includes(card),
								popname: true,
								precontent: function () {
									player.addTempSkill("shouliemrfz_ban", "phaseEnd");
								},
							};
						},
						prompt: function (links, player) {
							return "【狩猎】：将" + get.translation(links.name) + "当做一张刺【杀】使用或打出";
						},
					},
					ai: {
						order: 2.95,
						respondSha: true,
						result: {
							player: 1,
						},
						skillTagFilter: function (player, tag, arg) {
							if (player.getExpansions("shouliemrfz").length < 1) return false;
						},
					},
				},
				shasha: {
					markimage: "extension/WhichWay/image/skill/taifengmrfz.png",
					intro: {
						content: function (event, player) {
							return (
								"你成为了" +
								get.translation(
									game.findPlayer(function (current) {
										return current != player && current.hasSkill("shouliemrfz");
									})
								) +
								"的猎物"
							);
						},
					},
					audio: "shouliemrfz",
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						if (player.getHistory("skipped").includes("phaseUse") || player.getHistory("skipped").includes("phaseDiscard")) return false;
						return true;
					},
					check: function (event, player) {
						if (
							player.countCards("j", function (card) {
								return get.name(card) == "lebu";
							}) > 0 &&
							player.countCards("h") + 2 > player.getHandcardLimit()
						)
							return true;
						return (
							player.getExpansions("shouliemrfz").length +
								player.countCards("h", function (card) {
									return get.name(card) == "sha";
								}) >
							2
						);
					},
					prompt: "【狩猎】：是否跳过出牌阶段和弃牌阶段，然后选择一名其他角色，直到你的下个回合开始时，每个其他角色的结束阶段，你都可以对其使用一张【杀】？",
					content: function () {
						"step 0";
						player.skip("phaseUse");
						player.skip("phaseDiscard");
						player.addSkill("shouliemrfz_usesha");
						player.chooseTarget(
							"【狩猎】：请选择一名其他角色",
							function (card, player, target) {
								return target != player;
							},
							true
						).ai = function (target) {
							return get.attitude(_status.event.player, target) < 0;
						};
						("step 1");
						if (result.targets) {
							var target = result.targets[0];
							player.storage.shouliemrfz_shasha = target;
							target.addMark("shouliemrfz_shasha", false);
							player.line(target);
						}
					},
					ai: {
						expose: 0.1,
					},
				},
				rem: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseBegin" },
					content: function () {
						game.countPlayer(function (current) {
							if (current.hasMark("shouliemrfz_shasha")) current.removeAllmark("shouliemrfz_shasha", false);
						});
						player.removeSkill("shouliemrfz_usesha");
						delete player.storage.shouliemrfz_shasha;
					},
				},
				usesha: {
					trigger: {
						global: "phaseJieshuBegin",
					},
					direct: true,
					filter: function (event, player) {
						if (event.player == player) return false;
						return (
							event.player.isIn() &&
							lib.filter.targetEnabled({ name: "sha" }, player, event.player) &&
							(player.hasSha() || _status.connectMode || player.getExpansions("shouliemrfz").length > 0)
						);
					},
					content: function () {
						var target = game.findPlayer(function (current) {
							return current != player && player.storage.shouliemrfz_shasha == current;
						});
						player
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") return false;
									return lib.filter.filterCard.apply(this, arguments);
								},
								"【狩猎】：是否对" + get.translation(target) + "使用一张【杀】？"
							)
							.set("logSkill", "shouliemrfz")
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("sourcex", target);
					},
					group: "shouliemrfz_rem",
				},
			},
		},

		//vvan薇薇安娜
		zhanjumrfz: {
			audio: 2,
			trigger: {
				global: "dying",
			},
			filter: function (event, player) {
				if (!game.checkMod({ name: "tao", isCard: true }, player, event.player, "unchanged", "cardSavable", player)) return false;
				return player.countCards("h") > 0 && event.player.hp <= 0;
			},
			check: function (event, player) {
				if (get.attitude(player, event.player) < 0) return false;
				return (
					player.countCards("h", function (card) {
						return card.name == "tao";
					}) +
						event.player.hp <
					0
				);
			},
			prompt: function (event, player) {
				return "【盏菊】:你可以将所有手牌当作【桃】对" + get.translation(event.player) + "使用";
			},
			content: function () {
				var cards = player.getCards("h");
				trigger.player.storage.zhanjumrfz = true;
				player.useCard({ name: "tao" }, cards, trigger.player);
			},
			group: "zhanjumrfz_recast",
			subSkill: {
				recast: {
					silent: true,
					lastDo: true,
					trigger: { global: "dyingAfter" },
					filter: function (event, player) {
						return event.player.storage.zhanjumrfz;
					},
					content: function () {
						"step 0";
						delete trigger.player.storage.zhanjumrfz;
						if (player.countCards("hej") == 0) event.finish();
						else {
							player.chooseCard("【盏菊】:你可以重铸一张你区域内的牌", "hej");
						}
						("step 1");
						if (result.cards) {
							player.recast(result.cards);
							player.logSkill("zhanjumrfz");
						}
					},
				},
			},
		},
		zhuhuomrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterCard: function (card, player) {
				return player.canRecast(card);
			},
			selectCard: 1,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			position: "he",
			discard: false,
			lose: false,
			check: function (card) {
				return 8 - get.value(card);
			},
			content: function () {
				player.recast(cards);
			},
			group: "zhuhuomrfz_draw",
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
			subSkill: {
				reget: {
					silent: true,
					popup: false,
					lastDo: true,
					trigger: {
						global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"],
					},
					content: function () {
						player.addSkill("zhuhuomrfz");
						player.removeSkill("zhuhuomrfz_reget");
					},
				},
				draw: {
					direct: true,
					trigger: { player: "loseAfter" },
					filter: function (event, player) {
						if (!event.cards) return false;
						return event.getParent(2).name == "recast";
					},
					content: function () {
						"step 0";
						if (trigger.cards.length > 1) {
							var num = 0;
							for (i of trigger.cards) {
								num += get.cardNameLength(i);
							}
						} else var num = get.cardNameLength(trigger.cards[0]);
						event.num = num;
						var next = player.chooseControl("发牌", "摸牌", "cancel2");
						next.set("prompt", "是否发动【烛火】？");
						next.set("ai", function () {
							var player = _status.event.player;
							var count = game.countPlayer(function (current) {
								return current != player && get.attitude(current, player) > 2;
							});
							if (num == 1) return 0;
							if (count - num < 0) return 1;
							return 0;
						});
						("step 1");
						if (result.control == "cancel2") event.finish();
						else {
							if (result.index == 1) {
								player.draw(Math.min(event.num, 5));
								player.logSkill("zhuhuo2mrfz");
								player.addSkill("zhuhuomrfz_reget");
								player.removeSkill("zhuhuomrfz");
							} else {
								var num = event.num;
								var next = player.chooseTarget(true, "【烛火】:你可以选择至多" + num + "名角色，令其各摸一张牌", [1, num]);
								next.ai = function (target) {
									return get.attitude(target, player) > 2;
								};
							}
						}
						("step 2");
						if (result.targets) {
							var targets = result.targets;
							for (i of targets) {
								i.draw();
								player.line(i);
							}
							player.logSkill("zhuhuo2mrfz");
						}
					},
					ai: {
						expose: 0.1,
					},
				},
			},
		},
		zhuhuo2mrfz: {
			audio: 2,
		},
		yunjiaomrfz: {
			mod: {
				aiOrder: function (player, card, num) {
					if (typeof card == "object" && !get.tag(card, "norepeat")) {
						var history = player.getAllHistory("useCard");
						if (history.length > 0) {
							var cardx = history[history.length - 1].card;
							if (get.is.yayun(get.translation(cardx.name), get.translation(card.name))) return num + 20;
						}
					}
				},
			},
			mark: true,
			intro: {
				content: function (event, player) {
					var history = player.getAllHistory("useCard");
					var evt = history[history.length - 1];
					if (!evt) return "没有使用过牌";
					return "你上一张使用的牌是：" + get.translation(evt.card.name) + "(" + get.pinyin(get.translation(evt.card.name)) + ")";
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "useCard" },
			filter: function (event, player) {
				var history = player.getAllHistory("useCard"),
					index = history.indexOf(event);
				if (index < 1) return false;
				var evt = history[index - 1];
				return get.is.yayun(get.translation(event.card.name), get.translation(evt.card.name)) && player.isPhaseUsing();
			},
			content: function () {
				var skills = player.getStockSkills(true, true);
				game.expandSkills(skills);
				var resetSkills = [];
				var suffixs = ["used", "round", "block", "blocker"];
				for (var skill of skills) {
					var info = get.info(skill);
					if (typeof info.usable == "number") {
						if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
							delete player.storage.counttrigger[skill];
							resetSkills.add(skill);
						}
						if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
							delete player.getStat("skill")[skill];
							resetSkills.add(skill);
						}
					}
					if (info.round && player.storage[skill + "_roundcount"]) {
						delete player.storage[skill + "_roundcount"];
						resetSkills.add(skill);
					}
					if (player.awakenedSkills.includes(skill)) {
						player.restoreSkill(skill);
						resetSkills.add(skill);
					}
					for (var suffix of suffixs) {
						if (player.hasSkill(skill + "_" + suffix)) {
							player.removeSkill(skill + "_" + suffix);
							resetSkills.add(skill);
						}
					}
				}
				if (resetSkills.length) {
					var str = "";
					for (var i of resetSkills) {
						str += "【" + get.translation(i) + "】、";
					}
					game.log(player, "重置了技能", "#g" + str.slice(0, -1));
				}
			},
		},

		//纯爱 纯烬艾雅法拉 奶羊 我老婆涅😋
		lvmengmrfz: {
			init: function (player) {
				player.storage.lvmengmrfz = {
					beifeng: [],
					zhongzi: [],
					pimao: [],
				};
			},
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.lvmengmrfz;
					var str =
						"北风：" +
						(storage["beifeng"].length > 0 ? get.translation(storage["beifeng"]) : "无") +
						"</br>种子：" +
						(storage["zhongzi"].length > 0 ? get.translation(storage["zhongzi"]) : "无") +
						"</br>皮毛：" +
						(storage["pimao"].length > 0 ? get.translation(storage["pimao"]) : "无");
					return str;
				},
			},
			audio: 4,
			forced: true,
			trigger: { global: "roundStart" },
			content: function () {
				"step 0";
				if (!player.storage.lvmengmrfz)
					player.storage.lvmengmrfz = {
						beifeng: [],
						zhongzi: [],
						pimao: [],
					};
				var list = [
					["未分配牌的类型（对话框较长，请下滑操作）", [["basic", "trick", "equip"], "vcard"]],
					["北风（从牌堆中获得一张你手牌中没有的花色）", []],
					["种子（此牌结算完毕后你可以将其交给一名其他角色）", []],
					["皮毛（不可被其他角色响应）", []],
				];
				var next = player.chooseToMove("【旅梦】：请分配牌的类型", true);
				next.set("list", list);
				next.set("filterMove", function (from, to, moved) {
					if (typeof to == "number") {
						if (to == 0) return true;
					}
					return true;
				});
				next.set("processAI", function () {
					var player = _status.event.player;
					var moved = [[], [], [], []];
					var hasFriend = function (player) {
						return game.hasPlayer(current => {
							return get.attitude(player, current) > 2 && current != player;
						});
					};
					if (!hasFriend(player)) {
						moved[1].addArray(["equip"]);
						if (Math.random() < 0.5) moved[1].addArray(["trick"]);
						else moved[3].addArray(["trick"]);
						moved[3].addArray(["basic"]);
					} else {
						moved[1].addArray(["equip"]);
						if (Math.random() < 0.5) {
							moved[2].addArray(["trick"]);
							moved[3].addArray(["basic"]);
						} else {
							moved[2].addArray(["trick", "basic"]);
						}
					}
					//console.log(moved);
					return moved;
				});
				("step 1");
				if (result.bool) {
					game.broadcastAll(
						function (moved, player) {
							var transform = function (input) {
								return input.map(item => {
									if (item.length === 0) {
										return item;
									} else if (typeof item[0] === "string") {
										return item;
									} else {
										return item.map(subItem => subItem[2]);
									}
								});
							};
							var moved = moved.slice(1);
							moved = transform(moved);
							player.storage.lvmengmrfz = {
								beifeng: [],
								zhongzi: [],
								pimao: [],
							};
							//console.log(moved);
							var keys = Object.keys(player.storage.lvmengmrfz);
							for (var i = 0; i < moved.length; i++) {
								for (var j = 0; j < moved[i].length; j++) {
									player.storage.lvmengmrfz[keys[i]].add(moved[i][j]);
								}
							}
						},
						result.moved,
						player
					);
				}
			},
			group: ["lvmengmrfz_beifeng", "lvmengmrfz_zhongzi", "lvmengmrfz_pimao", "lvmengmrfz_tag"],
			subSkill: {
				// 标签
				tag: {
					silent: true,
					charlotte: true,
					trigger: { player: ["gainEnd", "lvmengmrfzAfter"] },
					filter(event, player) {
						return player.storage.lvmengmrfz;
					},
					content() {
						var storage = player.storage.lvmengmrfz,
							cards = trigger.name == "gain" ? trigger.cards : player.getCards("h");
						if (trigger.name == "lvmengmrfz") {
							for (var i of ["beifeng_lvmengmrfz", "zhongzi_lvmengmrfz", "pimao_lvmengmrfz"]) {
								player.removeGaintag(i);
							}
						}
						for (var key in storage) {
							for (var i of cards) {
								if (storage[key].includes(get.type2(i))) i.addGaintag(key + "_lvmengmrfz");
							}
						}
					},
				},
				//北风
				beifeng: {
					direct: true,
					usable: 4,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						var type = player.storage.lvmengmrfz["beifeng"],
							tmp_bool = false;
						if (!type || !event.card) return false;
						for (var i = 0; i < type.length; i++) {
							if (get.type(event.card, "trick") == type[i]) {
								tmp_bool = true;
								break;
							}
						}
						var cards = player.getCards("h"),
							list = [];
						for (var i of cards) {
							list.add(get.suit(i, player));
						}
						return list.length < 4 && tmp_bool;
					},
					content: function () {
						var cards = player.getCards("h"),
							list = [];
						for (var i of cards) {
							list.add(get.suit(i, player));
						}
						var result = lib.suit.filter(item => !list.includes(item));
						var card = get.cardPile2(card => {
							for (var i = 0; i < result.length; i++) {
								return get.suit(card) == result[i];
							}
						});
						if (card) player.gain(card, "gain2");
						if (!trigger.audioed) {
							trigger.audioed = true;
							player.logSkill("lvmengmrfz");
						}
					},
				},
				//种子
				zhongzi: {
					direct: true,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						var type = player.storage.lvmengmrfz["zhongzi"],
							tmp_bool = false;
						if (!type || !event.card) return false;
						for (var i = 0; i < type.length; i++) {
							if (get.type(event.card, "trick") == type[i]) {
								tmp_bool = true;
								break;
							}
						}
						return event.cards.filterInD().length > 0 && tmp_bool;
					},
					content: function () {
						"step 0";
						player
							.chooseTarget("【旅梦】:将" + get.translation(trigger.cards) + "交给一名其他角色", function (card, player, target) {
								return target != player;
							})
							.set("ai", function (target) {
								if (target.hasJudge("lebu")) return 0;
								var att = get.attitude(_status.event.player, target);
								if (att < 3) return 0;
								if (target.hasSkillTag("nogain")) att /= 10;
								if (target.hasSha() && _status.event.sha) {
									att /= 5;
								}
								if (event.wuxie && target.needsToDiscard(1)) {
									att /= 5;
								}
								return att / (1 + get.distance(player, target, "absolute"));
							})
							.set("sha", trigger.cards[0].name == "sha")
							.set("wuxie", trigger.cards[0].name == "wuxie");
						("step 1");
						if (result.bool) {
							player.line(result.targets[0]);
							if (!trigger.audioed) {
								trigger.audioed = true;
								player.logSkill("lvmengmrfz");
							}
							result.targets[0].gain(trigger.cards.filterInD(), "gain2");
						}
					},
				},
				//皮毛
				pimao: {
					direct: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						var type = player.storage.lvmengmrfz["pimao"],
							tmp_bool = false;
						if (!type || !event.card) return false;
						for (var i = 0; i < type.length; i++) {
							if (get.type(event.card, "trick") == type[i]) {
								tmp_bool = true;
								break;
							}
						}
						return tmp_bool;
					},
					content: function () {
						if (!trigger.audioed) {
							trigger.audioed = true;
							player.logSkill("lvmengmrfz");
						}
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current != player;
							})
						);
					},
				},
			},
			ai: {
				threaten: 1.6,
			},
		},
		rechenmrfz: {
			mark: true,
			intro: {
				content: function (event, player) {
					var evt = player.getLastUsed();
					if (!player.isPhaseUsing()) return "不是你的出牌阶段";
					if (!evt || !evt.card) return "本回合你未使用过牌";
					return "上一张你使用的牌的花色是：" + get.translation(get.suit(evt.card));
				},
			},
			audio: 2,
			trigger: { player: "useCard" },
			forced: true,
			firstDo: true,
			filter: function (event, player) {
				var evt = player.getLastUsed(1);
				if (event.getParent("phaseUse").player != player) return false;
				return evt && evt.card && get.suit(event.card) == get.suit(evt.card) && !event.audioed;
			},
			content: function () {
				trigger.audioed = true;
			},
			mod: {
				aiOrder: function (player, card, num) {
					if (typeof card == "object" && player.isPhaseUsing()) {
						var evt = player.getLastUsed();
						if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) {
							return num + 10;
						}
					}
				},
				cardUsable: function (card, player) {
					var evt = player.getLastUsed();
					if (evt && evt.card && get.suit(card) == get.suit(evt.card)) return Infinity;
				},
				targetInRange: function (card, player, target, now) {
					var evt = player.getLastUsed();
					if (evt && evt.card && get.suit(card) == get.suit(evt.card)) return true;
				},
			},
			group: ["rechenmrfz_syn"],
			subSkill: {
				syn: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { player: "useCardEnd" },
					filter: function (event, player) {
						return event.getParent("phaseUse").player === player;
					},
					async content(event, trigger, player) {
						player.addTip("rechenmrfz_tip", `热忱 ${get.translation(get.suit(trigger.card))}`, "phaseUseEnd");
					},
				},
			},
		},
		//塑心 阿尔图罗 2226
		qinmingmrfz: {
			audio: 2,
			usable: 1,
			enable: "phaseUse",
			filter: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && current.countCards("h") > 0;
				});
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			selectTarget: 1,
			content: function () {
				"step 0";
				var tmp_cards = target.getCards("h");
				var cards = [];
				for (i of tmp_cards) {
					if (target.canRecast(i)) cards.push(i);
				}
				target.recast(cards);
				("step 1");
				var cards = target.getCards("h");
				target.showCards(cards, "【琴鸣】:" + get.translation(target) + "的手牌");
				("step 2");
				var cards = target.getCards("h");
				var canCards = [];
				for (i of cards) {
					if (target.canUseToAnyone(i)) canCards.push(i);
				}
				event.cards = canCards;
				("step 3");
				if (event.cards.length > 0) {
					if (target.hasCard(event.cards[0].name, "h")) target.chooseUseTarget(true, event.cards[0], false);
					event.goto(2);
				}
			},
			ai: {
				order: 8,
				expose: 0.1,
				result: {
					target: function (player, target) {
						var lowAtt =
							game.hasPlayer(current => {
								return current != player && current.inRange(target) && get.attitude(player, current) < 0;
							}) && get.attitude(player, target) < 0;
						var hightAtt =
							game.hasPlayer(current => {
								return current != player && current.inRange(target) && get.attitude(player, current) < 0;
							}) && get.attitude(player, target) > 0;
						if (lowAtt) return -1;
						if (hightAtt) return 1;
						return 0;
					},
				},
			},
		},
		kongwomrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "drawBegin" },
			filter: function (event, player) {
				return event.num > 0;
			},
			content: function () {
				var num = trigger.num;
				trigger.cancel();
				var cards = [],
					banCards = [];
				var loseCards = player.getHistory("lose", evt => {
					return evt.player == player;
				});
				for (var i of loseCards) {
					if (!i.cards) continue;
					banCards.push(i.cards);
				}
				while (cards.length < num) {
					var card = get.discardPile(card => {
						return !cards.includes(card) && !banCards.includes(card);
					});
					if (card) cards.push(card);
					else break;
				}
				player.gain(cards, "gain2");
			},
			group: ["kongwomrfz_get", "kongwomrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { player: "phaseUseEnd" },
					content: function () {
						if (player.storage.kongwomrfz_get) delete player.storage.kongwomrfz_get;
					},
				},
				get: {
					audio: "kongwomrfz",
					direct: true,
					trigger: { global: "loseAfter" },
					filter: function (event, player) {
						if (event.player == player || !player.isPhaseUsing()) return false;
						if (event.getParent().name != "useCard") return false;
						var cards = event.cards2.slice(0);
						for (var i = 0; i < cards.length; i++) {
							var type = get.type2(cards[i]);
							if (get.position(cards[i], true) == "o" && type != "equip") {
								return true;
							}
						}
						return true;
					},
					content: function () {
						"step 0";
						if (trigger.delay == false) game.delay();
						if (!player.storage.kongwomrfz_get) player.storage.kongwomrfz_get = [];
						("step 1");
						var cards = [];
						for (var i = 0; i < trigger.cards2.length; i++) {
							var card = trigger.cards2[i];
							var type = get.type2(card);
							var name = player.storage.kongwomrfz_get,
								name2 = card.name;
							if (get.position(card, true) == "o" && type != "equip" && !name.includes(name2)) {
								cards.push(card);
							}
						}
						if (cards.length)
							player.chooseButton(true, ["【空我】:请选择你要获得的牌", cards], [1, Infinity]).set("ai", button => {
								return cards;
							});
						else event.finish();
						("step 2");
						if (result.links) {
							var cards = result.links;
							for (i of cards) {
								var name = get.name(i);
								if (!player.storage.kongwomrfz_get.includes(name)) player.storage.kongwomrfz_get.add(name);
							}
							player.gain(cards, "gain2");
							player.logSkill("kongwomrfz");
						}
					},
				},
			},
		},

		//赫德雷
		zhengrongmrfz: {
			init: function (player) {
				player.storage.zhengrongmrfz = {
					discard: false,
					losedraw: false,
					maxhp: false,
				};
			},
			audio: 2,
			trigger: {
				global: "damageEnd",
			},
			filter: function (event, player) {
				var list = [],
					storage = player.storage.zhengrongmrfz;
				if (player.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
				if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
				if (storage["maxhp"] == false) list.push("失去体力上限");
				if (list.length == 0) return false;
				if (event.player === undefined) return false;
				if (!event.player.isAlive()) return false;
				return event.player == player || get.distance(player, event.player) <= 1;
			},
			prompt: function (event, player) {
				if (event.player == player) return "【征戎】：是否选择一项并回复一点体力？";
				return "【征戎】:是否选择一项并令" + get.translation(event.player) + "回复一点体力？";
			},
			check: function (event, player) {
				if (get.attitude(event.player, player) < 0) return false;
				return true;
			},
			content: function () {
				"step 0";
				var list = [],
					storage = player.storage.zhengrongmrfz;
				if (player.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
				if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
				if (storage["maxhp"] == false) list.push("失去体力上限");
				player
					.chooseControl(list)
					.set("ai", function () {
						return 0;
					})
					.set("prompt", "【征戎】:请选择一项");
				("step 1");
				if (result.control) {
					var control = result.control;
					game.log(control);
					if (control == "弃牌") {
						player.chooseToDiscard("he", true, "【征戎】:请弃置一张牌");
						player.storage.zhengrongmrfz["discard"] = true;
					}
					if (control == "摸牌阶段摸牌数-1") {
						player.addMark("zhengrongmrfz_losedraw", false);
						player.addTempSkill("zhengrongmrfz_losedraw", {
							player: "phaseDrawAfter",
						});
						player.storage.zhengrongmrfz["losedraw"] = true;
					}
					if (control == "失去体力上限") {
						player.loseMaxHp();
						player.storage.zhengrongmrfz["maxhp"] = true;
					}
					trigger.player.recover();
				}
			},
			group: ["zhengrongmrfz_rec", "zhengrongmrfz_draw"],
			subSkill: {
				draw: {
					audio: 2,
					firstDo: true,
					trigger: { player: "phaseBegin" },
					filter: function (event, player) {
						var allGone = Object.values(player.storage.zhengrongmrfz).every(function (value) {
							return value === true;
						});
						if (player.storage.zhengrongmrfz === undefined) return false;
						return allGone;
					},
					content: function () {
						player.drawTo(player.maxHp);
					},
				},
				rec: {
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: { player: "phaseBegin" },
					content: function () {
						player.storage.zhengrongmrfz = {
							discard: false,
							losedraw: false,
							maxhp: false,
						};
					},
				},
				losedraw: {
					silent: true,
					charlotte: true,
					lastDo: true,
					intro: {
						content: "下个摸牌阶段摸牌数-#",
					},
					onremove: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return event.num > 0;
					},
					content: function () {
						trigger.num -= player.countMark("zhengrongmrfz_losedraw");
					},
				},
			},
			ai: {
				expose: 0.1,
				threaten: 0.8,
			},
		},
		siyanmrfz: {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (event.targets.length > 1) return false;
				if (event.targets[0] == player) return false;
				if (!event.card || event.card.name != "sha") return false;
				var history = event.targets[0].getHistory("damage");
				for (var i = 0; i < history.length; i++) {
					if (!history[i].source) continue;
					if (history[i].source == player) return true;
				}
				var seatNum = event.targets[0].getSeatNum();
				// console.log(seatNum in player.storage.siyanmrfz_tol);
				if (seatNum in player.storage.siyanmrfz_tol && player.storage.siyanmrfz_tol[seatNum] === true) return true;
			},
			check: function (event, player) {
				if (get.attitude(event.targets[0], player) > 0) return false;
				return player.hp > 1;
			},
			prompt: function (event, player) {
				return "【死烟】:是否失去一点体力并令" + get.translation(event.targets[0]) + "选择一项？";
			},
			content: function () {
				"step 0";
				player.addTempSkill("siyanmrfz_rec", {
					player: "damageAfter",
				});
				player.storage.siyanmrfz_rec = {
					card: trigger.card,
				};
				var target = trigger.targets[0],
					list = ["无法响应" + get.translation(player) + "使用的【杀】"];
				if (target.countCards("h") > 1) list.push("弃置两张手牌");
				target.loseHp();
				player.loseHp();
				if (list.length < 2 && target.isAlive()) {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current == target;
						})
					);
					game.log(target, "选择了无法响应", player, "使用的【杀】");
					event.finish();
				} else if (target.isAlive()) {
					target
						.chooseControl()
						.set("choiceList", list)
						.set("prompt", "【死烟】:请选择一项")
						.set("ai", function () {
							var player = _status.event.player;
							if (player.countCards("h") < 3) return 0;
							if (!player.hasShan()) return 0;
							if (
								player.hp == 1 &&
								player.countCards("h", card => {
									return get.name(card) == "tao" || get.name(card) == "jiu";
								}) > 0 &&
								player.countCards("h") < 3
							)
								return 0;
							return 1;
						});
				} else event.finish();
				("step 1");
				if (result.control) {
					var target = trigger.targets[0];
					if (result.index == 1) {
						game.log(get.translation(target), "选择了弃置两张手牌");
						target.chooseToDiscard("h", true, 2);
					} else {
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current == target;
							})
						);
						game.log(target, "选择了无法响应", player, "使用的【杀】");
					}
				}
			},
			group: ["siyanmrfz_tol", "siyanmrfz_clear"],
			subSkill: {
				rec: {
					onremove: function (player) {
						delete player.storage.siyanmrfz_rec;
					},
					trigger: {
						source: "damageEnd",
					},
					filter: function (event, player) {
						var info = player.storage.siyanmrfz_rec;
						return event.card && event.card == info.card;
					},
					silent: true,
					popup: false,
					forced: true,
					charlotte: true,
					firstDo: true,
					content: function () {
						if (get.suit(trigger.card) == "diamond") player.recover();
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { global: "phaseBegin" },
					filter: function (event, player) {
						return event.player != player;
					},
					content: function () {
						var seatNum = trigger.player.getSeatNum();
						player.storage.siyanmrfz_tol[seatNum] = false;
					},
				},
				tol: {
					init: function (player) {
						player.storage.siyanmrfz_tol = {};
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player) continue;
							player.storage.siyanmrfz_tol[i + 1] = false;
						}
					},
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.source != undefined && player.isAlive();
					},
					content: function () {
						var seatNum = trigger.source.getSeatNum();
						if (seatNum in player.storage.siyanmrfz_tol && player.storage.siyanmrfz_tol[seatNum] === false) {
							player.storage.siyanmrfz_tol[seatNum] = true;
						}
					},
				},
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					var seatNum = arg.target.getSeatNum(arg.target);
					if ((!seatNum) in player.storage.siyanmrfz_tol || player.storage.siyanmrfz_tol[seatNum] === false) return false;
					if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) return false;
				},
			},
		},
		//止颂
		kuxiumrfz: {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num += player.getCards("j").length);
				},
			},
			audio: 2,
			enable: "phaseUse",
			filter: function (event, player) {
				var cards = [];
				if (player.countCards("he") < 1) return false;
				for (var i of lib.inpile) {
					if (get.type(i) == "delay") cards.push(i);
				}
				for (var name of cards) {
					if (player.canAddJudge({ name: name })) return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var cards = [];
					for (var i of lib.inpile) {
						if (get.type(i) == "delay") cards.push(i);
					}
					var vcards = [];
					for (var name of cards) {
						var card = { name: name };
						if (player.canAddJudge({ name: name })) vcards.push(["延时锦囊", "", name]);
					}
					var dialog = ui.create.dialog("苦修", [vcards, "vcard"], "hidden");
					return dialog;
				},
				check: function (button) {
					var name = button.link[2];
					switch (name) {
						case "lebu":
							return 1;
						case "bingliang":
							return 2;
						case "shandian":
							return 3;
						default:
							return 1.5;
					}
				},
				backup: function (links, player) {
					return {
						audio: "kuxiumrfz",
						filterCard: function (card, player, event) {
							return player.canAddJudge({
								name: links[0][2],
								cards: [card],
							});
						},
						selectTarget: -1,
						filterTarget: function (card, player, target) {
							return player == target;
						},
						check(card) {
							return 8 - get.value(card);
						},
						viewAs: {
							name: links[0][2],
						},
						position: "he",
						popname: true,
						onuse: function (links, player) {
							if (!links.cards) return;
							var next = game.createEvent("kuxiumrfz_draw", false, _status.event.getParent());
							next.cards = links.cards;
							next.player = player;
							next.setContent(function () {
								let num = player.getCards("j").length;
								if (num > 0) player.draw(num);
							});
						},
						ai: {
							result: {
								player: 1,
							},
						},
					};
				},
				prompt: function (links, player) {
					return "【苦修】：请选择一张牌将其当做一张【" + get.translation(links[0][2]) + "】对自己使用";
				},
			},
			ai: {
				order: 8,
				result: {
					player: 1,
				},
			},
		},
		lirenmrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("j") > 0;
			},
			check: function (event, player) {
				var cards = player.getCards("j");
				if (cards.length == 1 && cards[0] == "shandian") return false;
				return player.hp > 1;
			},
			content: function () {
				var num = player.getCards("j").length;
				player.discardPlayerCard(player, num, "j", true);
				player.loseHp();
			},
		},

		//锏
		/** @type { Skill } */
		weiyamrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: true,
			mod: {
				targetInRange(card, player, target) {
					if (player.getStorage("weiyamrfz").includes(target)) return true;
				},
			},
			audio: 2,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				return event.player != player && !event.player.hasSkill("weiyamrfz_ban") && event.player.isAlive();
			},
			prompt: function (event, player) {
				return "【威压】:是否令" + get.translation(event.player) + "下个出牌阶段不能使用带有伤害类标签的牌？";
			},
			check: function (event, player) {
				return get.attitude(event.player, player) < 0;
			},
			content: async function (event, trigger, player) {
				trigger.player.addTempSkill("weiyamrfz_ban", {
					player: "phaseUseEnd",
				});
				player.storage.weiyamrfz ??= [];
				player.storage.weiyamrfz.add(trigger.player);
			},
			subSkill: {
				ban: {
					charlotte: true,
					mark: true,
					marktext: "战栗",
					intro: {
						content: "出牌阶段不能使用带有伤害类标签的牌",
					},
					mod: {
						cardEnabled: function (card, player) {
							if (get.tag(card, "damage") > 0 && player.isPhaseUsing()) return false;
						},
					},
				},
			},
			ai: {
				expose: 0.2,
				threaten: 1.1,
				unequip: true,
				skillTagFilter(player, tag, arg) {
					return player.getStorage("weiyamrfz").includes(arg.target);
				},
			},
		},
		/** @type { Skill } */
		zhiwumrfz: {
			mod: {
				cardname: function (card, player) {
					if (card.cardnameCheck) return card.name;
					card.cardnameCheck = true;
					let result;
					if (get.type(card) == "trick") result = "sha";
					else result = card.name;
					delete card.cardnameCheck;
					return result;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				if (event.targets.length == 0) return false;
				return event.card.name == "sha" && get.color(event.card) != undefined;
			},
			content: async function (event, trigger, player) {
				var targets = trigger.targets;
				for (var i = 0; i < targets.length; i++) {
					if (targets[i].hasSkill("zhiwumrfz_ban")) continue;
					targets[i].addTempSkill("zhiwumrfz_ban");
					targets[i].storage.zhiwumrfz_ban = {
						player: player,
						color: get.color(trigger.card),
					};
					player.line(targets[i]);
				}
			},
			group: ["zhiwumrfz_count", "zhiwumrfz_draw"],
			subSkill: {
				draw: {
					forced: true,
					audio: "zhiwumrfz",
					trigger: { source: "damageEnd" },
					filter(event, player) {
						//@ts-ignore
						return player.getRoundHistory("sourceDamage", evt => evt.player === event.player).length === 1;
					},
					async content(event, trigger, player) {
						player.draw();
					},
				},
				count: {
					direct: true,
					trigger: { player: "useCard1" },
					filter: function (event, player) {
						if (!player.isPhaseUsing()) return false;
						if (!event.card || event.card.name != "sha") return false;
						if (event.addCount === false) return false;
						return event.card.cards.length > 1 || (event.card.cards.length == 1 && event.cards[0].name != event.card.name);
					},
					content: async function (event, trigger, player) {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.sha > 0) {
							player.stat[player.stat.length - 1].card.sha--;
						}
					},
				},
				ban: {
					onremove: true,
					mod: {
						cardEnabled: function (card, player) {
							if (get.color(card) == player.storage.zhiwumrfz_ban["color"]) return false;
						},
					},
					silent: true,
					charlotte: true,
					trigger: { global: "useCardAfter" },
					filter: function (event, player) {
						return event.card.name == "sha" && event.player == player.storage.zhiwumrfz_ban["player"];
					},
					content: function () {
						//console.log(player.storage.zhiwumrfz_ban);
						delete player.storage.zhiwumrfz_ban;
						player.removeSkill("zhiwumrfz_ban");
					},
				},
			},
		},

		//莱伊
		shaobanmrfz: {
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
			content: function () {
				var card = game.createCard("shadishoumrfz", "heart", 13);
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
					content: function () {
						trigger.num++;
						player.logSkill("shaobanmrfz", trigger.player);
						player.addTempSkill("shaobanmrfz_ban", {
							global: "phaseEnd",
						});
					},
				},
			},
		},
		tankuangmrfz: {
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
			content: function () {
				var card = game.cardsGotoOrdering(get.cards(1)).cards[0],
					num = 0;
				player.showCards(card, get.translation(player) + "展示了牌堆顶一张牌");
				if (get.color(card) == get.color(trigger.card)) num++;
				if (get.type(card, "trick") == get.type(trigger.card, "trick")) num++;
				if (get.number(card) >= get.number(trigger.card)) num++;
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
				player.removeMark("tankuangmrfz", false);
			},
			group: ["tankuangmrfz_re", "tankuangmrfz_re2"],
			subSkill: {
				re: {
					charlotte: true,
					silent: true,
					trigger: { global: "phaseBegin" },
					content: function () {
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
					content: function () {
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
					content: function () {
						player.addSkill("tankuangmrfz");
					},
				},
			},
		},

		//新斥罪
		newzhidianmrfz: {
			getSkillsList: function (event, player) {
				var list = [];
				var listm = [];
				var listv = [];
				if (player.name1 != undefined) listm = lib.character[player.name1][3];
				else listm = lib.character[player.name][3];
				if (player.name2 != undefined) listv = lib.character[player.name2][3];
				listm = listm.concat(listv);
				var func = function (skill) {
					var info = get.info(skill);
					if (!info || info.charlotte) return false;
					return true;
				};
				for (var i = 0; i < listm.length; i++) {
					if (func(listm[i])) list.add(listm[i]);
				}
				if (player.disabledSkills) {
					for (var key in player.disabledSkills) {
						list.remove(key);
					}
				}
				return list;
			},
			init: (player, skill) => {
				player.storage[skill] = [];
			},
			audio: "zhidianmrfz",
			enable: "phaseUse",
			usable: 114514,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			filterTarget: function (card, player, target) {
				return target != player && !player.storage.newzhidianmrfz.includes(target);
			},
			check: function (card) {
				return 7 - get.value(card);
			},
			position: "he",
			filterCard: true,
			delay: false,
			lose: false,
			discard: false,
			async content(event, trigger, player) {
				let card = event.cards,
					target = event.target;
				player.give(card, target);
				let list = [],
					list2 = [];
				if (target.countCards("he") > 1) {
					list.add(`弃置三张牌，${get.translation(player)}获得其中一张牌`);
					list2.add("选项一");
				} else list.add(`<span style="opacity:0.5">弃置三张牌，${get.translation(player)}获得其中一张牌（不可选:牌数少于2）</span>`);
				list.add(`受到一点伤害且令${get.translation(player)}选择让你一个技能失效`);
				list2.add("选项二");
				if (!target.isLinked()) {
					list.add(`横置武将牌，${get.translation(player)}本回合不能再对你使用此技能`);
					list2.add("选项三");
				} else
					list.add(`<span style="opacity:0.5">横置武将牌，${get.translation(player)}本回合不能再对你使用此技能（不可选:已被横置）</span>`);
				var { control } = await target
					.chooseControl(list2)
					.set("choiceList", list)
					.set("ai", function () {
						var player = _status.event.target,
							list = _status.event.list,
							hs = player.getCards("he", card => {
								return get.value(card) < 8;
							});
						if (player.hp < 2) list.remove("选项二");
						if (player.countCards("he") < 4 || hs.length < 3) list.remove("选项一");
						if (list.length == 0) list.push("选项二");
						return list[0];
					})
					.set("target", event.target)
					.set("list", list2)
					.forResult();
				if (!control) return;
				switch (control) {
					case "选项一":
						const { cards } = await target.chooseToDiscard(true, "he", 3, "请弃置三张牌").forResult();
						if (!cards) return;
						for (var i of cards) {
							if (get.position(i) != "d") cards.remove(i);
						}
						if (cards.length == 0) return;
						const { links } =
							cards.length == 1
								? { links: cards }
								: await player.chooseCardButton(cards, "【执典】:请选择获得一张牌", true, 1).forResult();
						player.gain(links[0], "gain2");
						break;
					case "选项二":
						let skillList = lib.skill.newzhidianmrfz.getSkillsList(event, target);
						if (skillList.length > 0) {
							var { control } = await player
								.chooseControl(skillList)
								.set("prompt", `选择${get.translation(target)}武将牌上的一个技能并令其失效`)
								.forResult();
							target.disableSkill("newzhidianmrfz_disable", control);
							target.addTempSkill("newzhidianmrfz_disable", {
								player: "phaseAfter",
							});
							game.log(player, "选择了", target, "的技能", "#g【" + get.translation(control) + "】");
						}
						target.damage();
						break;
					case "选项三":
						target.link(true);
						if (!player.storage.newzhidianmrfz) player.storage.newzhidianmrfz = [];
						player.storage.newzhidianmrfz.add(target);
						break;
				}
			},
			group: ["newzhidianmrfz_count", "newzhidianmrfz_clear"],
			ai: {
				threaten: 1.2,
				order: 8,
				result: {
					target: function (player, target) {
						var att = get.attitude(player, target);
						if (att < 0) {
							return -(1 + target.countCards("he") * 0.1);
						}
					},
				},
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseAfter" },
					content: function () {
						player.storage.newzhidianmrfz = [];
					},
				},
				count: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBefore",
						player: ["changeHp", "enterGame"],
					},
					filter(event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					content: function () {
						lib.skill.newzhidianmrfz.usable = player.hp;
					},
				},
				disable: {
					onremove(player, skill) {
						player.enableSkill(skill);
					},
					locked: true,
					mark: true,
					charlotte: true,
					intro: {
						content(storage, player, skill) {
							var list = [];
							for (var i in player.disabledSkills) {
								if (player.disabledSkills[i].includes(skill)) list.push(i);
							}
							if (list.length) {
								var str = "失效技能：";
								for (var i = 0; i < list.length; i++) {
									if (lib.translate[list[i] + "_info"]) str += get.translation(list[i]) + "、";
								}
								return str.slice(0, str.length - 1);
							}
						},
					},
				},
			},
		},
		newpijimrfz: {
			audio: "pijimrfz",
			trigger: {
				player: "useCard",
			},
			forced: true,
			locked: false,
			filter: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && current.isLinked();
				});
			},
			content: function () {
				trigger.directHit.addArray(
					game.filterPlayer(current => {
						return current != player && current.isLinked();
					})
				);
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					return arg.target.isLinked();
				},
			},
			group: "newpijimrfz_damage",
			subSkill: {
				damage: {
					audio: false,
					direct: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.player.isLinked() && event.getParent().name != "newpijimrfz_damage";
					},
					content: function () {
						player.logSkill("newpijimrfz");
						for (var i of game.players) {
							if (player == i || !i.isLinked()) continue;
							player.line(i);
							i.damage();
						}
					},
				},
			},
		},

		//新塞雷娅
		newgaihuamrfz: {
			audio: "gaihuamrfz",
			enable: ["chooseToUse", "chooseToRespond"],
			hiddenCard: function (player, name) {
				if (lib.inpile.includes(name) && !player.hasSkill("newgaihuamrfz_ban") && get.type(name) == "basic") return true;
			},
			filter: function (event, player) {
				if (event.responded || event.newgaihuamrfz || player.hasSkill("newgaihuamrfz_ban")) return false;
				for (var i of lib.inpile) {
					if (get.type(i) == "basic" && event.filterCard({ name: i }, player, event)) return true;
				}
				return false;
			},
			direct: true,
			async content(event, trigger, player) {
				var evt = event.getParent(2),
					storage = player.storage.newgaihuamrfz_clear;
				evt.set("newgaihuamrfz", true);
				let list = ["牌堆顶三张牌"],
					list2 = ["选项一"],
					hd = [];
				if (ui.discardPile.childNodes.length > 2) {
					list.add("弃牌堆顶三张牌");
					list2.add("选项二");
				} else list.add('<span style="opacity:0.5">弃牌堆顶三张牌(不可选:弃牌堆牌数小于3）</span>');
				for (var i of game.players) {
					if (get.distance(player, i) > 1) continue;
					if (i.countCards("h") < 1) continue;
					if (i == player) continue;
					hd = hd.concat(i.getCards("h"));
				}
				if (hd.length > 0) {
					list.add("与你距离不大于1的其他角色的手牌");
					list2.add("选项三");
				} else list.add('<span style="opacity:0.5">与你距离不大于1的其他角色的手牌(不可选:你距离不大于1的其他角色没有手牌）</span>');
				const { control } = await player
					.chooseControl(list2, "cancel2")
					.set("choiceList", list)
					.set("ai", function () {
						var list = _status.event.list,
							player = _status.event.player,
							hd = _status.event.hd;
						if (
							game.countPlayer(current => {
								return player != current && get.distance(player, current) <= 1 && get.distance(player, current) < 0;
							}) < 1 ||
							hd.length < 3
						)
							list.remove("选项三");
						if (list.length == 0) return "cancel2";
						return list.randomGet();
					})
					.set("list", list2)
					.set("hd", hd)
					.forResult();
				if (!control || control == "cancel2") {
					evt.goto(0);
					return;
				}
				var cards = [];
				switch (control) {
					case "选项一":
						cards = get.cards(3, true);
						break;
					case "选项二":
						var num = 3;
						while (num--) {
							if (ui.discardPile.hasChildNodes() == false) {
								break;
							}
							var cardx = ui.discardPile.removeChild(ui.discardPile.firstChild);
							cardx.original = "d";
							cards.push(cardx);
						}
						for (let i = cards.length - 1; i >= 0; i--) {
							ui.discardPile.insertBefore(cards[i], ui.discardPile.firstChild);
						}
						break;
					case "选项三":
						cards = hd;
						break;
				}
				const { links } = await player
					.chooseButton(["【钙化】:选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards])
					.set("filterButton", function (button) {
						var player = _status.event.player,
							event = _status.event;
						return _status.event.cards.includes(button.link);
					})
					.set(
						"cards",
						cards.filter(function (card) {
							if (get.type(card) != "basic") return false;
							return evt.filterCard(card, evt.player, evt);
						})
					)
					.set("ai", function (button) {
						var evt = _status.event.getParent(3);
						if (evt && evt.ai) {
							var tmp = _status.event;
							_status.event = evt;
							var result = (evt.ai || event.ai1)(button.link, _status.event.player, evt);
							_status.event = tmp;
							return result;
						}
						return 1;
					})
					.forResult();
				if (!links) {
					evt.goto(0);
					return;
				}
				var card = links[0],
					name = links[0].name;
				if (_status.currentPhase == player)
					player.addTempSkill("newgaihuamrfz_ban", {
						global: "phaseBeginStart",
					});
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.newgaihuamrfz_backup.viewAs = {
								name: name,
								cards: [result],
								isCard: true,
							};
						},
						card,
						name
					);
					var evt = event.getParent(2);
					evt.set("_backupevent", "newgaihuamrfz_backup");
					evt.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
					evt.backup("newgaihuamrfz_backup");
					player.logSkill("gaihuamrfz");
				} else {
					delete evt.result.skill;
					delete evt.result.used;
					evt.result.card = get.autoViewAs(card);
					evt.result.cards = [card];
					player.logSkill("gaihuamrfz");
					evt.redo();
					return;
				}
				evt.goto(0);
			},
			ai: {
				effect: {
					target: function (card, player, target, effect) {
						if (get.tag(card, "respondShan")) return 0.7;
						if (get.tag(card, "respondSha")) return 0.7;
					},
				},
				order: 11,
				respondShan: true,
				respondSha: true,
				result: {
					player: function (player) {
						if (_status.event.dying) return get.attitude(player, _status.event.dying);
						return 1;
					},
				},
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		newgaihuamrfz_backup: {
			sourceSkill: "newgaihuamrfz",
			precontent: function () {
				delete event.result.skill;
				var name = event.result.card.name,
					cards = event.result.card.cards.slice(0);
				event.result.cards = cards;
				var rcard = cards[0],
					card;
				if (rcard.name == name) card = get.autoViewAs(rcard);
				else card = get.autoViewAs({ name, isCard: true });
				event.result.card = card;
			},
			filterCard: function () {
				return false;
			},
			selectCard: -1,
		},
		panshimrfz: {
			mod: {
				targetEnabled: function (card, player, target) {
					for (var i of game.players) {
						if (i.getHistory("useCard").length > 0) return;
					}
					return false;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "useCard" },
			filter: function (event, player) {
				if (player.getHistory("useCard").length > 1) return false;
				return (
					event.card &&
					(get.type2(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)))
				);
			},
			content: function () {
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
		},

		//新玛恩纳
		lianmangmrfz: {
			audio: 2,
			trigger: {
				target: "useCardToTargeted",
			},
			filter: function (event, player) {
				return player.countCards("h") > 0 && event.card && event.player != player && !player.hasSkill("zhanmangmrfz_ban");
			},
			banHs: function (event, trigger, player) {
				player.addTempSkill("lianmangmrfz_ban");
				_status.tmpCard = trigger.card;
				player
					.when({
						global: "useCardAfter",
						player: "dying",
					})
					.filter((event, player) => {
						return event.card == _status.tmpCard || event.name == "dying";
					})
					.then(() => {
						player.removeSkill("lianmangmrfz_ban");
						delete _status.tmpCard;
					});
				// .emb({ firstDo: true });
			},
			forced: true,
			async content(event, trigger, player) {
				let num = get.cardNameLength(trigger.card);
				const { cards } = await player
					.chooseCard(`【敛芒】:请重铸至多${get.cnNumber(num)}张牌`, [0, num], true)
					.set("ai", function (card) {
						if (get.tag(card, "damage")) return 10 - get.value(card);
						return 6 - get.value(card);
					})
					.set("filterCard", card => player.canRecast(card))
					.forResult();
				if (!cards || cards.length == 0) {
					lib.skill.lianmangmrfz.banHs(event, trigger, player);
					return;
				}
				let hs = player.getCards("h");
				await player.recast(cards, undefined, undefined);
				if (cards.filter(i => get.tag(i, "damage")).length > 0) player.draw();
				if (hs.isSubset(cards)) trigger.player.damage();
				lib.skill.lianmangmrfz.banHs(event, trigger, player);
			},
			group: ["lianmangmrfz_cancel"],
			subSkill: {
				ban: {
					charlotte: true,
					mod: {
						cardEnabled2: function (card, player) {
							if (get.position(card) == "h") return false;
						},
					},
				},
				cancel: {
					forced: true,
					audio: "lianmangmrfz",
					trigger: { source: "damageBefore" },
					filter: function (event, player) {
						return !player.hasSkill("zhanmangmrfz_ban");
					},
					async content(event, trigger, player) {
						let num = trigger.num;
						trigger.cancel();
						let list = ["选项一"];
						let chooseList = [`摸${get.cnNumber(num)}张牌`, `回复${get.cnNumber(num)}点体力`];
						if (player.getDamagedHp() > 0) {
							list.push("选项二");
						} else chooseList[1] = '<span style="opacity:0.5">' + chooseList[2] + "（不可选：已损失体力值为零）</span>";
						const { control } =
							list.length == 1
								? player.draw(num)
								: await player
										.chooseControl(list)
										.set("choiceList", chooseList)
										.set("prompt", "【敛芒】:请选择一项")
										.set("ai", function () {
											var list = _status.event.list;
											if (list.includes("选项二")) return "选项二";
											return "选项一";
										})
										.set("list", list)
										.forResult();
						if (!control) return;
						switch (control) {
							case "选项一":
								player.draw(num);
								break;
							case "选项二":
								player.recover(num);
								break;
						}
					},
				},
			},
			ai: {
				threaten: 0.8,
				effect: {
					target: function (card, player, target) {
						if (get.tag(card, "damage")) return [0, -999999];
					},
				},
			},
		},
		zhanmangmrfz: {
			audio: 2,
			trigger: { player: "phaseUseBegin" },
			filter: function (event, player) {
				return player.countCards("h") > player.getHandcardLimit();
			},
			prompt: function (event, player) {
				var num = Math.min(player.maxHp, player.countCards("h") - player.getHandcardLimit());
				return `【展芒】:你可以摸${get.cnNumber(num)}张牌、本回合使用【杀】的次数+${num}，且本回合【敛芒】失效`;
			},
			content() {
				var num = Math.min(player.maxHp, player.countCards("h") - player.getHandcardLimit());
				player.draw(num);
				player.addMark("zhanmangmrfz_add", num, false);
				player.addTempSkill("zhanmangmrfz_add", {
					player: "phaseEnd",
				});
				player.addTempSkill("zhanmangmrfz_ban", {
					player: "phaseEnd",
				});
			},
			subSkill: {
				ban: {
					charlotte: true,
					mark: true,
					intro: {
						content(event, player) {
							return `·【敛芒】失效<br>·本回合使用【杀】的次数+${player.countMark("zhanmangmrfz_add")}`;
						},
					},
				},
				add: {
					charlotte: true,
					onremove: true,
					mod: {
						cardUsable: function (card, player, num) {
							var count = player.countMark("zhanmangmrfz_add");
							if (card.name == "sha") return num + count;
						},
					},
				},
			},
			ai: {
				threaten: function () {
					var player = _status.event.player,
						num = player.countCards("h") - player.getHandcardLimit();
					return 1 + Math.max(0.2, num * 0.2);
				},
			},
		},
		xingyimrfz: {
			audio: 2,
			trigger: { global: "phaseJieshuBegin" },
			getDamagedTarget: function (event, player) {
				let list = [];
				for (var i of game.players) {
					if (player == i) continue;
					let history = i.getHistory("damage");
					for (var j = 0; j < history.length; j++) {
						let damaged = history[j].player;
						list.push(damaged);
					}
				}
				return list;
			},
			filter: function (event, player) {
				var list = lib.skill.xingyimrfz.getDamagedTarget(event, player);
				return list.length > 0 && _status.currentPhase != player;
			},
			direct: true,
			async content(event, trigger, player) {
				let list = lib.skill.xingyimrfz.getDamagedTarget(event, player);
				const { targets } = await player
					.chooseTarget("【行义】:你可以受到一点伤害并令一名本回合受到过伤害的其他角色回复一点体力")
					.set("filterTarget", function (card, player, target) {
						var list = _status.event.list;
						return list.includes(target);
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						if (player.hp < 2 && player.countCards("h", "tao") + player.countCards("h", "jiu") < 1) return 0;
						return get.attitude(target, player) > 0;
					})
					.set("list", list)
					.forResult();
				if (!targets) return;
				targets[0].recover();
				player.damage("nosource");
				player.logSkill("xingyimrfz", targets[0]);
			},
		},

		//左乐
		qikumrfz: {
			audio: 2,
			trigger: { player: "gainBegin" },
			filter: function (event, player) {
				return player.countCards("h") == 0 && event.getParent(2).name != "qikumrfz";
			},
			forced: true,
			content() {
				var num = player.maxHp - trigger.cards.length;
				player.draw(num);
			},
		},
		/** @type { Skill } */
		bingzhumrfz: {
			marktext: "司",
			intro: {
				name: "司",
				markcount: "expansion",
				content: "expansion",
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				var suit = [];
				for (var i of player.getCards("h")) {
					if (suit.includes(get.suit(i))) continue;
					suit.push(get.suit(i));
				}
				if (suit.length == 0) return;
				const { control } = await player
					.chooseControl(suit, "cancel2")
					.set("prompt", "【秉烛】:请选择一种花色")
					.set("ai", function () {
						var suit = _status.event.suit;
						return suit.randomGet();
					})
					.set("suit", suit)
					.forResult();
				if (!control || control == "cancel2") {
					if (control == "cancel2") {
						player.setSkillCount("bingzhumrfz", -1);
					}
					return;
				}
				var hs = player.getCards("h", card => {
					return get.suit(card) == control;
				});
				if (hs.length == 0) return;
				let list = [];
				while (hs.length) {
					const { cards } = await player
						.chooseCard(true, `【秉烛】:请分配第${get.cnNumber(list.length + 1)}组手牌`)
						.set("selectCard", function () {
							var player = _status.event.player;
							var num = game.countPlayer(current => current != player) - (list.length + 1) > 0 ? 1 : hs.length;
							return [num, Infinity];
						})
						.set("ai", function (card) {
							if (!ui.selected.cards) return 1;
							if (
								game.countPlayer(current => {
									return current != player && get.attitude(current, player) < 0;
								}) < 2
							)
								return 1;
							for (var i of ui.selected.cards) {
								if (get.suit(i) == get.suit(card)) return [-1, -1, 1, 1].randomGet();
								return 1;
							}
						})
						.set("filterCard", card => {
							var hs = _status.event.hs;
							return hs.includes(card);
						})
						.set("hs", hs)
						.forResult();
					if (!cards) continue;
					list.push([cards]);
					hs.removeArray(cards);
				}
				let count = list.length,
					list2 = [];
				while (count) {
					const { targets } = await player
						.chooseTarget(true, `【秉烛】:请将${get.translation(list[list2.length])}置于一名其他角色的武将牌上`)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.attitude(player, target) < 0;
						})
						.set("filterTarget", lib.filter.notMe)
						.forResult();
					count--;
					if (!targets) continue;
					list2.push(targets[0]);
				}
				for (var i = 0; i < list2.length; i++) {
					list2[i].addToExpansion(list[i][0], list2[i], "giveAuto").gaintag.add("bingzhumrfz");
				}
			},
			group: ["bingzhumrfz_clear", "bingzhumrfz_eff"],
			subSkill: {
				eff: {
					direct: true,
					trigger: { global: "useCardToTargeted" },
					filter: function (event, player) {
						var cards = event.player.getExpansions("bingzhumrfz");
						if (!cards.length || !event.card) return false;
						if (get.type2(event.card) != "trick" && get.type(event.card) != "basic") return false;
						for (var i of cards) {
							if (get.name(i) == get.name(event.card) || get.suit(i) == get.suit(event.card)) return true;
						}
						return false;
					},
					async content(event, trigger, player) {
						var cards = trigger.player
							.getExpansions("bingzhumrfz")
							.filter(i => get.name(i) == get.name(trigger.card) || get.suit(i) == get.suit(trigger.card));
						const {
							result: { bool, links },
						} = await player.chooseCardButton("【秉烛】:你可以弃置其一张‘司’并令此牌对一名目标角色无效", cards).set("ai", () => {
							var player = _status.event.player,
								event = _status.event.getTrigger(),
								friend = game.filterPlayer(current => current == player || get.attitude(current, player) > 0);
							for (var i of event.targets) {
								if (friend.includes(i)) return 1;
							}
							return 0;
						});
						if (!bool) return;
						const { targets } = await player
							.chooseTarget("【秉烛】:请选择一名目标角色，然后此牌对该角色无效", true)
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.attitude(target, player) > 0;
							})
							.set("filterTarget", (card, player, target) => {
								var targets = _status.event.targets;
								return targets.includes(target);
							})
							.set("targets", trigger.targets)
							.forResult();
						if (!targets) return;
						trigger.getParent().excluded.add(targets[0]);
						trigger.player.loseToDiscardpile(links);
						player.draw();
						player.logSkill("bingzhumrfz", targets[0]);
					},
				},
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "dieAfter" },
					content() {
						for (var i of game.players) {
							var cards = i.getExpansions("bingzhumrfz");
							if (cards.length) i.loseToDiscardpile(cards);
						}
					},
				},
			},
		},

		//新山
		zhefumrfz: {
			audio: "zhuangtimrfz",
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				return player.countCards("h", card => get.tag(card, "damage")) > 0;
			},
			prompt(event, player) {
				return `【蛰伏】:是否将手牌中所有带有伤害类标签的牌置入弃牌堆或牌堆顶并摸等量的牌？`;
			},
			async content(event, trigger, player) {
				let cards = player.getCards("h", card => get.tag(card, "damage"));
				if (!cards.length) return;
				const { moved } = await player
					.chooseToMove()
					.set("list", [["牌堆底", cards], ["弃牌堆"]])
					.set("processAI", list => {
						var player = _status.event.player,
							cards = list[0][1],
							canUse = cards.filter(i => player.canUseToAnyone(i)),
							bottom = [],
							disPile = [];
						var red = 0,
							black = 0;
						for (var i of canUse) {
							var color = get.color(i);
							if (!color) continue;
							else if (color == "red") red += get.value(i);
							else black += get.value(i);
						}
						if (red > black) bottom = canUse.slice().filter(i => get.color(i) == "red");
						else bottom = canUse.slice().filter(i => get.color(i) == "black");
						bottom.sort(function (a, b) {
							return get.value(b, player) - get.value(a, player);
						});
						disPile = cards.slice().filter(i => !bottom.includes(i));
						return [bottom, disPile];
					})
					.forResult();
				if (!moved) return;
				var bottom = moved[0],
					disPile = moved[1];
				console.log(moved);
				if (disPile.length) player.loseToDiscardpile(disPile);
				if (bottom.length) {
					game.log(player, "将", get.cnNumber(bottom.length), "置入了牌堆底");
					for (var i of bottom) ui.cardPile.appendChild(i);
					player.$throw(bottom.length, 1000);
				}
				await player.draw(cards.length);
			},
		},
		yubianmrfz: {
			audio: "julimrfz",
			trigger: { player: "phaseJieshuBegin" },
			prompt(event, player) {
				return `【狱变】:你可以使用牌堆顶的牌（目标必须合法），若你因此使用的牌颜色均相同，你重复这个流程`;
			},
			check(event, player) {
				return game.hasPlayer(current => {
					return current != player && player.canUse("sha", current) && get.attitude(player, current) < 0;
				});
			},
			async content(event, trigger, player) {
				let cardx = [],
					color;
				while (true) {
					var card = get.bottomCards()[0];
					player.$throw(card, null);
					if (!player.hasUseTarget(card)) return;
					const result = await player.chooseUseTarget(card, `【狱变】:请选择${get.translation(card)}的目标`);
					if (!result) return;
					var cards = result.cards;
					for (var i of cards) cardx.push(i);
					color = get.color(cards[0]);
					for (var i of cardx) {
						if (get.color(i) != color) {
							return;
						}
						color = get.color(i);
					}
				}
			},
		},

		//新空弦
		sanyimrfz: {
			audio: "lieshimrfz",
			trigger: { player: "useCard2" },
			filter(event, player) {
				if (!event.card) return false;
				if (get.name(event.card) != "sha" || get.number(event.card) == null) return false;
				return event.targets && event.targets.length == 1;
			},
			direct: true,
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget()
					.set("forced", true)
					.set("filterTarget", (card, player, target) => {
						if (target == player || _status.event.targets.includes(target) || !player.canUse(_status.event.cardx, target, false))
							return false;
						var selected = ui.selected.targets,
							base = _status.event.targetx.hp;
						var total = Object.values(selected).reduce((accumulator, currentValue) => {
							if (currentValue.hasOwnProperty("hp")) {
								return accumulator + currentValue.hp;
							}
							return accumulator;
						}, 0);
						return target.hp + total + base <= _status.event.cardx.number;
					})
					.set("prompt", `【散逸】:你可以额外指定任意名体力值之和不超过${trigger.card.number - trigger.targets[0].hp}的角色`)
					.set("selectTarget", [0, Infinity])
					.set("complexTarget", true)
					.set("ai", target => {
						return get.effect(target, _status.event.cardx, _status.event.player, _status.event.player) > 0;
					})
					.set("targets", trigger.targets)
					.set("targetx", trigger.targets[0])
					.set("cardx", trigger.card)
					.forResult();
				if (!targets) return false;
				for (var i of targets) {
					trigger.targets.push(i);
					player.line(i);
				}
				player.logSkill("sanyimrfz");
			},
		},
		baofengmrfz: {
			audio: 2,
			trigger: { source: "damageEnd" },
			filter(event, player) {
				return event.card && get.name(event.card) == "sha" && get.color(event.card) != "none";
			},
			forced: true,
			async content(event, trigger, player) {
				const { bool } = await player
					.chooseUseTarget(
						{
							name: "sha",
							suit: "none",
							number: trigger.card.number,
							nature: trigger.card.nature,
						},
						false,
						false
					)
					.set("prompt", `【追矢】:你可以视为使用一张无色且点数为${trigger.card.number}的${get.translation(trigger.card.nature)}【杀】`)
					.forResult();
				if (!bool) return;
			},
		},

		//ela 艾拉
		zuzhimrfz: {
			audio: 2,
			trigger: { source: "damageEnd" },
			filter(event, player) {
				return (
					event.card &&
					get.color(event.card) != "none" &&
					event.player &&
					event.player.isIn() &&
					(!event.player.storage.zuzhimrfz || !event.player.storage.zuzhimrfz.includes(get.color(event.card)))
				);
			},
			prompt(event, player) {
				return `【阻滞】:是否令${event.player == player ? "你" : get.translation(event.player)}本回合无法使用或打出${get.translation(get.color(event.card))}的牌？`;
			},
			check(event, player) {
				return get.attitude(event.player, player) < 0;
			},
			content() {
				var target = trigger.player;
				if (!target.storage.zuzhimrfz_ban) target.storage.zuzhimrfz_ban = [];
				target.storage.zuzhimrfz_ban.add(get.color(trigger.card));
				target.addTempSkill("zuzhimrfz_ban", {
					global: "phaseEnd",
				});
			},
			subSkill: {
				ban: {
					charlotte: true,
					onremove: true,
					mark: true,
					intro: {
						content(event, player) {
							return `本回合不能使用或打出${get.translation(player.storage.zuzhimrfz_ban)}的牌`;
						},
					},
					mod: {
						cardEnabled: function (card, player) {
							if (player.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
						},
						cardRespondable: function (card, player) {
							if (player.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
						},
						cardSavable: function (card, player) {
							if (player.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
						},
					},
				},
			},
		},
		leimingmrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: true,
			mark: true,
			intro: {
				content(event, player) {
					if (game.me == player) {
						return `记录的内容：${get.translation(player.storage.leimingmrfz)}`;
					} else return `有${player.storage.leimingmrfz.length}个记录的内容`;
				},
			},
			audio: 2,
			trigger: { global: "roundStart" },
			direct: true,
			async content(event, trigger, player) {
				player.storage.leimingmrfz = [];
				var list1 = [],
					list2 = [],
					list3 = [],
					list4 = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var type = get.type(lib.inpile[i]);
					if (type == "basic") {
						list1.push(["基本", "", lib.inpile[i]]);
					} else if (type == "trick") {
						list2.push(["锦囊", "", lib.inpile[i]]);
					} else if (type == "delay") {
						list3.push(["锦囊", "", lib.inpile[i]]);
					} else if (type == "equip") {
						list3.push(["装备", "", lib.inpile[i]]);
					}
				}
				const { links } = await player
					.chooseButton([get.prompt("leimingmrfz"), [list1.concat(list2).concat(list3).concat(list4), "vcard"]])
					.set("filterButton", function (button) {
						var player = _status.event.player;
						if (player.storage.leimingmrfz.includes(button.link[2])) return false;
						return true;
					})
					.set("ai", function (button) {
						var rand = _status.event.rand;
						switch (button.link[2]) {
							case "sha":
								return 5 + rand[1];
							case "tao":
								return 4 + rand[2];
							case "lebu":
								return 3 + rand[3];
							case "shan":
								return 4.5 + rand[4];
							case "wuzhong":
								return 4 + rand[5];
							case "shunshou":
								return 3 + rand[6];
							case "nanman":
								return 2 + rand[7];
							case "wanjian":
								return 2 + rand[8];
							default:
								return rand[0];
						}
					})
					.set("rand", [
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
					])
					.forResult();
				if (!links) return;
				player.logSkill("leimingmrfz");
				player.storage.leimingmrfz.add(links[0][2]);
				var { control } = await player
					.chooseControl(lib.suit)
					.set("prompt", "【雷鸣】:请选择一种花色")
					.set("ai", () => lib.suit.randomGet())
					.forResult();
				if (!control) return;
				player.storage.leimingmrfz.add(control);
				var { control } = await player
					.chooseControl("basic", "trick", "equip")
					.set("prompt", "【雷鸣】:请选择一种类型")
					.set("ai", () => ["basic", "basic", "basic", "trick", "trick", "equip"].randomGet())
					.forResult();
				if (!control) return;
				player.storage.leimingmrfz.add(control);
			},
			group: "leimingmrfz_eff",
			subSkill: {
				eff: {
					audio: "leimingmrfz",
					trigger: { global: "useCard" },
					onremove: true,
					filter(event, player) {
						var storage = player.storage.leimingmrfz,
							card = event.card;
						if (player.storage.leimingmrfz_eff) return false;
						if (!storage || storage.length == 0) return false;
						if (player == event.player) return false;
						return (
							storage.includes(get.suit(card, event.player)) ||
							storage.includes(get.name(card, event.player)) ||
							storage.includes(get.type2(card, event.player))
						);
					},
					prompt(event, player) {
						return `【雷鸣】:是否视为对${get.translation(event.player)}使用一张任意颜色的雷【杀】？`;
					},
					check(event, player) {
						if (get.attitude(event.player, player) > 0) return false;
						return get.effect(event.player, { name: "sha", nature: "thunder" }, player, player) > 0;
					},
					async content(event, trigger, player) {
						player.storage.leimingmrfz_eff = true;
						player
							.when({
								player: "leimingmrfz_effAfter",
							})
							.then(() => {
								delete player.storage.leimingmrfz_eff;
							});
						// .emb({ firstDo: true });
						var target = trigger.player;
						// if (target.countDiscardableCards(player, 'he')) player.discardPlayerCard('he', true, target)
						//     .set('target', target)
						//     .set('ai', lib.card.guohe.ai.button);
						if (player.canUse({ name: "sha", nature: "thunder" }, target, false)) {
							var { control } = await player
								.chooseControl("red", "black")
								.set("prompt", `【雷鸣】:请选择使用雷【杀】的颜色`)
								.set("ai", function () {
									var player = _status.event.player,
										target = _status.event.target;
									var red = get.effect(
											target,
											{
												name: "sha",
												nature: "thunder",
												color: "red",
											},
											player,
											player
										),
										black = get.effect(
											target,
											{
												name: "sha",
												nature: "thunder",
												color: "black",
											},
											player,
											player
										);
									if (red > black) return 0;
									return 1;
								})
								.set("target", target)
								.forResult();
							if (!control) return;
							if (
								player.canUse(
									{
										name: "sha",
										nature: "thunder",
										color: control,
									},
									target,
									false
								)
							) {
								player.useCard(
									{
										name: "sha",
										nature: "thunder",
										color: control,
									},
									target,
									true
								);
							}
						}
						var list = [],
							storage = player.storage.leimingmrfz,
							card = trigger.card;
						if (storage.includes(get.name(card, target))) list.push(get.name(card, target));
						if (storage.includes(get.suit(card, target))) list.push(get.suit(card, target));
						if (storage.includes(get.type2(card, target))) list.push(get.type2(card, target));
						var { control } =
							list.length == 1
								? { control: list[0] }
								: await player
										.chooseControl(list)
										.set("prompt", `【雷鸣】:请选择清除一个记录`)
										.set("list", list)
										.set("ai", function () {
											var list = _status.event.list;
											return list.randomGet();
										})
										.forResult();
						if (!control) return;
						player.storage.leimingmrfz.remove(control);
					},
				},
			},
		},

		//阿斯卡纶
		dunyingmrfz: {
			mod: {
				globalTo(from, to, distance) {
					var cards = to.getCards("s", function (card) {
						return card.hasGaintag("dunyingmrfz");
					});
					if (cards.length) return distance + 1;
				},
			},
			marktext: "影",
			intro: {
				mark: function (dialog, storage, player) {
					var cards = player.getCards("s", function (card) {
						return card.hasGaintag("dunyingmrfz");
					});
					if (game.me == player) dialog.addAuto(cards);
					else return `共有${cards.length}张牌`;
				},
			},
			onremove: function (player, skill) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("dunyingmrfz");
				});
				if (cards.length) {
					player.lose(cards, ui.discardPile);
					player.$throw(cards, 1000);
					game.log(cards, "进入了弃牌堆");
				}
			},
			audio: 2,
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter: function (event, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("dunyingmrfz");
				});
				if (
					player.countCards("h", card => {
						return !card.hasGaintag("dunyingmrfz");
					}) < 1
				)
					return false;
				return cards.length < player.maxHp;
			},
			async content(event, trigger, player) {
				var num = player.getCards("s", function (card) {
					return card.hasGaintag("dunyingmrfz");
				}).length;
				const { cards } =
					player.countCards("h", card => {
						return !card.hasGaintag("dunyingmrfz");
					}) +
						num <=
					player.maxHp
						? { cards: player.getCards("h") }
						: await player
								.chooseCard("h", get.prompt("dunyingmrfz"), "将所有手牌置于武将牌上，称之为“影”", true)
								.set("selectCard", () => {
									var player = _status.event.player;
									var num = player.getCards("s", function (card) {
										return card.hasGaintag("dunyingmrfz");
									}).length;
									return player.maxHp - num;
								})
								.set("filterCard", card => {
									return !card.hasGaintag("dunyingmrfz");
								})
								.set("ai", function (card) {
									var player = _status.event.player;
									if (player.hasUseTarget(card) && !player.hasValueTarget(card)) return 0;
									if (["sha", "shan", "wuxie", "caochuan"].includes(card.name)) return 2 + Math.random();
									return 1 + Math.random();
								})
								.forResult();
				if (!cards) return;
				game.log(player, "将", cards.length, "张牌置于在武将牌上");
				player.loseToSpecial(cards, "dunyingmrfz");
				player.markSkill("dunyingmrfz");
			},
			group: ["dunyingmrfz_gain"],
			subSkill: {
				gain: {
					audio: "dunyingmrfz",
					trigger: { player: "useCard" },
					usable: 1,
					filter(event, player) {
						var cards = player.getCards("s", function (card) {
							return card.hasGaintag("dunyingmrfz");
						});
						if (!event.cards.length) return cards.length < player.maxHp;
						var position = event.card.cards.map(i => i.original);
						return position.every(item => item != "h") && cards.length < player.maxHp;
					},
					prompt: "【遁影】:你可以将牌堆顶的一张牌置于你的武将牌上，称之为“影”",
					content() {
						var cards = get.cards();
						game.log(player, "将一张牌置于在武将牌上");
						player.loseToSpecial(cards, "dunyingmrfz");
						player.markSkill("dunyingmrfz");
					},
				},
			},
		},
		niximrfz: {
			audio: 2,
			trigger: { global: "phaseJieshuBegin" },
			filter(event, player) {
				return event.player.isIn() && event.player != player && player.canUse("sha", event.player, false);
			},
			direct: true,
			async content(event, trigger, player) {
				const { cards } = await player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						"【匿袭】是否对" + get.translation(trigger.player) + "使用一张杀？"
					)
					.set("logSkill", "niximrfz")
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player)
					.forResult();
				if (!cards) return;
				var isDamaged = player.hasHistory("useCard", evt => {
					return (
						evt.getParent(2) == event &&
						evt.card &&
						evt.card.cardid &&
						player.hasHistory("sourceDamage", evtx => {
							return evtx.card && evt.card.cardid == evtx.card.cardid;
						})
					);
				});
				if (!isDamaged && player.isIn() && trigger.player.isIn()) {
					var target = trigger.player,
						targetx = trigger.player,
						list = [];
					if (target.getNext() == player) return;
					const { bool } = await player.chooseBool(`【匿袭】:是否将座位移到${get.translation(trigger.player)}下家？`).forResult();
					if (!bool) return;
					while (targetx.getNext() != player) {
						targetx = targetx.getNext();
						list.push(targetx);
					}
					if (list.length == 0) return;
					list.reverse();
					for (var i of list) {
						await game.broadcastAll(
							function (target1, target2) {
								game.swapSeat(target1, target2);
							},
							i,
							player
						);
					}
				}
			},
		},

		// logos 逻格斯 李狗剩
		baidumrfz: {
			audio: 2,
			trigger: {
				global: "damageEnd",
			},
			usable: 1,
			filter(event, player) {
				if (!event.card) return false;
				var num = get.cardNameLength(event.card);
				if (typeof num !== "number" || num < 1) return false;
				return player.countCards("he") > 0 && event.player.isIn();
			},
			// direct: true,
			async cost(event, trigger, player) {
				let sourceCards = trigger.cards || undefined;
				const { result } = await player
					.chooseToDiscard("he")
					.set("prompt", get.prompt("baidumrfz"))
					.set(
						"prompt2",
						`你可以弃置一张牌，${sourceCards === undefined ? "(" + get.translation(trigger.card) + "无对应的实体牌)" : "你获得" + get.translation(trigger.card) + "(" + get.translation(sourceCards) + "),"}然后${get.translation(trigger.player)}摸你弃置的牌与对其造成伤害的牌的字数之差的绝对值张牌。`
					)
					.set("ai", function (card) {
						var player = _status.event.player,
							target = _status.event.targetx,
							cardx = trigger.card,
							att = get.attitude(player, target);
						if (att > 0) {
							return Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card)) - Math.floor(get.value(card) / 10);
						} else {
							if (Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card)) > cardx.cards.length) return 0;
							return get.value(cardx.cards) - get.value(card);
						}
					})
					.set("targetx", trigger.player)
					.set("cardx", trigger.card);
				event.result = result;
			},
			async content(event, trigger, player) {
				let sourceCards = trigger.cards || undefined;
				let cards = event.cards;
				var gaincard = [];
				for (var i of sourceCards) {
					if (get.position(i, true) == "o") gaincard.push(i);
				}
				if (gaincard.length > 0) player.gain(gaincard, "gain2");
				var num = Math.abs(get.cardNameLength(trigger.card) - get.cardNameLength(cards[0]));
				if (num > 0) trigger.player.draw(num);
				player.line(trigger.player);
			},
		},
		yuhuimrfz: {
			init(player, skill) {
				player.storage[skill] = {
					del: false,
					names: [],
				};
			},
			mark: true,
			intro: {
				mark(dialog, content, player) {
					var names = player.storage.yuhuimrfz["names"];
					dialog.addText(`本回合【语汇】使用过的牌:<br>${get.translation(names)}`);
				},
			},
			audio: 2,
			enable: "chooseToUse",
			hiddenCard: function (player, name) {
				return player.countCards("hes") > 0 && !player.storage.yuhuimrfz["names"].includes(name);
			},
			filter: function (event, player) {
				if (player.countCards("hes") < 1) return false;
				for (var name of lib.inpile) {
					if (player.storage.yuhuimrfz["names"].includes(name)) continue;
					if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var list = [];
					for (var name of lib.inpile) {
						if (player.storage.yuhuimrfz.names.includes(name)) {
							continue;
						}
						if (event.filterCard({ name: name }, player, event)) {
							if (name == "sha") {
								list.push(["基本", "", "sha"]);
								for (var j of lib.inpile_nature) {
									list.push(["基本", "", "sha", j]);
								}
							} else if (get.type(name) == "trick") {
								list.push(["锦囊", "", name]);
							} else if (get.type(name) == "basic") {
								list.push(["基本", "", name]);
							}
						}
					} //QQQ
					return ui.create.dialog("语汇", [list, "vcard"]);
				},
				filter: function (button, player) {
					var cards = player.getCards("hes"),
						name = button.link[2],
						cardsx = [];
					for (var i of cards) {
						if (get.cardNameLength(i) >= get.cardNameLength(name)) cardsx.push(name);
					}
					return _status.event.getParent().filterCard({ name: name }, player, _status.event.getParent()) && cardsx.includes(name);
				},
				check: function (button) {
					var player = _status.event.player;
					if (player.countCards("hs", button.link[2]) > 0) return 0;
					if (button.link[2] == "wugu") return;
					var effect = player.getUseValue(button.link[2]);
					if (effect > 0) return effect;
					return 0;
				},
				backup: function (links, player) {
					return {
						filterCard(card) {
							var needNumber = get.cardNameLength(links[0][2]);
							return get.cardNameLength(card) >= needNumber;
						},
						audio: "yuhuimrfz",
						selectCard: 1,
						popname: true,
						check: function (card) {
							return 6 - get.value(card);
						},
						position: "hes",
						viewAs: { name: links[0][2], nature: links[0][3] },
						precontent() {
							if (!player.storage.yuhuimrfz)
								player.storage.yuhuimrfz = {
									del: false,
									names: [],
								};
							player.storage.yuhuimrfz["names"].add(lib.skill.yuhuimrfz_backup.viewAs.name);
							if (player.storage.yuhuimrfz["del"] != true) {
								player.storage.yuhuimrfz["del"] = true;
								player.when({ global: "phaseEnd" }).then(() => {
									player.storage.yuhuimrfz = {
										del: false,
										names: [],
									};
								});
							}
						},
					};
				},
				prompt: function (links, player) {
					return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
				},
			},
			ai: {
				save: true,
				respondSha: true,
				respondShan: true,
				skillTagFilter: function (player, tag, arg) {
					if (!player.countCards("hes")) return false;
					if (tag == "respondSha" || tag == "respondShan") {
						if (arg == "respond") return false;
						return !player.storage.yuhuimrfz["names"].includes(tag == "respondSha" ? "sha" : "shan");
					}
					return true;
				},
				order: 4,
				result: {
					player: 1,
				},
				threaten: 2.8,
			},
		},

		// 维什戴尔 异格w 益达
		yuximrfz: {
			mod: {
				globalTo(from, to, distance) {
					var cards = to.getCards("s", function (card) {
						return card.hasGaintag("yuximrfzx");
					});
					if (cards.length) return distance + 2;
				},
			},
			marktext: "死魂灵",
			intro: {
				mark: function (dialog, storage, player) {
					var cards = player.getCards("s", function (card) {
						return card.hasGaintag("yuximrfzx");
					});
					if (cards && cards.length > 0) dialog.addAuto("其他角色计算与你的距离+2");
					else return `没有‘死魂灵’`;
					if (game.me == player) dialog.addAuto(cards);
					else dialog.addAuto(`共有${cards.length}张牌`);
				},
			},
			onremove: function (player, skill) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("yuximrfzx");
				});
				if (cards.length) {
					game.cardsGotoSpecial(cards);
					player.$throw(cards, 1000);
					game.log(cards, "被销毁");
				}
			},
			audio: 2,
			forced: true,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				lib.skill.yuximrfz.onremove(player, "yuximrfz");
				var cards = [],
					nature = ["fire", "thunder"];
				for (var i = 0; i < player.maxHp; i++) {
					var name = lib.inpile
						.filter(name => {
							return get.type(name) == "trick" || get.type(name) == "basic";
						})
						.randomGet();
					cards.push(
						game.createCard(
							name,
							lib.suit.randomGet(),
							Math.floor(Math.random() * 13) + 1,
							name == "sha" ? nature.randomGet() : undefined
						)
					);
				}
				cards.map(card => {
					card.storage.yuximrfzx = true;
				});
				game.log(player, "将", cards.length, "张牌置于在武将牌上");
				player.loseToSpecial(cards, "yuximrfzx");
				player.markSkill("yuximrfz");
			},
			group: ["yuximrfz_destroy"],
			subSkill: {
				destroy: {
					trigger: {
						player: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
					},
					direct: true,
					charlotte: true,
					filter: function (event, player) {
						var evt = event.getl(player);
						if (!evt || !evt.cards) return false;
						for (var i of evt.cards) {
							if (i.storage.yuximrfzx == true) return true;
						}
						return false;
					},
					content: function () {
						var cards = [];
						var evt = trigger.getl(player);
						if (evt && evt.cards) {
							for (var i of evt.cards) {
								if (i.storage.yuximrfzx == true) cards.push(i);
							}
						}
						game.cardsGotoSpecial(cards);
						game.log(cards, "被销毁了");
						if (Math.random() > 0.5) player.logSkill("yuximrfz");
					},
				},
			},
		},
		haolimrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			compare(card1, card2) {
				if (get.suit(card1) == get.suit(card2)) return true;
				if (get.number(card1) == get.number(card2)) return true;
				if (get.name(card1) == get.name(card2)) return true;
				return false;
			},
			direct: true,
			filter(event, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("yuximrfzx");
				});
				if (cards.length < 1) return false;
				if (!player.isPhaseUsing()) return false;
				if (event.card.storage.yuximrfzx == true) return false;
				if (get.type(event.card) == "equip" || get.type(event.card) == "delay") return false;
				for (var i of cards) {
					if (lib.skill.haolimrfz.compare(i, event.card)) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				const { cards } = await player
					.chooseCard("s")
					.set("filterCard", card => lib.skill.haolimrfz.compare(card, trigger.card))
					.set("prompt", `【好礼】:你可以弃置一张‘死魂灵’，视为使用一张${get.translation(get.name(trigger.card))}`)
					.set("ai", card => get.value(trigger.card) - get.value(card))
					.forResult();
				if (!cards) return;
				player.discard(cards);
				player.chooseUseTarget({ name: get.name(trigger.card), isCard: true }, true, false);
			},
		},
		shezumrfz: {
			audio: 2,
			trigger: { source: "damageEnd" },
			filter(event, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("yuximrfzx");
				});
				return (
					event.getParent().name != "shezumrfz" &&
					event.player.isIn() &&
					cards &&
					cards.length > 0 &&
					game.hasPlayer(current => {
						return current != player && current != event.player && get.distance(event.player, current) <= 3;
					})
				);
			},
			direct: true,
			async content(event, trigger, player) {
				const {
					result: { cards, targets },
				} = await player
					.chooseCardTarget({
						prompt: `【射祖】:你可以弃置一张‘死魂灵’并对一名距离${get.translation(trigger.player)}不大于3的角色（不能是你或${get.translation(trigger.player)}）造成一点火焰伤害`,
						filterCard(card) {
							return card.hasGaintag("yuximrfzx");
						},
						position: "s",
						filterTarget(card, player, target) {
							var damaged = _status.event.targetx;
							return target != player && target != damaged && get.distance(damaged, target) <= 3;
						},
						ai1: card => 8 - get.value(card),
						ai2: target => get.damageEffect(target, player, player, "fire") > 0,
					})
					.set("targetx", trigger.player);
				if (!cards || !targets) return;
				player.logSkill("shezumrfz", targets[0]);
				player.discard(cards);
				targets[0].damage(player, "fire");
			},
		},

		// 魔王 小特同学 特蕾西娅
		duanzhangmrfz: {
			intro: {
				mark: function (dialog, storage, player) {
					var players = player.storage.duanzhangmrfz.slice().filter(target => target != player);
					if (players && players.length > 0) {
						dialog.addAuto("这一次我不会离开了...");
						players = players.map(i => i.name);
						dialog.addSmall([players, "character"]);
					} else return "没有【断章】角色";
				},
			},
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			onremove: true,
			filter: function (event, player) {
				return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
			},
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget(true)
					.set("prompt", `【断章】:请选择【断章】目标`)
					.set("filterTarget", lib.filter.notMe)
					.set("ai", target => {
						var att = get.attitude(_status.event.player, target);
						if (att > 0) return att + 1;
						if (att == 0) return Math.random();
						return att;
					})
					.forResult();
				if (!targets) return;
				var target = targets[0];
				if (!player.storage.duanzhangmrfz) player.storage.duanzhangmrfz = [];
				if (!target.storage.duanzhangmrfz) target.storage.duanzhangmrfz = [];
				player.storage.duanzhangmrfz.addArray([target, player]);
				target.storage.duanzhangmrfz.addArray([target, player]);
				player.markSkill("duanzhangmrfz");
				player.line(target);
				for (var i of player.storage.duanzhangmrfz) {
					if (i != player) i.addSkill("canxiangmrfz_nodelay");
					i.addSkill("duanzhangmrfz_eff1");
				}
			},
			group: ["duanzhangmrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "dieAfter" },
					forceDie: true,
					filter(event, player) {
						return event.player.hasSkill("duanzhangmrfz_eff1");
					},
					content() {
						for (var i of game.players) {
							if (!i.storage.duanzhangmrfz) continue;
							if (i.storage.duanzhangmrfz.includes(trigger.player)) i.storage.duanzhangmrfz.remove(trigger.player);
						}
					},
				},
				eff1: {
					silent: true,
					charlotte: true,
					trigger: {
						global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "duanzhangmrfzAfter"],
					},
					filter(event, player) {
						return (player.storage.duanzhangmrfz && player.storage.duanzhangmrfz.length > 1) ^ player.hasSkill("duanzhangmrfz_group");
					},
					async content(event, trigger, player) {
						if (player.storage.duanzhangmrfz && player.storage.duanzhangmrfz.length > 1) {
							var cards = [],
								target = game.findPlayer(current => {
									return player.storage.duanzhangmrfz.includes(current);
								});
							for (var i of target.storage.duanzhangmrfz) {
								if (i.countCards("h") == 0) continue;
								if (i == player) continue;
								for (var j of i.getCards("h")) cards.push(j);
							}
							var cardsx = cards.map(card => {
								var cardx = ui.create.card();
								cardx.init(get.cardInfo(card));
								cardx._cardid = card.cardid;
								return cardx;
							});
							if (cardsx.length < 1) return;
							player.directgains(cardsx, null, "duanzhangmrfz");
							player.addSkill("duanzhangmrfz_group");
						} else player.removeSkill("duanzhangmrfz_group");
					},
				},
				group: {
					charlotte: true,
					group: ["duanzhangmrfz_eff_use", "duanzhangmrfz_eff_lose"],
					trigger: {
						global: ["addJudgeAfter", "gainAfter", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
					},
					forced: true,
					silent: true,
					filter: function (event, player) {
						if (event.name == "gain") return event.cards.length;
						var cards = event.getd();
						return cards.length;
					},
					onremove: function (player) {
						var cards2 = player.getCards("s", card => {
							return card.hasGaintag("duanzhangmrfz");
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
						var idList = player.getCards("s", card => card.hasGaintag("duanzhangmrfz")).map(i => i._cardid);
						var target = game.findPlayer(current => {
							return player.storage.duanzhangmrfz.includes(current);
						});
						for (var i of target.storage.duanzhangmrfz) {
							if (i.countCards("h") == 0) continue;
							if (i == player) continue;
							for (var j of i.getCards("h")) {
								if (idList.includes(j.cardid)) continue;
								cards.push(j);
							}
						}
						var cards2 = cards.map(card => {
							var cardx = ui.create.card();
							cardx.init(get.cardInfo(card));
							cardx._cardid = card.cardid;
							return cardx;
						});
						player.directgains(cards2, null, "duanzhangmrfz");
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
						var cards = player.getCards("s", card => card.hasGaintag("duanzhangmrfz") && card._cardid);
						return (
							event.cards &&
							event.cards.some(card => {
								return cards.includes(card);
							})
						);
					},
					content: function () {
						var idList = player.getCards("s", card => card.hasGaintag("duanzhangmrfz")).map(i => i._cardid);
						var cards = [];
						var target = game.findPlayer(current => {
							return player.storage.duanzhangmrfz.includes(current);
						});
						for (var i of target.storage.duanzhangmrfz) {
							if (i.countCards("h") == 0) continue;
							if (i == player) continue;
							for (var j of i.getCards("h")) {
								if (!idList.includes(j.cardid)) continue;
								cards.push(j);
							}
						}
						var cards2 = [];
						for (var card of trigger.cards) {
							var cardx = cards.find(cardx => cardx.cardid == card._cardid);
							if (cardx) cards2.push(cardx);
						}
						var cards3 = trigger.cards.slice();
						trigger.cards = cards2;
						trigger.card.cards = cards2;
						if (player.isOnline2()) {
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards3,
								player
							);
						}
						cards3.forEach(i => i.delete());
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
						var idList = player.getCards("s", card => card.hasGaintag("duanzhangmrfz")).map(i => i._cardid);
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
							return player.storage.duanzhangmrfz.includes(current);
						});
						for (var i of target.storage.duanzhangmrfz) {
							if (i.countCards("h") == 0) continue;
							if (i == player) continue;
							for (var j of i.getCards("h")) {
								idList.add(j.cardid);
							}
						}
						cards2 = player.getCards("s", card => {
							return card.hasGaintag("duanzhangmrfz") && !idList.includes(card._cardid);
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
				},
			},
		},
		chenaimrfz: {
			audio: 2,
			trigger: {
				player: ["useCardAfter", "respondAfter"],
			},
			direct: true,
			filter: function (event, player) {
				if (_status.currentPhase != player) return false;
				if (
					player.getHistory("custom", function (evt) {
						return evt.chenaimrfz_type == get.type2(event.card);
					}).length > 0
				)
					return false;
				return event.cards.filterInD().length > 0;
			},
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget(
						get.prompt("chenaimrfz"),
						"将" + get.translation(trigger.cards) + "交给一名其他角色",
						function (card, player, target) {
							return target != player;
						}
					)
					.set("ai", function (target) {
						if (target.hasJudge("lebu")) return 0;
						let att = get.attitude(_status.event.player, target),
							name = _status.event.cards[0].name;
						if (att < 3) return 0;
						if (_status.event.player.storage.duanzhangmrfz && _status.event.player.storage.duanzhangmrfz.includes(target) && att > 0)
							att += 10;
						if (target.hasSkillTag("nogain")) att /= 10;
						if (name === "sha" && target.hasSha()) att /= 5;
						if (name === "wuxie" && target.needsToDiscard(_status.event.cards)) att /= 5;
						return att / (1 + get.distance(player, target, "absolute"));
					})
					.set("cards", trigger.cards)
					.forResult();
				if (!targets) return;
				player.logSkill("chenaimrfz", targets[0]);
				targets[0].gain(trigger.cards.filterInD(), "gain2");
				player.getHistory("custom").push({ chenaimrfz_type: get.type2(trigger.card) });
				if (player.storage.duanzhangmrfz && player.storage.duanzhangmrfz.includes(targets[0])) targets[0].draw();
			},
		},
		/** @type { Skill } */
		canxiangmrfz: {
			mod: {
				targetEnabled: function (card, player, target) {
					if (get.type(card) == "delay") {
						return false;
					}
				},
			},
			audio: 2,
			forced: true,
			trigger: { global: "damageBegin4" },
			filter(event, player) {
				var storage = player.storage.duanzhangmrfz;
				if (event.player != player && (!storage || !storage.includes(event.player))) return false;
				return event.hasNature();
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			group: "canxiangmrfz_die",
			subSkill: {
				die: {
					silent: true,
					charlotte: true,
					trigger: { player: "dieAfter" },
					firstDo: true,
					forceDie: true,
					content() {
						var storage = player.storage.duanzhangmrfz;
						for (var i of storage) {
							if (!i.storage.duanzhangmrfz) continue;
							if (i.storage.duanzhangmrfz.length <= 2) i.removeSkill("canxiangmrfz_nodelay");
							else i.storage.duanzhangmrfz.remove(player);
						}
					},
				},
				nodelay: {
					mark: true,
					intro: {
						content: "属性伤害无效；无法成为延时锦囊牌的目标",
					},
					mod: {
						targetEnabled: function (card, player, target) {
							if (get.type(card) == "delay") {
								return false;
							}
						},
					},
					ai: {
						nofire: true,
						nothunder: true,
						effect: {
							target(card, player, target, current) {
								if (get.tag(card, "natureDamage")) {
									return "zeroplayertarget";
								}
								if (get.type(card) == "trick" && get.tag(card, "damage")) {
									return "zeroplayertarget";
								}
							},
						},
					},
				},
			},
			ai: {
				nofire: true,
				nothunder: true,
				effect: {
					target(card, player, target, current) {
						if (get.tag(card, "natureDamage")) {
							return "zeroplayertarget";
						}
						if (get.type(card) == "trick" && get.tag(card, "damage")) {
							return "zeroplayertarget";
						}
					},
				},
			},
		},

		// 新多萝西
		newgongzhenmrfz: {
			mod: {
				aiOrder: function (player, card, num) {
					if (typeof card == "object" && player.isPhaseUsing()) {
						var history = player.getAllHistory("useCard");
						if (history.length < 1) return num;
						var cardx = history[history.length - 1].card;
						if (cardx && get.type2(cardx) == get.type2(card)) {
							return num + 10;
						}
					}
				},
			},
			audio: "gongzhenmrfz",
			trigger: { player: ["useCardEnd", "respondEnd"] },
			forced: true,
			filter(event, player) {
				return player.getAllHistory(event.name).length > 1;
			},
			async content(event, trigger, player) {
				var history = player.getAllHistory(trigger.name);
				var cardx = history[history.length - 2].card;
				if (!cardx) return;
				if (get.type2(cardx) == get.type2(trigger.card)) {
					var cards = get.cards(2);
					game.cardsGotoOrdering(cards);
					const { links } = await player
						.chooseCardButton(`【共振】:请选择获得一张牌`, true, cards)
						.set("ai", button => {
							return get.value(button);
						})
						.forResult();
					if (!links) return;
					player.gain(links, "gain2");
				} else
					player.chooseToDiscard(true, `【共振】:请弃置区域内的一张牌`, "hej").set("ai", card => {
						if (get.position(card) == "j") return 10;
						return -get.value(card);
					});
			},
		},
		newmengxiangmrfz: {
			getLastDiscard(event, player) {
				var history = player.getAllHistory("lose", evt => evt.type && evt.type == "discard");
				if (history.length < 1) return false;
				var cards = history[history.length - 1].cards;
				if (!cards) return false;
				return cards[cards.length - 1];
			},
			mod: {
				cardUsable: function (card, player) {
					var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player);
					if (cardx && get.type2(cardx) == get.type2(card)) return Infinity;
				},
				targetInRange: function (card, player) {
					var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player);
					if (cardx && get.type2(cardx) == get.type2(card)) return true;
				},
			},
			audio: "mengxiangmrfz",
			forced: true,
			trigger: { player: "useCardBefore" },
			filter(event, player) {
				var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player);
				if (!cardx) return false;
				return !event.audioed && get.type2(cardx) == get.type2(event.card);
			},
			content() {
				trigger.audioed = true;
			},
		},

		// 新黑键
		newhuangxiangmrfz: {
			audio: "huangxiangmrfz",
			trigger: {
				player: "phaseDrawAfter",
			},
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			async cost(event, trigger, player) {
				const { result } = await player.chooseCard([1, 2], "【荒响】:你可以选择两张手牌将其标记为‘残影’").set("ai", card => {
					var num = get.value(card);
					if (get.name(card) == "shan" || get.name(card) == "wuxie") num += 10;
					if (get.type2(card) == "equip") num -= 2;
					return num;
				});
				event.result = result;
			},
			async content(event, trigger, player) {
				var cards = event.cards;
				await player.removeGaintag("newhuangxiangmrfzx");
				for (var i of cards) i.addGaintag("newhuangxiangmrfzx");
			},
			group: "newhuangxiangmrfz_lose",
			subSkill: {
				lose: {
					audio: "huangxiangmrfz",
					trigger: {
						player: "loseAfter",
						global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
					},
					filter(event, player) {
						if (_status.currentPhase == player) return false;
						var evt = event.getl(player);
						if (!evt || !evt.hs || !evt.hs.length) return false;
						if (event.name == "lose") {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("newhuangxiangmrfzx")) return true;
							}
							return false;
						}
						return player.hasHistory("lose", function (evt) {
							if (event != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("newhuangxiangmrfzx")) return true;
							}
							return false;
						});
					},
					async cost(event, trigger, player) {
						var list = ["选项一", "选项二", "cancel2"],
							choicelist = ["令一名你攻击范围内的角色选择弃置一张黑桃牌或受到一点伤害", "你摸一张牌且将此牌标记为‘残影’"];
						if (!game.hasPlayer(current => current != player && player.inRange(current))) {
							list.remove("选项一");
							choicelist[0] = '<span style="opacity:0.5; ">' + choicelist[0] + "(没有满足条件的角色)</span>";
						}
						const { control } = await player
							.chooseControl(list)
							.set("choiceList", choicelist)
							.set("prompt", "【荒响】:你可以选择一项")
							.set("ai", () => {
								var player = _status.event.player;
								if (!game.hasPlayer(current => current != player && player.inRange(current) && get.attitude(player, current) < 0))
									return 1;
								return [0, 1];
							})
							.forResult();
						var result = {};
						result.bool = true;
						result.cost_data = control;
						if (control == "cancel2") result.bool = false;
						event.result = result;
					},
					async content(event, trigger, player) {
						var control = event.cost_data;
						if (control == "选项一") {
							const { targets } = await player
								.chooseTarget()
								.set("forced", true)
								.set("prompt", "【荒响】:请选择一名攻击范围内的角色")
								.set("filterTarget", (card, player, target) => {
									return player != target && player.inRange(target);
								})
								.forResult();
							const { bool } = await targets[0]
								.chooseToDiscard("【荒响】:请弃置一张黑桃牌，否则受到一点伤害", "he")
								.set("ai", card => {
									var player = _status.event.player;
									if (
										player.hp < 2 &&
										player.countCards("hes", card => {
											return get.name(card) == "tao" || get.name(card) == "jiu";
										})
									)
										return 12 - get.value(card);
									return 7 - get.value(card);
								})
								.set("filterCard", card => get.suit(card) == "spade")
								.forResult();
							if (bool) return;
							targets[0].damage();
						} else {
							const { result } = await player.draw();
							result[0].addGaintag("newhuangxiangmrfzx");
						}
					},
				},
			},
		},
		newjiyinmrfz: {
			audio: "jiyinmrfz",
			forced: true,
			trigger: {
				player: "useCard2",
			},
			getMeetCondition(event, player, target) {
				let num = 0;
				if (target.isMaxHandcard()) num++;
				if (target.isMaxHp()) num++;
				if (target.isMaxEquip()) num++;
				return num;
			},
			filter(event, player) {
				if (event.card.name != "sha") return false;
				for (var target of event.targets) {
					let num = lib.skill.newjiyinmrfz.getMeetCondition(event, player, target);
					if (typeof num === "number") return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				let targets = trigger.targets;
				for (var target of targets) {
					let num = lib.skill.newjiyinmrfz.getMeetCondition(event, player, target);
					if (typeof num !== "number") continue;
					player.line(target);
					// 加伤
					if (!target.storage.newjiyinmrfz_tmp) target.storage.newjiyinmrfz_tmp = [];
					target.storage.newjiyinmrfz_tmp.push(trigger.card);
					target
						.when({
							player: "damageBegin3",
							global: "useCardAfter",
						})
						.filter((event, player) => {
							if (event.name == "useCard" && player.storage.newjiyinmrfz_tmp.filter(card => card == event.card).length > 0) return true;
							if (!player.storage.newjiyinmrfz_tmp) return false;
							return (
								event.card &&
								event.card.name == "sha" &&
								player.storage.newjiyinmrfz_tmp.filter(card => card == event.card).length > 0
							);
						})
						.then(() => {
							if (trigger.name == "damage") {
								trigger.num += number;
							}
							player.storage.newjiyinmrfz_tmp.remove(trigger.card);
						})
						.vars({ number: num });
				}
			},
			group: "newjiyinmrfz_sha",
			subSkill: {
				sha: {
					trigger: {
						player: "useCardToPlayered",
					},
					silent: true,
					filter: function (event, player) {
						if (event.card.name != "sha" || event.getParent().directHit.includes(event.target)) return false;
						return lib.skill.newjiyinmrfz.getMeetCondition(event, player, event.target) > 0;
					},
					logTarget: "target",
					content: function () {
						var id = trigger.target.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired++;
						} else {
							map[id].shanRequired = 1 + lib.skill.newjiyinmrfz.getMeetCondition(event, player, trigger.target);
						}
					},
				},
			},
			ai: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					let num = lib.skill.newjiyinmrfz.getMeetCondition(_status.event, player, arg.target);
					if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > num) return false;
				},
			},
		},

		// 乌尔比安
		piweimrfz: {
			audio: 2,
			trigger: {
				player: "turnOverAfter",
			},
			filter(event, player) {
				return player.countCards("h") > 0 && player.hasUseTarget("chuqibuyi");
			},
			async cost(event, trigger, player) {
				const { result } = await player
					.chooseControl("club", "spade", "diamond", "heart", "cancel2")
					.set(
						"prompt",
						"你可以将一种颜色的所有手牌当做任意花色且伤害基数为2的【出其不意】使用，若此牌造成伤害，受到伤害的角色依次弃置装备区和手牌区的一张牌。"
					)
					.set("ai", () => {
						var player = get.event().player;
						if (
							!game.hasPlayer(current => {
								return current != player && player.canUse("chuqibuyi", current) && get.attitude(current, player) < 0;
							})
						)
							return "cancel2";
						return lib.suit.randomGet();
					});
				event.result = {};
				if (result.control === "cancel2") event.result.bool = false;
				else event.result.bool = true;
				event.result.cost_data = result;
			},
			async content(event, trigger, player) {
				let suit = event.cost_data.control;
				let color = new Set(player.getCards("h").map(i => get.color(i)));
				const { control } =
					color.size === 1
						? { control: player.getCards("h") }
						: await player
								.chooseControl("red", "black")
								.set("prompt", "请选择一种颜色")
								.set("ai", () => {
									var player = get.event().player,
										red = 0,
										black = 0;
									for (var i of player.getCards("h", {
										color: "red",
									})) {
										red += get.value(i);
									}
									for (var i of player.getCards("h", {
										color: "black",
									})) {
										black += get.value(i);
									}
									return red > black ? "black" : "red";
								})
								.forResult();
				player.chooseUseTarget(
					{
						name: "chuqibuyi",
						suit: suit,
						piweimrfz_chuqi: true,
					},
					typeof control === "string" ? player.getCards("h", { color: control }) : control
				);
			},
			group: ["piweimrfz_damage", "piweimrfz_discard"],
			subSkill: {
				discard: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { source: "damageEnd" },
					filter(event, player) {
						return event.player && event.player.isIn() && event.card && event.card.piweimrfz_chuqi == true;
					},
					async content(event, trigger, player) {
						let target = trigger.player;
						target
							.chooseToDiscard(true)
							.set("position", "he")
							.set("prompt", `【辟纬】:请选择弃置手牌区和装备区的各一张牌`)
							.set("ai", card => {
								var player = get.event().player;
								return 7 - get.value(card);
							})
							.set("filterCard", card => {
								var player = get.event().player,
									cards = ui.selected.cards;
								if (cards.length == 0) return true;
								for (var i of cards) {
									if (get.position(i) == get.position(card)) return false;
								}
								return true;
							})
							.set("selectCard", () => {
								var player = get.event().player,
									pos = [];
								for (var i of player.getCards("he")) {
									if (get.position(i) == "h") pos.add("h");
									else pos.add("e");
								}
								return [pos.length, pos.length];
							});
					},
				},
				damage: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "useCard" },
					filter(event, player) {
						return event.card && event.card.piweimrfz_chuqi == true;
					},
					content() {
						trigger.baseDamage = 2;
					},
				},
			},
			ai: {
				threaten: 1.2,
			},
		},
		guqianmrfz: {
			audio: 2,
			trigger: {
				global: ["loseAfter", "loseAsyncAfter"],
			},
			usable: 1,
			filter(event, player) {
				if (event.type != "discard" || event.position != ui.discardPile || event.player == player) return false;
				var cards = event.getd();
				if (!cards.filter(card => get.position(card, true) == "d").length) return false;
				return true;
			},
			prompt2(event, player) {
				return `你可以摸一张牌，然后若你手牌中没有相同花色的牌，你重置此技能，反之，你将武将牌翻面。`;
			},
			async content(event, trigger, player) {
				await player.draw();
				let suitCards = player.getCards("h").map(card => get.suit(card));
				let suitList = new Set(suitCards);
				if (suitCards.length != suitList.size) {
					player.turnOver();
					return;
				}
				delete player.getStat("skill")["guqianmrfz"];
				if (player.storage.counttrigger && player.storage.counttrigger["guqianmrfz"]) delete player.storage.counttrigger["guqianmrfz"];
				game.log(player, "重置了技能", `#g【孤潜】`);
			},
		},
		tongmaimrfz: {
			audio: 2,
			audioname: ["wuerbianmrfz", "spyoulingshamrfz", "sikadimrfz", "geleidiyamrfz", "anzhelamrfz"],
			init(player, skill) {
				player.storage[skill] = [];
			},
			trigger: { source: "damageEnd" },
			filter(event, player) {
				if (Array.isArray(player.storage.tongmaimrfz) && player.storage.tongmaimrfz.length > 1) return false;
				return (
					_status.currentPhase != player &&
					game.hasPlayer(current => {
						return current.hasClan("深海猎人");
					})
				);
			},
			async cost(event, trigger, player) {
				let prompt2 = `你可以令一名深海猎人的角色回复一点体力或复原武将牌`,
					storage = player.storage.tongmaimrfz;
				if (storage.includes(0)) prompt2 = prompt2.replace("回复一点体力或", "");
				if (storage.includes(1)) prompt2 = prompt2.replace("或复原武将牌", "");
				const { result } = await player
					.chooseTarget()
					.set("prompt", get.prompt("tongmaimrfz"))
					.set("prompt2", prompt2)
					.set("filterTarget", (card, player, target) => {
						var storage = _status.event.storage;
						if (!target.hasClan("深海猎人") && target != player) return false;
						if (storage.includes(1)) return target.getDamagedHp() > 0;
						return true;
					})
					.set("ai", target => {
						var player = get.event().player;
						return get.attitude(target, player) > 0 && (target.getDamagedHp() > 0 || target.isTurnedOver() || target.isLinked());
					})
					.set("storage", storage);
				event.result = result;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				if (!Array.isArray(player.storage.tongmaimrfz)) player.storage.tongmaimrfz = [];
				if (player.storage.tongmaimrfz.includes(0)) {
					target.link(false);
					target.turnOver(false);
					player.storage.tongmaimrfz.add(1);
					return;
				}
				if (player.storage.tongmaimrfz.includes(1)) {
					target.recover();
					player.storage.tongmaimrfz.add(0);
					return;
				}
				if (target.getDamagedHp() == 0) {
					target.link(false);
					target.turnOver(false);
					player.storage.tongmaimrfz.add(1);
					return;
				}
				const { index } = await player
					.chooseControl()
					.set("choiceList", [`令${get.translation(target)}回复一点体力`, `令${get.translation(target)}复原武将牌`])
					.set("prompt", "请选择一项")
					.set("ai", () => {
						var target = _status.event.targetx,
							player = get.event().player;
						if (target.isTurnedOver()) return 1;
						return 0;
					})
					.set("targetx", target)
					.forResult();
				if (index === 0) target.recover();
				if (index === 1) {
					target.link(false);
					target.turnOver(false);
				}
				player.storage.tongmaimrfz.add(index);
			},
			group: "tongmaimrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					lastDo: true,
					trigger: { global: "roundStart" },
					content() {
						player.storage.tongmaimrfz = [];
					},
				},
			},
		},

		// 新 斯卡蒂
		jingliemrfz: {
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter(event, player) {
				return game.hasPlayer(current => {
					return current != player && current.countCards("h") > 0;
				});
			},
			async cost(event, trigger, player) {
				const { result } = await player
					.chooseTarget()
					.set("prompt", get.prompt("shulangmrfz"))
					.set(
						"prompt2",
						`你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
					)
					.set("filterTarget", (card, player, target) => player != target && target.countCards("h") > 0)
					.set("ai", target => {
						var player = get.event().player;
						var att = get.attitude(player, target),
							num = 0;
						if (att >= 0) num += 2;
						else num += 5 + target.getDamagedHp();
						return (num += target.countCards("h") / 2);
					});
				event.result = result;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				if (target.countCards("h") == 1) player.viewHandcards(target);
				const { links } = await player
					.choosePlayerCard(target, true, "visible")
					.set("prompt", "【鲸猎】:请选择一张牌")
					.set("position", "h")
					.set("ai", button => {
						var player = get.event().player,
							num = get.value(button);
						if (player.hasUseTarget(button, false)) num += 10;
						if (get.tag(button, "damage")) num += 2;
						if (get.type2(button) == "equip") num -= 10;
						return num;
					})
					.forResult();
				if (!links) return;
				let choiceList = [
						`失去一点体力，令${get.translation(player)}获得${get.translation(links[0])}`,
						`令${get.translation(player)}视为使用${get.translation(links[0])}，若此牌不能被${get.translation(player)}使用，则改为摸一张牌，然后本回合结束阶段时${get.translation(player)}发动一次【鲸猎】`,
						`对${get.translation(player)}使用一张【杀】，若此杀造成伤害，${get.translation(player)}翻面，反之执行其他两项`,
					],
					list = ["选项一", "选项二"];
				if (target.hasSha() && target.canUse({ name: "sha" }, player, false)) list.push("选项三");
				else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（没有或无法使用【杀】）" + "</span>";
				const { index } = await target
					.chooseControl(list)
					.set("choiceList", choiceList)
					.set("ai", () => {
						var player = get.event().player,
							target = _status.event.targetx,
							list = _status.event.list,
							card = _status.event.cardx;
						if (get.attitude(player, target) > 0) return 1;
						else {
							if (!target.hasUseTarget(card, false)) return 1;
							if (
								list.length > 2 &&
								target.mayHaveShan(
									player,
									"use",
									target.getCards("h", i => {
										return i.hasGaintag("sha_notshan");
									})
								) &&
								Math.random() > 0.5
							) {
								for (var i of player.getCards("h", "sha")) {
									if (get.effect(target, i, player, player) > 0) return 2;
								}
							}
							if (player.hp == 1) return 1;
							return 0;
						}
					})
					.set("targetx", player)
					.set("list", list)
					.set("cardx", links[0])
					.forResult();
				if (typeof index !== "number") return;
				var next = game.createEvent("jingliemrfz_after");
				next.player = player;
				next.target_jingliemrfz = target;
				next.card_jingliemrfz = links[0];
				next.setContent(lib.skill.jingliemrfz["index_" + index]);
			},
			async index_0(event, trigger, player) {
				let target = event.target_jingliemrfz,
					card = event.card_jingliemrfz;
				await player.gain(card, "gain2");
				target.loseHp();
			},
			async index_1(event, trigger, player) {
				let target = event.target_jingliemrfz,
					card = event.card_jingliemrfz;
				if (player.hasUseTarget(card, false))
					player.chooseUseTarget(
						{
							name: card.name,
							suit: card.suit,
							number: card.number,
						},
						false
					);
				else player.draw();
				player
					.when("phaseJieshuBegin")
					.then(() => {
						if (player.hasSkill("jingliemrfz_ban") || !game.hasPlayer(current => lib.skill.jingliemrfz.filter(event, player))) return;
						player.addTempSkill("jingliemrfz_ban", "phaseJieshuEnd");
						player
							.chooseTarget()
							.set("prompt", get.prompt("jingliemrfz"))
							.set(
								"prompt2",
								`你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
							)
							.set("filterTarget", (card, player, target) => player != target && target.countCards("h") > 0)
							.set("ai", target => {
								var player = get.event().player;
								var att = get.attitude(player, target),
									num = 0;
								if (att >= 0) num += 2;
								else num += 5 + target.getDamagedHp();
								return (num += target.countCards("h") / 2);
							});
					})
					.then(() => {
						if (result.bool) {
							var target = result.targets[0];
							player.logSkill("jingliemrfz", target);
							var next = game.createEvent("jingliemrfz_phaseJieshu");
							next.player = player;
							next.targets = result.targets;
							next.setContent(lib.skill.jingliemrfz.content);
						}
					});
			},
			async index_2(event, trigger, player) {
				let target = event.target_jingliemrfz,
					card = event.card_jingliemrfz;
				await target
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return true;
						},
						"【鲸猎】:对" + get.translation(player) + "使用一张杀"
					)
					.set("forced", true)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return player.canUse({ name: "sha" }, target, false);
					})
					.set("sourcex", player);
				if (
					target.hasHistory("useCard", evt => {
						return evt.getParent(2) == event && target.hasHistory("sourceDamage", evtx => evt.card == evtx.card);
					})
				)
					player.turnOver();
				else {
					for (var i = 0; i < 2; i++) {
						var next = game.createEvent("jingliemrfz_noDamage");
						next.player = player;
						next.target_jingliemrfz = target;
						next.card_jingliemrfz = card;
						next.setContent(lib.skill.jingliemrfz["index_" + i]);
					}
				}
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		shulangmrfz: {
			audio: "zhangenmrfz",
			trigger: {
				target: "useCardToTargeted",
			},
			filter(event, player) {
				return event.card && event.card.name == "sha" && player.hasSha() && lib.filter.targetEnabled({ name: "sha" }, player, event.player);
			},
			check(event, player) {
				for (var i of player.getCards("hes", "sha")) {
					if (get.effect(event.player, i, player, player) > 0 && get.attitude(player, event.player) < 0) {
						return true;
					} //QQQ
				}
				return false;
			},
			prompt2(event, player) {
				return "你可以对" + get.translation(event.player) + "使用一张杀";
			},
			async content(event, trigger, player) {
				const { result } = await player
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return true;
					}, "请使用一张【杀】")
					.set("forced", true)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("shulangmrfz_card", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return player.canUse({ name: "sha" }, target, false);
					})
					.set("sourcex", trigger.player);
				if (
					player.hasHistory("useCard", evt => {
						return (
							evt &&
							evt.card &&
							evt.name == "useCard" &&
							player.hasHistory("sourceDamage", evtx => {
								return evt.card == evtx.card;
							})
						);
					})
				) {
					trigger.getParent().excluded.addArray(trigger.targets);
					if (trigger.player.countGainableCards(player, "he"))
						player
							.gainPlayerCard("he", trigger.player, true)
							.set("target", trigger.player)
							.set("complexSelect", false)
							.set("ai", lib.card.shunshou.ai.button);
				}
			},
			group: "shulangmrfz_need",
			subSkill: {
				need: {
					trigger: { player: "useCardToPlayered" },
					filter(event, player) {
						return event.getParent(3).name == "shulangmrfz" && event.card && event.card.name == "sha";
					},
					silent: true,
					async content(event, trigger, player) {
						const id = trigger.target.playerid;
						const map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired++;
						} else {
							map[id].shanRequired = 2;
						}
					},
				},
			},
		},

		// 新 歌蕾蒂娅
		quliemrfz: {
			intro: {
				markcount: "expansion",
				mark: function (dialog, storage, player) {
					var cards = player.getExpansions("quliemrfz");
					if (player.isUnderControl(true)) dialog.addAuto(cards);
					else return "共有" + get.cnNumber(cards.length) + "张牌";
				},
			},
			onremove(player) {
				game.countPlayer(current => {
					var cards = current.getExpansions("quliemrfz");
					if (cards) current.loseToDiscardpile(cards);
				});
			},
			audio: "ronghangmrfz",
			trigger: { player: "useCard" },
			filter(event, player) {
				return (
					get.tag(event.card, "damage") &&
					game.hasPlayer(current => {
						return current != player && !current.hasMark("quliemrfz_eff");
					})
				);
			},
			check(event, player) {
				return game.hasPlayer(current => {
					return current != player && !current.hasMark("quliemrfz_eff") && get.attitude(player, current) < 0;
				});
			},
			prompt2: "当你使用带有伤害类标签的牌时，你可以令其他角色若在此牌结算完成前使用或打出牌后，其须将一半（向上取整）的牌置于武将牌上",
			async content(event, trigger, player) {
				game.countPlayer(current => {
					if (current == player) return;
					current.addMark("quliemrfz_eff", 1, false);
				});
				if (!player.storage.newxunxiangmrfz) player.storage.newxunxiangmrfz = [];
				player.storage.newxunxiangmrfz.add(trigger.card);
				player
					.when("useCardAfter")
					.filter((event, player) => {
						return player.storage.newxunxiangmrfz.includes(event.card);
					})
					.then(() => {
						game.countPlayer(current => {
							current.removeMark("quliemrfz_eff", 1, false);
						});
						player.storage.newxunxiangmrfz.remove(trigger.card);
					})
					.assign({ lastDo: true });
			},
			group: ["quliemrfz_eff", "quliemrfz_die"],
			subSkill: {
				die: {
					charlotte: true,
					silent: true,
					trigger: { global: "dieAfter" },
					forceDie: true,
					filter(event, player) {
						return event.player.getExpansions("quliemrfz").length;
					},
					content() {
						trigger.player.loseToDiscardpile(trigger.player.getExpansions("quliemrfz"));
					},
				},
				eff: {
					charlotte: true,
					silent: true,
					firstDo: true,
					trigger: {
						global: ["useCardAfter", "respondAfter", "phaseZhunbeiBegin"],
					},
					filter(event, player) {
						if (event.name == "phaseZhunbei") {
							return event.player.getExpansions("quliemrfz").length > 0;
						} else return event.player.countCards("h") > 0 && event.player != player && event.player.hasMark("quliemrfz_eff");
						return false;
					},
					async content(event, trigger, player) {
						if (trigger.name == "phaseZhunbei") {
							var current = trigger.player;
							var cards = current.getExpansions("quliemrfz");
							const { links } =
								new Set(cards.map(i => get.type2(i, current))).size == 1
									? { links: [] }
									: await current
											.chooseCardButton(cards)
											.set("prompt", `请选择至少两张不同类型的牌`)
											.set("selectButton", [2, Infinity])
											.set("filterButton", button => {
												var player = get.event().player,
													cards = ui.selected.buttons;
												return !cards.some(cardx => get.type2(cardx, player) == get.type2(button, player));
											})
											.set("ai", button => {
												return get.value(button.link, _status.event.player);
											})
											.forResult();
							if (links.length > 0) {
								current.gain(links, "draw");
								game.log(current, "收回了" + get.cnNumber(links.length) + "因【驱猎】而置于武将牌上的张牌");
							}
							if (cards.length != links.length) current.discard(cards.removeArray(links));
							current.unmarkSkill("quliemrfz");
						} else {
							let current = trigger.player;
							var num = Math.ceil(current.countCards("h") / 2);
							const { cards } = await current
								.chooseCard(true)
								.set("prompt", `请选择${get.cnNumber(num, false)}张牌`)
								.set("selectCard", num)
								.set("ai", card => {
									var player = get.event().player;
									return 6 - get.value(card);
								})
								.forResult();
							current.addToExpansion(cards, "giveAuto", current).gaintag.add("quliemrfz");
							current.markSkill("quliemrfz");
						}
					},
				},
			},
		},
		newxunxiangmrfz: {
			audio: "xunxiangmrfz",
			trigger: {
				global: "phaseJieshuBegin",
			},
			filter(event, player) {
				var cards = lib.skill.zheqimrfz_eff2.getDiscard(event);
				return cards.length > 0 && player.canCompare(event.player);
			},
			prompt2(event, player) {
				return `你可以与${get.translation(event.player)}进行拼点，若你赢，你获得其本回合因弃置而进入弃牌堆的不同类型的牌各一张，并将拼点牌当雷【杀】对其使用`;
			},
			check(event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				const { result } = await player.chooseToCompare(trigger.player);
				if (result.bool) {
					var discards = lib.skill.zheqimrfz_eff2.getDiscard(trigger);
					const { links } =
						new Set(discards.map(i => get.type(i))).size <= 1
							? { links: discards }
							: await player
									.chooseCardButton(discards)
									.set("prompt", `请选择不同类型的牌`)
									.set("selectButton", [0, Infinity])
									.set("filterButton", button => {
										var player = get.event().player,
											cards = ui.selected.buttons;
										return !cards.some(cardx => get.type(cardx, player) == get.type(button, player));
									})
									.set("ai", button => {
										return get.value(button.link, _status.event.player);
									})
									.forResult();
					if (links) player.gain(links, "gain2");
					var cards = [result.player, result.target];
					cards = cards.filter(i => get.position(i) == "d");
					if (
						cards.length > 0 &&
						player.canUse(
							{
								name: "sha",
								cards: cards,
								nature: "thunder",
							},
							trigger.player,
							false
						)
					) {
						player.useCard({ name: "sha", nature: "thunder" }, cards, trigger.player);
					}
				}
			},
		},
		xueshuomrfz: {
			audio: 2,
			trigger: {
				source: "damageBegin3",
			},
			filter(event, player) {
				return player.countCards("h") >= event.player.countCards("h");
			},
			prompt2(event, player) {
				return `你可以令${get.translation(event.player)}额外受到1点伤害`;
			},
			check(event, player) {
				return get.attitude(player, event.player) < 0;
			},
			content() {
				trigger.num++;
			},
		},

		// 妮芙
		xunxinmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return game.hasPlayer(current => {
					return !current.hasCard(card => get.is.shownCard(card), "h") && current.countCards("h") > 0;
				});
			},
			filterTarget(card, player, target) {
				return !target.hasCard(card => get.is.shownCard(card), "h") && target.countCards("h") > 0;
			},
			prompt: "【巡心】:请选择一名没有明置牌的角色",
			async content(event, trigger, player) {
				const target = event.targets[0];
				const { cards } = await player
					.choosePlayerCard("h", target)
					.set("prompt", `请选择明置${get.translation(target)}一张手牌`)
					.set("visible", true)
					.set("filterButton", button => {
						return !get.is.shownCard(button);
					})
					.set("ai", button => {
						let target = get.event().target,
							player = get.player();
						let value = get.value(button);
						if (get.attitude(player, target) < 0) {
							let value = get.value(button);
							return target.hasUseTarget(button) ? value - 10 : value;
						}
						return value;
					})
					.set("target", target)
					.forResult();
				if (!cards) return;
				await target.addShownCards(cards, "visible_xunxinmrfz");

				let showncards = [];
				for (let char of game.players) {
					let shown = char.getCards("h", card => get.is.shownCard(card));
					if (shown) showncards.push(...shown);
				}
				let setShown = new Set(showncards.map(i => get.type2(i)));
				let hasTarget = game.hasPlayer(current => {
					return !current.hasCard(card => get.is.shownCard(card), "h") && current.countCards("h") > 0;
				});
				if (setShown.size === showncards.map(i => get.type2(i)).length && hasTarget) {
					const { targets } = await player
						.chooseTarget()
						.set("prompt", `【巡心】:请选择一名没有明置牌的角色`)
						.set("ai", target => {
							let player = get.player();
							return get.attitude(player, target) < 0;
						})
						.set("filterTarget", function (card, player, target) {
							return !target.hasCard(card => get.is.shownCard(card), "h") && target.countCards("h") > 0;
						})
						.forResult();
					if (!targets) return;
					player.logSkill("xunxinmrfz", targets[0]);
					var next = game.createEvent("xunxinmrfz_cycle");
					next.player = player;
					next.target = targets[0];
					next.targets = targets;
					next.setContent(lib.skill.xunxinmrfz.content);
				}
			},
		},
		chixinmrfz: {
			audio: 2,
			global: "chixinmrfz_eff",
			subSkill: {
				eff: {
					forced: true,
					silent: true,
					charlotte: true,
					mod: {
						aiOrder(player, card, num) {
							if (!player.hasCard(card => get.is.shownCard(card), "h")) return;
							if (!get.is.shownCard(card)) {
								let shown = player.getCards("h", card => get.is.shownCard(card));
								if (shown.length > 1) return num - 10;
								return num + get.value({ name: card.name }) - get.value(shown[0]);
							}
							if (get.name(card) == "sha" && player.getCardUsable("sha") < 2) return num + 10;
							if (get.name(card) == "tao" && player.getDamagedHp() == 1) return num + 10;
							if (get.name(card) == "jiu" && player.getCardUsable("jiu") < 2 && player.isPhaseUsing()) return num + 10;
							if (get.name(card) == "wuxie") return num + 10;
						},
						cardname(card, player, name) {
							let shown = player.getCards("h", card => get.is.shownCard(card));
							if (shown && shown.length == 1 && lib.card[shown[0].name].type != "equip") {
								return shown[0].name;
							} else if (shown && (shown.length > 1 || (shown.length == 1 && lib.card[shown[0].name].type == "equip"))) {
								return "wuxie";
							}
						},
					},
				},
			},
		},
		kuixinmrfz: {
			audio: 2,
			trigger: {
				source: "damageEnd",
			},
			filter(event, player) {
				return event.player != player && event.player.isIn() && event.player.countCards("h") > 0;
			},
			prompt2(event, player) {
				let tran = get.translation(event.player);
				return `是否令${tran}所有的[明置/暗置]牌[暗置/明置]，然后${tran}弃置两张暗置的牌？`;
			},
			check(event, player) {
				return get.attitude(event.player, player) < 0;
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				for (let card of target.getCards("h")) {
					if (get.is.shownCard(card)) target.hideShownCards(card);
					else target.addShownCards(card, "visible_xunxinmrfz");
				}
				let { promise, resolve } = Promise.withResolvers();
				setTimeout(() => {
					resolve();
				}, 10);
				await promise;
				if (target.countCards("h", card => !get.is.shownCard(card)) > 0) {
					target
						.chooseToDiscard(true, 2)
						.set("prompt", `【溃心】:请弃置两张暗置的牌`)
						.set("filterCard", card => !get.is.shownCard(card))
						.set("ai", card => get.value({ name: card.name }));
				}
			},
		},

		// 娜仁图亚
		/** @type { Skill } */
		eyanmrfz: {
			audio: 2,
			trigger: { player: "useCardEnd" },
			filter(event, player) {
				let card = event.card;
				return event.cards.someInD() && get.tag(card, "damage") && game.hasPlayer(current => player != current && current.inRangeOf(player));
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("eyanmrfz"))
					.set("prompt2", "你可以将此牌交给攻击范围内的一名其他角色")
					.set("filterTarget", (card, player, target) => player.inRange(target) && player != target)
					.set("ai", target => {
						const player = get.player();
						let subtraction = player.maxHp - target.maxHp;
						let num = get.attitude(player, target) > 0 ? 0 : -2;
						if (get.attitude(player, target) < 0 && subtraction - 1 >= target.countCards("h")) return 114514;
						return num - get.value(get.event().cardx) * 0.5 + Math.min(subtraction, target.countCards("h")) * 2;
					})
					.set("cardx", trigger.card)
					.forResult();
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				await player.give(trigger.cards.filterInD(), target);

				let num = player.maxHp - target.maxHp;
				if (num < 1) return;
				const { cards } =
					num >= target.countCards("h", card => !get.is.shownCard(card))
						? { cards: target.getCards("h", card => !get.is.shownCard(card)) }
						: await target
								.chooseCard()
								.set("prompt", `【恶魇】:请展示${num}张手牌`)
								.set("forced", true)
								.set("ai", card => -get.value(card))
								.set("filterCard", card => !get.is.shownCard(card))
								.set("selectCard", num)
								.forResult();
				if (!cards) return;
				target.addShownCards(cards, "visible_eyanmrfz");
			},
		},
		shafeimrfz: {
			audio: 2,
			trigger: { global: "phaseZhunbeiBegin" },
			filter(event, player) {
				return player != event.player && event.player.countCards("h", card => get.is.shownCard(card)) > 0;
			},
			prompt2(event, player) {
				const cards = event.player.getCards("h", card => get.is.shownCard(card));
				return `你可以获得${get.translation(event.player)}的${cards.length}张牌(${get.translation(cards)})`;
			},
			async content(event, trigger, player) {
				const cards = trigger.player.getCards("h", card => get.is.shownCard(card));
				player.gain(cards, "gain2");
			},
		},

		// 佩佩
		boqingmrfz: {
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
							moved[2].push(all.shift());
						}
						while (all) {
							if (get.value(all[0], player) <= 5) break;
							moved[1].push(all.shift());
						}
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
				game.addCardKnower(top, player);
				game.addCardKnower(bottom, player);
				player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
				game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
				game.updateRoundNumber();
			},
		},
		kuisuimrfz: {
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
						return player.getUseValue(card, null, true);
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
		lianwenmrfz: {
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
	},
};
