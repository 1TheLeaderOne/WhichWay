/**
 * 更新公告用的 Markdown 渲染与「指令块」切分（轻量自实现，不引入第三方依赖）。
 *
 * 支持的语法（够写公告即可，不是完整 CommonMark 实现）：
 * - 标题 `#` ~ `######`、水平线 `---` / `***` / `___`
 * - 无序列表 `-` `*` `+`、有序列表 `1.` / `1)`（用**两个空格**缩进表示嵌套）
 * - 引用 `> `、围栏代码块 ` ``` `、行内代码 `` `code` ``
 * - 强调 `**粗体**`、`*斜体*`、`~~删除线~~`、链接 `[文字](地址)`
 * - GFM 表格（表头行 + `| --- | --- |` 分隔行）
 * - 段落内的单个换行按 `<br>` 处理（与改造前"一行一条"的观感一致，写公告更省事）
 *
 * 指令块（把引擎生成的按钮组嵌进正文任意位置；块内每行一个条目名，写空则回落到 `info.player` / `info.cards`）：
 * ```
 * :::player
 * baimianxiaomrfz
 * chongyuemrfz
 * :::
 *
 * :::cards
 * 杀
 * :::
 * ```
 * 别名：`players` / `character` 等价于 `player`，`card` / `vcards` 等价于 `cards`。
 * 正文里**没写**指令的类型，会按改造前的老行为自动追加到末尾（见 {@link splitNotice}）。
 *
 * 安全性：正文来自扩展自带文件（作者可控），因此**保留原始 HTML 标签**，与改造前 `v-html` 的行为一致；
 * 只对链接地址做 `javascript:` 过滤。
 *
 * 本模块只做「字符串 → HTML 字符串 / 片段数组」的转换，不碰 DOM，
 * 所以 configUI 里的组件与 `createApp` 独立挂载的公告弹窗都能复用它。
 */

/** 指令名 → 数据类型（`player` 走干员按钮，`card` 走卡牌按钮） */
const DIRECTIVE_TYPES = {
	player: "player",
	players: "player",
	character: "player",
	card: "card",
	cards: "card",
	vcard: "card",
};

/** 行首的列表标记：无序 `- * +` 或有序 `1.` / `1)` */
const RE_LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
/** 行首的标题标记 */
const RE_HEADING = /^\s*(#{1,6})\s+(.*)$/;
/** 横线 */
const RE_HR = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
/** 引用 */
const RE_QUOTE = /^\s*>\s?/;
/** 围栏代码块 */
const RE_FENCE = /^\s*```/;
/** 指令块开始 / 结束 */
const RE_DIRECTIVE_OPEN = /^\s*:::\s*([A-Za-z]+)\s*$/;
const RE_DIRECTIVE_CLOSE = /^\s*:::\s*$/;
/** 表格分隔行：`| --- | :--: |` 之类 */
const RE_TABLE_SEP = /^\s*\|?[\s:|-]*-{3,}[\s:|-]*\|?\s*$/;

/**
 * 取某个类型在 `info` 里的回落列表（兼容旧的 `{ intro, player, cards }` 结构）
 * @param {object} info 更新信息对象
 * @param {"player" | "card"} type 条目类型
 * @returns {string[]} 条目名数组
 */
function fallbackItems(info, type) {
	const list = type === "player" ? info?.player : info?.cards;
	return Array.isArray(list) ? list.slice() : [];
}

/**
 * 行内语法渲染。先把 `code` 抽出来占位，避免其中的 `*` `_` 被当成强调语法处理。
 * @param {string} text 单行 / 单段文本
 * @returns {string} HTML 片段
 */
function renderInline(text) {
	/** @type {string[]} */
	const codes = [];
	let html = String(text ?? "").replace(/`([^`\n]+)`/g, (match, code) => `\u0000${codes.push(code) - 1}\u0000`);
	html = html
		.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
		.replace(/__([^_\n]+)__/g, "<strong>$1</strong>")
		.replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
		.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
		.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
			const url = /^\s*(?:javascript|data|vbscript):/i.test(href) ? "#" : href;
			return `<a class="md-a" href="${url}" target="_blank" rel="noreferrer noopener">${label}</a>`;
		});
	return html.replace(/\u0000(\d+)\u0000/g, (match, index) => `<code class="md-code">${codes[Number(index)]}</code>`);
}

