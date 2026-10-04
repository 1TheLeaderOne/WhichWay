/**
 * dungeon.ts —— 副本探索图（策划案「副本流程」）
 *
 * 副本 = 驻扎点(outpost) + 通路(path)。每条通路由 1~5 个通路节点组成；
 * 每经过一个通路/驻扎点算一次行动。驻扎点可能遭遇敌人；boss 只在驻扎点。
 *
 * 本模块负责“图”的生成与行动计数，以及在本 realm 内跑完一局对局（launchBrawlMatch）。
 * 实际战斗由父窗口的 battleHost 拉起同源 iframe 子实例、在其中调用本模块的 launchBrawlMatch 完成。
 */

import { lib, game, ui, get, _status } from "noname";
import { DIFFICULTY, Difficulty } from "./data/dungeons.js";
import { rollMonsterGroup, getCharSpeed, getInitHandSize, type MonsterGroup } from "./data/monsters.js";
import { type EquipStat, getEquipment } from "./data/equipment.js";
import { installBattleOverlays } from "./battleOverlay.js";

export type NodeKind = "outpost" | "path";

export interface DungeonNode {
	/** 全局编号 */
	index: number;
	kind: NodeKind;
	/** 节点事件：驻扎点 normal | elite | boss；通路 treasure(宝箱) | obstacle(障碍) */
	event?: "normal" | "elite" | "boss" | "treasure" | "obstacle";
	/** 本节点是否已有敌人（清扫目标） */
	hasEnemy?: boolean;
	/** 通往的邻居 index 列表（无向） */
	neighbors: number[];
	/** 是否已被探索/清扫 */
	explored?: boolean;
	/** 事件已了结：宝箱已开启 / 障碍已铲除 */
	cleared?: boolean;
	/** 宝箱已被玩家答复（开过或放弃路过）：避免同一节点反复弹窗 */
	decided?: boolean;
}

export interface DungeonLayout {
	dungeonId: string;
	difficulty: Difficulty;
	nodes: DungeonNode[];
	/** 起始驻扎点 */
	entry: number;
}

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * 生成一个副本布局：
 *  - 先把 outposts 个驻扎点按“链 + 随机捷径”连成主干；
 *  - 每条相邻驻扎点之间的通路插入 1~5 个通路节点；
 *  - 通路节点里按比例撒宝箱（可放弃）与障碍（不铲除就无法通过，见 outposts*0.4 / *0.3）；
 *  - boss 出现在最远端驻扎点（TODO：具体哪只 boss 由敌人配置表给出）。
 */
export function generateDungeon(dungeonId: string, difficulty: Difficulty): DungeonLayout {
	const cfg = DIFFICULTY[difficulty];
	const outposts = cfg.outposts;

	const nodes: DungeonNode[] = [];
	const mk = (kind: NodeKind, extra?: Partial<DungeonNode>): DungeonNode => {
		const n: DungeonNode = { index: nodes.length, kind, neighbors: [], ...extra };
		nodes.push(n);
		return n;
	};
	const link = (a: DungeonNode, b: DungeonNode) => {
		a.neighbors.push(b.index);
		b.neighbors.push(a.index);
	};

	// 主干驻扎点
	const opList: DungeonNode[] = [];
	for (let i = 0; i < outposts; i++) opList.push(mk("outpost", { event: i === 0 ? "normal" : i === outposts - 1 ? "boss" : "normal", hasEnemy: true }));

	// 驻扎点之间插通路节点（1~5 个），并连成一段
	const pathNodes: DungeonNode[] = [];
	const bridge = (a: DungeonNode, b: DungeonNode) => {
		let prev = a;
		const seg = randInt(1, 5);
		for (let s = 0; s < seg; s++) {
			const node = mk("path");
			pathNodes.push(node);
			link(prev, node);
			prev = node;
		}
		link(prev, b);
	};

	for (let i = 0; i < outposts - 1; i++) bridge(opList[i], opList[i + 1]);
	// 少量捷径，让图有分支感
	for (let i = 0; i < Math.floor(outposts / 4); i++) {
		const a = opList[randInt(0, outposts - 3)];
		const b = opList[randInt(a.index + 1, outposts - 1)];
		if (a !== b && !a.neighbors.includes(b.index)) bridge(a, b);
	}

	// 通路节点撒事件：宝箱（可花 1 后勤小队开箱，或放弃通过）+ 障碍（不铲除就无法通过）。
	// 数量随驻扎点规模走（占位比例，待平衡）；一个节点只带一种事件，故池不足时自然少出几个。
	const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
	const treasureCount = clamp(Math.round(outposts * 0.4), 2, 6);
	const obstacleCount = clamp(Math.round(outposts * 0.3), 1, 4);
	const eventNodes = [...pathNodes];
	for (let i = eventNodes.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[eventNodes[i], eventNodes[j]] = [eventNodes[j], eventNodes[i]];
	}
	for (const node of eventNodes.splice(0, treasureCount)) node.event = "treasure";
	for (const node of eventNodes.splice(0, obstacleCount)) node.event = "obstacle";

	return { dungeonId, difficulty, nodes, entry: 0 };
}

