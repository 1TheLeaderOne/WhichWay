<template>
	<div class="solicit-forth">
		<!-- 左栏：海报 + 搜索 + 干员名单 -->
		<div class="left-pane">
			<!-- 投稿方式 -->
			<div class="submit-poster">
				<div class="poster" :style="posterStyle"></div>
			</div>

			<!-- 搜索框 -->
			<div class="search-box">
				<div class="image-box">
					<img :src="watchImageUrl" alt="搜索图标" />
				</div>
				<input v-model="query" type="text" class="search-input" placeholder="输入干员id、中文名或拼音搜索未实装的干员~" />
			</div>

			<!-- 搜索结果状态：只在这次搜索没命中未实装名单时才占一行 -->
			<div v-if="statusText" class="search-status" :class="{ 'is-hit': statusHit }">{{ statusText }}</div>

			<!-- 干员卡牌 -->
			<div class="card-grid">
				<div v-for="op in visible" :key="op.id" class="operator-card">
					<!--
						图片用 `<img loading="lazy">` 而不是 `background-image`：
						未实装名单有几百条，背景图会一次性全部解码，而 `loading=lazy` 只滚到附近才要图。
						`object-fit: contain` + 原始比例：这一页要的是「看清鹰角画了什么」，不做任何裁剪与缩放。
					-->
					<div class="image-box-card">
						<img v-if="op.image" :src="op.image" class="operator-image" loading="lazy" decoding="async" fetchpriority="low" :alt="op.name" />
						<div v-else class="operator-image no-image">暂无立绘</div>
					</div>
					<div class="operator-name">{{ op.name }}</div>
					<div class="operator-id">{{ op.id }}</div>
					<div class="operator-tag">未实装</div>
				</div>
				<div v-if="!visible.length" class="empty-tip">{{ emptyText }}</div>
			</div>
		</div>

		<!-- 右栏：投稿渠道（群二维码 + 群号）与投稿规则 -->
		<div class="right-pane">
			<div class ="submut-total submut-total-extra">{{ countText }}</div>
			<div class="submit-channel">
				<div class="pane-title">投稿渠道</div>
				<!-- 二维码用 `<img :src>` 而不是 CSS 背景：写成相对 `url()` 会被打包器内联成 base64 塞进自动生成的样式表里（1.5MB 的海报就是把那张表撑到 2.7MB 的元凶） -->
				<img class="qr-img" :src="qrImageUrl" alt="驶舰之向投稿群二维码" />
				<div class="group-no-line">群号：{{ GROUP_NUMBER }}</div>
				<div class="group-btns">
					<div class="pane-btn" @click="joinGroup">加入群聊</div>
					<div class="pane-btn" @click="copyGroupNo">{{ copyLabel }}</div>
				</div>
			</div>

			<div class="submit-rules">
				<div class="pane-title">投稿规则</div>
				<ol class="rules-list">
					<li>
						强度保持在
						<span v-if="feiyiAvailable" class="char-link" @click="openFeiyiCard">ol费祎</span>
						<span v-else class="char-plain">ol费祎</span>
						上下
					</li>
					<li>技能组设计须符合剧情</li>
					<li>尽量投稿本扩展中没有的武将，如投稿已有武将，实装将会较慢</li>
					<li>本人可能会对稿件进行修改再实装，如介意请在投稿时说明</li>
				</ol>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * 「征稿在前」：列出明日方舟有、驶舰之向还没做的干员
 *
 * 数据源就是 `vaildArkId`（明日方舟全量干员uid）与 `exsitArk`（扩展已实装）的差集，
 * 不需要再维护一份「待做清单」——实装一个就自动从这一页消失。
 * 再叠一层 `isObtainable`（角色表的 `isNotObtainable`）：**游戏内拿不到的角色不进征稿名单**
 * ——预备干员系列、Sharp/Pith/Touch/Stormeye/Raidian/Misery/Mechanist/暮落/郁金香、盟约·辅助干员
 * 这些都有完整干员数据和立绘，但玩家无法获取、也谈不上投稿，共 29 条；
 * 它们仍然参与搜索，命中时会说明「游戏内无法获取」而不是「没找到」。
 *
 * 之所以放在配置界面而不是游戏内：这是给玩家看「还能投什么稿」的目录页，与对局无关。
 *
 * 搜索同时认三种输入：干员id（如 `char_118_anseul`）、中文名（如「推进之王」）、
 * 拼音（如 `tuijin` / `tui jin zhi wang`）。命中且未实装就进结果列表；
 * 命中的是**已实装**干员则明确告知「已实装」，免得玩家以为搜索坏了。
 *
 * 版面是左右两栏：左栏（60%）是给玩家翻的名单，右栏（40%）是投稿渠道与规则——
 * 名单要横向铺开才看得快，而规则必须在投稿前就摆在眼前，所以两者并排而不是串在一列里滚。
 */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { lib, ui } from "noname";
