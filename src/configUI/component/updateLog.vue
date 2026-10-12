<!-- UpdateLog.vue -->
<template>
	<div class="update-log-wrapper">
		<!-- 搜索框 -->
		<div class="search-box">
			<div class="image-box">
				<img v-if="searchIconUrl" :src="searchIconUrl" alt="搜索图标" />
			</div>
			<input v-model="searchQuery" type="text" class="search-input" placeholder="搜索版本号、日期或更新内容..." />
		</div>
		<!-- 滚动区域 -->
		<div ref="scrollContainer" class="scroll-container">
			<!-- 欢迎信息 -->
			<div v-if="welcomeMessage" class="welcome-section">
				<div class="welcome-content" v-html="welcomeMessage"></div>
			</div>

			<!-- 版本列表 -->
			<div class="version-list">
				<div v-for="version in filteredVersions" :key="version.id" class="version-card" :class="{ collapsed: version.collapsed }">
					<!-- 版本标题 -->
					<div class="version-header" @click="toggleVersion(version)">
						<div class="version-info">
							<span class="version-number">{{ version.version }}</span>
							<span class="version-date">{{ version.date }}</span>
						</div>
						<div class="version-toggle">
							<span class="toggle-icon">{{ version.collapsed ? "▶" : "▼" }}</span>
							<span class="update-count">{{ version.items.length }} 项更新</span>
						</div>
					</div>

					<!-- 更新内容 -->
					<div v-show="!version.collapsed" class="version-content">
						<ul class="update-items">
							<li v-for="(item, itemIndex) in version.items" :key="itemIndex" class="update-item" v-html="formatUpdateItem(item)"></li>
						</ul>
					</div>
				</div>

				<!-- 无结果提示 -->
				<div v-if="filteredVersions.length === 0" class="no-results">
					<div class="no-results-icon">🔍</div>
					<div class="no-results-text">没有找到匹配的更新记录</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { whichWayUpdateLog } from "../../updateLog/index.js";
import { renderInline } from "../../updateLog/markdown.js";
import { whichWayFile } from "../../file.js";

// Props 和 Emits
const emit = defineEmits(["loaded"]);

// Refs
const scrollContainer = ref(null);
const searchQuery = ref("");
const searchIconUrl = ref("");

// 更新日志数据
const welcomeMessage = ref("");
const versions = ref([]);

// 过滤后的版本
const filteredVersions = computed(() => {
	if (!searchQuery.value.trim()) {
		return versions.value;
	}

	const query = searchQuery.value.trim().toLowerCase();

	return versions.value.filter(version => {
		// 检查版本号
		if (version.version.toLowerCase().includes(query)) {
			return true;
		}

		// 检查日期
		if (version.date.toLowerCase().includes(query)) {
			return true;
		}

		// 检查更新内容
		return version.items.some(item => {
			// 移除 HTML 标签后搜索
			const text = item.replace(/<[^>]*>/g, "").toLowerCase();
			return text.includes(query);
		});
	});
});

// 解析更新日志
function parseUpdateLog(logText) {
	if (!logText) {
		console.warn("[UpdateLog] 更新日志为空");
		return;
	}

	try {
		// 移除 <pre> 标签
		const cleanText = logText
			.replace(/<pre[^>]*>/g, "")
			.replace(/<\/pre>/g, "")
			.trim();

		// 分割成行
		const lines = cleanText.split("\n").map(line => line.trim());

		// 第一部分：欢迎信息（直到第一个版本号之前）
		const welcomeLines = [];
		let versionStartIndex = 0;

		for (let i = 0; i < lines.length; i++) {
			// 检测版本号格式：YYYY.MM.DD vX.X.X
			if (/^\d{4}\.\d{1,2}\.\d{1,2}\s+v\d+\.\d+/.test(lines[i])) {
				versionStartIndex = i;
				break;
			}
			if (lines[i]) {
				welcomeLines.push(lines[i]);
			}
		}

		// 处理欢迎信息
		if (welcomeLines.length > 0) {
			welcomeMessage.value = welcomeLines.join("<br>");
		}

		// 解析各个版本
		const versionList = [];
		let currentVersion = null;

		for (let i = versionStartIndex; i < lines.length; i++) {
			const line = lines[i].trim();

			// 检测版本号行
			const versionMatch = line.match(/^(\d{4}\.\d{1,2}\.\d{1,2})\s+(v\d+\.\d+(?:\.\d+)?)/);
			if (versionMatch) {
				// 保存上一个版本
				if (currentVersion) {
					versionList.push(currentVersion);
				}

				// 创建新版本
				currentVersion = {
					id: `v${versionList.length + 1}`,
					date: versionMatch[1],
					version: versionMatch[2],
					items: [],
					collapsed: versionList.length > 2, // 默认折叠较旧的版本
				};
				continue;
			}

			// 如果当前有版本，处理更新项
			if (currentVersion && line) {
				// 移除引号和逗号
				let item = line.replace(/^"/, "").replace(/",?$/, "").trim();

				// 跳过空行
				if (item) {
					currentVersion.items.push(item);
				}
			}
		}

		// 保存最后一个版本
		if (currentVersion) {
			versionList.push(currentVersion);
		}

		versions.value = versionList;
		console.log("[UpdateLog] 已解析", versionList.length, "个版本");
	} catch (error) {
		console.error("[UpdateLog] 解析更新日志失败:", error);
	}
}

