<template>
	<div class="whichWay-intro">
		<!-- 主图 -->
		<img :src="getImageUrl('SJZX.jpg')" alt="扩展封面" class="main-image" />

		<!-- 扩展介绍 -->
		<div class="section-title">
			<span class="title-arrow">←←</span>
			<span class="title-text">扩展介绍</span>
			<span class="title-arrow">→→</span>
		</div>
		<p>本扩展主要由<span class="highlight">林登万</span>制作，武将技能设计主要由<span class="highlight">林登万</span>和<span class="highlight">圣晴天空</span>提供。</p>

    <!-- 特别感谢 -->
     <div class="section-title">
			<span class="title-arrow">←←</span>
			<span class="title-text">感谢名单</span>
			<span class="title-arrow">→→</span>
		</div>
    <p>感谢以下干员设计者对本扩展的支持：</p>
    <ul class="voice-list">
        <li v-for="name in designers" :key="`${name}`">{{ name }}</li>
    </ul>
    <p>感谢以下人员对本扩展的支持：</p>
    <ul class="voice-list">
        <li v-for="name in specials" :key="`${name}`">{{ name }}</li>
    </ul>

		<!-- 资料来源 -->
		<div class="section-title">
			<span class="title-arrow">←←</span>
			<span class="title-text">资料来源</span>
			<span class="title-arrow">→→</span>
		</div>
		<p>
			干员介绍和势力均参考 PRTS，大部分干员语言也来自 PRTS：
			<a :href="prtsUrl" target="_blank" rel="noopener noreferrer" class="link">{{ prtsUrl }}</a>
		</p>
		<p>少部分干员（主要是剧情角色）配音使用 B 站 UP 主配音或 AI 合成：</p>

		<ul class="voice-list">
			<li>
				保存者、克丽斯腾：
				<a :href="`https://www.bilibili.com/video/BV1Yh411L72H`" target="_blank" rel="noopener noreferrer" class="link"> BV1Yh411L72H </a>
			</li>
			<li>
				AI 配音（GPT-SoVITS）：
				<ul class="sub-list">
					<li>特雷西斯（音源：赫德雷、赫拉格）</li>
					<li>特蕾西娅（音源：黍、九色鹿）</li>
					<li>普瑞赛斯（音源：魔王、黍）</li>
					<li>特蕾西娅 &amp; 特雷西斯（音源：赫德雷、赫拉格、黍、九色鹿）</li>
				</ul>
			</li>
			<li>
				ACE：
				<span class="highlight">明日方舟：黎明前奏</span>
			</li>
		</ul>

		<!-- 资源与反馈 -->
		<div class="section-title">
			<span class="title-arrow">←←</span>
			<span class="title-text">资源下载与 BUG 反馈</span>
			<span class="title-arrow">→→</span>
		</div>
		<div class="custom">
			反馈 bug、提供意见或资源下载可以加 QQ 群：
			<span class="copyable link" @click="copyText('104537053')"> 104537053（点击复制群号） </span>
		</div>
		<img :src="getImageUrl('qq1.jpg')" alt="QQ群二维码" class="qr-code" />
		<div class="custom">
			百度网盘链接：
			<span class="copyable link" @click="copyText('https://pan.baidu.com/s/1Dw4pXRujfIaSfTBC_qDAiw?pwd=mess')"> 【点击复制链接】密码 mess </span>
		</div>
		<img :src="getImageUrl('baidupan.png')" alt="百度网盘图标" class="baidu-icon" />
	</div>
</template>

<script setup>
import { computed } from "vue";
import { whichWayFile } from "../file.js";
import { whichWayConfigData } from "./data.js";

const designers = computed(() => whichWayConfigData.thanks.designer);
const specials = computed(() => whichWayConfigData.thanks.special);

// —————— 配置 ——————
const ASSET_BASE = computed(() => whichWayFile.compilePath("dec:"));
const prtsUrl = "https://prts.wiki/";

// —————— 工具函数 ——————
const getImageUrl = filename => `${ASSET_BASE.value}/${filename}`;

/**
 * 复制文本到剪贴板，并用 alert 提示结果
 * @param {string} content - 要复制的文本
 */
const copyText = content => {
	if (typeof content !== "string") {
		alert("❌ 复制失败：内容必须是文本");
		return;
	}

	content = content.trim();
	if (!content) {
		alert("❌ 复制失败：内容为空");
		return;
	}

	try {
		// 优先使用现代 Clipboard API
		if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
			navigator.clipboard.writeText(content).then(
				() => alert("✅ 已复制"),
				err => {
					console.error("Clipboard API 失败:", err);
					fallbackCopy(content);
				}
			);
			return;
		}

		// 降级方案
		fallbackCopy(content);
	} catch (err) {
		console.error("复制过程出错:", err);
		fallbackCopy(content);
	}
};

function fallbackCopy(content) {
	const textarea = document.createElement("textarea");
	textarea.value = content;
	textarea.style.cssText = "position:absolute;left:-9999px;top:-9999px;";
	document.body.appendChild(textarea);

	textarea.select();
	textarea.setSelectionRange(0, content.length); // 兼容 iOS

	const success = document.execCommand("copy");
	document.body.removeChild(textarea);

	if (success) {
		alert("✅ 已复制");
	} else {
		alert("❌ 复制失败，请手动选择并复制");
	}
}
</script>

<style scoped>
.whichWay-intro {
	max-width: 800px;
	margin: 0 auto;
	padding: 16px;
	font-size: 14px;
	line-height: 1.6;
	color: #ffffff;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.main-image {
	width: 100%;
	max-width: 800px;
	display: block;
	margin: 16px auto;
	border-radius: 4px;
}

.qr-code,
.baidu-icon {
	width: 100%;
	max-width: 500px;
	display: block;
	margin: 12px auto;
}

.section-title {
	display: flex;
	align-items: center;
	margin: 24px 0 12px;
	font-weight: bold;
	color: #ed7e78;
	position: relative;
	width: 100%;
}

.custom {
	width: 100%;
	max-width: 800px;
	margin: 15px;
	position: relative;
}

.title-arrow {
	flex: 0 0 auto;
	margin: 0 8px;
}

.title-text {
	flex: 1;
	text-align: center;
}

.highlight {
	color: #e74c3c;
	font-weight: bold;
}

.link,
.copyable {
	color: #3498db;
	text-decoration: underline;
	cursor: pointer;
	font-weight: bold;
}

.copyable:hover {
	opacity: 0.8;
}

/* 关键：移除所有列表符号 */
.voice-list,
.sub-list {
	margin: 8px 0 8px 20px;
	padding-left: 0;
	list-style-type: none;
  width: calc(100% - 16px);
  justify-items: center;
}

.voice-list li {
	margin-bottom: 6px;
}

.sub-list {
	margin-top: 4px;
	margin-left: 24px;
}

.sub-list li {
	margin-bottom: 4px;
}
</style>
