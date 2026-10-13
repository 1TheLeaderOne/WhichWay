// 一次性勘察：待改名干员id 是否与 group/技能/卡牌/其它标识符同名（全局文本替换的误伤风险）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "test", "_rename_map.json"), "utf8"));
const renames = map.filter(r => r.ark);
const ids = new Set(renames.map(r => r.key));

const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");

//1) group id：shcema.js 的 group.whichWay + packs/base/groups.js 的键
const groupIds = new Set(JSON.parse(/whichWay:\s*(\[[^\]]*\])/.exec(read("src/arknight/shcema.js"))[1]));
const groupsText = read("src/packs/base/groups.js");
for (const m of groupsText.matchAll(/^\t([A-Za-z0-9_]+):\s*\{/gm)) groupIds.add(m[1]);

//2) 技能id / 卡牌id：从 packs 目录收集 skill()/card()/cardSkill() 注册的键
const skillIds = new Set();
const cardIds = new Set();
const otherCharIds = new Set();
function walk(dir, out = []) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const f = path.join(dir, e.name);
		if (e.isDirectory()) walk(f, out);
		else if (/\.tsx?$/.test(e.name)) out.push(f);
	}
	return out;
}
for (const f of walk(path.join(ROOT, "src", "packs"))) {
	const text = fs.readFileSync(f, "utf8");
	for (const m of text.matchAll(/\bskill\(\s*\{([\s\S]*?)\n\}\)/g)) {
		for (const k of m[1].matchAll(/^\t([A-Za-z0-9_]+)\s*:/gm)) skillIds.add(k[1]);
	}
	for (const m of text.matchAll(/\bskill\(\s*["']([^"']+)["']/g)) skillIds.add(m[1]);
	for (const m of text.matchAll(/\bcard\(\s*["']([^"']+)["']/g)) cardIds.add(m[1]);
	for (const m of text.matchAll(/\bcardSkill\(\s*["']([^"']+)["']/g)) cardIds.add(m[1]);
}
//批量 translate({ key: ... }) 里的键也一并收集，用于检测同名词
const translatedKeys = new Set();
for (const f of walk(path.join(ROOT, "src", "packs"))) {
	const text = fs.readFileSync(f, "utf8");
	for (const m of text.matchAll(/\btranslate\(\s*\{([\s\S]*?)\n\}\)/g)) {
		for (const k of m[1].matchAll(/^\t([A-Za-z0-9_]+)\s*:/gm)) translatedKeys.add(k[1]);
	}
}

const collide = i => ({ id: i, group: groupIds.has(i), skill: skillIds.has(i), card: cardIds.has(i) });
const hits = [...ids].map(collide).filter(h => h.group || h.skill || h.card);

console.log(`待改名id: ${ids.size}  技能id样本: ${skillIds.size}  卡牌id: ${cardIds.size}  group id: ${groupIds.size}`);
console.log(`\n与其他标识符同名的待改名id: ${hits.length}`);
for (const h of hits) console.log(`  ${h.id}  group=${h.group} skill=${h.skill} card=${h.card}`);

//反向：哪些「非干员」的 translate 键恰好等于某个待改名id（说明该名字同时是技能/翻译键）
const dupTrans = [...translatedKeys].filter(k => ids.has(k));
console.log(`\n(参考) translate 键中与干员id重名的数量: ${dupTrans.length}`);