/** 行动计数器：每 10 次行动消耗 1 粮草（实际扣减在战役层处理） */
export const ACTION_TO_RATION = 10;

/** 任务目标结算辅助：绘图 = 探索 >= outposts*0.8 */
export const exploreGoalRatio = 0.8;

/** 需玩家答复才了结的通路节点：宝箱（可放弃）、障碍（必须铲除才能通过） */
export const isEventNode = (n: DungeonNode): boolean => n.event === "treasure" || n.event === "obstacle";

/** 未铲除的障碍：走上去可以，但也仅此而已——不铲掉就堵死这条路 */
export const isBlockedObstacle = (n: DungeonNode): boolean => n.event === "obstacle" && !n.cleared;

// ---------------- 战斗系统：在本 realm 内拉起一场无名杀标准对局（brawl scene → identity 模式） ----------------

/** 一场战斗的入场参数 */
export interface BattleInit {
	/** 副本 id（取怪物池） */
	dungeonId: string;
	/** 触发本场战斗的节点 index（结算返回时用于定位/设置当前节点） */
	nodeIndex: number;
	/** 我方小队（干员 id） */
	party: string[];
	/** 我方各干员当前体力（跨节点不重置，进战斗时作为初始 hp） */
	allyHp: Record<string, number>;
	/** 我方各干员等级（驱动开局等级效果：3 级额外摸牌 / 4 级闪杀 / 5 级护甲 / 6 级手牌上限） */
	allyLevel: Record<string, number>;
	/** 我方各干员装备属性加成汇总（开局施加：护甲/手牌上限/开局摸牌/杀次数/体力上限） */
	allyEquip?: Record<string, EquipStat>;
	/** 我方各干员已穿戴装备 id 列表（供开局调用各装备的自定义 effect 钩子） */
	allyEquips?: Record<string, string[]>;
}

/** launchBrawlMatch 的结算返回（经 battleChild 回传父窗口，供战斗简报使用） */
export interface BattleResult {
	win: boolean;
	nodeIndex: number;
	/** 我方各干员战斗结束时体力（<=0 视为阵亡；缺席按 0 兜底） */
	finalHp: Record<string, number>;
	/** 被击杀的敌方武将 id */
	killedEnemies: string[];
	/** 阵亡归因：干员 id → 击杀者（角色 id + 阵营）。缺省（undefined）= 无来源，按意外死亡 */
	deaths: Record<string, { id: string | null; faction: "enemy" | "ally" | "self" } | undefined>;
	/** 我方各干员的击杀数（干员 id → 击杀敌人数），用于 1 级「击杀减压力」结算 */
	kills: Record<string, number>;
}

interface SceneCard {
	name: string;
	name2: string;
	position: number;
	identity: string;
	hp: number;
	maxHp: number;
	/** 我方干员等级（敌方/缺省按 1）；驱动 gameStart 开局等级效果 */
	level?: number;
	/** 我方干员装备加成汇总（仅 playercontrol 携带）；驱动开局护甲/手牌/摸牌/杀次数效果 */
	equip?: EquipStat;
	/** 我方干员已穿戴装备 id 列表（仅 playercontrol 携带）；开局后逐一调用其 EquipmentDef.effect */
	equipIds?: string[];
	handcards: string[][];
	equips: string[][];
	judges: string[][];
	playercontrol: boolean;
	linked: boolean;
	turnedover: boolean;
}

