import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("spyinhuimrfz", {
			sex: "male",
			hp: 4,
			skills: ["kuangshimrfz", "muzhimrfz"],
			group: "xiemrfz",
		});

skill({
	"kuangshimrfz": {
			audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
			enable: "phaseUse",
			filter(event, player) {
				return player.countCards("he") > 0 && player.getHandcardLimit() > 0;
			},
			filterCard: true,
			filterTarget(card, player, target) {
				return player.canUse("juedou", target) === true;
			},
			mark: true,
			intro: {
				content(storage, player) {
					return `·本回合手牌上限-${storage ? storage : "0"}<br>·【诓势】已使用的颜色:${!player?.storage?.kuangshimrfz_used ? "无" : get.translation(player.storage.kuangshimrfz_used)}`;
				},
			},
			multitarget: true,
			multiline: true,
			discard: false,
			lose: false,
			delay: false,
			prompt() {
				let player = get.player();
				let storage = player?.storage?.kuangshimrfz_used || [];
				return whichWayUtil.colorize(`请将一张手牌当【决斗】使用${storage.length > 0 ? `<br>选择#r${get.translation(storage)}#的牌会令#r手牌上限-1#` : ""}`);
			},
			check(card) {
				//开摆，这ai写不了一点
				return 8 - get.value(card);
			},
			async content(event, trigger, player) {
				const { cards, targets } = event;
				if (!Array.isArray(player.storage.kuangshimrfz_used)) {
					player.storage.kuangshimrfz_used = [];
				}
				let used = player.storage.kuangshimrfz_used;
				if (used.some(i => cards.map(j => get.color(j)).includes(i))) {
					player.addMark("kuangshimrfz", 1, false);
				} else player.storage.kuangshimrfz_used.addArray(cards.map(j => get.color(j)));
				await player
					.chooseUseTarget({ name: "juedou" }, cards, targets)
					.set("forced", true)
					//@ts-ignore
					.set("filterTarget", (card, player, target) => get.event().targetsx.includes(target))
					.set("selectTarget", targets.length)
					.set("targetsx", targets);

				let list = ["摸两张牌", "失去一点体力", "将手牌调整至手牌上限并结束出牌阶段"];

				const { links } = await player
					.chooseButton()
					.set("createDialog", ["【诓势】:请选择一项", [[[0, list[0]]], "tdnodes"], [[[1, list[1]]], "tdnodes"], [[[2, list[2]]], "tdnodes"]])
					.set("forced", true)
					.set("filterButton", button => {
						let index = button.link;
						//@ts-ignore
						return get.event().indexCheck(index);
					})
					.set("ai", button => {
						let index = button.link;
						//@ts-ignore
						if (!get.event().indexCheck(index)) return -114514;
						return index === 0 ? 114514 : Math.random();
					})
					.set("indexCheck", check)
					.forResult();
				if (!links) return;
				switch (links[0]) {
					case 0:
						player.draw(2);
						break;
					case 1:
						player.loseHp();
						break;
					case 2: {
						const num = player.countCards("h") - player.getHandcardLimit();
						if (num === 0) {
							//
						} else if (num > 0) await player.chooseToDiscard("h", num, true, `请弃置${get.cnNumber(num)}张牌`);
						else await player.draw(Math.abs(num));
						let evt = event.getParent("phaseUse");
						if (evt) {
							//@ts-ignore
							evt.skipped = true;
							game.log(player, "跳过了出牌阶段");
						} else player.chat("由于你的插入结算过多，你可以不用跳过出牌阶段了");
						break;
					}
				}

				function check(index) {
					switch (index) {
						case 0:
							if (player.countCards("h") + 2 === player.getHandcardLimit()) return true;
							break;
						case 1:
							if (player.countCards("h") + 1 === player.getHandcardLimit()) return true;
							break;
						case 2:
							return true;
					}
					return false;
				}
			},
			group: ["kuangshimrfz_clear"],
			subSkill: {
				used: {
					charlotte: true,
					silent: true,
					onremove(player) {
						player.storage.kuangshimrfz_used = [];
					},
				},
				clear: {
					mod: {
						maxHandcard(player, num) {
							return (num -= player.countMark("kuangshimrfz"));
						},
					},
					audio: false,
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter(event, player) {
						return player.countMark("kuangshimrfz") > 0 || player.getStorage("kuangshimrfz_used").length > 0;
					},
					async content(event, trigger, player) {
						player.storage.kuangshimrfz_used = [];
						player.removeMark("kuangshimrfz", player.countMark("kuangshimrfz"), false);
					},
				},
			},
			ai: {
				order: 1,
				result: {
					target(player, target) {
						return get.effect(target, { name: "juedou" }, player, player) > 0 ? -1 : 0;
					},
				},
			},
		},
	"muzhimrfz": {
			mod: {
				aiOrder(player, card, num) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return num + 1;
				},
				aiValue(player, card, num) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return num - 10;
				},
				cardUsable(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
				cardEnabled(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
				cardEnabled2(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
				cardSavable(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
			},
			includeDiscard(name) {
				return (
					Array.from(ui.discardPile.children)
						//@ts-ignore
						.map(i => i.name)
						.includes(name)
				);
			},
			audio: ["部署1", "部署2"],
			init(player, skill) {
				lib.translate["muzhimrfz_pile"] = "牌堆底";

				let recordCount;
				const observer = new MutationObserver(() => {
					if (player.isDead()) {
						//@ts-ignore
						lib.skill.muzhimrfz.onremove(player, skill);
						return;
					}

					let currentCount = ui.cardPile.childNodes.length;
					if (currentCount !== recordCount) {
						recordCount = currentCount;

						let pileCards = player.getCards("s", card => card.hasGaintag("muzhimrfz_pile"));

						let bottoms = get.bottomCards(4, true);

						//@ts-ignore
						if (bottoms.every(card => pileCards.map(i => i._cardid).includes(card.cardid))) return;

						pileCards.forEach(card => card.delete());

						let cards = get.bottomCards(4, true);
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
							//@ts-ignore
							card.addPromptSJZX(`第${i + 1}张`);
						}
						player.directgains(copy_cards, null, "muzhimrfz_pile");
					}
				});

				observer.observe(ui.cardPile, {
					childList: true,
					subtree: false,
				});

				if (!player.playerid) return;

				tmpSave[player.playerid] ??= {};
				tmpSave[player.playerid]["observer_muzhimrfz"] = observer;
			},
			onremove(player, skill) {
				player.getCards("s", card => card.hasGaintag("muzhimrfz_pile")).forEach(i => i.delete());

				if (!player.playerid) return;

				tmpSave[player.playerid]["observer_muzhimrfz"].disconnect();
				tmpSave[player.playerid]["observer_muzhimrfz"].takeRecords();
				tmpSave[player.playerid]["observer_muzhimrfz"] = null;
			},
			trigger: {
				player: ["useCardBefore", "respondBefore"],
			},
			filter(event, player) {
				//@ts-ignore
				let cards = player.getCards("s", card => card.hasGaintag("muzhimrfz_pile") && card._cardid);
				return (
					event.cards &&
					event.cards.some(card => {
						return cards.includes(card);
					})
				);
			},
			forced: true,
			async content(event, trigger, player) {
				//@ts-ignore
				let cardsid = get.bottomCards(4, true).map(i => i.cardid);

				trigger.cards = trigger.cards.map(card => {
					//@ts-ignore
					if (!cardsid.includes(card._cardid)) return card;
					//@ts-ignore
					return get.bottomCards(4, true).find(cardx => cardx.cardid === card._cardid);
				});
				//@ts-ignore
				trigger.card.cards = trigger.card.cards.map(card => {
					if (!cardsid.includes(card._cardid)) return card;
					//@ts-ignore
					return get.bottomCards(4, true).find(cardx => cardx.cardid === card._cardid);
				});
			},
		},
});

translate({
	"spyinhuimrfz": "凛御银灰",
	"spyinhuimrfz_prefix": "凛御",
	"kuangshimrfz": "诓势",
	"kuangshimrfz_info": "出牌阶段,你可以将一张手牌当作【决斗】使用，若你使用了本回合因此使用过的颜色的牌，本回合手牌上限-1，然后当此牌结算完毕后，你执行能让你的手牌等于手牌上限的选项:<br>1.摸两张牌;<br>2.失去一点体力;<br>3.将手牌调整至手牌上限并结束出牌阶段。",
	"muzhimrfz": "幕治",
	"muzhimrfz_info": "锁定技，牌堆底4张牌始终对你可见。你可以如手牌般使用或打出牌堆底4张牌中弃牌堆中有的牌名。",
});

characterTitle("spyinhuimrfz", "<font color = blue>变革已致</font>");

characterIntro("spyinhuimrfz", "恩希欧迪斯，喀兰贸易公司前董事长，希瓦艾什家族现任族长。在经济贸易、国际政治、外交手腕与战术策划上有独到见解。<br>鉴于其身份的极端特殊性以及谢拉格如今复杂的局势，建议谨慎选择与其合作的姿态以杜绝额外风险。");
