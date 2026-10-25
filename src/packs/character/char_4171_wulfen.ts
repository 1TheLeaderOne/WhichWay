import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayFile } from "../../file.js";

/**
 * 钼铅
 *
 * 两个技能围绕「**石**」这一武将牌上的标记展开：
 * - 「石」= 置于**武将牌上**（扩展区，`player.getExpansions`）的牌，用 `addToExpansion` 放入，
 *   这是引擎里「置于武将牌上」的唯一正规写法（与 `char_2023_ling` / `char_151_myrtle` 一致）。
 * - 「石的**类别**」= `get.type2()`，即 基本牌 / 锦囊牌 / 装备牌 三类
 *   （`get.type2` 会把延时锦囊并进 trick，见 `get/index.js:3385`，与玩家对「类别」的直觉一致）。
 * - 子技能统一用 `charlotte: true`（不计入技能数、不可被无效），因为它们是内部实现细节。
 */

const SHI_TAG = "cangshimrfz"; //「石」牌的 gaintag，用于 addToExpansion 后识别

/** 取「石」的所有类别（去重） */
function shiTypes(player: Player): string[] {
	const types: string[] = [];
	for (const card of player.getExpansions(SHI_TAG)) {
		const t = get.type2(card, false);
		if (t && !types.includes(t)) types.push(t);
	}
	return types;
}

/** 三类牌型的全集，用于求「差集」 */
const ALL_TYPES = ["basic", "trick", "equip"];

character("char_4171_wulfen", { pack: "epicSJZX", sex: "female", group: "samrfz", hp: 3, skills: ["cangshimrfz", "wulfen_lanshimrfz"], llm: "DeepSeek-4.1-Flash" });

