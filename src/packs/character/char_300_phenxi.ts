import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_300_phenxi", { pack: "legendSJZX", sex: "female", group: "lamrfz", hp: 4, skills: ["shunanmrfz", "shoumimrfz"] });

const is = (card: Card | VCard) => card.storage.shunanmrfz === true;

skill({
	shunanmrfz: {
		audio: ["问候", "作战中3"],
		// trigger: {},
		enable: "phaseUse",
		usable: 1,
		filter(event, player, name, target) {
			return player.countCards("he") > 0 && player.hasUseTarget("sha", false, false) && player.hp > 0;
		},
		filterCard: () => true,
		selectCard() {
			return [1, get.player().hp];
		},
		check(card: Card) {
			const player = get.player();
			const cards = ui.selected.cards;
			if (cards.length < 1) return 8 - get.value(card);
			if (cards.map(i => get.suit(i)).includes(get.suit(card))) {
				return 5 - get.value(card);
			}
			return 8 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		onremove: true,
		async content(event, trigger, player) {
			const cards = event.cards;
			const suits = cards.map(i => get.suit(i));
			//<br>1.♠：摸X张牌;<br>2.♣：造成伤害后回复一点体力;<br>3.♥：伤害基数+1;<br>4.♦：不可使用与此牌对应的实体牌中相同花色的牌响应此牌。
			// 			[
			//     "club",
			//     "spade",
			//     "diamond",
			//     "heart"
			// ]
			// if (suits.includes("spade")) {
			// 	await player.draw({ num: cards.length });
			// }
			if (suits.includes("club")) {
				player
					.when({
						source: "damageSource",
						player: "phaseUseEnd",
					})
					.filter((event, player) => {
						return event.name === "phaseUse" ? true : is(event.card);
					})
					.step(async (event, trigger, player) => {
						if (trigger.name === "phaseUse") return;
						player.recover();
					});
			}
			if (suits.includes("heart")) {
				player
					.when({
						player: ["phaseUseEnd", "useCard"],
					})
					.filter((event, player) => {
						return event.name === "phaseUse" ? true : is(event.card);
					})
					.step(async (event, trigger, player) => {
						if (trigger.name === "phaseUse") return;
						trigger.baseDamage ??= 1;
						trigger.baseDamage += 1;
					});
			}
			if (suits.includes("diamond")) {
				player
					.when({
						player: ["phaseUseEnd", "useCardAfter"],
					})
					.filter((event, player) => {
						return event.name === "phaseUse" ? true : is(event.card);
					})
					.step(async (event, trigger, player) => {})
					.assign({
						mod: {
							selectTarget(card:Card, player, range) {
								if (card.name == "sha" && is(card) && range[1] != -1) {
									range[1]++;
								}
							},
						},
					});
			}

			await player.chooseUseTarget({
				cards,
				card: get.autoViewAs({ name: "sha", storage: { shunanmrfz: true } }, cards),
				filterTarget(card, player, target) {
					return player.canUse("sha", target, false, false);
				},
				ai(target) {
					const player = get.player();
					return get.effect(target, "sha", player, player);
				},
				addCount: false,
				nodistance: true,
			});


			//结算后再摸牌
			if (suits.includes("spade")) {
				await player.draw({ num: cards.length });
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	shoumimrfz: {
		audio: ["部署1", "部署2"],
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		usable: 1,
		filter(event, player, name, target) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				let evt = event.getl(current);
				console.log(evt, evt.cards2);
				if (!evt || !evt.cards2 || evt.cards2.filterInD("d").length < 1) {
					return false;
				}
				return true;
			});
		},
		async content(event, trigger, player) {
			const targets: Player[] = [],
				cardsList: Card[][] = [],
				players = game.filterPlayer().sortBySeat(_status.currentPhase);
			for (const current of players) {
				if (current === player) {
					continue;
				}
				const cards: Card[] = [];
				const evt = trigger.getl(current);
				if (!evt || !evt.cards2) {
					continue;
				}
				const cardsx = evt.cards2.filterInD("d");
				cards.addArray(cardsx);
				if (cards.length) {
					targets.push(current);
					cardsList.push(cards);
				}
			}

			while (targets.length) {
				const target = targets.shift()!;
				const cards = cardsList.shift()!;
				const result = await player
					.chooseFakeCard({
						tagName: `${get.translation(target)}的牌`,
						cards,
						prompt: `你可以将任意张牌交给${get.translation(target)}，然后获得剩余的牌`,
						selectCard: [0, cards.length],
						ai(card) {
							if (get.attitude2(target) < 0) return -1;
							if (player.countCards("h") < player.hp) return -1;
							return get.rand(-5, 2);
						},
					})
					.forResult();
				if (result.links) {
					await target.gain({
						cards: result.links,
						animate: "gain2",
					});
					cards.removeArray(result.links);
				}
				await player.gain({
					cards,
					animate: "gain2",
				});
			}
		},
	},
});

translate({
	char_300_phenxi: "菲亚梅塔",
	shunanmrfz: "述难",
	shunanmrfz_info: "出牌阶段限一次，你可以将至多X张牌当【杀】对一名其他角色使用（无距离和次数限制），若此牌对应的实体牌中存在下列的花色：<br>1.♠：摸X张牌;<br>2.♣：造成伤害后回复一点体力;<br>3.♥：伤害基数+1;<br>4.♦：目标数+1。<br>(X=你的当前体力值)",
	shoumimrfz: "守密",
	shoumimrfz_info: "每回合限一次，当其他角色有牌因弃置而置入弃牌堆后，你可以将其中任意张牌交给该角色，然后你获得剩余的牌。",
});

characterIntro("char_300_phenxi", "菲亚梅塔，拉特兰公证所高级特派员，职务名经本人强烈要求，不予记录。现依据罗德岛与拉特兰教廷的合作协议，从罗德岛获得补给，并提供相关服务。</br>天启惩罚者？每个月还会更新？让我把这些玩意输进终端归档不如直接杀了我。");

characterTitle("char_300_phenxi", "苦难陈述者");
