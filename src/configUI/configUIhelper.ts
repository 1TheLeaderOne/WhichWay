/**
 * configUI/configUIhelper.ts —— 配置界面首次打开时的自动功能导览
 *
 * 本模块不提供页签，只负责构造一条 whichWayHelper 任务链：
 * - 第一次打开 configUI 时由 main.vue 自动启动；
 * - 每步只高亮左侧菜单按钮，页面自动切到对应功能；
 * - 文案详细介绍功能作用与操作流程，但导览本身不点击/不修改任何设置。
 *
 * 步骤 id 约定为 configUIhelper-tour-<页签名>，main.vue 的 onStep 会从 id 反解页签名，
 * 在进入该步时切换页面，保证页面内容与说明一致。
 */

import type { HelperChain, HelperStep } from "../helper/types.js";

/** 是否已经自动展示过导览的扩展配置键 */
export const CONFIG_UI_HELPER_SEEN_KEY = "configUIhelperSeen";

/** 一条功能说明 */
interface ConfigUIFeature {
	/** 对应 configUI/main.vue 的页签名 */
	panel: string;
	/** 导览标题 */
	title: string;
	/** 详细说明（支持换行） */
	guideText: string;
	/** 仅开发者模式存在的页 */
	devOnly?: boolean;
}

/** 功能导览文本：只介绍，不执行任何设置操作 */
const FEATURES: ConfigUIFeature[] = [
	{
		panel: "更新公告",
		title: "更新公告",
		guideText:
			"功能：查看当前版本的新增、调整与适配要求。\n\n" +
			"怎么用：\n" +
			"1. 顶部先看当前扩展版本和最低适配的无名杀版本。\n" +
			"2. 正文按 Markdown 阅读；新增/调整的干员与卡牌会以按钮组出现，点按钮可查看对应内容。\n" +
			"3. 开发者模式可点右上角「截图本页」导出公告图。\n\n" +
			"提示：历史版本在「更新日志」里。",
	},
	{
		panel: "征稿在前",
		title: "征稿在前",
		guideText:
			"功能：查看明日方舟里尚未实装的干员，并了解投稿方式。\n\n" +
			"怎么用：\n" +
			"1. 左栏浏览名单；顶部搜索框支持干员 id、中文名、拼音。\n" +
			"2. 卡片展示立绘、名称与 id；某个干员实装后会自动从名单消失。\n" +
			"3. 右栏是投稿 QQ 群二维码、群号 104537053、加群/复制按钮与投稿规则。\n" +
			"4. 投稿前请读规则：强度围绕 ol费祎、技能符合剧情、优先投未实装武将；作者可能修改后再实装。\n\n" +
			"提示：游戏内无法获取的干员不会进入名单。",
	},
	{
		panel: "更新日志",
		title: "更新日志",
		guideText:
			"功能：按版本回看历史更新记录。\n\n" +
			"怎么用：\n" +
			"1. 顶部搜索框支持版本号、日期或更新内容关键词。\n" +
			"2. 点版本标题展开/收起；较早版本默认折叠。\n" +
			"3. 版本标题右侧显示该版本的更新项数量。\n\n" +
			"提示：当前版本的公告在「更新公告」。",
	},
	{
		panel: "扩展介绍",
		title: "扩展介绍",
		guideText:
			"功能：了解作者、协力、仓库与资料来源。\n\n" +
			"怎么用：\n" +
			"1. 向下浏览作者、协力 LLM 与扩展仓库入口。\n" +
			"2. 查看干员设计者、特别感谢、配音与资料来源。\n" +
			"3. 需要资源或反馈时，用 QQ 群、百度网盘入口复制群号或链接。\n\n" +
			"提示：素材版权归原作者与鹰角网络所有。",
	},
	{
		panel: "背景设置",
		title: "背景设置",
		guideText:
			"功能：给主界面更换背景。\n\n" +
			"怎么用：\n" +
			"1. 顶部搜索框支持中文/拼音搜索。\n" +
			"2. 展开「驶舰之向扩展背景」或「无名杀自带背景」两组。\n" +
			"3. 点击背景卡片立即切换；当前背景会标记，选择会保存并刷新。\n\n" +
			"提示：两组可以分别隐藏，方便浏览。",
	},
	{
		panel: "配音设置",
		title: "配音设置",
		guideText:
			"功能：按干员切换配音语言，并试听技能与阵亡语音。\n\n" +
			"怎么用：\n" +
			"1. 在左侧列表选择一名驶舰之向干员，支持中文、拼音或技能名搜索。\n" +
			"2. 右侧「配音语言」列出该干员可用的语言（如普通话、日语）；点选后立即保存并重算语音。\n" +
			"3. 「技能配音」按技能逐条点播放键试听；「死亡配音」播放该干员的阵亡语音。\n" +
			"4. 切换语言后，技能/阵亡试听会使用新语言；本地或在线语音由系统自动处理。\n\n" +
			"注意：只调整驶舰之向干员的配音；本导览只介绍，不会替你修改任何配音。",
	},
	{
		panel: "模组切换",
		title: "模组切换",
		guideText:
			"功能：给有模组的干员更换证章/模组。\n\n" +
			"怎么用：\n" +
			"1. 左侧只列出配置了模组的驶舰之向干员，支持中文/拼音/技能名搜索。\n" +
			"2. 右侧查看模组名称、图标、介绍与效果；点击目标模组立即切换并保存。\n" +
			"3. 默认模组是基础证章；部分模组效果需要重启游戏才完全生效。\n\n" +
			"提示：没有模组的干员不会出现在这一页。",
	},
	{
		panel: "皮肤位置调整",
		title: "皮肤位置调整",
		devOnly: true,
		guideText:
			"功能：开发者逐皮肤调整立绘构图与缩放。\n\n" +
			"怎么用：\n" +
			"1. 左侧选干员与皮肤，卡片会标记「已调整 / 未调整」。\n" +
			"2. 点「开启拖拽调整」后拖动移动、滚轮缩放；右键或长按两秒切下一个干员。\n" +
			"3. 预览与游戏内使用同一套画法与裁切；「复制 pos.json」可导出当前设定。\n" +
			"4. 松手约 300ms 后写入 json/pos.json。\n\n" +
			"提示：仅开发者模式显示；普通玩家无需调整。",
	},
];

