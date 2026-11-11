/**
 * helper/demo.ts —— 开发模式下可运行的新手帮助演示链
 *
 * 用于快速验收：
 * - 无高亮 / 居中；
 * - 真实元素高亮 + 严格点击；
 * - 任意矩形高亮 + 绝对/锚点定位；
 * - 长文本的宽度自适应。
 *
 * 通过 window.whichWayHelperDemo() 或 whichWayHelper.runDemo() 触发。
 */

import type { HelperChain } from "./types.js";

/** 构造演示链（每次调用重新计算视口相关的矩形，适配当前窗口尺寸） */
export function createHelperDemoChain(): HelperChain {
	const width = typeof window === "undefined" ? 1280 : window.innerWidth;
	const height = typeof window === "undefined" ? 720 : window.innerHeight;
	const fallbackRect = {
		x: Math.max(24, width / 2 - 160),
		y: Math.max(24, height / 2 - 80),
		width: Math.min(320, width - 48),
		height: Math.min(160, height - 48),
	};

	return {
		id: "whichWayHelperDemo",
		name: "新手帮助演示",
		escapable: true,
		steps: [
			{
				id: "welcome",
				title: "阿米娅",
				portrait: "illu:character/char_002_amiya.png",
				text: "博士，欢迎来到驶舰之向。\n这里是新手帮助的演示：点击任意位置即可继续。",
				position: "center",
			},
			{
				id: "element-highlight",
				text: "这一步会高亮一个真实存在的界面元素。\n点击高亮区域完成本步，元素本身的点击仍会生效。",
				// 游戏外的界面不一定有 #roundmenu；找不到就突出屏幕中间一块区域，保证演示可继续
				highlight: () => document.querySelector("#roundmenu") ?? document.querySelector(".menu-container:not(.hidden)") ?? fallbackRect,
				advanceOn: "highlight",
				waitFor: 1000,
				position: { placement: "bottom", align: "center", gap: 24 },
			},
			{
				id: "rect-highlight",
				text: "这一步高亮的是屏幕上的任意区域，并把提示框固定在右下角。\n点击高亮区域继续。",
				highlight: {
					rect: {
						x: Math.max(24, width * 0.08),
						y: Math.max(24, height * 0.18),
						width: Math.min(420, Math.max(160, width * 0.32)),
						height: Math.min(220, Math.max(100, height * 0.28)),
					},
				},
				advanceOn: "highlight",
				position: { anchor: "bottom-right", offsetX: -24, offsetY: -24 },
			},
			{
				id: "long-text",
				text: "最后演示文字框的自适应宽度：短文本时保持最小宽度；长文本会先横向撑开，达到上限后再自动换行增高。\n点击任意位置完成演示。",
				position: { x: Math.max(24, width / 2 - 380), y: Math.max(24, height / 2 - 140) },
			},
		],
	};
}
