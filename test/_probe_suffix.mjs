import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const CHAR_DIR = path.join(ROOT, "src", "packs", "character");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8"));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const own = new Map(map.map(r => [r.id, r.file]));

const suffixOwn = new Map();
const suffixOther = new Map();
const walk = (d, out = []) => {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const f = path.join(d, e.name);
		e.isDirectory() ? walk(f, out) : out.push(f);
	}
	return out;
};
for (const file of walk(CHAR_DIR).filter(f => /\.tsx?$/.test(f))) {
	const text = fs.readFileSync(file, "utf8");
	const relFile = path.relative(CHAR_DIR, file).replace(/\\/g, "/");
		for (const r of map) {
			const isOwn = own.get(r.id) === relFile;
			for (const m of text.matchAll(new RegExp(`(?<![A-Za-z0-9_])${esc(r.id)}_([A-Za-z0-9]+)`, "g"))) {
				const target = isOwn ? suffixOwn : suffixOther;
				if (!target.has(r.id)) target.set(r.id, new Map());
				const s = target.get(r.id);
				s.set(m[1], (s.get(m[1]) ?? 0) + 1);
			}
		}
	}
console.log("=== 自身文件内的 {id}_后缀 ===");
for (const [id, s] of suffixOwn) console.log(`  ${id.padEnd(24)} ${[...s.keys()].sort().join(",")}`);
console.log(`\n=== 自身无、但别的干员文件里有 {id}_后缀 的 ===`);
for (const [id, s] of suffixOther) if (!suffixOwn.has(id)) console.log(`  ${id.padEnd(24)} ${[...s.keys()].sort().join(",")}`);
