import { lib as d, ui as N, get as A, game as M } from "noname";
import { whichWayHooksApi as D, onSetDev as B, onExtension as C } from "./hooks-BscfO9lD.js";
class L {
  /**
   * 工具函数组，提供常见的数值比较和动态最值判断。
   * @typedef {Object} Tools
   * @property {function(*, number): boolean} gt - 判断元素是否大于指定值。
   * @property {function(*, number): boolean} lt - 判断元素是否小于指定值。
   * @property {function(*, *): boolean} eq - 判断元素是否严格等于指定值。
   * @property {function(*, number): boolean} gte - 判断元素是否大于或等于指定值。
   * @property {function(*, number): boolean} lte - 判断元素是否小于或等于指定值。
   * @property {function(*, number, number): boolean} between - 判断元素是否在闭区间 [a, b] 内。
   * @property {function(*, Function=): boolean} isMax - 判断元素（或按 selector 提取的值）是否等于数组中的最大值。
   * @property {function(*, Function=): boolean} isMin - 判断元素（或按 selector 提取的值）是否等于数组中的最小值。
   */
  /**
   * 对数组进行筛选，回调中可直接使用工具函数进行条件判断。
   *
   * @param {Array} arr - 待筛选的数组。
   * @param {function(*, Tools): boolean} fn - 回调函数，参数为当前元素 `item` 和工具对象 `tools`。
   * @returns {Array} 筛选后组成的新数组。
   *
   * @example
   * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
   *
   * // 基础比较
   * const gt4 = filterArray(numbers, (item, tools) => tools.gt(item, 4));
   * console.log(gt4); // [5, 9, 6]
   *
   * // 筛选最大值（数字直接比较）
   * const maxItems = filterArray(numbers, (item, tools) => tools.isMax(item));
   * console.log(maxItems); // [9]
   *
   * // 对象数组按属性筛选最大值
   * const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 30 }];
   * const oldest = filterArray(people, (item, tools) => tools.isMax(item, p => p.age));
   * console.log(oldest); // [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }]（两个都是30）
   *
   * // 组合条件
   * const between3and6 = filterArray(numbers, (item, tools) =>
   *   tools.gte(item, 3) && tools.lte(item, 6)
   * );
   * console.log(between3and6); // [3, 4, 5, 6]
   */
  filterArray(e, n) {
    if (!Array.isArray(e))
      throw new TypeError("第一个参数必须是数组");
    if (typeof n != "function")
      throw new TypeError("第二个参数必须是函数");
    const i = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), s = {
      // 基础比较（直接比较元素本身）
      gt: (o, r) => o > r,
      lt: (o, r) => o < r,
      eq: (o, r) => o === r,
      gte: (o, r) => o >= r,
      lte: (o, r) => o <= r,
      between: (o, r, a) => o >= r && o <= a,
      /**
       * 判断当前元素（或通过 selector 提取的值）是否等于数组中的最大值。
       * @param {*} item - 当前元素。
       * @param {Function} [selector] - 可选的取值函数，用于提取比较值，默认为恒等函数。
       * @returns {boolean}
       */
      isMax: (o, r) => {
        const a = typeof r == "function" ? r : (f) => f, c = r || "default";
        if (!i.has(c))
          if (e.length === 0)
            i.set(c, void 0);
          else {
            const f = e.reduce((l, h) => {
              const u = a(h);
              return u > l ? u : l;
            }, a(e[0]));
            i.set(c, f);
          }
        const g = i.get(c);
        return a(o) === g;
      },
      /**
       * 判断当前元素（或通过 selector 提取的值）是否等于数组中的最小值。
       * @param {*} item - 当前元素。
       * @param {Function} [selector] - 可选的取值函数，用于提取比较值，默认为恒等函数。
       * @returns {boolean}
       */
      isMin: (o, r) => {
        const a = typeof r == "function" ? r : (f) => f, c = r || "default";
        if (!t.has(c))
          if (e.length === 0)
            t.set(c, void 0);
          else {
            const f = e.reduce((l, h) => {
              const u = a(h);
              return u < l ? u : l;
            }, a(e[0]));
            t.set(c, f);
          }
        const g = t.get(c);
        return a(o) === g;
      }
    };
    return e.filter((o) => n(o, s));
  }
  /**
   * 获取随机数
   * @param {number} [length = 16] 随机数长度
   * @returns {string} 随机数字符串
   */
  getRandomNumber(e = 16) {
    if (e <= 0)
      return "";
    const n = "0123456789";
    let i = "";
    for (let t = 0; t < e; t++) {
      const s = Math.floor(Math.random() * n.length);
      i += n[s];
    }
    return i;
  }
  /**
   * 获取配置项
   * @param {string} key 配置项名称
   * @param {string} [ext="WhichWay"] 扩展名称
   * @returns {any} 配置项值
   */
  config(e, n = "WhichWay") {
    return d.config[`extension_${n}_${e}`];
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
  setCSSVariable(e, n) {
    document.documentElement.style.setProperty(e, String(n));
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
  adjustToRatio(e, n, i, t) {
    const o = (i || "16:9").trim().match(/^(\d+(\.\d+)?):(\d+(\.\d+)?)$/);
    if (!o)
      throw new Error('Ratio must be in the format "A:B", where A and B are positive numbers (e.g., "16:9").');
    const r = parseFloat(o[1]), a = parseFloat(o[3]);
    if (isNaN(r) || isNaN(a) || r <= 0 || a <= 0)
      throw new Error("Ratio values must be positive numbers.");
    const c = r / a;
    function g(E) {
      return typeof E == "string" && /^-?\d+(\.\d+)?$/.test(E.trim());
    }
    let f = typeof e == "string" && g(e) ? Number(e) : e, l = typeof n == "string" && g(n) ? Number(n) : n;
    if (typeof f != "number" || isNaN(f) || typeof l != "number" || isNaN(l))
      throw new Error("Both inputs must be numbers or numeric strings.");
    let h = -1 / 0, u = -1 / 0;
    if (t !== void 0)
      if (typeof t == "number" && !isNaN(t))
        h = u = t;
      else if (Array.isArray(t))
        if (t.length >= 1 && typeof t[0] == "number" && !isNaN(t[0]))
          h = t[0], u = t.length >= 2 && typeof t[1] == "number" && !isNaN(t[1]) ? t[1] : t[0];
        else
          throw new Error("minValues array must contain valid numbers.");
      else if (typeof t == "string") {
        const p = t.trim().split("|").map((m) => m.trim()).map((m) => g(m) ? Number(m) : NaN);
        if (p.every((m) => !isNaN(m)))
          p.length === 1 ? h = u = p[0] : (h = p[0], u = p[1]);
        else
          throw new Error('minValues string must be in the format "minA|minB" or "value", with numeric values.');
      } else
        throw new Error('minValues must be a number, an array [a, b], or a string "a|b".');
    const y = Math.max(f, h), w = Math.max(l, u), W = y / w, S = 1e-6;
    let v, b;
    return Math.abs(W - c) < S ? (v = y, b = w) : W > c ? (v = y, b = y / c) : (v = w * c, b = w), [v, b];
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
  scaleToIntegerRatio(e) {
    if (!Array.isArray(e) || e.some((r) => r <= 0))
      throw new Error("数组必须只包含正数");
    const n = Math.max(
      ...e.map((r) => {
        const a = r.toString().split(".");
        return a.length > 1 ? a[1].length : 0;
      })
    ), i = Math.pow(10, n);
    let t = e.map((r) => Math.round(r * i));
    const s = (r, a) => {
      for (; a !== 0; ) {
        let c = a;
        a = r % a, r = c;
      }
      return r;
    }, o = t.reduce((r, a) => s(r, a), t[0]);
    return t.map((r) => r / o);
  }
  /**
   * 将字符串中的颜色代码转为 HTML 标签，并用 `<span>` 包裹。
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串
   */
  colorize = function(e) {
    const n = {
      r: "red",
      g: "green",
      b: "blue",
      y: "yellow",
      p: "purple",
      o: "orange",
      s: "#696969"
    };
    return e.replace(/#([a-zA-Z])([^#]*)#/g, (i, t, s) => {
      const o = n[t.toLowerCase()];
      return o ? `<span style="color: ${o};">${s}</span>` : s;
    });
  };
  /**
   * 将百分比转化成小数
   * @param {string} zoomStr
   *
   * @returns {number}
   */
  parseZoomFactor(e) {
    if (!e) return 1;
    if (typeof e == "number") return e;
    const n = e.toString().trim().match(/^([\d.]+)%?$/);
    return n ? n[0].includes("%") ? parseFloat(n[1]) / 100 : parseFloat(n[1]) : 1;
  }
  /**
   * 切换背景
   */
  setBgI() {
    if (d.config.ChangeBgI_mrfz) var e = d.config.ChangeBgI_mrfz;
    e && typeof e == "string" && e != "default" ? N.background.setBackgroundImage(window.whichWay.file.compilePath("img:background/") + e + ".jpg") : N.background.setBackgroundImage("image/background/" + d.config.image_background + ".jpg");
  }
  /**
   * 在两个平行数组之间进行双向查找
   * @param {Array} arr1 - 第一个数组（如 index / whichWay）
   * @param {Array} arr2 - 第二个数组（如 name / arknight）
   * @param {string} query - 要查找的字符串
   * @returns {*} 找到的对应值，否则 undefined
   */
  bidirectionalLookup(e, n, i) {
    const t = e.indexOf(i);
    if (t !== -1) return n[t];
    const s = n.indexOf(i);
    if (s !== -1) return e[s];
  }
  /**
   * 获取角色的WhichWay配置
   * @param {string | Player} name 角色名或角色对象
   * @returns {WhichWayCharConfig | undefined} 角色的WhichWay配置
   */
  getCharExtConfig(e) {
    const n = typeof e == "string" ? A.character(e) : A.character(e.name);
    if (!(!n || !n.whichWay))
      return n.whichWay;
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
  toggleClass(e, n, i) {
    if (!e) throw new Error("element is null");
    const t = (s) => {
      if (!s.classList) return;
      const o = s.classList.contains(n), r = s.classList.contains(i);
      o ? (s.classList.remove(n), s.classList.add(i)) : r && (s.classList.remove(i), s.classList.add(n));
    };
    Array.isArray(e) ? e.forEach((s) => t(s)) : t(e);
  }
  /**
   * 保存配置项
   * @param {string} key 配置项名称
   * @param {any} value 配置项值
   * @param {string | null} [ext="WhichWay"] 扩展名称,不想保存为扩展配置项时传入空字符串或非字符串
   */
  saveConfig(e, n, i = "WhichWay") {
    typeof i == "string" && i.length > 0 ? (d.config[`extension_${i}_${e}`] = n, M.saveExtensionConfig(i, e, n)) : (d.config[e] = n, M.saveConfig(e, n));
  }
  /**
   * 关闭扩展
   * @param {string} [ext="WhichWay"] 扩展名称,不填则关闭驶舰之向扩展
   */
  disableExtension(e = "WhichWay") {
    d.config[`extension_${e}_enable`] = !1, this.saveConfig("enable", !1, e);
  }
  /**
   * 是否是开发者模式,如果是viteSever,则默认是开发者模式
   * @returns {boolean}
   */
  isDeveloperMode() {
    return this.config("devMode") !== !0 && this.isViteDevServer() && window.whichWaySave.autoEnableDevTip === !1 && (console.log("[WhichWayUtil] 由于是在viteSever环境下,开发者模式已自动开启"), window.whichWaySave.autoEnableDevTip = !0), this.config("devMode") || this.isViteDevServer();
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
  async developerSet(e = !1) {
    !this.isDeveloperMode() && !e || (window.noname_shijianInterfaces?.showDebugButton?.(), d.cheat.i(), await D.setDev());
  }
  /**
   * 执行一个函数并测量其加载/执行时间
   * @param {Function} fn - 要执行的函数（推荐使用箭头函数以避免 this 问题）
   * @param {boolean} [logTime=false] - 是否在控制台打印执行时间
   * @returns {Promise<{result: any, duration: number}>}
   */
  async measureExecutionTime(e, n = !1) {
    if (typeof e != "function")
      throw new TypeError("First argument must be a function.");
    if (this.isDeveloperMode())
      try {
        const r = Function.prototype.toString.call(e).trim();
        (r.startsWith("function") || r.startsWith("async function")) && console.warn("[measureExecutionTime] Detected a regular function. Consider using an arrow function to avoid unexpected `this` binding.");
      } catch {
      }
    const i = Date.now(), t = await e(), o = Date.now() - i;
    return n && console.log(`Function executed in ${o} ms`), { result: t, duration: o };
  }
  /**
   * 播放音频
   * @param {string} url - 音频文件的URL
   * @param {boolean} [compilePath=true] - 是否编译路径
   */
  async playSound(e, n = !0) {
    if (typeof e != "string") {
      console.error("url must be a string");
      return;
    }
    e = n ? window.whichWay.file.compilePath(e) : e;
    const i = new Audio(e), t = () => {
      i.remove(), i.removeEventListener("ended", t), i.removeEventListener("error", t);
    };
    i.addEventListener("ended", t), i.addEventListener("error", t);
    const s = i.play();
    s !== void 0 && s.catch(t);
  }
}
const x = new L();
B({
  name: "WhichWayUtil_dev",
  fn: () => {
    window.whichWayUtil = x;
  },
  priority: 1e4
});
C({
  name: "whichWayUtil_register",
  fn: () => {
    window.whichWay.register("util", x);
  }
});
export {
  x as whichWayUtil
};
