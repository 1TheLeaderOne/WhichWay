/**
 * 补齐缺失的干员皮肤：从 torappu 公益资源站（或 GitHub 备份仓库）下载、压缩后放进
 * image/illustration/skin/[形态id]/[皮肤名].png。
 *
 * 为什么单独一个脚本，而不是塞进 update-portraits.mjs：
 *   立绘和皮肤是两套目标、两套命名规则。立绘只认 skin_table 的 ILLUST_2（精二）→ character/[形态id].png；
 *   皮肤认「有 displaySkin.skinName 的真实皮肤」→ skin/[形态id]/[皮肤名].png，还多一类 `_sp` 异格
 *   （文件名 = 母皮肤名 + skinId 末尾序号，如 雪覆伦城20.png）。两边共用的只有「怎么从远端拿一张图」，
 *   那部分已经抽到 scripts/tools/lib/arknight-remote.mjs。
 *   命名规则与 scripts/tools/split-illustration.mjs 严格一致，脚本不自己发明文件名。
 *
 * 为什么默认只补真实皮肤，不补初始/精一立绘：
 *   本扩展的皮肤目录里只有真实皮肤（没有一张「初始立绘.png」）——经典形象已经由
 *   character/[形态id].png 承担，再放一份初始立绘只是重复；精二则归 update-portraits.mjs。
 *   所以 ILLUST_0 / ILLUST_1 / ILLUST_2 三条一律跳过。
 *
 * 范围：默认「本扩展已收录的干员」= character/ 里有立绘的形态 ∪ 已有皮肤目录的形态。
 *   `--scope all` 放开到皮肤表里所有有皮肤的形态（本扩展还没收录的干员也会被算进来，慎用）。
 *
 * 图片来源目录（`--sources`，逗号分隔，顺序即优先级）：
 *   - char_arts（默认）= 全身立绘，与 update-portraits 同一批资源；皮肤文件名同为 {portraitId}b.png。
 *   - github_skin = GitHub 备份仓库 yuanyan3060/ArknightsGameResource 的 skin/（`_sp` 异格只有它有全量）。
 *   - char_portrait / github_portrait = 半身像，站点未收录全身图的新皮肤才用；分辨率低一个数量级，显式加才收。
 *   清单缓存、代理、重试、GitHub token 与 update-portraits 完全同一套（共用 scripts/tools/lib/arknight-remote.mjs）。
 *
 * ⚠ 只新增、从不覆盖：目标已存在（png 或 jpg 都算已有）直接跳过。
 *   压缩依赖 ImageMagick 7（`magick`，可用 MAGICK 环境变量指定），参数与 compress-skin.mjs 同构。
 *   落盘后皮肤列表不会立刻变——运行期读的是 json/cache/skin.json 的磁盘扫描缓存，要删掉它
 *   （或在游戏内「设置 → 驶舰之向 → 更新皮肤数据」点一次）才会看到新皮肤。
 *
 * 用法：
 *   node scripts/tools/update-skins.mjs --dry-run                     # 只打印计划与缺口统计
 *   node scripts/tools/update-skins.mjs                              # 补齐本扩展已收录干员的皮肤
 *   node scripts/tools/update-skins.mjs --ids char_1045_svash2       # 只补某几个形态
 *   node scripts/tools/update-skins.mjs --sources char_arts,github_skin --dry-run
 *   node scripts/tools/update-skins.mjs --scope all --limit 20       # 皮肤表里所有形态，本次最多 20 张
 *   node scripts/tools/update-skins.mjs --update-tables              # 先用远端最新皮肤表比对
 *   node scripts/tools/update-skins.mjs --refresh-index              # 强制重取远端目录清单
 *   node scripts/tools/update-skins.mjs --proxy http://127.0.0.1:7890 --sources github_skin --dry-run
 *
 * 参数：--scope roster|all（默认 roster）、--ids 逗号分隔形态id、--limit 本次下载上限（0=不限）、
 *   --sources 图片来源目录（默认 char_arts，可加 github_skin / char_portrait / github_portrait，顺序即优先级）、
 *   --delay 每次请求间隔毫秒、--jobs 并发数(1~3)、--max 长边上限、--colors 量化色数(0=真彩)、
 *   --out 立绘根目录、--cache 缓存目录（默认 scripts/cache）、--url 站点根、--timeout 单请求毫秒、--retry 重试次数、
 *   --proxy HTTP(S) 代理地址（默认读 HTTPS_PROXY / HTTP_PROXY；全部请求都走代理，socks5 请填其 HTTP 端口）、
 *   --github-ref GitHub 分支（默认 main）、--github-raw GitHub raw 前缀（默认 https://raw.githubusercontent.com）、
 *   --max-age 清单缓存天数、--keep-raw 保留原始图、--offline 只用缓存不联网。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG_MAGIC, assertMagick, createRemoteAssets, fmt, parseProxy, sleep } from "./lib/arknight-remote.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url)); // .../scripts/tools
const ROOT = path.dirname(path.dirname(HERE)); // 扩展包根目录

// ---------- 参数 ----------
const argv = process.argv.slice(2);
const getFlag = name => argv.includes(`--${name}`);
const getOpt = (name, def) => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};

const ORIGIN = String(getOpt("url", "https://torappu.prts.wiki")).replace(/\/+$/, "");
const GITHUB_REPO = "yuanyan3060/ArknightsGameResource";
const GITHUB_REF = String(getOpt("github-ref", "main"));
const GITHUB_API = "https://api.github.com";
const GITHUB_RAW = String(getOpt("github-raw", "https://raw.githubusercontent.com")).replace(/\/+$/, "");
//只给 api.github.com 的清单请求带 token；raw 下载走另一个域，绝不能把 token 发过去
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
//GitHub 直连不稳定时走代理；未显式给 --proxy 时沿用 curl 那套环境变量（update-arknight-data.bat 也是这么教的）
const PROXY = parseProxy(getOpt("proxy", process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || ""));
const OUT = path.resolve(getOpt("out", path.join(ROOT, "image", "illustration")));
const TARGET_DIR = path.join(OUT, "skin");
const ILLUST_DIR = path.join(OUT, "character");
const SKIN_TABLE = path.resolve(getOpt("gamedata", path.join(ROOT, "json", "arknight", "skin_table.json")));
const CHAR_TABLE = path.resolve(getOpt("chartable", path.join(ROOT, "json", "arknight", "character_table.json")));
const PATCH_TABLE = path.resolve(getOpt("patchtable", path.join(ROOT, "json", "arknight", "char_patch_table.json")));
const CACHE = path.resolve(getOpt("cache", path.join(path.dirname(HERE), "cache"))); //清单缓存/原始图/--update-tables 的临时表都落在这里
const RAW_DIR = path.join(CACHE, "skins");
const GAMEDATA_BASE = `${ORIGIN}/gamedata/latest/excel`;

const DRY = getFlag("dry-run");
const OFFLINE = getFlag("offline");
const REFRESH_INDEX = getFlag("refresh-index");
const UPDATE_TABLES = getFlag("update-tables");
const KEEP_RAW = getFlag("keep-raw");
const SCOPE = String(getOpt("scope", "roster")).toLowerCase();
/** 可当皮肤用的目录；标签会打进计划里，一眼看出这张图来自哪个站、是哪一类 */
const SOURCE_KIND = {
	char_arts: "全身立绘",
	char_portrait: "半身像",
	github_skin: "全身立绘·GitHub",
	github_portrait: "半身像·GitHub",
};
/** 清单怎么取、图片 URL 怎么拼 */
const SOURCE_PROVIDER = {
	char_arts: "prts",
	char_portrait: "prts",
	github_skin: "github",
	github_portrait: "github",
};
/** GitHub 逻辑来源 → 仓库里的实际目录 */
const GITHUB_DIRS = { github_skin: "skin", github_portrait: "portrait" };
const SOURCES = [
	...new Set(
		String(getOpt("sources", "char_arts"))
			.split(/[,\s]+/)
			.filter(Boolean)
			.map(s => s.replace(/^raw\//, "").replace(/\/+$/, ""))
	),
];
const IDS = String(getOpt("ids", ""))
	.split(/[,\s]+/)
	.filter(Boolean);
const LIMIT = parseInt(getOpt("limit", "0"), 10) || 0;
const DELAY = parseInt(getOpt("delay", "400"), 10);
const JOBS = Math.max(1, Math.min(3, parseInt(getOpt("jobs", "1"), 10) || 1));
const MAX = parseInt(getOpt("max", "1280"), 10);
const COLORS = parseInt(getOpt("colors", "256"), 10);
const MAX_AGE_DAYS = parseFloat(getOpt("max-age", "7"));
const TIMEOUT = parseInt(getOpt("timeout", "60000"), 10);
const RETRY = parseInt(getOpt("retry", "2"), 10);

const SCOPES = new Set(["roster", "all"]);
/** 一眼能看出是这个脚本在拉资源，方便站点的访问日志归类 */
const UA = "WhichWay-skin-sync (+noname extension: ShiZhiXiang)";
/** 引擎查找皮肤时的扩展名优先级就是 png > jpg > jpeg，本地判重沿用同一口径 */
const IMAGE_EXT = /\.(png|jpe?g)$/i;

const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));