const panel = (id: string): { hp: number; maxHp: number } => {
	const c = (lib.character as Record<string, { hp?: number; maxHp?: number }>)[id] || {};
	return { hp: c.hp ?? 4, maxHp: c.maxHp ?? 4 };
};
/** 显式卡名列表 → scene 三元组（花色/点数留随机，由 createCard 解析） */
const nameList = (names?: string[]): string[][] => (names ?? []).map(c => [c, "random", "random"]);

/** 由怪物池/兜底抽将得到敌方怪物组（导出供上层预览）；随机敌池固定取本体武将，见 monsters.ts getBaseEnemyPool */
export const rollEnemies = (dungeonId: string): MonsterGroup => rollMonsterGroup(dungeonId);

/**
 * 安装一个「击杀来源」记录器：只在战斗期间临时包裹 lib.element.player.die，
 * 首次死亡时记下传入 die 的 reason.source（引擎在 player.js 的 die() 里以 reason.source 表示致死来源）。
 * 纯读取、立即转调原实现、整体 try 包裹，且战斗结束即还原——绝不改变死亡流程本身。
 * 拿不到来源（reason 无 source）时归因留空，墓园按「意外死亡」处理。
 */
function installDeathRecorder(): { read: (p: Player) => Player | undefined; uninstall: () => void } {
	const byVictim = new Map<Player, Player | undefined>();
	const proto = (lib.element as unknown as { player?: { die?: (...a: never[]) => unknown } })?.player;
	const orig = proto && typeof proto.die === "function" ? proto.die : undefined;
	if (proto && orig) {
		proto.die = function (this: Player, ...args: [{ source?: Player } | undefined]) {
			try {
				if (!byVictim.has(this)) byVictim.set(this, args[0]?.source);
			} catch {
				/* ignore */
			}
			return orig.apply(this, args as never);
		} as typeof orig;
	}
	return {
		read: p => byVictim.get(p),
		uninstall: () => {
			if (proto && orig) proto.die = orig;
		},
	};
}

/**
 * 临时启用「基于 side 的全员玩家操控」——照抄 versus/boss 的多控机制，只在战斗窗口内生效，结束即还原。
 *
 * 引擎事实：把一场对局的某个玩家交给真人操作，靠三处协作（见 content.ts / skill.js）：
 *  - Player.prototype.isUnderControl()：控制门的判定（versus 用 this.side==me.side，boss 用 side+single_control）；
 *  - game.modeSwapPlayer(player)：内联交换点（chooseToUse 5134、chooseToRespond 5489、chooseToDiscard 5942）据此
 *    调 game.swapControl 把 game.me 切到待行动玩家，令其 isMine() 为真、由真人操作而非跑 AI；
 *  - 全局技 autoswap（lib.skill.autoswap）：对 chooseToCompare/chooseCard/chooseButton/choosePlayerCard… 等
 *    一批「比牌 / 展示牌 / 选按钮」事件才触发换人（火攻比牌即走此路）。versus/boss 一律 game.addGlobalSkill。
 * identity 三者都不给（非 game.me 一律判假、modeSwapPlayer 未定义、不加 autoswap），所以原生无法多控。
 * 这里以最小、可逆的方式补齐这三处，等价于把 versus/boss 的 side 控制搬到当前对局：
 *  1) isUnderControl：**仅开赛后**(_status.gameStarted)把本场我方在场干员一律判为玩家操控，
 *     选人阶段仍走 identity 原逻辑（避免引擎为每名我方各弹一次选将框）。
 *  2) modeSwapPlayer：identity 未定义，补一个转调 game.swapPlayer 的实现——把待行动我方转到 0 号底栏座并刷新
 *     身份/高亮，令「武将展示」随操控对象切换（不碰 versus/boss 的 onSwapControl/fakeme 装饰）。
 */
