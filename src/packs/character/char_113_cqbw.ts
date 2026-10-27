import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_113_cqbw", { pack: "legendSJZX", sex: "female", group: "bamrfz", hp: 3, skills: ["fukemrfz", "zhumengmrfz"] });

skill({
	fukemrfz: {
		trigger: {
			player: "gainAfter",
		},
		filter: function (event, player) {
			if (
				!game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0;
				})
			)
				return false;
			return event.getParent(3)!.name != "fukemrfz";
		},
		audio: {
			"char_113_cqbw@epoque#7": ["编入队伍", "行动开始", "部署1", "部署2"],
		},
		async cost(event, trigger, player) {
			let num = trigger.cards.length;
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("fukemrfz"),
					prompt2: "获得至多" + get.translation(num) + "名角色的各一张手牌，然后弃置等量的牌",
					filterTarget(card, player, target) {
						return target.countCards("h") > 0 && player != target;
					},
					selectTarget() {
						return [1,num]
					},
					ai(target) {
						let att = get.attitude(_status.event.player, target);
						if (target.hasSkill("tuntian")) return att / 10;
						return 1 - att;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			targets.sortBySeat();
			player.line(targets);
			await player.chooseToDiscard({
				//num2, true, "he"
				forced: true,
				position: "he",
				selectCard: targets.length,
				prompt: `【伏客】:弃置${get.cnNumber(targets.length)}张牌`,
			});
			player.gainMultiple(targets, "h");
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},
	/**
	 * 筑梦
	 *
	 * > 每轮开始时，你可以进行判定且当你本轮首次使用与判定牌**花色、点数或类型**中的一个一致的牌后，
	 * > 你摸一张牌。
	 *
	 * 这个描述要拆成**三个独立效果**来理解（三者互不干扰，各自独立判断「本轮首次」）：
	 * ① 每轮开始时判定；本轮首次使用**花色**相同的牌 ⇒ 摸一张；
	 * ② 每轮开始时判定；本轮首次使用**点数**相同的牌 ⇒ 摸一张；
	 * ③ 每轮开始时判定；本轮首次使用**类型**相同的牌 ⇒ 摸一张。
	 *
	 * 所以三个条件**各有一个独立的 `used` 标记**，同一轮里最多可以因筑梦摸 3 张
	 * （分别由花色、点数、类型各触发一次）。
	 *
	 * 实现拆解：
	 * - **每轮开始时** ⇒ `trigger: { global: "roundStart" }`（每轮开始一次，不是每回合）。
	 * - **可以进行判定** ⇒ 不写 `cost`，引擎会在 `content.ts:4165` 的 else 分支自动弹
	 *   `chooseBool`（非强制 ⇒ 玩家可以拒绝，符合描述里的「可以」）。
	 * - **三项特征**都从这一次判定里取出、共用同一张判定牌：
	 *   `suit` / `number`（`get.*(card, false)` 取牌面原始值）/ `type`（`get.type2`，
	 *   把延时锦囊并入 `trick`，与玩家对「同类牌」的直觉一致）。
	 * - **三个独立子技能**：`_suit` / `_number` / `_type`，各自盯 `useCard`、
	 *   各自比对对应的一项、各自持有 `used` 标记。用 `group` 把三者挂到主技能上。
	 *
	 * ⚠️ `group` 里的名字必须是 **`lib.skill` 中真实存在的键**（`expandSkills` 中用
	 * `lib.skill[i]` 过滤，见 `game/index.js:10171-10173`）。所以这里写
	 * `zhumengmrfz_suit` 这类**展开后的完整 id**，不能写 `"zhumengmrfz_use"` 之外的花名，
	 * 也不能指望 `group: "use"` 这种相对名 —— 那样会被静默过滤掉，技能完全不生效。
	 *
	 * ⚠️ 「本轮」用 `game.roundNumber` 跟踪而**不是**只靠 `roundStart` 重置 ——
	 * 玩家可能在某轮中途获得本技能（换将/授予），那样就错过了当轮的 `roundStart`，
	 * 只靠事件重置会残留上一轮状态。这里每次使用时比对轮次号，不一致就视为新一轮。
	 */
	zhumengmrfz: {
		audio: {
			"char_113_cqbw@epoque#7": ["戳一下"],
			default: ["戳一下", "问候"],
		},
		trigger: { global: "roundStart" },
		//无 `cost` 的触发技：引擎自动弹 `chooseBool`，玩家可以拒绝（「可以」）
		prompt: "是否发动【筑梦】？",
		prompt2: "你可以进行判定，然后本轮你首次使用与判定牌花色、点数或类型之一相同的牌后，你摸一张牌",
		frequent:true,
		check:()=>true,
		init(player, skill) {
			//`round`：状态所属的轮次号；`suit`/`number`/`type`：本轮判定牌的三项特征；
			//`usedSuit`/`usedNumber`/`usedType`：三项**各自**本轮是否已触发
			player.storage[skill] ??= {
				round: -1,
				suit: null,
				number: null,
				type: null,
				usedSuit: false,
				usedNumber: false,
				usedType: false,
			};
		},
		onremove: true,
		mark: true,
		intro: {
			content(storage) {
				if (!storage || storage.suit == null) return "本轮尚未判定";
				const suit = get.translation(storage.suit);
				const number = typeof get.strNumber === "function" ? get.strNumber(storage.number) : storage.number;
				const type = get.translation(storage.type);
				const mark = used => (used ? "✔" : "✘");
				return [
					`本轮判定：${suit}${number}${type}`,
					`花色 ${mark(storage.usedSuit)}　点数 ${mark(storage.usedNumber)}　类型 ${mark(storage.usedType)}`,
				].join("<br>");
			},
		},
		async content(event, trigger, player) {
			const storage = player.storage.zhumengmrfz;
			//新一轮：重置三项「已触发」标记
			const round = game.roundNumber;
			if (storage.round !== round) {
				storage.round = round;
				storage.usedSuit = false;
				storage.usedNumber = false;
				storage.usedType = false;
			}

			const result = await player.judge().forResult();
			if (!result?.card) return;

			let card = result.card as Card;

			//三项特征共用这一张判定牌
			storage.suit = get.suit(card, false);
			storage.number = get.number(card, false);
			storage.type = get.type2(card, false);
			player.markSkill("zhumengmrfz");
		},
		//三个独立效果（各自独立的「本轮首次」）
		group: ["zhumengmrfz_suit", "zhumengmrfz_number", "zhumengmrfz_type"],
		subSkill: {
			/** ① 本轮首次使用与判定牌**花色**相同的牌 ⇒ 摸一张 */
			suit: {
				charlotte: true,
				audio:"zhumengmrfz",
				trigger: { player: "useCard" },
				filter(event, player) {
					const storage = player.storage.zhumengmrfz;
					if (!storage || storage.suit == null) return false;
					if (storage.usedSuit) return false;
					if (storage.round !== game.roundNumber) return false;
					const card = event.card;
					if (!card) return false;
					return get.suit(card, false) === storage.suit;
				},
				forced: true,
				async content(event, trigger, player) {
					const storage = player.storage.zhumengmrfz;
					storage.usedSuit = true;
					player.markSkill("zhumengmrfz");
					await player.draw(1);
				},
			},
			/** ② 本轮首次使用与判定牌**点数**相同的牌 ⇒ 摸一张 */
			number: {
				charlotte: true,
				audio:"zhumengmrfz",
				trigger: { player: "useCard" },
				filter(event, player) {
					const storage = player.storage.zhumengmrfz;
					if (!storage || storage.number == null) return false;
					if (storage.usedNumber) return false;
					if (storage.round !== game.roundNumber) return false;
					const card = event.card;
					if (!card) return false;
					return get.number(card, false) === storage.number;
				},
				forced: true,
				async content(event, trigger, player) {
					const storage = player.storage.zhumengmrfz;
					storage.usedNumber = true;
					player.markSkill("zhumengmrfz");
					await player.draw(1);
				},
			},
			/** ③ 本轮首次使用与判定牌**类型**相同的牌 ⇒ 摸一张 */
			type: {
				charlotte: true,
				audio:"zhumengmrfz",
				trigger: { player: "useCard" },
				filter(event, player) {
					const storage = player.storage.zhumengmrfz;
					if (!storage || storage.type == null) return false;
					if (storage.usedType) return false;
					if (storage.round !== game.roundNumber) return false;
					const card = event.card;
					if (!card) return false;
					return get.type2(card, false) === storage.type;
				},
				forced: true,
				async content(event, trigger, player) {
					const storage = player.storage.zhumengmrfz;
					storage.usedType = true;
					player.markSkill("zhumengmrfz");
					await player.draw(1);
				},
			},
		},
	},
});

translate({
	char_113_cqbw: "W",
	fukemrfz: "伏客",
	fukemrfz_info: "当你不因【伏客】获得牌时，你可以选择至多X名其他角色并弃置等量的牌，然后获得这些角色各一张手牌。（X=此次获得的牌的数量）",
	zhumengmrfz: "筑梦",
	zhumengmrfz_info: "每轮开始时，你可以进行判定且当你本轮首次使用与判定牌花色、点数或类型中的一个一致的牌后，你摸一张牌。",
});

characterIntro("char_113_cqbw", "萨卡兹佣兵头目，W。曾参与卡兹戴尔漫长的内战，其小队以残暴而高效的作战手段闻名。在切尔诺伯格事件中与罗德岛发生冲突，后因为某些原因叛出整合运动，在凯尔希医生亲自进行了充分交涉后，与罗德岛签订战略合作条款。");

characterTitle("char_113_cqbw",whichWayUtil.colorize("#r遗愿焰火#"));