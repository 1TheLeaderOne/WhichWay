<template>
  <div class="update-notice">
    <div class="notice-header">
      <h2>驶舰之向 v{{ version }} 更新公告</h2>
      <button @click="handleClose" class="close-btn">×</button>
    </div>

    <div class="notice-content">
      <!-- 最低适配版本提示 -->
      <div class="update-section">最低适配版本: {{ over }}</div>

      <!-- 正文（Markdown）与「干员 / 卡牌」按钮组：顺序由正文里的 :::player / :::cards 指令决定，
           没写指令的类型会在片段末尾自动补上（与改造前一致） -->
      <template v-for="(segment, index) in segments" :key="index">
        <section v-if="segment.type === 'html'" class="update-section md-body" v-html="segment.html"></section>

        <section v-else-if="segment.type === 'player'" class="update-section">
          <h3>👥 新增干员</h3>
          <div :ref="el => setGridRef(el, index)" class="character-grid"></div>
        </section>

        <section v-else class="update-section">
          <h3>🃏 新增卡片</h3>
          <div :ref="el => setGridRef(el, index)" class="card-grid"></div>
        </section>
      </template>

      <!-- 空状态提示 -->
      <div v-if="!hasContent" class="empty-state">暂无更新内容</div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { whichWayVersion } from '../version.js';
import { splitNotice, hasNoticeContent } from './markdown.js';

let version = whichWayVersion.ext;
let over = whichWayVersion.noname.over;

// Props
const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({ md: '', intro: [], player: [], cards: [] })
  },
  onClose: {
    type: Function,
    default: () => {}
  }
});

// Emits
const emit = defineEmits(['close']);

/**
 * 正文片段：Markdown 渲染结果 + 干员 / 卡牌按钮组（见 markdown.js 的 splitNotice）。
 * 兼容旧结构 `{ intro: string[], player, cards }`。
 */
const segments = computed(() => splitNotice(props.info?.md, props.info));

// 是否有任何可展示的内容（正文片段或按钮组条目）
const hasContent = computed(() => hasNoticeContent(props.info));

// Refs：片段下标 → 按钮组容器（一个公告里可能出现多个 :::player / :::cards）
const gridRefs = new Map();
const setGridRef = (el, index) => {
  if (el) gridRefs.set(index, el);
  else gridRefs.delete(index);
};

// Methods
/** 用引擎的按钮预设填充各按钮组容器 */
const renderGrids = () => {
  gridRefs.forEach((container, index) => {
    const segment = segments.value[index];
    if (!container || !segment || segment.type === 'html') return;

    while (container.firstChild) container.removeChild(container.firstChild);

    const presets = window?.ui?.create?.buttonPresets;
    const preset = segment.type === 'player' ? presets?.character : presets?.vcard;
    if (typeof preset !== 'function') {
      console.warn(`[UpdateNotice] 按钮 API 不可用，跳过渲染：${segment.type}`);
      return;
    }

    segment.items.forEach(name => {
      try {
        const btn = preset(name);
        //@ts-ignore
        if (btn?.nodeType === 1) container.appendChild(btn);
      } catch (e) {
        console.error(`渲染${segment.type === 'player' ? '干员' : '卡片'}按钮失败 (${name}):`, e);
      }
    });
  });
};

const handleClose = () => {
  emit('close');
  if (typeof props.onClose === 'function') {
    props.onClose();
  }
};

// Lifecycle Hooks
onMounted(() => {
  nextTick(renderGrids);
});

onBeforeUnmount(() => {
  gridRefs.forEach(container => {
    while (container.firstChild) container.removeChild(container.firstChild);
  });
  gridRefs.clear();
});

