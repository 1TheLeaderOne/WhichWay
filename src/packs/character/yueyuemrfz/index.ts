import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yueyuemrfz", { pack: "rareSJZX",
			sex: "female",
			group: "bomrfz",
			hp: 4,
			skills: ["xiyumrfz"],
		});

skill({
	"xiyumrfz": {
			onremove: true,
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			// @ts-ignore
			// @ts-ignore
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			filterCard: true,
			// @ts-ignore
			// @ts-ignore
			filterTarget: function (card, player, target) {
				return target != player;
			},
			check: card => {
				var ban = ["shan", "tao", "jiu"];
				for (var i of ban) {
					if (card.name == i) return false;
				}
				return 8 - get.value(card);
			},
			discard: false,
			lose: false,
			delay: false,
			async content(event, trigger, player) {
				const { cards, target } = event;
				for (var i of cards) {
					i.storage.xiyumrfz_give = true;
				}
				
				await player.give(cards, target);

				if (player.canUse("sha", target, false)) {
					player.storage.xiyumrfz = target;
					target.addTempSkill("xiyumrfz_suit", { global: "phaseUseEnd" });
					player.addTempSkill("xiyumrfz_gain", "phaseUseEnd");
					player.useCard({ name: "sha", storage: { xiyumrfz: true } }, target).set("addCount", false);
				}
			},
			subSkill: {
				gain: {
					charlotte: true,
					forced: true,
					trigger: { player: "useCardAfter" },
					// @ts-ignore
					// @ts-ignore
					filter: function (event, player) {
						return event.card && event.card.storage.xiyumrfz == true;
					},
					async content(event, trigger, player) {
						var target = player.storage.xiyumrfz,
							cards = target.getCards("he"),
							suit = target.getCards("he", card => {
								return card.storage.xiyumrfz_give;
							});

						event.cards = [];
						var storage = target.storage.xiyumrfz_suit;
						for (var i of suit) {
							if (!storage.includes(i.suit)) storage.add(i.suit);
						}
						for (var i of cards) {
							if (storage.includes(i.suit)) event.cards.push(i);
						}

						if (event.cards.length) player.gain(event.cards, "gain2");

						player.removeSkill("xiyumrfz_gain");

						player.removeSkill("xiyumrfz_suit");
					},
				},
				suit: {
					audio: false,
					charlotte: true,
					silent: true,
					lastDo: true,
					onremove: player => {
						delete player.storage.xiyumrfz_suit;
					},
					init: player => {
						player.storage.xiyumrfz_suit = [];
					},
					trigger: { player: ["useCard", "respond"] },
					filter: function (event, player) {
						if (event.card.suit == undefined) return false;
						return lib.suit.includes(event.card.suit) && (!player.storage.xiyumrfz_suit || !player.storage.xiyumrfz_suit.includes(event.card.suit));
					},
					content: function () {
						// @ts-ignore
						if (!player.storage.xiyumrfz_suit) player.storage.xiyumrfz_suit = [];
						// @ts-ignore
						player.storage.xiyumrfz_suit.add(trigger.card.suit);
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},
});

translate({
	"yueyuemrfz": "跃跃",
	"xiyumrfz": "嬉娱",
	"xiyumrfz_info": "出牌阶段限一次，你可以将一张手牌交给一名其他角色，然后你对其视为使用一张【杀】（不计入次数限制），于此杀结算完毕后，你获得其手牌中与你交给其的牌花色相同的牌和与此杀结算过程中其使用或打出过的牌花色相同的牌。",
});

characterIntro("yueyuemrfz", "跃跃，本名卡莉·兰德，活跃于玻利瓦尔境内冲突频发的地区，承接各方势力的短期雇佣，暗中给敌对势力制造混乱。</br>为寻求新工作主动接触了当地的罗德岛办事处，对外勤干员的工作表现出浓厚兴趣，双方彼此了解后签订了合作协议。");
