<template>
	<div ref="listEl" class="skillList">
		<div v-for="(item, index) in skillItems" :key="index" class="skillWrapper">
			<div class="headWrapper">
				<div class="dragHandle">≡</div>
				<div class="skillname">{{ item.label }}</div>
				<div class="audioBtn" :class="{ audioBtnPlaying: isSkillPlaying(item.id) }" @click="toggleAudio(item.id)"></div>
				<!-- 台词开关：与试听按钮并排；没有台词的武将也能打开（面板里显示「无台词」，语音仍可试听） -->
				<div class="lineBtn" :class="{ lineBtnOpened: item.showLines }" @click="toggleLines(item)"></div>
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

			<!-- 衍生技能：挂在所属技能条目内部，不再另起一个顶层条目 -->
			<div v-if="item.derivations.length" class="derivationBox">
				<div
					class="derivationTitle"
					:class="{ derivationTitleFolded: item.foldDerivations }"
					@click="item.foldDerivations = !item.foldDerivations"
				>
					衍生技能
				</div>
				<div v-show="!item.foldDerivations" class="derivationBody">
					<div v-for="d in item.derivations" :key="d.id" class="derivationItem">
						<div class="headWrapper">
							<div class="dskillname">{{ d.label }}</div>
							<!--试听按钮播的仍是主技能的音（与原实现一致）-->
							<div class="audioBtn" :class="{ audioBtnPlaying: isSkillPlaying(item.id) }" @click="toggleAudio(item.id)"></div>
							<div
								v-if="d.frequent !== undefined"
								class="autoSkill"
								:class="d.auto ? 'autoSkillOpened' : 'autoSkillClosed'"
								@click="toggleAuto(d)"
							>
								自动发动
							</div>
						</div>
						<div class="derivationInfo" v-html="d.info"></div>
					</div>
				</div>
			</div>

			<!-- 衍生卡牌：装备技（lib.skill[x].equipSkill）有对应的装备牌，用引擎的卡牌按钮画出牌面 -->
			<div v-if="item.cards.length" class="derivationBox derivationCardBox">
				<div class="derivationTitle" :class="{ derivationTitleFolded: item.foldCards }" @click="item.foldCards = !item.foldCards">
					衍生卡牌
				</div>
				<!--折叠用 v-show 而不是 v-if：牌面是引擎命令式塞进挂载点的，v-if 会把挂载点连同牌面一起销毁 -->
				<div v-show="!item.foldCards" class="derivationBody">
					<div v-for="c in item.cards" :key="c.id" class="derivationCardItem">
						<div class="derivationCards buttons" :ref="el => setCardHost(item.id + '|' + c.id, el)"></div>
						<div class="cardText">
							<div class="cardName">{{ c.label }}</div>
							<div class="derivationInfo" v-html="c.info"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- 台词界面：由 head 上的台词按钮开合；没有台词也保留这个入口（显示「无台词」），
			     因为「有没有台词文本」与「有没有配音文件」是两件事，后者仍要能逐条试听 -->
			<div v-show="item.showLines" class="derivationBox lineBox">
				<div v-if="!item.audioEntries.length" class="lineItem lineEmpty">无台词</div>
				<div v-for="entry in item.audioEntries" :key="entry.index" class="lineItem">
					<div
						class="linePlayBtn"
						:class="{ linePlayBtnPlaying: isLinePlaying(item.id, entry.index) }"
						@click="toggleLine(item.id, entry.index)"
					></div>
					<span v-if="item.audioEntries.length > 1" class="lineIndex">{{ entry.index + 1 }}.</span>
					<span v-if="entry.text" class="lineText" v-html="entry.text"></span>
					<span v-else class="lineText lineEmptyText">无台词</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { lib } from "noname";

/**
 * 「技能 → 装备牌」反查表的缓存。
 * `lib.card` 只记了「这张牌带哪些技能」（`lib.card[id].skills`），没有反向索引，
 * 所以要扫一遍全表；牌堆在一次游戏里不会变，故放在模块级、只扫一次。
 */
let skillToCard = null;
const getSkillToCard = () => {
	if (skillToCard) return skillToCard;
	skillToCard = new Map();
	for (const cardId in lib.card) {
		const skills = lib.card[cardId]?.skills;
		if (!Array.isArray(skills)) continue;
		for (const skill of skills) {
			if (!skillToCard.has(skill)) skillToCard.set(skill, cardId);
		}
	}
	return skillToCard;
};
</script>

