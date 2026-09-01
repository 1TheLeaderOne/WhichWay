import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("ashmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 3,
			hujia: 1,
			skills: ["baigeimrfz","wusumrfz","wutoumrfz"],
		});

skill({
	"wusumrfz": {
			intro: {
				content: function (event, player) {
					if (player.countMark("wusumrfz") == 0) return "Ash已化身监控室大爷";
					return "FBI突击中</br>距离ASH白给还剩" + (5 - player.countMark("wusumrfz")) + "个阶段";
				},
			},
			mark: true,
			audio: 2,
			trigger: {
				player: ["phaseZhunbeiBefore", "phaseJudgeBefore", "phaseDrawBefore", "phaseDiscardBefore", "phaseJieshuBefore"],
			},
			forced: true,
			filter: function (event, player) {
				return event.getParent("phase");
			},
			async content(event, trigger, player) {
				trigger.cancel();
				var next = trigger.player.phaseUse();
				event.next.remove(next);
				//@ts-ignore
				trigger.getParent("phase").next.push(next);
				player.addMark("wusumrfz");
			},
			group: "wusumrfz_draw",
			subSkill: {
				draw: {
					forced: true,
					trigger: { player: "phaseUseBegin" },
					async content(event, trigger, player) {
						player.draw();
					},
				},
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (get.type(card) == "delay") return "zeroplayertarget";
					},
				},
			},
		},
	"wutoumrfz": {
			audio: 2,
			forced: true,
			usable: 1,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return event.num === player.hp;
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
		},
	"baigeimrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "phaseUseEnd" },
			filter: function (event, player) {
				return player.countMark("wusumrfz") >= 5;
			},
			async content(event, trigger, player) {
				if (player.countMark("wusumrfz") >= 5) {
					var num = player.countCards("h") - player.getHandcardLimit();
					var chattext = [
						"窗下怎么会有个夹子？",
						"为什么会有人放站位edd！",
						"（Ash听到的敌方干员的声音）call a pizza！",
						'（狼人手枪的枪声）女鬼:"talk"',
						"(剃刀花的声音)",
						"(两个蛊声，三条枪线)",
						"(发射祖母榴弹->rush->火山盾炸裂的声音)",
						"“友军已将你击杀”",
					].randomGet();
					if (num > 0) {
						//@ts-ignore
						player.logSkill("baigeimrfz");
						player.chooseToDiscard("h", num, true, "弃置" + get.cnNumber(num) + "张手牌");
					}
					player.removeMark("wusumrfz", 5);
					player.chat(chattext);
				}
			},
		},
});

translate({
	"ashmrfz": "ASH",
	"wusumrfz": "五速",
	"wusumrfz_info": "锁定技，你的准备阶段、判断阶段、摸牌阶段和弃牌阶段均视为出牌阶段；出牌阶段开始时，你摸一张牌。",
	"wutoumrfz": "无头",
	"wutoumrfz_info": "锁定技，每回合限一次，当你受到伤害时，若此伤害值等于你当前体力值，取消之。",
	"baigeimrfz": "白给",
	"baigeimrfz_info": "锁定技，出牌阶段结束时，若你已执行了五个出牌阶段，你须将手牌弃置至手牌上限。",
});

characterIntro("ashmrfz", "<span class=firetext>联动：彩虹六号:围攻</span></br>灰烬，彩虹小队成员之一，暂时担当小队队长职务，严于律己，恪尽职守，为整个小队谋划行动方针。</br>灰烬使用一把M120CREM爆破弹发射器，可以对重装目标造成伤害，也可破开障碍物，为小队行动增加战术选择。");
