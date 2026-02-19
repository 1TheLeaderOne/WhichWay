import { lib, game, ui, get, ai, _status } from "noname";

const tmpSave = window.whichWaySave.tmpSave;

/** @type {WhichWayCharacterPack} */
export default {
	character: {
		acemrfz: ["male", "luomrfz", "4/6", ["newsizhanmrfz", "ehoumrfz"], []],
		baocunzhemrfz: ["male", "qianmrfz", 10, ["shouwangmrfz", "jingmomrfz", "xijimrfz"], []],
		yizumikemrfz: ["male", "haimrfz", 3, ["chanshimrfz"], []],
		kelisitengmrfz: ["female", "lymrfz", 4, ["xingtumrfz", "poqiongmrfz"], []],
		aiguozhemrfz: ["male", "zhmrfz", 4, ["xinjunxingmrfz", "youjimrfz"], []],
		doushitalulamrfz: ["female", "zhmrfz", 4, ["zhuoximrfz", "talula_shixinmrfz"], []],
		teleixiyamrfz: ["female", "bamrfz", 3, ["bojimrfz", "caijianmrfz"], []],
		teleixisimrfz: ["male", "junmrfz", 4, ["yuanfumrfz", "fenzhoumrfz"], []],
		qiaojiakelifumrfz: ["male", "gemrfz", 4, ["chongxiemrfz", "qj_chongjimrfz", "leitingmrfz"], []],
		puruisaisimrfz: ["female", "qianmrfz", 3, ["qianmianmrfz", "neihuamrfz"], []],
		shuangwangmrfz: ["female", "kaizidaiermrfz", 8, ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz", "gujimrfz", "jiangqingmrfz"], []],
		keluxiermrfz: ["female", "bamrfz", 4, ["fuzhimrfz", "kuorongmrfz"], []],
		minermrfz: {
			group: "wumrfz",
			sex: "male",
			skills: ["xunkaimrfz"],
			hp: 3,
		},
		xierdamrfz: {
			group: "weimrfz",
			sex: "female",
			skills: ["shencimrfz", "lanshengmrfz"],
			hp: 3,
		},
	},
	skill: {
		//希尔达
		shencimrfz: {
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
				const  result  = await player
				//@ts-ignore
					.chooseCardHand()
					.set("ai", card => get.player().getUseValue(card))
					.set("cards", cards)
					.set("forced", true)
					.set("complexSelect",true)
					.set("prompt", `【神赐】:请选择你要获得的牌`).forResult();
				if(!result?.cards) return;
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
					async content(event,trigger,player){
						await player.discard(player.getCards("h",card=>card.hasGaintag("shencimrfz")));
						player.recoverTo(1);
					},
				},
				onlose: {
					audio:false,
					silent:true,
					charlotte:true,
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
						for(let id in trigger.gaintag_map){
							//@ts-ignore
							let tags = trigger.gaintag_map[id];
							if(!tags.includes("shencimrfz")) continue;
							destory.addArray(trigger.cards.filter(card => card.cardid === id))
						}
						game.log(destory,`被销毁了`);
					},
				},
			},
		},
		lanshengmrfz: {
			audio: 2,
			trigger:{
				player:"damageEnd",
				source:"damageEnd"
			},
			filter(event,player){
				//@ts-ignore
				return new Set(game.getAllGlobalHistory("everything",evt=>evt.name==="gain"&&evt.gaintag.includes("shencimrfz")).map(evt=>evt.cards.map(i=>get.suit(i))).flat()).size>0;
			},
			async cost(event,trigger,player){
				//@ts-ignore
				let suits = new Set(game.getAllGlobalHistory("everything",evt=>evt.name==="gain"&&evt.gaintag.includes("shencimrfz")).map(evt=>evt.cards.map(i=>get.suit(i))).flat());
				event.result = await player.chooseCard()
					.set("prompt",get.prompt("lanshengmrfz"))
					.set("prompt2",`你可以重铸至多${suits.size}张牌，若包含了与获得过的“神赐”牌相同牌名的牌，你摸一张牌`)
					.set("filterCard",(card)=>{
						//@ts-ignore
						if(get.event().shenciCard.has(get.name(card))){
							let info = ui.create.div(".promptSJZX",card);
							info.classList.add("promptCardSJZX");
							info.innerHTML = `可摸牌`;
						}
						return true;
					})
					.set("ai",card=>{
						//@ts-ignore
						let names = get.event().shenciCard;
						return 6 - get.value(card) + (names.has(get.name(card))&&!ui.selected.cards.map(i=>get.name(i)).includes(get.name(card)) ? 5 : 0);
					})
					.set("selectCard",[1,suits.size])
					//@ts-ignore
					.set("shenciCard",new Set(game.getAllGlobalHistory("everything",evt=>evt.name==="gain"&&evt.gaintag.includes("shencimrfz")).map(evt=>evt.cards.map(i=>get.name(i))).flat()))
					.forResult();

				player.getCards("hes",card=>{
					if(card.querySelector(".promptSJZX")){
						card.querySelector(".promptSJZX")?.remove();
					}
				})
			},
			async content(event,trigger,player){
				//@ts-ignore
				let names = new Set(game.getAllGlobalHistory("everything",evt=>evt.name==="gain"&&evt.gaintag.includes("shencimrfz")).map(evt=>evt.cards.map(i=>get.name(i))).flat());
				let { cards } = event;
				player.recast(cards,undefined,(player,cards)=>{
					if(cards.map(i=>get.name(i)).some(i=>names.has(i))){
						player.draw(cards.length + 1);
					} else player.draw(cards.length);
				});
			},
		},

		//矿工游击队
		xunkaimrfz: {
			audio: 2,
			forced: true,
			derivation: ["xinjuejing", "weijing"],
			trigger: {
				player: ["dying", "enterGame"],
				global: "phaseBefore",
			},
			filter(event, player) {
				return event.name !== "phase" || game.phaseNumber === 0;
			},
			firstDo: true,
			async content(event, trigger, player) {
				if (player.maxHp > 1) {
					//@ts-ignore
					let gains = ["xinjuejing", "weijing"].map(i => `${i}_${get.randomNumberSJZX()}`);
					// @ts-ignore
					game.broadcastAll(skills => {
						//@ts-ignore
						skills.forEach(skill => {
							let original = skill.split("_")[0];
							let info = get.info(original);
							lib.skill[skill] = {
								...info,
								audio: original,
								xunkaimrfz: true,
								onremove: true,
							};
							lib.translate[skill] = lib.translate[original];
							lib.translate[`${skill}_info`] = lib.translate[`${original}_info`];

							if (original === "weijing") {
								lib.dynamicTranslate[skill] = (player, skill) => {
									// @ts-ignore
									return player.storage[skill] ? "每轮限一次，当你需要使用基本牌时，你可以视为使用之" : lib.translate.weijing_info;
								};
								lib.skill[skill] = {
									...lib.skill[skill],
									filter(event, player) {
										if (event.type === "wuxie" || player.hasSkill(`${skill}_used`)) {
											return false;
										}
										let names = player.storage[skill] ? lib.inpile.filter(i => get.type(i) === "basic") : ["sha", "shan"];
										for (var name of names) {
											if (event.filterCard({ name: name, isCard: true }, player, event)) {
												return true;
											}
										}
										return false;
									},
									hiddenCard(player, name) {
										let names = player.storage[skill] ? lib.inpile.filter(i => get.type(i) === "basic") : ["sha", "shan"];
										return names.includes(name) && !player.hasSkill(`${skill}_used`);
									},
									chooseButton: {
										...lib.skill[skill].chooseButton,
										// @ts-ignore
										backup: function (links, player) {
											return {
												audio: "weijing",
												viewAs: {
													name: links[0][2],
												},
												filterCard: () => false,
												selectCard: -1,
												position: "hes",
												popname: true,
												check(card) {
													return 6 / Math.max(1, get.value(card));
												},
												// @ts-ignore
												async precontent(event, trigger, player) {
													player.addTempSkill(`${skill}_used`, "roundEnd");
												},
											};
										},
										dialog(event, player) {
											let names = player.storage[skill] ? lib.inpile.filter(i => get.type(i) === "basic") : ["sha", "shan"];
											var vcards = [];
											for (var name of names) {
												var card = { name: name, isCard: true };
												if (event.filterCard(card, player, event)) {
													vcards.push(["基本", "", name]);
												}
											}
											var dialog = ui.create.dialog("卫境", [vcards, "vcard"], "hidden");
											// @ts-ignore
											dialog.direct = true;
											return dialog;
										},
									},
								};
							}
						});
						//@ts-ignore
					}, gains);

					await player.addSkills(gains);

					await player.loseMaxHp();
					player.recoverTo(1);
				} else {
					let skills = player.getSkills().filter(skill => {
						let info = get.info(skill);
						return info && info.xunkaimrfz && skill.startsWith("weijing");
					});
					if (skills.length < 1) return;
					let skill = skills.randomGet();
					player.storage[skill] = true;
				}
			},
		},

		// 可露希尔
		jingxiangmrfz: {
			audio: 2,
			filter: function (event, player) {
				return false;
			},
			trigger: { player: "pointless" }, //免得十周年ui技能溢出屏幕,这是一个无意义的时机
			viewAs: {
				name: "sha",
				isCard: true,
			},
			limited: true,
			mark: false,
			filterCard: () => false,
			selectCard: -1,
			replaced: false,
			usedSJZX: false,
			async precontent(event, trigger, player) {
				let name = event.name.replace("pre_", "");
				player.awakenSkill(name);
				lib.skill[name].usedSJZX = true;
			},
		},
		fuzhimrfz: {
			audio: 2,
			trigger: {
				target: "useCardToTargeted",
			},
			filter(event, player) {
				let skills = player.getSkills().filter(skill => {
					if (!skill.startsWith("jingxiangmrfz")) return false;
					let info = get.info(skill);
					return !info.replaced;
				});
				return skills.length > 0 && get.type(event.card) !== "delay" && get.type(event.card) !== "equip";
			},
			prompt(event) {
				//@ts-ignore
				return `是否将一个“镜像”中的‘undefined’替换为‘${get.translation(event.card.name)}’?`;
			},
			check(event, player) {
				let skills = player.getSkills().filter(skill => {
					if (!skill.startsWith("jingxiangmrfz")) return false;
					let info = get.info(skill);
					return info.replaced && !info.usedSJZX;
				});
				let calculate = {};
				skills.forEach(skill => {
					let info = get.info(skill);
					// @ts-ignore
					let viewName = info.viewAs.name;
					if (!calculate[viewName]) calculate[viewName] = 0;
					calculate[viewName]++;
				});
				return calculate[event.card.name] < (get.value(event.card) >= 6 ? 4 : 3);
			},
			async content(event, trigger, player) {
				let name = player.getSkills().filter(skill => {
					if (!skill.startsWith("jingxiangmrfz")) return false;
					let info = get.info(skill);
					return !info.replaced;
				})[0];
				const info = get.info(name);
				info.enable = "chooseToUse";
				info.trigger = undefined;
				info.replaced = true;
				info.audio = "jingxiangmrfz";
				info.viewAs = {
					// @ts-ignore
					...info.viewAs,
					name: trigger.card.name,
					nature: trigger.card.nature,
				};
				info.filter = () => true;
				let cardname = (get.translation(trigger.card.nature) ? get.translation(trigger.card.nature) : "") + get.translation(trigger.card.name);
				lib.translate[name] = lib.translate[name] + cardname.slice(0, 2);
				lib.translate[name + "_info"] = lib.translate[name + "_info"].replace("undefined", cardname);
			},
		},
		kuorongmrfz: {
			audio: 2,
			forced: true,
			derivation: ["jingxiangmrfz", "clanzhongliu"],
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			async content(event, trigger, player) {
				for (let i = 0; i < 15; i++) {
					let name = "jingxiangmrfz" + i;
					let info = {
						...lib.skill.jingxiangmrfz,
					};
					lib.skill[name] = info;
					lib.translate[name] = lib.translate["jingxiangmrfz"];
					lib.translate[name + "_info"] = lib.translate["jingxiangmrfz_info"];
					player.addSkill(name);
				}
				let random = Math.random();
				if (random >= 0.95 || lib.config.lucky_star) {
					player.addSkill("clanzhongliu");
					let info = get.info("clanzhongliu");
					if (!info.audioname2) info.audioname2 = {};
					info.audioname2["keluxiermrfz"] = "clanzhongliu_keluxiermrfz";
					player.addSkill("kuorongmrfz_reset");
				}
			},
			subSkill: {
				reset: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "clanzhongliuAfter",
					},
					async content(event, trigger, player) {
						let skills = player.awakenedSkills.filter(skill => {
							return skill.startsWith("jingxiangmrfz");
						});
						skills.forEach(skill => {
							if (player.awakenedSkills && player.awakenedSkills.includes(skill)) {
								game.log(player, "重置了技能", "#g" + `【${get.translation(skill)}】`);
								player.awakenedSkills.remove(skill);
							}
							if (player.disabledSkills) {
								for (let key in player.disabledSkills) {
									if (key === skill) delete player.disabledSkills[key];
								}
							}
							lib.skill[skill].usedSJZX = false;
						});
					},
				},
			},
		},
		clanzhongliu_keluxiermrfz: {
			//仅用作配音
			audio: 2,
		},

		//Ace
		sizhanmrfz: {
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
			// @ts-ignore
			filter: function (event, player) {
				return !player.storage.sizhanmrfz;
			},
			content: function () {
				"step 0";
				var targets = game.filterPlayer(function (current) {
					// @ts-ignore
					return current != player && current.isZhu;
				});
				// @ts-ignore
				event._result = { bool: true, targets: targets };
				"step 1";
				// @ts-ignore
				if (result.bool) {
					// @ts-ignore
					var target = result.targets[0];
					target.addSkill("sizhanmrfz2");
					// @ts-ignore
					player.storage.sizhanmrfz = true;
					// @ts-ignore
					player.awakenSkill("sizhanmrfz");
				}
			},
		},
		sizhanmrfz2: {
			trigger: { player: "phaseEnd" },
			forced: true,
			direct: true,
			content: function () {
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
		sizhanmrfz3: {
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
		guanyongmrfz: {
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
			content: function () {
				"step 0";
				// @ts-ignore
				player.discardPlayerCard(trigger.target, get.prompt("guanyongmrfz", trigger.target), true).set("att", get.attitude(player, trigger.target) <= 0);
				"step 1";
				// @ts-ignore
				if (result.bool && result.links && result.links.length) {
					// @ts-ignore
					if (get.type(result.links[0], null, result.links[0].original == "h" ? player : false) == "basic") {
						// @ts-ignore
						trigger.getParent().directHit.add(trigger.target);
					} else {
						// @ts-ignore
						player.draw(2);
						// @ts-ignore
						player.addTempSkill("guanyongmrfz2");
						// @ts-ignore
						if (player.countMark("guanyongmrfz2") < 2 || player.storage.sizhanmrfz) {
							// @ts-ignore
							player.addMark("guanyongmrfz2", false);
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
		guanyongmrfz2: {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("guanyongmrfz2");
				},
			},
			onremove: true,
		},
		//克丽斯腾莱特 总辖
		xingtumrfz: {
			mark: true,
			intro: {
				// @ts-ignore
				content: function (event, player) {
					// @ts-ignore
					var list = ["手牌上限+1", "额定摸牌数+1", "使用【杀】的次数+1", "将手牌和体力值补至体力上限"];
					var show = {
						handlit: [],
						draw: [],
						sha: [],
						recover: [],
					};

					for (var i = 0; i < game.players.length; i++) {
						var player = game.players[i];
						if (!player.storage.xingtumrfz) continue;

						if (player.storage.xingtumrfz.includes("手牌上限+1")) {
							//@ts-ignore
							show.handlit.push(player);
						}
						if (player.storage.xingtumrfz.includes("额定摸牌数+1")) {
							//@ts-ignore
							show.draw.push(player);
						}
						if (player.storage.xingtumrfz.includes("使用【杀】的次数+1")) {
							//@ts-ignore
							show.sha.push(player);
						}
						if (player.storage.xingtumrfz.includes("将手牌和体力值补至体力上限")) {
							//@ts-ignore
							show.recover.push(player);
						}
					}
					return "【星途】已选择选项的角色</br>手牌上限:" + get.translation(show.handlit) + "</br>额定摸牌:" + get.translation(show.draw) + "</br>使用【杀】:" + get.translation(show.sha) + "</br>补牌和体力:" + get.translation(show.recover);
				},
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			// @ts-ignore
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			selectTarget: [0, 2],
			// @ts-ignore
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("he") > 0;
			},
			multitarget: true,
			multiline: true,
			// @ts-ignore
			async content(event, trigger, player) {
				//QQQ
				var cardx;
				const targets = event.targets.add(player);
				const cards = [];
				for (var i of targets) {
					const  result  = await i.chooseCard("【星途】:你可以重铸一张牌", "he", lib.filter.cardRecastable).set("ai", function (card) {
						return 8 - get.value(card);
					}).forResult();
					if (result.cards) {
						if (i != player) {
							cards.push(result.cards[0]);
						} else {
							cardx = result.cards[0];
						}
						i.recast(result.cards);
					}
				}
				if (targets.length > 1 && cards.filter(q => get.color(q) == get.color(cardx)).length >= cards.length / 2) {
					for (var targety of targets) {
						var list = [],
							compare = ["手牌上限+1", "额定摸牌数+1", "使用【杀】的次数+1", "将手牌和体力值补至体力上限"];
						if (!targety.storage.xingtumrfz) targety.storage.xingtumrfz = [];
						// @ts-ignore
						for (var i of compare) {
							if (!targety.storage.xingtumrfz.includes(i)) {
								list.push(i);
							}
						}
						if (list.length) {
							const  result1  = await targety
								.chooseControl(list)
								.set("prompt", "【星途】:请选择一项")
								.set("ai", () => {
									if (list.includes("将手牌和体力值补至体力上限") && targety.getDamagedHp() * 2 + targety.getHandcardLimit() - targety.countCards("h") >= 5) {
										return "将手牌和体力值补至体力上限";
									}
									if (list.includes("额定摸牌数+1")) return "额定摸牌数+1";
									return ["手牌上限+1", "使用【杀】的次数+1"].randomGet();
								}).forResult();
							if (result1.control) {
								targety.storage.xingtumrfz.add(result1.control);
								game.log(targety, "选择了", result1.control);
								if (result1.control == "手牌上限+1") targety.addSkill("xingtumrfz_handlit");
								if (result1.control == "使用【杀】的次数+1") targety.addSkill("xingtumrfz_sha");
								if (result1.control == "额定摸牌数+1") targety.addSkill("xingtumrfz_draw");
								if (result1.control == "将手牌和体力值补至体力上限") {
									//@ts-ignore
									targety.drawTo(targety.maxHp);
									targety.recoverTo(targety.maxHp);
								}
							}
						}
					}
				}
			},
			subSkill: {
				handlit: {
					charlotte: true,
					mod: {
						// @ts-ignore
						maxHandcard: function (player, num) {
							return num + 1;
						},
					},
				},
				draw: {
					charlotte: true,
					forced: true,
					lastDo: true,
					trigger: { player: "phaseDrawBegin2" },
					content: function () {
						// @ts-ignore
						trigger.num++;
					},
				},
				sha: {
					charlotte: true,
					mod: {
						// @ts-ignore
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
			},
			ai: {
				order: 13,
				expose: 0.1,
				result: {
					player: 1,
					target: 1,
				},
			},
		},
		poqiongmrfz: {
			audio: 2,
			derivation: ["xingyoumrfz", "jiexiangmrfz"],
			enable: "phaseUse",
			limited: true,
			skillAnimation: "epic",
			animationColor: "thunder",
			mark: true,
			intro: {
				content: "limited",
			},
			init: (player, skill) => (player.storage[skill] = false),
			// @ts-ignore
			filter: function (event, player) {
				return player.storage.poqiongmrfz == false;
			},
			content: function () {
				"step 0";
				// @ts-ignore
				event.lose = 0;
				// @ts-ignore
				event.num = 0;
				// @ts-ignore
				event.showed = [];
				// @ts-ignore
				event.pd = [];
				// @ts-ignore
				player.storage.poqiongmrfz = true;
				"step 1";
				// @ts-ignore
				if (event.num < 6) {
					// @ts-ignore
					player.chooseCard("he", function (card) {
						// @ts-ignore
						return !event.showed.includes(card);
					});
				}
				// @ts-ignore
				else event.goto(3);
				"step 2";
				// @ts-ignore
				if (result.cards) {
					var cards1 = game.cardsGotoOrdering(get.cards(1)).cards;
					// @ts-ignore
					var cards2 = result.cards[0];
					// @ts-ignore
					player.showCards(cards2, get.translation(player) + "展示的牌</br>点数为:" + cards2.number);
					// @ts-ignore
					player.showCards(cards1, "牌堆顶的牌</br>点数为:" + cards1[0].number);
					// @ts-ignore
					event.showed.push(cards2);
					// @ts-ignore
					event.pd.push(cards1[0]);
					//@ts-ignore
					if (cards1?.[0].number > cards2.number) {
						// @ts-ignore
						player.loseMaxHp();
						// @ts-ignore
						event.lose++;
						// @ts-ignore
						player.popup("失败：" + event.lose);
					}
					game.cardsDiscard(cards1);
				} else {
					var cards1 = game.cardsGotoOrdering(get.cards(1)).cards;
					// @ts-ignore
					player.showCards(cards1, "牌堆顶的牌</br>点数为:" + cards1[0].number);
					game.cardsDiscard(cards1);
					// @ts-ignore
					player.loseMaxHp();
					// @ts-ignore
					event.lose++;
				}
				// @ts-ignore
				event.num++;
				// @ts-ignore
				event.goto(1);
				"step 3";
				// @ts-ignore
				if (event.lose < 3) {
					var num = Math.random();
					// @ts-ignore
					if (get.isLuckyStar(player)) num = 0.1;
					if (num < 0.2 && lib.config.FTLmrfz != true) {
						ui.backgroundMusic.src = lib.assetURL + "extension/whitherHelm/audio/BGM/fasterthanlight.mp3";
						//TODO:成就
						// whitherHelm.ShowGetAch("FTLmrfz");
					}
					// @ts-ignore
					player.removeSkill("xingtumrfz");
					// @ts-ignore
					player.addSkill("xingyoumrfz");
					// @ts-ignore
					player.addSkill("jiexiangmrfz");
					// @ts-ignore
					player.gainMaxHp(3);
					// @ts-ignore
					player.recoverTo(player.maxHp);
					// @ts-ignore
					player.gain(event.pd, "gain2");
				}
				// @ts-ignore
				else player.popup("失败");
			},
			ai: {
				order: 12,
				result: {
					// @ts-ignore
					player: function (player, target, card) {
						var cards = player.getCards("he"),
							num = 0;
						for (var i = 0; i < cards.length; i++) {
							//@ts-ignore
							num += cards[i].number;
						}
						if (player.storage.xingtumrfz == undefined) return -1;
						if (player.storage.xingtumrfz.length < 3) return -1;
						return num - 42;
					},
				},
			},
		},
		xingyoumrfz: {
			intro: {
				content: "[其他角色/你]计算与[你/其他角色]的距离+#",
			},
			audio: 2,
			enable: "phaseUse",
			// @ts-ignore
			filter: function (event, player) {
				return (
					player.countCards("he", function (card) {
						for (var i = 0; i < player.storage.xingyoumrfz.length; i++) {
							var storage = player.storage.xingyoumrfz[i];
							if (get.suit(card) == storage) return false;
						}
						return true;
					}) > 0
				);
			},
			selectCard: 1,
			filterCard: function (card) {
				var player = _status.event.player;
				for (var i = 0; i < player.storage.xingyoumrfz.length; i++) {
					var storage = player.storage.xingyoumrfz[i];
					if (get.suit(card) == storage) return false;
				}
				return true;
			},
			check: function (card) {
				return 8 - get.value(card);
			},
			init: (player, skill) => (player.storage[skill] = []),
			content: function () {
				// @ts-ignore
				player.recast(cards[0]);
				// @ts-ignore
				player.storage.xingyoumrfz.add(cards[0].suit);
			},
			group: ["xingyoumrfz_del", "xingyoumrfz_dis"],
			subSkill: {
				del: {
					charlotte: true,
					forced: true,
					silent: true,
					lastDo: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						// @ts-ignore
						player.storage.xingyoumrfz = [];
					},
				},
				dis: {
					charlotte: true,
					forced: true,
					trigger: { global: "roundStart" },
					content: function () {
						"step 0";
						// @ts-ignore
						player.addMark("xingyoumrfz_dis", false);
						"step 1";
						if (
							game.countPlayer(function (current) {
								// @ts-ignore
								return current != player && player.inRange(current);
							}) == 0
						) {
							// @ts-ignore
							player.loseMaxHp();
						}
					},
					mod: {
						// @ts-ignore
						globalTo: function (from, to, distance) {
							return (distance += to.countMark("xingyoumrfz_dis"));
						},
						// @ts-ignore
						globalFrom: function (from, to, distance) {
							return (distance += from.countMark("xingyoumrfz_dis"));
						},
					},
				},
			},
			ai: {
				order: 6,
			},
		},
		jiexiangmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "die" },
			forceDie: true,
			content: function () {
				"step 0";
				// @ts-ignore
				var target = game.filterPlayer();
				// @ts-ignore
				event.targets = target.remove(player);
				// @ts-ignore
				player.draw(Math.max(event.targets.length + 1, player.recastCount()));
				"step 1";
				// @ts-ignore
				if (event.targets.length) {
					// @ts-ignore
					var num = player.countCards("he") - event.targets.length;
					// @ts-ignore
					player.chooseCard(true, "【揭相】:请选择至少一张牌将其分配给" + get.translation(event.targets[0]), [1, num + 1], "he");
				}
				// @ts-ignore
				else event.goto(3);
				"step 2";
				// @ts-ignore
				if (result.cards) {
					// @ts-ignore
					var target = event.targets[0];
					// @ts-ignore
					target.gain(result.cards, "gain2");
				}
				// @ts-ignore
				event.targets.remove(target);
				// @ts-ignore
				event.goto(1);
				"step 3";
				// @ts-ignore
				game.countPlayer(function (current) {
					// @ts-ignore
					if (current != player) {
						current.gainMaxHp();
						current.recover();
					}
				});
				if (
					game.hasPlayer(function (current) {
						// @ts-ignore
						return current != player && current.name == "baocunzhemrfz";
					})
				) {
					var audio = new Audio("extension/whitherHelm/audio/CN/caidankelisitengmrfz.mp3");
					audio.play();
				}
			},
		},
		//保存者 弗里斯顿
		shouwangmrfz: {
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			unique: true,
			// @ts-ignore
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			content: function () {
				"step 0";
				// @ts-ignore
				player.chooseTarget(true, "【守望】:请选择一名其他角色", function (card, player, target) {
					return target != player;
				}).ai = function (target) {
					// @ts-ignore
					return get.attitude(player, target) > 0;
				};
				"step 1";
				// @ts-ignore
				if (result.bool) {
					// @ts-ignore
					result.targets[0].addSkill("shouwangmrfz2");
				}
			},
			group: ["shouwangmrfz_die", "shouwangmrfz_recover", "shouwangmrfz_draw"],
			subSkill: {
				die: {
					direct: true,
					charlotte: true,
					trigger: { global: "dieBegin" },
					firstDo: true,
					// @ts-ignore
					filter: function (event, player) {
						return event.player.hasSkill("shouwangmrfz2");
					},
					content: function () {
						//player.die()._triggered=null;
						// @ts-ignore
						player.loseMaxHp(player.maxHp);
						// @ts-ignore
						player.logSkill("shouwangmrfz");
					},
				},
				recover: {
					direct: true,
					charlotte: true,
					trigger: { player: "dying" },
					content: function () {
						// @ts-ignore
						player.recoverTo(1);
						// @ts-ignore
						player.logSkill("shouwangmrfz");
					},
				},
				draw: {
					audio: 2,
					trigger: { player: "drawAfter" },
					// @ts-ignore
					filter: function (event, player) {
						// @ts-ignore
						return event.getParent().name != "shouwangmrfz2";
					},
					// @ts-ignore
					check: function (event, player) {
						var target = game.findPlayer(function (current) {
							return current.hasSkill("shouwangmrfz2");
						});
						return get.attitude(player, target) > 0;
					},
					// @ts-ignore
					prompt: function (event, player) {
						var target = game.findPlayer(function (current) {
							return current.hasSkill("shouwangmrfz2");
						});
						return "是否令" + get.translation(target) + "摸一张牌？";
					},
					content: function () {
						// @ts-ignore
						player.logSkill("shouwangmrfz");
						// @ts-ignore
						game.countPlayer(function (current) {
							if (current.hasSkill("shouwangmrfz2")) current.draw();
						});
					},
				},
			},
			ai: {
				effect: {
					// @ts-ignore
					target(card, player, target, current) {
						if (get.type(card) == "trick" || card.name == "sha") return "zeroplayertarget";
					},
				},
			},
		},
		shouwangmrfz2: {
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
		xijimrfz: {
			audio: 2,
			trigger: { player: "dieBegin" },
			// @ts-ignore
			filter: function (event, player) {
				return player.countCards("hej") > 0;
			},
			direct: true,
			content: function () {
				"step 0";
				// @ts-ignore
				player.chooseTarget("【希冀】:你可以将你区域内所有的牌交给一名其他角色", function (card, player, target) {
					return target != player;
				}).ai = function (target) {
					// @ts-ignore
					return get.attitude(player, target) > 2 && target.hp > 0;
				};
				"step 1";
				// @ts-ignore
				if (result.bool) {
					// @ts-ignore
					var hej = player.getCards("hej"),
					// @ts-ignore
						target = result.targets[0];
					// @ts-ignore
					player.give(hej, target);
					// @ts-ignore
					player.logSkill("xijimrfz", target);
					target.addSkill("xijimrfz_eff");
					target.addMark("xijimrfz_eff", hej.length, false);
				}
			},
			group: "xijimrfz_die",
			subSkill: {
				die: {
					audio: "xijimrfz",
					enable: "phaseUse",
					// @ts-ignore
					filter: function (event, player) {
						return player.maxHp <= 5;
					},
					content: function () {
						"step 0";
						// @ts-ignore
						player.chooseBool("【希冀】:是否失去所有体力上限？");
						"step 1";
						// @ts-ignore
						if (result.bool) {
							// @ts-ignore
							var num = Math.floor(player.maxHp / 2);
							// @ts-ignore
							player.draw(Math.min(3, num > 1 ? num : 1));
							// @ts-ignore
							player.loseMaxHp(player.maxHp);
						}
					},
				},
				eff: {
					charlotte: true,
					intro: {
						content: "攻击距离、使用【杀】的次数+#",
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("xijimrfz_eff");
						},
						attackRange: function (player, num) {
							return num + player.countMark("xijimrfz_eff");
						},
					},
					trigger: { player: "phaseEnd" },
					silent: true,
					content: function () {
						// @ts-ignore
						player.removeMark("xijimrfz_eff", player.countMark("xijimrfz_eff"), false);
						// @ts-ignore
						player.removeSkill("xijimrfz_eff");
					},
				},
			},
		},
		jingmomrfz: {
			audio: 2,
			forced: true,
			trigger: { global: "roundStart" },
			content: function () {
				// @ts-ignore
				player.loseMaxHp();
			},
			mod: {
				// @ts-ignore
				maxHandcardBase: function (player, num) {
					return 5;
				},
			},
		},
		//伊祖米克 水月
		chanshimrfz: {
			audio: false,
			trigger: {
				source: "damageEnd",
				global: "roundStart",
			},
			// @ts-ignore
			filter: function (event, player) {
				return !player.hasSkill("chanshimrfz_ban");
			},
			content: function () {
				"step 0";
				// @ts-ignore
				player.addTempSkill("chanshimrfz_ban", "phaseEnd");
				var list;
				// @ts-ignore
				if (_status.characterlist) {
					list = [];
					// @ts-ignore
					for (var i = 0; i < _status.characterlist.length; i++) {
						// @ts-ignore
						var name = _status.characterlist[i];
						list.push(name);
					}
				} else if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					list = get.gainableCharacters();
				}
				var players = game.players.concat(game.dead);
				for (var i = 0; i < players.length; i++) {
					list.remove(players[i].name);
					list.remove(players[i].name1);
					list.remove(players[i].name2);
				}
				list = list.randomGets(2);
				var skills = [];
				for (var i of list) {
					skills.addArray(lib.character[i][3]);
				}
				// @ts-ignore
				if (!list.length || !skills.length) {
					// @ts-ignore
					event.finish();
					return;
				}
				// @ts-ignore
				if (player.isUnderControl()) {
					// @ts-ignore
					game.swapPlayerAuto(player);
				}
				var switchToAuto = function () {
					_status.imchoosing = false;
					// @ts-ignore
					event._result = {
						bool: true,
						skills: skills.randomGets(1),
					};
					// @ts-ignore
					if (event.dialog) event.dialog.close();
					// @ts-ignore
					if (event.control) event.control.close();
				};
				var chooseButton = function (list, skills) {
					var event = _status.event;
					// @ts-ignore
					if (!event._result) event._result = {};
					event._result.skills = [];
					var rSkill = event._result.skills;
					var dialog = ui.create.dialog("请获得一个技能", [list, "character"], "hidden");
					// @ts-ignore
					event.dialog = dialog;
					var table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					for (var i = 0; i < skills.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						// @ts-ignore
						td.link = skills[i];
						table.appendChild(td);
						td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
						//@ts-ignore
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
							if (_status.dragged) return;
							// @ts-ignore
							if (_status.justdragged) return;
							// @ts-ignore
							_status.tempNoButton = true;
							setTimeout(function () {
								// @ts-ignore
								_status.tempNoButton = false;
							}, 500);
							// @ts-ignore
							var link = this.link;
							if (!this.classList.contains("bluebg")) {
								if (rSkill.length >= 1) return;
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

					// @ts-ignore
					event.switchToAuto = function () {
						// @ts-ignore
						event.dialog.close();
						// @ts-ignore
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					};
					// @ts-ignore
					event.control = ui.create.control("ok", function (link) {
						// @ts-ignore
						event.dialog.close();
						// @ts-ignore
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					});
					// @ts-ignore
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						// @ts-ignore
						event.dialog.buttons[i].classList.add("selectable");
					}
					game.pause();
					game.countChoose();
				};
				// @ts-ignore
				if (event.isMine()) {
					chooseButton(list, skills);
				}
				// @ts-ignore
				else if (event.isOnline()) {
					// @ts-ignore
					event.player.send(chooseButton, list, skills);
					// @ts-ignore
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}
				"step 1";
				// @ts-ignore
				var map = event.result || result;
				if (map && map.skills && map.skills.length) {
					// @ts-ignore
					for (var i of map.skills) player.addSkillLog(i);
				}
				// @ts-ignore
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
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		//爱国者
		xinjunxingmrfz: {
			audio: 2,
			direct: true,
			locked: true,
			derivation: ["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"],
			trigger: {
				player: ["phaseChange", "drawAfter", "loseAfter"],
			},
			filter: function (event, player) {
				if (event.name === "draw") return event.num > 0;
				else if (event.name === "lose") return event.type == "discard";
				else if (event.name === "phase") return !player.storage.xinjunxingmrfz || !player.storage.xinjunxingmrfz.isSubset(player.getSkills(null, false, false));
				return false;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				if (!Array.isArray(player.storage.xinjunxingmrfz)) player.storage.xinjunxingmrfz = [];
				if (trigger.name === "draw") {
					player.storage.xinjunxingmrfz = ["sptunjiang", "reqiaobian"];
				} else if (trigger.name === "lose") {
					player.storage.xinjunxingmrfz = ["xinlvli", "rezhanjue"];
				} else {
					await player.removeSkill(["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"]);
					player.addSkill(player.storage.xinjunxingmrfz);
					// @ts-ignore
					player.logSkill("xinjunxingmrfz");
				}
			},
		},
		youjimrfz: {
			//audio:2,
			onremove: true,
			forced: true,
			init: function (player) {
				player.storage.youjimrfz = [];
			},
			trigger: {
				player: "phaseBegin",
			},
			content: function () {
				"step 0";
				// @ts-ignore
				if (player.isUnderControl()) {
					// @ts-ignore
					game.swapPlayerAuto(player);
				}
				var chooseButton = function (phases) {
					var event = _status.event;
					// @ts-ignore
					if (!event._result) event._result = {};
					event._result.phases = [];
					event._result.phases2 = [];
					var endphases = event._result.phases;
					// @ts-ignore
					var rphases = event._result.phases2;
					var dialog = ui.create.dialog("【游击】:你可以掉换执行阶段的顺序</br>执行顺序为由左到右依次执行", "hidden");
					// @ts-ignore
					event.dialog = dialog;
					var table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					var tdList = [];
					var clickHandler = function () {
						if (_status.dragged) return;
						// @ts-ignore
						if (_status.justdragged) return;
						// @ts-ignore
						_status.tempNoButton = true;
						setTimeout(function () {
							// @ts-ignore
							_status.tempNoButton = false;
						}, 500);
						// @ts-ignore
						var link = this.link;
						// @ts-ignore
						if (!this.classList.contains("bluebg")) {
							if (endphases.length >= 2) return;
							endphases.push(link);
							// @ts-ignore
							this.classList.add("bluebg");
						} else {
							// @ts-ignore
							this.classList.remove("bluebg");
							endphases.splice(endphases.indexOf(link), 1);
						}
						for (var i = 0; i < tdList.length; i++) {
							// @ts-ignore
							if (tdList[i] !== this) {
								tdList[i].classList.remove("bluebg");
							}
						}

						if (endphases.length == 2) {
							var index1 = phases.indexOf(endphases[0]);
							var index2 = phases.indexOf(endphases[1]);
							if (index1 >= 0 && index2 >= 0 && index1 < tdList.length && index2 < tdList.length) {
								var tempNode = tdList[index1];
								var tempNode2 = tdList[index2];
								var tempLink = tempNode.link;
								// @ts-ignore
								var tempIndex = phases.indexOf(tempNode.link);

								tempNode.link = tempNode2.link;
								//@ts-ignore
								tempNode.innerHTML = "<span>" + get.tranPhase(tempNode2.link) + "</span>";
								tempNode2.link = tempLink;
								//@ts-ignore
								tempNode2.innerHTML = "<span>" + get.tranPhase(tempLink) + "</span>";

								phases[index1] = tempNode.link;
								phases[index2] = tempNode2.link;

								tempNode.classList.remove("bluebg");
								tempNode2.classList.remove("bluebg");

								event._result.phases2 = phases;

								event._result.phases.length = 0;
							}
						}
					};
					for (var i = 0; i < phases.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						// @ts-ignore
						td.link = phases[i];
						table.appendChild(td);
						//@ts-ignore
						td.innerHTML = "<span>" + get.tranPhase(phases[i]) + "</span>";
						tdList.push(td);
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickHandler);
					}
					dialog.content.appendChild(table);
					dialog.add("　　");
					dialog.open();

					// @ts-ignore
					event.switchToAuto = function () {
						// @ts-ignore
						event.dialog.close();
						// @ts-ignore
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					};
					// @ts-ignore
					event.control = ui.create.control("ok", function (link) {
						// @ts-ignore
						event.dialog.close();
						// @ts-ignore
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					});
					// @ts-ignore
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						// @ts-ignore
						event.dialog.buttons[i].classList.add("selectable");
					}
					game.pause();
				};
				var switchToAuto = function () {
					_status.imchoosing = false;
					// @ts-ignore
					event._result = {
						bool: true,
						phases2: ["phaseUse", "phaseDraw", "phaseDiscard", "phaseZhunbei", "phaseJieshu", "phaseJudge"],
					};
					// @ts-ignore
					if (event.dialog) event.dialog.close();
					// @ts-ignore
					if (event.control) event.control.close();
				};
				// @ts-ignore
				if (event.isMine()) {
					// @ts-ignore
					chooseButton(trigger.phaseList);
				}
				// @ts-ignore
				else if (event.isOnline()) {
					// @ts-ignore
					event.player.send(chooseButton, trigger.phaseList);
					// @ts-ignore
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}
				"step 1";
				// @ts-ignore
				var map = event.result || result;
				// @ts-ignore
				trigger.phaseList = map.phases2.length ? map.phases2 : trigger.phaseList; //怎么真的会有人不选阶段的Xd
				// @ts-ignore
				game.log(player, "阶段执行顺序为", `#y${get.translation(trigger.phaseList)}`);
			},
		},
		//斗士塔露拉
		juhuomrfz: {
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
				return "【聚火】:是否增加" + num + "点体力上限（此牌点数<span class=firetext>" + (player.hp < num2 ? "大于" : "不大于") + "</span>你的体力值）";
			},
			content: function () {
				"step 0";
				// @ts-ignore
				var num = player.getHistory("sourceDamage", function (evt) {
					// @ts-ignore
					return evt.card == trigger.card;
				}).length;
				// @ts-ignore
				player.gainMaxHp(num);
				"step 1";
				// @ts-ignore
				var num2 = trigger.card.number;
				// @ts-ignore
				if (num2 > player.hp) {
					// @ts-ignore
					player.drawTo(player.maxHp);
				} else {
					// @ts-ignore
					player.loseMaxHp(player.maxHp - num2);
					// @ts-ignore
					player.recoverTo(player.maxHp);
				}
				// @ts-ignore
				player.addTempSkill("juhuomrfz_ban", { global: "phaseEnd" });
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		xuehengmrfz: {
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
			content: function () {
				"step 0";
				// @ts-ignore
				player.awakenSkill("xuehengmrfz");
				// @ts-ignore
				player.removeSkill("juhuomrfz");
				"step 1";
				// @ts-ignore
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
				// @ts-ignore
				var dead = hasfriendDeath(player, player.identity);
				// @ts-ignore
				if (player.countCards("h") > player.hp && dead == false) {
					// @ts-ignore
					player.addSkill("hantianmrfz");
				} else {
					// @ts-ignore
					player.node.name.innerHTML = "塔露拉？";
					// @ts-ignore
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
					// @ts-ignore
					player.addSkill("shihunmrfz");
				}
				// @ts-ignore
				player.recoverTo(player.maxHp);
			},
		},
		shihunmrfz: {
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
		hantianmrfz: {
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
			content: function () {
				"step 0";
				for (var i of game.players) {
					// @ts-ignore
					if (player.identity == "nei" && i == player) i.addMark("hantianmrfz");
					// @ts-ignore
					if ((player.identity == "zhu" && i.identity == "zhong") || (player.identity == "zhong" && i.identity == "zhu")) {
						i.addMark("hantianmrfz");
					}
					// @ts-ignore
					if (player.identity == i.identity) i.addMark("hantianmrfz");
				}
				"step 1";
				var targets = game.filterPlayer(current => {
					return current.hasMark("hantianmrfz");
				});
				var num = 0;
				// @ts-ignore
				for (var i = 0; i < targets.length; i++) {
					// @ts-ignore
					var maxhp = targets[i].maxHp;
					if (maxhp > num) num = maxhp;
				}
				for (var i of targets) {
					i.gainMaxHp(num - i.maxHp);
				}
				"step 2";
				var targets = game.filterPlayer(current => {
					return current.hasMark("hantianmrfz");
				});
				for (var i of targets) {
					// @ts-ignore
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
					content: function () {
						"step 0";
						// @ts-ignore
						event.sources = game
							.filterPlayer(current => {
								// @ts-ignore
								return current.hasMark("hantianmrfz") && current != trigger.player;
							})
							.sortBySeat();
						// @ts-ignore
						event.targets = trigger.targets;
						"step 1";
						// @ts-ignore
						var current = event.sources.shift();
						var targets = [];
						// @ts-ignore
						event.draw = current;
						// @ts-ignore
						for (var i of event.targets) {
							if (!i.isIn()) continue;
							if (!current.canUse("sha", i, false)) continue;
							targets.push(i);
						}
						if (current.isIn() && (_status.connectMode || current.hasSha())) {
							// @ts-ignore
							current
								.chooseToUse(function (card, player, event) {
									if (get.name(card) != "sha") return false;
									// @ts-ignore
									return lib.filter.filterCard.apply(this, arguments);
									// @ts-ignore
								}, "【熯天】：是否对" + get.translation(targets) + "使用一张杀？")
								.set("targetRequired", true)
								.set("complexSelect", true)
								.set("filterTarget", function (card, player, target) {
									// @ts-ignore
									if (!_status.event.sourcex.includes(target)) return false;
									// @ts-ignore
									return lib.filter.targetEnabled.apply(this, arguments);
								})
								.set("sourcex", targets)
								.set("logSkill", "hantianmrfz")
								.set("addCount", false);
						}
						"step 2";
						// @ts-ignore
						if (result.bool) event.draw.draw();
						// @ts-ignore
						if (event.sources.length > 0) event.goto(1);
					},
				},
			},
		},

		//特蕾西娅
		bojimrfz: {
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
					const {cards} = await targets[0]
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
						var dialog = ui.create.dialog(get.translation(player) + "发动了【博济】<br>" + get.translation(player) + "展示牌的颜色为" + get.translation(player.storage.bojimrfz.color), cards);
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
					content() {
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
					content() {
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
		caijianmrfz: {
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

		// 桥夹克里夫
		chongxiemrfz: {
			marktext: "弹药",
			intro: {
				name: "弹药",
				content: "共有#枚弹药",
			},
			trigger: {
				player: "useCardToPlayered",
			},
			// @ts-ignore
			filter: function (event, player) {
				// @ts-ignore
				if (event.getParent().triggeredTargets3.length > 1) return false;
				if (get.name(event.card) == "sha") return true;
				return false;
			},
			direct: true,
			// @ts-ignore
			async content(event, trigger, player) {
				const {targets} = await player
					// @ts-ignore
					.chooseTarget(get.prompt("chongxiemrfz"), "你可以弃置其中一名角色的手牌", function (card, player, target) {
						return (_status.event.targets.includes(target) || target == player) && target.countDiscardableCards(player, "h");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						if (
							player.countCards("h", card => {
								return get.value(card) < 6;
							}) &&
							player == target
						)
							return 114514;
						return 2 - get.attitude(_status.event.player, target);
					})
					.set("targets", trigger.targets)
					.forResult();
				if (!targets) return;
				var target = targets[0];
				// @ts-ignore
				player.logSkill("chongxiemrfz", target);
				const {links} = await player.discardPlayerCard("h", target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.guohe.ai.button).forResult();
				if (!links) return;
				if (player == target) player.draw();
				if (get.color(links[0]) == "black") {
					// @ts-ignore
					if (trigger.addCount !== false) {
						// @ts-ignore
						trigger.addCount = false;
						trigger.player.getStat().card.sha--;
					}
				} else if (get.color(links[0]) == "red") {
					player.addMark("chongxiemrfz", 1, false);
				} else return;
			},
		},
		qj_chongjimrfz: {
			enable: "chooseToUse",
			filter: function (event, player) {
				if (player.countMark("chongxiemrfz") < 1 || !player.isPhaseUsing()) return false;
				return event.filterCard({ name: "sha" }, player, event);
			},
			// @ts-ignore
			async content(event, trigger, player) {
				await player.chooseUseTarget({ name: "sha", nature: "thunder", isCard: true }, true, "nodistance");
				player.removeMark("chongxiemrfz", 1, false);
			},
			ai: {
				order: 2.95,
				respondSha: true,
				// @ts-ignore
				skillTagFilter: function (player, tag, arg) {
					if (player.countMark("chongxiemrfz") < 1 || !player.isPhaseUsing()) return false;
				},
			},
		},
		leitingmrfz: {
			init: function (player) {
				player.storage.leitingmrfz = false;
			},
			limited: true,
			skillAnimation: true,
			animationColor: "gray",
			trigger: {
				player: "phaseUseBegin",
			},
			// @ts-ignore
			filter: function (event, player) {
				return player.countMark("chongxiemrfz") > 5 && !player.storage.leitingmrfz;
			},
			// @ts-ignore
			check: function (event, player) {
				if (player.hasUnknown()) return false;
				return true;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player.removeMark("chongxiemrfz", 6, false);
				const {targets} = await player
					.chooseTarget(true, "【雷霆】:请选择一个其他角色，对其使用6张雷【杀】")
					// @ts-ignore
					.set("filterTarget", (card, player, target) => {
						return player.canUse({ name: "sha", nature: "thunder", isCard: true }, target, false) && player != target;
					})
					.set("ai", target => {
						return get.attitude(_status.event.player, target) < 0;
					})
					.forResult();
				if (!targets) return;
				let num = 6;
				while (num > 0) {
					if (!targets[0].isIn()) break;
					if (player.canUse({ name: "sha", nature: "thunder", isCard: true }, targets[0], false)) {
						await player.useCard({ name: "sha", nature: "thunder", isCard: true }, targets[0]);
					}
					num--;
				}
				player.storage.leitingmrfz = true;
				// @ts-ignore
				_status.SJZX_tmpleitingmrfz = targets[0];
				player
					.when({
						player: "phaseEnd",
						global: "dieAfter",
					})
					// @ts-ignore
					.filter((event, player) => {
						// @ts-ignore
						var target = _status.SJZX_tmpleitingmrfz;
						if (event.name == "phase") return true;
						else return event.player == target;
					})
					.then(() => {
						// @ts-ignore
						var target = _status.SJZX_tmpleitingmrfz;
						if (trigger.name == "die") {
							player.storage.leitingmrfz = false;
							// @ts-ignore
							player.logSkill("leitingmrfz", target);
						}
						// @ts-ignore
						delete _status.SJZX_tmpleitingmrfz;
					});
			},
		},

		// 特雷西斯
		yuanfumrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			audio: 2,
			trigger: {
				player: "phaseDrawEnd",
			},
			forced: true,
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const {cards} = await player
					.chooseCard(true)
					.set("prompt", "【怨府】:请展示一张手牌")
					.set("ai", card => {
						var storage = player.storage.yuanfumrfz;
						if (storage.length > 1) return Math.random();
						if (storage.includes(get.color(card))) return -9999;
						return get.color(card) == "red" ? 10 : 0 - get.value(card);
					})
					.set("storage", player.storage.yuanfumrfz)
					.forResult();
				if (!cards) return;
				// @ts-ignore
				player.showCards(cards, `${get.translation(player)}因【怨府】而展示的牌`);
				for (var i of game.players) {
					if (i == player) continue;
					i.addTempSkill("yuanfumrfz_eff", { global: "phaseAfter" });
					if (!i.storage.yuanfumrfz_eff) i.storage.yuanfumrfz_eff = [];
					i.storage.yuanfumrfz_eff.add(get.color(cards[0]));
				}
				player.storage.yuanfumrfz.add(get.color(cards[0]));
				player.addTempSkill("yuanfumrfz_clear", { global: "phaseBegin" });
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: { player: "phaseEnd" },
					content() {
						// @ts-ignore
						player.logSkill("yuanfumrfz");
						// @ts-ignore
						player.storage.yuanfumrfz = [];
						// @ts-ignore
						player.loseHp();
						// @ts-ignore
						var num = player.getStat("damage");
						// @ts-ignore
						if (num && num > 0) player.draw(Math.min(5, num));
					},
				},
				eff: {
					mark: true,
					intro: {
						// @ts-ignore
						content(event, player) {
							return `无法使用或打出手牌中${get.translation(player.storage.yuanfumrfz_eff)}的牌`;
						},
					},
					mod: {
						cardEnabled: function (card, player) {
							var colors = player.storage.yuanfumrfz_eff;
							if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player.isDying()) return false;
						},
						cardSavable: function (card, player) {
							var colors = player.storage.yuanfumrfz_eff;
							if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player.isDying()) return false;
						},
						cardEnabled2(card, player) {
							var colors = player.storage.yuanfumrfz_eff;
							if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player.isDying()) return false;
						},
					},
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: { player: "phaseEnd" },
					content() {
						// @ts-ignore
						delete player.storage.yuanfumrfz;
					},
					ai: {
						effect: {
							// @ts-ignore
							target(card, player, target) {
								var colors = target.storage.yuanfumrfz_eff;
								if (get.tag(card, "damage") && colors && colors.includes(get.color(card))) return [0, -999999];
							},
						},
					},
				},
			},
		},
		fenzhoumrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			// @ts-ignore
			filter(event, player) {
				return player.hasEnabledSlot(1) || player.hasEnabledSlot(2) || player.hasEnabledSlot(5) || player.hasEnabledSlot("horse");
			},
			// @ts-ignore
			async content(event, trigger, player) {
				var {control} = await player
					.chooseToDisable(true)
					.set("ai", function (event, player, list) {
						if (list.includes("equip5")) return "equip5";
						else if (list.includes("equip2")) return "equip2";
						else if (list.includes("horse")) return "horse";
						return "equip1";
					})
					.forResult();
				if (!control) return;
				let targets = game.players.slice().remove(player);
				// @ts-ignore
				var getChooseList = function (event, player, target) {
					let list = [];
					let chooseList = [`弃置一张牌，本回合你下次受到的伤害+1`, `交给${get.translation(player)}一张牌，本回合${get.translation(player)}使用【杀】的次数+1`, `令${get.translation(player)}摸一张牌，本回合${get.translation(player)}下次造成的伤害+1`];
					if (target.countCards("h") > 0) {
						list.push("选项一");
						list.push("选项二");
					} else {
						chooseList[0] = '<span style="opacity:0.5; ">' + chooseList[0] + "（你没有牌）</span>";
						chooseList[1] = '<span style="opacity:0.5; ">' + chooseList[1] + "（你没有牌）</span>";
					}
					list.push("选项三");
					return {
						list: list,
						chooseList: chooseList,
					};
				};
				while (targets.length > 0) {
					var target = targets[0];
					if (!target.isIn()) {
						targets.shift();
						continue;
					}
					if (!player.isIn()) {
						break;
					}
					var list = getChooseList(event, player, target).list,
						chooseList = getChooseList(event, player, target).chooseList;
					var {control} = await target
						.chooseControl(list)
						.set("choiceList", chooseList)
						.set("prompt", "请选择一项")
						.set("ai", () => {
							// @ts-ignore
							var list = _status.event.list,
								player = _status.event.player,
								target = _status.event.target;
							if (get.attitude(player, target) > 0) {
								if (list.includes("选项二")) return ["选项二", "选项三"].randomGet();
								return "选项三";
							} else {
								if (list.includes("选项二") && player.getCards("h").filter(card => get.value(card) < 6)) return "选项二";
								if (list.includes("选项一")) return "选项一";
							}
							return list.randomGet();
						})
						.set("list", list)
						.set("target", player)
						.forResult();
					if (!control) {
						targets.shift();
						continue;
					}
					switch (control) {
						case "选项一":
							target.chooseToDiscard(true, "【焚舟】:请弃置一张手牌", "h");
							target.addMark("fenzhoumrfz_eff1", 1, false);
							target.addTempSkill("fenzhoumrfz_eff1", { player: ["damageEnd", "phaseEnd"] });
							break;
						case "选项二":
							var {cards} = await target
								.chooseCard("h", `【焚舟】:请交给${get.translation(player)}一张手牌`, true)
								.set("ai", card => {
									var player = _status.event.player,
										target = _status.event.target;
									var num = get.value(card),
										att = get.attitude(player, target);
									if (get.tag(card, "damage")) num += (att > 0 ? 1 : -1) * get.value(card);
									return (att > 0 ? 1 : -1) * get.value(card);
								})
								.set("target", player)
								.forResult();
							if (cards) {
								target.give(cards, player);
							}
							player.addMark("fenzhoumrfz_eff2", 1, false);
							player.addTempSkill("fenzhoumrfz_eff2", { player: "phaseEnd" });
							break;
						case "选项三":
							player.draw();
							player.addMark("fenzhoumrfz_eff3", 1, false);
							player.addTempSkill("fenzhoumrfz_eff3", {
								player: "phaseEnd",
								source: "damageEnd",
							});
							break;
					}
					targets.shift();
				}
			},
			subSkill: {
				eff1: {
					mark: true,
					intro: {
						content: "本回合下次受到的伤害+#",
					},
					onremove: true,
					charlotte: true,
					forced: true,
					trigger: { player: "damageBegin2" },
					// @ts-ignore
					filter(event, player) {
						return player.countMark("fenzhoumrfz_eff1") > 0;
					},
					content() {
						// @ts-ignore
						trigger.num += player.countMark("fenzhoumrfz_eff1");
					},
				},
				eff2: {
					mark: true,
					intro: {
						content: "本回合使用【杀】的次数+#",
					},
					onremove: true,
					charlotte: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + player.countMark("fenzhoumrfz_eff2");
						},
					},
				},
				eff3: {
					mark: true,
					intro: {
						content: "本回合下次造成的伤害+#",
					},
					onremove: true,
					charlotte: true,
					forced: true,
					trigger: { source: "damageBegin2" },
					// @ts-ignore
					filter(event, player) {
						return player.countMark("fenzhoumrfz_eff3") > 0;
					},
					content() {
						// @ts-ignore
						trigger.num += player.countMark("fenzhoumrfz_eff3");
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},

		// 普瑞赛斯
		// TODO 等剧情更新后在重新设计
		bianyimrfz: {
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
				const {links} =
					event.isMine() == false
						? {links:autoChoose(list, findWord)}
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
					const {index} =
						findkey.length == 1
							? {index:0}
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

		// 新 斗士塔露拉
		talula_shixinmrfz: {
			audio: 2,
			trigger: {
				source: "damageEnd",
			},
			filter(event, player) {
				return event.player && event.player.isIn() && !!event.player.countGainableCards(player, "hes");
			},
			async content(event, trigger, player) {
				var pos = [];
				for (var i of trigger.player.getCards("hes")) {
					pos.add(get.position(i));
				}
				var {cards} = await player
					.choosePlayerCard("hes", trigger.player, true)
					.set("prompt", `【拾薪】:请选择其各区域内的一张牌`)
					.set("selectButton", pos.length)
					.set("filterButton", button => {
						let cards = ui.selected.cards;
						let pos = cards.slice().map(card => get.position(card));
						return !pos.includes(get.position(button));
					})
					.set("complexSelect", true)
					.set("ai", lib.card.shunshou.ai.button)
					.forResult();
				if (!cards) return;
				if (_status.connectMode)
					// @ts-ignore
					game.broadcastAll(function () {
						// @ts-ignore
						_status.noclearcountdown = true;
					});
				// @ts-ignore
				event.given_map = {};
				while (cards.length > 0) {
					var {links} =
						cards.length == 1
							? {links:cards}
							: await player
									.chooseCardButton("【拾薪】:请选择要分配的牌", true, cards, [1, cards.length])
									.set("ai", () => {
										if (ui.selected.buttons.length == 0) return 1;
										return 0;
									})
									.forResult();
					if (!links) continue;
					// @ts-ignore
					event.togive = links.slice();
					cards.removeArray(links);
					const {targets} = await player
						// @ts-ignore
						.chooseTarget("选择一名角色获得" + get.translation(event.togive), true)
						.set("ai", target => {
							const att = get.attitude(_status.event.player, target);
							// @ts-ignore
							if (_status.event.enemy) {
								return -att;
							} else if (att > 0) {
								return att / (1 + target.countCards("h"));
							} else {
								return att / 100;
							}
						})
						// @ts-ignore
						.set("enemy", get.value(event.togive[0], player, "raw") < 0).forResult();
					if (targets) {
						const id = targets[0].playerid,
							// @ts-ignore
							map = event.given_map;
						if (!map[id]) map[id] = [];
						// @ts-ignore
						map[id].addArray(event.togive);
					}
				}
				if (_status.connectMode) {
					// @ts-ignore
					game.broadcastAll(function () {
						// @ts-ignore
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				const list = [];
				// @ts-ignore
				for (const i in event.given_map) {
					const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					player.line(source, "green");
					if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.2);
					// @ts-ignore
					list.push([source, event.given_map[i]]);
				}
				game.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				}).setContent("gaincardMultiple");
			},
		},
		zhuoximrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			audio: 2,
			trigger: {
				player: "useCard",
			},
			filter(event, player) {
				if (!event.card) return false;
				return (
					!player.storage.zhuoximrfz.includes(get.type2(event.card)) &&
					game.hasPlayer(current => {
						return get.distance(current, player) == player.hp && current != player;
					})
				);
			},
			// @ts-ignore
			async cost(event, trigger, player) {
				const { result } = await player
					.chooseTarget(`【灼息】:你可以对一名与你距离为${player.hp}的角色造成一点火焰伤害`)
					// @ts-ignore
					.set("filterTarget", (card, player, target) => {
						return get.distance(target, player) == player.hp && target != player;
					})
					.set("ai", target => {
						var player = get.event().player;
						return get.damageEffect(target, player, player, "fire") > 0;
					});
				if (!result) return;
				event.result = result;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				target.damage("fire");
				player.line(target);
				if (!player.storage.zhuoximrfz) player.storage.zhuoximrfz = [];
				player.storage.zhuoximrfz.add(get.type2(trigger.card));
			},
			group: "zhuoximrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					content() {
						// @ts-ignore
						player.storage.zhuoximrfz = [];
					},
				},
			},
		},

		// 双王 特蕾西娅&&特雷西斯
		chenke1mrfz: {
			audio: "chenkemrfz",
		},
		chenke2mrfz: {
			audio: "chenkemrfz",
		},
		chenke3mrfz: {
			audio: "chenkemrfz",
		},
		chenkemrfz: {
			extraSkills: ["duwu", "neifa", "maihuo", "spyanhuo", "xinfu_sidao", "dclibang", "zengou", "drlt_siyong", "jiaozi", "rewangzun", "nzry_cunmu", "jiuchi", "benghuai", "zhaoluan", "wumo", "taoluan", "jishe", "huisheng", "shifei", "huaiyi", "oltuishi", "olxiaofan", "oljuanxia", "olgoude", "dcwujie"],
			getNegative(player) {
				let banSkills = ["nscesuan", "zhaohuo", "rekurou"];
				let skillTemps = [];
				let arrs = Object.keys(lib.skill);
				let hasSkills = Object.values(lib.character)
					.map(i => i[3])
					.flat();
				for (let key of arrs) {
					if (banSkills.includes(key)) continue;
					if (hasSkills.includes(key) && lib.translate[key] && !player.hasSkill(key) && (lib.skill.chenkemrfz.extraSkills.includes(key) || get.skillRank(key) < 0)) skillTemps.push(key);
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
		gujimrfz: {
			onremove(player) {
				delete player.storage.chenkemrfz;
			},
			audio: 2,
			derivation: ["bengjiemrfz"],
			trigger: { global: "roundStart" },
			// @ts-ignore
			filter(event, player) {
				return game.roundNumber > 4;
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				let skills = player.getOriginalSkills();
				skills.push(...["guguomrfz", "xingjunmrfz", "datongmrfz"]);
				for (let skill of skills) {
					await player.removeSkill(skill);
				}
				player.addSkill("bengjiemrfz");
				player.sex = "male";
				game.log(player, "将性别变为了", "#y男性");
				player.node.avatar.setBackgroundImage("extension/whitherHelm/image/orther/shuangwang2mrfz.jpg");
			},
		},
		jiangqingmrfz: {
			audio: 2,
			derivation: ["guguomrfz", "xingjunmrfz", "datongmrfz"],
			init(player) {
				player.storage.jiangqingmrfz = {
					0: {
						intro: "弃置两种不同颜色的牌，获得“固国”",
						// @ts-ignore
						filter(event, player) {
							return ["red", "black"].every(i =>
								player
									.getCards("hes")
									.map(j => get.color(j))
									.includes(i)
							);
						},
						// @ts-ignore
						async content(event, trigger, player) {
							const bool = await player
								.chooseToDiscard(true, "弃置两种不同颜色的牌，获得“固国”", 2)
								.set("ai", card => 8 - get.value(card))
								.set("filterCard", (card, player) => !ui.selected.cards.some(cardx => get.color(cardx, player) == get.color(card, player)))
								.set("complexCard", true)
								.forResult("bool");
							if (bool === true) {
								player.addSkill("guguomrfz");
								delete player.storage.jiangqingmrfz[0];
								let original = player.getSkills(null, false, false).filter(i => {
									return player.getOriginalSkills().includes(i);
								});
								player.removeSkill(original[0]);
								return true;
							}
						},
					},
					1: {
						intro: "弃置三种不同类型的牌，获得“兴军”",
						// @ts-ignore
						filter(event, player) {
							return ["trick", "basic", "equip"].every(i =>
								player
									.getCards("hes")
									.map(j => get.type2(j))
									.includes(i)
							);
						},
						// @ts-ignore
						async content(event, trigger, player) {
							const bool = await player
								.chooseToDiscard(true, "弃置三种不同类型的牌，获得“兴军”", 3)
								.set("ai", card => 8 - get.value(card))
								.set("filterCard", (card, player) => !ui.selected.cards.some(cardx => get.type2(cardx, player) == get.type2(card, player)))
								.set("complexCard", true)
								.forResult("bool");
							if (bool === true) {
								player.addSkill("xingjunmrfz");
								delete player.storage.jiangqingmrfz[1];
								let original = player.getSkills(null, false, false).filter(i => {
									return player.getOriginalSkills().includes(i);
								});
								player.removeSkill(original[0]);
								return true;
							}
						},
					},
					2: {
						intro: "弃置四种不同花色的牌，获得“大同”",
						// @ts-ignore
						filter(event, player) {
							return lib.suit.every(i =>
								player
									.getCards("hes")
									.map(j => get.suit(j))
									.includes(i)
							);
						},
						// @ts-ignore
						async content(event, trigger, player) {
							const bool = await player
								.chooseToDiscard(true, "弃置四种不同花色的牌，获得“大同”", 4)
								.set("ai", card => 8 - get.value(card))
								.set("filterCard", (card, player) => !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player)))
								.set("complexCard", true)
								.forResult("bool");
							if (bool === true) {
								player.addSkill("datongmrfz");
								delete player.storage.jiangqingmrfz[2];
								let original = player.getSkills(null, false, false).filter(i => {
									return player.getOriginalSkills().includes(i);
								});
								player.removeSkill(original[0]);
								return true;
							}
						},
					},
					3: {
						intro: "失去两点体力和体力上限、失去所有不因此技能而获得的技能。",
						// @ts-ignore
						filter(event, player) {
							return true;
						},
						// @ts-ignore
						async content(event, trigger, player) {
							await player.loseHp(3);
							await player.loseMaxHp(3);
							let gainSkills = ["guguomrfz", "xingjunmrfz", "datongmrfz"];
							let skills = player.getSkills(null, false, false).filter(i => {
								const info = get.info(i);
								if (gainSkills.includes(i)) return false;
								return !info || !info.charlotte;
							});
							for (let skill of skills) {
								player.removeSkill(skill);
							}
							player.drawTo(player.maxHp);
							return true;
						},
					},
				};
			},
			forced: true,
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				let info = player.storage.jiangqingmrfz;
				let keys = Object.keys(info);
				return info[keys[0]].filter(event, player);
			},
			async content(event, trigger, player) {
				let info = player.storage.jiangqingmrfz;
				for (let i of [0, 1, 2, 3]) {
					if (!get.is.object(info[i])) continue;
					if (!info[i].filter(event, player)) return;
					const bool = await info[i].content(event, trigger, player);
					if (bool !== true) break;
					// @ts-ignore
					player.logSkill("jiangqingmrfz");
				}
			},
		},
		bengjiemrfz: {
			audio: 2,
			intro: {
				// @ts-ignore
				content(event, player) {
					let num = lib.skill.bengjiemrfz.getX(player);
					return `当前X为:${num}`;
				},
			},
			getX(player) {
				return Math.max(
					0,
					player.getSkills(null, false, false).filter(i => {
						const info = get.info(i);
						const banSkills = player.storage.chenkemrfz || [];
						if (banSkills.includes(i)) return false;
						return !info || !info.charlotte;
					}).length - player.countMark("bengjiemrfz")
				);
			},
			trigger: {
				player: ["phaseEnd", "damageBegin"],
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				if (trigger.name === "damage") {
					trigger.num += game.roundNumber;
				} else {
					let num = lib.skill.bengjiemrfz.getX(player);
					await player.draw(num);
					player.addMark("bengjiemrfz", Math.floor(num / 2), false);
				}
			},
		},
		guguomrfz: {
			mod: {
				// @ts-ignore
				globalFrom(from, to, distance) {
					return distance - lib.skill.bengjiemrfz.getX(from);
				},
			},
			audio: 1,
			trigger: { player: "phaseDrawBegin2" },
			// @ts-ignore
			filter(event, player) {
				return !event.numFixed;
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				trigger.num += lib.skill.bengjiemrfz.getX(player);
			},
		},
		xingjunmrfz: {
			audio: 1,
			trigger: { source: "damageEnd" },
			forced: true,
			// @ts-ignore
			filter(event, player) {
				return event.card && event.card.name === "sha";
			},
			content() {
				// @ts-ignore
				player.draw();
			},
			mod: {
				cardUsable(card, player, num) {
					if (card.name == "sha") return num + lib.skill.bengjiemrfz.getX(player);
				},
			},
		},
		datongmrfz: {
			init(player) {
				player.link(true);
			},
			global: "datongmrfz_buff",
			audio: 1,
			trigger: {
				player: ["linkBefore", "enterGame"],
				global: "phaseBefore",
			},
			forced: true,
			filter(event, player) {
				if (event.name == "link") return player.isLinked();
				return (event.name != "phase" || game.phaseNumber == 0) && !player.isLinked();
			},
			content() {
				// @ts-ignore
				if (trigger.name != "link") player.link(true);
				// @ts-ignore
				else trigger.cancel();
			},
			group: "datongmrfz_revival",
			subSkill: {
				revival: {
					audio: "datongmrfz",
					forced: true,
					trigger: { source: "dieAfter" },
					// @ts-ignore
					filter(event, player) {
						return get.mode() == "identity";
					},
					// @ts-ignore
					async content(event, trigger, player) {
						let target = trigger.player;
						await target.revive();
						target.recoverTo(2);
						//@ts-ignore
						target.drawTo(2);
						if (player.identity != "zhu") target.identity = player.identity;
						else target.identity = "zhong";
						target.node.identity.dataset.color = target.identity;
						target.identityShown = true;
						target.setIdentity(target.identity);
					},
				},
				buff: {
					mod: {
						maxHandcard(player, num) {
							if (game.hasPlayer(current => current.hasSkill("datongmrfz")) && player.isLinked()) return num + lib.skill.bengjiemrfz.getX(player);
						},
					},
				},
			},
			ai: {
				effect: {
					target(card) {
						if (card.name == "tiesuo") return "zeroplayertarget";
					},
				},
			},
		},

		// 新ACE
		newsizhanmrfz: {
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
				const {index} = await player
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
		ehoumrfz: {
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

		// 新普瑞赛斯
		qianmianmrfz: {
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
				return ((event.respondTo && event.respondTo[0] !== player) || event.type === "wuxie") && player.countCards("h") > 0 && lib.skill.qianmianmrfz.getResAndUseCard(event, player).length > 0;
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
		neihuamrfz: {
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
	},
};
