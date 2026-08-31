/**
 * 一次性脚本：将 src/card/index.js 拆分为 src/packs/card/{卡牌id}/index.ts 模块化结构。
 *
 * 拆分规则：
 * - 每张卡牌一个目录，index.ts 导出 { card, skill, translate }（只含自己的部分）
 * - 共享技能（被多张卡引用的）放 shared.ts：jingtoumrfz_skill（镜头 E1-E5 共用）、
 *   baitiemrfzcardad（白铁卡 1-3 共用），以及它们对应的翻译键
 * - 组装器 index.ts 扫描所有卡牌目录，合并成 mrfzcard 包后 game.import("card")
 *
 * 用法：node scripts/split-card.mjs
 */
import fs from "node:fs";
import path from "node:path";

const srcFile = path.resolve("scripts/card-index.template.js");
const outDir = path.resolve("src/packs/card");

const raw = fs.readFileSync(srcFile, "utf8");
const lines = raw.split("\n");

// ---------- 定位三个块的边界 ----------
const idxCardStart = lines.findIndex(l => l.trim() === "card: {");
const idxSkillStart = lines.findIndex((l, i) => i > idxCardStart && l.trim() === "skill: {");
const idxTranslateStart = lines.findIndex((l, i) => i > idxSkillStart && l.trim() === "translate: {");
const idxTranslateEnd = lines.findIndex((l, i) => i > idxTranslateStart && l.trim().startsWith("}, list:"));

if (idxCardStart < 0 || idxSkillStart < 0 || idxTranslateStart < 0 || idxTranslateEnd < 0) {
	console.error("块边界定位失败", { idxCardStart, idxSkillStart, idxTranslateStart, idxTranslateEnd });
	process.exit(1);
}

