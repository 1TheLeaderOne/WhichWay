import { lib, game, ui, get, ai, _status } from "noname";

let info = {
	intro: [
		// "新增成就：无",
		"调整技能/武将：嘉欣塔【飞旅】",
		// "新增干员：",
		// "新增动态皮肤：无",
		// "新增皮肤：无",
		// "新增背景：无",
		// "新增模组：无",
		"修复嘉欣塔【飞旅】成功一次后只需要使用一次即可完成的bug",
		"优化ACE【死战】复活部分代码混乱、保存者技能代码混乱的问题",
		"修复若叶睦【破茧】、海蒂【暗信】使用被废弃的API导致报错的bug",
		"修复佩佩【莲纹】受到无伤害来源的伤害时报错的bug",
		"修复自定义配音中意大利语url拼接错误的bug",
		"修复部分技能描述中插值表达式未正确设置的bug",
		"修复大D老师优化配音流程中误用Skill.audioname2导致的bug",
		"修复武将包无法正常关闭/仅点将不可用的bug",
		"为动皮适配unpackPremultipliedAlpha",
		"添加“驶舰之向”启动页面"
		/**
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