<script setup>
/**
 * 技能面板（原 `click.ts` 的 showCharSkill）：
 * 每个技能一个 `.skillWrapper`；其衍生技（`derivation`）渲染在该条目**内部**的 `.derivationBox` 里。
 * 衍生技中带 `equipSkill` 的表示它有一张对应的装备牌（如格拉尼【飞驹】的四匹马），
 * 这类改为用 `ui.create.buttonPresets.card`（经 `ui.create.buttons`）画成真正的卡牌、放进标注「衍生卡牌」的独立 DOM。
 * 技能名可拖动排序（`Sortable`，与原实现一致：只改视觉顺序，不落盘）；
 * 「自动发动」写入的是引擎的 `lib.config.autoskilllist`（与其它界面同一份数据）。
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
//lib 在上面那个 script 里（反查表要用），同一个 SFC 的两个 script 共用一份模块作用域
import { game, ui, get } from "noname";
import { whichWayAudio } from "../../audio/index.ts";
import { whichWaySkin } from "../../skin/index.ts";
import Sortable from "../../../lib/Sortable/Sortable.js";

const props = defineProps({ name: { type: String, required: true } });

const listEl = ref(null);
let sortable = null;

/** 每个技能一条，衍生内容（技能 / 卡牌）挂在条目的 derivations / cards 里 */
const skillItems = ref([]);
/**
 * 当前正在试听的那一条（`{ skill, name, line? }`）。
 *
 * 播放实例由音频模块持有（`whichWayAudio`），这里只是它的**响应式镜像**：
 * 用来驱动 Play ⇄ Pause 图标与「哪一条在响」的高亮。两者必须同源，
 * 所以订阅音频模块的状态变化来同步，而不是各自记一份。
 */
const activePreview = ref(null);
let offPreviewChange = null;
/** 每张衍生卡牌的挂载点：卡牌本体由引擎命令式生成，Vue 只负责留好空位 */
const cardHosts = new Map();
const setCardHost = (key, el) => {
	if (el) cardHosts.set(key, el);
	else cardHosts.delete(key);
};

/** 自动发动状态：在 autoskilllist 里表示“不自动发动” */
const frequentOf = skill => {
	const info = lib.skill[skill];
	if (typeof info?.frequent !== "boolean") return undefined;
	return lib.config.autoskilllist.includes(skill) ? false : info.frequent;
};
const infoOf = skill => {
	let str = get.skillInfoTranslation(skill, void 0, false);
	if (lib.translate[`${skill}_append`]) str += `<br>${get.translation(`${skill}_append`)}`;
	return str;
};

/**
 * 衍生条目该写成技能还是画成卡牌：
 * - `equipSkill` 的技能有配套装备牌，按反查表取那张牌；查不到牌（牌包被关等）就退回技能，不丢信息。
 * - 有些 `derivation` 直接写的就是卡牌 id（如老实的【拾剑】→ 剑助），这种本来就是装备牌。
 * - 其余按衍生技能处理。
 */
const classifyDerivation = name => {
	if (lib.skill[name]?.equipSkill) {
		const cardId = getSkillToCard().get(name);
		return cardId ? { type: "card", id: cardId } : { type: "skill", id: name };
	}
	return lib.card[name] ? { type: "card", id: name } : { type: "skill", id: name };
};

/**
 * 技能台词：与武将卡、悬停面板走同一条链路（`get.Audio.skill(...).textList`），
 * 台词本身就是 `lib.translate` 里 `#[音频地址]` 的值。
 *
 * 返回的是**和音频文件一一对应的条目**（而不是只筛掉空项）：面板要给每条语音配一个播放键，
 * 「有音频、没写台词」的技能（如斗士塔露拉之外的多数干员）也必须能逐条试听，
 * 所以 `text` 可以为空，此时界面显示「无台词」。
 *
 * 关键点：解析要带上**当前皮肤**（与本体卡 `ui/click/index.js:4039` 的传参一致）——
 * 引擎会拿 `name + skin.name + tempname` 去匹配技能的 `audioname`，换皮台词靠的就是它。
 * 扩展武将走本扩展的皮肤系统（默认「经典形象」）；非扩展武将（样式开关设成「所有角色」
 * 时会出现在这里）交回自身名字，等同于「没有额外换皮」。
 *
 * 台词能不能取到还取决于音频地址：`applySkillAudio` 把 `audio` 改写成
 * `ext:WhichWay/audio/{语言}:N` 之后，地址变成 `ext:WhichWay/audio/{语言}/{技能}{序号}`，
 * 对应的 `#地址` 键由音频模块的 `mirrorSkillLines` 从 `#技能名N` 镜像而来。
 */
