import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "hulangwanmrfz";

character(NAME, {
	sex: "male",
	hp: 5,
	skills: ["huangyaomrfz", "liequanmrfz"],
	pack: "mediocreSJZX",
	group: "persona",
	designer: ["Flandre"],
	llm:"Qwen-3.8-Flash",
	whichWay: {
		linkage: true,
		arknight: {
			camp: "persona",
		},
	},
});
/**
 * 虎狼丸 5/5 刚毅
荒咬：锁定技：一种颜色的连续2张牌被使用或打出时，你视为对来源使用1张杀（无次数限制）。若你使用杀未造成伤害，你失去1点体力，下次发动“荒咬”无颜色限制且造成伤害后摸等同于已损失体力值张牌。
 */

characterTitle(NAME, whichWayUtil.colorize("#r刚毅#"));
characterIntro(NAME, "虎狼丸，本班学生结城理的同伴，受到班级成员一致认可，特别登记为班级荣誉学生。<br>根据同伴的介绍，虎狼丸是一位佩洛兽亲。拉特兰当地人鲜少见到像虎狼丸这样愿意长时间与人相伴的兽亲，虎狼丸的聪慧和善解人意也给许多师生留下了深刻的印象。尤为特别的是，埃癸斯同学与虎狼丸情谊深厚，她能够听懂虎狼丸叫声的含义，帮助虎狼丸与他人交流。虎狼丸于是迅速融入了班级，并显示出了对于棋类游戏的兴趣。他在一场班级友谊棋赛中积极观战，得到了“能带来胜利的虎狼丸”的称誉。");

translate({
	[NAME]: "虎狼丸",

	huangyaomrfz: "荒咬",
	huangyaomrfz_info: `锁定技，任意有对应实体牌的牌结算完成后，若上一张使用的有对应实体牌的牌颜色与此牌相同且你不是此牌的使用者，你选择一项：<br>1.视为对此牌的使用者使用一张【杀】（无次数限制），若此【杀】未造成伤害，你失去一点体力，然后修改【荒咬】直到下次使用【荒咬】;<br>2.摸一张牌，然后令【荒咬】本轮失效。`,
	liequanmrfz: "猎犬",
	liequanmrfz_info: "锁定技，你每回合使用的第一张伤害类牌无距离限制。",
	huangyaomrfz_rewirte: "荒咬·修改",
	huangyaomrfz_rewirte_info: "锁定技，任意牌结算完成后，若你不是此牌的使用者，你选择一项：<br>1.视为对此牌的使用者使用一张【杀】（无次数限制），若此【杀】造成伤害，你摸等同于你已损失体力值张牌;<br>2.摸一张牌，然后令【荒咬】本轮失效。",
});

dynamicTranslate("huangyaomrfz",(player)=>{
    return get.skillInfoTranslation(player.hasSkill("huangyaomrfz_changed") ? "huangyaomrfz_rewirte" : "huangyaomrfz");
})

