import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("keebomrfz", {
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["jiemimrfz","shihuangmrfz","baokemrfz"],
		});

skill({
	"jiemimrfz": {
			intro: {
				content: function (event, player) {
					var num = player.countMark("jiemimrfz") + 1;
					if (player != _status.currentPhase && player.countMark("jiemimrfz") % 2 == 1) return "弃置" + get.cnNumber(num) + "张牌";
					if (player != _status.currentPhase && player.countMark("jiemimrfz") % 2 != 1) return "摸" + get.cnNumber(num) + "张牌";
					if (player == _status.currentPhase && player.countMark("jiemimrfz") % 2 == 1) return "摸" + get.cnNumber(num) + "张牌";
					if (player == _status.currentPhase && player.countMark("jiemimrfz") % 2 != 1) return "弃置" + get.cnNumber(num) + "张牌";
				},
			},
			mark: true,
			charlotte: true,
			onremove: true,
			audio: 2,
			direct: true,
			trigger: { global: "phaseEnd" },
			filter: function (event, player) {
				return player.hasMark("jiemimrfz");
			},
			async content(event, trigger, player) {
				player.removeMark("jiemimrfz", player.countMark("jiemimrfz"));
			},
			group: ["jiemimrfz_cw", "jiemimrfz_zd"],
			subSkill: {
				cw: {
					forced: true,
					trigger: { target: "useCardToTargeted" },
					filter: function (event, player) {
						return player != _status.currentPhase;
					},
					async content(event, trigger, player) {
						await player.addMark("jiemimrfz");

						if (player.countMark("jiemimrfz") % 2 == 1) player.draw(player.countMark("jiemimrfz"));
						else
							player.chooseToDiscard(
								"弃置" + get.cnNumber(player.countMark("jiemimrfz")) + "张手牌",
								player.countMark("jiemimrfz"),
								true,
								"h"
							);
						//@ts-ignore
						player.logSkill("jiemimrfz");
					},
				},
				zd: {
					forced: true,
					trigger: { player: "useCardToTargeted" },
					filter: function (event, player) {
						if (player != _status.currentPhase) return false;
						return event.target != player && event.targets.length == 1;
					},
					async content(event, trigger, player) {
						await player.addMark("jiemimrfz");

						if (player.countMark("jiemimrfz") % 2 == 1)
							player.chooseToDiscard(
								"弃置" + get.cnNumber(player.countMark("jiemimrfz")) + "张手牌",
								player.countMark("jiemimrfz"),
								true,
								"h"
							);
						else player.draw(player.countMark("jiemimrfz"));
						//@ts-ignore
						player.logSkill("jiemimrfz");
					},
				},
			},
		},
	"shihuangmrfz": {
			audio: 2,
			usable: 2,
			trigger: { player: "loseAfter" },
			filter: function (event, player) {
				if (event.type != "discard" || event.getlx === false) return false;
				if (event.name.indexOf("lose") != 0) return event.name != "phase" || game.phaseNumber == 0;
				var evt = event.getl(player);
				var num = 0;
				for (var i = 0; i < evt.cards2.length; i++) {
					num += evt.cards2[i].number;
				}
				return num > player.hp * 2 && !player.hasSkill("shihuangmrfz2");
			},
			async content(event, trigger, player) {
				var num = 0;
				for (var i = 0; i < trigger.cards.length; i++) {
					//@ts-ignore
					num += trigger.cards[i].number;
				}
				player.addSkill("shihuangmrfz2");
				player.gain(trigger.cards, "gain2", "log");
			},
		},
	"baokemrfz": {
			audio: 2,
			usable: 1,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				//@ts-ignore
				if (event.getParent("phaseUse") && event.getParent("phaseUse").player != player) return false;
				if (event.player == player) return false;
				if (!event.player.isAlive()) return false;
				if (event.nature) return true;
				return event.player.getEquip(2);
			},
			async content(event, trigger, player) {
				trigger.player.damage();
			},
		},
});

translate({
	"keebomrfz": "刻俄柏",
	"jiemimrfz": "捷敏",
	"jiemimrfz_info": "锁定技，你的回合[外/内]，当你[成为牌的/使用单一目标的牌指定其他角色为]目标后，若这是你本回合第[偶数/奇数]次[成为/指定其他角色为]目标，你弃置X张手牌，反之，你摸X张牌。（X=本回合此技能发动次数+1）",
	"shihuangmrfz": "拾荒",
	"shihuangmrfz_info": "每回合限一次，当你的牌因弃置而进入弃牌堆后，若你弃置的牌的点数之和大于你体力值的2倍，你可以获得你弃置的牌。",
	"baokemrfz": "剥壳",
	"baokemrfz_info": "出牌阶段限一次，当你对一名其他角色造成伤害后，若此次伤害是属性伤害或该角色防具栏不为空，你可以额外对其造成一点伤害。",
});

characterIntro("keebomrfz", "刻俄柏，流浪者，从有意识开始就在四处流浪，在流浪途中被野外恶劣环境感染，凭着常人所不具备的直觉和意志一直撑到了现在。</br>现已被罗德岛救助并顺利通过干员测试，成为罗德岛的一员。");
