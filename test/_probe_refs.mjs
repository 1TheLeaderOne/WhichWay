// 一次性勘察：统计 src 内（character 目录之外）对「待改名干员id」的引用行
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "test", "_rename_map.json"), "utf8"));
const ids = map.filter(r => r.ark).map(r => r.key);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const res = ids.map(id => new RegExp(`(?<![A-Za-z0-9_])${esc(id)}(?![A-Za-z0-9_])`));

function walk(d, out = []) {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const f = path.join(d, e.name);
		if (e.isDirectory()) {
			if (f === path.join(ROOT, "src", "packs", "character")) continue;
			walk(f, out);
		} else if (/\.(ts|js|vue|json|css|md)$/.test(e.name)) out.push(f);
	}
	return out;
}

const report = [];
for (const f of walk(path.join(ROOT, "src"))) {
	const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
	lines.forEach((line, i) => {
		for (let k = 0; k < ids.length; k++) {
			if (res[k].test(line)) {
				report.push(`${path.relative(ROOT, f)}:${i + 1}  [${ids[k]}]  ${line.trim().slice(0, 110)}`);
				break;
			}
		}
	});
}
console.log(`待改名id数: ${ids.length}  外部引用行数: ${report.length}`);
for (const r of report) console.log(r);
