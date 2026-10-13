import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8"));
const todo = map.filter(r => r.id !== "wangmrfz");
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const walk = (d, out = []) => {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const f = path.join(d, e.name);
		e.isDirectory() ? walk(f, out) : out.push(f);
	}
	return out;
};
const NEVER = ["src/arknight/shcema.js", "src/packs/base/groups.js", "src/packs/index.ts"];
const srcFiles = walk(path.join(ROOT, "src")).filter(f => /\.(ts|js|vue)$/.test(f) && !/\.md$/.test(f));
const relOf = f => path.relative(ROOT, f).replace(/\\/g, "/");
const bad = [];
for (const f of srcFiles) {
	if (NEVER.includes(relOf(f)) || relOf(f).startsWith("src/updateLog/")) continue;
	const text = fs.readFileSync(f, "utf8");
	for (const r of todo) {
		if (r.id === "hongmrfz" && relOf(f) !== "src/packs/character/hongmrfz.ts" && !relOf(f).startsWith("src/packs/character/hongmrfz/")) continue;
		for (const re of [new RegExp(`(?<![A-Za-z0-9_])${esc(r.id)}(?![A-Za-z0-9_])`), new RegExp(`(?<![A-Za-z0-9_])${esc(r.id)}_(prefix|ab|info)(?![A-Za-z0-9_])`)]) {
			const m = re.exec(text);
			if (m) bad.push(`${relOf(f)}: 残留 ${m[0]}`);
		}
	}
}
console.log(`残留旧id: ${bad.length} 处`);
for (const b of [...new Set(bad)].slice(0, 20)) console.log("  " + b);

//新id 的注册与翻译是否成对
const missing = [];
for (const r of todo) {
	const dir = path.join(ROOT, "src", "packs", "character");
	const flat = path.join(dir, `${r.ark}.ts`);
	const idx = path.join(dir, r.ark, "index.ts");
	const file = fs.existsSync(flat) ? flat : fs.existsSync(idx) ? idx : null;
	if (!file) {
		missing.push(`${r.ark}: 找不到干员文件`);
		continue;
	}
	const text = fs.readFileSync(file, "utf8");
	if (!new RegExp(`character\\(\\s*["']${esc(r.ark)}["']`).test(text) && !new RegExp(`=\\s*["']${esc(r.ark)}["']`).test(text)) missing.push(`${r.ark}: 文件 ${relOf(file)} 里没有 character("${r.ark}") 注册`);
}
console.log(`\n注册缺失: ${missing.length} 处`);
for (const m of missing) console.log("  " + m);

//立绘齐备
const imgNames = new Set(fs.readdirSync(path.join(ROOT, "image", "character")).map(e => path.basename(e, path.extname(e))));
const noImg = todo.filter(r => !imgNames.has(r.ark));
console.log("缺立绘的新id: " + noImg.length + " 个 " + noImg.slice(0, 10).map(r => r.ark).join(", "));