// 关键词高亮规则（渲染成 HTML 之后，仅对标签之外的纯文本片段生效）
const HIGHLIGHT_PATTERNS = [
	{ pattern: /新增(干员|皮肤|动态皮肤|背景|成就|模组|功能|模式)/g, className: "keyword-add" },
	{ pattern: /调整(技能|武将)/g, className: "keyword-modify" },
	{ pattern: /修复.*?的bug/g, className: "keyword-fix" },
	{ pattern: /优化.*?/g, className: "keyword-optimize" },
	{ pattern: /删除.*?/g, className: "keyword-remove" },
];

/**
 * 只在标签之外的文本里做替换，避免把 <strong>/<code> 等标签夹进 <span> 里造成标签错位。
 * @param {string} html 已渲染的 HTML 片段
 * @param {RegExp} pattern 带 g 的正则
 * @param {string} className 高亮 span 的类名
 */
function highlightPlainText(html, pattern, className) {
	return html
		.split(/(<[^>]+>)/)
		.map(segment => (segment.startsWith("<") ? segment : segment.replace(pattern, match => `<span class="${className}">${match}</span>`)))
		.join("");
}

// 格式化更新项：同时兼容「"引号条目"」老格式与「- **md**：`code`」新格式
function formatUpdateItem(item) {
	let text = item;

	// 1) 新版条目把行内代码写成转义反引号 \`code\`，先还原成 `code`
	text = text.replace(/\\`/g, "`");
	// 2) 条目本身已是 <li>，去掉 Markdown 无序列表前缀 "- " / "* " / "+ "
	text = text.replace(/^[-*+]\s+/, "");
	// 3) 还原历史遗留的实体写法（<br>、<s> 等仍希望按原样渲染）
	text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

	// 4) 用与更新公告一致的 Markdown 行内渲染：**粗体** / `代码` / ~~删除线~~ / [链接]()
	let html = renderInline(text);

	// 5) 关键词高亮（仅文本片段内进行，保证 HTML 结构合法）
	for (const { pattern, className } of HIGHLIGHT_PATTERNS) {
		html = highlightPlainText(html, pattern, className);
	}

	return html;
}

// 切换版本展开/折叠
function toggleVersion(version) {
	version.collapsed = !version.collapsed;
}

// 初始化
onMounted(async () => {
	try {
		// 解析更新日志
		if (whichWayUpdateLog.updateLog) {
			parseUpdateLog(whichWayUpdateLog.updateLog);
		} else {
			console.warn("[UpdateLog] 未找到更新日志数据");
		}

		// 获取搜索图标
		searchIconUrl.value = whichWayFile.compilePath("ui:watch.png");

		// 添加返回顶部按钮
		if (scrollContainer.value) {
			//   await configUI.addBackToTopButton({ container: scrollContainer.value });

			// 触发加载完成事件
			emit("loaded");
		}
	} catch (error) {
		console.error("[UpdateLog] 初始化失败:", error);
	}
});

// 清理
onUnmounted(() => {
	// 组件卸载时的清理工作
});
</script>

<style scoped>
.update-log-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.scroll-container {
	width: calc(100% - 40px);
	height: calc(100% - 20px);
	overflow: auto;
	padding: 20px;
	background: rgba(0, 0, 0, 0.2);
	position: relative;
}

/* 欢迎信息 */
.welcome-section {
	margin-bottom: 24px;
	padding: 20px;
	background: linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(40, 96, 144, 0.2));
	border-radius: 12px;
	border: 1px solid rgba(64, 158, 255, 0.4);
	position: relative;
	width: calc(100% - 40px);
	height: 200px;
}

