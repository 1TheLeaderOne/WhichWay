/**
 * 压缩 test/skin 下的皮肤图（默认：缩到长边 ≤1280 + 输出 PNG 并把颜色量化到 ≤256 色调色板）。
 *
 * 皮肤原图多为透明背景(RGBA)，默认保持 PNG 以保留逐像素 alpha（软边/半透明不被破坏）。
 * 进一步压缩的主力是「调色板量化」：`-colors 256` 把真彩降为 ≤256 色调色板 PNG，
 * 实测在保留 alpha 的前提下（透明均值/软边几乎不变、RMSE <1%）体积再降到真彩 PNG 的约 1/3.5。
 * ⚠ 默认不加抖动：FloydSteinberg 抖动产生的噪声会让 PNG 体积反弹数倍；
 *   若个别大图有平滑渐变出现色带，可 `--dither` 换取更平滑的渐变（体积变大），
 *   或 `--colors 0` 退回真彩 PNG（体积最大但无量化痕迹）。
 *
 * 也可 `--format jpg` 转 JPG 进一步省空间——会用 `-background <bg> -alpha remove` 把透明区
 * 拍平成一色（`--bg`，默认 white）；⚠ 若立绘在游戏里需要透明叠加，转 JPG 会烙上底色方块。
 *
 * 默认写镜像目录 `skin_compressed/`，不动原图；加 --inplace 才就地替换（先把原件备份到
 * `<目录名>_backup_original/`；转格式时同名 .png/.jpg 会被新格式取代）。依赖 ImageMagick 7 的 `magick`。
 *
 * 用法示例：
 *   node scripts/compress-skin.mjs                     # 缩到 1280 + 量化到 256 色 PNG，写入 skin_compressed/
 *   node scripts/compress-skin.mjs --max 1024          # 更小的长边上限
 *   node scripts/compress-skin.mjs --colors 0          # 真彩 PNG（不量化，仅缩放+强压缩）
 *   node scripts/compress-skin.mjs --colors 128        # 更激进量化（更小、更易出色带）
 *   node scripts/compress-skin.mjs --dither            # 量化时加抖动（渐变更平滑、体积更大）
 *   node scripts/compress-skin.mjs --format jpg        # 转 JPG（透明区拍平到 --bg）
 *   node scripts/compress-skin.mjs --inplace           # 就地覆盖（自动备份原件）
 *   node scripts/compress-skin.mjs --dry-run           # 只预测体积
 */
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const MAGICK = process.env.MAGICK || "magick";

// ---------- 参数 ----------
const argv = process.argv.slice(2);
const getFlag = name => argv.includes(`--${name}`);
const getOpt = (name, def) => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};

const DIR = path.resolve(getOpt("dir", path.join(process.cwd(), "test", "skin")));
const MAX = parseInt(getOpt("max", "1280"), 10); //长边上限（px），只缩不放
const JPG_Q = parseInt(getOpt("quality", "82"), 10);
const BG = getOpt("bg", "white"); //转 JPG 时透明区拍平到的底色
const FORMAT = (getOpt("format", "png") || "png").toLowerCase(); //png | jpg | keep
const COLORS = parseInt(getOpt("colors", "256"), 10); //量化到 N 色（png 进一步压缩的主力）；0=真彩不量化
const COLORS_EXPLICIT = argv.includes("--colors"); //jpg 仅在显式给出 --colors 时才量化（默认真彩）
const DITHER = getFlag("dither"); //量化时加 FloydSteinberg 抖动（渐变更平滑、体积更大）
const JOBS = parseInt(getOpt("jobs", "6"), 10);
const DRY = getFlag("dry-run");
const INPLACE = getFlag("inplace");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg"]);

/** 目标输出扩展名：keep=跟随源；否则用 FORMAT */
function outExt(srcExt) {
	if (FORMAT === "keep") return srcExt;
	return FORMAT === "png" ? ".png" : ".jpg";
}

function listImages(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name.startsWith("_backup") || entry.name.endsWith("_compressed") || entry.name.endsWith("_backup_original")) continue;
			out.push(...listImages(full));
		} else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
			out.push(full);
		}
	}
	return out;
}

/** 构造单张压缩命令的参数（不含输出路径）；toJpg 决定是否拍平 alpha */
function buildArgs(file, toJpg) {
	const args = [file, "-auto-orient", "-strip", "-colorspace", "sRGB", "-resize", `${MAX}x${MAX}>`];
	if (toJpg) {
		//JPG 不支持 alpha：先把透明区拍平到 BG 再关掉 alpha 通道
		args.push("-background", BG, "-alpha", "remove", "-alpha", "off");
		if (COLORS_EXPLICIT && COLORS) {
			args.push("-colors", String(COLORS));
			if (DITHER) args.push("-dither", "FloydSteinberg");
		}
		args.push("-quality", String(JPG_Q), "-sampling-factor", "4:2:0", "-interlace", "JPEG");
	} else {
		//PNG：默认量化到 ≤256 色调色板（仍保留逐像素 alpha），这是进一步压缩的主力。
		//刻意不加抖动——FloydSteinberg 的噪声会让 PNG 体积反弹数倍；需要更平滑渐变再用 --dither。
		if (COLORS) {
			args.push("-colors", String(COLORS));
			if (DITHER) args.push("-dither", "FloydSteinberg");
		} else {
			args.push("-define", "png:bit-depth=8"); //真彩 + alpha
		}
		args.push("-quality", "9", "-define", "png:compression-level=9", "-define", "png:compression-strategy=0");
	}
	return args;
}