/**
 * 把「扁平 + 缩进」的列表项渲染成嵌套的 `<ul>` / `<ol>`（缩进每两级算一层）
 * @param {Array<{ indent: number, ordered: boolean, text: string }>} items 列表项
 * @returns {string} HTML 片段
 */
function renderList(items) {
	/** @type {Array<{ ordered: boolean, level: number }>} */
	const stack = [];
	let html = "";
	for (const item of items) {
		const level = Math.max(0, Math.floor(item.indent / 2));
		while (stack.length && stack[stack.length - 1].level > level) {
			const closed = stack.pop();
			html += closed.ordered ? "</ol>" : "</ul>";
		}
		if (!stack.length || stack[stack.length - 1].level < level) {
			stack.push({ ordered: item.ordered, level });
			html += item.ordered ? '<ol class="md-ol">' : '<ul class="md-ul">';
		} else if (stack[stack.length - 1].ordered !== item.ordered) {
			//同层但列表类型变了：关掉再开（保持结构合法）
			const closed = stack.pop();
			html += closed.ordered ? "</ol>" : "</ul>";
			stack.push({ ordered: item.ordered, level });
			html += item.ordered ? '<ol class="md-ol">' : '<ul class="md-ul">';
		}
		html += `<li>${renderInline(item.text)}</li>`;
	}
	while (stack.length) {
		const closed = stack.pop();
		html += closed.ordered ? "</ol>" : "</ul>";
	}
	return html;
}

/**
 * 渲染一段 Markdown 为 HTML。
 * @param {string} source Markdown 文本
 * @returns {string} HTML 字符串（可直接 `v-html`）
 */
export function renderMarkdown(source) {
	const lines = String(source ?? "").replace(/\r\n?/g, "\n").split("\n");
	/** @type {string[]} */
	const blocks = [];
	let index = 0;

	while (index < lines.length) {
		const line = lines[index];

		//空行：跳过（用于分隔块）
		if (!line.trim()) {
			index++;
			continue;
		}

		//围栏代码块
		if (RE_FENCE.test(line)) {
			/** @type {string[]} */
			const code = [];
			index++;
			while (index < lines.length && !RE_FENCE.test(lines[index])) {
				code.push(lines[index++]);
			}
			index++; //跳过结束围栏
			blocks.push(`<pre class="md-pre"><code>${code.join("\n")}</code></pre>`);
			continue;
		}

		//水平线
		if (RE_HR.test(line)) {
			blocks.push('<hr class="md-hr">');
			index++;
			continue;
		}

		//标题
		const heading = line.match(RE_HEADING);
		if (heading) {
			const level = heading[1].length;
			blocks.push(`<h${level} class="md-h md-h${level}">${renderInline(heading[2].trim())}</h${level}>`);
			index++;
			continue;
		}

		//引用（内部递归渲染，支持嵌套列表 / 多段）
		if (RE_QUOTE.test(line)) {
			/** @type {string[]} */
			const quote = [];
			while (index < lines.length && RE_QUOTE.test(lines[index])) {
				quote.push(lines[index++].replace(RE_QUOTE, ""));
			}
			blocks.push(`<blockquote class="md-quote">${renderMarkdown(quote.join("\n"))}</blockquote>`);
			continue;
		}

		//表格：当前行含 `|` 且下一行是分隔行
		if (line.includes("|") && index + 1 < lines.length && RE_TABLE_SEP.test(lines[index + 1])) {
			const cells = row => row.trim().replace(/^\||\|$/g, "").split("|").map(cell => renderInline(cell.trim()));
			const head = cells(line);
			index += 2; //跳过表头与分隔行
			/** @type {string[][]} */
			const rows = [];
			while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
				rows.push(cells(lines[index++]));
			}
			const headHtml = head.map(cell => `<th>${cell}</th>`).join("");
			const bodyHtml = rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("");
			blocks.push(`<table class="md-table"><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`);
			continue;
		}

		//列表（含缩进嵌套与简单续行）
		const listItem = line.match(RE_LIST_ITEM);
		if (listItem) {
			/** @type {Array<{ indent: number, ordered: boolean, text: string }>} */
			const items = [];
			while (index < lines.length) {
				const current = lines[index].match(RE_LIST_ITEM);
				if (current) {
					items.push({
						indent: current[1].replace(/\t/g, "  ").length,
						ordered: /\d/.test(current[2]),
						text: current[3],
					});
					index++;
					continue;
				}
				//缩进的非列表行：接到上一条（Markdown 的"懒续行"）
				if (items.length && lines[index].trim() && /^\s{2,}\S/.test(lines[index])) {
					items[items.length - 1].text += ` ${lines[index].trim()}`;
					index++;
					continue;
				}
				break;
			}
			blocks.push(renderList(items));
			continue;
		}

		//段落：连着读到空行 / 下一个块级标记，段内换行转 <br>
		/** @type {string[]} */
		const paragraph = [];
		while (index < lines.length) {
			const current = lines[index];
			if (
				!current.trim() ||
				RE_FENCE.test(current) ||
				RE_HR.test(current) ||
				RE_HEADING.test(current) ||
				RE_QUOTE.test(current) ||
				RE_LIST_ITEM.test(current) ||
				RE_DIRECTIVE_OPEN.test(current) ||
				RE_DIRECTIVE_CLOSE.test(current)
			) {
				break;
			}
			paragraph.push(current.trim());
			index++;
		}
		if (paragraph.length) blocks.push(`<p class="md-p">${renderInline(paragraph.join("\n")).replace(/\n/g, "<br>")}</p>`);
	}

	return blocks.join("\n");
}

