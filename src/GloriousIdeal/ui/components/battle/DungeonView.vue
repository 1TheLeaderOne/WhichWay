<script setup lang="ts">
/**
 * battle/DungeonView.vue —— 战斗系统 · 副本探索（出征链路第 2 步）
 * 「暗黑地牢 1」式行军地图：纵向路网（入口在下、BOSS 在上），
 * 道路由 SVG 绘制，节点为圆形徽记；可达节点直接在地图上点击前进。
 *
 * TODO：真实标准对垒接好后，在 moveTo 命中敌人时切到战斗层（battle 系统扩展点）。
 */
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { CONFIG, view } from "../../store.js";
import * as store from "../../store.js";
import StatusBar from "../common/StatusBar.vue";
import PartyRail from "../common/PartyRail.vue";
import { ACTION_TO_RATION, type DungeonNode } from "../../../dungeon.js";

const layout = () => view.layout;
const curIndex = () => view.cur;
const curNode = (): DungeonNode | undefined => layout()?.nodes.find(n => n.index === curIndex());

/** 当前所在节点的可前往邻居 */
const canGo = (n: DungeonNode): boolean => {
	const c = curNode();
	if (!c) return false;
	return c.neighbors.includes(n.index) && n.index !== curIndex();
};

const diffName = () => (layout() ? CONFIG.DIFFICULTY[layout()!.difficulty].name : "");

/* ================= 暗黑地牢式布局 =================
   BFS 求每个节点到入口的最短距离作为“层”，层越深越靠上（BOSS 置顶）；
   同层节点横向均分。x 为百分比（0~100），y 为像素。 */
const ROW = 64;
const PAD = 56;
const VBW = 600;

interface MapGeom {
	pos: Map<number, { x: number; y: number }>;
	height: number;
}

const mapGeom = computed<MapGeom | null>(() => {
	const l = view.layout;
	if (!l) return null;
	const depth = new Map<number, number>();
	const queue: number[] = [l.entry];
	depth.set(l.entry, 0);
	while (queue.length) {
		const i = queue.shift()!;
		for (const nb of l.nodes[i].neighbors) {
			if (!depth.has(nb)) {
				depth.set(nb, depth.get(i)! + 1);
				queue.push(nb);
			}
		}
	}
	const maxD = Math.max(...depth.values());
	const layers = new Map<number, number[]>();
	for (const n of l.nodes) {
		const d = depth.get(n.index) ?? 0;
		layers.set(d, [...(layers.get(d) ?? []), n.index]);
	}
	const pos = new Map<number, { x: number; y: number }>();
	for (const [d, ids] of layers) {
		const y = PAD + (maxD - d) * ROW;
		const slot = 100 / (ids.length + 1);
		ids.forEach((id, k) => pos.set(id, { x: slot * (k + 1), y }));
	}
	return { pos, height: PAD * 2 + maxD * ROW };
});

/** 去重后的边（a<b），供 SVG 画路 */
const edges = computed(() => {
	const l = view.layout;
	const g = mapGeom.value;
	if (!l || !g) return [];
	const list: { a: number; b: number; active: boolean; dim: boolean }[] = [];
	for (const n of l.nodes) {
		for (const nb of n.neighbors) {
			if (nb <= n.index) continue;
			const touchesCur = n.index === curIndex() || nb === curIndex();
			const other = nb === curIndex() ? n.index : nb;
			const targetNode = l.nodes[other];
			const active = touchesCur && (canGo(targetNode) || targetNode.explored || targetNode.cleared);
			const dim = !l.nodes[n.index].explored && !targetNode.explored && !touchesCur;
			list.push({ a: n.index, b: nb, active, dim });
		}
	}
	return list;
});

const px = (index: number) => {
	const p = mapGeom.value?.pos.get(index);
	return p ?? { x: 50, y: 0 };
};
/** viewBox 坐标（x 按 VBW 换算，y 即像素） */
const vx = (index: number) => (px(index).x / 100) * VBW;
const vy = (index: number) => px(index).y;

const nodeStyle = (n: DungeonNode) => ({ left: px(n.index).x + "%", top: px(n.index).y + "px" });

