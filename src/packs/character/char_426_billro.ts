import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_426_billro", { pack: "legendSJZX", sex: "female", group: "laimrfz", hp: 3, skills: ["shazhenmrfz", "shacanmrfz", "shahuanmrfz"] });

skill({
	shazhenmrfz: {
		audio: ["任命队长","选中干员2"],
		forced:true,
		trigger:{
			player:"damageBegin3"
		},
		mark:true,
		intro:{
			content(storage, player, skill) {
				if(player.getRoundHistory("sourceDamage").length>0){
					return `·沙暴散去<br>本轮已经造成过伤害`
				}
				return `·沙暴环绕<br>剩余次数：${2 - player.getRoundHistory("useSkill",evt=>evt.skill === "shazhenmrfz").length}`;
			},
		},
		filter(event, player, name, target) {
			return player.getRoundHistory("sourceDamage").length<1 && player.getRoundHistory("useSkill",evt=>evt.skill === "shazhenmrfz").length<=2 && event.num >= 1;
		},
		async content(event,trigger,player){
			trigger.num -= 1;
		},
		mod:{
			maxHandcard(player, num) {
				const isDamage = player.getRoundHistory("sourceDamage").length>0;
				return isDamage ? num : num += 2;
			},
		},
	},
	shacanmrfz: {
		marktext: "噬",
		intro: {
			name: "噬",
			content: function (storage, player, skill) {
				return "<span class=firetext>食噬之印</span>";
			},
		},
		onremove(player, type) {
			game.players.forEach(char=>char.removeAllmark("shacanmrfz",false));
		},
		trigger: { source: "damageEnd" },
		audio: ["行动开始","部署1"],
		filter: function (event, player) {
			return event.player.isAlive() && event.player.countMark("shacanmrfz") < 2;
		},
		prompt: function (event, player) {
			return "是否令" + get.translation(event.player) + "获得一个‘噬’标记";
		},
		check: function (event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			trigger.player.addMark("shacanmrfz");
		},
		group: ["shacanmrfz_gain"],
		subSkill: {
			gain: {
				trigger: { global: "phaseUseBegin" },
				filter: function (event, player) {
					return event.player.hasMark("shacanmrfz") && (player.getDamagedHp() > 0 || event.player.countCards("he") > 0);
				},
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					let target = trigger.player;
					let list:string[] = [];
					if (player.getDamagedHp() > 0) list.add("回血");
					if (target.countCards("he") > 0) list.add("交牌");
					const result = await target
						.chooseControl({controls:list})
						.set("prompt", "选择一项")
						.set("ai", function () {
							return list.randomGet();
						})
						.forResult();
					if (result.control == "回血") {
						player.recover();
						target.removeMark("shacanmrfz");
						player.logSkill("shacanmrfz");
						return;
					}
					if (result.control == "交牌") {
						const resultx = await target
							.chooseCard(
								{
									selectCard() {
										return target.countCards("he") > 1 ? 2 : 1
									},
									prompt:"展示两张牌",
									forced:true,
									position:"he",
									ai(card) {
										return - get.value(card);
									},
								}
							)
							.forResult();
						if (resultx.bool && resultx.cards && resultx.cards.length) {
							if (resultx.cards.length == 1) {
								player.gain(
									{
										cards:resultx.cards,
										animate:"give"
									}
								);
								player.logSkill("shacanmrfz");
								target.removeMark("shacanmrfz");
								return;
							} else {
								const resulty = await player
									.chooseButton({
										createDialog:["选择获得其中的一张牌", resultx.cards],
										forced:true
									})
									.set("ai", button => get.value(button.link))
									.forResult();
								player.gain({cards:resulty.links,animate:"give"});
								target.removeMark("shacanmrfz");
								player.logSkill("shacanmrfz");
							}
						}
					}
				},
			},
		},
	},
	shahuanmrfz: {
		audio: ["作战中1","作战中2"],
		enable: "phaseUse",
		usable: 1,
		filterTarget: function (card, player, target) {
			return target != player && target.countMark("shacanmrfz") < 1;
		},
		async content(event, trigger, player) {
			event.target.addMark("shacanmrfz");
		},
		ai: {
			order: 10,
			expose: 0.4,
			result: {
				target: -1,
			},
			threaten: 2,
		},
	},
});

translate({
	char_426_billro: "卡涅利安",
	shazhenmrfz: "沙阵",
	shazhenmrfz_info: "锁定技，若你本轮没有造成伤害，则你本轮前两次受到的伤害-1且你的手牌上限+2。",
	shacanmrfz: "沙喰",
	shacanmrfz_info: "①你对其他角色造成伤害时，你可以令其获得一个“噬”标记（每名角色至多拥有两个“噬”）。<br>②当有“噬”的角色出牌阶段开始时，其选择一项并移除其一个“噬”：1.令你观看其两张牌，然后你获得其中一张牌；2.令你回复一点体力。",
	shahuanmrfz: "沙环",
	shahuanmrfz_info: "出牌阶段，你可以令一名没有‘噬’标记的其他角色获得一个‘噬’。",
});

characterIntro("char_426_billro", "卡涅利安，出身萨尔贡深处不受王酋管辖的某个古老部族，目前外出游学中。因接受莱塔尼亚霍恩洛厄伯爵的雇佣，作为其侍从长期停留于莱塔尼亚地区。现与罗德岛达成合作关系，作为干员为罗德岛执行莱塔尼亚境内的相关任务。");

characterTitle("char_426_billro","沙暴守护者");