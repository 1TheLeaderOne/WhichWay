import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("zhisongmrfz", { pack: "legendSJZX",
			sex: "male",
			group: "laimrfz",
			hp: 4,
			skills: ["kuxiumrfz","lirenmrfz"],
		});

skill({
	"kuxiumrfz": {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num += player.getCards("j").length);
				},
			},
			audio: 2,
			enable: "phaseUse",
			filter: function (event, player) {
				var cards = [];
				if (player.countCards("he") < 1) return false;
				for (var i of lib.inpile) {
					if (get.type(i) == "delay") cards.push(i);
				}
				for (var name of cards) {
					//@ts-ignore
					if (player.canAddJudge({ name: name }, player)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var cards = [];
					for (var i of lib.inpile) {
						if (get.type(i) == "delay") cards.push(i);
					}
					var vcards = [];
					for (var name of cards) {
						var card = { name: name };
						//@ts-ignore
						if (player.canAddJudge({ name: name }, player)) vcards.push(["延时锦囊", "", name]);
					}
					var dialog = ui.create.dialog("苦修", [vcards, "vcard"], "hidden");
					return dialog;
				},
				check: function (button) {
					//@ts-ignore
					var name = button.link[2];
					switch (name) {
						case "lebu":
							return 1;
						case "bingliang":
							return 2;
						case "shandian":
							return 3;
						default:
							return 1.5;
					}
				},
				backup: function (links, player) {
					return {
						audio: "kuxiumrfz",
						filterCard: function (card, player, event) {
							return player.canAddJudge({
								name: links[0][2],
								cards: [card],
							});
						},
						selectTarget: -1,
						filterTarget: function (card, player, target) {
							return player == target;
						},
						check(card) {
							return 8 - get.value(card);
						},
						viewAs: {
							name: links[0][2],
						},
						position: "he",
						popname: true,
						onuse: function (links, player) {
							if (!links.cards) return;
							var next = game.createEvent("kuxiumrfz_draw", false, _status.event.getParent());
							next.cards = links.cards;
							next.player = player;
							next.setContent(async function (event,trigger,player) {
								let num = player.getCards("j").length;
								if (num > 0) player.draw(num);
							});
						},
						ai: {
							result: {
								player: 1,
							},
						},
					};
				},
				prompt: function (links, player) {
					return "【苦修】：请选择一张牌将其当做一张【" + get.translation(links[0][2]) + "】对自己使用";
				},
			},
			ai: {
				order: 8,
				result: {
					player: 1,
				},
			},
		},
	"lirenmrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("j") > 0;
			},
			check: function (event, player) {
				const cards = player.getCards("j");
				if (cards.length == 1 && cards[0].name == "shandian") return false;
				return player.hp > 1;
			},
			async content(event, trigger, player) {
				const num = player.getCards("j").length;
				player.discardPlayerCard(player, num, "j", true);
				player.loseHp();
			},
		},
});

translate({
	"zhisongmrfz": "止颂",
	"kuxiumrfz": "苦修",
	"kuxiumrfz_info": "①出牌阶段，你可以将一张牌当做任意延时锦囊牌置入你的判定区，然后摸X张牌。②锁定技，你使用【杀】的次数+X。（X=你判定区牌的数量）",
	"lirenmrfz": "砺刃",
	"lirenmrfz_info": "准备阶段，你可以弃置你判定区的所有牌，然后流失一点体力。",
});

characterIntro("zhisongmrfz", "止颂，本名莱辛·梅耶尔，莱塔尼亚路德维格大学旁听生，随干员黑键一同来到罗德岛。经过充分沟通，莱辛与罗德岛签订了合作协议，为罗德岛在莱塔尼亚境内的行动提供协助。");
