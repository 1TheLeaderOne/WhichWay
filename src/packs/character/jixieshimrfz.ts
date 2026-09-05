import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, card, cardTranslate, cardSkill } from "../hooks.ts";
import { whichWayFile } from "../../file.js";
import { whichWayUtil } from "../../utill.js";

/**
 协防：锁定技，准备阶段，若你的装备区内没有“结构性原理”，你将“结构性原理”置入你的装备区，你可将置于“结构性原理”下的牌如手牌般使用。
聚类：当你使用的牌结算完成后，若该类型的牌是你手牌中最多的类型，你可以对一名角色造成一点伤害，反之你摸一张牌。
解构：当你使用的牌的花色达到四色时，你摸3张牌并从场上、牌堆或弃牌堆获得“结构性原理”，若无法获得你可对一名其他角色造成等同于其体力上限的伤害。（未实现）

结构性原理：装备·宝物：①出牌阶段限X次（X=本回合使用非基本牌的数量），你可以将一张手牌置于此牌下，然后你可以将此牌置于一名其他角色的装备区内并对其造成一点伤害。②锁定技，当此牌不因交换装备或移动至其他装备区而离开你的装备区后，销毁之。

实现模型：置于“结构性原理”下的牌保留在将其置入的“协防”角色的特殊牌区（s 区，带 gaintag），不随装备持有者变动；s 区的牌默认可被其所有者如手牌般使用，无需放行（卡牌技能上的 cardEnabled2 仅用于避免装备牌与其下已选牌的非法组合选择）。xiefangmrfz_sync 以 global loseEnd + gaintag_map（参考晋羊祜【怀远】，gaintag 在牌失去前会被引擎剥离）同步存储记录：无论谁失去这些牌，所有拥有“协防”的角色都会同步维护账本。此牌仅在因交换装备或移动至其他装备区而离开装备区时豁免销毁，其余方式离开时销毁自身并将其下的牌置入弃牌堆。
 */

const NAME = "jixieshimrfz";
const CARDNAME = "SP_jixieshimrfz";
/** 置于“结构性原理”下的牌所用的 gaintag（不与任何技能 id 同名，避免干扰标记系统） */
const STRUCT_TAG = CARDNAME;

character(NAME, {
	hp: 4,
	group: "luomrfz",
	sex: "male",
	pack: "legendSJZX",
	skills: ["xiefangmrfz", "juleimrfz"],
	designer: ["Flandre"],
});

characterIntro(NAME, "机械师，罗德岛精英干员，主导罗德岛的武器装备、工程设施及实验器材的研发、制造及维护工作，为罗德岛各部门干员提供必要的硬件支持。");
characterTitle(NAME, "<font color = #316dd5>机械之心</font>");

const sp_poptip = get.poptip(CARDNAME);

translate({
	[NAME]: "机械师",

	xiefangmrfz: "协防",
	xiefangmrfz_info: `锁定技，准备阶段，若你的装备区内没有${sp_poptip}，你将${sp_poptip}置入你的装备区，你可将置于${sp_poptip}下的牌如手牌般使用。`,
	juleimrfz: "聚类",
	juleimrfz_info: "当你使用的牌结算完成后，若该类型的牌是你手牌中最多的类型，你可以对一名角色造成一点伤害，反之你摸一张牌。",
});

skill({
	xiefangmrfz: {
		audio: ["部署1", "部署2"],
		forced: true,
		trigger: { player: "phaseZhunbeiBegin" },
		derivation: [CARDNAME],
		filter(event, player) {
			return !player.hasCard(card => get.name(card) === CARDNAME, "e");
		},
		async content(event, trigger, player) {
			const card = get.cardPile(CARDNAME, "field") || game.createCard(CARDNAME, "heart", 1);
			await player.equip(card);
		},
		group:["xiefangmrfz_sync"],
		subSkill: {
			//同步对所有拥有“协防”的角色生效（global 触发）：无论谁（含不拥有协防的角色、已死亡角色）
			//使用/打出/弃置了“结构性原理”下的牌，存储记录都会被拥有协防的角色同步维护
			sync: {
				audio: false,
				charlotte: true,
				forced: true,
				silent: true,
				popup: false,
				trigger: { global: "loseEnd" },
				filter(event, player) {
					if (!event.ss || !event.ss.length) return false;
					//gaintag 在牌失去前已被引擎剥离，须从 gaintag_map 判断（参考晋羊祜【怀远】）
					return event.ss.some(card => (event.gaintag_map?.[card.cardid] || []).includes(STRUCT_TAG));
				},
				async content(event, trigger, player) {
					const lost = trigger.ss.filter(card => (trigger.gaintag_map?.[card.cardid] || []).includes(STRUCT_TAG));
					if (!lost.length) return;
					//“结构性原理”可能位于任意角色的装备区内，遍历全场寻找持有存储记录的此牌
					for (const current of game.players.concat(game.dead ?? [])) {
						for (const vcard of current.getVCards("e")) {
							if (vcard.name === CARDNAME && Array.isArray(vcard.storage?.saveCards)) {
								vcard.storage.saveCards.removeArray(lost);
								//@ts-ignore
								const structCards:Card[] = vcard.cards;
								if(!structCards) continue;
								for(let structCard of structCards){
									if(Array.isArray(structCard.storage.saveCards)){
										structCard.storage.saveCards.removeArray(lost);
									}
								}
							}
						}
					}
				},
			},
		},
	},
	juleimrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		trigger: {
			player: "useCardAfter",
		},
		async cost(event, trigger, player) {
			const type = get.type(trigger.card, "trick");
			const cards = player.getCards("h");

			if (type === getMaxType(cards, player)) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt("juleimrfz"),
						prompt2: "你可以对一名角色造成一点伤害",
						ai(target) {
							const player = get.player();
							return get.damageEffect(target, player, player);
						},
					})
					.forResult();
			} else {
				event.result = await player
					.chooseBool({
						prompt: "【聚类】:是否摸一张牌？",
						ai(event, player) {
							return true;
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = event.targets && event.targets[0];
			if (target) {
				await target.damage({
					source: player,
				});
			} else {
				await player.draw();
			}
		},
	},
});

