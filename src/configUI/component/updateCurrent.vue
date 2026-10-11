<template>
	<div ref="rootRef" class="updateCurrent">
		<!-- 版本标题 -->
		<div class="UpdateCurrentTitle">驶舰之向 v{{ version }}更新内容</div>

		<!-- 操作栏（仅开发者模式显示；截图时通过 filter 排除，不出现在图片里） -->
		<div v-if="devMode" class="UpdateCurrentActions">
			<button type="button" class="capture-btn" :disabled="capturing" @click="captureScreenshot">
				{{ capturing ? "截图中…" : "截图本页" }}
			</button>
		</div>

		<div class = "UpdateCurrentOverVersion">最低适配版本: {{ over }}</div>

		<!-- 正文（Markdown）与「干员 / 卡牌」按钮组：顺序由正文里的 :::player / :::cards 指令决定，
		     没写指令的类型会在片段末尾自动补上（与改造前一致） -->
		<template v-for="(segment, index) in segments" :key="index">
			<div v-if="segment.type === 'html'" class="UpdateCurrentContent md-body" v-html="segment.html"></div>

			<div v-else-if="segment.type === 'player'" class="UpdateCurrentOther">
				<div class="section-title">{{ sectionTitle(segment) }}</div>
				<div :ref="el => setGridRef(el, index)" class="character-container"></div>
			</div>

			<div v-else class="UpdateCurrentOther">
				<div class="section-title">{{ sectionTitle(segment) }}</div>
				<div :ref="el => setGridRef(el, index)" class="card-container"></div>
			</div>
		</template>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { ui } from "noname";
import { whichWayUtil } from "../../utill";
import { whichWayVersion } from "../../version.js";
import { whichWayUpdateLog } from "../../updateLog/index.js";
import { whichWayCharacterCard } from "../../characterCard/index.ts";
import { splitNotice } from "../../updateLog/markdown.js";

const version = ref(whichWayVersion.ext);
const over = ref(whichWayVersion.noname.over);

const updateData = whichWayUpdateLog.currentLog;

/**
 * 正文片段：Markdown 渲染结果 + 干员 / 卡牌按钮组（见 markdown.js 的 splitNotice）。
 * 兼容旧结构 `{ intro: string[], player, cards }`。
 */
const segments = computed(() => splitNotice(updateData?.md, updateData));

/**
 * 按钮组的小标题：按「类型 + 分组」区分新增 / 调整
 * @param {{ type: "player" | "card", group: "add" | "adjust" }} segment 片段
 */
const sectionTitle = segment => {
	const isPlayer = segment.type === "player";
	const isAdd = segment.group !== "adjust";
	if (isPlayer) return isAdd ? "新增干员" : "调整干员";
	return isAdd ? "新增卡牌" : "调整卡牌";
};

// 片段下标 → 按钮组容器（一个公告里可能出现多个 :::player / :::cards）
const gridRefs = new Map();
const setGridRef = (el, index) => {
	if (el) gridRefs.set(index, el);
	else gridRefs.delete(index);
};

/** 用引擎的按钮预设填充各按钮组容器 */
const renderGrids = () => {
	gridRefs.forEach((container, index) => {
		const segment = segments.value[index];
		if (!container || !segment || segment.type === "html") return;

		container.innerHTML = "";

		const isPlayer = segment.type === "player";
		const preset = isPlayer ? ui?.create?.buttonPresets?.character : ui?.create?.buttonPresets?.vcard;
		if (typeof preset !== "function") {
			console.warn(`[UpdateCurrent] 按钮 API 不可用，跳过渲染：${segment.type}`);
			return;
		}

		segment.items.forEach(name => {
			try {
				const element = preset(name, isPlayer ? "player" : "card");
				//@ts-ignore
				if (element?.nodeType !== 1) return;

				//干员卡支持双击打开武将信息卡（与"更新日志"页一致）
				if (isPlayer) {
					element.addEventListener("dblclick", e => {
						e.stopPropagation();
						//@ts-ignore
						whichWayCharacterCard.create(name);
					});
				}

				//@ts-ignore
				container.appendChild(element);
			} catch (error) {
				console.error(`创建${isPlayer ? "角色" : "卡片"} ${name} 失败:`, error);
			}
		});
	});
};

// 组件挂载
onMounted(() => {
	nextTick(renderGrids);
});// 组件卸载时清理
onUnmounted(() => {
	gridRefs.forEach(container => {
		container.innerHTML = "";
	});
	gridRefs.clear();
});