/**
 * 构造首次打开 configUI 时使用的导览链。
 *
 * @param availablePanels 当前 configUI 实际存在的页签名（用来过滤开发者页）
 * @returns whichWayHelper 可直接运行的 HelperChain
 */
export function buildConfigUIHelperChain(availablePanels: string[]): HelperChain {
	const names = Array.isArray(availablePanels) ? availablePanels : [];
	const features = FEATURES.filter(feature => names.includes(feature.panel));

	const steps: HelperStep[] = [
		{
			id: "configUIhelper-tour-welcome",
			title: "设置页导览",
			text:
				"这里是驶舰之向的设置页：左侧菜单切换功能，右侧显示对应内容。\n" +
				"打开设置会暂停当前对局；点左上角返回按钮关闭后恢复。\n" +
				"接下来会逐个介绍左侧功能，页面会自动切换。点击高亮的菜单按钮继续，按 Esc 可退出。\n" +
				"本导览只做说明，不会修改任何设置。",
			position: "center",
			advanceOn: "any",
		},
	];

	features.forEach((feature, index) => {
		steps.push({
			id: "configUIhelper-tour-" + feature.panel,
			title: "功能 " + (index + 1) + " / " + features.length + " · " + feature.title,
			text: feature.guideText,
			highlight: {
				selector: '[data-config-panel="' + feature.panel + '"]',
				padding: 6,
				radius: 4,
				follow: true,
			},
			advanceOn: "highlight",
			waitFor: 800,
			position: { placement: "auto", align: "center", gap: 24 },
		});
	});

	steps.push({
		id: "configUIhelper-tour-end",
		title: "导览结束",
		text:
			"导览结束。所有选项都需要在对应页面手动点击才会保存；本导览没有修改任何设置。\n" +
			"点击任意位置关闭导览。",
		position: "center",
		advanceOn: "any",
	});

	return {
		id: "configUIhelperTour",
		name: "配置界面功能导览",
		closeOnFinish: true,
		escapable: true,
		style: {
			portraitSize: 140,
			dialogMinWidth: 420,
			dialogMaxWidth: 620,
			dialogMinHeight: 150,
			maskOpacity: 0.6,
			showProgress: true,
			showHint: true,
		},
		steps,
	};
}
