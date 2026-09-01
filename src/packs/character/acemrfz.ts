import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("acemrfz", { pack: "plotSJZX",
			sex: "male",
			group: "luomrfz",
			hp: 4,
			maxHp: 6,
			skills: ["newsizhanmrfz","ehoumrfz"],
		});

skill({
	"clanzhongliu_keluxiermrfz": {
			//仅用作配音
			audio: 2,
		},
	"sizhanmrfz": {
			audio: 2,
			trigger: { player: "die" },
			forced: true,
			forceDie: true,
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "死战",
			animationColor: "fire",
			init: function (player) {
				player.storage.sizhanmrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.sizhanmrfz;
			},
			async content(event, trigger, player) {
				const targets = game.filterPlayer(function (current) {
					// @ts-ignore
					return current != player && current.isZhu;
				});
				let result = { bool: true, targets: targets };

				if (targets.length > 0) {
					player.awakenSkill("sizhanmrfz");
					targets.forEach(target => {
						target.addSkill("sizhanmrfz2");
						player.storage.sizhanmrfz = true;
					});
				}
			},
		},
	"sizhanmrfz2": {
			trigger: { player: "phaseEnd" },
			forced: true,
			direct: true,
			content: async function (event,trigger,player) {
				for (var i = 0; i < game.dead.length && game.dead[i].name != "acemrfz"; i++);
				var dead = game.dead[i];
				dead.revive(dead.maxHp);
				// @ts-ignore
				event.dead = dead;
				// @ts-ignore
				player.removeSkill("sizhanmrfz2");
				dead.insertPhase();
				dead.addSkill("sizhanmrfz3");
				dead.chat("快走，我来断后！");
			},
		},
	"sizhanmrfz3": {
			trigger: { player: "phaseEnd" },
			forced: true,
			content: function () {
				// @ts-ignore
				player.die()._triggered = null;
			},
			group: ["sizhanmrfz3_draw", "sizhanmrfz3_damage", "sizhanmrfz3_sha"],
			subSkill: {
				draw: {
					trigger: { player: "phaseDrawBegin2" },
					forced: true,
					content: function () {
						// @ts-ignore
						trigger.num += Math.min(game.roundNumber, 5);
					},
				},
				damage: {
					trigger: { source: "damageBegin" },
					forced: true,
					content: function () {
						// @ts-ignore
						trigger.num++;
					},
				},
				sha: {
					mod: {
						// @ts-ignore
						targetInRange: function (card, player, target, now) {
							if (card.name == "sha") return true;
						},
						// @ts-ignore
						cardname: function (card, player) {
							if (["basic"].includes(lib.card[card.name].type)) return "sha";
						},
					},
				},
			},
		},
	"guanyongmrfz": {
			shaRelated: true,
			audio: 2,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				// @ts-ignore
				if (event.getParent().name != "useCard" || player != _status.currentPhase) return false;
				return event.card.name == "sha" && event.target.countDiscardableCards(player, "he") > 0;
			},
			preHidden: true,
			check: function (event, player) {
				return get.attitude(player, event.target) <= 0;
			},
			logTarget: "target",
			async content(event, trigger, player) {
				const result = await player
					.discardPlayerCard(trigger.target, get.prompt("guanyongmrfz", trigger.target), true)
					.set("att", get.attitude(player, trigger.target) <= 0)
					.forResult();

				if (result.bool && result.links && result.links.length) {
					if (get.type(result.links[0], null, result.links[0].original == "h" ? player : false) == "basic") {
						//@ts-ignore
						trigger.getParent().directHit.add(trigger.target);
					} else {
						player.draw(2);
						player.addTempSkill("guanyongmrfz2");
						if (player.countMark("guanyongmrfz2") < 2 || player.storage.sizhanmrfz) {
							player.addMark("guanyongmrfz2", 1, false);
						}
					}
				}
			},
			ai: {
				unequip_ai: true,
				directHit_ai: true,
				// @ts-ignore
				skillTagFilter: function (player, tag, arg) {
					if (tag == "directHit_ai")
						return (
							arg.card.name == "sha" &&
							arg.target.countCards("e", function (card) {
								return get.value(card) > 1;
							}) > 0
						);
					if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
					return false;
				},
			},
		},
	"guanyongmrfz2": {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("guanyongmrfz2");
				},
			},
			onremove: true,
		},
	"shouwangmrfz2": {
			mark: true,
			intro: {
				content: "文明的消亡",
			},
			trigger: { player: "drawAfter" },
			// @ts-ignore
			filter: function (event, player) {
				// @ts-ignore
				return event.getParent().name != "shouwangmrfz_draw";
			},
			// @ts-ignore
			prompt: function (event, player) {
				var target = game.findPlayer(function (current) {
					return current.hasSkill("shouwangmrfz");
				});
				return "是否令" + get.translation(target) + "摸一张牌？";
			},
			// @ts-ignore
			check: function (event, player) {
				var target = game.findPlayer(function (current) {
					return current.hasSkill("shouwangmrfz");
				});
				return get.attitude(player, target) > 0;
			},
			content: function () {
				// @ts-ignore
				player.logSkill("shouwangmrfz");
				// @ts-ignore
				game.countPlayer(function (current) {
					if (current.hasSkill("shouwangmrfz")) current.draw();
				});
			},
		},
	"juhuomrfz": {
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				if (player.hasSkill("juhuomrfz_ban")) return false;
				return (
					event.card &&
					get.tag(event.card, "damage") > 0 &&
					game.hasPlayer2(current => {
						return current.hasHistory("damage", evt => {
							return event.card == evt.card;
						});
					})
				);
			},
			prompt2: function (event, player) {
				var num = player.getHistory("sourceDamage", function (evt) {
					// @ts-ignore
					return evt.card == event.card;
				}).length;
				// @ts-ignore
				var num2 = event.card.number;
				return (
					"【聚火】:是否增加" +
					num +
					"点体力上限（此牌点数<span class=firetext>" +
					(player.hp < num2 ? "大于" : "不大于") +
					"</span>你的体力值）"
				);
			},
			async content(event, trigger, player) {
				var num = player.getHistory("sourceDamage", function (evt) {
					return evt.card == trigger.card;
				}).length;
				await player.gainMaxHp(num);

				var num2 = trigger.card.number;
				if (num2 > player.hp) {
					// @ts-ignore
					player.drawTo(player.maxHp);
				} else {
					player.loseMaxHp(player.maxHp - num2);
					player.recoverTo(player.maxHp);
				}
				player.addTempSkill("juhuomrfz_ban", { global: "phaseEnd" });
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
	"xuehengmrfz": {
			mode: ["identity"],
			forced: true,
			skillAnimation: true,
			animationColor: "thunder",
			unique: true,
			juexingji: true,
			derivation: ["shihunmrfz", "hantianmrfz"],
			trigger: { player: "phaseBegin" },
			// @ts-ignore
			filter: function (event, player) {
				// @ts-ignore
				return player.maxHp > game.countPlayer();
			},
			async content(event, trigger, player) {
				player.awakenSkill("xuehengmrfz");
				await player.removeSkill("juhuomrfz");

				var hasfriendDeath = function (player, identity) {
					var bool = false;
					if (identity == "zhu") identity = "zhong";
					for (var i of game.players) {
						if (!game.dead.includes(i)) continue;
						if (identity == "zhu" && i.identity == "zhong") bool = true;
						if (identity == i.identity) bool = true;
					}
					return bool;
				};

				var dead = hasfriendDeath(player, player.identity);
				if (player.countCards("h") > player.hp && dead == false) {
					player.addSkill("hantianmrfz");
				} else {
					player.node.name.innerHTML = "塔露拉？";
					//@ts-ignore
					game.broadcastAll(function (player, shown) {
						var identity = player.identity;
						if (identity != "zhu") {
							player.identity = "nei";
							if (player == game.me) {
								player.setIdentity();
							}
						} else {
							for (var i of game.players) {
								if (player == i) continue;
								if (i.identity == "fan") continue;
								i.identity = "fan";
								i.setIdentity();
							}
						}
						// @ts-ignore
					}, player);
					player.addSkill("shihunmrfz");
				}
				player.recoverTo(player.maxHp);
			},
		},
	"shihunmrfz": {
			mod: {
				// @ts-ignore
				cardUsable: function (card, player, num) {
					return Infinity;
				},
			},
			forced: true,
			trigger: { player: "phaseZhunbeiBegin" },
			content: function () {
				for (var i of game.players) {
					// @ts-ignore
					player.line(i);
					i.damage(2, "fire");
				}
			},
			ai: {
				threaten: 3,
			},
			group: ["shihunmrfz_onedamage", "shihunmrfz_draw"],
			subSkill: {
				draw: {
					forced: true,
					trigger: { player: "phaseJieshuBegin" },
					// @ts-ignore
					filter: function (event, player) {
						return game.dead.length > 0;
					},
					content: function () {
						// @ts-ignore
						player.draw(game.dead.length);
					},
					ai: {
						threaten: function () {
							return Math.max(game.dead.length, 1.5);
						},
					},
				},
				onedamage: {
					forced: true,
					trigger: { player: "damageBegin4" },
					// @ts-ignore
					filter: function (event, player) {
						return event.num > 1;
					},
					content: function () {
						// @ts-ignore
						trigger.num = 1;
					},
				},
			},
		},
	"hantianmrfz": {
			marktext: "志城",
			intro: {
				name: "志城",
				content: "众志成城",
			},
			trigger: { player: "phaseZhunbeiBegin" },
			// @ts-ignore
			filter: function (event, player) {
				return !game.hasPlayer(current => {
					return current.hasMark("hantianmrfz");
				});
			},
			forced: true,
			async content(event, trigger, player) {
				for (var i of game.players) {
					if (player.identity == "nei" && i == player) i.addMark("hantianmrfz");
					if ((player.identity == "zhu" && i.identity == "zhong") || (player.identity == "zhong" && i.identity == "zhu")) {
						i.addMark("hantianmrfz");
					}
					if (player.identity == i.identity) i.addMark("hantianmrfz");
				}
				("step 1");
				var targets = game.filterPlayer(current => {
					return current.hasMark("hantianmrfz");
				});
				var num = 0;
				for (let i = 0; i < targets.length; i++) {
					var maxhp = targets[i].maxHp;
					if (maxhp > num) num = maxhp;
				}
				for (var i of targets) {
					i.gainMaxHp(num - i.maxHp);
				}

				var targets = game.filterPlayer(current => {
					return current.hasMark("hantianmrfz");
				});
				for (var i of targets) {
					i.recoverTo(player.maxHp);
				}
			},
			group: ["hantianmrfz_sha"],
			subSkill: {
				ban: {
					charlotte: true,
				},
				sha: {
					trigger: { global: "useCardAfter" },
					filter: function (event, player) {
						if (player.hasSkill("hantianmrfz_ban") || event.card.name != "sha" || !event.targets.length) return false;
						// @ts-ignore
						if (event.getParent(2).name == "hantianmrfz_sha") return false;
						if (!event.player.hasMark("hantianmrfz")) return false;
						var list = game.filterPlayer(current => {
								return current.hasMark("hantianmrfz");
							}),
							targets = event.targets;
						for (var i of list) {
							for (var j of targets) {
								if (i == event.player || !i.isIn()) continue;
								if (!i.canUse("sha", j, false)) continue;
								if (_status.connectMode && i.countCards("hs") > 0) return true;
								if (i.hasSha()) return true;
							}
						}
						return false;
					},
					forced: true,
					popup: false,
					charlotte: true,
					async content(event, trigger, player) {
						let result;

						// step 0
						event.sources = game
							.filterPlayer(current => {
								return current.hasMark("hantianmrfz") && current !== trigger.player;
							})
							.sortBySeat();
						event.targets = trigger.targets;

						// step 1 & 2 loop (original event.goto(1))
						while (event.sources.length > 0) {
							const current = event.sources.shift();
							const targets = [];
							event.draw = current;
							for (const target of event.targets) {
								if (!target.isIn()) continue;
								if (!current.canUse("sha", target, false)) continue;
								targets.push(target);
							}

							if (current.isIn() && (_status.connectMode || current.hasSha())) {
								result = await current
									.chooseToUse(
										function (card, player, event) {
											if (get.name(card) !== "sha") return false;
											//@ts-ignore
											return lib.filter.filterCard.apply(this, arguments);
										},
										"【熯天】：是否对" + get.translation(targets) + "使用一张杀？"
									)
									.set("targetRequired", true)
									.set("complexSelect", true)
									.set("filterTarget", function (card, player, target) {
										if (!_status.event.sourcex.includes(target)) return false;
										//@ts-ignore
										return lib.filter.targetEnabled.apply(this, arguments);
									})
									.set("sourcex", targets)
									.set("logSkill", "hantianmrfz")
									.set("addCount", false)
									.forResult();
							}

							// step 2
							if (result?.bool) {
								await event.draw.draw();
							}
						}
					},
				},
			},
		},
	"bianyimrfz": {
			audio: 4,
			trigger: {
				global: "roundStart",
				source: "damageEnd",
			},
			GetAllSkills(player) {
				var list = {};
				var ownSkills = get.translation(player.getSkills(true, false, false));
				for (var key in lib.character) {
					if (!lib.character[key][3]) continue;
					var skills = lib.character[key][3];
					for (var i of skills) {
						if (!lib.translate[i]) continue;
						if (ownSkills.includes(lib.translate[i])) continue;
						list[i] = lib.translate[i];
					}
				}
				return list;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				// 一些函数

				// 随机获取任意个键值
				function getRandomKeys(obj, num) {
					var keys = Object.keys(obj);
					var selectedKeys = [];
					var i;
					for (i = 0; i < num; i++) {
						var randomIndex = Math.floor(Math.random() * keys.length);
						selectedKeys.push(keys[randomIndex]);
						keys.splice(randomIndex, 1);
					}
					return selectedKeys;
				}
				// 获取不重复的中文字符
				function extractChineseCharacters(arr) {
					var chineseRegex = /[\u4e00-\u9fa5]/g;
					var chineseSet = new Set();

					arr.forEach(function (str) {
						var chineseChars = str.match(chineseRegex);
						if (chineseChars) {
							chineseChars.forEach(function (char) {
								chineseSet.add(char);
							});
						}
					});
					return Array.from(chineseSet);
				}

				// 随机从数组中获取元素
				function getRandomElements(arr, num) {
					var result = [];
					var len = arr.length;
					var indices = [];

					for (var i = 0; i < len; i++) {
						indices.push(i);
					}

					for (var j = 0; j < num; j++) {
						var randomIndex = Math.floor(Math.random() * indices.length);
						var index = indices[randomIndex];
						result.push(arr[index]);
						indices.splice(randomIndex, 1);
					}
					return result;
				}

				// 检查存在的技能
				function findWordCombinations(arrA, arrB) {
					var combinations = [];

					for (var i = 0; i < arrB.length - 1; i++) {
						for (var j = i + 1; j < arrB.length; j++) {
							var word1 = arrB[i] + arrB[j];
							var word2 = arrB[j] + arrB[i];
							// console.log(word1, word2);
							if (arrA.includes(word1)) {
								combinations.push(word1);
							}
							if (arrA.includes(word2)) {
								combinations.push(word2);
							}
						}
					}
					return combinations;
				}

				// 通过值找键
				function findKeysByValue(obj, value) {
					var keys = [];
					for (var key in obj) {
						if (obj[key] && obj[key] === value) {
							keys.push(key);
						}
					}
					if (keys.length == 0) return null;
					return keys;
				}

				// ai自动选择
				function autoChoose(list, findWord) {
					var index = [];
					var list = list.map(i => i[1]);
					var findWord = findWord.randomGet();
					for (var i of findWord) {
						for (var j = 0; j < list.length; j++) {
							if (i != list[j]) continue;
							index.push(j);
						}
					}
					return index;
				}

				// 获取完全没法组成技能的汉字
				function getCannotCharacters(arr, skills) {
					var index = [];
					var list = arr.map(i => i[1]);
					for (var name of skills) {
						for (var j of name) {
							for (var k = 0; k < list.length; k++) {
								if (j != list[k]) continue;
								index.push(k);
							}
						}
					}
					return index;
				}

				//技能部分
				var allCNSkills = [],
					ENSkills = lib.skill.bianyimrfz.GetAllSkills(player);
				for (var key in ENSkills) {
					allCNSkills.push(ENSkills[key]);
				}
				// 性能挑战（划掉）
				while (true) {
					var skillsList = getRandomKeys(lib.skill.bianyimrfz.GetAllSkills(player), 100);
					var CNSkills = [];
					for (var i of skillsList) {
						CNSkills.add(get.translation(i));
					}
					var CNCharacters = extractChineseCharacters(CNSkills);
					var randomCN = getRandomElements(CNCharacters, Math.min(CNCharacters.length, 50));
					var findWord = findWordCombinations(allCNSkills, randomCN);
					//保底技能数 默认15 不给调了喵
					var num = 15;
					if (findWord.length > num) break;
				}
				var list = [];
				// @ts-ignore
				for (var i = 0; i < randomCN.length; i++) {
					list[i] = [i, randomCN[i]];
				}
				if (list.length == 0) {
					player.popup("纳尼？没有技能了？！");
					return;
				}
				var fun1 = list => {
					//不给调了喵
					var per = 75;
					if (per == 0) return [];
					var filterEnd = getRandomElements(list, Math.floor(list.length * per));
					return filterEnd;
				};
				// @ts-ignore
				game.broadcastAll(function (player) {
					player.forceCountChoose = { chooseButton: 30 };
					//@ts-ignore
				}, player);
				var buttonList = [`编译:请选择至少两个汉字（推荐选两个汉字）`];
				var count = 0;
				// @ts-ignore
				for (var i = 0; i < Math.ceil(list.length / 10); i++) {
					// @ts-ignore
					buttonList.push([list.slice(count, count + 10 >= list.length ? list.length : count + 10), "tdnodes"]);
					count += 10;
				}
				buttonList.push(`存在有${findWord.length}个技能`);
				const { links } =
					event.isMine() == false
						? { links: autoChoose(list, findWord) }
						: await player
								.chooseButton(buttonList)
								.set("forced", true)
								.set("selectButton", [2, Infinity])
								.set("filterButton", function (button) {
									// @ts-ignore
									var list = _status.event.cannot;
									if (list.length == 0) return true;
									if (list.includes(button.link)) return true;
									return false;
								})
								.set("ai", () => {
									// @ts-ignore
									_status.tmp_PRTS_endTime = true;
								})
								.set("cannot", fun1(getCannotCharacters(list, findWord)))
								.forResult();
				// @ts-ignore
				game.broadcastAll(function (player) {
					delete player.forceCountChoose;
					// @ts-ignore
				}, player);
				var fun2 = (player, end = false) => {
					if (!end) player.popup(`没有${CsSkill}`);
					else player.popup(`时间耗尽`);
					game.log(`可组成的技能有:${findWord}`);
				};
				// @ts-ignore
				if (!links || _status.tmp_PRTS_endTime) {
					fun2(player, true);
					// @ts-ignore
					delete _status.tmp_PRTS_endTime;
					return;
				}
				var CsSkill = "";
				// @ts-ignore
				for (var i of links) {
					CsSkill = CsSkill + list[i][1];
				}
				var findkey = findKeysByValue(ENSkills, CsSkill);
				if (findkey != null) {
					var introSkills = [];
					for (var i of findkey) {
						introSkills.push(get.skillInfoTranslation(i));
					}
					const { index } =
						findkey.length == 1
							? { index: 0 }
							: await player
									.chooseControl()
									.set("choiceList", introSkills)
									.set("prompt", `请选择一个版本的【${get.translation(findkey[0])}】`)
									// @ts-ignore
									.set("ai", () => get.rand(0, findkey.length - 1))
									.forResult();
					if (!index && index != 0) return;
					let info = get.info(findkey[index]);
					if (!info.audioname2) info.audioname2 = {};
					info.audioname2[player.name] = "bianyimrfz";
					player.addSkill(findkey[index]);
				} else {
					fun2(player);
				}
			},
		},
	"chenkemrfz": {
			extraSkills: [
				"duwu",
				"neifa",
				"maihuo",
				"spyanhuo",
				"xinfu_sidao",
				"dclibang",
				"zengou",
				"drlt_siyong",
				"jiaozi",
				"rewangzun",
				"nzry_cunmu",
				"jiuchi",
				"benghuai",
				"zhaoluan",
				"wumo",
				"taoluan",
				"jishe",
				"huisheng",
				"shifei",
				"huaiyi",
				"oltuishi",
				"olxiaofan",
				"oljuanxia",
				"olgoude",
				"dcwujie",
			],
			getNegative(player) {
				let banSkills = ["nscesuan", "zhaohuo", "rekurou"];
				let skillTemps = [];
				let arrs = Object.keys(lib.skill);
				let hasSkills = Object.values(lib.character)
					.map(i => i[3])
					.flat();
				for (let key of arrs) {
					if (banSkills.includes(key)) continue;
					if (
						hasSkills.includes(key) &&
						lib.translate[key] &&
						!player.hasSkill(key) &&
						(lib.skill.chenkemrfz.extraSkills.includes(key) || get.skillRank(key) < 0)
					)
						skillTemps.push(key);
				}
				return skillTemps.randomGet() || [];
			},
			init(player) {
				player.storage.chenkemrfz = ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz", "gujimrfz", "jiangqingmrfz"];
			},
			audio: 2,
			forced: true,
			firstDo: true,
			trigger: { global: "roundStart" },
			// @ts-ignore
			async content(event, trigger, player) {
				let skill = lib.skill.chenkemrfz.getNegative(player);
				await player.addSkill(skill);
				player.storage.chenkemrfz.add(skill);
				// @ts-ignore
				game.broadcastAll(
					// @ts-ignore
					function (list) {
						game.expandSkills(list);
						for (var i of list) {
							var info = lib.skill[i];
							if (!info) continue;
							if (!info.audioname2) info.audioname2 = {};
							info.audioname2.shuangwangmrfz = "chenkemrfz";
						}
					},
					[skill]
				);
			},
		},
	"newsizhanmrfz": {
			audio: 2,
			trigger: {
				player: "loseAfter",
				global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			filter(event, player) {
				if (player.countCards("h")) return false;
				// @ts-ignore
				const evt = event.getl(player);
				return evt && evt.player == player && evt.hs && evt.hs.length > 0;
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				const { index } = await player
					.chooseControl("流失体力", "失去体力上限")
					.set("prompt", "【死战】:流失一点体力或失去体力上限")
					.set("ai", () => {
						let player = get.player();
						if (player.hp >= 4) return 0;
						if (player.getDamagedHp() === 0) return 0;
						return 1;
					})
					.forResult();
				if (typeof index !== "number") return;
				if (index === 0) player.loseHp();
				else player.loseMaxHp();
				//@ts-ignore
				player.drawTo(5);
			},
			ai: {
				threaten: 0.7,
				noh: true,
				skillTagFilter(player, tag) {
					if (tag == "noh") {
						if (player.countCards("h") != 1) return false;
					}
				},
				effect: {
					// @ts-ignore
					player_use(card, player, target) {
						if (player.countCards("h") === 1) return [1, 0.8];
					},
					// @ts-ignore
					target(card, player, target) {
						if (get.tag(card, "loseCard") && target.countCards("h") === 1) return 0.5;
					},
				},
			},
		},
	"ehoumrfz": {
			mod: {
				// @ts-ignore
				cardname(card, player, name) {
					if (get.position(card) === "h" && player.storage.ehoumrfz) return "sha";
				},
			},
			audio: 2,
			trigger: {
				player: "damageEnd",
				global: "damageEnd",
			},
			filter(event, player) {
				if (!event.source || !event.source.isIn()) return false;
				return (event.player === player || get.distance(player, event.player) <= 1) && player.canUse("juedou", event.source);
			},
			// @ts-ignore
			prompt(event, player) {
				return `【扼后】:是否视为对${get.translation(event.source)}使用一张【决斗】？`;
			},
			check(event, player) {
				let target = event.source;
				if (get.attitude2(event.player) < 0) return false;
				return get.effect(target, { name: "juedou" }, player, player) > 0 && player.countCards("h") * 2 > target.countCards("h");
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player.storage.ehoumrfz = true;
				player.useCard({ name: "juedou", isCard: true, storage: { jumpDying: true } }, trigger.source, true);
			},
			group: ["ehoumrfz_clear", "ehoumrfz_jumpDying"],
			subSkill: {
				jumpDying: {
					silent: true,
					charlotte: true,
					trigger: { global: "dying" },
					// @ts-ignore
					filter(event, player) {
						return event.card && event.card.storage && event.card.storage.jumpDying;
					},
					// @ts-ignore
					async content(event, trigger, player) {
						// @ts-ignore
						player.die();
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "useCardEnd" },
					// @ts-ignore
					filter(event, player) {
						return event.card && event.card.storage && event.card.storage.jumpDying;
					},
					// @ts-ignore
					async content(event, trigger, player) {
						delete player.storage.ehoumrfz;
					},
				},
			},
		},
});

