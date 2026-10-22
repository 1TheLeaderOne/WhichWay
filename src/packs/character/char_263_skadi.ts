import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_263_skadi", { pack: "legendSJZX", sex: "female", group: "liemrfz", hp: 4, skills: ["jingliemrfz", "shulangmrfz", "tongmaimrfz"], clans: ["深海猎人"] });

skill({
	jingliemrfz: {
		audio: ["作战中1","作战中2"],
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				return current != player && current.countCards("h") > 0;
			});
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget()
				.set("prompt", get.prompt("jingliemrfz"))
				.set("prompt2",get.skillInfoTranslation("jingliemrfz"))
				.set("filterTarget", (card, player, target) => player != target && target.countCards("h") > 0)
				.set("ai", target => {
					let player = get.event().player;
					let att = get.attitude(player, target),
						num = 0;
					if (att >= 0) num += 2;
					else num += 5 + target.getDamagedHp();
					return (num += target.countCards("h") / 2);
				})
				.forResult();
			event.result = result;
		},
		async content(event, trigger, player) {
			let target = event.targets[0];
			if (target.countCards("h") == 1) player.viewHandcards(target);
			const { links } = await player
				.choosePlayerCard({
					target,
					forced:true,
					visible:true
				})
				.set("prompt", "【鲸猎】:请选择一张牌")
				.set("position", "h")
				.set("ai", button => {
					let player = get.event().player,
						num = get.value(button);
					if (player.hasUseTarget(button, false)) num += 10;
					if (get.tag(button, "damage")) num += 2;
					if (get.type2(button) == "equip") num -= 10;
					return num;
				})
				.forResult();
			if (!links) return;
			let choiceList = [`失去一点体力，令${get.translation(player)}获得${get.translation(links[0])}`, `令${get.translation(player)}视为使用${get.translation(links[0])}并摸一张牌，然后本回合结束阶段时${get.translation(player)}发动一次【鲸猎】`, `对${get.translation(player)}使用一张【杀】，若此杀造成伤害，${get.translation(player)}翻面，反之执行其他两项`],
				list = ["选项一", "选项二"];
			if (target.hasSha() && target.canUse({ name: "sha" }, player, false)) list.push("选项三");
			else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（没有或无法使用【杀】）" + "</span>";
			const { index } = await target
				.chooseControl({controls:list})
				.set("choiceList", choiceList)
				.set("ai", () => {
					let player = get.event().player,
						target = _status.event.targetx,
						list = _status.event.list,
						card = _status.event.cardx;
					if (get.attitude(player, target) > 0) return 1;
					else {
						if (!target.hasUseTarget(card, false)) return 1;
						if (
							list.length > 2 &&
							target.mayHaveShan(
								player,
								"use",
								target.getCards("h", i => {
									return i.hasGaintag("sha_notshan");
								})
							) &&
							Math.random() > 0.5
						) {
							for (let i of player.getCards("h", "sha")) {
								if (get.effect(target, i, player, player) > 0) return 2;
							}
						}
						if (player.hp == 1) return 1;
						return 0;
					}
				})
				.set("targetx", player)
				.set("list", list)
				.set("cardx", links[0])
				.forResult();
			if (typeof index !== "number") return;
			let next = game.createEvent("jingliemrfz_after");
			next.player = player;
			next.target_jingliemrfz = target;
			next.card_jingliemrfz = links[0];
			next.setContent(lib.skill.jingliemrfz["index_" + index]);
		},
		async index_0(event:GameEvent, trigger:GameEvent, player:Player) {
			let target:Player = event.target_jingliemrfz,
				card = event.card_jingliemrfz;
			await player.gain({
				cards:[card],
				animate:"gain2"
			});
			target.loseHp();
		},
		async index_1(event, trigger, player:Player) {
			let target:Player = event.target_jingliemrfz,
				card:Card = event.card_jingliemrfz;
				/**
				 * {
						name: card.name,
						suit: card.suit,
						number: card.number,
					},
				 */
			if (player.hasUseTarget(card, false)){
				await player.chooseUseTarget({
					card:get.autoViewAs({name:card.name ,suit:card.suit , number:card.number}),
					addCount:false,
					nodistance:true
				});
				await player.draw();
			}
			player.when("phaseJieshuBegin").then(async (event, trigger, player) => {
				const filter = lib.skill.jingliemrfz.filter!;
				if (player.hasSkill("jingliemrfz_ban") || !filter(event, player)) return;
				player.addTempSkill("jingliemrfz_ban", "phaseJieshuEnd");
				const result = await player
					.chooseTarget()
					.set("prompt", get.prompt("jingliemrfz"))
					.set("prompt2", get.skillInfoTranslation("jingliemrfz"))
					.set("filterTarget", (card, player, target) => player != target && target.countCards("h") > 0)
					.set("ai", target => {
						let player = get.event().player;
						let att = get.attitude(player, target),
							num = 0;
						if (att >= 0) num += 2;
						else num += 5 + target.getDamagedHp();
						return (num += target.countCards("h") / 2);
					})
					.forResult();
				if (result.targets) {
					let target = result.targets[0];
					player.logSkill("jingliemrfz", target);
					let next = game.createEvent("jingliemrfz_phaseJieshu");
					next.player = player;
					next.targets = result.targets;
					next.setContent(lib.skill.jingliemrfz.content!);
				}
			});
		},
		async index_2(event, trigger, player) {
			let target = event.target_jingliemrfz,
				card = event.card_jingliemrfz;
			await target
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return true;
					},
					"【鲸猎】:对" + get.translation(player) + "使用一张杀"
				)
				.set("forced", true)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
					return player.canUse({ name: "sha" }, target, false);
				})
				.set("sourcex", player);
			if (
				target.hasHistory("useCard", evt => {
					return evt.getParent(2) == event && target.hasHistory("sourceDamage", evtx => evt.card == evtx.card);
				})
			)
				player.turnOver();
			else {
				for (let i = 0; i < 2; i++) {
					let next = game.createEvent("jingliemrfz_noDamage");
					next.player = player;
					next.target_jingliemrfz = target;
					next.card_jingliemrfz = card;
					next.setContent(lib.skill.jingliemrfz["index_" + i]);
				}
			}
		},
		subSkill: {
			ban: {
				charlotte: true,
			},
		},
	},
	shulangmrfz: {
		audio: ["作战中4","作战中3"],
		trigger: {
			target: "useCardToTargeted",
		},
		onremove(player, type) {
			delete player.storage.shulangmrfz_round;
			player.unmarkSkill("shulangmrfz_round");
		},
		filter(event, player) {
			return event.card && event.card.name == "sha" && player.hasSha() && lib.filter.targetEnabled({ name: "sha" }, player, event.player);
		},
		check(event, player) {
			for (let i of player.getCards("hes", "sha")) {
				if (get.effect(event.player, i, player, player) > 0 && get.attitude(player, event.player) < 0) {
					return true;
				} //QQQ
			}
			return false;
		},
		prompt2(event, player) {
			return "你可以对" + get.translation(event.player) + "使用一张杀";
		},
		async content(event, trigger, player) {
			await player
				.chooseToUse({
					filterCard(card, player, event) {
						if (get.name(card) != "sha") return false;
						return true;
					},
					prompt: "请使用一张【杀】",
				})
				.set("forced", true)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("shulangmrfz_card", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
					return player.canUse({ name: "sha" }, target, false);
				})
				.set("sourcex", trigger.player)
				.forResult();
			if (
				player.hasHistory("useCard", evt => {
					return (
						evt &&
						evt.card &&
						evt.name == "useCard" &&
						player.hasHistory("sourceDamage", evtx => {
							return evt.card == evtx.card;
						})
					);
				})
			) {
				trigger.getParent()!.excluded.addArray(trigger.targets);
				if (trigger.player.countGainableCards(player, "he"))
					player
						.gainPlayerCard({
							position: "he",
							target: trigger.player,
							forced: true,
						})
						.set("complexSelect", false)
						.set("ai", lib.card.shunshou.ai.button);
			}
		},
		group: ["shulangmrfz_need","shulangmrfz_round","shulangmrfz_clear"],
		subSkill: {
			clear:{
				charlotte:true,
				silent:true,
				trigger:{
					global:"roundStart"
				},
				firstDo:true,
				async content(event,trigger,player){
					player.unmarkSkill("shulangmrfz_round");
					player.storage.shulangmrfz_round = false;
				},
			},
			round:{
				mod:{
					cardname(card, player, currentname) {
						if(card.name=== "shan" && player.storage.shulangmrfz_round === true) return "sha";
					},
				},
				audio:"shulangmrfz",
				trigger:{
					global:"roundStart"
				},
				intro:{
					content:"·你手牌中的【闪】视为【杀】直到本轮结束",
				},
				prompt2:"你可以令你手牌中的【闪】视为【杀】直到本轮结束",
				async content(event,trigger,player){
					player.storage.shulangmrfz_round = true;
					player.markSkill("shulangmrfz_round");
				},
			},
			need: {
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.getParent(3)!.name == "shulangmrfz" && event.card && event.card.name == "sha";
				},
				silent: true,
				async content(event, trigger, player) {
					const id = trigger.target.playerid;
					const map = trigger.getParent()?.customArgs;
					if (!id || !map) return;
					if (!map[id]) map[id] = {};
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
				},
			},
		},
	},
});

translate({
	char_263_skadi: "斯卡蒂",
	jingliemrfz: "鲸猎",
	jingliemrfz_info: "准备阶段，你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌并摸一张牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。",
	shulangmrfz: "倏浪",
	shulangmrfz_info: "①当你成为【杀】的目标时，你可以对使用者使用一张【杀】（不计入使用次数且需要两张【闪】才可抵消），若此【杀】造成伤害，你取消此杀的所有目标并且获得其一张牌。②每轮开始时，你可以令你手牌中的【闪】视为【杀】直到本轮结束。",
});

characterIntro("char_263_skadi", "斯卡蒂，赏金猎人，现为罗德岛所雇佣。在过去完成的赏金任务中，于对抗大型生物，破坏硬目标，攻坚战，歼灭战等多类行动中展现出强劲实力，推测与其过往战斗经验相关。成为赏金猎人之前的履历缺失。现于罗德岛某攻坚小队供职，同时身兼单兵任务预备执行干员一职。......");

characterTitle("char_263_skadi",whichWayUtil.colorize("#b深海掠食者#"));