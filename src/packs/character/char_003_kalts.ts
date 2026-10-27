import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";

character("char_003_kalts", { pack: "legendSJZX", sex: "female", group: "luomrfz", hp: 3, skills: ["yuanlvemrfz", "chonggoumrfz", "yuanshimrfz", "fushengmrfz"], isZhugong: true });

skill({
	yuanlvemrfz: {
		audio: {
			default:["精英化晋升1"],
			"char_003_kalts@boc#6":["观看作战记录"]
		},
		trigger: { player: "drawBegin" },
		forced: true,
		filter: function (event, player) {
			return event.getParent(1) && event.getParent(1)!.name != "yuanlvemrfz";
		},
		async content(event, trigger, player) {
			let num = 0;
			if (!player.storage.yuanshimrfz || player.storage.yuanshimrfz_gain) {
				num = trigger.num;
			} else {
				num = trigger.num + 1;
			}
			if (trigger.parent && trigger.parent.name !== "phaseDraw") {
				player.chooseToGuanxing(num);
				player.draw(num);
			} else {
				player.chooseToGuanxing(num + 1);
				player.draw(num + 1);
			}
			trigger.cancel();
		},
	},
	chonggoumrfz: {
		intro: {
			content: "已修改【重构】。",
		},
		onremove: true,
		audio: {
			//精英化晋升2
			"char_003_kalts@boc#6":["精英化晋升2","作战中3"]
		},
		trigger: { player: "phaseDrawBegin2" },
		filter: function (event, player) {
			if (player.getDamagedHp() == 0 && !player.storage.chonggoumrfz) return false;
			return player.countCards("h") >= player.hp;
		},
		async content(event, trigger, player) {
			player.chooseToDiscard({
				//"h", player.countCards("h"), true
				selectCard() {
					return get.player().countCards("h")
				},
				forced:true
			});
			if (!player.storage.chonggoumrfz) {
				player.draw(player.countCards("h") - player.getDamagedHp());
			} else {
				player.draw(player.countCards("h"));
			}
			player.recover();
		},
	},
	yuanshimrfz: {
		intro: {
			content: "令【远略】中的X+1。",
		},
		onremove(player, type) {
			delete player.storage[type];
			delete player.storage.yuanshimrfz_chonggou;
		},
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		audio: {
			"char_003_kalts@boc#6":["编入队伍","作战中1"],
		},
		direct: true,
		filter: function (event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const hs = player.getCards("h");
			if (hs.length) player.addGaintag(hs, "yuanshimrfz");

			//重构流or远略流

			//人少走重构
			if(game.players.length <= 3 && game.zhu === player){
				player.storage.yuanshimrfz_chonggou = true;
				return;
			}

			//人多大概率有后期，走远略
			player.storage.yuanshimrfz_chonggou = Math.random() >= 0.8 ? true : false;
		},
		group: ["yuanshimrfz_effect", "yuanshimrfz_gain"],
		subSkill: {
			effect:{
				audio:"yuanshimrfz",
				trigger:{
					player:"useCard"
				},
				filter(event, player, name, target) {
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) return false;
						for (let i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
						}
						return false;
					});
				},
				prompt(event, player) {
					return `【渊识】:是否令${get.translation(event.card)}不可响应并摸一张牌？`;
				},
				check(){
					//走远略就不发动技能
					const player = get.player();
					return !!player.storage.yuanshimrfz_chonggou;
				},
				async content(event,trigger,player){
					await player.draw();
					trigger.directHit.addArray(game.players);
					player.storage.yuanshimrfz_gain = true;
				},
			},
			gain: {
				audio: "yuanshimrfz",
				trigger: { player: "loseAfter" },
				forced: true,
				filter: function (event, player) {
					if (player.storage.yuanshimrfz || player.storage.chonggoumrfz) return false;
					return !player.hasCard(function (card) {
						return card.hasGaintag("yuanshimrfz");
					}, "h");
				},
				async content(event, trigger, player) {
					if (!player.storage.yuanshimrfz_gain) {
						player.storage.yuanshimrfz = true;
						player.markSkill("yuanshimrfz");
					} else {
						player.storage.chonggoumrfz = true;
						player.markSkill("chonggoumrfz");
					}
				},
			},
		},
	},
	fushengmrfz: {
		audio: {
			default:"作战中3",
			"char_003_kalts@boc#6":["作战中2"],
		},
		trigger: {
			player: "dying",
		},
		zhuSkill: true,
		skillAnimation: true,
		animationColor: "red",
		mark: true,
		unique: true,
		limited: true,
		filter: function (event, player) {
			if (player.hp > 0) return false;
			return !player.storage.fushengmrfz;
		},
		init: (player, skill) => (player.storage[skill] = false),
		check: function (event, player) {
			let num = player.countCards("h", function (card) {
				return card.name == "tao" || card.name == "jiu";
			});
			return player.hp + num <= 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill("fushengmrfz");
			player.removeSkill("chonggoumrfz");
			player.discard({ cards: player.getCards("hej") });
			player.recoverTo(2);
			player.storage.fushengmrfz = true;
			player.loseMaxHp();
			player.turnOver(false);
			player.link(false);

			let targets = game.players.slice().remove(player);

			for (let target of targets) {
				const result = await target
					.chooseToDiscard({ prompt: `【复生】:你可以弃置一张牌并令${get.translation(player)}摸一张牌` })
					.set("ai", card => {
						const player = get.player();

						const targetx = get.event().targetx;
						if (get.attitude(player, targetx) < 0) return -1;
						return 114514 - get.value(card);
					})
					.set("targetx", player)
					.forResult();
				if (result.cards) {
					target.line(player);
					await player.draw();
				}
			}
		},
	},
});

