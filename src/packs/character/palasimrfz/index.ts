import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("palasimrfz", {
			sex: "female",
			group: "mimrfz",
			hp: 4,
			skills: ["yingzhumrfz","yingdanmrfz","yingfenmrfz"],
		});

skill({
	"yingzhumrfz": {
			audio: 2,
			trigger: { player: "phaseBegin" },
			direct: true,
			filter: function (event, player) {
				return !player.storage.yingzhumrfz;
			},
			async content(event, trigger, player) {
				const next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束", "cancel2").set("prompt", get.prompt("yingzhumrfz"));
				next.set("prompt2", "你可以令自己在任意阶段结束后额外执行一个该阶段");
				next.set("ai", function () {
					const player = _status.event.player;
					if (
						player.countCards("h", "sha") > player.getCardUsable("sha") &&
						game.hasPlayer(function (current) {
							return current != player && player.inRange(current) && get.attitude(player, current) < 0;
						})
					)
						return 3;
					return 2;
				});

				const result = await next.forResult();

				if (result.control != "cancel2" && typeof result.index == "number") {
					var list = [
						"yingzhumrfz_Zhunbei",
						"yingzhumrfz_judge",
						"yingzhumrfz_draw",
						"yingzhumrfz_use",
						"yingzhumrfz_discard",
						"yingzhumrfz_jieshu",
					];
					player.addTempSkill(list[result.index]);
					//@ts-ignore
					player.logSkill("yingzhumrfz");
				}
			},
			group: "yingzhumrfz_phase",
			subSkill: {
				phase: {
					direct: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						let result;

						// step 0
						player.storage.yingzhumrfz = false;
						result = await player
							.chooseTarget(
								get.prompt("yingzhumrfz"),
								"你可以选择一名其他角色，令其于任一阶段结束后额外执行一次此阶段",
								(card, player, target) => {
									return target !== player;
								}
							)
							.set("ai", target => {
								const aiPlayer = _status.event.player;
								const att = get.attitude(aiPlayer, target);
								return att > 0;
							})
							.forResult();

						// step 1
						if (result.targets) {
							const att = get.attitude(player, result.targets[0]);
							const next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束");
							next.set("prompt", "【英祝】:请选择一个阶段，" + get.translation(result.targets[0]) + "于此阶段结束后额外执行一次此阶段");
							next.set("ai", () => {
								return 2;
							});
							result = await next.forResult();

							player.storage.yingzhumrfz = true;
						} else {
							return;
						}

						// step 2
						const list = [
							"yingzhumrfz_Zhunbei",
							"yingzhumrfz_judge",
							"yingzhumrfz_draw",
							"yingzhumrfz_use",
							"yingzhumrfz_discard",
							"yingzhumrfz_jieshu",
						];
						if (result && result.index) {
							event.target.addSkill(list[result.index]);
							//@ts-ignore
							player.logSkill("yingzhumrfz", event.target);
						}
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
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
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
					async content(event, trigger, player) {
						event.next.remove(player.phaseJieshu());
						trigger.next.push(player.phaseJieshu());
						player.removeSkill("yingzhumrfz_jieshu");
					},
				},
			},
		},
	"yingdanmrfz": {
			audio: 2,
			silent: true,
			trigger: {
				global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"],
			},
			async content(event, trigger, player) {
				trigger.player.addMark("yingdanmrfz", 1, false);
			},
			group: "yingdanmrfz_draw",
			subSkill: {
				draw: {
					direct: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						const target = trigger.player;
						let next;
						if (target.countMark("yingdanmrfz") > 6) {
							next = player.chooseBool(
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

						if (!next) return;
						const result = await next.forResult();

						if (result.bool) {
							target.draw(target.countMark("yingdanmrfz") - 6);
							//@ts-ignore
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
	"yingfenmrfz": {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				if (player.storage.yingfenmrfz) return false;
				return event.card.name == "tao";
			},
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(get.prompt("yingfenmrfz"), "你可以令一名其他角色恢复一点体力", function (card, player, target) {
						return target != player;
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.attitude(player, target) > 0;
					})
					.forResult();
				if (result.targets) {
					player.storage.yingfenmrfz = true;
					result.targets[0].recover();
					//@ts-ignore
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
					async content(event, trigger, player) {
						player.storage.yingfenmrfz = false;
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
});

translate({
	"palasimrfz": "帕拉斯",
	"yingzhumrfz": "英祝",
	"yingzhumrfz_info": "①回合开始时，你可以选择令自己在任一阶段结束后额外执行一次此阶段。②每轮开始时，你可以选择一名其他角色，然后你选择令其在任一阶段结束后额外执行一次此阶段，若此做，本轮【英祝①】失效。",
	"yingdanmrfz": "英诞",
	"yingdanmrfz_info": "任意角色回合结束时，你可以令其摸X-6张牌。(X=其本回合执行的阶段数)",
	"yingfenmrfz": "英奋",
	"yingfenmrfz_info": "每轮限一次，当你使用【桃】时，你可以令一名其他角色恢复一点体力。",
});

characterIntro("palasimrfz", "帕拉斯，曾在米诺斯担任祭司职务。在离开雅赛努斯城邦去往阿克罗蒂村任职期间，带领当地民众进行了对萨尔贡周边部落长年侵扰的反抗，并在当地推行旅游及文化产业的发展。后因矿石病病况恶化，来到罗德岛进行秘密治疗。");
