import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("sjzx_zhuihuomrfz", {
	image: `ext:WhichWay/image/card/sjzx_zhuihuomrfz.jpg`,
	type: "special_delay",
	allowDuplicate: true,
	blankCard: true,
	fullimage: true,
	wuxieable: false,
	/** @type {ContentFuncByAll} */
	async effect(event, trigger, player) {
		let result;
		let card = get.autoViewAs(event.cards[0]);
		card.storage.sjzx_zhuihuomrfz = true;
		if (player.countCards("he") > 1)
			result = await player
				.chooseToDiscard({
					selectCard: [2, 2],
					position: "he",
					prompt: "【坠火】:请选择弃置两张牌，选择取消则受到一点火焰伤害",
				})
				.set("ai", function (card) {
					let player = _status.event.player;
					if (
						player.hp < 2 &&
						player.countCards("hs", card => {
							return card.name == "tao" || card.name == "jiu";
						}) < 1
					)
						return -1;
					return 8 - get.value(card);
				})
				.forResult();
		else {
			player
				.damage({
					nature: "fire",
				})
				.set("source", "nosource");
			player.loseToDiscardpile({
				cards: event.cards,
			});
			event.finish();
		}
		if (result?.bool) {
			//game.log(player,'弃置了',result.cards);
			player.loseToDiscardpile({ cards: event.cards });
		} else {
			player
				.damage({
					nature: "fire",
				})
				.set("source", "nosource");
			player.loseToDiscardpile({ cards: event.cards });
		}
	},
});

cardTranslate({
	sjzx_zhuihuomrfz: "天坠之火",
	sjzx_zhuihuomrfz_info: "因【坠火】而置入判定区的牌可重复存在。判定阶段开始时，你须选择弃置两张牌或受到一点火焰伤害，然后将此牌置入弃牌堆。",
});
