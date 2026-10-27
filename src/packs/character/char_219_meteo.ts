import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";
import { gameUtils } from "../../nonameEx/custom/gameUtils.ts";

character("char_219_meteo", { pack: "epicSJZX", sex: "female", group: "luomrfz", hp: 4, skills: ["yxliumingmrfz", "dingyuanmrfz"] });

const exps_tag = "yxliumingmrfz";

skill({
	zhimingmrfz: {
		mark: true,
		intro: {
			content: function (event, player) {
				return `·获得过的“铭”:${get.translation(getNameplate(player))}`;
			},
		},
		audio: ["部署2", "作战中3"],
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard: function (player, name) {
			const names = getNameplate(player);
			if (player.countCards("he") < 1 || player.hasSkill("zhimingmrfz_ban")) return false;
			for (let i of names) {
				if (name === i) return true;
			}
			return false;
		},
		filter: function (event, player) {
			const names = getNameplate(player);
			if (player.countCards("he") < 1 || player.hasSkill("zhimingmrfz_ban")) return false;
			for (let i of names) {
				if (event.filterCard({ name: i, isCard: true }, player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				let vcards: any[] = [];
				const names = getNameplate(player);
				for (let name of names) {
					let card = { name: name, isCard: true };
					let type = get.type(name);
					if (event.filterCard(card, player, event)) vcards.push([type, "", name]);
				}
				let dialog = ui.create.dialog("祗铭", [vcards, "vcard"], "hidden");
				//@ts-ignore
				dialog.direct = true;
				return dialog;
			},
			backup: function (links, player) {
				return {
					filterCard: () => true,
					selectCard: 1,
					viewAs: {
						name: links[0][2],
					},
					position: "he",
					check(card: Card) {
						return 8 - get.value(card);
					},
					async precontent(event, trigger, player) {
						player.logSkill("zhimingmrfz");
						player.addTempSkill("zhimingmrfz_ban", { global: "phaseEnd" });
					},
				};
			},
			prompt: function (links, player) {
				return "【祗铭】：将一张牌当作【" + get.translation(links[0][2]) + "】使用或打出";
			},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
		subSkill: {
			ban: {
				charlotte: true,
			},
		},
	},
	dingyuanmrfz: {
		whichway: {
			affiliates: ["zhimingmrfz"],
		},
		derivation: "zhimingmrfz",
		mark: true,
		intro: {
			content: function (event, player) {
				return countNamePlate(player) < 3 ? `·“铭”的数量:${countNamePlate(player)}/3` : `·条件已完成，努力活到准备阶段吧！`;
			},
		},
		onremove: true,
		audio: ["晋升后交谈1", "晋升后交谈2"],
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		unique: true,
		juexingji: true,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return countNamePlate(player) >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill("dingyuanmrfz");
			player.loseMaxHp();
			player.addSkill("zhimingmrfz");
			player.storage.dingyuanmrfz_rewrite = true;
		},
		ai: {
			combo: "yxliumingmrfz",
		},
	},
	yxliumingmrfz: {
		derivation: ["yxliumingmrfz_rewrite"],
		mod: {
			targetEnabled(card: Card, player, target) {
				const exps = target.getExpansions(exps_tag);
				if (exps.map(c => get.suit(c)).includes(get.suit(card)) && target !== player) {
					return false;
				}
			},
		},
		init(player, skill) {
			game.broadcastAll(() => {
				lib.translate["yxliumingmrfz_cost_gaintag"] = "造成伤害的牌";
			});
		},
		audio: ["信赖提升后交谈3", "完成高难行动"],
		onremove(player, type) {
			const cards = player.getExpansions(exps_tag);
			if (cards.length) player.loseToDiscardpile({ cards });
		},
		intro: {
			mark(dialog, storage, player, event, skill) {
				const cards = player.getExpansions(exps_tag);
				if (cards.length < 1) {
					dialog.addText("没有“铭”");
					return;
				}
				if (player.hasSkill("dingyuanmrfz") && !player.hasSkill("zhimingmrfz")) {
					dialog.addText(`·获得过的“铭”（去重）：${get.translation(getNameplate(player))}`);
					dialog.addText("当前的“铭”:");
				}
				dialog.addAuto(cards);
			},
		},
		trigger: {
			global: "damageEnd",
		},
		filter(event, player, name, target) {
			return event.card && event.card.cards.length > 0 && event.cards.filter(c => ["o", "d"].includes(get.position(c)));
		},
		async cost(event, trigger, player) {
			const cards = player.getExpansions(exps_tag);
			const curCards = trigger.cards.filter(c => ["o", "d"].includes(get.position(c)));
			const curTrans = get.translation(curCards);
			const result = await player
				.chooseFakeCard({
					tagName: "yxliumingmrfz_cost_gaintag",
					cards: curCards,
					prompt: get.prompt(exps_tag),
					prompt2: `你可以${cards.length > 0 ? `获得${get.translation(cards)}并将` : `将`}${curTrans}置于你的武将牌上,称之为"铭"`,
					ai(card) {
						let val = get.value(card);
						if (get.color(card) === "black") val += 2;
						if (!getNameplate(player).includes(get.name(card)!)) val += 2;
						if (["tao", "jiu", "wuxie", "lebu"].filter(name => !getNameplate(player).includes(name)).includes(get.name(card)!)) val += 5;
						return val;
					},
				})
				.forResult();
			console.log(result);
			if (result.bool === true) {
				event.result = gameUtils.createResult({ bool: true, cards: result.links });
			}
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				exps = player.getExpansions(exps_tag);
			if (exps.length > 0) {
				await player.gain({
					cards: exps,
					animate: "gain2",
				});
			}
			player.addToExpansion({
				cards,
				source: trigger.source,
				gaintag: [exps_tag],
				animate: "giveAuto",
			});
		},
		group: ["yxliumingmrfz_rewrite", "yxliumingmrfz_tips"],
		subSkill: {
			rewrite: {
				audio: "yxliumingmrfz",
				trigger: {
					player: "useCard",
				},
				filter(event, player, name, target) {
					if (!player.storage.dingyuanmrfz_rewrite) return false;
					return (
						event.card &&
						(get.type(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
						player
							.getExpansions(exps_tag)
							.map(c => get.suit(c))
							.includes(get.suit(event.card))
					);
				},
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players.filter(i => i !== player));
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						const card: Card = arg?.card;
						const exps = player.getExpansions(exps_tag);
						if (!card || exps.length < 1 || !player.storage.dingyuanmrfz_rewrite) return false;
						return get.suit(card) === get.suit(exps[0]);
					},
				},
			},
			tips: {
				silent: true,
				charlotte: true,
				trigger: {
					player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player, name, target) {
					return !!player.storage.dingyuanmrfz_rewrite;
				},
				async content(event,trigger,player){
					const exps = player.getExpansions(exps_tag);
					const tag = "yxliumingmrfz_tips_id";
					player.removePromptSJZX(tag);

					if(exps.length<0) return;
					const suit = get.suit(exps[0]);

					for(const card of player.getCards("hs")){
						if(get.suit(card) === suit) card.addPromptSJZX("不可响应",tag);
					}
				},
			},
		},
	},
});

function getNameplate(player: Player, removal: boolean = true): string[] {
	const names: string[] = [];
	//everything里可能堆了一坨数据,避免使用函数式
	for (const evt of game.getAllGlobalHistory("everything", evt => evt.name === "addToExpansion" && evt.player === player && evt.gaintag?.includes(exps_tag) && !!evt.cards?.length)) {
		for (const card of evt.cards ?? []) {
			const name = get.name(card);
			if (name != null) names.push(name);
		}
	}
	return removal ? Array.from(new Set(names)) : names;
}

function countNamePlate(player: Player): number {
	return getNameplate(player, false).length;
}

translate({
	char_219_meteo: "陨星",
	dingyuanmrfz: "定愿",
	dingyuanmrfz_info: "觉醒技，准备阶段，若你于本局游戏中置于武将牌上过至少三张“铭”，你失去一点体力上限、获得技能【祗铭】并修改【流铭】。",
	yxliumingmrfz: "流铭",
	yxliumingmrfz_info: "任意角色受到伤害后，你可以获得所有“铭”并将对其造成伤害牌中的一张置于你的武将牌上，称之为“铭”，当你武将牌上有“铭”时，其他角色不能使用与“铭”相同花色的牌指定你为目标。",
	yxliumingmrfz_rewrite: "流铭",
	yxliumingmrfz_rewrite_info: "任意角色受到伤害后，你可以获得所有“铭”并将对其造成伤害牌中的一张置于你的武将牌上，称之为“铭”，当你武将牌上有“铭”时，其他角色不能使用与“铭”相同花色的牌指定你为目标且你与“铭”花色相同的牌不可被其他角色相应。",
	zhimingmrfz: "祗铭",
	zhimingmrfz_info: "每回合限一次，你可以将一张牌当作与本局游戏中你获得过的“铭”的同名牌使用或打出。",
});

dynamicTranslate("yxliumingmrfz", player => {
	const changed = player.storage.dingyuanmrfz_rewrite === true;
	return get.skillInfoTranslation(changed ? "yxliumingmrfz_rewrite" : "yxliumingmrfz");
});

characterIntro("char_219_meteo", "陨星，前“守林人”组织成员，现自由佣兵，此外履历不详。</br>现作为狙击干员为罗德岛服务，使用手中的弩炮发挥出卓越的范围杀伤力。");

characterTitle("char_219_meteo", "流浪佣兵");