/**
 * 把公告正文切成「HTML 片段」与「干员 / 卡牌按钮组」两种片段，供两个 UI 依次渲染。
 *
 * - 正文里写了 `:::player` / `:::cards` 指令 ⇒ 按钮组渲染在指令位置，条目取指令块内的行；
 * - 指令块里没写条目 ⇒ 回落到 `info.player` / `info.cards`；
 * - 正文里完全没写某类指令（改造前的写法）⇒ 该类按钮组自动追加到末尾，行为与改造前一致。
 *
 * 另外兼容旧的 `{ intro: string[], player, cards }`：没有 `md` 时把 `intro` 逐条当无序列表渲染。
 *
 * @param {string} [md] 公告正文（Markdown）
 * @param {object} [info] 更新信息对象（`{ md, player, cards }`）
 * @returns {Array<{ type: "html", html: string } | { type: "player" | "card", items: string[] }>} 片段数组
 */
export function splitNotice(md, info = {}) {
	let source = md;
	if (typeof source !== "string") {
		//兼容旧结构：intro 是"一行一条"的数组
		source = Array.isArray(info?.intro) ? info.intro.map(item => `- ${item}`).join("\n\n") : "";
	}

	const lines = source.replace(/\r\n?/g, "\n").split("\n");
	/** @type {Array<{ type: "html", html: string } | { type: "player" | "card", items: string[] }>} */
	const segments = [];
	/** @type {string[]} */
	let buffer = [];
	const flush = () => {
		if (buffer.some(line => line.trim())) segments.push({ type: "html", html: renderMarkdown(buffer.join("\n")) });
		buffer = [];
	};

	for (let index = 0; index < lines.length; index++) {
		const open = lines[index].match(RE_DIRECTIVE_OPEN);
		const type = open ? DIRECTIVE_TYPES[open[1].toLowerCase()] : void 0;
		if (!type) {
			buffer.push(lines[index]);
			continue;
		}
		/** @type {string[]} */
		const items = [];
		index++;
		while (index < lines.length && !RE_DIRECTIVE_CLOSE.test(lines[index])) {
			if (lines[index].trim()) items.push(lines[index].trim());
			index++;
		}
		flush();
		const fallback = fallbackItems(info, type);
		segments.push({ type, items: items.length ? items : fallback });
	}
	flush();

	//正文没写指令的类型：按改造前的老行为补到末尾
	for (const type of /** @type {const} */ (["player", "card"])) {
		if (segments.some(segment => segment.type === type)) continue;
		const items = fallbackItems(info, type);
		if (items.length) segments.push({ type, items });
	}

	return segments;
}

/**
 * 是否需要在公告里显示"新增干员 / 新增卡片"这类按钮组
 * @param {object} [info] 更新信息对象
 * @returns {boolean} 有任何条目时为 true
 */
export function hasNoticeContent(info = {}) {
	const segments = splitNotice(info?.md, info);
	return segments.some(segment => (segment.type === "html" ? !!segment.html.trim() : segment.items.length > 0));
}
