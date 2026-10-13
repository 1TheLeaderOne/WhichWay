import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("palasimrfz", { pack: "legendSJZX", sex: "female", group: "mimrfz", hp: 4, skills: ["yingzhumrfz", "yingdanmrfz", "yingfenmrfz"] });

skill({
	yingzhumrfz: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter: function (event, player) {
			return !player.storage.yingzhumrfz;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl({
					controls: ["准备", "判定", "摸牌", "出牌", "弃牌", "结束", "cancel2"],
					prompt: get.prompt("yingzhumrfz"),
					prompt2: "你可以令自己在任意阶段结束后额外执行一个该阶段",
					ai(event, player) {
						player = player || _status.event.player;
						if (
							player.countCards("h", "sha") > player.getCardUsable("sha") &&
							game.hasPlayer(function (current) {
								return current != player && player.inRange(current) && get.attitude(player, current) < 0;
							})
						) {
							return 3;
						}
						return 2;
					},
				})
				.forResult();
			event.result = {
				...result,
				cost_data: result,
			};
		},
		async content(event, trigger, player) {
			const {
				cost_data: { index },
			} = event;

			if (typeof index === "number") {
				let list = ["yingzhumrfz_Zhunbei", "yingzhumrfz_judge", "yingzhumrfz_draw", "yingzhumrfz_use", "yingzhumrfz_discard", "yingzhumrfz_jieshu"];
				player.addSkill(list[index]);
			}
		},
		group: "yingzhumrfz_phase",
		subSkill: {
			phase: {
				audio: "yingzhumrfz",
				trigger: { global: "roundStart" },
				async cost(event, trigger, player) {
					const result = await player.chooseTargetControl({
						prompt:get.prompt("yingzhumrfz"),
						prompt2:"你可以选择一名其他角色，令其于任一阶段结束后额外执行一次此阶段",
						filterTarget:lib.filter.notMe,
						ai(target) {
							const aiPlayer = _status.event.player;
							const att = get.attitude(aiPlayer, target);
							return att;
						},
						controls:["准备", "判定", "摸牌", "出牌", "弃牌", "结束","cancel2"],
						controlAi(event, player) {
							return 2;
						},
					}).forResult();

					console.log(result);

					event.result = {
						...result,
						cost_data:result
					}
				},
				async content(event, trigger, player) {
					const result = event.cost_data;
					const targets:Player[] = result.targets;
					const list = ["yingzhumrfz_Zhunbei", "yingzhumrfz_judge", "yingzhumrfz_draw", "yingzhumrfz_use", "yingzhumrfz_discard", "yingzhumrfz_jieshu"];
					if (result && result.index && targets) {
						targets[0].addSkill(list[result.index]);
						player.line(targets[0]);
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			Zhunbei: {
				charlotte: true,
				silent: true,
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
				charlotte: true,
				silent: true,
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
				charlotte: true,
				silent: true,
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
				charlotte: true,
				silent: true,
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
				charlotte: true,
				silent: true,
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
				charlotte: true,
				silent: true,
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
	yingdanmrfz: {
		global: ["yingdanmrfz_clear"],
		audio: 2,
		silent: true,
		charlotte: true,
		onremove(player, type) {
			game.players.forEach(char => {
				if (char.hasMark("yingdanmrfz")) {
					char.removeMark("yingdanmrfz", char.countMark("yingdanmrfz"), false);
				}
			});
		},
		trigger: {
			global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"],
		},
		async content(event, trigger, player) {
			trigger.player.addMark("yingdanmrfz", 1, false);
		},
		group: "yingdanmrfz_draw",
		subSkill: {
			clear: {
				charlotte: true,
				silent: true,
				trigger: {
					player: "phaseEnd",
				},
				lastDo: true,
				filter(event, player, name, target) {
					return player.hasMark("yingdanmrfz");
				},
				async content(event, trigger, player) {
					player.removeMark("yingdanmrfz", player.countMark("yingdanmrfz"), false);
				},
			},
			draw: {
				audio: "yingdanmrfz",
				trigger: { global: "phaseEnd" },
				filter(event, player, name, target) {
					return event.player.countMark("yingdanmrfz") > 6;
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					event.result = await player
						.chooseBool({
							prompt2: "【英诞】:是否令" + (target == player ? "自己" : get.translation(target)) + "摸" + (target.countMark("yingdanmrfz") - 6) + "张牌？",
							prompt: get.prompt("yingdanmrfz"),
							ai(event, player) {
								player = player || _status.event.player;
								let target = trigger.player;
								return get.attitude(player, target) > 0;
							},
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					target.draw(target.countMark("yingdanmrfz") - 6);
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
			return event.card.name == "tao";
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget({
				prompt:get.prompt("yingfenmrfz"),
				prompt2:"你可以令一名其他角色恢复一点体力",
				filterTarget(card, player, target) {
					return target !== player && target.isDamaged();
				},
				ai(target) {
					return get.attitude2(target);
				},
			}).forResult();
		},
		async content(event, trigger, player) {
			const { targets:[target] } = event;
			if (target) {
				target.recover();
				player.line(target);
			}
		},
		ai: {
			expose: 0.1,
		},
	},
});

translate({
	palasimrfz: "帕拉斯",
	yingzhumrfz: "英祝",
	yingzhumrfz_info: "[每轮开始/回合开始]时，你可以选择令[自己/其他角色]在任一阶段结束后额外执行一次此阶段。",
	yingdanmrfz: "英诞",
	yingdanmrfz_info: "任意角色回合结束时，你可以令其摸X-6张牌。(X=其本回合执行的阶段数)",
	yingfenmrfz: "英奋",
	yingfenmrfz_info: "当你使用的【桃】结算完成后，你可以令一名已受伤的角色回复一点体力。",
});

characterTitle("palasimrfz", whichWayUtil.colorize("#b赫里亚之辉#"));

characterIntro("palasimrfz", "帕拉斯，曾在米诺斯担任祭司职务。在离开雅赛努斯城邦去往阿克罗蒂村任职期间，带领当地民众进行了对萨尔贡周边部落长年侵扰的反抗，并在当地推行旅游及文化产业的发展。后因矿石病病况恶化，来到罗德岛进行秘密治疗。");
