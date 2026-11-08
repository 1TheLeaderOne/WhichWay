/**
 * 生成 `git update-index --index-info` 所需的输入文件
 *
 * 给定基线 commit 和目标 commit，取两者间新增/变动的文件，
 * 从目标 commit 的 tree 中取出它们的 mode 与 sha，组装成 index-info 行：
 *   <mode> <sha> 0\t<path>
 *
 * 用 -z（NUL 分隔）解析，可正确处理含中文/空格的路径。
 *
 * 用法: node make-core-index.cjs <baseline> <target> <outFile>
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

const [baseline, target, outFile] = process.argv.slice(2);
if (!baseline || !target || !outFile) {
	console.error('用法: node make-core-index.cjs <baseline> <target> <outFile>');
	process.exit(1);
}

function git(args) {
	// maxBuffer 给足，ls-tree 全量约几百 KB，diff 列表小
	return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 28 });
}

// 忽略清单：增量包永不包含的路径（依赖目录等）
// 即使某个基线/目标树里残留了 node_modules（如 .gitignore 失效或误提交），
// 也会在 diff 与 tree 两层被过滤掉，不会进入增量包。
const IGNORED_PREFIXES = ['node_modules/', '.github/'];
const isIgnored = (p) => IGNORED_PREFIXES.some((pre) => p === pre.slice(0, -1) || p.startsWith(pre));

// 强制清单：无论 diff 里有没有变化，都必须进增量包。
// 入口 extension.js 是「装没装上 / 指向哪套 chunk」的唯一锚点：只改素材的
// release（extension.js 内容没变）如果不在包里，核心包就成了一个没有入口的
// 补丁（实测 v1.5.1 -> v1.5.2 的 ACMRT 条目数是 0），用户覆盖安装后无法确认生效。
const ALWAYS_INCLUDE = ['extension.js'];

// 1. 基线→目标的新增/变动文件（ACMRT：Added/Copied/Modified/Renamed/Type-changed），不含删除
const changedRaw = git(['diff', '--name-only', '-z', '--diff-filter=ACMRT', baseline, target]);
const changed = changedRaw.split('\0').filter((p) => p && !isIgnored(p));

// 删除项数量（仅用于提示，不写入增量包）
const deletedRaw = git(['diff', '--name-only', '-z', '--diff-filter=D', baseline, target]);
const deleted = deletedRaw.split('\0').filter((p) => p && !isIgnored(p));

// 2. 目标 commit 的全量 tree：每条 "mode type sha\0path"
const treeRaw = git(['ls-tree', '-r', '-z', target]);
const map = new Map();
for (const entry of treeRaw.split('\0')) {
	if (!entry) continue;
	const tabIdx = entry.lastIndexOf('\t');
	if (tabIdx === -1) continue;
	const meta = entry.slice(0, tabIdx);
	const path = entry.slice(tabIdx + 1);
	const [mode, type, sha] = meta.split(/\s+/);
	if (mode && sha) map.set(path, { mode, sha });
}

// 3. 组装 index-info 行
const out = [];
let missing = 0;
const emitted = new Set();
const emit = (path) => {
	const e = map.get(path);
	if (!e) return false; // 目标 tree 里没有（例如 rename 的旧路径）
	out.push(`${e.mode} ${e.sha} 0\t${path}`);
	emitted.add(path);
	return true;
};
for (const path of changed) {
	if (!emit(path)) missing++;
}

// 4. 强制项：entry 文件永远带上（见文件头的 ALWAYS_INCLUDE 说明）
let forced = 0;
for (const path of ALWAYS_INCLUDE) {
	if (emitted.has(path) || !map.has(path)) continue;
	if (emit(path)) forced++;
}

fs.writeFileSync(outFile, out.join('\n') + '\n');
console.log(`已生成 ${out.length} 个增量条目（其中强制入口 ${forced} 个；${deleted.length} 个删除项不含在内，${missing} 个在目标中不存在已跳过）`);
