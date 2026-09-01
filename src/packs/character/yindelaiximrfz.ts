import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayTips } from "../../tips/index.ts";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("yindelaiximrfz", { pack: "legendSJZX",
			sex: "female",
			group: "samrfz",
			hp: 4,
			skills: ["pingyimrfz","beinuomrfz"],
		});

skill({
	"zhishuimrfz": {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCardBegin",
			},
			filter(event, player) {
				return (
					event.card.storage?.huanyoumrfz &&
					!event.card.storage?.zhishuimrfz &&
					event.card.cards.length === 1 &&
					!player.hasUseTarget(event.card.cards[0].name)
				);
			},
			async content(event, trigger, player) {
				await player.useCard(
					{
						name: "dongzhuxianji",
						suit: trigger.card.suit,
						number: trigger.card.number,
						nature: trigger.card.nature,
						storage: {
							...trigger.card.storage,
							zhishuimrfz: true,
						},
						isCard: true,
					},
					trigger.cards,
					player
				);
				trigger.cancel();
			},
		},
	"qianxianmrfz": {
			audio: "chuemrfz",
			trigger: {
				player: "useCardToPlayered",
				target: "useCardToTargeted",
			},
			forced: true,
			init(player, skill) {
				player.storage[skill] = [];
			},
			filter(event, player) {
				if (!["trick", "basic"].includes(get.type(event.card))) return false;
				return player === event.target || event.getParent().triggeredTargets3.length === 1;
			},
			mark: true,
			intro: {
				content(storage) {
					return `记录的牌名：${get.translation(storage)}`;
				},
			},
			onremove: true,
			async content(event, trigger, player) {
				if (player.storage.qianxianmrfz.includes(trigger.card.name)) {
					player.storage.qianxianmrfz.remove(trigger.card.name);
					player.draw();
				} else {
					player.storage.qianxianmrfz.push(trigger.card.name);
					//@ts-ignore
					trigger.getParent()?.excluded.add(...trigger.targets);
					trigger.player.draw(2);
				}
			},
			ai: {
				threaten: 2,
			},
		},
	"ziwumrfz": {
			audio: "wenxinmrfz",
			derivation: "dunkongmrfz",
			forced: true,
			juexingji: true,
			skillAnimation: true,
			animationColor: "thunder",
			unique: true,
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return player.storage.qianxianmrfz?.length >= 5;
			},
			async content(event, trigger, player) {
				player.awakenSkill(event.name);
				player.recoverTo(3);
				await player.draw(player.storage.qianxianmrfz.length);
				player.storage.qianxianmrfz = [];
				player.addSkill("dunkongmrfz");
			},
			ai: {
				combo: "qianxianmrfz",
			},
		},
	"dunkongmrfz": {
			audio: "zhishuimrfz",
			enable: "phaseUse",
			usable: 1,
			onremove(player, skill) {
				player.enableSkill(skill);
			},
			intro: {
				content(_, player) {
					let num = Math.min(5, player.storage.qianxianmrfz.length);
					return `·使用【杀】的次数+${num}<br>·手牌上限+${num}<br>·计算与其他角色的距离-${num}`;
				},
			},
			async content(event, trigger, player) {
				let numx = Math.min(5, player.storage.qianxianmrfz.length);
				player.draw(numx);
				player.disableSkill("dunkongmrfz", "qianxianmrfz");
				player.markSkill("dunkongmrfz");
				player
					.when("phaseEnd")
					.then(() => {
						player.enableSkill("dunkongmrfz");
						player.unmarkSkill("dunkongmrfz");
						if (player.storage.qianxianmrfz?.length > 0) {
							player.storage.qianxianmrfz.remove(player.storage.qianxianmrfz.randomGet());
						}
					})
					.assign({
						mod: {
							maxHandcard(player, num) {
								return num + numx;
							},
							cardUsable(card, player, num) {
								if (card.name === "sha") return num + numx;
							},
							globalFrom(from, to, distance) {
								return distance - numx;
							},
						},
					});
			},
			ai: {
				order: 13,
				result: {
					player(player) {
						return player.storage.qianxianmrfz.length > 1;
					},
				},
			},
		},
	"liangtianmrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "drawAfter" },
			filter: function (event, player) {
				if (player.hasSkill("liangtianmrfz_ban")) return false;
				//@ts-ignore
				return event.getParent(2).name != "liangtianmrfz";
			},
			content: async function (event, trigger, player) {
				var list = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"],
					phase;
				for (var i of list) {
					//@ts-ignore
					var evt = trigger.getParent(i).name;
					if (evt == i) {
						phase = i;
						break;
					}
				}
				//@ts-ignore
				var phase = phase + "After";
				player.draw();
				player.addTempSkill("liangtianmrfz_ban", { global: phase });
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
	"xiangle_xinyangjiaobanjimrfz": { audio: 2 },
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
							let prompt = [];
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
				let name = [];
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
						.then(() => {
							player.draw(2);
						})
						.then(() => {
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
								.chooseCard("你可以将一张手牌视为你最先获得的牌")
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
						.then(() => {
							let result = event._result;
							if (result.cards) {
								result.cards[0].storage.beinuomrfz = lib.skill.beinuomrfz.getCard(true).storage.beinuomrfz - 1;
							}
						})
						.then(() => {
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
	"yindelaiximrfz": "隐德莱希",
	"zhishuimrfz": "止水",
	"zhishuimrfz_info": "锁定技，当你使用一张背面朝上的手牌时，若其不能被合法的使用，则你将此牌视为【洞烛先机】使用。",
	"qianxianmrfz": "千相",
	"qianxianmrfz_info": "锁定技，当你成为或指定基本牌或普通锦囊牌的目标后，若你[记录/没有记录]此牌，你[移除此牌的记录/记录此牌并取消此牌的所有目标],然后[你/此牌的使用者]模[一/两]张牌。",
	"ziwumrfz": "自悟",
	"ziwumrfz_info": "觉醒技，准备阶段，若“千相”记录了至少5张牌，你将体力值回复至3点，移除“千相”记录的牌名并摸等量张牌，然后你获得“遁空”。",
	"dunkongmrfz": "遁空",
	"dunkongmrfz_info": "出牌阶段限一次，你可以令“千相”失效直到回合结束，然后你摸X张牌，且令本回合出【杀】次数+X；你计算与他角色距离-X；手牌上限+X，并于回合结束时随机移除“千相”中记录的一张牌。（X为“千相”记录牌名且至多为5）",
	"liangtianmrfz": "良田",
	"liangtianmrfz_info": "锁定技，每阶段限一次，当你不因此技能而摸牌后，你摸一张牌。",
	"pingyimrfz": "平漪",
	"pingyimrfz_info": "其他角色的回合结束时，你可以对本回合[受到伤害/造成伤害]的一名角色使用一张[【桃】/【杀】]，若有角色体力值发生变化，你可以重复这个流程。",
	"beinuomrfz": "悖诺",
	"beinuomrfz_info": "每回合限三次，你可以将你手牌中最后获得的牌当做手牌中最先获得的牌使用，若这两张牌类别不同，你摸两张牌，然后你可以将一张手牌视为你最先获得的牌。",
});

characterTitle("yindelaiximrfz", "<font color='#db7093'>玫瑰河畔的引渡人</font>");

characterIntro("yindelaiximrfz", "隐德来希，作为卡兹戴尔情报组织玫瑰河畔的成员，曾为巴别塔提供过情报。伦蒂尼姆战争期间，隐德来希主动与罗德岛取得联系，现以访客身份留舰。<br>需注意，隐德来希与罗德岛并非正式的合约关系，她与罗德岛的一切合作，均视作私人委托。");
