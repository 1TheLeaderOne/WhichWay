import { lib, game, ui, get, ai, _status } from "noname";
import { skillCustomFunc } from "../../../nonameEx/custom/skill.ts";
import { whichWayTips } from "../../../tips/index.ts";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yelamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "xiemrfz",
			hp: 4,
			skills: ["shengshimrfz", "xueweimrfz"],
		});

skill({
	"shengshimrfz": {
			mod: {
				aiValue(player, card, num) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return num - 10;
				},
				cardUsable(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
				cardEnabled(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
				cardEnabled2(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
				cardSavable(card, player) {
					//@ts-ignore
					if (card?.cards?.some(i => i.hasGaintag("shengshimrfz_pile"))) return false;
				},
			},
			audio: ["任命队长", "行动出发"],
			onremove(player, skill) {
				player.getCards("s", card => card.hasGaintag("shengshimrfz_pile")).forEach(i => i.delete());
				if (!player.playerid) return;
				tmpSave[player.playerid]["observer_shengshimrfz"].disconnect();
				tmpSave[player.playerid]["observer_shengshimrfz"].takeRecords();
				tmpSave[player.playerid]["observer_shengshimrfz"] = null;
			},
			init(player, skill) {
				lib.translate["shengshimrfz_pile"] = "牌堆顶";

				let recordCount;
				const observer = new MutationObserver(() => {
					if (player.isDead()) {
						//@ts-ignore
						lib.skill.shengshimrfz.onremove(player, skill);
						return;
					}
					let currentCount = ui.cardPile.childNodes.length;
					if (currentCount !== recordCount) {
						recordCount = currentCount;

						let pileCards = player.getCards("s", card => card.hasGaintag("shengshimrfz_pile"));
						pileCards.forEach(card => card.delete());

						let cards = get.cards(4, true);
						//@ts-ignore
						let copy_cards = cards.map(card => {
							let copy_card = ui.create.card();
							//@ts-ignore
							copy_card.init(get.cardInfo(card));
							//@ts-ignore
							copy_card._cardid = card.cardid;
							//@ts-ignore
							copy_card._destroy = true;
							return copy_card;
						});
						for (let i = 0; i < copy_cards.length; i++) {
							/** @type { Card } */
							let card = copy_cards[i];
							whichWayTips.addPrompt(card, `第${i + 1}张`, "shengshimrfz_pile");
							skillCustomFunc.invisableJiZhan(card, player);
						}
						player.directgains(copy_cards, null, "shengshimrfz_pile");
					}
				});

				observer.observe(ui.cardPile, {
					childList: true,
					subtree: false,
				});

				if (player.playerid) {
					tmpSave[player.playerid] ??= {};
					tmpSave[player.playerid]["observer_shengshimrfz"] = observer;
				}
			},
			trigger: {
				player: "chooseToDiscardBegin",
			},
			forced: true,
			async content(event, trigger, player) {
				if (typeof trigger.position === "string") trigger.position += "s";
				else trigger.position = "hs";
			},
			group: ["shengshimrfz_replace"],
			subSkill: {
				replace: {
					audio: false,
					silent: true,
					charlotte: true,
					trigger: { player: "chooseToDiscardEnd" },
					filter(event, player) {
						if (!event.result?.cards) return false;
						//@ts-ignore
						let cardsid = get.cards(4, true).map(i => i.cardid);
						//@ts-ignore
						return event.result.cards.some(card => cardsid.includes(card._cardid));
					},
					async content(event, trigger, player) {
						//@ts-ignore
						let cardsid = get.cards(4, true).map(i => i.cardid);

						//@ts-ignore
						trigger.result.cards = trigger.result.cards.map(card => {
							//@ts-ignore
							if (!cardsid.includes(card._cardid)) return card;
							//@ts-ignore
							return get.cards(4, true).find(cardx => cardx.cardid === card._cardid);
						});
						//@ts-ignore
						trigger.done = game.cardsDiscard(trigger.result.cards);
					},
				},
			},
		},
	"xueweimrfz": {
			audio: ["作战中3", "作战中4"],
			enable: "phaseUse",
			usable: 1,
			getSelect(player) {
				let evts = player.getHistory("useCard", evt => evt.card.name === "huogong");
				if (evts.length < 1) return 3;
				let evt = evts[evts.length - 1];
				let card = evt.card,
					num = 0,
					/** @type { Array<Player> } */
					targets = evt.targets;
				for (let target of targets) {
					let historys = target.getHistory("damage", evtx => evtx.card === card);
					if (historys.length > 0) num += historys.length;
				}
				return num;
			},
			filter(event, player) {
				let num = lib.skill.xueweimrfz.getSelect(player);
				return player.countCards("h") > 0 && player.hasUseTarget("huogong") && num > 0;
			},
			filterCard: true,
			lose: false,
			discard: false,
			filterTarget(card, player, target) {
				return player.canUse("huogong", target) === true;
			},
			selectTarget() {
				let player = get.player();
				let num = lib.skill.xueweimrfz.getSelect(player);
				return [1, num];
			},
			multitarget: true,
			multiline: true,
			check(card) {
				return 8 - get.value(card);
			},
			async content(event, trigger, player) {
				await player
					.chooseUseTarget({ name: "huogong", xueweimrfz: true }, event.cards, event.targets)
					//@ts-ignore
					.set("filterTarget", (card, player, target) => get.event().targetx.includes(target))
					.set("selectTarget", event.targets.length)
					.set("forced", true)
					.set("targetx", event.targets);
				//@ts-ignore
				if (!lib.skill.xueweimrfz.filter(trigger, player)) return;
				const result = await player
					.chooseCardTarget({
						prompt: `是否将一张手牌当【火攻】（目标数:${lib.skill.xueweimrfz.getSelect(player)}）使用？`,
						filterCard: true,
						filterTarget: lib.skill.xueweimrfz.filterTarget,
						selectTarget: lib.skill.xueweimrfz.selectTarget,
						ai1: card => 8 - get.value(card),
						ai2: target => {
							let player = get.player();
							return get.damageEffect(target, player, player, "ice");
						},
					})
					.forResult();
				if (result.bool !== true) return;
				//@ts-ignore
				await lib.skill.xueweimrfz.content(
					//@ts-ignore
					{
						...event,
						//@ts-ignore
						cards: result.cards,
						//@ts-ignore
						targets: result.targets,
					},
					trigger,
					player
				);
			},
			group: "xueweimrfz_ice",
			subSkill: {
				ice: {
					charlotte: true,
					silent: true,
					audio: false,
					trigger: { source: "damageBegin" },
					filter(event, player) {
						//@ts-ignore
						return event.card && event.card.xueweimrfz;
					},
					async content(event, trigger, player) {
						trigger.nature = "ice";
					},
				},
			},
			ai: {
				order: 1,
				result: {
					target(player, target) {
						let val = get.damageEffect(target, player, player, "ice");
						if (val > 0) return -val;
					},
				},
			},
		},
});

translate({
	"yelamrfz": "耶拉",
	"shengshimrfz": "圣侍",
	"shengshimrfz_info": "锁定技，牌堆顶4张牌对你可见。当你需要弃置牌时，你可用牌堆顶的4张牌代替。",
	"xueweimrfz": "雪威",
	"xueweimrfz_info": "出牌阶段限一次，你可以将一张手牌当作指定至多X名角色且造成冰属性伤害的【火攻】使用，然后你可以重复发动此技能。（X=本回合上次使用【火攻】造成的伤害数，若你本回合没有使用过【火攻】，则X为3）",
});

characterTitle("yelamrfz", "<font color = blue>谢拉格的守护神</font>");

characterIntro("yelamrfz", "谢拉格圣女，恩雅·希瓦艾什，也就是干员初雪的侍女长，作为圣女的代表加入罗德岛。<br>负责初雪秘密访问罗德岛的诸多对接事宜，除此之外，本人也十分享受干员生活，现作为术师干员活跃于各种任务中。");