skill({
	/**
	 * 藏石
	 *
	 * > 当其他角色因弃置或使用而有牌进入弃牌堆后，若你没有与此牌相同类别的「石」，
	 * > 你可以将其置于你的武将牌上，称之为「石」，
	 * > 然后与此「石」同花色的牌不计入手牌上限直到你失去此「石」。
	 *
	 * 实现要点：
	 * - 触发：「**其他角色**因**弃置或使用**而有牌进入弃牌堆」。
	 *   两种进入方式分别对应 `loseAfter`（弃置）与 `cardsDiscardAfter`（使用后经处理区进堆），
	 *   归属判定沿用本扩展已在【萤火】里验证过的写法：弃置走 `getd(player)`，
	 *   使用走「全局历史里这张牌最近一次离开谁的区域」。
	 * - 「若你**没有**与此牌相同类别的石」⇒ 每次只能收**一张**（待选牌里类别不与已有「石」重复的）。
	 * - 「置于你的武将牌上」⇒ `addToExpansion`，带 gaintag 便于后续识别。
	 * - 「与此石同花色的牌不计入手牌上限直到你失去此石」⇒ 用 `mod.ignoredHandcard` 动态判断：
	 *   只要该花色的「石」还在扩展区，这个花色的手牌就不计入上限；
	 *   石被移走后（`getExpansions` 里没有该花色）自动失效，无需额外清理。
	 */
	cangshimrfz: {
		audio: ["行动开始", "部署1"],
		trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
		filter(event, player) {
			const cards = getDiscardCandidates(event, player);
			if (!cards.length) return false;
			//「若你没有与此牌相同类别的石」⇒ 至少有一张牌的类别是新的
			const have = shiTypes(player);
			if (!cards.some(card => !have.includes(get.type2(card, false)))) return false;
			return true;
		},
		onremove(player, type) {
			const exps = player.getExpansions(SHI_TAG);
			if (exps.length > 0) player.loseToDiscardpile({ cards: exps });

			player.removePromptSJZX("cangshimrfz_tips");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool({
					prompt: get.prompt("cangshimrfz"),
					prompt2: "你可以将其中一张牌置于你的武将牌上，称之为「石」",
					ai() {
						return true;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const pool = getDiscardCandidates(trigger, player);
			const have = shiTypes(player);
			//只允许选「类别不在已有石里」的牌
			const selectable = pool.filter(card => !have.includes(get.type2(card, false)));
			if (!selectable.length) return;

			const result = await player
				.chooseCardButton({
					prompt: `【藏石】:选择一张牌置于你的武将牌上，称之为「石」`,
					forced: true,
					select: 1,
					cards: selectable,
					ai(button) {
						return get.value(button.link, get.player());
					},
				})
				.forResult();
			const chosen = result.links?.[0];
			if (!chosen) return;
			//`addToExpansion` 用对象参数（`Object.assign(next, params)`，见 `player.js:8671`）：
			//牌写 `cards`、来源写 `source`、gaintag 直接作为参数传入（与 `char_151_myrtle` 一致）。
			await player.addToExpansion({
				cards: [chosen],
				gaintag: [SHI_TAG],
				source: player,
			});
		},
		mark: true,
		markimage: whichWayFile.compilePath("skill:cangshimrfz.png"),
		intro: {
			mark(dialog, storage, player, event, skill) {
				const exps = player.getExpansions(SHI_TAG);
				if (exps.length < 1) {
					dialog.addText("没有“石”");
					return;
				}
				dialog.addAuto(exps);
			},
			// content(storage, player) {
			// 	const exps = player.getExpansions(SHI_TAG);
			// 	if (!exps.length) return "没有「石」";
			// 	const list = exps.map(card => `${get.translation(card)}(${get.translation(get.type2(card, false))}/${get.translation(get.suit(card, false))})`);
			// 	return `「石」：${list.join("、")}`;
			// },
		},
		mod: {
			/** 与「石」同花色的牌不计入手牌上限（石移走即自动失效） */
			ignoredHandcard(card, player) {
				const suit = get.suit(card, false);
				if (!suit) return false;
				return player.getExpansions(SHI_TAG).some(shi => get.suit(shi, false) === suit);
			},
		},
		group: "cangshimrfz_tips",
		subSkill: {
			tips: {
				charlotte: true,
				silent: true,
				trigger: {
					player: ["gainAfter", "loseAfter", "loseAsyncAfter", "cangshimrfzAfter", "wulfen_lanshimrfzAfter"],
				},
				async content(event, trigger, player) {
					const id = "cangshimrfz_tips",
						suits = player
							.getExpansions(SHI_TAG)
							.slice()
							.map(i => get.suit(i), false);
					player.removePromptSJZX(id);
					for (let card of player.getCards("h")) {
						if (suits.includes(get.suit(card, player))) {
							card.addPromptSJZX("不计入手牌上限", id);
						}
					}
				},
			},
		},
	},

	/**
	 * 览石
	 *
	 * > 锁定技，每轮开始时，若你有「石」，你执行至第X项：
	 * > 2.摸一张牌；
	 * > 1.本轮你视为装备一张武器牌；
	 * > 0.获得所有的「石」。
	 * > （X = 「石」的类别与牌的类别的差集中的元素数量）
	 *
	 * 实现要点：
	 * - 「每轮开始时」⇒ `global: "roundStart"`，且只在**有石**时触发。
	 * - X = 「石」的类别与「牌的类别」的**差集**元素数：
	 *   「牌的类别」= 全部三类（basic / trick / equip），差集 = 三类里**还没有对应石**的那些，
	 *   即 X 表示「还缺几类石」。石越多 ⇒ X 越小。
	 * - 「执行至第X项」= 选项顺序是 `[2, 1, 0]`，从前往后执行，**执行到项号等于 X 的那一项为止**：
	 *   - X = 0 ⇒ 执行 2、1、0（全部三项）；
	 *   - X = 1 ⇒ 执行 2、1；
	 *   - X = 2 ⇒ 只执行 2。
	 *   注意方向：**X 越小执行越多**（X=0 是「石最齐」的状态，全部效果都吃满）。
	 * - 「视为装备一张武器牌」⇒ **由玩家自己选**一张武器牌（用本扩展的 `player.chooseFakeCard`
	 *   从全部武器牌里挑，假牌不污染手牌数据），然后本轮视为装备该武器：
	 *   复制它的装备技能（参考 `char_4226_veen` 的【齐力】），并按它的 `distance` 补攻击距离，
	 *   全部用 `addTempSkill` 到 `roundEnd` 结束。
	 */
	wulfen_lanshimrfz: {
		audio: ["作战中2", "进驻设施"],
		trigger: { global: "roundStart" },
		forced: true,
		filter(event, player) {
			return player.getExpansions(SHI_TAG).length > 0;
		},
		async content(event, trigger, player) {
			const shi = player.getExpansions(SHI_TAG);
			if (!shi.length) return;

			//X = 三类牌型里「还没有对应石」的数量（石越齐，X 越小）
			const have = shiTypes(player);
			const missing = ALL_TYPES.filter(t => !have.includes(t));
			const X = missing.length;

			//选项顺序 [2, 1, 0]，执行到项号 === X 为止 ⇒ 可执行的项号都 ≥ X
			const doItem2 = X <= 2; //摸一张牌
			const doItem1 = X <= 1; //视为装备一张武器牌
			const doItem0 = X <= 0; //获得所有的「石」

			//2. 摸一张牌
			if (doItem2) {
				await player.draw({ num: 1 });
			}
			//1. 本轮视为装备一张武器牌（玩家自选）
			if (doItem1) {
				await equipVirtualWeapon(player);
			}
			//0. 获得所有的「石」
			if (doItem0) {
				const all = player.getExpansions(SHI_TAG);
				if (all.length) await player.gain({ cards: all, animate: "gain2" });
			}
		},
		subSkill: {
			weapon_tips: {
				charlotte: true,
				silent: true,
				onremove: true,
				intro: {
					content(storage, player, skill) {
						return `·视为装备${get.translation(storage)}`;
					},
				},
			},
		},
	},
});

/**
 * 让 `player` 本轮「视为装备一张武器牌」。
 *
 * 武器牌**由玩家自己选**：把全部武器牌做成假牌交给 `player.chooseFakeCard` 挑选
 * （假牌不污染手牌数据，选完自动删除；`result.links[0]` 才是选中的那张原牌）。
 * 选中后：复制该武器牌自带的装备技能给玩家（做法参考 `char_4226_veen` 的【齐力】），
 * 并按它的 `distance` 补攻击距离，全部用 `addTempSkill` 到 `roundEnd` 结束。
 *
 * @param player 目标角色
 */
async function equipVirtualWeapon(player: Player) {
	//收集所有武器牌（subtype 为 equip1）
	const weapons = lib.inpile.filter(name => get.type(name) === "equip" && get.subtype(name) === "equip1");
	if (!weapons.length) return;

	//做成 VCard 交给 chooseFakeCard 让玩家挑（假牌，不占手牌、选完自动删）
	const vcards = weapons.map(name => new lib.element.VCard({ name }));
	const result = await player
		.chooseFakeCard({
			cards: vcards,
			selectCard: 1,
			forced: true,
			prompt: `【览石】:请选择一张武器牌，本轮你视为装备该武器`,
			tagName: "览石",
			ai(card) {
				//AI 优先选攻击距离最大的武器（`card` 是假牌，与源牌同名，`get.subtype`/`distance` 都可用）
				const info = get.info(card, false)?.distance;
				let range = 1;
				if (info) {
					if (typeof info.attackFrom === "number") range = 1 - info.attackFrom;
					else if (typeof info.attackRange === "function") range = info.attackRange(card, get.player()) as number;
				}
				return typeof range === "number" ? range : 1;
			},
		})
		.forResult();
	const picked = result.links?.[0];
	const name = picked?.name;
	if (!name) return;

	const skills = lib.card?.[name]?.skills || [];
	if (!skills.length) return;

	const suffix = "_lanShiVirtualWeapon";
	//复制技能：加一个「本轮且拥有览石」的门控
	for (const skillName of skills) {
		const origin = lib.skill[skillName];
		if (!origin) continue;
		const copyId = `${skillName}${suffix}`;
		const copy: Skill = {
			...origin,
			forced: origin.forced,
			filter(event, player, name2, target) {
				if (!player.hasSkill("wulfen_lanshimrfz")) return false;
				if (origin.filter && !origin.filter(event, player, name2, target)) return false;
				return true;
			},
			audio: "wulfen_lanshimrfz",
		};
		game.broadcastAll(
			(id, data, srcId) => {
				lib.skill[id] = data;
				if (lib.translate[srcId]) lib.translate[id] = lib.translate[srcId];
				if (lib.translate[`${srcId}_info`]) lib.translate[`${id}_info`] = lib.translate[`${srcId}_info`];
			},
			copyId,
			copy,
			skillName
		);
		player.addTempSkill(copyId, { global: "roundEnd" });
	}

	const tipID = "wulfen_lanshimrfz_weapon_tips";
	player.addTempSkill(tipID, { global: "roundEnd" });
	player.storage[tipID] = name;
	player.markSkill(tipID);

	//攻击距离：按该武器牌的 distance 信息给一个临时 mod
	const distInfo = get.info(name, false)?.distance;
	let range = 1;
	if (distInfo) {
		const vcard = get.autoViewAs({ name });
		if (typeof distInfo.attackRange === "function") {
			let num = distInfo.attackRange(lib.element.card.init(vcard), player);
			if (typeof num === "number") {
				range = num;
			}
		} else if (typeof distInfo.attackFrom === "number") range = 1 - distInfo.attackFrom;
	}
	if (range > 1) {
		const modId = "wulfen_lanshimrfz_virtualWeaponRange";
		game.broadcastAll(
			(id, delta) => {
				lib.skill[id] = {
					charlotte: true,
					silent: true,
					mod: {
						attackRange(player, num) {
							return num + delta;
						},
					},
				};
			},
			modId,
			range - 1
		);
		player.addTempSkill(modId, { global: "roundEnd" });
	}
}

/**
 * 从「进弃牌堆」事件里取出**其他角色**因**弃置或使用**而进堆的牌。
 *
 * ⚠️ 「**使用**」与「**打出**」是两回事，本技能只认使用、不认打出
 * （响应【南蛮入侵】而打出的【杀】属于「打出」，不应触发）。
 * 引擎里两者都会把 `lose.type` 写成 `"use"`，所以只能看事件链：
 * `respond` 是独立事件，用 {@link isRespondEvent} 判定。
 *
 * 两条链路（与【萤火】里验证过的一致）：
 * - **弃置类**：`lose` / `loseAsync`，`event.getd(player)` 直接给出「从该角色离开 + 落点弃牌堆」的牌；
 * - **使用类**：`cardsDiscard`，牌在处理区收尾时才进弃牌堆，归属用全局历史反查。
 *
 * @param event 触发事件
 * @param player 技能拥有者（显式传入，避免依赖 `get.player()` 的上下文）
 * @returns {Card[]} 落在弃牌堆、主人不是技能拥有者、且不是「打出」的牌
 */
function getDiscardCandidates(event, player) {
	/** 只保留「现在真的在弃牌堆」的牌 */
	const inPile = cards => (cards || []).filter(card => card && get.position(card, true) === "d");

	//「打出」不算：`respond` 是独立事件，顺着事件链往上一查即可
	//（「使用」与「打出」都会把 lose.type 写成 "use"，只能靠事件名区分）
	if (isRespondEvent(event)) return [];

	if (event.name === "cardsDiscard") {
		//归属：从本轮全局历史里找这张牌最近一次离开谁的区域
		return inPile(event.cards).filter(card => {
			const who = lastOwnerOf(card);
			return who && who !== player;
		});
	}
	//lose / loseAsync：getd 不带参数拿到全部，再按牌的原主人过滤
	const cards = typeof event.getd === "function" ? event.getd() : event.cards || [];
	const result: Card[] = [];
	for (const card of inPile(cards)) {
		const who = get.owner(card) || event.player;
		if (who && who !== player) result.push(card);
	}
	return result;
}

/**
 * 这个事件是否属于「**打出**」（`respond`）链路。
 *
 * 引擎里「使用」走 `useCard`、「打出」走 `respond`，但两者都会让自己的 `lose` 事件
 * 写成 `type: "use"`（`content.ts:10051` 的 useCard 分支与 `:11138` 的 respond 分支
 * 是同一段代码），所以**不能靠 `type` 区分**，只能按事件名查：
 * `respond` 是独立事件（`player.js:8259` 的 `game.createEvent("respond")`），
 * 从当前事件沿父链向上找，出现即为「打出」。
 *
 * @param event 触发事件
 * @returns {boolean} true 表示是「打出」，应排除
 */
function isRespondEvent(event) {
	//⚠️ 第 2 参数 `forced` 必须传 true：传 false 时「找不到」会返回空对象 `{}`（真值），
	//`!!` 会把它当成命中的 `respond`（见 `gameEvent.ts:152-155` 的 `toreturn`）。
	return !!event.getParent?.("respond", true, true);
}

/**
 * 从全局历史里反查这张牌最近一次「离开谁的区域」。
 *
 * 牌进弃牌堆后 `get.owner()` 返回 undefined（`get/index.js:4622-4650` 只看手/装/判/储四区），
 * 所以查 `everything`（本轮所有事件的聚合数组，`game/index.js:7`），从最近往回找。
 *
 * @param card 待查的牌
 * @returns {Player | undefined} 原主人
 */
function lastOwnerOf(card) {
	const history = game.getGlobalHistory("everything");
	if (!Array.isArray(history)) return undefined;
	for (let i = history.length - 1; i >= 0; i--) {
		const evt = history[i];
		if (!evt || !["lose", "loseAsync"].includes(evt.name)) continue;
		if (evt.name === "loseAsync") {
			if (!Array.isArray(evt.lose_list)) continue;
			for (const entry of evt.lose_list) {
				if (!Array.isArray(entry) || entry.length < 2) continue;
				const [who, cards] = entry;
				if (Array.isArray(cards) && cards.includes(card)) return who;
			}
			continue;
		}
		if (Array.isArray(evt.cards) && evt.cards.includes(card)) return evt.player;
	}
	return undefined;
}

translate({
	char_4171_wulfen: "钼铅",
	cangshimrfz: "藏石",
	cangshimrfz_info: "当其他角色因弃置或使用而有牌进入弃牌堆后，若你没有与此牌相同类别的“石”，你可以将其置于你的武将牌上，称之为“石”，然后与此“石”同花色的牌不计入手牌上限直到你失去此“石”。",
	wulfen_lanshimrfz: "览石",
	wulfen_lanshimrfz_info: "锁定技，每轮开始时，若你有“石”，你执行至第X项：<br>2.摸一张牌;<br>1.本轮你视为装备一张武器牌;<br>0.获得所有的“石”。（X = “石”的类别与牌的类别的差集中的元素数量）",
});

characterTitle("char_4171_wulfen", "<font color='#8a2be2'>矿石收藏家</font>");

characterIntro("char_4171_wulfen", "钼铅，探险家，矿石收藏家，同时也是哥伦比亚城际网络中颇为知名的社交媒体视频创作者。在地质考察过程中，不慎感染矿石病，来到罗德岛接受治疗。其后，经过交涉，作为特种干员加入罗德岛，以丰富的地质学知识和荒野求生经验，为罗德岛诸多队伍的野外探索任务提供支持。");
