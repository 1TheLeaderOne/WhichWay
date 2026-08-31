import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("docmrfz", { pack: "epicSJZX",
			sex: "male",
			group: "othermrfz",
			hp: 4,
			skills: ["yizhemrfz","zhulimrfz"],
		});

skill({
	"yizhemrfz": {
			mod: {
				ignoredHandcard: function (card, player) {
					if (get.name(card) == "tao") {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && get.name(card) == "tao") return false;
				},
			},
			init() {
				var enable = lib.card.tao.enable;
				lib.card.tao.enable = function (card, player) {
					if (player.hasSkill("yizhemrfz")) {
						return true;
					}
					return enable(card, player);
				};
				var selectTarget = lib.card.tao.selectTarget;
				lib.card.tao.selectTarget = function () {
					var player = _status.event.player;
					if (player.hasSkill("yizhemrfz")) {
						return [1, 1]; //QQQ
					}
					return selectTarget;
				};
				var filterTarget = lib.card.tao.filterTarget;
				lib.card.tao.filterTarget = function (card, player, target) {
					if (player.hasSkill("yizhemrfz")) {
						return target.hp < target.maxHp && (player.inRange(target) || player == target);
					}
					return filterTarget(card, player, target);
				};
				lib.card.tao.content = async function (event, trigger, player) {
					const { target } = event;
					if (player.hasSkill("yizhemrfz")) {
						var num = target.getDamagedHp();
						target.recover(5);
						if (5 - num > 0) {
							target.addSkill("yizhemrfz_eff");
							target.storage.yizhemrfz_eff = 5 - num;
							target.changeHujia(5 - num);
						}
					} else target.recover();
				};
			},
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			filter(event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			forced: true,
			async content(event, trigger, player) {
				var cards = [];
				if (ui.cardPile.childNodes.length < 1) return;
				for (var i of ui.cardPile.childNodes) {
					if (cards.length > 2) break;
					//@ts-ignore
					if (i.name == "tao") cards.push(i);
				}
				if (cards.length > 0) player.gain(cards, "gain2");
				else player.chat("byd怎么开局牌堆中的桃就没了？");
			},
			subSkill: {
				eff: {
					mark: true,
					intro: {
						content(event, player) {
							return `你因【桃】而获得的护甲数:${player.storage.yizhemrfz_eff}`;
						},
					},
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						if (!player.hujia) return;
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff > 0) {
							player.storage.yizhemrfz_eff--;
							player.changeHujia(-1);
							player.popup("失去护甲");
							game.log(player, "失去了一点因【桃】而获得的护甲值");
						}
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff == 0) {
							player.removeSkill("yizhemrfz_eff");
							delete player.storage.yizhemrfz_eff;
							player.unmarkSkill("yizhemrfz_eff");
						}
					},
					group: "yizhemrfz_lose",
				},
				lose: {
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.hujia;
					},
					charlotte: true,
					silent: true,
					async content(event, trigger, player) {
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff > 0) {
							player.storage.yizhemrfz_eff--;
						}
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff == 0) {
							player.removeSkill("yizhemrfz_eff");
							delete player.storage.yizhemrfz_eff;
							player.unmarkSkill("yizhemrfz_eff");
						}
					},
				},
			},
		},
	"zhulimrfz": {
			mod: {
				cardname(card, player, name) {
					if (card.hasGaintag("zhulimrfz")) return "tao";
				},
			},
			audio: 2,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			async content(event, trigger, player) {
				if (player.getStat("damage") != undefined) {
					if (player.countCards("he") > 0) player.chooseToDiscard("he", true, `【医者】:请选择弃置一张牌`);
				} else {
					const result = await player.draw(2).forResult();
					if (!result) return;
					var cards = result.cards;
					if (!cards) return;
					for (var i of cards) {
						var num = get.number(i);
						//@ts-ignore
						if (get.suit(i) == "heart" && num >= 2 && num <= 9) {
							i.addGaintag("zhulimrfz");
						}
					}
				}
			},
		},
});

translate({
	"docmrfz": "医生",
	"yizhemrfz": "医者",
	"yizhemrfz_info": "锁定技，你的【桃】不计入手牌上限；游戏开始时，你从牌堆中获得三张【桃】；你手牌中的【桃】的描述改为\"①出牌阶段，对自己或在你攻击范围内的其他角色使用，目标角色回复X点体力，获得5-X点护甲（每轮开始时目标角色会失去一点因此获得的护甲）。②当有角色处于濒死状态时，对该角色使用。目标角色回复X点体力，获得5-X点护甲（每轮开始时目标角色会失去一点因此获得的护甲）。（X = 目标角色已损失的体力值）\"",
	"zhulimrfz": "铸犁",
	"zhulimrfz_info": "锁定技，结束阶段，若你本回合造成过伤害，你弃置一张牌，反之，你摸两张牌且其中的♡2-9视为【桃】。",
});

characterTitle("docmrfz", "<font color=#DC143C>利他主义</font>");

characterIntro("docmrfz", "医生是彩虹小队成员之一，为人亲和体贴，乐于助人，极受队友们的信任。<br>医生随身携带一把MPD-0激素手枪。该武器可以从远距离向目标注射具有急救功能的药剂，为受伤的队友提供可靠的救助。");
