import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("ailinimrfz", {
			sex: "female",
			group: "yimrfz",
			hp: 3,
			skills: ["zhidengmrfz","shenpanmrfz","liechaomrfz"],
		});

skill({
	"zhidengmrfz": {
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			audio: 2,
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget(get.prompt2("zhidengmrfz"), [0, player.hp], function (card, player, target) {
						return target.hp <= player.hp;
					})
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
			},
			async content(event, trigger, player) {
				const { targets } = event;
				game.asyncDraw(targets);

				//成就
				if (!player.storage._sjzxAch_denghuoweimingmrfz) player.storage._sjzxAch_denghuoweimingmrfz = 0;
				if (targets.length >= 2) player.storage._sjzxAch_denghuoweimingmrfz++;
			},
		},
	"shenpanmrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return player.canCompare(target);
			},
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				const result = await player.chooseToCompare(target).forResult();
				if (result.bool) {
					target.addTempSkill("shenpanmrfz2");
					player.addTempSkill("shenpanmrfz3");
					player.storage.shenpanmrfz3 = target;
				}
			},
			ai: {
				order: 10,
				result: {
					player: function (player) {
						if (player.countCards("h", "sha") > 0) return 0.6;
						var num = player.countCards("h");
						if (num > player.hp) return 0;
						if (num == 1) return -2;
						if (num == 2) return -1;
						return -0.7;
					},
					target: function (player, target) {
						var num = target.countCards("h");
						if (num == 1) return -1;
						if (num == 2) return -0.7;
						return -0.5;
					},
				},
				threaten: 1.3,
			},
		},
	"shenpanmrfz2": {
			charlotte: true,
			mark: true,
			intro: {
				content: "伊比利亚审判庭裁决你为异端",
			},
		},
	"shenpanmrfz3": {
			mod: {
				globalFrom: function (from, to) {
					if (to == from.storage.shenpanmrfz3) {
						return -Infinity;
					}
				},
			},
			trigger: {
				player: "useCardToPlayered",
			},
			forced: true,
			charlotte: true,
			filter: function (event, player) {
				return event.target.hasSkill("shenpanmrfz2") && event.target.countCards("he") > 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				const result = await trigger.target.chooseToDiscard("he", true, 1).forResult();
				if (result.cards && result.cards.length > 0) player.gain(result.cards, "gain2");
			},
		},
	"liechaomrfz": {
			audio: 2,
			trigger: {
				source: "damageBegin3",
			},
			filter: function (event) {
				if (event.parent === undefined || event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
				if (event.card) {
					if (event.player.countCards("he") == 0) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
			ai: {
				effect: {
					player: function (card, player, target, current) {
						if (
							card.name == "sha" &&
							target.countCards("h") == 0 &&
							!target.hasSkillTag("filterDamage", null, {
								player: player,
								card: card,
							})
						)
							return [1, 0, 1, -3];
					},
				},
			},
		},
	"sujimrfz2": {
			charlotte: true,
			mark: true,
			intro: {
				content: "鸿雪记住了你的弱点",
			},
		},
	"cuofengmrfz": {
			group: ["cuofengmrfz_mark1", "cuofengmrfz_mark2"],
			audio: 2,
			preHidden: true,
			trigger: {
				player: "damageEnd",
			},
			filter: function (event, player) {
				var num = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
				if (num >= player.maxHp - 1) return false;
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				var list = ["摸牌阶段", "结束阶段"];
				const result = await player.chooseControl(list).forResult();
				if (result.control == "摸牌阶段") {
					player.addMark("cuofengmrfz_mark1", 1, false);
				} else {
					player.addMark("cuofengmrfz_mark2", 1, false);
				}
				player.chooseToDiscard("he", true, 1);
			},
			ai: {
				maixie: true,
				maixie_hp: true,
				effect: {
					target: function (card, player, target) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
						if (get.tag(card, "damage")) return [1, 0.55];
					},
				},
			},
		},
	"cuofengmrfz_mark1": {
			intro: {
				content: "摸牌阶段额外摸#张牌",
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter: function (event, player) {
				return player.countMark("cuofengmrfz_mark1") > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				var num = player.countMark("cuofengmrfz_mark1");
				trigger.num += num;
			},
		},
	"cuofengmrfz_mark2": {
			intro: {
				content: "结束阶段摸#张牌",
			},
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter: function (event, player) {
				return player.countMark("cuofengmrfz_mark2") > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				var num = player.countMark("cuofengmrfz_mark2");
				player.draw(num);
			},
		},
	"chengzhimrfz": {
			skillAnimation: true,
			animationColor: "wood",
			audio: 2,
			juexingji: true,
			unique: true,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter: function (event, player) {
				var num = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
				if (num != player.maxHp - 1) return false;
				return !player.storage.chengzhimrfz;
			},
			forced: true,
			async content(event, trigger, player) {
				player.loseMaxHp();
				player.addSkill("zhuzhimrfz");
				game.log(player, "获得了技能", "#g【逐志】");
				player.awakenSkill(event.name);
				player.storage[event.name] = true;
			},
		},
	"zhuzhimrfz": {
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			audio: 2,
			filter: function (event, player) {
				if (player.hp == 1 && player.countCards("he") <= 0) return false;
				return true;
			},
			async content(event, trigger, player) {
				if (player.hp > 1) {
					await player.damage("fire");
				} else {
					await player.chooseToDiscard("he", true, 1);
				}
				var num1 = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
				var num2 = Math.floor(num1 / 2);
				player.addTempSkill("zhuzhimrfz_mark", {
					player: "phaseAfter",
				});
				player.draw(num2);
			},
			ai: {
				basic: {
					order: 1,
				},
				result: {
					player: function (player) {
						if (player.hp < 2) return -1;
						return 1;
					},
				},
			},
		},
	"zhuzhimrfz_mark": {
			mark: true,
			intro: {
				content: "黑暗追着她，她追着光。",
			},
			init: function (player, skill) {
				if (!player.storage[skill]) player.storage[skill] = 0;
			},
			onremove: true,
			mod: {
				maxHandcard: function (player, num) {
					var n = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
					return num + n;
				},
				cardUsable: function (card, player, num) {
					var n = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
					if (card.name == "sha") return num - 1 + n;
				},
			},
		},
	"moucunmrfz": {
			trigger: {
				global: "roundStart",
			},
			intro: {
				content: "【鹰视】中的X为#。",
			},
			audio: 2,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				player.removeMark("moucunmrfz2", player.countMark("moucunmrfz2"));
				const result = await player
					.chooseCardTarget({
						prompt: "请交给一名其他角色一至两张牌",
						filterCard: true,
						filterTarget: function (card, player, target) {
							var group = game.me.group;
							return player != target && target.group !== group;
						},
						ai1: function (card) {
							return 10 - get.value(card);
						},
						ai2: function (target) {
							if (get.attitude(player, target) <= 0) return get.attitude(player, target);
							return get.attitude(player, target) > 0;
						},
						selectCard: [1, 2],
						position: "he",
					})
					.forResult();
				if (result.bool && result.targets) {
					result.targets[0].gain(result.cards, player, "giveAuto");
					result.targets[0].addSkill("moucunmrfz3");
				}
			},
			group: "moucunmrfz2",
		},
	"yingshimrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				//@ts-ignore
				return game.hasPlayer(current => lib.skill.yingshimrfz.filterTarget(null, player, current));
			},
			check: function (card) {
				return 6 - get.value(card);
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				var num = player.countMark("moucunmrfz");
				if (num < 1) {
					player.viewHandcards(target);
				} else {
					var max = target.countCards("h");
					if (max > num) return player.gainPlayerCard(num, target, "h", true, "visible");
					if (num >= max) return player.gainPlayerCard(max, target, "h", true, "visible");
				}
				game.log(player, "观看了", target, "的手牌");
			},
			ai: {
				order: 6,
				result: {
					player: 0.5,
					target: function (player, target) {
						if (target.hasSkillTag("noh")) return 0;
						return -1;
					},
				},
			},
		},
	"moucunmrfz2": {
			trigger: {
				global: "phaseUseEnd",
			},
			forced: true,
			filter: function (event, player) {
				if (!event.player.hasSkill("moucunmrfz3")) return false;
				return (
					event.player.getHistory("useCard", function (evt) {
						return evt.getParent("phaseUse") == event;
					}).length > 0
				);
			},
			async content(event, trigger, player) {
				var list = [];
				//@ts-ignore
				player.logSkill("moucunmrfz");
				//@ts-ignore
				trigger.player.getHistory("useCard", function (evt) {
					if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
				});
				player.draw(list.length);
				if (list.length > 2) {
					player.addMark("moucunmrfz", 1, false);
				} else {
					event.finish();
				}
			},
		},
	"moucunmrfz3": {
			charlotte: true,
			mark: true,
			intro: {
				content: "银灰前来求学",
			},
		},
	"siyongmrfz2": {
			onremove: true,
			intro: {
				content: "当前已使用花色：$",
			},
		},
	"yijianmrfz": {
			trigger: {
				player: "damageBegin",
			},
			audio: 2,
			forced: true,
			usable: 1,
			async content(event, trigger, player) {
				trigger.num--;
			},
		},
	"weiguangmrfz": {
			audio: "new_weiguangmrfz",
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			forced: true,
			global: ["weiguangmrfz_mark", "weiguangmrfz_losemark"],
			filter: function (event, player) {
				return !player.hasMark("weiguangmrfz_mark");
			},
			async content(event, trigger, player) {
				player.addMark("weiguangmrfz_mark", 1);
			},
			group: "weiguangmrfz2",
		},
	"weiguangmrfz_mark": {
			marktext: "火光",
			intro: {
				name: "火光",
				content: "流明希望人们能有余力擦去脸上的灰尘",
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("weiguangmrfz_mark");
				},
				maxHandcard: function (player, num) {
					return num + player.countMark("weiguangmrfz_mark");
				},
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			forced: true,
			filter: function (event, player) {
				return player.hasMark("weiguangmrfz_mark");
			},
			async content(event, trigger, player) {
				trigger.num += player.countMark("weiguangmrfz_mark");
			},
		},
	"weiguangmrfz_losemark": {
			trigger: {
				player: "phaseJieshuBegin",
			},
			forced: true,
			charlotte: true,
			filter: function (event, player) {
				return player.hasMark("weiguangmrfz_mark");
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.drawTo(Math.min(5, player.getHandcardLimit()));
				player.removeMark("weiguangmrfz_mark", 1);
				//@ts-ignore
				player.logSkill("new_weiguangmrfz");
			},
		},
	"weiguangmrfz2": {
			enable: "phaseUse",
			usable: 1,
			filterTarget: true,
			prompt: "选择一名角色令其获得一个“火光”标记并对自己造成一点伤害，若该角色是你，你流失一点体力",
			async content(event, trigger, player) {
				const { target } = event;
				if (target == player) {
					player.loseHp();
				}
				player.damage();
				target.addMark("weiguangmrfz_mark");
				//@ts-ignore
				player.logSkill("new_weiguangmrfz");
			},
			ai: {
				order: 9,
				result: {
					target: function (player, target) {
						if (target.countCards("h") > 2) return 5;
						if (player == target && player.getDamagedHp() == 0) return 5;
						return 2;
					},
				},
				threaten: 2,
			},
		},
	"zhidianmrfz": {
			audio: 2,
			trigger: {
				global: "roundStart",
			},
			direct: true,
			async content(event, trigger, player) {
				var list = lib.inpile;
				var list2 = [];
				let result;

				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (name == "shan" || name == "wuxie") continue;
					var type = get.type(name);
					if (name == "sha") {
						list2.push(["基本", "", "sha"]);
						list2.push(["基本", "", "sha", "fire"]);
						list2.push(["基本", "", "sha", "thunder"]);
					} else if (type == "basic") {
						list2.push(["基本", "", list[i]]);
					} else if (type == "trick") {
						list2.push(["锦囊", "", list[i]]);
					}
				}
				if (!list.length) return;
				else
					result = await player
						.chooseButton([get.prompt("zhidianmrfz"), [list, "vcard"]])
						.set("ai", function (button) {
							switch (button.link[2]) {
								case "wuxie":
									return 0.6 + Math.random();
								case "wuzhong":
								case "dongzhuxianji":
									return 0.5 + Math.random();
								case "guohe":
								case "zhujinqiyuan":
									return 0.4 + Math.random();
								case "sha":
									return 1 + Math.random();
								default:
									return Math.random();
							}
						})
						.forResult();
				if (result.bool === true && result.links) {
					var name = result.links[0][2];
					//@ts-ignore
					player.logSkill("zhidianmrfz");
					player.storage.zhidianmrfz = name;
					player.markSkill("zhidianmrfz");
					game.log(player, "声明了", "#g" + get.translation(name));
				}
			},
			intro: {
				content: "已声明【$】",
			},
			group: ["zhidianmrfz_use"],
		},
	"zhidianmrfz_use": {
			trigger: {
				global: "useCard1",
			},
			silent: true,
			forced: true,
			charlotte: true,
			popup: false,
			firstDo: true,
			filter: function (event, player) {
				return event.card.name == player.storage.zhidianmrfz;
			},
			async content(event, trigger, player) {
				var target = trigger.player;
				if (target == player) {
					player.chooseToDiscard("he", true, 1);
					//@ts-ignore
					player.logSkill("zhidianmrfz");
				} else {
					if (target.countCards("he") == 0) event._result = { index: 1 };
					else {
						var str = get.translation(player);
						const { index } = await target
							.chooseControl()
							.set("choiceList", ["交给" + str + "一张牌", "失去一点体力"])
							.forResult();

						if (target !== player) {
							//@ts-ignore
							player.logSkill("zhidianmrfz");
							if (index === 0) {
								const { cards } = await target.chooseCard("he", true);
								if (cards) target.give(cards, player, true);
							} else {
								target.loseHp();
							}
						}
					}
				}
			},
		},
	"pijimrfz": {
			audio: 2,
			trigger: {
				player: "damageEnd",
			},
			filter: function (event, player) {
				if (event.source == player) return false;
				return event.source != undefined;
			},
			forced: true,
			logTarget: "source",
			async content(event, trigger, player) {
				var num = player.maxHp - player.hp;
				if (num < 2) trigger.source.damage();
				if (num > 1) trigger.source.damage(2);
			},
			ai: {
				maixie_defend: true,
				effect: {
					target: function (card, player, target) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
						return 0.8;
						// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
					},
				},
			},
		},
	"dianyongmrfz": { audio: 2 },
	"fuxiemrfz": { audio: 2 },
	"qianximrfz": {
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			derivation: ["qianximrfz_ban"],
			forced: true,
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			async content(event, trigger, player) {
				var characterlist = [];
				for (var i = 0; i < game.players.length; i++) {
					var players = game.players[i];
					if (players == player) continue;
					characterlist.push(players.name);
				}
				if (!lib.config.isNoLimted_mrfz) {
					characterlist.remove("amiyamrfz");
					characterlist.remove("baocunzhemrfz");
				}
				var skills = [];
				//@ts-ignore
				for (var i of characterlist) {
					skills.addArray(lib.character[i][3]);
				}
				if (!characterlist.length || !skills.length) {
					event.finish();
					return;
				}
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}
				var switchToAuto = function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						skills: skills.randomGets(2),
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
				};
				var chooseButton = function (list, skills) {
					var event = _status.event;
					if (!event._result) event._result = {};
					event._result.skills = [];
					var rSkill = event._result.skills;
					var dialog = ui.create.dialog("请获得两个技能", [list, "character"], "hidden");
					event.dialog = dialog;
					var table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					for (var i = 0; i < skills.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						//@ts-ignore
						td.link = skills[i];
						table.appendChild(td);
						td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
							if (_status.dragged) return;
							//@ts-ignore
							if (_status.justdragged) return;
							//@ts-ignore
							_status.tempNoButton = true;
							setTimeout(function () {
								//@ts-ignore
								_status.tempNoButton = false;
							}, 500);
							//@ts-ignore
							var link = this.link;
							if (!this.classList.contains("bluebg")) {
								if (rSkill.length >= 2) return;
								rSkill.add(link);
								this.classList.add("bluebg");
							} else {
								this.classList.remove("bluebg");
								rSkill.remove(link);
							}
						});
					}
					dialog.content.appendChild(table);
					dialog.add("　　");
					dialog.open();

					event.switchToAuto = function () {
						event.dialog.close();
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					};
					event.control = ui.create.control("ok", function (link) {
						event.dialog.close();
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					});
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						event.dialog.buttons[i].classList.add("selectable");
					}
					game.pause();
					game.countChoose();
				};
				if (event.isMine()) {
					chooseButton(characterlist, skills);
				} else if (event.isOnline()) {
					event.player.send(chooseButton, characterlist, skills);
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}
				//@ts-ignore
				var map = event.result || result;
				if (map && map.skills && map.skills.length) {
					//@ts-ignore
					for (var i of map.skills) player.addSkillLog(i);
				}
				game.broadcastAll(function (list) {
					game.expandSkills(list);
					for (var i of list) {
						var info = lib.skill[i];
						if (!info) continue;
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2.old_yuanshu = "weidi";
					}
				}, map.skills);
			},
		},
	"geyaomrfz": {
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			async content(event, trigger, player) {
				const result = await player.draw("visible").forResult();
				if (!result.cards) return;
				var card = result.cards[0];
				if (get.type(card) == "equip") {
					player.addTempSkill("geyaomrfz_e");
				}
				if (get.type(card) == "trick" || get.type(card) == "delay") {
					player.addTempSkill("geyaomrfz_t");
				}
				if (get.type(card) == "basic") {
					player.addTempSkill("geyaomrfz_b");
				}
				game.log(player, "展示了一张", get.type(card), "牌");
			},
		},
	"geyaomrfz_e": {
			mod: {
				targetInRange: function (card, player, target, now) {
					if (card.name == "sha") return true;
				},
				selectTarget: function (card, player, range) {
					if (card.name == "sha" && range[1] != -1) range[1] = Infinity;
				},
			},
			charlotte: true,
		},
	"geyaomrfz_t": {
			trigger: {
				player: "useCard",
			},
			forced: true,
			charlotte: true,
			filter: function (event, player) {
				return event.card.name == "sha";
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
			ai: {
				directHit_ai: true,
			},
		},
	"geyaomrfz_b": {
			trigger: {
				player: "useCardToPlayered",
			},
			frequent: true,
			filter: function (event, player) {
				return event.card.name == "sha" && event.target.countCards("h") > 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			async content(event, trigger, player) {
				var color = get.color(trigger.card);
				player
					.gainPlayerCard(trigger.target, "h", "visible")
					.set("color", color)
					.set("filterButton", function (button) {
						var evt = _status.event;
						return get.color(button.link, evt.target) != evt.color;
					});
				//@ts-ignore
				player.logSkill("geyaomrfz", trigger.target);
			},
		},
	"zhangenmrfz": {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter: function (event, player) {
				if (player.countCards("h") == 0) return false;
				return event.card.name == "sha" && player.getHistory("sourceDamage").length > 0;
			},
			check: function (event, player) {
				return (
					player.getCardUsable("sha") == 0 &&
					player.countCards("h", function (card) {
						return card.name == "sha";
					}) > 0
				);
			},
			async content(event, trigger, player) {
				player.chooseToDiscard("h", 1, true);
				trigger.addCount = false;
				if (player.stat[player.stat.length - 1].card.sha > 0) {
					player.stat[player.stat.length - 1].card.sha--;
				}
			},
		},
	"xunlumrfz": {
			audio: 2,
			group: ["xunlumrfz_draw", "xunlumrfz_sha", "xunlumrfz_h"],
			intro: {
				content: function (storage, player, skill) {
					return (
						"数字：<span class=thundertext>" +
						player.storage.xunlumrfz_draw +
						"</span> <span class=firetext>" +
						player.storage.xunlumrfz_sha +
						"</span> <span class=greentext>" +
						player.storage.xunlumrfz_h +
						"</span></br>本回合杀的数量：" +
						player.storage.xunlumrfz_sha2 +
						"</br>本回合手牌上限：" +
						player.storage.xunlumrfz_h2 +
						(player.storage.xunlumrfz2 ? "</br>已修改【寻路】" : "")
					);
				},
			},
			mark: true,
			onremove: true,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				if (player.storage.xunlumrfz_draw + player.storage.xunlumrfz_sha + player.storage.xunlumrfz_h < 12) return true;
				return false;
			},
			async content(event, trigger, player) {
				var list = ["蓝色", "红色", "绿色"];
				const result = await player
					.chooseControl(list, "cancel2")
					.set("prompt", get.prompt("xunlumrfz"))
					.set(
						"prompt2",
						"令〖寻路〗中的一个数字+1</br>数字：<span class=thundertext>" +
							player.storage.xunlumrfz_draw +
							"</span> <span class=firetext>" +
							player.storage.xunlumrfz_sha +
							"</span> <span class=greentext>" +
							player.storage.xunlumrfz_h +
							"</span>"
					)
					.set("ai", function () {
						if (player.storage.xunlumrfz_draw < 4) return 0;
						if (player.storage.xunlumrfz_draw == 4 && player.storage.xunlumrfz_sha < 4) return 1;
						if (player.storage.xunlumrfz_h < 4) return 2;
						return 3;
					})
					.forResult();
				if (result.control != "cancel2") {
					if (result.control == "蓝色") {
						if (player.storage.xunlumrfz_draw < 4) {
							player.storage.xunlumrfz_draw++;
						}
					}
					if (result.control == "红色") {
						if (player.storage.xunlumrfz_sha < 4) {
							player.storage.xunlumrfz_sha++;
						}
					}
					if (result.control == "绿色") {
						if (player.storage.xunlumrfz_h < 4) {
							player.storage.xunlumrfz_h++;
						}
					}
					if (result.control == "修改【寻路】") {
						if (!player.storage.xunlumrfz2) {
							player.storage.xunlumrfz2 = true;
						}
					}
					player.markSkill("xunlumrfz");
				}
			},
		},
	"xunlumrfz_draw": {
			init: function (player) {
				player.storage.xunlumrfz_draw = 1;
				player.syncStorage("xunlumrfz_draw");
			},
			onremove: true,
			audio: 2,
			trigger: { player: "phaseDrawBegin2" },
			forced: true,
			async content(event, trigger, player) {
				//@ts-ignore
				var num = game.RDNbet(player.storage.xunlumrfz_draw, 6);
				trigger.num = Math.min(num, 6);
				//@ts-ignore
				player.logSkill("xunlumrfz");
				player.chat("可出" + player.storage.xunlumrfz_sha2 + "张杀</br>手牌上限为：" + player.storage.xunlumrfz_h2);
			},
		},
	"xunlumrfz_sha": {
			init: function (player) {
				player.storage.xunlumrfz_sha = 0;
				player.syncStorage("xunlumrfz_sha");
			},
			onremove: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			charlotte: true,
			firstDo: true,
			async content(event, trigger, player) {
				player.addTempSkill("xunlumrfz_sha2", {
					player: "phaseZhunbeiBegin",
				});
				//@ts-ignore
				player.storage.xunlumrfz_sha2 = game.RDNbet(player.storage.xunlumrfz_sha, 5);
				//@ts-ignore
				player.logSkill("xunlumrfz");
			},
		},
	"xunlumrfz_sha2": {
			init: function (player) {
				player.storage.xunlumrfz_sha2 = 0;
				player.syncStorage("xunlumrfz_sha2");
			},
			onremove: true,
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num = Math.min(player.storage.xunlumrfz_sha2, 5));
				},
			},
		},
	"xunlumrfz_h": {
			init: function (player) {
				player.storage.xunlumrfz_h = 3;
				player.syncStorage("xunlumrfz_h");
			},
			onremove: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			charlotte: true,
			async content(event, trigger, player) {
				player.addTempSkill("xunlumrfz_h2", {
					player: "phaseZhunbeiBegin",
				});
				//@ts-ignore
				player.storage.xunlumrfz_h2 = game.RDNbet(player.storage.xunlumrfz_h, 8);
			},
		},
	"xunlumrfz_h2": {
			init: function (player) {
				player.storage.xunlumrfz_h2 = 0;
				player.syncStorage("xunlumrfz_h2");
			},
			onremove: true,
			mod: {
				maxHandcard: function (player, num) {
					return (num = player.storage.xunlumrfz_h2);
				},
			},
		},
	"xunlumrfz2": {
			charlotte: true,
		},
	"zhuguangmrfz2": {
			audio: false,
			silent: true,
			trigger: { source: "damageBegin2" },
			filter: function (event, player, card) {
				return event.card.name == "juedou";
			},
			prompt: function (event, player) {
				if (!player.storage.zhuguangmrfz_change) return "是否防止此伤害并选择一项";
				return "是否发动【逐光】";
			},
			frequent: function (event, player) {
				if (!player.storage.zhuguangmrfz_change) return false;
				return true;
			},
			async content(event, trigger, player) {
				if (!player.storage.zhuguangmrfz_change) trigger.cancel();
				var list = [];
				if (!player.storage.kuanmrfz && player.hasSkill("kuanmrfz")) list.add("修改【苦暗】");
				if (!player.storage.zhuguangmrfz_change) list.add("修改【逐光】");
				if (!player.storage.zhuguangmrfz_change) list.add("摸一张牌");
				if (player.storage.zhuguangmrfz_change) list.add("摸两张牌");

				//判断是否只剩余一个选项
				if (list.length == 1) {
					player.draw(player.storage.zhuguangmrfz_change ? 2 : 1);
					//@ts-ignore
					player.logSkill("zhuguangmrfz");
					return;
				} else {
					list.add("cancel2");
					const result = await player
						.chooseControl(list)
						.set("prompt", get.prompt("zhuguangmrfz"))
						.set("prompt2", "选择一项")
						.set("ai", function () {
							if (!player.storage.zhuguangmrfz_change) return 1;
							if (!player.storage.kuanmrfz && player.hasSkill("kuanmrfz")) return 0;
							return [0, 1].randomGet();
						})
						.forResult();
					if (result.control != "cancel2") {
						//@ts-ignore
						player.logSkill("zhuguangmrfz");
						if (result.control == "修改【苦暗】") {
							player.storage.kuanmrfz = true;
						}
						if (result.control == "修改【逐光】") {
							player.storage.zhuguangmrfz_change = true;
						}
						if (result.control == "摸一张牌") {
							player.draw();
						}
						if (result.control == "摸两张牌") {
							player.draw(2);
						}
					}
				}
			},
		},
	"zhuguangmrfz3": {
			trigger: {
				player: "useCard",
			},
			forced: true,
			charlotte: true,
			silent: true,
			filter: function (event, player) {
				//@ts-ignore
				return event.card.name == "juedou" && event.card.zhuguangmrfz == true;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
			ai: {
				directHit_ai: true,
			},
		},
	"zhuangtimrfz": {
			intro: {
				content: "已造成#点伤害",
			},
			audio: 2,
			forced: true,
			direct: true,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				return player.maxHp < 15;
			},
			async content(event, trigger, player) {
				await player.addMark("zhuangtimrfz", trigger.num);
				var damage = player.countMark("zhuangtimrfz");
				if (damage > 1) {
					player.gainMaxHp(Math.floor(damage / 2));
					player.removeMark("zhuangtimrfz", Math.floor(damage / 2) * 2);
				}
			},
			group: ["zhuangtimrfz_use", "zhuangtimrfz_draw"],
			subSkill: {
				use: {
					audio: "zhuangtimrfz",
					usable: 1,
					enable: "phaseUse",
					filter: function (event, player) {
						for (var i of lib.inpile) {
							if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) return true;
							if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) return true;
						}
						return false;
					},
					chooseButton: {
						dialog: function (event, player) {
							var list = [];
							for (var i of lib.inpile) {
								if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) list.push(["锦囊", "", i]);
								if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) list.push(["基本", "", i]);
							}
							return ui.create.dialog("壮体", [list, "vcard"]);
						},
						check: function (button) {
							return _status.event.player.getUseValue({
								//@ts-ignore
								name: button.link[2],
								isCard: true,
							});
						},
						backup: function (links, player) {
							return {
								viewAs: {
									name: links[0][2],
									isCard: true,
								},
								filterCard: () => false,
								selectCard: -1,
								popname: true,
								async precontent(event, trigger, player) {
									//@ts-ignore
									player.logSkill("zhuangtimrfz");
									player.loseMaxHp();
								},
							};
						},
						prompt: function (links, player) {
							return "请选择" + get.translation(links[0][2]) + "的目标";
						},
					},
					ai: { order: 1, result: { player: 1 } },
				},
				draw: {
					audio: "zhuangtimrfz",
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return false;
					},
					check: function (event, player) {
						return player.hp < 3;
					},
					promt: function (event, player) {
						return "是否失去" + player.getDamagedHp() + "点体力上限，摸" + Math.ceil(player.getDamagedHp() / 2) + "张牌。";
					},
					async content(event, trigger, player) {
						var num = player.getDamagedHp();
						player.loseMaxHp(num);
						player.draw(Math.ceil(num / 2));
					},
				},
			},
		},
	"julimrfz": {
			audio: 2,
			trigger: { source: "damageBegin" },
			filter: function (event, player) {
				return player.getDamagedHp() >= event.player.hp;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				trigger.num++;
				var card = trigger.player.countCards("he");
				if (player.maxHp >= card) {
					const result = await player
						.chooseControl("确定", "cancel2")
						.set("prompt", "是否失去两点体力上限，令此伤害+1")
						.set("ai", function (event, player) {
							if (get.attitude(player, event.player) < 0 && player.maxHp >= 3) return 0;
							return 1;
						})
						.forResult();
					if (result.control !== "cancel2") {
						trigger.num++;
						player.loseMaxHp(2);
					}
				}
			},
		},
	"xunxiangmrfz": {
			audio: 2,
			usable: 2,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.hasSkill("xunxiangmrfz2")) return false;
				return game.hasPlayer(current => current.countCards("h") > 0);
			},
			filterTarget: function (card, player, target) {
				return target.countCards("h") > 0;
			},
			selectTarget: -1,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				const { targets } = event;
				var num = [3, 1, 2].randomGet();
				if (num == 1) player.storage.xunxiangmrfz = "basic";
				if (num == 2) player.storage.xunxiangmrfz = "trick";
				if (num == 3) player.storage.xunxiangmrfz = "equip";
				game.log("<span class=thundertext>【寻相】</span>随机的类型为<span class=firetext>", player.storage.xunxiangmrfz, "牌</span>");
				player.popup(get.translation(player.storage.xunxiangmrfz) + "牌");
				targets.sortBySeat();
				var next = player
					.chooseCardOL(targets, "请选择要展示的牌", true)
					.set("ai", function (card) {
						return -get.value(card);
					})
					.set("source", player);
				next.aiCard = function (target) {
					var hs = target.getCards("h");
					return { bool: true, cards: [hs.randomGet()] };
				};
				next._args.remove("glow_result");

				await next;

				var cards = [];
				var num = 0;
				const result = next.forResult();
				event.videoId = lib.status.videoId++;
				for (var i = 0; i < targets.length; i++) {
					cards.push(result[i].cards[0]);
				}
				event.cards = cards;
				game.log(player, "展示了", targets, "的", cards);
				game.broadcastAll(
					function (targets, cards, id, player) {
						var dialog = ui.create.dialog(
							get.translation(player) +
								"发动了【寻相】</br><span class=firetext>【寻相】随机声明的类型为" +
								get.translation(player.storage.xunxiangmrfz) +
								"牌</span>",
							cards
						);
						//@ts-ignore
						dialog.videoId = id;
						var getName = function (target) {
							if (target._tempTranslate) return target._tempTranslate;
							var name = target.name;
							if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
							return get.translation(name);
						};
						for (var i = 0; i < targets.length; i++) {
							//@ts-ignore
							dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]);
							if (get.type(result[i].cards[0]) == player.storage.xunxiangmrfz) num++;
							if (get.type(result[i].cards[0]) == "delay" && player.storage.xunxiangmrfz == "trick") num++;
						}
					},
					targets,
					cards,
					event.videoId,
					player
				);
				game.delay(4);
				if (num == 0) {
					const result = await player
						.chooseTarget("选择一名其他角色，你与其各流失一点体力", true, function (card, player, target) {
							return target != player;
						})
						.set("ai", target => get.attitude(player, target) < 2)
						.forResult();

					if (result.targets) {
						player.loseHp();
						var target = result.targets[0];
						target.loseHp();
					}
				} else {
					player.addTempSkill("xunxiangmrfz2", "phaseUseEnd");
					player.draw(num);
				}

				//@ts-ignore
				game.broadcastAll("closeDialog", event.videoId);
			},
			ai: {
				order: 12,
				result: {
					player: 5,
				},
			},
		},
	"xunxiangmrfz2": {
			//检测用技能，无实际意义。
		},
	"ronghangmrfz": {
			audio: 2,
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
				var evtcard = event.card;
				var evt = lib.skill.ronghangmrfz.getLastUsed(player, event);
				if (!evt.card || !evt) return false;
				return get.tag(evtcard, "damage") > 0;
			},
			async content(event, trigger, player) {
				var lastcard = lib.skill.ronghangmrfz.getLastUsed(player, trigger);
				//@ts-ignore
				if (get.cardNameLength(lastcard.card) < get.cardNameLength(trigger.card)) {
					trigger.baseDamage++;
					player.popup("伤害基数+1");
				} else {
					var name = get.name(trigger.card);
					if (name == "sha") {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.sha > 0) {
							player.stat[player.stat.length - 1].card.sha--;
						}
					} else if (name == "jiu") {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.jiu > 0) {
							player.stat[player.stat.length - 1].card.jiu--;
						}
					}
					//@ts-ignore
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
					player.popup("强中且无限制");
				}
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					var evtcard = lib.skill.ronghangmrfz.getLastUsed(player, event);
					return get.cardNameLength(evtcard) >= get.cardNameLength(arg.card);
				},
			},
		},
	"jingsimrfz": {
			onremove: true,
			intro: { content: "已使用的牌：$" },
			trigger: { player: "useCard" },
			audio: 2,
			frequent: true,
			filter: function (event, player) {
				return !player.getStorage("jingsimrfz").includes(event.card.name);
			},
			async content(event, trigger, player) {
				player.draw();
				player.markAuto("jingsimrfz", [trigger.card.name]);
			},
		},
	"banruomrfz": {
			audio: 4,
			onremove: true,
			init: function (player) {
				player.storage.banruomrfz = true;
				player.syncStorage("banruomrfz");
			},
			intro: {
				content: function (storage, player, skill) {
					if (player.storage.banruomrfz) return "星熊的巨盾将会保护她和她想保护的人";
					return "盾牌破损，但她并未后退";
				},
			},
			mark: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return player.storage.banruomrfz;
			},
			prompt: "是否取消此次伤害",
			async content(event, trigger, player) {
				trigger.cancel();
			},
			mod: {
				maxHandcardBase: function (player, num) {
					if (player.storage.banruomrfz) return player.maxHp;
				},
			},
			group: ["banruomrfz_lose", "banruomrfz_draw", "banruomrfz_round", "banruomrfz_atk"],
			subSkill: {
				lose: {
					forced: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return player.storage.banruomrfz;
					},
					firstDo: true,
					async content(event, trigger, player) {
						player.storage.banruomrfz = false;
					},
				},
				draw: {
					forced: true,
					popup: false,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.storage.banruomrfz;
					},
					async content(event, trigger, player) {
						trigger.num--;
					},
				},
				round: {
					forced: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return game.roundNumber > player.maxHp && player.storage.banruomrfz;
					},
					async content(event, trigger, player) {
						player.storage.banruomrfz = false;
						//@ts-ignore
						player.logSkill("banruomrfz");
					},
				},
				atk: {
					forced: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !player.storage.banruomrfz;
					},
					async content(event, trigger, player) {
						player.removeSkill("banruomrfz_atk");
						player.addSkill("banruomrfz2");
						//@ts-ignore
						player.logSkill("banruomrfz");
					},
				},
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (!player.storage.banruomrfz) return;
						if (get.tag(card, "damage")) return "zerotarget";
						if (get.type(card) == "trick" && get.tag(card, "damage")) {
							return "zeroplayertarget";
						}
					},
				},
			},
		},
	"banruomrfz2": {
			mark: true,
			onremove: true,
			intro: {
				content: "星熊放下了她的盾",
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num += 1);
				},
			},
			group: ["banruomrfz2_damage", "banruomrfz2_lose"],
			subSkill: {
				damage: {
					forced: true,
					usable: 1,
					trigger: { source: "damageBegin" },
					async content(event, trigger, player) {
						trigger.num++;
						//@ts-ignore
						player.logSkill("banruomrfz");
					},
				},
				lose: {
					forced: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("banruomrfz2");
					},
				},
			},
		},
	"yizhongmrfz": {
			audio: 2,
			trigger: { global: "damageBegin3" },
			filter: function (event, player) {
				return get.distance(player, event.player) <= 1 && event.player != player && player.countCards("he") > 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) > 0;
			},
			prompt: function (event, player) {
				return "是否弃置一张牌并为" + get.translation(event.player) + "承担伤害";
			},
			async content(event, trigger, player) {
				player.chooseToDiscard(true, "he");
				trigger.cancel();
				player.damage(trigger.num, trigger.source || "nosource", "nocard");
			},
			group: "yizhongmrfz2",
		},
	"yizhongmrfz2": {
			trigger: { player: "damageEnd" },
			firstDo: true,
			filter: function (event, player) {
				return event.parent && event.parent.name == "yizhongmrfz";
			},
			prompt: "是否摸两张牌",
			async content(event, trigger, player) {
				player.draw(2);
			},
		},
	"shacanmrfz2": {
			//检测用技能，无实际意义
		},
	"hechimrfz2": {
			onremove: true,
			mark: true,
			marktext: "斥",
			intro: {
				name: "呵斥",
				content: "受到了陈的*龙门粗口*，手牌上限-#",
			},
			trigger: { player: "phaseDiscardEnd" },
			forced: true,
			charlotte: true,
			silent: true,
			async content(event, trigger, player) {
				player.removeMark("hechimrfz2", player.countMark("hechimrfz2"));
				player.removeSkill("hechimrfz2");
				//@ts-ignore 彩蛋
				if (Math.random() < 0.1) player.logSkill("chencaidanmrfz");
			},
			mod: {
				maxHandcardBase: function (player, num) {
					return (num -= player.countMark("hechimrfz2"));
				},
			},
		},
	"chencaidanmrfz": {
			//彩蛋
			audio: 3,
		},
	"shihuangmrfz2": {
			direct: true,
			silent: true,
			charlotte: true,
			trigger: { global: "phaseEnd" },
			async content(event, trigger, player) {
				player.removeSkill("shihuangmrfz2");
			},
		},
	"nanjiaomrfz": {
			init: function (player) {
				player.storage.nanjiaomrfz = 0;
			},
			onremove: true,
			mark: true,
			intro: {
				content: function (event, player) {
					let target;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
						if (game.players[i].storage.nanjiaomrfz && game.players[i].storage.nanjiaomrfz != 0) {
							target = game.players[i];
							break;
						}
					}
					if (!target) return "这是一个占位符";
					return (
						"你的手牌上限" +
						(player.storage.nanjiaomrfz > 0 ? "+" : "") +
						Math.floor(player.storage.nanjiaomrfz / 2) +
						"</br>" +
						get.translation(target) +
						"的手牌上限" +
						(target.storage.nanjiaomrfz > 0 ? "+" : " ") +
						Math.floor(target.storage.nanjiaomrfz / 2)
					);
				},
			},
			audio: 2,
			trigger: { global: "roundStart" },
			forced: true,
			async content(event, trigger, player) {
				//@ts-ignore
				game.countPlayer(function (current) {
					if (current.storage.nanjiaomrfz) {
						current.storage.nanjiaomrfz = 0;
						if (current != player) current.removeSkill("nanjiaomrfz_eff");
					}
				});
				//@ts-ignore
				if (!player.isMaxHandCardLimit(true)) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
						//@ts-ignore
						if (game.players[i].isMaxHandCardLimit()) {
							player.storage.nanjiaomrfz = game.players[i].getHandcardLimit();
							game.players[i].storage.nanjiaomrfz = -(game.players[i].getHandcardLimit() - 1);
							game.players[i].addSkill("nanjiaomrfz_eff");
							break;
						}
					}
				} else {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
						//@ts-ignore
						if (game.players[i].isMinHandCardLimit()) {
							game.players[i].storage.nanjiaomrfz = player.getHandcardLimit();
							player.storage.nanjiaomrfz = -(player.getHandcardLimit() - 1);
							game.players[i].addSkill("nanjiaomrfz_eff");
							break;
						}
					}
				}
			},
			group: ["nanjiaomrfz_eff"],
			subSkill: {
				eff: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + Math.floor(player.storage.nanjiaomrfz / 2);
						},
					},
				},
			},
		},
	"shunanmrfza": {
			audio: 2,
		},
	"lvwaimrfz": {
			audio: 2,
			enable: "phaseUse",
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "律外",
			animationColor: "fire",
			init: function (player) {
				player.storage.lvwaimrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.lvwaimrfz;
			},
			async content(event, trigger, player) {
				player.awakenSkill(event.name);
				player.addSkill(["lvwaimrfz_damage", "lvwaimrfz_ban", "lvwaimrfz_clear", "lvwaimrfz_sha"]);
				("step 1");
				player.chooseUseTarget({ name: "sha", isCard: true }, true, "nodistance");
				player.storage.lvwaimrfz = true;
			},
			subSkill: {
				damage: {
					direct: true,
					forced: true,
					trigger: { source: "damageEnd" },
					async content(event, trigger, player) {
						player.draw(trigger.num);
						player.recover(trigger.num);
						player.removeSkill("lvwaimrfz_damage");
					},
				},
				ban: {
					direct: true,
					forced: true,
					silent: true,
					trigger: { global: "phaseBegin" },
					async content(event, trigger, player) {
						player.removeSkill("lvwaimrfz_ban");
					},
				},
				clear: {
					direct: true,
					silent: true,
					trigger: { player: "shaAfter" },
					async content(event, trigger, player) {
						player.removeSkill("lvwaimrfz_clear");
						if (player.hasSkill("lvwaimrfz_damage")) player.removeSkill("lvwaimrfz_damage");
					},
				},
				sha: {
					direct: true,
					silent: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter: function (event, card) {
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						//@ts-ignore
						trigger.directHit.addArray(game.players);
						player.removeSkill("lvwaimrfz_sha");
					},
				},
			},
		},
	"chaoshengmrfz": {
			intro: {
				content: function (event, player) {
					return player.countMark("chaoshengmrfz") + "/" + player.countMark("chaoshengmrfz2");
				},
			},
			mark: true,
			audio: 2,
			trigger: { player: "phaseEnd" },
			frequent: true,
			filter: function (event, player) {
				return player.countMark("chaoshengmrfz") >= player.countMark("chaoshengmrfz2");
			},
			async content(event, trigger, player) {
				player.removeMark("chaoshengmrfz", player.countMark("chaoshengmrfz"));
				if (player.countMark("jianshumrfz") < 15) {
					player.chooseDrawRecover(2, true, function (event, player) {
						if (player.hp == 1 && player.isDamaged()) return "recover_hp";
						return "draw_card";
					});
				} else {
					player.draw(2);
					player.recover();
				}
			},
			group: ["chaoshengmrfz_limite", "chaoshengmrfz_gain"],
			subSkill: {
				limite: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					async content(event, trigger, player) {
						player.addMark("chaoshengmrfz2", 3, false);
						player.removeSkill("chaoshengmrfz_limite");
					},
				},
				gain: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					firstDo: true,
					async content(event, trigger, player) {
						if (!player.getStat("damage")) player.addMark("chaoshengmrfz");
						else player.removeMark("chaoshengmrfz", player.countMark("chaoshengmrfz"));
					},
				},
			},
		},
	"jianshumrfz": {
			intro: {
				content: function (event, player) {
					var num = player.countMark("jianshumrfz");
					if (num == 15) return "【潮声】已修改</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
					if (num < 15 && num > 9) return "已累计指定" + num + "次</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
					if (num < 10 && num > 4) return "已累计指定" + num + "次</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
					return "已累计指定" + num + "次";
				},
			},
			audio: 3,
			direct: true,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				return player.countMark("jianshumrfz") < 15;
			},
			async content(event, trigger, player) {
				await player.addMark("jianshumrfz");
				var num = player.countMark("jianshumrfz");
				if (num % 5 == 0) {
					//@ts-ignore
					player.logSkill("jianshumrfz");
					if (num == 5 || num == 15) player.removeMark("chaoshengmrfz2");
					if (num == 10) player.addSkill("jianshumrfz_usesha");
					if (num == 5 || num === 10) player.addMark("jianshumrfz_time");
					if (num == 5) player.addMark("jianshumrfz_draw");
					if (num == 5 || num === 10) player.addMark("jianshumrfz_range");
				}
			},
			group: ["jianshumrfz_time", "jianshumrfz_range", "jianshumrfz_draw"],
			subSkill: {
				time: {
					charlotte: true,
					onremove: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("jianshumrfz_time");
						},
					},
				},
				range: {
					charlotte: true,
					onremove: true,
					mod: {
						attackRange: function (player, num) {
							return num + player.countMark("jianshumrfz_range");
						},
					},
				},
				draw: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.hasMark("jianshumrfz_draw");
					},
					async content(event, trigger, player) {
						trigger.num++;
						//@ts-ignore
						player.logSkill("jianshumrfz");
					},
				},
				usesha: {
					direct: true,
					trigger: { player: "phaseUseBegin" },
					async content(event, trigger, player) {
						const result = await player
							.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function (card, player, target) {
								return target != player && player.inRange(target);
							})
							.set("ai", target => -get.attitude(player, target))
							.forResult();

						if (result.targets) {
							var target = result.targets[0];
							player.useCard({ name: "sha" }, true, false, target);
							//@ts-ignore
							player.logSkill("jianshumrfz");
						}
					},
				},
			},
		},
	"qiulongmrfz": {
			intro: {
				name: "笼",
				content: "你获得了白恶魔的庇护",
			},
			audio: 2,
			direct: true,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget("你可以选择一名角色，令其获得‘笼’标记", function (card, player, target) {
						return target != player;
					})
					.set("ai", target => get.attitude(player, target))
					.forResult();

				if (result.targets) {
					result.targets[0].addMark("qiulongmrfz");
					//@ts-ignore
					player.logSkill("qiulongmrfz");
				}
			},
			group: ["qiulongmrfz_damage", "qiulongmrfz_huan"],
			subSkill: {
				remove: {
					direct: true,
					charlotte: true,
					firstDo: true,
					silent: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.hasMark("qiulongmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("qiulongmrfz");
					},
				},
				damage: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { global: "damageEnd" },
					filter: function (event, player) {
						return event.player.hasMark("qiulongmrfz");
					},
					async content(event, trigger, player) {
						var num = trigger.num;
						trigger.player.recover(num);
						player.damage(num, "nosource");
						player.addMark("qiulongmrfz_huan", num * 2);
						//@ts-ignore
						player.logSkill("qiulongmrfz");
					},
				},
				huan: {
					marktext: "幻影",
					intro: {
						name: "幻",
						content: "幻影",
					},
				},
			},
		},
	"bihumrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return event.nature;
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			group: "bihumrfz_damage",
			subSkill: {
				damage: {
					forced: true,
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.source != undefined;
					},
					async content(event, trigger, player) {
						player.addMark("qiulongmrfz_huan", trigger.num);
						//@ts-ignore
						player.logSkill("bihumrfz");
					},
				},
			},
			ai: {
				nofire: true,
				nothunder: true,
				effect: {
					target: function (card, player, target, current) {
						if (get.tag(card, "natureDamage")) return "zerotarget";
					},
				},
			},
		},
	"shengyumrfz": {
			audio: 2,
			enable: "phaseUse",
			forced: true,
			mark: true,
			init: function (player) {
				player.storage.shengyumrfz = false;
			},
			derivation: ["polongmrfz"],
			filter: function (event, player) {
				return !player.storage.shengyumrfz;
			},
			intro: {
				content: function (event, player) {
					if (!player.storage.shengyumrfz) return "圣域已准备就绪";
					return "圣域充能中:" + player.countMark("shengyumrfz_cd") + "/4";
				},
			},
			filterTarget: true,
			selectTarget: [1, 3],
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				const { targets } = event;
				for (var i of targets) i.addSkill("polongmrfz");
				player.storage.shengyumrfz = true;
				player.recover(2);
			},
			group: "shengyumrfz_cd",
			ai: {
				order: 10,
				threaten: 2,
				expose: 0.8,
				result: {
					player: 10,
					target: 10,
				},
			},
			subSkill: {
				cd: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.shengyumrfz == true;
					},
					async content(event, trigger, player) {
						await player.addMark("shengyumrfz_cd", 1);

						if (player.countMark("shengyumrfz_cd") >= 4) {
							player.storage.shengyumrfz = false;
							player.removeMark("shengyumrfz_cd", player.countMark("shengyumrfz_cd"));
						}
					},
				},
			},
		},
	"polongmrfz": {
			intro: {
				name: "破笼",
				content: function (event, player) {
					if (player.countMark("polongmrfz_round") >= 3)
						return "圣域持续时间:" + player.countMark("polongmrfz_round") + "/3</br><span class=firetext>最后一轮</span>";
					return "圣域持续时间:" + player.countMark("polongmrfz_round") + "/3";
				},
			},
			mark: true,
			audio: 2,
			enable: "phaseUse",
			usable: 5,
			filter: function (event, player) {
				if (player.getDamagedHp() == 0 && player.countMark("polongmrfz_mark1") >= 3) return false;
				return game.hasPlayer(function (current) {
					return current.countMark("qiulongmrfz_huan") > 0;
				});
			},
			async content(event, trigger, player) {
				var list = [];
				if (player.countMark("polongmrfz_mark1") < 3) list.add("摸牌");
				if (player.countMark("polongmrfz_mark2") < 2) list.add("回血");
				if (player.getDamagedHp() != 0) {
					const result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", get.prompt("polongmrfz"))
						.set("prompt2", "回复一点体力或摸一张牌")
						.set("ai", () => {
							let player = get.player();
							if (player.hp == 1 && player.isDamaged()) return "回血";
							return "摸牌";
						})
						.forResult();
					if (result.control != "cancel2") {
						game.countPlayer(current => {
							current.removeMark("qiulongmrfz_huan");
							return true;
						});
						//@ts-ignore
						player.logSkill("polongmrfz");
						if (result.control == "摸牌") {
							player.draw();
							player.addMark("polongmrfz_mark1", 1);
						}
						if (result.control == "回血") {
							player.recover();
							player.addMark("polongmrfz_mark2", 1);
						}
					}
				} else {
					player.draw();
					//@ts-ignore
					player.logSkill("polongmrfz");
					player.addMark("polongmrfz_mark1", 1);
					//@ts-ignore
					game.countPlayer(function (current) {
						current.removeMark("qiulongmrfz_huan");
					});
				}
			},
			group: ["polongmrfz_damage", "polongmrfz_remove", "polongmrfz_round"],
			subSkill: {
				damage: {
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.countMark("qiulongmrfz_huan") > 0;
						});
					},
					check: function (event, player) {
						return (
							game.hasPlayer(function (current) {
								return current.countMark("qiulongmrfz_huan") > 3;
							}) || player.hp <= 2
						);
					},
					async content(event, trigger, player) {
						trigger.num--;
						//@ts-ignore
						game.countPlayer(function (current) {
							current.removeMark("qiulongmrfz_huan");
						});
					},
				},
				remove: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.hasMark("polongmrfz_mark1") || player.hasMark("polongmrfz_mark2");
					},
					async content(event, trigger, player) {
						player.removeMark("polongmrfz_mark1", player.countMark("polongmrfz_mark1"));
						player.removeMark("polongmrfz_mark2", player.countMark("polongmrfz_mark2"));
					},
				},
				round: {
					direct: true,
					charlotte: true,
					firstDo: true,
					silent: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						await player.addMark("polongmrfz_round", 1);
						if (player.countMark("polongmrfz_round") > 3) player.removeSkill("polongmrfz");
					},
				},
				mark1: {},
				mark2: {},
			},
			ai: {
				order: 12,
				threaten: 2,
				result: {
					player: 10,
				},
			},
		},
	"yingkuimrfza": {
			audio: 2,
		},
	"danpaomrfz": {
			intro: {
				content: "【氮炮】剩余次数：#",
			},
			onremove: true,
			init: function (player) {
				player.addMark("danpaomrfz", 2);
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			filter: function (event, player) {
				return player.countMark("danpaomrfz") > 0 && player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;

				if (player.countCards("h") > 0) await player.chooseToDiscard("h", true, player.countCards("h"));
				else await player.chooseToDiscard("he", true, player.countCards("he"));
				target.damage();
				if (player.hasMark("shuipaomrfz")) {
					player.removeMark("shuipaomrfz");
					target.addSkill("danpaomrfz_plus");
				} else target.addSkill("danpaomrfz_nor");
				player.removeMark("danpaomrfz");
			},
			group: "danpaomrfz_damage",
			subSkill: {
				plus: {
					intro: {
						content: "计算与其他角色距离+4；每使用一张牌受到一点伤害",
					},
					mark: true,
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 4;
						},
					},
					silent: true,
					forced: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("danpaomrfz_plus");
					},
				},
				nor: {
					intro: {
						content: "计算与其他角色距离+2；每使用两张牌受到一点伤害",
					},
					mark: true,
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 2;
						},
					},
					silent: true,
					forced: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("danpaomrfz_nor");
					},
				},
				damage: {
					forced: true,
					trigger: { global: "useCard" },
					filter: function (event, player) {
						return event.player.hasSkill("danpaomrfz_nor") || event.player.hasSkill("danpaomrfz_plus");
					},
					async content(event, trigger, player) {
						var target = trigger.player;
						if (target.hasSkill("danpaomrfz_nor")) {
							await target.addMark("danpaomrfz_nor");
						} else {
							//@ts-ignore
							player.logSkill("danpaomrfz", target);
							await target.damage("player");
							return;
						}

						if (target.countMark("danpaomrfz_nor") >= 2) {
							//@ts-ignore
							player.logSkill("danpaomrfz", target);
							target.damage("player");
							target.removeMark("danpaomrfz_nor", 2);
						}
					},
				},
			},
			ai: {
				order: 1,
				result: {
					player: function (event, player) {
						var cardh = player.getCards("h"),
							carde = player.getCards("e");
						if (cardh.length == 0 && carde.length && carde.length < 2) return 1;
						if (cardh.length > 3) return -1;
						for (var i = 0; i < cardh.length; i++) {
							if (get.value(cardh[i]) > 8) return 0.5;
						}
					},
					target: function (player, target) {
						return get.damageEffect(target, player);
					},
				},
			},
		},
	"shuipaomrfz": {
			marktext: "蓄水",
			intro: {
				name: "蓄水",
				content: "蓄水炮蓄水完毕</br>·【氮炮】中蓝色数字翻倍，红色数字-1</br>·【水炮①】中‘+1’改为‘+2’",
			},
			onremove: true,
			init: function (player) {
				player.storage.shuipaomrfz = true;
			},
			audio: 2,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return player.getEquip(1) && !player.hasMark("shuipaomrfz") && event.parent && event.parent.name != "danpaomrfz";
			},
			async content(event, trigger, player) {
				player.addMark("shuipaomrfz");
			},
			group: "shuipaomrfz_j",
			subSkill: {
				j: {
					intro: {
						content: function (event, player) {
							if (player.hasSkill("shuipaomrfz_j2")) return "计算与其他角色的距离+2";
							return "计算与其他角色的距离+1";
						},
					},
					forced: true,
					charlotte: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !event.player.hasMark("shuipaomrfz_j") && event.player != player && event.parent && event.parent.name != "danpaomrfz";
					},
					async content(event, trigger, player) {
						if (player.hasMark("shuipaomrfz")) trigger.player.addSkill("shuipaomrfz_j2");
						else trigger.player.addSkill("shuipaomrfz_j3");
						trigger.player.addMark("shuipaomrfz_j");
					},
				},
				j2: {
					charlotte: true,
					forced: true,
					silent: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeMark("shuipaomrfz_j");
						player.removeSkill("shuipaomrfz_j2");
					},
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 1;
						},
					},
				},
				j3: {
					charlotte: true,
					forced: true,
					silent: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeMark("shuipaomrfz_j");
						player.removeSkill("shuipaomrfz_j3");
					},
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 2;
						},
					},
				},
			},
		},
	"jiepimrfz": {
			mod: {
				canBeDiscarded: function (card) {
					if (get.position(card) == "e") return false;
				},
			},
			global: "jiepimrfz2",
		},
	"jiepimrfz2": {
			mod: {
				canBeDiscarded: function (card) {
					if (
						get.position(card) == "e" &&
						_status.currentPhase &&
						_status.currentPhase.isAlive() &&
						_status.currentPhase.hasSkill("jiepimrfz")
					)
						return false;
				},
			},
		},
	"juntongmrfz": {
			audio: 4,
			forced: true,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				player.draw(3);
			},
			mod: {
				maxHandcard: function (player, num) {
					return num - 1;
				},
			},
			group: ["juntongmrfz_ban", "juntongmrfz_sha"],
			subSkill: {
				ban: {
					charlotte: true,
					direct: true,
					trigger: {
						player: ["phaseJudgeBefore", "phaseDrawBefore"],
					},
					async content(event, trigger, player) {
						trigger.cancel();
					},
				},
				sha: {
					audio: "juntongmrfz",
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.judge(card => {
								const suit = get.suit(card);
								if (suit === "heart" || suit === "diamond" || suit === "spade") return -4;
								return 0;
							})
							.set("judge2", result => {
								return result.bool === false;
							})
							.forResult();

						// step 1
						if (result.suit === "diamond") {
							if (trigger.addCount !== false) {
								trigger.addCount = false;
								player.getStat().card.sha--;
							}
							return;
						}

						if (result.suit === "heart") {
							if (
								game.hasPlayer(current => {
									return !trigger.targets.includes(current) && !!player.canUse(trigger.card, current);
								})
							) {
								result = await player
									.chooseTarget(
										get.prompt("juntongmrfz"),
										"为" + get.translation(trigger.card) + "增加一个目标",
										(card, player, target) => {
											return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
										}
									)
									.set("sourcex", trigger.targets)
									.set("ai", target => {
										const aiPlayer = _status.event.player;
										return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
									})
									.set("card", trigger.card)
									.forResult();

								// step 2 (内联到 heart 分支，因原流程中 step 2 仅在 heart 且选择目标后执行)
								if (result.targets) {
									trigger.targets.push(result.targets[0]);
									//@ts-ignore
									player.logSkill("juntongmrfz", result.targets[0]);
								}
							}
							return;
						}

						if (result.suit === "spade") {
							await player.draw();
							return;
						}

						// club 或其他情况，直接结束流程
						return;
					},
				},
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (get.type(card) == "delay") return "zeroplayertarget";
					},
				},
			},
		},
	"pochengmrfz": {
			audio: 2,
			trigger: { player: "useCardToTargeted" },
			onremove: true,
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			init: function (player) {
				player.storage.pochengmrfz = false;
			},
			filter: function (event, player) {
				return event.card.name == "sha" && game.roundNumber != 1 && !player.storage.pochengmrfz;
			},
			async content(event, trigger, player) {
				// step 0
				player.storage.pochengmrfz = true;
				event.num = 2;

				// step 1 loop (原 event.goto(1) 转换为 while 循环)
				while (event.num > 0) {
					event.num--;
					//@ts-ignore
					trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
					//@ts-ignore
					trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
				}

				// step 2
				//@ts-ignore
				event.getParent("phaseUse").skipped = true;
				player.addTempSkill("pochengmrfz_one");
			},
			group: "pochengmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.pochengmrfz;
					},
					async content(event, trigger, player) {
						player.addMark("pochengmrfz_clear", 1);
						if (player.countMark("pochengmrfz_clear") >= 3) {
							player.storage.pochengmrfz = false;
							player.removeMark("pochengmrfz_clear", player.countMark("pochengmrfz_clear"));
						}
					},
				},
				one: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + 1;
						},
					},
				},
			},
		},
	"mingshimrfz2": {},
	"jixiongxmrfz": {
			charlotte: true,
			intro: {
				content: "准备阶段，你进行一次判定，若判定结果为黑色，则你须弃置一张牌并流失一点体力，然后弃置‘符纸’标记",
			},
		},
	"fanzhongmrfz2": {
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			charlotte: true,
			direct: true,
			trigger: { player: "gainEnd" },
			filter: function (event, player) {
				if (event.player.getExpansions("fanzhongmrfz2").length >= 6) return false;
				return (
					player.hasMark("fanzhongmrfz") &&
					event.parent &&
					event.parent.name != "fanzhongmrfz_gain" &&
					event.parent.name != "fanzhongmrfz_gain2"
				);
			},
			async content(event, trigger, player) {
				player.addToExpansion(trigger.cards, player, "give").gaintag.add("fanzhongmrfz2");
				//@ts-ignore
				player.logSkill("fanzhongmrfz");
				//var str='';
				//str+=get.translation(trigger)+'</br>';
				//for(var i=1;i<=10;i++) str+=get.translation(trigger.getParent(i))+'</br>';
				//game.log(str);
				//player.popup(str);
			},
		},
	"xinshimrfz2": {},
	"jinghuamrfz2": {
			charlotte: true,
			direct: true,
			trigger: { player: "useCardEnd" },
			filter: function (event, player) {
				if (event.card.name != "sha") return false;
				return (
					player.getHistory("sourceDamage", function (evt) {
						return evt.card == event.card;
					}).length <= 2
				);
			},
			async content(event, trigger, player) {
				player.loseHp();
			},
		},
	"ruximrfz2": {
			charlotte: true,
			onremove: true,
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("ruximrfz2");
				},
			},
		},
	"yongwomrfz": {
			audio: 2,
			trigger: { player: "dying" },
			forced: true,
			mark: true,
			intro: {
				content: function (event, player) {
					if (player.isTurnedOver()) return "复活不可用";
					if (!player.storage.yongwomrfz2 && !player.isTurnedOver()) return "复活未使用";
					return "复活已使用";
				},
			},
			filter: function (event, player) {
				if (player.storage.yongwomrfz2) return false;
				return !player.isTurnedOver();
			},
			async content(event, trigger, player) {
				player.storage.yongwomrfz2 = true;
				player.turnOver();
				if (player.hp <= 0) player.recover(1 - player.hp);
			},
			mod: {
				globalTo: function (source, player, distance) {
					if (player.isTurnedOver()) return distance + 1;
				},
			},
			group: ["yongwomrfz_discard", "yongwomrfz_change1", "yongwomrfz_change2", "yongwomrfz2"],
			subSkill: {
				discard: {
					trigger: { global: "useCardAfter" },
					filter: function (event, player) {
						if (!player.isTurnedOver()) return false;
						if (event.player == player) return false;
						if (event.player.countCards("he") == 0) return false;
						return event.player == player.getNext() || event.player == player.getPrevious();
					},
					direct: true,
					async content(event, trigger, player) {
						const target = trigger.player;
						let result;

						// step 0
						await target.chooseToDiscard("he", true, "【拥我】:请弃置一张牌");
						target.addMark("yongwomrfz2", 1, false);

						// step 1
						if (target.countMark("yongwomrfz2") >= 2) {
							target.removeMark("yongwomrfz2", 2, false);
							await target.damage();
							//@ts-ignore
							player.logSkill("yongwomrfz", target);
						} else {
							return;
						}

						// step 2
						result = await player
							.chooseBool("【拥我】:是否翻面")
							.set("ai", () => {
								const aiPlayer = _status.event.player;
								if (aiPlayer.hp < 2 && !aiPlayer.storage.yongwomrfz2) return true;
								if (get.attitude(aiPlayer, aiPlayer.getNext()) > 2 || get.attitude(aiPlayer, aiPlayer.getPrevious()) > 2) return true;
								return false;
							})
							.forResult();

						// step 3
						if (result.bool) {
							await player.turnOver();
							//@ts-ignore
							player.logSkill("yongwomrfz");
						}
					},
				},
				change1: {
					direct: true,
					trigger: { player: "turnOverAfter" },
					filter: function (event, player) {
						return !player.isTurnedOver();
					},
					async content(event, trigger, player) {
						player.draw(2);
						//@ts-ignore
						player.logSkill("yongwomrfz");
					},
				},
				change2: {
					direct: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						if (player.isTurnedOver() || !event.player.isAlive()) return false;
						return (player.getStat("damage") || 0) > 0 || player.getHistory("damage").length > 0;
					},
					async content(event, trigger, player) {
						const result = await player
							.chooseBool("【拥我】:是否翻面")
							.set("ai", function () {
								var num = 0.2,
									player = _status.event.player;
								if (player.countCards("h") > 2) num + 0.3;
								if (player.hp > 1) num + 0.1;
								if (get.attitude(player, player.getNext()) < 2 || get.attitude(player, player.getPrevious()) < 2) num + 0.3;
								if (player.isTurnedOver()) num + 0.3;
								return Math.random() + num > 0.6;
							})
							.forResult();
						if (result.bool) {
							player.turnOver();
							//@ts-ignore
							player.logSkill("yongwomrfz");
						}
					},
				},
			},
		},
	"yongwomrfz2": {
			silent: true,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return player.storage.yongwomrfz2;
			},
			async content(event, trigger, player) {
				player.storage.yongwomrfz2 = false;
			},
		},
	"langqunmrfz2": {},
	"yixuemrfz2": {
			silent: true,
			firstDo: true,
			charlotte: true,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return player.hasSkill("yixuemrfz2");
			},
			async content(event, trigger, player) {
				player.removeSkill("yixuemrfz2");
			},
		},
	"juximrfz2": {
			intro: {
				markcount: "expansion",
				mark: function (dialog, storage, player) {
					var cards = player.getExpansions("juximrfz2");
					if (player.isUnderControl(true)) dialog.addAuto(cards);
					else return "共有" + get.cnNumber(cards.length) + "张牌";
				},
			},
			trigger: { player: "useCardAfter" },
			forced: true,
			filter: function (event, player) {
				if (event.card.name != "sha") return false;
				return player.getExpansions("juximrfz2").length > 0;
			},
			async content(event, trigger, player) {
				const history = player.getHistory("sourceDamage", function (evt) {
					return evt.card == trigger.card;
				}).length;
				const cards = player.getExpansions("juximrfz2");
				let result;

				if (history > 0) {
					result = await player
						.chooseButton(["你可以至多获得两张牌", cards], [0, Math.min(2, cards.length)], true)
						.set("ai", function (button) {
							return get.value(button.link, _status.event.player);
						})
						.forResult();
				} else {
					result = await trigger.targets[0]
						.chooseButton(["你可以至多获得两张牌", cards], [0, Math.min(2, cards.length)], true)
						.set("ai", function (button) {
							return get.value(button.link, _status.event.player);
						})
						.forResult();
				}
				if (result.bool) {
					if (history > 0) await player.gain(result.links, "gain2");
					else await trigger.targets[0].gain(result.links, "gain2");
					cards.removeArray(result.links);
				}

				player.loseToDiscardpile(cards);
				player.removeSkill("juximrfz2");
			},
		},
	"conghunmrfza": { audio: 2 },
	"huanghunmrfza": { audio: 2 },
	"gongzhenmrfz": {
			audio: 4,
			forced: true,
			trigger: { player: ["useCardAfter", "respond"] },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				if (!event.card.isCard) return false;
				return event.cards && event.cards.length == 1;
			},
			async content(event, trigger, player) {
				var cards = player.getCards("h"),
					list = [],
					num = 0;
				for (var i of cards) {
					list.add(get.suit(i, player));
				}
				if (!list.includes(get.suit(trigger.card, player))) player.draw();
				else if (player.countCards("h") > 0) player.chooseToDiscard("h", true, "【共振】:请弃置一张手牌");
			},
		},
	"mengxiangmrfz": {
			audio: 2,
			trigger: { player: "drawAfter" },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				return event.parent && event.parent.name == "gongzhenmrfz";
			},
			direct: true,
			async content(event, trigger, player) {
				await player.addMark("mengxiangmrfz", 1, false);

				if (player.countMark("mengxiangmrfz") % 2 == 0 && player.hasMark("mengxiangmrfz")) {
					player.addTempSkill("mengxiangmrfz_eff", {
						player: "phaseEnd",
					});
					player.removeMark("mengxiangmrfz", 2, false);
					if (player.countMark("mengxiangmrfz") > 0) event.redo();
				}
			},
			group: "mengxiangmrfz_rem",
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("mengxiangmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("mengxiangmrfz", player.countMark("mengxiangmrfz"), false);
					},
				},
				eff: {
					audio: "mengxiangmrfz",
					trigger: { player: ["useCard1", "respond"] },
					forced: true,
					charlotte: true,
					async content(event, trigger, player) {
						player.removeSkill("mengxiangmrfz_eff");
					},
					mod: {
						cardUsable: function (card) {
							return Infinity;
						},
						targetInRange: function (card) {
							return true;
						},
					},
					mark: true,
					intro: {
						content: "下一张使用或打出的牌无次数和距离限制",
					},
				},
			},
		},
	"paizhangmrfz": {
			global: "paizhangmrfz_tag4",
			audio: 4,
			trigger: { player: "loseAfter" },
			filter: function (event, player) {
				//@ts-ignore
				if (event.type != "discard" || event.getlx === false || event.getParent(3).name != "gongzhenmrfz") return false;
				for (var card of event.cards) {
					if (get.position(card, true) == "d") return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				if (trigger.cards.length) {
					result = await player
						.chooseTarget(get.prompt("paizhangmrfz"), "你可以将此牌交给一名其他角色", (card, player, target) => {
							return target !== player && !target.hasSkill("paizhangmrfz2");
						})
						.set("ai", target => {
							return -get.attitude(player, target);
						})
						.forResult();
				}

				// step 1
				if (result && result.targets) {
					const target = result.targets[0];
					const next = target.gain(trigger.cards, "gain2");
					next.gaintag = ["paizhangmrfz"];
					await next;
					target.addTempSkill("paizhangmrfz2");
					//@ts-ignore
					player.logSkill("paizhangmrfz");
				}

				// step 2
				for (const card of trigger.cards) {
					card.storage.paizhangmrfz = true;
				}
			},
			group: ["paizhangmrfz_tag1", "paizhangmrfz_tag2", "paizhangmrfz_tag3"],
			subSkill: {
				tag1: {
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: {
						global: "useCard",
					},
					filter: function (event, player) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].storage && event.cards[i].storage.paizhangmrfz) return true;
						}
						return false;
					},
					async content(event, trigger, player) {
						const cards = trigger.cards[0];
						if (trigger.cards.length > 1 || cards.number === undefined) {
							await trigger.player.damage();
							//@ts-ignore
							player.logSkill("paizhangmrfz", trigger.player);
						} else if (cards.number > 8) {
							await trigger.player.damage();
							//@ts-ignore
							player.logSkill("paizhangmrfz", trigger.player);
						} else {
							await trigger.player.chooseToDiscard(
								"he",
								Math.floor(cards.number / 3),
								"【排障】:请弃置" + Math.floor(cards.number / 3) + "张牌",
								true
							);
							//@ts-ignore
							player.logSkill("paizhangmrfz", trigger.player);
						}
					},
				},
				tag2: {
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: {
						target: "useCardToTarget",
						player: "addJudgeBefore",
					},
					filter: function (event, player) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].storage && event.cards[i].storage.paizhangmrfz) return true;
						}
						return false;
					},
					async content(event, trigger, player) {
						// step 0
						if (trigger.name === "addJudge") {
							trigger.cancel();
							//@ts-ignore
							const owner = get.owner(trigger.card);
							//@ts-ignore
							if (owner && owner.getCards("hej").includes(trigger.card)) {
								await owner.lose(trigger.card, ui.discardPile);
							} else {
								//@ts-ignore
								game.cardsDiscard(trigger.card);
							}
							game.log(trigger.card, "进入了弃牌堆");
						} else {
							//@ts-ignore
							trigger.getParent().targets.remove(player);
						}

						// step 1
						const trgnext = trigger.player.getNext();
						const trgprvs = trigger.player.getPrevious();
						if (
							trgnext &&
							trgnext !== player &&
							trgnext.hasCard(card => {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							const cards = trgnext.getCards("h", card => {
								return card.storage && card.storage.paizhangmrfz;
							});
							//@ts-ignore
							player.logSkill("paizhangmrfz", trgnext);
							await trgnext.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
						if (
							trgprvs &&
							trgprvs !== player &&
							trgprvs.hasCard(card => {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							const cards = trgprvs.getCards("h", card => {
								return card.storage && card.storage.paizhangmrfz;
							});
							//@ts-ignore
							player.logSkill("paizhangmrfz", trgprvs);
							await trgprvs.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
					},
				},
				tag3: {
					direct: true,
					charlotte: true,
					trigger: { global: "useCardToPlayered" },
					filter: function (event, player) {
						if (event.player == player) return false;
						if (
							!event.player.hasCard(function (card) {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						)
							return false;
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].storage && event.cards[i].storage.paizhangmrfz) return false;
						}
						for (var i = 0; i < event.targets.length; i++) {
							if (event.targets[i] == player) return true;
						}
					},
					async content(event, trigger, player) {
						// step 0
						const cards = trigger.player.getCards("h", card => {
							return card.storage && card.storage.paizhangmrfz;
						});
						event.cards = cards;
						game.cardsDiscard(cards);
						game.log(cards, "进入了弃牌堆");
						//@ts-ignore
						player.logSkill("paizhangmrfz", trigger.player);
						if (trigger.name === "addJudge") {
							trigger.cancel();
							//@ts-ignore
							const owner = get.owner(trigger.card);
							//@ts-ignore
							if (owner && owner.getCards("hej").includes(trigger.card)) {
								await owner.lose(trigger.card, ui.discardPile);
							} else {
								//@ts-ignore
								game.cardsDiscard(trigger.card);
							}
							game.log(trigger.card, "进入了弃牌堆");
						} else {
							//@ts-ignore
							trigger.getParent().targets.remove(player);
						}

						// step 1
						const number = Number(event.cards.map(card => get.number(card)).reduce((a, b) => Number(a || 0) + Number(b || 0), 0)) || 0;
						if (event.cards.length > 1 || number === 0) {
							await trigger.player.damage();
							//@ts-ignore
							player.logSkill("paizhangmrfz", trigger.player);
						} else if (number > 8) {
							await trigger.player.damage();
							//@ts-ignore
							player.logSkill("paizhangmrfz", trigger.player);
						} else {
							await trigger.player.chooseToDiscard(
								"he",
								Math.floor(number / 3),
								"【排障】:请弃置" + Math.floor(number / 3) + "张牌",
								true
							);
							//@ts-ignore
							player.logSkill("paizhangmrfz", trigger.player);
						}

						// step 2
						const trgnext = trigger.player.getNext();
						const trgprvs = trigger.player.getPrevious();
						if (
							trgnext &&
							trgnext.hasCard(card => {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							const cards = trgnext.getCards("h", card => {
								return card.storage && card.storage.paizhangmrfz;
							});
							//@ts-ignore
							player.logSkill("paizhangmrfz", trgnext);
							await trgnext.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
						if (
							trgprvs &&
							trgprvs.hasCard(card => {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							const cards = trgprvs.getCards("h", card => {
								return card.storage && card.storage.paizhangmrfz;
							});
							//@ts-ignore
							player.logSkill("paizhangmrfz", trgprvs);
							await trgprvs.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
					},
				},
				tag4: {
					charlotte: true,
					mod: {
						cardDiscardable: function (card, player) {
							if (card.storage && card.storage.paizhangmrfz) return false;
						},
					},
				},
			},
		},
	"paizhangmrfz2": { charlotte: true },
	"lieshimrfz": {
			audio: 2,
			usable: 3,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				if (event.card.name != "sha" || !event.targets || event.targets.length > 1) return false;
				return (
					player.countCards("he") > 0 &&
					game.hasPlayer(function (current) {
						return current != player && get.distance(event.targets[0], current) <= 1 && !event.targets.includes(current);
					})
				);
			},
			direct: true,
			async content(event, trigger, player) {
				let result;
				const target = trigger.targets[0];

				// step 0
				result = await player
					.chooseToDiscard(
						"he",
						get.prompt("lieshimrfz"),
						"你可以弃置一张牌并选择一名与" + get.translation(target) + "距离为 1 的其他角色视为使用一张【杀】"
					)
					.set(
						"goon",
						game.hasPlayer(current => {
							return get.distance(target, current) === 1 && get.attitude(player, current) < 2;
						})
					)
					.set("ai", card => {
						if (_status.event.goon) return 6 - get.value(card);
						return 0;
					})
					.forResult();

				// step 1
				if (result.cards && result.cards.length) {
					result = await player
						.chooseTarget(true, "请选择一名与" + get.translation(target) + "距离为 1 的一名其他角色", (card, player, target) => {
							const evt = _status.event.getTrigger();
							return (
								target !== player &&
								target !== evt.targets[0] &&
								get.distance(evt.targets[0], target) <= 1 &&
								lib.filter.targetEnabled2(evt.card, player, target)
							);
						})
						.set("ai", target => {
							return -get.attitude(player, target);
						})
						.forResult();
				} else {
					return;
				}

				// step 2
				if (result.bool && result.targets && result.targets.length) {
					await player.useCard({ name: "sha", isCard: true }, result.targets[0]);
					//@ts-ignore
					player.logSkill("lieshimrfz");
				}
			},
		},
	"guirenmrfz2": {
			silent: true,
			charlotte: true,
			firstDo: true,
			trigger: { player: "phaseAfter" },
			init: function (player) {
				player.storage.guirenmrfz2 = 0;
			},
			async content(event, trigger, player) {
				player.storage.guirenmrfz2 = 0;
			},
			mod: {
				maxHandcard: function (player, num) {
					return num - player.storage.guirenmrfz2;
				},
			},
		},
	"luanwumrfza": {
			audio: 2,
			direct: true,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				return event.card.name == "sha";
			},
			async content(event, trigger, player) {
				// step 0
				event.num = 2;

				// step 1 loop (original event.redo())
				while (event.num > 0) {
					event.num--;
					//@ts-ignore
					player.logSkill("luanwumrfza");
					//@ts-ignore
					trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
					//@ts-ignore
					trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
				}

				// step 2
				player.removeSkill("luanwumrfza");
			},
		},
	"kaiyuanmrfz": {
			audio: 2,
			trigger: {
				global: "roundStart",
			},
			firstDo: true,
			filter: function (event, player) {
				return game.roundNumber == 1;
			},
			direct: true,
			async content(event, trigger, player) {
				let result;

				// step 0
				result = await player
					.chooseTarget("【开源】:请选择一名角色令其摸两张牌且本局游戏使用【杀】的次数 +1，若该角色是你，你摸一张牌", true)
					.set("ai", target => {
						return get.attitude(player, target) > 0;
					})
					.forResult();

				// step 1
				if (result.targets) {
					const target = result.targets[0];
					await target.draw(2);
					target.addSkill("kaiyuanmrfz_buff");
					if (target === player) {
						await player.draw();
						//@ts-ignore
						player.logSkill("kaiyuanmrfz");
					} else {
						//@ts-ignore
						player.logSkill("kaiyuanmrfz", target);
					}
				}
			},
			subSkill: {
				buff: {
					mark: true,
					intro: {
						content: "使用【杀】的次数+1",
					},
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
			},
		},
	"jingshuimrfz": {
			mark: true,
			intro: {
				content: function (event, player) {
					return (
						"·你的攻击范围:" +
						player.getAttackRange(false) +
						"</br>·你使用【杀】的次数:" +
						player.getCardUsable("sha") +
						"</br>·你的手牌上限:" +
						player.getHandcardLimit()
					);
				},
			},
			audio: 3,
			trigger: { global: "roundStart" },
			direct: true,
			async content(event, trigger, player) {
				const str = "【净水】:你可选择一名其他角色，你将你的手牌数、手牌上限、攻击范围和使用【杀】的次数调整至与其一致";
				const result = await player
					.chooseTarget(get.prompt("jingshuimrfz"), str, function (card, player, target) {
						return target != player;
					})
					.set("ai", target => target.isMaxHandcard())
					.forResult();

				if (result.targets) {
					const target = result.targets[0];
					var numsha = target.getCardUsable("sha");
					var numatt = target.getAttackRange(false);
					var numhand = target.getHandcardLimit();
					//@ts-ignore
					player.logSkill("jingshuimrfz", target);
					//@ts-ignore 摸牌
					if (player.countCards("h") <= target.countCards("h")) player.drawTo(target.countCards("h"));
					//杀
					player.removeMark("jingshuimrfz_sha", player.countMark("jingshuimrfz_sha"), false);
					player.addMark("jingshuimrfz_sha", numsha, false);
					//攻击距离
					player.removeMark("jingshuimrfz_att", player.countMark("jingshuimrfz_att"), false);
					player.addMark("jingshuimrfz_att", numatt, false);
					//手牌上限
					player.removeMark("jingshuimrfz_maxhand", player.countMark("jingshuimrfz_maxhand"), false);
					player.addMark("jingshuimrfz_maxhand", numhand, false);
				}
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha" && player.hasMark("jingshuimrfz_sha")) return (num = player.countMark("jingshuimrfz_sha"));
				},
				attackRangeBase: function (player, num) {
					if (player.hasMark("jingshuimrfz_att")) return (num = player.countMark("jingshuimrfz_att"));
				},
				maxHandcard: function (player, num) {
					if (player.hasMark("jingshuimrfz_maxhand")) return (num = player.countMark("jingshuimrfz_maxhand"));
				},
			},
			subSkill: {
				sha: {
					charlotte: true,
				},
				att: {
					charlotte: true,
				},
				maxhand: {
					charlotte: true,
				},
			},
		},
	"liuxingmrfz": {
			audio: 2,
			trigger: {
				player: "damageBegin",
			},
			usable: 1,
			forced: true,
			filter: function (event, player) {
				return player.countCards("h") >= player.hp && event.nature != "thunder";
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
		},
	"yiyinmrfz": {
			audio: 2,
			chargeSkill: true,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.countMark("charge") > 2) return false;
				return player.hasCard(function (card) {
					return get.tag(card, "damage");
				}, "h");
			},
			filterCard: function (card) {
				return get.tag(card, "damage");
			},
			selectCard: function () {
				var player = _status.event.player;
				return [1, 3 - player.countMark("charge")];
			},
			check: function (card) {
				var player = _status.event.player;
				if (player.countCards("h", card => card.name === "sha") > player.getCardUsable("sha") + 1) return true;
				return card.name != "sha";
			},
			async content(event, trigger, player) {
				const { cards } = event;
				player.addMark("charge", cards.length);
			},
			ai: {
				threaten: function (event, player) {
					return 0.85 + player.countMark("charge") * 0.1;
				},
				order: 13,
				result: {
					player: 1,
				},
			},
			group: ["yiyinmrfz_sha", "yiyinmrfz_get"],
			subSkill: {
				sha: {
					audio: "yiyinmrfz",
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (player.countMark("charge") == 0) return false;
						return event.card && event.card.name == "sha" && !player.storage.jiyinmrfz;
					},
					prompt: "你可以消耗一点蓄力值令此【杀】的伤害基数+1",
					async content(event, trigger, player) {
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage++;
						player.removeMark("charge");
					},
				},
				get: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					filter: function (event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					async content(event, trigger, player) {
						player.addMark("charge");
					},
				},
			},
		},
	"huangxiangmrfz": {
			audio: 2,
			trigger: { player: "phaseDiscardEnd" },
			filter: function (event, player) {
				if (
					player.hasCard(function (card) {
						return card.hasGaintag("huangxiangmrfzx");
					}, "h")
				)
					return false;
				return player.countMark("charge") > 0 && player.countCards("h") > 0;
			},
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h")
					.set("ai", function (card) {
						if (card.name == "shan" && card.name == "wuxie") return 6;
						if (card.name == "sha" && card.name == "tao" && card.name == "jiu") return 5;
						return 6 - get.value(card);
					})
					.forResult();

				if (result.cards) {
					//@ts-ignore
					player.logSkill("huangxiangmrfz");
					player.addGaintag(result.cards, "huangxiangmrfzx");
					player.removeMark("charge");
				}
			},
			group: "huangxiangmrfz_lose",
			subSkill: {
				lose: {
					trigger: {
						player: ["loseAfter", "damageEnd"],
					},
					filter: function (event, player) {
						if (event.name == "damage")
							return player.hasCard(function (card) {
								return card.hasGaintag("huangxiangmrfzx");
							}, "h");
						if (event.name == "lose") {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("huangxiangmrfzx")) return true;
							}
							return false;
						}
						return false;
					},
					async content(event, trigger, player) {
						let result;

						// step 0
						const history = game.getAllGlobalHistory("useCard");
						for (let i = history.length - 1; i > 0; i--) {
							if (!history[i].targets) continue;
							if (history[i].targets.includes(player) && history[i].player !== player) {
								//@ts-ignore
								event.targets = history[i].player;
								break;
							}
						}
						result = await player
							.chooseControl(
								event.targets ? ["摸牌", "对" + get.translation(event.targets) + "造成一点伤害", "cancel2"] : ["摸牌", "cancel2"]
							)
							.set("ai", () => {
								const aiPlayer = _status.event.player;
								if (event.targets) {
									if (get.damageEffect(event.targets, aiPlayer, aiPlayer) > 0) return 1;
									return 0;
								} else {
									return 0;
								}
							})
							.set("prompt", "【荒响】:请选择一项")
							.forResult();

						// step 1
						if (result.control !== "cancel2") {
							//@ts-ignore
							player.logSkill("huangxiangmrfz");
							if (result.control === "摸牌") {
								await player.draw();
								if (player.countMark("charge") < 3) {
									player.addMark("charge");
								}
							} else {
								//@ts-ignore
								await event.targets.damage();
							}
						} else {
							return;
						}

						// step 2
						if (
							!player.hasCard(card => {
								return card.hasGaintag("huangxiangmrfzx");
							}, "h") &&
							player.countMark("charge") > 0
						) {
							result = await player
								.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h")
								.set("ai", card => {
									if (card.name === "shan" || card.name === "wuxie") return 6;
									if (card.name === "sha" || card.name === "tao" || card.name === "jiu") return 5;
									return 6 - get.value(card);
								})
								.forResult();
						}

						// step 3
						if (result?.cards) {
							//@ts-ignore
							player.logSkill("huangxiangmrfz");
							player.addGaintag(result.cards, "huangxiangmrfzx");
							player.removeMark("charge");
						}
					},
				},
			},
		},
	"jiyinmrfz": {
			audio: 3,
			trigger: { player: "phaseUseBegin" },
			filter: function (event, player) {
				return player.countMark("charge") > 0;
			},
			check: function (event, player) {
				return get.player().hasCard(function (card) {
					return card.name == "sha";
				}, "h");
			},
			async content(event, trigger, player) {
				var list = ["jiyinmrfz_eff1", "jiyinmrfz_lose", "jiyinmrfz_eff4", "jiyinmrfz_eff2", "jiyinmrfz_eff3"];
				player.storage.jiyinmrfz = true;
				for (const i of list) player.addTempSkill(i);
			},
			subSkill: {
				lose: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.jiyinmrfz = false;
					},
				},
				//伤害基数 目标
				eff1: {
					silent: true,
					charlotte: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						if (!event.card) return false;
						return event.card.name == "sha" && event.targets.length == 1;
					},
					async content(event, trigger, player) {
						const target = trigger.targets[0];
						let buff = 0;

						// step 0
						if (
							!game.hasPlayer(current => {
								return current !== target && current.countCards("h") > target.countCards("h");
							})
						) {
							buff++;
						}
						if (
							!game.hasPlayer(current => {
								return current !== target && current.hp > target.hp;
							})
						) {
							buff++;
						}
						if (
							!game.hasPlayer(current => {
								return current !== target && current.countCards("e") > target.countCards("e");
							})
						) {
							buff++;
						}
						if (buff === 3) {
							player.storage.jiyinmrfz_eff1 = true;
							player.addTempSkill("jiyinmrfz_eff1_buff2", "shaAfter");
						}

						// step 1
						player.addTempSkill("jiyinmrfz_eff1_buff", "shaAfter");
					},
					mod: {
						playerEnabled: function (card, player, target) {
							if ((target.isMaxHp() || target.isMaxHandcard() || target.isMaxEquip()) && card.name == "sha") return true;
							else if (card.name == "sha") return false;
						},
					},
				},
				eff1_buff: {
					audio: "huangxiangmrfz",
					trigger: { source: "damageBegin3" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						const target = trigger.player;
						if (player.storage.jiyinmrfz_eff1) {
							trigger.num = target.hp;
						} else trigger.num = Math.max(Math.min(target.hp - 1, player.countMark("charge")), 1);
						player.removeSkill("jiyinmrfz_eff1_buff");
					},
				},
				eff1_buff2: {
					silent: true,
					charlotte: true,
					trigger: { player: "shaEnd" },
					async content(event, trigger, player) {
						player.storage.jiyinmrfz_eff1 = false;
					},
				},
				//闪的次数
				eff2: {
					trigger: { player: "useCardToPlayered" },
					forced: true,
					charlotte: true,
					firstDo: true,
					filter: function (event, player) {
						//@ts-ignore
						return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
					},
					logTarget: "target",
					async content(event, trigger, player) {
						let targets = trigger.target;
						let id = trigger.target.playerid;
						let map = trigger?.parent?.customArgs;

						if (!id || !map) return;

						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired += targets.hp - 1;
						} else {
							map[id].shanRequired = targets.hp;
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > player.countMark("charge")) return false;
						},
					},
				},
				//提示
				eff3: {
					charlotte: true,
					mark: true,
					intro: {
						content: function (event, player) {
							var list = [];
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].isMaxHp() && game.players[i].isMaxHandcard() && game.players[i].isMaxEquip())
									list.add(get.translation(game.players[i]));
							}
							return "手牌最多或之一且体力值最多或之一且装备数最多或之一的角色有:</br>" + (list.length ? list : "没有满足条件的角色！");
						},
					},
				},
				//消耗蓄力值
				eff4: {
					forced: true,
					charlotte: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						player.removeMark("charge", trigger.num);
					},
				},
			},
		},
	"yanbaomrfz2": {
			charlotte: true,
		},
	"renbenmrfz2": {
			mark: true,
			intro: {
				content: "接受《特里蒙科学伦理宣言》",
			},
			audio: "renbenmrfz",
			enable: "phaseUse",
			filterCard: function (card, player) {
				return card.name == player.storage.renbenmrfz;
			},
			discard: false,
			lose: false,
			filter: function (event, player) {
				return player.hasCard(function (card) {
					return card.name == player.storage.renbenmrfz;
				}, "h");
			},
			filterTarget: function (card, player, target) {
				return target != player && target.hasSkill("renbenmrfz");
			},
			async content(event, trigger, player) {
				await player.draw();
				player.give(event.cards, event.target);
			},
			group: "renbenmrfz2_lose",
			subSkill: {
				lose: {
					charlotte: true,
					silent: true,
					firstDo: true,
					priority: 50,
					trigger: { global: "die" },
					filter: function (event, player) {
						return event.player.hasSkill("renbenmrfz");
					},
					async content(event, trigger, player) {
						player.removeSkill("renbenmrfz2");
					},
				},
			},
			ai: {
				order: 13,
				result: {
					player: function (player, target) {
						if (get.attitude(player, target) > 0) return 1;
						return -1;
					},
				},
			},
		},
	"renbenmrfz3": {
			mark: true,
			markimage: "extension/WhichWay/image/skill/rejecthmmrfz.png",
			intro: {
				content: function (event, player) {
					return "不接受《特里蒙科学伦理宣言》</br>当前攻击距离为" + player.getAttackRange(false);
				},
			},
			mod: {
				attackRange: function (player, num) {
					var atk = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] == player) continue;
						if (game.players[i].hasSkill("renbenmrfz2")) atk++;
					}
					return num - Math.max(2, atk);
				},
			},
		},
	"dizhumrfzx": {
			mark: true,
			markimage: "extension/WhichWay/image/skill/yedengmrfz.png",
			intro: {
				content: function (event, player) {
					return "受到的伤害-1，若为致命伤害，则防止之";
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "damageBegin3" },
			async content(event, trigger, player) {
				if (trigger.num < player.hp) trigger.num--;
				else trigger.num = 0;
				player.removeMark("dizhumrfz");
				player.removeSkill("dizhumrfzx");
				//@ts-ignore
				player.logSkill("dizhumrfz");
			},
		},
	"fuyuanmrfz": {
			audio: 2,
			trigger: { global: "recoverEnd" },
			forced: true,
			filter: function (event, player) {
				return event.source == player && event.player != player;
			},
			async content(event, trigger, player) {
				trigger.player.draw();
			},
		},
	"gaihuamrfz": {
			audio: 2,
			trigger: { global: "damageBegin" },
			filter: function (event, player) {
				if (event.player == player) return false;
				return event.nature && player.inRange(event.player);
			},
			direct: true,
			async content(event, trigger, player) {
				let result;

				// step 0
				if (trigger.card) {
					const cards = trigger.card;
					result = await player
						.chooseToDiscard(
							"he",
							get.prompt("gaihuamrfz"),
							//@ts-ignore
							"是否弃置一张非" + get.translation(get.type(cards)) + "牌令此伤害 +1",
							card => {
								//@ts-ignore
								return get.type(card) !== get.type(cards);
							}
						)
						.set("goon", get.attitude(player, trigger.player) < 0)
						.set("ai", card => {
							if (!_status.event.goon) return 0;
							return 7 - get.value(card);
						})
						.forResult();
				} else {
					result = await player
						.chooseToDiscard(get.prompt("gaihuamrfz"), "是否弃置一张牌令此伤害 +1")
						.set("goon", get.attitude(player, trigger.player) < 0)
						.set("ai", card => {
							if (!_status.event.goon) return 0;
							return 7 - get.value(card);
						})
						.forResult();
				}

				// step 1
				if (result.bool) {
					trigger.num++;
					//@ts-ignore
					player.logSkill("gaihuamrfz", trigger.player);
				}
			},
		},
	"yaopeimrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.getCardUsable("sha") > 0 && player.countCards("he") > 0;
			},
			filterCard: true,
			position: "he",
			prompt: "请弃置一张牌",
			async content(event, trigger, player) {
				let result;

				// step 0
				let num = 0;
				let go = false;
				if (
					game.hasPlayer(current => {
						return get.distance(player, current) <= 1 && get.attitude(player, current) > 2 && current.getDamagedHp() > 2;
					})
				) {
					go = true;
				} else if (
					!game.hasPlayer(current => {
						return (
							get.distance(player, current) <= 1 &&
							get.attitude(player, current) > 0 &&
							current.getDamagedHp() > 0 &&
							current !== player
						);
					}) &&
					player.getDamagedHp() > 0
				) {
					go = true;
				}
				player.addTempSkill("yaopeimrfz2", "phaseUseAfter");
				result = await player
					.chooseTarget(
						"【药配】:选择一名与你距离不大于 1 的角色令其回血，或选择'取消'令攻击范围内的所有角色回复一点体力",
						(card, target, player) => {
							return get.distance(player, target) <= 1 && target.getDamagedHp() > 0;
						}
					)
					.set("go", go)
					.set("ai", target => {
						const aiPlayer = _status.event.player;
						if (go) return get.attitude(aiPlayer, target) > 2;
						return 0;
					})
					.forResult();

				// step 1
				if (result.targets) {
					const targets = result.targets[0];
					await targets.recover();
					if (targets.getDamagedHp() >= 3) {
						await targets.recover();
					}
				} else {
					for (let i = 0; i < game.players.length; i++) {
						if (player.inRange(game.players[i]) || game.players[i] === player) {
							await game.players[i].recover();
						}
					}
				}
			},
			ai: {
				expose: 0.1,
				threaten: 1.5,
				order: 13,
				result: {
					player: function (player) {
						var num = 0,
							player = _status.event.player;
						for (var i = 0; i < game.players.length; i++) {
							var targetx = game.players;
							if (!player.inRange(targetx[i])) continue;
							if (get.attitude(player, targetx[i]) > 0 && targetx[i].getDamagedHp() > 0) num++;
							if (get.attitude(player, targetx[i]) <= 0 && targetx[i].getDamagedHp() > 0) num--;
							if (player.getDamagedHp() > 0) {
								num = 1;
								break;
							}
						}
						if (num > 0) return 1;
						return -1;
					},
				},
			},
		},
	"yaopeimrfz2": {
			charlotte: true,
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num - 1;
				},
			},
		},
	"minghuomrfz": {
			audio: 4,
			trigger: { player: "phaseZhunbeiBegin" },
			direct: true,
			async content(event, trigger, player) {
				if (player.hasSkill("minghuomrfz_buff1")) player.removeSkill("minghuomrfz_buff1");
				if (player.hasSkill("minghuomrfz_buff2")) player.removeSkill("minghuomrfz_buff2");
				const result = await player
					.chooseControl()
					.set("choiceList", [
						"每回合你使用的第一张单一目标的普通锦囊或【杀】可以额外指定一个目标",
						"当有‘灼痕’标记的角色进入濒死状态时，你可以令其上家或下家获得一个‘灼痕’标记",
						'<span style="text-decoration:line-through">真的会有人选这个选项吗？</span>不发动此技能',
					])
					.set("ai", function () {
						if (
							game.countPlayer(function (current) {
								var curnext = current.getNext(),
									curpre = current.getPrevious();
								return (
									current != player &&
									current.hasMark("zhuohenmrfz") &&
									current.hp < 2 &&
									(get.attitude(player, curnext) || get.attitude(player, curpre))
								);
							}) > 0
						)
							return 1;
						return 0;
					})
					.forResult();

				if (result.index !== 2) {
					if (result.index == 0) player.addSkill("minghuomrfz_buff1");
					else player.addSkill("minghuomrfz_buff2");
					//@ts-ignore
					player.logSkill("minghuomrfz");
				}
			},
			subSkill: {
				buff1: {
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						if (player.hasSkill("minghuomrfz_mark")) return false;
						if (event.targets.length > 1) return false;
						//@ts-ignore
						if (get.type(event.card) != "trick" && event.card.name != "sha") return false;
						return game.hasPlayer(function (current) {
							return !event.targets.includes(current) && !!player.canUse(event.card, current);
						});
					},
					direct: true,
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.chooseTarget(
								get.prompt("minghuomrfz"),
								"为" + get.translation(trigger.card) + "增加一个目标",
								(card, player, target) => {
									return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
								}
							)
							.set("sourcex", trigger.targets)
							.set("ai", target => {
								const aiPlayer = _status.event.player;
								return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
							})
							.set("card", trigger.card)
							.forResult();

						// step 1
						if (result.targets) {
							if (!event.isMine() && !event.isOnline()) {
								await game.delayx();
							}
							event.target = result.targets[0];
							player.addTempSkill("minghuomrfz_mark", "phaseEnd");
						} else {
							return;
						}

						// step 2
						//@ts-ignore
						player.logSkill("minghuomrfz", event.target);
						trigger.targets.push(event.target);
					},
				},
				buff2: {
					trigger: { global: "dying" },
					direct: true,
					filter: function (event, player) {
						if (event.player.getNext()?.hasMark("zhuohenmrfz") && event.player.getPrevious()?.hasMark("zhuohenmrfz")) return false;
						return game.players.length > 2 && event.player.hasMark("zhuohenmrfz");
					},
					async content(event, trigger, player) {
						const target = trigger.player;
						const result = await player
							.chooseTarget(
								get.prompt("minghuomrfz"),
								"你可以令" + get.translation(target) + "的上家或下家（不能是你）获得一个‘灼痕’标记",
								function (card, player, target) {
									return (
										!target.hasMark("zhuohenmrfz") &&
										target != player &&
										(target == _status.event.TriPlayer.getNext() || target == _status.event.TriPlayer.getPrevious())
									);
								}
							)
							.set("TriPlayer", trigger.player)
							.set("ai", function (player, target) {
								/** @type {Player} */
								const targetx = get.event().targetx;
								if (get.attitude(player, targetx.getNext()) > 2 && get.attitude(player, targetx.getNext()) > 2) return 0;
								return get.attitude(player, target) < 2;
							})
							.set("targetx", trigger.player)
							.forResult();

						if (result.targets) {
							const targetx = result.targets[0];
							targetx.addMark("zhuohenmrfz");
							//@ts-ignore
							player.logSkill("zhuohenmrfz", targetx);
							if (targetx.countCards("h") > 0) targetx.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
						}
					},
				},
				mark: {
					charlotte: true,
				},
			},
		},
	"yingyaomrfz": {
			intro: {
				content: function (event, player) {
					return "剩余使用次数:" + (game.totalmark("zhuohenmrfz") - player.countMark("yingyaomrfz"));
				},
			},
			audio: 2,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				if (game.totalmark("zhuohenmrfz") <= player.countMark("yingyaomrfz")) return false;
				return (
					event.player != player &&
					game.hasPlayer(function (current) {
						return current != player && player.inRange(current);
					})
				);
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(
						true,
						get.prompt("yingyaomrfz"),
						"你可以选择一名在你攻击范围内的角色，令其回复一点体力，若其为你，你摸一张牌",
						function (card, player, target) {
							return (player.inRange(target) && target.getDamagedHp() > 0) || target == player;
						}
					)
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) > 2;
					})
					.forResult();

				if (result.targets) {
					var target = result.targets[0];
					target.recover();
					player.addMark("yingyaomrfz", 1, false);
					if (target == player) player.draw();
				}
			},
			group: "yingyaomrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeMark("yingyaomrfz", player.countMark("yingyaomrfz"), false);
					},
				},
			},
		},
	"zhuohenmrfz": {
			intro: {
				content: "·被德拉克的火焰灼伤</br>·手牌上限-1</br>·受到伤害时需弃置一张手牌",
			},
			global: "zhuohenmrfz_debuff2",
			audio: 2,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				return event.target != player && !event.target.hasMark("zhuohenmrfz") && !event.target.hasSkill("zhuohenmrfz2");
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.target) + "获得一个‘灼痕’标记？";
			},
			async content(event, trigger, player) {
				const target = trigger.target;
				target.addMark("zhuohenmrfz");
				target.addSkill("zhuohenmrfz_clear");
				target.addTempSkill("zhuohenmrfz2");
				if (target.countCards("h") > 0) target.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + game.totalmark("zhuohenmrfz");
				},
			},
			group: ["zhuohenmrfz_debuff", "zhuohenmrfz_draw"],
			subSkill: {
				draw: {
					audio: "zhuohenmrfz",
					forced: true,
					trigger: { global: "phaseBegin" },
					filter: function (event, player) {
						return event.player.hasMark("zhuohenmrfz") && !player.isMaxHandcard(true);
					},
					async content(event, trigger, player) {
						player.draw();
					},
				},
				clear: {
					silent: true,
					firstDo: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeMark("zhuohenmrfz");
						player.removeSkill("zhuohenmrfz_clear");
					},
				},
				debuff: {
					charlotte: true,
					direct: true,
					trigger: { global: "damageBegin" },
					filter: function (event, player) {
						return event.player != player && event.player.hasMark("zhuohenmrfz") && event.player.countCards("h") > 0;
					},
					async content(event, trigger, player) {
						trigger.player.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
					},
				},
				debuff2: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							if (player.hasMark("zhuohenmrfz")) return num - 1;
						},
					},
				},
			},
		},
	"zhuohenmrfz2": {
			charlotte: true,
		},
	"chuangzhongmrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				for (var i = 0; i < event.targets.length; i++) {
					if (event.targets[i].hasMark("kuangyumrfz")) {
						return true;
					}
				}
				return false;
			},
			async content(event, trigger, player) {
				for (var i = 0; i < trigger.targets.length; i++) {
					if (trigger.targets[i].hasMark("kuangyumrfz")) {
						trigger.targets[i].addTempSkill("fengyin");
						trigger.targets[i].addSkill("chuangzhongmrfz_eff");
					}
				}
			},
			subSkill: {
				eff: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseDiscardEnd" },
					async content(event, trigger, player) {
						player.removeSkill("chuangzhongmrfz_eff");
					},
					mod: {
						maxHandcard: function (player, num) {
							if (player.hasMark("kuangyumrfz")) return num - player.hp;
						},
					},
				},
			},
		},
	"kuangyumrfz": {
			intro: {
				name: "风起",
				content: function (event, player) {
					if (player.hasSkill("chuangzhongmrfz_eff")) return "·回合开始时，随机跳过两个阶段</br>·手牌上限-" + player.hp;
					return "·回合开始时，随机跳过两个阶段";
				},
			},
			audio: 4,
			derivation: ["kuangyumrfz_rewirte"],
			trigger: { player: "useCardToPlayered" },
			firstDo: true,
			filter: function (event, player) {
				//@ts-ignore
				var nost = get.type(event.card) != "trick" && get.type(event.card) != "delay";
				//@ts-ignore
				var hast = get.type(event.card) != "trick" && event.card.name != "sha";
				if (!event.targets || event.targets.length > 1) return false;
				if (event.cards && (player.storage.kuangyumrfz ? nost : hast)) return false;
				return event.target != player && !event.target.hasMark("kuangyumrfz");
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.target) + "获得一个‘风起’标记？";
			},
			async content(event, trigger, player) {
				const target = trigger.target;
				target.addMark("kuangyumrfz");
				target.addSkill("kuangyumrfz_clear");
				target.addTempSkill("kuangyumrfz2");
				target.addSkill("kuangyumrfz_skip");
				if (player.inRange(target)) player.addTempSkill("kuangyumrfz_damage", "useCardAfter");
			},
			group: "kuangyumrfz_clear2",
			subSkill: {
				clear2: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.kuangyumrfz;
					},
					async content(event, trigger, player) {
						player.storage.kuangyumrfz = false;
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeMark("kuangyumrfz");
						player.removeSkill("kuangyumrfz_clear");
					},
				},
				skip: {
					audio: "kuangyumrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseBegin" },
					async content(event, trigger, player) {
						var phase = ["phaseBegin", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"].randomGets(2);
						for (var i = 0; i < phase.length; i++) {
							player.skip(phase[i]);
						}
						game.log(player, "因【狂语】将会跳过", get.tranPhase(phase[0]), "和", get.tranPhase(phase[1]));
						player.removeSkill("kuangyumrfz_skip");
					},
				},
				damage: {
					audio: "kuangyumrfz",
					trigger: { source: "damageBegin" },
					forced: true,
					filter: function (event, player) {
						return event.player.hasMark("kuangyumrfz");
					},
					async content(event, trigger, player) {
						trigger.num++;
						player.storage.kuangyumrfz = true;
					},
				},
			},
		},
	"kuangyumrfz2": {
			charlotte: true,
		},
	"yanxunmrfz": {
			audio: 4,
			trigger: { player: "damageBegin" },
			forced: true,
			filter: function (event, player) {
				return event.parent && (event.parent.name === "_lianhuan" || event.parent.name === "_lianhuan2");
			},
			async content(event, trigger, player) {
				trigger.num--;
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + 2;
				},
			},
			group: ["yanxunmrfz_kaishi", "yanxunmrfz_draw", "yanxunmrfz_use", "yanxunmrfz_judge"],
			subSkill: {
				judge: {
					audio: "yanxunmrfz",
					trigger: { player: "damageBegin" },
					forced: true,
					filter: function (event, player) {
						//@ts-ignore
						return event.getParent("phaseJudge") && event.getParent("phaseJudge").player == player;
					},
					async content(event, trigger, player) {
						trigger.num -= 2;
					},
				},
				kaishi: {
					direct: true,
					trigger: { global: "roundStart" },
					popup: false,
					async content(event, trigger, player) {
						if (player.isLinked()) {
							player.link();
							//@ts-ignore
							player.logSkill("yanxunmrfz");
						}
						if (player.isTurnedOver()) {
							const result = await player
								.chooseBool()
								.set("prompt", get.prompt("yanxunmrfz"))
								.set("prompt2", "【严训】:是否翻面并跳过下个出牌阶段？")
								.set("ai", function () {
									var player = _status.event.player;
									return player.countCards("h") < player.getHandcardLimit() * 2;
								})
								.forResult();
							if (result.bool) {
								player.turnOver();
								player.addSkill("yanxunmrfz_skipped");
								//@ts-ignore
								player.logSkill("yanxunmrfz");
							}
						}
					},
				},
				skipped: {
					direct: true,
					mark: true,
					intro: {
						content: "跳过下个出牌阶段",
					},
					trigger: { player: "phaseBegin" },
					async content(event, trigger, player) {
						player.skip("phaseUse");
						game.log(player, "的出牌阶段将被跳过");
						player.removeSkill("yanxunmrfz_skipped");
					},
				},
				draw: {
					audio: "yanxunmrfz",
					trigger: { player: "phaseUseBegin" },
					filter: function (event, player) {
						return player
							.getHistory("skipped")
							.map(i => i.name)
							.includes("phaseDraw");
					},
					frequent: true,
					prompt: "【严训】:是否摸一张牌?",
					async content(event, trigger, player) {
						player.draw();
					},
				},
				use: {
					audio: "yanxunmrfz",
					trigger: { player: "phaseDiscardBefore" },
					filter: function (event, player) {
						var cardh = player.getCards("h"),
							canuse = false;
						for (var i = 0; i < cardh.length; i++) {
							if (player.hasUseTarget(cardh[i])) {
								canuse = true;
								break;
							}
						}
						return (
							player
								.getHistory("skipped")
								.map(i => i.name)
								.includes("phaseUse") && canuse == true
						);
					},
					prompt: "【严训】:是否使用至多两张手牌?",
					async content(event, trigger, player) {
						let result;

						// step 0
						event.num = 0;

						// step 1 & 2 loop (original event.goto(1))
						while (event.num < 2) {
							// step 1
							event.num++;
							const cardh = player.getCards("h");
							const cards = [];
							for (const card of cardh) {
								cards.push(card.name);
							}
							const list = [];
							for (const name of lib.inpile) {
								if (!cards.includes(name)) continue;
								const card = { name: name, isCard: true };
								if (!player.hasUseTarget(card)) continue;
								//@ts-ignore
								const type = get.type(card);
								if (type === "basic") {
									list.push(["基本", "", name]);
								} else if (type === "trick" || type === "delay") {
									list.push(["锦囊", "", name]);
								} else if (type === "equip") {
									list.push(["装备", "", name]);
								}
							}
							if (list.length) {
								result = await player
									.chooseButton(["【严训】:请选择你要使用的手牌 (" + event.num + "/2)", [list, "vcard"]], "hidden")
									.forResult();
							} else {
								return;
							}

							// step 2
							if (result.links) {
								const name = result.links[0][2];
								await player.chooseToUse(
									(card, player, event) => {
										return get.name(card) === name;
									},
									"【严训】:你可以使用一张" + get.translation(name)
								);
								// event.goto(1) is handled by while loop condition
							} else {
								return;
							}
						}
					},
				},
			},
		},
	"chuchanmrfz": {
			intro: {
				content: function (event, player) {
					if (!player.storage.chuchanmrfz) return "未发动";
					if (player.storage.chuchanmrfz && player.hasSkill("chuchanmrfz_buff1")) return "本轮受到伤害后回复一点体力";
					return "已发动";
				},
			},
			audio: 2,
			trigger: { player: "changeHp" },
			forced: true,
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "除颤",
			animationColor: "fire",
			init: function (player) {
				player.storage.chuchanmrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.chuchanmrfz && player.hp < 2;
			},
			async content(event, trigger, player) {
				player.storage.chuchanmrfz = true;
				player.recoverTo(2);
				player.addSkill("chuchanmrfz_buff1");
				player.addSkill("chuchanmrfz_buff2");
				player.awakenSkill(event.name);
			},
			subSkill: {
				buff1: {
					audio: "chuchanmrfz",
					trigger: { player: "damageEnd" },
					firstDo: true,
					forced: true,
					charlotte: true,
					async content(event, trigger, player) {
						player.recover();
					},
					ai: {
						effect: {
							target: function (card, player, target, current) {
								if (get.tag(card, "damage")) return "zerotarget";
								if (get.type(card) == "trick" && get.tag(card, "damage")) {
									return "zeroplayertarget";
								}
							},
						},
					},
				},
				buff2: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeSkill(["chuchanmrfz_buff1", "chuchanmrfz_buff2"]);
					},
				},
			},
		},
	"feixuemrfz": {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.storage.feixuemrfz;
				},
			},
			init: function (player) {
				player.storage.feixuemrfz = 0;
			},
			onremove: true,
			audio: 4,
			trigger: { player: ["loseHpEnd", "damageEnd"] },
			async content(event, trigger, player) {
				// step 0
				event.num = trigger.num;

				// step 1 & 2 loop (original event.goto(1))
				while (event.num > 0) {
					// step 1
					event.num--;
					const card = get.cardPile2(c => {
						return get.name(c) === "sha" && c.nature === "fire";
					});
					if (card) {
						await player.gain(card, "gain2", "log");
					} else {
						await player.draw();
					}

					// step 2
					if (trigger.source && trigger.source.countCards("e") > 0) {
						player.storage.feixuemrfz += 1;
						const next = player.discardPlayerCard(trigger.source, "e", false).set("forceAuto", true);
						next.boolline = true;
						await next;
					}
				}
			},
			group: "feixuemrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.feixuemrfz = 0;
					},
				},
			},
			ai: {
				expose: 0.1,
				threaten: 0.8,
			},
		},
	"hualaomrfz": {
			marktext: "脆弱",
			intro: {
				name: "脆弱",
				content: "下次受到的伤害+#",
			},
			audio: 2,
			trigger: { source: "damageBegin" },
			filter: function (event, player) {
				return event.player != player;
			},
			check: function (event, player) {
				if (get.attitude(player, event.player) > 0) return false;
				if (event.num + event.player.countMark("hualaomrfz") - event.player.hp >= 0) return false;
				return true;
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				target.addMark("hualaomrfz", trigger.num + 1, false);
				target.addSkill("hualaomrfz_eff");
				trigger.num = 0;
			},
			subSkill: {
				eff: {
					trigger: { player: "damageBegin2" },
					filter: function (event, player) {
						return player.hasMark("hualaomrfz");
					},
					charlotte: true,
					direct: true,
					async content(event, trigger, player) {
						trigger.num += player.countMark("hualaomrfz");
						player.removeMark("hualaomrfz", player.countMark("hualaomrfz"), false);
						//@ts-ignore
						player.logSkill("hualaomrfz");
					},
				},
			},
			ai: {
				expose: 0.1,
				threaten: 1.2,
			},
		},
	"huhuomrfz": {
			intro: {
				content: "摸牌阶段摸牌数-#,出牌阶段结束时摸#张牌",
			},
			audio: 2,
			trigger: { source: "damageZero" },
			async content(event, trigger, player) {
				trigger.player.addMark("huhuomrfz", 1, false);
				trigger.player.addSkill("huhuomrfz2");
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("huhuomrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("huhuomrfz", player.countMark("huhuomrfz"), false);
						trigger.player.removeSkill("huhuomrfz2");
					},
				},
			},
		},
	"huhuomrfz2": {
			direct: true,
			charlotte: true,
			trigger: { player: "phaseDrawBegin2" },
			async content(event, trigger, player) {
				trigger.num -= player.countMark("huhuomrfz");
			},
			group: ["huhuomrfz2_draw", "huhuomrfz_clear"],
			subSkill: {
				draw: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseUseEnd" },
					async content(event, trigger, player) {
						player.draw(player.countMark("huhuomrfz"));
					},
				},
			},
		},
	"lichangmrfz2": {
			charlotte: true,
		},
	"xinkuangyumrfz": {
			audio: "kuangyumrfz",
			trigger: {
				player: "useCard2",
			},
			filter(event, player) {
				//@ts-ignore
				if (get.type(event.card) == "delay" || get.type(event.card) == "equip") return false;
				return game.hasPlayer(function (target) {
					if (event.targets.includes(target)) return false;
					if (!player.canUse(event.card, target)) return false;
					return true;
				});
			},
			async cost(event, trigger, player) {
				if (event.result) event.result = {};
				event.result = await player
					.chooseTarget(get.prompt2("xinkuangyumrfz"), [1, Infinity], function (card, player, target) {
						var cardx = _status.event.cardx;
						if (!player.canUse(cardx, target)) return false;
						var targets = _status.event.targets.slice(0).concat(ui.selected.targets);
						if (targets.includes(target)) return false;
						return true;
					})
					.set("promptbar", "none")
					.set("cardx", trigger.card)
					.set("targets", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.cardx, player, player);
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const targets = event.targets;
				if (!player.storage.xinkuangyumrfz_trigger) player.storage.xinkuangyumrfz_trigger = [];
				player.storage.xinkuangyumrfz_trigger.add(trigger.card);
				trigger.targets.addArray(targets);
				player.addTempSkill("xinkuangyumrfz_trigger");
			},
			subSkill: {
				trigger: {
					trigger: {
						player: ["shaMiss", "eventNeutralized"],
					},
					charlotte: true,
					silent: true,
					filter(event, player) {
						return player.storage.xinkuangyumrfz_trigger && player.storage.xinkuangyumrfz_trigger.includes(event.card);
					},
					content() {
						trigger.getParent().excluded.addArray(trigger.getParent().targets);
					},
					group: "xinkuangyumrfz_remove",
				},
				remove: {
					trigger: {
						player: ["useCardAfter", "useCardCancelled"],
					},
					silent: true,
					charlotte: true,
					filter: function (event, player) {
						return player.storage.xinkuangyumrfz_trigger && player.storage.xinkuangyumrfz_trigger.includes(event.card);
					},
					content: function () {
						player.storage.xinkuangyumrfz_trigger.remove(trigger.card);
					},
				},
			},
		},
	"xinchuanzhongmrfz": {
			audio: "chuangzhongmrfz",
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter(event, player) {
				return player.storage.xinchuanzhongmrfz_mark && player.storage.xinchuanzhongmrfz_mark.length > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				let nums = player.storage.xinchuanzhongmrfz_mark.length;
				const indexs = [];
				while (nums > 0) {
					let list = Array.from({ length: nums + 1 }, (_, index) => index);
					let prompt = `请为%%%选择一个自然数`;
					if (indexs.length == 0) prompt = prompt.replace("%%%", "X(摸牌数)");
					else if (indexs.length == 1) prompt = prompt.replace("%%%", "Y(额外使用杀)");
					else if (indexs.length == 2) prompt = prompt.replace("%%%", "Z(计算与其他角色的距离)");
					const { result } = await player
						.chooseControl(list)
						.set("prompt", prompt)
						.set("ai", () => {
							let player = get.player(),
								nums = get.event().nums,
								indexs = get.event().indexs;
							switch (indexs.length) {
								case 0:
									return player.countCards("hs", card => get.tag(card, "damage") > 0 || get.type(card) == "trick") > 1 ? 0 : nums;
								case 1:
									return player.countCards("e", "sha") > 1 ? 1 : 0;
								case 2:
									return game.hasPlayer(current => get.attitude2(current) < 0) ? 0 : nums;
								default:
									return nums;
							}
						})
						.set("nums", nums)
						.set("indexs", indexs);
					nums -= result.index;
					indexs.push(result.index);
				}
				if (indexs[0] && indexs[0] > 0) player.draw(indexs[0]);
				if (indexs[1] && indexs[1] > 0) player.addMark("xinchuanzhongmrfz_sha", indexs[1], false);
				if (indexs[2] && indexs[2] > 0) player.addMark("xinchuanzhongmrfz_distance", indexs[2], false);
				player.addTempSkill("xinchuanzhongmrfz_sha", { player: "phaseEnd" });
				player.addTempSkill("xinchuanzhongmrfz_distance", { player: "phaseEnd" });
			},
			group: "xinchuanzhongmrfz_mark",
			subSkill: {
				distance: {
					onremove: true,
					mod: {
						globalFrom(from, to, distance) {
							return distance - from.countMark("xinchuanzhongmrfz_distance");
						},
					},
				},
				sha: {
					onremove: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + player.countMark("xinchuanzhongmrfz_sha");
						},
					},
				},
				mark: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "phaseEnd",
					},
					async content(event, trigger, player) {
						player.storage.xinchuanzhongmrfz_mark = [];
						player.getHistory("useCard", function (evt) {
							player.storage.xinchuanzhongmrfz_mark.add(get.type2(evt.card));
						});
					},
				},
			},
		},
	"kuanglangmrfz_backup": {
			sourceSkill: "kuanglangmrfz",
			async precontent(event, trigger, player) {
				delete event.result.skill;
				//@ts-ignore
				var cards = event.result.card.cards;
				event.result.cards = cards;
				var owner = get.owner(cards[0]);
				//@ts-ignore
				event.target = owner;
				//@ts-ignore
				owner.$give(cards[0], player, false);
				//@ts-ignore
				player.popup(event.result.card.name, "metal");
				game.delayx();
			},
			filterCard() {
				return false;
			},
			prompt: "114514",
			selectCard: -1,
		},
});

