import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("kanielianmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "laimrfz",
			hp: 3,
			skills: ["shazhenmrfz","shacanmrfz","shahuanmrfz"],
		});

skill({
	"shazhenmrfz": {
			audio: 2,
			forced: true,
			mark: true,
			init: function (player) {
				player.storage.shazhenmrfz = false;
				player.syncStorage("shazhenmrfz");
			},
			intro: {
				content: function (storage, player, skill) {
					if (!player.storage.shazhenmrfz || game.roundNumber == 1)
						return "沙暴环绕着卡涅利安</br>【沙阵】剩余次数：" + (2 - player.countMark("shazhenmrfz_damage"));
					return "沙暴散去";
				},
			},
			onremove: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return (game.roundNumber == 1 || !player.storage.shazhenmrfz) && player.countMark("shazhenmrfz_damage") < 2;
			},
			async content(event, trigger, player) {
				trigger.num--;
				player.addMark("shazhenmrfz_damage", 1);
			},
			mod: {
				maxHandcardBase: function (player, num) {
					if (!player.storage.shazhenmrfz) return (num += 2);
				},
			},
			group: ["shazhenmrfz_damage", "shazhenmrfz_clear"],
			subSkill: {
				damage: {
					forced: true,
					silent: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !event.player.hasMark("shacanmrfz");
					},
					async content(event, trigger, player) {
						player.storage.shazhenmrfz = true;
					},
				},
				clear: {
					forced: true,
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.shazhenmrfz || player.countMark("shazhenmrfz_damage") > 0;
					},
					async content(event, trigger, player) {
						player.storage.shazhenmrfz = false;
						player.removeMark("shazhenmrfz_damage", player.countMark("shazhenmrfz_damage"));
					},
				},
			},
		},
	"shacanmrfz": {
			marktext: "噬",
			intro: {
				name: "噬",
				content: function (storage, player, skill) {
					return (
						"<span class=firetext>食噬之印</span></br>还需交给卡涅利安" +
						(2 - player.countMark("shacanmrfz2")) +
						"张牌即可消除一个‘噬’标记"
					);
				},
			},
			onremove: true,
			trigger: { source: "damageEnd" },
			audio: 2,
			filter: function (event, player) {
				return event.player.isAlive() && event.player.countMark("shacanmrfz") < 2;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.player) + "获得一个‘噬’标记";
			},
			check: function (event, player) {
				return get.attitude(player, event.player) <= 0;
			},
			async content(event, trigger, player) {
				trigger.player.addMark("shacanmrfz");
			},
			group: ["shacanmrfz_remove", "shacanmrfz_gain"],
			subSkill: {
				remove: {
					forced: true,
					charlotte: true,
					silent: true,
					trigger: { player: "gainEnd" },
					filter: function (event, player) {
						return event.source && event.source.isAlive() && event.source != player && event.source.hasMark("shacanmrfz");
					},
					logTarget: "source",
					async content(event, trigger, player) {
						var target = trigger.source;
						var num = target.countMark("shacanmrfz2");
						target.addMark("shacanmrfz2", trigger.cards.length, false);
						if (num > 1) {
							target.removeMark("shacanmrfz", Math.floor(num / 2));
							target.removeMark("shacanmrfz2", Math.floor(num / 2) * 2);
						}
					},
				},
				gain: {
					trigger: { global: "phaseUseBegin" },
					filter: function (event, player) {
						return event.player.hasMark("shacanmrfz") && (player.getDamagedHp() > 0 || event.player.countCards("he") > 0);
					},
					direct: true,
					charlotte: true,
					async content(event, trigger, player) {
						var target = trigger.player;
						var list = [];
						if (player.getDamagedHp() > 0) list.add("回血");
						if (target.countCards("he") > 0) list.add("交牌");
						const result = await target
							.chooseControl(list)
							.set("prompt", "选择一项")
							.set("ai", function (player) {
								return 0;
							})
							.forResult();
						if (result.control == "cancel2") event.finish();
						if (result.control == "回血") {
							player.recover();
							target.removeMark("shacanmrfz");
							//@ts-ignore
							player.logSkill("shacanmrfz");
							event.finish();
						}
						if (result.control == "交牌") {
							const resultx = await target
								.chooseCard(target.countCards("he") > 1 ? 2 : 1, "展示两张牌", true, "he")
								.set("ai", function (card) {
									return get.value(card);
								})
								.forResult();
							if (resultx.bool && resultx.cards && resultx.cards.length) {
								if (resultx.cards.length == 1) {
									player.gain(resultx.cards, target, "give");
									//@ts-ignore
									player.logSkill("shacanmrfz");
									return;
								} else {
									const resulty = await player
										.chooseButton(["选择获得其中的一张牌", result.cards], true)
										.set("ai", button => get.value(button.link))
										.forResult();
									player.gain(result.links, target, "give");
									//@ts-ignore
									player.logSkill("shacanmrfz");
								}
							}
						}
					},
				},
			},
		},
	"shahuanmrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return target != player && target.countMark("shacanmrfz") < 1;
			},
			async content(event, trigger, player) {
				event.target.addMark("shacanmrfz");
			},
			ai: {
				order: 10,
				expose: 0.4,
				result: {
					target: -1,
				},
				threaten: 2,
			},
		},
});

translate({
	"kanielianmrfz": "卡涅利安",
	"shazhenmrfz": "沙阵",
	"shazhenmrfz_info": "锁定技，若你本轮没有造成伤害或本轮为第一轮，则你本轮前两次受到的伤害-1且你的手牌上限+2。",
	"shacanmrfz": "沙喰",
	"shacanmrfz_info": "①你对其他角色造成伤害时，你可以令其获得一个“噬”标记（每名角色至多拥有两个“噬”）。②当有“噬”的角色出牌阶段开始时，其选择一项：1.令你观看其两张牌，然后你获得其中一张牌；2.令你回复一点体力，移除一个“噬”。③锁定技，你对有“噬”的角色造成的伤害不计入【沙阵】；每当你累计获得有“噬”的角色的两张牌时，其移除一个“噬”。",
	"shahuanmrfz": "沙环",
	"shahuanmrfz_info": "出牌阶段，你可以令一名没有‘噬’标记的其他角色获得一个‘噬’。",
});

characterIntro("kanielianmrfz", "卡涅利安，出身萨尔贡深处不受王酋管辖的某个古老部族，目前外出游学中。因接受莱塔尼亚霍恩洛厄伯爵的雇佣，作为其侍从长期停留于莱塔尼亚地区。现与罗德岛达成合作关系，作为干员为罗德岛执行莱塔尼亚境内的相关任务。");
