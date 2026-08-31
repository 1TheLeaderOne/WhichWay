import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("shanlingmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "shimrfz",
			hp: 4,
			skills: ["yubimrfz","jiushumrfz","lichangmrfz"],
		});

skill({
	"lichangmrfz": {
			marktext: "屏障",
			markimage: "extension/WhichWay/image/skill/slmrfzimage.png",
			intro: {
				name: "屏障",
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 6,
			enable: "phaseUse",
			filter: function (event, player) {
				return (
					player.countCards("h") > 0 &&
					game.hasPlayer(function (current) {
						return !current.hasSkill("lichangmrfz2");
					})
				);
			},
			filterTarget: function (card, player, target) {
				return !target.hasSkill("lichangmrfz2");
			},
			filterCard: true,
			lose: false,
			discard: false,
			delay: 0,
			check: function (card) {
				var player = _status.event.player;
				if (
					player.countCards("h", function (card) {
						return get.type(card) == "equip";
					}) > 0
				)
					return get.type(card) == "equip";
				return 6 - get.value(card);
			},
			prompt: `请选择一张牌`,
			position: "he",
			async content(event, trigger, player) {
				const { target, cards } = event;

				target.addTempSkill("lichangmrfz2");
				target.addToExpansion(cards, target, "giveAuto").gaintag.add("lichangmrfz");
				if (get.type(cards[0]) == "equip" && target.hujia < 5) target.changeHujia();
				if (target.hujia < 5) target.changeHujia();
			},
			group: ["lichangmrfz_rem", "lichangmrfz_dam", "lichangmrfz_da"],
			subSkill: {
				rem: {
					audio: "lichangmrfz",
					chargeSkill: true,
					forced: true,
					trigger: { global: "gainAfter" },
					filter: function (event, player) {
						//@ts-ignore
						if (event.getParent(1).name != "lichangmrfz_dam") return false;
						return (
							event.fromStorage == true ||
							game.hasPlayer2(function (current) {
								var evt = event.getl(current);
								return evt && evt.xs && evt.xs.length > 0;
							})
						);
					},
					async content(event, trigger, player) {
						player.addMark("charge");
						//var str='';
						//str+=get.translation(event)+'</br>';
						//for(var i=1;i<=10;i++) str+=get.translation(event.getParent(i))+'</br>';
						//game.log(str);
						//player.popup(str);
					},
				},
				dam: {
					audio: "lichangmrfz",
					forced: true,
					trigger: { global: "damageEnd" },
					filter: function (event, player) {
						return event.hujia && event.player.getExpansions("lichangmrfz").length > 0;
					},
					async content(event, trigger, player) {
						var cards = trigger.player.getExpansions("lichangmrfz");
						trigger.player.gain(cards, "gain2");
					},
				},
				da: {
					trigger: { global: "phaseBegin" },
					filter: function (event, player) {
						return player.countMark("charge") >= 3;
					},
					direct: true,
					async content(event, trigger, player) {
						let result;

						// step 0
						result = await player
							.chooseTarget(get.prompt("lichangmrfz"), "【力场】:你可以选择三名角色，令其各从牌堆或弃牌堆中获得一张装备牌", [1, 3])
							.set("ai", target => {
								return get.attitude(player, target) > 0;
							})
							.forResult();

						// step 1
						if (result.targets) {
							player.removeMark("charge", player.countMark("charge"));
							//@ts-ignore
							player.logSkill("lichangmrfz");
							event.targets = result.targets;
							event.num = 0;
							event.num2 = result.targets.length;
						} else {
							return;
						}

						// step 2 & 3 loop (original event.goto(2))
						while (event.num < event.num2) {
							// step 2
							const card = get.cardPile(c => {
								return get.type(c) === "equip";
							});
							//@ts-ignore
							event.card = card;
							const list = game.filterPlayer(target => {
								return target !== player && target.hasSkill("lichangmrfz");
							});
							let str = "【力场】:你可以将此牌交给" + get.translation(list);
							if (list.length > 1) str += "其中一人";
							str += ",或取消自己装备此牌";

							const currentTarget = event.targets[event.num];

							await currentTarget.gain(card, "gain");

							result = await currentTarget
								.chooseTarget(str, (card, player, target) => {
									return target !== currentTarget && target.hasSkill("lichangmrfz");
								})
								.set("ai", target => {
									if (get.attitude(currentTarget, target) <= 0) return 0;
									return get.attitude(currentTarget, target) >= 0;
								})
								.forResult();

							// step 3
							const hasCard = currentTarget.hasCard(c => {
								return c === event.card;
							}, "h");

							if (result.bool) {
								if (hasCard) {
									//@ts-ignore
									await currentTarget.give(event.card, player);
								}
								await currentTarget.recover();
							} else if (hasCard) {
								await currentTarget.chooseUseTarget(event.card, true);
							}

							event.num++;
						}
					},
				},
			},
			ai: {
				threaten: 1.2,
				order: function () {
					var player = _status.event.player;
					if (player.hp <= 2) return 13;
					return 1;
				},
				result: {
					player: 1,
					target: 1,
				},
			},
		},
	"jiushumrfz": {
			audio: 2,
			enable: "chooseToUse",
			filter: function (event, player) {
				if (
					player.countCards("he", function (card) {
						return get.color(card) == "black";
					}) == 0
				)
					return false;
				return player.isPhase("phaseJudge", false) || player.isPhase("phaseZhunbei", false);
			},
			filterCard: function (card) {
				return get.color(card) == "black";
			},
			viewAsFilter: function (player) {
				if (!player.isPhase("phaseJudge", false) && !player.isPhase("phaseZhunbei", false)) return false;
				return player.countCards("he", { color: "black" }) > 0;
			},
			viewAs: { name: "wuxie" },
			position: "he",
			prompt: "将一张黑色牌当无懈可击使用",
			check: function (card) {
				var tri = _status.event.getTrigger();
				if (tri && tri.card && tri.card.name == "chiling") return -1;
				return 8 - get.value(card);
			},
		},
	"yubimrfz": {
			global: "yubimrfz_eff",
			subSkill: {
				eff: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + Math.min(player.hujia, 5);
						},
					},
				},
			},
		},
});

