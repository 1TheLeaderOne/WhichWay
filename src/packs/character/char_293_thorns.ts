import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";

character("char_293_thorns", { pack: "legendSJZX", sex: "male", group: "yimrfz", hp: 4, skills: ["jihumrfz", "re_jianshumrfz"] });

skill({
	jihumrfz: {
		audio: ["作战中1", "作战中3"],
		intro: {
			content: "荆棘护身",
		},
		trigger: { player: "phaseDrawAfter" },
		check: function (event, player) {
			if(player.skipList.includes("phaseUse")) return true;
			let val = 0;
			for(let card of player.getCards("hs",card=>player.hasUseTarget(card))){
				if(["trick","basic"].includes(get.type2(card))) val += 2;
				if(get.type2(card) === "equip") val += 1; 
			}
			return val >= 3;
		},
		async content(event, trigger, player) {
			// if (!player.hasMark("jihumrfz")) player.addMark("jihumrfz", 1, false);
			player.addTempSkill("jihumrfz_effect",{player:"phaseEnd"});
			player.addTempSkill("jihumrfz_buff",{player:"phaseBeginStart"});
			player.skip("phaseDiscard");
		},
		subSkill: {
			effect: {
				charlotte: true,
				silent: true,
				mod: {
					playerEnabled(card, player, target) {
						if (player != target) {
							return false;
						}
					},
				},
				intro:{
					content:"·不能对其他角色使用牌<br>·跳过弃牌阶段"
				},
			},
			buff: {
				trigger: { target: "useCardToTargeted" },
				usable: 1,
				filter: function (event, player) {
					if (get.type(event.card) == "delay" || get.type(event.card) == "equip") return false;
					// if (!player.hasMark("jihumrfz")) return false;
					return (
						event.player != player &&
						(player.canUse(event.card, event.player, false) ||
							game.hasPlayer(function (current) {
								return (
									//@ts-ignore
									current != player && get.distance(player, current) <= 1 && !!player.canUse(event.card, current, true)
								);
							}))
					);
				},
				prompt(event, player) {
					return `是否发动【棘护】？`;
				},
				prompt2(event, player) {
					const targets = [event.player, ...game.players.filter(i => get.distance(player, i) <= 1)].filter(i => player.canUse(event.card, i, false, true));
					return `你可以对${get.translation(targets)}中的一名角色视为使用一张${get.translation(get.name(event.card))}`;
				},
				check() {
					const event = get.event();
					const player = get.player();
					const { card, player: target } = event;
					const targets = [target, ...game.players.filter(i => get.distance(player, i) <= 1)].filter(i => player.canUse(event.card, i, false, true));
					return targets.some(t => get.effect(t, card, player, player) > 0);
				},
				async content(event, trigger, player) {
					const targets = [trigger.player, ...game.players.filter(i => get.distance(player, i) <= 1)].filter(i => player.canUse(event.card, i, false, true));
					const card = get.autoViewAs({ name: get.name(trigger.card) });
					await player.chooseUseTarget({
						forced: true,
						card,
						filterTarget(card, player, target) {
							return targets.includes(target);
						},
						ai(target) {
							return get.effect(target, card, player, player);
						},
						addCount: false,
						nodistance: true,
					});
				},
			},
		},
	},
	re_jianshumrfz: {
		audio: ["作战中4", "作战中2"],
		derivation: ["re_chaoshengmrfz"],
		intro: {
			content: function (event, player) {
				let num = player.countMark("re_jianshumrfz");
				if (num == 20) return "出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
				else if (num >= 10) return "已累计指定" + num + "次</br>出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
				return "已累计指定" + num + "次";
			},
		},
		direct: true,
		trigger: { player: "useCardToTargeted" },
		filter: function (event, player) {
			return player.countMark("re_jianshumrfz") < 20;
		},
		async content(event, trigger, player) {
			await player.addMark("re_jianshumrfz", 1, false);

			const num = player.countMark("re_jianshumrfz");
			if (num % 10 == 0) {
				//@ts-ignore
				player.logSkill("jianshumrfz");
				//--第一次使用至高之术--//
				if (num == 10) {
					player.addSkill("re_jianshumrfz_usesha");
					player.addMark("re_jianshumrfz_time", 1, false);
					player.addMark("re_jianshumrfz_draw", 1, false);
					player.addMark("re_jianshumrfz_range", 1, false);
				}
				//--第二次使用至高之术--//
				if (num == 20) {
					player.addMark("re_jianshumrfz_time", 1, false);
					player.addMark("re_jianshumrfz_range", 1, false);
					player.removeSkill("jihumrfz");
					player.addSkill("re_chaoshengmrfz");
				}
			}
		},
		group: ["re_jianshumrfz_time", "re_jianshumrfz_range", "re_jianshumrfz_draw"],
		subSkill: {
			time: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + player.countMark("re_jianshumrfz_time");
					},
				},
			},
			range: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange: function (player, num) {
						return num + player.countMark("re_jianshumrfz_range");
					},
				},
			},
			draw: {
				silent: true,
				direct: true,
				charlotte: true,
				trigger: { player: "phaseDrawBegin2" },
				filter: function (event, player) {
					return player.hasMark("re_jianshumrfz_draw");
				},
				async content(event, trigger, player) {
					trigger.num++;
					//@ts-ignore
					player.logSkill("jianshumrfz");
				},
			},
			usesha: {
				direct: true,
				trigger: { player: "phaseUseBegin" },
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget({
							prompt: "选择一名其他角色视为对其使用一张【杀】",
							filterTarget: function (card, player, target) {
								return target != player && player.inRange(target);
							},
						})
						.set("ai", target => -get.attitude(player, target))
						.forResult();

					if (result.targets) {
						const target = result.targets[0];
						player.useCard({ card: get.autoViewAs({ name: "sha" }), targets: [target], addCount: false });
						//@ts-ignore
						player.logSkill("jianshumrfz");
					}
				},
			},
		},
	},
	re_chaoshengmrfz: {
		audio: ["行动开始", "选中干员1"],
		trigger: { player: "phaseEnd" },
		filter: function (event, player) {
			return !player.getStat("damage");
		},
		frequent: true,
		async content(event, trigger, player) {
			player.draw(2);
			player.recover();
		},
	},
});

