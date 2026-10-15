/**
 * 干员id → 明日方舟uid 批量改名脚本
 *
 * 用法：
 *   node scripts/rename-to-arkid.mjs --gen-map    # 扫描干员包 + 明日方舟 gamedata，生成映射表（人工核对用）
 *   node scripts/rename-to-arkid.mjs              # 检查模式：只打印将要做什么，不落盘
 *   node scripts/rename-to-arkid.mjs --apply      # 执行改名（代码 + 资源 + 跨文件引用）
 *   node scripts/rename-to-arkid.mjs --revert     # 按 journal 回滚（需先跑过 --apply）
 *   node scripts/rename-to-arkid.mjs --derived    # 补救：只补 {旧id}_prefix/_ab/_info 派生翻译键
 *   node scripts/rename-to-arkid.mjs --gen-migration  # 生成 src/arknight/legacyCharIds.ts（旧id→新id 存档迁移表）
 *
 * 覆盖范围（缺一都会导致立绘/皮肤/配音失配，所以是「全套同步改」）：
 *   1. src/packs/character/{old}.ts 文件名（目录形态则改目录名）
 *   2. 该文件内所有以干员id出现的字符串/对象键（character/translate/intro/title 及技能体里的自引用），
 *      以及引擎按「名字+后缀」派生的翻译键 {id}_prefix / {id}_ab / {id}_info
 *   3. 凡「文件/目录名（去扩展名）正好等于旧干员id」的资源一律跟着改名：
 *      image/character、image/skin、image/modules、image/skill/{技能}/{id}.png、
 *      dynamicSkin/illust、audio/{语言}/die
 *   4. audio/{语言}/{技能}_{干员}{序号}.mp3；卡id 由 `${NAME}` 拼出时的 image/card/{卡}_{干员}.png
 *   5. 跨文件引用：src/skin/dynamicConfig.js、src/packs/base/characterDesigner.js、
 *      src/packs/card/**、src/modules/**、src/GloriousIdeal/**、src/updateLog/updateContentCurrent.js
 *
 * 刻意不动：
 *   - 技能id / 卡牌id / 势力(group)id：只改「干员id」
 *   - 以干员id 为前缀的技能id（fengxumrfz_youyimrfz 这类）：注册与引用是同一串字面量，保持原样即自洽
 *   - src/arknight/shcema.js、src/packs/base/groups.js：group 定义（有干员与势力同名的情况，如 hongmrfz）
 *   - *.md 更新日志：历史记录不改写
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const CHAR_DIR = path.join(ROOT, "src", "packs", "character");
const MAP_FILE = path.join(HERE, "arkid-rename-map.json");
const JOURNAL = path.join(HERE, "arkid-rename-journal.json");

const argv = process.argv.slice(2);
const MODE =
	argv.includes("--apply") ? "apply" : argv.includes("--revert") ? "revert" : argv.includes("--gen-map") ? "genmap" : argv.includes("--derived") ? "derived" : argv.includes("--gen-migration") ? "migration" : "check";

const read = f => fs.readFileSync(f, "utf8");
const readJson = f => JSON.parse(read(path.join(ROOT, "json", "arknight", `${f}.json`)));
const rel = p => path.relative(ROOT, p).replace(/\\/g, "/");
const idOf = name => path.basename(name, path.extname(name));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const tokenRe = id => new RegExp(`(?<![A-Za-z0-9_])${esc(id)}(?![A-Za-z0-9_])`, "g");

// ===== 与运行时 redirect.js 保持一致的译名重定向 =====
const REDIRECT = {
	爱布拉娜: "死芒",
	隐德莱希: "隐德来希",
	奇尔查克: "齐尔查克",
	紫野遥: "遥",
	逻格斯: "逻各斯",
	行著: "行箸",
	mon3tr: "Mon3tr",
	ASH: "灰烬",
	弗里斯腾: "Friston-3",
	太刀侠火龙S黑角: "火龙S黑角",
	云青萍: "录武官",
	玛露希尔: "玛露西尔",
	Christine: "Miss.Christine",
};
const AMIYA_ALIAS = { 医疗阿米娅: "char_1037_amiya3", 近卫阿米娅: "char_1001_amiya2" };

//两个扩展干员映射到同一明日方舟uid时，落选者保留原名（一个uid不能给两个干员）
const DROP = new Set(["plot_keluxiermrfz"]);

/** 明日方舟全量可选干员：character_table 主表 + char_patch_table 升变形态，按 isCharacter 过滤 */
function arkCharacters() {
	const tables = [readJson("character_table"), readJson("char_patch_table").patchChars ?? {}];
	const out = [];
	for (const src of tables) {
		for (const uid in src) {
			const info = src[uid];
			if (typeof info?.subProfessionId !== "string") continue;
			if (info.subProfessionId.startsWith("notchar")) continue;
			if (typeof info.name !== "string") continue;
			out.push({ uid, name: info.name });
		}
	}
	return out;
}

