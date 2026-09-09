<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import type { LaunchPadItem } from "./data.js";

const props = defineProps<{ items: LaunchPadItem[]; bg: string }>();
const emit = defineEmits<{ (e: "pick", mode: string): void }>();

/* ---------------- 状态 ---------------- */
const active = ref(0);
const animating = ref(false);
const serial = ref("");
const title = ref("");
const desc = ref("");
const curArt = ref("");
const leaving = ref(false);

const stageEl = ref<HTMLElement | null>(null);
const mediaViewEl = ref<HTMLElement | null>(null);
const frontEl = ref<HTMLElement | null>(null);
const thumbRow = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const serialEl = ref<HTMLElement | null>(null);
const titleEl = ref<HTMLElement | null>(null);
const descEl = ref<HTMLElement | null>(null);

const current = computed(() => props.items[active.value] || null);

const artBg = (u: string) => (u ? `url("${u}")` : "none");
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/* ---------------- 文本滑入动画（响应式 + class 两段式） ---------------- */
async function slideSwap(el: HTMLElement | null, dir: 1 | -1, setText: () => void) {
	if (!el) return;
	const offset = dir * 50;
	el.style.setProperty("--mcb-dx", offset + "px");
	el.classList.add("mcb-t-out");
	await sleep(230);
	el.classList.remove("mcb-t-out");
	setText();
	await nextTick();
	el.classList.add("mcb-t-in");
	await nextTick();
	el.classList.remove("mcb-t-in");
}

/* ---------------- 主图缩放交替（动态 createElement，样式需非 scoped） ---------------- */
async function imageZoom(dir: 1 | -1, newBg: string) {
	const stage = stageEl.value;
	if (!stage) return;
	while (stage.children.length < 2) {
		const d = document.createElement("div");
		d.className = "mcb-stage-img mcb-stage-hidden";
		stage.appendChild(d);
	}
	const oldLayer = stage.children[0] as HTMLElement;
	const newLayer = stage.children[1] as HTMLElement;
	const oldOrigin = dir === 1 ? "right bottom" : "left top";
	const newOrigin = dir === 1 ? "left top" : "right bottom";
	newLayer.classList.remove("mcb-stage-hidden");
	newLayer.style.backgroundImage = artBg(newBg);
	oldLayer.style.transformOrigin = oldOrigin;
	newLayer.style.transformOrigin = newOrigin;
	oldLayer.style.transition = "none";
	newLayer.style.transition = "none";
	oldLayer.style.transform = "scale(1)";
	newLayer.style.transform = "scale(0)";
	oldLayer.style.opacity = "1";
	newLayer.style.opacity = "1";
	await nextTick();
	oldLayer.style.transition = "transform .6s cubic-bezier(.6,.05,.3,1)";
	newLayer.style.transition = "transform .6s cubic-bezier(.6,.05,.3,1)";
	oldLayer.style.transform = "scale(0)";
	newLayer.style.transform = "scale(1)";
	await sleep(620);
	oldLayer.remove();
	newLayer.classList.remove("mcb-stage-img-active");
	curArt.value = newBg;
	newLayer.style.transform = "none";
	newLayer.style.transition = "none";
	while (stage.children.length < 2) {
		const d = document.createElement("div");
		d.className = "mcb-stage-img mcb-stage-hidden";
		stage.appendChild(d);
	}
}

/* ---------------- 切页 ---------------- */
async function goTo(index: number, dir: 1 | -1) {
	if (animating.value || leaving.value) return;
	const total = props.items.length;
	if (!total) return;
	const next = (index + total) % total;
	const item = props.items[next];
	animating.value = true;
	await Promise.all([slideSwap(serialEl.value, dir, () => (serial.value = item.serial)), slideSwap(titleEl.value, dir, () => (title.value = item.title)), slideSwap(descEl.value, dir, () => (desc.value = item.desc)), imageZoom(dir, item.art)]);
	active.value = next;
	animating.value = false;
	await nextTick();
	shiftThumbs();
}

/* ---------------- 缩略条平移窗口（active 居中，前后各 2） ---------------- */
function shiftThumbs() {
	const row = thumbRow.value;
	if (!row) return;
	const cards = row.children;
	if (!cards.length) return;
	const w = (cards[0] as HTMLElement).offsetWidth || 200;
	const a = active.value;
	const total = cards.length;
	for (let i = 0; i < total; i++) {
		const card = cards[i] as HTMLElement;
		const span = i - a;
		let x = span * w;
		let op = "1";
		let pe = "auto";
		if (span <= -3) {
			x = -w;
			op = "0";
			pe = "none";
		} else if (span >= 3) {
			x = w * 3;
			op = "0";
			pe = "none";
		}
		card.style.transform = `translateX(${x}px)`;
		card.style.opacity = op;
		card.style.pointerEvents = pe;
	}
}

