import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";

character("char_4202_haruka", { pack: "legendSJZX", sex: "female", group: "dongmrfz", hp: 3, skills: ["huanmengmrfz", "fuyingmrfz", "huanmiemrfz"] });

skill({
	huanmengmrfz: {
		audio:["作战中1","作战中2"],
		forced: true,
		marktext: "泡",
		intro: {
			name: "泡",
			markcount: "expansion",
			content: "expansion",
		},
		trigger: { global: ["roundStart", "roundEnd"] },
		filter(event, player, name) {
			if (name == "roundStart") return true;
			return game.hasPlayer(current => current.hasExpansions("huanmengmrfz"));
		},
		async content(event, trigger, player) {
			// ① 每轮开始时：展示牌堆顶三张牌，反复分配“泡”直到本轮展示的这三张牌全部分完
			if (event.triggername == "roundStart") {
				const cards = get.cards(3, true);
				if (!cards.length) return;
				await player.showCards(cards, "幻梦：展示牌堆顶的三张牌");
				await game.cardsGotoOrdering(cards);
				const remain = cards.slice(0);
				while (remain.length) {
					const result = await player
						.chooseButtonTarget({
							createDialog: ["幻梦：请选择要分配的“泡”牌，再选择获得“泡”的角色", remain.slice(0)],
							forced: true,
							allowChooseAll: true,
							selectButton: [1, Infinity],
							filterTarget: () => true,
							ai1: () => 1 + Math.random(),
							//“泡”是纯粹的正面效果（额外的摸牌、手牌上限与【杀】次数），AI 优先分配给友方
							ai2(target) {
								const player = get.player();
								return get.attitude(player, target);
							},
						})
						.forResult();
					if (!result?.bool || !result.targets?.length || !result.links?.length) {
						//无法继续分配时，尚未分配的牌直接置入弃牌堆，避免滞留在处理区
						if (remain.length) await game.cardsDiscard(remain.slice(0));
						break;
					}
					const links = result.links.slice(0);
					remain.removeArray(links);
					const target = result.targets[0];
					player.line(target);
					await target.addToExpansion({ cards: links.reverse(), source: player, animate: "give", gaintag: ["huanmengmrfz"] });
				}
				return;
			}
			// ② 每轮结束时：所有“泡”置入弃牌堆，然后强制选择一名角色与一项效果
			for (const owner of game.filterPlayer(current => current.hasExpansions("huanmengmrfz"))) {
				const cards = owner.getExpansions("huanmengmrfz");
				if (cards.length) await owner.loseToDiscardpile({ cards });
				if (!owner.hasExpansions("huanmengmrfz")) owner.unmarkSkill("huanmengmrfz");
			}
			const heal = "令其回复一点体力";
			const remove = "令其移除一个“幻”";
			// AI 取舍：残血友方回血 > 友方“幻”最多者移除“幻” > 有损友方中体力最低者回血 > 自己回血（绝不给敌方回血）
			const pick = () => {
				const friends = game.filterPlayer(current => current != player && get.attitude(player, current) > 2);
				const weak = friends.find(current => current.hp < 2);
				if (weak) return { target: weak, control: heal };
				const marked = friends
					.filter(current => current.countMark("huanmiemrfz") > 0)
					.sort((a, b) => b.countMark("huanmiemrfz") - a.countMark("huanmiemrfz"))[0];
				if (marked) return { target: marked, control: remove };
				const damaged = friends.filter(current => current.isDamaged()).sort((a, b) => a.hp - b.hp)[0];
				if (damaged) return { target: damaged, control: heal };
				return { target: player, control: heal };
			};
			const result = await player
				.chooseTargetControl({
					prompt: "幻梦：请选择一名角色，然后选择一项效果",
					prompt2: "令该角色回复一点体力，或令该角色移除一个“幻”（满体力的角色也可以被选择，但回复体力没有效果）",
					selectTarget: 1,
					filterTarget: () => true,
					controls: [heal, remove],
					ai(target) {
						return pick().target == target ? 10 : -1;
					},
					controlAi() {
						const choice = pick();
						const target = ui.selected.targets[0];
						if (!target) return choice.control;
						if (target == choice.target) return choice.control;
						if (target.countMark("huanmiemrfz") > 0) return remove;
						return heal;
					},
				})
				.forResult();
			if (!result?.bool || !result.targets?.length) return;
			const target = result.targets[0];
			player.line(target);
			if (result.control == remove) {
				if (target.countMark("huanmiemrfz") > 0) target.removeMark("huanmiemrfz", 1);
			} else {
				await target.recover(1);
			}
		},
		onremove(player, skill) {
			for (const owner of game.filterPlayer(current => current.hasExpansions(skill))) {
				const cards = owner.getExpansions(skill);
				if (cards.length) owner.loseToDiscardpile({ cards });
			}
		},
	},

	fuyingmrfz: {
		audio:["作战中3","作战中4"],
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.hasExpansions("huanmengmrfz");
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const cards = target.getExpansions("huanmengmrfz");
			if (!cards.length) return;
			await target.gain({ cards, animate: "gain2" });
			target.addMark("huanmiemrfz", cards.length);
			await target.draw(2);
			if (!target.hasExpansions("huanmengmrfz")) target.unmarkSkill("huanmengmrfz");
		},
	},

	huanmiemrfz: {
		audio:["选中干员2","选中干员1"],
		forced: true,
		silent:true,
		marktext: "幻",
		intro: {
			name: "幻",
			content: "mark",
		},
		init(player, skill) {
			game.addGlobalSkill("huanmiemrfz_global");
		},
		onremove(player, skill) {
			if (!game.hasPlayer(current => current.hasSkill(skill, null, null, false), true)) game.removeGlobalSkill("huanmiemrfz_global");
		},
		trigger: { global: ["addMark", "phaseDrawBegin2"] },
		filter(event, player, name) {
			if (name == "addMark") return event.markName == "huanmiemrfz" && event.player.countMark("huanmiemrfz") >= event.player.maxHp;
			return !event.numFixed && event.player.hasExpansions("huanmengmrfz");
		},
		async content(event, trigger, player) {
			// 额定摸牌数 +1（有“泡”的角色）
			if (event.triggername != "addMark") {
				trigger.num++;
				return;
			}
			// “幻”达到体力上限：移除所有“幻”，然后失去所有体力
			const target = trigger.player;
			player.line(target);
			player.logSkill("huanmiemrfz", target);
			target.removeMark("huanmiemrfz", target.countMark("huanmiemrfz"));
			if (target.hp > 0) await target.loseHp(target.hp);
		},
	},

	// 常驻全局子技能：为所有有“泡”的角色提供手牌上限与【杀】使用次数 +1
	huanmiemrfz_global: {
		mod: {
			maxHandcard(player, num) {
				if (player.hasExpansions("huanmengmrfz")) return num + 1;
			},
			cardUsable(card, player, num) {
				if (card.name == "sha" && player.hasExpansions("huanmengmrfz")) return num + 1;
			},
		},
	},
});

