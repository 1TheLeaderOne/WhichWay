import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("huangmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["newyanxunmrfz","newfeixuemrfz"],
		});

skill({
	"newyanxunmrfz": {
			audio: "yanxunmrfz",
			intro: {
				content: "本回合手牌上限+#",
			},
			trigger: {
				player: lib.phaseName.map(c => `${c}Skipped`),
			},
			forced: true,
			async content(event, trigger, player) {
				player.addMark("newyanxunmrfz", 1, false);
				player.draw();
				if (!player.storage.newyanxunmrfz_addTempSkill) {
					game.broadcastAll(player => {
						player.storage.newyanxunmrfz_addTempSkill = true;
						//@ts-ignore
					}, player);
					player
						.when({ player: "phaseEnd" })
						.then(() => {
							player.removeMark("newyanxunmrfz", player.countMark("newyanxunmrfz"), false);
							game.broadcastAll(player => {
								delete player.storage.newyanxunmrfz_addTempSkill;
								//@ts-ignore
							}, player);
						})
						.assign({
							mod: {
								maxHandcard(player, num) {
									return (num += player.countMark("newyanxunmrfz"));
								},
							},
						});
				}
			},
		},
	"newfeixuemrfz": {
			audio: "feixuemrfz",
			trigger: {
				player: "useCard2",
			},
			mark: true,
			intro: {
				content(_, player) {
					//@ts-ignore
					return _status.currentPhase === player ? `被跳过的阶段：${get.translation(player.skipList)}` : "不是你的回合";
				},
			},
			filter(event, player) {
				let next = lib.skill.newfeixuemrfz.getNextPhase(event, player);
				//@ts-ignore
				return get.tag(event.card, "damage") && event.targets && next && _status.currentPhase === player;
			},
			getNextPhase(event, player) {
				let name;
				if (lib.phaseName.indexOf(event.name) === -1) {
					let evt = event;
					while (true) {
						if (lib.phaseName.includes(evt.name)) {
							name = evt.name;
							break;
						}
						evt = evt.parent;
					}
				} else {
					name = event.name;
				}
				let i = lib.phaseName.indexOf(name) + 1;
				while (true) {
					if (i > lib.phaseName.length) return;
					let phase = lib.phaseName[i];
					if (player.skipList.includes(phase)) {
						i++;
						continue;
					}
					return phase;
				}
			},
			prompt2(event, player) {
				let next = lib.skill.newfeixuemrfz.getNextPhase(event, player);
				//@ts-ignore
				return `你可以跳过本回合下个没有被跳过的阶段(${get.translation(next)})，然后此牌的目标角色(${get.translation(event.targets)})需要打出一张【闪】才能响应此牌。`;
			},
			check(event, player) {
				let next = lib.skill.newfeixuemrfz.getNextPhase(event, player);
				if (["phaseUse", "phaseDraw"].includes(next)) return false;
				let val = 0;
				event.targets.forEach(target => {
					val += get.effect(target, event.card, player, player);
				});
				return val > 0;
			},
			async content(event, trigger, player) {
				player.skip(lib.skill.newfeixuemrfz.getNextPhase(event, player));
				player.draw();
				for (let target of trigger.targets) {
					const { bool } = await target
						.chooseToRespond()
						.set("prompt", `请打出一张【闪】，否则${get.translation(trigger.card)}不可响应`)
						.set("filterCard", function (card, player) {
							if (get.name(card) !== "shan") return false;
							return lib.filter.cardRespondable(card, player);
						})
						.set("ai", card => {
							let evt = _status.event.getParent(4);
							//@ts-ignore
							let player = get.event().targetx;
							//@ts-ignore
							let target = get.event().targetxx;
							//@ts-ignore
							let cardx = get.event().cardx;
							if (player.hasSkillTag("freeShan")) return 1;
							if (
								//@ts-ignore
								player.countCards("hs", c => {
									return get.canRespond(cardx, player).includes(c.name);
								}) <
									cardx.name ===
								"sha"
									? 2
									: 1
							)
								return -1;
							if (get.damageEffect(player, target, player) >= 0) return 0;
							return get.order(card);
						})
						.set("targetx", target)
						.set("targetxx", player)
						.set("cardx", trigger.card)
						.forResult();
					//@ts-ignore
					if (bool === false) trigger.directHit.add(target);
				}
			},
		},
});

translate({
	"huangmrfz": "煌",
	"newyanxunmrfz": "严训",
	"newyanxunmrfz_info": "锁定技，任意阶段开始时，若此阶段将会被跳过，你摸一张牌且本回合手牌上限+1。",
	"newfeixuemrfz": "沸血",
	"newfeixuemrfz_info": "当你于回合内使用伤害类牌选择目标后，你可以跳过本回合下个没有被跳过的阶段，然后你摸一张牌且此牌的目标角色需要打出一张【闪】，否则其无法响应此牌。",
});

characterIntro("huangmrfz", "煌，罗德岛精英干员，在机动作战、歼灭战与突袭作战中体现出了专业的战斗技巧与战术素养。现由阿米娅带领，作为攻坚战的战术核心之一发挥作用。");
