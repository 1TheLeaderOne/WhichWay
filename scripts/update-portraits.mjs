/**
 * 补齐缺失的干员立绘：从 torappu 公益资源站下载、压缩后放进 image/illustration/character/。
 *
 * 为什么日常只用「问服务器要一张目录清单」，不用「下载两张大表再比对」：
 *   缺哪张图本地就能算出来（`json/arknight/skin_table.json` 给 portraitId，本地 character 目录给已有项），
 *   真正需要问服务器的只有「远端到底有没有这个文件、叫什么名字」这一件事——一次目录清单
 *   `GET /api/v1/files/raw%2Fchar_arts`（约 400KB，缓存 7 天）就说清楚了，比两张大表（约 12MB）小两个数量级，
 *   还能避免按猜测打出一串 404：1377 个形态里远端只收录了 396 个基础立绘，其余（含全部 token/召唤物）根本不存在。
 *   `--update-tables` 保留了「先更新表再比对」的路子，但只写到缓存目录，不动仓库里的 `json/arknight/`。
 *
 * ⚠ 形态全集不能只看 skin_table：新干员会「在 `character_table` 里有、在 skin_table 里一条皮肤都没有」——只遍历 skin_table 的话连「这个干员存在」都看不见，
 *   这就是 `char_4231_clemnt` 一类角色被无声漏掉的原因。现在形态全集 = skin_table 的形态 ∪ 干员表里的干员，
 *   皮肤表缺条目的干员单列一行报告，并提示用 `--update-tables` 拿远端最新的两张表。
 *   （`update-arknight-data.bat` 与 `src/arknight/index.ts` 的 `updateArknigtData()` 现在已经会把 skin_table 一起刷新，
 *   所以这张表不再是「没人管的孤儿」；但它运行时不读（在 `loadSkipFiles` 里），本地那份新到什么程度取决于最近一次有人跑更新脚本
 *   ⇒ 上面那条并集兜底与 `--update-tables` 都照旧保留。）
 *
 * 命名与分类规则与 scripts/split-illustration.mjs 严格一致：
 *   - 形态 id = skinId 里 `@`/`#` 之前的部分；远端立绘文件名 = `portraitId + "b" + 扩展名`，
 *     但低星干员只有不带 b 的版本（如 `char_123_fang_1.png`），所以先查 `{pid}b.png` 再查 `{pid}.png`（两个图片目录同一条规则）。
 *   - 目标 = `character/[形态id].png`：优先 ILLUST_2（精二），没有精二就退回 ILLUST_0（初始）——
 *     这正是「四星以下没有精二立绘，用初始立绘替代」。判据用「skin_table 里有没有 ILLUST_2 条目」，
 *     比查 rarity 更直接：rarity 只说明该不该有，条目本身才说明能拿到哪张图（顺带覆盖了「有精二但远端未收录」）。
 *   - 范围口径抄游戏侧：`isCharacter` = `subProfessionId` 存在且不以 `notchar` 开头、
 *     `isObtainable` = `isNotObtainable !== true`（与 src/arknight/index.ts 同一条规则，字段缺失按可获取）。
 *
 * 图片来源目录（`--sources`，逗号分隔，顺序即优先级）：
 *   - `char_arts`（默认，也是唯一推荐）= 全身立绘，0.8~3.5MB，就是 `image/illustration/character/` 现在放的东西。
 *   - `char_portrait` = 半身像（战斗小人图），实测 180x360、约 120KB；而 `character/` 现有立绘长边 1280。
 *     站点未收录全身图的新干员常常只有半身图（`char_4231_clemnt`、`char_393_toledo`、`char_4232_hbound` 就是这种：
 *     补最新的 skin_table 后 char_arts 仍然 0/3 能拿到，而 char_portrait 三个人的 `_1`/`_2` 都在）。
 *     刻意**不作默认回落**：分辨率差一个数量级、裁切也不同，混进同一目录会让武将卡明显发虚，
 *     要收就自己显式加 `--sources char_arts,char_portrait`（脚本会把这类计划标成「半身像」）。
 *   - 清单缓存按目录各存一份（`scripts/cache/<目录>_index.json`），所以加一个来源只是多一次清单请求，不会重复抓。
 *
 * 对公益服务器的负担（默认范围 = 可获取干员；具体缺口每次先看 --dry-run，别凭记忆估）：串行下载（`--jobs` 最多 3）、
 *   每张之间默认隔 400ms、单次运行的请求数 = 待下载数 + 每个 `--sources` 目录至多 1 次清单（7 天内走缓存）；
 *   原始图落在缓存目录 `scripts/cache/arts/<目录>/`，大小与远端一致就复用（中断后重跑不重复下载）。
 *   放大范围（`--scope any` / `--ids`）时请自觉配 `--limit`。
 *
 * ⚠ 只新增、从不覆盖：目标已存在（png 或 jpg 都算已有）直接跳过，已有资源永不被改写；
 *   压缩依赖 ImageMagick 7（`magick`，可用 MAGICK 环境变量指定），参数与 scripts/compress-skin.mjs 同构。
 *   站点未知路径会拿 200 返回前端 HTML 而不是 404，所以每份响应都先校验 JSON/PNG 签名再落盘。
 *
 * 用法：
 *   node scripts/update-portraits.mjs --dry-run            # 只打印计划与缺口统计（每个来源目录最多一次清单，不下图）
 *   node scripts/update-portraits.mjs                      # 补齐「可获取干员」
 *   node scripts/update-portraits.mjs --scope char --limit 20   # 连预备干员/NPC 干员一起，本次最多 20 张
 *   node scripts/update-portraits.mjs --ids char_123_fang,char_208_melan
 *   node scripts/update-portraits.mjs --update-tables      # 先把远端两张表拉到缓存目录再比对（表过期时用；本地那份 skin_table 只在有人跑过更新脚本时才刷新，新干员常常还是得靠它）
 *   node scripts/update-portraits.mjs --sources char_arts,char_portrait --ids char_4231_clemnt   # 只收半身像兜底（默认不收）
 *   node scripts/update-portraits.mjs --refresh-index      # 强制重取远端目录清单
 *   node scripts/update-portraits.mjs --delay 800 --max 1024 --colors 128 --keep-raw
 *
 * 参数：--scope obtainable|char|any（默认 obtainable）、--ids 逗号分隔形态id、--limit 本次下载上限（0=不限）、
 *   --sources 图片来源目录（默认 char_arts，可加 char_portrait，顺序即优先级）、
 *   --delay 每次请求间隔毫秒、--jobs 并发数(1~3)、--max 长边上限、--colors 量化色数(0=真彩)、
 *   --out 立绘根目录、--cache 缓存目录（默认 scripts/cache）、--url 站点根、--timeout 单请求毫秒、--retry 重试次数、
 *   --max-age 清单缓存天数、--keep-raw 保留原始图、--offline 只用缓存不联网。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const MAGICK = process.env.MAGICK || "magick";
const HERE = path.dirname(fileURLToPath(import.meta.url)); // .../scripts
const ROOT = path.dirname(HERE); // 扩展包根目录

// ---------- 参数 ----------
const argv = process.argv.slice(2);
const getFlag = name => argv.includes(`--${name}`);
const getOpt = (name, def) => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};

const ORIGIN = String(getOpt("url", "https://torappu.prts.wiki")).replace(/\/+$/, "");
const OUT = path.resolve(getOpt("out", path.join(ROOT, "image", "illustration")));
const TARGET_DIR = path.join(OUT, "character");
const SKIN_TABLE = path.resolve(getOpt("gamedata", path.join(ROOT, "json", "arknight", "skin_table.json")));
const CHAR_TABLE = path.resolve(getOpt("chartable", path.join(ROOT, "json", "arknight", "character_table.json")));
const PATCH_TABLE = path.resolve(getOpt("patchtable", path.join(ROOT, "json", "arknight", "char_patch_table.json")));
const CACHE = path.resolve(getOpt("cache", path.join(HERE, "cache"))); //清单缓存/原始图/--update-tables 的临时表都落在这里
const RAW_DIR = path.join(CACHE, "arts");
const GAMEDATA_BASE = `${ORIGIN}/gamedata/latest/excel`;

const DRY = getFlag("dry-run");
const OFFLINE = getFlag("offline");
const REFRESH_INDEX = getFlag("refresh-index");
const UPDATE_TABLES = getFlag("update-tables");
const KEEP_RAW = getFlag("keep-raw");
const SCOPE = String(getOpt("scope", "obtainable")).toLowerCase();
/** 站点上可当立绘用的两个图片目录；标签会打进计划里，一眼看出这张图是哪一类 */
const SOURCE_KIND = { char_arts: "全身立绘", char_portrait: "半身像" };
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

