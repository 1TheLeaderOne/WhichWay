import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";


const resigter = (name = "char_393_toledo") => {
    character(name,{
        hp:3,
        sex:"female",
        skills:["guizhoumrfz","weiyanmrfz","weiyimrfz"],
        group:"yimrfz",
        pack:"epicSJZX",
        designer:["Flandre"],
        llm:"Qwen-3.8-Flash"
    });

    characterTitle(name,whichWayUtil.colorize("#blue#“贵胄血脉”#"));
    characterIntro(name,"自称伊比利亚王室海军将领后裔、失落的贵族——德·托莱多家族成员，在伊比利亚各地招揽了一大批拥护者。但由于该干员口述的经历与审判庭档案记录严重不符，她的职业在人事部重新登记时，被划定为自由职业。德·托莱多由干员艾丽妮推荐加入罗德岛。她的口才和对伊比利亚的了解，足以辅助伊比利亚办事处的干员完成基础工作。");

    translate({
        [name]:"托莱多",

        guizhoumrfz:"贵胄",
        "guizhoumrfz_info":"锁定技，游戏开始时，你从每个势力中随机获得两个主公技；你发动主公技时，无视其发动条件中的身份和势力限制;当你失去主公技后，你令一名角色选择摸两张牌或回复一点体力，若该角色不是你，你执行一次相同的效果。",
        weiyanmrfz:"危言",
        "weiyanmrfz_info":`锁定技，出牌阶段开始时，你选择失去一个主公技或失去一点体力上限，然后你对一名其他角色造成一点伤害。`,
        weiyimrfz:"伪裔",
        "weiyimrfz_info":`主公技，每轮开始时，根据你拥有势力的主公技数获得下列效果：<br>1.手牌上限+1;<br>2.额定摸牌数+1;<br>3.视为拥有${get.poptip("bahu")};<br>4.视为拥有${get.poptip("huozhong")}。`,
    })

    skill({
        guizhoumrfz:{
            audio:["作战中2","作战中3"],
        },
        weiyanmrfz:{
            audio:["选中干员1","作战中4"],
        },
        weiyimrfz:{
            audio:["行动出发","部署1"],
        },
    });
}

resigter();