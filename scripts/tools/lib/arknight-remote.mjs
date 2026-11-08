/**
 * 明日方舟素材同步脚本的公共远程层：从 update-portraits.mjs 的同构实现里抽出，供 update-skins.mjs 使用。
 *
 * 两个脚本要做的事不同（立绘落 character/、皮肤落 skin/），但「怎么从远端安全地拿一张图」完全一样，
 * 而且踩过的坑也一样：代理、超时重试、PRTS 未知路径用 200 返回 HTML、GitHub 匿名限流、
 * 目录清单缓存 7 天、raw 地址里的 `#`/`+` 必须逐段编码…… 所以集中在这里，避免两份实现各自漂移。
 *
 * 只导出两类东西：
 *   - 与实例无关的小工具：PNG_MAGIC / sleep / fmt / parseProxy / assertMagick；
 *   - createRemoteAssets(options)：按一次运行的配置（站点、来源、代理、缓存目录）建出的远程客户端，
 *     提供 fetchBytes / assetUrl / loadIndex / isPng / compressImage。
 *
 * ⚠ update-portraits.mjs 目前仍带着自己那份同构实现；改这里的网络行为时两处都要同步，
 *   并各跑一次 `--dry-run` 验证（抓取路径用 `--refresh-index`，缓存路径不带它）。
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import tls from "node:tls";
import zlib from "node:zlib";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
/** ImageMagick 7 的可执行文件；MAGICK 环境变量可覆盖（与 compress-skin.mjs 同一约定） */
const MAGICK = process.env.MAGICK || "magick";

/** PNG 文件头（十六进制）：PRTS 对未知路径会 200 返回前端 HTML，落盘前必须校验 */
export const PNG_MAGIC = "89504e470d0a1a0a";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fmt = bytes => (bytes > 1048576 ? `${(bytes / 1048576).toFixed(2)}MB` : `${(bytes / 1024).toFixed(0)}KB`);

/**
 * 解析 --proxy / 环境变量：允许省略协议（按 http:// 补），只接受 HTTP(S) 代理。
 * socks5 需要另做握手，这里不做，报错时直接告诉用户改填本地代理软件的 HTTP 端口。
 * ⚠ 这是 CLI 辅助函数：地址非法时直接退出进程（两个脚本都在模块顶层调用它）。
 */
export function parseProxy(raw) {
	const text = String(raw ?? "").trim();
	if (!text) return null;
	const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `http://${text}`;
	let url;
	try {
		url = new URL(withScheme);
	} catch {
		console.error(`--proxy 不是合法的地址：${text}`);
		process.exit(1);
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") {
		console.error(`--proxy 只支持 http:// 或 https:// 代理（收到 ${url.protocol}//）。socks5 请换成本地代理软件提供的 HTTP 端口，如 Clash 的 7890。`);
		process.exit(1);
	}
	return url;
}

/** 确认 ImageMagick 可用；不可用时抛错（调用方在真正要压图之前调一次） */
export async function assertMagick() {
	try {
		await exec(MAGICK, ["-version"]);
	} catch {
		throw new Error(`找不到 ImageMagick（${MAGICK}）。装好后重试，或设 MAGICK 环境变量指向可执行文件。`);
	}
}

/**
 * 建一个远程客户端。
 *
 * @param {object} options
 * @param {string} options.origin 站点根，如 https://torappu.prts.wiki（末尾斜杠会被去掉）
 * @param {Record<string, { provider: "prts" | "github", dir?: string }>} [options.sources]
 *        逻辑来源名 → 取法。`provider: "github"` 时 `dir` 是该来源在 GitHub 仓库里的实际目录（如 skin / portrait）。
 * @param {{ repo?: string, ref?: string, api?: string, raw?: string, token?: string }} [options.github]
 * @param {URL | null} [options.proxy] 已解析的代理地址（parseProxy 的返回值）
 * @param {string} options.cacheDir 清单缓存目录（每个来源一份 `<来源名>_index.json`）
 * @param {string} [options.rootDir] 日志里相对路径的基准目录（默认 cacheDir）
 * @param {number} [options.maxAgeDays] 清单缓存天数
 * @param {number} [options.timeout] 单请求超时毫秒
 * @param {number} [options.retry] 重试次数
 * @param {boolean} [options.offline] 只用缓存不联网（缓存缺失/过期时行为见 loadIndex）
 * @param {boolean} [options.refreshIndex] 忽略缓存强制重取清单
 * @param {string} [options.ua] User-Agent（方便站点访问日志归类）
 */
