import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xiyinmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "samrfz",
			hp: 3,
			skills: ["sheyingmrfz","chaozaimrfz"],
		});

skill({
	"sheyingmrfz": {
			mod: {
				maxHandcard: function (player, num) {
					var bool = false;
					for (var i of game.players) {
						for (var j of [1, 2, 3, 4, 5]) {
							if (i.hasCard(`jingtouE${j}mrfz`, "e")) {
								bool = true;
								break;
							}
						}
					}
					if (bool) return num + 2;
				},
				globalTo(from, to, distance) {
					var bool = false;
					for (var i of game.players) {
						for (var j of [1, 2, 3, 4, 5]) {
							if (i.hasCard(`jingtouE${j}mrfz`, "e")) {
								bool = true;
								break;
							}
						}
					}
					if (bool) return distance + 1;
				},
			},
			audio: 2,
			derivation: ["jingtoumrfz_show"],
			enable: "phaseUse",
			filter: function (event, player) {
				var num = 0;
				for (var i of game.players) {
					for (var j of [1, 2, 3, 4, 5]) {
						if (i.hasCard(`jingtouE${j}mrfz`, "e")) num++;
					}
				}
				return player.countCards("h") > 0 && num < 4;
			},
			usable: 2,
			position: "he",
			filterCard: true,
			filterTarget: lib.filter.notMe,
			check(card) {
				return 6 - get.value(card);
			},
			async content(event, trigger, player) {
				let targets = event.targets,
					list1 = [],
					list2 = [];
				for (let i of [1, 2, 3, 4, 5]) list1.push(`jingtouE${i}mrfz`);
				for (let i of list1) {
					list2.push(["装备", "", i]);
				}
				const { links } = await player
					.chooseButton(["稀音", [list2, "vcard"]], true)
					.set("ai", function (button) {
						var target = _status.event.target,
							list = _status.event.list,
							card = { name: button.link[2] },
							equip = [];
						for (var i of target.getCards("e")) equip.push(get.name(i));
						if (equip.includes(card.name)) return 0;
						if (get.subtype(card) == "equip2") return 5;
						if (get.subtype(card) == "equip1") return 4;
						if (get.subtype(card) == "equip5") return 3;
						if (get.subtype(card) == "equip3" || get.subtype(card) == "equip3") return 2;
						return 1;
					})
					.set("target", targets[0])
					.set("list", list1)
					.forResult();
				if (!links) return;
				var suit,
					list3 = ["heart", "club", "spade", "spade", "diamond"];
				for (var i = 0; i < list1.length; i++) {
					if (links[0][2] == list1[i]) suit = list3[i];
				}
				var card = game.createCard(links[0][2], suit, 7);
				targets[0].$gain2(card);
				game.delayx();
				targets[0].equip(card);
			},
			ai: {
				order: 13,
				result: {
					target: -1,
				},
			},
		},
	"chaozaimrfz": {
			audio: 2,
			hasJingtou(player) {
				return this.getJingtou(player).length > 0 ? true : false;
			},
			getJingtou(player) {
				let cards = [];
				let names = Array.from({ length: 5 }, (v, i) => `jingtouE${i + 1}mrfz`);
				for (let card of player.getCards("e")) {
					//@ts-ignore
					if (names.includes(get.name(card))) cards.push(card);
				}
				return cards;
			},
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return game.hasPlayer(current => lib.skill.chaozaimrfz.hasJingtou(current));
			},
			prompt2(event, player) {
				let targets = game.filterPlayer(current => lib.skill.chaozaimrfz.hasJingtou(current));
				let jingtous = [];
				for (let char of game.players) {
					if (targets.includes(char)) jingtous.addArray(lib.skill.chaozaimrfz.getJingtou(char));
				}
				return `你可以弃置${get.translation(targets)}区域中的镜头并摸${jingtous.length}张牌`;
			},
			async content(event, trigger, player) {
				let targets = game.filterPlayer(current => lib.skill.chaozaimrfz.hasJingtou(current));
				let jingtous = [];
				for (let char of game.players) {
					if (targets.includes(char)) jingtous.addArray(lib.skill.chaozaimrfz.getJingtou(char));
				}
				game.cardsDiscard(jingtous);
				player.draw(jingtous.length);
				for (let i of targets) {
					i.addSkill("chaozaimrfz_eff");
					i.storage.chaozaimrfz = player;
				}
			},
			subSkill: {
				eff: {
					mark: true,
					markimage: "extension/WhichWay/image/skill/xiyinchaozaimrfz.png",
					intro: {
						name: "超载",
						content(event, player) {
							let str = `
									·XXX<br>
									·其他角色对你使用牌无次数限制<br>
									·其他角色对你使用牌无距离限制
								`;
							let str2 = `受到的伤害+1`;
							if (player.storage.chaozaimrfz_eff) return str.replace(/XXX/g, `<font color = gray>${str2}（已触发）</font>`);
							return str.replace(/XXX/g, str2);
						},
					},
					global: "chaozaimrfz_eff2",
					firstDo: true,
					direct: true,
					charlotte: true,
					trigger: {
						player: "damageBegin2",
						global: ["dieAfter", "phaseBegin"],
					},
					filter(event, player) {
						if (event.name == "damage") return true;
						return player.storage.chaozaimrfz == event.player;
					},
					async content(event, trigger, player) {
						if (trigger.name == "die" || trigger.name == "phase") {
							player.removeSkill("chaozaimrfz_eff");
							delete player.storage.chaozaimrfz;
							delete player.storage.chaozaimrfz_eff;
						} else if (player.storage.chaozaimrfz_eff != true) {
							trigger.num++;
							//@ts-ignore
							player.logSkill("chaozaimrfz");
							player.storage.chaozaimrfz_eff = true;
							player.when({ global: "phaseEnd" }).then(async (event, trigger, player) => {
								delete player.storage.chaozaimrfz_eff;
							});
						}
					},
				},
				eff2: {
					charlotte: true,
					mod: {
						targetInRange(card, player, target) {
							if (target.hasSkill("chaozaimrfz_eff")) {
								return true;
							}
						},
						cardUsableTarget(card, player, target) {
							if (target.hasSkill("chaozaimrfz_eff")) return true;
						},
					},
				},
			},
		},
});

translate({
	"xiyinmrfz": "稀音",
	"sheyingmrfz": "摄影",
	"sheyingmrfz_info": "①出牌阶段限两次，若场上【镜头】的数量少于4，你可以弃置一张牌，选择将一张【镜头】置入一名其他角色的装备栏。②锁定技，当场上有【镜头】时，你的手牌上限+2，其他角色计算与你的距离+1。",
	"chaozaimrfz": "超载",
	"chaozaimrfz_info": "准备阶段，你可以弃置场上所有的【镜头】并摸等量的牌，然后因此失去【镜头】的角色获得以下效果直到你的回合开始：<br>1.每回合第一次受到的伤害+1；<br>2.任意角色对其使用牌无次数和距离限制。",
});

characterIntro("xiyinmrfz", "稀音，摄影师，擅长以摄影辅助设备“镜头”为主的机器人小队勘察战场，传达图像信息，同时为罗德岛提供野地考察与战场侦察服务。不过，干员稀音的运动能力十分低下，辅助工作的后勤干员必不可少。");
