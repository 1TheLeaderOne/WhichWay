<template>
	<div class="pos-setting">
		<!-- 左：搜索 + 干员武将卡列表（每张卡 = 干员名 + 全部皮肤名 + 每张是否调过） -->
		<div class="picker-col">
			<charPicker v-model="selected" :names="names" @filtered="candidates = $event">
				<template #item="{ char, active, pick }">
					<div class="listCard" :class="{ listCardActive: active }" @click="pick(char)">
						<div class="listHead">
							<div class="listName">{{ charDisplayName(char) }}</div>
							<div class="listId">{{ char }}</div>
						</div>
						<!-- 皮肤清单就在卡上：点这一行选皮肤。`@click.stop` 是必须的——
						     否则冒泡到卡片本体会再走一次 `pick(char)`，等于白选一次干员。 -->
						<div class="listSkins">
							<div
								v-for="skin in skinsOf(char)"
								:key="skin.name"
								class="listSkin"
								:class="{ listSkinActive: active && skin.name === currentSkin }"
								@click.stop="chooseSkin(char, skin.name)"
							>
								<div class="listSkinName">{{ skin.name }}</div>
								<div class="skinFlag" :class="{ skinFlagOn: skin.modified }">{{ skin.modified ? "已调整" : "未调整" }}</div>
							</div>
							<div v-if="!skinsOf(char).length" class="listSkinEmpty">无皮肤数据</div>
						</div>
					</div>
				</template>
			</charPicker>
		</div>

		<!-- 右：工具行 + 皮肤行 + 预览舞台（左边预览卡、右边读数） -->
		<div class="stage-col">
			<div class="toolRow">
				<div class="toolBtn" :class="{ toolBtnActive: dragOn }" @click="toggleDrag">{{ dragOn ? "关闭拖拽调整" : "开启拖拽调整" }}</div>
				<div class="toolBtn" @click="copyPosJson">复制 pos.json</div>
				<div class="toolHint">右键{{ dragOn ? "" : " / 长按两秒" }}切到下一个干员</div>
			</div>

			<div class="skinRow">
				<div v-for="skin in skinList" :key="skin.name" class="skinBtn" :class="{ skinBtnActive: skin.name === currentSkin }" @click="currentSkin = skin.name">
					{{ skin.name }}
				</div>
			</div>

			<div
				class="stage"
				:class="{ stageDragging: dragOn }"
				@contextmenu.prevent="nextChar"
				@pointerdown="onStagePointerDown"
				@pointerup="onStagePointerUp"
				@pointerleave="onStagePointerUp"
				@pointercancel="onStagePointerUp"
			>
				<!-- 立绘节点：mountPortrait 在这里生成与场上头像**同一套**的两层 DOM，画法与裁切也与场上一致 -->
				<div ref="cardEl" class="previewCard" @pointerup="posVersion++" @wheel.passive="posVersion++"></div>
				<div class="stageSide">
					<div class="sideLine">{{ displayName }}</div>
					<div class="sideLine">{{ selected }}</div>
					<div class="sideLine">{{ currentSkin }}</div>
					<div class="sideLine">x {{ pos.x.toFixed(3) }}</div>
					<div class="sideLine">y {{ pos.y.toFixed(3) }}</div>
					<div class="sideLine">scale {{ pos.scale.toFixed(2) }}</div>
					<div class="sideTip">位置设定按「干员 + 皮肤」存进 json/pos.json，改动即时落盘（松手后约 300ms）。</div>
					<div class="sideTip">预览与场上同一套画法：内层是完整原图的画布，框只裁出其中一块，拖出框外的部分游戏里同样看不到。</div>
					<div class="sideTip">可拖范围 = 原图比框多出来的那一截（横图在 `x` 上余量最大）。拖到原图边缘就停住，读数跟着停 ≠ 拖拽失灵。</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * 「皮肤位置调整」开发面板（仅开发者模式在 `main.vue` 注册）。
 *
 * 干员立绘/皮肤的位置与缩放存在 `json/pos.json`，键是「干员id + 皮肤名」，但玩家侧的「皮肤拖拽」
 * 只能在**场上有该干员**时拖到他，逐个干员调构图就得先开局、还不一定凑得出人。这里给开发者一条捷径：
 * 左列每张干员卡列出他的全部皮肤与「这张调过没有」，点皮肤即选中 → 右侧预览重画 → 拖两下 → 右键换下一个，
 * 全程不依赖场上有没有这个人。
 *
 * 预览走的是 `mountPortrait()`：与场上头像**同一套两层 DOM、同一份位置设定、同一种裁切**，
 * 所以在这里调好的位置，进游戏就是看到的效果。内层是一张装着**完整原图**的画布，框只是开在它上面的一扇窗
 * ——**框外的部分看不到**（游戏里同样看不到），拖拽就是把想露出的那块拖进窗里，不是预览整张原图；
 * 拖到边界会硬停在原图自己的边缘（再往外只剩背板），所以拖过头时读数会停住。
 * 这里绝不做任何「放开裁切/让整图可见」的近似渲染，那种改法会让显示位置与真实效果整体错位，
 * 还会多出一份副本，调出来的位置就不可信了。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { whichWayFile } from "../../file.js";
