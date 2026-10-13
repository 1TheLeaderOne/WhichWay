import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8"));
const ids = new Set(map.map(r => r.id));
ids.delete("wangmrfz");
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SKIP = new Set(["node_modules", "dist", "src", ".git", "extension-test-server"]);
const hits = [];
(function walk(d, depth) {
	if (depth > 3) return;
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		if (SKIP.has(e.name) || e.name.startsWith("_backup")) continue;
		const f = path.join(d, e.name);
		if (e.isDirectory()) walk(f, depth + 1);
		else if (/\.(ts|js|json|vue|html|css)$/.test(e.name)) {
			const t = fs.readFileSync(f, "utf8");
			const found = [...ids].filter(id => new RegExp(`(?<![A-Za-z0-9_])${esc(id)}(?![A-Za-z0-9_])`).test(t));
			if (found.length) hits.push(`${path.relative(ROOT, f).replace(/\\/g, "/")} (${found.length}): ${found.slice(0, 5).join(", ")}`);
		}
	}
})(ROOT, 0);
console.log(hits.length ? `扩展根下（src 之外）残留旧id:\n  ${hits.join("\n  ")}` : "src 之外的文本文件无旧id残留");
