import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yinhuimrfz", {
			sex: "male",
			group: "xiemrfz",
			hp: 4,
			skills: ["xuebianmrfz","tonghemrfz"],
		});

skill({
	"xuebianmrfz": {
			intro: {
				content: "已造成#点伤害",
			},
			onremove: true,
			audio: 2,
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
			check: function () {
				return -1;
			},
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let result;
				const targets = event.targets;

				// step 0
				event.cards1 = [];
				event.cards2 = [];
				event.cards3 = [];
				for (const t of targets) {
					t.addTempSkill("xuebianmrfz2", { player: "phaseEnd" });
				}
				targets.push(player);
				targets.sortBySeat();

				const next = player
					.chooseCardOL(targets, "请选择要展示的牌", true, [1, 3])
					.set("ai", card => {
						return -get.value(card);
					})
					.set("source", player);
				next.aiCard = function (target) {
					const hs = target.getCards("h");
					return { bool: true, cards: [hs.randomGet()] };
				};
				next._args.remove("glow_result");

				result = await next.forResult();

				// step 1
				const cards = [];
				let num = 0;
				event.videoId = lib.status.videoId++;

				for (let i = 0; i < targets.length; i++) {
					for (let j = 0; j < result[i].cards.length; j++) {
						cards.push(result[i].cards[j]);
					}
				}
				event.cards = cards;
				game.log(player, "展示了", targets, "的", cards);

				game.broadcastAll(
					function (targets, cards, id, player) {
						var dialog = ui.create.dialog(get.translation(player) + "发动了【雪变】", cards);
						//@ts-ignore
						dialog.videoId = id;
						var getName = function (target) {
							if (target._tempTranslate) return target._tempTranslate;
							var name = target.name;
							if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
							return get.translation(name);
						};
						for (var i = 0; i < targets.length; i++) {
							if (i === 0) event.cards1 = result[i].cards;
							if (i === 1) event.cards2 = result[i].cards;
							if (i === 2) event.cards3 = result[i].cards;
							for (var j = 0; j < result[i].cards.length; j++) {
								var btnIndex = j;
								if (i === 1) btnIndex += result[i - 1].cards.length;
								else if (i === 2) btnIndex += result[i - 2].cards.length + result[i - 1].cards.length;
								//@ts-ignore
								dialog.buttons[btnIndex].querySelector(".info").innerHTML = getName(targets[i]);
								if (get.color(result[i].cards[j]) === "red") num++;
								else num--;
							}
						}
					},
					targets,
					cards,
					event.videoId,
					player
				);

				await game.delay(4);

				if (num > 0) {
					result = await player
						.chooseTarget("【雪变】：你可以对其中一名角色造成一点伤害并令其弃置其展示的牌", (card, player, target) => {
							return target !== player && target.hasSkill("xuebianmrfz2");
						})
						.set("ai", target => {
							const aiPlayer = _status.event.player;
							return get.attitude(aiPlayer, target) < 0;
						})
						.forResult();
					// event.targets = result;
				} else {
					for (let i = 0; i < targets.length; i++) {
						targets[i].discard(result[i].cards);
					}
				}

				// step 2
				const list = [event.cards1, event.cards2, event.cards3];
				//@ts-ignore
				game.broadcastAll("closeDialog", event.videoId);

				if (result?.targets) {
					const selectedTarget = result.targets[0];
					await selectedTarget.damage();
					let cardsToDiscard = [];
					for (let i = 0; i < targets.length; i++) {
						if (targets[i] === selectedTarget) {
							cardsToDiscard = list[i];
							break;
						}
					}
					if (cardsToDiscard && cardsToDiscard.length) {
						selectedTarget.discard(cardsToDiscard);
					}
				}
			},
			group: "xuebianmrfz_dam",
			subSkill: {
				dam: {
					silent: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						//@ts-ignore
						return event.getParent().name == "xuebianmrfz";
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
	"tonghemrfz": {
			audio: 2,
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
		},
	"xinyingshimrfz": {
			audio: "yingshimrfz",
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
				if (max > num) return player.discardPlayerCard(num, target, "h", true, "visible");
				if (num >= max) return player.discardPlayerCard(max, target, "h", true, "visible");
				game.log(player, "观看了", target, "的手牌");
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
	"new_xinbangmrfz": {
			audio: "xinbangmrfz",
			frequent: true,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				var list = player.getStorage("xinbangmrfz2");
				if (!list.includes(get.type2(event.card, player))) return true;
				return false;
			},
			async content(event, trigger, player) {
				if (!player.storage.xinbangmrfz2) {
					player.addTempSkill("xinbangmrfz2");
					player.storage.xinbangmrfz2 = [];
				}
				player.storage.xinbangmrfz2.add(get.type2(trigger.card, player));
				const result = await player.draw().forResult();

				if (result.cards) {
					const card = result.cards[0],
						cards = player.getCards("h"),
						list = [];
					for (var i of cards) {
						if (i == card) continue;
						list.add(get.suit(i, player));
					}
					if (!list.includes(get.suit(card, player))) player.draw();
				}
			},
		},
});

translate({
	"yinhuimrfz": "银灰",
	"xuebianmrfz": "雪变",
	"xuebianmrfz_info": "出牌阶段限一次，你可以至多选择两名其他角色，然后你与其各展示至多三张手牌，若展示牌的颜色中红色最多，你可以选择对其中一名角色造成一点伤害并令其弃置其展示的牌，反之，所有人各弃置自己展示的牌。",
	"tonghemrfz": "统合",
	"tonghemrfz_info": "觉醒技，准备阶段，若你因【雪变】造成的伤害不少于2或游戏轮数大于2，你减少一点体力上限、失去【雪变】并获得【鹰视】和【兴邦】，然后将体力调整至体力上限。",
	"xinyingshimrfz": "鹰视",
	"xinyingshimrfz_info": "出牌阶段限一次，你可以观看攻击范围内一名其他角色的手牌并弃置其中的X+1张牌。（X=你因【雪变】造成的伤害数）",
	"new_xinbangmrfz": "兴邦",
	"new_xinbangmrfz_info": "出牌阶段，当你使用的牌结算完毕后，若你是于此阶段第一次使用此种类型的牌，你可以摸一张牌，若你手牌中没有与你摸的牌的花色相同的牌，你摸一张牌。",
});

characterIntro("yinhuimrfz", "银灰，谢拉格军阀，喀兰贸易公司董事长，希瓦艾什家族现任族长。在经济贸易、国际政治、外交手腕与战术策划上有独到见解。于罗德岛的部分行动中提供战略支援。鉴于其实际目的不明、合作态度暧昧等理由，建议在交流中持保守态度以杜绝额外风险。");
