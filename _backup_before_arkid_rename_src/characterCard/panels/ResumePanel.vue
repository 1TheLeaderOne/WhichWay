<template>
	<div class="charInfoWrapper">
		<div class="charTitle">干员档案</div>
		<div class="charInfo" v-html="intro"></div>
		<!-- TODO: 光荣之路（成就系统待实现；原实现引用的 whitherHelm.getAch 与 lib.config.AchList_mrfz 均已废弃，故删除） -->
	</div>
</template>

<script setup>
/** 简介面板（原 `click.ts` 的 showResumeChar），只展示武将介绍 */
import { computed } from "vue";
import { get } from "noname";

const props = defineProps({ name: { type: String, required: true } });

const intro = computed(() => get.characterIntro(props.name) || "");
</script>

<style scoped>
.charInfoWrapper {
	position: relative;
	width: 90%;
	background-color: rgba(143, 143, 143, 0.5);
	overflow: hidden;
	box-shadow: 0 0 5px #313131;
	margin-bottom: 5px;
	margin-right: 5px;
	cursor: pointer;
}

.charInfoWrapper > .charTitle {
	position: relative;
	width: 100%;
	height: 40px;
	background-color: rgb(0, 0, 0);
	overflow: hidden;
	cursor: pointer;
	font-family: SJZX_hanyi;
	font-size: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.charInfoWrapper > .charInfo {
	position: relative;
	width: 100%;
	height: 90%;
	overflow: hidden;
	cursor: pointer;
	margin-top: 10px;
	font-size: 20px;
	font-family: SJZX_youyuan;
	margin-left: 5px;
	margin-bottom: 5px;
}
</style>
