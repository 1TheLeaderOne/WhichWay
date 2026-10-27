import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_213_mostma", { pack: "legendSJZX", sex: "female", group: "lamrfz", hp: 3, skills: ["shishimrfz", "huanshimrfz","duxingmrfz"] });

skill({
	huanshimrfz: {
		audio: ["部署1", "部署2"],
		trigger: { player: "phaseEnd" },
		getNum: function () {
			let num = 0;
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name == "lose" && evt.type == "discard") num += evt.cards2.length;
				return false;
			});
			return num;
		},
		filter: function (event, player) {
			return (
				lib.skill.huanshimrfz.getNum() > 0 &&
				game.hasPlayer(function (target) {
					return target != player && !player.hasSkill("huanshimrfz_buff1");
				})
			);
		},
		async cost(event, trigger, player) {
			let num: number = lib.skill.huanshimrfz.getNum();
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("huanshimrfz"),
					prompt2: "你可以选择至多" + get.cnNumber(num) + "名角色令其下个回合内：①其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。",
					selectTarget: [1, num],
					filterTarget(card, player, target) {
						return target != player && !player.hasSkill("huanshimrfz_buff1");
					},
					ai(target) {
						return get.attitude2(target) < 0 ? Math.random() : -1;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			for (let i of targets) {
				i.addSkill(["huanshimrfz_buff1", "huanshimrfz_buff2"]);
				player.line(i);
			}
		},
		subSkill: {
			tmp: {
				silent: true,
				charlotte: true,
			},
			buff1: {
				audio: "huanshimrfz",
				charlotte: true,
				forced: true,
				trigger: { player: "useCardToPlayered" },
				filter: function (event, player) {
					if (player.hasSkill("huanshimrfz_tmp")) return false;
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					let cards: Card[] = [];
					for (let i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i], true) == "o") {
							cards.push(trigger.cards[i]);
						}
					}
					player.gain({ cards, animate: "gain2" });
					trigger.getParent()!.excluded.addArray(trigger.targets);
					player.addTempSkill("huanshimrfz_tmp", "phaseEnd");
				},
			},
			buff2: {
				onremove: true,
				mark: true,
				marktext: "缓",
				intro: {
					name: "主观缓时",
					content: "·行动受到限制<br>·每个回合内你使用的第一张【杀】指定目标时，取消之，然后你获得这张【杀】",
				},
				silent: true,
				charlotte: true,
				forced: true,
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					return player.hasSkill("huanshimrfz_buff1") || player.hasSkill("huanshimrfz_buff2");
				},
				async content(event, trigger, player) {
					player.removeSkill("huanshimrfz_buff1");
					player.removeSkill("huanshimrfz_buff2");
				},
			},
		},
	},
	shishimrfz:{
		audio:["作战中1","作战中2"],
		trigger:{
			player:"drawBegin"
		},
		filter(event, player, name, target) {
			return event.num > 0 && _status.currentPhase === player;
		},
		intro:{
			content(storage, player, skill) {
				return `·出牌阶段结束时弃置${get.cnNumber(storage)}张牌`
			},
		},
		prompt2(event, player) {
			return `当你从牌堆中获得牌时，你可以令此次获得的牌翻倍(翻倍后摸${get.cnNumber(event.num * 2)}张)，若如此做，你出牌阶段结束时弃置一张牌（可叠加）`
		},
		check:()=>true,
		async content(event,trigger,player){
			trigger.num *= 2;
			player.addMark("shishimrfz",1,false);
			player.addTempSkill("shishimrfz",{player:"phaseUseAfter"});
		},
		subSkill:{
			discard:{
				audio:"shishimrfz",
				charlotte:true,
				forced:true,
				onremove(player, type) {
					player.removeAllmark("shishimrfz",false);
					player.unmarkSkill("shishimrfz");
				},
				trigger:{
					player:"phaseUseEnd"
				},
				async content(event,trigger,player){
					const num = Math.min(player.countCards("he"),player.countMark("shishimrfz"));
					await player.chooseToDiscard({
						prompt:`【时匙】:请弃置${get.cnNumber(num)}张牌`,
						forced:true,
						selectCard:num,
						ai(card) {
							return - get.value(card);
						},
					});
				},
			},
		},
	},
	duxingmrfz:{
		audio:["精英化晋升1","任命队长"],
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		filter(event, player) {
			let cards = event.getg(player);
			if (!cards.length) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current === player) {
					return false;
				}
				return event.getl(current).cards2.length;
			});
		},
		async content(event,trigger,player){
			await player.discard({cards:trigger.cards.filterInD("h")});
		},
		mod:{
			canBeDiscarded(card, player,target) {
				if (get.position(card) == "he" && player !== target) {
					return false;
				}
			},
		},
		ai:{
			nogain: true,
		},
	},
});

translate({
	char_213_mostma: "莫斯提马",
	huanshimrfz: "缓时",
	huanshimrfz_info: "回合结束阶段，你可以选择至多X名其他角色，令其每个回合内其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。（X=本回合因弃置进入弃牌堆的牌的数量）",
	shishimrfz: "时匙",
	shishimrfz_info: "你的回合内，当你从牌堆中获得牌时，你可以令此次获得的牌翻倍，若如此做，你出牌阶段结束时弃置一张牌（可叠加）。",
	duxingmrfz: "独行",
	duxingmrfz_info: "锁定技，当你获得其他角色的牌后，弃置之;你的牌不能被其他角色弃置。",
});

characterIntro("char_213_mostma", "莫斯提马，企鹅物流员工，总是单独行动，此前履历不详。");

characterTitle("char_213_mostma", "荒时之锁");
