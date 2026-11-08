import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, line } from "../hooks.ts";

/**
 * 安多思 3/3
求索：出牌阶段限一次，或当你受到伤害时，你可以弃置任意张点数之和不大于13的牌，然后随机获得牌堆或弃牌堆中等量张点数为X的牌(X为你弃置的牌的点数之和)。
赐光：当你需要使用或打出【闪】时，你可以摸一张牌并与目标角色拼点，若你赢，你视为使用或打出一张【闪】。
 */

const resigter = (name = "anduoenmrfz") => {
	character(name, {
		hp: 3,
		group: "lamrfz",
		pack: "plotSJZX",
		sex: "male",
		skills: ["qiusuomrfz", "ciguangmrfz"],
		designer: ["培嵩"],
		llm:"DeepSeek-4.1-Flash"
	});

	/* --------------------------------- 求索 ---------------------------------- */

	/** 求索：当前已选牌的点数之和 */
	//@ts-ignore
	const qiusuoSum = () => (ui.selected.cards ?? []).reduce((sum, card) => sum + (get.number(card) ?? 0), 0);

	/**
	 * 求索：本次可弃置的牌（已选牌与此牌的点数之后不能大于13）
	 * @param { Card } card
	 * @param { Player } player
	 */
	const qiusuoFilter = (card, player) => {
		const num = get.number(card);
		return typeof num == "number" && num > 0 && qiusuoSum() + num <= 13 && lib.filter.cardDiscardable(card, player);
	};

	/**
	 * 求索的结算。
	 * 先把弃置的牌置于处理区，再从牌堆（不足则弃牌堆）随机获得等量张点数为X的牌，最后把这些牌置入弃牌堆，
	 * 这样可以保证求索不会把本次弃置的牌再拿回来。
	 * @param { Player } player
	 * @param { Card[] } cards
	 */
	const qiusuo = async (player, cards) => {
		const need = cards.length;
		const num = cards.reduce((sum, card) => sum + (get.number(card) ?? 0), 0);
		await player.lose({ cards, position: ui.ordering, visible: true });
		/** 找出某个牌堆里所有点数为X的牌 */
		const match = pile => Array.from(pile.childNodes).filter(card => get.number(card) == num);
		const gains = match(ui.cardPile).randomGets(need);
		if (gains.length < need) {
			gains.addArray(match(ui.discardPile).randomGets(need - gains.length));
		}
		if (gains.length < need) {
			player.chat(`点数为${num}的牌不够${get.cnNumber(need)}张，我只能获得${get.cnNumber(gains.length)}张了`);
		}
		if (gains.length) {
			await player.gain({ cards: gains, animate: "gain2" });
		}
		await game.cardsDiscard(cards);
	};

	/* --------------------------------- 赐光 ---------------------------------- */

	/**
	 * 赐光：正在被响应的牌的使用者，若其已离场则无法发动赐光
	 * @param { GameEvent } event chooseToRespond 或 chooseToUse 事件
	 * @returns { Player | null }
	 */
	const ciguangTarget = event => {
		const target = event.getParent("useCard")?.player;
		if (!target || typeof target.isIn != "function" || target == event.player || !target.isIn()) {
			return null;
		}
		return target;
	};

	/** 求索在受到伤害时的发动时机（伤害结算前） */
	const qiusuoCost = async (event, trigger, player) => {
		const result = await player
			.chooseCard({
				prompt: "求索：你可以弃置任意张点数之和不大于13的牌",
				prompt2: "若如此做，你随机获得牌堆（不足则弃牌堆）中等量张点数为X的牌（X为你弃置的牌的点数之和）",
				position: "he",
				complexCard: true,
				selectCard: [1, Infinity],
				filterCard: qiusuoFilter,
				ai(card) {
					return 6 - get.value(card);
				},
			})
			.forResult();
		if (result.bool) {
			event.result = { bool: true, cards: result.cards };
		}
	};
	const qiusuoContent = async (event, trigger, player) => {
		await qiusuo(player, event.cards);
	};

	skill({
		qiusuomrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			position: "he",
			complexCard: true,
			selectCard: [1, Infinity],
			filter(event, player) {
				return player.hasDiscardableCards(player, "he");
			},
			filterCard: qiusuoFilter,
			check(card) {
				return 6 - get.value(card);
			},
			// 弃置的牌由求索自己处理（先置于处理区，结算完再进弃牌堆）
			discard: false,
			lose: false,
			content: qiusuoContent,
			group: ["qiusuomrfz_damage"],
			subSkill: {
				damage: {
					audio: "qiusuomrfz",
					trigger: { player: "damageBegin3" },
					filter(event, player) {
						return event.num > 0 && player.hasDiscardableCards(player, "he");
					},
					cost: qiusuoCost,
					content: qiusuoContent,
				},
			},
		},
		ciguangmrfz: {
			audio: 2,
			trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
			filter(event, player) {
				if (event.responded || event.ciguangmrfz) {
					return false;
				}
				if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) {
					return false;
				}
				if (event.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) {
					return false;
				}
				const target = ciguangTarget(event);
				return target != null && target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				trigger.ciguangmrfz = true;
				await player.draw(1);
				const target = ciguangTarget(trigger);
				if (!target || target.countCards("h") < 1) {
					return;
				}
				const result = await player.chooseToCompare(target).forResult();
				if (result.bool) {
					trigger.untrigger();
					trigger.set("responded", true);
					trigger.result = { bool: true, card: { name: "shan", isCard: true } };
				}
			},
			ai: {
				respondShan: true,
				freeShan: true,
			},
		},
	});

	translate({
		[name]: "安多恩",

		qiusuomrfz: "求索",
		qiusuomrfz_info:
			"出牌阶段限一次，或当你受到伤害时，你可以弃置任意张点数之和不大于13的牌，然后随机获得牌堆（不足则弃牌堆）中等量张点数为X的牌(X为你弃置的牌的点数之和)。",
		ciguangmrfz: "赐光",
		ciguangmrfz_info: "当你需要使用或打出【闪】时，你可以摸一张牌并与目标角色拼点，若你赢，你视为使用或打出一张【闪】。",
	});

	characterIntro(
		name,
		"剧情由DeepSeek总结<br>“殉道者”，安多恩·雅迦坦哲罗思，萨科塔，出生于伊比利亚的潮石镇，前拉特兰特勤小队队长，后成为“迷途者”的“先导”与“寻路者”的领袖。他不愤怒，不悲伤，不归咎上天，不苛求他人。安多恩只是走在自己的道路上，直到尽头。安多恩在潮石镇由当地主教抚养长大，那是一个萨科塔与伊比利亚人混居的小镇，对他而言就是唯一的家乡。大惊谧后伊比利亚持续衰败，潮石镇也在饥荒与瘟疫中走向毁灭。他前往拉特兰求援，得到的回答是“你是我们的一员，他们不是”。等他回到潮石镇，小镇已经不复存在。“为何只有拉特兰是乐园，为何只有萨科塔能受到恩惠”，这个问题从此成为他一切行动的起点。八年前，作为特勤小队队长的他与莫斯提马、蕾缪安、菲亚梅塔一同执行回收“锁与匙”的任务。他通过“黑锁”看到了萨科塔的提卡兹祖先接受律法成为萨科塔的景象，误以为那是拯救众生的答案。他在冲击中试图夺取锁与匙，源石技艺失控重伤蕾缪安；莫斯提马为阻止他对同族开火，当场堕天。安多恩重伤后放弃锁与匙，叛逃流亡。这是他身上永远无法卸下的“罪行”，也是四人小队分崩离析的裂痕。流亡中，他在拉特兰城外的安魂教堂接济被排斥的族群——无论对方是不是萨科塔，无论头顶有没有光环。他成为“迷途者”的“先导”，组建“寻路者”，带着一群同样没有答案的人，走一条拉特兰律法之外的路。万国峰会期间，他放走混血的少女塞茜莉亚，独自前往面见教宗伊万杰利斯塔十一世。两人就拉特兰的律法是否应当庇佑萨科塔之外的土地展开正面辩论，交流的尾声几乎同时拔铳射击以证明决意。因二人目的殊途同归，律法宽恕了这场相向的开火，二人均未堕天。随后教宗将他带往大教堂地下，目睹了赋予全体萨科塔光翼、光环与共感能力的远古仪器，他真正明白了拉特兰律法无法庇佑其他种族的原因。教宗告诫他“炬火注定转瞬即逝”，他的回答是：“那我宁愿做行将冻毙者脚边的炬火，即使这炬火转瞬即逝。”被教宗放走后，安多恩的理念受到极大冲击。途中他遇到前来复仇的菲亚梅塔，缺乏战意的他险些死于其手，守护铳被夺走，在枢机主教薇尔丽芙与前万国信使奥伦的帮助下才得以逃离。此后他率领寻路者离开拉特兰，并决定把自己的守护铳留在那里，不再取回。后来他再次被卷入拉特兰的危机，与送葬人等人一同前往大教堂地下的律法主机。众人陷入迷途时，安多恩以源石技艺寻路，接入主机后因超负荷过载而目流血泪。他在与主机的交流中确认，自己当年通过“黑锁”看到的不是未来，而是萨科塔被隐藏的历史；律法给出的答案是自相矛盾的悖论。确认这一点后，他与送葬人一同炸毁了律法主机。代价是过度使用源石技艺导致失明，被拉特兰判处流放，寻路者也随之解散。他带着剩下的人搭乘移动修道院离开，以几乎一无所有的、破碎的姿态，继续走那条早已在脚下延伸的路。"
	);

	characterTitle(name, "持炬的寻路人");

	line({
		qiusuomrfz1:"路途只有自己能够寻找，也只能凭自己的双足行过。",
		qiusuomrfz2:"意义不会凭空存在。我所做的，不过是给那个答案一个降临的机会。",
		ciguangmrfz1:"那我宁愿做行将冻毙者脚边的炬火——即使这炬火转瞬即逝。",
		ciguangmrfz2:"光赐于苦。苦承其光。这就是我选择的路。",
		['anduoenmrfz:die']:"我终究是个拉特兰人，对吗……那这条路，就替我走完它。",
	})
};

resigter();
