import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("spfenmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["xiaozhimrfz","zhishoumrfz"],
		});

skill({
	"xiaozhimrfz": {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			filter: function (event, player) {
				return event.card.name == "sha" && player.canCompare(event.target);
			},
			logTarget: "target",
			async content(event, trigger, player) {
				var result = await player.chooseToCompare(trigger.target).forResult();
				if (!result || !result.cards) return;
				result = result.cards;
				if (result.winner != player) player.draw(2);
				if (result.winner != trigger.target) {
					var cards = [result.player, result.target];
					cards = cards.filter(card => player.hasUseTarget(card) && !get.owner(card));
					if (cards.length) {
						var { links } = await player
							.chooseButton(["是否使用其中的牌？", cards])
							.set("ai", button => _status.event.player.getUseValue(button.link))
							.forResult();
						if (links) {
							var card = links[0];
							player.$gain2(card, false);
							game.delayx();
							player.chooseUseTarget(true, card, false);
						}
					}
					//@ts-ignore
					trigger.getParent().directHit.add(trigger.target);
				}
			},
		},
	"zhishoumrfz": {
			audio: 2,
			enable: "chooseToUse",
			filterCard(card) {
				return get.itemtype(card) == "card" && card.hasGaintag("zhishoumrfz");
			},
			subfrequent: ["addcount"],
			position: "h",
			viewAs(cards, player) {
				if (cards.length) {
					if (_status.currentPhase == player) return { name: "sha" };
					return { name: "shan" };
				}
				return null;
			},
			viewAsFilter(player) {
				if (!player.countCards("h", card => card.hasGaintag("zhishoumrfz"))) return false;
			},
			prompt(event) {
				return `【执守】:将本轮出牌阶段内获得的牌当作${_status.currentPhase === event.player ? "【闪】" : "【杀】"}使用`;
			},
			check(card) {
				return 7 - get.value(card);
			},
			onremove(player) {
				player.removeGaintag("zhishoumrfz");
			},
			ai: {
				order: 2,
				respondShan: true,
				respondSha: true,
				skillTagFilter(player, tag, arg) {
					if (arg == "respond" || !player.countCards("h", card => _status.connectMode || card.hasGaintag("zhishoumrfz"))) return false;
				},
				result: {
					player: 1,
				},
			},
			group: ["zhishoumrfz_mark", "zhishoumrfz_addcount"],
			subSkill: {
				addcount: {
					audio: "zhishoumrfz",
					trigger: { player: "gainAfter" },
					lastDo: true,
					frequent: true,
					filter(event, player) {
						var evt = event.getParent("phaseDraw");
						if (player.hasSkill("zhishoumrfz_eff")) return false;
						if (evt && evt.player == player) return false;
						return event.getg(player).length > 0;
					},
					prompt: "【执守】:是否令本轮使用【杀】的次数+1？",
					check() {
						return true;
					},
					async content(event, trigger, player) {
						player.addTempSkill("zhishoumrfz_eff", { global: "roundStart" });
					},
				},
				eff: {
					mark: true,
					intro: {
						content: "使用【杀】的次数+1",
					},
					charlotte: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
				mark: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "roundStart",
						player: "gainBegin",
					},
					filter(event, player) {
						if (event.name == "gain") return player.isPhaseUsing();
						else return game.roundNumber > 1;
					},
					async content(event, trigger, player) {
						if (trigger.name == "gain") trigger.gaintag.add("zhishoumrfz");
						else player.removeGaintag("zhishoumrfz");
					},
				},
			},
		},
});

translate({
	"spfenmrfz": "历阵锐枪芬",
	"spfenmrfz_prefix": "历阵锐枪",
	"xiaozhimrfz": "骁智",
	"xiaozhimrfz_info": "当你使用的【杀】指定目标后，你可以与该角色拼点，若你没赢，你摸两张牌，若你没输，你可以使用其中一张拼点牌（无次数距离限制）且此杀不可被响应。",
	"zhishoumrfz": "执守",
	"zhishoumrfz_info": "你的回合[内/外]，你可以将本轮出牌阶段内获得的牌当作[【杀】/【闪】]使用或打出，当你不于摸牌阶段获得牌后，你本轮杀的使用次数+1（不可叠加）。",
});

characterIntro("spfenmrfz", "芬，经历刻苦训练与多次外勤任务后，芬如愿通过考核，成为罗德岛正式干员。她在历练中磨练了自己的心智和能力，掌握了战场指挥的要点和一线工作必需的沟通技巧。面对危机时，芬已不再急躁，她有足够的能力和耐心解决问题。");