function getMaxType(cards: Card[], player: Player): string | undefined {
	const types = cards.map(i => get.type2(i));
	const map = {};
	for (let type of types) {
		if (!map[type]) {
			map[type] = 1;
		} else {
			map[type] += 1;
		}
	}

	let max = 0;
	let maxType;
	for (let type in map) {
		const num = map[type];
		if (num > max) {
			max = num;
			maxType = type;
		}
	}
	return maxType;
}

card(CARDNAME, {
	image: whichWayFile.compilePath(`img:card/${CARDNAME}.jpg`),
	type: "equip",
	subtype: "equip5",
	forceDie: true,
	async onEquip(event, trigger, player) {
		const { card } = event;
		if (!card) return;
		//注意：event.card 是虚拟牌 VEquip，而装备区/getEquip 里是实体牌（即 VEquip.cards[0]），
		//两者 storage 互不相通（VCard 构造时对 storage 做了拷贝），牌下账本统一记录在实体牌的 storage 上
		const physical = event.cards?.length === 1 ? event.cards[0] : card.cards?.[0];
		if (physical) {
			physical.storage ??= {};
			if (!physical.storage.saveCards) {
				physical.storage.saveCards = [];
			}
		}
		player.markSkill(`${CARDNAME}_skill`);
	},
	onLose: async function (event, trigger, player) {
		const { card } = event;
		if (!card) return;
		if (!player.countVCards("e", i => i.name === CARDNAME)) {
			player.unmarkSkill(`${CARDNAME}_skill`);
		} else {
			player.markSkill(`${CARDNAME}_skill`);
		}
		//同 onEquip：从虚拟牌解析出实体牌，账本读实体牌的 storage（兼容旧的虚拟牌侧记录）
		const physical = event.cards?.length === 1 ? event.cards[0] : (card.cards?.[0] ?? card);
		const loseEvent = event.getParent()!;
		//判断是否属于豁免情形：①事件链中存在 swapEquip 事件（交换装备）；
		//②此牌被其他角色的 equip 事件取走（移动至其他装备区/取回），新装备者即 equip 事件的 player
		let exempt = false;
		let cur = loseEvent;
		while (cur && cur.name) {
			if (cur.name === "swapEquip") {
				exempt = true;
				break;
			}
			cur = cur.getParent()!;
		}
		if (!exempt && loseEvent.type === "equip" && !loseEvent.swapEquip) {
			const equipEvent = loseEvent.getParent();
			if (equipEvent && equipEvent.name === "equip" && equipEvent.player && equipEvent.player !== player) {
				exempt = true;
			}
		}
		if (exempt) {
			//交换装备/移动至其他装备区：此牌不销毁，其下的牌（s 区）也不置入弃牌堆
			return;
		}
		//其余方式离开（含被其他装备牌替换、被弃置/拆除、死亡结算等）：其下的牌置入弃牌堆，此牌销毁
		const storage = physical.storage?.saveCards ?? card.storage?.saveCards;
		if (storage && storage.length) {
			//其下的牌物理上位于获得“协防”的角色的特殊牌区，按实际归属置入弃牌堆
			const byOwner = new Map();
			for (const save of storage) {
				if (get.position(save, true) != "s") continue; //已不在此牌下（如已被使用）
				const owner = get.owner(save);
				if (!owner) continue;
				if (!byOwner.has(owner)) byOwner.set(owner, []);
				byOwner.get(owner).push(save);
			}
			for (const [owner, saves] of byOwner) {
				await owner.lose(saves, ui.discardPile);
				game.log(card, "掉落了", saves);
				saves.forEach(i => i.removeGaintag(STRUCT_TAG));
			}
			storage.length = 0;
		}
		physical.destroyed = true;
		physical.selfDestroy(event);
	},
	equipDelay: false,
	loseDelay: false,
	skills: [`${CARDNAME}_skill`],
	ai: {
		basic: {
			equipValue(card, player) {
				if (player.hasSkill("xiefangmrfz")) return 10;
				return -1;
			},
		},
		result: {
			target: (player, target, card) => get.equipResult(player, target, card.name),
		},
	},
	enable: true,
	selectTarget: -1,
	filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
	modTarget: true,
	allowMultiple: false,
	content: async function (event, trigger, player) {
		const { cards, target } = event;
		if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
	},
	toself: true,
});

