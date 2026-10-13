import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("spsikadimrfz", { pack: "legendSJZX", sex: "female", group: "haimrfz", hp: 4, skills: ["newqianximrfz", "haixuanmrfz"] });

skill({
	newqianximrfz: {
		audio: ["作战中1","作战中2"],
		trigger: {
			global: "phaseOver",
		},
		forced: true,
		/**
		 * 取「刚刚结束回合的角色」。
		 *
		 * `phaseOver` 是 `content.phaseLoop` 里 `await event.trigger("phaseOver")` 发出的，
		 * 触发时的链路是 phaseLoop -> arrangeTrigger -> trigger，技能 filter / content
		 * 收到的 `event` / `trigger` 就是这个 **phaseLoop 事件**：此刻它的 `player` 仍然是
		 * 刚结束回合的角色（`event.player = findNext(...)` 在这次触发被 await 完之后才执行）。
		 *
		 * 原先这里用的是 `event.getChildren("phase").player` —— 但 `getChildren` 只沿
		 * `childEvents` **往下**找，而每回合的 `phase` 事件只是 phaseLoop 的子事件、还会随
		 * 回合不断累积，于是永远取到**第一回合**的角色（filter 恒为假、技能完全不触发，
		 * 这正是本 bug 的根因）。
		 */
		getTurnPlayer(event) {
			if (!event) return null;
			if (event.player) return event.player;
			//兜底：万一事件链有变（比如拿到的是 arrangeTrigger），就往上找 phaseLoop
			const loop = event.getParent?.("phaseLoop");
			return (loop && loop.player) || null;
		},
		/** 所有角色（含已阵亡者）按座次号排序后，取 `player` 的下个座位号角色；末位回绕到首位 */
		getNextByAll(player) {
			const chars = game.players.slice().concat(game.dead).sort(lib.sort.position);
			const index = chars.indexOf(player);
			if (index < 0 || !chars.length) return null;
			return chars[(index + 1) % chars.length];
		},
		filter(event, player) {
			const turn = get.info("newqianximrfz").getTurnPlayer(event);
			if (!turn) return false;
			const target = get.info("newqianximrfz").getNextByAll(turn);
			return !!target && !target.isAlive();
		},
		async content(event, trigger, player) {
			const info = get.info("newqianximrfz");
			const turn = info.getTurnPlayer(trigger);
			const target = turn && info.getNextByAll(turn);
			if (!target) return;
			game.broadcastAll(
				function (char1, char2) {
					game.swapSeat(char1, char2);
				},
				player,
				target
			);
			//注意：**不要**改 `trigger.player`。phaseOver 被 await 完之后 phaseLoop 会自己
			//`event.player = findNext(event.player)` 继续转（此时 player 已是换座后的新座次，
			//所以下一回合正好轮到刚迁移过来的你）；把 player 改成那个阵亡角色则会让下一回合
			//从其**旧**座位的下一位开始，中间的玩家全部少一个回合。
		},
	},
	haixuanmrfz: {
		audio: ["作战中2", "作战中4"],
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		derivation: ["duwu"],
		filter(event, player) {
			return event.player !== player && event.player.countCards("he") > 0;
		},
		prompt(event, player) {
			return `【海漩】:是否令${get.translation(event.player)}对你发动一次【黩武】？`;
		},
		check(event, player) {
			return get.attitude2(event.player) < 0 && player.hp > 2 && event.player.countCards("he") > 1;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const { cards } = await target
				.chooseToDiscard({
					forced: true,
					position: "he",
				})
				.set("prompt", `弃置${player.hp}张牌`)
				.set("prompt2", get.skillInfoTranslation("duwu"))
				.set("selectCard", Math.min(player.hp, target.countCards("he")))
				.set("ai", card => -get.value(card))
				.forResult();
			if (!cards) return;
			const next = game.createEvent("haixuanmrfz_duwu");
			next.target = player;
			next.player = target;
			next.setContent(lib.skill.duwu.content);

			await next;

			let cardsx = cards.filter(card => !get.tag(card, "damage") && get.position(card) === "d");
			if (cardsx.length) {
				player.gain({ cards: cardsx, animate: "gain2" });
				if (new Set(cardsx.map(card => get.suit(card))).size === cardsx.length) player.recover();
			}
		},
	},
});

translate({
	spsikadimrfz: "浊心斯卡蒂",
	spsikadimrfz_prefix: "浊心",
	newqianximrfz: "迁徙",
	newqianximrfz_info: "锁定技，任意角色回合结束后，若其下个座位号的角色已死亡，你与其下个座位号的角色交换座次。",
	haixuanmrfz: "海漩",
	haixuanmrfz_info: "其他角色的准备阶段，你可以令其对你发动一次【黩武】(若其手牌不足则全弃)，然后你获得其因此弃置的非伤害类牌，若你没有因此获得相同花色的牌，你回复一点体力值。",
});

characterTitle("spsikadimrfz", "<font color='#6495ed'>大群</font>");

characterIntro("spsikadimrfz", "照这个方向发展下去，就不会有人关心她究竟是什么了。不是斯卡蒂的问题，一个人也不能改变什么。我说的是，这种生理状态，以及该类生物性物质表现出的最终状态，可能会摧毁我们社会、历史与科学的所有度量衡。希望我们简陋的医疗科研条件现在还够使上点劲......");
