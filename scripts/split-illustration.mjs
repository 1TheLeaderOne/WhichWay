/**
 * 分离 image/illustration/source 下的明日方舟立绘（依据 gamedata 的 skin_table.json）。
 *
 * 分类规则（用 skinId 里 `@`/`#` 之前的「形态 id」作角色 id，能自然区分阿米娅的多形态：
 * char_002_amiya / char_1001_amiya2 / char_1037_amiya3）：
 *   - 精二立绘（skinGroupId === "ILLUST_2"）      → character/[形态id].png（剪切 + 重命名）
 *   - 真实皮肤（有 displaySkin.skinName）          → skin/[形态id]/[皮肤中文名].png
 *   - 初始 / 精一基础立绘（ILLUST_0 / ILLUST_1，无中文名）→ skin/[形态id]/初始立绘.png | 精一立绘.png
 *   - _sp 异格立绘（皮肤的 spPortraitId 变体，与母皮肤同一形态/同一皮肤）→ skin/[形态id]/[母皮肤中文名][皮肤序号].png
 *
 * 源文件名 = portraitId + "b" + 扩展名（如 char_002_amiya_2b.png ← portraitId char_002_amiya_2）；
 * _sp 变体文件名 = portraitId + "_sp" + "b" + 扩展名（gamedata 里对应 spPortraitId = "sp_" + portraitId）。
 * 脚本用「portraitId+"b"」和「portraitId+"_spb"」两个键反查 skin_table，避免从文件名硬拆角色 id。
 *
 * ⚠ 默认执行「剪切」（move）：会把文件从 source 移到 character/skin。批量移动不可逆，
 *   先加 --dry-run 预览计划，确认无误再正式跑。目标已存在或计划内部撞名都会跳过并报告，不覆盖。
 *
 * 用法：
 *   node scripts/split-illustration.mjs --dry-run          # 只打印分离计划，不动文件
 *   node scripts/split-illustration.mjs                    # 正式剪切分离
 *   node scripts/split-illustration.mjs --copy             # 复制而非剪切（保留 source 原件）
 *   node scripts/split-illustration.mjs --dir <源目录> --out <image/illustration> --gamedata <skin_table.json>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url)); // .../scripts
const ROOT = path.dirname(HERE); // 扩展包根目录

// ---------- 参数 ----------
const argv = process.argv.slice(2);
const getFlag = name => argv.includes(`--${name}`);
const getOpt = (name, def) => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};

const DIR = path.resolve(getOpt("dir", path.join(ROOT, "image", "illustration", "source")));
const OUT = path.resolve(getOpt("out", path.join(ROOT, "image", "illustration")));
const GAMEDATA = path.resolve(getOpt("gamedata", path.join(ROOT, "json", "arknight", "skin_table.json")));
const DRY = getFlag("dry-run");
const COPY = getFlag("copy");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg"]);

/** skinId → 形态 id：取 `@` 或 `#` 之前的部分（普通干员即 charId，阿米娅各形态则区分开） */
const formOf = skinId => skinId.split(/[@#]/)[0];

/** 清洗 Windows/Linux 文件名非法字符，避免皮肤中文名里的符号导致写入失败 */
function sanitize(name) {
	return String(name)
		.replace(/[\\/:*?"<>|\x00-\x1f]/g, "·")
		.replace(/[.\s]+$/g, "")
		.trim();
}

/**
 * 建反查表：
 *   key = portraitId + "b"      → 普通立绘
 *   key = portraitId + "_spb"   → 该立绘的 _sp 异格变体
 * value 带 formId / skinName / skinGroupId / sp 标志，供分类与命名。
 */
function buildIndex(skinTable) {
	const index = new Map();
	const skins = skinTable?.charSkins;
	if (!skins || typeof skins !== "object") return index;
	for (const skinId in skins) {
		const e = skins[skinId];
		const portraitId = e?.portraitId;
		if (!portraitId) continue;
		const info = {
			skinId,
			formId: formOf(skinId),
			skinName: e.displaySkin?.skinName ?? null,
			groupId: e.displaySkin?.skinGroupId ?? null,
			num: (skinId.match(/#(\d+)$/) || [])[1] || "", //皮肤在 skinId 里的序号（_sp 异格立绘命名用）
		};
		index.set(`${portraitId}b`, { ...info, sp: false });
		index.set(`${portraitId}_spb`, { ...info, sp: true });
	}
	return index;
}

/**
 * 依据分类算出目标相对路径（相对 OUT）。
 * 精二 → character/；其余（皮肤 / 初始 / 精一 / _sp）→ skin/[形态id]/。
 */
function planTarget(info, ext) {
	const formId = sanitize(info.formId);
	if (info.sp) {
		const base = sanitize(info.skinName || info.groupId || info.skinId) || "SP";
		return { kind: "皮肤·异格", to: path.join("skin", formId, `${base}${info.num}${ext}`) };
	}
	if (info.groupId === "ILLUST_2") return { kind: "精二", to: path.join("character", `${formId}${ext}`) };
	if (info.groupId === "ILLUST_1") return { kind: "精一", to: path.join("skin", formId, `精一立绘${ext}`) };
	if (info.groupId === "ILLUST_0") return { kind: "初始", to: path.join("skin", formId, `初始立绘${ext}`) };
	const nm = sanitize(info.skinName || info.groupId || info.skinId) || "未命名";
	return { kind: "皮肤", to: path.join("skin", formId, `${nm}${ext}`) };
}

function listImages(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter(en => en.isFile() && IMAGE_EXT.has(path.extname(en.name).toLowerCase()))
		.map(en => path.join(dir, en.name));
}

function run() {
	if (!fs.existsSync(DIR)) {
		console.error(`源目录不存在：${DIR}`);
		process.exit(1);
	}
	if (!fs.existsSync(GAMEDATA)) {
		console.error(`找不到 gamedata：${GAMEDATA}`);
		process.exit(1);
	}
	const index = buildIndex(JSON.parse(fs.readFileSync(GAMEDATA, "utf8")));
	const files = listImages(DIR);
	console.log(`源目录：${DIR}`);
	console.log(`目标根：${OUT}（character/ 与 skin/）`);
	console.log(`gamedata：${GAMEDATA}`);
	console.log(`图片：${files.length} 张 | 动作：${DRY ? "仅预览(dry-run)" : COPY ? "复制" : "剪切(move)"}\n`);

	const plans = [];
	const unmatched = [];
	for (const file of files) {
		const base = path.basename(file);
		const ext = path.extname(base); //含点，如 .png
		const key = base.slice(0, -ext.length); //去扩展名后的名（= portraitId+"b" 或 +"_spb"）
		const info = index.get(key);
		if (!info) {
			unmatched.push(base);
			continue;
		}
		const { kind, to } = planTarget(info, ext);
		plans.push({ from: file, to: path.join(OUT, to), kind, rel: to });
	}

	//计划内部撞名 + 目标已存在（且不是本文件自己）→ 标冲突，执行阶段跳过不覆盖
	const seen = new Map();
	const conflicts = [];
	for (const p of plans) {
		const k = p.to.toLowerCase();
		if (seen.has(k)) conflicts.push(`${path.relative(OUT, p.to)}  <=  ${path.basename(p.from)} 与 ${path.basename(seen.get(k))} 目标同名`);
		else seen.set(k, p.from);
		if (!DRY && fs.existsSync(p.to) && path.resolve(p.to) !== path.resolve(p.from)) conflicts.push(`${path.relative(OUT, p.to)}  <=  ${path.basename(p.from)} 目标已存在`);
	}

	const stat = { 精二: 0, 皮肤: 0, 皮肤·异格: 0, 初始: 0, 精一: 0 };
	for (const p of plans) stat[p.kind] = (stat[p.kind] || 0) + 1;

	for (const p of plans) console.log(`  [${p.kind}] ${path.basename(p.from)}  ->  ${p.rel}`);

	console.log(`\n分类统计：精二 ${stat.精二} | 皮肤 ${stat.皮肤} | 皮肤·异格 ${stat["皮肤·异格"]} | 初始 ${stat.初始} | 精一 ${stat.精一}`);
	if (unmatched.length) console.log(`未匹配（gamedata 无对应 portraitId，保持原位）：${unmatched.length} 张\n  ${unmatched.join("\n  ")}`);
	if (conflicts.length) console.log(`\n冲突（将跳过、不覆盖）：${conflicts.length}\n  ${conflicts.join("\n  ")}`);

	if (DRY) {
		console.log(`\n[dry-run] 未改动任何文件。确认无误后去掉 --dry-run 正式执行。`);
		return;
	}

	const skip = new Set(conflicts.map(c => c.split("  <=")[0]).map(s => path.join(OUT, s).toLowerCase()));
	let moved = 0;
	let copied = 0;
	let skipped = 0;
	for (const p of plans) {
		if (skip.has(p.to.toLowerCase())) {
			skipped++;
			continue;
		}
		fs.mkdirSync(path.dirname(p.to), { recursive: true });
		if (COPY) {
			fs.copyFileSync(p.from, p.to);
			copied++;
		} else {
			fs.renameSync(p.from, p.to);
			moved++;
		}
	}
	console.log(`\n完成：${COPY ? `复制 ${copied}` : `移动 ${moved}`} 张，跳过 ${skipped} 张（冲突）。`);
	if (!COPY) console.log(`源目录剩余：${listImages(DIR).length} 张。`);
}

run();
