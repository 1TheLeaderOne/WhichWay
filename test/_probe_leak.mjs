import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "arkid-rename-map.json"), "utf8"));
const ids = new Set(map.map(r => r.id));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const walk = (d, out = []) => {
	for (const e of fs.readdirSync(d, { withFileTypes: true })) {
		const f = path.join(d, e.name);
		e.isDirectory() ? walk(f, out) : out.push(f);
	}
	return out;
};
//与 rename 脚本同样的「会替换」范围
const IN = new Set([
	"src/skin/dynamicConfig.js",
	"src/packs/base/characterDesigner.js",
	"src/modules/data.ts",
	"src/updateLog/updateContentCurrent.js",
]);
const IN_DIRS = ["src/packs/card", "src/GloriousIdeal", "src/characterCard", "src/config", "src/audio", "src/skin", "src/poptip", "src/modules", "src/dataManager", "src/tips", "src/packs/character"];
const all = walk(path.join(ROOT, "src")).filter(f => /\.(ts|js|vue)$/.test(f));
const relOf = f => path.relative(ROOT, f).replace(/\\/g, "/");
const covered = f => IN.has(relOf(f)) || IN_DIRS.some(d => relOf(f).startsWith(d + "/"));
const leaks = new Map();
for (const f of all.filter(x => !covered(x))) {
	const text = fs.readFileSync(f, "utf8");
	const hit = [...ids].filter(id => new RegExp(`(?<![A-Za-z0-9_])${esc(id)}(?![A-Za-z0-9_])`).test(text));
	if (hit.length) leaks.set(relOf(f), hit);
}
console.log(`不在替换范围、却出现旧干员id 的文件 ${leaks.size} 个:`);
for (const [f, hit] of leaks) console.log(`  ${f}  (${hit.length}) ${hit.slice(0, 6).join(", ")}`);