/** 远端访问（代理 / 重试 / 清单缓存 / 图片 URL / 压缩）统一走 scripts/tools/lib/arknight-remote.mjs */
const remote = createRemoteAssets({
	origin: ORIGIN,
	sources: Object.fromEntries(
		SOURCES.map(dir => [dir, SOURCE_PROVIDER[dir] === "github" ? { provider: "github", dir: GITHUB_DIRS[dir] } : { provider: "prts" }])
	),
	github: { repo: GITHUB_REPO, ref: GITHUB_REF, api: GITHUB_API, raw: GITHUB_RAW, token: GITHUB_TOKEN },
	proxy: PROXY,
	cacheDir: CACHE,
	rootDir: ROOT,
	maxAgeDays: MAX_AGE_DAYS,
	timeout: TIMEOUT,
	retry: RETRY,
	offline: OFFLINE,
	refreshIndex: REFRESH_INDEX,
	ua: UA,
});
const { fetchBytes, assetUrl, loadIndex, isPng, compressImage } = remote;

/** 文件名清洗，与 scripts/tools/split-illustration.mjs 一字不差：非法字符换成间隔号，去掉结尾的点和空白 */
function sanitize(name) {
	return String(name ?? "")
		.replace(/[\\/:*?"<>|\x00-\x1f]/g, "·")
		.replace(/[.\s]+$/, "")
		.trim();
}

/**
 * 皮肤表 → 形态 id → 待补条目。
 * 只收真实皮肤（displaySkin.skinName 非空）；ILLUST_* 是立绘，归 update-portraits。
 * `_sp` 异格用「母皮肤名 + skinId 末尾序号」命名，与 split-illustration 的 `_sp` 分支一致。
 */
function buildSkins(skinTable) {
	const byForm = new Map();
	const skins = skinTable?.charSkins ?? {};
	for (const skinId in skins) {
		const e = skins[skinId];
		const group = e?.displaySkin?.skinGroupId;
		if (!e?.portraitId || !group) continue;
		if (group === "ILLUST_0" || group === "ILLUST_1" || group === "ILLUST_2") continue;
		const form = skinId.split(/[@#]/)[0];
		const base = sanitize(e.displaySkin?.skinName || group || skinId) || "未命名";
		const list = byForm.get(form) ?? [];
		byForm.set(form, list);
		list.push({ skinId, form, name: base, sp: false, portraitId: e.portraitId });
		const num = (skinId.match(/#(\d+)$/) || [])[1];
		if (e.spPortraitId && num) list.push({ skinId, form, name: `${base}${num}`, sp: true, portraitId: e.portraitId });
	}
	return byForm;
}

/** 远端文件名：`{portraitId}b.png`（split-illustration 用的那批），无 b 版本时退回 `{portraitId}.png`；异格加 `_sp` */
function findArt(index, entry) {
	if (!entry?.portraitId) return null;
	const stem = `${entry.portraitId}${entry.sp ? "_sp" : ""}`;
	return index.get(`${stem}b.png`) ?? index.get(`${stem}.png`) ?? null;
}

/** 本地皮肤：形态 id → 已有皮肤名集合（png/jpg/jpeg 都算已有，引擎按同一优先级查找） */
function loadLocalSkins() {
	const map = new Map();
	if (!fs.existsSync(TARGET_DIR)) return map;
	for (const dirent of fs.readdirSync(TARGET_DIR, { withFileTypes: true })) {
		if (!dirent.isDirectory()) continue;
		const names = new Set();
		for (const name of fs.readdirSync(path.join(TARGET_DIR, dirent.name))) {
			if (IMAGE_EXT.test(name)) names.add(name.replace(IMAGE_EXT, ""));
		}
		map.set(dirent.name, names);
	}
	return map;
}

/** 本地立绘：character/[形态id].(png|jpg) 的形态 id 集合（决定 --scope roster 的「已收录干员」） */
function loadLocalPortraits() {
	const set = new Set();
	if (!fs.existsSync(ILLUST_DIR)) return set;
	for (const name of fs.readdirSync(ILLUST_DIR)) if (IMAGE_EXT.test(name)) set.add(name.replace(IMAGE_EXT, ""));
	return set;
}

async function main() {
	if (!SCOPES.has(SCOPE)) {
		console.error(`--scope 只支持 roster | all，收到的是 ${SCOPE}`);
		process.exit(1);
	}
	const badSource = SOURCES.filter(d => !SOURCE_KIND[d]);
	if (!SOURCES.length || badSource.length) {
		console.error(`--sources 只支持 ${Object.keys(SOURCE_KIND).join(" | ")}，多出来的是 ${badSource.join(", ") || "（空）"}`);
		process.exit(1);
	}

	// ---------- 本地数据（零请求） ----------
	for (const [label, file] of [
		["skin_table", SKIN_TABLE],
		["character_table", CHAR_TABLE],
		["char_patch_table", PATCH_TABLE],
	]) {
		if (!fs.existsSync(file)) {
			console.error(`找不到${label}：${file}\n先跑 scripts/tools/update-arknight-data.bat 或 --update-tables。`);
			process.exit(1);
		}
	}
	let skinFile = SKIN_TABLE;
	let charFile = CHAR_TABLE;
	if (UPDATE_TABLES) {
		fs.mkdirSync(CACHE, { recursive: true });
		for (const [name, dest] of [
			["skin_table", path.join(CACHE, "skin_table.json")],
			["character_table", path.join(CACHE, "character_table.json")],
		]) {
			const buf = await fetchBytes(`${GAMEDATA_BASE}/${name}.json`, "application/json");
			JSON.parse(buf.toString("utf8")); //解析失败就地抛出，绝不留下半张表
			fs.writeFileSync(dest, buf);
			console.log(`表更新：${name}.json ${fmt(buf.length)} → ${path.relative(ROOT, dest)}（只写缓存目录，仓库 json/arknight/ 未改动）`);
		}
		skinFile = path.join(CACHE, "skin_table.json");
		charFile = path.join(CACHE, "character_table.json");
	}
	const bySkin = buildSkins(readJson(skinFile));
	const characters = { ...readJson(charFile), ...(readJson(PATCH_TABLE)?.patchChars ?? {}) };

	const local = loadLocalSkins();
	const portraits = loadLocalPortraits();
	const roster = new Set([...portraits, ...local.keys()]);
	const forms = IDS.length ? IDS : SCOPE === "all" ? [...bySkin.keys()] : [...roster].sort();
	const localCount = [...local.values()].reduce((sum, names) => sum + names.size, 0);

	console.log(
		`站点：${ORIGIN}${SOURCES.some(d => SOURCE_PROVIDER[d] === "github") ? ` | GitHub：${GITHUB_REPO}@${GITHUB_REF}（raw 前缀 ${GITHUB_RAW}）` : ""}${PROXY ? ` | 代理：${remote.proxyLabel}` : ""}`
	);
	console.log(`本地表：${path.relative(ROOT, skinFile)}（${bySkin.size} 个形态有皮肤）| 角色表 ${Object.keys(characters).length} 条 | 待比对形态 ${forms.length}`);
	console.log(
		`目标：${TARGET_DIR}（已有 ${local.size} 个形态目录 / ${localCount} 张皮肤）| 范围：${IDS.length ? `指定 ${IDS.length} 个形态` : `--scope ${SCOPE}`} | 图片目录：${SOURCES.map(d => `${d}(${SOURCE_KIND[d]})`).join(" → ")} | 动作：${DRY ? "仅预览(dry-run)" : "下载+压缩+落盘"}`
	);

	// ---------- 先按本地情况筛出缺口，再去问远端（按来源顺序逐个试，取到就停） ----------
	const plans = [];
	const done = [];
	const conflicts = [];
	const unknown = []; //干员表和皮肤表都查不到：多半是 id 拼错
	const noSkin = []; //干员表里有、皮肤表却没有皮肤条目
	for (const form of forms) {
		const entries = bySkin.get(form);
		if (!entries) {
			(characters[form] ? noSkin : unknown).push(form);
			continue;
		}
		const have = local.get(form) ?? new Set();
		const seen = new Set();
		for (const entry of entries) {
			if (seen.has(entry.name)) {
				conflicts.push(`${form}/${entry.name}（${entry.skinId}）`);
				continue;
			}
			seen.add(entry.name);
			if (have.has(entry.name)) {
				done.push(entry);
				continue;
			}
			plans.push({ form, entry, target: path.join(TARGET_DIR, form, `${entry.name}.png`) });
		}
	}

	let pending = plans;
	let loadedSources = 0;
	for (const dir of SOURCES) {
		if (!pending.length) break;
		let index;
		try {
			index = await loadIndex(dir);
			loadedSources++;
		} catch (e) {
			console.warn(`  ! 来源 ${dir} 的清单不可用，跳过：${String(e).split("\n")[0]}`);
			continue;
		}
		const next = [];
		for (const p of pending) {
			const art = findArt(index, p.entry);
			if (!art) {
				next.push(p);
				continue;
			}
			p.dir = dir;
			p.art = art;
			p.kind = `${SOURCE_KIND[dir] ?? dir}${p.entry.sp ? "·异格" : ""}`;
		}
		pending = next;
	}
	if (plans.length && !loadedSources) {
		console.error(`\n所有来源的清单都取不到（${SOURCES.join(", ")}），无法判断远端有没有图。检查网络/代理，或先用 --refresh-index 重取清单。`);
		process.exit(1);
	}

	const resolved = plans.filter(p => p.art);
	const noRemote = pending;
	const rank = r => Number(String(r).match(/\d+/)?.[0] ?? 0);
	resolved.sort(
		(a, b) =>
			rank(characters[b.form]?.rarity) - rank(characters[a.form]?.rarity) ||
			a.form.localeCompare(b.form) ||
			a.entry.name.localeCompare(b.entry.name)
	);
	const limited = LIMIT > 0 ? resolved.slice(0, LIMIT) : resolved;

	for (const p of limited) {
		const info = characters[p.form];
		console.log(
			`  [${p.kind}] ${p.form}/${p.entry.name}${info?.name ? `（${info.name}）` : ""}  <=  ${p.art.name} (${fmt(p.art.size)})  ->  skin/${p.form}/${p.entry.name}.png`
		);
	}
	console.log(
		`\n统计：待下载 ${limited.length}${LIMIT > 0 && resolved.length > limited.length ? `（本次限 ${LIMIT}，总缺口 ${resolved.length}）` : ""} | 原始合计 ${fmt(limited.reduce((sum, p) => sum + p.art.size, 0))}`
	);
	console.log(
		`      本地已有 ${done.length} | 远端未收录 ${noRemote.length}${noSkin.length ? ` | 无皮肤条目 ${noSkin.length}` : ""}${unknown.length && IDS.length ? ` | 表里没有的id ${unknown.length}` : ""}${conflicts.length ? ` | 同名冲突 ${conflicts.length}` : ""}`
	);
	//只有用户点名要的 id 才值得逐条报告：默认范围里混着扩展原创干员（acemrfz 等），它们在明日方舟表里本来就不存在
	if (unknown.length && IDS.length) console.log(`  表里查不到（拼错或表过期，可用 --update-tables）：${unknown.join(", ")}`);
	if (noSkin.length && IDS.length) console.log(`  皮肤表里没有这些形态的皮肤条目：${noSkin.join(", ")}（本地表过期？可用 --update-tables）`);
	if (conflicts.length) {
		console.log(
			`  同一形态下两个皮肤会落到同一个文件名（后者被跳过，请人工确认）：${conflicts.slice(0, 20).join("；")}${conflicts.length > 20 ? ` …共 ${conflicts.length} 处` : ""}`
		);
	}
	if (noRemote.length) {
		console.log(
			`  远端没有这张图（多为站点未收录，或本地皮肤表比远端新）：${noRemote.slice(0, 60).map(p => `${p.form}/${p.entry.name}`).join(", ")}${noRemote.length > 60 ? ` …共 ${noRemote.length} 张` : ""}`
		);
	}
	if (noRemote.length && !SOURCES.some(d => SOURCE_PROVIDER[d] === "github")) {
		console.log(`    → 换 GitHub 备份仓库再试一次：--sources char_arts,github_skin（命名规则相同；先 --dry-run 看还剩多少）。`);
	}
	if (noRemote.length && !SOURCES.includes("char_portrait")) {
		console.log(`    → 若站点只收录了半身像（新皮肤常见），可加 --sources char_arts,char_portrait；半身像分辨率低一个数量级，默认不收。`);
	}

	if (!limited.length) {
		console.log(`\n没有需要下载的图片，退出。`);
		return;
	}
	if (DRY) {
		console.log(`\n[dry-run] 未下载任何文件。确认无误后去掉 --dry-run 正式执行。`);
		return;
	}

	try {
		await assertMagick();
	} catch (e) {
		console.error(`\n${e.message}`);
		process.exit(1);
	}

	fs.mkdirSync(TARGET_DIR, { recursive: true });
	//原始图按来源目录分文件夹存：两个目录里有 1100+ 个同名文件（半身像与全身立绘只差体积），混在一起会互相顶掉缓存
	for (const dir of SOURCES) fs.mkdirSync(path.join(RAW_DIR, dir), { recursive: true });

	let cursor = 0;
	let saved = 0;
	let failed = 0;
	let placed = 0;
	let reused = 0;
	const workers = Array.from({ length: Math.min(JOBS, limited.length) }, async () => {
		while (cursor < limited.length) {
			const p = limited[cursor++];
			const raw = path.join(RAW_DIR, p.dir, p.art.name);
			const label = `[${cursor}/${limited.length}] ${p.form}/${p.entry.name}`;
			try {
				//断点续传：缓存里已有且字节数与远端一致才复用（半截文件会重下）
				if (fs.existsSync(raw) && fs.statSync(raw).size === p.art.size && isPng(raw)) {
					reused++;
					console.log(`  ${label} 复用缓存 ${p.art.name}`);
				} else {
					await sleep(DELAY);
					const buf = await fetchBytes(assetUrl(p.dir, p.art.path), "image/png, image/*");
					//PRTS 未知路径回的是 200 的前端 HTML 而不是 404：不校验签名就会写出一堆打不开的 .png
					if (buf.subarray(0, 8).toString("hex") !== PNG_MAGIC) throw new Error(`响应不是 PNG（${fmt(buf.length)}，站点可能没这个文件）`);
					//字节数只用来判断缓存能否复用：CDN 若重新编码过 PNG，签名对就该收下，别因体积不符把整批图卡死
					if (buf.length !== p.art.size) console.warn(`  ${label} 体积与清单不符（${fmt(buf.length)} vs ${fmt(p.art.size)}），仍按有效图收下`);
					fs.writeFileSync(raw, buf);
					console.log(`  ${label} 已下载 ${p.art.name} ${fmt(buf.length)}（${p.kind}）`);
				}
				if (fs.existsSync(p.target)) {
					console.log(`  ${label} 跳过落盘：目标已存在 ${path.relative(OUT, p.target)}`);
					continue;
				}
				fs.mkdirSync(path.dirname(p.target), { recursive: true });
				const before = fs.statSync(raw).size;
				const after = await compressImage(raw, p.target, { max: MAX, colors: COLORS });
				placed++;
				if (after < before) saved += before - after;
				console.log(`  ${label} 落盘 skin/${p.form}/${p.entry.name}.png  ${fmt(before)} → ${fmt(after)}${before <= after ? "（压缩无收益，仍已写入）" : ""}`);
				if (!KEEP_RAW) fs.rmSync(raw, { force: true });
			} catch (e) {
				failed++;
				console.error(`  ${label} 失败：${String(e).split("\n")[0]}`);
			}
		}
	});
	await Promise.all(workers);

	console.log(`\n完成：落盘 ${placed} 张，跳过 ${limited.length - placed - failed} 张（目标已存在），失败 ${failed} 张，其中复用缓存 ${reused} 张；净省 ${fmt(saved)}。`);
	console.log(KEEP_RAW ? `原始图保留在 ${RAW_DIR}（--keep-raw）` : `原始图已清理（要保留用 --keep-raw）`);
	console.log(`下一步：`);
	console.log(`  1. 新皮肤不会立刻出现在游戏里——运行期读的是 json/cache/skin.json 的磁盘扫描缓存；`);
	console.log(`     删掉它，或在游戏内「设置 → 驶舰之向 → 更新皮肤数据」点一次。`);
	console.log(`  2. 记得同步到运行目录：构建用普通 vite build（产物即 apps/core/extension/WhichWay/）。`);
	if (failed) process.exit(1);
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