translate({
	"acemrfz": "Ace",
	"sizhanmrfz": "死战",
	"sizhanmrfz_info": "限定技，锁定技，当你死亡时，你于主公回合结束时复活且插入一个回合且此回合你获得如下效果：①你的伤害基数改为2；②摸牌阶段，你额外摸X张牌；③你的基本牌均视为【杀】且使用杀无距离限制;④回合结束，你立刻死亡。（X=当前轮次数，X至多为5）",
	"guanyongmrfz": "冠勇",
	"guanyongmrfz_info": "出牌阶段，当你使用的【杀】指定目标时，你弃置其一张牌，若此牌为基本牌，则此【杀】不可被【闪】响应，否则，你摸两张牌，然后本回合使用杀的次数+1（若不处于因【死战】而获得的回合，则至多+2）。",
	"shouwangmrfz2": "保存",
	"juhuomrfz": "聚火",
	"juhuomrfz_info": "每回合限一次，当你使用带有伤害类标签的牌结算完毕后，若此牌造成过伤害，你可以增加X点体力上限，然后若此牌的点数大于你的体力值，你将手牌补至体力上限，反之你将体力上限调整至与该牌点数相同并将体力值回复至体力上限。（X=此牌造成的伤害数）",
	"xuehengmrfz": "血恨",
	"xuehengmrfz_info": "觉醒技，回合开始时，若你体力上限不少于存活角色数，你失去【聚火】且：若你的手牌数大于你的体力值且没有与你胜利条件一致的角色死亡，获得【熯天】，反之你将身份牌变为内奸（如果你是主公则改为将其余角色的身份牌均变为反贼），获得【失魂】。然后你将体力值调整至体力上限",
	"shihunmrfz": "失魂",
	"shihunmrfz_info": "锁定技，准备阶段，你对所有角色造成两点火属性伤害；当你受到大于1点的伤害时，你将伤害值调整至1点；你使用牌无次数限制；结束阶段，你摸X张牌。（X=已死亡的角色数）",
	"hantianmrfz": "熯天",
	"hantianmrfz_info": "①锁定技，准备阶段，若场上没有角色有‘志城’标记，你令与你胜利条件相同的其他角色和你获得‘志城’标记，然后所有拥有‘志城’标记的角色将体力上限和体力值调整至所有有‘志城’标记的角色中的体力上限的最大值。②当拥有‘志城’标记的角色使用的【杀】结算完毕后，其他有‘志城’标记的角色可以对此杀的目标使用一张【杀】并摸一张牌。",
	"bianyimrfz": "编译",
	"bianyimrfz_info": "每轮开始时或你造成伤害后，你可以随机抽取100个技能名，从这100个技能名随机抽取50个汉字，然后你在30秒内从这些汉字中选择两个汉字，使其组成一个技能名，若此技能名存在于技能库中，你获得此技能。",
	"chenkemrfz": "沉疴",
	"chenkemrfz_info": "锁定技，每轮开始时，你随机获得一个技能名是贬义的技能；此技能和因此技能获得的技能不参与技能数的计算。",
	"newsizhanmrfz": "死战",
	"newsizhanmrfz_info": "锁定技，当失去最后一张手牌后，你失去一点体力或失去一点体力上限，然后将手牌补至5。",
	"ehoumrfz": "扼后",
	"ehoumrfz_info": "当你或与你距离不大于1的角色受到伤害后，你可以对伤害来源视为使用一张【决斗】，且你的手牌均视为【杀】直到此牌结算完毕，若有角色因此牌而进入濒死状态，其跳过之。",
});

characterTitle("acemrfz", "<font color='red'>巴别塔之盾</font>");

characterIntro("acemrfz", "罗德岛精英干员Ace，参与切尔诺伯格行动，因掩护博士救援小队撤退而阵亡。</br></br><span class=firetext>罗德岛会铭记您的贡献。</span>");