/** 节点是否“已知”：探索过、清扫过或当前可达（邻居）；其余以迷雾剪影呈现 */
const isKnown = (n: DungeonNode): boolean => canGo(n) || !!n.explored || !!n.cleared || n.index === curIndex();

/** 节点图标与语义 */
const nodeIcon = (n: DungeonNode): string => {
	if (!isKnown(n)) return "?";
	if (n.kind === "outpost") {
		if (n.event === "boss") return "💀";
		if (n.hasEnemy) return "⚔";
		return "🏕";
	}
	return n.event === "treasure" ? "✨" : "·";
};

const nodeState = (n: DungeonNode): string => {
	if (n.index === curIndex()) return "cur";
	if (canGo(n)) return "go";
	if (!isKnown(n)) return "unknown";
	if (n.kind === "outpost" && n.event === "boss" && n.hasEnemy) return "boss";
	if (n.hasEnemy) return "foe";
	if (n.cleared) return "cleared";
	if (n.explored) return "seen";
	return "dark";
};

const nodeLabel = (n: DungeonNode): string => {
	if (n.index === view.layout?.entry) return "出发点";
	if (n.kind === "outpost") return n.event === "boss" ? "敌军主将" : `营地 ${n.index}`;
	return n.event === "treasure" ? "物资" : "";
};

/** 统计：已清扫的敌占驻扎点 */
const clearedOutposts = () => layout()?.nodes.filter(n => n.kind === "outpost" && !n.hasEnemy).length ?? 0;
const totalOutposts = () => layout()?.nodes.filter(n => n.kind === "outpost").length ?? 0;

/* ---------- 粮草 / 行动经济（Phase B）读数 ---------- */
const run = () => view.ctrl?.data.run ?? null;
const actions = () => run()?.actions ?? 0;
const provisions = () => view.ctrl?.data.inventory.provision ?? 0;
/** 距下一次「进食」还差几次行动（满 ACTION_TO_RATION 触发） */
const nextRationIn = () => ACTION_TO_RATION - (actions() % ACTION_TO_RATION);
/** 投喂冷却剩余行动数（0=可投喂） */
const feedCd = () => {
	const r = run();
	return r ? Math.max(0, r.feedReadyAt - r.actions) : 0;
};

const moveTo = (n: DungeonNode) => {
	store.moveTo(n.index);
};

