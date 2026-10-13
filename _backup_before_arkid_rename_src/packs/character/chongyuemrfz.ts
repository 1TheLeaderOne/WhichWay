import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";

character("chongyuemrfz", { pack: "legendSJZX", sex: "male", group: "suimrfz", hp: 3, skills: ["shubianmrfz", "wubenmrfz", "wowumrfz"] });

skill({
	wubenmrfz: {
		mod: {
			cardUsable: function (card, player, num) {
				if (card.name == "sha" && !player.getEquip(1)) return num + 1;
			},
			maxHandcard: function (player, num) {
				if (!player.getEquip(1)) return num + 1;
			},
		},
		audio: ["行动开始", "选中干员1", "选中干员2"],
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player, name, target) {
			const card = { name: "sha" };
			return !player.getEquip(1) && player.hasUseTarget(card, true);
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", `###${get.prompt("wubenmrfz")}###出牌阶段开始时，你可以将一张手牌当【杀】使用（不计入使用次数）`);
			next.set("norestore", true);
			next.set("_backupevent", "wubenmrfz_backup");
			next.set("addCount", false);
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.set("logSkill", "wubenmrfz");
			next.backup("wubenmrfz_backup");
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
				},
				selectCard: 1,
				position: "h",
				ai1(card) {
					let player = get.player();
					let maxVal = 5.5;
					return maxVal - get.value(card);
				},
				log: false,
			},
		},
	},

	wowumrfz: {
		onremove: true,
		derivation: "wowumrfz_rewrite",
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		mark:true,
		intro:{
			content(storage, player, skill) {
				if(isChanged(player)){
					return `<span class=firetext>【气收秋毫平】</span></br>·已累计使用/打出${getCount(player,get.event(),"all")}张牌`
				}
				return `<span class=firetext>【劲发江潮落】</span></br>·已累计使用${getCount(player,get.event(),"useCard")}张牌<br>·已累计使用${player.getAllHistory("useSkill",evt=>evt.skill === "wowumrfz").length}次【我无】`
			},
		},
		filter(event, player, name, target) {
			const card = get.autoViewAs({ name: "sha" });
			//修改后
			if (isChanged(player)) {
				return player.hasUseTarget(card, false, false) && getCount(player,event,"all") %3 === 0;
			}
			//修改前
			return event.name === "useCard" && player.hasUseTarget(card, true ,false)&& getCount(player,event,"useCard") %3 === 0;
		},
		prompt2(event, player) {
			return isChanged(player) ? "视为使用一张无距离限制且不计入次数的【杀】，然后你摸一张牌" : "视为使用一张不计入次数的【杀】，若此【杀】造成了伤害，你摸一张牌";
		},
		async content(event,trigger,player){
			const card = get.autoViewAs({ name: "sha" , storage:{wowumrfz:true},isCard:true});
			await player.chooseUseTarget({
				card,
				forced:true,
				prompt:isChanged(player) ? "视为使用一张无距离限制且不计入次数的【杀】，然后你摸一张牌" : "视为使用一张不计入次数的【杀】，若此【杀】造成了伤害，你摸一张牌"
			})
			.set("addCount",false)
			.set("nodistance",!isChanged(player));
			if(isChanged(player)){
				player.draw();
				player.logSkill("wowumrfz");
			}
		},
		group:["wowumrfz_draw","wowumrfz_change"],
		subSkill:{
			draw:{
				audio:"wowumrfz",
				trigger:{
					source:"damageSource"
				},
				filter(event, player, name, target) {
					return event.card && event.card.name === "sha" && event.card.storage.wowumrfz && !isChanged(player);
				},
				charlotte:true,
				forced:true,
				async content(event,trigger,player){
					player.draw();
				},
			},
			change:{
				silent:true,
				charlotte:true,
				trigger:{
					player:"wowumrfzAfter"
				},
				filter(event, player, name, target) {
					return !isChanged(player) && player.getAllHistory("useSkill",evt=>evt.skill === "wowumrfz").length >= 5;
				},
				async content(event,trigger,player){
					player.logSkill("wowumrfz");
					player.popup("修改【我无】");
					player.storage.wowumrfz = true;
				},
			},
		},
	},

	shubianmrfz: {
		audio: ["部署1", "部署2"],
		trigger: { player: "damageEnd" },
		filter: function (event, player) {
			return event.source != player && event.source.isAlive() && event.source != undefined;
		},
		check(event, player) {
			return get.attitude(player, event.source) < 0;
		},
		async content(event, trigger, player) {
			let source = trigger.source;
			source.addTempSkill("shubianmrfz_eff", { global: "phaseAfter" });
			source.markSkill("shubianmrfz_eff");
			if (source.countDiscardableCards(player, "e")) {
				player
					.discardPlayerCard({
						position:"e",
						target:source
					})
					.set("complexSelect", true)
					.set("ai", lib.card.guohe.ai.button)
					.set("prompt", `你可以弃置${get.translation(source)}装备区的一张牌`);
			}
		},
		subSkill: {
			eff: {
				charlotte: true,
				silent: true,
				mark: true,
				intro: {
					content: "·手牌上限+2<br>·无法使用手牌中的伤害类牌",
				},
				onremove(player) {
					player.unmarkSkill("shubianmrfz_eff");
				},
				mod: {
					maxHandcard: function (player, num) {
						return (num += 2);
					},
					cardEnabled2(card, player) {
						if (get.position(card) === "h" && get.tag(card, "damage")) {
							return false;
						}
					},
				},
			},
		},
		ai: {
			threaten: 0.8,
		},
	},
});

