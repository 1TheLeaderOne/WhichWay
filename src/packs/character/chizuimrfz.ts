import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("chizuimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "xumrfz",
			hp: 4,
			skills: ["newzhidianmrfz","newpijimrfz"],
		});

skill({
	"newzhidianmrfz": {
			getSkillsList: function (event, player) {
				var list = [];
				var listm = [];
				var listv = [];
				if (player.name1 != undefined) listm = lib.character[player.name1][3];
				else listm = lib.character[player.name][3];
				if (player.name2 != undefined) listv = lib.character[player.name2][3];
				listm = listm.concat(listv);
				var func = function (skill) {
					var info = get.info(skill);
					if (!info || info.charlotte) return false;
					return true;
				};
				for (var i = 0; i < listm.length; i++) {
					if (func(listm[i])) list.add(listm[i]);
				}
				if (player.disabledSkills) {
					for (var key in player.disabledSkills) {
						list.remove(key);
					}
				}
				return list;
			},
			init: (player, skill) => {
				player.storage[skill] = [];
			},
			audio: "zhidianmrfz",
			enable: "phaseUse",
			usable: 114514,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			filterTarget: function (card, player, target) {
				return target != player && !player.storage.newzhidianmrfz.includes(target);
			},
			check: function (card) {
				return 7 - get.value(card);
			},
			position: "he",
			filterCard: true,
			delay: false,
			lose: false,
			discard: false,
			async content(event, trigger, player) {
				let card = event.cards,
					target = event.target;
				player.give(card, target);
				let list = [],
					list2 = [];
				if (target.countCards("he") > 1) {
					list.add(`弃置三张牌，${get.translation(player)}获得其中一张牌`);
					list2.add("选项一");
				} else list.add(`<span style="opacity:0.5">弃置三张牌，${get.translation(player)}获得其中一张牌（不可选:牌数少于2）</span>`);
				list.add(`受到一点伤害且令${get.translation(player)}选择让你一个技能失效`);
				list2.add("选项二");
				if (!target.isLinked()) {
					list.add(`横置武将牌，${get.translation(player)}本回合不能再对你使用此技能`);
					list2.add("选项三");
				} else
					list.add(`<span style="opacity:0.5">横置武将牌，${get.translation(player)}本回合不能再对你使用此技能（不可选:已被横置）</span>`);
				var { control } = await target
					.chooseControl(list2)
					.set("choiceList", list)
					.set("ai", function () {
						var player = _status.event.target,
							list = _status.event.list,
							hs = player.getCards("he", card => {
								return get.value(card) < 8;
							});
						if (player.hp < 2) list.remove("选项二");
						if (player.countCards("he") < 4 || hs.length < 3) list.remove("选项一");
						if (list.length == 0) list.push("选项二");
						return list[0];
					})
					.set("target", event.target)
					.set("list", list2)
					.forResult();
				if (!control) return;
				switch (control) {
					case "选项一": {
						const { cards } = await target.chooseToDiscard(true, "he", 3, "请弃置三张牌").forResult();
						if (!cards) return;
						for (var i of cards) {
							if (get.position(i) != "d") cards.remove(i);
						}
						if (cards.length == 0) return;
						const { links } =
							cards.length == 1
								? { links: cards }
								: await player.chooseCardButton(cards, "【执典】:请选择获得一张牌", true, 1).forResult();
						player.gain(links[0], "gain2");
						break;
					}
					case "选项二": {
						let skillList = lib.skill.newzhidianmrfz.getSkillsList(event, target);
						if (skillList.length > 0) {
							var { control } = await player
								.chooseControl(skillList)
								.set("prompt", `选择${get.translation(target)}武将牌上的一个技能并令其失效`)
								.forResult();
							target.disableSkill("newzhidianmrfz_disable", control);
							target.addTempSkill("newzhidianmrfz_disable", {
								player: "phaseAfter",
							});
							game.log(player, "选择了", target, "的技能", "#g【" + get.translation(control) + "】");
						}
						target.damage();
						break;
					}
					case "选项三":
						target.link(true);
						if (!player.storage.newzhidianmrfz) player.storage.newzhidianmrfz = [];
						player.storage.newzhidianmrfz.add(target);
						break;
				}
			},
			group: ["newzhidianmrfz_count", "newzhidianmrfz_clear"],
			ai: {
				threaten: 1.2,
				order: 8,
				result: {
					target: function (player, target) {
						var att = get.attitude(player, target);
						if (att < 0) {
							return -(1 + target.countCards("he") * 0.1);
						}
					},
				},
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseAfter" },
					async content(event, trigger, player) {
						player.storage.newzhidianmrfz = [];
					},
				},
				count: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBefore",
						player: ["changeHp", "enterGame"],
					},
					filter(event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					async content(event, trigger, player) {
						lib.skill.newzhidianmrfz.usable = player.hp;
					},
				},
				disable: {
					onremove(player, skill) {
						player.enableSkill(skill);
					},
					locked: true,
					mark: true,
					charlotte: true,
					intro: {
						content(storage, player, skill) {
							let list = [];
							for (let i in player.disabledSkills) {
								if (player.disabledSkills[i].includes(skill)) list.push(i);
							}
							if (list.length) {
								let str = "失效技能：";
								for (let i = 0; i < list.length; i++) {
									if (lib.translate[list[i] + "_info"]) str += get.translation(list[i]) + "、";
								}
								return str.slice(0, str.length - 1);
							}
						},
					},
				},
			},
		},
	"newpijimrfz": {
			audio: "pijimrfz",
			trigger: {
				player: "useCard",
			},
			forced: true,
			locked: false,
			filter: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && current.isLinked();
				});
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(current => {
						return current != player && current.isLinked();
					})
				);
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					return arg.target.isLinked();
				},
			},
			group: "newpijimrfz_damage",
			subSkill: {
				damage: {
					audio: false,
					direct: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						//@ts-ignore
						return event.player.isLinked() && event.getParent().name != "newpijimrfz_damage";
					},
					async content(event, trigger, player) {
						//@ts-ignore
						player.logSkill("newpijimrfz");
						for (const i of game.players) {
							if (player == i || !i.isLinked()) continue;
							player.line(i);
							i.damage();
						}
					},
				},
			},
		},
});

translate({
	"chizuimrfz": "斥罪",
	"newzhidianmrfz": "执典",
	"newzhidianmrfz_info": "出牌阶段限X次，你可以将一张牌交给一名其他角色，其选择一项：</br>1.弃置三张牌，然后你获得其中一张牌；</br>2.受到一点伤害且你令其一个技能失效直到其回合结束；</br>3.横置武将牌，然后本回合你不能再对其使用此技能。</br>（X=你的体力值）",
	"newpijimrfz": "辟棘",
	"newpijimrfz_info": "锁定技，被横置的其他角色不能响应你使用的牌；当你造成伤害后，若该角色被横置，你对所有被横置的角色造成一点伤害。",
});

characterTitle("chizuimrfz", "<font color=#8F3ED7>斩棘卫法</font>");

characterIntro("chizuimrfz", "斥罪，原为叙拉古城邦法官，通过干员德克萨斯与罗德岛建立联系。于后勤部工作，担任罗德岛法律顾问一职。");
