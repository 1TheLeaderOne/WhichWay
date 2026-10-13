<template>
	<div class="char-picker">
		<!-- 搜索框 -->
		<div class="search-box">
			<div class="image-box">
				<img v-if="watchImageUrl" :src="watchImageUrl" alt="搜索图标" />
			</div>
			<input v-model="searchQuery" type="text" class="search-input" :placeholder="placeholder" />
		</div>

		<!-- 干员列表 -->
		<div class="char-grid">
			<div v-for="name in filtered" :key="name" class="char-item" :class="{ 'char-item-active': name === modelValue }" @click="pick(name)">
				{{ displayName(name) }}
			</div>
			<div v-if="!filtered.length" class="empty-tip">{{ emptyText }}</div>
		</div>
	</div>
</template>

<script setup>
/**
 * 干员搜索选择器：配音设置 / 模组切换两个面板共用。
 *
 * 搜索按「中文 + 英文(罗马拼音) + 技能」匹配：把干员中文名、干员 id(拼音串)、
 * 中文名的拼音、以及其技能的中文名与技能 id 汇成一个待匹配串，命中任一即可。
 * 选中项通过 `v-model`(modelValue/update:modelValue) 双向绑定，本身只负责「选谁」，
 * 选中之后展示什么由调用方决定。
 */
import { ref, computed } from "vue";
import * as pinyinPro from "pinyin-pro";
import { get } from "noname";
import { whichWayFile } from "../../file.js";

const props = defineProps({
	/** 候选干员 id 列表 */
	names: { type: Array, default: () => [] },
	/** 当前选中的干员 id（v-model） */
	modelValue: { type: String, default: "" },
	placeholder: { type: String, default: "支持中文、拼音和技能搜索~" },
	emptyText: { type: String, default: "没有匹配的干员" },
});
const emit = defineEmits(["update:modelValue"]);

const searchQuery = ref("");
const watchImageUrl = whichWayFile.compilePath("ui:watch.png");

const displayName = name => {
	const text = get.translation(name) || name;
	//干员名可能带 <font> 等标签，这里只用于纯文本展示，去掉标签
	return String(text).replace(/<[^>]+>/g, "");
};

/** 每个干员的搜索串：中文名 + 干员id + 中文名拼音 + 各技能(中文名/技能id) */
const searchMap = computed(() => {
	const map = new Map();
	for (const name of props.names) {
		const cn = displayName(name);
		const parts = [cn, name];

		try {
			if (typeof pinyinPro !== "undefined") {
				const py = pinyinPro
					.pinyin(cn, {
						type: "array",
						toneType: "none",
					})
					.join(" ")
					.toLowerCase();
				parts.push(py, py.replace(/\s/g, ""));
			}
		} catch (e) {
			console.warn("[charPicker] 拼音转换失败:", e);
		}

		for (const skill of get.character(name)?.skills || []) {
			parts.push(skill);
			parts.push(String(get.translation(skill) || "").replace(/<[^>]+>/g, ""));
		}

		map.set(name, parts.join(" ").toLowerCase());
	}
	return map;
});

const filtered = computed(() => {
	const query = searchQuery.value.trim().toLowerCase();
	if (!query) return props.names;
	const compact = query.replace(/\s/g, "");
	const list = [];
	for (const name of props.names) {
		const hay = searchMap.value.get(name) || "";
		if (hay.includes(query) || hay.replace(/\s/g, "").includes(compact)) list.push(name);
	}
	return list;
});

function pick(name) {
	emit("update:modelValue", name);
}
</script>

<style scoped>
.char-picker {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

/* 搜索框 */
.search-box {
	position: relative;
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
	padding: 12px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.3);
	width: calc(100% - 24px);
	box-sizing: border-box;
	flex: none;
}

.image-box {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	flex: none;
}

.image-box img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.search-input {
	position: relative;
	flex: 1;
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 14px;
	outline: none;
	background: rgba(255, 255, 255, 0.9);
	transition: border-color 0.3s;
	box-sizing: border-box;
}

.search-input:focus {
	border-color: #409eff;
}

/* 干员列表 */
.char-grid {
	position: relative;
	flex: 1;
	overflow: auto;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	gap: 8px;
	padding: 4px;
	width: 100%;
	box-sizing: border-box;
}

.char-item {
	position: relative;
	padding: 6px 12px;
	font-size: 15px;
	color: #f5f5f5;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid #888;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s;
	user-select: none;
}

.char-item:hover {
	background: rgba(64, 158, 255, 0.3);
}

.char-item-active {
	background: #0097da !important;
	border-color: #1ac2fd;
	box-shadow: 0 0 5px rgba(26, 194, 253, 0.6);
}

.empty-tip {
	position: relative;
	width: 100%;
	text-align: center;
	color: #ccc;
	font-size: 15px;
	padding: 20px;
}

.char-grid::-webkit-scrollbar {
	width: 8px;
}

.char-grid::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.4);
	border-radius: 4px;
}
</style>
