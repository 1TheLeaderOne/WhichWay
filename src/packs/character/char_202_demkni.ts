import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_202_demkni", { pack: "legendSJZX", sex: "female", group: "lymrfz", hp: 3, maxHp: 4, skills: ["panshimrfz", "newgaihuamrfz"], llm: "DeepSeek-4.1-Flash" });

/**
 * 【钙化】的三个取牌来源。
 *
 * - `pile`：牌堆顶三张（取出观看后取走一张，其余按原顺序放回）
 * - `hand`：当前回合角色的手牌区（**盲选**，用 `choosePlayerCard`，连发动者本人都看不到牌面）
 * - `self`：自己的手牌区
 *
 * 注意：`hand` 与 `self` 是**两个独立的项**。当塞雷娅自己就是当前回合角色时二者指向同一区域，
 * 但仍各算一项（即自己回合内可从自己手牌发动两次）。
 */
const GAIHUA_SOURCES = [
	{ id: "pile", label: "牌堆顶三张牌" },
	{ id: "hand", label: "当前回合角色的手牌" },
	{ id: "self", label: "你的手牌" },
];

/** 本回合已用过的来源 id 列表 */
function gaihuaUsed(player) {
	return player.getStorage("newgaihuamrfz_used", []);
}

/** 某个来源此刻是否还有牌可取 */
function gaihuaAvailable(id, player) {
	switch (id) {
		case "pile":
			return ui.cardPile.childNodes.length > 0;
		case "hand": {
			const current = _status.currentPhase;
			return Boolean(current) && current.countCards("h") > 0;
		}
		case "self":
			return player.countCards("h") > 0;
	}
	return false;
}

/** 此刻可用（本回合没用过、且还有牌）的来源 */
function gaihuaSources(player) {
	return GAIHUA_SOURCES.filter(source => !gaihuaUsed(player).includes(source.id) && gaihuaAvailable(source.id, player));
}

/**
 * 当前场合下引擎认可的基本牌（含属性【杀】的变体）。
 *
 * 用 `event.filterCard` 逐个试探：只有真的能使用（次数、距离、目标都存在）的牌名才会出现，
 * 避免列出「选了却用不出去」的牌。返回形如 `{ name, nature }`，`nature` 可能是 `undefined`。
 */
function gaihuaNames(event, player) {
	if (!event || typeof event.filterCard != "function") return [];
	return get
		.inpileVCardList(info => {
			if (info[0] != "basic") return false;
			// 传 `"unsure"` 表示「还不知道会用到哪张实体牌」，避免因花色/点数未知被 filterCard 拒绝；
			// 引擎的 autoViewAs 类型只声明了 Card[]，故此处按引擎既有写法忽略该参数的类型
			// @ts-expect-error 未知花色占位
			const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true }, "unsure");
			return event.filterCard(card, player, event);
		})
		.map(info => ({ name: info[2], nature: info[3] }));
}

/** 把 `{ name, nature }` 转成 chooseButton 的 vcard 链接（`nature` 为空时不能带第四位） */
function gaihuaLink({ name, nature }) {
	return nature ? ["basic", "", name, nature] : ["basic", "", name];
}

/**
 * 从某个来源取一张牌；取不到返回 `null`。
 *
 * ⚠️ 这里**不**手动把牌从他人手里拿走：取到的牌会写进 `event.result.cards`，
 * 由 `useCard` 的 step 0 统一按 `get.owner(card)` 结算（他人手牌 → `owner.lose` 到处理区；
 * 无主牌 → `cardsGotoOrdering`）。再手动 lose 一次会触发两次失去。
 * 唯一的例外是牌堆顶：那几张牌必须先真正从牌堆里取出，未选中的要按原顺序放回。
 */
