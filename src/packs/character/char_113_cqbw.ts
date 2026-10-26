import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_113_cqbw", { pack: "legendSJZX", sex: "female", group: "bamrfz", hp: 3, skills: ["fukemrfz", "zhumengmrfz3"] });

skill({
	fukemrfz: {
		trigger: {
			player: "gainAfter",
		},
		filter: function (event, player) {
			if (
				!game.hasPlayer(function (current) {
					return current != player && current.countCards("he") > 0;
				})
			)
				return false;
			return event.getParent(3)!.name != "fukemrfz";
		},
		audio: {
			"char_113_cqbw@epoque#7": ["编入队伍", "行动开始", "部署1", "部署2"],
		},
		async cost(event, trigger, player) {
			let num = trigger.cards.length;
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("fukemrfz"),
					prompt2: "获得至多" + get.translation(num) + "名角色的各一张牌，然后弃置等量的牌",
					filterTarget(card, player, target) {
						return target.countCards("he") > 0 && player != target;
					},
					ai(target) {
						let att = get.attitude(_status.event.player, target);
						if (target.hasSkill("tuntian")) return att / 10;
						return 1 - att;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			targets.sortBySeat();
			player.line(targets);
			await player.chooseToDiscard({
				//num2, true, "he"
				forced: true,
				position: "he",
				selectCard: targets.length,
				prompt: `【伏客】:弃置${get.cnNumber(targets.length)}张牌`,
			});
			player.gainMultiple(targets, "he");
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},
	//每轮开始时，你可以进行判定且当你本轮首次使用与判定牌花色、点数、类型一致的牌时，你摸一张牌。
	zhumengmrfz: {
		//戳一下
		audio: {
			"char_113_cqbw@epoque#7": ["戳一下"],
			default: ["戳一下", "问候"],
		},
		trigger: {
			global: "roundStart",
		},
		frequent: true,
		init: initStorage,
		lastDo:true,
		intro: {
			mark(dialog, storage, player, event, skill) {
				if (!storage) {
					dialog.addText(`特蕾西娅还没指令，先去烤个土豆吧！`);
					return;
				}
				dialog.addAuto(storage.card);
				let str: string[] = [];
				const used = storage.used;
				str.push(used.number === true ? "·已使用过相同点数的牌" : "·未使用过相同点数的牌");
				str.push(used.suit === true ? "·已使用过相同花色的牌" : "·未使用过相同花色的牌");
				str.push(used.type === true ? "·已使用过相同类型的牌" : "·未使用过相同类型的牌");
				for (let i of str) {
					dialog.addText(i);
				}
			},
		},
		onremove: true,
		mark:true,
		async content(event, trigger, player) {
			const result = await player.judge().forResult();
			if (!result.card) return;
			if (!player.storage.zhumengmrfz) initStorage(player);
			player.storage.zhumengmrfz.card = result.card;
			player.addTempSkill("zhumengmrfz_eff",{global:"roundEnd"});
		},
		subSkill: {
			eff: {
				audio: "zhumengmrfz",
				charlotte: true,
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player, name, target) {
					return getVaild(player,event).length > 0;
				},
				forced:true,
				onremove(player, type) {
					initStorage(player);
				},
				async content(event,trigger,player){
					await player.draw({num:player.storage.zhumengmrfz.count});
					player.storage.zhumengmrfz.count += 1;
					player.storage.zhumengmrfz[get.type2(trigger.card)] = true;
				},
			},
		},
	},
});

function getVaild(player: Player, event: GameEvent): string[] {
	const card: Card = player.getStorage("zhumengmrfz").card;
	return ["number", "type", "suit"].filter(method => {
		let func = get[method === "type" ? "type2" : method];
		if (func(event.card) !== func(card)) return false;
		return (
			player.getRoundHistory("useCard", evt => {
				return evt !== event && func(evt.card) === func(card);
			}).length < 1
		);
	});
}

function initStorage(player: Player, skill: string = "zhumengmrfz") {
	player.storage[skill] = {
		card: undefined,
		used: {
			number: false,
			type: false,
			suit: false,
		},
		count: 1,
	};
}

translate({
	char_113_cqbw: "W",
	fukemrfz: "伏客",
	fukemrfz_info: "当你不因【伏客】获得牌时，你可以选择至多X名其他角色并弃置等量的牌，然后获得这些角色各一张牌。（X=此次获得的牌的数量）",
	zhumengmrfz: "筑梦",
	zhumengmrfz_info: "每轮开始时，你可以进行判定且当你本轮首次使用与判定牌花色、点数、类型一致的牌时，你摸Y张牌，然后你令本轮Y+1。（Y=1）",
});

characterIntro("char_113_cqbw", "萨卡兹佣兵头目，W。曾参与卡兹戴尔漫长的内战，其小队以残暴而高效的作战手段闻名。在切尔诺伯格事件中与罗德岛发生冲突，后因为某些原因叛出整合运动，在凯尔希医生亲自进行了充分交涉后，与罗德岛签订战略合作条款。");

characterTitle("char_113_cqbw",whichWayUtil.colorize("#r遗愿焰火#"));