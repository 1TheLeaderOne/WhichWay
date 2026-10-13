import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("zhanchemrfz", { pack: "epicSJZX",
			sex: "male",
			group: "othermrfz",
			hp: 4,
			hujia: 2,
			skills: ["jiqiangmrfz","qingxiemrfz"],
		});

skill({
	"jiqiangmrfz": {
			audio: 2,
			derivation: ["DP27mrfz"],
			trigger: { global: "roundStart" },
			forced: true,
			filter: function (event, player) {
				return !player.isDisabled(1) && (event.name != "phase" || game.phaseNumber == 0);
			},
			async content(event, trigger, player) {
				const card = game.createCard("DP27mrfz", "diamond", 13);
				player.$gain2(card);
				game.delayx();
				player.equip(card);
			},
			group: "jiqiangmrfz_get",
			subSkill: {
				get: {
					audio: "jiqiangmrfz",
					forced: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return (
							!player.isDisabled(1) &&
							player.getCards("e", function (card) {
								return get.name(card) == "DP27mrfz";
							}).length == 0
						);
					},
					async content(event, trigger, player) {
						const card = game.createCard("DP27mrfz", "diamond", 13);
						player.$gain2(card);
						game.delayx();
						player.equip(card);
					},
				},
			},
		},
	"qingxiemrfz": {
			audio: 2,
			trigger: { player: "phaseDrawEnd" },
			firstDo: true,
			filter: function (event, player) {
				if (player.skipList.includes("phaseUse")) return false;
				return (
					game.countPlayer(function (current) {
						return player.inRangeOf(current) && current != player;
					}) > 0
				);
			},
			check: function (event, player) {
				if (get.value(player.getCards("h")) >= 10) return false;
				if (
					game.countPlayer(function (current) {
						return player.inRangeOf(current) && current != player && get.attitude(player, current) < 0;
					}) < 1
				)
					return false;
				return true;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				const next = player.chooseTarget("【倾泻】:请选择一名攻击范围内的其他角色", true, (card, target, player) => {
					return target !== player && player.inRangeOf(target);
				});
				next.ai = target => {
					return get.effect(target, { name: "sha" }, _status.event.player);
				};
				result = await next.forResult();

				event.num = 0;
				event.skip = 0;

				// step 1
				if (result.targets && result.targets.length) {
					event.target = result.targets[0];
				} else {
					return;
				}

				// step 2 & 3 loop (original event.goto(2))
				while (event.num < 3) {
					// step 2
					if (!event.target.isAlive()) {
						break;
					}

					const judgeEvent = player.judge(card => {
						const color = get.color(card);
						if (color === "red") return 4;
						return -4;
					});
					result = await judgeEvent.forResult();

					// step 3
					if (result.color === "red") {
						await player.useCard({ name: "sha", isCard: true }, false, event.target);
						event.skip++;
					}
					event.num++;
				}

				// step 4
				if (event.skip > 1) {
					player.skip("phaseUse");
				}
			},
		},
});

translate({
	"zhanchemrfz": "战车",
	"jiqiangmrfz": "机枪",
	"jiqiangmrfz_info": "锁定技，游戏开始时，你将【DP27】置入你的装备区；准备阶段，若你装备区没有【DP27】，你将【DP27】置入你的装备区",
	"qingxiemrfz": "倾泻",
	"qingxiemrfz_info": "摸牌阶段结束后，若你的出牌阶段将不会被跳过，你可以选择攻击范围内的一名其他角色，然后你进行三次判定，你对其使用等同于判定结果为红色的次数张【杀】（不计入次数限制），若你因此使用了至少两张【杀】，你跳过出牌阶段。",
});

characterIntro("zhanchemrfz", "战车，彩虹小队成员之一，强韧、爽朗且冷静，极为擅长阵地战。</br>主要武器为DP-28轻机枪以及SHUMIKHALAUNCHER“喧闹”发射器，他是整个小队的火力中心，毋庸置疑的战场主宰。");