const SCOPES = new Set(["obtainable", "char", "any"]);
/** 一眼能看出是这个脚本在拉资源，方便站点的访问日志归类 */
const UA = "WhichWay-portrait-sync (+noname extension: ShiZhiXiang)";
const PNG_MAGIC = "89504e470d0a1a0a";

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = b => (b > 1048576 ? `${(b / 1048576).toFixed(2)}MB` : `${(b / 1024).toFixed(0)}KB`);
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));

/**
 * 取一份远端内容（带超时与重试）。accept 决定站点给 JSON 还是给图——
 * `/api/v1/*` 若不带 `accept: application/json` 会被网关当成前端路由、200 返回 HTML。
 */
async function fetchBytes(url, accept) {
	let last;
	for (let attempt = 0; attempt <= RETRY; attempt++) {
		if (attempt) await sleep(1000 * attempt);
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
		try {
			const res = await fetch(url, { signal: ctrl.signal, headers: { accept, "user-agent": UA } });
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

/** 站点自己的取图规则（前端 AssetContent 就是这么拼的）：raw/ 段换成 assets/，只编码最后一段 */
function assetUrl(remotePath) {
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
 * 远端某个图片目录的清单：name → { name, path, size }。
 * 每个目录各一份缓存文件（`<目录>_index.json`），7 天内直接复用（`--refresh-index` 强制重取，`--offline` 只允许读缓存）。
 */
async function loadIndex(dir) {
	const indexFile = path.join(CACHE, `${dir}_index.json`);
	if (!REFRESH_INDEX && fs.existsSync(indexFile)) {
		try {
			const data = readJson(indexFile);
			const ageDays = (Date.now() - fs.statSync(indexFile).mtimeMs) / 86400000;
			//按「去掉子目录后的条目数」报数：children 里会夹着目录项，直接报 length 会和实际可比对的文件数对不上
			const files = data?.children ? toIndexMap(data) : null;
			if (files && ageDays <= MAX_AGE_DAYS) {
				console.log(`远端清单：读缓存 ${path.relative(ROOT, indexFile)}（${ageDays.toFixed(1)} 天前，${files.size} 个文件；--refresh-index 可强制重取）`);
				return files;
			}
			if (files && OFFLINE) {
				console.log(`远端清单：缓存已过期（${ageDays.toFixed(1)} 天）但 --offline 不联网，仍按缓存 ${files.size} 个文件计算`);
				return files;
			}
		} catch (e) {
			console.error(`  缓存清单不可用（${String(e).split("\n")[0]}），改为重新抓取`);
		}
	}
	if (OFFLINE) {
		console.error(`--offline 但缓存清单不存在：${indexFile}`);
		process.exit(1);
	}
	//路径参数里的斜杠必须编码成 %2F：未编码时网关会回落到前端页面
	const buf = await fetchBytes(`${ORIGIN}/api/v1/files/${encodeURIComponent(`raw/${dir}`)}`, "application/json");
	let data;
	try {
		data = JSON.parse(buf.toString("utf8"));
	} catch {
		throw new Error("清单响应不是 JSON（站点可能改版了）");
	}
	if (!data?.children) throw new Error("清单响应缺少 children 字段");
	fs.mkdirSync(CACHE, { recursive: true });
	fs.writeFileSync(indexFile, JSON.stringify(data));
	const files = toIndexMap(data);
	console.log(`远端清单：已抓取 ${dir} 共 ${files.size} 个文件（${fmt(buf.length)}）→ ${path.relative(ROOT, indexFile)}`);
	return files;
}

function toIndexMap(data) {
	const map = new Map();
	for (const c of data.children) if (!c.is_dir) map.set(c.name, c);
	return map;
}

/** 形态 id → { ILLUST_0, ILLUST_1, ILLUST_2, ... }；同组取第一条（同形态同组的图本来就同源） */
function buildForms(skinTable) {
	const byForm = new Map();
	const skins = skinTable?.charSkins ?? {};
	for (const skinId in skins) {
		const e = skins[skinId];
		const group = e?.displaySkin?.skinGroupId;
		if (!e?.portraitId || !group) continue;
		const form = skinId.split(/[@#]/)[0];
		const rec = byForm.get(form) ?? {};
		byForm.set(form, rec);
		if (!rec[group]) rec[group] = e.portraitId;
	}
	return byForm;
}

/** 立绘文件名规则：先 `{pid}b.png`（split-illustration 用的那批），无 b 版本时退回 `{pid}.png` */
function findArt(index, portraitId) {
	if (!portraitId) return null;
	return index.get(`${portraitId}b.png`) ?? index.get(`${portraitId}.png`) ?? null;
}

/**
 * 一个形态该拿哪张图：按 `--sources` 的顺序逐个目录试，目录内精二优先、取不到就退回初始立绘（需求第 2 条）。
 * kind 只是给报告看的，各种情况的落盘位置完全相同；半身像只有显式列进 --sources 才会被采用。
 */
function pickArt(indexes, rec) {
	for (const [dir, index] of indexes) {
		const advanced = findArt(index, rec.ILLUST_2);
		const art = advanced ?? findArt(index, rec.ILLUST_0);
		if (!art) continue;
		const tier = advanced ? "精二" : "初始替代";
		return { dir, art, kind: dir === "char_arts" ? tier : `${SOURCE_KIND[dir] ?? dir}·${tier}` };
	}
	return null;
}

/**
 * 压缩并落盘到 `character/[形态id].png`：magick 先写同目录 tmp，成功后 rename——
 * 同目录 rename 是原子操作，运行中的游戏不会读到半张图。
 * 即使「压缩无收益」也必须落盘：这一步的目的是让干员有图可用，不是省体积。
 */
async function compressInto(rawFile, target) {
	const tmp = `${target}.tmp.png`;
	const args = [rawFile, "-auto-orient", "-strip", "-colorspace", "sRGB", "-resize", `${MAX}x${MAX}>`];
	if (COLORS) {
		args.push("-colors", String(COLORS)); //量化到 ≤256 色调色板仍保留逐像素 alpha；刻意不加抖动（噪声会让 PNG 反弹体积）
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

async function main() {
	if (!SCOPES.has(SCOPE)) {
		console.error(`--scope 只支持 obtainable | char | any，收到的是 ${SCOPE}`);
		process.exit(1);
	}
	const badSource = SOURCES.filter(d => !SOURCE_KIND[d]);
	if (!SOURCES.length || badSource.length) {
		console.error(`--sources 只支持 ${Object.keys(SOURCE_KIND).join(" | ")}，多出来的是 ${badSource.join(", ") || "（空）"}\n（char_avatar 是头像、命名规则也不同，不能当立绘用）`);
		process.exit(1);
	}

	// ---------- 本地数据（零请求） ----------
	for (const [label, file] of [
		["skin_table", SKIN_TABLE],
		["character_table", CHAR_TABLE],
		["char_patch_table", PATCH_TABLE],
	]) {
		if (!fs.existsSync(file)) {
			console.error(`找不到${label}：${file}\n先跑 scripts/update-arknight-data.bat 或 --update-tables。`);
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
	const byForm = buildForms(readJson(skinFile));
	const characters = { ...readJson(charFile), ...(readJson(PATCH_TABLE)?.patchChars ?? {}) };
	const isCharacter = form => !!characters[form]?.subProfessionId && !characters[form].subProfessionId.startsWith("notchar");
	//字段缺失按可获取，与 src/arknight/index.ts 的 isObtainable 同一口径
	const isObtainable = form => characters[form]?.isNotObtainable !== true;
	const inScope = form => (IDS.length ? IDS.includes(form) : SCOPE === "any" ? true : SCOPE === "char" ? isCharacter(form) : isCharacter(form) && isObtainable(form));

	const have = new Set();
	if (fs.existsSync(TARGET_DIR)) for (const name of fs.readdirSync(TARGET_DIR)) have.add(name.replace(/\.(png|jpe?g)$/i, ""));

	//形态全集 = skin_table 的形态 ∪ 干员表里的干员：少了后半截，本地皮肤表还没收录的新干员连「被报告」的资格都没有（clemnt 那次就是这么漏的）。
	const forms = IDS.length ? IDS : [...new Set([...byForm.keys(), ...Object.keys(characters).filter(isCharacter)])];

	console.log(`站点：${ORIGIN}`);
	console.log(`本地表：${path.relative(ROOT, skinFile)}（${byForm.size} 个形态）| 角色表 ${Object.keys(characters).length} 条 | 待比对形态 ${forms.length}`);
	console.log(`目标：${TARGET_DIR}（已有 ${have.size} 张）| 范围：${IDS.length ? `指定 ${IDS.length} 个形态` : `--scope ${SCOPE}`} | 图片目录：${SOURCES.map(d => `${d}(${SOURCE_KIND[d]})`).join(" → ")} | 动作：${DRY ? "仅预览(dry-run)" : "下载+压缩+落盘"}`);

	const indexes = [];
	for (const dir of SOURCES) indexes.push([dir, await loadIndex(dir)]);

	// ---------- 分类 ----------
	const plans = [];
	const noRemote = [];
	const outOfScope = [];
	const unknown = []; //干员表和皮肤表都查不到：多半是 id 拼错
	const noSkin = []; //干员表里有、本地皮肤表却没有条目：本地 skin_table 过期，portraitId 根本无从得知
	const done = [];
	for (const form of forms) {
		if (have.has(form)) {
			done.push(form);
			continue;
		}
		if (!byForm.has(form)) {
			(characters[form] ? noSkin : unknown).push(form);
			continue;
		}
		if (!inScope(form)) {
			outOfScope.push(form);
			continue;
		}
		const picked = pickArt(indexes, byForm.get(form));
		if (!picked) {
			noRemote.push(form);
			continue;
		}
		plans.push({ form, dir: picked.dir, kind: picked.kind, art: picked.art, target: path.join(TARGET_DIR, `${form}.png`) });
	}

	const rank = r => Number(String(r).match(/\d+/)?.[0] ?? 0);
	plans.sort((a, b) => rank(characters[b.form]?.rarity) - rank(characters[a.form]?.rarity) || a.form.localeCompare(b.form));
	const limited = LIMIT > 0 ? plans.slice(0, LIMIT) : plans;

	for (const p of limited) {
		const info = characters[p.form];
		console.log(`  [${p.kind}] ${p.form}  ${info?.name ?? "?"} [${info?.rarity ?? "?"}]  <=  ${p.art.name} (${fmt(p.art.size)})  ->  character/${p.form}.png`);
	}
	console.log(`\n统计：待下载 ${limited.length}${LIMIT > 0 && plans.length > limited.length ? `（本次限 ${LIMIT}，总缺口 ${plans.length}）` : ""} | 原始合计 ${fmt(limited.reduce((a, p) => a + p.art.size, 0))}`);
	console.log(`      本地已有 ${done.length} | 范围外 ${outOfScope.length} | 远端未收录 ${noRemote.length}${noSkin.length ? ` | 皮肤表缺条目 ${noSkin.length}` : ""}${unknown.length ? ` | 表里没有的id ${unknown.length}` : ""}`);
	if (unknown.length) console.log(`  表里查不到（拼错或表过期，可用 --update-tables）：${unknown.join(", ")}`);
	if (noSkin.length) {
		noSkin.sort((a, b) => rank(characters[b.form]?.rarity) - rank(characters[a.form]?.rarity) || a.localeCompare(b));
		console.log(`  干员表里有、本地 skin_table 却没有皮肤条目：${noSkin.slice(0, 60).join(", ")}${noSkin.length > 60 ? ` …共 ${noSkin.length} 个` : ""}`);
		console.log(`    → 这批不是「远端没图」，是本地 ${path.relative(ROOT, SKIN_TABLE)} 过期（没有任何脚本会刷新它）；重跑加 --update-tables 用远端最新的两张表比对。`);
	}
	if (noRemote.length) console.log(`  远端没有这张图（多为 token/NPC 或站点未收录）：${noRemote.slice(0, 60).join(", ")}${noRemote.length > 60 ? ` …共 ${noRemote.length} 个` : ""}`);
	if (noRemote.length && !SOURCES.includes("char_portrait")) {
		console.log(`    → 其中若有站点只收录了半身像的干员（新干员常见，如 char_4231_clemnt），可加 --sources char_arts,char_portrait 收半身像；但半身像只有 180x360，放进长边 1280 的立绘目录会明显发虚，所以默认不收。`);
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
		await exec(MAGICK, ["-version"]);
	} catch {
		console.error(`\n找不到 ImageMagick（${MAGICK}）。装好后重试，或设 MAGICK 环境变量指向可执行文件。`);
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
			const label = `[${cursor}/${limited.length}] ${p.form}`;
			try {
				//断点续传：缓存里已有且字节数与远端一致才复用（半截文件会重下）
				if (fs.existsSync(raw) && fs.statSync(raw).size === p.art.size && isPng(raw)) {
					reused++;
					console.log(`  ${label} 复用缓存 ${p.art.name}`);
				} else {
					await sleep(DELAY);
					const buf = await fetchBytes(assetUrl(p.art.path), "image/png, image/*");
					//站点未知路径回的是 200 的前端 HTML，不是 404：不校验签名就会写出一堆打不开的 .png
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
				const before = fs.statSync(raw).size;
				const after = await compressInto(raw, p.target);
				placed++;
				if (after < before) saved += before - after;
				console.log(`  ${label} 落盘 character/${p.form}.png  ${fmt(before)} → ${fmt(after)}${before <= after ? "（压缩无收益，仍已写入）" : ""}`);
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
	console.log(`下一步：这些是新增资源，记得同步到运行目录——构建用普通 vite build（产物即 apps/core/extension/WhichWay/）。`);
	if (failed) process.exit(1);
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
