import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("chuxuemrfz", { pack: "epicSJZX", sex: "female", group: "xiemrfz", hp: 3, skills: ["shengnvmrfz", "shenshemrfz"] });

skill({
	shengnvmrfz: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter: function (event, player) {
			return (
				game.countPlayer(current => {
					return current != player;
				}) > 1
			);
		},
		selectTarget: 2,
		filterTarget: lib.filter.notMe,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			let targets:Player[] = event.targets,
				targets2:any[] = [],
				// [<第二名角色的选项>，<第一名角色的选项>]
				csn:any[] = [undefined, undefined];
			while (targets.length > 0) {
				let target = targets[0],
					list:string[] = [],
					csList = ["收回所有装备区的牌", "将一张手牌当【乐不思蜀】置于你的判定区", "不能响应下一张指定你为目标的基本牌或普通锦囊牌"];
				if (target.countCards("e") > 0) {
					list.push("选项一");
				} else csList[0] = '<span style="opacity:0.5; ">' + csList[0] + "（不可选：装备区没有牌）" + "</span>";
				for (let i of target.getCards("h")) {
					const card = get.autoViewAs({name:"lebu" , cards:[i]},[i]);
					if (!target.canAddJudge(card,player)) continue;
					list.push("选项二");
					break;
				}
				if (!list.includes("选项二")) csList[1] = '<span style="opacity:0.5; ">' + csList[1] + "（不可选：无法对自己使用【乐不思蜀】）" + "</span>";
				list.push("选项三");
				if (list.length == 0) continue;
				const { control } = await target
					.chooseControl({controls:list})
					.set("choiceList", csList)
					.set("ai", function () {
						let list = _status.event.list;
						if (list.includes("选项二")) list.remove("选项二");
						return list.randomGet();
					})
					.set("target", target)
					.set("list", list)
					.forResult();
				if (!control) continue;
				csn[targets.length - 1] = control;
				targets2.add(target);
				switch (control) {
					case "选项一":
						target.gain({
							cards:target.getCards("e"),
							animate:"gain2"
						});
						break;
					case "选项二": {
						const { cards } = await target
							.chooseCard()
							.set("forced",true)
							.set("prompt", "【圣女】:请选择一张手牌当【乐不思蜀】置于你的判定区")
							.set("filterCard", card => {
								const cardx = get.autoViewAs({name:"lebu" , cards:[card]},[card]);
								return target.canAddJudge(cardx,get.player());
							})
							.set("ai", card => {
								return 6 - get.value(card);
							})
							.forResult();
						if (!cards) break;
						target.useCard({
							card:get.autoViewAs({name:"lebu" , cards:cards},cards),
							targets:[target],
							cards
						});
						break;
					}
					case "选项三":
						target.addMark("shengnvmrfz_direct", 1, false);
						break;
				}
				targets.shift();
			}
			if (csn[0] != csn[1]) {
				for (let i of targets2) {
					if (!i.countGainableCards(player, "he")) continue;
					player.gainPlayerCard({
						position:"he",
						target:i,
						forced:true
					}).set("ai", lib.card.shunshou.ai.button);
				}
			} else player.draw(2);
		},
		ai: {
			order: 13,
			result: {
				target: -1,
			},
		},
		global: "shengnvmrfz_direct",
		subSkill: {
			direct: {
				charlotte: true,
				direct: true,
				intro: {
					content: "不能响应下#张指定你为目标的基本牌或普通锦囊牌",
				},
				trigger: {
					target: "useCardToPlayered",
				},
				filter: function (event, player) {
					//@ts-ignore
					return player.countMark("shengnvmrfz_direct") > 0 && (get.type(event.card) == "basic" || get.type(event.card) == "trick");
				},
				async content(event, trigger, player) {
					//@ts-ignore
					player.logSkill("shengnvmrfz");
					player.removeMark("shengnvmrfz_direct", 1, false);
					//@ts-ignore
					trigger.directHit.add(player);
				},
			},
		},
	},
	shenshemrfz: {
		audio: 2,
		forced: true,
		trigger: { target: "useCardToTargeted" },
		filter: function (event, player) {
			if (player.countCards("h", card => get.is.shownCard(card)) < 1) return false;
			let max = 0,
				shown = player.getCards("h", card => get.is.shownCard(card));
			for (let i of shown) {
				if ((i?.number || 0) > max) max = (i.number || 0);
			}
			let number = get.number(event.card);
			if (number != null && Number(number) > max) return false;
			return event.player.countCards("he") > 0 && event.player != player && get.tag(event.card, "damage") > 0;
		},
		async content(event, trigger, player) {
			let list:string[] = [],
				source = trigger.player,
				tranTmp = function (str) {
					let list = ["e", "h"];
					let cn = ["装备", "手牌"];
					for (let i = 0; i < list.length; i++) {
						if (str == list[i]) return cn[i];
					}
				};
			if (source.countCards("h") > 0) list.push("h");
			if (source.countCards("e") > 0) list.push("e");
			let num = list.length;
			if (num == 0) return;
			source
				.chooseToDiscard()
				.set("forced",true)
				.set("position", "he")
				.set("prompt", `【神慑】:请弃置${list.length > 1 ? tranTmp(list[0]) + "和" + tranTmp(list[1]) : tranTmp(list[0])}区的一张牌`)
				.set("selectCard", num)
				.set("filterCard", card => {
					if (ui.selected.cards.length == 0) return true;
					if (get.position(ui.selected.cards[0]) == "h") return get.position(card) == "e";
					return get.position(card) == "h";
				})
				.set("complexCard", true)
				.set("ai", card => {
					return 8 - get.value(card);
				});
		},
		ai: {
			threaten: 0.6,
		},
		group: "shenshemrfz_show",
		subSkill: {
			show: {
				audio: "shenshemrfz",
				forced: true,
				trigger: { player: "phaseJieshuBegin" },
				filter: function (event, player) {
					return player.countCards("h", card => !get.is.shownCard(card)) > 0 && player.countCards("h", card => get.is.shownCard(card)) == 0;
				},
				async content(trigger, event, player) {
					let hs = player.getCards("h", card => !get.is.shownCard(card));
					if (hs.length == 0) return;
					player.addShownCards({
						cards:hs,
						gaintag:["visible_shenshemrfz"]
					});
				},
			},
		},
	},
});

translate({
	chuxuemrfz: "初雪",
	shengnvmrfz: "圣女",
	shengnvmrfz_info: "出牌阶段限一次，你可以选择两名其他角色，然后这两名角色同时选择一项：<br>1.收回所有装备区的牌；<br>2.将一张手牌当作【乐不思蜀】置入其的判定区；<br>3.不能响应下一张指定其为目标的基本牌或普通锦囊牌。<br>若这些角色选择的选项不同，你获得这些角色一张牌，反之你摸两张牌。",
	shenshemrfz: "神慑",
	shenshemrfz_info: "锁定技。<br>①结束阶段，若你没有明置的手牌，你明置你的手牌<br>②当你成为其他角色使用的带有伤害类标签的牌的目标后，若此牌的点数不大于你明置的牌中点数最大的一张牌，则其须弃置手牌区和装备区内各一张牌。",
});

characterTitle("chuxuemrfz", "<font color=#C0C0C0>谢拉格的圣女</font>");

characterIntro("chuxuemrfz", "初雪，谢拉格出身，喀兰圣女，全谢拉格的宗教领袖。运用神赐的圣铃，呼唤风雪的力量。现通过保密途径来到罗德岛，具体担任事务与驻留时间不便公开。");
