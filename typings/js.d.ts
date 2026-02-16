interface HTMLDivElement {
	/**
	 * 当 HTMLDivElement 被从 DOM 中移除时触发回调
	 * @param callback - 元素被移除时执行的回调函数
	 * @returns 一个用于取消监听的清理函数
	 */
	onRemoved(callback: () => void): () => void;
}

interface Array<T> {
	/**
	 * 判断两个数组是否相等
	 * @param { Array } arr
	 * @returns { boolean } 
	 */
	isEquip(arr:Array<any>):boolean;

	/**
	 * @description
	 * 异步串行遍历数组，对每个元素执行 async 回调（一个接一个地 await）。
	 * @param {(value: T, index: number, array: T[]) => Promise<void>} callback - 异步回调函数
	 * @param {any} [thisArg] - 回调中 `this` 的值（可选）
	 * @returns {Promise<void>}
	 */
	asyncForEach(callback,thisArg):Promise<void>;
	
	/**
	 * 在数组中插入元素
	 *
	 * @param target - 目标元素或索引位置
	 * @param element - 要插入的元素
	 * @param isAfter - 是否插入到目标元素之后，默认为 true
	 * @param fix - 是否直接修改原数组，默认为 true
	 * @param byIndex - 是否按索引查找目标位置，默认为 false
	 * @returns 返回修改后的数组或新数组
	 *
	 * @description
	 * 该方法允许在数组的指定位置插入元素，支持按值查找或按索引定位。
	 * 当 byIndex 为 true 时，target 被视为索引；否则 target 被视为要查找的元素值。
	 * 支持负数索引，-1 表示最后一个元素，-2 表示倒数第二个元素，以此类推。
	 */
	insert(target: number | T, element: T, isAfter?: boolean, fix?: boolean, byIndex?: boolean): T[];

	/**@deprecated */
	add2(): Array<any>;

	/**
	 * 是否是superset的子集
	 * @param { Array } superset
	 */
	isSubset(superset): boolean;
}

interface ObjectConstructor {
	/**
	 * 检查对象是否为空（无自身可枚举属性）
	 * @param { any } obj 待检查对象
	 * @returns 若为 null/undefined/无键对象，返回 true；否则 false
	 */
	isEmpty(obj: any):boolean
}