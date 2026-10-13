import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("fulankamrfz", { pack: "epicSJZX", sex: "female", group: "gemrfz", hp: 3, skills: ["jifengmrfz", "xiqiaomrfz"] });

skill({
	jifengmrfz: {
		audio: 2,
		trigger: {
			player: "useCard2",
		},
		filter: function (event, player) {
			if (event.targets && event.targets.length > 1) return false;
			return event.cards && event.card.name == "sha";
		},
		check: function (event, player) {
			return get.attitude(player, event.targets[0]) < 0;
		},
		prompt: function (event, player) {
			let target = event.targets[0],
				list:string[] = [];
			if (!target.hasEmptySlot(2)) list.push("无视防具");
			if (target.countCards("h") > 0) list.push("此【杀】需要两张闪才可抵消");
			if (target.hujia > 0) list.push("无视护甲");
			return "【极锋】:是否对" + get.translation(target) + "发动‘极锋’？（" + list + "）";
		},
		async content(event, trigger, player) {
			let target = trigger.targets[0],
				num = 0;
			if (!target.hasEmptySlot(2)) {
				num++;
				target.addTempSkill("qinggang2");
				target.storage.qinggang2.add(trigger.card);
				target.markSkill("qinggang2");
			}
			if (target.countCards("h") > 0) {
				num++;
				player.addTempSkill("jifengmrfz_sha");
				player.storage.jifengmrfz = {
					card: trigger.card,
				};
			}
			if (target.hujia > 0) {
				target.addTempSkill("jifengmrfz_ighujia");
				target.storage.jifengmrfz_ighujia.add(trigger.card);
				target.markSkill("jifengmrfz_ighujia");
				num++;
			}
			if (!player.hasSkill("jifengmrfz_used")) {
				player.addTempSkill("jifengmrfz_used", "phaseEnd");
				player.draw(3 - num);
			}
		},
		subSkill: {
			sha: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				silent: true,
				filter: function (event, player) {
					let info = player.storage.jifengmrfz;
					if (!event.card || event.card != info.card) return false;
					return event.card.name == "sha" && !event.getParent()!.directHit.includes(event.target);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const id = trigger.target.playerid;
					const map = trigger.getParent()?.customArgs;

					if (!map || !id) return;

					if (!map[id]) map[id] = {};
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
					delete player.storage.jifengmrfz;
					player.removeSkill("jifengmrfz_sha");
				},
				ai: {
					directHit_ai: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1) return false;
					},
				},
			},
			used: {
				charlotte: true,
			},
			ighujia: {
				ai: {
					nohujia: true,
				},
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				onremove: true,
				trigger: {
					player: ["damage", "damageCancelled", "damageZero"],
					source: ["damage", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
					global: ["useCardEnd"],
				},
				charlotte: true,
				firstDo: true,
				filter: function (event, player) {
					return player.storage.jifengmrfz_ighujia && event.card && player.storage.jifengmrfz_ighujia.includes(event.card) && (event.name != "damage" || event.notLink());
				},
				silent: true,
				forced: true,
				popup: false,
				priority: 12,
				async content(event, trigger, player) {
					player.storage.jifengmrfz_ighujia.remove(trigger.card);
					if (!player.storage.jifengmrfz_ighujia.length) player.removeSkill("jifengmrfz_ighujia");
				},
				marktext: "✘",
				intro: {
					name: "✘",
					content: "当前护甲已失效",
				},
			},
		},
		ai: {
			threaten: 1.2,
		},
	},
	xiqiaomrfz: {
		audio: 2,
		trigger: {
			player: ["chooseToRespondBegin", "chooseToUseBegin"],
		},
		filter: function (event, player) {
			if (player.hasSkill("xiqiaomrfz_used")) return false;
			if (event.responded) return false;
			if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) return false;
			if (event.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) return false;
			return true;
		},
		check: () => true,
		async content(event, trigger, player) {
			player.addTempSkill("xiqiaomrfz_used", "phaseEnd");
			const next = player.chooseToDiscard({
				position:"he",
				forced:true
			});
			next.set("prompt", "【细巧】:你可以弃置一张牌，然后摸一张牌并展示之，若类型不同，视为使用或打出一张【闪】");

			const result = await next.forResult();

			if (!result.cards) return;

			let cardl = result.cards[0];

			const { cards } = await player.draw().set("visible",true).forResult();

			if (!cards) return;
			let card = cards[0];

			if (get.type2(card) != get.type2(cardl)) {
				trigger.untrigger();
				trigger.set("responded", true);
				trigger.result = { bool: true, card: { name: "shan", isCard: true } };
			}
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
		ai: {
			respondShan: true,
			threaten: 0.8,
		},
	},
	// shuangzimrfz: {
	// 	audio: 2,
	// },
});

translate({
	fulankamrfz: "芙兰卡",
	jifengmrfz: "极锋",
	jifengmrfz_info: "当你使用【杀】选择唯一目标后，你可以执行所有符合条件的选项：1.若其防具栏不为空，你无视其防具；2.若其有护甲值，你无视此护甲；3.若其有手牌，此【杀】须要两张【闪】才可抵消，然后若你本回没有使用过此技能，你摸X张牌。（X=未执行的选项数）",
	xiqiaomrfz: "细巧",
	xiqiaomrfz_info: "每回合限一次，当你需要使用或打出【闪】时，你可以弃置一张牌，然后摸一张牌并展示之，若与你弃置的牌类别不同，视为你使用或打出了一张【闪】。",
	// shuangzimrfz: "双子",
	// shuangzimrfz_info: "①锁定技，你使用的牌在进入弃牌堆或造成伤害时之前视为无对应实体牌、无点数和无花色的牌；当你的手牌数少于你的体力上限时，你获得等同于你体力上限与手牌数之差的【影】；当你造成伤害后，若对应的实体牌为【影】，则令其回复等同于此次伤害数的体力，然后其展示所有手牌且不可响应下一张指定其为目标的【杀】。<br>②每回合限一次，你可以将一张【影】当作任意基本牌和普通锦囊牌使用，你以此法使用的【杀】不计入次数限制。",
});

characterIntro("fulankamrfz", "芙兰卡，黑钢国际生化防护相应人员安全保障专员，在行动护卫、战术突击、战术协同方面拥有丰富经验与强悍战力。</br>现于罗德岛接受矿石病治疗，并作为黑钢行动干员为罗德岛提供专业安保服务。");
