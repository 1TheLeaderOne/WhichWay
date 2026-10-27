import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayFile } from "../../file.js";

character("char_147_shining", { pack: "legendSJZX", sex: "female", group: "shimrfz", hp: 4, skills: ["jiushumrfz", "lichangmrfz"] });

skill({
	lichangmrfz: {
		//出牌阶段限一次，你可以弃置一张非基本牌并选择X名角色，然后这些角色选择执行下列任意项并摸未执行项张牌：<br>1.获得一点护甲;<br>2.回复一点体力。（X=你的体力值）
		audio: ["精英化晋升1", "行动开始"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player, name, target) {
			return player.countCards("h", c => get.type(c) !== "basic") && player.hp > 0;
		},
		filterCard(card, player) {
			return get.type(card) !== "basic";
		},
		selectCard() {
			return 1;
		},
		filterTarget: () => true,
		selectTarget() {
			return [1, get.player().hp];
		},
		check(card: Card | VCard) {
			const player = get.player();
			return 10 - get.value(card, player);
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const { targets } = event;
			targets.forEach(i => i.addTempSkill("lichangmrfz_eff", { global: "roundEnd" }));
			//1.获得一点护甲;<br>2.回复一点体力
			const texts = ["获得一点护甲", "回复一点体力"];
			for (let target of targets.sortBySeat(player)) {
				let optionTexts = texts.slice();
				if (target.getDamagedHp() === 0) optionTexts[1] = "回复一点体力（不可选）";
				const dialogItems: any[] = [`【力场】:你可以选择执行任意项，然后摸没有执行项数的牌`];
				optionTexts.forEach((text, i) => {
					//每项一个容器 ⇒ 每行一项
					dialogItems.push([[[i, text]], "tdnodes"]);
				});
				const result = await target
					.chooseButton({
						createDialog: dialogItems,
						selectButton: [0, 2],
						filterButton(button, player) {
							const index = button.link;
							if (index === 1 && player.getDamagedHp() === 0) return false;
							return true;
						},
						ai(button) {
							const player = get.player();
							const link = button.link as number;
							if (link === 0) {
								if (player.hp < 2) return get.rand(-1, 3);
								return get.rand(-2, 2);
							}
							if (link === 1) {
								if (player.hp < 3) return get.rand(-1, 3);
								return get.rand(-2, 2);
							}
							return -1;
						},
					})
					.forResult();

				const picked = (result?.links || []) as number[];

				let draw_num = 2;
				if (picked.includes(0)) {
					await target.changeHujia(1, "gain", 5);
					draw_num--;
				}
				if (picked.includes(1)) {
					await target.recover();
					draw_num--;
				}
				await target.draw(draw_num);
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target, card) {
					let val = 0;
					if (get.attitude2(target) > 0) {
						return 0;
					}
					if (target === player) val += 2;
					if (target.hp < 3) val += 5;
					if (target.countCards("h") < 3) val += 3;
					if (target.hujia < 1) val += 0.5;
					if (target.hujia >= 3) val -= 3;
					return val + Math.random() * 5;
				},
				player:1,
			},
		},
		subSkill: {
			eff: {
				charlotte: true,
				markimage: whichWayFile.compilePath("skill:slmrfzimage.png"),
				mark: true,
				intro: {
					content(storage, player, skill) {
						if (player.hujia < 1) return `·你没有得到庇护！`;
						return `·你的手牌上限+${Math.min(player.hujia, 5)}`;
					},
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + Math.min(player.hujia, 5);
					},
				},
			},
		},
	},
	jiushumrfz: {
		audio: ["作战中1", "非3星结束行动"],
		enable: "chooseToUse",
		filter: function (event, player) {
			if (
				player.countCards("he", function (card) {
					return get.color(card) == "black";
				}) == 0
			)
				return false;
			return _status.currentPhase !== player;
		},
		filterCard: function (card) {
			return get.color(card) == "black";
		},
		viewAsFilter: function (player) {
			if (_status.currentPhase === player) return false;
			return player.countCards("he", { color: "black" }) > 0;
		},
		viewAs: { name: "wuxie" },
		position: "he",
		prompt: "将一张黑色牌当无懈可击使用",
		check: function (card) {
			let tri = _status.event.getTrigger();
			if (tri && tri.card && tri.card.name == "chiling") return -1;
			return 8 - get.value(card);
		},
	},
	// yubimrfz: {
	// 	audio:["作战中2","作战中3"],
	// 	init(player, skill) {
	// 		game.players.forEach(c=>c.markSkill("yubimrfz_eff"));
	// 	},
	// 	global: "yubimrfz_eff",
	// 	subSkill: {
	// 		eff: {
	// 			charlotte: true,
	// 			markimage: whichWayFile.compilePath("skill:slmrfzimage.png"),
	// 			mark:true,
	// 			onremove(player, type) {
	// 				game.players.forEach(c=>c.unmarkSkill("yubimrfz_eff"));
	// 			},
	// 			intro: {
	// 				content(storage, player, skill) {
	// 					if(player.hujia<1) return `·你没有得到庇护！`;
	// 					return `·你的手牌上限+${Math.min(player.hujia, 5)}`;
	// 				},
	// 			},
	// 			mod: {
	// 				maxHandcard: function (player, num) {
	// 					return num + Math.min(player.hujia, 5);
	// 				},
	// 			},
	// 		},
	// 	},
	// },
});

translate({
	char_147_shining: "闪灵",
	lichangmrfz: "力场",
	lichangmrfz_info: "出牌阶段限一次，你可以弃置一张非基本牌并选择X名角色，这些角色本轮手牌上限+Y且选择执行下列任意项并摸未执行项张牌：<br>1.获得一点护甲;<br>2.回复一点体力。（X=你的体力值;Y=其当前护甲值）",
	jiushumrfz: "救赎",
	jiushumrfz_info: "你的回合外，你可以将你的任意一张黑色牌当做【无懈可击】使用。",
	// yubimrfz: "御庇",
	// yubimrfz_info: "锁定技，场上所有角色的手牌上限+Y。（Y为其的护盾值，Y至多为5）",
});

characterIntro("char_147_shining", "闪灵，萨卡兹医师，前萨卡兹医疗组织“赦罪师”成员，感染者援助团体“使徒”的一员。于源石技艺、战场急救、医学理论、临床医学等领域拥有渊博知识。</br>现作为医疗干员为罗德岛医疗部门提供源石技艺理论，并为多项行动提供战场医疗救护服务。");

characterTitle("char_147_shining", "封剑执医");