translate({
	char_293_thorns: "棘刺",
	jihumrfz: "棘护",
	jihumrfz_info: "摸牌阶段结束时，你可以令本回合不能对其他角色使用牌并跳过弃牌阶段，直到你下一个回合开始，你获得以下效果：每回合限一次，当你成为其他角色的基本或者非延时锦囊牌的目标后，你可以视为对该角色或与你距离为1的角色使用相同牌名的牌。",
	re_jianshumrfz: "剑术",
	re_jianshumrfz_info: "锁定技，每当你使用的牌指定的目标数累计达到10的整数倍时，你依次获得以下效果：①摸牌阶段摸牌数、【杀】的使用次数和攻击距离各+1，出牌阶段开始时，你可以视为使用一张【杀】（不计入次数）②【杀】的使用次数和攻击距离各+1，失去【棘护】并获得【潮声】。",
	re_chaoshengmrfz: "潮声",
	re_chaoshengmrfz_info: "结束阶段，若你本回合没有造成过伤害，你可以摸两张牌并恢复一点体力。",
});

characterIntro("char_293_thorns", "精通剑术与药剂制作的罗德岛前线作战干员，棘刺。出身于伊比利亚腹地，于当地宗教局势动荡中离开家乡，在脱离伊比利亚地区后，受邀来到罗德岛。</br>以上关于伊比利亚境内局势的部分为棘刺自述，尚未完全经过考证。");

dynamicTranslate("chaoshengmrfz", function (player) {
	if (player.countMark("jianshumrfz") == 15) return "结束阶段，若你连续<span class=thundertext>1</span>个回合没有造成过伤害，你可以摸两张牌并回复一点体力。";
	return "结束阶段，若你连续<span class=thundertext>" + (player.countMark("jianshumrfz") >= 10 && player.countMark("jianshumrfz") < 15 ? "2" : 3 - Math.floor(player.countMark("jianshumrfz") / 5)) + "</span>个回合没有造成过伤害，你可以选择摸两张牌或回复一点体力。";
});

characterTitle("char_293_thorns","至高之术");