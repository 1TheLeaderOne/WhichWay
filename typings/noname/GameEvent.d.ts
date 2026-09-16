import { GameEvent } from "@/library/element";

declare module "@/library/element" {
	interface GameEvent {
        gaintag_map?: Record<string, Array<string>>;
        effectCount?:number;

		/**
		 * 是否是第一个目标，通常用在“指定目标”场景中使用
		 */
		isFirstTarget?:boolean;

		/**
		 * 向下（子事件）查找第一个满足条件的子事件
		 *
		 * @param filter 过滤函数，或事件名（字符串，等价于 `e => e.name === filter`）
		 * @param step 最大向下查找层数，默认 20
		 * @returns 命中的子事件；**没有命中时返回空对象 `{}`**，所以取属性前请判空，
		 * 例如 `let evt = event.getChildren("recover"); return evt?.source === player;`
		 */
		getChildren(filter: string | ((event: GameEvent) => boolean), step?: number): Partial<GameEvent>;
    }
}