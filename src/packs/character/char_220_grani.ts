import { whichWayFile } from "../../file.js";
import { whichWayUtil } from "../../utill.js";
import { card, cardSkill, cardTranslate, character, characterIntro, characterTitle, skill, translate } from "../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

const NAME = "char_220_grani";

/**
 * 特殊的马：新增一匹马只需要往 HORSE_DEFS 里加一项，注册与「飞驹」选马列表都由它推导。
 *
 * slot：3=防御马栏，4=进攻马栏，subtype 与 distance 由此推导，无需再各写一遍。
 * 卡牌 id 为 `{马id}_{NAME}`、技能 id 为 `{马id}_skill_{NAME}`，改动干员id 会让存档和翻译失效。
 */
type HorseSuit = "club" | "spade" | "diamond" | "heart";

interface HorseDef {
	/** id 前缀，同时作为卡牌/技能命名空间 */
	id: string;
	name: string;
	suit: HorseSuit;
	number: number;
	slot: 3 | 4;
	info: string;
	append: string;
	equipValue: number;
	/** skillId 为配套技能的完整 id，供 group / storage / addTip 使用 */
	skill: (skillId: string) => ExtendedSkill;
}

const HORSE_DEFS: HorseDef[] = [
	{
		//哥本哈根 威灵顿公爵战马
		id: "Copenhagen",
		name: "哥本哈根",
		suit: "heart",
		number: 6,
		slot: 3,
		info: "锁定技，每回合你第二次受到伤害后，你恢复一点体力。",
		append: `<span class="text" style="font-family: yuanli">啊，滑铁卢的炮火如雷霆，你却驮着威灵顿如驮着不列颠的命运，四蹄不乱，死后犹享军礼——你真是马中的将军。</span>`,
		equipValue: 10,
		skill: () => ({
			forced: true,
			trigger: {
				player: "damageEnd",
			},
			filter(event, player) {
				return player.getHistory("damage").length === 2;
			},
			async content(event, trigger, player) {
				if (player.hp < 2) {
					player.chat("啊，滑铁卢的炮火如雷霆，你却驮着威灵顿如驮着不列颠的命运，四蹄不乱，死后犹享军礼——你真是马中的将军。");
				}
				player.recover();
			},
		}),
	},
	{
		//日蚀 赛马界的恺撒
		id: "Eclipse",
		name: "日蚀",
		suit: "spade",
		number: 13,
		slot: 4,
		info: "锁定技，你的额定摸牌数、出牌阶段【杀】的使用次数和手牌上限+2;当你受到【杀】的伤害后，你废除进攻马栏。",
		append: `<span class="text" style="font-family: yuanli">你奔驰时，群马只望见你如落日的背影，而你身后万马血脉皆成你的回声——啊，日蚀，你未冕之王，赛马史上的凯撒。</span>`,
		equipValue: 3,
		skill: skillId => ({
			mod: {
				maxHandcard(player, num) {
					return (num += 2);
				},
				cardUsable(card, player, num) {
					if (get.name(card) === "sha") {
						return (num += 2);
					}
				},
			},
			forced: true,
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter(event) {
				return !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num += 2;
			},
			group: [`${skillId}_assassinated`],
			subSkill: {
				assassinated: {
					audio: false,
					charlotte: true,
					forced: true,
					trigger: {
						player: "damageEnd",
					},
					filter(event, player) {
						return event.card && get.name(event.card) === "sha";
					},
					async content(event, trigger, player) {
						if (player.hp === 1) {
							player.chat("现在不就是3月15日吗?");
						}
						player.disableEquip({ slots: ["equip4"] });
					},
				},
			},
		}),
	},
	{
		//黑贝丝 日行千里的侠盗
		id: "BlackBess",
		name: "黑贝丝",
		suit: "heart",
		number: 8,
		slot: 4,
		info: "你的第质数个判定阶段开始时，你可以跳过之并将判定区所有牌当作一张无距离限制的【杀】使用（判定区无牌则改为视为使用）。",
		append: `<span class="text" style="font-family: yuanli">黑夜为你备鞍，星辰为你执鞭，你载着迪克·特平从伦敦飞驰至约克，把追捕者的火把留给黎明去熄灭。</span>`,
		equipValue: 3,
		skill: skillId => ({
			init(player) {
				player.storage[skillId] = 0;
				player.addTip(skillId, `下次触发：2`);
			},
			onremove(player) {
				delete player.storage[skillId];
				player.removeTip(skillId);
			},
			trigger: {
				player: "phaseJudgeBefore",
			},
			filter(event, player) {
				const num = game.getAllGlobalHistory("everything", evt => {
					return evt.player === player && evt.name === "phaseJudge";
				}).length;
				return isPrime(num);
			},
			async cost(event, trigger, player) {
				player.storage[skillId] = ((player.storage[skillId] as number) ?? 0) + 1;

				const save = player.storage[skillId] as number;
				//500以内的质数
				const prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503];
				if (save > prime.length) {
					player.chat("onp，大道都磨灭了");
					player.addTip(skillId, "罢工了喵");
				} else {
					player.addTip(skillId, `下次触发：${prime[save]}`);
				}

				//正式内容
				event.result = await player
					.chooseBool({
						prompt: "是否发动【黑贝丝】",
						prompt2: player.getCards("j").length > 0 ? `你可以跳过判定阶段并将判定区的牌（${get.translation(player.getCards("j"))}）当作一张无距离限制的【杀】使用` : "你可以跳过判定阶段并视为使用一张无距离限制的【杀】",
						ai(event, player) {
							return game.hasPlayer(char => {
								return player.canUse("sha", char, false) && get.effect(char, "sha", player, player) > 0;
							});
						},
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const card = get.autoViewAs({
					name: "sha",
					cards: player.getCards("j"),
				});
				await player.chooseUseTarget({
					card,
					cards: player.getCards("j"),
					forced: true,
					nodistance: true,
				});
				trigger.cancel();
			},
		}),
	},
	{
		//达利阿拉伯
		id: "DarleyArabian",
		name: "达利阿拉伯",
		suit: "club",
		number: 5,
		slot: 3,
		info: "锁定技，当你失去最后一张手牌后，你于本回合结束后摸三张牌（可以叠加）。",
		append: `<span class="text" style="font-family: yuanli">啊，达利阿拉伯，你远自沙漠而来，却让飞行童工展翅，令现代赛马的血脉如尼罗河般绵延不绝。</span>`,
		equipValue: 6,
		skill: (id) => ({
			forced: true,
			trigger: {
				player: "loseAfter",
				global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			onremove:true,
			init(player, skill) {
				player.storage[id] = 0;
			},
			intro:{
				content(storage, player, skill) {
					return `·任意回合结束后，你摸${get.cnNumber(storage)}张牌`
				},
			},
			filter(event, player) {
				if (player.hasCards("h")) {
					return false;
				}
				const evt = event.getl(player);
				return evt && evt.player === player && evt.hs && evt.hs.length > 0;
			},
			async content(event, trigger, player) {
				if(typeof player.storage[id] !== "number") player.storage[id] = 0;
				player.storage[id] += 3;
				player.markSkill(id);
				player.when({global:"phaseEnd"})
					.then(async (event,trigger,player)=>{
						await player.draw(player.storage[id]);
						player.unmarkSkill(id);
						player.storage[id] = 0;
					})
			},
			ai: {
				threaten: 0.8,
				effect: {
					player(card, player, target) {
						if (player.countCards("h") === 1) {
							return [1, 0.8];
						}
					},
					target(card, player, target) {
						if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
							return 0.5;
						}
					},
				},
				noh: true,
				freeSha: true,
				freeShan: true,
				skillTagFilter(player, tag) {
					if (player.countCards("h") !== 1) {
						return false;
					}
				},
			},
		}),
	},
];

const HORSE_SKILL_IDS = HORSE_DEFS.map(h => `${h.id}_skill_${NAME}`);

function registerHorse(def: HorseDef) {
	const cardId = `${def.id}_${NAME}`;
	const skillId = `${def.id}_skill_${NAME}`;

	card(cardId, {
		image: whichWayFile.compilePath(`img:card/${cardId}.png`),
		type: "equip",
		subtype: `equip${def.slot}`,
		distance: def.slot === 3 ? { globalTo: 1 } : { globalFrom: -1 },
		skills: [skillId],
		source: [NAME],
		ai: {
			equipValue: def.equipValue,
		},
	});

	cardTranslate({
		[cardId]: def.name,
		[`${cardId}_info`]: def.info,
		[`${cardId}_append`]: def.append,
		[skillId]: def.name,
		[`${skillId}_info`]: def.info,
	});

	cardSkill(skillId, {
		audio: false,
		equipSkill: true,
		...def.skill(skillId),
	});
}

character(NAME, {
	sex: "female",
	group: "weimrfz",
	hp: 4,
	pack: "epicSJZX",
	skills: ["qishumrfz", "feijumrfz"],
	llm:"Qwen-3.8-Flash"
});

characterTitle(NAME, whichWayUtil.colorize("#r永不后退#"));

characterIntro(NAME, "格拉尼，维多利亚骑警，在突袭战，机动作战，纵深作战等高速运动战领域表现出了较高的天赋。<br>现以合约干员身份为罗德岛各行动组提供支援，并主动承担罗德岛及周边地区的义务巡逻与防卫协助等工作。");

translate({
	[NAME]: "格拉尼",

	qishumrfz: "骑术",
	qishumrfz_info: "①当你使用的【杀】造成伤害后，若你的进攻马栏不为空，你可以将一张手牌当【杀】对一名因此【杀】受到伤害的角色的上家或下家使用（目标须合法）。<br>②锁定技，若你的防御马栏不为空，其他角色只能使用无点数或点数大于你防御马栏中所有牌点数之和的【杀】指定你为目标。",
	feijumrfz: "飞驹",
	feijumrfz_info: "锁定技，游戏开始时，你从两张特殊的防御马和进攻马中各选择一张置入你的装备区;当你手牌区有至少两张牌时，你装备区的防御马和进攻马不能被弃置。",
});

skill({
	qishumrfz: {
		mod: {
			targetEnabled(card: Card | VCard, player, target) {
				if (player === target || get.name(card) !== "sha" || target.hasEmptySlot(3)) {
					return;
				}
				const sum = target
					.getEquips(3)
					.map(i => get.number(i))
					.reduce((acc, cur) => normalizationNumber(acc) + normalizationNumber(cur), 0) as number;
				const number = get.number(card);
				if (typeof number === "number" && number <= sum) {
					return false;
				}
			},
		},
		audio: ["作战中1", "作战中2", "作战中3"],
		trigger: {
			source: "damageSource",
		},
		filter(event, player, name, target) {
			return event.card && get.name(event.card) === "sha" && !player.hasEmptySlot(4) && getQishuTargets(player, [event.player]).length > 0 && player.countCards("h") > 0;
		},
		ai() {
			const player = get.player();
			return getQishuTargets(player, [get.event().player]).reduce((sum, target) => sum + get.effect(target, "sha", player, player), 0);
		},
		prompt2(event, player) {
			return `你可以将一张手牌当【杀】对${get.translation(getQishuTargets(player, [event.player]))}使用`;
		},
		async content(event, trigger, player) {
			const targets = getQishuTargets(player, [trigger.player]);

			const result = await player
				.chooseCardTarget({
					filterCard(card, player, event) {
						return true;
					},
					filterTarget(card, player, target) {
						return targets.includes(target);
					},
					prompt: `【骑术】：请将一张手牌当【杀】对${get.translation(targets)}使用。`,
					ai1(card) {
						return -get.value(card);
					},
					ai2(target) {
						return get.effect(target, "sha", get.player(), get.player());
					},
				})
				.forResult();
			if (result.bool && result.cards?.length && result.targets?.length) {
				await player.useCard({
					card:get.autoViewAs({ name: "sha", isCard: true }),
					cards:result.cards,
					targets:result.targets,
					addCount:false
				});
			}
		},
	},
	feijumrfz: {
		mod:{
			canBeDiscarded(card, player, target) {
            if (get.position(card) == "e" && get.subtypes(card).some(subtype => ["equip4", "equip3"].includes(subtype)) && player != target && player.countCards("h")>1) {
                return false;
            }
        },
		},
		audio: ["作战中4", "完成高难行动"],
		derivation: HORSE_SKILL_IDS,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const cards: Card[] = HORSE_DEFS.map(def => game.createCard(`${def.id}_${NAME}`, def.suit, def.number));

			const result = await player
				.chooseFakeCard({
					tagName: "飞驹",
					cards,
					selectCard() {
						return [2, 2];
					},
					filterCard(card, player, event) {
						let uis = ui.selected.cards;
						if (uis.length > 0) return get.subtype(card) !== get.subtype(uis[0]);
						return true;
					},
					ai(card) {
						return get.value(card);
					},
					complexSelect: true,
					complexCard: true,
				})
				.forResult();

			if (result.links) {
				result.links.forEach(e => player.equip(e));
			}
		},
	},
});

