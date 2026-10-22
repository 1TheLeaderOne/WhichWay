import { lib as g, game as c } from "noname";
import { onSetDev as F } from "./hooks.js";
import { whichWayToast as x } from "./toast.js";
import { whichWayUtil as w } from "./utill.js";
const p = "经典形象", $ = ["png", "jpg", "jpeg", "webp", "gif", "bmp"];
class P {
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
    "skin:": `${this.extDir}image/illustration/skin/`,
    "ui:": `${this.extDir}image/ui/`,
    "img:": `${this.extDir}image/`,
    "illu:": `${this.extDir}image/illustration/`,
    "dyc:": `${this.extDir}dynamicSkin/illust/`,
    "dybg:": `${this.extDir}dynamicSkin/background/`,
    "mod:": `${this.extDir}image/modules/`,
    "test:": `${this.extDir}test/`,
    "logo:": `${this.extDir}image/logo/`,
    /**
     * 本扩展的「静皮目录」（`image/illustration/skin/{干员id}/`）= 千幻聆音的 `skin.standard`。
     *
     * ⚠️ 用**相对路径**（不带 `lib.assetURL`），与千幻自带皮肤包
     * （`DEFAULT_PACKAGE.skin.standard = 'extension/千幻聆音/sanguoskin/'`）以及它给其它扩展
     * 自动生成的包（`qhly_foundPackageExt`：`'extension/' + extName + '/skin/image/'`）写法一致。
     *
     * 千幻对 `skin.standard` 的消费方分两类：
     * - **读取**（`qhly_getSkinList` → `qhly_checkFileExist(path)` → `game.getFileList(path, …)`）：
     *   期望相对路径。注意 `qhly_checkFileExist`（`content.js:4491`）只实现了
     *   `lib.node.fs.statSync(__dirname + '/' + path)` 与 Cordova 两条分支，**Web 端恒返回 false**
     *   ⇒ 皮肤列表为空。这是千幻上游的缺陷，需由上游改成 `game.checkFile` 一类的实现
     *   （它自己的 `skinSwitch/js/core/skin-switch-core.js:56` 就是正确写法）；届时相对路径即可正常工作。
     * - **显示**（`img.src = lib.assetURL + file`，`content.js:11131`）：会自己补前缀，
     *   所以这里的路径**不能**带 `lib.assetURL`，否则是双重前缀。
     */
    "qs:": "extension/WhichWay/image/illustration/skin/"
  };
  /**
   * 同 `compilePath`，但结果是可以直接塞进 CSS / `<img src>` 的**绝对地址**（补上 `lib.assetURL`）。
   *
   * 已经带 `lib.assetURL` / 协议 / 根路径的结果会原样返回，不会重复补前缀。
   * @param { string } path
   * @returns { string }
   */
  compileAbsolutePath(e) {
    return e = this.compilePath(e), /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(e) ? e : `${g.assetURL}${e}`;
  }
  /**
   * 把一个「图片路径」变成真正能加载的地址。三种来源三种写法，混用就画不出来：
   * - 本扩展的皮肤配置存的是**完整路径**（`illustration/skin/{id}/{文件}`，已含 `lib.assetURL`）；
   * - 本体武将的 `img` 是**相对路径**（`image/character/…`），要补 `lib.assetURL`；
   * - 其它扩展的武将常常直接写 `img: "xxx.png"`，那是相对它自己的扩展目录的，补上扩展名即可。
   * @param { string } src
   * @returns { string }
   */
  toCssUrl(e) {
    return typeof e != "string" || e.length === 0 ? "" : /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(e) || /^(?:ext|db|mode|img|character):/i.test(e) ? e : /^(?:image|audio|video|extension|font|layout|theme)\//.test(e) ? `${g.assetURL}${e}` : this.compilePath(`ext:WhichWay/${e}`);
  }
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
    for (const i of e) {
      const s = this.getFileExtension(i.name).toLowerCase();
      if (s !== "png" && s !== "jpg" && s !== "jpeg") continue;
      const o = this.removeExt(i.name);
      t[o] !== "png" && (t[o] = s);
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
   * 皮肤目录（`illu:skin/{干员id}/`）里实际存在的文件：干员id → 皮肤名（文件名去扩展名）→ 真实文件名。
   *
   * 静皮目录里同一张皮肤可能有多种写法（`夏卉 FA075.png`、`夏卉.png`、`时遗14.png`…），
   * 而动皮数据用的是**短名**（`夏卉`、`时遗`）。取「动皮短名 → 静皮文件」时必须走这张索引，
   * 不能按「有 png 用 png、否则 jpg」的固定扩展名去猜 —— 猜不到就是一张 404 的空图。
   *
   * 与立绘索引一样在启动期扫一次（皮肤阶段 / 后端的 `rebuildSkinIndex`），因为它同样落在同步取图路径上。
   * @type {Record<string, Record<string, string>>}
   */
  skinFileIndex = {};
  /**
   * 扫描 `illustration/skin` 建立「干员id → 皮肤名 → 文件名」索引。
   *
   * 只认图片扩展名；重复的皮肤名（同目录下有 `.png` 与 `.jpg` 两份）按 `png > jpg > jpeg > 其它` 取一张，
   * 结果与旧实现的「png 优先」一致，所以换了索引的调用方看到的图不会有变化。
   * 当前环境没有 fs 后端时清单为空 ⇒ 索引为空，调用方一律返回 undefined。
   *
   * @param { Record<string, string> | undefined } skinData 皮肤数据（`WhichWaySkin#skinData`）；给了就顺带重建它
   * @returns {Promise<Record<string, Record<string, string>>>}
   */
  async initSkinFileIndex(e) {
    const { folders: t } = await this.getFileTree("skin:", 1), i = {}, s = (o) => o === "png" ? 0 : o === "jpg" ? 1 : o === "jpeg" ? 2 : 3;
    for (const o of t) {
      const r = o.name, a = {}, m = {}, l = o.files.concat(...(o.folders || []).map((n) => n.files));
      for (const n of l) {
        const f = this.getFileExtension(n.name).toLowerCase();
        if (!$.includes(f)) continue;
        const u = this.removeExt(n.name);
        u in a && m[u] <= s(f) || (a[u] = n.name, m[u] = s(f));
      }
      if (i[r] = a, !e) continue;
      const d = e[r]?.skins?.[p], h = {};
      d && (h[p] = d);
      for (const n in a)
        h[n] = {
          name: a[n],
          path: this.compilePath(`skin:${r}/${a[n]}`)
        };
      e[r] = { name: r, skins: h };
    }
    return this.skinFileIndex = i, i;
  }
  /**
   * 皮肤目录里**真实存在**的文件名（带扩展名）
   * @param { string } charId 干员id
   * @param { string } skinName 皮肤名或文件名（带不带扩展名都行）
   * @returns { string | undefined }
   */
  getSkinFileName(e, t) {
    if (typeof e != "string" || typeof t != "string") return;
    const i = this.skinFileIndex[e];
    if (i)
      return i[this.removeExt(t)];
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
    const i = await c.promises.readFile(e);
    let s, o;
    t.endsWith("/") ? (s = t, o = e.slice(e.lastIndexOf("/") + 1)) : (s = t.slice(0, t.lastIndexOf("/") + 1), o = t.slice(t.lastIndexOf("/") + 1)), await c.promises.writeFile(i, s, o);
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
  async download(e, t, i, s) {
    if (typeof c.download != "function")
      return console.warn(`[WhichWayFile] Download function ( game.download ) not available in current environment (${this.detectPlatform()}) .`), !1;
    if (t = this.compilePath(t), !i) {
      const l = e.lastIndexOf("/");
      if (l === -1) throw new Error("Invalid URL");
      i = e.slice(l + 1).split("?")[0];
    }
    const o = t + i, r = this.detectPlatform() === "cordova";
    let a = null;
    if (!r && s)
      try {
        a = await this.getFileSize(e);
      } catch (l) {
        console.warn("Failed to get file size:", l), a = null;
      }
    const m = s ? (l, d) => {
      const h = r ? d : a, n = h ? Math.min(99, Math.floor(l / h * 100)) : null;
      s({ loaded: l, total: h, percent: n });
    } : void 0;
    try {
      return new Promise((l, d) => {
        c.download(
          e,
          o,
          () => l(!0),
          (h) => {
            console.warn(`Failed to download "${e}": ${h.message}`), d(!1);
          },
          void 0,
          // dev
          m
        );
      });
    } catch (l) {
      return console.warn(`Failed to download "${e}": ${l.message}`), !1;
    }
  }
  /**
   * 生成一个下载的进度提示函数（用于donwload的onprocess参数）
   * @param {Object} info 下载信息
   * @param {string} file 文件名
   * @param {string} toastID 进度提示toast的ID
   */
  generateProgress(e, t, i) {
    const { loaded: s, total: o, percent: r } = e;
    r !== null ? (w.isDeveloperMode() && console.log(`正在下载文件${t}: ${r}%`), x.showToast(`正在下载文件${t}: ${r}%`, 3e3, "topRight", i)) : (w.isDeveloperMode() && console.log(`正在下载文件 ${t}: ${s} bytes`), x.showToast(`正在下载文件 ${t}: ${Math.floor(s / 1024)} KB`, 3e3, "topRight", i));
  }
  /**
   * 通过 HEAD 请求获取远程文件大小 (只有node环境才能用)
   * @param {string} url
   * @returns {Promise<number|null>}
   */
  async getFileSize(e) {
    return this.detectPlatform() !== "node" ? (console.warn(`[WhichWayFile] getFileSize is not supported in ${this.detectPlatform()} environment`), null) : new Promise((t, i) => {
      const o = (e.startsWith("https") ? require("https") : require("http")).request(e, { method: "HEAD", headers: { "User-Agent": "AppleWebkit" } }, (r) => {
        const a = r.headers["content-length"];
        t(a ? parseInt(a, 10) : null);
      });
      o.on("error", i), o.end();
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
    return e = this.compilePath(e), t === "file" ? await c.promises.checkFile(e) > 0 : t === "folder" ? await c.promises.checkDir(e) > 0 : await c.promises.checkFile(e) > 0 || await c.promises.checkDir(e) > 0;
  }
  /**
   * 创建文件夹
   * @param { string } path 路径
   *
   * @returns {Promise<void>}
   */
  async createFolder(e) {
    return e = this.compilePath(e), await c.promises.createDir(e);
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
    } catch (i) {
      return console.warn(`[WhichWayFile] Failed to get file list of "${e}": ${i.message}`), { files: [], folders: [] };
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
    const i = (n, f) => n.endsWith("/") ? n + f : n + "/" + f, [s, o] = await c.promises.getFileList(e), r = o.map((n) => ({
      name: n,
      path: i(e, n)
    })), a = [];
    if (s.length === 0 || t <= 0) return { files: r, folders: a };
    const m = 16;
    let l = 0;
    const d = new Array(s.length), h = Array.from({ length: Math.min(m, s.length) }, async () => {
      for (; ; ) {
        const n = l++;
        if (n >= s.length) return;
        d[n] = await this.scanDir(i(e, s[n]), t - 1);
      }
    });
    await Promise.all(h);
    for (let n = 0; n < s.length; n++)
      a.push({
        name: s[n],
        path: i(e, s[n]),
        files: d[n].files,
        folders: d[n].folders
      });
    return { files: r, folders: a };
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
    const [t] = await c.promises.getFileList(e);
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
      const i = await c.promises.readFileAsText(e);
      return t == "json" ? JSON.parse(i) : i;
    }
    return await c.promises.readFile(e);
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
  writeFileAsJson(e, t, i) {
    t = this.compilePath(t);
    try {
      const s = JSON.stringify(e, null, 2);
      return c.promises.writeFile(s, t, i);
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
    e.forEach((i) => {
      i.name.endsWith(".css") && (this.loadCSS(i.path), t.push(i.name));
    }), w.isDeveloperMode() && console.log(`[WhichWayFile] Auto loaded CSS files: ${t.join(", ")}`);
  }
}
const y = new P();
F({
  name: "WhichWayFile_dev",
  fn: () => {
    window.whichWayFile = y;
  }
});
window.whichWay.register("file", y);
export {
  y as whichWayFile
};
