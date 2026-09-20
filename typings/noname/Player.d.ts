import { Player } from "@/library/element";
import type { CardFilter, EventChooseCardParams, EventChooseTargetParams } from "@/library/element/Player/type.d";

declare global {
	/**
	 * `player.chooseFakeCard()` 的参数对象：字段与本体 `chooseCard` 的 `EventChooseCardParams` 一致，
	 * 另外多一个必填的 `cards`。
	 */
	type ChooseFakeCardParams = Omit<EventChooseCardParams, "cards" | "filterCard" | "position"> & {
		/** 供玩家选择的牌（Card 或 VCard 原对象） */
		cards: Array<Card | VCard>;
		/** 可选牌过滤（函数 / `get.filter` 用的对象 / `true`），默认 `lib.filter.all`；只会作用在本次创建的假牌上 */
		filterCard?: boolean | CardFilter | ((card: Card, player: Player, event?: string) => boolean);
		/** 会被忽略：内部固定用 `"s"`（假牌所在的特殊区），以免误选真手牌 */
		position?: string;
		/**
		 * 假牌 gaintag 的显示名：临时写进 `lib.translate`（引擎会把 gaintag 的翻译渲染在牌面上），
		 * 选择结束后还原。默认取事件名（即 `"chooseFakeCard"`）；常传技能名，这样牌面上显示技能的中文名
		 */
		tagName?: string;
		/** 选择过程复杂：每选一张牌后重新计算 `filterCard` / `selectCard`，并跳过自动选择与 AI 的快速路径 */
		complexSelect?: boolean;
		/** 提示文字数组，逐条添加到对话框 */
		promptx?: any[];
		/** 引擎内部使用：隐藏技能标记（`_status.prehidden_skills`） */
		hsskill?: string;
		/** 引擎内部使用：事件类型标记（如 `"compare"`） */
		type?: string;
		/** 引擎在确认选择时调用的兜底过滤 */
		filterOk?: () => boolean;
		/** 选完后高亮结果；本函数高亮的是 `result.links` 里的原牌（假牌选完即被删除） */
		glow_result?: boolean;
	};

	/**
	 * `player.chooseFakeCard()` 的结果。
	 *
	 * 形态与 `chooseCard` 的 result 完全一致（cards / targets / buttons / links / confirm / bool），
	 * 且 `cards` 的语义也与本体相同：就是玩家最终选中的那几张**假牌**（临时置入手牌的那些）。
	 *
	 * 这些假牌在选完后会被立刻删除，调用方真正需要的是它们对应的真实值，因此本函数把
	 * 「选中的假牌 → 调用方传入的原牌（Card / VCard）」的映射放在 `links` 里
	 * （本体在纯选牌场景下不会往 `links` 写内容）。
	 *
	 * 玩家没有做出选择时 `bool` 为 false，`cards` 与 `links` 都是空数组。
	 *
	 * @example
	 * ```ts
	 * const result: ChooseFakeCardResult = await player.chooseFakeCard(vcards, 1, "请选择一张牌").forResult();
	 * const fake = result.cards?.[0]; // 玩家点选的那张假牌（选完即被删除）
	 * const chosen = result.links?.[0]; // 即 vcards 里的那一张 VCard 原对象
	 * ```
	 */
	type ChooseFakeCardResult = Omit<Partial<Result>, "cards" | "links"> & {
		/** 玩家选中的假牌（与本体 `chooseCard` 的 `cards` 语义一致，选完即被删除） */
		cards?: Card[];
		/** 上面的假牌所对应的真实值：调用方传入的 Card / VCard 原对象 */
		links?: Array<Card | VCard>;
	};

	/**
	 * `player.chooseTargetControl()` 的参数对象：字段与本体 `chooseTarget` 的 `EventChooseTargetParams` 一致
	 * （`filterTarget` / `selectTarget` / `filterOk` / `ai` / `forced` / `hsskill` 等），
	 * 另外多了选项相关的 `controls` / `choiceList` / `controlAi`。
	 */
	type ChooseTargetControlParams = Omit<EventChooseTargetParams, "prompt" | "prompt2" | "dialog"> & {
		/** 对话框提示；支持本体的 `"提示|提示2"` 写法（`|` 之后的内容作为第二段文本） */
		prompt?: string;
		/** 第二段提示（等价于 `prompt` 里 `|` 之后的部分） */
		prompt2?: string;
		/**
		 * 选项列表。可写成函数 `(targets: Player[]) => string[]` 以**随已选目标动态变化**
		 * （引擎会在每次目标选择变化后重绘选项条）。
		 *
		 * 与 `choiceList` 二者给其一即可；都不给时视为"没有可选项"：此时不要求选选项，
		 * 直接点「确定」即可结束，结果 `bool` 恒为 false（`control` 为 `undefined`）。
		 *
		 * 在本函数里**没有**「取消」按钮（见 {@link Player.chooseTargetControl}），所以：
		 * 若希望玩家可以放弃本次选择，请把 `"cancel2"` 加进列表 —— 点它即取消
		 * （立即结束，`bool=false`、`control="cancel2"`、`confirm="cancel"`，与本体 `chooseControl` 一致）。
		 */
		controls?: string[] | ((targets: Player[]) => string[]);
		/** 等价于 `controls`（展示时过 `get.translation`，值仍取原字符串） */
		choiceList?: string[];
		/** AI 选择选项的方式：返回 number 取 `controls` 下标、返回 string 直接采用；缺省取第一个选项 */
		controlAi?: (event: GameEvent, player: Player) => number | string;
	};

	/**
	 * `player.chooseTargetControl()` 的结果。
	 *
	 * - `bool`：**同时**选中了目标与选项（且选项不是 `"cancel2"`）才为 true；
	 * - `targets`：选中的角色。**目标已选但未选选项（或选了 `"cancel2"` 取消）时会保留**，便于区分
	 *   "完全没选人"与"选了人没选选项"；目标本身未选/被取消时为空数组；
	 * - `control`：选中的选项原字符串（未选为 `undefined`；`"cancel2"` 表示取消）；
	 * - `index`：`control` 在当时的选项列表中的下标（未选为 -1）；
	 * - `confirm`：`"ok"` / `"cancel"`。
	 *
	 * @example
	 * ```ts
	 * const result = await player
	 * 	.chooseTargetControl({ filterTarget: (c, p, t) => t != p, controls: ["摸一张牌", "弃一张牌"] })
	 * 	.forResult();
	 * if (result.bool) {
	 * 	// result.targets[0] 是选中的角色，result.control 是选中的选项，result.index 是下标
	 * }
	 * ```
	 */
	type ChooseTargetControlResult = Omit<Partial<Result>, "targets"> & {
		/** 选中的角色；目标已选但未选选项/取消时会保留，目标未选时为空数组 */
		targets: Player[];
		/** 选中的选项原字符串（未选为 `undefined`；`"cancel2"` 表示取消） */
		control?: string;
		/** `control` 在当时的选项列表中的下标（未选为 -1） */
		index: number;
	};
}

