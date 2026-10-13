import { character, characterIntro, characterReplace, characterTitle, skill, translate } from "../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

character("spkaierximrfz", {
	sex: "female",
	group: "luomrfz",
	hp: 3,
	skills: ["pianzhenmrfz","xingmiemrfz"],
	pack: "legendSJZX",
	arkuid: "char_1052_kalts2",
});

characterIntro("spkaierximrfz", "凯尔希，罗德岛制药公司的创立者之一，同时担任医疗部负责人。曾多次主导罗德岛的大型战略行动，并负责罗德岛的对外沟通工作，为罗德岛的运营发展以及矿石病研究做出了重要贡献。现主要以医疗专家的身份参与罗德岛的矿石病药物研发项目。");

characterTitle("spkaierximrfz", "<font color = #1876d4>遗尘守望</font>");

characterReplace("spkaierximrfz", ["spkaierximrfz", "kaierximrfz"]);

translate({
	spkaierximrfz: "守望者凯尔希",
	spkaierximrfz_prefix: "守望者",

	pianzhenmrfz: "偏振",
	pianzhenmrfz_info: "当你使用【杀】后，你可以弃置两张手牌或失去一点体力，令此牌不计入使用次数，然后若你手牌中仅剩X种花色的牌，你摸四张牌。（X=你当前体力值）",

	xingmiemrfz: "星灭",
	xingmiemrfz_info: "锁定技，每轮开始时，你令下列其中一项的数值-1，然后其余项数值+1：<br>1.额定摸牌数;<br>2.出牌阶段【杀】的使用次数;<br>3.手牌上限。",
});

skill({
	pianzhenmrfz: {
		audio: ["完成高难行动", "戳一下"],
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player, name, target) {
			return event.card && get.name(event.card) === "sha";
		},
		async cost(event, trigger, player) {
			const prompt = get.prompt("pianzhenmrfz");
			if (player.countCards("h") < 2) {
				const result = await player
					.chooseBool({
						prompt,
						prompt2: `是否要失去一点体力令此牌不计入使用次数，然后若你手牌中仅剩${player.hp}(<font color = red>该数值为当前体力值</font>)种花色的牌，你将手牌补至手牌上限。`,
						ai(event, player) {
							if (player.hp < 2) return false;
							return player.getCards("h").map(i => get.suit(i)).length === player.hp - 1;
						},
					})
					.forResult();
				event.result = result;
			} else {
				const { index } = await player
					.chooseControl({
						prompt: `【偏振】:你可以弃置两张手牌或失去一点体力，令此牌不计入使用次数，然后若你手牌中仅剩${player.hp}(<font color = red>该数值为当前体力值</font>)种花色的牌，你将手牌补至手牌上限。`,
						controls: ["选项一", "选项二", "cancel2"],
						choiceList: ["弃置两张<font color = red>手牌</font>", "失去一点体力"],
						ai(event, player) {
							const arr = Array.from(new Set(player.getCards("h").map(i => get.suit(i)))) as string[];
							const num = new Set(player.getCards("h").map(i => get.suit(i))).size;
							if (player.hp > 1 && num === player.hp - 1) {
								return 0;
							} else {
								const result = findAllRemovals(arr, player.hp);
								if (result && result.length > 1) {
									return 1;
								}
							}
							return 2;
						},
					})
					.forResult();
				if (index === 2) {
					return;
				} else if (index === 1) {
					event.result = {
						bool: true,
					};
				} else if (index === 0) {
					const result = await player
						.chooseCard({
							prompt: `【偏振】:请选择弃置的手牌`,
							selectCard: 2,
							ai(card) {
								const player = get.player();
								const arr = Array.from(new Set(player.getCards("h").map(i => get.suit(i)))) as string[];
								const suits = findAllRemovals(arr, player.hp);
								if (suits) {
									const cards = ui.selected.cards;
									if (cards.length < 1) {
										return get.suit(card) === suits[0][0] ? 114514 - get.value(card) : -1;
									} else {
										return get.suit(card) === suits[0][1] ? 114514 - get.value(card) : -1;
									}
								}
								return Math.random();
							},
							forced: true,
						})
						.forResult();
					event.result = result;
				}
			}
		},
		async content(event, trigger, player) {
			const { cards } = event;
			if (cards && cards.length > 0) {
				await player.discard({ cards });
			} else {
				await player.loseHp();
			}

			const num = new Set(player.getCards("h").map(i => get.suit(i))).size;
			if (num === player.hp) {
				player.draw(4);
			}

			if (player.getStat("card")?.sha) {
				player.getStat("card").sha--;
			}
		},
	},
	xingmiemrfz: {
		audio: ["闲置", "观看作战记录"],
		forced: true,
		trigger: {
			global: "roundStart",
		},
		init(player, skill) {
			player.storage[skill] = {
				draw: 0,
				sha: 0,
				limit: 0,
			};
		},
		onremove: true,
        mark:true,
        intro:{
            content(storage, player, skill) {
                return `·额定摸牌数${autoTransfer("draw")}<br>·出牌阶段【杀】的使用次数${autoTransfer("sha")}<br>·手牌上限${autoTransfer("limit")}`;

                function autoTransfer(key:string):string{
                    const num = storage[key]
                    return `${num >= 0 ? "+" : "-" }${Math.abs(num)}`;
                }
            },
        },
		async content(event, trigger, player) {
			const result = await player
				.chooseControl({
					prompt: "【星灭】:令其中一项的数值-1，然后其余项数值+1",
					controls: ["选项一", "选项二", "选项三"],
					//<br>1.额定摸牌数;<br>2.出牌阶段【杀】的使用次数;<br>3.手牌上限。",
					choiceList: ["额定摸牌数", "出牌阶段【杀】的使用次数", "手牌上限"],
					ai(event, player) {
						//开摆！
						return ["选项一", "选项二", "选项三"].randomGet();
					},
				})
				.forResult();
			if (typeof result.index !== "number") return;
			act(result.index);

			function act(index: number) {
				const type = ["draw", "sha", "limit"];
                player.storage.xingmiemrfz[type[index]] --;
                for(let i=0;i<type.length;i++){
                    if(i===index) continue;
                    player.storage.xingmiemrfz[type[i]] ++;
                }
			}
		},
        group:["xingmiemrfz_draw"],
        subSkill:{
            draw:{
                audio:"xingmiemrfz",
                charlotte:true,
                forced:true,
                trigger:{
                    player:"phaseDrawBegin2"
                },
                filter(event, player, name, target) {
                    return !event.numFixed;
                },
                async content(event,trigger,player){
                    if(player.getStorage("xingmiemrfz")?.draw){
                        trigger.num += player.getStorage("xingmiemrfz").draw;
                    }
                },
            },
        },
        mod:{
            cardUsable(card, player, num) {
                if(get.name(card) === "sha" && player.getStorage("xingmiemrfz")?.sha){
                    return num + player.getStorage("xingmiemrfz").sha;
                }
            },
            maxHandcard(player, num) {
                return num + (player.getStorage("xingmiemrfz")?.limit || 0);
            },
        },
	},
});

