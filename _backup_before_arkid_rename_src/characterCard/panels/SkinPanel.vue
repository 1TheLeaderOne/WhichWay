<template>
	<div class="skinList">
		<div
			v-for="skin in skins"
			:key="skin.name"
			class="skinListWrapper"
			:class="{ skinListSelectedWrapper: skin.name === current }"
			@click="select(skin)"
		>
			<div class="skinAvatorWrapper">
				<div class="imageSkin" :style="{ backgroundImage: `url(${skin.path})` }"></div>
			</div>
			<div class="skinTextWrapper"><div class="skinText">{{ skin.name }}</div></div>
			<div v-if="skin.name === current" class="skinSelectedSJZX"></div>
		</div>
	</div>
</template>

<script setup>
/**
 * 皮肤面板（原 `click.ts` 的 showSkinChar）：
 * 选中后写入皮肤配置并通知外壳刷新立绘 / 动皮与场上玩家（`skinChange` 事件）。
 */
import { computed, ref } from "vue";
import { whichWaySkin } from "../../skin/index.ts";

const props = defineProps({ name: { type: String, required: true } });
const emit = defineEmits(["skinChange"]);

const skins = computed(() => {
	const list = whichWaySkin.getCharacterSkin(props.name) || {};
	return Object.keys(list).map(name => ({ name, path: list[name] }));
});

/** 当前皮肤用 ref 维护：皮肤配置存在扩展存储里，不是响应式数据，选完要自己更新高亮 */
const current = ref(whichWaySkin.getCurentSkin(props.name));

function select(skin) {
	if (skin.name === current.value) return;
	//写入失败（皮肤数据过期、找不到该文件等）时就别改高亮，否则界面会"假装"切换成功
	if (!whichWaySkin.setCharacterSkin(props.name, skin.name)) return;
	current.value = skin.name;
	emit("skinChange", { skinName: skin.name, path: skin.path });
}
</script>

<style scoped>
/* 列表容器必须撑满面板宽度：条目用的是百分比宽度（70%），父级没有宽度时会被压成一小块 */
.skinList {
	position: relative;
	width: 100%;
}

.skinListWrapper {
	position: relative;
	width: 70%;
	height: 100px;
	background-color: rgba(143, 143, 143, 0.5);
	overflow: hidden;
	box-shadow: 0 0 5px #313131;
	margin-bottom: 5px;
	margin-right: 29%;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.skinListWrapper > .skinListSelectedWrapper {
	background-color: rgb(0 133 255) !important;
	border: 2px solid rgb(255 203 0) !important;
}

.skinListWrapper.skinListSelectedWrapper {
	background-color: rgb(0 133 255) !important;
	border: 2px solid rgb(255 203 0) !important;
}

.skinListWrapper > .skinSelectedSJZX {
	position: absolute;
	bottom: -10px;
	right: -10px;
	width: 50px;
	height: 50px;
	background-image: url("../../../image/ui/skinSelect.png");
	background-size: cover;
	opacity: 0.6;
}

.skinListWrapper > .skinTextWrapper {
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.skinListWrapper > .skinTextWrapper > .skinText {
	font-size: 30px;
	font-family: SJZX_youyuan;
}

.skinListWrapper .skinAvatorWrapper {
	height: 90%;
	aspect-ratio: 0.7/1;
	display: block;
	border-radius: 7px;
	transition: background-image 0s;
	position: relative;
	margin-left: 5px;
}

.skinListWrapper .skinAvatorWrapper > .imageSkin {
	z-index: 34;
	width: 100%;
	height: 100%;
	display: block;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 7px;
	transition: background-image 0s;
	border: none;
	box-shadow: 0px 0px 0px 0px;
}
</style>
