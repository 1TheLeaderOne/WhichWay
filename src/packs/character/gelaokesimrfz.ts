import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("gelaokesimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "yimrfz",
			hp: 4,
			skills: ["cichongmrfz","ganraomrfz"],
		});

skill({
	"cichongmrfz": {
			audio: 2,
			init: (player, skill) => {
				player.storage.cichongmrfz = [];
			},
			intro: {
				content: (event, player, storage) => {
					return `已经弃置过的类型：${get.translation(player.storage[storage])}`;
				},
			},
			enable: "phaseUse",
			filter: function (event, player) {
				var hs = player.countCards("he", function (card) {
						return !player.storage.cichongmrfz.includes(get.type2(card));
					}),
					bool = false;
				for (var i of game.players) {
					if (player.canUse("sha", i) || i != player) continue;
					bool = true;
					break;
				}
				return hs > 0 && bool;
			},
			filterCard: function (card) {
				var storage = _status.event.player.storage.cichongmrfz;
				return !storage.includes(get.type2(card));
			},
			filterTarget: lib.filter.notMe,
			position: "he",
			async content(event, trigger, player) {
				player.markSkill("cichongmrfz");
				const target = event.targets[0],
					card = event.cards[0];
				player.storage.cichongmrfz.add(get.type2(card));
				const { bool } = await target
					.chooseToDiscard()
					.set("prompt", `【磁冲】:请弃置一张【闪】或防具牌，否则受到来自${get.translation(player)}的一点伤害`)
					.set("filterCard", card => get.name(card, target) == "shan" || get.subtype(card) == "equip2")
					.set("ai", card => get.value(card) < 8)
					.forResult();
				if (bool) return;
				target.damage();
			},
			ai: {
				order: 4,
				result: {
					target: function (player, target) {
						if (get.attitude(player, target) < 0) {
							return -(1 + target.countCards("h") * 0.1 + target.hp * 0.5);
						}
					},
				},
			},
			group: ["cichongmrfz_add", "cichongmrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.unmarkSkill("cichongmrfz");
						player.storage.cichongmrfz = [];
					},
				},
				add: {
					forced: true,
					firstDo: true,
					trigger: { source: "damageBegin3" },
					filter: function (event, player) {
						return !player.canUse("sha", event.player) && event.player.isIn();
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
		},
	"ganraomrfz": {
			audio: 2,
			init: (player, skill) => {
				player.storage[skill] = [];
			},
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				var storage = player.storage.ganraomrfz;
				return !storage.includes(event.player) && event.player.isIn();
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				let dialog = ["【干扰】:请选择一张牌"],
					list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type(name) == "equip") list.push(["装备", "", name]);
					else if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				//@ts-ignore
				dialog.push([list, "vcard"]);
				const { links } = await player
					.chooseButton(1, true)
					.set("createDialog", dialog)
					.set("ai", button => {
						var target = _status.event.target;
						if (target.hp < 2) return ["tao", "jiu"].randomGet();
						return ["shan", "wuxie", "tao"].randomGet();
					})
					.set("target", trigger.player)
					.forResult();
				if (!links) return;
				if (!trigger.player.storage.ganraomrfz_ban) trigger.player.storage.ganraomrfz_ban = [];
				trigger.player.storage.ganraomrfz_ban.add(links[0][2]);
				trigger.player.addTempSkill("ganraomrfz_ban", { global: "phaseEnd" });
				player.storage.ganraomrfz.add(trigger.player);
			},
			group: ["ganraomrfz_clear"],
			subSkill: {
				ban: {
					mod: {
						cardEnabled2: function (card, player) {
							if (player.storage.ganraomrfz_ban.includes(get.name(card, player))) return false;
						},
					},
					charlotte: true,
					silent: true,
					onremove: (player, skill) => {
						delete player.storage[skill];
					},
					mark: true,
					intro: {
						content: (event, player, storage) => {
							return `不能使用或打出${get.translation(player.storage[storage])}`;
						},
					},
				},
				clear: {
					charlotte: true,
					silent: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.ganraomrfz = [];
					},
				},
			},
		},
});

translate({
	"gelaokesimrfz": "格劳克斯",
	"cichongmrfz": "磁冲",
	"cichongmrfz_info": "①锁定技，你对无法成为你使用的【杀】的目标的角色造成的伤害+1。</br>②出牌阶段，你可以弃置一张本回合未以此法弃置过的类型的牌，选择一名其他角色，然后其须弃置一张【闪】或防具牌，否则你对其造成一点伤害。",
	"ganraomrfz": "干扰",
	"ganraomrfz_info": "每名角色每回合限一次，当你对一名其他角色造成伤害时，你可以声明一张牌，然后其本回合不能使用与你声明的牌相同牌名的牌。",
});

characterIntro("gelaokesimrfz", "格劳克斯出生于阿戈尔地区，却早早离开家园四处流浪。机缘巧合下加入罗德岛，现为雷神工业先端武器测评师。除了对尖端武器进行研究调整之外，格劳克斯也会在需求对空特化的任务中亲自出击。");
