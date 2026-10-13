import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("maizhelunmrfz", { pack: "legendSJZX", sex: "female", group: "lymrfz", hp: 3, skills: ["kanchamrfz", "longtengmrfz"] });

/** 「龙腾」标记牌类型对应的标记图标 */
const longtengMarkImages = {
	basic: "mrfz_LTF",
	trick: "mrfz_LTL",
	equip: "mrfz_LTA",
};

/**
 * 从「失去牌」记录中取出进入弃牌堆的牌；手牌尚在移动途中时不算已弃置
 * @param { any } loseInfo event.getl(player) 的返回值
 */
function getLongtengDiscardedCards(loseInfo) {
	return loseInfo.cards2.filter(card => get.position(card, loseInfo.hs.includes(card) ? loseInfo.player : false) === "d");
}

/** 「龙腾」额外目标筛选：未选过、使用合法且目标合法（牌与已选目标取自 event 的 card/targets） */
function longtengCanAddTarget(card, player, target) {
	const evt = _status.event;
	const user = evt.player;
	if (evt.targets.includes(target)) return false;
	if (user.canUse(evt.card, target, true) === false) return false;
	return lib.filter.targetEnabled2(evt.card, user, target);
}

/** 「龙腾」额外目标AI：优先选对此牌有效果的目标 */
function longtengAddTargetAI(target) {
	const evt = _status.event;
	return get.effect(target, evt.card, evt.player, evt.player);
}