import * as pinyinPro from "pinyin-pro";
import { whichWayArknight } from "../../arknight/index.ts";
import { whichWayFile } from "../../file.js";

const emit = defineEmits(["loaded"]);

/** 投稿QQ群号 */
const GROUP_NUMBER = "104537053";
/** 规则里作为强度参照的武将：本体的 SP 费祎，不是驶舰之向角色 */
const FEIYI_CHAR_ID = "ol_feiyi";

const query = ref("");
const watchImageUrl = whichWayFile.compilePath("ui:watch.png");
const qrImageUrl = whichWayFile.compilePath("dec:qq1.jpg");
const posterStyle = { backgroundImage: `url("${whichWayFile.compilePath("ui:solicitForth/poster.png")}")` };

/**
 * 全量干员条目：`{ id, name, image, implemented, search }`
 *
 * 一次性算好（含拼音），后面每次输入只做字符串匹配：`exsitArk`/`vaildArkId` 在启动期就定型了，
 * 没必要做成响应式的，也避免在 `computed` 里对几百个干员反复跑拼音。
 */
const operators = ref([]);

/** 立绘是否存在本地文件：`characterPortraitExt` 是启动期扫目录建的索引，没条目就是没图 */
function portraitOf(id) {
	return whichWayFile.characterPortraitExt[id] ? whichWayFile.getCharacterPortraitPath(id) : "";
}

function buildSearchText(id, name) {
	const parts = [id, name];
	try {
		if (typeof pinyinPro !== "undefined") {
			const pinyin = pinyinPro
				.pinyin(name, {
					type: "array",
					toneType: "none",
				})
				.join(" ")
				.toLowerCase();
			parts.push(pinyin, pinyin.replace(/\s/g, ""));
		}
	} catch (error) {
		console.warn("[solicitForth] 拼音转换失败:", error);
	}
	return parts.join(" ").toLowerCase();
}

onMounted(() => {
	const table = whichWayArknight.arknightData?.character_table ?? {};
	const exsit = new Set(whichWayArknight.exsitArk);
	const list = [];
	for (const id of whichWayArknight.vaildArkId) {
		//表里没有名称的（理论上不会发生：vaildArkId 就是从这两张表构造的）退化成显示id
		const name = table[id]?.name ?? id;
		list.push({
			id,
			name,
			image: portraitOf(id),
			implemented: exsit.has(id),
			//游戏内拿不得到的角色不进征稿名单，但搜索时仍要说明原因，否则玩家以为表里没这个人
			obtainable: whichWayArknight.isObtainable(id),
			search: buildSearchText(id, name),
		});
	}
	//按中文名排序，方便玩家顺着名单找投稿目标
	list.sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
	operators.value = list;
	emit("loaded");
});

const normalizedQuery = computed(() => query.value.trim().toLowerCase());

function matches(op, q) {
	const hay = op.search;
	return hay.includes(q) || hay.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
}

/** 可征稿的条目：未实装 **且** 游戏内可获取（预备干员、活动 NPC 等拿不到的角色不算） */
const solicitable = computed(() => operators.value.filter(op => !op.implemented && op.obtainable));

