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
				<img class="backgroundPreview" :src="item.url" loading="lazy" decoding="async" fetchpriority="low" alt="" />
				<div class="backgroundText">{{ item.label }}</div>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * 目录扫描结果的模块级缓存，按模式存（`{ mode, list }`）：面板每次开/关都会重新挂载组件，而目录内容在一次
 * 游戏里不会变，所以只在第一次挂载时扫（`getFileTree` 走的是 fs server 的 readdir + stat，重复扫是白白的开销）。
 * 缓存带模式是因为设置里的「武将卡背景来源」可以改，改了以后必须重扫，不能把旧模式的列表端出去。
 */
let cached = null;
</script>

<script setup>
/**
 * 更换武将卡背景：
 * 背景图片来自三处 —— `dynamicSkin/background`（`dybg:`，精选）、`image/ui/background`（`ui:`）与
 * `image/background`（`bg:`），目录是**运行时扫描**出来的（`whichWayFile.getFileTree`），
 * 以后往这些目录加图就会自动出现在列表里。
 * 扫哪些目录由设置项「武将卡背景来源」决定：精选只扫 `dynamicSkin/background`（那里面是几十张图、合计几十 MB，
 * 全量扫描加上一屏缩略图的开销明显），全部才把三个目录都扫。
 * 选中值以 `<scheme>:<相对路径>` 形式存进 `extension_WhichWay_characterCardBackground`，由外壳组件应用。
 *
 * 缩略图用 `<img loading="lazy">` 而不是 CSS `background-image`：这些目录里是几兆到十几兆的大图，
 * 当背景图写上去浏览器会一次性全取，面板要卡在那里等解码；`img` 只有滚进视口才取，
 * 加上 `fetchpriority="low"` 让位给界面本身的交互。
 */
import { onMounted, ref } from "vue";
import { whichWayFile } from "../../file.js";
import { whichWayConfig } from "../../config/index.js";
import { getBackgroundSourceMode } from "../backgroundSource.ts";

const props = defineProps({
	/** 当前选中的背景值（`<scheme>:<相对路径>`） */
	value: { type: String, default: "" },
});
const emit = defineEmits(["select"]);

const items = ref([]);
const loading = ref(true);

/** 各模式要扫描的目录：`dir` 传给 getFileTree，`prefix` 用来拼选中值 */
const DYNAMIC_SOURCE = { dir: "dybg:", prefix: "dybg:" };
const SOURCES = {
	featured: [DYNAMIC_SOURCE],
	all: [DYNAMIC_SOURCE, { dir: "ui:background/", prefix: "ui:background/" }, { dir: "bg:", prefix: "bg:" }],
};

onMounted(async () => {
	const mode = getBackgroundSourceMode();
	if (cached?.mode === mode) {
		items.value = cached.list;
		loading.value = false;
		return;
	}
	try {
		// 背景显示名优先取扩展背景表（`image/background` 里的图在表里有中文名），查不到就用文件名
		const names = whichWayConfig.getBackgroundData?.() || {};
		const list = [];
		//按来源分组的顺序展示（精选在前），组内按文件名排；不再对整个列表做全局字典序
		for (const { dir, prefix } of SOURCES[mode]) {
			const tree = await whichWayFile.getFileTree(dir, 0);
			const files = (tree?.files || []).slice().sort((a, b) => a.name.localeCompare(b.name));
			for (const file of files) {
				const value = prefix + file.name;
				const key = file.name.replace(/\.[^.]+$/, "");
				list.push({ value, url: whichWayFile.compilePath(value), label: names[key] || key });
			}
		}
		cached = { mode, list };
		items.value = list;
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

/* 图没到位时先露出一块深色占位，而不是空白：占位写在 img 自己的底色上，
   不用透明度渐显——万一 load 事件没触发，界面就会永远是一张看不见的透明图。 */
.backgroundPreview {
	display: block;
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	object-position: center center;
	background-color: #242424;
	overflow: hidden;
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
