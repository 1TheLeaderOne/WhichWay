import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("minermrfz", { pack: "plotSJZX",
			group: "wumrfz",
			sex: "male",
			skills: ["xunkaimrfz"],
			hp: 3,
		});

skill({
	"xunkaimrfz": {
			audio: 2,
			forced: true,
			derivation: ["xinjuejing", "weijing"],
			trigger: {
				player: ["dying", "enterGame"],
				global: "phaseBefore",
			},
			filter(event, player) {
				return event.name !== "phase" || game.phaseNumber === 0;
			},
			firstDo: true,
			async content(event, trigger, player) {
				if (player.maxHp > 1) {
					//@ts-ignore
					let gains = ["xinjuejing", "weijing"].map(i => `${i}_${get.randomNumberSJZX()}`);
					// @ts-ignore
					game.broadcastAll(skills => {
						//@ts-ignore
						skills.forEach(skill => {
							let original = skill.split("_")[0];
							let info = get.info(original);
							lib.skill[skill] = {
								...info,
								audio: original,
								xunkaimrfz: true,
								onremove: true,
							};
							lib.translate[skill] = lib.translate[original];
							lib.translate[`${skill}_info`] = lib.translate[`${original}_info`];

							if (original === "weijing") {
								lib.dynamicTranslate[skill] = (player, skill) => {
									// @ts-ignore
									return player.storage[skill] ? "每轮限一次，当你需要使用基本牌时，你可以视为使用之" : lib.translate.weijing_info;
								};
								lib.skill[skill] = {
									...lib.skill[skill],
									filter(event, player) {
										if (event.type === "wuxie" || player.hasSkill(`${skill}_used`)) {
											return false;
										}
										let names = player.storage[skill] ? lib.inpile.filter(i => get.type(i) === "basic") : ["sha", "shan"];
										for (var name of names) {
											if (event.filterCard({ name: name, isCard: true }, player, event)) {
												return true;
											}
										}
										return false;
									},
									hiddenCard(player, name) {
										let names = player.storage[skill] ? lib.inpile.filter(i => get.type(i) === "basic") : ["sha", "shan"];
										return names.includes(name) && !player.hasSkill(`${skill}_used`);
									},
									chooseButton: {
										...lib.skill[skill].chooseButton,
										// @ts-ignore
										backup: function (links, player) {
											return {
												audio: "weijing",
												viewAs: {
													name: links[0][2],
												},
												filterCard: () => false,
												selectCard: -1,
												position: "hes",
												popname: true,
												check(card) {
													return 6 / Math.max(1, get.value(card));
												},
												// @ts-ignore
												async precontent(event, trigger, player) {
													player.addTempSkill(`${skill}_used`, "roundEnd");
												},
											};
										},
										dialog(event, player) {
											let names = player.storage[skill] ? lib.inpile.filter(i => get.type(i) === "basic") : ["sha", "shan"];
											var vcards = [];
											for (var name of names) {
												var card = { name: name, isCard: true };
												if (event.filterCard(card, player, event)) {
													vcards.push(["基本", "", name]);
												}
											}
											var dialog = ui.create.dialog("卫境", [vcards, "vcard"], "hidden");
											// @ts-ignore
											dialog.direct = true;
											return dialog;
										},
									},
								};
							}
						});
						//@ts-ignore
					}, gains);

					await player.addSkills(gains);

					await player.loseMaxHp();
					player.recoverTo(1);
				} else {
					let skills = player.getSkills().filter(skill => {
						let info = get.info(skill);
						return info && info.xunkaimrfz && skill.startsWith("weijing");
					});
					if (skills.length < 1) return;
					let skill = skills.randomGet();
					player.storage[skill] = true;
				}
			},
		},
});

translate({
	"minermrfz": "矿工游击队",
	"xunkaimrfz": "殉忾",
	"xunkaimrfz_info": "锁定技，游戏开始时，或你进入濒死状态时，若你的体力上限大于1，你获得技能“绝境”和“卫境”（均可重复获得），然后减少一点体力上限，将体力值恢复至1，反之，你将获得的一个“卫境”的描述修改为：“每轮限一次，当你需要使用基本牌时，你可以视为使用之”。",
});

characterIntro("minermrfz", "矿工们自发组织的反抗队伍，成员多是青壮年。他们并非失去理智的暴民，他们只是想保护仍躲在地下的亲人。");
