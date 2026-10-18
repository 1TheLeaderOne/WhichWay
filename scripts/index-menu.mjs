/**
 * scripts\ 目录下所有脚本的可视化启动器（index.bat 的实现体）
 *
 * 用法：
 *   node scripts/index-menu.mjs                 交互菜单：输入编号执行对应脚本，q 退出
 *   node scripts/index-menu.mjs --list          只打印编号表（自动化核对/看编号用）
 *   node scripts/index-menu.mjs <编号> [参数…]  直接执行该编号脚本，不进菜单、不二次确认
 *
 * 菜单里显示的「使用说明」不是另写一份，而是从脚本自己的文档头里抠出来的：
 *   .bat / .cmd → 文件开头连续的 REM 块
 *   .mjs / .cjs → 文件开头的 JSDoc 块
 * 所以改脚本时只改它头顶的注释，菜单就跟着变；这里只维护「分类 + 一行中文摘要」。
 *
 * ⚠ 菜单不改变任何脚本的行为，也不代替脚本自己的确认：split-illustration / rename-to-arkid
 *   这类默认「不可逆」的脚本，仍然要先在参数里自己写 --dry-run。
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url)); // .../WhichWay/scripts
const ROOT = path.dirname(HERE); // 扩展包根目录

/** 启动器自身不出现在列表里（列出来只是多一个套娃入口） */
const SELF = new Set(["index.bat", "index-menu.mjs"]);
const SCRIPT_EXT = /\.(bat|cmd|mjs|cjs)$/i;

/** 菜单模式下才建的 readline（--list / 直接执行不建，否则 stdin 被引用住，进程不退出） */
let menu = null;
/** stdin 是否已结束：结束后的提问一律返回 null，让循环退出而不是吊死 */
let closed = false;

/**
 * 分类与一行摘要：键 = 小写文件名。摘要写在这里而不是从文档头猜，
 * 因为文档头首行有的是英文、有的是实现体说明，不适合当菜单索引。
 * 未列出的文件会落到「其他」，摘要取文档头首行——新增脚本不会漏，只是没那么顺眼。
 */
const CATALOG = {
	"release.bat": { group: "发布 / 打包", summary: "构建并发布：release 全流程 / dev 同步 dev-output / pack 本地压包" },
	"update-arknight-data.bat": { group: "游戏数据", summary: "一键更新 json/arknight 的五张明日方舟数据表" },
	"find-arkid.bat": { group: "游戏数据", summary: "干员中文名 / id 片段 → 干员id 查询" },
	"find-arkid.mjs": { group: "游戏数据", summary: "同 find-arkid.bat（它是实现体，可脱离 bat 直接用 node 跑）" },
	"update-portraits.mjs": { group: "立绘 / 图片", summary: "从 torappu 补齐缺失干员立绘（只新增，不覆盖；GitHub 走不稳可加 --proxy）" },
	"split-illustration.mjs": { group: "立绘 / 图片", summary: "按 skin_table 把 illustration/source 分离到 character/skin（默认剪切！）" },
	"compress-skin.mjs": { group: "立绘 / 图片", summary: "缩放 + 256 色量化压缩图片（默认写镜像目录，--inplace 才就地替换）" },
	"rename-to-arkid.mjs": { group: "一次性迁移", summary: "干员id → 明日方舟uid 批量改名（默认只检查，--apply 才落盘）" },
	"make-core-index.cjs": { group: "内部", summary: "给 release.bat 生成 output-core 的 index-info，一般不单独跑" },
};
const GROUP_ORDER = ["发布 / 打包", "游戏数据", "立绘 / 图片", "一次性迁移", "内部", "其他"];

/**
 * 把控制台代码页切到 UTF-8，退出时还原。和 find-arkid.mjs 同理：这件事必须在 node 侧做，
 * bat 里只要出现 `for /f ... in ('命令')`，派生的子 cmd 会继承并抽干管道 stdin；
 * 这里给 chcp 的 stdin 设 ignore，就不会动父进程的输入。
 */
