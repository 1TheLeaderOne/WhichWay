import { character, characterIntro, characterTitle, skill, translate } from "../../hooks.ts";
import { get, game, lib, ui, _status } from "noname";

character("botanimrfz", {
	hp: 3,
	skills: ["lingshengmrfz", "yingshengmrfz"],
	pack: "epicSJZX",
	group: "wumrfz",
	sex: "female",
});

translate({
	botanimrfz: "伯塔尼",

	lingshengmrfz: "聆声",
	lingshengmrfz_info: "当你成为其他角色使用牌的目标后，你可以同时观看牌堆顶和该角色手牌中的各一张牌，然后你选择一张牌获得之，若此牌来源是牌堆，本技能失效直到本回合结束。",
	yingshengmrfz: "应声",
	yingshengmrfz_info: "当你获得一名其他角色的手牌后，你可以视为对其使用一张【决斗】或【刮骨疗毒】，然后你与其之中体力值没有发生变化的角色摸一张牌。",
});

characterIntro("botanimrfz", "伯塔尼，原名季申娜·维克托罗夫娜·别利亚耶娃，曾就读于圣骏堡的帝国理工大学，肄业，经凛冬干员介绍加入罗德岛，继续学习和研究源石通讯技术，并参与外勤任务。");

characterTitle("botanimrfz", "<font color = #dfdcb1>昨日今日明日</font>");

type temp_data_yingshengmrfz = {
	player: Player;
	target: Player;
	hp: {
		player: number;
		target: number;
	};
};

skill({
	lingshengmrfz: {
		audio: ["选中干员1", "选中干员2", "部署1", "部署2"],
		trigger: {
			target: "useCardToTargeted",
		},
		filter(event, player, name, target) {
			return event.player && event.player.isIn() && event.player !== player;
		},
		prompt2(event, player) {
			if (event.player.countCards("h") <= 0) {
				return `你可以观看牌堆顶一张牌并获得之，然后此技能本回合失效`;
			}
			return `你可以同时观看牌堆顶和${get.translation(event.player)}手牌中的各一张牌，然后你选择一张牌获得之，若此牌来源是牌堆，本技能失效直到本回合结束。`;
		},
		async content(event, trigger, player) {
			const source = trigger.player;
			const cards: Card[] = [];

			const pileTops = get.cards();
			await game.cardsGotoOrdering(pileTops);
			cards.push(...pileTops);

			let answer: Card | undefined;
			if (source.countCards("h") > 0) {
				answer = source.getCards("h").randomGet();
				cards.push(answer);
			}

			const { links } = await player
				.chooseCardButton({
					prompt: "请选择获得一张牌",
					cards: cards,
					forced: true,
					ai(button) {
						const { player, targetx, answer } = event;
						if (player.hasSkillTag("viewHandcard", null, targetx, true) && answer !== undefined) {
							return button.link === answer ? 1 : 0;
						}
						return get.value(button.link, player);
					},
				})
				.set("answer", answer)
				.set("targetx", source)
				.forResult();

			if (!links) return;
			const card = links[0];
			player.gain({
				cards: [card],
				source: card === answer ? source : undefined,
				animate: "giveAuto",
			});
			if (card !== answer) {
				player.addTip("lingshengmrfz_ban", `【聆声】失效`, true);
				player.popup("破译失败");
				player.disableSkill("lingshengmrfz", ["lingshengmrfz"]);
				player
					.when({ global: "phaseEnd" })
					.step(async (event, trigger, player) => {
						player.enableSkill("lingshengmrfz");
					})
					.translation("聆声")
					.assign({
						mark: true,
						intro: {
							content: "·【聆声】失效直到本回合结束",
						},
					});
			} else {
				player.popup("破译成功");
			}
		},
	},
	yingshengmrfz: {
		audio: ["作战中1", "作战中3", "作战中4", "作战中2"],
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player, name, target) {
			const source = event.source;
			return source && source.isIn() && ["juedou","guaguliaodu"].some(c=>player.canUse(c,source));
		},
		async cost(event, trigger, player) {
			const source = trigger.source;

			let controls: string[] = [];
			if (player.canUse("juedou", source)) {
				controls.push("决斗");
			}
            if(player.canUse("guaguliaodu", source)){
                controls.push("刮骨疗毒");
            }

            controls = controls.randomSort();

            controls.push("cancel2");

			const result = await player
				.chooseControl({
					controls,
					prompt: get.prompt("yingshengmrfz"),
					prompt2: `你可以视为对${get.translation(trigger.target)}使用一张【决斗】或【刮骨疗毒】，然后你与其之中体力值没有发生变化的角色摸一张牌。`,
					ai(event, player) {
						const target: Player = get.event().targetx;
						if (get.attitude(player, target) > 0 && player.canUse("guaguliaodu", target)) {
							return "刮骨疗毒";
						}
						if (get.effect(target, get.autoViewAs({ name: "juedou" }), player, player) > 0 && player.canUse("juedou", target)) {
							return "决斗";
						}
						return "cancel2";
					},
				})
				.set("targetx", source)
				.set("canUseTao", canUseTao)
				.forResult();
			event.result = {
				...result,
				cost_data: result,
			};
		},
		async content(event, trigger, player) {
			const { control } = event.cost_data;
			const source = trigger.source;
			const card = get.autoViewAs({
				name: control === "决斗" ? "juedou" : "guaguliaodu",
				storage: {
					yingshengmrfz: {
						player: player,
						target: source,
						hp: {
							player: player.hp,
							target: source.hp,
						},
					} as temp_data_yingshengmrfz,
				},
			});
			await player
				.chooseUseTarget({
					forced: true,
					filterTarget(card, player, target) {
						return target === get.event().targetx;
					},
					card: card,
				})
				.set("targetx", source);
		},
		group: "yingshengmrfz_check",
		subSkill: {
			check: {
				charlotte: true,
				silent: true,
				trigger: {
					player: ["taoAfter", "guaguliaoduAfter"],
				},
				firstDo: true,
				filter(event, player, name, target) {
					return event.card.storage && event.card.storage.yingshengmrfz;
				},
				async content(event, trigger, player) {
					const data = trigger.card.storage.yingshengmrfz as temp_data_yingshengmrfz;
					const { hp, target, player: source } = data;
					if (target.hp === hp.target) {
						target.draw();
					}
					if (source.hp === hp.player) {
						source.draw();
					}
				},
			},
		},
	},
});

function canUseTao(player: Player, target: Player) {
	//@ts-ignore
	if ([target, player].includes(undefined)) {
		return false;
	}

	const card = new lib.element.Card().build("noclick").init(get.autoViewAs({ name: "tao" }));
	let mod = game.checkMod(card, player, target, "unchanged", "playerEnabled", player);
	if (mod == false) {
		return false;
	}
	mod = game.checkMod(card, player, target, "unchanged", "targetEnabled", target);
	if (mod !== "unchanged") {
		return mod ?? false;
	}

	return target.isDamaged();
}