/** 未实装的干员（本页主角），已按查询词过滤 */
const visible = computed(() => {
	const q = normalizedQuery.value;
	if (!q) return solicitable.value;
	return solicitable.value.filter(op => matches(op, q));
});

/** 查询词命中的「已实装」干员：用来区分「搜不到」与「已经做了」 */
const implementedHits = computed(() => {
	const q = normalizedQuery.value;
	if (!q) return [];
	return operators.value.filter(op => op.implemented && op.obtainable && matches(op, q));
});

/**
 * 查询词命中的「游戏内无法获取」角色（预备干员系列、活动/集成战略 NPC）。
 * 它们不进名单，但必须给一句话说明，否则搜「郁金香」会得到「表里没找到」，而表里其实有。
 */
const unobtainableHits = computed(() => {
	const q = normalizedQuery.value;
	if (!q) return [];
	return operators.value.filter(op => !op.implemented && !op.obtainable && matches(op, q));
});

const countText = computed(() => {
	if (!normalizedQuery.value) {
		const obtainable = operators.value.filter(op => op.obtainable).length;
		return `未实装 ${solicitable.value.length} / 共 ${obtainable} 名可获取干员`;
	}
	return `命中 ${visible.value.length} 名`;
});

const statusHit = computed(() => normalizedQuery.value !== "" && (visible.value.length > 0 || implementedHits.value.length > 0));

const statusText = computed(() => {
	const q = normalizedQuery.value;
	if (!q) return "";
	if (implementedHits.value.length > 0) {
		const names = implementedHits.value.slice(0, 5).map(op => op.name);
		const more = implementedHits.value.length > names.length ? ` 等${implementedHits.value.length}名` : "";
		return `「${names.join("、")}${more}」明日方舟里有，驶舰之向也已实装`;
	}
	if (visible.value.length > 0) return "";
	if (unobtainableHits.value.length > 0) {
		const names = unobtainableHits.value.slice(0, 5).map(op => op.name);
		const more = unobtainableHits.value.length > names.length ? ` 等${unobtainableHits.value.length}名` : "";
		return `「${names.join("、")}${more}」明日方舟里有，但游戏内无法获取（预备干员／活动 NPC 一类），不列入征稿名单`;
	}
	return "明日方舟的干员表里没有找到这个id／名字／拼音";
});

const emptyText = computed(() => (normalizedQuery.value ? "没有匹配的未实装干员（试试干员id、中文名或拼音）" : "所有明日方舟干员都已实装"));

//———————— 右栏：群号 —————————

/**
 * 加群链接（`group_code=104537053`）。
 *
 * 这是群二维码的**同款地址**：手机扫码走的是QQ的链接跳转，桌面端只有把这条链接交给浏览器才能拉起加群，
 * 所以「加入群聊」不试图直接打开QQ，只开这个页面。链接里的 `_wv`/`authKey`/`noverify` 由QQ生成、会过期，
 * 换了新二维码就要一并换掉这条地址，两者不是独立配置。
 */
const GROUP_JOIN_URL = "https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=f5IbwM5In_2WKgo4e6-eGdRKpyszhmZV&authKey=cQ6aXKkQ4skbgLGtO6LP5IV66qaaU0sNn1BaDqK1dr02R2inCUGlHLpabzqc2JOS&noverify=0&group_code=104537053";

const copyLabel = ref("复制群号");
/** 复制结果只在按钮上停留一小会儿，然后恢复原文案 */
let copyResetTimer = null;

onBeforeUnmount(() => clearTimeout(copyResetTimer));

/** 打开加群页面：与 `config/index.js:61`、`package/index.ts:60` 同样的 `window.open` 用法 */
function joinGroup() {
	window.open(GROUP_JOIN_URL);
}

/**
 * 复制到剪贴板。
 *
 * `navigator.clipboard` 只在安全上下文可用（`file:` 打开的客户端、局域网 http 访问都没有），
 * 那条路失败就退回隐藏 textarea + `execCommand`；两路都失败才报 false，由调用方把结果写在按钮上。
 */
