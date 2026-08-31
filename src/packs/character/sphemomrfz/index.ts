import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("sphemomrfz", {
			sex: "female",
			group: "lymrfz",
			hp: 3,
			skills: ["renbenmrfz","dizhumrfz"],
		});

skill({
	"renbenmrfz": {
			mark: true,
			intro: {
				name: "《特里蒙科学伦理宣言》",
				content: "本轮游戏不能使用、打出或弃置【$】",
			},
			audio: 2,
			forced: true,
			trigger: { global: "roundStart" },
			//priority:-100,
			async content(event, trigger, player) {
				let result;

				// step 0
				for (const char of game.players) {
					if (char.hasSkill("renbenmrfz2")) char.removeSkill("renbenmrfz2");
					if (char.hasSkill("renbenmrfz3")) char.removeSkill("renbenmrfz3");
				}
				const list = lib.inpile;
				const list2 = [];
				for (const name of list) {
					const type = get.type(name);
					if (name === "sha") {
						list2.push(["基本", "", "sha"]);
					} else if (type === "basic") {
						list2.push(["基本", "", name]);
					} else if (type === "trick") {
						list2.push(["锦囊", "", name]);
					}
				}
				if (!list.length) {
					return;
				} else {
					//@ts-ignore
					event.cards = list2;
					event.cards2 = [];
					event.num = 0;
				}

				// step 1 & 2 loop (original event.goto(1))
				while (event.num < game.players.length) {
					result = await game.players[event.num]
						.chooseButton(true, ["【人本】:请声明一张牌</br>科学理应注视每一个人", [event.cards, "vcard"]])
						.set("ai", button => {
							switch (button.link[2]) {
								case "wuxie":
									return 0.5 + Math.random();
								case "wuzhong":
								case "dongzhuxianji":
									return 0.3 + Math.random();
								case "guohe":
								case "zhujinqiyuan":
									return 0.3 + Math.random();
								case "sha":
									return 0.3 + Math.random();
								case "tao":
									return 0.4 + Math.random();
								case "shan":
									return 0.3 + Math.random();
								default:
									return Math.random();
							}
						})
						.forResult();

					// step 2 logic
					if (result.links) {
						event.cards2.add2(result.links[0][2]);
						game.log(game.players[event.num], "声明了", result.links[0][2]);
					}
					event.num++;
				}

				// step 3
				const maxCard = game.mostStr(event.cards2);
				if (maxCard.length === 1) {
					game.log("本轮游戏不能使用、打出或弃置", maxCard);
					player.popup(maxCard);
					player.storage.renbenmrfz = maxCard;
					for (const p of game.players) {
						if (p.storage.renbenmrfz !== maxCard) p.storage.renbenmrfz = maxCard;
					}
					// goto 6: skip to compliance loop
				} else {
					event.cards3 = maxCard;
					// step 4
					result = await player.chooseButton([true, "【人本】:请选择一张牌</br>科学理应注视每一个人", [event.cards3, "vcard"]]).forResult();

					// step 5
					if (result.links) {
						game.log("本轮游戏不能使用、打出或弃置", result.links[0][2]);
						player.popup(result.links[0][2]);
						player.storage.renbenmrfz = result.links[0][2];
						for (const p of game.players) {
							if (p.storage.renbenmrfz !== result.links[0][2]) p.storage.renbenmrfz = result.links[0][2];
						}
					}
				}

				// step 6
				event.num2 = 0;

				// step 7 & 8 loop (original event.goto(7)/redo())
				while (event.num2 < game.players.length) {
					const currentPlayer = game.players[event.num2];
					if (currentPlayer !== player) {
						result = await currentPlayer
							.chooseControl("是", "否")
							.set("prompt", "【人本】:是否遵守协议？(不能使用或打出" + get.translation(player.storage.renbenmrfz) + ")")
							.set("ai", () => {
								const aiPlayer = _status.event.player;
								if (!aiPlayer.getEquip(1)) return 0;
								if (
									game.hasPlayer(current => {
										return get.distance(aiPlayer, current) <= 1 && aiPlayer !== current && get.attitude(aiPlayer, current) < 0;
									}) ||
									(aiPlayer.storage.renbenmrfz === "sha" && Math.random() > 0.4)
								)
									return 1;
								return 0;
							})
							.forResult();

						// step 8 logic
						if (result.index === 0) {
							currentPlayer.addSkill("renbenmrfz2");
						} else if (result.index === 1) {
							currentPlayer.addSkill("renbenmrfz3");
						}
					}
					event.num2++;
				}
			},
			global: "renbenmrfz_use",
			subSkill: {
				use: {
					mod: {
						cardDiscardable: function (card, player) {
							if (get.name(card) == player.storage.renbenmrfz && (player.hasSkill("renbenmrfz2") || player.hasSkill("renbenmrfz")))
								return false;
						},
						cardEnabled2: function (card, player) {
							if (get.name(card) == player.storage.renbenmrfz && (player.hasSkill("renbenmrfz2") || player.hasSkill("renbenmrfz")))
								return false;
						},
						ignoredHandcard: function (card, player) {
							if (get.name(card) == player.storage.renbenmrfz && player.hasSkill("renbenmrfz")) {
								return true;
							}
						},
					},
				},
			},
		},
	"dizhumrfz": {
			audio: 2,
			trigger: { player: "phaseUseBegin" },
			direct: true,
			async content(event, trigger, player) {
				game.players.forEach(char => char.removeSkill("dizhumrfzx"));
				const result = await player
					.chooseTarget("【砥柱】:你可以选择至多两名角色，令其获得‘夜灯’标记", [0, 2])
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) > 2;
					})
					.forResult();

				if (result.targets) {
					var targets = result.targets;
					//@ts-ignore
					player.logSkill("dizhumrfz");
					for (const i of targets) {
						i.addSkill("dizhumrfzx");
						i.storage.dizhumrfz = true;
						player.line(i);
					}
				}
			},
		},
});

translate({
	"sphemomrfz": "淬羽赫默",
	"sphemomrfz_prefix": "淬羽",
	"renbenmrfz": "人本",
	"renbenmrfz_info": "锁定技，每轮开始时，每名角色各声明一张基本牌或普通锦囊牌，全部角色声明完毕后，你选择一张被声明最多或之一的牌，然后其他角色依次选择本轮内其是否不可弃置且不可使用或打出与声明的牌牌名相同的牌，选择‘是’的角色出牌阶段可以交给你与被声明的牌牌名相同的牌并摸一张牌，选择‘否’的角色本轮的攻击范围-X（X=本次选择‘是’的角色的数量）；你手牌中的与本次被声明的牌牌名相同的牌不计入手牌上限、不可弃置且不可使用或打出。",
	"dizhumrfz": "砥柱",
	"dizhumrfz_info": "出牌阶段开始时，你可以选择至多两名角色，然后其获得一个“夜灯”标记直到你的下个回合开始；锁定技，拥有“夜灯”标记的角色受到伤害时，此伤害-1，若此伤害数不小于其体力值，则改为防止此次伤害，然后移除‘夜灯’标记。",
});

characterTitle("sphemomrfz", "<font color=#4EEE94>伦理坚守者</font>");

characterIntro("sphemomrfz", "赫默，《特里蒙科学伦理联合宣言》发起人，莱茵生命总辖构件科执行顾问，在医疗事务方面与罗德岛展开了深度合作。</br>本人拥有丰富的医学临床经验，在罗德岛接受矿石病相关治疗的同时，为罗德岛提供医学支持。");
