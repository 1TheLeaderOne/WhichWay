<template>
	<div ref="listEl" class="skillList">
		<div v-for="(item, index) in skillItems" :key="index" class="skillWrapper">
			<div class="headWrapper">
				<div class="dragHandle">≡</div>
				<div class="skillname">{{ item.label }}</div>
				<div class="audioBtn" @click="playAudio(item.id)"></div>
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
							<div class="audioBtn" @click="playAudio(item.id)"></div>
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
import Sortable from "../../../lib/Sortable/Sortable.js";

const props = defineProps({ name: { type: String, required: true } });

const listEl = ref(null);
let sortable = null;

/** 每个技能一条，衍生内容（技能 / 卡牌）挂在条目的 derivations / cards 里 */
const skillItems = ref([]);
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
			//两块衍生区默认展开，点标题旁的按钮折叠
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

function playAudio(name) {
	whichWayAudio.playSkillAudio(name, props.name);
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
});

onBeforeUnmount(() => {
	sortable?.destroy?.();
	sortable = null;
	cardHosts.clear();
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
}

.skillWrapper > .headWrapper > .audioBtnPlaying {
	background-image: url("../../../image/ui/Pause.png") !important;
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
