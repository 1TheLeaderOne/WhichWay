import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("baimianxiaomrfz", { pack: "epicSJZX", sex: "female", group: "lymrfz", hp: 3, skills: ["gushimrfz", "shouzhongmrfz"] });

// 牢白面鸮
// skill({
// 	jinaomrfz: {
// 		audio: 2,
// 		mark: true,
// 		marktext: "机脑",
// 		intro: {
// 			content: function (event, player) {
// 				var storage = player.storage.jinaomrfz;
// 				if (storage == true) return "递增";
// 				if (storage == false) return "递减";
// 				return "无限制";
// 			},
// 		},
// 		trigger: { player: "useCardAfter" },
// 		filter: function (event, player) {
// 			var history = player.getHistory("useCard");
// 			if (history.indexOf(event) != 1) return false;
// 			return history[0].card.number != undefined && history[1].card.number != undefined;
// 		},
// 		direct: true,
// 		async content(event, trigger, player) {
// 			var history = player.getHistory("useCard");
// 			if (history[0].card.number < history[1].card.number) {
// 				player.storage.jinaomrfz = true;
// 				player.marks.jinaomrfz.innerText = "递增";
// 			} else {
// 				player.storage.jinaomrfz = false;
// 				player.marks.jinaomrfz.innerText = "递减";
// 			}
// 			player.storage.jinaomrfz_lim = history[1].card.number;
// 			player.addTempSkill("jinaomrfz_lim", "phaseEnd");
// 		},
// 		group: ["jinaomrfz_draw"],
// 		subSkill: {
// 			handlit: {
// 				onremove: true,
// 				charlotte: true,
// 				intro: {
// 					content: "手牌上限+#",
// 				},
// 				mod: {
// 					maxHandcard: function (player, num) {
// 						return num + player.countMark("jinaomrfz_handlit");
// 					},
// 				},
// 			},
// 			draw: {
// 				trigger: { player: "useCardAfter" },
// 				lastDo: true,
// 				forced: true,
// 				audio: "jinaomrfz",
// 				filter: function (event, player) {
// 					var history = player.getHistory("useCard");
// 					if (history.length < 2) return false;
// 					if (!history[history.length - 2].card.color || get.color(event.card) == "none") return false;
// 					//console.log(history[history.length-2].card.color);console.log(get.color(event.card));
// 					return history[history.length - 2].card.color == get.color(event.card);
// 				},
// 				async content(event, trigger, player) {
// 					var color = get.color(trigger.card);
// 					if (color == "red") player.draw(2);
// 					else {
// 						player.addTempSkill("jinaomrfz_handlit", "phaseEnd");
// 						player.addMark("jinaomrfz_handlit", 1, false);
// 					}
// 				},
// 			},
// 			lim: {
// 				onremove: function (player) {
// 					//@ts-ignore
// 					if (player.marks?.jinaomrfz?.text?.innerText) player.marks.jinaomrfz.text.innerText = "机脑";
// 					delete player.storage.jinaomrfz;
// 					delete player.storage.jinaomrfz_lim;
// 				},
// 				direct: true,
// 				charlotte: true,
// 				trigger: { player: "useCardAfter" },
// 				firstDo: true,
// 				filter: function (event, player) {
// 					if (!event.card.number) return false;
// 					return true;
// 				},
// 				async content(event, trigger, player) {
// 					player.storage.jinaomrfz_lim = trigger.card.number;
// 					var cards = player.getCards("h");
// 					let max = 0,
// 						min = 0,
// 						num = 0;
// 					for (var i = 0; i < cards.length; i++) {
// 						//@ts-ignore
// 						if (typeof cards[i].number === "number") num = cards[i].number;
// 						if (i == 0) {
// 							max = num;
// 							min = num;
// 							continue;
// 						}
// 						if (num > max) max = num;
// 						if (min > num) min = num;
// 					}
// 					if (trigger.card.number >= max) {
// 						player.storage.jinaomrfz = false;
// 						//@ts-ignore
// 						player.marks.jinaomrfz.text.innerText = "递减";
// 						player.draw();
// 						//@ts-ignore
// 						player.logSkill("jinaomrfz");
// 					}
// 					if (trigger.card.number <= min) {
// 						player.storage.jinaomrfz = true;
// 						//@ts-ignore
// 						player.marks.jinaomrfz.text.innerText = "递增";
// 						player.draw();
// 						//@ts-ignore
// 						player.logSkill("jinaomrfz");
// 					}
// 				},
// 				mod: {
// 					cardEnabled2: function (card, player) {
// 						if (player.storage.jinaomrfz == true) {
// 							if (card.number && card.number <= player.storage.jinaomrfz_lim) return false;
// 						} else {
// 							if (card.number && card.number >= player.storage.jinaomrfz_lim) return false;
// 						}
// 					},
// 				},
// 			},
// 		},
// 	},
// 	wutaimrfz: {
// 		audio: 2,
// 		trigger: { player: "phaseEnd" },
// 		direct: true,
// 		filter: function (event, player) {
// 			var cards = player.getCards("h");
// 			if (cards.length < 2) return false;
// 			for (var i = 0; i < cards.length; i++) {
// 				if (i == 0) {
// 					var tmp_cards = cards[i];
// 					continue;
// 				}
// 				//@ts-ignore
// 				if (get.type2(tmp_cards) != get.type2(cards[i])) return true;
// 				//@ts-ignore
// 				if (get.color(tmp_cards) != get.color(cards[i])) return true;
// 				tmp_cards = cards[i];
// 			}
// 			return false;
// 		},
// 		async content(event, trigger, player) {
// 			const result = await player
// 				.chooseToDiscard(2, "h", false, "【五肽】：你可以弃置两张类型或颜色不相同的手牌并选择一名角色，直到你的下个回合开始，其每回合第一次受到的伤害-1", function (card) {
// 					if (ui.selected.cards.length == 0) return true;
// 					if (ui.selected.cards.length) {
// 						return get.type2(card, player) != get.type2(ui.selected.cards[0], player) || get.color(card, player) != get.color(ui.selected.cards[0], player);
// 					}
// 					return false;
// 				})
// 				.set("complexCard", true)
// 				.set("ai", function (card) {
// 					return 10 - get.value(card);
// 				})
// 				.forResult();