skill({
	kanchamrfz: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		intro: {
			content: "已发动#次【勘查】",
		},
		check: function (card) {
			let player = _status.event.player;
			if (
				player.hasCard(function (card) {
					return get.type(card) == "equip";
				})
			)
				return get.type(card) == "equip";
			if (
				player.hasCard(function (card) {
					return get.type(card) == "trick";
				})
			)
				return get.type(card) == "trick";
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards } = event;
			let result;

			// step 0
			event.cards2 = cards[0];
			result = await player
				.chooseControl({
					controls:["顶部", "底部"]
				})
				.set("prompt", get.prompt("kanchamrfz"))
				.set("prompt2", "【勘查】:请选择展示牌堆顶还是牌堆底" + (player.countMark("kanchamrfz") + 3) + "张牌")
				.set("ai", () => {
					return [0, 1].randomGet();
				})
				.forResult();

			// step 1
			const num = player.countMark("kanchamrfz") + 3;
			if (result.index === 0) {
				const cards = game.cardsGotoOrdering(get.cards(num)).cards;
				event.cards = cards;
			} else if (result.index === 1) {
				//@ts-ignore
				event.cards = get.bottomCards(num);
			} else {
				return;
			}

			// step 2
			const list:any[] = [];
			player.showCards(event.cards, get.translation(player) + "发动了【勘查】");
			for (let i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards2, "trick") !== get.type(event.cards[i], "trick")) {
					list.push(event.cards[i]);
				}
			}
			if (list.length) {
				await player.gain({cards:list,animate:"gain2"});
			}

			// step 3
			if (player.countMark("kanchamrfz") < 3) {
				player.addMark("kanchamrfz", 1, false);
			}
		},
		ai: {
			order: 13,
			threaten: 1.1,
			result: {
				player: 1,
			},
		},
	},
	longtengmrfz: {
		audio: 8,
		markimage: "extension/WhichWay/image/skill/mrfz_LTF.png",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove: function (player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile({cards});
		},
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		// ① 不在弃牌阶段因弃置而失去牌
		filter: function (event, player) {
			if (player.isPhase("phaseDiscard", false)) return false;
			if (event.type != "discard" || event.getlx === false) return false;
			return getLongtengDiscardedCards(event.getl(player)).length > 0;
		},
		direct: true,
		async content(event, trigger, player) {
			const discarded = getLongtengDiscardedCards(trigger.getl(player));
			if (!discarded.length) return;

			// 弃置数张时选出一张
			let cards = discarded;
			if (discarded.length > 1) {
				const result = await player
					.chooseButton({
						createDialog:["【龙腾】:请选择一张牌", discarded]
					})
					.set("ai", button => {
						// 有队友时倾向给出装备或锦囊，没有队友时给出基本牌
						if (
							game.hasPlayer(current => {
								return get.attitude(player, current) > 2;
							})
						)
							return get.type(button.link) === "equip" || get.type(button.link, "trick") === "trick";
						return get.type(button.link) === "basic";
					})
					.forResult();
				if (!result?.links?.length) return;
				cards = result.links;
			}

			// 置于一名没有「龙腾」的角色武将牌上
			const card = cards[0];
			const result = await player
				.chooseTarget({
					prompt:"【龙腾】:请选择一名角色，并将" + get.translation(card) + "(" + get.translation(get.type(card, "trick")) + "牌) 置于该角色武将牌上",
					filterTarget(card, player, target) {
						return target.getExpansions("longtengmrfz").length === 0; 
					},
				})
				.set("ai", target => {
					if (get.type2(card) === "basic") return -get.attitude(player, target);
					return get.attitude(player, target) > 2;
				})
				.forResult();
			if (!result?.targets?.length) return;

			const target = result.targets[0];
			const next = target.addToExpansion(cards, target, "give");
			next.gaintag.add("longtengmrfz");
			await next;
			target.addSkill("longtengmrfz_changeI");
			player.logSkill("longtengmrfz", target);
		},
		group: "longtengmrfz_clear",
		global: ["longtengmrfz_basic_1", "longtengmrfz_basic_2", "longtengmrfz_trick", "longtengmrfz_equip"],
		subSkill: {
			// 「龙腾」变动后按牌类型更换标记图标
			changeI: {
				silent: true,
				charlotte: true,
				trigger: { player: "longtengmrfzAfter" },
				async content(event, trigger, player) {
					player.removeSkill("longtengmrfz_changeI");
					for (const [type, image] of Object.entries(longtengMarkImages)) {
						if (player.isTypeExpansions("longtengmrfz", type)) {
							player.changeMarkImage("longtengmrfz", image);
							break;
						}
					}
				},
			},
			// 基本牌：锁定技，摸牌阶段摸牌数-1
			basic_1: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseDrawBegin" },
				filter: function (event, player) {
					return player.isTypeExpansions("longtengmrfz", "basic");
				},
				async content(event, trigger, player) {
					trigger.num--;
					player.logSkill("longtengmrfz");
				},
			},
			// 基本牌：锁定技，出牌阶段结束时摸一张牌
			basic_2: {
				charlotte: true,
				forced: true,
				trigger: { player: "phaseUseEnd" },
				filter: function (event, player) {
					return player.isTypeExpansions("longtengmrfz", "basic");
				},
				async content(event, trigger, player) {
					player.draw();
					player.logSkill("longtengmrfz");
				},
			},
			// 锦囊牌：使用的单一目标普通锦囊牌目标+1，带伤害标签的可选伤害+1，然后本回合失效
			trick: {
				direct: true,
				trigger: { player: "useCard2" },
				filter: function (event, player) {
					if (player.hasSkill("longtengmrfz_trick2")) return false;
					if (!player.isTypeExpansions("longtengmrfz", "trick")) return false;
					if (get.type(event.card, "trick") !== "trick") return false;
					const info = get.info(event.card);
					if (info.allowMultiple === false || info.multitarget || !event.targets) return false;
					return game.hasPlayer(current => lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current));
				},
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget({
							/**
							 * "【龙腾】:你可以为此牌 (" + get.translation(trigger.card) + ") 额外指定一个目标", longtengCanAddTarget
							 */
							prompt:"【龙腾】:你可以为此牌 (" + get.translation(trigger.card) + ") 额外指定一个目标",
							filterTarget:longtengCanAddTarget
						})
						.set("ai", longtengAddTargetAI)
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.forResult();
					if (!result?.targets?.length) return;
					if (!event.isMine() && !event.isOnline()) await game.delayx();

					const targets = result.targets;
					player.logSkill("longtengmrfz", targets);
					trigger.targets.addArray(targets);

					if (get.tag(trigger.card, "damage")) {
						const { bool } = await player.chooseBool({
							prompt:"【龙腾】:是否令此牌伤害 +1？"
						}).forResult();
						if (bool) trigger.baseDamage++;
					}
					player.addTempSkill("longtengmrfz_trick2");
				},
			},
			// 本回合「龙腾」锦囊效果的失效标记
			trick2: {
				charlotte: true,
			},
			// 装备牌：使用基本牌选择目标后，目标+2、伤害基数+1或不计入使用次数三选一
			equip: {
				trigger: { player: "useCard2" },
				firstDo: true,
				filter: function (event, player) {
					if (get.type(event.card) !== "basic") return false;
					return player.isTypeExpansions("longtengmrfz", "equip");
				},
				async content(event, trigger, player) {
					const card = trigger.card;
					const list = ["不计入次数限制"];
					if (
						game.hasPlayer(current => {
							return !trigger.targets.includes(current) && !!player.canUse(card, current, false);
						})
					)
						list.add("增加目标");
					if (card.name === "sha") list.add("伤害基数 +1");

					const result = await player
						.chooseControl({controls:list})
						.set("prompt", "【龙腾】:请选择一项")
						.set("ai", () => {
							if (card.name === "sha" && player.getCardUsable("sha") === 0 && player.countCards("h", "sha") > 0) return 0;
							if (card.name === "sha" && (player.countCards("h", "sha") === 0 || player.getCardUsable("sha") > 0)) return list.length - 1;
							if (card.name === "jiu") return 0;
							return [...list.keys()].randomGet();
						})
						.forResult();
					if (!result?.control) return;

					game.log(player, "选择了", result.control);
					player.popup(result.control);
					player.logSkill("longtengmrfz");

					switch (result.control) {
						case "不计入次数限制": {
							if (trigger.addCount !== false && (card.name === "sha" || card.name === "jiu")) {
								trigger.addCount = false;
								const stat = trigger.player.getStat().card;
								if (card.name === "sha") stat.sha--;
								else stat.jiu--;
							}
							break;
						}
						case "增加目标": {
							const added = await player
								.chooseTarget({
									selectTarget() {
										return [1,2]
									},
									prompt:"【龙腾】:你可以为此牌 (" + get.translation(card) + ") 额外指定两个目标",
									filterTarget:longtengCanAddTarget
								})
								.set("ai", longtengAddTargetAI)
								.set("targets", trigger.targets)
								.set("card", card)
								.forResult();
							for (const target of added?.targets ?? []) {
								trigger.targets.push(target);
								player.line(target);
							}
							break;
						}
						case "伤害基数 +1":
							trigger.baseDamage = (trigger.baseDamage || 1) + 1;
							break;
					}
				},
			},
			// ② 锁定技：准备阶段或死亡时移除全场「龙腾」
			clear: {
				silent: true,
				charlotte: true,
				firstDo: true,
				trigger: { player: ["phaseZhunbeiBegin", "dieBegin"] },
				async content(event,trigger,player) {
					for (const current of game.players) {
						const cards = current.getExpansions("longtengmrfz");
						if (cards.length) current.loseToDiscardpile({cards});
					}
				},
			},
		},
		ai: {
			expose: 0.1,
		},
	},
});

