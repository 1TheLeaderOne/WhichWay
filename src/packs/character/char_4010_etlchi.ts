import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayTips } from "../../tips/index.ts";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_4010_etlchi", { pack: "legendSJZX",
			sex: "female",
			group: "samrfz",
			hp: 4,
			skills: ["pingyimrfz","beinuomrfz"],
		});

skill({
	"pingyimrfz": {
			audio: 2,
			trigger: { global: "phaseEnd" },
			getCharacter() {
				let result = {
					sourceDamage: [],
					damage: [],
					all: [],
				};
				for (let char of game.players) {
					//@ts-ignore
					char.getHistory("sourceDamage", evt => {
						//@ts-ignore
						if (evt.player) result.damage.add(evt.player);
						//@ts-ignore
						if (evt.source) result.sourceDamage.add(evt.source);
					});
				}
				result.all = result.sourceDamage.concat(result.damage);
				return result;
			},
			filter(event, player) {
				let { sourceDamage, damage } = lib.skill.pingyimrfz.getCharacter();
				return (sourceDamage.length > 0 || damage.length > 0) && event.player !== player;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("pingyimrfz"))
					.set("prompt2", get.prompt2("pingyimrfz").replace(/###([^#]+)###/g, ""))
					.set("filterTarget", (card, player, target) => {
						//@ts-ignore
						let { sourceDamage, damage, all } = get.event().info;
						//技能提示
						for (let char of game.players) {
							let prompt:string[] = [];
							if (sourceDamage.includes(char)) prompt.push("使用【杀】");
							if (damage.includes(char)) prompt.push("使用【桃】");
							if (prompt.length > 0)
								whichWayTips.addPrompt(
									char,
									prompt.length > 1 ? prompt.map(text => `<span class = "promptTextSJZX">${text}</span>`).join("<br>") : prompt[0],
									"pingyimrfz",
									"uncheckBegin"
								);
						}
						return all.includes(target);
					})
					.set("info", lib.skill.pingyimrfz.getCharacter())
					.forResult();
			},
			async content(event, trigger, player) {
				let { sourceDamage, damage, all } = lib.skill.pingyimrfz.getCharacter();
				let target = event.targets[0];
				let name:string[] = [];
				if (sourceDamage.includes(target)) name.add("sha");
				if (damage.includes(target)) name.add("tao");
				let prompt = `对${get.translation(target)}使用一张`;
				if (name.length === 1) prompt = prompt + `【${get.translation(name[0])}】`;
				else prompt = prompt + `【${get.translation(name[0])}】或【${get.translation(name[1])}】`;
				await player
					.chooseToUse()
					.set("target",target)
					.set("prompt", prompt)
					.set("filterCard", (card, player, event) => {
						//@ts-ignore
						return get.event()?.namex?.includes(get.name(card));
					})
					.set("namex", name);
				if (player.storage.pingyimrfz_check) {
					delete player.storage.pingyimrfz_check;
					let next = game.createEvent("pingyimrfz_repeat");
					next.player = player;
					next.setContent(async function (event, trigger, player) {
						//@ts-ignore
						await lib.skill.pingyimrfz.cost(event, trigger, player);
						if (event.result.bool !== true) return;
						event.targets = event.result.targets;
						//@ts-ignore
						await lib.skill.pingyimrfz.content(event, trigger, player);
					});
				}
			},
			group: ["pingyimrfz_check"],
			subSkill: {
				check: {
					silent: true,
					audio: false,
					charlotte: true,
					trigger: {
						global: "changeHp",
					},
					filter(event, player) {
						//@ts-ignore
						return event.getParent(5).name === "pingyimrfz" || event.getParent(5).name === "pingyimrfz_repeat";
					},
					async content(event, trigger, player) {
						player.storage.pingyimrfz_check = true;
					},
				},
			},
		},
	"beinuomrfz": {
			audio: 2,
			usable: 3,
			/*
			 * false为最后获得，true为最先获得
			 */
			getCard(bool, debug) {
				let player = get.player();
				let cards = player.getCards("h")?.filter(card => card.storage && typeof card.storage.beinuomrfz === "number");
				if (!cards) return;
				return debug
					? cards.sort((a, b) => {
							let num1 = a.storage.beinuomrfz;
							let num2 = b.storage.beinuomrfz;
							return num1 - num2;
						})
					: cards.sort((a, b) => {
							let num1 = a.storage.beinuomrfz;
							let num2 = b.storage.beinuomrfz;
							return num1 - num2;
						})[bool ? 0 : cards.length - 1];
			},
			init() {
				lib.translate["beinuomrfz_last"] = "最后获得";
				lib.translate["beinuomrfz_earliest"] = "最先获得";
			},
			enable: "chooseToUse",
			filterCard(card, player) {
				return card === lib.skill.beinuomrfz.getCard(false);
			},
			filter(event, player) {
				let name = lib.skill.beinuomrfz.getCard(true)?.name;
				if (!name) return false;
				let card = get.autoViewAs({ name: name }, [lib.skill.beinuomrfz.getCard(false)]);
				return event.filterCard(card, player, event);
			},
			viewAs(cards, player) {
				let name = lib.skill.beinuomrfz.getCard(true).name;
				return { name: name };
			},
			prompt() {
				return `你可以将最后获得的牌(${get.translation(lib.skill.beinuomrfz.getCard(false).name)})当作最先获得的牌(${get.translation(lib.skill.beinuomrfz.getCard(true).name)})使用`;
			},
			async precontent(event, trigger, player) {
				let last = lib.skill.beinuomrfz.getCard(false);
				let earliest = lib.skill.beinuomrfz.getCard(true);
				let cards = event.result.cards;
				if (get.type2(last) !== get.type2(earliest)) {
					player
						.when({ player: "useCardAfter" })
						.filter((event, player) => {
							//@ts-ignore
							return event.cards && event.cards[0] === cards[0];
						})
						.then(async (event,trigger,player) => {
							player.draw(2);
						})
						.then(async (event,trigger,player) => {
							// let cards = player.getCards("h")
							// 	.filter(card=>card.storage&&typeof card.storage.beinuomrfz === "number")
							// 	.sort((a,b)=>{
							// 		return a.storage.beinuomrfz - b.storage.beinuomrfz;
							// 	});
							// let last = cards[cards.length-1].storage.beinuomrfz;
							// let earliest = cards[0].storage.beinuomrfz;
							// cards[0].storage.beinuomrfz = last;
							// cards[cards.length-1].storage.beinuomrfz = earliest;
							player
								.chooseCard({
									prompt:"你可以将一张手牌视为你最先获得的牌"
								})
								.set("filterCard", card => {
									return card !== lib.skill.beinuomrfz.getCard(true);
								})
								.set("ai", card => {
									let earliest = lib.skill.beinuomrfz.getCard(true);
									let player = get.player();
									if (["sha", "tao"].includes(earliest.name)) return -1;
									if (["sha", "tao"].includes(card.name)) return 10 + player.hp < 3 ? get.value(card) : 0;
									return get.value(earliest) >= get.value(card) ? -1 : get.value(card);
								});
						})
						.then(async (event,trigger,player) => {
							let result = event._result;
							if (result.cards) {
								result.cards[0].storage.beinuomrfz = lib.skill.beinuomrfz.getCard(true).storage.beinuomrfz - 1;
							}
						})
						.then(async (event,trigger,player) => {
							//@ts-ignore
							lib.skill.beinuomrfz.subSkill.tip.content(event, trigger, player);
						});
				}
			},
			group: ["beinuomrfz_tag", "beinuomrfz_tip"],
			subSkill: {
				tag: {
					silent: true,
					audio: false,
					charlotte: true,
					trigger: {
						player: "gainAfter",
						global: "gameDrawAfter",
					},
					async content(event, trigger, player) {
						if (!player.storage.beinuomrfz_tag) player.storage.beinuomrfz_tag = 0;
						let cards = trigger.name === "gain" ? trigger.cards : player.getCards("h");
						for (let card of cards) {
							card.storage.beinuomrfz = player.storage.beinuomrfz_tag;
							player.storage.beinuomrfz_tag++;
						}
					},
				},
				tip: {
					silent: true,
					audio: false,
					charlotte: true,
					trigger: {
						player: ["gainAfter", "loseAfter"],
						global: "gameDrawAfter",
					},
					lastDo: true,
					async content(event, trigger, player) {
						for (let card of player.getCards("h").filter(card => card.storage && typeof card.storage.beinuomrfz === "number")) {
							card.removeGaintag("beinuomrfz_last");
							card.removeGaintag("beinuomrfz_earliest");
							if (card === lib.skill.beinuomrfz.getCard(false)) card.addGaintag("beinuomrfz_last");
							if (card === lib.skill.beinuomrfz.getCard(true)) card.addGaintag("beinuomrfz_earliest");
						}
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},
});

translate({
	"char_4010_etlchi": "隐德莱希",
	"pingyimrfz": "平漪",
	"pingyimrfz_info": "其他角色的回合结束时，你可以对本回合[受到伤害/造成伤害]的一名角色使用一张[【桃】/【杀】]，若有角色体力值发生变化，你可以重复这个流程。",
	"beinuomrfz": "悖诺",
	"beinuomrfz_info": "每回合限三次，你可以将你手牌中最后获得的牌当做手牌中最先获得的牌使用，若这两张牌类别不同，你摸两张牌，然后你可以将一张手牌视为你最先获得的牌。",
});

characterTitle("char_4010_etlchi", "<font color='#db7093'>玫瑰河畔的引渡人</font>");

characterIntro("char_4010_etlchi", "隐德来希，作为卡兹戴尔情报组织玫瑰河畔的成员，曾为巴别塔提供过情报。伦蒂尼姆战争期间，隐德来希主动与罗德岛取得联系，现以访客身份留舰。<br>需注意，隐德来希与罗德岛并非正式的合约关系，她与罗德岛的一切合作，均视作私人委托。");