// 			if (result.bool) {
// 				const { targets } = await player
// 					.chooseTarget("【五肽】：请选择一名角色", true, function (card, player, target) {
// 						return !target.hasSkill("wutaimrfz_eff");
// 					})
// 					.set("ai", target => {
// 						let att = get.attitude(get.player(), target);
// 						if (target.hp < 3) att /= 1.5;
// 						return att;
// 					})
// 					.forResult();
// 				if (targets) {
// 					//@ts-ignore
// 					player.logSkill("wutaimrfz_eff", targets[0]);
// 					player.addTempSkill("wutaimrfz_eff", { player: "phaseBegin" });
// 					player.storage.wutaimrfz_eff = targets[0];
// 				}
// 			}
// 		},
// 		subSkill: {
// 			mark: {
// 				charlotte: true,
// 			},
// 			eff: {
// 				onremove: true,
// 				audio: "wutaimrfz",
// 				mark: true,
// 				intro: {
// 					content: function (event, player) {
// 						var char = get.translation(player.storage.wutaimrfz_eff);
// 						if (player.hasSkill("wutaimrfz_mark")) return "本回合" + char + "已触发过此效果";
// 						return char + "受到的伤害-1";
// 					},
// 				},
// 				trigger: {
// 					global: "damageBegin",
// 				},
// 				forced: true,
// 				charlotte: true,
// 				logTarget: "player",
// 				filter: function (event, player) {
// 					if (player.hasSkill("wutaimrfz_mark")) return false;
// 					return event.player == player.storage.wutaimrfz_eff;
// 				},
// 				async content(event, trigger, player) {
// 					player.addTempSkill("wutaimrfz_mark", "phaseEnd");
// 					trigger.num--;
// 				},
// 			},
// 		},
// 	},
// });

