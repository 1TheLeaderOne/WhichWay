<template>
	<div class="container-CC-SJZX" :style="{ backgroundImage: `url(${backgroundUrl})` }">
		<!-- 势力 logo（明日方舟图标反色；没有图标就显示势力文字） -->
		<div class="camplogo-wrapper">
			<div class="img-def" :class="{ arknightCamp: camp.useFilter }" :style="camp.logoUrl ? { backgroundImage: `url(${camp.logoUrl})` } : null">
				<div v-if="!camp.logoUrl && camp.text" class="group-text">{{ camp.text }}</div>
			</div>
		</div>

		<!-- 顶部菜单 -->
		<div class="topMenu-wrapper">
			<div class="btn-back" @click="close">
				<div class="imageBox"><img :src="uiUrl('back.png')" alt="" /></div>
			</div>
			<div
				v-for="btn in menuButtons"
				:key="btn.key"
				class="btn-background"
				:class="{ 'btn-selected-SJZX': panel === btn.key }"
				@click="panel = btn.key"
			>
				<div class="btn-enSJZX">{{ btn.en }}</div>
				<div class="btn-cnSJZX">{{ btn.cn }}</div>
				<div class="btnImage-wrapper"><img class="btn-img" :src="uiUrl(btn.image)" alt="" /></div>
			</div>
		</div>

		<!-- 皮肤名 / 作者 / 配音 -->
		<div class="skinnameAudio-wrapper">
			<div class="skinnameWrapper">
				<div class="titleWrapper">
					<div class="imageWrapper"><img :src="uiUrl('painter.png')" alt="" /></div>
					<div class="textWrapper">{{ skinName }}</div>
				</div>
			</div>
			<div class="designerWrapper">
				<div class="titleWrapper">
					<div class="imageWrapper"><img class="imageLimit" :src="uiUrl('designer.png')" alt="" /></div>
					<div class="textWrapper">{{ designers }}</div>
				</div>
			</div>
			<div class="audioWrapper" :style="audioCollapsed ? null : { height: `${(audioLangs.length + 1) * 50}px` }">
				<div class="audioTitleWrapper">
					<div class="imageWrapper"><img :src="uiUrl('cv.png')" alt="" /></div>
					<div class="textWrapper">{{ audioText }}</div>
					<div class="collapseWrapper" @click="audioCollapsed = !audioCollapsed">
						<img :src="uiUrl(audioCollapsed ? 'plus.png' : 'sub.png')" style="height: 50%" alt="" />
					</div>
				</div>
				<div class="content">
					<div v-for="lang in audioLangs" :key="lang" class="selectWrapper" @click="selectLang(lang)">
						<div :class="lang === audioLang ? 'choice' : 'nochoice'"></div>
						<div :class="lang === audioLang ? 'choice-contentTextWrapper' : 'nochoice-contentTextWrapper'">
							<div class="selectTextSJZX">{{ langText(lang) }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 称号 / 武将名 / 体力 -->
		<div class="charName-wrapper">
			<!-- 称号与武将名都允许 HTML：称号里的 `<font color=...>` 就是靠它上色的（原实现用的 innerHTML） -->
			<div class="charNameTitleWrapper"><div class="charNameTitle" v-html="charTitle"></div></div>
			<div class="charNameTextWrapper"><div class="charNameText" v-html="charText"></div></div>
			<div class="hpWrapper">
				<template v-if="hp.maxHp + hp.hujia > 6">
					<div class="hpNumWrapper">
						<div class="actualHpSJZX"></div>
						<div class="hpNumText">{{ hp.hp }}/{{ hp.maxHp }}</div>
					</div>
					<div v-if="hp.hujia > 0" class="hpNumWrapper">
						<div class="shieldSJZX"></div>
						<div class="hpNumText">{{ hp.hujia }}</div>
					</div>
				</template>
				<template v-else>
					<div v-for="i in hp.maxHp" :key="`hp${i}`" :class="i <= hp.hp ? 'actualHpSJZX' : 'emptyHpSJZX'"></div>
					<div v-for="i in hp.hujia" :key="`shield${i}`" class="shieldSJZX"></div>
				</template>
			</div>
		</div>

		<!-- 立绘（动皮由 spineWorker 挂载到这个元素上，所以它必须保持稳定） -->
		<div class="charImageWrapper">
			<div ref="charImageEl" class="charImage" :style="charImageStyle"></div>
			<div class="charSkinBottomUIWrapper" :style="{ display: hasDynamicSkin ? '' : 'none' }">
				<div class="buttonWrapper" :class="{ 'buttonWrapper-enableSkinBG': dynamicEnabled }" @click="toggleDynamicSkin">
					<div class="buttonText">{{ dynamicEnabled ? "关闭动皮" : "开启动皮" }}</div>
				</div>
			</div>
		</div>

		<!-- 右侧面板 -->
		<div class="displayArenaSJZX">
			<SkillPanel v-if="panel === 'skill'" :name="name" />
			<SkinPanel v-else-if="panel === 'skin'" :name="name" @skinChange="onSkinChange" />
			<ModulePanel v-else-if="panel === 'mode'" :name="name" />
			<BackgroundPanel v-else-if="panel === 'background'" :value="background" @select="onBackgroundSelect" />
			<ResumePanel v-else :name="name" />
		</div>
	</div>
</template>

<script setup>
/**
 * 驶舰之向武将卡（原 `src/characterCard/index.ts` + `click.ts` 造 DOM、`css/characterCard.css` 提供样式的模式，
 * 已整体组件化：界面由本组件与 `./panels/*.vue` 渲染，样式改为各组件内的 scoped 样式）。
 *
 * 对外接口只有 `create(name)` 与关闭回调：
 * - 由 `WhichWayCharacterCard.create()` 用 `createApp(CharacterCard, { name, onClose })` 挂载；
 * - 关闭（返回键）时调用 `onClose`，由外部卸载 Vue 应用、复原界面并 `game.resume2()`；
 * - 默认展示「技能」面板（与原实现打开后调用 `click.skill()` 一致）。
 */
import { computed, onMounted, ref } from "vue";
import { lib, game, get } from "noname";
import { whichWayFile } from "../file.js";
import { whichWayUtil } from "../utill.js";
import { whichWaySkin } from "../skin/index.ts";
import { whichWayAudio } from "../audio/index.ts";
import { whichWayToast } from "../toast/index.ts";
import { whichWayArknight } from "../arknight/index.ts";
import { spineWorker } from "../skin/spineWork.js";
import { whichWayCharacterModules } from "../modules/index.js";
import { getDesigner, getCamp } from "../packs/base/index.js";
import { getGroupData } from "../packs/base/groups.js";
import SkillPanel from "./panels/SkillPanel.vue";
import SkinPanel from "./panels/SkinPanel.vue";
import ModulePanel from "./panels/ModulePanel.vue";
import ResumePanel from "./panels/ResumePanel.vue";
import BackgroundPanel from "./panels/BackgroundPanel.vue";

const props = defineProps({
	/** 武将名（char id） */
	name: { type: String, required: true },
	/** 关闭回调：由 WhichWayCharacterCard 卸载应用并复原 */
	onClose: { type: Function, default: null },
});

/** 武将卡背景（存 `extension_WhichWay_characterCardBackground`，值为 `<scheme>:<file>`） */
const DEFAULT_BACKGROUND = "ui:background/default.png";
const background = ref(whichWayUtil.config("characterCardBackground") || DEFAULT_BACKGROUND);
const backgroundUrl = computed(() => whichWayFile.compilePath(background.value));

/** 当前右侧面板：skill / skin / mode / background / resume */
const panel = ref("skill");

/** `image/ui/` 下的静态图 */
const uiUrl = file => whichWayFile.compilePath(`ui:${file}`);

/** 势力 logo / 反色 / 势力文字（原 createCampLogo 的逻辑） */
const camp = computed(() => {
	const campName = getCamp(props.name);
	const char = get.character(props.name);
	//角色的自定义阵营（如埃癸斯的 `persona`）也参与查表
	const arknightsCamp = char?.whichWay?.arknight?.camp;
	const groupInfo = getGroupData(char?.group, whichWayUtil.getCharExtConfig(props.name)?.reallyGroup, arknightsCamp);
	const arknightLogo = arknightsCamp || groupInfo?.logo || groupInfo?.reallyGroup;
	const useFilter = groupInfo?.filter ?? !!arknightLogo;
	if (arknightLogo) return { useFilter, logoUrl: `${whichWayFile.extDir}image/camplogo/arknight/${arknightLogo}.png`, text: "" };
	if (campName) return { useFilter, logoUrl: `${whichWayFile.extDir}image/camplogo/noname/name_${campName}.png`, text: "" };
	return { useFilter: false, logoUrl: "", text: lib.translate[char?.group] || "" };
});

/** 称号 / 名字 / 体力 */
const charTitle = computed(() => lib.characterTitle[props.name] || "");
const charText = computed(() => get.translation(props.name));
const hp = computed(() => {
	const { maxHp = 0, hp = 0, hujia = 0 } = get.character(props.name) || {};
	return { maxHp, hp, hujia };
});

/** 顶部菜单：简介 / 技能 / 皮肤 / 模组（有模组才显示）/ 背景 */
const menuButtons = computed(() => {
	const buttons = [
		{ key: "resume", en: "QUIT", cn: "简介", image: "resume.png" },
		{ key: "skill", en: "SKILL", cn: "技能", image: "skill.png" },
		{ key: "skin", en: "SKIN", cn: "皮肤", image: "skin.png" },
	];
	if (whichWayCharacterModules.getCharModules(props.name, false)) buttons.push({ key: "mode", en: "MODE", cn: "模组", image: "mode.png" });
	buttons.push({ key: "background", en: "BG", cn: "背景", image: "back_switch.png" });
	return buttons;
});

/** 当前皮肤名 / 作者 / 立绘 */
const skinName = ref(whichWaySkin.getCurentSkin(props.name));
const designers = computed(() => getDesigner(props.name).join("、"));
const charImageEl = ref(null);
/**
 * 立绘路径。皮肤配置存在扩展侧的普通对象里（不是响应式数据），
 * 所以用 ref 存路径、换肤后由 onSkinChange 手动同步：
 * 若直接用 computed 去读存储，它只在首次渲染算一次 —— 切到"没有动皮"的皮肤时立绘不更新，
 * 切到"有动皮"的皮肤时又被 spine 层盖住显得正常，表现出来就是"时灵时不灵"。
 */
const skinPath = ref(whichWaySkin.getCurrentSkinPath(props.name));
const charImageStyle = computed(() => {
	const url = skinPath.value;
	return { backgroundImage: url.startsWith("url") ? url : `url(${url})` };
});

/** 动皮：该皮肤有没有动皮数据、以及是否已开启 */
const hasDynamicSkin = ref(false);
const dynamicEnabled = ref(false);
function refreshDynamicSkin() {
	const skin = whichWaySkin.getCurentSkin(props.name);
	hasDynamicSkin.value = !!spineWorker.getSkinData(props.name, skin);
	dynamicEnabled.value = spineWorker.isEnabledSkin(props.name, skin);
}

/** 配音：当前语言 / 可选语言 / 折叠状态 */
const audioLang = ref(whichWayAudio.getCharacterLang(props.name));
const audioLangs = computed(() => whichWayAudio.getCharacterAvailableLang(props.name) || []);
const audioText = computed(() => whichWayAudio.getCharacterLang(props.name, true));
const audioCollapsed = ref(true);
const langText = lang => whichWayArknight.getVoiceLangTranslation(lang);
async function selectLang(lang) {
	if (lang === audioLang.value) return;
	//不是本扩展的武将无法更改配音
	if (!window.whichWaySave.hasChar(props.name)) {
		whichWayToast.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
		return;
	}
	await whichWayAudio.setCustomAudio(props.name, lang);
	audioLang.value = lang;
}

/** 换肤（皮肤面板发出）：更新立绘、动皮状态与场上玩家 */
async function onSkinChange({ skinName: name, path }) {
	skinName.value = name;
	//立绘路径随选中的皮肤一起手动同步（见 skinPath 处的注释）
	skinPath.value = whichWaySkin.getCurrentSkinPath(props.name);
	refreshDynamicSkin();
	await spineWorker.updateDyc(props.name, charImageEl.value);
	whichWaySkin.refreshSkin();
}

/** 更换武将卡背景（背景面板发出） */
function onBackgroundSelect(value) {
	background.value = value;
	whichWayUtil.saveConfig("characterCardBackground", value);
}

/** 开关动皮 */
async function toggleDynamicSkin() {
	const skin = whichWaySkin.getCurentSkin(props.name);
	await spineWorker.toggleDycSkin(props.name, skin);
	refreshDynamicSkin();
	await spineWorker.updateDyc(props.name, charImageEl.value);
	for (const player of game.players) {
		if (get.name(player) === props.name) await spineWorker.updateDyc(props.name, player);
	}
}

function close() {
	if (typeof props.onClose === "function") props.onClose();
}

onMounted(async () => {
	refreshDynamicSkin();
	await spineWorker.updateDyc(props.name, charImageEl.value);
});
</script>

<style scoped>
.container-CC-SJZX {
	width: 100%;
	height: 100%;
	background-size: 100% 100%;
	z-index: 20;
	position: absolute;
	left: 0;
	top: 0;
}

.container-CC-SJZX .imageLimit {
	max-width: 100%;
	max-height: 100%;
}

.camplogo-wrapper {
	position: absolute;
	width: 256px;
	height: 256px;
	left: 1%;
	top: 8.3%;
	z-index: -1;
	pointer-events: none;
}

.camplogo-wrapper .arknightCamp {
	filter: invert(1);
	opacity: 0.3;
}

.camplogo-wrapper .img-def {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.camplogo-wrapper .img-def .group-text {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	font-size: 160px;
	font-weight: bolder;
	font-family: huangcao, xinwei;
	color: #000000;
	-webkit-text-stroke: 0.5px rgb(255, 255, 255);
	display: flex;
	justify-content: center;
	align-items: center;
}

.skinnameAudio-wrapper {
	position: absolute;
	bottom: 180px;
	left: 1%;
	width: 250px;
	transition: all 0.3s ease-in-out;
}

.skinnameAudio-wrapper .imageWrapper {
	position: absolute;
	top: 0;
	left: 0;
	width: 30px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.skinnameAudio-wrapper .textWrapper {
	position: absolute;
	top: 0;
	left: 25px;
	width: calc(100% - 30px);
	height: 30px;
	font-size: 16px;
	line-height: 30px;
	text-align: center;
	color: #f5f5f5;
}

.skinnameAudio-wrapper .collapseWrapper {
	position: absolute;
	top: 0;
	right: 0;
	height: 30px;
	aspect-ratio: 1 / 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}

.skinnameAudio-wrapper > .skinnameWrapper,
.skinnameAudio-wrapper > .designerWrapper,
.skinnameAudio-wrapper > .audioWrapper {
	width: 250px;
	height: 30px;
	background-color: rgba(0, 0, 0, 0.6);
	overflow: hidden;
	transition: all 0.3s ease-in-out;
	position: relative;
}

.skinnameAudio-wrapper > .skinnameWrapper,
.skinnameAudio-wrapper > .designerWrapper {
	margin-bottom: 10px;
}

.skinnameAudio-wrapper > .skinnameWrapper > .titleWrapper,
.skinnameAudio-wrapper > .designerWrapper > .titleWrapper,
.skinnameAudio-wrapper > .audioWrapper > .audioTitleWrapper {
	width: 100%;
	height: 100%;
}

.skinnameAudio-wrapper > .audioWrapper > .content {
	position: absolute;
	width: 100%;
	top: 40px;
	left: 0;
}

.skinnameAudio-wrapper > .audioWrapper > .content > .selectWrapper {
	width: 100%;
	height: 30px;
	position: relative;
	margin-bottom: 10px;
	cursor: pointer;
}

.skinnameAudio-wrapper > .audioWrapper > .content > .selectWrapper .selectTextSJZX {
	position: absolute;
	top: 0;
	left: 15px;
	height: 28px;
	font-size: 14px;
	line-height: 28px;
	color: #f5f5f5;
}

.skinnameAudio-wrapper > .audioWrapper > .content > .selectWrapper > .nochoice-contentTextWrapper {
	position: absolute;
	top: 0;
	left: 20px;
	width: calc(100% - 30px);
	height: 30px;
	background-image: linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent);
	background-repeat: no-repeat;
	border: 1px solid;
	border-image: linear-gradient(to left, rgba(255, 255, 255, 0.6), transparent) 1;
	box-sizing: border-box;
}

.skinnameAudio-wrapper > .audioWrapper > .content > .selectWrapper > .choice-contentTextWrapper {
	position: absolute;
	top: 0;
	left: 20px;
	width: calc(100% - 30px);
	height: 30px;
	background-color: #0097da;
	border: 1px solid #1ac2fd;
	box-sizing: border-box;
}

.skinnameAudio-wrapper > .audioWrapper > .content > .selectWrapper > .nochoice {
	position: absolute;
	top: 5px;
	left: 10px;
	width: 20px;
	height: 20px;
	background-size: 100% 100%;
	background-color: rgba(0, 0, 0, 0.2);
	z-index: 1;
	border: 1px solid rgba(255, 255, 255, 0.5);
	box-sizing: border-box;
}

.skinnameAudio-wrapper > .audioWrapper > .content > .selectWrapper > .choice {
	position: absolute;
	top: 5px;
	left: 10px;
	width: 20px;
	height: 20px;
	background-color: rgba(0, 0, 0, 0.2);
	background-image: url("../../image/ui/check.png");
	background-size: 100% 100%;
	z-index: 1;
	box-shadow: 0 0 5px #f5f5f5;
}

.charName-wrapper {
	position: absolute;
	transition: all 0.3s ease-in-out;
	width: 25%;
	bottom: 2%;
	left: 1%;
}

.charName-wrapper > .hpWrapper {
	position: relative;
	width: 100%;
	height: 25px;
	display: flex;
}

.charName-wrapper > .hpWrapper > .hpNumWrapper {
	position: relative;
	height: 100%;
	display: flex;
	align-items: center;
	margin-right: 2%;
}

.charName-wrapper > .hpWrapper > .hpNumWrapper > .hpNumText {
	position: relative;
	margin-left: 4%;
	font-size: 20px;
	display: flex;
	align-items: center;
}

.charName-wrapper > .hpWrapper .actualHpSJZX {
	position: relative;
	width: 25px;
	height: 25px;
	background-size: 100% 100%;
	background-image: url("../../image/ui/actualHp.png");
}

.charName-wrapper > .hpWrapper .emptyHpSJZX {
	position: relative;
	width: 25px;
	height: 25px;
	background-size: 100% 100%;
	background-image: url("../../image/ui/emptyHp.png");
}

.charName-wrapper > .hpWrapper .shieldSJZX {
	position: relative;
	width: 25px;
	height: 25px;
	background-size: 100% 100%;
	background-image: url("../../image/ui/shield.png");
}

.charName-wrapper > .charNameTextWrapper {
	position: relative;
	width: 100%;
	height: 60px;
	white-space: nowrap;
	overflow-x: auto;
	overflow-y: hidden;
}

.charName-wrapper > .charNameTextWrapper > .charNameText {
	position: relative;
	font-size: 52px;
	line-height: 60px;
	font-family: dy_sjzx;
	color: #fff;
	text-shadow: -2px -2px 0 rgba(0, 0, 0, 0.3), 2px -2px 0 rgba(0, 0, 0, 0.3), -2px 2px 0 rgba(0, 0, 0, 0.3), 2px 2px 0 rgba(0, 0, 0, 0.3);
	transition: all 0.3s ease-in-out;
	white-space: nowrap;
}

.charName-wrapper > .charNameTitleWrapper {
	position: relative;
	width: 100%;
	height: 22px;
	white-space: nowrap;
	overflow-x: auto;
	overflow-y: hidden;
}

.charName-wrapper > .charNameTitleWrapper > .charNameTitle {
	position: relative;
	font-size: 21px;
	line-height: 21px;
	font-family: sans-serif;
	color: #fff;
	transition: all 0.3s ease-in-out;
	overflow-x: auto;
	overflow-y: hidden;
	white-space: nowrap;
}

.charImageWrapper {
	position: absolute;
	height: 90%;
	bottom: 0;
	width: 30%;
	right: 42%;
	display: inline-block;
}

.charImageWrapper > .charImage {
	mask-image: radial-gradient(circle at center, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0) 80%);
	mask-repeat: no-repeat;
	mask-size: 100% 100%;
	-webkit-mask-image: radial-gradient(circle at center, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0) 80%);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-size: 100% 100%;
	width: 100%;
	aspect-ratio: 2/3;
	background-size: cover;
	background-position: center center;
}

