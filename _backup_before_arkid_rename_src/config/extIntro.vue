<template>
	<div class="whichWay-intro">
		<!-- 封面 -->
		<header class="hero">
			<img class="hero-bg" :src="getImageUrl('SJZX.jpg')" alt="驶舰之向封面" />
			<div class="hero-shade"></div>
			<div class="hero-foot">
				<img class="hero-badge" :src="getImageUrl('SJZXStar6.png')" alt="驶舰之向" />
				<span class="hero-tagline">明日方舟 × 无名杀 · 同人武将扩展</span>
			</div>
		</header>

		<!-- 作者与协力 LLM -->
		<section class="card-intro">
			<h2 class="section-title">作者</h2>
			<div class="people-flex">
				<div v-for="item in authors" :key="item.name" class="person">
					<img class="avatar" :src="item.avatar" :alt="item.name" />
					<div class="person-name">{{ item.name }}</div>
					<div class="person-role">{{ item.role }}</div>
				</div>
			</div>
			<h2 class="section-title">协力 LLM</h2>
			<div class="llm-row">
				<div v-for="item in agents" :key="item.name" class="llm">
					<span class="llm-chip"><img :src="item.logo" :alt="item.name" /></span>
					<span class="llm-name">{{ item.name }}</span>
				</div>
			</div>
			<h2 class="section-title">扩展仓库</h2>
			<div class="repo-row">
				<div class="repo-link" @click="openUrl(repoUrl)">
					<span class="llm-chip"><img :src="getImageUrl('github.png')" alt="GitHub" /></span>
					<span class="repo-text">
						<span class="repo-name">访问扩展仓库</span>
						<span class="repo-url">{{ repoUrl }}</span>
					</span>
				</div>
			</div>
		</section>

		<!-- 扩展介绍 -->
		<section class="card-intro">
			<h2 class="section-title">扩展介绍</h2>
			<p class="para">本扩展主要由<span class="highlight">林登万</span>制作，武将技能设计主要由<span class="highlight">林登万</span>和<span class="highlight">圣晴天空</span>提供。</p>
		</section>

		<!-- 感谢名单 -->
		<section class="card-intro">
			<h2 class="section-title">感谢名单</h2>
			<h3 class="sub-title">干员设计者</h3>
			<div class="tag-grid">
				<span v-for="name in designers" :key="`designer-${name}`" class="tag tag-gold">{{ name }}</span>
			</div>
			<h3 class="sub-title">特别感谢</h3>
			<div class="tag-grid">
				<span v-for="name in specials" :key="`special-${name}`" class="tag">{{ name }}</span>
			</div>
		</section>

		<!-- 资料来源 -->
		<section class="card-intro">
			<h2 class="section-title">资料来源</h2>
			<p class="para">
				干员介绍和势力均参考 PRTS，大部分干员语言也来自 PRTS：
				<a :href="prtsUrl" target="_blank" rel="noopener noreferrer" class="link">{{ prtsUrl }}</a>
			</p>
			<p class="para">少部分干员（主要是剧情角色）配音使用 B 站 UP 主配音或 AI 合成：</p>
			<ul class="voice-list">
				<li>
					保存者、克丽斯腾：
					<a :href="`https://www.bilibili.com/video/BV1Yh411L72H`" target="_blank" rel="noopener noreferrer" class="link">BV1Yh411L72H</a>
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
				<li>ACE：<span class="highlight">明日方舟：黎明前奏</span></li>
			</ul>
		</section>

		<!-- 资源与反馈 -->
		<section class="card-intro">
			<h2 class="section-title">资源下载与 BUG 反馈</h2>
			<div class="qr-grid">
				<div class="qr-card">
					<div class="qr-box"><img :src="getImageUrl('qq1.jpg')" alt="QQ群二维码" loading="lazy" decoding="async" /></div>
					<div class="qr-caption">QQ 群</div>
					<div class="qr-value">104537053</div>
					<button type="button" class="copy-btn" @click="copyText('104537053')">复制群号</button>
				</div>
				<div class="qr-card">
					<div class="qr-box"><img :src="getImageUrl('baidupan.png')" alt="百度网盘二维码" loading="lazy" decoding="async" /></div>
					<div class="qr-caption">百度网盘</div>
					<div class="qr-value">提取码 mess</div>
					<button type="button" class="copy-btn" @click="copyText('https://pan.baidu.com/s/1Dw4pXRujfIaSfTBC_qDAiw?pwd=mess')">复制链接</button>
				</div>
			</div>
		</section>

		<footer class="foot">本扩展为《明日方舟》同人作品，素材版权归原作者与鹰角网络所有。</footer>
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
const LOGO_BASE = computed(() => whichWayFile.compilePath("logo:"));
const prtsUrl = "https://prts.wiki/";
const repoUrl = "https://github.com/1TheLeaderOne/WhichWay";

