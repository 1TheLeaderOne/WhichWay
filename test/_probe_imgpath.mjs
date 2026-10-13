import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8"));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const walk = (d, out = []) => {
	if (!fs.existsSync(d)) return out;
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const f = path.join(d, e.name);
		e.isDirectory() ? walk(f, out) : out.push(f);
	}
	return out;
};
const files = walk(path.join(ROOT, "src")).filter(f => /\.(ts|js|vue)$/.test(f));
if (fs.existsSync(path.join(ROOT, "extension.js"))) files.push(path.join(ROOT, "extension.js"));
const byDir = new Map();
const ids = new Map(map.map(r => [r.id, r]));
for (const f of files) {
	const text = fs.readFileSync(f, "utf8");
	for (const m of text.matchAll(/([\w\-./]*?)(?<![A-Za-z0-9_])([a-z0-9_]+)\.(png|jpe?g|webp|gif|mp3|ogg)/g)) {
		const r = ids.get(m[2]);
		if (!r) continue;
		const dir = m[1].replace(/[^/]*$/, "");
		const key = dir || "(裸文件名)";
		if (!byDir.has(key)) byDir.set(key, []);
		byDir.get(key).push(`${m[2]}.${m[3]} @ ${path.basename(f)}`);
	}
}
for (const [k, list] of [...byDir].sort((a, b) => b[1].length - a[1].length)) console.log(`${k}  (${list.length})\n  ${list.slice(0, 8).join("\n  ")}`);
