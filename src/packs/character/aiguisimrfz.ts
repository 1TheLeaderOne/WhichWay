import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "aiguisimrfz";

character(NAME, {
	skills: ["zhenyingmrfz", "kailaimrfz"],
	sex: "female",
	hp: 3,
	group: "persona",
	pack: "epicSJZX",
	whichWay: {
		linkage: true,
		arknight: {
			camp: "persona",
		},
	},
});

characterIntro(NAME, "埃癸斯，1102年3月于中庭公证所登记为第三类驻留人员，根据拉特兰公民权利章程附录第三十六条、入境人员管理条例第二章第五条，由圣马尔索综合学校接收入学。<br>教师评语：埃癸斯同学聪明好学，认真严谨，富有责任心，自我要求严格，在类铳型武装系列课程中取得了不俗的成绩。望能敞开心扉，更多地尝试集体活动，在学习进步之余，亦能享受美好的校园生活。");
characterTitle(NAME, whichWayUtil.colorize("#r战车#"));
translate({
	[NAME]: "埃癸斯",

	zhenyingmrfz: "镇影",
	zhenyingmrfz_info: "锁定技，游戏开始时，你将一张手牌（称为牌A）随机置入牌堆，然后获得下列效果：<br>1.当牌A离开牌堆时，你移除【镇影】给予的所有效果、失去一点体力并发动一次【镇影】;<br>2.你不能使用手牌中与牌A相同牌名的牌;<br>3.与牌A类别相同的牌不计入手牌上限。",
	kailaimrfz: "开来",
	kailaimrfz_info: "当你不因【开来】而使用牌时，你可以摸并弃置一张牌，若你弃置的牌与你此次使用牌的花色[相同/不同]，你[使用/改为使用]弃置的牌（目标须合法）。",
});