function useUtf8Console() {
	if (process.platform !== "win32") return;
	const read = () => /(\d+)/.exec(spawnSync("chcp.com", [], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).stdout ?? "")?.[1];
	const before = read();
	if (!before || before === "65001") return;
	spawnSync("chcp.com", ["65001"], { stdio: "ignore" });
	process.on("exit", () => spawnSync("chcp.com", [before], { stdio: "ignore" }));
}

/**
 * 取脚本文档头的正文（剥掉 REM 块与 JSDoc 块的外壳，去掉分隔线）。
 * 解析失败就返回空数组，菜单照样能跑，只是说明栏是空的。
 * @param {string} file
 */
function readHeader(file) {
	let lines;
	try {
		lines = fs.readFileSync(path.join(HERE, file), "utf8").split(/\r?\n/);
	} catch {
		return [];
	}
	const out = [];
	const isBatch = /\.(bat|cmd)$/i.test(file);
	if (!isBatch) {
		//开头的 /** ... */ 块：跳过 import 之前的空行，找到第一个 JSDoc 即止
		const start = lines.findIndex(line => /^\s*\/\*\*/.test(line));
		if (start < 0) return [];
		for (let i = start + 1; i < lines.length; i++) {
			if (/\*\//.test(lines[i])) break;
			out.push(lines[i].replace(/^\s*\*:? ?/, ""));
		}
	} else {
		//开头的 REM 块：允许 @echo off / setlocal / 空行打头，遇到第一条别的命令就停
		for (const line of lines) {
			if (/^\s*(rem\b|::)/i.test(line)) out.push(line.replace(/^\s*(rem\b|::)\s?/i, ""));
			else if (/^\s*$/.test(line) || /^\s*@?(echo off|setlocal|endlocal|chcp)/i.test(line)) continue;
			else break;
		}
		//bat 里为了躲 cmd 的转义规则，占位符写成 ^<version^> / [output^|core]；显示时还原
		for (let i = 0; i < out.length; i++) out[i] = out[i].replace(/\^([<>|&^])/g, "$1");
	}
	//去掉 ==== 分隔线，再掐掉头尾空行
	const header = out.map(line => line.trimEnd()).filter(line => !/^\s*={4,}\s*$/.test(line));
	while (header.length && header[0].trim() === "") header.shift();
	while (header.length && header[header.length - 1].trim() === "") header.pop();
	return header;
}

/** 从文档头里挑出「用法」那一段：Usage:/用法： 之后连续缩进的命令行 */
function pickUsage(header) {
	const at = header.findIndex(line => /^\s*(usage\b|用法)/i.test(line));
	if (at < 0) return [];
	const block = [];
	for (const line of header.slice(at + 1)) {
		if (/^\s+\S/.test(line)) block.push(line.trim());
		else if (block.length === 0 && line.trim() === "") continue;
		else break;
	}
	return block;
}

/**
 * 文档头里的告警段（⚠ / 不可逆 / 不可恢复）单独提出来，免得用户翻完整段才看到。
 * 整段都要：换行续写的那几行往往才是真正要紧的指示（「先加 --dry-run」就在下一行）。
 */
function pickWarnings(header) {
	const out = [];
	for (let i = 0; i < header.length; i++) {
		if (!/⚠|不可逆|不可恢复/.test(header[i])) continue;
		out.push(header[i].trim());
		while (i + 1 < header.length && /^\s+\S/.test(header[i + 1])) out.push(header[++i].trim());
	}
	return out;
}

/**
 * 扫描 scripts\，按分类顺序编号。
 * @returns {{n:number,file:string,group:string,summary:string,header:string[]}[]}
 */
function collect() {
	const entries = fs
		.readdirSync(HERE, { withFileTypes: true })
		.filter(dirent => dirent.isFile() && SCRIPT_EXT.test(dirent.name) && !SELF.has(dirent.name.toLowerCase()))
		.map(dirent => {
			const key = dirent.name.toLowerCase();
			const header = readHeader(dirent.name);
			const info = CATALOG[key] ?? {};
			return { file: dirent.name, group: info.group ?? "其他", summary: info.summary ?? header[0] ?? "（无文档头）", header };
		});
	const rank = group => (GROUP_ORDER.includes(group) ? GROUP_ORDER.indexOf(group) : GROUP_ORDER.length);
	entries.sort((a, b) => rank(a.group) - rank(b.group) || a.file.localeCompare(b.file));
	return entries.map((entry, i) => ({ ...entry, n: i + 1 }));
}

/** 中文按两列宽算，编号表才不会歪 */
function width(text) {
	let sum = 0;
	for (const ch of text) sum += /[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch) ? 2 : 1;
	return sum;
}
function pad(text, columns) {
	return text + " ".repeat(Math.max(1, columns - width(text)));
}

function printList(entries) {
	let lastGroup = "";
	for (const entry of entries) {
		if (entry.group !== lastGroup) {
			lastGroup = entry.group;
			console.log(`\n  ${lastGroup}`);
		}
		console.log(`   ${pad(String(entry.n), 4)}${pad(entry.file, 30)}${entry.summary}`);
	}
	console.log("");
}

/** 弹出这个脚本的使用说明（摘要 + 用法段 + 告警行） */
function printInfo(entry) {
	const usage = pickUsage(entry.header);
	console.log(`\n${"=".repeat(74)}`);
	console.log(` [${entry.n}] ${entry.file}　（${entry.group}）`);
	console.log(`${"=".repeat(74)}`);
	console.log(entry.summary);
	console.log("");
	if (usage.length) {
		console.log("  用法：");
		for (const line of usage) console.log(`    ${line}`);
	} else console.log("  （文档头里没写用法段，完整说明见脚本文件开头）");
	const warnings = pickWarnings(entry.header);
	if (warnings.length) {
		console.log("");
		for (const line of warnings) console.log(`  ${line}`);
	}
	console.log(`  运行方式：${/\.(bat|cmd)$/i.test(entry.file) ? `cmd.exe /c "scripts\\${entry.file}"` : `node scripts\\${entry.file}`}`);
	console.log(`${"-".repeat(74)}`);
}

/** 把用户输入的参数串拆成 node 的参数数组（双引号视为一组） */
function tokenize(line) {
	const out = [];
	const re = /"([^"]*)"|(\S+)/g;
	let match;
	while ((match = re.exec(line))) out.push(match[1] ?? match[2]);
	return out;
}

