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
			<template v-for="name in filtered" :key="name">
				<!-- `item` 插槽：调用方要自己决定条目长什么样时用（如「皮肤位置调整」要把每条做成含皮肤清单的武将卡）。
				     插槽里只提供「选谁 / 是否选中 / 怎么选中」，搜索与过滤逻辑仍然只在这里。 -->
				<slot v-if="$slots.item" name="item" :char="name" :active="name === modelValue" :pick="pick" />
				<div v-else class="char-item" :class="{ 'char-item-active': name === modelValue }" @click="pick(name)">
					{{ displayName(name) }}
				</div>
			</template>
			<div v-if="!filtered.length" class="empty-tip">{{ emptyText }}</div>
		</div>
	</div>
</template>

<script setup>
/**
 * 干员搜索选择器：配音设置 / 模组切换 / 皮肤位置调整等面板共用。
 *
 * 搜索按「中文 + 英文(罗马拼音) + id + 技能」匹配，规则在 `../charSearch.js` 里（那里还导出了
 * 独立的索引与过滤函数，面板不想用这套列表 UI 时可以直接调它）。
 * 选中项通过 `v-model`(modelValue/update:modelValue) 双向绑定，本身只负责「选谁」，
 * 选中之后展示什么由调用方决定；过滤后的名单同时以 `filtered` 事件透出，
 * 供「轮切下一个干员」这类需要知道当前搜索结果的功能使用。
 * 默认的条目只是一枚文字标签；要换成别的形态（如带皮肤清单的武将卡）用 `#item` 具名插槽，
 * 插槽作用域给 `char`（干员id）、`active`（是否当前选中）、`pick`（点击选中的处理函数）。
 * 作用域里的干员id 之所以叫 `char` 不叫 `name`：`name` 要和插槽自己的 `name="item"` 撞属性名（`vue/no-duplicate-attributes`）。
 */
import { ref, computed, watch } from "vue";
import { whichWayFile } from "../../file.js";
import { charDisplayName, createCharSearchIndex, filterCharsByQuery } from "../charSearch.js";

const props = defineProps({
	/** 候选干员 id 列表 */
	names: { type: Array, default: () => [] },
	/** 当前选中的干员 id（v-model） */
	modelValue: { type: String, default: "" },
	placeholder: { type: String, default: "支持中文、拼音和技能搜索~" },
	emptyText: { type: String, default: "没有匹配的干员" },
});
const emit = defineEmits(["update:modelValue", "filtered"]);

const searchQuery = ref("");
const watchImageUrl = whichWayFile.compilePath("ui:watch.png");

const displayName = name => charDisplayName(name);

/** 每个干员的搜索串：中文名 + 干员id + 中文名拼音 + 各技能(中文名/技能id) */
const searchMap = computed(() => createCharSearchIndex(props.names));

const filtered = computed(() => filterCharsByQuery(props.names, searchQuery.value, searchMap.value));

watch(
	filtered,
	list => emit("filtered", list),
	{ immediate: true }
);

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
	container-type: inline-size;
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