function walk(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const f = path.join(dir, e.name);
		if (e.isDirectory()) walk(f, out);
		else out.push(f);
	}
	return out;
}

const charFiles = () => walk(CHAR_DIR).filter(f => /\.tsx?$/.test(f));

/** 干员模块的「名」：扁平形态取文件名（去扩展名），目录形态取目录名 */
function moduleBase(file) {
	const name = path.basename(file).replace(/\.tsx?$/, "");
	return name === "index" ? path.basename(path.dirname(file)) : name;
}

/** 是否目录形态（{id}/index.ts） */
const isDirForm = file => path.basename(file).replace(/\.tsx?$/, "") === "index";

/**
 * 解析一个干员文件里注册的干员id。
 * 支持字面量形态 character("id", {...}) 与变量形态（const NAME = "id" / function (name = "id")）。
 */
function extractIds(text, basename) {
	const ids = new Set();
	const varNames = new Set();
	for (const m of text.matchAll(/\bcharacter\(\s*["']([^"']+)["']\s*,/g)) ids.add(m[1]);
	for (const m of text.matchAll(/\bcharacter\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g)) varNames.add(m[1]);
	for (const v of varNames) {
		const lit =
			new RegExp(`(?:const|let|var)\\s+${esc(v)}\\s*=\\s*["']([^"']+)["']`).exec(text)?.[1] ??
			new RegExp(`\\(\\s*${esc(v)}\\s*=\\s*["']([^"']+)["']`).exec(text)?.[1];
		ids.add(lit ?? basename);
	}
	return { ids: [...ids], varNames: [...varNames] };
}

/** 取干员中文名：translate({ id: "中文" }) / translate("id", "中文") / translate({ [VAR]: "中文" }) */
function translationOf(text, id, varNames) {
	const patterns = [`["']?${esc(id)}["']?\\s*:\\s*["']([^"']+)["']`, `translate\\(\\s*["']${esc(id)}["']\\s*,\\s*["']([^"']+)["']`];
	for (const v of varNames) patterns.push(`\\[\\s*${esc(v)}\\s*\\]\\s*:\\s*["']([^"']+)["']`, `\\b${esc(v)}\\s*:\\s*["']([^"']+)["']`);
	for (const p of patterns) {
		const m = new RegExp(p).exec(text);
		if (m) return m[1];
	}
}

function buildMap() {
	const chars = arkCharacters();
	const nameToUids = new Map();
	for (const { uid, name } of chars) {
		const list = nameToUids.get(name) ?? [];
		if (!list.includes(uid)) list.push(uid);
		nameToUids.set(name, list);
	}

	const rows = [];
	for (const file of charFiles()) {
		const text = read(file);
		const { ids, varNames } = extractIds(text, moduleBase(file));
		if (ids.size === 0) continue;
		//文件内显式声明的 arkuid 最可靠（阿米娅三形态在表里同名，只能靠声明区分）
		const declared = /arkuid\s*:\s*["']([^"']+)["']/.exec(text)?.[1];
		for (const id of ids) {
			const cn = translationOf(text, id, varNames);
			const redirected = REDIRECT[cn] ?? cn;
			let cands = nameToUids.get(redirected) ?? [];
			if (cands.length === 0 && AMIYA_ALIAS[redirected]) cands = [AMIYA_ALIAS[redirected]];
			if (declared) cands = [declared];
			rows.push({ file: rel(file).replace("src/packs/character/", ""), id, cn, declared: declared ?? null, cands, ark: cands.length === 1 ? cands[0] : null });
		}
	}

	//同一 uid 被多个干员认领时，按 DROP 名单剔除落选者
	for (const r of rows) {
		if (DROP.has(r.id)) r.ark = null;
	}
	return rows;
}

// ===================================================================
// --gen-map
// ===================================================================
if (MODE === "genmap") {
	const rows = buildMap();
	const mapped = rows.filter(r => r.ark && !DROP.has(r.id));
	fs.writeFileSync(MAP_FILE, JSON.stringify(mapped.map(r => ({ file: r.file, id: r.id, ark: r.ark, cn: r.cn })), null, 1));
	console.log(`注册总数 ${rows.length}  可改名 ${mapped.length}  保留原名 ${rows.length - mapped.length}`);
	console.log(`映射已写入 ${rel(MAP_FILE)}`);
	process.exit(0);
}

// ===================================================================
// check / apply / revert
// ===================================================================
if (!fs.existsSync(MAP_FILE)) {
	console.error(`缺少映射表 ${rel(MAP_FILE)}，先跑 --gen-map`);
	process.exit(1);
}
/** @type {{file:string,id:string,ark:string,cn:string}[]} */
const map = JSON.parse(read(MAP_FILE));

//group id 清单：与 group 同名的干员id 只能改自己文件与资源，绝不能参与跨文件替换
const groupIds = new Set(JSON.parse(/whichWay:\s*(\[[^\]]*\])/.exec(read(path.join(ROOT, "src", "arknight", "shcema.js")))[1]));

