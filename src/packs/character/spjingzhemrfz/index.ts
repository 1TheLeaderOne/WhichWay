import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("spjingzhemrfz", { pack: "legendSJZX",
			sex: "female",
			group: "yanmrfz",
			hp: 4,
			skills: ["xiuyuanmrfz","zhengningmrfz"],
		});

skill({
	"xiuyuanmrfz": {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCardToPlayered",
				target: "useCardToTargeted",
			},
			init() {
				//@ts-ignore
				game.broadcastAll(() => {
					lib.translate["visible_xiuyuanmrfz"] = "明置";
				});
			},
			filter(event, player) {
				if (!get.tag(event.card, "damage") || player.countCards("h", "ying") > player.maxHp) {
					return false;
				}
				return player === event.target || event.getParent().triggeredTargets3.length === 1;
			},
			async content(event, trigger, player) {
				await player.gain(lib.card.ying.getYing(1), "gain2");
				let needShown = player.getCards("h", card => get.name(card) === "ying" && !get.is.shownCard(card));
				if (needShown.length > 0) player.addShownCards(needShown, "visible_xiuyuanmrfz");
			},
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("visible_xiuyuanmrfz")) return true;
				},
				cardDiscardable: function (card, player, name) {
					if (name === "phaseDiscard" && card.hasGaintag("visible_xiuyuanmrfz")) return false;
				},
				globalTo(from, to, distance) {
					let num = to.countCards("h", "ying");
					return distance + num;
				},
			},
		},
	"zhengningmrfz": {
			audio: 2,
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return player.countCards("h", "ying") > 0 || game.countPlayer(char => char.isLinked()) > 0;
			},
			async cost(event, trigger, player) {
				let result = {
					num: 0,
					discards: [],
					links: [],
				};
				if (player.countCards("h", "ying") > 0) {
					const { cards } = await player
						.chooseCard("h")
						.set("prompt", get.prompt("zhengningmrfz"))
						.set(
							"prompt2",
							"<font color = red>选择“确定”即不弃置【影】</font><br>你可以弃置任意张【影】、横置至多等量角色并摸等量张牌，然后你展示所有手牌并令一名横置且本回合未以此法选择过的角色进行判定，若你手牌中有与判定牌花色相同的牌，你可以弃置之并对其造成一点雷属性伤害，若其受到伤害，你可以重复此流程。"
						)
						.set("filterCard", card => get.name(card) === "ying")
						.set("selectCard", [0, Infinity])
						.set("ai", card => {
							let player = get.player();
							let num = game.countPlayer(char => !char.isLinked() && get.effect(char, { name: "tiesuo" }, player, player) > -1);
							return ui.selected.cards.length < num ? 1 : -1;
						})
						.forResult();
					if (cards?.length) {
						result.num = cards.length;
						//@ts-ignore
						result.discards = cards;
					} else return;
				}
				if (result.num > 0) {
					const { targets } = await player
						.chooseTarget()
						.set("prompt", get.prompt("zhengningmrfz"))
						.set("prompt2", `<font color = red>选择“确定”即不横置角色</font><br>你可以至多横置${get.cnNumber(result.num)}名角色`)
						.set("filterTarget", (card, player, target) => !target.isLinked())
						.set("selectTarget", [0, result.num])
						.set("ai", target => {
							let player = get.player();
							return get.effect(target, { name: "tiesuo" }, player, player) > -1;
						})
						.forResult();
					//@ts-ignore
					if (targets && targets.length) result.links = targets;
				}
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("zhengningmrfz"))
					.set("prompt2", `令一名被横置的角色进行判定，然后你可能对其造成一点雷属性伤害`)
					.set("filterTarget", (card, player, target) => {
						//@ts-ignore
						let links = get.event().links;
						for (let char of links) {
							char.showPrompt("即将被横置", undefined, true);
						}
						return target.isLinked() || links.includes(target);
					})
					.set("ai", target => {
						let player = get.player();
						return get.damageEffect(target, player, player, "thunder") > 0;
					})
					.set("links", result.links)
					.forResult();
				event.result.cost_data = result;
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				const { discards, links, num } = event.cost_data;

				if (num > 0) {
					await player.discard(discards);
					await player.draw(num);
					for (let i of links) await i.link(true);
				}

				if (!target.isLinked()) return;

				const { suit } = await target.judge().forResult();
				if (player.countCards("h", { suit: suit }) < 1) return;
				const { bool } = await player
					.chooseToDiscard()
					.set("prompt", `【震佞】:你可以弃置一张${get.translation(suit)}的牌并对${get.translation(target)}造成一点雷属性伤害`)
					.set("ai", card => 8 - get.value(card))
					.set("filterCard", card => get.suit(card) === suit)
					.forResult();
				if (bool === true) {
					await target.damage("thunder", player).set("zhengningmrfz", true);
					if (
						player.hasHistory("sourceDamage", evt => {
							//@ts-ignore
							return (evt.zhengningmrfz = true);
						})
					) {
						let next = game.createEvent("zhengningmrfz");
						next.player = player;
						//@ts-ignore
						next.event = event;
						next.setContent(async (event, trigger, player) => {
							event.result = {};
							//@ts-ignore
							await lib.skill.zhengningmrfz.cost(event, trigger, player);
							if (event.result.bool) {
								event.targets = event.result.targets;
								event.cost_data = event.result.cost_data;
								player.logSkill("zhengningmrfz");
								//@ts-ignore
								await lib.skill.zhengningmrfz.content(event, trigger, player);
							}
						});
					}
				}
			},
		},
});

translate({
	"spjingzhemrfz": "司霆惊蛰",
	"spjingzhemrfz_prefix": "司霆",
	"xiuyuanmrfz": "修远",
	"xiuyuanmrfz_info": "锁定技，当你成为伤害类牌的目标或使用伤害类牌指定其他角色为目标后，若你手牌中【影】的数量不大于你的体力上限，你获得并明置一张【影】（不计入手牌上限）;其他角色计算与你的距离+X。（X=你手牌中【影】的数量）",
	"zhengningmrfz": "震佞",
	"zhengningmrfz_info": "结束阶段，你可以弃置任意张【影】、横置至多等量角色并摸等量张牌，然后你令一名被横置的角色进行判定，若你手牌中有与判定牌花色相同的牌，你可以弃置之并对其造成一点雷属性伤害，若其受到伤害，你可以重复此流程。",
});

characterTitle("spjingzhemrfz", "<font color = #6495ed>行道修远</font>");

characterIntro("spjingzhemrfz", "麟青砚，曾官居炎国大理寺少卿，现已辞去官职，回到天师府研修雷法。游历途中暂居罗德岛，参与部分外勤任务。");
