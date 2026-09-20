import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "aiguisimrfz";

character(NAME,{
    skills:["zhenyingmrfz","kailaimrfz"],
    sex:"female",
    hp:3,
    group:"othermrfz",
    pack:"epicSJZX"
});

characterIntro(NAME,"埃癸斯，1102年3月于中庭公证所登记为第三类驻留人员，根据拉特兰公民权利章程附录第三十六条、入境人员管理条例第二章第五条，由圣马尔索综合学校接收入学。<br>教师评语：埃癸斯同学聪明好学，认真严谨，富有责任心，自我要求严格，在类铳型武装系列课程中取得了不俗的成绩。望能敞开心扉，更多地尝试集体活动，在学习进步之余，亦能享受美好的校园生活。");
characterTitle(NAME,whichWayUtil.colorize("#r战车#"));
translate({
    [NAME]:"埃癸斯",

    zhenyingmrfz:"镇影",
    "zhenyingmrfz_info":"锁定技，游戏开始时，你将一张手牌（称为牌A）随机置入牌堆，然后获得下列效果：<br>1.当牌A离开牌堆时，你移除【镇影】给予的所有效果、失去一点体力并发动一次【镇影】;<br>2.你不能使用手牌中与牌A相同牌名的牌;<br>3.与牌A类别相同的牌不计入手牌上限。",
    kailaimrfz:"开来",
    "kailaimrfz_info":"当你不因【开来】而使用牌时，你可以摸并弃置一张牌，若你弃置的牌与你此次使用牌的花色[相同/不同]，你[使用/改为使用]弃置的牌。",
});

skill({
    zhenyingmrfz:{
        audio:["观看作战记录","精英化晋升2"]
    },
    kailaimrfz:{
        audio:["作战中1","作战中2","作战中3","作战中4"],
    },
})