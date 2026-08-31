import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("semrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["mojianmrfz","huanghunmrfz","yujinmrfz"],
		});

skill({
	"yujinmrfz": {
			audio: 2,
			trigger: { player: "dying" },
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "余烬",
			animationColor: "fire",
			init: function (player) {
				player.storage.yujinmrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.yujinmrfz;
			},
			async content(event, trigger, player) {
				player.storage.yujinmrfz = true;
				let next = [
					player.phaseZhunbei(),
					player.phaseJudge(),
					player.phaseDraw(),
					player.phaseUse(),
					player.phaseDiscard(),
					player.phaseJieshu(),
				];
				for (var i = 0; i < next.length; i++) {
					event.next.remove(next[i]);
					trigger.next.push(next[i]);
				}
				player.awakenSkill(event.name);
			},
			group: "yujinmrfz_rec",
			subSkill: {
				rec: {
					audio: "huanghunmrfza",
					trigger: { player: "turnOverAfter" },
					filter: function (event, player) {
						return player.storage.yujinmrfz == true && !player.isTurnedOver();
					},
					forced: true,
					async content(event, trigger, player) {
						player.storage.yujinmrfz = false;
					},
				},
			},
		},
	"huanghunmrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			check: function (event, player) {
				if (player.countCards("he") < 3) return false;
				if (
					player.countCards("j") > 0 &&
					!player.hasCard(function (card) {
						return card.name == "wuxie";
					}, "h")
				)
					return false;
				return player.hasCard(function (card) {
					return card.name == "sha";
				}, "h"); //QQQ
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseToDiscard("he", "【黄昏】:你可以至多弃置两张牌，然后增加等量的体力上限", [0, 2])
					.set("ai", function (card) {
						return 6 - get.value(card);
					})
					.forResult();

				if (result.cards) {
					await player.gainMaxHp(result.cards.length);
				}

				player.addTempSkill("huanghunmrfz_lose");
				player.addTempSkill("huanghunmrfz_dam");
				player.turnOver();
			},
			subSkill: {
				lose: {
					direct: true,
					charlotte: true,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						return get.tag(event.card, "damage");
					},
					async content(event, trigger, player) {
						player.loseMaxHp();
					},
				},
				dam: {
					audio: "huanghunmrfz",
					trigger: { source: "damageBegin" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
					mod: {
						selectTarget: function (card, player, range) {
							if (card.name == "sha" && range[1] != -1) range[1] += 2;
						},
						attackRange: function (player, num) {
							return (num += 2);
						},
					},
				},
			},
		},
	"mojianmrfz": {
			audio: 2,
			trigger: { source: "damageEnd" },
			usable: 2,
			filter: function (event, player) {
				return event.nature == "fire" && player.isPhaseUsing();
			},
			async content(event, trigger, player) {
				player.draw(2);
			},
			mod: {
				cardnature: function (card, player) {
					if (card.nature != "thunder" && card.name == "sha") return "fire";
					if (card.nature == "thunder" && card.name == "sha") return false;
				},
			},
		},
});

translate({
	"semrfz": "史尔特尔",
	"yujinmrfz": "余烬",
	"yujinmrfz_info": "①锁定技，限定技，每轮限一次，当你进入濒死状态时，你执行一个额外的回合。②锁定技，当你的武将牌从背面朝上翻面至正面朝上时，【余烬①】视为没有发动过。",
	"huanghunmrfz": "黄昏",
	"huanghunmrfz_info": "准备阶段，你可以将你的武将牌翻面并可以弃置至多两张牌，你每弃置一张牌你的体力上限+1，然后本回合每使用一张带有伤害类标签的牌体力上限-1、攻击距离+2和你使用【杀】造成的伤害+1且可额外指定至多两个目标。",
	"mojianmrfz": "魔剑",
	"mojianmrfz_info": "锁定技，你的非雷属性【杀】均视为火属性【杀】，你的雷属性【杀】均视为普通【杀】；出牌阶段限两次，当你造成火焰伤害后，你摸两张牌。",
});

characterIntro("semrfz", "史尔特尔，神秘的萨卡兹少女，或因矿石病影响导致缺失性记忆障碍，其情况在矿石病病理中也极其少见，现于罗德岛接受治疗中。</br>在测试过程中展现出了原因不详的强大战斗能力，很快成为了作战干员。");
