class ArrayExt extends Array {
  /**
   * 判断两个数组是否相等
   * @param { Array } arr
   * @returns { boolean } 
   */
  isEquip(arr) {
    if (this.length !== arr.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== arr[i]) return false;
    }
    return true;
  }
  /**
   * 异步串行遍历数组，对每个元素执行 async 回调（一个接一个地 await）。
   * @param {(value: any, index: number, array: any[]) => Promise<void>} callback - 异步回调函数
   * @param {any} [thisArg] - 回调中 `this` 的值（可选）
   * @returns {Promise<void>}
   */
  async asyncForEach(callback, thisArg) {
    for (let i = 0; i < this.length; i++) {
      await callback.call(thisArg, this[i], i, this);
    }
  }
  /**
   * @deprecated
   */
  add2() {
    for (var i = 0; i < arguments.length; i++) {
      this.push(arguments[i]);
    }
    return this;
  }
  /**
   * @deprecated
   */
  randomGet2(n) {
    return this.randomGets(n);
  }
  isSubset(superset) {
    return this.every((element) => superset.includes(element));
  }
  /**
   * 在数组中插入元素
   *
   * @param {*} target - 目标元素或索引位置
   * @param {*} element - 要插入的元素
   * @param {boolean} [isAfter=true] - 是否插入到目标元素之后，默认为true
   * @param {boolean} [fix=true] - 是否直接修改原数组，默认为true
   * @param {boolean} [byIndex=false] - 是否按索引查找目标位置，默认为false
   * @returns {Array} 返回修改后的数组或新数组
   *
   * @description
   * 该方法允许在数组的指定位置插入元素，支持按值查找或按索引定位。
   * 当byIndex为true时，target被视为索引；否则target被视为要查找的元素值。
   * 支持负数索引，-1表示最后一个元素，-2表示倒数第二个元素，以此类推。
   *
   * @example
   * // 按值查找插入
   * let arr = [1, 2, 4];
   * arr.insert(2, 3); // 在元素2之后插入3，结果为[1, 2, 3, 4]
   *
   * @example
   * // 按索引插入
   * let arr = [1, 2, 4];
   * arr.insert(1, 3, true, true, true); // 在索引1之后插入3，结果为[1, 2, 3, 4]
   *
   * @example
   * // 在开头插入（不修改原数组）
   * let arr = [2, 3, 4];
   * let newArr = arr.insert(2, 1, false, false); // 在元素2之前插入1，返回新数组[1, 2, 3, 4]
   *
   * @example
   * // 使用负数索引
   * let arr = [1, 2, 4];
   * arr.insert(-1, 3, true, true, true); // 在倒数第一个元素之后插入3，结果为[1, 2, 4, 3]
   */
  insert(target, element, isAfter = true, fix = true, byIndex = false) {
    let newArray = fix ? this : deepClone(this);
    if (byIndex) {
      if (typeof target === "number" && target >= -newArray.length - 1 && target <= newArray.length) {
        let index = target < 0 ? newArray.length + target + 1 : target;
        let insertIndex = isAfter ? index + 1 : index;
        newArray.splice(insertIndex, 0, element);
      }
    } else {
      let index = newArray.indexOf(target);
      if (index !== -1) {
        let insertIndex = isAfter ? index + 1 : index;
        newArray.splice(insertIndex, 0, element);
      }
    }
    return fix ? this : newArray;
    function deepClone(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof Array) {
        return obj.map((item) => deepClone(item));
      }
      if (typeof obj === "object") {
        const clonedObj = {};
        for (let key in obj) {
          if (obj[key]) {
            clonedObj[key] = deepClone(obj[key]);
          }
        }
        return clonedObj;
      }
    }
  }
}
export {
  ArrayExt
};
//# sourceMappingURL=ArrayExt.js.map
