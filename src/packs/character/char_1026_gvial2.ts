import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";
import { whichWayFile } from "../../file.js";

character("char_1026_gvial2", { pack: "legendSJZX", sex: "female", group: "luomrfz", hp: 4, skills: ["xinglinmrfz", "duanliumrfz", "conghunmrfz"] });

skill({
	xinglinmrfz: {
		audio: ["任命队长", "精英化晋升1"],
		trigger: {
			player: "recoverAfter",
		},
		filter(event, player, name, target) {
			return !player.hasSkill("xinglinmrfz_round");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("xinglinmrfz"),
					prompt2: "你可以令一名角色回复一点体力",
					filterTarget: () => true,
					ai(target) {
						const player = get.player();
						let val = -1;
						if (get.attitude2(target) < 0) val -= 100;
						if (target.getDamagedHp() > 0) {
							val += Math.random();
							if (target.hp < 3) val += 2;
							if (target === player) val += 1;
						}
						return val;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			event.targets[0].recover();
			player.addTempSkill("xinglinmrfz_round",{global:"roundEnd"});
		},
		subSkill:{
			round:{
				silent:true,
				charlotte:true,
				intro:{
					content:"·【杏林】已发动"
				},
			},
		},
	},
	duanliumrfz: {
		audio: ["作战中2","作战中3"],
		trigger: { player: "useCardToPlayered" },
		filter: function (event, player) {
			if (event.targets.length > 1) return false;
			return event.card.name == "sha" && event.target.countCards("he") > 0;
		},
		direct: true,
		async content(event, trigger, player) {
			let result;

			// step 0
			const cards = trigger.target.getCards("hej");
			const list:any[] = [];
			let num = 0;
			for (const card of cards) {
				list.add(get.suit(card, player));
			}
			for (const suit of lib.suit) {
				if (list.includes(suit)) num++;
			}
			result = await player
				.choosePlayerCard({
					target: trigger.target,
					position: "he",
					selectButton: [1, Math.min(trigger.target.countCards("he"), num)],
					prompt: get.prompt("duanliumrfz", trigger.target) + "(可选" + num + "张牌)",
				})
				.set("forceAuto", true)
				.forResult();

			// step 1
			if (result.links && result.links.length) {
				const target = trigger.target;
				//@ts-ignore
				player.logSkill("duanliumrfz", target);
				const next = player.addToExpansion({ cards: result.cards, animate: "giveAuto", source: player });
				next.gaintag.add("duanliumrfz2");
				await next;
				player.addSkill("duanliumrfz2");
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter: function (player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) return false;
				if (tag == "directHit_ai") return arg.target.countCards("h") < 2;
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
				return false;
			},
		},
	},
	duanliumrfz2: {
		intro: {
			markcount: "expansion",
			mark: function (dialog, storage, player) {
				let cards = player.getExpansions("duanliumrfz2");
				if (player.isUnderControl(true)) dialog.addAuto(cards);
				else return "共有" + get.cnNumber(cards.length) + "张牌";
			},
		},
		trigger: { player: "useCardAfter" },
		forced: true,
		filter: function (event, player) {
			if (event.card.name != "sha") return false;
			return player.getExpansions("duanliumrfz2").length > 0;
		},
		async content(event, trigger, player) {
			const history = player.getHistory("sourceDamage", function (evt) {
				return evt.card == trigger.card;
			}).length;
			const cards = player.getExpansions("duanliumrfz2");
			let result;
			if (history > 0) {
				result = await player
					.chooseButton({ createDialog: ["你可以至多获得两张牌", cards], selectButton: [0, Math.min(2, cards.length)], forced: true })
					.set("ai", function (button) {
						return get.value(button.link, _status.event.player);
					})
					.forResult();
			} else {
				result = await trigger.targets[0]
					.chooseButton({ createDialog: ["你可以至多获得两张牌", cards], selectButton: [0, Math.min(2, cards.length)], forced: true })
					.set("ai", function (button) {
						return get.value(button.link, _status.event.player);
					})
					.forResult();
			}
			if (result.bool) {
				if (history > 0) await player.gain({ cards: result.links, animate: "gain2" });
				else await trigger.targets[0].gain({ cards: result.links, animate: "gain2" });
				cards.removeArray(result.links);
			}
			player.loseToDiscardpile({ cards });
			player.removeSkill("duanliumrfz2");
		},
	},
	//锁定技，当你受到伤害后，你取消之，并获得等量的“坚韧”标记;任意角色的回合开始和结束时，若你有“坚韧”，你移除一个“坚韧”标记并流失一点体力。
	conghunmrfz:{
		audio:["选中干员2","部署1"],
		onremove:true,
		trigger:{
			player:"damageBegin4"
		},
		markimage:whichWayFile.compilePath("skill:conghunmrfz_gavial.png"),
		intro:{
			name:"坚韧",
			content(storage, player, skill) {
				let texts = [`·有${storage}个“坚韧”标记`];
				if(typeof storage === "number" && player.hp <= storage){
					texts.push("·这花呗还还的起吗？");
				}
				if(typeof storage === "number" && (player.hp * 2) <= storage){
					texts.push("·有的人还活着，但她已经死了");
				}
				return texts.join("<br>");
			},
		},
		filter(event, player, name, target) {
			return event.num > 0;
		},
		async content(event,trigger,player){
			trigger.cancel();
			player.addMark("conghunmrfz",trigger.num);
		},
		group:"conghunmrfz_lose",
		subSkill:{
			lose:{
				audio:"conghunmrfz",
				forced:true,
				trigger:{
					global:["phaseBeginStart","phaseEnd"]
				},
				filter(event, player, name, target) {
					return player.hasMark("conghunmrfz");
				},
				async content(event,trigger,player){
					await player.loseHp();
					player.removeMark("conghunmrfz");
				},
			},
		},
	},
});

dynamicTranslate("xinglinmrfz",(player)=>{
	const info = get.skillInfoTranslation("xinglinmrfz");
	return player.hasSkill("xinglinmrfz_round") ? whichWayUtil.colorize(`#s${info}#`) : info;
})

translate({
	char_1026_gvial2: "百炼嘉维尔",
	char_1026_gvial2_prefix: "百炼",
	// yixuemrfz: "医学",
	// yixuemrfz_info: "锁定技，每轮限一次，当你回复体力时，回复值+1。",
	xinglinmrfz: "杏林",
	xinglinmrfz_info: "每轮限一次，当你回复体力后，你可以令一名角色回复一点体力。",
	duanliumrfz: "断流",
	duanliumrfz_info: "当你使用的【杀】指定目标后且目标数不大于1，你可以将目标角色的X张牌置于你的武将牌上，若此杀造成了伤害，你可以至多获得你武将牌上的两张牌，否则，目标角色至多获得你武将牌上的两张牌，然后弃置你武将牌上的牌。（X=目标角色区域内牌的花色数）",
	conghunmrfz: "丛魂",
	conghunmrfz_info: "锁定技，当你受到伤害后，你取消之，并获得等量的“坚韧”标记;任意角色的回合开始和结束时，若你有“坚韧”，你移除一个“坚韧”标记并流失一点体力。",
	duanliumrfz2: "锯袭",
});

characterIntro("char_1026_gvial2", "嘉维尔，现在仍是罗德岛医疗部的一员，但在罗德岛需要她发挥自己的战斗力而非医学素养的时候，她也会拿起战斧，冲锋陷阵。");

characterTitle("char_1026_gvial2", "斧底回春");