translate({
	char_4202_haruka:"紫野遥",

	huanmengmrfz:"幻梦",
	huanmengmrfz_info:
		"锁定技，<br>①每轮开始时，你展示牌堆顶三张牌，然后可以将其中任意张牌置于任意名角色的武将牌上，称之为“泡”；未被分配的牌继续分配，直到这三张牌全部分完;<br>②每轮结束时，若场上有“泡”，你将所有的“泡”置入弃牌堆，然后选择一名角色，令其回复一点体力或移除一个“幻”。",

	fuyingmrfz:"浮影",
	fuyingmrfz_info:"当一名角色受到伤害后，若其有“泡”，你可以令其获得其武将牌上所有的“泡”并获得等量的“幻”，然后其摸两张牌。",

	huanmiemrfz:"幻灭",
	huanmiemrfz_info:"锁定技，有“泡”的角色额定摸牌数、手牌上限和使用【杀】的次数+1;当任意角色“幻”的数量达到或超过其体力上限时，其移除所有的“幻”，然后失去所有体力。",
})

characterTitle("char_4202_haruka", "<font color = red>浮生若梦</font>");

characterIntro("char_4202_haruka", "紫野遥，在东国南院有相当名气的艺人。艺名羽生萌萌香。受干员星熊推荐，与罗德岛签订合约，负责罗德岛与东国的交流工作。鉴于本人的要求，也会参与一部分外勤任务。");