const audioEntriesOf = skill => {
	const skinName = window.whichWaySave?.hasChar?.(props.name) === true ? whichWaySkin.getCurentSkin(props.name) : props.name;
	const player = { name: props.name, skin: { name: skinName }, tempname: [skinName] };
	try {
		const audio = get.Audio.skill({ skill, player });
		//audioList 是「一个文件一条」的完整清单（file + 该条对应的 text），序号即它的下标
		return audio.audioList.map((entry, index) => ({
			index,
			file: entry.file,
			text: typeof entry.text === "string" && entry.text.length > 0 ? entry.text : "",
		}));
	} catch (e) {
		//技能被别的扩展删掉等情况：台词拿不到属正常，不要打断整个面板
		console.warn(`[whichWayCharacterCard] 读取技能 ${skill} 的台词失败：`, e);
		return [];
	}
};

const buildItems = () => {
	const skills = get.character(props.name)?.skills || [];
	const result = [];
	for (const skill of skills) {
		const auto = frequentOf(skill);
		const item = {
			id: skill,
			label: get.translation(skill),
			frequent: auto,
			auto,
			info: infoOf(skill),
			derivations: [],
			cards: [],
			audioEntries: audioEntriesOf(skill),
			//台词界面默认收起，由 head 上的台词按钮开合
			showLines: false,
			//衍生区默认展开，点标题折叠
			foldDerivations: false,
			foldCards: false,
		};
		const derivation = lib.skill[skill]?.derivation;
		const list = Array.isArray(derivation) ? derivation : derivation ? [derivation] : [];
		for (const name of list) {
			const kind = classifyDerivation(name);
			if (kind.type === "card") {
				item.cards.push({ id: kind.id, label: get.translation(kind.id), info: infoOf(kind.id) });
				continue;
			}
			const dAuto = frequentOf(name);
			item.derivations.push({ id: name, label: get.translation(name), frequent: dAuto, auto: dAuto, info: infoOf(name) });
		}
		result.push(item);
	}
	return result;
};

/**
 * 出卡牌：`game.createCard` 生成的**原件挂在 `ui.special` 上**（不是屏幕外的临时对象），
 * 引擎的 card 按钮预设会 `copy()` 出一份放进面板，所以原件用完必须 remove，否则每开一次面板就攒一批幽灵牌。
 * 传 noclick：这些牌只是展示，点了不该参与任何结算。
 */
const renderCards = () => {
	for (const item of skillItems.value) {
		for (const card of item.cards) {
			const host = cardHosts.get(`${item.id}|${card.id}`);
			if (!host || host.hasChildNodes()) continue;
			const node = game.createCard(card.id);
			ui.create.buttons([node], "card", host, true);
			node.remove();
		}
	}
};

function toggleLines(item) {
	item.showLines = !item.showLines;
}

/**
 * 播放 / 停止一条语音。
 *
 * 「单独播放某条」要按序号精确取文件，因此不走 `game.tryAudio`（那个随机取一条），
 * 而是由音频模块的 `playSkillLineAudio` 取 `audioList[index]` 后直接播。
 * 在线配音（PRTS）没有稳定的"第几条"映射，那边会退化成随机一条。
 */
function toggleLine(skill, index) {
	const target = activePreview.value;
	//再点同一条 = 停
	if (target && target.skill === skill && target.line === index) {
		whichWayAudio.stopPreviewAudio();
		return;
	}
	whichWayAudio.playSkillLineAudio(skill, props.name, index, audioPlayerOf());
}

/** 传给引擎的 player 形态：皮肤名要带上，换皮台词/换皮配音都靠它 */
function audioPlayerOf() {
	const skinName = window.whichWaySave?.hasChar?.(props.name) === true ? whichWaySkin.getCurentSkin(props.name) : props.name;
	return { name: props.name, skin: { name: skinName }, tempname: [skinName] };
}

/** 顶部那枚试听按钮：播整个技能（随机一条），再点即停 */
function toggleAudio(skill) {
	if (isSkillPlaying(skill)) {
		whichWayAudio.stopPreviewAudio();
		return;
	}
	whichWayAudio.playSkillAudio(skill, props.name);
}

function isSkillPlaying(skill) {
	//正在播放该技能的某一条时，顶部按钮同样显示为「播放中」：两者共用同一个播放通道，
	//同时只可能响一条，图标状态必须跟着走，否则会出现「两处都亮」的错觉
	return activePreview.value?.skill === skill;
}

