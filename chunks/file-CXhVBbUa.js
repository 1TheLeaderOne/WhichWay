import { lib as g, game as n } from "noname";
import { onSetDev as p } from "./hooks-BscfO9lD.js";
import { whichWayToast as u } from "./toast-BKImUKDM.js";
import { whichWayUtil as f } from "./utill-DpF3UCI4.js";
class F {
  /**
   * 驶舰之向扩展根目录
   */
  extDir = `${g.assetURL}extension/WhichWay/`;
  /**
   * 路径映射
   * @type {Record<string,string>}
   */
  pathShceme = {
    "noname:": "",
    "video:": `${this.extDir}vedio/`,
    "src:": `${this.extDir}src/`,
    "bg:": `${this.extDir}image/background/`,
    "dec:": `${this.extDir}image/decoration/`,
    "json:": `${this.extDir}json/`,
    "audio:": `${this.extDir}audio/`,
    "css:": `${this.extDir}css/`,
    "skin:": `${this.extDir}image/skin/`,
    "ui:": `${this.extDir}image/ui/`,
    "img:": `${this.extDir}image/`,
    "dyc:": `${this.extDir}dynamicSkin/illust/`,
    "mod:": `${this.extDir}image/modules/`,
    "test:": `${this.extDir}test/`
  };
  /**
   * 编译路径
   * @param { string } path 路径
   *
   * @returns { string }
   */
  compilePath(e) {
    for (let i in this.pathShceme)
      e.startsWith(i) && (e = e.replace(i, this.pathShceme[i]));
    return e;
  }
  /**
   * 获取是什么平台
   * @returns {"browser" | "cordova" | "node"}
   */
  detectPlatform() {
    let e = "browser";
    return window !== void 0 && window.cordova ? e = "cordova" : typeof process < "u" && process.versions && process.versions.node && (e = "node"), e;
  }
  /**
   * 复制文件
   * @param {string} source - 源文件完整路径（含文件名）
   * @param {string} target - 目标位置（可以是目录路径或完整文件路径）
   * @returns {Promise<void>}
   */
  async copyFile(e, i) {
    e = this.compilePath(e), i = this.compilePath(i);
    const t = await n.promises.readFile(e);
    let s, l;
    i.endsWith("/") ? (s = i, l = e.slice(e.lastIndexOf("/") + 1)) : (s = i.slice(0, i.lastIndexOf("/") + 1), l = i.slice(i.lastIndexOf("/") + 1)), await n.promises.writeFile(t, s, l);
  }
  /**
   * 下载文件
   * 成功后返回 true，失败返回 false
   * @param {string} url
   * @param {string} dir - 保存目录（不包含文件名）
   * @param {string} [filename]
   * @param {function({ loaded: number, total: number|null, percent: number|null }): void} [onprogress]
   *
   * @returns {Promise<boolean>}
   */
  async download(e, i, t, s) {
    if (typeof n.download != "function")
      return console.warn(`[WhichWayFile] Download function ( game.download ) not available in current environment (${this.detectPlatform()}) .`), !1;
    if (i = this.compilePath(i), !t) {
      const r = e.lastIndexOf("/");
      if (r === -1) throw new Error("Invalid URL");
      t = e.slice(r + 1).split("?")[0];
    }
    const l = i + t, a = this.detectPlatform() === "cordova";
    let c = null;
    if (!a && s)
      try {
        c = await this.getFileSize(e);
      } catch (r) {
        console.warn("Failed to get file size:", r), c = null;
      }
    const m = s ? (r, d) => {
      const h = a ? d : c, o = h ? Math.min(99, Math.floor(r / h * 100)) : null;
      s({ loaded: r, total: h, percent: o });
    } : void 0;
    try {
      return new Promise((r, d) => {
        n.download(
          e,
          l,
          () => r(!0),
          (h) => {
            console.warn(`Failed to download "${e}": ${h.message}`), d(!1);
          },
          void 0,
          // dev
          m
        );
      });
    } catch (r) {
      return console.warn(`Failed to download "${e}": ${r.message}`), !1;
    }
  }
  /**
   * 生成一个下载的进度提示函数（用于donwload的onprocess参数）
   * @param {Object} info 下载信息
   * @param {string} file 文件名
   * @param {string} toastID 进度提示toast的ID
   */
  generateProgress(e, i, t) {
    const { loaded: s, total: l, percent: a } = e;
    a !== null ? (f.isDeveloperMode() && console.log(`正在下载文件${i}: ${a}%`), u.showToast(`正在下载文件${i}: ${a}%`, 3e3, "topRight", t)) : (f.isDeveloperMode() && console.log(`正在下载文件 ${i}: ${s} bytes`), u.showToast(`正在下载文件 ${i}: ${Math.floor(s / 1024)} KB`, 3e3, "topRight", t));
  }
  /**
   * 通过 HEAD 请求获取远程文件大小 (只有node环境才能用)
   * @param {string} url
   * @returns {Promise<number|null>}
   */
  async getFileSize(e) {
    return this.detectPlatform() !== "node" ? (console.warn(`[WhichWayFile] getFileSize is not supported in ${this.detectPlatform()} environment`), null) : new Promise((i, t) => {
      const l = (e.startsWith("https") ? require("https") : require("http")).request(e, { method: "HEAD", headers: { "User-Agent": "AppleWebkit" } }, (a) => {
        const c = a.headers["content-length"];
        i(c ? parseInt(c, 10) : null);
      });
      l.on("error", t), l.end();
    });
  }
  /**
   * 判断文件是否存在
   * @param { string } path 路径
   * @param {"file" | "folder" | "any"} [type = "any"] 检查类型
   *
   * @returns {Promise<boolean>}
   */
  async exsitFile(e, i = "any") {
    return e = this.compilePath(e), i === "file" ? await n.promises.checkFile(e) > 0 : i === "folder" ? await n.promises.checkDir(e) > 0 : await n.promises.checkFile(e) > 0 || await n.promises.checkDir(e) > 0;
  }
  /**
   * 创建文件夹
   * @param { string } path 路径
   *
   * @returns {Promise<void>}
   */
  async createFolder(e) {
    return e = this.compilePath(e), await n.promises.createDir(e);
  }
  /**
   * @typedef {Object} FileItem
   * @property {string} name - 文件名
   * @property {string} path - 完整路径
   */
  /**
   * @typedef {Object} FolderItem
   * @property {string} name - 文件夹名
   * @property {string} path - 完整路径
   * @property {FileItem[]} files - **直接子文件**列表（不含子文件夹中的文件）
   * @property {FolderItem[]} folders - **子文件夹**列表（递归结构，受 `step` 限制）
   */
  /**
   * 获取指定路径下的文件树结构
   *
   * @param {string} path - 起始目录路径
   * @param {number} [step=3] - 递归深度（文件夹嵌套层数），默认 3；0 表示不递归子文件夹
   * @returns {Promise<{ files: FileItem[], folders: FolderItem[] }>}
   */
  async getFileTree(e, i = 3) {
    e = this.compilePath(e);
    try {
      return await this.scanDir(e, i);
    } catch (t) {
      return console.warn(`[WhichWayFile] Failed to get file list of "${e}": ${t.message}`), { files: [], folders: [] };
    }
  }
  /**
   * 递归扫描目录的 worker：**每个目录只会被 getFileList 列一次**。
   *
   * 原实现对每个子目录都要列两次（先取该子目录的直接文件，再在递归时把同一目录
   * 又列一遍），IPC 与 readdir/stat 开销翻倍。这里改为一次列举后同时产出
   * 「直接文件」与「子目录树」，扫描开销减半。
   *
   * @param {string} path 起始目录
   * @param {number} step 剩余递归深度，0 表示只取本层文件、不再进入子目录
   * @returns {Promise<{ files: FileItem[], folders: FolderItem[] }>}
   */
  async scanDir(e, i) {
    const t = (o, w) => o.endsWith("/") ? o + w : o + "/" + w, [s, l] = await n.promises.getFileList(e), a = l.map((o) => ({
      name: o,
      path: t(e, o)
    })), c = [];
    if (s.length === 0 || i <= 0) return { files: a, folders: c };
    const m = 16;
    let r = 0;
    const d = new Array(s.length), h = Array.from({ length: Math.min(m, s.length) }, async () => {
      for (; ; ) {
        const o = r++;
        if (o >= s.length) return;
        d[o] = await this.scanDir(t(e, s[o]), i - 1);
      }
    });
    await Promise.all(h);
    for (let o = 0; o < s.length; o++)
      c.push({
        name: s[o],
        path: t(e, s[o]),
        files: d[o].files,
        folders: d[o].folders
      });
    return { files: a, folders: c };
  }
  /**
   * 单层目录扫描：仅返回直接子目录名，不递归。
   * 用于类似"src:packs/character/"这种只需要目录列表、不需要递归进入子目录的场景，
   * 比 getFileTree 省一半以上的 IPC。
   * @param {string} path
   * @returns {Promise<string[]>}
   */
  async listDirNames(e) {
    e = this.compilePath(e);
    const [i] = await n.promises.getFileList(e);
    return i;
  }
  /**
   * 读取文件内容,会自动解析json文件
   * @param {string} path 文件路径
   */
  async readFile(e) {
    e = this.compilePath(e);
    const i = this.getFileExtension(e);
    if (["json", "txt"].includes(i)) {
      const t = await n.promises.readFileAsText(e);
      return i == "json" ? JSON.parse(t) : t;
    }
    return await n.promises.readFile(e);
  }
  /**
   * 获取要读取的文件的扩展名
   * @param {string} path 路径
   *
   * @returns {string}
   */
  getFileExtension(e) {
    const i = e.lastIndexOf(".");
    return i == -1 ? (console.warn(`"${e}" has no file extension`), "") : e.slice(i + 1);
  }
  /**
   * 写入Json文件
   * @param {any} obj 内容
   * @param {string} path 文件路径
   * @param {string} [name] 文件名
   */
  writeFileAsJson(e, i, t) {
    i = this.compilePath(i);
    try {
      const s = JSON.stringify(e, null, 2);
      return n.promises.writeFile(s, i, t);
    } catch (s) {
      return Promise.reject(new Error(`Failed to serialize object to JSON: ${s}`));
    }
  }
  /**
   * 移除文件扩展名
   * @param {string} str 文件名
   *
   * @returns {string}
   */
  removeExt(e) {
    const i = e.lastIndexOf(".");
    return i == -1 ? e : e.slice(0, i);
  }
  /**
   * 加载CSS文件
   * @param {string} path 文件路径
   */
  loadCSS(e) {
    e = this.compilePath(e);
    const i = document.createElement("link");
    i.rel = "stylesheet", i.href = e, document.head.appendChild(i);
  }
  /**
   * 自动加载扩展内的css文件
   */
  async autoLoadCSS() {
    const { files: e } = await this.getFileTree("css:", 0), i = [];
    e.forEach((t) => {
      t.name.endsWith(".css") && (this.loadCSS(t.path), i.push(t.name));
    }), f.isDeveloperMode() && console.log(`[WhichWayFile] Auto loaded CSS files: ${i.join(", ")}`);
  }
}
const y = new F();
p({
  name: "WhichWayFile_dev",
  fn: () => {
    window.whichWayFile = y;
  }
});
window.whichWay.register("file", y);
export {
  y as whichWayFile
};
