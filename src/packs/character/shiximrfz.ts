import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, card, cardSkill, cardTranslate } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";
import { whichWayTips } from "../../tips/index.ts";
// 时隙 3
// 飞声：使命技，出牌阶段开始时，你可以将一张牌作为【通讯塔】置入你或与装备【通讯塔】的角色距离为1的角色的装备区。
// 成功：回合结束时，场上有四张【通讯塔】：摸一张牌。
// 咫行：锁定技。①当你不因【咫行】而摸牌后，你令所有拥有【咫行】的角色制衡1；②当你使命技成功后，你重置该技能。
/**
 * 通讯塔 宝物 ♠13
锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。
 */

const NAME = "shiximrfz";
const TOWER = "tower_shiximrfz";
const TOWER_BIND = "towerBindShiximrfz"; // 副本 → 真牌的绑定标记（参考 muniu：directgain 的牌必须与真实牌建立关系）
const save = window.whichWaySave.tmpSave;
type CardSave = Record<string, Card[]>;

character(NAME, {
	sex: "female",
	group: "leimrfz",
	hp: 3,
	pack: "epicSJZX",
	skills: ["feishengmrfz", "zhixingmrfz"],
});

characterTitle(NAME, whichWayUtil.colorize("#b不一样的梦想#"));
characterIntro(NAME, "时隙,通讯技术工程师，其研究成果已应用于雷姆必拓远程通讯系统。现加入罗德岛工程部，为罗德岛基地远程通讯提供技术支持。");

translate({
	[NAME]: "时隙",

	feishengmrfz: "飞声",
	feishengmrfz_info: "使命技，出牌阶段开始时，你可以将一张手牌作为【通讯塔】置入你或与装备【通讯塔】的角色距离为1的角色的装备区。<br>成功：回合结束时，场上存在【通讯塔】：摸X张牌。（X=场上拥有【通讯塔】角色的数量，X至多为你的体力上限）",
});

skill({
	feishengmrfz: {
		audio: ["部署1", "部署2"],
		dutySkill: true,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player, name, target) {
			return player.countCards("h") > 0 && getUsableTower(player).length > 0;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseCardTarget({
					prompt: get.prompt("feishengmrfz"),
					prompt2: "你可以将一张手牌作为【通讯塔】置入你或与装备【通讯塔】的角色距离为1的角色的装备区",
					position: "h",
					filterCard: () => true,
					filterTarget(card, player, target) {
						return getUsableTower(player).includes(target) && target.canEquip(TOWER);
					},
					ai1(card) {
						return 8 - get.value(card);
					},
					ai2(target) {
						return get.attitude2(target);
					},
				})
				.forResult();
			event.result = {
				...result,
				cost_data: {
					cards: result.cards,
					targets: result.targets,
				},
			};
		},
		async content(event, trigger, player) {
			const { cards, targets } = event.cost_data as Result;
			const target = targets[0];
			const card = new lib.element.VCard({ name: TOWER, cards: cards , suit:"spade"});
			await target.equip(card);
		},
		group: ["feishengmrfz_achieve"],
		subSkill: {
			achieve: {
				audio: "feishengmrfz",
				forced: true,
				trigger: {
					player: "phaseEnd",
				},
				filter(event, player, name, target) {
					return game.countPlayer(char => char.countCards("e", card => get.name(card) === TOWER) > 0) > 0;
				},
				async content(event, trigger, player) {
					const num = Math.min(
						player.maxHp,
						game.countPlayer(char => char.countCards("e", card => get.name(card) === TOWER) > 0)
					);
					await player.draw(num);
					game.log(player, "成功完成使命");
					player.awakenSkill("feishengmrfz");
				},
			},
		},
	},
});

card(TOWER, {
	audio: false,
	image: `ext:WhichWay/image/card/tower_shiximrfz.jpg`,
	type: "equip",
	subtype: "equip5",
	// skill：存储弃置牌 + 同步到各拥有者手牌区；skill7：使用/失去时把假牌替换成真牌（参考 muniu_skill / muniu_skill7）
	skills: [`${TOWER}_skill`, `${TOWER}_skill7`],
	// 离开装备区即销毁（防止进入弃牌堆/牌堆污染，参照 tiejili 铁蒺藜骨朵）
	destroy: true,
	ai: {
		basic: {
			equipValue: 7,
		},
	},
});