/**
 * 判断一个数是否为质数。
 *
 * 质数（素数）是指大于 1 的自然数中，除了 1 和它本身以外不再有其他因数的数。
 * 对于非整数、小于等于 1 的数、NaN、Infinity 等情况，均返回 false。
 *
 * @param {number} n - 需要判断的数值。
 * @returns {boolean} 如果 n 是质数则返回 true，否则返回 false。
 */
function isPrime(n: number): boolean {
	if (typeof n !== "number" || !Number.isInteger(n) || n <= 1) {
		return false;
	}
	if (n <= 3) {
		return true;
	}
	if (n % 2 === 0 || n % 3 === 0) {
		return false;
	}
	// 从 5 开始，以 6 为步长检查 6k ± 1 形式的数
	const limit = Math.sqrt(n);
	for (let i = 5; i <= limit; i += 6) {
		if (n % i === 0 || n % (i + 2) === 0) {
			return false;
		}
	}

	return true;
}

function normalizationNumber(input: any): number {
	if (typeof input === "number") return input;
	return 0;
}


function getQishuTargets(player: Player, damagedList: Player[]): Player[] {
	const list: Player[] = [];
	for (const char of damagedList) {
		const previous = char.getPrevious();
		if (previous && !list.includes(previous) && player.canUse("sha", previous)) {
			list.push(previous);
		}
		const next = char.getNext();
		if (next && !list.includes(next) && player.canUse("sha", next)) {
			list.push(next);
		}
	}
	return list;
}

for (const def of HORSE_DEFS) {
	registerHorse(def);
}
