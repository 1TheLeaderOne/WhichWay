import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("spweicaomrfz", { pack: "legendSJZX",
			sex: "female",
			group: "shenmrfz",
			hp: 3,
			skills: ["gongximrfz", "huamianmrfz"],
		});

skill({
	"gongximrfz": {
			audio: "yingyaomrfz",
			derivation: ["huoshaolianying"],
			enable: "phaseUse",
			filter(event, player) {
				if (
					Object.entries(player.getStat("skill"))
						.filter(i => ["gongximrfz", "gongximrfz_dying"].includes(i[0]))
						.reduce((n, arr) => n + arr[1], 0) > 0
				)
					return false;
				return player.countCards("he", card => get.tag(card, "damage")) > 0 && player.hasUseTarget("huoshaolianying");
			},
			filterCard(card) {
				return get.tag(card, "damage");
			},
			filterTarget(card, player, target) {
				return !target.isLinked();
			},
			selectTarget() {
				//@ts-ignore
				let num = get.targetCounts(ui.selected.cards[0]);
				return [0, num];
			},
			check(card) {
				let player = get.player();
				return (
					8 -
					get.value(card) +
					Math.min(
						game.countPlayer(char => {
							return get.effect(char, { name: "huoshaolianying" }, player, player) > 0;
						}),
						//@ts-ignore
						get.targetCounts(card)
					)
				);
			},
			complexSelect: true,
			discard: false,
			lose: false,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				const {
					cards: [card],
					targets,
				} = event;
				if (Array.isArray(targets))
					targets.forEach(target => {
						//@ts-ignore
						if (!target.isLinked()) target.link();
					});
				if (player.hasUseTarget("huoshaolianying")) {
					player
						.when({ player: "useCardAfter" })
						.filter(event => event.card?.storage?.gongximrfz === true)
						.step(async (event, trigger, player) => {
							const damages = player.getHistory("sourceDamage", evt => evt.card && evt.card.storage && evt.card.storage.gongximrfz === true).length;
							if (damages > 0) {
								const { targets } = await player
									.chooseTarget()
									.set("selectTarget", [0, damages])
									.set("prompt", `你可以令至多${damages}名角色回复一点体力并摸一张牌`)
									.set("ai", target => {
										let player = get.player();
										let att = get.attitude(player, target);
										let num = att > 0 ? 1 : -114514;
										if (att > 0 && target.hp < 2) num += 10;
										if (target === player) num += 2;
										if (att > 0 && target.getDamagedHp() > 0) num += 2;
										return num;
									})
									.forResult();
								if (targets) {
									//@ts-ignore
									player.logSkill("gongximrfz", targets);
									targets.forEach(target => {
										target.recover();
										target.draw();
									});
								}
							}
						});

					await player
						.chooseUseTarget({ name: "huoshaolianying", storage: { gongximrfz: true } }, [card])
						.set("forced", true)
						.set("prompt2", `此牌结算完成后，你令至多Y名角色回复一点体力并摸一张牌。（Y=【火烧连营】此次造成的伤害值）`);
				}
			},
			group: "gongximrfz_dying",
			subSkill: {
				dying: {
					audio: "gongximrfz",
					trigger: {
						global: "dying",
					},
					filter() {
						//@ts-ignore
						return lib.skill.gongximrfz.filter.apply(this, arguments);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseCardTarget({
								prompt: get.prompt("gongximrfz"),
								prompt2: get.skillInfoTranslation("gongximrfz"),
								filterCard: lib.skill.gongximrfz.filterCard,
								filterTarget: lib.skill.gongximrfz.filterTarget,
								selectTarget: lib.skill.gongximrfz.selectTarget,
								check1: lib.skill.gongximrfz.check,
								check2(target) {
									//@ts-ignore
									return lib.skill.gongximrfz.ai.result.target(get.player(), target);
								},
								complexSelect: true,
							})
							.forResult();
					},
					async content(event, trigger, player) {
						//@ts-ignore
						await lib.skill.gongximrfz.content(event, trigger, player);
					},
				},
			},
			ai: {
				order: 5,
				result: {
					target(player, target) {
						let att = get.attitude(player, target);
						if (att > 0) return;
						return -1;
					},
				},
			},
		},
	"huamianmrfz": {
			audio: "minghuomrfz",
			derivation: ["jsrgjishan", "dcctjiuxian", "newminghuomrfz"],
			trigger: {
				player: "phaseJieshuEnd",
			},
			getNum(player) {
				let [drawPlayer, recoverPlayer] = [[], []];
				//@ts-ignore
				game.getGlobalHistory("changeHp", evt => {
					let evtx = evt.parent;
					//@ts-ignore
					if (evtx?.name === "recover" && evtx?.source === player && Object.keys(evtx?.getParent("phaseUse")).length > 0) recoverPlayer.add(evtx.player);
				});

				for (let char of game.players.concat(game.dead)) {
					if (
						char.getHistory("gain", evt => {
							let evtx = evt.parent;
							//@ts-ignore
							return evtx?.name === "draw" && evtx?.source === player && Object.keys(evtx?.getParent("phaseUse")).length > 0;
						}).length > 0
					)
						//@ts-ignore
						drawPlayer.add(char);
				}

				console.log(drawPlayer, recoverPlayer);

				return drawPlayer.length + recoverPlayer.length;
			},
			filter(event, player) {
				return this.getNum(player) > 0;
			},
			forced: true,
			init(player) {
				//@ts-ignore
				game.broadcastAll(function () {
					["jsrgjishan", "dcctjiuxian", "newminghuomrfz"].forEach(skill => {
						let info = get.info(skill);
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2[player.name] = "huamianmrfz";
					});
				});
			},
			async content(event, trigger, player) {
				let num = lib.skill.huamianmrfz.getNum(player);
				console.log(num);
				if (num >= 4) player.addTempSkill("newminghuomrfz", { player: "phaseJieshuBegin" });
				if (num >= 3) player.addTempSkill("dcctjiuxian", { player: "phaseJieshuBegin" });
				if (num >= 2) player.addTempSkill("jsrgjishan", { player: "phaseJieshuBegin" });
				if (num >= 1) player.draw();
			},
		},
	"newminghuomrfz": {
			audio: ["3星结束行动", "任命队长"],
			usable: 1,
			trigger: {
				global: ["dyingAfter", "recoverAfter"],
			},
			forced: true,
			filter(event, player) {
				if (event.name === "dying") {
					//@ts-ignore
					let evt = event.getChildren("recover");
					return evt?.source === player;
				}
				return event?.source === player && event.player.getDamagedHp() === 0;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.insertPhase();
			},
		},
});

