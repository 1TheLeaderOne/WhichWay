import { lib, game, ui, get, ai, _status } from "noname";
import { line, register } from "../hooks.ts";

/* ================================== 潜击 ================================== */

/** 潜击自身结算期间忽略“进入弃牌堆”的触发，避免自我连锁 */
const QIANJI_IGNORE = "qianjimrfz_ignore";

/** 取出本次事件中真正进入弃牌堆的牌（处理区里的不算） */
const qianjiCards = (event: GameEvent): Card[] => {
	const cards = typeof (event as any).getd === "function" ? (event as any).getd() : [];
	return (cards || []).filter((card: Card) => card && get.position(card, true) === "d");
};

/** 按牌名分组，返回出现 2 张及以上的组 */
const qianjiDuplicates = (cards: Card[]): [string, Card[]][] => {
	const map = new Map<string, Card[]>();
	for (const card of cards) {
		const name = get.name(card);
		if (!map.has(name)) map.set(name, []);
		map.get(name).push(card);
	}
	return [...map.entries()].filter(([, list]) => list.length > 1);
};

/* ================================== 注册 ================================== */

register("lvzemrfz", {
	character: {
		sex: "male",
		group: "luomrfz",
		hp: 4,
		skills: ["zefamrfz", "qianjimrfz", "dishimrfz"],
		pack: "plotSJZX",
		clans: ["RhodesElite"],
		llm: "DeepSeek-4.1-Flash",
		designer: ["白缪缪.ovo"],
	},
	dieLine: "我来殿后，他们抓不住我的！",
	characterTranslate: "精律则",
	characterNamePrefix: "精",
	intro: "Misery，罗德岛精英干员，巴别塔时期便已在其列。性格阴郁寡言，被同僚称作“永远的悲观主义者”：他习惯一边把玩匕首一边说话，先把最坏的结果说出口，然后照旧去做该做的事。他精于空间系源石技艺，以匕首为媒介操控空间与物质密度：可令地面软化、吞没敌人，令器物坚硬如铁，隐匿自身行迹，甚至改写他人法术的走向。不过，大规模的物质转化对他的身体负担极重，阿米娅曾为此提醒过他。他曾长期与奥卡（Outcast）共事。据奥卡生前转述（她惯于把别人的往事当作自己的经历讲给别人听，真伪难辨），Misery 曾在某座城镇开战前劝说居民武装自卫未果，最终城破人亡；这或许就是他此后一切悲观的源头。奥卡在维多利亚小丘郡牺牲后，他亲手为她操办葬礼，并坚持尽快进入伦蒂尼姆：“我不是要去复仇，我只是要亲眼看清，究竟是什么杀了她。”在伦蒂尼姆，他为格拉斯哥帮提供情报，独自闯入被改成拘留所的废弃工厂，把曼弗雷德与其萨卡兹部下所站的地面整个陷下去，救出号角的小队；此后又在蔓德拉濒死之际现身，给她“第二次机会”，蔓德拉抬眼看他，认定自己见到的是“真正的死亡”。他还曾改写曼弗雷德的法术、为博士一行打开炮台的通路；在“覆潮之下”事件后负责护送三位深海猎人返回罗德岛，途中遇伏，最终反被猎人们救下。“Misery”意为苦难，他从不为此辩解，只是继续做那个先一步走进黑暗、再让身后的人活着走过去的人。",
	title: "静默之刃",
	skillInfo: {
		/* -------------------------------- 则法 -------------------------------- */
		zefamrfz: {
			skillName: "则法",
			info: "出牌阶段限一次，你可以重铸任意张牌，若这些牌的花色均不相同，则你摸X张牌。（X为花色数）",
			skill: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				position: "he",
				selectCard: [1, Infinity],
				allowChooseAll: true,
				// 选牌交给引擎的 useSkill 流程（同制衡）；不自动弃置/失去，交给 content 里的 recast
				discard: false,
				lose: false,
				delay: false,
				filter(event, player) {
					return player.countCards("he", card => player.canRecast(card)) > 0;
				},
				filterCard(card, player) {
					return player.canRecast(card);
				},
				prompt: "则法：请选择任意张牌重铸",
				check(card) {
					const suits = (ui.selected?.cards || []).map(cardx => get.suit(cardx));
					return (suits.includes(get.suit(card)) ? 1 : 4) - get.value(card) / 2;
				},
				async content(event, trigger, player) {
					const cards = event.cards as Card[];
					if (!cards?.length) return;
					const suits = cards.map(card => get.suit(card));
					const distinct = new Set(suits).size === suits.length;
					await player.recast(cards);
					// 花色均不相同（1 张也算）时额外摸 X 张，X = 花色数
					if (distinct) await player.draw(new Set(suits).size);
				},
				ai: {
					order: 6,
					result: { player: 1 },
				},
			},
			line: ["空间有它的法则。我只是……比你更熟悉这些法则的人。","密度、距离、间隙。你以为的‘不可能’，不过是还没被拆解过的法则。"],
		},
		/* -------------------------------- 潜击 -------------------------------- */
		qianjimrfz: {
			skillName: "潜击",
			info: "转换技，阳：一张牌进入弃牌堆后，你可用一张手牌替换之；阴：多张牌同时进入弃牌堆后，你可使用其中一张牌，然后若这些牌存在相同牌名，则你可将这些牌视为一张此牌名的牌使用。",
			dyncTrans(player) {
				const yang = '阳：一张牌进入弃牌堆后，你可以获得该牌，然后将一张手牌置入弃牌堆。';
				const yin = '阴：多张牌同时进入弃牌堆后，你可以使用其中一张牌，然后若这些牌存在相同牌名，则你可以将这些牌视为一张此牌名的牌使用。';
				const active = player.storage.qianjimrfz ? yin : yang;
				const inactive = player.storage.qianjimrfz ? yang : yin;
				return '转换技，<span class="greentext">' + active + '</span>；' + inactive;
			},
			skill: {
				audio: 2,
				zhuanhuanji: true,
				mark: true,
				marktext: "☯",
				init(player, skill) {
					player.storage[skill] = false;
				},
				onremove: true,
				intro: {
					content(storage) {
						const yang = '阳：一张牌进入弃牌堆后，你可以获得该牌，然后将一张手牌置入弃牌堆。';
						const yin = '阴：多张牌同时进入弃牌堆后，你可以使用其中一张牌，然后若这些牌存在相同牌名，则你可以将这些牌视为一张此牌名的牌使用。';
						const active = storage ? yin : yang;
						const inactive = storage ? yang : yin;
						return '转换技，<span class="greentext">' + active + '</span>；' + inactive;
					},
				},
				// 引擎里「进入弃牌堆」有 lose 与 cardsDiscard 两条链路，必须都挂；cardsDiscard 没有 .player，只能走 global
				trigger: { global: ["loseAfter", "cardsDiscardAfter"] },
				filter(event, player) {
					if (player.storage[QIANJI_IGNORE]) return false;
					const cards = qianjiCards(event);
					if (!cards.length) return false;
					// storage 为 true 时是阴，否则是阳
					if (player.storage.qianjimrfz) return cards.length > 1;
					return cards.length === 1;
				},
				check(event, player) {
					const cards = qianjiCards(event);
					if (player.storage.qianjimrfz) {
						return cards.some(card => player.hasUseTarget(card)) || qianjiDuplicates(cards).length > 0;
					}
					const card = cards[0];
					return !!card && get.value(card, player) >= 4;
				},
				async content(event, trigger, player) {
					const yang = !player.storage.qianjimrfz;
					const cards = qianjiCards(trigger);
					if (!cards.length) return;
					player.changeZhuanhuanji("qianjimrfz");
					player.storage[QIANJI_IGNORE] = true;
					try {
						if (yang) {
							// 阳：获得该牌，然后将一张手牌置入弃牌堆
							const card = cards[0];
							await player.gain({ cards: [card], animate: "gain2" });
							await player.chooseToDiscard({ position: "h", forced: true, prompt: "潜击：将一张手牌置入弃牌堆" }).forResult();
							return;
						}
						// 阴：先使用其中一张
						const usable = cards.filter(card => player.hasUseTarget(card));
						let used: Card | null = null;
						if (usable.length) {
							const result = await player
								.chooseButton({
									createDialog: ["潜击：选择一张牌使用", usable],
									selectButton: 1,
									ai: button => get.player().getUseValue(button.link),
								})
								.forResult();
							if (result?.bool && result.links?.length) {
								const card = result.links[0] as Card;
								const use = await player
									.chooseUseTarget({ card, forced: false, prompt: "潜击：使用【" + get.translation(get.name(card)) + "】" })
									.forResult();
								if (use?.bool) used = card;
							}
						}
						// 然后若存在同名，可把这些同名牌视为一张使用
						const rest = qianjiCards(trigger).filter(card => card !== used);
						const groups = qianjiDuplicates(rest);
						if (!groups.length) return;
						const reps = groups.map(([, list]) => list[0]);
						const result = await player
							.chooseButton({
								createDialog: ["潜击：选择一种牌名（将同名牌视为一张使用）", reps],
								selectButton: 1,
								ai: () => 1,
							})
							.forResult();
						if (!result?.bool || !result.links?.length) return;
						const name = get.name(result.links[0]);
						const group = groups.find(([groupName]) => groupName === name)?.[1];
						if (!group || group.length < 2) return;
						const data: any = { name, isCard: true };
						if (get.nature(group[0])) data.nature = get.nature(group[0]);
						const vcard = get.autoViewAs(data, group.slice());
						await player
							.chooseUseTarget({
								card: vcard,
								cards: group.slice(),
								forced: false,
								prompt: "潜击：将" + get.cnNumber(group.length) + "张同名牌视为一张使用",
							})
							.forResult();
					} finally {
						delete player.storage[QIANJI_IGNORE];
					}
				},
			},
			line: ["匕首只是让你看着它。真正要来的东西，不在你眼睛看的方向。","我并非刺客。但如果你一定要站在路上——我会让你来不及转身。"],
		},
	},
});

// 砥石配音
line({
	dishimrfz_lvzemrfz1: "巴别塔的建立需要有人作为基石待在暗处。",
	dishimrfz_lvzemrfz2: "罗德岛不需要每个人都站在光里。总得有人待在暗处。",
});