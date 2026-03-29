import { whichWayUtil } from "../../../utill.js";
import { character, characterIntro, characterTitle, skill, translate } from "../../hooks.ts";
import { get, game, lib, ui, Game } from "noname";

character("fuzoumrfz", {
    sex:"female",
    group:"laimrfz",
    skills:["mutuanmrfz","hengzoumrfz"],
    hp:4,
    pack:"epicSJZX",
})

characterTitle("fuzoumrfz", whichWayUtil.colorize(`#r职业经理#`));

translate({
    fuzoumrfz:"复奏",

    mutuanmrfz:"募团",
    mutuanmrfz_info:"出牌阶段，你可以明置所有的黑色手牌并摸一张牌。",

    hengzoumrfz:"恒奏",
    hengzoumrfz_info:"锁定技，你明置的手牌：<br>1.造成伤害后从牌堆中获得一张黑色牌且此牌的已使用次数-1;<br>2.相同牌名的牌于弃牌阶段计算手牌上限时仅计算一次。",
})
window.whichWaySave.tmpSave.hengzoumrfz_discard ??= [];
let needDiscards:string[] = window.whichWaySave.tmpSave.hengzoumrfz_discard;

skill({
    hengzoumrfz:{
        audio:["作战中3","作战中4"],
        forced:true,
        trigger:{
            source:"damageSource"
        },
        filter(event, player, name, target) {
            return player.getHistory("lose",(evt:GameEvent)=>event.cards.map(i=>i.cardid).some((id:any)=>evt.gaintag_map[id]?.includes("visible_mutuanmrfz"))).length>0;
        },
        async content(event,trigger,player){
            const card = get.cardPile(card=>get.color(card)==="black");
            if(card){
                player.gain(card);
            } else {
                player.chat("牌堆中没有黑色牌!");
            }

            if(player.getStat("card")?.[trigger.card.name]){
                player.getStat("card")[trigger.card.name] --;
            }
        },
        group:"hengzoumrfz_discard",
        subSkill:{
            discard:{
                charlotte:true,
                silent:true,
                trigger:{
                    player:"phaseDiscardBegin"
                },
                async content(event,trigger,player){
                    needDiscards = Array.from(new Set(player.getCards("h",card=>get.is.shownCard(card)).map(i=>i.name)));
                },
            },
        },
        mod:{
            ignoredHandcard(card, player, current) {
                if(needDiscards.includes(card.name)){
                    needDiscards.remove(card.name);
                    return false;
                }

                if(get.is.shownCard(card)&&!needDiscards.includes(card.name)){
                    return true;
                }
            },
        },
    },
    mutuanmrfz:{
        init(player, skill) {
            game.broadcastAll(()=>{
                lib.translate["visible_mutuanmrfz"] = "明置";
            })
        },
        frequent:true,
        audio:["选中干员2","部署2"],
        enable:"phaseUse",
        filter(event,player){
            return player.countCards("h",card=>!get.is.shownCard(card)&&get.color(card) === "black")>0;
        },
        filterCard(card,player){
            return get.color(card) === "black"&&!get.is.shownCard(card);
        },
        selectCard:-1,
        discard:false,
        lose:false,
        delay:0,
        async content(event,trigger,player){
            const cards = event.cards;
            await player.addShownCards(cards,"visible_mutuanmrfz");
            await player.draw();
            
            const skill:Required<Skill> = lib.skill.mutuanmrfz;


            if(!lib.config.autoskilllist.includes("mutuanmrfz") && skill.filter(event,player)){
                const next = game.createEvent("mutuanmrfz");
                next.player = player;
                next.cards = player.getCards("h").filter(i=>skill.filterCard(i));
                next.setContent(skill.content)
            }
        },
        ai:{
            order:13,
            result:{
                player:1,
            },
        },
    },
})