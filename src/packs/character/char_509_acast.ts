import { lib, game, ui, get, ai, _status } from "noname";
import { register } from "../hooks.ts";

/* ================================== 织法 ================================== */

/** 织法四个选项的初始牌名 */
const ZHIFA_INIT = ["tao", "shan", "jiu", "sha"];

/** 读取（并惰性初始化）织法的四个选项；选项可被永久改写 */
const zhifaList = (player: Player): string[] => {
	if (!Array.isArray(player.storage.zhifamrfz) || player.storage.zhifamrfz.length !== 4) {
		player.storage.zhifamrfz = ZHIFA_INIT.slice();
	}
	return player.storage.zhifamrfz;
};

/** 当前回合的标识（“每回合限一次”，其他角色的回合内也可发动一次） */
const zhifaTurn = (): string => `${game.roundNumber}_${_status.currentPhase ? _status.currentPhase.playerid : ""}`;

/** 本回合是否已经发动过织法 */
const zhifaUsed = (player: Player): boolean => player.storage.zhifamrfz_used === zhifaTurn();

/** 标记本回合已发动 */
const zhifaUse = (player: Player): void => {
	player.storage.zhifamrfz_used = zhifaTurn();
};

/** 某张牌能否在指定时机“视为使用/打出” */
const zhifaEnabled = (player: Player, name: string, event?: GameEvent): boolean => {
	if (event && typeof (event as any).filterCard === "function") {
		return (event as any).filterCard({ name, isCard: true }, player, event);
	}
	const card = { name, isCard: true };
	if (!player.hasUseTarget(card)) return false;
	// 选项牌本身也要受使用次数限制（例如本回合【酒】/【杀】已用完就不再列出）。
	// 注意：lib.filter.cardUsable 对 updateUsable:"phaseUse" 的牌（如【杀】）会因父事件不是 phaseUse 而直接放行，
	// 这里用 getCardUsable 的“剩余次数”语义（当前回合会减去 countUsed）。
	return player.getCardUsable(card) > 0;
};

/** 当前可选的选项（含 1 基序号） */
const zhifaChoices = (player: Player, event?: GameEvent): { name: string; num: number }[] =>
	zhifaList(player)
		.map((name, index) => ({ name, num: index + 1 }))
		.filter(info => zhifaEnabled(player, info.name, event));

/** 选择第 N 项；返回 null 表示取消 */
const zhifaChooseOption = async (player: Player, event?: GameEvent): Promise<{ name: string; num: number } | null> => {
	const choices = zhifaChoices(player, event);
	if (!choices.length) return null;
	const labels = choices.map(info => `第${get.cnNumber(info.num)}项：【${get.translation(info.name)}】`);
	const result = await player
		.chooseControl({
			controls: labels,
			ai: () => {
				const me = get.player();
				let best = 0,
					value = -Infinity;
				choices.forEach((info, index) => {
					const v = me.getUseValue(get.autoViewAs({ name: info.name, isCard: true }));
					if (v > value) {
						value = v;
						best = index;
					}
				});
				return best;
			},
		})
		.set("prompt", "织法：请选择一项")
		.set("prompt2", "选择后将手牌调整至对应张数（多于则弃、少于则摸），然后视为使用/打出该项对应的牌")
		.forResult();
	if (!result || result.control == null || result.control === "cancel2") return null;
	const index = labels.indexOf(result.control);
	return index < 0 ? null : choices[index];
};

/**
 * 把手牌调整到 num 张（num 为选项序号）：
 * - 手牌多于 num：弃至 num 张；
 * - 手牌少于 num：摸至 num 张；
 * - 相等：不摸也不弃。
 * 返回本次实际摸/弃的牌，供后续的额外使用分支使用。
 */
const zhifaAdjust = async (player: Player, num: number): Promise<{ branch: "draw" | "discard" | "none"; cards: Card[] }> => {
	const hand = player.countCards("h");
	if (hand === num) return { branch: "none", cards: [] };
	if (hand < num) {
		const count = num - hand;
		const result = await player.draw(count).forResult();
		return { branch: "draw", cards: (result?.cards ?? []) as Card[] };
	}
	// 极端情况下可能有不可弃置的手牌，按可弃置数兜底，避免 forced 无法满足张数而卡住
	const count = Math.min(hand - num, player.countDiscardableCards(player, "h"));
	if (count <= 0) return { branch: "none", cards: [] };
	const result = await player
		.chooseToDiscard({ position: "h", selectCard: count, forced: true, prompt: `织法：请将手牌弃至${get.cnNumber(num)}张` })
		.forResult();
	return { branch: "discard", cards: (result?.cards ?? []) as Card[] };
};

