<template>
	<div class="author-background">
        <div class = "author-title">作者</div>
		<div v-for="(item, index) in authors" :key="index" class="author-container">
			<img :src="item[1]" class="author-icon" alt="" />
			<div class="author-name">{{ item[0] }}</div>
		</div>
        <div class = "github-container">
            <img :src="githubLogo" class="github-img" alt="" />
            <div class="github-text">访问本扩展仓库</div>
        </div>
	</div>
</template>

<script lang="ts" setup>
import { lib } from "noname";

const path = `${lib.assetURL}extension/WhichWay/image/decoration/`;

const authors = [
	["TheLeaderOne", `${path}1.jpg`],
	["圣晴天空", `${path}0.jpg`],
];

const githubLogo = `${path}github.png`
</script>

<style scoped>
.github-container {
    width: 100%;
    position: relative;
    display: flex;
    border-top: 1px solid #e0e0e0;
    cursor: pointer;
    user-select: none;
}

.github-img {
    position: relative;
    width: 25px;
    height: 25px;
    margin-top: 5px;
}

.github-text {
    position: relative;
    height: 25px;
    margin-left: 5px;
    width: fit-content;
    margin-top: 5px;
}

.author-title {
    padding: 5px;
    width: calc(100% - 10px);
    height: 20px;
    font-size: 20px;
    font-family: "lishu";
    position: relative;
    border-bottom: 1px solid #e0e0e0
}

.author-background {
	width: 80%;
	height: 100%;
	background-color: rgba(174, 196, 224, 0.5);
	border-radius: 10px;
	padding: 5px;
}

.author-container {
	width: 100%;
	height: 25px;
	display: flex;
	padding: 5px;
}
.author-icon {
	position: relative;
	cursor: pointer;
	border-radius: 50%;
	width: 25px;
	height: 25px;
	vertical-align: bottom;
}
.author-name {
	position: relative;
	width: 100px;
	height: 25px;
	font-size: 15px;
	display: flex;
	justify-content: left;
	align-items: center;
	left: 10px;
}
</style>