translate({
	"ailinimrfz": "艾丽妮",
	"zhidengmrfz": "执灯",
	"zhidengmrfz_info": "准备阶段，你可以令至多X名体力值不大于你的角色摸一张牌，然后你摸一张牌。（X=你的体力值）",
	"zhidengmrfz2": "执灯",
	"zhidengmrfz2_info": "",
	"shenpanmrfz": "审判",
	"shenpanmrfz_info": "出牌阶段限一次，你可以与一名其他角色拼点，若你赢，则①本回合当其成为你使用的牌的目标时，其需弃置一张牌，然后当此牌进入弃牌堆时，你获得之；②本回合你与其的距离视为1。",
	"shenpanmrfz2": "审判",
	"shenpanmrfz2_info": "",
	"shenpanmrfz3": "审判",
	"shenpanmrfz3_info": "",
	"liechaomrfz": "裂潮",
	"liechaomrfz_info": "当你造成伤害时，若其没有牌，则你可以令此伤害+1。",
	"sujimrfz2": "速记",
	"sujimrfz2_info": "",
	"cuofengmrfz": "挫奋",
	"cuofengmrfz_info": "本局游戏限X次，当你受到伤害时，你可以弃置一张牌，然后你选择令你摸牌阶段额外摸一张牌或结束阶段摸一张牌。（X=你的体力上限-1）",
	"cuofengmrfz_mark1": "挫奋",
	"cuofengmrfz_mark1_info": "摸牌",
	"cuofengmrfz_mark2": "挫奋",
	"cuofengmrfz_mark2_info": "结束",
	"chengzhimrfz": "承志",
	"chengzhimrfz_info": "觉醒技，准备阶段，若你发动“挫奋”的次数等于你的体力上限-1，则你减少一点体力上限并获得“逐志”。",
	"zhuzhimrfz": "逐志",
	"zhuzhimrfz_info": "准备阶段，你可以受到一点火焰伤害（若体力值为1则改为弃置一张牌）并摸X/2（向下取整）张牌，本回合你获得以下效果：①手牌上限+X；②你使用【杀】次数的基数改为X。（X=你发动“挫奋”的次数）",
	"zhuzhimrfz_mark": "逐志",
	"zhuzhimrfz_mark_info": "",
	"moucunmrfz": "谋存",
	"moucunmrfz_info": "每轮开始时，你可以选择一名与你势力不同的角色，你须交给其一至两张牌，然后本轮当其出牌阶段结束时，你摸X张牌，若其使用了三种类型的牌，则你令【鹰视】中的X+1（X=其本回合使用的牌的类型数+你本轮交给该角色的牌的数量）",
	"moucunmrfz2": "谋存",
	"moucunmrfz2_info": "",
	"moucunmrfz3": "谋存",
	"moucunmrfz3_info": "",
	"yingshimrfz": "鹰视",
	"yingshimrfz_info": "出牌阶段限一次，你可以观看一名角色的手牌，然后你获得其中的X张牌。（X=0）",
	"siyongmrfz2": "思涌",
	"siyongmrfz2_info": "",
	"yijianmrfz": "毅坚",
	"yijianmrfz_info": "锁定技，每回合第一次受到的伤害-1。",
	"yijianmrfz2": "毅坚",
	"yijianmrfz2_info": "",
	"weiguangmrfz": "微光",
	"weiguangmrfz_info": "锁定技，拥有“火光”标记的角色获得如下效果：1.摸牌阶段摸牌数、出牌阶段使用【杀】的次数、手牌上限各+1；2.结束阶段，将手牌补至手牌上限（至多为5）并失去一个“火光”标记；锁定技，准备阶段，若你没有“火光”标记，你获得一个“火光”标记；出牌阶段限一次，你可以对自己造成一点伤害，然后令一名角色获得一个“火光”标记,若该角色为你，你流失一点体力。",
	"weiguangmrfz_mark": "微光",
	"weiguangmrfz_mark_info": "",
	"weiguangmrfz_losemark": "微光",
	"weiguangmrfz_losemark_info": "",
	"weiguangmrfz2": "微光",
	"weiguangmrfz2_info": "",
	"zhidianmrfz": "执典",
	"zhidianmrfz_info": "锁定技，每轮开始时，你声明一张牌，然后若有角色使用了你声明的牌，其需交给你一张牌或流失一点体力，若该角色是你，则改为弃置一张牌（没牌则不弃）。",
	"zhidianmrfz_use": "执典",
	"zhidianmrfz_use_info": "",
	"pijimrfz": "披棘",
	"pijimrfz_info": "锁定技，当其他角色对你造成伤害时，你对伤害来源造成X点伤害。（X=你已损失体力值，X∈[1，2]）",
	"dianyongmrfz": "电涌",
	"dianyongmrfz_info": "出牌阶段开始时，若场上有四个“浮标”，你可以移除所有的“浮标”，然后将等量依次个“浮标”分配给任意名角色，然后你获得以下效果直到回合结束：1.当你使用【杀】或单一目标的非延时锦囊牌（【无中生有】除外）选择目标后，你可以令任意名有“浮标”的角色成为此牌的目标，然后若此牌是【杀】，则你移除场上的一个“浮标”标记；2.你对有“浮标”的角色使用【杀】无次数限制。",
	"fuxiemrfz": "浮械",
	"fuxiemrfz_info": "①锁定技，游戏开始时，你获得两个“浮标”；你的手牌上限+X。（X=你的“浮标”数）；你对有‘浮标’的角色使用牌无距离限制；你对有“浮标”的其他角色造成的伤害均视为雷属性伤害。</br>②出牌阶段，当一名其他角色成为你使用牌的唯一目标时，你可以失去一个“浮标”并令其获得一个“浮标”。</br>③出牌阶段，若场上“浮标”总数不超过3，你可以弃置一张♦的牌，然后获得一个“浮标”。",
	"qianximrfz": "迁徙",
	"qianximrfz_info": "锁定技，游戏开始时，你至多获得场上武将的两个技能。",
	"qianximrfz_ban": "禁止复制武将",
	"qianximrfz_ban_info": "可在设置中开启或关闭禁用武将</br>阿米娅、保存者",
	"geyaomrfz": "歌谣",
	"geyaomrfz_info": "准备阶段，你可以展示牌堆顶一张牌并获得之，根据牌的类别你获得如下效果直到回合结束：1.基本牌：当你使用【杀】指定目标后，你可以观看其手牌并获得与此杀颜色不同的牌；2.锦囊牌：你使用得【杀】不可响应；3.装备牌：你使用的【杀】无距离限制且可指定任意个目标。",
	"geyaomrfz_e": "歌谣",
	"geyaomrfz_e_info": "",
	"geyaomrfz_t": "歌谣",
	"geyaomrfz_t_info": "",
	"geyaomrfz_b": "歌谣",
	"geyaomrfz_b_info": "",
	"zhangenmrfz": "斩根",
	"zhangenmrfz_info": "出牌阶段，当你使用的【杀】造成伤害后，你可以弃置一张手牌令此杀不计入次数限制。",
	"xunlumrfz": "寻路",
	"xunlumrfz_info": "锁定技，摸牌阶段，你改为随机摸<span class=thundertext>1</span>至6张牌；准备阶段，你将本回合出牌阶段使用【杀】的次数随机改为<span class=firetext>0</span>至5次；你的手牌上限随机改为<span class=greentext>3</span>至8张。当你造成伤害时，你可以令一个有颜色的数字+1。（有颜色的数字的最大值至多为4，且本技能中的随机生成的随机数均符合正态分布）",
	"xunlumrfz_rewirte": "寻路·修改",
	"xunlumrfz_rewirte_info": "锁定技，摸牌阶段，你改为随机摸<span class=thundertext>1</span>至6张牌；准备阶段，你将本回合出牌阶段使用【杀】的次数随机改为<span class=firetext>0</span>至5次；你的手牌上限随机改为<span class=greentext>3</span>至8张。当你造成伤害时，你可以令一个有颜色的数字+1。（有颜色的数字的最大值至多为4，且本技能中的随机生成的随机数小于区间均值的概率降低）",
	"zhuguangmrfz2": "逐光",
	"zhuguangmrfz3": "逐光",
	"zhuangtimrfz": "壮体",
	"zhuangtimrfz_info": "①锁定技，每当你累计造成两点伤害，你增加一点体力上限（体力上限至多为15）。②出牌阶段限一次，你可以减少一点体力上限，视为使用一张基本牌或普通锦囊牌。",
	"julimrfz": "巨力",
	"julimrfz_info": "当你造成伤害时，若该角色的体力值不大于你已损失的体力值，则你可以令此伤害+1，若你的体力上限不小于该角色牌数之和，则你可失去2点体力上限，令此伤害再+1。",
	"xunxiangmrfz": "寻相",
	"xunxiangmrfz_info": "出牌阶段限一次，你随机声明一种类型的牌，然后你令所有角色各展示一张手牌，然后你摸X张牌，若你没有因此摸牌，你选择与一名其他角色各流失一点体力，然后将此技能于此出牌阶段内修改为出牌阶段限两次。（X=与你声明的牌类型相同的牌）",
	"ronghangmrfz": "戎行",
	"ronghangmrfz_info": "锁定技，当你使用的带有伤害类标签的牌时，若此牌的牌名字数大于你上一张使用的牌，此牌伤害基数+1，反之，此牌不可响应且不计入次数限制。",
	"jingsimrfz": "警司",
	"jingsimrfz_info": "当你使用牌时，若你没有使用过该牌名的牌，你可以摸一张牌。",
	"banruomrfz": "般若",
	"banruomrfz_info": "锁定技，①游戏开始时，你获得以下效果直到你造成了伤害或游戏轮次大于你的体力上限：1.摸牌阶段，你的摸牌数-1；2.当你受到伤害时，你可以取消之；3.你的手牌上限为你的体力上限。②当你首次造成伤害后，你本回合：1.你使用【杀】的次数+1；2.下次造成的伤害+1。",
	"banruomrfz2": "般若",
	"yizhongmrfz": "义重",
	"yizhongmrfz_info": "当一名其他角色受到伤害时，若你至该角色的距离为1，你可以弃置一张牌，令此伤害取消之，然后你受到等量的伤害，若你因此受到伤害，你可以摸两张牌。",
	"nanjiaomrfz": "难交",
	"nanjiaomrfz_info": "锁定技，每轮开始时，若你的手牌上限是场上角色中最多的，你的手牌上限-X，场上手牌上限最少或之一的角色手牌上限+X，反之，你的手牌上限+X，场上手牌上限最多的其他角色手牌上限-X。（X=场上手牌上限最多的角色的手牌上限的一半，向下取整；上述效果持续一轮）",
	"lvwaimrfz": "律外",
	"lvwaimrfz_info": "限定技，出牌阶段，你可以视为使用一张不可响应的杀（无距离限制），然后你回复X点体力，摸X张牌且本回合【述难②】失效。（X=因此【杀】造成的伤害）",
	"chaoshengmrfz": "潮声",
	"chaoshengmrfz_info": "结束阶段，若你连续<span class=thundertext>3</span>个回合没有造成过伤害，你可以选择摸两张牌或回复一点体力。</br><span class=thundertext>【潮声●修改】</span>结束阶段，若你连续<span class=thundertext>3</span>个回合没有造成过伤害，你可以摸两张牌并回复一点体力。",
	"jianshumrfz": "剑术",
	"jianshumrfz_info": "锁定技，每当你使用的牌指定的目标数累计达到5的整数倍时，你依次执行下列选项：①【潮声】中带颜色的数值-1；摸牌阶段摸牌数，【杀】的使用次数和攻击距离各+1。②出牌阶段开始时，你可以视为使用一张【杀】（不计入次数）；【杀】的使用次数和攻击距离各+1。③【潮声】中带颜色的数值-1；修改【潮声】",
	"qiulongmrfz": "囚笼",
	"qiulongmrfz_info": "每轮开始时，你可以选择一名其他角色，令其获得‘笼’标记；锁定技，当有‘笼’的角色受到伤害后，其恢复等量体力，然后你受到等量无伤害来源的伤害并获得两倍伤害值的‘幻’标记。",
	"bihumrfz": "庇护",
	"bihumrfz_info": "锁定技，当你受到属性伤害时，取消之；当你受到有来源的伤害时，你获得等量的‘幻’。",
	"shengyumrfz": "圣域",
	"shengyumrfz_info": "每四轮限一次，出牌阶段，你可以选择至多3名角色令其获得【破笼】直到你发动此技能后的第三轮结束，然后你恢复两点体力。",
	"polongmrfz": "破笼",
	"polongmrfz_info": "你可以按照如下规则使用场上的‘幻’：①出牌阶段限三次，你可以移除一个‘幻’，摸一张牌；②出牌阶段限三次，你可以移除一个‘幻’，恢复一点体力；③当你受到伤害时，你可以移除一个‘幻’，令此伤害-1。",
	"yingkuimrfza": "盈亏",
	"danpaomrfz": "氮炮",
	"danpaomrfz_info": "整局游戏限两次，出牌阶段限一次，你可以弃置所有的手牌（没有手牌则改为弃置所有的牌），选择一名其他角色并对其造成一点伤害，若你有‘蓄水’标记，则你于此技能结算完毕后移除之，然后直到其回合结束：其计算与其他角色的距离+<span class=thundertext>2</span>；其每累计使用<span class=firetext>两</span>张牌时，你对其造成一点伤害。",
	"shuipaomrfz": "水炮",
	"shuipaomrfz_info": "①锁定技，当你不因【氮炮】而对其他角色造成伤害时，直到其回合结束其计算与其他角色的距离+1（不可叠加，若你有‘蓄水’标记，则改为+2）。②锁定技，当你你不因【氮炮】而造成伤害时，若你装备区有武器牌，则你本轮获得‘蓄水’标记；当你有‘蓄水’标记时，【氮炮】中蓝色数字翻倍，红色数字-1。",
	"jiepimrfz": "洁癖",
	"jiepimrfz_info": "锁定技，其他角色不能弃置你装备区的牌；你的回合内，其他角色装备区的牌不能被弃置。",
	"juntongmrfz": "军统",
	"juntongmrfz_info": "①锁定技 ，你跳过判定阶段和摸牌阶段，你的手牌上限－1，你每轮开始时摸三张牌。②你使用【杀】选择目标后，可以进行一次判定，若为：♦，此杀不记入次数；♥，此杀可额外指定一个目标（目标必须合法）；♠：摸一张牌。",
	"pochengmrfz": "破城",
	"pochengmrfz_info": "每三轮限一次，出牌阶段当你使用【杀】且本轮不为第一轮时，你可以令此【杀】额外结算两次，然后你跳过出牌阶段且本回合手牌上限+1。",
	"jixiongxmrfz": "符纸",
	"fanzhongmrfz2": "紊乱",
	"jinghuamrfz2": "镜花",
	"yongwomrfz": "拥我",
	"yongwomrfz_info": "①锁定技，当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1。当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。②锁定技，当你翻面至正面朝上时，你摸两张牌。",
	"juximrfz2": "锯袭",
	"gongzhenmrfz": "共振",
	"gongzhenmrfz_info": "锁定技，出牌阶段，当你使用或打出非转换且非虚拟牌后，若你的手牌中没有与你使用或打出的牌花色相同的牌时，你摸一张牌，反之你弃置一张手牌。",
	"mengxiangmrfz": "梦想",
	"mengxiangmrfz_info": "锁定技，出牌阶段限X次，你使用或打出的下一张牌无距离和次数限制。(X=本回合你因【共振】而摸牌的次数/2，向下取整)",
	"paizhangmrfz": "排障",
	"paizhangmrfz_info": "①当你因【共振】弃置的牌进入弃牌堆后，你可以将此牌交给一名其他角色，[当该角色使用此牌/使用牌指定你为目标后]，[若此牌/因【共振】获得的牌的]点数大于8、没有点数或牌的数量大于1，其受到一点伤害，反之，其须弃置此牌点数除以3(向下取整)张牌，然后其使用的此牌无效，若该角色手牌中有你交给其的牌，将其置入弃牌堆，若其上家或下家手牌中有因【排障①】而获得的牌，其弃置因【排障①】而获得的牌，然后若其因【共振】获得的牌的点数大于8、没有点数或因【共振】获得的牌的数量大于1，受到一点伤害，反之，其须弃置此牌点数除以3(向下取整)张牌。②锁定技，其他角色不能弃置你因【排障①】交给其的牌。",
	"lieshimrfz": "猎矢",
	"lieshimrfz_info": "每回合限三次，当你使用【杀】指定唯一目标时，你可以弃置一张牌并视为对该角色距离为1的其他角色使用一张【杀】。",
	"luanwumrfza": "乱舞",
	"kaiyuanmrfz": "源流",
	"kaiyuanmrfz_info": "锁定技，第一轮游戏开始时，你令一名角色摸两张牌且其本局游戏使用【杀】的次数+1，若该角色为你，你额外摸一张牌。",
	"jingshuimrfz": "净水",
	"jingshuimrfz_info": "每轮开始时，你可以选择一名其他角色，将你的手牌补至与其一致并将你的手牌上限、攻击距离和使用【杀】的次数调整至与其一致。",
	"liuxingmrfz": "流形",
	"liuxingmrfz_info": "锁定技，每回合限一次，当你受到非雷属性伤害时，若你的手牌不小于你的体力值，取消之。",
	"yiyinmrfz": "倚音",
	"yiyinmrfz_info": "①蓄力技（1/3），出牌阶段，你可以弃置一张带有伤害类标签的牌，然后增加一点蓄力值。②当你使用【杀】的时，你可以消耗一点蓄力值并令此【杀】的伤害基数+1。",
	"huangxiangmrfz": "荒响",
	"huangxiangmrfz_info": "弃牌阶段结束时，你可以减少一点蓄力值，然后标记一张手牌，此牌称之为‘残影’；当你失去‘残影’或当你受到伤害且手牌中有‘残影’时，你可以选择一项：①增加一点蓄力值并摸一张牌，若你手牌中没有‘残影’，你可以消耗一点蓄力值并将一张牌标记为‘残影’；②对上一名对你使用过牌的其他角色造成一点伤害。",
	"jiyinmrfz": "寂音",
	"jiyinmrfz_info": "出牌阶段开始时，若你的蓄力值不为0，你可以令你本回合使用的单一目标的【杀】需要X张【闪】才可抵消且伤害基数改为Y，然后你本回合获得如下效果：①每当你使用的【杀】造成一点伤害时，你失去一点蓄力值；②你使用的【杀】只能指定满足下列条件中的任意个的角色：1.体力值最大或之一；2.手牌数最多或之一；3.装备区牌最多或之一，若均满足，则Y改为目标角色的体力值；③【倚音②】失效。（X=你使用【杀】的目标的体力值；Y=你使用【杀】的目标的体力值-1和你的蓄力值两者的最小值，Y至少为1）",
	"renbenmrfz2": "人本",
	"renbenmrfz3": "人本",
	"dizhumrfzx": "夜灯",
	"fuyuanmrfz": "复元",
	"fuyuanmrfz_info": "锁定技，当一名其他角色因你回复体力时，其摸一张牌。",
	"gaihuamrfz": "钙化",
	"gaihuamrfz_info": "当你攻击范围内有其他角色受到属性伤害时，你可以弃置一张与造成伤害的牌类型不同的牌，然后此伤害+1。",
	"yaopeimrfz": "药配",
	"yaopeimrfz_info": "出牌阶段限一次，若你本阶段还剩余使用【杀】的次数，你可以弃置一张牌并使你本回合使用【杀】的次数-1，然后选择以下一个选项：①选择一名与你距离为1点角色，令其回复一点体力，若其已损失的体力值大于等于3，额外为其回复一点体力；②令在你攻击范围内的角色各回复一点体力。",
	"minghuomrfz": "命火",
	"minghuomrfz_info": "准备阶段，你可以选择获得一个效果直到你的下个准备阶段：①每回合当你使用的第一张单一目标的普通锦囊或【杀】选择目标后，你可以额外指定一个目标；②当有‘灼痕’标记的角色进入濒死状态时，你可以令其上家或下家（不能是你）获得一个‘灼痕’标记，然后其弃置一张手牌。",
	"yingyaomrfz": "映耀",
	"yingyaomrfz_info": "每轮限X次，当你对其他角色造成伤害后，你可以选择你攻击范围内的角色或者你，然后令其回复一点体力，若该角色为你，你摸一张牌。（X=场上的‘灼痕’标记数）",
	"zhuohenmrfz": "灼痕",
	"zhuohenmrfz_info": "①每名角色每回合限一次，当你使用牌指定一名其他角色为目标后，你可以使其获得一个‘灼痕’标记（每名角色最多拥有一个‘灼痕’标记）并令其弃置一张手牌。②锁定技，拥有‘灼痕’标记的角色获得如下效果：手牌上限-1，受到伤害时需弃置一张手牌，回合结束时移除‘灼痕’标记；你的手牌上限+X；有‘灼痕’的角色回合开始时，若你的手牌数不是全场最多或之一，你摸一张牌。（X=场上有的‘灼痕’标记数）",
	"chuangzhongmrfz": "传终",
	"chuangzhongmrfz_info": "锁定技，当你使用的牌指定目标后，若该角色有‘风起’标志，则其本回合所有非锁定技失效；拥有‘风起’标记的角色手牌上限为-X（X=其体力值）。",
	"kuangyumrfz": "狂语",
	"kuangyumrfz_info": "每回合每名角色限一次，当你使用单一目标的普通锦囊牌或【杀】指定其他角色为目标后，若该角色没有‘风起’标志，你可以使其获得一个“风起”标记（持续到其回合结束），且令其下回合随机跳过两个阶段，若该角色在你的攻击范围内，其于此牌结算完成之前，你对有‘风起’标记的角色造成的伤害+1，然后若对其造成了伤害，你修改【狂语】直到下一轮开始。",
	"kuangyumrfz_rewirte": "修改·狂语",
	"kuangyumrfz_rewirte_info": "每回合每名角色限一次，当你使用单一目标的锦囊牌指定其他角色为目标后，若该角色没有‘风起’标志，你可以使其获得一个“风起”标记（持续到其回合结束），且令其下回合随机跳过两个阶段，若该角色在你的攻击范围内，其于此牌结算完成之前，你对有‘风起’标记的角色造成的伤害+1。",
	"yanxunmrfz": "严训",
	"yanxunmrfz_info": "①锁定技，你的手牌上限+2；你因【铁锁连环】传导而受到伤害时，此伤害-1；当你于判定阶段受到伤害时，此伤害-2；每轮开始时，若你被横置，取消之。②[弃牌阶段/出牌阶段]开始时，若你的[出牌阶段/摸牌阶段]被跳过,你可以[至多使用两张手牌/摸一张牌];每轮开始时，若武将背面朝上，你可以翻面，然后你跳过你的出牌阶段。",
	"chuchanmrfz": "除颤",
	"chuchanmrfz_info": "锁定技，限定技，当你体力值发生变化后，若你的体力值小于2，你将体力值恢复至两点且本轮当你受到伤害后你回复一点体力。",
	"feixuemrfz": "沸血",
	"feixuemrfz_info": "每当你受到一点伤害或流失一点体力后，你可以从牌堆中获得一张火属性的【杀】（没有则改为摸一张牌），若有伤害来源且伤害来源装备区有牌，你可以弃置伤害来源一张装备区的牌，然后你下回合使用【杀】的次数+1。",
	"hualaomrfz": "画牢",
	"hualaomrfz_info": "当你对其他角色造成伤害时，你可以令此伤害-X，然后其下次受到的伤害+X+1。（X=此次造成的伤害数）",
	"huhuomrfz": "狐火",
	"huhuomrfz_info": "当你造成伤害后，若此次造成的伤害为0，你可以令受伤角色获得以下效果直到其回合结束（效果可叠加）：摸牌阶段摸牌数-1；出牌阶段结束时摸一张牌。",
	"huhuomrfz2": "狐火",
	"xinkuangyumrfz": "狂语",
	"xinkuangyumrfz_info": "当你使用的普通锦囊或【杀】指定目标后，你可以为此牌添加任意名合法目标，然后若此牌被抵消后，取消此牌的所有目标。",
	"xinchuanzhongmrfz": "传终",
	"xinchuanzhongmrfz_info": "锁定技，准备阶段，你声明三个自然数X、Y和Z（X+Y≤你上回合使用的牌的类型数），然后你摸X张牌，本回合使用【杀】的次数+Y且你本回合计算与其他角色的距离-Z。",
});

characterIntro("ailinimrfz", "艾丽妮，前伊比利亚审判官，大审判官达里奥的学生。对伊比利亚历史、律法、人文地理等知识十分了解。在“愚人号”事件后，辞去审判官职务，经凯尔希亲自推荐，现以审判庭信使的身份与罗德岛签订合作协议，为应对来自海洋的威胁而做准备。");
