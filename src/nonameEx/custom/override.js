import { lib, game, ui, get, ai, _status, Game, Get } from "noname";
import { whichWayAPIOverride } from "../../override/index.js";

/**
 * 修改酒
 * 用于技能：调酒
 */
whichWayAPIOverride.overrideAPI("lib.skill.jiu", {
	trigger: {
		player: "useCard1",
	},
	filter: function (event, player) {
		if (player.hasSkill("tiaojiumrfz")) {
			return event.card && (get.type(event.card) == "trick" || get.type(event.card) == "basic") && event.card.name != "jiu";
		}
		return event.card && event.card.name == "sha";
	},
	forced: true,
	charlotte: true,
	firstDo: true,
	content: function () {
		/**@ts-ignore */
		if (!player.hasSkill("tiaojiumrfz")) {
			/**@ts-ignore */
			if (!trigger.baseDamage) trigger.baseDamage = 1;
			/**@ts-ignore */
			trigger.baseDamage += player.storage.jiu;
		} else {
			/**@ts-ignore */
			trigger.effectCount += player.storage.jiu;
		}
		/**@ts-ignore */
		trigger.jiu = true;
		/**@ts-ignore */
		trigger.jiu_add = player.storage.jiu;
		/**@ts-ignore */
		game.addVideo("jiuNode", player, false);
		/**@ts-ignore */
		game.broadcastAll(function (player) {
			player.removeSkill("jiu");
			/**@ts-ignore */
		}, player);
	},
	temp: true,
	vanish: true,
	silent: true,
	popup: false,
	nopop: true,
	onremove: function (player) {
		if (player.node.jiu) {
			player.node.jiu.delete();
			player.node.jiu2.delete();
			delete player.node.jiu;
			delete player.node.jiu2;
		}
		delete player.storage.jiu;
	},
	ai: {
		damageBonus: true,
		skillTagFilter: function (player, tag, arg) {
			if (tag === "damageBonus") return arg && arg.card && arg.card.name === "sha" && !player.hasSkill("tiaojiumrfz");
		},
	},
	group: "jiu2",
});
whichWayAPIOverride.overrideAPI("lib.skill.jiu2.filter", function (event, player) {
	if (player.hasSkillTag("jiuSustain", null, event.name)) return false;
	if (event.name == "useCard") {
		if (player.hasSkill("tiaojiumrfz")) {
			return event.card && (get.type(event.card) == "trick" || get.type(event.card) == "basic") && event.card.name != "jiu";
		}
		return event.card && event.card.name == "sha";
	}
	return true;
});

// 将兵临城下模式的【兵临城下】添加到lib.card中
if (!lib.card.binglinchengxia) {
	lib.card["binglinchengxia"] = {
		fullskin: true,
		image: "ext:WhichWay/image/card/binglinchengxia.webp",
		type: "delay",
		filterTarget: function (card, player, target) {
			return lib.filter.judge(card, player, target) && player != target;
		},
		judge: function (card) {
			if (get.suit(card) == "diamond") return 0;
			return -3;
		},
		effect: function () {
			"step 0";
			// @ts-ignore
			if (result.bool == false) {
				if (
					// @ts-ignore
					!player.countCards("e", function (card) {
						return lib.filter.cardDiscardable(
							card,
							// @ts-ignore
							player,
							"shuiyanqijuny"
						);
					})
				) {
					// @ts-ignore
					player.damage("nosource");
					// @ts-ignore
					event.finish();
					return;
				} else
					// @ts-ignore
					player.chooseControl("discard_card", "take_damage", function (event, player) {
						if (get.damageEffect(player, event.player, player) >= 0) {
							return "take_damage";
						}
						if (player.hp >= 3 && player.countCards("e") >= 2) {
							return "take_damage";
						}
						return "discard_card";
					});
				// @ts-ignore
			} else event.finish();
			("step 1");
			// @ts-ignore
			if (result.control == "discard_card") {
				// @ts-ignore
				player.discard(
					// @ts-ignore
					player.getCards("e", function (card) {
						return lib.filter.cardDiscardable(
							card,
							// @ts-ignore
							player,
							"shuiyanqijuny"
						);
					})
				);
				// @ts-ignore
			} else player.damage("nosource");
		},
		ai: {
			order: 1,
			value: 3,
			useful: 2,
			tag: {
				damage: 1,
				loseCard: 1,
			},
			result: {
				// @ts-ignore
				target: function (player, target, card, isLink) {
					var es = target.getCards("e");
					if (!es.length) return -1.5;
					var val = 0;
					for (var i of es) val += get.value(i, target);
					return -Math.min(1.5, val / 5);
				},
			},
		},
	};
	lib.translate["binglinchengxia"] = "兵临城下";
	lib.translate["binglinchengxia_info"] = "出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。";
}

//特蕾西娅&特雷西斯技能初始化
let duplicateSkills = ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz"];
let targetSkill = get.info("chenkemrfz");
for (let skill of duplicateSkills) {
	lib.translate[skill] = lib.translate["chenkemrfz"];
	lib.translate[skill + "_info"] = lib.translate["chenkemrfz_info"];
	lib.skill[skill] = {
		...targetSkill,
		audio: skill === "chenke3mrfz" ? "chenkemrfz" : false,
	};
}