translate({
	chongyuemrfz: "重岳",
	wubenmrfz: "武本",
	wubenmrfz_info: "锁定技，当你武器栏为空时，你：<br>1.【杀】的使用次数和手牌上限+1;<br>2.出牌阶段开始时，你可以将一张手牌当【杀】使用（不计入使用次数）。",
	wowumrfz: "我无",
	wowumrfz_info: "<span class=firetext>【劲发江潮落】</span></br>①你的回合内，你每使用三张牌可视为使用一张【杀】（不计入次数），若此【杀】造成了伤害，你摸一张牌。<br>②锁定技，当你本局游戏累计发动5次【我无】时，修改此技能。",
	wowumrfz_rewrite: "我无·修改",
	wowumrfz_rewrite_info: "<span class=firetext>【气收秋毫平】</span></br>每当你累计使用或打出三张牌时，你可以视为使用一张【杀】（不计入次数且无距离限制），然后你摸一张牌。",
	shubianmrfz: "戍边",
	shubianmrfz_info: "当你受到其他角色造成的伤害后，你可以令伤害来源本回合手牌上限+2（不可叠加）且无法使用手牌中的伤害类牌，然后你可以弃置伤害来源装备区的一张牌。",
});

dynamicTranslate("wowumrfz",player=>{
	return isChanged(player) ? "<span class=firetext>【气收秋毫平】</span></br>每当你累计使用或打出三张牌时，你可以视为使用一张【杀】（不计入次数且无距离限制），然后你摸一张牌。" : "<span class=firetext>【劲发江潮落】</span></br>①你的回合内，你每使用三张牌可视为使用一张【杀】（不计入次数），若此【杀】造成了伤害，你摸一张牌。<br>②锁定技，当你本局游戏累计发动5次【我无】时，修改此技能。"
});

characterTitle("chongyuemrfz", "<font color=#FFF68F>玉门戍卫</font>");

characterIntro("chongyuemrfz", "重岳，留舰人员年、夕、令的兄长，与炎国兵部、司岁台等政府部门往来密切，此前担任移动城市玉门的武术教官，已卸任。因探视亲属来到罗德岛，经过审核，暂时凭访客身份驻留本舰。重岳具有丰富的战场经验，为罗德岛提供过独特的作战建议，但应凯尔希医生要求，重岳本人较少直接参加任务。");

function isChanged(player: Player): boolean {
	return player.storage.wowumrfz === true;
}

function getCount(player: Player, event: GameEvent, type: "useCard" | "respond" | "all"): number {
	let list:any[] = [];

	const filters:string[] = [];

	if(type === "useCard") filters.push("useCard");
	else if(type === "respond") filters.push("respond");
	else filters.push(...["useCard","respond"])

	const history = game.getAllGlobalHistory("everything", evt => filters.includes(evt.name) && evt.player == player, event);
	return history.length;
}
