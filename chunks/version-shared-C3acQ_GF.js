import { lib as s } from "noname";
import { whichWayUtil as o } from "./utill-DpF3UCI4.js";
import { onSetDev as V, onExtension as f } from "./hooks-BscfO9lD.js";
const m = {
  noname: {
    //最佳版本
    new: "1.11.5.1",
    //最低版本
    over: "1.11.5.1"
  },
  ext: "1.5.1"
};
class d {
  get lastCheckedExtVersion() {
    return o.config("lastCheckedExtVersion") || "";
  }
  get lastCheckedNonameVersion() {
    return o.config("lastCheckedNonameVersion") || "";
  }
  get noname() {
    return m.noname;
  }
  get ext() {
    return m.ext;
  }
  /**
   * 扩展版本是否发生变化
   */
  extVersionChanged = !1;
  /**
   * 本体版本是否发生变化
   */
  nonameVersionChanged = !1;
  /**
   * 检查版本兼容性：
   * - 仅当（当前扩展版本, 当前无名杀版本）与上次检查的组合不同时，才执行检查
   * - 兼容则静默通过；不兼容则弹窗，之后仍记录该组合为“已检查”
   */
  checkVersionCompatible() {
    const e = this.checkVersion(this.ext, this.lastCheckedExtVersion) === 0, n = this.checkVersion(s.version, this.lastCheckedNonameVersion) === 0;
    if (e && n)
      return;
    this.extVersionChanged = !e, this.nonameVersionChanged = !n;
    const i = this.checkVersion(s.version, this.noname.over), t = this.checkVersion(s.version, this.noname.new);
    this._saveLastCheckedVersions(), i < 0 ? confirm(
      `⚠️ 【驶舰之向】当前无名杀版本 (${s.version}) 低于最低要求 (${this.noname.over})！
可能导致严重错误或崩溃。
推荐升级至 ${this.noname.new}。
点击“确定”将立即禁用本扩展。`
    ) && o.disableExtension() : t !== 0 && confirm(
      `ℹ️ 【驶舰之向】当前无名杀版本 (${s.version}) 与推荐版本 (${this.noname.new}) 不一致。
部分新功能可能受限或表现异常。
点击“确定”可禁用本扩展。`
    ) && o.disableExtension();
  }
  /**
   * 保存当前版本组合为“已检查”
   * @private
   */
  _saveLastCheckedVersions() {
    o.saveConfig("lastCheckedExtVersion", this.ext), o.saveConfig("lastCheckedNonameVersion", s.version);
  }
  /**
   * 版本比较：v1 vs v2
   * @param {string} v1
   * @param {string} v2
   * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
   */
  checkVersion(e, n) {
    if (!e || !n) return e === n ? 0 : e ? 1 : -1;
    const i = e.split(".").map(Number), t = n.split(".").map(Number), a = Math.max(i.length, t.length);
    for (let r = 0; r < a; r++) {
      const h = i[r] || 0, c = t[r] || 0;
      if (h < c) return -1;
      if (h > c) return 1;
    }
    return 0;
  }
}
const l = new d();
V({
  name: "whichWayVersion_dev",
  fn: () => {
    window.whichWayVersion = l;
  },
  priority: 0
});
f({
  name: "whichWayVersion_register",
  fn: () => {
    window.whichWay.register("version", l);
  }
});
export {
  l as w
};