/**
 * 执行脚本，stdio 全部继承，所以脚本自己的交互（release.bat 的暂停确认、
 * find-arkid.bat 的循环查询）在菜单里和直接双击一样能用。
 * 跑之前把菜单的 readline 暂停，跑完再恢复：两个读取者共用一个 stdin 时，
 * 谁在读是不确定的，暂停才能让子进程独占用户敲的键。
 * @returns {number} 退出码
 */
function run(entry, argLine) {
	const abs = path.join(HERE, entry.file);
	const args = argLine.trim();
	let result;
	if (menu) menu.pause(); //把 stdin 让给子进程
	try {
		if (/\.(bat|cmd)$/i.test(entry.file)) {
			//cmd 的引号规则：整条命令再套一层引号 + /s，路径里的空格与参数里的引号才不会被吃掉
			const inner = `"${abs}"${args ? ` ${args}` : ""}`;
			result = spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `"${inner}"`], { stdio: "inherit", cwd: ROOT, windowsVerbatimArguments: true });
		} else {
			result = spawnSync(process.execPath, [abs, ...(args ? tokenize(args) : [])], { stdio: "inherit", cwd: ROOT });
		}
	} finally {
		if (menu) menu.resume();
	}
	if (result.error) {
		console.error(`[ERROR] 启动失败：${result.error.message}`);
		return 1;
	}
	return result.status ?? 1;
}

/**
 * 交互菜单。
 *
 * 提问一律用 rl.question 的回调链串起来，不用 async/await：readline 会在同一个数据块里
 * 同步抛出多行，await 的续体是微任务，等它跑起来时后面几行已经没人接了——管道/重定向喂进来
 * 的「编号 + 参数 + 确认」会整段丢掉（一问建一个 rl 同样会丢，而且还会卡在 unsettled 的顶层
 * await 上以退出码 13 收场）。find-arkid.mjs 的递归 question 就是为同一件事。
 * 只有菜单模式才创建 rl：--list / 直接执行不创建，否则 stdin 被引用住，脚本不会自己退出。
 *
 * ⚠ 回调里只做取值和分支，任何解析/执行逻辑出错都要走 finish 收尾：readline 的 'line'
 *   回调里抛异常会变成 'error' 事件上的未捕获异常，直接把进程掀掉。
 */
