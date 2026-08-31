import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("amiyamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["newtongganmrfz","shijiemrfz","qinghemrfz"],
			isZhugong: true,
		});

skill({
	"qinghemrfz": {
			audio: 2,
			zhuSkill: true,
			trigger: {
				player: "loseAfter",
				global: "loseAsyncAfter",
			},
			filter: function (event, player) {
				if (player == _status.currentPhase) return false;
				return event.type == "discard" && event.getl(player).cards2.length > 0 && !player.hasSkill("qinghemrfz_ban");
			},
			direct: true,
			async content(event, trigger, player) {
				var target = _status.currentPhase;
				if (!target) return;
				const { bool } = await target
					.chooseBool("【亲和】：是否让" + get.translation(player) + "其弃置的牌中的一张牌？")
					.set("ai", () => {
						return get.attitude(_status.currentPhase, _status.event.targetx) > 0;
					})
					.set("targetx", player)
					.forResult();

				if (bool) {
					let target = _status.currentPhase;
					if (!target) return;
					player.addTempSkill("qinghemrfz_ban", "phaseEnd");
					if (trigger.cards.length == 1) {
						player.gain(trigger.cards, "gain2");
						event.finish();
					}
					if (trigger.cards.length > 1) {
						const result = await target
							.chooseButton(["选择获得令其获得其中的一张牌", trigger.cards.slice(0)], true)
							.set("ai", button => get.value(button.link))
							.forResult();
						if (result.links) {
							//@ts-ignore
							player.logSkill("qinghemrfz");
							player.gain(result.links, "gain2");
						}
					}
				}
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
	"newtongganmrfz": {
			audio: "tongganmrfz",
			trigger: {
				global: "phaseEnd",
			},
			findGainAndDiscardHistory() {
				let result = {
					gain: [],
					discard: [],
				};
				game.players.forEach(char => {
					char.getHistory("gain", evt => {
						if (evt.name === "gain") result.gain.add(char);
					});
					char.getHistory("lose", evt => {
						if (evt.type === "discard") result.discard.add(char);
					});
				});
				return result;
			},
			filter(event, player) {
				let result = lib.skill.newtongganmrfz.findGainAndDiscardHistory();
				return (result.gain.length > 0 || result.discard.length > 0) && event.player !== player;
			},
			forced: true,
			async content(event, trigger, player) {
				let { gain, discard } = lib.skill.newtongganmrfz.findGainAndDiscardHistory();
				await player.draw(gain.length);
				if (discard.length) player.chooseToDiscard(discard.length, true, `【同感】:请弃置${discard.length}张牌`, "he");
			},
		},
	"shijiemrfz": {
			mod: {
				canBeDiscarded(card, target, player) {
					if (get.position(card) === "h" && player.countCards("h") <= 5) return false;
				},
			},
			audio: 2,
			trigger: {
				player: ["gainBegin", "loseBegin"],
			},
			forced: true,
			filter(event, player) {
				return event.name === "gain"
					? player.countCards("h") >= 10 && event.getParent().name === "draw"
					: player.countCards("h") <= 5 && event.type === "discard";
			},
			async content(event, trigger, player) {
				if (event.name === "gain") {
					let cards = trigger.getParent().result;
					game.cardsDiscard(cards);
					game.log(player, "取消了此次摸牌");
				} else {
					game.log(player, "取消了此次弃牌");
				}
				trigger.cancel();
			},
		},
});

translate({
	"amiyamrfz": "阿米娅",
	"qinghemrfz": "亲和",
	"qinghemrfz_info": "主公技，每回合限一次，当你于回合外因弃置而失去牌时，当前回合角色可以让你获得你弃置的牌中的一张牌。",
	"newtongganmrfz": "同感",
	"newtongganmrfz_info": "锁定技，其他角色回合结束时，你摸X张牌且弃置Y张牌。（X=本回合获得过牌的角色数，Y=本回合因弃置而失去牌的角色数）",
	"shijiemrfz": "十戒",
	"shijiemrfz_info": "锁定技。<br>①当你手牌数不小于10时，你不能从牌堆中获得牌;<br>➁当你手牌数不大于5时，你不能因弃置而失去手牌。",
});

characterTitle("amiyamrfz", "<font color=#00868B>魔王</font>");

characterIntro("amiyamrfz", "阿米娅，罗德岛的公开领袖，在内部拥有最高执行权。虽然，从外表上看起来仅仅是个不成熟的少女，实际上，她却是深受大家信任的合格的领袖。现在，阿米娅正带领着罗德岛，为了感染者的未来，为了让这片大地挣脱矿石病的阴霾而不懈努力。");
