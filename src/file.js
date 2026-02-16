import { lib, game, ui, get, ai, _status } from "noname";
import { onSetDev, onContent } from "./hooks/index.js";
import { whichWayToast } from "./toast/index.ts";
import { whichWayUtil } from "./utill.js";

class WhichWayFile {
	/**
	 * 驶舰之向扩展根目录
	 */
	extDir = `${lib.assetURL}extension/WhichWay/`;

	/**
	 * 路径映射
	 * @type {Record<string,string>}
	 */
	pathShceme = {
		"noname:": "",
		"src:": `${this.extDir}src/`,
		"pack:": `${this.extDir}src/character/packs/`,
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
		"test:": `${this.extDir}test/`,
	};

	/**
	 * 编译路径
	 * @param { string } path 路径
	 *
	 * @returns { string }
	 */
	compilePath(path) {
		for (let key in this.pathShceme) {
			if (path.startsWith(key)) path = path.replace(key, this.pathShceme[key]);
		}
		return path;
	}

	/**
	 * 获取是什么平台
	 * @returns {"browser" | "cordova" | "node"}
	 */
	detectPlatform() {
		let platform = "browser";
		//@ts-ignore
		if (window !== void 0 && window.cordova) platform = "cordova";
		else if (typeof process !== "undefined" && process.versions && process.versions.node) platform = "node";
		//@ts-ignore
		return platform;
	}

