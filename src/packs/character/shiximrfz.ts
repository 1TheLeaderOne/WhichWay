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

/** 所有存储记录中的真牌（真牌物理上在 S 区 ui.special，带 TOWER gaintag） */
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

/** 通过副本（_cardid 指向真牌 cardid）找到 S 区对应的真牌 */
function findStoredCardByCopy(copy: Card): Card | undefined {
	const cardid = (copy as any)._cardid;
	if (!cardid || !save[TOWER]) return undefined;
	for (const id in save[TOWER]) {
		const arr = save[TOWER][id] as Card[];
		const found = arr.find(c => c.cardid === cardid);
		if (found) return found;
	}
	return undefined;
}

/** 判断一张牌是否带通讯塔 tag（gaintag 在失去流程中会被剥离，需查失去前的 gaintag_map） */
function cardHasTowerTag(card: Card, evt: any): boolean {
	if (card.hasGaintag(TOWER)) return true;
	return evt?.gaintag_map?.[card.cardid]?.includes(TOWER);
}

/** 同步核心：把 S 区的存储真牌同步给所有拥有者（每玩家一张副本，不带绑定关系） */
function syncTowerCards() {
	if (!game || !game.players) return;
	// 清理所有角色手上的通讯塔副本（带 TOWER gaintag）；真牌在 S 区不受影响
	for (const p of game.players.concat(game.dead)) {
		p.getCards("hs", c => c.hasGaintag(TOWER)).forEach(c => c.delete());
	}
	const CardsInfo: [Player, Card[]][] = [];
	for (const id in save[TOWER]) {
		const target = game.findPlayer(c => c.playerid === id);
		if (!target) continue;
		CardsInfo.push([target, save[TOWER][id]]);
	}
	for (const [owner] of CardsInfo) {
		// 给每个拥有者发副本（副本带 _cardid 关联真牌 + "属于XXX"提示）
		const fakeCards = CardsInfo.flatMap(([storer, links]) =>
			links.map(c => {
				const cardx = ui.create.card();
				//@ts-ignore
				cardx.init(get.cardInfo(c));
				//@ts-ignore 关联 S 区真牌（仅用于失去时定位真牌）
				cardx._cardid = c.cardid;
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
			// 真牌丢到 S 区（特殊区）并打上通讯塔 tag；Proxy 监听 → 自动同步给所有拥有者
			_status.discarded?.removeArray?.(cards);
			await game.cardsGotoSpecial(cards, false);
			cards.forEach(c => c.addGaintag(TOWER));
			playerSave.push(...cards);
		},
		onremove(player, skill) {
			// 通讯塔离开装备区（被销毁/弃置/移动）：该角色 S 区的存储牌移入弃牌堆，并播放销毁音效
			if (save[TOWER] && player.playerid !== undefined) {
				const stored = save[TOWER][player.playerid] as Card[] | undefined;
				if (stored?.length) {
					const list = stored.slice();
					stored.length = 0; // 先清存储 → Proxy 触发同步，移除所有拥有者的副本
					game.cardsDiscard(list); // S 区真牌 → 弃牌堆
					player.$throw(list, 1000);
					player.popup(TOWER);
					game.log(player, "的【通讯塔】被销毁，置于其上的牌被弃置", list);
				}
				delete save[TOWER][player.playerid];
				// 销毁音效：baitiemrfzcardad4.mp3（支援装备音频）
				game.trySkillAudio("baitiemrfzcardad", player, true);
			}
			if (save[TOWER] && Object.keys(save[TOWER]).length === 0) {
				disposeTowerObserver();
			}
		},
	},
});

// ============ 技能二：失去监测——S 区 tag 牌失去后删除其他玩家手中相同的牌，并移除提示标记 ============
cardSkill({
	[`${TOWER}_skill7`]: {
		audio: false,
		charlotte: true,
		trigger: { player: "loseEnd" },
		firstDo: true,
		forced: true,
		silent: true,
		delay: false,
		filter(event, player) {
			if (!event.ss || !event.ss.length) return false;
			const stored = getStoredCards();
			if (!stored.length) return false;
			// 玩家失去的牌里，有通讯塔 tag 的（副本）或 S 区真牌
			return event.ss.some(card => cardHasTowerTag(card, event) || stored.includes(card));
		},
		async content(event, trigger, player) {
			const evt = trigger.getl(player);
			const lost = (trigger.ss || []).filter(card => cardHasTowerTag(card, evt) || isStoredCard(card));
			for (const lostCard of lost) {
				// 该牌从任意玩家手牌区失去 → 移除其上的"属于XXX"提示标记
				whichWayTips.removePrompt(lostCard);
				// 检索所有玩家 S 区（手牌区 position "s"）中与这张牌 id(_cardid) 相同的牌并删除
				// （所有人手上的都是真牌副本，同 id 的份都要作废）
				const targetId = (lostCard as any)._cardid || lostCard.cardid;
				for (const p of game.players.concat(game.dead)) {
					p.getCards("hs", c => c.hasGaintag(TOWER) && ((c as any)._cardid === targetId || c.cardid === targetId)).forEach(c => c.delete());
				}
				// 源真牌从存储移除并删除（S 区残留作废）
				const real = isStoredCard(lostCard) ? lostCard : findStoredCardByCopy(lostCard);
				if (real) {
					removeStoredCard(real);
					if (get.position(real, true) == "s") {
						real.delete();
					}
				}
			}
			syncTowerCards(); // 重新同步（已失去的牌不会再发放）
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
