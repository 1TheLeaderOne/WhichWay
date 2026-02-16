<template>
	<div class="conf-override">
		<div class="config-container">
			<div class="title-container">
				<img :src="IMG_SKIN" />
				<div class="title">皮肤配置冲突</div>
			</div>
			<div class="confilct-card-container">
				<div v-for="(items, cardTitle) in confictedSkin" :key="cardTitle" class="confilct-card">
					<div class="card-title">{{ translate(cardTitle) }}</div>
					<div class="card-content" v-horizontal-scroll>
						<div 
							v-for="(item, index) in items" 
							:key="`${cardTitle}-${index}`" 
							class="item-content"
							:class="{ 'selected': isSelected(cardTitle, item.skin) }"
							@click="selectSkin(cardTitle, item.skin)"
						>
							<div class="skin-container">
								<img :src="whichWaySkin.getCharacterSkin(cardTitle, item.skin)?.path">
							</div>
							<div class="intro-container">
								<span class="skin-item">{{ whichWayFile.removeExt(item.skin) }}</span>
								<span class="from-item">{{ translate(item.from) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="quick-container">
			<button class="apply-btn" @click="applySelections">应用选择</button>
			<button class="reset-btn" @click="resetSelections">重置</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { whichWaySkin } from "./index.ts";
import { ref, reactive } from 'vue';

const IMG_SKIN = whichWayFile.compilePath("ui:skin.png");
const confictedSkin = whichWaySkin.confictedSkins.data;

const selectedSkins = reactive<Record<string, string>>({});

function initSelections() {
	Object.keys(confictedSkin).forEach(cardTitle => {
		if (confictedSkin[cardTitle].length > 0) {
			selectedSkins[cardTitle] = whichWaySkin.confictedSkins.selected[cardTitle] || confictedSkin[cardTitle][0].skin;
		}
	});
}

function isSelected(cardTitle: string, skin: string): boolean {
	return selectedSkins[cardTitle] === skin;
}

function selectSkin(cardTitle: string, skin: string) {
	selectedSkins[cardTitle] = skin;
	console.log(`已选择 ${cardTitle} 的皮肤: ${skin}`);
}

function applySelections() {
	whichWaySkin.confictedSkins.selected = selectedSkins;
	const overlay = document.querySelector(".conflictedSkinOverlay-whichWaySkin.whichWayOverlay");
	overlay && overlay.remove();
	if(whichWaySkin.pendingReslove["showConflictedSkin"]){
		whichWaySkin.pendingReslove["showConflictedSkin"](true);
		whichWaySkin.pendingReslove["showConflictedSkin"] = null;
	}
}

function resetSelections() {
	initSelections();
}

initSelections();

const fromTranslate = {
	noname: "无名杀",
	whichWay: "驶舰之向",
	qhly: "千幻聆音",
};

function translate(name: string) {
	if (fromTranslate[name]) return fromTranslate[name];
	if (lib.translate[name]) return lib.translate[name];
	return name;
}

// 横向滚动指令
const vHorizontalScroll = {
	mounted(el: HTMLElement) {
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			el.scrollLeft += e.deltaY;
		};
		
		el.addEventListener('wheel', handleWheel as EventListener, { passive: false });
		(el as any)._handleWheel = handleWheel;
	},
	unmounted(el: HTMLElement) {
		const handler = (el as any)._handleWheel;
		if (handler) {
			el.removeEventListener('wheel', handler);
			(el as any)._handleWheel = null;
		}
	}
};
</script>

<style scoped>
.conf-override {
	width: 80%;
	height: 90%;
	position: absolute;
}

.config-container {
	position: relative;
	width: 90%;
	height: 100%;
	background: rgba(23, 129, 181, 0.8);
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.config-container .title-container {
	position: relative;
	width: calc(100% - 30px);
	padding: 15px;
	height: 30px;
	display: flex;
	align-items: center;
}

.config-container .title-container::before {
	content: "";
	border-bottom: 1px solid #4b5563;
	width: 80%;
	height: calc(100% - 15px);
	z-index: 114514;
	position: absolute;
}

.config-container .title {
	font-size: 20px;
	font-weight: bold;
	position: relative;
	margin-left: 10px;
	color: #f1f5f9;
}

.config-container .title-container img {
	width: 20px;
	height: 20px;
}

.confilct-card-container {
	position: relative;
	width: calc(100% - 20px);
	height: calc(100% - 80px);
	overflow: auto;
	padding: 10px;
}

.confilct-card {
	position: relative;
	width: 22%;
	height: 250px;
	padding: 1%;
	margin: 1%;
	background: #66a9c9;
	border-radius: 12px;
}

.confilct-card .card-title {
	width: calc(100% - 10px);
	height: 30px;
	font-size: 20px;
	font-weight: bold;
	text-align: center;
	padding: 5px;
	position: relative;
	color: #f8fafc;
}

.confilct-card .card-content {
	width: calc(100% - 10px);
	height: calc(100% - 40px);
	padding: 5px;
	overflow-x: auto;
	overflow-y: hidden;
	position: relative;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap:10px;
}

.confilct-card .card-content .item-content {
	height: calc(100% - 20px);
	width: 100px;
	padding: 5px;
	position: relative;
	background: rgba(30, 41, 59, 0.7);
	border-radius: 5px;
	margin: 2px;
	flex-shrink: 0;
	cursor: pointer;
	transition: all 0.3s ease;
}

/* 选中状态高亮 */
.confilct-card .card-content .item-content.selected {
	background: linear-gradient(145deg, #1e3a8a, #3b82f6);
	border: 2px solid #60a5fa;
	box-shadow: 0 0 15px rgba(96, 165, 250, 0.5);
	transform: scale(1.05);
}

.confilct-card .card-content .item-content:hover {
	background: rgba(56, 178, 172, 0.5);
	transform: scale(1.02);
}

.confilct-card .card-content .item-content .skin-container {
	width: 100%;
	height: 60%;
	position: relative;
}

.confilct-card .card-content .item-content .skin-container img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.confilct-card .card-content .item-content .intro-container {
	width: 100%;
	height: 40%;
	position: relative;
	border-top: 1px solid #64748b;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.from-item,
.skin-item {
	width: 100%;
	padding: 5px;
	position: relative;
	text-align: center;
	background: rgba(56, 178, 172, 0.3);
	border-radius: 5px;
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 选中标记 */
.selected::after {
	content: "✓";
	position: absolute;
	top: 5px;
	right: 5px;
	width: 20px;
	height: 20px;
	background: #10b981;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-weight: bold;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.quick-container {
	position: absolute;
	top:0;
	right: 0;
	width: calc(10% - 10px);
	height: 100%;
	margin-left: 10px;
	background: linear-gradient(145deg, #0ea5e9, #38bdf8);
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	gap:10px;
	display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
}

.apply-btn,
.reset-btn {
	width: 80%;
	padding: 12px;
	border: none;
	border-radius: 8px;
	font-size: 12px;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	position: relative;
	margin-top: 10px;
}

.apply-btn {
	background: linear-gradient(145deg, #10b981, #34d399);
	color: white;
}

.apply-btn:hover {
	background: linear-gradient(145deg, #059669, #10b981);
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.apply-btn:active {
	transform: translateY(0);
}

.reset-btn {
	background: linear-gradient(145deg, #ef4444, #f87171);
	color: white;
}

.reset-btn:hover {
	background: linear-gradient(145deg, #dc2626, #ef4444);
	transform: translateY(-2px);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.reset-btn:active {
	transform: translateY(0);
}
</style>