function isLinePlaying(skill, index) {
	const target = activePreview.value;
	return target?.skill === skill && target?.line === index;
}

function toggleAuto(item) {
	item.auto = !item.auto;
	if (item.auto) lib.config.autoskilllist.remove(item.id);
	else lib.config.autoskilllist.add(item.id);
	game.saveConfig("autoskilllist", lib.config.autoskilllist);
}

onMounted(async () => {
	skillItems.value = buildItems();
	//卡牌要等 Vue 把空位渲染出来才能往里塞
	await nextTick();
	renderCards();
	sortable = new Sortable(listEl.value, {
		draggable: ".skillWrapper",
		animation: 150,
		handle: ".dragHandle",
	});
	//试听状态只在「本面板的干员」上镜像：别人的试听（配音设置页）不应点亮这里的图标
	offPreviewChange = whichWayAudio.onPreviewChange(() => {
		const target = whichWayAudio.getPreviewTarget();
		activePreview.value = target && target.name === props.name ? target : null;
	});
});

onBeforeUnmount(() => {
	sortable?.destroy?.();
	sortable = null;
	cardHosts.clear();
	offPreviewChange?.();
	offPreviewChange = null;
	//面板关掉就没人能再点「停止」了，顺手把还在响的试听停掉（避免离开界面后声音一直循环）
	whichWayAudio.stopPreviewAudio();
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

.skillWrapper > .headWrapper > .audioBtn {
	position: relative;
	width: 25px;
	height: 25px;
	background-size: 100% 100%;
	background-image: url("../../../image/ui/Play.png");
	background-color: white;
	border-radius: 50%;
	cursor: pointer;
}

/* 暂停态：图标换成 Pause.png（点下去就是「正在响」，再点即停） */
.skillWrapper > .headWrapper > .audioBtnPlaying {
	background-image: url("../../../image/ui/Pause.png") !important;
}

/* 台词开关：与试听键同一尺寸/位置逻辑，图标用 line.png（白线稿，透明底不需要白色圆底） */
.skillWrapper > .headWrapper > .lineBtn {
	position: relative;
	width: 25px;
	height: 25px;
	margin-left: 6px;
	background-size: 100% 100%;
	background-image: url("../../../image/ui/line.png");
	background-repeat: no-repeat;
	background-position: center;
	cursor: pointer;
	opacity: 0.7;
	/* 与折叠标题的 +/− 保持同一套动效节奏：展开是常态，收起时整体压暗 */
	transition: opacity var(--ak-dur-fast, 0.2s);
}

.skillWrapper > .headWrapper > .lineBtn:hover {
	opacity: 1;
}

/* 已展开：高亮，表示「下方正在显示台词」；收起态是常态半透明 */
.skillWrapper > .headWrapper > .lineBtnOpened {
	opacity: 1;
	filter: drop-shadow(0 0 4px rgba(255, 154, 154, 0.9));
}

/* ---------- 衍生区（技能 / 卡牌共用外壳） ---------- */
.derivationBox {
	position: relative;
	width: 96%;
	margin: 8px 0 6px 2%;
	padding-left: 8px;
	box-sizing: border-box;
	border-left: 3px solid rgba(206, 191, 40, 0.7);
}

.derivationCardBox {
	border-left-color: rgba(0, 151, 218, 0.7);
}

/* 折叠开关做成标题的 ::before：展开是 −、折叠是 +（整行标题即热区） */
.derivationTitle {
	position: relative;
	width: 100%;
	font-size: 18px;
	line-height: 22px;
	font-family: SJZX_youyuan;
	color: #cebf28;
	opacity: 0.9;
	display: flex;
	align-items: center;
	cursor: pointer;
	user-select: none;
}

.derivationTitle:hover {
	opacity: 1;
}

.derivationCardBox > .derivationTitle {
	color: #6fd0ff;
}

.derivationTitle::before {
	content: "-";
	font-family: var(--ak-font-label, SJZX_youyuan);
	font-weight: 700;
	font-size: 18px;
	line-height: 1;
	color: var(--ak-accent, currentColor);
	width: 16px;
	text-align: center;
	margin-right: 6px;
	transition: transform var(--ak-dur-fast, 0.2s);
}

/* + 旋转 90° 看上去仍是 +，过渡因此是“符号转过来变成 −”的动态，而不是凭空加动画 */
.derivationTitleFolded::before {
	content: "+";
	transform: rotate(90deg);
}

.derivationBody {
	position: relative;
	width: 100%;
}

.derivationItem {
	position: relative;
	width: 100%;
	margin-top: 4px;
	background-color: rgba(30, 30, 30, 0.45);
}

.derivationItem > .headWrapper {
	position: relative;
	width: 100%;
	margin-top: 4px;
	margin-left: 5px;
	display: flex;
	align-items: center;
}

.derivationItem > .headWrapper > .dskillname {
	position: relative;
	font-size: 24px;
	color: blue;
	background: linear-gradient(90deg, #70000d, #d01eb0);
	border-radius: 20px;
	padding-left: 8px;
	padding-right: 8px;
	margin-right: 5px;
	font-family: SJZX_hanyi;
}

.derivationItem > .headWrapper > .audioBtn {
	position: relative;
	width: 22px;
	height: 22px;
	background-size: 100% 100%;
	background-image: url("../../../image/ui/Play.png");
	background-color: white;
	border-radius: 50%;
}

.derivationItem > .headWrapper > .autoSkill {
	position: absolute;
	right: 10px;
	top: 0;
	height: 22px;
	font-size: 18px;
	color: white;
	font-family: SJZX_youyuan;
}

.derivationItem > .headWrapper > .autoSkillOpened {
	background-color: rgba(0, 128, 0, 0.65);
	border: green 2px solid;
}

.derivationItem > .headWrapper > .autoSkillClosed {
	background-color: rgba(252, 55, 9, 0.65);
	border: red 2px solid;
	color: gray !important;
}

.derivationInfo {
	position: relative;
	width: 100%;
	margin-top: 6px;
	margin-bottom: 5px;
	font-size: 18px;
	font-family: SJZX_youyuan;
}

/* ---------- 技能台词 ---------- */
/* 台词区沿用衍生区外壳（左边框 + 缩进），只换颜色，与「衍生技能/衍生卡牌」区分 */
.lineBox {
	border-left-color: rgba(255, 107, 107, 0.7);
}

/* 每条台词前的播放键：与 head 上的试听键同一套画法（Play ⇄ Pause），只是小一号 */
.lineItem {
	position: relative;
	display: flex;
	align-items: flex-start;
	gap: 4px;
	width: 100%;
	margin-top: 4px;
	font-size: 18px;
	line-height: 24px;
	font-family: SJZX_youyuan;
	color: #f0f0f0;
	word-break: break-word;
}

.lineItem > .linePlayBtn {
	flex: none;
	width: 18px;
	height: 18px;
	margin-top: 3px;
	background-size: 100% 100%;
	background-image: url("../../../image/ui/Play.png");
	background-color: white;
	border-radius: 50%;
	cursor: pointer;
	opacity: 0.75;
	position: relative;
}

.lineItem > .linePlayBtn:hover {
	opacity: 1;
}

.lineItem > .linePlayBtnPlaying {
	background-image: url("../../../image/ui/Pause.png") !important;
	opacity: 1;
}

/* 序号做成定宽左标，换行时正文仍能对齐在序号右侧 */
.lineItem > .lineIndex {
	position: relative;
	flex: none;
	min-width: 18px;
	opacity: 0.75;
}

/* 「无台词」是缺省态，压暗一档，不与真台词抢注意力 */
.lineEmpty,
.lineEmptyText {
	opacity: 0.55;
	font-style: italic;
	position: relative;
}

/* 文本块自己撑开剩余宽度：flex 容器里长台词才好换行 */
.lineText {
	flex: 1 1 auto;
	min-width: 0;
	position: relative;
}

.lineEmpty {
	padding-left: 2px;
}

/* ---------- 衍生卡牌 ---------- */
.derivationCardItem {
	position: relative;
	width: 100%;
	margin-top: 4px;
	display: flex;
	align-items: flex-start;
}

/* 引擎的 `.button.card` 是 90×90 外加 6px 外边距，这里按它的尺寸留出空位；
   牌面本体交给引擎样式（.buttons 下的缩放规则要生效，所以宿主带 buttons 类） */
.derivationCards {
	position: relative;
	flex: 0 0 auto;
	width: 102px;
}

.cardText {
	position: relative;
	flex: 1 1 auto;
	min-width: 0;
	padding-right: 8px;
}

.cardName {
	position: relative;
	width: 100%;
	font-size: 22px;
	line-height: 26px;
	font-family: SJZX_hanyi;
	color: #f5f5f5;
}
</style>
