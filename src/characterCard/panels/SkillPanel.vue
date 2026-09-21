<template>
	<div ref="listEl" class="skillList">
		<div v-for="(item, index) in skillItems" :key="index" class="skillWrapper">
			<div class="headWrapper">
				<div class="dragHandle">≡</div>
				<div :class="item.isDerivation ? 'dskillname' : 'skillname'">{{ item.label }}</div>
				<div class="audioBtn" @click="playAudio(item)"></div>
				<div
					v-if="item.frequent !== undefined"
					class="autoSkill"
					:class="item.auto ? 'autoSkillOpened' : 'autoSkillClosed'"
					@click="toggleAuto(item)"
				>
					自动发动
				</div>
			</div>
			<div class="skillInfo" v-html="item.info"></div>
		</div>
	</div>
</template>

<script setup>
/**
 * 技能面板（原 `click.ts` 的 showCharSkill）：
 * 每个技能一个 `.skillWrapper`，其衍生技（`derivation`）另起一个条目、标题用 `.dskillname`。
 * 技能名可拖动排序（`Sortable`，与原实现一致：只改视觉顺序，不落盘）；
 * 「自动发动」写入的是引擎的 `lib.config.autoskilllist`（与其它界面同一份数据）。
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { lib, game, get } from "noname";
import { whichWayAudio } from "../../audio/index.ts";
import Sortable from "../../../lib/Sortable/Sortable.js";

const props = defineProps({ name: { type: String, required: true } });

const listEl = ref(null);
let sortable = null;

/**
 * 技能 + 衍生技拉平成一个列表（顺序与旧实现渲染出的 DOM 一致）。
 * 用 ref 而不是 computed：`lib.config.autoskilllist` 不是响应式的，
 * 「自动发动」的开关状态需要在本组件内自己维护（与旧实现读一次 DOM 状态等价）。
 */
const skillItems = ref([]);

const buildItems = () => {
	const skills = get.character(props.name)?.skills || [];
	/** 自动发动状态：在 autoskilllist 里表示“不自动发动” */
	const frequentOf = skill => {
		const info = get.info(skill);
		if (typeof info?.frequent !== "boolean") return undefined;
		return lib.config.autoskilllist.includes(skill) ? false : info.frequent;
	};
	const infoOf = skill => {
		let str = get.skillInfoTranslation(skill, void 0, false);
		if (lib.translate[`${skill}_append`]) str += `<br>${get.translation(`${skill}_append`)}`;
		return str;
	};
	const result = [];
	for (const skill of skills) {
		const info = get.info(skill);
		const auto = frequentOf(skill);
		result.push({ id: skill, label: get.translation(skill), isDerivation: false, autoSkill: skill, frequent: auto, auto, info: infoOf(skill) });
		const derivation = info?.derivation;
		if (!derivation) continue;
		for (const dskill of Array.isArray(derivation) ? derivation : [derivation]) {
			const dAuto = frequentOf(dskill);
			result.push({
				id: dskill,
				label: get.translation(dskill),
				isDerivation: true,
				//衍生技的试听按钮播的仍是主技能的音（与原实现一致）
				autoSkill: skill,
				frequent: dAuto,
				auto: dAuto,
				info: infoOf(dskill),
			});
		}
	}
	return result;
};

function playAudio(item) {
	whichWayAudio.playSkillAudio(item.autoSkill, props.name);
}

function toggleAuto(item) {
	item.auto = !item.auto;
	if (item.auto) lib.config.autoskilllist.remove(item.id);
	else lib.config.autoskilllist.add(item.id);
	game.saveConfig("autoskilllist", lib.config.autoskilllist);
}

onMounted(() => {
	skillItems.value = buildItems();
	sortable = new Sortable(listEl.value, {
		draggable: ".skillWrapper",
		animation: 150,
		handle: ".dragHandle",
	});
});

onBeforeUnmount(() => {
	sortable?.destroy?.();
	sortable = null;
});
</script>

<style scoped>
/* 列表容器必须撑满面板宽度：条目用的是百分比宽度（90%），父级没有宽度时会被压成一小块 */
.skillList {
	position: relative;
	width: 100%;
}

.skillWrapper {
	position: relative;
	width: 90%;
	background-color: rgba(49, 49, 49, 0.5);
	overflow: hidden;
	box-shadow: 0 0 5px #313131;
	margin-bottom: 5px;
	margin-right: 5px;
	cursor: pointer;
}

.skillWrapper > .skillInfo {
	position: relative;
	width: 100%;
	margin-top: 10px;
	font-size: 20px;
	font-family: SJZX_youyuan;
	margin-bottom: 5px;
}

.skillWrapper > .headWrapper {
	position: relative;
	width: 100%;
	height: 5%;
	margin-top: 5px;
	margin-left: 5px;
	display: flex;
	align-items: center;
}

.skillWrapper > .headWrapper > .autoSkill {
	position: absolute;
	font-size: 20px;
	color: white;
	right: 10px;
	top: 0;
	font-family: SJZX_youyuan;
	height: 25px;
}

.skillWrapper > .headWrapper > .autoSkillOpened {
	background-color: rgba(0, 128, 0, 0.65);
	border: green 2px solid;
}

.skillWrapper > .headWrapper > .autoSkillClosed {
	background-color: rgba(252, 55, 9, 0.65);
	border: red 2px solid;
	color: gray !important;
}

.skillWrapper > .headWrapper > .skillname {
	position: relative;
	font-size: 30px;
	color: white;
	background: linear-gradient(90deg, #005f70, #cebf28);
	border-radius: 20px;
	padding-left: 8px;
	padding-right: 8px;
	margin-right: 5px;
	font-family: SJZX_hanyi;
}

.skillWrapper > .headWrapper > .dskillname {
	position: relative;
	font-size: 30px;
	color: blue;
	background: linear-gradient(90deg, #70000d, #d01eb0);
	border-radius: 20px;
	padding-left: 8px;
	padding-right: 8px;
	margin-right: 5px;
	font-family: SJZX_hanyi;
}

.skillWrapper > .headWrapper > .audioBtn {
	position: relative;
	width: 25px;
	height: 25px;
	background-size: 100% 100%;
	background-image: url("../../../image/ui/Play.png");
	background-color: white;
	border-radius: 50%;
}

.skillWrapper > .headWrapper > .audioBtnPlaying {
	background-image: url("../../../image/ui/Pause.png") !important;
}

.skillWrapper > .headWrapper > .dragHandle {
	position: absolute;
	right: 1%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30px;
	padding: 0 8px;
	cursor: move;
	user-select: none;
	opacity: 0.6;
}

.skillWrapper > .headWrapper > .dragHandle:hover {
	opacity: 1;
}
</style>