/* ---------- 视口自动对准当前节点 ---------- */
const frameRef = ref<HTMLElement | null>(null);
const scrollToCur = (smooth = true) => {
	const g = mapGeom.value;
	if (!g || !frameRef.value) return;
	const target = px(curIndex()).y - frameRef.value.clientHeight / 2;
	frameRef.value.scrollTo({ top: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
};
onMounted(() => nextTick(() => scrollToCur(false)));
watch(curIndex, () => nextTick(() => scrollToCur(true)));
</script>

<template>
  <div class="gi-page gi-dungeon">
    <StatusBar />

    <!-- 任务头卡 -->
    <div class="gi-run-head" v-if="view.layout">
      <div class="gi-run-title">
        <h2 class="gi-h2">
          {{ CONFIG.DUNGEONS.find(d => d.id === view.layout.dungeonId)?.name ?? view.layout.dungeonId }}
          <span class="gi-diff-chip">{{ diffName() }}</span>
        </h2>
        <p class="gi-sub dim">已清扫 {{ clearedOutposts() }}/{{ totalOutposts() }} 处营地 · 在地图上点击发光的节点即可前进</p>
      </div>
    </div>

    <!-- ================= 行军地图（暗黑地牢式） ================= -->
    <div class="gi-run-map" v-if="view.layout && mapGeom">
      <div class="gi-map-frame" ref="frameRef">
        <div class="gi-map-canvas" :style="{ height: mapGeom.height + 'px' }">
          <!-- 道路 -->
          <svg class="gi-map-roads" :viewBox="`0 0 ${VBW} ${mapGeom.height}`" preserveAspectRatio="none">
            <template v-for="e in edges" :key="e.a + '-' + e.b">
              <line
                class="gi-road-base"
                :class="{ active: e.active, dim: e.dim }"
                :x1="vx(e.a)" :y1="vy(e.a)" :x2="vx(e.b)" :y2="vy(e.b)"
              />
              <line
                class="gi-road-dash"
                :class="{ active: e.active, dim: e.dim }"
                :x1="vx(e.a)" :y1="vy(e.a)" :x2="vx(e.b)" :y2="vy(e.b)"
              />
            </template>
          </svg>

          <!-- 节点 -->
          <button
            v-for="n in view.layout.nodes"
            :key="n.index"
            class="gi-mnode"
            :class="[n.kind === 'outpost' ? 'kind-outpost' : 'kind-path', nodeState(n), { clickable: canGo(n) }]"
            :disabled="!canGo(n)"
            :style="nodeStyle(n)"
            :title="
              n.index === curIndex()
                ? '我军当前位置'
                : canGo(n)
                  ? (n.hasEnemy ? '前往：遭遇敌军！' : '前往此地')
                  : isKnown(n)
                    ? '（需绕路抵达）'
                    : '未知区域'
            "
            @click="moveTo(n)"
          >
            <span v-if="n.index === curIndex()" class="gi-mnode-flag">我军</span>
            <span class="gi-mnode-medal">
              <span class="gi-mnode-icon">{{ nodeIcon(n) }}</span>
              <span v-if="n.cleared && n.kind === 'outpost'" class="gi-mnode-tick">✓</span>
            </span>
            <span v-if="nodeLabel(n)" class="gi-mnode-label" :class="{ gold: n.event === 'boss' && isKnown(n) }">{{ nodeLabel(n) }}</span>
          </button>
        </div>
      </div>

      <!-- 图例 -->
      <div class="gi-map-legend dim">
        <span><i class="lg lg-cur" /> 当前位置</span>
        <span><i class="lg lg-go" /> 可前往（点击）</span>
        <span><i class="lg lg-foe" /> 遭遇敌人</span>
        <span><i class="lg lg-boss" /> 敌军主将</span>
        <span><i class="lg lg-cleared" /> 已清扫</span>
        <span><i class="lg lg-dark" /> 未知</span>
      </div>
    </div>

    <!-- 行动结算提示（进食 / 缺粮 / 投喂） -->
    <div v-if="view.dungeonNotice" class="gi-run-notice">
      <span>{{ view.dungeonNotice }}</span>
      <button class="gi-notice-x" title="关闭" @click="store.clearDungeonNotice()">✕</button>
    </div>

    <!-- 行动区 -->
    <div class="gi-run-actions">
      <div class="gi-run-info">
        <p class="gi-run-hint">
          <b>当前：{{ curNode() ? nodeLabel(curNode()) || `通路 #${curIndex()}` : '—' }}</b>
          <span class="dim"> · 每次移动 = 1 行动</span>
        </p>
        <p class="gi-economy">
          <span class="gi-eco-chip">🚶 行动 {{ actions() }}</span>
          <span class="gi-eco-chip" :class="{ warn: provisions() === 0 }">🍞 粮草 {{ provisions() }}</span>
          <span class="gi-eco-chip dim" :title="`每经过一个节点算 1 行动；每满 ${ACTION_TO_RATION} 行动，在场干员各消耗 1 粮草`">下次进食还需 {{ nextRationIn() }} 行动</span>
          <span class="gi-eco-chip" :class="{ dim: feedCd() === 0, warn: feedCd() > 0 }" title="主动投喂：1 粮草→1 名干员 +1 体力，每次投喂后需再走若干行动">
            投喂{{ feedCd() > 0 ? `冷却 ${feedCd()} 行动` : '就绪' }}
          </span>
        </p>
        <p class="gi-hint-sm dim">体力跨战斗保留，手牌每场重置（占位）。抵达 BOSS 前先清空沿途敌军吧。</p>
      </div>
      <div class="gi-run-btns">
        <button class="gi-btn gi-btn-outline" title="返回营地，按任务完成度结算" @click="store.endDungeon()">
          撤离并结算 →
        </button>
      </div>
    </div>

    <!-- ============ 右侧队伍栏（暗黑地牢 1 式，副本内显示体力 + 投喂） ============ -->
    <PartyRail :ids="view.party" show-hp allow-feed />
  </div>
</template>

<style scoped>
.gi-run-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin: 18px 0 14px;
}
.gi-h2 {
  margin: 0;
}
.gi-diff-chip {
  display: inline-block;
  vertical-align: middle;
  font-size: 11px;
  font-weight: 500;
  color: var(--gi-gold);
  border: 1px solid var(--gi-gold-dim);
  border-radius: 999px;
  padding: 2px 10px;
  margin-left: 6px;
}
/* ================= 地图 ================= */
.gi-dungeon {
  /* 给右侧固定队伍栏(210px)让位，地图/操作区不被压住 */
  padding-right: 226px;
}
.gi-run-map {
  display: block; /* 引擎 div 全局 inline-block，块级容器须显式恢复 */
  background:
    radial-gradient(900px 420px at 50% 110%, rgba(224, 179, 87, 0.05), transparent 60%),
    var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: var(--gi-radius);
  padding: 0 12px 10px;
}
/* 滚动视口：地图纵向展开，自动对准当前节点。
   display:block 必须显式恢复：引擎全局 div{display:inline-block}，
   而画布内全是绝对定位子元素，shrink-to-fit 会把 frame/canvas 宽度压成 0，
   节点被 overflow-x:hidden 整体裁掉。 */
#gi-layer .gi-map-frame {
  position: relative;
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  height: min(62vh, 660px);
}
#gi-layer .gi-map-canvas {
  position: relative;
  display: block;
  width: min(680px, 100%);
  margin: 0 auto;
}
.gi-map-frame::-webkit-scrollbar {
  width: 8px;
}
.gi-map-frame::-webkit-scrollbar-thumb {
  background: var(--gi-line2);
  border-radius: 4px;
}
.gi-map-roads {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
/* 道路：粗底 + 虚线中心线（vector-effect 保持描边不随 viewBox 拉伸） */
.gi-road-base {
  stroke: #262d40;
  stroke-width: 9;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.gi-road-dash {
  stroke: #3a4562;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 1 9;
  vector-effect: non-scaling-stroke;
}
.gi-road-base.active {
  stroke: rgba(224, 179, 87, 0.28);
}
.gi-road-dash.active {
  stroke: var(--gi-gold);
  stroke-dasharray: 7 7;
  animation: gi-road-flow 1.2s linear infinite;
}
.gi-road-base.dim {
  stroke: #1c2233;
}
.gi-road-dash.dim {
  stroke: #262d40;
}
@keyframes gi-road-flow {
  to {
    stroke-dashoffset: -14;
  }
}
/* ---------- 节点 ---------- */
.gi-mnode {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  cursor: default;
}
.gi-mnode.clickable {
  cursor: pointer;
}
.gi-mnode-medal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 32%, #232b42, #10141f);
  border: 2px solid var(--gi-line2);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45);
  transition: transform 0.15s, box-shadow 0.15s;
}
.gi-mnode-icon {
  font-size: 14px;
  line-height: 1;
}
.gi-mnode-label {
  font-size: 10.5px;
  color: var(--gi-dim);
  white-space: nowrap;
  text-shadow: 0 1px 3px #000;
}
.gi-mnode-label.gold {
  color: var(--gi-red);
  font-weight: 700;
}
/* 驻扎点：大徽记 + 双层环 */
.gi-mnode.kind-outpost .gi-mnode-medal {
  width: 52px;
  height: 52px;
  outline: 2px solid rgba(58, 69, 98, 0.6);
  outline-offset: 3px;
}
.gi-mnode.kind-outpost .gi-mnode-icon {
  font-size: 22px;
}
/* 状态：未知（迷雾剪影） */
.gi-mnode.unknown {
  opacity: 0.38;
  filter: saturate(0);
}
.gi-mnode.unknown .gi-mnode-medal {
  background: #12162200;
  border-style: dashed;
  box-shadow: none;
}
.gi-mnode.unknown .gi-mnode-icon {
  font-size: 13px;
  color: var(--gi-dim);
}
/* 已探索/已清扫 */
.gi-mnode.seen .gi-mnode-medal {
  opacity: 0.9;
}
.gi-mnode.cleared .gi-mnode-medal {
  border-color: rgba(111, 206, 143, 0.65);
  outline-color: rgba(111, 206, 143, 0.25);
}
.gi-mnode-tick {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--gi-green);
  color: #0c1408;
  font-size: 10px;
  font-weight: 800;
  line-height: 16px;
  text-align: center;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
}
/* 敌人 / BOSS */
.gi-mnode.foe .gi-mnode-medal {
  border-color: var(--gi-red);
  box-shadow: 0 0 12px rgba(224, 106, 94, 0.35);
}
.gi-mnode.boss .gi-mnode-medal {
  border-color: #d9534f;
  outline-color: rgba(217, 83, 79, 0.4);
  animation: gi-boss-pulse 1.8s ease-in-out infinite;
}
.gi-mnode.boss .gi-mnode-icon {
  font-size: 26px;
}
/* 可达：金色脉冲光环 */
.gi-mnode.go .gi-mnode-medal {
  border-color: var(--gi-gold);
  outline: 2px solid rgba(224, 179, 87, 0.5);
  outline-offset: 3px;
  animation: gi-go-pulse 1.4s ease-in-out infinite;
}
.gi-mnode.go:hover .gi-mnode-medal {
  transform: scale(1.12);
}
.gi-mnode.go .gi-mnode-label {
  color: var(--gi-gold);
}
/* 当前位置 */
.gi-mnode.cur .gi-mnode-medal {
  border-color: var(--gi-gold);
  background: radial-gradient(circle at 50% 32%, rgba(224, 179, 87, 0.35), rgba(224, 179, 87, 0.08));
  box-shadow: 0 0 0 3px rgba(224, 179, 87, 0.18), 0 0 24px rgba(224, 179, 87, 0.4);
}
.gi-mnode-flag {
  padding: 1px 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ecc068, #d8a84c);
  color: #241a05;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
@keyframes gi-go-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(224, 179, 87, 0.4);
  }
  50% {
    box-shadow: 0 0 0 9px rgba(224, 179, 87, 0);
  }
}
@keyframes gi-boss-pulse {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(217, 83, 79, 0.25);
  }
  50% {
    box-shadow: 0 0 20px rgba(217, 83, 79, 0.6);
  }
}
/* 图例 */
.gi-map-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid var(--gi-line);
  padding: 10px 6px 0;
  font-size: 11px;
}
.gi-map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.gi-map-legend .lg {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--gi-line2);
  background: var(--gi-bg1);
}
.lg-cur {
  background: rgba(224, 179, 87, 0.5) !important;
  border-color: var(--gi-gold) !important;
}
.lg-go {
  border-color: var(--gi-gold) !important;
}
.lg-foe,
.lg-boss {
  border-color: var(--gi-red) !important;
}
.lg-cleared {
  border-color: var(--gi-green) !important;
}
.lg-dark {
  opacity: 0.35;
}
/* 行动区 */
.gi-run-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
}
.gi-run-hint {
  margin: 0;
  font-size: 13px;
}
.gi-run-hint b {
  color: var(--gi-gold);
}
.gi-hint-sm {
  margin: 4px 0 0;
  font-size: 11.5px;
}
.gi-run-btns {
  display: flex;
  gap: 10px;
}
/* 行动结算提示 */
.gi-run-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding: 9px 13px;
  border-radius: 8px;
  border: 1px solid var(--gi-gold-dim);
  background: rgba(224, 179, 87, 0.09);
  color: var(--gi-text);
  font-size: 12.5px;
}
.gi-notice-x {
  border: none;
  background: none;
  color: var(--gi-dim);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  line-height: 1;
}
.gi-notice-x:hover {
  color: var(--gi-text);
}
/* 粮草 / 行动读数 */
.gi-economy {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0 0;
}
.gi-eco-chip {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--gi-line2);
  background: var(--gi-bg1);
  color: var(--gi-text);
  font-variant-numeric: tabular-nums;
}
.gi-eco-chip.warn {
  border-color: var(--gi-red);
  color: var(--gi-red);
}
</style>