const CROSS_FILES = [
	"src/skin/dynamicConfig.js",
	"src/packs/base/characterDesigner.js",
	"src/modules/data.ts",
	"src/updateLog/updateContentCurrent.js",
].map(p => path.join(ROOT, p));
const CROSS_DIRS = ["src/packs/card", "src/GloriousIdeal", "src/characterCard", "src/config", "src/audio", "src/skin", "src/poptip", "src/modules", "src/dataManager", "src/tips", "css"].map(p => path.join(ROOT, p));
const NEVER = ["src/arknight/shcema.js", "src/packs/base/groups.js"].map(p => path.join(ROOT, p));

/** 参与替换的全部源文件：干员文件 + 跨文件目录里的 ts/js/vue（排除 NEVER） */
const sourceFiles = [
	...charFiles(),
	...[...CROSS_FILES, ...CROSS_DIRS.flatMap(d => walk(d))].filter(f => /\.(ts|js|vue)$/.test(f) && !NEVER.includes(f) && !f.startsWith(CHAR_DIR)),
];

/**
 * ===== 与干员id 同名的键：三种情况三种处理 =====
 *
 * 1) 引擎按「名字 + 后缀」派生取键，裸 token 替换命中不了 `id_prefix` 这种带下划线的写法，
 *    所以这三族必须显式跟着改名（apps/core/noname/get/index.js:3058~3087 的
 *    lib.translate[str + "_prefix"] / ["_ab"]，以及技能/武将描述的 `_info`）：
 *      prefix、ab、info
 *    `_info` 会跟卡牌描述键同名，但本扩展的卡牌id 与干员id 零重合（下面 cardIds 会校验），
 *    所以跟着改是安全的。
 *
 * 2) 其余 `{id}_xxx` 是「以干员id 为前缀的技能id」（fengxumrfz_youyimrfz、tifengmrfz_lieshimrfz），
 *    注册、skills 列表、translate 键全是同一串字面量，任何替换规则都不会碰它，保持原样即自洽。
 *
 * 3) 真正会失配的是**模板拼接前缀**：源码写成 `id_${key}` 或 "id_" + key
 *    （wangmrfz/index.ts 的 `wangmrfz_${key}` 就是这种）。改名后引擎按新id 取值，
 *    而模板里的字面量还是旧id —— 这种干员整体跳过不改，并在报告里列出。
 */
const DERIVED_SUFFIXES = ["prefix", "ab", "info"];
//只替换「id 作为整段前缀 + 下划线 + 该后缀」里的 id 部分，后缀与下划线原样保留
const derivedRe = (id, sfx) => new RegExp(`(?<![A-Za-z0-9_])${esc(id)}(?=_${esc(sfx)}(?![A-Za-z0-9_]))`, "g");
const dynPrefixRe = id => new RegExp(`(?:${esc(id)}_\\$\\{|["']${esc(id)}_["']\\s*\\+)`);

