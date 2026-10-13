<script setup lang="ts">
/**
 * common/OperatorCard.vue —— 通用干员卡片（信息内联，选将 / 招募复用）
 * 左列：皮肤立绘 + 翻译名（不显示 id）+ 体力/护盾条 + 可选 meta 插槽；右列：技能列表（自身滚动，保留 HTML 富文本）。
 * 整卡可点：点击（未锁定时）emit('toggle')。选将用它切换选中、招募用它触发招募，故抽为可复用组件。
 */
import { computed } from "vue";
import { opName, opSkills } from "./format.js";
import OperatorAvatar from "./OperatorAvatar.vue";
import OperatorHp from "./OperatorHp.vue";

const props = withDefaults(
	defineProps<{
		id: string;
		/** 是否已选中（显示 ✓ 角标 + 金色描边） */
		picked?: boolean;
		/** 未选中且不可再操作时置灰锁定（点击不再 emit） */
		locked?: boolean;
		/** 是否渲染 ✓ 选中角标（招募场景关闭） */
		showCheck?: boolean;
	}>(),
	{ picked: false, locked: false, showCheck: true }
);

const emit = defineEmits<{ toggle: [] }>();

const skills = computed(() => opSkills(props.id));
const clickable = computed(() => !props.locked);

function onClick() {
	if (clickable.value) emit("toggle");
}
</script>

<template>
  <div class="op-card" :class="{ 'is-picked': picked, 'is-locked': locked, 'is-clickable': clickable }" @click="onClick">
    <!-- 左列：立绘 + 名字 + 体力/护盾 -->
    <div class="op-left">
      <div class="op-portrait">
        <OperatorAvatar :id="id" shape="rounded" skin class="op-av" />
        <div v-if="showCheck && picked" class="op-check">✓</div>
      </div>
      <div class="op-name">{{ opName(id) }}</div>
      <OperatorHp class="op-hp" :id="id" />
      <slot name="meta" />
    </div>

    <!-- 右列：技能详情（自身滚动，保留 HTML） -->
    <div class="op-skills">
      <div v-for="sk in skills" :key="sk.id" class="op-skill">
        <div class="op-skill-name">【{{ sk.name }}】</div>
        <div v-if="sk.info" class="op-skill-info" v-html="sk.info"></div>
      </div>
      <p v-if="!skills.length" class="op-skill-empty dim">无技能数据。</p>
    </div>
  </div>
</template>

<style scoped>
.op-card {
  display: flex;
  align-items: stretch;
  gap: 12px;
  background: var(--gi-panel);
  border: 1px solid var(--gi-line);
  border-radius: 14px;
  padding: 10px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.op-card.is-clickable {
  cursor: pointer;
}
.op-card.is-clickable:hover {
  border-color: var(--gi-gold-dim);
}
.op-card.is-picked {
  border-color: var(--gi-gold);
  box-shadow: 0 0 0 2px var(--gi-gold-dim) inset;
}
.op-card.is-locked {
  opacity: 0.55;
}
/* 左列：固定宽度立绘框，尺寸恒定不随原图变化 */
.op-left {
  width: 132px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.op-portrait {
  position: relative;
  width: 132px;
  height: 168px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--gi-bg0);
}
.op-av {
  --gi-av-size: 100%;
  width: 100%;
  height: 100%;
  display: block;
}
.op-av :deep(.gi-av-ring) {
  border: none;
  box-shadow: none;
}
.op-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--gi-gold);
  color: #10131c;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.op-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--gi-text);
  line-height: 1.2;
}
.op-hp {
  min-height: 16px;
}
/* 右列：技能详情，内容超出时仅此列滚动 */
.op-skills {
  flex: 1;
  min-width: 0;
  max-height: 210px;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.op-skill {
  border-left: 3px solid var(--gi-gold-dim);
  padding-left: 10px;
}
.op-skill-name {
  font-weight: 700;
  font-size: 13.5px;
  color: var(--gi-text);
}
.op-skill-info {
  font-size: 12.5px;
  color: var(--gi-text);
  line-height: 1.5;
}
.op-skill-info :deep(font) {
  color: inherit;
}
.op-skill-empty {
  font-size: 12px;
  padding: 8px 0;
}
</style>
