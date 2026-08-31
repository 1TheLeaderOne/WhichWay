import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("kaiselinmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["ksl_zhuzhimrfz","duantiemrfz"],
		});

skill({
	"ksl_zhuzhimrfz": {
			onremove(player) {
				for (let t of game.players) {
					t.removeSkill("duantiemrfz");
				}
			},
			derivation: ["ksl_lulitongxinmrfz"],
			audio: 2,
			trigger: { global: "linkAfter" },
			silent: true,
			forced: true,
			filter(event, player) {
				return event.player != player;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				if (!target.isLinked() && target.hasSkill("duantiemrfz")) target.removeSkill("duantiemrfz");
				else if (target.isLinked() && !target.hasSkill("duantiemrfz")) target.addSkill("duantiemrfz");
			},
			group: ["ksl_zhuzhimrfz_add", "ksl_zhuzhimrfz_gain"],
			subSkill: {
				gain: {
					audio: "ksl_zhuzhimrfz",
					forced: true,
					trigger: {
						player: "phaseZhunbeiBegin",
					},
					async content(event, trigger, player) {
						var card = get.cardPile(function (card) {
							return get.name(card) == "ksl_lulitongxinmrfz";
						});
						if (card) player.gain(card, "gain2", "log");
						else player.draw();
					},
				},
				add: {
					audio: "ksl_zhuzhimrfz",
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					forced: true,
					filter(event, player) {
						return (event.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("ksl_lulitongxinmrfz");
					},
					async content(event, trigger, player) {
						var cards = [];
						for (var i = 0; i < 4; i++) {
							cards.push(game.createCard2("ksl_lulitongxinmrfz", lib.suit.randomGet(), [2, 4, 3, 10, 13].randomGet()));
						}
						game.broadcastAll(function () {
							lib.inpile.add("ksl_lulitongxinmrfz");
						});
						game.cardsGotoPile(cards, () => {
							return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
						});
					},
				},
			},
		},
	"duantiemrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			position: "he",
			filter(event, player) {
				let list = [];
				for (let card of player.getCards("he")) {
					list.add(get.type2(card));
				}
				return list.length >= 2;
			},
			filterCard(card, player) {
				return !ui.selected.cards.some(cardx => get.type2(cardx) == get.type2(card));
			},
			complexCard: true,
			selectCard: 2,
			async content(event, trigger, player) {
				player.storage.duantiemrfz_buff = player.name;
				let audio = new Audio("extension/WhichWay/audio/up.mp3");
				audio.play();
				await player.reinitCharacter(player.name, "paxinghaomrfz", false);
				player.addSkill("duantiemrfz_buff");
			},
			subSkill: {
				buff: {
					onremove: true,
					charlotte: true,
					silent: true,
					mark: true,
					intro: {
						content(event, player) {
							return `当前机甲驾驶员:${get.translation(player.storage.duantiemrfz_buff)}`;
						},
					},
					trigger: { player: "dying" },
					async content(event, trigger, player) {
						let audio = new Audio("extension/WhichWay/audio/down.mp3");
						audio.play();
						await player.reinitCharacter("paxinghaomrfz", player.storage.duantiemrfz_buff, false);
						player.recoverTo(2);
						player.removeSkill("duantiemrfz_buff");
					},
				},
			},
			ai: {
				order: 6,
				result: {
					player(player, target) {
						if (player.hp < 3) return 1;
						let threaten = -(get.skillthreaten("jushoumrfz") + get.skillthreaten("yinqingmrfz"));
						for (let skill of player.getSkills(null, false, false)) {
							threaten += get.skillthreaten(skill);
						}
						return threaten;
					},
				},
			},
		},
});

translate({
	"kaiselinmrfz": "凯瑟琳",
	"ksl_zhuzhimrfz": "铸志",
	"ksl_zhuzhimrfz_info": "锁定技，游戏开始时，你往牌堆中加入4张【勠力同心】；准备阶段，你从牌堆中获得一张【勠力同心】（没有改为摸一张牌）；所有被横置的其他角色获得技能“锻铁”。",
	"duantiemrfz": "锻铁",
	"duantiemrfz_info": "出牌阶段限一次，你可以弃置两种不同类型的牌，然后将你的武将牌替换为“爬行号”并且当你进入濒死状态时，你将武将牌替换回原武将牌，并将体力回复至两点。",
});

characterTitle("kaiselinmrfz", "<font color=#00868B>群工之首</font>");

characterIntro("kaiselinmrfz", "凯瑟琳，维多利亚工人代表。于伦蒂尼姆事件期间参与市民自救军的抵抗运动，与罗德岛协同行动。<br>在凯瑟琳的协调下，伦蒂尼姆的多家工厂及工人团体先后与罗德岛达成合作，在源石污染善后、矿石病预防与医疗救治等领域共同展开行动。");
