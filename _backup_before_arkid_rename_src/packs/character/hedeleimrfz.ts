import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("hedeleimrfz", { pack: "legendSJZX",
			sex: "male",
			group: "luomrfz",
			hp: 4,
			maxHp: 6,
			skills: ["zhengrongmrfz","siyanmrfz"],
		});

skill({
	"zhengrongmrfz": {
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
				let list:any[] = [],
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
			async content(event, trigger, player) {
				const list:any[] = [],
					storage = player.storage.zhengrongmrfz;
				if (player.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
				if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
				if (storage["maxhp"] == false) list.push("失去体力上限");
				const result = await player
					.chooseControl({controls:list})
					.set("ai", function () {
						return 0;
					})
					.set("prompt", "【征戎】:请选择一项")
					.forResult();

				if (result.control) {
					const control = result.control;
					game.log(control);
					if (control == "弃牌") {
						player.chooseToDiscard({
							position:"he",
							forced:true,
							prompt:"【征戎】:请弃置一张牌"
						});
						player.storage.zhengrongmrfz["discard"] = true;
					}
					if (control == "摸牌阶段摸牌数-1") {
						player.addMark("zhengrongmrfz_losedraw", 1, false);
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
						let allGone = Object.values(player.storage.zhengrongmrfz).every(function (value) {
							return value === true;
						});
						if (player.storage.zhengrongmrfz === undefined) return false;
						return allGone;
					},
					async content(event, trigger, player) {
						//@ts-ignore
						player.drawTo(player.maxHp);
					},
				},
				rec: {
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: { player: "phaseBegin" },
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
						trigger.num -= player.countMark("zhengrongmrfz_losedraw");
					},
				},
			},
			ai: {
				expose: 0.1,
				threaten: 0.8,
			},
		},
	"siyanmrfz": {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (event.targets.length > 1) return false;
				if (event.targets[0] == player) return false;
				if (!event.card || event.card.name != "sha") return false;
				let history = event.targets[0].getHistory("damage");
				for (let i = 0; i < history.length; i++) {
					if (!history[i].source) continue;
					if (history[i].source == player) return true;
				}
				let seatNum = event.targets[0].getSeatNum();
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
			async content(event, trigger, player) {
				let result;

				// step 0
				player.addTempSkill("siyanmrfz_rec", {
					player: "damageAfter",
				});
				player.storage.siyanmrfz_rec = {
					card: trigger.card,
				};
				const target = trigger.targets[0];
				const list = ["无法响应" + get.translation(player) + "使用的【杀】"];
				if (target.countCards("h") > 1) list.push("弃置两张手牌");

				target.loseHp();
				player.loseHp();

				if (list.length < 2 && target.isAlive()) {
					//@ts-ignore
					trigger.directHit.addArray(
						game.filterPlayer(current => {
							return current === target;
						})
					);
					game.log(target, "选择了无法响应", player, "使用的【杀】");
					return;
				} else if (target.isAlive()) {
					result = await target
						.chooseControl()
						.set("choiceList", list)
						.set("prompt", "【死烟】:请选择一项")
						.set("ai", () => {
							const aiPlayer = _status.event.player;
							if (aiPlayer.countCards("h") < 3) return 0;
							if (!aiPlayer.hasShan()) return 0;
							if (
								aiPlayer.hp === 1 &&
								aiPlayer.countCards("h", c => {
									return get.name(c) === "tao" || get.name(c) === "jiu";
								}) > 0 &&
								aiPlayer.countCards("h") < 3
							)
								return 0;
							return 1;
						})
						.forResult();
				} else {
					return;
				}

				// step 1
				if (result?.control) {
					const target = trigger.targets[0];
					if (result.index === 1) {
						game.log(get.translation(target), "选择了弃置两张手牌");
						await target.chooseToDiscard({
							forced:true,
							selectCard:[2,2]
						});
					} else {
						//@ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(current => {
								return current === target;
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
						let info = player.storage.siyanmrfz_rec;
						return event.card && event.card == info.card;
					},
					silent: true,
					popup: false,
					forced: true,
					charlotte: true,
					firstDo: true,
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
						const seatNum = trigger.player.getSeatNum();
						player.storage.siyanmrfz_tol[seatNum] = false;
					},
				},
				tol: {
					init: function (player) {
						player.storage.siyanmrfz_tol = {};
						for (let i = 0; i < game.players.length; i++) {
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
					async content(event, trigger, player) {
						const seatNum = trigger.source.getSeatNum();
						if (seatNum in player.storage.siyanmrfz_tol && player.storage.siyanmrfz_tol[seatNum] === false) {
							player.storage.siyanmrfz_tol[seatNum] = true;
						}
					},
				},
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					const seatNum = arg.target.getSeatNum(arg.target);
					if (seatNum in player.storage.siyanmrfz_tol || player.storage.siyanmrfz_tol[seatNum] === false) return false;
					if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) return false;
				},
			},
		},
});

translate({
	"hedeleimrfz": "赫德雷",
	"zhengrongmrfz": "征戎",
	"zhengrongmrfz_info": `①每${get.poptip("sjzx_huihelun")}每项限一次，当你或与你距离不大于1的其他角色受到伤害后，你可以选择并在本回合轮删除一项，然后其回复一点体力：1.体力上限-1；2.弃置一张牌；3.下个摸牌阶段摸牌数-1。</br>②你的回合开始时，若【征戎①】所有选项均被删除，你可以将手牌补至体力上限。`,
	"siyanmrfz": "死烟",
	"siyanmrfz_info": "出牌阶段，当你使用【杀】选择唯一目标后，若该角色上回合轮对你造成过伤害或你本回合对其造成过伤害，你可以流失一点体力，令其流失一点体力并选择一项：1.无法响应此【杀】；2.弃置两张手牌，然后若此牌造成了伤害且此牌花色为♦，你回复一点体力。",
});

characterIntro("hedeleimrfz", "赫德雷，前萨卡兹佣兵头目。早期履历不详，曾作为护卫部队的一员参与了巴别塔的转移，在巴别塔解体后离开。此后曾以整合运动所属萨卡兹雇佣兵的身份与伊内丝、W一起出现在切尔诺伯格，并在切尔诺伯格事件后消失。再次出现时，赫德雷已在伦蒂尼姆的军事委员会中任职。在取得重要情报后，赫德雷离开军事委员会，同罗德岛重新取得联系。在与阿米娅沟通后，赫德雷再次和罗德岛签订了战略合作条款。");
