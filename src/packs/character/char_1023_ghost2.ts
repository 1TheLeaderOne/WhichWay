import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";

character("char_1023_ghost2", { pack: "legendSJZX", sex: "female", group: "liemrfz", hp: 3, skills: ["xinyongwomrfz", "douzhengmrfz", "shensuimrfz", "tongmaimrfz"], clans: ["深海猎人"] });

skill({
	xinyongwomrfz: {
		audio: ["选中干员1","选中干员2"],
		zhuanhuanji: true,
		locked: false,
		mark: true,
		marktext: "☯",
		intro: {
			content: function (storage, player, skill) {
				if (player.storage.xinyongwomrfz) return "阳：当你进入濒死状态时，你可以回复至一点体力";
				return "阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害";
			},
		},
		init: function (player) {
			player.storage.xinyongwomrfz = true;
		},
		trigger: { player: "dying" },
		filter: function (event, player) {
			return player.storage.xinyongwomrfz;
		},
		prompt: "【拥我】：是否将体力回复至1点",
		async content(event, trigger, player) {
			player.recoverTo(1);
			player.changeZhuanhuanji("xinyongwomrfz");
		},
		group: "xinyongwomrfz_ying",
		subSkill: {
			//阴
			ying: {
				audio: "xinyongwomrfz",
				trigger: { player: "turnOverAfter" },
				filter: function (event, player) {
					return event.player.isTurnedOver() && !player.storage.xinyongwomrfz;
				},
				prompt: "【拥我】：你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。",
				check: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && get.attitude(player, current) < 0;
					});
				},
				async content(event, trigger, player) {
					let result;
					let choice = 0;
					let max = 0;

					// step 0
					for (let i = 0; i < game.players.length; i++) {
						const target = game.players[i];
						let tmp1 = 0;
						if (target === player) continue;
						if (!player.inRange(target)) continue;
						if (get.attitude(player, target) > 0) continue;
						if (target.countCards("e") > 0) tmp1++;
						if (target.countCards("h") > 0) tmp1++;
						if (target.countCards("j") > 0) tmp1--;
						if (tmp1 > max) max = tmp1;
					}
					if (
						game.hasPlayer(current => {
							return current !== player && get.attitude(player, current) < 0 && current.hp <= 1;
						}) ||
						max < 2
					)
						choice = 1;

					await player.draw(2);

					result = await player
						.chooseControl()
						.set("choiceList", ["弃置你攻击范围内一名其他角色区域内各一张牌", "对你攻击范围内的一名其他角色造成一点伤害"])
						.set("ai", () => {
							return choice;
						})
						.forResult();

					// step 1
					const index = result.index;
					if (
						game.hasPlayer(current => {
							return current !== player && player.inRange(current);
						})
					) {
						result = await player
							.chooseTarget({
								prompt: "【拥我】:请选择一名其他角色",
								forced: true,
								filterTarget: (rd, player, target) => {
									return target !== player && player.inRange(target);
								},
							})
							.set("ai", target => {
								const aiPlayer = _status.event.player;
								const att = get.attitude(aiPlayer, target);
								if (choice === 0) {
									if (target.countCards("e") > 0) return att < 0 && target.countCards("e") > 0;
									else return att < 0;
								} else return get.damageEffect(target, aiPlayer, aiPlayer) > 0;
							})
							.forResult();
					} else {
						return;
					}

					// step 2
					if (result.targets) {
						const target = result.targets[0];
						if (index === 0) {
							let num = 0;
							if (target.countCards("h")) num++;
							if (target.countCards("e")) num++;
							if (target.countCards("j")) num++;
							if (num) {
								await player.discardPlayerCard({ target, selectButton: num, position: "hej", forced: true }).set("filterButton", button => {
									for (let i = 0; i < ui.selected.buttons.length; i++) {
										//@ts-ignore
										if (get.position(button.link) === get.position(ui.selected.buttons[i].link)) return false;
									}
									return true;
								});
							}
						} else {
							await target.damage();
						}
						//@ts-ignore
						player.logSkill("yongwomrfz", target);
						player.changeZhuanhuanji("xinyongwomrfz");
					}
				},
			},
		},
	},
	douzhengmrfz: {
		audio: ["部署1","部署2"],
		trigger: { global: "phaseEnd" },
		prompt: function (event, player) {
			return "【斗争】：是否失去所有体力并视为对" + get.translation(event.player) + "使用一张【杀】？";
		},
		filter: function (event, player) {
			return event.player != player;
		},
		check: function (event, player) {
			if (get.attitude(player, event.player) > 0) return false;
			return (
				player.countCards("h", function (card) {
					return card.name == "tao" || card.name == "jiu";
				}) > 0 || player.storage.xinyongwomrfz == true
			);
		},
		async content(event, trigger, player) {
			player.loseHp(player.hp);
			//@ts-ignore
			player.useCard({ card: get.autoViewAs({ name: "sha", isCard: true }), targets: [trigger.player], addCount: false });
			player.turnOver();
		},
		ai: {
			expose: 0.1,
		},
	},
	shensuimrfz: {
		audio: ["作战中3","作战中4"],
		forced: true,
		trigger: { player: "loseHpEnd" },
		filter: function (event, player) {
			return event.num > 1 && player.hujia < 1;
		},
		async content(event, trigger, player) {
			player.changeHujia(trigger.num);
		},
		group: "shensuimrfz_change",
		subSkill: {
			change: {
				direct: true,
				trigger: { global: "roundStart" },
				filter: function (event, player) {
					return !player.storage.xinyongwomrfz;
				},
				async content(event, trigger, player) {
					player.changeZhuanhuanji("xinyongwomrfz");
				},
			},
		},
	},
});

translate({
	char_1023_ghost2: "归溟幽灵鲨",
	char_1023_ghost2_prefix: "归溟",
	xinyongwomrfz: "拥我",
	xinyongwomrfz_info: "转换技，阳：当你进入濒死状态时，你可以回复至一点体力；阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。",
	douzhengmrfz: "斗争",
	douzhengmrfz_info: "其他角色的回合结束阶段，你可以失去所有体力并将武将牌翻面，然后你可以视为对当前回合角色使用一张【杀】。",
	shensuimrfz: "深邃",
	shensuimrfz_info: "锁定技，当你流失至少两点体力后，若你没有护甲，你获得等量的护甲；每轮开始时，若你的【拥我】为阴，则你转化之",
});

characterTitle("char_1023_ghost2", "<font color=#00868B>未尽之美</font>");

characterIntro("char_1023_ghost2", "幽灵鲨，本名劳伦缇娜，阿戈尔军事团体“深海猎人”成员，在对抗大型生物与破坏硬目标等行动中展现出极强的技巧。</br>“愚人号”事件后，其精神状态趋于稳定，记忆恢复，情绪趋于稳定。");

dynamicTranslate({
	yongwomrfz(player) {
		if (player.isTurnedOver()) return "①锁定技，<span class=thundertext>当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1；</span><font color=#696969>当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。</font>②锁定技，当你翻面至正面朝上时，你摸两张牌。";
		return "①锁定技，<font color=#696969>当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1；</font><span class=thundertext>当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。</span>②锁定技，当你翻面至正面朝上时，你摸两张牌。";
	},
	xinyongwomrfz(player) {
		if (player.storage.xinyongwomrfz) return "转换技，<span class=thundertext>阳：当你进入濒死状态时，你可以回复至一点体力；</span><font color=#696969>阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。</font>";
		return "转换技，<font color=#696969>阳：当你进入濒死状态时，你可以回复至一点体力；</font><span class=thundertext>阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。</span>";
	},
});
