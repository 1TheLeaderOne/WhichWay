import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("xigymrfz", { pack: "legendSJZX",
			sex: "female",
			group: "suimrfz",
			hp: 3,
			skills: ["huijuanmrfz","dianjingmrfz","cangjuanmrfz"],
		});

skill({
	"huijuanmrfz": {
			intro: { content: "记录的牌名:$" },
			onremove: true,
			audio: 2,
			forced: true,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				//@ts-ignore
				if (get.type(event.card) == "equip") return false;
				//@ts-ignore
				if (get.type(event.card) == "trick" && player.hasSkill("huijuanmrfz_trick")) return false;
				//@ts-ignore
				if (get.type(event.card) == "basic" && player.hasSkill("huijuanmrfz_basic")) return false;
				//@ts-ignore
				if (get.type(event.card) == "delay" && player.hasSkill("huijuanmrfz_delay")) return false;
				return !player.getStorage("huijuanmrfz").includes(event.card.name);
			},
			async content(event, trigger, player) {
				player.markAuto("huijuanmrfz", [trigger.card.name]);
				//@ts-ignore
				if (get.type(trigger.card) == "trick") player.addSkill("huijuanmrfz_trick");
				//@ts-ignore
				if (get.type(trigger.card) == "delay") player.addSkill("huijuanmrfz_delay");
				//@ts-ignore
				if (get.type(trigger.card) == "basic") player.addSkill("huijuanmrfz_basic");
			},
			group: ["huijuanmrfz_use", "huijuanmrfz_clear"],
			subSkill: {
				//检测技能
				basic: {
					silent: true,
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeSkill("huijuanmrfz_basic");
					},
				},
				trick: {
					silent: true,
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeSkill("huijuanmrfz_trick");
					},
				},
				delay: {
					silent: true,
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeSkill("huijuanmrfz_delay");
					},
				},
				//非检测技能
				clear: {
					silent: true,
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.getStorage("huijuanmrfz").length;
					},
					async content(event, trigger, player) {
						for (var i = 0; i < 2; i++) player.unmarkAuto("huijuanmrfz", [player.getStorage("huijuanmrfz")[0]]);
					},
				},
				use: {
					hiddenCard: function (player, name) {
						if (name == "wuxie") return player.getStorage("huijianmrfz").includes(name);
					},
					enable: ["chooseToRespond", "chooseToUse"],
					filter: function (event, player) {
						if (player.getStorage("huijuanmrfz").length == 0 || player.countCards("h") == 0) return false;
						for (var i = 0; i < player.getStorage("huijuanmrfz").length; i++) {
							if (
								event.filterCard(
									{
										name: player.getStorage("huijuanmrfz")[i],
									},
									player,
									event
								)
							)
								return true;
						}
						return false;
					},
					chooseButton: {
						dialog: function (event, player) {
							var list = [];
							var storage = player.getStorage("huijuanmrfz");
							for (var i of lib.inpile) {
								if (event.filterCard({ name: i }, player, event) && storage.includes(i))
									list.push([get.type(i) == "basic" ? "基本" : "锦囊", "", i]);
							}
							return ui.create.dialog("绘卷", [list, "vcard"], "hidden");
						},
						filter: function (button, player) {
							return lib.filter.cardEnabled(
								{
									//@ts-ignore
									name: button.link[2],
								},
								player,
								_status.event.getParent()
							);
						},
						check: function (button) {
							var player = _status.event.player;
							var card = {
								//@ts-ignore
								name: button.link[2],
							};
							if (player.getUseValue(card) > 0) return get.order(card);
							return -1;
						},
						backup: function (links, player) {
							return {
								audio: "huijuanmrfz",
								popname: true,
								filterCard: true,
								position: "hs",
								viewAs: {
									name: links[0][2],
								},
								check: function (card) {
									return 6 - get.value(card);
								},
								async precontent(event, trigger, player) {
									const cards = event.result.card;
									if (!cards || !event.parent) return;
									if (cards.name == "sha" || cards.name == "jiu") event.parent.addCount = false;
									player.unmarkAuto("huijuanmrfz", [cards.name]);
								},
							};
						},
						prompt: function (links, player) {
							return "将一张手牌当做【" + get.translation(links[0][2]) + "】使用";
						},
					},
					ai: {
						order: 13,
						result: {
							player: 1,
						},
					},
				},
			},
			ai: {
				threaten: 1.3,
			},
		},
	"dianjingmrfz": {
			mark: true,
			locked: false,
			zhuanhuanji: true,
			marktext: "☯",
			intro: {
				content: function (event, player) {
					return !player.storage.dianjingmrfz
						? "当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的牌名相同的牌。"
						: "当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的类型相同的牌。";
				},
			},
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				return !event.card.isCard;
			},
			frequent: true,
			async content(event, trigger, player) {
				var cardt = get.cardPile2(function (card) {
					//@ts-ignore
					return get.type(card, "trick") == get.type(trigger.card);
				});
				var cardf = get.cardPile2(trigger.card.name);
				if (player.storage.dianjingmrfz == true) {
					if (cardt) player.gain(cardt, "gain2", "log");
					//@ts-ignore
					else player.chat("牌堆中没有", cardt, "牌");
				} else {
					if (cardf) player.gain(cardf, "gain2", "log");
					else player.chat("牌堆中没有【" + get.translation(trigger.card.name) + "】");
				}
				player.changeZhuanhuanji("dianjingmrfz");
			},
		},
	"cangjuanmrfz": {
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("cangjuanmrfz")) {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("cangjuanmrfz")) return false;
				},
			},
			audio: 2,
			trigger: { player: "gainBegin" },
			filter: function (event, player) {
				return player.countMark("cangjuanmrfz") < 3;
			},
			forced: true,
			async content(event, trigger, player) {
				player.addMark("cangjuanmrfz", 1, false);
				trigger.gaintag.add("cangjuanmrfz");
			},
			group: "cangjuanmrfz_remove",
			subSkill: {
				remove: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.removeMark("cangjuanmrfz", 3);
						player.removeGaintag("cangjuanmrfz");
					},
				},
			},
		},
});

translate({
	"xigymrfz": "夕",
	"huijuanmrfz": "绘卷",
	"huijuanmrfz_info": "①锁定技，你记录每轮第一张没有被记录过的被使用的普通锦囊牌、基本牌和非延时锦囊的牌名；你的回合结束时，你删除所有被记录的牌名。②你可以将一张手牌当做你记录的牌名的牌使用或打出（此牌不计入使用次数），然后删除你使用的牌的牌名。",
	"dianjingmrfz": "点睛",
	"dianjingmrfz_info": "转换技，当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的阳:牌名相同;阴:类型相同的牌。",
	"cangjuanmrfz": "藏卷",
	"cangjuanmrfz_info": "锁定技，你每轮前三次获得牌于本轮不计入手牌上限。",
});

characterTitle("xigymrfz", "<font color=#f6b3fa>工笔入画</font>");

characterIntro("xigymrfz", "夕，炎国画家，待业。在留舰人员年的积极行动下，被以访客身份挟持至罗德岛。擅长绘画，尤其是炎国传统绘画。现寓居罗德岛某偏僻走道的墙内。");
