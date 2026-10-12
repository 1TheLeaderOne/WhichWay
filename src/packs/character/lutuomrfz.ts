import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("lutuomrfz", { pack: "rareSJZX", sex: "female", group: "bomrfz", hp: 4, skills: ["zhengyimrfz", "daosimrfz"] });

skill({
	zhengyimrfz: {
		mod: {
			ignoredHandcard: function (card, player) {
				if (card.hasGaintag("zhengyimrfz")) {
					return true;
				}
			},
			cardDiscardable: function (card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("zhengyimrfz")) return false;
			},
			targetInRange: function (card: Card) {
				if (card.hasGaintag && card.hasGaintag("zhengyimrfz")) return true;
			},
		},
		audio: ["完成高难行动","行动出发","行动开始","作战中4"],
		trigger: {
			global: "die",
		},
		filter(event, player) {
			return event.player.countCards("hej") > 0;
		},
		frequent: true,
		prompt2(event, player) {
			return `是否获得${get.translation(event.player)}区域内的${event.player.countCards("hej")}张牌？`;
		},
		async content(event, trigger, player) {
			event.togain = trigger.player.getCards("hej");

			player.gain(event.togain, trigger.player, "giveAuto", "bySelf").gaintag.add("zhengyimrfz");
		},
		group: "zhengyimrfz_draw",
		subSkill: {
			draw: {
				audio: "zhengyimrfz",
				forced: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) return false;

						for (let i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("zhengyimrfz")) return true;
						}
						return false;
					});
				},

				async content(event, trigger, player) {
					let tagCards = player.getCards("h").filter(i => i.hasGaintag("zhengyimrfz"));
					player.drawTo(player.maxHp + tagCards.length);
				},
			},
		},
	},
	daosimrfz: {
		audio: ["作战中1","作战中2"],
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			//@ts-ignore
			const card:Card = ui.discardPile.lastChild;
			return ui.discardPile.lastChild && get.type(card) != "equip" && event.filterCard({ name: card.name }, player, event);
		},
		filterCard: true,
		check(card) {
			return get.value(ui.discardPile.lastChild) - get.value(card);
		},
		viewAs() {
			//@ts-ignore
			const card:Card = ui.discardPile.lastChild;
			return {
				name: card.name,

				nature: card.nature,
			};
		},
		prompt() {
			return `你可以将一张手牌当做${get.translation(ui.discardPile.lastChild)}使用或打出`;
		},
		ai: {
			order: 8,
			result: {
				player: 1,
			},
		},
	},
});

translate({
	lutuomrfz: "露托",
	zhengyimrfz: "整遗",
	zhengyimrfz_info: "当一名其他角色死亡后，你可以获得其区域内所有牌，因此获得的牌不计入手牌上限且当你使用此牌后，你将手牌补至X张。（X = 你的体力上限 + 你手牌中因“整遗”而获得的牌的数量）",
	daosimrfz: "悼思",
	daosimrfz_info: "若弃牌堆顶的牌不为装备牌，你可以将一张牌当做与弃牌堆顶牌同名的牌使用或打出。",
});

characterTitle("lutuomrfz", "<font color=#00868B>止戈胜悼</font>");

characterIntro("lutuomrfz", "露托，曾在玻利瓦尔各交战地区活动，不从属于任何当地组织，以战场打扫工作为生。现今在本舰接受治疗，并与后勤部签订合作协议，偶尔以战场环境顾问的身份支援外勤任务。");
