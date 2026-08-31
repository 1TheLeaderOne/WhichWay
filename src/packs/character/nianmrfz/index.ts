import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("nianmrfz", {
			sex: "female",
			group: "suimrfz",
			hp: 4,
			skills: ["zhujimrfz","tongyinmrfz","tieyumrfz"],
		});

skill({
	"zhujimrfz": {
			audio: 2,
			trigger: {
				player: ["phaseDrawAfter", "phaseJieshuAfter"],
			},
			direct: true,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				let result;
				result = await player
					.chooseToDiscard("he", get.prompt("zhujimrfz"), "【铸极】:你可以重铸一张牌")
					.set("ai", function (card) {
						return 6 - get.value(card);
					})
					.forResult();
				if (result.cards) player.draw();
				if (result.cards && get.type(result.cards[0]) == "equip") {
					player.draw();
					//@ts-ignore
					player.logSkill("zhujimrfz");
				} else if (result.cards) {
					//@ts-ignore
					player.logSkill("zhujimrfz");
				}
			},
		},
	"tongyinmrfz": {
			audio: 2,
			trigger: { player: "damageEnd" },
			filter: function (event, player) {
				return event.source != undefined && event.source != player;
			},
			usable: 1,
			logTarget: "source",
			check: function (event, player) {
				return get.attitude(player, event.source) < 2;
			},
			async content(event, trigger, player) {
				let result;
				if (!trigger.source.hasSkill("fengyin")) {
					trigger.source.addTempSkill("fengyin");
				}

				result = await trigger.source
					.chooseToDiscard(
						"he",
						true,
						"【铜印】:请选择弃置一张非基本或" + get.translation(Math.min(player.getDamagedHp() + 1, 1)) + "张基本牌"
					)
					.forResult();
				if (player.getDamagedHp() < 2) event.finish();

				if (result && result.cards && get.type(result.cards[0]) == "basic") {
					trigger.source
						.chooseToDiscard(
							true,
							"【铜印】:请选择弃置" + get.translation(player.getDamagedHp() - 1) + "张基本牌",
							[1, player.getDamagedHp() - 1],
							function (card) {
								return get.type(card) == "basic";
							}
						)
						.set("ai", function (card) {
							return 6 - get.value(card);
						});
				}
			},
			ai: {
				threaten: 0.5,
				expose: 0.4,
			},
		},
	"tieyumrfz": {
			intro: {
				content: "使用【杀】的次数+#；可令大于一的伤害改为一#次",
			},
			audio: 2,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				//@ts-ignore
				return player.countMark("tieyumrfz_clear2") < 2 && get.type(event.card) == "equip";
			},
			check: function (event, player) {
				return get.attitude(player, event.player) > 2;
			},
			async content(event, trigger, player) {
				if (trigger.player.getDamagedHp() > 0) trigger.player.recover();
				else trigger.player.changeHujia();
				trigger.player.addSkill(["tieyumrfz_sha", "tieyumrfz_damage", "tieyumrfz_clear"]);
				trigger.player.addMark("tieyumrfz");
				player.addMark("tieyumrfz_clear2", 1);
			},
			group: "tieyumrfz_clear2",
			subSkill: {
				sha: {
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("tieyumrfz");
						},
					},
				},
				damage: {
					direct: true,
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						return event.num > 1 && player.countMark("tieyumrfz_damage") < player.countMark("tieyumrfz");
					},
					async content(event, trigger, player) {
						trigger.num = 1;
						//@ts-ignore
						player.logSkill("tieyumrfz");
						player.addMark("tieyumrfz_damage");
					},
				},
				clear: {
					silent: true,
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeSkill("tieyumrfz_damage");
						player.removeSkill("tieyumrfz_sha");
						player.removeSkill("tieyumrfz_clear");
						player.removeMark("tieyumrfz", player.countMark("tieyumrfz"));
						player.removeMark("tieyumrfz_damage", player.countMark("tieyumrfz_damage"));
					},
				},
				clear2: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.hasMark("tieyumrfz_clear2");
					},
					async content(event, trigger, player) {
						player.removeMark("tieyumrfz_clear2", player.countMark("tieyumrfz_clear2"));
					},
				},
			},
			ai: {
				threaten: 1.2,
				expose: 0.8,
			},
		},
});

translate({
	"nianmrfz": "年",
	"zhujimrfz": "铸极",
	"zhujimrfz_info": "摸牌阶段和回合结束阶段结束时，你可以重铸一张牌，若你重铸的是装备牌，你摸一张牌。",
	"tongyinmrfz": "铜印",
	"tongyinmrfz_info": "每回合限一次，当你受到伤害后，你可以令伤害来源本回合所有非锁定技失效，然后其需要选择弃置X张基本牌或一张非基本牌。（X=你已损失的体力值，X至少为1）",
	"tieyumrfz": "铁御",
	"tieyumrfz_info": "每轮限两次，当一名其他角色使用装备牌时，你可以令其回复一点体力（若其已损失体力值为0，则改为获得一点护甲），本轮获得以下效果:使用【杀】的次数+1;受到大于1的伤害时，将此伤害改为1。",
});

characterTitle("nianmrfz", "<font color=#FFA500>地生五金</font>");

characterIntro("nianmrfz", "年，无业游民，熟习各类金属工艺，拥有与身份不符的渊博冶金知识。现凭访客身份逗留于罗德岛，偶尔为罗德岛的金属加工项目提供建议。声称自己擅长音像娱乐工作，经常提供一些罗德岛干员普遍不太喜爱的音像产品。");