/* ---------------- 交互 ---------------- */
function prev() {
	goTo(active.value - 1, -1);
}
function next() {
	goTo(active.value + 1, 1);
}
function jump(i: number) {
	goTo(i, i > active.value ? 1 : -1);
}
function pickCurrent() {
	const item = current.value;
	if (!item || leaving.value) return;
	leaving.value = true;
	document.querySelector(".mcb-root")?.classList.add("mcb-leave");
	emit("pick", item.mode);
}

function onKey(e: KeyboardEvent) {
	if (e.key === "ArrowLeft") prev();
	else if (e.key === "ArrowRight") next();
	else if (e.key === "Enter") pickCurrent();
}

/* ---------------- 鼠标 3D 视差（严格按参考项目 parallax-move.js） ---------------- */
/* 参考：range=20；外层 translate3d(xV, yV, 0) rotateX(-yV) rotateY(xV)；
       内层 translate3d(xV*7.7, yV*3, 50px) rotateX(-yV) rotateY(xV) */
const mouse = reactive({ x: 0.5, y: 0.5 });
const pos = reactive({ x: 0.5, y: 0.5 });
const RANGE = 20;
const calc = (n: number) => n * RANGE - RANGE / 2;

function onMove(e: MouseEvent) {
	mouse.x = e.clientX / window.innerWidth;
	mouse.y = e.clientY / window.innerHeight;
}
let rafId = 0;
function parallaxLoop() {
	pos.x += (mouse.x - pos.x) / 10;
	pos.y += (mouse.y - pos.y) / 10;
	const xV = calc(pos.x);
	const yV = calc(pos.y);
	if (mediaViewEl.value) {
		mediaViewEl.value.style.transform = `translate3d(${xV}px, ${yV}px, 0) rotateX(${-yV}deg) rotateY(${xV}deg)`;
	}
	if (frontEl.value) {
		frontEl.value.style.transform = `translate3d(${xV * 7.7}px, ${yV * 3}px, 50px) rotateX(${-yV}deg) rotateY(${xV}deg)`;
	}
	rafId = requestAnimationFrame(parallaxLoop);
}

