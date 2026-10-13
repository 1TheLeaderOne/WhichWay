/**
 * battle/battleOverlayTypes.ts —— 战斗内覆盖层（battleOverlay.ts）与 Vue 面板共用的视图数据。
 *
 * 覆盖层跑在**战斗子实例 realm**（iframe 内），数据由 battleOverlay.ts 在每阶段/换人后算好写进 reactive 对象，
 * Vue 组件只负责呈现，不碰引擎对象（Player/Card），保持可序列化、易维护。
 */

/** 手牌小块：只展示牌名，颜色随花色（红桃/方块=红字，黑桃/梅花=黑字） */
export interface HandCardView {
	name: string;
	red: boolean;
}

/** 装备条目（图标 + 名称 + 效果文案） */
export interface EquipView {
	id: string;
	name: string;
	img?: string;
	desc: string;
}

/** 一名我方干员卡片上的覆盖层状态 */
export interface AllyOverlayState {
	/** 手牌牌名列表（全量展示，超出面板高度由滚轮滚动） */
	hand: HandCardView[];
	/** 手牌总数（显示在卡背牌背图标的正下方） */
	count: number;
	equips: EquipView[];
	/** 是否为当前操控者：操控者不显示手牌面板，装备面板移到卡片上方 */
	isMe: boolean;
	/** 阵亡：整块覆盖层隐藏 */
	hidden: boolean;
	/** 右侧离视口太近：手牌面板改挂卡片左侧 */
	flipLeft: boolean;
}

/**
 * 展开的手牌浮层（自建 UI，不走引擎 dialog）状态；牌面 DOM 由 battleOverlay.ts 命令式填进卡片区。
 * 没有坐标字段：面板由宿主容器 flex 居中，之后靠玩家拖动移动（transform）。
 */
export interface HandPanelState {
	/** 标题：XX的手牌（N） */
	title: string;
	/** 手牌数：为 0 时由组件显示「没有手牌」 */
	count: number;
}

/** 装备详情浮层（自建遮罩） */
export interface EquipModalState {
	title: string;
	equips: EquipView[];
}

/** 卡背面板尺寸（cardbackOL.png 原图 170×139 的比例）；贴边判断也用它 */
export const HAND_PANEL_W = 112;
export const HAND_PANEL_H = 92;
// 展开手牌浮层的尺寸不在这里：面板已改成宿主容器居中 + 内容自撑高度，宽高全部由 BattleHandPanel.vue 的 CSS 决定。
