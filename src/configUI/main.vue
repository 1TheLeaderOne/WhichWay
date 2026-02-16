<template>
	<div class="backgroundConfigUI" v-if="configUIVisible">
		<div class="container">
			<div class="titleBox">
				<div class="ControlCPClose" @click="hide"></div>
				<div class="titleText">文明的存续</div>
			</div>
			<div class="functionBox">
				<div class="titleBox">
					<div class="imageBox">
						<img :src="imgTitleSrc" />
					</div>
					<div class="title">功能设置</div>
				</div>

				<!-- 按钮列表 -->
				<div v-for="(panel, index) in panels" :key="index" class="funcButton" :class="{ selectedButton_ConfigUI_SJZX: currentPanel === panel.name }" @click="selectPanel(panel)">
					{{ panel.name }}
				</div>
			</div>
			<div class="displayArea">
				<!-- 控制显示内容 -->
				<component :is="currentComponent" v-if="currentPanel" @loaded="handleContentLoaded" />
			</div>
		</div>
	</div>
</template>
<script setup>
import { lib, game, ui, get, ai, _status } from "noname";
import { computed, ref, nextTick, onMounted } from "vue";
import UpdateCurrent from "./component/updateCurrent.vue";
import ExtIntro from "../config/extIntro.vue";
import BackgroundSet from "./component/backgroundSet.vue";
import UpdateLog from "./component/updateLog.vue";

let imgTitleSrc = "./extension/WhichWay/image/ui/painter.png";

//实现不同面板的切换
const panels = [
	{ name: "更新公告", component: UpdateCurrent, autoLoad: true },
	{ name: "更新日志", component: UpdateLog },
	{ name: "扩展介绍", component: ExtIntro },
	{ name: "背景设置", component: BackgroundSet },
];

//当前面板
const currentPanel = ref("");
const currentComponent = computed(() => {
	const panel = panels.find(p => p.name === currentPanel.value);
	return panel ? panel.component : null;
});

const displayAreaRef = ref(null);
// 选择面板
const selectPanel = async panel => {
	// 清空展示区域（滚动到顶部）
	if (displayAreaRef.value) {
		//@ts-ignore
		displayAreaRef.value.scrollTop = 0;
		//@ts-ignore
		displayAreaRef.value.style.overflow = "";
	}

	// 更新当前面板
	currentPanel.value = panel.name;

	// 如果是首次加载且标记为 autoLoad，触发加载完成回调
	if (panel.autoLoad && panel.onLoad) {
		await nextTick();
		panel.onLoad();
	}
};

// 内容加载完成回调
const handleContentLoaded = () => {
	if (displayAreaRef.value) {
		//@ts-ignore
		displayAreaRef.value.style.overflow = "auto";
	}
};

// 初始化
onMounted(async () => {
	// 默认选中第一个面板
	if (panels[0]) {
		currentPanel.value = panels[0].name;

		// 自动加载标记的面板
		const autoLoadPanel = panels.find(p => p.autoLoad);
		if (autoLoadPanel) {
			await nextTick();
			if (autoLoadPanel.onLoad) {
				autoLoadPanel.onLoad();
			}
		}
	}
});

//控制关闭与开启
let configUIVisible = ref(false);

/**
 * @returns {HTMLElement}
 */
const getCurrentEl = () => {
	//@ts-ignore
	return document.querySelector(".whichWayConfigUIApp");
};

const show = () => {
	configUIVisible.value = true;
	const el = getCurrentEl();
	if (el) {
		el.style.display = "";
	}
	game.pause2();
};

const hide = () => {
	configUIVisible.value = false;
	const el = getCurrentEl();
	if (el) {
		el.style.display = "none";
	}
	game.resume2();
};

const toggle = () => {
	const el = getCurrentEl();
	if (el) {
		el.style.display = el.style.display === "none" ? "" : "none";
	}
	configUIVisible.value = !configUIVisible.value;
};

defineExpose({
	show,
	hide,
	toggle,
});
</script>
<style scoped>
.whichWay-intro {
	max-width: calc(100% - 32px) !important;
	width: calc(100% - 32px) !important;
}

