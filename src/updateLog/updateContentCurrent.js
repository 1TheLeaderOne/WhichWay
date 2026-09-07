import { lib, game, ui, get, ai, _status } from "noname";

let info = {
	intro: [
		// "新增成就：无",
		// "调整技能/武将：",
		// "新增干员：",
		// "新增动态皮肤：无",
		// "新增皮肤：无",
		// "新增背景：无",
		// "新增模组：无",
		"修复若叶睦【破茧】使用被废弃的API导致报错的bug",
		"修复自定义配音中意大利语url拼接错误的bug",
		"修复部分技能描述中插值表达式未正确设置的bug",
		"修复大D老师优化配音流程中误用Skill.audioname2导致的bug",
		"修复武将包无法正常关闭/仅点将不可用的bug"
		/**
		 * TODO: 给动皮适配unpackPremultipliedAlpha
		 * TODO: 嘉欣塔飞旅bug
		 */
	],
	player: ["taojinniangmrfz","migelumrfz","jiaxintamrfz","shiximrfz","shanbimrfz","spanjielinamrfz","peideluomrfz","miuyinmrfz","jixieshimrfz"],
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
