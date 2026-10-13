<template>
	<div class="background-setting-wrapper">
		<!-- 搜索框 -->
		<div class="search-box">
			<div class="image-box">
				<img v-if="watchImageUrl" :src="watchImageUrl" alt="搜索图标" />
			</div>
			<input v-model="searchQuery" type="text" class="search-input" placeholder="支持中文和拼音搜索~" />
		</div>

		<!-- 滚动区域 -->
		<div ref="scrollContainer" class="scroll-container">
			<!-- 扩展背景 -->
			<div class="bg-section">
				<div class="bg-title">
					驶舰之向扩展背景
					<span class="hidden-button" @click="toggleExtHidden">
						[<span class="highlight">{{ extHidden ? "展示" : "隐藏" }}</span
						>]
					</span>
				</div>
				<div class="bg-container" :class="{ 'hidden-sjzx': extHidden }">
					<div v-for="(name, key) in filteredExtBG" :key="`ext-${key}`" class="bg-box" :class="{ 'current-bg': isCurrent(key, 'ext') }" @click="selectBackground(key, 'ext')">
						<div class="img-box">
							<img :src="getExtImageUrl(key)" :alt="name" />
						</div>
						<div class="title">
							{{ name }}
							<span v-if="isCurrent(key, 'ext')" class="current-tag">(当前背景)</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 原版背景 -->
			<div class="bg-section">
				<div class="bg-title">
					无名杀自带背景
					<span class="hidden-button" @click="toggleOriginalHidden">
						[<span class="highlight">{{ originalHidden ? "展示" : "隐藏" }}</span
						>]
					</span>
				</div>
				<div class="bg-container" :class="{ 'hidden-sjzx': originalHidden }">
					<div v-for="(name, key) in filteredOriginalBG" :key="`original-${key}`" class="bg-box" :class="{ 'current-bg': isCurrent(key, 'original') }" @click="selectBackground(key, 'original')">
						<div class="img-box">
							<img :src="getOriginalImageUrl(key)" :alt="name" />
						</div>
						<div class="title">
							{{ name }}
							<span v-if="isCurrent(key, 'original')" class="current-tag">(当前背景)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import * as pinyinPro from "pinyin-pro";
import { lib, ui, game } from "noname";
import { whichWayConfig } from "../../config/index.js";
import { whichWayFile } from "../../file.js";
import { whichWayUtil } from "../../utill.js";

// Props 和 Emits
const emit = defineEmits(["loaded"]);

// Refs
const scrollContainer = ref(null);
const searchQuery = ref("");
const watchImageUrl = ref("");

// 显示/隐藏状态
const extHidden = ref(false);
const originalHidden = ref(false);

// 背景数据
const backgroundData = reactive({
	original: {},
	ext: {},
});

// URL
const extUrl = ref("");
const originalUrl = ref(`${lib.assetURL}image/background/`);

// 当前背景
const currentBackgroundKey = ref("");
const currentBackgroundType = ref("");

// 初始化数据
onMounted(async () => {
	try {
		// 获取背景数据
		backgroundData.original = lib.configMenu.appearence.config.image_background.item || {};
		const extResult = whichWayConfig.getBackgroundData();
		backgroundData.ext = extResult || {};

		const extConfig = whichWayConfig.getBackgroundData(null, true);
		extUrl.value = extConfig?.url || "";

		// 获取当前背景
		const currentBg = lib.config.ChangeBgI_mrfz || lib.config.image_background;
		currentBackgroundKey.value = currentBg;

		// 判断当前背景类型
		if (Object.keys(backgroundData.ext).includes(currentBg)) {
			currentBackgroundType.value = "ext";
		} else if (Object.keys(backgroundData.original).includes(currentBg)) {
			currentBackgroundType.value = "original";
		}

		// 获取 watch 图标 URL
		watchImageUrl.value = whichWayFile.compilePath("ui:watch.png");

		// 添加返回顶部按钮
		if (scrollContainer.value) {
			//   await configUI.addBackToTopButton({ container: scrollContainer.value });

			// 触发加载完成事件
			emit("loaded");
		}
	} catch (error) {
		console.error("[BackgroundSetting] 初始化失败:", error);
	}
});

// 搜索过滤
const filteredExtBG = computed(() => {
	return filterBackgrounds(backgroundData.ext);
});

const filteredOriginalBG = computed(() => {
	return filterBackgrounds(backgroundData.original);
});

