import { whichWayFile } from "../../file.js";
import { whichWayUtil } from "../../utill.js";
import { card, cardSkill, cardTranslate, character, characterIntro, characterTitle, skill, translate } from "../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

const NAME = "gelanimrfz";

/**
 * 特殊的马
 */
const ORGS = ["Copenhagen", "Eclipse", "BlackBess"];
const HORSES = ORGS.map(i => `${i}_${NAME}`);
const HORSES_SKILLS = ORGS.map(i => `${i}_skill_${NAME}`);
type horseInfo = ["club" | "spade" | "diamond" | "heart", number];
const HORSES_INFOS: Record<string, horseInfo> = {
	[HORSES[0]]: ["heart", 6],
	[HORSES[1]]: ["spade", 13],
	[HORSES[2]]: ["heart", 8],
};
// const HORSES_INFOS:Array<["club"|"spade"|"diamond"|"heart",number]> = [
//     //"Copenhagen"
//     ["heart",6],
//     //"Eclipse"
//     ["spade",13],
//     //"BlackBess"
//     ["heart",8]
// ]

character(NAME, {
	sex: "female",
	group: "weimrfz",
	hp: 4,
	pack: "epicSJZX",
	skills: ["qishumrfz", "feijumrfz"],
});

characterTitle(NAME, whichWayUtil.colorize("#r永不后退#"));

characterIntro(NAME, "格拉尼，维多利亚骑警，在突袭战，机动作战，纵深作战等高速运动战领域表现出了较高的天赋。<br>现以合约干员身份为罗德岛各行动组提供支援，并主动承担罗德岛及周边地区的义务巡逻与防卫协助等工作。");

translate({
	[NAME]: "格拉尼",

	qishumrfz: "骑术",
	qishumrfz_info: "①当你使用的【杀】造成伤害后，若你的进攻马栏不为空，你可以将一张手牌当【杀】，对一名因此【杀】受到伤害的角色的上家使用（目标须合法）。<br>②锁定技，若你的防御马栏不为空，其他角色只能使用无点数或点数大于你防御马栏中所有牌点数之和的【杀】指定你为目标。",
	feijumrfz: "飞驹",
	feijumrfz_info: "锁定技，游戏开始时，你从两张特殊的防御马和进攻马中各选择一张置入你的装备区。",
});

