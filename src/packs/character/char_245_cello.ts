import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_245_cello", { pack: "legendSJZX", sex: "female", group: "lamrfz", hp: 3, skills: ["qinmingmrfz", "kongwomrfz"] });

skill({
	qinmingmrfz: {
		audio: {
			default: ["行动出发"],
			"char_245_cello@sale#12": ["编入队伍","选中干员1","选中干员2"],
		},
		usable: 1,
		enable: "phaseUse",
		filter: function (event, player) {
			return game.hasPlayer(current => {
				return current != player && current.countCards("h") > 0;
			});
		},
		filterTarget: function (card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		selectTarget: 1,
		async content(event, trigger, player) {
			const { target } = event;

			const tmp_cards = target.getCards("h");
			const cards: Card[] = [];
			for (let i of tmp_cards) {
				if (target.canRecast(i)) cards.push(i);
			}
			await target.recast(cards);

			await target.showCards(target.getCards("h"), "【琴鸣】:" + get.translation(target) + "的手牌");

			const canCards: Card[] = [];
			for (const i of target.getCards("h")) {
				if (target.hasUseTarget(i)) canCards.push(i);
			}

			if (canCards.length > 0) {
				while (true) {
					const card = canCards?.shift();
					if (!card) break;
					if (target.hasCard(card.name, "h")) target.chooseUseTarget({ card, forced: true, nodistance: true, addCount: false });
					else break;
				}
			}
		},
		ai: {
			order: 8,
			expose: 0.1,
			result: {
				target: function (player, target) {
					let lowAtt =
						game.hasPlayer(current => {
							return current != player && current.inRange(target) && get.attitude(player, current) < 0;
						}) && get.attitude(player, target) < 0;
					let hightAtt =
						game.hasPlayer(current => {
							return current != player && current.inRange(target) && get.attitude(player, current) < 0;
						}) && get.attitude(player, target) > 0;
					if (lowAtt) return -1;
					if (hightAtt) return 1;
					return 0;
				},
			},
		},
	},
	kongwomrfz: {
		audio: {
			default:["作战中4","作战中1"],
			"char_245_cello@sale#12":["作战中4","作战中1"],
		},
		forced: true,
		trigger: { player: "drawBegin" },
		filter: function (event, player) {
			return event.num > 0;
		},
		async content(event, trigger, player) {
			const num = trigger.num;
			trigger.cancel();
			let cards: Card[] = [],
				banCards: Card[] = [];
			const loseCards = player.getHistory("lose", evt => {
				return evt.player == player;
			});
			for (let i of loseCards) {
				if (!i.cards) continue;
				//i.cards 是数组，直接 push 会让 banCards 里全是数组，下面的 includes(card) 恒为 false
				banCards.push(...i.cards);
			}
			while (cards.length < num) {
				let card = get.discardPile(card => {
					return !cards.includes(card) && !banCards.includes(card);
				});
				if (card) cards.push(card);
				else break;
			}
			player.gain({ cards, animate: "gain2" });
		},
		group: ["kongwomrfz_get", "kongwomrfz_clear"],
		subSkill: {
			clear: {
				silent: true,
				charlotte: true,
				direct: true,
				trigger: { player: "phaseUseEnd" },
				async content(event, trigger, player) {
					if (player.storage.kongwomrfz_get) delete player.storage.kongwomrfz_get;
				},
			},
			get: {
				audio: "kongwomrfz",
				direct: true,
				trigger: { global: "loseAfter" },
				filter: function (event, player) {
					if (event.player == player || !player.isPhaseUsing()) return false;
					if (event.getParent()!.name != "useCard") return false;
					let cards = event.cards2.slice(0);
					for (let i = 0; i < cards.length; i++) {
						let type = get.type2(cards[i]);
						if (get.position(cards[i], true) == "o" && type != "equip") {
							return true;
						}
					}
					return true;
				},
				async content(event, trigger, player) {
					if (trigger.delay == false) game.delay();
					if (!player.storage.kongwomrfz_get) player.storage.kongwomrfz_get = [];

					const cards: Card[] = [];
					for (let i = 0; i < trigger.cards2.length; i++) {
						let card = trigger.cards2[i];
						let type = get.type2(card);
						let name = player.storage.kongwomrfz_get,
							name2 = card.name;
						if (get.position(card, true) == "o" && type != "equip" && !name.includes(name2)) {
							cards.push(card);
						}
					}
					if (!cards || cards.length < 1) return;
					const result = await player
						.chooseButton({
							//true, ["【空我】:请选择你要获得的牌", cards], [1, Infinity]
							forced: true,
							createDialog: ["【空我】:请选择你要获得的牌", cards],
							selectButton: [1, Infinity],
							ai(button) {
								return get.value(button.link);
							},
						})
						.forResult();
					if (result.links) {
						for (let i of result.links) {
							const name = get.name(i);
							if (!player.storage.kongwomrfz_get.includes(name)) player.storage.kongwomrfz_get.add(name);
						}
						player.gain({ cards, animate: "gain2" });
						player.logSkill("kongwomrfz");
					}
				},
			},
		},
	},
});

translate({
	char_245_cello: "塑心",
	qinmingmrfz: "琴鸣",
	qinmingmrfz_info: "出牌阶段限一次，你可以令一名其他角色重铸所有手牌，然后其展示所有手牌且须使用所有手牌（无距离和次数限制）。",
	kongwomrfz: "空我",
	kongwomrfz_info: "锁定技，当你摸牌时，改为从弃牌堆中随机获得等量的牌（不能是本回合你因失去而进入弃牌堆的牌）；出牌阶段，当其他角色因使用而失去牌时，若此牌不是装备牌且你本阶段没有以此法获得过相同牌名的牌，你获得其中至少一张牌。",
});

characterTitle("char_245_cello", "<font color=#DC143C>感性与自由</font>");

characterIntro("char_245_cello", "塑心，本名阿尔图罗·吉亚洛，出身于拉特兰、活跃于泰拉大地的著名音乐家。受莱塔尼亚帝国宫廷、拉特兰教皇厅委托，罗德岛与两方签署协议确认，在受相应人员的严格监管下，允许其以干员“塑心”身份暂留罗德岛。");
