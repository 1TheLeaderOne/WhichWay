import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("yunqingpingmrfz", { pack: "epicSJZX",
			sex: "male",
			group: "yanmrfz",
			hp: 4,
			skills: ["luwumrfz","baizhaomrfz"],
		});

skill({
	"luwumrfz": {
			audio: 2,
			usable: 1,
			trigger: {
				global: "cardsDiscardAfter",
			},
			onremove: true,
			init() {
				//@ts-ignore
				game.broadcastAll(() => {
					lib.translate["luwumrfz_tag"] = "invisible";
				});
			},
			// @ts-ignore
			filter(event, player) {
				//@ts-ignore
				let target = _status.currentPhase;
				return (
					target &&
					target.hasHistory("sourceDamage", evt => {
						return evt.cards && evt.cards.every(card => event.cards.includes(card));
					})
				);
			},
			marktext: "录武簿",
			intro: {
				name: "录武簿",
				// @ts-ignore
				content(storage, player) {
					if (!Array.isArray(storage) || storage.length === 0) return `没有招式被记录`;
					let trans = storage.map(arr => {
						let cn = [];
						cn.add(arr[1] === undefined ? get.translation(arr[0]) : get.translation(arr[1]) + get.translation(arr[0]));
						return cn.join("、");
					});
					return `记录的招式:${trans}`;
				},
			},
			mark: true,
			// @ts-ignore
			prompt2(event, player) {
				//@ts-ignore
				let target = _status.currentPhase;
				//@ts-ignore
				return `是否令${get.translation(target)}模一张牌，然后你获得${get.cnNumber(event.cards.length)}张牌(${get.translation(event.cards)})，然后你将一张手牌视为【影】?`;
			},
			// @ts-ignore
			check(event, player) {
				if (event.cards?.some(card => get.value(card) < 0)) return false;
				//@ts-ignore
				return get.attitude2(_status.currentPhase) > 0;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				let target = _status.currentPhase;
				target.draw();
				await player.gain(trigger.cards, "gain2");
				if (player.countCards("h", card => get.name(card) !== "ying") < 1) return;
				const { cards } = await player
					.chooseCard(1, true)
					.set("prompt", "请选择一张手牌视为【影】")
					.set("ai", card => -get.value(card))
					.forResult();
				if (!cards) return;
				let card = cards[0];
				card.addGaintag("luwumrfz_tag");
				target
					.when({ player: "phaseEnd" })
					.then(() => {
						player.unmarkSkill(event.name);
						//@ts-ignore
						game.broadcastAll(skill => {
							delete lib.translate[skill];
							//@ts-ignore
						}, event.name);
					})
					.assign({
						mod: {
							// @ts-ignore
							cardUsable(card, player, num) {
								//@ts-ignore
								if (card.name === trigger.getParent(2)?.card?.name) return (num += 1);
							},
						},
						intro: {
							name: "录武",
							content() {
								//@ts-ignore
								return `本回合使用的${get.translation(trigger.getParent(2).card.name)}次数+1`;
							},
						},
						luwumrfz: true,
						//@ts-ignore
						luwumrfzName: trigger.getParent(2).card.name,
					});
				if (!Array.isArray(player.storage.luwumrfz)) player.storage.luwumrfz = [];
				let storage = player.storage.luwumrfz;
				for (let card of trigger.cards) {
					if (storage.some(arr => arr[0] === get.name(card) && arr[1] === get.nature(card))) continue;
					player.storage.luwumrfz.add([card.name, card.nature]);
				}

				target.getSkills().forEach(skill => {
					if (skill.startsWith("player_when")) {
						let info = get.info(skill);
						if (info.luwumrfz) {
							game.broadcastAll(
								//@ts-ignore
								(skill, name) => {
									lib.translate[skill] = `${get.translation(name)[0]}↑`;
								},
								skill,
								info.luwumrfzName
							);
							target.markSkill(skill);
						}
					}
				});
			},
			ai: {
				threaten: 1.2,
			},
			mod: {
				// @ts-ignore
				cardname(card, player, name) {
					if (card.hasGaintag("luwumrfz_tag")) {
						return "ying";
					}
				},
			},
		},
	"baizhaomrfz": {
			audio: 2,
			enable: "chooseToUse",
			filter(event, player) {
				let storage = player.storage.luwumrfz;
				if (!Array.isArray(storage) || storage.length === 0) return false;
				let names = storage.map(arr => arr[0]);
				for (let name of names) {
					if (!event.filterCard({ name: name }, player, event)) continue;
					return player.countCards("h", card => get.name(card) === "ying") > 0;
				}
				return false;
			},
			chooseButton: {
				dialog(event, player) {
					let list = [];
					let storage = player.storage.luwumrfz;
					for (let arr of storage) {
						list.push([get.translation(get.type(arr[0])), "", arr[0], arr[1]]);
					}
					/**
					 * @type {Dialog}
					 */
					//@ts-ignore
					const dialog = ui.create.dialog("百招", [list, "vcard"]);
					return dialog;
				},
				filter(button, player) {
					//@ts-ignore
					return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
				},
				check(button) {
					var player = _status.event.player;
					//@ts-ignore
					if (player.countCards("hs", button.link[2]) > 0) {
						return 0;
					}
					//@ts-ignore
					if (button.link[2] == "wugu") {
						return;
					}
					//@ts-ignore
					var effect = player.getUseValue(button.link[2]);
					if (effect > 0) {
						return effect;
					}
					return 0;
				},
				// @ts-ignore
				backup(links, player) {
					return {
						// @ts-ignore
						filterCard(card, player) {
							return get.name(card) === "ying";
						},
						audio: "baizhaomrfz",
						selectCard: 1,
						popname: true,
						check(card) {
							return 6 - get.value(card);
						},
						position: "h",
						viewAs: { name: links[0][2], nature: links[0][3] },
					};
				},
				// @ts-ignore
				prompt(links, player) {
					return "将一张【影】当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
				},
			},
			ai: {
				order: 10,
				combo: "luwumrfz",
			},
		},
});

translate({
	"yunqingpingmrfz": "云青萍",
	"luwumrfz": "录武",
	"luwumrfz_info": "每回合限一次，若当前回合角色使用的造成伤害的牌进入弃牌堆后，你可以获得此牌并令其摸一张牌，然后你将一张手牌视为【影】且其本回合使用与此次造成伤害牌的牌名相同的牌的次数+1。",
	"baizhaomrfz": "百招",
	"baizhaomrfz_info": "你可以将一张【影】当作你因【录武】而获得过的牌使用。",
});

characterTitle("yunqingpingmrfz", "<font color = #a52a2a>何须剑</font>");

characterIntro("yunqingpingmrfz", "云青萍，曾就任炎国录武官一职，为军队将士记录武功、编撰书籍。现经干员左乐介绍，作为司岁台编外文职暂驻罗德岛，负责辅助对岁兽代理人的观察与记录，并兼任罗德岛后勤干员。");
