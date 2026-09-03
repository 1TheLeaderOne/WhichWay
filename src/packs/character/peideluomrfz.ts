import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "peideluomrfz";

/**
赴难：转换技：出牌阶段限一次或受到伤害后，你可以：
阳：摸一张牌并令一名角色失去一点体力
阴：回复一点体力并弃置一名角色一张牌。
若此时你的手牌数/体力值不为唯一值，则“赴难”视为未发动过/再发动一次各数值+1的“赴难”。
 */

character(NAME, {
	sex: "male",
	group: "bomrfz",
	pack: "epicSJZX",
	hp: 4,
	designer: ["Flandre"],
	skills: ["funanmrfz"],
});

characterTitle(NAME, whichWayUtil.colorize("#s觉悟的游击手#"));
characterIntro(NAME, "佩德洛，玻利瓦尔人。曾被数支不同的真正玻利瓦尔人部队征召，通常以游击队员或情报人员的身份参与作战。在玻利瓦尔大行军事件后离开真正玻利瓦尔人部队，现与罗德岛合作，协助部分情报工作。");

const green = whichWayUtil.colorize("#g一#");

translate({
	[NAME]: "佩德洛",

	funanmrfz: "赴难",
	funanmrfz_info: `转换技，出牌阶段限一次或受到伤害后，你可以：<br>阳：摸一张牌并对一名角色造成${green}点伤害;<br>阴：回复一点体力并弃置一名角色${green}张牌。<br>然后若场上没有其他角色与你的体力值和手牌数相同，本回合【赴难】描述中绿色的数字+1。`,
});

dynamicTranslate("funanmrfz", player => {
	return getText(player);
});

skill({
	funanmrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		// true -> 阴
		// false ->阳
		trigger: {
			player: "damageEnd",
		},
		intro: {
			content(storage, player, skill) {
				return `·${getText(player)}`;
			},
		},
		init(player, skill) {
			player.storage.funanmrfz_extra = 0;
            player.storage.funanmrfz = false;
		},
		onremove(player, type) {
			delete player.storage.funanmrfz_extra;
		},
		filter(event, player, name, target) {
			const isYang = player?.storage?.funanmrfz === false;
			if (isYang) return true;
			return !isYang && game.hasPlayer(char => player.countDiscardableCards(char, "he") > 0);
		},
		async cost(event, trigger, player) {
			const isYang = player?.storage?.funanmrfz === false;
			const num = get.cnNumber(1 + (player.storage.funanmrfz_extra || 0));
			const green = whichWayUtil.colorize(`#g${num}#`);
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("funanmrfz"),
					prompt2: `你可以${isYang ? `摸一张牌并对一名角色${green}造成伤害` : `回复一点体力并弃置一名角色${green}张牌`}，然后若场上没有其他角色与你的体力值和手牌数相同，本回合【赴难】描述中绿色的数字+1`,
					filterTarget(card, player, target) {
						return isYang ? true : player.countDiscardableCards(player, "he") > 0;
					},
					ai(target) {
						return isYang ? get.damageEffect(target, player, player) : get.attitude2(target) > 0 ? -1 : 1;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const isYang = player?.storage?.funanmrfz === false;
			const num = get.cnNumber(1 + (player.storage.funanmrfz_extra || 0));
			const green = whichWayUtil.colorize(`#g${num}#`);

			player.changeZhuanhuanji("funanmrfz");

			if (isYang) {
				await player.draw();
				await target.damage({
					source: player,
                    num:1 + (player.storage.funanmrfz_extra || 0)
				});
			} else {
				await player.recover();
				await player.discardPlayerCard({
					target: target,
					forced: true,
					prompt: `【赴难】:弃置${get.translation(target)}${green}张牌`,
					position: "he",
					selectButton: 1 + (player.storage.funanmrfz_extra || 0),
				});
			}

			let uniqueness = true;

			for (let char of game.players.slice()) {
				if (char === player) continue;
				if (char.countCards("h") === player.countCards("h") || char.hp === player.hp) {
					uniqueness = false;
					break;
				}
			}

			if (uniqueness) {
				player.storage.funanmrfz_extra ??= 0;
				player.storage.funanmrfz_extra += 1;
				player.when({ global: "phaseEnd" }).step(async (event, trigger, player) => {
                    const extra = player.storage.funanmrfz_extra;
                    if(typeof extra !== "number" || extra < 1) return;
					player.storage.funanmrfz_extra -= 1;
				});
			}
		},
		group: ["funanmrfz_phaseUse"],
		subSkill: {
			phaseUse: {
				audio: "funanmrfz",
				usable:1,
				enable: "phaseUse",
				filter(event, player, name, target) {
					const isYang = player?.storage?.funanmrfz === false;
					if (isYang) return true;
					return !isYang && game.hasPlayer(char => player.countDiscardableCards(char, "he") > 0);
				},
				filterTarget(card, player, target) {
					const isYang = player?.storage?.funanmrfz === false;
					return isYang ? true : player.countDiscardableCards(player, "he") > 0;
				},
				prompt(event, player) {
					const isYang = player?.storage?.funanmrfz === false;
					const num = get.cnNumber(1 + (player.storage.funanmrfz_extra || 0));
					const green = whichWayUtil.colorize(`#g${num}#`);
					return `你可以${isYang ? `摸一张牌并对一名角色${green}造成伤害` : `回复一点体力并弃置一名角色${green}张牌`}，然后若场上没有其他角色与你的体力值和手牌数相同，本回合【赴难】描述中绿色的数字+1`;
				},
                async content(event,trigger,player){
                    //@ts-ignore
                    await lib.skill["funanmrfz"].content(event,trigger,player);
                },
                ai:{
                    result:{
                        target(player, target, card) {
                            const isYang = player?.storage?.funanmrfz === false;
                            return isYang ? get.damageEffect(target, player, player) : get.attitude2(target) > 0 ? -1 : 1;
                        },
                    },
                },
			},
		},
	},
});

function getText(player: Player): string {
	const num = get.cnNumber(1 + (player.storage.funanmrfz_extra || 0));
	const green = whichWayUtil.colorize(`#g${num}#`);
	const isYang = player?.storage?.funanmrfz === false;
	if (isYang) {
		return `转换技，出牌阶段限一次或受到伤害后，你可以：<br>阳：摸一张牌并对一名角色造成${green}点伤害${whichWayUtil.colorize(`#s;<br>阴：回复一点体力并弃置一名角色${green}张牌#`)}。<br>然后若场上没有其他角色与你的体力值和手牌数相同，本回合【赴难】描述中绿色的数字+1。`;
	}
	return `转换技，出牌阶段限一次或受到伤害后，你可以：<br>${whichWayUtil.colorize(`#s阳：摸一张牌并对一名角色造成${green}点伤害;#`)}<br>阴：回复一点体力并弃置一名角色${green}张牌。<br>然后若场上没有其他角色与你的体力值和手牌数相同，本回合【赴难】描述中绿色的数字+1。`;
}
