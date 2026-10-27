import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_180_amgoat", { pack: "legendSJZX", sex: "female", group: "laimrfz", hp: 3, skills: ["qingyanmrfz", "luanhuomrfz", "dianranmrfz"] });

skill({
	dianranmrfz: {
		audio: ["作战中2", "作战中3"],
		forced: true,
		trigger: {
			source: "damageBegin",
		},
		lastDo: true,
		filter(event, player, name, target) {
			return event.nature !== "fire";
		},
		async content(event, trigger, player) {
			trigger.nature = "fire";
			console.log(trigger);
		},
		group: ["dianranmrfz_draw"],
		subSkill: {
			draw: {
				audio: "dianranmrfz",
				forced: true,
				trigger: {
					player: "damageBegin4",
				},
				filter(event, player, name, target) {
					return event.nature === "fire" && event.num > 0;
				},
				async content(event, trigger, player) {
					await player.draw({ num: trigger.num });
					trigger.cancel();
				},
			},
		},
		ai: {
			nofire: true,
			effect: {
				target: function (card, player, target, current) {
					if (get.tag(card, "fireDamage")) return "zerotarget";
				},
			},
		},
	},
	//准备阶段，你可以对X名角色造成一点伤害，然后本回合你的额定摸牌数和手牌上限+X。（X=你本轮执行过的回合数）
	luanhuomrfz: {
		audio: ["任命队长", "作战中1"],
		mark: true,
		intro: {
			content(storage, player, skill) {
				const texts = [`·本轮此技能的使用数：${getCount(player)}`];
				if (player.hasSkill("luanhuomrfz_eff")) {
					texts.push(`·本回合手牌上限+${getCount(player)}`);
					texts.push(`本回合此额定摸牌数+${Math.min(2,getCount(player))}`);
				}
				return texts.join("<br>");
			},
		},
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		async cost(event, trigger, player) {
			const num = getCount(player) + 1;
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("luanhuomrfz"),
					prompt2: `你可以对至多${get.cnNumber(num)}名角色造成一点伤害，然后本回合你的额定摸牌数+${Math.min(2,num)}且手牌上限+${num}。`,
					filterTarget(card, player, target) {
						return true;
					},
					selectTarget: [1, num],
					ai(target) {
						const player = get.player();
						return get.damageEffect(target, player, player, player.hasSkill("dianranmrfz") ? "fire" : undefined);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			for (let t of targets) {
				player.line(t, "fire");
				await t.damage({ num: 1, source: player });
			}
			player.addTempSkill("luanhuomrfz_eff", { global: "phaseEnd" });
		},
		subSkill: {
			eff: {
				charlotte: true,
				forced: true,
				audio: "luanhuomrfz",
				mod: {
					maxHandcard(player, num) {
						return num + getCount(player);
					},
				},
				trigger: {
					player: "phaseDrawBegin2",
				},
				filter(event, player, name, target) {
					return !event.numFixed && getCount(player) > 0;
				},
				async content(event, trigger, player) {
					trigger.num += Math.min(2,getCount(player));
				},
			},
		},
	},
	qingyanmrfz: {
		audio: ["观看作战记录", "任命助理"],
		trigger:{
			player:"phaseUseEnd"
		},
		filter(event, player, name, target) {
			return new Set(player.getHistory("useCard",evt=>!!evt.card).map(evt=>get.type2(evt.card))).size >=3 && !player.hasSkill("qingyanmrfz_round");
		},
		check:()=>true,
		async content(event,trigger,player){
			player.insertPhase();

			player.addTempSkill("qingyanmrfz_round",{global:"roundBegin"});

			player.storage.qingyanmrfz_record = true;
			player.addTip("luanhuomrfz_tips",`勤研 额外回合`);
		},
		group:"qingyanmrfz_tips",
		subSkill:{
			round:{
				charlotte:true,
				mark:true,
				intro:{
					content:`·【勤研】本轮已发动`
				},
			},
			tips:{
				charlotte:true,
				silent:true,
				trigger:{
					player:"phaseBegin"
				},
				async content(event,trigger,player){
					player.addTempSkill("qingyanmrfz_record",{global:"phaseEnd"});
					player.markSkill("qingyanmrfz_record");
				},
			},
			record:{
				charlotte:true,
				silent:true,
				onremove(player, type) {
					player.removeTip("luanhuomrfz_tips");
					delete player.storage.qingyanmrfz_record;
				},
				trigger:{
					player:"useCardAfter"
				},
				intro:{
					content(storage, player, skill) {
						const types = Array.from(new Set(player.getHistory("useCard",evt=>!!evt.card).map(evt=>get.type2(evt.card))));
						if(types.length<1) return `·本回合没有使用过牌`
						return `·本回合已使用类别：${get.translation(types)}`;
					},
				},
				filter(event, player, name, target) {
					return player.storage.qingyanmrfz_record !== true;
				},
				async content(event,trigger,player){
					const types = Array.from(new Set(player.getHistory("useCard",evt=>!!evt.card).map(evt=>get.type2(evt.card))));
					player.addTip("luanhuomrfz_tips",`勤研 ${types.map(i=>get.translation(i)[0]).join("")}`);
				},
			},
		},
	},
});

function getCount(player: Player): number {
	return player.countRoundHistory("useSkill", evt => evt.skill === "luanhuomrfz");
}

translate({
	char_180_amgoat: "艾雅法拉",
	dianranmrfz: "点燃",
	dianranmrfz_info: "锁定技,你造成的伤害改为火属性伤害;当你受到火属性伤害时，取消之，然后摸等量张牌。",
	luanhuomrfz: "乱火",
	luanhuomrfz_info: "准备阶段，你可以对至多X名角色造成一点伤害，然后本回合你的额定摸牌数+X且手牌上限+Y。（X，Y均为本轮【乱火】发动次数，X至多为2）",
	qingyanmrfz: "勤研",
	qingyanmrfz_info: "每轮限一次，出牌阶段结束时，若你于本回合使用过至少三种类型的牌，你可以在本回合结束后额外执行一个仅回合。",
});

characterIntro("char_180_amgoat", "艾雅法拉，火山学家，天灾信使。于高等源石技艺、高能量法术释放等领域展现出了卓越的天赋。现于罗德岛接受治疗，同时为罗德岛提供天灾研究、环境观察与评估、危险地形航行保障等相关服务。");

characterTitle("char_180_amgoat", "学者之心");
