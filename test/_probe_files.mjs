import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const map = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8")).map(r => [r.id, r]));
const SKIP_DIR = new Set(["node_modules", "dist", ".git"]);
const hits = new Map(); //相对目录 → [文件名]
const add = (dir, name) => {
	if (!hits.has(dir)) hits.set(dir, new Set());
	hits.get(dir).add(name);
};
const idOf = n => path.basename(n, path.extname(n));
(function walk(d, depth) {
	if (depth > 4) return;
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		if (SKIP_DIR.has(e.name)) continue;
		const rel = path.relative(ROOT, path.join(d, e.name)).replace(/\\/g, "/");
		if (e.isDirectory()) {
			if (map.has(idOf(e.name))) add(path.dirname(rel), `${e.name}/`);
			walk(path.join(d, e.name), depth + 1);
		} else if (map.has(idOf(e.name))) add(rel.includes("/") ? path.dirname(rel) : "(根)", path.basename(e.name));
	}
})(ROOT, 0);
for (const [dir, set] of hits) console.log(`${dir}  (${set.size})\n   ${[...set].slice(0, 6).join(", ")}`);