	/**
	 * 复制文件
	 * @param {string} source - 源文件完整路径（含文件名）
	 * @param {string} target - 目标位置（可以是目录路径或完整文件路径）
	 * @returns {Promise<void>}
	 */
	async copyFile(source, target) {
		// 编译路径
		source = this.compilePath(source);
		target = this.compilePath(target);

		const data = await game.promises.readFile(source);

		let targetDir, targetName;

		if (target.endsWith("/")) {
			targetDir = target;
			targetName = source.slice(source.lastIndexOf("/") + 1);
		} else {
			targetDir = target.slice(0, target.lastIndexOf("/") + 1);
			targetName = target.slice(target.lastIndexOf("/") + 1);
		}

		await game.promises.writeFile(data, targetDir, targetName);
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
	async download(url, dir, filename, onprogress) {
		if (typeof game.download !== "function") {
			throw new Error(`Download function ( game.download ) not available in current environment (${this.detectPlatform()}) .`);
		}

		dir = this.compilePath(dir);
		if (!filename) {
			const idx = url.lastIndexOf("/");
			if (idx === -1) throw new Error("Invalid URL");
			filename = url.slice(idx + 1).split("?")[0];
		}
		const fullPath = dir + filename;

		const isCordova = this.detectPlatform() === "cordova";

		// node端提前获取文件大小
		let totalSize = null;
		if (!isCordova && onprogress) {
			try {
				totalSize = await this.getFileSize(url);
			} catch (err) {
				console.warn("Failed to get file size:", err);
				totalSize = null;
			}
		}

		// 统一格式
		const wrappedOnProgress = onprogress
			? (loaded, totalFromCordova) => {
					const total = isCordova ? totalFromCordova : totalSize;
					const percent = total ? Math.min(99, Math.floor((loaded / total) * 100)) : null;
					onprogress({ loaded, total, percent });
				}
			: undefined;

		try {
			return new Promise((resolve, reject) => {
				//@ts-ignore
				game.download(
					url,
					fullPath,
					() => resolve(true),
					err => {
						console.warn(`Failed to download "${url}": ${err.message}`);
						reject(false);
					},
					undefined, // dev
					wrappedOnProgress
				);
			});
		} catch (e) {
			//@ts-ignore
			console.warn(`Failed to download "${url}": ${e.message}`);
			return false;
		}
	}

	/**
	 * 生成一个下载的进度提示函数（用于donwload的onprocess参数）
	 * @param {Object} info 下载信息
	 * @param {string} file 文件名
	 * @param {string} toastID 进度提示toast的ID
	 */
	generateProgress(info, file, toastID) {
		const { loaded, total, percent } = info;
		if (percent !== null) {
			if (whichWayUtil.isDeveloperMode()) console.log(`正在下载文件${file}: ${percent}%`);
			whichWayToast.showToast(`正在下载文件${file}: ${percent}%`, 3000, "topRight", toastID);
		} else {
			if (whichWayUtil.isDeveloperMode()) {
				console.log(`正在下载文件 ${file}: ${loaded} bytes`);
			}
			whichWayToast.showToast(`正在下载文件 ${file}: ${Math.floor(loaded / 1024)} KB`, 3000, "topRight", toastID);
		}
	}

	/**
	 * 通过 HEAD 请求获取远程文件大小 (只有node环境才能用)
	 * @param {string} url
	 * @returns {Promise<number|null>}
	 */
	async getFileSize(url) {
		if (this.detectPlatform() !== "node") {
			console.warn(`[WhichWayFile] getFileSize is not supported in ${this.detectPlatform()} environment`);
			return null;
		}
		return new Promise((resolve, reject) => {
			const protocol = url.startsWith("https") ? require("https") : require("http");
			const req = protocol.request(url, { method: "HEAD", headers: { "User-Agent": "AppleWebkit" } }, res => {
				const len = res.headers["content-length"];
				resolve(len ? parseInt(len, 10) : null);
			});
			req.on("error", reject);
			req.end();
		});
	}

	/**
	 * 判断文件是否存在
	 * @param { string } path 路径
	 * @param {"file" | "folder" | "any"} [type = "any"] 检查类型
	 *
	 * @returns {Promise<boolean>}
	 */
	async exsitFile(path, type = "any") {
		path = this.compilePath(path);
		if (type === "file") {
			return (await game.promises.checkFile(path)) > 0;
		} else if (type === "folder") {
			return (await game.promises.checkDir(path)) > 0;
		} else {
			return (await game.promises.checkFile(path)) > 0 || (await game.promises.checkDir(path)) > 0;
		}
	}

	/**
	 * 创建文件夹
	 * @param { string } path 路径
	 *
	 * @returns {Promise<void>}
	 */
	async createFolder(path) {
		path = this.compilePath(path);
		return await game.promises.createDir(path);
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
	async getFileTree(path, step = 3) {
		path = this.compilePath(path);

		try {
			const [folders, files] = await game.promises.getFileList(path);
			/** @type {FileItem[]} */
			const fileObjs = files.map(name => ({
				name,
				path: path + name,
			}));

			/** @type {FolderItem[]} */
			const folderObjs = [];

			for (const folderName of folders) {
				const folderPath = path + folderName;
				const [subFolders, subFiles] = await game.promises.getFileList(folderPath);

				const directFiles = subFiles.map(name => ({
					name,
					path: folderPath + "/" + name,
				}));

				/** @type {FolderItem} */
				const folderObj = {
					name: folderName,
					path: folderPath,
					files: directFiles,
					folders: [],
				};
				const subtree = await this.getFileTree(folderPath, step - 1);
				if (step > 1) {
					const subtree = await this.getFileTree.call(this, folderPath, step - 1);
					folderObj.folders = subtree.folders;
				}

				folderObjs.push(folderObj);
			}

			return { files: fileObjs, folders: folderObjs };
		} catch (e) {
			//@ts-ignore
			console.warn(`[WhichWayFile] Failed to get file list of "${path}": ${e.message}`);
			return { files: [], folders: [] };
		}
	}

	/**
	 * 读取文件内容,会自动解析json文件
	 * @param {string} path 文件路径
	 */
	async readFile(path) {
		path = this.compilePath(path);
		//手动识别类型
		const type = this.getFileExtension(path);
		if (["json", "txt"].includes(type)) {
			const result = await game.promises.readFileAsText(path);
			return type == "json" ? JSON.parse(result) : result;
		}
		return await game.promises.readFile(path);
	}

	/**
	 * 获取要读取的文件的扩展名
	 * @param {string} path 路径
	 *
	 * @returns {string}
	 */
	getFileExtension(path) {
		const index = path.lastIndexOf(".");
		if (index == -1) {
			console.warn(`"${path}" has no file extension`);
			return "";
		}
		return path.slice(index + 1);
	}

	/**
	 * 写入Json文件
	 * @param {any} obj 内容
	 * @param {string} path 文件路径
	 * @param {string} [name] 文件名
	 */
	writeFileAsJson(obj, path, name) {
		path = this.compilePath(path);
		try {
			const jsonString = JSON.stringify(obj, null, 2);
			return game.promises.writeFile(jsonString, path, name);
		} catch (error) {
			return Promise.reject(new Error(`Failed to serialize object to JSON: ${error}`));
		}
	}

	/**
	 * 移除文件扩展名
	 * @param {string} str 文件名
	 *
	 * @returns {string}
	 */
	removeExt(str) {
		const index = str.lastIndexOf(".");
		if (index == -1) {
			return str;
		}
		return str.slice(0, index);
	}

	/**
	 * 加载CSS文件
	 * @param {string} path 文件路径
	 */
	loadCSS(path) {
		path = this.compilePath(path);
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = path;
		document.head.appendChild(link);
	}

	/**
	 * 自动加载扩展内的css文件
	 */
	async autoLoadCSS() {
		const { files } = await this.getFileTree("css:");
		const loaded = [];
		files.forEach(file => {
			if (file.name.endsWith(".css")) {
				this.loadCSS(file.path);
				loaded.push(file.name);
			}
		});

		if (whichWayUtil.isDeveloperMode()) console.log(`[WhichWayFile] Auto loaded CSS files: ${loaded.join(", ")}`);
	}
}

export const whichWayFile = new WhichWayFile();

onSetDev({
	name: "WhichWayFile_dev",
	fn: () => {
		//@ts-ignore
		window.whichWayFile = whichWayFile;
	},
});

window.whichWay.register("file", whichWayFile);
