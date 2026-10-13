import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

/**
 * 晓歌 3血
观火 你使用牌指定其他角色为目标时，若目标角色本局游戏第一次成为你使用牌的目标，你可以获得其一张牌。
浮光 锁定技，①出牌阶段，你使用或打出每种花色的第一张手牌无距离限制且不计入使用次数，若此牌未造成伤害，你摸一张牌；②当你于你的回合外首次受到伤害时，取消之。
无漏 出牌阶段，你可以弃置四张牌，然后你摸四张牌并选择一项（若你以此法弃置了四张花色各不相同的牌，改为选择两项）：1.重置你“浮光”使用过的花色；2.重置你“观火”指定过的角色。
 */
const NAME = "xiaogemrfz";

character(NAME, {
	hp: 3,
	skills: ["guanhuomrfz", "fuguangmrfz", "wanquanmrfz"],
	group: "bomrfz",
	sex: "female",
	pack: "epicSJZX",
	designer: ["培嵩"],
});

characterTitle(NAME, whichWayUtil.colorize("#r不发声者#"));
characterIntro(NAME, "晓歌，罗德岛驻玻利瓦尔办事处在难民区解救出来的矿石病患者，转交本舰进行后续治疗。根据本人意愿，于半年后以正式干员身份加入罗德岛。");

translate({
	[NAME]: "晓歌",

	guanhuomrfz: "观火",
	guanhuomrfz_info: "你使用牌指定其他角色为目标时，若其没有被本技能记录，你可以记录之，然后你获得其一张牌。",

	fuguangmrfz: "浮光",
	fuguangmrfz_info: "锁定技，<br>①出牌阶段，你使用的未被此技能记录花色的手牌无距离限制且不计入使用次数，若此牌未造成伤害，你摸一张牌。你于出牌阶段使用的牌结算完毕后，你记录此牌的花色；<br>②当你于你的回合外首次受到伤害时，取消之。",

	wanquanmrfz: "万全",
	wanquanmrfz_info: `出牌阶段限一次，你可以${get.poptip("sjzx_zhiheng")}4并选择一项（若你以此法弃置了四张花色各不相同的牌，改为选择两项）：1.重置你【浮光】记录过的花色；2.重置你【观火】记录过的角色。`,
});

