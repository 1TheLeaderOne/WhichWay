import { Get } from "noname";

declare module "noname" {
	interface Get {
		/**
		 * 获取此牌的目标数（依据 `lib.card[牌名]` 的 `notarget` / `selectTarget` / `filterTarget`）
		 *
		 * @param card 牌对象或牌名
		 * @returns 最大目标数；`selectTarget = -1` 时返回 `Infinity`（`toself` 则为 1）；
		 * 完全不可指定目标的牌返回 0
		 */
		targetCounts(card: VCard | string): number;

		/**
		 * 判断该牌是否为单一目标牌（`selectTarget === 1`，且不是 `notarget`）
		 * @param card 牌对象或牌名
		 */
		isSingle(card: Card | string): boolean;

		/**
		 * 判断是否为「视为牌」：VCard 的 `cards` 与 `name` 不一致（含多张牌合成、`cards` 为空）
		 * @param card 牌对象
		 */
		isView(card: VCard): boolean;
		/**
		 * 判断数组中的每一张牌是否都是「视为牌」
		 * @param card 牌数组（会逐项递归判断，不返回结果）
		 */
		isView(card: Array<any>): boolean | void;

		/**
		 * 阶段 id → 中文名
		 * @param input 阶段 id（如 `phaseZhunbei`）
		 * @returns 对应中文名；不认识时返回 undefined
		 */
		tranPhase(input: string): string | undefined;
		/**
		 * 阶段 id 数组 → 中文名数组
		 * @param input 阶段 id 数组（无法识别的项会被跳过）
		 */
		tranPhase(input: string[]): string[] | undefined;

		/**
		 * 生成随机 id 字符串
		 * @returns 形如 `"035174SJZX"`（六位补零数字 + 固定后缀）
		 */
		randomNumberSJZX(): string;
	}
}
