<template>
	<div class="sort-container">
		<!-- 可自定义的大标题 -->
		<h3>{{ title }}</h3>
		
        <div class ="sort-intro" v-if="intro!== void 0">{{ intro }}</div>

		<div class="sort-list">
			<div 
				v-for="(item, index) in sortedItems" 
				:key="item.id" 
				:draggable="true" 
				@dragstart="handleDragStart($event, index)" 
				@dragover="handleDragOver($event)" 
				@drop="handleDrop($event, index)" 
				@dragend="handleDragEnd" 
				class="sort-item" 
				:class="{ dragging: draggingIndex === index }"
			>
				<span class="drag-handle">☰</span>
				<!-- 显示自定义的label -->
				<span class="item-content">{{ item.label }}</span>
				<span class="item-index">{{ index + 1 }}</span>
			</div>
		</div>

		<!-- 排序完成按钮 -->
		<div class="action-section">
			<button @click="resetSort" class="reset-btn">重置排序</button>
			<button @click="completeSort" class="complete-btn">✓ 排序完成</button>
		</div>

		<!-- 开发模式下的结果展示 -->
		<div class="result-section" v-if="devMode">
			<h4>排序结果：</h4>
			<div class="result-display">
				<code>{{ getSortedArray() }}</code>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { watch } from "vue";
import { whichWayUtil } from "../utill";

let devMode = ref(false);
devMode.value = whichWayUtil.isDeveloperMode();

// 定义props
const props = defineProps({
	// 可自定义的大标题
	title: {
		type: String,
		default: "拖拽排序选项",
	},

    //介绍
    intro:{
        type: String,
        default: void 0,
    },

	// 选项数组，支持两种格式：
	// 1. 字符串数组: ['a', 'b', 'c']
	// 2. 对象数组: [{ label: '显示名称', value: '实际值' }]
	items: {
		type: Array,
		default: () => [
			{ label: "选项A", value: "a" },
			{ label: "选项B", value: "b" },
			{ label: "选项C", value: "c" },
		],
	},
	// 是否显示完成按钮
	showCompleteBtn: {
		type: Boolean,
		default: true,
	},
});

// 定义emit
const emit = defineEmits(["sorted", "complete"]);

// 内部状态
const draggingIndex = ref(-1);
const dragOverIndex = ref(-1);

// 标准化选项数据
const normalizeItems = (items) => {
	return items.map((item, index) => {
		// 如果是字符串，转换为对象
		if (typeof item === "string") {
			return {
				id: `item-${index}`,
				label: item,
				value: item,
			};
		}
		// 如果是对象，确保有 label 和 value
		return {
			id: item.id || `item-${index}`,
			label: item.label || item.value || "",
			value: item.value || item.label || "",
		};
	});
};

const originalItems = ref(normalizeItems(props.items));
const sortedItems = ref([...originalItems.value]);

// 处理拖拽开始
const handleDragStart = (event, index) => {
	draggingIndex.value = index;
	event.dataTransfer.effectAllowed = "move";
	event.dataTransfer.setData("text/plain", index.toString());

	// 添加视觉反馈
	setTimeout(() => {
		event.target.classList.add("dragging");
	}, 0);
};

// 处理拖拽经过
const handleDragOver = (event) => {
	event.preventDefault();
	event.dataTransfer.dropEffect = "move";
};

// 处理拖拽放置
const handleDrop = (event, targetIndex) => {
	event.preventDefault();
	const sourceIndex = parseInt(event.dataTransfer.getData("text/plain"));

	if (sourceIndex !== targetIndex) {
		// 重新排序数组
		const newItems = [...sortedItems.value];
		const [movedItem] = newItems.splice(sourceIndex, 1);
		newItems.splice(targetIndex, 0, movedItem);
		sortedItems.value = newItems;

		// 更新dragOverIndex用于视觉反馈
		dragOverIndex.value = targetIndex;
	}
};

// 处理拖拽结束
const handleDragEnd = (event) => {
	draggingIndex.value = -1;
	dragOverIndex.value = -1;
	event.target.classList.remove("dragging");
};

// 获取排序后的值数组
const getSortedArray = () => {
	return sortedItems.value.map((item) => item.value);
};

// 获取排序后的完整对象数组
const getSortedItems = () => {
	return [...sortedItems.value];
};

// 重置排序
const resetSort = () => {
	sortedItems.value = [...originalItems.value];
	emit("sorted", getSortedArray());
};

// 排序完成
const completeSort = () => {
	const result = getSortedArray();
	const items = getSortedItems();
	
	// 触发 sorted 事件（向后兼容）
	emit("sorted", result);
	
	// 触发 complete 事件（包含完整信息）
	emit("complete", {
		values: result,
		items: items,
	});
};

// 监听外部items变化
watch(
	() => props.items,
	(newItems) => {
		originalItems.value = normalizeItems(newItems);
		sortedItems.value = [...originalItems.value];
	},
	{ deep: true }
);
</script>

<style scoped>
.sort-container {
	font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	padding: 20px;
	background: #2196f3;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
}

.sort-intro {
    font-size: 14px;
    color: #ff0c0c;
    margin-bottom: 10px;
    position: relative;
}

.sort-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin: 20px 0;
    position: relative;
}

.sort-item {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	background: white;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	cursor: grab;
	transition: all 0.3s ease;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    position: relative;
}

.sort-item:hover {
	border-color: #2196f3;
	box-shadow: 0 2px 6px rgba(33, 150, 243, 0.2);
}

.sort-item.dragging {
	opacity: 0.8;
	transform: scale(1.02);
	box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
	border-color: #2196f3;
	z-index: 10;
}

.drag-handle {
	font-size: 18px;
	color: #666;
	margin-right: 12px;
	cursor: grab;
}

.item-content {
	flex: 1;
	font-size: 16px;
	font-weight: 500;
	color: #333;
}

.item-index {
	background: #2196f3;
	color: white;
	padding: 4px 12px;
	border-radius: 16px;
	font-size: 14px;
	font-weight: 600;
}

.action-section {
	display: flex;
	justify-content: center;
	gap: 15px;
	margin-top: 25px;
	padding-top: 20px;
	border-top: 1px solid #e0e0e0;
    position: relative;
}

button {
	padding: 12px 24px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 15px;
	font-weight: 600;
	transition: all 0.2s ease;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reset-btn {
	background: #f44336;
	color: white;
}

.reset-btn:hover {
	background: #d32f2f;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
}

.complete-btn {
	background: #4caf50;
	color: white;
    position: relative;
}

.complete-btn:hover {
	background: #45a049;
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.result-section {
	background: white;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
    position: absolute;
    top: 0;
    left: calc(100% + 20px);
    width: 300px;
    height: 150px;
}

.result-display {
	margin: 15px 0;
	padding: 12px;
	background: #f5f5f5;
	border-radius: 6px;
	font-family: "Courier New", monospace;
	font-size: 14px;
	color: #2196f3;
}
</style>