.welcome-content {
	color: #e6e6e6;
	font-size: 16px;
	text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
	width: 100%;
}

.welcome-content br {
	margin-bottom: 2px;
}

/* 搜索框 */
.search-box {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 8px;
	position: relative;
	width: calc(100% - 24px);
	height: 20px;
}

.image-box {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
    position: relative;
}

.image-box img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.search-input {
	position: relative;
    width: calc(100% - 12px - 32px);
	padding: 8px 12px;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 4px;
	font-size: 14px;
	outline: none;
	background: rgba(255, 255, 255, 0.1);
	color: #fff;
	transition: border-color 0.3s;
}

.search-input::placeholder {
	color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
	border-color: #409eff;
	background: rgba(255, 255, 255, 0.15);
}

/* 版本列表 */
.version-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	position: relative;
}

/* 版本卡片 */
.version-card {
	background: rgba(0, 0, 0, 0.4);
	border-radius: 12px;
	overflow: hidden;
	transition: all 0.3s;
	border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
}

.version-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	border-color: rgba(255, 255, 255, 0.2);
}

/* 版本标题 */
.version-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	background: linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(40, 96, 144, 0.2));
	cursor: pointer;
	user-select: none;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
}

.version-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
    position: relative;
}

.version-number {
	font-size: 18px;
	font-weight: bold;
	color: #409eff;
	text-shadow: 0 0 4px rgba(64, 158, 255, 0.6);
}

.version-date {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.7);
}

.version-toggle {
	display: flex;
	align-items: center;
	gap: 12px;
    position: relative;
}

.toggle-icon {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.7);
	transition: transform 0.3s;
}

.update-count {
	font-size: 13px;
	color: rgba(255, 255, 255, 0.6);
	background: rgba(0, 0, 0, 0.3);
	padding: 2px 8px;
	border-radius: 10px;
}

/* 版本内容 */
.version-content {
	padding: 16px 20px;
    position: relative;
	width: calc(100% - 40px);
}

.update-items {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.update-item {
	padding: 10px 12px;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 6px;
	color: #e6e6e6;
	font-size: 14px;
	line-height: 1.6;
	border-left: 3px solid rgba(64, 158, 255, 0.5);
	transition: all 0.2s;
}

.update-item:hover {
	background: rgba(64, 158, 255, 0.1);
	border-left-color: #409eff;
	transform: translateX(4px);
}

/* Markdown 行内元素（v-html 内容不带 scoped 属性，样式必须走 :deep） */
.update-item :deep(code.md-code) {
	background: rgba(0, 0, 0, 0.35);
	color: #ffd7a1;
	padding: 1px 6px;
	border-radius: 4px;
	font-family: Consolas, Monaco, monospace;
	font-size: 0.92em;
}

.update-item :deep(strong) {
	color: #ffd7a1;
	font-weight: bold;
}

.update-item :deep(a.md-a) {
	color: #409eff;
	text-decoration: underline;
}

.update-item :deep(del) {
	color: rgba(230, 230, 230, 0.5);
}

/* 关键词高亮 */
.keyword-add {
	color: #67c23a;
	font-weight: bold;
}

.keyword-modify {
	color: #e6a23c;
	font-weight: bold;
}

.keyword-fix {
	color: #f56c6c;
	font-weight: bold;
}

.keyword-optimize {
	color: #409eff;
	font-weight: bold;
}

.keyword-remove {
	color: #909399;
	font-weight: bold;
}

/* 无结果提示 */
.no-results {
	text-align: center;
	padding: 40px 20px;
	color: rgba(255, 255, 255, 0.5);
}

.no-results-icon {
	font-size: 48px;
	margin-bottom: 16px;
	opacity: 0.3;
}

.no-results-text {
	font-size: 16px;
}

/* 滚动条美化 */
.scroll-container::-webkit-scrollbar {
	width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.3);
	border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.3);
	border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.5);
}
</style>
