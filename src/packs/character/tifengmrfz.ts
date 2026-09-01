import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayTips } from "../../tips/index.ts";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("tifengmrfz", { pack: "legendSJZX",
			sex: "female",
			hp: 4,
			group: "samrfz",
			skills: ["lieqiongmrfz", "tifengmrfz_lieshimrfz"],
		});

skill({
	"lieqiongmrfz": {
			audio: "ruiyamrfz",
			derivation: ["wangong", "xinliegong"],
			trigger: {
				player: "useCard",
			},
			forced: true,
			firstDo: true,
			filter(event, player) {
				return (
					event.card &&
					get.name(event.card) === "sha" &&
					event.card.cards &&
					event.card.cards.some(card => ["red", "black"].includes(get.color(card) || ""))
				);
			},
			async content(event, trigger, player) {
				let color = ["red", "black"];
				//@ts-ignore
				trigger.card.cards.forEach(card => {
					let colorx = get.color(card) || "";
					if (color.includes(colorx)) {
						color.remove(colorx);
						switch (colorx) {
							case "red":
								player.addSkill("wangong2");
								break;
							case "black":
								player
									.when({
										player: "useCardAfter",
										global: "roundStart",
									})
									.filter((event, player) => {
										if (event.name === "phase") return true;
										return event.card.cardid === trigger.card.cardid;
									})
									.step(async (event, trigger, player) => {
										if (trigger.name === "phase") return;
										player.removeSkill("lieqiongmrfz_enchanting_liegong");
									});
								player.storage.lieqiongmrfz_enchanting_liegong = trigger.card.cardid;
								player.addSkill("lieqiongmrfz_enchanting_liegong");
								break;
						}
					}
				});
			},
			subSkill: {
				enchanting_liegong: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "useCardToTargeted",
					},
					onremove: true,
					filter(event, player) {
						return event.card.cardid === player.storage.lieqiongmrfz_enchanting_liegong;
					},
					async content(event, trigger, player) {
						//@ts-ignore
						lib.skill.xinliegong.content(event, trigger, player);
					},
				},
			},
		},
	"tifengmrfz_lieshimrfz": {
			audio: "shouliemrfz",
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return player.countCards("h") > 0 && player.hasUseTarget({ name: "sha", nature: "stab" }, false, false);
			},
			filterTarget(card, player, target) {
				const judge = () => player.canUse({ name: "sha", nature: "stab" }, target, false, false) && target !== player;

				if (judge()) whichWayTips.addPrompt(target, `摸${get.distance(player, target)}张牌`, "tifengmrfz_lieshimrfz", "uncheckBegin");
				else whichWayTips.addPrompt(target, `不是合法目标`, "tifengmrfz_lieshimrfz", "uncheckBegin");
				return !!judge();
			},
			selectCard: () => {
				let player = get.player();
				return Math.max(1, Math.floor(player.countCards("h") / 2));
			},
			filterCard: () => true,
			prompt: "你可以将一半的手牌（向下取整，至少为1）当作一张无距离和次数限制的刺【杀】对一名其他角色使用，然后你摸X张牌。（X=目标角色与你的距离）",
			discard: false,
			lose: false,
			delay: false,
			check(card) {
				let num = 8 - get.value(card);
				if (!ui.selected.cards.map(i => get.color(i)).includes(get.color(card))) num += 2;
				return num;
			},
			async content(event, trigger, player) {
				const { cards, targets } = event;
				await player
					.chooseUseTarget({ name: "sha", nature: "stab" }, cards)
					.set("forced", true)
					//@ts-ignore
					.set("filterTarget", (card, player, target) => target === get.event().targetx)
					.set("targetx", event.target)
					.set("nodistance", true)
					.set("addCount", false)
					.forResult();
				if (!cards || !targets) return;
				let target = targets[0];
				if (get.distance(player, target) > 0) player.draw(get.distance(player, target));
			},
			ai: {
				order: 3,
				result: {
					player: function (player, target) {
						if (get.attitude2(target) > 0) return -1;
						return get.distance(player, target) + Math.min(2, target.getDamagedHp());
					},
				},
			},
		},
});

translate({
	"tifengmrfz": "提丰",
	"tifengmrfz_lieshimrfz": "裂矢",
	"tifengmrfz_lieshimrfz_info": "出牌阶段限一次，你可以将一半的手牌（向下取整，至少为1）当一张无距离和次数限制的刺【杀】对一名其他角色使用，然后你摸X张牌。（X=目标角色与你的距离）",
	"lieqiongmrfz": "裂穹",
	"lieqiongmrfz_info": "锁定技，当你使用【杀】时，若此杀对应的实体牌的颜色有:<br>红色：此杀${get.poptip(\"sjzx_enchanting\")}“挽弓”<br>黑色：此杀${get.poptip(\"sjzx_enchanting\")}“烈弓”。",
});

characterTitle("tifengmrfz", "<font color=2942BA>永恒狩猎</font>");

characterIntro("tifengmrfz", "提丰，活跃于萨米的萨卡兹，以猎人自居，对萨米的自然环境和潜在威胁有着充足的知识储备和应对技巧。现应干员麦哲伦邀请与罗德岛进行合作，协助罗德岛在萨米及无尽冰原地区的事务。");