async function copyToClipboard(text) {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch (error) {
		console.warn("[solicitForth] Clipboard API 不可用，改用 execCommand:", error);
	}
	try {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		//`position:fixed`：无名杀给 body 设了 `position:absolute;overflow:hidden`，用 absolute 挂上去可能被裁掉而选不中
		textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;";
		document.body.appendChild(textarea);
		textarea.select();
		const ok = document.execCommand("copy");
		textarea.remove();
		return ok;
	} catch (error) {
		console.error("[solicitForth] 复制失败:", error);
		return false;
	}
}

async function copyGroupNo() {
	const ok = await copyToClipboard(GROUP_NUMBER);
	copyLabel.value = ok ? "已复制" : "复制失败";
	clearTimeout(copyResetTimer);
	copyResetTimer = setTimeout(() => (copyLabel.value = "复制群号"), 1500);
}

//———————— 右栏：强度参照卡 —————————

/** 内容包被关掉时 `lib.character` 里就没有它，此时规则文字照留但不给可点的样式，免得点了没反应 */
const feiyiAvailable = !!lib.character[FEIYI_CHAR_ID];

/**
 * 打开 ol费祎 的武将卡，让玩家直接看清「强度保持在这个水平」是什么水平。
 *
 * 它不是驶舰之向角色，所以本扩展的武将卡劫持不会接管（配置为「所有角色」时才会），走的是引擎原版卡。
 * 原版卡挂在 `.popup-container`（`layout/default/menu.css:17` 的 `z-index: 10`），而本设置面板的容器是
 * `z-index: 19`（`configUI/index.js:46`），`#window` 自身不带 `position`、不构成层叠上下文，
 * 于是卡片会被面板整个盖住。`ui.click.charactercard` 是同步函数、最后一句就是
 * `ui.window.appendChild(layer)`（`ui/click/index.js:4301`），所以调用完立刻把刚挂上来的那层提到面板之上。
 * 第三个参数 `noedit=true` 让「收藏」「禁用」变灰：这里是给人看的参照卡，不该动玩家的配置。
 */
function openFeiyiCard() {
	ui.click.charactercard(FEIYI_CHAR_ID, null, true);
	const layer = ui.window?.lastElementChild;
	if (layer?.classList.contains("popup-container") && layer.querySelector(".menubg.charactercard")) {
		layer.style.zIndex = "20";
	}
}
</script>

<style scoped>
.solicit-forth {
	position: relative;
	width: 100%;
	height: 100%;
	/* 左右两栏：名单占 60%，投稿渠道与规则占 40% */
	display: flex;
	flex-direction: row;
	gap: 12px;
	padding: 12px;
	box-sizing: border-box;
	color: #f5f5f5;
}

/* 两栏各自是一列：`min-width/min-height: 0` 是让里面的滚动区（名单、规则）真正生效的前提 */
.left-pane {
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 0 0 60%;
	min-width: 0;
	min-height: 0;
	box-sizing: border-box;
}

.right-pane {
	position: relative;
	display: flex;
	flex-direction: column;
	/*基数取 0 而不是 40%：两栏的百分比加起来正好 100%，再加 `gap` 就会溢出，
	  让右栏吃掉「剩下的全部」才能保住左栏精确的 60% */
	flex: 1 1 0;
	gap: 10px;
	min-width: 0;
	min-height: 0;
	overflow-y: auto;
	box-sizing: border-box;
}

.right-pane::-webkit-scrollbar {
	width: 8px;
}

.right-pane::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.4);
	border-radius: 4px;
}

/** 投稿方式 */
.submit-poster {
	position: relative;
	width: calc(100% - 20px);
	height: calc(20% - 20px);
	padding: 10px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid #888;
	border-radius: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: none;
	box-sizing: content-box;
}

.poster {
	position: relative;
	max-width: 60%;
	max-height: 100%;
	width: 80%;
	height: 100%;
	/*图片地址由脚本用 `compilePath("ui:...")` 传进来：写成相对 url() 在生产构建里解析不到扩展目录 */
	background-size: 100% 100%;
}

/* 搜索框 */
.search-box {
	position: relative;
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 8px;
	padding: 12px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.3);
	box-sizing: border-box;
	flex: none;
}

