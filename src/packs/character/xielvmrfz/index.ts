import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xielvmrfz", { pack: "rareSJZX",
			sex: "female",
			group: "laimrfz",
			hp: 3,
			skills: ["lvmaimrfz", "tiaoxiemrfz"],
		});

skill({
	"lvmaimrfz": {
			audio: ["作战中1", "作战中2"],
			zhuanhuanji(player, skill) {
				if (player.storage[skill] < 3) player.storage[skill]++;
				else player.storage[skill] = 0;
			},
			init(player, skill) {
				player.storage.lvmaimrfz = 0;
				player.addTip("lvmaimrfz_tip", `律脉 ${get.translation(lib.skill.lvmaimrfz.transfer(player))}`);
			},
			trigger: {
				player: ["useCardAfter", "respondAfter"],
			},
			filter(event, player) {
				return player.countCards("he") > 0;
			},
			mark: true,
			intro: {
				content(storage, player) {
					return `当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为${get.translation(lib.skill.lvmaimrfz.transfer(player))}，你摸一张牌。`;
				},
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard()
					.set("prompt", get.prompt("lvmaimrfz"))
					.set("prompt2", `你可以重铸一张牌,然后若你手牌中最多的花色为${get.translation(lib.skill.lvmaimrfz.transfer(player))},你摸一张牌`)
					.set("filterCard", card => {
						return get.player().canRecast(card);
					})
					.set("ai", function (card) {
						return 8 - get.value(card);
					})
					.set("position", "he")
					.forResult();
			},
			async content(event, trigger, player) {
				await player.recast(event.cards);
				let suit = lib.skill.lvmaimrfz.transfer(player);
				let suitcount = lib.suit.map(s => player.countCards("h", { suit: s }));
				let max = Math.max(...suitcount);
				if (player.countCards("h", { suit: suit }) === max) {
					await player.draw();
					player.changeZhuanhuanji("lvmaimrfz");
					player.addTip("lvmaimrfz_tip", `律脉 ${get.translation(lib.skill.lvmaimrfz.transfer(player))}`);
				}
			},
			transfer(player) {
				switch (player.storage.lvmaimrfz) {
					case 0:
						return "spade";
					case 1:
						return "club";
					case 2:
						return "heart";
					case 3:
						return "diamond";
					default:
						return "";
				}
			},
		},
	"tiaoxiemrfz": {
			audio: ["作战中3", "作战中4"],
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: true,
			mark: true,
			intro: {
				content(storage, player) {
					return `已使用的花色：${get.translation(storage)}`;
				},
			},
			enable: "chooseToUse",
			filter(event, player) {
				return (
					player.getCards("h", card => {
						if (!["basic", "trick"].includes(get.type(card))) return false;
						let suit = get.suit(card);
						return player.countCards("h", card => get.suit(card) !== suit) > 0 && event.filterCard(card, player, event);
					}).length > 0
				);
			},
			filterCard(card) {
				let player = get.player(),
					event = get.event();
				let suit = get.suit(card);
				//@ts-ignore
				if (event.skillDialog instanceof HTMLElement) {
					//@ts-ignore
					event.skillDialog.remove();
					//@ts-ignore
					event.skillDialog = ui.create.dialog(`###【调协】###${lib.skill.tiaoxiemrfz.prompt()}`);
				}
				if (ui.selected.cards.length < 1) {
					//@ts-ignore
					if (Object.keys(event.getParent("phaseUse")).length > 0 && event.getParent("phaseUse").player === player && !player.hasUseTarget(card)) return false;
					else if (!event._backup.filterCard(card, player)) return false;
					return player.countCards("h", card => get.suit(card) !== suit) > 0 && ["basic", "trick"].includes(get.type(card)) && !player.getStorage("tiaoxiemrfz").includes(suit);
				}
				return suit !== get.suit(ui.selected.cards[0]);
			},
			selectCard: 2,
			check(card) {
				let player = get.player();
				if (ui.selected.cards.length < 1) return player.getUseValue(card);
				return player.getUseValue(card) - player.getUseValue(ui.selected.cards[0]);
			},
			prompt() {
				let player = get.player();
				return ui.selected.cards.length < 1 ? `【调协】:请选择你要被当作使用的牌<br>(当前已使用的花色：${get.translation(player.getStorage("tiaoxiemrfz"))})` : `你可以将一张手牌当【${get.translation(ui.selected.cards[0].name)}】使用`;
			},
			complexCard: true,
			discard: false,
			lose: false,
			delay: 0,
			async content(event, trigger, player) {
				player.storage.tiaoxiemrfz.push(get.suit(event.cards[0]));
				let name = get.name(event.cards[0]);

				//@ts-ignore
				if (Object.keys(event.getParent("phaseUse")).length>0 && event.getParent("phaseUse").player === player) await player.chooseUseTarget({ name: name }, [event.cards[1]]).set("forced", true);
				else {
					//@ts-ignore
					if (name === "wuxie") event._trigger = event.getParent(2)._trigger;
					const result = await player.useCard({ name: name }, [event.cards[1]]).set("forced", true).forResult();
					//@ts-ignore
					event.getParent(2)._result = result;
				}
			},
			group: ["tiaoxiemrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						player.storage.tiaoxiemrfz = [];
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},
});

translate({
	"xielvmrfz": "协律",
	"lvmaimrfz": "律脉",
	"lvmaimrfz_info": "转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为①♠②♣③♥④♦，你摸一张牌。",
	"tiaoxiemrfz": "调协",
	"tiaoxiemrfz_info": "你可以将一张牌当你手牌中其他花色的普通锦囊或基本牌(每轮每种花色限一次)使用。",
});

characterTitle("xielvmrfz", "<font color = #8b9dda66>绝对音准</font>");

characterIntro("xielvmrfz", "协律，本名托妮娅·克朗，来自莱塔尼亚偏远小镇的调谐师。于一场暴风雪导致的声场核心过载事故中不慎感染上矿石病，后来经介绍来到罗德岛，接受治疗的同时，致力于为罗德岛的音乐环境提供力所能及的支持与辅助，并作为术师干员协助战斗。");
