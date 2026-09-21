<template>
	<div class="moduleList">
		<div
			v-for="mod in modules"
			:key="mod.id"
			class="charModulesWrapper"
			:class="{ modulesSelectedWrapper: mod.id === currentId }"
			@click="select(mod.id)"
		>
			<div class="modulesTitle">{{ mod.name }}</div>
			<div class="modulesInfoWrapper">
				<div class="modulesImage" :style="{ backgroundImage: `url(${mod.url})` }"></div>
				<div class="modulesInfo">
					<div v-for="(text, index) in mod.intro" :key="index" class="infoText" v-html="text"></div>
				</div>
			</div>
			<template v-if="mod.effectIntro">
				<div class="modulesEffectTitle">模组效果</div>
				<div class="modulesEffectInfo" v-html="mod.effectIntro"></div>
			</template>
			<div v-if="mod.id === currentId" class="modulesSelectedSJZX"></div>
		</div>
	</div>
</template>

<script setup>
/**
 * 模组面板（原 `click.ts` 的 showCharModules）。
 *
 * 与原实现的差异：旧代码在切换模组后读取 `lib.config.extension_whitherHelm_sjzxAutoReloadByChooseModule`
 * 来决定“弹确认框 + 自动重启”，但该配置项在扩展改名后既没跟着改名、也已不在任何地方注册
 * （读了永远是 undefined），属于死代码；这里改为切换后用 toast 提示需要重启。
 */
import { computed, ref } from "vue";
import { whichWayCharacterModules } from "../../modules/index.js";
import { whichWayToast } from "../../toast/index.ts";

const props = defineProps({ name: { type: String, required: true } });

/** 模组配置存在扩展存储里（非响应式），切换后自增以强制重算 */
const version = ref(0);

const modules = computed(() => {
	version.value;
	const list = whichWayCharacterModules.getCharModules(props.name, false) || {};
	return Object.keys(list).map(id => {
		const info = list[id];
		return {
			id,
			name: info.name,
			url: info.url,
			intro: (Array.isArray(info.intro) ? info.intro : [info.intro]).filter(Boolean),
			effectIntro: toText(info.effect?.intro),
		};
	});
});

const currentId = computed(() => {
	version.value;
	return whichWayCharacterModules.getCharModules(props.name)?.id;
});

function select(id) {
	if (id === currentId.value) return;
	whichWayCharacterModules.setCharModules(props.name, id);
	version.value++;
	whichWayToast.showToast("[驶舰之向] 更换模组后部分效果可能需要重启才能生效");
}

/** `effect.intro` 支持字符串 / 函数 / 数组 */
function toText(intro) {
	if (!intro) return "";
	const list = Array.isArray(intro) ? intro : [intro];
	return list.map(item => (typeof item === "function" ? item() : item)).join("<br>");
}
</script>

<style scoped>
/* 列表容器必须撑满面板宽度：条目用的是百分比宽度（90%），父级没有宽度时会被压成一小块 */
.moduleList {
	position: relative;
	width: 100%;
}

.charModulesWrapper {
	position: relative;
	width: 90%;
	background-color: rgba(143, 143, 143, 0.5);
	overflow: hidden;
	box-shadow: 0 0 5px #313131;
	margin-bottom: 5px;
	margin-right: 5px;
	cursor: pointer;
}

.charModulesWrapper > .modulesTitle {
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

.charModulesWrapper > .modulesInfoWrapper {
	position: relative;
	width: 99.8%;
	max-height: 120px;
	cursor: pointer;
	margin-top: 10px;
	margin-left: 0.2%;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	overflow-y: auto;
}

.charModulesWrapper > .modulesInfoWrapper > .modulesImage {
	position: relative;
	width: 100px;
	height: 100px;
	background-size: 100% 100%;
	overflow-y: hidden;
}

.charModulesWrapper > .modulesInfoWrapper > .modulesInfo {
	position: absolute;
	width: calc(100% - 100px);
	overflow-y: scroll;
	left: 105px;
	margin: 0;
}

.charModulesWrapper > .modulesInfoWrapper > .modulesInfo > .infoText {
	margin: 0;
	position: relative;
	width: 100%;
	font-size: 20px;
	font-family: SJZX_youyuan;
}

.charModulesWrapper > .modulesEffectTitle {
	position: relative;
	width: 100%;
	height: 40px;
	overflow: hidden;
	cursor: pointer;
	font-family: SJZX_youyuan;
	font-size: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 3px solid #000000;
}

.charModulesWrapper.modulesSelectedWrapper {
	background-color: rgb(0 133 255) !important;
	border: 2px solid rgb(255 203 0) !important;
}

.charModulesWrapper > .modulesSelectedSJZX {
	position: absolute;
	bottom: -10px;
	right: -10px;
	width: 100px;
	height: 100px;
	background-image: url("../../../image/ui/skinSelect.png");
	background-size: cover;
	opacity: 0.6;
}

.charModulesWrapper > .modulesEffectInfo {
	position: relative;
	width: 99.6%;
	max-height: 150px;
	overflow: auto;
	cursor: pointer;
	margin: 0.2%;
	font-size: 20px;
	font-family: SJZX_youyuan;
}
</style>