/* ---------------- 粒子 ---------------- */
interface P {
	x: number;
	y: number;
	r: number;
	vx: number;
	vy: number;
	a: number;
}
let particles: P[] = [];
let pRaf = 0;
let pCtx: CanvasRenderingContext2D | null = null;
function initParticles() {
	const c = canvasEl.value;
	if (!c) return;
	pCtx = c.getContext("2d");
	if (!pCtx) return;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const resize = () => {
		c.width = c.clientWidth * dpr;
		c.height = c.clientHeight * dpr;
		pCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
	};
	resize();
	window.addEventListener("resize", resize);
	particles = Array.from({ length: 40 }, () => ({
		x: Math.random(),
		y: Math.random(),
		r: 0.5 + Math.random() * 1.3,
		vx: -0.01 + Math.random() * 0.02,
		vy: -0.005 + Math.random() * 0.01,
		a: 0.1 + Math.random() * 0.32,
	}));
	const loop = () => {
		const ctx = pCtx;
		const c = canvasEl.value;
		if (ctx && c) {
			ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < -0.02) p.x = 1.02;
				if (p.x > 1.02) p.x = -0.02;
				if (p.y < -0.02) p.y = 1.02;
				if (p.y > 1.02) p.y = -0.02;
				ctx.beginPath();
				ctx.arc(p.x * c.clientWidth, p.y * c.clientHeight, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(232,196,140,${p.a})`;
				ctx.fill();
			}
		}
		pRaf = requestAnimationFrame(loop);
	};
	loop();
}
function onWheel(e: WheelEvent) {
	if (e.deltaY > 0) next();
	else if (e.deltaY < 0) prev();
}

/* ---------------- 生命周期 ---------------- */
onMounted(async () => {
	if (!props.items.length) return;
	const first = props.items[0];
	serial.value = first.serial;
	title.value = first.title;
	desc.value = first.desc;
	curArt.value = first.art;
	await nextTick();
	imageZoom(1, first.art);
	await nextTick();
	shiftThumbs();
	window.addEventListener("mousemove", onMove);
	window.addEventListener("keydown", onKey);
	document.addEventListener("wheel", onWheel, { passive: true });
	parallaxLoop();
	initParticles();
});
onBeforeUnmount(() => {
	cancelAnimationFrame(rafId);
	cancelAnimationFrame(pRaf);
	window.removeEventListener("mousemove", onMove);
	window.removeEventListener("keydown", onKey);
	document.removeEventListener("wheel", onWheel);
});
</script>

<template>
	<div class="mcb-root">
		<canvas ref="canvasEl" class="mcb-particles"></canvas>
		<div class="mcb-bg" :style="{ backgroundImage: bg ? artBg(bg) : 'none' }"></div>

		<!-- 顶部右上角 logo（明方舟 / DIRECT LINK / A.L.L.） -->
		<div class="mcb-logo">
			<div class="mcb-logo-main">明日方舟</div>
			<div class="mcb-logo-sub">DIRECT LINK</div>
			<div class="mcb-logo-sub2">A.L.L.</div>
		</div>

		<!-- 左箭头 -->
		<div class="mcb-arrow mcb-arrow-prev" @click="prev">
			<svg viewBox="0 0 60 60">
				<path d="M38 12 L22 30 L38 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>

		<!-- 视差主视区（perspective + 整层 3D 旋转） -->
		<div class="mcb-container-box">
			<div ref="mediaViewEl" class="mcb-media-view">
				<div class="mcb-current">
					<!-- 主图（点击进入该模式） -->
					<div ref="stageEl" class="mcb-stage-pic" @click="pickCurrent"></div>

					<!-- 信息浮层（视差内层 + z 偏移 50px） -->
					<div ref="frontEl" class="mcb-user-interactive">
						<div class="mcb-current-info">
							<div class="mcb-info-wrapper">
								<div ref="serialEl" class="mcb-serial">{{ serial }}</div>
								<h1 ref="titleEl" class="mcb-title" @click="pickCurrent">{{ title }}</h1>
								<div class="mcb-detail">
									<p ref="descEl" class="mcb-desc">{{ desc }}</p>
								</div>
							</div>
							<div class="mcb-nav-wrapper">
								<span v-for="(it, i) in items" :key="'nav-' + it.mode" class="mcb-ind" :class="{ on: i === active }" @click="jump(i)"></span>
							</div>
						</div>
					</div>
				</div>

				<!-- 底部缩略条 -->
				<div class="mcb-list-wrapper">
					<div ref="thumbRow" class="mcb-list">
						<div v-for="(it, i) in items" :key="'th-' + it.mode" class="mcb-list-item" :class="{ on: i === active }" @click="jump(i)">
							<div class="mcb-list-item-img" :style="{ backgroundImage: artBg(it.thumb || it.art) }">
								<span class="mcb-list-item-name">{{ it.title }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 右箭头 -->
		<div class="mcb-arrow mcb-arrow-next" @click="next">
			<svg viewBox="0 0 60 60">
				<path d="M22 12 L38 30 L22 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>
	</div>
</template>

<style>
/* 全局：宿主（引擎创建的 #splash 节点）需自带层叠与重置。 */
html body .mcb-root {
	position: fixed !important;
	inset: 0 !important;
	margin: 0 !important;
	padding: 0 !important;
	width: 100vw !important;
	height: 100vh !important;
	overflow: hidden !important;
	background: #000 !important;
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif !important;
	color: #e7e2d6 !important;
	user-select: none !important;
	letter-spacing: 1px !important;
}
html body .mcb-root,
html body .mcb-root *,
html body .mcb-root *::before,
html body .mcb-root *::after {
	box-sizing: border-box !important;
}
/* 文字滑入动画类（响应式文本 + 类切换） */
.mcb-root .mcb-t-out {
	transition:
		transform 0.23s ease-in,
		opacity 0.23s ease-in !important;
	opacity: 0 !important;
	transform: translateX(var(--mcb-dx, 50px)) !important;
}
.mcb-root .mcb-t-in {
	transition: none !important;
	opacity: 0 !important;
	transform: translateX(calc(-1 * var(--mcb-dx, 50px))) !important;
}
/* 选中后整页淡出 */
.mcb-root.mcb-leave {
	opacity: 0 !important;
	transition:
		opacity 0.42s ease,
		transform 0.42s ease !important;
}
/* 主图容器与动态注入图层（必须非 scoped）
   高度+宽度都按视区约束：height ≤ 100vh - 14rem（给信息层+缩略条+余量留足空间），
   配合 aspect-ratio 16/9 让浏览器在 viewport 较矮时自动等比缩放主图（不会超界）。 */
.mcb-root .mcb-stage-pic {
	position: relative;
	width: min(50.88rem, 60vw);
	aspect-ratio: 16 / 9;
	max-height: calc(100vh - 14rem);
	max-width: calc((100vh - 14rem) * 16 / 9);
	overflow: hidden;
	border-radius: 4px;
	background: #05060a;
	cursor: pointer;
}
.mcb-root .mcb-stage-img {
	position: absolute;
	inset: 0;
	background-size: cover;
	background-position: center;
	will-change: transform;
}
.mcb-root .mcb-stage-hidden {
	opacity: 0;
	pointer-events: none;
}
</style>

<style scoped>
.mcb-root {
	overflow: hidden;
	background: #000;
	color: #e7e2d6;
	font-family: "Bender", "PingFang SC", "Microsoft YaHei", sans-serif;
	letter-spacing: 1px;
	transition: opacity 0.42s ease;
}
/* ---------- 顶层面板 ---------- */
.mcb-root {
	overflow: hidden;
	background: #000;
	color: #e7e2d6;
	font-family: "Bender", "PingFang SC", "Microsoft YaHei", sans-serif;
	letter-spacing: 1px;
	transition: opacity 0.42s ease;
}
/* 注意：不要在这里对所有后代 div 写 position:relative —— 其特异性 (0,1,1) 会压过
   .mcb-* 的 position:absolute (0,1,0)，导致箭头/背景/主视区全部失去定位（回归文档流），
   布局错乱且溢出。splash 阶段不存在引擎 layout.css 的 div 规则，无需此重置；
   若未来复用到对局内，应把需要 static 的规则写到具体元素类上。 */
.mcb-particles {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
}
.mcb-bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	background-size: cover;
	background-position: center;
	opacity: 0.12;
	filter: blur(2px) saturate(0.6);
}

/* ---------- 顶部 logo ---------- */
.mcb-logo {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 8;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 6px;
	padding: 22px 32px 0 0;
	pointer-events: none;
}
.mcb-logo-main {
	font-size: 16px;
	color: #f0eadc;
	letter-spacing: 3px;
	position: relative;
}
.mcb-logo-sub {
	font-size: 9px;
	color: #8b8576;
	letter-spacing: 4px;
	position: relative;
}
.mcb-logo-sub2 {
	font-size: 11px;
	color: #b4a98c;
	letter-spacing: 6px;
	margin-top: 2px;
	position: relative;
}

/* ---------- 箭头（极简尖括号） ---------- */
.mcb-arrow {
	position: absolute;
	top: 44%;
	z-index: 9;
	width: 48px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	opacity: 0.8;
	transition: opacity 0.25s;
	margin-top: 20px;
}
.mcb-arrow svg {
	width: 40px;
	height: 52px;
	color: #b3ab97;
	transition:
		color 0.25s,
		filter 0.25s;
	filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.9));
}
.mcb-arrow:hover {
	opacity: 1;
}
.mcb-arrow:hover svg {
	color: #f6f1e3;
	filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.35));
}
.mcb-arrow-prev {
	left: clamp(1rem, 3.2vw, 3.5rem);
}
.mcb-arrow-next {
	right: clamp(1rem, 3.2vw, 3.5rem);
}

/* ---------- 主视区容器（含 perspective） ---------- */
.mcb-container-box {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	perspective: 5000px;
	z-index: 2;
}

/* ---------- 视差主层（整层跟随鼠标） ---------- */
.mcb-media-view {
	width: 100%;
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	will-change: transform;
	transform-style: preserve-3d;
}
.mcb-current {
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

/* ---------- 信息浮层（绝对贴 current 底部 2.5rem，让 title 浮在主图底部 + 露出下方） ---------- */
.mcb-user-interactive {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: clamp(9rem, 22vh, 16.25rem);
	pointer-events: none;
	z-index: 3;
	will-change: transform;
	transform-style: preserve-3d;
}
.mcb-current-info {
	height: 100%;
	width: 100%;
	max-width: 50.88rem;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding-left: 0.94rem;
}
.mcb-info-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;
	min-width: 0;
	max-width: calc(100% - 7rem);
}
.mcb-serial {
	font-family: "Bender", "Consolas", "Monaco", monospace;
	font-size: 5.63rem;
	color: transparent;
	-webkit-text-stroke: 1.5px rgba(232, 196, 140, 0.8);
	letter-spacing: 0.31rem;
	line-height: 1;
	margin-bottom: 6px;
	font-weight: 700;
	transition:
		transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1),
		opacity 0.3s;
	position: relative;
}
.mcb-title {
	margin: 0;
	font-size: 2.4rem;
	font-weight: 700;
	padding: 0.6rem 0.9rem;
	background-color: rgba(255, 255, 255, 0.08);
	-webkit-backdrop-filter: blur(12px);
	backdrop-filter: blur(12px);
	color: #f0eadc;
	letter-spacing: 3px;
	cursor: pointer;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	transition:
		transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1),
		opacity 0.3s,
		background 0.25s;
	position: relative;
	width: fit-content;
}
.mcb-title:hover {
	background-color: rgba(224, 179, 87, 0.18);
}
.mcb-detail {
	padding-left: 0.94rem;
	position: relative;
}
.mcb-desc {
	margin: 0;
	font-size: 0.95rem;
	color: #a8a08c;
	letter-spacing: 1.5px;
	line-height: 1.6;
	max-width: 32rem;
	transition:
		transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1),
		opacity 0.3s;
}

/* 斜条指示器（skewX + 1px×18px + active 白色放大） */
.mcb-nav-wrapper {
	pointer-events: auto;
    display: flex;
    gap: 0.5rem;
    /* margin-right: 1.4rem; */
    /* margin-bottom: 1.1rem; */
    /* right: 0; */
    /* bottom: -1.8rem; */
    /* gap: 4px; */
    /* left: 1.8rem; */
    right: -10rem;
}
.mcb-ind {
	display: inline-block;
	cursor: pointer;
	width: 0.38rem;
	height: 1.1rem;
	transform: skewX(-30deg) scale(1);
	background-color: rgba(255, 255, 255, 0.32);
	transition:
		background-color 0.3s,
		transform 0.3s;
}
.mcb-ind:hover {
	background-color: rgba(255, 255, 255, 0.7);
}
.mcb-ind.on {
	background-color: #fff !important;
	transform: skewX(-30deg) scale(1.25);
}

/* ---------- 缩略条（绝对定位贴底，不参与 flex 流避免被推出视区） ---------- */
.mcb-list-wrapper {
	position: absolute;
	left: 0;
	right: 0;
	bottom: -7.4rem;
	width: 100%;
	height: 6.4rem;
	display: flex;
	justify-content: center;
	z-index: 4;
	mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
	-webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
	pointer-events: none;
}
.mcb-list {
	position: relative;
	width: 100%;
	height: 6.4rem;
	pointer-events: auto;
}
.mcb-list-item {
	position: absolute;
	top: 0;
	width: 11rem;
	height: 6.4rem;
	padding: 0 0.9rem;
	/* 居中靠 left:calc(50% - w/2) + transform 平移；shiftThumbs 会覆盖 transform */
	left: calc(50% - 6.4rem);
	transform: translateX(0);
	transition:
		transform 0.5s cubic-bezier(0.25, 0.8, 0.3, 1),
		opacity 0.45s,
		filter 0.3s;
	cursor: pointer;
	opacity: 0.6;
	filter: saturate(0.85);
}
.mcb-list-item.on {
	opacity: 1;
	filter: saturate(1.05);
}
.mcb-list-item-img {
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	position: relative;
	overflow: hidden;
	transition: transform 0.3s;
}
.mcb-list-item.on .mcb-list-item-img,
.mcb-list-item:hover .mcb-list-item-img {
	transform: scale(1.05);
}
.mcb-list-item-name {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: 18px 0.31rem 0.31rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.85), transparent);
	color: #f0eadc;
	font-size: 0.9rem;
	letter-spacing: 1.5px;
	transform: translateY(100%);
	transition: transform 0.3s;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.mcb-list-item:hover .mcb-list-item-name,
.mcb-list-item.on .mcb-list-item-name {
	transform: translateY(0);
}

/* ---------- 窄屏适配 ---------- */
@media (max-width: 1100px) {
	.mcb-stage-pic {
		width: min(60vw, calc((100vh - 15rem) * 16 / 9)) !important;
		margin-left: 0 !important;
	}
	.mcb-current-info {
		width: 70vw;
		height: auto;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
	}
	.mcb-serial {
		font-size: 4rem;
	}
	.mcb-title {
		font-size: 2.2rem;
	}
}
@media (max-width: 760px) {
	.mcb-arrow {
		display: none;
	}
	.mcb-stage-pic {
		width: 92vw !important;
	}
	.mcb-serial {
		font-size: 3rem;
	}
	.mcb-title {
		font-size: 1.6rem;
		padding: 0.6rem 0.8rem;
	}
	.mcb-current-info {
		width: 90vw;
	}
}
</style>
