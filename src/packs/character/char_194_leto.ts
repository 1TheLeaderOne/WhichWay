import { whichWayUtil } from "../../utill.js";
import { character, characterIntro, characterTitle, skill, translate } from "../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

const NAME = "char_194_leto";

character(NAME, {
	sex: "female",
	group: "wumrfz",
	hp: 5,
	skills: ["hanshumrfz"],
	pack: "epicSJZX",
});

characterTitle(NAME, whichWayUtil.colorize("#r一呼百应#"));

characterIntro(NAME, "烈夏，本名罗莎琳·塔季扬诺夫娜·拉里娜，切尔诺伯格事变前于切城某中学就读，在校期间与干员凛冬皆为学生中的领军人物。现作为外勤小组的成员，多负责中长线的外勤任务。");

translate({
	[NAME]: "烈夏",

	hanshumrfz: "撼树",
	hanshumrfz_info: "出牌阶段开始时，你可以展示一名其他角色至少一张手牌且你获得其中一张牌，并令你本阶段使用【杀】的次数+X，然后你的弃牌阶段结束时，若你耗尽【杀】的使用次数，你摸2的X次方张牌并回复一点体力，否则你失去X点体力并摸X张牌。（X=展示牌的花色数）",
});

skill({
	hanshumrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player, name, target) {
			return game.hasPlayer(char => char !== player && char.countCards("h") > 0);
		},
		onremove: true,
		init(player, skill) {
			player.storage[skill] = 0;
		},
		intro: {
			content(storage, player, skill) {
				return `·出牌阶段【杀】的使用次数+${storage}<br>·剩余【杀】的使用次数:${player.getCardUsable("sha")}`;
			},
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("hanshumrfz"),
					prompt2: get.skillInfoTranslation("hanshumrfz"),
                    filterTarget(card, player, target) {
                        return player !== target && target.countCards("h")>0;
                    },
					ai(target) {
						const player = get.player();
						let val = 0;
						if (get.attitude2(target) < 0) val += 8;
						else val -= 2;

						if (target.countCards("h") > 2) {
							val += target.countCards("h") * 0.5;
						}

						if (player.countCards("h", card => get.name(card) === "sha") < 2) val -= 2;
						else val += player.countCards("h", card => get.name(card) === "sha") * 0.7;

						return val;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const result = await player
				.choosePlayerCard({
                    position:"h",
					target,
					forced: true,
					prompt: `展示${get.translation(target)}至少一张牌`,
					selectButton() {
						return [1, Infinity];
					},
					ai(button) {
						const num = ui.selected.buttons.length;
						const player = get.player();
						if (player.countCards("h", card => get.name(card) === "sha") > num) return Math.random();
						return -1;
					},
					complexSelect: true,
				})
				.forResult();

			if (!result.cards) return;

			player.storage["hanshumrfz"] = new Set(result.cards.map(i => get.suit(i))).size;
			await player.showCards(result.cards, `${get.translation(player)}展示${get.translation(target)}的牌<br>共有${player.storage["hanshumrfz"]}种花色`);
			player.markSkill("hanshumrfz");
			player.addTempSkill("hanshumrfz_end", { global: "phaseDiscardAfter" });

			const { links } = await player
				.chooseFakeCard({
					cards: result.cards,
					ai(card) {
						let val = get.value(card);
						if (get.name(card) === "sha") val += 3;
						return val;
					},
					forced: true,
					prompt: "【撼树】：请选择一张牌获得之",
					tagName: `${get.translation(target)}的牌`,
				})
				.forResult();

			if (links) {
				await player.gain({
					cards: links,
					animate: "gain2",
				});
			}
		},
		subSkill: {
			end: {
				mod: {
					cardUsable(card2, player2, num) {
                        const numx: number = player2.storage["hanshumrfz"];
						if (get.name(card2) === "sha" && numx > 0) {
							return num + numx;
						}
					},
				},
				charlotte: true,
				audio: "hanshumrfz",
				onremove(player, type) {
					player.storage["hanshumrfz"] = 0;
					player.unmarkSkill("hanshumrfz");
				},
				trigger: {
					player: "phaseDiscardEnd",
				},
				forced: true,
				async content(event, trigger, player) {
					const num: number = player.storage["hanshumrfz"];
					if (player.getCardUsable("sha") === 0) {
						player.draw({
							num: 2 ** num,
						});
                        player.recover();
					} else {
						player.loseHp(num);
                        player.draw(num);
					}
				},
			},
		},
	},
});
