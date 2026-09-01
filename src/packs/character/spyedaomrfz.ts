import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("spyedaomrfz", { pack: "legendSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 3,
			maxHp: 4,
			skills: ["luanwumrfz"],
		});

skill({
	"guirenmrfz": {
			audio: 2,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				if (player.getHandcardLimit() == 0) return false;
				return event.card.name == "sha";
			},
			prompt: function (event, player) {
				return "你可以令此【杀】额外结算一次，然后本回合的手牌上限-1。(当前手牌上限:" + player.getHandcardLimit() + ")";
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
				//@ts-ignore
				trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
				if (!player.hasSkill("guirenmrfz2")) player.addTempSkill("guirenmrfz2");
				if (!player.hasSkill("guirenmrfz_lose")) player.addTempSkill("guirenmrfz_lose");
				player.storage.guirenmrfz2++;
			},
			subSkill: {
				lose: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseUseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("guirenmrfz");
						player.addSkill("guiqiangmrfz");
					},
				},
			},
		},
	"guiqiangmrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			frequent: true,
			async content(event, trigger, player) {
				//@ts-ignore
				player.drawTo(Math.min(player.maxHp, 4));
				const result = await player
					.chooseToDiscard(get.prompt("guiqiangmrfz"), "你可以弃置一张牌并失去此技能，然后获得【鬼人】", "he")
					.set("ai", function (card) {
						return 6 - get.value(card);
					})
					.forResult();
				if (result.cards) {
					player.removeSkill("guiqiangmrfz");
					player.addSkill("guirenmrfz");
				}
			},
		},
	"luanwumrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			derivation: ["guiqiangmrfz", "guirenmrfz"],
			check: function (event, player) {
				if (
					player.countCards("h", function (card) {
						return get.type2(card) == "trick" || get.tag(card, "damage");
					}) > 2
				)
					return false;
				if (player.getHandcardLimit() > 2) return false;
				return game.hasPlayer(function (current) {
					return current != player && player.inRange(current) && get.attitude(player, current) < 0;
				});
			},
			filter: function (event, player) {
				if (
					!game.hasPlayer(function (current) {
						return current != player && player.inRange(current);
					})
				)
					return false;
				return player.hasSkill("guirenmrfz");
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				result = await player
					.chooseTarget(true, "【乱舞】:请选择一名其他角色，视为对其使用一张结算三次的【杀】", (card, player, target) => {
						return target !== player && player.inRange(target);
					})
					.set("ai", target => {
						return -get.attitude(player, target);
					})
					.forResult();

				// step 1
				if (result.targets) {
					const target = result.targets[0];
					player.addTempSkill("luanwumrfza", {
						player: "shaAfter",
					});
					await player.useCard({ name: "sha", isCard: true }, target);
				}

				// step 2
				player.skip("phaseUse");
				player.skip("phaseDraw");
				player.skip("phaseJudge");
				if (!player.hasSkill("luanwumrfz_dam")) {
					player.addSkill("luanwumrfz_dam");
				}
			},
			group: "luanwumrfz_add",
			subSkill: {
				dam: {
					mark: true,
					intro: {
						content: "受到的伤害+1",
					},
					direct: true,
					charlotte: true,
					trigger: { player: "damageBegin" },
					async content(event, trigger, player) {
						trigger.num++;
						player.removeSkill("luanwumrfz_dam");
					},
				},
				add: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseUseBegin" },
					async content(event, trigger, player) {
						player.addSkill("guirenmrfz");
						player.removeSkill("luanwumrfz_add");
					},
				},
			},
		},
});

translate({
	"spyedaomrfz": "麒麟R夜刀",
	"guirenmrfz": "鬼人",
	"guirenmrfz_info": "出牌阶段，若你的手牌上限大于0，当你使用【杀】指定目标后，你可以令自己本回合的手牌上限－1，然后令此【杀】的额外结算一次，若如此做，则你于出牌阶段结束时失去【鬼人】并获得【鬼强】。",
	"guiqiangmrfz": "鬼强",
	"guiqiangmrfz_info": "准备阶段，你可以将手牌补至你的体力上限（至多补至4张），然后你可以弃置一张牌失去【鬼强】并获得【鬼人】。",
	"luanwumrfz": "乱舞",
	"luanwumrfz_info": "①准备阶段，若你拥有【鬼人】，你可以跳过你的判定、摸牌和出牌阶段，然后视为使用一张结算三次的【杀】，然后你下次受到的伤害+1（此效果不叠加）。②锁定技，出牌阶段开始时，你获得【鬼人】，然后失去【乱舞②】。",
});

characterIntro("spyedaomrfz", "<span class=firetext>联动：怪物猎人</span></br>夜刀，经过短暂的治疗后，从东国回到岗位，继续履行罗德岛A4行动组组长的职责。换上了由艾露猫打造的全新装备，她将会承担更多高难度的攻坚行动，而她的意志也比以往都要强大。");