.qr-code,
.baidu-icon {
	max-width: calc(100% - 24px) !important;
}

.backgroundConfigUI > .container > .displayArea {
	width: 85%;
	height: 85%;
	position: absolute;
	float: left;
	top: 13%;
	right: 1.5%;
	border: 1px solid black;
	overflow: auto;
}

.backgroundConfigUI > .container > .displayArea > .extIntro {
	text-align: center;
}

.backgroundConfigUI {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0px;
	left: 0px;
	background-size: 100% 100%;
	background-image: url("/extension/WhichWay/image/ui/bkg7.png");
	z-index: 19;
}

.backgroundConfigUI > .container {
	width: 100%;
	height: 100%;
	background-color: rgba(62, 65, 65, 0.8);
	position: absolute;
}

/* 标题栏 */
.backgroundConfigUI > .container > .titleBox {
	width: 97%;
	height: 8%;
	position: absolute;
	float: left;
	top: 1%;
	left: 50%;
	transform: translate(-50%, 0%);
	/*background-color: rgba(239, 233, 233, 0.8);*/
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.6);
}

/* 标题 */
.backgroundConfigUI > .container > .titleBox > .titleText {
	font-size: larger;
	font-weight: bold;
	color: rgb(255, 255, 255);
	text-align: center;
	font-family: dy_sjzx;
}

/* 关闭按钮 */
.backgroundConfigUI > .container > .titleBox > .ControlCPClose {
	width: 2.5%;
	aspect-ratio: 1 / 1;
	left: 1%;
	position: absolute;
	background-size: 100% 100%;
	background-image: url("/extension/WhichWay/image/ui/back.png");
}

/* 功能菜单 */
.backgroundConfigUI > .container > .functionBox {
	width: 10%;
	height: 88%;
	position: absolute;
	float: left;
	top: 10%;
	left: 1.5%;
	/*background-color: rgba(239, 233, 233, 0.8);*/
}

/* 按钮 */
.backgroundConfigUI > .container > .functionBox > .titleBox {
	width: 100%;
	height: 6%;
	position: relative;
	background-color: rgba(0, 0, 0, 0.5);
	border: 2px solid #837e7e;
	border-radius: 2px;
	margin-top: 10%;
	top: 4%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.backgroundConfigUI > .container > .functionBox > .titleBox > .title {
	position: relative;
	float: left;
	font-size: medium;
	text-shadow:
		-2px -2px 0 rgba(0, 0, 0, 0.3),
		2px -2px 0 rgba(0, 0, 0, 0.3),
		-2px 2px 0 rgba(0, 0, 0, 0.3),
		2px 2px 0 rgba(0, 0, 0, 0.3);
}

.backgroundConfigUI > .container > .functionBox > .titleBox > .imageBox {
	position: relative;
	float: left;
	top: 0;
	left: 0;
	aspect-ratio: 1 / 1;
	display: flex;
	justify-content: center;
	align-items: center;
}

.backgroundConfigUI > .container > .functionBox > .funcButton {
	width: 90%;
	height: 6%;
	left: 5%;
	position: relative;
	background-color: rgba(0, 0, 0, 0.5);
	border: 1px solid #999;
	border-radius: 2px;
	margin-top: 10%;
	top: 5%;
	font-size: medium;
	display: flex;
	justify-content: center;
	align-items: center;
	text-shadow:
		-2px -2px 0 rgba(0, 0, 0, 0.3),
		2px -2px 0 rgba(0, 0, 0, 0.3),
		-2px 2px 0 rgba(0, 0, 0, 0.3),
		2px 2px 0 rgba(0, 0, 0, 0.3);
}

.backgroundConfigUI > .container > .functionBox > title {
	width: 100%;
	height: 6%;
	position: relative;
	background-size: 100% 100%;
	top: 2%;
	font-size: larger;
	display: flex;
	justify-content: center;
	align-items: center;
}

.backgroundConfigUI > .container > .functionBox > .selectedButton_ConfigUI_SJZX {
	color: rgb(26, 194, 253) !important;
}
</style>
