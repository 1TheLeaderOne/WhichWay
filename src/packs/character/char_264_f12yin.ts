import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_264_f12yin", { pack: "legendSJZX", sex: "male", group: "gemrfz", hp: 4, skills: ["zheshimrfz", "yubianmrfz"] });

skill({
	zheshimrfz: {
		audio: ["3星结束行动", "非3星结束行动"],
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h", card => get.tag(card, "damage")) > 0;
		},
		prompt(event, player) {
			return `【蛰势】:是否将手牌中所有带有伤害类标签的牌置入弃牌堆或牌堆顶并摸等量的牌？`;
		},
		async content(event, trigger, player) {
			let cards = player.getCards("h", card => get.tag(card, "damage"));
			if (!cards.length) return;
			const { moved } = await player
				.chooseToMove()
				.set("list", [["牌堆底", cards], ["弃牌堆"]])
				.set("processAI", list => {
					let player = _status.event.player,
						cards: Card[] = list[0][1],
						canUse = cards.filter(i => player.hasUseTarget(i)),
						bottom: Card[] = [],
						disPile: Card[] = [];
					let red = 0,
						black = 0;
					for (let i of canUse) {
						let color = get.color(i);
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
			let bottom = moved[0],
				disPile = moved[1];
			// console.log(moved);
			if (disPile.length) player.loseToDiscardpile({ cards: disPile });
			if (bottom.length) {
				game.log(player, "将", get.cnNumber(bottom.length), "置入了牌堆底");
				for (let i of bottom) ui.cardPile.appendChild(i);
				player.$throw(bottom.length, 1000);
			}
			await player.draw(cards.length);
			player.addTempSkill("zheshimrfz_direct",{global:"roundEnd"});
		},
		subSkill: {
			direct: {
				mark: true,
				intro: {
					content: "·本轮你于出牌阶段外使用的伤害类牌不可被其他角色响应",
				},
				audio: "zheshimrfz",
				charlotte: true,
				forced:true,
				trigger: {
					player: "useCard",
				},
				filter(event, player, name, target) {
					return event.card && get.is.damageCard(event.card) && !player.isPhaseUsing();
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players.filter(i => i !== player));
				},
			},
		},
	},
	yubianmrfz: {
		audio: ["行动开始", "作战中4"],
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
			// let cardx:Card[] = [],
			// 	color:string;
			// while (true) {
			// 	let card = get.bottomCards()[0];
			// 	player.$throw(card, null);
			// 	if (!player.hasUseTarget(card)) return;
			// 	const result = await player.chooseUseTarget(card, `【狱变】:请选择${get.translation(card)}的目标`).forResult();
			// 	if (!result || !result.cards) return;
			// 	let cards = result.cards;
			// 	for (let i of cards) cardx.push(i);
			// 	color = get.color(cards[0])!;
			// 	for (let i of cardx) {
			// 		if (get.color(i) != color) {
			// 			return;
			// 		}
			// 		color = get.color(i)!;
			// 	}
			// }
			const recordColor: Set<string> = new Set();
			while (true) {
				const card = get.bottomCards(1, true)[0] as Card;
				player.$throw(card, null);
				if (!player.hasUseTarget(card, undefined, false)) return;
				const result = await player
					.chooseUseTarget({
						card,
						forced: true,
						prompt: `【狱变】:请选择${get.translation(card)}的目标`,
					})
					.forResult();
				if (result.bool !== true) return;
				recordColor.add(get.color(card)!);
				// console.log(recordColor,recordColor.size);
				if(recordColor.size>1) return;
			}
		},
	},
});

translate({
	char_264_f12yin: "山",
	zheshimrfz: "蛰势",
	zheshimrfz_info: "出牌阶段开始时，你可以将手牌中所有带有伤害类标签的牌按照任意顺序置于牌堆底或弃牌堆，然后你摸等量的牌，且本轮你于出牌阶段外使用的伤害类牌不可被其他角色响应。",
	yubianmrfz: "狱变",
	yubianmrfz_info: "结束阶段，你可以使用牌堆底的牌（必须合法），若你因此的使用颜色均相同，你重复这个流程。",
});

characterIntro("char_264_f12yin", "山，哥伦比亚某建筑业龙头公司CEO之子，举家被竞争对手陷害而入狱，离开监狱后，加入罗德岛。</br>拥有几乎天生为战斗而生的体魄，现作为近卫干员活跃于各种任务的第一线。");

characterTitle("char_264_f12yin", "不动如山");
