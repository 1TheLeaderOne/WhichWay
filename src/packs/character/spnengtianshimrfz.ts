import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("spnengtianshimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "lamrfz",
			hp: 3,
			skills: ["youhuomrfz","letianmrfz"],
		});

skill({
	"youhuomrfz": {
			audio: 2,
			trigger: { player: "useCard" },
			filter(event, player) {
				return event.card.name === "sha" && player.countCards("h", card => player.canRecast(card)) > 0;
			},
			intro: {
				content(_, player) {
					let addCount = player.getSkills().filter(skill => {
						let info = get.info(skill);
						return info.youhuomrfz;
					}).length;
					return `·本回合可额外使用${addCount}张【杀】<br>·本回合剩余可使用【杀】的数量：${player.getCardUsable("sha")}`;
				},
			},
			async cost(event, trigger, player) {
				let num = player.getHistory("useSkill", evt => evt.skill === "youhuomrfz").length + 1;
				event.result = await player
					.chooseCard()
					.set("filterCard", (card, player) => player.canRecast(card))
					.set("prompt", get.prompt("youhuomrfz"))
					.set(
						"prompt2",
						`你可以重铸一张手牌，若此牌为伤害类牌，此牌(${get.translation(trigger.card)})额外结算${num}次，且若此牌造成伤害，你本回合使用【杀】的次数+1`
					)
					.set("ai", card => {
						let num = 6 - get.value(card);
						if (get.tag(card, "damage")) num += 2;
						return num;
					})
					.forResult();
			},
			async content(event, trigger, player) {
				let num = player.getHistory("useSkill", evt => evt.skill === "youhuomrfz").length;
				await player.recast(event.cards);
				if (get.tag(event.cards[0], "damage") > 0) {
					//@ts-ignore
					trigger.effectCount += num;
					player
						.when({
							source: "damageEnd",
							global: lib.phaseName.map(i => i + "End"),
						})
						.filter(event => {
							return event.name !== "damage" || event.card === trigger.card;
						})
						.then(() => {
							if (trigger.name === "damage") {
								player.markSkill("youhuomrfz");
								player
									.when({ player: "phaseEnd" })
									.then(() => {
										player.unmarkSkill("youhuomrfz");
									})
									.assign({
										mod: {
											cardUsable(card, player, num) {
												if (card.name == "sha") return num + 1;
											},
										},
										youhuomrfz: true,
									});
							}
						});
				}
			},
		},
	"letianmrfz": {
			audio: 2,
			init() {
				lib.translate["letianmrfz_tips"] = "旧约";
			},
			forced: true,
			trigger: { global: "phaseEnd" },
			filter(event, player) {
				return player.countCards("h", card => card.hasGaintag("letianmrfz_tips")) < 1;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.drawTo(4);
				player.removeGaintag("letianmrfz_tips");
			},
			group: ["letianmrfz_begin"],
			subSkill: {
				begin: {
					charlotte: true,
					silent: true,
					priority: 114514,
					trigger: {
						global: "phaseBegin",
					},
					async content(event, trigger, player) {
						for (let card of player.getCards("h")) {
							card.addGaintag("letianmrfz_tips");
						}
					},
				},
			},
		},
});

translate({
	"spnengtianshimrfz": "新约能天使",
	"spnengtianshimrfz_prefix": "新约",
	"youhuomrfz": "优火",
	"youhuomrfz_info": "当你使用【杀】时，你可以重铸一张手牌，若此牌为伤害类牌，此牌额外结算X+1次，且若此牌造成伤害，你本回合使用【杀】的次数+1。（X=本回合使用此技能的次数）",
	"letianmrfz": "乐天",
	"letianmrfz_info": "锁定技，任意角色回合结束时，若你所有手牌与本回合开始时的手牌交集为空集，你将手牌补至4张。",
});

characterTitle("spnengtianshimrfz", "<font color='#6495ed'>圣城趣事通</font>");

characterIntro("spnengtianshimrfz", "能天使，拉特兰公民，适用拉特兰一至十三项公民权益。在合约期间，于秘密联络、武装押运等多项行动中为罗德岛提供帮助。现应本人要求，将其登记的合作身份更新为：企鹅物流资深员工，拉特兰新创物流公司“苹果派物流”老板。");