function installSideControl(): { uninstall: () => void } {
	const proto = (lib.element as unknown as { player?: { isUnderControl?: (self?: boolean, me?: Player) => boolean } })?.player;
	const orig = proto && typeof proto.isUnderControl === "function" ? proto.isUnderControl : undefined;
	if (proto && orig) {
		proto.isUnderControl = function (this: Player, self?: boolean, me?: Player) {
			if (_status.gameStarted && this !== (me || game.me)) {
				const info = this.brawlinfo as SceneCard | undefined;
				if (info && info.playercontrol === true && !this.isDead() && !this.isMad()) return true;
			}
			return orig.call(this, self, me);
		} as typeof orig;
	}
	const hadModeSwap = (game as unknown as { modeSwapPlayer?: (player: Player) => void }).modeSwapPlayer;
	(game as unknown as { modeSwapPlayer?: (player: Player) => void }).modeSwapPlayer = (player: Player) => {
		// 用 swapPlayer 而非 swapControl：后者只换 game.me+手牌、不动座位(dataset.position)，
		// 底栏放大「武将展示」仍停在开局那位；swapPlayer 会把待行动者转到 0 号座并刷新身份/高亮，面板才随之切换。
		(game as unknown as { swapPlayer?: (player: Player) => void }).swapPlayer?.(player);
	};
	// 关键补全：引擎的通用换人靠全局技 autoswap（见 skill.js），它对 chooseToCompareBegin/chooseCardBegin/
	// chooseButtonBegin/choosePlayerCardBegin… 等一系列「展示牌 / 比较牌 / 选按钮」事件触发时才调 swapPlayerAuto。
	// chooseToUse/Respond/Discard 有内联 modeSwapPlayer，但**火攻(比牌)与诸多展示牌流程只走 autoswap**——
	// versus/boss 都靠 game.addGlobalSkill("autoswap") 打开多控；identity 不加，故此前这些技能不会换人。
	// 加上它（本子实例 realm 独立，卸载或随 iframe 销毁即还原），令上述遗漏场景全部随操控切换。
	game.addGlobalSkill("autoswap");
	return {
		uninstall: () => {
			if (proto && orig) proto.isUnderControl = orig;
			const g = game as unknown as { modeSwapPlayer?: (player: Player) => void };
			if (hadModeSwap) g.modeSwapPlayer = hadModeSwap;
			else delete g.modeSwapPlayer;
			game.removeGlobalSkill("autoswap");
		},
	};
}

/**
 * 在「本 realm」内拉起一场真实对局：抽怪物组 → 组装 brawl「场景」→ game.switchMode('identity')。
 * 胜利=击杀全部敌方（自定义 checkResult）。对局结束由 onover 捕获血量/击杀并 resolve 本 Promise。
 *
 * 调用方是战斗子实例（battleChild，见 iframe 隔离方案）：本函数只负责“在当前 realm 跑完一局并给出结果”，
 * 打完即由上层把结果 postMessage 回父窗口、iframe 随即销毁——因此**不再需要**就地连开多场那套
 * resetArenaForNextMatch/cleanupOverUI（它们是为“同一 realm 复用、不刷新继续下一场”而生的历史包袱）。
 *
 * 引擎事实：identity 只回调 brawl 的 chooseCharacter 系列与 checkResult 钩子，**不回调 gameStart/noGameDraw**，
 * 且 game.me 会被 identity 以面板值重新 init。故血量与我方初始手牌统一在 lib.onphase 首个阶段做一次性归一化。
 * 座位按武将速度（getCharSpeed，暂恒 0）→ 同速随机。无法开新局时回退占位结果，绝不卡死。
 */