/**
 * 额外使用：
 * - 摸牌分支：可使用摸到的其中一张牌；
 * - 弃牌分支：从弃掉的牌中选一张，将这些牌视为该牌使用。
 * 均无次数和距离限制。返回实际使用的牌名；未使用返回 null。
 */
const zhifaExtra = async (player: Player, adjust: { branch: "draw" | "discard" | "none"; cards: Card[] }): Promise<string | null> => {
	const { branch, cards } = adjust;
	if (!cards.length) return null;
	if (branch === "draw") {
		// 无次数、无距离限制，因此判定时也忽略次数与距离
		const usable = cards.filter(card => player.hasUseTarget(card, false, false));
		if (!usable.length) return null;
		const result = await player
			.chooseButton({
				createDialog: ["织法：你可以额外使用其中一张牌（无次数和距离限制）", usable],
				selectButton: 1,
				ai: button => get.player().getUseValue(button.link),
			})
			.forResult();
		if (!result?.bool || !result.links?.length) return null;
		const card = result.links[0] as Card;
		const use = await player
			.chooseUseTarget({ card, forced: false, nodistance: true, addCount: false, prompt: `织法：使用【${get.translation(get.name(card))}】` })
			.forResult();
		return use?.bool ? get.name(card) : null;
	}
	const result = await player
		.chooseButton({
			createDialog: [`织法：请选择这${get.cnNumber(cards.length)}张牌要视为的牌名`, cards],
			selectButton: 1,
			ai: () => 1,
		})
		.forResult();
	if (!result?.bool || !result.links?.length) return null;
	const chosen = result.links[0] as Card;
	const name = get.name(chosen);
	const data: any = { name, isCard: true };
	if (get.nature(chosen)) data.nature = get.nature(chosen);
	const vcard = get.autoViewAs(data, cards.slice()) as any;
	if (!player.hasUseTarget(vcard, false, false)) return null;
	const use = await player
		.chooseUseTarget({
			card: vcard,
			// 把这 N 张弃牌作为实体牌传入，实体牌数才会计入【砥石】的 X
			cards: cards.slice(),
			forced: false,
			nodistance: true,
			addCount: false,
			prompt: `织法：将${get.cnNumber(cards.length)}张牌视为【${get.translation(name)}】使用`,
		})
		.forResult();
	return use?.bool ? name : null;
};

/** 把第 index + 1 项永久改写为 name */
const zhifaRewrite = (player: Player, index: number, name: string): void => {
	if (!name || !lib.card[name]) return;
	const list = zhifaList(player);
	if (list[index] === name) return;
	list[index] = name;
	game.log(player, "将", "#g【织法】", "的第", get.cnNumber(index + 1), "项修改为", `#g【${get.translation(name)}】`);
};

/* ================================== 砥石 ================================== */

/** 此牌对应的实体牌数（普通牌算 1） */
const lishiX = (card: Card): number => {
	const cards = (card as any)?.cards;
	return Array.isArray(cards) && cards.length ? cards.length : 1;
};

/* ================================== 注册 ================================== */

