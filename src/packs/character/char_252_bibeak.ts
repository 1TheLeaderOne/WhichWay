import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { gameUtils } from "../../nonameEx/custom/gameUtils.ts";
import { whichwayAI } from "../../ai/index.ts";

character("char_252_bibeak", { pack: "epicSJZX", sex: "female", group: "samimrfz", hp: 3, skills: ["shehunmrfz", "yirenmrfz"], llm: "DeepSeek-4.1-Flash" });

/**
 * 【异刃】与【摄魂】共用的常量。
 */

/** 「魂」在武将牌上的 gaintag */
const HUN_TAG = "shehunmrfz";

/** 取得该角色的「魂」 */
function getHun(player: Player): Card[] {
	return player.getExpansions(HUN_TAG);
}

/**
 * 判断一张牌是否是「伤害牌」（本扩展既有约定：走 `get.is.damageCard`）。
 * 【异刃】的触发时机是「使用伤害牌指定目标后」。
 */
function isDamageCardEvent(event) {
	return event.card && get.is.damageCard(event.card);
}

function getYirenMax(player, trigger) {
	let num = player.getCardUsable("sha");
	return Math.min(5, num);
}

skill({
	yirenmrfz: {
		audio: ["部署1", "作战中3"],
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!isDamageCardEvent(event)) return false;
			if (!event.isFirstTarget) return false;
			return game.hasPlayer(current => current !== player && current.countCards("h") <= getYirenMax(player, event));
		},
		async cost(event, trigger, player) {
			const max = getYirenMax(player, trigger);
			const result = await player
				.chooseNumbers({
					prompt:get.prompt("yirenmrfz"),
					prompt2:get.skillInfoTranslation("yirenmrfz"),
					list: [
						{
							prompt: "选择减少【杀】的使用次数",
							max,
							min: 0,
						},
					],
					processAI(event) {
						const targets = game.filterPlayer(char => get.damageEffect(char, player, player) > 0 && char.countCards("h") <= max).slice();
						if (targets.length < 1) return false;
						const minCardNum = Math.min(...targets.map(t => t.countCards("h")));
						if (player.hasUseTarget("sha") && player.countCards("h", "sha") > 0) return [minCardNum];
						return [max];
					},
					filterOk(event) {
						const num = event.numbers[0];
						return game.hasPlayer(char => char !== player && char.countCards("h") <= num);
					},
				})
				.forResult();

			event.result = gameUtils.createResult({
				bool: result.bool,
				cost_data: {
					numbers: result.numbers,
				},
			});
		},
		async content(event, trigger, player) {
			const num: number = event.cost_data.numbers[0];

			const result = await player
				.chooseTarget({
					prompt: `【异刃】:对一名手牌数不大于${get.cnNumber(num)}的其他角色造成一点伤害`,
					filterTarget(card, player, target) {
						return target.countCards("h") <= num && player !== target;
					},
					ai(target) {
						return get.damageEffect(target, player, player);
					},
					forced: true,
				})
				.forResult();

			const { targets } = result;
			if (!targets?.length) return;
			player.storage.yirenmrfz_used ??= [];
			player.storage.yirenmrfz_used.push(num);
			player.addTempSkill("yirenmrfz_used", { player: "phaseEnd" });
			player.line(targets, "fire");
			await targets.damages({ num: 1, source: player });
		},
		group:["yirenmrfz_add"],
		subSkill: {
			/** 本回合已经减掉的【杀】使用次数 */
			used: {
				charlotte: true,
				mark: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (get.name(card) === "sha") {
							const storage = player.getStorage("yirenmrfz_used", []);
							if (!storage.length) return;
							const plus = storage.reduce((a, b) => a + b, 0);
							if (plus > 0) return num - plus;
						}
					},
				},
				intro: {
					content(storage) {
						if (!storage?.length) return "本回合尚未发动【异刃】";
						return `本回合【杀】的使用次数上限-${storage.reduce((a, b) => a + b, 0)}`;
					},
				},
			},
			add:{
				silent:true,
				charlotte:true,
				trigger:{
					player:"phaseUseBegin"
				},
				async content(event,trigger,player){
					const id = "yirenmrfz_tips";
					player.removePromptSJZX(id);
					let count:number | string = player.getCardUsable("sha");
					count = count === Infinity ? "∞" : count;
					for(const card of player.getCards("hs")){
						if(get.name(card) === "sha"){
							card.addPromptSJZX(`使用次数:${count}`,id);
						}
					}
					player.addTempSkill(id,{player:"phaseUseEnd"});
				},
			},
			tips:{
				silent:true,
				charlotte:true,
				onremove(player, type) {
					player.removePromptSJZX("yirenmrfz_tips");
				},
				trigger:{
					player:["useCardAfter","yirenmrfzAfter","shehunmrfzAfter","gainAfter"]
				},
				filter(event, player, name, target) {
					if(event.name !== "useCard") return true;
					const count = player.storage.yirenmrfz_tips;
					return count !== player.getCardUsable("sha");
				},
				async content(event,trigger,player){
					const id = "yirenmrfz_tips";
					player.removePromptSJZX(id);
					let count:number | string = player.getCardUsable("sha");
					count = count === Infinity ? "∞" : count;
					for(const card of player.getCards("hs")){
						if(get.name(card) === "sha"){
							card.addPromptSJZX(`使用次数:${count}`,id);
						}
					}
					player.storage[id] = player.getCardUsable("sha");
				},
			},
		},
	},
	shehunmrfz: {
		audio: ["作战中4", "闲置"],
		enable: "phaseUse",
		usable: 1,
		/**
		 * 主动技：把一张「魂」置于牌堆顶，视为对一名其他角色使用【杀】。
		 * `shehunmrfz_put`、`shehunmrfz_sha` 通过 group 常驻，分别负责「获得魂」与「杀次数+X」。
		 */
		group: ["shehunmrfz_put", "shehunmrfz_sha"],
		filter(event, player) {
			// 有「魂」可放，且存在能对其使用【杀】的其他角色
			return getHun(player).length > 0 && player.hasUseTarget("sha",undefined,true);
		},
		onremove(player, type) {
			const cards = getHun(player);
			if(cards.length) player.loseToDiscardpile({cards});
		},
		prompt: "将一张「魂」置于牌堆顶，视为对一名其他角色使用【杀】",
		intro: {
			mark(dialog, storage, player) {
				const hun = getHun(player);
				if (!hun.length) return;
				dialog.addText(`「魂」×${hun.length}（【杀】使用次数上限 +${hun.length}）`);
				dialog.addAuto(hun);
			},
			content(storage, player) {
				const hun = getHun(player);
				if (!hun.length) return "暂无「魂」";
				return `「魂」×${hun.length}（【杀】使用次数上限 +${hun.length}）`;
			},
		},
		async content(event, trigger, player) {
			const hun = getHun(player);
			if (!hun.length) return;
			const result = await player
				.chooseButton({
					createDialog: [`【摄魂】：将一张「魂」置于牌堆顶，视为使用【杀】`, hun],
					forced: true,
					ai: button => 1 + get.value(button.link),
				})
				.forResult();
			if (!result.links?.length) return;
			const card = result.links[0];
			player.logSkill("shehunmrfz");
			player.$throw(card,null);
			// 置于牌堆顶：`cardsGotoPile` 会把它从武将牌上取下（`fix()`）再插到牌堆顶，
			// 不需要先 `lose` 一次，否则这张牌会先落到处理区、再被搬去牌堆，白白多一段动画。
			await game.cardsGotoPile([card], (event, card) => ui.cardPile.firstChild);
			// 视为对一名其他角色使用一张【杀】（目标由玩家自选，受距离限制）
			await player.chooseUseTarget({
				card: get.autoViewAs({ name: "sha", isCard: true }),
				forced: true,
				filterTarget: (card, player, target) => target !== player,
				addCount:false,
			});
		},
		ai: {
			order: 3,
			result: {
				player: 1,
			},
		},
		subSkill: {
			put: {
				audio: "shehunmrfz",
				trigger: { source: "damageEnd", player: "phaseZhunbeiBegin" },
				filter(event, player) {
					if (event.name === "damage") {
						return event.player && event.player.isAlive() && event.player.countCards("he") > 0;
					}
					return game.hasPlayer(char => char.countCards("he") > 0 && char !== player);
				},
				async cost(event, trigger, player) {
					type prompt_tmp = {
						prompt:string,
						prompts:string
					};
					const prompts = function(char:Player | string):prompt_tmp{
						return {
							prompt:get.prompt("shehunmrfz"),
							prompts:`你可以将${get.translation(char)}一张牌置于你的武将牌上，称为“魂”`
						}
					}
					if(trigger.name === "damage"){
						const result = await player.chooseBool({
							...prompts(trigger.player),
							ai(event, player) {
								return get.attitude2(trigger.player)>0 ? false : true;
							},
						}).forResult();
						event.result = gameUtils.createResult({
							bool:result.bool,
							targets:[trigger.player]
						})
					} else{
						event.result = await player.chooseTarget({
							...prompts("一名其他角色"),
							filterTarget(card, player, target) {
								return target!==player && target.countCards("he")>0;
							},
							ai(target) {
								let val = 0;
								const att = get.attitude2(target);
								if(att < 0) val += 5;
								if(att < 0 && whichwayAI.triggerBaiyin(target) && target.countCards("he") === 1) val -= 999;
								if(att > 0 && whichwayAI.triggerBaiyin(target) && target.hp < 3) val += 100;
								return val;
							},
						}).forResult();
					}
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const result = await player
						.choosePlayerCard({
							target,
							position: "hej",
							forced: true,
							prompt: `【摄魂】：将${get.translation(target)}的一张牌置于你的武将牌上，称为「魂」`,
							ai(button) {
								const link:Card = button.link;
								const att = get.attitude(player,target);
								if(att>0){
									if(whichwayAI.triggerBaiyin(target) && target.hp< 3 && get.name(link) === "baiyin") return 100;
									return -get.value(link);
								}
								if(whichwayAI.triggerBaiyin(target)) return -1;
								if(link.isKnownBy(player)) return get.value(link);
								return Math.random();
							},
						})
						.forResult();
					if (!result.cards?.length) return;
					player.line(target, "fire");
					await player.addToExpansion({
						cards: result.cards,
						source: target,
						gaintag: [HUN_TAG],
						animate: "gain2",
					});
				},
			},
			/** ② 【杀】的使用次数上限 +X（X 为「魂」的数量） */
			sha: {
				charlotte: true,
				silent: true,
				mod: {
					cardUsable(card, player, num) {
						const count = getHun(player).length;
						if (count > 0 && get.name(card) === "sha") return num + count;
					},
				},
			},
		},
	},
});

translate({
	char_252_bibeak: "柏喙",
	yirenmrfz: "异刃",
	yirenmrfz_info: "当你使用的伤害牌指定目标后，你可以令你本回合使用【杀】的次数上限减少N（至多为你本回合剩余可使用【杀】的次数，N至多为5），然后对一名手牌数不大于N的其他角色造成1点伤害。",
	shehunmrfz: "摄魂",
	shehunmrfz_info: "①[准备阶段/当你对一名其他角色造成伤害后]，你可以将[一名其他角色/其]一张牌置于你的武将牌上，称为“魂”。你的【杀】使用次数上限+X（X为“魂”的数量）。<br>②出牌阶段限一次，你可以将一张“魂”置于牌堆顶，视为对一名其他角色使用【杀】。",
});

characterIntro("char_252_bibeak", "柏喙，雷神工业装备设计师之女，遭遇工厂工人暴动而不幸感染矿石病。</br>现作为医疗救助对象加入罗德岛，依照本人的意愿，允许调入作战部门，她的剑术如同她纺线一般优雅而有韵律。");

characterTitle("char_252_bibeak", "持剑的裁缝匠");
