import { lib } from "noname";
import { whichWayUtil } from "./utill.js";
import { onSetDev, onExtension } from "./hooks/index.js";
const whichWayVersionInfo = {
  noname: {
    //最佳版本
    new: "1.11.1",
    //最低版本
    over: "1.11.0"
  },
  ext: "1.1.2"
};
class WhichWayVersion {
  get lastCheckedExtVersion() {
    return whichWayUtil.config("lastCheckedExtVersion") || "";
  }
  get lastCheckedNonameVersion() {
    return whichWayUtil.config("lastCheckedNonameVersion") || "";
  }
  get noname() {
    return whichWayVersionInfo.noname;
  }
  get ext() {
    return whichWayVersionInfo.ext;
  }
  /**
   * 扩展版本是否发生变化
   */
  extVersionChanged = false;
  /**
   * 本体版本是否发生变化
   */
  nonameVersionChanged = false;
  /**
   * 检查版本兼容性：
   * - 仅当（当前扩展版本, 当前无名杀版本）与上次检查的组合不同时，才执行检查
   * - 兼容则静默通过；不兼容则弹窗，之后仍记录该组合为“已检查”
   */
  checkVersionCompatible() {
    const extUnchanged = this.checkVersion(this.ext, this.lastCheckedExtVersion) === 0;
    const nonameUnchanged = this.checkVersion(lib.version, this.lastCheckedNonameVersion) === 0;
    if (extUnchanged && nonameUnchanged) {
      return;
    } else {
      this.extVersionChanged = !extUnchanged;
      this.nonameVersionChanged = !nonameUnchanged;
    }
    const consqOver = this.checkVersion(lib.version, this.noname.over);
    const consqNew = this.checkVersion(lib.version, this.noname.new);
    this._saveLastCheckedVersions();
    if (consqOver < 0) {
      const close = confirm(
        `⚠️ 【驶舰之向】当前无名杀版本 (${lib.version}) 低于最低要求 (${this.noname.over})！
可能导致严重错误或崩溃。
推荐升级至 ${this.noname.new}。
点击“确定”将立即禁用本扩展。`
      );
      if (close) {
        whichWayUtil.disableExtension();
      }
    } else if (consqNew !== 0) {
      const close = confirm(
        `ℹ️ 【驶舰之向】当前无名杀版本 (${lib.version}) 与推荐版本 (${this.noname.new}) 不一致。
部分新功能可能受限或表现异常。
点击“确定”可禁用本扩展。`
      );
      if (close) {
        whichWayUtil.disableExtension();
      }
    }
  }
  /**
   * 保存当前版本组合为“已检查”
   * @private
   */
  _saveLastCheckedVersions() {
    whichWayUtil.saveConfig("lastCheckedExtVersion", this.ext);
    whichWayUtil.saveConfig("lastCheckedNonameVersion", lib.version);
  }
  /**
   * 版本比较：v1 vs v2
   * @param {string} v1
   * @param {string} v2
   * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
   */
  checkVersion(v1, v2) {
    if (!v1 || !v2) return v1 === v2 ? 0 : v1 ? 1 : -1;
    const a = v1.split(".").map(Number);
    const b = v2.split(".").map(Number);
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const x = a[i] || 0;
      const y = b[i] || 0;
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return 0;
  }
}
const whichWayVersion = new WhichWayVersion();
onSetDev({
  name: "whichWayVersion_dev",
  fn: () => {
    window.whichWayVersion = whichWayVersion;
  },
  priority: 0
});
onExtension({
  name: "whichWayVersion_register",
  fn: () => {
    window.whichWay.register("version", whichWayVersion);
  }
});
export {
  whichWayVersion
};
//# sourceMappingURL=version.js.map