// 过滤函数
function filterBackgrounds(bgData) {
	const query = searchQuery.value.trim().toLowerCase();
	if (!query) return bgData;

	const result = {};

	for (const [key, name] of Object.entries(bgData)) {
		// 中文匹配
		const isMatch = name.toLowerCase().includes(query);

		if (isMatch) {
			result[key] = name;
			continue;
		}

		// 拼音匹配
		try {
			if (typeof pinyinPro !== "undefined") {
				const pinyin = pinyinPro
					.pinyin(name, {
						type: "array",
						toneType: "none",
					})
					.join(" ")
					.toLowerCase();

				if (pinyin.includes(query)) {
					result[key] = name;
				}
			}
		} catch (e) {
			console.warn("拼音转换失败:", e);
			// 如果拼音转换失败，仍然返回所有数据
			return bgData;
		}
	}

	return result;
}

// 工具方法
function getExtImageUrl(key) {
	return `${extUrl.value}${key}.jpg`;
}

function getOriginalImageUrl(key) {
	return `${originalUrl.value}${key}.jpg`;
}

function isCurrent(key, type) {
	return currentBackgroundKey.value === key && currentBackgroundType.value === type;
}

// 选择背景
function selectBackground(key, type) {
	// 如果已经是当前背景，不做操作
	if (isCurrent(key, type)) {
		return;
	}

	// 更新当前背景
	currentBackgroundKey.value = key;
	currentBackgroundType.value = type;

	// 保存配置
	if (type === "ext") {
		game.saveConfig("ChangeBgI_mrfz", key);
		whichWayUtil.setBgI();
	} else {
		game.saveConfig("ChangeBgI_mrfz", undefined);
		whichWayUtil.setBgI();
		lib.configMenu.appearence.config.image_background.onclick(key);
	}
}

// 切换显示/隐藏
function toggleExtHidden() {
	extHidden.value = !extHidden.value;
}

function toggleOriginalHidden() {
	originalHidden.value = !originalHidden.value;
}

// 清理
onUnmounted(() => {
	// 组件卸载时的清理工作
});
</script>

<style scoped>
.background-setting-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.scroll-container {
	flex: 1;
	overflow: auto;
	padding: 20px;
	width: calc(100% - 40px);
	height: calc(100% - 44px);
	position: relative;
}

/* 搜索框 */
.search-box {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 24px;
	padding: 12px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.3);
	width: calc(100% - 24px);
	height: 20px;
	position: relative;
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
    width: calc(100% - 8px - 32px);
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 14px;
	outline: none;
	background: rgba(255, 255, 255, 0.9);
	transition: border-color 0.3s;
}

.search-input:focus {
	border-color: #409eff;
}

/* 背景区域 */
.bg-section {
	margin-bottom: 30px;
	position: relative;
	width: 100%;
}

.bg-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 12px;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 4px;
	width: calc(100% - 16px);
	position: relative;
}

.hidden-button {
	font-size: 14px;
	color: #ccc;
	cursor: pointer;
	user-select: none;
}

.hidden-button .highlight {
	color: #409eff;
	font-weight: bold;
}

.bg-container {
	display: flex;
	gap: 16px;
	transition: opacity 0.3s;
	padding: 4px;
	width: calc(100% - 8px);
	position: relative;
	flex-wrap: wrap;
	justify-content: center;
}

.bg-container.hidden-sjzx {
	display: none !important;
	pointer-events: none;
}

/* 背景框 */
.bg-box {
	border: 2px solid transparent;
	border-radius: 10px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.3s;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	background: rgba(0, 0, 0, 0.2);
	position: relative;
	width: 20%;
}

.bg-box:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.bg-box.current-bg {
	border-color: #409eff;
	box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.5);
	background: rgba(64, 158, 255, 0.1);
}

.img-box {
	width: 100%;
	aspect-ratio: 16 / 9;
	overflow: hidden;
	position: relative;
}

.img-box img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s;
}

.bg-box:hover .img-box img {
	transform: scale(1.05);
}

.title {
	padding: 8px;
	font-size: 14px;
	text-align: center;
	background: rgba(0, 0, 0, 0.6);
	color: #fff;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
    position: relative;
    width: calc(100% - 16px);
    border-radius: 10px;
}

.current-tag {
	color: #409eff;
	font-weight: bold;
	margin-left: 4px;
}

/* 滚动条美化 */
.scroll-container::-webkit-scrollbar {
	width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.4);
	border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.6);
}
</style>