skill({
	zhenyingmrfz: {
		mod: {
			cardEnabled(card, player, event, result) {
				const cardx: Card | undefined = player.storage.zhenyingmrfz;
				if (cardx && get.name(cardx) === get.name(card) && get.position(card) === "h") return false;
			},
			ignoredHandcard(card, player, current) {
				const cardx: Card | undefined = player.storage.zhenyingmrfz;
				if (cardx && get.type2(cardx) === get.type2(card)) return true;
			},
		},
		audio: ["观看作战记录", "精英化晋升2"],
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		mark: true,
		intro: {
			mark(dialog, storage, player, event, skill) {
				const card: Card = player.storage.zhenyingmrfz;
				if (!card) {
					dialog.addText("牌堆中没有弃置的牌");
					return;
				}
				if (game.me === player || player.isUnderControl()) {
					dialog.addText("牌堆中的牌");
					dialog.addSmall([card]);
					return;
				}
				dialog.addText("牌堆有弃置的牌");
			},
		},
		onremove(player, type) {
			delete player.storage.zhenyingmrfz;
			player.removePromptSJZX();
		},
		async content(event, trigger, player) {
			const { cards } = await player
				.chooseCard({
					prompt: "【镇影】:请选择一张手牌随机置入牌堆",
					prompt2: get.skillInfoTranslation("zhenyingmrfz", player, false),
					forced: true,
					ai(card) {
						let val = 0;
						const [name, type] = [get.name(card)!, get.type2(card)];
						if (type === "trick") val += 1;
						if (type === "equip") val += 2;

						if (["tao", "shan", "wuxie"].includes(name)) val -= 5;
						if (name === "jiu") val -= 2;
						if (["shunshou", "guohe", "jiedao"].includes(name)) val += 3;

						return val;
					},
				})
				.forResult();
			if (!cards) return;

			player.$throw(cards.length, 1000);
			await player
				.lose({
					cards,
					position: ui.cardPile,
				})
				.set("insert_index", () => {
					const index = ui.cardPile.childNodes.length;
					return ui.cardPile.childNodes[get.rand(0, index)];
				});
			//牌A 要等**置入牌堆之后**才记录：否则置入过程中的 lose 事件会让下面 leavePile 子技能
			//误判成"牌A 已经离开牌堆"而提前结算
			player.storage.zhenyingmrfz = cards[0];
			game.updateRoundNumber();
			refresh(player);
		},
		group: ["zhenyingmrfz_refresh", "zhenyingmrfz_leavePile"],
		subSkill: {
			refresh: {
				charlotte: true,
				silent: true,
				trigger: {
					player: ["loseAfter", "gainAfter", "loseAsyncAfter"],
				},
				async content(event, trigger, player) {
					refresh(player);
				},
			},
			/**
			 * 牌A 离开牌堆：移除【镇影】给予的所有效果 → 失去一点体力 → 再发动一次【镇影】。
			 *
			 * 判定口径用 DOM（`ui.cardPile.contains(card)`）而不是某一个具体事件：牌A 可能被摸走
			 * （`gainAfter`）、被移出牌堆 / 置入弃牌堆（`loseAfter`、`loseAsyncAfter`）……监听全局这
			 * 三类事件后统一按"牌A 还在不在牌堆里"下结论，比逐个事件猜迁移路径可靠。
			 */
			leavePile: {
				charlotte: true,
				silent: true,
				trigger: {
					global: ["gainAfter", "loseAfter", "loseAsyncAfter"],
				},
				filter(event, player) {
					const card: Card | undefined = player.storage.zhenyingmrfz;
					//牌A 还在牌堆里（或已被本次结算清掉）⇒ 不触发
					return !!card && !ui.cardPile.contains(card);
				},
				async content(event, trigger, player) {
					//1. 移除【镇影】给予的所有效果：mod（cardEnabled / ignoredHandcard）与手牌提示都读
					//   storage，storage 一删即全部失效
					delete player.storage.zhenyingmrfz;
					player.removePromptSJZX("zhenyingmrfz_prompt");
					player.markSkill("zhenyingmrfz");

					//2. 失去一点体力
					await player.loseHp(1);

					//3. 发动一次【镇影】（重新选一张手牌置入牌堆，效果随之重新挂上）
					player.logSkill("zhenyingmrfz");
					const next = game.createEvent("zhenyingmrfz_leavePile_repeat");
					next.player = player;
					//@ts-ignore 复用主技能的 content（选牌 → 置入牌堆 → 刷新提示）
					next.setContent(lib.skill.zhenyingmrfz.content);
					await next;
				},
			},
		},
	},
	kailaimrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		trigger: {
			player: "useCardBegin",
		},
		filter(event, player, name, target) {
			console.log(event);
			return (event.getParent(2) || {}).name !== "kailaimrfz" && !event.triggered_kailaimrfz;
		},
		async content(event, trigger, player) {
			const card = trigger.card;
			const cards = trigger.cards;
			await player.draw();
			const { cards: cardsx } = await player
				.chooseToDiscard({
					prompt: `【开来】:请弃置一张牌，若你弃置的牌的花色[是/不是]${whichWayUtil.colorize(`#b${get.translation(get.suit(card))}#`)}，你[使用/改为使用]弃置的牌。`,
					forced: true,
					filterCard(card, player, event) {
						const cards = get.event().cards as Card[];
						for (let cardx of player.getCards("h")) {
							if (cards.includes(cardx)) {
								cardx.addPromptSJZX("已使用此牌", "kailaimrfz_prompt");
								continue;
							}
							const { name, suit, nature, storage, number } = cardx;
							if (!player.hasUseTarget({ name, suit, nature, storage, number })) {
								cardx.addPromptSJZX(whichWayUtil.colorize("#r无合法目标#"), "kailaimrfz_prompt");
							}
						}
						return !cards.includes(card);
					},
					ai(card) {
						const player = get.player();
						const cardx = get.event().cardx as VCard;
						let val = get.value(card) - get.value(cardx);
						const { name, suit, nature, storage, number } = cardx;
						if (!player.hasUseTarget({ name, suit, nature, storage, number })) val -= 10;
						if (get.suit(card) === get.suit(cardx)) val += 8;
						return val;
					},
					chooseonly: true,
				})
				.set("cardx", card)
				.set("cards", cards)
				.forResult();
			player.removePromptSJZX("kailaimrfz_prompt");
			if (!cardsx) return;
			const cardx = cardsx[0];

			//判断有无合法目标
			const { name, suit, nature, storage, number } = cardx;
			if (player.hasUseTarget({ name, suit, nature, storage, number })) {
				await player.chooseUseTarget({
					card: get.autoViewAs({ name, suit, nature, storage, number }, cardsx),
					forced: true,
					cards: [cardx],
				});
			} else {
				game.log(player, "使用的", `#y${get.translation(cardx)}`, "无合法目标");
				await player.discard({ cards: cardsx });
			}

			//花色不同则取消用牌并将牌丢到弃牌堆
			if (get.suit(card) !== get.suit(cardx)) {
				game.log(player, "使用", `#y${get.translation(cardx)}`, "代替了", `#y${get.translation(card)}`, "使用");
				await player.discard({ cards });
				trigger.cancel();
			}
		},
	},
});

function refresh(player: Player): void {
	player.removePromptSJZX("zhenyingmrfz_prompt");

	if (!player.storage.zhenyingmrfz) return;
	const type = get.type2(player.storage.zhenyingmrfz);
	for (let card of player.getCards("h")) {
		if (get.type2(card) === type) {
			card.addPromptSJZX("不计入手牌上限", "zhenyingmrfz_prompt");
		}
	}
}