declare module "@/library/element" {
	interface Player {
		/**
		 * 从传入的牌中选牌（假牌版）。
		 *
		 * 把传入的每张牌复制成一张**假牌**直接置入自己的手牌（`directgains`，不触发获得事件），
		 * 玩家从这些假牌中挑选；选择期间手牌分成两组：**一组折成只露左边缘的细条，另一组按引擎自己的折叠
		 * 展示**（会折、会悬停摊开、有动画），默认折真牌、展开假牌。**点击折叠的那一组即可切换视图**
		 * （点折叠的真牌 → 展开真牌、折叠假牌；点折叠的假牌 → 展开假牌、折叠真牌），
		 * 折叠组的点击**不会选中牌**（选择期间它们的 `selectable` 被摘掉，重新展开时补回）。
		 * 选择结束后假牌被全部删除、手牌布局完全复原。
		 *
		 * 结果形态与 `chooseCard` 一致（`result.cards` 就是玩家选中的假牌），
		 * 而选中的假牌所对应的真实值放在 `result.links` 里，详见 {@link ChooseFakeCardResult}。
		 *
		 * 注意：
		 * - 临时假牌归入「特殊区」（不参与手牌数 / 手牌上限 / 弃牌结算），
		 *   选择期间 `player.countCards("h")` 仍是真实手牌数；
		 * - 只有本地玩家（`game.me`）会折叠手牌，其它客户端只同步假牌本身；
		 * - `single-handcard` 布局（mobile / long / long2 / nova）下两个组共用一个手牌容器，
		 *   因为采用逐张定位，同样能"分组折叠"，表现与默认布局一致。
		 *
		 * @param params 参数对象，字段与本体 `chooseCard` 一致（`selectCard` / `filterCard` / `ai` / `forced` /
		 * `prompt` / `prompt2` / `promptx` / `complexCard` / `complexSelect` / `allowChooseAll` / `glow_result` 等），
		 * 另外需要一个必填的 `cards`；`position` 会被忽略（内部固定 `"s"`）。详见 {@link ChooseFakeCardParams}
		 *
		 * @returns 可链式 `.set(...)`、可 `.forResult()` 的事件；`forResult()` 的返回值见 {@link ChooseFakeCardResult}
		 *
		 * @example
		 * ```ts
		 * const cards = player.getCards("h");
		 * const result = await player.chooseFakeCard({ cards, selectCard: 1, prompt: "请选择一张手牌" }).forResult();
		 * const chosen = result.links?.[0]; // cards 里的那一张原牌
		 * ```
		 */
		chooseFakeCard(params: ChooseFakeCardParams): GameEvent;