dynamicTranslate("youlinmrfz", function (player) {
	let cnNum = player.hasSkill("youlinmrfz_addCount") ? "两" : "一";
	return `出牌阶段限${cnNum}次，你可以展示M张手牌并展示N张牌堆顶的牌（M+N=3），选择至多三名角色，然后根据你展示的牌这些角色执行对应的选项并获得X-M个“沫”标记：<br>1.点数均不同：获得一点护甲;<br>2.花色均不同：摸X张牌;<br>3.类型均不同：本技能本阶段改成“出牌阶段限两次”。（X=执行的选项数）`;
});

// skill({
// 	youlinmrfz: {
// 		audio: ["作战中1","作战中2"],
// 		enable: "phaseUse",
// 		usable(skill, player) {
// 			return player.hasSkill("youlinmrfz_addCount") ? 2 : 1;
// 		},
// 		filterCard: true,
// 		selectCard: [0, 3],
// 		filterTarget: true,
// 		selectTarget: [1, 3],
// 		discard: false,
// 		lose: false,
// 		delay: 0,
// 		multitarget: true,
// 		multiline: true,
// 		check(card) {
// 			if (ui.selected.cards.length < 1) return true;
// 			let num = 0;
// 			for (let i of ["type2", "number", "suit"]) {
// 				if (!isInclude(i)) {
// 					num++;
// 				}
// 			}
// 			return num;

