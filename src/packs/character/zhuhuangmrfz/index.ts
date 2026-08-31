import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("zhuhuangmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "yanmrfz",
			hp: 4,
			maxHp: 5,
			skills: ["chongrangmrfz","zhuoyanmrfz","liaoyuanmrfz"],
		});

skill({
	"chongrangmrfz": {
			audio: 2,
			forced: true,
			trigger: {
				player: "phaseBegin",
				source: "damageEnd",
			},
			filter(event, player) {
				if (event.name == "damage") {
					if (event.parent && (event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2")) return false;
					return event.hasNature("fire");
				}
				return player.hujia > 0;
			},
			async content(event, trigger, player) {
				if (trigger.name == "damage") {
					player.changeHujia(1);
				} else {
					await player.recover(Math.min(player.hujia, 2));
					player.changeHujia(-player.hujia);
				}
			},
		},
	"zhuoyanmrfz": {
			init(player) {
				lib.skill["_lianhuan4"].content = function () {
					//@ts-ignore
					if (!trigger.getParent().noCharReset) player.link();
					//@ts-ignore
					if (trigger.getParent().notLink()) trigger.getParent().lianhuanable = true;
				};
			},
			audio: 2,
			trigger: {
				player: "useCardToPlayer",
			},
			forced: true,
			filter(event, player) {
				if (!event.isFirstTarget) return false;
				return event.card && get.tag(event.card, "fireDamage") && event.targets.some(target => target.isIn() && !target.isLinked());
			},
			async content(event, trigger, player) {
				trigger.targets.forEach(target => {
					if (target.isIn() && !target.isLinked()) target.link();
				});
			},
			group: ["zhuoyanmrfz_nolink"],
			subSkill: {
				nolink: {
					audio: false,
					forced: true,
					silent: true,
					trigger: {
						source: "damageBegin",
					},
					lastDo: true,
					filter: function (event, player) {
						return event.card && event.player.isIn();
					},
					async content(event, trigger, player) {
						trigger.noCharReset = true;
					},
				},
			},
		},
	"liaoyuanmrfz": {
			mod: {
				selectTarget(card, player, range) {
					if (card.storage && card.storage.liaoyuanmrfz && range[1] != -1) range[1] += Math.max(1, player.getDamagedHp());
				},
			},
			init(player, skill) {
				player.storage[skill] = {};
			},
			onremove: true,
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			prompt(event) {
				let player = get.player();
				return `流失一点体力并视为使用目标数+${Math.max(1, player.getDamagedHp())}的【火攻】`;
			},
			viewAs: {
				name: "huogong",
				//@ts-ignore
				storage: {
					liaoyuanmrfz: true,
				},
			},
			selectCard: -1,
			filterCard: () => false,
			async precontent(event, trigger, player) {
				player.loseHp();
			},
			group: ["liaoyuanmrfz_after", "liaoyuanmrfz_recorder", "liaoyuanmrfz_fire"],
			subSkill: {
				recorder: {
					charlotte: true,
					silent: true,
					trigger: {
						global: "showCardsEnd",
						player: "useCardAfter",
					},
					filter(event, player) {
						if (event.name === "useCard") return event.card && event.card.storage.liaoyuanmrfz;
						let evt = event.getParent();
						return event.cards && evt && evt.name === "huogong" && evt.card && evt.card.storage && evt.card.storage.liaoyuanmrfz;
					},
					async content(event, trigger, player) {
						if (trigger.name === "useCard") {
							delete player.storage.liaoyuanmrfz[trigger.card.storage.randomId];
						} else {
							let cards = trigger.cards;
							let evt = trigger.getParent();
							//@ts-ignore
							let id = evt.card.cardid;
							if (!Array.isArray(player.storage.liaoyuanmrfz[id])) player.storage.liaoyuanmrfz[id] = [];
							player.storage.liaoyuanmrfz[id].push(...cards);
						}
					},
				},
				fire: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: { global: "damageBegin" },
					firstDo: true,
					filter(event, player) {
						return event.card && event.card.name === "wanjian" && event.card.nature === "fire";
					},
					async content(event, trigger, player) {
						trigger.nature = "fire";
					},
				},
				after: {
					charlotte: true,
					audio: false,
					forced: true,
					trigger: { player: "useCardAfter" },
					firstDo: true,
					filter(event, player) {
						if (!event.card || !event.card.storage || !event.card.storage.liaoyuanmrfz) return false;
						//@ts-ignore
						let damaged = player.getHistory("sourceDamage", evt => evt.card.storage && evt.card.id === event.card.id);
						//@ts-ignore
						let showCards = (player.storage.liaoyuanmrfz[event.card.id] || []).filter(card => get.position(card) === "h");
						return damaged.length > 0 && showCards.length > 0;
					},
					async content(event, trigger, player) {
						//@ts-ignore
						let showCards = player.storage.liaoyuanmrfz[trigger.card.id].filter(card => get.position(card) === "h");
						await player.gain(showCards, "gain2");
						if (player.isUnderControl(true) && !_status.auto) {
							const { targets, cards } = await player.chooseCardTarget({
								showCards: showCards,
								prompt: "【燎原】:你可以将其中任意张牌当作指定等量目标的【火·万箭齐发】使用",
								prompt2: "请选择目标和牌",
								filterCard(card) {
									return get.event().showCards.includes(card);
								},
								selectCard: [1, Infinity],
								filterTarget(card, player, target) {
									return player.canUse("wanjian", target);
								},
								selectTarget: [1, Infinity],
								filterOk() {
									return ui.selected.targets.length === ui.selected.cards.length;
								},
							}).forResult();
							if (!(targets && cards)) return;
							player.useCard(
								{
									name: "wanjian",
									nature: "fire",
								},
								targets,
								cards,
								true
							);
						} else {
							let cards = showCards,
								targets = game.filterPlayer(i => get.attitude(player, i) < 0);
							cards.forEach(card => {
								if (get.value(card) >= 8) cards.remove(card);
							});
							if (targets.length > cards.length) {
								targets = targets.slice(0, cards.length);
							}
							if (!(targets && cards)) return;
							player.useCard(
								{
									name: "wanjian",
									nature: "fire",
								},
								targets,
								cards.slice(0, targets.length),
								true
							);
						}
					},
				},
			},
			ai: {
				order: 9.5,
				result: {
					player(player, target) {
						if (player.hp < 3 || player.countCards("h") < 1) return -1;
						if (player.getUseValue({ name: "huogong" }) <= 0) return -1;
						return 1 + player.countCards("h") * 0.1;
					},
				},
			},
		},
});

translate({
	"zhuhuangmrfz": "烛煌",
	"chongrangmrfz": "重燃",
	"chongrangmrfz_info": "锁定技，当你造成火属性伤害后，你获得一点护甲；回合开始时，你失去所有护甲并回复等量体力（至多为2）。",
	"zhuoyanmrfz": "灼焰",
	"zhuoyanmrfz_info": "锁定技，你造成的伤害不会重置武将牌；当你使用带有火属性标签的牌指定目标时，其横置之。",
	"liaoyuanmrfz": "燎原",
	"liaoyuanmrfz_info": "出牌阶段限一次，你可以流失一点体力并视为使用一张目标数+X的【火攻】，且当此牌结算完毕后，若此牌造成伤害，你获得所有角色手牌区中因此牌展示的牌，然后你可以将其中任意张牌当作指定等量目标的【火·万箭齐发】使用。（X=你已损失的体力值，至少为1）",
});

characterTitle("zhuhuangmrfz", "<font color='red'>燎原之愿</font>");

characterIntro("zhuhuangmrfz", "本名顾烛煌，代号煌，罗德岛精英干员，其施放的法术在破坏力与攻击范围上均达较高标准。兼任近卫干员与术师干员，在攻坚、防守、突袭等多种类型的作战任务中，作为战术核心之一发挥作用。");