translate({
	char_003_kalts: "凯尔希",
	yuanlvemrfz: "远略",
	yuanlvemrfz_info: "锁定技，当你不因【远略】从牌堆获得牌时，你改为卜算X，然后摸X张牌，若此时是摸牌阶段，则令X+1。（X=此次摸牌数）",
	chonggoumrfz: "重构",
	chonggoumrfz_info: "摸牌阶段开始时，若你的手牌数不小于你的体力值<span class=thundertext>且已受伤</span>，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量<span class=thundertext>-已损失体力值</span>）",
	yuanshimrfz: "渊识",
	yuanshimrfz_info: "①当你使用你的初始手牌时，你可以令此牌不可响应并摸一张牌。②锁定技，当你失去了你的所有初始手牌时，若你没有发动过【渊识①】，则你令【远略】中的X+1，否则，你删除【重构】描述中的蓝色部分。",
	// m3mrfz: "M3",
	// m3mrfz_info: "主公技，限定技，当你进入濒死状态时，你可以弃置区域内所有牌并复原武将牌、失去【重构】、减少一点体力上限，将体力恢复至2点，然后其他所有角色选择是否弃置一张牌并令你摸一张牌。",
	fushengmrfz: "复生",
	fushengmrfz_info: "主公技，限定技，当你进入濒死状态时，你可以弃置区域内所有牌并复原武将牌、失去【重构】、减少一点体力上限，将体力恢复至两点，然后其他所有角色选择是否弃置一张牌并令你摸一张牌。",
});

dynamicTranslate("chonggoumrfz", function (player) {
	if (player.storage.chonggoumrfz)
		return "摸牌阶段开始时，若你的手牌数不小于你的体力值，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量）";
	return "摸牌阶段开始时，若你的手牌数不小于你的体力值<span class=thundertext>且已受伤</span>，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量<span class=thundertext>-已损失体力值</span>）";
});

dynamicTranslate("yuanlvemrfz",player=>{
	if(player.storage.yuanshimrfz) return `锁定技，当你不因【远略】从牌堆获得牌时，你改为卜算X，然后摸X张牌，若此时是摸牌阶段，则令X+1。（X=此次摸牌数+1）`
	return `锁定技，当你不因【远略】从牌堆获得牌时，你改为卜算X，然后摸X张牌，若此时是摸牌阶段，则令X+1。（X=此次摸牌数）`;
})

characterTitle("char_003_kalts", "<font color=rgb(255,45,62)>旧日残影</font>");

characterIntro("char_003_kalts", "凯尔希，罗德岛高层管理人员之一，罗德岛医疗项目领头人。在冶金工业、社会学、源石技艺、考古学、历史系谱学、经济学、植物学、地质学等领域皆拥有渊博学识。于罗德岛部分行动中作为医务人员提供医学理论协助与应急医疗器械，同时也作为罗德岛战略指挥系统的重要组成人员活跃在各项目中。");