// 			function isInclude(method) {
// 				return ui.selected.cards.map(cardx => get[method](cardx)).includes(get[method](card));
// 			}
// 		},
// 		async content(event, trigger, player) {
// 			let { cards, targets } = event,
// 				pileCards = [],
// 				showCards = [];
// 			let duplicateRemove = (arr, method) => Array.from(new Set(arr.map(card => get[method](card))));
// 			//@ts-ignore
// 			if (cards.length < 3) pileCards.push(...get.cards(3 - cards.length));
// 			showCards = [...cards, ...pileCards];
// 			let execute = [];
// 			if (duplicateRemove(showCards, "number").length === 3) execute.push("number");
// 			if (duplicateRemove(showCards, "suit").length === 3) execute.push("suit");
// 			if (duplicateRemove(showCards, "type2").length === 3) execute.push("type");
// 			let num = execute.length;
// 			let tips = {
// 				number: "<font color='red'>点数均不同</font>",
// 				suit: "<font color='yellow'>花色均不同</font>",
// 				type: "<font color='green'>类型均不同</font>",
// 			};
// 			let str = [];
// 			for (let i of execute) {
// 				str.push(tips[i]);
// 			}
// 			await player.showCards(showCards, `${get.translation(player)}【游鳞】展示的牌<br>${str.join("<br>")}`);
// 			game.delay(2);
// 			if (num > 0) {
// 				for (let name of execute) {
// 					switch (name) {
// 						case "number":
// 							targets.forEach(t => t.changeHujia());
// 							break;
// 						case "suit":
// 							targets.forEach(t => t.draw(num));
// 							break;
// 						case "type":
// 							player.addTempSkill("youlinmrfz_addCount", { player: ["phaseUseEnd", "phaseEnd"] });
// 							break;
// 					}
// 				}
// 			}
// 			if (num - cards.length > 0) targets.forEach(t => t.addMark("fuyingmrfz", num - cards.length));
// 		},
// 		ai: {
// 			order: 13,
// 			result: {
// 				player: 1,
// 				target: 1,
// 			},
// 		},
// 		subSkill: {
// 			addCount: {
// 				charlotte: true,
// 				silent: true,
// 			},
// 		},
// 	},
// 	miaomengmrfz: {
// 		audio: ["部署1","部署2"],
// 		trigger: {
// 			player: "phaseZhunbeiBegin",
// 		},
// 		prompt(event, player) {
// 			//@ts-ignore
// 			let num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
// 			return `【渺梦】:你可以观看牌堆顶${num}张牌，并可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中，然后你获得等同与你插入的牌的数量的个“沫”标记。`;
// 		},
// 		async content(event, trigger, player) {
// 			//@ts-ignore
// 			const num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
// 			let suits = [...lib.suit],
// 				types = ["basic", "trick", "equip"];
// 			let outCards = [];
// 			let pileCards = get.cards(num);
// 			for (let type of types) {
// 				let name = lib.inpile.filter(n => get.type2(n) === type).randomGet();
// 				let suit = suits.randomGet();
// 				suits.remove(suit);
// 				outCards.push(game.createCard(name, suit, [1, 3, 5, 8, 12].randomGet()));
// 			}
// 			let { moved } = await player
// 				.chooseToMove()
// 				.set("list", [
// 					["牌堆顶", pileCards],
// 					["游戏外的牌", outCards],
// 				])
// 				.set("prompt", `你可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中`)
// 				.set("filterMove", (from, to, moved) => {
// 					//@ts-ignore
// 					let pile = get.event().pileCards;
// 					let fakeMoved = [moved[0].slice(), moved[1].slice()];
// 					if (typeof to !== "number") {
// 						let fromPos = findElementPosition(fakeMoved, from.link);
// 						let toPos = findElementPosition(fakeMoved, to.link);

// 						if (fromPos && toPos) {
// 							[fakeMoved[fromPos.arrayIndex][fromPos.elementIndex], fakeMoved[toPos.arrayIndex][toPos.elementIndex]] = [fakeMoved[toPos.arrayIndex][toPos.elementIndex], fakeMoved[fromPos.arrayIndex][fromPos.elementIndex]];
// 						}
// 					} else {
// 						if (fakeMoved[0].includes(from.link)) fakeMoved[0].remove(from.link);
// 						if (fakeMoved[1].includes(from.link)) fakeMoved[1].remove(from.link);
// 						fakeMoved[to].push(from.link);
// 					}
// 					let adjusted = fakeMoved[0].filter(card => pile.includes(card));
// 					return JSON.stringify(pile) === JSON.stringify(adjusted);

// 					function findElementPosition(arrays, element) {
// 						for (let i = 0; i < arrays.length; i++) {
// 							let index = arrays[i].indexOf(element);
// 							if (index !== -1) {
// 								return { arrayIndex: i, elementIndex: index };
// 							}
// 						}
// 						return null;
// 					}
// 				})
// 				.set("filterOk", () => {
// 					//@ts-ignore
// 					let outs = get.event().outCards;
// 					//@ts-ignore
// 					let buttons = Array.from(get.event().buttonss[0].children).concat(Array.from(get.event().buttonss[1].children));
// 					buttons.forEach(button => {
// 						let link = button.link;
// 						if (!outs.includes(link)) {
// 							let tag = button.querySelector(".info");
// 							if (tag) tag.innerHTML = "不可改变顺序";
// 						}
// 					});
// 					return true;
// 				})
// 				.set("processAI", list => {
// 					const player = get.event().player;
// 					let pile = [...list[0][1]];
// 					let outs = [...list[1][1]];
// 					for (let card of outs) {
// 						let insertIndex = pile.findIndex(cardx => get.value(cardx) < get.value(card));
// 						if (insertIndex === -1) {
// 							pile.push(card);
// 						} else {
// 							pile.insert(insertIndex, card, false);
// 						}
// 					}
// 					let moved = [pile, outs];
// 					return moved;
// 				})
// 				.set("outCards", outCards)
// 				.set("pileCards", pileCards)
// 				.forResult();
// 			if (!moved) return;
// 			let top = moved[0];
// 			//@ts-ignore
// 			let count = top.length - pileCards.length;