export async function launchBrawlMatch(init: BattleInit): Promise<BattleResult> {
	const enemyGroup = rollEnemies(init.dungeonId);
	const players: SceneCard[] = [];

	init.party.forEach((id, i) => {
		const p = panel(id);
		const eq = init.allyEquip?.[id];
		players.push({
			name2: "none",
			position: 0,
			identity: i === 0 ? "zhu" : "zhong",
			hp: Math.max(1, Math.floor(init.allyHp[id] ?? p.hp)),
			maxHp: p.maxHp + (eq?.maxHp ?? 0),
			level: init.allyLevel[id] ?? 1,
			equip: eq,
			equipIds: init.allyEquips?.[id],
			handcards: [], // 初始手牌交给 gameDraw + onphase 归一化(getInitHandSize)
			equips: [],
			judges: [],
			playercontrol: true,
			linked: false,
			turnedover: false,
		});
	});
	for (const m of enemyGroup) {
		const p = panel(m.charId);
		players.push({
			name2: "none",
			position: 0,
			identity: "fan",
			hp: Math.max(1, Math.floor(m.hp ?? p.hp)),
			maxHp: Math.max(m.maxHp ?? p.maxHp, Math.floor(m.hp ?? p.hp)),
			handcards: m.hand ? nameList(m.hand) : [], // 未配置手牌 → 默认 gameDraw(4)
			equips: nameList(m.equips),
			judges: [],
			playercontrol: false,
			linked: false,
			turnedover: false,
		});
	}
	const scenePlayers = players.map((pl, idx) => {
		const id = pl.playercontrol ? init.party[idx] : enemyGroup[idx - init.party.length].charId;
		return { ...pl, name: id };
	});
	// 座位：按武将速度降序（越快座位号越小），同速随机。速度接口目前恒为 0 → 全员同速随机。
	for (const pl of scenePlayers) (pl as { _r: number })._r = Math.random();
	scenePlayers.sort((a, b) => getCharSpeed(b.name) - getCharSpeed(a.name) || (a as { _r: number })._r - (b as { _r: number })._r).forEach((pl, i) => {
		pl.position = i + 1;
	});

	const scene = { players: scenePlayers };
	// 自建 brawl「场景」content：identity 会读取 _status.brawl 上的这些钩子（不依赖 brawl.js 是否已加载）。
	const content: Record<string, unknown> = {
		submode: "normal",
		noAddSetting: true,
		identityShown: true,
		playerNumber: scenePlayers.length,
		scene,
		init: () => {
			game.saveConfig("double_character", false, "identity");
		},
		chooseCharacterBefore: makeChooseCharacterBefore(),
		chooseCharacterAi: makeChooseCharacterAi(),
		chooseCharacter: makeChooseCharacter(),
		gameStart: makeGameStart(),
		checkResult: makeCheckResult(),
	};

	return await new Promise<BattleResult>(resolve => {
		let settled = false;
		let normalized = false;
		const recorder = installDeathRecorder();
		let sideControl: { uninstall: () => void } | null = null;
		let overlays: { refresh: () => void; uninstall: () => void } | null = null;
		const finish = (r: BattleResult) => {
			if (settled) return;
			settled = true;
			overlays?.uninstall();
			sideControl?.uninstall();
			const oi = lib.onover.indexOf(onover as never);
			if (oi >= 0) lib.onover.splice(oi, 1);
			const pi = lib.onphase.indexOf(phaseHook as never);
			if (pi >= 0) lib.onphase.splice(pi, 1);
			const aiStatus = (_status as unknown as { ai?: { customAttitude?: ((f: never, t: never) => number | undefined)[] } }).ai;
			if (Array.isArray(aiStatus?.customAttitude)) {
				const idx = aiStatus.customAttitude.indexOf(customAttitude as never);
				if (idx >= 0) aiStatus.customAttitude.splice(idx, 1);
			}
			recorder.uninstall();
			resolve(r);
		};

		// 一次性归一化：修 game.me 被 identity 重 init 造成的血量丢失 + 按 API 设定我方初始手牌
		const normalize = () => {
			if (normalized) return;
			normalized = true;
			const allies: { player: GameStatusPlayer; ids?: string[] }[] = [];
			for (const p of game.players) {
				const info = p.brawlinfo as SceneCard | undefined;
				if (!info) continue;
				if (info.maxHp) {
					p.maxHp = info.maxHp;
					if (p.hp > p.maxHp) p.hp = p.maxHp;
				}
				if (info.hp) {
					p.hp = info.hp;
					if (p.hp > p.maxHp) p.maxHp = p.hp;
				}
				if (info.playercontrol) {
					const target = getInitHandSize(info.name, info.level ?? 1) + (info.equip?.drawStart ?? 0);
					const cur = p.countCards("h");
					if (cur < target) p.draw(target - cur);
					// cur>target 的削减留待需要时再补
					allies.push({ player: p, ids: info.equipIds });
				}
				p.update();
			}
			// 所有角色初始化完成后：对每名我方干员的每件装备各调用一次自定义 effect（补充 stat 之外的行为）。
			// 血量/手牌已就位，effect 里的 changeHujia/draw/addSkill 等即时且持久效果才不会被上面的归一化覆盖。
			for (const { player, ids } of allies) {
				if (!ids) continue;
				for (const id of ids) {
					const eff = getEquipment(id)?.effect;
					if (typeof eff !== "function") continue;
					try {
						eff(_status.event, player);
					} catch (e) {
						console.error(`[GloriousIdeal] 装备 effect 执行失败 ${id}`, e);
					}
				}
			}
			// 角色与手牌就位后安装战斗覆盖层（队友手牌 / 装备面板）；幂等，只装一次。
			if (!overlays) {
				try {
					overlays = installBattleOverlays();
				} catch (e) {
					console.error("[GloriousIdeal] 战斗覆盖层安装失败", e);
				}
			}
		};
		const phaseHook = () => {
			normalize();
		};

		// 分队：显式给 AI 一个敌我态度，绕开 identity 的"身份隐藏→态度归零"路径
		// （identity.js:3866 会把非主公的态度乘 ai.shown，开局多为 0，导致友军互相不认识、敌军乱打）。
		// rawAttitude 若拿到 customAttitude 的非 undefined 值即优先采用，故以 brawlinfo.playercontrol 定敌我。
		const customAttitude = (from: Player, to: Player): number | undefined => {
			if (from === to) return undefined;
			const a = (from.brawlinfo as SceneCard | undefined)?.playercontrol;
			const b = (to.brawlinfo as SceneCard | undefined)?.playercontrol;
			if (a === undefined || b === undefined) return undefined;
			return a === b ? 10 : -10;
		};

		const onover = (bool: boolean | null) => {
			normalize();
			const finalHp: Record<string, number> = {};
			const killedEnemies: string[] = [];
			const kills: Record<string, number> = {};
			const deaths: BattleResult["deaths"] = {};
			for (const p of [...game.players, ...game.dead]) {
				const info = p.brawlinfo as SceneCard | undefined;
				if (!info) continue;
				if (info.playercontrol) {
					const hp = Math.max(0, Math.floor((p.hp as number) ?? 0));
					finalHp[info.name] = hp;
					if (hp <= 0 || p.isDead()) {
						const killer = recorder.read(p);
						if (killer) {
							const kinfo = killer.brawlinfo as SceneCard | undefined;
							const faction: "enemy" | "ally" | "self" = killer === p ? "self" : kinfo?.playercontrol ? "ally" : "enemy";
							deaths[info.name] = { id: killer.name1 || null, faction };
						} else {
							deaths[info.name] = undefined; // 无来源 → 意外死亡
						}
					}
				} else if (p.isDead()) {
					killedEnemies.push(p.name1 || info.name); // 以实际在场武将名为准，避免与简报不符
					// 击杀归属：致死来源若是存活/在场我方干员，计入其击杀数（供 1 级减压力）
					const killer = recorder.read(p);
					const kinfo = killer?.brawlinfo as SceneCard | undefined;
					if (kinfo?.playercontrol) kills[kinfo.name] = (kills[kinfo.name] ?? 0) + 1;
				}
			}
			for (const id of init.party) if (finalHp[id] == null) finalHp[id] = 0; // 缺席按阵亡
			const win = bool === true;
			finish({ win, nodeIndex: init.nodeIndex, finalHp, killedEnemies, kills, deaths });
		};

		try {
			lib.configOL.number = scenePlayers.length; // arena 人数
			_status.brawl = content as never;
			const aiStatus = ((_status as unknown as { ai?: Record<string, unknown> }).ai ??= {});
			const attArr = (Array.isArray(aiStatus.customAttitude) ? aiStatus.customAttitude : (aiStatus.customAttitude = [])) as unknown[];
			attArr.push(customAttitude);
			lib.onphase.push(phaseHook as never);
			lib.onover.push(onover as never);
			game.switchMode("identity");
			sideControl = installSideControl(); // 全员玩家操控：装到 identity 的原生 isUnderControl/modeSwapPlayer 之上
			(content.init as () => void)();
		} catch (e) {
			console.error("[GloriousIdeal] 拉起真实对局失败，回退到占位结算", e);
			const win = Math.random() > 0.4;
			const finalHp: Record<string, number> = {};
			for (const id of init.party) finalHp[id] = Math.max(0, Math.floor(init.allyHp[id] ?? panel(id).hp) - (win ? 1 : 2));
			finish({ win, nodeIndex: init.nodeIndex, finalHp, killedEnemies: [], kills: {}, deaths: {} });
		}
	});
}

