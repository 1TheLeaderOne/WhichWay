<template>
	<div class="control-container">
		<div class="title">{{ prompt }}</div>
		<div class="item-container">
			<div v-for="(item, index) in list" :key="index" class="control-item" @click="handleClick(item)">
				<img :src="item[2]" class="item-bg" alt="" />
				<span class="item-text">{{ get.translation(item[0]) }} - {{ item[1] }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { dataManager } from "../../../dataManager";
import { get } from "noname";
import { whichWayFile } from "../../../file";

const list = ref<[string, string, string][]>([]);
const prompt = ref<string>("");

onMounted(() => {
	const pending = (dataManager.get("list") as [string, string][]).map(i => [
		i[0],
		i[1],
		whichWayFile.compilePath(`img:skill/qushimrfz/${i[0].replace("wangmrfz_", "")}.png`),
	]);

	list.value = pending as [string, string, string][];
	prompt.value = dataManager.get("prompt") as string;
});

const handleClick = (item: [string, string, string]) => {
	const key = item[0];

	console.log("点击了:", key);

	dataManager.set("selected", key);

	return key;
};
</script>

<style lang="css" scoped>
.control-container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 60%;
	height: 40%;
	background-color: rgba(126, 122, 122, 0.5);
}

.title {
	font-size: 20px;
	width: 100%;
	height: 25px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.item-container {
	width: 100%;
	height: calc(100% - 30px);
	margin-top: 5px;
	position: relative;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 10px;
	padding: 15px;
	box-sizing: border-box;
	overflow-y: auto;
}

.control-item {
	background-color: rgba(255, 255, 255, 0.8);
	padding: 10px;
	border-radius: 5px;
	max-height: 35px;
}

.control-item {
	position: relative;
	overflow: hidden;
}

.item-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: 0;
}

.item-text {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
    font-weight: bolder;
	color: #fcfcfc;
	position: relative;
	text-overflow: ellipsis;
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
	.control-container {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 480px) {
	.control-container {
		grid-template-columns: repeat(1, 1fr);
	}
}
</style>
