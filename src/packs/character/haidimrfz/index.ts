import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("haidimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["anxinmrfz","gongchoumrfz","yinshimrfz"],
		});

skill({
	"anxinmrfz": {
			audio: 2,
			trigger: { global: "gainEnd" },
			filter: function (event, player) {
				if (event.source === undefined || !event.source.isIn()) return false;
				if (event.source != player || !event.cards) return false;
				return event.cards.length > 0;
			},
			async content(event, trigger, player) {
				let num = trigger.cards.length,
					dialog = ["【暗信】:请选择一张牌"],
					list = [],
					count = 0;
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type(name) == "delay" || get.type(name) == "equip") continue;
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							list.push(["基本", "", "sha", j]);
						}
					} else if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				//@ts-ignore
				dialog.push([list, "vcard"]);
				while (num--) {
					var { links } = await player
						.chooseButton(1, true)
						.set("createDialog", dialog)
						.set("ai", button => {
							var card = {
									name: button.link[2],
									nature: button.link[3],
								},
								player = _status.event.player,
								target = _status.event.target,
								att = _status.event.att,
								num = target.getUseValue(card, undefined, true);
							if (card.name == "jiedao" && att < 0) num -= 10;
							if ((card.name == "tao" || card.name == "shan") && att < 0) num -= 5;
							return num * att;
						})
						.set("target", trigger.player)
						.set("att", get.attitude(trigger.player, player) > 0 ? 1 : -1)
						.forResult();
					if (!links) continue;
					let viewCards = {
						name: links[0][2],
						nature: links[0][3],
					};
					var gaincards = trigger.cards.filter(card => {
							return !card.hasGaintag("anxinmrfz") && get.position(card) == "h";
						}),
						tmpnum = gaincards.length;
					if (gaincards.length == 0) return;
					var { links } =
						gaincards.length == 1
							? { links: gaincards }
							: await player
									.chooseCardButton(
										`【暗信】:请你选择视为${viewCards["nature"] === undefined ? "" : get.translation(viewCards["nature"])}${get.translation(viewCards["name"])}的牌`,
										true,
										gaincards,
										[1, tmpnum]
									)
									.set("ai", () => {
										if (ui.selected.buttons.length == 0) return 1;
										return 0;
									})
									.forResult();
					if (!links) continue;
					for (var i = 0; i < links.length; i++) {
						links[i].gaintag.add("anxinmrfz");
						links[i].storage.anxinmrfz = viewCards;
						//console.log('storage:',links[i].storage);
						//console.log('gaintag:',links[i].gaintag);
					}
					var gaincards = trigger.cards.filter(card => {
						return !card.hasGaintag("anxinmrfz") && get.position(card) == "h";
					});
					if (gaincards.length == 0) return;
				}
			},
			global: "anxinmrfz_views",
			group: ["anxinmrfz_use"],
			subSkill: {
				use: {
					charlotte: true,
					forced: true,
					trigger: { global: "useCardAfter" },
					filter: function (event, player) {
						return event.player.hasHistory("lose", function (evt) {
							if (evt.getParent() != event) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("anxinmrfz")) return true;
							}
							return false;
						});
					},
					async content(event, trigger, player) {
						player.draw();
						//@ts-ignore
						player.logSkill("anxinmrfz");
					},
				},
				views: {
					charlotte: true,
					mod: {
						aiOrder: function (player, card, num) {
							if (get.itemtype(card) == "card" && card.hasGaintag("anxinmrfz")) return num + 1;
						},
						cardname: function (card, player) {
							var viewsCard = card.storage.anxinmrfz;
							if (get.itemtype(card) == "card" && card.hasGaintag("anxinmrfz")) return viewsCard.name;
						},
						cardnature(card, player) {
							var viewsCard = card.storage.anxinmrfz;
							if (get.itemtype(card) == "card" && card.hasGaintag("anxinmrfz")) return viewsCard.nature;
						},
					},
				},
			},
		},
	"gongchoumrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && current.countCards("h") > 0;
				});
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			selectTarget: -1,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let targets = event.targets,
					list = [];
				while (true) {
					if (targets[0].countCards("h") == 0) {
						targets.shift();
						continue;
					}
					var { cards } = await targets[0]
						.chooseCard(true)
						.set("prompt", `【觥筹】:请选择一张牌交给${get.translation(player)}`)
						.set("ai", function (card) {
							return get.value(card) < 6;
						})
						.forResult();
					if (!cards) {
						targets.shift();
						continue;
					}
					targets[0].give(cards, player);
					list.add(targets[0]);
					targets.shift();
					if (targets.length == 0) break;
				}
				if (list.length == 0) return;
				while (true) {
					if (player.countCards("he") == 0) return;
					var { cards } = await player
						.chooseCard(true, "he")
						.set("prompt", `【觥筹】:请选择一张牌交给${get.translation(list[0])}`)
						.set("ai", function (card) {
							return get.value(card) < 6;
						})
						.forResult();
					if (!cards) {
						list.shift();
						continue;
					}
					player.give(cards, list[0]);
					list.shift();
					if (list.length == 0) break;
				}
			},
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
		},
	"yinshimrfz": {
			mod: {
				targetEnabled: function (card, player, target) {
					var num = 0,
						list = ["h", "j", "e"];
					for (var i = 0; i < list.length; i++) {
						if (target.countCards(list[i]) == 0) continue;
						num++;
					}
					if (player.getHistory("useCard").length < num && _status.currentPhase != target) return false;
				},
			},
			audio: 2,
			trigger: {
				global: "useCard",
			},
			forced: true,
			filter: (event, player) => {
				var num = 0,
					list = ["h", "j", "e"];
				for (var i = 0; i < list.length; i++) {
					if (player.countCards(list[i]) == 0) continue;
					num++;
				}
				return (
					event.player.getHistory("useCard").length < num &&
					_status.currentPhase != player &&
					((event.card.name == "nanman" && player != event.player) ||
						(event.card.name == "wanjian" && player != event.player) ||
						(event.card.name == "taoyuan" && player.hp < player.maxHp) ||
						event.card.name == "wugu")
				);
			},
			content: () => {},
		},
});

translate({
	"haidimrfz": "海蒂",
	"anxinmrfz": "暗信",
	"anxinmrfz_info": "当其他角色获得你的牌后，你可以声明一张基本牌或普通锦囊牌，然后该角色将此牌视为你声明的牌，当其使用此牌后，你摸一张牌。",
	"gongchoumrfz": "觥筹",
	"gongchoumrfz_info": "出牌阶段限一次，你可以令所有其他角色交给你一张手牌，然后你交给以此法交给你牌的所有角色一张牌。",
	"yinshimrfz": "隐市",
	"yinshimrfz_info": "锁定技，你的回合外，你不能成为任意角色于本回合使用的前X张牌的目标。（X=你有牌的区域数）",
});

characterTitle("haidimrfz", "<font color=#DC143C>风暴中的信使</font>");

characterIntro("haidimrfz", "海蒂，以小说家的名义在维多利亚活动，同时已担任凯尔希的私人信使多年。因参与市民自救军的行动而遭萨卡兹军抓捕，在罗德岛进入伦蒂尼姆时被救出，随后正式以干员身份加入罗德岛。");