		/**
		 * 同时选择角色（目标）与选项（`chooseTarget` + `chooseControl` 的结合）。
		 *
		 * 交互形态：**选项渲染在 `ui.control`（`#control`）里**，与引擎的「确定」同栏（与本体
		 * `chooseControl` 的 controlbar 形态一致），角色仍在战场点选。
		 *
		 * 注意事项：
		 * - **必须同时选定目标与选项才会结束**：「确定」只在已点选选项（或该目标确实没有可选项）时出现；
		 * - 本函数**没有「取消」按钮**（`fakeforce`），所以"只选目标、不选选项"无法结束选择；
		 *   想允许玩家放弃，请在 `controls` 里加 `"cancel2"` —— 点它即取消（`bool=false`、`control="cancel2"`）；
		 * - `controls` 可写成 `(targets) => string[]`，选项条会随已选目标动态重绘；已点选的选项若在新列表里
		 *   不存在会被自动作废（不会带着失效选项放行「确定」）；
		 * - 选项条目点击**只记录选择**，仍需点「确定」才算完成（因此"选了人没选选项"时 `bool=false` 但保留 `targets`）；
		 * - AI / 托管由引擎的 `ai` 选目标，选项按 `controlAi`（缺省第一个）选取；
		 * - 在线（多端）场景下选项条只在主机侧渲染，客机端暂不支持（与本体 `chooseCardTarget` 的差异）。
		 *
		 * @param params 见 {@link ChooseTargetControlParams}
		 * @returns 可链式 `.set(...)`、可 `.forResult()` 的事件；`forResult()` 的返回值见 {@link ChooseTargetControlResult}
		 *
		 * @example
		 * ```ts
		 * const result = await player
		 * 	.chooseTargetControl({
		 * 		filterTarget: (card, player, target) => target != player,
		 * 		selectTarget: 1,
		 * 		prompt: "选择一名角色，再选择一项",
		 * 		//想允许玩家放弃时，把 "cancel2" 也放进来（点它即取消，与 chooseControl 一致）
		 * 		controls: targets => (targets[0]?.countCards("h") > 0 ? ["弃置其一张牌", "令其摸一张牌"] : ["令其摸一张牌"]),
		 * 	})
		 * 	.forResult();
		 * ```
		 */
		chooseTargetControl(params: ChooseTargetControlParams): GameEvent;

		/**
		 * 移除自己手牌中所有的（驶舰之向）提示
		 * @param id 只移除该 id 的提示；不传则移除全部
		 */
		removePromptSJZX(id?: string): void;

		/**
		 * 设置某个技能的使用次数（同时修正 `stat.allSkills` 与 `storage.counttrigger`）
		 * @param skill 技能名
		 * @param num 增减的次数（可为负数）
		 */
		setSkillCount(skill: string, num: number): void;

		/**
		 * 在自己身上显示一条提示文字（HTML）
		 * @param str 显示的内容
		 * @param nature 颜色（`lib.nature` 的键，如 "soil" / "fire"），默认 "soil"
		 * @param clear 是否先清除原有提示，默认 false
		 */
		showPrompt(str: string, nature?: string, clear?: boolean): void;

