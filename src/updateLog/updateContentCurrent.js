import { lib, game, ui, get, ai, _status } from "noname";

let info = {
	intro: [
		"调整技能/武将：", 
		"新增干员：", 
		"新增动态皮肤：无", 
		"新增皮肤：无", 
		"新增背景：无", 
		"新增模组：无",
		"修复明日方舟武将样式卡阵营没有正确显示的bug",
		"修改了武将图片路径获取的方式,增强了兼容性",
		"修复酒神、顾烛煌【燎原】仍旧使用已经废弃的API的bug",
		"修复模组图标无法正常显示的bug",
		"将所有的StepContent改为AsyncContent",
		"修复PlayerExt和CardExt未被正确注入的bug",

	],
	player: [],
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