const texts = new Map();
for (const f of sourceFiles) texts.set(f, read(f));

/**
 * 卡牌id：`card("id", {…})`，注意卡牌文件里是 `import { card as cardHook }`，
 * 所以调用名可能是 cardHook/cardX 之类的别名。
 */
const cardIds = new Set();
for (const f of walk(path.join(ROOT, "src", "packs", "card"))) {
	if (!/\.tsx?$/.test(f)) continue;
	for (const m of read(f).matchAll(/\bcard[A-Za-z]*\(\s*["']([^"']+)["']\s*,/g)) cardIds.add(m[1]);
}

const skipped = new Map();
const hasDerivedKey = (text, id) => DERIVED_SUFFIXES.some(s => new RegExp(derivedRe(id, s).source, "g").test(text));
for (const r of map) {
	const own = texts.get(path.join(CHAR_DIR, r.file)) ?? "";
	if (dynPrefixRe(r.id).test(own)) skipped.set(r.id, "自身文件里有 `{id}_${…}` 动态键前缀，改名会让派生键失配");
	else if (cardIds.has(r.id) && hasDerivedKey(own, r.id)) skipped.set(r.id, "干员id 与卡牌id 同名，`{id}_info` 无法区分归属");
}
const todo = map.filter(r => !skipped.has(r.id));
const groupScoped = new Set(todo.filter(r => groupIds.has(r.id)).map(r => r.id));
const skippable = (id, file) => groupScoped.has(id) && !file.startsWith(path.join(CHAR_DIR, id));

if (MODE === "derived") {
	//只补派生翻译键：改名已经落盘、但 {旧id}_prefix/_ab/_info 没跟着变的补救通道
	let files = 0;
	let keys = 0;
	for (const [file, before] of texts) {
		let after = before;
		for (const r of todo.filter(x => !skippable(x.id, file))) {
			for (const s of DERIVED_SUFFIXES) {
				const re = derivedRe(r.id, s);
				keys += (after.match(re) ?? []).length;
				after = after.replace(re, r.ark);
			}
		}
		if (after === before) continue;
		files++;
		fs.writeFileSync(file, after);
	}
	console.log(`派生键补齐：改 ${files} 个文件，${keys} 处 {旧id}_prefix/_ab/_info`);
	process.exit(0);
}

// ===================================================================
// --gen-migration：把「旧id → 新id」表写进 json/legacyCharIds.json，供一次性存档迁移读取
// ===================================================================

/**
 * 手工补录的「旧id → uid」。
 *
 * `--gen-map` 是**扫描当前干员文件**产出映射的，所以「文件早就改成 uid、旧id 从此扫不出来」的
 * 干员永远不会再出现在映射表里，可玩家存档中的旧键仍然在——迁移表认不得它就等于皮肤/配音/模组
 * 全部对不上。`amiyamrfz` 属于这一类（改名时没进 arkid-rename-map.json，resources 里还留着
 * image/character/amiyamrfz.jpg、audio/{语言}/die/amiyamrfz.mp3 这些旧名文件）。
 *
 * 加了新条目就要同步 `json/legacyCharIds.json`，别只改这一处。
 */
const MANUAL_MIGRATIONS = {
	amiyamrfz: "char_002_amiya",
};

if (MODE === "migration") {
	//当前仍注册的干员id：用来分辨「保留原名」和「其实已经改名了」
	const registered = new Set();
	for (const f of charFiles()) {
		for (const id of extractIds(texts.get(f) ?? read(f), moduleBase(f)).ids) registered.add(id);
	}

	const rows = new Map(todo.map(r => [r.id, r.ark]));
	//因 `{id}_${key}` 动态键被跳过、但事后仍被改成 uid 的干员（wangmrfz → char_2027_wang）：
	//旧id 已不在注册表里 ⇒ 存档里的旧键必须迁移，否则皮肤/动皮目录全查不到
	for (const r of map) {
		if (skipped.has(r.id) && !registered.has(r.id) && registered.has(r.ark)) rows.set(r.id, r.ark);
	}
	for (const [id, ark] of Object.entries(MANUAL_MIGRATIONS)) {
		if (registered.has(id)) {
			console.warn(`MANUAL_MIGRATIONS 里的 ${id} 仍在注册表中（还没改名？），不写进迁移表`);
			continue;
		}
		rows.set(id, ark);
	}

	const sorted = [...rows.entries()].sort((a, b) => a[0].localeCompare(b[0]));
	const outJson = path.join(ROOT, "json", "legacyCharIds.json");
	const outTs = path.join(ROOT, "src", "arknight", "legacyCharIds.ts");
	//JSON 不允许可尾逗号（TS 对象字面量允许，所以旧的 .ts 写法不能照搬）
	fs.writeFileSync(outJson, `${JSON.stringify(Object.fromEntries(sorted), null, "\t")}\n`);
	fs.writeFileSync(
		outTs,
		`import legacyCharIdsJson from "../../json/legacyCharIds.json";

/**
 * 旧干员id → 明日方舟uid 映射表
 *
 * 表体是纯数据，落在 \`json/legacyCharIds.json\`（构建时由 viteStaticCopy 原样带进产物的 \`json/\`，
 * 也方便脱离 TS 阅读、比对与外部工具复用）。这里用**静态 import** 而不是 \`whichWayFile.readFile\`：
 * \`arkidMigration\` 必须赶在任何阶段模块求值之前把存档改写完（见其文件注释），
 * 换成异步读文件等于把一次性迁移压在 \`game.promises\` 上——环境不支持或读失败就是静默丢配置。
 *
 * 由 \`node scripts/rename-to-arkid.mjs --gen-migration\` 从 scripts/arkid-rename-map.json 生成，
 * 请勿手工编辑 JSON。改名前的玩家存档（皮肤/配音/模组/冲突皮肤/战役进度）里的键仍是旧id，
 * 由 src/arknight/arkidMigration.ts 在启动时按此表一次性改写。
 *
 * 表里只有**实际改过名**的干员：仍保留原名的干员不在表内，迁移时自然跳过。
 * 例外是 \`MANUAL_MIGRATIONS\`（脚本 \`--gen-map\` 扫的是当前干员文件，旧id 已经不在文件名里的
 * 干员永远扫不出来，但玩家存档里的旧键仍在，所以必须手工补录）。
 */
export const legacyCharIds: Record<string, string> = legacyCharIdsJson;
`,
	);
	console.log(`迁移表已写入 ${rel(outJson)}（${sorted.length} 条）+ 读取入口 ${rel(outTs)}`);
	process.exit(0);
}

const problems = [];
//扩展里「全部」干员id（含不改名的），用于检测新id是否撞名
const everyCharId = new Set();
for (const f of charFiles()) {
	for (const id of extractIds(texts.get(f) ?? read(f), moduleBase(f)).ids) everyCharId.add(id);
}

for (const r of map) {
	if (r.id === r.ark) problems.push(`${r.id}: 新旧id相同`);
	const fileBase = r.file.replace(/\/?index\.tsx?$/, "").replace(/\.tsx?$/, "");
	if (fileBase && fileBase !== r.id) problems.push(`${r.id}: 文件名与id不一致（${r.file}），需人工确认`);
	if (groupIds.has(r.id)) problems.push(`${r.id}: 同时是势力(group)id —— 已自动限制为「只改自身文件+资源」`);
	if (cardIds.has(r.ark) || groupIds.has(r.ark)) problems.push(`${r.id} → ${r.ark}: 新id与卡牌/势力id撞名`);
	if (everyCharId.has(r.ark) && !todo.some(x => x.id === r.ark)) problems.push(`${r.id} → ${r.ark}: 新id已被扩展里另一个不改名的干员占用`);
	const dup = map.filter(x => x.ark === r.ark);
	if (dup.length > 1) problems.push(`${r.ark}: 被 ${dup.map(d => d.id).join(", ")} 同时认领`);
}

//资源清单
const renamed = new Set();
function renameFile(from, to, kind) {
	if (!fs.existsSync(from)) return;
	const key = `${from}->${to}`;
	if (renamed.has(key)) return;
	renamed.add(key);
	actions.push({ kind, from: rel(from), to: rel(to) });
	if (MODE === "apply") {
		//目录改名绝不能先 mkdir 目标：否则 renameSync 会把源目录整体挪进目标目录里面
		if (!fs.statSync(from).isDirectory()) fs.mkdirSync(path.dirname(to), { recursive: true });
		if (fs.existsSync(to)) {
			console.error(`目标已存在，拒绝覆盖: ${rel(to)}`);
			process.exit(1);
		}
		fs.renameSync(from, to);
	}
}
const actions = [];
const textEdits = [];

function applyText(file, replacers) {
	if (MODE === "revert") return;
	const before = read(file);
	let after = before;
	for (const { re, to } of replacers) after = after.replace(re, to);
	if (after === before) return;
	textEdits.push(rel(file));
	if (MODE === "apply") fs.writeFileSync(file, after);
}

if (MODE === "revert") {
	if (!fs.existsSync(JOURNAL)) {
		console.error("没有 journal，无法回滚（请从 _backup_before_arkid_rename_src 恢复）");
		process.exit(1);
	}
	const j = JSON.parse(read(JOURNAL));
	for (const a of j.actions) {
		const from = path.join(ROOT, a.to);
		const to = path.join(ROOT, a.from);
		if (fs.existsSync(from)) {
			fs.mkdirSync(path.dirname(to), { recursive: true });
			fs.renameSync(from, to);
		}
	}
	console.log(`已按 journal 回滚 ${j.actions.length} 项资源/文件改名。代码内容请用 _backup_before_arkid_rename_src 覆盖。`);
	process.exit(0);
}

// ---- 文本替换：先把所有源码改完，再改文件名（改名后旧路径就不存在了） ----
//派生键（{id}_prefix / {id}_ab / {id}_info）先改，剩下的裸 id 再改；
//派生键改完后变成 {新id}_prefix，裸 token 替换不会再命中（新id 后面跟着下划线）。
const replacersFor = file =>
	todo
		.filter(r => !skippable(r.id, file))
		.flatMap(r => [...DERIVED_SUFFIXES.map(s => ({ re: derivedRe(r.id, s), to: r.ark })), { re: tokenRe(r.id), to: r.ark }]);
for (const file of texts.keys()) applyText(file, replacersFor(file));

// ---- 文件（目录）改名 ----
for (const r of todo) {
	if (/index\.tsx?$/.test(r.file)) {
		//目录形态 {id}/index.ts：改目录名即可，内部入口文件名保持 index.ts
		renameFile(path.join(CHAR_DIR, r.id), path.join(CHAR_DIR, r.ark), "dir");
	} else {
		renameFile(path.join(CHAR_DIR, r.file), path.join(CHAR_DIR, `${r.ark}${path.extname(r.file)}`), "file");
	}
}

// ---- 资源：凡「文件/目录名（去扩展名）正好等于旧干员id」的一律跟着改名 ----
//按 id 取文件的目录都在这里覆盖到了：image/character、image/skin、image/modules、
//image/skill/{技能id}/{干员id}.png、dynamicSkin/illust、audio/{语言}/die。
const RES_SKIP = new Set(["node_modules", "dist", "scripts", "src", "test", "typings", "_backup_before_arkid_rename_src"]);
const byOldId = new Map(map.filter(r => !skipped.has(r.id)).map(r => [r.id, r]));
/** @type {{abs:string,isDir:boolean}[]} */
const resHits = [];
(function scan(dir, depth) {
	if (depth > 4) return;
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		if (RES_SKIP.has(e.name) || e.name.startsWith("_backup")) continue;
		const abs = path.join(dir, e.name);
		if (byOldId.has(idOf(e.name))) resHits.push({ abs, isDir: e.isDirectory() });
		if (e.isDirectory()) scan(abs, depth + 1);
	}
})(ROOT, 0);

