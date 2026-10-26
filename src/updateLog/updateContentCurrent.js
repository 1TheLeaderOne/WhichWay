export const upDataContentCurrent = {
	/**
	 * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
	 * @type {string}
	 */
	md: `
### 更新概要
- **新增动皮**: （剧情）可露希尔 
- **技能 / 武将调整**: 斯卡蒂、风笛、缪尔赛思、斗士塔露拉、钼铅
- **优化**: 新增整合运动势力的logo
- **修复**：开启驶舰之向时，本体武将选择的动皮重开游戏后变回原皮的 bug
- **修复**：千幻聆音里驶舰之向动皮对应的静皮显示两张（png / jpg 同名）的 bug
- **修复**：干员原画、皮肤在部分场景下显示为空白（立绘/皮肤路径未解析）的 bug
- **修复**：海蒂【暗信】在特殊情况报错的 bug
- **修复**：岳羽由加莉分包不正确的 bug
`,

	/**
	 * 干员按钮组（干员 id），分「新增」与「调整」两组渲染，按钮可双击查看信息卡
	 * @type {{ add: string[], adjust: string[] }}
	 */
	player: {
		/** 本版新增的干员 */
		add: [],
		/** 本版调整过技能 / 数据的干员 */
		adjust: ["char_263_skadi","char_222_bpipe","char_249_mlyss","doushitalulamrfz","char_4171_wulfen"],
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