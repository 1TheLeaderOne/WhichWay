import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("shuidengxinmrfz", {
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["sanyanmrfz","dongqumrfz"],
		});

skill({
	"sanyanmrfz": {
			audio: 2,
			trigger: {
				global: "phaseEnd",
			},
			getSatisfied(player, stroage) {
				let history = player.getHistory();
				let result = [];
				for (let key in history) {
					if (!stroage.includes(key)) continue;
					let subHistory = history[key];
					if (key === "useCard") {
						for (let evt of subHistory) {
							if (evt.card && get.type2(evt.card) === "equip") {
								result.add(key);
								break;
							}
						}
					} else if (key === "gain") {
						if (subHistory.length > 0) {
							result.add(key);
						}
					}
				}
				if (player.hasSkill("sanyanmrfz_recovered") && stroage.includes("recover")) result.add("recover");

				return result;
			},
			init(player, skill) {
				player.storage[skill] = ["gain", "useCard", "recover"];
			},
			prompt2(event, player) {
				let result = lib.skill.sanyanmrfz.getSatisfied(event.player, player.storage.sanyanmrfz);
				return `你可以摸${get.cnNumber(2 * result.length)}张牌，然后令至多${get.cnNumber(result.length)}名其他角色摸一张牌`;
			},
			filter(event, player) {
				return lib.skill.sanyanmrfz.getSatisfied(event.player, player.storage.sanyanmrfz).length > 0;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let result = lib.skill.sanyanmrfz.getSatisfied(trigger.player, player.storage.sanyanmrfz);
				let num = result.length;
				await player.draw(2 * num);
				const { targets } = await player
					.chooseTarget()
					.set("filterTarget", lib.filter.notMe)
					.set("selectTarget", [1, num])
					.set("ai", target => get.attitude2(target) > 0)
					.set("prompt", `【三焰】：你可以令至多${get.cnNumber(num)}名其他角色摸一张牌`)
					.forResult();
				if (targets) {
					targets.forEach(target => player.line(target));
					await game.asyncDraw(targets, 1);
				}
				player.storage.sanyanmrfz.remove(...result);
			},
			group: ["sanyanmrfz_count", "sanyanmrfz_reset"],
			subSkill: {
				reset: {
					charlotte: true,
					silent: true,
					trigger: {
						global: "roundStart",
					},
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage["sanyanmrfz"] = ["gain", "useCard", "recover"];
					},
				},
				count: {
					charlotte: true,
					silent: true,
					trigger: { global: "recoverEnd" },
					filter(event, player) {
						// @ts-ignore
						return event.player === _status.currentPhase && !player.hasSkill("sanyanmrfz_recovered");
					},
					// @ts-ignore
					async content(event, trigger, player) {
						player.addTempSkill("sanyanmrfz_recovered", { global: "phaseAfter" });
					},
				},
			},
			ai: {
				threaten: 1.8,
			},
		},
	"dongqumrfz": {
			audio: 2,
			trigger: { global: "roundStart" },
			// @ts-ignore
			filter(event, player) {
				return game.hasPlayer(current => current.countCards("h", card => current.canRecast(card)) > 0);
			},
			// @ts-ignore
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("dongqumrfz"))
					.set("prompt2", `你可以令至多${get.cnNumber(player.maxHp)}名角色重铸一张手牌，若重铸的牌点数之和大于21，则这些角色回复一点体力`)
					// @ts-ignore
					.set("filterTarget", (card, player, target) => target.countCards("h", card => target.canRecast(card)) > 0)
					.set("selectTarget", [1, player.maxHp])
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let targets = [...event.targets];
				let cards = [];
				while (targets.length > 0) {
					let target = targets.shift();
					if (target) {
						let { cards: cardsx } = await target
							.chooseCard(true)
							.set("ai", card => -get.value(card))
							.set("prompt", "【冬去】:请重铸一张手牌")
							// @ts-ignore
							.set("filterCard", card => get.event().targetx.canRecast(card))
							.set("targetx", target)
							.forResult();
						if (cardsx) {
							cards.push(...cardsx);
							target.recast(cardsx);
						}
					}
				}
				// @ts-ignore
				let sum = Number(cards.map(card => get.number(card)).reduce((acc, num) => acc + num, 0)) || 0;
				if (sum > 21) {
					event.targets.forEach(target => {
						target.recover();
					});
				}
			},
		},
});

translate({
	"shuidengxinmrfz": "水灯心",
	"sanyanmrfz": "三焰",
	"sanyanmrfz_info": "任意角色的回合结束时，其每满足下列一项你便摸两张牌并删除此项直到本轮结束：<br>1.回复过体力值；<br>2.使用过装备牌；<br>3.获得过牌。<br>然后你可以令至多X名其他角色摸一张牌。（X=满足的项数）",
	"dongqumrfz": "冬去",
	"dongqumrfz_info": "每轮开始时，你可以令至多Y名角色重铸一张手牌，若重铸的牌点数之和大于21，这些角色回复一点体力。（Y=你的体力上限）",
});

characterTitle("shuidengxinmrfz", "<font color='#8b008b'>火与生命</font>");

characterIntro("shuidengxinmrfz", "水灯心，本名布莉吉，游牧民。据称来自塔拉某支古老的游牧部族，其成员长久以来在平原、丘陵地区从事游牧活动，兼领天灾预警、传信相关职责。现经干员苇草推荐与罗德岛合作，在接受矿石病治疗的同时，作为狙击干员协助战斗。");