translate({
	"spweicaomrfz": "焰影苇草",
	"spweicaomrfz_prefix": "焰影",
	"gongximrfz": "共熄",
	"gongximrfz_info": "每回合限一次，出牌阶段，或任意角色进入濒死状态时，你可以选择一张伤害类牌并横置至多X名角色，然后你将此牌当【火烧连营】使用，此牌结算完成后，你令至多Y名角色回复一点体力并摸一张牌。（X=此牌的目标数，Y=【火烧连营】此次造成的伤害值）",
	"huamianmrfz": "花冕",
	"huamianmrfz_info": "锁定技，结束阶段结束时，你执行至第N项：<br>1.摸一张牌<br>2.获得【积善】；<br>3.获得【救陷】；<br>4.获得【命火】。<br>(你以此法获得的技能于你的下个结束阶段开始时失去之)<br>(N=本回合出牌阶段摸过牌的角色数和因你回复体力的角色数之和)",
	"newminghuomrfz": "命火",
	"newminghuomrfz_info": "锁定技，每回合限一次，当有角色因你而脱离濒死状态后，或有角色因你回复体力值后体力值与体力上限相等，你于此回合结束后执行一个额外的回合。",
});

characterIntro("spweicaomrfz", "苇草，驻留罗德岛的维多利亚南部办事处期间，曾提出撤离申请，近期再次成功与罗德岛建立联络。目前正以深池名义带领小股部队在维多利亚境内活动，以救助被暴力胁迫的塔拉人为主要行动目标。");