const fmt = b => (b > 1048576 ? `${(b / 1048576).toFixed(2)}MB` : `${(b / 1024).toFixed(0)}KB`);

async function processOne(file, outDir) {
	const srcExt = path.extname(file).toLowerCase();
	const ext = outExt(srcExt);
	const toJpg = ext === ".jpg";
	const rel = path.relative(DIR, file);
	const relOut = ext === srcExt ? rel : rel.slice(0, -srcExt.length) + ext; //换格式时改扩展名
	const before = fs.statSync(file).size;

	if (DRY) {
		const { stdout } = await exec(MAGICK, ["identify", "-format", "%w %h", file]);
		const [w, h] = stdout.trim().split(/\s+/).map(Number);
		const scale = Math.min(1, MAX / Math.max(w, h));
		//缩放后的经验系数：JPG 与量化 PNG 各自约再乘 ~0.35 / ~0.32；真彩 PNG 近似只随缩放变化
		const factor = toJpg ? 0.35 : COLORS ? 0.32 : 1;
		const after = Math.round(before * scale * scale * factor);
		return { rel: relOut, before, after, wrote: false };
	}

	const target = INPLACE ? path.join(path.dirname(file), relOut) : path.join(outDir, relOut);
	fs.mkdirSync(path.dirname(target), { recursive: true });
	const tmp = `${target}.tmp${ext}`;
	await exec(MAGICK, [...buildArgs(file, toJpg), tmp]);
	const after = fs.statSync(tmp).size;
	if (after >= before) {
		fs.rmSync(tmp, { force: true });
		return { rel: relOut, before, after: before, wrote: false };
	}
	if (INPLACE) {
		const bak = path.join(path.dirname(DIR), `${path.basename(DIR)}_backup_original`, rel);
		fs.mkdirSync(path.dirname(bak), { recursive: true });
		if (!fs.existsSync(bak)) fs.copyFileSync(file, bak); //原件只备份一次（按源扩展名存）
		fs.renameSync(tmp, target);
		if (ext !== srcExt) fs.rmSync(file, { force: true }); //换格式时删掉旧扩展名文件
	} else {
		fs.renameSync(tmp, target);
	}
	return { rel: relOut, before, after, wrote: true };
}

async function run() {
	if (!fs.existsSync(DIR)) {
		console.error(`目录不存在：${DIR}`);
		process.exit(1);
	}
	const files = listImages(DIR);
	const outDir = path.join(path.dirname(DIR), `${path.basename(DIR)}_compressed`);
	console.log(`目录：${DIR}`);
	const modeDesc =
		FORMAT === "png"
			? `PNG (保留透明)${COLORS ? ` · 量化 ${COLORS} 色${DITHER ? "+抖动" : ""}` : " · 真彩"}`
			: FORMAT === "jpg"
				? `JPG (透明区拍平到 ${BG})`
				: "保持原格式";
	console.log(`图片：${files.length} 张 | 长边上限 ${MAX}px | 格式 ${modeDesc} | ` + `${INPLACE ? "就地覆盖(自动备份)" : DRY ? "仅预测" : `写入 ${outDir}`}`);
	if (files.length) {
		try {
			await exec(MAGICK, ["-version"]);
		} catch {
			console.error(`找不到 ImageMagick（${MAGICK}）。安装后重试，或设 MAGICK 环境变量指向可执行文件。`);
			process.exit(1);
		}
	}

	let cursor = 0;
	let totalBefore = 0;
	let totalAfter = 0;
	let savedBytes = 0;
	let reduced = 0;
	const workers = Array.from({ length: Math.min(JOBS, files.length) }, async () => {
		while (cursor < files.length) {
			const file = files[cursor++];
			try {
				const r = await processOne(file, outDir);
				totalBefore += r.before;
				totalAfter += r.after;
				if (r.wrote && r.after < r.before) {
					reduced++;
					savedBytes += r.before - r.after;
					console.log(`  [${cursor}/${files.length}] ${r.rel}  ${fmt(r.before)} → ${fmt(r.after)}  (-${Math.round((1 - r.after / r.before) * 100)}%)`);
				} else {
					console.log(`  [${cursor}/${files.length}] ${r.rel}  跳过（无收益）`);
				}
			} catch (e) {
				console.error(`  ✗ ${path.relative(DIR, file)}: ${String(e).split("\n")[0]}`);
			}
		}
	});
	await Promise.all(workers);

	console.log(`\n完成：${reduced}/${files.length} 张已压缩。`);
	console.log(`原始合计 ${fmt(totalBefore)} → 结果合计 ${fmt(totalAfter)}，节省 ${fmt(savedBytes)}（${totalBefore ? Math.round((savedBytes / totalBefore) * 100) : 0}%）。`);
	if (!INPLACE && !DRY) console.log(`产物目录：${outDir}`);
}

run();
