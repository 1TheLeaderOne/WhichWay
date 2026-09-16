import { Player } from "@/library/element";
import type { CardFilter, EventChooseCardParams } from "@/library/element/Player/type.d";

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
}

declare module "@/library/element" {
	interface Player {
		/**
		 * 从传入的牌中选牌（假牌版）。
		 *
		 * 把传入的每张牌复制成一张**假牌**直接置入自己的手牌（`directgains`，不触发获得事件），
		 * 玩家从这些假牌中挑选；选择期间自己的真实手牌会被折叠成只露左边缘的重叠条
		 * （鼠标悬停 / 触屏点选被折叠的牌可以展开查看），假牌则按正常间距平铺。
		 * 选择结束后假牌被全部删除、手牌布局完全复原。
		 *
		 * 结果形态与 `chooseCard` 一致（`result.cards` 就是玩家选中的假牌），
		 * 而选中的假牌所对应的真实值放在 `result.links` 里，详见 {@link ChooseFakeCardResult}。
		 *
		 * 注意：
		 * - 临时假牌归入「特殊区」（不参与手牌数 / 手牌上限 / 弃牌结算），
		 *   选择期间 `player.countCards("h")` 仍是真实手牌数；
		 * - 只有本地玩家（`game.me`）会折叠手牌，其它客户端只同步假牌本身；
		 * - `single-handcard` 布局（mobile / long / long2 / nova）下只有一个手牌容器，
		 *   无法做到「只折真牌」，此时降级为整行折叠。
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