// 			player.addMark("fuyingmrfz", count);

// 			top.reverse();
// 			for (let i = 0; i < top.length; i++) {
// 				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
// 			}
// 			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
// 			game.updateRoundNumber();
// 			game.delayx();
// 		},
// 	},
// 	fuyingmrfz: {
// 		forced: true,
// 		audio: ["作战中3","作战中4"],
// 		mark: true,
// 		marktext: "沫",
// 		intro: {
// 			name: "沫",
// 			content: '有#个“沫”标记<br><span style="color:rgb(138,43,226);font-family:yuanli">人生五十年，如梦亦如幻。</span>',
// 		},
// 		trigger: {
// 			global: "dying",
// 		},
// 		filter(event, player) {
// 			return event.player.isAlive() && event.player.hasMark("fuyingmrfz");
// 		},
// 		async content(event, trigger, player) {
// 			player.$fullscreenpop("泡泡破裂了...", "thunder");
// 			for (let target of game.players.sortBySeat(trigger.player).filter(c => c.hasMark("fuyingmrfz"))) {
// 				const { bool } =
// 					target.countMark("fuyingmrfz") > target.countCards("he")
// 						? { bool: false }
// 						: await target
// 								.chooseToDiscard({ position: "he" })
// 								.set("filterCard", card => {
// 									let cards = ui.selected.cards;
// 									if (cards.length > 1) {
// 										return cards.every(cardx => get.suit(card) !== get.suit(cardx));
// 									}
// 									return true;
// 								})
// 								.set("ai", card => {
// 									return Math.abs(get.value(card, player) - 10000);
// 								})
// 								.set("complexCard", true)
// 								.set("selectCard", target.countMark("fuyingmrfz"))
// 								.set("prompt", `请弃置${target.countMark("fuyingmrfz")}张花色不同的牌或失去${target.countMark("fuyingmrfz")}点体力`)
// 								.forResult();
// 				if (bool === false) target.loseHp(target.countMark("fuyingmrfz"));
// 				target.removeMark("fuyingmrfz", target.countMark("fuyingmrfz"));
// 			}
// 		},
// 		ai: {
// 			neg: true,
// 		},
// 	},
// });

// translate({
// 	char_4202_haruka: "紫野遥",
// 	youlinmrfz: "游鳞",
// 	youlinmrfz_info: "出牌阶段限一次，你可以展示M张手牌并展示N张牌堆顶的牌（M+N=3），选择至多三名角色，然后根据你展示的牌这些角色执行对应的选项并获得X-M个“沫”标记：<br>1.点数均不同：获得一点护甲;<br>2.花色均不同：摸X张牌;<br>3.类型均不同：本技能本阶段改成“出牌阶段限两次”。（X=执行的选项数）",
// 	miaomengmrfz: "缈梦",
// 	miaomengmrfz_info: "准备阶段，你可以观看牌堆顶Y张牌，并可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中，然后你获得等同与你插入的牌的数量的个“沫”标记。(Y=场上“沫”标记的数量,Y∈[1,5])",
// 	fuyingmrfz: "浮影",
// 	fuyingmrfz_info: "锁定技，当有角色进入濒死状态时，若其有“沫”标记，则所有有沫标记的角色须弃置Z张花色不同的牌或失去Z点体力，然后其移除所有的“沫”标记。（Z=该角色“沫”标记的数量）",
// });