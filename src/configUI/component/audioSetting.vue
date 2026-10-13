<template>
	<div class="audio-setting">
		<div class="picker-col">
			<charPicker v-model="selected" :names="names" />
		</div>

		<div class="detail-col">
			<div v-if="!selected" class="hint">请先在左侧选择一名驶舰之向干员</div>
			<template v-else>
				<!-- 干员立绘 + 名称 + 当前配音语言 -->
				<div class="char-card">
					<div class="char-avatar" :style="avatarStyle"></div>
					<div class="char-meta">
						<div class="detail-title">{{ displayName }}</div>
						<div class="current-line">当前配音：<span class="current-value">{{ langText(currentLang) }}</span></div>
					</div>
				</div>

				<!-- 配音语言切换 -->
				<div class="section-title">配音语言</div>
				<div v-if="langs.length" class="lang-list">
					<div v-for="lang in langs" :key="lang" class="selectWrapper" @click="selectLang(lang)">
						<div :class="lang === currentLang ? 'choice' : 'nochoice'"></div>
						<div :class="lang === currentLang ? 'choice-content' : 'nochoice-content'">
							<div class="selectText">{{ langText(lang) }}</div>
						</div>
					</div>
				</div>
				<div v-else class="hint">该干员暂无可切换的配音语言</div>

				<!-- 各技能配音试听 -->
				<div class="section-title">技能配音</div>
				<div v-if="skills.length" class="play-list">
					<div v-for="s in skills" :key="s.id" class="play-row">
						<div class="play-name">{{ s.label }}</div>
						<div class="play-btn" @click="playSkill(s.id)"></div>
					</div>
				</div>
				<div v-else class="hint">该干员暂无技能</div>

				<!-- 死亡配音试听 -->
				<div class="section-title">死亡配音</div>
				<div class="play-row">
					<div class="play-name">{{ displayName }} 阵亡语音</div>
					<div class="play-btn" @click="playDie"></div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
/**
 * 功能一：配音设置。
 *
 * 左侧干员可用中文/拼音/技能搜索；右侧展示所选干员的立绘、配音语言切换、
 * 各技能试听按钮与死亡配音试听按钮。
 * - 语言切换参考 `characterCard/CharacterCard.vue` 的配音选择：`whichWayAudio.setCustomAudio` 落库后立即重算。
 * - 试听复用武将卡技能面板的机制：技能走 `whichWayAudio.playSkillAudio`（在线/本地自动处理），
 *   阵亡走引擎 `game.tryDieAudio`（其扩展钩子按在线/本地分流）。
 */
import { ref, computed, onMounted } from "vue";
import { get, game } from "noname";
import { whichWayAudio } from "../../audio/index.ts";
import { whichWaySkin } from "../../skin/index.ts";
import { whichWayArknight } from "../../arknight/index.ts";
import { whichWayToast } from "../../toast/index.ts";
import charPicker from "./charPicker.vue";

const emit = defineEmits(["loaded"]);

const selected = ref("");
/** 配音/模组配置存在扩展侧的普通对象里（非响应式），切换后自增以强制重算 */
const version = ref(0);

/** 候选：全部驶舰之向干员 */
const names = computed(() => window.whichWaySave?.allCharacters || []);

const displayName = computed(() => {
	const text = get.translation(selected.value) || selected.value;
	return String(text).replace(/<[^>]+>/g, "");
});

/** 干员立绘：与武将卡同源（当前皮肤路径） */
const avatarStyle = computed(() => {
	version.value;
	if (!selected.value) return {};
	const url = whichWaySkin.getCurrentSkinPath(selected.value) || "";
	//url() 必须加引号：皮肤名可以带空格（如「夏卉 FA075.png」），不加引号整条声明会被当作非法 CSS 丢掉
	return { backgroundImage: url.startsWith("url") ? url : `url("${url}")` };
});

/** 该干员可选的配音语言 */
const langs = computed(() => (selected.value ? whichWayAudio.getCharacterAvailableLang(selected.value) || [] : []));

