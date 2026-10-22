import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_249_mlyss", { pack: "legendSJZX", sex: "female", group: "lymrfz", hp: 3, skills: ["yuanliumrfz", "shuilingmrfz", "xinjingshuimrfz"] });

const MARK = "yuanliumrfz";

skill({
	yuanliumrfz: {
		audio: ["部署1","部署2"],
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		forced:true,
		markimage: "extension/WhichWay/image/skill/miumiuliuxingmrfz.png",
		intro: {
			name: "流形",
			content: "#/3",
		},
		onremove:true,
		filter: function (event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const result = await player.chooseTarget({
				prompt:"【源流】:令一名角色摸两张牌，或选择“取消”令自己获得一个“流形”",
				ai(target) {
					if(get.attitude2(target)<0) return -1;
					return Math.random()>0.95 ? 1 : -1;
				},
				// forced:true
			}).forResult();

			const target = result.targets?.[0];

			if(target){
				await target.draw(2);
			} else{
				player.addMark(MARK);
			}
		},
		group: "yuanliumrfz_get",
		subSkill: {
			get: {
				audio:"yuanliumrfz",
				forced: true,
				trigger: {
					player: "phaseUseEnd",
				},
				filter: function (event, player) {
					return player.countMark(MARK)<3 && getTypes() > 0;
				},
				async content(event, trigger, player) {
					const dis = getTypes();
					const mark = player.countMark(MARK);
					const num = dis + mark > 3 ? 3 - mark : dis;
					player.addMark(MARK,num);
				},
			},
		},
	},
	xinjingshuimrfz: {
		audio: ["作战中1","作战中2","作战中3","作战中4"],
		trigger: {
			player: "useCardToPlayered",
		},
		usable: 1,
		filter: function (event, player) {
			const evt = event.getParent("phaseUse"),
				type = get.type(event.card);
			if (type != "basic" && type != "trick") return false;
			if (!evt || evt.player != player) return false;
			if (!player.hasMark(MARK)) return false;
			return event.targets && event.targets.length == 1;
		},
		prompt: function (event, player) {
			return "是否移除所有‘源流’并令【" + get.translation(event.card.name) + "】额外结算" + player.countMark(MARK) + "次？";
		},
		check: function (event, player) {
			return !get.tag(event.card, "norepeat");
		},
		async content(event, trigger, player) {
			let num = player.countMark(MARK);
			trigger.getParent()!.effectCount! += num;
			await player.draw(num);
			player.removeAllmark(MARK);
		},
	},
	shuilingmrfz: {
		mod:{
			maxHandcard(player, num) {
				return num += player.countMark(MARK);
			},
		},
		audio: ["精英化晋升2","观看作战记录"],
		forced: true,
		trigger: { player: "damageBegin3" },
		filter: function (event, player) {
			return !event.nature && player.countCards("h") >= player.hp;
		},
		async content(event, trigger, player) {
			trigger.num--;
			player.disableSkill("shuilingmrfz_used","shuilingmrfz");
			player.addTempSkill("shuilingmrfz_tips", "phaseEnd");
		},
		subSkill: {
			tips: {
				charlotte: true,
				mark: true,
				intro: {
					content: "·【水灵】失效",
				},
				onremove(player, type) {
					player.enableSkill("shuilingmrfz_used");
				},
			},
		},
	},
	//已废弃
	// kaiyuanmrfz: {
	// 	audio: 2,
	// 	trigger: {
	// 		global: "roundStart",
	// 	},
	// 	firstDo: true,
	// 	filter: function (event, player) {
	// 		return game.roundNumber == 1;
	// 	},
	// 	direct: true,
	// 	async content(event, trigger, player) {
	// 		let result;
	// 		result = await player
	// 			.chooseTarget("【开源】:请选择一名角色令其摸两张牌且本局游戏使用【杀】的次数 +1，若该角色是你，你摸一张牌", true)
	// 			.set("ai", target => {
	// 				return get.attitude(player, target) > 0;
	// 			})
	// 			.forResult();
	// 		if (result.targets) {
	// 			const target = result.targets[0];
	// 			await target.draw(2);
	// 			target.addSkill("kaiyuanmrfz_buff");
	// 			if (target === player) {
	// 				await player.draw();
	// 				player.logSkill("kaiyuanmrfz");
	// 			} else {
	// 				player.logSkill("kaiyuanmrfz", target);
	// 			}
	// 		}
	// 	},
	// 	subSkill: {
	// 		buff: {
	// 			mark: true,
	// 			intro: {
	// 				content: "使用【杀】的次数+1",
	// 			},
	// 			charlotte: true,
	// 			mod: {
	// 				cardUsable: function (card, player, num) {
	// 					if (card.name == "sha") return num + 1;
	// 				},
	// 			},
	// 		},
	// 	},
	// },
});

function getTypes():number{
	return new Set(get.discarded().filterInD("d").map(i=>get.type2(i))).size;
}

translate({
	char_249_mlyss: "缪尔赛思",
	yuanliumrfz: "源流",
	yuanliumrfz_info: `锁定技，游戏开始时，你令一名角色摸两张牌或令你获得一个“流形”;出牌阶段结束时，你获得X个“流形”标记（至多为3）。（X=${get.poptip("sjzx_centralArea")}内牌的类型数）`,
	xinjingshuimrfz: "净水",
	xinjingshuimrfz_info: "当你于出牌阶段使用的普通锦囊牌或基本牌指定唯一目标后，你可以令此牌额外结算Y次，然后你移除你所有的“流形”并摸Y张牌。（Y=你拥有的“流形”数）",
	shuilingmrfz: "水灵",
	shuilingmrfz_info: "锁定技，当你非属性受到伤害时，若你的手牌数不小于你的体力值，此伤害-1，然后【水灵】本回合失效;你的手牌上限+Y。（Y=你拥有的“流形”数）",

	//已废弃
	// kaiyuanmrfz: "源流",
	// kaiyuanmrfz_info: "锁定技，第一轮游戏开始时，你令一名角色摸两张牌且其本局游戏使用【杀】的次数+1，若该角色为你，你额外摸一张牌。",
});

characterTitle("char_249_mlyss", "<font color=#6575f1>孑然水灵</font>");

characterIntro("char_249_mlyss", "缪尔赛思，莱茵生命生态科主任，哥伦比亚生命科学与环境科学领域专家，在特里蒙事件中与罗德岛取得联系，后与罗德岛签订长期合作条款，与生物工程研究室开展多项联合科研项目，并作为先锋干员参与相关作战任务。");