cardTranslate({
	[CARDNAME]: "结构性原理",
	[`${CARDNAME}_info`]: `①出牌阶段限X次，若你拥有技能${get.poptip("xiefangmrfz")}，你可以将一张手牌置于此牌下，然后你可以将此牌置于一名其他角色的装备区内并对其造成一点伤害。（X=本回合使用非基本牌的数量）<br>②锁定技，当此牌不因交换装备或移动至其他装备区而离开你的装备区后，销毁之。`,
	[`${CARDNAME}_skill`]: "结构性原理",
	[`${CARDNAME}_skill_info`]: `①出牌阶段限X次，若你拥有技能${get.poptip("xiefangmrfz")}，你可以将一张手牌置于此牌下，然后你可以将此牌置于一名其他角色的装备区内并对其造成一点伤害。（X=本回合使用非基本牌的数量）<br>②锁定技，当此牌不因交换装备或移动至其他装备区而离开你的装备区后，销毁之。`,
});

cardSkill({
	[`${CARDNAME}_skill`]: {
		audio: false,
		enable: "phaseUse",
		//X=本回合使用非基本牌的数量
		usable(card, player) {
			return player.getHistory("useCard", evt => get.type(evt.card, "trick") != "basic").length;
		},
		filter(event, player) {
			return player.hasSkill("xiefangmrfz") && player.getEquip(CARDNAME) && player.countCards("h") > 0;
		},
		filterCard: true,
		position: "h",
		check(card) {
			return 4 - get.value(card);
		},
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			const equipCard = player.getEquip(CARDNAME);
			if (!equipCard) return;
			//①将一张手牌置于此牌下
			const cards = (event.cards ?? []).slice();
			if (cards.length) {
				const storage = equipCard.storage.saveCards ?? (equipCard.storage.saveCards = []);
				storage.addArray(cards);
				await player.lose({ cards, position: ui.special });
				player.directgains(cards, null, STRUCT_TAG);
				game.log(player, "将", cards, "置于", equipCard, "下");
			}
			const result = await player
				.chooseTarget({
					prompt: `是否将【${get.translation(CARDNAME)}】置于一名其他角色的装备区内并对其造成1点伤害？`,
					ai(target) {
						const player = get.player();
						return get.damageEffect(target, player, player);
					},
					filterTarget(card, player, target) {
						return target != player && target.canEquip(equipCard);
					},
				})
				.forResult();

			const target = result?.targets?.[0];
			if (!target) return;
			player.line(target);
			await target.equip(equipCard);
			if (target.isIn()) {
				await target.damage({
					source: player,
				});
			}
		},
		intro: {
			content(storage, player, skill) {
				//@ts-ignore
				const num = lib.skill[`${CARDNAME}_skill`].usable(null, player);
				const structs = player.getVCards("e", card => card.name === CARDNAME);
				const cards: Card[] = [];
				for (const struct of structs) {
					if (struct.storage.saveCards) {
						//@ts-ignore
						const structCards:Card[] = struct.cards;
						if(!structCards) continue;
						for(let structCard of structCards){
							if(structCard.storage.saveCards){
								cards.addArray(structCard.storage.saveCards);
							}
						}
					}
				}
				const str = `共有${get.cnNumber(cards.length)}张牌`;
				return `·可使用${num}次<br>·${str}`;
			},
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
		mod: {
			cardEnabled2(card, player) {
				if (!ui.selected.cards.length) {
					return;
				}
				const cards = player.getVCards("e", card => card.name === CARDNAME);
				for (const struct of cards) {
					if (!struct || !struct.storage.saveCards || !struct.storage.saveCards.length) {
						return;
					}
					for (const i of ui.selected.cards) {
						//@ts-ignore
						if (struct.cards?.includes(i) && struct.storage.saveCards.includes(card)) {
							return false;
						}
						if (struct.storage.saveCards.includes(i) && card === struct) {
							return false;
						}
					}
				}
			},
		},
	},
});
