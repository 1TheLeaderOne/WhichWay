export const upDataContentCurrent = {
	/**
	 * 公告正文（Markdown）。空字符串表示这一版没有文字内容，只显示 `player` / `cards`。
	 * @type {string}
	 */
	md: `
### 更新概要
- **新增干员**:国度、安多恩、雷德、精术髓、精律则
- **新增动皮**: （剧情）可露希尔 
- **新增皮肤**: 皮肤和动态皮肤更新至\`卫戍协议：规程\`版本
- **技能 / 武将调整**: 斯卡蒂、风笛、缪尔赛思、斗士塔露拉、钼铅、德克萨斯、W、伊芙利特、星熊、闪灵、因陀罗、天火、艾雅法拉、赫拉格、霜叶、塞雷娅、白金、莫斯提马、陨星、阿、梅尔、凯尔希、山、柏喙、Lancet-2、安洁莉娜、棘刺、泥岩、惊蛰、菲亚梅塔、老鲤、铃兰、迷迭香、瑕光、卡涅利安、水月、ASH、缄默德克萨斯、百炼嘉维尔

- **修复**：与千幻聆音和十周年UI的兼容性问题
- **修复**：海蒂【暗信】在特殊情况报错的 bug
- **修复**：岳羽由加莉分包不正确的 bug
- **修复**：霜叶仍然使用了\`StepContent\`的 bug
- **修复**：深靛仍然使用了\`StepContent\`的 bug
- **修复**：弑君者仍然使用了\`StepContent\`的 bug 
- **修复**：予愿安洁莉娜【飞笺】友方角色也会选择弃牌而不是摸牌的 bug
- **修复**：\`Player.reUnseen\`仍然使用了\`StepContent\`的 bug
- **修复**：晓歌使用【万全】之后不会刷新卡牌提示的 bug
- **修复**：溯光星源【溯理】需要被删的描述没有正确被渲染成红色的 bug 
- **修复**：重复为武将添加动态皮肤的 bug
- **修复**：切换动态皮肤后状态不会正确刷新的 bug

- **新增**：驶舰之向武将卡台词功能

- **优化**：对扩展内所有武将进行了重构，删除了非剧情干员的所有本地配音，自本版本开始，不再提供本地配音，需要的请自行下载
- **优化**：为扩展内所有武将新增了称号
- **优化**: 新增整合运动势力的logo
`,

	/**
	 * 干员按钮组（干员 id），分「新增」与「调整」两组渲染，按钮可双击查看信息卡
	 * @type {{ add: string[], adjust: string[] }}
	 */
	player: {
		/** 本版新增的干员 */
		add: ["char_4246_dminon","anduoenmrfz","leidemrfz","char_509_acast","lvzemrfz"],
		/** 本版调整过技能 / 数据的干员 */
		adjust: ["char_263_skadi","char_222_bpipe","char_249_mlyss","doushitalulamrfz","char_4171_wulfen","char_102_texas","char_113_cqbw","char_134_ifrit","char_136_hsguma","char_147_shining","char_155_tiger","char_166_skfire","char_180_amgoat","char_188_helage","char_193_frostl","char_202_demkni","char_204_platnm","char_213_mostma","char_219_meteo","char_225_haak","char_242_otter","char_003_kalts","char_264_f12yin","char_252_bibeak","char_285_medic2","char_291_aglina","char_293_thorns","char_311_mudrok","char_306_leizi","char_300_phenxi","char_322_lmlee","char_358_lisa","char_391_rosmon","char_423_blemsh","char_426_billro","char_437_mizuki","char_456_ash","char_1028_texas2","char_1026_gvial2"],
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