// ============ 通讯塔存储同步（监听式） ============
// save[TOWER]（Record<playerid, Card[]>）一旦变化，自动把存储的牌重建为虚拟牌，
// 同步给所有有存储记录的玩家。参考 spchuxuemrfz 的 Proxy 监听范式
// （player.storage.xxx.acted = new Proxy([], handler)，set 时回调）。
// 回收：onremove 清空存储记录后 dispose 代理 + 清定时器，防内存泄漏。

let towerObserver: { raw: CardSave; alive: boolean } | null = null;
let towerSyncTimer: number | null = null;
const towerProxiedArrays = new WeakSet<object>();

/** 确保监听代理存在（全局幂等，多玩家共享一份） */
function ensureTowerObserver() {
	if (towerObserver?.alive) return;
	save[TOWER] ??= {};
	const raw = save[TOWER] as CardSave;

	// 子数组代理：监听 push/splice/pop/length 等一切写操作
	const arrayHandler: ProxyHandler<Card[]> = {
		set(target, prop, value) {
			Reflect.set(target, prop, value);
			scheduleTowerSync();
			return true;
		},
		deleteProperty(target, prop) {
			const r = Reflect.deleteProperty(target, prop);
			scheduleTowerSync();
			return r;
		},
	};
	// 外层对象代理：监听增删玩家记录；新增数组自动套上子数组代理
	const outerHandler: ProxyHandler<CardSave> = {
		set(target, prop, value) {
			if (Array.isArray(value) && !towerProxiedArrays.has(value)) {
				towerProxiedArrays.add(value);
				Reflect.set(target, prop, new Proxy(value as Card[], arrayHandler));
			} else {
				Reflect.set(target, prop, value);
			}
			scheduleTowerSync();
			return true;
		},
		deleteProperty(target, prop) {
			const r = Reflect.deleteProperty(target, prop);
			scheduleTowerSync();
			return r;
		},
	};

	// 已存在的子数组也包上代理，保证后续 push 可被监听
	for (const id in raw) {
		const arr = raw[id];
		if (Array.isArray(arr) && !towerProxiedArrays.has(arr)) {
			towerProxiedArrays.add(arr);
			raw[id] = new Proxy(arr, arrayHandler);
		}
	}

	save[TOWER] = new Proxy(raw, outerHandler) as unknown as CardSave;
	towerObserver = { raw, alive: true };
}

/** 回收监听：解除代理引用、清空定时器 */
function disposeTowerObserver() {
	if (towerSyncTimer !== null) {
		clearTimeout(towerSyncTimer);
		towerSyncTimer = null;
	}
	if (towerObserver?.alive) {
		save[TOWER] = towerObserver.raw;
		towerObserver.alive = false;
		towerObserver = null;
	}
}

/** 去抖：存储区频繁变化时合并为一次同步，避免事件流中被 directgains 干扰 */
function scheduleTowerSync() {
	if (towerSyncTimer !== null) return;
	towerSyncTimer = window.setTimeout(() => {
		towerSyncTimer = null;
		syncTowerCards();
	}, 30);
}

/** 所有存储记录中的真牌 */
function getStoredCards(): Card[] {
	const list: Card[] = [];
	if (!save[TOWER]) return list;
	for (const id in save[TOWER]) {
		list.addArray(save[TOWER][id] as Card[]);
	}
	return list;
}

/** 从存储记录中移除一张真牌 */
function removeStoredCard(real: Card) {
	if (!save[TOWER]) return;
	for (const id in save[TOWER]) {
		const arr = save[TOWER][id] as Card[];
		if (arr.includes(real)) {
			arr.remove(real);
			return;
		}
	}
}

/** 真牌当前是否还在通讯塔存储中 */
function isStoredCard(card: Card): boolean {
	return getStoredCards().includes(card);
}

