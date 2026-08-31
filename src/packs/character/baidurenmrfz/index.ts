import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("baidurenmrfz", {
			sex: "male",
			group: "mimrfz",
			hp: 4,
			skills: ["wenchoumrfz"],
		});

skill({
	"wenchoumrfz": {
			audio: ["作战中3", "作战中4", "作战中1", "作战中2"],
			trigger: {
				player: "phaseChange",
			},
			filter(event, player) {
				return player.countCards("he", card => player.canRecast(card)) > 0;
			},
			init(player, skill) {
				player.storage[skill] = 4;
			},
			onremove: true,
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard({position:"he"})
					.set("prompt", get.prompt("wenchoumrfz"))
					.set("prompt2", whichWayUtil.colorize(`你可以重铸一张牌,若你重铸的牌是：<br>①【杀】或武器牌：令包含你在内的至多两名角色将手牌调整至#r${player.storage.wenchoumrfz || 4}#并跳过此阶段；<br>②非伤害类基本牌：你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效，并令此技能中的红色数字-1。`))
					.set("ai", card => {
						const player = get.player(),
							num = player.storage.wenchoumrfz || 4,
							val = get.value(card);
						let res = 8 - val;
						if (get.subtype(card) === "equip1" || get.name(card) === "sha") {
							if (player.countCards("h") < num) res += 2;
							else res -= player.countCards("h") - num;

							if (game.hasPlayer(char => get.attitude2(char) > 0 && char.countCards("h") < num)) res += 2;
							if (game.hasPlayer(char => get.attitude2(char) < 0 && char.countCards("h") >= num)) res += 2;
						} else if (get.type(card) === "basic" && !get.tag(card, "damage")) {
							res -= 4 - num;
							let tmp_res = 0;
							for (const char of game.players) {
								tmp_res = Math.max(tmp_res, get.effect(char, { name: "sha" }, player, player));
							}
							res += tmp_res;
						}
						return res;
					})
					.set("filterCard", card => get.player().canRecast(card))
					.forResult();
			},
			async content(event, trigger, player) {
				const {
					cards: [card],
				} = event;
				if (!card) return;
				await player.recast(card);
				if (get.subtype(card) === "equip1" || get.name(card) === "sha") {
					//@ts-ignore
					player.skip(trigger.phaseList[trigger.num]);
					//@ts-ignore
					game.log(player, "跳过了", get.translation(trigger.phaseList[trigger.num]));
					const {
						//@ts-ignore
						targets: [target],
					} = await player
						.chooseTarget({forced:true,selectTarget:[0,1]})
						.set("prompt", whichWayUtil.colorize(`【问仇】：请选择一名其他角色，令其和#r你#将手牌调整至${player.storage.wenchoumrfz || 4}`))
						.set("prompt2", whichWayUtil.colorize(`#s或许，旧时的恩怨已经结束了#`))
						.set("filterTarget", lib.filter.notMe)
						.set(
							"ai",
							/**@param {Player} target */ target => {
								const player = get.player();
								const num = player.storage.wenchoumrfz || 4;
								const att = get.attitude2(target) > 0 ? 1 : -1;
								return att * (num - target.countCards("h"));
							}
						)
						.forResult();
					if (!target) return;
					[target, player].sort(lib.sort.seat).forEach(i => adjust(i));
					/**@param {Player} target */
					function adjust(target) {
						const num = player.storage.wenchoumrfz || 4;
						//@ts-ignore
						if (target.countCards("h") < num) target.drawTo(num);
						else if (target.countCards("h") > num) {
							target
								.chooseToDiscard({selectCard:target.countCards("h") - num,forced:true})
								.set("ai", card => -get.value(card))
								.set("prompt", `【问仇】：将手牌调整至${num}张`)
								.set("prompt2", whichWayUtil.colorize(`#s化干戈为玉帛，也是需要代价的#`));
						}
					}
				}
				if (get.type(card) === "basic" && !get.tag(card, "damage")) {
					await player.chooseUseTarget({card:get.autoViewAs({ name: "sha", isCard: true })}).set("forced", true).set("addCount", false).set("nodistance", true).set("prompt", "你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效").set("prompt2", whichWayUtil.colorize(`#s血债血偿！#`));
					player.storage.wenchoumrfz--;
					player.disableSkill("wenchoumrfz", ["wenchoumrfz"]);
					player.when({ global: "phaseEnd" }).step(async (event, trigger, player) => {
						//@ts-ignore
						player.enableSkill("wenchoumrfz");
					});
				}
			},
		},
});

translate({
	"baidurenmrfz": "摆渡人",
	"wenchoumrfz": "问仇",
	"wenchoumrfz_info": "你的任意阶段开始时，你可以重铸一张牌，若你重铸的牌是：<br>①【杀】或武器牌：令包含你在内的至多两名角色将手牌调整至#r4#并跳过此阶段；<br>②非伤害类基本牌：你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效，并令此技能中的红色数字-1。",
});

characterTitle("baidurenmrfz", "<font color = #a52a2a>血色旧往</font>");

characterIntro("baidurenmrfz", "赞索斯，移动城市雅赛努斯中特尔斐运河的前任渡口管理者，河流的摆渡人。在第一神殿的文物交换仪式之后辞去了这一职务，经干员调香师介绍来到罗德岛接受矿石病的治疗，以近卫干员的身份为罗德岛提供服务。");