const authors = [
	{ name: "TheLeaderOne", role: "扩展制作 · 技能设计", avatar: "1.jpg" },
	{ name: "圣晴天空", role: "技能设计", avatar: "0.jpg" },
].map(item => ({ ...item, avatar: `${ASSET_BASE.value}/${item.avatar}` }));

const agents = [
	{ name: "DeepSeek-v4.1-Flash", logo: "DeepSeek.png" },
	{ name: "Qwen3.8-Flash", logo: "Qwen.png" },
].map(item => ({ ...item, logo: `${LOGO_BASE.value}/${item.logo}` }));

// —————— 工具函数 ——————
const getImageUrl = filename => `${ASSET_BASE.value}/${filename}`;

const openUrl = url => {
	window.open(url);
};

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
	position: relative;
	width: 100%;
	max-width: 760px;
	margin: 0 auto;
	padding: 4px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 14px;
	font-size: 14px;
	line-height: 1.7;
	color: #e8e6e3;
	text-align: left;
}

/* ———— 封面 ———— */
.hero {
	position: relative;
	width: 100%;
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid rgba(232, 194, 104, 0.35);
	box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
}

.hero-bg {
	display: block;
	width: 100%;
	height: auto;
}

.hero-shade {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(10, 12, 16, 0.92) 0%, rgba(10, 12, 16, 0.25) 32%, rgba(10, 12, 16, 0) 55%);
	pointer-events: none;
}

.hero-foot {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 14px;
	flex-wrap: wrap;
}

.hero-badge {
	display: block;
	height: 26px;
	width: auto;
}

.hero-tagline {
	font-size: 12px;
	letter-spacing: 2px;
	color: rgba(255, 255, 255, 0.82);
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

/* ———— 卡片与标题 ———— */
.card-intro {
	width: 100%;
	height: fit-content;
	background: linear-gradient(160deg, rgba(40, 44, 54, 0.88), rgba(23, 26, 33, 0.92));
	border: 1px solid rgba(232, 194, 104, 0.22);
	border-radius: 10px;
	padding: 14px 16px 16px;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 4px 0 12px;
	font-size: 17px;
	font-weight: bold;
	letter-spacing: 3px;
	color: #e8c268;
	font-family: "lishu";
}

.section-title::before,
.section-title::after {
	content: "";
	flex: 1;
	height: 1px;
	background: linear-gradient(to right, rgba(232, 194, 104, 0), rgba(232, 194, 104, 0.55));
}

.section-title::after {
	background: linear-gradient(to left, rgba(232, 194, 104, 0), rgba(232, 194, 104, 0.55));
}

.sub-title {
	margin: 12px 0 8px;
	font-size: 13px;
	letter-spacing: 1px;
	color: rgba(232, 194, 104, 0.85);
}

.sub-title::before {
	content: "◆ ";
	font-size: 10px;
	vertical-align: 1px;
}

.para {
	margin: 6px 0;
}

/* ———— 作者 ———— */
.people-flex {
	position: relative;
	/* display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); */
	gap: 12px;
	justify-content: center;
	display: flex;
}

.person {
	position: relative;
	display: flex;
	width: 20%;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	padding: 12px 8px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.08);
}

.avatar {
	width: 64px;
	height: 64px;
	border-radius: 50%;
	object-fit: cover;
	display: block;
	border: 2px solid rgba(232, 194, 104, 0.75);
	box-shadow:
		0 0 0 3px rgba(232, 194, 104, 0.18),
		0 4px 10px rgba(0, 0, 0, 0.45);
}