export function createRemoteAssets({
	origin,
	sources = {},
	github = {},
	proxy = null,
	cacheDir,
	rootDir = cacheDir,
	maxAgeDays = 7,
	timeout = 60000,
	retry = 2,
	offline = false,
	refreshIndex = false,
	ua = "WhichWay-asset-sync",
} = {}) {
	if (!origin) throw new Error("createRemoteAssets 需要 origin");
	if (!cacheDir) throw new Error("createRemoteAssets 需要 cacheDir");

	const ORIGIN = String(origin).replace(/\/+$/, "");
	const GITHUB_REPO = github.repo ?? "";
	const GITHUB_REF = github.ref ?? "main";
	const GITHUB_API = String(github.api ?? "https://api.github.com").replace(/\/+$/, "");
	const GITHUB_RAW = String(github.raw ?? "https://raw.githubusercontent.com").replace(/\/+$/, "");
	//只给 api.github.com 的清单请求带 token；raw 下载走另一个域，绝不能把 token 发过去
	const GITHUB_TOKEN = github.token ?? "";
	const PROXY = proxy;
	/** 展示用（不含账号密码） */
	const proxyLabel = PROXY ? `${PROXY.protocol}//${PROXY.host}` : "";

	/**
	 * 取一份远端内容（带超时与重试）。accept 决定站点给 JSON 还是给图——
	 * `/api/v1/*` 若不带 `accept: application/json` 会被网关当成前端路由、200 返回 HTML。
	 */
	async function fetchBytes(url, accept, headers = {}) {
		let last;
		for (let attempt = 0; attempt <= retry; attempt++) {
			if (attempt) await sleep(1000 * attempt);
			const ctrl = new AbortController();
			const timer = setTimeout(() => ctrl.abort(), timeout);
			try {
				const allHeaders = { accept, "user-agent": ua, ...headers };
				if (PROXY) return await proxyGet(url, allHeaders, ctrl.signal);
				const res = await fetch(url, { signal: ctrl.signal, headers: allHeaders });
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return Buffer.from(await res.arrayBuffer());
			} catch (e) {
				last = e;
				console.error(`  ! 请求失败（第 ${attempt + 1} 次）${url}：${String(e).split("\n")[0]}`);
			} finally {
				clearTimeout(timer);
			}
		}
		throw last ?? new Error(`请求失败：${url}`);
	}

	/**
	 * 经代理 GET 一个地址。Node 自带的 fetch 不读 HTTPS_PROXY、也没把 undici 的 ProxyAgent 暴露出来，
	 * 所以这里自己实现：http 目标用 absolute-form 转发，https 目标先 CONNECT 建隧道再套 TLS。
	 * 跟随最多 5 次重定向（raw.githubusercontent.com 会 302 到 objects.githubusercontent.com）。
	 */
	async function proxyGet(rawUrl, initialHeaders, signal) {
		const headers = { ...initialHeaders };
		let current = new URL(rawUrl);
		for (let hop = 0; hop <= 5; hop++) {
			const res = await proxyRequest(current, headers, signal);
			if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
				const next = new URL(res.headers.location, current);
				//跨主机重定向不带 token 等自定义头，避免把凭据发到别的域
				if (next.host !== current.host) delete headers.authorization;
				current = next;
				continue;
			}
			if (res.statusCode < 200 || res.statusCode >= 300) throw new Error(`HTTP ${res.statusCode}`);
			return decodeBody(res.body, res.headers["content-encoding"]);
		}
		throw new Error(`重定向次数过多：${rawUrl}`);
	}

	/** 代理链路自己收 body，就不会有 fetch 的自动解压，这里补上（收不收得到取决于站点实现） */
	function decodeBody(buf, encoding) {
		const enc = String(encoding ?? "").trim().toLowerCase();
		if (!enc || enc === "identity") return buf;
		try {
			if (enc === "gzip") return zlib.gunzipSync(buf);
			if (enc === "deflate") return zlib.inflateSync(buf, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
			if (enc === "br") return zlib.brotliDecompressSync(buf);
		} catch (e) {
			throw new Error(`响应解压失败（content-encoding: ${enc}）：${String(e).split("\n")[0]}`);
		}
		return buf;
	}

	/** 发一次经代理的 GET，返回 { statusCode, headers, body } */
	function proxyRequest(url, headers, signal) {
		return new Promise((resolve, reject) => {
			const isHttpsTarget = url.protocol === "https:";
			const isHttpsProxy = PROXY.protocol === "https:";
			const proxyMod = isHttpsProxy ? https : http;
			const targetHost = url.hostname;
			const targetPort = Number(url.port) || (isHttpsTarget ? 443 : 80);
			const proxyPort = Number(PROXY.port) || (isHttpsProxy ? 443 : 80);
			const requestPath = `${url.pathname}${url.search}` || "/";
			const proxyAuth = PROXY.username
				? `Basic ${Buffer.from(`${decodeURIComponent(PROXY.username)}:${decodeURIComponent(PROXY.password)}`).toString("base64")}`
				: "";
			const proxyCommon = { host: PROXY.hostname, port: proxyPort, signal };

			if (!isHttpsTarget) {
				const req = proxyMod.request(
					{
						...proxyCommon,
						method: "GET",
						path: url.href, //http 目标经代理时要发绝对地址
						headers: { ...headers, host: `${targetHost}:${targetPort}`, ...(proxyAuth ? { "proxy-authorization": proxyAuth } : {}) },
					},
					res => collect(res, resolve, reject)
				);
				req.on("error", reject);
				req.end();
				return;
			}

			const connectReq = proxyMod.request({
				...proxyCommon,
				method: "CONNECT",
				path: `${targetHost}:${targetPort}`,
				headers: { host: `${targetHost}:${targetPort}`, ...(proxyAuth ? { "proxy-authorization": proxyAuth } : {}) },
			});
			connectReq.on("connect", (res, socket) => {
				if (res.statusCode !== 200) {
					socket.destroy();
					reject(new Error(`代理 CONNECT 失败：HTTP ${res.statusCode}`));
					return;
				}
				//CONNECT 建完到 TLS 握手完成之间，AbortSignal 只绑在 ClientRequest 上、管不到裸 socket，这里手动兜住超时
				const onAbort = () => socket.destroy(new Error("请求已取消（超时或被中止）"));
				if (signal.aborted) {
					socket.destroy();
					reject(new Error("请求已取消（超时或被中止）"));
					return;
				}
				signal.addEventListener("abort", onAbort, { once: true });
				const tlsSocket = tls.connect({ socket, servername: targetHost }, () => {
					signal.removeEventListener("abort", onAbort);
					const req = https.request(
						{
							host: targetHost,
							port: targetPort,
							path: requestPath,
							method: "GET",
							headers,
							signal,
							//隧道里的 TLS 已由上面建好；给了 createConnection 时 ClientRequest 不再走默认 Agent
							createConnection: () => tlsSocket,
						},
						res2 => collect(res2, resolve, reject)
					);
					req.on("error", reject);
					req.end();
				});
				tlsSocket.on("error", reject);
			});
			connectReq.on("error", reject);
			connectReq.end();
		});
	}

	function collect(res, resolve, reject) {
		const chunks = [];
		res.on("data", chunk => chunks.push(chunk));
		res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
		res.on("error", reject);
	}

	/**
	 * 取图 URL。PRTS 用自己的规则（raw/ 段换成 assets/，只编码最后一段）；
	 * GitHub 走 raw 前缀，路径逐段编码——立绘名里的 `#`/`+` 不编码会被当成锚点或加号。
	 */
	function assetUrl(dir, remotePath) {
		if (sources[dir]?.provider === "github") {
			const encoded = remotePath.split("/").map(encodeURIComponent).join("/");
			return `${GITHUB_RAW}/${GITHUB_REPO}/${GITHUB_REF}/${encoded}`;
		}
		const seg = remotePath.replace(/^raw\//, "").split("/");
		const file = encodeURIComponent(seg.pop());
		return `${ORIGIN}/assets/${[...seg, file].join("/")}`;
	}

	function isPng(file) {
		const head = Buffer.alloc(8);
		const fd = fs.openSync(file, "r");
		try {
			fs.readSync(fd, head, 0, 8, 0);
		} finally {
			fs.closeSync(fd);
		}
		return head.toString("hex") === PNG_MAGIC;
	}

	/**
	 * 读一份目录清单缓存。命中（未过期，或 --offline 下即使过期）返回 name → 条目；否则返回 null。
	 * PRTS 与 GitHub 共用同一格式：`{ children: [{ name, path, size }] }`。
	 */
	function readIndexCache(indexFile) {
		if (!fs.existsSync(indexFile)) return null;
		try {
			const data = JSON.parse(fs.readFileSync(indexFile, "utf8"));
			const ageDays = (Date.now() - fs.statSync(indexFile).mtimeMs) / 86400000;
			//按「去掉子目录后的条目数」报数：children 里会夹着目录项，直接报 length 会和实际可比对的文件数对不上
			const files = data?.children ? toIndexMap(data) : null;
			if (!files) return null;
			if (ageDays <= maxAgeDays) {
				console.log(`远端清单：读缓存 ${path.relative(rootDir, indexFile)}（${ageDays.toFixed(1)} 天前，${files.size} 个文件；--refresh-index 可强制重取）`);
				return files;
			}
			if (offline) {
				console.log(`远端清单：缓存已过期（${ageDays.toFixed(1)} 天）但 --offline 不联网，仍按缓存 ${files.size} 个文件计算`);
				return files;
			}
		} catch (e) {
			console.error(`  缓存清单不可用（${String(e).split("\n")[0]}），改为重新抓取`);
		}
		return null;
	}

	async function fetchPrtsIndex(dir) {
		//路径参数里的斜杠必须编码成 %2F：未编码时网关会回落到前端页面
		const buf = await fetchBytes(`${ORIGIN}/api/v1/files/${encodeURIComponent(`raw/${dir}`)}`, "application/json");
		let data;
		try {
			data = JSON.parse(buf.toString("utf8"));
		} catch {
			throw new Error("清单响应不是 JSON（站点可能改版了）");
		}
		if (!data?.children) throw new Error("清单响应缺少 children 字段");
		console.log(`远端清单：已抓取 ${dir} 共 ${toIndexMap(data).size} 个文件（${fmt(buf.length)}）`);
		return data;
	}

	let githubTreePromise = null;

	/**
	 * GitHub 整个仓库的递归 tree（一次约 9MB）。同一次运行里两个 GitHub 目录共用这一份，
	 * 所以 `--sources github_skin,github_portrait` 也只打一次 API；成功的清单随后按目录裁剪进缓存。
	 */
	function loadGithubTree() {
		githubTreePromise ??= (async () => {
			const url = `${GITHUB_API}/repos/${GITHUB_REPO}/git/trees/${encodeURIComponent(GITHUB_REF)}?recursive=1`;
			const headers = GITHUB_TOKEN ? { authorization: `Bearer ${GITHUB_TOKEN}` } : {};
			const buf = await fetchBytes(url, "application/vnd.github+json", headers);
			let data;
			try {
				data = JSON.parse(buf.toString("utf8"));
			} catch {
				throw new Error("GitHub 清单响应不是 JSON（API 可能限流或被代理改写）");
			}
			if (!Array.isArray(data?.tree)) throw new Error(`GitHub 清单响应缺少 tree 字段${data?.message ? `：${data.message}` : ""}`);
			if (data.truncated) console.warn("  ! GitHub tree 响应被截断，清单可能不全");
			console.log(`远端清单：GitHub tree ${data.tree.length} 条（${fmt(buf.length)}，${GITHUB_REPO}@${GITHUB_REF}）`);
			return data.tree;
		})();
		return githubTreePromise;
	}

	async function fetchGithubIndex(dir) {
		const repoDir = sources[dir]?.dir;
		if (!repoDir) throw new Error(`来源 ${dir} 没有配置 GitHub 目录`);
		const tree = await loadGithubTree();
		const prefix = `${repoDir}/`;
		const children = [];
		for (const entry of tree) {
			if (entry.type !== "blob" || !entry.path.startsWith(prefix)) continue;
			const name = entry.path.slice(prefix.length);
			if (!name || name.includes("/")) continue; //只收目录直属文件，与 PRTS 清单口径一致
			children.push({ name, path: entry.path, size: entry.size ?? 0 });
		}
		if (!children.length) throw new Error(`GitHub 仓库 ${GITHUB_REPO}@${GITHUB_REF} 的 ${repoDir}/ 没有文件（分支名或仓库结构改了？）`);
		console.log(`远端清单：GitHub ${repoDir}/ 共 ${children.length} 个文件`);
		return { children };
	}

	/**
	 * 远端某个图片目录的清单：name → { name, path, size }。
	 * 每个目录各一份缓存文件（`<目录>_index.json`），7 天内直接复用（--refresh-index 强制重取，--offline 只允许读缓存）。
	 */
	async function loadIndex(dir) {
		const indexFile = path.join(cacheDir, `${dir}_index.json`);
		if (!refreshIndex) {
			const cached = readIndexCache(indexFile);
			if (cached) return cached;
		}
		if (offline) throw new Error(`--offline 但缓存清单不存在或不可用：${indexFile}`);
		const data = sources[dir]?.provider === "github" ? await fetchGithubIndex(dir) : await fetchPrtsIndex(dir);
		fs.mkdirSync(cacheDir, { recursive: true });
		fs.writeFileSync(indexFile, JSON.stringify(data));
		const files = toIndexMap(data);
		console.log(`  已缓存 ${path.relative(rootDir, indexFile)}`);
		return files;
	}

	/**
	 * 压缩并落盘：magick 先写同目录 tmp，成功后 rename——
	 * 同目录 rename 是原子操作，运行中的游戏不会读到半张图。
	 * 即使「压缩无收益」也必须落盘：这一步的目的是让资源可用，不是省体积。
	 */
	async function compressImage(rawFile, target, { max = 1280, colors = 256 } = {}) {
		const tmp = `${target}.tmp.png`;
		const args = [rawFile, "-auto-orient", "-strip", "-colorspace", "sRGB", "-resize", `${max}x${max}>`];
		if (colors) {
			args.push("-colors", String(colors)); //量化到 ≤256 色调色板仍保留逐像素 alpha；刻意不加抖动（噪声会让 PNG 反弹体积）
		} else {
			args.push("-define", "png:bit-depth=8");
		}
		args.push("-quality", "9", "-define", "png:compression-level=9", "-define", "png:compression-strategy=0", tmp);
		try {
			await exec(MAGICK, args);
			const size = fs.statSync(tmp).size;
			fs.renameSync(tmp, target);
			return size;
		} finally {
			fs.rmSync(tmp, { force: true });
		}
	}

	return { fetchBytes, assetUrl, loadIndex, isPng, compressImage, proxyLabel, origin: ORIGIN };
}

function toIndexMap(data) {
	const map = new Map();
	for (const c of data.children) if (!c.is_dir) map.set(c.name, c);
	return map;
}
