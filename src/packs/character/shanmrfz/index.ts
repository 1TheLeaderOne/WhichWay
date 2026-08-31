import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("shanmrfz", {
			sex: "male",
			group: "gemrfz",
			hp: 4,
			skills: ["zhefumrfz","yubianmrfz"],
		});

skill({
	"zhefumrfz": {
			audio: "zhuangtimrfz",
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				return player.countCards("h", card => get.tag(card, "damage")) > 0;
			},
			prompt(event, player) {
				return `【蛰伏】:是否将手牌中所有带有伤害类标签的牌置入弃牌堆或牌堆顶并摸等量的牌？`;
			},
			async content(event, trigger, player) {
				let cards = player.getCards("h", card => get.tag(card, "damage"));
				if (!cards.length) return;
				const { moved } = await player
					.chooseToMove()
					.set("list", [["牌堆底", cards], ["弃牌堆"]])
					.set("processAI", list => {
						var player = _status.event.player,
							cards = list[0][1],
							canUse = cards.filter(i => player.hasUseTarget(i)),
							bottom = [],
							disPile = [];
						var red = 0,
							black = 0;
						for (var i of canUse) {
							var color = get.color(i);
							if (!color) continue;
							else if (color == "red") red += get.value(i);
							else black += get.value(i);
						}
						if (red > black) bottom = canUse.slice().filter(i => get.color(i) == "red");
						else bottom = canUse.slice().filter(i => get.color(i) == "black");
						bottom.sort(function (a, b) {
							return get.value(b, player) - get.value(a, player);
						});
						disPile = cards.slice().filter(i => !bottom.includes(i));
						return [bottom, disPile];
					})
					.forResult();
				if (!moved) return;
				var bottom = moved[0],
					disPile = moved[1];
				console.log(moved);
				if (disPile.length) player.loseToDiscardpile(disPile);
				if (bottom.length) {
					game.log(player, "将", get.cnNumber(bottom.length), "置入了牌堆底");
					for (var i of bottom) ui.cardPile.appendChild(i);
					player.$throw(bottom.length, 1000);
				}
				await player.draw(cards.length);
			},
		},
	"yubianmrfz": {
			audio: "julimrfz",
			trigger: { player: "phaseJieshuBegin" },
			prompt(event, player) {
				return `【狱变】:你可以使用牌堆顶的牌（目标必须合法），若你因此使用的牌颜色均相同，你重复这个流程`;
			},
			check(event, player) {
				return game.hasPlayer(current => {
					return current != player && !!player.canUse("sha", current) && get.attitude(player, current) < 0;
				});
			},
			async content(event, trigger, player) {
				let cardx = [],
					color;
				while (true) {
					var card = get.bottomCards()[0];
					player.$throw(card, null);
					if (!player.hasUseTarget(card)) return;
					const result = await player.chooseUseTarget(card, `【狱变】:请选择${get.translation(card)}的目标`).forResult();
					if (!result || !result.cards) return;
					var cards = result.cards;
					for (var i of cards) cardx.push(i);
					color = get.color(cards[0]);
					for (var i of cardx) {
						if (get.color(i) != color) {
							return;
						}
						color = get.color(i);
					}
				}
			},
		},
});

translate({
	"shanmrfz": "山",
	"zhefumrfz": "蛰伏",
	"zhefumrfz_info": "出牌阶段开始时，你可以将手牌中所有带有伤害类标签的牌按照任意顺序置于牌堆底或弃牌堆，然后你摸等量的牌。",
	"yubianmrfz": "狱变",
	"yubianmrfz_info": "结束阶段，你可以使用牌堆底的牌（必须合法），若你因此的使用颜色均相同，你重复这个流程。",
});

characterIntro("shanmrfz", "山，哥伦比亚某建筑业龙头公司CEO之子，举家被竞争对手陷害而入狱，离开监狱后，加入罗德岛。</br>拥有几乎天生为战斗而生的体魄，现作为近卫干员活跃于各种任务的第一线。");
