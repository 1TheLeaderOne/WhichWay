import { lib, game, ui, get, ai, _status } from "noname";
import { register } from "../hooks.ts";

/* ================================== 刈仇 ================================== */

/**
 * 刈仇的“仇恨名单”（存 `playerid`）。
 *
 * 两个来源都会永久记录（跨轮次保留）：
 * - 你成为过该角色使用的伤害牌的目标；
 * - 该角色对你造成过伤害。
 *
 * storage 可能被旧存档或其他逻辑改成非数组，读取时统一兜底。
 */
const yichouList = (player: Player): string[] => {
	if (!Array.isArray(player.storage.yichoumrfz)) player.storage.yichoumrfz = [];
	return player.storage.yichoumrfz;
};

/** 记仇：把 source 写进玩家的仇恨名单（去重、忽略自己） */
const yichouAdd = (player: Player, source: Player): void => {
	if (!source || source === player) return;
	const list = yichouList(player);
	if (!list.includes(source.playerid)) list.push(source.playerid);
};

/** 玩家是否记恨 target */
const yichouHas = (player: Player, target: Player): boolean => yichouList(player).includes(target.playerid);

/**
 * 牌是否带【刈斩】的“无次数距离限制”标记。
 *
 * ⚠️ 引擎在 `cardUsable` / `targetInRange` 里会先 `get.autoViewAs(card)` 把实体牌包成 VCard，
 * 而 VCard 只复制 cards/storage 等字段、**不复制 gaintag**；所以必须同时查 `card.cards` 里的实体牌。
 */
const yiqunTagged = (card: any): boolean => !!(card?.hasGaintag?.("yiqunmrfz_sha") || card?.cards?.some((c: any) => c?.hasGaintag?.("yiqunmrfz_sha")));

/* ================================== 刈力 ================================== */

/**
 * 本轮是否流失过体力。
 *
 * 「流失体力」只算 `player.loseHp()`（changeHp 事件的父事件为 loseHp），受到伤害不算。
 * `game.getRoundHistory` 只取当前轮次的全局历史，轮次切换后自动清空。
 */
const yiliLostThisRound = (player: Player): boolean => game.getRoundHistory("changeHp", evt => evt.player === player && evt.num < 0 && !!evt.getParent("loseHp")).length > 0;

/** 刈力当前应视为拥有的技能 */
const yiliWanted = (player: Player): string => (yiliLostThisRound(player) ? "zhanjue" : "kaikang");

/**
 * 让【刈力】授予的技能与当前状态一致。
 * @returns 是否真的发生了切换
 */
const yiliSync = (player: Player, skill: string, log = true): boolean => {
	const want = yiliWanted(player);
	// addAdditionalSkill 把授予的技能存在 additionalSkills[来源技能] 里
	const granted = player.additionalSkills[skill];
	const list = Array.isArray(granted) ? granted : granted ? [granted] : [];
	// 已恰好是目标技能时不动；否则先清空本来源的记录再授予。
	// 不能只看 list[0]：若【慷忾】/【战绝】本身也是玩家的真实技能（双将、化身、其他来源），
	// removeAdditionalSkill 不会移除真实技能，旧授予会残留在数组里，导致状态判断取到过期项。
	if (list.length === 1 && list[0] === want) return false;
	player.removeAdditionalSkill(skill);
	player.addAdditionalSkill(skill, want);
	if (log) game.log(player, "获得了技能", "#g【" + get.translation(want) + "】");
	return true;
};