register("char_509_acast", {
	character: {
		sex: "female",
		group: "luomrfz",
		hp: 3,
		skills: ["zhifamrfz", "dishimrfz"],
		pack: "plotSJZX",
		clans: ["RhodesElite"],
        llm:"DeepSeek-4.1-Flash",
        designer:["白缪缪.ovo"],
		dieAudios:["作战中2"]
	},
	characterTranslate: "精术髓",
    characterNamePrefix:"精",
	intro: "术髓，罗德岛精英术师干员，擅长引导、解析、控制源石技艺。现根据罗德岛决议，长期担任外勤小队指挥，主要负责处理攻坚委托与术师干员培养任务。",
	title: "见我所见",
	skillInfo: {
		/* -------------------------------- 织法 -------------------------------- */
		zhifamrfz: {
			skillName: "织法",
			info: "每回合限一次，你可以将手牌调整至对应选项以视为使用或打出：<br>1.【桃】;<br>2.【闪】;<br>3.【酒】;<br>4.【杀】<br>若你因此[摸/弃]了N张牌，你可以[使用其中一张牌/将这些牌视为其中一张牌]使用，然后你将第N项修改为你使用的牌。（N为你执行的项数）",
			dyncTrans(player) {
				const list = zhifaList(player);
				const text = list.map((name, index) => `${index + 1}.【${get.translation(name)}】`).join("；");
				return `每回合限一次，你可以将手牌调整至对应选项以视为使用或打出：${text}<br>若你因此摸/弃了N张牌，你可以使用其中一张牌/将这些牌视为其中一张牌使用，然后你将第N项修改为你使用的牌。（N为你执行的项数）`;
			},
			skill: {
				audio: ["部署1", "作战中3"],
				enable: "phaseUse",
				init(player) {
					zhifaList(player);
				},
				filter(event, player) {
					return !zhifaUsed(player) && zhifaChoices(player).length > 0;
				},
				async content(event, trigger, player) {
					const choice = await zhifaChooseOption(player);
					if (!choice) return;
					zhifaUse(player);
					const adjust = await zhifaAdjust(player, choice.num);
					await player
						.chooseUseTarget({
							card: get.autoViewAs({ name: choice.name, isCard: true }),
							forced: true,
							prompt: `织法：请使用【${get.translation(choice.name)}】`,
						})
						.forResult();
					const used = await zhifaExtra(player, adjust);
					if (used) zhifaRewrite(player, choice.num - 1, used);
				},
				ai: {
					order: 7,
					result: { player: 1 },
				},
				group: ["zhifamrfz_respond"],
				subSkill: {
					// 需要打出时（响应【杀】/【万箭齐发】/【决斗】等）也可发动
					respond: {
						// 引擎里【闪】响应【杀】走 chooseToUse（type=respondShan），【杀】响应【决斗】等走 chooseToRespond
						trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
						filter(event, player) {
							if (event.responded || zhifaUsed(player)) return false;
							// 只处理“响应/打出”类的 chooseToUse，出牌阶段的 chooseToUse 交给主技能
							if (event.name === "chooseToUse" && event.type !== "respondShan" && event.type !== "respondSha") return false;
							return zhifaChoices(player, event).length > 0;
						},
						check() {
							return true;
						},
						async content(event, trigger, player) {
							const choice = await zhifaChooseOption(player, trigger);
							if (!choice) return;
							zhifaUse(player);
							const adjust = await zhifaAdjust(player, choice.num);
							const used = await zhifaExtra(player, adjust);
							if (used) zhifaRewrite(player, choice.num - 1, used);
							trigger.untrigger();
							trigger.set("responded", true);
							trigger.result = { bool: true, card: { name: choice.name, isCard: true } };
						},
					},
				},
			},
		},
		/* -------------------------------- 砥石 -------------------------------- */
		dishimrfz: {
			skillName: "砥石",
			info: "宗族技，同族角色使用【杀】或【决斗】指定目标后，你可弃置一张牌，令此牌需要X张【闪】/【杀】。（X为此牌对应的实体牌数）",
			skill: {
				audio: ["部署2", "作战中1"],
				audioname:{
					lvzemrfz:"default",
				},
				clanSkill: true,
				trigger: { global: "useCardToTargeted" },
				logTarget: "target",
				filter(event, player) {
					// 同一张牌只在第一个目标处询问一次，效果作用于全部目标
					if (!event.isFirstTarget) return false;
					const card = event.card;
					if (!card || (card.name !== "sha" && card.name !== "juedou")) return false;
					const user = event.player;
					if (!user) return false;
					// 同族：使用者与技能拥有者有共同宗族（包含自己）
					if (user !== player && !user.getClans(false).some(clan => player.getClans(false).includes(clan))) return false;
					if (lishiX(card) <= 1) return false;
					return player.countDiscardableCards(player, "he") > 0;
				},
				check(event, player) {
					// 同族角色（含自己）用牌时默认发动
					return event.player === player || get.attitude(player, event.player) > 0;
				},
				async cost(event, trigger, player) {
					const result = await player
						.chooseToDiscard({ position: "he", prompt: "砥石：弃置一张牌，令此牌需要更多【闪】/【杀】" })
						.set("prompt2", get.prompt2("dishimrfz"))
						.forResult();
					if (result.bool) event.result = { bool: true, cards: result.cards };
				},
				async content(event, trigger, player) {
					const card = trigger.card;
					const x = lishiX(card);
					const map = trigger.getParent("useCard")?.customArgs;
					if (!map) return;
					if (card.name === "sha") {
						for (const target of trigger.targets || []) {
							if (!target) continue;
							map[target.playerid] ??= {};
							map[target.playerid].shanRequired = x;
						}
						player.line(trigger.target, "green");
					} else {
						const target = trigger.target;
						if (!target) return;
						map[target.playerid] ??= {};
						map[target.playerid].shaReq ??= {};
						map[target.playerid].shaReq[target.playerid] = x;
						player.line(target, "green");
					}
					game.log(player, "令", card, "需要", get.cnNumber(x), "张", card.name === "sha" ? "【闪】" : "【杀】");
				},
			},
		},
	},
});