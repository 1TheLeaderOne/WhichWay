<template>
  <div class="update-notice">
    <div class="notice-header">
      <h2>驶舰之向 v{{ version }} 更新公告</h2>
      <button @click="handleClose" class="close-btn">×</button>
    </div>
    
    <div class="notice-content">
      <!-- 最低适配版本提示 -->
      <div class="update-section">最低适配版本: {{ over }}</div>

      <!-- 更新简介 -->
      <section v-if="info.intro?.length" class="update-section">
        <h3>📝 更新概要</h3>
        <ul class="intro-list">
          <li v-for="(item, index) in info.intro" :key="index">{{ item }}</li>
        </ul>
      </section>

      <!-- 新增干员 -->
      <section v-if="info.player?.length" class="update-section">
        <h3>👥 新增干员</h3>
        <div ref="playerContainer" class="character-grid"></div>
      </section>

      <!-- 新增卡片 -->
      <section v-if="info.cards?.length" class="update-section">
        <h3>🃏 新增卡片</h3>
        <div ref="cardsContainer" class="card-grid"></div>
      </section>

      <!-- 空状态提示 -->
      <div v-if="!hasContent" class="empty-state">暂无更新内容</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { whichWayVersion } from '../version.js';

let version = whichWayVersion.ext;
let over = whichWayVersion.noname.over;

// Props
const props = defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({ intro: [], player: [], cards: [] })
  },
  onClose: {
    type: Function,
    default: () => {}
  }
});

// Emits
const emit = defineEmits(['close']);

// Refs
const playerContainer = ref(null);
const cardsContainer = ref(null);
const hasRendered = ref(false);

// Computed
const hasContent = computed(() => {
  return props.info.intro?.length || props.info.player?.length || props.info.cards?.length;
});

// Methods
const clearContainer = (containerRef) => {
  const container = containerRef.value;
  if (!container) return;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

const renderPlayers = () => {
  if (!playerContainer.value || !Array.isArray(props.info.player)) return;
  clearContainer(playerContainer);

  props.info.player.forEach(name => {
    try {
      if (typeof window?.ui?.create?.buttonPresets?.character !== 'function') {
        console.warn(`[UpdateNotice] character API not available for: ${name}`);
        return;
      }
      const btn = window.ui.create.buttonPresets.character(name);
      //@ts-ignore
      if (btn?.nodeType === 1) playerContainer.value.appendChild(btn);
    } catch (e) {
      console.error(`渲染干员按钮失败 (${name}):`, e);
    }
  });
};

const renderCards = () => {
  if (!cardsContainer.value || !Array.isArray(props.info.cards)) return;
  clearContainer(cardsContainer);

  props.info.cards.forEach(name => {
    try {
      if (typeof window?.ui?.create?.buttonPresets?.vcard !== 'function') {
        console.warn(`[UpdateNotice] vcard API not available for: ${name}`);
        return;
      }
      const btn = window.ui.create.buttonPresets.vcard(name);
      //@ts-ignore
      if (btn?.nodeType === 1) cardsContainer.value.appendChild(btn);
    } catch (e) {
      console.error(`渲染卡片按钮失败 (${name}):`, e);
    }
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
  nextTick(() => {
    renderPlayers();
    renderCards();
    hasRendered.value = true;
  });
});

onBeforeUnmount(() => {
  clearContainer(playerContainer);
  clearContainer(cardsContainer);
});

// Watchers
watch(
  () => props.info.player,
  () => {
    renderPlayers();
  },
  { deep: true }
);

watch(
  () => props.info.cards,
  () => {
    renderCards();
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
.intro-list {
	padding-left: 20px;
	line-height: 1.6;
}
.intro-list li {
	margin-bottom: 8px;
	position: relative;
}
.intro-list li::before {
	content: "•";
	color: #ff9a9e;
	font-weight: bold;
	position: absolute;
	left: -15px;
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
