import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, card, cardSkill, cardTranslate } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";
// 时隙 3
// 飞声：使命技，出牌阶段开始时，你可以将一张牌作为【通讯塔】置入你或与装备【通讯塔】的角色距离为1的角色的装备区。
// 成功：回合结束时，场上有四张【通讯塔】：摸一张牌。
// 咫行：锁定技。①当你不因【咫行】而摸牌后，你令所有拥有【咫行】的角色制衡1；②当你使命技成功后，你重置该技能。
/**
 * 通讯塔 宝物 ♠13
锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。
 */

const NAME = "shiximrfz";
const TOWER = "tower_shiximrfz";

character(NAME,{
    sex:"female",
    group:"leimrfz",
    hp:3,
    pack:"epicSJZX",
    skills:["feishengmrfz","zhixingmrfz"],
});

characterTitle(NAME,whichWayUtil.colorize("#b不一样的梦想#"));
characterIntro(NAME,"时隙,通讯技术工程师，其研究成果已应用于雷姆必拓远程通讯系统。现加入罗德岛工程部，为罗德岛基地远程通讯提供技术支持。");

translate({
    [NAME]:"时隙",

    feishengmrfz:"飞声",
    "feishengmrfz_info":"使命技，出牌阶段开始时，你可以将一张手牌作为【通讯塔】置入你或与装备【通讯塔】的角色距离为1的角色的装备区。<br>成功：回合结束时，场上存在【通讯塔】：摸X张牌。（X=场上拥有【通讯塔】角色的数量，X至多为你的体力上限）"
})

skill({
    feishengmrfz:{
        audio:["部署1","部署2"],
        dutySkill:true,
        trigger:{
            player:"phaseUseBegin"
        },
        filter(event, player, name, target) {
            return player.countCards("h")>0 && getUsableTower(player).length>0;
        },
        async cost(event, trigger, player) {
            const result = await player.chooseCardTarget({
                prompt:get.prompt("feishengmrfz"),
                prompt2:"你可以将一张手牌作为【通讯塔】置入你或与装备【通讯塔】的角色距离为1的角色的装备区",
                position:"h",
                filterCard:()=>true,
                filterTarget(card, player, target) {
                    return getUsableTower(player).includes(target)&&target.canEquip(TOWER);
                },
                ai1(card) {
                    return 8 - get.value(card);
                },
                ai2(target) {
                    return get.attitude2(target);
                },
            }).forResult();
            event.result = {
                ...result,
                cost_data:{
                    cards:result.cards,
                    targets:result.targets
                }
            }
        },
        async content(event,trigger,player){
            const { cards , targets } = event.cost_data as Result;
            const target = targets[0];
            const card = new lib.element.VCard({name:TOWER,cards:cards});
            await target.equip({card:card});
        },
        group:["feishengmrfz_achieve"],
        subSkill:{
            achieve:{
                audio:"feishengmrfz",
                forced:true,
                trigger:{
                    player:"phaseEnd"
                },
                filter(event, player, name, target) {
                    return game.countPlayer(char=>char.countCards("e",card=>get.name(card)===TOWER)>0)>0;
                },
                async content(event,trigger,player){
                    const num = Math.min(player.maxHp,game.countPlayer(char=>char.countCards("e",card=>get.name(card)===TOWER)>0));
                    await player.draw(num);
                    game.log(player, "成功完成使命");
					player.awakenSkill("feishengmrfz");
                },
            },
        },
    },
});

card(TOWER,{
    audio:false,
    image: `ext:WhichWay/image/card/baitiemrfzcard1.jpg`,
	type: "equip",
	subtype: "equip5",
	skills: [`${TOWER}_skill`],
	ai: {
		basic: {
			equipValue: 7,
		},
	},
});

cardSkill({
    [`${TOWER}_skill`]:{
        audio:false,
    },
});

cardTranslate({
    [TOWER]:"通讯塔",
    [`${TOWER}_info`]:"宝物·♠13。锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
    [`${TOWER}_skill`]:"通讯塔",
    [`${TOWER}_skill_info`]:"锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。"
})

function getUsableTower(player:Player):Player[] {
    const results:Set<Player> = new Set();
    if(player.countCards("e",card=>get.name(card) === TOWER)<1){
        results.add(player);
    }
    for(let target of game.players.slice()){
        if(!target.countCards("e",card=>get.name(card) === TOWER)) continue;
        game.filterPlayer(char=>get.distance(char,target)<=1).forEach(c=>results.add(c));
    }
    return Array.from(results);
}