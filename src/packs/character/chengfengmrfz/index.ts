import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("chengfengmrfz", { pack: "rareSJZX",
			sex: "male",
			group: "yanmrfz",
			hp: 3,
			skills: ["xiadaomrfz","qunxiamrfz"],
		});

skill({
	"xiadaomrfz": {
			audio: 2,
			trigger: {
				global: ["gainAfter", "loseAsyncAfter"],
			},
			init() {
				lib.translate["xiadaomrfz_tag"] = "待分配";
				lib.translate["xiadaomrfz_tag_allocated"] = "已分配";
			},
			filter(event, player) {
				// @ts-ignore
				if (event.getParent(2).name === "xiadaomrfz") return false;
				return event.player !== player && event.cards && event.cards.filter(i => get.position(i) === "h").length > 1;
			},
			async cost(event, trigger, player) {
				trigger.player.addTempSkill("xiadaomrfz_damage", { global: "xiadaoAfter" });
				// @ts-ignore
				const { result } = await player
					// @ts-ignore
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							// @ts-ignore
							return lib.filter.filterCard.apply(this, arguments);
						},
						`【侠盗】:是否对${get.translation(trigger.player)}使用一张【杀】，若造成伤害，你获得其本次获得的（${get.cnNumber(trigger.cards.filter(i => get.position(i) === "h").length)}张）牌？`
					)
					.set("complexSelect", true)
					// @ts-ignore
					// @ts-ignore
					.set("filterTarget", function (card, player, target) {
						// @ts-ignore
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						// @ts-ignore
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player);
				event.result = result;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				if (!player.storage.xiadaomrfz_damage) return false;
				delete player.storage.xiadaomrfz_damage;
				let cards = trigger.cards.filter(i => get.position(i) === "h");
				if (cards.length < 1) return;
				let cardsx = cards.map(card => {
					var cardx = ui.create.card();
					// @ts-ignore
					cardx.init(get.cardInfo(card));
					// @ts-ignore
					cardx._cardid = card.cardid;
					return cardx;
				});
				await player.directgains(cardsx, null, "xiadaomrfz_tag");
				let list = [];
				while (player.countCards("s", card => card.hasGaintag("xiadaomrfz_tag")) > 0) {
					const { result } = await player.chooseCardTarget({
						forced: true,
						prompt: `分配获得的牌`,
						filterCard(card) {
							return card.hasGaintag("xiadaomrfz_tag");
						},
						selectCard: [1, Infinity],
						selectTarget: [1, Infinity],
						position: "s",
						// @ts-ignore
						// @ts-ignore
						ai1: card => {
							if (ui.selected.cards.length === 0) return 1;
							return 0;
						},
						ai2: target => {
							const att = get.attitude(_status.event.player, target);
							if (get.value(ui.selected.cards[0], target) < 0) {
								return -att;
							} else if (att > 0) {
								return att / (1 + target.countCards("h"));
							} else {
								return att / 100;
							}
						},
					});
					//@ts-ignore
					list.add([result.targets[0], result.cards]);
					//@ts-ignore
					result.cards.forEach(i => {
						i.removeGaintag("xiadaomrfz_tag");
						i.addGaintag("xiadaomrfz_tag_allocated");
					});
				}
				let deleteCards = player.getCards("s", card => card.hasGaintag("xiadaomrfz_tag_allocated"));
				if (player.isOnline2()) {
					player.send(
						function (cards, player) {
							cards.forEach(i => i.delete());
							if (player == game.me) ui.updatehl();
						},
						deleteCards,
						player
					);
				}
				deleteCards.forEach(i => i.delete());
				if (player == game.me) ui.updatehl();
				list = list.map(arr => {
					let cards = arr[1];
					let gain = [];
					let j = trigger.player.getCards("h");
					for (let card of j) {
						if (cards.some(cardx => cardx._cardid == card.cardid)) gain.push(card);
					}
					return [arr[0], gain];
				});
				game.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				}).setContent("gaincardMultiple");
			},
			subSkill: {
				damage: {
					charlotte: true,
					silent: true,
					trigger: { player: "damageEnd" },
					// @ts-ignore
					// @ts-ignore
					filter(event, player) {
						// @ts-ignore
						return event.getParent(4).name === "xiadaomrfz_cost" && event.source && event.card && event.card.name === "sha";
					},
					// @ts-ignore
					// @ts-ignore
					async content(event, trigger, player) {
						trigger.source.storage.xiadaomrfz_damage = true;
					},
				},
			},
			ai: {
				// @ts-ignore
				// @ts-ignore
				threaten(player, target) {
					return target.hasSkill("qunxiamrfz") ? 5 : 2;
				},
			},
		},
	"qunxiamrfz": {
			audio: 2,
			getUntapped(player) {
				let result = [];
				player.getRoundHistory("useCard", evt => {
					if (evt.player === player) {
						result.add(get.suit(evt.card));
					}
				});
				return result;
			},
			// @ts-ignore
			// @ts-ignore
			init(player, skill) {
				player.storage.qunxiamrfz = [];
				let trans = "";
				for (let i of player.storage.qunxiamrfz) {
					trans += get.translation(i);
				}
				player.addTip("qunxiamrfz", `群侠 ${player.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
			},
			trigger: {
				player: "useCard",
			},
			filter(event, player) {
				return event.card && !player.storage.qunxiamrfz.includes(get.suit(event.card));
			},
			check(event) {
				return ["basic", "trick"].includes(get.type(event.card)) && ["tao", "shan", "jiu", "wugu"].includes(event.card.name);
			},
			prompt(event) {
				//@ts-ignore
				return `【群侠】:是否令${get.translation(event.card)}不可被其他角色响应？`;
			},
			// @ts-ignore
			// @ts-ignore
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current !== player;
					})
				);
				player.storage.qunxiamrfz.add(get.suit(trigger.card));
				let trans = "";
				for (let i of player.storage.qunxiamrfz) {
					trans += get.translation(i);
				}
				player.addTip("qunxiamrfz", `群侠 ${player.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
			},
			group: ["qunxiamrfz_clear", "qunxiamrfz_sha"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.qunxiamrfz = [];
						let trans = "";
						for (let i of player.storage.qunxiamrfz) {
							trans += get.translation(i);
						}
						player.addTip("qunxiamrfz", `群侠 ${player.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
					},
				},
				sha: {
					audio: "qunxiamrfz",
					enable: ["chooseToUse"],
					filterCard(card, player) {
						return !lib.skill.qunxiamrfz.getUntapped(player).includes(get.suit(card));
					},
					position: "hes",
					viewAs: {
						name: "sha",
					},
					viewAsFilter(player) {
						return player.countCards("hes", card => !lib.skill.qunxiamrfz.getUntapped(player).includes(get.suit(card))) > 0;
					},
					prompt: "将一张本轮未使用的花色的牌当杀使用",
					check(card) {
						const val = get.value(card);
						return 5 - val;
					},
				},
			},
			ai: {
				directHit_ai: true,
				// @ts-ignore
				skillTagFilter(player, tag, arg) {
					return arg && arg.card && !player.storage.qunxiamrfz.includes(get.suit(arg.card));
				},
			},
		},
});

translate({
	"chengfengmrfz": "骋风",
	"xiadaomrfz": "侠盗",
	"xiadaomrfz_info": "当其他角色一次至少不因此技能而获得两张牌后，你可以对其使用一张【杀】，若你因此对其造成伤害，你分配其获得的牌。",
	"qunxiamrfz": "群侠",
	"qunxiamrfz_info": "①当你于每轮首次使用一种花色的牌时，你可以令其他角色不可响应此牌。<br>②你可以将每轮你没有使用过的花色的牌当【杀】使用。",
});

characterTitle("chengfengmrfz", "<font color='#db7093'>抢亦有道</font>");

characterIntro("chengfengmrfz", "镖客骋风，常年在炎国尚蜀及周边地区走镖。因矿石病来罗德岛就医，为拓展镖局业务，主动与罗德岛签订了合作协议，为罗德岛提供药物运输服务及引荐人才。");
