import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const CHAR_DIR = path.join(ROOT, "src", "packs", "character");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8"));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const walk = (d, out = []) => {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const f = path.join(d, e.name);
		e.isDirectory() ? walk(f, out) : out.push(f);
	}
	return out;
};
const cardIds = new Set();
for (const f of walk(path.join(ROOT, "src", "packs", "card"))) {
	for (const m of fs.readFileSync(f, "utf8").matchAll(/\bcard\(\s*["']([^"']+)["']\s*,/g)) cardIds.add(m[1]);
}
console.log(`卡牌id ${cardIds.size} 个，与待改名干员id 重合: ${map.filter(r => cardIds.has(r.id)).map(r => r.id).join(", ") || "无"}`);

const files = walk(CHAR_DIR).filter(f => /\.tsx?$/.test(f));
const dyn = [];
for (const f of files) {
	const text = fs.readFileSync(f, "utf8");
	for (const r of map) {
		// id 作为模板/字符串拼接的固定前缀：`id_${...}` 或 "id_" + x
		if (new RegExp(`${esc(r.id)}_\\$\\{`).test(text) || new RegExp(`["']${esc(r.id)}_["']\\s*\\+`).test(text)) dyn.push(`${r.id} @ ${path.basename(f)}`);
	}
}
console.log(`\n干员id 被写成动态键前缀（必须跳过改名）:\n  ${dyn.join("\n  ") || "无"}`);

//自身文件里 {id}_xxx 的所有后缀（排除 prefix/ab）
const relOf = r => path.join(CHAR_DIR, r.file);
const rest = new Map();
for (const r of map) {
	if (!fs.existsSync(relOf(r))) continue;
	const text = fs.readFileSync(relOf(r), "utf8");
	for (const m of text.matchAll(new RegExp(`(?<![A-Za-z0-9_])${esc(r.id)}_([A-Za-z0-9]+)`, "g"))) {
		if (!rest.has(r.id)) rest.set(r.id, new Set());
		rest.get(r.id).add(m[1]);
	}
}
console.log("\n自身文件剩余 {id}_后缀（除 prefix/ab 外）:");
for (const [id, s] of rest) {
	const left = [...s].filter(x => x !== "prefix" && x !== "ab");
	if (left.length) console.log(`  ${id.padEnd(22)} ${left.sort().join(",")}${s.has("info") ? "   <== 含 _info" : ""}`);
}
