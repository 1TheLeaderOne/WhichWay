import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("mingjiaomrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["suozemrfz","youyimrfz"],
		});

skill({
	"suozemrfz": {
			mark: true,
			intro: {
				content(event, player) {
					return `记录的牌名：${player.storage.suozemrfz.length > 0 ? get.translation(player.storage.suozemrfz) : "无"}`;
				},
			},
			audio: 2,
			init(player, skill) {
				player.storage[skill] = [];
			},
			trigger: {
				player: ["useCardEnd", "respondEnd"],
			},
			filter(event, player) {
				if (event.cards.length < 1) return false;
				return !player.storage.suozemrfz.includes(event.card.name) && (get.type2(event.card) == "basic" || get.type(event.card) == "trick");
			},
			prompt2(event, player) {
				return `是否记录${get.translation(event.card)}，然后观看牌堆顶${player.maxHp}张牌，并用等量手牌交换其中至多${player.storage.suozemrfz.length + 1}张牌？`;
			},
			async content(event, trigger, player) {
				player.storage.suozemrfz.add(trigger.card.name);
				game.log(player, `的`, `#g【索赜】`, `记录了`, trigger.card.name);
				var cards = get.cards(player.maxHp);
				let cardsc = cards.slice(0);
				const { moved } = await player
					.chooseToMove(`【索赜】:请选择你要交换的牌（至多交换${player.storage.suozemrfz.length}张牌）`)
					.set("filterMove", (from, to) => {
						return typeof to !== "number";
					})
					.set("list", [
						["牌堆顶", cardsc],
						["你的手牌", player.getCards("h")],
					])
					.set("filterOk", moved => {
						let h = get.event().cardsh;
						return h.filter(i => moved[0].includes(i)).length <= get.event().num;
					})
					.set("processAI", list => {
						var player = get.event().player;
						let cards1 = list[0][1].slice(),
							cards2 = player.getCards("h");

						if (cards2.length === 0) {
							return [cards1, []];
						}

						let maxC = Math.max(...cards1.map(i => get.value(i)));
						let minH = Math.min(...cards2.map(i => get.value(i)));

						let count = 0,
							num = get.event().num;

						while (minH < maxC && count < num) {
							count++;

							let maxCIndex = cards1.map(i => get.value(i)).indexOf(maxC);

							let minHIndex = cards2.map(i => get.value(i)).indexOf(minH);

							[cards1[maxCIndex], cards2[minHIndex]] = [cards2[minHIndex], cards1[maxCIndex]];

							maxC = Math.max(...cards1.map(i => get.value(i)));
							minH = Math.min(...cards2.map(i => get.value(i)));
						}
						return [cards1, cards2];
					})
					.set("num", player.storage.suozemrfz.length)
					.set("cardsh", player.getCards("h"))
					.forResult();
				const puts = player.getCards("h", i => moved[0].includes(i));
				const gains = cardsc.filter(i => moved[1].includes(i));
				if (puts.length && gains.length) {
					player.$throw(puts.length, 1000);
					await player.lose(puts, ui.special);
					await player.gain(gains, "giveAuto");
				}
				cardsc = moved[0].slice();
				if (cardsc.length) {
					await game.cardsGotoOrdering(cardsc);
					for (let i = cardsc.length - 1; i >= 0; i--) {
						ui.cardPile.insertBefore(cardsc[i], ui.cardPile.firstChild);
					}
					game.log(get.cnNumber(cardsc.length, true), "张牌被放回了牌堆顶");
					game.updateRoundNumber();
				}
			},
		},
	"youyimrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return player.storage.suozemrfz.length > 0;
			},
			async content(event, trigger, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (!player.storage.suozemrfz.includes(name)) continue;
					if (get.type(name) == "basic") list.push(["基本", "", name]);
					else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
				}
				let { links } = await player
					.chooseButton([`游移:请移除${Math.ceil(list.length / 2)}张牌`, [list, "vcard"]], true)
					.set("selectButton", Math.ceil(list.length / 2))
					.set("ai", button => {
						return _status.event.player.getUseValue(button.link, null, true);
					})
					.forResult();
				if (!links) return;
				player.storage.suozemrfz.removeArray(links.map(i => i[2]));
				let names = links.filter(i => player.hasUseTarget(i[2])).map(i => [get.translation(get.type(i[2])), "", i[2]]);
				if (names.length < 1) return;

				let { links2 } =
					names.length == 1
						? { links2: names }
						: await player
								.chooseButton(["游移:请选择一张你要使用的牌", [names, "vcard"]], true)
								.set("ai", button => {
									return _status.event.player.getUseValue({ name: button.link[2] }, undefined, true);
								})
								.forResult();
				if (!links2) return;
				player.chooseUseTarget({ name: links2[0][2] }, true);
			},
		},
});

translate({
	"mingjiaomrfz": "明椒",
	"suozemrfz": "索赜",
	"suozemrfz_info": "当你使用或打出一张基本或普通锦囊牌后，若此牌有对应的实体牌，你可以记录此牌名（不可重复记录），然后观看牌堆顶X张牌，并用等量手牌交换其中至多Y张牌。（X =你的体力上限，Y =此技能记录的牌数）",
	"youyimrfz": "游移",
	"youyimrfz_info": "锁定技，结束阶段，你选择移除‘索赜’中一半（向上取整）被记录的牌的名字，然后你视为使用被移除牌中的一张牌。",
});

characterTitle("mingjiaomrfz", "<font color=#DC143C>蹒跚求索</font>");

characterIntro("mingjiaomrfz", "明椒，萨卡兹雇佣兵中的一员，自哥伦比亚被曼弗雷德召集至伦蒂尼姆，后因理念不合而带小队脱离原本阵营，受袭途中被搭救。<br>现接受罗德岛雇佣，为作战小队提供战场医疗支援。");
