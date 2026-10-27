import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_421_crow", { pack: "epicSJZX", sex: "female", group: "bomrfz", hp: 4, skills: ["tiaojiumrfz", "rujingmrfz"] });

/** 判断角色是否有可用于转化（使用/打出）的【酒】 */
function hasJiuCard(player) {
	return player.hasCard(card => _status.connectMode || get.name(card) === "jiu", "hes");
}

/** 入境已达成的档位数（去重后的伤害类牌名数量） */
function countRujing(player) {
	return player.countMark("rujingmrfz");
}

/** 场上是否存在达成入境第5档的存活角色 */
function hasRujingFull() {
	return game.hasPlayer(player => player.isAlive() && player.hasSkill("rujingmrfz") && countRujing(player) >= 5);
}

skill({
	tiaojiumrfz: {
		audio: ["行动开始", "行动出发"],
		audioname: ["char_486_takila"],
		forced: true,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const suits = ["spade", "heart", "club", "diamond"];
			const cards:Card[] = [];
			for (let i = 0; i < 8; i++) {
				cards.push(game.createCard2("jiu", suits[get.rand(0, suits.length - 1)], get.rand(1, 13)));
			}
			await player.$throw(cards);
			await game.cardsGotoPile(cards, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
		},
		group: ["tiaojiumrfz_wanjin"],
		subSkill: {
			wanjin: {
				audio: "tiaojiumrfz",
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type === "wuxie") return false;
					if (!hasJiuCard(player)) return false;
					return get.inpileVCardList(info => {
						if (info[0] !== "basic") return false;
						return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }), player, event);
					}).length;
				},
				chooseButton: {
					dialog(event, player) {
						const vcards = get.inpileVCardList(info => {
							if (info[0] !== "basic") return false;
							return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }), player, event);
						});
						return ui.create.dialog("调酒", [vcards, "vcard"]);
					},
					check(button) {
						if (get.event().getParent()!.type !== "phase") return 1;
						return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
					},
					backup(links, player) {
						return {
							audio: "tiaojiumrfz",
							popname: true,
							viewAs: { name: links[0][2], nature: links[0][3] },
							filterCard(card) {
								return get.name(card) === "jiu";
							},
							check(card) {
								return 7 - get.value(card);
							},
							position: "hes",
						};
					},
					prompt(links) {
						return `将一张【酒】当${get.translation(links[0][3]) || ""}【${get.translation(links[0][2])}】使用`;
					},
				},
				hiddenCard(player, name) {
					if (get.type(name) !== "basic") return false;
					return lib.inpile.includes(name) && hasJiuCard(player);
				},
				ai: {
					order: 3,
					result: {
						player(player) {
							return get.event().dying ? get.attitude(player, get.event().dying) : 1;
						},
					},
				},
			},
			backup: {},
		},
	},
	rujingmrfz: {
		audio: ["作战中4", "作战中3"],
		forced: true,
		popup: false,
		mark: true,
		intro: {
			content(storage, player) {
				const num = countRujing(player);
				const texts = [
					"1.准备阶段，从牌堆或弃牌堆中获得一张【酒】",
					"2.你可以将【酒】当【顺手牵羊】使用",
					"3.你使用的【酒】的效果持续一回合",
					"4.你【酒】的效果对所有伤害类牌均生效",
					"5.没有【调酒】的角色无法使用【酒】",
				];
				return texts
					.map((text, index) => {
						if (num >= index + 1) return whichWayUtil.colorize(`#g√${text}#`);
						return `·${text}`;
					})
					.join("<br>");
			},
		},
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event.card || !get.is.damageCard(event.card)) return false;
			return !player.getStorage("rujingmrfz", []).includes(get.name(event.card));
		},
		async content(event, trigger, player) {
			player.markAuto("rujingmrfz", [get.name(trigger.card)]);
		},
		init(player, skill) {
			//补记技能获得前已使用过的伤害类牌
			const names:string[] = [];
			for (const history of player.getAllHistory("useCard")) {
				const card = history.card;
				if (!card || !get.is.damageCard(card)) continue;
				const name = get.name(card)!;
				if (!names.includes(name)) names.push(name);
			}
			if (names.length) player.setStorage("rujingmrfz", names, true);
			//「没有调酒的角色无法使用酒」为全局规则，常驻注册后由自身 mod 判定是否生效
			game.addGlobalSkill("rujingmrfz_nojiu");
		},
		group: ["rujingmrfz_phase1", "rujingmrfz_phase2", "rujingmrfz_phase3", "rujingmrfz_phase4"],
		subSkill: {
			//准备阶段，从牌堆或弃牌堆中获得一张【酒】
			phase1: {
				audio: "rujingmrfz",
				forced: true,
				popup: false,
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return countRujing(player) >= 1;
				},
				async content(event, trigger, player) {
					const card = get.cardPile("jiu");
					if (card) await player.gain({cards:[card],animate: "gain2"});
				},
			},
			//你可以将【酒】当【顺手牵羊】使用
			phase2: {
				audio: "rujingmrfz",
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type === "wuxie") return false;
					if (countRujing(player) < 2) return false;
					return hasJiuCard(player);
				},
				filterCard(card) {
					return get.name(card) === "jiu";
				},
				position: "hes",
				viewAs: { name: "shunshou" },
				viewAsFilter(player) {
					return countRujing(player) >= 2 && hasJiuCard(player);
				},
				prompt: "将一张【酒】当【顺手牵羊】使用",
				check(card) {
					return 6 - get.value(card);
				},
			},
			//你使用的【酒】的效果持续一回合（使用后不消耗，本回合结束时才清除）
			phase3: {
				audio: "rujingmrfz",
				ai: {
					jiuSustain: true,
					skillTagFilter(player, tag, name) {
						if (name !== "useCard") return false;
						return countRujing(player) >= 3;
					},
				},
			},
			//你【酒】的效果对所有伤害类牌均生效
			phase4: {
				audio: "rujingmrfz",
				forced: true,
				popup: false,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					if (countRujing(player) < 4) return false;
					if (!event.card || get.name(event.card) === "sha") return false;
					if (!get.is.damageCard(event.card)) return false;
					return Number(player.storage.jiu) > 0;
				},
				async content(event, trigger, player) {
					//第3档已使【酒】持续到回合结束，故此处不再消耗
					trigger.num += Number(player.storage.jiu) || 0;
				},
			},
			//没有【调酒】的角色无法使用【酒】（含濒死求酒）
			nojiu: {
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.name(card) !== "jiu") return;
						if (player.hasSkill("tiaojiumrfz")) return;
						if (hasRujingFull()) return false;
					},
					cardSavable(card, player) {
						if (get.name(card) !== "jiu") return;
						if (player.hasSkill("tiaojiumrfz")) return;
						if (hasRujingFull()) return false;
					},
				},
			},
		},
	},
});

translate({
	char_421_crow: "羽毛笔",
	tiaojiumrfz: "调酒",
	tiaojiumrfz_info: "①锁定技，游戏开始时，你将八张【酒】置入牌堆之中;<br>②你可以将【酒】当任意基本牌使用。",
	//杀 决斗 火攻 南蛮 万剑
	rujingmrfz: "入境",
	rujingmrfz_info:
		"锁定技，根据你使用过伤害类牌的数量（相同牌名的牌仅记一次）获得对应的效果：<br>1.准备阶段，从牌堆或弃牌堆中获得一张【酒】;<br>2.你可以将【酒】当【顺手牵羊】使用;<br>3.你使用的【酒】的效果持续一回合;<br>4.你【酒】的效果对所有伤害类牌均生效;<br>5. 没有【调酒】的角色无法使用【酒】。",
});

characterIntro(
	"char_421_crow",
	"羽毛笔，真正玻利瓦尔人某中尉之女，父亲死后被父亲战友潘乔收养，成为其养女，而后一同辗转至多索雷斯。</br>多索雷斯事件后，与龙舌兰一同来到罗德岛，由于身份特殊，经过会议审查，最终同意其加入罗德岛。"
);

characterTitle("char_421_crow", "多索雷斯的调酒师");
