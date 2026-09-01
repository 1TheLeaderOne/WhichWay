import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("anzhelamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "liemrfz",
			hp: 3,
			skills: ["jianmomrfz","zhishemrfz","ruijuemrfz","tongmaimrfz"],
			clans: ["深海猎人"],
		});

skill({
	"zhishemrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return player.countCards("he") > 0 && game.hasPlayer(current => current.countCards("h") > 0 && current !== player);
			},
			filterTarget(card, player, target) {
				return target !== player && target.countCards("h") > 0;
			},
			filterCard: true,
			async content(event, trigger, player) {
				const { targets, cards } = event;
				let target = targets[0];
				const { cards: card2 } = await player
					.discardPlayerCard("h", target, true)
					.set("target", target)
					.set("complexSelect", false)
					.set("ai", lib.card.guohe.ai.button)
					.forResult();
				if (card2) player.draw(new Set([].concat(cards, card2).map(i => get.type2(i, player))).size);
				else player.draw();
				if (target.countCards("h") === 0 && card2) player.getStat("skill").zhishemrfz = 0;
			},
		},
	"jianmomrfz": {
			audio: 2,
			mod: {
				targetEnabled(card) {
					if (get.type(card) == "trick" || get.type(card) == "delay") return false;
				},
			},
			forced: true,
			firstDo: true,
			filter(event, player) {
				if (event.player == player) return false;
				if (get.color(event.card) != "black" || get.type(event.card) != "trick") return false;
				var info = lib.card[event.card.name];
				return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
			},
			async content(event, trigger, player) {},
		},
	"ruijuemrfz": {
			audio: 2,
			trigger: {
				player: ["loseAfter", "gainAfter"],
			},
			filter(event, player) {
				if (player.countCards("he") < 1) return false;
				if (event.name === "lose") return event.type === "discard" && event.getl(player).cards2.length > 0;
				else {
					const evt = event.getParent("phaseDraw");
					if (evt?.player == player) return false;
					return event.getg(player).length > 0 && player.getCards("h").some(card => player.hasUseTarget(card, false));
				}
			},
			async cost(event, trigger, player) {
				if (trigger.name === "lose") {
					event.result = await player
						.chooseCard("he", [1, player.countCards("he")])
						.set("prompt", `【锐觉】:你可以重铸任意张牌`)
						.set("ai", card => get.value(card, player) < 7)
						.set("filterCard", (card, player) => player.canRecast(card))
						.forResult();
				} else {
					event.result = await player
						.chooseBool()
						.set("prompt", `【锐觉】:你可以使用一张牌（无距离限制且不计入次数限制）`)
						.set("ai", () => {
							let player = get.player();
							return player.getCards("h").some(card => {
								return player.hasUseTarget(card, false) && game.hasPlayer(char => get.effect(char, card, player, player) > 0);
							});
						})
						.forResult();
				}
			},
			async content(event, trigger, player) {
				if (trigger.name === "lose") {
					player.recast(event.cards);
				} else {
					player.chooseToUse().set("prompt", `【锐觉】:请使用一张手牌`).set("addCount", false).set("nodistance", true);
				}
			},
			mod: {
				targetInRange(card, player, target, now) {
					let event = get.event();
					if (event.nodistance) return true;
				},
			},
		},
});

translate({
	"anzhelamrfz": "安哲拉",
	"zhishemrfz": "滞射",
	"zhishemrfz_info": "出牌阶段限一次，你可以弃置一张牌并弃置一名攻击范围内的其他角色的一张手牌，若有角色因此失去了所有手牌，此技能视为未发动过，然后你摸X张牌。（X=因此弃置的牌的类别数）",
	"jianmomrfz": "缄默",
	"jianmomrfz_info": "锁定技，你不能成为锦囊牌的目标。",
	"ruijuemrfz": "锐觉",
	"ruijuemrfz_info": "当你[因弃置而失去牌/于摸牌阶段外获得牌]后，你可以[重铸任意张牌/使用一张牌（无距离限制且不计入次数限制）]。",
});

characterTitle("anzhelamrfz", "<font color='#6495ed'>缄默的杀手</font>");

characterIntro("anzhelamrfz", "安哲拉，伊比利亚出身，干员白炽的保镖，与白炽一同接受罗德岛的雇佣。拥有良好的狙击素养，接受专业培训后，作为狙击干员活跃在各类任务中。");