// ---------------- brawl「场景」钩子（照抄 core/mode/brawl.js 场景运行器的等价逻辑） ----------------

function makeChooseCharacterBefore() {
	return function () {
		const scene = _status.brawl.scene as { players: SceneCard[] };
		const playercontrol: SceneCard[] = [];
		let maxpos = 0;
		for (const info of scene.players) {
			if (info.playercontrol) playercontrol.push(info);
			maxpos = Math.max(maxpos, info.position);
		}
		if (maxpos < scene.players.length) maxpos = scene.players.length;
		const posmap: number[] = [];
		for (let i = 1; i <= maxpos; i++) posmap.push(i);
		for (const info of scene.players) if (info.position) posmap.remove(info.position);
		for (const info of scene.players) if (!info.position) info.position = posmap.randomRemove();
		if (playercontrol.length) game.me.brawlinfo = playercontrol[0];
		else game.me.brawlinfo = scene.players.randomGet();
		const getpos = (info: SceneCard) => {
			let dp = info.position - game.me.brawlinfo.position;
			if (dp < 0) dp += maxpos;
			return dp;
		};
		scene.players.sort((a, b) => getpos(a) - getpos(b));
		let target = game.me;
		const createCard = (info: string[]) => {
			const info2: string[] = [];
			info2.push(info[1] === "random" ? (["club", "spade", "heart", "diamond"] as string[]).randomGet() : info[1]);
			info2.push(info[2] === "random" ? String(Math.ceil(Math.random() * 13)) : info[2]);
			info2.push(info[0] === "random" ? (lib.inpile as string[]).randomGet() : info[0]);
			return ui.create.card().init(info2);
		};
		_status.firstAct = game.me;
		for (const info of scene.players) {
			target.brawlinfo = info;
			target.identity = info.identity;
			if (target.identity === "zhu") target.isZhu = true;
			target.setIdentity(info.identity);
			target.node.marks.hide();
			if (info.name !== "random") target.init(info.name);
			// 体力：本版本 identity 不再回调 brawl 的 gameStart，直接在此覆盖面板血/上限
			if (info.maxHp) {
				target.maxHp = info.maxHp;
				if (target.hp > target.maxHp) target.hp = target.maxHp;
			}
			if (info.hp) {
				target.hp = info.hp;
				if (target.hp > target.maxHp) target.maxHp = target.hp;
			}
			target.update();
			if (info.linked) target.classList.add("linked" + (get.is.linked2(target) ? "2" : ""));
			if (info.turnedover) target.classList.add("turnedover");
			if (info.position < (_status.firstAct.brawlinfo as SceneCard).position) _status.firstAct = target;
			// 手牌：默认交给 identity 的自动 gameDraw(4)；仅显式配置的手牌在此注入
			const hs = info.handcards.map(createCard);
			if (hs.length) target.directgain(hs);
			for (const eq of info.equips) {
				const card = createCard(eq);
				target.addVirtualEquip(get.autoViewAs(card, void 0, false), [card]);
			}
			for (const jd of info.judges) {
				const card = createCard(jd);
				target.addVirtualJudge(get.autoViewAs(card, void 0, false), [card]);
			}
			target = target.next;
		}
	};
}

