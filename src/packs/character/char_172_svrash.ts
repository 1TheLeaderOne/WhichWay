import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_172_svrash", { pack: "legendSJZX", sex: "male", group: "xiemrfz", hp: 4, skills: ["xuebianmrfz", "tonghemrfz"] });

skill({
	xuebianmrfz: {
		intro: {
			content: "已造成#点伤害",
		},
		onremove: true,
		audio: ["新年祝福", "闲置"],
		usable: 1,
		enable: "phaseUse",
		filter: function (event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0;
				})
			);
		},
		filterTarget: function (card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		selectTarget: [1, 2],
		filterCard(card, player) {
			return true;
		},
		selectCard() {
			return [0, 3];
		},
		multitarget: true,
		multiline: true,
		discard: false,
		lose: false,
		delay: false,
		check(card: Card) {
			const player = get.player();
			let val = 10;
			if (get.color(card) !== "red") val -= 10;
			return val - get.value(card);
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				targets = event.targets.slice().sortBySeat(player);

			const cardsRecord: [Player, Card[]][] = [[player, cards]];

			for (let target of targets) {
				const result = await target
					.chooseCard({
						forced: true,
						selectCard: [0, 3],
						prompt: "【雪变】:请展示至多三张手牌",
						ai(card) {
							const player = get.player();
							const target = get.event().targetx as Player;
							const att = get.attitude(player, target);
							const color = get.color(card);
							let val = -get.value(card);

							if (att > 0) {
								//友方时只会亮红色
								if (color === "red") val += 100;
								else val -= 100;
							} else {
								//敌方随便亮
								val += get.rand(0,10) - (ui.selected.cards.length * 5);
							}

							return val;
						},
					})
					.set("targetx", player)
					.forResult();
				if (result.cards) {
					cardsRecord.push([target, result.cards]);
				} else {
					cardsRecord.push([target, []]);
				}
			}

			const dialogs: any[] = ["【雪变】展示的牌"];
			let redCount = 0;
			let shownTargets: Player[] = [];
			const results: [Player, Card[]][] = [];
			//先触发事件,防止展示牌有变
			for (let record of cardsRecord) {
				let result: Partial<Result> | undefined;
				if (record[1].length > 1) {
					result = await record[0].showCards(record[1], `${get.translation(record[0])}展示的牌`, true, false).forResult();
				}

				const cards = result?.cards;
				results.push([record[0], cards ? cards : []]);
			}

			//结算结果
			for (const [target, cards] of results) {
				if (cards.length < 1) {
					dialogs.push(`${get.translation(target)}没有展示牌`);
					continue;
				}
				dialogs.push(`${get.translation(target)}展示的牌`);
				dialogs.push(cards);
				redCount += cards.filter(i => get.color(i) === "red").length;
				shownTargets.push(target);
			}

			//⚠️ 建 dialog 必须把 id 写进 **`videoId`**，不能写 `id`：
			//`get.idDialog(id)` 只按 `dialog.videoId == id` 匹配（`get/index.js:2026-2028`），
			//而 `lib.message.client.closeDialog` 内部也是走 `get.idDialog`（`library/index.js:13734-13739`）。
			//写成 `dialog.id = …` 设的是 DOM 元素的 id 属性，两个查找函数都找不到它，
			//于是 closeDialog 变成空操作，展示框一直留在屏幕上 —— 这就是本技能关不掉 dialog 的原因。
			//正确写法与引擎自带的 `createDialog` 一致：`ui.create.dialog(...).videoId = id`
			//（`library/index.js:13741-13744`）。
			const id = lib.status.videoId++;

			//⚠️ 只在这里建**一次**：`game.broadcastAll` 在非联机模式下会**本地执行一遍**
			//（`game/index.js:1924-1935`），若在闭包外再建一次就会留下两个 dialog，
			//其中一个永远无人回收。所以统一交给 `lib.message.client.createDialog`，
			//它内部会 `ui.create.dialog(...).videoId = id`，本地与多端行为一致。
			//@ts-ignore
			game.broadcastAll("createDialog", id, ...dialogs);

			await game.delay(5);

			//按 videoId 关闭（`lib.message.client.closeDialog` → `get.idDialog`）
			//@ts-ignore
			game.broadcastAll("closeDialog", id);

			if (shownTargets.length === 1 && shownTargets[0] === player) {
				const result = await player
					.chooseTarget({
						forced: true,
						filterTarget(card, player, target) {
							return targets.includes(target) && target !== player;
						},
						ai(target) {
							return get.attitude2(target) < 0 ? Math.random() : -1;
						},
						prompt: "【雪变】:对一名角色造成两点伤害",
					})
					.forResult();
				if (result.targets) {
					result.targets[0].damage({
						num: 2,
						source: player,
					});
					player.line(result.targets);
				}
				return;
			}

			if (redCount > results.map(i => i[1]).flat().length - redCount) {
				const result = await player
					.chooseTarget({
						forced: true,
						filterTarget(card, player, target) {
							const vailds = results.filter(r => r[1].length > 0).map(i => i[0]);
							return vailds.includes(target);
						},
						ai(target) {
							return get.attitude2(target) < 0 ? Math.random() : -1;
						},
						prompt: "【雪变】:对一名角色造成一点伤害并弃置其所有因此展示的牌",
						prompt2: results
							.map(r => {
								let result: string[] = [];
								if (r[1].length > 0) {
									result.push(`${get.translation(r[0])}:${get.translation(r[1].map(i => i.name))}`);
									return result;
								}
								return "TheLeaderOne";
							})
							.filter(i => i !== "TheLeaderOne")
							.join("<br>"),
					})
					.forResult();
				if (result.targets) {
					const target = result.targets[0];
					await target.damage({ source: player, num: 1 });
					const cards = results
						.filter(r => r[0] === target)
						.map(i => i[1])
						.flat();
					await target.discard({ cards });
					player.line(target);
				}
			} else {
				for (const [target, cards] of results) {
					await target.discard({ cards });
				}
			}
		},
		group: "xuebianmrfz_dam",
		subSkill: {
			dam: {
				silent: true,
				charlotte: true,
				trigger: { source: "damageEnd" },
				filter: function (event, player) {
					const evt = event.getParent();
					return evt && evt.name == "xuebianmrfz";
				},
				async content(event, trigger, player) {
					player.addMark("xuebianmrfz", trigger.num, false);
				},
			},
		},
		ai: {
			order: 12,
			expose: 0.1,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	tonghemrfz: {
		audio: ["3星结束行动", "完成高难行动"],
		derivation: ["xinyingshimrfz", "new_xinbangmrfz"],
		skillAnimation: true,
		animationColor: "thunder",
		unique: true,
		juexingji: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter: function (event, player) {
			return player.countMark("xuebianmrfz") >= 2 || game.roundNumber > 2;
		},
		async content(event, trigger, player) {
			player.addMark("xinyingshimrfz", player.countMark("xuebianmrfz"), false);
			player.removeSkill("xuebianmrfz");
			player.addSkill("xinyingshimrfz");
			player.addSkill("new_xinbangmrfz");
			player.loseMaxHp();
			player.recoverTo(player.maxHp);
			player.awakenSkill("tonghemrfz");
		},
		whichway:{
			affiliates:["xinyingshimrfz","new_xinbangmrfz"]
		},
	},
	xinyingshimrfz: {
		audio: ["非3星结束行动", "行动开始"],
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			//@ts-ignore
			return game.hasPlayer(current => lib.skill.xinyingshimrfz.filterTarget(null, player, current));
		},
		filterTarget: function (card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;

			const num = player.countMark("xinyingshimrfz") + 1;
			const max = target.countCards("h");
			const result = await player
				.discardPlayerCard({
					target,
					position: "h",
					forced: true,
					visible: true,
					selectButton: max > num ? num : max,
				})
				.forResult();
			game.log(player, "观看了", target, "的手牌");

			const cards = result.cards;
			if (cards && new Set(cards.map(i => get.suit(i))).size > 1 && game.hasPlayer(c => c !== player && c.countCards("h") > 0)) {
				const result = await player
					.chooseTarget({
						prompt: "【鹰视】:你可以观看一名其他角色的手牌",
						filterTarget(card, player, target) {
							return target !== player && target.countCards("h") > 0;
						},
						ai(target) {
							const targetx: Player = get.event().targetx;
							if (target === targetx) return -1;
							if (get.attitude2(target) > 0) return 1;
							return target.countCards("h") + 1;
						},
					})
					.set("targetx", target)
					.forResult();
				if (result.targets) {
					player.viewHandcards(result.targets[0]);
				}
			}
		},
		ai: {
			order: 13,
			expose: 0.1,
			threaten: 1.1,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	new_xinbangmrfz: {
		audio: ["观看作战记录", "精英化晋升1"],
		frequent: true,
		trigger: { player: "useCardAfter" },
		init(player, skill) {
			player.storage[`${skill}_mark`] = [];
		},
		onremove(player, type) {
			delete player.storage[`${type}_mark`];
		},
		filter: function (event, player) {
			let list: string[] = player.getStorage("new_xinbangmrfz_mark");
			return !list.includes(get.type2(event.card));
		},
		async content(event, trigger, player) {
			const skill = "new_xinbangmrfz_mark";
			if (!player.hasSkill(skill)) player.addTempSkill(skill, { global: "phaseEnd" });
			player.storage[skill].add(get.type2(trigger.card, player));
			const result = await player.draw().forResult();

			if (result.cards) {
				const cards = player.getCards("h");
				if (new Set(cards.slice().map(i => get.suit(i, player))).size === cards.length) {
					const result = await player
						.chooseControl({
							prompt: "【兴邦】:选择你要获得牌的类型",
							controls: ["basic", "equip", "trick"],
							ai(event, player) {
								const used: string[] = player.getStorage("new_xinbangmrfz_mark");
								// let list = ["basic","equip","trick"];
								if (_status.currentPhase !== player) {
									return player.countCards("h", card => ["shan", "tao", "jiu"].includes(get.name(card)!)) > 2 ? ["trick", "equip"].randomGet() : "basic";
								}
								let list = ["basic", "equip", "trick"]
									//手牌中没有的
									.filter(
										type =>
											!player
												.getCards("h")
												.map(i => get.type2(i))
												.includes(type)
									)
									//没使用过的
									.filter(i => !used.includes(i));
								if (list.length > 0) return list.randomGet();
								return ["basic", "equip", "equip", "trick", "trick", "trick"].randomGet();
							},
						})
						.forResult();
					if (result.control) {
						const card = get.cardPile(c => get.type2(c) === result.control);
						if (card) {
							await player.gain({ cards: [card], animate: "gain2" });
						} else {
							player.chat(`牌堆中没有${get.type2(result.control)}牌！`);
						}
					}
				}
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					player.storage[skill] = [];
				},
				intro: {
					content(storage, player, skill) {
						return `·已经使用:${get.translation(storage)}`;
					},
				},
			},
		},
	},
	xuebianmrfz2: {
		silent: true,
		charlotte: true,
	},
	xinbangmrfz2: {
		silent: true,
		charlotte: true,
		onremove(player) {
			delete player.storage.xinbangmrfz2;
		},
	},
});