//image/card/{前缀}_{干员id}.png：卡id 若由 `${NAME}` 拼出（gelani 的四匹马），改名后路径跟着变，图必须一起改；
//源码里能原样找到 "前缀_旧id" 这串字面量的（tower_shiximrfz、SP_jixieshimrfz）说明卡id 是写死的，图保持不动。
const sourceBlob = [...texts.values()].join("\n");
const cardImgDir = path.join(ROOT, "image", "card");
const cardImgs = fs.existsSync(cardImgDir) ? fs.readdirSync(cardImgDir) : [];
for (const r of todo) {
	for (const e of cardImgs) {
		const base = idOf(e);
		if (!base.endsWith("_" + r.id)) continue;
		const prefix = base.slice(0, -(r.id.length + 1));
		if (sourceBlob.includes(`${prefix}_${r.id}`)) continue;
		renameFile(path.join(cardImgDir, e), path.join(cardImgDir, `${prefix}_${r.ark}${path.extname(e)}`), "cardImg");
	}
}
function resKind(hit) {
	const [top, second] = rel(hit.abs).split("/");
	if (top === "audio") return "dieAudio";
	if (top === "dynamicSkin") return "dycIllust";
	if (top === "image") return second === "skin" ? "skin" : second === "character" ? "img" : "otherImg";
	return "other";
}
for (const hit of resHits) {
	const r = byOldId.get(idOf(hit.abs));
	renameFile(hit.abs, path.join(path.dirname(hit.abs), `${r.ark}${hit.isDir ? "" : path.extname(hit.abs)}`), resKind(hit));
}