register("leidemrfz", {
	character: {
		sex: "male",
		// 整合运动（与爱国者、斗士塔露拉等剧情干员一致）
		group: "zhmrfz",
		whichWay: {
			reallyGroup: "ReunionMovement",
		},
		hp: 4,
		pack: "plotSJZX",
		skills: ["yichoumrfz", "yiqunmrfz", "yilimrfz"],
	},
	characterTranslate: "雷德",
	translate: {
		yiqunmrfz_sha: "刈斩",
	},
	skillInfo: {
		/* -------------------------------- 刈仇 -------------------------------- */
		yichoumrfz: {
			skillName: "刈仇",
			info: "锁定技，当你造成伤害时，若你成为过该角色使用的伤害牌的目标或该角色对你造成过伤害，你对其造成的伤害+1，若你已损失的体力值不小于2，伤害额外+1。",
			skill: {
				audio: 2,
				forced: true,
				locked: true,
				logTarget: "player",
				group: ["yichoumrfz_target", "yichoumrfz_hurt"],
				trigger: { source: "damageBegin3" },
				init(player) {
					if (!Array.isArray(player.storage.yichoumrfz)) player.storage.yichoumrfz = [];
				},
				filter(event, player) {
					return event.player !== player && event.num > 0 && event.player.isIn() && yichouHas(player, event.player);
				},
				async content(event, trigger, player) {
					trigger.num += 1;
					// 已损失的体力值不小于2时，伤害额外+1
					if (player.getDamagedHp() >= 2) trigger.num += 1;
				},
				subSkill: {
					// 记录：你成为过该角色使用的伤害牌的目标
					target: {
						charlotte: true,
						forced: true,
						silent: true,
						popup: false,
						firstDo: true,
						trigger: { global: "useCardToTargeted" },
						filter(event, player) {
							return event.target === player && event.player !== player && !!event.card && get.is.damageCard(event.card);
						},
						async content(event, trigger, player) {
							yichouAdd(player, trigger.player);
						},
					},
					// 记录：该角色对你造成过伤害
					hurt: {
						charlotte: true,
						forced: true,
						silent: true,
						popup: false,
						firstDo: true,
						trigger: { player: "damage" },
						filter(event, player) {
							return !!event.source && event.source !== player && event.num > 0;
						},
						async content(event, trigger, player) {
							yichouAdd(player, trigger.source);
						},
					},
				},
			},
			line:["三成。又是三成。你们的‘上头’，到底要把人逼到哪一步才算够？","这一刀，斩的不是人。是那条从‘上头’伸下来、从来没断过的绳子。"]
		},
		/* -------------------------------- 刈斩 -------------------------------- */
		yiqunmrfz: {
			skillName: "刈斩",
			info: "当你使用的伤害牌指定目标后，你可以流失一点体力并获得目标角色的一张牌，然后若此牌造成了伤害，你获得一张【杀】（视为火属性且无次数距离限制）且获得一点护盾。",
			skill: {
				audio: 2,
				logTarget: "target",
				group: ["yiqunmrfz_sha"],
				trigger: { player: "useCardToTargeted" },
				filter(event, player) {
					const target = event.target;
					if (!target || target === player || !target.isIn()) return false;
					// 「伤害牌」按引擎标签判定（含【杀】【决斗】等）
					if (!event.card || !get.is.damageCard(event.card)) return false;
					return target.countGainableCards(player, "he") > 0;
				},
				check(event, player) {
					// 流失体力是实打实的代价：体力见底时不发动；从敌方拿牌才值得
					return player.hp > 1 && get.attitude(player, event.target) < 0;
				},
				async content(event, trigger, player) {
					const target = trigger.target;
					const card = trigger.card;
					await player.loseHp();
					if (player.isDead() || !target.isIn()) return;
					// 流失体力后重新确认目标是否还有可获得的牌
					if (target.countGainableCards(player, "he") > 0) {
						await player.gainPlayerCard({
							target,
							position: "he",
							forced: true,
							prompt: "刈斩：获得" + get.translation(target) + "的一张牌",
						});
					}
					// 此牌结算完毕后检查它是否对该目标造成了伤害
					const useEvent = trigger.getParent("useCard");
					if (!useEvent) return;
					player
						.when("useCardAfter")
						.filter(evt => evt === useEvent)
						.step(async () => {
							const damaged = player.getHistory("sourceDamage", evt => evt.card === card && evt.player === target).length > 0;
							if (!damaged) return;
							// 从牌堆获得一张【杀】，打上“无次数距离限制”的标签
							const sha = get.cardPile2("sha");
							if (sha) {
								const { cards } = await player.gain({ cards: [sha], animate: "gain2", gaintag: ["yiqunmrfz_sha"] }).forResult();
                                if(cards){
                                    cards.forEach(i=>i.addPromptSJZX("无距离次数限制","yiqunmrfz_sha_tag"));
                                }
							}
							await player.changeHujia(1);
						});
				},
			},
			line:["我恨的不是哪一个征税官，哪一道命令。我恨的是那个‘为什么’。为什么总是三成，为什么总有人可以被‘上头’带走。","仇恨烧起来容易。难的是烧完之后，还知道该往哪里走。"]
		},
		/* -------------------------------- 刈力 -------------------------------- */
		yilimrfz: {
			skillName: "刈力",
			info: "锁定技，若你本轮没有流失过体力，你视为拥有【慷忾】，否则你视为拥有【战绝】。",
			skill: {
				audio: 2,
				forced: true,
				locked: true,
				derivation: ["kaikang", "zhanjue"],
				group: ["yilimrfz_lost", "yilimrfz_round"],
				init(player, skill) {
					// 本局开始时（或技能被重新获得时）按当前轮次的历史决定
					yiliSync(player, skill, false);
				},
				onremove(player, skill) {
					// 移除【刈力】时一并移除它授予的技能
					player.removeAdditionalSkill(skill);
				},
				subSkill: {
					// 本轮首次流失体力：改为视为拥有【战绝】
					lost: {
						charlotte: true,
						forced: true,
						silent: true,
						popup: false,
						firstDo: true,
						trigger: { player: "loseHpAfter" },
						async content(event, trigger, player) {
							yiliSync(player, "yilimrfz");
						},
					},
					// 新轮次开始：重新视为拥有【慷忾】
					round: {
						charlotte: true,
						forced: true,
						silent: true,
						popup: false,
						firstDo: true,
						trigger: { global: "roundStart" },
						async content(event, trigger, player) {
							yiliSync(player, "yilimrfz");
						},
					},
				},
			},
			line:["这里，有我一人足以！","无名小卒，还想越过我？"]
		},
	},
	// 辅助技能：【刈斩】获得的【杀】不计入使用次数、无视距离
	skill: {
		yiqunmrfz_sha: {
			charlotte: true,
			init(player, skill) {
				game.broadcastAll(() => {
					lib.translate["yiqunmrfz_sha"] = "刈斩·无限制";
				});
			},
			mod: {
				cardUsable(card) {
					if (yiqunTagged(card)) return Infinity;
				},
				targetInRange(card) {
					if (yiqunTagged(card)) return true;
				},
				cardnature(card, player, currentnature) {
					if (yiqunTagged(card)) return "fire";
				},
			},
		},
	},
	title: "刈敌红刃",
	intro: "雷德，乌萨斯族感染者，新整合运动干部，使一柄长刀，操火焰类源石技艺。他并非出身于某支军队或某个机构，而是从战场上长出来的名字：早年在切尔诺伯格 59 区废墟与龙门外环一线，他以「复仇者」之名与罗德岛反复交手，被唤作「红刀」；这个称呼后来跟着他，从敌方图鉴走进故事集，从「红刀哥」变成一个具体的人。塔露拉落败被收押后，他随九进入新整合运动。为筹备营救塔露拉所需的载具，他潜入维多利亚卡拉顿城，伪装成当地感染者，将一台发动机运回驻地；在那里结识了菲林少女苏茜，并在贝希曼伯爵的势力逼迫她时站了出来——她叫他「雷德先生」。他也曾随九向坎诺特洽购电控系统，因看不惯锈锤打劫哥伦比亚车队的行径险些动手，直到与前整合运动的老同伴相认才收刀。第十二章他回到维多利亚接应同胞，吸纳了大批本地感染者加入新整合运动；深池的成员告诉他，深池不打算与整合运动为敌。此后他在乌萨斯落脚，与苏茜合开了一间杂货铺。在营地，他曾对那位流亡的乌萨斯皇子费奥多尔拔刀，最终没有落下；把刀收回去的时候，他也把自己的仇恨交了出去，甚至要求九与塔露拉处置他。《时间啊，向前！》的尾声，他为掩护工人与平民撤离独自断后，力战而亡，遗体仍立在原地，由塔露拉收殓。同一场撤退里，霍里精神崩溃，雷尔金战死，卡佳下落不明。",
	dieLine:"我还能再战！",
});
