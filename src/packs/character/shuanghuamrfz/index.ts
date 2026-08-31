import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("shuanghuamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["tadianmrfz","xinjimrfz"],
		});

skill({
	"tadianmrfz": {
			markimage: "extension/WhichWay/image/skill/shuanghuajiazimrfz.png",
			intro: {
				markcount: "expansion",
				mark: function (dialog, content, player) {
					content = player.getExpansions("tadianmrfz");
					if (content && content.length) {
						if (player == game.me || player.isUnderControl()) {
							dialog.addAuto(content);
						} else {
							return "共有" + get.cnNumber(content.length) + "张踏垫";
						}
					}
				},
				content: function (content, player) {
					content = player.getExpansions("tadianmrfz");
					if (content && content.length) {
						if (player == game.me || player.isUnderControl()) {
							return get.translation(content);
						}
						return "共有" + get.cnNumber(content.length) + "张踏垫";
					}
				},
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 2,
			trigger: { global: "roundStart" },
			forced: true,
			async content(event, trigger, player) {
				if (player.getExpansions("tadianmrfz").length > 0) {
					await player.gain(player.getExpansions("tadianmrfz"), "gain2");
				}

				await player.draw(3);
				const result = await player
					.chooseCard(true, 3, "【踏垫】:请选择将三张手牌置于你武将牌上")
					.set("ai", function (card) {
						return 8 - get.value(card);
					})
					.forResult();

				if (result.cards) {
					player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("tadianmrfz");
				}
			},
			group: "tadianmrfz_tri",
			subSkill: {
				rec: {
					trigger: { player: "dyingAfter" },
					silent: true,
					charlotte: true,
					async content(event, trigger, player) {
						player.recover();
						player.removeSkill("tadianmrfz_rec");
					},
				},
				tri: {
					audio: "tadianmrfz",
					trigger: {
						target: "useCardToTargeted",
					},
					filter: function (event, player) {
						if (!event.card || player.getExpansions("tadianmrfz").length < 1) return false;
						return (
							player.getExpansions("tadianmrfz").filter(function (magic) {
								return magic.name == event.card.name;
							}).length > 0
						);
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 0;
					},
					prompt: function (event, player) {
						return "【踏垫】:是否弃置一张‘踏垫’，令" + get.translation(event.player) + "流失所有体力？";
					},
					async content(event, trigger, player) {
						//@ts-ignore
						const cards = player.getExpansions("tadianmrfz").filter(function (magic) {
							return get.name(magic) == get.name(trigger.card);
						});
						if (!cards.length) return;
						const result = await player
							.chooseButton(["你可以选择移去一张与其使用的牌的牌名相同的“踏垫”，令其流失所有体力", cards])
							.forResult();

						if (result.links) {
							player.loseToDiscardpile(result.links);
							player.draw(3);
							trigger.player.loseHp(trigger.player.hp);
							trigger.player.addSkill("tadianmrfz_rec");
						}
					},
				},
			},
		},
	"xinjimrfz": {
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			direct: true,
			filter: function (event, player) {
				return player.getExpansions("tadianmrfz").length > 0 && player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const cards = player.getExpansions("tadianmrfz");
				if (!cards.length || !player.countCards("h")) {
					return;
				}
				const next = player.chooseToMove("【踏垫】：是否交换“踏垫”和手牌？");
				next.set("list", [
					[get.translation(player) + "（你）的‘踏垫’", cards],
					["手牌区", player.getCards("h")],
				]);
				next.set("filterMove", function (from, to) {
					return typeof to != "number";
				});
				next.set("processAI", function (list) {
					var player = _status.event.player,
						cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
							return get.value(a) - get.value(b);
						}),
						cards2 = cards.splice(0, player.getExpansions("tadianmrfz").length);
					return [cards2, cards];
				});

				const result = await next.forResult();

				if (result.moved) {
					var pushs = result.moved[0],
						gains = result.moved[1];
					pushs.removeArray(player.getExpansions("tadianmrfz"));
					gains.removeArray(player.getCards("h"));
					if (!pushs.length || pushs.length != gains.length) return;
					//@ts-ignore
					player.logSkill("tadianmrfz");
					player.addToExpansion(pushs, player, "giveAuto").gaintag.add("tadianmrfz");
					game.log(player, "交换了手牌区与‘踏垫’的牌");
					player.gain(gains, "draw");
				}
			},
		},
});

translate({
	"shuanghuamrfz": "霜华",
	"tadianmrfz": "踏垫",
	"tadianmrfz_info": "①锁定技，每轮开始时，你摸三张牌并获得场上所有的‘踏垫’，然后将三张手牌置于你的武将牌（其他角色不可见）上，称之为‘踏垫’。②当你成为其他角色使用牌的目标后，你可以弃置一张与其使用的牌的牌名相同的‘踏垫’并摸三张牌，然后其流失所有体力，其脱离濒死状态后回复一点体力。",
	"xinjimrfz": "心机",
	"xinjimrfz_info": "准备阶段，你可以用任意数量的手牌交换‘踏垫’。",
});

characterIntro("shuanghuamrfz", "霜华，彩虹小队成员之一，坚定、专注、充满活力，擅长在野外环境作战。</br>除了自身携带的枪械外，霜华携带了SterlingMK2机械夹板“迎宾踏垫”，通过精妙布设，对敌方造成阻碍，为整个小队提供战术支持。");
