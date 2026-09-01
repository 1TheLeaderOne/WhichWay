import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("jianzhumrfz", {
				image: `ext:WhichWay/image/card/jianzhumrfz.jpg`,
				type: 'equip',
				subtype: 'equip1',
				destroy: true,
				derivation: 'laiousimrfz',
				distance: {
					attackFrom: -3,
				},
				skills: ["jianzhumrfz_skill"],
				ai: {
					basic: {
						equipValue: 8,
						value: (card, player, index, method) => {
							if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
							const info = get.info(card),
								current = player.getEquip(info.subtype),
								value = current && card != current && get.value(current, player);
							let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
							if (typeof equipValue == "function") {
								if (method == "raw") return equipValue(card, player);
								if (method == "raw2") return equipValue(card, player) - value;
								return Math.max(0.1, equipValue(card, player) - value);
							}
							if (typeof equipValue != "number") equipValue = 0;
							if (method == "raw") return equipValue;
							if (method == "raw2") return equipValue - value;
							return Math.max(0.1, equipValue - value);
						},
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						card.destroyed = true;
						game.log(card, '被销毁了');
					}
				},
				content: function () {
					if (
						!card?.cards.some(card => {
							return get.position(card, true) !== "o";
						})
					) {
						target.equip(card);
					}
				},
				toself: true,
});

cardSkill("jianzhumrfz_skill", {
				trigger: {
					player: ["yingbian","damageEnd"],
				},
				equipSkill: true,
				forced: true,
				firstDo: true,
				filter(event, player){
					if(event.name=='damage') return true;
					return player.hasHistory("lose", evt => {
						return evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.join(" ").includes("shimomrfz_"));
					})||get.is.yingbianConditional(event.card);
				},
				content: () => {
					if(trigger.name=='damage'){
						const equip = player.getCards('e', function (card) {
							return card.name == 'jianzhumrfz';
						});
						player.discard(equip);
						return;
					}
					trigger.forceYingbian = true;
				},
});

cardTranslate({
	jianzhumrfz:"剑助",
	jianzhumrfz_skill:"剑助",
	"jianzhumrfz_info":"锁定技，使用带有应变效果的牌可无视条件直接生效；当你受到伤害后或此牌离开了你的装备区时，你将【剑助】销毁之。",
});
