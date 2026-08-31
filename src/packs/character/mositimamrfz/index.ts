import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("mositimamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "lamrfz",
			hp: 3,
			skills: ["shishimrfz","huanshimrfz"],
		});

skill({
	"huanshimrfz": {
			audio: 2,
			direct: true,
			trigger: { player: "phaseEnd" },
			getNum: function () {
				var num = 0;
				//@ts-ignore
				game.getGlobalHistory("cardMove", function (evt) {
					if (evt.name == "lose" && evt.type == "discard") num += evt.cards2.length;
				});
				return num;
			},
			filter: function (event, player) {
				return (
					lib.skill.huanshimrfz.getNum() > 0 &&
					game.hasPlayer(function (target) {
						return target != player && !player.hasSkill("huanshimrfz_buff1");
					})
				);
			},
			async content(event, trigger, player) {
				var num = lib.skill.huanshimrfz.getNum();
				const result = await player
					.chooseTarget(
						get.prompt("huanshimrfz"),
						"你可以选择至多" +
							get.cnNumber(num) +
							"名角色令其下个回合内：①其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。",
						[1, num],
						function (card, player, target) {
							return target != player && !player.hasSkill("huanshimrfz_buff1");
						}
					)
					.set("ai", target => -get.attitude(player, target))
					.forResult();
				if (result.targets) {
					for (var i of result.targets) {
						i.addSkill(["huanshimrfz_buff1", "huanshimrfz_buff2"]);
						player.line(i);
					}
					//@ts-ignore
					player.logSkill("huanshimrfz");
				}
			},
			subSkill: {
				tmp: {
					silent: true,
					charlotte: true,
				},
				buff1: {
					direct: true,
					charlotte: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						if (player.hasSkill("huanshimrfz_tmp")) return false;
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						var cards = [];
						for (var i = 0; i < trigger.cards.length; i++) {
							if (get.position(trigger.cards[i], true) == "o") {
								cards.push(trigger.cards[i]);
							}
						}
						player.gain(cards, "gain2");
						//@ts-ignore
						trigger.getParent().excluded.addArray(trigger.targets);
						player.addTempSkill("huanshimrfz_tmp", "phaseEnd");
					},
				},
				buff2: {
					onremove: true,
					mark: true,
					marktext: "缓",
					intro: {
						name: "主观缓时",
						content: "行动受到限制",
					},
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasSkill("huanshimrfz_buff1") || player.hasSkill("huanshimrfz_buff2");
					},
					async content(event, trigger, player) {
						player.removeSkill("huanshimrfz_buff1");
						player.removeSkill("huanshimrfz_buff2");
					},
				},
			},
		},
	"shishimrfz": {
			audio: 2,
			trigger: { player: "drawBegin" },
			filter: function (event, player) {
				return (
					//@ts-ignore
					(event.getParent("phaseDraw") && event.getParent("phaseDraw").player == player) ||
					//@ts-ignore
					(event.getParent("phaseUse") && event.getParent("phaseUse").player == player)
				);
			},
			async content(event, trigger, player) {
				trigger.num += player.countMark("shishimrfz") + 1;
				player.addMark("shishimrfz", 1);
			},
			group: "shishimrfz_discard",
			subSkill: {
				discard: {
					direct: true,
					trigger: { player: "phaseDiscardBefore" },
					filter: function (event, player) {
						return player.hasMark("shishimrfz");
					},
					async content(event, trigger, player) {
						var num = player.countMark("shishimrfz");
						player.chooseToDiscard(get.prompt("shishimrfz"), "弃置" + get.cnNumber(num) + "张牌", "he", true, num);
						player.removeMark("shishimrfz", num, false);
					},
				},
			},
		},
});

translate({
	"mositimamrfz": "莫斯提马",
	"huanshimrfz": "缓时",
	"huanshimrfz_info": "回合结束阶段，你可以选择至多X名其他角色，令其每个回合内其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。（X=本回合因弃置进入弃牌堆的牌的数量）",
	"shishimrfz": "时匙",
	"shishimrfz_info": "当你于你的出牌阶段或摸牌阶段摸牌时，你可以令此次摸牌数+X，然后你于弃牌阶段开始时弃X-1张牌。（X=本回合你发动此技能的次数+1）",
});

characterIntro("mositimamrfz", "莫斯提马，企鹅物流员工，总是单独行动，此前履历不详。");