skill({
	qishumrfz: {
		audio: ["作战中1", "作战中2", "作战中3"],
	},
	feijumrfz: {
		audio: ["作战中4", "完成高难行动"],
		derivation: HORSES_SKILLS,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			// const cards = HORSES.map(i=>game.createCard(i,lib.suit.randomGet(),[1,3,5,8,9,13].randomGet()));
			const cards: Card[] = [];
			for (let h of HORSES) {
				let card = game.createCard(h, ...HORSES_INFOS[h]);
				cards.push(card);
			}

			const result = await player
				.chooseFakeCard({
                    tagName:"飞驹",
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

//哥本哈根 威灵顿公爵战马
card(HORSES[0], {
	image: whichWayFile.compilePath(`img:card/${HORSES[0]}.png`),
	type: "equip",
	subtype: "equip3",
	skills: [HORSES_SKILLS[0]],
	distance: { globalTo: 1 },
	source: [NAME],
	ai: {
		equipValue: 10,
	},
});

cardTranslate({
	[HORSES[0]]: "哥本哈根",
	[`${HORSES[0]}_info`]: "锁定技，每回合你第二次受到伤害后，你恢复一点体力。",
	[`${HORSES[0]}_append`]: `<span class="text" style="font-family: yuanli">啊，滑铁卢的炮火如雷霆，你却驮着威灵顿如驮着不列颠的命运，四蹄不乱，死后犹享军礼——你真是马中的将军。</span>`,
	[HORSES_SKILLS[0]]: "哥本哈根",
	[`${HORSES_SKILLS[0]}_info`]: "锁定技，每回合你第二次受到伤害后，你恢复一点体力。",
});

cardSkill(HORSES_SKILLS[0], {
	audio: false,
	equipSkill: true,
	forced: true,
	trigger: {
		player: "damageEnd",
	},
	filter(event, player, name, target) {
		return player.getHistory("damage").length === 2;
	},
	async content(event, trigger, player) {
		if (player.hp < 2) {
			player.chat("啊，滑铁卢的炮火如雷霆，你却驮着威灵顿如驮着不列颠的命运，四蹄不乱，死后犹享军礼——你真是马中的将军。");
		}
		player.recover();
	},
});

//日蚀 赛马界的恺撒
card(HORSES[1], {
	image: whichWayFile.compilePath(`img:card/${HORSES[1]}.png`),
	type: "equip",
	subtype: "equip4",
	distance: { globalFrom: -1 },
	skills: [HORSES_SKILLS[1]],
	source: [NAME],
	ai: {
		equipValue: 3,
	},
});

cardTranslate({
	[HORSES[1]]: "日蚀",
	[`${HORSES[1]}_info`]: "锁定技，你的额定摸牌数、出牌阶段【杀】的使用次数和手牌上限+2;当你受到【杀】的伤害后，你废除进攻马栏。",
	[`${HORSES[1]}_append`]: `<span class="text" style="font-family: yuanli">你奔驰时，群马只望见你如落日的背影，而你身后万马血脉皆成你的回声——啊，日蚀，你未冕之王，赛马史上的凯撒。</span>`,
	[HORSES_SKILLS[1]]: "日蚀",
	[`${HORSES_SKILLS[1]}_info`]: "锁定技，你的额定摸牌数、出牌阶段【杀】的使用次数和手牌上限+2;当你受到【杀】的伤害后，你废除进攻马栏。",
});

cardSkill(HORSES_SKILLS[1], {
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
	audio: false,
	equipSkill: true,
	forced: true,
	trigger: {
		player: "phaseDrawBegin2",
	},
	filter(event, player, name, target) {
		return !event.numFixed;
	},
	async content(event, trigger, player) {
		trigger.num += 2;
	},
	group: [`${HORSES_SKILLS[1]}_assassinated`],
	subSkill: {
		assassinated: {
			audio: false,
			charlotte: true,
			forced: true,
			trigger: {
				player: "damageEnd",
			},
			filter(event, player, name, target) {
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
});

//黑贝丝 日行千里的侠盗
card(HORSES[2], {
	image: whichWayFile.compilePath(`img:card/${HORSES[2]}.png`),
	type: "equip",
	subtype: "equip4",
	distance: { globalFrom: -1 },
	skills: [HORSES_SKILLS[2]],
	source: [NAME],
	ai: {
		equipValue: 3,
	},
});

cardTranslate({
	[HORSES[2]]: "黑贝丝",
	[`${HORSES[2]}_info`]: "你的第质数个判定阶段开始时，你可以跳过之并将判定区所有牌当作一张无距离限制的【杀】使用（判定区无牌则改为视为使用）。",
	[`${HORSES[2]}_append`]: `<span class="text" style="font-family: yuanli">黑夜为你备鞍，星辰为你执鞭，你载着迪克·特平从伦敦飞驰至约克，把追捕者的火把留给黎明去熄灭。</span>`,
	[HORSES_SKILLS[2]]: "黑贝丝",
	[`${HORSES_SKILLS[2]}_info`]: "你的第质数个判定阶段开始时，你可以跳过之并将判定区所有牌当作一张无距离限制的【杀】使用（判定区无牌则改为视为使用）。",
});

cardSkill(HORSES_SKILLS[2], {
	audio: false,
	equipSkill: true,
	init(player, skill) {
		player.storage[skill] = 0;
		player.addTip(HORSES_SKILLS[2], `下次触发：2`);
	},
	onremove(player, type) {
		delete player.storage[HORSES_SKILLS[2]];
		player.removeTip(HORSES_SKILLS[2]);
	},
	trigger: {
		player: "phaseJudgeBefore",
	},
	filter(event, player, name, target) {
		const num = game.getAllGlobalHistory("everything", evt => {
			return evt.player === player && evt.name === "phaseJudge";
		}).length;
		return typeof num === "number" && isPrime(num);
	},
	async cost(event, trigger, player) {
		//同步一下
		player.storage[HORSES_SKILLS[2]] += 1;
		console.log(player.storage[HORSES_SKILLS[2]], HORSES_SKILLS[2]);

		const save = player.storage[HORSES_SKILLS[2]] as number;
		//500以内的质数
		const prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503];
		if (save > prime.length) {
			player.chat("onp，大道都磨灭了");
			player.addTip(HORSES_SKILLS[2], "罢工了喵");
		} else {
			player.addTip(HORSES_SKILLS[2], `下次触发：${prime[save]}`);
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