translate({
	"shanlingmrfz": "闪灵",
	"lichangmrfz": "力场",
	"lichangmrfz_info": "①出牌阶段每一名角色限一次，你可以选择一名角色，你将一张牌置于其武将牌上，称为“屏障”，然后其获得一点护盾值（至多为5），若此牌为装备牌，其额外获得一点护盾值（至多为5）；锁定技，有‘屏障’的角色受到后，若其护盾减少了，其获得其武将牌上的所有‘屏障’牌。②蓄力技（0/3），锁定技，场上的‘屏障’减少时，此技能增加一点蓄力值；一名角色回合开始时，若你有至少3点蓄力值，你可以消耗所有蓄力值并选择至多三名其他角色，然后被你选定的角色各从牌堆或弃牌堆中获得一张装备牌，其可以将此牌交给你并回复一点体力，否则其使用之。",
	"jiushumrfz": "救赎",
	"jiushumrfz_info": "一名角色的准备或者判定阶段，你可以将你的任意一张黑色牌当做【无懈可击】使用。",
	"yubimrfz": "御庇",
	"yubimrfz_info": "锁定技，场上所有角色的手牌上限+X。（X为其的护盾值，X至多为5）",
});

characterIntro("shanlingmrfz", "闪灵，萨卡兹医师，前萨卡兹医疗组织“赦罪师”成员，感染者援助团体“使徒”的一员。于源石技艺、战场急救、医学理论、临床医学等领域拥有渊博知识。</br>现作为医疗干员为罗德岛医疗部门提供源石技艺理论，并为多项行动提供战场医疗救护服务。");