		/**
		 * 获取卡牌的使用次数上限（`cardusable` 返回 false 时为 0）
		 * @param card 牌或牌名
		 * @param pure 为 true 时返回上限本身，否则返回「上限 - 本回合已使用次数」（仅在当前回合内生效）
		 */
		getCardUsable2(card: string | VCard, pure?: boolean): number;

		/**
		 * 是否满足某个应变条件（读取 `lib.yingbian.condition.simple/complex`）
		 * @param conditional 应变条件 id（如 "kongchao" / "canqu" / "zhuzhan" / "fujia"）
		 * @param event 判定所用事件，默认当前事件 `get.event()`；事件的 `forceYingbian` 为 true 时直接返回 true
		 */
		satisfyYingbian(conditional: string, event?: GameEvent): boolean;

		/**
		 * 重新隐匿（把武将牌翻回未明置状态，并临时移除公告技能）
		 * @param noChange 是否不把体力/体力上限改为 1，默认 false（即会改为 1）
		 */
		reUnseen(noChange?: boolean): Promise<void>;

		/**
		 * 把手牌数调整为指定张数：多了弃置、少了摸牌
		 * @param num 目标手牌数
		 */
		adjustHandCardTo(num: number): void;

		/**
		 * 自己是否能对符合条件的角色使用此牌（按敌我态度筛选目标）
		 * @param card 牌（牌对象、牌名或 `{ name }` 形式）
		 * @param isfriend 是否只找友方（true，默认）或敌方（false）
		 * @param distance 是否计算距离，默认 true
		 */
		canUseCardAtt(card: any, isfriend?: boolean, distance?: boolean): boolean;

		/**
		 * 自己攻击范围内的角色数
		 */
		getNumberInRange(): number;

		/**
		 * 修改自己某个标记的图片
		 * @param mark 标记名
		 * @param path 图片路径；`bool` 为 false 时按扩展内 `image/skill/{path}.png` 解析
		 * @param bool 为 true 时 `path` 直接作为完整 CSS 图片值使用
		 */
		changeMarkImage(mark: string, path: string, bool?: boolean): void;

		/**
		 * 重铸过的牌的累计张数（`storage._recastGain`）
		 */
		recastCount(): number;

		/**
		 * 本回合（本行动轮）是否已经行动过
		 */
		isAction(): boolean;

		/**
		 * 移除某个标记的全部层数（同时摘掉技能标记）
		 * @param str 标记名
		 * @param bool 传 false 时不记录日志
		 */
		removeAllmark(str: string, bool?: boolean): void;

		/**
		 * 自己的某个「副将牌」区域里是否有指定类型的牌
		 * @param str 区域名（`getExpansions` 的键）
		 * @param type 牌类型（如 "basic" / "trick"）
		 */
		isTypeExpansions(str: any, type: any): boolean;

		/**
		 * 当前事件（或含指定阶段名的父事件）是否处于某个阶段
		 * @param phase 阶段名（如 "phaseUse"）
		 * @param notmeisok 为 true 时不要求当前回合角色是自己
		 */
		isPhase(phase: string, notmeisok?: boolean): boolean;

		/**
		 * 自己是否能对此牌的所有潜在目标使用（含或不含自己）
		 * @param card 牌（牌对象、牌名或 `{ name }` 形式）
		 * @param distance 是否计算距离，默认 true
		 * @param includeme 是否包含自己，默认 true
		 */
		canUseToAnyone(card: any, distance?: boolean, includeme?: boolean): boolean;

		/**
		 * 自己的手牌上限是否不小于（`equal` 为 true）或大于其他所有存活角色
		 * @param equal 为 true 时允许相等，默认 false
		 */
		isMaxHandCardLimit(equal?: boolean): boolean;

		/**
		 * 自己的手牌上限是否不大于（`equal` 为 true）或小于其他所有存活角色
		 * @param equal 为 true 时允许相等，默认 false
		 */
		isMinHandCardLimit(equal?: boolean): boolean;

		/**
		 * 获取自己武将牌上的技能名列表（不含 `charlotte` 技能）
		 * @param disable 是否排除被禁用的技能，默认 false
		 * @param tag 技能信息里需要排除的字段名（一个或多个），如 "charlotte" / ["charlotte", "subSkill"]
		 * @returns 技能名数组
		 */
		getSkillsList(disable?: boolean, tag?: string | string[]): string[];
	}
}
