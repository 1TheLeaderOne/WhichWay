import { lib, game, ui, get, ai, _status } from "noname";

let info = {
	intro: [
		"新增干员：颉、复奏、贝洛内",
		"整合了群友（Flandre）的皮肤包",
		"删除白面鸮重复的皮肤",
		"新增“一键下载缺失配音”的功能",
		"重构WhichWayTips组件的逻辑",
		"修复覆盖无名杀API后强制将API修改成异步函数的bug",
		"修复爱国者、伊祖米克没有等待玩家选择而直接执行后续代码的bug",
		"修复海沫【泡影】调用了一个被废弃的函数导致报错的bug",
		"修复赤刃明霄陈【霄式】报错的bug和【天喟】描述与效果不符合的bug",
		"修复部分技能标记图片路径错误的bug",
		"修复部分武将使用被废弃的API（Object.isEmpty）导致报错的bug",
		"修复海霓【测绘】、裁度【名匠】、瑰盐【黠度】、小满【牧兽】仍旧使用了被废弃的API导致报错的bug",
		"修复卡牌【天坠之火】因使用StepContent导致报错的bug",
		"修复若叶睦使用被废弃的api导致报错的bug",
		"修复弑君者【烽烟】的场地效果在其阵亡后不会消失的bug",
		"修复特克诺【塑偶】无法正确切换角色的bug",
		"修复因AI修复而造成迷迭香【念手】、令【诗形】的bug"
	],
	player: ["jiemrfz","fuzoumrfz","beiluoneimrfz"],
	cards: [],
};

/* default
"新增成就：无",
"调整技能/武将：",
"新增干员：",
"新增动态皮肤：无",
"新增皮肤：无",
"新增背景：无",
"新增模组：无",
 */

export const upDataContentCurrent = info;