function interactive(entries) {
	menu = readline.createInterface({ input: process.stdin, output: process.stdout });
	menu.on("close", () => {
		closed = true;
	});

	function finish(message) {
		console.log(message);
		menu.close();
		menu = null;
	}

	function askEntry() {
		if (closed) return;
		menu.question("> ", answer => {
			const text = answer.trim();
			if (text.toLowerCase() === "q" || text.toLowerCase() === "exit") return finish("再见。");
			if (text === "") {
				printList(entries);
				return askEntry();
			}
			const entry = entries.find(item => String(item.n) === text);
			if (!entry) {
				console.log(`没有 ${text} 号脚本（1-${entries.length}）。回车可重新列出。`);
				return askEntry();
			}
			printInfo(entry);
			askArgs(entry);
		});
	}

	function askArgs(entry) {
		if (closed) return finish("输入已结束（stdin 到 EOF），菜单退出。");
		menu.question(`执行 [${entry.file}] 的参数（直接回车=无参数）> `, answer => {
			askConfirm(entry, answer.trim());
		});
	}

	function askConfirm(entry, args) {
		if (closed) return finish("输入已结束（stdin 到 EOF），菜单退出。");
		menu.question(`确认执行：${entry.file}${args ? ` ${args}` : ""}　[Y/n] > `, answer => {
			//只有 y/yes/空回车才放行（[Y/n] 的回车惯例=同意）：这里跑的是会改文件、甚至推分支的脚本，
			//把「别的回答」当成同意，等于一个笔误就执行（实测把误输入的 q 当参数继续跑过一遍）
			const reply = answer.trim();
			if (reply !== "" && !/^(y|yes)$/i.test(reply)) {
				console.log("已取消。");
				return askEntry();
			}
			let code;
			try {
				code = run(entry, args);
			} catch (error) {
				console.error(`[ERROR] 执行出错：${error?.stack ?? error}`);
				code = 1;
			}
			console.log(`\n[EXIT] ${entry.file} 退出码 ${code}`);
			askEntry();
		});
	}

	console.log(`WhichWay scripts 启动器　（目录：${HERE}）`);
	console.log("输入编号执行脚本；回车=重新打印列表，q=退出。编号后的说明取自脚本自己的文档头。");
	printList(entries);
	askEntry();
}

function direct(entries, argv) {
	const wanted = Number(argv[0]);
	const entry = entries.find(item => item.n === wanted);
	if (!entry) {
		console.error(`[ERROR] 没有 ${argv[0]} 号脚本（1-${entries.length}）。用 --list 查看编号。`);
		return 2;
	}
	console.log(`> ${entry.file} ${argv.slice(1).join(" ")}`.trim());
	return run(entry, argv.slice(1).join(" "));
}

function usage() {
	console.log("用法：");
	console.log("  scripts\\index.bat                     打开菜单");
	console.log("  scripts\\index.bat <编号> [参数…]      直接执行该编号脚本");
	console.log("  scripts\\index.bat --list              只打印编号表");
	return 0;
}

useUtf8Console();
const entries = collect();
const argv = process.argv.slice(2);

if (argv[0] === "--list") {
	printList(entries);
	process.exitCode = 0;
} else if (argv[0] === "--help" || argv[0] === "-h") {
	process.exitCode = usage();
} else if (argv.length && /^\d+$/.test(argv[0])) {
	process.exitCode = direct(entries, argv);
} else {
	if (argv.length) console.log(`（忽略多余参数：${argv.join(" ")}）`);
	//菜单里的异常不该掀掉终端：报错后仍然正常收尾
	try {
		interactive(entries);
	} catch (error) {
		console.error(`[ERROR] 菜单出错：${error?.stack ?? error}`);
		process.exitCode = 1;
	}
}