/**
 * 假牌替换成真牌（对应 muniu_skill7 的 storages.removeArray）：
 * 副本被"使用"（useCard，含装备牌：装备牌 content=equipCard 会 target.equip(event.card)）时，
 * 把 useCard 事件的 card/cards 替换成真牌，让后续结算（含装备）处理真牌。
 * - 装备牌：由 equipCard → equip 流程处理真牌位置（存储者 lose 真牌到特殊区 → 装备区）。
 * - 普通牌：真牌顶替副本进结算区，随使用流程进弃牌堆。
 * 返回 true 表示已消费真牌；返回 false 表示非使用（弃置等）——只作废副本、真牌保留。
 */
function replaceFakeWithReal(fake: Card, real: Card, trigger?: GameEvent): boolean {
	// 真牌脱离存储者手牌区前，先清掉通讯塔标记
	real.removeGaintag(TOWER);
	real.classList.remove("glows", "glow");
	real.fix();
	const useEvent = trigger?.getParent?.(e => e.name == "useCard");
	if (useEvent && useEvent.card === fake) {
		// 正在"使用"这张副本
		useEvent.card = real;
		useEvent.cards = [real];
		if (get.type(real) != "equip") {
			// 普通牌：真牌顶替副本进结算区，随使用流程进弃牌堆
			real.goto(ui.ordering);
		}
		// 副本（已失去到结算区）作废
		fake.delete();
		return true;
	}
	return false;
}

/** 同步核心：把存储的真牌同步到各拥有者手牌区（真牌留在存储者手中，其余拥有者发绑定副本） */
function syncTowerCards() {
	if (!game || !game.players) return;
	// 清理所有角色手上的通讯塔【副本】（带 TOWER_BIND 绑定标记）；真牌保留在存储者手中
	for (const p of game.players.concat(game.dead)) {
		p.getCards("hs", c => c.hasGaintag(TOWER) && (c as any)[TOWER_BIND]).forEach(c => c.delete());
	}
	// 兜底：清理泄漏进弃牌堆的副本（死亡弃置等场景，gaintag 已剥离但绑定标记仍在）
	for (const card of Array.from(ui.discardPile.childNodes)) {
		if ((card as any)[TOWER_BIND]) {
			(card as any).delete();
		}
	}
	const CardsInfo: [Player, Card[]][] = [];
	for (const id in save[TOWER]) {
		const target = game.findPlayer(c => c.playerid === id);
		if (!target) continue;
		CardsInfo.push([target, save[TOWER][id]]);
	}
	for (const [owner] of CardsInfo) {
		// 存储者本人持有真牌（position "s"），不发副本；其余拥有者发与真牌绑定的副本
		const fakeCards = CardsInfo.flatMap(([storer, links]) =>
			links
				.filter(c => storer !== owner)
				.map(c => {
					const cardx = ui.create.card();
					//@ts-ignore
					cardx.init(get.cardInfo(c));
					//@ts-ignore
					cardx._cardid = c.cardid;
					//@ts-ignore 绑定真牌：副本被使用/失去时据此换成真牌
					cardx[TOWER_BIND] = c;
					//@ts-ignore
					cardx[TOWER] = storer;
					whichWayTips.addPrompt(cardx, `属于${get.translation(storer)}`, `${TOWER}_${storer.playerid}`);
					return cardx;
				})
		);
		if (fakeCards.length) owner.directgains(fakeCards, null, TOWER);
	}
}

