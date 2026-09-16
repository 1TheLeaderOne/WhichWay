import { Card } from "@/library/element";

declare module "@/library/element" {
	interface Card {
		/**
		 * 移除这张牌上的（驶舰之向）提示
		 * @param id 只移除该 id 的提示；不传则移除全部
		 * @returns this（可链式调用）
		 */
		removePromptSJZX(id?: string): this;

		/**
		 * 给这张牌添加一条（驶舰之向）提示
		 * @param str 提示内容（HTML）
		 * @param id 提示的唯一标识，重复 id 会覆盖原有内容；不传则以内容本身作为 id
		 * @returns this（可链式调用）
		 */
		addPromptSJZX(str: string, id?: string): this;

		/**
		 * 这张牌是否被标记为「连接」牌（已登记进 `_status.sxrmConnectCards`）
		 */
		isConnect(): boolean;

		/**
		 * 把这张牌登记为「连接」牌（多方同步 + 刷新相关玩家标记）
		 * @returns this（可链式调用）
		 */
		addConnect(): this;

		/**
		 * 取消这张牌的「连接」标记（多方同步 + 刷新相关玩家标记）
		 * @returns this（可链式调用）
		 */
		removeConnect(): this;

		/**
		 * 按当前手牌中的连接牌刷新相关玩家的 `_sxrm_connect` 标记
		 */
		refreshMark(): void;
	}
}
