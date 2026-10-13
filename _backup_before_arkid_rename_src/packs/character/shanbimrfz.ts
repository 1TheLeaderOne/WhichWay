import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "shanbimrfz";

/**
 * 珊比 3/3 寻路前行
飞愿：使命技，回合开始时，你可以与一名其他角色各摸一张牌并拼点，赢的角色获得所有的拼点牌并可使用其中一张牌，若你没赢，你下次拼点的点数+2且本技能可于本回合结束阶段额外发动一次。。
成功：你累计3次拼点赢。每回合各限一次，你可以使用场上的包含“开始时”/“结束时”的技能。
咫行：锁定技：1.当你不因“咫行”而摸牌后，你令所有拥有“咫行”的角色制衡1，2.当你使命技成功后，你重置此技能。
 */

character(NAME, {
	hp: 3,
	group: "leimrfz",
	sex: "female",
	pack: "legendSJZX",
	skills: ["feiyuanmrfz", "zhixingmrfz"],
    designer:["Flandre"],
});

characterIntro(NAME, "珊比，来自雷姆必拓大涌泉镇，前来罗德岛接受矿石病治疗，并经由干员安洁莉娜的推荐，以及根据本人意愿，加入外勤部作为重装干员为罗德岛提供帮助。");
characterTitle(NAME, whichWayUtil.colorize("#b不一样的遗愿#"));

translate({
	[NAME]: "珊比",

	feiyuanmrfz: "飞愿",
	feiyuanmrfz_info: `使命技，回合开始时，你可以与一名其他角色各摸一张牌并拼点，赢的角色获得所有的拼点牌并可使用其中一张牌，若你没赢，你下次拼点的点数+2且本技能可于本回合结束阶段额外发动一次。<br>成功：拼点获胜：获得${get.poptip("xinfu_guanchao")}直到你的出牌阶段结束。`,
});

skill({
	feiyuanmrfz: {
		audio: ["作战中3", "作战中4"],
		dutySkill: true,
		trigger: {
			player: ["phaseBegin", "phaseJieshuBegin"],
		},
		filter(event, player, name, target) {
            console.log(event);
			if (event.name === "phaseJieshu") {
				return player.hasSkill("feiyuanmrfz_tryAgain");
			}
			return true;
		},
		intro: {
			content(storage, player, skill) {
				const extra = player.storage.feiyuanmrfz_extra || 0;
				return `·下次你拼点牌的点数+${extra}`;
			},
		},
		onremove(player, type) {
			if (player.storage.feiyuanmrfz_extra) {
				delete player.storage.feiyuanmrfz_extra;
			}
			if (player.hasSkill("feiyuanmrfz_tryAgain")) {
				player.removeSkill("feiyuanmrfz_tryAgain");
			}
		},
		init(player, skill) {
			game.broadcastAll(function () {
				let skills = ["xinfu_guanchao"];
				skills.forEach(skill2 => {
					let info = get.info(skill2);
					if (!info.audioname2) info.audioname2 = {};
					info.audioname2[player.name] = "feiyuanmrfz";
				});
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("feiyuanmrfz"),
					prompt2: `你可以与一名其他角色各摸一张牌并拼点，赢的角色获得所有的拼点牌并可使用其中一张牌，若你没赢，你下次拼点的点数+2且本技能可于本回合结束阶段额外发动一次`,
					filterTarget(card, player, target) {
						return player.canCompare(target,true,true);
					},
					ai(target) {
						let val = 0;
						const player = get.player();
						const extra = player.storage.feiyuanmrfz_extra || 0;
						const hands = player.getCards("h");
						const maxCards = whichWayUtil.filterArray(hands, (card, tools) => {
							return tools.isMax(get.number(card));
						});
						const max = get.number(maxCards[0]);
						if (get.attitude2(target) < 0) val += typeof max === "number" ? max + extra : 0;
						else val += get.rand(5, 10);
						return val;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (!target) return;
			await game.asyncDraw([player, target], 1);
			const result = await player.chooseToCompare(target).forResult();
			const winner = (result.winner as Player) || undefined;
			if(winner !== player) {
				player.storage.feiyuanmrfz_extra ??= 0;
				player.storage.feiyuanmrfz_extra += 2;
				player.markSkill("feiyuanmrfz");
				player.addTempSkill("feiyuanmrfz_tryAgain", { global: "phaseEnd" });
				player.markSkill("feiyuanmrfz_tryAgain");
			}
			if (!result || !winner) return;
            const compareCards = [result.player, result.target];
			await winner.gain({ cards: compareCards, animate: "gain2" });
			//@ts-ignore
            const cards = compareCards.filter(card => !!card && winner.hasUseTarget(card, true) && get.owner(card) === winner);
			if (cards.length > 0) {
				winner.chooseToUse({
					filterCard(card, player, event) {
						return cards.includes(card);
					},
					prompt: `【${get.translation("feiyuanmrfz")}】:你可以使用一张拼点牌`,
				});
			}
		},
		group: ["feiyuanmrfz_achieve", "feiyuanmrfz_extra"],
		subSkill: {
			achieve: {
				audio: "feiyuanmrfz",
				forced: true,
				trigger: {
					global: "chooseToCompareAfter",
				},
				filter(event, player, name, target) {
					if (event.preserve) {
						return false;
					}
					if (player != event.player && player != event.target && (!event.targets || !event.targets.includes(player))) {
						return false;
					}
					return event.result && event.result.winner === player;
				},
				async content(event, trigger, player) {
					game.log(player, "成功完成使命");
					player.awakenSkill("feiyuanmrfz");
                    player.addTempSkill("xinfu_guanchao",{player:"phaseUseEnd"});
				},
			},
			extra: {
				audio: false,
				silent: true,
				charlotte: true,
				trigger: {
					player: "compare",
					target: "compare",
				},
				filter(event, player) {
					const extra = player.storage.feiyuanmrfz_extra;
					return typeof extra === "number" && extra > 0;
				},
				async content(event, trigger, player) {
					if (player == trigger.target || !trigger.iwhile) {
						trigger[player == trigger.player ? "num1" : "num2"] += player.storage.feiyuanmrfz_extra;
						game.log(player, `的拼点牌点数+${player.storage.feiyuanmrfz_extra}`);
						player.storage.feiyuanmrfz_extra = 0;
						player.unmarkSkill("feiyuanmrfz");
					}
				},
			},
			tryAgain: {
				charlotte: true,
				silent: true,
				mark: true,
				onremove(player, type) {
					player.unmarkSkill("feiyuanmrfz_tryAgain");
				},
				intro: {
					content: `·本回合的回合结束阶段额外发动一次【飞愿】`,
				},
			},
		},
	},
});