// translate({
// 	baimianxiaomrfz: "白面鸮",
// 	jinaomrfz: "机脑",
// 	jinaomrfz_info: "锁定技。</br>①在一个回合内，当使用第二张牌后，若第二张牌的点数大于第一张牌的点数，则你本回合使用的牌的点数必须为 { 递增 } ，反之为 { 递减 } ，然后本回合当你使用手牌中点数[最大/最小]或之一的牌后，你调换两处{}内的描述并摸一张牌；每名角色的回合结束时，你将【机脑】的描述恢复至游戏开始时的描述。</br>②当你使用一张[黑色/红色]牌后，若此牌与你本回合上一张使用的牌颜色相同，你[本回合手牌上限+1/摸两张牌]。",
// 	wutaimrfz: "五肽",
// 	wutaimrfz_info: "结束阶段，你可以弃置两张颜色或类型不同的手牌，然后令一名角色每回合第一次受到的伤害-1直到你的下个回合开始。",
// });
characterIntro("baimianxiaomrfz", "......</br>已在20593个搜索结果中，为您选择了相对精准的答案。</br>白面鸮，前莱茵生命公司，数据维护专员。在医疗类源石技艺领域取得不菲成就，于医疗数据维护，常规医疗方案应用，多项目医疗行为等相关领域，拥有丰富经验。</br>现于罗德岛担任医疗干员，亦就职于医疗部门，某临床实验小组，项目领头人：赫默医生。同时，为罗德岛提供若干项医疗项目的相关辅助工作。</br>......");

characterTitle("baimianxiaomrfz", whichWayUtil.colorize("#r循迹之鸮#"));

translate({
	baimianxiaomrfz: "白面鸮",
	gushimrfz: "估势",
	gushimrfz_info: "锁定技<br>①当你成为与你势力不同的角色A使用的【杀】的目标后，若该角色本回合尚未对你造成过伤害，你选择一项：<br>1.摸一张牌;<br>2.视为使用一张【杀】并将势力变更至与角色A相同。<br>②回合结束时，若你本回合未对其他角色造成伤害，你回复1点体力。",
	shouzhongmrfz: "守中",
	shouzhongmrfz_info: "与你势力相同的角色的准备阶段，你可以观看牌堆顶X张牌，并以任意顺序放回牌堆顶或牌堆底，若置于牌堆顶的牌与置于牌堆底的牌数量相同，你摸两张牌，然后你变更为其他势力。（X = 与你势力相同的角色数）",
});

skill({
	gushimrfz: {
		audio: ["选中干员2", "部署2"],
		forced: true,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			const source = event.player;
			return event.card.name == "sha" && source.getHistory("sourceDamage", evt => evt.players.includes(player)).length < 1 && source.group !== player.group;
		},
		async content(event, trigger, player) {
			const card = get.autoViewAs({ name: "sha", isCard: true });
			if (!player.hasUseTarget(card)) {
				player.draw();
				return;
			}
			const result = await player
				.chooseUseTarget({
					card: card,
					prompt: "【估势】:你可以视为使用一张【杀】，或选择“取消”摸一张牌",
					ai(target) {
						return get.effect(target, card, player, player);
					},
				})
				.forResult();
			if (result.bool === false) {
				player.draw();
			} else {
				let group = trigger.player.group;
				player.changeGroup(group);
				player.popup(group + "2", get.groupnature(group, "raw"));
			}
		},
		group:"gushimrfz_recover",
		subSkill:{
			recover:{
				audio:"gushimrfz",
				forced:true,
				trigger:{
					player:"phaseEnd"
				},
				filter(event, player, name, target) {
					return player.getHistory("sourceDamage",evt=>evt.player !== player).length < 1;
				},
				async content(event,trigger,player){
					player.recover();
				},
			},
		},
	},
	shouzhongmrfz: {
		audio: ["选中干员1", "3星结束行动"],
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player, name, target) {
			return player.group === event.player.group;
		},
		async content(event, trigger, player) {
			const num = game.countPlayer(cur => {
				return cur.group === player.group;
			});
			const result = await player.chooseToGuanxing(num).forResult();

			const moved: [Card[], Card[]] = result.moved;

			if (moved[0].length === moved[1].length) {
				await player.draw(2);
				let list = lib.group.slice().filter(group => player.group !== group);
				let maxGroup = list.slice().sort((a, b) => {
					return (
						game.countPlayer(current => {
							return current.group == b && current != player;
						}) -
						game.countPlayer(current => {
							return current.group == a && current != player;
						})
					);
				})[0];
				const result = await player
					.chooseControl({ controls: list })
					.set("prompt", "守中：请选择要变更为的势力")
					.set("ai", () => {
						return _status.event.choice;
					})
					.set("choice", maxGroup)
					.forResult();
				if (_status.connectMode) {
					game.broadcastAll(function () {
						//@ts-ignore
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				let group = result.control;
				if (group) {
					player.logSkill("shouzhongmrfz");
					player.changeGroup(group);
					player.popup(group + "2", get.groupnature(group, "raw"));
				}
			}
		},
	},
});