// ---------- 按缩进切分对象 ----------
/** 切分 "key: {" 到匹配的 "}," 层级块 */
function splitBlocks(blockLines, indentLevel) {
	const blocks = [];
	const indent = "\t".repeat(indentLevel);
	let current = null;
	let depth = 0;
	for (const line of blockLines) {
		if (!current) {
			if (line.startsWith(indent) && !line.startsWith(indent + "\t") && /^[A-Za-z0-9_]+:\s*\{/.test(line.trim())) {
				const open = (line.match(/\{/g) || []).length;
				const close = (line.match(/\}/g) || []).length;
				depth = open - close;
				current = { key: line.trim().match(/^([A-Za-z0-9_]+):/)[1], body: [line], line };
				// 单行自闭合对象（如 baitiemrfzcardad: { audio: '...', },）立即结束
				if (depth <= 0) {
					blocks.push(current);
					current = null;
					continue;
				}
				continue;
			}
			continue;
		}
		current.body.push(line);
		const open = (line.match(/\{/g) || []).length;
		const close = (line.match(/\}/g) || []).length;
		depth += open - close;
		if (depth <= 0) {
			// 结束行（"},"）保留在 body——它是 key 对象的闭合，生成时外层再包一层 { ... }
			blocks.push(current);
			current = null;
		}
	}
	return blocks;
}

const cardBlock = lines.slice(idxCardStart + 1, idxSkillStart);
const skillBlock = lines.slice(idxSkillStart + 1, idxTranslateStart);
const translateBlock = lines.slice(idxTranslateStart + 1, idxTranslateEnd);

const cards = splitBlocks(cardBlock, 3);
const skills = splitBlocks(skillBlock, 3);

// ---------- 翻译块：拆成单键 ----------
const translateEntries = [];
{
	const indent = "\t".repeat(3);
	let i = 0;
	while (i < translateBlock.length) {
		const line = translateBlock[i];
		if (!line.startsWith(indent) || line.startsWith(indent + "\t")) {
			i++;
			continue;
		}
		// 单行键值（"key": 'val',）
		if (/\}:?\s*$/.test(line.trim()) || line.trim().endsWith(",")) {
			// 累积到行尾或遇到不以逗号结尾的完整键值
			let j = i;
			let acc = [];
			let depth = 0;
			let complete = false;
			for (; j < translateBlock.length; j++) {
				const l = translateBlock[j];
				acc.push(l);
				depth += (l.match(/[\[\{]/g) || []).length - (l.match(/[\]\}]/g) || []).length;
				if (depth <= 0 && l.trim().endsWith(",")) { complete = true; break; }
			}
			if (!complete) { i++; continue; }
			const entryText = acc.join("\n");
			const keyMatch = entryText.trim().match(/^(['"]?[A-Za-z0-9_]+['"]?)\s*:/);
			if (keyMatch) {
				translateEntries.push({ key: keyMatch[1].replace(/["']/g, ""), text: entryText });
			}
			i = j + 1;
			continue;
		}
		i++;
	}
}

// ---------- 映射表：卡牌 → (card 键, skill 键, translate 键前缀) ----------
const CARD_MAP = [
	{ dir: "cuoe_huanyoumrfzCard", cardKey: "cuoe_huanyoumrfzCard", skills: [], transPrefixes: ["cuoe_huanyoumrfzCard"] },
	{ dir: "ksl_lulitongxinmrfz", cardKey: "ksl_lulitongxinmrfz", skills: [], transPrefixes: ["ksl_lulitongxinmrfz"] },
	{ dir: "jianzhumrfz", cardKey: "jianzhumrfz", skills: ["jianzhumrfz_skill"], transPrefixes: ["jianzhumrfz"] },
	{ dir: "jingtouE1mrfz", cardKey: "jingtouE1mrfz", skills: [], transPrefixes: ["jingtouE1mrfz"] },
	{ dir: "jingtouE2mrfz", cardKey: "jingtouE2mrfz", skills: [], transPrefixes: ["jingtouE2mrfz"] },
	{ dir: "jingtouE3mrfz", cardKey: "jingtouE3mrfz", skills: [], transPrefixes: ["jingtouE3mrfz"] },
	{ dir: "jingtouE4mrfz", cardKey: "jingtouE4mrfz", skills: [], transPrefixes: ["jingtouE4mrfz"] },
	{ dir: "jingtouE5mrfz", cardKey: "jingtouE5mrfz", skills: [], transPrefixes: ["jingtouE5mrfz"] },
	{ dir: "sjzx_zhuihuomrfz", cardKey: "sjzx_zhuihuomrfz", skills: [], transPrefixes: ["sjzx_zhuihuomrfz"] },
	{ dir: "shadishoumrfz", cardKey: "shadishoumrfz", skills: ["shadishoumrfz_skill"], transPrefixes: ["shadishoumrfz"] },
	{ dir: "DP27mrfz", cardKey: "DP27mrfz", skills: ["DP27mrfz_skill"], transPrefixes: ["DP27mrfz"] },
	{ dir: "dazijimrfz", cardKey: "dazijimrfz", skills: ["dazijimrfzskill"], transPrefixes: ["dazijimrfz"] },
	{ dir: "baitiemrfzcard1", cardKey: "baitiemrfzcard1", skills: ["baitiemrfzcard1_skill"], transPrefixes: ["baitiemrfzcard1"] },
	{ dir: "baitiemrfzcard2", cardKey: "baitiemrfzcard2", skills: ["baitiemrfzcard2_skill"], transPrefixes: ["baitiemrfzcard2"] },
	{ dir: "baitiemrfzcard3", cardKey: "baitiemrfzcard3", skills: ["baitiemrfzcard3_skill"], transPrefixes: ["baitiemrfzcard3"] },
];

// 共享：jingtoumrfz_skill（镜头 E1-E5 共用）、baitiemrfzcardad（白铁 1-3 共用）
const SHARED_SKILLS = ["jingtoumrfz_skill", "baitiemrfzcardad"];
const SHARED_TRANS_PREFIXES = ["jingtoumrfz_skill", "visible_jingtoumrfz", "baitiemrfzcardad"];

const findCard = key => cards.find(c => c.key === key);
const findSkill = key => skills.find(s => s.key === key);
const findTrans = key => translateEntries.find(t => t.key === key || t.key === `"${key}"`);

// ---------- 清理路径引用 ----------
const cleanCardBody = body =>
	body
		.map(l =>
			l
				.replace(/\$\{path\.card\}([A-Za-z0-9_.]+)/g, 'ext:WhichWay/image/card/$1')
				.replace(/\$\{path\.char\}([A-Za-z0-9_.]+)/g, 'ext:WhichWay/image/character/$1')
				// 模板字符串内的占位符展开：`${path.card}xxx.jpg` → "ext:WhichWay/image/card/xxx.jpg"
				.replace(/`([^`]*)\$\{path\.card\}([^`]*)`/g, '"$1ext:WhichWay/image/card/$2"')
				.replace(/`([^`]*)\$\{path\.char\}([^`]*)`/g, '"$1ext:WhichWay/image/character/$2"')
		)
		.join("\n");

// ---------- 生成文件 ----------
// 卡牌目录在 src/packs/card/{卡牌}/index.ts，到 hooks.ts 是 ../../hooks.js
const HEADER = 'import { lib, game, ui, get, ai, _status } from "noname";\nimport { card as cardHook, cardSkill, cardTranslate } from "../../hooks.js";\n\n';
// shared.ts 在 src/packs/card/ 下，到 hooks.ts 是 ../hooks.js
const SHARED_HEADER = 'import { lib, game, ui, get, ai, _status } from "noname";\nimport { cardSkill, cardTranslate } from "../hooks.js";\n\n';

// 从 body 提取内层属性（去掉起始的 "key: {" 和结尾的 "},"）
function extractInner(body) {
	return body.slice(1, -1);
}

function genFile({ card, skill, translate }) {
	let out = HEADER;
	if (card) {
		const cardKey = card.key;
		const inner = cleanCardBody(extractInner(card.body));
		out += `cardHook("${cardKey}", {\n${inner}\n});\n\n`;
	}
	if (skill) {
		const skillKey = skill.key;
		const inner = extractInner(skill.body).join("\n");
		out += `cardSkill("${skillKey}", {\n${inner}\n});\n\n`;
	}
	if (translate) {
		const entries = translate.map(t => "\t" + t.text.trim().replace(/,\s*$/, ""));
		out += `cardTranslate({\n${entries.join(",\n")},\n});\n`;
	}
	return out;
}

// 清空输出目录（重建）
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// 1) shared.ts —— 共享技能与翻译（用 hooks 风格注册）
{
	const sharedSkill = SHARED_SKILLS.map(findSkill).filter(Boolean);
	const sharedTrans = translateEntries.filter(t => SHARED_TRANS_PREFIXES.some(p => t.key.startsWith(p)));
	const skillCalls = sharedSkill.map(s => {
		const key = s.key;
		let inner;
		if (s.body.length > 1) {
			// 多行技能：去掉起始行 "key: {" 和结束行 "},"
			inner = extractInner(s.body).join("\n");
		} else {
			// 单行自闭合（baitiemrfzcardad: { audio: '...', },）——body 含起始行
			inner = s.body.length ? s.body[0].replace(new RegExp(`^\\s*${key}:\\s*\\{`), '').replace(/,\s*\},?\s*$/, '').trim() : s.line.replace(new RegExp(`^\\s*${key}:\\s*\\{`), '').replace(/,\s*\},?\s*$/, '').trim();
		}
		return `cardSkill("${key}", {\n\t${inner}\n});`;
	}).join("\n\n");
	const transEntries = sharedTrans.map(t => "\t" + t.text.trim().replace(/,\s*$/, ""));
	const out = SHARED_HEADER +
		skillCalls + "\n\n" +
		`cardTranslate({\n${transEntries.join(",\n")},\n});\n`;
	fs.writeFileSync(path.join(outDir, "shared.ts"), out);
	console.log(`[shared.ts] skill: ${sharedSkill.map(s => s.key).join(", ") || "(空)"} | translate: ${sharedTrans.length} 条`);
}

// 2) 每张卡牌一个目录
for (const item of CARD_MAP) {
	const card = findCard(item.cardKey);
	const skill = item.skills.map(findSkill).filter(Boolean);
	const trans = translateEntries.filter(t => item.transPrefixes.some(p => t.key === p || t.key.startsWith(p + "_") || t.key.startsWith(`${p}Card`) || t.key.startsWith(`${p}Card_`)));
	if (!card) {
		console.error(`★ ${item.cardKey} 卡牌定义未找到！`);
		continue;
	}
	const dir = path.join(outDir, item.dir);
	fs.mkdirSync(dir, { recursive: true });
	const out = genFile({ card, skill: skill[0], translate: trans });
	fs.writeFileSync(path.join(dir, "index.ts"), out);
	console.log(`[${item.dir}] card=${item.cardKey} | skill=${skill.map(s => s.key).join(",") || "—"} | translate=${trans.length} 条`);
}

// 3) 组装器 index.ts —— 从 packHooks 收集卡牌钩子，组装 mrfzcard 包
const assembler = `import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../../file.js";
import { packHooks } from "../hooks.js";

/**
 * 卡牌包组装器
 *
 * 扫描 src:packs/card/ 下的所有卡牌目录（每张卡一个目录，index.ts 内部调用
 * card()/cardSkill()/cardTranslate() 钩子注册），然后从 packHooks 收集所有
 * card/cardSkill/cardTranslate 钩子，组装成 mrfzcard 包对象，通过
 * game.import("card") 注册给 noname 引擎。
 *
 * 新增卡牌：在 src/packs/card/ 下新建目录，index.ts 按同样格式调用
 * card()/cardSkill()/cardTranslate() 即可，无需修改本文件。
 * 共享技能（多卡共用的）请放入 shared.ts。
 */
export async function initCardPack(): Promise<void> {
	// 先加载共享技能/翻译
	await import("./shared.js");

	const folders = await whichWayFile.listDirNames("src:packs/card/");
	const importTasks: Promise<void>[] = [];

	for (const folderName of folders) {
		if (!folderName.includes("mrfz")) continue;
		importTasks.push(
			(async () => {
				try {
					await import(\`./\${folderName}/index.js\`);
				} catch (e) {
					try {
						await import(\`./\${folderName}/index.ts\`);
					} catch (e) {
						console.warn(\`\${folderName} 卡牌加载失败 : \${e}\`);
					}
				}
			})()
		);
	}

	// 16 并发限流（与干员加载一致，避免过度并行）
	const limit = 16;
	let cursor = 0;
	const workers = Array.from({ length: Math.min(limit, importTasks.length) }, async () => {
		while (true) {
			const idx = cursor++;
			if (idx >= importTasks.length) return;
			await importTasks[idx];
		}
	});
	await Promise.all(workers);

	// 从 packHooks 收集卡牌钩子（card/cardSkill/cardTranslate 不进 pendingRun，
	// 不会自动落库 lib，由本组装器统一收集后构造 mrfzcard 包给引擎 loadCard 处理）
	const cardHooks = packHooks.getHooks("card");
	const skillHooks = packHooks.getHooks("cardSkill");
	const transHooks = packHooks.getHooks("cardTranslate");

	const card: Record<string, any> = {};
	const skill: Record<string, any> = {};
	const translate: Record<string, any> = {};
	for (const h of cardHooks) card[h.key] = h.obj;
	for (const h of skillHooks) skill[h.key] = h.obj;
	for (const h of transHooks) translate[h.key] = h.obj;

	const mrfzcard = { name: "mrfzcard", connect: true, card, skill, translate, list: [] };
	lib.translate["mrfzcard_card_config"] = "驶舰之向";
	if (!lib.config.cards.includes("mrfzcard")) lib.config.cards.push("mrfzcard");
	await game.import("card", () => mrfzcard);
}
`;

fs.writeFileSync(path.join(outDir, "index.ts"), assembler);
console.log("\n[index.ts] 组装器已生成");
console.log("拆分完成！");
