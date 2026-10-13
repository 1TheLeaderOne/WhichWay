<template>
	<div class="module-setting">
		<div class="picker-col">
			<charPicker v-model="selected" :names="names" empty-text="没有配置模组的干员" />
		</div>

		<div class="detail-col">
			<div v-if="!selected" class="hint">请先在左侧选择一名干员</div>
			<!-- 复用武将卡的模组面板：切换逻辑（setCharModules + 重算 + 重启提示）与 CharacterCard 完全一致。
			     :key 绑定所选干员，换人时整体重建，避免残留上一名的选择状态 -->
			<template v-else>
				<div class="detail-title">{{ displayName }} · 模组</div>
				<ModulePanel :key="selected" :name="selected" />
			</template>
		</div>
	</div>
</template>

<script setup>
/**
 * 功能二：模组切换。
 *
 * 单独调整「存在模组的驶舰之向干员」所装备的模组。左侧干员可用中文/拼音/技能搜索，
 * 候选取自 `whichWayCharacterModules.modules` 里真正配置了模组的干员；右侧直接复用
 * 武将卡的 `ModulePanel.vue`，切换方式与 CharacterCard 中的模组面板保持一致。
 */
import { ref, computed, onMounted } from "vue";
import { get } from "noname";
import { whichWayCharacterModules } from "../../modules/index.js";
import ModulePanel from "../../characterCard/panels/ModulePanel.vue";
import charPicker from "./charPicker.vue";

const emit = defineEmits(["loaded"]);

const selected = ref("");

/** 候选：配置了模组的驶舰之向干员 */
const names = computed(() => Object.keys(whichWayCharacterModules.modules || {}));

const displayName = computed(() => {
	const text = get.translation(selected.value) || selected.value;
	return String(text).replace(/<[^>]+>/g, "");
});

onMounted(() => emit("loaded"));
</script>

<style scoped>
.module-setting {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	gap: 12px;
	padding: 12px;
	box-sizing: border-box;
}

.picker-col {
	position: relative;
	width: 45%;
	height: 100%;
	min-width: 0;
}

.detail-col {
	position: relative;
	width: 55%;
	height: 100%;
	overflow: auto;
	min-width: 0;
	padding: 8px;
	box-sizing: border-box;
	color: #f5f5f5;
}

.detail-title {
	position: relative;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 12px;
	padding-bottom: 8px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.hint {
	position: relative;
	color: #ccc;
	font-size: 15px;
	padding: 20px;
	text-align: center;
}
</style>
