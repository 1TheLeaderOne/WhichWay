export const upDataContentCurrent = {
	/**
	 * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
	 * @type {string}
	 */
	md: `
### 更新概要

- **新增武将**: 晓歌、埃癸斯
- **技能 / 武将调整**：白面鸮、重岳、帕拉斯
- **新增 API**：\`Player.chooseTargetControl\`、\`Player.chooseFakeCard\`
- **修复**：\`override.ts\`中仍然使用\`StepContent\`的bug
- **修复**：嘉欣塔【飞旅】\`dynamicTranslate\` 仍停留在未削弱版本的 bug
- **修复**：信仰搅拌机【铳胄】因使用 Step-Content 而导致打包出错的 bug
- **修复**：卡涅里安、阿斯卡纶、波卜、裁度、骋风、帕拉斯、电弧、蒂比、斗士塔露拉、海霓、黑键、左乐因 AI 批量修改导致代码错误的 bug
- **修复**：希尔达语音解码错误导致无限递归播放语音的 bug
- **重构**：阿、安洁莉娜、安哲拉、ASH、白金、白铁、柏喙、澄闪、斥罪、重岳、初雪、刺玫、魔王、戴菲恩、德克萨斯、医生、多萝西、艾拉、菲莱、风笛、风丸、弗里斯腾、格劳克斯、黑、歌蕾蒂娅、瑰盐、哈蒂娅、海沫、号角、红、红隼的技能部分改用新写法
- **优化**：优化加载流程，减少加载时间
- **优化**: 优化\`WhichWayTips\`

### 进行中
- **优化**: 优化势力显示，现在联动角色会正确显示其势力
`,

	/**
	 * 干员按钮组（干员 id），分「新增」与「调整」两组渲染，按钮可双击查看信息卡
	 * @type {{ add: string[], adjust: string[] }}
	 */
	player: {
		/** 本版新增的干员 */
		add: ["xiaogemrfz","aiguisimrfz"],
		/** 本版调整过技能 / 数据的干员 */
		adjust: ["baimianxiaomrfz", "chongyuemrfz", "palasimrfz"],
	},

	/**
	 * 卡牌按钮组（牌名 / 牌 id），同样分「新增」与「调整」
	 * @type {{ add: string[], adjust: string[] }}
	 */
	cards: {
		/** 本版新增的卡牌 */
		add: [],
		/** 本版调整过的卡牌 */
		adjust: [],
	},
};