function makeChooseCharacterAi() {
	// 照抄 core/mode/brawl.js:5112 场景版 chooseCharacterAi：**不能 return false**。
	// identity.js:1690 规定返回值 !== false 时才跳过引擎自带的随机选将；返回 false 会让 identity
	// 用随机武将重新 init 每个 AI 玩家（我方队友/敌方全部被打乱），这正是"队友变随机角色"的根因。
	// name2 恒为 "none"，故仅需处理 name==="random" 的情况；其余武将已在 chooseCharacterBefore 就位。
	return function (player: Player, list: string[]) {
		const info = player.brawlinfo as SceneCard & { name: string };
		if (info.name === "random") player.init(list.randomGet());
	};
}

function makeChooseCharacter() {
	return function (_list: string[]) {
		const info = game.me.brawlinfo as SceneCard & { name: string };
		const event = _status.event as { chosen?: string[] };
		if (info.name && info.name !== "random") event.chosen = [info.name];
		if (game.me.identity === "zhu") return false;
		return "nozhu";
	};
}

/**
 * 6 级「手牌上限+1」技能：一次性注册到引擎 lib.skill/lib.translate，
 * gameStart 时挂到我方干员身上即生效（mod.maxHandcard 是纯被动改写，无需触发时机）。
 * 战斗结束玩家对象销毁即失效，无需还原；全局技能定义留着无害。
 */