// 更新内容变化（例如开发时热更新了 currentLog）时重绘按钮组
watch(
	() => segments.value,
	() => {
		nextTick(renderGrids);
	},
	{ deep: true }
);

// ———— 截图导出（modern-screenshot，MIT，仅开发者模式可见）————
const rootRef = ref(null);
const capturing = ref(false);
const devMode = whichWayUtil.isDeveloperMode();

/** 把当前更新公告面板整页导出为 JPEG（含滚动区外的全部内容，操作栏不进图） */
const captureScreenshot = async () => {
	const node = rootRef.value;
	if (!node || capturing.value) return;

	capturing.value = true;
	//面板本身是 `height:calc(100%-40px)+overflow:auto` 的滚动容器，且引擎全局
	//`div{position:absolute;transition:all .5s}` 会让尺寸变化带 0.5s 过渡。
	//截图前关掉过渡、改为静态按内容收缩，并强制回流，否则会把大段空白一起截进去。
	const prev = {
		transition: node.style.transition,
		position: node.style.position,
		height: node.style.height,
		maxHeight: node.style.maxHeight,
		overflow: node.style.overflow,
	};
	node.style.transition = "none";
	node.style.position = "static";
	node.style.height = "auto";
	node.style.maxHeight = "none";
	node.style.overflow = "visible";
	void node.offsetHeight; //强制回流，让上面的尺寸立即生效
	//用未缩放的布局尺寸（offsetWidth/offsetHeight）当画布尺寸：
	//无名杀把整个 UI 用 `body{transform:scale(zoom)}` 缩放适配窗口，
	//modern-screenshot 默认取 getBoundingClientRect()（缩放后尺寸）建画布，
	//而克隆体按未缩放布局渲染，zoom>1 时右侧/底部就会多出空白。显式传尺寸可消除。
	const captureWidth = node.offsetWidth;
	const captureHeight = node.offsetHeight;

	try {
		const { domToJpeg } = await import("modern-screenshot");
		const dataUrl = await domToJpeg(node, {
			width: captureWidth,
			height: captureHeight,
			scale: 1.5,
			quality: 0.82,
			backgroundColor: "#1e2733",
			//排除操作栏（截图按钮自身）
			filter: el => !(el instanceof HTMLElement && el.classList.contains("UpdateCurrentActions")),
		});

		const link = document.createElement("a");
		link.download = `驶舰之向-更新公告-v${version.value}.jpg`;
		link.href = dataUrl;
		link.click();
	} catch (error) {
		console.error("[UpdateCurrent] 截图失败:", error);
		alert("截图失败，详见控制台");
	} finally {
		node.style.transition = prev.transition;
		node.style.position = prev.position;
		node.style.height = prev.height;
		node.style.maxHeight = prev.maxHeight;
		node.style.overflow = prev.overflow;
		capturing.value = false;
	}
};
</script>

<style scoped>
.updateCurrent {
	padding: 20px;
	color: #fff;
	width: calc(100% - 40px);
	height: calc(100% - 40px);
	overflow: auto;
}

.UpdateCurrentTitle {
	width: 100%;
	position: relative;
	font-size: 24px;
	font-weight: bold;
	color: #a3bbc3;
	margin-bottom: 20px;
	text-align: center;
	text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
}

.UpdateCurrentOverVersion {
	width: calc(100% - 30px);
	position: relative;
	margin-bottom: 30px;
	padding: 15px;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 8px;
	border-left: 4px solid #f14a13;
}

.UpdateCurrentContent {
	width: calc(100% - 30px);
	position: relative;
	margin-bottom: 30px;
	padding: 15px;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 8px;
	border-left: 4px solid #4a90e2;
}

.UpdateCurrentOther {
	width: 100%;
	position: relative;
	margin-bottom: 30px;
}

.section-title {
	position: relative;
	font-size: 18px;
	font-weight: bold;
	color: #ffd700;
	margin-bottom: 15px;
	padding-left: 10px;
	border-left: 3px solid #ffd700;
}

.character-container,
.card-container {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	justify-content: flex-start;
	padding: 10px;
	min-height: 100px;
}

/* 角色和卡片的通用样式 */
:deep(.character),
:deep(.vcard) {
	transition: all 0.3s ease;
	cursor: pointer;
	position: relative;
}

:deep(.character):hover,
:deep(.vcard):hover {
	transform: scale(1.1);
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
	z-index: 10;
}

:deep(.character) {
	width: 80px;
	height: 100px;
}