/** 当前配音语言 */
const currentLang = computed(() => {
	version.value;
	return selected.value ? whichWayAudio.getCharacterLang(selected.value) : "";
});

/** 该干员的技能列表（含译名），每条配一个试听按钮 */
const skills = computed(() => {
	version.value;
	if (!selected.value) return [];
	return (get.character(selected.value)?.skills || []).map(skill => ({ id: skill, label: get.translation(skill) }));
});

const langText = lang => whichWayArknight.getVoiceLangTranslation(lang) || lang;

async function selectLang(lang) {
	if (lang === currentLang.value) return;
	if (!window.whichWaySave?.hasChar(selected.value)) {
		whichWayToast.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
		return;
	}
	await whichWayAudio.setCustomAudio(selected.value, lang);
	version.value++;
}

function playSkill(skill) {
	whichWayAudio.playSkillAudio(skill, selected.value);
}

function playDie() {
	game.tryDieAudio(selected.value);
}

onMounted(() => emit("loaded"));
</script>

<style scoped>
.audio-setting {
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
	width: 50%;
	height: 100%;
	min-width: 0;
}

.detail-col {
	position: relative;
	width: 50%;
	height: 100%;
	overflow: auto;
	min-width: 0;
	padding: 8px;
	box-sizing: border-box;
	color: #f5f5f5;
}

.char-card {
	position: relative;
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 12px;
}

.char-avatar {
	position: relative;
	width: 96px;
	height: 96px;
	flex: 0 0 auto;
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 4px;
}

.char-meta {
	position: relative;
	flex: 1 1 auto;
	min-width: 0;
}

.detail-title {
	position: relative;
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 8px;
}

.current-line {
	position: relative;
	font-size: 15px;
}

.current-value {
	color: #1ac2fd;
	font-weight: bold;
}

.section-title {
	position: relative;
	font-size: 16px;
	font-weight: bold;
	color: #cebf28;
	margin: 16px 0 8px;
	padding-bottom: 4px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.hint {
	position: relative;
	color: #ccc;
	font-size: 15px;
	padding: 20px;
	text-align: center;
}

.lang-list {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.play-list {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.play-row {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 34px;
	padding: 0 8px;
	box-sizing: border-box;
	background-color: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 4px;
}

.play-name {
	position: relative;
	font-size: 15px;
	color: #f5f5f5;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.play-btn {
	position: relative;
	flex: 0 0 auto;
	width: 25px;
	height: 25px;
	cursor: pointer;
	background-size: 100% 100%;
	background-image: url("../../../image/ui/Play.png");
	background-color: white;
	border-radius: 50%;
}

.selectWrapper {
	position: relative;
	width: 100%;
	height: 34px;
	cursor: pointer;
	box-sizing: border-box;
}

.selectWrapper > .nochoice,
.selectWrapper > .choice {
	position: absolute;
	top: 6px;
	left: 10px;
	width: 20px;
	height: 20px;
	background-color: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.5);
	box-sizing: border-box;
	z-index: 1;
}

.selectWrapper > .choice {
	background-image: url("../../../image/ui/check.png");
	background-size: 100% 100%;
	box-shadow: 0 0 5px #f5f5f5;
}

.selectWrapper > .nochoice-content {
	position: absolute;
	top: 0;
	left: 20px;
	width: calc(100% - 20px);
	height: 34px;
	background-image: linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent);
	background-repeat: no-repeat;
	border: 1px solid;
	border-image: linear-gradient(to left, rgba(255, 255, 255, 0.6), transparent) 1;
	box-sizing: border-box;
}

.selectWrapper > .choice-content {
	position: absolute;
	top: 0;
	left: 20px;
	width: calc(100% - 20px);
	height: 34px;
	background-color: #0097da;
	border: 1px solid #1ac2fd;
	box-sizing: border-box;
}

.selectText {
	position: absolute;
	top: 0;
	left: 15px;
	height: 32px;
	font-size: 15px;
	line-height: 32px;
	color: #f5f5f5;
}
</style>
