import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("elamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["leimingmrfz","zuzhimrfz"],
		});

skill({
	"zuzhimrfz": {
			audio: 2,
			trigger: { source: "damageEnd" },
			filter(event, player) {
				return (
					event.card &&
					get.color(event.card) != "none" &&
					event.player &&
					event.player.isIn() &&
					(!event.player.storage.zuzhimrfz || !event.player.storage.zuzhimrfz.includes(get.color(event.card)))
				);
			},
			prompt(event, player) {
				return `【阻滞】:是否令${event.player == player ? "你" : get.translation(event.player)}本回合无法使用或打出${get.translation(get.color(event.card))}的牌？`;
			},
			check(event, player) {
				return get.attitude(event.player, player) < 0;
			},
			async content(event, trigger, player) {
				var target = trigger.player;
				if (!target.storage.zuzhimrfz_ban) target.storage.zuzhimrfz_ban = [];
				target.storage.zuzhimrfz_ban.add(get.color(trigger.card));
				target.addTempSkill("zuzhimrfz_ban", {
					global: "phaseEnd",
				});
			},
			subSkill: {
				ban: {
					charlotte: true,
					onremove: true,
					mark: true,
					intro: {
						content(event, player) {
							return `本回合不能使用或打出${get.translation(player.storage.zuzhimrfz_ban)}的牌`;
						},
					},
					mod: {
						cardEnabled: function (card, player) {
							if (player.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
						},
						cardRespondable: function (card, player) {
							if (player.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
						},
						cardSavable: function (card, player) {
							if (player.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
						},
					},
				},
			},
		},
	"leimingmrfz": {
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: true,
			mark: true,
			intro: {
				content(event, player) {
					if (game.me == player) {
						return `记录的内容：${get.translation(player.storage.leimingmrfz)}`;
					} else return `有${player.storage.leimingmrfz.length}个记录的内容`;
				},
			},
			audio: 2,
			trigger: { global: "roundStart" },
			direct: true,
			async content(event, trigger, player) {
				player.storage.leimingmrfz = [];
				var list1 = [],
					list2 = [],
					list3 = [],
					list4 = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var type = get.type(lib.inpile[i]);
					if (type == "basic") {
						list1.push(["基本", "", lib.inpile[i]]);
					} else if (type == "trick") {
						list2.push(["锦囊", "", lib.inpile[i]]);
					} else if (type == "delay") {
						list3.push(["锦囊", "", lib.inpile[i]]);
					} else if (type == "equip") {
						list3.push(["装备", "", lib.inpile[i]]);
					}
				}
				const { links } = await player
					.chooseButton([get.prompt("leimingmrfz"), [list1.concat(list2).concat(list3).concat(list4), "vcard"]])
					.set("filterButton", function (button) {
						var player = _status.event.player;
						if (player.storage.leimingmrfz.includes(button.link[2])) return false;
						return true;
					})
					.set("ai", function (button) {
						var rand = _status.event.rand;
						switch (button.link[2]) {
							case "sha":
								return 5 + rand[1];
							case "tao":
								return 4 + rand[2];
							case "lebu":
								return 3 + rand[3];
							case "shan":
								return 4.5 + rand[4];
							case "wuzhong":
								return 4 + rand[5];
							case "shunshou":
								return 3 + rand[6];
							case "nanman":
								return 2 + rand[7];
							case "wanjian":
								return 2 + rand[8];
							default:
								return rand[0];
						}
					})
					.set("rand", [
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
					])
					.forResult();
				if (!links) return;
				//@ts-ignore
				player.logSkill("leimingmrfz");
				player.storage.leimingmrfz.add(links[0][2]);
				var { control } = await player
					.chooseControl(lib.suit)
					.set("prompt", "【雷鸣】:请选择一种花色")
					.set("ai", () => lib.suit.randomGet())
					.forResult();
				if (!control) return;
				player.storage.leimingmrfz.add(control);
				var { control } = await player
					.chooseControl("basic", "trick", "equip")
					.set("prompt", "【雷鸣】:请选择一种类型")
					.set("ai", () => ["basic", "basic", "basic", "trick", "trick", "equip"].randomGet())
					.forResult();
				if (!control) return;
				player.storage.leimingmrfz.add(control);
			},
			group: "leimingmrfz_eff",
			subSkill: {
				eff: {
					audio: "leimingmrfz",
					trigger: { global: "useCard" },
					onremove: true,
					filter(event, player) {
						var storage = player.storage.leimingmrfz,
							card = event.card;
						if (player.storage.leimingmrfz_eff) return false;
						if (!storage || storage.length == 0) return false;
						if (player == event.player) return false;
						return (
							storage.includes(get.suit(card, event.player)) ||
							storage.includes(get.name(card, event.player)) ||
							storage.includes(get.type2(card, event.player))
						);
					},
					prompt(event, player) {
						return `【雷鸣】:是否视为对${get.translation(event.player)}使用一张任意颜色的雷【杀】？`;
					},
					check(event, player) {
						if (get.attitude(event.player, player) > 0) return false;
						return get.effect(event.player, { name: "sha", nature: "thunder" }, player, player) > 0;
					},
					async content(event, trigger, player) {
						player.storage.leimingmrfz_eff = true;
						player
							.when({
								player: "leimingmrfz_effAfter",
							})
							.then(async (event, trigger, player) => {
								delete player.storage.leimingmrfz_eff;
							});
						// .emb({ firstDo: true });
						var target = trigger.player;
						// if (target.countDiscardableCards(player, 'he')) player.discardPlayerCard('he', true, target)
						//     .set('target', target)
						//     .set('ai', lib.card.guohe.ai.button);
						if (player.canUse({ name: "sha", nature: "thunder" }, target, false)) {
							var { control } = await player
								.chooseControl("red", "black")
								.set("prompt", `【雷鸣】:请选择使用雷【杀】的颜色`)
								.set("ai", function () {
									var player = _status.event.player,
										target = _status.event.target;
									var red = get.effect(
											target,
											{
												name: "sha",
												nature: "thunder",
												color: "red",
											},
											player,
											player
										),
										black = get.effect(
											target,
											{
												name: "sha",
												nature: "thunder",
												color: "black",
											},
											player,
											player
										);
									if (red > black) return 0;
									return 1;
								})
								.set("target", target)
								.forResult();
							if (!control) return;
							if (
								player.canUse(
									{
										name: "sha",
										nature: "thunder",
										color: control,
									},
									target,
									false
								)
							) {
								player.useCard(
									{
										name: "sha",
										nature: "thunder",
										color: control,
									},
									target,
									true
								);
							}
						}
						var list = [],
							storage = player.storage.leimingmrfz,
							card = trigger.card;
						if (storage.includes(get.name(card, target))) list.push(get.name(card, target));
						if (storage.includes(get.suit(card, target))) list.push(get.suit(card, target));
						if (storage.includes(get.type2(card, target))) list.push(get.type2(card, target));
						var { control } =
							list.length == 1
								? { control: list[0] }
								: await player
										.chooseControl(list)
										.set("prompt", `【雷鸣】:请选择清除一个记录`)
										.set("list", list)
										.set("ai", function () {
											var list = _status.event.list;
											return list.randomGet();
										})
										.forResult();
						if (!control) return;
						player.storage.leimingmrfz.remove(control);
					},
				},
			},
		},
});

translate({
	"elamrfz": "艾拉",
	"zuzhimrfz": "阻滞",
	"zuzhimrfz_info": "当你造成伤害后，你可以令该角色本回合无法使用或打出与你对其造成伤害的牌颜色相同的牌。",
	"leimingmrfz": "雷鸣",
	"leimingmrfz_info": "每轮开始时，你可以记录一种牌名、花色和类型（仅对你可见），然后本轮当有其他角色使用与你记录的牌名、花色或类型相同的牌时，你可以视为对其使用一张任意颜色的雷【杀】，并清除对应的一个记录。",
});

characterIntro("elamrfz", "艾拉是彩虹小队成员之一，独立、叛逆，适应能力强，同时具备相当的领导能力。<br>艾拉习惯用被她称为“雷鸣地雷”的装置在战斗中获取优势。这种爆炸物通过巨响和震荡干扰敌人行动，乃至使其失能，是一种极为实用的非致命性武器。");
