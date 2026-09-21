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
          <h3>{{ sectionTitle(segment) }}</h3>
          <div :ref="el => setGridRef(el, index)" class="character-grid"></div>
        </section>

        <section v-else class="update-section">
          <h3>{{ sectionTitle(segment) }}</h3>
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
import { ui } from 'noname';
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

/**
 * 按钮组的小标题：按「类型 + 分组」区分新增 / 调整
 * @param {{ type: 'player' | 'card', group: 'add' | 'adjust' }} segment 片段
 */
const sectionTitle = segment => {
  const isPlayer = segment.type === 'player';
  const isAdd = segment.group !== 'adjust';
  if (isPlayer) return isAdd ? '👥 新增干员' : '🔧 调整干员';
  return isAdd ? '🃏 新增卡片' : '🔧 调整卡牌';
};

// Refs：片段下标 → 按钮组容器（一个公告里可能出现多个 :::player / :::cards）
const gridRefs = new Map();
const setGridRef = (el, index) => {
  if (el) gridRefs.set(index, el);
  else gridRefs.delete(index);
};

// Methods
/** 按钮组里每个格子的尺寸，与「更新内容」页（configUI/component/updateCurrent.vue）保持一致 */
const CELL_SIZE = {
  player: { width: 80, height: 100 },
  card: { width: 100, height: 140 }
};

/** 引擎的按钮预设（与「更新内容」页同源，`window.ui` 仅作兜底） */
const getButtonPresets = () => ui?.create?.buttonPresets ?? window?.ui?.create?.buttonPresets;

/** 内联 `!important` 钉死若干属性：优先级高于任何样式表，也高于同元素上的普通内联样式 */
const pinStyles = (el, decls) => {
  if (!el || !el.style) return;
  decls.forEach(decl => {
    const index = decl.indexOf(':');
    if (index < 0) return;
    el.style.setProperty(decl.slice(0, index), decl.slice(index + 1), 'important');
  });
};

/**
 * 钉死「按钮组 section」与「网格容器」的排版。
 *
 * 实测（游戏内控制台）出现过：网格自身 `display:flex` 且高 100px，但所在 `.update-section`
 * 只有标题那么高（28 / 56.7px）⇒ 网格没被算进 section 高度、两节互相重叠。
 * 说明有样式表之外的东西（运行时注入的 `style`，或脚本写的内联样式）动了这一层，
 * 这既不是本组件的 CSS、也不在任何 CSS 文件里，只能由这里反向钉死：
 * section 必须是普通块、高度自适应；网格必须留在文档流里（`position: static`）。
 */
const pinSectionLayout = container => {
  const section = container.closest?.('.update-section') ?? container.parentElement;
  pinStyles(section, [
    'display:block',
    'height:auto',
    'min-height:0',
    'max-height:none',
    'contain:none',
    'overflow:visible',
    'position:relative'
  ]);
  pinStyles(container, [
    'position:static',
    'float:none',
    'inset:auto',
    'clear:none',
    'width:100%',
    'height:auto',
    'max-height:none',
    'contain:none',
    'overflow:visible'
  ]);
};

/**
 * 用引擎的按钮预设填充各按钮组容器。
 *
 * 每个按钮都套一层**定尺格子** `.button-cell`，并把按钮自身的定位 / 尺寸 / 外边距
 * 用内联 `!important` 钉死：引擎按钮的样式是全局的 `.button.character` / `.vcard`，
 * 会被当前布局或其它 UI 扩展改写（例如千幻聆音的 `width:123px;height:174px;
 * margin:20px 10px 32px 10px`），那样按钮会撑破 grid 的 80px 轨道、卡片互相压叠，
 * 甚至脱离文档流导致 `.update-section` 只剩标题高度、两个 section 重叠。
 * 排版交给格子后，按钮怎么被改写都不会再影响相邻元素与 section 高度。
 */
const renderGrids = () => {
  gridRefs.forEach((container, index) => {
    const segment = segments.value[index];
    if (!container || !segment || segment.type === 'html') return;

    while (container.firstChild) container.removeChild(container.firstChild);

    //先把 section / 网格的排版钉死，再填按钮（顺序无关，但放前面能保证空网格也生效）
    pinSectionLayout(container);

    const isPlayer = segment.type === 'player';
    const presets = getButtonPresets();
    const preset = isPlayer ? presets?.character : presets?.vcard;
    if (typeof preset !== 'function') {
      console.warn(`[UpdateNotice] 按钮 API 不可用，跳过渲染：${segment.type}`);
      return;
    }

    const { width, height } = CELL_SIZE[isPlayer ? 'player' : 'card'];

    segment.items.forEach(name => {
      try {
        const btn = preset(name);
        //@ts-ignore
        if (btn?.nodeType !== 1) return;

        //外层定尺格子：公告的排版完全由它决定
        const cell = document.createElement('div');
        cell.className = 'button-cell';
        cell.style.cssText = `position:relative;flex:none;width:${width}px;height:${height}px;`;

        //内联 !important：优先级高于任何样式表（含 UI 扩展里的 !important 规则）
        for (const [prop, value] of Object.entries({
          position: 'relative',
          left: 'auto',
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          margin: '0',
          width: '100%',
          height: '100%'
        })) {
          btn.style.setProperty(prop, value, 'important');
        }

        cell.appendChild(btn);
        container.appendChild(cell);
      } catch (e) {
        console.error(`渲染${isPlayer ? '干员' : '卡片'}按钮失败 (${name}):`, e);
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
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: 15px;
	margin-top: 8px;
}

/**
 * 每个按钮的**定尺格子**（尺寸由 `renderGrids` 内联写在格子与按钮上，
 * 取值与「更新内容」页 `src/configUI/component/updateCurrent.vue` 一致：80×100 / 100×140）。
 *
 * 为什么必须有这层格子：公告里的按钮来自引擎的 `ui.create.buttonPresets.character /
 * vcard`，而它们的样式是**全局**的 `.button.character` / `.vcard`，会被当前布局或其它
 * UI 扩展覆盖（本机就有 十周年UI 的 `width:90px;height:120px;margin:6px`、
 * 千幻聆音的 `width:123px;height:174px;margin:20px 10px 32px 10px`）。
 * 那样按钮会撑破 grid 的 80px 轨道（卡片互相压叠），甚至脱离文档流不占高度，
 * 使所在 `.update-section` 只按标题算高度 ⇒ **两个按钮组 section 重叠**。
 * 现在排版只由格子决定，按钮被强行压成格子的 100% × 100%。
 */
.button-cell {
	position: relative;
	flex: none;
}

/* 兜底：万一个别按钮的内联样式被清掉，也保证有尺寸并参与文档流 */
.update-section :deep(.character),
.update-section :deep(.vcard) {
	position: relative;
	transition: all 0.3s ease;
	cursor: pointer;
}
.update-section :deep(.character) {
	width: 80px;
	height: 100px;
}
.update-section :deep(.vcard) {
	width: 100px;
	height: 140px;
}
.update-section :deep(.character):hover,
.update-section :deep(.vcard):hover {
	transform: scale(1.1);
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
	z-index: 10;
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