.charImageWrapper > .charSkinBottomUIWrapper {
	position: absolute;
	width: 100%;
	height: 10%;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.charImageWrapper > .charSkinBottomUIWrapper > .buttonWrapper {
	width: 200px;
	height: 38px;
	background-color: rgba(0, 0, 0, 0.6);
	cursor: pointer;
	vertical-align: top;
	position: relative;
	border: 1px solid grey;
	border-radius: 2px;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
}

.charImageWrapper > .charSkinBottomUIWrapper > .buttonWrapper-enableSkinBG {
	background-color: rgba(26, 194, 253, 0.6) !important;
}

.charImageWrapper > .charSkinBottomUIWrapper > .buttonText {
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-family: dy_sjzx;
	font-size: 20px;
	font-weight: bolder;
}

.displayArenaSJZX {
	position: absolute;
	width: 40%;
	right: 0;
	bottom: 0;
	height: 80%;
	overflow-y: auto;
	overflow-x: hidden;
}

.topMenu-wrapper {
	position: absolute;
	left: 10px;
	width: 60%;
	height: 8%;
	transition: all 0.3s ease-in-out;
	display: flex;
	align-items: center;
}

.topMenu-wrapper > .btn-back {
	position: relative;
	width: 38px;
	height: 38px;
	background-color: rgba(0, 0, 0, 0.7);
	cursor: pointer;
	display: inline-block;
	box-sizing: border-box;
	transition: 0.3s ease-in-out;
	border-radius: 2px;
	border-width: 1px;
	border-style: solid;
	border-color: rgb(153, 153, 153);
	border-image: initial;
}

.topMenu-wrapper > .btn-back > .imageBox {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.topMenu-wrapper > .btn-background {
	width: 100px;
	height: 38px;
	background-color: rgba(0, 0, 0, 0.6);
	cursor: pointer;
	display: inline-block;
	vertical-align: top;
	margin-left: 15px;
	position: relative;
	border: 1px solid grey;
	border-radius: 2px;
	box-sizing: border-box;
}

.topMenu-wrapper > .btn-selected-SJZX {
	background-color: rgb(0 133 255 / 80%) !important;
	border: 2px solid rgb(255 203 0) !important;
}

.topMenu-wrapper > .btn-background > .btn-enSJZX {
	position: absolute;
	top: 2px;
	left: 30px;
	width: auto;
	height: 18px;
	line-height: 18px;
	font-size: 18px;
	font-weight: 700;
	color: transparent;
	-webkit-text-stroke: 1px #999;
	font-family: sans-serif;
	transform: skewX(-20deg);
	transition: all 0.3s ease-in-out;
	filter: drop-shadow(0 0 3px #000);
	z-index: 0;
}

.topMenu-wrapper > .btn-background > .btn-cnSJZX {
	position: absolute;
	top: 15px;
	left: 40px;
	width: auto;
	height: 22px;
	line-height: 22px;
	font-size: 22px;
	color: #f5f5f5;
	font-family: dy_sjzx;
	filter: drop-shadow(0 0 3px #000);
	transition: all 0.3s ease-in-out;
	z-index: 2;
}

.topMenu-wrapper > .btn-background > .btnImage-wrapper {
	position: absolute;
	top: -10px;
	left: -5px;
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	transition: all 0.3s ease-in-out;
}

.topMenu-wrapper > .btn-background > .btnImage-wrapper > .btn-img {
	width: 50px;
	filter: drop-shadow(0 0 3px #000);
	z-index: 1;
}
</style>
