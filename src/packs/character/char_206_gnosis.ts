import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_206_gnosis", { pack: "legendSJZX",
			sex: "male",
			group: "xiemrfz",
			hp: 4,
			skills: ["newsiyongmrfz"],
		});

skill({
	newsiyongmrfz:{
		audio:["作战中1","部署1"],
		frequent(event, player) {
			const number = get.number(event.card);
			if(typeof number !== "number") return false;
			return true;
		},
		trigger:{
			player:"useCardAfter"
		},
		filter(event, player, name, target) {
			return player.isPhaseUsing() && !getSuits(player,event).includes(get.suit(event.card)!);
		},
		ai:()=>true,
		mark:true,
		intro:{
			content(storage, player, skill) {
				if(!player.isPhaseUsing()) return `·不是你的出牌阶段`;
				return `·本回合已使用的花色：${get.translation(getSuits(player,get.event()))}`
			},
		},
		prompt2(event, player) {
			return `你可以从牌堆中随机获得一张点数为${get.number(event.card)}的牌`
		},
		async content(event,trigger,player){
			const number = get.number(trigger.card);
			const card = get.cardPile(x=>get.number(x) === number);
			if(card){
				player.gain({
					cards:[card],
					animate:"gain2"
				});
			} else{
				player.chat(`牌堆中没有点数为${number}的牌！`);
			}
		},
	},
	//旧灵知
	"siyongmrfz": {
			audio: 2,
			trigger: {
				player: "loseEnd",
			},
			filter: function (event, player) {
				if (event.getParent()?.name != "useCard" || player != _status.currentPhase) return false;
				let list = player.getStorage("siyongmrfz2");
				for (let i of event.cards) {
					if (!list.includes(get.suit(i, player))) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				if (!player.storage.siyongmrfz2) player.storage.siyongmrfz2 = [];
				for (let i of trigger.cards) player.storage.siyongmrfz2.add(get.suit(i, player));
				player.storage.siyongmrfz2.sort();
				player.addTempSkill("siyongmrfz2");
				player.markSkill("siyongmrfz2");

				if (
					game.hasPlayer(function (current) {
						return current != player && current.countCards("he") > 0;
					})
				) {
					const result = await player
						.chooseTarget({
							/**
							 * "请选择一名其他角色获得其一张牌", true, function (card, player, target) {
							return target != player && target.countCards("he") > 0;
						}
							 */
							prompt:"请选择一名其他角色获得其一张牌",
							forced:true,
							filterTarget(card, player, target) {
								return target != player && target.countCards("he") > 0;
							},
						})
						.set("ai", function (target) {
							let att = get.attitude(player, target);
							if (att >= 0) return 0;
							if (
								target.countCards("he", function (card) {
									return get.value(card) > 5;
								})
							)
								return -att;
							return Math.random();
						})
						.forResult();
					if (result.targets) {
						let target = result.targets[0];
						player.gainPlayerCard({
							//1, target, "he", true
							selectButton:1,
							position:"he",
							target,
							forced:true
						});
					}
				} else {
					player.draw();
				}
			},
			forced: true,
		},
	//旧「思涌」的标记技能：上面 content 里的 addTempSkill/markSkill 都只写了引用没写定义，
	//addSkill 在 lib.skill 里查不到就直接 return，markSkill 又因取不到 intro 而返回 ⇒ 花色标记从来不显示。
	//按包里既有标记技能（如 zhumengmrfz2）的写法补上 intro；临时技能到期摘除时顺带清掉记录。
	"siyongmrfz2": {
		silent: true,
		intro: {
			content(storage) {
				return get.translation(storage) + "已用花色";
			},
		},
		onremove(player) {
			delete player.storage.siyongmrfz2;
		},
	},
});

characterTitle("char_206_gnosis",whichWayUtil.colorize("#gray#俯瞰风雪#"))

function getSuits(player:Player,event:GameEvent):string[]{
	const histories = player.getHistory("useCard",evt=>evt!==event && !!evt.card);
	const suits:string[] = [];

	for(let evt of histories){
		const suit = get.suit(evt.card);
		if(suit && !suits.includes(suit)){
			suits.push(suit);
		}
	}

	return suits;
}

translate({
	"char_206_gnosis": "灵知",
	"siyongmrfz": "思涌",
	"siyongmrfz_info": "锁定技，出牌阶段，当你首次使用一种花色的牌时，你获得其他角色的一张牌（若全场除你以外没有牌，改为你摸一张牌）。",
	"newsiyongmrfz": "思涌",
	"newsiyongmrfz_info": "当你于出牌阶段首次使用的一种花色的牌结算完成后，你可以从牌堆中随机获得一张与此牌点数相同的牌。",
});

characterIntro("char_206_gnosis", "灵知，前喀兰贸易首席技术执行官。通过喀兰贸易与罗德岛的特别协议，作为干员加入罗德岛。主导了喀兰贸易众多核心技术的开发以及工业设施的设计，同时在喀兰贸易时期就已对源石有相当深入的研究。现作为罗德岛主要研究室的一员，活跃于科研一线。");