import { whichWaySkin } from "../../skin/index.ts";
import { mountPortrait, isArkOperator } from "../../skin/avatarBackground.js";
import { enablePortraitDrag } from "../../skin/portraitDrag.js";
import { serializePosFile, DEFAULT_PORTRAIT_SCALE, DEFAULT_SKIN_NAME } from "../../skin/portraitPos.js";
import { whichWayToast } from "../../toast/index.ts";
import { charDisplayName } from "../charSearch.js";
import CharPicker from "./charPicker.vue";

/**
 * 候选：全部驶舰之向干员里**能被调整的**那部分。
 *
 * 判据与绘制侧共用 `avatarBackground.ts` 的 `isArkOperator`：只有明日方舟实装干员才套两层背景，
 * 也就只有他们有位置设定可言。列进非方舟角色会白选一个（画是画得出来，但游戏里那个角色走引擎原流程，
 * 调了 pos 也不会有效果），所以压根不进列表。
 */
const names = computed(() => window.whichWaySave?.allCharacters?.filter(isArkOperator) ?? []);
const selected = ref(names.value[0] || "");
/** 当前搜索结果的干员列表（轮切按它走，而不是按全量表） */
const candidates = ref([]);
/** 中文名（干员id 单独一行展示，方便直接拿去 pos.json 里查） */
const displayName = computed(() => (selected.value ? charDisplayName(selected.value) : "（未选择干员）"));

/** 拖完把读数与「已调整」刷一下：位置表不是响应式数据，靠松手/滚轮这些时机自增来重读 */
const posVersion = ref(0);

/**
 * `pos.json` 里是否已有该「干员 + 皮肤」的设定。
 *
 * 只能查键在不在：`getPos` 对缺失的条目是**返回默认值、不写库**，所以读一次值并不代表他调过，
 * 拿返回值当「已调整」会让每个干员的经典形象都显示成调过。
 */
function isAdjusted(charId, skin) {
	const byChar = whichWaySkin.posData[charId];
	return byChar != null && Object.prototype.hasOwnProperty.call(byChar, skin);
}

/**
 * 某干员的皮肤清单：`经典形象` 用立绘目录的图，其余取自皮肤数据。
 *
 * 写成函数而不是只给选中项用的 `computed`：左列是**所有**干员的卡，每张都要渲染自己的皮肤行。
 * 函数里读 `posVersion`，模板渲染时这条依赖就记进了本组件的渲染 effect，拖完松手整列会一起重算。
 */
function skinsOf(charId) {
	posVersion.value;
	if (!charId) return [];
	const skins = whichWaySkin.getCharacterSkin(charId) || {};
	const list = [];
	//皮肤数据本身第一项就是「经典形象」（`onInit` 里用同一条立绘路径补进 `skins` 的），
	//无条件再前置一张就会出现两个同名条目；只有数据还没建好时才兜一张。
	if (!skins[DEFAULT_SKIN_NAME]) list.push({ name: DEFAULT_SKIN_NAME, path: whichWayFile.getCharacterPortraitPath(charId), modified: isAdjusted(charId, DEFAULT_SKIN_NAME) });
	for (const name in skins) list.push({ name, path: skins[name], modified: isAdjusted(charId, name) });
	return list;
}

/** 选中干员的皮肤清单（右侧皮肤行与预览取图都用它） */
const skinList = computed(() => skinsOf(selected.value));
const currentSkin = ref(DEFAULT_SKIN_NAME);

/** 先选皮肤再换干员：`currentSkin` 先落定，下面的 `watch(selected)` 发现该皮肤在新干员名下确实存在就不再复位 */
function chooseSkin(charId, skin) {
	currentSkin.value = skin;
	if (selected.value !== charId) selected.value = charId;
}

/**
 * 切干员时的复位：拿上一个干员的皮肤名去查新干员会查不到（画不出来），所以默认回到「经典形象」。
 * 例外是 `chooseSkin`——那条路径是先指定皮肤再指定干员，且这张皮肤确实属于新干员，不能给抹掉。
 */
watch(selected, () => {
	if (!skinList.value.some(item => item.name === currentSkin.value)) currentSkin.value = DEFAULT_SKIN_NAME;
});