// Watchers
watch(
  () => props.info,
  () => {
    nextTick(renderGrids);
  },
  { deep: true }
);
</script>
<style scoped>
.update-notice {
	background: linear-gradient(145deg, #1a1a2e, #16213e);
	color: #e6e6e6;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	width: 70%;
	height: 60%;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
	overflow: hidden;
}
.notice-header {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 24px;
	background: rgba(30, 30, 50, 0.9);
	border-bottom: 1px solid #4a4a7a;
	height: 10%;
}
.notice-header h2 {
	margin: 0;
	font-size: 1.5rem;
	-webkit-background-clip: text;
	background-clip: text;
	letter-spacing: 1px;
}
.close-btn {
	background: rgba(200, 50, 50, 0.2);
	color: #ff8888;
	border: none;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	font-size: 1.5rem;
	cursor: pointer;
	transition: all 0.2s;
}
.close-btn:hover {
	background: rgba(220, 40, 40, 0.4);
	transform: scale(1.1);
}
.notice-content {
	position: relative;
	width: 90%;
	height: 70%;
	padding: 20px;
	overflow-y: auto;
}
.update-section {
  position: relative;
	margin-bottom: 24px;
	padding-bottom: 16px;
	border-bottom: 1px dashed #3a3a6a;
  min-width: 100%;
}
.update-section:last-child {
	border-bottom: none;
	margin-bottom: 0;
	padding-bottom: 0;
}
.update-section h3 {
	color: #a1c4fd;
	margin: 0 0 12px 0;
	font-size: 1.3rem;
	display: flex;
	align-items: center;
}
.update-section h3::before {
	content: "";
	display: inline-block;
	width: 8px;
	height: 16px;
	background: #ff9a9e;
	border-radius: 2px;
	margin-right: 10px;
}
.character-grid,
.card-grid {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	gap: 12px;
	margin-top: 8px;
}
.empty-state {
	text-align: center;
	color: #7a7a9a;
	padding: 20px;
	font-style: italic;
}

/* ---------- Markdown 正文 ---------- */
/* v-html 插入的节点不带 scoped 属性，需要用 :deep 命中 */
.md-body :deep(.md-h) {
	color: #a1c4fd;
	margin: 18px 0 10px;
	line-height: 1.4;
}
.md-body :deep(.md-h1),
.md-body :deep(.md-h2) {
	font-size: 1.45rem;
}
.md-body :deep(.md-h3) {
	font-size: 1.3rem;
	display: flex;
	align-items: center;
}
.md-body :deep(.md-h3)::before {
	content: "";
	display: inline-block;
	width: 8px;
	height: 16px;
	background: #ff9a9e;
	border-radius: 2px;
	margin-right: 10px;
}
.md-body :deep(.md-h4),
.md-body :deep(.md-h5),
.md-body :deep(.md-h6) {
	font-size: 1.1rem;
	color: #c3d6f7;
}
.md-body :deep(.md-h:first-child) {
	margin-top: 0;
}
.md-body :deep(.md-p) {
	margin: 8px 0;
	line-height: 1.75;
}
.md-body :deep(.md-ul),
.md-body :deep(.md-ol) {
	margin: 8px 0;
	padding-left: 22px;
	line-height: 1.7;
}
.md-body :deep(li) {
	margin-bottom: 6px;
}
.md-body :deep(li::marker) {
	color: #ff9a9e;
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
	border-left: 4px solid #5a5a8a;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 0 6px 6px 0;
	color: #c9c9e6;
}
.md-body :deep(.md-hr) {
	border: none;
	border-top: 1px dashed #3a3a6a;
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
}
.md-body :deep(.md-table th),
.md-body :deep(.md-table td) {
	border: 1px solid #3a3a6a;
	padding: 6px 10px;
	text-align: left;
}
.md-body :deep(.md-table th) {
	background: rgba(74, 144, 226, 0.18);
	color: #a1c4fd;
}
.md-body :deep(strong) {
	color: #ffd7a1;
}

/* 滚动条美化 */
.notice-content::-webkit-scrollbar {
	width: 6px;
}
.notice-content::-webkit-scrollbar-track {
	background: #1e1e3a;
	border-radius: 3px;
}
.notice-content::-webkit-scrollbar-thumb {
	background: #5a5a8a;
	border-radius: 3px;
}
.notice-content::-webkit-scrollbar-thumb:hover {
	background: #7a7aad;
}
</style>