translate({
	maizhelunmrfz: "麦哲伦",
	kanchamrfz: "勘查",
	kanchamrfz_info: "出牌阶段限一次，你可以弃置一张手牌，然后你展示牌堆顶或牌堆底的X+3张牌，获得与你弃置的牌类别不同的牌。（X=你发动此技能的次数，X至多为3）",
	longtengmrfz: "龙腾",
	longtengmrfz_info: "①当你不在弃牌阶段因弃置而失去牌时，你可以将其中一张牌置于一名武将牌上没有“龙腾”角色的武将牌上，此牌称之为“龙腾”；拥有“龙腾”的角色根据“龙腾”牌的类型获得对应的效果：</br>1.基本牌：锁定技，摸牌阶段摸牌数-1，出牌阶段结束时摸一张牌。</br>2.锦囊牌：当你使用一张单一目标的普通锦囊牌时，你可以令此牌的目标+1，若此牌带有伤害标签，你可以令此牌造成的伤害+1，然后本回合此技能失效。</br>3.装备牌：当你使用一张基本牌选择目标后，你可以令此牌的目标+2、伤害基数+1或此牌不计入使用次数。</br>②锁定技，你的准备阶段或你死亡时，你移除全场所有的“龙腾”。",
});

characterIntro("maizhelunmrfz", "麦哲伦，莱茵生命实验室外勤专员，在合作协议的作用下，暂计划以罗德岛为据点，开始新一轮的探索活动。擅长操控高度模块化无人机，因地制宜进行攻击或支援友军。");

characterTitle("maizhelunmrfz","探索者");