/** 轮切/点选换人后把该干员的卡滚进可视区：左列卡足够高，选中项跑出视野时读数与图会各看一半 */
watch(selected, async () => {
	await nextTick();
	document.querySelector(".listCardActive")?.scrollIntoView({ block: "nearest" });
});

const cardEl = ref(null);
/** 拖拽的还原函数：立绘节点上装着指针/滚轮监听，换皮肤或退出面板都要先拆掉 */
let dragTeardown;
const dragOn = ref(false);

const pos = computed(() => {
	posVersion.value;
	if (!selected.value) return { x: 0, y: 0, scale: DEFAULT_PORTRAIT_SCALE };
	return whichWaySkin.getPortraitPos(selected.value, currentSkin.value);
});

/** 把当前干员的当前皮肤按场上那套两层 DOM 画进预览节点；开着拖拽就重新装一次（拖拽记的是皮肤键） */
async function repaint() {
	await nextTick();
	const node = cardEl.value;
	if (!node || !selected.value) return;
	const skin = skinList.value.find(item => item.name === currentSkin.value);
	dragTeardown?.();
	dragTeardown = void 0;
	if (!skin?.path) {
		whichWayToast.showToast(`[驶舰之向] 预览绘制失败：找不到 ${selected.value} 的 ${currentSkin.value} 图片`, 3000);
		return;
	}
	if (!mountPortrait(node, skin.path)) {
		whichWayToast.showToast(`[驶舰之向] 预览绘制失败：找不到 ${selected.value} 的 ${currentSkin.value} 图片`, 3000);
		return;
	}
	if (dragOn.value) dragTeardown = enablePortraitDrag(node);
}

watch([selected, currentSkin], repaint);
watch(dragOn, async () => {
	//开关拖拽不换图，所以不重画，只拆/装监听
	dragTeardown?.();
	dragTeardown = void 0;
	if (!dragOn.value) return;
	await nextTick();
	if (!cardEl.value) return;
	dragTeardown = enablePortraitDrag(cardEl.value);
	if (!dragTeardown) {
		whichWayToast.showToast("[驶舰之向] 当前预览不是驶舰之向的干员立绘，无法拖拽", 3000);
		dragOn.value = false;
	}
});

function toggleDrag() {
	dragOn.value = !dragOn.value;
}

/** 轮切：按当前搜索结果取下一个（到底回绕） */
function nextChar() {
	const list = candidates.value.length ? candidates.value : names.value;
	if (!list.length) return;
	const index = list.indexOf(selected.value);
	//列表变了（刚搜过关键字）时 selected 可能不在其中，index 为 -1 → 从第一个开始
	selected.value = list[index + 1 >= list.length ? 0 : index + 1];
}

/**
 * 长按舞台两秒切下一个：开着拖拽时长按是要拿来拖的，所以这时不启用。
 * 只在「按下不动」时触发，一旦移动（那就是在拖或是在划）立刻取消计时。
 */
let holdTimer;
function onStagePointerDown(event) {
	if (dragOn.value || event.button !== 0) return;
	holdTimer = setTimeout(nextChar, 2000);
}
function onStagePointerUp() {
	clearTimeout(holdTimer);
	holdTimer = void 0;
}

/** 复制 `pos.json` 的完整内容（与落盘那份同形：`{ schema, data }`） */
async function copyPosJson() {
	whichWaySkin.flushPortraitPos();
	const text = serializePosFile();
	try {
		await navigator.clipboard.writeText(text);
	} catch (e) {
		//剪贴板 API 需要安全上下文，file:// 之类的旧环境会 reject；退回到临时 textarea + execCommand
		const box = document.createElement("textarea");
		box.value = text;
		box.style.position = "fixed";
		box.style.opacity = "0";
		document.body.appendChild(box);
		box.select();
		const ok = document.execCommand("copy");
		box.remove();
		if (!ok) {
			console.log("[whichWayPosEditor] 复制失败，内容如下：\n", text);
			whichWayToast.showToast("[驶舰之向] 复制失败，已打印到控制台", 3000);
			return;
		}
	}
	whichWayToast.showToast(`[驶舰之向] 已复制 pos.json（${Object.keys(whichWaySkin.posData).length} 名干员）`, 2500);
}

onBeforeUnmount(() => {
	clearTimeout(holdTimer);
	dragTeardown?.();
	whichWaySkin.flushPortraitPos();
});

repaint();
</script>

<style scoped>
/**
 * 本面板每个 div 都必须显式写 `position`（下面几乎每条规则都带 `position: relative`），这不是啰嗦：
 * 引擎全局有 `div { display:inline-block; position:absolute; transition:all .5s }`
 * （`apps/core/layout/default/layout.css:31`），漏写的 div 会被强制绝对定位、脱离 flex/normal flow，
 * 又因为没有 `left/top` 而全部落回各自的静态位置 ⇒ 表现为「一排文字叠成一团」。
 * 同理：竖排的容器都要显式写 `display: flex; flex-direction: column`，否则全局那条
 * `display: inline-block` 会让子项横排挤在一行。
 */
