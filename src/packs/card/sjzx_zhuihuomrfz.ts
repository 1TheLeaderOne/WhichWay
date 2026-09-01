import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("sjzx_zhuihuomrfz", {
				image: `ext:WhichWay/image/card/sjzx_zhuihuomrfz.jpg`,
				type: 'special_delay',
				allowDuplicate: true,
				blankCard: true,
				fullimage: true,
				wuxieable: false,
				/** @type {ContentFuncByAll} */
				async effect(event,trigger,player) {
					let result;
					var card = get.autoViewAs(event.cards[0]);
					card.storage.sjzx_zhuihuomrfz = true;
					if (player.countCards('he') > 1) result = await player.chooseToDiscard(2, 'he', '【坠火】:请选择弃置两张牌，选择取消则受到一点火焰伤害')
						.set('ai', function (card) {
							var player = _status.event.player;
							if (player.hp < 2 && player.countCards('hs', card => { return card.name == 'tao' || card.name == 'jiu' }) < 1) return -1;
							return 8 - get.value(card);
						}).forResult();
					else {
						player.damage('fire', 'nosource');
						player.loseToDiscardpile(event.cards[0]);
						event.finish();
					}
					if (result?.bool) {
						//game.log(player,'弃置了',result.cards);
						player.loseToDiscardpile(event.cards[0]);
					}
					else {
						player.damage('fire', 'nosource');
						player.loseToDiscardpile(event.cards[0]);
					}
				},
});

cardTranslate({
	sjzx_zhuihuomrfz: '天坠之火',
	'sjzx_zhuihuomrfz_info': '因【坠火】而置入判定区的牌可重复存在。判定阶段开始时，你须选择弃置两张牌或受到一点火焰伤害，然后将此牌置入弃牌堆。',
});