skill({
	guanhuomrfz: {
		audio: ["观看作战记录", "行动出发"],
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			const target = event.target;
			return !getStorageGuanhuo(player).includes(target) && player !== target;
		},
		init(player, skill) {
			player.storage[skill] = [];
		},
		onremove: true,
		mark: true,
		intro: {
			mark(dialog, storage, player, event, skill) {
				if (getStorageGuanhuo(player).length < 1) {
					dialog.addText("·无记录角色");
					return;
				}
				dialog.addText("·已记录角色");
				dialog.addSmall([getStorageGuanhuo(player).map(c => c.name), "character"]);
			},
		},
		prompt2(event, player) {
			return `是否记录该角色(${get.translation(event.target)})，然后你获得其一张牌？`;
		},
		check(event, player) {
			return 114514 - get.attitude(event.player, player);
		},
		async content(event, trigger, player) {
			getStorageGuanhuo(player).add(trigger.target);
			await player.gainPlayerCard({
				target: trigger.target,
				position: "h",
				ai(button) {
					return get.value(button.link);
				},
			});
		},
	},
	fuguangmrfz: {
		mod: {
			targetInRange(card: Card, player) {
				if (!getStoragefuguang_suits(player).includes(get.suit(card)!)) {
					return true;
				}
			},
		},
		audio: ["部署1", "部署2"],
		forced: true,
		init(player, skill) {
			player.storage[skill] = {
				suits: [],
				damaged: false,
			};
		},
		onremove(player, type) {
            player.removePromptSJZX("fuguangmrfz_prompt");
            delete player.storage.fuguangmrfz;
        },
		trigger: {
			player: ["useCardAfter", "damageBegin4"],
		},
		filter(event, player, name, target) {
			if (event.name === "useCard") {
				return player.isPhaseUsing() && !getStoragefuguang_suits(player).includes(get.suit(event.card) || "");
			}
			return _status.currentPhase !== player && !getStoragefuguang_damaged(player);
		},
		mark: true,
		intro: {
			content(storage, player, skill) {
				return `·已记录的花色:${get.translation(getStoragefuguang_suits(player))}`;
			},
		},
		async content(event, trigger, player) {
			if (trigger.name === "useCard") {
				const card = trigger.card;
				getStoragefuguang_suits(player).add(get.suit(trigger.card)!);
				if (player.getStat("card")?.[card.name]) {
					player.getStat("card")[card.name] -= 1;
				}
				player.when({ player: "useCardAfter" }).step(async (event, trigger, player) => {
					if (
						player.getHistory("sourceDamage", evt => {
							if (!evt.card) return false;
							return evt.card === trigger.card;
						}).length < 1
					) {
						player.draw();
					}
				});
				return;
			}
			player.storage["fuguangmrfz"]["damaged"] = true;
			player.addTempSkill("fuguangmrfz_clear_damaged", { global: "roundStart" });
			trigger.cancel();
		},
        group:["fuguangmrfz_gain_tips","fuguangmrfz_clear_tips"],
		subSkill: {
            gain_tips:{
                charlotte:true,
                silent:true,
                trigger:{
                    player:["phaseUseBegin","useCardAfter","gainAfter"]
                },
                lastDo:true,
                async content(event,trigger,player){
                    refreshTips(player);
                },
            },
            clear_tips:{
                charlotte:true,
                silent:true,
                trigger:{
                    player:"phaseUseEnd"
                },
                async content(event,trigger,player){
                    player.removePromptSJZX("fuguangmrfz_prompt");
                },
            },
			clear_damaged: {
				mark: true,
				intro: {
					content: "·【浮光②】已发动",
				},
				charlotte: true,
				onremove(player, type) {
					player.storage["fuguangmrfz"]["damaged"] = false;
				},
			},
		},
	},
	wanquanmrfz: {
		audio: ["作战中1", "作战中2"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player, name, target) {
			return player.countCards("he") >= 4;
		},
		filterCard: () => true,
		selectCard: 4,
		position: "he",
		discard: false,
		lose: false,
		check(card: Card) {
			const cards = ui.selected.cards,
				player = get.player();
			let val = 8 - get.value(card);
			if (cards.length < 1 || !["fuguangmrfz", "guanhuomrfz"].some(skill => !player.hasSkill(skill))) return val;
			if (cards.map(i => get.suit(i)).includes(get.suit(card))) val -= 5;
			else val += 2;
			return val;
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.discard({ cards });
			await player.draw({ num: cards.length });

			if (new Set(cards.map(i => get.suit(i))).size >= 4) {
				reset_fuguangmrfz();
				reset_guanhuomrfz();
				return;
			}

			const result = await player
				.chooseControl({
					controls: ["fuguangmrfz", "guanhuomrfz"],
					choiceList: [`重置你【浮光】记录过的花色`, `重置你【观火】记录过的角色`],
					ai(event, player) {
						if (!player.hasSkill("fuguangmrfz")) return "guanhuomrfz";
						if (!player.hasSkill("guanhuomrfz")) return "fuguangmrfz";

						//大于0选浮光 小于0选观火 等于0随便选
						let val = 0;
						val += getStoragefuguang_suits(player).length * 0.8;
						val -= getStorageGuanhuo(player).length * 0.6;

						if (game.countPlayer() <= 3 && getStorageGuanhuo(player).length > 0) {
							val -= 0.5;
						}

						if (val === 0) return ["fuguangmrfz", "guanhuomrfz"].randomGet();

						return val > 0 ? "fuguangmrfz" : "guanhuomrfz";
					},
				})
				.forResult();

			if (result.control) {
				const reset = {
					fuguangmrfz: reset_fuguangmrfz,
					guanhuomrfz: reset_guanhuomrfz,
				};
				reset[result.control]();
			}

			function reset_fuguangmrfz() {
				if (!player.hasSkill("fuguangmrfz")) return;
				player.storage["fuguangmrfz"]["suits"] = [];
				game.log(player, "重置了", "#y【浮光】", "记录的花色");
			}

			function reset_guanhuomrfz() {
				if (!player.hasSkill("guanhuomrfz")) return;
				player.storage["guanhuomrfz"] = [];
				game.log(player, "重置了", "#y【观火】", "记录的角色");
			}
		},
	},
});

function refreshTips(player:Player):void {
    player.removePromptSJZX("fuguangmrfz_prompt");
    const cards = player.getCards("h");
    for(let card of cards){
        if(!getStoragefuguang_suits(player).includes(get.suit(card)!)){
            card.addPromptSJZX("浮光·未记录","fuguangmrfz_prompt");
        }
    }
}

function getStorageGuanhuo(player: Player): Player[] {
	if (!Array.isArray(player.storage["guanhuomrfz"])) player.storage["guanhuomrfz"] = [];
	return player.storage["guanhuomrfz"];
}

function getStoragefuguang_suits(player: Player): string[] {
	if (!player.storage["fuguangmrfz"]) {
		(lib.skill["fuguangmrfz"]["init"] as Function)(player, "fuguangmrfz");
	}
	return player.storage["fuguangmrfz"]["suits"];
}

function getStoragefuguang_damaged(player: Player): boolean {
	if (!player.storage["fuguangmrfz"]) {
		(lib.skill["fuguangmrfz"]["init"] as Function)(player, "fuguangmrfz");
	}
	return player.storage["fuguangmrfz"]["damaged"];
}