// ============ 技能一：存储弃置牌 + 同步到各拥有者手牌区（参考 muniu 的 loseToSpecial / onEquip） ============
cardSkill({
	[`${TOWER}_skill`]: {
		audio: false,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			// 只负责捕获"弃置后进入弃牌堆"的牌
			if (event.type != "discard") return false;
			let evt = event.getl(player);
			if (!evt || !evt.cards2) return false;
			for (let i = 0; i < evt.cards2.length; i++) {
				if (get.position(evt.cards2[i]) == "d") return true;
			}
			return false;
		},
		init(player, skill) {
			save[TOWER] ??= {};
			save[TOWER][player.playerid as string] ??= [];
			ensureTowerObserver();
			syncTowerCards();
		},
		forced: true,
		async content(event, trigger, player) {
			save[TOWER] ??= {};
			const playerSave = (save[TOWER][player.playerid as string] ||= []) as Card[];
			const cards2 = (trigger.getl(player).cards2 || []) as Card[];
			const cards = cards2.filter(card => get.position(card, true) == "d" && !playerSave.includes(card));
			if (!cards.length) return;
			// 真牌：弃牌堆 → 特殊区（引擎处理无主牌的正规路径，对应 muniu loseToSpecial 前半段）
			//      → 存储者手牌区（directgains，对应 muniu onEquip / loseToSpecial 后半段）
			_status.discarded?.removeArray?.(cards);
			await game.cardsGotoSpecial(cards, false);
			player.directgains(cards, null, TOWER);
			playerSave.push(...cards); // Proxy 监听 → 自动同步给其他拥有者
		},
		onremove(player, skill) {
			// 通讯塔离开装备区（被销毁/弃置/移动）：该角色存储的牌移入弃牌堆，并播放销毁音效
			if (save[TOWER] && player.playerid !== undefined) {
				const stored = save[TOWER][player.playerid] as Card[] | undefined;
				if (stored?.length) {
					const list = stored.slice();
					stored.length = 0; // 先清存储 → Proxy 触发同步，移除其他拥有者的副本
					player.lose(list, ui.discardPile);
					player.$throw(list, 1000);
					player.popup(TOWER);
					game.log(player, "的【通讯塔】被销毁，置于其上的牌被弃置", list);
				}
				delete save[TOWER][player.playerid];
			}
			if (save[TOWER] && Object.keys(save[TOWER]).length === 0) {
				disposeTowerObserver();
			}
		},
	},
});

// ============ 技能二：使用/失去时把假牌（副本）替换成真牌 ============
cardSkill({
	[`${TOWER}_skill7`]: {
		audio: false,
		charlotte: true,
		trigger: { player: ["phaseUseBefore", "loseEnd"] },
		firstDo: true,
		forced: true,
		silent: true,
		delay: false,
		filter(event, player) {
			if (event.name === "phaseUse") return true;
			if (!event.ss || !event.ss.length) return false;
			const stored = getStoredCards();
			if (!stored.length) return false;
			// 玩家失去的特殊区牌里，有通讯塔副本（带绑定标记）或真牌（在存储区中）
			return event.ss.some(card => (card as any)[TOWER_BIND] || stored.includes(card));
		},
		async content(event, trigger, player) {
			if (trigger.name === "phaseUse") return;
			const lost = (trigger.ss || []).filter(card => (card as any)[TOWER_BIND] || isStoredCard(card));
			for (const lostCard of lost) {
				const real = (lostCard as any)[TOWER_BIND] || lostCard;
				if (lostCard !== real) {
					// 副本：被"使用"则假换真并消费真牌；被弃置（死亡清理等）只作废副本，真牌保留
					if (replaceFakeWithReal(lostCard, real, trigger)) {
						removeStoredCard(real);
					} else {
						lostCard.delete();
					}
				} else {
					// 真牌被存储者自己失去：脱离存储区，随失去流程进入结算区/装备区
					removeStoredCard(real);
				}
			}
			syncTowerCards();
		},
	},
});

cardTranslate({
	[TOWER]: "通讯塔",
	[`${TOWER}_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
	[`${TOWER}_skill`]: "通讯塔",
	[`${TOWER}_skill_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
	[`${TOWER}_skill7`]: "通讯塔",
	[`${TOWER}_skill7_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
});

function getUsableTower(player: Player): Player[] {
	const results: Set<Player> = new Set();
	if (player.countCards("e", card => get.name(card) === TOWER) < 1) {
		results.add(player);
	}
	for (let target of game.players.slice()) {
		if (!target.countCards("e", card => get.name(card) === TOWER)) continue;
		game.filterPlayer(char => get.distance(char, target) <= 1).forEach(c => results.add(c));
	}
	return Array.from(results);
}
