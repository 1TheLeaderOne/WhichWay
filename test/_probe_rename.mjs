// 一次性勘察脚本（离线，不参与扩展构建）：
// 统计 src/packs/character 下每个干员id 能否映射到明日方舟uid，并列出冲突/无映射项。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const CHAR_DIR = path.join(ROOT, "src", "packs", "character");

//redirect.js 的 normal 表（硬编码副本，保持与运行时一致）
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
const AMIYA = { char_1037_amiya3: "医疗阿米娅", char_1001_amiya2: "近卫阿米娅" };
const reverseAmiya = new Map(Object.entries(AMIYA).map(([k, v]) => [v, k]));

const readJson = f => JSON.parse(fs.readFileSync(path.join(ROOT, "json", "arknight", `${f}.json`), "utf8"));
const tables = [readJson("character_table"), readJson("char_patch_table").patchChars ?? {}];
const chars = [];
for (const src of tables) {
	for (const uid in src) {
		const info = src[uid];
		if (!info || typeof info.subProfessionId !== "string") continue;
		if (info.subProfessionId.startsWith("notchar")) continue;
		if (typeof info.name !== "string") continue;
		chars.push({ uid, name: info.name });
	}
}
const nameToUids = new Map();
for (const { uid, name } of chars) {
	const list = nameToUids.get(name) ?? [];
	list.push(uid);
	nameToUids.set(name, list);
}
console.log(`明日方舟可选干员总数: ${chars.length}`);

function listFiles(dir) {
	const out = [];
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, e.name);
		if (e.isDirectory()) out.push(...listFiles(full));
		else if (/\.tsx?$/.test(e.name)) out.push(full);
	}
	return out;
}

function registrations(text) {
	const keys = [];
	const re = /\bcharacter\(\s*["']([^"']+)["']\s*,/g;
	let m;
	while ((m = re.exec(text))) keys.push(m[1]);
	return keys;
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function translationOf(text, key) {
	//translate({ key: "中文名" }) 或 translate("key", "中文名")
	let m = new RegExp(`["']?${esc(key)}["']?\\s*:\\s*["']([^"']+)["']`).exec(text);
	if (m) return m[1];
	m = new RegExp(`translate\\(\\s*["']${esc(key)}["']\\s*,\\s*["']([^"']+)["']`).exec(text);
	return m?.[1];
}

const rows = [];
for (const file of listFiles(CHAR_DIR)) {
	const text = fs.readFileSync(file, "utf8");
	//文件内显式声明的 arkuid 最可靠（阿米娅三形态在表里同名，只能靠声明区分）
	const declared = /arkuid\s*:\s*["']([^"']+)["']/.exec(text)?.[1];
	for (const key of registrations(text)) {
		const cn = translationOf(text, key);
		const redirected = REDIRECT[cn] ?? cn;
		const amiyaUid = reverseAmiya.get(redirected);
		let uids = amiyaUid ? [amiyaUid] : nameToUids.get(redirected) ?? [];
		if (declared) uids = [declared];
		rows.push({ file: path.relative(CHAR_DIR, file), key, cn, declared, ark: uids });
	}
}

const noCn = rows.filter(r => !r.cn);
const noArk = rows.filter(r => r.cn && r.ark.length === 0);
const multi = rows.filter(r => r.ark.length > 1);
console.log(`\n干员注册总数: ${rows.length}  无译名: ${noCn.length}  无对应明日方舟id: ${noArk.length}  一名多uid: ${multi.length}`);

//目标id冲突：多个干员id 映射到同一个 ark uid
const byArk = new Map();
for (const r of rows) {
	if (r.ark.length === 1) byArk.set(r.ark[0], [...(byArk.get(r.ark[0]) ?? []), r.key]);
}
const dupTarget = [...byArk].filter(([, v]) => v.length > 1);
console.log(`\n多个扩展干员共用同一明日方舟uid: ${dupTarget.length}`);
for (const [uid, keys] of dupTarget) console.log(`  ${uid} <- ${keys.join(", ")}`);

console.log(`\n一名多uid（明日方舟重名干员，需人工指定）: ${multi.length}`);
for (const r of multi) console.log(`  ${r.key} (${r.cn}) -> ${r.ark.join(", ")}`);

console.log(`\n无译名（无法匹配，需人工确认）: ${noCn.length}`);
for (const r of noCn) console.log(`  ${r.file} :: ${r.key}`);

console.log(`\n无对应明日方舟id（保留原名）: ${noArk.length}`);
for (const r of noArk) console.log(`  ${r.key} (${r.cn})`);

const files = listFiles(CHAR_DIR);
const covered = new Set(rows.map(r => r.file));
const noReg = files.map(f => path.relative(CHAR_DIR, f)).filter(f => !covered.has(f));
console.log(`\n文件总数: ${files.length}  未找到 character() 注册的文件: ${noReg.length}`);
for (const f of noReg) console.log(`  ${f}`);

fs.writeFileSync(
	path.join(ROOT, "test", "_rename_map.json"),
	JSON.stringify(rows.map(r => ({ file: r.file, key: r.key, cn: r.cn, declared: r.declared ?? null, ark: r.ark.length === 1 ? r.ark[0] : null, cands: r.ark })), null, 1),
);
console.log(`\n映射已写出: test/_rename_map.json`);