skill({
	huangyaomrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		derivation: ["huangyaomrfz_rewirte"],
		trigger: {
			global: "useCardAfter",
		},
		onremove: true,
		filter(event, player, name, target) {
			if (event.player === player) return false;
			if (player.hasSkill("huangyaomrfz_changed")) return true;
			const card = getLastUsed(event);
			return !!card && get.color(card) === get.color(event.card) && hasPhysicalCard(event.card);
		},
		async cost(event, trigger, player) {
			const controls: string[] = [];
			if (player.canUse(get.autoViewAs({ name: "sha", isCard: true }), trigger.player)) {
				controls.push("选项一");
			}
			controls.push("选项二");

			const intro = player.hasSkill("huangyaomrfz_changed") ? `视为对${get.translation(trigger.player)}使用一张【杀】（无次数限制），若此【杀】造成伤害，你摸${get.cnNumber(player.getDamagedHp())}张牌` : `视为对${get.translation(trigger.player)}使用一张【杀】（无次数限制），若此【杀】未造成伤害，你失去一点体力，然后修改【荒咬】直到下次使用【荒咬】`;

			const result = await player
				.chooseControl({
					controls,
					choiceList: [controls.includes("选项一") ? intro : whichWayUtil.colorize(`#s${intro}#s（无法对${get.translation(trigger.player)}使用【杀】）`), `摸一张牌，然后令【荒咬】本轮失效`],
					ai(event, player) {
						if (!controls.includes("选项一")) return "选项二";
						return get.attitude2(trigger.player) > 0 ? "选项二" : "选项一";
					},
				})
				.forResult();
			event.result = {
				...result,
				cost_data: result,
			};
		},
		async content(event, trigger, player) {
			const result = event.cost_data as Partial<Result>;
			if (!result.control) return;

			if (result.control === "选项一") {
				await player.chooseUseTarget({
					card: get.autoViewAs({ name: "sha", isCard: true, storage: { huangyaomrfz: true } }),
					filterTarget(card, player, target) {
						return target === trigger.player;
					},
					forced: true,
					addCount: false,
				});
				// 只认可本次【荒咬】视为使用的那张【杀】造成的伤害
				const damaged = player.getHistory("sourceDamage", evt => evt.card?.storage?.huangyaomrfz === true && evt.getParent("huangyaomrfz") === event).length > 0;
				if (damaged) {
					if (player.hasSkill("huangyaomrfz_changed") && player.getDamagedHp() > 0) player.draw(player.getDamagedHp());
				} else if (!player.hasSkill("huangyaomrfz_changed")) {
					player.loseHp();
					player.when({ player: "huangyaomrfzAfter" }).then(async (event, trigger, player) => {
						player.addTempSkill("huangyaomrfz_changed", { player: "huangyaomrfzEnd" });
						player.markSkill("huangyaomrfz_changed");
					});
				}
			} else {
				player.draw();
				player.disableSkill(`${event.name}_effect`, "huangyaomrfz");
				player.addTempSkill(`${event.name}_effect`, { global: "roundStart" });
			}
		},
		// group:"huangyaomrfz_damaged",
		subSkill: {
			effect: {
				onremove(player, skill) {
					player.enableSkill(skill);
				},
				locked: true,
				mark: true,
				charlotte: true,
				intro: {
					content(storage, player, skill) {
						const list = Object.keys(player.disabledSkills)
							.filter(key => player.disabledSkills[key].includes(skill))
							.flatMap(key => {
								return lib.translate[key + "_info"] ? [get.translation(key)] : [];
							});
						if (list.length) {
							return `失效技能：${list.join("、")}`;
						}
					},
				},
			},
			// damaged:{
			//     charlotte:true,
			//     forced:true,
			//     audio:"huangyaomrfz",
			//     trigger:{
			//         source:"damageSource"
			//     },
			//     filter(event, player, name, target) {
			//         return event.card && event.card.storage.huangyaomrfz === true;
			//     },
			//     async content(event,trigger,player){
			//         player.storage.huangyaomrfz = true;
			//     },
			// },
			changed: {
				silent: true,
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content(storage, player, skill) {
						return `·已修改【荒咬】<br>·${get.skillInfoTranslation("huangyaomrfz_rewirte")}`;
					},
				},
			},
		},
	},
	liequanmrfz: {
		mod: {
			targetInRange(card, player, target, result) {
				if (get.tag(card, "damage") > 0 && player.getHistory("useCard",evt=>get.tag(evt.card, "damage") > 0).length < 1) {
					return true;
				}
                return result;
			},
		},
		audio: ["行动出发", "行动开始"],
		forced: true,
		intro: {
			content(storage, player, skill) {
				return `·使用的伤害类牌无距离限制`;
			},
		},
		trigger: {
			player: "useCardBegin",
		},
		filter(event, player, name, target) {
			return get.tag(event.card, "damage") > 0 && player.getHistory("useCard",evt=>get.tag(evt.card, "damage") > 0).length < 2;
		},
		onremove(player, type) {
			player.unmarkSkill("liequanmrfz");
			player.removeTip("liequanmrfz_tips");
		},
		async content(event, trigger, player) {
			(lib.skill.liequanmrfz.onremove as (player: Player, type: string) => void)(player, "liequanmrfz");
		},
		group: "liequanmrfz_refresh",
		subSkill: {
			refresh: {
				charlotte: true,
				silent: true,
				trigger: {
					global: "phaseBegin",
				},
				async content(event, trigger, player) {
					player.markSkill("liequanmrfz");
					player.addTip("liequanmrfz_tips", "猎犬 无距离限制");
				},
			},
		},
	},
});

/**
 * 「有对应实体牌」：实体牌本身，或由实体牌转化/消耗而来的虚拟牌。
 * 注意实体牌 Card 没有 cards 属性（只有 VCard 有），直接用 `card.cards.length` 会在实体牌上抛错。
 */
function hasPhysicalCard(card: any): boolean {
	return get.itemtype(card) === "card" || (Array.isArray(card?.cards) && card.cards.length > 0);
}

/**
 * 以本次使用的牌为锚点向前回溯，取最近一张「有对应实体牌」的使用牌。
 * 回溯会跳过纯虚拟的使用（如【荒咬】自己视为使用的【杀】），避免污染「上一张」。
 */
function getLastUsed(event: GameEvent): Card | VCard | undefined {
	const histories = game.getAllGlobalHistory("useCard");
	const anchor = histories.lastIndexOf(event);
	for (let i = (anchor >= 0 ? anchor : histories.length + 1) - 1; i >= 0; i--) {
		const card = histories[i].card;
		if (hasPhysicalCard(card)) {
			return card;
		}
	}
	return undefined;
}
