import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_306_leizi", { pack: "epicSJZX", sex: "female", group: "yanmrfz", hp: 3, skills: ["chunleimrfz", "zheqimrfz"] });

skill({
	chunleimrfz: {
		audio: ["作战中1","部署2"],
		trigger: { global: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCard({
				prompt:`【春雷】:你可以弃置一张黑色的牌，对${get.translation(trigger.player)}造成一点雷属性的伤害`,
				filterCard(card, player, event) {
					return get.color(card) === "black";
				},
				position:"he",
				ai(card) {
					const player = get.player();
					const target = trigger.player;
					const eff = get.damageEffect(target, player, player, "thunder");
					return (eff > 0 ?  (8 - get.value(card)) : -1);
				},
			}).forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			player.discard({ cards });
			player.line(trigger.player,"fire");
			trigger.player.damage({ nature: "thunder" });
		},
		ai: {
			expose: 0.1,
			threaten: 1.3,
		},
	},
	zheqimrfz: {
		audio: ["作战中2","作战中3"],
		forced: true,
		trigger: { global: "damageEnd" },
		usable: 1,
		filter(event, player) {
			return event.nature && event.nature == "thunder";
		},
		async content(event, trigger, player) {
			let target = _status.currentPhase;
			if (!target) return;
			target.addTempSkill("zheqimrfz_eff1");
			player.addTempSkill("zheqimrfz_eff2", { global: "phaseBegin" });
		},
		subSkill: {
			eff1: {
				mark: true,
				intro: {
					content: "<br>·使用牌无次数限制<br>·使用或打出一张非装备牌时，须弃置一张手牌<i>正月启蛰，言发蛰也。万物出乎震，震为雷，故曰惊蛰。是蛰虫惊而出走矣。<br>————《大戴礼记·夏小正》</i>",
				},
				mod: {
					cardUsable(card) {
						if (get.itemtype(card) == "card") return Infinity;
					},
				},
				forced: true,
				charlotte: true,
				trigger: { player: "useCard" },
				filter(event, player) {
					return event.card && get.type(event.card) != "equip" && player.countCards("h") > 0;
				},
				async content(event, trigger, player) {
					player.chooseToDiscard({ forced: true, prompt: "【蛰起】:请选择弃置一张手牌" }).set("ai", card => 6 - get.value(card));
				},
			},
			eff2: {
				audio: "zheqimrfz",
				forced: true,
				charlotte: true,
				trigger: { global: "phaseEnd" },
				getDiscard: function (event, player) {
					let history = event.player.getHistory("lose", function (evt) {
							return evt && evt.type == "discard";
						}),
						cards:Card[] = [];
					if (history.length == 0) return cards;
					for (let i = 0; i < history.length; i++) {
						let cardsList = history[i].cards;
						for (let j = 0; j < cardsList.length; j++) {
							if (get.position(cardsList[j], true) != "d") continue;
							cards.push(cardsList[j]);
						}
					}
					return cards;
				},
				filter(event, player) {
					let cards = lib.skill.zheqimrfz_eff2.getDiscard(event, player);
					return cards.length > 0;
				},
				async content(event, trigger, player) {
					let cards = lib.skill.zheqimrfz_eff2.getDiscard(trigger, player);
					const { links } = await player
						.chooseButton({
							//["【蛰起】:请选择你要获得的牌", cards]
							createDialog:["【蛰起】:请选择你要获得的牌", cards]
						})
						.set("forced", true)
						.set("filterButton", button => {
							let player = _status.event.player;
							return !ui.selected.buttons.some(i => get.type2(i, player) == get.type2(button, player));
						})
						.set("selectButton", [1, Infinity])
						.set("ai", button => {
							return _status.event.player.getUseValue(button.link);
						})
						.forResult();
					if (!links) return;
					player.gain({cards:links, animate:"gain2"});
				},
			},
		},
		ai: {
			threaten: 1.3,
		},
	},
});

translate({
	char_306_leizi: "惊蛰",
	chunleimrfz: "春雷",
	chunleimrfz_info: "每名角色的准备阶段，你可以弃置一张黑色的牌，然后你对其造成一点雷电伤害。",
	zheqimrfz: "蛰起",
	zheqimrfz_info: "锁定技，每回合限一次，当有角色受到雷属性伤害后，当前回合角色获得下列效果直到回合结束：1.使用牌无次数限制；2.使用一张非装备牌时，其须弃置一张手牌。然后此回合结束后，你选择获得其本回合因弃置而进入弃牌堆的牌（每种类型限一张）。",
});

characterIntro("char_306_leizi", "惊蛰，炎国大理寺所属官员，与罗德岛签署搜查协议后暂居于罗德岛。身具久经训练的战斗技巧与独特的源石技艺，在歼灭战、阵地战中表现优异，但因其身份特殊、动机暧昧，建议在交流中采用被动不合作态度。");

characterTitle("char_306_leizi","天地通明");