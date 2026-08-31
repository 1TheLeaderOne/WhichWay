import { whichWayUtil } from "../../../utill.js";
import { character, characterIntro, characterTitle, skill, translate } from "../../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

character("fengxumrfz", {
	hp: 3,
	maxHp: 3,
	skills: ["fengxumrfz_youyimrfz", "piaolingmrfz"],
	pack: "epicSJZX",
	group: "samrfz",
	sex: "male",
});

characterTitle("fengxumrfz", whichWayUtil.colorize(`#b何处着#`));

translate({
	fengxumrfz: "风絮",

	fengxumrfz_youyimrfz: "游医",
	fengxumrfz_youyimrfz_info: "其他角色获得你获得过的牌后，你可以使用一张牌、摸一张牌且令一名其他角色回复一点体力，然后此牌视为你没有获得过。",
	piaolingmrfz: "飘零",
	piaolingmrfz_info:
		"任意角色回合结束后，若你本回合使用过有点数的牌，你可以展示弃牌堆顶的X张牌，任意角色可选择展示其手牌中与展示的牌同名的牌，然后你与其摸一张牌并将展示牌中与此同名的牌插入牌堆中。（X=你本回合最后一张使用的有点数的牌的点数）",
});

skill({
	fengxumrfz_youyimrfz: {
		audio: ["编入队伍", "选中干员1"],
		init(player, skill) {
			player.storage[skill] = [];
            game.broadcastAll(function(){
                lib.translate["fengxumrfz_youyimrfz_mark"] = "游医·获得过"
            })
		},
		onremove(player,skill){
            delete player.storage[skill];
            game.players.forEach(char=>char.removeGaintag("eternal_fengxumrfz_youyimrfz_mark"));
            for(const i of Array.from(ui.discardPile.children)){
                let card:Card = i as Card;
                card.removeGaintag("eternal_fengxumrfz_youyimrfz_mark");
            }
            for(const i of Array.from(ui.cardPile.children)){
                let card:Card = i as Card;
                card.removeGaintag("eternal_fengxumrfz_youyimrfz_mark");
            }
        },
		trigger: {
			global: "gainAfter",
		},
		filter(event, player) {
			const cards: string[] = player.storage.fengxumrfz_youyimrfz;
			return event.cards && event.cards.some(card=>cards.includes(getCardID(card))) && event.player!== player;
		},
        async content(event,trigger,player){
            trigger.cards.forEach(card=>{
                if(player.storage.fengxumrfz_youyimrfz.includes(getCardID(card))){
                    player.storage.fengxumrfz_youyimrfz.remove(getCardID(card));
                    card.removeGaintag("eternal_fengxumrfz_youyimrfz_mark");
                }
            })

            await player.draw();

            if(game.hasPlayer(char=>char.getDamagedHp()>0 && char!==player)){
                const { targets:[target] = [] } = await player.chooseTarget()
                .set("prompt",`【游医】:你可以令一名其他角色回复一点体力、模一张牌且使用一张牌`)
                .set("filterTarget",(card,player,target:Player)=>player!==target&&target.getDamagedHp()>0)
                .set("ai",(target:Player)=>{
                    const player = get.player();
                    if(get.attitude(player,target)<0) return -1;
                    return target.getDamagedHp() + get.attitude(player,target);
                }).forResult();
                if(target && target.isAlive()) target.recover();
            }

            await player.chooseToUse()
                .set("prompt",`【游医】:你可以使用一张手牌`);
        },
        group:["fengxumrfz_youyimrfz_mark"],
		subSkill: {
			mark: {
				charlotte: true,
				silent: true,
				trigger: { player: "gainAfter" },
				filter(event, player) {
					const cards: string[] = player.storage.fengxumrfz_youyimrfz;
					return event.cards && event.cards.some(card=>!cards.includes(getCardID(card)));
				},
                async content(event,trigger,player){
                    trigger.cards.filter(card=>!player.storage.fengxumrfz_youyimrfz.includes(getCardID(card))).forEach(card=>{
                        player.storage.fengxumrfz_youyimrfz.push(getCardID(card))
                        card.addGaintag("eternal_fengxumrfz_youyimrfz_mark");
                    });
                    
                },
			},
		},
	},
	piaolingmrfz: {
		audio: ["进驻设施", "行动出发", "观看作战记录"],
        trigger:{global:"phaseEnd"},
        filter(event,player){
            return getNumber(player)!==undefined && ui.discardPile.children.length>0;
        },
        prompt2(event,player){
            return whichWayUtil.colorize(`你可以展示弃牌堆顶的#r${getNumber(player)}#张牌，任意角色可选择展示其手牌中与展示的牌同名的牌，然后你与其摸一张牌并将展示牌中与此同名的牌插入牌堆中。`)
        },
        async content(event,trigger,player){
            const num = getNumber(player) as number;
            const cards: Card[] = [];
            for(let i=0;i<num;i++){
                if(ui.discardPile.children.length>0){
                    let card = get.discardPile(true,"top") as Card;
                    cards.push(card);
                    await game.cardsGotoOrdering([card]);
                }
            }

            if(cards.length<1) return;

            player.showCards(cards)
                .set("prompt",`【飘零】:展示了${cards.length}张牌`);

            let names = Array.from(new Set(cards.map(card=>card.name)));

            for(const char of game.players.sortBySeat(_status.currentPhase)){
                const { cards:[card] = [] } = await char.chooseCard()
                    .set("prompt",`【飘零】:你可以展示一张牌，${names.length>1 ? `若牌名为${get.translation(names)}中的一个，${char === player ? "你" : get.translation(player)}可执行一些操作` : "然后无事发生"}`)
                    .set("ai",(card:Card)=>{
                        const player = get.player(),target = get.event().target;
                        const names:string[] = get.event().names;
                        if(get.attitude(player,target)<0) return -1;
                        if(names.includes(card.name)) return 1;
                        return -1;
                    })
                    .set("target",player)
                    .set("names",names)
                    .forResult();
                if(!card) continue;
                if(!names.includes(card.name)) continue;
                await char.showCards([card])
                    .set("prompt",`${get.translation(char)}展示了一张牌`);

                await game.asyncDraw([char,player].sortBySeat(_status.currentPhase),1);
                
                const removes = cards.filter(c=>c.name===card.name);
                cards.remove(...removes);
                
                await game.cardsGotoPile(removes)
                    .set("insert_index",()=>{
                        return ui.cardPile.childNodes[get.rand(0,ui.cardPile.childNodes.length-1)]
                    });
                
                game.log(removes,`被随机插入到牌堆之中`);
                
                names = Array.from(new Set(cards.map(card=>card.name)))
            }

            await game.cardsDiscard(cards);
        },
	},
});

function getCardID(card: Card | VCard): string {
	return card.cardid;
}

function getNumber(player:Player): number | undefined {
    if(player.getHistory("useCard",evt=>typeof evt.card.number === "number").length<1) return undefined;
    const evt = player.getHistory("useCard",evt=>typeof evt.card.number === "number")[player.getHistory("useCard",evt=>typeof evt.card.number === "number").length-1];
    return evt.card.number;
}