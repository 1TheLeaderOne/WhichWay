/**
 * 明日方舟干员中文名 → 干员id 查询（find-arkid.bat 的实现体）
 *
 * 用法：
 *   node scripts/find-arkid.mjs 温米            一次性查询，可一次给多个名字
 *   node scripts/find-arkid.mjs                 交互模式，反复输入直到 q 或空行退出
 *                                                 （管道/重定向的 stdin 同样可用）
 *   命令行用户请跑 find-arkid.bat，它只是加上 node 存在性检查后调本文件。
 *
 * 数据源是 json/arknight/character_table.json 与 char_patch_table.json 的 patchChars
 * （后者是「升变/异格」形态，与本体同名但 id 不同，所以必须一起查，否则阿米娅三形态只会出一条）。
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
 * 把控制台代码页切到 UTF-8，退出时还原（chcp.com 自带扩展名，批处理里可以省，node 直接 spawn 不能省）。
 * 这件事必须在 node 侧做而不能写进 bat：bat 里只要出现 `for /f ... in ('命令')`，
 * 派生的子 cmd 会继承并抽干重定向/管道的 stdin，node 再读就直接 EOF。
 * spawnSync 把 stdin 设成 ignore（子进程拿到 NUL 句柄）就不会动父进程的 stdin。
 */
function useUtf8Console() {
	if (process.platform !== "win32") return;
	const read = () => /(\d+)/.exec(spawnSync("chcp.com", [], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).stdout ?? "")?.[1];
	const before = read();
	if (!before || before === "65001") return;
	spawnSync("chcp.com", ["65001"], { stdio: "ignore" });
	process.on("exit", () => spawnSync("chcp.com", [before], { stdio: "ignore" }));
}

/** @type {{id:string,name:string,patch?:boolean}[]} */
const table = [];

function loadTable() {
	const files = [
		{ file: "character_table.json", pick: data => data },
		{ file: "char_patch_table.json", pick: data => data?.patchChars, patch: true },
	];
	const missing = [];
	for (const { file, pick, patch } of files) {
		const abs = path.join(JSON_DIR, file);
		if (!fs.existsSync(abs)) {
			missing.push(file);
			continue;
		}
		const data = pick(JSON.parse(fs.readFileSync(abs, "utf8"))) || {};
		for (const id in data) {
			const info = data[id];
			const name = info?.name;
			if (typeof name !== "string" || name === "") continue;
			//与 src/arknight/index.ts 的 isCharacter() 同一口径：character_table 里还混着
			//陷阱/敌方单位（同名会污染结果），只有带 subProfessionId 且不是 notchar* 的才是干员
			if (!info.subProfessionId || String(info.subProfessionId).startsWith("notchar")) continue;
			table.push(patch ? { id, name, patch: true } : { id, name });
		}
	}
	if (table.length === 0) {
		console.error(`[ERROR] 找不到明日方舟数据：${missing.join(" , ") || JSON_DIR}`);
		console.error("        先跑 scripts\\update-arknight-data.bat 把数据下下来。");
		process.exit(1);
	}
}

/**
 * 精确优先，其次模糊（名字或id 包含输入）；一条都不丢人地把候选列出来。
 * @param {string} query
 */
function lookup(query) {
	const q = query.trim();
	const exact = table.filter(x => x.name === q);
	const hits = exact.length ? exact : table.filter(x => x.name.includes(q) || x.id.toLowerCase().includes(q.toLowerCase()));
	return { q, exact: exact.length > 0, hits };
}

function print(query) {
	const { q, exact, hits } = lookup(query);
	if (!q) return;
	if (!hits.length) {
		console.log(`未找到「${q}」`);
		return;
	}
	if (!exact) console.log(`模糊匹配「${q}」${hits.length} 条：`);
	for (const hit of hits) console.log(`${hit.id}  ${hit.name}${hit.patch ? "（异格/升变形态）" : ""}`);
}

useUtf8Console();
loadTable();

const args = process.argv.slice(2);
if (args.length) {
	for (const arg of args) print(arg);
} else {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	console.log(`干员id 查询（共 ${table.length} 条数据）：输入中文名，q 或空行退出`);
	const ask = () =>
		rl.question("> ", answer => {
			const text = answer.trim();
			if (!text || text.toLowerCase() === "q" || text.toLowerCase() === "exit") {
				rl.close();
				return;
			}
			print(text);
			ask();
		});
	ask();
}
