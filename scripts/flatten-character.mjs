/**
 * 扁平化 src/packs/character：把 {干员}mrfz/index.ts 提升为 {干员}mrfz.ts
 * 同时修正文件内的相对导入路径（../.. → ..，少一级）
 */
import fs from "node:fs";
import path from "node:path";

const dir = "src/packs/character";
const entries = fs.readdirSync(dir, { withFileTypes: true });
let moved = 0;
let fixed = 0;
const skipped = [];

for (const e of entries) {
	if (!e.isDirectory()) continue;
	const folderPath = path.join(dir, e.name);
	const files = fs.readdirSync(folderPath);
	if (files.length !== 1 || files[0] !== "index.ts") {
		skipped.push(e.name + " [" + files.join(",") + "]");
		continue;
	}
	const src = path.join(folderPath, "index.ts");
	const dst = path.join(dir, e.name + ".ts");
	let content = fs.readFileSync(src, "utf8");
	const before = content;
	// 修正相对导入：../../hooks.ts → ../hooks.ts
	content = content
		.replace(/from "\.\.\/\.\.\/hooks\.ts"/g, 'from "../hooks.ts"')
		.replace(/from "\.\.\/\.\.\/([A-Za-z0-9_]+\.ts)"/g, 'from "../$1"')
		.replace(/from "\.\.\/\.\.\/([A-Za-z0-9_]+\.js)"/g, 'from "../$1"');
	if (content !== before) fixed++;
	fs.writeFileSync(dst, content);
	fs.unlinkSync(src);
	fs.rmdirSync(folderPath);
	moved++;
}

console.log("移动 " + moved + " 个文件，修正导入 " + fixed + " 处");
if (skipped.length) console.log("跳过（非单 index.ts）: " + skipped.join("; "));
