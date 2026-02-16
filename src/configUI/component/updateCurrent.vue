<template>
	<div class="updateCurrent">
		<!-- 版本标题 -->
		<div class="UpdateCurrentTitle">驶舰之向 v{{ version }}更新内容</div>

		<div class = "UpdateCurrentOverVersion">最低适配版本: {{ over }}</div>

		<!-- 更新介绍 -->
		<div class="UpdateCurrentContent">
			<p v-for="(str, index) in updateData.intro" :key="`intro-${index}`" v-html="str"></p>
		</div>

		<!-- 新增角色展示 -->
		<div v-if="updateData.player && updateData.player.length > 0" class="UpdateCurrentOther">
			<div class="section-title">新增干员</div>
			<div ref="playerContainerRef" class="character-container"></div>
		</div>

		<!-- 新增卡片展示 -->
		<div v-if="updateData.cards && updateData.cards.length > 0" class="UpdateCurrentOther">
			<div class="section-title">新增卡牌</div>
			<div ref="cardContainerRef" class="card-container"></div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { lib, ui } from "noname";
import { whichWayVersion } from "../../version.js";
import { whichWayUpdateLog } from "../../updateLog/index.js";
import { whichWayCharacterCard } from "../../characterCard/index.ts";

const version = ref(whichWayVersion.ext);
const over = ref(whichWayVersion.noname.over);

const updateData = whichWayUpdateLog.currentLog;

const playerContainerRef = ref(null);
const cardContainerRef = ref(null);

const createdElements = ref([]);

const createCharacterButtons = () => {
	if (!playerContainerRef.value || !ui?.create?.buttonPresets?.character) return;

	//@ts-ignore
	playerContainerRef.value.innerHTML = "";

	// 创建角色按钮
	updateData.player.forEach(name => {
		try {
			const character = ui.create.buttonPresets.character(name, "player");

			// 添加双击事件
			character.addEventListener("dblclick", e => {
				e.stopPropagation();
				//@ts-ignore
				whichWayCharacterCard.create(name);
			});

			//@ts-ignore
			playerContainerRef.value.appendChild(character);
			//@ts-ignore
			createdElements.value.push(character);
		} catch (error) {
			console.error(`创建角色 ${name} 失败:`, error);
		}
	});
};

// 创建卡片按钮
const createCardButtons = () => {
	if (!cardContainerRef.value || !ui?.create?.buttonPresets?.vcard) return;

	//@ts-ignore
	cardContainerRef.value.innerHTML = "";

	// 创建卡片按钮
	updateData.cards.forEach(name => {
		try {
			const card = ui.create.buttonPresets.vcard(name, "card");

			//@ts-ignore
			cardContainerRef.value.appendChild(card);
			//@ts-ignore
			createdElements.value.push(card);
		} catch (error) {
			console.error(`创建卡片 ${name} 失败:`, error);
		}
	});
};

// 清理创建的元素
const cleanupElements = () => {
	createdElements.value.forEach(el => {
		//@ts-ignore
		if (el.parentNode) {
			//@ts-ignore
			el.parentNode.removeChild(el);
		}
	});
	createdElements.value = [];
};

// 组件挂载
onMounted(() => {
	// 创建角色和卡片
	createCharacterButtons();
	createCardButtons();
});

// 组件卸载时清理
onUnmounted(() => {
	cleanupElements();
});
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

.UpdateCurrentContent p {
	margin: 10px 0;
	line-height: 1.8;
	font-size: 14px;
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