:deep(.vcard) {
	width: 100px;
	height: 140px;
}

/* ---------- Markdown 正文 ---------- */
/* v-html 插入的节点不带 scoped 属性，需要用 :deep 命中 */
.md-body :deep(.md-h) {
	color: #a3d0ff;
	margin: 18px 0 10px;
	line-height: 1.4;
	font-weight: bold;
}
.md-body :deep(.md-h1),
.md-body :deep(.md-h2) {
	font-size: 22px;
}
.md-body :deep(.md-h3) {
	font-size: 18px;
}
.md-body :deep(.md-h4),
.md-body :deep(.md-h5),
.md-body :deep(.md-h6) {
	font-size: 16px;
	color: #c3d6f7;
}
.md-body :deep(.md-h:first-child) {
	margin-top: 0;
}
.md-body :deep(.md-p) {
	margin: 10px 0;
	line-height: 1.8;
	font-size: 14px;
}
.md-body :deep(.md-ul),
.md-body :deep(.md-ol) {
	margin: 10px 0;
	padding-left: 24px;
	line-height: 1.8;
	font-size: 14px;
}
.md-body :deep(li) {
	margin-bottom: 6px;
}
.md-body :deep(li::marker) {
	color: #4a90e2;
}
.md-body :deep(.md-code) {
	background: rgba(255, 255, 255, 0.12);
	border-radius: 4px;
	padding: 1px 5px;
	font-family: Consolas, Monaco, "Courier New", monospace;
	font-size: 0.92em;
	color: #ffd7a1;
}
.md-body :deep(.md-pre) {
	background: rgba(0, 0, 0, 0.35);
	border-radius: 8px;
	padding: 12px;
	margin: 10px 0;
	overflow-x: auto;
}
.md-body :deep(.md-pre code) {
	font-family: Consolas, Monaco, "Courier New", monospace;
	font-size: 0.9em;
	color: #d7e3ff;
	white-space: pre;
}
.md-body :deep(.md-quote) {
	margin: 10px 0;
	padding: 8px 12px;
	border-left: 4px solid #4a90e2;
	background: rgba(74, 144, 226, 0.1);
	border-radius: 0 6px 6px 0;
	color: #cfe0ff;
}
.md-body :deep(.md-hr) {
	border: none;
	border-top: 1px dashed rgba(255, 255, 255, 0.25);
	margin: 16px 0;
}
.md-body :deep(.md-a) {
	color: #7fb2ff;
	text-decoration: none;
	border-bottom: 1px dashed currentColor;
	word-break: break-all;
}
.md-body :deep(.md-a:hover) {
	color: #a8c8ff;
}
.md-body :deep(.md-table) {
	border-collapse: collapse;
	margin: 10px 0;
	width: 100%;
	font-size: 14px;
}
.md-body :deep(.md-table th),
.md-body :deep(.md-table td) {
	border: 1px solid rgba(255, 255, 255, 0.22);
	padding: 6px 10px;
	text-align: left;
}
.md-body :deep(.md-table th) {
	background: rgba(74, 144, 226, 0.18);
	color: #a3d0ff;
}
.md-body :deep(strong) {
	color: #ffd7a1;
}

/* ---------- 操作栏 / 截图按钮 ---------- */
/* `.UpdateCurrentActions` 是 div，必须显式 position，否则被引擎全局
   `div{position:absolute}` 命中而脱离文档流（与扩展介绍页同样的坑） */
.UpdateCurrentActions {
	position: relative;
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-bottom: 16px;
}

.capture-btn {
	position: relative;
	padding: 6px 16px;
	font-size: 14px;
	color: #cfe0ff;
	background: rgba(74, 144, 226, 0.18);
	border: 1px solid rgba(74, 144, 226, 0.55);
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.15s, box-shadow 0.15s;
}

.capture-btn:hover:not(:disabled) {
	background: rgba(74, 144, 226, 0.32);
	box-shadow: 0 0 10px rgba(74, 144, 226, 0.4);
}

.capture-btn:disabled {
	opacity: 0.6;
	cursor: default;
}

/* 滚动条样式 */
.updateCurrent::-webkit-scrollbar {
	width: 8px;
}

.updateCurrent::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 4px;
}

.updateCurrent::-webkit-scrollbar-thumb {
	background: #4a90e2;
	border-radius: 4px;
}

.updateCurrent::-webkit-scrollbar-thumb:hover {
	background: #3a7bc8;
}
</style>
