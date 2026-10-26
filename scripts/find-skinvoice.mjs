/**
 * 查询某个干员「带专属语音的皮肤」的 skinId（find-skinvoice.bat 的实现体）
 *
 * 用法：
 *   node scripts/find-skinvoice.mjs 凯尔希         一次性查询，可一次给多个
 *   node scripts/find-skinvoice.mjs char_003_kalts  直接用干员 id 查
 *   node scripts/find-skinvoice.mjs                交互模式，q 或空行退出（管道/重定向同样可用）
 *   命令行用户请跑 find-skinvoice.bat，它只是加上 node 存在性检查后调本文件。
 *
 * 输出的是 `audio` 对象形态里 **key** 该填的东西：
 *   audio: { "char_003_kalts@boc#6": ["部署1", "部署2"] }
 *
 * 数据源：skin_table.charSkins[].voiceId（哪个皮肤有专属语音）+ charword_table
 * （该语音库有哪些语言、共多少条）。三者都不在精简缓存里，直接从 json/arknight 读原始表。
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const JSON_DIR = path.join(ROOT, "json", "arknight");

/**
 * 把控制台代码页切到 UTF-8，退出时还原（与 find-arkid.mjs 同一套做法）。
 *
 * 这件事必须在 node 侧做而不能写进 bat：bat 里只要出现 `for /f ... in ('命令')`，
 * 派生的子 cmd 会继承并抽干重定向/管道的 stdin，node 再读就直接 EOF。
 * spawnSync 把 stdin 设成 ignore，子进程拿到 NUL 句柄，就不会动父进程的 stdin。
 */
function useUtf8Console() {
	if (process.platform !== "win32") return;
	const read = () => /(\d+)/.exec(spawnSync("chcp.com", [], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).stdout ?? "")?.[1];
	const before = read();
	if (!before || before === "65001") return;
	spawnSync("chcp.com", ["65001"], { stdio: "ignore" });
	process.on("exit", () => spawnSync("chcp.com", [before], { stdio: "ignore" }));
}

/** @type {{id:string,name:string,patch?:boolean}[]} 干员表 */
const characters = [];
/** @type {Map<string, {skinId:string, voiceId:string, name:string, group:string, drawer:string}[]>} charId → 有语音的皮肤 */
const voiceSkins = new Map();
/** @type {Map<string, string[]>} voiceId → 语言列表 */
const voiceLangs = new Map();
/** @type {Map<string, number>} voiceId → 语音条数 */
const voiceCount = new Map();

function readJson(name) {
	const abs = path.join(JSON_DIR, name);
	if (!fs.existsSync(abs)) return undefined;
	return JSON.parse(fs.readFileSync(abs, "utf8"));
}

function loadCharacters() {
	const tables = [
		{ data: readJson("character_table.json"), pick: d => d },
		{ data: readJson("char_patch_table.json"), pick: d => d?.patchChars, patch: true },
	];
	for (const { data, pick, patch } of tables) {
		for (const id in pick(data) ?? {}) {
			const info = pick(data)[id];
			const name = info?.name;
			if (typeof name !== "string" || name === "") continue;
			//与 src/arknight/index.ts 的 isCharacter() 同一口径：character_table 里混着陷阱/敌方单位，
			//只有带 subProfessionId 且不是 notchar* 的才是干员（否则同名会污染结果）
			if (!info.subProfessionId || String(info.subProfessionId).startsWith("notchar")) continue;
			characters.push(patch ? { id, name, patch: true } : { id, name });
		}
	}
}

function loadVoiceSkins() {
	const skinTable = readJson("skin_table.json");
	const charSkins = skinTable?.charSkins ?? {};
	for (const skinId in charSkins) {
		const entry = charSkins[skinId];
		const voiceId = entry?.voiceId;
		const charId = entry?.charId;
		//voiceId 为空 = 该皮肤沿用基础语音，不算「有专属语音」
		if (!charId || typeof voiceId !== "string" || !voiceId) continue;
		if (!voiceSkins.has(charId)) voiceSkins.set(charId, []);
		voiceSkins.get(charId).push({
			skinId,
			voiceId,
			name: entry?.displaySkin?.skinName || "",
			group: entry?.displaySkin?.skinGroupName || "",
			drawer: (entry?.displaySkin?.drawerList ?? []).join("、"),
		});
	}

	const charword = readJson("charword_table.json");
	for (const voiceId in charword?.voiceLangDict ?? {}) {
		const langs = Object.keys(charword.voiceLangDict[voiceId]?.dict ?? {});
		if (langs.length) voiceLangs.set(voiceId, langs);
	}
	//语音条数：charWords 按 voiceAsset 的目录部分分组（`char_003_kalts_boc#6/CN_001` → `char_003_kalts_boc#6`）
	for (const key in charword?.charWords ?? {}) {
		const asset = charword.charWords[key]?.voiceAsset;
		if (typeof asset !== "string") continue;
		const slash = asset.lastIndexOf("/");
		if (slash <= 0) continue;
		const voiceId = asset.slice(0, slash);
		voiceCount.set(voiceId, (voiceCount.get(voiceId) ?? 0) + 1);
	}
}

/**
 * 解析输入的干员：id 精确优先，其次中文名精确，最后模糊。
 * @param {string} query
 */
