<script setup lang="ts">
/**
 * battle/BattleAllyOverlay.vue —— 战斗内「我方干员」卡片上的手牌 / 装备覆盖层
 *
 * 由 battleOverlay.ts 在角色初始化完成后为每名我方干员挂载一个实例（挂在干员 Player 元素内的定位层上）。
 * 数据全部来自 props.ally（reactive，由 battleOverlay.ts 每阶段/换人后刷新），组件本身不接触引擎对象。
 *
 * 版式（策划 2026-10-01 指定卡背图 image/model/GloriousIdeal/ui/cardbackOL.png）：
 *  - 手牌面板整块以卡背为背景，紧贴干员卡片右侧：牌背图标正下方＝手牌数，右侧＝手牌牌名纵向一行一张（红牌红字、黑牌黑字）。
 *  - 牌名**全量列出**，超出面板高度时在列表内用**滚轮滚动**查看。
 *  - 当前操控者（isMe）不显示手牌面板（自己看得见手牌），装备条改挂卡片上方。
 *  - flipLeft：角色右侧离视口太近时，手牌面板翻到卡片左侧。
 */
import { computed } from "vue";
import { giImg } from "../common/format.js";
import EquipIcon from "../common/EquipIcon.vue";
import { HAND_PANEL_H, HAND_PANEL_W, type AllyOverlayState } from "./battleOverlayTypes.js";

const props = defineProps<{ ally: AllyOverlayState }>();
const emit = defineEmits<{ (e: "openHand"): void; (e: "openEquip"): void }>();

const cardBack = { backgroundImage: `url("${giImg("model/GloriousIdeal/ui/cardbackOL.png")}")` };
const showHand = computed(() => !props.ally.hidden && !props.ally.isMe);
const showEquips = computed(() => !props.ally.hidden && props.ally.equips.length > 0);
</script>

<template>
  <div class="gi-bvo">
    <div
      v-if="showHand"
      class="gi-bvo-hand"
      :class="{ 'is-flip': ally.flipLeft }"
      :style="[cardBack, { width: HAND_PANEL_W + 'px', height: HAND_PANEL_H + 'px' }]"
      @click="emit('openHand')"
    >
      <div class="gi-bvo-num">{{ ally.count }}</div>
      <div class="gi-bvo-cards" @wheel.stop>
        <span v-for="(c, i) in ally.hand" :key="i" class="gi-bvo-card" :class="c.red ? 'is-red' : 'is-black'">
          {{ c.name }}
        </span>
      </div>
    </div>
    <div v-if="showEquips" class="gi-bvo-equips" :class="ally.isMe ? 'is-above' : 'is-below'">
      <span v-for="e in ally.equips" :key="e.id" class="gi-bvo-eq" @click.stop="emit('openEquip')">
        <EquipIcon :id="e.id" :img="e.img" :size="30" />
      </span>
    </div>
  </div>
</template>

<style scoped>
/* 引擎给所有 div 加了 `transition:all .5s`，覆盖层每阶段刷新，别让它跟着平移淡入 */
.gi-bvo,
.gi-bvo div {
  transition: none;
}
/* 定位层本身铺满干员卡片、不吃点击，只有里面的面板/图标响应 */
.gi-bvo {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  /* 战斗子实例 realm 不加载战役层主题，这里自带一份 --gi-* 变量供 EquipIcon 继承 */
  --gi-line2: #3a4562;
  --gi-panel2: #222a40;
}
.gi-bvo-hand {
  position: absolute;
  left: 90.5%;
  top: 0;
  margin-left: 0;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  pointer-events: auto;
  cursor: pointer;
}
.gi-bvo-hand.is-flip {
  left: auto;
  right: 100%;
}
/* 卡背自带牌背图标位于左侧 ~20%~42%，数字落在图标正下方 */
.gi-bvo-num {
  position: absolute;
  left: 15%;
  width: 28%;
  bottom: 9%;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #f0dfa8;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}
.gi-bvo-cards {
  position: absolute;
  left: 37%;
  right: 2%;
  top: 6%;
  bottom: 6%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 牌名全量列出：从顶部排起，超出高度交给滚轮滚动（@wheel.stop 已阻止事件冒泡给引擎） */
  justify-content: flex-start;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;
}
.gi-bvo-cards::-webkit-scrollbar {
  display: none;
}
.gi-bvo-card {
  font-size: 11px;
  line-height: 1.15;
  font-weight: 700;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.35);
}
.gi-bvo-card.is-red {
  color: #c0392b;
}
.gi-bvo-card.is-black {
  color: #1b1b1b;
}
.gi-bvo-equips {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  box-sizing: border-box;
  padding: 2px;
  pointer-events: auto;
}
.gi-bvo-equips.is-below {
  top: 100%;
}
.gi-bvo-equips.is-above {
  bottom: 100%;
}
.gi-bvo-eq {
  display: inline-flex;
  cursor: pointer;
}
</style>
