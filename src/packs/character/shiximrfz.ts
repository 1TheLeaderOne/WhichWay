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
			await target.equip({ card: card });
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
	image: `ext:WhichWay/image/card/baitiemrfzcard1.jpg`,
	type: "equip",
	subtype: "equip5",
	skills: [`${TOWER}_skill`],
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

/** 同步核心：把存储的牌重建为虚拟牌，同步给所有有存储记录的玩家 */
function syncTowerCards() {
	if (!game || !game.players) return;
	const CardsInfo: [Player, Card[]][] = [];
	for (const id in save[TOWER]) {
		const target = game.findPlayer(c => c.playerid === id);
		if (!target) continue;
		CardsInfo.push([target, save[TOWER][id]]);
	}
	for (const [owner] of CardsInfo) {
		// 先清理 owner 旧的通讯塔虚拟牌（带 TOWER gaintag，真实手牌不受影响），避免累积
		owner.getCards("hs", c => c.hasGaintag(TOWER)).forEach(c => c.delete());
		// 再重建全部存储牌的副本
		const fakeCards = CardsInfo.flatMap(([infoOwner, links]) =>
			links.map(c => {
				const cardx = ui.create.card();
				//@ts-ignore
				cardx.init(get.cardInfo(c));
				//@ts-ignore
				cardx._cardid = c.cardid;
				//@ts-ignore
				cardx[TOWER] = infoOwner;
				whichWayTips.addPrompt(cardx, `属于${get.translation(infoOwner)}`, `${TOWER}_${infoOwner.playerid}`);
				return cardx;
			})
		);
		if (fakeCards.length) owner.directgains(fakeCards, null, TOWER);
	}
}

cardSkill({
	[`${TOWER}_skill`]: {
		audio: false,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			let evt = event.getl(player);
			if (!evt || !evt.cards2) {
				return false;
			}
			for (let i = 0; i < evt.cards2.length; i++) {
				if (get.position(evt.cards2[i]) == "d") {
					return true;
				}
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
			// 弃置的牌存入通讯塔存储区；push 会触发 Proxy 监听 → 自动同步给所有存储玩家
			const playerSave = save[TOWER][player.playerid as string] as Card[];
			const cards2 = trigger.getl(player).cards2 as Card[];
			playerSave.push(...cards2.filter(card => get.position(card, true) == "d"));
		},
		onremove(player, skill) {
			// 回收：移除该玩家的存储记录；无任何记录时断开全局监听
			if (save[TOWER] && player.playerid !== undefined) {
				delete save[TOWER][player.playerid];
			}
			if (save[TOWER] && Object.keys(save[TOWER]).length === 0) {
				disposeTowerObserver();
			}
		},
	},
});

cardTranslate({
	[TOWER]: "通讯塔",
	[`${TOWER}_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
	[`${TOWER}_skill`]: "通讯塔",
	[`${TOWER}_skill_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
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
