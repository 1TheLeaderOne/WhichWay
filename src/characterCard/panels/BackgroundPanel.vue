<template>
	<div class="backgroundPanel">
		<div class="backgroundHint">点击选择武将卡背景</div>
		<div v-if="loading" class="backgroundLoading">正在读取背景列表…</div>
		<div v-else-if="!items.length" class="backgroundLoading">没有找到可用的背景图片</div>
		<div class="backgroundList">
			<div
				v-for="item in items"
				:key="item.value"
				class="backgroundItem"
				:class="{ backgroundSelected: item.value === value }"
				@click="emit('select', item.value)"
			>
				<div class="backgroundPreview" :style="{ backgroundImage: `url(${item.url})` }"></div>
				<div class="backgroundText">{{ item.label }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * 更换武将卡背景（新增）：
 * 背景图片来自两个路径 —— `image/ui/background`（`ui:` scheme）与 `image/background`（`bg:` scheme），
 * 目录是**运行时扫描**出来的（`whichWayFile.getFileTree`），以后往这两个目录加图就会自动出现在列表里。
 * 选中值以 `<scheme>:<相对路径>` 形式存进 `extension_WhichWay_characterCardBackground`，由外壳组件应用。
 */
import { onMounted, ref } from "vue";
import { whichWayFile } from "../../file.js";
import { whichWayConfig } from "../../config/index.js";

const props = defineProps({
	/** 当前选中的背景值（`<scheme>:<相对路径>`） */
	value: { type: String, default: "" },
});
const emit = defineEmits(["select"]);

const items = ref([]);
const loading = ref(true);

/** 两个来源目录与其 scheme/扩展名 */
const SOURCES = [
	{ scheme: "ui", dir: "ui:background/", prefix: "ui:background/" },
	{ scheme: "bg", dir: "bg:", prefix: "bg:" },
];

onMounted(async () => {
	try {
		// 背景显示名优先取扩展背景表（`image/background` 里的图在表里有中文名）
		const names = whichWayConfig.getBackgroundData?.() || {};
		const list = [];
		for (const { dir, prefix } of SOURCES) {
			const tree = await whichWayFile.getFileTree(dir, 0);
			for (const file of tree?.files || []) {
				const value = prefix + file.name;
				const key = file.name.replace(/\.[^.]+$/, "");
				list.push({ value, url: whichWayFile.compilePath(value), label: names[key] || key });
			}
		}
		items.value = list.sort((a, b) => a.value.localeCompare(b.value));
	} catch (error) {
		console.warn("[WhichWay] 读取武将卡背景列表失败：", error);
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
.backgroundPanel {
	position: relative;
	width: 90%;
	margin-right: 5px;
}

.backgroundHint {
	position: relative;
	width: 100%;
	height: 40px;
	background-color: rgb(0, 0, 0);
	font-family: SJZX_hanyi;
	font-size: 25px;
	color: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
}

.backgroundLoading {
	position: relative;
	width: 100%;
	padding: 10px 0;
	font-size: 20px;
	font-family: SJZX_youyuan;
}

.backgroundList {
	position: relative;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	margin-top: 5px;
}

.backgroundItem {
	position: relative;
	width: 46%;
	margin: 0 2% 5px 0;
	background-color: rgba(143, 143, 143, 0.5);
	box-shadow: 0 0 5px #313131;
	cursor: pointer;
	box-sizing: border-box;
}

.backgroundItem.backgroundSelected {
	background-color: rgb(0 133 255) !important;
	border: 2px solid rgb(255 203 0) !important;
}

.backgroundPreview {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
}

.backgroundText {
	position: relative;
	width: 100%;
	height: 26px;
	line-height: 26px;
	text-align: center;
	font-family: SJZX_youyuan;
	font-size: 18px;
	color: #f5f5f5;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
