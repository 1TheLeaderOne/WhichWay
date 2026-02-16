import { lib, ui, get, game } from "noname";
import { onSetDev, onExtension, whichWayHooksApi } from "./hooks/index.js";
class WhichWayUtil {
  /**
   * 获取随机数
   * @param {number} [length = 16] 随机数长度
   * @returns {string} 随机数字符串
   */
  getRandomNumber(length = 16) {
    if (length <= 0) {
      return "";
    }
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      result += digits[randomIndex];
    }
    return result;
  }
  /**
   * 获取配置项
   * @param {string} key 配置项名称
   * @param {string} [ext="WhichWay"] 扩展名称
   * @returns {any} 配置项值
   */
  config(key, ext = "WhichWay") {
    return lib.config[`extension_${ext}_${key}`];
  }
  /**
   * 设置全局 CSS 变量的值。
   *
   * 此函数允许动态地修改文档根元素（`:root`）上的 CSS 变量，可用于实现主题切换、动态样式调整等功能。
   *
   * @param {string} name - 要设置的 CSS 变量名称（例如 `--main-color`）。
   * @param {string | number} value - 要赋予该 CSS 变量的值。可以是字符串形式的颜色、尺寸等，也可以是数字（会被自动转为字符串）。
   * @returns {undefined}
   */
  setCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, String(value));
  }
  /**
   * 将两个数值调整为符合指定比例的关系，并可选地设置最小值限制
   *
   * 该函数接收两个数值 a 和 b，以及一个目标比例字符串（如 "16:9"），
   * 并返回一个数组，包含调整后的两个数值，使它们符合指定的比例关系。
   * 调整原则是保持其中一个数值不变，调整另一个数值以满足比例。
   * 可以通过 minValues 参数设置返回值的最小限制。
   *
   * @param {number|string} a - 第一个数值或可转换为数值的字符串
   * @param {number|string} b - 第二个数值或可转换为数值的字符串
   * @param {string} [ratioString="16:9"] - 目标比例字符串，格式为 "A:B"，其中 A 和 B 为正数
   * @param {number|number[]|string} [minValues] - 最小值限制：
   *   - 如果是数字，则同时限制 a 和 b 的最小值
   *   - 如果是数组 [minA, minB]，则分别限制 a 和 b 的最小值
   *   - 如果是字符串 "minA|minB" 格式，则分别解析为 a 和 b 的最小值
   * @returns {number[]} 包含两个调整后数值的数组 [adjustedA, adjustedB]
   * @throws {Error} 如果比例字符串格式不正确、输入值不是有效数字或 minValues 格式不正确时抛出错误
   */
  adjustToRatio(a, b, ratioString, minValues) {
    const ratioStr = ratioString || "16:9";
    const ratioMatch = ratioStr.trim().match(/^(\d+(\.\d+)?):(\d+(\.\d+)?)$/);
    if (!ratioMatch) {
      throw new Error('Ratio must be in the format "A:B", where A and B are positive numbers (e.g., "16:9").');
    }
    const A = parseFloat(ratioMatch[1]);
    const B = parseFloat(ratioMatch[3]);
    if (isNaN(A) || isNaN(B) || A <= 0 || B <= 0) {
      throw new Error("Ratio values must be positive numbers.");
    }
    const targetRatio = A / B;
    function isNumericString(str) {
      return typeof str === "string" && /^-?\d+(\.\d+)?$/.test(str.trim());
    }
    let numA = typeof a === "string" && isNumericString(a) ? Number(a) : a;
    let numB = typeof b === "string" && isNumericString(b) ? Number(b) : b;
    if (typeof numA !== "number" || isNaN(numA) || typeof numB !== "number" || isNaN(numB)) {
      throw new Error("Both inputs must be numbers or numeric strings.");
    }
    let minA = -Infinity;
    let minB = -Infinity;
    if (minValues !== void 0) {
      if (typeof minValues === "number" && !isNaN(minValues)) {
        minA = minB = minValues;
      } else if (Array.isArray(minValues)) {
        if (minValues.length >= 1 && typeof minValues[0] === "number" && !isNaN(minValues[0])) {
          minA = minValues[0];
          minB = minValues.length >= 2 && typeof minValues[1] === "number" && !isNaN(minValues[1]) ? minValues[1] : minValues[0];
        } else {
          throw new Error("minValues array must contain valid numbers.");
        }
      } else if (typeof minValues === "string") {
        const parts = minValues.trim().split("|").map((s) => s.trim());
        const nums = parts.map((s) => isNumericString(s) ? Number(s) : NaN);
        if (nums.every((n) => !isNaN(n))) {
          if (nums.length === 1) {
            minA = minB = nums[0];
          } else {
            minA = nums[0];
            minB = nums[1];
          }
        } else {
          throw new Error('minValues string must be in the format "minA|minB" or "value", with numeric values.');
        }
      } else {
        throw new Error('minValues must be a number, an array [a, b], or a string "a|b".');
      }
    }
    const clampedA = Math.max(numA, minA);
    const clampedB = Math.max(numB, minB);
    const currentRatio = clampedA / clampedB;
    const tolerance = 1e-6;
    let resultA, resultB;
    if (Math.abs(currentRatio - targetRatio) < tolerance) {
      resultA = clampedA;
      resultB = clampedB;
    } else if (currentRatio > targetRatio) {
      resultA = clampedA;
      resultB = clampedA / targetRatio;
    } else {
      resultA = clampedB * targetRatio;
      resultB = clampedB;
    }
    return [resultA, resultB];
  }
  /**
   * 将一个正数数组转换为保持比例的整数数组。
   *
   * 该函数首先将数组中的数值统一放大，使其全部变为整数（根据小数点后的最大位数进行放大），
   * 然后通过计算最大公约数（GCD），将所有数缩小到最简整数比例。
   *
   * @param {number[]} arr - 需要转换的正数数组，数组中的所有值必须大于 0。
   * @returns {number[]} 返回一个整数数组，表示与原数组保持比例的最简整数比。
   *
   * @throws {Error} 如果输入不是一个数组，或者数组中包含非正数（包括 0 或负数），则抛出错误。
   */
  scaleToIntegerRatio(arr) {
    if (!Array.isArray(arr) || arr.some((x) => x <= 0)) {
      throw new Error("数组必须只包含正数");
    }
    const maxDecimalPlaces = Math.max(
      ...arr.map((x) => {
        const parts = x.toString().split(".");
        return parts.length > 1 ? parts[1].length : 0;
      })
    );
    const factor = Math.pow(10, maxDecimalPlaces);
    let intArr = arr.map((x) => Math.round(x * factor));
    const gcd = (a, b) => {
      while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    };
    const overallGcd = intArr.reduce((acc, val) => gcd(acc, val), intArr[0]);
    return intArr.map((x) => x / overallGcd);
  }
  /**
   * 将字符串中的颜色代码转为 HTML 标签，并用 `<span>` 包裹。
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串
   */
  colorize = function(str) {
    const colorMap = {
      r: "red",
      g: "green",
      b: "blue",
      y: "yellow",
      p: "purple",
      o: "orange",
      s: "#696969"
    };
    return str.replace(/#([a-zA-Z])([^#]*)#/g, (match, letter, content) => {
      const color = colorMap[letter.toLowerCase()];
      if (color) {
        return `<span style="color: ${color};">${content}</span>`;
      } else {
        return content;
      }
    });
  };
  /**
   * 切换背景
   */
  setBgI() {
    if (lib.config.ChangeBgI_mrfz) var bgI = lib.config.ChangeBgI_mrfz;
    if (bgI && typeof bgI === "string" && bgI != "default") {
      ui.background.setBackgroundImage(window.whichWay.file.compilePath("img:background/") + bgI + ".jpg");
    } else {
      ui.background.setBackgroundImage("image/background/" + lib.config.image_background + ".jpg");
    }
  }
  /**
   * 在两个平行数组之间进行双向查找
   * @param {Array} arr1 - 第一个数组（如 index / whichWay）
   * @param {Array} arr2 - 第二个数组（如 name / arknight）
   * @param {string} query - 要查找的字符串
   * @returns {*} 找到的对应值，否则 undefined
   */
  bidirectionalLookup(arr1, arr2, query) {
    const i = arr1.indexOf(query);
    if (i !== -1) return arr2[i];
    const j = arr2.indexOf(query);
    if (j !== -1) return arr1[j];
    return void 0;
  }
  /**
   * 获取角色的WhichWay配置
   * @param {string | Player} name 角色名或角色对象
   * @returns {WhichWayCharConfig | undefined} 角色的WhichWay配置
   */
  getCharExtConfig(name) {
    const char = typeof name === "string" ? get.character(name) : get.character(name.name);
    if (!char || !char.whichWay) return;
    return char.whichWay;
  }
  /**
   * 在指定 DOM 元素上切换类名：如果包含 classA，则替换为 classB；如果包含 classB，则替换为 classA。
   *
   * @param {Element|Array<Element>} element - 要操作的 DOM 元素，或元素组成的数组
   * @param {string} classA - 第一个类名（原始类）
   * @param {string} classB - 第二个类名（目标类）
   *
   * @example
   * toggleClassBetween(element, 'active', 'inactive');
   */
  toggleClass(element, classA, classB) {
    if (!element) throw new Error("element is null");
    const toggle = (ele) => {
      if (!ele.classList) return;
      const hasA = ele.classList.contains(classA);
      const hasB = ele.classList.contains(classB);
      if (hasA) {
        ele.classList.remove(classA);
        ele.classList.add(classB);
      } else if (hasB) {
        ele.classList.remove(classB);
        ele.classList.add(classA);
      }
    };
    if (Array.isArray(element)) {
      element.forEach((ele) => toggle(ele));
    } else {
      toggle(element);
    }
  }
  /**
   * 保存配置项
   * @param {string} key 配置项名称
   * @param {any} value 配置项值
   * @param {string | null} [ext="WhichWay"] 扩展名称,不想保存为扩展配置项时传入空字符串或非字符串
   */
  saveConfig(key, value, ext = "WhichWay") {
    if (typeof ext === "string" && ext.length > 0) {
      lib.config[`extension_${ext}_${key}`] = value;
      game.saveExtensionConfig(ext, key, value);
    } else {
      lib.config[key] = value;
      game.saveConfig(key, value);
    }
  }
  /**
   * 关闭扩展
   * @param {string} [ext="WhichWay"] 扩展名称,不填则关闭驶舰之向扩展
   */
  disableExtension(ext = "WhichWay") {
    lib.config[`extension_${ext}_enable`] = false;
    this.saveConfig("enable", false, ext);
  }
  /**
   * 是否是开发者模式,如果是viteSever,则默认是开发者模式
   * @returns {boolean}
   */
  isDeveloperMode() {
    if (this.config("devMode") !== true && this.isViteDevServer() && window.whichWaySave.autoEnableDevTip === false) {
      console.log("[WhichWayUtil] 由于是在viteSever环境下,开发者模式已自动开启");
      window.whichWaySave.autoEnableDevTip = true;
    }
    return this.config("devMode") || this.isViteDevServer();
  }
  /**
   * 是否是ViteServer开发环境
   * @returns {boolean}
   */
  isViteDevServer = () => document.querySelectorAll('script[type="module"][src*="/@vite/"]').length > 0;
  /**
   * 开启开发者模式相关设置,默认会自动检查是否开启了开发者模式,如果没开启则不会生效
   * @param {boolean} [forceEnable=false] 是否强制配置开发者模式设置
   *
   */
  async developerSet(forceEnable = false) {
    if (!this.isDeveloperMode() && !forceEnable) return;
    window.noname_shijianInterfaces?.showDebugButton?.();
    lib.cheat.i();
    await whichWayHooksApi.setDev();
  }
  /**
   * 执行一个函数并测量其加载/执行时间
   * @param {Function} fn - 要执行的函数（推荐使用箭头函数以避免 this 问题）
   * @param {boolean} [logTime=false] - 是否在控制台打印执行时间
   * @returns {Promise<{result: any, duration: number}>}
   */
  async measureExecutionTime(fn, logTime = false) {
    if (typeof fn !== "function") {
      throw new TypeError("First argument must be a function.");
    }
    if (this.isDeveloperMode()) {
      try {
        const fnStr = Function.prototype.toString.call(fn).trim();
        if (fnStr.startsWith("function") || fnStr.startsWith("async function")) {
          console.warn("[measureExecutionTime] Detected a regular function. Consider using an arrow function to avoid unexpected `this` binding.");
        }
      } catch (e) {
      }
    }
    const start = Date.now();
    const result = await fn();
    const end = Date.now();
    const duration = end - start;
    if (logTime) {
      console.log(`Function executed in ${duration} ms`);
    }
    return { result, duration };
  }
}
const whichWayUtil = new WhichWayUtil();
onSetDev({
  name: "WhichWayUtil_dev",
  fn: () => {
    window.whichWayUtil = whichWayUtil;
  },
  priority: 1e4
});
onExtension({
  name: "whichWayUtil_register",
  fn: () => {
    window.whichWay.register("util", whichWayUtil);
  }
});
export {
  whichWayUtil
};
//# sourceMappingURL=utill.js.map