const LV6_HAND_SKILL = "gloriousIdealLv6Hand";
/**
 * 装备被动技能：读取持有者 brawlinfo.equip，动态改写【杀】次数与手牌上限。
 * 一个定义服务所有干员（各自 brawlinfo 不同）；仅在 attackExtra/maxHandcard 非零时挂上。
 */
const EQUIP_SKILL = "gloriousIdealEquip";
const equipOf = (player: Player): EquipStat | undefined => (player.brawlinfo as SceneCard | undefined)?.equip;
let levelSkillsRegistered = false;
function ensureLevelSkills() {
	if (levelSkillsRegistered) return;
	const skillLib = lib.skill as Record<string, unknown>;
	if (skillLib && !skillLib[LV6_HAND_SKILL]) {
		skillLib[LV6_HAND_SKILL] = {
			lock: true,
			mod: { maxHandcard: (_player: Player, num: number) => num + 1 },
		};
	}
	if (skillLib && !skillLib[EQUIP_SKILL]) {
		skillLib[EQUIP_SKILL] = {
			lock: true,
			mod: {
				cardUsable: (card: { name?: string }, player: Player, num: number) => {
					if (card.name === "sha") return num + (equipOf(player)?.attackExtra ?? 0);
				},
				maxHandcard: (player: Player, num: number) => num + (equipOf(player)?.maxHandcard ?? 0),
			},
		};
	}
	const translate = lib.translate as Record<string, string>;
	if (translate) {
		if (translate[LV6_HAND_SKILL] === undefined) translate[LV6_HAND_SKILL] = "久经沙场";
		if (translate[LV6_HAND_SKILL + "_info"] === undefined) translate[LV6_HAND_SKILL + "_info"] = "手牌上限+1。";
		if (translate[EQUIP_SKILL] === undefined) translate[EQUIP_SKILL] = "装备加成";
		if (translate[EQUIP_SKILL + "_info"] === undefined) translate[EQUIP_SKILL + "_info"] = "来自所穿戴装备的持续加成。";
	}
	levelSkillsRegistered = true;
}

/**
 * gameStart 钩子（identity 经 gameEvent 回调 _status.brawl.gameStart）：按等级施加开局被动。
 * 仅处理我方在场干员（brawlinfo.playercontrol）。等级 1/2 是结算期效果（击杀减压力 / 受伤压力-10%），
 * 等级 3 的额外摸牌已在 normalize 里通过 getInitHandSize(+1) 施加；这里做 4/5/6 级：
 *  4 级——从牌堆各拿一张【闪】【杀】；5 级——获得 1 点护甲；6 级——手牌上限+1（挂技能）。
 * 血量无需在此重设：chooseCharacterBefore 与 normalize 已两次对齐面板/跨节点血量。
 */
function makeGameStart() {
	return function () {
		ensureLevelSkills();
		for (const p of game.players) {
			const info = p.brawlinfo as SceneCard | undefined;
			if (!info || !info.playercontrol) continue;
			const level = info.level ?? 1;
			if (level >= 4) {
				const found: unknown[] = [];
				const shan = get.cardPile("shan", "cardPile");
				const sha = get.cardPile("sha", "cardPile");
				if (shan) found.push(shan);
				if (sha) found.push(sha);
				if (found.length) p.directgain(found);
			}
			if (level >= 5) p.changeHujia(1);
			if (level >= 6) p.addSkill(LV6_HAND_SKILL);
			const eq = info.equip;
			if (eq) {
				if (eq.hujia) p.changeHujia(eq.hujia);
				if (eq.attackExtra || eq.maxHandcard) p.addSkill(EQUIP_SKILL);
			}
		}
	};
}

function makeCheckResult() {
	return function () {
		const all = [...game.players, ...game.dead];
		const foes = all.filter(p => (p.brawlinfo as SceneCard | undefined)?.playercontrol === false);
		const mine = all.filter(p => (p.brawlinfo as SceneCard | undefined)?.playercontrol === true);
		if (foes.every(p => p.isDead())) game.over(true);
		else if (mine.every(p => p.isDead())) game.over(false);
	};
}
