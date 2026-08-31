import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("ruoyemumrfz", {
			sex: "female",
			group: "othermrfz",
			hp: 1,
			maxHp: 3,
			skills: ["lingwomrfz", "pojianmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		});

skill({
	"lingwomrfz": {
			audio: 2,
			trigger: {
				player: "dying",
			},
			forced: true,
			// @ts-ignore
			filter(event, player) {
				return (
					player.countCards("he", card => {
						return game.hasPlayer(target => target.canEquip(card) || get.type(card) !== "equip");
					}) > 0
				);
			},
			// @ts-ignore
			async content(event, trigger, player) {
				const num = lib.skill.wuweimrfz.getNum(player, event.name);
				const result = await player
					.chooseCardTarget({
						forced: true,
						prompt: `你${get.poptip("sjzx_byRecast")}将一张牌赠予一名其他角色，并将体力至调整至${Math.max(1, num)}`,
						// @ts-ignore
						filterTarget: (card, player, target) =>
							ui.selected.cards.every(value => {
								return target !== player && (target.canEquip(value) || get.type(value) !== "equip");
							}),
						filterCard(card) {
							return game.hasPlayer(current => {
								return current.canEquip(card) || get.type(card) !== "equip";
							});
						},
						position: "he",
						ai1: card => {
							return 8 - get.value(card);
						},
						ai2: target => {
							let player = get.player();
							// @ts-ignore
							return lib.skill._gifting.ai.result.target(player, target);
						},
					})
					.forResult();
				const { cards, targets } = result;
				if (!cards || !targets) return;
				const target = targets[0];
				player.recast(cards);
				player.gift(cards, target);
				player.recoverTo(Math.max(1, lib.skill.wuweimrfz.getNum(player, event.name)));

				let skills = player.getSkills(null, null, false).filter(skill => {
					let info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				});
				const { control } = await player
					.chooseControl(skills)
					.set("prompt", `请选择失去一个技能直到本轮结束`)
					.set("ai", () => {
						// @ts-ignore
						let { skills, player } = get.event();
						if (skills.includes("wuweimrfz")) return "wuweimrfz";
						if (skills.length > 1 && skills.includes("pojianmrfz")) skills.remove("pojianmrfz");
						return skills.randomGet();
					})
					.set("skills", skills)
					.forResult();
				if (control) {
					player.removeSkill(control);
					player
						.when({ global: "roundStart" })
						// @ts-ignore
						.step(async (event, trigger, player) => {
							player.addSkill(control);
						});
				}
			},
			ai: {
				threaten: 0.8,
			},
		},
	"pojianmrfz": {
			audio: 2,
			trigger: {
				player: "damageEnd",
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h") > 0 && player.hasUseTarget("taoyuan");
			},
			usable: 3,
			// @ts-ignore
			async cost(event, trigger, player) {
				// @ts-ignore
				let skills = player.getSkills(null, null, false).filter(skill => {
					let info = get.info(skill);
					return info && !info.charlotte;
				});
				let num = lib.skill.wuweimrfz.getNum(player, "pojianmrfz");
				const { result } = await player
					.chooseCardTarget({
						prompt: `你可以将一张牌${get.poptip("sjzx_byRecast")}当目标数至多为${Math.max(1, num)}的【桃园结义】使用，然后因此回复体力值的角色摸${num}张牌，反之其本回合使用的下一张牌额外结算${num}次`,
						filterCard: true,
						// @ts-ignore
						filterTarget(card, player, target) {
							return player.canUse("taoyuan", target);
						},
						selectTarget() {
							let num = get.event().num;
							return [1, num];
						},
						ai1(card) {
							let player = get.player();
							if (player.isPhaseUsing() && player.countCards("h", card => player.hasUseTarget(card) && ["equip", "delay"].includes(get.type(card))) > 0) return false;
							if (!player.isPhaseUsing() && !game.hasPlayer(char => get.attitude2(char) > 0 && char.getDamagedHp() > 0)) return false;
							return 8 - get.value(card);
						},
						ai2(target) {
							// @ts-ignore
							let player = get.player();
							let num = 0;
							if (get.attitude2(target) < 0) return -1;
							if (target.getDamagedHp() > 0) num += target.hp === 1 ? 5 : 2;
							if (target.isPhaseUsing() && target.getDamagedHp() < 1 && game.hasPlayer(char => char.countCards("h", card => char.hasUseTarget(card) && ["equip", "delay"].includes(get.type(card))) > 0)) num += 1;
							return num;
						},
					})
					.set("num", num);
				event.result = result;
			},
			async content(event, trigger, player) {
				const { cards, targets } = event;
				//@ts-ignore
				let randomId = get.randomNumberSJZX();
				let damageCard = trigger.card;

				player
					.when({ player: "useCardAfter" })
					.filter((event, player) => {
						return event.card?.storage?.pojianmrfz;
					})
					.step(async (event, trigger, player) => {
						const num = lib.skill.wuweimrfz.getNum(player, "pojianmrfz");
						if (num < 1) return;
						//@ts-ignore
						game.getRoundHistory("changeHp", evt => {
							/** @type { GameEvent } */
							//@ts-ignore
							let evtx = evt.getParent();
							if (evtx.name === "recover" && targets.includes(evtx.player) && evtx.card && evtx.card?.storage?.pojianmrfz_id === randomId) {
								evtx.player.draw(num);
								targets.remove(evtx.player);
							}
						});
						targets.forEach(target => {
							target.markSkill("pojianmrfz", {
								content: `本回合下次使用牌额外结算${lib.skill.wuweimrfz.getNum(player, "pojianmrfz")}次`,
							});
							target
								.when({
									player: "useCard",
									global: "phaseEnd",
								})
								// @ts-ignore
								.filter((event, player) => {
									if (event.name !== "useCard") return true;
									return !event.card?.storage?.pojianmrfz && event.card !== damageCard;
								})
								.then(async (event,trigger,player) => {
									player.unmarkSkill("pojianmrfz");
									if (trigger.name !== "useCard") return;
									//@ts-ignore
									if (numx > 0) trigger.effectCount += numx;
								})
								.vars({
									numx: lib.skill.wuweimrfz.getNum(player, "pojianmrfz"),
									damageCard: damageCard,
								});
						});
					});

				player.recast(cards);
				await player
					.chooseUseTarget(
						{
							name: "taoyuan",
							isCard: true,
							storage: {
								pojianmrfz: true,
								pojianmrfz_id: randomId,
							},
						},
						cards,
						targets
					)
					.set("forced", true);
			},
			ai: {
				threaten: 0.5,
				maixie: true,
				maixie_hp: true,
				effect: {
					target(card, player, target) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						if (target.hasFriend() && get.tag(card, "damage")) {
							return [1, 0, 0, -0.7];
						}
					},
				},
			},
		},
});

translate({
	"ruoyemumrfz": "若叶睦",
	"lingwomrfz": "另我",
	"lingwomrfz_info": "锁定技，当你进入濒死状态后，你${get.poptip(\"sjzx_byRecast\")}将一张牌赠予一名其他角色，并将体力至调整至X（X至少为1），然后你选择失去一个技能直到本轮结束。",
	"pojianmrfz": "破茧",
	"pojianmrfz_info": "每回合限三次，当你受到伤害后，你可以将一张牌${get.poptip(\"sjzx_byRecast\")}当目标数至多为X（至少为1）的【桃园结义】使用，然后因此回复体力值的角色摸X张牌，反之其本回合使用的下一张牌额外结算X次。",
});

characterTitle("ruoyemumrfz", "<font color = #db7093>毋畏死亡</font>");

characterIntro("ruoyemumrfz", "Ave Mujica的吉他手若叶睦。沉默寡言的她在罗德岛上大多时候负责一些简单的工作。除此以外，她还在疗养庭院承包了一小块区域，用作果蔬的栽培。");
