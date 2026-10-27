import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_136_hsguma", { pack: "legendSJZX", sex: "female", group: "longmrfz", hp: 5, maxHp: 5, skills: ["xinboremrfz", "xinyizhongmrfz"] });

skill({
	xinboremrfz: {
		audio: ["作战中1","作战中2","作战中3","作战中4"],
		mark: false,
		markimage: "extension/WhichWay/image/skill/xinboremrfz.png",
		intro: {
			content: function (player) {
				let playerhas = game.findPlayer(function (current) {
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
					if (event.targets?.length > 1 || get.type(event.card) == "equip") return false;
					return event.target.hasMark("xinboremrfz") && player.getHandcardLimit() > 0;
				},
				prompt: function (event, player) {
					return "【般若】：是否令" + get.translation(event.card) + "的目标由" + get.translation(event.target) + "改为你？";
				},
				check: function (event, player) {
					let att = get.attitude(event.target, player);
					if ((event.card.name == "wuzhong" || event.card.name == "dongzhuxianji" || event.card.name == "zenbing") && att < 0) return true;
					return att > 0 && get.tag(event.card, "damage");
				},
				async content(event, trigger, player) {
					const target = trigger.target;
					trigger.targets.remove(target);
					trigger.getParent()!.triggeredTargets1.remove(target);
					trigger.untrigger();
					game.delayx();

					trigger.targets.push(player);
					trigger.player.line(player, "fire");
					game.log(trigger.card, "的目标被改为", player);
					player.addMark("xinboremrfz_losehdlimit", 1, false);
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
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget({
							// 	true, "【般若】：请选择一名其他角色，令其获得‘般若’标记", function (card, player, target) {
							// 	return target != player;
							// })
							forced: true,
							prompt: "【般若】：请选择一名其他角色，令其获得‘般若’标记",
							filterTarget: lib.filter.notMe,
						})
						.set("ai", target => get.attitude(player, target) > 0)
						.forResult();

					if (result.targets) {
						const target = result.targets[0];
						target.addMark("xinboremrfz");
						player.logSkill("xinboremrfz", target);
						player.disableEquip({slots:["equip2"]});
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
					if (player.hasSkill("xinboremrfz_usedwuxie") && player.hasSkill("xinboremrfz_usedsha") && player.hasSkill("xinboremrfz_usedshan")) return false;
					if (name == "wuxie" && player.hasSkill("xinboremrfz_usedwuxie")) return false;
					if (name == "sha" && player.hasSkill("xinboremrfz_usedsha")) return false;
					if (name == "shan" && player.hasSkill("xinboremrfz_usedshan")) return false;
					return (name == "wuxie" || name == "sha" || name == "shan") && (player.getHandcardLimit() > 0 || player.countDisabledSlot() < 5);
				},
				filter: function (event, player) {
					if (player.hasSkill("xinboremrfz_usedwuxie") && player.hasSkill("xinboremrfz_usedsha") && player.hasSkill("xinboremrfz_usedshan")) return false;
					return player.getHandcardLimit() > 0 || player.countDisabledSlot() < 5;
				},
				chooseButton: {
					dialog: function (event, player) {
						let vcards:any[] = [];
						for (let name of ["sha", "shan", "wuxie"]) {
							const card = { name: name };
							if (name == "wuxie" && player.hasSkill("xinboremrfz_usedwuxie")) continue;
							if (name == "shan" && player.hasSkill("xinboremrfz_usedshan")) continue;
							if (name == "sha" && player.hasSkill("xinboremrfz_usedsha")) continue;
							if (event.filterCard(card, player, event)) {
								//QQQ
								if (name == "sha") {
									vcards.push(["基本", "", "sha"]);
									for (let j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
								} else if (get.type(name) == "trick") {
									vcards.push(["锦囊", "", name]);
								} else if (get.type(name) == "basic") {
									vcards.push(["基本", "", name]);
								}
							}
						}
						let dialog = ui.create.dialog("般若", [vcards, "vcard"], "hidden");
						//@ts-ignore
						dialog.direct = true;
						return dialog;
					},
					filter: function (button, player) {
						//@ts-ignore
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
							async precontent(event, trigger, player) {
								const card = event.result?.card?.name;
								if (card == "sha") {
									//@ts-ignore
									event.getParent().addCount = false;
									player.addSkill("xinboremrfz_usedsha");
								}
								if (card == "shan") player.addSkill("xinboremrfz_usedshan");
								if (card == "wuxie") player.addSkill("xinboremrfz_usedwuxie");
								//@ts-ignore
								player.logSkill("xinboremrfz");

								const list:string[] = [];
								if (player.getHandcardLimit() > 0) list.push("手牌上限-1");
								if (player.countDisabledSlot() < 5) list.push("废除一个装备栏");
								if (list.length > 1) {
									const result = await player
										.chooseControl({controls:list})
										.set("prompt", "【般若】：请选择一项")
										.set("ai", function () {
											return 0;
										})
										.forResult();
									if (result.index == 0) player.addMark("xinboremrfz_losehdlimit", 1, false);
									else
										player.chooseToDisable().ai = function (event, player, list) {
											if (list.includes("equip5")) return "equip5";
											return list.randomGet();
										};
								} else {
									if (player.getHandcardLimit() == 0)
										player.chooseToDisable().ai = function (event, player, list) {
											if (list.includes("equip5")) return "equip5";
											return list.randomGet();
										};
									else player.addMark("xinboremrfz_losehdlimit", 1, false);
								}
							},
						};
					},
					prompt: function (links, player) {
						return "【般若】：视为使用一张【" + get.translation(links[0][2]) + "】";
					},
				},
				ai: {
					order: function (item, player) {
						player = player || _status.event.player;
						let event = _status.event;
						if (event.filterCard({ name: "sha" }, player, event)) {
							return 4;
						}
					},
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player, tag, arg) {
						if (player.hasSkill("xinboremrfz_usedwuxie") && player.hasSkill("xinboremrfz_usedsha") && player.hasSkill("xinboremrfz_usedshan")) return false;
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
				async content(event, trigger, player) {
					player.removeSkill("xinboremrfz_usedshan");
				},
			},
			usedwuxie: {
				silent: true,
				charlotte: true,
				trigger: { global: "phaseZhunbeiBegin" },
				async content(event, trigger, player) {
					player.removeSkill("xinboremrfz_usedwuxie");
				},
			},
			usedsha: {
				silent: true,
				charlotte: true,
				trigger: { global: "phaseZhunbeiBegin" },
				async content(event, trigger, player) {
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
		audio: ["编入队伍","任命队长"],
		forced: true,
		trigger: { player: "phaseZhunbeiBegin" },
		filter: function (event, player) {
			return player.getHandcardLimit() < 20;
		},
		async content(event, trigger, player) {
			const num = 4 - player.countDisabledSlot();
			if(num>0) player.addMark("xinyizhongmrfz", num, false);
			
			const targets = game.filterPlayer(c=>c!==player && c.hasMark("xinboremrfz"));
			if(targets.length>0){
				await game.asyncDraw([...targets,player].sortBySeat(),1);
			}
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
				async content(event, trigger, player) {
					player.removeSkill("xinboremrfz");
					player.removeSkill("xinyizhongmrfz_lose");
				},
			},
		},
	},
});

translate({
	char_136_hsguma: "星熊",
	xinboremrfz: "般若",
	xinboremrfz_info: "①锁定技，游戏开始时，你选择一名其他角色，其获得“般若”标记，然后你废除防具栏并且手牌上限+1。</br>②当有“般若”标记的角色成为非装备牌的唯一目标时，你可以令你的手牌上限-1，然后你成为此牌的目标。</br>③每回合每项限一次，你可以令你的手牌上限-1或废除一个装备栏，视为使用一张：1.【无懈可击】；2.【闪】；3.【杀】（不计入使用次数）。",
	xinyizhongmrfz: "义重",
	xinyizhongmrfz_info: "锁定技，<br>①当你受到伤害后，若伤害来源为有“般若”标记的角色，你失去【般若】;<br>②准备阶段，若你的手牌上限小于20，你的手牌上限+X，然后你与有“般若”标记的角色各摸一张牌。（X = 4 - 你废弃的装备栏数，X至少为0）",
});

characterIntro("char_136_hsguma", "星熊，龙门近卫局特别任务组精英干员。</br>存在数项指控记录。</br>经龙门总督魏彦吾交涉，龙门近卫局依星熊的优异能力与良好表现，破格将其吸纳进近卫局特别督察组。在处理高危险性犯罪事件、要员保护、灾害紧急救援等领域表现出较高专业性。</br>现作为重装干员协助罗德岛行动，并为现场提供战术执行与指挥支援。</br>现作为特别人员协助罗德岛行动，并为现场提供战术指挥支援。");

characterTitle("char_136_hsguma", "重情尚义");
