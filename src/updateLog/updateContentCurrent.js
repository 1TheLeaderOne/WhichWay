export const upDataContentCurrent = {
	/**
	 * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
	 * @type {string}
	 */
	md: `
### 更新概要
- **新增武将**: 旅骨、岳羽由加莉
- **重构**：露托的技能部分改用新写法
- **新增 API**：\`Player.chooseFakeCardTarget\`
### 进行中
- **优化**: 优化势力显示，现在联动角色会正确显示其势力
- **修复**: 修复黍、信仰搅拌机因AI批量迁移导致的bug
- **修复**: 修复嵯峨、普瑞赛斯模组技能丢失的bug
- **修复**：仍处于开发中的模式\`GloriousIdeal\`在非开发环境下会加载的bug
- **修复**：跃跃因 AI 批量修改导致代码错误的 bug
`,

	/**
	 * 干员按钮组（干员 id），分「新增」与「调整」两组渲染，按钮可双击查看信息卡
	 * @type {{ add: string[], adjust: string[] }}
	 */
	player: {
		/** 本版新增的干员 */
		add: ["lvgumrfz","yueyuyoujialimrfz"],
		/** 本版调整过技能 / 数据的干员 */
		adjust: [],
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

/**
 * 1.5.6更新的武将,等1.6正式版需要加上去
 * add: ["xiaogemrfz","aiguisimrfz","gelanimrfz","liexiamrfz","hulangwanmrfz","kelaimenshamrfz"],
 * adjust: ["baimianxiaomrfz", "chongyuemrfz", "palasimrfz","gallusmrfz"],
 */