translate({
	char_172_svrash: "银灰",
	xuebianmrfz: "雪变",
	xuebianmrfz_info: "出牌阶段限一次，你可以选择至多两名其他角色，然后你与其各展示至多三张手牌，并依次执行下列效果：<br>1.若只有你展示了手牌，你对其中一名没有展示手牌的角色造成两点伤害，然后不执行下一项;<br>2.若展示牌的颜色中红色最多，你可以选择对其中一名角色造成一点伤害并令其弃置其展示的牌，反之，所有人各弃置自己展示的牌",
	tonghemrfz: "统合",
	tonghemrfz_info: "觉醒技，准备阶段，若你因【雪变】造成的伤害不少于2或游戏轮数大于2，你减少一点体力上限、失去【雪变】并获得【鹰视】和【兴邦】，然后将体力调整至体力上限。",
	xinyingshimrfz: "鹰视",
	xinyingshimrfz_info: "出牌阶段限一次，你可以观看攻击范围内一名其他角色的手牌并弃置其中的X+1张牌，若你因此弃置了两种花色的牌，你可以观看一名其他角色的手牌。（X=你因【雪变】造成的伤害数）",
	new_xinbangmrfz: "兴邦",
	new_xinbangmrfz_info: "当你于一回合首次使用一种类型的牌后，你摸一张牌，然后若你手牌中没有相同花色的牌，你从牌堆中选择获得一张任意类型的牌。",
});

characterIntro("char_172_svrash", "银灰，谢拉格军阀，喀兰贸易公司董事长，希瓦艾什家族现任族长。在经济贸易、国际政治、外交手腕与战术策划上有独到见解。于罗德岛的部分行动中提供战略支援。鉴于其实际目的不明、合作态度暧昧等理由，建议在交流中持保守态度以杜绝额外风险。");

characterTitle("char_172_svrash", "变革之风");