// ---- 配音：{技能}_{干员}{序号}.mp3 形态（文件名里干员id 不是整段，上面扫不到） ----
const skillAudioIndex = new Map();
for (const lang of fs.readdirSync(path.join(ROOT, "audio"))) {
	const langDir = path.join(ROOT, "audio", lang);
	if (!fs.statSync(langDir).isDirectory()) continue;
	skillAudioIndex.set(langDir, fs.readdirSync(langDir).filter(e => fs.statSync(path.join(langDir, e)).isFile()));
}
for (const r of todo) {
	for (const [langDir, files] of skillAudioIndex) {
		for (const e of files) {
			//只有下划线后的那段完整等于旧干员id才改名
			const m = new RegExp(`^(.+)_(?:${esc(r.id)})(\\d*)$`).exec(idOf(e));
			if (m) renameFile(path.join(langDir, e), path.join(langDir, `${m[1]}_${r.ark}${m[2]}${path.extname(e)}`), "skillAudio");
		}
	}
}

// ---- 报告 ----
console.log(`模式: ${MODE}`);
console.log(`映射 ${map.length} 条 → 实际改名 ${todo.length} 条`);
console.log(`\n跳过改名 ${skipped.size} 个:`);
for (const [id, why] of skipped) console.log(`  ${id}: ${why}`);
console.log(`\ngroup 同名、只改自身文件+资源: ${[...groupScoped].join(", ") || "无"}`);
console.log(`\n问题 ${problems.length} 项:`);
for (const p of [...new Set(problems)]) console.log(`  ${p}`);
const byKind = {};
for (const a of actions) byKind[a.kind] = (byKind[a.kind] ?? 0) + 1;
console.log(`\n文件/资源改名 ${actions.length} 项: ${Object.entries(byKind).map(([k, v]) => `${k}=${v}`).join("  ")}`);
console.log(`文本改动文件 ${textEdits.length} 个（前 20 个）:`);
for (const f of textEdits.slice(0, 20)) console.log(`  ${f}`);

if (MODE === "check") {
	console.log(`\n（检查模式，未写盘。示例前 15 条改名）`);
	for (const r of todo.slice(0, 15)) console.log(`  ${r.id} (${r.cn}) → ${r.ark}`);
	process.exit(0);
}

//皮肤缓存里存的是旧目录路径，改名后必须作废重建
const skinCache = path.join(ROOT, "json", "cache", "skin.json");
if (fs.existsSync(skinCache)) fs.rmSync(skinCache);

fs.writeFileSync(
	JOURNAL,
	JSON.stringify({ at: new Date().toISOString(), mode: MODE, map, actions, textEdits }, null, 1),
);
console.log(`\n完成。journal: ${rel(JOURNAL)}`);
console.log(`旧id→新id 的存档迁移由扩展启动时自动执行（src/updateLog 里记为一次性迁移），皮肤缓存已作废：${rel(skinCache)}`);