async function gaihuaPickCard(player, sourceId, name) {
	switch (sourceId) {
		case "pile": {
			if (ui.cardPile.childNodes.length < 1) return null;
			const cards = get.cards(Math.min(3, ui.cardPile.childNodes.length));
			if (!cards.length) return null;
			let chosen = cards[0];
			if (cards.length > 1) {
				const result = await player.chooseButton({ createDialog: [`钙化：请选择牌堆顶的一张牌当作【${get.translation(name)}】使用`, cards], forced: true })
					.set("ai", button => 1 - get.value(button.link))
					.forResult();
				if (!result?.links?.length) {
					// 强制选择下不应发生；万一是取消，把牌原样放回，避免凭空吞牌
					for (let i = cards.length - 1; i >= 0; i--) ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
					return null;
				}
				chosen = result.links[0];
			}
			// 未选中的牌按原顺序放回牌堆顶（cards 已是「顶 → 底」，故倒序插回）
			for (let i = cards.length - 1; i >= 0; i--) {
				if (cards[i] === chosen) continue;
				ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
			}
			game.updateRoundNumber();
			return chosen;
		}
		case "hand": {
			// 目标若正是自己，引擎会自动显示牌面（`isUnderControl`）；否则全是看不到牌面的 blank 按钮
			const target = _status.currentPhase;
			if (!target || target.countCards("h") < 1) return null;
			const result = await player
				.choosePlayerCard({
					target,
					position: "h",
					forced: true,
					selectButton: 1,
					prompt: `钙化：请选择${get.translation(target)}的一张手牌当作【${get.translation(name)}】使用`,
				})
				.set("ai", button => 1 - get.value(button.link))
				.forResult();
			return result?.cards?.length ? result.cards[0] : null;
		}
		case "self": {
			const result = await player
				.chooseCard({
					position: "h",
					forced: true,
					selectCard: 1,
					prompt: `钙化：请选择一张手牌当作【${get.translation(name)}】使用`,
				})
				.set("ai", card => -get.value(card))
				.forResult();
			return result?.cards?.length ? result.cards[0] : null;
		}
	}
	return null;
}

