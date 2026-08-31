import { whichWayTips } from "../../../tips/index.ts";
import { character, characterIntro, characterTitle, skill, translate } from "../../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

character("beiluoneimrfz", {
	hp: 4,
	group: "xumrfz",
	pack: "legendSJZX",
	skills: ["huozhimrfz", "qingsuanmrfz"],
	sex: "male",
});

characterTitle("beiluoneimrfz", "<font color = 'blue'>贝洛内家的家主</font>");

characterIntro("beiluoneimrfz","叙拉古贝洛内家族目前的家主，经干员伺夜介绍，代表贝洛内家族与罗德岛展开情报交换、商品贸易等多项合作。");

translate({
	beiluoneimrfz: "贝洛内",

	huozhimrfz: "货殖",
	huozhimrfz_info: "出牌阶段开始时，你可以弃置至多X张牌并失去等量点体力，然后你摸等量张牌，本回合你每失去你本次因此获得的牌后，你摸两张牌且本回合手牌上限+1。（X=你的体力上限）",
	qingsuanmrfz: "清算",
	qingsuanmrfz_info: "锁定技，任意角色的结束阶段，若你本回合体力值发生过变化，你回复Y点体力，并对至多Y名其他角色造成一点伤害。（Y=你本回合使用的牌的类型数）。",
});

skill({
	huozhimrfz: {
		audio: ["进驻设施", "问候"],
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("he") > 0 && player.maxHp > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard({
					prompt: get.prompt("huozhimrfz"),
					prompt2: `你可以弃置至多${player.maxHp}张牌并失去等量点体力，然后你摸等量张牌，本阶段你每失去你因此获得的牌后，你摸两张牌。`,
					selectCard: [1, player.maxHp],
					position: "he",
					ai(card) {
						const cards = ui.selected.cards;
						if (player.hp <= 1) return 0;
						if (cards.length + 1 >= player.hp) return 0;
						return 7 - get.value(card);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.loseHp(cards.length);
			await player.discard({ cards: cards });
			const result = await player.draw(cards.length).forResult();

			if (result.cards) {
				setCards(player, result.cards);
			}
		},
		subSkill: {
			effect: {
				audio: "huozhimrfz",
				charlotte: true,
				forced: true,
				trigger: {
					player: "loseAfter",
				},
				filter(event, player) {
					return getCards(player).some(card => event.cards.includes(card));
				},
				async content(event, trigger, player) {
					let cards = trigger.cards.filter(card => getCards(player).includes(card));
                    let num = cards.length;

                    cards.forEach(card=>whichWayTips.removePrompt(card,"huozhimrfz_effect"));

                    while (num--){
                        await player.draw(2);
                        player.when({global:"phaseAfter"})
                           .step(async (event,trigger,player)=>{})
                           .assign({
                                mod:{
                                    maxHandcard(player, num){
                                        return num += 1;
                                    }
                                },
                           })
                    }
				},
			},
		},
	},
    qingsuanmrfz:{
        init(player){
            player.storage.qingsuanmrfz_changed = false;
        },
        onremove(player, type) {
            delete player.storage.qingsuanmrfz_changed;
        },
        audio:["作战中2","作战中3"],
        forced:true,
        trigger:{
            global:"phaseJieshuAfter"
        },
        filter(event,player){
            return player.storage.qingsuanmrfz_changed === true && getY(player) > 0;
        },
        async content(event,trigger,player){
            const num = getY(player);
            await player.recover({num});

            const { targets } = await player.chooseTarget({
                prompt:`【清算】:对至多${num}名其他角色造成一点伤害`,
                filterTarget:lib.filter.notMe,
                selectTarget:[0,num],
                ai(target) {
                    const player = get.player();
                    if(get.attitude(player, target) > 0) return 0;
                    return - target.hp;
                },
            }).forResult();

            if(targets){
                targets.forEach(target=>target.damage({source:player}));
            }
        },
        group:["qingsuanmrfz_mark","qingsuanmrfz_clear"],
        subSkill:{
            mark:{
                charlotte:true,
                silent:true,
                trigger:{player:"changeHpAfter"},
                filter(event,player){
                    return player.storage.qingsuanmrfz_changed === false;
                },
                async content(event,trigger,player){
                    player.storage.qingsuanmrfz_changed = true;
                },
            },
            clear:{
                charlotte:true,
                silent:true,
                trigger:{global:"phaseAfter"},
                async content(event,trigger,player){
                    player.storage.qingsuanmrfz_changed = false;
                },
            },
        },
    },
});

//清算
function getY(player: Player): number {
    return new Set(player.getHistory("useCard").map(evt=>evt.cards.map(card=>get.type2(card))).flat()).size;
}

//货殖
let addRemoveTips:boolean = false;

function getCards(player: Player): Card[] {
	player.storage.huozhimrfz ??= [];
	return player.storage.huozhimrfz;
}

function setCards(player: Player, cards: Card[]): void {
    if(addRemoveTips === false){
        player.when({global:"phaseAfter"})
            .step(async (event,trigger,player)=>{
                addRemoveTips = false;
                const cards:Card[] = [];
                game.players.forEach(p=>cards.push(...p.getCards("hesx")));
                cards.forEach(card=>whichWayTips.removePrompt(card,"huozhimrfz_effect"));

                player.storage.huozhimrfz = [];
            })
    }
    addRemoveTips = true;

    if(!player.hasSkill("huozhimrfz_effect")){
        player.addTempSkill("huozhimrfz_effect",{global:"phaseAfter"});
    }

    player.storage.huozhimrfz ??= [];
	player.storage.huozhimrfz.push(...cards);
    cards.forEach(card=>{
        whichWayTips.addPrompt(card, "失去后摸牌","huozhimrfz_effect")
    })
}
