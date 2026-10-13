import { onSetDev } from "../hooks/index.js";

class MathUtils {
	/**
	 * 计算数值数组的算术平均数
	 * @param values - 数值数组，不能为空且所有元素必须为有限数字
	 * @returns 平均数
	 * @throws {Error} 当输入为空数组或包含非数字/非有限值时抛出错误
	 */
	mean(values: number[]): number {
		if (values.length === 0) {
			throw new Error("Cannot compute mean of an empty array");
		}

		for (const val of values) {
			if (typeof val !== "number" || !isFinite(val)) {
				throw new Error(`Invalid number in array: ${val}`);
			}
		}

		const sum = values.reduce((acc, val) => acc + val, 0);
		return sum / values.length;
	}

	/**
	 * 计算数值数组的标准差（样本标准差，分母为 n-1）
	 * @param values - 数值数组，长度必须 ≥ 2
	 * @param isPopulation - 是否计算总体标准差（默认 false，即样本标准差）
	 * @returns 标准差
	 * @throws {Error} 当数组长度不足或包含无效数值时抛出错误
	 */
	std(values: number[], isPopulation: boolean = false): number {
		if (values.length === 0) {
			throw new Error("Cannot compute standard deviation of an empty array");
		}

		if (!isPopulation && values.length < 2) {
			throw new Error("Sample standard deviation requires at least 2 values");
		}

		for (const val of values) {
			if (typeof val !== "number" || !isFinite(val)) {
				throw new Error(`Invalid number in array: ${val}`);
			}
		}

		const mean = this.mean(values);
		const squaredDiffs = values.map(x => (x - mean) ** 2);
		const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (isPopulation ? values.length : values.length - 1);

		return Math.sqrt(variance);
	}
}

export const whichWayMath = new MathUtils();

onSetDev({
    name:"whichWayMath_dev",
    //@ts-ignore
    fn:()=>window.whichWayMath = whichWayMath
})

window.whichWay.register("math", whichWayMath);