import { lib as x, game as n } from "noname";
import { onSetDev as y } from "./hooks.js";
import { whichWayToast as w } from "./toast.js";
import { whichWayUtil as f } from "./utill.js";
class p {
  /**
   * 驶舰之向扩展根目录
   */
  extDir = `${x.assetURL}extension/WhichWay/`;
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
    "skin:": `${this.extDir}image/illustration/skin/`,
    "ui:": `${this.extDir}image/ui/`,
    "img:": `${this.extDir}image/`,
    "illu:": `${this.extDir}image/illustration/`,
    "dyc:": `${this.extDir}dynamicSkin/illust/`,
    "dybg:": `${this.extDir}dynamicSkin/background/`,
    "mod:": `${this.extDir}image/modules/`,
    "test:": `${this.extDir}test/`,
    "logo:": `${this.extDir}image/logo/`
  };
  /**
   * 编译路径
   * @param { string } path 路径
   *
   * @returns { string }
   */
  compilePath(e) {
    for (let t in this.pathShceme)
      e.startsWith(t) && (e = e.replace(t, this.pathShceme[t]));
    return e;
  }
  /**
   * 干员立绘（`image/illustration/character/`）实际存在的扩展名索引：干员id → `"png" | "jpg"`。
   *
   * 立绘同时提供 png（立绘分离脚本产出）与 jpg 两种格式，取值规则「有 png 用 png，否则用 jpg」；
   * jpg 视为必定存在，不做 jpg 缺失的兜底。
   * 之所以要启动期扫一次目录建索引：取图点（武将注册、皮肤「经典形象」补条目）都落在同步路径上，
   * 而逐个 checkFile 要为几百个干员发几百次 IPC。
   * @type {Record<string, string>}
   */
  characterPortraitExt = {};
  /**
   * 扫描 `illustration/character` 建立立绘扩展名索引（png 优先）。
   * 当前环境没有 fs 后端时 getFileTree 返回空清单，索引为空 ⇒ 一律按 jpg 取值。
   *
   * @returns {Promise<Record<string, string>>}
   */
  async initCharacterPortraitIndex() {
    const { files: e } = await this.getFileTree("illu:character/", 0), t = {};
    for (const s of e) {
      const i = this.getFileExtension(s.name).toLowerCase();
      if (i !== "png" && i !== "jpg" && i !== "jpeg") continue;
      const r = this.removeExt(s.name);
      t[r] !== "png" && (t[r] = i);
    }
    return this.characterPortraitExt = t, t;
  }
  /**
   * 获取干员立绘文件名（png 优先，无 png 用 jpg）
   * @param { string } name 干员id
   *
   * @returns { string }
   */
  getCharacterPortraitFile(e) {
    return `${e}.${this.characterPortraitExt[e] ?? "jpg"}`;
  }
  /**
   * 获取干员立绘完整路径（png 优先，无 png 用 jpg）
   * @param { string } name 干员id
   *
   * @returns { string }
   */
  getCharacterPortraitPath(e) {
    return this.compilePath(`illu:character/${this.getCharacterPortraitFile(e)}`);
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
  async copyFile(e, t) {
    e = this.compilePath(e), t = this.compilePath(t);
    const s = await n.promises.readFile(e);
    let i, r;
    t.endsWith("/") ? (i = t, r = e.slice(e.lastIndexOf("/") + 1)) : (i = t.slice(0, t.lastIndexOf("/") + 1), r = t.slice(t.lastIndexOf("/") + 1)), await n.promises.writeFile(s, i, r);
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
  async download(e, t, s, i) {
    if (typeof n.download != "function")
      return console.warn(`[WhichWayFile] Download function ( game.download ) not available in current environment (${this.detectPlatform()}) .`), !1;
    if (t = this.compilePath(t), !s) {
      const a = e.lastIndexOf("/");
      if (a === -1) throw new Error("Invalid URL");
      s = e.slice(a + 1).split("?")[0];
    }
    const r = t + s, l = this.detectPlatform() === "cordova";
    let c = null;
    if (!l && i)
      try {
        c = await this.getFileSize(e);
      } catch (a) {
        console.warn("Failed to get file size:", a), c = null;
      }
    const m = i ? (a, h) => {
      const d = l ? h : c, o = d ? Math.min(99, Math.floor(a / d * 100)) : null;
      i({ loaded: a, total: d, percent: o });
    } : void 0;
    try {
      return new Promise((a, h) => {
        n.download(
          e,
          r,
          () => a(!0),
          (d) => {
            console.warn(`Failed to download "${e}": ${d.message}`), h(!1);
          },
          void 0,
          // dev
          m
        );
      });
    } catch (a) {
      return console.warn(`Failed to download "${e}": ${a.message}`), !1;
    }
  }
  /**
   * 生成一个下载的进度提示函数（用于donwload的onprocess参数）
   * @param {Object} info 下载信息
   * @param {string} file 文件名
   * @param {string} toastID 进度提示toast的ID
   */
  generateProgress(e, t, s) {
    const { loaded: i, total: r, percent: l } = e;
    l !== null ? (f.isDeveloperMode() && console.log(`正在下载文件${t}: ${l}%`), w.showToast(`正在下载文件${t}: ${l}%`, 3e3, "topRight", s)) : (f.isDeveloperMode() && console.log(`正在下载文件 ${t}: ${i} bytes`), w.showToast(`正在下载文件 ${t}: ${Math.floor(i / 1024)} KB`, 3e3, "topRight", s));
  }
  /**
   * 通过 HEAD 请求获取远程文件大小 (只有node环境才能用)
   * @param {string} url
   * @returns {Promise<number|null>}
   */
  async getFileSize(e) {
    return this.detectPlatform() !== "node" ? (console.warn(`[WhichWayFile] getFileSize is not supported in ${this.detectPlatform()} environment`), null) : new Promise((t, s) => {
      const r = (e.startsWith("https") ? require("https") : require("http")).request(e, { method: "HEAD", headers: { "User-Agent": "AppleWebkit" } }, (l) => {
        const c = l.headers["content-length"];
        t(c ? parseInt(c, 10) : null);
      });
      r.on("error", s), r.end();
    });
  }
  /**
   * 判断文件是否存在
   * @param { string } path 路径
   * @param {"file" | "folder" | "any"} [type = "any"] 检查类型
   *
   * @returns {Promise<boolean>}
   */
  async exsitFile(e, t = "any") {
    return e = this.compilePath(e), t === "file" ? await n.promises.checkFile(e) > 0 : t === "folder" ? await n.promises.checkDir(e) > 0 : await n.promises.checkFile(e) > 0 || await n.promises.checkDir(e) > 0;
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
  async getFileTree(e, t = 3) {
    e = this.compilePath(e);
    try {
      return await this.scanDir(e, t);
    } catch (s) {
      return console.warn(`[WhichWayFile] Failed to get file list of "${e}": ${s.message}`), { files: [], folders: [] };
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
  async scanDir(e, t) {
    const s = (o, u) => o.endsWith("/") ? o + u : o + "/" + u, [i, r] = await n.promises.getFileList(e), l = r.map((o) => ({
      name: o,
      path: s(e, o)
    })), c = [];
    if (i.length === 0 || t <= 0) return { files: l, folders: c };
    const m = 16;
    let a = 0;
    const h = new Array(i.length), d = Array.from({ length: Math.min(m, i.length) }, async () => {
      for (; ; ) {
        const o = a++;
        if (o >= i.length) return;
        h[o] = await this.scanDir(s(e, i[o]), t - 1);
      }
    });
    await Promise.all(d);
    for (let o = 0; o < i.length; o++)
      c.push({
        name: i[o],
        path: s(e, i[o]),
        files: h[o].files,
        folders: h[o].folders
      });
    return { files: l, folders: c };
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
    const [t] = await n.promises.getFileList(e);
    return t;
  }
  /**
   * 读取文件内容,会自动解析json文件
   * @param {string} path 文件路径
   */
  async readFile(e) {
    e = this.compilePath(e);
    const t = this.getFileExtension(e);
    if (["json", "txt"].includes(t)) {
      const s = await n.promises.readFileAsText(e);
      return t == "json" ? JSON.parse(s) : s;
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
    const t = e.lastIndexOf(".");
    return t == -1 ? (console.warn(`"${e}" has no file extension`), "") : e.slice(t + 1);
  }
  /**
   * 写入Json文件
   * @param {any} obj 内容
   * @param {string} path 文件路径
   * @param {string} [name] 文件名
   */
  writeFileAsJson(e, t, s) {
    t = this.compilePath(t);
    try {
      const i = JSON.stringify(e, null, 2);
      return n.promises.writeFile(i, t, s);
    } catch (i) {
      return Promise.reject(new Error(`Failed to serialize object to JSON: ${i}`));
    }
  }
  /**
   * 移除文件扩展名
   * @param {string} str 文件名
   *
   * @returns {string}
   */
  removeExt(e) {
    const t = e.lastIndexOf(".");
    return t == -1 ? e : e.slice(0, t);
  }
  /**
   * 加载CSS文件
   * @param {string} path 文件路径
   */
  loadCSS(e) {
    e = this.compilePath(e);
    const t = document.createElement("link");
    t.rel = "stylesheet", t.href = e, document.head.appendChild(t);
  }
  /**
   * 自动加载扩展内的css文件
   */
  async autoLoadCSS() {
    const { files: e } = await this.getFileTree("css:", 0), t = [];
    e.forEach((s) => {
      s.name.endsWith(".css") && (this.loadCSS(s.path), t.push(s.name));
    }), f.isDeveloperMode() && console.log(`[WhichWayFile] Auto loaded CSS files: ${t.join(", ")}`);
  }
}
const g = new p();
y({
  name: "WhichWayFile_dev",
  fn: () => {
    window.whichWayFile = g;
  }
});
window.whichWay.register("file", g);
export {
  g as whichWayFile
};