skill({
	newgaihuamrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		/** 只做「主动使用」；不含 `chooseToRespond`（被要求打出【闪】等场合不发动） */
		enable: "chooseToUse",
		/**
		 * 技能整体是否可用：
		 * - `event.responded` / `event.newgaihuamrfz`：已响应过、或本技能正在结算中，避免自我嵌套
		 * - 至少还剩一个「本回合没用过、且还有牌」的来源
		 * - 当前场合至少有一个能用的基本牌牌名
		 * - 联机模式：取牌写在 `precontent` 里，而引擎在 `game.online` 时会跳过 `precontent`
		 *   （`content.ts` 的 `!game.online` 判断），那会退化成「不消耗任何牌的免费虚拟牌」，
		 *   故此处直接禁用，避免出现白嫖漏洞。
		 */
		filter(event, player) {
			if (game.online) return false;
			if (event.responded || event.newgaihuamrfz) return false;
			if (!gaihuaSources(player).length) return false;
			return gaihuaNames(event, player).length > 0;
		},
		/**
		 * 能凭空印出基本牌，向 AI 与 `player.hasUsableCard` 声明「我能做出这张牌」。
		 * 具体场合是否成立由 `filter` / `filterCard` 再判断，这里只做粗筛。
		 */
		hiddenCard(player, name) {
			return get.type(name) == "basic" && !game.online && gaihuaSources(player).length > 0;
		},
		/**
		 * 第一步：选「要当作哪张基本牌」。
		 *
		 * 用 `chooseButton` 而不是把一切都塞进 `precontent`，是因为**牌名必须在选目标之前确定**：
		 * `chooseButton.backup` 会把这里选中的牌名写进 `viewAs`，引擎随后按正确的牌去请求目标；
		 * 若牌名等到 `precontent`（选完目标之后）才确定，目标过滤就会按错误的牌结算。
		 * 于是本技能的顺序是：选牌名 → 选目标 →（`precontent` 里）选来源 → 选牌。
		 */
		chooseButton: {
			dialog(event, player) {
				const list = gaihuaNames(event, player).map(gaihuaLink);
				const dialog = ui.create.dialog("钙化", [list, "vcard"], "hidden");
				// `direct` 让「只有一个可选牌名」时直接确认；Dialog 类型未声明该字段
				// @ts-expect-error 引擎运行期字段
				dialog.direct = list.length > 0;
				return dialog;
			},
			filter(button, player) {
				const event = get.event().getParent("chooseToUse");
				if (!event || typeof event.filterCard != "function") return true;
				return gaihuaNames(event, player).some(info => info.name == button.link[2] && (info.nature || undefined) == (button.link[3] || undefined));
			},
			check(button) {
				const player = get.player();
				const name = button.link[2],
					nature = button.link[3];
				const event = get.event().getParent("chooseToUse");
				if (name == "tao") {
					const dying = event?.dying;
					if (dying) return get.attitude(player, dying) > 0 ? 10 : -1;
					return player.hp < player.maxHp ? 8 : 1;
				}
				if (name == "jiu") return 4;
				if (name == "shan") return 3;
				// 没有实体牌，只按牌名估价，问引擎这张牌值多少
				return Math.max(1, player.getUseValue({ name, nature, isCard: true }));
			},
			/**
			 * 第二步：牌名固定下来后，实体牌留给 `precontent` 补。
			 *
			 * `filterCard` 恒 false + `selectCard: -1` ⇒ 本技能不消耗可选的实体牌：
			 * 玩家点完技能只需选目标；真正的实体牌在 `precontent` 里补进 `event.result.cards`，
			 * 由 `useCard` 当正常使用的实体牌结算（进入处理区 → 弃牌堆）。
			 */
			backup(links, player) {
				const name = links[0][2],
					nature = links[0][3];
				return {
					viewAs: { name, nature, isCard: true },
					popname: true,
					filterCard: () => false,
					selectCard: -1,
					log: false,
					async precontent(event, trigger, player) {
						// `event.result` 就是上层 `chooseToUse` 的 result 对象，改写它即改写本次出牌
						const result = event.result;
						if (!result) return;
						/** 取牌失败：让这次「使用」不发生，绝不能留下没有实体牌的免费虚拟牌 */
						const abort = () => {
							result.bool = false;
							delete result.card;
						};
						const outer = event.getParent("chooseToUse");
						if (outer) outer.set("newgaihuamrfz", true);

						// —— 选来源（不含「取消」：玩家已经选过目标，此刻退出只会白白浪费一次点击） ——
						//
						// `chooseControl` 的按钮文字是 `get.translation(control)`（control.js 的 `add()`），
						// 传内部 id 会直接把英文 id 显示出来，所以这里用中文 `label` 当 control 的值，
						// 再按下标映射回来源 id。
						const sources = gaihuaSources(player);
						if (!sources.length) return abort();
						const labels = sources.map(source => (source.id == "hand" ? `${source.label}（${get.translation(_status.currentPhase)}）` : source.label));
						let sourceId = sources[0].id;
						if (sources.length > 1) {
							const { control } = await player
								.chooseControl({
									controls: labels,
									prompt: "钙化：请选择查看的牌区",
									// AI：按 `GAIHUA_SOURCES` 的顺序取第一个可用项，即
									// 「牌堆顶 → 当前回合角色的手牌 → 自己的手牌」，把自己的牌留到最后
									ai: () => labels[0],
								})
								.forResult();
							const index = control ? labels.indexOf(control) : -1;
							if (index < 0) return abort();
							sourceId = sources[index].id;
						}

						// —— 选牌 ——
						const card = await gaihuaPickCard(player, sourceId, name);
						if (!card) return abort();

						// —— 记录本回合已用过的项（回合结束时随 `newgaihuamrfz_used` 一并清除） ——
						player.addTempSkill("newgaihuamrfz_used", { global: "phaseOver" });
						player.markAuto("newgaihuamrfz_used", [sourceId]);

						player.logSkill("newgaihuamrfz");
						result.card = get.autoViewAs({ name, nature, isCard: true }, [card]);
						result.cards = [card];
					},
				};
			},
			prompt(links, player) {
				const name = links[0][2],
					nature = links[0][3];
				return `钙化：将一张牌当作${nature ? get.translation(nature) : ""}【${get.translation(name)}】使用`;
			},
		},
		ai: {
			// 转化类技能：order 取低值，避免 AI 无脑优先发动（真正的取舍交给 result 与 check）
			order: 3,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: {
			/** 本回合已使用过的来源；回合结束时由 `addTempSkill` 的 `phaseOver` 一并移除 */
			used: {
				charlotte: true,
				mark: true,
				onremove: true,
				intro: {
					content(storage) {
						if (!storage?.length) return "本回合尚未发动钙化";
						return `本回合已使用：${storage.map(id => (GAIHUA_SOURCES.find(source => source.id == id) || { label: id }).label).join("、")}`;
					},
				},
			},
		},
	},
	panshimrfz: {
		mod: {
			targetEnabled: function (card, player, target) {
				for (let i of game.players) {
					if (i.getHistory("useCard").length > 0) return;
				}
				return false;
			},
		},
		audio: ["3星结束行动", "行动出发"],
		forced: true,
		trigger: { player: "useCard" },
		filter: function (event, player) {
			if (player.getHistory("useCard").length > 1) return false;
			return event.card && (get.type2(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)));
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(
				game.filterPlayer(function (current) {
					return current != player;
				})
			);
		},
	},
});

translate({
	char_202_demkni: "塞雷娅",
	newgaihuamrfz: "钙化",
	newgaihuamrfz_info: "每回合每项限一次，当你需要使用基本牌时，你可以从：1.牌堆顶三张牌;2.当前回合角色的手牌区;3.你的手牌区中选择一张牌视为使用之。",
	panshimrfz: "磐石",
	panshimrfz_info: "锁定技，你不能成为每回合第一张牌的目标；你每回合使用的第一张牌不可被其他角色响应。",
});

characterTitle("char_202_demkni", "<font color=#FFF68F>守望者</font>");

characterIntro("char_202_demkni", "塞雷娅，前莱茵生命防卫科主任。于生命科学、微生物学、源石技艺等领域皆有建树，同时于歼灭战、要员保全、异常事态处理等任务中表现出强大实力。</br>目前与罗德岛在科研等多个领域皆有合作，同时，正与罗德岛针对深入合作计划进行磋商。");