function resolveCharacters(query) {
	const q = query.trim();
	if (!q) return { exact: false, hits: [] };
	const lower = q.toLowerCase();
	const byId = characters.filter(x => x.id.toLowerCase() === lower);
	if (byId.length) return { exact: true, hits: byId };
	const byName = characters.filter(x => x.name === q);
	if (byName.length) return { exact: byName.length === 1, hits: byName };
	const fuzzy = characters.filter(x => x.name.includes(q) || x.id.toLowerCase().includes(lower));
	return { exact: false, hits: fuzzy };
}

const LANG_LABEL = {
	CN_MANDARIN: "中配",
	JP: "日配",
	KR: "韩配",
	EN: "英配",
	CN_TOPOLECT: "中配(方言)",
	ITA: "意配",
	GER: "德配",
	RUS: "俄配",
	FRE: "法配",
	SPA: "西配",
	LINKAGE: "联动",
};

function langLabel(lang) {
	return LANG_LABEL[lang] ?? lang;
}

/** 打印一个干员的「有语音的皮肤」 */
function printCharacter(character) {
	const skins = (voiceSkins.get(character.id) ?? []).slice().sort((a, b) => a.skinId.localeCompare(b.skinId));

	console.log("");
	console.log(`=== ${character.name}  ${character.id}${character.patch ? "（异格/升变形态）" : ""} ===`);

	if (!skins.length) {
		console.log("该干员没有带专属语音的皮肤（全部皮肤都沿用基础语音）。");
		return;
	}

	//多对一提示：几个皮肤共用同一个语音库时，填其中任意一个 skinId 效果都一样
	const byVoiceId = new Map();
	for (const skin of skins) {
		if (!byVoiceId.has(skin.voiceId)) byVoiceId.set(skin.voiceId, []);
		byVoiceId.get(skin.voiceId).push(skin.skinId);
	}
	const shared = [...byVoiceId.entries()].filter(([, list]) => list.length > 1);

	console.log(`带专属语音的皮肤：${skins.length} 个`);
	for (const skin of skins) {
		const langs = voiceLangs.get(skin.voiceId) ?? [];
		const count = voiceCount.get(skin.voiceId) ?? 0;
		console.log("");
		console.log(`  skinId : ${skin.skinId}`);
		console.log(`  皮肤名 : ${skin.name || "(无显示名)"}${skin.group ? `   系列：${skin.group}` : ""}`);
		console.log(`  语音库 : ${skin.voiceId}`);
		console.log(`  语言   : ${langs.length ? langs.map(langLabel).join(" / ") : "(charword 里查不到)"}`);
		console.log(`  条数   : ${count || "?"}`);
	}

	if (shared.length) {
		console.log("");
		console.log("注意：以下皮肤共用同一个语音库，写其中任意一个 skinId 效果完全相同（音频一模一样）：");
		for (const [voiceId, list] of shared) console.log(`  ${voiceId}  ←  ${list.join(" / ")}`);
	}

	//直接给出能粘贴进 skill({ audio: ... }) 的写法
	console.log("");
	console.log("填入 audio 的写法（key 用上面的 skinId，value 换成该皮肤下要用的语音标题）：");
	console.log("  audio: {");
	//共用语音库的只示范一次，避免让人以为多写几行会有差别
	const printed = new Set();
	for (const skin of skins) {
		if (printed.has(skin.voiceId)) continue;
		printed.add(skin.voiceId);
		const alias = shared.find(([v]) => v === skin.voiceId)?.[1] ?? [];
		const note = alias.length > 1 ? `  // ${skin.name || skin.skinId}（与 ${alias.length - 1} 个皮肤共用）` : skin.name ? `  // ${skin.name}` : "";
		console.log(`    "${skin.skinId}": ["部署1", "部署2"],${note}`);
	}
	console.log('    default: ["作战中1"],  // 基础语音（可省略）');
	console.log("  }");
}

function run(query) {
	const { hits } = resolveCharacters(query);
	if (!hits.length) {
		console.log(`未找到干员「${query.trim()}」`);
		return;
	}
	//名字模糊命中多个（阿米娅三形态之类）就全部列出来，不替用户猜
	if (hits.length > 1) {
		console.log(`「${query.trim()}」命中 ${hits.length} 个干员：`);
		for (const hit of hits) printCharacter(hit);
		return;
	}
	printCharacter(hits[0]);
}

useUtf8Console();
loadCharacters();
loadVoiceSkins();

if (characters.length === 0) {
	console.error("[ERROR] 找不到明日方舟干员数据（character_table.json）。");
	console.error("        先跑 scripts\\update-arknight-data.bat 把数据下下来。");
	process.exit(1);
}
if (voiceSkins.size === 0) {
	console.error("[ERROR] 找不到皮肤语音数据（skin_table.json），或其中没有任何带 voiceId 的皮肤。");
	console.error("        先跑 scripts\\update-arknight-data.bat 把数据下下来。");
	process.exit(1);
}

const args = process.argv.slice(2);
if (args.length) {
	for (const arg of args) run(arg);
} else {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	console.log(`皮肤语音查询（共 ${characters.length} 个干员，${voiceSkins.size} 个角色有专属语音皮肤）`);
	console.log("输入干员 id 或中文名，q 或空行退出");
	const ask = () =>
		rl.question("> ", answer => {
			const text = answer.trim();
			if (!text || text.toLowerCase() === "q" || text.toLowerCase() === "exit") {
				rl.close();
				return;
			}
			run(text);
			ask();
		});
	ask();
}
