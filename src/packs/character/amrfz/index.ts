import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("amrfz", { pack: "legendSJZX",
			sex: "male",
			group: "limrfz",
			hp: 3,
			maxHp: 4,
			hujia: 1,
			skills: ["guaijiemrfz","guaiyaomrfz","qizhenmrfz"],
		});

skill({
	"guaijiemrfz": {
			audio: 2,
			forced: true,
			firstDo: true,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return !player.storage.guaijiemrfz;
			},
			async content(event, trigger, player) {
				player.loseHp();
			},
			group: "guaijiemrfz_damage",
			subSkill: {
				damage: {
					audio: "guaijiemrfz",
					forced: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !player.storage.guaijiemrfz;
					},
					async content(event, trigger, player) {
						player.storage.guaijiemrfz = true;
						player.addSkill("guaijiemrfz_remove");
						const result = await player
							.chooseTarget(true, "弃置一名角色区域内的一张牌", function (card, player, target) {
								return target.countCards("hej") > 0;
							})
							.set("ai", function (target) {
								var player = _status.event.player;
								var att = get.attitude(player, target);
								if (att < 0) {
									att = -Math.sqrt(-att);
								} else {
									att = Math.sqrt(att);
								}
								return att * lib.card.guohe.ai.result.target(player, target);
							})
							.forResult();
						if (result.targets) {
							var target = result.targets[0];
							player.discardPlayerCard(target, "hej", true);
						}
					},
				},
				remove: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.storage.guaijiemrfz = false;
						player.removeSkill("guaijiemrfz_remove");
					},
				},
			},
		},
	"qizhenmrfz": {
			audio: 2,
			enable: "phaseUse",
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			usable: 1,
			async content(event, trigger, player) {
				const { target } = event;
				let result;
				let skipStep1 = false;

				// step 0
				if (target.countCards("he") === 0) {
					await target.damage();
					skipStep1 = true;
				} else {
					const str1 = "令" + get.translation(target) + "弃置两张牌";
					const str2 = "对" + get.translation(target) + "造成一点伤害";
					result = await player
						.chooseControl(str1, str2)
						.set("prompt", "【奇针】:请选择一项")
						.set("ai", () => {
							if (target.hp > 2 && target.countCards("he") < 4) return 1;
							return 0;
						})
						.forResult();
				}

				// step 1 (可能被 goto(2) 跳过)
				if (!skipStep1) {
					if (result && result.index === 0) {
						await target.chooseToDiscard("he", true, 2, "【奇针】:请弃置两张牌");
					} else {
						await target.damage();
					}
				}

				// step 2
				target.addTempSkill("qizhenmrfz_effect", {
					player: "phaseEnd",
				});
				target.changeHujia();
			},
			subSkill: {
				effect: {
					audio: "qizhenmrfz",
					trigger: { player: "useCard" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.card.name == "sha" || event.card.name == "juedou";
					},
					async content(event, trigger, player) {
						trigger.baseDamage++;
					},
				},
			},
		},
	"guaiyaomrfz": {
			audio: 4,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return event.player != player;
			},
			async content(event, trigger, player) {
				var target = trigger.player;
				var num = Math.random();
				if (num < 0.1) {
					target.addTempSkill("guaiyaomrfz_skip", {
						player: "phaseEnd",
					});
					player.popup("怪药·跳过");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·跳过】</span>");
				}
				if (num >= 0.1 && num < 0.325) {
					player.getDamagedHp() > 0 ? player.recover(2) : player.changeHujia();
					player.popup("怪药·回复");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·回复】</span>");
				}
				if (num >= 0.325 && num < 0.55) {
					target.chooseToDiscard("he", true, "【怪药】:请弃置一张牌");
					player.popup("怪药·弃牌");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·弃牌】</span>");
				}
				if (num >= 0.55 && num < 0.775) {
					target.addTempSkill("guaiyaomrfz_decrease", {
						player: "phaseDrawAfter",
					});
					player.popup("怪药·摸牌减少");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·摸牌减少】</span>");
				}
				if (num >= 0.775) {
					player.draw();
					player.popup("怪药·摸牌");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·摸牌】</span>");
				}
			},
			subSkill: {
				skip: {
					mark: true,
					intro: {
						content: "跳过下个出牌和弃牌阶段",
					},
					audio: "guaiyaomrfz",
					forced: true,
					charlotte: true,
					trigger: {
						player: ["phaseUseBegin", "phaseDiscardBefore"],
					},
					async content(event, trigger, player) {
						trigger.cancel();
					},
				},
				decrease: {
					mark: true,
					intro: {
						content: "下个摸牌阶段摸牌数-1",
					},
					audio: "guaiyaomrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					async content(event, trigger, player) {
						trigger.num--;
					},
				},
			},
		},
});

translate({
	"amrfz": "阿",
	"guaijiemrfz": "怪杰",
	"guaijiemrfz_info": "①锁定技，每轮开始时，你失去一点体力。②锁定技，每轮限一次，当你造成伤害后，你令【怪杰①】下一轮失效，然后你弃置一名角色区域内一张牌。",
	"qizhenmrfz": "奇针",
	"qizhenmrfz_info": "出牌阶段限一次，你可以选择一名角色并选择弃置其两张牌或对其造成一点伤害，然后其获得以下效果：①获得一点护盾；②使用的【杀】和【决斗】的伤害基数+1直到其回合结束。",
	"guaiyaomrfz": "怪药",
	"guaiyaomrfz_info": "锁定技，当你对其他角色造成伤害时，你随机执行下列选项的一项:①回复两点体力（已损失体力值为0则改为获得一点护甲）；②受伤的角色弃置一张牌；③受伤的角色下个摸牌阶段摸牌数-1；④你摸一张牌；⑤受伤角色跳过下个出牌阶段和弃牌阶段（概率最低）。",
});

characterIntro("amrfz", "阿，经龙门鲤氏侦探事务所所长老鲤推荐而来的医疗人员，曾是活跃于龙门灰色地带的知名黑医生。</br>在加入后，展现出了惊人的医疗理论知识储备以及临床经验，但也表现出让人担忧的医疗风格。</br>不过根据凯尔希医生的综合评估，被暂时推荐到医疗装备科和技术开发组。");
