import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("spfurongmrfz", {
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["dichenmrfz","zhuoxinmrfz"],
		});

skill({
	"dichenmrfz": {
			init(player, skill) {
				player.storage[skill] = [
					target => {
						target.discard(target.getCards("j"));
					},
					target => {
						target.draw(2);
					},
					target => {
						target.recover();
						target
							.when({ player: "phaseEnd" })
							.then(async (event, trigger, player) => {
								if (player.countCards("h") < 5) player.gain(lib.card.ying.getYing(5 - player.countCards("h")), "gain2");
							})
							.assign({
								mark: true,
								intro: {
									name: "涤尘",
									content(_, player) {
										return `在你的回合结束获得${Math.max(5 - player.countCards("h"), 0)}张【影】`;
									},
								},
								dichenmrfz: true,
							})
							.translation("涤尘")
							.finish();
						let skillList = target.getSkills();
						skillList.forEach(skill => {
							let info = lib.skill[skill];
							if (info.dichenmrfz) {
								target.markSkill(skill);
							}
						});
					},
					target => {
						target.link(false);
						target.turnOver(false);

						// 并入上一项
						const player = get.player();
						const storage = player.storage.dichenmrfz;
						const index = storage.length - 1;
						if (index <= 0) return;

						const prevFunc = storage[index - 1];
						const currentFunc = storage[index];

						storage[index - 1] = target => {
							prevFunc(target);
							currentFunc(target);
						};

						storage.splice(index, 1);
					},
				];
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			onremove: true,
			filterTarget(card, player, target) {
				let num = player.getAttackRange() - get.distance(player, target) + 1;
				let prompt = num < player.storage.dichenmrfz.length ? `执行至第${num}项` : `执行所有项`;
				if (player.inRange(target) || target === player) target.showPrompt(prompt);
				return player.inRange(target) || target === player;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				let storage = player.storage.dichenmrfz;
				let num = Math.min(player.getAttackRange() - get.distance(player, target) + 1, 4);
				if (storage[0] && num > 0) storage[0](target);
				if (storage[1] && num > 1) storage[1](target);
				if (storage[2] && num > 2) storage[2](target);
				if (storage[3] && num > 3) storage[3](target);
			},
			ai: {
				order: 7.49,
				result: {
					player: 1,
					target(player, target) {
						let storage = player.storage.dichenmrfz;
						let x = Math.min(player.getAttackRange() - get.distance(player, target) + 1, 4);
						let num = 1;
						if (get.attitude2(target) < 0) return 0;
						if (x >= storage.length && storage.length > 2) num += 5;
						if (target.hp < 2) num += 3;
						if (target.countCards("h") < 3) num += 1;
						if (target.isTurnedOver()) num += 5;
						if (target.isLinked()) num += 0.5;
						if (target.hasSkill("zhuoxinmrfz")) num += 0.5;
						return num;
					},
				},
			},
		},
	"zhuoxinmrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return game.hasPlayer(current => {
					return current !== player && get.distance(player, current) < 2 && !!player.canUse({ name: "tuixinzhifu" }, current);
				});
			},
			prompt(event, player, name) {
				return get.prompt("zhuoxinmrfz");
			},
			async content(event, trigger, player) {
				player
					.chooseToUse()
					.set("openskilldialog", "视为使用一张【推心置腹】")
					.set("norestore", true)
					.set("_backupevent", "zhuoxinmrfz_backup")
					.set("custom", {
						add: {},
						replace: { window() {} },
					})
					.backup("zhuoxinmrfz_backup");
			},
			subSkill: {
				backup: {
					filterCard: () => false,
					filterTarget(card, player, target) {
						return target !== player && get.distance(player, target) < 2 && player.canUse({ name: "tuixinzhifu" }, target);
					},
					selectTarget: -1,
					selectCard: -1,
					log: false,
					viewAs: {
						name: "tuixinzhifu",
						isCard: true,
					},
				},
			},
		},
});

translate({
	"spfurongmrfz": "濯尘芙蓉",
	"spfurongmrfz_prefix": "濯尘",
	"dichenmrfz": "涤尘",
	"dichenmrfz_info": "出牌阶段限一次，你可以令一名攻击范围内的角色或你依次执行至第X项:<br>1.弃置判定区所有牌；<br>2.摸两张牌；<br>3.回复一点体力并在其回合结束时获得Y张【影】（Y=5-其手牌数）；<br>4.复原武将牌，然后将此项并入上一项。<br>(X=你的攻击距离-你与其的距离+1)",
	"zhuoxinmrfz": "濯心",
	"zhuoxinmrfz_info": "准备阶段，你可以视为对所有与你距离不大于2的其他角色使用一张【推心置腹】。",
});

characterTitle("spfurongmrfz", "<font color='#db7093'>无名之花</font>");

characterIntro("spfurongmrfz", "芙蓉，经过系统的医疗理论培训以及长时间的临床实践训练后，已经由实习医生转为正式医疗干员，并且成为了医疗部的主治医师之一。芙蓉不仅在医疗外勤任务上有相当丰富的经验，在健康管理以及病后护理的理论研究方面也颇有建树。");