.image-box {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: none;
	position: relative;
}

.image-box img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.search-input {
	flex: 1;
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 14px;
	outline: none;
	background: rgba(255, 255, 255, 0.9);
	box-sizing: border-box;
}

.search-input:focus {
	border-color: #409eff;
}

.search-count {
	flex: none;
	font-size: 14px;
	color: #cfe8ff;
	white-space: nowrap;
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 搜索状态行 */
.search-status {
	flex: none;
	margin-bottom: 8px;
	padding: 6px 12px;
	font-size: 14px;
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.35);
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-status.is-hit {
	border-color: #1ac2fd;
	color: #9fe6ff;
}

/* 卡牌网格 */
.card-grid {
	position: relative;
	flex: 1;
	overflow: auto;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 10px;
	align-content: start;
	box-sizing: border-box;
	padding: 4px;
}

.operator-card {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 6px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid #888;
	border-radius: 6px;
}

.image-box-card {
	position: relative;
	width: 100%;
	/* 方舟立绘约 2:3，固定比例让网格整齐，图片本身不裁剪 */
	aspect-ratio: 2 / 3;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.operator-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.no-image {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	color: #bbb;
	background: rgba(255, 255, 255, 0.06);
	position: relative;
}

.operator-name {
	margin-top: 4px;
	font-size: 15px;
	text-align: center;
	word-break: break-all;
	position: relative;
}

.operator-id {
	font-size: 12px;
	color: #b9c7d6;
	word-break: break-all;
	text-align: center;
	position: relative;
}

.operator-tag {
	position: absolute;
	top: 4px;
	right: 4px;
	padding: 1px 6px;
	font-size: 12px;
	color: #fff;
	border-radius: 3px;
	background: rgba(255, 120, 40, 0.85);
}

.empty-tip {
	grid-column: 1 / -1;
	text-align: center;
	color: #ccc;
	font-size: 15px;
	padding: 20px;
}

.card-grid::-webkit-scrollbar {
	width: 8px;
}

.card-grid::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.4);
	border-radius: 4px;
}

/* 右栏通用外壳：与左栏的卡片、海报同一套底色与描边 */
.submut-total,
.submit-channel,
.submit-rules {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	padding: 12px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid #888;
	border-radius: 6px;
	box-sizing: border-box;
}

.submut-total-extra {
	width: 100%;
	height: fit-content;
}

.pane-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 8px;
	color: #9fe6ff;
	position: relative;
	width: 100%;
}

/* 群二维码：459x448 近似正方，按宽度铺满后自然缩放，不裁剪（裁剪会切掉二维码的定位角） */
.qr-img {
	display: block;
	width: 50%;
	height: auto;
	max-height: 320px;
	object-fit: contain;
	background: #fff;
	border-radius: 4px;
}

.group-no-line {
	margin-top: 8px;
	text-align: center;
	font-size: 16px;
	letter-spacing: 1px;
	color: #ffe9a8;
	width: 100%;
}

.group-btns {
	margin-top: 8px;
	display: flex;
	gap: 8px;
	justify-content: center;
	position: relative;
	width: 100%;
}

.pane-btn {
	padding: 6px 14px;
	font-size: 14px;
	color: #f5f5f5;
	background: rgba(26, 194, 253, 0.2);
	border: 1px solid #1ac2fd;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
	text-align: center;
	position: relative;
}

.pane-btn:hover {
	background: rgba(26, 194, 253, 0.45);
}

/* 投稿规则 */
.rules-list {
	margin: 0;
	/*`body` 被无名杀重置过，列表缩进要自己写回来 */
	padding-left: 22px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: 15px;
	line-height: 1.5;
}

/* 强度参照：看着就能点（下划线 + 常亮色 + 手型），点击后弹武将卡 */
.char-link {
	color: #1ac2fd;
	font-weight: bold;
	text-decoration: underline;
	cursor: pointer;
}

.char-link:hover {
	color: #9fe6ff;
	text-shadow: 0 0 6px rgba(26, 194, 253, 0.8);
}

.char-plain {
	font-weight: bold;
}
</style>
