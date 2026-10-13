import { lib, game, ui, get, ai, _status } from "noname";
import { skillCustomFunc } from "../../nonameEx/custom/skill.ts";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_362_saga", { pack: "legendSJZX", sex: "female", group: "dongmrfz", hp: 4, skills: ["huanyoumrfz", "wenxinmrfz"] });

skill({
	//默认技能组
	huanyoumrfz: {
		audio: ["作战中1", "作战中2"],
		forced: true,
		trigger: {
			player: "gainAfter",
		},
		filter(event, player) {
			return !player.isPhaseUsing() && event.cards.length > 0 && event.getParent()!.name !== "huanyoumrfz";
		},
		async content(event, trigger, player) {
			player.gain(lib.card.ying.getYing(trigger.cards.length), "gain2");
		},
		group: ["huanyoumrfz_hideHandCards"],
		subSkill: {
			hideHandCards: {
				audio: "huanyoumrfz",
				forced: true,
				trigger: { player: "phaseUseBegin" },
				async content(event, trigger, player) {
					let handcard = player.node.handcards1.parentElement;
					player.node.washTip = ui.create.div(handcard, ".washTip");
					player.node.washTip.innerHTML = "洗牌中...";

					let hs: Card[] = [];
					let origin = player.getCards("h");
					for (let i = 0; i < player.getCards("h").length; i++) {
						let r = origin.randomGet();
						hs.push(r);
						origin.remove(r);
					}
					game.broadcastAll(
						function (hs, player) {
							//@ts-ignore
							hs.forEach(i => i.goto(ui.special));
							//@ts-ignore
							player.directgain(hs, false);
						},
						hs,
						//@ts-ignore
						player
					);
					player.addTempSkill("huanyoumrfz_hideHandCards_eff", { player: "phaseEnd" });
				},
			},
			hideHandCards_eff: {
				mod: {
					cardname(card, player, name) {
						if (card.storage.huanyoumrfz) {
							return "cuoe_huanyoumrfzCard";
						}
					},
				},
				charlotte: true,
				silent: true,
				init(player) {
					//@ts-ignore
					if (!player.node.handcards1.cardMod) {
						//@ts-ignore
						player.node.handcards1.cardMod = {};
					}
					//@ts-ignore
					if (!player.node.handcards2.cardMod) {
						//@ts-ignore
						player.node.handcards2.cardMod = {};
					}
					let cardMod = function (card) {
						return ["幻有", "手牌对你不可见"];
					};
					//@ts-ignore
					player.node.handcards1.cardMod.huanyoumrfz = cardMod;
					//@ts-ignore
					player.node.handcards2.cardMod.huanyoumrfz = cardMod;
					player.node.handcards1.classList.add("huanyoumrfz");
					player.node.handcards2.classList.add("huanyoumrfz");

					player.getCards("h").forEach(i => {
						i.storage.huanyoumrfz = true;
						i.dataset.skilltag = "huanyoumrfz";
					});

					setTimeout(() => {
						player.node.washTip.remove();
						delete player.node.washTip;
					}, 1000);
				},
				onremove(player) {
					player.node.handcards1.classList.remove("huanyoumrfz");
					player.node.handcards2.classList.remove("huanyoumrfz");
					//@ts-ignore
					delete player.node.handcards1.cardMod.huanyoumrfz;
					//@ts-ignore
					delete player.node.handcards2.cardMod.huanyoumrfz;
					player.getCards("h").forEach(i => {
						if (i.storage.huanyoumrfz) {
							delete i.storage.huanyoumrfz;
							delete i.dataset.skilltag;
						}
					});
				},
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					//@ts-ignore
					return event.card.storage?.huanyoumrfz && event.cards.length === 1 && !event.card.failToUse && !event.getParent()!.noTriggerHuanyoumrfz;
				},
				async content(event, trigger, player) {
					trigger.cards.forEach(card => {
						if (card.storage.huanyoumrfz) player.draw();
					});
				},
			},
		},
		ai: {
			neg: true,
		},
	},
	wenxinmrfz: {
		audio: ["作战中3", "作战中4"],
		derivation: "zhishuimrfz",
		group: ["wenxinmrfz_achieve", "wenxinmrfz_turnOver", "wenxinmrfz_fail"],
		subSkill: {
			achieve: {
				audio: true,
				logAudio() {
					return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 1);
				},
				forced: true,
				skillAnimation: true,
				animationColor: "metal",
				lastDo: true,
				trigger: {
					player: "phaseEnd",
				},
				filter(event, player) {
					let useList = player
						.getHistory("useCard", evt => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz)
						.map(evt => {
							//@ts-ignore
							return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
						});

					let count = 0;
					for (let name of useList) {
						if (name === "ying") {
							count = 0;
							continue;
						}
						count++;
						if (count >= 3) return true;
					}

					return false;
				},
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("wenxinmrfz");
					player.addSkills(["zhishuimrfz"]);
					player.loseMaxHp();
				},
			},
			turnOver: {
				audio: true,
				logAudio() {
					return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 3);
				},
				trigger: {
					player: "useCardAfter",
				},
				lastDo: true,
				filter(event, player) {
					//@ts-ignore
					return player.countCards("h", card => card.storage.huanyoumrfz) > 0 && event.card.storage?.huanyoumrfz && event.cards.length === 1 && !event.getParent()!.noTriggerHuanyoumrfz;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseCard()
						.set("prompt", get.prompt("wenxinmrfz"))
						.set("prompt2", `你可以令一张背面朝上的手牌正面朝上`)
						.set("filterCard", card => card.storage.huanyoumrfz)
						.set("ai", () => Math.random())
						.forResult();
				},
				async content(event, trigger, player) {
					let card = event.cards[0];
					delete card.storage.huanyoumrfz;
					delete card.dataset.skilltag;
				},
			},
			fail: {
				audio: true,
				logAudio() {
					return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 2);
				},
				forced: true,
				trigger: {
					player: "phaseEnd",
				},
				firstDo: true,
				filter(event, player) {
					let useList = player
						.getHistory("useCard", evt => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz)
						.map(evt => {
							//@ts-ignore
							return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
						});
					//@ts-ignore
					return (
						(useList.length === 0 || (useList[0] === "ying" && new Set(useList).size === 1)) &&
						!player
							.getHistory("skipped")
							.map(evt => evt.name)
							.includes("phaseUse")
					);
				},
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("wenxinmrfz");
					player.addSkill(["wenxinmrfz_fail_buff"]);
					player.markSkill("wenxinmrfz_fail_buff");
				},
			},
			fail_buff: {
				charlotte: true,
				silent: true,
				trigger: {
					player: "phaseDrawBegin",
				},
				intro: {
					content: "·每个摸牌阶段开始时获得一张【影】<br>·如真似幻，扑朔迷离。",
				},
				async content(event, trigger, player) {
					player.gain(lib.card.ying.getYing(1), "gain2");
				},
			},
		},
	},
	zhishuimrfz: {
		audio: ["选中干员1", "选中干员2"],
		forced: true,
		trigger: {
			player: "useCardBegin",
		},
		filter(event, player) {
			return event.card.storage?.huanyoumrfz && !event.card.storage?.zhishuimrfz && event.card.cards.length === 1 && !player.hasUseTarget(event.card.cards[0].name);
		},
		async content(event, trigger, player) {
			await player.useCard({
				card: get.autoViewAs({
					name: "dongzhuxianji",
					suit: trigger.card.suit,
					number: trigger.card.number,
					nature: trigger.card.nature,
					storage: {
						...trigger.card.storage,
						zhishuimrfz: true,
					},
				}),
				cards: trigger.cards,
				targets: [player],
			});
			trigger.cancel();
		},
	},

	//何处寻驼?
	qianxianmrfz: {
		audio: "huanyoumrfz",
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
			return player === event.target || event.getParent()!.triggeredTargets3.length === 1;
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
	ziwumrfz: {
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
	dunkongmrfz: {
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
				.then(async (event, trigger, player) => {
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
});

translate({
	char_362_saga: "嵯峨",

	//默认技能组
	huanyoumrfz: "幻有",
	huanyoumrfz_info: "锁定技，①当你不应此技能而于出牌阶段外获得牌后，你获得等量的【影】。②出牌阶段开始时，你洗切手牌并令手牌本回合背面朝上，每当你于出牌阶段使用一张背面朝上的手牌后，你摸一张牌。③你可以使用至多5次背面朝上的手牌且当你使用背面朝上的手牌时，若其有合法目标，你使用之，否则将其置入弃牌堆。",
	wenxinmrfz: "问心",
	wenxinmrfz_info: "使命技，当你使用一张背面朝上的手牌后，你可以令一张手牌正面朝上。<br>成功：结束阶段，若你本回合连续使用了至少三张非【影】的手牌，你减少一点体力上限并获得“止水”。<br>失败：结束阶段，若你本回合没有使用过非【影】的手牌且出牌阶段未被跳过，你每个摸牌阶段开始时获得一张【影】。",
	zhishuimrfz: "止水",
	zhishuimrfz_info: "锁定技，当你使用一张背面朝上的手牌时，若其不能被合法的使用，则你将此牌视为【洞烛先机】使用。",

	//何处寻驼?
	qianxianmrfz: "千相",
	qianxianmrfz_info: "锁定技，当你成为或指定基本牌或普通锦囊牌的目标后，若你[记录/没有记录]此牌，你[移除此牌的记录/记录此牌并取消此牌的所有目标],然后[你/此牌的使用者]模[一/两]张牌。",
	ziwumrfz: "自悟",
	ziwumrfz_info: "觉醒技，准备阶段，若“千相”记录了至少5张牌，你将体力值回复至3点，移除“千相”记录的牌名并摸等量张牌，然后你获得“遁空”。",
	dunkongmrfz: "遁空",
	dunkongmrfz_info: "出牌阶段限一次，你可以令“千相”失效直到回合结束，然后你摸X张牌，且令本回合出【杀】次数+X；你计算与他角色距离-X；手牌上限+X，并于回合结束时随机移除“千相”中记录的一张牌。（X为“千相”记录牌名且至多为5）",
});

characterTitle("char_362_saga", "<font color = #a52a2a>空即有</font>");

characterIntro("char_362_saga", "嵯峨，东国出身的云游僧人。部分经历不明。原本只是因迷路而误入罗德岛办事处，经询问本人也有求职意向，于是随后通过测试加入罗德岛。在此之前似乎已与罗德岛干员炎熔建立关系。</br>十分善用随身的薙刀，身手矫健，作为先锋干员活跃在前线。");
