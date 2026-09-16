export const upDataContentCurrent = {
	/**
	 * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
	 * @type {string}
	 */
	md: `
### 更新概要

- **技能 / 武将调整**：白面鸮、重岳、帕拉斯
- **新增 API**：\`Player.chooseTargetControl\`、\`Player.chooseFakeCard\`
- **修复**：嘉欣塔【飞旅】\`dynamicTranslate\` 仍停留在未削弱版本的 bug
- **修复**：信仰搅拌机【铳胄】因使用 Step-Content 而导致打包出错的 bug
- **修复**：卡涅里安、阿斯卡纶、波卜、裁度、骋风、帕拉斯因 AI 批量修改导致代码错误的 bug
- **重构**：阿、安洁莉娜、安哲拉、ASH、白金、白铁、柏喙、澄闪、斥罪、重岳、初雪、刺玫的技能部分改用新写法
- **修复**：希尔达语音解码错误导致无限递归播放语音的 bug
- **优化**：加载流程，减少加载时间
`,

	/**
	 * 新增 / 调整的干员（干员 id），渲染成可双击查看信息卡的干员按钮
	 * @type {string[]}
	 */
	player: ["baimianxiaomrfz", "chongyuemrfz", "palasimrfz"],

	/**
	 * 新增卡牌（牌名 / 牌 id）
	 * @type {string[]}
	 */
	cards: [],
};
