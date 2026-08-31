import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("shanjimrfz", {
			sex: "male",
			group: "othermrfz",
			hp: 4,
			skills: ["shandunmrfz","xuanmumrfz","chuandunmrfz"],
		});

skill({
	"shandunmrfz": {
			mod: {
				globalFrom: function (from, to, distance) {
					if (from.isAction()) return distance - 1;
					return distance + 1;
				},
				globalTo: function (from, to, distance) {
					if (!to.isAction()) return distance + 1;
					return distance - 1;
				},
			},
		},
	"xuanmumrfz": {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (player.storage.xuanmumrfz_roundcount >= 4) return false;
				if (!event.targets || event.targets.length > 1) return false;
				if (get.distance(player, event.targets[0]) > 1) return false;
				if (event.targets[0].countCards("h") < 1) return false;
				//@ts-ignore
				const type = get.type(event.card);
				return event.targets[0] != player && (type == "basic" || type == "trick");
			},
			check: function (event, player) {
				return get.attitude(event.targets[0], player) < 0;
			},
			async content(event, trigger, player) {
				if (!player.storage.xuanmumrfz_roundcount) player.storage.xuanmumrfz_roundcount = 0;
				player.storage.xuanmumrfz_roundcount++;
				const result = await player.choosePlayerCard(trigger.targets[0], true, "h").forResult();
				("step 1");
				if (result.cards) {
					const card = result.cards[0];
					//@ts-ignore
					player.showCards(card, get.translation(player) + "对" + get.translation(trigger.target) + "发动了【炫目】");

					if (!canRespond(trigger.card, card)) {
						//@ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current != player && current == trigger.targets[0];
							})
						);
						if (trigger.targets[0].countGainableCards(player, "h")) {
							player.gainPlayerCard("h", trigger.targets[0], true);
						}
						if (Math.random() < 0.25) trigger.targets[0].chat("有闪盾！");
					}
				}

				function canRespond(card1, card2) {
					/**@ts-ignore */
					var info1 = get.name(card1),
						/** @ts-ignore */
						info2 = get.name(card2);
					var tmp_bool = false;
					if ((info1 == "sha" || info1 == "wanjian") && info2 == "shan") tmp_bool = true;
					if ((info1 == "juedou" || info1 == "nanman") && info2 == "sha") tmp_bool = true;
					/**@ts-ignore */
					if (get.type(card1) == "trick" && info2 == "wuxie") tmp_bool = true;
					var str = (tmp_bool == true ? "" : "不") + "能响应";
					info1 = "<font color=rgb(255,255,122)>【" + get.translation(info1) + "】</font>";
					info2 = "<font color=rgb(255,255,122)>【" + get.translation(info2) + "】</font>";
					game.log(info2, str, info1);
					return tmp_bool;
				}
			},
			group: "xuanmumrfz_roundcount",
			subSkill: {
				roundcount: {
					mark: true,
					init: player => {
						player.storage.xuanmumrfz_roundcount = 0;
						player.markSkill("xuanmumrfz_roundcount");
					},
					onremove: true,
					intro: {
						content: function (event, player) {
							return player.storage.xuanmumrfz_roundcount + "/4";
						},
						markcount: function (event, player) {
							if (!player.storage.xuanmumrfz_roundcount) return 4;
							return 4 - player.storage.xuanmumrfz_roundcount;
						},
					},
					trigger: {
						global: "roundStart",
					},
					forced: true,
					popup: false,
					silent: true,
					async content(event, trigger, player) {
						player.storage.xuanmumrfz_roundcount = 0;
					},
				},
			},
		},
	"chuandunmrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "damageEnd" },
			async content(event, trigger, player) {
				const result = await player.draw("visible").forResult();

				if (result.cards) {
					var card = result.cards[0];
					if ((card.suit == "heart" || card.suit == "spade") && card.number == 6) {
						player.loseHp(player.hp);
					}
				}
			},
		},
});

translate({
	"shanjimrfz": "闪击",
	"shandunmrfz": "闪盾",
	"shandunmrfz_info": "锁定技，若你于本轮[有/没有]执行过回合，其他角色与你和你与其他角色计算的距离[-1/+1]。",
	"xuanmumrfz": "炫目",
	"xuanmumrfz_info": "每轮限四次，当你使用单一目标的基本牌或普通锦囊牌选择了其他角色为目标后，且你与其的距离不大于1，你可以展示其一张手牌，若其展示的牌不能响应你对其使用的牌，则其不能响应此牌且你获得其一张手牌。",
	"chuandunmrfz": "穿盾",
	"chuandunmrfz_info": "锁定技，当你受到伤害后，你摸一张牌并展示之，若此牌的花色和点数为♠6或♥6，你失去<span style=\"text-decoration:line-through\">1145141919810点</span>所有体力。",
	"chuandunmrfz_append": "THX,Ubi",
});

characterIntro("shanjimrfz", "闪击，彩虹小队的成员之一，为人幽默和蔼，擅长在室内与街巷环境作战。</br>以手枪为主要武器，同时携带经G52型闪光战术护盾，一旦在近战中开启，将能致盲几米内的作战目标，为整个小队提供战术优势。");
