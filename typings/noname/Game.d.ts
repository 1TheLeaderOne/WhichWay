import { Game } from "noname";

declare module "noname" {
	interface Game {
		/**
		 * 获得所有「连接」牌（`card.addConnect()` 登记进 `_status.sxrmConnectCards` 的牌）
		 * @returns 连接牌数组；未登记过时返回空数组
		 */
		getConnectCards(): Card[];

		/**
		 * 刷新所有存活玩家的「连接」标记：
		 * 手牌里还有连接牌的玩家挂上 `_sxrm_connect` 标记，没有的摘掉
		 */
		refreshMark(): void;

		/**
		 * 统计（存活或全部）玩家身上指定标记的数量总和
		 *
		 * @param name 要统计的标记名称
		 * @param filter 过滤需要统计的玩家，默认统计全部玩家
		 * @param includeDeath 是否包含死亡玩家，默认 false
		 * @returns 符合条件的玩家身上的标记总数
		 *
		 * @example
		 * ```js
		 * // 统计所有玩家身上的 "sha" 标记总数
		 * const totalShaMarks = game.countMark("sha");
		 * // 统计存活玩家中与当前玩家同势力的 "tao" 标记总数
		 * const sameGroupTaoMarks = game.countMark("tao", player => player.group === _status.event.player.group);
		 * ```
		 */
		countMark(name: string, filter?: (player: Player) => boolean, includeDeath?: boolean): number;

		/**
		 * 注册一个由本扩展提供的模式：写入 `lib.config.all.mode` / `lib.translate` / `lib.mode`，
		 * 并在 `lib.init` 上挂 `setMode_{name}`，同时把模式登记进 `lib.config.extensionInfo[扩展名].mode`
		 *
		 * @param name 模式名（即 `lib.mode` 的键，也是 `game.import("mode")` 加载时用的名字）
		 * @param info 模式定义对象，会作为 `game.import("mode", ...)` 的返回值；`splash` 可指定模式背景图
		 * @param info2 附加信息：`translate` 为显示名，`config` 为该模式的配置项
		 */
		addModeSJZX(name: string, info: any, info2: { translate: string; config: { [key: string]: object } }): void;

		/**
		 * 统计所有存活玩家身上指定标记的数量总和（等价于 `game.countMark(name)`）
		 * @param str 要统计的标记名称
		 */
		totalmark(str: string): number;

		/**
		 * 「数数 RD」：偏向中值的随机整数
		 * 80% 概率落在 `[mid, max]`，其余 20% 落在 `[min, mid]`（mid 为中值）
		 */
		shushuRDbet(min: number, max: number): number;

		/**
		 * 取 6 次随机数的平均值后再映射到 `[min, max]`，结果比均匀分布更集中在中值附近
		 */
		RDNbet(min: number, max: number): number;

		/**
		 * 均匀随机整数
		 * @returns `[min, max]` 闭区间内的整数
		 */
		RDbet(min: number, max: number): number;

		/**
		 * 找出数组中出现次数最多的元素
		 * @param arr 待统计的字符串数组（不会被修改，内部对其副本排序）
		 * @returns 出现次数最多的元素数组（并列时返回全部）
		 */
		mostStr(arr: string[]): string[];

		/**
		 * 统计所有存活玩家身上指定标记的数量总和（`totalmark` 的旧写法，保留兼容）
		 * @param str 要统计的标记名称
		 */
		getGlobalmark(str: string): number;
	}
}