.pos-setting {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	gap: 12px;
	padding: 12px;
	box-sizing: border-box;
	color: #f5f5f5;
}

.picker-col {
	position: relative;
	width: 54%;
	height: 100%;
	min-width: 0;
}

.stage-col {
	position: relative;
	width: 46%;
	height: 100%;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

/* ===== 左列：干员卡（charPicker 的 `#item` 插槽内容） ===== */
.listCard {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 5px;
	width: 30cqw;
	max-width: 100%;
	padding: 8px;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.45);
	border: 1px solid #888;
	border-radius: 6px;
	cursor: pointer;
	user-select: none;
}

.listCard:hover {
	background: rgba(64, 158, 255, 0.22);
}

.listCardActive {
	border-color: #1ac2fd;
	box-shadow: 0 0 6px rgba(26, 194, 253, 0.6);
}

.listHead {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.listName {
	position: relative;
	font-size: 16px;
	word-break: break-all;
}

.listId {
	position: relative;
	font-size: 12px;
	color: #bbb;
	word-break: break-all;
}

.listSkins {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 3px;
}

.listSkin {
	position: relative;
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 3px 6px;
	background: rgba(0, 0, 0, 0.35);
	border: 1px solid #6d6d6d;
	border-radius: 4px;
}

.listSkin:hover {
	background: rgba(64, 158, 255, 0.3);
}

.listSkinActive {
	border-color: #1ac2fd;
	background: rgba(0, 151, 218, 0.45);
}

.listSkinName {
	position: relative;
	flex: 1 1 auto;
	min-width: 0;
	font-size: 13px;
	word-break: break-all;
}

/* 「已调整」= pos.json 里有这条「干员 + 皮肤」的设定，一眼看出哪些还没调过 */
.skinFlag {
	position: relative;
	flex: none;
	font-size: 11px;
	color: #9a9a9a;
	border: 1px solid #666;
	border-radius: 3px;
	padding: 0 4px;
}

.skinFlagOn {
	color: #1ac2fd;
	border-color: #1ac2fd;
}

.listSkinEmpty {
	position: relative;
	font-size: 12px;
	color: #999;
}

/* ===== 右列：工具行 + 皮肤行 + 预览舞台 ===== */
.toolRow {
	position: relative;
	display: flex;
	align-items: center;
	gap: 10px;
	flex: none;
}

.toolBtn {
	position: relative;
	padding: 8px 14px;
	background: rgba(0, 0, 0, 0.5);
	border: 1px solid #888;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
	font-size: 15px;
}

.toolBtn:hover {
	background: rgba(64, 158, 255, 0.3);
}

.toolBtnActive {
	background: #0097da;
	border-color: #1ac2fd;
}

.toolHint {
	position: relative;
	font-size: 14px;
	color: #bbb;
	margin-left: auto;
}

.skinRow {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	flex: none;
	max-height: 90px;
	overflow: auto;
}

.skinBtn {
	position: relative;
	padding: 4px 10px;
	font-size: 14px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid #777;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
}

.skinBtnActive {
	background: #0097da;
	border-color: #1ac2fd;
}

.stage {
	position: relative;
	flex: 1 1 auto;
	min-height: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20px;
	background: rgba(0, 0, 0, 0.35);
	border: 1px solid #666;
	border-radius: 6px;
	padding: 12px;
	box-sizing: border-box;
}

/* 开着拖拽时把背景提亮一点，一眼看出现在是在「拖位置」而不是在看图 */
.stageDragging {
	background: rgba(26, 194, 253, 0.12);
	border-color: #1ac2fd;
}

/* 与场上武将卡同比例（引擎头像 114x174）；两层背景是 inset:0 绝对定位，所以这里必须有尺寸与定位。
   `overflow: hidden` 就是游戏内那圈裁切，保持裁切才谈得上「所见即所得」：别放开，也别改成 contain。 */
.previewCard {
	position: relative;
	width: 200px;
	aspect-ratio: 114 / 174;
	border-radius: 8px;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.4);
	flex: none;
}

/* 必须是 flex 列：全局规则还给 div 写了 `display:inline-block`，不 blockify 的话读数会横排挤在一行 */
.stageSide {
	position: relative;
	display: flex;
	flex-direction: column;
	min-width: 210px;
	align-self: center;
}

.sideLine {
	position: relative;
	font-size: 16px;
	margin-bottom: 4px;
	word-break: break-all;
}

.sideTip {
	position: relative;
	font-size: 13px;
	color: #bbb;
	margin-top: 10px;
	line-height: 1.5;
}
</style>
