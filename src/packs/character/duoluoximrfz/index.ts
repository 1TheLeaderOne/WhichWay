import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("duoluoximrfz", { pack: "legendSJZX",
			sex: "female",
			group: "lymrfz",
			hp: 3,
			skills: ["newgongzhenmrfz","newmengxiangmrfz"],
		});

skill({
	"newgongzhenmrfz": {
			mod: {
				aiOrder: function (player, card, num) {
					if (typeof card == "object" && player.isPhaseUsing()) {
						var history = player.getAllHistory("useCard");
						if (history.length < 1) return num;
						var cardx = history[history.length - 1].card;
						if (cardx && get.type2(cardx) == get.type2(card)) {
							return num + 10;
						}
					}
				},
			},
			audio: "gongzhenmrfz",
			trigger: { player: ["useCardEnd", "respondEnd"] },
			forced: true,
			filter(event, player) {
				//@ts-ignore
				return player.getAllHistory(event.name).length > 1;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				var history = player.getAllHistory(trigger.name);
				var cardx = history[history.length - 2].card;
				if (!cardx) return;
				if (get.type2(cardx) == get.type2(trigger.card)) {
					var cards = get.cards(2);
					game.cardsGotoOrdering(cards);
					const { links } = await player
						.chooseCardButton(`【共振】:请选择获得一张牌`, true, cards)
						.set("ai", button => {
							return get.value(button);
						})
						.forResult();
					if (!links) return;
					player.gain(links, "gain2");
				} else
					player.chooseToDiscard(true, `【共振】:请弃置区域内的一张牌`, "hej").set("ai", card => {
						if (get.position(card) == "j") return 10;
						return -get.value(card);
					});
			},
		},
	"newmengxiangmrfz": {
			getLastDiscard(event, player) {
				var history = player.getAllHistory("lose", evt => evt.type && evt.type == "discard");
				if (history.length < 1) return false;
				var cards = history[history.length - 1].cards;
				if (!cards) return false;
				return cards[cards.length - 1];
			},
			mod: {
				cardUsable: function (card, player) {
					var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player);
					if (cardx && get.type2(cardx) == get.type2(card)) return Infinity;
				},
				targetInRange: function (card, player) {
					var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player);
					if (cardx && get.type2(cardx) == get.type2(card)) return true;
				},
			},
			audio: "mengxiangmrfz",
			forced: true,
			trigger: { player: "useCardBefore" },
			filter(event, player) {
				var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player);
				if (!cardx) return false;
				return !event.audioed && get.type2(cardx) == get.type2(event.card);
			},
			async content(event, trigger, player) {
				trigger.audioed = true;
			},
		},
});

translate({
	"duoluoximrfz": "多萝西",
	"newgongzhenmrfz": "共振",
	"newgongzhenmrfz_info": "锁定技，当你使用或打出一张牌后，若此牌与上一张牌的类型相同，你观看牌堆顶两张牌并选择获得一张牌，然后将剩余的牌置入弃牌堆，反之你弃置你区域内的一张牌。",
	"newmengxiangmrfz": "梦想",
	"newmengxiangmrfz_info": "锁定技，你使用与上一次你因弃置而失去的手牌的手牌类型相同的牌无次数和距离限制。",
});

characterTitle("duoluoximrfz", "<font color=#13a022>绿野幻梦</font>");

characterIntro("duoluoximrfz", "多萝西，莱茵生命源石技艺应用科主任，在罗德岛选择使用自己的本名作为代号。</br>多萝西·弗兰克斯小姐以“莱茵生命与罗德岛的合作项目负责人”这一身份加入我们，将会在许多研究项目上为罗德岛提供帮助。身为源石技艺应用科的主任，她对源石技艺本身的理解毋庸置疑，而在源石技艺的应用上更是炉火纯青。");