/**
 * 移除方案：一个二元组，表示需要移除的两个元素值
 */
type RemovalPair = [string, string];

/**
 * 从数组中移除恰好2个元素，使得剩余数组中不同元素的数量恰好为 N
 * 找出所有满足条件的移除方案（按元素值去重）
 *
 * @param arr - 输入数组（至少2个元素，由 string 组成）
 * @param N - 目标不同元素数量
 * @returns 满足条件的移除方案列表，找不到则返回 false
 */
function findAllRemovals(arr: string[], N: number): false | RemovalPair[] {
	if (arr.length < 2) return false;

	// 1. 统计每个元素的出现频率
	const freq: Record<string, number> = {};
	for (const item of arr) {
		freq[item] = (freq[item] || 0) + 1;
	}

	const D = Object.keys(freq).length;
	const toEliminate = D - N; // 需要完全消除的不同元素个数

	// 移除2个元素最多消除2个不同元素，也不能增加不同元素数量
	if (toEliminate < 0 || toEliminate > 2) return false;

	const results: RemovalPair[] = [];
	const seen = new Set<string>(); // 用于值对去重

	// 2. 按频率分类
	const count1: string[] = []; // 出现 1 次的元素
	const count2: string[] = []; // 出现恰好 2 次的元素
	const countGte2: string[] = []; // 出现 >= 2 次的元素
	const countGte3: string[] = []; // 出现 >= 3 次的元素

	for (const key of Object.keys(freq)) {
		const f = freq[key];
		if (f === 1) count1.push(key);
		if (f === 2) count2.push(key);
		if (f >= 2) countGte2.push(key);
		if (f >= 3) countGte3.push(key);
	}

	// 3. 添加方案（去重 + 规范化顺序）
	function addPair(a: string, b: string): void {
		const pair: RemovalPair = a <= b ? [a, b] : [b, a];
		const key = `${pair[0]}|${pair[1]}`;
		if (!seen.has(key)) {
			seen.add(key);
			results.push(pair);
		}
	}

	// 4. 分情况枚举所有合法方案
	if (toEliminate === 0) {
		// 移除两个相同元素，该元素出现 >= 3 次（移除后仍存在）
		for (const v of countGte3) {
			addPair(v, v);
		}
		// 移除两个不同元素，各自出现 >= 2 次
		for (let i = 0; i < countGte2.length; i++) {
			for (let j = i + 1; j < countGte2.length; j++) {
				addPair(countGte2[i], countGte2[j]);
			}
		}
	} else if (toEliminate === 1) {
		// 移除两个相同元素，该元素恰好出现 2 次（移除后消失）
		for (const v of count2) {
			addPair(v, v);
		}
		// 移除两个不同元素，一个出现 1 次（消失），一个出现 >= 2 次（仍存在）
		for (const v1 of count1) {
			for (const v2 of countGte2) {
				addPair(v1, v2);
			}
		}
	} else if (toEliminate === 2) {
		// 移除两个不同元素，各自恰好出现 1 次（都消失）
		for (let i = 0; i < count1.length; i++) {
			for (let j = i + 1; j < count1.length; j++) {
				addPair(count1[i], count1[j]);
			}
		}
	}

	// 5. 按字典序排序
	results.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));

	return results.length > 0 ? results : false;
}

/**
 * 根据移除方案，从数组中移除对应元素（按值移除，每种值只移除方案中指定的数量）
 */
function applyRemoval(arr: string[], pair: RemovalPair): string[] {
	const result = [...arr];
	const [a, b] = pair;

	if (a === b) {
		// 移除两个相同值
		let count = 0;
		for (let i = result.length - 1; i >= 0 && count < 2; i--) {
			if (result[i] === a) {
				result.splice(i, 1);
				count++;
			}
		}
	} else {
		// 移除两个不同值
		for (let i = result.length - 1; i >= 0; i--) {
			if (result[i] === a || result[i] === b) {
				result.splice(i, 1);
				if (result.length === arr.length - 2) break;
			}
		}
	}
	return result;
}