.person-name {
	position: relative;
	margin-top: 4px;
	font-size: 14px;
	font-weight: bold;
	color: #ffffff;
}

.person-role {
	position: relative;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.55);
}

/* ———— LLM / 仓库 ———— */
.llm-row {
	position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.llm {
	position: relative;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px 6px 6px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.llm-chip {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.94);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	flex: 0 0 auto;
}

.llm-chip img {
	width: 22px;
	height: 22px;
	display: block;
	object-fit: contain;
}

.llm-name {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.85);
}

/* ———— 扩展仓库 ———— */
.repo-row {
	    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.repo-link {
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	padding: 8px 16px 8px 8px;
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.12);
	cursor: pointer;
	user-select: none;
	transition:
		border-color 0.15s,
		background 0.15s,
		box-shadow 0.15s;
}

.repo-link:hover {
	border-color: rgba(232, 194, 104, 0.7);
	background: rgba(232, 194, 104, 0.12);
	box-shadow: 0 0 10px rgba(232, 194, 104, 0.22);
}

.repo-text {
	display: flex;
	flex-direction: column;
	gap: 2px;
	text-align: left;
}

.repo-name {
	font-size: 13px;
	font-weight: bold;
	color: #f0d492;
}

.repo-url {
	font-size: 11px;
	color: rgba(255, 255, 255, 0.5);
	word-break: break-all;
}

/* ———— 名单 ———— */
.tag-grid {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.tag {
	padding: 3px 10px;
	border-radius: 999px;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.85);
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.14);
}

.tag-gold {
	color: #f0d492;
	background: rgba(232, 194, 104, 0.12);
	border-color: rgba(232, 194, 104, 0.4);
}

/* ———— 列表 ———— */
.voice-list,
.sub-list {
	margin: 8px 0;
	padding-left: 0;
	list-style-type: none;
}

.voice-list > li {
	position: relative;
	margin-bottom: 6px;
	padding-left: 16px;
}

.voice-list > li::before {
	content: "◆";
	position: absolute;
	left: 0;
	top: 0;
	font-size: 10px;
	line-height: inherit;
	color: rgba(232, 194, 104, 0.75);
}

.sub-list {
	margin: 4px 0 0;
	padding-left: 16px;
}

.sub-list li {
	position: relative;
	margin-bottom: 4px;
	color: rgba(255, 255, 255, 0.72);
}

.sub-list li::before {
	content: "·";
	position: absolute;
	left: -10px;
	color: rgba(255, 255, 255, 0.4);
}

/* ———— 二维码 ———— */
.qr-grid {
	position: relative;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 12px;
}

.qr-card {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	padding: 12px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.qr-box {
	position: relative;
	display: block;
	width: 100%;
	max-width: 200px;
	padding: 8px;
	border-radius: 8px;
	background: #ffffff;
	box-sizing: border-box;
}

.qr-box img {
	display: block;
	width: 100%;
	height: auto;
}

.qr-caption {
	position: relative;
	font-size: 13px;
	font-weight: bold;
	color: #f0d492;
	letter-spacing: 1px;
}

.qr-value {
	position: relative;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.7);
	word-break: break-all;
	text-align: center;
}

.copy-btn {
	margin-top: 2px;
	padding: 4px 14px;
	font-size: 12px;
	color: #f0d492;
	background: rgba(232, 194, 104, 0.12);
	border: 1px solid rgba(232, 194, 104, 0.55);
	border-radius: 999px;
	cursor: pointer;
	transition:
		background 0.15s,
		box-shadow 0.15s;
}

.copy-btn:hover {
	background: rgba(232, 194, 104, 0.25);
	box-shadow: 0 0 8px rgba(232, 194, 104, 0.35);
}

.copy-btn:active {
	background: rgba(232, 194, 104, 0.4);
}

/* ———— 文本与页脚 ———— */
.highlight {
	color: #ed7e78;
	font-weight: bold;
}

.link {
	color: #6fb7ff;
	text-decoration: underline;
	text-underline-offset: 3px;
	font-weight: bold;
}

.foot {
	font-size: 11px;
	color: rgba(255, 255, 255, 0.42);
	text-align: center;
	padding: 2px 8px 8px;
}
</style>
